import React, { useState, useEffect } from 'react';
import { Camera, Check, X, ShieldAlert, Image as ImageIcon, ExternalLink, Clock } from 'lucide-react';

export function ProofActionCenter({ groupId }) {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'review'
  
  // Submission state
  const [proofUrl, setProofUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState(null); // 'pending' | 'verified' | 'rejected'

  // Review state
  const [assignedReview, setAssignedReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    fetchReview();
    // In a real app, also fetch current user's submission status for today
  }, [groupId]);

  const fetchReview = async () => {
    setLoadingReview(true);
    try {
      const res = await fetch(`http://localhost:5000/api/checkins/group/${groupId}/review`);
      if (res.ok) {
        const data = await res.json();
        setAssignedReview(data);
      }
    } catch (e) {
      console.error('Error fetching review:', e);
    } finally {
      setLoadingReview(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofUrl) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, imageData: proofUrl })
      });
      if (res.ok) {
        setSubmitted(true);
        setStatus('pending');
      }
    } catch (e) {
      console.error('Submission error:', e);
    }
  };

  const handleVerify = async (decision) => {
    if (!assignedReview) return;
    try {
      const res = await fetch(`http://localhost:5000/api/checkins/${assignedReview._id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      if (res.ok) {
        setAssignedReview(null);
        alert(`Successfully ${decision}ed the submission!`);
      }
    } catch (e) {
      console.error('Verification error:', e);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden mb-6">
      {/* Tab Header */}
      <div className="flex border-b border-gray-50">
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'submit' ? 'text-violet-600 bg-violet-50/30' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Your Task
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-l border-gray-50 ${activeTab === 'review' ? 'text-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Peer Review {assignedReview && <span className="ml-1 w-2 h-2 rounded-full bg-blue-500 inline-block" />}
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'submit' ? (
          <div className="flex flex-col gap-4">
             {submitted ? (
               <div className="flex flex-col items-center py-6 text-center">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                   {status === 'pending' ? <Clock size={28} /> : <Check size={28} />}
                 </div>
                 <p className="font-extrabold text-gray-900">Task Submitted!</p>
                 <p className="text-sm text-gray-500 max-w-[200px] mt-1">
                   {status === 'pending' ? 'Waiting for your peer to verify your work.' : 'Verified! You earned 10 XP today.'}
                 </p>
               </div>
             ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                      <Camera size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Daily Check-in</h3>
                      <p className="text-xs text-gray-400">Submit proof of your goal completion</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="Paste image URL or commit link..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:outline-none focus:border-violet-500 transition-all font-medium pr-10"
                        value={proofUrl}
                        onChange={e => setProofUrl(e.target.value)}
                        required
                      />
                      <ImageIcon className="absolute right-3 top-3.5 text-gray-300" size={16} />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> Complete Day
                    </button>
                  </form>
                </>
             )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {loadingReview ? (
              <p className="text-center text-sm text-gray-400 py-8 italic tracking-wide">Scanning assigned reviews...</p>
            ) : assignedReview ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Verify for {assignedReview.user?.name || 'Squad Member'}</h3>
                    <p className="text-xs text-gray-400">Day {assignedReview.day} Proof</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-1 mt-2 overflow-hidden aspect-video relative group">
                  <img src={assignedReview.image_data} alt="Proof" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <a href={assignedReview.image_data} target="_blank" rel="noreferrer" className="text-white bg-white/20 p-2 rounded-lg backdrop-blur text-xs font-bold flex items-center gap-1">
                       <ExternalLink size={14} /> Full Size
                     </a>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleVerify('reject')}
                    className="flex-1 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={18} /> Reject
                  </button>
                  <button
                    onClick={() => handleVerify('verify')}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Verify
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                 <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center mb-4">
                   <Activity size={28} />
                 </div>
                 <p className="font-extrabold text-gray-400">All caught up!</p>
                 <p className="text-xs text-gray-400 max-w-[180px] mt-1 italic tracking-wide">
                   No new submissions waiting for your verification yet.
                 </p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
