import { LineExplanation } from '../../src/types';

export class LineExplanationEngine {
  public static explain(userCode: string, lineNumber: number): LineExplanation {
    const lines = userCode.split('\n');
    const lineText = lines[lineNumber - 1] ? lines[lineNumber - 1].trim() : '';

    if (!lineText) {
      return {
        lineText: '',
        lineNumber,
        summary: 'Empty line',
        breakdown: [],
      };
    }

    //  Package declaration
    if (lineText.startsWith('package ')) {
      const pkgName = lineText.replace('package ', '').trim();
      return {
        lineText,
        lineNumber,
        summary: `Declares that this file belongs to the \`${pkgName}\` package.`,
        breakdown: [
          { token: 'package', description: 'Go keyword defining the namespace unit.' },
          { token: pkgName, description: 'Package identifier. `main` makes the program executable.' }
        ],
        underTheHood: 'In Go, all `.go` files in a directory must belong to the same package name.'
      };
    }

    //  Import statement
    if (lineText.startsWith('import ')) {
      return {
        lineText,
        lineNumber,
        summary: 'Imports standard library or external packages into this file.',
        breakdown: [
          { token: 'import', description: 'Go keyword to include package dependencies.' },
          { token: '"fmt"', description: 'Standard library package for formatted text output and input.' }
        ],
        underTheHood: 'Go compiler checks that every imported package is actively used; unused imports trigger compile errors.'
      };
    }

    //  Goroutine invocation
    if (lineText.startsWith('go ')) {
      const fnCall = lineText.replace('go ', '').trim();
      return {
        lineText,
        lineNumber,
        summary: `Launches \`${fnCall}\` in a concurrent lightweight Goroutine.`,
        breakdown: [
          { token: 'go', description: 'Keyword to spawn an asynchronous goroutine execution.' },
          { token: fnCall, description: 'Function or closure being executed concurrently.' }
        ],
        underTheHood: 'Goroutines have initial stack sizes as small as 2KB, managed dynamically by the Go M:N runtime scheduler.'
      };
    }

    //  Short variable declaration
    if (lineText.includes(':=') && !lineText.includes('if ')) {
      const parts = lineText.split(':=');
      const varName = parts[0].trim();
      const valueExpr = parts[1].trim();

      return {
        lineText,
        lineNumber,
        summary: `Declares a new variable \`${varName}\` and infers its data type from \`${valueExpr}\`.`,
        breakdown: [
          { token: varName, description: 'Newly created variable identifier.' },
          { token: ':=', description: 'Short declaration operator (infer type & initialize).' },
          { token: valueExpr, description: 'Expression value used to infer type and set initial value.' }
        ],
        underTheHood: 'Short declaration \`:=\` is shorthand for \`var name Type = value\`. Type is locked at compile time.'
      };
    }

    //  Function declaration
    if (lineText.startsWith('func ')) {
      return {
        lineText,
        lineNumber,
        summary: 'Declares a function with parameters and return types.',
        breakdown: [
          { token: 'func', description: 'Keyword initiating a function declaration.' },
          { token: 'name', description: 'Function identifier used for calling the function.' },
          { token: '(params)', description: 'Input variables and their explicit types.' },
          { token: 'returnType', description: 'Type(s) of values returned by this function.' }
        ],
        underTheHood: 'Go functions support multiple return values, passing arguments by value by default.'
      };
    }

    //  Channel make
    if (lineText.includes('make(chan ')) {
      return {
        lineText,
        lineNumber,
        summary: 'Creates a typed synchronization channel for communicating between Goroutines.',
        breakdown: [
          { token: 'make', description: 'Built-in allocation function for channels, slices, and maps.' },
          { token: 'chan', description: 'Channel keyword for safe concurrent data passing.' }
        ],
        underTheHood: 'Unbuffered channels block sending until receiving goroutine is ready, enforcing synchronization.'
      };
    }

    //  Struct definition
    if (lineText.includes('type ') && lineText.includes('struct')) {
      const structName = lineText.split(' ')[1] || 'Struct';
      return {
        lineText,
        lineNumber,
        summary: `Defines a composite data structure blueprint named \`${structName}\`.`,
        breakdown: [
          { token: 'type', description: 'Keyword creating a custom type definition.' },
          { token: structName, description: 'Name of the struct type.' },
          { token: 'struct', description: 'Collection of named fields grouped together in memory.' }
        ],
        underTheHood: 'Go structs are stored in contiguous memory layout, maximizing CPU cache locality.'
      };
    }

    //  fmt.Println / Printf call
    if (lineText.includes('fmt.Print')) {
      return {
        lineText,
        lineNumber,
        summary: 'Prints formatted text to standard stdout output.',
        breakdown: [
          { token: 'fmt', description: 'Format package name.' },
          { token: 'Println / Printf', description: 'Function to format and output text to console.' }
        ]
      };
    }

    // Fallback explanation
    return {
      lineText,
      lineNumber,
      summary: `Executes Go code statement on line ${lineNumber}.`,
      breakdown: [
        { token: lineText, description: 'Executable Go statement.' }
      ],
      underTheHood: 'Go compiles directly to native machine code without requiring a virtual machine.'
    };
  }
}
