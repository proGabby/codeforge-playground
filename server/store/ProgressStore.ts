import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { UserProgress } from '../../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const PROGRESS_FILE = path.join(DATA_DIR, 'user_progress_store.json');

export class ProgressStore {
  private static ensureStorageDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  /**
   * Retrieves user progress from server storage.
   */
  public static getProgress(userId: string = 'default-user'): UserProgress {
    this.ensureStorageDir();
    if (fs.existsSync(PROGRESS_FILE)) {
      try {
        const raw = fs.readFileSync(PROGRESS_FILE, 'utf-8');
        const store = JSON.parse(raw);
        return store[userId] || this.createDefaultProgress();
      } catch (err) {
        console.error('Error reading progress file:', err);
      }
    }
    return this.createDefaultProgress();
  }

  /**
   * Atomically saves user progress to disk to survive server crashes & restarts.
   */
  public static saveProgress(userId: string = 'default-user', progress: UserProgress): boolean {
    this.ensureStorageDir();
    try {
      let store: Record<string, UserProgress> = {};
      if (fs.existsSync(PROGRESS_FILE)) {
        try {
          store = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
        } catch {}
      }
      store[userId] = progress;

      // Atomic write to prevent file corruption
      const tempPath = `${PROGRESS_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf-8');
      fs.renameSync(tempPath, PROGRESS_FILE);
      return true;
    } catch (err) {
      console.error('Error persisting progress to disk:', err);
      return false;
    }
  }

  private static createDefaultProgress(): UserProgress {
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
}
