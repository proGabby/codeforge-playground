import React from 'react';
import type { QuizOption } from '../../types';

interface QuizOptionCardProps {
  option: QuizOption;
  index: number;
  isSelected: boolean;
  isCorrectOption: boolean | null;
  isUserChoice: boolean | null;
  isReviewMode: boolean;
  onSelect: () => void;
}

export const QuizOptionCard: React.FC<QuizOptionCardProps> = ({
  option,
  index,
  isSelected,
  isCorrectOption,
  isUserChoice,
  isReviewMode,
  onSelect,
}) => {
  const letter = String.fromCharCode(65 + index); // A, B, C, D

  if (isReviewMode) {
    let cardStyles = 'bg-[#0B0F19] border-[#171E2D] text-[#99A3B5]';
    let radioCircle = (
      <div className="w-4 h-4 rounded-full border border-[#2D374A] flex-shrink-0" />
    );
    let rightBadge = null;

    if (isCorrectOption) {
      cardStyles = 'bg-[#131F38] border-[#2563EB]/80 text-[#F2F4F8] shadow-sm shadow-blue-500/10';
      radioCircle = (
        <div className="w-4 h-4 rounded-full border-2 border-[#3B82F6] flex items-center justify-center p-0.5 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
        </div>
      );
      rightBadge = (
        <span className="text-xs font-medium text-[#60A5FA] flex items-center gap-1.5 flex-shrink-0">
          <span>✓</span> Correct answer
        </span>
      );
    } else if (isUserChoice && !isCorrectOption) {
      cardStyles = 'bg-[#251218] border-rose-500/70 text-rose-200';
      radioCircle = (
        <div className="w-4 h-4 rounded-full border-2 border-rose-500 flex items-center justify-center p-0.5 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
        </div>
      );
      rightBadge = (
        <span className="text-xs font-medium text-rose-400 flex items-center gap-1.5 flex-shrink-0">
          <span>×</span> Your answer
        </span>
      );
    }

    return (
      <div
        className={`px-4 py-3.5 rounded-xl border flex items-center justify-between text-sm transition-all ${cardStyles}`}
      >
        <div className="flex items-center gap-3.5 flex-1 pr-2">
          {radioCircle}
          <span className="text-xs font-mono text-[#737F94] w-4">{letter}</span>
          <span className={`leading-relaxed ${isCorrectOption ? 'text-[#F2F4F8] font-medium' : ''}`}>
            {option.text}
          </span>
        </div>
        {rightBadge}
      </div>
    );
  }

  // Active taking mode
  return (
    <div
      onClick={onSelect}
      className={`px-4 py-3.5 rounded-xl border cursor-pointer flex items-center justify-between text-sm transition-all ${isSelected
          ? 'bg-[#131F38] border-[#3B82F6] text-[#F2F4F8] ring-1 ring-[#3B82F6]/30 shadow-sm'
          : 'bg-[#0B0F19] border-[#171E2D] text-[#99A3B5] hover:border-[#28354A] hover:bg-[#0E1422] hover:text-[#F2F4F8]'
        }`}
    >
      <div className="flex items-center gap-3.5 flex-1">
        {isSelected ? (
          <div className="w-4 h-4 rounded-full border-2 border-[#3B82F6] flex items-center justify-center p-0.5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          </div>
        ) : (
          <div className="w-4 h-4 rounded-full border border-[#2D374A] flex-shrink-0" />
        )}
        <span className="text-xs font-mono text-[#737F94] w-4">{letter}</span>
        <span className={`leading-relaxed ${isSelected ? 'text-[#F2F4F8] font-medium' : ''}`}>
          {option.text}
        </span>
      </div>
    </div>
  );
};
