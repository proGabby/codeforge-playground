#!/usr/bin/env node

/**
 * clone-live-db.js
 * 
 * Clones all records from the live Turso cloud database into a local
 * SQLite file (server/data/codeforge.db).
 * 
 * After running this script, comment out TURSO_DATABASE_URL in .env
 * to run localhost completely isolated from the live cloud database.
 */

import 'dotenv/config';
import { createClient } from '@libsql/client';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const remoteUrl = process.env.TURSO_DATABASE_URL;
const remoteToken = process.env.TURSO_AUTH_TOKEN;

if (!remoteUrl || !remoteToken) {
  console.error('❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env to pull from live.');
  process.exit(1);
}

const dataDir = path.join(projectRoot, 'server', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const localDbPath = path.join(dataDir, 'codeforge.db');

async function connectWithFallback(primaryUrl, token) {
  const candidateUrls = [primaryUrl];

  // If the URL contains an AWS/region prefix like .aws-us-east-1.turso.io, try stripping it as a fallback
  if (primaryUrl.includes('.aws-') || primaryUrl.includes('.gcp-') || primaryUrl.includes('.azure-')) {
    const stripped = primaryUrl.replace(/\.(aws|gcp|azure)-[a-z0-9-]+\.turso\.io/, '.turso.io');
    if (!candidateUrls.includes(stripped)) {
      candidateUrls.push(stripped);
    }
  }

  // Also try https:// if libsql:// has local socket issues
  const currentHttps = primaryUrl.replace(/^libsql:\/\//, 'https://');
  if (!candidateUrls.includes(currentHttps)) {
    candidateUrls.push(currentHttps);
  }

  let lastError = null;
  for (const candidate of candidateUrls) {
    try {
      console.log(`📡 Connecting to Turso endpoint: ${candidate}...`);
      const client = createClient({ url: candidate, authToken: token });
      await client.execute('SELECT 1');
      console.log(`✅ Successfully connected to: ${candidate}`);
      return { client, activeUrl: candidate };
    } catch (err) {
      lastError = err;
      if (err.cause?.code === 'ENOTFOUND') {
        console.warn(`   ⚠️ DNS could not resolve ${candidate}`);
      } else {
        console.warn(`   ⚠️ Connection test failed for ${candidate}:`, err.message || err);
      }
    }
  }

  throw lastError;
}

async function cloneDatabase() {
  let remoteClient;
  let activeUrl = remoteUrl;

  try {
    const connection = await connectWithFallback(remoteUrl, remoteToken);
    remoteClient = connection.client;
    activeUrl = connection.activeUrl;
  } catch (err) {
    console.error('\n❌ Could not connect to Turso database:');
    if (err.cause?.code === 'ENOTFOUND') {
      console.error(`   Domain "${err.cause.hostname}" was not found by your DNS provider.`);
      console.error('\n💡 Troubleshooting Steps:');
      console.error('1. Check your Turso Dashboard at https://app.turso.io');
      console.error('2. Click on your database -> click "Connect" in the top-right.');
      console.error('3. Verify the URL matches what is in your .env:');
      console.error('   Expected format: libsql://<database-name>-<org-slug>.turso.io');
      console.error('   (For example: libsql://codeforgedb-iniwillie.turso.io)');
      console.error('4. Check if your organization name is slightly different (e.g. inimfonwillie vs iniwillie).');
    } else {
      console.error('  ', err.message || err);
    }
    process.exit(1);
  }

  const localClient = createClient({ url: `file:${localDbPath}` });

  // 1. Initialize Schema locally
  console.log('📦 Initializing local SQLite schema...');
  await localClient.execute(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
      streak_days INTEGER DEFAULT 1,
      total_time_spent INTEGER DEFAULT 0
    );
  `);

  await localClient.execute(`
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

  await localClient.execute(`
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

  await localClient.execute(`
    CREATE TABLE IF NOT EXISTS exercise_state (
      email TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      code TEXT NOT NULL,
      status TEXT DEFAULT 'in_progress',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (email, exercise_id)
    );
  `);

  // 2. Clone Users
  console.log('👤 Fetching users from live DB...');
  const usersRes = await remoteClient.execute('SELECT * FROM users');
  for (const row of usersRes.rows) {
    await localClient.execute({
      sql: `INSERT OR REPLACE INTO users (email, created_at, last_active, streak_days, total_time_spent)
            VALUES (?, ?, ?, ?, ?)`,
      args: [row.email, row.created_at, row.last_active, row.streak_days, row.total_time_spent],
    });
  }
  console.log(`   ✓ Copied ${usersRes.rows.length} users.`);

  // 3. Clone User Progress
  console.log('📈 Fetching user progress from live DB...');
  const progRes = await remoteClient.execute('SELECT * FROM user_progress');
  for (const row of progRes.rows) {
    await localClient.execute({
      sql: `INSERT OR REPLACE INTO user_progress (
              email, completed_exercise_ids, failed_attempts_count, hints_used_count,
              unlocked_topic_ids, topic_progress, weak_concepts,
              last_active_topic_id, last_active_exercise_id, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        row.email, row.completed_exercise_ids, row.failed_attempts_count, row.hints_used_count,
        row.unlocked_topic_ids, row.topic_progress, row.weak_concepts,
        row.last_active_topic_id, row.last_active_exercise_id, row.updated_at,
      ],
    });
  }
  console.log(`   ✓ Copied ${progRes.rows.length} progress records.`);

  // 4. Clone Submissions
  console.log('📝 Fetching submissions history from live DB...');
  const subRes = await remoteClient.execute('SELECT * FROM submissions');
  for (const row of subRes.rows) {
    await localClient.execute({
      sql: `INSERT OR REPLACE INTO submissions (id, email, exercise_id, code, passed, execution_time_ms, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [row.id, row.email, row.exercise_id, row.code, row.passed, row.execution_time_ms, row.created_at],
    });
  }
  console.log(`   ✓ Copied ${subRes.rows.length} submissions.`);

  // 5. Clone Exercise State
  console.log('💾 Fetching saved exercise code solutions from live DB...');
  const stateRes = await remoteClient.execute('SELECT * FROM exercise_state');
  for (const row of stateRes.rows) {
    await localClient.execute({
      sql: `INSERT OR REPLACE INTO exercise_state (email, exercise_id, code, status, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
      args: [row.email, row.exercise_id, row.code, row.status, row.updated_at],
    });
  }
  console.log(`   ✓ Copied ${stateRes.rows.length} exercise states/solutions.`);

  console.log('\n🎉 Live database clone complete!');
  console.log(`📁 Local SQLite database saved to: ${localDbPath}`);
  console.log('\n🔒 HOW TO RUN LOCALLY WITHOUT TOUCHING LIVE:');
  console.log('In your local .env, comment out or clear TURSO_DATABASE_URL:');
  console.log('   # TURSO_DATABASE_URL=...');
  console.log('   # TURSO_AUTH_TOKEN=...');
  console.log('CodeForge will automatically run against server/data/codeforge.db with zero live sync!');
}

cloneDatabase().catch((err) => {
  console.error('❌ Clone failed:', err);
  process.exit(1);
});

