"""
DataCleanup.pro - Main FastAPI Application
Production-ready with OpenAPI spec generation, security, and monitoring
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import asyncio
import logging
from typing import Optional

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import engine
from app.core.celery_app import celery_app
from app.core.logging import setup_logging, logger
from app.core.security import get_rate_limiter
from app.api.v1.router import api_router

# Setup logging
setup_logging()


async def check_celery_workers() -> Optional[int]:
    """Check Celery workers without blocking the event loop"""
    try:
        loop = asyncio.get_event_loop()

        # Run blocking Celery operations in thread pool
        def _inspect():
            return celery_app.control.inspect()

        def _get_active(inspect_obj):
            return inspect_obj.active() if inspect_obj else None

        inspect = await loop.run_in_executor(None, _inspect)
        active_workers = await loop.run_in_executor(None, _get_active, inspect)

        return len(active_workers) if active_workers else 0
    except Exception as e:
        logger.warning(f"Celery check failed: {e}")
        return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown"""

    # Critical vs optional services
    CRITICAL_SERVICES = ['database', 'redis']
    OPTIONAL_SERVICES = ['celery']
    failed_critical = []

    # Startup
    logger.info("🚀 Starting DataCleanup.pro API", extra={
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG
    })

    # Create upload directories
    settings.UPLOAD_PATH.mkdir(parents=True, exist_ok=True)
    settings.TEMP_PATH.mkdir(parents=True, exist_ok=True)

    # Test database connection (CRITICAL)
    try:
        async with engine.begin() as conn:
            from sqlalchemy import text
            await conn.execute(text("SELECT 1"))
        logger.info("✅ Database connection established")
    except Exception as e:
        logger.error("❌ Database connection failed", extra={"error": str(e)})
        failed_critical.append('database')

    # Test Redis connection (CRITICAL)
    try:
        from app.core.redis import redis_client
        await redis_client.ping()
        logger.info("✅ Redis connection established")
    except Exception as e:
        logger.error("❌ Redis connection failed", extra={"error": str(e)})
        failed_critical.append('redis')

    # Check if critical services failed
    if failed_critical:
        logger.error(f"Critical services failed: {failed_critical}")
        raise RuntimeError(f"Cannot start: {', '.join(failed_critical)} unavailable")

    # Test Celery connection (OPTIONAL - non-blocking)
    worker_count = await check_celery_workers()
    if worker_count is not None:
        logger.info(f"✅ Celery connection established ({worker_count} workers)")
    else:
        logger.warning("⚠️ Celery workers not available (optional service)")

    yield

    # Shutdown
    logger.info("🛑 Shutting down DataCleanup.pro API")

    # Close database connections
    await engine.dispose()

    # Close Redis connections
    try:
        from app.core.redis import redis_client
        await redis_client.close()
    except Exception:
        pass


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Spreadsheet Cleaning and Data Processing API",
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
    openapi_tags=[
        {"name": "health", "description": "Health check endpoints"},
        {"name": "auth", "description": "Authentication and authorization"},
        {"name": "assistant", "description": "AI assistant features"},
        {"name": "users", "description": "User management"},
        {"name": "billing", "description": "Billing and subscriptions"},
        {"name": "usage", "description": "Usage tracking and analytics"},
    ]
)


# ============================================================================
# Middleware
# ============================================================================

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
)

# GZip Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Trusted Host Middleware (only in production)
if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )


# Request ID Middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Add unique request ID to all requests"""
    import uuid
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

    # Add to request state
    request.state.request_id = request_id

    # Process request
    response = await call_next(request)

    # Add to response headers
    response.headers["X-Request-ID"] = request_id

    return response


# Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all HTTP requests"""
    import time

    start_time = time.time()

    # Process request
    response = await call_next(request)

    # Calculate duration
    duration = time.time() - start_time

    # Log request
    logger.info(
        f"{request.method} {request.url.path}",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration": f"{duration:.3f}s",
            "request_id": getattr(request.state, "request_id", None),
            "user_agent": request.headers.get("user-agent"),
            "ip": request.client.host if request.client else None,
        }
    )

    return response


# ============================================================================
# Exception Handlers
# ============================================================================

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "request_id": getattr(request.state, "request_id", None),
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
            "request_id": getattr(request.state, "request_id", None),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(
        "Unhandled exception",
        extra={
            "error": str(exc),
            "type": type(exc).__name__,
            "request_id": getattr(request.state, "request_id", None),
        },
        exc_info=True
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error" if not settings.DEBUG else str(exc),
            "request_id": getattr(request.state, "request_id", None),
        },
    )


# ============================================================================
# Routes
# ============================================================================

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["health"])
async def root():
    """Root endpoint"""
    return {
        "message": "DataCleanup.pro API",
        "version": settings.VERSION,
        "docs": "/docs" if settings.DEBUG else None,
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/health/detailed", tags=["health"])
async def detailed_health_check():
    """Detailed health check with service status"""
    health_status = {
        "status": "healthy",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {}
    }

    # Check database
    try:
        async with engine.begin() as conn:
            from sqlalchemy import text
            await conn.execute(text("SELECT 1"))
        health_status["services"]["database"] = "healthy"
    except Exception as e:
        health_status["services"]["database"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"

    # Check Redis
    try:
        from app.core.redis import redis_client
        await redis_client.ping()
        health_status["services"]["redis"] = "healthy"
    except Exception as e:
        health_status["services"]["redis"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"

    # Check Celery workers (non-blocking)
    worker_count = await check_celery_workers()
    if worker_count is not None:
        health_status["services"]["celery"] = f"healthy ({worker_count} workers)"
    else:
        health_status["services"]["celery"] = "unhealthy: unable to connect"
        health_status["status"] = "degraded"

    return health_status


@app.get("/metrics", tags=["health"], include_in_schema=False)
async def metrics():
    """
    Prometheus metrics endpoint

    Install: pip install prometheus-fastapi-instrumentator
    Then add after app creation:
        from prometheus_fastapi_instrumentator import Instrumentator
        Instrumentator().instrument(app).expose(app, endpoint="/metrics")
    """
    return {
        "message": "Metrics endpoint",
        "note": "Install prometheus-fastapi-instrumentator to enable Prometheus metrics"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info" if not settings.DEBUG else "debug",
    )
