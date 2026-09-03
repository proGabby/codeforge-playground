import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoAdapter } from './adapters/GoAdapter';
import { LanguageRegistry } from './adapters/LanguageAdapter';
import { GO_CURRICULUM } from './data/GoCurriculum';
import { AdaptiveEngine } from './engine/AdaptiveEngine';
import { GeminiMentorEngine } from './engine/GeminiMentorEngine';

const app = express();
app.use(cors());
app.use(express.json());

// Register language adapters
const goAdapter = new GoAdapter();
LanguageRegistry.register(goAdapter);

// Get languages
app.get('/api/languages', (req, res) => {
  res.json({
    activeLanguage: 'go',
    languages: [
      { id: 'go', name: 'Go (Golang)', version: '1.22', enabled: true, icon: 'Go' },
      { id: 'python', name: 'Python', version: '3.11', enabled: false, icon: 'Py' },
      { id: 'javascript', name: 'JavaScript', version: 'ES2024', enabled: false, icon: 'JS' },
      { id: 'rust', name: 'Rust', version: '1.77', enabled: false, icon: 'RS' },
      { id: 'typescript', name: 'TypeScript', version: '5.4', enabled: false, icon: 'TS' },
      { id: 'scala', name: 'Scala', version: '3.3', enabled: false, icon: 'SC' },
      { id: 'clojure', name: 'Clojure', version: '1.11', enabled: false, icon: 'CLJ' },
      { id: 'cpp', name: 'C++', version: 'C++20', enabled: false, icon: 'CPP' },
      { id: 'java', name: 'Java', version: 'Java 21', enabled: false, icon: 'JV' },
    ],
  });
});

// Get curriculum
app.get('/api/curriculum', (req, res) => {
  res.json(GO_CURRICULUM);
});

// Get exercise by ID
app.get('/api/exercises/:id', (req, res) => {
  const { id } = req.params;
  for (const topic of GO_CURRICULUM.topics) {
    const ex = topic.exercises.find((e) => e.id === id);
    if (ex) {
      return res.json({ topic, exercise: ex });
    }
  }
  res.status(404).json({ error: 'Exercise not found' });
});

// Run code standalone
app.post('/api/run', async (req, res) => {
  const { code, languageId = 'go' } = req.body;
  const adapter = LanguageRegistry.get(languageId);
  if (!adapter) {
    return res.status(400).json({ error: `Unsupported language: ${languageId}` });
  }

  try {
    const result = await adapter.runCode(code);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Execution error' });
  }
});

// Submit exercise code
app.post('/api/submit', async (req, res) => {
  const { code, exerciseId, languageId = 'go' } = req.body;
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
    const result = await adapter.runTests(code, exercise.type, exercise.testCases || [], exercise.concept);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Submission evaluation error' });
  }
});

// Explain line
app.post('/api/explain-line', (req, res) => {
  const { code, lineNumber, languageId = 'go' } = req.body;
  const adapter = LanguageRegistry.get(languageId);
  if (!adapter) {
    return res.status(400).json({ error: `Unsupported language: ${languageId}` });
  }

  const explanation = adapter.explainLine(code, lineNumber || 1);
  res.json(explanation);
});

// Adaptive recommendations
app.post('/api/adaptive-recommendations', (req, res) => {
  const { userProgress } = req.body;
  const result = AdaptiveEngine.analyzeProgress(userProgress || { completedExerciseIds: [], failedAttemptsCount: {} });
  res.json(result);
});

// AI Mentor Socratic Tutor (Gemini API)
app.post('/api/ai-mentor', async (req, res) => {
  const { exerciseTitle, instructions, concept, userCode, stdout, stderr, question, chatHistory } = req.body;
  try {
    const answer = await GeminiMentorEngine.askMentor({
      exerciseTitle: exerciseTitle || 'Go Exercise',
      instructions: instructions || '',
      concept: concept || 'Go Syntax',
      userCode: userCode || '',
      stdout: stdout || '',
      stderr: stderr || '',
      question: question || 'Explain my code attempt',
      chatHistory: chatHistory || [],
    });
    res.json({ answer });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI Mentor error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[CodeForge Server] Listening on http://localhost:${PORT}`);
});
