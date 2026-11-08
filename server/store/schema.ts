import { Client } from '@libsql/client';

let schemaInitPromise: Promise<void> | null = null;

export async function initSchema(client: Client): Promise<void> {
  if (schemaInitPromise) return schemaInitPromise;

  schemaInitPromise = (async () => {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
        streak_days INTEGER DEFAULT 1,
        total_time_spent INTEGER DEFAULT 0
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_progress (
        email TEXT PRIMARY KEY,
        completed_exercise_ids TEXT DEFAULT '[]',
        failed_attempts_count TEXT DEFAULT '{}',
        hints_used_count TEXT DEFAULT '{}',
        unlocked_topic_ids TEXT DEFAULT '["go-hello-world"]',
        topic_progress TEXT DEFAULT '{}',
        weak_concepts TEXT DEFAULT '[]',
        last_active_topic_id TEXT DEFAULT 'go-hello-world',
        last_active_exercise_id TEXT DEFAULT 'go-hello-1',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(email) REFERENCES users(email) ON DELETE CASCADE
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        code TEXT NOT NULL,
        passed INTEGER NOT NULL,
        execution_time_ms INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS exercise_state (
        email TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        code TEXT NOT NULL,
        status TEXT DEFAULT 'in_progress',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (email, exercise_id)
      );
    `);

    console.log('[TursoStore] Database schema verified and ready.');
  })();

  return schemaInitPromise;
}

