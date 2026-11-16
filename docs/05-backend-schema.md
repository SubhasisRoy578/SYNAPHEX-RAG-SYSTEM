# DOCUMENT 5 — BACKEND SCHEMA AND DATA MODEL

## 1. Purpose

This document defines the initial relational schema, vector-index metadata, entity relationships, deletion behaviour, and ownership rules for SYNAPHEX.

The schema is intentionally limited to the core product. Additional entities should be introduced only when a feature requires them.

## 2. Data Architecture

Use three distinct storage responsibilities:

1. **PostgreSQL:** authoritative application records and relationships.
2. **Qdrant:** vector representations and retrieval metadata.
3. **Private file storage:** original uploaded documents.

Do not store all document contents as vector records alone. Relational records are required for ownership, processing status, citations, lifecycle management, and reliable deletion.

## 3. Entity Relationship Overview

```text
USERS
  |
  +---- DOCUMENTS
  |       |
  |       +---- DOCUMENT_CHUNKS
  |       |
  |       +---- PROCESSING_JOBS
  |       |
  |       +---- COLLECTION_DOCUMENTS ---- COLLECTIONS
  |
  +---- CONVERSATIONS
          |
          +---- MESSAGES
                  |
                  +---- MESSAGE_CITATIONS ---- DOCUMENT_CHUNKS
```

A document can belong to multiple collections. A collection can contain multiple documents. Each conversation belongs to one user and has an explicit document or collection scope.

## 4. PostgreSQL Tables

### 4.1 `users`

Stores the application's user identity.

| Column | Type | Constraints / purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `auth_provider` | VARCHAR(50) | Authentication provider |
| `auth_subject` | VARCHAR(255) | Unique provider-side identity |
| `email` | VARCHAR(320) | Optional or required according to authentication setup |
| `display_name` | VARCHAR(150) | Optional profile name |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update |

Constraints:
- Unique (`auth_provider`, `auth_subject`).
- Never trust an `id` supplied by the browser as proof of identity.
- If the chosen authentication provider manages accounts and email itself, avoid duplicating unnecessary credential data.

### 4.2 `documents`

Stores document metadata and lifecycle status.

| Column | Type | Constraints / purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to `users.id` |
| `filename` | VARCHAR(255) | User-facing name |
| `storage_key` | TEXT | Opaque private-storage identifier |
| `mime_type` | VARCHAR(100) | Validated content type |
| `file_extension` | VARCHAR(10) | Normalised extension |
| `file_size_bytes` | BIGINT | Positive size |
| `content_hash` | VARCHAR(128) | Integrity and duplicate detection |
| `status` | VARCHAR(20) | `queued`, `processing`, `ready`, `failed`, `deleting` |
| `processing_stage` | VARCHAR(50) | Current stage, if applicable |
| `extraction_method` | VARCHAR(30) | `text`, `ocr`, `mixed`, or equivalent |
| `page_count` | INTEGER | Nullable for formats without reliable pages |
| `chunk_count` | INTEGER | Number of indexed chunks |
| `error_code` | VARCHAR(100) | Nullable failure code |
| `error_message` | TEXT | Safe user-facing error |
| `created_at` | TIMESTAMPTZ | Upload timestamp |
| `updated_at` | TIMESTAMPTZ | Last update |
| `processed_at` | TIMESTAMPTZ | Nullable completion timestamp |
| `deleted_at` | TIMESTAMPTZ | Optional soft-deletion marker |

Constraints and indexes:
- Foreign key to users.
- Positive `file_size_bytes`.
- Index on (`user_id`, `created_at`).
- Index on (`user_id`, `status`).
- Index on `content_hash` only if useful for deduplication.
- Do not expose `storage_key` in ordinary client responses.

### 4.3 `collections`

Stores user-defined document groups.

| Column | Type | Constraints / purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Owner |
| `name` | VARCHAR(150) | Collection name |
| `description` | TEXT | Optional description |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update |

Constraints:
- Foreign key to users.
- Index on (`user_id`, `name`).
- Collection names should be unique per user only if that is the chosen product rule.

### 4.4 `collection_documents`

Many-to-many association between collections and documents.

| Column | Type | Constraints / purpose |
|---|---|---|
| `collection_id` | UUID | Foreign key |
| `document_id` | UUID | Foreign key |
| `added_at` | TIMESTAMPTZ | Membership timestamp |

Constraints:
- Composite primary key (`collection_id`, `document_id`).
- Prevent duplicate memberships.
- Validate that both the collection and document belong to the authenticated user before inserting a membership.

### 4.5 `document_chunks`

Stores extracted text and source metadata for retrieval.

| Column | Type | Constraints / purpose |
|---|---|---|
| `id` | UUID | Primary key; stable chunk identifier |
| `document_id` | UUID | Parent document |
| `user_id` | UUID | Owner, used for filtering |
| `chunk_index` | INTEGER | Chunk order |
| `text_content` | TEXT | Extracted chunk text |
| `page_number` | INTEGER | Nullable source page |
| `section_title` | TEXT | Nullable source heading |
| `start_offset` | INTEGER | Nullable source character offset |
| `end_offset` | INTEGER | Nullable source character offset |
| `extraction_method` | VARCHAR(30) | Text extraction or OCR |
| `content_hash` | VARCHAR(128) | Chunk content hash |
| `embedding_model` | VARCHAR(150) | Model used to embed the chunk |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

Constraints:
- Foreign key to documents.
- Unique (`document_id`, `chunk_index`) for a particular indexed version.
- Index on (`user_id`, `document_id`).
- Validate page and offset ranges when available.

If re-indexing requires keeping multiple versions, introduce an explicit document-index version rather than overwriting records without a lifecycle strategy.

### 4.6 `processing_jobs`

Tracks asynchronous ingestion and deletion tasks.

| Column | Type | Constraints / purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `document_id` | UUID | Associated document |
| `user_id` | UUID | Owner |
| `job_type` | VARCHAR(30) | `ingest`, `reindex`, `delete` |
| `status` | VARCHAR(20) | `queued`, `running`, `completed`, `failed` |
| `stage` | VARCHAR(50) | Current operation |
| `attempt_count` | INTEGER | Number of attempts |
| `max_attempts` | INTEGER | Retry limit |
| `error_code` | VARCHAR(100) | Nullable failure code |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `started_at` | TIMESTAMPTZ | Nullable start time |
| `finished_at` | TIMESTAMPTZ | Nullable completion time |
| `next_retry_at` | TIMESTAMPTZ | Nullable retry schedule |

Constraints:
- Foreign keys to documents and users.
- Index on (`status`, `next_retry_at`).
- A worker must safely handle duplicate job delivery.

### 4.7 `conversations`

Stores a question-answering session and its scope.

| Column | Type | Constraints / purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Owner |
| `title` | VARCHAR(200) | Conversation title |
| `scope_type` | VARCHAR(20) | `document`, `collection`, or `selected_documents` |
| `document_id` | UUID | Nullable single-document scope |
| `collection_id` | UUID | Nullable collection scope |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last activity |

Constraints:
- Foreign keys to users, documents, and collections as applicable.
- Validate that the selected scope belongs to the user.
- For selected-document scope, use an explicit join table if persisted membership is needed; do not pack unvalidated identifiers into a free-form field.
- Enforce scope consistency through application validation and appropriate database constraints.

### 4.8 `messages`

Stores conversation messages.

| Column | Type | Constraints / purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `conversation_id` | UUID | Parent conversation |
| `role` | VARCHAR(20) | `user`, `assistant`, or supported system-generated role |
| `content` | TEXT | Message content |
| `status` | VARCHAR(20) | `complete`, `failed`, or applicable pending state |
| `model_provider` | VARCHAR(50) | Nullable provider identifier |
| `model_name` | VARCHAR(150) | Nullable model identifier |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

Constraints:
- Foreign key to conversations.
- Index on (`conversation_id`, `created_at`).
- Do not store secrets or unnecessary raw provider request metadata.

### 4.9 `message_citations`

Links assistant messages to the evidence supporting them.

| Column | Type | Constraints / purpose |
|---|---|---|
| `id` | UUID | Primary key |
| `message_id` | UUID | Cited assistant message |
| `document_id` | UUID | Source document |
| `chunk_id` | UUID | Source chunk, if retained |
| `citation_index` | INTEGER | Position in the response |
| `quote_text` | TEXT | Short source excerpt |
| `page_number` | INTEGER | Nullable page |
| `section_title` | TEXT | Nullable heading |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

Constraints:
- Foreign keys to the message, document, and chunk where applicable.
- Validate that each citation points to evidence actually retrieved for that response.
- Define what happens to citation references when a source document is deleted.
- If historical citations must remain after deletion, store a carefully limited snapshot and clearly mark it as historical; do not silently retain full deleted documents.

## 5. Qdrant Collection Design

Recommended initial collection name: `synaphex_chunks_v1`.

### Vector payload

```json
{
  "chunk_id": "UUID",
  "document_id": "UUID",
  "user_id": "UUID",
  "chunk_index": 0,
  "page_number": 12,
  "section_title": "System Overview",
  "embedding_model": "configured-model-id"
}
```

The vector itself is stored by Qdrant. Chunk text can remain in PostgreSQL initially, reducing duplication and allowing the backend to validate the source record before returning it.

### Requirements

- Use the vector size required by the configured embedding model.
- Configure the appropriate distance metric.
- Apply `user_id` filters to every user-scoped query.
- Apply document or collection filters as required.
- Use stable point IDs linked to chunk IDs.
- Avoid indexing vectors for documents that have failed required ingestion.
- Support deletion by document ID.
- Rebuild the index from PostgreSQL chunk metadata and original files when necessary.

A collection name and vector dimension must be updated deliberately when the embedding model changes incompatibly.

## 6. Ownership and Authorisation Rules

Every protected operation must:
1. Verify the user's authentication.
2. Load the requested resource under the authenticated user's ownership.
3. Reject access if the resource is missing or belongs to another user.
4. Apply the same scope to retrieval and citation resolution.
5. Avoid returning another user's resource metadata in error responses.

For vector search, the backend must enforce ownership filters regardless of which document IDs the frontend submits.

## 7. Deletion and Referential Integrity

Document deletion must cover:
- Original stored file.
- Document chunks in PostgreSQL.
- Vector points in Qdrant.
- Document metadata.
- Collection membership records.
- Active processing jobs, including cancellation or safe invalidation.
- Related citation references according to the documented retention policy.

Recommended approach:
1. Mark the document as `deleting` or otherwise unavailable.
2. Prevent new queries from using it.
3. Remove vectors and original file.
4. Remove dependent chunk and membership records.
5. Finalise document deletion.
6. Record and retry failed cleanup steps.

Do not report successful permanent deletion while a required cleanup operation remains unverified. Keep deletion operations idempotent.

## 8. Database Migration Rules

- Use Alembic migrations.
- Never rely on manual production schema edits as the standard workflow.
- Test migrations against a clean database.
- Test upgrade and recovery procedures before deployment.
- Use explicit indexes and foreign keys.
- Avoid cascading deletion where it could unintentionally remove unrelated records.
- Review each migration for its effect on stored document and citation data.

## 9. Initial Data Retention Rules

- User data is private by default.
- Original files and extracted content are not publicly accessible.
- Failed jobs should retain only the operational details required for diagnosis and retry.
- Logs should not contain full document contents or API credentials.
- Deletion and backup-retention behaviour must be documented before production use.
- Backups should be protected and subject to a defined retention policy.

## 10. Schema Acceptance Criteria

- Every user-owned record has a defined ownership path.
- Document and chunk relationships are enforced.
- Collections cannot contain another user's documents.
- Conversation scope is validated.
- Citations point to actual retrieved source evidence.
- Vector payloads support mandatory ownership filtering.
- Deletion covers files, chunks, vectors, and dependent records.
- Migrations can create the schema from an empty database.
- Database and vector indexes can be reconciled after a partial failure.

