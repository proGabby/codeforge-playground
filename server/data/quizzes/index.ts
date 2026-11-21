import type { SectionQuiz } from '../../../src/types';
import { GO_QUIZZES } from './goQuizzes';
import { PYTHON_QUIZZES } from './pythonQuizzes';
import { JAVASCRIPT_QUIZZES } from './jsQuizzes';
import { TYPESCRIPT_QUIZZES } from './tsQuizzes';

export { GO_QUIZZES, PYTHON_QUIZZES, JAVASCRIPT_QUIZZES, TYPESCRIPT_QUIZZES };

export const ALL_QUIZZES: SectionQuiz[] = [
  ...GO_QUIZZES,
  ...PYTHON_QUIZZES,
  ...JAVASCRIPT_QUIZZES,
  ...TYPESCRIPT_QUIZZES,
];

export function getQuizByTopicId(topicId: string, languageId?: string): SectionQuiz | undefined {
  if (languageId === 'typescript') {
    return TYPESCRIPT_QUIZZES.find((q) => q.topicId === topicId) ||
      ALL_QUIZZES.find((q) => q.topicId === topicId);
  }
  if (languageId === 'javascript') {
    return JAVASCRIPT_QUIZZES.find((q) => q.topicId === topicId) ||
      ALL_QUIZZES.find((q) => q.topicId === topicId);
  }
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
  const lang = languageId.toLowerCase();
  if (lang === 'typescript') {
    return TYPESCRIPT_QUIZZES;
  }
  if (lang === 'javascript') {
    return JAVASCRIPT_QUIZZES;
  }
  if (lang === 'python') {
    return PYTHON_QUIZZES;
  }
  return GO_QUIZZES;
}
