import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Sparkles,
  GitCompare,
  MessageSquare,
  Settings,
  PlusCircle,
  FileSearch,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenUpload }) => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/documents', label: 'Documents', icon: FileText, end: false },
    { to: '/app/collections', label: 'Collections', icon: FolderKanban, end: false },
    { to: '/app/analysis', label: 'Analysis Studio', icon: Sparkles, end: false },
    { to: '/app/compare', label: 'Compare Documents', icon: GitCompare, end: false },
    { to: '/app/conversations', label: 'Conversations', icon: MessageSquare, end: false },
    { to: '/app/settings', label: 'Settings', icon: Settings, end: false },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-sidebar text-sidebar-text flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-sidebar-border">
          <NavLink to="/app" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white block leading-tight">
                  SYNAPHEX
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-accent bg-accent/20 px-1 py-0.2 rounded">
                  P2
                </span>
              </div>
              <span className="text-[10px] text-sidebar-muted block tracking-wide">
                Document Intelligence
              </span>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-sidebar-muted hover:text-white rounded-lg hover:bg-sidebar-hover transition-colors"
            aria-label="Close sidebar navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Upload Action */}
        <div className="p-4">
          <button
            onClick={() => {
              onClose();
              onOpenUpload();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation" className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all relative ${
                    isActive
                      ? 'bg-sidebar-active text-white font-semibold shadow-xs'
                      : 'text-sidebar-muted hover:text-white hover:bg-sidebar-hover'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-accent' : ''}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar-hover/30">
          <div className="flex items-center justify-between">
            <NavLink
              to="/app/settings"
              onClick={() => onClose()}
              className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-xs font-semibold text-accent shrink-0">
                SR
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">Subhasis Roy</p>
                <p className="text-[11px] text-sidebar-muted truncate">analyst@synaphex.local</p>
              </div>
            </NavLink>
            <button
              onClick={() => navigate('/login')}
              title="Sign Out"
              className="p-1.5 text-sidebar-muted hover:text-white rounded-lg hover:bg-sidebar-hover transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
