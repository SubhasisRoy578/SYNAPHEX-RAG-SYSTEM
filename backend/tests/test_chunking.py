import pytest
from unittest.mock import patch, MagicMock

from backend.app.services.chunking import chunk_text, index_chunks, search
from backend.app.services.embedding import get_text_hash

# Helper to generate dummy embedding vectors
def dummy_embeddings(texts):
    # Return a list of vectors of length settings.EMBEDDING_DIMENSION (e.g., 3)
    return [[float(i) for i in range(3)] for _ in texts]

def test_chunk_text_basic():
    text = "abcdefghij"
    # size 4 overlap 2 -> chunks: abcde, cdefg, efghi, ghij
    chunks = chunk_text(text, size=4, overlap=2)
    assert len(chunks) == 4
    assert [c[1] for c in chunks] == ["abcd", "cdef", "efgh", "ij"]

def test_chunk_text_overlap_edge():
    text = "12345"
    # size larger than text
    chunks = chunk_text(text, size=10, overlap=2)
    assert len(chunks) == 1
    assert chunks[0][1] == "12345"

@patch("backend.app.services.embedding.embed_texts", side_effect=dummy_embeddings)
@patch("backend.app.services.chunking._qdrant_client")
def test_index_chunks_calls_qdrant(mock_qdrant, mock_embed):
    mock_qdrant.upsert = MagicMock()
    user_id = "user1"
    doc_id = "doc1"
    chunks = [(0, "chunk A"), (1, "chunk B")]
    index_chunks(user_id, doc_id, chunks)
    # ensure embed called with texts
    mock_embed.assert_called_once_with(["chunk A", "chunk B"])
    # ensure upsert called with two points
    assert mock_qdrant.upsert.call_count == 1
    args, kwargs = mock_qdrant.upsert.call_args
    points = kwargs["points"]
    assert len(points) == 2
    # payload should contain correct metadata
    for pt, (idx, txt) in zip(points, chunks):
        payload = pt.payload
        assert payload["user_id"] == user_id
        assert payload["document_id"] == doc_id
        assert payload["chunk_index"] == idx
        assert payload["text_hash"] == get_text_hash(txt)

@patch("backend.app.services.embedding.embed_texts", side_effect=dummy_embeddings)
@patch("backend.app.services.chunking._qdrant_client")
def test_search_filters_user(mock_qdrant, mock_embed):
    mock_qdrant.search = MagicMock(return_value=["result1", "result2"])
    results = search("query", user_id="userX", top_k=2, score_threshold=0.1)
    mock_qdrant.search.assert_called_once()
    # ensure filter includes user_id
    call_args = mock_qdrant.search.call_args[1]
    filter_obj = call_args["filter"]
    assert any(cond.key == "user_id" for cond in filter_obj.must)
    assert results == ["result1", "result2"]
