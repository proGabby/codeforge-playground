import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Trophy, ArrowRight, Sparkles, Flame, Award } from 'lucide-react';
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

  useEffect(() => {
    if (showCompletionModal) {
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 text-slate-100 relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500"></div>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Exercise Solved!
            </span>
            <h2 className="text-xl font-extrabold text-slate-100">
              ✓ Correct! All tests passed.
            </h2>
          </div>
        </div>

        {/* Daily Streak Highlight */}
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">
                {userProgress.streakDays} Day Streak!
              </div>
              <div className="text-[11px] text-slate-400">
                Daily learning momentum maintained.
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ACTIVE
          </span>
        </div>

        {/* Concepts Learned */}
        <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> You just learned:
          </h4>
          <div className="space-y-1.5 mt-2">
            {concepts.map((c, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Idiomatic Feedback */}
        {qualityNotes.length > 0 && (
          <div className="space-y-1 text-xs text-slate-400">
            <h5 className="font-semibold text-slate-300">Code Quality & Idiomatic Tips:</h5>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              {qualityNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section Mastery Milestone CTA */}
        {isTopicFinished && !isQuizPassed && (
          <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-indigo-500/20 border border-indigo-500/40 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Section Mastery Milestone Unlocked!</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You solved all exercises in <strong className="text-slate-100">{currentTopic?.title}</strong>. Take the quick 3-minute quiz to test your comprehension and earn <span className="text-emerald-400 font-bold font-mono">+50 XP</span>!
            </p>
            <button
              onClick={() => {
                setShowCompletionModal(false);
                startTopicQuiz(activeExercise.topicId);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-lg shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-1.5 transition-all"
            >
              <span>Take Section Quiz (+50 XP)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
        >
          <span>Continue to Next Exercise</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
