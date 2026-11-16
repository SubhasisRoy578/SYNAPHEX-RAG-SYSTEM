from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.document import Document
from app.models.chunk import DocumentChunk
from app.schemas.chunk import DocumentChunkResponse
from app.services.chunking import search as qdrant_search
from app.core.errors import AppException

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("/document/{document_id}/chunks", response_model=List[DocumentChunkResponse], summary="List chunks for a document")
def list_document_chunks(document_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id, Document.deleted_at.is_(None)).first()
    if not doc:
        raise AppException(code="DOCUMENT_NOT_FOUND", message="Document not found or access denied.", status_code=status.HTTP_404_NOT_FOUND)
    chunks = db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).order_by(DocumentChunk.chunk_index).all()
    return [DocumentChunkResponse.model_validate(c) for c in chunks]

@router.get("/", response_model=List[DocumentChunkResponse], summary="Semantic search across user's documents")
def semantic_search(query: str = Query(..., description="Search query string"), top_k: int = Query(5, ge=1), score_threshold: float = Query(0.5, ge=0.0, le=1.0), current_user: User = Depends(get_current_user)):
    try:
        results = qdrant_search(query=query, user_id=str(current_user.id), top_k=top_k, score_threshold=score_threshold)
    except Exception as exc:
        raise AppException(code="SEARCH_ERROR", message=str(exc), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # Transform Qdrant results to schema
    out = []
    for hit in results:
        payload = hit.payload
        out.append(DocumentChunkResponse(
            id=hit.id,
            document_id=payload.get("document_id"),
            user_id=payload.get("user_id"),
            chunk_index=payload.get("chunk_index"),
            text_content=hit.vector,  # placeholder, real text not returned from Qdrant
            page_number=None,
            start_offset=None,
            end_offset=None,
            extraction_method=None,
            created_at="",
        ))
    return out
