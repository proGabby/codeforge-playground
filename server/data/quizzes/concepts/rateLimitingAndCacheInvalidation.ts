import type { QuizQuestion } from '../../../../src/types';

export const RATE_LIMITING_AND_CACHE_50_QUESTIONS: QuizQuestion[] = [
  {
    "id": "q-sd-rl-1",
    "difficulty": "easy",
    "question": "What is the primary operational difference between the Token Bucket algorithm and the Leaky Bucket algorithm when handling sudden bursts of incoming HTTP traffic?",
    "options": [
      {
        "id": "a",
        "text": "Token Bucket smooths traffic to a strictly constant egress rate, while Leaky Bucket allows instantaneous bursts up to capacity"
      },
      {
        "id": "b",
        "text": "Token Bucket allows instantaneous bursts of traffic up to the bucket capacity, while Leaky Bucket processes requests at a strictly constant, smoothed output rate"
      },
      {
        "id": "c",
        "text": "Token Bucket requires a relational database, whereas Leaky Bucket runs exclusively in CPU hardware registers"
      },
      {
        "id": "d",
        "text": "Token Bucket drops all requests that arrive faster than 1 millisecond, whereas Leaky Bucket queues infinite requests without memory limits"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Token Bucket accumulates tokens up to a max capacity and allows bursts as long as tokens are available, refilling at a steady rate. Leaky Bucket queues requests and leaks them out at a strictly constant rate, smoothing traffic spikes.",
    "conceptTag": "rate-limiting-algorithms"
  },
  {
    "id": "q-sd-rl-2",
    "difficulty": "easy",
    "question": "A system configures a Fixed Window Counter rate limiter allowing at most 100 requests per minute. An attacker sends 100 requests at 00:00:59 and 100 requests at 00:01:01. What critical vulnerability does this expose?",
    "codeSnippet": "// Window 1: 00:00:00 - 00:00:59 -> 100 requests sent at 00:00:59 (Allowed)\n// Window 2: 00:01:00 - 00:01:59 -> 100 requests sent at 00:01:01 (Allowed)\n// Total requests processed between 00:00:59 and 00:01:01 (2-second interval)?",
    "options": [
      {
        "id": "a",
        "text": "A memory leak occurs because Redis cannot reset integer counters at boundary boundaries"
      },
      {
        "id": "b",
        "text": "Boundary burst spike: The system processes 200 requests (2x the configured limit) within a 2-second window, potentially overwhelming backend resources"
      },
      {
        "id": "c",
        "text": "The second window automatically returns HTTP 500 Internal Server Error due to clock drift"
      },
      {
        "id": "d",
        "text": "Fixed window counters permanently ban the client IP address after two consecutive full windows"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Fixed window counters reset at fixed time boundaries. A client can send the full quota at the very end of window N and another full quota at the start of window N+1, delivering up to twice the rate limit across the rolling window.",
    "conceptTag": "rate-limiting-fixed-window"
  },
  {
    "id": "q-sd-rl-3",
    "difficulty": "easy",
    "question": "How does the Sliding Window Log rate limiting algorithm prevent the boundary burst issue of the Fixed Window Counter, and what is its main trade-off?",
    "options": [
      {
        "id": "a",
        "text": "It hashes user IP addresses into bloom filters, saving memory at the expense of false positives"
      },
      {
        "id": "b",
        "text": "It tracks the exact timestamp of every request in a sorted set; it provides precise rate limiting but consumes substantial memory storing timestamps for high-volume endpoints"
      },
      {
        "id": "c",
        "text": "It automatically scales CPU cores when traffic increases, but increases infrastructure costs"
      },
      {
        "id": "d",
        "text": "It delays all incoming HTTP requests by 60 seconds to ensure ordering, increasing latency"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Sliding Window Log stores every request timestamp (e.g., in a Redis Sorted Set ZSET) and prunes timestamps older than (now - window). It is completely accurate across any rolling interval, but storing individual timestamps consumes significant memory under high throughput.",
    "conceptTag": "rate-limiting-sliding-log"
  },
  {
    "id": "q-sd-rl-4",
    "difficulty": "easy",
    "question": "The Sliding Window Counter algorithm approximates request count over a sliding window by combining the previous window count with the current window count. Given the parameters below, what is the estimated request count at the 15-second mark of the current 60-second window?",
    "codeSnippet": "// Window size: 60 seconds\n// Requests in previous 60-second window: 80\n// Requests in current window (elapsed 15s): 30\n// Progress into current window: 15s / 60s = 25% (0.25)\n// Previous window overlap weight: 1.0 - 0.25 = 75% (0.75)",
    "options": [
      {
        "id": "a",
        "text": "110 requests"
      },
      {
        "id": "b",
        "text": "90 requests (calculated as: 80 * 0.75 + 30 = 60 + 30)"
      },
      {
        "id": "c",
        "text": "50 requests (calculated as: 80 * 0.25 + 30 = 20 + 30)"
      },
      {
        "id": "d",
        "text": "30 requests"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Sliding Window Counter estimates current sliding volume as: (previous_window_count * (1 - current_window_progress)) + current_window_count. Here: (80 * 0.75) + 30 = 60 + 30 = 90 requests.",
    "conceptTag": "rate-limiting-sliding-counter"
  },
  {
    "id": "q-sd-rl-5",
    "difficulty": "easy",
    "question": "In a microservice using the Cache-Aside (Lazy Loading) pattern with Redis and PostgreSQL, what is the exact sequence of events when a client requests a user profile on a cache miss?",
    "options": [
      {
        "id": "a",
        "text": "App queries Postgres -> Postgres triggers Redis via CDC -> Redis notifies App"
      },
      {
        "id": "b",
        "text": "App checks Redis -> Cache miss -> App queries Postgres -> App writes record to Redis with a TTL -> App returns response to client"
      },
      {
        "id": "c",
        "text": "App writes empty dummy record to Redis -> App queries Postgres -> Redis reads from Postgres in background"
      },
      {
        "id": "d",
        "text": "Redis queries Postgres directly using foreign data wrappers and returns JSON to App"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In Cache-Aside, the application code manages caching explicitly: read cache first; on miss, read from primary database, write result to cache for future reads (typically with a TTL), and return to caller.",
    "conceptTag": "caching-patterns-cache-aside"
  },
  {
    "id": "q-sd-rl-6",
    "difficulty": "easy",
    "question": "What is the primary architectural characteristic of the Write-Through caching pattern?",
    "options": [
      {
        "id": "a",
        "text": "Data is written only to cache and written to the database once a day during scheduled batch jobs"
      },
      {
        "id": "b",
        "text": "The application writes data to the cache, and the cache synchronously writes to the primary database before acknowledging success to the caller"
      },
      {
        "id": "c",
        "text": "Data bypasses the cache completely on write operations and is cached only during read operations"
      },
      {
        "id": "d",
        "text": "Writes are executed asynchronously in a background thread without waiting for database confirmation"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Write-Through caching writes synchronously to both the cache and the primary persistent datastore before returning success. This guarantees strong cache consistency and ensures data is never lost if cache restarts, though write latency is higher.",
    "conceptTag": "caching-patterns-write-through"
  },
  {
    "id": "q-sd-rl-7",
    "difficulty": "easy",
    "question": "What is the main operational risk associated with the Write-Behind (Write-Back) caching pattern in high-throughput transactional systems?",
    "options": [
      {
        "id": "a",
        "text": "Database write latency directly degrades the client HTTP response time"
      },
      {
        "id": "b",
        "text": "Potential data loss: If the cache node crashes or loses power before buffered writes are flushed to persistent storage, those unwritten updates are permanently lost"
      },
      {
        "id": "c",
        "text": "The cache can never be evicted using LRU policies"
      },
      {
        "id": "d",
        "text": "Read operations are blocked while the write-behind buffer contains any pending entries"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Write-Behind acknowledges writes immediately after updating the in-memory cache and asynchronously flushes batches to the database. If the cache crashes before flushing, uncommitted writes are lost.",
    "conceptTag": "caching-patterns-write-behind"
  },
  {
    "id": "q-sd-rl-8",
    "difficulty": "easy",
    "question": "How does the Read-Through caching pattern differ conceptually from the Cache-Aside pattern?",
    "options": [
      {
        "id": "a",
        "text": "In Read-Through, the application treats the cache as the main data store; the cache library or service itself is responsible for fetching data from the underlying database on a cache miss"
      },
      {
        "id": "b",
        "text": "Read-Through does not allow setting a TTL on cached items"
      },
      {
        "id": "c",
        "text": "Read-Through is only supported by NoSQL databases like MongoDB"
      },
      {
        "id": "d",
        "text": "In Read-Through, the database queries the cache to verify data consistency before returning SQL results"
      }
    ],
    "correctOptionId": "a",
    "explanation": "In Cache-Aside, the application is responsible for coordinating reads and writes between cache and DB. In Read-Through, the application interacts solely with the cache abstraction, which encapsulates DB loading transparently.",
    "conceptTag": "caching-patterns-read-through"
  },
  {
    "id": "q-sd-rl-9",
    "difficulty": "easy",
    "question": "Consider the following Redis command executed by a session service. What is the exact behavioral outcome of the EX and NX arguments?",
    "codeSnippet": "redis.set(\"session:usr_9812\", sessionData, \"EX\", 3600, \"NX\");",
    "options": [
      {
        "id": "a",
        "text": "Sets the key with a 3600-millisecond TTL, overwriting any existing key unconditionally"
      },
      {
        "id": "b",
        "text": "Sets the key only if it does NOT already exist (NX), and assigns an expiration time of 3600 seconds (EX)"
      },
      {
        "id": "c",
        "text": "Sets the key only if it already exists (NX), and assigns an expiration time of 3600 seconds (EX)"
      },
      {
        "id": "d",
        "text": "Creates a non-expiring key and notifies replicas across 3600 shards"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In Redis SET syntax: EX specifies expiration in seconds (3600s = 1 hour), and NX specifies \"only set the key if it does not already exist\". This atomic operation is frequently used for session creation and basic distributed locks.",
    "conceptTag": "redis-primitives-ttl"
  },
  {
    "id": "q-sd-rl-10",
    "difficulty": "easy",
    "question": "Which HTTP status code is specified by RFC 6585 to indicate that a client has exceeded their allotted request quota within a given time period?",
    "options": [
      {
        "id": "a",
        "text": "403 Forbidden"
      },
      {
        "id": "b",
        "text": "429 Too Many Requests"
      },
      {
        "id": "c",
        "text": "503 Service Unavailable"
      },
      {
        "id": "d",
        "text": "408 Request Timeout"
      }
    ],
    "correctOptionId": "b",
    "explanation": "RFC 6585 Section 4 defines 429 Too Many Requests to indicate that the user has sent too many requests in a given amount of time (\"rate limiting\"). 503 indicates server overload, and 403 indicates permission denial.",
    "conceptTag": "http-status-rate-limiting"
  },
  {
    "id": "q-sd-rl-11",
    "difficulty": "easy",
    "question": "When an API server responds with HTTP 429 Too Many Requests, which HTTP header should it return to inform the client exactly how long to wait before sending another request?",
    "codeSnippet": "HTTP/1.1 429 Too Many Requests\nContent-Type: application/json\nRetry-After: 60\n\n{ \"error\": \"Quota exceeded. Try again in 60 seconds.\" }",
    "options": [
      {
        "id": "a",
        "text": "X-Rate-Limit-Timeout"
      },
      {
        "id": "b",
        "text": "Retry-After"
      },
      {
        "id": "c",
        "text": "X-Wait-Time"
      },
      {
        "id": "d",
        "text": "Cache-Control: max-age"
      }
    ],
    "correctOptionId": "b",
    "explanation": "The Retry-After HTTP header (RFC 7231 / RFC 6585) indicates how long the client ought to wait before making a follow-up request, either as an integer number of seconds (e.g. Retry-After: 60) or as an HTTP-date.",
    "conceptTag": "http-headers-rate-limiting"
  },
  {
    "id": "q-sd-rl-12",
    "difficulty": "easy",
    "question": "An API Gateway returns rate limit information to clients. According to IETF standard draft specifications for rate limiting headers, what do the RateLimit-Limit, RateLimit-Remaining, and RateLimit-Reset headers convey?",
    "options": [
      {
        "id": "a",
        "text": "Maximum network bandwidth in megabytes, remaining bandwidth, and router reset time"
      },
      {
        "id": "b",
        "text": "Total allowed quota in the window, number of requests remaining in the current window, and time in seconds until the quota resets"
      },
      {
        "id": "c",
        "text": "Server CPU percentage limit, current CPU load, and server reboot timestamp"
      },
      {
        "id": "d",
        "text": "Database connection pool max limit, idle connections, and connection timeout in milliseconds"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Standard rate-limiting headers inform clients of their current consumption: RateLimit-Limit (quota ceiling), RateLimit-Remaining (unused quota), and RateLimit-Reset (seconds or timestamp until quota replenishment).",
    "conceptTag": "http-headers-rate-limiting"
  },
  {
    "id": "q-sd-rl-13",
    "difficulty": "easy",
    "question": "Why should client applications implement exponential backoff with \"jitter\" (randomized delay) rather than fixed-interval retries when encountering HTTP 429 responses?",
    "options": [
      {
        "id": "a",
        "text": "Jitter encrypts the retry request body to prevent man-in-the-middle tampering"
      },
      {
        "id": "b",
        "text": "Fixed-interval retries cause all throttled clients to retry simultaneously in synchronized waves, creating cyclic thundering herds that repeatedly re-saturate the server"
      },
      {
        "id": "c",
        "text": "HTTP 429 status codes are dropped by intermediate proxies unless jitter is present"
      },
      {
        "id": "d",
        "text": "Exponential backoff reduces the size of TLS packets sent across the wire"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Without jitter, multiple clients throttled at the same time will retry at identical intervals, causing synchronized retry spikes (thundering herds). Adding randomized jitter decorrelates retry requests across clients.",
    "conceptTag": "client-rate-limiting-backoff"
  },
  {
    "id": "q-sd-rl-14",
    "difficulty": "easy",
    "question": "How does Redis handle key expiration under the hood when keys are configured with a Time-To-Live (TTL)?",
    "options": [
      {
        "id": "a",
        "text": "Redis spawns an operating system thread for every single key with a TTL that sleeps until expiration"
      },
      {
        "id": "b",
        "text": "Redis uses a dual approach: passive expiration (deleting expired keys when accessed by a command) and active expiration (periodically sampling random keys with TTL and deleting expired ones)"
      },
      {
        "id": "c",
        "text": "Redis flushes all memory to disk whenever any single key expires"
      },
      {
        "id": "d",
        "text": "Keys with a TTL are sent to a separate RabbitMQ dead letter exchange upon expiration"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Redis relies on passive expiration (key is tested when read; if expired, it is deleted) and active expiration (a periodic background task samples 20 keys with TTL 10 times per second, deleting expired keys to free memory without stalling reads).",
    "conceptTag": "redis-expiration-mechanics"
  },
  {
    "id": "q-sd-rl-15",
    "difficulty": "easy",
    "question": "A Redis cache reaches its maxmemory ceiling. Which eviction policy removes keys by discarding keys that have not been accessed for the longest time across ALL keys, regardless of whether a TTL was set?",
    "options": [
      {
        "id": "a",
        "text": "volatile-lru"
      },
      {
        "id": "b",
        "text": "allkeys-lru"
      },
      {
        "id": "c",
        "text": "volatile-random"
      },
      {
        "id": "d",
        "text": "noeviction"
      }
    ],
    "correctOptionId": "b",
    "explanation": "allkeys-lru evicts the least recently used (LRU) keys out of all keys in the database. volatile-lru only evicts LRU keys among those that have an expire (TTL) set. noeviction returns errors on writes when memory is full.",
    "conceptTag": "redis-eviction-policies"
  },
  {
    "id": "q-sd-rl-16",
    "difficulty": "easy",
    "question": "An engineer monitors a distributed cache cluster. Over 1 hour, the cache receives 850,000 successful GET requests that return cached data, and 150,000 requests that result in cache misses. What is the cache hit ratio?",
    "codeSnippet": "// Hits = 850,000\n// Misses = 150,000\n// Total Requests = Hits + Misses = 1,000,000\n// Hit Ratio Formula = (Hits / Total Requests) * 100%",
    "options": [
      {
        "id": "a",
        "text": "15.0%"
      },
      {
        "id": "b",
        "text": "85.0%"
      },
      {
        "id": "c",
        "text": "56.6%"
      },
      {
        "id": "d",
        "text": "95.0%"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Cache hit ratio is calculated as Hits / (Hits + Misses). Here: 850,000 / 1,000,000 = 0.85, or 85.0%. A high cache hit ratio (typically >85-95%) indicates the cache is effectively shielding the database from load.",
    "conceptTag": "caching-metrics-hit-ratio"
  },
  {
    "id": "q-sd-rl-17",
    "difficulty": "easy",
    "question": "Following a blue-green deployment of a major service revision, the new cache cluster starts with empty memory (cold cache). What is the recommended strategy to avoid overwhelming the primary database immediately upon routing user traffic?",
    "options": [
      {
        "id": "a",
        "text": "Disable database indexes during deployment"
      },
      {
        "id": "b",
        "text": "Cache warming (pre-populating top queried keys into the cache before redirecting production traffic to the new instances)"
      },
      {
        "id": "c",
        "text": "Increase the HTTP client timeout to 5 minutes"
      },
      {
        "id": "d",
        "text": "Set all cache TTL values to 0 seconds"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Cache warming pre-loads high-frequency records (top products, active user sessions, catalog metadata) into the newly initialized cache before traffic is switched over. This prevents a thundering herd from overwhelming the primary database.",
    "conceptTag": "caching-patterns-cache-warming"
  },
  {
    "id": "q-sd-rl-18",
    "difficulty": "medium",
    "question": "How is a precise Sliding Window Log rate limiter implemented in Redis using a Sorted Set (ZSET)?",
    "codeSnippet": "// Redis key: rate_limit:user_42\n// Current timestamp in ms: now = 1700000005000\n// Window size: 60,000 ms; Limit: 100 req\nMULTI\nZREMRANGEBYSCORE rate_limit:user_42 0 (now - 60000)\nZADD rate_limit:user_42 now now\nZCARD rate_limit:user_42\nEXPIRE rate_limit:user_42 60\nEXEC",
    "options": [
      {
        "id": "a",
        "text": "It removes elements newer than now, adds the user IP, and returns remaining memory"
      },
      {
        "id": "b",
        "text": "It atomically removes timestamps older than the sliding window, inserts the current timestamp as score and member, counts remaining entries (ZCARD), and allows the request if ZCARD <= limit"
      },
      {
        "id": "c",
        "text": "It converts the sorted set into a Redis HyperLogLog to estimate cardinality with 1% error"
      },
      {
        "id": "d",
        "text": "It executes in O(1) time regardless of the number of requests in the window"
      }
    ],
    "correctOptionId": "b",
    "explanation": "By storing request timestamps as scores in a ZSET, ZREMRANGEBYSCORE purges entries outside the current window. ZADD records the current request, and ZCARD counts requests in the rolling window. If ZCARD <= limit, the request proceeds.",
    "conceptTag": "rate-limiting-redis-zset"
  },
  {
    "id": "q-sd-rl-19",
    "difficulty": "medium",
    "question": "An engineer implements rate limiting in Node.js by issuing separate Redis calls: \"val = await redis.get(key)\", checking if val < limit, and then calling \"await redis.incr(key)\". Why is this vulnerable under high concurrency?",
    "options": [
      {
        "id": "a",
        "text": "Redis does not support integer increments on strings"
      },
      {
        "id": "b",
        "text": "Race condition (Check-Then-Act): Multiple concurrent requests read the same counter value before any has incremented it, allowing bursts far beyond the configured quota"
      },
      {
        "id": "c",
        "text": "Node.js event loop blocks indefinitely whenever two await statements run in series"
      },
      {
        "id": "d",
        "text": "Redis automatically converts strings to hashes when get is called concurrently"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A non-atomic Check-Then-Act sequence causes race conditions: N concurrent workers all read count = 99 simultaneously, all verify 99 < 100, and all proceed to increment and pass through, allowing 99 + N requests. Using atomic Lua scripts or single INCR commands prevents this.",
    "conceptTag": "concurrency-race-conditions"
  },
  {
    "id": "q-sd-rl-20",
    "difficulty": "medium",
    "question": "When acquiring a distributed lock in Redis for a single instance using \"SET resource_id token NX PX 30000\", what is the critical purpose of storing a unique random token (e.g. UUID) as the value, and how must the lock be released?",
    "codeSnippet": "// Releasing the lock safely:\nif redis.call(\"get\", KEYS[1]) == ARGV[1] then\n    return redis.call(\"del\", KEYS[1])\nelse\n    return 0\nend",
    "options": [
      {
        "id": "a",
        "text": "The token enables Redis to compress the key using snappy compression"
      },
      {
        "id": "b",
        "text": "It prevents client A from accidentally releasing a lock held by client B if client A's lock expired while client A was still executing a slow operation"
      },
      {
        "id": "c",
        "text": "It notifies all pub/sub listeners that client A has finished executing"
      },
      {
        "id": "d",
        "text": "It converts the lock from an exclusive lock into a shared read-write lock"
      }
    ],
    "correctOptionId": "b",
    "explanation": "If client A takes 35s to execute, its 30s lock expires. Client B then acquires the lock. If client A blindly called DEL, it would delete Client B's lock! Checking the unique token in an atomic Lua script ensures a client only deletes its own lock.",
    "conceptTag": "redis-distributed-locks"
  },
  {
    "id": "q-sd-rl-21",
    "difficulty": "medium",
    "question": "The Redlock algorithm proposes distributed locking across N independent Redis master nodes (typically N = 5). How does a client determine that it has successfully acquired the lock?",
    "options": [
      {
        "id": "a",
        "text": "It must acquire the lock on 100% of all master nodes without exception"
      },
      {
        "id": "b",
        "text": "It must acquire the lock on a majority of nodes (at least N/2 + 1, e.g. 3 of 5) and the total elapsed time to acquire must be less than the lock validity time"
      },
      {
        "id": "c",
        "text": "It only needs to acquire the lock on the master node with the lowest network latency"
      },
      {
        "id": "d",
        "text": "It uses ZooKeeper leader election to elect which Redis node stores the lock key"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Redlock requires acquiring the lock on a quorum (majority, N/2 + 1) of independent Redis master instances within a small time window. The lock is valid only for the initial TTL minus the elapsed acquisition time and clock drift factor.",
    "conceptTag": "distributed-locks-redlock"
  },
  {
    "id": "q-sd-rl-22",
    "difficulty": "medium",
    "question": "In a Cache-Aside architecture, consider this concurrent interleaving between Reader (Process 1) and Writer (Process 2). What anomaly occurs?",
    "codeSnippet": "// 1. Process 1 (Reader) queries Cache -> Miss\n// 2. Process 1 queries DB -> gets old value X\n// 3. Process 2 (Writer) updates DB to value Y\n// 4. Process 2 invalidates (deletes) Cache key\n// 5. Process 1 writes old value X into Cache!",
    "options": [
      {
        "id": "a",
        "text": "The database transaction automatically rolls back due to a phantom read"
      },
      {
        "id": "b",
        "text": "Stale cache state: The cache contains stale value X indefinitely (or until TTL expires), even though the database permanently holds updated value Y"
      },
      {
        "id": "c",
        "text": "Redis terminates the TCP socket for Process 1"
      },
      {
        "id": "d",
        "text": "Process 2 encounters a deadlock on the Redis replication stream"
      }
    ],
    "correctOptionId": "b",
    "explanation": "This classic race condition occurs if a slow reader reads old DB data, gets preempted while a writer updates DB and evicts cache, and then the slow reader writes its stale read into cache. Setting reasonable TTLs or using cache-versioning / delayed invalidation mitigates this.",
    "conceptTag": "caching-race-conditions"
  },
  {
    "id": "q-sd-rl-23",
    "difficulty": "medium",
    "question": "When a popular cached item expires, hundreds of concurrent application threads simultaneously experience a cache miss and execute the exact same expensive database query. Which design pattern mitigates this \"Cache Stampede\" by collapsing duplicate in-flight requests into a single execution?",
    "codeSnippet": "// Go implementation using singleflight:\nvar g singleflight.Group\nv, err, shared := g.Do(cacheKey, func() (interface{}, error) {\n    return fetchFromDatabase(cacheKey)\n})",
    "options": [
      {
        "id": "a",
        "text": "Circuit Breaker"
      },
      {
        "id": "b",
        "text": "Singleflight / Mutex Locking (Request Coalescing)"
      },
      {
        "id": "c",
        "text": "Ambassador Pattern"
      },
      {
        "id": "d",
        "text": "Sidecar Pattern"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Singleflight (request coalescing / mutex locking) ensures that only one worker thread executes the downstream database fetch for a given key at any instant. All other concurrent threads await the result of the single in-flight call and share its returned value.",
    "conceptTag": "caching-cache-stampede"
  },
  {
    "id": "q-sd-rl-24",
    "difficulty": "medium",
    "question": "The XFetch algorithm uses probabilistic early expiration to prevent cache stampedes without requiring distributed mutexes. When is the background recomputation triggered for a key with remaining TTL and computation time delta?",
    "codeSnippet": "// XFetch decision rule:\n// delta = time taken to compute value\n// beta = aggressiveness parameter (> 0)\n// rand() = uniform random float in (0, 1]\n// remainingTTL = key_expiration_time - current_time\n// Condition: -(delta * beta * ln(rand())) > remainingTTL",
    "options": [
      {
        "id": "a",
        "text": "Only when remainingTTL reaches exactly 0"
      },
      {
        "id": "b",
        "text": "Probabilistically before the key expires: as remaining TTL shrinks or computation delta increases, the probability of an incoming request triggering background recomputation approaches 100%"
      },
      {
        "id": "c",
        "text": "Whenever the Redis memory usage exceeds 90%"
      },
      {
        "id": "d",
        "text": "Every 5 seconds on a cron job regardless of user requests"
      }
    ],
    "correctOptionId": "b",
    "explanation": "XFetch introduces optimal probabilistic early recomputation. The closer the key is to expiration (and the more expensive delta is to compute), the higher the probability that a random read request will preemptively refresh the cache before it expires.",
    "conceptTag": "caching-xfetch-probabilistic"
  },
  {
    "id": "q-sd-rl-25",
    "difficulty": "medium",
    "question": "Modern CDNs (e.g. Cloudflare, Fastly) provide Surrogate-Keys (or Cache-Tags). How does an e-commerce platform utilize this pattern to invalidate all cached pages containing a specific product when its price changes?",
    "codeSnippet": "// HTTP Response from Origin Server:\nHTTP/1.1 200 OK\nCache-Control: public, max-age=86400\nSurrogate-Key: product-9401 category-electronics brand-sony\n\n{ \"id\": 9401, \"name\": \"Wireless Headphones\", \"price\": 199.99 }",
    "options": [
      {
        "id": "a",
        "text": "The origin must iterate over and purge every individual URL that references product 9401 one by one"
      },
      {
        "id": "b",
        "text": "The origin issues a single API call to purge tag \"product-9401\", and the CDN instantly purges all cached URLs that were tagged with that surrogate key"
      },
      {
        "id": "c",
        "text": "The CDN runs a full-table scan on its edge SSDs searching for matching JSON price fields"
      },
      {
        "id": "d",
        "text": "The surrogate key automatically sends Webhook events directly to the user's mobile browser"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Surrogate-Keys (Cache-Tags) tag cached HTTP responses with logical identifiers. When product 9401 updates, the origin calls the CDN purge API with key \"product-9401\", instantly invalidating product pages, catalog pages, and search pages tagged with it.",
    "conceptTag": "cdn-cache-tags-invalidation"
  },
  {
    "id": "q-sd-rl-26",
    "difficulty": "medium",
    "question": "What is the operational difference between a \"Hard Purge\" and a \"Soft Purge\" (Stale-While-Revalidate) in a CDN or reverse proxy?",
    "options": [
      {
        "id": "a",
        "text": "Hard purge deletes files from disk; soft purge deletes files from RAM only"
      },
      {
        "id": "b",
        "text": "Hard purge instantly deletes the cached object, forcing subsequent client requests to wait for origin re-fetch; Soft purge marks the object as stale, serving the stale copy immediately while revalidating with origin asynchronously in the background"
      },
      {
        "id": "c",
        "text": "Hard purge requires shutting down the CDN edge node"
      },
      {
        "id": "d",
        "text": "Soft purge only works on JPEG images, while hard purge works on HTML and JSON"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A hard purge evicts the cached entry immediately; subsequent requests block on the origin server. A soft purge marks the object as stale: the edge serves the stale version to clients with zero added latency (stale-while-revalidate) while fetching fresh content in the background.",
    "conceptTag": "cdn-soft-purge-revalidate"
  },
  {
    "id": "q-sd-rl-27",
    "difficulty": "medium",
    "question": "In a Write-Behind architecture using a message broker (RabbitMQ or Apache Kafka) between the cache and the primary database, how should worker consumers handle database backpressure or temporary unavailability?",
    "codeSnippet": "// Ingress: API writes to Redis -> publishes \"OrderUpdated\" event to Kafka\n// Worker Consumer: Reads from Kafka -> batches writes into PostgreSQL",
    "options": [
      {
        "id": "a",
        "text": "Consumers should acknowledge Kafka offsets immediately and discard messages in memory"
      },
      {
        "id": "b",
        "text": "Consumers should pause fetching (or slow down consumption), buffer batches in memory up to a bounded limit, and retry with exponential backoff before committing offsets"
      },
      {
        "id": "c",
        "text": "Consumers should immediately drop the PostgreSQL database tables and recreate them"
      },
      {
        "id": "d",
        "text": "Consumers should write updates directly back into Redis indefinitely"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Because Kafka retains uncommitted messages on broker disk, consumers can handle database backpressure by throttling poll requests, batching writes, and retrying transient DB errors before committing message offsets, preserving durability.",
    "conceptTag": "write-behind-queues-backpressure"
  },
  {
    "id": "q-sd-rl-28",
    "difficulty": "medium",
    "question": "A critical Redis caching cluster experiences a network partition and begins timing out. If the application service implements a Circuit Breaker pattern on the cache client, what is the trade-off between \"failing open\" vs \"failing closed\"?",
    "options": [
      {
        "id": "a",
        "text": "Failing open returns HTTP 500; failing closed returns HTTP 200"
      },
      {
        "id": "b",
        "text": "Failing open routes read requests directly to the primary database (risking DB collapse under load); failing closed returns an error or degraded empty response (protecting the DB at the expense of user experience)"
      },
      {
        "id": "c",
        "text": "Failing open encrypts the database connection; failing closed opens an unencrypted socket"
      },
      {
        "id": "d",
        "text": "Failing open enables Redis replication; failing closed disables Redis replication"
      }
    ],
    "correctOptionId": "b",
    "explanation": "When the cache fails: failing open bypasses the cache and directs all read traffic to the primary DB, which frequently causes a cascading database crash. Failing closed rejects requests or serves degraded responses, shielding the database.",
    "conceptTag": "circuit-breaker-cache-resilience"
  },
  {
    "id": "q-sd-rl-29",
    "difficulty": "medium",
    "question": "An attacker submits millions of requests for randomized non-existent user IDs (e.g. GET /users/invalid-uuid-99999). Every request misses the cache and hits PostgreSQL with a full index scan. Which caching technique defends against this \"Cache Penetration\" attack?",
    "options": [
      {
        "id": "a",
        "text": "Write-Through Caching"
      },
      {
        "id": "b",
        "text": "Negative Caching (caching null/empty results for non-existent keys with a short TTL) or a pre-cache Bloom filter"
      },
      {
        "id": "c",
        "text": "Disabling TCP Keep-Alive on the database server"
      },
      {
        "id": "d",
        "text": "Switching PostgreSQL storage engine from InnoDB to MyISAM"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Cache Penetration occurs when queries for non-existent entities bypass the cache and repeatedly hammer the database. Negative caching stores a sentinel/null value with a short TTL (e.g. 30-60s), ensuring subsequent requests for that missing ID hit the cache.",
    "conceptTag": "caching-penetration-negative-caching"
  },
  {
    "id": "q-sd-rl-30",
    "difficulty": "medium",
    "question": "In a distributed Sliding Window Counter rate limiter implemented with Redis Hashes, how is the effective request rate calculated efficiently in O(1) time without logging every timestamp?",
    "codeSnippet": "// Key: rate:user_12:minute\n// Hash field \"2026-11-23 20:14\" -> count: 40\n// Hash field \"2026-11-23 20:15\" -> count: 20\n// Current time: 20:15:30 (30 seconds into current minute = 50% elapsed)",
    "options": [
      {
        "id": "a",
        "text": "Rate = 40 + 20 = 60 requests"
      },
      {
        "id": "b",
        "text": "Rate = (40 * (1 - 0.50)) + 20 = 20 + 20 = 40 requests"
      },
      {
        "id": "c",
        "text": "Rate = (40 / 20) * 100 = 200 requests"
      },
      {
        "id": "d",
        "text": "Rate = 20 * 0.50 = 10 requests"
      }
    ],
    "correctOptionId": "b",
    "explanation": "The distributed sliding window counter weights the previous window by the remaining proportion of the current window: previous_count * (1 - elapsed_fraction) + current_count. Here: (40 * 0.5) + 20 = 40.",
    "conceptTag": "rate-limiting-distributed-counter"
  },
  {
    "id": "q-sd-rl-31",
    "difficulty": "medium",
    "question": "An enterprise API Gateway implements tiered rate limiting. In what order should rate limiting checks typically be evaluated to protect gateway resources while enforcing tenant contracts?",
    "options": [
      {
        "id": "a",
        "text": "Database query rate -> Tenant subscription tier -> Global IP DDoS limit"
      },
      {
        "id": "b",
        "text": "Global / Perimeter IP rate limiting (DDoS defense) -> Tenant / API-Key quota (billing tiers) -> Sensitive endpoint rate limiting (e.g., /auth/login or /payments)"
      },
      {
        "id": "c",
        "text": "Endpoint rate limit -> Service mesh sidecar -> Perimeter IP"
      },
      {
        "id": "d",
        "text": "Tiered rate limiting must only be enforced inside the browser client"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Defenses are structured in layers: First, edge/IP rate limiting drops brute-force floods before authentication. Second, API-key/token limits enforce contractual quotas. Finally, fine-grained endpoint limits protect expensive or vulnerable endpoints.",
    "conceptTag": "api-gateway-rate-limiting"
  },
  {
    "id": "q-sd-rl-32",
    "difficulty": "medium",
    "question": "When implementing a Token Bucket rate limiter in Redis using a Hash, which two fields must be stored and updated atomically for each client identifier?",
    "codeSnippet": "// HGETALL rate_limit:tenant_abc\n// Field 1: tokens (current float or integer count of available tokens)\n// Field 2: last_refill_timestamp (millisecond timestamp when tokens were last computed)",
    "options": [
      {
        "id": "a",
        "text": "client_ip and browser_user_agent"
      },
      {
        "id": "b",
        "text": "tokens (available token balance) and last_refill_timestamp (timestamp of last replenishment calculation)"
      },
      {
        "id": "c",
        "text": "jwt_signature and public_key_pem"
      },
      {
        "id": "d",
        "text": "redis_slave_ip and replication_offset"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A lazy-refill Token Bucket stores the remaining token count and the timestamp of the last update. On each request, an atomic Lua script calculates tokens_to_add = (now - last_refill) * refill_rate, caps at bucket_capacity, decrements if tokens >= 1, and updates both fields.",
    "conceptTag": "rate-limiting-token-bucket-hash"
  },
  {
    "id": "q-sd-rl-33",
    "difficulty": "medium",
    "question": "In a Redis Cluster consisting of 6 nodes (3 masters, 3 replicas), why does running a multi-key Lua script or MGET command fail with a \"CROSSSLOT Keys in request don't hash to the same slot\" error, and how is it resolved?",
    "codeSnippet": "// Problematic: redis.mget(\"user:101:profile\", \"user:101:orders\")\n// Resolved: redis.mget(\"{user:101}:profile\", \"{user:101}:orders\")",
    "options": [
      {
        "id": "a",
        "text": "Redis Cluster prohibits MGET entirely; only single GET commands are allowed"
      },
      {
        "id": "b",
        "text": "Redis Cluster assigns keys to 16,384 hash slots based on CRC16(key). Keys with different strings hash to different cluster nodes. Using Redis Hash Tags ({...}) forces Redis to hash only the text inside braces, guaranteeing both keys map to the same hash slot"
      },
      {
        "id": "c",
        "text": "The replica nodes must be promoted to master nodes before running multi-key commands"
      },
      {
        "id": "d",
        "text": "CROSSSLOT errors indicate that the Redis server has run out of physical disk space"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Redis Cluster shards keys across 16,384 slots via CRC16(key) % 16384. Multi-key commands or transactions must operate on keys residing in the same hash slot. Wrapping the common entity identifier in curly braces {user:101} ensures identical slot hashing.",
    "conceptTag": "redis-cluster-hash-tags"
  },
  {
    "id": "q-sd-rl-34",
    "difficulty": "medium",
    "question": "In system reliability engineering, how are \"Throttling\", \"Rate Limiting\", and \"Load Shedding\" differentiated from each other?",
    "options": [
      {
        "id": "a",
        "text": "They are identical terms for HTTP 429 errors"
      },
      {
        "id": "b",
        "text": "Rate Limiting restricts requests per client quota (e.g. 100 req/min); Throttling delays or shapes traffic rates to match downstream processing capacity; Load Shedding rejects incoming work when the server itself is critically overloaded to preserve system stability"
      },
      {
        "id": "c",
        "text": "Load shedding only applies to database queries, while throttling only applies to DNS lookups"
      },
      {
        "id": "d",
        "text": "Rate limiting is implemented by clients, throttling by DNS, and load shedding by routers"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Rate limiting protects APIs by capping requests per identity over a time window. Throttling regulates or delays flow rate to prevent saturation. Load shedding is an internal survival mechanism where a server rejects low-priority traffic when its own CPU/memory is saturated.",
    "conceptTag": "reliability-rate-limiting-load-shedding"
  },
  {
    "id": "q-sd-rl-35",
    "difficulty": "hard",
    "question": "In an ultra-low-latency High-Frequency Trading (HFT) gateway handling millions of orders per second, why is floating-point arithmetic avoided in Token Bucket implementations, and how is microsecond token replenishment achieved with lock-free atomics?",
    "codeSnippet": "// Integer arithmetic token bucket:\n// Capacity = 1000 tokens (scaled by 1,000,000 to fixed-point integer)\n// Refill rate = 50,000 tokens/sec = 50 tokens / millisecond = 0.05 tokens / microsecond\n// State: atomic<uint64_t> packed_state (bits 0-31: tokens, bits 32-63: timestamp_micros)",
    "options": [
      {
        "id": "a",
        "text": "Floating point numbers take 100 milliseconds per instruction on x86_64 processors"
      },
      {
        "id": "b",
        "text": "IEEE 754 floating-point operations introduce non-deterministic rounding errors and prevent single-word atomic Compare-And-Swap (CAS) instructions; packing fixed-point integer tokens and microsecond timestamps into a 64-bit word enables lock-free CAS updates"
      },
      {
        "id": "c",
        "text": "Trading exchanges reject fix protocol messages if timestamps contain decimals"
      },
      {
        "id": "d",
        "text": "Operating systems throw SIGSEGV when floating point arithmetic is used in multithreaded code"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In microsecond-critical gateways, lock-free concurrency avoids mutex contention. Packing fixed-point integer token units and integer timestamps into an atomic 64-bit or 128-bit register allows updating bucket state via a single atomic compare_exchange loop without floating-point overhead.",
    "conceptTag": "rate-limiting-hft-lock-free"
  },
  {
    "id": "q-sd-rl-36",
    "difficulty": "hard",
    "question": "The Generic Cell Rate Algorithm (GCRA), also known as the Virtual Scheduling algorithm, is used in telecommunications and high-performance rate limiters. Given Theoretical Arrival Time (TAT), Limit L (burst tolerance), and Increment I (emission interval), how does GCRA decide whether a cell arriving at time \"t\" conforms or non-conforms?",
    "codeSnippet": "// Let t = current arrival timestamp\n// TAT = Theoretical Arrival Time of next cell\nif (t < TAT - L) {\n    // Cell arrives too early beyond burst tolerance\n    return NON_CONFORMING; // Reject / 429\n} else {\n    TAT = max(t, TAT) + I;\n    return CONFORMING;     // Allow\n}",
    "options": [
      {
        "id": "a",
        "text": "If t < TAT - L, the packet conforms; otherwise it non-conforms"
      },
      {
        "id": "b",
        "text": "If t < TAT - L, the cell arrives earlier than the burst tolerance window allows and is rejected (non-conforming); otherwise it is accepted and TAT is set to max(t, TAT) + I"
      },
      {
        "id": "c",
        "text": "GCRA requires maintaining an internal FIFO queue of all past packet payloads"
      },
      {
        "id": "d",
        "text": "GCRA only evaluates whether the packet checksum matches the SHA256 of the timestamp"
      }
    ],
    "correctOptionId": "b",
    "explanation": "GCRA tracks rate limiting using a single scalar variable (TAT). If an arrival happens earlier than TAT - L, the burst limit is exceeded and the request is rejected. Otherwise, it is admitted and TAT is pushed forward by increment I.",
    "conceptTag": "rate-limiting-gcra-algorithm"
  },
  {
    "id": "q-sd-rl-37",
    "difficulty": "hard",
    "question": "A financial platform uses a Memcached cluster with consistent hashing (Ketama). A master Memcached node crashes. What specific failure cascade occurs if client connection pools are not configured with a circuit breaker and dead-node timeouts?",
    "options": [
      {
        "id": "a",
        "text": "Memcached keys are automatically written to SQLite on the client machines"
      },
      {
        "id": "b",
        "text": "Thundering herd on primary databases: All keys mapped to the failed node result in immediate cache misses, routing massive concurrent traffic spikes to the backend database while TCP connection attempts to the dead node hang until OS timeout"
      },
      {
        "id": "c",
        "text": "Consistent hashing guarantees zero cache misses when a node crashes"
      },
      {
        "id": "d",
        "text": "The remaining Memcached nodes automatically elect a Raft leader within 50 milliseconds"
      }
    ],
    "correctOptionId": "b",
    "explanation": "When a Memcached node fails, all keys hashed to that node miss immediately, hammering the backend database. Furthermore, if client connection pools don't mark the dead node offline quickly, threads block on TCP connect timeouts, exhausting application thread pools.",
    "conceptTag": "caching-memcached-node-failure"
  },
  {
    "id": "q-sd-rl-38",
    "difficulty": "hard",
    "question": "An architecture team replaces application-level cache invalidation with Change Data Capture (CDC) using Debezium and Apache Kafka. How does this architecture guarantee that Redis cache entries are reliably invalidated without dual-write inconsistencies?",
    "codeSnippet": "// Architecture:\n// App -> SQL UPDATE -> PostgreSQL Write-Ahead Log (WAL)\n// PostgreSQL WAL -> Debezium Connector -> Kafka Topic: \"db.inventory\"\n// Invalidator Service (Kafka Consumer Group) -> REDIS DEL \"inventory:sku_901\"",
    "options": [
      {
        "id": "a",
        "text": "Debezium runs distributed 2-Phase Commit (2PC) transactions across PostgreSQL and Redis"
      },
      {
        "id": "b",
        "text": "Decoupled, event-driven invalidation: PostgreSQL commits the change to its WAL as the single source of truth; Debezium streams committed WAL changes to Kafka, and consumers invalidate Redis keys with at-least-once delivery guarantees"
      },
      {
        "id": "c",
        "text": "Kafka writes directly into Redis memory without consumer services"
      },
      {
        "id": "d",
        "text": "PostgreSQL disables WAL writing when Redis latency spikes above 10ms"
      }
    ],
    "correctOptionId": "b",
    "explanation": "CDC tails the PostgreSQL WAL, meaning invalidation events are produced only for transactions that successfully committed. This eliminates dual-write bugs (e.g. app evicts cache but DB transaction rolls back, or app updates DB but crashes before evicting cache).",
    "conceptTag": "caching-cdc-debezium-invalidation"
  },
  {
    "id": "q-sd-rl-39",
    "difficulty": "hard",
    "question": "In a multi-tier caching system with an L1 in-memory cache (e.g. Caffeine inside Java process) and an L2 shared cache (Redis cluster), what is the correct read and write path to maintain consistency and prevent stale local state?",
    "codeSnippet": "// Read Flow: Check L1 -> Miss -> Check L2 -> Miss -> Read DB -> Populate L2 -> Populate L1\n// Write Flow: Update DB -> ???",
    "options": [
      {
        "id": "a",
        "text": "Write Flow: Update DB -> Populate L1 -> Ignore L2"
      },
      {
        "id": "b",
        "text": "Write Flow: Update DB -> Invalidate (delete) L2 key -> Broadcast invalidation message via Pub/Sub or message bus to evict L1 cache across all application instances"
      },
      {
        "id": "c",
        "text": "Write Flow: Wait 24 hours for L1 cache to expire naturally"
      },
      {
        "id": "d",
        "text": "Read Flow should bypass L1 completely during daytime business hours"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In an L1/L2 setup, writing requires updating the DB, deleting the L2 shared key, and broadcasting an invalidation event (via Redis Pub/Sub, Kafka, or cluster bus) to all app servers so they invalidate their local L1 in-memory caches.",
    "conceptTag": "caching-dual-tier-l1-l2"
  },
  {
    "id": "q-sd-rl-40",
    "difficulty": "hard",
    "question": "When using Redis Pub/Sub to broadcast cache invalidation events to synchronize L1 in-memory caches across a fleet of 50 microservice instances, what inherent characteristic of Redis Pub/Sub presents a significant consistency danger?",
    "options": [
      {
        "id": "a",
        "text": "Redis Pub/Sub persists all messages to disk and exhausts SSD storage"
      },
      {
        "id": "b",
        "text": "Redis Pub/Sub is fire-and-forget (at-most-once delivery): if an application instance experiences a brief network blip or is reconnecting, it misses invalidation messages, leaving its L1 cache permanently inconsistent until TTL expiration"
      },
      {
        "id": "c",
        "text": "Redis Pub/Sub only supports integer message payloads"
      },
      {
        "id": "d",
        "text": "Subscribed clients cannot execute normal GET or SET commands on any Redis connection"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Redis Pub/Sub offers no buffering or persistence for disconnected clients (at-most-once). If an instance is disconnected during a broadcast, it misses the invalidation. Mitigations include using Redis Streams with consumer groups or short L1 TTLs.",
    "conceptTag": "redis-pubsub-invalidation-risks"
  },
  {
    "id": "q-sd-rl-41",
    "difficulty": "hard",
    "question": "Under high write traffic with database read replicas experiencing 200ms replication lag, the \"Delayed Double Deletion\" caching strategy is employed. What is the operational rationale for the second deletion?",
    "codeSnippet": "// Delayed Double Deletion Sequence:\n// 1. redis.del(cacheKey);\n// 2. primaryDb.update(entity);\n// 3. sleep(500ms); // Wait longer than replica lag\n// 4. redis.del(cacheKey); // Second deletion",
    "options": [
      {
        "id": "a",
        "text": "The second deletion frees Redis memory allocated by jemalloc arenas"
      },
      {
        "id": "b",
        "text": "It purges stale data written to the cache by concurrent read requests that hit a read replica before the replica applied the primary's update"
      },
      {
        "id": "c",
        "text": "It is a mandatory requirement of the Redis RESP3 wire protocol"
      },
      {
        "id": "d",
        "text": "The first deletion only marks the key as soft-deleted, while the second deletion triggers a hard purge"
      }
    ],
    "correctOptionId": "b",
    "explanation": "During the write, a concurrent read may query an out-of-date read-replica and re-populate the cache with the old value. The second delayed deletion (executed after replication lag has elapsed) sweeps away any stale entries populated during that window.",
    "conceptTag": "caching-delayed-double-deletion"
  },
  {
    "id": "q-sd-rl-42",
    "difficulty": "hard",
    "question": "An edge gateway implements RFC 5861 \"stale-if-error\" caching. How does this directive behave when upstream origin microservices begin returning HTTP 500 errors or timing out?",
    "codeSnippet": "// Response header cached at edge:\nCache-Control: max-age=60, stale-if-error=3600",
    "options": [
      {
        "id": "a",
        "text": "The gateway immediately displays an empty white page to the user"
      },
      {
        "id": "b",
        "text": "If the origin service fails or times out within 3600 seconds after the 60-second freshness window has elapsed, the gateway serves the stale cached response rather than exposing a 5xx error to the client"
      },
      {
        "id": "c",
        "text": "The gateway retries the upstream origin 3,600 times in an infinite loop"
      },
      {
        "id": "d",
        "text": "The gateway converts HTTP 500 errors into HTTP 201 Created"
      }
    ],
    "correctOptionId": "b",
    "explanation": "RFC 5861 stale-if-error allows a proxy or CDN to serve an expired cached asset if the origin returns a 5xx server error or fails to respond, gracefully degrading service and masking transient outages from end users.",
    "conceptTag": "caching-rfc5861-stale-if-error"
  },
  {
    "id": "q-sd-rl-43",
    "difficulty": "hard",
    "question": "An engineering team designs a global API deployed across US-East, EU-West, and AP-Southeast. Enforcing a global rate limit of 10,000 req/sec per customer across all regions using a central Redis cluster in US-East causes 250ms cross-region latency on every request. Which architectural pattern resolves this?",
    "options": [
      {
        "id": "a",
        "text": "Use synchronous two-phase commit (2PC) between all three regional Redis clusters on every HTTP request"
      },
      {
        "id": "b",
        "text": "Partition the global quota across regions (e.g., allocate 4,000 to US, 4,000 to EU, 2,000 to AP) with local token buckets evaluated locally in O(1) time, backed by an asynchronous background sync daemon to dynamically rebalance quotas"
      },
      {
        "id": "c",
        "text": "Eliminate rate limiting in EU and AP and only rate limit US users"
      },
      {
        "id": "d",
        "text": "Force all worldwide user HTTP requests to route directly through US-East"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Synchronous cross-region coordination kills latency. Partitioning quotas locally allows each region to evaluate rate limits against local in-memory/Redis state with sub-millisecond latency. An asynchronous control plane periodically redistributes unused quota slices.",
    "conceptTag": "rate-limiting-multi-region-active"
  },
  {
    "id": "q-sd-rl-44",
    "difficulty": "hard",
    "question": "Netflix developed an Adaptive Concurrency Limiting library based on TCP Vegas congestion control and Little's Law (L = λW). How does it dynamically calculate server concurrency limits without static request-per-second thresholds?",
    "codeSnippet": "// Gradient-based limit calculation:\n// RTT_no_load = minimum observed round trip time under healthy conditions\n// RTT_actual = moving average of measured round trip time\n// gradient = RTT_no_load / RTT_actual\n// new_limit = current_limit * gradient + headroom",
    "options": [
      {
        "id": "a",
        "text": "It checks the number of git commits deployed in the last 24 hours"
      },
      {
        "id": "b",
        "text": "It continuously monitors latency (RTT); when queueing builds up and RTT exceeds RTT_no_load, gradient drops below 1.0, automatically contracting the concurrency limit to prevent queue saturation"
      },
      {
        "id": "c",
        "text": "It kills random microservice pods when CPU reaches 50%"
      },
      {
        "id": "d",
        "text": "It forces clients to run proof-of-work hash calculations before sending HTTP requests"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Static RPS limits fail because different request payloads have differing CPU costs. Adaptive concurrency limiting measures round-trip time (RTT). When RTT increases due to queuing delays, the algorithm shrinks concurrency limits automatically to protect the service.",
    "conceptTag": "adaptive-concurrency-limiting"
  },
  {
    "id": "q-sd-rl-45",
    "difficulty": "hard",
    "question": "During a celebrity live event, a single Redis key \"stream:live_event_99\" receives 500,000 read requests per second, overwhelming the single Redis shard hosting that key slot. Which technique successfully mitigates this \"Hot Key Skew\" in Redis Cluster?",
    "options": [
      {
        "id": "a",
        "text": "Enable Redis AOF fsync on every write"
      },
      {
        "id": "b",
        "text": "Key Salting: Write copies of the data to N salted keys (e.g. stream:live_event_99:salt_{1..10}) distributed across different shards, and have clients randomly read from stream:live_event_99:salt_${rand(1, 10)}"
      },
      {
        "id": "c",
        "text": "Execute FLUSHALL on the hot master node"
      },
      {
        "id": "d",
        "text": "Disable CRC16 slot hashing in the Redis source code"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In Redis Cluster, an individual key always hashes to exactly one shard. For an extreme hot read key, appending randomized salts (e.g. key:1..N) distributes the copies across N distinct hash slots/nodes. Clients read from a random salt, dividing the read load by N.",
    "conceptTag": "redis-hot-key-salting"
  },
  {
    "id": "q-sd-rl-46",
    "difficulty": "hard",
    "question": "To defend an e-commerce catalog against Cache Penetration attacks targeting non-existent SKUs, a Bloom filter is placed in front of Redis. If the Bloom filter has m = 10,000,000 bits, k = 7 hash functions, and n = 1,000,000 stored SKUs, what guarantee does it provide?",
    "codeSnippet": "// Incoming request for SKU: sku_unknown_8989\nif (!bloomFilter.contains(sku)) {\n    return HTTP 404; // Reject immediately, never query Redis or DB!\n}\n// Else: Query Redis -> Query DB",
    "options": [
      {
        "id": "a",
        "text": "Zero false positives and zero false negatives"
      },
      {
        "id": "b",
        "text": "Zero false negatives (if an item exists, the filter ALWAYS returns true), meaning a negative result definitively proves the SKU does not exist and can be safely rejected without querying cache or database"
      },
      {
        "id": "c",
        "text": "Zero false positives (if the filter returns true, the SKU is 100% guaranteed to exist in the database)"
      },
      {
        "id": "d",
        "text": "It allows deleting individual SKUs with O(1) complexity"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Bloom filters have no false negatives: if bloomFilter.contains(sku) is false, the SKU definitively does not exist, enabling immediate 404 rejection. False positives (~1%) may proceed to the cache/DB, which is acceptable.",
    "conceptTag": "caching-bloom-filter-penetration"
  },
  {
    "id": "q-sd-rl-47",
    "difficulty": "hard",
    "question": "A high-throughput Redis instance experiences severe memory fragmentation where \"used_memory_rss\" is 24 GB while \"used_memory\" is only 12 GB (fragmentation ratio = 2.0). What causes this behavior in memory allocators like jemalloc, and what is the non-disruptive remediation?",
    "options": [
      {
        "id": "a",
        "text": "Hardware bit rot; the physical RAM DIMMs must be replaced"
      },
      {
        "id": "b",
        "text": "High allocation and deallocation churn of varying object sizes leaves unreleased memory holes across OS memory pages; remediation is enabling Redis active defragmentation (activedefrag yes) at runtime"
      },
      {
        "id": "c",
        "text": "Redis must be compiled with 32-bit pointers"
      },
      {
        "id": "d",
        "text": "Execute DEBUG SEGFAULT to restart the memory controller"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Frequent allocation and eviction of fluctuating payload sizes creates fragmented memory pages that jemalloc cannot return to the OS. Enabling Redis Active Defragmentation (CONFIG SET activedefrag yes) causes Redis to reallocate values into contiguous memory spaces on the fly.",
    "conceptTag": "redis-memory-fragmentation"
  },
  {
    "id": "q-sd-rl-48",
    "difficulty": "hard",
    "question": "In a mission-critical Write-Behind caching architecture where financial transaction updates cannot be lost even during sudden hardware power failure, how must the write-behind buffer be designed?",
    "options": [
      {
        "id": "a",
        "text": "Store writes exclusively in volatile Node.js process memory"
      },
      {
        "id": "b",
        "text": "Write updates to an append-only, fsynced Write-Ahead Log (WAL) or durable distributed commit log (Kafka with acks=all) before acknowledging the write to the client, allowing replay on crash recovery"
      },
      {
        "id": "c",
        "text": "Increase Redis maxmemory to 512 GB"
      },
      {
        "id": "d",
        "text": "Write transactions to local browser localStorage"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Write-behind caches sacrifice durability unless backed by a durable WAL or distributed log with synchronous fsync / acks=all. A crash-recovery manager replays the WAL on reboot to guarantee zero data loss.",
    "conceptTag": "write-behind-durability-wal"
  },
  {
    "id": "q-sd-rl-49",
    "difficulty": "hard",
    "question": "When implementing the GCRA (Generic Cell Rate Algorithm) inside a distributed Redis cluster using Lua, why is relying on the application server's local system clock dangerous, and how should time be obtained?",
    "options": [
      {
        "id": "a",
        "text": "Local server clocks can drift or undergo NTP step adjustments, causing negative or skewed arrival time calculations; time should be obtained from the Redis server itself using the Redis TIME command"
      },
      {
        "id": "b",
        "text": "Local system clocks run in Base-16 hexadecimal format"
      },
      {
        "id": "c",
        "text": "Redis rejects any command with arguments formatted as ISO-8601 strings"
      },
      {
        "id": "d",
        "text": "System clocks in Docker containers freeze when CPU utilization exceeds 80%"
      }
    ],
    "correctOptionId": "a",
    "explanation": "Application client clocks frequently suffer from NTP synchronization jumps and skew. In GCRA, if a client clock jumps backwards or forwards, it either erroneously allows huge bursts or locks out valid users. Using redis.call(\"TIME\") inside Lua ensures consistent monotonic cluster time.",
    "conceptTag": "rate-limiting-gcra-clock-skew"
  },
  {
    "id": "q-sd-rl-50",
    "difficulty": "hard",
    "question": "Under PostgreSQL Repeatable Read transaction isolation, a subtle cache invalidation bug occurs when combining Cache-Aside with application updates. What causes this anomaly?",
    "codeSnippet": "// Transaction 1 (Long Read Tx): BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;\n// Tx 1 executes SELECT * FROM products WHERE id = 10; (sees version 1)\n// Transaction 2: UPDATE products SET price = 200 WHERE id = 10; COMMIT;\n// Tx 2 deletes Redis cache key \"product:10\"\n// Tx 1 executes another SELECT * FROM products WHERE id = 10;\n// Tx 1 experiences cache miss in Redis, re-reads DB (snapshot sees version 1!), and writes version 1 to Redis!",
    "options": [
      {
        "id": "a",
        "text": "PostgreSQL crashed and restored from an old snapshot"
      },
      {
        "id": "b",
        "text": "Snapshot Isolation anomaly: Repeatable Read takes its snapshot at transaction start; subsequent reads within Tx 1 still see the pre-commit snapshot (version 1) and repopulate the cache with outdated data after Tx 2 invalidated it"
      },
      {
        "id": "c",
        "text": "Redis automatically converts Repeatable Read transactions into Serialized transactions"
      },
      {
        "id": "d",
        "text": "The Redis key was evicted by the LFU eviction algorithm"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Under Repeatable Read (Snapshot Isolation), a transaction's snapshot remains frozen at the start of the transaction. If a long-running read transaction reads an expired key from the DB, it reads its stale snapshot and writes that stale data back to the cache, resurrecting old data.",
    "conceptTag": "caching-isolation-snapshot-anomaly"
  }
];
