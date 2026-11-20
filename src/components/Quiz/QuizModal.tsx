import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { QuizSubmissionResult } from '../../types';
import { QuizHeader } from './QuizHeader';
import { QuizProgressBar } from './QuizProgressBar';
import { QuizQuestionCard } from './QuizQuestionCard';
import { QuizFeedbackCard } from './QuizFeedbackCard';
import { QuizSuccessPage } from './QuizSuccessPage';
import { QuizAllAnswersView } from './QuizAllAnswersView';

export type QuizViewMode = 'taking' | 'success' | 'review' | 'all_answers';

export const QuizModal: React.FC = () => {
  const {
    activeQuiz,
    isQuizModalOpen,
    setIsQuizModalOpen,
    submitQuiz,
    askAiMentor,
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);
  const [viewMode, setViewMode] = useState<QuizViewMode>('taking');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuizModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuizModalOpen]);

  if (!isQuizModalOpen || !activeQuiz) return null;

  const questions = activeQuiz.questions || [];
  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSelectOption = (optionId: string) => {
    if (submissionResult) return; // Locked once submitted
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await submitQuiz(activeQuiz.id, answers);
      if (res) {
        setSubmissionResult(res);
        if (res.passed) {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.5 },
          });
          setViewMode('success');
        } else {
          setViewMode('review');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmissionResult(null);
    setCurrentQuestionIndex(0);
    setViewMode('taking');
  };

  const handleClose = () => {
    setIsQuizModalOpen(false);
    setAnswers({});
    setSubmissionResult(null);
    setCurrentQuestionIndex(0);
    setViewMode('taking');
  };

  const formatConceptTag = (tag?: string): string => {
    if (!tag) return 'related concept';
    return tag
      .replace(/^(go|py)-/, '')
      .replace(/-vs-/g, ' vs. ')
      .replace(/-/g, ' ');
  };

  const missedResult = submissionResult?.questionResults.find((qr) => !qr.isCorrect);
  const missedQ = missedResult ? questions.find((q) => q.id === missedResult.questionId) : null;
  const revisitConceptTag = missedQ?.conceptTag || currentQ?.conceptTag;
  const revisitConceptText = formatConceptTag(revisitConceptTag);

  const handleRevisit = (concept: string) => {
    handleClose();
    if (askAiMentor) {
      const langLabel = activeQuiz.languageId === 'python' ? 'Python' : 'Go';
      askAiMentor(`Can you explain the concept of "${concept}" in ${langLabel} and show an example of how it works?`);
    }
  };

  const currentQResult = submissionResult?.questionResults.find(
    (qr) => qr.questionId === currentQ?.id
  );

  // If in Success Page view mode (Matching Figma Success Mockup)
  if (viewMode === 'success' && submissionResult) {
    return (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
        onClick={handleClose}
      >
        <QuizSuccessPage
          activeQuiz={activeQuiz}
          submissionResult={submissionResult}
          questions={questions}
          answers={answers}
          onClose={handleClose}
          onRetake={handleRetake}
          onGoToReview={() => setViewMode('review')}
          onAskMentor={handleRevisit}
        />
      </div>
    );
  }

  // Active Taking or Question Review View (Matching Figma Question Mockup)
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-[#0E121B] border border-[#1E2536] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-[#F2F4F8] relative overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Eyebrow Header */}
        <QuizHeader languageId={activeQuiz.languageId} onClose={handleClose} />

        {/* Title */}
        <h2 className="text-2xl sm:text-[26px] font-bold text-[#F2F4F8] mt-3 tracking-tight">
          A small check. A stronger foundation.
        </h2>

        {/* Subtitle Row */}
        <div className="flex items-center justify-between mt-2 mb-3 text-xs">
          <span className="text-[#737F94] font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions} ·{' '}
            {submissionResult ? 'Review' : 'Active recall'}
          </span>
          <span className="font-mono font-semibold text-[#3B82F6]">
            +{activeQuiz.xpReward} XP
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <QuizProgressBar
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          submissionResult={submissionResult}
          onSelectQuestion={(idx) => {
            setCurrentQuestionIndex(idx);
            if (viewMode === 'all_answers') setViewMode('review');
          }}
        />

        {/* Main Content Area */}
        {viewMode === 'all_answers' && submissionResult ? (
          <QuizAllAnswersView
            questions={questions}
            answers={answers}
            submissionResult={submissionResult}
            onSelectQuestion={(idx) => {
              setCurrentQuestionIndex(idx);
              setViewMode('review');
            }}
          />
        ) : (
          <>
            <QuizQuestionCard
              currentQ={currentQ}
              questionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              xpReward={activeQuiz.xpReward}
              isReviewMode={!!submissionResult}
              answers={answers}
              onSelectOption={handleSelectOption}
            />

            {/* Feedback / Mastery Card in Review Mode */}
            {submissionResult && (
              <QuizFeedbackCard
                correctCount={submissionResult.correctCount}
                totalQuestions={submissionResult.totalQuestions}
                scorePercent={submissionResult.scorePercent}
                explanation={currentQResult?.explanation || currentQ.explanation}
                revisitConceptText={revisitConceptText}
                onRevisit={handleRevisit}
              />
            )}
          </>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-1">
          {submissionResult ? (
            /* Review Mode Footer */
            <>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setViewMode(viewMode === 'all_answers' ? 'review' : 'all_answers')
                  }
                  className="text-xs sm:text-sm text-[#737F94] hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  {viewMode === 'all_answers' ? 'Single question view' : 'Review all answers'}
                </button>

                {submissionResult.passed && (
                  <button
                    type="button"
                    onClick={() => setViewMode('success')}
                    className="text-xs sm:text-sm text-[#737F94] hover:text-[#F2F4F8] transition-colors cursor-pointer"
                  >
                    View milestone summary
                  </button>
                )}

                {!submissionResult.passed && (
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="text-xs sm:text-sm text-[#737F94] hover:text-[#F2F4F8] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Active Taking Mode Footer */
            <>
              {currentQuestionIndex > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="text-xs sm:text-sm text-[#737F94] hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  ← Previous
                </button>
              ) : (
                <div />
              )}

              {isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !answers[currentQ.id]}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>{isSubmitting ? 'Grading...' : 'Submit milestone'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!answers[currentQ.id]}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Next question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
