import { Client } from '@libsql/client';
import { UserProgress } from '../../src/types';
import { getDbClient } from './db';
import { initSchema } from './schema';
import { UserStore } from './userStore';
import { SubmissionStore } from './submissionStore';

export class TursoStore {
  public static getClient(): Client {
    return getDbClient();
  }

  public static async init(): Promise<void> {
    const client = this.getClient();
    return initSchema(client);
  }

  public static normalizeEmail(email: string): string {
    return UserStore.normalizeEmail(email);
  }

  public static async getOrCreateUser(rawEmail: string): Promise<{
    progress: UserProgress;
    solutions: Record<string, string>;
  }> {
    await this.init();
    return UserStore.getOrCreateUser(this.getClient(), rawEmail);
  }

  public static async getProgress(rawEmail: string): Promise<UserProgress> {
    const user = await this.getOrCreateUser(rawEmail);
    return user.progress;
  }

  public static async saveProgress(rawEmail: string, progress: UserProgress): Promise<boolean> {
    await this.init();
    return UserStore.saveProgress(this.getClient(), rawEmail, progress);
  }

  public static async recordSubmission(
    rawEmail: string,
    exerciseId: string,
    code: string,
    passed: boolean,
    executionTimeMs: number = 0
  ): Promise<boolean> {
    await this.init();
    const email = this.normalizeEmail(rawEmail);
    return SubmissionStore.recordSubmission(
      this.getClient(),
      email,
      exerciseId,
      code,
      passed,
      executionTimeMs
    );
  }

  public static async saveDraft(
    rawEmail: string,
    exerciseId: string,
    code: string
  ): Promise<boolean> {
    await this.init();
    const email = this.normalizeEmail(rawEmail);
    return SubmissionStore.saveDraft(this.getClient(), email, exerciseId, code);
  }

  public static async getExerciseCode(
    rawEmail: string,
    exerciseId: string
  ): Promise<string | null> {
    await this.init();
    const email = this.normalizeEmail(rawEmail);
    return SubmissionStore.getExerciseCode(this.getClient(), email, exerciseId);
  }

  public static async getAllSolutions(rawEmail: string): Promise<Record<string, string>> {
    await this.init();
    const email = this.normalizeEmail(rawEmail);
    return SubmissionStore.getAllSolutions(this.getClient(), email);
  }
}

export { getDbClient } from './db';
export { initSchema } from './schema';
export { UserStore } from './userStore';
export { SubmissionStore } from './submissionStore';
