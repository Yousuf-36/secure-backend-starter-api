from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.schemas.user import UserResponse
from app.auth.service import authenticate_user, register_user
from app.auth.security import create_access_token, create_refresh_token, decode_token
from app.core.exceptions import api_error

router = APIRouter()

@router.post("/register", response_model=UserResponse, summary="Register a new user")
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Registers a new user account returning their sanitized User schema."""
    user = await register_user(db, data)
    return user

@router.post("/login", response_model=Token, summary="Login with email/password")
async def login(response: Response, data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticates user, returns access token in body, sets long-lived refresh 
    token safely aside in an HttpOnly cookie restricting client JS access.
    """
    user = await authenticate_user(db, data)
    
    access_token, expires_in = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))
    
    # Store refresh token securely in an HttpOnly cookie restricting client-side storage abuse
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True, 
        samesite="lax",
    )
    
    return Token(access_token=access_token, expires_in=expires_in)

@router.post("/refresh", response_model=Token, summary="Refresh access token")
async def refresh(request: Request, response: Response):
    """
    Refreshes the localized access token inspecting the persistent HttpOnly refresh token.
    Rotates the refresh token securely matching the lifespan on subsequent usages.
    """
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise api_error("AUTH_REQUIRED", "Refresh token missing from cookie scope", 401)
        
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise api_error("AUTH_REFRESH_INVALID", "Invalid token type, expected refresh", 401)
        
    user_id = payload.get("sub")
    access_token, expires_in = create_access_token(subject=str(user_id))
    new_refresh_token = create_refresh_token(subject=str(user_id))
    
    # Rotate refresh token securely down the pipeline
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True, 
        samesite="lax",
    )
    
    return Token(access_token=access_token, expires_in=expires_in)

@router.post("/logout", summary="Logout user session")
async def logout(response: Response):
    """Effectively drops the attached refresh token locally mapping back to an empty header."""
    response.delete_cookie("refresh_token")
    return {"message": "You have been logged out completely."}
