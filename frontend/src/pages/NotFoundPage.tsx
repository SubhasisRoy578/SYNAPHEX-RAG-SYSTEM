import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-accent mx-auto mb-4 border border-border shadow-xs">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
        404 — Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto mt-2 leading-relaxed">
        The route or resource you requested could not be located in the SYNAPHEX workspace.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link to="/app" className="btn-primary text-xs">
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
        <Link to="/" className="btn-secondary text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Landing Page</span>
        </Link>
      </div>
    </div>
  );
};
