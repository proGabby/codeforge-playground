import { SectionQuiz } from '../../../src/types';

export const TYPESCRIPT_QUIZZES: SectionQuiz[] = [
  // 1. Basic Types & Type Annotations
  {
    id: 'quiz-ts-hello-world',
    topicId: 'ts-hello-world',
    languageId: 'typescript',
    title: 'Section 1 Quiz: Basic Types & Type Annotations',
    description: 'Verify your understanding of static typing, type annotations, and function signatures in TypeScript.',
    passingScorePercent: 75,
    xpReward: 50,
    questions: [
      {
        id: 'ts-q-hello-1',
        question: 'What happens when you compile TypeScript code containing a type mismatch error like `const x: number = "hello";`?',
        options: [
          { id: 'a', text: 'The program crashes at runtime only when line `x` executes.' },
          { id: 'b', text: 'The TypeScript compiler emits error TS2322 during compile-time typechecking.' },
          { id: 'c', text: 'TypeScript silently converts "hello" into NaN.' },
          { id: 'd', text: 'The compiler halts and deletes the source file.' },
        ],
        correctOptionId: 'b',
        explanation: 'TypeScript is a static type checker. It flags type mismatches (such as assigning string to number) at compile time before running any JavaScript.',
        conceptTag: 'ts-compile-time-checks',
      },
      {
        id: 'ts-q-hello-2',
        question: 'What is the inferred return type of a TypeScript function that does not return any value?',
        codeSnippet: 'function logMessage(msg: string) {\n  console.log(msg);\n}',
        options: [
          { id: 'a', text: 'null' },
          { id: 'b', text: 'undefined' },
          { id: 'c', text: 'void' },
          { id: 'd', text: 'never' },
        ],
        correctOptionId: 'c',
        explanation: 'In TypeScript, a function that returns without yielding a value has an inferred return type of `void`.',
        conceptTag: 'ts-void-return-type',
      },
      {
        id: 'ts-q-hello-3',
        question: 'What is the purpose of type inference in TypeScript?',
        options: [
          { id: 'a', text: 'It automatically guesses and converts data types at runtime.' },
          { id: 'b', text: 'It allows the compiler to deduce types automatically based on assigned values without requiring explicit annotations on every line.' },
          { id: 'c', text: 'It disables typechecking for variables declared with `let`.' },
          { id: 'd', text: 'It forces all variables to become `any`.' },
        ],
        correctOptionId: 'b',
        explanation: 'Type inference allows TypeScript to infer the type of a variable from its initial value, keeping code concise while preserving static safety.',
        conceptTag: 'ts-type-inference',
      },
    ],
  },

  // 2. Interfaces & Type Aliases
  {
    id: 'quiz-ts-interfaces-types',
    topicId: 'ts-interfaces-types',
    languageId: 'typescript',
    title: 'Section 2 Quiz: Interfaces & Type Aliases',
    description: 'Test your grasp of structural contracts, optional fields, and type aliases.',
    passingScorePercent: 75,
    xpReward: 50,
    questions: [
      {
        id: 'ts-q-iface-1',
        question: 'What does the question mark `?` signify in an interface property declaration like `age?: number`?',
        options: [
          { id: 'a', text: 'The property must be queried from an external database.' },
          { id: 'b', text: 'The property is optional; its type is `number | undefined`.' },
          { id: 'c', text: 'The property is private and inaccessible outside the module.' },
          { id: 'd', text: 'The property is deprecated and will be removed in future releases.' },
        ],
        correctOptionId: 'b',
        explanation: 'Marking a property with `?` makes it optional when creating instances of the interface. Its effective type becomes `T | undefined`.',
        conceptTag: 'ts-optional-properties',
      },
      {
        id: 'ts-q-iface-2',
        question: 'What is the primary conceptual difference between TypeScript interfaces and type aliases?',
        options: [
          { id: 'a', text: 'Interfaces can be declaration-merged and extended; type aliases can define unions, primitives, and mapped types directly.' },
          { id: 'b', text: 'Type aliases exist at runtime in JavaScript; interfaces are erased.' },
          { id: 'c', text: 'Interfaces only work with numbers and strings.' },
          { id: 'd', text: 'There is no difference; they are strictly synonymous in all contexts.' },
        ],
        correctOptionId: 'a',
        explanation: 'Interfaces define object shapes and support declaration merging. Type aliases can model unions, tuples, primitives, and complex computed types.',
        conceptTag: 'ts-interface-vs-type',
      },
      {
        id: 'ts-q-iface-3',
        question: 'What happens when attempting to modify a `readonly` property on an interface after initialization?',
        codeSnippet: 'interface Point {\n  readonly x: number;\n}\nconst p: Point = { x: 10 };\np.x = 20;',
        options: [
          { id: 'a', text: 'p.x updates silently to 20.' },
          { id: 'b', text: 'TypeScript raises error TS2540: Cannot assign to \'x\' because it is a read-only property.' },
          { id: 'c', text: 'The property is frozen using Object.freeze at runtime.' },
          { id: 'd', text: 'A runtime ReferenceError is thrown.' },
        ],
        correctOptionId: 'b',
        explanation: '`readonly` properties cannot be reassigned once initialized. TypeScript raises compile-time error TS2540.',
        conceptTag: 'ts-readonly-modifier',
      },
    ],
  },

  // 3. Union Types & Narrowing
  {
    id: 'quiz-ts-unions-narrowing',
    topicId: 'ts-unions-narrowing',
    languageId: 'typescript',
    title: 'Section 3 Quiz: Union Types & Type Narrowing',
    description: 'Verify your knowledge of union types, typeof guards, and discriminated unions.',
    passingScorePercent: 75,
    xpReward: 50,
    questions: [
      {
        id: 'ts-q-union-1',
        question: 'What will TypeScript allow you to do with a value of type `string | number` without type narrowing?',
        options: [
          { id: 'a', text: 'Call string methods like `.toUpperCase()` directly.' },
          { id: 'b', text: 'Call number methods like `.toFixed()` directly.' },
          { id: 'c', text: 'Only access properties and methods shared by both `string` and `number` (like `.toString()`).' },
          { id: 'd', text: 'No operations are permitted until explicitly cast with `as`.' },
        ],
        correctOptionId: 'c',
        explanation: 'With a union type `A | B`, TypeScript only permits accessing properties and methods common to both `A` and `B` unless narrowed.',
        conceptTag: 'ts-union-common-members',
      },
      {
        id: 'ts-q-union-2',
        question: 'How does TypeScript narrow the type of `val` inside this block?',
        codeSnippet: 'function process(val: string | number) {\n  if (typeof val === "string") {\n    // What is val here?\n  }\n}',
        options: [
          { id: 'a', text: 'val remains `string | number`.' },
          { id: 'b', text: 'val is narrowed to `string` via control flow analysis.' },
          { id: 'c', text: 'val becomes `any`.' },
          { id: 'd', text: 'TypeScript throws a warning that typeof is not supported.' },
        ],
        correctOptionId: 'b',
        explanation: 'TypeScript understands JavaScript\'s `typeof` operator as a type guard. Inside the `if` block, `val` is strictly narrowed to `string`.',
        conceptTag: 'ts-typeof-guard',
      },
      {
        id: 'ts-q-union-3',
        question: 'What makes a union of object types a "discriminated union"?',
        options: [
          { id: 'a', text: 'Each object variant contains a common property with a unique literal type (e.g. `kind: "circle"` vs `kind: "square"`).' },
          { id: 'b', text: 'The objects inherit from different ES6 classes.' },
          { id: 'c', text: 'The union is marked with the `@discriminated` decorator.' },
          { id: 'd', text: 'The objects have different numbers of methods.' },
        ],
        correctOptionId: 'a',
        explanation: 'A discriminated union uses a shared property with distinct literal types (a discriminant) so the compiler can safely narrow the shape in a switch or if statement.',
        conceptTag: 'ts-discriminated-unions',
      },
    ],
  },

  // 4. Generics & Type Constraints
  {
    id: 'quiz-ts-generics',
    topicId: 'ts-generics',
    languageId: 'typescript',
    title: 'Section 4 Quiz: Generics & Type Constraints',
    description: 'Test your understanding of type parameters, constraints, and generic components.',
    passingScorePercent: 75,
    xpReward: 50,
    questions: [
      {
        id: 'ts-q-gen-1',
        question: 'Why is a generic function `identity<T>(arg: T): T` superior to using `any`?',
        options: [
          { id: 'a', text: 'It runs faster at runtime because V8 optimizes generic bytecode.' },
          { id: 'b', text: 'It preserves the exact argument type for the return value, retaining full compile-time type safety.' },
          { id: 'c', text: 'It forces the argument to be an object.' },
          { id: 'd', text: 'Generic functions can only be called once.' },
        ],
        correctOptionId: 'b',
        explanation: 'Unlike `any`, which disables type checking, `<T>` captures the specific type passed in and enforces that the return value matches that same type.',
        conceptTag: 'ts-generics-vs-any',
      },
      {
        id: 'ts-q-gen-2',
        question: 'What does the type constraint `<T extends HasId>` signify on a generic function?',
        options: [
          { id: 'a', text: 'T must be a subclass created with the `extends` keyword in ES6.' },
          { id: 'b', text: 'T must satisfy the structural shape of `HasId` (it must have at least all properties required by `HasId`).' },
          { id: 'c', text: 'T cannot have any properties beyond those in `HasId`.' },
          { id: 'd', text: 'HasId is copied into T at compile-time.' },
        ],
        correctOptionId: 'b',
        explanation: 'Generic constraints (`T extends Base`) enforce structural subtyping: the type passed to `T` must have at least the properties defined in `Base`.',
        conceptTag: 'ts-generic-constraints',
      },
      {
        id: 'ts-q-gen-3',
        question: 'Can TypeScript infer generic type arguments automatically without explicitly writing `<string>` at call time?',
        codeSnippet: 'function wrap<T>(val: T) { return { value: val }; }\nconst result = wrap("hello");',
        options: [
          { id: 'a', text: 'Yes, TypeScript infers T as `string` from the argument value.' },
          { id: 'b', text: 'No, type argument `<string>` is strictly mandatory on every call.' },
          { id: 'c', text: 'Only in non-strict mode.' },
          { id: 'd', text: 'Only if the argument is a number.' },
        ],
        correctOptionId: 'a',
        explanation: 'TypeScript\'s type argument inference automatically inspects the passed argument (`"hello"`) and deduces that `T` is `string`.',
        conceptTag: 'ts-type-argument-inference',
      },
    ],
  },

  // 5. Utility Types
  {
    id: 'quiz-ts-utility-types',
    topicId: 'ts-utility-types',
    languageId: 'typescript',
    title: 'Section 5 Quiz: Built-in Utility Types',
    description: 'Verify your mastery of Partial, Pick, Omit, and Record transformations.',
    passingScorePercent: 75,
    xpReward: 50,
    questions: [
      {
        id: 'ts-q-util-1',
        question: 'What is the resulting type of `Partial<{ id: number; title: string }>`?',
        options: [
          { id: 'a', text: '`{ id: number; title: string }`' },
          { id: 'b', text: '`{ id?: number; title?: string }`' },
          { id: 'c', text: '`{ readonly id: number; readonly title: string }`' },
          { id: 'd', text: '`{ id: number | null; title: string | null }`' },
        ],
        correctOptionId: 'b',
        explanation: '`Partial<T>` is a mapped type that marks every property in `T` as optional with `?`.',
        conceptTag: 'ts-partial-utility',
      },
      {
        id: 'ts-q-util-2',
        question: 'Which utility type creates a new type by choosing a subset of keys from an existing interface?',
        options: [
          { id: 'a', text: '`Extract<T, K>`' },
          { id: 'b', text: '`Pick<T, K>`' },
          { id: 'c', text: '`Exclude<T, K>`' },
          { id: 'd', text: '`Filter<T, K>`' },
        ],
        correctOptionId: 'b',
        explanation: '`Pick<T, K>` constructs a type by picking the set of properties `K` (string literal or union of literals) from `T`.',
        conceptTag: 'ts-pick-utility',
      },
      {
        id: 'ts-q-util-3',
        question: 'What type of structure does `Record<"user" | "admin", number>` describe?',
        options: [
          { id: 'a', text: 'An array of users and admins with numerical IDs.' },
          { id: 'b', text: 'An object requiring keys "user" and "admin", each with a value of type `number`.' },
          { id: 'c', text: 'A database record stored in SQL.' },
          { id: 'd', text: 'A tuple with two numbers.' },
        ],
        correctOptionId: 'b',
        explanation: '`Record<K, V>` constructs an object type whose keys are taken from union `K` and whose values are of type `V`.',
        conceptTag: 'ts-record-utility',
      },
    ],
  },

  // 6. Tuples & Type Assertions
  {
    id: 'quiz-ts-tuples-assertions',
    topicId: 'ts-tuples-assertions',
    languageId: 'typescript',
    title: 'Section 6 Quiz: Tuples & Type Assertions',
    description: 'Test your grasp of fixed-length tuples, readonly modifiers, and the unknown type.',
    passingScorePercent: 75,
    xpReward: 50,
    questions: [
      {
        id: 'ts-q-tup-1',
        question: 'What is the key difference between an array `number[]` and a tuple `[string, number]` in TypeScript?',
        options: [
          { id: 'a', text: 'Tuples have fixed length and specific types at each index; arrays have arbitrary length with homogeneous or union element types.' },
          { id: 'b', text: 'Tuples cannot be iterated with `for...of` loops.' },
          { id: 'c', text: 'Arrays are compiled to C structures; tuples are JavaScript arrays.' },
          { id: 'd', text: 'Tuples can only store numbers.' },
        ],
        correctOptionId: 'a',
        explanation: 'A tuple specifies the exact number of elements and the specific type each index position must hold (e.g. index 0 is string, index 1 is number).',
        conceptTag: 'ts-tuple-vs-array',
      },
      {
        id: 'ts-q-tup-2',
        question: 'Why is `unknown` preferred over `any` for variables of uncertain type?',
        options: [
          { id: 'a', text: '`unknown` values can be assigned directly to any other type without checking.' },
          { id: 'b', text: '`unknown` forces the developer to perform type narrowing or type assertions before accessing properties, preventing accidental runtime crashes.' },
          { id: 'c', text: '`unknown` runs faster because the compiler skips syntax analysis.' },
          { id: 'd', text: '`any` was removed from TypeScript 4.0.' },
        ],
        correctOptionId: 'b',
        explanation: '`unknown` is the type-safe counterpart of `any`. Anything is assignable to `unknown`, but `unknown` cannot be used or assigned to other types without narrowing.',
        conceptTag: 'ts-unknown-vs-any',
      },
      {
        id: 'ts-q-tup-3',
        question: 'What is the runtime effect of a TypeScript type assertion like `(x as string)`?',
        options: [
          { id: 'a', text: 'It calls `x.toString()` at runtime.' },
          { id: 'b', text: 'It has zero runtime effect; type assertions are purely compile-time hints that are completely removed from generated JavaScript.' },
          { id: 'c', text: 'It wraps `x` in a proxy that validates types on every property access.' },
          { id: 'd', text: 'It causes a runtime TypeError if x is not actually a string.' },
        ],
        correctOptionId: 'b',
        explanation: 'Type assertions (`as`) do not perform any runtime checks, casting, or conversions; they only inform the static type checker.',
        conceptTag: 'ts-assertion-runtime-effect',
      },
    ],
  },
];
