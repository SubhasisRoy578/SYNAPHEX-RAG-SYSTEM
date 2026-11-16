import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Send,
  Sparkles,
  ExternalLink,
  User,
  Copy,
  BookOpen,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

export const ConversationDetailPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { showToast } = useToast();
  const [inputVal, setInputVal] = useState('');

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Message copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Conversation Thread"
        description="Review evidence-grounded dialogue, examine verified source citations, and submit follow-up questions."
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Conversations', href: '/app/conversations' },
          { label: conversationId || 'Active Session' },
        ]}
        badge={
          <span className="text-[11px] font-semibold bg-accent-light text-accent px-2 py-0.5 rounded border border-accent/20">
            Document Scope
          </span>
        }
        actions={
          <Link to="/app/documents/doc-sync-101">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<BookOpen className="w-3.5 h-3.5 text-accent" />}
            >
              Open Cited Document
            </Button>
          </Link>
        }
      />

      <PhaseBanner
        featureName="Conversation Detail &amp; Evidence Thread"
        targetPhase="Phase 5 (RAG &amp; Messages API)"
        notes="Messages are linked to retrieved chunks and preserved in PostgreSQL with verified citation foreign keys. Message generation endpoints connect in Phase 5."
      />

      {/* Chat Thread Container */}
      <div className="card p-0 flex flex-col min-h-[540px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-background/50">
          {/* User Message 1 */}
          <div className="flex items-start gap-3 max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-sidebar flex items-center justify-center text-white text-xs font-semibold shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="bg-surface p-4 rounded-2xl rounded-tl-none border border-border shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-text-secondary block">
                User Question
              </span>
              <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                What are the primary architectural components of SYNAPHEX, and how does the platform prevent hallucinated citations?
              </p>
            </div>
          </div>

          {/* Assistant Grounded Answer 1 */}
          <div className="flex items-start gap-3 max-w-2xl ml-auto flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-accent-light/30 p-5 rounded-2xl rounded-tr-none border border-accent/20 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-accent">
                  SYNAPHEX Assistant (Evidence-Grounded)
                </span>
                <span className="text-[10px] text-success font-semibold bg-success-light px-2 py-0.5 rounded border border-success/30">
                  Validated Citations
                </span>
              </div>

              <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                SYNAPHEX consists of a React/TypeScript frontend, a modular FastAPI backend, PostgreSQL for relational state, and Qdrant for tenant-isolated vector retrieval. Hallucinated citations are prevented by enforcing that every response statement maps directly to retrieved passage IDs with server-side validation.
              </p>

              {/* Citations Box */}
              <div className="pt-2 border-t border-accent/20 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary block">
                  Grounding Sources
                </span>
                <div className="p-2.5 bg-surface rounded-lg border border-border text-xs flex items-center justify-between shadow-2xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-accent text-[11px] block">
                      [1] 01-project-requirements.md (Sec 2 &amp; 7)
                    </span>
                    <p className="text-[10px] text-text-secondary italic">
                      "...reliable document processing and evidence-grounded RAG, not merely a chatbot interface..."
                    </p>
                  </div>
                  <Link
                    to="/app/documents/doc-sync-101"
                    className="p-1 text-text-secondary hover:text-accent rounded hover:bg-gray-100"
                    title="View Source Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() =>
                    copyText(
                      'SYNAPHEX consists of a React/TypeScript frontend, a modular FastAPI backend, PostgreSQL for relational state, and Qdrant for tenant-isolated vector retrieval.'
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-text-secondary hover:text-text-primary"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy answer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Input Box */}
        <div className="p-4 bg-surface border-t border-border">
          <div className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a follow-up question..."
              disabled
              className="w-full pl-4 pr-12 py-3 text-xs sm:text-sm bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/60 cursor-not-allowed opacity-75"
            />
            <button
              disabled
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 text-accent/50 cursor-not-allowed"
              title="Follow-up generation connects in Phase 5"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-text-secondary mt-1.5 text-center">
            Session history preserves verified citations. Real-time RAG inference activates in Phase 5.
          </p>
        </div>
      </div>
    </div>
  );
};
