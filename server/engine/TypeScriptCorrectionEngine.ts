import { GuidedCorrection, TestCase } from '../../src/types';

export class TypeScriptCorrectionEngine {
  /**
   * Translates raw TypeScript compiler (tsc/tsx) diagnostics and runtime stack traces
   * into a structured, educational guided correction card.
   */
  public static analyzeTypeScriptError(
    rawStderr: string,
    rawStdout: string,
    userCode: string
  ): GuidedCorrection {
    const errorText = (rawStderr + '\n' + rawStdout).trim();
    const errorLines = errorText.split('\n');

    let lineIndex = 1;
    let rawError = '';
    let errorCode = '';

    // TypeScript diagnostic patterns:
    // main.ts(12,5): error TS2322: Type 'string' is not assignable to type 'number'.
    // main.ts:12:5 - error TS2339: Property 'age' does not exist on type 'User'.
    // /tmp/.../main.ts:12:15
    const tsLineRegex = /(?:main\.ts|src\/main\.ts)(?:[\(:])(\d+)(?:[,:](\d+)\)?)?(?:\s*-\s*error\s*(TS\d+))?/;

    for (let i = 0; i < errorLines.length; i++) {
      const line = errorLines[i].trim();
      const match = line.match(tsLineRegex);
      if (match) {
        lineIndex = parseInt(match[1], 10);
        if (match[3]) {
          errorCode = match[3];
        }
      }
      if (!rawError && (line.includes('error TS') || line.includes('Error:') || line.endsWith('Error'))) {
        rawError = line;
        const codeMatch = line.match(/error\s+(TS\d+):/);
        if (codeMatch) {
          errorCode = codeMatch[1];
        }
      }
    }

    if (!rawError && errorLines.length > 0) {
      rawError = errorLines.find(l => l.includes('error TS') || l.includes('Error')) || errorLines[0] || 'Typecheck or execution failed';
    }

    const codeLines = userCode.split('\n');
    const problemLineContent = codeLines[lineIndex - 1] || '';

    return this.generateFriendlyCorrection(lineIndex, rawError, errorCode, problemLineContent, userCode);
  }

  private static generateFriendlyCorrection(
    lineIndex: number,
    rawError: string,
    errorCode: string,
    lineContent: string,
    userCode: string
  ): GuidedCorrection {
    const errLower = rawError.toLowerCase();

    // 1. TS2322: Type mismatch / Type 'X' is not assignable to type 'Y'
    if (errorCode === 'TS2322' || errLower.includes('is not assignable to type')) {
      const typeMatch = rawError.match(/Type '([^']+)' is not assignable to type '([^']+)'/);
      const fromType = typeMatch ? typeMatch[1] : 'expression';
      const toType = typeMatch ? typeMatch[2] : 'target type';

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Type mismatch on line ${lineIndex}: cannot assign type "${fromType}" to "${toType}".`,
        whyItHappened: `TypeScript's static type checker enforces strict type safety. A value of type "${fromType}" lacks compatibility with "${toType}".`,
        howToFix: `Provide a value matching type "${toType}", or update the variable/property type annotation to accept "${fromType}".`,
        graduatedHints: [
          `Inspect the data type being assigned on line ${lineIndex}.`,
          `Check whether "${fromType}" needs type conversion (e.g. Number(x), String(x)) or a union type (${toType} | ${fromType}).`,
          `Ensure the value assigned strictly adheres to type "${toType}".`
        ]
      };
    }

    // 2. TS2339: Property does not exist on type
    if (errorCode === 'TS2339' || errLower.includes('does not exist on type')) {
      const propMatch = rawError.match(/Property '([^']+)' does not exist on type '([^']+)'/);
      const propName = propMatch ? propMatch[1] : 'property';
      const typeName = propMatch ? propMatch[2] : 'type';

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Property "${propName}" does not exist on type "${typeName}" on line ${lineIndex}.`,
        whyItHappened: `TypeScript verifies all property accesses against the interface or type shape. "${propName}" is not declared on "${typeName}".`,
        howToFix: `Add "${propName}" to the interface or type definition, or check for typos in the property name.`,
        graduatedHints: [
          `Check the spelling of property "${propName}".`,
          `Inspect the definition of "${typeName}" to see its declared fields.`,
          `Declare "${propName}?: ..." on the interface if it is optional.`
        ]
      };
    }

    // 3. TS2345: Argument type mismatch
    if (errorCode === 'TS2345' || errLower.includes('argument of type')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Invalid function argument on line ${lineIndex}.`,
        whyItHappened: `The argument passed does not match the parameter type expected by the function signature.`,
        howToFix: `Verify the types and order of arguments passed to the function call.`,
        graduatedHints: [
          `Look at the parameter types declared on the target function.`,
          `Verify that the argument passed matches the expected type.`,
          `Convert or cast the argument before passing it.`
        ]
      };
    }

    // 4. TS7006: Parameter implicitly has an 'any' type
    if (errorCode === 'TS7006' || errLower.includes('implicitly has an \'any\' type')) {
      const paramMatch = rawError.match(/Parameter '([^']+)' implicitly has an 'any' type/);
      const paramName = paramMatch ? paramMatch[1] : 'parameter';

      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Parameter "${paramName}" is missing an explicit type annotation on line ${lineIndex}.`,
        whyItHappened: `Under strict TypeScript settings (noImplicitAny), every function parameter must have an explicit type.`,
        howToFix: `Add an explicit type annotation: \`(${paramName}: string)\` or appropriate type.`,
        graduatedHints: [
          `Look at the function parameters on line ${lineIndex}.`,
          `Add a colon and type after "${paramName}".`,
          `Write \`${paramName}: number\` or the intended type directly after the parameter name.`
        ]
      };
    }

    // 5. TS2532: Object is possibly 'undefined' or 'null'
    if (errorCode === 'TS2532' || errLower.includes('possibly \'undefined\'') || errLower.includes('possibly \'null\'')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Potential null/undefined access on line ${lineIndex}.`,
        whyItHappened: `TypeScript's strict null checks detected that this variable might be null or undefined at runtime.`,
        howToFix: `Use optional chaining (?.) or an \`if\` guard check before accessing properties.`,
        graduatedHints: [
          `Check which variable might evaluate to undefined or null.`,
          `Add an if check (e.g. if (obj) { ... }) to narrow the type.`,
          `Use optional chaining like \`object?.property\` or nullish coalescing (\`??\`).`
        ]
      };
    }

    // 6. TS2554: Expected X arguments, but got Y
    if (errorCode === 'TS2554' || errLower.includes('expected') && errLower.includes('arguments, but got')) {
      return {
        lineIndex,
        rawCompilerError: rawError,
        whatHappened: `Incorrect number of arguments passed to function on line ${lineIndex}.`,
        whyItHappened: `The function expects a different number of arguments than were provided.`,
        howToFix: `Check the function signature and provide all required arguments, or mark optional parameters with \`?\`.`,
        graduatedHints: [
          `Count the arguments passed in the function call.`,
          `Compare with the parameters defined in the function declaration.`,
          `Provide any missing required arguments.`
        ]
      };
    }

    // 7. General fallback
    return {
      lineIndex,
      rawCompilerError: rawError,
      whatHappened: `TypeScript reported diagnostic ${errorCode || 'error'} on line ${lineIndex}.`,
      whyItHappened: rawError || 'Static type check or runtime execution failed.',
      howToFix: `Review the type annotations and definitions on line ${lineIndex} and check console output.`,
      graduatedHints: [
        `Examine the TypeScript compiler error message in detail.`,
        `Inspect the types on line ${lineIndex}.`,
        `Hover over or check your variable types to ensure they match the required interface.`
      ]
    };
  }

  /**
   * Generates guided hints when the code compiles and runs without crashing but output fails behavioral tests.
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
      whatHappened: `Your TypeScript program executed successfully, but its output did not match the expected test case.`,
      whyItHappened: `Expected "${expected}", but your program printed "${actual}".`,
      howToFix: `Check your console.log output formatting, spacing, and capitalization to match the instructions.`,
      graduatedHints: [
        `Compare your program output with the expected output character by character.`,
        `Check for missing punctuation, extra spaces, or case differences.`,
        `Make sure you are printing the final result with console.log().`
      ]
    };
  }
}
