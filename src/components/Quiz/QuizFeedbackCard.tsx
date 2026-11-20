import React from 'react';

interface QuizFeedbackCardProps {
  correctCount: number;
  totalQuestions: number;
  scorePercent: number;
  explanation: string;
  revisitConceptText?: string;
  onRevisit?: (concept: string) => void;
}

export const QuizFeedbackCard: React.FC<QuizFeedbackCardProps> = ({
  correctCount,
  totalQuestions,
  scorePercent,
  explanation,
  revisitConceptText,
  onRevisit,
}) => {
  return (
    <div className="bg-[#090D15] border border-[#171E2D] rounded-xl p-4 sm:p-5 mb-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#F2F4F8]">
          {correctCount} of {totalQuestions} correct
        </span>
        <span className="text-xs font-mono text-[#737F94] font-medium">
          {scorePercent}% mastery
        </span>
      </div>

      <p className="text-xs text-[#99A3B5] leading-relaxed mt-2.5">
        {explanation}
      </p>

      {revisitConceptText && (
        <button
          type="button"
          onClick={() => onRevisit && onRevisit(revisitConceptText)}
          className="text-xs font-medium text-[#60A5FA] hover:text-[#93C5FD] hover:underline cursor-pointer mt-3 inline-block text-left"
        >
          Revisit: {revisitConceptText}
        </button>
      )}
    </div>
  );
};
