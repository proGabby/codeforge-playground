import { quizRouter } from '../server/routes/quizRoutes';
import { ENGINEERING_CONCEPT_QUIZZES } from '../server/data/quizzes/engineeringConceptQuizzes';

async function testRemediationRouteDirectly() {
  console.log('[Test] Testing quizRouter remediation route directly in-memory...');

  // Helper to simulate an Express POST request to quizRouter
  const simulatePost = (path: string, body: any): Promise<{ status: number; body: any }> => {
    return new Promise((resolve) => {
      let statusCode = 200;
      let responseBody: any = null;

      const req: any = {
        method: 'POST',
        url: path,
        body,
        params: {},
        query: {},
      };

      const res: any = {
        status(code: number) {
          statusCode = code;
          return this;
        },
        json(data: any) {
          responseBody = data;
          resolve({ status: statusCode, body: responseBody });
        },
        send(data: any) {
          responseBody = data;
          resolve({ status: statusCode, body: responseBody });
        },
      };

      quizRouter(req, res, (err: any) => {
        if (err) {
          resolve({ status: 500, body: { error: err.message } });
        } else {
          resolve({ status: 404, body: { error: 'Route not handled' } });
        }
      });
    });
  };

  // 1. Non-existent quiz
  const res404 = await simulatePost('/quizzes/remediation-article', {
    quizId: 'non-existent-quiz',
    questionId: 'q-123',
  });
  if (res404.status !== 404) {
    throw new Error(`Expected 404 for invalid quizId, got ${res404.status}`);
  }
  console.log('[Test] Correctly handled 404 for non-existent quiz.');

  // 2. Non-existent question
  const targetQuiz = ENGINEERING_CONCEPT_QUIZZES[0];
  const res404Q = await simulatePost('/quizzes/remediation-article', {
    quizId: targetQuiz.id,
    questionId: 'non-existent-question',
  });
  if (res404Q.status !== 404) {
    throw new Error(`Expected 404 for invalid questionId, got ${res404Q.status}`);
  }
  console.log('[Test] Correctly handled 404 for non-existent question.');

  // 3. Valid quiz and question
  const targetQ = targetQuiz.questions[0];
  const wrongOpt = targetQ.options.find((o) => o.id !== targetQ.correctOptionId)?.id || 'b';

  console.log(`[Test] Requesting remediation article for quiz "${targetQuiz.id}", question "${targetQ.id}"...`);
  const validRes = await simulatePost('/quizzes/remediation-article', {
    quizId: targetQuiz.id,
    questionId: targetQ.id,
    selectedOptionId: wrongOpt,
  });

  if (validRes.status !== 200) {
    throw new Error(`Expected 200, got ${validRes.status}: ${JSON.stringify(validRes.body)}`);
  }

  const article = validRes.body;
  if (!article.articleId || !article.markdown || !Array.isArray(article.keyTakeaways)) {
    throw new Error(`Malformed article response: ${JSON.stringify(article)}`);
  }
  console.log(`[Test] Route successfully returned remediation article!`);
  console.log(`  - Title: "${article.title}"`);
  console.log(`  - Concept: ${article.conceptTag}`);
  console.log(`  - Read time: ~${article.estimatedReadMinutes} min`);
  console.log(`  - Key takeaways count: ${article.keyTakeaways.length}`);
  console.log(`  - Markdown characters: ${article.markdown.length}`);
  console.log('[Test] All in-memory route tests passed successfully!');
}

testRemediationRouteDirectly().catch((err) => {
  console.error('[Test Failed]:', err);
  process.exit(1);
});
