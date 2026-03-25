import React from 'react';
import { Home, Users, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';

export function Sidebar({ expanded, setExpanded, activePage, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <aside
      style={{ width: expanded ? '240px' : '60px', transition: 'width 300ms ease-in-out' }}
      className="fixed top-0 left-0 h-screen z-50 bg-[#f9f8f7] border-r border-gray-200 flex flex-col overflow-hidden select-none"
    >
      {/* ── Top section: Logo + toggle ──────────────────── */}
      <div className="flex items-center justify-between px-3 pt-5 pb-4">
        {expanded ? (
          <>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent pl-1">
              InPact
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="p-1.5 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="mx-auto p-1.5 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* ── Nav items ────────────────────────────────────── */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1">
        {navItems.map((item) => {
          // Normalize activePage matches (e.g. 'findGroups' -> light up 'groups')
          const isActive = activePage === item.id || 
            (item.id === 'groups' && ['groupDetail', 'findGroups', 'createGroup'].includes(activePage));
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                isActive
                  ? 'font-semibold text-violet-700 bg-violet-100'
                  : 'font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
              style={{ justifyContent: expanded ? 'flex-start' : 'center' }}
            >
              <item.icon size={18} className="shrink-0" />
              {expanded && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom: Profile ──────────────────────────────── */}
      <div className="px-2 pb-5">
        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors text-left"
          style={{ justifyContent: expanded ? 'flex-start' : 'center' }}
        >
          {/* Avatar circle (placeholder initials) */}
          <span
            className="shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
            style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}
          >
            N
          </span>
          {expanded && (
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800 leading-none">Neha Robin</p>
              <p className="text-xs text-gray-400 mt-0.5">Free plan</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
