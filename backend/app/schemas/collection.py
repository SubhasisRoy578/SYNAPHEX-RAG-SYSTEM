from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class CollectionCreateRequest(BaseModel):
    """Payload for creating a new user collection."""
    name: str = Field(min_length=1, max_length=150, description="Collection name")
    description: Optional[str] = Field(default=None, description="Optional description")


class CollectionResponse(BaseModel):
    """Public representation of a collection."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    document_count: int = 0
