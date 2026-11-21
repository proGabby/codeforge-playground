import { Router } from 'express';
import { AdaptiveEngine } from '../engine/AdaptiveEngine';
import { GeminiMentorEngine } from '../engine/GeminiMentorEngine';

export const mentorRouter = Router();

// Adaptive recommendations
mentorRouter.post('/adaptive-recommendations', (req, res) => {
  const { userProgress, languageId } = req.body;
  const result = AdaptiveEngine.analyzeProgress(
    userProgress || { completedExerciseIds: [], failedAttemptsCount: {} },
    languageId
  );
  res.json(result);
});

// AI Mentor Socratic Tutor (Gemini API)
mentorRouter.post('/ai-mentor', async (req, res) => {
  const { exerciseTitle, instructions, concept, userCode, stdout, stderr, question, chatHistory, languageId } = req.body;
  const langId = languageId || 'go';
  const isTs = langId === 'typescript';
  const isJs = langId === 'javascript';
  const isPython = langId === 'python';
  try {
    const answer = await GeminiMentorEngine.askMentor({
      exerciseTitle:
      exerciseTitle ||
      (isTs
        ? 'TypeScript Exercise'
        : isJs
          ? 'JavaScript Exercise'
          : isPython
            ? 'Python Exercise'
            : 'Go Exercise'),
      instructions: instructions || '',
      concept:
      concept ||
      (isTs
        ? 'TypeScript Types & Syntax'
        : isJs
          ? 'JavaScript Syntax'
          : isPython
            ? 'Python Syntax'
            : 'Go Syntax'),
      userCode: userCode || '',
      stdout: stdout || '',
      stderr: stderr || '',
      question: question || 'Explain my code attempt',
      chatHistory: chatHistory || [],
      languageId: langId,
    });
res.json({ answer });
  } catch (err: any) {
  res.status(500).json({ error: err.message || 'AI Mentor error' });
}
});

