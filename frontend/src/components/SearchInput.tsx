import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  shortcutHint?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  shortcutHint,
  disabled = false,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 absolute left-3 text-text-secondary/60 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-14 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      />
      <div className="absolute right-2.5 flex items-center gap-1.5">
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-text-secondary/60 hover:text-text-primary rounded-md hover:bg-gray-100 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {shortcutHint && !value && (
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-text-secondary bg-gray-100 border border-border rounded">
            {shortcutHint}
          </kbd>
        )}
      </div>
    </div>
  );
};
