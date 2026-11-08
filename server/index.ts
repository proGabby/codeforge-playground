import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoAdapter } from './adapters/GoAdapter';
import { LanguageRegistry } from './adapters/LanguageAdapter';
import { TursoStore } from './store/TursoStore';
import { apiRouter } from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database schema
TursoStore.init().catch((err) => {
  console.error('[TursoStore] Initialization warning:', err);
});

// Register language adapters
const goAdapter = new GoAdapter();
LanguageRegistry.register(goAdapter);

// Mount API routes
app.use('/api', apiRouter);

// Serve static frontend assets in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log(`[CodeForge Server] Serving static frontend from ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for all non-API GET requests (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[CodeForge Server] Listening on http://localhost:${PORT}`);
});
