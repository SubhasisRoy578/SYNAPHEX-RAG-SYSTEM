# DOCUMENT 1 — PROJECT REQUIREMENTS DOCUMENT (PRD)

## 1. Document Information

| Field | Details |
|---|---|
| Project name | SYNAPHEX |
| Tagline | Turn Documents Into Knowledge. |
| Product type | AI-powered document intelligence web application |
| Version | 1.0 |
| Status | Initial project specification |
| Primary audience | Students, researchers, analysts, and professionals |
| Initial release | Functional MVP with an extensible architecture |

## 2. Project Overview

SYNAPHEX is a web application that allows users to upload documents, read and search their contents, ask natural-language questions, generate summaries, extract important information, and compare multiple documents.

The platform uses Retrieval-Augmented Generation (RAG) to retrieve relevant evidence from uploaded documents before generating answers. Each answer should identify its supporting document and, where available, its source page or section.

The goal is to make long documents easier to understand without treating AI-generated responses as automatically correct.

## 3. Problem Statement

People often need to analyse lengthy PDFs, Word documents, research papers, policies, reports, manuals, and business documents. Manually finding specific information across several documents is time-consuming.

Conventional document viewers provide reading and keyword search but generally do not offer contextual question-answering across multiple files. General-purpose AI tools may also lack reliable source traceability or may answer without adequate evidence.

SYNAPHEX addresses these problems through document processing, semantic retrieval, grounded AI responses, source citations, and document comparison.

## 4. Proposed Solution

SYNAPHEX will provide a central workspace where users can:

1. Upload and organise PDF, DOCX, and TXT files.
2. Monitor file-processing progress and resolve processing failures.
3. Read supported documents within the application.
4. Ask questions about one document or a selected collection.
5. Receive answers supported by retrieved document passages.
6. Open the cited source location to verify an answer.
7. Generate summaries and extract key information.
8. Compare two or more documents and inspect evidence for similarities or differences.
9. Manage document history and delete documents and their associated indexed data.

## 5. Objectives

### Primary objectives

- Make document-based information retrieval faster.
- Provide answers that can be checked against original sources.
- Reduce unsupported AI-generated claims through retrieval, grounding, and abstention.
- Support common text-based business and academic document formats.
- Build a modular application that can be developed and tested incrementally.
- Demonstrate practical full-stack engineering and applied AI/ML skills.

### Success criteria

The project is considered to meet its initial objectives when:

- Supported files can be uploaded, validated, processed, indexed, viewed, and deleted.
- Users can ask questions against a single document and a selected collection.
- Answers display citations linked to retrieved source passages.
- The system handles questions with insufficient evidence without inventing an answer.
- Summaries and basic document comparisons work on successfully processed documents.
- A test suite verifies document ownership, ingestion, retrieval, citations, and deletion.
- The application can be run using documented environment configuration and deployment instructions.

No accuracy percentage or performance achievement will be claimed until measured using actual tests.

## 6. Target Users

### 6.1 Students and researchers
Use cases: summarising research papers, locating definitions, comparing study materials, and extracting findings.

### 6.2 Business and operations teams
Use cases: searching internal policies, analysing reports, identifying obligations, and comparing document versions.

### 6.3 Software and technical professionals
Use cases: understanding technical manuals, product specifications, engineering documentation, and requirements documents.

### 6.4 Analysts and knowledge workers
Use cases: retrieving figures, dates, named entities, conclusions, and supporting evidence across several documents.

The first release will focus on individual workspaces. Enterprise administration, shared team workspaces, and advanced permissions are outside the MVP.

## 7. Functional Requirements

Priority definitions:

- **P0:** Mandatory for the initial functional MVP.
- **P1:** Important follow-up capabilities.
- **P2:** Advanced features for later releases.

### FR-01: Authentication and user isolation — P0

- Users must be able to create an account, sign in, and sign out.
- Every document and conversation must belong to an authenticated user.
- Users must not be able to access another user's documents by changing an identifier in a request.
- Unauthenticated requests to protected resources must be rejected.

### FR-02: Document upload and validation — P0

- Accept PDF, DOCX, and TXT files.
- Enforce configurable file-size and file-type restrictions.
- Validate file content, not only the filename extension.
- Generate a unique internal identifier and safe storage key.
- Display processing status: `queued`, `processing`, `ready`, or `failed`.
- Display understandable failure messages and permit retry where appropriate.
- Prevent unsupported or invalid files from entering the indexing pipeline.

Initial configurable upload limit: **25 MB per file**. This is a planning default, not a platform limitation.

### FR-03: Document library — P0

- List a user's documents.
- Display filename, format, size, upload date, and processing status.
- Support search by filename.
- Support rename, preview, and delete.
- Allow organisation into collections.
- Provide empty, loading, failed, and populated states.

### FR-04: Document processing — P0

- Extract text from supported files.
- Preserve page information for PDFs when available.
- Preserve headings and paragraph structure when available.
- Extract DOCX paragraphs and basic tables.
- Detect empty or text-poor PDFs.
- Route scanned PDFs through an OCR process when OCR is enabled.
- Split extracted text into retrieval chunks with source metadata.
- Generate embeddings and store searchable vector records.
- Mark a document `ready` only after all required indexing steps succeed.

### FR-05: Document reader — P0

- Display supported PDF documents in an in-app reader.
- Provide page navigation, zoom, and text search where supported by the viewer.
- Display extracted text for DOCX and TXT documents.
- Allow users to open a source citation from an AI response.
- Show a clear message when a document cannot be rendered or extracted properly.

### FR-06: RAG question-answering — P0

- Support questions about a single document.
- Support questions about a user-selected collection.
- Retrieve relevant document chunks before generating a response.
- Generate answers using retrieved evidence and the selected AI provider.
- Include source citations with document title and page or section when available.
- Display relevant source excerpts.
- Indicate when evidence is insufficient or conflicting.
- Never fabricate a page number or citation.
- Keep conversation history associated with the relevant user and document scope.

### FR-07: Summarisation — P1

- Generate document summaries.
- Offer concise and detailed summary modes.
- Extract key points, conclusions, dates, figures, and named entities when present.
- Preserve evidence references for important claims where practical.
- Report extraction failures rather than returning a misleading empty result.

### FR-08: Cross-document comparison — P1

- Allow users to select at least two processed documents.
- Identify similarities, differences, changed requirements, and conflicting statements.
- Link findings to evidence from the relevant documents.
- Distinguish direct textual differences from AI-generated interpretation.
- Explain when the available content does not support a comparison claim.

### FR-09: Conversation management — P1

- Save conversations and messages.
- List previous conversations.
- Open and continue a conversation.
- Start a new conversation.
- Delete conversations.
- Display citations associated with each assistant response.

### FR-10: Structured information extraction — P2

- Extract configurable fields such as dates, amounts, requirements, risks, and obligations.
- Return structured results with supporting evidence.
- Validate the output against a defined schema.
- Mark unavailable fields as missing rather than inventing values.

### FR-11: Export — P2

- Export summaries and analysis reports in a practical downloadable format.
- Include source references in exported reports.
- Avoid exporting private documents or conversations without an explicit user action.

### FR-12: Settings and observability — P0/P1

- Display application and processing settings appropriate to the user.
- Provide understandable error messages.
- Log technical failures without exposing document contents, credentials, or secrets.
- Allow administrative provider configuration through server-side environment variables.
- Provide a health endpoint for deployment monitoring.

## 8. Non-Functional Requirements

### Security and privacy
- Enforce authentication and ownership checks on every protected resource.
- Keep API keys on the server.
- Restrict upload formats and sizes.
- Use safe file-storage identifiers and private storage.
- Validate and sanitise user inputs.
- Treat document content as untrusted data, not as system instructions.
- Delete the stored file, extracted text, chunks, vector records, and dependent metadata when a document is deleted, subject to documented operational retention requirements.

### Reliability
- Use explicit processing states.
- Handle interrupted processing and provider failures.
- Prevent duplicate indexing during retries.
- Provide actionable error messages.
- Avoid reporting a file as ready before its required processing has completed.

### Performance
- Process large or slow documents outside the request-response cycle where necessary.
- Paginate document and conversation lists.
- Limit retrieval context and model output.
- Configure timeouts and concurrency limits.
- Establish actual performance targets after measuring the deployment environment.

### Maintainability
- Separate frontend, API, document processing, retrieval, and generation responsibilities.
- Use typed API schemas.
- Maintain automated tests and documented environment variables.
- Keep AI-provider integration replaceable.

### Accessibility and usability
- Support desktop and mobile layouts.
- Use readable typography, visible focus states, keyboard-accessible controls, and clear status messages.
- Do not communicate status through colour alone.

## 9. Out of Scope for the MVP

- Native mobile applications.
- Team collaboration and enterprise administration.
- Fine-tuning a foundation model.
- Training custom embedding models.
- Guaranteed interpretation of every chart, diagram, or image.
- Full spreadsheet analytics.
- Automatic external web research.
- Autonomous AI agents performing external actions.
- Legal, financial, medical, or compliance decisions without qualified human review.
- Claims of regulatory certification or enterprise compliance without the corresponding implementation and verification.

## 10. Acceptance Criteria

The MVP is accepted when the following can be demonstrated:

1. A user signs in and uploads a valid PDF, DOCX, or TXT file.
2. The application displays the correct processing status and a useful error for unsupported files.
3. Successfully processed documents appear in the library and can be opened.
4. A question about an uploaded document returns an evidence-grounded answer with valid citations.
5. A citation opens the correct document and source location when location metadata is available.
6. A question with no supporting evidence receives an uncertainty or insufficient-evidence response.
7. A user can generate a summary and compare at least two supported documents.
8. A user cannot access another user's documents or conversations.
9. Deleting a document removes it from the library and schedules or completes removal of associated indexed data.
10. The application can be built, tested, configured, and run using its documentation.

## 11. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Poor PDF text extraction | Validate extracted text and provide processing diagnostics |
| Scanned documents fail | Add an OCR stage with explicit OCR status |
| Incorrect AI answers | Ground responses in retrieved evidence and test citation validity |
| Relevant passages are missed | Evaluate retrieval; tune chunking, hybrid search, and reranking |
| Slow document processing | Use background jobs and configurable limits |
| LLM provider outages | Add timeouts, clear failure states, and controlled retries |
| Data leakage | Enforce ownership checks, private storage, and tenant-scoped retrieval |
| Prompt injection in documents | Treat retrieved text as untrusted evidence and constrain model instructions |
| Scope expansion | Enforce P0/P1/P2 priorities and defer advanced capabilities |

## 12. Definition of Done

A feature is complete only when its implementation, validation, error states, ownership rules, tests, and relevant documentation are in place. A visually complete interface without working backend behaviour does not count as a completed feature.

