import { Exercise, Topic } from '../../../../src/types';

export const JAVASCRIPT_BEGINNER_TOPICS: (Topic & { exercises: Exercise[] })[] = [
  // 1. Hello World, Printing & Variables
  {
    id: 'js-hello-world',
    title: '1. Hello World, Printing & Variables',
    category: 'beginner',
    order: 1,
    description: 'Master console.log, let vs const, and template literals in JavaScript.',
    prerequisites: [],
    exerciseIds: ['js-hello-1', 'js-hello-2', 'js-hello-3'],
    exercises: [
      {
        id: 'js-hello-1',
        languageId: 'javascript',
        topicId: 'js-hello-world',
        title: 'Your First JavaScript Program',
        difficulty: 1,
        difficultyLabel: 'Level 1: Recognition',
        type: 'syntax',
        concept: 'js-console-log',
        instructions: 'Use `console.log()` to print `"Hello, CodeForge!"` to standard output.',
        starterCode: '// Write your code below to print "Hello, CodeForge!"\n',
        expectedBehavior: 'Prints "Hello, CodeForge!".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Hello, CodeForge!\n' }],
        hints: [
          { level: 1, text: 'Use JavaScript\'s built-in `console.log()` function.' },
          { level: 2, text: 'Pass `"Hello, CodeForge!"` as the argument.' },
          { level: 3, text: 'Write: `console.log("Hello, CodeForge!");`' },
        ],
        explanation: {
          simple: '`console.log()` prints messages or objects to the terminal console.',
          whyItWorks: 'In Node.js, `console.log()` writes data formatted to `process.stdout` followed by a newline.',
          syntaxBreakdown: [
            { token: 'console.log(...)', meaning: 'Standard output method in JavaScript and Node.js.' },
            { token: '"Hello, CodeForge!"', meaning: 'A string literal.' },
          ],
          underTheHood: 'V8 compiles console.log into an internal write call that serializes parameters.',
        },
      },
      {
        id: 'js-hello-2',
        languageId: 'javascript',
        topicId: 'js-hello-world',
        title: 'Variables: const vs. let',
        difficulty: 1,
        difficultyLabel: 'Level 1: Recognition',
        type: 'syntax',
        concept: 'js-variables',
        instructions: 'Declare a `const` named `course` with value `"JavaScript"`, and a `let` named `level` with value `1`. Print them separated by a space.',
        starterCode: '// Declare course and level below, then print them:\n',
        expectedBehavior: 'Prints "JavaScript 1".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'JavaScript 1\n' }],
        hints: [
          { level: 1, text: 'Use `const course = "JavaScript";` for immutable bindings.' },
          { level: 2, text: 'Use `let level = 1;` for reassignable variables.' },
          { level: 3, text: 'Write: `console.log(course, level);`' },
        ],
        explanation: {
          simple: 'Use `const` by default for variables that won\'t be reassigned, and `let` when reassignment is needed.',
          whyItWorks: 'Both `const` and `let` provide block scoping, avoiding issues with legacy function-scoped `var`.',
          syntaxBreakdown: [
            { token: 'const', meaning: 'Declares a block-scoped constant reference.' },
            { token: 'let', meaning: 'Declares a block-scoped reassignable variable.' },
          ],
          underTheHood: 'Block variables reside in the lexical environment record of their executing block context.',
        },
      },
      {
        id: 'js-hello-3',
        languageId: 'javascript',
        topicId: 'js-hello-world',
        title: 'Template Literals',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'syntax',
        concept: 'js-template-literals',
        instructions: 'Given `const user = "Alex"` and `const role = "Engineer"`, print `"User: Alex | Role: Engineer"` using backtick template literals (`${...}`).',
        starterCode: 'const user = "Alex";\nconst role = "Engineer";\n// Print using template literal string interpolation:\n',
        expectedBehavior: 'Prints "User: Alex | Role: Engineer".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'User: Alex | Role: Engineer\n' }],
        hints: [
          { level: 1, text: 'Enclose your string in backticks: `` `...` ``.' },
          { level: 2, text: 'Embed expressions inside `${user}` and `${role}`.' },
          { level: 3, text: 'Write: `console.log(\`User: ${user} | Role: ${role}\`);`' },
        ],
        explanation: {
          simple: 'Template literals allow embedded expressions inside `${}` without messy string concatenation.',
          whyItWorks: 'JavaScript evaluates expressions inside `${}` and converts them to strings automatically.',
          syntaxBreakdown: [
            { token: '`...`', meaning: 'Backticks delimit template literal strings.' },
            { token: '${expr}', meaning: 'Placeholder evaluated at runtime and stringified.' },
          ],
          underTheHood: 'The V8 engine compiles template literals into string builder concats.',
        },
      },
    ],
  },

  // 2. Data Types & Operators
  {
    id: 'js-types-operators',
    title: '2. Data Types & Operators',
    category: 'beginner',
    order: 2,
    description: 'Learn strict equality, nullish coalescing, and ternary operators.',
    prerequisites: ['js-hello-world'],
    exerciseIds: ['js-types-1', 'js-types-2', 'js-types-3'],
    exercises: [
      {
        id: 'js-types-1',
        languageId: 'javascript',
        topicId: 'js-types-operators',
        title: 'Strict Equality (=== vs ==)',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'syntax',
        concept: 'js-strict-equality',
        instructions: 'Compare `5 === "5"` and `5 == "5"`. Print the results separated by a space using `console.log(5 === "5", 5 == "5");`.',
        starterCode: '// Print the strict and loose comparison results:\n',
        expectedBehavior: 'Prints "false true".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'false true\n' }],
        hints: [
          { level: 1, text: '`===` checks both value AND type without type coercion.' },
          { level: 2, text: '`==` performs implicit type coercion before comparing.' },
          { level: 3, text: 'Write: `console.log(5 === "5", 5 == "5");`' },
        ],
        explanation: {
          simple: 'Always prefer `===` (strict equality) in JavaScript to prevent unexpected type coercion bugs.',
          whyItWorks: '`5 === "5"` is false because number !== string. `5 == "5"` coerces the string to a number first.',
          syntaxBreakdown: [
            { token: '===', meaning: 'Strict equality (no type coercion).' },
            { token: '==', meaning: 'Loose equality (coerces types if different).' },
          ],
          underTheHood: 'Abstract Equality Comparison algorithm vs. Strict Equality Comparison in the ECMAScript spec.',
        },
      },
      {
        id: 'js-types-2',
        languageId: 'javascript',
        topicId: 'js-types-operators',
        title: 'Nullish Coalescing (??)',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'syntax',
        concept: 'js-nullish-coalescing',
        instructions: 'Given `const score = 0; const fallback = 100;`, set `const result = score ?? fallback;` and print `result`. Notice that `0` is preserved because it is not nullish!',
        starterCode: 'const score = 0;\nconst fallback = 100;\n// Use ?? to assign score if not null/undefined:\n',
        expectedBehavior: 'Prints 0.',
        testCases: [{ id: 't1', input: '', expectedOutput: '0\n' }],
        hints: [
          { level: 1, text: '`??` only falls back if the left-hand side is `null` or `undefined`.' },
          { level: 2, text: 'Unlike `||`, `??` preserves `0`, `""`, and `false`.' },
          { level: 3, text: 'Write: `const result = score ?? fallback; console.log(result);`' },
        ],
        explanation: {
          simple: 'Nullish coalescing `??` returns the right-hand operand only when the left operand is `null` or `undefined`.',
          whyItWorks: 'Logical OR `||` treats `0` as falsy and mistakenly returns the fallback. `??` correctly preserves `0`.',
          syntaxBreakdown: [
            { token: '??', meaning: 'Nullish coalescing operator.' },
          ],
          underTheHood: 'Evaluates if left operand is null or undefined without checking truthiness.',
        },
      },
      {
        id: 'js-types-3',
        languageId: 'javascript',
        topicId: 'js-types-operators',
        title: 'Ternary Operator',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'syntax',
        concept: 'js-ternary-operator',
        instructions: 'Write a ternary expression that assigns `"Adult"` if `age >= 18` else `"Minor"` for `const age = 20`. Print the status.',
        starterCode: 'const age = 20;\n// Assign status using ternary operator and print it:\n',
        expectedBehavior: 'Prints "Adult".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Adult\n' }],
        hints: [
          { level: 1, text: 'Format: `condition ? valueIfTrue : valueIfFalse`.' },
          { level: 2, text: 'Check: `const status = age >= 18 ? "Adult" : "Minor";`' },
          { level: 3, text: 'Print with `console.log(status);`.' },
        ],
        explanation: {
          simple: 'The ternary operator `? :` is a concise inline alternative to simple `if/else` statements.',
          whyItWorks: 'It returns an expression that can be assigned directly to a variable.',
          syntaxBreakdown: [
            { token: 'cond ? a : b', meaning: 'Evaluates cond, returning a if true, b otherwise.' },
          ],
          underTheHood: 'Compiles to conditional branch instructions yielding an expression value.',
        },
      },
    ],
  },

  // 3. Functions & Scope
  {
    id: 'js-functions-scope',
    title: '3. Functions & Scope',
    category: 'beginner',
    order: 3,
    description: 'Master arrow functions, default parameters, and lexical closures.',
    prerequisites: ['js-types-operators'],
    exerciseIds: ['js-func-1', 'js-func-2', 'js-func-3'],
    exercises: [
      {
        id: 'js-func-1',
        languageId: 'javascript',
        topicId: 'js-functions-scope',
        title: 'Arrow Functions',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'function',
        concept: 'js-arrow-functions',
        instructions: 'Declare an arrow function `double = (n) => n * 2;`. Call `double(7)` and print the result.',
        starterCode: '// Declare double arrow function and call with 7:\n',
        expectedBehavior: 'Prints 14.',
        testCases: [{ id: 't1', input: '', expectedOutput: '14\n' }],
        hints: [
          { level: 1, text: 'Arrow functions with a single expression have an implicit return.' },
          { level: 2, text: 'Write: `const double = (n) => n * 2;`' },
          { level: 3, text: 'Call it: `console.log(double(7));`' },
        ],
        explanation: {
          simple: 'Arrow functions provide a clean, modern syntax for writing functions.',
          whyItWorks: 'When omitting curly braces `{}`, the expression after `=>` is automatically returned.',
          syntaxBreakdown: [
            { token: '(n) => n * 2', meaning: 'Arrow function returning n multiplied by 2.' },
          ],
          underTheHood: 'Arrow functions retain lexical this from their surrounding scope.',
        },
      },
      {
        id: 'js-func-2',
        languageId: 'javascript',
        topicId: 'js-functions-scope',
        title: 'Default Parameters',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'function',
        concept: 'js-default-parameters',
        instructions: 'Create an arrow function `greet = (name = "Developer") => \`Hello, ${name}!\`;`. Print `greet()` with no arguments.',
        starterCode: '// Declare greet with default parameter and print greet():\n',
        expectedBehavior: 'Prints "Hello, Developer!".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Hello, Developer!\n' }],
        hints: [
          { level: 1, text: 'Define the default in the parameter list: `(name = "Developer")`.' },
          { level: 2, text: 'Write: `const greet = (name = "Developer") => \`Hello, ${name}!\`;`' },
          { level: 3, text: 'Call `console.log(greet());`' },
        ],
        explanation: {
          simple: 'Default parameters allow formal parameters to be initialized with default values if no value or `undefined` is passed.',
          whyItWorks: 'If the argument is undefined at invocation time, the default expression is evaluated.',
          syntaxBreakdown: [
            { token: 'name = "Developer"', meaning: 'Default parameter value.' },
          ],
          underTheHood: 'Arguments are checked against undefined before function execution begins.',
        },
      },
      {
        id: 'js-func-3',
        languageId: 'javascript',
        topicId: 'js-functions-scope',
        title: 'Closures & Counter Pattern',
        difficulty: 3,
        difficultyLabel: 'Level 3: Strategic',
        type: 'function',
        concept: 'js-closures',
        instructions: 'Write a function `createCounter()` that initializes `let count = 0;` and returns an inner function that increments and returns `count`. Call the counter twice and print the second count.',
        starterCode: `function createCounter() {
    let count = 0;
    return () => {
        count++;
        return count;
    };
}

const counter = createCounter();
counter(); // 1
// Call counter() once more and print the result:
`,
        expectedBehavior: 'Prints 2.',
        testCases: [{ id: 't1', input: '', expectedOutput: '2\n' }],
        hints: [
          { level: 1, text: 'Closures allow an inner function to retain access to variables of its outer function.' },
          { level: 2, text: 'Each call to `counter()` increments the closed-over `count` variable.' },
          { level: 3, text: 'Write: `console.log(counter());`' },
        ],
        explanation: {
          simple: 'A closure is the combination of a function bundled together with references to its surrounding lexical state.',
          whyItWorks: 'The inner function maintains a live reference to `count` even after `createCounter()` has finished executing.',
          syntaxBreakdown: [
            { token: 'let count = 0', meaning: 'Closed-over variable retained in memory by the returned function.' },
          ],
          underTheHood: 'V8 allocates variables referenced by closures on the heap rather than the stack frame.',
        },
      },
    ],
  },
];
