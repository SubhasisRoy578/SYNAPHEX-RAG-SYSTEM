import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  errorCode?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  message,
  errorCode,
  onRetry,
  onBack,
  className = '',
}) => {
  return (
    <div
      className={`card border-error/30 bg-error-light/30 p-6 sm:p-8 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center mb-3.5">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        {errorCode && (
          <code className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-error">
            {errorCode}
          </code>
        )}
      </div>
      <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {(onRetry || onBack) && (
        <div className="mt-5 flex items-center justify-center gap-3">
          {onRetry && (
            <Button
              variant="primary"
              size="sm"
              onClick={onRetry}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Retry Action
            </Button>
          )}
          {onBack && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Go Back
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
