import { createClient, Client } from '@libsql/client';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let clientInstance: Client | null = null;

export function getDbClient(): Client {
  if (!clientInstance) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (url && (url.startsWith('libsql://') || url.startsWith('https://') || url.startsWith('http://'))) {
      console.log(`[TursoStore] Connecting to Turso database: ${url}`);
      clientInstance = createClient({ url, authToken });
    } else {
      const dataDir = path.join(__dirname, '../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const dbPath = path.join(dataDir, 'codeforge.db');
      console.log(`[TursoStore] No TURSO_DATABASE_URL configured. Using local SQLite at file:${dbPath}`);
      clientInstance = createClient({ url: `file:${dbPath}` });
    }
  }
  return clientInstance;
}

