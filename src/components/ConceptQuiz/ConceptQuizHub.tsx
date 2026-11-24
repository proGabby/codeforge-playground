import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Database,
  Server,
  Globe,
  Cpu,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Search,
  BookOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { EngineeringConceptQuiz, EngineeringDomain, ConceptDifficulty } from '../../types';

interface DomainFilterItem {
  id: 'all' | EngineeringDomain;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DOMAIN_FILTERS: DomainFilterItem[] = [
  { id: 'all', label: 'All Domains', icon: Layers },
  { id: 'system-design', label: 'System Design', icon: Layers },
  { id: 'databases', label: 'Databases & Storage', icon: Database },
  { id: 'devops-cloud', label: 'DevOps & Cloud', icon: Server },
  { id: 'networking', label: 'Networking', icon: Globe },
  { id: 'concurrency-distributed', label: 'Concurrency & Systems', icon: Cpu },
];

const DIFFICULTY_FILTERS: { id: 'all' | ConceptDifficulty; label: string }[] = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export const ConceptQuizHub: React.FC = () => {
  const { userProgress, startQuizById } = useApp();

  const [quizzes, setQuizzes] = useState<EngineeringConceptQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<'all' | EngineeringDomain>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | ConceptDifficulty>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [launchingQuizId, setLaunchingQuizId] = useState<string | null>(null);

  // Fetch concept quizzes from backend API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch('/api/concept-quizzes')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load concept quizzes');
        return res.json();
      })
      .then((data: EngineeringConceptQuiz[]) => {
        if (isMounted) {
          setQuizzes(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching concept quizzes:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartQuiz = async (quizId: string) => {
    setLaunchingQuizId(quizId);
    try {
      await startQuizById(quizId);
    } finally {
      setLaunchingQuizId(null);
    }
  };

  const completedQuizIds = useMemo(
    () => new Set(userProgress.completedQuizIds || []),
    [userProgress.completedQuizIds]
  );
  const quizScores = userProgress.quizScores || {};

  // Compute summary stats
  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce(
    (acc, q) => acc + ((q as any).questionCount ?? q.questions?.length ?? 3),
    0
  );
  const totalXpAvailable = quizzes.reduce((acc, q) => acc + (q.xpReward || 50), 0);
  const completedCount = quizzes.filter((q) => completedQuizIds.has(q.id)).length;

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      // Domain filter
      if (selectedDomain !== 'all' && quiz.domain !== selectedDomain) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && quiz.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = quiz.title.toLowerCase().includes(query);
        const matchesDesc = quiz.description.toLowerCase().includes(query);
        const matchesDomain = (quiz.domainLabel || quiz.domain).toLowerCase().includes(query);
        const matchesQuestions = quiz.questions?.some(
          (q) =>
            q.question.toLowerCase().includes(query) ||
            (q.conceptTag && q.conceptTag.toLowerCase().includes(query))
        );
        if (!matchesTitle && !matchesDesc && !matchesDomain && !matchesQuestions) {
          return false;
        }
      }
      return true;
    });
  }, [quizzes, selectedDomain, selectedDifficulty, searchQuery]);

  const getDomainIcon = (domain: EngineeringDomain) => {
    switch (domain) {
      case 'system-design':
        return Layers;
      case 'databases':
        return Database;
      case 'devops-cloud':
        return Server;
      case 'networking':
        return Globe;
      case 'concurrency-distributed':
        return Cpu;
      default:
        return Layers;
    }
  };

  const getDifficultyBadge = (difficulty: ConceptDifficulty) => {
    switch (difficulty) {
      case 'beginner':
        return {
          label: 'Beginner',
          classes: 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40',
        };
      case 'intermediate':
        return {
          label: 'Intermediate',
          classes: 'text-amber-400 bg-amber-950/40 border border-amber-800/40',
        };
      case 'advanced':
        return {
          label: 'Advanced',
          classes: 'text-indigo-400 bg-indigo-950/40 border border-indigo-800/40',
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0B0E14] text-[#F2F4F8] select-none">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Overview */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1E2536] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#3B82F6] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Scenario Knowledge Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2F4F8]">
              Practical Engineering Quizzes
            </h1>
            <p className="text-sm text-[#99A3B5] leading-relaxed">
              Test your real-world system design, storage internals, cloud infrastructure, networking protocols,
              and distributed concurrency comprehension across beginner to advanced challenges.
            </p>
          </div>

          {/* Stat Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-[#0E121B] border border-[#1E2536] rounded-xl px-3.5 py-2.5 flex flex-col">
              <span className="text-[11px] text-[#737F94] font-medium">Quizzes</span>
              <span className="text-lg font-semibold text-[#F2F4F8]">{totalQuizzes}</span>
            </div>
            <div className="bg-[#0E121B] border border-[#1E2536] rounded-xl px-3.5 py-2.5 flex flex-col">
              <span className="text-[11px] text-[#737F94] font-medium">Scenarios</span>
              <span className="text-lg font-semibold text-[#F2F4F8]">{totalQuestions}</span>
            </div>
            <div className="bg-[#0E121B] border border-[#1E2536] rounded-xl px-3.5 py-2.5 flex flex-col">
              <span className="text-[11px] text-[#737F94] font-medium">Available XP</span>
              <span className="text-lg font-semibold text-[#3B82F6]">+{totalXpAvailable}</span>
            </div>
            <div className="bg-[#0E121B] border border-[#1E2536] rounded-xl px-3.5 py-2.5 flex flex-col">
              <span className="text-[11px] text-[#737F94] font-medium">Mastered</span>
              <span className="text-lg font-semibold text-emerald-400">
                {completedCount}/{totalQuizzes}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="space-y-4">
          {/* Domain Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DOMAIN_FILTERS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedDomain === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedDomain(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#3B82F6] text-white shadow-sm'
                      : 'bg-[#121620] text-[#99A3B5] hover:text-[#F2F4F8] hover:bg-[#1E2536] border border-[#1E2536]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Row: Search & Difficulty */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#737F94] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios, topics, or concepts (e.g. Raft, WAL, TLS)..."
                className="w-full bg-[#0E121B] border border-[#1E2536] rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F2F4F8] placeholder-[#737F94] focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737F94] hover:text-[#F2F4F8]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center bg-[#121620] p-1 rounded-lg border border-[#1E2536] self-start sm:self-auto">
              {DIFFICULTY_FILTERS.map((df) => {
                const isSelected = selectedDifficulty === df.id;
                return (
                  <button
                    key={df.id}
                    onClick={() => setSelectedDifficulty(df.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E2536] text-[#F2F4F8] shadow-sm'
                        : 'text-[#737F94] hover:text-[#99A3B5]'
                    }`}
                  >
                    {df.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#737F94]">Loading practical engineering quizzes...</span>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-[#0E121B] border border-[#1E2536] rounded-xl p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-[#737F94] mx-auto stroke-1" />
            <h3 className="text-sm font-semibold text-[#F2F4F8]">No quizzes matched your filters</h3>
            <p className="text-xs text-[#737F94] max-w-sm mx-auto">
              Try choosing another domain, resetting the difficulty filter, or clearing your search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121620] hover:bg-[#1E2536] border border-[#1E2536] text-xs font-medium text-[#F2F4F8] rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredQuizzes.map((quiz) => {
              const DomainIcon = getDomainIcon(quiz.domain);
              const diffBadge = getDifficultyBadge(quiz.difficulty);
              const isCompleted = completedQuizIds.has(quiz.id);
              const userScore = quizScores[quiz.id];
              const isLaunching = launchingQuizId === quiz.id;

              return (
                <div
                  key={quiz.id}
                  className="bg-[#0E121B] border border-[#1E2536] hover:border-[#2E3A52] rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group"
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Domain & Difficulty */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#99A3B5] font-medium">
                        <DomainIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{quiz.domainLabel}</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full ${diffBadge.classes}`}
                      >
                        {diffBadge.label}
                      </span>
                    </div>

                    {/* Quiz Title */}
                    <div>
                      <h3 className="text-base font-semibold text-[#F2F4F8] group-hover:text-[#3B82F6] transition-colors leading-snug">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-[#99A3B5] mt-1.5 leading-relaxed line-clamp-3">
                        {quiz.description}
                      </p>
                    </div>

                    {/* Metadata Row: Time, Questions, XP */}
                    <div className="flex items-center gap-3 pt-1 text-xs text-[#737F94]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{quiz.estimatedMinutes || 5} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{(quiz as any).questionCount ?? quiz.questions?.length ?? 3} questions</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#3B82F6] font-medium">
                        <Award className="w-3.5 h-3.5" />
                        <span>+{quiz.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="pt-5 mt-4 border-t border-[#1E2536]/80 flex items-center justify-between gap-3">
                    {isCompleted ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Passed ({userScore}%)</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#737F94]">Pass mark: {quiz.passingScorePercent}%</span>
                    )}

                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      disabled={isLaunching}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-[#121620] hover:bg-[#1E2536] text-[#F2F4F8] border border-[#1E2536]'
                          : 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-sm'
                      } ${isLaunching ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isLaunching ? (
                        <span>Loading...</span>
                      ) : isCompleted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake Quiz</span>
                        </>
                      ) : (
                        <>
                          <span>Start Quiz</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
