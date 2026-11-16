from typing import List, Tuple
from hashlib import sha256
from ..core.config import settings
from . import embedding
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, Filter, FieldCondition, MatchValue
import uuid

# Initialize Qdrant client (singleton)
_qdrant_client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY or None)

def _ensure_collection():
    """Create collection if it doesn't exist."""
    collections = _qdrant_client.get_collections().collections
    if not any(c.name == settings.QDRANT_COLLECTION_NAME for c in collections):
        _qdrant_client.create_collection(
            collection_name=settings.QDRANT_COLLECTION_NAME,
            vectors_config={'size': settings.EMBEDDING_DIMENSION, 'distance': 'Cosine'}
        )

def chunk_text(text: str, size: int = None, overlap: int = None) -> List[Tuple[int, str]]:
    """Split *text* into overlapping chunks.
    Returns list of (chunk_index, chunk_text).
    Full-size chunks are emitted while possible; any remaining characters after the
    last full chunk are emitted as a final smaller chunk. Duplicate trailing
    chunks (caused by overlap) are removed.
    """
    size = size or settings.CHUNK_SIZE
    overlap = overlap or settings.CHUNK_OVERLAP
    if size <= 0:
        raise ValueError("Chunk size must be positive")
    chunks: List[Tuple[int, str]] = []
    i = 0
    while i < len(text):
        chunk = text[i:i + size]
        chunks.append((len(chunks), chunk))
        i += size - overlap
    # Remove duplicate final chunk if overlap caused the same text to appear twice
    if len(chunks) >= 2 and chunks[-1][1] == chunks[-2][1]:
        chunks.pop()
    return chunks

def index_chunks(user_id: str, document_id: str, chunks: List[Tuple[int, str]]):
    """Generate embeddings for *chunks* and upsert them to Qdrant.
    Each point stores metadata to enforce isolation.
    """
    _ensure_collection()
    texts = [c[1] for c in chunks]
    embeddings = embed_texts(texts)
    points = []
    for (idx, txt), vector in zip(chunks, embeddings):
        payload = {
            "user_id": user_id,
            "document_id": document_id,
            "chunk_index": idx,
            "text_hash": get_text_hash(txt),
        }
        points.append(PointStruct(id=uuid.uuid4(), vector=vector, payload=payload))
    _qdrant_client.upsert(collection_name=settings.QDRANT_COLLECTION_NAME, points=points)

def search(query: str, user_id: str, top_k: int = 5, score_threshold: float = 0.5):
    """Perform semantic search for *query* limited to *user_id*.
    Returns list of points with their payloads and scores.
    """
    _ensure_collection()
    query_vec = embed_texts([query])[0]
    filter_ = Filter(must=[
        FieldCondition(key="user_id", match=MatchValue(value=user_id))
    ])
    results = _qdrant_client.search(
        collection_name=settings.QDRANT_COLLECTION_NAME,
        query_vector=query_vec,
        limit=top_k,
        filter=filter_,
        score_threshold=score_threshold,
    )
    return results
