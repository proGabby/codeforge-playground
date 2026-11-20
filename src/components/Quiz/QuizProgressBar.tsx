import React from 'react';
import type { QuizQuestion, QuizSubmissionResult } from '../../types';

interface QuizProgressBarProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  submissionResult: QuizSubmissionResult | null;
  onSelectQuestion: (index: number) => void;
}

export const QuizProgressBar: React.FC<QuizProgressBarProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  submissionResult,
  onSelectQuestion,
}) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      {questions.map((q, idx) => {
        let segmentColor = 'bg-[#1E2536]';
        if (submissionResult) {
          const qResult = submissionResult.questionResults.find((qr) => qr.questionId === q.id);
          segmentColor = qResult?.isCorrect ? 'bg-[#3B82F6]' : 'bg-[#1E2536]';
        } else {
          if (answers[q.id] || idx <= currentQuestionIndex) {
            segmentColor = 'bg-[#3B82F6]';
          }
        }

        const isCurrent = idx === currentQuestionIndex;

        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelectQuestion(idx)}
            className={`h-1 flex-1 rounded-full transition-all ${segmentColor} hover:opacity-90 cursor-pointer ${
              isCurrent ? 'ring-1 ring-[#3B82F6]/50' : ''
            }`}
            title={`Question ${idx + 1}`}
          />
        );
      })}
    </div>
  );
};
