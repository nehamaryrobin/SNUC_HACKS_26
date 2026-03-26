import React from 'react';
import { ArrowLeft, Flame, Zap, Activity } from 'lucide-react';
import { mockGroupDetail as g } from '../data/mockGroupDetail';
import { ActivityHeatmap } from '../components/groups/ActivityHeatmap';
import { StreakCalendar } from '../components/groups/StreakCalendar';
import { SquadStatus } from '../components/groups/SquadStatus';
import { Leaderboard } from '../components/groups/Leaderboard';
import { AccountabilityPanel } from '../components/groups/AccountabilityPanel';
import { ProofActionCenter } from '../components/groups/ProofActionCenter';
import { GroupActivityFeed } from '../components/groups/GroupActivityFeed';

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex-1 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <p className="text-3xl font-extrabold leading-none" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export function GroupDetailPage({ groupId, onBack }) {
  return (
    <div className="min-h-screen bg-[#f5f7fa] px-10 py-6 pb-20 max-w-screen-xl mx-auto">
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900">{g.name}</h1>
        <span
          className="ml-2 text-xs font-bold px-2.5 py-1 rounded-full text-white"
          style={{ background: '#111827' }}
        >
          {g.type}
        </span>
      </div>

      {/* ── Two-column layout ──────────────────────── */}
      <div className="flex gap-6 items-start">

        {/* ════ LEFT COLUMN ════════════════════════ */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          
          {/* ACTION CENTER - Submit / Verify */}
          <ProofActionCenter groupId={groupId} />

          {/* Activity heatmap */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-700">Activity</p>
              <p className="text-xs text-gray-400">Past 16 weeks</p>
            </div>
            <ActivityHeatmap weeks={g.heatmap} />
          </div>

          {/* Stats row: Streak · Consistency · Level */}
          <div className="flex gap-4">
            <StatCard
              icon={<Flame size={14} />}
              label="Day Streak"
              value={g.groupStreak}
              sub="Group best: 21 days"
              accent="#f97316"
            />
            <StatCard
              icon={<Activity size={14} />}
              label="Consistency"
              value={`${g.consistency}%`}
              sub="This month · 1 miss"
              accent="#7c3aed"
            />
            <StatCard
              icon={<Zap size={14} />}
              label="Level"
              value={`Lv. ${g.level}`}
              sub={`${g.xp.toLocaleString()} / ${g.xpNext.toLocaleString()} XP`}
              accent="#2563eb"
            />
          </div>

          {/* Squad status */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Squad — Today's Status
            </p>
            <SquadStatus members={g.members} />
          </div>
        </div>

        {/* ════ RIGHT COLUMN ═══════════════════════ */}
        <div className="flex flex-col gap-6" style={{ width: 320, minWidth: 300 }}>

          {/* Activity Feed */}
          <GroupActivityFeed groupId={groupId} />

          {/* Accountability Panel — only shown for money pacts */}
          <AccountabilityPanel group={g} />

          {/* Streak Calendar */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <StreakCalendar calendarData={g.calendarData} />
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>✓</span>
                </span>
                All done
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                Partial
              </span>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">🏆 Leaderboard</p>
              <span className="text-xs text-gray-400">By consistency</span>
            </div>
            <Leaderboard members={g.members} />
          </div>
        </div>

      </div>
    </div>
  );
}
