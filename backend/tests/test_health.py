import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify that the root endpoint returns application metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "SYNAPHEX"
    assert data["status"] == "operational"
    assert "version" in data
    assert "tagline" in data


def test_health_endpoint():
    """Verify top-level /health endpoint returns status ok and environment."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "SYNAPHEX"
    assert "timestamp" in data
    assert "environment" in data


def test_versioned_health_endpoint():
    """Verify versioned /api/v1/health endpoint behaves identically."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "SYNAPHEX"


def test_readiness_endpoint():
    """Verify /ready endpoint returns dependency status with explicit semantics."""
    response = client.get("/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ready", "degraded"]
    assert "dependencies" in data
    assert "file_storage" in data["dependencies"]
    assert "relational_database" in data["dependencies"]
    assert "vector_search" in data["dependencies"]
    # In Phase 1, DB and Vector must be marked unconfigured
    assert data["dependencies"]["relational_database"]["status"] == "unconfigured"
    assert data["dependencies"]["vector_search"]["status"] == "unconfigured"


def test_request_id_middleware():
    """Verify that every response receives an X-Request-ID header."""
    response = client.get("/health")
    assert "X-Request-ID" in response.headers
    assert len(response.headers["X-Request-ID"]) > 0


def test_custom_request_id_propagation():
    """Verify that a client-provided X-Request-ID is preserved in response."""
    custom_id = "test-custom-req-id-12345"
    response = client.get("/health", headers={"X-Request-ID": custom_id})
    assert response.headers["X-Request-ID"] == custom_id


def test_standardized_error_format_on_404():
    """Verify 404 responses conform to the structured error specification."""
    response = client.get("/non-existent-route-for-testing")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert "code" in data["error"]
    assert data["error"]["code"] == "NOT_FOUND"
    assert "message" in data["error"]
    assert "request_id" in data["error"]
