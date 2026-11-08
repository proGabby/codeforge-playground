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
      unlockedTopicIds: ['go-hello-world'],
      streakDays: 1,
      totalTimeSpentSeconds: 0,
      weakConcepts: [],
      lastActiveTopicId: 'go-hello-world',
      lastActiveExerciseId: 'go-hello-1',
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
                last_active_topic_id, last_active_exercise_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        streakDays: 1,
        totalTimeSpentSeconds: 0,
      };

      const userRes = await client.execute({
        sql: `SELECT streak_days, total_time_spent FROM users WHERE email = ?`,
        args: [email],
      });
      if (userRes.rows.length > 0) {
        progress.streakDays = Number(userRes.rows[0].streak_days) || 1;
        progress.totalTimeSpentSeconds = Number(userRes.rows[0].total_time_spent) || 0;
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
      // Update users table stats
      await client.execute({
        sql: `UPDATE users SET 
                streak_days = ?, 
                total_time_spent = ?,
                last_active = CURRENT_TIMESTAMP
              WHERE email = ?`,
        args: [
          progress.streakDays || 1,
          progress.totalTimeSpentSeconds || 0,
          email,
        ],
      });

      // Upsert user_progress
      await client.execute({
        sql: `INSERT INTO user_progress (
                email, completed_exercise_ids, failed_attempts_count, hints_used_count,
                unlocked_topic_ids, topic_progress, weak_concepts,
                last_active_topic_id, last_active_exercise_id, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(email) DO UPDATE SET
                completed_exercise_ids = excluded.completed_exercise_ids,
                failed_attempts_count = excluded.failed_attempts_count,
                hints_used_count = excluded.hints_used_count,
                unlocked_topic_ids = excluded.unlocked_topic_ids,
                topic_progress = excluded.topic_progress,
                weak_concepts = excluded.weak_concepts,
                last_active_topic_id = excluded.last_active_topic_id,
                last_active_exercise_id = excluded.last_active_exercise_id,
                updated_at = CURRENT_TIMESTAMP`,
        args: [
          email,
          JSON.stringify(progress.completedExerciseIds || []),
          JSON.stringify(progress.failedAttemptsCount || {}),
          JSON.stringify(progress.hintsUsedCount || {}),
          JSON.stringify(progress.unlockedTopicIds || ['go-hello-world']),
          JSON.stringify(progress.topicProgress || {}),
          JSON.stringify(progress.weakConcepts || []),
          progress.lastActiveTopicId || 'go-hello-world',
          progress.lastActiveExerciseId || 'go-hello-1',
        ],
      });

      return true;
    } catch (err) {
      console.error('[UserStore] Error saving progress:', err);
      return false;
    }
  }
}

