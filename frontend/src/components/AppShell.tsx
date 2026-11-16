import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { UploadModal } from './UploadModal';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const location = useLocation();

  // Map route paths to human-friendly page titles
  const getPageTitle = (pathname: string): string => {
    if (pathname === '/app') return 'Dashboard';
    if (pathname.startsWith('/app/documents/')) return 'Document Workspace';
    if (pathname === '/app/documents') return 'Document Library';
    if (pathname.startsWith('/app/collections/')) return 'Collection Workspace';
    if (pathname === '/app/collections') return 'Collections';
    if (pathname === '/app/analysis') return 'Analysis Studio';
    if (pathname === '/app/compare') return 'Compare Documents';
    if (pathname.startsWith('/app/conversations/')) return 'Conversation Detail';
    if (pathname === '/app/conversations') return 'Conversations';
    if (pathname === '/app/settings') return 'Settings';
    return 'SYNAPHEX';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Persistent Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenUpload={() => setUploadModalOpen(true)}
      />

      {/* Main Content Area (offset on desktop for 256px sidebar) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};
