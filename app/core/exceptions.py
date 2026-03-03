from typing import Optional, Any
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

logger = logging.getLogger("app.core.exceptions")

def api_error(code: str, message: str, status_code: int, detail: Optional[Any] = None) -> HTTPException:
    """Helper macro to raise standardized API HTTP exceptions."""
    return HTTPException(
        status_code=status_code,
        detail={"code": code, "message": message, "detail": detail}
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Handles exceptions explicitly raised via HTTPException."""
    exc_detail = getattr(exc, "detail", "Unknown Error")
    if isinstance(exc_detail, dict) and "code" in exc_detail and "message" in exc_detail:
        # Already formatted with api_error
        return JSONResponse(status_code=exc.status_code, content={"error": exc_detail})
    
    # Legacy handling / third-party HTTP exceptions
    # Map common starlette handlers to the api_error code structure
    if exc.status_code == status.HTTP_404_NOT_FOUND:
        code = "NOT_FOUND"
    elif exc.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        code = "RATE_LIMITED"
    else:
        code = "SERVER_ERROR"

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": code, "message": str(exc_detail), "detail": None}},
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Transforms raw Pydantic validation errors into the standardized error contract."""
    # Build a simple error message based on the fields that failed
    errors = exc.errors()
    # Format a human-readable message if possible, falling back to a default
    if errors:
        msg = f"Validation exception on {'.'.join([str(loc) for loc in errors[0]['loc']])}: {errors[0]['msg']}"
    else:
        msg = "Request validation failed"

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": msg,
                "detail": errors
            }
        },
    )

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catches all unhandled exceptions, hiding tracebacks from users."""
    logger.exception(f"Unhandled Exception: {request.method} {request.url}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "SERVER_ERROR",
                "message": "Internal Server Error",
                "detail": None
            }
        },
    )
