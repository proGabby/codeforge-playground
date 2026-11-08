import { Router } from 'express';
import { TursoStore } from '../store/TursoStore';

export const userRouter = Router();

// Identify or register user by email & retrieve progress + past solutions
userRouter.post('/user/identify', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  try {
    const userData = await TursoStore.getOrCreateUser(email);
    res.json(userData);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error identifying user' });
  }
});

// Get user progress
userRouter.get('/progress/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const progress = await TursoStore.getProgress(email);
    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching progress' });
  }
});

// Update user progress
userRouter.post('/progress/:email', async (req, res) => {
  const { email } = req.params;
  const { progress } = req.body;
  try {
    await TursoStore.saveProgress(email, progress);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error saving progress' });
  }
});

// Get saved code for an exercise
userRouter.get('/exercise-code/:exerciseId', async (req, res) => {
  const { exerciseId } = req.params;
  const email = req.query.email as string;
  if (!email) {
    return res.json({ code: null });
  }

  try {
    const code = await TursoStore.getExerciseCode(email, exerciseId);
    res.json({ code });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching exercise code' });
  }
});

// Auto-save draft code
userRouter.post('/exercise-draft', async (req, res) => {
  const { email, exerciseId, code } = req.body;
  if (!email || !exerciseId) {
    return res.status(400).json({ error: 'Email and exerciseId are required.' });
  }

  try {
    await TursoStore.saveDraft(email, exerciseId, code);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error saving draft' });
  }
});

