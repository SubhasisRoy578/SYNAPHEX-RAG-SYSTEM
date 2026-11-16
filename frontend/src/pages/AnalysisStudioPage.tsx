import React, { useState } from 'react';
import {
  Play,
  Download,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { PhaseBanner } from '../components/PhaseBanner';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Tabs } from '../components/Tabs';
import { useToast } from '../components/Toast';

export const AnalysisStudioPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<string>('sample-doc-1');
  const [analysisType, setAnalysisType] = useState<string>('summary');
  const [summaryMode, setSummaryMode] = useState<'concise' | 'detailed'>('concise');
  const [activeResultTab, setActiveResultTab] = useState<string>('findings');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleRunAnalysis = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('Analysis generated with evidence citations (UI Demonstration).', 'success');
    }, 800);
  };

  const handleExport = (format: string) => {
    showToast(`Analysis report export in ${format} format scheduled for Phase 7.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Analysis Studio"
        description="Generate structured summaries, extract key findings, and query tabular data with evidence grounding."
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Analysis Studio' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleExport('Markdown')}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Report
            </Button>
          </div>
        }
      />

      <PhaseBanner
        featureName="Analysis Studio"
        targetPhase="Phase 7 (Summaries &amp; Structured Extraction)"
        notes="Analysis Studio provides structured document summarization, key-point extraction, and configurable field extraction. The generation endpoint (POST /api/v1/documents/{id}/summaries) will be wired in Phase 7."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary pb-2 border-b border-border">
              Analysis Configuration
            </h2>

            {/* Select Document */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                Select Source Document
              </label>
              <select
                value={selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
                className="input-field"
              >
                <option value="sample-doc-1">Q3_Financial_Analysis_2025.pdf (Ready)</option>
                <option value="sample-doc-2">Enterprise_Architecture_Spec.docx (Ready)</option>
                <option value="sample-doc-3">Platform_Security_Checklist.txt (Queued)</option>
              </select>
              <p className="text-[11px] text-text-secondary mt-1">
                Only documents in "Ready" status can be analyzed.
              </p>
            </div>

            {/* Analysis Type */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">
                Analysis Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'summary', label: 'Summary' },
                  { id: 'key_points', label: 'Key Points' },
                  { id: 'structured', label: 'Structured' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAnalysisType(type.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      analysisType === type.id
                        ? 'bg-accent text-white border-accent shadow-xs font-semibold'
                        : 'bg-background hover:bg-gray-100 text-text-secondary border-border'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Detail Mode */}
            {analysisType === 'summary' && (
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1.5">
                  Summary Detail Level
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="radio"
                      name="summaryMode"
                      checked={summaryMode === 'concise'}
                      onChange={() => setSummaryMode('concise')}
                      className="text-accent focus:ring-accent"
                    />
                    <span>Concise Executive Overview</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="radio"
                      name="summaryMode"
                      checked={summaryMode === 'detailed'}
                      onChange={() => setSummaryMode('detailed')}
                      className="text-accent focus:ring-accent"
                    />
                    <span>Section Breakdown</span>
                  </label>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isGenerating}
              onClick={handleRunAnalysis}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Run Analysis
            </Button>
          </div>
        </div>

        {/* Right: Results Panel (7 cols) */}
        <div className="lg:col-span-7 card p-0 flex flex-col min-h-[500px] overflow-hidden">
          {/* Results Toolbar */}
          <div className="p-4 bg-gray-50/70 border-b border-border flex items-center justify-between">
            <Tabs
              tabs={[
                { id: 'findings', label: 'Analysis Findings' },
                { id: 'table', label: 'Extracted Fields' },
                { id: 'citations', label: 'Supporting Citations' },
              ]}
              activeTab={activeResultTab}
              onChange={setActiveResultTab}
              variant="pills"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText('Q3 Operating cash flow reached $42.6M...');
                showToast('Findings copied to clipboard', 'success');
              }}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy
            </Button>
          </div>

          {/* Results Canvas */}
          <div className="p-6 flex-1 bg-surface space-y-4 overflow-y-auto">
            {activeResultTab === 'findings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="text-sm font-bold text-text-primary">
                    Executive Summary: Q3 Financial Performance
                  </h3>
                  <span className="text-[10px] text-success font-semibold bg-success-light px-2 py-0.5 rounded border border-success/30">
                    Grounded in 3 Chunks
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  In Q3 2025, operating cash flows expanded by 18.4% year-over-year to $42.6M, driven by working capital optimizations and consistent recurring subscription revenue. Software gross margins widened by 140 basis points to 78.2%.
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-text-primary mb-2">Key Takeaways</h4>
                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span>$42.6M operating cash flow with negative working capital cycle.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span>$12M allocated to cloud vector search infrastructure modernization.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span>Zero debt obligations due within the next 24 operating months.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeResultTab === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-border text-text-secondary font-semibold text-[11px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Extracted Value</th>
                      <th className="py-2.5 px-3">Confidence</th>
                      <th className="py-2.5 px-3 text-right">Source Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-text-primary">Operating Cash Flow</td>
                      <td className="py-2.5 px-3 text-text-primary font-mono">$42.6M</td>
                      <td className="py-2.5 px-3 text-success font-semibold">99.4%</td>
                      <td className="py-2.5 px-3 text-right text-accent font-medium">Page 14, Table 3</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-text-primary">Gross Margin</td>
                      <td className="py-2.5 px-3 text-text-primary font-mono">78.2%</td>
                      <td className="py-2.5 px-3 text-success font-semibold">98.9%</td>
                      <td className="py-2.5 px-3 text-right text-accent font-medium">Page 16, Sec 2</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-text-primary">CapEx Allocation</td>
                      <td className="py-2.5 px-3 text-text-primary font-mono">$12.0M</td>
                      <td className="py-2.5 px-3 text-success font-semibold">99.1%</td>
                      <td className="py-2.5 px-3 text-right text-accent font-medium">Page 19, Note 4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeResultTab === 'citations' && (
              <div className="space-y-3">
                <div className="p-3 bg-surface rounded-xl border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between text-accent font-semibold text-[11px]">
                    <span>[Citation 1] Page 14, Table 3</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-text-secondary italic">
                    "...operating cash flows increased by 18.4% year-over-year to $42.6M..."
                  </p>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between text-accent font-semibold text-[11px]">
                    <span>[Citation 2] Page 19, Note 4</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-text-secondary italic">
                    "...$12M committed capital expenditure targeting vector infrastructure..."
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
