import { Client } from '@libsql/client';

export class SubmissionStore {
  public static async recordSubmission(
    client: Client,
    email: string,
    exerciseId: string,
    code: string,
    passed: boolean,
    executionTimeMs: number = 0
  ): Promise<boolean> {
    try {
      // 1. Record history row
      await client.execute({
        sql: `INSERT INTO submissions (email, exercise_id, code, passed, execution_time_ms)
              VALUES (?, ?, ?, ?, ?)`,
        args: [email, exerciseId, code, passed ? 1 : 0, executionTimeMs],
      });

      // 2. Save latest exercise state (if passed, mark completed; else in_progress)
      const status = passed ? 'completed' : 'in_progress';
      await client.execute({
        sql: `INSERT INTO exercise_state (email, exercise_id, code, status, updated_at)
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(email, exercise_id) DO UPDATE SET
                code = excluded.code,
                status = CASE WHEN exercise_state.status = 'completed' THEN 'completed' ELSE excluded.status END,
                updated_at = CURRENT_TIMESTAMP`,
        args: [email, exerciseId, code, status],
      });

      return true;
    } catch (err) {
      console.error('[SubmissionStore] Error recording submission:', err);
      return false;
    }
  }

  public static async saveDraft(
    client: Client,
    email: string,
    exerciseId: string,
    code: string
  ): Promise<boolean> {
    try {
      await client.execute({
        sql: `INSERT INTO exercise_state (email, exercise_id, code, status, updated_at)
              VALUES (?, ?, ?, 'in_progress', CURRENT_TIMESTAMP)
              ON CONFLICT(email, exercise_id) DO UPDATE SET
                code = excluded.code,
                updated_at = CURRENT_TIMESTAMP`,
        args: [email, exerciseId, code],
      });
      return true;
    } catch (err) {
      console.error('[SubmissionStore] Error saving draft:', err);
      return false;
    }
  }

  public static async getExerciseCode(
    client: Client,
    email: string,
    exerciseId: string
  ): Promise<string | null> {
    try {
      const res = await client.execute({
        sql: `SELECT code FROM exercise_state WHERE email = ? AND exercise_id = ?`,
        args: [email, exerciseId],
      });

      if (res.rows.length > 0) {
        return (res.rows[0].code as string) || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  public static async getAllSolutions(
    client: Client,
    email: string
  ): Promise<Record<string, string>> {
    const solutions: Record<string, string> = {};
    try {
      const res = await client.execute({
        sql: `SELECT exercise_id, code FROM exercise_state WHERE email = ?`,
        args: [email],
      });

      for (const row of res.rows) {
        solutions[row.exercise_id as string] = row.code as string;
      }
    } catch (err) {
      console.error('[SubmissionStore] Error loading solutions:', err);
    }
    return solutions;
  }
}

