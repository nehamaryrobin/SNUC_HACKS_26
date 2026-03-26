import React from 'react';
import { User, CheckCircle2, Clock, Zap, AlertCircle } from 'lucide-react';

export function GroupActivityFeed({ groupId }) {
  // Mock data for social feed
  const feedItems = [
    { id: 1, user: 'Neha', initials: 'N', color: '#7c3aed', type: 'submit', content: 'committed 14 files to pact-frontend', time: '2h ago', status: 'verified' },
    { id: 2, user: 'Rahul', initials: 'R', color: '#10b981', type: 'submit', content: 'completed 30 XP on Duolingo (Spanish)', time: '4h ago', status: 'pending' },
    { id: 3, user: 'Arun', initials: 'A', color: '#3b82f6', type: 'verify', content: 'verified Priya\'s check-in for Day 18', time: '6h ago' },
    { id: 4, user: 'Priya', initials: 'P', color: '#f59e0b', type: 'miss', content: 'missed Day 17 check-in', time: 'Yesterday', status: 'penalty' },
  ];

  const getStatusIcon = (item) => {
    if (item.status === 'verified') return <CheckCircle2 size={12} className="text-green-500" />;
    if (item.status === 'pending') return <Clock size={12} className="text-amber-500" />;
    if (item.status === 'penalty') return <AlertCircle size={12} className="text-red-500" />;
    if (item.type === 'verify') return <Zap size={12} className="text-blue-500" />;
    return null;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Squad Activity</h3>
        <span className="text-[10px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">LIVE</span>
      </div>

      <div className="flex flex-col gap-6 relative">
        {/* Continuous thread line */}
        <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-50 z-0" />

        {feedItems.map((item, idx) => (
          <div key={item.id} className="flex gap-4 relative z-10 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${idx * 100}ms` }}>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm border-2 border-white"
              style={{ backgroundColor: item.color }}
            >
              {item.initials}
            </div>
            
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
               <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-gray-900">{item.user}</span>
                 <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
               </div>
               <p className="text-xs text-gray-500 line-clamp-2">
                 {item.type === 'miss' ? (
                   <span className="text-red-500 font-semibold">{item.content}</span>
                 ) : (
                   item.content
                 )}
               </p>
               <div className="flex items-center gap-1.5 mt-1">
                 {getStatusIcon(item)}
                 <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 text-opacity-80">
                   {item.status || (item.type === 'verify' ? 'contribution' : 'activity')}
                 </span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2.5 rounded-xl border border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all">
        View Full History
      </button>
    </div>
  );
}
