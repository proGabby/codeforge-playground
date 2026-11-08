import { useState, useCallback } from 'react';
import type {
  ExecutionResult,
  Exercise,
  SubmissionResult,
  Topic,
  UserProgress,
} from '../types';

interface UseCodeExecutionProps {
  activeExercise: Exercise | null;
  activeTopicId: string;
  curriculum: Topic[];
  userEmail: string | null;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  setSavedSolutions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setHasAttemptedCurrentExercise: (attempted: boolean) => void;
}

export function useCodeExecution({
  activeExercise,
  activeTopicId,
  curriculum,
  userEmail,
  setUserProgress,
  setSavedSolutions,
  setHasAttemptedCurrentExercise,
}: UseCodeExecutionProps) {
  const [code, setCode] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const runCode = useCallback(async () => {
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
  }, [code, setHasAttemptedCurrentExercise]);

  const submitCode = useCallback(async () => {
    if (!code || !activeExercise) return;
    setIsExecuting(true);
    setHasAttemptedCurrentExercise(true);
    setActiveHintLevel(0);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          exerciseId: activeExercise.id,
          languageId: 'go',
          email: userEmail,
        }),
      });
      const data: SubmissionResult = await res.json();
      setSubmissionResult(data);
      setExecutionResult(data.execution);

      if (data.success) {
        // Cache solution locally and update saved solutions map
        setSavedSolutions((prev) => ({
          ...prev,
          [activeExercise.id]: code,
        }));

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
      setExecutionResult({
        stdout: '',
        stderr: err.message || 'Network error during submission evaluation',
        exitCode: 1,
        executionTimeMs: 0,
        compiledSuccessfully: false,
      });
    } finally {
      setIsExecuting(false);
    }
  }, [
    code,
    activeExercise,
    activeTopicId,
    curriculum,
    userEmail,
    setHasAttemptedCurrentExercise,
    setSavedSolutions,
    setUserProgress,
  ]);

  const resetExecutionState = useCallback(() => {
    setSubmissionResult(null);
    setExecutionResult(null);
    setActiveHintLevel(0);
  }, []);

  return {
    code,
    setCode,
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
  };
}

