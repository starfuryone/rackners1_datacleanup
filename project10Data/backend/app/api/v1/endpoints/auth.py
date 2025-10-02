"""
Authentication endpoints for DataCleanup Pro
============================================
Handles:
- Email/password login and signup
- Google OAuth flow
- JWT token refresh
- Password reset
- Email verification
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from authlib.integrations.starlette_client import OAuth
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    get_rate_limiter,
)
from app.models.user import User
from app.models.subscription import Subscription, PlanType, SubscriptionStatus
from app.models.session import Session as UserSession
from app.services.email import email_service

router = APIRouter()

# ============================================================================
# OAuth Configuration
# ============================================================================

oauth = OAuth()

if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )

# ============================================================================
# Request/Response Schemas
# ============================================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class RefreshRequest(BaseModel):
    refresh_token: str


# ============================================================================
# Helper Functions
# ============================================================================

async def create_user_with_subscription(
    db: AsyncSession,
    email: str,
    hashed_password: str,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    is_verified: bool = False
) -> User:
    """Create a new user with a free subscription"""

    # Create user
    user = User(
        email=email,
        hashed_password=hashed_password,
        first_name=first_name,
        last_name=last_name,
        is_verified=is_verified,
        is_active=True,
    )
    db.add(user)
    await db.flush()  # Get the user.id

    # Create free subscription
    subscription = Subscription(
        user_id=user.id,
        plan_type=PlanType.FREE,
        status=SubscriptionStatus.ACTIVE,
    )
    db.add(subscription)

    await db.commit()
    await db.refresh(user)

    return user


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """Get user by email address"""
    result = await db.execute(
        select(User).where(User.email == email)
    )
    return result.scalar_one_or_none()


async def create_user_session(
    db: AsyncSession,
    user_id: int,
    device_info: Optional[str] = None,
    ip_address: Optional[str] = None,
) -> str:
    """Create a refresh token session"""

    refresh_token = create_refresh_token({"sub": str(user_id)})

    # Hash the token before storing
    from app.core.security import hash_token
    token_hash = hash_token(refresh_token)

    session = UserSession(
        user_id=user_id,
        refresh_token_hash=token_hash,
        device_info=device_info,
        ip_address=ip_address,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(session)
    await db.commit()

    return refresh_token


def create_token_response(user: User, access_token: str, refresh_token: str) -> TokenResponse:
    """Create standardized token response"""
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user={
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_verified": user.is_verified,
        }
    )


# ============================================================================
# Email/Password Authentication
# ============================================================================

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    data: SignupRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user with email and password"""

    # Rate limiting - 5 signups per hour per IP
    rate_limiter = get_rate_limiter(requests=5, window=3600)
    client_ip = request.client.host if request.client else "unknown"
    rate_info = await rate_limiter.check_rate_limit(request, client_ip)

    if not rate_info["allowed"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many signup attempts. Try again in {rate_info['reset']} seconds"
        )

    # Check if user already exists
    existing_user = await get_user_by_email(db, data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = get_password_hash(data.password)

    # Create user with free subscription
    user = await create_user_with_subscription(
        db=db,
        email=data.email,
        hashed_password=hashed_password,
        first_name=data.first_name,
        last_name=data.last_name,
        is_verified=False  # Will need email verification
    )

    # Send welcome email
    try:
        email_service.send_welcome_email(user.email, user.first_name)
    except Exception as e:
        # Log error but don't fail registration
        print(f"Failed to send welcome email: {e}")

    # Create tokens
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = await create_user_session(
        db=db,
        user_id=user.id,
        device_info=request.headers.get("User-Agent"),
        ip_address=request.client.host if request.client else None,
    )

    return create_token_response(user, access_token, refresh_token)


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Login with email and password"""

    # Rate limiting - 10 login attempts per 15 minutes per IP
    rate_limiter = get_rate_limiter(requests=10, window=900)
    client_ip = request.client.host if request.client else "unknown"
    rate_info = await rate_limiter.check_rate_limit(request, client_ip)

    if not rate_info["allowed"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many login attempts. Try again in {rate_info['reset']} seconds"
        )

    # Get user
    user = await get_user_by_email(db, data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    # Update last login
    user.last_login = datetime.now(timezone.utc)
    await db.commit()

    # Create tokens
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = await create_user_session(
        db=db,
        user_id=user.id,
        device_info=request.headers.get("User-Agent"),
        ip_address=request.client.host if request.client else None,
    )

    return create_token_response(user, access_token, refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    data: RefreshRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token using refresh token"""

    # Rate limiting - 20 refreshes per hour per IP
    rate_limiter = get_rate_limiter(requests=20, window=3600)
    client_ip = request.client.host if request.client else "unknown"
    rate_info = await rate_limiter.check_rate_limit(request, client_ip)

    if not rate_info["allowed"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many refresh attempts. Try again in {rate_info['reset']} seconds"
        )

    # Verify refresh token and get user_id
    from app.core.security import verify_refresh_token, hash_token

    user_id = verify_refresh_token(data.refresh_token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    # Check if session exists
    token_hash = hash_token(data.refresh_token)
    result = await db.execute(
        select(UserSession)
        .where(UserSession.refresh_token_hash == token_hash)
        .where(UserSession.expires_at > datetime.utcnow())
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid"
        )

    # Get user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    # Create new access token
    access_token = create_access_token({"sub": str(user.id)})

    return create_token_response(user, access_token, data.refresh_token)


@router.post("/logout")
async def logout(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """Logout and invalidate refresh token session"""

    from app.core.security import hash_token

    token_hash = hash_token(refresh_token)

    # Delete session
    result = await db.execute(
        select(UserSession).where(UserSession.refresh_token_hash == token_hash)
    )
    session = result.scalar_one_or_none()

    if session:
        await db.delete(session)
        await db.commit()

    return {"message": "Logged out successfully"}


# ============================================================================
# Google OAuth
# ============================================================================

@router.get("/google/login")
async def google_login(request: Request):
    """Initiate Google OAuth flow"""

    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured"
        )

    # Redirect URI should match what's configured in Google Console
    redirect_uri = settings.GOOGLE_REDIRECT_URI

    # Redirect to Google OAuth
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle Google OAuth callback"""

    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured"
        )

    try:
        # Get OAuth token from Google
        token = await oauth.google.authorize_access_token(request)

        # Get user info from Google
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get user info from Google"
            )

        email = user_info.get('email')
        given_name = user_info.get('given_name')
        family_name = user_info.get('family_name')

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by Google"
            )

        # Check if user exists
        user = await get_user_by_email(db, email)

        if not user:
            # Create new user (OAuth users don't have passwords)
            # Use a secure random password that can't be used for login
            import secrets
            random_password = secrets.token_urlsafe(32)
            hashed_password = get_password_hash(random_password)

            user = await create_user_with_subscription(
                db=db,
                email=email,
                hashed_password=hashed_password,
                first_name=given_name,
                last_name=family_name,
                is_verified=True  # Google emails are already verified
            )
        else:
            # Update last login
            user.last_login = datetime.utcnow()
            await db.commit()

        # Create tokens
        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = await create_user_session(
            db=db,
            user_id=user.id,
            device_info=request.headers.get("User-Agent"),
            ip_address=request.client.host if request.client else None,
        )

        # Redirect to frontend with tokens in URL
        # The frontend will extract and store them
        frontend_url = settings.FRONTEND_ORIGIN
        redirect_url = (
            f"{frontend_url}/auth/callback"
            f"?access_token={access_token}"
            f"&refresh_token={refresh_token}"
        )

        return RedirectResponse(url=redirect_url)

    except Exception as e:
        # Redirect to frontend with error
        frontend_url = settings.FRONTEND_ORIGIN
        error_url = f"{frontend_url}/login?error=oauth_failed"
        return RedirectResponse(url=error_url)


# ============================================================================
# Password Reset (Placeholder)
# ============================================================================

@router.post("/forgot-password")
async def forgot_password(email: EmailStr, db: AsyncSession = Depends(get_db)):
    """Request password reset email"""

    # TODO: Implement email sending
    # For now, just return success to prevent email enumeration
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    db: AsyncSession = Depends(get_db)
):
    """Reset password using token"""

    # TODO: Implement password reset logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Password reset not yet implemented"
    )
