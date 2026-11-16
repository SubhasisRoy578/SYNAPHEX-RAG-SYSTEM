import os
import hashlib
from typing import List
from ..core.config import settings

# Simple provider‑independent adapter. Currently only OpenAI embeddings are supported.
# Additional providers can be added by extending the `embed` function.

def _hash_text(text: str) -> str:
    """Return a stable hash for a chunk of text (used for deduplication)."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def embed_texts(texts: List[str]) -> List[List[float]]:
    """Return embedding vectors for the given list of texts.

    The implementation chooses the provider based on `settings.EMBEDDING_PROVIDER`.
    If the provider is unsupported or the required API key is missing, a
    ``RuntimeError`` is raised so the caller can surface a clear error.
    """
    provider = settings.EMBEDDING_PROVIDER.lower()
    if provider == "openai":
        try:
            import openai
        except ImportError as exc:
            raise RuntimeError("OpenAI SDK not installed") from exc
        openai.api_key = settings.EMBEDDING_API_KEY or os.getenv("OPENAI_API_KEY")
        if not openai.api_key:
            raise RuntimeError("OpenAI API key not configured for embeddings")
        response = openai.embeddings.create(
            model=settings.EMBEDDING_MODEL,
            input=texts,
        )
        return [emb.embedding for emb in response.data]
    else:
        raise RuntimeError(f"Unsupported embedding provider: {provider}")

def get_text_hash(text: str) -> str:
    """Public helper to compute a stable hash for a chunk of text."""
    return _hash_text(text)
