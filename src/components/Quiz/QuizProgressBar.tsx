import React from 'react';
import type { QuizQuestion, QuizSubmissionResult } from '../../types';

interface QuizProgressBarProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  submissionResult: QuizSubmissionResult | null;
  checkedQuestions?: Record<string, { isCorrect: boolean }>;
  onSelectQuestion: (index: number) => void;
}

export const QuizProgressBar: React.FC<QuizProgressBarProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  submissionResult,
  checkedQuestions,
  onSelectQuestion,
}) => {
  const isLargeSet = questions.length > 15;

  return (
    <div className={`flex items-center mb-6 ${isLargeSet ? 'gap-0.5 sm:gap-1' : 'gap-2'}`}>
      {questions.map((q, idx) => {
        let segmentColor = 'bg-[#1E2536]';
        if (submissionResult) {
          const qResult = submissionResult.questionResults.find((qr) => qr.questionId === q.id);
          segmentColor = qResult?.isCorrect ? 'bg-emerald-500' : 'bg-red-500/70';
        } else if (checkedQuestions && checkedQuestions[q.id]) {
          segmentColor = checkedQuestions[q.id].isCorrect ? 'bg-emerald-500' : 'bg-red-500/70';
        } else {
          if (answers[q.id] || idx === currentQuestionIndex) {
            segmentColor = 'bg-[#3B82F6]';
          }
        }

        const isCurrent = idx === currentQuestionIndex;

        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelectQuestion(idx)}
            className={`${isLargeSet ? 'h-1.5 min-w-[2px]' : 'h-1'} flex-1 rounded-full transition-all ${segmentColor} hover:opacity-90 cursor-pointer ${
              isCurrent ? 'ring-1 ring-[#3B82F6] ring-offset-1 ring-offset-[#0E121B]' : ''
            }`}
            title={`Question ${idx + 1} (${q.difficulty || 'standard'}): ${
              checkedQuestions?.[q.id]
                ? checkedQuestions[q.id].isCorrect
                  ? 'Correct'
                  : 'Incorrect'
                : answers[q.id]
                ? 'Answered'
                : 'Unanswered'
            }`}
          />
        );
      })}
    </div>
  );
};
