import React, { useState } from 'react';
import { ArrowLeft, Plus, Globe, Lock, Info, IndianRupee } from 'lucide-react';

const PLATFORMS = ['GitHub', 'CodeForces', 'Duolingo', 'Custom'];

export function CreateGroupPage({ onBack, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('GitHub');
  const [privacy, setPrivacy] = useState('public');
  const [pactType, setPactType] = useState('free');
  const [loading, setLoading] = useState(false);
  
  // Money Pact specific
  const [deposit, setDeposit] = useState(50);
  const [penalty, setPenalty] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const newGroupData = {
      name,
      description,
      payment_type: pactType === 'money' ? 'paid' : 'free',
      verification_type: 'api', // default
      deposit_amount: pactType === 'money' ? Number(deposit) : 0,
      platform,
      privacy
    };

    try {
      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroupData)
      });

      if (response.ok) {
        const createdGroup = await response.json();
        if (onCreate) onCreate(createdGroup);
        onBack();
      } else {
        const err = await response.json();
        alert(err.message || 'Error creating group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Network error while creating group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="max-w-2xl mx-auto px-6 py-8 pb-20">

        {/* ── Header ─── */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} disabled={loading} className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Create New Pact</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* 1. Basic Details */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: '#3b82f6' }} />
            
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">1. Basic Details</h2>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Pact Name</label>
              <input
                type="text" required
                placeholder="e.g. 100 Days of Code"
                disabled={loading}
                value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
              <input
                type="text" required
                placeholder="What is the goal of this pact?"
                disabled={loading}
                value={description} onChange={e => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Platform Setup</label>
                <select
                  disabled={loading}
                  value={platform} onChange={e => setPlatform(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-blue-500 font-medium text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat pr-10"
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Privacy</label>
                <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setPrivacy('public')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${privacy === 'public' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Globe size={14} /> Public
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setPrivacy('private')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${privacy === 'private' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Lock size={14} /> Private
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Accountability Mode */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: '#7c3aed' }} />

            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">2. Accountability Mode</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Free Pact Toggle */}
              <div
                onClick={() => !loading && setPactType('free')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${pactType === 'free' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200 bg-white'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                  <span className="text-lg">🤝</span>
                </div>
                <p className="font-bold text-gray-900">Casual / Free Pact</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">Just for fun and mutual encouragement. No money involved.</p>
              </div>

              {/* Money Pact Toggle */}
              <div
                onClick={() => !loading && setPactType('money')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all ${pactType === 'money' ? 'border-violet-500 bg-violet-50' : 'border-gray-100 hover:border-gray-200 bg-white'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3" style={{ background: '#fefce8', color: '#ca8a04' }}>
                  <span className="text-lg">💰</span>
                </div>
                <p className="font-bold text-gray-900">Money Commitment</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">High stakes. Missed days transfer your deposit to your partner.</p>
              </div>
            </div>

            {/* Money Configuration Section */}
            {pactType === 'money' && (
              <div className="mt-2 pt-5 border-t border-gray-100 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex gap-2 items-start bg-blue-50 text-blue-800 rounded-xl p-3 text-xs leading-relaxed font-medium">
                  <Info size={16} className="shrink-0 mt-0.5 text-blue-500" />
                  When users join this pact, they must pay the Initial Deposit. Every day they miss their goal, the Penalty is deducted from their deposit and sent to their accountability partner.
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Initial Deposit</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-bold">₹</div>
                      <input
                        type="number" min="10" step="10" required
                        disabled={loading}
                        value={deposit} onChange={e => setDeposit(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all font-bold text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Miss Penalty</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-bold">₹</div>
                      <input
                        type="number" min="1" step="1" required
                        disabled={loading}
                        value={penalty} onChange={e => setPenalty(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-bold text-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-base font-bold text-white transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)', boxShadow: '0 8px 20px rgba(124,58,237,0.3)' }}
          >
            {loading ? 'Creating...' : <><Plus size={20} /> Create Pact</>}
          </button>
        </form>

      </div>
    </div>
  );
}
