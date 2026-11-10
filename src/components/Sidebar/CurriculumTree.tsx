import React from 'react';
import { CheckCircle2, Lock, PlayCircle, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Exercise } from '../../types';

export const CurriculumTree: React.FC = () => {
  const {
    curriculum,
    activeTopic,
    activeExercise,
    setActiveTopicId,
    setActiveExerciseId,
    userProgress,
  } = useApp();

  const isTopicUnlocked = (topicId: string) => {
    return userProgress.unlockedTopicIds.includes(topicId);
  };

  const isExerciseCompleted = (exId: string) => {
    return userProgress.completedExerciseIds.includes(exId);
  };

  const calculateTopicProgress = (exerciseIds: string[]) => {
    if (!exerciseIds.length) return 0;
    const done = exerciseIds.filter((id) => isExerciseCompleted(id)).length;
    return Math.round((done / exerciseIds.length) * 100);
  };

  const totalExerciseCount = curriculum.reduce((acc, t) => acc + ((t as any).exercises?.length || 0), 0);

  // Group topics by category
  const categories: { key: 'beginner' | 'intermediate' | 'advanced'; label: string; badgeColor: string }[] = [
    { key: 'beginner', label: 'BEGINNER PATH', badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { key: 'intermediate', label: 'INTERMEDIATE PATH', badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { key: 'advanced', label: 'ADVANCED PATH', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none overflow-hidden">
      {/* Skill Tree Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h2 className="font-semibold text-sm text-slate-200 uppercase tracking-wider">
            Go Skill Path
          </h2>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          {userProgress.completedExerciseIds.length} / {totalExerciseCount} Done
        </span>
      </div>

      {/* Categorized Topics List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        {categories.map((cat) => {
          const categoryTopics = curriculum.filter((t) => (t.category || 'beginner') === cat.key);
          if (categoryTopics.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-2">
              {/* Category Header Tag */}
              <div className="flex items-center justify-between px-1">
                <span className={`text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded border uppercase font-mono ${cat.badgeColor}`}>
                  {cat.label}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {categoryTopics.reduce((a, b) => a + ((b as any).exercises?.length || 0), 0)} Exercises
                </span>
              </div>

              {/* Category Topics */}
              <div className="space-y-2.5">
                {categoryTopics.map((topic) => {
                  const unlocked = isTopicUnlocked(topic.id);
                  const isActive = activeTopic?.id === topic.id;
                  const exercises = (topic as any).exercises || [];
                  const progressPercent = calculateTopicProgress(exercises.map((e: Exercise) => e.id));

                  return (
                    <div
                      key={topic.id}
                      className={`rounded-xl border transition-all ${
                        isActive
                          ? 'border-indigo-500/60 bg-slate-800/80 shadow-md shadow-indigo-500/10'
                          : unlocked
                          ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          : 'border-slate-800/40 bg-slate-900/20 opacity-60'
                      }`}
                    >
                      {/* Topic Header Row */}
                      <div
                        onClick={() => unlocked && setActiveTopicId(topic.id)}
                        className={`p-3 flex items-center justify-between cursor-pointer ${
                          !unlocked && 'cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                              progressPercent === 100
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : unlocked
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {progressPercent === 100 ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              topic.order
                            )}
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                              {topic.title}
                              {!unlocked && <Lock className="w-3 h-3 text-slate-500" />}
                            </h3>
                            <div className="w-24 bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400">
                          {exercises.length} Ex
                        </span>
                      </div>

                      {/* Sub-exercises list */}
                      {unlocked && (
                        <div className="px-2 pb-2.5 pt-1 space-y-1 border-t border-slate-800/50">
                          {exercises.map((ex: Exercise) => {
                            const isExActive = activeExercise?.id === ex.id;
                            const done = isExerciseCompleted(ex.id);

                            return (
                              <div
                                key={ex.id}
                                onClick={() => setActiveExerciseId(ex.id)}
                                className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all ${
                                  isExActive
                                    ? 'bg-indigo-600/20 text-indigo-200 font-medium border border-indigo-500/40'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                              >
                                <div className="flex items-center space-x-2 truncate">
                                  {done ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                  ) : (
                                    <PlayCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                                  )}
                                  <span className="truncate">{ex.title}</span>
                                </div>
                                {ex.isProject ? (
                                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex-shrink-0 animate-pulse">
                                    Project
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50 flex-shrink-0">
                                    L{ex.difficulty}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
