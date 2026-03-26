import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Moon, Sun } from 'lucide-react';

export function AppLayout({ children, activePage, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const sidebarWidth = expanded ? 240 : 60;

  useEffect(() => {
    // Check local storage or system pref on load
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark');
      setIsDark(true);
    } else {
      document.body.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.body.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.body.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-gray-900 flex font-sans">
      <Sidebar expanded={expanded} setExpanded={setExpanded} activePage={activePage} onNavigate={onNavigate} />

      {/* Floating Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-6 z-50 p-3 bg-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full shadow-lg border border-gray-100 transition-all duration-200"
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>

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
