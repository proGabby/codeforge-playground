import { GuidedCorrection, TestCase } from '../../src/types';

export class CorrectionEngine {
  /**
   * Translates raw compiler or test error into a single-line guided correction card.
   */
  public static analyzeCompilerError(
    rawStderr: string,
    rawStdout: string,
    userCode: string
  ): GuidedCorrection {
    const errorLines = (rawStderr + '\n' + rawStdout).split('\n');
    let lineIndex = 1;
    let rawError = '';

    // Search for Go compiler line pattern: main.go:7:14: error message or ./main.go:12: ...
    const lineRegex = /(?:main\.go|solution\.go):(\d+)(?::(\d+))?:\s*(.*)/i;

    for (const line of errorLines) {
      const match = line.match(lineRegex);
      if (match) {
        lineIndex = parseInt(match[1], 10);
        rawError = match[3] ? match[3].trim() : line.trim();
        break;
      }
    }

    if (!rawError && errorLines.length > 0) {
      rawError = errorLines.find(l => l.trim().length > 0) || 'Compilation failed';
    }

    // Get the offending line from user code if possible
    const codeLines = userCode.split('\n');
    const problemLineContent = codeLines[lineIndex - 1] || '';

    return this.generateFriendlyCorrection(lineIndex, rawError, problemLineContent, userCode);
  }

  /**
   * Generates a guided correction for a failing test case assertion.
   */
  public static analyzeTestFailure(
    failingTest: TestCase,
    actualOutput: string,
    userCode: string
  ): GuidedCorrection {
    const codeLines = userCode.split('\n');
    let relevantLine = 1;

    // Search for relevant keyword in user code (e.g. func definition or return)
    for (let i = 0; i < codeLines.length; i++) {
      if (codeLines[i].includes('return') || codeLines[i].includes('func ') || codeLines[i].includes('fmt.')) {
        relevantLine = i + 1;
      }
    }

    const inputDesc = failingTest.input ? `for input \`${failingTest.input}\`` : '';
    const whatHappened = `Line ${relevantLine} logic result didn't match expectation ${inputDesc}.`;
    const whyItHappened = `Expected output was \`${failingTest.expectedOutput}\`, but your code returned \`${actualOutput.trim()}\`.`;
    const howToFix = `Review your algorithm logic on line ${relevantLine} to handle edge cases properly.`;

    const graduatedHints = [
      `Check your calculations ${inputDesc}. The output isn't matching what was expected.`,
      `Compare your actual result \`${actualOutput.trim()}\` with the expected result \`${failingTest.expectedOutput}\`.`,
      `Double check the line where you compute and return the final result.`
    ];

    return {
      lineIndex: relevantLine,
      whatHappened,
      whyItHappened,
      howToFix,
      graduatedHints,
    };
  }

  private static generateFriendlyCorrection(
    lineIndex: number,
    rawError: string,
    lineContent: string,
    userCode: string
  ): GuidedCorrection {
    const lowerErr = rawError.toLowerCase();

    // 1. Missing closing parenthesis / bracket
    if (lowerErr.includes('syntax error: unexpected newline') || lowerErr.includes('unexpected semicolon') || lowerErr.includes('expected \')\'') || lowerErr.includes('expected \'}\'')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} seems to be missing a matching parenthesis or bracket.`,
        whyItHappened: `Go expects every opening bracket \`(\` or \`{\` to have a corresponding closing \`)\` or \`}\`.`,
        howToFix: `Check line ${lineIndex} and ensure all open brackets are properly closed.`,
        graduatedHints: [
          `Look closely at the punctuation near line ${lineIndex}.`,
          `Count your opening and closing brackets: \`(\` and \`)\`.`,
          `Add the missing closing bracket/parenthesis at the end of line ${lineIndex}.`
        ]
      };
    }

    // 2. Print instead of return
    if (lineContent.includes('fmt.Print') && !userCode.includes('return')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} prints the result instead of returning it.`,
        whyItHappened: `Your function signature specifies a return type, but \`fmt.Println\` sends text to stdout rather than returning a value to the caller.`,
        howToFix: `Replace \`fmt.Println\` with a return statement.`,
        graduatedHints: [
          `Something is wrong with how you're sending the value back.`,
          `Functions use a specific keyword to send a value back to their caller.`,
          `Try replacing \`fmt.Println\` with the \`return\` keyword.`
        ]
      };
    }

    // 3. Type mismatch
    if (lowerErr.includes('cannot use') || lowerErr.includes('mismatched types') || lowerErr.includes('cannot convert')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} contains a data type mismatch.`,
        whyItHappened: `Go is statically typed. You cannot assign or compare incompatible types (such as string and int) without explicit conversion.`,
        howToFix: `Ensure all variables in the expression have compatible types or use explicit type conversion.`,
        graduatedHints: [
          `Check the data types of the variables on line ${lineIndex}.`,
          `Go requires exact matching types when performing operations or assignments.`,
          `Use type conversion (like \`int(value)\` or \`string(value)\`) if you need to convert types.`
        ]
      };
    }

    // 4. Undefined variable or package
    if (lowerErr.includes('undefined')) {
      const varMatch = rawError.match(/undefined:\s*([a-zA-Z0-9_]+)/i);
      const varName = varMatch ? varMatch[1] : 'symbol';

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} references \`${varName}\`, which hasn't been declared or imported.`,
        whyItHappened: `In Go, all variables must be declared before use, and package functions require an \`import\` statement at the top.`,
        howToFix: `Check if you misspelled \`${varName}\`, forgot to declare it with \`:=\`, or forgot an import statement like \`import "fmt"\`.`,
        graduatedHints: [
          `Go doesn't recognize \`${varName}\` on line ${lineIndex}.`,
          `Make sure \`${varName}\` is spelled correctly and declared before this line.`,
          `If \`${varName}\` is from a package (like \`fmt\`), check your \`import\` statements.`
        ]
      };
    }

    // 5. Short declaration error (already declared or non-name on left)
    if (lowerErr.includes('no new variables on left side of :=')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} uses \`:=\` on a variable that is already declared.`,
        whyItHappened: `The short declaration operator \`:=\` creates a NEW variable. Use standard assignment \`=\` when reassigning existing variables.`,
        howToFix: `Change \`:=\` to \`=\` on line ${lineIndex}.`,
        graduatedHints: [
          `Check how you are assigning the variable on line ${lineIndex}.`,
          `\`:=\` is only for creating new variables. Use \`=\` for reassigning existing ones.`,
          `Replace \`:=\` with \`=\` on line ${lineIndex}.`
        ]
      };
    }

    // Default fallback correction
    return {
      lineIndex,
      rawCompilerError: rawError,
      whatHappened: `Line ${lineIndex} needs attention.`,
      whyItHappened: rawError,
      howToFix: `Review line ${lineIndex} syntax and logic carefully.`,
      graduatedHints: [
        `Focus your attention on line ${lineIndex}.`,
        `Check for proper Go syntax, variable declarations, and function signatures.`,
        `Read the compiler message details: "${rawError}".`
      ]
    };
  }
}
