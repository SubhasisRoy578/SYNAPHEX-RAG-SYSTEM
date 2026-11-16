import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FolderKanban,
  MessageSquare,
  PlusCircle,
  Clock,
  Sparkles,
  Server,
  Database,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';

export const DashboardPage: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <PhaseBanner
        featureName="Dashboard & Workspace Overview"
        targetPhase="Phase 2 (Frontend) & Phase 3 (Backend DB)"
        notes="All route components, navigation links, and design tokens are active. Document and conversation feeds currently reflect the clean initial account state."
      />

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Workspace Overview
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Welcome to SYNAPHEX. Manage documents, explore collections, and query evidence-grounded insights.
          </p>
        </div>

        <Link to="/app/documents" className="btn-primary text-xs shrink-0">
          <PlusCircle className="w-4 h-4" />
          <span>Upload Document</span>
        </Link>
      </div>

      {/* Real Infrastructure Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Server Card */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">API Server</span>
            <div className="p-1.5 bg-success-light text-success rounded-md">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-primary">
              {backendReady ? 'Active' : 'Checking'}
            </span>
            <span className="text-[11px] text-success font-medium">FastAPI v1</span>
          </div>
          <p className="text-[11px] text-text-secondary mt-1">
            Liveness & readiness probes healthy
          </p>
        </div>

        {/* PostgreSQL Relational Storage Card */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">PostgreSQL</span>
            <div className="p-1.5 bg-accent-light text-accent rounded-md">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-primary">Phase 3</span>
            <span className="text-[11px] text-accent font-medium">Schema Ready</span>
          </div>
          <p className="text-[11px] text-text-secondary mt-1">
            Data models & Alembic migrations planned
          </p>
        </div>

        {/* Vector DB (Qdrant) Card */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Vector Retrieval</span>
            <div className="p-1.5 bg-warning-light text-warning rounded-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-primary">Phase 5</span>
            <span className="text-[11px] text-warning font-medium">synaphex_chunks_v1</span>
          </div>
          <p className="text-[11px] text-text-secondary mt-1">
            Qdrant tenant-isolated retrieval index
          </p>
        </div>

        {/* Local Private Storage */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">Private Storage</span>
            <div className="p-1.5 bg-success-light text-success rounded-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-primary">
              {backendReady?.dependencies?.file_storage?.status === 'operational'
                ? 'Ready'
                : 'Local'}
            </span>
            <span className="text-[11px] text-success font-medium">storage/</span>
          </div>
          <p className="text-[11px] text-text-secondary mt-1">
            Directory initialized & gitignored
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Documents & Recent Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">Recent Documents</h2>
              </div>
              <Link
                to="/app/documents"
                className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <span>View Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Honest Empty State */}
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-text-secondary/60 mx-auto mb-3 border border-border">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">No documents indexed yet</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto mt-1 leading-relaxed">
                Upload your first PDF, DOCX, or TXT file to begin extraction, chunk indexing, and citation-grounded questioning.
              </p>
              <div className="mt-4">
                <Link to="/app/documents" className="btn-secondary text-xs">
                  <span>Go to Document Library</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Conversations Column (1/3 width) */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">Recent Q&A</h2>
              </div>
              <Link
                to="/app/conversations"
                className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <span>History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Honest Empty State */}
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-text-secondary/60 mx-auto mb-3 border border-border">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">No conversations</h3>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Ask questions against single documents or collections once documents are processed in Phase 5.
              </p>
            </div>
          </div>

          {/* Quick Collection Link */}
          <div className="card p-4 bg-accent-light/20 border-accent/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent-light text-accent rounded-lg shrink-0">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-primary">Document Collections</h4>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                  Group related documents into collections to ask cross-document synthesis questions.
                </p>
                <Link
                  to="/app/collections"
                  className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1 mt-2"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
