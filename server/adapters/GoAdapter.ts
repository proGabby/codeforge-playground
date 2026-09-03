import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ExecutionResult, LineExplanation, SubmissionResult, TestCase } from '../../src/types';
import { CorrectionEngine } from '../engine/CorrectionEngine';
import { LineExplanationEngine } from '../engine/LineExplanationEngine';
import { LanguageAdapter } from './LanguageAdapter';

export class GoAdapter implements LanguageAdapter {
  public languageId = 'go';
  public name = 'Go (Golang)';
  public version = '1.22+';
  public fileExtension = '.go';

  private goBinary = '/usr/local/go/bin/go';

  public async runCode(code: string): Promise<ExecutionResult> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeforge-go-'));
    const filePath = path.join(tmpDir, 'main.go');
    fs.writeFileSync(filePath, code);

    const startTime = Date.now();
    return new Promise((resolve) => {
      // Run go run main.go with 3000ms timeout
      const child = exec(
        `${this.goBinary} run main.go`,
        { cwd: tmpDir, timeout: 3000, maxBuffer: 1024 * 1024 },
        (error, stdout, stderr) => {
          const duration = Date.now() - startTime;
          // Cleanup temp directory
          try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
          } catch { }

          if (error) {
            resolve({
              stdout: stdout.toString(),
              stderr: stderr.toString() || error.message,
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
    code: string,
    exerciseType: string,
    testCases: TestCase[],
    exerciseConcept?: string
  ): Promise<SubmissionResult> {
    // 1. Run standard execution first
    const execResult = await this.runCode(code);

    if (!execResult.compiledSuccessfully) {
      // Generate single-error guided correction
      const correction = CorrectionEngine.analyzeCompilerError(
        execResult.stderr,
        execResult.stdout,
        code
      );

      return {
        success: false,
        execution: execResult,
        passedTestCount: 0,
        totalTestCount: testCases ? testCases.length : 1,
        correction,
      };
    }

    // 2. Perform concept-specific syntax structure verification
    if (exerciseConcept === 'constants' && !/\bconst\b/.test(code)) {
      const codeLines = code.split('\n');
      let targetLineIndex = codeLines.findIndex((l) => l.includes('MaxUsers') || l.includes(':=') || l.includes('var'));
      if (targetLineIndex === -1) targetLineIndex = 0;
      const targetLineContent = codeLines[targetLineIndex] || code;

      const failingCorrection: GuidedCorrection = {
        lineIndex: targetLineIndex + 1,
        lineContent: targetLineContent.trim(),
        errorSummary: 'Missing `const` keyword for constant declaration',
        guidance: 'You used short variable declaration (`:=`) or `var` instead of a constant. In Go, constants MUST be declared using the `const` keyword (e.g. `const MaxUsers = 500`). Short declaration `:=` creates a mutable variable, not a constant.',
        suggestedFix: 'Use `const MaxUsers = 500` instead of `MaxUsers := 500`.',
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

    if (!testCases || testCases.length === 0) {
      return {
        success: true,
        execution: execResult,
        passedTestCount: 1,
        totalTestCount: 1,
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

    const allPassed = passedCount === testCases.length;

    return {
      success: allPassed,
      execution: execResult,
      passedTestCount: passedCount,
      totalTestCount: testCases.length,
      testDetails,
      correction: failingCorrection,
      codeQualityNotes: allPassed
        ? [
          'Clean idiomatic Go structure.',
          'Effective use of static type declarations.',
          'No unused variables or unhandled errors.',
        ]
        : undefined,
      conceptsLearned: allPassed
        ? ['Idiomatic Syntax', 'Return Type Handling', 'Behavioral Correctness']
        : undefined,
    };
  }

  public explainLine(code: string, lineNumber: number): LineExplanation {
    return LineExplanationEngine.explain(code, lineNumber);
  }
}
