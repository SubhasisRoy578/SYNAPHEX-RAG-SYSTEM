from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    """Public metadata representation of a document."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    filename: str
    mime_type: str
    file_extension: str
    file_size_bytes: int
    status: str
    chunk_count: int = 0
    page_count: Optional[int] = None
    created_at: datetime
    updated_at: datetime
