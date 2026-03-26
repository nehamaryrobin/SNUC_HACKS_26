import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { GroupCard } from '../components/groups/GroupCard';
import { mockGroups } from '../data/mockGroups';

export function GroupsPage({ onOpenGroup, onFindGroups }) {
  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center">
      <div className="w-full max-w-2xl px-6 py-8 pb-28">
        <PageHeader title="My Groups" />

        {/* Stats row */}
        <div className="flex gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex-1 text-center">
            <p className="text-2xl font-bold text-violet-600">{mockGroups.length}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Groups Joined</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex-1 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {mockGroups.reduce((acc, g) => acc + g.memberCount, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Total Members</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex-1 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {[...new Set(mockGroups.map(g => g.type))].length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Platforms</p>
          </div>
        </div>

        {/* Section label */}
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Your Groups</p>

        {/* Stacked single-column cards, centred by the max-w wrapper above */}
        <div className="flex flex-col gap-4">
          {mockGroups.map((group) => (
            <GroupCard key={group.id} group={group} onClick={() => onOpenGroup(group.id)} />
          ))}
        </div>
      </div>

      <FloatingActionButton onClick={onFindGroups} />
    </div>
  );
}
