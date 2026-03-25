import React from 'react';
import { IndianRupee, ArrowDownToLine, ArrowUpFromLine, RefreshCw, Wallet, LayoutGrid, Lock } from 'lucide-react';

export function WalletPage() {
  const currentBalance = 1250;
  const lockedInPacts = 350;
  const earnings = 120; // Money won from others failing

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center">
      <div className="w-full max-w-2xl px-6 py-8 pb-28">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
            <Wallet size={24} className="text-violet-600" /> My Wallet
          </h1>
          <p className="text-sm text-gray-500">Manage your deposits, pact stakes, and earnings.</p>
        </div>

        {/* Main Balance Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" style={{ background: 'linear-gradient(90deg, #7c3aed, #4ade80)' }} />
          
          <div className="flex flex-col items-center text-center justify-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Available Balance</p>
            <div className="flex items-center gap-1.5 text-gray-900 mb-8">
              <IndianRupee size={32} />
              <span className="text-5xl font-extrabold tracking-tight">{currentBalance.toLocaleString()}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4 w-full">
              <button className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-2 bg-gray-900 hover:bg-black">
                <ArrowDownToLine size={18} /> Add Money
              </button>
              <button className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all hover:-translate-y-0.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2">
                <ArrowUpFromLine size={18} /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Breakdown row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col gap-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Lock size={14} /> Locked in Pacts
            </div>
            <p className="text-2xl font-extrabold text-gray-900 flex items-center gap-1">
              <IndianRupee size={16} />{lockedInPacts.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">Can't be withdrawn until pact ends.</p>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 flex flex-col gap-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <ArrowUpFromLine size={14} /> Total Earnings
            </div>
            <p className="text-2xl font-extrabold text-emerald-700 flex items-center gap-1">
              <IndianRupee size={16} />{earnings.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600/70 font-medium">From partners missing checks.</p>
          </div>
        </div>

        {/* Transaction History (Mock) */}
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Transactions</h2>
          <div className="flex flex-col gap-3">
            {[
              { id: 1, type: 'earning', label: 'Partner penalty received', group: '100 Days of Code', amount: 10, date: 'Today' },
              { id: 2, type: 'deposit', label: 'Initial deposit', group: 'Morning Miles Club', amount: -200, date: 'Yesterday' },
              { id: 3, type: 'topup', label: 'Added to wallet', group: 'UPI Transfer', amount: 500, date: 'Mar 22' },
              { id: 4, type: 'penalty', label: 'Miss penalty deducted', group: '100 Days of Code', amount: -10, date: 'Mar 19' },
            ].map(tx => (
              <div key={tx.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'earning' || tx.type === 'topup' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                  }`}>
                    {tx.type === 'earning' ? <ArrowDownToLine size={20} /> : tx.type === 'topup' ? <Wallet size={20} /> : tx.type === 'deposit' ? <Lock size={20} /> : <RefreshCw size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{tx.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tx.group} · {tx.date}</p>
                  </div>
                </div>
                <div className={`text-base font-extrabold flex items-center ${tx.amount > 0 ? 'text-emerald-500' : 'text-gray-900'}`}>
                  {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
