# Re-export Base and all models so that Alembic and metadata reflection find every table
from app.models import (
    Base,
    User,
    Document,
    Collection,
    CollectionDocument,
    DocumentChunk,
    ProcessingJob,
    Conversation,
    Message,
    MessageCitation,
)

__all__ = [
    "Base",
    "User",
    "Document",
    "Collection",
    "CollectionDocument",
    "DocumentChunk",
    "ProcessingJob",
    "Conversation",
    "Message",
    "MessageCitation",
]
