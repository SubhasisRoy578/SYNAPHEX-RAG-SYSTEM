import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-sm focus-visible:ring-accent/40 active:scale-[0.98] disabled:active:scale-100',
    secondary: 'bg-surface hover:bg-gray-50 text-text-primary border border-border shadow-xs focus-visible:ring-accent/40 active:scale-[0.98] disabled:active:scale-100',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-gray-100 focus-visible:ring-accent/40',
    danger: 'bg-error hover:bg-red-700 text-white shadow-sm focus-visible:ring-error/40 active:scale-[0.98] disabled:active:scale-100',
    outline: 'bg-transparent hover:bg-accent/5 text-accent border border-accent/40 focus-visible:ring-accent/40',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
