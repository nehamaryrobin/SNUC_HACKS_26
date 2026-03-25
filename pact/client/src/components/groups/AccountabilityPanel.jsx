import React from 'react';
import { ArrowRight, IndianRupee, RefreshCw } from 'lucide-react';

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

export function AccountabilityPanel({ group }) {
  const { members, accountabilityChain, depositAmount, penaltyPerMiss, stakePool } = group;
  if (group.pactType !== 'money') return null;

  const memberMap = Object.fromEntries(members.map(m => [m.id, m]));
  const you = members.find(m => m.isYou);
  const youIdx = accountabilityChain.indexOf(you.id);
  const partnerIdx = (youIdx + 1) % accountabilityChain.length;
  const partner = memberMap[accountabilityChain[partnerIdx]];

  const balancePercent = Math.round((you.depositBalance / depositAmount) * 100);
  const balanceLow = balancePercent <= 40;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">💰 Accountability</p>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <RefreshCw size={11} /> Resets Monday
        </span>
      </div>

      {/* Your accountability partner */}
      <div>
        <p className="text-xs text-gray-400 mb-2 font-medium">You are accountable to</p>
        <div className="flex items-center gap-3 bg-violet-50 rounded-xl px-4 py-3 border border-violet-100">
          <Avatar member={partner} size={36} />
          <div>
            <p className="font-bold text-gray-900 text-sm">{partner.name}</p>
            <p className="text-xs text-gray-500">
              If you miss, ₹{penaltyPerMiss} goes to {partner.name}
            </p>
          </div>
        </div>
      </div>

      {/* Your deposit balance */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400 font-medium">Your deposit balance</p>
          <span
            className="text-sm font-extrabold"
            style={{ color: balanceLow ? '#ef4444' : '#16a34a' }}
          >
            ₹{you.depositBalance} / ₹{depositAmount}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${balancePercent}%`,
              background: balanceLow ? '#ef4444' : '#22c55e',
            }}
          />
        </div>
        {balanceLow && (
          <p className="text-xs text-red-500 mt-1.5 font-medium">
            ⚠ Low balance — top up to stay in the group
          </p>
        )}
      </div>

      {/* Full chain visualization */}
      <div>
        <p className="text-xs text-gray-400 mb-3 font-medium">This week's chain</p>
        <div className="flex items-center gap-1 flex-wrap">
          {accountabilityChain.map((id, i) => {
            const m = memberMap[id];
            return (
              <React.Fragment key={id}>
                <div className="flex flex-col items-center gap-1">
                  <Avatar member={m} size={28} />
                  <span className="text-xs text-gray-500 font-medium" style={{ fontSize: 10 }}>
                    {m.isYou ? 'You' : m.name.split(' ')[0]}
                  </span>
                </div>
                {i < accountabilityChain.length - 1 && (
                  <ArrowRight size={14} className="text-gray-300 mb-3" />
                )}
              </React.Fragment>
            );
          })}
          {/* Wrap arrow back to first */}
          <ArrowRight size={14} className="text-gray-300 mb-3" />
          <div className="flex flex-col items-center gap-1">
            <Avatar member={memberMap[accountabilityChain[0]]} size={28} />
            <span className="text-xs text-gray-400" style={{ fontSize: 10 }}>↩</span>
          </div>
        </div>
      </div>

      {/* Stake pool */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-500">
          <IndianRupee size={14} />
          <span className="text-sm font-medium">Group Stake Pool</span>
        </div>
        <span className="text-sm font-extrabold text-gray-900">₹{stakePool}</span>
      </div>
    </div>
  );
}
