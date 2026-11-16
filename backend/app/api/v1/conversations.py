from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.errors import AppException
from app.db.session import get_db
from app.models.conversation import Conversation
from app.models.document import Document
from app.models.collection import Collection
from app.models.user import User
from app.schemas.conversation import ConversationCreateRequest, ConversationResponse

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.get("", response_model=List[ConversationResponse], summary="List user's conversations")
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[ConversationResponse]:
    """Lists all conversations owned by the authenticated user."""
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )
    return [ConversationResponse.model_validate(c) for c in conversations]


@router.post(
    "",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new conversation session",
)
def create_conversation(
    payload: ConversationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ConversationResponse:
    """
    Creates a new conversation session with validated scope ownership.
    If scope references a document or collection, verifies ownership by current user.
    """
    # Scope ownership validation
    if payload.scope_type == "document" and payload.document_id:
        doc = (
            db.query(Document)
            .filter(Document.id == payload.document_id, Document.user_id == current_user.id)
            .first()
        )
        if not doc:
            raise AppException(
                code="DOCUMENT_NOT_FOUND",
                message="Target document for conversation scope not found or access denied.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

    if payload.scope_type == "collection" and payload.collection_id:
        col = (
            db.query(Collection)
            .filter(Collection.id == payload.collection_id, Collection.user_id == current_user.id)
            .first()
        )
        if not col:
            raise AppException(
                code="COLLECTION_NOT_FOUND",
                message="Target collection for conversation scope not found or access denied.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

    conv = Conversation(
        user_id=current_user.id,
        title=payload.title.strip(),
        scope_type=payload.scope_type,
        document_id=payload.document_id,
        collection_id=payload.collection_id,
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)

    return ConversationResponse.model_validate(conv)


@router.get("/{conversation_id}", response_model=ConversationResponse, summary="Get conversation details")
def get_conversation(
    conversation_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ConversationResponse:
    """Retrieves conversation details, enforcing user ownership."""
    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conv:
        raise AppException(
            code="CONVERSATION_NOT_FOUND",
            message="Conversation not found or access denied.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return ConversationResponse.model_validate(conv)


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a conversation")
def delete_conversation(
    conversation_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deletes a conversation owned by the authenticated user."""
    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conv:
        raise AppException(
            code="CONVERSATION_NOT_FOUND",
            message="Conversation not found or access denied.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    db.delete(conv)
    db.commit()
    return None
