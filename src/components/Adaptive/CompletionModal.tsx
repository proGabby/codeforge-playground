import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CompletionModal: React.FC = () => {
  const {
    showCompletionModal,
    setShowCompletionModal,
    submissionResult,
    curriculum,
    activeExercise,
    setActiveExerciseId,
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
