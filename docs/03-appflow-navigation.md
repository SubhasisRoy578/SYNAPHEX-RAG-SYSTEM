# DOCUMENT 3 — APPFLOW: FEATURES AND NAVIGATION LOGIC

## 1. Purpose

This document defines the user journey, application navigation, page responsibilities, interaction logic, and principal state transitions for SYNAPHEX.

## 2. Global Navigation

The authenticated application uses a persistent sidebar on desktop and a collapsible navigation drawer on smaller screens.

### Primary navigation

1. **Dashboard** — workspace overview and recent activity.
2. **Documents** — uploaded files and processing statuses.
3. **Collections** — groups of documents for related work.
4. **Analysis Studio** — summaries and structured extraction.
5. **Compare Documents** — evidence-backed comparison of selected files.
6. **Conversations** — saved question-answering sessions.
7. **Settings** — profile, application preferences, and supported configuration options.

A global **Upload Document** action should be visible from the Dashboard, Documents page, and empty workspace states.

The document reader and AI assistant should open together in a dedicated document workspace.

## 3. Route Map

| Route | Page | Access |
|---|---|---|
| `/` | Public landing page | Public |
| `/login` | Sign in | Public |
| `/register` | Account creation | Public |
| `/app` | Dashboard | Authenticated |
| `/app/documents` | Document library | Authenticated |
| `/app/documents/:documentId` | Document workspace | Authenticated |
| `/app/collections` | Collections list | Authenticated |
| `/app/collections/:collectionId` | Collection workspace | Authenticated |
| `/app/analysis` | Analysis Studio | Authenticated |
| `/app/compare` | Document comparison | Authenticated |
| `/app/conversations` | Conversation history | Authenticated |
| `/app/conversations/:conversationId` | Conversation detail | Authenticated |
| `/app/settings` | Settings | Authenticated |

Invalid routes should show a not-found state. Protected routes should redirect unauthenticated users to sign in. Accessing another user's resource must result in a server-side denial, not merely a frontend redirect.

## 4. Main User Journey

### Journey A — First-time user

1. User opens the landing page.
2. User selects **Get Started**.
3. User creates an account or signs in.
4. User arrives at the Dashboard.
5. Dashboard shows an empty state with a clear upload action.
6. User uploads a supported file.
7. The system validates and begins processing.
8. The user sees a processing status.
9. When processing succeeds, the document becomes available in the library.
10. The user opens the document workspace and asks a question.

**Failure branch:** If processing fails, show the reason category, a retry action where appropriate, and a link to return to the document. Do not silently remove the uploaded item.

### Journey B — Upload a document

1. Click **Upload Document**.
2. Open a file picker.
3. Select a file.
4. Validate the extension, content, size, and file readability.
5. If invalid, show an inline error and allow another selection.
6. If valid, upload to the backend.
7. Create a document record and processing job.
8. Display the document in the library with status.
9. Poll or refresh status until the job reaches a terminal state.
10. Enable document reading and AI actions only when required processing has succeeded.

**Status logic**

- `queued`: waiting for processing.
- `processing`: extraction or indexing is in progress.
- `ready`: required text and retrieval index are available.
- `failed`: processing did not complete.

Optional stages such as OCR should have their own progress details when useful, without creating a confusing number of top-level statuses.

### Journey C — Ask questions about one document

1. Open a ready document.
2. The document reader appears in the main content area.
3. The assistant panel displays the document title and selected scope.
4. User submits a question.
5. The frontend shows a pending response state.
6. The backend validates ownership and scope.
7. Retrieval searches only chunks from the selected document.
8. The model generates an answer from the retrieved evidence.
9. The backend validates the citations.
10. The UI displays the answer, citations, and source excerpts.
11. User selects a citation.
12. The reader opens the corresponding page or section where available.
13. User can ask a follow-up question.

If the document is not ready, disable the send action and explain why.

### Journey D — Ask questions across a collection

1. User opens Collections.
2. User creates or selects a collection.
3. User adds processed documents.
4. User opens the collection workspace.
5. User selects **Ask this collection**.
6. The assistant displays the active document scope.
7. User submits a question.
8. The backend validates access to the collection and its members.
9. Retrieval searches only the selected eligible documents.
10. The answer presents citations from one or more source documents.

If a collection contains failed or unprocessed documents, identify them and exclude them from retrieval until ready.

### Journey E — Summarise a document

1. Open a ready document.
2. Select **Analyse** or open Analysis Studio.
3. Choose the source document.
4. Choose summary style: concise or detailed.
5. Submit the request.
6. Show loading and failure states.
7. Display the generated summary and key points.
8. Show supporting citations where available.
9. Allow the user to copy or export the result when export is implemented.

### Journey F — Compare documents

1. Open Compare Documents.
2. Select at least two ready documents.
3. Choose comparison focus: general differences, requirements, figures/dates, or policy changes.
4. Submit the comparison.
5. Retrieve evidence from each selected document.
6. Generate a structured comparison.
7. Display similarities, differences, conflicts, and source references.
8. Allow each citation to open its source document.

Do not claim a difference exists if the required source evidence was not retrieved or is unavailable.

### Journey G — Delete a document

1. User opens the document menu.
2. Selects Delete.
3. Confirmation dialog identifies the document to be deleted.
4. User confirms.
5. Backend verifies ownership.
6. System removes the document from user-visible lists and initiates deletion of the original file, chunks, vector records, and dependent metadata.
7. UI reports completion only when the application's defined deletion operation succeeds.
8. If part of the deletion process fails, record the failure for retry and avoid leaving the document silently searchable.

Deleting a document should not accidentally delete unrelated collection members or conversations. The handling of historical conversations referencing deleted sources must be explicit: retain a clearly marked unavailable-source record or remove dependent content according to the application's documented policy.

## 5. Page-Level Feature Logic

### 5.1 Landing page
- Explain the problem and core capabilities.
- Show how upload, retrieval, and citations work.
- Provide sign-in and registration actions.
- Do not display fabricated customer counts, usage metrics, or performance statistics.

### 5.2 Dashboard
- Recent documents.
- Processing activity.
- Recent conversations.
- Quick upload action.
- Empty state for a new account.
- Errors and failed jobs that require attention.

Any displayed counts must come from actual backend data.

### 5.3 Document library
- Search by filename.
- Filter by status and file format.
- Sort by upload date or name.
- Rename, preview, open, and delete.
- Multi-select documents for collection membership or comparison, where implemented.
- Show file-processing status and actionable errors.

### 5.4 Document workspace
- Document title and metadata.
- Reader or extracted-text panel.
- Assistant panel.
- Active document/collection scope.
- Chat history.
- Citation cards.
- Processing warnings.
- Document-specific actions.

On narrow screens, use a tabbed reader/assistant layout rather than squeezing both panels into unreadable columns.

### 5.5 Collections
- Create and rename collections.
- Add or remove documents.
- Show readiness status for each member.
- Open the collection assistant.
- Prevent duplicate memberships.
- Enforce user ownership.

### 5.6 Analysis Studio
- Select source documents.
- Select analysis type.
- Configure summary style or extraction fields.
- Display results with evidence.
- Provide clear loading, failure, and empty states.
- Export only after the relevant export feature exists.

### 5.7 Compare Documents
- Multi-document selection.
- Comparison type.
- Side-by-side source references.
- Findings grouped into similarities, differences, and conflicts.
- Citation navigation to each source.

### 5.8 Conversations
- List saved conversations.
- Display title, date, and associated document scope.
- Reopen conversations.
- Start a new conversation.
- Delete conversations.
- Indicate when a cited source has since been deleted.

### 5.9 Settings
- Profile and sign-out.
- Application preferences.
- Available AI configuration information, without exposing secrets.
- Privacy and data deletion information.
- Upload limits and supported file types.
- Avoid presenting backend-only provider secrets as editable browser settings.

## 6. Core State Machines

### Document processing

```text
UPLOADED
   |
   v
QUEUED ---> PROCESSING
               |
        +------+------+
        |             |
        v             v
      READY          FAILED
                       |
                       v
                    RETRY
                       |
                       v
                     QUEUED
```

A retry must not duplicate already completed indexing work. Processing state transitions must be validated on the backend.

### Chat request

```text
IDLE -> SUBMITTING -> RETRIEVING -> GENERATING
                                      |
                           +----------+----------+
                           |                     |
                           v                     v
                        COMPLETE               FAILED
```

The UI may simplify internal stages to a single pending state, but should display useful progress where feasible.

### Delete request

```text
ACTIVE -> DELETE_REQUESTED -> DELETING
                                  |
                         +--------+--------+
                         |                 |
                         v                 v
                      DELETED       DELETE_FAILED
                                          |
                                          v
                                       RETRY
```

## 7. API Interaction Rules

- All protected API calls require verified authentication.
- The frontend must not decide ownership based on client-supplied identifiers.
- Disable duplicate submissions while an operation is pending.
- Use request identifiers or idempotency controls for operations that may be retried.
- Poll only while processing is active and stop after a terminal state.
- Show actionable errors without exposing internal stack traces.
- Update document and conversation lists after successful mutations.
- Clear stale local state when the current user signs out.
- Do not display an AI answer as complete until citation validation and the response operation have completed.

## 8. Navigation and Error Handling

- Preserve a return path after sign-in where safe.
- Use breadcrumbs in document and collection workspaces.
- Show a not-found page for missing resources.
- Show an access-denied state without leaking whether another user's private resource exists.
- Provide retry actions for transient network or processing errors.
- Preserve a user's unsent question when a recoverable request failure occurs.
- Confirm destructive actions.
- Use clear empty states instead of placeholder data.

## 9. AppFlow Acceptance Criteria

- Every primary navigation item leads to a defined page.
- Each major user journey has a success and failure path.
- A user can navigate from a cited answer to the correct source.
- Document processing status is consistent with backend status.
- Protected routes and API operations enforce authentication.
- Collection and comparison scope is respected by retrieval.
- Deletion handles indexed data and failures explicitly.
- All loading, empty, error, and success states are designed before implementation.

