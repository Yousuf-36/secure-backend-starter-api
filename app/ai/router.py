from fastapi import APIRouter, Depends, Request
from app.ai.schemas import CompletionRequest, CompletionResponse
from app.ai.service import generate_completion
from app.auth.dependencies import get_current_user
from app.roles.dependencies import require_role
from app.core.limiter import limiter
from app.core.config import config
from app.models import User

router = APIRouter()

GROQ_MODEL = "groq/llama-3.1-8b-instant"

_AI_LIMIT = f"{config.RATE_LIMIT_AI_REQUESTS_PER_MINUTE}/minute"


@router.post(
    "/completion",
    response_model=CompletionResponse,
    summary="Generate AI Completion",
    dependencies=[Depends(require_role("ai_user"))],
)
@limiter.limit(_AI_LIMIT)
async def completion_endpoint(
    request: Request,
    body: CompletionRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Generates an AI text completion using the configured provider (Groq by default).

    Security:
    - JWT auth required.
    - Requires 'ai_user' (or 'admin') role.
    - Rate limited to RATE_LIMIT_AI_REQUESTS_PER_MINUTE per IP.
    """
    result = await generate_completion(
        prompt=body.prompt,
        max_tokens=body.max_tokens,
        temperature=body.temperature,
    )

    return CompletionResponse(
        response=result,
        model_used=GROQ_MODEL,
    )
