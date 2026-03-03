import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from app.core.config import config
from app.core.exceptions import api_error

def get_password_hash(password: str) -> str:
    """Hashes a plaintext password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plaintext password against the stored bcrypt hash."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(subject: str) -> tuple[str, int]:
    """Generates a shorter-lived JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt, config.ACCESS_TOKEN_EXPIRE_MINUTES * 60

def create_refresh_token(subject: str) -> str:
    """Generates a longer-lived JWT refresh token."""
    expire = datetime.now(timezone.utc) + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    return jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)

def decode_token(token: str) -> dict:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise api_error("AUTH_TOKEN_EXPIRED", "Token has expired", 401)
    except jwt.InvalidTokenError:
        raise api_error("AUTH_TOKEN_INVALID", "Invalid token format or signature", 401)
