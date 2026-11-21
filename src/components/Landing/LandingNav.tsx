import React from 'react';
import { Flame, Code2, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { SupportedLanguage } from '../../types';

interface LandingNavProps {
  onEnterPlayground: (lang?: SupportedLanguage) => void;
  onOpenEmailModal: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onEnterPlayground,
  onOpenEmailModal,
}) => {
  const { setSelectedLanguage, userEmail } = useApp();

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    onEnterPlayground(lang);
  };

  return (
    <nav className="w-full h-16 border-b border-[#1E2330]/40 bg-[#0B0E14]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-[8px] bg-[#121620] flex items-center justify-center text-[#F2F4F8] group-hover:text-[#3B82F6] transition-colors">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#F2F4F8]">
            CodeForge
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center space-x-7 text-xs font-medium text-[#99A3B5]">
          <button
            onClick={() => handleNavClick('curriculum')}
            className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            Curriculum
          </button>
          <button
            onClick={() => handleLanguageSelect('go')}
            className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            Go
          </button>
          <button
            onClick={() => handleLanguageSelect('python')}
            className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            Python
          </button>
          <button
            onClick={() => handleLanguageSelect('javascript')}
            className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            JavaScript
          </button>
          <button
            onClick={() => handleLanguageSelect('typescript')}
            className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            TypeScript
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            Quizzes
          </button>
        </div>

        {/* Right: Account / Streak & CTA */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          {/* 12-day streak indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-[10px] bg-[#121620] text-xs font-medium text-[#99A3B5]">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[#F2F4F8] font-mono text-[11px] font-semibold">
              12-day streak
            </span>
          </div>

          {/* Account Pill or Start Free Button */}
          {userEmail ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenEmailModal()}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[10px] bg-[#121620] hover:bg-[#182030] text-[#F2F4F8] text-xs font-medium transition-colors cursor-pointer"
                title={`Signed in as ${userEmail} (Click to switch account)`}
              >
                <User className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="font-mono text-xs truncate max-w-[100px]">
                  {userEmail.split('@')[0]}
                </span>
              </button>

              <button
                onClick={() => onEnterPlayground()}
                className="px-3.5 py-1.5 rounded-[10px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer transform active:scale-98"
              >
                Playground →
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenEmailModal()}
              className="px-4 py-1.5 rounded-[10px] bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer transform active:scale-98"
            >
              Start Free
            </button>
          )}
        </div>
      </div>
    </nav >
  );
};
