from pydantic import BaseModel, Field

class CompletionRequest(BaseModel):
    prompt: str = Field(..., description="The user prompt to send to the AI provider")
    max_tokens: int = Field(1000, description="Max tokens to generate", ge=10, le=8000)
    temperature: float = Field(0.7, description="Determinism rating", ge=0.0, le=2.0)

class CompletionResponse(BaseModel):
    response: str
    model_used: str
