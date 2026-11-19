import { LineExplanation } from '../../src/types';

export class PythonLineExplanationEngine {
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

    // Async function definition (async def)
    if (lineText.startsWith('async def ')) {
      const match = lineText.match(/^async\s+def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)(?:\s*->\s*([a-zA-Z0-9_\[\],\s]+))?:/);
      const fnName = match ? match[1] : 'async_function';
      const params = match ? match[2] : '';
      const returnType = match ? match[3] : undefined;

      const breakdown = [
        { token: 'async def', description: 'Declares an asynchronous native coroutine function that can be paused with await.' },
        { token: fnName, description: `The identifier name of the coroutine.` },
        { token: `(${params})`, description: `The parameters accepted by ${fnName}.` },
      ];

      if (returnType) {
        breakdown.push({ token: `-> ${returnType}`, description: `Optional PEP 484 type hint specifying coroutine return type.` });
      }

      breakdown.push({ token: ':', description: 'Colon signaling the start of the coroutine body block.' });

      return {
        lineText,
        lineNumber,
        summary: `Defines an asynchronous coroutine named \`${fnName}\`.`,
        breakdown,
        underTheHood: 'Returns a coroutine object executed cooperatively by an asyncio event loop.'
      };
    }

    // Function definition (def)
    if (lineText.startsWith('def ')) {
      const match = lineText.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)(?:\s*->\s*([a-zA-Z0-9_\[\],\s]+))?:/);
      const fnName = match ? match[1] : 'function_name';
      const params = match ? match[2] : '';
      const returnType = match ? match[3] : undefined;

      const breakdown = [
        { token: 'def', description: 'Python keyword that defines a new function.' },
        { token: fnName, description: `The name of the function being declared.` },
        { token: `(${params})`, description: `The parameter list accepted by ${fnName}.` },
      ];

      if (returnType) {
        breakdown.push({ token: `-> ${returnType}`, description: `Optional PEP 484 type hint specifying expected return type.` });
      }

      breakdown.push({ token: ':', description: 'Colon signaling the start of the function body block.' });

      return {
        lineText,
        lineNumber,
        summary: `Defines a reusable function named \`${fnName}\`.`,
        breakdown,
        underTheHood: 'Python creates a first-class function object in memory bound to the name in the current scope.'
      };
    }

    // Class definition (class)
    if (lineText.startsWith('class ')) {
      const match = lineText.match(/^class\s+([a-zA-Z0-9_]+)(?:\s*\((.*?)\))?:/);
      const className = match ? match[1] : 'ClassName';
      const baseClass = match && match[2] ? match[2] : null;

      const breakdown = [
        { token: 'class', description: 'Python keyword that creates a new user-defined class blueprint.' },
        { token: className, description: 'The identifier name for the class (conventionally PascalCase).' },
      ];

      if (baseClass) {
        breakdown.push({ token: `(${baseClass})`, description: `Parent class inherited by ${className}.` });
      }

      breakdown.push({ token: ':', description: 'Colon introducing the class attribute and method suite.' });

      return {
        lineText,
        lineNumber,
        summary: `Declares a class blueprint named \`${className}\`${baseClass ? ` inheriting from \`${baseClass}\`` : ''}.`,
        breakdown,
        underTheHood: 'Python executes the class body in a temporary namespace to generate the new type object.'
      };
    }

    // Import statements
    if (lineText.startsWith('import ') || lineText.startsWith('from ')) {
      const isFrom = lineText.startsWith('from ');
      return {
        lineText,
        lineNumber,
        summary: isFrom
          ? 'Imports specific functions, classes, or variables from a module.'
          : 'Imports an entire module into the current namespace.',
        breakdown: isFrom
          ? [
            { token: 'from', description: 'Specifies the source module or package path.' },
            { token: 'import', description: 'Selects the specific symbols to bring into local scope.' }
          ]
          : [
            { token: 'import', description: 'Brings an external or standard library module into scope.' }
          ],
        underTheHood: 'Python searches `sys.path`, loads the module bytecode into `sys.modules`, and binds the name to the local symbol table.'
      };
    }

    // For loop
    if (lineText.startsWith('for ')) {
      const match = lineText.match(/^for\s+(.*?)\s+in\s+(.*?):/);
      const varName = match ? match[1] : 'item';
      const iterable = match ? match[2] : 'collection';

      return {
        lineText,
        lineNumber,
        summary: `Iterates over elements in \`${iterable}\`, assigning each to \`${varName}\`.`,
        breakdown: [
          { token: 'for', description: 'Loop control keyword.' },
          { token: varName, description: 'Variable that receives the next value on each iteration.' },
          { token: 'in', description: 'Membership operator connecting the loop variable to the sequence.' },
          { token: iterable, description: 'The sequence or iterator being traversed.' }
        ],
        underTheHood: 'Calls `iter(iterable)` to obtain an iterator, then repeatedly calls `next()` until `StopIteration` is raised.'
      };
    }

    // While loop
    if (lineText.startsWith('while ')) {
      return {
        lineText,
        lineNumber,
        summary: 'Repeatedly executes the indented block as long as the test condition evaluates to True.',
        breakdown: [
          { token: 'while', description: 'Loop control keyword executing based on a boolean condition.' },
          { token: ':', description: 'Colon starting the loop body.' }
        ],
        underTheHood: 'Evaluates condition truthiness at the start of every iteration before executing block bytecode.'
      };
    }

    // Conditionals (if, elif, else)
    if (lineText.startsWith('if ') || lineText.startsWith('elif ') || lineText.startsWith('else:')) {
      const keyword = lineText.startsWith('if ') ? 'if' : (lineText.startsWith('elif ') ? 'elif' : 'else');
      return {
        lineText,
        lineNumber,
        summary: keyword === 'else'
          ? 'Default branch executed when all preceding conditions were False.'
          : `Branch executed only if the conditional expression evaluates to True.`,
        breakdown: [
          { token: keyword, description: 'Conditional branching control flow keyword.' },
          { token: ':', description: 'Colon introducing the conditional execution block.' }
        ],
        underTheHood: 'Python uses truth-value testing where empty containers, 0, and None are considered False.'
      };
    }

    // Context manager (with)
    if (lineText.startsWith('with ')) {
      return {
        lineText,
        lineNumber,
        summary: 'Context manager statement ensuring guaranteed setup and teardown cleanup (e.g. closing files).',
        breakdown: [
          { token: 'with', description: 'Context manager keyword invoking `__enter__` and `__exit__`.' },
          { token: 'as', description: 'Binds the result of `__enter__()` to a target variable.' }
        ],
        underTheHood: 'Guarantees execution of `__exit__()` even if an unhandled exception occurs inside the block.'
      };
    }

    // Try / Except / Finally
    if (lineText.startsWith('try:') || lineText.startsWith('except') || lineText.startsWith('finally:')) {
      return {
        lineText,
        lineNumber,
        summary: lineText.startsWith('try:')
          ? 'Begins a protected block where exceptions can be intercepted and handled gracefully.'
          : 'Catches and processes an exception raised within the corresponding try block.',
        breakdown: [
          { token: lineText.split(/[\s:]/)[0], description: 'Exception handling keyword.' }
        ],
        underTheHood: 'Unwinds the runtime call stack to the nearest matching except handler.'
      };
    }

    // Yield statement (yield / yield from)
    if (lineText.startsWith('yield ') || lineText.startsWith('yield\n') || lineText === 'yield') {
      const isYieldFrom = lineText.startsWith('yield from ');
      const yieldedVal = lineText.replace(/^yield(\s+from)?/, '').trim();
      return {
        lineText,
        lineNumber,
        summary: isYieldFrom
          ? `Delegates generator iteration to sub-generator or iterable \`${yieldedVal}\`.`
          : `Pauses generator execution and emits \`${yieldedVal || 'None'}\` to the caller.`,
        breakdown: [
          { token: isYieldFrom ? 'yield from' : 'yield', description: 'Generator keyword that suspends execution and yields value lazily.' },
          ...(yieldedVal ? [{ token: yieldedVal, description: 'Value or sub-generator expression being yielded.' }] : []),
        ],
        underTheHood: 'Saves local frame state and returns control to caller; resumes on next() or send().'
      };
    }

    // Return statement
    if (lineText.startsWith('return ') || lineText === 'return') {
      const retVal = lineText.replace('return', '').trim();
      return {
        lineText,
        lineNumber,
        summary: retVal ? `Exits function immediately and sends \`${retVal}\` back to the caller.` : 'Exits function returning `None`.',
        breakdown: [
          { token: 'return', description: 'Keyword to terminate function execution and pass back a value.' }
        ],
        underTheHood: 'Pops the current stack frame off the execution call stack.'
      };
    }

    // Print statement
    if (lineText.startsWith('print(')) {
      return {
        lineText,
        lineNumber,
        summary: 'Built-in function that writes string representation of arguments to standard output (stdout).',
        breakdown: [
          { token: 'print(...)', description: 'Built-in I/O function printing to the terminal with automatic newline.' }
        ],
        underTheHood: 'Calls `str()` on each argument and writes the formatted stream to `sys.stdout`.'
      };
    }

    // Generic fallback line breakdown
    return {
      lineText,
      lineNumber,
      summary: `Executes Python statement on line ${lineNumber}.`,
      breakdown: [
        { token: lineText.slice(0, 30), description: 'Python expression or assignment.' }
      ],
      underTheHood: 'Compiled into CPython bytecode instructions executed on the virtual machine.'
    };
  }
}
