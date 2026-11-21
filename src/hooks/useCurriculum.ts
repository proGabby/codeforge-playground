import { useState, useEffect, useCallback } from 'react';
import type { Exercise, Topic, SupportedLanguage } from '../types';

export function useCurriculum(
  defaultLanguage: SupportedLanguage = (() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('codeforge_selected_language') : null;
    return saved === 'typescript' ? 'typescript' : saved === 'python' ? 'python' : saved === 'javascript' ? 'javascript' : 'go';
  })()
) {
  const sanitizeLang = (lang?: string | null): SupportedLanguage => {
    if (lang === 'typescript') return 'typescript';
    if (lang === 'python') return 'python';
    if (lang === 'javascript') return 'javascript';
    return 'go';
  };

  const initialLang: SupportedLanguage = sanitizeLang(defaultLanguage);
  const [selectedLanguage, setSelectedLanguageState] = useState<SupportedLanguage>(initialLang);
  const [curriculum, setCurriculum] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string>('');
  const [activeExerciseId, setActiveExerciseId] = useState<string>('');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const setSelectedLanguage = useCallback((lang: SupportedLanguage) => {
    const validLang = sanitizeLang(lang);
    setSelectedLanguageState(validLang);
    localStorage.setItem('codeforge_selected_language', validLang);
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
