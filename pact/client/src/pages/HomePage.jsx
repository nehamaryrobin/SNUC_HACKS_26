import React from 'react';
import { Target, Zap, Clock, CheckCircle2, TrendingUp, IndianRupee } from 'lucide-react';
import { mockGroups } from '../data/mockGroups'; // Use existing mock data

export function HomePage({ onNavigate }) {
  // Let's pretend today has 1 done, 2 pending
  const pendingTasks = [
    { id: 1, name: 'Algorithm Crushers', time: 'due in 3 hrs', icon: '⚡', color: '#2563eb', money: true },
    { id: 2, name: 'Polyglot Club', time: 'due tonight', icon: '🌏', color: '#10b981', money: false }
  ];
  
  const doneTasks = [
    { id: 3, name: '100 Days of Code', time: 'done at 8:00 AM', icon: '💻', color: '#111827', money: true }
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center">
      <div className="w-full max-w-2xl px-6 py-8 pb-28">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Good morning, Neha! 👋</h1>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" /> You're on a 18-day hot streak!
            </p>
          </div>
          <button 
            onClick={() => onNavigate('wallet')}
            className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
              <IndianRupee size={14} />
            </div>
            <div className="text-left font-bold text-gray-900 leading-tight">
              1,250 <span className="text-xs text-gray-400 font-medium">available</span>
            </div>
          </button>
        </div>

        {/* Global Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col gap-1.5 shadow-sm text-center">
            <div className="flex justify-center items-center gap-2 text-violet-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
               Active Pacts
            </div>
            <p className="text-3xl font-extrabold text-gray-900 leading-none">{mockGroups.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col gap-1.5 shadow-sm text-center">
            <div className="flex justify-center items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
               Total XP
            </div>
            <p className="text-3xl font-extrabold text-gray-900 leading-none">8,420</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col gap-1.5 shadow-sm text-center">
            <div className="flex justify-center items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
               Consistency
            </div>
            <p className="text-3xl font-extrabold text-gray-900 leading-none">94%</p>
          </div>
        </div>

        {/* Today's Tasks Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">📅</span>
              Today's Action Plan
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
              1/3 completed
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Pending */}
            {pendingTasks.map(task => (
              <div key={task.id} className="group relative flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: '#f8fafc' }}>
                    {task.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{task.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                        <Clock size={11} /> {task.time}
                      </span>
                      {task.money && (
                        <span className="flex items-center gap-0.5 text-xs text-gray-500 font-semibold">
                          <IndianRupee size={11} className="text-rose-500" /> -10 penalty
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onNavigate('groupDetail', task.id); }}
                  className="bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm shrink-0"
                >
                  Check In
                </button>
              </div>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-100 my-2" />

            {/* Completed */}
            {doneTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between bg-gray-50 border border-transparent rounded-2xl p-4 opacity-70">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-2xl grayscale">
                    {task.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-500 text-sm line-through decoration-gray-400">{task.name}</p>
                    <span className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
                       <CheckCircle2 size={12} /> {task.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accountability Alert (Mock) */}
        <div className="bg-rose-50 rounded-2xl border border-rose-100 p-5 flex items-start gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
          <Target size={20} className="text-rose-500 shrink-0 mt-0.5" />
          <div className="relative z-10 w-full mb-1">
            <p className="text-sm font-bold text-rose-900 mb-1">Arjun's deposit is at risk!</p>
            <p className="text-xs text-rose-700/80 mb-3">
              Arjun hasn't checked into <span className="font-bold">100 Days of Code</span> today. Remind him, or you'll earn his ₹10 penalty.
            </p>
            <button className="bg-white border-rose-200 border text-rose-700 hover:bg-rose-100 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
              Nudge Arjun
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
