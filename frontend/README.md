# SYNAPHEX — Frontend Application

## Overview
The frontend of **SYNAPHEX** is a Single-Page Application (SPA) built using React 18, TypeScript, Vite, and Tailwind CSS. It is structured around an evidence-first document intelligence interface with persistent dark graphite navigation, a light-neutral workspace, and restrained violet accents.

## Technology Stack
- **Framework:** React 18
- **Language:** TypeScript 5
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3 (Configured with custom HSL design tokens)
- **Routing:** React Router 6
- **Icons:** Lucide React

## Directory Structure
```text
frontend/
├── public/                    # Static assets & SVG favicon
│   └── favicon.svg
├── src/
│   ├── components/            # Reusable UI & design system components
│   │   ├── AppShell.tsx       # Main authenticated layout shell
│   │   ├── Sidebar.tsx        # Persistent dark graphite navigation
│   │   ├── TopBar.tsx         # Breadcrumbs & live backend status indicator
│   │   ├── StatusBadge.tsx    # Accessible document status indicator
│   │   ├── PhaseBanner.tsx    # Honest phase status notice banner
│   │   └── UploadModal.tsx    # Document upload specification modal
│   ├── pages/                 # Route-level page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── DocumentWorkspacePage.tsx
│   │   ├── CollectionsPage.tsx
│   │   ├── CollectionWorkspacePage.tsx
│   │   ├── AnalysisStudioPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── ConversationsPage.tsx
│   │   ├── ConversationDetailPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── types/                 # TypeScript interfaces mirroring API contracts
│   │   └── index.ts
│   ├── App.tsx                # Central routing table
│   ├── index.css              # Base Tailwind directives & custom classes
│   └── main.tsx               # Application entrypoint
├── index.html                 # HTML template with Inter typography
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Route Map

| Route | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Sign in | Public |
| `/register` | Account creation | Public |
| `/app` | Dashboard | Authenticated |
| `/app/documents` | Document library | Authenticated |
| `/app/documents/:documentId` | Document workspace (58/42 reader-assistant split) | Authenticated |
| `/app/collections` | Collections list | Authenticated |
| `/app/collections/:collectionId` | Collection workspace | Authenticated |
| `/app/analysis` | Analysis Studio | Authenticated |
| `/app/compare` | Document comparison | Authenticated |
| `/app/conversations` | Conversation history | Authenticated |
| `/app/conversations/:conversationId` | Conversation detail | Authenticated |
| `/app/settings` | Settings | Authenticated |

## Design Tokens

| Token | Hex Value | Application |
|---|---|---|
| Main Background | `#F7F8FA` | Application canvas |
| Surface | `#FFFFFF` | Cards, panels, modals |
| Primary Text | `#20232B` | Headings and primary body copy |
| Secondary Text | `#697180` | Metadata, timestamps, captions |
| Border | `#E4E7EC` | Outlines, dividers |
| Accent | `#6D5AE6` | Primary CTAs, active highlights |
| Success | `#16845B` | Completed operations & ready status |
| Warning | `#B7791F` | Processing alerts & queued status |
| Error | `#C43D4B` | Failures, destructive warnings |
| Sidebar | `#20232B` | Dark graphite navigation rail |

## Local Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Accessible at: `http://localhost:5173` (Proxies backend requests to `http://localhost:8000`).

### 3. Production Build
```bash
npm run build
```
Generates optimized static bundle in `frontend/dist/`.
