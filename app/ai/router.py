from fastapi import APIRouter, Depends
from app.ai.schemas import CompletionRequest, CompletionResponse
from app.ai.service import generate_completion
from app.auth.dependencies import get_current_user
from app.roles.dependencies import require_role
from app.models import User

router = APIRouter()

# Free Tier Rate Limit Notice: Groq API allows ~30 requests per minute.
@router.post(
    "/completion",
    response_model=CompletionResponse,
    summary="Generate AI Completion",
    dependencies=[Depends(require_role("ai_user"))]
)
async def completion_endpoint(
    request: CompletionRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generates an AI text completion using Groq.
    
    Security:
    - Protected by JWT Auth dependency.
    - Requires 'ai_user' (or 'admin') role dependency enforcement.
    """
    # Isolate business logic handling away from router
    result = await generate_completion(
        prompt=request.prompt,
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )
    
    return CompletionResponse(
        response=result,
        model_used="groq/llama-3.1-8b-instant"
    )
