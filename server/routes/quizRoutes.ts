import { Router } from 'express';
import {
  getQuizByTopicId,
  getQuizById,
  getQuizzesForLanguage,
  ALL_QUIZZES,
  ENGINEERING_CONCEPT_QUIZZES,
  getEngineeringConceptQuizzes,
  CONCEPT_DOMAINS_METADATA,
} from '../data/quizzes';
import { TursoStore } from '../store/TursoStore';
import { recordExerciseCompletionStreak } from '../../src/utils/streakUtils';
import { QuizSubmissionResult, EngineeringDomain, ConceptDifficulty } from '../../src/types';

export const quizRouter = Router();

// ============================================================================
// Practical Engineering Concept Quizzes API
// ============================================================================

// 1. Get concept domain summary metadata
quizRouter.get('/concept-quizzes/domains', (_req, res) => {
  res.json(CONCEPT_DOMAINS_METADATA);
});

// 2. List concept quizzes with optional filtering by domain and difficulty
quizRouter.get('/concept-quizzes', (req, res) => {
  const domain = req.query.domain as EngineeringDomain | undefined;
  const difficulty = req.query.difficulty as ConceptDifficulty | undefined;

  const quizzes = getEngineeringConceptQuizzes(domain, difficulty);

  res.json(
    quizzes.map((q) => ({
      id: q.id,
      topicId: q.topicId,
      languageId: q.languageId,
      domain: q.domain,
      domainLabel: q.domainLabel,
      difficulty: q.difficulty,
      title: q.title,
      description: q.description,
      questionCount: q.questions.length,
      passingScorePercent: q.passingScorePercent,
      xpReward: q.xpReward,
      estimatedMinutes: q.estimatedMinutes,
    }))
  );
});

// 3. Get concept quiz by quiz ID (full quiz with questions)
quizRouter.get('/concept-quizzes/:quizId', (req, res) => {
  const { quizId } = req.params;
  const quiz = ENGINEERING_CONCEPT_QUIZZES.find((q) => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ error: `Concept quiz not found: ${quizId}` });
  }
  res.json(quiz);
});

// ============================================================================
// Standard Section Quizzes API
// ============================================================================

// 1. Get quiz by topic ID
quizRouter.get('/quizzes/topic/:topicId', (req, res) => {
  const { topicId } = req.params;
  const languageId = (req.query.languageId as string)?.toLowerCase();
  const quiz = getQuizByTopicId(topicId, languageId);
  if (!quiz) {
    return res.status(404).json({ error: `No quiz found for topic ${topicId}` });
  }
  res.json(quiz);
});

// 2. Get quiz by quiz ID
quizRouter.get('/quizzes/:quizId', (req, res) => {
  const { quizId } = req.params;
  const quiz = getQuizById(quizId);
  if (!quiz) {
    return res.status(404).json({ error: `Quiz not found: ${quizId}` });
  }
  res.json(quiz);
});

// 3. List quizzes for a language
quizRouter.get('/quizzes', (req, res) => {
  const languageId = (req.query.languageId as string)?.toLowerCase();
  const quizzes = languageId ? getQuizzesForLanguage(languageId) : ALL_QUIZZES;
  res.json(
    quizzes.map((q) => ({
      id: q.id,
      topicId: q.topicId,
      languageId: q.languageId,
      title: q.title,
      description: q.description,
      questionCount: q.questions.length,
      passingScorePercent: q.passingScorePercent,
      xpReward: q.xpReward,
    }))
  );
});

// 4. Submit quiz answers & evaluate
quizRouter.post('/quizzes/submit', async (req, res) => {
  const { quizId, answers, email } = req.body as {
    quizId: string;
    answers: Record<string, string>;
    email?: string;
  };

  const quiz = getQuizById(quizId);
  if (!quiz) {
    return res.status(404).json({ error: `Quiz ${quizId} not found` });
  }

  let correctCount = 0;
  const questionResults = quiz.questions.map((q) => {
    const selectedOptionId = answers ? answers[q.id] : '';
    const isCorrect = selectedOptionId === q.correctOptionId;
    if (isCorrect) {
      correctCount++;
    }
    return {
      questionId: q.id,
      selectedOptionId,
      correctOptionId: q.correctOptionId,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const totalQuestions = quiz.questions.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= quiz.passingScorePercent;
  const xpEarned = passed ? quiz.xpReward : 0;

  let streakUpdated = false;

  // Persist if email is supplied and passed
  if (email && passed) {
    try {
      const progress = await TursoStore.getProgress(email);
      const completedQuizIds = Array.from(new Set([...(progress.completedQuizIds || []), quiz.id]));
      const quizScores = {
        ...(progress.quizScores || {}),
        [quiz.id]: Math.max(scorePercent, progress.quizScores?.[quiz.id] || 0),
      };

      const streakResult = recordExerciseCompletionStreak(
        progress.streakDays || 0,
        progress.lastCompletedDate
      );
      streakUpdated = streakResult.streakIncreased;

      const updatedProgress = {
        ...progress,
        completedQuizIds,
        quizScores,
        streakDays: streakResult.streakDays,
        lastCompletedDate: streakResult.lastCompletedDate,
        xp: (progress.xp || 0) + xpEarned,
      };

      await TursoStore.saveProgress(email, updatedProgress);
    } catch (err) {
      console.error('[QuizRouter] Error updating user progress on quiz submission:', err);
    }
  }

  const result: QuizSubmissionResult = {
    quizId: quiz.id,
    topicId: quiz.topicId,
    scorePercent,
    passed,
    correctCount,
    totalQuestions,
    xpEarned,
    streakUpdated,
    questionResults,
  };

  res.json(result);
});
