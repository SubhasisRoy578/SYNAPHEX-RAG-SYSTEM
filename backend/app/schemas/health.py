from datetime import datetime, timezone
from typing import Dict, Optional, Literal
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Basic service health check response schema."""
    status: Literal["ok", "error"] = "ok"
    app: str = "SYNAPHEX"
    environment: str
    version: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DependencyStatus(BaseModel):
    """Status details for an individual backend dependency."""
    status: Literal["operational", "unconfigured", "unavailable", "degraded"]
    description: str
    latency_ms: Optional[float] = None


class ReadinessResponse(BaseModel):
    """
    Readiness probe response schema.
    Clearly distinguishes whether dependencies are configured and reachable.
    """
    status: Literal["ready", "degraded", "not_ready"]
    app: str = "SYNAPHEX"
    version: str
    phase: str = "Phase 1: Foundation"
    dependencies: Dict[str, DependencyStatus]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
