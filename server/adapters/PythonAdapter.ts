import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ExecutionResult, GuidedCorrection, LineExplanation, SubmissionResult, TestCase } from '../../src/types';
import { PythonCorrectionEngine } from '../engine/PythonCorrectionEngine';
import { PythonLineExplanationEngine } from '../engine/PythonLineExplanationEngine';
import { PythonLinterEngine } from '../engine/PythonLinterEngine';
import { LanguageAdapter } from './LanguageAdapter';

export class PythonAdapter implements LanguageAdapter {
  public languageId = 'python';
  public name = 'Python (Python 3)';
  public version = '3.9+';
  public fileExtension = '.py';

  private getPythonBinary(): string {
    if (process.env.PYTHON_BINARY && fs.existsSync(process.env.PYTHON_BINARY)) {
      return process.env.PYTHON_BINARY;
    }

    const candidates = [
      process.env.PYTHON_BINARY,
      '/usr/bin/python3',
      '/usr/local/bin/python3',
      '/opt/homebrew/bin/python3',
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    // Check system PATH
    try {
      execSync('python3 --version', { stdio: 'ignore' });
      return 'python3';
    } catch { }

    try {
      execSync('python --version', { stdio: 'ignore' });
      return 'python';
    } catch { }

    return 'python3';
  }

  public async runCode(
    codeOrFiles: string | Record<string, string>,
    stdinInput: string = ''
  ): Promise<ExecutionResult> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeforge-py-'));
    let entryFile = 'main.py';

    if (typeof codeOrFiles === 'string') {
      fs.writeFileSync(path.join(tmpDir, 'main.py'), codeOrFiles);
    } else if (codeOrFiles && typeof codeOrFiles === 'object') {
      const entries = Object.entries(codeOrFiles);
      for (const [filename, content] of entries) {
        const safeName = path.basename(filename);
        fs.writeFileSync(path.join(tmpDir, safeName), content || '');
      }

      if (!fs.existsSync(path.join(tmpDir, 'main.py')) && entries.length > 0) {
        entryFile = path.basename(entries[0][0]);
      }
    }

    const pyCmd = this.getPythonBinary();
    const startTime = Date.now();
    const command = `"${pyCmd}" -u "${entryFile}"`;

    return new Promise((resolve) => {
      const child = exec(
        command,
        {
          cwd: tmpDir,
          timeout: 6000,
          maxBuffer: 1024 * 1024,
          env: {
            ...process.env,
            PYTHONPATH: tmpDir,
            PYTHONDONTWRITEBYTECODE: '1',
            PYTHONUNBUFFERED: '1',
          },
        },
        (error, stdout, stderr) => {
          const duration = Date.now() - startTime;
          // Cleanup temp directory
          try {
            fs.rmSync(tmpDir, { recursive: true, force: true });
          } catch { }

          const stdoutStr = stdout ? stdout.toString() : '';
          const stderrStr = stderr ? stderr.toString() : '';

          if (error) {
            const isTimeout = Boolean((error as any).killed || (error as any).signal === 'SIGTERM');
            const failureMessage = isTimeout
              ? 'Execution timed out (exceeded 6 seconds limit). Ensure your code does not contain an infinite loop.'
              : (stderrStr.trim() || error.message);

            resolve({
              stdout: stdoutStr,
              stderr: failureMessage,
              exitCode: child.exitCode ?? 1,
              executionTimeMs: duration,
              compiledSuccessfully: false,
            });
          } else {
            const hasTraceback = stderrStr.includes('Traceback (most recent call last):');
            resolve({
              stdout: stdoutStr,
              stderr: stderrStr,
              exitCode: 0,
              executionTimeMs: duration,
              compiledSuccessfully: !hasTraceback,
            });
          }
        }
      );

      if (stdinInput && child.stdin) {
        try {
          child.stdin.write(stdinInput);
          child.stdin.end();
        } catch { }
      }
    });
  }

  public async runTests(
    codeOrFiles: string | Record<string, string>,
    exerciseType: string,
    testCases: TestCase[],
    exerciseConcept?: string,
    isProject?: boolean
  ): Promise<SubmissionResult> {
    const primaryCode = typeof codeOrFiles === 'string'
      ? codeOrFiles
      : (codeOrFiles['main.py'] || Object.values(codeOrFiles)[0] || '');

    const casesToRun = testCases && testCases.length > 0
      ? testCases
      : [{ id: 't1', input: '', expectedOutput: '' }];

    // 1. Initial execution to check compilation and syntax
    const firstInput = casesToRun[0]?.input || '';
    const initialExecution = await this.runCode(codeOrFiles, firstInput);

    if (!initialExecution.compiledSuccessfully) {
      const correction = PythonCorrectionEngine.analyzePythonError(
        initialExecution.stderr,
        initialExecution.stdout,
        primaryCode
      );

      return {
        success: false,
        execution: initialExecution,
        passedTestCount: 0,
        totalTestCount: casesToRun.length,
        correction,
      };
    }

    // 2. Behavioral Testing Loop across Test Cases
    const testDetails = [];
    let passedCount = 0;
    let failingCorrection: GuidedCorrection | undefined = undefined;

    for (let i = 0; i < casesToRun.length; i++) {
      const tc = casesToRun[i];
      const tcResult = i === 0
        ? initialExecution
        : await this.runCode(codeOrFiles, tc.input || '');

      const normalize = (s: string) => s.replace(/\r\n/g, '\n').trimEnd();
      const actualNorm = normalize(tcResult.stdout);
      const expectedNorm = normalize(tc.expectedOutput);

      const passed = tcResult.compiledSuccessfully && actualNorm === expectedNorm;

      if (passed) {
        passedCount++;
        testDetails.push({
          testId: tc.id,
          passed: true,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: tcResult.stdout,
          description: tc.description,
        });
      } else {
        testDetails.push({
          testId: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: tcResult.stdout,
          description: tc.description,
        });

        if (!failingCorrection) {
          if (!tcResult.compiledSuccessfully) {
            failingCorrection = PythonCorrectionEngine.analyzePythonError(
              tcResult.stderr,
              tcResult.stdout,
              primaryCode
            );
          } else {
            failingCorrection = PythonCorrectionEngine.analyzeTestFailure(
              tc,
              tcResult.stdout,
              primaryCode
            );
          }
        }
      }
    }

    const allPassed = passedCount === casesToRun.length;
    const bestPractices = PythonLinterEngine.analyze(codeOrFiles, isProject, exerciseConcept);

    return {
      success: allPassed,
      execution: initialExecution,
      passedTestCount: passedCount,
      totalTestCount: casesToRun.length,
      testDetails,
      correction: failingCorrection,
      bestPractices,
      codeQualityNotes: allPassed
        ? [
          'Code conforms to Python 3 execution standards.',
          'Clean output formatting and successful test assertions.',
        ]
        : undefined,
      conceptsLearned: allPassed
        ? ['Python 3 Execution', 'Standard Output Formatting']
        : undefined,
    };
  }

  public explainLine(code: string, lineNumber: number): LineExplanation {
    return PythonLineExplanationEngine.explain(code, lineNumber);
  }
}
