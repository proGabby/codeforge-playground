import React from 'react';
import { XCircle, Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GuidedCorrectionCard: React.FC = () => {
  const {
    submissionResult,
    activeHintLevel,
    setActiveHintLevel,
    learningMode,
  } = useApp();

  if (!submissionResult || submissionResult.success || !submissionResult.correction) {
    return null;
  }

  const { correction } = submissionResult;
  const hints = correction.graduatedHints || [];

  return (
    <div className="bg-slate-900 border-t border-rose-500/40 p-4 shadow-2xl relative overflow-hidden transition-all animate-in slide-in-from-bottom-4">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                ❌ Line {correction.lineIndex} Needs Correction
              </span>
              <span className="text-xs text-slate-400 font-medium">
                1 issue identified
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-100 mt-1">
              {correction.whatHappened}
            </h4>
          </div>
        </div>
      </div>

      {/* Explanation Details */}
      <div className="mt-3 bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p><strong className="text-slate-200">Why this happened:</strong> {correction.whyItHappened}</p>
        </div>

        {correction.howToFix && (
          <div className="flex items-start space-x-2 border-t border-slate-800/80 pt-2">
            <ArrowRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p><strong className="text-indigo-300">How to fix:</strong> {correction.howToFix}</p>
          </div>
        )}
      </div>

      {/* Graduated Progressive Hints Drawer */}
      {learningMode !== 'challenge' && hints.length > 0 && (
        <div className="mt-3 bg-indigo-950/40 rounded-xl p-3 border border-indigo-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-300 fill-amber-300/20 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-200">
                Tutor Hint ({Math.min(activeHintLevel + 1, hints.length)} of {hints.length})
              </span>
            </div>

            {activeHintLevel < hints.length - 1 && (
              <button
                onClick={() => setActiveHintLevel((prev) => prev + 1)}
                className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                <span>Give me another hint</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="mt-2 text-xs text-indigo-100 bg-indigo-900/30 p-2.5 rounded-lg border border-indigo-500/20 font-medium">
            💡 {hints[activeHintLevel] || hints[0]}
          </div>
        </div>
      )}
    </div>
  );
};
