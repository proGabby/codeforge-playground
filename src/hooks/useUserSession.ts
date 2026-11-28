import { useState, useCallback } from 'react';
import type { UserProgress } from '../types';

export function useUserSession() {
  const [userEmail, setUserEmailState] = useState<string | null>(() => {
    return localStorage.getItem('codeforge_user_email') || null;
  });

  const [showEmailModal, setShowEmailModal] = useState<boolean>(() => {
    const hasEmail = Boolean(localStorage.getItem('codeforge_user_email'));
    const hasSkipped = Boolean(localStorage.getItem('codeforge_skipped_email'));
    return !hasEmail && !hasSkipped;
  });

  const [savedSolutions, setSavedSolutions] = useState<Record<string, string>>({});

  const syncUserWithTurso = useCallback(
    async (
      email: string,
      onProgressLoaded?: (progressUpdate: (prev: UserProgress) => UserProgress) => void
    ) => {
      try {
        const res = await fetch('/api/user/identify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (data.progress && onProgressLoaded) {
          onProgressLoaded((prev) => {
            const mergedCompleted = Array.from(
              new Set([...(prev.completedExerciseIds || []), ...(data.progress.completedExerciseIds || [])])
            );
            const mergedUnlocked = Array.from(
              new Set([...(prev.unlockedTopicIds || []), ...(data.progress.unlockedTopicIds || [])])
            );
            const mergedCompletedQuizzes = Array.from(
              new Set([...(prev.completedQuizIds || []), ...(data.progress.completedQuizIds || [])])
            );
            const mergedScores = { ...(prev.quizScores || {}), ...(data.progress.quizScores || {}) };

            const mergedProgress: UserProgress = {
              ...prev,
              ...data.progress,
              completedExerciseIds: mergedCompleted,
              unlockedTopicIds: mergedUnlocked,
              completedQuizIds: mergedCompletedQuizzes,
              quizScores: mergedScores,
              streakDays: Math.max(prev.streakDays || 1, data.progress.streakDays || 1),
              xp: Math.max(prev.xp || 0, data.progress.xp || 0),
            };

            // Immediately persist merged progress to localStorage so local storage is warm
            localStorage.setItem('codeforge_progress', JSON.stringify(mergedProgress));

            return mergedProgress;
          });
        }

        if (data.solutions) {
          setSavedSolutions(data.solutions);
        }
        return data;
      } catch (err) {
        console.error('Error syncing user with Turso:', err);
        return null;
      }
    },
    []
  );

  const setUserEmail = useCallback(
    async (
      email: string,
      onProgressLoaded?: (progressUpdate: (prev: UserProgress) => UserProgress) => void
    ) => {
      const cleanEmail = email.trim().toLowerCase();
      setUserEmailState(cleanEmail);
      localStorage.setItem('codeforge_user_email', cleanEmail);
      setShowEmailModal(false);
      await syncUserWithTurso(cleanEmail, onProgressLoaded);
    },
    [syncUserWithTurso]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem('codeforge_user_email');
    localStorage.removeItem('codeforge_skipped_email');
    setUserEmailState(null);
    setSavedSolutions({});
    setShowEmailModal(true);
  }, []);

  return {
    userEmail,
    showEmailModal,
    setShowEmailModal,
    savedSolutions,
    setSavedSolutions,
    syncUserWithTurso,
    setUserEmail,
    logoutUser,
  };
}

