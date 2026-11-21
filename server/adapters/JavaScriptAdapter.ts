import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ExecutionResult, GuidedCorrection, LineExplanation, SubmissionResult, TestCase } from '../../src/types';
import { JavaScriptCorrectionEngine } from '../engine/JavaScriptCorrectionEngine';
import { JavaScriptLineExplanationEngine } from '../engine/JavaScriptLineExplanationEngine';
import { LanguageAdapter } from './LanguageAdapter';

export class JavaScriptAdapter implements LanguageAdapter {
  public languageId = 'javascript';
  public name = 'JavaScript (Node.js)';
  public version = 'Node 22+ (ES2024)';
  public fileExtension = '.js';

  private getNodeBinary(): string {
    return process.execPath || 'node';
  }

  public async runCode(
    codeOrFiles: string | Record<string, string>,
    stdinInput: string = ''
  ): Promise<ExecutionResult> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codeforge-js-'));
    let entryFile = 'main.js';

    if (typeof codeOrFiles === 'string') {
      fs.writeFileSync(path.join(tmpDir, 'main.js'), codeOrFiles);
    } else if (codeOrFiles && typeof codeOrFiles === 'object') {
      const entries = Object.entries(codeOrFiles);
      for (const [filename, content] of entries) {
        const safeName = path.basename(filename);
        fs.writeFileSync(path.join(tmpDir, safeName), content || '');
      }

        if (fs.existsSync(path.join(tmpDir, 'main.js'))) {
          entryFile = 'main.js';
        } else {
          const jsFile = entries.find(([name]) => name.endsWith('.js'));
          if (jsFile) {
            entryFile = path.basename(jsFile[0]);
          } else if (entries.length > 0) {
            fs.writeFileSync(path.join(tmpDir, 'main.js'), entries[0][1] || '');
            entryFile = 'main.js';
          }
        }
      }

      const nodeCmd = this.getNodeBinary();
      const startTime = Date.now();
      const command = `"${nodeCmd}" "${entryFile}"`;

      return new Promise((resolve) => {
        const child = exec(
          command,
          {
            cwd: tmpDir,
            timeout: 6000,
            maxBuffer: 1024 * 1024,
            env: {
              ...process.env,
              NODE_NO_WARNINGS: '1',
            },
          },
          (error, stdout, stderr) => {
            const duration = Date.now() - startTime;
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
              resolve({
                stdout: stdoutStr,
                stderr: stderrStr,
                exitCode: 0,
                executionTimeMs: duration,
                compiledSuccessfully: true,
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
      : (codeOrFiles['main.js'] || Object.values(codeOrFiles)[0] || '');

    const casesToRun = testCases && testCases.length > 0
      ? testCases
      : [{ id: 't1', input: '', expectedOutput: '' }];

    // 1. Initial execution to check compilation and runtime errors
    const firstInput = casesToRun[0]?.input || '';
    const initialExecution = await this.runCode(codeOrFiles, firstInput);

    if (!initialExecution.compiledSuccessfully) {
      const correction = JavaScriptCorrectionEngine.analyzeJavaScriptError(
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

      const normalize = (s: string) => s.replace(/\r\n/g, '\n').trim();
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
            failingCorrection = JavaScriptCorrectionEngine.analyzeJavaScriptError(
              tcResult.stderr,
              tcResult.stdout,
              primaryCode
            );
          } else {
            failingCorrection = JavaScriptCorrectionEngine.analyzeTestFailure(
              tc,
              tcResult.stdout,
              primaryCode
            );
          }
        }
      }
    }

    const allPassed = passedCount === casesToRun.length;

    return {
      success: allPassed,
      execution: initialExecution,
      passedTestCount: passedCount,
      totalTestCount: casesToRun.length,
      testDetails,
      correction: failingCorrection,
    };
  }

  public explainLine(code: string, lineNumber: number): LineExplanation {
    return JavaScriptLineExplanationEngine.explainLine(code, lineNumber);
  }
}
