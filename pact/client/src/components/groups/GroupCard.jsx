import React from 'react';
import { Users, Code, Terminal, Globe, Layout, IndianRupee } from 'lucide-react';

const TYPE_META = {
  github:     { Icon: Terminal, color: '#111827', label: 'GitHub'     },
  codeforces: { Icon: Code,     color: '#2563eb', label: 'CodeForces' },
  duolingo:   { Icon: Globe,    color: '#10b981', label: 'Duolingo'   },
  custom:     { Icon: Layout,   color: '#7c3aed', label: 'Custom'     },
};

export function GroupCard({ group, onClick }) {
  const meta = TYPE_META[group.type.toLowerCase()] || TYPE_META.custom;
  const { Icon, color, label } = meta;
  const isMoney = group.pactType === 'money';

  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group">
      {/* Coloured top accent bar */}
      <div style={{ backgroundColor: color, height: '6px' }} />

      <div className="px-8 py-6 flex flex-col gap-5">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            style={{ backgroundColor: color, color: '#fff' }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
          >
            <Icon size={13} />
            {label}
          </span>

          {isMoney ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border"
              style={{ background: '#fefce8', color: '#ca8a04', borderColor: '#fde68a' }}
            >
              <IndianRupee size={11} />
              {group.depositAmount} Commitment
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border"
              style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}
            >
              Free
            </span>
          )}
        </div>

        {/* Group Name */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors leading-snug">
          {group.name}
        </h3>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Users size={15} />
            <span className="text-sm font-medium">{group.memberCount.toLocaleString()} members</span>
          </div>
          {isMoney && (
            <span className="text-xs text-gray-400 font-medium">₹{group.penaltyPerMiss}/miss</span>
          )}
        </div>
      </div>
    </div>
  );
}
