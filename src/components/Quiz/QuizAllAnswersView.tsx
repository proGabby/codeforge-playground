import React from 'react';
import type { QuizQuestion, QuizSubmissionResult } from '../../types';

interface QuizAllAnswersViewProps {
  questions: QuizQuestion[];
  answers: Record<string, string>;
  submissionResult: QuizSubmissionResult;
  onSelectQuestion: (index: number) => void;
}

export const QuizAllAnswersView: React.FC<QuizAllAnswersViewProps> = ({
  questions,
  answers,
  submissionResult,
  onSelectQuestion,
}) => {
  const totalQuestions = questions.length;

  return (
    <div className="max-h-[50vh] overflow-y-auto space-y-6 pr-1 custom-scrollbar mb-6">
      {questions.map((q, qIdx) => {
        const qResult = submissionResult.questionResults.find((qr) => qr.questionId === q.id);
        const isCorrect = qResult?.isCorrect ?? false;

        return (
          <div
            key={q.id}
            className="border-b border-[#1E2536] pb-5 space-y-3 cursor-pointer hover:bg-white/[0.01] p-2 rounded-lg transition-colors"
            onClick={() => onSelectQuestion(qIdx)}
          >
            <div className="flex items-center justify-between text-xs text-[#737F94]">
              <span className="font-mono font-medium">Question {qIdx + 1} of {totalQuestions}</span>
              <span className={`font-mono font-semibold ${isCorrect ? 'text-[#60A5FA]' : 'text-rose-400'}`}>
                {isCorrect ? '✓ Correct' : '× Incorrect'}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-[#F2F4F8]">
              {q.question}
            </h3>

            {q.codeSnippet && (
              <div className="bg-[#090D15] border border-[#171E2D] rounded-xl p-3 font-mono text-xs text-[#E2E8F0] overflow-x-auto whitespace-pre">
                {q.codeSnippet}
              </div>
            )}

            <div className="space-y-1.5">
              {q.options.map((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                const isCorrectOption = opt.id === q.correctOptionId;
                const isUserChoice = answers[q.id] === opt.id;

                let optStyle = 'bg-[#0B0F19] border-[#171E2D] text-[#99A3B5]';
                if (isCorrectOption) {
                  optStyle = 'bg-[#131F38] border-[#2563EB]/80 text-[#F2F4F8]';
                } else if (isUserChoice && !isCorrectOption) {
                  optStyle = 'bg-[#251218] border-rose-500/70 text-rose-200';
                }

                return (
                  <div
                    key={opt.id}
                    className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between ${optStyle}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#737F94]">{letter}</span>
                      <span>{opt.text}</span>
                    </div>
                    {isCorrectOption && (
                      <span className="text-[11px] font-medium text-[#60A5FA]">✓ Correct answer</span>
                    )}
                    {isUserChoice && !isCorrectOption && (
                      <span className="text-[11px] font-medium text-rose-400">× Your answer</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-[#090D15] rounded-lg p-3 text-xs text-[#99A3B5] leading-relaxed border border-[#171E2D]">
              {qResult?.explanation || q.explanation}
            </div>
          </div>
        );
      })}
    </div>
  );
};
