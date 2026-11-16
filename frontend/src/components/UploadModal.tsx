import React, { useEffect, useState } from 'react';
import { X, UploadCloud, ShieldAlert, FileCode } from 'lucide-react';
import { Button } from './Button';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-accent-light rounded-lg text-accent">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 id="upload-modal-title" className="text-base font-semibold text-text-primary">
                Upload Document
              </h2>
              <p className="text-xs text-text-secondary">Supported formats: PDF, DOCX, TXT (up to 25 MB)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Dropzone Container */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-accent bg-accent-light/40 scale-[1.01]'
                : 'border-border hover:border-accent/50 bg-background/50'
            }`}
          >
            <UploadCloud className="w-10 h-10 text-accent/60 mx-auto mb-3" />
            <p className="text-sm font-medium text-text-primary">
              Drag and drop document files here
            </p>
            <p className="text-xs text-text-secondary mt-1">
              or browse from your local file system
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[11px] font-semibold bg-surface border border-border px-2 py-0.5 rounded text-text-secondary">
                PDF
              </span>
              <span className="text-[11px] font-semibold bg-surface border border-border px-2 py-0.5 rounded text-text-secondary">
                DOCX
              </span>
              <span className="text-[11px] font-semibold bg-surface border border-border px-2 py-0.5 rounded text-text-secondary">
                TXT
              </span>
            </div>
          </div>

          {/* Phase 1 & 4 Implementation Disclosure */}
          <div className="p-3.5 bg-accent-light/40 border border-accent/20 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-accent font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Phase 2 Foundation Notice</span>
            </div>
            <p className="text-text-secondary leading-relaxed">
              File upload validation, private storage handling, PyMuPDF parsing, and Qdrant chunk indexing are scheduled for implementation in <strong>Phase 4 (File Upload & Ingestion Pipeline)</strong>.
            </p>
            <div className="pt-1 text-[11px] text-text-secondary/80 flex items-center gap-1.5 font-mono">
              <FileCode className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>API Endpoint: <span className="text-text-primary font-semibold">POST /api/v1/documents</span></span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-border">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled
            title="Upload execution will be activated in Phase 4"
          >
            Start Ingestion (Phase 4)
          </Button>
        </div>
      </div>
    </div>
  );
};
