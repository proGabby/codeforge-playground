import { ExecutionResult, GuidedCorrection, LineExplanation, SubmissionResult, TestCase } from '../../src/types';

export interface LanguageAdapter {
  languageId: string;
  name: string;
  version: string;
  fileExtension: string;

  /**
   * Runs arbitrary user code standalone.
   */
  runCode(codeOrFiles: string | Record<string, string>): Promise<ExecutionResult>;

  /**
   * Evaluates user code against test cases (behavioral testing).
   */
  runTests(
    codeOrFiles: string | Record<string, string>,
    exerciseType: string,
    testCases: TestCase[],
    exerciseConcept?: string
  ): Promise<SubmissionResult>;

  /**
   * Explains a specific line of code in simple and advanced terms.
   */
  explainLine(code: string, lineNumber: number): LineExplanation;
}

export class LanguageRegistry {
  private static adapters: Map<string, LanguageAdapter> = new Map();

  public static register(adapter: LanguageAdapter) {
    this.adapters.set(adapter.languageId, adapter);
  }

  public static get(languageId: string): LanguageAdapter | undefined {
    return this.adapters.get(languageId);
  }

  public static listLanguages() {
    return Array.from(this.adapters.values()).map(adapter => ({
      id: adapter.languageId,
      name: adapter.name,
      version: adapter.version,
      fileExtension: adapter.fileExtension,
    }));
  }
}
