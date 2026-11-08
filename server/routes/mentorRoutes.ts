import { Router } from 'express';
import { AdaptiveEngine } from '../engine/AdaptiveEngine';
import { GeminiMentorEngine } from '../engine/GeminiMentorEngine';

export const mentorRouter = Router();

// Adaptive recommendations
mentorRouter.post('/adaptive-recommendations', (req, res) => {
  const { userProgress } = req.body;
  const result = AdaptiveEngine.analyzeProgress(userProgress || { completedExerciseIds: [], failedAttemptsCount: {} });
  res.json(result);
});

// AI Mentor Socratic Tutor (Gemini API)
mentorRouter.post('/ai-mentor', async (req, res) => {
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

