import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Send,
  Sparkles,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Info,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { StatusBadge } from '../components/StatusBadge';
import { Tabs } from '../components/Tabs';
import { useToast } from '../components/Toast';

export const DocumentWorkspacePage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'reader' | 'assistant'>('reader');
  const [assistantTab, setAssistantTab] = useState<string>('qa');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [highlightCitation, setHighlightCitation] = useState<boolean>(false);
  const [showUncertaintyDemo, setShowUncertaintyDemo] = useState<boolean>(false);

  const readerContentRef = useRef<HTMLDivElement>(null);

  const totalPages = 3;

  const scrollToCitation = () => {
    setCurrentPage(1);
    setHighlightCitation(true);
    showToast('Navigated reader to Page 1, Section 1.2 citation target', 'info');
    setTimeout(() => {
      setHighlightCitation(false);
    }, 3500);
  };

  const copyExcerpt = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Source excerpt copied to clipboard', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            to="/app/documents"
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-100 transition-colors"
            title="Back to library"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary truncate max-w-xs sm:max-w-md">
                SYNAPHEX Architecture &amp; RAG Specification
              </h1>
              <StatusBadge status="ready" size="sm" />
            </div>
            <p className="text-[11px] text-text-secondary font-mono">
              Document ID: {documentId || 'doc-sync-101'} &bull; Format: PDF &bull; 28 Chunks
            </p>
          </div>
        </div>

        {/* Tab switch for mobile / tablet */}
        <div className="flex lg:hidden items-center bg-gray-100 p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('reader')}
            className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'reader' ? 'bg-surface text-text-primary shadow-xs font-semibold' : 'text-text-secondary'
            }`}
          >
            Reader
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'assistant' ? 'bg-surface text-text-primary shadow-xs font-semibold' : 'text-text-secondary'
            }`}
          >
            Assistant
          </button>
        </div>
      </div>

      <PhaseBanner
        featureName="Document Reader & Assistant Split-Workspace"
        targetPhase="Phase 5 (RAG) & Phase 6 (PDF.js Integration)"
        notes="58% Reader / 42% Assistant desktop proportions, citation-highlight navigation, and abstention demonstrations are active. PDF.js canvas and live Qdrant retrieval connect in Phases 5 & 6."
      />

      {/* Main Dual Workspace (58% / 42%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[660px]">
        {/* Left: Document Reader (7 cols / ~58%) */}
        <div
          className={`lg:col-span-7 flex flex-col card p-0 overflow-hidden ${
            activeTab === 'reader' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Reader Toolbar */}
          <div className="h-12 bg-gray-50 border-b border-border px-4 flex items-center justify-between text-xs text-text-secondary select-none">
            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 text-text-secondary hover:text-text-primary rounded disabled:opacity-40"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs">
                Page <strong className="text-text-primary">{currentPage}</strong> of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 text-text-secondary hover:text-text-primary rounded disabled:opacity-40"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Indicator & Zoom Controls */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-text-secondary bg-surface px-2 py-0.5 rounded border border-border hidden sm:inline">
                Extracted Text View
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                  className="p-1 text-text-secondary hover:text-text-primary rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs w-10 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="p-1 text-text-secondary hover:text-text-primary rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Reader Content / Viewer Canvas */}
          <div
            ref={readerContentRef}
            className="flex-1 p-6 sm:p-8 bg-background/50 overflow-y-auto space-y-6"
            style={{ fontSize: `${zoomLevel}%` }}
          >
            {currentPage === 1 && (
              <div className="max-w-2xl mx-auto bg-surface p-6 sm:p-8 rounded-xl border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs text-text-secondary pb-3 border-b border-border">
                  <span className="font-semibold text-text-primary">SECTION 1 — EXECUTIVE SPECIFICATION</span>
                  <span className="font-mono text-[11px]">Source Page 1</span>
                </div>

                <h2 className="text-base font-bold text-text-primary">
                  1.1 Purpose of the Platform
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  SYNAPHEX is an AI-powered document intelligence platform engineered to bridge lengthy corporate documents and verifiable decision-making. The system parses PDF, DOCX, and TXT files, indexes semantic chunks, and enables conversational retrieval without fabricating citations or page numbers.
                </p>

                <h3 className="text-sm font-bold text-text-primary pt-2">
                  1.2 Retrieval-Augmented Generation &amp; Citation Grounding
                </h3>
                <div
                  className={`p-3.5 rounded-lg border transition-all ${
                    highlightCitation
                      ? 'bg-accent-light/80 border-accent ring-2 ring-accent/30 shadow-sm'
                      : 'bg-background/80 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-accent">[Target Citation Passages &bull; Chunk #101]</span>
                    <button
                      onClick={() =>
                        copyExcerpt(
                          'The central engineering priority is reliable document processing and evidence-grounded RAG, not merely a chatbot interface. The application must not fabricate citations, page numbers, source content, analytics, or processing progress.'
                        )
                      }
                      className="p-1 text-text-secondary hover:text-text-primary rounded hover:bg-surface"
                      title="Copy exact excerpt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-text-primary leading-relaxed italic">
                    "The central engineering priority is reliable document processing and evidence-grounded RAG, not merely a chatbot interface. The application must not fabricate citations, page numbers, source content, analytics, or processing progress."
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-2">
                  All assistant responses are validated against retrieved passages. If supporting evidence is insufficient or contradictory, the system abstains from answering rather than hallucinating plausible facts.
                </p>
              </div>
            )}

            {currentPage === 2 && (
              <div className="max-w-2xl mx-auto bg-surface p-6 sm:p-8 rounded-xl border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs text-text-secondary pb-3 border-b border-border">
                  <span className="font-semibold text-text-primary">SECTION 2 — TECHNICAL ARCHITECTURE</span>
                  <span className="font-mono text-[11px]">Source Page 2</span>
                </div>
                <h2 className="text-base font-bold text-text-primary">
                  2.1 Ingestion Pipeline &amp; Chunking
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Documents are validated for permitted MIME types and size (up to 25 MB). PyMuPDF extracts text and bounding boxes for PDFs, while python-docx extracts paragraph hierarchies and tables. Chunks of 500–800 tokens with 80–120 token overlap are embedded using provider-independent adapters.
                </p>
                <h3 className="text-sm font-bold text-text-primary pt-2">
                  2.2 Relational &amp; Vector Separation
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  PostgreSQL maintains authoritative records for users, documents, processing jobs, and message citations. Qdrant holds dense vectors with mandatory tenant isolation filters on every retrieval call.
                </p>
              </div>
            )}

            {currentPage === 3 && (
              <div className="max-w-2xl mx-auto bg-surface p-6 sm:p-8 rounded-xl border border-border shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs text-text-secondary pb-3 border-b border-border">
                  <span className="font-semibold text-text-primary">SECTION 3 — SECURITY &amp; ISOLATION</span>
                  <span className="font-mono text-[11px]">Source Page 3</span>
                </div>
                <h2 className="text-base font-bold text-text-primary">
                  3.1 Multi-Tenant Isolation
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  User ownership is verified on all protected API routes. A user cannot access or query another user's document or collection by tampering with client-supplied IDs. Document deletion cascades across storage files, PostgreSQL records, and Qdrant points.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Assistant (5 cols / ~42%) */}
        <div
          className={`lg:col-span-5 flex flex-col card p-0 overflow-hidden ${
            activeTab === 'assistant' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Assistant Header */}
          <div className="h-12 bg-gray-50 border-b border-border px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-text-primary">SYNAPHEX Assistant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-accent-light text-accent font-semibold px-2 py-0.5 rounded">
                Scope: Single Document
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="px-4 py-2 border-b border-border bg-surface flex items-center justify-between">
            <Tabs
              tabs={[
                { id: 'qa', label: 'Q&A Thread' },
                { id: 'summary', label: 'Quick Summary' },
              ]}
              activeTab={assistantTab}
              onChange={setAssistantTab}
              variant="pills"
            />
            <button
              onClick={() => {
                setShowUncertaintyDemo(!showUncertaintyDemo);
                showToast(
                  showUncertaintyDemo ? 'Showing standard grounded answer' : 'Showing uncertainty/abstention behavior',
                  'info'
                );
              }}
              className="text-[11px] text-accent hover:underline font-medium"
            >
              {showUncertaintyDemo ? 'Reset Demo' : 'Test Abstention'}
            </button>
          </div>

          {/* Assistant Message Stream */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-surface">
            {assistantTab === 'qa' ? (
              <>
                {/* System Notice Bubble */}
                <div className="p-3 bg-background rounded-lg border border-border text-xs text-text-secondary flex items-start gap-2">
                  <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    Questions are answered strictly using retrieved passages from this document. Unsupported claims and hallucinated citations are rejected.
                  </span>
                </div>

                {!showUncertaintyDemo ? (
                  /* Demonstration Grounded Response Card */
                  <div className="p-4 bg-accent-light/20 rounded-xl border border-accent/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary">Assistant (Grounded Response)</span>
                      <span className="text-[10px] text-success font-semibold bg-success-light px-2 py-0.5 rounded border border-success/30">
                        1 Verified Source
                      </span>
                    </div>

                    <p className="text-xs text-text-primary leading-relaxed font-medium">
                      The central engineering priority of SYNAPHEX is reliable document processing and evidence-grounded RAG. The system prohibits fabricating citations, page numbers, or statistics.
                    </p>

                    {/* Interactive Citation Card */}
                    <div className="p-3 bg-surface rounded-lg border border-border text-xs space-y-2 shadow-2xs hover:border-accent/40 transition-colors">
                      <div className="flex items-center justify-between text-accent font-semibold text-[11px]">
                        <span>[1] SYNAPHEX Architecture (Page 1, Sec 1.2)</span>
                        <button
                          onClick={scrollToCitation}
                          className="flex items-center gap-1 text-[10px] text-accent hover:underline font-semibold"
                        >
                          <span>Locate in Reader</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-text-secondary italic leading-relaxed">
                        "...reliable document processing and evidence-grounded RAG, not merely a chatbot interface. The application must not fabricate citations..."
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Demonstration of Abstention / Insufficient Evidence */
                  <div className="p-4 bg-warning-light/30 rounded-xl border border-warning/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary">User Question: What is the company revenue in 2024?</span>
                      <span className="text-[10px] text-warning font-semibold bg-warning-light px-2 py-0.5 rounded border border-warning/30">
                        Insufficient Evidence
                      </span>
                    </div>
                    <p className="text-xs text-text-primary leading-relaxed">
                      <strong>I cannot answer this question based on the document.</strong> The provided document focuses on system architecture and RAG specifications and does not contain financial data or 2024 revenue figures.
                    </p>
                    <div className="p-2.5 bg-surface rounded-lg border border-border text-[11px] text-text-secondary">
                      <span>Reason: Query concepts not found in retrieved chunks. Zero hallucination policy enforced.</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Quick Summary Tab */
              <div className="p-4 bg-background rounded-xl border border-border space-y-3 text-xs">
                <h4 className="font-semibold text-text-primary">Executive Summary Preview</h4>
                <p className="text-text-secondary leading-relaxed">
                  This document specifies the technical foundation of SYNAPHEX, a document intelligence platform prioritizing citation integrity and tenant data isolation.
                </p>
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                    Key Highlights
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-text-secondary">
                    <li>Strict citation verification against stored chunks</li>
                    <li>Multi-tenant relational &amp; vector separation</li>
                    <li>Abstention behavior when facts are absent</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Question Input Box */}
          <div className="p-3 bg-gray-50 border-t border-border">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask a question about this document..."
                disabled
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-secondary/60 cursor-not-allowed opacity-75"
                title="RAG question-answering pipeline activates in Phase 5"
              />
              <button
                disabled
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-accent/50 cursor-not-allowed"
                title="Send query (Phase 5)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-text-secondary mt-1.5 text-center">
              All answers are validated against retrieved passages prior to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
