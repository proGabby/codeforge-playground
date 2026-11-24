import type { QuizQuestion } from '../../../../src/types';

export const COFFMAN_DEADLOCKS_THREADPOOLS_50_QUESTIONS: QuizQuestion[] = [
  {
    "id": "q-conc-pool-1",
    "difficulty": "easy",
    "question": "Which of the following describes the fundamental rule established by Edward G. Coffman Jr. regarding the 4 Coffman conditions for system deadlocks?",
    "options": [
      {
        "id": "a",
        "text": "If any single one of the four conditions is present, a deadlock is guaranteed to occur immediately"
      },
      {
        "id": "b",
        "text": "All four conditions must hold simultaneously for a deadlock to occur; eliminating even one condition completely prevents deadlocks"
      },
      {
        "id": "c",
        "text": "The four conditions only apply to distributed systems running consensus algorithms"
      },
      {
        "id": "d",
        "text": "Deadlocks can occur even if all four conditions are proven to be false"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Edward G. Coffman Jr.'s 1971 paper proved that all four conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) are necessary and sufficient for a deadlock. If an engineer breaks or eliminates any single one of these conditions, deadlocks are mathematically impossible.",
    "conceptTag": "coffman-conditions-overview"
  },
  {
    "id": "q-conc-pool-2",
    "difficulty": "easy",
    "question": "What is the definition of the 'Mutual Exclusion' Coffman condition?",
    "options": [
      {
        "id": "a",
        "text": "Threads must execute on different physical CPU cores"
      },
      {
        "id": "b",
        "text": "A thread cannot request more than one resource per second"
      },
      {
        "id": "c",
        "text": "At least one resource must be held in a non-shareable mode; only one process or thread can use the resource at any given time"
      },
      {
        "id": "d",
        "text": "Operating system memory must be partitioned into mutually exclusive pages"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Mutual exclusion states that at least one resource involved in the deadlock must be non-shareable. If another thread requests that resource, the requesting thread must be delayed until the resource is released.",
    "conceptTag": "coffman-mutual-exclusion"
  },
  {
    "id": "q-conc-pool-3",
    "difficulty": "easy",
    "question": "What is the definition of the 'Hold and Wait' Coffman condition?",
    "options": [
      {
        "id": "a",
        "text": "A thread holds a database connection open while waiting for incoming HTTP requests"
      },
      {
        "id": "b",
        "text": "A thread pauses execution for a specified duration using `sleep()`"
      },
      {
        "id": "c",
        "text": "The operating system holds I/O interrupts until the CPU finishes computing"
      },
      {
        "id": "d",
        "text": "A process holds at least one resource while concurrently waiting to acquire additional resources that are currently held by other processes"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Hold and Wait requires that a process must be holding at least one resource and simultaneously waiting to acquire additional resources currently being held by other processes.",
    "conceptTag": "coffman-hold-and-wait"
  },
  {
    "id": "q-conc-pool-4",
    "difficulty": "easy",
    "question": "What is the definition of the 'No Preemption' Coffman condition?",
    "options": [
      {
        "id": "a",
        "text": "Resources cannot be forcibly confiscated from a process holding them; they can only be released voluntarily by the process after completing its task"
      },
      {
        "id": "b",
        "text": "The OS scheduler cannot preempt threads running in user mode"
      },
      {
        "id": "c",
        "text": "Garbage collection cannot be preempted by hardware interrupts"
      },
      {
        "id": "d",
        "text": "Database transactions cannot be rolled back once started"
      }
    ],
    "correctOptionId": "a",
    "explanation": "No Preemption dictates that resources cannot be preempted or forcibly taken away from a process. The resource can only be released voluntarily by the process holding it after that process has finished using it.",
    "conceptTag": "coffman-no-preemption"
  },
  {
    "id": "q-conc-pool-5",
    "difficulty": "easy",
    "question": "What is the definition of the 'Circular Wait' Coffman condition?",
    "options": [
      {
        "id": "a",
        "text": "A closed chain of processes exists such that each process holds a resource needed by the next process in the chain (e.g. $P_0$ waits for $P_1$, $P_1$ waits for $P_2$, ..., and $P_n$ waits for $P_0$)"
      },
      {
        "id": "b",
        "text": "A thread executes an infinite `for(;;)` loop waiting for a variable to become non-zero"
      },
      {
        "id": "c",
        "text": "A CPU ring buffer wraps around when full"
      },
      {
        "id": "d",
        "text": "Network packets loop indefinitely across misconfigured routers"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Circular wait occurs when a set of waiting processes $\\{P_0, P_1, \\dots, P_n\\}$ exists such that $P_0$ is waiting for a resource held by $P_1$, $P_1$ is waiting for $P_2$, and $P_n$ is waiting for $P_0$, forming a directed cycle in the resource allocation graph.",
    "conceptTag": "coffman-circular-wait"
  },
  {
    "id": "q-conc-pool-6",
    "difficulty": "easy",
    "question": "What is the operational symptom of a Deadlock in a backend production service?",
    "options": [
      {
        "id": "a",
        "text": "CPU spikes to 100% across all cores while thread states remain RUNNABLE"
      },
      {
        "id": "b",
        "text": "Disk space fills up due to rapid transaction log generation"
      },
      {
        "id": "c",
        "text": "The JVM or Go runtime immediately crashes with a segmentation fault"
      },
      {
        "id": "d",
        "text": "Involved threads transition to BLOCKED/WAITING states, CPU utilization drops toward 0% for those threads, and affected requests hang indefinitely until timed out by clients"
      }
    ],
    "correctOptionId": "d",
    "explanation": "In a deadlock, participating threads are blocked waiting for locks that will never be released. They consume 0% CPU because they are sleeping in operating system wait queues. External requests waiting on these threads hang indefinitely until edge reverse proxies time out.",
    "conceptTag": "deadlock-symptoms"
  },
  {
    "id": "q-conc-pool-7",
    "difficulty": "easy",
    "question": "How does a 'Livelock' differ fundamentally from a 'Deadlock'?",
    "options": [
      {
        "id": "a",
        "text": "In a livelock, threads consume 0% CPU; in a deadlock, threads consume 100% CPU"
      },
      {
        "id": "b",
        "text": "Livelocks only happen in single-threaded programs"
      },
      {
        "id": "c",
        "text": "In a livelock, threads are actively running, changing state, and consuming CPU cycles in response to each other, but making zero functional forward progress"
      },
      {
        "id": "d",
        "text": "A livelock terminates automatically after 60 seconds"
      }
    ],
    "correctOptionId": "c",
    "explanation": "A livelock is like two polite people in a hallway trying to step around each other, repeatedly moving to the same side in unison. The threads are actively running (RUNNABLE state, burning CPU cycles), changing their internal states in response to each other, but neither makes forward progress.",
    "conceptTag": "livelock-vs-deadlock"
  },
  {
    "id": "q-conc-pool-8",
    "difficulty": "easy",
    "question": "What is 'Thread Starvation' in concurrent systems?",
    "options": [
      {
        "id": "a",
        "text": "When a thread is terminated due to lack of virtual memory space"
      },
      {
        "id": "b",
        "text": "A situation where a runnable thread is perpetually denied CPU execution time or resource access because other greedy or higher-priority threads are continuously favored by the scheduler"
      },
      {
        "id": "c",
        "text": "When a thread runs out of network bandwidth"
      },
      {
        "id": "d",
        "text": "When an application fails to spawn threads due to license restrictions"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Starvation occurs when a thread is ready and waiting to execute, but is perpetually postponed or starved of CPU time or lock acquisition because the scheduler or synchronization primitive repeatedly favors other (often higher-priority) threads.",
    "conceptTag": "thread-starvation"
  },
  {
    "id": "q-conc-pool-9",
    "difficulty": "easy",
    "question": "Which of the following scenarios best illustrates a Livelock in distributed transaction coordination?",
    "options": [
      {
        "id": "a",
        "text": "Two transactions both hold a row lock and wait forever for each other's lock"
      },
      {
        "id": "b",
        "text": "A transaction hangs because the database server experienced a power outage"
      },
      {
        "id": "c",
        "text": "Two transactions detect a lock conflict, immediately abort, roll back, wait an identical fixed interval of 50ms, and retry at the exact same instant, repeatedly colliding and aborting indefinitely"
      },
      {
        "id": "d",
        "text": "A transaction finishes successfully and commits data to disk"
      }
    ],
    "correctOptionId": "c",
    "explanation": "This is textbook livelock: both transactions actively execute code, detect a collision, release their resources, and retry synchronously at identical intervals, perpetually repeating the collision cycle. Adding randomized exponential backoff (jitter) breaks livelocks.",
    "conceptTag": "livelock-scenario"
  },
  {
    "id": "q-conc-pool-10",
    "difficulty": "easy",
    "question": "In Java's `ThreadPoolExecutor` (or equivalent worker pool architectures), what is the purpose of `corePoolSize`?",
    "options": [
      {
        "id": "a",
        "text": "The baseline number of worker threads kept alive in the pool, ready to execute tasks immediately without startup latency, even when idle"
      },
      {
        "id": "b",
        "text": "The absolute maximum number of threads that can ever be spawned under any workload"
      },
      {
        "id": "c",
        "text": "The number of CPU cores available on the physical motherboard"
      },
      {
        "id": "d",
        "text": "The maximum capacity of the internal task queue"
      }
    ],
    "correctOptionId": "a",
    "explanation": "`corePoolSize` defines the minimum number of worker threads maintained in the pool. When new tasks are submitted and fewer than `corePoolSize` threads are running, a new thread is created immediately, even if existing threads are idle. Core threads remain alive unless `allowCoreThreadTimeOut(true)` is set.",
    "conceptTag": "thread-pool-core-size"
  },
  {
    "id": "q-conc-pool-11",
    "difficulty": "easy",
    "question": "When submitting tasks to a Java `ThreadPoolExecutor` configured with `corePoolSize = 5`, `maximumPoolSize = 20`, and a bounded `ArrayBlockingQueue(capacity = 50)`, when does the executor create the 6th thread?",
    "options": [
      {
        "id": "a",
        "text": "Immediately when the 6th task is submitted"
      },
      {
        "id": "b",
        "text": "Never; maximumPoolSize is ignored when a queue is provided"
      },
      {
        "id": "c",
        "text": "When CPU utilization on the host exceeds 80%"
      },
      {
        "id": "d",
        "text": "Only AFTER the internal work queue reaches its full capacity of 50 tasks (i.e. on the 56th task)"
      }
    ],
    "correctOptionId": "d",
    "explanation": "In `ThreadPoolExecutor`, when all core threads (5) are busy, incoming tasks are queued into the work queue. The pool will NOT create additional threads beyond `corePoolSize` until the work queue is completely full (50 tasks). Once the queue is saturated, new threads are spawned up to `maximumPoolSize` (20).",
    "conceptTag": "thread-pool-lifecycle"
  },
  {
    "id": "q-conc-pool-12",
    "difficulty": "easy",
    "question": "Why is initializing a thread pool with an unbounded work queue (e.g. `Executors.newFixedThreadPool(10)` with default `LinkedBlockingQueue`) dangerous in high-throughput production services?",
    "options": [
      {
        "id": "a",
        "text": "The pool will reject all tasks after 100 submissions"
      },
      {
        "id": "b",
        "text": "If task arrival rate exceeds worker processing rate, tasks accumulate in memory without bound, leading to `OutOfMemoryError` (OOM) and JVM crash"
      },
      {
        "id": "c",
        "text": "Unbounded queues cause CPU register corruption on Linux kernels"
      },
      {
        "id": "d",
        "text": "Threads will refuse to execute tasks if the queue length is an odd number"
      }
    ],
    "correctOptionId": "b",
    "explanation": "An unbounded queue has a capacity of `Integer.MAX_VALUE` (~2 billion). If tasks arrive faster than 10 workers can process them (e.g. downstream database slows down), the queue grows endlessly until heap memory is exhausted, crashing the entire service with `java.lang.OutOfMemoryError`.",
    "conceptTag": "thread-pool-unbounded-queue"
  },
  {
    "id": "q-conc-pool-13",
    "difficulty": "easy",
    "question": "What is the function of `keepAliveTime` in a thread pool executor?",
    "options": [
      {
        "id": "a",
        "text": "The maximum time a task is permitted to run before being cancelled by `thread.stop()`"
      },
      {
        "id": "b",
        "text": "The time an idle thread in excess of `corePoolSize` will wait for a new task before terminating"
      },
      {
        "id": "c",
        "text": "The TCP keep-alive probe frequency for network sockets"
      },
      {
        "id": "d",
        "text": "The time between garbage collection cycles"
      }
    ],
    "correctOptionId": "b",
    "explanation": "When the number of threads in the pool is greater than `corePoolSize`, `keepAliveTime` defines the maximum time that excess idle threads will wait for new tasks before terminating, allowing the pool to shrink back down to `corePoolSize` during low-traffic periods.",
    "conceptTag": "thread-pool-keep-alive"
  },
  {
    "id": "q-conc-pool-14",
    "difficulty": "easy",
    "question": "Why is `Executors.newCachedThreadPool()` considered an anti-pattern for handling public web traffic?",
    "options": [
      {
        "id": "a",
        "text": "It can only execute tasks written in C++"
      },
      {
        "id": "b",
        "text": "It disables thread synchronization"
      },
      {
        "id": "c",
        "text": "It caches task return values and returns stale responses to users"
      },
      {
        "id": "d",
        "text": "It has `maximumPoolSize = Integer.MAX_VALUE`; under a sudden traffic spike, it attempts to spawn thousands of OS threads, causing thread explosion, extreme context switching, and host crashes"
      }
    ],
    "correctOptionId": "d",
    "explanation": "`newCachedThreadPool()` creates threads on demand with no upper limit (`Integer.MAX_VALUE`) and a `SynchronousQueue`. Under a burst of incoming requests, it spawns thousands of OS threads. Each OS thread allocates stack memory (~1MB) and OS thread handles, quickly triggering `OutOfMemoryError: unable to create new native thread`.",
    "conceptTag": "thread-pool-cached-pool-dangers"
  },
  {
    "id": "q-conc-pool-15",
    "difficulty": "easy",
    "question": "What is a 'Thread Leak' in a thread pool, and how does it manifest?",
    "codeSnippet": "pool.submit(() -> {\n    // Network socket read without a read timeout:\n    InputStream in = socket.getInputStream();\n    in.read(); // Blocks indefinitely if remote peer hangs!\n});",
    "options": [
      {
        "id": "a",
        "text": "Worker threads perform blocking operations without timeouts or get stuck in infinite loops, remaining permanently occupied and never returning to the pool, eventually exhausting all available workers"
      },
      {
        "id": "b",
        "text": "When threads leak memory by modifying global variables"
      },
      {
        "id": "c",
        "text": "When threads write their stack traces to unencrypted log files"
      },
      {
        "id": "d",
        "text": "When a thread pool allocates threads across multiple processes"
      }
    ],
    "correctOptionId": "a",
    "explanation": "If tasks dispatched to a thread pool block indefinitely (e.g. socket read without SO_TIMEOUT, waiting on an unreleased lock, or hanging on third-party APIs), the worker thread is trapped forever. As more threads get stuck, the pool runs out of available workers, and subsequent tasks stall forever.",
    "conceptTag": "thread-pool-thread-leak"
  },
  {
    "id": "q-conc-pool-16",
    "difficulty": "easy",
    "question": "Why should production thread pools always be configured with a custom `ThreadFactory`?",
    "options": [
      {
        "id": "a",
        "text": "To bypass operating system kernel scheduling"
      },
      {
        "id": "b",
        "text": "Because Java requires a custom ThreadFactory to compile lambda expressions"
      },
      {
        "id": "c",
        "text": "To assign descriptive, identifiable thread names (e.g. `order-processor-worker-%d`), set daemon status, and attach uncaught exception handlers for observability and debugging in thread dumps"
      },
      {
        "id": "d",
        "text": "To force threads to run with root/administrator privileges"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Default thread factories generate nondescript names like `pool-1-thread-3`. In production, when diagnosing thread dumps or CPU profiling, having meaningful thread names (e.g., `payment-webhook-worker-4`) and custom uncaught exception handlers is essential for rapid incident mitigation.",
    "conceptTag": "thread-pool-custom-factory"
  },
  {
    "id": "q-conc-pool-17",
    "difficulty": "easy",
    "question": "What key operational guarantee does `Executors.newSingleThreadExecutor()` provide?",
    "options": [
      {
        "id": "a",
        "text": "Tasks execute in parallel on single-core CPUs"
      },
      {
        "id": "b",
        "text": "Tasks are guaranteed to execute strictly sequentially in order of submission, with no more than one task active at any time"
      },
      {
        "id": "c",
        "text": "If a task fails, the entire application process terminates"
      },
      {
        "id": "d",
        "text": "Tasks bypass the Java heap memory"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A single-threaded executor ensures that tasks are executed strictly sequentially in FIFO order, and no two tasks ever run concurrently. If the single worker thread terminates due to an uncaught exception, a new thread is created automatically to execute subsequent tasks.",
    "conceptTag": "thread-pool-single-thread"
  },
  {
    "id": "q-conc-pool-18",
    "difficulty": "medium",
    "question": "How does enforcing a Global Lock Order break the Circular Wait Coffman condition?",
    "codeSnippet": "// Resource IDs: Lock A has ID 10, Lock B has ID 20\n// Rule: Always acquire lower ID before higher ID\nfunc Transfer(a, b *Account) {\n    first, second := a, b\n    if first.ID > second.ID {\n        first, second = b, a\n    }\n    first.mu.Lock()\n    defer first.mu.Unlock()\n    second.mu.Lock()\n    defer second.mu.Unlock()\n}",
    "options": [
      {
        "id": "a",
        "text": "It converts exclusive locks into read-write locks"
      },
      {
        "id": "b",
        "text": "It forces the Go runtime to execute the function on a single OS thread"
      },
      {
        "id": "c",
        "text": "By establishing a strict total order over all locks, it is mathematically impossible for a cycle to form in the resource allocation graph"
      },
      {
        "id": "d",
        "text": "It automatically rolls back database transactions on collision"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Circular wait requires a directed cycle ($L_1 \\to L_2 \\to \\dots \\to L_1$). If every thread in the system must acquire locks in strictly increasing order of their unique identifier (or memory address), every edge in the wait-for graph goes from a lower index to a higher index, making a cycle mathematically impossible.",
    "conceptTag": "deadlock-breaking-circular-wait"
  },
  {
    "id": "q-conc-pool-19",
    "difficulty": "medium",
    "question": "Consider two concurrent threads executing bank transfers between accounts X and Y. Thread 1 runs `transfer(X, Y, $100)` and Thread 2 runs `transfer(Y, X, $50)`. How can a deadlock occur without lock ordering?",
    "codeSnippet": "void transfer(Account from, Account to, double amount) {\n    synchronized(from) {\n        synchronized(to) {\n            from.debit(amount);\n            to.credit(amount);\n        }\n    }\n}",
    "options": [
      {
        "id": "a",
        "text": "Account balances become negative due to integer underflow"
      },
      {
        "id": "b",
        "text": "Thread 2 overrides Thread 1's memory registers"
      },
      {
        "id": "c",
        "text": "The JVM detects duplicate accounts and throws a `DuplicateKeyException`"
      },
      {
        "id": "d",
        "text": "Thread 1 acquires lock on X and waits for Y; Thread 2 acquires lock on Y and waits for X; neither can proceed, causing a classic circular deadlock"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Thread 1 acquires the lock for `from` (X). At the same instant, Thread 2 acquires the lock for `from` (Y). Next, Thread 1 attempts to lock `to` (Y) and blocks; Thread 2 attempts to lock `to` (X) and blocks. Both threads hold a lock the other needs, satisfying all 4 Coffman conditions.",
    "conceptTag": "deadlock-bank-transfer-scenario"
  },
  {
    "id": "q-conc-pool-20",
    "difficulty": "medium",
    "question": "How can an engineering team break the 'Hold and Wait' Coffman condition in a distributed transaction or concurrent system?",
    "options": [
      {
        "id": "a",
        "text": "Requiring a process to request and acquire ALL required resources atomically at the very start of execution, or release all currently held resources before requesting new ones"
      },
      {
        "id": "b",
        "text": "Allowing threads to wait indefinitely on mutexes"
      },
      {
        "id": "c",
        "text": "Increasing thread priority whenever a lock is held"
      },
      {
        "id": "d",
        "text": "Using asynchronous callbacks instead of threads"
      }
    ],
    "correctOptionId": "a",
    "explanation": "To break 'Hold and Wait', a protocol can mandate that a thread must request all needed resources simultaneously in a single atomic request (all-or-nothing). Alternatively, if a thread holding resources needs additional resources that are unavailable, it must release all its current resources before retrying.",
    "conceptTag": "deadlock-breaking-hold-and-wait"
  },
  {
    "id": "q-conc-pool-21",
    "difficulty": "medium",
    "question": "How does using `tryLock()` with a timeout break the 'No Preemption' Coffman condition to prevent deadlocks?",
    "codeSnippet": "if (lockA.tryLock(100, TimeUnit.MILLISECONDS)) {\n    try {\n        if (lockB.tryLock(100, TimeUnit.MILLISECONDS)) {\n            try { doWork(); } finally { lockB.unlock(); }\n        } else {\n            // Failed to acquire lockB; backing off!\n        }\n    } finally {\n        lockA.unlock(); // Preemptively releases lockA!\n    }\n}",
    "options": [
      {
        "id": "a",
        "text": "If a thread holding Lock A cannot acquire Lock B within the timeout, it voluntarily yields and releases Lock A, effectively pre-empting its own resource hold and preventing permanent blockage"
      },
      {
        "id": "b",
        "text": "It forces the other thread holding Lock B to terminate"
      },
      {
        "id": "c",
        "text": "It disables thread scheduling for 100 milliseconds"
      },
      {
        "id": "d",
        "text": "It turns Lock A into a non-blocking spinlock"
      }
    ],
    "correctOptionId": "a",
    "explanation": "'No Preemption' means a thread never gives up a resource until finished. By using `tryLock()` with a timeout, if a subsequent resource is unavailable, the thread voluntarily releases its previously acquired locks (self-preemption) and backs off, allowing other threads to finish.",
    "conceptTag": "deadlock-breaking-no-preemption"
  },
  {
    "id": "q-conc-pool-22",
    "difficulty": "medium",
    "question": "What is 'Lock Hierarchy Enforcement' in large software architectures?",
    "options": [
      {
        "id": "a",
        "text": "Storing locks in a hierarchical file system like ext4"
      },
      {
        "id": "b",
        "text": "Running threads with different POSIX nice values"
      },
      {
        "id": "c",
        "text": "Encrypting lock pointers using hierarchical key management"
      },
      {
        "id": "d",
        "text": "Assigning locks to different tiers (e.g. Network Layer -> Business Logic -> Storage Engine) and strictly forbidding any code from acquiring a lower-tier lock before releasing an upper-tier lock (or vice-versa)"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Lock hierarchy defines strict directional rules across architectural subsystems (e.g. an order service lock can acquire an account lock, but an account service lock may never acquire an order service lock). By keeping the lock acquisition DAG strictly acyclic across services, system-wide deadlocks are avoided.",
    "conceptTag": "deadlock-lock-hierarchy"
  },
  {
    "id": "q-conc-pool-23",
    "difficulty": "medium",
    "question": "How do dynamic lock order checkers (such as Clang's ThreadSanitizer or dynamic lock graph instrumentation) detect potential deadlocks before they actually occur in production?",
    "options": [
      {
        "id": "a",
        "text": "They simulate CPU overheating to test failover"
      },
      {
        "id": "b",
        "text": "They inject random delays to force thread timeouts"
      },
      {
        "id": "c",
        "text": "They intercept all `lock()` acquisitions, construct a runtime Directed Acyclic Graph (DAG) of lock ordering observed across all threads, and flag an error immediately when a cycle is introduced in the lock graph, even if no deadlock occurred during that specific run"
      },
      {
        "id": "d",
        "text": "They convert all mutexes into read-write locks"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Dynamic lock order checkers maintain a global lock-order graph. If Thread 1 acquires Lock A then Lock B, an edge $A \\to B$ is added. If Thread 2 later acquires Lock B then Lock A, an edge $B \\to A$ forms a cycle. The analyzer detects this cycle immediately, alerting developers to the latent deadlock risk even if the two threads never executed concurrently in that run.",
    "conceptTag": "deadlock-dynamic-detection"
  },
  {
    "id": "q-conc-pool-24",
    "difficulty": "medium",
    "question": "In Java's `ThreadPoolExecutor`, what is the exact behavior of `ThreadPoolExecutor.AbortPolicy` when the work queue is full and all threads are busy?",
    "options": [
      {
        "id": "a",
        "text": "It silently drops the task without notification"
      },
      {
        "id": "b",
        "text": "It throws a `RejectedExecutionException` in the caller thread, allowing the application to handle rejection, log metrics, or return an HTTP 503/429 response"
      },
      {
        "id": "c",
        "text": "It shuts down the entire thread pool immediately"
      },
      {
        "id": "d",
        "text": "It forces the task to execute on the garbage collector thread"
      }
    ],
    "correctOptionId": "b",
    "explanation": "`AbortPolicy` is the default rejection handler in `ThreadPoolExecutor`. When the pool cannot accept a task, it throws a runtime `RejectedExecutionException`. This fails-fast, alerting the calling system that the pool is saturated.",
    "conceptTag": "thread-pool-abort-policy"
  },
  {
    "id": "q-conc-pool-25",
    "difficulty": "medium",
    "question": "Why is `ThreadPoolExecutor.CallerRunsPolicy` highly effective as a backpressure mechanism in HTTP ingestion servers?",
    "options": [
      {
        "id": "a",
        "text": "It compresses the HTTP payload to reduce memory consumption"
      },
      {
        "id": "b",
        "text": "It redirects client traffic to a standby server using DNS"
      },
      {
        "id": "c",
        "text": "Instead of dropping the task or throwing an error, the task is executed directly on the thread calling `execute()`, which blocks that thread from reading more requests from network sockets, naturally throttling the incoming request rate"
      },
      {
        "id": "d",
        "text": "It increases the thread pool core size by 10%"
      }
    ],
    "correctOptionId": "c",
    "explanation": "With `CallerRunsPolicy`, when the queue is full, the thread submitting the task (e.g. the network I/O accept loop or Tomcat request dispatcher thread) executes the task itself. While executing the task, it cannot accept or submit new incoming requests. This introduces direct backpressure, slowing the ingestion rate to match processing capacity.",
    "conceptTag": "thread-pool-caller-runs-policy"
  },
  {
    "id": "q-conc-pool-26",
    "difficulty": "medium",
    "question": "What is the difference between `ThreadPoolExecutor.DiscardPolicy` and `ThreadPoolExecutor.DiscardOldestPolicy`?",
    "options": [
      {
        "id": "a",
        "text": "`DiscardPolicy` silently drops the newly submitted task; `DiscardOldestPolicy` evicts the unhandled task at the head of the queue (the oldest task) and then retries submitting the new task"
      },
      {
        "id": "b",
        "text": "`DiscardPolicy` logs an error; `DiscardOldestPolicy` logs a warning"
      },
      {
        "id": "c",
        "text": "`DiscardPolicy` terminates the oldest worker thread; `DiscardOldestPolicy` terminates the youngest worker thread"
      },
      {
        "id": "d",
        "text": "They are completely identical"
      }
    ],
    "correctOptionId": "a",
    "explanation": "`DiscardPolicy` simply drops the incoming task without throwing an exception. `DiscardOldestPolicy` removes the task that has been waiting longest in the queue (the head of the work queue) to make room, and then resubmits the new task. This is useful for streaming metrics or real-time sensor updates where newer data is more valuable than stale data.",
    "conceptTag": "thread-pool-discard-policies"
  },
  {
    "id": "q-conc-pool-27",
    "difficulty": "medium",
    "question": "What is the industry standard heuristic formula for sizing a thread pool dedicated to purely CPU-bound tasks (e.g. cryptography, image compression)?",
    "options": [
      {
        "id": "a",
        "text": "$N_{threads} = N_{cpu} \\times 50$"
      },
      {
        "id": "b",
        "text": "$N_{threads} = 1$ regardless of the number of CPU cores"
      },
      {
        "id": "c",
        "text": "$N_{threads} = \\text{Total RAM in GB} \\times 2$"
      },
      {
        "id": "d",
        "text": "$N_{threads} = N_{cpu}$ or $N_{cpu} + 1$ (to allow an extra thread to keep the core utilized if a thread encounters an occasional page fault or OS pause)"
      }
    ],
    "correctOptionId": "d",
    "explanation": "For purely CPU-bound tasks, having more runnable threads than physical/logical CPU cores causes context switching overhead without increasing compute throughput. Sizing to $N_{cpu}$ (or $N_{cpu} + 1$, where the $+1$ absorbs rare page faults or OS preemptions) maximizes CPU cache residency and pipeline throughput.",
    "conceptTag": "thread-pool-cpu-bound-sizing"
  },
  {
    "id": "q-conc-pool-28",
    "difficulty": "medium",
    "question": "An engineering team has a microservice running on a 16-core CPU ($N_{cpu} = 16$). Profiling reveals that each request takes 100ms total, spending 80ms waiting on downstream database queries (Wait Time $W = 80\\text{ms}$) and 20ms on CPU compute (Compute Time $C = 20\\text{ms}$). Targeting 100% CPU utilization ($U_{cpu} = 1.0$), what is the optimal thread pool size according to Brian Goetz's formula $N_{threads} = N_{cpu} \\times U_{cpu} \\times (1 + \\frac{W}{C})$?",
    "options": [
      {
        "id": "a",
        "text": "16 threads"
      },
      {
        "id": "b",
        "text": "80 threads"
      },
      {
        "id": "c",
        "text": "256 threads"
      },
      {
        "id": "d",
        "text": "500 threads"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Using Goetz's thread pool sizing formula: $N_{threads} = N_{cpu} \\times U_{cpu} \\times (1 + W/C) = 16 \\times 1.0 \\times (1 + 80/20) = 16 \\times 1.0 \\times (1 + 4) = 16 \\times 5 = 80$ threads. Because each thread spends 80% of its time waiting on I/O, 5 threads are needed per CPU core to keep that core 100% utilized.",
    "conceptTag": "thread-pool-io-bound-sizing"
  },
  {
    "id": "q-conc-pool-29",
    "difficulty": "medium",
    "question": "How does Little's Law ($L = \\lambda \\cdot W$) apply to capacity planning and queue sizing in backend thread pools?",
    "options": [
      {
        "id": "a",
        "text": "It calculates the CPU clock frequency required to prevent packet loss"
      },
      {
        "id": "b",
        "text": "It proves that average concurrency in the system ($L$) equals the average arrival rate ($\\lambda$) multiplied by the average response time ($W$), allowing engineers to calculate required thread pool concurrency and queue depths"
      },
      {
        "id": "c",
        "text": "It bounds the maximum number of network sockets an OS kernel can open"
      },
      {
        "id": "d",
        "text": "It proves that memory consumption decreases exponentially over time"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Little's Law states that the average number of items in a stationary queueing system ($L$) is equal to the long-term average arrival rate ($\\lambda$) multiplied by the average time that an item spends in the system ($W$). If a service receives 1,000 requests/sec and each request takes 50ms (0.05s), average concurrent capacity must be $1000 \\times 0.05 = 50$ requests.",
    "conceptTag": "concurrency-littles-law"
  },
  {
    "id": "q-conc-pool-30",
    "difficulty": "medium",
    "question": "What is the internal data structure architecture of a Work-Stealing thread pool (such as Java's `ForkJoinPool` or the Go runtime scheduler)?",
    "options": [
      {
        "id": "a",
        "text": "A single centralized global array guarded by an OS spinlock"
      },
      {
        "id": "b",
        "text": "A circular ring buffer shared across all CPU cores without per-thread queues"
      },
      {
        "id": "c",
        "text": "A binary heap sorted by thread priority"
      },
      {
        "id": "d",
        "text": "Each worker thread maintains its own double-ended queue (deque); the worker pushes and pops tasks from the tail (bottom) of its local deque, while idle worker threads steal tasks from the head (top) of other workers' deques"
      }
    ],
    "correctOptionId": "d",
    "explanation": "In work-stealing pools, each worker thread has a private double-ended queue (deque). The worker pushes and pops subtasks from its own deque tail (LIFO order). When a worker runs out of work, it acts as a 'thief' and steals tasks from the head (FIFO order) of another worker's deque. This drastically reduces contention on shared locks.",
    "conceptTag": "thread-pool-work-stealing-deque"
  },
  {
    "id": "q-conc-pool-31",
    "difficulty": "medium",
    "question": "Why do work-stealing workers operate in LIFO order on their own local deque, while thieves steal in FIFO order from victim deques?",
    "options": [
      {
        "id": "a",
        "text": "LIFO execution by the owner maximizes CPU cache locality (most recently pushed subtask data is hot in L1/L2 cache); stealing FIFO from the head grabs the oldest, coarsest-grained chunk of work, maximizing execution time on the thief thread"
      },
      {
        "id": "b",
        "text": "Operating systems forbid LIFO operations on shared memory"
      },
      {
        "id": "c",
        "text": "FIFO execution is required by Java garbage collection algorithms"
      },
      {
        "id": "d",
        "text": "LIFO is slower than FIFO so it is reserved only for local threads"
      }
    ],
    "correctOptionId": "a",
    "explanation": "The owner works LIFO (bottom of deque) because the most recently generated subtask contains data still warm in the processor's L1/L2 cache. A thief steals FIFO (top of deque) because top tasks represent earlier, larger branches of the divide-and-conquer tree, amortizing the synchronization cost of stealing across a large body of work.",
    "conceptTag": "thread-pool-work-stealing-cache-locality"
  },
  {
    "id": "q-conc-pool-32",
    "difficulty": "medium",
    "question": "In Java's `ForkJoinPool`, what happens when a worker thread calls `task.join()` on a subtask that has not yet completed?",
    "options": [
      {
        "id": "a",
        "text": "The worker thread is parked and put to sleep by the OS kernel until the task completes"
      },
      {
        "id": "b",
        "text": "The JVM spawns a new operating system thread immediately"
      },
      {
        "id": "c",
        "text": "The worker thread does not block; instead, it proactively executes other pending tasks from its own deque or steals work, keeping the CPU core utilized while waiting for the subtask to finish"
      },
      {
        "id": "d",
        "text": "The application throws a `TaskTimeoutException`"
      }
    ],
    "correctOptionId": "c",
    "explanation": "In `ForkJoinPool`, calling `join()` does not block the underlying OS worker thread. Instead, the runtime engages in work-stealing / work-helping: the thread finds other tasks in its deque or steals tasks from other threads and executes them until the joined task finishes.",
    "conceptTag": "thread-pool-forkjoin-join-behavior"
  },
  {
    "id": "q-conc-pool-33",
    "difficulty": "medium",
    "question": "In the Go runtime scheduler, how does an idle logical processor (P) steal work from other processors?",
    "options": [
      {
        "id": "a",
        "text": "It takes all goroutines from the victim processor"
      },
      {
        "id": "b",
        "text": "It randomly picks another P and attempts to steal half of the runnable goroutines from that P's local run queue"
      },
      {
        "id": "c",
        "text": "It executes garbage collection sweeps until new work arrives"
      },
      {
        "id": "d",
        "text": "It sends an OS signal to interrupt the victim thread"
      }
    ],
    "correctOptionId": "b",
    "explanation": "When a Go processor P has no work in its local run queue, it inspects the global run queue, network poller, and then randomly selects another P to steal from. It steals half of the runnable goroutines from the victim P's local runqueue using atomic operations, balancing the cluster of Ps.",
    "conceptTag": "golang-scheduler-work-stealing"
  },
  {
    "id": "q-conc-pool-34",
    "difficulty": "medium",
    "question": "What is a 'Thread Pool Self-Deadlock' (or Thread Pool Starvation Deadlock)?",
    "codeSnippet": "// Pool with fixed size = 2\nExecutorService pool = Executors.newFixedThreadPool(2);\n\npool.submit(() -> {\n    Future<String> subTask = pool.submit(() -> \"child work\");\n    return subTask.get(); // Blocks waiting for child task!\n});\npool.submit(() -> {\n    Future<String> subTask = pool.submit(() -> \"child work\");\n    return subTask.get(); // Blocks waiting for child task!\n});",
    "options": [
      {
        "id": "a",
        "text": "When threads leak memory by allocating arrays larger than the heap"
      },
      {
        "id": "b",
        "text": "When the operating system kills the process for spawning too many threads"
      },
      {
        "id": "c",
        "text": "Parent tasks occupy all available worker threads in the pool while synchronously waiting (`future.get()`) on child tasks submitted to the same pool; child tasks remain trapped in the queue, causing a permanent deadlock"
      },
      {
        "id": "d",
        "text": "When the compiler optimizes away asynchronous task execution"
      }
    ],
    "correctOptionId": "c",
    "explanation": "This is a classic Thread Pool Deadlock. In a pool of size $N$, if $N$ parent tasks are executing and all block waiting for child tasks submitted to the exact same pool, no worker threads are available to execute the child tasks. The child tasks sit in the work queue forever while the parent tasks wait forever.",
    "conceptTag": "thread-pool-self-deadlock"
  },
  {
    "id": "q-conc-pool-35",
    "difficulty": "hard",
    "question": "In the famous 1997 Mars Pathfinder spacecraft anomaly, what caused the repeated real-time system resets?",
    "options": [
      {
        "id": "a",
        "text": "A cosmic ray flipped a bit in the flash memory registers"
      },
      {
        "id": "b",
        "text": "The thread pool ran out of heap space during image compression"
      },
      {
        "id": "c",
        "text": "A circular wait deadlock between the camera and the thruster controllers"
      },
      {
        "id": "d",
        "text": "Unbounded Priority Inversion: a low-priority meteorological task held an information bus mutex; a medium-priority communications task preempted it; this prevented the high-priority attitude control task from acquiring the mutex, causing the watchdog timer to trigger a reboot"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Mars Pathfinder suffered from unbounded priority inversion. A low-priority gathering task acquired the mutex for the 1553 bus. A medium-priority communications task preempted the low-priority task (since medium > low). Meanwhile, the high-priority attitude control task wanted the 1553 bus and blocked. The medium task ran for a long time, preventing the low task from releasing the lock. The watchdog timer expired and rebooted the spacecraft.",
    "conceptTag": "priority-inversion-mars-pathfinder"
  },
  {
    "id": "q-conc-pool-36",
    "difficulty": "hard",
    "question": "How does the Priority Inheritance Protocol (PIP) resolve Priority Inversion in real-time operating systems (RTOS)?",
    "options": [
      {
        "id": "a",
        "text": "When a high-priority task blocks waiting for a lock held by a low-priority task, the low-priority task temporarily 'inherits' the high-priority level, preventing medium-priority tasks from preempting it until the lock is released"
      },
      {
        "id": "b",
        "text": "It kills all medium-priority threads automatically"
      },
      {
        "id": "c",
        "text": "It converts all mutexes into non-blocking spinlocks"
      },
      {
        "id": "d",
        "text": "It turns off the real-time scheduler watchdog timer"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Under PIP, whenever a high-priority task blocks on a resource held by a lower-priority task, the lower-priority task is dynamically boosted to the priority of the waiting high-priority task. This prevents any intermediate medium-priority tasks from preempting it, allowing it to quickly finish its critical section and release the lock.",
    "conceptTag": "priority-inheritance-protocol"
  },
  {
    "id": "q-conc-pool-37",
    "difficulty": "hard",
    "question": "What is the key advantage of the Priority Ceiling Protocol (PCP) over the Priority Inheritance Protocol (PIP)?",
    "options": [
      {
        "id": "a",
        "text": "PCP prevents both unbounded priority inversion AND deadlocks, and guarantees that any high-priority task will be blocked at most once for the duration of a single critical section"
      },
      {
        "id": "b",
        "text": "PCP requires zero CPU memory to implement"
      },
      {
        "id": "c",
        "text": "PCP works across distributed nodes over HTTP"
      },
      {
        "id": "d",
        "text": "PCP eliminates all thread context switches entirely"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Under Priority Ceiling Protocol (PCP), each shared resource is assigned a priority ceiling equal to the highest priority of any task that could ever lock it. A task can acquire a lock only if its priority is strictly higher than the priority ceilings of all currently locked resources. This mathematical guarantee completely eliminates deadlocks and bounds blocking time to at most one critical section.",
    "conceptTag": "priority-ceiling-protocol"
  },
  {
    "id": "q-conc-pool-38",
    "difficulty": "hard",
    "question": "In formal deadlock detection, how is a system's state modeled as a Wait-For Graph (WFG)?",
    "options": [
      {
        "id": "a",
        "text": "Nodes represent memory pages, edges represent disk swaps"
      },
      {
        "id": "b",
        "text": "Nodes represent REST endpoints, edges represent HTTP redirects"
      },
      {
        "id": "c",
        "text": "Nodes represent CPU cores, edges represent network cables"
      },
      {
        "id": "d",
        "text": "Nodes represent active transactions or threads; a directed edge $T_1 \\to T_2$ exists if and only if $T_1$ is currently blocked waiting for a lock or resource held by $T_2$"
      }
    ],
    "correctOptionId": "d",
    "explanation": "A Wait-For Graph (WFG) is a directed graph derived from a bipartite resource allocation graph. Vertices represent processes/threads/transactions. A directed edge from $T_1$ to $T_2$ indicates that $T_1$ is waiting for $T_2$ to release a resource. A deadlock exists if and only if the WFG contains one or more directed cycles.",
    "conceptTag": "deadlock-wait-for-graph"
  },
  {
    "id": "q-conc-pool-39",
    "difficulty": "hard",
    "question": "What algorithm and time complexity are utilized by enterprise database engines (such as PostgreSQL or MySQL InnoDB) to detect deadlocks in their Wait-For Graph?",
    "options": [
      {
        "id": "a",
        "text": "Binary search over disk indexes in $O(\\log N)$ time"
      },
      {
        "id": "b",
        "text": "Dijkstra's shortest path algorithm running in $O(V^3)$ time"
      },
      {
        "id": "c",
        "text": "Depth-First Search (DFS) or Tarjan's Strongly Connected Components (SCC) algorithm running in $O(V + E)$ time, where $V$ is transactions and $E$ is wait dependencies"
      },
      {
        "id": "d",
        "text": "Quicksort over active memory registers in $O(N \\log N)$ time"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Deadlock detection in databases builds a Wait-For Graph where transactions are vertices and lock dependencies are edges. Tarjan's SCC algorithm or a cycle-detecting DFS traverses this graph in $O(V + E)$ time. When a cycle is found, the engine selects a 'victim' transaction (typically the one with least work or newest timestamp) and aborts it.",
    "conceptTag": "deadlock-detection-algorithms"
  },
  {
    "id": "q-conc-pool-40",
    "difficulty": "hard",
    "question": "In Edsger Dijkstra's Banker's Algorithm for deadlock avoidance, what criteria determines whether granting a resource request leaves the system in a 'Safe State'?",
    "options": [
      {
        "id": "a",
        "text": "If total allocated memory does not exceed 4 Gigabytes"
      },
      {
        "id": "b",
        "text": "If there exists at least one sequence of all processes $\\langle P_1, P_2, \\dots, P_n \\rangle$ such that each process can satisfy its maximum remaining resource claims using currently available resources plus resources released by all prior processes in the sequence"
      },
      {
        "id": "c",
        "text": "If all processes are assigned equal priority by the kernel"
      },
      {
        "id": "d",
        "text": "If no two threads share the same CPU cache line"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A state is defined as 'Safe' in the Banker's Algorithm if there exists a safe execution sequence $\\langle P_1, \\dots, P_n \\rangle$ where each $P_i$'s maximum future resource demand can be met by the currently available resources plus the resources held by all $P_j$ for $j < i$. If no such sequence exists, granting the request could lead to deadlock (an unsafe state).",
    "conceptTag": "bankers-algorithm-safe-state"
  },
  {
    "id": "q-conc-pool-41",
    "difficulty": "hard",
    "question": "In the Go runtime scheduler (GMP Architecture), what exact roles do the G, M, and P abstractions represent?",
    "options": [
      {
        "id": "a",
        "text": "G = Global lock, M = Mutex, P = Pointer"
      },
      {
        "id": "b",
        "text": "G = Garbage collector, M = Memory page, P = Physical CPU"
      },
      {
        "id": "c",
        "text": "G = Goroutine (stack, PC, status), M = OS Machine Thread created by the OS kernel, P = Logical Processor representing the resource/context required to execute Go code (holding local run queues and memory caches)"
      },
      {
        "id": "d",
        "text": "G = Group, M = Master, P = Pipeline"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Go's M:N scheduler model uses: G (Goroutine: lightweight user-space thread with expandable stack and program counter), M (OS thread: kernel thread created via `clone`/`pthread_create`), and P (Processor: logical resource context, typically `GOMAXPROCS` in number, holding a local run queue of 256 Gs, `mcache`, etc.). An M must acquire a P to execute Go code.",
    "conceptTag": "golang-gmp-architecture"
  },
  {
    "id": "q-conc-pool-42",
    "difficulty": "hard",
    "question": "In Go's runtime scheduler, how does the scheduling loop prevent goroutines in the Global Run Queue (GRQ) from starving when local run queues (LRQ) are continuously saturated?",
    "options": [
      {
        "id": "a",
        "text": "Every 61 scheduler ticks, the scheduler explicitly checks the Global Run Queue (GRQ) under the global lock before checking the local run queue"
      },
      {
        "id": "b",
        "text": "By clearing local run queues every 5 seconds"
      },
      {
        "id": "c",
        "text": "By setting the priority of GRQ goroutines to maximum"
      },
      {
        "id": "d",
        "text": "By spawning a new OS thread for every goroutine in the GRQ"
      }
    ],
    "correctOptionId": "a",
    "explanation": "To prevent starvation of goroutines placed on the Global Run Queue (e.g. from network poller or spilled over when LRQ is full), the Go scheduler loop increments a tick counter. Every 61 ticks (`schedtick % 61 == 0`), it acquires `sched.lock` and checks the GRQ first, ensuring fair scheduling.",
    "conceptTag": "golang-scheduler-grq-starvation"
  },
  {
    "id": "q-conc-pool-43",
    "difficulty": "hard",
    "question": "What is the function of the `sysmon` (System Monitor) background OS thread in the Go runtime?",
    "options": [
      {
        "id": "a",
        "text": "It renders GUI graphics for Go desktop applications"
      },
      {
        "id": "b",
        "text": "It compresses compiled Go binaries on disk"
      },
      {
        "id": "c",
        "text": "It encrypts all network packets sent over HTTP/2"
      },
      {
        "id": "d",
        "text": "An M thread running without a P that runs periodic runtime checks: retaking P from Ms blocked in long syscalls (>20us), injecting preemption requests into goroutines running longer than 10ms, scavenging unused heap memory, and checking the network poller"
      }
    ],
    "correctOptionId": "d",
    "explanation": "`sysmon` is a special OS thread (M) that operates without needing a P. It wakes up every 20 microseconds to 10 milliseconds. Its duties include retaking P from threads blocked in system calls, setting preemption flags on goroutines running $\\ge 10\\text{ms}$, triggering GC if idle for 2 minutes, and checking network file descriptors.",
    "conceptTag": "golang-sysmon-preemption"
  },
  {
    "id": "q-conc-pool-44",
    "difficulty": "hard",
    "question": "When a Go goroutine executes a blocking Cgo call or slow blocking system call (e.g. `read()` from disk), how does the runtime preserve throughput for other goroutines waiting on that P?",
    "options": [
      {
        "id": "a",
        "text": "It aborts the system call if it takes more than 1 millisecond"
      },
      {
        "id": "b",
        "text": "Before executing the syscall, `entersyscall` disassociates the logical processor P from the current M; `sysmon` or runtime hands off P to an idle M (or spawns a new M) so remaining goroutines in P's runqueue continue executing"
      },
      {
        "id": "c",
        "text": "It converts the blocking syscall into a non-blocking WebSocket"
      },
      {
        "id": "d",
        "text": "It locks all other processors until the syscall completes"
      }
    ],
    "correctOptionId": "b",
    "explanation": "When M calls `entersyscall()`, it records that P is in state `_Psyscall`. If the syscall blocks, `sysmon` detaches P from M (`handoffp`) and assigns P to another available or newly created M. When the original syscall finishes (`exitsyscall`), M attempts to reacquire an idle P; if none are available, it puts its G into the global run queue and sleeps.",
    "conceptTag": "golang-syscall-handoff"
  },
  {
    "id": "q-conc-pool-45",
    "difficulty": "hard",
    "question": "Why did the HotSpot JVM deprecate Biased Locking in Java 15 (JEP 374) despite its theoretical benefits for uncontended synchronization?",
    "options": [
      {
        "id": "a",
        "text": "Biased locking caused floating point division errors"
      },
      {
        "id": "b",
        "text": "In modern multi-threaded architectures, when multiple threads compete for a biased object, the cost of 'bias revocation' requires bringing all threads to a global Stop-The-World safepoint, which introduces latency spikes that far outweigh the micro-benchmark benefits"
      },
      {
        "id": "c",
        "text": "Biased locking consumed 50% of the Java heap space"
      },
      {
        "id": "d",
        "text": "Operating system kernels removed support for atomic CAS instructions"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Biased locking optimizes single-threaded lock acquisition by writing the thread ID into the object's mark word via a single write. However, when another thread attempts to acquire the lock, the bias must be revoked. Revocation requires a global JVM Stop-The-World safepoint to inspect the thread's stack frame. In modern multi-threaded microservices, these safepoint pauses severely hurt tail latencies.",
    "conceptTag": "jvm-biased-locking-revocation"
  },
  {
    "id": "q-conc-pool-46",
    "difficulty": "hard",
    "question": "What is the three-stage lock escalation (inflation) lifecycle in the Java HotSpot JVM?",
    "options": [
      {
        "id": "a",
        "text": "Spinlock $\\to$ ReentrantLock $\\to$ StampedLock"
      },
      {
        "id": "b",
        "text": "ReadLock $\\to$ WriteLock $\\to$ DiskLock"
      },
      {
        "id": "c",
        "text": "Volatile $\\to$ Atomic $\\to$ Mutex"
      },
      {
        "id": "d",
        "text": "Biased Lock (thread ID in mark word) $\\to$ Lightweight Lock (BasicObjectLock stack displacement with CAS) $\\to$ Heavyweight Monitor (`ObjectMonitor` with OS mutex/futex parking)"
      }
    ],
    "correctOptionId": "d",
    "explanation": "In HotSpot: 1) Biased Lock assumes single thread access (stores thread ID in mark word). 2) If contended, it revokes to Lightweight Lock, which copies mark word to the thread's stack record and uses CAS to acquire. 3) If CAS spinning fails under high contention, it inflates to a Heavyweight Monitor (`ObjectMonitor`), allocating an OS synchronization primitive and parking threads.",
    "conceptTag": "jvm-lock-inflation"
  },
  {
    "id": "q-conc-pool-47",
    "difficulty": "hard",
    "question": "Prior to Go 1.14, how did Go's 'Cooperative Preemption' work, and why could a tight CPU-bound loop hang the application?",
    "codeSnippet": "// Go 1.13 bug scenario:\nfunc main() {\n    runtime.GOMAXPROCS(1)\n    go func() {\n        for { // Tight loop with NO function calls!\n        }\n    }()\n    time.Sleep(time.Millisecond)\n    println(\"Never printed!\")\n}",
    "options": [
      {
        "id": "a",
        "text": "The compiler inserted preemption checks only at function prologues (via stack allocation check `morestack`); a loop with no function calls contained no preemption points, permanently monopolizing the OS thread and starving the scheduler"
      },
      {
        "id": "b",
        "text": "The compiler deleted the `println` statement because it detected dead code"
      },
      {
        "id": "c",
        "text": "The Go runtime automatically killed the main goroutine"
      },
      {
        "id": "d",
        "text": "The OS scheduler froze the process due to excessive memory consumption"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Prior to Go 1.14, preemption was strictly cooperative and relied on compiler-inserted checks in function prologues (used for growing the goroutine stack). A tight loop containing no function calls had no compiler-inserted preemption checks. On a single P (`GOMAXPROCS=1`), the goroutine ran forever, completely starving all other goroutines and garbage collection.",
    "conceptTag": "golang-cooperative-preemption"
  },
  {
    "id": "q-conc-pool-48",
    "difficulty": "hard",
    "question": "How did Go 1.14 solve the tight-loop scheduling problem through Non-Cooperative Asynchronous Preemption?",
    "options": [
      {
        "id": "a",
        "text": "By executing all Go code in kernel space"
      },
      {
        "id": "b",
        "text": "By rewriting all loops into recursive functions during compilation"
      },
      {
        "id": "c",
        "text": "`sysmon` detects goroutines running for $>10\\text{ms}$ and sends an OS signal (`SIGURG` on Unix/macOS) to the underlying thread; the signal handler interrupts the thread at an arbitrary instruction, inspects register states, and safely deschedules the goroutine at a GC-safe point"
      },
      {
        "id": "d",
        "text": "By disabling CPU hyper-threading"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Go 1.14 introduced asynchronous preemption via OS signals. When `sysmon` observes a goroutine running $>10\\text{ms}$, it transmits a `SIGURG` POSIX signal to the target M. The runtime's signal handler catches the interrupt, verifies the instruction is at a safe-point, pushes a preemption call frame onto the stack, and yields the processor to the scheduler.",
    "conceptTag": "golang-asynchronous-preemption"
  },
  {
    "id": "q-conc-pool-49",
    "difficulty": "hard",
    "question": "Why does a Fair Lock (`new ReentrantLock(true)`) typically exhibit up to $10\\times$ LOWER throughput than a Non-Fair Lock (`new ReentrantLock(false)`) under high concurrency?",
    "options": [
      {
        "id": "a",
        "text": "Fair locks use 1024-bit encryption on lock tokens"
      },
      {
        "id": "b",
        "text": "Fair locks strictly enforce FIFO queue order; an unparked thread takes microseconds to wake up, during which the lock sits idle. Non-fair locks allow active running threads to 'barging' acquire the lock immediately, maximizing CPU throughput at the cost of strict fairness"
      },
      {
        "id": "c",
        "text": "Fair locks allocate dynamic memory on every `lock()` call"
      },
      {
        "id": "d",
        "text": "Operating systems restrict fair locks to single-core execution"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In a fair lock, arriving threads must join the tail of the wait queue if any threads are waiting. When the lock holder unlocks, it signals the head thread. However, waking up a sleeping thread takes several microseconds (OS context switch). In a non-fair lock, a currently running thread on another core can 'barge' in and acquire the lock immediately while the head thread is waking up, vastly increasing throughput.",
    "conceptTag": "fair-vs-nonfair-locks"
  },
  {
    "id": "q-conc-pool-50",
    "difficulty": "hard",
    "question": "Why does an asynchronous event-loop architecture (e.g. Netty, Node.js, Go network poller with epoll/kqueue) scale to 1,000,000 concurrent network connections, whereas a traditional thread-per-request model fails around 5,000 to 10,000 connections?",
    "options": [
      {
        "id": "a",
        "text": "Thread-per-request systems cannot serialize JSON payloads"
      },
      {
        "id": "b",
        "text": "TCP/IP protocol limits operating systems to 5,000 threads"
      },
      {
        "id": "c",
        "text": "Each OS thread requires significant reserved virtual memory for its call stack (typically 512KB to 2MB) and incurs heavy OS context-switching overhead, exhausting memory at 10,000 threads. Event loops multiplex hundreds of thousands of non-blocking sockets onto a handful of OS threads with minimal memory overhead per connection"
      },
      {
        "id": "d",
        "text": "Event loops run exclusively on GPU hardware"
      }
    ],
    "correctOptionId": "c",
    "explanation": "In thread-per-request, 100,000 connections require 100,000 OS threads. At 1MB stack size, this requires 100GB of RAM just for thread stacks, and OS scheduler context switching overwhelms CPU caches. Event loops use non-blocking I/O (`epoll`/`kqueue`/`io_uring`) on a fixed small pool of threads (e.g. matching CPU core count), representing connections as lightweight memory structures (~a few hundred bytes).",
    "conceptTag": "thread-per-request-vs-event-loop"
  }
];
