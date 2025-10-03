"""
Production overlay for DataCleanup.pro
Stricter defaults and runtime validation for safety.
"""
import logging
from pathlib import Path
from typing import Dict, Any

from app.core.config_enhanced import Settings, Environment

logger = logging.getLogger(__name__)


class ProductionConfigError(RuntimeError):
    """Custom exception for production configuration errors."""
    pass


class ProdSettings(Settings):
    """Production-hardened settings with enforced security policies."""

    # ========================================================================
    # Hard overrides - cannot be changed in production
    # ========================================================================
    ENVIRONMENT: Environment = Environment.PRODUCTION
    DEBUG: bool = False
    DB_ECHO: bool = False
    SESSION_COOKIE_SECURE: bool = True
    SESSION_COOKIE_SAMESITE: str = "strict"  # Stricter than base 'lax'
    LOG_FORMAT: str = "json"
    USE_MASTER_SECRET: bool = False
    API_RELOAD: bool = False

    # Tighter production limits
    MAX_UPLOAD_SIZE: int = 26_214_400  # 25MB (reduced from 50MB)
    DB_POOL_TIMEOUT: int = 20  # Reduced from 30s

    # ========================================================================
    # Production validation
    # ========================================================================

    def validate_production(self) -> None:
        """
        Critical runtime checks. Raises RuntimeError on failure.
        These complement the Pydantic validators in the base Settings class.
        """
        logger.info("[PRODUCTION CONFIG] Running production validation checks...")

        # Environment check
        self._must(
            self.ENVIRONMENT == Environment.PRODUCTION,
            "ENVIRONMENT must be 'production'"
        )

        # Security basics
        self._must(not self.DEBUG, "DEBUG must be False")
        self._must(not self.DB_ECHO, "DB_ECHO must be False")
        self._must(not self.API_RELOAD, "API_RELOAD must be False")
        self._must(self.SESSION_COOKIE_SECURE, "SESSION_COOKIE_SECURE must be True")
        self._must(
            self.SESSION_COOKIE_SAMESITE in {"lax", "strict"},
            "SESSION_COOKIE_SAMESITE must be 'lax' or 'strict'"
        )

        # Logging
        self._must(
            self.LOG_FORMAT == "json",
            "LOG_FORMAT must be 'json' for structured logging"
        )

        # Frontend must use HTTPS
        self._must(
            self.FRONTEND_ORIGIN.startswith("https://"),
            f"FRONTEND_ORIGIN must use HTTPS in production. Got: {self.FRONTEND_ORIGIN}"
        )

        # CORS validation
        self._must(
            "*" not in self.BACKEND_CORS_ORIGINS,
            "CORS wildcard '*' not allowed in production"
        )

        # CORS origins must use HTTPS (except localhost for staging/testing)
        for origin in self.BACKEND_CORS_ORIGINS:
            # Allow http://localhost for local development/testing
            if origin.startswith("http://localhost"):
                continue
            # Block http://127.0.0.1 and other non-HTTPS origins
            self._must(
                origin.startswith("https://"),
                f"CORS origin must use HTTPS in production. Got: {origin}"
            )

        # Secrets uniqueness (normalize SecretStr before comparison)
        # Convert to strings to handle both str and SecretStr types
        keys = [
            str(self.SECRET_KEY),
            str(self.JWT_SECRET_KEY),
            str(self.SESSION_SECRET_KEY),
            str(self.CSRF_SECRET_KEY),
        ]
        # Filter out empty strings
        secrets = [k for k in keys if k]
        self._must(
            len(set(secrets)) == len(secrets),
            "All secret keys must be unique"
        )

        # Billing validation with format checks
        if self.BILLING_ENABLED:
            required_keys = [
                "STRIPE_SECRET_KEY",
                "STRIPE_PUBLISHABLE_KEY",
                "STRIPE_WEBHOOK_SECRET",
            ]
            for key_name in required_keys:
                key_value = getattr(self, key_name)
                self._must(
                    key_value,
                    f"{key_name} must be set when BILLING_ENABLED=True"
                )

            # Stripe key format validation
            stripe_secret = str(self.STRIPE_SECRET_KEY) if self.STRIPE_SECRET_KEY else ""
            stripe_public = str(self.STRIPE_PUBLISHABLE_KEY) if self.STRIPE_PUBLISHABLE_KEY else ""
            stripe_webhook = str(self.STRIPE_WEBHOOK_SECRET) if self.STRIPE_WEBHOOK_SECRET else ""

            if stripe_secret and not stripe_secret.startswith("sk_live_"):
                logger.warning("⚠️ STRIPE_SECRET_KEY does not look like a live key (should start with 'sk_live_')")

            if stripe_public and not stripe_public.startswith("pk_live_"):
                logger.warning("⚠️ STRIPE_PUBLISHABLE_KEY does not look like a live key (should start with 'pk_live_')")

            if stripe_webhook and not stripe_webhook.startswith("whsec_"):
                logger.warning("⚠️ STRIPE_WEBHOOK_SECRET does not look like a valid webhook secret (should start with 'whsec_')")

        # Database URL check
        self._must(
            bool(str(self.DATABASE_URL)),
            "DATABASE_URL must be configured"
        )

        # Redis URL check
        self._must(
            bool(str(self.REDIS_URL)),
            "REDIS_URL must be configured"
        )

        # Warning-level checks (non-blocking)
        warnings = []

        if not self.SENTRY_DSN:
            warnings.append("Sentry DSN not configured - errors won't be tracked")

        if not self.has_ai_providers:
            warnings.append("No AI providers configured - AI features will be disabled")

        if not self.has_email:
            warnings.append("Email not configured - email notifications disabled")

        if not self.METRICS_ENABLED:
            warnings.append("Metrics disabled - no Prometheus monitoring")

        # Log warnings
        for warning in warnings:
            logger.warning(f"⚠️ {warning}")

        logger.info("[PRODUCTION CONFIG] ✅ All production checks passed")

    def _must(self, condition: bool, message: str) -> None:
        """Raise ProductionConfigError if condition is not met."""
        if not condition:
            raise ProductionConfigError(f"[PRODUCTION CONFIG] {message}")

    # ========================================================================
    # Production-optimized configuration helpers
    # ========================================================================

    @property
    def security_headers(self) -> Dict[str, str]:
        """Generate recommended security headers for production middleware."""
        return {
            # HSTS: Force HTTPS for 2 years
            "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",

            # Prevent MIME sniffing
            "X-Content-Type-Options": "nosniff",

            # Prevent clickjacking
            "X-Frame-Options": "DENY",

            # Enable XSS protection
            "X-XSS-Protection": "1; mode=block",

            # CSP (Content Security Policy)
            # NOTE: Currently allows 'unsafe-inline' and 'unsafe-eval' for Stripe JS
            # TODO: Remove 'unsafe-eval' and 'unsafe-inline' once you can use:
            #   - script-src with specific hashes/nonces for inline scripts
            #   - CSP Level 3 'strict-dynamic' for better security
            # For now, this is necessary for Stripe Elements to work properly
            "Content-Security-Policy": (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "connect-src 'self' https://api.stripe.com; "
                "frame-src https://js.stripe.com; "
                "frame-ancestors 'none';"
            ),

            # Referrer policy
            "Referrer-Policy": "strict-origin-when-cross-origin",

            # Permissions policy
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
        }

    @property
    def database_production_config(self) -> Dict[str, Any]:
        """Production-optimized database configuration."""
        return {
            "url": str(self.DATABASE_URL),
            "echo": False,
            "pool_size": self.DB_POOL_SIZE,
            "max_overflow": self.DB_MAX_OVERFLOW,
            "pool_timeout": self.DB_POOL_TIMEOUT,
            "pool_recycle": self.DB_POOL_RECYCLE,
            "pool_pre_ping": True,
            "pool_use_lifo": True,  # Better connection reuse
        }

    @property
    def celery_production_config(self) -> Dict[str, Any]:
        """Production-optimized Celery configuration."""
        return {
            "broker_url": self.CELERY_BROKER_URL,
            "result_backend": self.CELERY_RESULT_BACKEND,
            "task_serializer": self.CELERY_TASK_SERIALIZER,
            "result_serializer": self.CELERY_RESULT_SERIALIZER,
            "accept_content": self.CELERY_ACCEPT_CONTENT,
            "timezone": self.CELERY_TIMEZONE,
            "enable_utc": self.CELERY_ENABLE_UTC,

            # Production optimizations
            "worker_prefetch_multiplier": 4,
            "worker_max_tasks_per_child": self.CELERY_WORKER_MAX_TASKS_PER_CHILD,
            "task_acks_late": True,
            "task_reject_on_worker_lost": True,
            "task_time_limit": self.CELERY_TASK_TIME_LIMIT,
            "task_soft_time_limit": self.CELERY_TASK_SOFT_TIME_LIMIT,

            # Reliability
            "broker_connection_retry_on_startup": True,
            "broker_connection_max_retries": 10,

            # Task routes
            "task_routes": self.CELERY_TASK_ROUTES,
        }


# ============================================================================
# Production Settings Singleton
# ============================================================================

def load_production_settings() -> ProdSettings:
    """
    Load and validate production settings.

    Raises:
        ProductionConfigError: If production requirements are not met
        ValueError: If Pydantic validation fails

    Returns:
        Validated ProdSettings instance
    """
    try:
        # This triggers Pydantic validators (unique secrets, billing keys, etc.)
        settings = ProdSettings()

        # Run additional runtime checks
        settings.validate_production()

        return settings

    except Exception as e:
        logger.critical(
            "🚨 CRITICAL: Cannot start application with invalid production settings: %s",
            e,
            exc_info=True
        )
        raise


# Singleton instance - will crash on import if config is invalid
# This is intentional - we don't want to run with misconfigured production settings
try:
    prod_settings = load_production_settings()

    # Ensure critical directories exist after validation
    # Container-safe: gracefully handle read-only filesystems
    directory_configs = [
        ("UPLOAD_PATH", prod_settings.UPLOAD_PATH),
        ("TEMP_PATH", prod_settings.TEMP_PATH),
    ]

    # Add LOG_FILE parent directory if configured
    if prod_settings.LOG_FILE:
        directory_configs.append(("LOG_FILE (parent)", prod_settings.LOG_FILE.parent))

    for path_name, path in directory_configs:
        if path:
            try:
                path.mkdir(parents=True, exist_ok=True)
                logger.debug(f"✓ Directory ensured: {path_name} -> {path}")
            except PermissionError as e:
                logger.error(
                    f"❌ Failed to create directory for {path_name}: {path} (Permission denied). "
                    f"Running in read-only filesystem? Error: {e}"
                )
                raise ProductionConfigError(
                    f"Cannot create required directory {path_name}: {path}. "
                    f"Check filesystem permissions or mount points."
                ) from e
            except Exception as e:
                logger.error(
                    f"❌ Failed to create directory for {path_name}: {path}. Error: {e}"
                )
                raise ProductionConfigError(
                    f"Cannot create required directory {path_name}: {path}"
                ) from e

    logger.info("✅ Production settings loaded and validated successfully")

except ProductionConfigError:
    # Re-raise production config errors as-is
    logger.critical("🚨 Application cannot start with invalid production configuration")
    raise
except Exception as e:
    # Wrap other exceptions for clarity
    logger.critical(
        "🚨 Application cannot start due to configuration error: %s",
        e,
        exc_info=True
    )
    raise


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    "ProdSettings",
    "prod_settings",
    "load_production_settings",
    "ProductionConfigError",
]
