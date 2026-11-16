import os
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthResponse, ReadinessResponse, DependencyStatus

router = APIRouter(tags=["System"])


@router.get("/health", response_model=HealthResponse, summary="Service Health Check")
async def get_health() -> HealthResponse:
    """
    Returns basic application liveness status.
    Used by container orchestrators and load balancers to determine if process is alive.
    """
    return HealthResponse(
        status="ok",
        app=settings.APP_NAME,
        environment=settings.APP_ENV,
        version=settings.APP_VERSION,
    )


@router.get("/ready", response_model=ReadinessResponse, summary="Dependency Readiness Probe")
async def get_readiness() -> ReadinessResponse:
    """
    Evaluates backend readiness across dependencies with explicit, honest semantics.
    In Phase 1, external dependencies (Postgres, Qdrant) are reported as 'unconfigured'
    until their respective integration phases and credentials/services are verified.
    """
    dependencies = {}

    # 1. Local Storage Dependency
    storage_path = os.path.abspath(settings.STORAGE_ROOT)
    if os.path.exists(storage_path) and os.access(storage_path, os.W_OK):
        dependencies["file_storage"] = DependencyStatus(
            status="operational",
            description=f"Local storage directory accessible at '{settings.STORAGE_ROOT}'.",
        )
    else:
        dependencies["file_storage"] = DependencyStatus(
            status="degraded",
            description=f"Storage path '{settings.STORAGE_ROOT}' is not writable.",
        )

    # 2. Relational Database (PostgreSQL) - Active in Phase 3
    from app.db.session import check_db_connection
    is_db_connected = check_db_connection()
    dependencies["relational_database"] = DependencyStatus(
        status="operational" if is_db_connected else "unconfigured",
        description=(
            "PostgreSQL database connection is active and operational."
            if is_db_connected
            else "PostgreSQL schema & models configured. Waiting for active database connection."
        ),
    )

    # 3. Vector Database (Qdrant) - Scheduled for Phase 5
    dependencies["vector_search"] = DependencyStatus(
        status="unconfigured",
        description="Qdrant vector collection configured for Phase 5 (RAG Retrieval).",
    )

    # 4. AI Provider - Scheduled for Phase 5
    has_llm_key = bool(settings.LLM_API_KEY and settings.LLM_API_KEY.strip())
    dependencies["ai_provider"] = DependencyStatus(
        status="operational" if has_llm_key else "unconfigured",
        description=(
            f"Configured for '{settings.LLM_PROVIDER}' with model '{settings.LLM_MODEL}'."
            if has_llm_key
            else f"Provider set to '{settings.LLM_PROVIDER}'. API key not yet supplied."
        ),
    )

    # Overall system status for Phase 1
    # Phase 1 is ready if the core application server and storage foundation are active.
    storage_ok = dependencies["file_storage"].status == "operational"
    overall_status = "ready" if storage_ok else "degraded"

    return ReadinessResponse(
        status=overall_status,
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        phase="Phase 1: Foundation",
        dependencies=dependencies,
    )
