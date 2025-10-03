"""
Custom exceptions for DataCleanup Pro

Provides a comprehensive exception hierarchy with:
- Consistent JSON serialization
- HTTP status code mapping
- Structured error details
- Retry capability detection
"""
from typing import Any, Dict, Optional


class DataCleanupException(Exception):
    """Base exception for all DataCleanup errors"""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert exception to JSON-serializable dictionary.

        Returns:
            Dictionary with error type, message, status code, and details
        """
        return {
            "error": self.__class__.__name__,
            "message": self.message,
            "status_code": self.status_code,
            "details": self.details,
        }

    def __str__(self) -> str:
        """String representation for logging"""
        return f"{self.__class__.__name__}({self.status_code}): {self.message}"


class RetryableError(DataCleanupException):
    """
    Base class for errors that may be safely retried.

    Use this for transient failures like:
    - Network timeouts
    - Rate limiting
    - Temporary service unavailability
    """

    def __init__(
        self,
        message: str,
        status_code: int = 503,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message, status_code=status_code, details=details)


class ImageProcessingError(DataCleanupException):
    """Raised when image processing fails"""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=422, details=details)


class OCRFailedError(DataCleanupException):
    """Raised when OCR extraction fails"""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=422, details=details)


class QuotaExceededError(RetryableError):
    """
    Raised when user exceeds their plan quota.

    Retryable because quota may reset after time period.
    """

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=429, details=details)


class FeatureNotAvailableError(DataCleanupException):
    """Raised when feature not available in user's plan"""

    def __init__(
        self, message: str, feature: str, details: Optional[Dict[str, Any]] = None
    ):
        # Merge provided details with required fields
        error_details = {"feature": feature, "upgrade_required": True}
        if details:
            error_details.update(details)
        super().__init__(
            message,
            status_code=403,
            details=error_details,
        )


class AuthenticationError(DataCleanupException):
    """Raised when authentication fails"""

    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, status_code=401)


class AuthorizationError(DataCleanupException):
    """Raised when user lacks permissions"""

    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, status_code=403)


class ValidationError(DataCleanupException):
    """Raised when input validation fails"""

    def __init__(self, message: str, field: Optional[str] = None):
        details = {"field": field} if field else {}
        super().__init__(message, status_code=400, details=details)


class StripeError(RetryableError):
    """
    Raised when Stripe operations fail.

    Retryable for transient Stripe API errors (rate limits, timeouts).
    """

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=402, details=details)


class StorageError(RetryableError):
    """
    Raised when file storage operations fail.

    Retryable for transient storage failures (network issues, S3 throttling).
    """

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=500, details=details)


class AIProviderError(RetryableError):
    """
    Raised when AI provider API calls fail.

    Retryable for transient API errors (rate limits, timeouts, service unavailable).
    """

    def __init__(
        self, message: str, provider: str, details: Optional[Dict[str, Any]] = None
    ):
        # Merge provided details with required provider field
        error_details = {"provider": provider, **(details or {})}
        super().__init__(message, status_code=502, details=error_details)
