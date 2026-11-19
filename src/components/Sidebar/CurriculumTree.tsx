import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
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
  const pathLabel = isPy ? 'PYTHON / LEARNING PATH' : 'GO / LEARNING PATH';

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
    <aside className="w-64 bg-[#0B0E14] text-[#F2F4F8] flex flex-col h-full select-none shrink-0 border-r border-[#121620]">
      {/* Sidebar Header */}
      <div className="p-4 pb-3">
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

      {/* Main Topics / Lessons List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 custom-scrollbar">
        {categories.map((cat) => {
          const categoryTopics = curriculum.filter(
            (t) => (t.category || 'beginner') === cat.key
          );
          if (categoryTopics.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-1.5">
              {/* Category Group Label: e.g. 01 BEGINNER */}
              <div className="px-2 pt-1 flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#737F94] tracking-wider uppercase">
                <span>{cat.num}</span>
                <span>{cat.label}</span>
              </div>

              {/* Topics / Lessons */}
              <div className="space-y-0.5">
                {categoryTopics.map((topic) => {
                  const isActive = activeTopic?.id === topic.id;
                  const isDone = isTopicCompleted(topic);
                  const cleanTitle = topic.title.replace(/^\d+\.\s*/, '');
                  const exercises = (topic as any).exercises || [];

                  return (
                    <div key={topic.id} className="space-y-0.5">
                      {/* Topic Row */}
                      <button
                        onClick={() => {
                          setActiveTopicId(topic.id);
                          if (exercises.length > 0) {
                            setActiveExerciseId(exercises[0].id);
                          }
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-[8px] text-xs transition-all flex items-center justify-between cursor-pointer group ${
                          isActive
                            ? 'bg-[#161D2B] text-[#F2F4F8] font-semibold'
                            : 'text-[#99A3B5] hover:text-[#F2F4F8] hover:bg-[#121620]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isActive ? (
                            <span className="text-[#3B82F6] font-bold text-xs">›</span>
                          ) : isDone ? (
                            <Check className="w-3.5 h-3.5 text-[#737F94] shrink-0" />
                          ) : (
                            <span className="text-[#737F94] text-xs font-mono shrink-0">·</span>
                          )}
                          <span className="truncate">{cleanTitle}</span>
                        </div>
                      </button>

                      {/* Section Milestone Quiz Card (pinned right under active topic in this category) */}
                      {isActive && (
                        <div className="pt-2 pb-1 px-1">
                          {(() => {
                            const quizId = `quiz-${topic.id}`;
                            const isQuizPassed = (userProgress.completedQuizIds || []).includes(quizId);

                            return (
                              <div
                                onClick={() => startTopicQuiz(topic.id)}
                                className="bg-[#121620] hover:bg-[#182030] p-3 rounded-[10px] cursor-pointer transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-[#F2F4F8]">
                                    Section Milestone Quiz
                                  </span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-[#737F94]" />
                                </div>
                                <div className="text-[11px] text-[#737F94] mt-1">
                                  {isQuizPassed ? (
                                    <span className="text-emerald-400 font-medium">✓ Completed</span>
                                  ) : (
                                    <span>Active recall · +50 XP</span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
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
    </aside>
  );
};
