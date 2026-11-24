import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { QuizSubmissionResult, QuizQuestion } from '../../types';
import { QuizHeader } from './QuizHeader';
import { QuizProgressBar } from './QuizProgressBar';
import { QuizQuestionCard } from './QuizQuestionCard';
import { QuizFeedbackCard } from './QuizFeedbackCard';
import { QuizSuccessPage } from './QuizSuccessPage';
import { QuizAllAnswersView } from './QuizAllAnswersView';
import { RemediationDrawer } from './RemediationDrawer';

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
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, { isCorrect: boolean }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);
  const [viewMode, setViewMode] = useState<QuizViewMode>('taking');
  const [remediationTarget, setRemediationTarget] = useState<{
    question: QuizQuestion;
    selectedOptionId: string;
  } | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuizModalOpen) {
        if (remediationTarget) {
          setRemediationTarget(null);
          return;
        }
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuizModalOpen, remediationTarget]);

  if (!isQuizModalOpen || !activeQuiz) return null;

  const questions = activeQuiz.questions || [];
  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const isCurrentChecked = !!checkedQuestions[currentQ?.id];
  const isCurrentCorrect = checkedQuestions[currentQ?.id]?.isCorrect ?? false;

  const handleSelectOption = (optionId: string) => {
    if (submissionResult) return; // Locked once overall quiz submitted
    if (isCurrentChecked) return; // Locked once this question is checked
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleCheckCurrent = () => {
    if (!currentQ || !answers[currentQ.id]) return;
    const isCorrect = answers[currentQ.id] === currentQ.correctOptionId;
    setCheckedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: { isCorrect },
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
    setCheckedQuestions({});
    setSubmissionResult(null);
    setCurrentQuestionIndex(0);
    setViewMode('taking');
    setRemediationTarget(null);
  };

  const handleClose = () => {
    setIsQuizModalOpen(false);
    setAnswers({});
    setCheckedQuestions({});
    setSubmissionResult(null);
    setCurrentQuestionIndex(0);
    setViewMode('taking');
    setRemediationTarget(null);
  };

  const formatConceptTag = (tag?: string): string => {
    if (!tag) return 'software engineering concept';
    return tag
      .replace(/^(go|py|ts|js)-/, '')
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
      const langLabel =
        activeQuiz.languageId === 'python'
          ? 'Python'
          : activeQuiz.languageId === 'typescript'
          ? 'TypeScript'
          : activeQuiz.languageId === 'javascript'
          ? 'JavaScript'
          : activeQuiz.languageId === 'concept'
          ? 'modern software engineering'
          : 'Go';
      askAiMentor(`Can you explain the concept of "${concept}" in ${langLabel} and show an example of how it works?`);
    }
  };

  const currentQResult = submissionResult?.questionResults.find(
    (qr) => qr.questionId === currentQ?.id
  );

  // If in Success Page view mode (Matching Figma Success Mockup)
  if (viewMode === 'success' && submissionResult) {
    return (
      <>
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
            onOpenRemediation={() => {
              const firstMissed = submissionResult.questionResults.find((qr) => !qr.isCorrect);
              const targetQ = firstMissed
                ? questions.find((q) => q.id === firstMissed.questionId)
                : questions[questions.length - 1];
              if (targetQ) {
                setRemediationTarget({
                  question: targetQ,
                  selectedOptionId: answers[targetQ.id] || '',
                });
              }
            }}
          />
        </div>

        <RemediationDrawer
          isOpen={!!remediationTarget}
          quizId={activeQuiz.id}
          question={remediationTarget?.question || null}
          selectedOptionId={remediationTarget?.selectedOptionId || ''}
          onClose={() => setRemediationTarget(null)}
          onAskMentor={handleRevisit}
        />
      </>
    );
  }

  // Active Taking or Question Review View (Matching Figma Question Mockup)
  return (
    <>
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
            <div className="flex items-center gap-2">
              <span className="text-[#737F94] font-medium">
                Question {currentQuestionIndex + 1} of {totalQuestions} ·{' '}
                {submissionResult ? 'Review' : 'Active recall'}
              </span>
              {currentQ?.difficulty && (
                <span
                  className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                    currentQ.difficulty === 'easy'
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40'
                      : currentQ.difficulty === 'medium'
                      ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                      : 'text-indigo-400 bg-indigo-950/40 border border-indigo-800/40'
                  }`}
                >
                  {currentQ.difficulty}
                </span>
              )}
            </div>
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
            checkedQuestions={checkedQuestions}
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
              onOpenRemediation={(q, selOptId) => {
                setRemediationTarget({
                  question: q,
                  selectedOptionId: selOptId,
                });
              }}
            />
          ) : (
            <>
              <QuizQuestionCard
                currentQ={currentQ}
                questionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                xpReward={activeQuiz.xpReward}
                isReviewMode={!!submissionResult || isCurrentChecked}
                answers={answers}
                onSelectOption={handleSelectOption}
              />

              {/* Immediate Per-Question Check Feedback */}
              {!submissionResult && isCurrentChecked && (
                <div className="mb-5 animate-in fade-in duration-200">
                  {isCurrentCorrect ? (
                    <div className="bg-[#0A1A12] border border-emerald-500/30 rounded-xl p-3.5 sm:p-4 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px] font-bold">
                          ✓
                        </span>
                        <span>Spot on!</span>
                      </div>
                      <p className="text-[#99A3B5] leading-relaxed pl-7">
                        {currentQ.explanation}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#140F14] border border-rose-500/30 rounded-xl p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-rose-300">
                              Missed Concept Check
                            </span>
                            <span className="text-[11px] font-mono text-[#737F94]">
                              {formatConceptTag(currentQ.conceptTag)}
                            </span>
                          </div>
                          <p className="text-xs text-[#CBD5E1] leading-relaxed mt-1.5 mb-3.5">
                            {currentQ.explanation}
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setRemediationTarget({
                                  question: currentQ,
                                  selectedOptionId: answers[currentQ.id] || '',
                                });
                              }}
                              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1E2536] hover:bg-[#2A344B] border border-[#2A344B] hover:border-[#3B82F6]/60 text-xs font-semibold text-[#F2F4F8] hover:text-white transition-all cursor-pointer shadow-md group"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                              <span>Read Targeted Guide (3 min)</span>
                            </button>
                            <span className="text-[11px] text-[#737F94]">
                              or press Next to continue →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback / Mastery Card in Review Mode (after submission) */}
              {submissionResult && (
                <QuizFeedbackCard
                  correctCount={submissionResult.correctCount}
                  totalQuestions={submissionResult.totalQuestions}
                  scorePercent={submissionResult.scorePercent}
                  explanation={currentQResult?.explanation || currentQ.explanation}
                  isCorrect={currentQResult?.isCorrect}
                  revisitConceptText={revisitConceptText}
                  onRevisit={handleRevisit}
                  onOpenRemediation={() => {
                    setRemediationTarget({
                      question: currentQ,
                      selectedOptionId: answers[currentQ.id] || '',
                    });
                  }}
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

                {!isCurrentChecked ? (
                  <button
                    type="button"
                    onClick={handleCheckCurrent}
                    disabled={!answers[currentQ.id]}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Check answer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : isLastQuestion ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Grading...' : 'Submit milestone'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
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

      <RemediationDrawer
        isOpen={!!remediationTarget}
        quizId={activeQuiz.id}
        question={remediationTarget?.question || null}
        selectedOptionId={remediationTarget?.selectedOptionId || ''}
        onClose={() => setRemediationTarget(null)}
        onAskMentor={handleRevisit}
      />
    </>
  );
};
