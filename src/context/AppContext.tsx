import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  ExecutionResult,
  Exercise,
  LearningMode,
  LineExplanation,
  QuizSubmissionResult,
  SectionQuiz,
  SubmissionResult,
  Topic,
  UserProgress,
} from '../types';
import { useUserSession } from '../hooks/useUserSession';
import { useCurriculum } from '../hooks/useCurriculum';
import { useProgressTracking } from '../hooks/useProgressTracking';
import { useAiMentor } from '../hooks/useAiMentor';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { recordExerciseCompletionStreak } from '../utils/streakUtils';

interface AppContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  learningMode: LearningMode;
  setLearningMode: (mode: LearningMode) => void;
  selectedLanguage: 'go' | 'python';
  setSelectedLanguage: (lang: 'go' | 'python') => void;
  curriculum: Topic[];
  activeTopic: Topic | null;
  activeExercise: Exercise | null;
  setActiveTopicId: (topicId: string) => void;
  setActiveExerciseId: (exerciseId: string) => void;
  code: string;
  setCode: (code: string) => void;
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  submissionResult: SubmissionResult | null;
  activeHintLevel: number;
  setActiveHintLevel: React.Dispatch<React.SetStateAction<number>>;
  lineExplanation: LineExplanation | null;
  setLineExplanation: (exp: LineExplanation | null) => void;
  selectedLineNumber: number | null;
  setSelectedLineNumber: (line: number | null) => void;
  runCode: () => Promise<void>;
  submitCode: () => Promise<void>;
  explainSelectedLine: (lineNum?: number) => Promise<void>;
  showCompletionModal: boolean;
  setShowCompletionModal: (show: boolean) => void;
  recommendations: { exerciseId: string; title: string; topicId: string; concept: string }[];
  weakConcepts: string[];
  hasAttemptedCurrentExercise: boolean;
  chatMessages: import('../types').ChatMessage[];
  isAskingAi: boolean;
  askAiMentor: (question: string) => Promise<void>;

  // User Identity & Turso Cloud Sync
  userEmail: string | null;
  setUserEmail: (email: string) => Promise<void>;
  showEmailModal: boolean;
  setShowEmailModal: (show: boolean) => void;
  savedSolutions: Record<string, string>;
  logoutUser: () => void;

  // Multi-File Project Workspace
  files: Record<string, string>;
  activeFileName: string;
  setActiveFileName: (name: string) => void;
  addFile: (name: string, content?: string) => void;
  deleteFile: (name: string) => void;
  setFiles: (files: Record<string, string>, defaultActiveFile?: string) => void;

  // Section Quizzes
  activeQuiz: SectionQuiz | null;
  isQuizModalOpen: boolean;
  setIsQuizModalOpen: (open: boolean) => void;
  startTopicQuiz: (topicId: string) => Promise<void>;
  submitQuiz: (quizId: string, answers: Record<string, string>) => Promise<QuizSubmissionResult | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [learningMode, setLearningMode] = useState<LearningMode>('guided');

  // 1. User session & Turso persistence
  const {
    userEmail,
    showEmailModal,
    setShowEmailModal,
    savedSolutions,
    setSavedSolutions,
    syncUserWithTurso,
    setUserEmail: handleSetUserEmail,
    logoutUser,
  } = useUserSession();

  // 2. Curriculum navigation
  const {
    selectedLanguage,
    setSelectedLanguage,
    curriculum,
    activeTopicId,
    setActiveTopicId,
    activeExerciseId,
    setActiveExerciseId,
    activeTopic,
    activeExercise,
    setActiveExercise,
  } = useCurriculum();

  // 3. User progress tracking & adaptive engine
  const { userProgress, setUserProgress, recommendations, weakConcepts } =
    useProgressTracking(userEmail, selectedLanguage);

  // 4. Code execution & submission
  const {
    code,
    setCode,
    files,
    setFiles,
    activeFileName,
    setActiveFileName,
    addFile,
    deleteFile,
    isExecuting,
    executionResult,
    submissionResult,
    activeHintLevel,
    setActiveHintLevel,
    showCompletionModal,
    setShowCompletionModal,
    runCode,
    submitCode,
    resetExecutionState,
  } = useCodeExecution({
    activeExercise,
    activeTopicId,
    curriculum,
    userEmail,
    setUserProgress,
    setSavedSolutions,
    setHasAttemptedCurrentExercise: (attempted) => setHasAttemptedCurrentExercise(attempted),
    selectedLanguage,
  });

  // 5. AI Mentor & line explanations
  const {
    lineExplanation,
    setLineExplanation,
    selectedLineNumber,
    setSelectedLineNumber,
    explainSelectedLine,
    hasAttemptedCurrentExercise,
    setHasAttemptedCurrentExercise,
    chatMessages,
    isAskingAi,
    askAiMentor,
    resetExerciseAiState,
  } = useAiMentor(activeExercise, code, executionResult);

  // 6. Section Quizzes
  const [activeQuiz, setActiveQuiz] = useState<SectionQuiz | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);

  const startTopicQuiz = async (topicId: string) => {
    try {
      const res = await fetch(`/api/quizzes/topic/${topicId}?languageId=${selectedLanguage}`);
      if (res.ok) {
        const quiz: SectionQuiz = await res.json();
        setActiveQuiz(quiz);
        setIsQuizModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to load quiz for topic:', topicId, err);
    }
  };

  const submitQuiz = async (
    quizId: string,
    answers: Record<string, string>
  ): Promise<QuizSubmissionResult | null> => {
    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, answers, email: userEmail }),
      });
      if (res.ok) {
        const result: QuizSubmissionResult = await res.json();
        if (result.passed) {
          setUserProgress((prev) => {
            const completedQuizIds = Array.from(new Set([...(prev.completedQuizIds || []), result.quizId]));
            const quizScores = {
              ...(prev.quizScores || {}),
              [result.quizId]: Math.max(result.scorePercent, prev.quizScores?.[result.quizId] || 0),
            };
            const streakUpdate = recordExerciseCompletionStreak(prev.streakDays || 0, prev.lastCompletedDate);
            return {
              ...prev,
              completedQuizIds,
              quizScores,
              streakDays: streakUpdate.streakDays,
              lastCompletedDate: streakUpdate.lastCompletedDate,
              xp: (prev.xp || 0) + result.xpEarned,
            };
          });
        }
        return result;
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
    return null;
  };

  // Sync existing user email with Turso on initial mount
  useEffect(() => {
    const existingEmail = localStorage.getItem('codeforge_user_email');
    if (existingEmail) {
      syncUserWithTurso(existingEmail, setUserProgress).then((data) => {
        if (data?.solutions && activeExerciseId && data.solutions[activeExerciseId]) {
          const rawSol = data.solutions[activeExerciseId];
          const defaultFileName =
            activeExercise?.languageId === 'python' || selectedLanguage === 'python'
              ? 'main.py'
              : 'main.go';
          try {
            if (rawSol.startsWith('{"files":')) {
              const parsed = JSON.parse(rawSol);
              setFiles(parsed.files || { [defaultFileName]: rawSol });
            } else {
              setFiles({ [defaultFileName]: rawSol });
            }
          } catch {
            setFiles({ [defaultFileName]: rawSol });
          }
        }
      });
    }
  }, [syncUserWithTurso]);

  // Handle switching active exercises: restore code/files & reset transient UI states
  useEffect(() => {
    if (activeExerciseId && curriculum.length > 0) {
      for (const topic of curriculum) {
        const ex = (topic as any).exercises?.find((e: Exercise) => e.id === activeExerciseId);
        if (ex) {
          setActiveTopicId(topic.id);
          setActiveExercise(ex);

          const defaultFileName = ex.languageId === 'python' ? 'main.py' : 'main.go';

          // Restore previously saved answer from Turso/local cache if available
          const previousSolution = savedSolutions[ex.id];
          if (previousSolution) {
            try {
              if (previousSolution.startsWith('{"files":')) {
                const parsed = JSON.parse(previousSolution);
                setFiles(parsed.files || { [defaultFileName]: previousSolution });
              } else {
                setFiles({ [defaultFileName]: previousSolution });
              }
            } catch {
              setFiles({ [defaultFileName]: previousSolution });
            }
          } else if (ex.starterFiles && Object.keys(ex.starterFiles).length > 0) {
            setFiles(ex.starterFiles);
          } else {
            setFiles({ [defaultFileName]: ex.starterCode });
          }

          resetExecutionState();
          resetExerciseAiState();
          break;
        }
      }
    }
  }, [activeExerciseId, curriculum, savedSolutions, resetExecutionState, resetExerciseAiState]);

  const setUserEmail = async (email: string) => {
    await handleSetUserEmail(email, setUserProgress);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        learningMode,
        setLearningMode,
        selectedLanguage,
        setSelectedLanguage,
        curriculum,
        activeTopic,
        activeExercise,
        setActiveTopicId,
        setActiveExerciseId,
        code,
        setCode,
        userProgress,
        setUserProgress,
        isExecuting,
        executionResult,
        submissionResult,
        activeHintLevel,
        setActiveHintLevel,
        lineExplanation,
        setLineExplanation,
        selectedLineNumber,
        setSelectedLineNumber,
        runCode,
        submitCode,
        explainSelectedLine,
        showCompletionModal,
        setShowCompletionModal,
        recommendations,
        weakConcepts,
        hasAttemptedCurrentExercise,
        chatMessages,
        isAskingAi,
        askAiMentor,

        // User Identity & Turso Sync
        userEmail,
        setUserEmail,
        showEmailModal,
        setShowEmailModal,
        savedSolutions,
        logoutUser,

        // Multi-File Project Workspace
        files,
        setFiles,
        activeFileName,
        setActiveFileName,
        addFile,
        deleteFile,

        // Section Quizzes
        activeQuiz,
        isQuizModalOpen,
        setIsQuizModalOpen,
        startTopicQuiz,
        submitQuiz,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
