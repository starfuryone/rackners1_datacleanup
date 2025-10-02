# DataCleanup Pro - Critical Fixes Checklist

**URGENT - Complete Before Production Deployment**

---

## 🚨 IMMEDIATE ACTION REQUIRED (TODAY)

### ✅ Issue #1: Exposed Secrets in Repository
**Impact**: Credentials actively exposed in public code

**Steps**:
```bash
# 1. Revoke Brevo API Key
# Go to: https://app.brevo.com/settings/keys/api
# Delete key: xkeysib-76f394202dc90262eb8e18730568666acb9f06190487c594448df0195f2a2c825-5hTWPnu9Ru4Xvgkc

# 2. Generate new API key
# Create new key in Brevo dashboard

# 3. Update .env
# Never commit this file!
```

**Git History Cleanup**:
```bash
# Remove .env from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
git push origin --force --tags

# Ensure .env is in .gitignore
echo "backend/.env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

**Timeline**: COMPLETE TODAY (2-3 hours)

---

## 🔴 CRITICAL SECURITY FIXES (This Week)

### ✅ Issue #2: Authentication Bypass
**File**: `/backend/app/api/dependencies.py`

**Current Code**:
```python
async def get_current_user(...) -> User:
    raise HTTPException(501, "Authentication not yet implemented")
```

**Fixed Code**:
```python
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get the current authenticated user from JWT token."""
    from app.core.security import decode_token

    token = credentials.credentials

    # Decode and verify JWT
    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(401, "Invalid token payload")

    # Get user from database
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(401, "User not found")

    if not user.is_active:
        raise HTTPException(403, "User account is disabled")

    return user
```

**Timeline**: Day 1 (4 hours)
**Test**: Use Postman to verify protected endpoints reject invalid tokens

---

### ✅ Issue #3: Fix JWT Token Functions
**File**: `/backend/app/core/security.py`

**Add Missing Functions**:
```python
import hashlib
from typing import Optional

def hash_token(token: str) -> str:
    """Hash token for secure storage"""
    return hashlib.sha256(token.encode()).hexdigest()

def verify_refresh_token(token: str) -> Optional[int]:
    """Verify refresh token and return user_id"""
    try:
        payload = decode_token(token)
        verify_token_type(payload, "refresh")
        return payload.get("sub")
    except HTTPException:
        return None
```

**Fix Function Calls in `/backend/app/api/v1/endpoints/auth.py`**:
```python
# BEFORE (WRONG):
access_token = create_access_token(user.id)

# AFTER (CORRECT):
access_token = create_access_token({"sub": user.id})
refresh_token = create_refresh_token({"sub": user.id})
```

**Timeline**: Day 1 (2 hours)

---

### ✅ Issue #4: Insecure Token Storage
**Files**: Frontend + Backend

**Backend Changes** (`/backend/app/api/v1/endpoints/auth.py`):
```python
from fastapi import Response

@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    request: Request,
    response: Response,  # Add this
    db: AsyncSession = Depends(get_db)
):
    # ... authentication logic ...

    # Set httpOnly cookie for refresh token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/v1/auth"
    )

    # Don't return refresh_token in response body
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user={...}
    )
```

**Frontend Changes** (`/frontend/src/hooks/useAuth.ts`):
```typescript
// Remove refresh_token from localStorage
persist(
    (set, get) => ({ ... }),
    {
        name: 'auth-storage',
        partialize: (state) => ({
            user: state.user,
            // Only store access token temporarily
            accessToken: state.accessToken,
            isAuthenticated: state.isAuthenticated
        })
    }
)
```

**Timeline**: Day 2 (6 hours)

---

### ✅ Issue #5: Add CSRF Protection
**File**: Create `/backend/app/middleware/csrf.py`

```python
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
from app.core.security import generate_csrf_token, verify_csrf_token

class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip CSRF for safe methods
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            response = await call_next(request)
            # Set CSRF token in response header
            if "csrf_token" not in request.session:
                request.session["csrf_token"] = generate_csrf_token()
            response.headers["X-CSRF-Token"] = request.session["csrf_token"]
            return response

        # Verify CSRF token
        csrf_token = request.headers.get("X-CSRF-Token")
        session_csrf = request.session.get("csrf_token")

        if not csrf_token or not session_csrf:
            raise HTTPException(403, "CSRF token missing")

        if not verify_csrf_token(csrf_token, session_csrf):
            raise HTTPException(403, "CSRF token invalid")

        return await call_next(request)
```

**Add to** `/backend/app/main.py`:
```python
from starlette.middleware.sessions import SessionMiddleware
from app.middleware.csrf import CSRFMiddleware

# Add session middleware (before CSRF)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="datacleanup_session"
)

# Add CSRF middleware
app.add_middleware(CSRFMiddleware)
```

**Frontend** (`/frontend/src/api/client.ts`):
```typescript
// Store CSRF token from response
let csrfToken: string | null = null

apiClient.interceptors.response.use(
  (response) => {
    const token = response.headers['x-csrf-token']
    if (token) {
      csrfToken = token
    }
    return response
  }
)

// Add CSRF token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (csrfToken && config.method !== 'get') {
      config.headers['X-CSRF-Token'] = csrfToken
    }
    return config
  }
)
```

**Timeline**: Day 3 (8 hours)

---

### ✅ Issue #7: OAuth Token Exposure
**File**: `/backend/app/api/v1/endpoints/auth.py`

**BEFORE**:
```python
redirect_url = (
    f"{frontend_url}/auth/callback"
    f"?access_token={access_token}"  # EXPOSED IN URL!
    f"&refresh_token={refresh_token}"
)
```

**AFTER**:
```python
# Set tokens as httpOnly cookies
response = RedirectResponse(url=f"{frontend_url}/auth/callback?success=true")
response.set_cookie("access_token", access_token, httponly=True, ...)
response.set_cookie("refresh_token", refresh_token, httponly=True, ...)
return response
```

**Timeline**: Day 3 (2 hours)

---

### ✅ Issue #8: Rate Limiting
**Install**: `pip install slowapi`

**File**: `/backend/app/main.py`

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Create limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

**File**: `/backend/app/api/v1/endpoints/auth.py`

```python
from app.main import limiter

@router.post("/login")
@limiter.limit("5/minute")  # 5 attempts per minute per IP
async def login(request: Request, ...):
    ...

@router.post("/signup")
@limiter.limit("3/hour")  # 3 signups per hour per IP
async def signup(request: Request, ...):
    ...

@router.post("/forgot-password")
@limiter.limit("3/hour")
async def forgot_password(request: Request, ...):
    ...
```

**Timeline**: Day 4 (4 hours)

---

## 📋 Testing Checklist

After implementing fixes, test:

### Authentication Tests
- [ ] Login with valid credentials → Success
- [ ] Login with invalid credentials → 401 error
- [ ] Access protected endpoint without token → 401 error
- [ ] Access protected endpoint with valid token → Success
- [ ] Access protected endpoint with expired token → 401 error
- [ ] Refresh token flow → New access token returned
- [ ] Logout → Session invalidated

### Security Tests
- [ ] CSRF protection blocks requests without token
- [ ] Rate limiting blocks after N attempts
- [ ] Tokens stored as httpOnly cookies (inspect in DevTools)
- [ ] OAuth flow doesn't expose tokens in URL
- [ ] Password complexity validated
- [ ] Sensitive endpoints require authentication

### Integration Tests
```bash
# Run with pytest
cd backend
pytest tests/test_auth.py -v
```

---

## 🎯 Success Criteria

Before deploying to production:

- [x] All exposed credentials revoked and rotated
- [ ] Authentication fully implemented and tested
- [ ] Tokens stored securely (httpOnly cookies)
- [ ] CSRF protection active
- [ ] Rate limiting enforced
- [ ] No tokens in URLs
- [ ] All tests passing
- [ ] Security scan clean (run `bandit -r app/`)
- [ ] Code review completed
- [ ] Deployment runbook created

---

## 📞 Support

If you need help implementing these fixes:

1. Review the detailed CODE_REVIEW_REPORT.md
2. Check FastAPI Security docs: https://fastapi.tiangolo.com/tutorial/security/
3. Test thoroughly in development before production

**Estimated Time to Complete**: 3-4 days of focused work

**Priority Order**:
1. Issue #1 (TODAY)
2. Issues #2, #3, #4 (Day 1-2)
3. Issues #5, #7 (Day 3)
4. Issue #8 (Day 4)

Good luck! 🚀
