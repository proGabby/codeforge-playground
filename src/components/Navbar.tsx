import React from 'react';
import { Code2, Flame, Moon, Sun, ShieldAlert, Cpu, Cloud } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalDateString, getCalendarDayDiff } from '../utils/streakUtils';

  interface NavbarProps {
    onNavigateHome?: () => void;
  }

  export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
    const {
      theme,
      setTheme,
      learningMode,
      setLearningMode,
      selectedLanguage,
      setSelectedLanguage,
      userProgress,
      weakConcepts,
      userEmail,
      setShowEmailModal,
    } = useApp();

    const isStreakActiveToday = Boolean(
      userProgress.lastCompletedDate &&
      getCalendarDayDiff(userProgress.lastCompletedDate, getLocalDateString()) <= 0
    );

    const streakDays = userProgress.streakDays || 0;
    const streakTooltip = isStreakActiveToday
      ? `Streak active for today (${streakDays} day${streakDays === 1 ? '' : 's'})! Keep up the momentum!`
      : streakDays > 0
        ? `Practice today to extend your streak to ${streakDays + 1} days!`
        : 'Complete an exercise today to start your daily streak!';

    return (
      <header className="h-14 bg-slate-900 border-b border-slate-800 text-slate-100 flex items-center justify-between px-4 select-none z-20">
        {/* Brand Logo */}
          <div
            onClick={onNavigateHome}
            className={`flex items-center space-x-3 select-none ${onNavigateHome ? 'cursor-pointer group hover:opacity-95 transition-opacity' : ''
              }`}
            title={onNavigateHome ? 'Back to Landing Page' : undefined}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                CodeForge
              </span>
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                PROG-PLAYGROUND
              </span>
            </div>
          </div>

          {/* Language Adapter Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Language:
            </span>
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setSelectedLanguage('go')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold shadow-sm transition-all cursor-pointer ${selectedLanguage === 'go'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
              >
                {selectedLanguage === 'go' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
                Go (Golang)
              </button>
              <button
                onClick={() => setSelectedLanguage('python')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold shadow-sm transition-all cursor-pointer ${selectedLanguage === 'python'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
              >
                {selectedLanguage === 'python' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
                Python
              </button>
              <span className="px-2 text-xs text-slate-500 font-mono cursor-not-allowed" title="Coming soon">Rust</span>
              <span className="px-2 text-xs text-slate-500 font-mono cursor-not-allowed" title="Coming soon">JS/TS</span>
            </div>
          </div>

          {/* Learning Mode Switcher */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
              <button
                onClick={() => setLearningMode('guided')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${learningMode === 'guided'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
                title="Guided Mode: Progressive step-by-step hints and tutor guidance"
              >
                Guided Mode
              </button>
              <button
                onClick={() => setLearningMode('practice')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${learningMode === 'practice'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
                title="Practice Mode: Minimal hints on request"
              >
                Practice
              </button>
              <button
                onClick={() => setLearningMode('challenge')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${learningMode === 'challenge'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
                title="Challenge Mode: Strict environment, hints locked until 3 fails"
              >
                Challenge
              </button>
            </div>

            {/* Streak & Mastery Stats */}
            <div
              className={`flex items-center space-x-2 px-2.5 py-1 rounded-lg border transition-all select-none cursor-pointer ${isStreakActiveToday
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-sm shadow-amber-500/10'
                : streakDays > 0
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400/80 hover:border-amber-500/40'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
              title={streakTooltip}
            >
              <Flame
                className={`w-4 h-4 transition-transform ${isStreakActiveToday
                  ? 'text-amber-400 fill-amber-400 animate-pulse'
                  : streakDays > 0
                    ? 'text-amber-400/70 fill-amber-400/40'
                    : 'text-slate-500'
                  }`}
              />
              <span className="text-xs font-semibold font-mono">
                {streakDays} Day{streakDays === 1 ? '' : 's'}
              </span>
              {isStreakActiveToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Daily goal achieved!"></span>
              )}
            </div>

            {/* Weak Concept Warning Badge */}
            {weakConcepts.length > 0 && (
              <div
                className="flex items-center space-x-1.5 bg-rose-500/10 border border-rose-500/30 px-2 py-1 rounded-lg text-rose-300 text-xs font-medium animate-pulse cursor-pointer"
                title={`Focus needed on: ${weakConcepts.join(', ')}`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Weak: {weakConcepts[0]}</span>
              </div>
            )}

            {/* Cloud Sync / Email Status */}
            {userEmail ? (
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 px-2.5 py-1 rounded-lg text-emerald-300 text-xs font-medium transition-colors cursor-pointer"
                title={`Synced with Turso as ${userEmail}. Click to switch or log out.`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="max-w-[130px] truncate font-mono">{userEmail}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex items-center space-x-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 px-2.5 py-1 rounded-lg text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Sync your progress & solutions to Turso DB"
              >
                <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sync Account</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Light / Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
      </header>
    );
  };
