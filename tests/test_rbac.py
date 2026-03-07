import pytest
from httpx import AsyncClient
from unittest.mock import MagicMock, patch, AsyncMock
from app.models.user import User
from app.models.role import Role
from app.auth.security import create_access_token
from app.auth.dependencies import get_current_user
from app.main import app

@pytest.fixture
def mock_admin_user():
    admin_role = Role(id=1, name="admin")
    return User(
        id=1,
        email="admin@example.com",
        is_active=True,
        roles=[admin_role]
    )

@pytest.fixture
def mock_regular_user():
    user_role = Role(id=2, name="user")
    return User(
        id=2,
        email="user@example.com",
        is_active=True,
        roles=[user_role]
    )

@pytest.mark.asyncio
async def test_admin_access_allowed(async_client, mock_admin_user):
    # This assumes there's a route requiring admin. We can test any completion endpoint
    # to see if 'admin' bypasses 'ai_user' requirement.
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    
    with patch("app.ai.router.generate_completion", new_callable=AsyncMock) as mock_generate:
        mock_generate.return_value = "Mocked response"
        
        response = await async_client.post(
            "/api/v1/ai/completion",
            json={"prompt": "Hello"}
        )
        
    app.dependency_overrides.clear()
    
    assert response.status_code == 200
    assert "Mocked response" in response.json().get("response", "")


@pytest.mark.asyncio
async def test_regular_user_access_denied_for_missing_role(async_client, mock_regular_user):
    # 'ai_user' is required for /api/v1/ai/completion or admin bypass
    # User has 'user' only, so it should fail
    app.dependency_overrides[get_current_user] = lambda: mock_regular_user
    
    response = await async_client.post(
        "/api/v1/ai/completion",
        json={"prompt": "Hello"}
    )
    
    app.dependency_overrides.clear()
    assert response.status_code == 403
    assert "requires the 'ai_user' role" in response.json()["error"]["message"]
