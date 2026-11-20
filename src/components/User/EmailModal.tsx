import React, { useState, useEffect } from 'react';
import { Mail, Cloud, Database, ArrowRight, ShieldCheck, LogOut, User, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmailModalProps {
  onSuccess?: () => void;
  onGuestContinue?: () => void;
  onClose?: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ onSuccess, onGuestContinue, onClose }) => {
  const { showEmailModal, setShowEmailModal, userEmail, setUserEmail, logoutUser } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Clear input when opened so user can easily enter new email to switch
  useEffect(() => {
    setEmailInput('');
    setErrorMsg('');
  }, [showEmailModal]);

  const handleClose = () => {
    setShowEmailModal(false);
    if (onClose) {
      onClose();
    }
  };

  const handleGuestContinue = () => {
    localStorage.setItem('codeforge_skipped_email', 'true');
    setShowEmailModal(false);
    if (onGuestContinue) {
      onGuestContinue();
    }
  };

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showEmailModal) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEmailModal]);

  if (!showEmailModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (userEmail && cleanEmail.toLowerCase() === userEmail.toLowerCase()) {
      setErrorMsg('This is already your active account.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    try {
      await setUserEmail(cleanEmail);
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setErrorMsg('Failed to sync. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0E121B] border border-[#1E2536] rounded-2xl shadow-2xl shadow-black p-6 sm:p-7 overflow-hidden text-[#F2F4F8] my-auto flex flex-col ring-1 ring-white/[0.08]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>

        {/* Top Eyebrow Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono tracking-widest text-[#737F94] uppercase font-semibold">
            CLOUD SYNC / TURSO DATABASE
          </span>

          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 text-xs font-mono text-[#737F94] hover:text-[#F2F4F8] transition-colors py-0.5 px-1 rounded cursor-pointer"
            title="Close (esc)"
          >
            <span className="text-[11px] font-mono tracking-tight text-[#737F94]">esc</span>
            <span className="text-sm font-sans leading-none text-[#737F94]">×</span>
          </button>
        </div>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mt-4 mb-3">
          <div className="w-11 h-11 rounded-xl bg-[#131F38] border border-[#2563EB]/40 flex items-center justify-center shadow-sm shadow-blue-500/10">
            {userEmail ? (
              <User className="w-5 h-5 text-[#3B82F6]" />
            ) : (
              <Cloud className="w-5 h-5 text-[#3B82F6]" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F2F4F8] tracking-tight">
              {userEmail ? 'Account Management' : 'Save Your Progress'}
            </h2>
            <p className="text-[11px] text-[#737F94] font-normal">
              {userEmail ? 'Turso Cloud Session Active' : 'Sync across browsers and devices'}
            </p>
          </div>
        </div>

        {/* Active Account Card (when signed in) */}
        {userEmail ? (
          <div className="bg-[#090D15] border border-[#171E2D] rounded-xl p-3.5 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-9 h-9 rounded-xl bg-[#131F38] border border-[#2563EB]/40 flex items-center justify-center text-[#3B82F6] font-bold text-sm shrink-0">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-[#737F94] uppercase tracking-wider font-semibold">
                  Signed in as
                </div>
                <div className="text-xs font-semibold text-[#F2F4F8] font-mono truncate">
                  {userEmail}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logoutUser}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Sign out of this account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <>
            {/* Description for new users */}
            <p className="text-xs text-[#99A3B5] leading-relaxed mb-5 font-normal">
              Enter your email to link your code exercises, test solutions, and daily streaks to our Turso cloud database. Pick up seamlessly on any device.
            </p>

            {/* Value Perks */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <div className="bg-[#090D15] border border-[#171E2D] rounded-xl p-3 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="text-xs text-[#F2F4F8] font-medium">Automatic cloud backup</span>
              </div>
              <div className="bg-[#090D15] border border-[#171E2D] rounded-xl p-3 flex items-center gap-2.5">
                <Database className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span className="text-xs text-[#F2F4F8] font-medium">Restores your solutions</span>
              </div>
            </div>
          </>
        )}

        {/* Form: Sign In or Switch Account */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#737F94] uppercase tracking-wider mb-1.5">
              {userEmail ? 'Switch To Another Account (Email)' : 'Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737F94]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="developer@example.com"
                required
                autoFocus={!userEmail}
                className="w-full bg-[#090D15] border border-[#171E2D] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#F2F4F8] placeholder:text-[#505D75] font-mono outline-none transition-all"
              />
            </div>
            {errorMsg && <p className="text-rose-400 text-[11px] mt-1.5">{errorMsg}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || !emailInput.trim()}
            className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Syncing with Turso...</span>
              </span>
            ) : userEmail ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Switch Account</span>
              </>
            ) : (
              <>
                <span>Sync & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Skip / Guest or Close button */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#737F94]">
          <button
            type="button"
            onClick={userEmail ? handleClose : handleGuestContinue}
            className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            {userEmail ? 'Close window' : 'Continue as Guest (browser only)'}
          </button>
        </div>
      </div>
    </div>
  );
};
