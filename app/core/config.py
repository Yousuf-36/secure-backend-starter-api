from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    # Application Config
    PROJECT_NAME: str = "Secure Backend Starter"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Auth & Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str
    
    # CORS
    ALLOWED_ORIGINS: str
    
    @property
    def cors_origins(self) -> List[str]:
        """Convert comma-separated string to list."""
        if not self.ALLOWED_ORIGINS:
            return []
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    # AI Module (Groq Default)
    GROQ_API_KEY: Optional[str] = None
    AI_PROVIDER: str = "groq"
    
    # Rate Limiting
    RATE_LIMIT_AUTH_REQUESTS: int = 10
    RATE_LIMIT_AUTH_WINDOW_SECONDS: int = 60
    RATE_LIMIT_AI_REQUESTS_PER_MINUTE: int = 20
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

config = Settings()
