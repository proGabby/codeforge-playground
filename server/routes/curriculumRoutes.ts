import { Router } from 'express';
import { GO_CURRICULUM } from '../data/GoCurriculum';
import { PYTHON_CURRICULUM } from '../data/PythonCurriculum';
import { JAVASCRIPT_CURRICULUM } from '../data/JavaScriptCurriculum';
import { TYPESCRIPT_CURRICULUM } from '../data/TypeScriptCurriculum';

export const curriculumRouter = Router();

// Get available languages
curriculumRouter.get('/languages', (req, res) => {
  res.json({
    activeLanguage: 'go',
    languages: [
      { id: 'go', name: 'Go (Golang)', version: '1.22', enabled: true, icon: 'Go' },
      { id: 'python', name: 'Python', version: '3.9+', enabled: true, icon: 'Py' },
      { id: 'javascript', name: 'JavaScript', version: 'Node 22+ (ES2024)', enabled: true, icon: 'JS' },
      { id: 'typescript', name: 'TypeScript', version: '5.4+ (Node 22)', enabled: true, icon: 'TS' },
      { id: 'rust', name: 'Rust', version: '1.77', enabled: false, icon: 'RS' },
      { id: 'scala', name: 'Scala', version: '3.3', enabled: false, icon: 'SC' },
      { id: 'clojure', name: 'Clojure', version: '1.11', enabled: false, icon: 'CLJ' },
      { id: 'cpp', name: 'C++', version: 'C++20', enabled: false, icon: 'CPP' },
      { id: 'java', name: 'Java', version: 'Java 21', enabled: false, icon: 'JV' },
    ],
  });
});

// Get curriculum
curriculumRouter.get('/curriculum', (req, res) => {
  const languageId = (req.query.languageId as string)?.toLowerCase();
  if (languageId === 'typescript') {
    return res.json(TYPESCRIPT_CURRICULUM);
  }
  if (languageId === 'javascript') {
    return res.json(JAVASCRIPT_CURRICULUM);
  }
  if (languageId === 'python') {
    return res.json(PYTHON_CURRICULUM);
  }
  res.json(GO_CURRICULUM);
});

// Get exercise by ID
curriculumRouter.get('/exercises/:id', (req, res) => {
  const { id } = req.params;
  const languageId = (req.query.languageId as string)?.toLowerCase();
  const curriculums = [TYPESCRIPT_CURRICULUM, JAVASCRIPT_CURRICULUM, PYTHON_CURRICULUM, GO_CURRICULUM];

  // Put preferred language first if specified
    if (languageId === 'typescript') {
      curriculums.unshift(TYPESCRIPT_CURRICULUM);
    } else if (languageId === 'javascript') {
      curriculums.unshift(JAVASCRIPT_CURRICULUM);
    } else if (languageId === 'python') {
      curriculums.unshift(PYTHON_CURRICULUM);
    } else if (languageId === 'go') {
      curriculums.unshift(GO_CURRICULUM);
    }

    for (const curriculum of curriculums) {
      for (const topic of curriculum.topics) {
        const ex = topic.exercises.find((e) => e.id === id);
        if (ex) {
          return res.json({ topic, exercise: ex });
        }
      }
    }
    res.status(404).json({ error: 'Exercise not found' });
  });
