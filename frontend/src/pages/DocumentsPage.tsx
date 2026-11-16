import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  FileUp,
  BookOpen,
  FileText,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Button } from '../components/Button';
import { DocumentStatus } from '../types';
import { useToast } from '../components/Toast';

interface SampleDoc {
  id: string;
  filename: string;
  format: 'PDF' | 'DOCX' | 'TXT';
  size: string;
  status: DocumentStatus;
  chunks: number;
  uploadedAt: string;
}

export const DocumentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSampleRows, setShowSampleRows] = useState<boolean>(false);
  const [deleteDocTarget, setDeleteDocTarget] = useState<SampleDoc | null>(null);

  const statusFilters: { label: string; value: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'Ready', value: 'ready' },
    { label: 'Processing', value: 'processing' },
    { label: 'Queued', value: 'queued' },
    { label: 'Failed', value: 'failed' },
  ];

  // Verified sample demonstration rows for Phase 2 inspection (clearly flagged)
  const sampleDocuments: SampleDoc[] = [
    {
      id: 'doc-sync-101',
      filename: 'Q3_Financial_Analysis_2025.pdf',
      format: 'PDF',
      size: '4.2 MB',
      status: 'ready',
      chunks: 28,
      uploadedAt: 'Today at 08:30 AM',
    },
    {
      id: 'doc-sync-102',
      filename: 'Enterprise_Architecture_Spec.docx',
      format: 'DOCX',
      size: '1.8 MB',
      status: 'processing',
      chunks: 14,
      uploadedAt: 'Yesterday at 04:15 PM',
    },
    {
      id: 'doc-sync-103',
      filename: 'Platform_Security_Checklist.txt',
      format: 'TXT',
      size: '340 KB',
      status: 'queued',
      chunks: 0,
      uploadedAt: 'Oct 24, 2026',
    },
    {
      id: 'doc-sync-104',
      filename: 'Corrupted_Legacy_Scan.pdf',
      format: 'PDF',
      size: '12.1 MB',
      status: 'failed',
      chunks: 0,
      uploadedAt: 'Oct 23, 2026',
    },
  ];

  const filteredDocs = sampleDocuments.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesFormat = filterFormat === 'all' || doc.format === filterFormat;
    return matchesSearch && matchesStatus && matchesFormat;
  });

  const handleDeleteConfirm = () => {
    if (deleteDocTarget) {
      showToast(
        `Document deletion requested for "${deleteDocTarget.filename}". Backend cascading deletion connects in Phase 4.`,
        'info',
        'Phase 4 Action'
      );
      setDeleteDocTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Document Library"
        description="Manage your uploaded documents, inspect ingestion pipelines, and open document workspaces."
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Documents' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSampleRows(!showSampleRows);
                showToast(
                  showSampleRows ? 'Clean empty state active' : 'Sample inspection rows enabled',
                  'info'
                );
              }}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              {showSampleRows ? 'Show Clean State' : 'Inspect Layout Rows'}
            </Button>
            <Link to="/app/documents/demo-workspace">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-accent" />}
              >
                Open Workspace Shell
              </Button>
            </Link>
          </div>
        }
      />

      <PhaseBanner
        featureName="Document Library"
        targetPhase="Phase 4 (File Upload & Ingestion)"
        notes="Document table layout, search inputs, status filters, and deletion confirmation dialogs are functional. Live documents uploaded via POST /api/v1/documents will populate this table in Phase 4."
      />

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search documents by filename..."
          className="flex-1 max-w-md"
        />

        {/* Filter Badges & Format selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format selector */}
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="all">All Formats</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="TXT">TXT</option>
          </select>

          {/* Status Badges */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-text-secondary flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
            </span>
            {statusFilters.map((sf) => (
              <button
                key={sf.value}
                onClick={() => setFilterStatus(sf.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterStatus === sf.value
                    ? 'bg-accent text-white shadow-xs'
                    : 'bg-background hover:bg-gray-100 text-text-secondary border border-border'
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container / Content */}
      <div className="card p-0 overflow-hidden">
        {showSampleRows ? (
          <div>
            <div className="p-3 bg-accent-light/40 border-b border-accent/20 flex items-center justify-between text-xs text-text-secondary">
              <span className="flex items-center gap-1.5 font-medium text-accent">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Layout Demonstration: Showing {filteredDocs.length} sample document reference states</span>
              </span>
              <button
                onClick={() => setShowSampleRows(false)}
                className="text-xs text-accent hover:underline font-semibold"
              >
                Switch to Clean Empty State
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/70 border-b border-border text-text-secondary font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Document</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Indexed Chunks</th>
                    <th className="py-3 px-4">Uploaded</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-text-primary flex items-center gap-2.5">
                        <div className="p-2 bg-accent-light/50 text-accent rounded-lg shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/app/documents/${doc.id}`}
                            className="hover:text-accent hover:underline font-semibold block truncate max-w-xs sm:max-w-md"
                          >
                            {doc.filename}
                          </Link>
                          <span className="text-[10px] text-text-secondary font-mono">{doc.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] bg-gray-100 text-text-secondary px-2 py-0.5 rounded border border-border">
                          {doc.format}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">{doc.size}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={doc.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-text-primary">
                        {doc.chunks > 0 ? doc.chunks : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">{doc.uploadedAt}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/app/documents/${doc.id}`}
                            className="p-1.5 text-text-secondary hover:text-accent rounded-md hover:bg-gray-100"
                            title="Open Workspace"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteDocTarget(doc)}
                            className="p-1.5 text-text-secondary hover:text-error rounded-md hover:bg-error-light"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Honest Clean Empty State */
          <EmptyState
            icon={<FileUp className="w-6 h-6" />}
            title="No documents in your library"
            description="Drag and drop PDF, DOCX, or TXT documents into the upload dropzone to begin parsing, chunking, and citation-grounded questioning."
            action={
              <Link to="/app/documents/sample-demo-workspace">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<BookOpen className="w-3.5 h-3.5 text-accent" />}
                >
                  Inspect Workspace Layout
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
                Inspect Sample Table Rows
              </Button>
            }
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteDocTarget)}
        onClose={() => setDeleteDocTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDestructive={true}
        title="Confirm Document Deletion"
        message={`Are you sure you want to delete "${deleteDocTarget?.filename}"? This will permanently remove the original file, extracted chunks, and Qdrant vector index points.`}
        confirmText="Delete Document"
      />
    </div>
  );
};
