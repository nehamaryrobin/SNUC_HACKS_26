import React from 'react';
import { Check, Clock } from 'lucide-react';

function Avatar({ member, size = 36 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ width: size, height: size, background: member.color, fontSize: size * 0.38 }}
    >
      {member.initials}
    </div>
  );
}

function MemberRow({ member, done }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
      style={{
        background: done ? '#f0fdf4' : '#fff',
        borderColor: done ? '#bbf7d0' : '#e5e7eb',
      }}
    >
      <Avatar member={member} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-900">{member.name}</span>
          {member.isYou && (
            <span className="text-xs font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full">YOU</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {done ? (
            <span className="text-green-600 font-medium">✓ Checked in · {member.time}</span>
          ) : (
            <span className="text-orange-500 font-medium flex items-center gap-1"><Clock size={11} /> Yet to check in</span>
          )}
        </p>
      </div>
      {done && (
        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <Check size={14} color="#fff" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

export function SquadStatus({ members }) {
  const done = members.filter(m => m.checkedIn);
  const pending = members.filter(m => !m.checkedIn);

  return (
    <div className="flex flex-col gap-4">
      {/* Completed */}
      {done.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            ✓ Completed ({done.length})
          </p>
          <div className="flex flex-col gap-2">
            {done.map(m => <MemberRow key={m.id} member={m} done />)}
          </div>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            ⏳ Yet to complete ({pending.length})
          </p>
          <div className="flex flex-col gap-2">
            {pending.map(m => <MemberRow key={m.id} member={m} done={false} />)}
          </div>
        </div>
      )}
    </div>
  );
}
