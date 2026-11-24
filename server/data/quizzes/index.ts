import type { SectionQuiz, EngineeringConceptQuiz, EngineeringDomain, ConceptDifficulty } from '../../../src/types';
import { GO_QUIZZES } from './goQuizzes';
import { PYTHON_QUIZZES } from './pythonQuizzes';
import { JAVASCRIPT_QUIZZES } from './jsQuizzes';
import { TYPESCRIPT_QUIZZES } from './tsQuizzes';
import { ENGINEERING_CONCEPT_QUIZZES } from './engineeringConceptQuizzes';

export {
  GO_QUIZZES,
  PYTHON_QUIZZES,
  JAVASCRIPT_QUIZZES,
  TYPESCRIPT_QUIZZES,
  ENGINEERING_CONCEPT_QUIZZES,
};

export const ALL_QUIZZES: SectionQuiz[] = [
  ...GO_QUIZZES,
  ...PYTHON_QUIZZES,
  ...JAVASCRIPT_QUIZZES,
  ...TYPESCRIPT_QUIZZES,
  ...ENGINEERING_CONCEPT_QUIZZES,
];

export function getQuizByTopicId(topicId: string, languageId?: string): SectionQuiz | undefined {
  if (languageId === 'typescript') {
    return TYPESCRIPT_QUIZZES.find((q) => q.topicId === topicId) ||
      ALL_QUIZZES.find((q) => q.topicId === topicId);
  }
  if (languageId === 'javascript') {
    return JAVASCRIPT_QUIZZES.find((q) => q.topicId === topicId) ||
      ALL_QUIZZES.find((q) => q.topicId === topicId);
  }
  if (languageId === 'python') {
    return PYTHON_QUIZZES.find((q) => q.topicId === topicId) ||
      ALL_QUIZZES.find((q) => q.topicId === topicId);
  }
  if (languageId === 'go') {
    return GO_QUIZZES.find((q) => q.topicId === topicId) ||
      ALL_QUIZZES.find((q) => q.topicId === topicId);
  }
  return ALL_QUIZZES.find((q) => q.topicId === topicId);
}

export function getQuizById(quizId: string): SectionQuiz | undefined {
  return ALL_QUIZZES.find((q) => q.id === quizId);
}

export function getQuizzesForLanguage(languageId: string): SectionQuiz[] {
  const lang = languageId.toLowerCase();
  if (lang === 'typescript') {
    return TYPESCRIPT_QUIZZES;
  }
  if (lang === 'javascript') {
    return JAVASCRIPT_QUIZZES;
  }
  if (lang === 'python') {
    return PYTHON_QUIZZES;
  }
  if (lang === 'go') {
    return GO_QUIZZES;
  }
  if (lang === 'concept') {
    return ENGINEERING_CONCEPT_QUIZZES;
  }
  return GO_QUIZZES;
}

export function getEngineeringConceptQuizzes(
  domain?: EngineeringDomain,
  difficulty?: ConceptDifficulty
): EngineeringConceptQuiz[] {
  return ENGINEERING_CONCEPT_QUIZZES.filter((quiz) => {
    if (domain && quiz.domain !== domain) return false;
    if (difficulty && quiz.difficulty !== difficulty) return false;
    return true;
  });
}

export interface DomainSummary {
  id: EngineeringDomain;
  label: string;
  description: string;
  quizCount: number;
  questionCount: number;
  totalXp: number;
}

export const CONCEPT_DOMAINS_METADATA: DomainSummary[] = [
  {
    id: 'system-design',
    label: 'System Design & Architecture',
    description: 'High-availability, idempotent APIs, caching hierarchies, and distributed message broker architectures.',
    quizCount: 3,
    questionCount: 150,
    totalXp: 750,
  },
  {
    id: 'databases',
    label: 'Databases & Storage Internals',
    description: 'B-Trees vs LSM-Trees, index selectivity, write-ahead logs (WAL), and ACID isolation anomalies.',
    quizCount: 3,
    questionCount: 150,
    totalXp: 750,
  },
  {
    id: 'devops-cloud',
    label: 'DevOps, Containers & Cloud',
    description: 'Docker image optimization, Kubernetes pod lifecycle probes, zero-downtime deployments, and CI/CD pipelines.',
    quizCount: 3,
    questionCount: 150,
    totalXp: 750,
  },
  {
    id: 'networking',
    label: 'Networking & Protocols',
    description: 'TCP 3-way handshake, TLS 1.3 session resumption, HTTP/2 multiplexing, HTTP/3 (QUIC), and gRPC wire protocols.',
    quizCount: 3,
    questionCount: 150,
    totalXp: 750,
  },
  {
    id: 'concurrency-distributed',
    label: 'Concurrency & Distributed Systems',
    description: 'Race conditions, memory barriers, thread pool sizing, Raft leader election, and split-brain mitigation.',
    quizCount: 3,
    questionCount: 150,
    totalXp: 750,
  },
];
