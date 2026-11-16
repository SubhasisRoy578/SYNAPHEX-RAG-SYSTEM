import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileSearch,
  BookOpen,
  Sparkles,
  GitCompare,
  ShieldCheck,
  ArrowRight,
  UploadCloud,
  FileCheck2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shadow-sm">
              <FileSearch className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-text-primary tracking-tight">
              SYNAPHEX
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-xs sm:text-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-xs sm:text-sm">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-light border border-accent/20 rounded-full text-xs font-semibold text-accent mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Document Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
          Turn Documents Into Knowledge.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Upload PDF, DOCX, and TXT files. Query your documents with natural language and receive verifiable answers strictly grounded in retrieved evidence with exact page citations.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/app" className="btn-primary px-6 py-3 text-sm w-full sm:w-auto">
            <span>Open Application Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-6 py-3 text-sm w-full sm:w-auto"
          >
            <span>Read API Documentation</span>
          </a>
        </div>
      </section>

      {/* Interactive Mock Preview / Evidence Grounding Demo */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20 w-full">
        <div className="card p-4 sm:p-6 shadow-md border-border bg-surface">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-text-primary">
                Evidence-Grounded RAG Architecture
              </span>
            </div>
            <span className="text-xs bg-success-light text-success font-medium px-2 py-0.5 rounded border border-success/30">
              Zero Hallucinations Policy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Document Side */}
            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                <span className="font-semibold text-text-primary">Source Document (Page 14)</span>
                <span>Annual_Report_2025.pdf</span>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-border text-xs text-text-secondary leading-relaxed font-mono">
                "...Operating cash flows increased by 18.4% year-over-year to $42.6M, driven by improvements in working capital efficiency and recurring software subscriptions..."
              </div>
              <p className="text-[11px] text-text-secondary mt-2">
                Document chunk indexed in Qdrant with tenant-isolated metadata.
              </p>
            </div>

            {/* Grounded Answer Side */}
            <div className="bg-accent-light/30 rounded-xl p-4 border border-accent/20">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                <span className="font-semibold text-text-primary">SYNAPHEX Verified Answer</span>
                <span className="text-accent font-medium">Grounded in 1 Source</span>
              </div>
              <p className="text-xs text-text-primary leading-relaxed font-medium">
                Operating cash flows grew by 18.4% to $42.6M in 2025, primarily supported by working capital efficiency and recurring subscription revenue.
              </p>
              <div className="mt-3 p-2 bg-surface rounded-lg border border-border text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-accent font-semibold">
                  <span>[1]</span>
                  <span>Annual_Report_2025.pdf (Page 14)</span>
                </div>
                <span className="text-[10px] text-text-secondary">Verified Citation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="py-12 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Built for Deep Document Intelligence
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              SYNAPHEX goes beyond simple chatbots with systematic ingestion, verified citations, and reliable cross-document comparisons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card hover:border-accent/40 transition-colors">
              <div className="p-2.5 bg-accent-light rounded-xl text-accent w-fit mb-4">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Multi-Format Ingestion</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Accepts PDF, DOCX, and TXT documents. Extracts paragraphs, headings, tables, and handles scanned pages via an OCR pipeline.
              </p>
            </div>

            <div className="card hover:border-accent/40 transition-colors">
              <div className="p-2.5 bg-accent-light rounded-xl text-accent w-fit mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Verifiable Citations</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Every generated response includes direct citations linked to exact source pages, section titles, and highlighted text excerpts.
              </p>
            </div>

            <div className="card hover:border-accent/40 transition-colors">
              <div className="p-2.5 bg-accent-light rounded-xl text-accent w-fit mb-4">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Cross-Document Analysis</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Compare multiple documents to identify similarities, contrasting requirements, and conflicting claims across versions.
              </p>
            </div>

            <div className="card hover:border-accent/40 transition-colors">
              <div className="p-2.5 bg-accent-light rounded-xl text-accent w-fit mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Tenant Data Isolation</h3>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Relational tables and vector retrieval enforce strict user-level ownership predicates on every query.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 lg:px-8 border-t border-border bg-background text-xs text-text-secondary text-center">
        <p>SYNAPHEX — AI-Powered Document Intelligence Platform &bull; Phase 1 Repository Foundation</p>
      </footer>
    </div>
  );
};
