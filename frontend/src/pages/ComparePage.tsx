import React, { useState } from 'react';
import { GitCompare, Layers } from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

export const ComparePage: React.FC = () => {
  const { showToast } = useToast();
  const [docA, setDocA] = useState('doc-1');
  const [docB, setDocB] = useState('doc-2');
  const [comparisonFocus, setComparisonFocus] = useState<string>('differences');
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const handleRunComparison = () => {
    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      showToast('Document comparison matrix generated (UI Demonstration).', 'success');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Compare Documents"
        description="Evaluate two or more documents side-by-side to detect changed requirements, numerical deltas, and policy conflicts."
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Compare Documents' },
        ]}
      />

      <PhaseBanner
        featureName="Document Comparison Engine"
        targetPhase="Phase 7 (Cross-Document Comparison)"
        notes="The comparison engine retrieves passages independently from two or more documents and structures findings into similarities, differences, and conflicts with traceable citations."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary pb-2 border-b border-border">
              Select Comparison Target Files
            </h2>

            {/* Document A */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                Base Document (Document A)
              </label>
              <select
                value={docA}
                onChange={(e) => setDocA(e.target.value)}
                className="input-field"
              >
                <option value="doc-1">Q3_Financial_Analysis_2025.pdf (Ready)</option>
                <option value="doc-2">Enterprise_Architecture_Spec.docx (Ready)</option>
              </select>
            </div>

            {/* Document B */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                Comparison Document (Document B)
              </label>
              <select
                value={docB}
                onChange={(e) => setDocB(e.target.value)}
                className="input-field"
              >
                <option value="doc-2">Enterprise_Architecture_Spec.docx (Ready)</option>
                <option value="doc-1">Q3_Financial_Analysis_2025.pdf (Ready)</option>
              </select>
            </div>

            {/* Comparison Focus */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">
                Comparison Focus Focus
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'differences',
                    label: 'Requirements Deltas & Differences',
                    desc: 'Identify clauses, architecture specs, or terms modified across versions.',
                  },
                  {
                    id: 'similarities',
                    label: 'Shared Assumptions & Overlap',
                    desc: 'Extract mutual commitments and compatible design constraints.',
                  },
                  {
                    id: 'conflicts',
                    label: 'Contradictions & Numerical Discrepancies',
                    desc: 'Detect direct policy disagreements, conflicting figures, or missed deadlines.',
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                      comparisonFocus === item.id
                        ? 'border-accent bg-accent-light/30 shadow-xs'
                        : 'border-border bg-surface hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="comparisonFocus"
                        value={item.id}
                        checked={comparisonFocus === item.id}
                        onChange={() => setComparisonFocus(item.id)}
                        className="text-accent focus:ring-accent"
                      />
                      <span className="text-xs font-semibold text-text-primary">{item.label}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 pl-5">{item.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isComparing}
              onClick={handleRunComparison}
              leftIcon={<GitCompare className="w-4 h-4" />}
            >
              Run Side-by-Side Comparison
            </Button>
          </div>
        </div>

        {/* Right: Comparison Matrix / Findings (7 cols) */}
        <div className="lg:col-span-7 card p-0 flex flex-col min-h-[500px] overflow-hidden">
          <div className="p-4 bg-gray-50/70 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-semibold text-text-primary">Comparative Synthesis Matrix</h3>
            </div>
            <span className="text-[10px] text-text-secondary bg-surface px-2 py-0.5 rounded border border-border">
              Focus: {comparisonFocus.toUpperCase()}
            </span>
          </div>

          <div className="p-6 flex-1 bg-surface space-y-4 overflow-y-auto">
            {/* Finding Card 1 */}
            <div className="p-4 bg-background rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">
                  1. Vector Database Technology Selection
                </span>
                <span className="text-[10px] font-semibold text-accent bg-accent-light px-2 py-0.5 rounded">
                  Delta Identified
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Document A (Financial Analysis) projects cost savings utilizing an open-source vector store, whereas Document B (Architecture Spec) formally mandates <strong>Qdrant Enterprise Cloud</strong> with tenant-isolated point collections.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-2.5 bg-surface rounded-lg border border-border">
                  <span className="text-[10px] font-bold text-accent block">Document A Excerpt (Page 18)</span>
                  <p className="text-[11px] text-text-secondary italic mt-1">
                    "...evaluating self-hosted vector indexing to reduce infrastructure overhead..."
                  </p>
                </div>
                <div className="p-2.5 bg-surface rounded-lg border border-border">
                  <span className="text-[10px] font-bold text-accent block">Document B Excerpt (Sec 3.2)</span>
                  <p className="text-[11px] text-text-secondary italic mt-1">
                    "...system architecture requires managed Qdrant with tenant collection filters..."
                  </p>
                </div>
              </div>
            </div>

            {/* Finding Card 2 */}
            <div className="p-4 bg-background rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">
                  2. Document Chunking &amp; Token Budget
                </span>
                <span className="text-[10px] font-semibold text-success bg-success-light px-2 py-0.5 rounded">
                  Aligned Requirement
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Both documents specify 500–800 token chunk sizes with 80–120 token overlap and mandatory heading preservation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
