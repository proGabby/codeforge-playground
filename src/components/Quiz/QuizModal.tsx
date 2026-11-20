import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { QuizSubmissionResult } from '../../types';

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
  const [showAllAnswers, setShowAllAnswers] = useState(false);

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
    setShowAllAnswers(false);
  };

  const handleClose = () => {
    setIsQuizModalOpen(false);
    setAnswers({});
    setSubmissionResult(null);
    setCurrentQuestionIndex(0);
    setShowAllAnswers(false);
  };

  // Concept tag formatting
  const formatConceptTag = (tag?: string): string => {
    if (!tag) return 'related concept';
    return tag
      .replace(/^(go|py)-/, '')
      .replace(/-vs-/g, ' vs. ')
      .replace(/-/g, ' ');
  };

  // Revisit concept link determination
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
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-widest text-[#737F94] uppercase font-semibold">
            SECTION MILESTONE / {activeQuiz.languageId.toUpperCase()}
          </span>

          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 text-xs font-mono text-[#737F94] hover:text-[#F2F4F8] transition-colors py-0.5 px-1 rounded cursor-pointer"
            title="Close (esc)"
          >
            <span className="text-[11px] font-mono tracking-tight text-[#737F94]">esc</span>
            <span className="text-sm font-sans leading-none text-[#737F94]">×</span>
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-[26px] font-bold text-[#F2F4F8] mt-3 tracking-tight">
          A small check. A stronger foundation.
        </h2>

        {/* Subtitle Row */}
        <div className="flex items-center justify-between mt-2 mb-3 text-xs">
          <span className="text-[#737F94] font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions} · {submissionResult ? 'Review' : 'Active recall'}
          </span>
          <span className="font-mono font-semibold text-[#3B82F6]">
            +{activeQuiz.xpReward} XP
          </span>
        </div>

        {/* Segmented Progress Bar */}
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

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setShowAllAnswers(false);
                }}
                className={`h-1 flex-1 rounded-full transition-all ${segmentColor} hover:opacity-90 cursor-pointer`}
                title={`Question ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Main Body */}
        {showAllAnswers && submissionResult ? (
          /* ALL QUESTIONS REVIEW LIST VIEW */
          <div className="max-h-[50vh] overflow-y-auto space-y-6 pr-1 custom-scrollbar mb-6">
            {questions.map((q, qIdx) => {
              const qResult = submissionResult.questionResults.find((qr) => qr.questionId === q.id);
              return (
                <div key={q.id} className="border-b border-[#1E2536] pb-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#737F94]">
                    <span className="font-mono font-medium">Question {qIdx + 1} of {totalQuestions}</span>
                    <span className={`font-mono font-semibold ${qResult?.isCorrect ? 'text-[#60A5FA]' : 'text-rose-400'}`}>
                      {qResult?.isCorrect ? '✓ Correct' : '× Incorrect'}
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
                      const isCorrect = opt.id === q.correctOptionId;
                      const isUserChoice = answers[q.id] === opt.id;

                      let optStyle = 'bg-[#0B0F19] border-[#171E2D] text-[#99A3B5]';
                      if (isCorrect) {
                        optStyle = 'bg-[#131F38] border-[#2563EB]/80 text-[#F2F4F8]';
                      } else if (isUserChoice && !isCorrect) {
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
                          {isCorrect && (
                            <span className="text-[11px] font-medium text-[#60A5FA]">✓ Correct answer</span>
                          )}
                          {isUserChoice && !isCorrect && (
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
        ) : (
          /* SINGLE QUESTION VIEW (Matching Figma Mockup) */
          <>
            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-semibold text-[#F2F4F8] mb-4 tracking-tight leading-snug">
              {currentQ.question}
            </h3>

            {/* Code Snippet Box */}
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
                const letter = String.fromCharCode(65 + optIdx);
                const isSelected = answers[currentQ.id] === opt.id;

                if (submissionResult) {
                  // Review Mode State
                  const isCorrectOption = opt.id === currentQ.correctOptionId;
                  const isUserChoice = answers[currentQ.id] === opt.id;

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
                      key={opt.id}
                      className={`px-4 py-3.5 rounded-xl border flex items-center justify-between text-sm transition-all ${cardStyles}`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 pr-2">
                        {radioCircle}
                        <span className="text-xs font-mono text-[#737F94] w-4">{letter}</span>
                        <span className={`leading-relaxed ${isCorrectOption ? 'text-[#F2F4F8] font-medium' : ''}`}>
                          {opt.text}
                        </span>
                      </div>
                      {rightBadge}
                    </div>
                  );
                }

                // Active Taking Mode State
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`px-4 py-3.5 rounded-xl border cursor-pointer flex items-center justify-between text-sm transition-all ${
                      isSelected
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
                        {opt.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feedback / Mastery Card (Review Mode) */}
            {submissionResult && (
              <div className="bg-[#090D15] border border-[#171E2D] rounded-xl p-4 sm:p-5 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#F2F4F8]">
                    {submissionResult.correctCount} of {submissionResult.totalQuestions} correct
                  </span>
                  <span className="text-xs font-mono text-[#737F94] font-medium">
                    {submissionResult.scorePercent}% mastery
                  </span>
                </div>

                <p className="text-xs text-[#99A3B5] leading-relaxed mt-2.5">
                  {currentQResult?.explanation || currentQ.explanation}
                </p>

                {revisitConceptText && (
                  <button
                    type="button"
                    onClick={() => handleRevisit(revisitConceptText)}
                    className="text-xs font-medium text-[#60A5FA] hover:text-[#93C5FD] hover:underline cursor-pointer mt-3 inline-block text-left"
                  >
                    Revisit: {revisitConceptText}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-1">
          {submissionResult ? (
            /* Review Mode Footer */
            <>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowAllAnswers(!showAllAnswers)}
                  className="text-xs sm:text-sm text-[#737F94] hover:text-[#F2F4F8] transition-colors cursor-pointer"
                >
                  {showAllAnswers ? 'Single question view' : 'Review all answers'}
                </button>

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
