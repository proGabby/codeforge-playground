import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Check, Sparkles } from 'lucide-react';
import { QuizHeader } from './QuizHeader';
import type { QuizQuestion, QuizSubmissionResult, SectionQuiz } from '../../types';

interface QuizSuccessPageProps {
  activeQuiz: SectionQuiz;
  submissionResult: QuizSubmissionResult;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  onClose: () => void;
  onRetake: () => void;
  onGoToReview: () => void;
  onAskMentor?: (concept: string) => void;
}

export const QuizSuccessPage: React.FC<QuizSuccessPageProps> = ({
  activeQuiz,
  submissionResult,
  questions,
  answers,
  onClose,
  onRetake,
  onGoToReview,
  onAskMentor,
}) => {
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  // Focus question: default to the last question or the first missed question
  const lastQ = questions[questions.length - 1];
  const lastQResult = submissionResult.questionResults.find((qr) => qr.questionId === lastQ?.id);
  const selectedOptionId = answers[lastQ?.id] || '';
  const selectedOption = lastQ?.options.find((o) => o.id === selectedOptionId);
  const correctOption = lastQ?.options.find((o) => o.id === lastQ.correctOptionId);
  const isLastQCorrect = lastQResult?.isCorrect ?? (selectedOptionId === lastQ?.correctOptionId);

  // Extract concept label for QUESTION X / CONCEPT
  const getQuestionConceptLabel = (q: QuizQuestion): string => {
    if (q.conceptTag) {
      if (q.conceptTag.includes('iteration') || q.conceptTag.includes('loop')) return 'ITERATION';
      if (q.conceptTag.includes('header') || q.conceptTag.includes('memory')) return 'MEMORY';
      if (q.conceptTag.includes('reallocation') || q.conceptTag.includes('capacity')) return 'CAPACITY';
      if (q.conceptTag.includes('mutation') || q.conceptTag.includes('view')) return 'SLICING';
      const parts = q.conceptTag.replace(/^(go|py)-/, '').split('-');
      return parts[parts.length - 1].toUpperCase();
    }
    return 'SYNTAX';
  };

  // Concept deep-dive title
  const getConceptDeepDiveTitle = (): string => {
    if (activeQuiz.id === 'quiz-go-slices') {
      return 'Slices, range & the accumulator pattern';
    }
    if (lastQ?.conceptTag) {
      const cleaned = lastQ.conceptTag.replace(/^(go|py)-/, '').replace(/-/g, ' ');
      return `${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)} & pattern mechanics`;
    }
    return activeQuiz.description || 'Core language syntax and memory semantics';
  };

  const conceptTitle = getConceptDeepDiveTitle();
  const conceptCategory = getQuestionConceptLabel(lastQ);

  return (
    <div
      className="bg-[#0E121B] border border-[#1E2536] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-[#F2F4F8] relative overflow-hidden my-auto flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Eyebrow Header */}
      <QuizHeader languageId={activeQuiz.languageId} onClose={onClose} />

      {/* Center Hero Section */}
      <div className="flex flex-col items-center text-center mt-3 mb-6">
        {/* Milestone Complete Pill */}
        <div className="bg-[#0C241B] border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>Milestone complete</span>
        </div>

        {/* Confetti Sprinkles Graphic */}
        <div className="flex items-center justify-center gap-2 mt-2.5 mb-1 opacity-90 select-none">
          <span className="w-2 h-1 rounded-sm bg-[#3B82F6] -rotate-12 inline-block" />
          <span className="w-1.5 h-1 rounded-sm bg-[#67E8F9] rotate-45 inline-block" />
          <span className="w-2 h-1 rounded-sm bg-[#10B981] -rotate-45 inline-block" />
          <span className="w-1.5 h-1 rounded-sm bg-[#93C5FD] rotate-12 inline-block" />
          <span className="w-2 h-1 rounded-sm bg-[#3B82F6] -rotate-45 inline-block" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#F2F4F8] mt-2 tracking-tight">
          A stronger foundation.
        </h2>

        {/* Huge Percentage Score */}
        <div className="flex items-baseline justify-center mt-1">
          <span className="text-5xl sm:text-6xl font-extrabold text-[#F2F4F8] tracking-tight">
            {submissionResult.scorePercent}
          </span>
          <span className="text-2xl sm:text-3xl font-semibold text-[#737F94] ml-1">
            %
          </span>
        </div>

        {/* Subtitle */}
        <div className="text-xs sm:text-sm mt-2 flex items-center justify-center gap-2 text-[#F2F4F8]">
          <span>
            {submissionResult.correctCount} of {submissionResult.totalQuestions} correct
          </span>
          <span className="text-[#737F94]">·</span>
          <span className="font-mono font-bold text-[#10B981]">
            +{activeQuiz.xpReward} XP
          </span>
        </div>
      </div>

      {/* Card 1: Question Recap */}
      <div className="bg-[#0B0E16] border border-[#171E2D] rounded-xl p-5 mb-4 text-left">
        <div className="text-[11px] font-mono tracking-wider text-[#737F94] uppercase font-semibold">
          QUESTION {questions.length} / {conceptCategory}
        </div>

        <div className="text-sm font-semibold text-[#F2F4F8] mt-1.5">
          {selectedOption ? (
            isLastQCorrect ? (
              <span>You chose {selectedOption.text} — correct.</span>
            ) : (
              <span>
                You chose {selectedOption.text} — incorrect. Correct was {correctOption?.text}.
              </span>
            )
          ) : (
            <span>Question {questions.length} review</span>
          )}
        </div>

        <p className="text-xs text-[#99A3B5] leading-relaxed mt-2">
          {lastQResult?.explanation || lastQ.explanation}
        </p>
      </div>

      {/* Card 2: Concept Deep-Dive Accordion */}
      <div className="bg-[#0B0E16] border border-[#171E2D] rounded-xl p-5 mb-6 text-left transition-all">
        <div
          onClick={() => setIsDeepDiveOpen(!isDeepDiveOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div>
            <div className="text-sm font-semibold text-[#F2F4F8]">
              Concept deep-dive
            </div>
            <div className="text-xs text-[#737F94] mt-1 font-normal">
              {conceptTitle}
            </div>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-[#737F94] transition-transform duration-200 ${
              isDeepDiveOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isDeepDiveOpen && (
          <div className="mt-4 pt-3 border-t border-[#171E2D] space-y-3 animate-in fade-in">
            <p className="text-xs text-[#99A3B5] leading-relaxed">
              Mastering {conceptTitle.toLowerCase()} ensures your mental model matches real-world execution.
              In {activeQuiz.languageId === 'python' ? 'Python' : 'Go'}, idioms around this pattern avoid memory leaks,
              unnecessary allocations, and unexpected mutation bugs.
            </p>

            {onAskMentor && (
              <button
                type="button"
                onClick={() => onAskMentor(conceptTitle)}
                className="text-xs font-medium text-[#60A5FA] hover:text-[#93C5FD] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask AI Mentor to break down this pattern in depth</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onRetake}
            className="text-xs sm:text-sm text-[#737F94] hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            Try question again
          </button>

          <button
            type="button"
            onClick={onGoToReview}
            className="text-xs sm:text-sm text-[#737F94] hover:text-[#F2F4F8] transition-colors cursor-pointer"
          >
            Review questions
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue learning</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
