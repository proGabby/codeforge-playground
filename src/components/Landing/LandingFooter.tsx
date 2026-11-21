import React from 'react';
import { Code2 } from 'lucide-react';
import type { SupportedLanguage } from '../../types';

interface LandingFooterProps {
  onEnterPlayground: (lang?: SupportedLanguage) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onEnterPlayground }) => {
  return (
    <footer className="w-full border-t border-[#1E2330]/40 bg-[#0B0E14] pt-14 pb-12 text-[#99A3B5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-[#F2F4F8]">
              <div className="w-7 h-7 rounded-[7px] bg-[#121620] flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight">CodeForge</span>
            </div>
            <p className="text-xs text-[#99A3B5] max-w-xs leading-relaxed">
              Built for the way developers learn.
            </p>
          </div>

          {/* Learn Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F2F4F8]">
              Learn
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onEnterPlayground('go')}
                  className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  Go curriculum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onEnterPlayground('python')}
                  className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  Python curriculum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onEnterPlayground('javascript')}
                  className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  JavaScript curriculum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onEnterPlayground('typescript')}
                  className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  TypeScript curriculum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onEnterPlayground()}
                  className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  Playground
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  Milestone quizzes
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F2F4F8]">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-[#F2F4F8] transition-colors cursor-pointer">
                Documentation
              </li>
              <li className="hover:text-[#F2F4F8] transition-colors cursor-pointer">
                Cheatsheets
              </li>
              <li className="hover:text-[#F2F4F8] transition-colors cursor-pointer">
                Community
              </li>
              <li className="hover:text-[#F2F4F8] transition-colors cursor-pointer">
                Status
              </li>
            </ul>
          </div>

          {/* CodeForge Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F2F4F8]">
              CodeForge
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-[#F2F4F8] transition-colors cursor-pointer">
                About
              </li>
              <li className="hover:text-[#F2F4F8] transition-colors cursor-pointer">
                Contact
              </li>
              <li className="hover:text-[#F2F4F8] transition-colors cursor-pointer">
                Privacy
              </li>
              <li className="hover:text-[#F2F4F8] transition-colors cursor-pointer">
                Terms
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1E2330]/30 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#737F94] gap-2">
          <span>© 2026 CodeForge</span>
          <span>Craft over shortcuts.</span>
        </div>
      </div>
    </footer>
  );
};
