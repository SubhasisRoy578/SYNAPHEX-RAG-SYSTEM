import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`text-center flex flex-col items-center justify-center ${
        compact ? 'py-8 px-4' : 'py-16 px-6'
      } ${className}`}
    >
      <div
        className={`bg-background rounded-2xl flex items-center justify-center text-accent border border-border shadow-xs mx-auto mb-3.5 ${
          compact ? 'w-10 h-10' : 'w-14 h-14'
        }`}
      >
        {icon}
      </div>
      <h3 className={`font-semibold text-text-primary ${compact ? 'text-xs sm:text-sm' : 'text-base'}`}>
        {title}
      </h3>
      <p
        className={`text-text-secondary max-w-md mx-auto mt-1 leading-relaxed ${
          compact ? 'text-xs' : 'text-xs sm:text-sm'
        }`}
      >
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};
