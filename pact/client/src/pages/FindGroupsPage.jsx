import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Globe, Lock, X, Users, IndianRupee, Activity, ShieldCheck } from 'lucide-react';
import { mockDiscoverGroups } from '../data/mockDiscoverGroups';

const PLATFORMS = ['All', 'GitHub', 'CodeForces', 'Duolingo', 'Custom'];
const PACT_LABELS = {
  blood:  { label: '💰 Money Pact',  bg: '#7f1d1d', text: '#fca5a5', border: '#991b1b' },
  casual: { label: '🤝 Casual Pact', bg: '#1e3a5f', text: '#93c5fd', border: '#1d4ed8' },
};

function ConsistencyBar({ value }) {
  const color = value >= 90 ? '#22c55e' : value >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{value.toFixed(1)}%</span>
    </div>
  );
}

function PactBadge({ type }) {
  const c = PACT_LABELS[type];
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {c.label}
    </span>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all whitespace-nowrap"
      style={active
        ? { background: '#111827', color: '#fff', borderColor: '#111827' }
        : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }
      }
    >
      {label}
    </button>
  );
}

function DropdownFilter({ label }) {
  return (
    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all">
      {label}
      <span className="text-gray-400">▼</span>
    </button>
  );
}

/* ── Group Detail Popup ───────────────────────────────────────────── */
function GroupPopup({ group, onClose }) {
  if (!group) return null;
  const isMoney = group.pactType === 'blood';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Card — stop propagation so clicks inside don't close */}
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top colour band */}
        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#7c3aed,#6366f1)' }} />

        <div className="p-6 flex flex-col gap-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: '#f3f4f6' }}>
                {group.emoji}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 leading-tight">{group.name}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{group.platform} · {group.description}</p>
              </div>
            </div>
            <button onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0">
              <X size={18} />
            </button>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <PactBadge type={group.pactType} />
            {group.privacy === 'public' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                <Globe size={11} /> Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
                <Lock size={11} /> Private
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <Users size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-lg font-extrabold text-gray-900">{group.members}</p>
              <p className="text-xs text-gray-400">Members</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <Activity size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-lg font-extrabold"
                style={{ color: group.consistency >= 90 ? '#22c55e' : group.consistency >= 70 ? '#f59e0b' : '#ef4444' }}>
                {group.consistency}%
              </p>
              <p className="text-xs text-gray-400">Consistency</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <ShieldCheck size={16} className="mx-auto text-gray-400 mb-1" />
              <p className="text-lg font-extrabold text-gray-900 capitalize">{group.privacy}</p>
              <p className="text-xs text-gray-400">Privacy</p>
            </div>
          </div>

          {/* Money Pact details — only shown if money group */}
          {isMoney && group.depositAmount > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex flex-col gap-2">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">💰 Money Commitment</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-900">
                  <IndianRupee size={15} />
                  <span className="text-sm font-semibold">Initial Deposit</span>
                </div>
                <span className="text-lg font-extrabold text-amber-800">₹{group.depositAmount}</span>
              </div>
              <p className="text-xs text-amber-600">
                Missing a day deducts a portion from your deposit, which goes to your accountability partner. When your deposit runs out, you are removed from the group.
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}
          >
            {isMoney && group.depositAmount > 0 ? `Join & Deposit ₹${group.depositAmount}` : 'Join Group'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export function FindGroupsPage({ onBack, onCreateNew }) {
  const [search, setSearch] = useState('');
  const [activePlatform, setActivePlatform] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const filtered = useMemo(() => {
    return mockDiscoverGroups.filter(g => {
      const matchesPlatform = activePlatform === 'All' || g.platform === activePlatform;
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase())
        || g.description.toLowerCase().includes(search.toLowerCase())
        || g.platform.toLowerCase().includes(search.toLowerCase());
      return matchesPlatform && matchesSearch;
    });
  }, [search, activePlatform]);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="max-w-4xl mx-auto px-8 py-8 pb-20">

        {/* ── Header ─── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-extrabold text-gray-900">Explore Pacts</h1>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-[#111827] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg leading-none mb-0.5">+</span> Create Pact
          </button>
        </div>

        {/* ── Search + Platform pills ─── */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 min-w-48 shadow-sm">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search groups, habits, apps…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {PLATFORMS.map(p => (
              <FilterPill key={p} label={p} active={activePlatform === p} onClick={() => setActivePlatform(p)} />
            ))}
          </div>
        </div>

        {/* ── Sub-filters + count ─── */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-gray-400" />
            <DropdownFilter label="Commitment" />
            <DropdownFilter label="Privacy" />
            <DropdownFilter label="Sort by" />
          </div>
          <p className="text-sm text-gray-400 font-medium">{filtered.length} Groups Found</p>
        </div>

        {/* ── Column headers ─── */}
        <div className="grid text-xs font-bold uppercase tracking-widest text-gray-400 px-4 mb-2"
          style={{ gridTemplateColumns: '1fr 120px 160px 130px' }}>
          <span>Group</span>
          <span>Privacy</span>
          <span>Consistency</span>
          <span className="text-right">Commitment</span>
        </div>

        {/* ── Group rows ─── */}
        <div className="flex flex-col gap-2">
          {filtered.map(group => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className="bg-white border border-gray-100 rounded-2xl px-4 py-4 shadow-sm hover:shadow-md hover:border-violet-200 transition-all cursor-pointer grid items-center gap-4"
              style={{ gridTemplateColumns: '1fr 120px 160px 130px' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: '#f3f4f6' }}>
                  {group.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{group.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {group.platform} · {group.members} members · {group.description}
                  </p>
                </div>
              </div>

              <div>
                {group.privacy === 'public' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                    <Globe size={11} /> Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff' }}>
                    <Lock size={11} /> Private
                  </span>
                )}
              </div>

              <ConsistencyBar value={group.consistency} />

              <div className="flex justify-end">
                <PactBadge type={group.pactType} />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold">No groups found</p>
              <p className="text-sm mt-1">Try a different search or platform filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Popup */}
      <GroupPopup group={selectedGroup} onClose={() => setSelectedGroup(null)} />
    </div>
  );
}
