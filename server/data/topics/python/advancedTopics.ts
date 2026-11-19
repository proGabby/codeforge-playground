import { Exercise, Topic } from '../../../../src/types';

export const PYTHON_ADVANCED_TOPICS: (Topic & { exercises: Exercise[] })[] = [
  // 12. Generators & Iterators
  {
    id: 'py-generators',
    title: '12. Generators & Iterators',
    category: 'advanced',
    order: 12,
    description: 'Build memory-efficient lazy evaluation sequences using yield, generator expressions, and pipelines.',
    prerequisites: ['py-capstone'],
    exerciseIds: [
      'py-gen-1',
      'py-gen-2',
      'py-gen-3',
      'py-gen-4',
      'py-gen-5',
    ],
    exercises: [
      {
        id: 'py-gen-1',
        languageId: 'python',
        topicId: 'py-generators',
        title: 'Simple Generator with yield',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'generators',
        instructions: 'Define a generator function `count_down(n)` that yields numbers from `n` down to 1. In the main script, iterate over `count_down(3)` with a `for` loop and print each number.',
        starterCode: `# Define generator function count_down(n)
# TODO: yield numbers from n down to 1


# TODO: Loop through count_down(3) and print each number
`,
        expectedBehavior: 'Prints 3, 2, 1 on separate lines.',
        testCases: [{ id: 't1', input: '', expectedOutput: '3\n2\n1\n' }],
        hints: [
          { level: 1, text: 'A generator function uses the `yield` keyword instead of `return`.' },
          { level: 2, text: 'Use a while loop: `while n > 0: yield n; n -= 1`' },
          { level: 3, text: '`for num in count_down(3): print(num)`' },
        ],
        explanation: {
          simple: '`yield` pauses function execution and emits a value, resuming right where it left off on the next iteration.',
          whyItWorks: 'Instead of building an entire list in memory, generators compute values on demand (lazy evaluation).',
          syntaxBreakdown: [{ token: 'yield n', meaning: 'Suspends function and sends value back to caller.' }],
          underTheHood: 'Returns a generator iterator object maintaining a frame pointer on the Python stack.',
        },
      },
      {
        id: 'py-gen-2',
        languageId: 'python',
        topicId: 'py-generators',
        title: 'Manual Stepping with next()',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'generator-next',
        instructions: 'Define a generator `traffic_lights()` that sequentially yields "RED", "YELLOW", and "GREEN". Instantiate `gen = traffic_lights()`, then call and print `next(gen)` three times.',
        starterCode: `# Define generator traffic_lights()
# TODO: sequentially yield "RED", "YELLOW", "GREEN"


# TODO: Instantiate traffic_lights and call print(next(gen)) 3 times
`,
        expectedBehavior: 'Prints RED, YELLOW, GREEN sequentially.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'RED\nYELLOW\nGREEN\n' }],
        hints: [
          { level: 1, text: 'Inside `traffic_lights()`, write three `yield` statements.' },
          { level: 2, text: '`gen = traffic_lights()` creates the generator object.' },
          { level: 3, text: '`print(next(gen))` calls `__next__()` to fetch each value.' },
        ],
        explanation: {
          simple: '`next(gen)` manually requests the next yielded item from an iterator.',
          whyItWorks: 'When all `yield` statements finish, subsequent `next()` calls raise `StopIteration`.',
          syntaxBreakdown: [{ token: 'next(gen)', meaning: 'Advances iterator until next yield statement.' }],
          underTheHood: 'Invokes the tp_iternext slot in CPython.',
        },
      },
      {
        id: 'py-gen-3',
        languageId: 'python',
        topicId: 'py-generators',
        title: 'Memory-Efficient Generator Expressions',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'generator-expressions',
        instructions: 'Create a generator expression `squares_gen = (x * x for x in range(1, 5))`. Iterate through `squares_gen` with a `for` loop and print each square.',
        starterCode: `# TODO: Create generator expression for squares of range(1, 5)


# TODO: Loop through squares_gen and print each item
`,
        expectedBehavior: 'Prints 1, 4, 9, 16 on separate lines.',
        testCases: [{ id: 't1', input: '', expectedOutput: '1\n4\n9\n16\n' }],
        hints: [
          { level: 1, text: 'Generator expressions use parentheses `(...)` instead of square brackets `[...]`.' },
          { level: 2, text: '`squares_gen = (x * x for x in range(1, 5))`' },
          { level: 3, text: '`for val in squares_gen: print(val)`' },
        ],
        explanation: {
          simple: 'Generator expressions provide comprehension syntax with lazy, one-at-a-time evaluation.',
          whyItWorks: 'Avoids allocating memory for all elements upfront, ideal for huge datasets.',
          syntaxBreakdown: [{ token: '(expr for x in iterable)', meaning: 'Generator comprehension syntax.' }],
          underTheHood: 'Syntactic sugar for an anonymous generator function.',
        },
      },
      {
        id: 'py-gen-4',
        languageId: 'python',
        topicId: 'py-generators',
        title: 'Infinite Sequence: Fibonacci Generator',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'fibonacci-generator',
        instructions: 'Define a generator `fibonacci(limit)` that yields the first `limit` numbers of the Fibonacci sequence starting with 0, 1 (0, 1, 1, 2, 3, 5...). Print the first 6 numbers produced by `fibonacci(6)`.',
        starterCode: `def fibonacci(limit):
    # TODO: Yield the first limit Fibonacci numbers starting with 0 and 1
    pass

# TODO: Loop through fibonacci(6) and print each number
`,
        expectedBehavior: 'Prints 0, 1, 1, 2, 3, 5.',
        testCases: [{ id: 't1', input: '', expectedOutput: '0\n1\n1\n2\n3\n5\n' }],
        hints: [
          { level: 1, text: 'Initialize `a, b = 0, 1` and loop `for _ in range(limit):`' },
          { level: 2, text: 'Inside the loop, `yield a`, then update `a, b = b, a + b`.' },
          { level: 3, text: '`for num in fibonacci(6): print(num)`' },
        ],
        explanation: {
          simple: 'Generators maintain internal variable state between yield invocations.',
          whyItWorks: 'Local variables `a` and `b` persist across yields without global variables.',
          syntaxBreakdown: [{ token: 'a, b = b, a + b', meaning: 'Simultaneous tuple assignment for state step.' }],
          underTheHood: 'Preserves local variable array in PyFrameObject.',
        },
      },
      {
        id: 'py-gen-5',
        languageId: 'python',
        topicId: 'py-generators',
        title: 'Composing Generator Pipelines',
        difficulty: 5,
        difficultyLabel: 'Level 5: Combination',
        type: 'syntax',
        concept: 'generator-pipelines',
        instructions: 'Define `even_filter(nums)` that yields only even numbers from iterable `nums`. Define `multiplier(nums, factor)` that yields each item multiplied by `factor`. Chain `range(1, 7)` through `even_filter`, then into `multiplier(..., factor=10)`, and print each value.',
        starterCode: `def even_filter(nums):
    # TODO: Yield only even numbers from nums
    pass

def multiplier(nums, factor):
    # TODO: Yield each number multiplied by factor
    pass

# TODO: Pipeline range(1, 7) -> even_filter -> multiplier(..., 10) and print each
`,
        expectedBehavior: 'Prints 20, 40, 60 on separate lines.',
        testCases: [{ id: 't1', input: '', expectedOutput: '20\n40\n60\n' }],
        hints: [
          { level: 1, text: 'In `even_filter`: `for x in nums: if x % 2 == 0: yield x`' },
          { level: 2, text: 'In `multiplier`: `for x in nums: yield x * factor`' },
          { level: 3, text: '`pipeline = multiplier(even_filter(range(1, 7)), 10)`' },
        ],
        explanation: {
          simple: 'Generators can be chained together into memory-constant streaming data pipelines.',
          whyItWorks: 'Each item streams through the entire pipeline individually without intermediate buffers.',
          syntaxBreakdown: [{ token: 'multiplier(even_filter(...))', meaning: 'Composable stream transformation.' }],
          underTheHood: 'Equivalent to Unix pipes `cat | grep | awk` in Python syntax.',
        },
      },
    ],
  },

  // 13. Decorators & Metaprogramming
  {
    id: 'py-decorators',
    title: '13. Decorators & Metaprogramming',
    category: 'advanced',
    order: 13,
    description: 'Master first-class functions, closures, @wraps metadata preservation, and parameterized decorators.',
    prerequisites: ['py-generators'],
    exerciseIds: [
      'py-dec-1',
      'py-dec-2',
      'py-dec-3',
      'py-dec-4',
    ],
    exercises: [
      {
        id: 'py-dec-1',
        languageId: 'python',
        topicId: 'py-decorators',
        title: 'Function Wrapping Decorator',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'decorators',
        instructions: 'Define decorator `announce(func)` that prints "[START]" before calling `func()`, and prints "[END]" after. Decorate `greet()` with `@announce`, where `greet()` prints "Hello, World!". Call `greet()`.',
        starterCode: `def announce(func):
    # TODO: Define wrapper(), print [START], call func(), print [END], return wrapper
    pass

# TODO: Decorate greet with @announce
def greet():
    print("Hello, World!")

# TODO: Call greet()
`,
        expectedBehavior: 'Prints [START], Hello, World!, [END].',
        testCases: [{ id: 't1', input: '', expectedOutput: '[START]\nHello, World!\n[END]\n' }],
        hints: [
          { level: 1, text: 'Inside `announce(func)`, define `def wrapper(): print("[START]"); func(); print("[END]")`' },
          { level: 2, text: 'Return `wrapper` without calling it from `announce`.' },
          { level: 3, text: 'Place `@announce` immediately above `def greet():`.' },
        ],
        explanation: {
          simple: 'A decorator is a function that takes another function, extends its behavior, and returns the modified function.',
          whyItWorks: '`@announce` is syntactic sugar for `greet = announce(greet)`.',
          syntaxBreakdown: [{ token: '@announce', meaning: 'Applies decorator to subsequent function definition.' }],
          underTheHood: 'Rebinds the function identifier in the current symbol table.',
        },
      },
      {
        id: 'py-dec-2',
        languageId: 'python',
        topicId: 'py-decorators',
        title: 'Handling Arguments with *args and **kwargs',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'decorator-args',
        instructions: 'Define decorator `double_result(func)`. Its `wrapper(*args, **kwargs)` should compute `result = func(*args, **kwargs)` and return `result * 2`. Decorate `add(a, b)` which returns `a + b`. Call and print `add(3, 4)`.',
        starterCode: `def double_result(func):
    # TODO: Define wrapper(*args, **kwargs) that doubles func's return value
    pass

# TODO: Decorate add(a, b) with @double_result
def add(a, b):
    return a + b

# TODO: Call and print add(3, 4)
`,
        expectedBehavior: 'Prints 14.',
        testCases: [{ id: 't1', input: '', expectedOutput: '14\n' }],
        hints: [
          { level: 1, text: 'Use `def wrapper(*args, **kwargs): return func(*args, **kwargs) * 2`' },
          { level: 2, text: 'Return `wrapper` from `double_result`.' },
          { level: 3, text: 'Call `print(add(3, 4))` to see 7 doubled to 14.' },
        ],
        explanation: {
          simple: 'Using `*args, **kwargs` allows your decorator to wrap functions with any signature.',
          whyItWorks: '`*args` gathers positional arguments; `**kwargs` gathers keyword arguments.',
          syntaxBreakdown: [{ token: '*args, **kwargs', meaning: 'Universal argument forwarding.' }],
          underTheHood: 'Packs arguments into a tuple and dictionary before dispatch.',
        },
      },
      {
        id: 'py-dec-3',
        languageId: 'python',
        topicId: 'py-decorators',
        title: 'Preserving Metadata with functools.wraps',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'functools-wraps',
        instructions: 'Import `wraps` from `functools`. Create decorator `logged(func)` where `wrapper` is decorated with `@wraps(func)`. Inside wrapper, print `f"Calling {func.__name__}"` before calling `func()`. Decorate `calculate_tax()`. Call `calculate_tax()`, then print `calculate_tax.__name__` and `calculate_tax.__doc__`.',
        starterCode: `from functools import wraps

def logged(func):
    # TODO: Decorate wrapper with @wraps(func)
    pass

# TODO: Decorate calculate_tax with @logged
def calculate_tax():
    """Calculates sales tax."""
    print("Tax: 10%")

# TODO: Call calculate_tax(), then print calculate_tax.__name__ and calculate_tax.__doc__
`,
        expectedBehavior: 'Prints Calling calculate_tax, Tax: 10%, calculate_tax, Calculates sales tax.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Calling calculate_tax\nTax: 10%\ncalculate_tax\nCalculates sales tax.\n' }],
        hints: [
          { level: 1, text: 'Write `@wraps(func)` immediately above `def wrapper(*args, **kwargs):`.' },
          { level: 2, text: 'Print `f"Calling {func.__name__}"` before `func(*args, **kwargs)`.' },
          { level: 3, text: 'Print `calculate_tax.__name__` and `calculate_tax.__doc__`.' },
        ],
        explanation: {
          simple: '`@wraps(func)` preserves original function name, docstrings, and annotations instead of overwriting them with "wrapper".',
          whyItWorks: 'Copies `__name__`, `__doc__`, and `__module__` attributes from target to wrapper.',
          syntaxBreakdown: [{ token: '@wraps(func)', meaning: 'Copies metadata attributes onto wrapper function.' }],
          underTheHood: 'Uses `functools.update_wrapper` internally.',
        },
      },
      {
        id: 'py-dec-4',
        languageId: 'python',
        topicId: 'py-decorators',
        title: 'Configurable Decorator Factory',
        difficulty: 5,
        difficultyLabel: 'Level 5: Combination',
        type: 'syntax',
        concept: 'decorator-factory',
        instructions: 'Write a decorator factory `repeat(num_times)` that takes an integer and returns a decorator that executes the decorated function `num_times` times. Decorate `ping()` with `@repeat(3)`, where `ping()` prints "pong". Call `ping()`.',
        starterCode: `def repeat(num_times):
    # TODO: Return a decorator function that repeats target function num_times
    pass

# TODO: Decorate ping() with @repeat(3)
def ping():
    print("pong")

# TODO: Call ping()
`,
        expectedBehavior: 'Prints pong 3 times.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'pong\npong\npong\n' }],
        hints: [
          { level: 1, text: 'A decorator factory is 3 nested functions: `repeat(num_times)` -> `decorator(func)` -> `wrapper(*args, **kwargs)`.' },
          { level: 2, text: 'Inside `wrapper`, run `for _ in range(num_times): func(*args, **kwargs)`.' },
          { level: 3, text: 'Return `wrapper` from `decorator`, and return `decorator` from `repeat`.' },
        ],
        explanation: {
          simple: 'A decorator factory accepts custom parameters and returns the actual decorator.',
          whyItWorks: '`@repeat(3)` evaluates `repeat(3)` first, returning a closure with `num_times=3`.',
          syntaxBreakdown: [{ token: '@repeat(3)', meaning: 'Invokes factory to produce customized decorator.' }],
          underTheHood: 'Triple-nested lexical closures.',
        },
      },
    ],
  },

  // 14. Context Managers & Resource Safety
  {
    id: 'py-context-managers',
    title: '14. Context Managers & Resource Safety',
    category: 'advanced',
    order: 14,
    description: 'Master deterministic resource cleanup with __enter__/__exit__ protocols and the contextlib module.',
    prerequisites: ['py-decorators'],
    exerciseIds: [
      'py-ctx-1',
      'py-ctx-2',
      'py-ctx-3',
      'py-ctx-4',
    ],
    exercises: [
      {
        id: 'py-ctx-1',
        languageId: 'python',
        topicId: 'py-context-managers',
        title: 'Class-Based Context Manager',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'context-manager-class',
        instructions: 'Define class `DatabaseConnection`. In `__enter__(self)`, print "Connected to DB" and return "DB_SESSION". In `__exit__(self, exc_type, exc_val, exc_tb)`, print "Closed DB connection". In main, execute `with DatabaseConnection() as session: print(f"Querying with {session}")`.',
        starterCode: `class DatabaseConnection:
    # TODO: Implement __enter__(self)
    # TODO: Implement __exit__(self, exc_type, exc_val, exc_tb)
    pass

# TODO: Use with DatabaseConnection() as session:
`,
        expectedBehavior: 'Prints Connected to DB, Querying with DB_SESSION, Closed DB connection.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Connected to DB\nQuerying with DB_SESSION\nClosed DB connection\n' }],
        hints: [
          { level: 1, text: '`__enter__(self)` returns the object bound to the `as` variable.' },
          { level: 2, text: '`__exit__(self, exc_type, exc_val, exc_tb)` runs automatically when exiting `with` block.' },
          { level: 3, text: '`with DatabaseConnection() as session: print(f"Querying with {session}")`' },
        ],
        explanation: {
          simple: 'Context managers guarantee resource cleanup (closing connections/files) even if an error occurs.',
          whyItWorks: 'The `with` statement calls `__enter__` on entry and always invokes `__exit__` on exit.',
          syntaxBreakdown: [
            { token: '__enter__(self)', meaning: 'Setup phase and context value provider.' },
            { token: '__exit__(...)', meaning: 'Teardown phase guaranteed to execute.' },
          ],
          underTheHood: 'Maps to SETUP_WITH and WITH_EXCEPT_START bytecode instructions.',
        },
      },
      {
        id: 'py-ctx-2',
        languageId: 'python',
        topicId: 'py-context-managers',
        title: 'Suppressing Exceptions in Context Managers',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'context-manager-exception',
        instructions: 'Define class `SuppressExceptions`. In `__enter__(self)`, return `self`. In `__exit__(self, exc_type, exc_val, exc_tb)`, if `exc_type is not None`, print `f"Handled error: {exc_val}"` and return `True` (suppressing the error). In main, execute `with SuppressExceptions(): raise ValueError("Invalid input")`, then print "Execution continued smoothly".',
        starterCode: `class SuppressExceptions:
    # TODO: Implement __enter__(self) and __exit__(self, exc_type, exc_val, exc_tb)
    # Hint: Returning True from __exit__ suppresses raised exceptions
    pass

# TODO: with SuppressExceptions(): raise ValueError("Invalid input")
# TODO: print("Execution continued smoothly")
`,
        expectedBehavior: 'Prints Handled error: Invalid input, then Execution continued smoothly.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Handled error: Invalid input\nExecution continued smoothly\n' }],
        hints: [
          { level: 1, text: 'If `exc_type` is not None, an exception was raised inside the `with` body.' },
          { level: 2, text: 'Returning `True` from `__exit__` tells Python to suppress the exception.' },
          { level: 3, text: 'Print `Execution continued smoothly` after the `with` block.' },
        ],
        explanation: {
          simple: 'Returning `True` from `__exit__` swallows the exception and allows execution to continue normally.',
          whyItWorks: 'Python inspects the boolean return value of `__exit__` to decide whether to re-raise.',
          syntaxBreakdown: [{ token: 'return True', meaning: 'Suppresses exception propagation from context.' }],
          underTheHood: 'Clears active exception in current thread state.',
        },
      },
      {
        id: 'py-ctx-3',
        languageId: 'python',
        topicId: 'py-context-managers',
        title: '@contextmanager Generator Decorator',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'contextlib-contextmanager',
        instructions: 'Import `contextmanager` from `contextlib`. Define a generator function `timer_block(label)`. Print `f"Starting {label}"`, `yield`, and in a `finally` block print `f"Finished {label}"`. Use it with `with timer_block("Worker"): print("Working...")`.',
        starterCode: `from contextlib import contextmanager

# TODO: Define @contextmanager timer_block(label)


# TODO: with timer_block("Worker"): print("Working...")
`,
        expectedBehavior: 'Prints Starting Worker, Working..., Finished Worker.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Starting Worker\nWorking...\nFinished Worker\n' }],
        hints: [
          { level: 1, text: 'Decorate `def timer_block(label):` with `@contextmanager`.' },
          { level: 2, text: 'Wrap `yield` in a `try...finally` block to ensure completion.' },
          { level: 3, text: 'Code before `yield` runs in `__enter__`, code after runs in `__exit__`.' },
        ],
        explanation: {
          simple: '`@contextmanager` turns a generator with one `yield` into a full context manager without writing a class.',
          whyItWorks: 'Code before `yield` executes on entry; code after `yield` executes on exit.',
          syntaxBreakdown: [{ token: '@contextmanager', meaning: 'Converts generator function into context manager.' }],
          underTheHood: 'Wraps generator in `_GeneratorContextManager` object.',
        },
      },
      {
        id: 'py-ctx-4',
        languageId: 'python',
        topicId: 'py-context-managers',
        title: 'Safe Resource State Switching',
        difficulty: 5,
        difficultyLabel: 'Level 5: Combination',
        type: 'syntax',
        concept: 'temporary-state',
        instructions: 'Given global dict `CONFIG = {"mode": "PRODUCTION"}`. Create `@contextmanager` `temporary_config(new_mode)` that saves old mode, sets `CONFIG["mode"] = new_mode`, `yield`s, and in `finally` restores old mode. Run `with temporary_config("TEST"): print(f"Inside: {CONFIG[\'mode\']}")`, then print `f"Outside: {CONFIG[\'mode\']}"`.',
        starterCode: `from contextlib import contextmanager

CONFIG = {"mode": "PRODUCTION"}

# TODO: Define temporary_config(new_mode) context manager


# TODO: with temporary_config("TEST"): print inside mode
# TODO: print outside mode
`,
        expectedBehavior: 'Prints Inside: TEST, then Outside: PRODUCTION.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Inside: TEST\nOutside: PRODUCTION\n' }],
        hints: [
          { level: 1, text: 'Save `old_mode = CONFIG["mode"]` before changing it.' },
          { level: 2, text: 'In `finally: CONFIG["mode"] = old_mode`' },
          { level: 3, text: 'Outside the `with` block, `CONFIG["mode"]` reverts to "PRODUCTION".' },
        ],
        explanation: {
          simple: 'Context managers are ideal for temporarily overriding configuration or environment variables during testing.',
          whyItWorks: 'The `finally` block guarantees restoration even if inner operations fail.',
          syntaxBreakdown: [{ token: 'finally: CONFIG["mode"] = old', meaning: 'Guaranteed cleanup block.' }],
          underTheHood: 'Ensures zero state leakage between test scenarios.',
        },
      },
    ],
  },

  // 15. Asynchronous Programming (asyncio)
  {
    id: 'py-asyncio',
    title: '15. Asynchronous Programming (asyncio)',
    category: 'advanced',
    order: 15,
    description: 'Master cooperative multitasking, event loops, coroutines, and async/await concurrency with asyncio.',
    prerequisites: ['py-context-managers'],
    exerciseIds: [
      'py-async-1',
      'py-async-2',
      'py-async-3',
      'py-async-4',
    ],
    exercises: [
      {
        id: 'py-async-1',
        languageId: 'python',
        topicId: 'py-asyncio',
        title: 'Coroutines and asyncio.run()',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'async-await',
        instructions: 'Import `asyncio`. Define an async function `main()` that prints "Async starting", awaits `asyncio.sleep(0.01)`, and prints "Async completed". Run the event loop with `asyncio.run(main())`.',
        starterCode: `import asyncio

# TODO: Define async def main()


# TODO: Execute main() using asyncio.run()
`,
        expectedBehavior: 'Prints Async starting, then Async completed.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Async starting\nAsync completed\n' }],
        hints: [
          { level: 1, text: 'Use `async def main():` to define an asynchronous coroutine.' },
          { level: 2, text: 'Use `await asyncio.sleep(0.01)` for non-blocking sleep.' },
          { level: 3, text: '`asyncio.run(main())` creates the event loop and executes the coroutine.' },
        ],
        explanation: {
          simple: '`async/await` enables asynchronous cooperative multitasking on a single thread.',
          whyItWorks: '`asyncio.run()` creates a new event loop, executes the passed coroutine, and closes the loop.',
          syntaxBreakdown: [
            { token: 'async def', meaning: 'Declares an asynchronous coroutine function.' },
            { token: 'await', meaning: 'Suspends coroutine execution until awaited awaitable completes.' },
          ],
          underTheHood: 'Coroutines are specialized generator objects executed by an event loop selector.',
        },
      },
      {
        id: 'py-async-2',
        languageId: 'python',
        topicId: 'py-asyncio',
        title: 'Concurrent Tasks with asyncio.gather()',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'asyncio-gather',
        instructions: 'Define async function `fetch_data(name, delay)` that awaits `asyncio.sleep(delay)` and returns `f"Data from {name}"`. In async `main()`, run `results = await asyncio.gather(fetch_data("A", 0.02), fetch_data("B", 0.01))`. Print each result on its own line. Run with `asyncio.run(main())`.',
        starterCode: `import asyncio

# TODO: Define async def fetch_data(name, delay)


# TODO: Define async def main() using asyncio.gather


# TODO: Run main() with asyncio.run()
`,
        expectedBehavior: 'Prints Data from A, Data from B.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Data from A\nData from B\n' }],
        hints: [
          { level: 1, text: '`async def fetch_data(name, delay): await asyncio.sleep(delay); return f"Data from {name}"`' },
          { level: 2, text: '`results = await asyncio.gather(...)` runs both coroutines concurrently.' },
          { level: 3, text: 'Loop through `results` and print each item.' },
        ],
        explanation: {
          simple: '`asyncio.gather()` schedules multiple coroutines concurrently and collects their results in order.',
          whyItWorks: 'While one coroutine sleeps or waits for I/O, other tasks run cooperatively.',
          syntaxBreakdown: [{ token: 'asyncio.gather(*coros)', meaning: 'Fires multiple tasks concurrently.' }],
          underTheHood: 'Wraps coroutines into `asyncio.Task` instances on the active event loop.',
        },
      },
      {
        id: 'py-async-3',
        languageId: 'python',
        topicId: 'py-asyncio',
        title: 'Asynchronous Queue Producer-Consumer',
        difficulty: 5,
        difficultyLabel: 'Level 5: Combination',
        type: 'syntax',
        concept: 'asyncio-queue',
        instructions: 'Define async function `producer(queue)` that puts numbers `1` and `2` into queue using `await queue.put(item)`. Define async `consumer(queue)` that gets two items using `await queue.get()` and prints each item. In `main()`, create `queue = asyncio.Queue()` and run both with `await asyncio.gather(producer(queue), consumer(queue))`. Execute with `asyncio.run(main())`.',
        starterCode: `import asyncio

# TODO: Define async def producer(queue)


# TODO: Define async def consumer(queue)


# TODO: Define async def main() with asyncio.Queue() and run
`,
        expectedBehavior: 'Prints 1, 2 on separate lines.',
        testCases: [{ id: 't1', input: '', expectedOutput: '1\n2\n' }],
        hints: [
          { level: 1, text: 'In producer: `await queue.put(1); await queue.put(2)`' },
          { level: 2, text: 'In consumer: `for _ in range(2): val = await queue.get(); print(val)`' },
          { level: 3, text: 'In main: `queue = asyncio.Queue(); await asyncio.gather(producer(queue), consumer(queue))`' },
        ],
        explanation: {
          simple: '`asyncio.Queue` allows safe, asynchronous communication between producer and consumer coroutines.',
          whyItWorks: 'If the queue is empty, `await queue.get()` suspends until a new item is available.',
          syntaxBreakdown: [
            { token: 'await queue.put()', meaning: 'Adds item to async queue.' },
            { token: 'await queue.get()', meaning: 'Fetches item from async queue asynchronously.' },
          ],
          underTheHood: 'Maintains internal collections of awaiting Future objects.',
        },
      },
      {
        id: 'py-async-4',
        languageId: 'python',
        topicId: 'py-asyncio',
        title: 'Handling Timeouts with asyncio.wait_for',
        difficulty: 5,
        difficultyLabel: 'Level 5: Combination',
        type: 'syntax',
        concept: 'asyncio-timeout',
        instructions: 'Define async function `slow_op()` that awaits `asyncio.sleep(1.0)`. In async `main()`, use `try...except asyncio.TimeoutError` to `await asyncio.wait_for(slow_op(), timeout=0.05)`. Catch the `TimeoutError` and print "Operation timed out as expected". Run with `asyncio.run(main())`.',
        starterCode: `import asyncio

# TODO: Define async def slow_op()


# TODO: Define async def main() with wait_for and TimeoutError handler


# TODO: Run main() with asyncio.run()
`,
        expectedBehavior: 'Prints Operation timed out as expected.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Operation timed out as expected\n' }],
        hints: [
          { level: 1, text: '`async def slow_op(): await asyncio.sleep(1.0)`' },
          { level: 2, text: 'Inside `try: await asyncio.wait_for(slow_op(), timeout=0.05)`' },
          { level: 3, text: '`except asyncio.TimeoutError: print("Operation timed out as expected")`' },
        ],
        explanation: {
          simple: '`asyncio.wait_for(coro, timeout)` cancels long-running coroutines if they exceed the specified deadline.',
          whyItWorks: 'Schedules a timer callback that cancels the target task if incomplete when deadline elapses.',
          syntaxBreakdown: [{ token: 'asyncio.wait_for(..., timeout=...)', meaning: 'Enforces hard deadline on task.' }],
          underTheHood: 'Calls `task.cancel()` raising `CancelledError` internally in the target coroutine.',
        },
      },
    ],
  },

  // 16. Unit Testing & Test-Driven Development (unittest)
  {
    id: 'py-testing',
    title: '16. Unit Testing & TDD (unittest)',
    category: 'advanced',
    order: 16,
    description: 'Master writing robust test suites, assertions, exception verification, and fixtures with unittest.',
    prerequisites: ['py-asyncio'],
    exerciseIds: [
      'py-test-1',
      'py-test-2',
      'py-test-3',
      'py-test-4',
    ],
    exercises: [
      {
        id: 'py-test-1',
        languageId: 'python',
        topicId: 'py-testing',
        title: 'Standard Library unittest.TestCase',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'unittest-basics',
        instructions: 'Import `unittest`. Define function `multiply(a, b)` returning `a * b`. Define test class `TestMultiply(unittest.TestCase)` with methods `test_positive(self)` asserting `multiply(3, 4) == 12` and `test_zero(self)` asserting `multiply(5, 0) == 0`. At bottom, run `unittest.main(exit=False, verbosity=0)` and print "Tests ran successfully".',
        starterCode: `import unittest

def multiply(a, b):
    # TODO: Return a * b
    pass

class TestMultiply(unittest.TestCase):
    # TODO: Implement test_positive asserting multiply(3, 4) == 12
    # TODO: Implement test_zero asserting multiply(5, 0) == 0
    pass

if __name__ == '__main__':
    unittest.main(exit=False, verbosity=0)
    print("Tests ran successfully")
`,
        expectedBehavior: 'Prints Tests ran successfully.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Tests ran successfully\n' }],
        hints: [
          { level: 1, text: 'Use `self.assertEqual(multiply(3, 4), 12)` in `test_positive`.' },
          { level: 2, text: 'Use `self.assertEqual(multiply(5, 0), 0)` in `test_zero`.' },
          { level: 3, text: 'Test method names MUST start with the prefix `test_`.' },
        ],
        explanation: {
          simple: '`unittest` is Python\'s built-in unit testing framework modeled on xUnit.',
          whyItWorks: 'Test runners discover any method prefixed with `test_` on `unittest.TestCase` subclasses.',
          syntaxBreakdown: [
            { token: 'class Test...(unittest.TestCase):', meaning: 'Defines a test suite class.' },
            { token: 'self.assertEqual(a, b)', meaning: 'Verifies equality, failing test if different.' },
          ],
          underTheHood: 'TestLoader reflects over class attributes looking for `test_` prefixes.',
        },
      },
      {
        id: 'py-test-2',
        languageId: 'python',
        topicId: 'py-testing',
        title: 'Asserting Exceptions with assertRaises',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'unittest-exceptions',
        instructions: 'Define function `divide(a, b)` that raises `ZeroDivisionError("cannot divide by zero")` if `b == 0`, else returns `a / b`. Create `TestDivide(unittest.TestCase)` with `test_zero_division(self)`. Use `with self.assertRaises(ZeroDivisionError): divide(10, 0)`. Run `unittest.main(exit=False, verbosity=0)` and print "Exception verified".',
        starterCode: `import unittest

def divide(a, b):
    # TODO: Raise ZeroDivisionError if b == 0, else return a / b
    pass

class TestDivide(unittest.TestCase):
    def test_zero_division(self):
        # TODO: with self.assertRaises(ZeroDivisionError): call divide(10, 0)
        pass

if __name__ == '__main__':
    unittest.main(exit=False, verbosity=0)
    print("Exception verified")
`,
        expectedBehavior: 'Prints Exception verified.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Exception verified\n' }],
        hints: [
          { level: 1, text: 'In `divide`: `if b == 0: raise ZeroDivisionError("cannot divide by zero")`' },
          { level: 2, text: 'In test: `with self.assertRaises(ZeroDivisionError): divide(10, 0)`' },
          { level: 3, text: 'The test succeeds only if `ZeroDivisionError` is raised inside the context.' },
        ],
        explanation: {
          simple: '`self.assertRaises` used as a context manager verifies that specific exceptions are properly thrown.',
          whyItWorks: 'If no exception or a different exception is raised, the assertion fails.',
          syntaxBreakdown: [{ token: 'with self.assertRaises(Exception):', meaning: 'Asserts code block raises expected error.' }],
          underTheHood: 'Implements context manager catching and validating exception types.',
        },
      },
      {
        id: 'py-test-3',
        languageId: 'python',
        topicId: 'py-testing',
        title: 'Test Lifecycle Fixtures: setUp()',
        difficulty: 4,
        difficultyLabel: 'Level 4: Advanced Concepts',
        type: 'syntax',
        concept: 'unittest-fixtures',
        instructions: 'Define class `TestListFixture(unittest.TestCase)`. In `setUp(self)`, set `self.items = [1, 2, 3]`. In `test_append(self)`, append `4` to `self.items` and assert `len(self.items) == 4`. In `test_length(self)`, assert `len(self.items) == 3` (confirming `setUp` runs before each test). Run `unittest.main(exit=False, verbosity=0)` and print "Fixtures passed".',
        starterCode: `import unittest

class TestListFixture(unittest.TestCase):
    # TODO: Implement setUp(self) initializing self.items = [1, 2, 3]
    # TODO: Implement test_append(self)
    # TODO: Implement test_length(self)
    pass

if __name__ == '__main__':
    unittest.main(exit=False, verbosity=0)
    print("Fixtures passed")
`,
        expectedBehavior: 'Prints Fixtures passed.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'Fixtures passed\n' }],
        hints: [
          { level: 1, text: '`def setUp(self): self.items = [1, 2, 3]` runs fresh before every single test method.' },
          { level: 2, text: 'In `test_append`: `self.items.append(4); self.assertEqual(len(self.items), 4)`' },
          { level: 3, text: 'In `test_length`: `self.assertEqual(len(self.items), 3)`' },
        ],
        explanation: {
          simple: '`setUp()` provides test isolation by giving every test method a fresh, clean fixture state.',
          whyItWorks: 'The test runner calls `setUp()` before and `tearDown()` after each test method individually.',
          syntaxBreakdown: [{ token: 'def setUp(self):', meaning: 'Pre-test initialization hook.' }],
          underTheHood: 'Ensures test methods cannot cause side-effects for subsequent tests.',
        },
      },
      {
        id: 'py-test-4',
        languageId: 'python',
        topicId: 'py-testing',
        title: 'Testing Object Encapsulation & Invariants',
        difficulty: 5,
        difficultyLabel: 'Level 5: Combination',
        type: 'syntax',
        concept: 'unittest-class-testing',
        instructions: 'Define class `BankAccount` with `__init__(self, initial_balance=0)` saving `self.balance = initial_balance`. Add method `deposit(amount)` adding to `self.balance`. Add `withdraw(amount)`: if `amount > self.balance`, raise `ValueError("Insufficient funds")`, else subtract from `self.balance`. Create `TestBankAccount(unittest.TestCase)` testing that deposit works and overdraft raises `ValueError`. Run with `unittest.main(exit=False, verbosity=0)` and print "BankAccount tests verified".',
        starterCode: `import unittest

class BankAccount:
    # TODO: Implement __init__, deposit, withdraw
    pass

class TestBankAccount(unittest.TestCase):
    # TODO: Test deposit increases balance
    # TODO: Test withdraw over balance raises ValueError
    pass

if __name__ == '__main__':
    unittest.main(exit=False, verbosity=0)
    print("BankAccount tests verified")
`,
        expectedBehavior: 'Prints BankAccount tests verified.',
        testCases: [{ id: 't1', input: '', expectedOutput: 'BankAccount tests verified\n' }],
        hints: [
          { level: 1, text: 'In `deposit(self, amount): self.balance += amount`' },
          { level: 2, text: 'In `withdraw(self, amount): if amount > self.balance: raise ValueError("Insufficient funds") ...`' },
          { level: 3, text: 'In test: use `self.assertEqual(acc.balance, ...)` and `with self.assertRaises(ValueError):`' },
        ],
        explanation: {
          simple: 'Unit tests safeguard business logic, invariant enforcement, and regression prevention.',
          whyItWorks: 'Validates both the happy path (deposits/withdrawals) and edge/error cases (overdrafts).',
          syntaxBreakdown: [{ token: 'raise ValueError(...)', meaning: 'Enforces business rule boundary.' }],
          underTheHood: 'Core tenet of Test Driven Development (TDD).',
        },
      },
    ],
  },
];
