import React from 'react';
import { X } from 'lucide-react';

interface QuizHeaderProps {
  languageId: string;
  onClose: () => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({ languageId, onClose }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-mono tracking-widest text-[#737F94] uppercase font-semibold">
        SECTION MILESTONE / {languageId.toUpperCase()}
      </span>

      <button
        onClick={onClose}
        className="flex items-center gap-2 px-2.5 py-1 rounded-[8px] bg-[#121620] hover:bg-[#1E2536] border border-[#1E2536] hover:border-[#2A344B] text-[#99A3B5] hover:text-[#F2F4F8] transition-all cursor-pointer group shadow-sm"
        title="Close (esc)"
        aria-label="Close modal"
      >
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#1E2536] group-hover:bg-[#253248] text-[#99A3B5] group-hover:text-[#F2F4F8] border border-[#2A344B]/60 transition-colors">
          esc
        </span>
        <X className="w-3.5 h-3.5 text-[#99A3B5] group-hover:text-[#F2F4F8] transition-colors" />
      </button>
    </div>
  );
};
