import type { QuizQuestion } from '../../../../src/types';

export const RAFT_CONSENSUS_SPLIT_BRAIN_50_QUESTIONS: QuizQuestion[] = [
  {
    "id": "q-conc-raft-1",
    "difficulty": "easy",
    "question": "What is the primary objective of a Distributed Consensus algorithm (such as Raft or Paxos)?",
    "options": [
      {
        "id": "a",
        "text": "To compress data across network interfaces to maximize bandwidth"
      },
      {
        "id": "b",
        "text": "To encrypt inter-node communications using public key infrastructure"
      },
      {
        "id": "c",
        "text": "To enable a cluster of distributed, failure-prone machines to agree on a sequence of state transitions or values, ensuring consistency even if some nodes crash or messages are delayed"
      },
      {
        "id": "d",
        "text": "To balance CPU utilization equally across all operating system cores"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Distributed consensus algorithms ensure that multiple networked nodes agree on values, state machine inputs, or transaction orders, preserving consistency and safety despite network partitions, message delays, and node crash-recovery faults.",
    "conceptTag": "distributed-consensus-fundamentals"
  },
  {
    "id": "q-conc-raft-2",
    "difficulty": "easy",
    "question": "What is the foundational principle of State Machine Replication (SMR) in distributed systems?",
    "options": [
      {
        "id": "a",
        "text": "All machines must run the exact same operating system version and kernel"
      },
      {
        "id": "b",
        "text": "Hardware interrupts must be broadcast to all nodes simultaneously"
      },
      {
        "id": "c",
        "text": "State machines must periodically reboot every 24 hours to clear memory leaks"
      },
      {
        "id": "d",
        "text": "If multiple deterministic state machines start from the identical initial state and execute the exact same sequence of deterministic inputs in the identical order, they will produce identical outputs and reach identical states"
      }
    ],
    "correctOptionId": "d",
    "explanation": "State Machine Replication relies on determinism: identical state machines given the identical sequence of inputs will produce the exact same sequence of states. Consensus algorithms like Raft simply manage the replicated append-only log of these inputs.",
    "conceptTag": "distributed-state-machine-replication"
  },
  {
    "id": "q-conc-raft-3",
    "difficulty": "easy",
    "question": "Why did Diego Ongaro and John Ousterhout design the Raft consensus algorithm as an alternative to Paxos?",
    "options": [
      {
        "id": "a",
        "text": "Paxos was notoriously difficult to understand and implement in real-world software; Raft was designed specifically for understandability by decomposing consensus into Leader Election, Log Replication, and Safety"
      },
      {
        "id": "b",
        "text": "Paxos was patented and could not be used in open source software"
      },
      {
        "id": "c",
        "text": "Paxos does not support TCP/IP networking"
      },
      {
        "id": "d",
        "text": "Raft is mathematically proven to run $1000\\times$ faster than Paxos on identical hardware"
      }
    ],
    "correctOptionId": "a",
    "explanation": "The core design goal of Raft was understandability and practical implementability. Paxos is famously abstract and monolithic, leading to widespread divergence in real implementations (e.g. Chubby). Raft decomposed consensus into distinct, comprehensible subproblems: leader election, log replication, and safety.",
    "conceptTag": "raft-vs-paxos-philosophy"
  },
  {
    "id": "q-conc-raft-4",
    "difficulty": "easy",
    "question": "What are the three mutually exclusive states a node can occupy in the Raft consensus protocol?",
    "options": [
      {
        "id": "a",
        "text": "Primary, Secondary, Arbiter"
      },
      {
        "id": "b",
        "text": "Leader, Follower, Candidate"
      },
      {
        "id": "c",
        "text": "Master, Worker, Coordinator"
      },
      {
        "id": "d",
        "text": "Proposer, Acceptor, Learner"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In Raft, at any given time, each node is in one of three states: Leader (handles all client requests and coordinates log replication), Follower (passive, responds to RPCs from leaders and candidates), or Candidate (actively seeking votes to become a new leader).",
    "conceptTag": "raft-node-states"
  },
  {
    "id": "q-conc-raft-5",
    "difficulty": "easy",
    "question": "In a healthy Raft cluster, how do clients interact with the cluster for write operations?",
    "options": [
      {
        "id": "a",
        "text": "Clients write directly to all nodes simultaneously using UDP multicast"
      },
      {
        "id": "b",
        "text": "All client writes must be directed to the Leader; if a client contacts a Follower, the follower redirects the client to the current Leader"
      },
      {
        "id": "c",
        "text": "Clients write to any Follower; followers elect a temporary leader for that single write"
      },
      {
        "id": "d",
        "text": "Clients submit writes to an external consensus proxy that bypasses Raft"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Raft uses a strong leader approach. All write requests must flow through the Leader. If a client sends a request to a Follower, the follower either rejects it with the leader's network address or forwards the request directly to the Leader.",
    "conceptTag": "raft-client-interaction"
  },
  {
    "id": "q-conc-raft-6",
    "difficulty": "easy",
    "question": "What is the mathematical formula for a Quorum (strict majority) in a Raft cluster consisting of $N$ nodes?",
    "options": [
      {
        "id": "a",
        "text": "$\\lfloor N / 2 \\rfloor + 1$ (strictly greater than $50\\%$ of all nodes)"
      },
      {
        "id": "b",
        "text": "$N - 1$"
      },
      {
        "id": "c",
        "text": "$2N / 3$"
      },
      {
        "id": "d",
        "text": "$\\sqrt{N} + 1$"
      }
    ],
    "correctOptionId": "a",
    "explanation": "A quorum in Raft is a strict majority of the total cluster nodes: $\\lfloor N / 2 \\rfloor + 1$. For $N=3$, quorum is 2; for $N=5$, quorum is 3; for $N=7$, quorum is 4. A strict majority ensures that any two quorums must overlap by at least one node.",
    "conceptTag": "raft-quorum-formula"
  },
  {
    "id": "q-conc-raft-7",
    "difficulty": "easy",
    "question": "Why do distributed engineering teams deploy Raft clusters with an odd number of nodes (e.g. 3, 5, or 7) rather than an even number (e.g. 4 or 6)?",
    "options": [
      {
        "id": "a",
        "text": "Even node counts cause hash collisions in Raft's CRC32 checksums"
      },
      {
        "id": "b",
        "text": "Raft election algorithms fail to terminate if node IDs are even numbers"
      },
      {
        "id": "c",
        "text": "Operating system kernels cannot bind network sockets across 4 nodes"
      },
      {
        "id": "d",
        "text": "A 4-node cluster requires a quorum of 3, meaning it can only tolerate 1 node failure\u2014the exact same fault tolerance as a 3-node cluster\u2014while requiring more hardware and increasing RPC latency"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Fault tolerance is $\\lfloor (N-1)/2 \\rfloor$. For $N=3$, quorum is 2, tolerating 1 failure. For $N=4$, quorum is 3, still tolerating only 1 failure ($4 - 3 = 1$). Adding the 4th node provides zero additional fault tolerance while adding hardware cost and increasing election tie probabilities.",
    "conceptTag": "raft-odd-node-count"
  },
  {
    "id": "q-conc-raft-8",
    "difficulty": "easy",
    "question": "How does a Raft Leader maintain its authority and prevent Followers from initiating new elections?",
    "options": [
      {
        "id": "a",
        "text": "By executing a continuous CPU-heavy cryptographic hash"
      },
      {
        "id": "b",
        "text": "By holding an exclusive TCP connection open on port 443"
      },
      {
        "id": "c",
        "text": "By sending periodic empty `AppendEntries` RPCs (Heartbeats) to all followers within their election timeout window"
      },
      {
        "id": "d",
        "text": "By updating a shared file on a centralized NFS server"
      }
    ],
    "correctOptionId": "c",
    "explanation": "The leader periodically sends `AppendEntries` RPCs with no log entries (heartbeats) to all followers. Whenever a follower receives a valid heartbeat from the current leader, it resets its election timeout timer, remaining in the Follower state.",
    "conceptTag": "raft-heartbeats"
  },
  {
    "id": "q-conc-raft-9",
    "difficulty": "easy",
    "question": "What is the recommended relationship between the Heartbeat Interval and the Election Timeout in a Raft deployment?",
    "options": [
      {
        "id": "a",
        "text": "Heartbeat interval should be $10\\times$ larger than election timeout"
      },
      {
        "id": "b",
        "text": "Heartbeat interval must be at least 60 seconds to prevent network saturation"
      },
      {
        "id": "c",
        "text": "They must be set to the exact same microsecond value"
      },
      {
        "id": "d",
        "text": "Heartbeat interval should be significantly smaller (e.g. $50\\text{ms}$) than the election timeout (e.g. $150\\text{ms} - 300\\text{ms}$) to ensure multiple heartbeats arrive before followers time out"
      }
    ],
    "correctOptionId": "d",
    "explanation": "The timing requirement is: $\\text{broadcastTime} \\ll \\text{electionTimeout} \\ll \\text{MTBF}$ (Mean Time Between Failures). Typically, heartbeats are sent every 10\u201350ms, while election timeouts are 150\u2013300ms. This ensures normal network jitter or packet loss does not trigger spurious elections.",
    "conceptTag": "raft-timing-parameters"
  },
  {
    "id": "q-conc-raft-10",
    "difficulty": "easy",
    "question": "What is a 'Split-Brain' scenario in a distributed cluster?",
    "options": [
      {
        "id": "a",
        "text": "When a CPU cache splits between instructions and data"
      },
      {
        "id": "b",
        "text": "A network partition divides the cluster into two or more isolated segments, and more than one segment believes it is the legitimate leader, independently accepting conflicting writes and corrupting data"
      },
      {
        "id": "c",
        "text": "When a node runs two operating systems via hypervisor virtualization"
      },
      {
        "id": "d",
        "text": "When a database engine splits tables across SSDs and HDDs"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Split-brain occurs when a network partition cuts a cluster in half, and both sides elect independent leaders (dual masters). If clients can write to both leaders, data diverges irreconcilably, violating linearizability and corrupting system state.",
    "conceptTag": "distributed-split-brain-definition"
  },
  {
    "id": "q-conc-raft-11",
    "difficulty": "easy",
    "question": "How does Raft's strict majority quorum guarantee prevent Split-Brain during a network partition?",
    "options": [
      {
        "id": "a",
        "text": "Because a cluster has a total of $N$ nodes, it is mathematically impossible for two disjoint subsets of nodes to both contain a strict majority ($\\lfloor N/2 \\rfloor + 1$); only the partition with more than half the nodes can elect a leader or commit entries"
      },
      {
        "id": "b",
        "text": "By disabling the network card on minority nodes"
      },
      {
        "id": "c",
        "text": "By routing all traffic through GPS satellite clocks"
      },
      {
        "id": "d",
        "text": "By requiring all nodes to reboot when a partition occurs"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Pigeonhole principle: in a 5-node cluster, a majority is 3. If partitioned into 2 and 3 nodes, only the 3-node partition has enough votes to reach quorum (3 votes). The 2-node partition can gather at most 2 votes, failing quorum. Thus, at most one leader can exist cluster-wide.",
    "conceptTag": "raft-split-brain-prevention"
  },
  {
    "id": "q-conc-raft-12",
    "difficulty": "easy",
    "question": "What is the purpose of 'Terms' in the Raft consensus algorithm?",
    "options": [
      {
        "id": "a",
        "text": "To define the expiration date of SSL certificates on node sockets"
      },
      {
        "id": "b",
        "text": "To track the duration of client HTTP sessions"
      },
      {
        "id": "c",
        "text": "To act as a logical clock (Lamport timestamp) identifying distinct eras of leadership, allowing nodes to detect obsolete leaders and stale RPCs"
      },
      {
        "id": "d",
        "text": "To schedule garbage collection cycles across cluster memory"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Terms in Raft are arbitrary monotonically increasing integers that act as logical clocks. Each election starts a new term. If a candidate wins, it serves as leader for that term. Terms allow nodes to quickly discard stale information: any RPC with a term lower than the receiver's current term is rejected.",
    "conceptTag": "raft-terms"
  },
  {
    "id": "q-conc-raft-13",
    "difficulty": "easy",
    "question": "What MUST a Raft Leader or Candidate do immediately if it discovers that another node has a higher Term than its own (`term > currentTerm`)?",
    "options": [
      {
        "id": "a",
        "text": "Immediately update its `currentTerm` to the higher term and transition to the Follower state"
      },
      {
        "id": "b",
        "text": "Ignore the higher term and continue operating as leader"
      },
      {
        "id": "c",
        "text": "Send a kill signal to the node with the higher term"
      },
      {
        "id": "d",
        "text": "Increment its own term by 2 and demand another election"
      }
    ],
    "correctOptionId": "a",
    "explanation": "In Raft, if a leader or candidate receives any message (RPC request or response) containing a term $T > \\text{currentTerm}$, it immediately updates its own term to $T$ and reverts to the Follower state. This ensures stale leaders gracefully yield to newer legitimate leaders.",
    "conceptTag": "raft-term-discovery"
  },
  {
    "id": "q-conc-raft-14",
    "difficulty": "easy",
    "question": "What three fundamental fields are stored in every Raft Log Entry?",
    "options": [
      {
        "id": "a",
        "text": "IP address, MAC address, and Port number"
      },
      {
        "id": "b",
        "text": "SHA-256 hash, RSA public key, and AES initialization vector"
      },
      {
        "id": "c",
        "text": "Log Index (integer position in log), Term number (when entry was received), and the State Machine Command"
      },
      {
        "id": "d",
        "text": "CPU temperature, RAM usage, and Disk I/O count"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Each entry in a Raft log contains: 1) an integer Log Index indicating its position in the sequential log, 2) the Term number when the entry was created by the leader, and 3) the command/state transition to be applied to the deterministic state machine.",
    "conceptTag": "raft-log-entry-structure"
  },
  {
    "id": "q-conc-raft-15",
    "difficulty": "easy",
    "question": "When is a log entry officially considered 'Committed' in Raft?",
    "options": [
      {
        "id": "a",
        "text": "The instant the client transmits the request to the network interface"
      },
      {
        "id": "b",
        "text": "When the Leader that created the entry in its current term has replicated it onto a strict majority (quorum) of the cluster nodes"
      },
      {
        "id": "c",
        "text": "When all nodes in the cluster have acknowledged receipt of the entry"
      },
      {
        "id": "d",
        "text": "When the entry is written to a centralized cloud bucket"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A log entry created by the leader in its current term is committed once it has been replicated to a majority of servers. Once committed, Raft guarantees that the entry is durable, will never be overwritten, and will eventually be executed by all available state machines.",
    "conceptTag": "raft-log-commit-rule"
  },
  {
    "id": "q-conc-raft-16",
    "difficulty": "easy",
    "question": "In what order must log entries be applied to the local state machine once committed?",
    "options": [
      {
        "id": "a",
        "text": "In reverse order (LIFO) to ensure the newest data is processed first"
      },
      {
        "id": "b",
        "text": "Grouped by the length of the command payload"
      },
      {
        "id": "c",
        "text": "In random order depending on which CPU core is idle"
      },
      {
        "id": "d",
        "text": "In strict sequential order by Log Index (FIFO) from lowest index to highest index"
      }
    ],
    "correctOptionId": "d",
    "explanation": "State machine replication guarantees consistency only if deterministic state machines execute commands in the identical sequence. All nodes apply committed log entries in strictly increasing order of their log index.",
    "conceptTag": "raft-state-machine-application"
  },
  {
    "id": "q-conc-raft-17",
    "difficulty": "easy",
    "question": "Consider a 5-node Raft cluster {N1, N2, N3, N4, N5} where N1 is leader. A network partition isolates {N1, N2} from {N3, N4, N5}. What happens to write operations submitted to N1 in the minority partition?",
    "options": [
      {
        "id": "a",
        "text": "N1 commits the writes locally and responds with HTTP 200 OK"
      },
      {
        "id": "b",
        "text": "N1 crashes immediately with a kernel panic"
      },
      {
        "id": "c",
        "text": "N1 appends writes to its local log and attempts to replicate to N2, but cannot reach a majority quorum (needs 3 nodes); the writes remain uncommitted and N1 cannot respond with success to clients"
      },
      {
        "id": "d",
        "text": "N1 automatically connects to the internet to find substitute nodes"
      }
    ],
    "correctOptionId": "c",
    "explanation": "In the {N1, N2} partition, N1 can replicate only to N2 (2 nodes total). Since quorum requires 3 nodes, N1 can never reach a majority. The entries remain uncommitted. Meanwhile, {N3, N4, N5} will elect a new leader and continue committing writes safely.",
    "conceptTag": "raft-minority-partition-behavior"
  },
  {
    "id": "q-conc-raft-18",
    "difficulty": "medium",
    "question": "Why does Raft use Randomized Election Timers (e.g. randomly chosen between 150ms and 300ms) for followers?",
    "options": [
      {
        "id": "a",
        "text": "To prevent cryptographic timing attacks from external hackers"
      },
      {
        "id": "b",
        "text": "Because Linux system clocks cannot generate deterministic intervals"
      },
      {
        "id": "c",
        "text": "To balance battery consumption across mobile nodes"
      },
      {
        "id": "d",
        "text": "To prevent 'Split Votes' where multiple followers time out at the exact same instant, vote for themselves, split the remaining votes, and fail to reach a majority quorum"
      }
    ],
    "correctOptionId": "d",
    "explanation": "If all nodes used the same fixed election timeout, all followers would time out simultaneously when a leader dies. Multiple nodes would become Candidates at once and split the votes evenly, resulting in no node reaching a majority (a split vote). Randomizing timeouts ensures one follower times out first, requests votes, and wins before others time out.",
    "conceptTag": "raft-randomized-election-timers"
  },
  {
    "id": "q-conc-raft-19",
    "difficulty": "medium",
    "question": "What happens in Raft when a Split Vote occurs and no candidate wins a majority during an election?",
    "options": [
      {
        "id": "a",
        "text": "Each candidate's election timer times out; each candidate increments its term, chooses a new randomized election timeout, and initiates a fresh election round"
      },
      {
        "id": "b",
        "text": "The cluster permanently shuts down and requires manual intervention"
      },
      {
        "id": "c",
        "text": "The candidate with the lowest IP address is declared the winner"
      },
      {
        "id": "d",
        "text": "The nodes revert all log entries to the genesis state"
      }
    ],
    "correctOptionId": "a",
    "explanation": "When votes are split, no candidate receives a majority. Eventually, each candidate's randomized election timer expires. When a candidate times out with no leader elected, it starts another election: it increments its term, resets its randomized timer, and broadcasts `RequestVote` RPCs again.",
    "conceptTag": "raft-split-vote-recovery"
  },
  {
    "id": "q-conc-raft-20",
    "difficulty": "medium",
    "question": "In the `RequestVote` RPC, what exact criteria must a Follower verify before granting its vote to a Candidate?",
    "options": [
      {
        "id": "a",
        "text": "The candidate must have the lowest CPU load"
      },
      {
        "id": "b",
        "text": "The candidate's term $\\ge$ follower's term, follower has not voted for another candidate in this term (`votedFor == null` or `votedFor == candidateId`), AND the candidate's log is at least as up-to-date as the follower's own log"
      },
      {
        "id": "c",
        "text": "The candidate's IP address must be in the follower's DNS whitelist"
      },
      {
        "id": "d",
        "text": "The candidate must have zero uncommitted log entries"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A follower grants its vote only if: 1) the candidate's term is $\\ge$ current term, 2) the follower hasn't already voted for someone else in this term, and 3) the candidate's log is at least as up-to-date as the receiver's log (comparing `lastLogTerm` and `lastLogIndex`).",
    "conceptTag": "raft-request-vote-rules"
  },
  {
    "id": "q-conc-raft-21",
    "difficulty": "medium",
    "question": "In Raft, how is one candidate's log formally determined to be 'More Up-To-Date' than another node's log?",
    "options": [
      {
        "id": "a",
        "text": "By comparing the total size of log files on disk in Megabytes"
      },
      {
        "id": "b",
        "text": "First compare the term of the last entry in each log: the log with the higher last term is more up-to-date. If last terms are equal, the log with the higher last index (longer log) is more up-to-date"
      },
      {
        "id": "c",
        "text": "By calculating the SHA-256 checksum of all log entries"
      },
      {
        "id": "d",
        "text": "The log with fewer committed entries is considered more up-to-date"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Raft defines 'up-to-date' by: 1) If the logs have last entries with different terms, then the log with the later term is more up-to-date. 2) If the logs end with the same term, whichever log is longer (higher `lastLogIndex`) is more up-to-date.",
    "conceptTag": "raft-log-up-to-date-comparison"
  },
  {
    "id": "q-conc-raft-22",
    "difficulty": "medium",
    "question": "What is the 'Log Matching Property' guaranteed by the Raft protocol?",
    "options": [
      {
        "id": "a",
        "text": "If two logs contain an entry with the same index and term, then they store the same command AND their logs are identical in all entries from index 1 up through that index"
      },
      {
        "id": "b",
        "text": "All nodes in the cluster have logs of identical byte size at all times"
      },
      {
        "id": "c",
        "text": "Logs can only store JSON-encoded strings"
      },
      {
        "id": "d",
        "text": "Followers can modify historical log entries if approved by the client"
      }
    ],
    "correctOptionId": "a",
    "explanation": "The Log Matching Property states: 1) If two entries in different logs have the same index and term, they store the same command. 2) If two entries in different logs have the same index and term, then their logs are identical in all preceding entries. This is enforced inductively by the consistency check in `AppendEntries`.",
    "conceptTag": "raft-log-matching-property"
  },
  {
    "id": "q-conc-raft-23",
    "difficulty": "medium",
    "question": "How does the Leader enforce the Log Matching Property when sending an `AppendEntries` RPC to a Follower?",
    "options": [
      {
        "id": "a",
        "text": "By attaching the entire log file from index 1 on every single RPC"
      },
      {
        "id": "b",
        "text": "By executing a distributed two-phase commit on every network packet"
      },
      {
        "id": "c",
        "text": "By querying the follower's database via SQL"
      },
      {
        "id": "d",
        "text": "By including `prevLogIndex` and `prevLogTerm` immediately preceding the new entries; the follower rejects the RPC if its log does not contain a matching entry at `prevLogIndex` with `prevLogTerm`"
      }
    ],
    "correctOptionId": "d",
    "explanation": "In `AppendEntries`, the leader includes `prevLogIndex` and `prevLogTerm`. When the follower inspects this, if it does not have an entry at `prevLogIndex` matching `prevLogTerm`, it refuses the new entries. When `AppendEntries` returns success, the leader knows the follower's log is identical to its own up to that point.",
    "conceptTag": "raft-append-entries-consistency-check"
  },
  {
    "id": "q-conc-raft-24",
    "difficulty": "medium",
    "question": "When a Follower's log is inconsistent with the Leader (due to crashes or network partitions), how does the Leader bring the Follower into sync?",
    "options": [
      {
        "id": "a",
        "text": "The follower formats its hard drive and reboots"
      },
      {
        "id": "b",
        "text": "The leader abdicates and becomes a follower of that node"
      },
      {
        "id": "c",
        "text": "The leader maintains a `nextIndex` for each follower; upon rejected `AppendEntries`, the leader decrements `nextIndex` and retries until finding where the logs agree, then overwrites all conflicting follower entries with the leader's entries"
      },
      {
        "id": "d",
        "text": "The leader asks the client to re-submit all historical transactions"
      }
    ],
    "correctOptionId": "c",
    "explanation": "The leader tracks `nextIndex[i]` for each follower. If an `AppendEntries` consistency check fails, the leader decrements `nextIndex` for that follower and retries. Once a match is found, the follower's conflicting entries are deleted and replaced with the leader's log entries.",
    "conceptTag": "raft-follower-reconciliation"
  },
  {
    "id": "q-conc-raft-25",
    "difficulty": "medium",
    "question": "Why does Raft FORBID a Leader from committing a log entry from a PREVIOUS term simply by counting replicas (the scenario illustrated in Figure 8 of the Raft paper)?",
    "options": [
      {
        "id": "a",
        "text": "Because entries from previous terms are encrypted with expired keys"
      },
      {
        "id": "b",
        "text": "Because Raft limits term numbers to single digits"
      },
      {
        "id": "c",
        "text": "Because disk writes are not permitted for historical terms"
      },
      {
        "id": "d",
        "text": "Because a previously elected leader could have replicated an entry to a majority, but an alternate candidate with a higher term could still be elected and overwrite those entries if the current leader crashes before committing an entry from its own term"
      }
    ],
    "correctOptionId": "d",
    "explanation": "As proven in Raft paper Section 5.4.2 (Figure 8), an entry from an older term can be replicated to a majority of servers, yet still be vulnerable to being overwritten by a future leader. Raft prevents this safety violation by mandating that a leader only commits entries by replicating an entry from its CURRENT term to a majority.",
    "conceptTag": "raft-figure-8-commit-rule"
  },
  {
    "id": "q-conc-raft-26",
    "difficulty": "medium",
    "question": "What critical danger arises if a cluster administrator attempts to change cluster membership (e.g. from 3 nodes to 5 nodes) in a single direct step without consensus?",
    "options": [
      {
        "id": "a",
        "text": "The nodes will experience thermal throttling"
      },
      {
        "id": "b",
        "text": "During the transition period where some nodes have switched to the new configuration and others still operate on the old configuration, two separate majorities can form, electing two different leaders simultaneously and causing split-brain"
      },
      {
        "id": "c",
        "text": "Log files will exceed 2GB memory limits"
      },
      {
        "id": "d",
        "text": "TCP port numbers will conflict across nodes"
      }
    ],
    "correctOptionId": "b",
    "explanation": "If configuration changes happen directly in one step, it is impossible for all servers to switch at the exact same instant. During the transition, Server 1 and 2 (using $C_{old}$) could form a majority of 3, while Server 3, 4, and 5 (using $C_{new}$) could form a majority of 5. Both elect separate leaders, causing split-brain.",
    "conceptTag": "raft-membership-change-hazards"
  },
  {
    "id": "q-conc-raft-27",
    "difficulty": "medium",
    "question": "How does Raft's 'Joint Consensus' ($C_{old,new}$) mechanism safely execute dynamic cluster membership changes?",
    "options": [
      {
        "id": "a",
        "text": "By entering a two-phase transitional configuration $C_{old,new}$ where any election or log commit requires separate majorities from BOTH $C_{old}$ AND $C_{new}$; once $C_{old,new}$ is committed, the leader commits the final $C_{new}$ configuration"
      },
      {
        "id": "b",
        "text": "By pausing all cluster traffic for 60 seconds"
      },
      {
        "id": "c",
        "text": "By electing an external arbitrator node on AWS"
      },
      {
        "id": "d",
        "text": "By restarting all nodes in alphabetical order"
      }
    ],
    "correctOptionId": "a",
    "explanation": "In Joint Consensus, the leader logs and commits a transitional configuration $C_{old,new}$. During this phase, any decision (election or log commit) requires a majority of $C_{old}$ AND a majority of $C_{new}$ independently. This guarantees no separate majorities can form. Once $C_{old,new}$ is committed, the leader logs $C_{new}$, which completes the migration.",
    "conceptTag": "raft-joint-consensus"
  },
  {
    "id": "q-conc-raft-28",
    "difficulty": "medium",
    "question": "What is the simpler alternative to Joint Consensus for cluster membership changes described in Diego Ongaro's doctoral dissertation?",
    "options": [
      {
        "id": "a",
        "text": "Replacing Raft with Paxos during cluster expansions"
      },
      {
        "id": "b",
        "text": "Using round-robin DNS to route requests to new servers"
      },
      {
        "id": "c",
        "text": "Single-server membership changes: adding or removing exactly one server at a time, where any majority of $N$ servers and any majority of $N+1$ servers are guaranteed to overlap"
      },
      {
        "id": "d",
        "text": "Hardcoding server IP addresses into the Linux kernel"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Single-server changes restrict reconfiguration to adding or removing at most one server at a time. Because the overlapping majorities property holds when transitioning between $N$ and $N+1$ (or $N-1$) nodes, no two independent majorities can possibly form, eliminating the complexity of joint consensus.",
    "conceptTag": "raft-single-server-membership"
  },
  {
    "id": "q-conc-raft-29",
    "difficulty": "medium",
    "question": "In Martin Kleppmann's famous analysis of distributed locking and split-brain, why must distributed systems use 'Fencing Tokens' when writing to shared storage?",
    "codeSnippet": "// 1. Client 1 acquires distributed lock from ZooKeeper/etcd\n// 2. Client 1 enters an unexpected long GC pause (Stop-The-World)\n// 3. Lock expires; Client 2 acquires lock and writes to storage\n// 4. Client 1 wakes up and executes its delayed write!",
    "options": [
      {
        "id": "a",
        "text": "Because a client holding a distributed lock can pause at any time (GC pause, network lag); each lock grant must return a monotonically increasing token (e.g. 33, 34), and the storage server must reject any write with a token lower than the latest seen token"
      },
      {
        "id": "b",
        "text": "To encrypt data written to storage using AES-GCM"
      },
      {
        "id": "c",
        "text": "To notify the client when disk usage reaches 90%"
      },
      {
        "id": "d",
        "text": "To synchronize system clocks across all cluster nodes using PTP"
      }
    ],
    "correctOptionId": "a",
    "explanation": "A client cannot know if its lock has expired while it was paused (e.g. during a 10-second GC stop-the-world pause). Without fencing tokens, Client 1 wakes up and writes stale data over Client 2's new write. A fencing token (monotonically increasing counter checked by the storage service) causes storage to reject Client 1's write (e.g. rejecting token 33 because token 34 was already committed).",
    "conceptTag": "distributed-fencing-tokens"
  },
  {
    "id": "q-conc-raft-30",
    "difficulty": "medium",
    "question": "How do Apache Kafka and ZooKeeper implement fencing tokens to prevent zombie / partitioned brokers and controllers from executing stale mutations?",
    "options": [
      {
        "id": "a",
        "text": "By checking IP addresses on every packet"
      },
      {
        "id": "b",
        "text": "By restarting Kafka brokers every hour"
      },
      {
        "id": "c",
        "text": "By utilizing 'Epochs' (such as Kafka Controller Epoch or ZooKeeper `zxid` epoch); every time a new controller/leader is elected, the epoch increments, and brokers/storage reject any command containing a stale epoch"
      },
      {
        "id": "d",
        "text": "By requiring all disk operations to execute on local NVMe drives"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Kafka uses `Controller Epoch` and ZooKeeper uses the 32-bit epoch portion of the 64-bit `zxid`. When a new leader takes over, the epoch increments. All RPCs include the current epoch. If a zombie leader in an isolated partition attempts to issue metadata updates with an old epoch, brokers reject the requests.",
    "conceptTag": "distributed-controller-epoch-fencing"
  },
  {
    "id": "q-conc-raft-31",
    "difficulty": "medium",
    "question": "A client sends a write request to a Raft leader. The leader appends the entry to its local log and sends `AppendEntries` to 4 followers in a 5-node cluster. Before any follower responds, the leader crashes. What happens to the client's write?",
    "options": [
      {
        "id": "a",
        "text": "The write was committed because the leader logged it locally"
      },
      {
        "id": "b",
        "text": "The write was uncommitted; the newly elected leader might not have the entry and will overwrite it, so the client receives a timeout/error and must retry"
      },
      {
        "id": "c",
        "text": "The cluster deadlocks because the entry was lost"
      },
      {
        "id": "d",
        "text": "The write is preserved in the operating system swap space"
      }
    ],
    "correctOptionId": "b",
    "explanation": "An entry is only committed once replicated to a majority. Because zero followers acknowledged the write before the leader crashed, the entry was uncommitted. The next elected leader will not have this entry in its log and will overwrite that index. The client receives no acknowledgment and must retry.",
    "conceptTag": "raft-uncommitted-write-crash"
  },
  {
    "id": "q-conc-raft-32",
    "difficulty": "medium",
    "question": "How do production Raft implementations (like etcd) ensure Idempotency for client requests when a leader crashes after committing a write but before acknowledging the client?",
    "options": [
      {
        "id": "a",
        "text": "By rejecting all retried requests with HTTP 400 Bad Request"
      },
      {
        "id": "b",
        "text": "By relying on the client's TCP retransmission layer"
      },
      {
        "id": "c",
        "text": "By rolling back all database writes every 10 seconds"
      },
      {
        "id": "d",
        "text": "Clients assign each request a unique Client ID and monotonically increasing Sequence Number; the state machine tracks the latest executed sequence number per client and discards duplicate requests without re-executing state mutations"
      }
    ],
    "correctOptionId": "d",
    "explanation": "If a leader commits a write and crashes before sending a response, the client will retry the write on the new leader. To achieve linearizable, exactly-once execution, the state machine records each client's ID and highest sequence number processed. When a duplicate sequence number arrives, the cached response is returned without re-executing the command.",
    "conceptTag": "raft-idempotent-client-sessions"
  },
  {
    "id": "q-conc-raft-33",
    "difficulty": "medium",
    "question": "Why is serving Read (GET) requests directly from a Raft Leader's local memory without consensus communication vulnerable to returning stale data (violating linearizability)?",
    "options": [
      {
        "id": "a",
        "text": "Because RAM memory degrades over time"
      },
      {
        "id": "b",
        "text": "Because Raft does not support read operations"
      },
      {
        "id": "c",
        "text": "The leader may have been partitioned off from the cluster while the remaining nodes elected a newer leader that already committed subsequent writes; the partitioned former leader would serve obsolete data to clients"
      },
      {
        "id": "d",
        "text": "Because followers encrypt all read operations"
      }
    ],
    "correctOptionId": "c",
    "explanation": "If a leader serves reads locally without checking with the cluster, it might not know that it has been deposed by a network partition. A new leader could have been elected in the majority partition and committed writes. The old leader, unaware of its isolation, would serve stale reads to clients, violating linearizability.",
    "conceptTag": "raft-stale-read-hazard"
  },
  {
    "id": "q-conc-raft-34",
    "difficulty": "medium",
    "question": "According to the Raft specification, which state variables MUST be persisted to non-volatile disk storage (WAL) before a node responds to any RPC?",
    "options": [
      {
        "id": "a",
        "text": "`commitIndex`, `lastApplied`, and client connection sockets"
      },
      {
        "id": "b",
        "text": "DNS cache and network gateway routing tables"
      },
      {
        "id": "c",
        "text": "CPU register states and thread call stacks"
      },
      {
        "id": "d",
        "text": "`currentTerm`, `votedFor`, and `log[]` entries"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Raft nodes must persist `currentTerm`, `votedFor`, and all `log[]` entries to stable disk storage before responding to RPCs. If a node rebooted and forgot its `currentTerm` or `votedFor`, it could vote for a different candidate in the same term, violating election safety.",
    "conceptTag": "raft-persistent-state"
  },
  {
    "id": "q-conc-raft-35",
    "difficulty": "hard",
    "question": "What is the 'Disruptive Server Problem' in Raft, and why does a partitioned node destabilize a healthy cluster upon network reconnection?",
    "options": [
      {
        "id": "a",
        "text": "A partitioned follower receives no heartbeats, repeatedly times out, and increments its term ($T+1, T+2, \\dots$). When the partition heals, it reconnects with a much higher term; upon receiving its RPC, the legitimate leader is forced to immediately step down, causing unnecessary cluster downtime"
      },
      {
        "id": "b",
        "text": "The reconnected node floods the network with broadcast ARP requests"
      },
      {
        "id": "c",
        "text": "The reconnected node corrupts disk files using stale CRC32 checks"
      },
      {
        "id": "d",
        "text": "The leader automatically deletes all log entries on reconnected nodes"
      }
    ],
    "correctOptionId": "a",
    "explanation": "When a node is partitioned from a healthy 5-node cluster, it cannot receive heartbeats. It repeatedly times out, increments its term, and starts new elections. By the time the partition heals, its term may be 50 terms ahead of the cluster. When it broadcasts a `RequestVote`, the active healthy leader sees `term > currentTerm`, abdicates, and triggers an unnecessary cluster-wide election disruption.",
    "conceptTag": "raft-disruptive-server-problem"
  },
  {
    "id": "q-conc-raft-36",
    "difficulty": "hard",
    "question": "How does the 'Pre-Vote Protocol' (implemented in etcd and HashiCorp Raft) prevent disruptive partitioned nodes from deposing legitimate leaders?",
    "options": [
      {
        "id": "a",
        "text": "By blocking incoming packets from nodes with high terms via iptables"
      },
      {
        "id": "b",
        "text": "Before incrementing its term or becoming a Candidate, a node enters a speculative 'Pre-Candidate' state and broadcasts `PreVote` RPCs; followers reject the pre-vote if their leader lease has not expired or the candidate's log is not up-to-date, preventing the partitioned node from ever incrementing its term"
      },
      {
        "id": "c",
        "text": "By requiring all votes to be countersigned by a hardware security module (HSM)"
      },
      {
        "id": "d",
        "text": "By running all election elections on an external ZooKeeper ensemble"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Under the Pre-Vote extension, when an election timeout fires, the node does not increment its term. Instead, it sends speculative `PreVote` RPCs. A follower only grants a pre-vote if: 1) the candidate's log is up-to-date, AND 2) the follower has not heard from a valid leader within the minimum election timeout. The isolated node receives zero pre-votes, so it never increments its term.",
    "conceptTag": "raft-pre-vote-protocol"
  },
  {
    "id": "q-conc-raft-37",
    "difficulty": "hard",
    "question": "What is the primary role of Raft Log Compaction (Snapshotting) in high-throughput systems like etcd or TiKV?",
    "options": [
      {
        "id": "a",
        "text": "To compress network messages using zstandard before sending across WANs"
      },
      {
        "id": "b",
        "text": "To write the current state machine state to disk, discard all committed log entries up to `lastIncludedIndex`, and free up disk space and memory while speeding up node reboot recovery"
      },
      {
        "id": "c",
        "text": "To delete all client records older than 30 days for GDPR compliance"
      },
      {
        "id": "d",
        "text": "To convert SQL databases into NoSQL document stores"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In production systems, logs cannot grow without bound. Log compaction takes a point-in-time snapshot of the state machine, records `lastIncludedIndex` and `lastIncludedTerm`, and discards all log entries up to that index. Rebuilding a node on reboot loads the snapshot and replays only the recent log suffix.",
    "conceptTag": "raft-log-compaction-snapshotting"
  },
  {
    "id": "q-conc-raft-38",
    "difficulty": "hard",
    "question": "When does a Raft Leader invoke the `InstallSnapshot` RPC instead of the standard `AppendEntries` RPC to synchronize a Follower?",
    "options": [
      {
        "id": "a",
        "text": "When a lagging or newly added follower's `nextIndex` points to a log entry that the leader has already discarded during log compaction/snapshotting"
      },
      {
        "id": "b",
        "text": "When the follower is running on an ARM CPU while the leader runs on x86"
      },
      {
        "id": "c",
        "text": "When the network connection drops below 10 Megabits per second"
      },
      {
        "id": "d",
        "text": "When the leader has committed more than 1,000,000 entries in a single hour"
      }
    ],
    "correctOptionId": "a",
    "explanation": "If a follower is offline for a long period, the leader may compact and discard the log entries that the follower needs to catch up. When the leader's `nextIndex` for that follower falls behind the leader's snapshot `lastIncludedIndex`, the leader cannot send `AppendEntries`. It streams the snapshot to the follower via `InstallSnapshot` RPCs.",
    "conceptTag": "raft-install-snapshot-rpc"
  },
  {
    "id": "q-conc-raft-39",
    "difficulty": "hard",
    "question": "How does the 'ReadIndex' optimization in Raft achieve linearizable read performance without incurring the overhead of writing read requests to the disk WAL?",
    "options": [
      {
        "id": "a",
        "text": "By reading directly from the Linux page cache without acquiring memory locks"
      },
      {
        "id": "b",
        "text": "By caching all database rows in Redis with a 5-second TTL"
      },
      {
        "id": "c",
        "text": "By delegating all reads to the oldest follower node in the cluster"
      },
      {
        "id": "d",
        "text": "The leader records its current `commitIndex` as `readIndex`, broadcasts a heartbeat round-trip to a majority to confirm it has not been deposed, waits until its state machine has applied entries up to `readIndex`, and then executes the read locally"
      }
    ],
    "correctOptionId": "d",
    "explanation": "In ReadIndex, the leader avoids writing a log entry to disk for GET requests. It records its `commitIndex` as `readIndex`. To ensure it wasn't deposed by a concurrent partition, it sends a round of heartbeats to confirm leadership with a majority. Once confirmed, it waits for `lastApplied >= readIndex` and reads from its local state machine.",
    "conceptTag": "raft-read-index-optimization"
  },
  {
    "id": "q-conc-raft-40",
    "difficulty": "hard",
    "question": "How does the 'LeaseRead' optimization improve on ReadIndex, and what critical infrastructure risk does it introduce?",
    "options": [
      {
        "id": "a",
        "text": "It eliminates disk I/O completely; however, it causes database memory leaks"
      },
      {
        "id": "b",
        "text": "It uses Bluetooth beacons to detect node proximity"
      },
      {
        "id": "c",
        "text": "The leader assumes leadership for a time-bounded lease after a heartbeat round-trip, serving reads locally without any network RPCs; however, it relies on bounded physical clock drift, meaning an NTP jump or hypervisor VM freeze can cause stale reads if the lease expires unnoticed"
      },
      {
        "id": "d",
        "text": "It requires all clients to be co-located in the same AWS Availability Zone"
      }
    ],
    "correctOptionId": "c",
    "explanation": "LeaseRead eliminates network round-trips for reads entirely: followers grant the leader a time-bounded lease during which they promise not to start elections. The leader serves reads locally during this lease. However, this relies on synchronized physical clocks. Clock skew, NTP steps, or hypervisor Stop-The-World pauses can cause the leader to serve stale reads after another leader has taken over.",
    "conceptTag": "raft-lease-read-optimization"
  },
  {
    "id": "q-conc-raft-41",
    "difficulty": "hard",
    "question": "What is the fundamental difference in fault tolerance between Crash Fault Tolerant (CFT) consensus like Raft/Paxos and Byzantine Fault Tolerant (PBFT) consensus?",
    "options": [
      {
        "id": "a",
        "text": "CFT consensus requires $3f+1$ nodes; PBFT requires $2f+1$ nodes"
      },
      {
        "id": "b",
        "text": "CFT consensus cannot tolerate network partitions"
      },
      {
        "id": "c",
        "text": "CFT only works on Linux; PBFT only works on Windows Server"
      },
      {
        "id": "d",
        "text": "CFT consensus (Raft/Paxos) requires $2f+1$ nodes to tolerate $f$ crash/fail-stop nodes, assuming nodes are honest and non-malicious; PBFT requires $3f+1$ nodes and cryptographic proofs to tolerate $f$ arbitrary or malicious (Byzantine) nodes sending conflicting messages"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Raft is a Crash Fault Tolerant (CFT) algorithm: it assumes nodes either function correctly or stop/crash, never sending corrupted, lying, or malicious messages. To tolerate $f$ crash faults, Raft needs $2f + 1$ nodes. In contrast, Byzantine Fault Tolerance (BFT) handles malicious or arbitrary faults, requiring at least $3f + 1$ nodes and cryptographic signatures.",
    "conceptTag": "cft-vs-bft-consensus"
  },
  {
    "id": "q-conc-raft-42",
    "difficulty": "hard",
    "question": "In distributed NewSQL databases like TiKV and CockroachDB, what is the 'Multi-Raft' architecture?",
    "options": [
      {
        "id": "a",
        "text": "A cluster running Raft, Paxos, and Zab simultaneously on the same data"
      },
      {
        "id": "b",
        "text": "Partitioning the entire database keyspace into thousands of contiguous ranges/regions, where each individual region runs its own independent Raft consensus group with its own leader, log, and quorum distributed across physical storage nodes"
      },
      {
        "id": "c",
        "text": "Running multiple operating systems inside Docker containers"
      },
      {
        "id": "d",
        "text": "Using Raft for network routing while using MySQL for data storage"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A single Raft group cannot scale beyond a single leader bottleneck. In Multi-Raft (pioneered by TiKV and CockroachDB), the keyspace is sharded into small contiguous byte ranges (e.g. 64MB\u2013512MB). Each range is an independent Raft consensus group. A single machine hosts thousands of Raft replicas, acting as leader for some ranges and follower for others.",
    "conceptTag": "multi-raft-architecture"
  },
  {
    "id": "q-conc-raft-43",
    "difficulty": "hard",
    "question": "In a Multi-Raft architecture (such as TiKV), how is a 'Region Split' executed when a single Raft region grows beyond its maximum size limit (e.g. 96MB)?",
    "options": [
      {
        "id": "a",
        "text": "The region leader proposes an administrative Split Command into its own Raft log; when committed by quorum, all replicas locally split the range into two distinct regions with independent Raft state machines and unique region IDs"
      },
      {
        "id": "b",
        "text": "The node shuts down and an administrator manually partitions the database tables"
      },
      {
        "id": "c",
        "text": "The database deletes the oldest half of the keys in that region"
      },
      {
        "id": "d",
        "text": "The operating system splits the underlying ext4 file system into two sub-volumes"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Region splitting is executed as a standard Raft log command. The leader of the oversized region writes a `Split` entry containing the split key. When this entry is replicated and committed across the region's Raft group, all replicas split the range into Region A and Region B atomically, creating a new Raft consensus group for the new region.",
    "conceptTag": "multi-raft-region-splitting"
  },
  {
    "id": "q-conc-raft-44",
    "difficulty": "hard",
    "question": "What is the structural difference between Multi-Paxos and Raft regarding out-of-order log agreement?",
    "options": [
      {
        "id": "a",
        "text": "Multi-Paxos forbids leaders from receiving client writes"
      },
      {
        "id": "b",
        "text": "Raft allows followers to commit entries without leader approval"
      },
      {
        "id": "c",
        "text": "Multi-Paxos allows log entries to be chosen and committed out of order, creating temporary 'holes' in the log that must be filled before state machine application; Raft strictly preserves prefix consistency and enforces sequential in-order agreement without log holes"
      },
      {
        "id": "d",
        "text": "Multi-Paxos requires dedicated hardware switches"
      }
    ],
    "correctOptionId": "c",
    "explanation": "In Multi-Paxos, consensus is reached independently on each log slot; if slot 5 fails while slot 6 succeeds, a hole exists in the log. Multi-Paxos must later fill hole 5 before applying slot 6 to the state machine. Raft deliberately forbids log holes: `AppendEntries` enforces strict in-order log prefix consistency, greatly simplifying log management.",
    "conceptTag": "multi-paxos-vs-raft-log-structure"
  },
  {
    "id": "q-conc-raft-45",
    "difficulty": "hard",
    "question": "How do 'Range Leases' in CockroachDB optimize Multi-Raft read and single-row transaction latency?",
    "options": [
      {
        "id": "a",
        "text": "A single replica is elected Leaseholder for a range; all linearizable reads and writes are routed to the Leaseholder, which executes reads locally without Raft round-trips and initiates Raft proposals for writes, separating leaseholder responsibilities from Raft leadership"
      },
      {
        "id": "b",
        "text": "By renting cloud storage space from AWS dynamically"
      },
      {
        "id": "c",
        "text": "By bypassing Raft completely for write operations"
      },
      {
        "id": "d",
        "text": "By executing transactions in the client's browser local storage"
      }
    ],
    "correctOptionId": "a",
    "explanation": "In CockroachDB, each range has a Leaseholder (often co-located with the Raft leader). The Leaseholder holds an active lease granted through Raft. Because only the leaseholder can serve writes and bypass Raft for reads, it can serve linearizable reads locally in microseconds without any network round-trips.",
    "conceptTag": "cockroachdb-range-leases"
  },
  {
    "id": "q-conc-raft-46",
    "difficulty": "hard",
    "question": "What is the purpose of the 'Learner' (or Non-Voting Replica) role in Raft implementations (e.g. etcd v3.4+)?",
    "options": [
      {
        "id": "a",
        "text": "To train machine learning models on transaction logs"
      },
      {
        "id": "b",
        "text": "To archive logs to optical tape storage"
      },
      {
        "id": "c",
        "text": "To allow a newly added node to replicate logs and catch up asynchronously without counting towards the cluster quorum, preventing cluster unavailability or election disruption while the node is syncing gigabytes of historical data"
      },
      {
        "id": "d",
        "text": "To inspect code for memory safety violations"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Adding a new voting node immediately increases quorum size (e.g. from 2-of-3 to 3-of-4). If the new node takes hours to download snapshots and logs, the cluster is vulnerable to node failures in the interim. A Learner receives logs but does not vote or count toward quorum until it is fully caught up, at which point it is promoted to a voter.",
    "conceptTag": "raft-learner-non-voting-member"
  },
  {
    "id": "q-conc-raft-47",
    "difficulty": "hard",
    "question": "How do high-performance Raft systems mitigate the 1ms+ disk fsync latency bottleneck on every committed log entry?",
    "options": [
      {
        "id": "a",
        "text": "By turning off disk persistence completely"
      },
      {
        "id": "b",
        "text": "By implementing Group Committing (batching multiple concurrent client write proposals into a single disk flush and network RPC) combined with direct I/O on fast NVMe SSD write-ahead logs"
      },
      {
        "id": "c",
        "text": "By writing logs to CPU L3 cache instead of disk"
      },
      {
        "id": "d",
        "text": "By delegating disk writes to background cron jobs running every 5 minutes"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Synchronously executing `fsync()` for every individual transaction caps throughput at ~1,000 writes/sec. Production consensus engines use Group Commits: while one batch of entries is being synced to disk, incoming write requests are queued. Once the current sync finishes, all queued requests are written in a single batched `fsync` and single `AppendEntries` RPC.",
    "conceptTag": "raft-group-commit-optimization"
  },
  {
    "id": "q-conc-raft-48",
    "difficulty": "hard",
    "question": "How can an Asymmetric Network Partition (where Node A can transmit to Node B, but Node B cannot transmit to Node A) disrupt a standard Raft cluster without Pre-Vote?",
    "options": [
      {
        "id": "a",
        "text": "It inverts the endianness of network packets"
      },
      {
        "id": "b",
        "text": "The operating system shuts down network switches automatically"
      },
      {
        "id": "c",
        "text": "It causes all nodes to run out of ephemeral ports"
      },
      {
        "id": "d",
        "text": "Node B cannot receive heartbeats from Leader A, times out, increments its term, and sends `RequestVote` to Node C and Leader A. Leader A receives the high-term message and steps down, but Node B cannot win an election because it cannot receive replies from A, causing continuous leader flap"
      }
    ],
    "correctOptionId": "d",
    "explanation": "In an asymmetric partition, if Leader A can send to B, but B's inbound path from A is broken, B believes the leader is dead. B increments its term and broadcasts `RequestVote`. Leader A receives B's request with a higher term and steps down. However, B cannot establish stable leadership because it cannot receive packets from A. This causes perpetual leader flap until Pre-Vote or leader lease is deployed.",
    "conceptTag": "raft-asymmetric-network-partition"
  },
  {
    "id": "q-conc-raft-49",
    "difficulty": "hard",
    "question": "How does the 'Leadership Transfer' (`TimeoutNow`) protocol in Raft achieve zero-downtime, instantaneous leader handoff for maintenance?",
    "options": [
      {
        "id": "a",
        "text": "The leader kills its own process using `kill -9`"
      },
      {
        "id": "b",
        "text": "The leader copies its CPU registers over SSH to the successor"
      },
      {
        "id": "c",
        "text": "The leader stops accepting client writes, replicates all remaining uncommitted log entries to the target successor, and sends a special `TimeoutNow` RPC that forces the target follower to immediately initiate an election without waiting for its election timer to expire"
      },
      {
        "id": "d",
        "text": "The leader instructs the DNS server to change TTL to 0"
      }
    ],
    "correctOptionId": "c",
    "explanation": "To transfer leadership gracefully (e.g. before server reboot), the leader stops accepting new writes and ensures the target node is 100% caught up. It then sends a `TimeoutNow` RPC to the target. The target treats this as an immediate election timeout, starts an election with its fully up-to-date log, and wins leadership within milliseconds without cluster downtime.",
    "conceptTag": "raft-leadership-transfer"
  },
  {
    "id": "q-conc-raft-50",
    "difficulty": "hard",
    "question": "In the formal verification of Raft using TLA+ (Temporal Logic of Actions), what are the core safety properties mathematically proven to never be violated?",
    "options": [
      {
        "id": "a",
        "text": "Maximum Network Bandwidth, Minimum CPU Load, and Zero Memory Consumption"
      },
      {
        "id": "b",
        "text": "Equal Thread Distribution, FIFO Queue Execution, and Zero Context Switching"
      },
      {
        "id": "c",
        "text": "Linear Time Complexity, Bounded Disk Space, and Constant Latency"
      },
      {
        "id": "d",
        "text": "Election Safety (at most one leader per term), Leader Append-Only (leaders never overwrite their own logs), Log Matching, Leader Completeness (committed entries present in all future leaders), and State Machine Safety"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Ongaro's TLA+ specification formally proves five core invariants: 1) Election Safety (at most one leader per term), 2) Leader Append-Only (leader only appends, never truncates or rewrites its own log), 3) Log Matching (matching index and term implies identical log prefix), 4) Leader Completeness (if an entry is committed in a term, it is present in logs of all leaders for higher terms), and 5) State Machine Safety (no two state machines apply different commands at the same index).",
    "conceptTag": "raft-tla-formal-verification"
  }
];
