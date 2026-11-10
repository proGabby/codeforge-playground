import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  ExecutionResult,
  Exercise,
  LearningMode,
  LineExplanation,
  SubmissionResult,
  Topic,
  UserProgress,
} from '../types';
import { useUserSession } from '../hooks/useUserSession';
import { useCurriculum } from '../hooks/useCurriculum';
import { useProgressTracking } from '../hooks/useProgressTracking';
import { useAiMentor } from '../hooks/useAiMentor';
import { useCodeExecution } from '../hooks/useCodeExecution';

interface AppContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  learningMode: LearningMode;
  setLearningMode: (mode: LearningMode) => void;
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
    useProgressTracking(userEmail);

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

  // Sync existing user email with Turso on initial mount
  useEffect(() => {
    const existingEmail = localStorage.getItem('codeforge_user_email');
    if (existingEmail) {
      syncUserWithTurso(existingEmail, setUserProgress).then((data) => {
        if (data?.solutions && activeExerciseId && data.solutions[activeExerciseId]) {
          const rawSol = data.solutions[activeExerciseId];
          try {
            if (rawSol.startsWith('{"files":')) {
              const parsed = JSON.parse(rawSol);
              setFiles(parsed.files || { 'main.go': rawSol });
            } else {
              setFiles({ 'main.go': rawSol });
            }
          } catch {
            setFiles({ 'main.go': rawSol });
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

          // Restore previously saved answer from Turso/local cache if available
          const previousSolution = savedSolutions[ex.id];
          if (previousSolution) {
            try {
              if (previousSolution.startsWith('{"files":')) {
                const parsed = JSON.parse(previousSolution);
                setFiles(parsed.files || { 'main.go': previousSolution });
              } else {
                setFiles({ 'main.go': previousSolution });
              }
            } catch {
              setFiles({ 'main.go': previousSolution });
            }
          } else if (ex.starterFiles && Object.keys(ex.starterFiles).length > 0) {
            setFiles(ex.starterFiles);
          } else {
            setFiles({ 'main.go': ex.starterCode });
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
