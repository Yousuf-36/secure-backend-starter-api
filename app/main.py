import logging
from fastapi import FastAPI, Depends
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import config
from app.core.middleware import setup_middlewares
from app.core.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler,
)

# Set base logger configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("app.main")

def create_app() -> FastAPI:
    """Bootstrap the FastAPI app with standards, exception handlers, and middlewares."""
    app = FastAPI(
        title=config.PROJECT_NAME,
        version=config.VERSION,
        openapi_url=f"{config.API_V1_STR}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # 1. Apply Middlewares (CORS, Request Logging)
    setup_middlewares(app)

    # 2. Register Global Exception Handlers
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # 3. Health check route layout (Public by default)
    @app.get("/health", tags=["System"])
    async def health_check():
        """Public endpoint to verify API operation."""
        return {
            "status": "ok",
            "app": config.PROJECT_NAME,
            "version": config.VERSION
        }

    # Bind logical routers
    from app.auth.router import router as auth_router
    from app.ai.router import router as ai_router
    
    app.include_router(auth_router, prefix=config.API_V1_STR + "/auth", tags=["auth"])
    app.include_router(ai_router, prefix=config.API_V1_STR + "/ai", tags=["ai"])

    logger.info(f"{config.PROJECT_NAME} (v{config.VERSION}) initialized.")
    return app

app = create_app()
