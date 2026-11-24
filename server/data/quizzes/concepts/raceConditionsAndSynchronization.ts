import type { QuizQuestion } from '../../../../src/types';

export const RACE_CONDITIONS_SYNCHRONIZATION_50_QUESTIONS: QuizQuestion[] = [
  {
    "id": "q-conc-sync-1",
    "difficulty": "easy",
    "question": "What is the key technical difference between a 'Data Race' and a 'Race Condition'?",
    "options": [
      {
        "id": "a",
        "text": "A data race is unsynchronized concurrent access to shared memory with at least one write; a race condition is a timing defect in program execution logic"
      },
      {
        "id": "b",
        "text": "A data race occurs when two threads read memory simultaneously; a race condition occurs when one thread writes to disk"
      },
      {
        "id": "c",
        "text": "A data race only affects interpreted languages; a race condition only affects compiled languages like C++ and Go"
      },
      {
        "id": "d",
        "text": "A data race is caught at compile time; a race condition cannot be caught by any tooling"
      }
    ],
    "correctOptionId": "a",
    "explanation": "A data race is an execution anomaly where two threads concurrently access the same memory location without synchronization, and at least one access is a write. A race condition is a higher-level semantic flaw where the correctness of program execution depends on relative timing or interleaving of threads, even if each individual memory access is synchronized.",
    "conceptTag": "concurrency-data-race-vs-race-condition"
  },
  {
    "id": "q-conc-sync-2",
    "difficulty": "easy",
    "question": "In a multithreaded backend service, why is a standard increment operation like `counter++` not thread-safe without synchronization?",
    "codeSnippet": "// Multiple worker threads execute concurrently:\ncounter++;",
    "options": [
      {
        "id": "a",
        "text": "The compiler replaces `counter++` with an infinite loop if optimization flags are enabled"
      },
      {
        "id": "b",
        "text": "It consists of three separate machine operations (read from memory, modify value in register, write back to memory) that can be interleaved by other threads"
      },
      {
        "id": "c",
        "text": "Integer addition triggers a CPU interrupt that halts all threads on the core"
      },
      {
        "id": "d",
        "text": "Memory allocations fail if multiple threads update the same 32-bit integer"
      }
    ],
    "correctOptionId": "b",
    "explanation": "The expression `counter++` compiles into three separate machine steps: reading the variable from RAM/cache into a register, incrementing the register value, and writing the register value back to memory. If two threads interleave these steps concurrently, one write overwrites the other, resulting in lost updates.",
    "conceptTag": "concurrency-critical-sections"
  },
  {
    "id": "q-conc-sync-3",
    "difficulty": "easy",
    "question": "Consider the following Go HTTP handler updating an in-memory cache. What concurrency anti-pattern is present in this implementation?",
    "codeSnippet": "var mu sync.Mutex\nvar cache = make(map[string]string)\n\nfunc HandleRequest(key, val string) {\n    mu.Lock()\n    defer mu.Unlock()\n    \n    resp, err := http.Get(\"https://api.external.com/validate?key=\" + key)\n    if err == nil && resp.StatusCode == 200 {\n        cache[key] = val\n    }\n}",
    "options": [
      {
        "id": "a",
        "text": "The map access will throw a compile error because Go maps cannot store strings"
      },
      {
        "id": "b",
        "text": "`defer mu.Unlock()` executes before `http.Get`, leading to an immediate data race"
      },
      {
        "id": "c",
        "text": "Performing a blocking network I/O operation inside a critical section holds the mutex hostage, serializing all requests and tanking throughput"
      },
      {
        "id": "d",
        "text": "Go HTTP handlers automatically acquire an internal mutex on all global maps"
      }
    ],
    "correctOptionId": "c",
    "explanation": "A critical section should be as short as possible. Performing blocking network I/O (e.g. `http.Get`) while holding a mutex causes all other threads/goroutines requesting the lock to block indefinitely, drastically degrading throughput and latency. The lock should only be acquired immediately before mutating `cache`.",
    "conceptTag": "concurrency-mutex-scope"
  },
  {
    "id": "q-conc-sync-4",
    "difficulty": "easy",
    "question": "What happens when a thread attempts to acquire a standard non-reentrant Mutex (such as Go's `sync.Mutex` or POSIX `PTHREAD_MUTEX_NORMAL`) that it already holds?",
    "codeSnippet": "func UpdateUser() {\n    mu.Lock()\n    defer mu.Unlock()\n    UpdateProfile() // Inside UpdateProfile: mu.Lock() is called again!\n}",
    "options": [
      {
        "id": "a",
        "text": "The lock call increments an internal reentrancy counter and returns immediately"
      },
      {
        "id": "b",
        "text": "The second `Lock()` call releases the first lock and replaces it"
      },
      {
        "id": "c",
        "text": "The runtime throws a `ConcurrentModificationException` and rolls back execution"
      },
      {
        "id": "d",
        "text": "The thread deadlocks with itself because the mutex is already locked and waiting to be released"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Standard mutexes (like Go's `sync.Mutex` or non-recursive POSIX mutexes) do not maintain ownership records or reentrancy counters. When the thread that already holds the lock attempts to acquire it again, it is blocked waiting for the lock to become free, causing a self-deadlock.",
    "conceptTag": "concurrency-mutex-reentrancy"
  },
  {
    "id": "q-conc-sync-5",
    "difficulty": "easy",
    "question": "What are the core semantics of the Compare-And-Swap (CAS) atomic primitive?",
    "options": [
      {
        "id": "a",
        "text": "It swaps two variables in memory regardless of their current values"
      },
      {
        "id": "b",
        "text": "It compares two variables on disk and triggers an operating system interrupt if they differ"
      },
      {
        "id": "c",
        "text": "It checks if a memory location contains an expected value; if so, it updates it to a new value atomically and returns true; otherwise it leaves memory untouched and returns false"
      },
      {
        "id": "d",
        "text": "It locks the entire operating system kernel while executing a user-space branch"
      }
    ],
    "correctOptionId": "c",
    "explanation": "CAS (Compare-And-Swap) is a CPU hardware instruction (e.g. `CMPXCHG` on x86) that takes a memory address, an expected value, and a new value. If the current value at the address equals the expected value, it replaces it with the new value atomically. If it does not match, the value is not modified.",
    "conceptTag": "concurrency-cas-primitive"
  },
  {
    "id": "q-conc-sync-6",
    "difficulty": "easy",
    "question": "Under low-to-moderate contention, why are atomic CPU instructions (like `atomic.AddInt64`) significantly faster than standard Mutexes for updating a shared counter?",
    "options": [
      {
        "id": "a",
        "text": "Atomics write directly to solid-state storage without accessing CPU L1/L2 caches"
      },
      {
        "id": "b",
        "text": "Atomics execute directly in CPU hardware without requiring thread parking, kernel transitions, or OS scheduler context switching"
      },
      {
        "id": "c",
        "text": "Mutexes cannot be compiled into native assembly code"
      },
      {
        "id": "d",
        "text": "Atomics allocate separate memory addresses for each concurrent thread automatically"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Mutexes involve operating system or runtime synchronization primitives that may park the calling thread, put it to sleep in a wait queue, and wake it up via the OS scheduler, costing thousands of CPU cycles. Atomic operations execute single-instruction hardware operations (e.g., `LOCK XADD`) in user-space in nanoseconds.",
    "conceptTag": "concurrency-atomics-vs-mutex"
  },
  {
    "id": "q-conc-sync-7",
    "difficulty": "easy",
    "question": "When is a Read-Write Mutex (e.g., `sync.RWMutex` or `std::shared_mutex`) preferred over a standard Mutex?",
    "options": [
      {
        "id": "a",
        "text": "When writes outnumber reads by a factor of 10 to 1"
      },
      {
        "id": "b",
        "text": "When memory usage must be minimized because RWMutex uses fewer bytes than Mutex"
      },
      {
        "id": "c",
        "text": "When all operations execute strictly sequentially on a single CPU core"
      },
      {
        "id": "d",
        "text": "When workloads are heavily read-dominated (e.g., 95%+ reads) and read critical sections are non-trivial, allowing multiple readers to access concurrently"
      }
    ],
    "correctOptionId": "d",
    "explanation": "An RWMutex allows any number of concurrent readers to hold the shared lock simultaneously, while writers require exclusive access. It provides substantial throughput gains for read-heavy workloads. For write-heavy workloads, the synchronization overhead of tracking reader counts makes RWMutex slower than a standard Mutex.",
    "conceptTag": "concurrency-rwmutex"
  },
  {
    "id": "q-conc-sync-8",
    "difficulty": "easy",
    "question": "What is 'Writer Starvation' in the context of naive Read-Write locks?",
    "options": [
      {
        "id": "a",
        "text": "A continuous stream of incoming readers continuously acquires shared read locks, preventing a pending writer from ever acquiring an exclusive write lock"
      },
      {
        "id": "b",
        "text": "Writers exhaust disk storage because readers do not flush their buffers"
      },
      {
        "id": "c",
        "text": "Writers consume 100% of CPU cycles and starve OS background threads"
      },
      {
        "id": "d",
        "text": "The memory allocator refuses to allocate memory for write requests under load"
      }
    ],
    "correctOptionId": "a",
    "explanation": "In a reader-biased RWMutex, new readers can acquire shared read locks as long as another reader holds the lock. If read traffic is continuous, the reader count never drops to zero, starving the pending writer indefinitely. Modern RWMutex implementations (such as Go's `sync.RWMutex`) prevent this by blocking new readers once a writer arrives.",
    "conceptTag": "concurrency-rwmutex-starvation"
  },
  {
    "id": "q-conc-sync-9",
    "difficulty": "easy",
    "question": "Which concurrency primitive is specifically designed to throttle and limit access to a pool of $N$ identical resources (such as database connections)?",
    "options": [
      {
        "id": "a",
        "text": "Spinlock"
      },
      {
        "id": "b",
        "text": "Counting Semaphore initialized to $N$"
      },
      {
        "id": "c",
        "text": "Condition Variable with a single thread"
      },
      {
        "id": "d",
        "text": "Atomic Boolean flag"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A counting semaphore maintains a counter of available permits. Initialized to $N$, threads call `acquire()` (decrementing permits) to use a resource, blocking when the count reaches zero, and call `release()` (incrementing permits) when finished. This makes it the ideal primitive for pooling resources.",
    "conceptTag": "concurrency-counting-semaphore"
  },
  {
    "id": "q-conc-sync-10",
    "difficulty": "easy",
    "question": "What fundamental ownership difference exists between a Mutex and a Semaphore?",
    "options": [
      {
        "id": "a",
        "text": "A Mutex can only be modified by root/kernel processes; a Semaphore can be used by user processes"
      },
      {
        "id": "b",
        "text": "Semaphores cannot be used across multiple processes; Mutexes can only be used across networks"
      },
      {
        "id": "c",
        "text": "A Mutex must be released by the exact same thread that locked it; a Semaphore can be signaled/posted by any thread"
      },
      {
        "id": "d",
        "text": "Mutexes support timeouts; Semaphores only support non-blocking calls"
      }
    ],
    "correctOptionId": "c",
    "explanation": "A Mutex represents mutual exclusion with strict ownership semantics: the thread that calls `lock()` owns the lock and must be the one to call `unlock()`. In contrast, a Semaphore is an unsigned counter: Thread A can wait/acquire on it, and Thread B can signal/release it (ideal for producer-consumer signaling).",
    "conceptTag": "concurrency-semaphore-vs-mutex"
  },
  {
    "id": "q-conc-sync-11",
    "difficulty": "easy",
    "question": "Why can reading an unsynchronized 64-bit integer on a 32-bit architecture result in a 'Torn Read'?",
    "codeSnippet": "// 32-bit architecture without atomic instructions:\nvar val int64 = 0x00000000FFFFFFFF\n// Thread 1 writes: val = 0x0000000100000000\n// Thread 2 reads val simultaneously",
    "options": [
      {
        "id": "a",
        "text": "The CPU halts with a hardware bus error"
      },
      {
        "id": "b",
        "text": "The memory bus inverts the most significant bits on concurrent access"
      },
      {
        "id": "c",
        "text": "32-bit processors convert 64-bit integers to floating point numbers automatically"
      },
      {
        "id": "d",
        "text": "A 32-bit CPU cannot read or write 64 bits in a single bus cycle, requiring two separate 32-bit memory operations that another thread can observe halfway through"
      }
    ],
    "correctOptionId": "d",
    "explanation": "On a 32-bit CPU, a 64-bit word cannot be loaded or stored in a single atomic memory bus cycle. The CPU performs two 32-bit instructions (low-order and high-order words). If a reading thread reads between the writer's two stores, it observes half old data and half new data (a 'torn read').",
    "conceptTag": "concurrency-torn-reads"
  },
  {
    "id": "q-conc-sync-12",
    "difficulty": "easy",
    "question": "What is the recommended design strategy for minimizing critical section duration when serializing and persisting data?",
    "options": [
      {
        "id": "a",
        "text": "Copy or clone the minimal necessary state while holding the mutex, release the mutex immediately, and perform the expensive JSON serialization and disk I/O outside the lock"
      },
      {
        "id": "b",
        "text": "Acquire the mutex, serialize to JSON, write to disk, and release the mutex"
      },
      {
        "id": "c",
        "text": "Never use mutexes; let threads write directly to disk files concurrently"
      },
      {
        "id": "d",
        "text": "Use a recursive mutex and increase thread stack size"
      }
    ],
    "correctOptionId": "a",
    "explanation": "To prevent contention and high lock wait times, critical sections should hold locks for the shortest possible duration. Copying the in-memory state under the lock takes nanoseconds; once the lock is released, expensive CPU-intensive serialization (JSON/Protobuf) and I/O (disk/network) can proceed safely in parallel.",
    "conceptTag": "concurrency-critical-section-tuning"
  },
  {
    "id": "q-conc-sync-13",
    "difficulty": "easy",
    "question": "Why did the classic 'Double-Checked Locking' singleton pattern fail in languages like Java (prior to Java 5) and C++ (prior to C++11) without `volatile` or memory fences?",
    "codeSnippet": "if (instance == null) {\n    synchronized(Lock.class) {\n        if (instance == null) {\n            instance = new Helper(); // Problem occurs here!\n        }\n    }\n}",
    "options": [
      {
        "id": "a",
        "text": "The synchronized block threw an illegal monitor state exception"
      },
      {
        "id": "b",
        "text": "Java and C++ do not support null checks on objects"
      },
      {
        "id": "c",
        "text": "The outer check `instance == null` fails to compile because variables must be checked inside synchronized blocks"
      },
      {
        "id": "d",
        "text": "The CPU/compiler could reorder memory allocation and pointer assignment before constructor execution, allowing other threads to observe a non-null but partially initialized object"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Creating an object involves: 1) allocate memory, 2) invoke constructor to initialize fields, 3) write reference to `instance`. Without memory fences or `volatile`, compiler/CPU optimizations can reorder steps 2 and 3. Another thread running the outer check can see `instance != null` and use the object before its constructor has completed.",
    "conceptTag": "concurrency-double-checked-locking"
  },
  {
    "id": "q-conc-sync-14",
    "difficulty": "easy",
    "question": "Under what specific condition is a Spinlock preferable to a blocking Mutex?",
    "options": [
      {
        "id": "a",
        "text": "When critical sections take hundreds of milliseconds to execute"
      },
      {
        "id": "b",
        "text": "When the critical section is extremely short (a few CPU cycles) and the cost of an OS context switch exceeds the cost of spinning on a multi-core CPU"
      },
      {
        "id": "c",
        "text": "When threads run on a single-core CPU where spinning cannot be preempted"
      },
      {
        "id": "d",
        "text": "When the thread must wait on network socket packets"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A blocking mutex puts a waiting thread to sleep via an OS system call, which incurs context switch overhead (typically 1\u20135 microseconds). If the lock holder releases the lock in just a few nanoseconds, spinning (busy-waiting) on a multi-core machine avoids the context switch penalty.",
    "conceptTag": "concurrency-spinlock-basics"
  },
  {
    "id": "q-conc-sync-15",
    "difficulty": "easy",
    "question": "How does a Binary Semaphore initialized with value 1 differ from a standard Mutex regarding Priority Inversion?",
    "options": [
      {
        "id": "a",
        "text": "A standard mutex can implement Priority Inheritance Protocols (because it knows its owning thread), whereas a semaphore has no owner and cannot boost the priority of an arbitrary thread"
      },
      {
        "id": "b",
        "text": "A binary semaphore supports priority inheritance; a mutex does not"
      },
      {
        "id": "c",
        "text": "A binary semaphore is handled by the BIOS; a mutex is handled by the compiler"
      },
      {
        "id": "d",
        "text": "A binary semaphore consumes twice as much memory as a mutex"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Because a mutex has strict ownership (only the thread that locked it can unlock it), the OS scheduler knows which thread is holding up a high-priority task and can boost that thread's priority (Priority Inheritance Protocol). Semaphores do not track owning threads, making priority inheritance impossible.",
    "conceptTag": "concurrency-mutex-vs-binary-semaphore"
  },
  {
    "id": "q-conc-sync-16",
    "difficulty": "easy",
    "question": "In Go, what is the cleanest, lowest-overhead primitive for signaling a graceful shutdown across 100 worker goroutines from a single master goroutine?",
    "codeSnippet": "// Master signals shutdown; workers check if they should exit",
    "options": [
      {
        "id": "a",
        "text": "Spawning a separate mutex for every individual worker"
      },
      {
        "id": "b",
        "text": "Incrementing an atomic integer by 100 and having workers decrement it"
      },
      {
        "id": "c",
        "text": "Closing a broadcast channel `close(stopCh)` or using `context.WithCancel()`, which immediately unblocks all reading worker goroutines"
      },
      {
        "id": "d",
        "text": "Sending a kill signal to the OS process"
      }
    ],
    "correctOptionId": "c",
    "explanation": "In Go, closing a channel (`close(ch)`) broadcasts a read event to all listening goroutines simultaneously, returning the zero value and `ok == false`. This provides an elegant, zero-lock, idiomatic broadcast mechanism for shutdown coordination.",
    "conceptTag": "concurrency-shutdown-signaling"
  },
  {
    "id": "q-conc-sync-17",
    "difficulty": "easy",
    "question": "Identify the concurrency flaw in the following 'Check-Then-Act' pattern executed concurrently by multiple threads on a shared map:",
    "codeSnippet": "if (!userSessionCache.containsKey(userId)) {\n    UserSession session = fetchFromDB(userId);\n    userSessionCache.put(userId, session);\n}",
    "options": [
      {
        "id": "a",
        "text": "Multiple threads can evaluate `containsKey` as false simultaneously, causing redundant expensive database queries and duplicate conflicting put operations"
      },
      {
        "id": "b",
        "text": "The pattern throws a `NullPointerException` if the user exists in the database"
      },
      {
        "id": "c",
        "text": "`containsKey` automatically locks the map forever in Java and Go"
      },
      {
        "id": "d",
        "text": "The database connection pool rejects queries triggered from conditional statements"
      }
    ],
    "correctOptionId": "a",
    "explanation": "This is a classic 'Check-Then-Act' race condition. If Thread 1 and Thread 2 both check `containsKey(userId)` before either has inserted the session, both see `false`. Both proceed to execute `fetchFromDB(userId)` and both write to the map, wasting resources and possibly corrupting state.",
    "conceptTag": "concurrency-check-then-act"
  },
  {
    "id": "q-conc-sync-18",
    "difficulty": "medium",
    "question": "In R. Kent Treiber's lock-free stack algorithm, how does the `push` operation guarantee progress without mutexes?",
    "codeSnippet": "func (s *TreiberStack) Push(val int) {\n    newNode := &Node{val: val}\n    for {\n        oldHead := atomic.LoadPointer(&s.head)\n        newNode.next = (*Node)(oldHead)\n        if atomic.CompareAndSwapPointer(&s.head, oldHead, unsafe.Pointer(newNode)) {\n            return\n        }\n    }\n}",
    "options": [
      {
        "id": "a",
        "text": "It acquires an internal OS kernel spinlock on `s.head`"
      },
      {
        "id": "b",
        "text": "It attempts an atomic CAS to swing `s.head` to `newNode`; if another thread pushed first, CAS fails and the loop retries with the newly observed head"
      },
      {
        "id": "c",
        "text": "It suspends all other threads using the Go scheduler until the push completes"
      },
      {
        "id": "d",
        "text": "It allocates a brand new stack structure on every push operation"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Treiber's stack uses a speculative optimistic CAS loop. A thread reads the current head, points its new node to it, and attempts to atomically update head to new node. If another thread pushed in the interim, the CAS fails, and the loop retries. At least one thread is guaranteed to succeed on each contention event.",
    "conceptTag": "concurrency-lockfree-treiber-stack"
  },
  {
    "id": "q-conc-sync-19",
    "difficulty": "medium",
    "question": "What is the 'ABA Problem' that threatens lock-free data structures using Compare-And-Swap?",
    "options": [
      {
        "id": "a",
        "text": "When thread A and thread B swap memory allocations back and forth causing a memory leak"
      },
      {
        "id": "b",
        "text": "When a compiler reorders atomic instructions in reverse alphabetical order"
      },
      {
        "id": "c",
        "text": "When a memory address value changes from A to B and back to A; a thread observing A concludes nothing has changed, despite intermediate modifications that invalidate its read state"
      },
      {
        "id": "d",
        "text": "When a binary tree becomes unbalanced after three consecutive node deletions"
      }
    ],
    "correctOptionId": "c",
    "explanation": "The ABA problem occurs in lock-free algorithms when Thread 1 reads value A from address X. Thread 2 preempts, changes X from A to B, frees memory, and then writes A back to X (often reusing the exact same memory address from an allocator freelist). Thread 1 wakes up, performs CAS(X, A, C), which succeeds because X equals A, even though the internal structure (like `A.next`) was corrupted.",
    "conceptTag": "concurrency-aba-problem"
  },
  {
    "id": "q-conc-sync-20",
    "difficulty": "medium",
    "question": "Which of the following techniques is commonly used in lock-free systems to eliminate the ABA problem?",
    "options": [
      {
        "id": "a",
        "text": "Disabling CPU L3 cache line invalidations"
      },
      {
        "id": "b",
        "text": "Replacing all CAS operations with standard bitwise XOR"
      },
      {
        "id": "c",
        "text": "Allocating all nodes on the execution call stack instead of the heap"
      },
      {
        "id": "d",
        "text": "Using Tagged Pointers / Versioned References (e.g. `AtomicStampedReference`) combining the pointer with a monotonically increasing sequence counter"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Tagged pointers (or versioned references like Java's `AtomicStampedReference` or double-word CAS) pair a pointer with a monotonically incremented integer tag. Even if pointer address A is reused, its tag will have incremented from $V_1$ to $V_3$, causing the CAS check `(A, V1)` to fail correctly.",
    "conceptTag": "concurrency-aba-mitigation"
  },
  {
    "id": "q-conc-sync-21",
    "difficulty": "medium",
    "question": "What hardware-level CPU and compiler phenomenon necessitates the use of Memory Barriers (Memory Fences)?",
    "options": [
      {
        "id": "a",
        "text": "Hard drive sector degradation during parity writes"
      },
      {
        "id": "b",
        "text": "Operating system page faults triggered by virtual memory translation"
      },
      {
        "id": "c",
        "text": "Out-of-order execution by CPU pipelines, store buffers, and compiler instruction reordering that breaks sequential consistency across cores"
      },
      {
        "id": "d",
        "text": "Thermal throttling of CPU cores under high mathematical loads"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Modern superscalar CPUs feature out-of-order execution, speculative execution, store buffers, and cache coherence delays. Compilers also aggressively reorder instructions for efficiency. While single-thread semantics are strictly preserved, memory accesses appear out of order to other CPU cores unless memory barriers enforce ordering.",
    "conceptTag": "concurrency-memory-barriers"
  },
  {
    "id": "q-conc-sync-22",
    "difficulty": "medium",
    "question": "In the C++11 and Rust atomic memory models, what synchronization guarantee does `Acquire-Release` ordering provide?",
    "codeSnippet": "// Thread 1 (Producer):\ndata = 42; // non-atomic payload\nready.store(true, std::memory_order_release);\n\n// Thread 2 (Consumer):\nwhile (!ready.load(std::memory_order_acquire));\nassert(data == 42); // Guaranteed to hold?",
    "options": [
      {
        "id": "a",
        "text": "No guarantee; `data` can still be read as uninitialized because it is not atomic"
      },
      {
        "id": "b",
        "text": "All memory writes before `store(release)` in Thread 1 are guaranteed to be visible to Thread 2 after its `load(acquire)` observes the stored value"
      },
      {
        "id": "c",
        "text": "It forces every core in the entire computer to halt until memory is synchronized with DRAM"
      },
      {
        "id": "d",
        "text": "It guarantees a global total order across all independent atomic variables in the system"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A store with `memory_order_release` ensures that all prior memory writes (both atomic and non-atomic) cannot be reordered after it. A load with `memory_order_acquire` ensures that all subsequent memory reads cannot be reordered before it. When the acquire load sees the release store, a happens-before relationship is established.",
    "conceptTag": "concurrency-acquire-release"
  },
  {
    "id": "q-conc-sync-23",
    "difficulty": "medium",
    "question": "When is `std::memory_order_relaxed` appropriate in high-performance concurrent programming?",
    "options": [
      {
        "id": "a",
        "text": "For publishing a pointer to an initialized object across threads"
      },
      {
        "id": "b",
        "text": "For managing thread pool work queue task handoffs"
      },
      {
        "id": "c",
        "text": "For implementing a lock-free double-ended queue"
      },
      {
        "id": "d",
        "text": "For incrementing independent metrics counters where atomicity is required, but synchronization or ordering with other memory operations is unnecessary"
      }
    ],
    "correctOptionId": "d",
    "explanation": "`memory_order_relaxed` guarantees only atomicity of the operation itself (no torn reads/writes), with zero memory barrier or ordering constraints relative to other memory locations. It is ideal for standalone statistics counters (e.g. packet counters, request metrics) where no other memory access depends on the counter update.",
    "conceptTag": "concurrency-relaxed-memory-order"
  },
  {
    "id": "q-conc-sync-24",
    "difficulty": "medium",
    "question": "Under the MESI CPU cache coherence protocol, what state transition occurs when Core 2 attempts to write to a cache line that is currently in the 'Shared' (S) state across Core 1 and Core 2?",
    "options": [
      {
        "id": "a",
        "text": "Core 2 broadcasts an Invalid Request over the bus; Core 1 transitions its line to 'Invalid' (I), and Core 2 transitions to 'Modified' (M)"
      },
      {
        "id": "b",
        "text": "Core 2 writes locally; Core 1 keeps reading stale data without notification"
      },
      {
        "id": "c",
        "text": "Both cores instantly transition the cache line to 'Exclusive' (E)"
      },
      {
        "id": "d",
        "text": "The memory controller aborts Core 2's instruction and triggers an interrupt"
      }
    ],
    "correctOptionId": "a",
    "explanation": "In the MESI protocol (Modified, Exclusive, Shared, Invalid), a cache line in the Shared state is read-only. For Core 2 to write, it must send a Read-With-Intent-To-Modify (RWITM) or Invalidation message. Core 1 marks its copy Invalid (I), and Core 2 updates the data and marks its line Modified (M).",
    "conceptTag": "concurrency-mesi-protocol"
  },
  {
    "id": "q-conc-sync-25",
    "difficulty": "medium",
    "question": "What is 'False Sharing' in high-performance multithreaded systems?",
    "codeSnippet": "type Metrics struct {\n    CounterA uint64 // Updated continuously by Thread A\n    CounterB uint64 // Updated continuously by Thread B\n}",
    "options": [
      {
        "id": "a",
        "text": "Two threads accessing different files on the same network file share"
      },
      {
        "id": "b",
        "text": "Two threads on separate CPU cores modifying completely independent variables that reside within the same 64-byte CPU cache line, causing constant cache line invalidations and bus traffic"
      },
      {
        "id": "c",
        "text": "A thread attempting to read a variable before it has been assigned a value"
      },
      {
        "id": "d",
        "text": "A hyper-threading defect where physical CPU registers are corrupted"
      }
    ],
    "correctOptionId": "b",
    "explanation": "CPU caches operate on chunks called cache lines (typically 64 bytes). If two threads on different cores update independent variables (`CounterA` and `CounterB`) located on the same cache line, each write invalidates the other core's cache line via MESI cache coherence ('cache line bouncing'), causing severe performance degradation.",
    "conceptTag": "concurrency-false-sharing"
  },
  {
    "id": "q-conc-sync-26",
    "difficulty": "medium",
    "question": "How do systems engineers prevent False Sharing between adjacent atomic variables in Go or Java?",
    "codeSnippet": "// Example in Go to isolate fields across cache lines:\ntype PaddedCounter struct {\n    val uint64\n    _   [56]byte // Padding to 64 bytes\n}",
    "options": [
      {
        "id": "a",
        "text": "By executing threads only on virtual machines with single virtual CPUs"
      },
      {
        "id": "b",
        "text": "By declaring all variables as global pointers"
      },
      {
        "id": "c",
        "text": "By adding cache line padding (e.g. 64-byte or 128-byte padding arrays, or Java `@Contended`) to force each independent variable onto its own dedicated cache line"
      },
      {
        "id": "d",
        "text": "By compressing memory structures using gzip before loading into registers"
      }
    ],
    "correctOptionId": "c",
    "explanation": "By injecting padding bytes (such as `_ [56]byte` in Go or `@jdk.internal.vm.annotation.Contended` in Java) or using memory alignment directives (`alignas(64)` in C++), independent variables are forced onto separate 64-byte cache lines, preventing cache line bouncing between cores.",
    "conceptTag": "concurrency-cache-line-padding"
  },
  {
    "id": "q-conc-sync-27",
    "difficulty": "medium",
    "question": "Why does a Condition Variable's `Wait()` operation (e.g. `pthread_cond_wait` or `sync.Cond.Wait()`) require an already locked Mutex as a parameter?",
    "options": [
      {
        "id": "a",
        "text": "To verify that the thread has root permissions"
      },
      {
        "id": "b",
        "text": "Because condition variables are implemented as subclasses of mutexes"
      },
      {
        "id": "c",
        "text": "To prevent the operating system from allocating swap space"
      },
      {
        "id": "d",
        "text": "To atomically release the mutex and place the calling thread onto the wait queue, preventing missed notifications from a signaling thread"
      }
    ],
    "correctOptionId": "d",
    "explanation": "If releasing the mutex and sleeping were not atomic, a context switch could occur after releasing the mutex but before sleeping. Another thread could acquire the mutex, change the condition, call `Signal()`, and release the mutex. The first thread would then sleep, permanently missing the signal. Atomically releasing the lock while enqueuing into the wait queue prevents this race.",
    "conceptTag": "concurrency-condition-variables"
  },
  {
    "id": "q-conc-sync-28",
    "difficulty": "medium",
    "question": "Why must a Condition Variable wait operation ALWAYS be invoked inside a `while` loop rather than an `if` statement?",
    "codeSnippet": "// Correct pattern:\nmu.Lock()\nwhile (!ready) {\n    cond.Wait()\n}\n// proceed with work\nmu.Unlock()",
    "options": [
      {
        "id": "a",
        "text": "To guard against 'Spurious Wakeups' and situations where another awakened thread consumed the condition before this thread reacquired the mutex"
      },
      {
        "id": "b",
        "text": "Because `if` statements cannot evaluate boolean variables in concurrent blocks"
      },
      {
        "id": "c",
        "text": "Because compiler optimizers delete `if` statements inside locks"
      },
      {
        "id": "d",
        "text": "To force the thread to spin on the CPU rather than sleep"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Threads waiting on condition variables can experience 'spurious wakeups' (woken by the OS kernel even without a signal) or another thread may acquire the lock first and invalidate the condition (e.g. removing the sole item from a queue). Testing the condition in a `while` loop ensures the predicate is re-verified before proceeding.",
    "conceptTag": "concurrency-spurious-wakeups"
  },
  {
    "id": "q-conc-sync-29",
    "difficulty": "medium",
    "question": "What is the primary difference between `Signal()` (or `notify()`) and `Broadcast()` (or `notifyAll()`) on a Condition Variable?",
    "options": [
      {
        "id": "a",
        "text": "`Signal` causes immediate thread termination; `Broadcast` pauses the process"
      },
      {
        "id": "b",
        "text": "`Signal` works across network sockets; `Broadcast` only works on local memory"
      },
      {
        "id": "c",
        "text": "`Signal` releases the mutex; `Broadcast` keeps the mutex locked forever"
      },
      {
        "id": "d",
        "text": "`Signal` wakes up one waiting thread; `Broadcast` wakes up all waiting threads simultaneously"
      }
    ],
    "correctOptionId": "d",
    "explanation": "`Signal()` wakes at least one thread waiting on the condition variable, which is efficient when only a single waiting thread can proceed (e.g. one item added to a queue). `Broadcast()` wakes all waiting threads, which is necessary when state changes affect all threads (e.g. batch state changes, barrier unblocking, or shutdown).",
    "conceptTag": "concurrency-signal-vs-broadcast"
  },
  {
    "id": "q-conc-sync-30",
    "difficulty": "medium",
    "question": "In the Michael-Scott (M&S) Lock-Free Queue algorithm, why is a dummy sentinel node allocated at initialization?",
    "options": [
      {
        "id": "a",
        "text": "To prevent memory garbage collection from running"
      },
      {
        "id": "b",
        "text": "To ensure that both `head` and `tail` always point to a valid node, eliminating edge cases where head and tail become null during concurrent enqueue and dequeue"
      },
      {
        "id": "c",
        "text": "To hold cryptographic hashing keys for all enqueued items"
      },
      {
        "id": "d",
        "text": "To count the number of threads waiting to acquire the queue lock"
      }
    ],
    "correctOptionId": "b",
    "explanation": "The Michael & Scott non-blocking queue uses a dummy sentinel node so that `head` and `tail` never point to `null`. This separation of concerns allows an enqueue operation (which modifies `tail->next` and `tail`) to execute concurrently with a dequeue operation (which modifies `head`) without complex locking.",
    "conceptTag": "concurrency-michael-scott-queue"
  },
  {
    "id": "q-conc-sync-31",
    "difficulty": "medium",
    "question": "In formal memory consistency models, what is the 'Happens-Before' relation?",
    "options": [
      {
        "id": "a",
        "text": "A strict partial order over memory operations defining when writes performed by one thread are guaranteed to be visible to subsequent reads in another thread"
      },
      {
        "id": "b",
        "text": "A timestamp recorded in the kernel system log when an exception occurs"
      },
      {
        "id": "c",
        "text": "The requirement that all background threads start execution before the main thread"
      },
      {
        "id": "d",
        "text": "A CPU feature that runs instructions in the exact order written in the source file"
      }
    ],
    "correctOptionId": "a",
    "explanation": "The happens-before relationship (introduced by Leslie Lamport and codified in Java/C++/Go memory models) is a formal partial ordering. If event A happens-before event B ($A \\prec B$), then the memory effects of A are guaranteed to be visible to B, and A must appear to execute before B.",
    "conceptTag": "concurrency-happens-before"
  },
  {
    "id": "q-conc-sync-32",
    "difficulty": "medium",
    "question": "Why is an Exponential Backoff strategy critical in tight, highly contended lock-free CAS retry loops?",
    "codeSnippet": "for {\n    if atomic.CompareAndSwapInt64(&state, old, new) {\n        break\n    }\n    backoff.Pause() // Why is this pause critical?\n}",
    "options": [
      {
        "id": "a",
        "text": "To prevent the operating system from terminating the process for high CPU usage"
      },
      {
        "id": "b",
        "text": "Because CAS instructions stop working if executed more than 10 times consecutively"
      },
      {
        "id": "c",
        "text": "To reduce bus contention and cache coherence traffic (MESI invalidations) caused by thousands of cores repeatedly hammering the same memory address"
      },
      {
        "id": "d",
        "text": "To allow the garbage collector to inspect the thread's stack"
      }
    ],
    "correctOptionId": "c",
    "explanation": "When hundreds of CPU cores execute CAS on the same variable simultaneously, each failed CAS invalidates the cache line on all other cores. This saturates the CPU cache-coherence bus and memory interconnect. Adding exponential backoff (or CPU `PAUSE` instructions) dampens contention, drastically improving system-wide throughput.",
    "conceptTag": "concurrency-cas-backoff"
  },
  {
    "id": "q-conc-sync-33",
    "difficulty": "medium",
    "question": "Does a system composed exclusively of 'Lock-Free' data structures guarantee the complete absence of Livelock or Thread Starvation?",
    "options": [
      {
        "id": "a",
        "text": "No; lock-free guarantees that at least one thread in the system makes progress, but individual threads may repeatedly fail CAS and suffer starvation or livelock"
      },
      {
        "id": "b",
        "text": "Yes; lock-free is mathematically equivalent to wait-free and guarantees all threads make progress in bounded steps"
      },
      {
        "id": "c",
        "text": "Yes; modern CPUs prevent livelock automatically through quantum scheduling"
      },
      {
        "id": "d",
        "text": "No; lock-free systems deadlock whenever more than 4 threads collide"
      }
    ],
    "correctOptionId": "a",
    "explanation": "By definition, 'lock-free' guarantees system-wide progress: at any point in time, at least one thread makes progress. However, it does not guarantee per-thread progress. An unlucky thread can repeatedly lose CAS races to competing threads, suffering starvation or livelock. Only 'wait-free' algorithms guarantee per-thread progress.",
    "conceptTag": "concurrency-progress-guarantees"
  },
  {
    "id": "q-conc-sync-34",
    "difficulty": "medium",
    "question": "What is the critical distinction between the `volatile` keyword in Java/C# and the `volatile` keyword in C/C++?",
    "options": [
      {
        "id": "a",
        "text": "In C/C++, `volatile` establishes full memory fences; in Java, it only affects floating point numbers"
      },
      {
        "id": "b",
        "text": "In Java/C#, `volatile` establishes atomic reads/writes and memory visibility barriers (acquire-release semantics); in C/C++, `volatile` only prevents compiler dead-code elimination and tells the compiler not to cache the variable in a register, providing NO thread synchronization or memory barriers"
      },
      {
        "id": "c",
        "text": "There is no difference; they are identical in specification and implementation"
      },
      {
        "id": "d",
        "text": "Java's `volatile` is deprecated in modern JDKs"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In C and C++, `volatile` was created for memory-mapped I/O (MMIO); it prevents the compiler from optimizing out repeated reads/writes, but emits NO hardware memory fences and provides NO thread synchronization. In contrast, Java 5+ and C# defined `volatile` with rigorous memory model semantics (acquire/release memory barriers and cross-thread visibility).",
    "conceptTag": "concurrency-volatile-semantics"
  },
  {
    "id": "q-conc-sync-35",
    "difficulty": "hard",
    "question": "In the LMAX Disruptor architecture, how does the lock-free Ring Buffer achieve millions of operations per second with ultra-low latency compared to traditional queues?",
    "options": [
      {
        "id": "a",
        "text": "By compressing messages using Snappy and writing them directly to NVMe SSDs"
      },
      {
        "id": "b",
        "text": "By spawning a separate OS kernel thread for every single microsecond event"
      },
      {
        "id": "c",
        "text": "By pre-allocating all memory in a power-of-two array, avoiding garbage collection, using sequence numbers with atomic CAS/single-writer principles, and eliminating lock contention with cache-line-padded counters"
      },
      {
        "id": "d",
        "text": "By using distributed Paxos consensus between CPU registers"
      }
    ],
    "correctOptionId": "c",
    "explanation": "The LMAX Disruptor embodies 'mechanical sympathy': it pre-allocates an array-backed ring buffer (preventing GC churn), uses power-of-two bitwise masking (`seq & (size - 1)`), adheres to the Single-Writer Principle to eliminate write-write CAS contention, and pads sequence numbers to prevent false sharing.",
    "conceptTag": "concurrency-lmax-disruptor"
  },
  {
    "id": "q-conc-sync-36",
    "difficulty": "hard",
    "question": "In the Disruptor pattern, how does a downstream Consumer (EventProcessor) verify that an event is ready to be processed without acquiring a lock on the Ring Buffer?",
    "options": [
      {
        "id": "a",
        "text": "It resets the sequence counter to zero after every read"
      },
      {
        "id": "b",
        "text": "It sends an IPC interrupt to the Linux kernel scheduler"
      },
      {
        "id": "c",
        "text": "It attempts to pop the node from the head of a linked list"
      },
      {
        "id": "d",
        "text": "It checks a SequenceBarrier that reads the gating sequence of the upstream Producer or Consumer using an atomic load with acquire semantics"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Consumers in the Disruptor coordinate via `SequenceBarrier`. A consumer queries the barrier with its desired sequence number. The barrier checks the sequence of the upstream stage (e.g. producer cursor). If the upstream sequence is $\\ge$ consumer sequence, the consumer safely processes the batch of events without any locks.",
    "conceptTag": "concurrency-disruptor-sequencing"
  },
  {
    "id": "q-conc-sync-37",
    "difficulty": "hard",
    "question": "According to Maurice Herlihy's concurrent progress hierarchy, what is the precise relationship between Wait-Free, Lock-Free, and Obstruction-Free guarantees?",
    "options": [
      {
        "id": "a",
        "text": "Lock-Free and Wait-Free are identical; Obstruction-Free applies only to single-threaded code"
      },
      {
        "id": "b",
        "text": "Wait-Free $\\subset$ Lock-Free $\\subset$ Obstruction-Free"
      },
      {
        "id": "c",
        "text": "Obstruction-Free $\\subset$ Lock-Free $\\subset$ Wait-Free (Wait-Free is the strongest guarantee)"
      },
      {
        "id": "d",
        "text": "Wait-Free allows starvation; Lock-Free guarantees bounded execution time"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Wait-Free is the strongest: every thread makes progress in a bounded number of its own steps. Lock-Free is weaker: the system as a whole makes progress (at least one thread progresses), but individual threads can starve. Obstruction-Free is the weakest: a thread makes progress in bounded steps if executed in isolation (without conflicting concurrent steps).",
    "conceptTag": "concurrency-herlihy-hierarchy"
  },
  {
    "id": "q-conc-sync-38",
    "difficulty": "hard",
    "question": "How does a 'Wait-Free' algorithm typically achieve its bounded-step guarantee for every thread under high contention?",
    "options": [
      {
        "id": "a",
        "text": "By locking the bus for all other CPU cores until the slowest thread finishes"
      },
      {
        "id": "b",
        "text": "By employing a 'Helping Scheme', where faster threads detect pending operations of slower threads and complete the work on their behalf before completing their own"
      },
      {
        "id": "c",
        "text": "By dropping requests when thread queues exceed 10 items"
      },
      {
        "id": "d",
        "text": "By converting all multi-threaded operations into sequential coroutines"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Wait-free algorithms guarantee that every thread completes its operation in a bounded number of steps regardless of other threads' speed. To prevent a slow thread from being starved by fast threads, wait-free algorithms use helping mechanisms: threads register their desired operations in an announcement array, and faster threads help finish pending operations.",
    "conceptTag": "concurrency-wait-free-helping"
  },
  {
    "id": "q-conc-sync-39",
    "difficulty": "hard",
    "question": "In the Linux Kernel, how does a Sequence Lock (Seqlock) allow readers to read data without acquiring any lock, and how do readers detect invalid/inconsistent reads?",
    "codeSnippet": "// Reader pattern:\ndo {\n    seq = read_seqbegin(&seqlock);\n    // read protected shared data\n} while (read_seqretry(&seqlock, seq));",
    "options": [
      {
        "id": "a",
        "text": "The kernel pauses all writer threads whenever a reader calls `read_seqbegin`"
      },
      {
        "id": "b",
        "text": "Readers acquire a shared read lock and increment the reader counter"
      },
      {
        "id": "c",
        "text": "Seqlocks use hardware transactional memory to abort the reader's transaction on write conflict"
      },
      {
        "id": "d",
        "text": "Writers increment a sequence counter before and after writing (counter is odd during write). Readers read the sequence counter before and after reading; if the counter was odd or changed during the read, the read is discarded and retried"
      }
    ],
    "correctOptionId": "d",
    "explanation": "A seqlock uses a 32/64-bit sequence counter initialized to an even number (e.g. 0). When a writer starts, it increments the counter to an odd number (1); when it finishes, it increments to even (2). Readers check if the initial sequence is even, read the data without locks, and verify the counter has not changed. If it changed or was odd, it retries.",
    "conceptTag": "concurrency-seqlocks"
  },
  {
    "id": "q-conc-sync-40",
    "difficulty": "hard",
    "question": "What is the primary safety constraint when reading shared data guarded by a Linux Kernel Seqlock?",
    "options": [
      {
        "id": "a",
        "text": "Protected data must not contain pointers to dynamic memory that could be freed and dereferenced, as an inconsistent read could dereference an invalid or dangling pointer, causing a kernel panic"
      },
      {
        "id": "b",
        "text": "Data cannot contain floating point values"
      },
      {
        "id": "c",
        "text": "Readers must never run on core 0"
      },
      {
        "id": "d",
        "text": "Writers cannot update data more than once per second"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Because a seqlock reader reads data concurrently with an active writer without locks, the reader can observe intermediate inconsistent states. If the reader follows a pointer that a concurrent writer is modifying or freeing, the reader could dereference an invalid pointer and crash the kernel before `read_seqretry()` can detect the conflict.",
    "conceptTag": "concurrency-seqlock-constraints"
  },
  {
    "id": "q-conc-sync-41",
    "difficulty": "hard",
    "question": "In Read-Copy-Update (RCU), what occurs during the 'Grace Period' following a data structure modification?",
    "codeSnippet": "// Kernel writer updates an RCU-protected linked list:\nnew_node = kmalloc(sizeof(*new_node), GFP_KERNEL);\n*new_node = *old_node;\nnew_node->val = 99;\nrcu_assign_pointer(list->head, new_node); // Publication\nsynchronize_rcu(); // Grace period!\nkfree(old_node);",
    "options": [
      {
        "id": "a",
        "text": "All CPU cores are rebooted sequentially to clear L1 caches"
      },
      {
        "id": "b",
        "text": "The writer blocks (or defers callback execution) until all CPU cores have passed through a 'Quiescent State' (e.g. context switch), ensuring no readers remain that hold references to `old_node`"
      },
      {
        "id": "c",
        "text": "The kernel encrypts the list nodes to prevent data races"
      },
      {
        "id": "d",
        "text": "The operating system dumps all memory to disk swap"
      }
    ],
    "correctOptionId": "b",
    "explanation": "RCU allows readers to traverse data structures without locks. When updating, the writer publishes a new copy. Readers in flight might still reference the old node. The 'grace period' is the time required for every CPU core to pass through a quiescent state (context switch / idle loop), proving no reader could possibly still be holding a reference to `old_node`.",
    "conceptTag": "concurrency-rcu-grace-period"
  },
  {
    "id": "q-conc-sync-42",
    "difficulty": "hard",
    "question": "Why does RCU provide near-zero overhead for readers compared to traditional Read-Write Mutexes?",
    "options": [
      {
        "id": "a",
        "text": "RCU readers run exclusively on dedicated GPU hardware"
      },
      {
        "id": "b",
        "text": "RCU writes data directly into the CPU instruction cache"
      },
      {
        "id": "c",
        "text": "RCU read critical sections (`rcu_read_lock()` / `rcu_read_unlock()`) require no atomic instructions, no bus-locking memory barriers, and no shared writes, compiling down to simple preemption disabling"
      },
      {
        "id": "d",
        "text": "RCU readers bypass the operating system kernel entirely via DPDK"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Traditional RWMutex readers must execute atomic increment/decrement instructions on shared reader counters, inducing cache line bouncing across cores. In non-preemptible Linux kernels, `rcu_read_lock()` and `rcu_read_unlock()` do nothing at runtime (0 CPU cycles); in preemptible kernels, they simply increment a per-thread nesting counter. No shared cache lines are written.",
    "conceptTag": "concurrency-rcu-performance"
  },
  {
    "id": "q-conc-sync-43",
    "difficulty": "hard",
    "question": "What is the primary mechanism behind Hardware Transactional Memory (such as Intel TSX / RTM)?",
    "options": [
      {
        "id": "a",
        "text": "It simulates relational database ACID transactions by writing WAL logs to the motherboard BIOS"
      },
      {
        "id": "b",
        "text": "It converts all thread memory allocations into lockless vector registers"
      },
      {
        "id": "c",
        "text": "It pauses the system clock during instruction execution to guarantee atomicity"
      },
      {
        "id": "d",
        "text": "It uses CPU L1/L2 cache coherency hardware to track memory read-sets and write-sets during execution; if no conflict occurs between `_xbegin` and `_xend`, updates commit atomically; on conflict, it rolls back to an architectural fallback path"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Hardware Transactional Memory (HTM) leverages the processor's existing cache coherence protocol (e.g. MESI) to track memory read-sets and write-sets. If another CPU core writes to a line in the transaction's read-set or writes/reads a line in its write-set, the transaction aborts, registers are restored to `_xbegin`, and the program falls back to a traditional mutex.",
    "conceptTag": "concurrency-hardware-transactional-memory"
  },
  {
    "id": "q-conc-sync-44",
    "difficulty": "hard",
    "question": "Which of the following will GUARANTEE an abort of an Intel TSX hardware transactional memory execution block?",
    "options": [
      {
        "id": "a",
        "text": "Invoking a System Call (e.g. `read`, `write`, `futex`), executing CPUID instructions, or overflowing the L1 Data Cache capacity with the transaction's write-set"
      },
      {
        "id": "b",
        "text": "Performing integer addition or bitwise shifting"
      },
      {
        "id": "c",
        "text": "Reading variables from the thread's local execution stack"
      },
      {
        "id": "d",
        "text": "Running on a multi-core processor with hyper-threading disabled"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Hardware transactions are tracked in the L1 Data cache. Any instruction that cannot be rolled back\u2014such as an operating system syscall (which alters kernel state), I/O instructions, CPUID, or memory writes exceeding the size of the L1 cache\u2014immediately causes a transaction abort (`_XABORT_EXPLICIT` or capacity abort).",
    "conceptTag": "concurrency-tsx-abort-conditions"
  },
  {
    "id": "q-conc-sync-45",
    "difficulty": "hard",
    "question": "In Go's standard library `sync.Map`, what dual-map data structure architecture enables concurrent reads without locking?",
    "codeSnippet": "type Map struct {\n    mu Mutex\n    read atomic.Value // readOnly struct holding m map[any]*entry and amended bool\n    dirty map[any]*entry\n    misses int\n}",
    "options": [
      {
        "id": "a",
        "text": "It maintains two independent B-Trees on separate heap memory segments"
      },
      {
        "id": "b",
        "text": "It writes all map updates to an append-only WAL buffer"
      },
      {
        "id": "c",
        "text": "It distributes keys across 1024 separate hash tables using consistent hashing"
      },
      {
        "id": "d",
        "text": "An atomically accessible, read-only map (`read`) that can be read concurrently without locks, paired with a mutable `dirty` map protected by a mutex for inserts; values in both maps point to the same atomic `entry` pointers"
      }
    ],
    "correctOptionId": "d",
    "explanation": "Go's `sync.Map` splits storage into a lock-free `read` map (stored in an `atomic.Value`) and a mutex-guarded `dirty` map. Read hits bypass the mutex completely. Both maps store pointers to an underlying `entry` struct, so updates to existing keys can be applied atomically via CAS without acquiring the map's mutex.",
    "conceptTag": "concurrency-golang-sync-map"
  },
  {
    "id": "q-conc-sync-46",
    "difficulty": "hard",
    "question": "In Go's `sync.Map`, what occurs when the internal `misses` counter equals the length of `dirty` map (`m.misses >= len(m.dirty)`)?",
    "options": [
      {
        "id": "a",
        "text": "All entries in the map are cleared and garbage collected"
      },
      {
        "id": "b",
        "text": "The `dirty` map is promoted to become the new `read` map, `m.dirty` is set to nil, and `m.misses` is reset to 0 under the mutex"
      },
      {
        "id": "c",
        "text": "The runtime throws a panic warning of high lock contention"
      },
      {
        "id": "d",
        "text": "The map converts itself into a standard Go `map[any]any`"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Every time a read operation misses in `read` and must acquire the mutex to check `dirty`, `m.misses` increments. Once `misses >= len(dirty)`, the amortized cost of missing in `read` outweighs keeping them separate. The `dirty` map is promoted to `read`, resetting `misses` to 0 and setting `dirty` to nil until the next insert.",
    "conceptTag": "concurrency-sync-map-promotion"
  },
  {
    "id": "q-conc-sync-47",
    "difficulty": "hard",
    "question": "What is an 'Adaptive Mutex' as implemented in modern operating system kernels and the HotSpot JVM?",
    "options": [
      {
        "id": "a",
        "text": "A hybrid lock that spins for a short duration if the lock holder is currently running on another CPU core, but immediately parks the thread via an OS system call if the lock holder is asleep or descheduled"
      },
      {
        "id": "b",
        "text": "A mutex that automatically changes its size in RAM from 8 bytes to 64 bytes under memory pressure"
      },
      {
        "id": "c",
        "text": "A lock that encrypts its internal state when transmitted over TLS"
      },
      {
        "id": "d",
        "text": "A mutex that switches from write-locking to read-locking when RAM usage reaches 80%"
      }
    ],
    "correctOptionId": "a",
    "explanation": "An adaptive mutex combines the benefits of spinlocks and blocking mutexes. If the thread currently holding the lock is executing on another CPU core, it is likely to release the lock shortly, so the waiting thread spins. If the lock holder is sleeping or descheduled, spinning wastes CPU, so the thread is parked immediately via the OS scheduler.",
    "conceptTag": "concurrency-adaptive-mutex"
  },
  {
    "id": "q-conc-sync-48",
    "difficulty": "hard",
    "question": "How does the Linux `futex` (Fast Userspace Mutex) system call optimize lock acquisition in the uncontended path?",
    "options": [
      {
        "id": "a",
        "text": "It routes all lock operations through a shared Unix domain socket"
      },
      {
        "id": "b",
        "text": "It replaces all mutexes with ring-0 kernel interrupt handlers"
      },
      {
        "id": "c",
        "text": "The uncontended acquisition and release execute entirely in user-space via atomic instructions (e.g. CAS/decrement) with zero kernel system calls; the `sys_futex()` syscall is invoked ONLY when contention occurs and a thread must sleep or be awakened"
      },
      {
        "id": "d",
        "text": "It maps the thread's CPU cache directly into kernel RAM"
      }
    ],
    "correctOptionId": "c",
    "explanation": "Futex revolutionized Linux locking: in the uncontended case, a lock is acquired and released by a simple atomic integer operation (e.g. CAS) entirely in user space (taking ~10 nanoseconds with no syscall). Only when contention is detected does the runtime make a `sys_futex(val, FUTEX_WAIT)` system call to sleep, or `FUTEX_WAKE` to wake sleeping threads.",
    "conceptTag": "concurrency-linux-futex"
  },
  {
    "id": "q-conc-sync-49",
    "difficulty": "hard",
    "question": "In Epoch-Based Memory Reclamation (EBR) for lock-free data structures, why are three epochs ($e, e-1, e-2$) required to safely reclaim retired memory?",
    "options": [
      {
        "id": "a",
        "text": "Because a thread entering epoch $e$ might hold a pointer to memory retired in epoch $e-1$; memory retired in epoch $e-2$ is guaranteed to have no active readers across all threads once all threads announce epoch $e$ or later"
      },
      {
        "id": "b",
        "text": "Because computer memory is divided into three physical NUMA zones"
      },
      {
        "id": "c",
        "text": "To allow three concurrent garbage collector threads to run in parallel"
      },
      {
        "id": "d",
        "text": "Because modern CPUs have L1, L2, and L3 caches"
      }
    ],
    "correctOptionId": "a",
    "explanation": "In EBR, threads announce their active epoch. When a node is deleted, it is placed in the retired list for the current global epoch $e$. Readers currently in epoch $e-1$ might still be traversing that node. When all active threads advance to at least epoch $e$, any memory retired two epochs prior ($e-2$) is guaranteed unreachable and can be safely freed.",
    "conceptTag": "concurrency-epoch-based-reclamation"
  },
  {
    "id": "q-conc-sync-50",
    "difficulty": "hard",
    "question": "How do Hazard Pointers enable safe memory reclamation in lock-free algorithms in unmanaged languages (C/C++) without garbage collection?",
    "options": [
      {
        "id": "a",
        "text": "By allocating memory directly in kernel space where it is immune to memory leaks"
      },
      {
        "id": "b",
        "text": "A reader thread writes the pointer of a node it is reading to a thread-local 'Hazard Pointer' slot before reading; deleting threads check all active hazard pointers and will not free any node currently referenced by any hazard pointer"
      },
      {
        "id": "c",
        "text": "By pausing all other threads using `SIGSTOP` before calling `free()`"
      },
      {
        "id": "d",
        "text": "By replacing dynamic heap pointers with static array offsets"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Hazard Pointers solve the safe memory reclamation problem without GC. Before dereferencing a node, a reader publishes the node's pointer into its dedicated, publicly visible hazard pointer slot. Reclaiming threads scan the list of published hazard pointers. If a retired node is in any hazard pointer slot, its deallocation is deferred until no hazard pointer references it.",
    "conceptTag": "concurrency-hazard-pointers"
  }
];
