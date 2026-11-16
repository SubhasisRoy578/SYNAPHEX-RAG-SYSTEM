from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.errors import AppException
from app.db.session import get_db
from app.models.collection import Collection
from app.models.user import User
from app.schemas.collection import CollectionCreateRequest, CollectionResponse

router = APIRouter(prefix="/collections", tags=["Collections"])


@router.get("", response_model=List[CollectionResponse], summary="List user's collections")
def list_collections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[CollectionResponse]:
    """Lists all collections owned by the authenticated user."""
    collections = (
        db.query(Collection)
        .filter(Collection.user_id == current_user.id)
        .order_by(Collection.created_at.desc())
        .all()
    )
    result = []
    for col in collections:
        doc_count = len(col.document_memberships) if hasattr(col, "document_memberships") else 0
        resp = CollectionResponse(
            id=col.id,
            name=col.name,
            description=col.description,
            created_at=col.created_at,
            updated_at=col.updated_at,
            document_count=doc_count,
        )
        result.append(resp)
    return result


@router.post(
    "",
    response_model=CollectionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new collection",
)
def create_collection(
    payload: CollectionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CollectionResponse:
    """Creates a new collection owned by the authenticated user."""
    col = Collection(
        user_id=current_user.id,
        name=payload.name.strip(),
        description=payload.description.strip() if payload.description else None,
    )
    db.add(col)
    db.commit()
    db.refresh(col)
    return CollectionResponse(
        id=col.id,
        name=col.name,
        description=col.description,
        created_at=col.created_at,
        updated_at=col.updated_at,
        document_count=0,
    )


@router.get("/{collection_id}", response_model=CollectionResponse, summary="Get collection details")
def get_collection(
    collection_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CollectionResponse:
    """Retrieves collection details, enforcing user ownership."""
    col = (
        db.query(Collection)
        .filter(Collection.id == collection_id, Collection.user_id == current_user.id)
        .first()
    )
    if not col:
        raise AppException(
            code="COLLECTION_NOT_FOUND",
            message="Collection not found or access denied.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    doc_count = len(col.document_memberships) if hasattr(col, "document_memberships") else 0
    return CollectionResponse(
        id=col.id,
        name=col.name,
        description=col.description,
        created_at=col.created_at,
        updated_at=col.updated_at,
        document_count=doc_count,
    )


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a collection")
def delete_collection(
    collection_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deletes a collection owned by the authenticated user."""
    col = (
        db.query(Collection)
        .filter(Collection.id == collection_id, Collection.user_id == current_user.id)
        .first()
    )
    if not col:
        raise AppException(
            code="COLLECTION_NOT_FOUND",
            message="Collection not found or access denied.",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    db.delete(col)
    db.commit()
    return None
