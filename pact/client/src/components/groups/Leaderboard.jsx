import React from 'react';

function Avatar({ member, size = 32 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, background: member.color, fontSize: size * 0.38 }}
    >
      {member.initials}
    </div>
  );
}

export function Leaderboard({ members }) {
  const ranked = [...members].sort((a, b) => b.consistency - a.consistency);

  const rankColors = ['#f59e0b', '#94a3b8', '#a16207'];

  return (
    <div className="flex flex-col gap-3">
      {ranked.map((m, i) => {
        const rank = i + 1;
        const barWidth = `${m.consistency}%`;
        return (
          <div key={m.id} className="flex items-center gap-3">
            {/* Rank */}
            <span
              className="text-sm font-extrabold shrink-0 w-5 text-center"
              style={{ color: rank <= 3 ? rankColors[rank - 1] : '#9ca3af' }}
            >
              {rank}
            </span>

            <Avatar member={m} size={30} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {m.name}{m.isYou ? ' (You)' : ''}
                </span>
                <span className="text-xs font-bold text-violet-600 ml-2 shrink-0">{m.xp.toLocaleString()} XP</span>
              </div>
              {/* Consistency bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: barWidth, background: 'linear-gradient(90deg, #7c3aed, #6366f1)' }}
                  />
                </div>
                <span className="text-xs text-gray-400 shrink-0">{m.consistency}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
