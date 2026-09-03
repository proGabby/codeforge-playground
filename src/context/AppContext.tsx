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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PROGRESS: UserProgress = {
  completedExerciseIds: [],
  failedAttemptsCount: {},
  hintsUsedCount: {},
  topicProgress: {},
  unlockedTopicIds: ['go-hello-world'],
  streakDays: 3,
  totalTimeSpentSeconds: 1240,
  weakConcepts: [],
  lastActiveTopicId: 'go-hello-world',
  lastActiveExerciseId: 'go-hello-1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [learningMode, setLearningMode] = useState<LearningMode>('guided');
  const [curriculum, setCurriculum] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string>('go-hello-world');
  const [activeExerciseId, setActiveExerciseId] = useState<string>('go-hello-1');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState<string>('');

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('codeforge_progress');
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);

  const [lineExplanation, setLineExplanation] = useState<LineExplanation | null>(null);
  const [selectedLineNumber, setSelectedLineNumber] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [weakConcepts, setWeakConcepts] = useState<string[]>([]);

  // AI Mentor State
  const [hasAttemptedCurrentExercise, setHasAttemptedCurrentExercise] = useState(false);
  const [chatMessages, setChatMessages] = useState<import('../types').ChatMessage[]>([]);
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Fetch Curriculum & Sync Server Progress on Startup
  useEffect(() => {
    // 1. Fetch Curriculum
    fetch('/api/curriculum')
      .then((res) => res.json())
      .then((data) => {
        setCurriculum(data.topics || []);
        if (data.topics && data.topics.length > 0) {
          const firstTopic = data.topics[0];
          const firstEx = firstTopic.exercises[0];
          if (firstEx) {
            setActiveExercise(firstEx);
            setCode(firstEx.starterCode);
          }
        }
      })
      .catch((err) => console.error('Error fetching curriculum:', err));

    // 2. Fetch Server Progress (Crash Resilience)
    fetch('/api/progress/default-user')
      .then((res) => res.json())
      .then((serverProgress) => {
        if (serverProgress && serverProgress.completedExerciseIds) {
          setUserProgress((prev) => {
            const mergedCompleted = Array.from(
              new Set([...prev.completedExerciseIds, ...serverProgress.completedExerciseIds])
            );
            const mergedUnlocked = Array.from(
              new Set([...prev.unlockedTopicIds, ...serverProgress.unlockedTopicIds])
            );
            return {
              ...prev,
              ...serverProgress,
              completedExerciseIds: mergedCompleted,
              unlockedTopicIds: mergedUnlocked,
            };
          });
        }
      })
      .catch(() => {});
  }, []);

  // Update localStorage & Server DB on progress changes
  useEffect(() => {
    localStorage.setItem('codeforge_progress', JSON.stringify(userProgress));

    // Sync to backend persistent store
    fetch('/api/progress/default-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: userProgress }),
    }).catch(() => {});

    // Adaptive recommendations check
    fetch('/api/adaptive-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProgress }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations || []);
        setWeakConcepts(data.weakConcepts || []);
      })
      .catch(() => {});
  }, [userProgress]);

  // Switch Active Exercise
  useEffect(() => {
    if (activeExerciseId && curriculum.length > 0) {
      for (const topic of curriculum) {
        const ex = (topic as any).exercises?.find((e: Exercise) => e.id === activeExerciseId);
        if (ex) {
          setActiveTopicId(topic.id);
          setActiveExercise(ex);
          setCode(ex.starterCode);
          setSubmissionResult(null);
          setExecutionResult(null);
          setActiveHintLevel(0);
          setLineExplanation(null);
          setSelectedLineNumber(null);
          setHasAttemptedCurrentExercise(false);
          setChatMessages([]);
          break;
        }
      }
    }
  }, [activeExerciseId, curriculum]);

  const activeTopic = curriculum.find((t) => t.id === activeTopicId) || null;

  const runCode = async () => {
    if (!code) return;
    setIsExecuting(true);
    setHasAttemptedCurrentExercise(true);
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, languageId: 'go' }),
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err.message || 'Network error',
        exitCode: 1,
        executionTimeMs: 0,
        compiledSuccessfully: false,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const submitCode = async () => {
    if (!code || !activeExercise) return;
    setIsExecuting(true);
    setHasAttemptedCurrentExercise(true);
    setActiveHintLevel(0);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, exerciseId: activeExercise.id, languageId: 'go' }),
      });
      const data: SubmissionResult = await res.json();
      setSubmissionResult(data);
      setExecutionResult(data.execution);

      if (data.success) {
        setUserProgress((prev) => {
          const completed = new Set(prev.completedExerciseIds);
          completed.add(activeExercise.id);

          const unlocked = new Set(prev.unlockedTopicIds);
          const currentTopicIndex = curriculum.findIndex((t) => t.id === activeTopicId);
          if (currentTopicIndex >= 0 && currentTopicIndex + 1 < curriculum.length) {
            unlocked.add(curriculum[currentTopicIndex + 1].id);
          }

          return {
            ...prev,
            completedExerciseIds: Array.from(completed),
            unlockedTopicIds: Array.from(unlocked),
          };
        });
        setShowCompletionModal(true);
      } else {
        setUserProgress((prev) => ({
          ...prev,
          failedAttemptsCount: {
            ...prev.failedAttemptsCount,
            [activeExercise.id]: (prev.failedAttemptsCount[activeExercise.id] || 0) + 1,
          },
        }));
      }
    } catch (err: any) {
      console.error('Submission error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const askAiMentor = async (question: string) => {
    if (!question.trim() || isAskingAi) return;
    const userMsg: import('../types').ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAskingAi(true);

    try {
      const res = await fetch('/api/ai-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseTitle: activeExercise?.title || 'Go Exercise',
          instructions: activeExercise?.instructions || '',
          concept: activeExercise?.concept || 'Go',
          userCode: code,
          stdout: executionResult?.stdout || '',
          stderr: executionResult?.stderr || '',
          question,
          chatHistory: chatMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });
      const data = await res.json();
      const aiMsg: import('../types').ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'I am here to guide you!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: import('../types').ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I ran into a network issue. Please try asking again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAskingAi(false);
    }
  };

  const explainSelectedLine = async (lineNum?: number) => {
    const lineToExplain = lineNum || selectedLineNumber || 1;
    try {
      const res = await fetch('/api/explain-line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, lineNumber: lineToExplain, languageId: 'go' }),
      });
      const data = await res.json();
      setLineExplanation(data);
    } catch (err) {
      console.error('Line explanation error:', err);
    }
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
