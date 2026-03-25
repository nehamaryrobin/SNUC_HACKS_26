import React from 'react';
import { Plus } from 'lucide-react';

export function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-violet-600 hover:bg-violet-700 text-white w-14 h-14 rounded-2xl shadow-lg shadow-violet-300 hover:shadow-violet-400 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 z-50 flex items-center justify-center group"
      aria-label="Add or search group"
    >
      <Plus size={26} className="group-hover:rotate-90 transition-transform duration-200" />
    </button>
  );
}
