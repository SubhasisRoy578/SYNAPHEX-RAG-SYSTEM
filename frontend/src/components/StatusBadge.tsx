import React from 'react';
import { DocumentStatus } from '../types';
import { Clock, Loader2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

interface StatusBadgeProps {
  status: DocumentStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<DocumentStatus, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
    queued: {
      label: 'Queued',
      icon: <Clock className="w-3.5 h-3.5 text-warning" />,
      bg: 'bg-warning-light',
      text: 'text-warning',
      border: 'border-warning/30',
    },
    processing: {
      label: 'Processing',
      icon: <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />,
      bg: 'bg-accent-light',
      text: 'text-accent',
      border: 'border-accent/30',
    },
    ready: {
      label: 'Ready',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-success" />,
      bg: 'bg-success-light',
      text: 'text-success',
      border: 'border-success/30',
    },
    failed: {
      label: 'Failed',
      icon: <AlertCircle className="w-3.5 h-3.5 text-error" />,
      bg: 'bg-error-light',
      text: 'text-error',
      border: 'border-error/30',
    },
    deleting: {
      label: 'Deleting',
      icon: <Trash2 className="w-3.5 h-3.5 text-text-secondary" />,
      bg: 'bg-gray-100',
      text: 'text-text-secondary',
      border: 'border-gray-300',
    },
  };

  const config = configs[status] || configs.queued;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${padding}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
