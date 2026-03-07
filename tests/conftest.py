import pytest
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.core.database import get_db

@pytest.fixture
def mock_session():
    """Returns a mock AsyncSession."""
    session = AsyncMock()
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.flush = AsyncMock()
    session.rollback = AsyncMock()
    return session

@pytest.fixture
async def async_client(mock_session):
    """Provides an async client for testing FastAPI endpoints, with mocked DB."""
    
    async def override_get_db():
        yield mock_session

    app.dependency_overrides[get_db] = override_get_db
    
    # We must yield the client
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
        
    app.dependency_overrides.clear()
