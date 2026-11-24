import type { QuizQuestion } from '../../../../src/types';

export const ACID_TRANSACTIONS_50_QUESTIONS: QuizQuestion[] = [
  // ============================================================================
  // EASY / FOUNDATIONAL (Questions 1 - 17)
  // ============================================================================
  {
    id: 'q-db-acid-1',
    difficulty: 'easy',
    question: 'In the context of the ACID transactional model, what does "Atomicity" guarantee?',
    codeSnippet: `BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;`,
    options: [
      { id: 'a', text: 'Queries execute using atomic hardware instructions without operating system context switches' },
      { id: 'b', text: 'All operations within the transaction succeed together, or the entire transaction is rolled back leaving state completely unchanged (all-or-nothing)' },
      { id: 'c', text: 'Data modifications are compressed into single-byte atomic tokens' },
      { id: 'd', text: 'Transactions can only run on single-core CPUs' },
    ],
    correctOptionId: 'b',
    explanation: 'Atomicity ensures the all-or-nothing property: either all database modifications within the transaction are permanently applied upon commit, or if any error occurs (or rollback is requested), all partial changes are discarded, leaving the database in its pre-transaction state.',
    conceptTag: 'db-acid-atomicity',
  },
  {
    id: 'q-db-acid-2',
    difficulty: 'easy',
    question: 'How is the "Consistency" property of ACID formally defined in relational database systems?',
    codeSnippet: `ALTER TABLE bank_accounts ADD CONSTRAINT positive_balance CHECK (balance >= 0);`,
    options: [
      { id: 'a', text: 'Every query returns in a consistent time duration regardless of table size' },
      { id: 'b', text: 'A transaction transforms the database from one valid state to another, strictly preserving all declared schema constraints, foreign keys, triggers, and column checks' },
      { id: 'c', text: 'Every replica in a distributed cluster returns identical data instantaneously without network latency' },
      { id: 'd', text: 'All database tables must use the exact same primary key data type' },
    ],
    correctOptionId: 'b',
    explanation: 'Consistency in ACID means that a transaction can only transition the database between valid states. Any transaction that attempts to violate schema invariants (such as foreign key constraints, CHECK constraints, or UNIQUE rules) is aborted and rejected.',
    conceptTag: 'db-acid-consistency',
  },
  {
    id: 'q-db-acid-3',
    difficulty: 'easy',
    question: 'What is the purpose of the "Isolation" property in ACID transaction processing?',
    options: [
      { id: 'a', text: 'To ensure the database server operates without an external internet connection' },
      { id: 'b', text: 'To control the visibility of concurrent transactions so that intermediate uncommitted writes from one transaction do not corrupt or disrupt other concurrent operations' },
      { id: 'c', text: 'To store backups on physically isolated tape drives' },
      { id: 'd', text: 'To ensure queries only read data from isolated memory caches rather than disk' },
    ],
    correctOptionId: 'b',
    explanation: 'Isolation defines how and when the changes made by one operation become visible to other concurrent operations. It prevents concurrent transactions from interfering with each other or observing dirty, inconsistent intermediate states.',
    conceptTag: 'db-acid-isolation',
  },
  {
    id: 'q-db-acid-4',
    difficulty: 'easy',
    question: 'What does the "Durability" guarantee in ACID ensure once a transaction successfully commits?',
    options: [
      { id: 'a', text: 'The transaction will execute indefinitely without timing out' },
      { id: 'b', text: 'Once committed, the transaction\'s modifications are guaranteed to survive subsequent system crashes, power outages, and server crashes via non-volatile storage logging (WAL)' },
      { id: 'c', text: 'The database server hardware is physically protected against water damage' },
      { id: 'd', text: 'The database schema can never be altered or dropped' },
    ],
    correctOptionId: 'b',
    explanation: 'Durability guarantees that once the database returns a successful commit confirmation to the client, the transaction\'s recorded changes will not be lost, even in the event of an immediate operating system crash or total power failure, typically enforced via Write-Ahead Logging (WAL) flushed to persistent storage.',
    conceptTag: 'db-acid-durability',
  },
  {
    id: 'q-db-acid-5',
    difficulty: 'easy',
    question: 'Which of the following lists the ANSI/ISO SQL-92 transaction isolation levels in order from weakest isolation (highest concurrency) to strongest isolation (strictest consistency)?',
    options: [
      { id: 'a', text: 'Serializable, Repeatable Read, Read Committed, Read Uncommitted' },
      { id: 'b', text: 'Read Uncommitted, Read Committed, Repeatable Read, Serializable' },
      { id: 'c', text: 'Read Committed, Read Uncommitted, Serializable, Repeatable Read' },
      { id: 'd', text: 'Snapshot, Read Committed, Eventual, Strict' },
    ],
    correctOptionId: 'b',
    explanation: 'The four standard ANSI/ISO SQL-92 isolation levels, from weakest to strongest, are: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. As isolation increases, more read/write anomalies are prevented, typically at the cost of concurrency.',
    conceptTag: 'db-isolation-levels-hierarchy',
  },
  {
    id: 'q-db-acid-6',
    difficulty: 'easy',
    question: 'What is a "Dirty Read" (P1 anomaly) in transaction processing?',
    codeSnippet: `-- Transaction A:
UPDATE products SET price = 99 WHERE id = 1;
-- Transaction B:
SELECT price FROM products WHERE id = 1; -- Sees 99!
-- Transaction A:
ROLLBACK; -- Price reverts to original!`,
    options: [
      { id: 'a', text: 'Reading corrupted binary bits caused by a failing hard drive controller' },
      { id: 'b', text: 'A transaction reading uncommitted data modified by another transaction that subsequently rolls back' },
      { id: 'c', text: 'Reading rows that have NULL values in required foreign key fields' },
      { id: 'd', text: 'Reading data from a stale replica node that is behind the primary' },
    ],
    correctOptionId: 'b',
    explanation: 'A Dirty Read occurs when Transaction B reads modifications made by Transaction A before Transaction A has committed. If Transaction A later aborts and rolls back, Transaction B has operated on data that never officially existed in the database.',
    conceptTag: 'db-anomaly-dirty-read',
  },
  {
    id: 'q-db-acid-7',
    difficulty: 'easy',
    question: 'What is a "Non-Repeatable Read" (also known as a Fuzzy Read)?',
    codeSnippet: `-- Transaction A:
SELECT stock FROM inventory WHERE item_id = 50; -- Returns 100
-- Transaction B:
UPDATE inventory SET stock = 75 WHERE item_id = 50;
COMMIT;
-- Transaction A:
SELECT stock FROM inventory WHERE item_id = 50; -- Returns 75!`,
    options: [
      { id: 'a', text: 'A query that cannot be executed twice due to a syntax error' },
      { id: 'b', text: 'A transaction re-reading the exact same row and observing different values because a concurrent transaction modified and committed that row in between' },
      { id: 'c', text: 'A database that fails to cache identical SQL queries in memory' },
      { id: 'd', text: 'Reading from a table that has no primary key defined' },
    ],
    correctOptionId: 'b',
    explanation: 'A Non-Repeatable Read occurs when a transaction reads a row, and a second concurrent transaction updates or deletes that same row and commits. When the first transaction reads the row again, it observes modified values or discovers the row was deleted.',
    conceptTag: 'db-anomaly-non-repeatable-read',
  },
  {
    id: 'q-db-acid-8',
    difficulty: 'easy',
    question: 'What is a "Phantom Read" anomaly in standard SQL?',
    codeSnippet: `-- Transaction A:
SELECT COUNT(*) FROM users WHERE age >= 21; -- Returns 50
-- Transaction B:
INSERT INTO users (name, age) VALUES ('Dave', 22);
COMMIT;
-- Transaction A:
SELECT COUNT(*) FROM users WHERE age >= 21; -- Returns 51!`,
    options: [
      { id: 'a', text: 'A query returning ghost records that were never inserted by any client' },
      { id: 'b', text: 'A transaction re-executing a search query using a range predicate and discovering new rows inserted or matching rows deleted by another committed transaction' },
      { id: 'c', text: 'A database reading data directly from disk instead of RAM' },
      { id: 'd', text: 'A query plan generated by an AI assistant that hallucinates column names' },
    ],
    correctOptionId: 'b',
    explanation: 'A Phantom Read occurs when a transaction executes a predicate range query (e.g. `WHERE age >= 21`) and subsequently repeats the query, but finds additional rows that satisfy the predicate because a concurrent transaction inserted and committed them in the interim.',
    conceptTag: 'db-anomaly-phantom-read',
  },
  {
    id: 'q-db-acid-9',
    difficulty: 'easy',
    question: 'In PostgreSQL and Microsoft SQL Server, what is the default transaction isolation level?',
    options: [
      { id: 'a', text: 'Read Uncommitted' },
      { id: 'b', text: 'Read Committed' },
      { id: 'c', text: 'Repeatable Read' },
      { id: 'd', text: 'Serializable' },
    ],
    correctOptionId: 'b',
    explanation: 'Read Committed is the default isolation level for PostgreSQL, Microsoft SQL Server, and Oracle. In Read Committed, each query within a transaction sees a snapshot of committed data as of the start of that specific query (not the start of the whole transaction).',
    conceptTag: 'db-read-committed-default',
  },
  {
    id: 'q-db-acid-10',
    difficulty: 'easy',
    question: 'In PostgreSQL, if a client explicitly executes `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;`, what isolation level does PostgreSQL actually provide?',
    codeSnippet: `BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT * FROM balances;`,
    options: [
      { id: 'a', text: 'It permits dirty reads of uncommitted shared memory buffers' },
      { id: 'b', text: 'It silently elevates the isolation level to Read Committed because PostgreSQL\'s MVCC engine cannot display uncommitted tuple versions' },
      { id: 'c', text: 'It throws an unrecoverable syntax error and drops the connection' },
      { id: 'd', text: 'It converts the connection into a read-only replica' },
    ],
    correctOptionId: 'b',
    explanation: 'PostgreSQL allows the SQL-standard syntax `READ UNCOMMITTED`, but maps it internally to `READ COMMITTED`. PostgreSQL\'s MVCC implementation determines row visibility based on committed transaction IDs (`xmin`/`xmax`), making it architecturally incapable of displaying uncommitted dirty writes without extensive overhead.',
    conceptTag: 'db-postgres-read-uncommitted-behavior',
  },
  {
    id: 'q-db-acid-11',
    difficulty: 'easy',
    question: 'How does the "Repeatable Read" isolation level differ from "Read Committed" regarding row visibility across multiple queries inside a single transaction?',
    options: [
      { id: 'a', text: 'In Read Committed, queries only read from table indexes; in Repeatable Read, queries only read from heap files' },
      { id: 'b', text: 'In Read Committed, each query takes a new snapshot of committed data; in Repeatable Read, the snapshot is frozen at transaction start, ensuring multiple reads of the same row always yield identical values' },
      { id: 'c', text: 'Repeatable Read allows reading uncommitted writes from other transactions' },
      { id: 'd', text: 'Repeatable Read disables transaction rollbacks' },
    ],
    correctOptionId: 'b',
    explanation: 'In Read Committed, each individual query inside the transaction gets a new snapshot of all data committed before that query began. In Repeatable Read, the transaction takes a single snapshot at the start of the transaction and uses it for all subsequent queries, guaranteeing repeatable row reads.',
    conceptTag: 'db-repeatable-read-vs-read-committed',
  },
  {
    id: 'q-db-acid-12',
    difficulty: 'easy',
    question: 'What happens to uncommitted changes if a client application abruptly crashes or loses its TCP network connection during an active multi-statement transaction?',
    codeSnippet: `BEGIN;
UPDATE inventory SET quantity = quantity - 1 WHERE id = 100;
-- [Client network interface drops / process killed SIGKILL]`,
    options: [
      { id: 'a', text: 'The changes are automatically committed to avoid data loss' },
      { id: 'b', text: 'The database server detects the disconnected client socket, aborts the in-flight transaction, and rolls back all uncommitted changes' },
      { id: 'c', text: 'The database remains permanently locked until the server is physically rebooted' },
      { id: 'd', text: 'The changes are saved into a temporary text file on the client machine' },
    ],
    correctOptionId: 'b',
    explanation: 'When the database engine detects a closed client connection or TCP timeout without an explicit `COMMIT`, the backend worker process aborts the transaction and issues an internal `ROLLBACK`, guaranteeing Atomicity.',
    conceptTag: 'db-transaction-abort-disconnect',
  },
  {
    id: 'q-db-acid-13',
    difficulty: 'easy',
    question: 'What does "Autocommit" mode mean when interacting with relational database drivers (like psycopg2, JDBC, or pgx)?',
    options: [
      { id: 'a', text: 'The database periodically commits all open connections every 60 seconds' },
      { id: 'b', text: 'Every individual SQL statement executed outside an explicit `BEGIN ... COMMIT` block is automatically treated as its own independent single-statement transaction and committed immediately' },
      { id: 'c', text: 'Git commits are created for every SQL migration' },
      { id: 'd', text: 'The database automatically fixes syntax errors before executing queries' },
    ],
    correctOptionId: 'b',
    explanation: 'In autocommit mode (standard in most client drivers and CLI tools like psql), each discrete SQL statement is executed inside an implicit transaction that is committed immediately upon statement completion.',
    conceptTag: 'db-autocommit-mode',
  },
  {
    id: 'q-db-acid-14',
    difficulty: 'easy',
    question: 'How do PostgreSQL and MySQL differ when executing DDL (Data Definition Language) statements such as `ALTER TABLE` or `CREATE TABLE` inside an explicit transaction block?',
    codeSnippet: `BEGIN;
ALTER TABLE users ADD COLUMN age INT NOT NULL DEFAULT 18;
-- An error occurs:
ROLLBACK;`,
    options: [
      { id: 'a', text: 'Neither database supports DDL statements' },
      { id: 'b', text: 'PostgreSQL supports fully transactional DDL (the schema alteration is cleanly rolled back), whereas MySQL automatically forces an implicit commit on DDL statements, making rollback impossible' },
      { id: 'c', text: 'MySQL rolls back DDL, but PostgreSQL does not support transactions around DDL' },
      { id: 'd', text: 'Both databases drop the table if an ALTER TABLE fails' },
    ],
    correctOptionId: 'b',
    explanation: 'PostgreSQL has full transactional DDL support: `CREATE TABLE`, `ALTER TABLE`, and `DROP TABLE` can run inside a `BEGIN ... ROLLBACK` block. In MySQL, executing almost any DDL statement triggers an implicit commit of the active transaction, making it impossible to roll back schema migrations.',
    conceptTag: 'db-transactional-ddl',
  },
  {
    id: 'q-db-acid-15',
    difficulty: 'easy',
    question: 'What is the "Read Skew" anomaly in database systems?',
    codeSnippet: `-- Checking total assets: Account 1 + Account 2 = $1000
-- Transaction A reads Account 1 ($500)
-- Transaction B transfers $200 from Acct 1 to Acct 2 and commits (Acct 1: $300, Acct 2: $700)
-- Transaction A reads Account 2 ($700) -> Calculates total as $1200!`,
    options: [
      { id: 'a', text: 'When rows are physically stored out of order on disk' },
      { id: 'b', text: 'When a transaction reads related records at different points in time under Read Committed and observes an inconsistent state because a concurrent transaction updated one record between reads' },
      { id: 'c', text: 'When a database replica is read-only' },
      { id: 'd', text: 'When numeric columns are rounded incorrectly due to IEEE 754 float precision' },
    ],
    correctOptionId: 'b',
    explanation: 'Read Skew is a form of non-repeatable read occurring across related records. Under Read Committed, if Transaction A reads row 1, then Transaction B updates row 1 and row 2 and commits, when Transaction A reads row 2, it observes a state that reflects the update to row 2 but not row 1, violating cross-row integrity.',
    conceptTag: 'db-anomaly-read-skew',
  },
  {
    id: 'q-db-acid-16',
    difficulty: 'easy',
    question: 'What causes the classic "Lost Update" anomaly when two users attempt to increment the same counter without database-level concurrency control?',
    codeSnippet: `-- User 1 reads counter: 10
-- User 2 reads counter: 10
-- User 1 writes: counter = 11, commits
-- User 2 writes: counter = 11, commits (User 1's update is lost!)`,
    options: [
      { id: 'a', text: 'The operating system runs out of swap space' },
      { id: 'b', text: 'Both transactions perform a read-modify-write cycle concurrently based on the same initial read; the second commit blindly overwrites the first commit without factoring in the intermediate change' },
      { id: 'c', text: 'The B-Tree index drops duplicate values silently' },
      { id: 'd', text: 'The database deletes old rows to save space' },
    ],
    correctOptionId: 'b',
    explanation: 'The Lost Update anomaly occurs in read-modify-write patterns where two concurrent transactions read the same initial value, compute updates locally in application code, and write the result back. The second transaction overwrites the first transaction\'s update without incorporating it.',
    conceptTag: 'db-anomaly-lost-update',
  },
  {
    id: 'q-db-acid-17',
    difficulty: 'easy',
    question: 'Why should multiple interdependent SQL operations (such as debiting one balance and crediting another) always be wrapped inside an explicit transaction block (`BEGIN ... COMMIT`)?',
    options: [
      { id: 'a', text: 'Explicit transactions encrypt database traffic' },
      { id: 'b', text: 'Without an explicit transaction, each statement runs as an independent transaction; if the system crashes between the debit and credit, money vanishes from the system permanently' },
      { id: 'c', text: 'Explicit transactions convert SQL into machine code' },
      { id: 'd', text: 'PostgreSQL prohibits updating balances in autocommit mode' },
    ],
    correctOptionId: 'b',
    explanation: 'Without a transaction block, each statement is an isolated autocommit transaction. If a crash or network interruption occurs after debiting Account A but before crediting Account B, the debit persists and the credit never executes, leaving financial records in a corrupted, incomplete state.',
    conceptTag: 'db-explicit-transaction-boundaries',
  },

  // ============================================================================
  // MEDIUM / INTERMEDIATE (Questions 18 - 34)
  // ============================================================================
  {
    id: 'q-db-acid-18',
    difficulty: 'medium',
    question: 'In PostgreSQL\'s Multi-Version Concurrency Control (MVCC) architecture, what metadata fields in the tuple header determine row visibility for active transactions?',
    codeSnippet: `SELECT xmin, xmax, cmin, cmax, ctid FROM users WHERE id = 1;`,
    options: [
      { id: 'a', text: 'ip_address and mac_address' },
      { id: 'b', text: 'xmin (the transaction ID that inserted the row) and xmax (the transaction ID that updated or deleted the row)' },
      { id: 'c', text: 'sha256_hash and salt' },
      { id: 'd', text: 'cpu_affinity and thread_id' },
    ],
    correctOptionId: 'b',
    explanation: 'Every PostgreSQL heap tuple header contains `xmin` (the inserting transaction ID) and `xmax` (the deleting/updating transaction ID, or 0 if active). When a transaction executes a query, it compares its snapshot of active, committed, and aborted transaction IDs against `xmin` and `xmax` to determine if that specific version of the row is visible.',
    conceptTag: 'db-mvcc-xmin-xmax-headers',
  },
  {
    id: 'q-db-acid-19',
    difficulty: 'medium',
    question: 'What is the core premise of "Snapshot Isolation" (SI), and how does it prevent reader-writer lock contention?',
    options: [
      { id: 'a', text: 'Readers acquire exclusive table locks that block all writers until queries finish' },
      { id: 'b', text: 'Readers do not block writers, and writers do not block readers; each transaction reads from a consistent snapshot of the database taken at a specific point in time' },
      { id: 'c', text: 'Snapshots are exported as tar archives to external storage before each query' },
      { id: 'd', text: 'All writes are held in client browser cache until all reads complete' },
    ],
    correctOptionId: 'b',
    explanation: 'Snapshot Isolation (SI) allows read operations to view a consistent historical snapshot of committed data without acquiring shared read locks. Writers create new row versions rather than modifying existing rows in place. As a result, "readers never block writers, and writers never block readers".',
    conceptTag: 'db-snapshot-isolation-readers-writers',
  },
  {
    id: 'q-db-acid-20',
    difficulty: 'medium',
    question: 'In the classic "On-Call Doctors" scenario under Snapshot Isolation, what is the "Write Skew" anomaly?',
    codeSnippet: `-- Requirement: At least 1 doctor must be on call at all times.
-- Currently, Dr. Alice and Dr. Bob are on call (count = 2).
-- Trans 1 (Alice): SELECT COUNT(*) FROM on_call; (sees 2) -> UPDATE on_call SET active = false WHERE name = 'Alice';
-- Trans 2 (Bob):   SELECT COUNT(*) FROM on_call; (sees 2) -> UPDATE on_call SET active = false WHERE name = 'Bob';
-- Both Trans 1 and Trans 2 commit! Result: 0 doctors on call!`,
    options: [
      { id: 'a', text: 'A hardware failure caused by disk write heads skewing across tracks' },
      { id: 'b', text: 'Two concurrent transactions read overlapping data sets satisfying an invariant, but make disjoint updates to different rows; each update is valid in isolation, but their combination violates the global invariant' },
      { id: 'c', text: 'A deadlock that crashes the database engine' },
      { id: 'd', text: 'Writing text data into integer columns' },
    ],
    correctOptionId: 'b',
    explanation: 'Write Skew is an anomaly that occurs under Snapshot Isolation (and Repeatable Read). Because Alice and Bob update different rows, there is no row-level write-write conflict (`xmax` collisions). Each transaction\'s local snapshot indicates the invariant (count >= 1) is preserved, yet the concurrent execution violates the system-wide business constraint.',
    conceptTag: 'db-anomaly-write-skew',
  },
  {
    id: 'q-db-acid-21',
    difficulty: 'medium',
    question: 'What is the exact behavioral difference between pessimistic locking using `SELECT ... FOR UPDATE` versus `SELECT ... FOR SHARE` in PostgreSQL?',
    codeSnippet: `SELECT * FROM accounts WHERE id = 10 FOR UPDATE;
SELECT * FROM accounts WHERE id = 10 FOR SHARE;`,
    options: [
      { id: 'a', text: 'FOR UPDATE allows other transactions to update the row; FOR SHARE forbids all reads' },
      { id: 'b', text: 'FOR UPDATE acquires an exclusive row lock blocking all concurrent updates, deletes, and other FOR UPDATE/FOR SHARE locks; FOR SHARE acquires a shared lock that prevents other transactions from updating/deleting the row while allowing concurrent FOR SHARE readers' },
      { id: 'c', text: 'FOR SHARE converts the table into a distributed shared memory cluster' },
      { id: 'd', text: 'FOR UPDATE can only be run by database superusers' },
    ],
    correctOptionId: 'b',
    explanation: '`SELECT FOR UPDATE` obtains an exclusive row lock (`ExclusiveLock` level), preventing any other transaction from locking, modifying, or deleting the target rows. `SELECT FOR SHARE` acquires a shared row lock, preventing updates and deletes by other transactions while allowing other transactions to also acquire `FOR SHARE` locks simultaneously.',
    conceptTag: 'db-pessimistic-for-update-vs-for-share',
  },
  {
    id: 'q-db-acid-22',
    difficulty: 'medium',
    question: 'When implementing a concurrent job queue processor in PostgreSQL, why is `SELECT ... FOR UPDATE SKIP LOCKED` preferred over plain `SELECT ... FOR UPDATE`?',
    codeSnippet: `SELECT id, payload FROM task_queue 
WHERE status = 'pending' 
ORDER BY priority DESC, id ASC 
LIMIT 1 
FOR UPDATE SKIP LOCKED;`,
    options: [
      { id: 'a', text: 'It ignores primary key constraints to speed up writes' },
      { id: 'b', text: 'It skips rows currently locked by other concurrent worker transactions instead of waiting in line, enabling lock-free horizontal queue scaling across multiple worker instances' },
      { id: 'c', text: 'It permanently unlocks all locked rows in the entire database' },
      { id: 'd', text: 'It automatically commits the transaction after reading the first row' },
    ],
    correctOptionId: 'b',
    explanation: 'Plain `FOR UPDATE` makes competing worker threads block and queue up waiting for the same row lock. `FOR UPDATE SKIP LOCKED` instructs PostgreSQL to inspect candidate rows and immediately skip any row currently locked by another transaction, claiming the next available unlocked row without contention or deadlocks.',
    conceptTag: 'db-for-update-skip-locked-queues',
  },
  {
    id: 'q-db-acid-23',
    difficulty: 'medium',
    question: 'What sequence of operations produces a database "Deadlock", and how does PostgreSQL resolve it?',
    codeSnippet: `-- Transaction 1: locks Row A, attempts to lock Row B
-- Transaction 2: locks Row B, attempts to lock Row A`,
    options: [
      { id: 'a', text: 'Both transactions wait indefinitely until the server runs out of disk space' },
      { id: 'b', text: 'A circular dependency occurs where T1 waits for T2 while T2 waits for T1; after `deadlock_timeout` expires, PostgreSQL\'s background cycle-detector aborts one of the transactions with SQLSTATE 40P01' },
      { id: 'c', text: 'The database automatically merges the two transactions into a single master transaction' },
      { id: 'd', text: 'PostgreSQL reboots the cluster in single-user mode' },
    ],
    correctOptionId: 'b',
    explanation: 'A deadlock occurs when two or more transactions hold locks that the others need, creating a cycle in the lock wait-for graph. When `deadlock_timeout` (default 1 second) is exceeded, PostgreSQL checks the wait-for graph for cycles and terminates the victim transaction with `ERROR: deadlock detected` (SQLSTATE 40P01).',
    conceptTag: 'db-deadlock-detection-timeout',
  },
  {
    id: 'q-db-acid-24',
    difficulty: 'medium',
    question: 'What is the standard application architectural strategy to systematically prevent deadlocks when locking multiple rows across concurrent transactions?',
    codeSnippet: `// Application code locking user accounts:
const userIdsToLock = [45, 12, 88].sort((a, b) => a - b); // [12, 45, 88]`,
    options: [
      { id: 'a', text: 'Acquire locks in completely random order using cryptographic salts' },
      { id: 'b', text: 'Enforce a deterministic, consistent global lock ordering (e.g. always acquiring row locks in ascending order of primary key IDs) across all application endpoints' },
      { id: 'c', text: 'Disable all indexes on the locked tables' },
      { id: 'd', text: 'Run all database operations inside stored procedures with autocommit disabled' },
    ],
    correctOptionId: 'b',
    explanation: 'Deadlocks require circular wait conditions. If all application code paths acquire locks on shared resources in a strictly uniform, deterministic order (such as ascending primary key sort order), a circular wait condition is mathematically impossible, eliminating deadlocks by design.',
    conceptTag: 'db-deadlock-prevention-lock-ordering',
  },
  {
    id: 'q-db-acid-25',
    difficulty: 'medium',
    question: 'What is "Lock Escalation" in RDBMS engines like Microsoft SQL Server, and why does PostgreSQL NOT perform lock escalation for row locks?',
    options: [
      { id: 'a', text: 'Converting read queries into write queries during traffic surges' },
      { id: 'b', text: 'Lock escalation converts thousands of fine-grained row locks into a coarse table lock to save lock manager RAM; PostgreSQL avoids this because row locks are recorded directly in tuple headers (xmax), not in limited lock-manager memory' },
      { id: 'c', text: 'PostgreSQL cannot hold more than 10 row locks at once' },
      { id: 'd', text: 'Lock escalation only applies to databases running on RAID 5 storage' },
    ],
    correctOptionId: 'b',
    explanation: 'In engines like SQL Server, each lock is a structure in OS memory. When too many row locks accumulate, the engine escalates them to a table lock to prevent memory exhaustion, killing concurrency. PostgreSQL records row locks in the disk/buffer page tuple headers (`xmax` and `infomask`), so holding 10 million row locks consumes no extra lock table RAM and requires zero escalation.',
    conceptTag: 'db-lock-escalation-sqlserver-vs-postgres',
  },
  {
    id: 'q-db-acid-26',
    difficulty: 'medium',
    question: 'How do Transaction Savepoints allow partial rollback within an active transaction block?',
    codeSnippet: `BEGIN;
INSERT INTO logs VALUES ('started');
SAVEPOINT step_one;
INSERT INTO payment_gateway_calls VALUES ('charge'); -- Fails with unique violation!
ROLLBACK TO SAVEPOINT step_one;
INSERT INTO logs VALUES ('recovered from payment error');
COMMIT;`,
    options: [
      { id: 'a', text: 'Savepoints commit all previous statements permanently to disk before proceeding' },
      { id: 'b', text: 'A savepoint defines a sub-transaction boundary; executing `ROLLBACK TO SAVEPOINT` undoes all commands executed after the savepoint without aborting the outer transaction' },
      { id: 'c', text: 'Savepoints convert the connection to an asynchronous background worker' },
      { id: 'd', text: 'Savepoints export the database state to Amazon S3' },
    ],
    correctOptionId: 'b',
    explanation: 'Savepoints allow fine-grained error recovery within a transaction. In PostgreSQL, if any statement fails inside a transaction, the transaction enters an aborted state. Using a `SAVEPOINT` allows the application to execute `ROLLBACK TO SAVEPOINT`, discarding only the failed sub-statement and continuing the transaction.',
    conceptTag: 'db-transaction-savepoints',
  },
  {
    id: 'q-db-acid-27',
    difficulty: 'medium',
    question: 'In PostgreSQL under the Repeatable Read isolation level, what occurs when a transaction attempts to `UPDATE` a row that was updated and committed by a concurrent transaction after the snapshot was established?',
    codeSnippet: `-- Transaction 1 (Repeatable Read):
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1; -- Snapshot taken
-- Transaction 2 (Concurrent):
UPDATE accounts SET balance = balance + 10 WHERE id = 1;
COMMIT;
-- Transaction 1 attempts update:
UPDATE accounts SET balance = balance - 5 WHERE id = 1;`,
    options: [
      { id: 'a', text: 'Transaction 1 quietly overwrites Transaction 2\'s update (Lost Update)' },
      { id: 'b', text: 'Transaction 1 fails immediately with error: "could not serialize access due to concurrent update" (SQLSTATE 40001)' },
      { id: 'c', text: 'Transaction 1 pauses for 10 minutes then executes' },
      { id: 'd', text: 'PostgreSQL restarts the entire server process' },
    ],
    correctOptionId: 'b',
    explanation: 'Under Repeatable Read (First-Committer-Wins rule), when Transaction 1 attempts to update a row modified by a concurrent transaction that committed after Transaction 1\'s snapshot was taken, Transaction 1 cannot modify the newer version without violating its snapshot consistency, so PostgreSQL aborts it with serialization error 40001.',
    conceptTag: 'db-repeatable-read-concurrent-update-error',
  },
  {
    id: 'q-db-acid-28',
    difficulty: 'medium',
    question: 'What are PostgreSQL "Advisory Locks", and when are they appropriately used in application architectures?',
    codeSnippet: `SELECT pg_advisory_xact_lock(123456);`,
    options: [
      { id: 'a', text: 'Advisory locks provide warnings in the server log when queries take longer than 5 seconds' },
      { id: 'b', text: 'They are application-defined distributed mutexes managed by the PostgreSQL lock manager using 64-bit integer keys, without locking any table rows or requiring schema modifications' },
      { id: 'c', text: 'They are recommendations provided by pg_dump during database backups' },
      { id: 'd', text: 'They prevent database users from changing their passwords' },
    ],
    correctOptionId: 'b',
    explanation: 'Advisory locks provide application-level concurrency control explicitly managed by the developer. They use 64-bit arbitrary integers (or pairs of 32-bit integers) and live in PostgreSQL shared memory. They allow coordinating cluster-wide locks (e.g. running a single scheduled cron worker) without dummy tables or row locking.',
    conceptTag: 'db-postgres-advisory-locks',
  },
  {
    id: 'q-db-acid-29',
    difficulty: 'medium',
    question: 'Why does running a long query with `SELECT` block an administrative `ALTER TABLE ... ADD COLUMN` statement in PostgreSQL?',
    options: [
      { id: 'a', text: '`SELECT` acquires an `ACCESS SHARE` lock, and `ALTER TABLE` requires an `ACCESS EXCLUSIVE` lock; because these two lock modes conflict, `ALTER TABLE` must wait for all concurrent readers to finish' },
      { id: 'b', text: 'PostgreSQL cannot execute read and write operations at the same time' },
      { id: 'c', text: '`SELECT` statements write temporary table locks to the WAL' },
      { id: 'd', text: 'PostgreSQL disables schema alterations whenever connection pooling is active' },
    ],
    correctOptionId: 'a',
    explanation: 'Every `SELECT` acquires an `ACCESS SHARE` table-level lock to prevent concurrent alteration of the underlying table structure while rows are being read. `ALTER TABLE` requires an `ACCESS EXCLUSIVE` lock, which conflicts with all other lock modes including `ACCESS SHARE`, so it must queue behind active readers.',
    conceptTag: 'db-table-lock-modes-conflict',
  },
  {
    id: 'q-db-acid-30',
    difficulty: 'medium',
    question: 'How did PostgreSQL 11 eliminate the table-rewrite lock penalty previously associated with `ALTER TABLE ... ADD COLUMN ... DEFAULT ... NOT NULL`?',
    codeSnippet: `ALTER TABLE large_events ADD COLUMN status VARCHAR(20) DEFAULT 'pending' NOT NULL;`,
    options: [
      { id: 'a', text: 'It writes the default value only to the system catalog table without rewriting existing heap pages; rows read without the column dynamically substitute the catalog default' },
      { id: 'b', text: 'It moves all existing table data into a Redis cache' },
      { id: 'c', text: 'It creates a new partition for every existing row' },
      { id: 'd', text: 'It disables NOT NULL constraints permanently' },
    ],
    correctOptionId: 'a',
    explanation: 'Prior to PostgreSQL 11, adding a column with a non-null default required taking an `ACCESS EXCLUSIVE` lock and physically rewriting every single page of the table on disk. PostgreSQL 11+ stores the default value in the `pg_attribute` catalog; when existing rows are read, the executor substitutes the default value in memory, making the migration instantaneous.',
    conceptTag: 'db-instant-alter-table-default',
  },
  {
    id: 'q-db-acid-31',
    difficulty: 'medium',
    question: 'How does MySQL InnoDB prevent phantom reads under its default `REPEATABLE READ` isolation level during locking reads (`SELECT ... FOR UPDATE`)?',
    codeSnippet: `SELECT * FROM inventory WHERE stock BETWEEN 10 AND 20 FOR UPDATE;`,
    options: [
      { id: 'a', text: 'By acquiring a full database cluster exclusive lock' },
      { id: 'b', text: 'By using Next-Key Locks, which combine index-record locks on matching rows with Gap Locks on the index gaps between and around records, preventing other transactions from inserting into the range' },
      { id: 'c', text: 'By converting all INSERT statements into UPDATE statements' },
      { id: 'd', text: 'By aborting all transactions that access the inventory table' },
    ],
    correctOptionId: 'b',
    explanation: 'MySQL InnoDB prevents phantom reads under Repeatable Read using Next-Key Locking. A Next-Key Lock locks both the index record and the "gap" preceding it. By locking the gaps within the predicate range (`stock BETWEEN 10 AND 20`), other transactions attempting to `INSERT` a row with stock 15 are blocked until the transaction commits.',
    conceptTag: 'db-innodb-next-key-locks-gap-locks',
  },
  {
    id: 'q-db-acid-32',
    difficulty: 'medium',
    question: 'Why is leaving a database session in the "idle in transaction" state hazardous to overall PostgreSQL database performance?',
    codeSnippet: `SELECT pid, state, query_start, state_change 
FROM pg_stat_activity 
WHERE state = 'idle in transaction';`,
    options: [
      { id: 'a', text: 'Idle connections consume 100% of server CPU cores continuously' },
      { id: 'b', text: 'An open transaction holds its snapshot and `xmin` horizon; this prevents `autovacuum` from cleaning up dead tuple versions created across the entire database after that `xmin`, causing catastrophic table and index bloat' },
      { id: 'c', text: 'It drops TCP connections to all standby replicas' },
      { id: 'd', text: 'It invalidates SSL certificates' },
    ],
    correctOptionId: 'b',
    explanation: 'An "idle in transaction" connection holds open an active transaction ID (`xmin`). Autovacuum cannot remove dead rows that might still be visible to that transaction\'s `xmin` horizon. If left open for hours, dead tuples accumulate across all updated tables, leading to severe disk bloat and performance degradation.',
    conceptTag: 'db-idle-in-transaction-bloat',
  },
  {
    id: 'q-db-acid-33',
    difficulty: 'medium',
    question: 'What optimization does PostgreSQL apply when an application explicitly declares a transaction as `READ ONLY` under Repeatable Read or Serializable isolation?',
    codeSnippet: `BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;`,
    options: [
      { id: 'a', text: 'The database server skips transaction ID assignment (assigning a virtual XID instead), avoiding transaction counter consumption and simplifying vacuum horizons' },
      { id: 'b', text: 'All data is read from local text files rather than the buffer pool' },
      { id: 'c', text: 'The database shuts down all WAL writing processes' },
      { id: 'd', text: 'Queries bypass all WHERE clauses' },
    ],
    correctOptionId: 'a',
    explanation: 'Read-only transactions that do not perform writes are assigned a virtual transaction ID (`VirtualXID`) rather than consuming a real 32-bit transaction ID (`XID`). This prevents XID consumption toward transaction wraparound limits, eliminates WAL logging overhead, and reduces coordination in the lock manager.',
    conceptTag: 'db-read-only-transaction-optimization',
  },
  {
    id: 'q-db-acid-34',
    difficulty: 'medium',
    question: 'How does Optimistic Concurrency Control (OCC) using an incremental version number prevent lost updates without database-level pessimistic row locks?',
    codeSnippet: `-- Step 1: Read current state
SELECT id, balance, version FROM wallets WHERE id = 10; -- returns version 4
-- Step 2: Update conditionally
UPDATE wallets 
SET balance = balance - 100, version = version + 1 
WHERE id = 10 AND version = 4;`,
    options: [
      { id: 'a', text: 'It locks the entire wallets table in exclusive mode' },
      { id: 'b', text: 'The update succeeds only if the version in the database still matches the version read earlier; if another transaction modified the row in between, zero rows are updated, signaling the application to retry' },
      { id: 'c', text: 'It instructs the database to delete older versions of PostgreSQL' },
      { id: 'd', text: 'It forces the client to recompile its TypeScript code' },
    ],
    correctOptionId: 'b',
    explanation: 'In OCC, records include a `version` or timestamp column. Updates execute with `WHERE id = :id AND version = :readVersion` while incrementing `version = version + 1`. If another transaction updated the row concurrently, the version changed, the update affects 0 rows, and the application detects the conflict and can safely retry.',
    conceptTag: 'db-optimistic-concurrency-control',
  },

  // ============================================================================
  // HARD / ADVANCED (Questions 35 - 50)
  // ============================================================================
  {
    id: 'q-db-acid-35',
    difficulty: 'hard',
    question: 'What theoretical mechanism allows PostgreSQL\'s Serializable Snapshot Isolation (SSI) to guarantee true serializability without using traditional two-phase locking (2PL)?',
    options: [
      { id: 'a', text: 'SSI executes every transaction strictly on a single thread using Redis' },
      { id: 'b', text: 'SSI allows transactions to run concurrently under Snapshot Isolation while dynamically tracking read-write anti-dependencies (rw-conflicts); it aborts transactions only when it detects a cycle in the Serialization Graph' },
      { id: 'c', text: 'SSI requires all database queries to be written as pure functional Haskell expressions' },
      { id: 'd', text: 'SSI forces all transactions to acquire exclusive table locks before reading' },
    ],
    correctOptionId: 'b',
    explanation: 'Developed from research by Cahill, Röhm, and Fekete, PostgreSQL\'s SSI executes transactions under standard non-blocking Snapshot Isolation while recording read-write anti-dependencies (rw-antidependency edges: where a transaction reads a version that a concurrent transaction overwrites). It detects potential cycles in the dependency graph and aborts one transaction with error 40001.',
    conceptTag: 'db-ssi-anti-dependency-tracking',
  },
  {
    id: 'q-db-acid-36',
    difficulty: 'hard',
    question: 'In the Dependency Graph maintained by Serializable Snapshot Isolation (SSI), what specific subgraph pattern represents a "dangerous structure" that triggers a serialization failure?',
    options: [
      { id: 'a', text: 'A single read lock on an unindexed foreign key' },
      { id: 'b', text: 'Two consecutive rw-antidependency edges (T1 --rw--> T2 --rw--> T3) where T2 is both a reader that conflicts with an active writer and a writer that conflicts with an active reader' },
      { id: 'c', text: 'A transaction that executes for more than 10 seconds' },
      { id: 'd', text: 'An index scan that accesses more than 1,000 pages' },
    ],
    correctOptionId: 'b',
    explanation: 'In SSI theory, any non-serializable execution cycle under Snapshot Isolation must contain a pivot transaction that has both an incoming rw-antidependency edge and an outgoing rw-antidependency edge (`inConflict` and `outConflict` flags). When such a consecutive pair (`T1 --rw--> T2 --rw--> T3`) is detected, SSI aborts the pivot transaction to prevent non-serializable anomalies.',
    conceptTag: 'db-ssi-dangerous-structure-cycles',
  },
  {
    id: 'q-db-acid-37',
    difficulty: 'hard',
    question: 'How does Strict Two-Phase Locking (SS2PL or Rigorous 2PL) differ from standard Two-Phase Locking (2PL)?',
    options: [
      { id: 'a', text: 'In standard 2PL, locks can be released during the shrinking phase before the transaction commits; in Strict 2PL, all exclusive (and in Rigorous 2PL, all shared) locks are held until the transaction finishes (COMMIT or ROLLBACK)' },
      { id: 'b', text: 'Strict 2PL requires locks to be approved by two separate database administrators' },
      { id: 'c', text: 'Strict 2PL eliminates all deadlocks completely' },
      { id: 'd', text: 'Strict 2PL executes without WAL logging' },
    ],
    correctOptionId: 'a',
    explanation: 'In basic 2PL, once a transaction releases any lock, it enters the shrinking phase and cannot acquire any new locks. However, releasing locks before commit can cause cascading aborts if the transaction later rolls back. Strict 2PL prevents cascading aborts by holding all exclusive locks until commit/abort, ensuring strict serializability.',
    conceptTag: 'db-strict-2pl-vs-2pl',
  },
  {
    id: 'q-db-acid-38',
    difficulty: 'hard',
    question: 'In the Two-Phase Commit (2PC) distributed protocol, what is the "In-Doubt" window and why is coordinator failure catastrophic during this phase?',
    codeSnippet: `// Phase 1 (Prepare): Coordinator asks all cohorts "Can you commit?"
// Cohort A: Voted YES (Prepared, wrote change to disk, locks held)
// [Coordinator crashes before sending Phase 2 COMMIT/ABORT message!]`,
    options: [
      { id: 'a', text: 'The cohorts automatically roll back immediately, losing data' },
      { id: 'b', text: 'Cohorts that voted YES have locked local resources and cannot unilaterally commit or abort without violating consistency; they are stuck "in-doubt" holding locks until the coordinator recovers' },
      { id: 'c', text: 'The cohorts elect a new leader using DNS round-robin' },
      { id: 'd', text: 'The in-doubt window automatically merges with Git master' },
    ],
    correctOptionId: 'b',
    explanation: '2PC is a blocking protocol. Once a cohort votes YES in the Prepare phase, it guarantees it can commit. If the coordinator crashes before broadcasting the commit/abort decision, the cohort cannot unilaterally abort (the coordinator might have decided COMMIT) nor unilaterally commit (another cohort might have voted NO). It remains in-doubt, holding locks indefinitely.',
    conceptTag: 'db-2pc-in-doubt-blocking',
  },
  {
    id: 'q-db-acid-39',
    difficulty: 'hard',
    question: 'How do Predicate Locks (SIREAD locks) function in PostgreSQL\'s Serializable isolation level, and what happens when predicate lock memory is exhausted?',
    codeSnippet: `SELECT * FROM orders WHERE status = 'pending' AND amount > 1000;`,
    options: [
      { id: 'a', text: 'They block concurrent writers from inserting rows matching the predicate' },
      { id: 'b', text: 'SIREAD locks do not block writers at all; they are non-blocking tracking markers in shared memory. When memory exceeds `max_pred_locks_per_transaction`, lock granularity promotes from tuples to whole pages, or from pages to tables, increasing false-positive aborts' },
      { id: 'c', text: 'Predicate locks write entries directly into the table heap pages' },
      { id: 'd', text: 'Exhausted predicate memory forces the database to drop table constraints' },
    ],
    correctOptionId: 'b',
    explanation: 'In PostgreSQL SSI, SIREAD locks are completely non-blocking tags recorded in shared memory to track what data a transaction has inspected. If too many fine-grained tuple SIREAD locks are created, the engine promotes them to page-level or relation-level SIREAD locks to conserve RAM. This coarse granularity increases false-positive serialization conflicts.',
    conceptTag: 'db-siread-predicate-lock-promotion',
  },
  {
    id: 'q-db-acid-40',
    difficulty: 'hard',
    question: 'In a distributed microservice architecture where OrderService and InventoryService manage separate PostgreSQL databases, why cannot local ACID transactions prevent distributed inconsistent analysis or partial failures without a distributed coordination pattern?',
    options: [
      { id: 'a', text: 'PostgreSQL does not support TCP networking across Docker containers' },
      { id: 'b', text: 'Each database maintains an independent transaction coordinator and WAL; a failure or network partition occurring after OrderService commits but before InventoryService commits leaves the overall distributed system in an inconsistent state' },
      { id: 'c', text: 'Distributed microservices cannot serialize JSON over HTTP' },
      { id: 'd', text: 'Microservices automatically convert SQL databases into MongoDB' },
    ],
    correctOptionId: 'b',
    explanation: 'Local ACID transactions only guarantee atomicity and durability within a single database instance. In microservices with Database-per-Service patterns, each database commits independently. A network partition or crash between service calls creates partial failures that cannot be rolled back by local database mechanisms.',
    conceptTag: 'db-distributed-transaction-microservices',
  },
  {
    id: 'q-db-acid-41',
    difficulty: 'hard',
    question: 'In the Saga pattern for distributed transactions, what is a "Compensating Transaction", and what semantic guarantee does it provide instead of ACID atomicity?',
    options: [
      { id: 'a', text: 'It creates a hardware snapshot of the hypervisor' },
      { id: 'b', text: 'An explicit backward undo operation (e.g. `RefundPayment` compensating for `ChargePayment`) that semantically reverses the business effect of a previously committed local step when a subsequent step in the saga fails, providing eventual consistency rather than ACID isolation' },
      { id: 'c', text: 'It pays financial compensation to users during server downtime' },
      { id: 'd', text: 'It is a specialized SQL trigger that restores dropped tables' },
    ],
    correctOptionId: 'b',
    explanation: 'Because the Saga pattern breaks a distributed transaction into a sequence of locally committed transactions, it sacrifices ACID Isolation (intermediate states are visible). If step N fails, compensating transactions are executed in reverse order for steps N-1 down to 1 to semantically undo their effects, restoring eventual consistency.',
    conceptTag: 'db-saga-pattern-compensating-transactions',
  },
  {
    id: 'q-db-acid-42',
    difficulty: 'hard',
    question: 'What are the standardized phases and commands of the X/Open XA standard for distributed transactions supported by PostgreSQL and Java JTA?',
    codeSnippet: `XA START 'xid_123';
-- SQL queries
XA END 'xid_123';
XA PREPARE 'xid_123';
XA COMMIT 'xid_123';`,
    options: [
      { id: 'a', text: '`XA START` creates an in-memory hash map, and `XA COMMIT` writes to Redis' },
      { id: 'b', text: '`XA START`/`END` delimit work associated with a global transaction ID; `XA PREPARE` executes Phase 1 of Two-Phase Commit and makes changes durable; `XA COMMIT`/`ROLLBACK` executes Phase 2 under external transaction manager coordination' },
      { id: 'c', text: 'XA commands can only be executed by database drivers written in C++' },
      { id: 'd', text: '`XA PREPARE` drops all secondary indexes on the table' },
    ],
    correctOptionId: 'b',
    explanation: 'The X/Open XA specification defines an interface between a global Transaction Manager (TM) and local Resource Managers (RMs / databases). `XA PREPARE` verifies that the local database has written all redo logs so that it can guarantee commit even after a crash; the TM then issues `XA COMMIT` across all participating databases.',
    conceptTag: 'db-xa-transactions-two-phase-commit',
  },
  {
    id: 'q-db-acid-43',
    difficulty: 'hard',
    question: 'What is the catastrophic "Transaction ID (XID) Wraparound" failure mode in PostgreSQL, and how does the engine protect itself if autovacuum fails to freeze old tuples?',
    options: [
      { id: 'a', text: 'PostgreSQL runs out of file descriptors and switches all tables to unlogged mode' },
      { id: 'b', text: 'PostgreSQL uses a 32-bit transaction counter (~4 billion XIDs, with 2 billion in past and 2 billion in future); if `autovacuum_freeze_max_age` is breached and remaining XIDs reach a critical safety threshold, PostgreSQL shuts down entirely into read-only emergency mode to prevent silent data corruption' },
      { id: 'c', text: 'XID wraparound automatically upgrades the database to 64-bit transaction IDs without downtime' },
      { id: 'd', text: 'It truncates all tables created more than 1 year ago' },
    ],
    correctOptionId: 'b',
    explanation: 'PostgreSQL represents transaction IDs with a 32-bit integer. XID comparisons use modular arithmetic where half the space is in the "past" and half in the "future". If old tuples are not frozen via `VACUUM FREEZE` before ~2 billion transactions elapse, past tuples would appear to be in the future (becoming invisible). To prevent this, Postgres halts all write operations when the margin shrinks.',
    conceptTag: 'db-xid-wraparound-vacuum-freeze',
  },
  {
    id: 'q-db-acid-44',
    difficulty: 'hard',
    question: 'Why does executing a query under Serializable Snapshot Isolation (SSI) without an index on the filtered column frequently trigger false-positive serialization failures (`could not serialize access`)?',
    codeSnippet: `-- Table has 10,000,000 rows, no index on status:
SELECT * FROM orders WHERE status = 'expedited';`,
    options: [
      { id: 'a', text: 'Without an index, the query must execute a Sequential Scan; this creates SIREAD predicate locks on EVERY page and tuple in the entire table, causing any concurrent write anywhere on the table to create a conflicting rw-antidependency' },
      { id: 'b', text: 'PostgreSQL disables SSI on tables that do not have primary keys' },
      { id: 'c', text: 'Sequential scans bypass the SSI engine and cause kernel panics' },
      { id: 'd', text: 'Without an index, the database can only use Read Uncommitted' },
    ],
    correctOptionId: 'a',
    explanation: 'In SSI, the engine acquires SIREAD locks on the granular objects visited during query execution. With an index, it locks only the specific index pages and matching tuples. With a Sequential Scan, it reads every page in the table, acquiring SIREAD locks on every relation page. Any subsequent write anywhere in the table triggers an anti-dependency, causing spurious aborts.',
    conceptTag: 'db-ssi-index-lack-false-positives',
  },
  {
    id: 'q-db-acid-45',
    difficulty: 'hard',
    question: 'What is the precise distinction between "Linearizability" and "Serializability" in distributed database literature?',
    options: [
      { id: 'a', text: 'Linearizability and Serializability are identical terms coined by different database vendors' },
      { id: 'b', text: 'Serializability is a multi-operation, multi-object property guaranteeing that transactions execute as if in some serial order (without real-time ordering constraints); Linearizability is a single-operation, single-object real-time recency guarantee' },
      { id: 'c', text: 'Linearizability only applies to SQL databases, while Serializability only applies to NoSQL key-value stores' },
      { id: 'd', text: 'Serializability requires all machines to use the exact same CPU clock frequency' },
    ],
    correctOptionId: 'b',
    explanation: 'As defined by Herlihy, Wing, and Papadimitriou, Serializability ensures transactions appear to run sequentially in some valid order, but does not impose real-time constraints (a serializable system could return yesterday\'s state if consistent). Linearizability guarantees that any read operation started after a write completes must observe that write or a later one. Combining both yields "Strict Serializability" (External Consistency).',
    conceptTag: 'db-linearizability-vs-serializability',
  },
  {
    id: 'q-db-acid-46',
    difficulty: 'hard',
    question: 'How does the Calvin distributed transaction protocol achieve high-throughput ACID transactions across partitions while eliminating Two-Phase Commit (2PC) and distributed lock managers?',
    options: [
      { id: 'a', text: 'By assigning all data to a single in-memory server' },
      { id: 'b', text: 'By using an independent consensus sequencing layer (e.g. Raft/Paxos) to agree on a global deterministic transaction execution order BEFORE transactions execute, allowing storage nodes to execute them deterministically without interactive coordination' },
      { id: 'c', text: 'By converting all transactions into asynchronous background threads' },
      { id: 'd', text: 'By dropping ACID guarantees in favor of BASE eventual consistency' },
    ],
    correctOptionId: 'b',
    explanation: 'The Calvin protocol separates transaction ordering from transaction execution. An independent sequencer uses Paxos to establish a globally agreed, deterministic transaction log. Worker nodes then execute transactions in strict sequence order without interactive lock acquisition or distributed 2PC commit phases, eliminating distributed deadlock and coordinator blocking.',
    conceptTag: 'db-calvin-deterministic-transactions',
  },
  {
    id: 'q-db-acid-47',
    difficulty: 'hard',
    question: 'In the Google Percolator transaction model (used by TiKV and CockroachDB design precedents), how are distributed transactions committed over a distributed key-value store without a centralized lock manager?',
    options: [
      { id: 'a', text: 'All writes are routed through an active-active master MySQL node' },
      { id: 'b', text: 'Transactions designate one key as the Primary Lock key and remaining keys as Secondary Locks pointing to the primary; committing the primary lock atomically commits the entire distributed transaction' },
      { id: 'c', text: 'Percolator locks all SSD flash blocks using NVMe hardware commands' },
      { id: 'd', text: 'Percolator requires client applications to keep persistent TCP connections open for 24 hours' },
    ],
    correctOptionId: 'b',
    explanation: 'Percolator uses two-phase commit with decentralized lock records stored alongside data columns. One write is designated the "primary lock", and secondary writes record references pointing to the primary key. In the second phase, the client only commits the primary lock record; once the primary lock transitions to committed, the entire transaction is atomically committed.',
    conceptTag: 'db-percolator-transaction-model',
  },
  {
    id: 'q-db-acid-48',
    difficulty: 'hard',
    question: 'Why can physical clock skew (NTP drift) in multi-datacenter distributed databases violate causality and cause "stale reads" under Snapshot Isolation without TrueTime or hybrid clocks?',
    options: [
      { id: 'a', text: 'NTP drift causes CPU fans to slow down, throttling query compilation' },
      { id: 'b', text: 'If Node A has a physical clock running 20ms behind Node B, a transaction committed on Node B at physical time T2 could receive a timestamp earlier than an event that caused it on Node A at time T1, causing readers to miss the causal update' },
      { id: 'c', text: 'Clock skew forces PostgreSQL to delete its WAL directory' },
      { id: 'd', text: 'Distributed databases crash if clocks differ by more than 1 microsecond' },
    ],
    correctOptionId: 'b',
    explanation: 'Snapshot Isolation requires assigning monotonically increasing timestamps to reflect transaction commit order. If physical clocks drift across nodes, Transaction 2 (which causally depends on Transaction 1) could be stamped with a timestamp smaller than Transaction 1. A client reading at Transaction 2\'s timestamp would not see Transaction 1\'s writes, violating causality.',
    conceptTag: 'db-clock-skew-causality-violations',
  },
  {
    id: 'q-db-acid-49',
    difficulty: 'hard',
    question: 'What is the "Subtransaction Performance Cliff" in PostgreSQL when ORMs nest dozens of `SAVEPOINT`s inside a high-concurrency transaction?',
    options: [
      { id: 'a', text: 'PostgreSQL caps each transaction at exactly 3 savepoints and drops subsequent requests' },
      { id: 'b', text: 'Each `SAVEPOINT` consumes a subtransaction ID (subxid); when a transaction accumulates more than 64 subxids, PostgreSQL cannot cache them in the shared memory `PGPROC` struct and must spill lookups to the disk-based `pg_subtrans` SLRU cache, causing extreme lock contention on `SubtransSLRU`' },
      { id: 'c', text: 'Subtransactions force all tables to be vacuumed synchronously' },
      { id: 'd', text: 'Subtransactions disable B-Tree indexes on foreign keys' },
    ],
    correctOptionId: 'b',
    explanation: 'PostgreSQL can cache up to 64 subtransaction IDs (subxids) directly in shared memory for each process (`PGPROC`). If an application (or ORM) exceeds 64 savepoints, subxids overflow into `pg_subtrans` disk/SLRU structures. In high-concurrency systems, concurrent workers thrash the `SubtransSLRU` lock checking transaction visibility, cratering throughput.',
    conceptTag: 'db-postgres-subtransaction-performance-cliff',
  },
  {
    id: 'q-db-acid-50',
    difficulty: 'hard',
    question: 'In distributed deadlock detection, how does the "Wait-Die" scheme differ from the "Wound-Wait" scheme when resolving conflicts between older transactions (T_old) and younger transactions (T_young)?',
    options: [
      { id: 'a', text: 'In Wait-Die, T_old is always aborted; in Wound-Wait, T_young is never aborted' },
      { id: 'b', text: 'In Wait-Die (non-preemptive), if T_old requests a lock held by T_young, T_old waits; if T_young requests a lock held by T_old, T_young dies (aborts). In Wound-Wait (preemptive), if T_old requests a lock held by T_young, T_old "wounds" (aborts) T_young; if T_young requests a lock held by T_old, T_young waits' },
      { id: 'c', text: 'Wait-Die only works on MySQL; Wound-Wait only works on Oracle' },
      { id: 'd', text: 'Both schemes immediately terminate all active transactions across the cluster' },
    ],
    correctOptionId: 'b',
    explanation: 'Both Wait-Die and Wound-Wait use transaction timestamps to prevent deadlocks without cycle-detection algorithms. In Wait-Die, older transactions wait for younger ones, but younger transactions immediately die when requesting resources held by older ones. In Wound-Wait, older transactions preemptively abort younger lock-holders ("wound"), minimizing restarts of long-running transactions.',
    conceptTag: 'db-distributed-deadlock-wait-die-wound-wait',
  },
];
