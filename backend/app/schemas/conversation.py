from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class ConversationCreateRequest(BaseModel):
    """Payload for creating a new conversation."""
    title: str = Field(min_length=1, max_length=200, description="Conversation title")
    scope_type: str = Field(default="document", description="'document', 'collection', or 'selected_documents'")
    document_id: Optional[UUID] = Field(default=None, description="Target document ID if single-document scope")
    collection_id: Optional[UUID] = Field(default=None, description="Target collection ID if collection scope")


class ConversationResponse(BaseModel):
    """Public representation of a conversation."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    scope_type: str
    document_id: Optional[UUID] = None
    collection_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
