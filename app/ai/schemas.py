from pydantic import BaseModel, Field


class CompletionRequest(BaseModel):
    prompt: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="The user prompt to send to the AI provider (max 4000 characters)"
    )
    max_tokens: int = Field(1000, description="Max tokens to generate", ge=10, le=8000)
    temperature: float = Field(0.7, description="Determinism rating (0.0 = deterministic, 2.0 = creative)", ge=0.0, le=2.0)


class CompletionResponse(BaseModel):
    response: str
    model_used: str
