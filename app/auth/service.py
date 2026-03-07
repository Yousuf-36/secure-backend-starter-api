from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import User, Role
from app.schemas.auth import LoginRequest, RegisterRequest
from app.auth.security import get_password_hash, verify_password
from app.core.exceptions import api_error

async def authenticate_user(db: AsyncSession, data: LoginRequest) -> User:
    """Verifies credentials, securely returning the queried user instance."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    
    # Generic failure response purposefully masking if email exists or not
    if not user:
        raise api_error("AUTH_INVALID_CREDENTIALS", "Incorrect email or password", 401)
        
    is_password_valid = verify_password(data.password, user.hashed_password)
    if not is_password_valid:
        raise api_error("AUTH_INVALID_CREDENTIALS", "Incorrect email or password", 401)
        
    return user

async def register_user(db: AsyncSession, data: RegisterRequest) -> User:
    """Registers the provided user and commits their hashed password to the database."""
    # Check for email collision
    result = await db.execute(select(User).where(User.email == data.email))
    existing_user = result.scalars().first()
    
    if existing_user:
        raise api_error("CONFLICT", "Email is already registered. Please login.", 409)
        
    hashed_password = get_password_hash(data.password)
    new_user = User(email=data.email, hashed_password=hashed_password)
    
    # Assign default roles to new users
    roles_result = await db.execute(select(Role).filter(Role.name.in_(["user", "ai_user"])))
    default_roles = roles_result.scalars().all()
    for role in default_roles:
        new_user.roles.append(role)
    
    db.add(new_user)
    # Important: Autocommit is False, we mandate explicit commit handling in services layer.
    await db.commit()
    await db.refresh(new_user)
    
    return new_user
