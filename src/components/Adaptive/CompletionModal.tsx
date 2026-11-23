import React, { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Check, CheckCircle2, ArrowRight, Flame, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Exercise } from '../../types';

export const CompletionModal: React.FC = () => {
  const {
    showCompletionModal,
    setShowCompletionModal,
    submissionResult,
    curriculum,
    activeExercise,
    setActiveExerciseId,
    userProgress,
    startTopicQuiz,
  } = useApp();

  const handleClose = useCallback(() => {
    setShowCompletionModal(false);
  }, [setShowCompletionModal]);

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCompletionModal) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCompletionModal, handleClose]);

  useEffect(() => {
    if (showCompletionModal) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [showCompletionModal]);

  if (!showCompletionModal || !activeExercise) return null;

  const concepts = submissionResult?.conceptsLearned || ['Syntax Mastery', 'Logic Flow'];
  const qualityNotes = submissionResult?.codeQualityNotes || [];

  // Find next exercise
  const findNextExerciseId = () => {
    let foundCurrent = false;
    for (const topic of curriculum) {
      const exercises = (topic as any).exercises || [];
      for (const ex of exercises) {
        if (foundCurrent) return ex.id;
        if (ex.id === activeExercise.id) foundCurrent = true;
      }
    }
    return null;
  };

  const nextExId = findNextExerciseId();

  // Check if current topic exercises are all completed
  const currentTopic = curriculum.find((t) => t.id === activeExercise.topicId);
  const topicExercises: Exercise[] = (currentTopic as any)?.exercises || [];
  const isTopicFinished =
    topicExercises.length > 0 &&
    topicExercises.every(
      (e) =>
        e.id === activeExercise.id || userProgress.completedExerciseIds.includes(e.id)
    );
  const isQuizPassed = (userProgress.completedQuizIds || []).includes(`quiz-${activeExercise.topicId}`);

  const handleContinue = () => {
    setShowCompletionModal(false);
    if (nextExId) {
      setActiveExerciseId(nextExId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0E121B] border border-[#1E2536] rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-[#F2F4F8] my-auto flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Eyebrow Header & Close Button */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-[#737F94] uppercase font-semibold">
            EXERCISE SOLVED
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

        {/* Hero Section: Icon + Title */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-11 h-11 rounded-xl bg-[#121620] border border-[#1E2536] flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-[#10B981] stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#F2F4F8] tracking-tight">
              Correct! All tests passed.
            </h2>
            <p className="text-xs text-[#99A3B5] font-normal truncate max-w-[280px]">
              {activeExercise.title}
            </p>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="bg-[#121620] border border-[#1E2536] rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0B0E14] border border-[#1E2536] flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F2F4F8]">
                {userProgress.streakDays} Day Streak
              </div>
              <div className="text-[11px] text-[#737F94]">
                Daily learning momentum maintained.
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#1E2536] text-[#99A3B5]">
            ACTIVE
          </span>
        </div>

        {/* Concepts Learned Card */}
        <div className="bg-[#121620] border border-[#1E2536] rounded-xl p-3.5 space-y-2">
          <div className="text-[10px] font-mono tracking-widest text-[#737F94] uppercase font-semibold">
            YOU JUST LEARNED
          </div>
          <div className="space-y-1.5 pt-0.5">
            {concepts.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#F2F4F8]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Quality Notes (if any) */}
        {qualityNotes.length > 0 && (
          <div className="bg-[#121620] border border-[#1E2536] rounded-xl p-3.5 space-y-1.5 text-xs">
            <div className="text-[10px] font-mono tracking-widest text-[#737F94] uppercase font-semibold">
              CODE QUALITY TIPS
            </div>
            <ul className="list-disc list-inside space-y-1 text-[#99A3B5]">
              {qualityNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section Mastery Milestone Card (if current topic finished & quiz not taken) */}
        {isTopicFinished && !isQuizPassed && (
          <div className="bg-[#121620] border border-[#1E2536] rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-[#3B82F6] font-mono font-semibold text-[10px] uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Section Mastery Milestone Unlocked</span>
            </div>
            <p className="text-xs text-[#99A3B5] leading-relaxed">
              You completed all exercises in <span className="text-[#F2F4F8] font-medium">{currentTopic?.title}</span>. Take the 3-minute quiz to test your comprehension and earn <span className="text-[#10B981] font-mono font-semibold">+50 XP</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowCompletionModal(false);
                startTopicQuiz(activeExercise.topicId);
              }}
              className="w-full py-2.5 bg-[#1E2536] hover:bg-[#253248] border border-[#2A344B] text-[#F2F4F8] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Take Section Quiz (+50 XP)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Continue Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-blue-500/10 active:scale-[0.99]"
          >
            <span>Continue to Next Exercise</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
