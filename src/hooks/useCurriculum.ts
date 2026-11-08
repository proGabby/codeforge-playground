import { useState, useEffect } from 'react';
import type { Exercise, Topic } from '../types';

export function useCurriculum(initialTopicId = 'go-hello-world', initialExerciseId = 'go-hello-1') {
  const [curriculum, setCurriculum] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string>(initialTopicId);
  const [activeExerciseId, setActiveExerciseId] = useState<string>(initialExerciseId);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  // Fetch Curriculum on mount
  useEffect(() => {
    fetch('/api/curriculum')
      .then((res) => res.json())
      .then((data) => {
        const topics: Topic[] = data.topics || [];
        setCurriculum(topics);
        if (topics.length > 0) {
          const firstTopic = topics[0] as any;
          const firstEx = firstTopic.exercises?.[0];
          if (firstEx) {
            setActiveTopicId(firstTopic.id);
            setActiveExerciseId(firstEx.id);
            setActiveExercise(firstEx);
          }
        }
      })
      .catch((err) => console.error('Error fetching curriculum:', err));
  }, []);

  const activeTopic = curriculum.find((t) => t.id === activeTopicId) || null;

  return {
    curriculum,
    setCurriculum,
    activeTopicId,
    setActiveTopicId,
    activeExerciseId,
    setActiveExerciseId,
    activeTopic,
    activeExercise,
    setActiveExercise,
  };
}
