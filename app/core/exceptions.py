from typing import Optional, Any
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

logger = logging.getLogger("app.core.exceptions")


def _get_cors_headers(request: Request) -> dict:
    """
    Returns CORS headers that echo the request's origin only if it is in the
    configured allow-list. Never returns a wildcard — that would defeat CORS
    for credentialed requests and is a spec violation.
    """
    from app.core.config import config  # local import to avoid circular dep
    origin = request.headers.get("origin", "")
    if origin and origin in config.cors_origins:
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
        }
    return {}


def api_error(code: str, message: str, status_code: int, detail: Optional[Any] = None) -> HTTPException:
    """Helper macro to raise standardized API HTTP exceptions."""
    return HTTPException(
        status_code=status_code,
        detail={"code": code, "message": message, "detail": detail}
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Handles exceptions explicitly raised via HTTPException."""
    cors = _get_cors_headers(request)
    exc_detail = getattr(exc, "detail", "Unknown Error")

    if isinstance(exc_detail, dict) and "code" in exc_detail and "message" in exc_detail:
        # Already formatted with api_error
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc_detail},
            headers=cors,
        )

    # Map common status codes to error codes
    if exc.status_code == status.HTTP_404_NOT_FOUND:
        code = "NOT_FOUND"
    elif exc.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
        code = "RATE_LIMITED"
    else:
        code = "SERVER_ERROR"

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": code, "message": str(exc_detail), "detail": None}},
        headers=cors,
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Transforms raw Pydantic validation errors into the standardized error contract."""
    cors = _get_cors_headers(request)
    errors = exc.errors()
    if errors:
        msg = f"Validation error on '{'.'.join([str(loc) for loc in errors[0]['loc']])}': {errors[0]['msg']}"
    else:
        msg = "Request validation failed"

    # Safely serialize detail — Pydantic v2 can include non-serializable objects (e.g. ValueError in ctx)
    safe_errors = []
    for err in errors:
        safe_dict = {}
        for k, v in err.items():
            if k == "ctx" and isinstance(v, dict):
                # ctx may contain exception instances — convert all values to strings
                safe_dict[k] = {ck: str(cv) for ck, cv in v.items()}
            elif isinstance(v, bytes):
                safe_dict[k] = v.decode("utf-8", errors="replace")
            elif isinstance(v, (str, int, float, bool, dict, list, type(None))):
                safe_dict[k] = v
            else:
                safe_dict[k] = str(v)
        safe_errors.append(safe_dict)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": msg,
                "detail": safe_errors,
            }
        },
        headers=cors,
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catches all unhandled exceptions, hiding tracebacks from users."""
    logger.exception(f"Unhandled Exception: {request.method} {request.url}")
    cors = _get_cors_headers(request)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "SERVER_ERROR",
                "message": "Internal Server Error",
                "detail": None,
            }
        },
        headers=cors,
    )
