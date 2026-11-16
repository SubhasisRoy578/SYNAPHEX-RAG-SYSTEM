import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface PhaseBannerProps {
  featureName: string;
  targetPhase: string;
  notes?: string;
  defaultCollapsed?: boolean;
}

export const PhaseBanner: React.FC<PhaseBannerProps> = ({
  featureName,
  targetPhase,
  notes,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="bg-surface border border-accent/20 rounded-xl p-3.5 mb-5 shadow-xs transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-accent-light rounded-lg text-accent shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                Phase 2 Foundation
              </span>
              <span className="text-xs font-medium text-text-secondary">
                Backend integration scheduled for {targetPhase}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-text-primary mt-1">
              {featureName} Shell &amp; Interaction Architecture
            </h3>
            {!isCollapsed && (
              <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-3xl">
                {notes ||
                  'This route is initialized with design system tokens, responsive navigation, and honest interface states. Live database queries, document processing, and RAG retrieval will be connected in subsequent phases.'}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-text-secondary hover:text-text-primary rounded-md hover:bg-gray-100 transition-colors shrink-0"
          title={isCollapsed ? 'Expand notice details' : 'Collapse notice details'}
          aria-label={isCollapsed ? 'Expand phase notice' : 'Collapse phase notice'}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
