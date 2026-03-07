from typing import Optional, Any
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

logger = logging.getLogger("app.core.exceptions")

# CORS origins that get injected into error responses so the browser
# never sees a CORS block masking the real error code.
_CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
}

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
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc_detail},
            headers=_CORS_HEADERS,
        )
    
    # Legacy handling / third-party HTTP exceptions
    if exc.status_code == status.HTTP_404_NOT_FOUND:
        code = "NOT_FOUND"
    elif exc.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        code = "RATE_LIMITED"
    else:
        code = "SERVER_ERROR"

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": code, "message": str(exc_detail), "detail": None}},
        headers=_CORS_HEADERS,
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Transforms raw Pydantic validation errors into the standardized error contract."""
    errors = exc.errors()
    if errors:
        msg = f"Validation exception on {'.'.join([str(loc) for loc in errors[0]['loc']])}: {errors[0]['msg']}"
    else:
        msg = "Request validation failed"

    # Safely serialize detail to avoid 'bytes is not JSON serializable'
    safe_errors = []
    for err in errors:
        safe_dict = {}
        for k, v in err.items():
            if isinstance(v, bytes):
                safe_dict[k] = v.decode("utf-8", errors="replace")
            elif not isinstance(v, (str, int, float, bool, dict, list, type(None))):
                safe_dict[k] = str(v)
            else:
                safe_dict[k] = v
        safe_errors.append(safe_dict)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": msg,
                "detail": safe_errors
            }
        },
        headers=_CORS_HEADERS,
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
        headers=_CORS_HEADERS,
    )
