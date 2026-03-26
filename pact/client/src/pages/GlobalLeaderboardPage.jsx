import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, ArrowUpRight, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export function GlobalLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/users/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeaderboard(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500 bg-yellow-50';
    if (rank === 2) return 'text-gray-400 bg-gray-50';
    if (rank === 3) return 'text-amber-600 bg-amber-50';
    return 'text-gray-500 bg-gray-50/50';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy size={16} />;
    if (rank === 2) return <Medal size={16} />;
    if (rank === 3) return <Medal size={16} />;
    return <span className="text-[10px] uppercase font-bold">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-10 py-8 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                 <Star size={18} fill="currentColor" />
              </span>
              <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Global Ranking</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Hall of Fame</h1>
            <p className="text-gray-500 text-sm mt-1">The most consistent habit-builders across the Pact network.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Payout</p>
                <p className="text-sm font-extrabold text-gray-900">Sunday, 12 AM</p>
             </div>
             <div className="w-px h-8 bg-gray-100" />
             <TrendingUp size={20} className="text-emerald-500" />
          </div>
        </div>

        {/* Top 3 Podium (Animated) */}
        {!loading && leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-6 items-end mt-4">
            {/* Rank 2 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
               className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center relative pt-12"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[1].name}`} alt="user" />
               </div>
               <div className="absolute top-4 right-4 bg-gray-50 text-gray-400 p-1.5 rounded-lg">
                  <Medal size={16} />
               </div>
               <p className="font-extrabold text-gray-900 truncate">{leaderboard[1].name}</p>
               <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mt-1">{leaderboard[1].xp} XP</p>
            </motion.div>

            {/* Rank 1 */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0 }}
               className="bg-white border-2 border-yellow-400 rounded-3xl p-8 shadow-xl text-center relative pt-14 pb-10"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-yellow-50">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[0].name}`} alt="user" />
               </div>
               <div className="absolute -top-4 -right-4 bg-yellow-400 text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-yellow-400/20">
                  <Trophy size={18} />
               </div>
               <p className="text-lg font-black text-gray-900 truncate">{leaderboard[0].name}</p>
               <div className="flex items-center justify-center gap-1.5 mt-2 bg-yellow-50 text-yellow-700 py-1 px-3 rounded-full mx-auto w-fit border border-yellow-100">
                  <Zap size={12} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{leaderboard[0].xp} XP</span>
               </div>
            </motion.div>

            {/* Rank 3 */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
               className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center relative pt-12"
            >
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-amber-50">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leaderboard[2].name}`} alt="user" />
               </div>
               <div className="absolute top-4 right-4 bg-amber-50 text-amber-600 p-1.5 rounded-lg">
                  <Medal size={16} />
               </div>
               <p className="font-extrabold text-gray-900 truncate">{leaderboard[2].name}</p>
               <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mt-1">{leaderboard[2].xp} XP</p>
            </motion.div>
          </div>
        )}

        {/* List Section */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden mt-2">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 flex-1 max-w-xs">
                  <Search size={14} className="text-gray-400" />
                  <input type="text" placeholder="Find user..." className="bg-transparent text-xs text-gray-900 outline-none w-full" />
               </div>
               <div className="flex gap-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global</span>
               </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-400 animate-pulse">Calculating rankings...</div>
            ) : (
              <div className="flex flex-col">
                {leaderboard.map((user) => (
                   <div key={user.id} className="flex items-center gap-4 p-4 px-6 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getRankColor(user.rank)} transition-colors`}>
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 group-hover:ring-2 ring-violet-200 transition-all">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
                      </div>

                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-gray-900">{user.name}</p>
                         <p className="text-[10px] text-gray-400 font-medium">Unlocked {user.badges || 0} badges</p>
                      </div>

                      <div className="text-right">
                         <div className="flex items-center justify-end gap-1.5">
                            <Zap size={12} className="text-violet-500" fill="rgba(124,58,237,0.2)" />
                            <span className="text-sm font-black text-gray-900">{user.xp.toLocaleString()}</span>
                         </div>
                         <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">
                            <TrendingUp size={10} /> +240 XP Today
                         </div>
                      </div>

                      <button className="p-2 rounded-lg text-gray-300 hover:text-violet-600 hover:bg-violet-50 transition-all ml-2">
                         <ArrowUpRight size={16} />
                      </button>
                   </div>
                ))}
              </div>
            )}
        </div>

      </div>
    </div>
  );
}
