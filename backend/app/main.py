import time
import uuid
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import logger
from app.core.errors import (
    AppException,
    app_exception_handler,
    validation_exception_handler,
    http_exception_handler,
    unhandled_exception_handler,
)
from app.api.v1.router import api_v1_router
from app.api.v1.health import router as system_router


def create_application() -> FastAPI:
    """Factory function to initialize and configure the FastAPI application."""
    application = FastAPI(
        title=f"{settings.APP_NAME} API",
        description=(
            "SYNAPHEX — AI-Powered Document Intelligence Platform API.\n\n"
            "Provides reliable document ingestion, semantic vector retrieval, "
            "citation-grounded question answering, and multi-document analysis."
        ),
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # 1. CORS Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Request ID & Timing Middleware
    @application.middleware("http")
    async def request_context_middleware(request: Request, call_next) -> Response:
        # Extract existing or generate new unique request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        start_time = time.time()

        response: Response = await call_next(request)

        duration_ms = (time.time() - start_time) * 1000
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration_ms:.2f}ms"

        # Log request completion safely
        logger.debug(
            f"{request.method} {request.url.path} - "
            f"Status: {response.status_code} ({duration_ms:.1f}ms) [req_id={request_id}]"
        )
        return response

    # 3. Exception Handlers
    application.add_exception_handler(AppException, app_exception_handler)
    application.add_exception_handler(RequestValidationError, validation_exception_handler)
    application.add_exception_handler(StarletteHTTPException, http_exception_handler)
    application.add_exception_handler(Exception, unhandled_exception_handler)

    # 4. Top-level System Routes (/health, /ready)
    application.include_router(system_router, prefix="", tags=["System"])

    # 5. Versioned API Routes (/api/v1)
    application.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    # 6. Root Landing Endpoint
    @application.get("/", tags=["Root"])
    async def root_info():
        return {
            "app": settings.APP_NAME,
            "tagline": "Turn Documents Into Knowledge.",
            "version": settings.APP_VERSION,
            "status": "operational",
            "phase": "Phase 1: Project Foundation",
            "docs": "/docs",
            "health": "/health",
            "ready": "/ready",
            "api_v1": settings.API_V1_PREFIX,
        }

    return application


app = create_application()
