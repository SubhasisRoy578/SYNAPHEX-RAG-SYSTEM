from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

class DocumentChunkResponse(BaseModel):
    id: UUID = Field(..., description="Chunk UUID")
    document_id: UUID = Field(..., description="Parent document UUID")
    user_id: UUID = Field(..., description="Owner user UUID")
    chunk_index: int = Field(..., description="Order of the chunk within the document")
    text_content: str = Field(..., description="Extracted text of the chunk")
    page_number: Optional[int] = Field(None, description="Source page number if known")
    start_offset: Optional[int] = Field(None, description="Character offset start in source")
    end_offset: Optional[int] = Field(None, description="Character offset end in source")
    extraction_method: Optional[str] = Field(None, description="Method used to extract text")
    created_at: str = Field(..., description="Timestamp of creation")
