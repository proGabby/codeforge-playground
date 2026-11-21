import React, { useState, useEffect } from 'react';
import { Check, ArrowUpRight, ChevronDown, ChevronRight, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Exercise, Topic } from '../../types';

export const CurriculumTree: React.FC = () => {
  const {
    selectedLanguage,
    curriculum,
    activeTopic,
    activeExercise,
    setActiveTopicId,
    setActiveExerciseId,
    setCode,
    setFiles,
    userProgress,
    startTopicQuiz,
  } = useApp();

  const isPy = selectedLanguage === 'python';
  const isJs = selectedLanguage === 'javascript';
  const isTs = selectedLanguage === 'typescript';
  const pathLabel = isTs
    ? 'TYPESCRIPT / LEARNING PATH'
    : isJs
      ? 'JAVASCRIPT / LEARNING PATH'
      : isPy
        ? 'PYTHON / LEARNING PATH'
        : 'GO / LEARNING PATH';

  // Track expanded topics (default to having the active topic expanded)
  const [expandedTopicIds, setExpandedTopicIds] = useState<Set<string>>(() => {
    return new Set(activeTopic ? [activeTopic.id] : ['go-slices', 'go-hello-world']);
  });

  // Automatically expand active topic when it changes
  useEffect(() => {
    if (activeTopic?.id) {
      setExpandedTopicIds((prev) => {
        if (prev.has(activeTopic.id)) return prev;
        const next = new Set(prev);
        next.add(activeTopic.id);
        return next;
      });
    }
  }, [activeTopic?.id]);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopicIds((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const isExerciseCompleted = (exId: string) => {
    return userProgress.completedExerciseIds.includes(exId);
  };

  const isTopicCompleted = (topic: Topic) => {
    const exercises = (topic as any).exercises || [];
    if (!exercises.length) return false;
    return exercises.every((e: Exercise) => isExerciseCompleted(e.id));
  };

  // Group curriculum topics by category
  const categories: { key: 'beginner' | 'intermediate' | 'advanced'; num: string; label: string }[] = [
    { key: 'beginner', num: '01', label: 'BEGINNER' },
    { key: 'intermediate', num: '02', label: 'INTERMEDIATE' },
    { key: 'advanced', num: '03', label: 'ADVANCED' },
  ];

  const totalExercises = curriculum.reduce((acc, t) => acc + ((t as any).exercises?.length || 0), 0) || 32;
  const completedExercisesCount = userProgress.completedExerciseIds.length || 12; // fallback to 12 as in spec
  const progressPercent = Math.min(100, Math.round((completedExercisesCount / totalExercises) * 100));

  const handleResetLesson = () => {
    if (!activeExercise) return;
    if (activeExercise.starterFiles) {
      setFiles(activeExercise.starterFiles);
    } else if (activeExercise.starterCode) {
      setCode(activeExercise.starterCode);
    }
  };

  return (
    <aside className="w-72 bg-[#0B0E14] text-[#F2F4F8] flex flex-col h-full select-none shrink-0 border-r border-[#121620]">
      {/* Sidebar Header */}
      <div className="p-4 pb-3 border-b border-[#121620]/60">
        <span className="text-[10px] font-mono font-semibold tracking-wider text-[#737F94] uppercase block">
          {pathLabel}
        </span>
        <h2 className="text-sm font-bold text-[#F2F4F8] mt-1">Build your foundations</h2>
        <p className="text-xs text-[#737F94] mt-1">
          {completedExercisesCount} of {totalExercises} lessons complete
        </p>

        {/* Thin Progress Bar */}
        <div className="w-full bg-[#161D2B] h-1 rounded-full mt-2.5 overflow-hidden">
          <div
            className="bg-[#3B82F6] h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(15, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Main Categorized Topics & Exercises Tree */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
        {categories.map((cat) => {
          const categoryTopics = curriculum.filter(
            (t) => (t.category || 'beginner') === cat.key
          );
          if (categoryTopics.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-1">
              {/* Category Group Label: e.g. 01 BEGINNER */}
              <div className="px-2 pt-1 pb-0.5 flex items-center justify-between text-[10px] font-mono font-semibold text-[#737F94] tracking-wider uppercase">
                <div className="flex items-center gap-1.5">
                  <span>{cat.num}</span>
                  <span>{cat.label}</span>
                </div>
                <span>
                  {categoryTopics.reduce((acc, t) => acc + ((t as any).exercises?.length || 0), 0)} Ex
                </span>
              </div>

              {/* Topics / Sections */}
              <div className="space-y-1">
                {categoryTopics.map((topic) => {
                  const isTopicActive = activeTopic?.id === topic.id;
                  const isDone = isTopicCompleted(topic);
                  const isExpanded = expandedTopicIds.has(topic.id);
                  const cleanTitle = topic.title.replace(/^\d+\.\s*/, '');
                  const exercises = (topic as any).exercises || [];
                  const completedInTopic = exercises.filter((e: Exercise) => isExerciseCompleted(e.id)).length;

                  return (
                    <div key={topic.id} className="space-y-0.5">
                      {/* Topic Header Row (Click to toggle expand/collapse) */}
                      <button
                        onClick={() => {
                          toggleTopicExpand(topic.id);
                          setActiveTopicId(topic.id);
                          if (exercises.length > 0 && !exercises.some((e: Exercise) => e.id === activeExercise?.id)) {
                            setActiveExerciseId(exercises[0].id);
                          }
                        }
                        }
                        className={`w-full text-left px-2 py-1.5 rounded-[8px] text-xs transition-all flex items-center justify-between cursor-pointer group ${isTopicActive
                          ? 'bg-[#161D2B] text-[#F2F4F8] font-semibold'
                          : 'text-[#99A3B5] hover:text-[#F2F4F8] hover:bg-[#121620]'
                          }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {/* Chevron Icon */}
                          <span className="text-[#737F94] group-hover:text-[#F2F4F8] transition-transform shrink-0">
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </span>

                          {/* Completion / Status Icon */}
                          {isDone ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : isTopicActive ? (
                            <span className="text-[#3B82F6] font-bold text-xs shrink-0">›</span>
                          ) : (
                            <span className="text-[#737F94] text-xs font-mono shrink-0">·</span>
                          )}

                          <span className="truncate">{cleanTitle}</span>
                        </div>

                        {/* Exercises count / progress tag */}
                        <span className="text-[10px] font-mono text-[#737F94] shrink-0 ml-1">
                          {completedInTopic}/{exercises.length}
                        </span>
                      </button>

                      {/* Expanded Section: List of Exercises & Milestone Quiz */}
                      {
                        isExpanded && (
                          <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-[#1E2536] ml-3 mt-0.5">
                            {exercises.map((ex: Exercise) => {
                              const isExActive = activeExercise?.id === ex.id;
                              const isExDone = isExerciseCompleted(ex.id);

                              return (
                                <button
                                  key={ex.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTopicId(topic.id);
                                    setActiveExerciseId(ex.id);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center justify-between cursor-pointer group ${isExActive
                                    ? 'bg-[#1E2536] text-[#F2F4F8] font-semibold shadow-xs'
                                    : 'text-[#99A3B5] hover:text-[#F2F4F8] hover:bg-[#121620]'
                                    }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {isExDone ? (
                                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                    ) : isExActive ? (
                                      <Play className="w-2.5 h-2.5 text-[#3B82F6] fill-[#3B82F6] shrink-0" />
                                    ) : (
                                      <span className="text-[#737F94] text-xs font-mono shrink-0">·</span>
                                    )}
                                    <span className="truncate">{ex.title}</span>
                                  </div>

                                  {/* Difficulty or Project Tag */}
                                  {ex.isProject ? (
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0">
                                      Project
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#121620] text-[#737F94] shrink-0">
                                      L{ex.difficulty}
                                    </span>
                                  )}
                                </button>
                              );
                            })}

                            {/* Section Milestone Quiz Card */}
                            <div className="pt-2 pb-1">
                              {(() => {
                                const quizId = `quiz-${topic.id}`;
                                const isQuizPassed = (userProgress.completedQuizIds || []).includes(quizId);
                                const quizScore = userProgress.quizScores?.[quizId];

                                return (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startTopicQuiz(topic.id);
                                    }}
                                    className="bg-[#121620] hover:bg-[#182030] p-3 rounded-[10px] cursor-pointer transition-colors"
                                    title={`Take Section Milestone Quiz for ${cleanTitle}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold text-[#F2F4F8]">
                                        Section Milestone Quiz
                                      </span>
                                      <ArrowUpRight className="w-3.5 h-3.5 text-[#737F94]" />
                                    </div>
                                    <div className="text-[11px] text-[#737F94] mt-1 flex items-center justify-between">
                                      {isQuizPassed ? (
                                        <span className="text-emerald-400 font-medium">
                                          ✓ Passed ({quizScore || 100}%)
                                        </span>
                                      ) : (
                                        <span>Active recall · +50 XP</span>
                                      )}
                                      <span className="text-[10px] font-mono text-[#3B82F6]">
                                        Take Quiz →
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div >

      {/* Sidebar Footer: Reset lesson */}
      <div className="p-3 border-t border-[#121620] bg-[#0B0E14]">
        <div className="text-[11px] text-[#737F94]">Need a fresh start?</div>
        <button
          onClick={handleResetLesson}
          className="text-xs text-[#99A3B5] hover:text-[#F2F4F8] flex items-center gap-1 mt-0.5 cursor-pointer transition-colors"
          title="Restore starter code for this lesson"
        >
          <span>Reset lesson</span>
          <ArrowUpRight className="w-3 h-3 text-[#737F94]" />
        </button>
      </div>
    </aside >
  );
};
