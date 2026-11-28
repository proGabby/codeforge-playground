import { useState, useEffect, useRef } from 'react';
import type { UserProgress, SupportedLanguage } from '../types';
import { evaluateStreakStatus } from '../utils/streakUtils';

const INITIAL_PROGRESS: UserProgress = {
  completedExerciseIds: [],
  failedAttemptsCount: {},
  hintsUsedCount: {},
  topicProgress: {},
  unlockedTopicIds: ['go-hello-world', 'py-hello-world', 'js-hello-world', 'ts-hello-world'],
  streakDays: 0,
  totalTimeSpentSeconds: 0,
  weakConcepts: [],
  lastActiveTopicId: 'go-hello-world',
  lastActiveExerciseId: 'go-hello-1',
};

export function useProgressTracking(userEmail: string | null, selectedLanguage: SupportedLanguage = 'go') {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('codeforge_progress');
    const progress: UserProgress = saved ? JSON.parse(saved) : INITIAL_PROGRESS;
    const { streakDays } = evaluateStreakStatus(
      progress.streakDays || 0,
      progress.lastCompletedDate,
      progress.completedExerciseIds?.length || 0
    );
    return {
      ...progress,
      streakDays,
    };
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [weakConcepts, setWeakConcepts] = useState<string[]>([]);
  const prevEmailRef = useRef(userEmail);

  // Update localStorage & Turso on progress changes
  useEffect(() => {
    // If userEmail changed, wait for cloud identify/merge to complete before auto-saving
    if (prevEmailRef.current !== userEmail) {
      prevEmailRef.current = userEmail;
      return;
    }

    localStorage.setItem('codeforge_progress', JSON.stringify(userProgress));

    // Sync to Turso persistent store
    const emailToSync = userEmail || 'guest-user@codeforge.local';
    fetch(`/api/progress/${encodeURIComponent(emailToSync)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: userProgress }),
    }).catch(() => { });

    // Adaptive recommendations check
    fetch('/api/adaptive-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProgress, languageId: selectedLanguage }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations || []);
        setWeakConcepts(data.weakConcepts || []);
      })
      .catch(() => { });
  }, [userProgress, userEmail, selectedLanguage]);

  return {
    userProgress,
    setUserProgress,
    recommendations,
    weakConcepts,
  };
}

