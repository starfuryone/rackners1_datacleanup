"""
Application configuration using Pydantic Settings
"""
from typing import List, Optional
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Application
    APP_NAME: str = "DataCleanup Pro"
    PROJECT_NAME: str = "DataCleanup Pro"
    VERSION: str = "1.0.0"
    API_VERSION: str = "v1"
    ENV: str = "development"
    ENVIRONMENT: str = "development"  # Alias for ENV
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    LOG_FILE: Optional[str] = None
    ALLOWED_HOSTS: str = "*"
    UPLOAD_PATH: Path = Path("/tmp/uploads")
    TEMP_PATH: Path = Path("/tmp/datacleanup")

    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_POOL_TIMEOUT: int = 30  # Seconds to wait for a connection from the pool
    DATABASE_POOL_RECYCLE: int = 1800  # Recycle connections after 30 minutes (prevents stale connections)

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_MAX_CONNECTIONS: int = 50
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"

    # Email (Brevo SMTP)
    SMTP_HOST: str = "smtp-relay.brevo.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: str = "no-reply@datacleanup.pro"
    SMTP_FROM_NAME: str = "DataCleanup Pro"
    SMTP_USE_TLS: bool = True

    # Legacy Brevo API (deprecated, use SMTP instead)
    BREVO_API_KEY: Optional[str] = None

    # Frontend
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    ALLOWED_ORIGINS: str = "http://localhost:3000,https://datacleanup.pro"

    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def parse_allowed_origins(cls, v: str) -> List[str]:
        """Parse comma-separated origins into list"""
        return [origin.strip() for origin in v.split(",")]

    # Storage (S3/DigitalOcean Spaces)
    S3_ENDPOINT: str = "https://nyc3.digitaloceanspaces.com"
    S3_BUCKET: str = "datacleanup-uploads"
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_REGION: str = "nyc3"
    S3_PUBLIC_URL: Optional[str] = None

    # AI Providers
    HUGGINGFACE_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    PERPLEXITY_API_KEY: Optional[str] = None

    # Stripe
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None

    # Stripe Price IDs
    STRIPE_PRICE_FREE: str = "price_free"
    STRIPE_PRICE_PREMIUM: str = "price_premium"  # $8.30/mo
    STRIPE_PRICE_PREMIUM_PLUS: str = "price_premium_plus"  # $14.60/mo

    # Rate Limiting
    RATE_LIMIT_STORAGE_URL: Optional[str] = None
    RATE_LIMIT_DEFAULT: str = "100/hour"
    RATE_LIMIT_AUTH: str = "10/minute"

    # Monitoring
    SENTRY_DSN: Optional[str] = None
    PROMETHEUS_PORT: int = 9090

    # OCR / Image Processing
    TESSERACT_PATH: str = "/usr/bin/tesseract"
    TESSERACT_LANG: str = "eng"
    MAX_IMAGE_SIZE_MB: int = 10
    ALLOWED_IMAGE_FORMATS: str = ".png,.jpg,.jpeg,.bmp,.tiff"

    @field_validator("ALLOWED_IMAGE_FORMATS")
    @classmethod
    def parse_image_formats(cls, v: str) -> List[str]:
        """Parse comma-separated formats into list"""
        return [fmt.strip() for fmt in v.split(",")]

    # Celery
    CELERY_WORKER_CONCURRENCY: int = 4
    CELERY_TASK_TIMEOUT: int = 300
    CELERY_MAX_RETRIES: int = 3

    # Features
    ENABLE_PDF_EXPORT: bool = True
    ENABLE_ADMIN_DASHBOARD: bool = True
    ENABLE_ANALYTICS: bool = False

    # Security
    PASSWORD_MIN_LENGTH: int = 8
    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_DURATION_MINUTES: int = 15

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.ENV == "production"

    @property
    def cors_origins(self) -> List[str]:
        """Get CORS origins as list"""
        if isinstance(self.ALLOWED_ORIGINS, str):
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
        return self.ALLOWED_ORIGINS


# Global settings instance
settings = Settings()
