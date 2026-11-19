import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { QuizSubmissionResult } from '../../types';

export const QuizModal: React.FC = () => {
  const {
    activeQuiz,
    isQuizModalOpen,
    setIsQuizModalOpen,
    submitQuiz,
    userProgress,
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);

  if (!isQuizModalOpen || !activeQuiz) return null;

  const questions = activeQuiz.questions || [];
  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSelectOption = (optionId: string) => {
    if (submissionResult) return; // Do not modify once submitted
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
            particleCount: 100,
            spread: 80,
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
  };

  const handleClose = () => {
    setIsQuizModalOpen(false);
    setAnswers({});
    setSubmissionResult(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl text-slate-100 relative overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Top Gradient Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"></div>

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeQuiz.languageId === 'python' ? 'Python Section Quiz' : 'Go Section Quiz'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  +{activeQuiz.xpReward} XP
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                {activeQuiz.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-all"
            title="Close quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {!submissionResult ? (
            /* ACTIVE QUIZ QUESTION VIEW */
            <>
              {/* Progress Bar & Counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                  <span>{answeredCount} / {totalQuestions} Answered</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Statement */}
              <div className="space-y-3">
                <h3 className="text-base font-medium text-slate-100 leading-relaxed">
                  {currentQ.question}
                </h3>

                {/* Code Snippet block if present */}
                {currentQ.codeSnippet && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-200 overflow-x-auto shadow-inner">
                    <pre className="leading-5">
                      <code>{currentQ.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Options Cards */}
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 text-sm ${isSelected
                          ? 'border-indigo-500 bg-indigo-500/15 shadow-sm text-indigo-100 ring-1 ring-indigo-500/30'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono mt-0.5 flex-shrink-0 transition-all ${isSelected
                            ? 'border-indigo-400 bg-indigo-600 text-white font-bold'
                            : 'border-slate-700 text-slate-400'
                          }`}
                      >
                        {opt.id.toUpperCase()}
                      </div>
                      <span className="flex-1 select-none leading-relaxed font-normal">
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* SUBMISSION RESULTS & QUESTION REVIEW VIEW */
            <div className="space-y-6">
              {/* Score Banner */}
              <div
                className={`p-5 rounded-2xl border text-center space-y-3 ${submissionResult.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
              >
                <div className="flex justify-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${submissionResult.passed
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      }`}
                  >
                    {submissionResult.passed ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <HelpCircle className="w-8 h-8" />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-100">
                    {submissionResult.passed
                      ? 'Section Mastery Achieved! 🎉'
                      : 'Review & Try Again!'}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    You scored <span className="font-bold font-mono">{submissionResult.scorePercent}%</span> ({submissionResult.correctCount} / {submissionResult.totalQuestions} correct).
                    {submissionResult.passed
                      ? ` Passing threshold is ${activeQuiz.passingScorePercent}%.`
                      : ` Need ${activeQuiz.passingScorePercent}% to pass.`}
                  </p>
                </div>

                {/* XP & Streak Rewards */}
                {submissionResult.passed && (
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>+{submissionResult.xpEarned} XP Earned</span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Streak Maintained ({userProgress.streakDays} Days)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Detailed Answers & Explanations:
                </h4>

                <div className="space-y-3">
                  {submissionResult.questionResults.map((qr, idx) => {
                    const qObj = questions.find((q) => q.id === qr.questionId);
                    return (
                      <div
                        key={qr.questionId}
                        className={`p-4 rounded-xl border space-y-2.5 ${qr.isCorrect
                            ? 'bg-slate-950 border-emerald-500/30'
                            : 'bg-slate-950 border-rose-500/30'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-2">
                            {qr.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                            )}
                            <span className="text-xs font-medium text-slate-200">
                              <span className="font-bold text-slate-400">Q{idx + 1}: </span>
                              {qObj?.question}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase flex-shrink-0 ${qr.isCorrect
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              }`}
                          >
                            {qr.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        {/* Explanation Box */}
                        <div className="bg-slate-900/90 rounded-lg p-3 text-xs text-slate-300 border border-slate-800 space-y-1">
                          <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                            Key Concept:
                          </div>
                          <p className="leading-relaxed">{qr.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {!submissionResult ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {isLastQuestion ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || answeredCount === 0}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <span>{isSubmitting ? 'Grading...' : 'Submit Quiz'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center space-x-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 shadow-md shadow-emerald-500/20 flex items-center space-x-2 transition-all"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
