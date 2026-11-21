import { GuidedCorrection, TestCase } from '../../src/types';

export class JavaScriptCorrectionEngine {
  /**
   * Translates raw Node.js runtime or syntax stack traces into a friendly guided correction card.
   */
  public static analyzeJavaScriptError(
    rawStderr: string,
    rawStdout: string,
    userCode: string
  ): GuidedCorrection {
    const errorText = (rawStderr + '\n' + rawStdout).trim();
    const errorLines = errorText.split('\n');

    let lineIndex = 1;
    let rawError = '';
    let errorType = '';

    // Standard Node.js stack trace patterns:
    // /tmp/codeforge-js-xxx/main.js:12
    // at Object.<anonymous> (/tmp/.../main.js:12:15)
    const lineRegex = /main\.js:(\d+)(?::(\d+))?/;

    for (let i = 0; i < errorLines.length; i++) {
      const line = errorLines[i].trim();
      if (!rawError && (line.includes('Error:') || line.endsWith('Error'))) {
        rawError = line;
        const errTypeMatch = line.match(/^([A-Za-z]+Error):/);
        if (errTypeMatch) {
          errorType = errTypeMatch[1];
        }
      }
      const match = line.match(lineRegex);
      if (match) {
        lineIndex = parseInt(match[1], 10);
      }
    }

    if (!rawError && errorLines.length > 0) {
      rawError = errorLines.find(l => l.includes('Error')) || errorLines[0] || 'Execution failed';
    }

    const codeLines = userCode.split('\n');
    const problemLineContent = codeLines[lineIndex - 1] || '';

    return this.generateFriendlyCorrection(lineIndex, rawError, errorType, problemLineContent, userCode);
  }

  private static generateFriendlyCorrection(
    lineIndex: number,
    rawError: string,
    errorType: string,
    lineContent: string,
    userCode: string
  ): GuidedCorrection {
    const errLower = rawError.toLowerCase();

    // 1. ReferenceError (variable is not defined)
    if (errorType === 'ReferenceError' || errLower.includes('is not defined')) {
      const varMatch = rawError.match(/([a-zA-Z0-9_$]+) is not defined/);
      const varName = varMatch ? varMatch[1] : 'identifier';

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `JavaScript cannot find "${varName}" on line ${lineIndex}.`,
        whyItHappened: `In JavaScript, accessing a variable that hasn't been declared with 'const', 'let', or 'var' throws a ReferenceError.`,
        howToFix: `Declare "${varName}" before accessing it (e.g. const ${varName} = ...).`,
        graduatedHints: [
          `Check if you spelled "${varName}" correctly.`,
          `Ensure the variable is in scope or declared before this line.`,
          `Add "const ${varName} = ..." or "let ${varName} = ..." at the top of your function or block.`
        ]
      };
    }

    // 2. TypeError (is not a function, Cannot read properties of undefined/null)
    if (errorType === 'TypeError' || errLower.includes('is not a function') || errLower.includes('cannot read properties')) {
      if (errLower.includes('is not a function')) {
        return {
          lineIndex,
          rawCompilerError: rawError,
          whatHappened: `Line ${lineIndex} attempted to invoke a non-function value.`,
          whyItHappened: `You used parentheses '()' on a variable or property whose value is not callable.`,
          howToFix: `Verify that the variable is defined as a function and hasn't been overwritten with a primitive or object.`,
          graduatedHints: [
            `Check what value is being called with ().`,
            `Check if you mistyped the function or method name.`,
            `Verify the variable is assigned to a function before calling it.`
          ]
        };
      }
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} attempted to access a property on null or undefined.`,
        whyItHappened: `In JavaScript, reading properties on null or undefined throws a TypeError.`,
        howToFix: `Ensure the object is properly initialized or use optional chaining (?.).`,
        graduatedHints: [
          `Check which object is undefined before the dot operator.`,
          `Make sure the object is initialized with data.`,
          `Use optional chaining (e.g. object?.property) to safely access nested properties.`
        ]
      };
    }

    // 3. SyntaxError (Unexpected token)
    if (errorType === 'SyntaxError' || errLower.includes('unexpected token') || errLower.includes('missing')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} contains invalid JavaScript syntax.`,
        whyItHappened: `The V8 JavaScript engine encountered an unexpected token or unmatched delimiter.`,
        howToFix: `Check line ${lineIndex} and surrounding lines for missing or extra brackets, parentheses, or commas.`,
        graduatedHints: [
          `Look closely at the line number reported in the error.`,
          `Verify every opening '(', '{', '[' has a matching closing delimiter.`,
          `Check for trailing or missing commas in object and array literals.`
        ]
      };
    }

    // 4. Default fallback
    return {
      lineIndex,
      rawCompilerError: rawError,
      whatHappened: `A runtime error occurred on line ${lineIndex}.`,
      whyItHappened: rawError || 'Node.js encountered an unhandled exception during execution.',
      howToFix: `Review the error message in the console and verify your logic on line ${lineIndex}.`,
      graduatedHints: [
        `Examine the error output in the console.`,
        `Check the line indicated in the stack trace.`,
        `Use console.log to inspect intermediate values before the failing line.`
      ]
    };
  }

  /**
   * Generates guided hints when the code runs without crashing but output fails the test case.
   */
  public static analyzeTestFailure(
    testCase: TestCase,
    actualOutput: string,
    userCode: string
  ): GuidedCorrection {
    const expected = (testCase.expectedOutput || '').trim();
    const actual = (actualOutput || '').trim();

    return {
      lineIndex: 1,
      rawCompilerError: `Expected: "${expected}"\nActual: "${actual}"`,
      whatHappened: `Your program output didn't match the expected test case output.`,
      whyItHappened: `Expected "${expected}", but received "${actual}".`,
      howToFix: `Check your console.log output formatting, spacing, and capitalization to match the instructions.`,
      graduatedHints: [
        `Compare your program output with the expected output character by character.`,
        `Check for missing punctuation, extra spaces, or case differences.`,
        `Make sure you are printing the final result with console.log().`
      ]
    };
  }
}
