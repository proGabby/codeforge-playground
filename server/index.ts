import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoAdapter } from './adapters/GoAdapter';
import { LanguageRegistry } from './adapters/LanguageAdapter';
import { TursoStore } from './store/TursoStore';
import { apiRouter } from './routes';

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[CodeForge Server] Listening on http://localhost:${PORT}`);
});
