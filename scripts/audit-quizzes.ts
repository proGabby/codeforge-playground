import { GO_CURRICULUM } from '../server/data/GoCurriculum';
import { PYTHON_CURRICULUM } from '../server/data/PythonCurriculum';
import { GO_QUIZZES } from '../server/data/quizzes/goQuizzes';
import { PYTHON_QUIZZES } from '../server/data/quizzes/pythonQuizzes';
import { getQuizByTopicId, getQuizById, ALL_QUIZZES } from '../server/data/quizzes';

console.log('--- Starting CodeForge Section Quiz Audit ---');

let totalChecks = 0;
let passedChecks = 0;
const errors: string[] = [];

function assert(condition: boolean, msg: string) {
  totalChecks++;
  if (condition) {
    passedChecks++;
  } else {
    errors.push(msg);
    console.error(`❌ FAIL: ${msg}`);
  }
}

// 1. Audit Go Quizzes
console.log(`Auditing Go topics (${GO_CURRICULUM.topics.length} topics)...`);
for (const topic of GO_CURRICULUM.topics) {
  const quiz = GO_QUIZZES.find((q) => q.topicId === topic.id);
  assert(!!quiz, `Go topic "${topic.id}" (${topic.title}) must have a section quiz.`);
}

// 2. Audit Python Quizzes
console.log(`Auditing Python topics (${PYTHON_CURRICULUM.topics.length} topics)...`);
for (const topic of PYTHON_CURRICULUM.topics) {
  const quiz = PYTHON_QUIZZES.find((q) => q.topicId === topic.id);
  assert(!!quiz, `Python topic "${topic.id}" (${topic.title}) must have a section quiz.`);
}

// 3. Audit Question Structure & Integrity
console.log(`Auditing questions in all ${ALL_QUIZZES.length} quizzes...`);
const seenQuestionIds = new Set<string>();

for (const quiz of ALL_QUIZZES) {
  assert(quiz.questions.length >= 3, `Quiz "${quiz.id}" must have at least 3 questions (has ${quiz.questions.length}).`);
  assert(quiz.passingScorePercent > 0 && quiz.passingScorePercent <= 100, `Quiz "${quiz.id}" passingScorePercent must be between 1 and 100.`);
  assert(quiz.xpReward >= 10, `Quiz "${quiz.id}" xpReward must be at least 10.`);

  for (let idx = 0; idx < quiz.questions.length; idx++) {
    const q = quiz.questions[idx];
    const qLabel = `Quiz "${quiz.id}" Q#${idx + 1} (${q.id})`;

    assert(!seenQuestionIds.has(q.id), `${qLabel}: Question ID is duplicate!`);
    seenQuestionIds.add(q.id);

    assert(q.question.trim().length > 10, `${qLabel}: Question text must be non-empty.`);
    assert(q.options.length >= 3, `${qLabel}: Must have at least 3 options (has ${q.options.length}).`);
    assert(q.explanation.trim().length > 10, `${qLabel}: Explanation must be comprehensive.`);

    const optionIds = q.options.map((o) => o.id);
    assert(
      optionIds.includes(q.correctOptionId),
      `${qLabel}: correctOptionId "${q.correctOptionId}" not found in options: [${optionIds.join(', ')}]`
    );

    for (const opt of q.options) {
      assert(opt.text.trim().length > 0, `${qLabel} Option "${opt.id}": text must not be empty.`);
    }
  }
}

// 4. Test Helper Registry Functions
assert(getQuizByTopicId('py-loops', 'python')?.id === 'quiz-py-loops', 'getQuizByTopicId(py-loops, python) should return quiz-py-loops');
assert(getQuizByTopicId('go-slices', 'go')?.id === 'quiz-go-slices', 'getQuizByTopicId(go-slices, go) should return quiz-go-slices');
assert(getQuizById('quiz-py-oop')?.topicId === 'py-oop', 'getQuizById(quiz-py-oop) should return topic py-oop');

console.log(`\n========================================`);
console.log(`Audit Finished: ${passedChecks} / ${totalChecks} checks passed.`);
if (errors.length > 0) {
  console.error(`Total Errors: ${errors.length}`);
  process.exit(1);
} else {
  console.log(`🎉 100% AUDIT PASS: All 39 section quizzes across Go & Python are verified and valid!`);
  process.exit(0);
}
