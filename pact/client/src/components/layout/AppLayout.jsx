import React from 'react';
import { Sidebar } from './Sidebar';
import { useState } from 'react';

export function AppLayout({ children, activePage, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const sidebarWidth = expanded ? 240 : 60;

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-gray-900 flex font-sans">
      <Sidebar expanded={expanded} setExpanded={setExpanded} activePage={activePage} onNavigate={onNavigate} />

      {/* Content area shifts smoothly with the sidebar */}
      <main
        style={{ marginLeft: sidebarWidth, transition: 'margin-left 300ms ease-in-out' }}
        className="flex-1 min-w-0"
      >
        {children}
      </main>
    </div>
  );
}
