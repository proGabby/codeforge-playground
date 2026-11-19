import { PYTHON_CURRICULUM } from '../server/data/PythonCurriculum';
import { PythonAdapter } from '../server/adapters/PythonAdapter';
import { PythonCorrectionEngine } from '../server/engine/PythonCorrectionEngine';
import { PythonLineExplanationEngine } from '../server/engine/PythonLineExplanationEngine';
import { AdaptiveEngine } from '../server/engine/AdaptiveEngine';
import { GeminiMentorEngine } from '../server/engine/GeminiMentorEngine';

async function runAudit() {
  console.log('======================================================');
  console.log('   CODEFORGE PYTHON CURRICULUM AUDIT & E2E VERIFIER   ');
  console.log('======================================================\n');

  let passedChecks = 0;
  let totalChecks = 0;

  function assert(condition: boolean, msg: string) {
    totalChecks++;
    if (!condition) {
      console.error(`❌ [FAIL] ${msg}`);
      throw new Error(`Audit failure: ${msg}`);
    }
    passedChecks++;
    console.log(`✅ [PASS] ${msg}`);
  }

  // 1. Curriculum Integrity
  console.log('--- 1. Curriculum Structure & Prerequisites ---');
  assert(PYTHON_CURRICULUM.languageId === 'python', 'Language ID is "python"');
  assert(PYTHON_CURRICULUM.topics.length === 16, 'Exactly 16 topics defined');

  const topicIds = new Set(PYTHON_CURRICULUM.topics.map((t) => t.id));
  assert(topicIds.size === 16, 'All 16 topic IDs are globally unique');

  for (let i = 0; i < PYTHON_CURRICULUM.topics.length; i++) {
    const topic = PYTHON_CURRICULUM.topics[i];
    assert(topic.order === i + 1, `Topic ${topic.id} has sequential order ${i + 1}`);

    if (i === 0) {
      assert(topic.prerequisites.length === 0, `Root topic ${topic.id} has no prerequisites`);
    } else {
      for (const prereq of topic.prerequisites) {
        assert(topicIds.has(prereq), `Prerequisite "${prereq}" for topic ${topic.id} exists`);
      }
    }
  }

  // 2. Exercise Quality & Anti-Solution Checks
  console.log('\n--- 2. Exercise Quality & Anti-Solution Integrity ---');
  let exerciseCount = 0;
  for (const topic of PYTHON_CURRICULUM.topics) {
    assert(topic.exercises.length === topic.exerciseIds.length, `Topic ${topic.id} exerciseIds match exercises count (${topic.exercises.length})`);

    for (const ex of topic.exercises) {
      exerciseCount++;
      assert(ex.languageId === 'python', `Ex ${ex.id} has languageId 'python'`);
      assert(ex.topicId === topic.id, `Ex ${ex.id} matches parent topic ${topic.id}`);
      assert(Boolean(ex.instructions && ex.instructions.length > 10), `Ex ${ex.id} has clear instructions`);
      assert(Boolean(ex.expectedBehavior && ex.expectedBehavior.length > 5), `Ex ${ex.id} has expectedBehavior`);
      assert(Boolean(ex.testCases && ex.testCases.length > 0), `Ex ${ex.id} has test cases`);

      // Hints
      assert(Boolean(ex.hints && ex.hints.length === 3), `Ex ${ex.id} has graduated 3-level hints`);

      // Explanation
      assert(Boolean(ex.explanation?.simple && ex.explanation?.whyItWorks && ex.explanation?.underTheHood), `Ex ${ex.id} has deep explanation model`);
      assert(Boolean(ex.explanation?.syntaxBreakdown && ex.explanation.syntaxBreakdown.length > 0), `Ex ${ex.id} has syntax token breakdown`);

      // Anti-solution check: starterCode must NEVER give away the answer
      const starter = ex.starterCode.trim();
      assert(starter.length > 0, `Ex ${ex.id} has starterCode`);

      if (ex.isProject && ex.starterFiles) {
        for (const [filename, content] of Object.entries(ex.starterFiles)) {
          assert(content.includes('# TODO') || content.includes('"""'), `Project file ${filename} in ${ex.id} has instructional stubs`);
        }
      } else {
        const hasInstructionalComment =
          starter.includes('#') ||
          starter.includes('TODO') ||
          starter.includes('pass') ||
          starter.includes('____');
        assert(hasInstructionalComment, `Ex ${ex.id} starter code contains instructional comment/stub`);
      }
    }
  }
  console.log(`Audited ${exerciseCount} total exercises across all 16 topics.`);

  // 3. Traceback & Diagnostic Engine Verification
  console.log('\n--- 3. Traceback Diagnostics & Guided Corrections ---');
  const indentErrStderr = `  File "main.py", line 4\n    print("Indented")\nIndentationError: unexpected indent`;
  const indentCorr = PythonCorrectionEngine.analyzePythonError(indentErrStderr, '', 'def test():\npass\n  print("Indented")');
  assert(indentCorr.lineIndex === 4, 'IndentationError detected correct line 4');
  assert(indentCorr.whatHappened.toLowerCase().includes('indent'), 'IndentationError whatHappened description verified');
  assert(indentCorr.graduatedHints.length >= 3, 'IndentationError provides 3 graduated hints');

  const zeroDivStderr = `Traceback (most recent call last):\n  File "main.py", line 2, in <module>\n    x = 10 / 0\nZeroDivisionError: division by zero`;
  const zeroCorr = PythonCorrectionEngine.analyzePythonError(zeroDivStderr, '', 'a = 10\nx = 10 / 0');
  assert(zeroCorr.lineIndex === 2, 'ZeroDivisionError detected correct line 2');
  assert(zeroCorr.whatHappened.includes('Division by zero'), 'ZeroDivisionError whatHappened description verified');

  // 4. Line Explanation Engine Token Analysis
  console.log('\n--- 4. Python Line Explanation Engine ---');
  const defExp = PythonLineExplanationEngine.explain('def calculate_sum(a: int, b: int) -> int:', 1);
  assert(defExp.breakdown.some((b) => b.token === 'def'), 'Line explanation recognizes "def" keyword');

  const asyncExp = PythonLineExplanationEngine.explain('async def fetch_remote_data():', 1);
  assert(asyncExp.breakdown.some((b) => b.token === 'async def'), 'Line explanation recognizes "async def" coroutine');

  const withExp = PythonLineExplanationEngine.explain('with open("data.txt") as f:', 1);
  assert(withExp.breakdown.some((b) => b.token === 'with'), 'Line explanation recognizes "with" context manager');

  const yieldExp = PythonLineExplanationEngine.explain('    yield item', 1);
  assert(yieldExp.breakdown.some((b) => b.token === 'yield'), 'Line explanation recognizes "yield" generator keyword');

  // 5. Adaptive Learning Engine Verification
  console.log('\n--- 5. Adaptive Learning & Weak Concept Detection ---');
  const mockProgress = {
    completedExerciseIds: [],
    failedAttemptsCount: {
      'py-list-1': 3,
      'py-list-2': 2,
    },
    hintsUsedCount: {},
    topicProgress: {},
    unlockedTopicIds: ['py-hello-world', 'py-lists'],
    streakDays: 2,
    totalTimeSpentSeconds: 300,
    weakConcepts: [],
    lastActiveTopicId: 'py-lists',
    lastActiveExerciseId: 'py-list-1',
  };
  const adaptiveResult = AdaptiveEngine.analyzeProgress(mockProgress, 'python');
  assert(adaptiveResult.weakConcepts.length > 0, 'AdaptiveEngine identified weak concepts for Python exercises');
  assert(adaptiveResult.recommendations.length > 0, 'AdaptiveEngine generated targeted Python recommendations');
  assert(adaptiveResult.recommendations[0].exerciseId.startsWith('py-'), 'Recommended exercise is from Python curriculum');

  // 6. Gemini Mentor Socratic Response Verification
  console.log('\n--- 6. Gemini AI Mentor Python Socratic Guidance ---');
  const fallbackPyError = (GeminiMentorEngine as any).generateFallbackResponse({
    exerciseTitle: 'Lists Exercise',
    instructions: 'Manipulate lists',
    concept: 'lists',
    userCode: 'x = 10 / 0',
    stderr: 'ZeroDivisionError: division by zero',
    question: 'Why did my code crash with an error?',
    languageId: 'python',
  });
  assert(fallbackPyError.includes('ZeroDivisionError'), 'AI Mentor fallback provides Python ZeroDivisionError guidance');

  const fallbackIndent = (GeminiMentorEngine as any).generateFallbackResponse({
    exerciseTitle: 'Loops Exercise',
    instructions: 'Loop over items',
    concept: 'loops',
    userCode: 'for x in range(3):\nprint(x)',
    stderr: 'IndentationError: expected an indented block',
    question: 'How do I fix this?',
    languageId: 'python',
  });
  assert(fallbackIndent.includes('indentation'), 'AI Mentor fallback provides Python indentation guidance');

  // 7. Python Sandbox Execution E2E
  console.log('\n--- 7. Live Python Sandbox Execution ---');
  const adapter = new PythonAdapter();
  const runResult = await adapter.runCode('import sys\nprint("Python Version:", sys.version_info.major, sys.version_info.minor)');
  assert(runResult.compiledSuccessfully, 'Python execution compiled successfully');
  assert(runResult.stdout.includes('Python Version: 3'), 'Python 3 binary executed cleanly');
  console.log(`    Captured: ${runResult.stdout.trim()}`);

  console.log('\n======================================================');
  console.log(`   ALL ${passedChecks}/${totalChecks} PYTHON CHECKS PASSED PERFECTLY!   `);
  console.log('======================================================\n');
}

runAudit().catch((err) => {
  console.error('\n[AUDIT FAILED]', err);
  process.exit(1);
});
