import { ALL_QUIZZES } from '../server/data/quizzes';
import { RemediationArticleEngine } from '../server/engine/RemediationArticleEngine';

async function testRemediationEngine() {
  console.log('[Test] Starting RemediationArticleEngine verification...');

  const sampleQuiz = ALL_QUIZZES[0];
  if (!sampleQuiz) {
    throw new Error('No quizzes found in ALL_QUIZZES');
  }

  const sampleQuestion = sampleQuiz.questions[0];
  if (!sampleQuestion) {
    throw new Error(`No questions found in quiz ${sampleQuiz.id}`);
  }

  const wrongOption = sampleQuestion.options.find((o) => o.id !== sampleQuestion.correctOptionId);
  const selectedOptionId = wrongOption ? wrongOption.id : 'a';

  console.log(`[Test] Generating remediation article for Quiz: "${sampleQuiz.title}", Question: "${sampleQuestion.id}", Selected: "${selectedOptionId}"...`);

  const article = await RemediationArticleEngine.generateArticle({
    quiz: sampleQuiz,
    question: sampleQuestion,
    selectedOptionId,
  });

  console.log('[Test] Article generated successfully:');
  console.log(`  - Title: ${article.title}`);
  console.log(`  - Estimated read minutes: ${article.estimatedReadMinutes}`);
  console.log(`  - Key Takeaways count: ${article.keyTakeaways.length}`);
  console.log(`  - Diagnostic Summary: ${article.diagnosticSummary}`);
  console.log(`  - Markdown length: ${article.markdown.length} chars`);

  // Assertions
  if (!article.articleId || !article.title || !article.markdown) {
    throw new Error('Article missing core fields (articleId, title, or markdown)');
  }
  if (article.questionId !== sampleQuestion.id) {
    throw new Error(`questionId mismatch: expected ${sampleQuestion.id}, got ${article.questionId}`);
  }
  if (article.quizId !== sampleQuiz.id) {
    throw new Error(`quizId mismatch: expected ${sampleQuiz.id}, got ${article.quizId}`);
  }
  if (article.estimatedReadMinutes <= 0) {
    throw new Error(`Invalid estimatedReadMinutes: ${article.estimatedReadMinutes}`);
  }
  if (!Array.isArray(article.keyTakeaways) || article.keyTakeaways.length === 0) {
    throw new Error('keyTakeaways should be a non-empty array');
  }

  // Test caching
  console.log('[Test] Verifying cache hit on repeated call...');
  const cachedArticle = await RemediationArticleEngine.generateArticle({
    quiz: sampleQuiz,
    question: sampleQuestion,
    selectedOptionId,
  });
  if (cachedArticle !== article) {
    throw new Error('Cache miss: repeated call did not return the identical cached instance');
  }
  console.log('[Test] Cache hit verified!');

  // Test with another topic from concept quizzes
  const conceptQuiz = ALL_QUIZZES.find((q) => q.id.startsWith('concept-')) || ALL_QUIZZES[ALL_QUIZZES.length - 1];
  console.log(`[Test] Testing with concept quiz "${conceptQuiz.id}"...`);
  const conceptQ = conceptQuiz.questions[0];
  const conceptWrongOpt = conceptQ.options.find((o) => o.id !== conceptQ.correctOptionId)?.id || 'b';

  const conceptArticle = await RemediationArticleEngine.generateArticle({
    quiz: conceptQuiz,
    question: conceptQ,
    selectedOptionId: conceptWrongOpt,
  });

  if (!conceptArticle.title.startsWith('Understanding') && !conceptArticle.title.startsWith('Deep Dive:')) {
    throw new Error(`Unexpected title format: ${conceptArticle.title}`);
  }
  console.log(`[Test] Concept article title: "${conceptArticle.title}"`);
  console.log('[Test] All RemediationArticleEngine tests passed!');
}

testRemediationEngine().catch((err) => {
  console.error('[Test Failed]:', err);
  process.exit(1);
});
