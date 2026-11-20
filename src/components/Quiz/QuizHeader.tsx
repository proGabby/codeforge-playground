import React from 'react';

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
        className="flex items-center gap-1.5 text-xs font-mono text-[#737F94] hover:text-[#F2F4F8] transition-colors py-0.5 px-1 rounded cursor-pointer"
        title="Close (esc)"
      >
        <span className="text-[11px] font-mono tracking-tight text-[#737F94]">esc</span>
        <span className="text-sm font-sans leading-none text-[#737F94]">×</span>
      </button>
    </div>
  );
};
