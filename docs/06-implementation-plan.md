# DOCUMENT 6 — IMPLEMENTATION PLAN

## 1. Purpose

This document converts the SYNAPHEX requirements into a staged engineering plan with dependencies, deliverables, testing checkpoints, and completion criteria.

The plan assumes one student developer working part-time. It is an estimate, not a guaranteed deadline.

**Planning estimate:** 8–10 weeks for a focused MVP, depending on experience, AI provider access, debugging time, and deployment constraints.

## 2. Implementation Strategy

Build the application vertically: complete one real end-to-end workflow before adding a large number of disconnected screens.

The first end-to-end milestone is:

**Upload PDF → extract text → index chunks → ask a question → retrieve evidence → generate a cited answer → open the cited source.**

This workflow validates the project's main technical value. Summaries, comparison, OCR improvements, and export can then be added on top of it.

## 3. Phase Overview

| Phase | Focus | Estimated duration |
|---|---|---|
| 1 | Requirements and project setup | 3–4 days |
| 2 | Frontend foundation and navigation | 4–5 days |
| 3 | Backend, authentication, and database | 5–7 days |
| 4 | File upload and document processing | 6–8 days |
| 5 | RAG retrieval and citation-grounded Q&A | 7–10 days |
| 6 | Reader, library, and collections integration | 4–6 days |
| 7 | Summaries and document comparison | 5–7 days |
| 8 | Security, evaluation, and reliability | 5–7 days |
| 9 | Deployment, documentation, and demonstration | 4–6 days |

Some work can overlap. These estimates should not be interpreted as a fixed delivery promise.

## 4. Phase 1 — Requirements and Project Setup

### Tasks
1. Freeze the MVP scope using the PRD.
2. Create the Git repository.
3. Create `frontend/`, `backend/`, `evaluation/`, and deployment configuration directories.
4. Define the coding conventions and branch strategy.
5. Create `.env.example` and `.gitignore`.
6. Decide the initial authentication integration and AI provider.
7. Create the first project README.
8. Record known risks and deferred features.

### Deliverables
- Six planning documents.
- Repository structure.
- Environment configuration template.
- Initial README.
- Scope and priority list.

### Exit criteria
- The team can explain the MVP and its exclusions.
- No credentials are committed.
- The selected stack and service dependencies are documented.

## 5. Phase 2 — Frontend Foundation and Navigation

### Tasks
1. Initialise React, TypeScript, and Vite.
2. Configure Tailwind CSS.
3. Set up React Router.
4. Implement the shared application shell.
5. Build the sidebar, top bar, page headers, buttons, dialogs, and status components.
6. Create the required page routes.
7. Implement responsive layouts.
8. Create empty, loading, error, and populated states.
9. Connect frontend error handling to a common pattern.

### Deliverables
- Landing page.
- Application shell.
- Dashboard.
- Document library layout.
- Reader workspace layout.
- Collections, Analysis Studio, Compare, Conversations, and Settings page shells.
- Shared component library.

### Exit criteria
- All primary routes render.
- Navigation works.
- Layout adapts to desktop and mobile.
- No page presents invented operational data as real user data.

**Important:** These are interface foundations. A completed mock interface does not mean its backend features are implemented.

## 6. Phase 3 — Backend, Authentication, and Database

### Tasks
1. Initialise FastAPI.
2. Configure Pydantic schemas and SQLAlchemy.
3. Set up PostgreSQL.
4. Configure Alembic migrations.
5. Integrate authentication.
6. Implement verified user identity extraction.
7. Create user, document, collection, conversation, and message models.
8. Implement protected CRUD endpoints.
9. Add consistent error responses and request IDs.
10. Add ownership and access-control tests.

### Deliverables
- Running backend API.
- Initial database schema.
- Authentication integration.
- Protected document and collection endpoints.
- Health and readiness endpoints.
- Initial automated tests.

### Exit criteria
- A clean database can be migrated successfully.
- Unauthenticated requests are rejected.
- Cross-user resource access is denied.
- API schemas and error responses are documented.

## 7. Phase 4 — File Upload and Document Processing

### Tasks
1. Implement secure upload validation.
2. Store original files privately.
3. Create document metadata and processing jobs.
4. Extract PDF text with page metadata.
5. Extract DOCX paragraphs and basic tables.
6. Decode and process TXT files.
7. Detect text-poor PDFs.
8. Implement optional OCR for scanned PDFs.
9. Implement document-aware chunking.
10. Store chunk records in PostgreSQL.
11. Generate embeddings and index chunks in Qdrant.
12. Implement status polling and retry handling.
13. Implement deletion of original files and indexed data.

### Deliverables
- Working upload flow.
- Document status transitions.
- Parsing and chunking modules.
- Vector indexing.
- Processing error and retry behaviour.
- Initial document management API.

### Exit criteria
- Valid files process into searchable chunks.
- Invalid and oversized files fail safely.
- Processing retries do not create duplicate vectors.
- A document becomes ready only when required indexing succeeds.
- Deletion removes the document from search and storage according to the documented lifecycle.

### Suggested test corpus
Create a small, varied set of non-sensitive test documents:
- Text-based PDF.
- Scanned PDF.
- Multi-page PDF.
- DOCX with headings and a table.
- TXT with multiple sections.
- Empty or malformed files.
- An oversized file.
- A document with conflicting statements or misleading instructions.

## 8. Phase 5 — RAG Retrieval and Citation-Grounded Q&A

### Tasks
1. Define the embedding and LLM provider interfaces.
2. Implement query embedding.
3. Implement Qdrant retrieval with mandatory ownership filters.
4. Add document and collection scope filters.
5. Build a context-selection function.
6. Implement grounded prompt construction.
7. Require citation identifiers in the generated response format.
8. Validate citations against retrieved chunks.
9. Handle insufficient evidence and conflicting evidence.
10. Persist messages and citation records.
11. Implement conversation endpoints.
12. Connect the assistant UI to the backend.
13. Add a first RAG evaluation dataset.

### Deliverables
- Single-document question-answering.
- Collection question-answering.
- Evidence excerpts and citations.
- Conversation history.
- Insufficient-evidence behaviour.
- Initial retrieval and answer evaluation.

### Exit criteria
- Questions retrieve relevant source passages.
- Citations map to retrieved evidence.
- Unsupported citations are rejected or safely omitted.
- Queries cannot retrieve another user's chunks.
- Provider errors do not produce fabricated successful responses.
- The initial evaluation dataset runs reproducibly.

## 9. Phase 6 — Reader, Library, and Collections Integration

### Tasks
1. Integrate PDF.js or a compatible viewer.
2. Add page navigation, zoom, and find controls where supported.
3. Implement extracted-text views for DOCX and TXT.
4. Link citation cards to source pages or sections.
5. Implement library search, sorting, and filters.
6. Add rename and delete actions.
7. Implement collection creation and membership.
8. Connect the collection assistant to its selected scope.
9. Add document status and extraction warnings.

### Deliverables
- Functional document library.
- Reader and assistant workspace.
- Citation-to-source navigation.
- Collection management.
- Responsive reader/assistant layout.

### Exit criteria
- Users can locate and open processed documents.
- Citations open the best available source location.
- Collection membership is persisted and access-controlled.
- Reader and assistant states remain clear on narrow screens.

## 10. Phase 7 — Summaries and Document Comparison

### Tasks
1. Implement concise and detailed summaries.
2. Add key-point extraction.
3. Add configurable structured extraction for selected fields.
4. Implement comparison of two or more documents.
5. Retrieve evidence independently from each selected document.
6. Generate grouped findings: similarities, differences, and conflicts.
7. Validate citations for each finding.
8. Add the Analysis Studio and comparison interfaces.
9. Implement report export only after the core results are stable.

### Deliverables
- Summary generation.
- Key-point extraction.
- Basic structured extraction.
- Cross-document comparison.
- Evidence-linked findings.
- Optional report export.

### Exit criteria
- Analysis results correspond to selected documents.
- Comparison claims have traceable source evidence.
- Missing fields are reported as missing.
- The UI distinguishes source text from generated interpretation.

## 11. Phase 8 — Security, Evaluation, and Reliability

### Tasks
1. Run ownership and access-control tests.
2. Test prompt-injection documents.
3. Verify file-size and file-type validation.
4. Test interrupted ingestion and duplicate jobs.
5. Test deletion and partial cleanup failure.
6. Measure retrieval Recall@K.
7. Measure citation correctness and answer faithfulness.
8. Test questions whose answers are absent from the documents.
9. Test conflicting source statements.
10. Add request timeouts, rate limits, and safe logging.
11. Test provider outages and dependency failures.
12. Fix the highest-impact defects before adding new features.

### Deliverables
- Automated regression tests.
- RAG evaluation dataset and report.
- Security test report.
- Failure-handling improvements.
- Documented known limitations.

### Exit criteria
- Critical access-control defects are resolved.
- Citations are verified against actual source records.
- Ingestion and deletion can recover from supported failures.
- RAG quality is measured using actual evaluation results.
- No unmeasured performance or accuracy claims are included in the project presentation.

## 12. Phase 9 — Deployment, Documentation, and Demonstration

### Tasks
1. Build production frontend and backend images.
2. Configure PostgreSQL and Qdrant persistence.
3. Configure environment variables and secrets.
4. Set production CORS and HTTPS.
5. Run database migrations.
6. Verify private file storage.
7. Test health and readiness endpoints.
8. Perform an end-to-end smoke test on the deployed application.
9. Document installation, environment setup, architecture, and limitations.
10. Prepare a short demonstration using non-sensitive sample documents.

### Deliverables
- Deployable application.
- Dockerfiles and Compose configuration.
- Environment-variable documentation.
- README and setup guide.
- Architecture diagram.
- Test and evaluation summary.
- Demo workflow and known-limitations section.

### Exit criteria
- A clean environment can follow the setup guide.
- The deployed application can upload, process, query, cite, and delete a test document.
- Secrets are not exposed in the frontend or repository.
- Data persistence and backup limitations are documented.
- The demonstration uses real application behaviour, not fabricated output.

## 13. Recommended Repository Structure

```text
SYNAPHEX/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/
│   │   │   ├── documents/
│   │   │   ├── reader/
│   │   │   ├── assistant/
│   │   │   ├── analysis/
│   │   │   └── comparison/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── db/
│   │   ├── services/
│   │   │   ├── parsing/
│   │   │   ├── ingestion/
│   │   │   ├── chunking/
│   │   │   ├── embeddings/
│   │   │   ├── retrieval/
│   │   │   ├── generation/
│   │   │   └── citations/
│   │   ├── workers/
│   │   └── main.py
│   ├── tests/
│   ├── alembic/
│   └── requirements.txt
├── evaluation/
│   ├── questions.json
│   └── evaluation_results/
├── storage/                 # Local development only
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## 14. Development Rules

- Build the backend contract before integrating each frontend feature.
- Keep API request and response types documented.
- Use small, testable service modules.
- Avoid embedding database operations, parsing, retrieval, and generation into one large route handler.
- Keep provider integrations behind interfaces.
- Do not commit secrets, uploaded private documents, generated indexes, or local databases.
- Use migrations rather than manually modifying the deployed schema.
- Run tests after changes to ingestion, retrieval, authorisation, and deletion.
- Do not remove existing functionality during later refactoring without explicitly reviewing its dependencies and replacement.

## 15. Final Project Demonstration

The final demonstration should follow one complete, realistic workflow:

1. Sign in.
2. Upload a PDF or DOCX.
3. Show processing progress.
4. Open the processed document.
5. Ask a specific question.
6. Display the answer and citations.
7. Open a cited source location.
8. Generate a summary.
9. Compare two documents.
10. Ask a question that the documents do not answer and demonstrate uncertainty handling.
11. Delete a test document and verify that it is no longer searchable.

This demonstration proves more than a polished interface: it shows the core document-processing, RAG, citation, comparison, and lifecycle workflows.

## 16. Resume Readiness Checklist

Before describing SYNAPHEX as a completed project on a resume, verify that:

- The advertised features work end to end.
- The technologies listed were actually used.
- Authentication and data isolation are tested.
- RAG evaluation has been run and the real results are available.
- Citation correctness has been tested.
- Deployment instructions work from a clean environment.
- Known limitations are documented.
- Performance and accuracy claims are backed by measurements.

Suggested project description after implementation:

**SYNAPHEX — AI-Powered Document Intelligence Platform**

Built a full-stack document intelligence platform that processes PDF, DOCX, and TXT files, supports evidence-grounded question-answering using RAG, and generates summaries and cross-document comparisons with source citations. Implemented document ingestion, vector retrieval, source metadata, user-level access controls, and evaluation workflows.

Replace or refine this description based on the features actually completed and the measured results obtained.

