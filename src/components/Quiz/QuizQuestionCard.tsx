import React from 'react';
import { QuizOptionCard } from './QuizOptionCard';
import type { QuizQuestion } from '../../types';

interface QuizQuestionCardProps {
  currentQ: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  xpReward: number;
  isReviewMode: boolean;
  answers: Record<string, string>;
  onSelectOption: (optionId: string) => void;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  currentQ,
  answers,
  isReviewMode,
  onSelectOption,
}) => {
  return (
    <>
      {/* Question Prompt */}
      <h3 className="text-base sm:text-lg font-semibold text-[#F2F4F8] mb-4 tracking-tight leading-snug">
        {currentQ.question}
      </h3>

      {/* Code Snippet Box (JetBrains Mono) */}
      {currentQ.codeSnippet && (
        <div className="bg-[#090D15] border border-[#171E2D] rounded-xl p-4 sm:p-5 mb-5 font-mono text-xs sm:text-[13px] text-[#E2E8F0] leading-relaxed overflow-x-auto shadow-inner">
          <pre className="font-mono">
            <code>{currentQ.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2.5 mb-5">
        {currentQ.options.map((opt, optIdx) => {
          const isSelected = answers[currentQ.id] === opt.id;
          const isCorrectOption = isReviewMode ? opt.id === currentQ.correctOptionId : null;
          const isUserChoice = isReviewMode ? answers[currentQ.id] === opt.id : null;

          return (
            <QuizOptionCard
              key={opt.id}
              option={opt}
              index={optIdx}
              isSelected={isSelected}
              isCorrectOption={isCorrectOption}
              isUserChoice={isUserChoice}
              isReviewMode={isReviewMode}
              onSelect={() => onSelectOption(opt.id)}
            />
          );
        })}
      </div>
    </>
  );
};
