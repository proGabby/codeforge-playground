import {
  GO_QUIZZES,
  PYTHON_QUIZZES,
  JAVASCRIPT_QUIZZES,
  TYPESCRIPT_QUIZZES,
  getQuizByTopicId,
  getQuizById,
  getQuizzesForLanguage,
} from '../server/data/quizzes';
import { quizRouter } from '../server/routes/quizRoutes';

async function testCurriculumQuizzesIntegration() {
  console.log('[Test] Verifying that playground curriculum quizzes are 100% intact...');

  // 1. Check array lengths and languages
  console.log(`[Test] GO_QUIZZES count: ${GO_QUIZZES.length}`);
  console.log(`[Test] PYTHON_QUIZZES count: ${PYTHON_QUIZZES.length}`);
  console.log(`[Test] JAVASCRIPT_QUIZZES count: ${JAVASCRIPT_QUIZZES.length}`);
  console.log(`[Test] TYPESCRIPT_QUIZZES count: ${TYPESCRIPT_QUIZZES.length}`);

  if (GO_QUIZZES.length !== 23) throw new Error(`Expected 23 Go quizzes, got ${GO_QUIZZES.length}`);
  if (PYTHON_QUIZZES.length !== 16) throw new Error(`Expected 16 Python quizzes, got ${PYTHON_QUIZZES.length}`);
  if (JAVASCRIPT_QUIZZES.length !== 6) throw new Error(`Expected 6 JS quizzes, got ${JAVASCRIPT_QUIZZES.length}`);
  if (TYPESCRIPT_QUIZZES.length !== 6) throw new Error(`Expected 6 TS quizzes, got ${TYPESCRIPT_QUIZZES.length}`);

  // 2. Test getQuizzesForLanguage
  const goList = getQuizzesForLanguage('go');
  if (goList.length !== 23 || !goList.every((q) => q.languageId === 'go')) {
    throw new Error('getQuizzesForLanguage(go) returned unexpected result');
  }

  const pyList = getQuizzesForLanguage('python');
  if (pyList.length !== 16 || !pyList.every((q) => q.languageId === 'python')) {
    throw new Error('getQuizzesForLanguage(python) returned unexpected result');
  }

  const jsList = getQuizzesForLanguage('javascript');
  if (jsList.length !== 6 || !jsList.every((q) => q.languageId === 'javascript')) {
    throw new Error('getQuizzesForLanguage(javascript) returned unexpected result');
  }

  const tsList = getQuizzesForLanguage('typescript');
  if (tsList.length !== 6 || !tsList.every((q) => q.languageId === 'typescript')) {
    throw new Error('getQuizzesForLanguage(typescript) returned unexpected result');
  }
  console.log('[Test] getQuizzesForLanguage() verified for all 4 playground languages.');

  // 3. Test topic lookup for each language
  const sampleGo = getQuizByTopicId(GO_QUIZZES[0].topicId, 'go');
  if (!sampleGo || sampleGo.id !== GO_QUIZZES[0].id) {
    throw new Error('getQuizByTopicId failed for Go topic');
  }

  const samplePy = getQuizByTopicId(PYTHON_QUIZZES[0].topicId, 'python');
  if (!samplePy || samplePy.id !== PYTHON_QUIZZES[0].id) {
    throw new Error('getQuizByTopicId failed for Python topic');
  }

  const sampleJs = getQuizByTopicId(JAVASCRIPT_QUIZZES[0].topicId, 'javascript');
  if (!sampleJs || sampleJs.id !== JAVASCRIPT_QUIZZES[0].id) {
    throw new Error('getQuizByTopicId failed for JavaScript topic');
  }

  const sampleTs = getQuizByTopicId(TYPESCRIPT_QUIZZES[0].topicId, 'typescript');
  if (!sampleTs || sampleTs.id !== TYPESCRIPT_QUIZZES[0].id) {
    throw new Error('getQuizByTopicId failed for TypeScript topic');
  }
  console.log('[Test] getQuizByTopicId() verified for all 4 playground languages.');

  // 4. Test simulated submission of a curriculum section quiz via router
  const simulatePost = (path: string, body: any): Promise<{ status: number; body: any }> => {
    return new Promise((resolve) => {
      let statusCode = 200;
      let responseBody: any = null;

      const req: any = { method: 'POST', url: path, body, params: {}, query: {} };
      const res: any = {
        status(code: number) { statusCode = code; return this; },
        json(data: any) { responseBody = data; resolve({ status: statusCode, body: responseBody }); },
        send(data: any) { responseBody = data; resolve({ status: statusCode, body: responseBody }); },
      };

      quizRouter(req, res, (err: any) => {
        resolve({ status: err ? 500 : 404, body: { error: err?.message || 'Not found' } });
      });
    });
  };

  // Submit correct answers for Go quiz 1
  const goQuiz = GO_QUIZZES[0];
  const correctAnswers: Record<string, string> = {};
  goQuiz.questions.forEach((q) => {
    correctAnswers[q.id] = q.correctOptionId;
  });

  const submitRes = await simulatePost('/quizzes/submit', {
    quizId: goQuiz.id,
    answers: correctAnswers,
  });

  if (submitRes.status !== 200 || !submitRes.body.passed) {
    throw new Error(`Curriculum quiz submit failed: ${JSON.stringify(submitRes.body)}`);
  }
  console.log(`[Test] Submitted ${goQuiz.id}: score=${submitRes.body.scorePercent}%, passed=${submitRes.body.passed}, xp=${submitRes.body.xpEarned}`);

  // Test failing submission
  const wrongAnswers: Record<string, string> = {};
  goQuiz.questions.forEach((q) => {
    const wrongOpt = q.options.find((o) => o.id !== q.correctOptionId);
    wrongAnswers[q.id] = wrongOpt ? wrongOpt.id : 'x';
  });

  const failRes = await simulatePost('/quizzes/submit', {
    quizId: goQuiz.id,
    answers: wrongAnswers,
  });

  if (failRes.status !== 200 || failRes.body.passed) {
    throw new Error(`Expected curriculum quiz to fail, but got: ${JSON.stringify(failRes.body)}`);
  }
  console.log(`[Test] Failing submission correctly evaluated: score=${failRes.body.scorePercent}%, passed=${failRes.body.passed}`);

  console.log('[Test] All curriculum quiz integration tests passed 100%!');
}

testCurriculumQuizzesIntegration().catch((err) => {
  console.error('[Test Failed]:', err);
  process.exit(1);
});
