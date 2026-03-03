import time
import logging
from fastapi import Request, FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from app.core.config import config

logger = logging.getLogger("app.core.middleware")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Async logging middleware.
    Logs basic request information, omitting sensitive payloads or headers. 
    """
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Pass execution to the next middleware or route handler
        try:
            response = await call_next(request)
            
            process_time = time.time() - start_time
            # Basic non-intrusive logging (no raw body/headers with secrets are logged)
            logger.info(
                f"{request.method} {request.url.path} - "
                f"Status: {response.status_code} - Time: {process_time:.4f}s"
            )
            return response
            
        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                f"Failed Request: {request.method} {request.url.path} - "
                f"Status: 500 - Time: {process_time:.4f}s",
                exc_info=True
            )
            # We re-raise, the global_exception_handler will catch it and return 500 JSON.
            raise e

def setup_middlewares(app: FastAPI):
    """Bootstrap all middlewares for the application."""
    
    # Add CORS middleware to allow specific origins from environment
    app.add_middleware(
        CORSMiddleware,
        allow_origins=config.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Add Request Logging Middleware
    app.add_middleware(RequestLoggingMiddleware)
