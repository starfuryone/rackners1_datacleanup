"""
Logging Configuration
Structured logging with JSON output for production

Features:
- Rotating file handlers to prevent log growth
- JSON formatting for production with exception tracebacks
- Human-readable formatting for development
- Absolute/relative path support for log files
- Request ID tracking for distributed tracing
"""

import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler
from typing import Any, Dict

from pythonjsonlogger import jsonlogger

from app.core.config import settings


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """
    Custom JSON formatter with structured exception tracebacks.

    Adds fields:
    - timestamp: ISO format timestamp
    - level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    - logger: Logger name
    - environment: Application environment (dev, staging, production)
    - request_id: Request ID (if available)
    - user_id: User ID (if available)
    - exception: Formatted exception traceback (if present)
    """

    def add_fields(
        self,
        log_record: Dict[str, Any],
        record: logging.LogRecord,
        message_dict: Dict[str, Any]
    ) -> None:
        """Add custom fields to log record"""
        super().add_fields(log_record, record, message_dict)

        # Add standard fields
        log_record["timestamp"] = self.formatTime(record, self.datefmt)
        log_record["level"] = record.levelname
        log_record["logger"] = record.name
        log_record["environment"] = settings.ENV

        # Add context fields if present
        if hasattr(record, "request_id"):
            log_record["request_id"] = record.request_id
        if hasattr(record, "user_id"):
            log_record["user_id"] = record.user_id

        # Add structured exception traceback
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)


def setup_logging() -> None:
    """
    Setup application logging configuration.

    Configures:
    - Console handler (always enabled)
    - Rotating file handler (if LOG_FILE configured)
    - Rotating error file handler
    - Third-party logger levels (uvicorn, sqlalchemy, celery)
    """

    # Determine log level
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True, parents=True)

    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Remove existing handlers (safer than handlers.clear())
    for handler in list(root_logger.handlers):
        root_logger.removeHandler(handler)

    # Create formatters once for reuse
    json_formatter = CustomJsonFormatter(
        "%(timestamp)s %(level)s %(logger)s %(message)s"
    )
    text_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Select formatter based on environment
    formatter = json_formatter if settings.ENV == "production" else text_formatter

    # Console handler (always enabled)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    # Rotating file handler (optional, configured via LOG_FILE setting)
    if settings.LOG_FILE:
        # Handle both absolute and relative paths
        log_path = Path(settings.LOG_FILE)
        if not log_path.is_absolute():
            log_path = log_dir / log_path

        # Ensure parent directory exists
        log_path.parent.mkdir(parents=True, exist_ok=True)

        # Create rotating handler (10MB max, 5 backup files)
        file_handler = RotatingFileHandler(
            log_path,
            maxBytes=10 * 1024 * 1024,  # 10 MB
            backupCount=5,
        )
        file_handler.setLevel(log_level)
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)

    # Rotating error file handler (5MB max, 3 backup files)
    error_log_path = log_dir / "error.log"
    error_log_path.parent.mkdir(parents=True, exist_ok=True)

    error_handler = RotatingFileHandler(
        error_log_path,
        maxBytes=5 * 1024 * 1024,  # 5 MB
        backupCount=3,
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    root_logger.addHandler(error_handler)

    # Configure third-party loggers
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.DEBUG else logging.WARNING
    )
    logging.getLogger("celery").setLevel(logging.INFO)

    # Log startup message
    logger = logging.getLogger(__name__)
    logger.info(
        "✅ Logging configured successfully",
        extra={
            "level": logging.getLevelName(log_level),
            "environment": settings.ENV,
            "debug": settings.DEBUG,
            "format": "json" if settings.ENV == "production" else "text",
        }
    )


# Create logger instance
logger = logging.getLogger("datacleanup")
