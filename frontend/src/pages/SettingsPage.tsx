import React, { useState, useEffect } from 'react';
import {
  User,
  Cpu,
  FileText,
  Shield,
  CheckCircle2,
  Save,
  Server,
  Lock,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { PageHeader } from '../components/PageHeader';
import { Tabs } from '../components/Tabs';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [displayName, setDisplayName] = useState<string>('Subhasis Roy');
  const [email, setEmail] = useState<string>('analyst@synaphex.local');
  const [backendReady, setBackendReady] = useState<{
    status: string;
    phase: string;
    dependencies: Record<string, { status: string; description: string }>;
  } | null>(null);

  useEffect(() => {
    fetch('/ready')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setBackendReady(data))
      .catch(() => setBackendReady(null));
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile preferences updated (UI Demonstration).', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Standardized Page Header */}
      <PageHeader
        title="Settings & Environment"
        description="Manage your user profile, view document ingestion constraints, and inspect AI provider architecture."
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Settings' },
        ]}
      />

      <PhaseBanner
        featureName="Platform Settings & Configurations"
        targetPhase="Phase 1 Baseline &amp; Phase 3 (Auth/User Settings)"
        notes="All system configuration parameters, upload limits, and privacy policies are documented. Sensitive provider credentials remain strictly server-side in environment variables."
      />

      {/* Settings Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'profile', label: 'User Profile', icon: <User className="w-3.5 h-3.5" /> },
          { id: 'ingestion', label: 'Ingestion Limits', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'architecture', label: 'AI & Vector Architecture', icon: <Cpu className="w-3.5 h-3.5" /> },
          { id: 'privacy', label: 'Privacy & Retention', icon: <Shield className="w-3.5 h-3.5" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* Tab Panels */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">Profile Information</h2>
            </div>
            <span className="text-xs text-text-secondary">Workspace Analyst</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {activeTab === 'ingestion' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <FileText className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">Document Ingestion Parameters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-background rounded-xl border border-border space-y-1">
              <span className="text-text-secondary block">Max Upload File Size</span>
              <span className="text-lg font-bold text-text-primary block">25 MB</span>
              <span className="text-[11px] text-text-secondary">Configurable via MAX_UPLOAD_MB</span>
            </div>

            <div className="p-4 bg-background rounded-xl border border-border space-y-1">
              <span className="text-text-secondary block">Permitted Formats</span>
              <span className="text-lg font-bold text-text-primary block">PDF, DOCX, TXT</span>
              <span className="text-[11px] text-text-secondary">Verified by MIME &amp; magic bytes</span>
            </div>

            <div className="p-4 bg-background rounded-xl border border-border space-y-1">
              <span className="text-text-secondary block">OCR Support</span>
              <span className="text-lg font-bold text-text-primary block">Tesseract Engine</span>
              <span className="text-[11px] text-text-secondary">Auto-detects text-poor PDFs</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Cpu className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">AI &amp; Vector Retrieval Architecture</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-background rounded-xl border border-border">
              <div>
                <span className="font-semibold text-text-primary block">Vector Index Name</span>
                <span className="text-text-secondary">Qdrant point collection for chunk embeddings</span>
              </div>
              <code className="text-xs font-mono bg-surface px-2.5 py-1 rounded border border-border">
                synaphex_chunks_v1
              </code>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-background rounded-xl border border-border">
              <div>
                <span className="font-semibold text-text-primary block">Embedding Target Dimension</span>
                <span className="text-text-secondary">Provider-independent adapter (1536-dim standard)</span>
              </div>
              <code className="text-xs font-mono bg-surface px-2.5 py-1 rounded border border-border">
                text-embedding-3-small
              </code>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-background rounded-xl border border-border">
              <div>
                <span className="font-semibold text-text-primary block">Security Protocol</span>
                <span className="text-text-secondary">API Keys isolated to server-side .env</span>
              </div>
              <span className="text-xs font-medium text-success bg-success-light px-2.5 py-1 rounded-full border border-success/30 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Zero Client Secrets
              </span>
            </div>

            {backendReady && (
              <div className="p-3.5 bg-background rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-text-primary">Backend Readiness Status</span>
                  </div>
                  <span className="text-xs font-medium text-success bg-success-light px-2.5 py-0.5 rounded-full border border-success/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {backendReady.status.toUpperCase()} ({backendReady.phase})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-text-secondary">
                  {Object.entries(backendReady.dependencies || {}).map(([key, val]) => (
                    <div key={key} className="bg-surface p-2 rounded border border-border">
                      <span className="font-mono font-medium text-text-primary capitalize">{key}:</span> {val.status}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Shield className="w-4 h-4 text-success" />
            <h2 className="text-sm font-semibold text-text-primary">Privacy &amp; Tenant Isolation Policy</h2>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            SYNAPHEX enforces mandatory user ownership filters on every database query and vector similarity search. Deleting a document executes cascading removal across local storage files, PostgreSQL chunk records, and Qdrant vector points.
          </p>
          <div className="p-3 bg-gray-50 rounded-xl border border-border text-xs text-text-secondary">
            <span className="font-semibold text-text-primary block mb-0.5">Audit &amp; Retention Guarantee:</span>
            <span>Original files and extracted chunks are accessible only by the authenticated owner account. No documents are shared across tenant boundaries.</span>
          </div>
        </div>
      )}
    </div>
  );
};
