import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { fileURLToPath } from 'url';
import { ExecutionResult, GuidedCorrection, LineExplanation, SubmissionResult, TestCase } from '../../src/types';
import { CorrectionEngine } from '../engine/CorrectionEngine';
import { LineExplanationEngine } from '../engine/LineExplanationEngine';
import { LinterEngine } from '../engine/LinterEngine';
import { LanguageAdapter } from './LanguageAdapter';
import { ensureGo } from '../../scripts/ensure-go.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

export class GoAdapter implements LanguageAdapter {
  public languageId = 'go';
  public name = 'Go (Golang)';
  public version = '1.22+';
  public fileExtension = '.go';

  private getGoBinary(): string {
    if (process.env.GO_BINARY && fs.existsSync(process.env.GO_BINARY)) {
      return process.env.GO_BINARY;
    }

    const projectGo = path.join(projectRoot, '.go', 'bin', process.platform === 'win32' ? 'go.exe' : 'go');
    const cwdGo = path.join(process.cwd(), '.go', 'bin', process.platform === 'win32' ? 'go.exe' : 'go');

    const candidates = [
      process.env.GO_BINARY,
      projectGo,
      cwdGo,
      '/usr/local/go/bin/go',
      '/usr/bin/go',
      '/tmp/go/bin/go',
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    // Check system PATH
    try {
      execSync('go version', { stdio: 'ignore' });
      return 'go';
    } catch { }

    // Automatic on-demand download if missing in cloud environment
    try {
      const autoInstalled = ensureGo();
      if (autoInstalled && fs.existsSync(autoInstalled)) {
        return autoInstalled;
      }
    } catch (err: any) {
      console.error('[GoAdapter] Error during ensureGo fallback:', err?.message);
    }

    return 'go';
  }

  public async runCode(codeOrFiles: string | Record<string, string>): Promise<ExecutionResult> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeforge-go-'));

    // Create lightweight go.mod so multi-file packages and imports work cleanly
    fs.writeFileSync(path.join(tmpDir, 'go.mod'), 'module playground\n\ngo 1.22\n');

    let hasTestFiles = false;

    if (typeof codeOrFiles === 'string') {
      fs.writeFileSync(path.join(tmpDir, 'main.go'), codeOrFiles);
    } else if (codeOrFiles && typeof codeOrFiles === 'object') {
      const entries = Object.entries(codeOrFiles);
      for (const [filename, content] of entries) {
        const safeName = path.basename(filename);
        if (safeName.endsWith('_test.go')) {
          hasTestFiles = true;
        }
        fs.writeFileSync(path.join(tmpDir, safeName), content || '');
      }
      if (!fs.existsSync(path.join(tmpDir, 'main.go')) && !hasTestFiles && entries.length > 0) {
        fs.writeFileSync(path.join(tmpDir, 'main.go'), entries[0][1] || '');
      }
    }

    const goCmd = this.getGoBinary();
    const goBinDir = path.dirname(goCmd);
    const goRootDir = path.dirname(goBinDir);

    const startTime = Date.now();
    const cacheDir = path.join(projectRoot, '.gocache');
    const gopathDir = path.join(projectRoot, '.gopath');

    if (!fs.existsSync(cacheDir)) {
      try { fs.mkdirSync(cacheDir, { recursive: true }); } catch { }
    }
    if (!fs.existsSync(gopathDir)) {
      try { fs.mkdirSync(gopathDir, { recursive: true }); } catch { }
    }

    // Determine execution command: 'go test -v ./...' if only tests exist, else 'go run .'
    const command = hasTestFiles && !fs.existsSync(path.join(tmpDir, 'main.go'))
      ? `"${goCmd}" test -v ./...`
      : `"${goCmd}" run .`;

    return new Promise((resolve) => {
      // Run with 25000ms timeout for throttled cloud environments
      const child = exec(
        command,
        {
          cwd: tmpDir,
          timeout: 25000,
          maxBuffer: 1024 * 1024,
          env: {
            ...process.env,
            GOROOT: goRootDir,
            GOCACHE: cacheDir,
            GOPATH: gopathDir,
            CGO_ENABLED: '0',
            GOPROXY: 'off',
            PATH: `${goBinDir}:${process.env.PATH || ''}`,
          },
        },
        (error, stdout, stderr) => {
          const duration = Date.now() - startTime;
          // Cleanup temp directory
          try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
          } catch { }

          if (error) {
            const isTimeout = Boolean((error as any).killed || (error as any).signal === 'SIGTERM');
            const errOutput = stderr.toString().trim();
            const failureMessage = isTimeout
              ? 'Execution timed out. On free cloud instances, initial compilation takes a few seconds — please try clicking Run again!'
              : (errOutput || error.message);

            resolve({
              stdout: stdout.toString(),
              stderr: failureMessage,
              exitCode: child.exitCode ?? 1,
              executionTimeMs: duration,
              compiledSuccessfully: false,
            });
          } else {
            resolve({
              stdout: stdout.toString(),
              stderr: stderr.toString(),
              exitCode: 0,
              executionTimeMs: duration,
              compiledSuccessfully: true,
            });
          }
        }
      );
    });
  }

  public async runTests(
    codeOrFiles: string | Record<string, string>,
    exerciseType: string,
    testCases: TestCase[],
    exerciseConcept?: string,
    isProject?: boolean
  ): Promise<SubmissionResult> {
    // 1. Run standard execution first
    const execResult = await this.runCode(codeOrFiles);
    const primaryCode = typeof codeOrFiles === 'string'
      ? codeOrFiles
      : (codeOrFiles['main.go'] || Object.values(codeOrFiles)[0] || '');
    const allCode = typeof codeOrFiles === 'string'
      ? codeOrFiles
      : Object.values(codeOrFiles).join('\n');
    const code = primaryCode;

    // 2. Perform Best Practices & Architecture Linting
    const bestPractices = LinterEngine.analyze(codeOrFiles, isProject, exerciseConcept);

    if (!execResult.compiledSuccessfully) {
      // Generate single-error guided correction
      const correction = CorrectionEngine.analyzeCompilerError(
        execResult.stderr,
        execResult.stdout,
        primaryCode
      );

      return {
        success: false,
        execution: execResult,
        passedTestCount: 0,
        totalTestCount: testCases ? testCases.length : 1,
        correction,
        bestPractices,
      };
    }

    // 2. Perform concept-specific syntax structure verification
    if (exerciseConcept === 'constants' && !/\bconst\b/.test(allCode)) {
      const codeLines = primaryCode.split('\n');
      let targetLineIndex = codeLines.findIndex(
        (l) => l.includes(':=') || l.includes('var ') || (l.includes('=') && !l.trim().startsWith('//') && !l.trim().startsWith('package') && !l.trim().startsWith('import') && !l.trim().startsWith('func') && !l.trim().startsWith('}'))
      );
      if (targetLineIndex === -1) {
        targetLineIndex = codeLines.findIndex((l) => l.trim().length > 0 && !l.trim().startsWith('//') && !l.trim().startsWith('package') && !l.trim().startsWith('import') && !l.trim().startsWith('func') && !l.trim().startsWith('{') && !l.trim().startsWith('}'));
      }
      if (targetLineIndex === -1) targetLineIndex = 0;
      const rawTargetLine = codeLines[targetLineIndex] || code;
      const targetLineContent = rawTargetLine.trim();

      // Dynamically construct suggested fix from user line
      let suggestedFix = targetLineContent
        .replace(/^var\s+/, 'const ')
        .replace(/([a-zA-Z0-9_]+)\s*:=/, 'const $1 =');
      if (!suggestedFix.startsWith('const ')) {
        suggestedFix = `const ${suggestedFix}`;
      }

      const failingCorrection: GuidedCorrection = {
        lineIndex: targetLineIndex + 1,
        whatHappened: 'Missing `const` keyword for constant declaration',
        whyItHappened: 'You used short variable declaration (`:=`) or `var` instead of a constant. In Go, constants MUST be declared using the `const` keyword (e.g. `const MaxUsers = 500`). Short declaration `:=` creates a mutable variable, not a constant.',
        howToFix: `Change line ${targetLineIndex + 1} (\`${targetLineContent}\`) to use \`const\` (e.g. \`${suggestedFix}\`).`,
        graduatedHints: [
          'In Go, values declared with `:=` or `var` are mutable variables, not constants.',
          'Use the `const` keyword instead of `:=` or `var` to declare a constant value.',
          `Change \`${targetLineContent}\` to \`${suggestedFix}\`.`,
        ],
      };
      return {
        success: false,
        execution: execResult,
        passedTestCount: 0,
        totalTestCount: testCases && testCases.length > 0 ? testCases.length : 1,
        testDetails: [{
          testId: 'concept-check',
          passed: false,
          input: '',
          expected: 'Must use `const` keyword to declare constants.',
          actual: 'Used variable declaration (`:=` or `var`) instead of `const`.',
          description: 'Go Constant Syntax Check',
        }],
        correction: failingCorrection,
      };
    }

    // Concept: Multiple Println Arguments (Strictly requires fmt.Println with multiple args, forbids fmt.Printf)
    if (exerciseConcept === 'fmt-arguments') {
      const codeLines = code.split('\n');
      const usesPrintf = /\bfmt\.Printf\b/.test(code);
      const usesPrintln = /\bfmt\.Println\b/.test(code);
      const printlnMatch = code.match(/\bfmt\.Println\s*\(([\s\S]*?)\)/);
      const commaCount = printlnMatch ? (printlnMatch[1].match(/,/g) || []).length : 0;
      const hasMultipleArgs = commaCount >= 2;

      if (usesPrintf || !usesPrintln || !hasMultipleArgs) {
        let targetLineIndex = codeLines.findIndex((l) => l.includes('fmt.Printf') || l.includes('fmt.Print') || l.includes('fmt.Println'));
        if (targetLineIndex === -1) {
          targetLineIndex = codeLines.findIndex((l) => l.includes('main()'));
        }
        if (targetLineIndex === -1) targetLineIndex = 0;
        const rawTargetLine = codeLines[targetLineIndex] || code;
        const targetLineContent = rawTargetLine.trim();

        let whatHappened = 'Must strictly use `fmt.Println` with multiple arguments.';
        let whyItHappened = 'This exercise specifically teaches `fmt.Println` variadic arguments and automatic space insertion between comma-separated values.';
        let howToFix = 'Call `fmt.Println("Score:", 100, "points")` instead of `fmt.Printf`.';
        let graduatedHints = [
          'Do not use `fmt.Printf`. This exercise strictly requires `fmt.Println`.',
          '`fmt.Println` accepts multiple arguments separated by commas and automatically adds spaces between them.',
          'Write: `fmt.Println("Score:", 100, "points")`',
        ];

        if (usesPrintf) {
          whatHappened = 'Used `fmt.Printf` instead of `fmt.Println`';
          whyItHappened = 'You used `fmt.Printf` with formatting specifiers. This exercise is specifically designed to teach `fmt.Println`\'s automatic space insertion across multiple variadic arguments. `fmt.Printf` is strictly not allowed for this exercise.';
          howToFix = 'Replace `fmt.Printf(...)` with `fmt.Println("Score:", 100, "points")`.';
        } else if (!usesPrintln) {
          whatHappened = 'Missing `fmt.Println` call';
          whyItHappened = 'You must use `fmt.Println` to output the values with automatic spacing.';
          howToFix = 'Call `fmt.Println("Score:", 100, "points")`.';
        } else if (!hasMultipleArgs) {
          whatHappened = 'Single argument passed to `fmt.Println` instead of multiple arguments';
          whyItHappened = 'You passed a single pre-formatted string to `fmt.Println`. The goal is to pass three separate arguments (`"Score:"`, `100`, `"points"`) separated by commas so that `fmt.Println` automatically inserts spaces between them.';
          howToFix = 'Pass three arguments separated by commas: `fmt.Println("Score:", 100, "points")`.';
        }

        const failingCorrection: GuidedCorrection = {
          lineIndex: targetLineIndex + 1,
          whatHappened,
          whyItHappened,
          howToFix,
          graduatedHints,
        };

        return {
          success: false,
          execution: execResult,
          passedTestCount: 0,
          totalTestCount: testCases && testCases.length > 0 ? testCases.length : 1,
          testDetails: [{
            testId: 'concept-check',
            passed: false,
            input: '',
            expected: 'Must strictly use `fmt.Println` with three arguments: "Score:", 100, "points"',
            actual: usesPrintf ? 'Used `fmt.Printf`' : !usesPrintln ? 'Missing `fmt.Println`' : 'Did not pass multiple arguments to `fmt.Println`',
            description: 'Go Multiple Println Arguments Check',
          }],
          correction: failingCorrection,
        };
      }
    }

    if (!testCases || testCases.length === 0) {
      return {
        success: true,
        execution: execResult,
        passedTestCount: 1,
        totalTestCount: 1,
        bestPractices,
        conceptsLearned: ['Go Syntax & Output Verification'],
      };
    }

    // Behavioral evaluation against test cases
    let passedCount = 0;
    const testDetails = [];
    let failingCorrection = undefined;

    for (const tc of testCases) {
      const outputMatches = execResult.stdout.trim() === tc.expectedOutput.trim();

      if (outputMatches) {
        passedCount++;
        testDetails.push({
          testId: tc.id,
          passed: true,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: execResult.stdout,
          description: tc.description,
        });
      } else {
        testDetails.push({
          testId: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: execResult.stdout,
          description: tc.description,
        });

        if (!failingCorrection) {
          failingCorrection = CorrectionEngine.analyzeTestFailure(tc, execResult.stdout, code);
        }
      }
    }

    // For capstone projects, also require passing critical architecture checks
    const criticalFailure = bestPractices.checks.find(
      (c) => !c.passed && c.category === 'architecture'
    );

    if (!failingCorrection && criticalFailure && isProject) {
      failingCorrection = {
        lineIndex: 1,
        whatHappened: criticalFailure.title,
        whyItHappened: criticalFailure.message,
        howToFix: criticalFailure.suggestion || 'Follow Go multi-file project conventions.',
        graduatedHints: [
          'Capstone projects must follow idiomatic Go architecture.',
          criticalFailure.message,
          criticalFailure.suggestion || 'Separate your domain models and handlers across files.',
        ],
      };
    }

    const allPassed = passedCount === testCases.length && (!isProject || !criticalFailure);

    return {
      success: allPassed,
      execution: execResult,
      passedTestCount: passedCount,
      totalTestCount: testCases.length,
      testDetails,
      correction: failingCorrection,
      bestPractices,
      codeQualityNotes: allPassed
        ? [
          'Clean idiomatic Go structure.',
          'Effective modularization and type declarations.',
          'Conforms to Go standard best practices.',
        ]
        : undefined,
      conceptsLearned: allPassed
        ? ['Idiomatic Syntax', 'Return Type Handling', 'Multi-File Architecture']
        : undefined,
    };
  }

  public explainLine(code: string, lineNumber: number): LineExplanation {
    return LineExplanationEngine.explain(code, lineNumber);
  }
}
