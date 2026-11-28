import { Client } from '@libsql/client';
import { UserProgress } from '../../src/types';
import { SubmissionStore } from './submissionStore';

export class UserStore {
  public static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  public static createDefaultProgress(): UserProgress {
    return {
      completedExerciseIds: [],
      failedAttemptsCount: {},
      hintsUsedCount: {},
      topicProgress: {},
      unlockedTopicIds: ['go-hello-world', 'py-hello-world'],
      streakDays: 1,
      totalTimeSpentSeconds: 0,
      weakConcepts: [],
      lastActiveTopicId: 'go-hello-world',
      lastActiveExerciseId: 'go-hello-1',
      completedQuizIds: [],
      quizScores: {},
      xp: 0,
    };
  }

  public static async getOrCreateUser(
    client: Client,
    rawEmail: string
  ): Promise<{
    progress: UserProgress;
    solutions: Record<string, string>;
  }> {
    const email = this.normalizeEmail(rawEmail);

    // Upsert into users table
    await client.execute({
      sql: `INSERT INTO users (email) VALUES (?) 
            ON CONFLICT(email) DO UPDATE SET last_active = CURRENT_TIMESTAMP`,
      args: [email],
    });

    // Check if progress exists
    const progressResult = await client.execute({
      sql: `SELECT * FROM user_progress WHERE email = ?`,
      args: [email],
    });

    let progress: UserProgress;

    if (progressResult.rows.length === 0) {
      progress = this.createDefaultProgress();
      await client.execute({
        sql: `INSERT INTO user_progress (
                email, completed_exercise_ids, failed_attempts_count, hints_used_count,
                unlocked_topic_ids, topic_progress, weak_concepts,
        last_active_topic_id, last_active_exercise_id,
        completed_quiz_ids, quiz_scores
              ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          email,
          JSON.stringify(progress.completedExerciseIds),
          JSON.stringify(progress.failedAttemptsCount),
          JSON.stringify(progress.hintsUsedCount),
          JSON.stringify(progress.unlockedTopicIds),
          JSON.stringify(progress.topicProgress),
          JSON.stringify(progress.weakConcepts),
          progress.lastActiveTopicId,
          progress.lastActiveExerciseId,
          JSON.stringify(progress.completedQuizIds || []),
          JSON.stringify(progress.quizScores || {}),
        ],
      });
    } else {
      const row = progressResult.rows[0];
      progress = {
        completedExerciseIds: JSON.parse((row.completed_exercise_ids as string) || '[]'),
        failedAttemptsCount: JSON.parse((row.failed_attempts_count as string) || '{}'),
        hintsUsedCount: JSON.parse((row.hints_used_count as string) || '{}'),
        unlockedTopicIds: JSON.parse((row.unlocked_topic_ids as string) || '["go-hello-world"]'),
        topicProgress: JSON.parse((row.topic_progress as string) || '{}'),
        weakConcepts: JSON.parse((row.weak_concepts as string) || '[]'),
        lastActiveTopicId: (row.last_active_topic_id as string) || 'go-hello-world',
        lastActiveExerciseId: (row.last_active_exercise_id as string) || 'go-hello-1',
        lastCompletedDate: (row.last_completed_date as string) || undefined,
        completedQuizIds: JSON.parse((row.completed_quiz_ids as string) || '[]'),
        quizScores: JSON.parse((row.quiz_scores as string) || '{}'),
        streakDays: 1,
        totalTimeSpentSeconds: 0,
        xp: 0,
      };

      const userRes = await client.execute({
        sql: `SELECT streak_days, total_time_spent, xp FROM users WHERE email = ? `,
        args: [email],
      });
      if (userRes.rows.length > 0) {
        progress.streakDays = Number(userRes.rows[0].streak_days) || 1;
        progress.totalTimeSpentSeconds = Number(userRes.rows[0].total_time_spent) || 0;
        progress.xp = Number(userRes.rows[0].xp) || 0;
      }
    }

    // Auto-heal: Ensure any exercise marked passed in submissions is always reflected in completedExerciseIds
    const passedSubs = await client.execute({
      sql: `SELECT DISTINCT exercise_id FROM submissions WHERE email = ? AND passed = 1`,
      args: [email],
    });
    if (passedSubs.rows.length > 0) {
      const passedFromSubs = passedSubs.rows.map((r) => r.exercise_id as string);
      const healedCompleted = Array.from(new Set([...progress.completedExerciseIds, ...passedFromSubs]));
      if (healedCompleted.length > progress.completedExerciseIds.length) {
        progress.completedExerciseIds = healedCompleted;
        // Also persist healed progress back to DB
        await client.execute({
          sql: `UPDATE user_progress SET completed_exercise_ids = ? WHERE email = ?`,
          args: [JSON.stringify(healedCompleted), email],
        });
      }
    }

    // Load solutions
    const solutions = await SubmissionStore.getAllSolutions(client, email);

    return { progress, solutions };
  }

  public static async saveProgress(
    client: Client,
    rawEmail: string,
    progress: UserProgress
  ): Promise<boolean> {
    const email = this.normalizeEmail(rawEmail);

    try {
      // 1. Fetch existing user and progress records to perform a safe union merge
      const existingUserRes = await client.execute({
        sql: `SELECT streak_days, total_time_spent, xp FROM users WHERE email = ?`,
        args: [email],
      });

      const existingProgressRes = await client.execute({
        sql: `SELECT completed_exercise_ids, unlocked_topic_ids, topic_progress, weak_concepts, completed_quiz_ids, quiz_scores FROM user_progress WHERE email = ?`,
        args: [email],
      });

      // Also pull all passed submissions as a source of truth
      const passedSubs = await client.execute({
        sql: `SELECT DISTINCT exercise_id FROM submissions WHERE email = ? AND passed = 1`,
        args: [email],
      });
      const passedFromSubs = passedSubs.rows.map((r) => r.exercise_id as string);

      let mergedCompleted = progress.completedExerciseIds || [];
      let mergedUnlocked = progress.unlockedTopicIds || ['go-hello-world'];
      let mergedCompletedQuizzes = progress.completedQuizIds || [];
      let mergedQuizScores = progress.quizScores || {};
      let mergedTopicProgress = progress.topicProgress || {};
      let mergedStreak = progress.streakDays || 1;
      let mergedTotalTime = progress.totalTimeSpentSeconds || 0;
      let mergedXp = progress.xp || 0;

      if (existingUserRes.rows.length > 0) {
        const row = existingUserRes.rows[0];
        mergedStreak = Math.max(Number(row.streak_days) || 1, mergedStreak);
        mergedTotalTime = Math.max(Number(row.total_time_spent) || 0, mergedTotalTime);
        mergedXp = Math.max(Number(row.xp) || 0, mergedXp);
      }

      if (existingProgressRes.rows.length > 0) {
        const row = existingProgressRes.rows[0];
        const existingCompleted: string[] = JSON.parse((row.completed_exercise_ids as string) || '[]');
        const existingUnlocked: string[] = JSON.parse((row.unlocked_topic_ids as string) || '[]');
        const existingCompletedQuizzes: string[] = JSON.parse((row.completed_quiz_ids as string) || '[]');
        const existingQuizScores: Record<string, number> = JSON.parse((row.quiz_scores as string) || '{}');
        const existingTopicProgress: Record<string, any> = JSON.parse((row.topic_progress as string) || '{}');

        mergedCompleted = Array.from(new Set([...existingCompleted, ...mergedCompleted, ...passedFromSubs]));
        mergedUnlocked = Array.from(new Set([...existingUnlocked, ...mergedUnlocked]));
        mergedCompletedQuizzes = Array.from(new Set([...existingCompletedQuizzes, ...mergedCompletedQuizzes]));

        mergedQuizScores = { ...existingQuizScores };
        for (const [quizId, score] of Object.entries(progress.quizScores || {})) {
          mergedQuizScores[quizId] = Math.max(score, existingQuizScores[quizId] || 0);
        }

        mergedTopicProgress = { ...existingTopicProgress, ...mergedTopicProgress };
      } else if (passedFromSubs.length > 0) {
        mergedCompleted = Array.from(new Set([...mergedCompleted, ...passedFromSubs]));
      }

      // 2. Update users table stats (monotonic increase)
      await client.execute({
        sql: `UPDATE users SET
          streak_days = ?,
          total_time_spent = ?,
          xp = ?,
          last_active = CURRENT_TIMESTAMP
        WHERE email = ?`,
        args: [
          mergedStreak,
          mergedTotalTime,
          mergedXp,
          email,
        ],
      });

      // 3. Upsert user_progress with merged data
      await client.execute({
        sql: `INSERT INTO user_progress(
          email, completed_exercise_ids, failed_attempts_count, hints_used_count,
          unlocked_topic_ids, topic_progress, weak_concepts,
          last_active_topic_id, last_active_exercise_id, last_completed_date,
          completed_quiz_ids, quiz_scores, updated_at
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(email) DO UPDATE SET
          completed_exercise_ids = excluded.completed_exercise_ids,
          failed_attempts_count = excluded.failed_attempts_count,
          hints_used_count = excluded.hints_used_count,
          unlocked_topic_ids = excluded.unlocked_topic_ids,
          topic_progress = excluded.topic_progress,
          weak_concepts = excluded.weak_concepts,
          last_active_topic_id = excluded.last_active_topic_id,
          last_active_exercise_id = excluded.last_active_exercise_id,
          last_completed_date = COALESCE(excluded.last_completed_date, user_progress.last_completed_date),
          completed_quiz_ids = excluded.completed_quiz_ids,
          quiz_scores = excluded.quiz_scores,
          updated_at = CURRENT_TIMESTAMP`,
        args: [
          email,
          JSON.stringify(mergedCompleted),
          JSON.stringify(progress.failedAttemptsCount || {}),
          JSON.stringify(progress.hintsUsedCount || {}),
          JSON.stringify(mergedUnlocked),
          JSON.stringify(mergedTopicProgress),
          JSON.stringify(progress.weakConcepts || []),
          progress.lastActiveTopicId || 'go-hello-world',
          progress.lastActiveExerciseId || 'go-hello-1',
          progress.lastCompletedDate || null,
          JSON.stringify(mergedCompletedQuizzes),
          JSON.stringify(mergedQuizScores),
        ],
      });

      return true;
    } catch (err) {
      console.error('[UserStore] Error saving progress:', err);
      return false;
    }
  }
}

