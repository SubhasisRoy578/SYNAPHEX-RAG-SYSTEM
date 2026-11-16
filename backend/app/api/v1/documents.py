from typing import List
from uuid import UUID
import uuid
import os
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, Depends, status, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.errors import AppException
from app.core.config import settings
from app.db.session import get_db, SessionLocal
from app.models.document import Document
from app.models.processing_job import ProcessingJob
from app.models.user import User
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------

def _secure_filename(original: str) -> str:
    """Generate a safe storage filename using a UUID while preserving extension."""
    ext = os.path.splitext(original)[1].lower()
    return f"{uuid.uuid4()}{ext}"

def _ensure_storage_path() -> Path:
    """Ensure the shared storage directory exists and return its Path."""
    storage_root = Path(settings.STORAGE_ROOT)
    storage_root.mkdir(parents=True, exist_ok=True)
    return storage_root

def _validate_upload(file: UploadFile) -> bytes:
    """Validate size and MIME type, then read file content into memory."""
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    content = file.file.read()
    if len(content) > max_bytes:
        raise AppException(
            code="FILE_TOO_LARGE",
            message=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_MB} MB.",
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
        )
    allowed = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
    }
    if file.content_type not in allowed:
        raise AppException(
            code="UNSUPPORTED_MEDIA_TYPE",
            message=f"Unsupported file type: {file.content_type}",
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
        )
    return content

# ---------------------------------------------------------------------------
# Background processing
# ---------------------------------------------------------------------------

def _chunk_and_index(document_id: UUID, user_id: UUID, text: str, db: Session):
    """Chunk the extracted *text*, store chunks in DB, and index them in Qdrant.
    This function runs synchronously inside the background processing task.
    """
    from app.services.chunking import chunk_text, index_chunks
    from app.models.chunk import DocumentChunk
    from app.core.errors import AppException
    from hashlib import sha256

    # Split into overlapping chunks
    try:
        chunks = chunk_text(text)
    except Exception as exc:
        raise AppException(code="CHUNKING_ERROR", message=str(exc), status_code=500)

    # Store chunks in the DB
    for idx, chunk_text in chunks:
        # Compute stable hash for deduplication
        content_hash = sha256(chunk_text.encode("utf-8")).hexdigest()
        doc_chunk = DocumentChunk(
            id=uuid.uuid4(),
            document_id=document_id,
            user_id=user_id,
            chunk_index=idx,
            text_content=chunk_text,
            extraction_method="extraction",  # could be "ocr" etc. Simplified.
            content_hash=content_hash,
        )
        db.add(doc_chunk)
    db.commit()

    # Prepare data for Qdrant indexing
    # Retrieve the freshly saved chunks to retain their DB IDs (optional)
    saved_chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.chunk_index)
        .all()
    )

    # Build list of (index, text) for embedding and indexing
    embed_list = [(c.chunk_index, c.text_content) for c in saved_chunks]
    # Index in Qdrant (provider‑independent service handles embeddings)
    try:
        index_chunks(str(user_id), str(document_id), embed_list)
    except Exception as exc:
        # If indexing fails, we keep the DB chunks but mark document as failed for indexing.
        raise AppException(code="INDEXING_ERROR", message=str(exc), status_code=500)

    """Extract text and metadata, store preview, then chunk and index the document.
    This runs in a background task.
    """
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            return
        # Mark as processing
        doc.status = "processing"
        db.commit()

        text_content = ""
        page_count = None
        try:
            if mime_type == "application/pdf":
                import fitz
                pdf = fitz.open(str(file_path))
                page_count = pdf.page_count
                for page in pdf:
                    txt = page.get_text().strip()
                    if txt:
                        text_content += txt + "\n"
                if not text_content.strip() and settings.OCR_ENABLED:
                    try:
                        import pytesseract
                        from PIL import Image
                        for page in pdf:
                            pix = page.get_pixmap()
                            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                            text_content += pytesseract.image_to_string(img) + "\n"
                    except Exception as exc:
                        doc.status = "failed"
                        doc.error_message = f"OCR failed: {exc}"
                        db.commit()
                        return
            elif mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                import docx
                docx_file = docx.Document(str(file_path))
                text_content = "\n".join(p.text for p in docx_file.paragraphs)
            elif mime_type == "text/plain":
                text_content = file_path.read_text(encoding="utf-8")
            else:
                raise ValueError("Unsupported MIME type during processing")

            # Update document record with preview and status
            doc.status = "completed"
            doc.processed_at = datetime.utcnow()
            doc.page_count = page_count
            # Store full extracted text in error_message for now (temporary).
            doc.error_message = text_content[:2000]
            db.commit()

            # After successful extraction, start chunking and indexing
            _chunk_and_index(doc.id, doc.user_id, text_content, db)
        except Exception as exc:
            doc.status = "failed"
            doc.error_message = str(exc)
            db.commit()
    finally:
        db.close()

    """Extract text and metadata, store preview, then chunk and index the document.
    This runs in a background task.
    """
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            return
        # Mark as processing
        doc.status = "processing"
        db.commit()

        text_content = ""
        page_count = None
        try:
            if mime_type == "application/pdf":
                import fitz
                pdf = fitz.open(str(file_path))
                page_count = pdf.page_count
                for page in pdf:
                    txt = page.get_text().strip()
                    if txt:
                        text_content += txt + "\n"
                if not text_content.strip() and settings.OCR_ENABLED:
                    try:
                        import pytesseract
                        from PIL import Image
                        for page in pdf:
                            pix = page.get_pixmap()
                            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                            text_content += pytesseract.image_to_string(img) + "\n"
                    except Exception as exc:
                        doc.status = "failed"
                        doc.error_message = f"OCR failed: {exc}"
                        db.commit()
                        return
            elif mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                import docx
                docx_file = docx.Document(str(file_path))
                text_content = "\n".join(p.text for p in docx_file.paragraphs)
            elif mime_type == "text/plain":
                text_content = file_path.read_text(encoding="utf-8")
            else:
                raise ValueError("Unsupported MIME type during processing")

            # Update document record with preview and status
            doc.status = "completed"
            doc.processed_at = datetime.utcnow()
            doc.page_count = page_count
            # Store full extracted text in error_message for now (temporary).
            doc.error_message = text_content[:2000]
            db.commit()

            # After successful extraction, start chunking and indexing
            _chunk_and_index(doc.id, text_content)
        except Exception as exc:
            doc.status = "failed"
            doc.error_message = str(exc)
            db.commit()
    finally:
        db.close()
    """Extract text and metadata in a background task.
    Updates the Document status and creates a ProcessingJob entry.
    """
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            return
        # Mark as processing
        doc.status = "processing"
        db.commit()

        text_content = ""
        page_count = None
        try:
            if mime_type == "application/pdf":
                import fitz
                pdf = fitz.open(str(file_path))
                page_count = pdf.page_count
                # Extract text; if none, treat as scanned PDF and attempt OCR
                for page in pdf:
                    txt = page.get_text().strip()
                    if txt:
                        text_content += txt + "\n"
                if not text_content.strip():
                    try:
                        import pytesseract
                        from PIL import Image
                        for page in pdf:
                            pix = page.get_pixmap()
                            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                            text_content += pytesseract.image_to_string(img) + "\n"
                    except Exception as exc:
                        doc.status = "failed"
                        doc.error_message = f"OCR failed: {exc}"
                        db.commit()
                        return
            elif mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                import docx
                docx_file = docx.Document(str(file_path))
                text_content = "\n".join(p.text for p in docx_file.paragraphs)
            elif mime_type == "text/plain":
                text_content = file_path.read_text(encoding="utf-8")
            else:
                raise ValueError("Unsupported MIME type during processing")

            # Update document record
            doc.status = "completed"
            doc.processed_at = datetime.utcnow()
            doc.page_count = page_count
            # Store a preview of extracted text (first 2000 chars)
            doc.error_message = text_content[:2000]
            db.commit()

            # Record processing job
            job = ProcessingJob(
                id=uuid.uuid4(),
                document_id=document_id,
                user_id=doc.user_id,
                job_type="extraction",
                status="completed",
                attempt_count=1,
                max_attempts=1,
                created_at=datetime.utcnow(),
                started_at=datetime.utcnow(),
                finished_at=datetime.utcnow(),
            )
            db.add(job)
            db.commit()
        except Exception as exc:
            doc.status = "failed"
            doc.error_message = str(exc)
            db.commit()
    finally:
        db.close()

# ---------------------------------------------------------------------------
# API routes
# ---------------------------------------------------------------------------

@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a new document (PDF, DOCX, TXT)",
)
def upload_document(
    background: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentResponse:
    """Handle file upload, store securely, create Document entry, and start async processing."""
    content = _validate_upload(file)
    storage_dir = _ensure_storage_path()
    stored_name = _secure_filename(file.filename)
    file_path = storage_dir / stored_name
    # Write file atomically
    with open(file_path, "wb") as f:
        f.write(content)

    doc = Document(
        id=uuid.uuid4(),
        user_id=current_user.id,
        filename=file.filename,
        storage_key=str(file_path),
        mime_type=file.content_type,
        file_extension=os.path.splitext(file.filename)[1].lower().lstrip('.'),
        file_size_bytes=len(content),
        content_hash="",
        status="uploaded",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    background.add_task(_process_document, doc.id, file_path, file.content_type)
    # After extraction, start chunking and indexing in background
    background.add_task(_chunk_and_index, doc.id)
    return DocumentResponse.model_validate(doc)

@router.get("", response_model=List[DocumentResponse], summary="List authenticated user's documents")
def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[DocumentResponse]:
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id, Document.deleted_at.is_(None))
        .order_by(Document.created_at.desc())
        .all()
    )
    return [DocumentResponse.model_validate(doc) for doc in documents]

@router.get("/{document_id}", response_model=DocumentResponse, summary="Get document metadata")
def get_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DocumentResponse:
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id,
            Document.deleted_at.is_(None),
        )
        .first()
    )
    if not document:
        raise AppException(
            code="DOCUMENT_NOT_FOUND",
            message="Document not found or access denied.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return DocumentResponse.model_validate(document)

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a document")
def delete_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(Document.id == document_id, Document.user_id == current_user.id)
        .first()
    )
    if not document:
        raise AppException(
            code="DOCUMENT_NOT_FOUND",
            message="Document not found or access denied.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    # Delete stored file if present
    try:
        path = Path(document.storage_key)
        if path.exists():
            path.unlink()
    except Exception:
        pass
    db.delete(document)
    db.commit()
    return None
