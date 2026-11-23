import type { EngineeringConceptQuiz } from '../../../src/types';

// 1. System Design & Architecture
import { API_DESIGN_AND_CACHING_50_QUESTIONS } from './concepts/apiDesignAndCaching';
import { RATE_LIMITING_AND_CACHE_50_QUESTIONS } from './concepts/rateLimitingAndCacheInvalidation';
import { DISTRIBUTED_EVENT_DRIVEN_50_QUESTIONS } from './concepts/distributedEventDrivenArchitecture';

// 2. Databases & Storage Internals
import { RELATIONAL_INDEXES_50_QUESTIONS } from './concepts/relationalIndexesAndQueryExecution';
import { ACID_TRANSACTIONS_50_QUESTIONS } from './concepts/acidTransactionsAndIsolation';
import { STORAGE_ENGINES_WAL_50_QUESTIONS } from './concepts/storageEnginesAndWal';

// 3. DevOps, Containers & Cloud
import { DOCKER_INTERNALS_50_QUESTIONS } from './concepts/dockerInternalsAndOptimization';
import { KUBERNETES_LIFECYCLE_50_QUESTIONS } from './concepts/kubernetesPodLifecycle';
import { ZERO_DOWNTIME_DEPLOYMENTS_50_QUESTIONS } from './concepts/zeroDowntimeDeployments';

// 4. Networking & Protocols
import { DNS_AND_TCP_50_QUESTIONS } from './concepts/dnsAndTcpHandshakes';
import { HTTP_EVOLUTION_QUIC_50_QUESTIONS } from './concepts/httpEvolutionQuic';
import { TLS_WEBSOCKETS_GRPC_50_QUESTIONS } from './concepts/tlsWebSocketsGrpc';

// 5. Concurrency & Distributed Systems
import { RACE_CONDITIONS_SYNCHRONIZATION_50_QUESTIONS } from './concepts/raceConditionsAndSynchronization';
import { COFFMAN_DEADLOCKS_THREADPOOLS_50_QUESTIONS } from './concepts/coffmanDeadlocksAndThreadPools';
import { RAFT_CONSENSUS_SPLIT_BRAIN_50_QUESTIONS } from './concepts/raftConsensusAndSplitBrain';

export const ENGINEERING_CONCEPT_QUIZZES: EngineeringConceptQuiz[] = [
  // ============================================================================
  // 1. SYSTEM DESIGN & ARCHITECTURE
  // ============================================================================
  {
    id: 'quiz-concept-sysdesign-1',
    topicId: 'concept-sysdesign-1',
    languageId: 'concept',
    domain: 'system-design',
    domainLabel: 'System Design',
    title: 'API Design & HTTP Caching Fundamentals',
    description: 'Comprehensive 50-scenario question bank spanning Easy (HTTP semantics & status codes), Medium (Cache-Control, ETags, pagination & CORS), and Hard (Vary headers, cache stampedes, XFetch, and zero-trust security).',
    difficulty: 'beginner',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: API_DESIGN_AND_CACHING_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-sysdesign-2',
    topicId: 'concept-sysdesign-2',
    languageId: 'concept',
    domain: 'system-design',
    domainLabel: 'System Design',
    title: 'Rate Limiting & Cache Invalidation Patterns',
    description: 'Comprehensive 50-scenario question bank spanning Easy (token/leaky buckets, sliding windows, cache-aside), Medium (Redis ZSET, Redlock, stampede mitigation, CDN tags), and Hard (HFT GCRA, CDC Debezium, dual-cache L1/L2, clock skew).',
    difficulty: 'intermediate',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: RATE_LIMITING_AND_CACHE_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-sysdesign-3',
    topicId: 'concept-sysdesign-3',
    languageId: 'concept',
    domain: 'system-design',
    domainLabel: 'System Design',
    title: 'Distributed Systems & Event-Driven Architecture',
    description: 'Comprehensive 50-scenario question bank spanning Easy (Pub/Sub, Kafka partitions, offsets, idempotency), Medium (Kafka EOS, Sagas, Outbox, DLQ with jitter), and Hard (KRaft consensus, cooperative rebalances, reactive backpressure, fencing tokens).',
    difficulty: 'advanced',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: DISTRIBUTED_EVENT_DRIVEN_50_QUESTIONS,
  },

  // ============================================================================
  // 2. DATABASES & STORAGE INTERNALS
  // ============================================================================
  {
    id: 'quiz-concept-db-1',
    topicId: 'concept-db-1',
    languageId: 'concept',
    domain: 'databases',
    domainLabel: 'Databases & Storage',
    title: 'Relational Indexes & Query Execution',
    description: 'Comprehensive 50-scenario question bank spanning Easy (B-Tree structure & prefix rules), Medium (covering & partial indexes, GiST/GIN), and Hard (planner costs, join spilling, pg_repack & BRIN).',
    difficulty: 'beginner',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: RELATIONAL_INDEXES_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-db-2',
    topicId: 'concept-db-2',
    languageId: 'concept',
    domain: 'databases',
    domainLabel: 'Databases & Storage',
    title: 'ACID Transactions & Isolation Levels',
    description: 'Comprehensive 50-scenario question bank spanning Easy (ACID & isolation anomalies), Medium (MVCC, write skew & locking), and Hard (SSI rw-antidependencies, 2PC & distributed anomalies).',
    difficulty: 'intermediate',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: ACID_TRANSACTIONS_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-db-3',
    topicId: 'concept-db-3',
    languageId: 'concept',
    domain: 'databases',
    domainLabel: 'Databases & Storage',
    title: 'Storage Engines, WAL & Distributed Databases',
    description: 'Comprehensive 50-scenario question bank spanning Easy (WAL, B+ trees & buffer pool), Medium (LSM trees, SSTables & compaction), and Hard (ARIES recovery, Raft over LSM & Spanner TrueTime).',
    difficulty: 'advanced',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: STORAGE_ENGINES_WAL_50_QUESTIONS,
  },

  // ============================================================================
  // 3. DEVOPS, CONTAINERS & CLOUD
  // ============================================================================
  {
    id: 'quiz-concept-devops-1',
    topicId: 'concept-devops-1',
    languageId: 'concept',
    domain: 'devops-cloud',
    domainLabel: 'DevOps & Cloud',
    title: 'Docker Internals & Multi-Stage Builds',
    description: 'Comprehensive 50-scenario question bank spanning Easy (layer caching & instructions), Medium (Linux namespaces, cgroups, BuildKit & Distroless), and Hard (overlay2 driver, zombie reaping, rootless, and seccomp).',
    difficulty: 'beginner',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: DOCKER_INTERNALS_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-devops-2',
    topicId: 'concept-devops-2',
    languageId: 'concept',
    domain: 'devops-cloud',
    domainLabel: 'DevOps & Cloud',
    title: 'Kubernetes Pod Lifecycles & Probes',
    description: 'Comprehensive 50-scenario question bank spanning Easy (pod phases, liveness/readiness probes), Medium (graceful termination, preStop hooks, PDBs, QoS), and Hard (eviction managers, native sidecars, topology spread, CFS throttling).',
    difficulty: 'intermediate',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: KUBERNETES_LIFECYCLE_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-devops-3',
    topicId: 'concept-devops-3',
    languageId: 'concept',
    domain: 'devops-cloud',
    domainLabel: 'DevOps & Cloud',
    title: 'Zero-Downtime Rollouts & CI/CD Pipelines',
    description: 'Comprehensive 50-scenario question bank spanning Easy (RollingUpdate vs Recreate, GitOps), Medium (Canary, Blue/Green, Helm drift, expand-contract migrations), and Hard (service mesh routing, automated canary analysis, Cosign & SBOM).',
    difficulty: 'advanced',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: ZERO_DOWNTIME_DEPLOYMENTS_50_QUESTIONS,
  },

  // ============================================================================
  // 4. NETWORKING & PROTOCOLS
  // ============================================================================
  {
    id: 'quiz-concept-network-1',
    topicId: 'concept-network-1',
    languageId: 'concept',
    domain: 'networking',
    domainLabel: 'Networking & Protocols',
    title: 'DNS Resolution & TCP Handshakes',
    description: 'Comprehensive 50-scenario question bank spanning Easy (DNS record types, recursive resolvers, TCP 3-way handshake), Medium (SYN cookies, TIME_WAIT, flow/congestion control, Nagle algorithm), and Hard (BBR vs CUBIC, TFO, PMTUD, eBPF).',
    difficulty: 'beginner',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: DNS_AND_TCP_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-network-2',
    topicId: 'concept-network-2',
    languageId: 'concept',
    domain: 'networking',
    domainLabel: 'Networking & Protocols',
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)',
    description: 'Comprehensive 50-scenario question bank spanning Easy (keep-alive, binary framing, multiplexing, HPACK), Medium (stream prioritization, RST_STREAM, 103 Early Hints, TCP HOL blocking), and Hard (QUIC connection migration, QPACK, 0-RTT).',
    difficulty: 'intermediate',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: HTTP_EVOLUTION_QUIC_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-network-3',
    topicId: 'concept-network-3',
    languageId: 'concept',
    domain: 'networking',
    domainLabel: 'Networking & Protocols',
    title: 'TLS 1.3, WebSockets & gRPC Internals',
    description: 'Comprehensive 50-scenario question bank spanning Easy (symmetric/asymmetric crypto, TLS 1.3 1-RTT, WebSocket upgrade, gRPC protobuf), Medium (ECDHE forward secrecy, SNI, ALPN, gRPC streaming), and Hard (0-RTT PSK, OCSP stapling, HTTP/2 framing).',
    difficulty: 'advanced',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: TLS_WEBSOCKETS_GRPC_50_QUESTIONS,
  },

  // ============================================================================
  // 5. CONCURRENCY & DISTRIBUTED SYSTEMS
  // ============================================================================
  {
    id: 'quiz-concept-concurrency-1',
    topicId: 'concept-concurrency-1',
    languageId: 'concept',
    domain: 'concurrency-distributed',
    domainLabel: 'Concurrency & Distributed',
    title: 'Race Conditions & Synchronization Primitives',
    description: 'Comprehensive 50-scenario question bank spanning Easy (data races, mutexes, CAS, semaphores), Medium (lock-free structures, ABA problem, memory barriers, MESI false sharing), and Hard (LMAX Disruptor, progress hierarchies, seqlocks, RCU, TSX, sync.Map, futex).',
    difficulty: 'beginner',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: RACE_CONDITIONS_SYNCHRONIZATION_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-concurrency-2',
    topicId: 'concept-concurrency-2',
    languageId: 'concept',
    domain: 'concurrency-distributed',
    domainLabel: 'Concurrency & Distributed',
    title: 'The 4 Coffman Conditions & Thread Pools',
    description: 'Comprehensive 50-scenario question bank spanning Easy (4 Coffman conditions, deadlock/livelock/starvation, thread pool sizing), Medium (global lock ordering, rejection policies, sizing formulas, work-stealing), and Hard (priority inversion/PIP, WFG cycle detection, Go GMP scheduler, sysmon preemption, biased locks).',
    difficulty: 'intermediate',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: COFFMAN_DEADLOCKS_THREADPOOLS_50_QUESTIONS,
  },
  {
    id: 'quiz-concept-concurrency-3',
    topicId: 'concept-concurrency-3',
    languageId: 'concept',
    domain: 'concurrency-distributed',
    domainLabel: 'Concurrency & Distributed',
    title: 'Consensus Algorithms (Raft) & Split-Brain Mitigation',
    description: 'Comprehensive 50-scenario question bank spanning Easy (SMR, Paxos vs Raft, node states, quorums, heartbeats, split-brain), Medium (randomized timers, RequestVote, log matching, joint consensus, fencing tokens), and Hard (pre-vote protocol, snapshots, ReadIndex/LeaseRead, CFT vs BFT, Multi-Raft in TiKV/CockroachDB).',
    difficulty: 'advanced',
    passingScorePercent: 75,
    xpReward: 250,
    estimatedMinutes: 25,
    questions: RAFT_CONSENSUS_SPLIT_BRAIN_50_QUESTIONS,
  },
];
