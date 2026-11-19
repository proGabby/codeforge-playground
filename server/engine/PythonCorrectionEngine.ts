import { GuidedCorrection, TestCase } from '../../src/types';

export class PythonCorrectionEngine {
  /**
   * Translates raw Python runtime or syntax tracebacks into a friendly guided correction card.
   */
  public static analyzePythonError(
    rawStderr: string,
    rawStdout: string,
    userCode: string
  ): GuidedCorrection {
    const errorText = (rawStderr + '\n' + rawStdout).trim();
    const errorLines = errorText.split('\n');

    let lineIndex = 1;
    let rawError = '';
    let errorType = '';

    // Search for standard Python traceback line:
    // File "main.py", line 12, in <module>
    // File "<string>", line 4
    const lineRegex = /File\s+["'].*?["'],\s*line\s*(\d+)/i;

    for (let i = errorLines.length - 1; i >= 0; i--) {
      const line = errorLines[i].trim();
      if (!rawError && (line.includes('Error:') || line.includes('Exception:'))) {
        rawError = line;
        const errTypeMatch = line.match(/^([A-Za-z]+Error|[A-Za-z]+Exception):/);
        if (errTypeMatch) {
          errorType = errTypeMatch[1];
        }
      }
      const match = line.match(lineRegex);
      if (match) {
        lineIndex = parseInt(match[1], 10);
        if (rawError) break;
      }
    }

    // Fallback if no specific error line was captured
    if (!rawError && errorLines.length > 0) {
      rawError = errorLines[errorLines.length - 1] || 'Execution failed';
    }

    const codeLines = userCode.split('\n');
    const problemLineContent = codeLines[lineIndex - 1] || '';

    return this.generateFriendlyCorrection(lineIndex, rawError, errorType, problemLineContent, userCode);
  }

  /**
   * Generates student-friendly explanation and suggestions based on Python error classification.
   */
  private static generateFriendlyCorrection(
    lineIndex: number,
    rawError: string,
    errorType: string,
    lineContent: string,
    userCode: string
  ): GuidedCorrection {
    const trimmedLine = lineContent.trim();
    const lowerErr = rawError.toLowerCase();

    // 1. Indentation Errors
    if (errorType === 'IndentationError' || lowerErr.includes('indentationerror')) {
      if (lowerErr.includes('expected an indented block')) {
        return {
          lineIndex,
          rawCompilerError: rawError,
          whatHappened: `Line ${lineIndex} is missing an indented block.`,
          whyItHappened: `In Python, code blocks (after \`def\`, \`if\`, \`for\`, \`while\`, \`class\`, \`with\`) MUST be indented with 4 spaces or a tab.`,
          howToFix: `Add an indented line of code (or the \`pass\` keyword) below the colon \`:\`.`,
          graduatedHints: [
            `Python relies on indentation to group statements into blocks.`,
            `Look right after the line ending with a colon \`:\` (def, if, for, etc.).`,
            `Indent the next line with 4 spaces.`
          ]
        };
      }

      if (lowerErr.includes('unindent does not match')) {
        return {
          lineIndex,
          rawCompilerError: rawError,
          whatHappened: `Line ${lineIndex} has inconsistent indentation.`,
          whyItHappened: `Python requires every line in the same block to share the exact same level of indentation (avoid mixing tabs and spaces).`,
          howToFix: `Align line ${lineIndex} indentation with the surrounding block (prefer standard 4 spaces).`,
          graduatedHints: [
            `Check the indentation at the start of line ${lineIndex}.`,
            `Make sure you consistently use spaces (not tabs) across all lines.`,
            `Adjust the leading spaces on line ${lineIndex} to match the block.`
          ]
        };
      }

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} has an unexpected indentation level.`,
        whyItHappened: `Python encountered indentation where none was expected.`,
        howToFix: `Ensure line ${lineIndex} starts at the correct column level.`,
        graduatedHints: [
          `Look at the spaces at the beginning of line ${lineIndex}.`,
          `Only indent lines that follow a header statement ending in a colon \`:\`.`,
          `Remove leading spaces on line ${lineIndex}.`
        ]
      };
    }

    // Syntax Errors (e.g. missing colons, unbalanced brackets)
    if (errorType === 'SyntaxError' || lowerErr.includes('syntaxerror')) {
      if (lowerErr.includes('invalid syntax') && (
        trimmedLine.startsWith('if ') ||
        trimmedLine.startsWith('elif ') ||
        trimmedLine.startsWith('else') ||
        trimmedLine.startsWith('for ') ||
        trimmedLine.startsWith('while ') ||
        trimmedLine.startsWith('def ') ||
        trimmedLine.startsWith('class ') ||
        trimmedLine.startsWith('with ')
      ) && !trimmedLine.endsWith(':')) {
        return {
          lineIndex,
          rawCompilerError: rawError,
          whatHappened: `Line ${lineIndex} is missing a colon \`:\` at the end of the statement.`,
          whyItHappened: `In Python, compound statements (\`if\`, \`elif\`, \`else\`, \`for\`, \`while\`, \`def\`, \`class\`) must end with a colon \`:\` to start an indented block.`,
          howToFix: `Add a colon \`:\` to the end of line ${lineIndex}.`,
          graduatedHints: [
            `Check the very end of line ${lineIndex}.`,
            `Compound statements in Python always terminate with a colon.`,
            `Change line ${lineIndex} to end with \`:\`.`
          ]
        };
      }

      if (lowerErr.includes('unexpected eof while parsing')) {
        return {
          lineIndex,
          rawCompilerError: rawError,
          whatHappened: `Unclosed parenthesis \`(\`, bracket \`[\`, or brace \`{\` detected.`,
          whyItHappened: `Python reached the end of the file while waiting for a matching closing bracket or quote.`,
          howToFix: `Make sure all opening brackets \`(\`, \`[\`, \`{\` and quotes \`'\`, \`"\` are properly closed.`,
          graduatedHints: [
            `Count your opening and closing parentheses and brackets.`,
            `Check multi-line function calls, lists, or dictionary literals.`,
            `Add the missing closing bracket or parenthesis.`
          ]
        };
      }

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Line ${lineIndex} has invalid Python syntax.`,
        whyItHappened: rawError,
        howToFix: `Review line ${lineIndex} for missing colons, typos, or unclosed quotes/parentheses.`,
        graduatedHints: [
          `Inspect line ${lineIndex}: \`${trimmedLine}\`.`,
          `Check keywords, parentheses, and variable names.`,
          `Make sure string quotes and brackets are properly paired.`
        ]
      };
    }

    // NameError (undefined variable / function)
    if (errorType === 'NameError' || lowerErr.includes('nameerror')) {
      const nameMatch = rawError.match(/name\s+['"]([a-zA-Z0-9_]+)['"]\s+is not defined/i);
      const varName = nameMatch ? nameMatch[1] : 'symbol';

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `\`${varName}\` is not defined on line ${lineIndex}.`,
        whyItHappened: `In Python, variables and functions must be declared or imported before they can be referenced.`,
        howToFix: `Check if you misspelled \`${varName}\`, or declare/import it before line ${lineIndex}.`,
        graduatedHints: [
          `Python does not recognize the name \`${varName}\`.`,
          `Check for typos or case sensitivity (\`${varName}\` vs \`${varName.toLowerCase()}\`).`,
          `If \`${varName}\` comes from a module (like \`math\` or \`json\`), add an \`import\` at the top.`
        ]
      };
    }

    // TypeError (type mismatches)
    if (errorType === 'TypeError' || lowerErr.includes('typeerror')) {
      if (lowerErr.includes('can only concatenate str')) {
        return {
          lineIndex,
          rawCompilerError: rawError,
          whatHappened: `Cannot concatenate a string with a number on line ${lineIndex}.`,
          whyItHappened: `In Python, you cannot directly concatenate strings and integers using \`+\` without converting the number first.`,
          howToFix: `Use an f-string (e.g. \`f"Result: {val}"\`) or convert the number using \`str(val)\`.`,
          graduatedHints: [
            `Check the values you are adding with \`+\` on line ${lineIndex}.`,
            `Python does not automatically convert numbers to strings when using \`+\`.`,
            `Wrap the non-string variable in \`str()\` or use an f-string: \`f"{variable}"\`.`
          ]
        };
      }

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Data type mismatch or invalid operation on line ${lineIndex}.`,
        whyItHappened: rawError,
        howToFix: `Ensure all arguments and operands have compatible data types.`,
        graduatedHints: [
          `Check the data types being passed or operated on in line ${lineIndex}.`,
          `Verify function arguments and operation compatibility.`,
          `Use \`type(x)\` or explicit conversions like \`int()\`, \`str()\`, or \`float()\`.`
        ]
      };
    }

    // IndexError
    if (errorType === 'IndexError' || lowerErr.includes('indexerror')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Index out of range on line ${lineIndex}.`,
        whyItHappened: `You tried to access an element at an index that doesn't exist in the list or sequence.`,
        howToFix: `Check sequence bounds. Remember that Python uses 0-based indexing (valid indices are 0 to len - 1).`,
        graduatedHints: [
          `Look at the list or string indexing on line ${lineIndex}.`,
          `Remember that the first element is at index 0, and the last is at index \`len(items) - 1\`.`,
          `Verify the length of the list with \`len()\` before accessing elements.`
        ]
      };
    }

    // KeyError
    if (errorType === 'KeyError' || lowerErr.includes('keyerror')) {
      const keyMatch = rawError.match(/KeyError:\s*['"]?([a-zA-Z0-9_]+)['"]?/i);
      const keyName = keyMatch ? keyMatch[1] : 'key';

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Key \`${keyName}\` does not exist in the dictionary on line ${lineIndex}.`,
        whyItHappened: `Accessing \`dict[key]\` raises \`KeyError\` if the key has not been inserted yet.`,
        howToFix: `Use \`dict.get("${keyName}", default)\` or check \`if "${keyName}" in dict:\` first.`,
        graduatedHints: [
          `The dictionary does not contain the key \`${keyName}\`.`,
          `Check your spelling or verify that the key was added.`,
          `Use the safer \`.get()\` method: \`my_dict.get("${keyName}")\`.`
        ]
      };
    }

    // ZeroDivisionError
    if (errorType === 'ZeroDivisionError' || lowerErr.includes('zerodivisionerror')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Division by zero occurred on line ${lineIndex}.`,
        whyItHappened: `In Python, dividing by 0 using \`/\`, \`//\`, or \`%\` raises a \`ZeroDivisionError\`.`,
        howToFix: `Check that your denominator is not zero before dividing (e.g. \`if b != 0:\`).`,
        graduatedHints: [
          `A division or modulo operation on line ${lineIndex} has a denominator of 0.`,
          `Add a guard condition to prevent dividing when the divisor is 0.`,
          `Use \`if denominator != 0:\` before calculating.`
        ]
      };
    }

    // Fallback generic guidance
    return {
      lineIndex,
      rawCompilerError: rawError,
      whatHappened: `Line ${lineIndex} triggered an error: ${errorType || 'Runtime Issue'}.`,
      whyItHappened: rawError,
      howToFix: `Review line ${lineIndex} carefully for syntax or logic issues.`,
      graduatedHints: [
        `Focus your attention on line ${lineIndex}: \`${trimmedLine}\`.`,
        `Check for proper Python syntax, variable names, and expected data types.`,
        `Read the error details: "${rawError}".`
      ]
    };
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

    // Search for relevant return or print statement
    const returnIdx = codeLines.findIndex(l => l.trim().startsWith('return ') || l.trim().startsWith('print('));
    if (returnIdx !== -1) {
      relevantLine = returnIdx + 1;
    }

    const expectedTrimmed = failingTest.expectedOutput.trim();
    const actualTrimmed = actualOutput.trim();

    return {
      lineIndex: relevantLine,
      whatHappened: `Output mismatch on test case: expected "${expectedTrimmed}", but got "${actualTrimmed}".`,
      whyItHappened: `Your program ran without crashing, but its output did not match what the exercise required.`,
      howToFix: `Check your calculation logic and output format around line ${relevantLine}.`,
      graduatedHints: [
        `The test expected: "${expectedTrimmed}".`,
        `Your code produced: "${actualTrimmed}".`,
        `Double-check your return or print statement on line ${relevantLine}.`
      ]
    };
  }
}
