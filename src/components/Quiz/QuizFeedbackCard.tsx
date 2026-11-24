import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuizFeedbackCardProps {
  correctCount: number;
  totalQuestions: number;
  scorePercent: number;
  explanation: string;
  isCorrect?: boolean;
  revisitConceptText?: string;
  onRevisit?: (concept: string) => void;
  onOpenRemediation?: () => void;
}

export const QuizFeedbackCard: React.FC<QuizFeedbackCardProps> = ({
  correctCount,
  totalQuestions,
  scorePercent,
  explanation,
  isCorrect,
  revisitConceptText,
  onRevisit,
  onOpenRemediation,
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

      {/* Remediation & AI Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#171E2D]">
        {onOpenRemediation && !isCorrect && (
          <button
            type="button"
            onClick={onOpenRemediation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121620] hover:bg-[#1E2536] border border-[#1E2536] hover:border-[#3B82F6]/50 text-xs font-medium text-[#F2F4F8] transition-all cursor-pointer group shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
            <span>Read Targeted Concept Guide (3 min)</span>
          </button>
        )}

        {revisitConceptText && (
          <button
            type="button"
            onClick={() => onRevisit && onRevisit(revisitConceptText)}
            className="text-xs font-medium text-[#60A5FA] hover:text-[#93C5FD] hover:underline cursor-pointer"
          >
            Ask AI: {revisitConceptText}
          </button>
        )}
      </div>
    </div>
  );
};
