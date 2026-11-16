import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ArrowRight,
  BookOpen,
  Trash2,
  Clock,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

interface SampleConversation {
  id: string;
  title: string;
  scopeType: 'document' | 'collection';
  scopeName: string;
  messageCount: number;
  lastActive: string;
}

export const ConversationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSampleRows, setShowSampleRows] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SampleConversation | null>(null);

  const sampleConversations: SampleConversation[] = [
    {
      id: 'conv-arch-101',
      title: 'Q3 Operating Cash Flow & Working Capital Breakdown',
      scopeType: 'document',
      scopeName: 'Q3_Financial_Analysis_2025.pdf',
      messageCount: 6,
      lastActive: 'Today at 09:12 AM',
    },
    {
      id: 'conv-arch-102',
      title: 'Vector Dimension & FastEmbed Ingestion Compatibility',
      scopeType: 'document',
      scopeName: 'Enterprise_Architecture_Spec.docx',
      messageCount: 4,
      lastActive: 'Yesterday',
    },
    {
      id: 'conv-arch-103',
      title: 'Cross-Document Dossier Synthesis: CapEx Commitments',
      scopeType: 'collection',
      scopeName: 'Q3 Financial Dossier',
      messageCount: 8,
      lastActive: 'Oct 24, 2026',
    },
  ];

  const filteredConversations = sampleConversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.scopeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      showToast(
        `Conversation "${deleteTarget.title}" deleted (UI state). Backend persistence connects in Phase 5.`,
        'info'
      );
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Conversation History"
        description="Review past question-answering sessions, re-open cited evidence, and resume previous inquiries."
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Conversations' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSampleRows(!showSampleRows);
                showToast(
                  showSampleRows ? 'Clean empty state active' : 'Sample conversation rows enabled',
                  'info'
                );
              }}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              {showSampleRows ? 'Show Clean State' : 'Inspect Sample Threads'}
            </Button>
            <Link to="/app/conversations/demo-thread">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-accent" />}
              >
                Inspect Thread Shell
              </Button>
            </Link>
          </div>
        }
      />

      <PhaseBanner
        featureName="Conversation History"
        targetPhase="Phase 5 (RAG &amp; Conversation Management)"
        notes="Conversations persist Q&amp;A sessions with user queries, assistant responses, and verified citation records. CRUD endpoints (POST/GET /api/v1/conversations) will connect in Phase 5."
      />

      {/* Search Bar */}
      <div className="card p-4 flex items-center justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search conversation history by title or scope..."
          className="flex-1 max-w-md"
        />

        <div className="text-xs text-text-secondary hidden sm:block">
          <span>Session history with persistent citation links</span>
        </div>
      </div>

      {/* Content Area */}
      {showSampleRows ? (
        <div className="space-y-4">
          <div className="p-3 bg-accent-light/40 border border-accent/20 rounded-xl flex items-center justify-between text-xs text-text-secondary">
            <span className="flex items-center gap-1.5 font-medium text-accent">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Layout Demonstration: Showing {filteredConversations.length} sample conversation threads</span>
            </span>
            <button
              onClick={() => setShowSampleRows(false)}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Switch to Clean Empty State
            </button>
          </div>

          <div className="card p-0 overflow-hidden divide-y divide-border">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 bg-accent-light text-accent rounded-xl mt-0.5 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <Link
                      to={`/app/conversations/${conv.id}`}
                      className="font-semibold text-sm text-text-primary hover:text-accent hover:underline block truncate max-w-md sm:max-w-xl"
                    >
                      {conv.title}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">
                      <span className="bg-surface border border-border px-2 py-0.5 rounded text-[11px] font-medium text-text-primary">
                        Scope: {conv.scopeName}
                      </span>
                      <span>&bull;</span>
                      <span>{conv.messageCount} messages</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{conv.lastActive}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/app/conversations/${conv.id}`}>
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                      Open Thread
                    </Button>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(conv)}
                    className="p-2 text-text-secondary hover:text-error rounded-lg hover:bg-error-light transition-colors"
                    title="Delete Conversation"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Honest Clean Empty State */
        <div className="card p-0 overflow-hidden">
          <EmptyState
            icon={<MessageSquare className="w-6 h-6" />}
            title="No saved conversations"
            description="When you ask questions against documents or collections in the assistant workspace, your chat history and verified citations will be preserved here."
            action={
              <Link to="/app/conversations/demo-thread">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<BookOpen className="w-3.5 h-3.5 text-accent" />}
                >
                  Inspect Conversation Thread Shell
                </Button>
              </Link>
            }
            secondaryAction={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSampleRows(true)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Inspect Sample Threads
              </Button>
            }
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDestructive={true}
        title="Delete Conversation"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This conversation history and associated citation records will be permanently removed.`}
        confirmText="Delete Thread"
      />
    </div>
  );
};
