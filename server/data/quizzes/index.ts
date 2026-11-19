import type { SectionQuiz } from '../../../src/types';
import { GO_QUIZZES } from './goQuizzes';
import { PYTHON_QUIZZES } from './pythonQuizzes';

export { GO_QUIZZES, PYTHON_QUIZZES };

export const ALL_QUIZZES: SectionQuiz[] = [
  ...GO_QUIZZES,
  ...PYTHON_QUIZZES,
];

export function getQuizByTopicId(topicId: string, languageId?: string): SectionQuiz | undefined {
  if (languageId === 'python') {
    return PYTHON_QUIZZES.find((q) => q.topicId === topicId) ||
      ALL_QUIZZES.find((q) => q.topicId === topicId);
  }
  if (languageId === 'go') {
    return GO_QUIZZES.find((q) => q.topicId === topicId) ||
      ALL_QUIZZES.find((q) => q.topicId === topicId);
  }
  return ALL_QUIZZES.find((q) => q.topicId === topicId);
}

export function getQuizById(quizId: string): SectionQuiz | undefined {
  return ALL_QUIZZES.find((q) => q.id === quizId);
}

export function getQuizzesForLanguage(languageId: string): SectionQuiz[] {
  if (languageId.toLowerCase() === 'python') {
    return PYTHON_QUIZZES;
  }
  return GO_QUIZZES;
}
