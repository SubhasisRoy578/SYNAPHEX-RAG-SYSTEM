import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Uuid,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from app.models.base import Base


class Collection(Base):
    """
    User-defined document collections for multi-document synthesis.
    Conforms to Doc 05 Backend Schema (Section 4.3).
    """
    __tablename__ = "collections"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        Index("ix_collections_user_name", "user_id", "name"),
    )

    # Relationships
    user = relationship("User", back_populates="collections")
    document_memberships = relationship(
        "CollectionDocument",
        back_populates="collection",
        cascade="all, delete-orphan",
    )


class CollectionDocument(Base):
    """
    Many-to-many relationship between collections and documents.
    Conforms to Doc 05 Backend Schema (Section 4.4).
    """
    __tablename__ = "collection_documents"

    collection_id = Column(
        Uuid,
        ForeignKey("collections.id", ondelete="CASCADE"),
        primary_key=True,
    )
    document_id = Column(
        Uuid,
        ForeignKey("documents.id", ondelete="CASCADE"),
        primary_key=True,
    )
    added_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    collection = relationship("Collection", back_populates="document_memberships")
    document = relationship("Document", back_populates="collection_memberships")
