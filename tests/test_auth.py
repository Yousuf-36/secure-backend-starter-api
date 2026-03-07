import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from httpx import AsyncClient
from app.models.user import User
from app.auth.security import get_password_hash

@pytest.mark.asyncio
async def test_register_user_success(async_client, mock_session):
    with patch("app.auth.router.register_user", new_callable=AsyncMock) as mock_register:
        mock_user = User(id=1, email="newuser@example.com", is_active=True, roles=[])
        mock_register.return_value = mock_user
        
        response = await async_client.post(
            "/api/v1/auth/register",
            json={"email": "newuser@example.com", "password": "Password123!"}
        )
        
        assert response.status_code == 200, response.json()
        data = response.json()
        assert data["email"] == "newuser@example.com"
    

@pytest.mark.asyncio
async def test_login_user_success(async_client, mock_session):
    mock_user = User(
        id=1, 
        email="test@example.com", 
        hashed_password=get_password_hash("Password123!"), 
        is_active=True
    )
    mock_result = MagicMock()
    mock_result.scalars().first.return_value = mock_user
    mock_session.execute.return_value = mock_result
    
    response = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "Password123!"}
    )
    
    assert response.status_code == 200, response.json()
    data = response.json()
    assert "access_token" in data
    assert "expires_in" in data
    
    # Check if refresh token is in cookies
    assert "refresh_token" in response.cookies

@pytest.mark.asyncio
async def test_refresh_token(async_client, mock_session):
    # First get a refresh token
    from app.auth.security import create_refresh_token
    token = create_refresh_token("1")
    
    async_client.cookies.set("refresh_token", token)
    response = await async_client.post("/api/v1/auth/refresh")
    
    assert response.status_code == 200, response.json()
    data = response.json()
    assert "access_token" in data
