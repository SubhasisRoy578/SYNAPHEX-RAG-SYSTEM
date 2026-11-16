# DOCUMENT 2 — TECHNICAL REQUIREMENTS DOCUMENT

## 1. Purpose

This document defines the technical architecture, frameworks, interfaces, processing pipeline, security controls, and quality requirements for SYNAPHEX.

The architecture should be appropriate for a student-built project while allowing later improvements without rewriting the entire system.

## 2. Architecture Overview

SYNAPHEX will use a modular monolithic backend initially, rather than multiple independently deployed microservices.

### Logical architecture

```text
Browser
  |
  v
React + TypeScript Frontend
  |
  v
FastAPI REST API
  |
  +---- Authentication and Authorisation
  |
  +---- PostgreSQL
  |       Users, documents, jobs, conversations
  |
  +---- Private File Storage
  |       Original uploaded files
  |
  +---- Document Processing Pipeline
  |       Parsing -> OCR -> Chunking -> Embeddings
  |
  +---- Qdrant Vector Search
  |       Chunk vectors and retrieval metadata
  |
  +---- AI Provider Adapter
          Embeddings / LLM generation
```

The initial application can run as a frontend service and a backend service, with PostgreSQL and Qdrant as supporting services. A background worker can be introduced for asynchronous processing. It should not be added until there is a clear need for it.

## 3. Technology Stack

### Frontend

| Component | Selected technology | Purpose |
|---|---|---|
| Framework | React | UI composition |
| Language | TypeScript | Static type checking |
| Build tooling | Vite | Development and production builds |
| Styling | Tailwind CSS | Responsive UI implementation |
| Routing | React Router | Client-side navigation |
| Server state | TanStack Query or equivalent | API requests, caching, loading states |
| Local UI state | React state initially | Tabs, dialogs, reader controls |
| PDF viewing | PDF.js or a compatible React wrapper | PDF rendering and page navigation |
| Icons | Lucide React | Consistent interface icons |
| Testing | Vitest and React Testing Library | Component and frontend tests |

Do not introduce multiple state-management libraries unless the project develops a concrete need for them.

### Backend

| Component | Selected technology | Purpose |
|---|---|---|
| Language | Python | Document and AI processing |
| API framework | FastAPI | HTTP endpoints and validation |
| Validation | Pydantic | Request and response schemas |
| ORM | SQLAlchemy | Relational persistence |
| Migrations | Alembic | Database schema changes |
| PDF extraction | PyMuPDF | Text and page extraction |
| DOCX extraction | python-docx | Word paragraphs and tables |
| OCR | Tesseract with an appropriate PDF/image pipeline | Scanned-document text extraction |
| Vector database | Qdrant | Embedding storage and similarity search |
| Relational database | PostgreSQL | Users, document metadata, messages, jobs |
| Testing | pytest | Backend and integration tests |
| Deployment | Docker and Docker Compose | Reproducible environments |

### AI layer

- Use a provider adapter for chat completion and embedding generation.
- Select a compatible embedding model and record its model identifier.
- Keep embedding dimensions consistent with the Qdrant collection configuration.
- Use a hosted LLM provider initially if access and budget permit.
- Allow a local or alternative provider later through the adapter interface.
- Never expose API keys in frontend code or committed files.
- Do not promise compatibility with every provider before implementing and testing its adapter.

## 4. Storage Design

### PostgreSQL
Stores:
- User accounts and authentication references.
- Document metadata and processing status.
- Collections and collection membership.
- Chunk metadata and source locations.
- Processing jobs.
- Conversations, messages, and citation records.
- Audit-relevant events where required.

### Qdrant
Stores:
- Embedding vectors.
- Stable chunk identifiers.
- Filterable metadata such as `user_id`, `document_id`, and chunk index.

PostgreSQL remains the source of truth for application records. Qdrant is the search index, not a substitute for relational integrity.

### Original files
- Use private local storage for development.
- Use private object storage for a deployed version when available.
- Store opaque internal storage keys in the database rather than exposing filesystem paths.
- Use controlled download endpoints with ownership checks.

## 5. Document Ingestion Requirements

### 5.1 Upload validation

The API must:
1. Require authentication.
2. Enforce file-size limits.
3. Validate the permitted format and inspect file content.
4. Generate a safe internal storage key.
5. Store the file privately.
6. Create a document record and processing job.
7. Return a document ID and current status.

Initial maximum size: 25 MB, configurable via environment variables.

### 5.2 Parsing

**PDF**
- Extract text by page using PyMuPDF.
- Preserve page numbers and page-level extraction metadata.
- Detect documents with little or no extractable text.
- Route eligible scanned pages through OCR.
- Record extraction warnings.

**DOCX**
- Extract paragraphs, headings, and basic tables using python-docx.
- Preserve logical section information where possible.
- Record that precise PDF-style page coordinates are not guaranteed for DOCX content.

**TXT**
- Decode using a controlled encoding strategy.
- Normalise line endings.
- Preserve paragraphs and character offsets where useful.

### 5.3 OCR

- OCR should be an explicit processing stage.
- Use OCR when a PDF page contains insufficient extractable text and the page appears to contain scanned content.
- Record whether text came from normal extraction or OCR.
- Make OCR configurable because it increases processing time and resource use.
- Provide an error or warning when OCR is unavailable or unsuccessful.

### 5.4 Chunking

Initial experiment settings:
- Target chunk size: approximately 500–800 tokens.
- Overlap: approximately 80–120 tokens.
- Split on paragraph and section boundaries when practical.
- Keep headings attached to their relevant text.
- Avoid separating table labels from their values unnecessarily.

These are starting parameters, not guaranteed optimal settings. Retrieval evaluation must determine the final configuration.

Each chunk should retain:
- `document_id`
- `user_id`
- `chunk_index`
- `text`
- `page_number`, if available
- `section_title`, if available
- `start_offset` and `end_offset`, if available
- `extraction_method`
- `content_hash`

### 5.5 Embeddings and indexing

- Generate an embedding for each eligible chunk.
- Write the vector and filter metadata to Qdrant.
- Keep a corresponding chunk record in PostgreSQL.
- Use stable identifiers so indexing retries do not create duplicate records.
- Mark the document `ready` only after required chunks and vectors are confirmed.
- Record model identifiers to support re-indexing when embedding models change.

## 6. Retrieval and RAG Requirements

### Retrieval sequence

1. Authenticate the user.
2. Validate the requested document or collection scope.
3. Embed the question using the configured query embedding model.
4. Search Qdrant using mandatory ownership and scope filters.
5. Retrieve the initial candidate passages.
6. Optionally combine vector search with keyword/BM25 retrieval.
7. Optionally rerank the candidates.
8. Deduplicate and select the best passages within a token budget.
9. Pass evidence, source metadata, and constrained instructions to the LLM.
10. Validate returned citations against the retrieved evidence.
11. Persist the answer and citation records.
12. Return the answer, citations, and any uncertainty indicators.

### Initial retrieval configuration

- Initial candidate count: approximately 10–20 chunks.
- Final context count: approximately 4–8 chunks, subject to relevance and context limits.
- Configurable similarity thresholds, tuned through evaluation.
- Mandatory `user_id` filtering.
- Additional `document_id` filtering for single-document queries.
- Explicit selected-document filtering for collection queries.

These counts are starting configuration values, not universal optimal settings.

### Generation behaviour

The LLM must:
- Treat retrieved document content as untrusted data.
- Answer using the supplied evidence.
- Avoid unsupported claims.
- State when the evidence is insufficient.
- Distinguish conflicting source statements.
- Use only citation identifiers supplied by the application.
- Avoid inventing page numbers, titles, quotes, or source identifiers.

The backend must validate the citation references. Prompt instructions alone are not a sufficient citation-integrity control.

## 7. API Requirements

Use versioned routes under `/api/v1`.

### Authentication
- Authentication is provided through the selected authentication integration or a securely implemented session/token system.
- The backend must derive the authenticated identity from verified credentials.
- It must never trust a client-supplied `user_id` as proof of identity.

### Documents
- `POST /api/v1/documents` — upload a document.
- `GET /api/v1/documents` — list the current user's documents.
- `GET /api/v1/documents/{document_id}` — get document metadata and status.
- `GET /api/v1/documents/{document_id}/content` — retrieve extracted text or reader content.
- `GET /api/v1/documents/{document_id}/file` — securely access the original file.
- `POST /api/v1/documents/{document_id}/retry` — retry an eligible failed job.
- `PATCH /api/v1/documents/{document_id}` — rename or update supported metadata.
- `DELETE /api/v1/documents/{document_id}` — delete the document and associated indexed data.

### Collections
- `POST /api/v1/collections` — create a collection.
- `GET /api/v1/collections` — list collections.
- `GET /api/v1/collections/{collection_id}` — view a collection.
- `POST /api/v1/collections/{collection_id}/documents` — add documents.
- `DELETE /api/v1/collections/{collection_id}/documents/{document_id}` — remove a membership.

### Conversations
- `POST /api/v1/conversations` — create a conversation.
- `GET /api/v1/conversations` — list conversations.
- `GET /api/v1/conversations/{conversation_id}` — get conversation history.
- `DELETE /api/v1/conversations/{conversation_id}` — delete a conversation.
- `POST /api/v1/conversations/{conversation_id}/messages` — submit a question and generate an answer.

The conversation's document scope must be validated before retrieval.

### Analysis
- `POST /api/v1/documents/{document_id}/summaries` — generate a summary.
- `POST /api/v1/analysis/comparisons` — compare selected documents.
- `POST /api/v1/analysis/extractions` — extract structured fields when supported.

### System
- `GET /health` — basic service health.
- `GET /ready` — readiness check for required dependencies.

All endpoints must have defined request schemas, response schemas, status codes, and error behaviour.

## 8. Security Requirements

- Enforce authentication and object-level authorisation.
- Apply ownership filters to both relational queries and vector retrieval.
- Validate uploads by size, permitted format, and content.
- Keep storage private and serve files through authorised endpoints.
- Apply rate limits and request timeouts.
- Use parameterised database operations through the ORM.
- Do not execute document content as code.
- Treat document instructions as potential prompt injection.
- Avoid logging full documents, prompts containing sensitive data, tokens, or API keys.
- Use HTTPS in deployment.
- Configure CORS narrowly.
- Keep secrets in environment variables or a deployment secret manager.
- Document file retention and deletion behaviour.
- Use dependency scanning and update vulnerable packages.

## 9. Error Handling

Use a consistent response structure, for example:

```json
{
  "error": {
    "code": "DOCUMENT_PROCESSING_FAILED",
    "message": "The document could not be processed.",
    "request_id": "server-generated-id"
  }
}
```

The actual response must not expose stack traces, filesystem paths, provider secrets, or internal infrastructure details.

Distinguish:
- Invalid upload.
- Unsupported format.
- Processing failure.
- Retrieval failure.
- AI provider timeout.
- Rate limit exceeded.
- Unauthorised access.
- Resource not found.
- Temporary dependency outage.

## 10. Background Processing

Document parsing, OCR, embedding generation, and indexing should not depend on a single long-running upload HTTP request.

Initial implementation options:
- A database-backed job table and a dedicated worker process.
- A task queue with a supported broker if required by deployment scale.

For the first implementation, prefer the simplest reliable worker design. Add a dedicated broker only if it improves reliability or operational requirements justify the extra service.

Jobs need:
- Status and timestamps.
- Attempt count.
- Retry policy.
- Error category.
- Idempotent processing.
- Safe handling of duplicate tasks.
- A way to identify and recover stalled jobs.

## 11. Testing Requirements

### Unit tests
- File validation.
- Chunking.
- Citation validation.
- Ownership predicates.
- Request schema validation.
- Document deletion logic.

### Integration tests
- Upload to parsing.
- Parsing to indexing.
- Query to retrieval and generation.
- Citation links to source metadata.
- Failed processing and retry.
- Deletion from PostgreSQL, storage, and Qdrant.

### Security tests
- Cross-user document access.
- Cross-user conversation access.
- Cross-user vector retrieval.
- Invalid file uploads.
- Oversized requests.
- Malicious document content and prompt injection.

### RAG evaluation
- Retrieval Recall@K.
- Answer correctness.
- Faithfulness to retrieved evidence.
- Citation correctness.
- Abstention quality.
- Handling of conflicting documents.
- Latency and failure rates.

Use a fixed, versioned evaluation dataset. Do not publish unmeasured accuracy claims.

## 12. Environment Configuration

Maintain `.env.example` with placeholders for:

```text
APP_ENV=
API_HOST=
API_PORT=
DATABASE_URL=
QDRANT_URL=
QDRANT_API_KEY=
STORAGE_ROOT=
MAX_UPLOAD_MB=
LLM_PROVIDER=
LLM_API_KEY=
LLM_MODEL=
EMBEDDING_PROVIDER=
EMBEDDING_API_KEY=
EMBEDDING_MODEL=
CORS_ORIGINS=
AUTH_CONFIGURATION=
LOG_LEVEL=
```

The exact environment variables must match the selected libraries and deployment platform. `.env.example` must not contain real credentials.

## 13. Deployment Requirements

- Dockerfiles for frontend and backend.
- Docker Compose for local development.
- Persistent storage for PostgreSQL and Qdrant where required.
- A backup and restore procedure for durable data.
- HTTPS and private file access in production.
- Separate development and production configuration.
- Health checks and useful logs.
- Documented migrations and upgrade steps.
- A deployment checklist covering database, vector index, storage, secrets, and CORS.

## 14. Technical Acceptance Criteria

The technical implementation is acceptable when:
- The frontend builds without errors.
- Backend tests pass.
- Database migrations run successfully on a clean database.
- The ingestion pipeline is repeatable and idempotent.
- Vector retrieval enforces ownership filters.
- Citation references resolve to stored evidence.
- Deletion covers the original file and all indexed records.
- The deployment can be configured without embedding secrets in source code.
- The application has documented test and recovery procedures.

