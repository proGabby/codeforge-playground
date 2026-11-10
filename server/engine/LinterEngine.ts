import { BestPracticeCheck, BestPracticeReport } from '../../src/types';

export class LinterEngine {
  /**
   * Analyzes student code/files against idiomatic Go best practices,
   * architectural guidelines, and concurrency/mutation safety.
   */
  public static analyze(
    codeOrFiles: string | Record<string, string>,
    isProject: boolean = false,
    _concept?: string
  ): BestPracticeReport {
    const files: Record<string, string> = typeof codeOrFiles === 'string'
      ? { 'main.go': codeOrFiles }
      : codeOrFiles;

    const fileEntries = Object.entries(files);
    const checks: BestPracticeCheck[] = [];

    // 1. Architecture: Multi-File Modularization Check
    if (isProject) {
      checks.push(this.checkMultiFileArchitecture(fileEntries));
    }

    // 2. Architecture: Package Uniformity Check
    if (fileEntries.length > 1) {
      checks.push(this.checkPackageUniformity(fileEntries));
    }

    // 3. Safety: Pointer Receiver Mutation Bug Check
    checks.push(this.checkPointerReceiverMutation(fileEntries));

    // 4. Idiomatic Go: Error Handling & Propagation Check
    checks.push(this.checkErrorHandling(fileEntries));

    // 5. Architecture: Package-Level Global Mutable State
    if (isProject) {
      checks.push(this.checkGlobalMutableState(fileEntries));
    }

    // 6. Idiomatic Go: Naming Conventions (camelCase vs snake_case)
    checks.push(this.checkNamingConventions(fileEntries));

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
    const goFiles = fileEntries.filter(([name]) => name.endsWith('.go'));
    const nonMainFiles = goFiles.filter(([name]) => name !== 'main.go' && !name.endsWith('_test.go'));

    if (goFiles.length < 2) {
      return {
        id: 'arch-multi-file',
        title: 'Project File Separation',
        category: 'architecture',
        passed: false,
        message: 'Milestone projects must separate concerns across multiple files (e.g. entrypoint in main.go, domain logic in task.go).',
        suggestion: 'Create a dedicated domain file (such as task.go or monitor.go) for struct models and core functions.',
      };
    }

    // Check if domain files contain meaningful code
    let hasDomainDeclarations = false;
    for (const [, content] of nonMainFiles) {
      if (/\btype\s+[A-Z]\w*\s+(struct|interface)\b/.test(content) || /\bfunc\s+[A-Za-z0-9_]+\s*\(/.test(content)) {
        hasDomainDeclarations = true;
        break;
      }
    }

    if (!hasDomainDeclarations) {
      return {
        id: 'arch-multi-file',
        title: 'Project File Separation',
        category: 'architecture',
        passed: false,
        message: 'Domain files exist but appear empty or lack struct/function definitions.',
        suggestion: 'Move struct types and business logic methods into your domain files.',
      };
    }

    return {
      id: 'arch-multi-file',
      title: 'Project File Separation',
      category: 'architecture',
      passed: true,
      message: `Clean separation of concerns across ${goFiles.length} files.`,
    };
  }

  private static checkPackageUniformity(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    const packages: Set<string> = new Set();

    for (const [filename, content] of fileEntries) {
      if (!filename.endsWith('.go')) continue;
      const match = content.match(/^\s*package\s+([a-zA-Z0-9_]+)/m);
      if (match) {
        packages.add(match[1]);
      }
    }

    if (packages.size > 1) {
      return {
        id: 'arch-package-uniformity',
        title: 'Package Namespace Uniformity',
        category: 'architecture',
        passed: false,
        message: `Mismatched packages found: [${Array.from(packages).join(', ')}]. Files in the root directory should share the same package name.`,
        suggestion: 'Ensure all files in the project root declare "package main".',
      };
    }

    return {
      id: 'arch-package-uniformity',
      title: 'Package Namespace Uniformity',
      category: 'architecture',
      passed: true,
      message: 'All project files share a consistent package namespace ("package main").',
    };
  }

  private static checkPointerReceiverMutation(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    const valueReceiverMutationRegex = /func\s*\(\s*([a-zA-Z0-9_]+)\s+([A-Z][a-zA-Z0-9_]*)\s*\)\s*([A-Za-z0-9_]+)\s*\([^)]*\)[^{]*\{([\s\S]*?)\}/g;

    for (const [filename, content] of fileEntries) {
      if (!filename.endsWith('.go')) continue;

      let match;
      while ((match = valueReceiverMutationRegex.exec(content)) !== null) {
        const recvVar = match[1];
        const typeName = match[2];
        const methodName = match[3];
        const body = match[4];

        // Check if receiver field is mutated: recvVar.field = ...
        const mutationPattern = new RegExp(`\\b${recvVar}\\.[a-zA-Z0-9_]+\\s*([+\\-*/%&|^]?=)`, 'm');
        if (mutationPattern.test(body)) {
          return {
            id: 'safety-pointer-receiver',
            title: 'Pointer Receiver for Mutations',
            category: 'safety',
            passed: false,
            message: `Method "${methodName}" on "${typeName}" mutates fields using a value receiver (${recvVar} ${typeName}) in ${filename}. Value receivers copy the struct and discard changes!`,
            suggestion: `Change the receiver from (${recvVar} ${typeName}) to a pointer receiver: (${recvVar} *${typeName}).`,
          };
        }
      }
    }

    return {
      id: 'safety-pointer-receiver',
      title: 'Pointer Receiver for Mutations',
      category: 'safety',
      passed: true,
      message: 'Mutating methods correctly use pointer receivers (*T) to modify struct state.',
    };
  }

  private static checkErrorHandling(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    for (const [filename, content] of fileEntries) {
      if (!filename.endsWith('.go')) continue;

      // Check for ignored errors on standard functions that return error: _, err := or _, _ :=
      if (/,\s*_\s*:=\s*(os\.Open|strconv\.Atoi|json\.Unmarshal|http\.Get)/.test(content)) {
        return {
          id: 'idiomatic-error-handling',
          title: 'Idiomatic Error Handling',
          category: 'idiomatic',
          passed: false,
          message: `Discarded error using blank identifier "_" in ${filename}.`,
          suggestion: 'Capture the error (val, err := ...) and check "if err != nil" instead of discarding it with "_".',
        };
      }
    }

    return {
      id: 'idiomatic-error-handling',
      title: 'Idiomatic Error Handling',
      category: 'idiomatic',
      passed: true,
      message: 'No ignored error return values detected.',
    };
  }

  private static checkGlobalMutableState(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    // Check for root package-level mutable slices/maps: var tasks = []... outside functions
    for (const [filename, content] of fileEntries) {
      if (!filename.endsWith('.go')) continue;

      const lines = content.split('\n');
      let inFunction = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (/^func\s+/.test(trimmed)) {
          inFunction = true;
        }
        if (inFunction && trimmed === '}') {
          inFunction = false;
          continue;
        }

        if (!inFunction && /^var\s+[a-zA-Z0-9_]+\s*=\s*(make\(|\[\]|map\[)/.test(trimmed)) {
          return {
            id: 'arch-global-state',
            title: 'Avoid Global Mutable State',
            category: 'architecture',
            passed: false,
            message: `Found package-level mutable state ("${trimmed}") in ${filename}. Global mutable state causes concurrency bugs and tight coupling.`,
            suggestion: 'Encapsulate state inside a Manager/Store struct or pass data through function parameters.',
          };
        }
      }
    }

    return {
      id: 'arch-global-state',
      title: 'Encapsulated State',
      category: 'architecture',
      passed: true,
      message: 'State is cleanly encapsulated within structs and function scopes without global variables.',
    };
  }

  private static checkNamingConventions(
    fileEntries: [string, string][]
  ): BestPracticeCheck {
    for (const [filename, content] of fileEntries) {
      if (!filename.endsWith('.go')) continue;

      // Look for snake_case identifier declarations: var foo_bar, func do_something
      const snakeFuncMatch = content.match(/\bfunc\s+([a-z]+_[a-z0-9_]+)\s*\(/);
      if (snakeFuncMatch) {
        const name = snakeFuncMatch[1];
        const camel = name.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
        return {
          id: 'idiomatic-naming',
          title: 'Go Naming Conventions',
          category: 'idiomatic',
          passed: false,
          message: `Function name "${name}" in ${filename} uses snake_case. Go conventions strictly prefer camelCase or PascalCase.`,
          suggestion: `Rename "${name}" to "${camel}".`,
        };
      }
    }

    return {
      id: 'idiomatic-naming',
      title: 'Go Naming Conventions',
      category: 'idiomatic',
      passed: true,
      message: 'Identifiers follow Go camelCase / PascalCase naming conventions.',
    };
  }
}

