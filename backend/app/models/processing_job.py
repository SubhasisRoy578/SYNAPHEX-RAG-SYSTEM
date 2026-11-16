import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    Uuid,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from app.models.base import Base


class ProcessingJob(Base):
    """
    Asynchronous ingestion, parsing, chunking, and deletion jobs.
    Conforms to Doc 05 Backend Schema (Section 4.6).
    """
    __tablename__ = "processing_jobs"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    document_id = Column(
        Uuid,
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(
        Uuid,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    job_type = Column(String(30), nullable=False)
    status = Column(String(20), default="queued", nullable=False)
    stage = Column(String(50), nullable=True)
    attempt_count = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=3, nullable=False)
    error_code = Column(String(100), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    next_retry_at = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("ix_processing_jobs_status_retry", "status", "next_retry_at"),
    )

    # Relationships
    document = relationship("Document", back_populates="processing_jobs")
    user = relationship("User", back_populates="processing_jobs")
