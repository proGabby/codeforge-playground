import React, { useState, useEffect } from 'react';
import { Mail, Cloud, Database, ArrowRight, ShieldCheck, X, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmailModal: React.FC = () => {
  const { showEmailModal, setShowEmailModal, userEmail, setUserEmail, logoutUser } = useApp();
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setEmailInput(userEmail || '');
  }, [userEmail]);

  if (!showEmailModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    try {
      await setUserEmail(cleanEmail);
    } catch {
      setErrorMsg('Failed to sync. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('codeforge_skipped_email', 'true');
    setShowEmailModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-slate-100">
        {/* Glow ambient background effect */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button (if already has an email or skipped) */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <Database className="w-3 h-3" /> Turso Cloud Sync
            </span>
            <h2 className="text-lg font-bold text-slate-100">Save Your Progress</h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          Enter your email to sync your Go exercises, previous solutions, and streaks to our Turso cloud database. You can pick up right where you left off from any browser or device.
        </p>

        {/* Value Perks */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-300 font-medium">Automatic cloud backup</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-[11px] text-slate-300 font-medium">Restores your solutions</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="developer@example.com"
                required
                autoFocus
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>
            {errorMsg && <p className="text-rose-400 text-[11px] mt-1.5">{errorMsg}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Syncing with Turso...
              </span>
            ) : (
              <>
                <span>Sync & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Skip / Guest or Logout button */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <button
            type="button"
            onClick={handleSkip}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            {userEmail ? 'Close window' : 'Continue as Guest (browser only)'}
          </button>

          {userEmail && (
            <button
              type="button"
              onClick={logoutUser}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
