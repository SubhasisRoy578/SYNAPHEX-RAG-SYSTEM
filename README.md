# SYNAPHEX — AI-Powered Document Intelligence Platform

> **"Turn Documents Into Knowledge."**

SYNAPHEX is a full-stack document intelligence platform that enables users to upload PDF, DOCX, and TXT documents, extract and index their contents, ask natural-language questions, receive evidence-grounded answers with verifiable citations, generate summaries, and compare documents.

The core engineering priority of SYNAPHEX is **reliable document processing and evidence-grounded Retrieval-Augmented Generation (RAG)**, with strict citation validation and zero hallucinated references.

---

## Repository Structure

```text
SYNAPHEX/
├── docs/                      # Six authoritative project planning documents
│   ├── 01-project-requirements.md
│   ├── 02-technical-requirements.md
│   ├── 03-appflow-navigation.md
│   ├── 04-ui-ux-design-brief.md
│   ├── 05-backend-schema.md
│   └── 06-implementation-plan.md
├── frontend/                  # React + TypeScript + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/        # Shared UI components & design system tokens
│   │   ├── pages/             # Route-level pages
│   │   ├── App.tsx            # Application router & layout shell
│   │   └── main.tsx           # Frontend entrypoint
│   ├── package.json
│   └── README.md
├── backend/                   # Python + FastAPI modular monolith API
│   ├── app/
│   │   ├── api/v1/            # Versioned API routes (health, ready, etc.)
│   │   ├── core/              # Configuration, logging, exception handlers
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── db/                # Database session & engine
│   │   ├── services/          # Business logic (parsing, chunking, RAG)
│   │   ├── workers/           # Asynchronous task workers
│   │   └── main.py            # FastAPI application entrypoint
│   ├── tests/                 # Backend automated test suite
│   ├── requirements.txt
│   └── README.md
├── evaluation/                # RAG evaluation datasets, metrics, and benchmarks
│   └── README.md
├── storage/                   # Local private file storage (.gitignored)
│   └── .gitkeep
├── .env.example               # Environment variables template
├── .gitignore
├── docker-compose.yml         # Local services (PostgreSQL, Qdrant)
└── README.md
```

---

## Technology Stack

- **Frontend:** React 19 / TypeScript / Vite / Tailwind CSS / React Router / Lucide React
- **Backend:** Python 3.11+ / FastAPI / Pydantic / SQLAlchemy / Alembic / PyMuPDF / python-docx / pytest
- **Data & AI:** PostgreSQL (relational) / Qdrant (vector) / Provider-independent LLM & Embedding adapter layer
- **Infrastructure:** Docker, Docker Compose

---

## Current Status: Phase 1 Complete

- [x] Workspace inspected and existing work preserved.
- [x] Six planning documents saved in `docs/`.
- [x] Repository structure established.
- [x] `.gitignore` configured to guard secrets, dependencies, and storage.
- [x] `.env.example` created with safe placeholders only.
- [x] Minimal FastAPI backend established with `/health`, `/ready`, CORS, safe logging, and Pydantic configuration.
- [x] Minimal React + TypeScript frontend established with all 13 required routes and UI design system tokens.
- [x] Automated backend tests passing.
- [x] Frontend builds cleanly for production.

---

## Local Development Guide

### Prerequisites
- Node.js (v18+) and npm
- Python (3.11+)
- Docker & Docker Compose (for PostgreSQL and Qdrant)

### 1. Environment Setup
Copy the template environment file:
```bash
cp .env.example .env
```
*(Review and configure variables as needed. Do not commit `.env`)*

### 2. Start Supporting Services (PostgreSQL & Qdrant)
```bash
docker-compose up -d
```

### 3. Backend Setup
From the `backend/` directory:
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API Health Check: `http://localhost:8000/health`
- Dependency Readiness: `http://localhost:8000/ready`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

To run tests:
```bash
pytest
```

### 4. Frontend Setup
From the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
- Frontend application will be available at: `http://localhost:5173`

To build the frontend bundle:
```bash
npm run build
```

---

## Core Engineering Principles

1. **Evidence-Grounded Answers:** Responses must be rooted in retrieved document passages. Unsupported claims and hallucinated citations are strictly prohibited.
2. **Security by Design:** Authentication and authorization are enforced server-side. Multi-tenant data isolation is applied to both relational and vector queries.
3. **No Fake Functionality:** UI elements reflect true system state. Placeholders are clearly marked as foundations for future phases.
4. **Auditability & Traceability:** All citations link directly to verified source excerpts, pages, and sections.
