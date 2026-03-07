import pytest
from unittest.mock import patch, MagicMock
from app.ai.service import generate_completion
from app.core.exceptions import api_error

@pytest.mark.asyncio
async def test_generate_completion_success():
    with patch("httpx.AsyncClient.post") as mock_post:
        # Create a mock response object
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Hello from Groq"}}]
        }
        mock_post.return_value = mock_response
        
        result = await generate_completion(prompt="Say hi", max_tokens=100, temperature=0.7)
        assert result == "Hello from Groq"
        assert mock_post.called

@pytest.mark.asyncio
async def test_generate_completion_timeout():
    from httpx import TimeoutException
    with patch("httpx.AsyncClient.post") as mock_post:
        mock_post.side_effect = TimeoutException("Timed out")
        
        try:
            await generate_completion(prompt="Say hi")
            assert False, "Expected an exception"
        except Exception as e:
            assert getattr(e, "status_code", None) == 502
            assert "timed out" in e.detail["message"]
