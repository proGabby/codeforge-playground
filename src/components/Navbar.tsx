import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, ChevronDown, Flame, Sun, Moon, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StreakPopover } from './Streak/StreakPopover';
import { getLocalDateString, getCalendarDayDiff } from '../utils/streakUtils';

interface NavbarProps {
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    userProgress,
    userEmail,
    setShowEmailModal,
    activeTopic,
    runCode,
    submitCode,
    isExecuting,
    theme,
    setTheme,
  } = useApp();

  const [showStreakPopover, setShowStreakPopover] = useState(false);

  // Keyboard shortcut listener: Cmd/Ctrl+Enter for Run, Shift+Cmd/Ctrl+Enter for Submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          submitCode();
        } else {
          runCode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runCode, submitCode]);

  const isStreakActiveToday = Boolean(
    userProgress.lastCompletedDate &&
    getCalendarDayDiff(userProgress.lastCompletedDate, getLocalDateString()) <= 0
  );

  const streakDays = userProgress.streakDays || 12; // Default to 12 as requested in specs if fresh

  const isPy = selectedLanguage === 'python';
  const langLabel = isPy ? 'Python' : 'Go';
  const topicTitle = activeTopic?.title
    ? activeTopic.title.replace(/^\d+\.\s*/, '')
    : 'Slices & iteration';

  return (
    <header className="h-12 bg-[#0B0E14] text-[#F2F4F8] flex items-center justify-between px-4 select-none z-30 shrink-0 border-b border-[#1E2536]/40">
      {/* Left: Brand Logo & Breadcrumb Navigation */}
      <div className="flex items-center space-x-3">
        {/* CodeForge Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center space-x-2 text-left cursor-pointer group focus:outline-none"
          title="Back to Landing Page"
        >
          <span className="font-mono text-[#F2F4F8] text-sm font-semibold tracking-tighter flex items-center gap-1">
            <span className="text-[#3B82F6]">&lt;/&gt;</span>
            <span className="font-sans font-bold">CodeForge</span>
          </span>
        </button>

        {/* Breadcrumb Path */}
        <nav className="flex items-center space-x-2 text-xs font-sans pl-2 border-l border-[#1E2536]">
          <span
            onClick={onNavigateHome}
            className="text-[#737F94] hover:text-[#99A3B5] cursor-pointer transition-colors"
          >
            Curriculum
          </span>
          <span className="text-[#737F94]/50">/</span>
          <span
            onClick={() => setSelectedLanguage(isPy ? 'python' : 'go')}
            className="text-[#737F94] hover:text-[#99A3B5] cursor-pointer transition-colors"
          >
            {langLabel}
          </span>
          <span className="text-[#737F94]/50">/</span>
          <span className="text-[#F2F4F8] font-medium truncate max-w-[200px] sm:max-w-xs">
            {topicTitle}
          </span>
        </nav>
      </div>

      {/* Right: Language Toggle, Theme Toggle, Account Pill, Streak Pill, Run & Submit Controls */}
      <div className="flex items-center space-x-2">
        {/* Segmented Language Switcher */}
        <div className="flex items-center bg-[#121620] p-0.5 rounded-[8px]">
          <button
            onClick={() => setSelectedLanguage('go')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[6px] transition-all cursor-pointer ${
              !isPy
                ? 'bg-[#1E2536] text-[#F2F4F8] shadow-sm'
                : 'text-[#737F94] hover:text-[#99A3B5]'
            }`}
          >
            Go
          </button>
          <button
            onClick={() => setSelectedLanguage('python')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[6px] transition-all cursor-pointer ${
              isPy
                ? 'bg-[#1E2536] text-[#F2F4F8] shadow-sm'
                : 'text-[#737F94] hover:text-[#99A3B5]'
            }`}
          >
            Python
          </button>
        </div>

        {/* Theme Toggle (Light / Dark mode) */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 rounded-[8px] bg-[#121620] hover:bg-[#182030] text-[#99A3B5] hover:text-[#F2F4F8] transition-colors cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-blue-500" />
          )}
        </button>

        {/* Account / Switch Account Pill */}
        <button
          onClick={() => setShowEmailModal(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-[8px] bg-[#121620] hover:bg-[#182030] text-[#F2F4F8] text-xs font-medium transition-colors cursor-pointer"
          title={userEmail ? `Signed in as ${userEmail} (Click to switch account)` : 'Sign in / Switch account'}
        >
          <User className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="font-mono text-[11px] truncate max-w-[110px]">
            {userEmail ? userEmail.split('@')[0] : 'Account'}
          </span>
        </button>

        {/* Streak Dropdown Pill */}
        <div className="relative">
          <button
            onClick={() => setShowStreakPopover((prev) => !prev)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-[8px] bg-[#121620] hover:bg-[#182030] text-[#F2F4F8] text-xs font-medium transition-colors cursor-pointer"
            title="View 30-day streak status"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-mono text-[11px] font-semibold">{streakDays} days</span>
            <ChevronDown className="w-3 h-3 text-[#737F94]" />
          </button>

          {showStreakPopover && (
            <StreakPopover
              streakDays={streakDays}
              isStreakActiveToday={isStreakActiveToday}
              onClose={() => setShowStreakPopover(false)}
              onOpenEmailSync={() => setShowEmailModal(true)}
              userEmail={userEmail}
            />
          )}
        </div>

        {/* Run Button */}
        <button
          onClick={runCode}
          disabled={isExecuting}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-[8px] bg-[#121620] hover:bg-[#182030] text-[#F2F4F8] text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
          title="Run code (Cmd+Enter or Ctrl+Enter)"
        >
          <Play className="w-3 h-3 text-[#99A3B5] fill-[#99A3B5]" />
          <span>Run</span>
          <span className="text-[10px] text-[#737F94] font-mono hidden sm:inline">(⌘↵)</span>
        </button>

        {/* Submit Button */}
        <button
          onClick={submitCode}
          disabled={isExecuting}
          className="flex items-center space-x-1.5 px-3.5 py-1 rounded-[8px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          title="Submit solution for test evaluation (Shift+Cmd+Enter)"
        >
          <span>{isExecuting ? 'Evaluating...' : 'Submit'}</span>
          <span className="text-[10px] text-blue-200 font-mono hidden sm:inline">(⇧⌘↵)</span>
          <ArrowRight className="w-3 h-3 text-white" />
        </button>
      </div>
    </header>
  );
};
