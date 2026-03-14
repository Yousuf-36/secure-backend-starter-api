import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.exceptions import RequestValidationError
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import config
from app.core.database import get_db, engine
from app.core.limiter import limiter
from app.core.middleware import setup_middlewares
from app.core.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler,
)

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("app.main")


# ── Rate limit exceeded — return standardized error contract ───────────────────
from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded as _RateLimitExceeded


async def rate_limit_exceeded_handler(request: Request, exc: _RateLimitExceeded) -> JSONResponse:
    """Returns a standardized 429 JSON payload matching the API error contract."""
    from app.core.exceptions import _get_cors_headers
    return JSONResponse(
        status_code=429,
        content={
            "error": {
                "code": "RATE_LIMITED",
                "message": f"Too many requests. Limit: {exc.detail}",
                "detail": None,
            }
        },
        headers=_get_cors_headers(request),
    )


# ── Lifespan ───────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"{config.PROJECT_NAME} (v{config.VERSION}) starting up...")
    yield
    logger.info("Shutting down — disposing database engine...")
    await engine.dispose()
    logger.info("Shutdown complete.")


def create_app() -> FastAPI:
    """Bootstrap the FastAPI application."""

    app = FastAPI(
        title=config.PROJECT_NAME,
        version=config.VERSION,
        openapi_url=f"{config.API_V1_STR}/openapi.json",
        # Only expose interactive docs when DEBUG=true (never in production)
        docs_url="/docs" if config.DEBUG else None,
        redoc_url="/redoc" if config.DEBUG else None,
        lifespan=lifespan,
    )

    # 1. Attach limiter state (required by SlowAPIMiddleware)
    app.state.limiter = limiter

    # 2. Apply middlewares — order matters: CORS first, then request logging, then SlowAPI
    setup_middlewares(app)
    app.add_middleware(SlowAPIMiddleware)

    # 3. Register exception handlers
    app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # 4. Health check — tests actual DB connectivity for proper liveness signaling
    @app.get("/health", tags=["System"])
    async def health_check(db: AsyncSession = Depends(get_db)):
        """
        Public liveness + readiness probe.
        Tests database connectivity so load balancers get an accurate signal.
        Returns 'degraded' status if DB is unreachable.
        """
        try:
            await db.execute(text("SELECT 1"))
            db_status = "ok"
        except Exception:
            logger.exception("Health check — database probe failed")
            db_status = "error"

        return {
            "status": "ok" if db_status == "ok" else "degraded",
            "app": config.PROJECT_NAME,
            "version": config.VERSION,
            "database": db_status,
        }

    # 5. Bind routers — imported here to avoid circular import issues
    from app.auth.router import router as auth_router
    from app.ai.router import router as ai_router

    app.include_router(auth_router, prefix=config.API_V1_STR + "/auth", tags=["auth"])
    app.include_router(ai_router, prefix=config.API_V1_STR + "/ai", tags=["ai"])

    logger.info(f"{config.PROJECT_NAME} (v{config.VERSION}) initialized.")
    return app


app = create_app()
