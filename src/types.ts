export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type LearningMode = 'guided' | 'practice' | 'challenge';

export type ExerciseType =
  | 'syntax'
  | 'prediction'
  | 'fill_blank'
  | 'fix_code'
  | 'function'
  | 'struct'
  | 'method'
  | 'algorithm';

export interface LanguageInfo {
  id: string;
  name: string;
  version: string;
  icon: string;
  enabled: boolean;
  fileExtension: string;
  description: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
  hidden?: boolean;
}

export interface Hint {
  level: 1 | 2 | 3;
  text: string;
}

export interface Exercise {
  id: string;
  languageId: string;
  topicId: string;
  title: string;
  difficulty: DifficultyLevel;
  difficultyLabel: string;
  type: ExerciseType;
  concept: string;
  instructions: string;
  starterCode: string;
  starterFiles?: Record<string, string>;
  isProject?: boolean;
  readOnlyFiles?: string[];
  options?: string[]; // For prediction / fill_blank exercises
  correctOption?: string; // For prediction exercises
  blankPlaceholder?: string;
  expectedBehavior: string;
  testCases?: TestCase[];
  hints: Hint[];
  explanation: {
    simple: string;
    whyItWorks: string;
    syntaxBreakdown: { token: string; meaning: string }[];
    underTheHood: string;
  };
}

export interface Topic {
  id: string;
  title: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  description: string;
  prerequisites: string[]; // Topic IDs that unlock this topic
  exerciseIds: string[];
}

export interface GuidedCorrection {
  lineIndex: number;
  rawCompilerError?: string;
  whatHappened: string;
  whyItHappened: string;
  howToFix: string;
  graduatedHints: string[]; // [Hint 1: Conceptual, Hint 2: Syntax, Hint 3: Actionable]
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  compiledSuccessfully: boolean;
}

export interface BestPracticeCheck {
  id: string;
  title: string;
  passed: boolean;
  message: string;
  category: 'architecture' | 'idiomatic' | 'safety';
  suggestion?: string;
}

export interface BestPracticeReport {
  score: number; // 0 - 100
  checks: BestPracticeCheck[];
  passedCount: number;
  totalCount: number;
}

export interface SubmissionResult {
  success: boolean;
  execution: ExecutionResult;
  passedTestCount: number;
  totalTestCount: number;
  testDetails?: {
    testId: string;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    description?: string;
  }[];
  correction?: GuidedCorrection;
  bestPractices?: BestPracticeReport;
  codeQualityNotes?: string[];
  conceptsLearned?: string[];
}

export interface LineExplanation {
  lineText: string;
  lineNumber: number;
  summary: string;
  breakdown: { token: string; description: string }[];
  underTheHood?: string;
}

export interface UserProgress {
  completedExerciseIds: string[];
  failedAttemptsCount: Record<string, number>; // exerciseId -> fail count
  hintsUsedCount: Record<string, number>;
  topicProgress: Record<string, number>; // topicId -> percentage 0-100
  unlockedTopicIds: string[];
  streakDays: number;
  totalTimeSpentSeconds: number;
  weakConcepts: string[]; // Concept tags where failure rate is high
  lastActiveTopicId: string;
  lastActiveExerciseId: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
