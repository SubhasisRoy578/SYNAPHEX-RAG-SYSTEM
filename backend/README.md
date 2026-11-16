# SYNAPHEX — Backend Service

## Overview
The backend service of **SYNAPHEX** is built with Python 3.11+ and FastAPI as a modular monolith. It provides high-performance asynchronous API endpoints, document validation and ingestion pipelines, vector search integration, and evidence-grounded AI answer generation.

## Directory Structure
```text
backend/
├── app/
│   ├── api/                   # API versioning & endpoint routers
│   │   └── v1/                # Version 1 routes (/api/v1)
│   │       ├── health.py      # Health & readiness probes
│   │       └── router.py      # Aggregated v1 router
│   ├── core/                  # Core infrastructure
│   │   ├── config.py          # Environment settings via Pydantic
│   │   ├── logging.py         # Safe, structured application logger
│   │   └── errors.py          # Standardized error responses & handlers
│   ├── models/                # SQLAlchemy database models (Phase 3)
│   ├── schemas/               # Pydantic validation & transfer schemas
│   │   └── health.py          # Health & readiness response schemas
│   ├── db/                    # PostgreSQL session & migration engine (Phase 3)
│   ├── services/              # Domain logic (parsing, chunking, RAG) (Phases 4-5)
│   ├── workers/               # Asynchronous task workers (Phase 4)
│   └── main.py                # FastAPI application entrypoint
├── tests/                     # Automated test suite (pytest)
│   ├── __init__.py
│   └── test_health.py         # Health, readiness, and error tests
├── requirements.txt           # Python dependency manifest
└── README.md
```

## Setup & Local Execution

### 1. Create Virtual Environment
```bash
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Interactive Documentation
- OpenAPI Swagger UI: `http://localhost:8000/docs`
- ReDoc UI: `http://localhost:8000/redoc`

## API Endpoints (Phase 1 Baseline)

| Endpoint | Method | Purpose | Response |
|---|---|---|---|
| `/` | GET | Root API discovery & service info | JSON metadata |
| `/health` | GET | Liveness health check | `HealthResponse` |
| `/ready` | GET | Dependency readiness probe | `ReadinessResponse` |
| `/api/v1/health` | GET | Versioned health check | `HealthResponse` |
| `/api/v1/ready` | GET | Versioned readiness probe | `ReadinessResponse` |

## Standard Error Response Format
All error responses strictly comply with Technical Requirements Document (Doc 02, Sec 9):
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "request_id": "8f8b8d96-b076-4d1e-8484-df9bfa3c6123"
  }
}
```

## Running Automated Tests
```bash
pytest
```
Run with verbose output:
```bash
pytest -v
```
