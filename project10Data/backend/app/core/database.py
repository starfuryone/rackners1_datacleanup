"""
Database Configuration
SQLAlchemy 2.0 async engine and session management
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool, QueuePool

from app.core.config import settings

# Create async engine with optimized pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,  # Verify connections are alive before using them
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,  # Seconds to wait for connection
    pool_recycle=settings.DATABASE_POOL_RECYCLE,  # Recycle connections to avoid stale connections
    poolclass=QueuePool if not settings.DATABASE_URL.startswith("sqlite") else NullPool,
)

# Create async session factory
# Note: autocommit and autoflush are deprecated in SQLAlchemy 2.x
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Create declarative base for models with explicit name for debugging
Base = declarative_base(name="Base")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides a database session.

    The session automatically commits on success and rolls back on exception.
    The async context manager handles session cleanup automatically.

    Usage in FastAPI:
        @app.get("/users")
        async def get_users(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        # Note: No need to call session.close() - the context manager handles it


async def init_db() -> None:
    """
    Initialize database tables (development only).

    In production, always use Alembic for migrations instead.
    This function imports all models to ensure they are registered
    with the declarative base.
    """
    async with engine.begin() as conn:
        # Import all models to register them with Base
        from app.models import user, subscription, job, usage  # noqa: F401

        # Uncomment for development to auto-create tables
        # NEVER use this in production - use Alembic migrations instead
        # await conn.run_sync(Base.metadata.create_all)
        pass
