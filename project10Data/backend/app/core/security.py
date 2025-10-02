"""
Security Utilities
Password hashing, JWT tokens, rate limiting
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import secrets

from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.core.logging import logger

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer security scheme
security = HTTPBearer()


# ============================================================================
# Password Utilities
# ============================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


# ============================================================================
# JWT Token Utilities
# ============================================================================

def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT access token"""
    to_encode = data.copy()

    # Set expiration
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    })

    # Encode JWT
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def create_refresh_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()

    # Set expiration (longer than access token)
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh"
    })

    # Encode JWT
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        logger.warning(f"JWT decode error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_token_type(payload: Dict[str, Any], expected_type: str) -> None:
    """Verify token type matches expected"""
    token_type = payload.get("type")
    if token_type != expected_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token type. Expected {expected_type}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ============================================================================
# CSRF Token Utilities
# ============================================================================

def generate_csrf_token() -> str:
    """Generate CSRF token"""
    return secrets.token_urlsafe(32)


def verify_csrf_token(token: str, expected_token: str) -> bool:
    """Verify CSRF token"""
    return secrets.compare_digest(token, expected_token)


# ============================================================================
# Rate Limiting
# ============================================================================

class RateLimiter:
    """Simple rate limiter using Redis"""

    def __init__(
        self,
        requests: int,
        window: int,
        identifier: str = "ip"
    ):
        """
        Args:
            requests: Number of requests allowed
            window: Time window in seconds
            identifier: How to identify client (ip, user_id, api_key)
        """
        self.requests = requests
        self.window = window
        self.identifier = identifier

    async def check_rate_limit(self, request: Request, key: str) -> Dict[str, Any]:
        """
        Check if request exceeds rate limit

        Returns:
            Dict with rate limit info
        """
        from app.core.redis import redis_client

        # Build Redis key
        redis_key = f"rate_limit:{self.identifier}:{key}"

        # Get current count
        current = await redis_client.get(redis_key)

        if current is None:
            # First request in window
            await redis_client.set(redis_key, "1", ex=self.window)
            return {
                "allowed": True,
                "limit": self.requests,
                "remaining": self.requests - 1,
                "reset": self.window
            }

        count = int(current)

        if count >= self.requests:
            # Rate limit exceeded
            ttl = await redis_client.ttl(redis_key)
            return {
                "allowed": False,
                "limit": self.requests,
                "remaining": 0,
                "reset": ttl
            }

        # Increment counter
        await redis_client.incr(redis_key)
        ttl = await redis_client.ttl(redis_key)

        return {
            "allowed": True,
            "limit": self.requests,
            "remaining": self.requests - count - 1,
            "reset": ttl
        }


def get_rate_limiter(requests: int = 100, window: int = 60) -> RateLimiter:
    """Get rate limiter instance"""
    return RateLimiter(requests=requests, window=window)


# ============================================================================
# API Key Utilities
# ============================================================================

def generate_api_key() -> str:
    """Generate secure API key"""
    return f"sk_{secrets.token_urlsafe(32)}"


def hash_api_key(api_key: str) -> str:
    """Hash API key for storage"""
    return get_password_hash(api_key)


def verify_api_key(plain_api_key: str, hashed_api_key: str) -> bool:
    """Verify API key against hash"""
    return verify_password(plain_api_key, hashed_api_key)


# ============================================================================
# Token Hashing Utilities
# ============================================================================

def hash_token(token: str) -> str:
    """Hash a token for storage (for refresh tokens)"""
    import hashlib
    return hashlib.sha256(token.encode()).hexdigest()


def verify_refresh_token(token: str) -> Optional[int]:
    """Verify refresh token and return user_id"""
    try:
        payload = decode_token(token)
        verify_token_type(payload, "refresh")
        user_id = payload.get("sub")
        return int(user_id) if user_id else None
    except Exception:
        return None
