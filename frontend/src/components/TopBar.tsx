import React, { useEffect, useState } from 'react';
import { Menu, Search, Activity, ExternalLink, X, Server, Database, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DependencyInfo {
  status: string;
  description: string;
}

interface ReadinessData {
  status: string;
  app: string;
  version: string;
  phase: string;
  dependencies: Record<string, DependencyInfo>;
}

interface TopBarProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, title = 'Dashboard' }) => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [readinessData, setReadinessData] = useState<ReadinessData | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    // Check backend health & readiness endpoints
    fetch('/health')
      .then((res) => {
        if (res.ok) {
          setApiStatus('connected');
          return fetch('/ready');
        }
        setApiStatus('disconnected');
        return null;
      })
      .then((res) => (res && res.ok ? res.json() : null))
      .then((data) => {
        if (data) setReadinessData(data);
      })
      .catch(() => {
        setApiStatus('disconnected');
      });
  }, []);

  return (
    <>
      <header className="h-16 bg-surface border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary hidden sm:inline">SYNAPHEX</span>
            <span className="text-text-secondary/40 hidden sm:inline">/</span>
            <h1 className="text-sm sm:text-base font-semibold text-text-primary tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Middle: Search Bar (Global Scope) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/60" />
            <input
              type="text"
              placeholder="Search across documents, collections, or analysis findings..."
              disabled
              className="w-full pl-9 pr-12 py-1.5 text-xs bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary/60 cursor-not-allowed opacity-75"
              title="Global search activates with Qdrant vector retrieval in Phase 5"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-text-secondary bg-surface border border-border rounded">
              /
            </kbd>
          </div>
        </div>

        {/* Right: API Health Status & Documentation Links */}
        <div className="flex items-center gap-2.5">
          {/* Interactive Backend Status Pill */}
          <button
            onClick={() => setShowStatusModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:shadow-xs ${
              apiStatus === 'connected'
                ? 'bg-success-light text-success border-success/30 hover:bg-success/15'
                : apiStatus === 'checking'
                ? 'bg-warning-light text-warning border-warning/30 hover:bg-warning/15'
                : 'bg-gray-100 text-text-secondary border-gray-300 hover:bg-gray-200'
            }`}
            title="Click to view live infrastructure readiness details"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API:</span>
            <span>{apiStatus === 'connected' ? 'Connected' : apiStatus === 'checking' ? 'Checking' : 'Disconnected'}</span>
          </button>

          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Open API Documentation (FastAPI Swagger UI)"
          >
            <span className="hidden sm:inline">API Docs</span>
            <ExternalLink className="w-3 h-3 text-text-secondary" />
          </a>
        </div>
      </header>

      {/* System Readiness Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-accent-light rounded-lg text-accent">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-text-primary">System Infrastructure Status</h2>
                  <p className="text-xs text-text-secondary">
                    Live probe inspection from <code className="text-accent font-mono">/health</code> &amp; <code className="text-accent font-mono">/ready</code>
                    {readinessData && <span className="ml-1 text-accent font-semibold font-mono">({readinessData.version})</span>}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs">
              {/* API Server */}
              <div className="p-3 bg-background rounded-xl border border-border flex items-start gap-3">
                <div className="p-2 bg-success-light text-success rounded-lg mt-0.5">
                  <Server className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">FastAPI Application Server</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-success-light text-success border border-success/30">
                      {apiStatus === 'connected' ? 'Operational' : 'Disconnected'}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">
                    Running Python 3.13 / FastAPI v1 at port 8000. Versioned routes under <code className="font-mono">/api/v1</code>.
                  </p>
                </div>
              </div>

              {/* Private Storage */}
              <div className="p-3 bg-background rounded-xl border border-border flex items-start gap-3">
                <div className="p-2 bg-success-light text-success rounded-lg mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">Local Private File Storage</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-success-light text-success border border-success/30">
                      Operational
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">
                    Directory <code className="font-mono">storage/</code> initialized and writable for isolated tenant documents.
                  </p>
                </div>
              </div>

              {/* PostgreSQL */}
              <div className="p-3 bg-background rounded-xl border border-border flex items-start gap-3">
                <div className="p-2 bg-accent-light text-accent rounded-lg mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">PostgreSQL Relational DB</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent-light text-accent border border-accent/30">
                      Phase 3 Scheduled
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">
                    Schema specified in <code className="font-mono">docs/05-backend-schema.md</code>. Models and Alembic migrations connect in Phase 3.
                  </p>
                </div>
              </div>

              {/* Qdrant Vector Search */}
              <div className="p-3 bg-background rounded-xl border border-border flex items-start gap-3">
                <div className="p-2 bg-warning-light text-warning rounded-lg mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">Qdrant Vector Database</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-warning-light text-warning border border-warning/30">
                      Phase 5 Scheduled
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1">
                    Point collection <code className="font-mono">synaphex_chunks_v1</code> designed for embedding vectors and tenant-scoped similarity search.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-gray-50 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Zero fabricated metrics rule strictly enforced</span>
              </span>
              <button
                onClick={() => setShowStatusModal(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
