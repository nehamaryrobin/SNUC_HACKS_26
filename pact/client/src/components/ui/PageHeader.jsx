import React from 'react';
import { Bell } from 'lucide-react';

export function PageHeader({ title }) {
  return (
    <div className="relative w-full py-6 mb-6 border-b border-gray-200">
      {/* Notification pinned to absolute top right */}
      <button className="absolute top-0 right-0 p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all">
        <Bell size={22} />
      </button>

      {/* Title centered horizontally */}
      <h1 className="text-2xl font-bold text-gray-900 text-center">{title}</h1>
    </div>
  );
}
