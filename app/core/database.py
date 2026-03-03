from typing import AsyncGenerator
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.core.config import config

logger = logging.getLogger("app.core.database")

# Create Async Engine for PostgreSQL
try:
    engine = create_async_engine(
        config.DATABASE_URL,
        echo=False,  # Set to True for SQL query debugging
        future=True,
        pool_pre_ping=True,
    )
except Exception as e:
    logger.error(f"Failed to initialize database engine: {str(e)}")
    raise

# Define Session Local Generator
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to provide an isolated database session for a single request.
    Handles session cleanup and commit/rollback automatically.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            # Note: We do NOT auto-commit here. The service layer should
            # call await session.commit() explicitly.
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
