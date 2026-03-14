from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.limiter import limiter
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.schemas.user import UserResponse
from app.auth.service import authenticate_user, register_user
from app.auth.security import create_access_token, create_refresh_token, decode_token
from app.auth.dependencies import get_current_user
from app.core.config import config
from app.core.exceptions import api_error
from app.models import User

router = APIRouter()

_AUTH_LIMIT = f"{config.RATE_LIMIT_AUTH_REQUESTS}/{config.RATE_LIMIT_AUTH_WINDOW_SECONDS}second"


@router.post("/register", response_model=UserResponse, summary="Register a new user")
@limiter.limit(_AUTH_LIMIT)
async def register(request: Request, data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Registers a new user. Rate limited to protect against account enumeration."""
    user = await register_user(db, data)
    return user


@router.post("/login", response_model=Token, summary="Login with email/password")
@limiter.limit(_AUTH_LIMIT)
async def login(request: Request, response: Response, data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticates user. Returns access token in body, sets HttpOnly refresh token cookie.
    Rate limited to protect against brute-force attacks.
    """
    user = await authenticate_user(db, data)

    access_token, expires_in = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=config.APP_ENV == "production",
        samesite="none" if config.APP_ENV == "production" else "lax",
    )

    return Token(access_token=access_token, expires_in=expires_in)


@router.post("/refresh", response_model=Token, summary="Refresh access token")
@limiter.limit(_AUTH_LIMIT)
async def refresh(request: Request, response: Response):
    """Refreshes the access token via the HttpOnly refresh cookie. Rotates token on each call."""
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise api_error("AUTH_REQUIRED", "Refresh token missing from cookie scope", 401)

    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise api_error("AUTH_REFRESH_INVALID", "Invalid token type, expected refresh", 401)

    user_id = payload.get("sub")
    access_token, expires_in = create_access_token(subject=str(user_id))
    new_refresh_token = create_refresh_token(subject=str(user_id))

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=config.APP_ENV == "production",
        samesite="none" if config.APP_ENV == "production" else "lax",
    )

    return Token(access_token=access_token, expires_in=expires_in)


@router.post("/logout", summary="Logout user session")
async def logout(response: Response):
    """Clears the refresh token cookie, effectively ending the session."""
    response.delete_cookie("refresh_token")
    return {"message": "You have been logged out completely."}


@router.get("/me", response_model=UserResponse, summary="Get current authenticated user")
async def get_me(current_user: User = Depends(get_current_user)) -> User:
    """
    Returns the full profile of the authenticated user including their assigned roles.
    Protected by Bearer JWT. Roles are eager-loaded — no additional DB query needed.
    """
    return current_user
