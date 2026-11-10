import { Router } from 'express';
import { LanguageRegistry } from '../adapters/LanguageAdapter';
import { GO_CURRICULUM } from '../data/GoCurriculum';
import { TursoStore } from '../store/TursoStore';

export const codeRouter = Router();

// Run code standalone
codeRouter.post('/run', async (req, res) => {
  const { code, files, languageId = 'go' } = req.body;
  const payload = files || code;
  const adapter = LanguageRegistry.get(languageId);
  if (!adapter) {
    return res.status(400).json({ error: `Unsupported language: ${languageId}` });
  }

  try {
    const result = await adapter.runCode(payload);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Execution error' });
  }
});

// Submit exercise code
codeRouter.post('/submit', async (req, res) => {
  const { code, files, exerciseId, languageId = 'go', email } = req.body;
  const payload = files || code;
  const adapter = LanguageRegistry.get(languageId);
  if (!adapter) {
    return res.status(400).json({ error: `Unsupported language: ${languageId}` });
  }

  let exercise = undefined;
  for (const topic of GO_CURRICULUM.topics) {
    const ex = topic.exercises.find((e) => e.id === exerciseId);
    if (ex) {
      exercise = ex;
      break;
    }
  }

  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  try {
    const result = await adapter.runTests(
      payload,
      exercise.type,
      exercise.testCases || [],
      exercise.concept
    );

    // If an email is provided, record the submission in Turso
    if (email && typeof email === 'string' && email.includes('@')) {
      const codeToRecord = typeof payload === 'string' ? payload : JSON.stringify({ files: payload });
      TursoStore.recordSubmission(
        email,
        exerciseId,
        codeToRecord,
        result.success,
        result.execution?.executionTimeMs || 0
      ).catch((err) => console.error('[TursoStore] Failed to record submission:', err));
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Submission evaluation error' });
  }
});

// Explain line
codeRouter.post('/explain-line', (req, res) => {
  const { code, lineNumber, languageId = 'go' } = req.body;
  const adapter = LanguageRegistry.get(languageId);
  if (!adapter) {
    return res.status(400).json({ error: `Unsupported language: ${languageId}` });
  }

  const explanation = adapter.explainLine(code, lineNumber || 1);
  res.json(explanation);
});

