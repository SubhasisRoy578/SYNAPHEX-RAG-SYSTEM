import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderPlus,
  ArrowRight,
  FolderKanban,
  FileText,
  PlusCircle,
  Eye,
  CheckCircle2,
  X,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

interface SampleCollection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  readyCount: number;
  updatedAt: string;
}

export const CollectionsPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSampleGrid, setShowSampleGrid] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const sampleCollections: SampleCollection[] = [
    {
      id: 'col-q3-reports',
      name: 'Q3 Financial Dossier',
      description: 'Grouped 10-Q reports, balance sheets, and earnings call transcripts.',
      documentCount: 4,
      readyCount: 4,
      updatedAt: '2 hours ago',
    },
    {
      id: 'col-arch-specs',
      name: 'System Architecture & Security',
      description: 'Engineering specifications, security checklists, and RFC documentation.',
      documentCount: 3,
      readyCount: 2,
      updatedAt: 'Yesterday',
    },
  ];

  const filteredCollections = sampleCollections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    showToast(
      `Collection "${newColName}" created (UI state). Backend persistence connects in Phase 3.`,
      'info',
      'Phase 3 Operation'
    );
    setShowCreateModal(false);
    setNewColName('');
    setNewColDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Document Collections"
        description="Group related documents into collections to query synthesized evidence across entire dossiers."
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Collections' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSampleGrid(!showSampleGrid);
                showToast(
                  showSampleGrid ? 'Clean empty state active' : 'Sample collection cards enabled',
                  'info'
                );
              }}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              {showSampleGrid ? 'Show Clean State' : 'Inspect Sample Grid'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              New Collection
            </Button>
          </div>
        }
      />

      <PhaseBanner
        featureName="Collections Management"
        targetPhase="Phase 3 (DB Models) & Phase 6 (Collections UI)"
        notes="Collections group multiple documents for aggregated cross-document question answering. Collection membership endpoints (POST/GET /api/v1/collections) will connect in Phases 3 and 6."
      />

      {/* Search & Actions Bar */}
      <div className="card p-4 flex items-center justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search collections by name or description..."
          className="flex-1 max-w-md"
        />

        <div className="text-xs text-text-secondary hidden sm:block">
          <span>Multi-document scoped retrieval</span>
        </div>
      </div>

      {/* Content Area */}
      {showSampleGrid ? (
        <div className="space-y-4">
          <div className="p-3 bg-accent-light/40 border border-accent/20 rounded-xl flex items-center justify-between text-xs text-text-secondary">
            <span className="flex items-center gap-1.5 font-medium text-accent">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Layout Demonstration: Showing {filteredCollections.length} sample collection cards</span>
            </span>
            <button
              onClick={() => setShowSampleGrid(false)}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Switch to Clean Empty State
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCollections.map((col) => (
              <div key={col.id} className="card-interactive flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-accent-light text-accent rounded-lg">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-text-primary">{col.name}</h3>
                    </div>
                    <span className="text-[10px] bg-surface border border-border text-text-secondary px-2 py-0.5 rounded font-mono">
                      {col.id}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-2">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-text-secondary text-[11px]">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>{col.documentCount} Documents</span>
                    </span>
                    <span>&bull;</span>
                    <span>{col.readyCount} Ready</span>
                  </div>

                  <Link to={`/app/collections/${col.id}`}>
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                      Open Workspace
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Honest Clean Empty State */
        <div className="card p-0 overflow-hidden">
          <EmptyState
            icon={<FolderPlus className="w-6 h-6" />}
            title="No collections created yet"
            description="Collections group multiple documents—such as quarterly reports, contracts, or engineering specifications—allowing you to synthesize answers across multiple files at once."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCreateModal(true)}
                leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
              >
                Create First Collection
              </Button>
            }
            secondaryAction={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSampleGrid(true)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Inspect Sample Collection Cards
              </Button>
            }
          />
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-accent-light rounded-lg text-accent">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">Create New Collection</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Competitor Analysis"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  className="input-field"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Brief note on what documents this collection covers..."
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div className="p-3 bg-accent-light/40 border border-accent/20 rounded-xl text-xs text-text-secondary">
                <span className="font-semibold text-accent block mb-0.5">Phase 2 Interaction Note</span>
                <span>Submitting creates an interactive UI state and demonstrates modal flow. Database persistence connects in Phase 3.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Collection
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
