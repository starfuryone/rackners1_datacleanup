"""
Logging Configuration
Structured logging with JSON output for production
"""

import logging
import sys
from pathlib import Path
from typing import Any, Dict

from pythonjsonlogger import jsonlogger

from app.core.config import settings


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter with additional fields"""

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

        # Add extra fields if present
        if hasattr(record, "request_id"):
            log_record["request_id"] = record.request_id


def setup_logging() -> None:
    """Setup application logging configuration"""

    # Determine log level
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Remove existing handlers
    root_logger.handlers.clear()

    # Console handler (always enabled)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)

    if settings.ENV == "production":
        # JSON format for production
        json_formatter = CustomJsonFormatter(
            "%(timestamp)s %(level)s %(logger)s %(message)s"
        )
        console_handler.setFormatter(json_formatter)
    else:
        # Human-readable format for development
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        console_handler.setFormatter(formatter)

    root_logger.addHandler(console_handler)

    # File handler (optional)
    if settings.LOG_FILE:
        file_handler = logging.FileHandler(log_dir / settings.LOG_FILE)
        file_handler.setLevel(log_level)

        if settings.ENV == "production":
            file_handler.setFormatter(json_formatter)
        else:
            file_handler.setFormatter(formatter)

        root_logger.addHandler(file_handler)

    # Error file handler
    error_file = log_dir / "error.log"
    error_handler = logging.FileHandler(error_file)
    error_handler.setLevel(logging.ERROR)

    if settings.ENV == "production":
        error_handler.setFormatter(json_formatter)
    else:
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
        "Logging configured",
        extra={
            "level": logging.getLevelName(log_level),
            "environment": settings.ENV,
            "debug": settings.DEBUG,
        }
    )


# Create logger instance
logger = logging.getLogger("datacleanup")
