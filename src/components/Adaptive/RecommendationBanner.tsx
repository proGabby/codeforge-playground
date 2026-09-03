import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecommendationBanner: React.FC = () => {
  const { recommendations, setActiveExerciseId } = useApp();

  if (!recommendations || recommendations.length === 0) return null;

  const rec = recommendations[0];

  return (
    <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border-b border-indigo-500/30 px-4 py-2 flex items-center justify-between text-xs text-indigo-200 animate-in fade-in">
      <div className="flex items-center space-x-2">
        <Target className="w-4 h-4 text-purple-400 animate-pulse" />
        <div>
          <span className="font-bold text-purple-300">Adaptive Learning Notice:</span>{' '}
          <span>You seem to be struggling with <strong className="text-amber-300">{rec.concept}</strong>. Let's practice with targeted exercises!</span>
        </div>
      </div>

      <button
        onClick={() => setActiveExerciseId(rec.exerciseId)}
        className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow transition-all cursor-pointer"
      >
        <span>Practice "{rec.title}"</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
