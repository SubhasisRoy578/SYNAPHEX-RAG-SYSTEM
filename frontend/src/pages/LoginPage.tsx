import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileSearch, ArrowRight, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-sm">
            <FileSearch className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl text-text-primary tracking-tight">
            SYNAPHEX
          </span>
        </Link>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-text-primary">
          Sign in to your workspace
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Turn documents into knowledge with evidence-grounded AI
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="card shadow-sm p-6 sm:p-8 space-y-5">
          {/* Phase 2 Notice */}
          <div className="p-3 bg-accent-light/50 border border-accent/20 rounded-lg text-xs text-text-secondary space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-accent">
              <ShieldAlert className="w-4 h-4" />
              <span>Phase 2 Authentication Interface</span>
            </div>
            <p>
              Form validation, responsive layout, and navigation logic are fully active. Backend session/JWT extraction and PostgreSQL user models are scheduled for <strong>Phase 3 (Backend &amp; Database)</strong>.
            </p>
          </div>

          <form onSubmit={handleDemoSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="demo.analyst@synaphex.local"
                className="input-field"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-text-primary">
                  Password
                </label>
              </div>
              <input
                type="password"
                defaultValue="••••••••••••"
                className="input-field"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full py-2.5 text-sm mt-2">
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center text-xs text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-accent hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
