from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.exceptions import api_error
from app.models import User
from app.auth.security import decode_token

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency logic to retrieve the active user from the provided Bearer token.
    Raises standardized API exceptions if token is missing, invalid, or expired.

    Roles are eager-loaded via selectinload so they're available outside this
    session scope (required for UserResponse serialization and RBAC checks).
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload.get("type") != "access":
        raise api_error("AUTH_TOKEN_INVALID", "Invalid token type, expected access token", 401)
        
    user_id = payload.get("sub")
    if not user_id:
        raise api_error("AUTH_TOKEN_INVALID", "Token subject missing", 401)
        
    # Eager-load roles in the same query — avoids lazy-load in async context
    result = await db.execute(
        select(User)
        .where(User.id == int(user_id))
        .options(selectinload(User.roles))
    )
    user = result.scalars().first()
    
    if not user:
        raise api_error("AUTH_TOKEN_INVALID", "User associated with token not found", 401)
        
    if not user.is_active:
        raise api_error("AUTH_TOKEN_INVALID", "User account is suspended/inactive", 401)
        
    return user
