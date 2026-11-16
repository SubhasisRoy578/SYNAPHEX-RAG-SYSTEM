import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Send,
  Sparkles,
  FolderKanban,
  X,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../components/Toast';

export const CollectionWorkspacePage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const { showToast } = useToast();
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  const memberDocuments = [
    {
      id: 'doc-sync-101',
      filename: 'Q3_Financial_Analysis_2025.pdf',
      format: 'PDF',
      size: '4.2 MB',
      status: 'ready' as const,
      chunks: 28,
    },
    {
      id: 'doc-sync-102',
      filename: 'Enterprise_Architecture_Spec.docx',
      format: 'DOCX',
      size: '1.8 MB',
      status: 'ready' as const,
      chunks: 14,
    },
    {
      id: 'doc-sync-103',
      filename: 'Platform_Security_Checklist.txt',
      format: 'TXT',
      size: '340 KB',
      status: 'queued' as const,
      chunks: 0,
    },
  ];

  const handleAddDocument = (filename: string) => {
    showToast(`Added "${filename}" to active collection scope.`, 'info');
    setShowAddDocModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Collection Workspace"
        description="Ask questions across all indexed documents in this collection with aggregated evidence citations."
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Collections', href: '/app/collections' },
          { label: collectionId || 'Dossier Workspace' },
        ]}
        badge={
          <span className="text-[11px] font-semibold bg-accent-light text-accent px-2 py-0.5 rounded border border-accent/20">
            Multi-Document Retrieval Scope
          </span>
        }
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddDocModal(true)}
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Add Member Document
          </Button>
        }
      />

      <PhaseBanner
        featureName="Multi-Document Collection Workspace"
        targetPhase="Phase 5 &amp; 6 (Multi-Document Retrieval &amp; Collections UI)"
        notes="Collection queries pass an array of authorized document IDs to Qdrant filters. Citations can reference passages across distinct files in the collection."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Collection Member Documents (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">Member Documents</h2>
              </div>
              <span className="text-xs text-text-secondary font-mono">
                {memberDocuments.filter((d) => d.status === 'ready').length} of {memberDocuments.length} Ready
              </span>
            </div>

            <div className="divide-y divide-border">
              {memberDocuments.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 bg-gray-100 rounded-lg text-text-secondary shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-text-primary block truncate max-w-[200px]">
                        {doc.filename}
                      </span>
                      <span className="text-[10px] text-text-secondary font-mono">
                        {doc.size} &bull; {doc.chunks} chunks
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={doc.status} size="sm" />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowAddDocModal(true)}
                leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
              >
                Add Document to Collection
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Collection Assistant (7 cols) */}
        <div className="lg:col-span-7 card p-0 flex flex-col min-h-[520px] overflow-hidden">
          <div className="h-12 bg-gray-50 border-b border-border px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-text-primary">Collection Assistant</span>
            </div>
            <span className="text-[11px] text-text-secondary">
              Scope: {memberDocuments.length} Documents
            </span>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-surface">
            {/* Demonstration Synthesis Card */}
            <div className="p-4 bg-accent-light/20 rounded-xl border border-accent/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary">
                  Synthesized Cross-Document Finding
                </span>
                <span className="text-[10px] text-success font-semibold bg-success-light px-2 py-0.5 rounded border border-success/30">
                  2 Sources Cited
                </span>
              </div>

              <p className="text-xs text-text-primary leading-relaxed font-medium">
                The Q3 Financial Analysis reports operating cash flows of $42.6M, while the Architecture Specification outlines capital expenditure allocations of $12M for cloud vector infrastructure modernization.
              </p>

              {/* Citations from multiple documents */}
              <div className="pt-2 border-t border-accent/20 space-y-1.5">
                <div className="p-2.5 bg-surface rounded-lg border border-border text-xs flex items-center justify-between">
                  <span className="font-semibold text-accent text-[11px]">
                    [1] Q3_Financial_Analysis_2025.pdf (Page 14)
                  </span>
                  <Link to="/app/documents/doc-sync-101" className="text-[10px] text-text-secondary hover:text-accent">
                    Open Source
                  </Link>
                </div>
                <div className="p-2.5 bg-surface rounded-lg border border-border text-xs flex items-center justify-between">
                  <span className="font-semibold text-accent text-[11px]">
                    [2] Enterprise_Architecture_Spec.docx (Section 4.1)
                  </span>
                  <Link to="/app/documents/doc-sync-102" className="text-[10px] text-text-secondary hover:text-accent">
                    Open Source
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-gray-50 border-t border-border">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask a synthesis question across all documents in this collection..."
                disabled
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-secondary/60 cursor-not-allowed opacity-75"
              />
              <button
                disabled
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-accent/50 cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-text-secondary mt-1 text-center">
              Queries only search ready documents belonging to this collection.
            </p>
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">Add Documents from Library</h3>
              </div>
              <button
                onClick={() => setShowAddDocModal(false)}
                className="p-1 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs">
              <p className="text-text-secondary leading-relaxed">
                Select documents from your library to add to this collection scope:
              </p>
              <div className="space-y-2">
                {['Annual_Report_2025.pdf', 'Board_Resolutions_Oct.docx', 'Compliance_Policy_V2.pdf'].map(
                  (name) => (
                    <div
                      key={name}
                      onClick={() => handleAddDocument(name)}
                      className="p-2.5 rounded-lg border border-border hover:border-accent hover:bg-accent-light/20 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="font-medium text-text-primary">{name}</span>
                      <span className="text-[10px] text-accent font-semibold">+ Add</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-border flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowAddDocModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
