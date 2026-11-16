# DOCUMENT 4 — UI/UX DESIGN BRIEF

## 1. Design Objective

Design SYNAPHEX as a premium, professional document intelligence workspace. The interface should make lengthy documents easier to explore and AI-generated findings easier to verify.

The product should feel like a serious productivity application rather than a generic chatbot or a decorative AI dashboard.

**Primary design principle:** The document and its evidence are the centre of the experience; the AI assistant is a tool for understanding that evidence.

## 2. Brand Identity

- **Product name:** SYNAPHEX
- **Tagline:** Turn Documents Into Knowledge.
- **Descriptor:** AI-Powered Document Intelligence Platform
- **Brand characteristics:** Precise, intelligent, trustworthy, structured, professional, and modern.
- **Visual direction:** Minimal premium SaaS, restrained colour, high information clarity, strong typography, and purposeful interaction.

Avoid excessive gradients, neon effects, animated backgrounds, decorative glass panels, and oversized marketing claims.

## 3. Visual Design System

### 3.1 Recommended theme

Use a **light neutral interface with a dark graphite navigation area and restrained violet accents**. This provides a professional reading experience while giving the product a recognisable visual identity.

Suggested design tokens:

| Token | Suggested value | Use |
|---|---|---|
| Main background | `#F7F8FA` | Application canvas |
| Surface | `#FFFFFF` | Cards, panels, modals |
| Primary text | `#20232B` | Headings and body text |
| Secondary text | `#697180` | Metadata and descriptions |
| Border | `#E4E7EC` | Dividers and panel outlines |
| Accent | `#6D5AE6` | Primary actions and selected states |
| Success | `#16845B` | Completed operations |
| Warning | `#B7791F` | Processing warnings |
| Error | `#C43D4B` | Failures and destructive warnings |
| Sidebar | `#20232B` | Primary navigation |

These values are proposed design tokens, not fixed dependencies. Use a central theme configuration so the palette can be adjusted consistently.

### 3.2 Typography

- Use a highly readable sans-serif font such as Inter.
- Use a clear hierarchy for page titles, section titles, body text, and metadata.
- Use a readable document font size and line height.
- Use monospaced text only where it improves readability, such as technical identifiers.
- Avoid overly small labels and low-contrast secondary text.

### 3.3 Spacing and shape

- Use a consistent 4-point spacing scale.
- Use moderate corner radii, generally 8–12 px for standard cards and controls.
- Use subtle borders and limited shadows.
- Keep panels visually distinct without excessive card nesting.
- Use consistent button heights and input spacing.

## 4. Global Application Layout

### Desktop

```text
+------------------------------------------------------------+
| SYNAPHEX                     Search       Profile / Menu    |
+------------------+-----------------------------------------+
|                  |                                         |
| Dashboard        | Page title / Breadcrumb                 |
| Documents        |                                         |
| Collections      | Main workspace                          |
| Analysis Studio  |                                         |
| Compare          |                                         |
| Conversations    |                                         |
| Settings         |                                         |
|                  |                                         |
| + Upload         |                                         |
+------------------+-----------------------------------------+
```

Recommended initial desktop layout:
- Sidebar: approximately 240 px.
- Top bar: approximately 64 px.
- Main content padding: approximately 24–32 px.
- Use a maximum content width for pages that do not require a full-width workspace.
- Allow the document reader and assistant to use more horizontal space than ordinary settings pages.

### Mobile and tablet

- Collapse the sidebar into a navigation drawer.
- Keep the upload and main actions accessible.
- Use single-column layouts for document lists and analysis forms.
- Switch the reader and assistant between tabs on narrow screens.
- Ensure citation cards and document controls remain usable without horizontal scrolling.

## 5. Key Screen Specifications

### Screen A — Landing page

**Purpose:** Explain the product and guide visitors to start using it.

Sections:
1. Header with brand, product links, sign-in, and Get Started.
2. Hero heading: “Turn Documents Into Knowledge.”
3. Short explanation of document analysis, grounded answers, and source citations.
4. Product preview showing a document alongside an answer with citations.
5. Feature overview: intelligent reading, evidence-based Q&A, summaries, and comparison.
6. Short privacy and reliability explanation.
7. Final call to action and footer.

Do not use fabricated testimonials, customer logos, adoption metrics, or accuracy percentages.

### Screen B — Dashboard

**Purpose:** Help users resume work and upload documents.

Components:
- Welcome heading.
- Primary Upload Document button.
- Actual document and conversation counts, if available.
- Recent documents.
- Processing activity.
- Recent conversations.
- Empty state for a new account.

Do not show artificial activity, prefilled sample documents, or invented analytics in the real workspace. Optional demonstration content must be clearly labelled as sample data.

### Screen C — Document library

**Purpose:** Organise and access uploaded files.

Components:
- Page title and upload action.
- Search input.
- Filters for status and format.
- List or table with filename, type, upload date, status, and actions.
- Collection membership controls.
- Rename and delete menus.
- Pagination or incremental loading if the library becomes large.

Use text labels alongside status colours. Failed items should provide a retry action when supported.

### Screen D — Document workspace

This is the main product screen and should receive the greatest design attention.

**Desktop layout:**

```text
+------------------------------------------------------------+
| Document title             Status        Actions           |
+-------------------------------+----------------------------+
|                               |                            |
| Document Reader               | SYNAPHEX Assistant         |
|                               |                            |
| Page / Zoom / Search          | Conversation history       |
|                               |                            |
| Document content              | Answer + source citations |
|                               |                            |
|                               | Question input             |
+-------------------------------+----------------------------+
```

Recommended starting proportions:
- Reader: approximately 58%.
- Assistant: approximately 42%.
- Both panels should scroll independently.
- Allow the divider to be resizable if this can be implemented reliably.
- Maintain a readable maximum line width in extracted-text mode.

Reader controls:
- Page navigation.
- Zoom.
- Find text.
- Citation navigation.
- Extraction warnings.

Assistant controls:
- Active document scope.
- Question input.
- Send button.
- Pending response indicator.
- Answer content.
- Source citation cards.
- Insufficient-evidence state.
- Conversation controls.

Each citation card should show:
- Document title.
- Page or section when available.
- Short supporting excerpt.
- Open source action.

Citation navigation should highlight the relevant source text where practical. If exact text coordinates are unavailable, navigate to the best-supported page or section and explain the limitation.

### Screen E — Collections

Components:
- Collection list.
- Create collection action.
- Collection title and optional description.
- Member document list.
- Readiness indicators.
- Add/remove document controls.
- Ask this collection action.

An empty collection should explain that users need to add processed documents before querying it.

### Screen F — Analysis Studio

Components:
- Source document selector.
- Analysis type selector.
- Summary detail options.
- Extraction-field configuration where supported.
- Run analysis button.
- Results panel.
- Evidence references.
- Copy/export actions when implemented.

Avoid displaying static example results as if they were generated from the user's documents.

### Screen G — Compare Documents

Components:
- Multi-document selector.
- Comparison focus selector.
- Compare action.
- Summary of findings.
- Similarities, differences, and conflicts sections.
- Evidence references from each document.
- Side-by-side excerpts where useful.

Use clear visual distinction between direct source differences and model-generated interpretation.

### Screen H — Settings

Components:
- Account information.
- Supported application preferences.
- Upload limits and supported formats.
- Privacy and deletion information.
- Sign-out.
- Provider status information if useful and safe to disclose.

Do not expose server-side credentials or internal secrets.

## 6. Component Library

Create reusable components rather than styling each page independently.

Recommended shared components:
- `AppShell`
- `Sidebar`
- `TopBar`
- `PageHeader`
- `Button`
- `SearchInput`
- `StatusBadge`
- `DocumentRow`
- `DocumentCard`
- `UploadDialog`
- `UploadDropzone`
- `ProcessingProgress`
- `EmptyState`
- `ErrorState`
- `ConfirmDialog`
- `DocumentReader`
- `AssistantPanel`
- `MessageBubble`
- `CitationCard`
- `SourceExcerpt`
- `CollectionSelector`
- `SummaryResult`
- `ComparisonFinding`
- `Toast`
- `LoadingSkeleton`

Components should support consistent loading, disabled, error, and focus states.

## 7. Interaction Requirements

- Use clear hover and focus states.
- Disable actions that cannot currently be used.
- Show progress for long-running operations.
- Provide immediate validation feedback for forms.
- Confirm destructive operations.
- Preserve unsent questions after recoverable errors.
- Make citations look interactive and clearly indicate their source.
- Keep dialogs keyboard-accessible.
- Avoid excessive notifications for ordinary successful actions.
- Ensure the user can identify which document or collection the assistant is querying.

## 8. Accessibility

- Use semantic HTML and meaningful headings.
- Ensure keyboard navigation works throughout the application.
- Provide visible focus indicators.
- Use sufficient text/background contrast.
- Label form fields and icon-only buttons.
- Do not rely exclusively on colour for processing states.
- Respect reduced-motion preferences.
- Support zoom and smaller screens without losing core functionality.

## 9. Motion and Feedback

Use restrained transitions for:
- Sidebar expansion.
- Dialog opening and closing.
- Upload progress.
- Message arrival.
- Panel resizing.
- Toast notifications.

Do not animate the document text or add distracting effects during reading.

## 10. Design Deliverables

Before implementation, prepare:
1. Low-fidelity wireframes for the main screens.
2. A high-fidelity desktop document workspace.
3. Responsive layouts for tablet and mobile.
4. Reusable colour, typography, spacing, and component tokens.
5. Empty, loading, processing, failed, and success states.
6. Clickable navigation prototype.
7. A screen-to-component mapping for the implementation team.

## 11. UI/UX Acceptance Criteria

- The document workspace clearly separates source content from AI responses.
- Citation cards show enough metadata to verify a claim.
- Users can identify the current document or collection scope.
- The upload experience clearly communicates progress and failures.
- Empty states guide the user to a useful next action.
- The interface works on desktop and mobile.
- Real data drives all operational counts and results.
- The same design system is used across all application pages.

