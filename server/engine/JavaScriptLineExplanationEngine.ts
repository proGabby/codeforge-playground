import { LineExplanation } from '../../src/types';

export class JavaScriptLineExplanationEngine {
  /**
   * Explains a single line of JavaScript code with syntax breakdown and V8 runtime details.
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
            summary: 'Comments document code and are stripped by the V8 engine during parsing.',
            breakdown: [
              { token: lineText.startsWith('//') ? '//' : '/*', description: 'Comment delimiter; ignored by the JavaScript engine.' }
            ],
            underTheHood: 'Comments have zero runtime memory overhead.'
          };
        }

          // 2. console.log / console.error / console.warn
          if (lineText.includes('console.log(') || lineText.includes('console.error(') || lineText.includes('console.warn(')) {
            const match = lineText.match(/console\.(log|error|warn)\((.*)\)/);
            const method = match ? match[1] : 'log';
            const args = match ? match[2] : '';
            return {
              lineText,
              lineNumber,
              summary: `Calls \`console.${method}()\` to print formatted values to standard output.`,
              breakdown: [
                { token: `console.${method}`, description: `Built-in Node.js debugging and standard output method.` },
                { token: `(${args})`, description: 'Arguments evaluated and formatted into output string.' }
              ],
              underTheHood: 'Node.js serializes arguments and writes to process.stdout followed by an OS newline.'
            };
          }

            // 3. Variable declarations: const
            if (lineText.startsWith('const ')) {
              const parts = lineText.replace(/^const\s+/, '').split('=');
              const varName = parts[0].trim();
              const valExpr = parts.slice(1).join('=').replace(/;$/, '').trim();

              return {
                lineText,
                lineNumber,
                summary: `Declares an immutable block-scoped constant \`${varName}\`.`,
                breakdown: [
                  { token: 'const', description: 'Keyword creating a block-scoped immutable binding that cannot be reassigned.' },
                  { token: varName, description: 'Identifier name of the constant.' },
                  { token: '=', description: 'Assignment operator binding the initial value.' },
                  ...(valExpr ? [{ token: valExpr, description: 'Initial value expression.' }] : [])
                ],
                underTheHood: 'Resides in the lexical environment record. Reassignment throws a TypeError at runtime.'
              };
            }

              // 4. Variable declarations: let
              if (lineText.startsWith('let ')) {
                const parts = lineText.replace(/^let\s+/, '').split('=');
                const varName = parts[0].trim();
                const valExpr = parts.slice(1).join('=').replace(/;$/, '').trim();

                return {
                  lineText,
                  lineNumber,
                  summary: `Declares a block-scoped reassignable variable \`${varName}\`.`,
                  breakdown: [
                    { token: 'let', description: 'Keyword creating a block-scoped variable that can be reassigned.' },
                    { token: varName, description: 'Variable identifier name.' },
                    ...(valExpr ? [
                      { token: '=', description: 'Assignment operator.' },
                      { token: valExpr, description: 'Initial value assigned to variable.' }
                    ] : [])
                  ],
                  underTheHood: 'Scoped strictly to enclosing curly braces {}. Not accessible before declaration (Temporal Dead Zone).'
                };
              }

                // 5. Variable declarations: var
                if (lineText.startsWith('var ')) {
                  const parts = lineText.replace(/^var\s+/, '').split('=');
                  const varName = parts[0].trim();

                  return {
                    lineText,
                    lineNumber,
                    summary: `Declares a function-scoped or global variable \`${varName}\`.`,
                    breakdown: [
                      { token: 'var', description: 'Legacy keyword declaring a function-scoped hoisted variable.' },
                      { token: varName, description: 'Variable identifier name.' }
                    ],
                    underTheHood: 'Hoisted to the top of the enclosing function scope and initialized with undefined.'
                  };
                }

                  // 6. Arrow functions: const fn = (...) => ... or (...) => ...
                  if (lineText.includes('=>')) {
                    return {
                      lineText,
                      lineNumber,
                      summary: 'Defines an arrow function expression with lexical `this` binding.',
                      breakdown: [
                        { token: '=>', description: 'Fat arrow operator defining an anonymous function expression.' }
                      ],
                      underTheHood: 'Arrow functions do not bind their own this, arguments, or super; they resolve lexically.'
                    };
                  }

                    // 7. Standard function declaration
                    if (lineText.startsWith('function ') || lineText.startsWith('async function ')) {
                      const isAsync = lineText.startsWith('async ');
                      const match = lineText.match(/(?:async\s+)?function\s*([a-zA-Z0-9_$]*)\s*\((.*?)\)/);
                      const fnName = match && match[1] ? match[1] : 'anonymous';
                      const params = match ? match[2] : '';

                      return {
                        lineText,
                        lineNumber,
                        summary: `Declares ${isAsync ? 'an asynchronous' : 'a standard'} function named \`${fnName}\`.`,
                        breakdown: [
                          ...(isAsync ? [{ token: 'async', description: 'Designates function returns a Promise and can use await.' }] : []),
                          { token: 'function', description: 'Keyword initiating function declaration.' },
                          { token: fnName, description: 'Function identifier.' },
                          { token: `(${params})`, description: 'Formal parameter list.' }
                        ],
                        underTheHood: 'Function declarations are hoisted to the top of their enclosing scope with their full implementation.'
                      };
                    }

                    // 8. Async / Await statement
                    if (lineText.includes('await ')) {
                      return {
                        lineText,
                        lineNumber,
                        summary: 'Pauses execution of the async function until the Promise settles.',
                        breakdown: [
                          { token: 'await', description: 'Operator pausing async function execution until the right-hand Promise resolves.' }
                        ],
                        underTheHood: 'Yields the current call stack back to the V8 event loop microtask queue without blocking the thread.'
                      };
                    }

                    // 9. Higher-order array methods (map, filter, reduce, forEach)
                    if (lineText.includes('.map(') || lineText.includes('.filter(') || lineText.includes('.reduce(') || lineText.includes('.forEach(')) {
                      const methodMatch = lineText.match(/\.(map|filter|reduce|forEach)\(/);
                      const method = methodMatch ? methodMatch[1] : 'map';
                      return {
                        lineText,
                        lineNumber,
                        summary: `Calls \`.${method}()\` on an array to transform or iterate through elements.`,
                        breakdown: [
                          { token: `.${method}`, description: `Higher-order array method that executes a callback function per element.` }
                        ],
                        underTheHood: `.${method === 'map' ? 'map creates a new transformed array' : method === 'filter' ? 'filter returns matching elements' : method === 'reduce' ? 'reduce accumulates elements into a single value' : 'forEach iterates elements'}.`
                      };
                    }

                    // 10. Return statement
                    if (lineText.startsWith('return ') || lineText === 'return;' || lineText === 'return') {
                      const returnExpr = lineText.replace(/^return\s*/, '').replace(/;$/, '').trim();
                      return {
                        lineText,
                        lineNumber,
                        summary: `Returns ${returnExpr ? `\`${returnExpr}\`` : 'undefined'} and exits the current function.`,
                        breakdown: [
                          { token: 'return', description: 'Keyword exiting function execution and returning a value to the caller.' },
                          ...(returnExpr ? [{ token: returnExpr, description: 'Expression value being returned.' }] : [])
                        ],
                        underTheHood: 'Pops the current stack frame off the execution call stack.'
                      };
                    }

                    // 11. Destructuring assignment
                    if ((lineText.startsWith('const {') || lineText.startsWith('let {') || lineText.startsWith('const [') || lineText.startsWith('let ['))) {
                      return {
                        lineText,
                        lineNumber,
                        summary: 'Destructures properties or elements directly into local variables.',
                        breakdown: [
                          { token: lineText.includes('{') ? '{ ... }' : '[ ... ]', description: 'Destructuring pattern extracting values by key or position.' }
                        ],
                        underTheHood: 'Performs shallow property lookups or iterator protocol steps to populate local variables.'
                      };
                    }

                    // 12. Try / Catch
                    if (lineText.startsWith('try ') || lineText.startsWith('catch ') || lineText.startsWith('} catch')) {
                      return {
                        lineText,
                        lineNumber,
                        summary: 'Exception handling block catching runtime errors.',
                        breakdown: [
                          { token: lineText.includes('try') ? 'try' : 'catch', description: 'Catches exceptions thrown in synchronous or awaited code.' }
                        ],
                        underTheHood: 'Sets up an exception handler frame on the V8 call stack.'
                      };
                    }

                    // 13. Default statement
                    return {
                      lineText,
                      lineNumber,
                      summary: `Executes JavaScript statement: \`${lineText}\`.`,
                      breakdown: [
                        { token: lineText, description: 'JavaScript expression or statement.' }
                      ],
                      underTheHood: 'Evaluated synchronously in the current V8 execution context.'
                    };
                  }

  /**
   * Alias for explain() to maintain compatibility with LanguageAdapter.
   */
  public static explainLine(code: string, lineNumber: number): LineExplanation {
    return this.explain(code, lineNumber);
  }
}
