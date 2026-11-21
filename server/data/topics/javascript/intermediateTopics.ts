import { Exercise, Topic } from '../../../../src/types';

export const JAVASCRIPT_INTERMEDIATE_TOPICS: (Topic & { exercises: Exercise[] })[] = [
  // 4. Arrays & Higher-Order Methods
  {
    id: 'js-arrays-iteration',
    title: '4. Arrays & Higher-Order Methods',
    category: 'intermediate',
    order: 4,
    description: 'Transform, filter, and accumulate data with map, filter, and reduce.',
    prerequisites: ['js-functions-scope'],
    exerciseIds: ['js-arr-1', 'js-arr-2', 'js-arr-3'],
    exercises: [
      {
        id: 'js-arr-1',
        languageId: 'javascript',
        topicId: 'js-arrays-iteration',
        title: 'Transforming Arrays with .map()',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'function',
        concept: 'js-array-map',
        instructions: 'Given `const numbers = [1, 2, 3, 4];`, use `.map()` to return a new array with each number squared. Print the resulting array using `console.log(squared.join(" "));`.',
        starterCode: 'const numbers = [1, 2, 3, 4];\n// Use .map() to square each element, then print joined by spaces:\n',
        expectedBehavior: 'Prints "1 4 9 16".',
        testCases: [{ id: 't1', input: '', expectedOutput: '1 4 9 16\n' }],
        hints: [
          { level: 1, text: '`.map()` creates a new array by applying a callback to each element.' },
          { level: 2, text: '`const squared = numbers.map(n => n * n);`' },
          { level: 3, text: '`console.log(squared.join(" "));`' },
        ],
        explanation: {
          simple: '`.map()` transforms every element of an array into a new value without mutating the original array.',
          whyItWorks: '`.map()` allocates a new array of the same length and assigns each return value from the callback.',
          syntaxBreakdown: [
            { token: '.map(fn)', meaning: 'Pure functional transformation method.' },
          ],
          underTheHood: 'Iterates through the packed elements of the array in order.',
        },
      },
      {
        id: 'js-arr-2',
        languageId: 'javascript',
        topicId: 'js-arrays-iteration',
        title: 'Filtering Arrays with .filter()',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'function',
        concept: 'js-array-filter',
        instructions: 'Given `const scores = [45, 80, 92, 55, 78];`, use `.filter()` to keep only passing scores (>= 70). Print the filtered scores joined by spaces.',
        starterCode: 'const scores = [45, 80, 92, 55, 78];\n// Filter scores >= 70 and print them joined by spaces:\n',
        expectedBehavior: 'Prints "80 92 78".',
        testCases: [{ id: 't1', input: '', expectedOutput: '80 92 78\n' }],
        hints: [
          { level: 1, text: '`.filter()` returns elements where the predicate function returns truthy.' },
          { level: 2, text: '`const passing = scores.filter(s => s >= 70);`' },
          { level: 3, text: '`console.log(passing.join(" "));`' },
        ],
        explanation: {
          simple: '`.filter()` creates a shallow copy of a portion of an array containing only elements that pass the test.',
          whyItWorks: 'It executes the callback on each element; if true, the item is pushed to the new array.',
          syntaxBreakdown: [
            { token: '.filter(predicate)', meaning: 'Filters array based on boolean condition.' },
          ],
          underTheHood: 'Constructs an array without altering the original array elements.',
        },
      },
      {
        id: 'js-arr-3',
        languageId: 'javascript',
        topicId: 'js-arrays-iteration',
        title: 'Accumulating with .reduce()',
        difficulty: 3,
        difficultyLabel: 'Level 3: Strategic',
        type: 'algorithm',
        concept: 'js-array-reduce',
        instructions: 'Given `const items = [10, 20, 30];`, use `.reduce()` with an initial value of `0` to calculate the total sum. Print the total sum.',
        starterCode: 'const items = [10, 20, 30];\n// Calculate total sum using .reduce() with initial value 0 and print:\n',
        expectedBehavior: 'Prints 60.',
        testCases: [{ id: 't1', input: '', expectedOutput: '60\n' }],
        hints: [
          { level: 1, text: '`.reduce((acc, curr) => acc + curr, 0)` reduces an array to a single value.' },
          { level: 2, text: '`const total = items.reduce((sum, item) => sum + item, 0);`' },
          { level: 3, text: '`console.log(total);`' },
        ],
        explanation: {
          simple: '`.reduce()` runs a "reducer" callback function over all array elements, accumulating them into a single output.',
          whyItWorks: 'The accumulator starts at the initial value (`0`) and carries forward the return value of each step.',
          syntaxBreakdown: [
            { token: '.reduce((acc, val) => ..., initial)', meaning: 'Iterative reducer function.' },
          ],
          underTheHood: 'Linear O(N) pass across all elements, feeding previous result into current iteration.',
        },
      },
    ],
  },

  // 5. Objects & Destructuring
  {
    id: 'js-objects-destructuring',
    title: '5. Objects & Destructuring',
    category: 'intermediate',
    order: 5,
    description: 'Learn object property shorthand, destructuring, and spread/rest syntax.',
    prerequisites: ['js-arrays-iteration'],
    exerciseIds: ['js-obj-1', 'js-obj-2', 'js-obj-3'],
    exercises: [
      {
        id: 'js-obj-1',
        languageId: 'javascript',
        topicId: 'js-objects-destructuring',
        title: 'Property Shorthand & Methods',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'syntax',
        concept: 'js-object-shorthand',
        instructions: 'Given `const brand = "CodeForge"; const version = 2;`, create an object using shorthand notation: `const app = { brand, version };`. Print `app.brand` and `app.version` separated by a space.',
        starterCode: 'const brand = "CodeForge";\nconst version = 2;\n// Create app object with shorthand properties and print:\n',
        expectedBehavior: 'Prints "CodeForge 2".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'CodeForge 2\n' }],
        hints: [
          { level: 1, text: 'In ES6+, `{ brand }` is shorthand for `{ brand: brand }`.' },
          { level: 2, text: '`const app = { brand, version };`' },
          { level: 3, text: '`console.log(app.brand, app.version);`' },
        ],
        explanation: {
          simple: 'When the object key and variable name match, you can omit the colon and value identifier.',
          whyItWorks: 'The JavaScript parser desugars `{ key }` into `{ key: key }`.',
          syntaxBreakdown: [
            { token: '{ brand, version }', meaning: 'Object literal property shorthand.' },
          ],
          underTheHood: 'Allocates an object descriptor with properties matching in-scope identifier values.',
        },
      },
      {
        id: 'js-obj-2',
        languageId: 'javascript',
        topicId: 'js-objects-destructuring',
        title: 'Object Destructuring with Renaming',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'syntax',
        concept: 'js-destructuring',
        instructions: 'Given `const user = { id: 101, username: "dev1" };`, destructure `username` into a local variable named `handle`: `const { username: handle } = user;`. Print `handle`.',
        starterCode: 'const user = { id: 101, username: "dev1" };\n// Destructure username into variable handle and print it:\n',
        expectedBehavior: 'Prints "dev1".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'dev1\n' }],
        hints: [
          { level: 1, text: 'Use renaming syntax: `{ property: newVariableName }`.' },
          { level: 2, text: '`const { username: handle } = user;`' },
          { level: 3, text: '`console.log(handle);`' },
        ],
        explanation: {
          simple: 'Destructuring unpacks values from objects or arrays into distinct, convenient local variables.',
          whyItWorks: 'The colon `:` in destructuring patterns rebinds the target property to a custom variable name.',
          syntaxBreakdown: [
            { token: '{ prop: alias }', meaning: 'Extracts property and renames it.' },
          ],
          underTheHood: 'Compiles into property lookup and local register binding.',
        },
      },
      {
        id: 'js-obj-3',
        languageId: 'javascript',
        topicId: 'js-objects-destructuring',
        title: 'Spread Syntax for Object Merging',
        difficulty: 3,
        difficultyLabel: 'Level 3: Strategic',
        type: 'syntax',
        concept: 'js-spread-operator',
        instructions: 'Given `const base = { role: "student" };` and `const extra = { role: "pro", active: true };`, merge them using spread syntax `const merged = { ...base, ...extra };`. Print `merged.role` and `merged.active` separated by a space.',
        starterCode: 'const base = { role: "student" };\nconst extra = { role: "pro", active: true };\n// Merge using spread syntax and print role and active:\n',
        expectedBehavior: 'Prints "pro true".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'pro true\n' }],
        hints: [
          { level: 1, text: 'Properties from objects spread later override earlier properties.' },
          { level: 2, text: '`const merged = { ...base, ...extra };`' },
          { level: 3, text: '`console.log(merged.role, merged.active);`' },
        ],
        explanation: {
          simple: 'The spread operator `...` copies all enumerable own properties from one or more objects into a new object.',
          whyItWorks: 'Later spread properties overwrite earlier ones with matching keys, making it ideal for overriding defaults.',
          syntaxBreakdown: [
            { token: '{ ...a, ...b }', meaning: 'Shallow object merge via spread operator.' },
          ],
          underTheHood: 'Iterates own enumerable properties and copies values by reference.',
        },
      },
    ],
  },

  // 6. Promises & Async/Await
  {
    id: 'js-async-promises',
    title: '6. Promises & Async/Await',
    category: 'intermediate',
    order: 6,
    description: 'Master asynchronous JavaScript, Promises, and async/await syntax.',
    prerequisites: ['js-objects-destructuring'],
    exerciseIds: ['js-async-1', 'js-async-2', 'js-async-3'],
    exercises: [
      {
        id: 'js-async-1',
        languageId: 'javascript',
        topicId: 'js-async-promises',
        title: 'Resolving a Promise',
        difficulty: 2,
        difficultyLabel: 'Level 2: Application',
        type: 'function',
        concept: 'js-promises',
        instructions: 'Create an immediately resolved Promise using `Promise.resolve("Data Loaded")`. Use `.then()` to print the resolved value.',
        starterCode: '// Create Promise.resolve("Data Loaded") and log with .then():\n',
        expectedBehavior: 'Prints "Data Loaded".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Data Loaded\n' }],
        hints: [
          { level: 1, text: '`Promise.resolve(val)` creates a settled Promise.' },
          { level: 2, text: 'Chain `.then(val => console.log(val));`' },
          { level: 3, text: 'Write: `Promise.resolve("Data Loaded").then(data => console.log(data));`' },
        ],
        explanation: {
          simple: 'A Promise represents the eventual completion or failure of an asynchronous operation.',
          whyItWorks: '`.then()` registers a callback to be executed on the microtask queue once the Promise settles.',
          syntaxBreakdown: [
            { token: 'Promise.resolve(v)', meaning: 'Creates a Promise resolved with value v.' },
            { token: '.then(cb)', meaning: 'Attaches callbacks for the resolution of the Promise.' },
          ],
          underTheHood: 'Promise callbacks execute asynchronously on the event loop microtask queue.',
        },
      },
      {
        id: 'js-async-2',
        languageId: 'javascript',
        topicId: 'js-async-promises',
        title: 'Consuming Promises with async/await',
        difficulty: 3,
        difficultyLabel: 'Level 3: Strategic',
        type: 'function',
        concept: 'js-async-await',
        instructions: 'Define an async function `run()` that awaits `Promise.resolve("Success")` and prints the awaited message. Invoke `run()`.',
        starterCode: `async function run() {
    // Await Promise.resolve("Success") and print the result:
}

run();
`,
        expectedBehavior: 'Prints "Success".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Success\n' }],
        hints: [
          { level: 1, text: 'Inside an `async` function, use the `await` keyword before a Promise.' },
          { level: 2, text: '`const result = await Promise.resolve("Success");`' },
          { level: 3, text: '`console.log(result);`' },
        ],
        explanation: {
          simple: '`async/await` syntax allows writing asynchronous code that looks and behaves like synchronous code.',
          whyItWorks: '`await` pauses execution of the surrounding `async` function until the Promise resolves.',
          syntaxBreakdown: [
            { token: 'async function', meaning: 'Declares an asynchronous function that always returns a Promise.' },
            { token: 'await', meaning: 'Pauses async function execution until the Promise settles.' },
          ],
          underTheHood: 'Syntactic sugar built atop ECMAScript Generators and Promises.',
        },
      },
      {
        id: 'js-async-3',
        languageId: 'javascript',
        topicId: 'js-async-promises',
        title: 'Error Handling with try / catch',
        difficulty: 3,
        difficultyLabel: 'Level 3: Strategic',
        type: 'function',
        concept: 'js-try-catch',
        instructions: 'Define an async function `safeRun()` that wraps an awaited `Promise.reject(new Error("Failed Operation"))` in a `try/catch` block. In the `catch(err)` block, print `err.message`. Invoke `safeRun()`.',
        starterCode: `async function safeRun() {
    try {
        await Promise.reject(new Error("Failed Operation"));
    } catch (err) {
        // Print the error message:
    }
}

safeRun();
`,
        expectedBehavior: 'Prints "Failed Operation".',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Failed Operation\n' }],
        hints: [
          { level: 1, text: 'A rejected Promise awaited inside a `try` block throws an exception.' },
          { level: 2, text: 'The `catch(err)` block receives the thrown Error object.' },
          { level: 3, text: 'Write `console.log(err.message);` inside the catch block.' },
        ],
        explanation: {
          simple: 'Rejected promises in async/await are caught using standard `try/catch` blocks.',
          whyItWorks: '`await` converts rejected promises into thrown JavaScript exceptions.',
          syntaxBreakdown: [
            { token: 'try { ... } catch (err) { ... }', meaning: 'Synchronous error catching mechanism.' },
            { token: 'err.message', meaning: 'Readable description of the Error instance.' },
          ],
          underTheHood: 'If an awaited Promise rejects, the V8 runtime unrolls the async stack to the nearest catch handler.',
        },
      },
    ],
  },
];
