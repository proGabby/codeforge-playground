import { useState, useEffect, useCallback } from 'react';
import type { Exercise, Topic } from '../types';

  export function useCurriculum(
    defaultLanguage: 'go' | 'python' = (localStorage.getItem('codeforge_selected_language') as 'go' | 'python') || 'go'
  ) {
    const [selectedLanguage, setSelectedLanguageState] = useState<'go' | 'python'>(defaultLanguage);
    const [curriculum, setCurriculum] = useState<Topic[]>([]);
    const [activeTopicId, setActiveTopicId] = useState<string>('');
    const [activeExerciseId, setActiveExerciseId] = useState<string>('');
    const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

    const setSelectedLanguage = useCallback((lang: 'go' | 'python') => {
      setSelectedLanguageState(lang);
      localStorage.setItem('codeforge_selected_language', lang);
    }, []);

    // Fetch Curriculum when selectedLanguage changes
    useEffect(() => {
      fetch(`/api/curriculum?languageId=${selectedLanguage}`)
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
  }, [selectedLanguage]);

  const activeTopic = curriculum.find((t) => t.id === activeTopicId) || null;

  return {
    selectedLanguage,
    setSelectedLanguage,
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
