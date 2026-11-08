import { useState, useEffect } from 'react';
import type { UserProgress } from '../types';

const INITIAL_PROGRESS: UserProgress = {
  completedExerciseIds: [],
  failedAttemptsCount: {},
  hintsUsedCount: {},
  topicProgress: {},
  unlockedTopicIds: ['go-hello-world'],
  streakDays: 1,
  totalTimeSpentSeconds: 0,
  weakConcepts: [],
  lastActiveTopicId: 'go-hello-world',
  lastActiveExerciseId: 'go-hello-1',
};

export function useProgressTracking(userEmail: string | null) {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('codeforge_progress');
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [weakConcepts, setWeakConcepts] = useState<string[]>([]);

  // Update localStorage & Turso on progress changes
  useEffect(() => {
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
      body: JSON.stringify({ userProgress }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations || []);
        setWeakConcepts(data.weakConcepts || []);
      })
      .catch(() => { });
  }, [userProgress, userEmail]);

  return {
    userProgress,
    setUserProgress,
    recommendations,
    weakConcepts,
  };
}

