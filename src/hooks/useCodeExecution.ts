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
  const [files, setFilesState] = useState<Record<string, string>>({ 'main.go': '' });
  const [activeFileName, setActiveFileName] = useState<string>('main.go');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [activeHintLevel, setActiveHintLevel] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Active file code string
  const code = files[activeFileName] || '';

  const setCode = useCallback((newContent: string) => {
    setFilesState((prev) => ({
      ...prev,
      [activeFileName]: newContent,
    }));
  }, [activeFileName]);

  const setFiles = useCallback((newFiles: Record<string, string>, defaultActiveFile?: string) => {
    const keys = Object.keys(newFiles);
    const targetKey = defaultActiveFile && newFiles[defaultActiveFile] !== undefined
      ? defaultActiveFile
      : (newFiles['main.go'] !== undefined ? 'main.go' : (keys[0] || 'main.go'));
    setFilesState(newFiles);
    setActiveFileName(targetKey);
  }, []);

  const addFile = useCallback((rawName: string, initialContent = 'package main\n\n') => {
    let name = rawName.trim();
    if (!name) return;
    if (!name.endsWith('.go')) {
      name += '.go';
    }
    setFilesState((prev) => {
      if (prev[name] !== undefined) return prev;
      return { ...prev, [name]: initialContent };
    });
    setActiveFileName(name);
  }, []);

  const deleteFile = useCallback((name: string) => {
    if (name === 'main.go') return; // Cannot delete main.go entry point
    setFilesState((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setActiveFileName((current) => (current === name ? 'main.go' : current));
  }, []);

  const runCode = useCallback(async () => {
    if (!code && Object.keys(files).length === 0) return;
    setIsExecuting(true);
    setHasAttemptedCurrentExercise(true);
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, files, languageId: 'go' }),
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
  }, [code, files, setHasAttemptedCurrentExercise]);

  const submitCode = useCallback(async () => {
    if ((!code && Object.keys(files).length === 0) || !activeExercise) return;
    setIsExecuting(true);
    setHasAttemptedCurrentExercise(true);
    setActiveHintLevel(0);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          files,
          exerciseId: activeExercise.id,
          languageId: 'go',
          email: userEmail,
        }),
      });
      const data: SubmissionResult = await res.json();
      setSubmissionResult(data);
      setExecutionResult(data.execution);

      if (data.success) {
        // Cache solution locally (serialize multi-file if multiple exist)
        const solutionToSave = Object.keys(files).length > 1
          ? JSON.stringify({ files })
          : (files['main.go'] || code);

        setSavedSolutions((prev) => ({
          ...prev,
          [activeExercise.id]: solutionToSave,
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
    files,
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
  };
}
