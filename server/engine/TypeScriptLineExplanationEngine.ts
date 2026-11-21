import { LineExplanation } from '../../src/types';

export class TypeScriptLineExplanationEngine {
  /**
   * Explains a single line of TypeScript code with token breakdown, type mechanics,
   * and compiler behavior.
   */
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

    // 1. Comments
    if (lineText.startsWith('//') || lineText.startsWith('/*') || lineText.startsWith('*')) {
      return {
        lineText,
        lineNumber,
        summary: 'Comments document code and are stripped during TypeScript compilation.',
        breakdown: [
          { token: lineText.startsWith('//') ? '//' : '/*', description: 'Comment delimiter; erased at compile-time.' }
        ],
        underTheHood: 'TypeScript strips all comments unless --removeComments is set to false in tsconfig.'
      };
    }

    // 2. Interface declaration
    if (lineText.startsWith('interface ') || lineText.startsWith('export interface ')) {
      const match = lineText.match(/(?:export\s+)?interface\s+([A-Za-z0-9_$]+)(?:\s+extends\s+([A-Za-z0-9_$,\s]+))?/);
      const ifaceName = match ? match[1] : 'Interface';
      const extendsClause = match && match[2] ? match[2].trim() : undefined;

      const breakdown = [
        { token: 'interface', description: 'TypeScript keyword defining an open contract for object shapes.' },
        { token: ifaceName, description: `The named interface type.` },
      ];

      if (extendsClause) {
        breakdown.push({ token: `extends ${extendsClause}`, description: `Inherits all properties from base interface(s).` });
      }

      return {
        lineText,
        lineNumber,
        summary: `Defines an interface named \`${ifaceName}\` representing an object shape.`,
        breakdown,
        underTheHood: 'Interfaces are completely erased during compilation (zero runtime JavaScript emission).'
      };
    }

    // 3. Type alias declaration
    if (lineText.startsWith('type ') || lineText.startsWith('export type ')) {
      const match = lineText.match(/(?:export\s+)?type\s+([A-Za-z0-9_$]+)(?:<([^>]+)>)?\s*=\s*(.*)/);
      const typeName = match ? match[1] : 'TypeAlias';
      const generics = match && match[2] ? match[2].trim() : undefined;
      const typeDef = match && match[3] ? match[3].replace(/;$/, '').trim() : undefined;

      const breakdown = [
        { token: 'type', description: 'TypeScript keyword defining a custom type alias.' },
        { token: typeName, description: `Identifier name of the type alias.` },
      ];

      if (generics) {
        breakdown.push({ token: `<${generics}>`, description: 'Generic type parameters.' });
      }
      if (typeDef) {
        breakdown.push({ token: typeDef, description: 'Type expression assigned to this alias.' });
      }

      return {
        lineText,
        lineNumber,
        summary: `Defines a custom type alias \`${typeName}\`.`,
        breakdown,
        underTheHood: 'Type aliases create a reusable name for types; completely erased at runtime.'
      };
    }

    // 4. Enum declaration
    if (lineText.startsWith('enum ') || lineText.startsWith('const enum ') || lineText.startsWith('export enum ')) {
      const match = lineText.match(/(?:export\s+)?(?:const\s+)?enum\s+([A-Za-z0-9_$]+)/);
      const enumName = match ? match[1] : 'Enum';
      return {
        lineText,
        lineNumber,
        summary: `Defines an enum named \`${enumName}\` for a collection of related constants.`,
        breakdown: [
          { token: 'enum', description: 'TypeScript construct for defining named numeric or string constants.' },
          { token: enumName, description: 'The enum identifier.' }
        ],
        underTheHood: 'Standard enums emit a real runtime JavaScript object with reverse key-value mappings.'
      };
    }

    // 5. Generic function / method with <T>
    if (lineText.includes('<') && lineText.includes('>') && (lineText.includes('function ') || lineText.includes('=>') || lineText.includes('class '))) {
      return {
        lineText,
        lineNumber,
        summary: 'Declares a generic definition parameterizing types with `<T>`.',
        breakdown: [
          { token: '<...>', description: 'Generic type parameter placeholder allowing functions or types to work with various data types safely.' }
        ],
        underTheHood: 'Generics provide static type safety without runtime code duplication; erased during compilation.'
      };
    }

    // 6. Typed variable declaration (const x: Type = ... or let x: Type = ...)
    if ((lineText.startsWith('const ') || lineText.startsWith('let ')) && lineText.includes(':')) {
      const keyword = lineText.startsWith('const ') ? 'const' : 'let';
      const declMatch = lineText.match(/(?:const|let)\s+([A-Za-z0-9_$]+)\s*:\s*([^=;]+)(?:\s*=\s*(.*))?/);
      const varName = declMatch ? declMatch[1] : 'variable';
      const typeAnno = declMatch ? declMatch[2].trim() : 'type';
      const valExpr = declMatch && declMatch[3] ? declMatch[3].replace(/;$/, '').trim() : undefined;

      const breakdown = [
        { token: keyword, description: `Declares a block-scoped ${keyword === 'const' ? 'constant' : 'variable'}.` },
        { token: varName, description: 'Variable name.' },
        { token: `: ${typeAnno}`, description: `Explicit static type annotation enforced by the compiler.` },
      ];

      if (valExpr) {
        breakdown.push({ token: '=', description: 'Assignment operator.' });
        breakdown.push({ token: valExpr, description: 'Assigned initial value.' });
      }

      return {
        lineText,
        lineNumber,
        summary: `Declares \`${varName}\` with explicit type annotation \`${typeAnno}\`.`,
        breakdown,
        underTheHood: 'The type annotation is verified by the compiler and stripped; JavaScript runtime only sees the variable declaration.'
      };
    }

    // 7. Typed function declaration: function name(param: Type): ReturnType
    if (lineText.startsWith('function ') || lineText.startsWith('export function ') || lineText.startsWith('async function ')) {
      const match = lineText.match(/function\s+([A-Za-z0-9_$]+)\s*\((.*?)\)(?:\s*:\s*([^\{]+))?/);
      const fnName = match ? match[1] : 'function';
      const params = match ? match[2] : '';
      const returnType = match && match[3] ? match[3].trim() : undefined;

      const breakdown = [
        { token: 'function', description: 'Keyword declaring a function.' },
        { token: fnName, description: 'Function identifier.' },
        { token: `(${params})`, description: 'Typed parameter list.' },
      ];

      if (returnType) {
        breakdown.push({ token: `: ${returnType}`, description: 'Explicit return type contract.' });
      }

      return {
        lineText,
        lineNumber,
        summary: `Declares function \`${fnName}\` with typed parameters and return type.`,
        breakdown,
        underTheHood: 'TypeScript ensures callers pass valid arguments and the function returns the declared type.'
      };
    }

    // 8. Type assertion: `value as Type`
    if (lineText.includes(' as ')) {
      return {
        lineText,
        lineNumber,
        summary: 'Uses a type assertion (`as`) to override TypeScript\'s inferred type.',
        breakdown: [
          { token: 'as', description: 'Type assertion telling the compiler to treat the expression as a specific type.' }
        ],
        underTheHood: 'Type assertions do not perform runtime casting or data conversion; they only silence compile-time checks.'
      };
    }

    // 9. console.log / console.error call
    if (lineText.includes('console.log(') || lineText.includes('console.error(')) {
      return {
        lineText,
        lineNumber,
        summary: 'Calls console.log() to print formatted output to the terminal.',
        breakdown: [
          { token: 'console.log(...)', description: 'Standard output method in Node.js.' }
        ],
        underTheHood: 'Executes natively on Node.js after TypeScript types are stripped.'
      };
    }

    // 10. Return statement
    if (lineText.startsWith('return ') || lineText === 'return;' || lineText === 'return') {
      const val = lineText.replace(/^return\s*/, '').replace(/;$/, '').trim();
      return {
        lineText,
        lineNumber,
        summary: `Returns ${val ? `\`${val}\`` : 'undefined'} from the function.`,
        breakdown: [
          { token: 'return', description: 'Exits function execution and passes back a return value.' },
          ...(val ? [{ token: val, description: 'Expression value being returned.' }] : [])
        ],
        underTheHood: 'Compiler verifies the returned value is assignable to the declared function return type.'
      };
    }

    // 11. General fallback
    return {
      lineText,
      lineNumber,
      summary: `Executes TypeScript statement: \`${lineText}\`.`,
      breakdown: [
        { token: lineText, description: 'TypeScript statement or expression.' }
      ],
      underTheHood: 'Typechecked by TypeScript compiler and executed by Node.js.'
    };
  }

  /**
   * Alias for explain() to maintain compatibility with LanguageAdapter.
   */
  public static explainLine(code: string, lineNumber: number): LineExplanation {
    return this.explain(code, lineNumber);
  }
}
