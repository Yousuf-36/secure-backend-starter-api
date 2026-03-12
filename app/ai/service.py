import logging
from httpx import AsyncClient, HTTPError, TimeoutException
from app.core.config import config
from app.core.exceptions import api_error

logger = logging.getLogger("app.ai.service")

async def generate_completion(prompt: str, max_tokens: int = 1000, temperature: float = 0.7) -> str:
    """
    Generates a completion using Groq API as the default fast/free model provider.
    Wrapped in safe exception boundaries mapping to generic API error formats.
    """
    if not config.GROQ_API_KEY:
        raise api_error("SERVER_ERROR", "AI provider is not configured. Missing API Key.", 500)
        
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {config.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        # Defaults to Groq's fast Llama 3.1 8b serving
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": temperature
    }
    
    try:
        # 10s timeout since AI endpoints can stall unpredictably
        async with AsyncClient(timeout=10.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
            
    except TimeoutException:
        logger.error("AI Upstream Timeout: Groq API took too long to respond.")
        raise api_error("AI_UPSTREAM_ERROR", "The AI provider timed out. Please try again later.", 502)
    except HTTPError as e:
        logger.error(f"AI Upstream Error Status {getattr(e.response, 'status_code', 'Unknown')}: {e}")
        raise api_error("AI_UPSTREAM_ERROR", "The AI provider returned an error. Please try again later.", 502)
    except Exception as e:
        logger.error(f"Unexpected AI Error: {e}", exc_info=True)
        raise api_error("SERVER_ERROR", "An unexpected error occurred while processing the AI request.", 500)
