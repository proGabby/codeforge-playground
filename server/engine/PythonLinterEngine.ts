import { BestPracticeCheck, BestPracticeReport } from '../../src/types';

export class PythonLinterEngine {
  /**
   * Analyzes student Python code/files against idiomatic Python (PEP 8) best practices,
   * architectural guidelines, and exception safety.
   */
  public static analyze(
    codeOrFiles: string | Record<string, string>,
    isProject: boolean = false,
    _concept?: string
  ): BestPracticeReport {
    const files: Record<string, string> = typeof codeOrFiles === 'string'
      ? { 'main.py': codeOrFiles }
      : codeOrFiles;

    const fileEntries = Object.entries(files);
    const checks: BestPracticeCheck[] = [];

    // Architecture: Multi-File Modularization Check (Projects)
    if (isProject) {
      checks.push(this.checkMultiFileArchitecture(fileEntries));
    }

    // Idiomatic Python: PEP 8 Naming Conventions (snake_case functions vs PascalCase classes)
    checks.push(this.checkNamingConventions(fileEntries));

    // Safety: Avoid Bare `except:` Clauses
    checks.push(this.checkBareExcept(fileEntries));

    // Idiomatic Python: Range-Len Anti-Pattern vs enumerate()
    checks.push(this.checkRangeLenPattern(fileEntries));

    // Code Quality: Docstrings & Code Documentation
    checks.push(this.checkDocstringsAndClarity(fileEntries));

    // Compute score
    const passedCount = checks.filter((c) => c.passed).length;
    const totalCount = checks.length;
    const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 100;

    return {
      score,
      checks,
      passedCount,
      totalCount,
    };
  }

  private static checkMultiFileArchitecture(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    const pyFiles = fileEntries.filter(([name]) => name.endsWith('.py'));
    const nonMainFiles = pyFiles.filter(([name]) => name !== 'main.py' && !name.startsWith('test_'));

    if (pyFiles.length < 2) {
      return {
        id: 'arch-multi-file',
        title: 'Project Modularization',
        category: 'architecture',
        passed: false,
        message: 'Milestone projects must separate concerns across multiple files (e.g. entrypoint in main.py, domain logic in task.py).',
        suggestion: 'Create a dedicated domain module (such as task.py or models.py) for class models and business logic.',
      };
    }

    // Check if domain files contain meaningful class or function definitions
    let hasDomainDeclarations = false;
    for (const [, content] of nonMainFiles) {
      if (/\bclass\s+[A-Z]\w*/.test(content) || /\bdef\s+[a-z_]\w*/.test(content)) {
        hasDomainDeclarations = true;
        break;
      }
    }

    if (!hasDomainDeclarations) {
      return {
        id: 'arch-multi-file',
        title: 'Project Modularization',
        category: 'architecture',
        passed: false,
        message: 'Domain modules should define core domain classes or functions rather than empty stubs.',
        suggestion: 'Place your domain models and helper classes in the imported module.',
      };
    }

    return {
      id: 'arch-multi-file',
      title: 'Project Modularization',
      category: 'architecture',
      passed: true,
      message: `Clean separation of concerns across ${pyFiles.length} modular Python files.`,
    };
  }

  private static checkNamingConventions(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    const camelCaseFunctions: string[] = [];
    const snakeCaseClasses: string[] = [];

    for (const [, content] of fileEntries) {
      // Find def functionName() where name has camelCase (e.g. def calculateTotal:)
      const funcMatches = content.matchAll(/\bdef\s+([a-z]+[A-Z]\w*)\s*\(/g);
      for (const m of funcMatches) {
        if (!camelCaseFunctions.includes(m[1])) {
          camelCaseFunctions.push(m[1]);
        }
      }

      // Find class class_name: where name has lowercase or underscores
      const classMatches = content.matchAll(/\bclass\s+([a-z_]\w*)\s*[:\(]/g);
      for (const m of classMatches) {
        if (!snakeCaseClasses.includes(m[1])) {
          snakeCaseClasses.push(m[1]);
        }
      }
    }

    if (camelCaseFunctions.length > 0) {
      return {
        id: 'pep8-naming',
        title: 'PEP 8 Naming Conventions',
        category: 'idiomatic',
        passed: false,
        message: `PEP 8 recommends snake_case for functions and methods (found: ${camelCaseFunctions.slice(0, 3).join(', ')}).`,
        suggestion: 'Rename functions and methods to snake_case (e.g. `calculate_total` instead of `calculateTotal`).',
      };
    }

    if (snakeCaseClasses.length > 0) {
      return {
        id: 'pep8-naming',
        title: 'PEP 8 Naming Conventions',
        category: 'idiomatic',
        passed: false,
        message: `PEP 8 recommends PascalCase / CapWords for class names (found: ${snakeCaseClasses.slice(0, 3).join(', ')}).`,
        suggestion: 'Rename classes using PascalCase (e.g. `TaskManager` instead of `task_manager`).',
      };
    }

    return {
      id: 'pep8-naming',
      title: 'PEP 8 Naming Conventions',
      category: 'idiomatic',
      passed: true,
      message: 'Functions follow snake_case and classes follow PascalCase conforming to PEP 8.',
    };
  }

  private static checkBareExcept(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    let hasBareExcept = false;

    for (const [, content] of fileEntries) {
      // Check for bare `except:` (ignoring trailing whitespace or comments)
      if (/^\s*except\s*:\s*(#.*)?$/m.test(content)) {
        hasBareExcept = true;
        break;
      }
    }

    if (hasBareExcept) {
      return {
        id: 'safety-bare-except',
        title: 'Avoid Bare `except:` Clauses',
        category: 'safety',
        passed: false,
        message: 'A bare `except:` catches KeyboardInterrupt and SystemExit, making programs difficult to terminate.',
        suggestion: 'Catch specific exception types (e.g. `except ValueError:`) or at least `except Exception:`.',
      };
    }

    return {
      id: 'safety-bare-except',
      title: 'Exception Safety',
      category: 'safety',
      passed: true,
      message: 'Exception handling specifies target exceptions without bare except clauses.',
    };
  }

  private static checkRangeLenPattern(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    let hasRangeLen = false;

    for (const [, content] of fileEntries) {
      // Check for `for ... in range(len(...)):`
      if (/for\s+\w+\s+in\s+range\s*\(\s*len\s*\(/m.test(content)) {
        hasRangeLen = true;
        break;
      }
    }

    if (hasRangeLen) {
      return {
        id: 'idiomatic-iteration',
        title: 'Idiomatic Sequence Iteration',
        category: 'idiomatic',
        passed: false,
        message: 'Iterating using `for i in range(len(items)):` is unidiomatic in Python.',
        suggestion: 'Iterate directly with `for item in items:` or use `for i, item in enumerate(items):` if indices are needed.',
      };
    }

    return {
      id: 'idiomatic-iteration',
      title: 'Idiomatic Sequence Iteration',
      category: 'idiomatic',
      passed: true,
      message: 'Sequence iterations use direct iteration or enumerate() cleanly.',
    };
  }

  private static checkDocstringsAndClarity(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    let hasLongFunctionsWithoutComments = false;

    for (const [, content] of fileEntries) {
      const lines = content.split('\n');
      if (lines.length > 25 && !content.includes('"""') && !content.includes("'''") && !content.includes('#')) {
        hasLongFunctionsWithoutComments = true;
        break;
      }
    }

    if (hasLongFunctionsWithoutComments) {
      return {
        id: 'code-documentation',
        title: 'Module & Function Documentation',
        category: 'idiomatic',
        passed: false,
        message: 'Code contains multiple blocks without docstrings or comments.',
        suggestion: 'Add docstrings `"""Docstring description"""` to explain class or function contracts.',
      };
    }

    return {
      id: 'code-documentation',
      title: 'Module & Function Documentation',
      category: 'idiomatic',
      passed: true,
      message: 'Code includes clear comments or docstrings explaining structure.',
    };
  }
}
