import type { QuizQuestion } from '../../../../src/types';

export const RELATIONAL_INDEXES_50_QUESTIONS: QuizQuestion[] = [
  // ============================================================================
  // EASY / FOUNDATIONAL (Questions 1 - 17)
  // ============================================================================
  {
    id: 'q-db-idx-1',
    difficulty: 'easy',
    question: 'In relational database management systems (RDBMS) such as PostgreSQL and MySQL, what is the core structural characteristic of a standard B-Tree index?',
    codeSnippet: `CREATE INDEX idx_users_email ON users(email);`,
    options: [
      { id: 'a', text: 'A hash table providing O(1) lookups for equality and range queries' },
      { id: 'b', text: 'A balanced search tree where all leaf nodes reside at identical depth and internal nodes route keys to subtrees' },
      { id: 'c', text: 'An append-only log that must be rebuilt completely after every transaction commit' },
      { id: 'd', text: 'An unorganized heap file scanned sequentially using SIMD instructions' },
    ],
    correctOptionId: 'b',
    explanation: 'A B-Tree (and specifically B+ Tree variants used in RDBMS) is a self-balancing search tree where all leaf nodes remain at equal depth. Internal nodes store routing keys and child page pointers, providing O(log N) search, insertion, and deletion complexity.',
    conceptTag: 'db-btree-structure',
  },
  {
    id: 'q-db-idx-2',
    difficulty: 'easy',
    question: 'What is the fundamental architectural difference between a Clustered Index and a Non-Clustered (Secondary) Index?',
    options: [
      { id: 'a', text: 'A clustered index only stores string values, whereas non-clustered indexes store numbers' },
      { id: 'b', text: 'A clustered index determines the physical storage order of table rows on disk, while a non-clustered index stores index keys with pointers to heap or clustered rows' },
      { id: 'c', text: 'A table can have dozens of clustered indexes, but at most one non-clustered index' },
      { id: 'd', text: 'Non-clustered indexes reside in RAM, while clustered indexes only reside on network storage' },
    ],
    correctOptionId: 'b',
    explanation: 'A clustered index physically sorts the actual table records on disk according to the indexed key (like in MySQL InnoDB or SQL Server). Because rows can only be physically stored in one order, a table can only have one clustered index. Non-clustered indexes are auxiliary structures storing pointers (TIDs or primary keys) to the base rows.',
    conceptTag: 'db-clustered-vs-nonclustered',
  },
  {
    id: 'q-db-idx-3',
    difficulty: 'easy',
    question: 'When defining a PRIMARY KEY constraint on a table in PostgreSQL or MySQL InnoDB, how does the database engine handle indexing automatically under the hood?',
    codeSnippet: `CREATE TABLE accounts (
  id BIGINT PRIMARY KEY,
  owner_name VARCHAR(100) NOT NULL
);`,
    options: [
      { id: 'a', text: 'It creates a partial GIN index across non-null columns' },
      { id: 'b', text: 'It automatically creates a UNIQUE B-Tree index on the primary key column to enforce uniqueness and accelerate lookups' },
      { id: 'c', text: 'It relies on sequential scans and creates no index unless explicitly specified' },
      { id: 'd', text: 'It constructs a non-durable hash index that resets on server reboot' },
    ],
    correctOptionId: 'b',
    explanation: 'RDBMS engines enforce PRIMARY KEY uniqueness and rapid point lookups by automatically provisioning a unique B-Tree index on the primary key column(s). In engines like InnoDB, this automatically serves as the table\'s clustered index.',
    conceptTag: 'db-primary-key-index',
  },
  {
    id: 'q-db-idx-4',
    difficulty: 'easy',
    question: 'Consider a composite index created on columns (tenant_id, created_at, status). According to the "leftmost prefix rule", which of the following query WHERE clauses CANNOT utilize this index effectively?',
    codeSnippet: `CREATE INDEX idx_events_lookup ON events (tenant_id, created_at, status);`,
    options: [
      { id: 'a', text: 'WHERE tenant_id = 42' },
      { id: 'b', text: 'WHERE tenant_id = 42 AND created_at >= \'2024-01-01\'' },
      { id: 'c', text: 'WHERE created_at >= \'2024-01-01\' AND status = \'completed\'' },
      { id: 'd', text: 'WHERE tenant_id = 42 AND created_at = \'2024-01-01\' AND status = \'completed\'' },
    ],
    correctOptionId: 'c',
    explanation: 'Composite B-Tree indexes are sorted hierarchically starting with the leading (first) column. If a query does not filter on the leftmost column ("tenant_id"), the index tree cannot be traversed directly from the root to locate candidate leaf pages, forcing a full table scan or an inefficient index full scan.',
    conceptTag: 'db-composite-leftmost-prefix',
  },
  {
    id: 'q-db-idx-5',
    difficulty: 'easy',
    question: 'You have a composite index on (department_id, salary, employee_name). How does a range condition on "salary" affect the utilization of "employee_name" in the index?',
    codeSnippet: `SELECT * FROM employees 
WHERE department_id = 10 
  AND salary > 80000 
  AND employee_name = 'Alice';`,
    options: [
      { id: 'a', text: 'The index is ignored completely because range queries disable composite indexes' },
      { id: 'b', text: 'The index traverses department_id and salary, but employee_name cannot be used as a direct seek key; it can only serve as an index filter' },
      { id: 'c', text: 'The planner flips the column order dynamically at runtime so employee_name is evaluated first' },
      { id: 'd', text: 'The database creates an emergency temporary index on employee_name in tempdb' },
    ],
    correctOptionId: 'b',
    explanation: 'Once a range/inequality comparison (e.g. > , <, BETWEEN) is encountered on an indexed column, subsequent columns in the composite index cannot be used to narrow down the B-tree seek range because entries across different salary values are no longer sorted by employee_name. They may only be evaluated as secondary filter predicates on matched index entries (Index Condition Pushdown).',
    conceptTag: 'db-composite-range-behavior',
  },
  {
    id: 'q-db-idx-6',
    difficulty: 'easy',
    question: 'What is the critical operational difference between running `EXPLAIN` and running `EXPLAIN ANALYZE` on a SQL query in PostgreSQL?',
    codeSnippet: `EXPLAIN ANALYZE SELECT * FROM orders WHERE total_cents > 10000;`,
    options: [
      { id: 'a', text: 'EXPLAIN produces execution estimates based on statistics without running the query, whereas EXPLAIN ANALYZE executes the query to collect actual runtimes and row counts' },
      { id: 'b', text: 'EXPLAIN modifies table schema, while EXPLAIN ANALYZE runs in read-only mode' },
      { id: 'c', text: 'EXPLAIN runs the query against standby replicas, while EXPLAIN ANALYZE runs on the primary' },
      { id: 'd', text: 'EXPLAIN output is written to disk, while EXPLAIN ANALYZE prints only in memory' },
    ],
    correctOptionId: 'a',
    explanation: '`EXPLAIN` generates and displays the planner\'s estimated execution plan without executing the query. `EXPLAIN ANALYZE` actually executes the query (including any DML side-effects!), measuring real CPU times, actual row counts, and buffer cache hits.',
    conceptTag: 'db-explain-vs-explain-analyze',
  },
  {
    id: 'q-db-idx-7',
    difficulty: 'easy',
    question: 'Why does the query planner frequently choose a "Seq Scan" (Sequential Scan) over an "Index Scan" when querying a small table with only 50 rows, even though an index exists on the searched column?',
    options: [
      { id: 'a', text: 'Small tables are corrupted if index lookups are attempted' },
      { id: 'b', text: 'Reading a single disk page sequentially into memory incurs far less overhead than traversing index tree pages and then reading the table heap page' },
      { id: 'c', text: 'B-Tree indexes cannot index fewer than 1,000 entries' },
      { id: 'd', text: 'PostgreSQL disables indexes when the database runs in transaction isolation mode' },
    ],
    correctOptionId: 'b',
    explanation: 'When a table fits entirely in one or two 8KB disk pages, a sequential scan reads those pages in one sequential I/O operation. An index scan would require reading the root page, leaf page, and then the heap page—generating more page reads and CPU cycles than reading the whole table directly.',
    conceptTag: 'db-seq-scan-costing',
  },
  {
    id: 'q-db-idx-8',
    difficulty: 'easy',
    question: 'What distinguishes an "Index Scan" from an "Index Only Scan" in PostgreSQL query plans?',
    options: [
      { id: 'a', text: 'Index Only Scan encrypts the result set before sending it to the client' },
      { id: 'b', text: 'Index Scan reads index entries and visits the table heap to retrieve remaining row columns; Index Only Scan satisfies the query entirely from the index leaf pages' },
      { id: 'c', text: 'Index Only Scan only works on primary keys, while Index Scan works on foreign keys' },
      { id: 'd', text: 'Index Scan requires locking the table exclusively, while Index Only Scan takes no locks' },
    ],
    correctOptionId: 'b',
    explanation: 'An Index Scan retrieves tuple pointers (TIDs) from the index and fetches table heap pages to read row columns. An Index Only Scan retrieves all needed columns directly from the index tuples without visiting heap pages (provided the visibility map confirms pages contain no dead rows).',
    conceptTag: 'db-index-scan-vs-index-only-scan',
  },
  {
    id: 'q-db-idx-9',
    difficulty: 'easy',
    question: 'How do B+ Tree leaf node structures enable rapid evaluation of range queries such as `WHERE created_at BETWEEN \'2024-01-01\' AND \'2024-01-31\'`?',
    options: [
      { id: 'a', text: 'Every leaf node recomputes an MD5 checksum of adjacent nodes' },
      { id: 'b', text: 'Leaf nodes form a doubly linked list, allowing the engine to seek the lower bound once and traverse sibling pages sequentially' },
      { id: 'c', text: 'The B-Tree converts the range query into an asynchronous recursive function call' },
      { id: 'd', text: 'Leaf nodes store full table backups in compressed zip archives' },
    ],
    correctOptionId: 'b',
    explanation: 'In a B+ Tree, leaf nodes contain sibling pointers (doubly linked list). For a range query, the engine performs a single tree descent to locate the start key (lower bound), and then walks horizontally across leaf pages until the upper bound is reached, avoiding repeated tree traversals.',
    conceptTag: 'db-btree-leaf-pointers',
  },
  {
    id: 'q-db-idx-10',
    difficulty: 'easy',
    question: 'Why does applying a SQL scalar function like `LOWER(email)` in a WHERE clause typically prevent the database planner from using a standard B-Tree index on `email`?',
    codeSnippet: `SELECT id FROM users WHERE LOWER(email) = 'engineer@example.com';`,
    options: [
      { id: 'a', text: 'The index stores original case-preserved values, not the computed output of LOWER(email), forcing the engine to compute the function on every row' },
      { id: 'b', text: 'LOWER() is an asynchronous JavaScript function incompatible with SQL engines' },
      { id: 'c', text: 'B-Tree indexes cannot index string datatypes' },
      { id: 'd', text: 'SQL standards prohibit string comparisons in indexed tables' },
    ],
    correctOptionId: 'a',
    explanation: 'A regular B-Tree index on `email` is ordered by the literal values stored in that column. Because the query tests `LOWER(email)`, the database cannot look up the transformed string directly unless an expression/functional index on `LOWER(email)` has been explicitly created.',
    conceptTag: 'db-function-on-indexed-column',
  },
  {
    id: 'q-db-idx-11',
    difficulty: 'easy',
    question: 'Given an index on column `username`, which of the following pattern-matching queries can take advantage of a standard B-Tree index scan?',
    codeSnippet: `CREATE INDEX idx_users_username ON users(username);`,
    options: [
      { id: 'a', text: 'SELECT * FROM users WHERE username LIKE \'%alex\'' },
      { id: 'b', text: 'SELECT * FROM users WHERE username LIKE \'%alex%\'' },
      { id: 'c', text: 'SELECT * FROM users WHERE username LIKE \'alex%\'' },
      { id: 'd', text: 'SELECT * FROM users WHERE username ILIKE \'%alex%\'' },
    ],
    correctOptionId: 'c',
    explanation: 'A B-Tree sorts values alphabetically from left to right. A prefix query like `\'alex%\'` establishes clear lower and upper seek boundaries (\'alex\' to \'alez\'). A leading wildcard like `\'%alex\'` matches suffixes anywhere in the string, making B-Tree bounds lookup impossible and forcing a sequential scan.',
    conceptTag: 'db-like-wildcard-index',
  },
  {
    id: 'q-db-idx-12',
    difficulty: 'easy',
    question: 'What write amplification cost occurs when creating multiple secondary indexes on a frequently updated table in PostgreSQL or MySQL?',
    options: [
      { id: 'a', text: 'Every INSERT and DELETE, as well as UPDATEs to indexed columns, must synchronously update every corresponding secondary index structure' },
      { id: 'b', text: 'Read queries on unaffected tables are permanently blocked' },
      { id: 'c', text: 'The database server converts all tables to read-only mode' },
      { id: 'd', text: 'Database connections are restricted to one client at a time' },
    ],
    correctOptionId: 'a',
    explanation: 'Indexes are not free. For every new row inserted or deleted, every secondary index must be updated. For updates modifying indexed columns, the corresponding index trees must insert new keys and balance pages, increasing I/O, lock contention, and WAL generation.',
    conceptTag: 'db-write-amplification-indexes',
  },
  {
    id: 'q-db-idx-13',
    difficulty: 'easy',
    question: 'In MySQL InnoDB, how does a secondary index point to the underlying table row, and what lookup cost does this introduce?',
    options: [
      { id: 'a', text: 'It stores a direct physical memory pointer to RAM' },
      { id: 'b', text: 'It stores the primary key value; non-covering secondary lookups require a second B-Tree traversal of the clustered index (bookmark lookup)' },
      { id: 'c', text: 'It stores the physical byte offset on disk, preventing table fragmentation' },
      { id: 'd', text: 'It stores an unencrypted hash of the entire table' },
    ],
    correctOptionId: 'b',
    explanation: 'In InnoDB, the clustered index leaf pages hold the actual row data. Secondary indexes store the primary key as their row locator. If a query requests columns not present in the secondary index, InnoDB reads the primary key from the secondary index and traverses the clustered index B-Tree (secondary lookup / bookmark lookup).',
    conceptTag: 'db-innodb-secondary-index-lookup',
  },
  {
    id: 'q-db-idx-14',
    difficulty: 'easy',
    question: 'In PostgreSQL EXPLAIN output, what do the two floating-point numbers in the expression `(cost=0.42..8.44 rows=10 width=64)` represent?',
    codeSnippet: `Index Scan using idx_users_id on users (cost=0.42..8.44 rows=10 width=64)`,
    options: [
      { id: 'a', text: 'Elapsed time in milliseconds and microsecond jitter' },
      { id: 'b', text: 'Estimated startup cost to return the first row (0.42) and estimated total cost to return all rows (8.44), in arbitrary disk page fetch cost units' },
      { id: 'c', text: 'The percentage of CPU and GPU utilization during execution' },
      { id: 'd', text: 'Network latency in round-trips to the storage area network (SAN)' },
    ],
    correctOptionId: 'b',
    explanation: 'PostgreSQL planner costs are dimensionless units where 1.0 conventionally equals the cost of a single sequential page read (`seq_page_cost`). The first number (0.42) is the startup cost before the node can emit its first row; the second (8.44) is the total estimated cost to complete the plan node.',
    conceptTag: 'db-explain-cost-metrics',
  },
  {
    id: 'q-db-idx-15',
    difficulty: 'easy',
    question: 'Given an indexed VARCHAR column `phone_number`, what happens when a query executes `WHERE phone_number = 1234567890` (using an unquoted numeric literal)?',
    codeSnippet: `CREATE INDEX idx_users_phone ON users(phone_number);
-- Query:
SELECT * FROM users WHERE phone_number = 1234567890;`,
    options: [
      { id: 'a', text: 'PostgreSQL silently drops the index and deletes duplicate records' },
      { id: 'b', text: 'Implicit type casting converts `phone_number` to an integer (`CAST(phone_number AS bigint)`), disabling the B-Tree index and forcing a full table scan' },
      { id: 'c', text: 'The index is upgraded to a numeric hash index in place' },
      { id: 'd', text: 'The query triggers a compile error and rejects the connection immediately' },
    ],
    correctOptionId: 'b',
    explanation: 'Due to datatype precedence rules, when comparing a text column to an integer literal, engines like Postgres/MySQL cast the column values to numbers rather than casting the literal to text. This wraps the column in an implicit type conversion function, invalidating the standard B-tree index.',
    conceptTag: 'db-implicit-type-coercion-index',
  },
  {
    id: 'q-db-idx-16',
    difficulty: 'easy',
    question: 'How does a UNIQUE constraint differ from a PRIMARY KEY constraint with respect to NULL values in standard SQL (ANSI/ISO SQL)?',
    options: [
      { id: 'a', text: 'A PRIMARY KEY allows multiple NULL entries, but UNIQUE constraints reject all NULLs' },
      { id: 'b', text: 'A PRIMARY KEY strictly disallows NULLs, whereas UNIQUE constraints generally permit multiple NULL values because in SQL NULL is not equal to NULL' },
      { id: 'c', text: 'There is zero difference; UNIQUE and PRIMARY KEY are identical keywords' },
      { id: 'd', text: 'UNIQUE constraints only apply to foreign keys' },
    ],
    correctOptionId: 'b',
    explanation: 'A PRIMARY KEY enforces both uniqueness and NOT NULL on all designated columns. In standard SQL (and PostgreSQL/MySQL), a UNIQUE index allows multiple rows to contain NULL because NULL represents an unknown value, and `NULL = NULL` evaluates to UNKNOWN (false).',
    conceptTag: 'db-unique-constraint-nulls',
  },
  {
    id: 'q-db-idx-17',
    difficulty: 'easy',
    question: 'You create an index with `CREATE INDEX idx_events_time ON events (created_at DESC);`. Can this index still be used efficiently for a query requesting `ORDER BY created_at ASC`?',
    codeSnippet: `SELECT * FROM events ORDER BY created_at ASC LIMIT 10;`,
    options: [
      { id: 'a', text: 'No, B-Trees can only be scanned in the exact physical direction they were constructed' },
      { id: 'b', text: 'Yes, standard B-Trees maintain bidirectional leaf pointers, allowing the database engine to perform a Backward Index Scan with equivalent efficiency' },
      { id: 'c', text: 'Only if the table contains fewer than 100 rows' },
      { id: 'd', text: 'Yes, but the planner must copy all rows into a temporary hash table first' },
    ],
    correctOptionId: 'b',
    explanation: 'Because B-Tree leaf pages have bidirectional pointers (prev and next links), the database engine can traverse the index forward or backward with virtually equal efficiency for single-column indexes. An index created DESC can satisfy an ASC sort using a "Backward Index Scan".',
    conceptTag: 'db-btree-scan-direction',
  },

  // ============================================================================
  // MEDIUM / INTERMEDIATE (Questions 18 - 34)
  // ============================================================================
  {
    id: 'q-db-idx-18',
    difficulty: 'medium',
    question: 'What is the primary architectural advantage of using the `INCLUDE` clause when creating a covering index in modern PostgreSQL (11+)?',
    codeSnippet: `CREATE INDEX idx_orders_customer_covering 
ON orders (customer_id) 
INCLUDE (order_total, status);`,
    options: [
      { id: 'a', text: 'Included columns are added to all B-Tree intermediate navigation nodes to speed up binary search' },
      { id: 'b', text: 'Included columns are stored only in the leaf pages as payload attributes, keeping intermediate navigation pages compact and preserving unique constraint scopes on key columns' },
      { id: 'c', text: 'Included columns are automatically compressed using Brotli compression' },
      { id: 'd', text: 'Included columns are replicated to standby replicas ahead of the main index' },
    ],
    correctOptionId: 'b',
    explanation: 'The `INCLUDE` clause adds non-key payload attributes exclusively to the leaf level of the B-Tree. This keeps intermediate branch pages small (maximizing tree fanout and cache density) and allows covering queries (Index-Only Scans) without expanding the unique constraint boundary beyond the key columns.',
    conceptTag: 'db-covering-index-include',
  },
  {
    id: 'q-db-idx-19',
    difficulty: 'medium',
    question: 'A table `jobs` has 20 million rows, of which 99.5% have `status = \'completed\'` and only 0.5% are `status = \'pending\'`. What is the most storage-efficient indexing strategy to accelerate queue polling for pending jobs?',
    codeSnippet: `SELECT id, payload FROM jobs WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1;`,
    options: [
      { id: 'a', text: 'CREATE INDEX idx_jobs_status_created ON jobs(status, created_at);' },
      { id: 'b', text: 'CREATE INDEX idx_jobs_pending ON jobs(created_at) WHERE status = \'pending\';' },
      { id: 'c', text: 'CREATE HASH INDEX idx_jobs_status ON jobs(status);' },
      { id: 'd', text: 'CLUSTER jobs USING idx_jobs_status;' },
    ],
    correctOptionId: 'b',
    explanation: 'A Partial (Filtered) Index indexes only rows satisfying a predicate (`WHERE status = \'pending\'`). Since 99.5% of rows are completed, a partial index contains only 0.5% of the table\'s rows, reducing index disk footprint and RAM consumption by ~99% while keeping index maintenance on completed rows near zero.',
    conceptTag: 'db-partial-filtered-index',
  },
  {
    id: 'q-db-idx-20',
    difficulty: 'medium',
    question: 'An application implements soft-deletes using a nullable `deleted_at TIMESTAMP` column. Most queries fetch active records (`WHERE deleted_at IS NULL`). Which index structure prevents indexing soft-deleted records?',
    codeSnippet: `CREATE INDEX idx_users_active_email ON users(email) WHERE deleted_at IS NULL;`,
    options: [
      { id: 'a', text: 'A Partial Index, which excludes all rows where deleted_at IS NOT NULL from the index tree' },
      { id: 'b', text: 'A Clustered GIN index with inverted postings' },
      { id: 'c', text: 'A Full-Text Search tsvector index' },
      { id: 'd', text: 'A Temporary session-scoped hash index' },
    ],
    correctOptionId: 'a',
    explanation: 'A partial index with `WHERE deleted_at IS NULL` includes only active records. When soft-deletes accumulate over years, the index does not grow to include dead records, and uniqueness constraints (e.g. unique active emails) can be enforced without colliding with archived rows.',
    conceptTag: 'db-partial-index-soft-deletes',
  },
  {
    id: 'q-db-idx-21',
    difficulty: 'medium',
    question: 'When searching within JSONB array columns using the containment operator `@>`, why is a GIN (Generalized Inverted Index) preferred over a standard B-Tree index?',
    codeSnippet: `SELECT * FROM products WHERE attributes @> '{"tags": ["electronics", "wireless"]}';`,
    options: [
      { id: 'a', text: 'B-Trees cannot store JSON data types under any circumstance' },
      { id: 'b', text: 'GIN decomposes composite items into individual elements/keys and maps each element to a postings list of matching row pointers (TIDs)' },
      { id: 'c', text: 'GIN executes searches in hardware memory registers' },
      { id: 'd', text: 'GIN replaces JSON with protocol buffers at runtime' },
    ],
    correctOptionId: 'b',
    explanation: 'A GIN index is an inverted index where each internal key/value component within the JSONB document or array is indexed separately with a list of matching row pointers (TIDs). A B-Tree can only index the entire document as a single scalar value, which cannot efficiently match subset containment queries.',
    conceptTag: 'db-gin-index-jsonb',
  },
  {
    id: 'q-db-idx-22',
    difficulty: 'medium',
    question: 'Which index type is specifically designed for indexing spatial coordinates (PostGIS geometry) and multidimensional bounding boxes or range types (`tsrange`, `daterange`)?',
    codeSnippet: `CREATE INDEX idx_locations_geom ON places USING GIST (geom);`,
    options: [
      { id: 'a', text: 'Hash Index' },
      { id: 'b', text: 'GiST (Generalized Search Tree)' },
      { id: 'c', text: 'B-Tree Index' },
      { id: 'd', text: 'BRIN with min/max aggregates only' },
    ],
    correctOptionId: 'b',
    explanation: 'GiST (Generalized Search Tree) provides a balanced tree structure for non-scalar hierarchical data like geometric bounding boxes (R-Tree implementation in PostGIS) and temporal range overlaps (`&&`), where data cannot be strictly ordered along a single 1D axis like a B-Tree.',
    conceptTag: 'db-gist-index-spatial',
  },
  {
    id: 'q-db-idx-23',
    difficulty: 'medium',
    question: 'What is a major limitation of PostgreSQL Hash Indexes compared to standard B-Tree indexes?',
    codeSnippet: `CREATE INDEX idx_users_api_key ON users USING HASH (api_key);`,
    options: [
      { id: 'a', text: 'Hash indexes cannot support range comparisons (`<`, `<=`, `>`, `>=`, `BETWEEN`) or `ORDER BY` sorting' },
      { id: 'b', text: 'Hash indexes cannot perform equality lookups (`=` operator)' },
      { id: 'c', text: 'Hash indexes in PostgreSQL 10+ are not WAL-logged and do not survive crashes' },
      { id: 'd', text: 'Hash indexes cannot be created on VARCHAR columns' },
    ],
    correctOptionId: 'a',
    explanation: 'Hash indexes map values to 32-bit bucket hashes. Because hash functions distribute values randomly across buckets, they provide O(1) equality lookups (`=`) but completely lose ordering information, making range queries (`<`, `>`) and ordered scans (`ORDER BY`) impossible.',
    conceptTag: 'db-hash-index-limitations',
  },
  {
    id: 'q-db-idx-24',
    difficulty: 'medium',
    question: 'How does column selectivity influence the query planner\'s decision to use an index, and what is the "tipping point"?',
    options: [
      { id: 'a', text: 'Selectivity measures the byte size of column headers; if headers exceed 64 bytes, indexes are ignored' },
      { id: 'b', text: 'Selectivity is the ratio of matching rows to total rows; if a query matches more than ~5-15% of total table pages, the random I/O cost of index lookups exceeds the sequential I/O cost of a full table scan' },
      { id: 'c', text: 'Selectivity is only calculated for foreign keys during CASCADE DELETE operations' },
      { id: 'd', text: 'High selectivity means every row has the identical value, making indexes 100x faster' },
    ],
    correctOptionId: 'b',
    explanation: 'Selectivity is defined as `(matching rows / total rows)`. When selectivity is low (e.g. matching 0.01% of rows), index seek + heap fetch is fastest. When a query matches a significant fraction of the table (~5-15%), random disk seeks to fetch heap pages become more expensive than reading the entire table sequentially (the tipping point).',
    conceptTag: 'db-index-selectivity-tipping-point',
  },
  {
    id: 'q-db-idx-25',
    difficulty: 'medium',
    question: 'Why is adding a standard B-Tree index to a low-cardinality column like `is_active BOOLEAN` across 10 million rows generally an anti-pattern when 50% of rows are TRUE and 50% are FALSE?',
    options: [
      { id: 'a', text: 'Boolean indexes cause database memory leaks in 64-bit kernels' },
      { id: 'b', text: 'Low cardinality means queries matching either value will select ~5 million rows; the planner will rightfully choose a Seq Scan, leaving the index unused while bloating writes and storage' },
      { id: 'c', text: 'PostgreSQL does not permit B-Tree indexing on 1-byte datatypes' },
      { id: 'd', text: 'The index converts all FALSE values into NULLs automatically' },
    ],
    correctOptionId: 'b',
    explanation: 'With a uniform 50/50 distribution, any query matching `is_active = true` targets 50% of the entire table. Because 50% selectivity heavily exceeds the tipping point, the planner will never use an Index Scan. The index consumes disk and buffer cache and slows down all INSERTs and UPDATEs for zero read benefit.',
    conceptTag: 'db-low-cardinality-anti-pattern',
  },
  {
    id: 'q-db-idx-26',
    difficulty: 'medium',
    question: 'In PostgreSQL, what is the purpose of a "Bitmap Index Scan" combined with a "Bitmap Heap Scan"?',
    codeSnippet: `-> Bitmap Heap Scan on orders
     Recheck Cond: (status = 'shipped' AND customer_id = 999)
     -> BitmapAnd
        -> Bitmap Index Scan on idx_orders_status
        -> Bitmap Index Scan on idx_orders_customer_id`,
    options: [
      { id: 'a', text: 'To render 2D raster graphs of the query plan in the database admin console' },
      { id: 'b', text: 'To create an in-memory bitmap of matching page/tuple IDs from one or more indexes, allowing multiple indexes to be merged (AND/OR) and sorting heap page fetches into sequential physical order' },
      { id: 'c', text: 'To bypass the buffer pool and read directly from NVMe controllers' },
      { id: 'd', text: 'To execute the query in parallel without allocating memory' },
    ],
    correctOptionId: 'b',
    explanation: 'A Bitmap Index Scan reads index entries and builds a bitmask of target physical heap pages. It allows combining multiple indexes with bitwise AND/OR operations (`BitmapAnd`/`BitmapOr`), and converts random heap I/O into sequential physical page order, avoiding repeated reads of the same disk page.',
    conceptTag: 'db-bitmap-index-scan',
  },
  {
    id: 'q-db-idx-27',
    difficulty: 'medium',
    question: 'Under what condition does a PostgreSQL Bitmap Heap Scan transition from an exact bitmap to a "lossy" bitmap, requiring a "Recheck Cond"?',
    options: [
      { id: 'a', text: 'When the query uses floating-point multiplication' },
      { id: 'b', text: 'When the number of matching tuples exceeds `work_mem`, forcing the bitmap to store only matching page addresses rather than exact tuple offsets within each page' },
      { id: 'c', text: 'When the database runs out of disk space in the WAL partition' },
      { id: 'd', text: 'When an index scan is executed on an unvacuumed table' },
    ],
    correctOptionId: 'b',
    explanation: 'If `work_mem` is insufficient to store individual tuple IDs (TIDs) for the entire match set, Postgres downgrades the bitmap to a "lossy" state where bits represent whole 8KB heap pages instead of tuples. During the Bitmap Heap Scan, it must re-evaluate the filter condition (`Recheck Cond`) for every row on those flagged pages.',
    conceptTag: 'db-lossy-bitmap-recheck',
  },
  {
    id: 'q-db-idx-28',
    difficulty: 'medium',
    question: 'How does PostgreSQL handle indexing `NULL` values in standard B-Tree indexes, and how does this compare to Oracle Database?',
    codeSnippet: `SELECT * FROM users WHERE invitation_code IS NULL;`,
    options: [
      { id: 'a', text: 'Neither database indexes NULL values' },
      { id: 'b', text: 'PostgreSQL indexes NULL values by default and can satisfy `IS NULL` queries via index scans, whereas Oracle standard B-Trees exclude rows where all indexed columns are NULL' },
      { id: 'c', text: 'Oracle indexes NULL values, but PostgreSQL ignores NULL values in B-Trees' },
      { id: 'd', text: 'PostgreSQL converts NULL values into empty strings before indexing' },
    ],
    correctOptionId: 'b',
    explanation: 'In PostgreSQL, B-Tree indexes include NULL entries by default (stored at the end or beginning of the index depending on `NULLS FIRST` / `NULLS LAST`), making `IS NULL` queries fully index-accelerated. In contrast, standard Oracle B-tree indexes omit entries where all indexed columns are NULL.',
    conceptTag: 'db-index-null-handling',
  },
  {
    id: 'q-db-idx-29',
    difficulty: 'medium',
    question: 'Why do random UUIDv4 primary keys cause severe B-Tree index fragmentation and buffer pool cache churn compared to monotonic identifiers (like BIGINT IDENTITY or UUIDv7)?',
    options: [
      { id: 'a', text: 'UUIDv4 keys are stored in base64 format, requiring 4x more disk space' },
      { id: 'b', text: 'Random values insert uniformly across random B-Tree leaf pages, triggering frequent 50/50 page splits, leaving pages half-empty and thrashing dirty pages in the buffer pool' },
      { id: 'c', text: 'B-Trees cannot compare 128-bit values without crashing' },
      { id: 'd', text: 'UUIDv4 triggers autocommit on every read' },
    ],
    correctOptionId: 'b',
    explanation: 'Monotonic keys (sequential integers or time-ordered UUIDv7) always append to the rightmost leaf page of the B-Tree (90/10 split), keeping working pages hot in cache. Random UUIDv4 keys insert arbitrarily across all leaf pages. Once pages fill, they split in half (50/50), causing index bloat, low page fill-factor (~50-70%), and heavy random I/O.',
    conceptTag: 'db-uuid-index-fragmentation',
  },
  {
    id: 'q-db-idx-30',
    difficulty: 'medium',
    question: 'What is the operational benefit of using `CREATE INDEX CONCURRENTLY` instead of standard `CREATE INDEX` in production PostgreSQL databases?',
    codeSnippet: `CREATE INDEX CONCURRENTLY idx_transactions_user_id ON transactions(user_id);`,
    options: [
      { id: 'a', text: 'It builds the index 10x faster using distributed GPUs' },
      { id: 'b', text: 'It avoids acquiring an exclusive SHARE lock on the table, allowing concurrent INSERT, UPDATE, and DELETE operations to continue while the index builds' },
      { id: 'c', text: 'It skips WAL logging to save disk space' },
      { id: 'd', text: 'It creates indexes across multiple PostgreSQL replica instances simultaneously' },
    ],
    correctOptionId: 'b',
    explanation: 'Standard `CREATE INDEX` acquires a `SHARE` lock on the target table, which blocks all concurrent data modifications (`INSERT`, `UPDATE`, `DELETE`). `CREATE INDEX CONCURRENTLY` performs two table scans and waits for running transactions without taking exclusive locks, allowing normal production writes to proceed uninterrupted.',
    conceptTag: 'db-create-index-concurrently',
  },
  {
    id: 'q-db-idx-31',
    difficulty: 'medium',
    question: 'When designing a composite index for a query with both equality filters and range filters, what is the general rule of thumb for column ordering?',
    codeSnippet: `SELECT * FROM audit_logs 
WHERE organization_id = 100 
  AND status = 'failed' 
  AND created_at >= '2024-01-01' 
ORDER BY created_at DESC;`,
    options: [
      { id: 'a', text: 'Put range columns first, followed by equality columns, then sorting columns' },
      { id: 'b', text: 'Place exact equality columns first (organization_id, status), followed by range / inequality / order-by columns (created_at)' },
      { id: 'c', text: 'Order columns purely alphabetically by column name' },
      { id: 'd', text: 'Place timestamps first, regardless of query filter predicates' },
    ],
    correctOptionId: 'b',
    explanation: 'The standard index column ordering rule is Equality columns first, then Range / Inequality / Sort columns (the "Equality, Sort, Range" rule). Placing equality columns first narrows the B-tree traversal to a tight sub-range before the range/ordering column is evaluated.',
    conceptTag: 'db-composite-column-ordering-rule',
  },
  {
    id: 'q-db-idx-32',
    difficulty: 'medium',
    question: 'How does an expression-based (functional) index solve performance bottlenecks when querying case-insensitive strings in PostgreSQL?',
    codeSnippet: `CREATE INDEX idx_users_lower_email ON users (LOWER(email));`,
    options: [
      { id: 'a', text: 'It forces PostgreSQL to convert all table rows to lowercase permanently' },
      { id: 'b', text: 'It stores the precomputed result of `LOWER(email)` in the B-Tree index, enabling direct index lookups for `WHERE LOWER(email) = \'foo@example.com\'`' },
      { id: 'c', text: 'It intercepts all client queries and adds regex validation' },
      { id: 'd', text: 'It automatically disables table vacuuming' },
    ],
    correctOptionId: 'b',
    explanation: 'An expression index evaluates the function during `INSERT` or `UPDATE` and indexes the computed result directly in the B-tree leaf nodes. When a query contains the identical expression in its WHERE clause, the planner matches the expression to the index and performs a direct seek.',
    conceptTag: 'db-expression-based-index',
  },
  {
    id: 'q-db-idx-33',
    difficulty: 'medium',
    question: 'In PostgreSQL, why might an "Index Only Scan" still show `Heap Fetches > 0` in `EXPLAIN (ANALYZE, BUFFERS)` output?',
    codeSnippet: `-> Index Only Scan using idx_users_email on users
     Heap Fetches: 4120`,
    options: [
      { id: 'a', text: 'The index is corrupted and undergoing automatic repair' },
      { id: 'b', text: 'PostgreSQL MVCC requires checking the table Visibility Map; if pages contain rows modified by unvacuumed transactions, it must visit the heap to confirm tuple visibility' },
      { id: 'c', text: 'Index Only Scans always read 100% of the heap data as a safety check' },
      { id: 'd', text: 'The connection pool did not set transaction isolation to READ COMMITTED' },
    ],
    correctOptionId: 'b',
    explanation: 'PostgreSQL index tuples do not store transaction visibility information (`xmin`/`xmax`). To satisfy an Index Only Scan without visiting the heap, the engine checks the Visibility Map (VM). If a page has not been marked "all-visible" by VACUUM, the engine must fetch the heap page to verify if the row version is visible to the active transaction.',
    conceptTag: 'db-index-only-scan-visibility-map',
  },
  {
    id: 'q-db-idx-34',
    difficulty: 'medium',
    question: 'What negative consequences occur when database engineers maintain redundant or unused indexes on production tables?',
    options: [
      { id: 'a', text: 'Excessive buffer cache consumption by dead index pages, bloated disk backups, and wasted I/O and CPU overhead during every write operation' },
      { id: 'b', text: 'PostgreSQL limits every table to a maximum of 3 indexes total' },
      { id: 'c', text: 'Unused indexes convert PostgreSQL tables from row-oriented to columnar storage' },
      { id: 'd', text: 'Secondary indexes cause network socket drops on TCP port 5432' },
    ],
    correctOptionId: 'a',
    explanation: 'Unused indexes consume valuable RAM in the buffer pool, bloat storage, lengthen backup/restore windows, increase WAL generation volume, and force every `INSERT`, `UPDATE`, and `DELETE` to update redundant B-tree pages.',
    conceptTag: 'db-unused-index-penalties',
  },

  // ============================================================================
  // HARD / ADVANCED (Questions 35 - 50)
  // ============================================================================
  {
    id: 'q-db-idx-35',
    difficulty: 'hard',
    question: 'In PostgreSQL\'s cost-based query planner, what is the default relationship between `seq_page_cost` and `random_page_cost`, and why is `random_page_cost` often tuned down from 4.0 to ~1.1 on modern NVMe SSD infrastructure?',
    codeSnippet: `SET random_page_cost = 1.1; -- Default is 4.0, seq_page_cost is 1.0`,
    options: [
      { id: 'a', text: 'The default 4.0 was calibrated for spinning rotational HDDs with seek latency penalties; on solid-state drives (SSDs/NVMe), random reads are nearly as fast as sequential reads, so lowering it prevents the planner from inappropriately avoiding index scans' },
      { id: 'b', text: 'Lowering random_page_cost disables all sequential scans entirely across all databases' },
      { id: 'c', text: 'Setting random_page_cost below 2.0 disables ACID transaction durability' },
      { id: 'd', text: 'It forces the PostgreSQL planner to use Hash Joins exclusively' },
    ],
    correctOptionId: 'a',
    explanation: 'PostgreSQL historically defaulted `random_page_cost` to 4.0 based on mechanical hard disks where random head seeks were 4x slower than sequential reads (`seq_page_cost = 1.0`). On modern NVMe SSDs with uniform random read latencies and high IOPS, keeping it at 4.0 misleads the planner into thinking index lookups are prohibitively expensive, choosing Seq Scans prematurely.',
    conceptTag: 'db-planner-cost-model-tuning',
  },
  {
    id: 'q-db-idx-36',
    difficulty: 'hard',
    question: 'When query plans produce drastically incorrect row estimates (`rows=1` estimated vs `rows=500000` actual) on skewed data distributions, how can the database engineer increase the histogram sample resolution in PostgreSQL?',
    codeSnippet: `ALTER TABLE transactions ALTER COLUMN merchant_id SET STATISTICS 500;
ANALYZE transactions;`,
    options: [
      { id: 'a', text: 'Increase the statistics target on the specific column and run ANALYZE to create more granular histogram buckets and expand the Most Common Values (MCV) list' },
      { id: 'b', text: 'Rebuild the database cluster using pg_upgrade with --force-histograms' },
      { id: 'c', text: 'Switch the column datatype from BIGINT to TEXT' },
      { id: 'd', text: 'Disable autovacuum daemon completely' },
    ],
    correctOptionId: 'a',
    explanation: 'PostgreSQL defaults `default_statistics_target` to 100. For columns with heavily skewed distributions or high cardinality, increasing the statistics target (up to 10,000) for that specific column instructs `ANALYZE` to collect more sample rows, expanding the MCV (Most Common Values) array and histogram buckets, drastically improving planner row estimates.',
    conceptTag: 'db-statistics-histograms-mcv',
  },
  {
    id: 'q-db-idx-37',
    difficulty: 'hard',
    question: 'A table `vehicles` has columns `make` and `model`. The query `WHERE make = \'Audi\' AND model = \'R8\'` has severely underestimated row counts because the planner assumes `make` and `model` are statistically independent variables. How is this resolved in PostgreSQL 10+?',
    codeSnippet: `CREATE STATISTICS stat_vehicles_make_model (dependencies, mcv) 
ON make, model FROM vehicles;
ANALYZE vehicles;`,
    options: [
      { id: 'a', text: 'By creating extended multivariate statistics to capture cross-column functional dependencies and joint MCV lists' },
      { id: 'b', text: 'By merging both columns into a single delimited VARCHAR column' },
      { id: 'c', text: 'By enforcing a foreign key constraint between make and model in the same table' },
      { id: 'd', text: 'By disabling the query optimizer cost engine' },
    ],
    correctOptionId: 'a',
    explanation: 'By default, the query planner multiplies single-column selectivities assuming column independence (`P(A and B) = P(A) * P(B)`). For correlated columns (like car make and model), this results in severe underestimation. `CREATE STATISTICS` with `dependencies` and `mcv` tracks multivariate correlation and joint frequency distributions.',
    conceptTag: 'db-extended-multivariate-statistics',
  },
  {
    id: 'q-db-idx-38',
    difficulty: 'hard',
    question: 'Under what memory condition does a PostgreSQL "Hash Join" spill intermediate execution state to temporary disk files, and what metric reveals this in EXPLAIN ANALYZE?',
    codeSnippet: `-> Hash Join (cost=... rows=...)
     Hash Cond: (orders.user_id = users.id)
     Batches: 16  Memory Usage: 32768kB  Disk Usage: 45012kB`,
    options: [
      { id: 'a', text: 'When the inner relation\'s hash table exceeds the allocated `work_mem`, forcing the executor to partition hash buckets into multi-batch disk spills' },
      { id: 'b', text: 'When the database runs out of shared_buffers' },
      { id: 'c', text: 'When the connection limit exceeds max_connections' },
      { id: 'd', text: 'When the query uses a LEFT JOIN instead of an INNER JOIN' },
    ],
    correctOptionId: 'a',
    explanation: 'In a Hash Join, the database builds an in-memory hash table of the inner table. If the required memory exceeds `work_mem`, the planner cannot perform a single-batch in-memory join (`Batches: 1`). It increases `Batches` (e.g. 16 or 32) and spills partitioned tuple buckets to temporary disk files, visible as `Disk Usage` in `EXPLAIN ANALYZE`.',
    conceptTag: 'db-hash-join-work-mem-spill',
  },
  {
    id: 'q-db-idx-39',
    difficulty: 'hard',
    question: 'When is a "Merge Join" strictly superior to a "Hash Join" or "Nested Loop Join" for joining two massive multi-gigabyte tables?',
    options: [
      { id: 'a', text: 'When both inputs are already physically sorted on their join keys (e.g. via matching B-Tree indexes), enabling a linear O(N + M) single-pass scan with minimal working memory overhead' },
      { id: 'b', text: 'When the tables have zero indexes and are completely random' },
      { id: 'c', text: 'When the query uses non-equality conditions like `>` or `<>`' },
      { id: 'd', text: 'When the join is executed over HTTP endpoints' },
    ],
    correctOptionId: 'a',
    explanation: 'A Merge Join operates like merge sort: it advances two pointers along pre-sorted input streams. If both tables already yield pre-sorted rows through B-Tree index scans, no sort step is required and no giant hash table needs to be buffered in memory, joining arbitrary-sized relations in O(N + M) time with O(1) extra memory.',
    conceptTag: 'db-merge-join-sorted-inputs',
  },
  {
    id: 'q-db-idx-40',
    difficulty: 'hard',
    question: 'In an EXPLAIN plan displaying a "Nested Loop Join", why can a sudden unexpected increase in the outer relation\'s row count cause catastrophic latency degradation (N*M explosion)?',
    codeSnippet: `-> Nested Loop (cost=0.56..1250000.00 rows=50000)
     -> Seq Scan on filter_table (actual rows=50000)
     -> Index Scan using idx_target on target_table (actual rows=1 loops=50000)`,
    options: [
      { id: 'a', text: 'The outer loop drives index seeks on the inner table for every single outer row; if the outer row count explodes, the engine executes tens of thousands of separate index searches instead of a single bulk hash or merge pass' },
      { id: 'b', text: 'Nested Loop joins allocate 1GB of RAM per iteration' },
      { id: 'c', text: 'Nested Loop joins disable CPU caching completely' },
      { id: 'd', text: 'Nested Loop joins lock the whole database in exclusive mode' },
    ],
    correctOptionId: 'a',
    explanation: 'A Nested Loop with Inner Index Scan executes the inner index seek once per outer row (`loops=50000`). While exceptionally fast when the outer relation yields only 5 or 10 rows, if stale statistics cause the planner to choose this plan when the outer relation actually emits 100,000 rows, it performs 100,000 individual index traversals, taking minutes instead of milliseconds.',
    conceptTag: 'db-nested-loop-cardinality-risk',
  },
  {
    id: 'q-db-idx-41',
    difficulty: 'hard',
    question: 'Why does standard `VACUUM` in PostgreSQL fail to reclaim physical disk space on bloated B-Tree indexes, and how does `pg_repack` or `REINDEX CONCURRENTLY` resolve this online?',
    options: [
      { id: 'a', text: 'Standard VACUUM marks dead index keys for internal reuse but cannot shrink the OS file size unless entire pages at the end of the file are empty; REINDEX CONCURRENTLY and pg_repack build fresh, compact indexes in parallel without exclusive table locks' },
      { id: 'b', text: 'Standard VACUUM is only capable of deleting table rows, not index entries' },
      { id: 'c', text: 'pg_repack drops all constraints permanently to compress disk blocks' },
      { id: 'd', text: 'B-Tree indexes cannot be rebuilt while PostgreSQL is online' },
    ],
    correctOptionId: 'a',
    explanation: 'Standard `VACUUM` marks dead tuples as free space within existing index pages for future inserts, but cannot contract the index file on disk unless trailing pages are completely empty. `REINDEX CONCURRENTLY` and `pg_repack` create an entirely new, perfectly compacted B-tree file alongside the old one, swap file references, and drop the bloated original without table write locks.',
    conceptTag: 'db-index-bloat-repack',
  },
  {
    id: 'q-db-idx-42',
    difficulty: 'hard',
    question: 'What is the architectural premise of a BRIN (Block Range Index) in PostgreSQL, and why is it exceptionally well-suited for append-only time-series tables?',
    codeSnippet: `CREATE INDEX idx_sensor_readings_brin 
ON sensor_readings USING BRIN (recorded_at) 
WITH (pages_per_range = 128);`,
    options: [
      { id: 'a', text: 'It creates a full B-Tree on every individual disk page' },
      { id: 'b', text: 'It stores only the minimum and maximum values of the indexed column for physical ranges of table disk pages (e.g. every 128 blocks), achieving tiny index size (kilobytes vs gigabytes) when physical disk storage correlates with values' },
      { id: 'c', text: 'It replaces relational tables with column-oriented parquet files on Amazon S3' },
      { id: 'd', text: 'It compresses values using LZ4 and sorts table data on every insert' },
    ],
    correctOptionId: 'b',
    explanation: 'A BRIN index divides the table into contiguous page ranges (default 128 pages = 1MB) and records only the summary min and max values for that range. For time-series data naturally inserted in chronological order, BRIN skips irrelevant block ranges while using less than 1% of the storage and RAM of a conventional B-Tree index.',
    conceptTag: 'db-brin-index-timeseries',
  },
  {
    id: 'q-db-idx-43',
    difficulty: 'hard',
    question: 'Under what physical table conditions does a BRIN (Block Range Index) suffer catastrophic performance degradation?',
    options: [
      { id: 'a', text: 'When the indexed column values are heavily non-correlated or randomly distributed across physical table pages due to random updates or non-sequential inserts' },
      { id: 'b', text: 'When the table exceeds 10,000 rows' },
      { id: 'c', text: 'When queries filter using the equality operator (`=`)' },
      { id: 'd', text: 'When the database runs on ext4 file systems' },
    ],
    correctOptionId: 'a',
    explanation: 'BRIN relies on physical correlation between page location on disk and column values (`correlation` in `pg_stats` near +1.0 or -1.0). If rows are updated randomly or inserted out of order, the min/max range of almost every 128-page block widens to cover the full spectrum of values, forcing the engine to scan virtually every block and rendering the index useless.',
    conceptTag: 'db-brin-correlation-degradation',
  },
  {
    id: 'q-db-idx-44',
    difficulty: 'hard',
    question: 'PostgreSQL does not natively implement Index Skip Scan (loose index scan). How can an engineer emulate Skip Scan using a Recursive CTE to efficiently retrieve distinct values of a leading composite index column?',
    codeSnippet: `CREATE INDEX idx_users_org_created ON users(org_id, created_at);
-- Emulate Skip Scan for distinct org_ids:
WITH RECURSIVE t AS (
   (SELECT org_id FROM users ORDER BY org_id LIMIT 1)
   UNION ALL
   SELECT (SELECT org_id FROM users WHERE org_id > t.org_id ORDER BY org_id LIMIT 1)
   FROM t WHERE t.org_id IS NOT NULL
)
SELECT org_id FROM t WHERE org_id IS NOT NULL;`,
    options: [
      { id: 'a', text: 'The recursive CTE jumps directly to each successive distinct `org_id` using fast B-tree index seeks (`O(log N)` per distinct value), avoiding a full sequential or index scan of millions of intermediate rows' },
      { id: 'b', text: 'It creates a temporary materialized view on disk in background threads' },
      { id: 'c', text: 'It overrides the planner and forces parallel worker execution' },
      { id: 'd', text: 'It bypasses transaction isolation to read uncommitted memory blocks' },
    ],
    correctOptionId: 'a',
    explanation: 'Standard `SELECT DISTINCT org_id FROM users` performs a full index scan or hash aggregate scanning all rows. The recursive CTE pattern queries the minimal `org_id`, then jumps directly to `WHERE org_id > previous_val ORDER BY org_id LIMIT 1` using an index seek. For a table of 100M rows with 50 distinct orgs, this executes 50 logarithmic seeks instead of scanning 100M rows.',
    conceptTag: 'db-skip-scan-recursive-cte',
  },
  {
    id: 'q-db-idx-45',
    difficulty: 'hard',
    question: 'You want to query scalar equality on a deeply nested JSONB attribute `payload->\'user\'->>\'id\'` in a 50-million-row table. Which index design minimizes index size while maximizing lookup speed?',
    codeSnippet: `SELECT * FROM events WHERE (payload->'user'->>'id')::bigint = 987654;`,
    options: [
      { id: 'a', text: 'A full GIN index on the entire `payload` column' },
      { id: 'b', text: 'A B-Tree expression index: `CREATE INDEX idx_events_user_id ON events (((payload->\'user\'->>\'id\')::bigint));`' },
      { id: 'c', text: 'A GiST index with pg_trgm operators on payload::text' },
      { id: 'd', text: 'A Hash index on payload' },
    ],
    correctOptionId: 'b',
    explanation: 'While a GIN index supports generic JSONB queries, it indexes every key and value in the entire document, resulting in massive index size and write overhead. A B-Tree expression index on the casted scalar field `((payload->\'user\'->>\'id\')::bigint)` creates a compact, 8-byte-per-entry B-Tree that outperforms GIN lookups by orders of magnitude for targeted equality lookups.',
    conceptTag: 'db-jsonb-expression-btree',
  },
  {
    id: 'q-db-idx-46',
    difficulty: 'hard',
    question: 'In PostgreSQL 12+, why do high-throughput OLTP workloads occasionally suffer unexplained 10-50ms latency spikes when executing parameterized queries under Just-In-Time (JIT) compilation?',
    options: [
      { id: 'a', text: 'LLVM JIT compilation overhead occurs during query optimization and compilation; for queries taking < 1ms to execute, spending 15ms in LLVM JIT code generation represents pure latency degradation' },
      { id: 'b', text: 'JIT compilation causes memory segmentation faults in libpq' },
      { id: 'c', text: 'JIT requires restarting the PostgreSQL postmaster process' },
      { id: 'd', text: 'JIT modifies WAL segment sizes from 16MB to 1GB dynamically' },
    ],
    correctOptionId: 'a',
    explanation: 'PostgreSQL enables JIT compilation when estimated query costs exceed `jit_above_cost`. For complex analytics, JIT accelerates tuple decompression and expression evaluation. For OLTP queries with inaccurate cost estimates, compiling LLVM IR takes 10-30ms for a query that would have executed in 0.5ms via interpreted code. Disabling JIT (`jit = off`) is standard practice for low-latency OLTP.',
    conceptTag: 'db-jit-compilation-overhead',
  },
  {
    id: 'q-db-idx-47',
    difficulty: 'hard',
    question: 'When analyzing a parallel query plan featuring `Parallel Index Scan` and `Gather Merge`, what is the specific role of the `Gather Merge` node?',
    codeSnippet: `-> Gather Merge (cost=1000.42..15000.80 rows=100000 width=32)
     Workers Planned: 4
     -> Parallel Index Scan using idx_orders_created on orders`,
    options: [
      { id: 'a', text: 'It merges rows emitted by parallel workers while preserving their sorted order, avoiding an expensive post-gather sort' },
      { id: 'b', text: 'It compresses results into a binary zip stream for the client' },
      { id: 'c', text: 'It executes an asynchronous Two-Phase Commit across worker threads' },
      { id: 'd', text: 'It converts index scans into sequential table scans on worker 0' },
    ],
    correctOptionId: 'a',
    explanation: 'While a simple `Gather` node collects rows from worker processes in arbitrary arrival order (scrambling sorted streams), a `Gather Merge` node reads from each worker\'s sorted queue and uses a priority queue/heap to merge them into a single sorted result stream, maintaining `ORDER BY` guarantees without re-sorting.',
    conceptTag: 'db-parallel-gather-merge',
  },
  {
    id: 'q-db-idx-48',
    difficulty: 'hard',
    question: 'What is Heap-Only Tuples (HOT) optimization in PostgreSQL, and under what conditions does an `UPDATE` statement qualify for HOT?',
    options: [
      { id: 'a', text: 'HOT stores all table data in GPU VRAM instead of disk' },
      { id: 'b', text: 'When an UPDATE modifies columns that are NOT indexed and the new row version fits on the exact same 8KB data page as the old row, Postgres avoids creating new index entries and links the versions via an intra-page chain' },
      { id: 'c', text: 'HOT automatically converts B-Trees into LSM trees during peak traffic' },
      { id: 'd', text: 'HOT deletes all foreign keys temporarily to accelerate bulk updates' },
    ],
    correctOptionId: 'b',
    explanation: 'HOT (Heap-Only Tuples) prevents index bloat and write amplification. If an `UPDATE` does not modify any column covered by any index on the table, and the new tuple version fits inside the same 8KB heap page, Postgres writes the new tuple without creating new pointers in any index. Existing index pointers traverse an intra-page pointer chain directly in the heap page.',
    conceptTag: 'db-hot-heap-only-tuples',
  },
  {
    id: 'q-db-idx-49',
    difficulty: 'hard',
    question: 'Using PostgreSQL system catalog views `pg_stat_user_indexes` and `pg_statio_user_indexes`, how do database administrators identify candidates for index deletion?',
    codeSnippet: `SELECT schemaname, relname, indexrelname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
ORDER BY pg_relation_size(indexrelid) DESC;`,
    options: [
      { id: 'a', text: 'Indexes with `idx_scan = 0` (zero reads since stats reset) that consume significant disk space and impose write overhead on tables without serving any queries' },
      { id: 'b', text: 'Indexes whose names contain underscores' },
      { id: 'c', text: 'Indexes that have fewer than 100 rows' },
      { id: 'd', text: 'Indexes created on tables with primary keys' },
    ],
    correctOptionId: 'a',
    explanation: '`pg_stat_user_indexes.idx_scan` tracks how many times an index scan has been initiated. If an index has `idx_scan = 0` over a representative business cycle (e.g. 30 days) and is not enforcing a primary key or unique constraint, it is pure dead weight: wasting buffer pool cache, consuming storage, and slowing down all write queries.',
    conceptTag: 'db-identifying-unused-indexes',
  },
  {
    id: 'q-db-idx-50',
    difficulty: 'hard',
    question: 'Why does Keyset (Cursor-based) Pagination drastically outperform Offset Pagination (`OFFSET 1000000 LIMIT 20`) on large indexed tables?',
    codeSnippet: `-- Offset Pagination:
SELECT id, created_at FROM events ORDER BY created_at DESC, id DESC OFFSET 1000000 LIMIT 20;

-- Keyset Pagination:
SELECT id, created_at FROM events 
WHERE (created_at, id) < ('2024-03-01 12:00:00', 987654)
ORDER BY created_at DESC, id DESC LIMIT 20;`,
    options: [
      { id: 'a', text: 'Offset pagination forces the database to scan and discard 1,000,000 index tuples before returning 20 rows (O(N) cost), whereas keyset pagination seeks directly to the cursor key in O(log N) and fetches only 20 rows' },
      { id: 'b', text: 'OFFSET is restricted to 32-bit integers and crashes beyond row 65535' },
      { id: 'c', text: 'Keyset pagination runs in parallel across client browser threads' },
      { id: 'd', text: 'Offset pagination bypasses the query planner and always uses Sequential Scans' },
    ],
    correctOptionId: 'a',
    explanation: '`OFFSET 1000000 LIMIT 20` requires the database engine to traverse the index or scan the table for 1,000,020 rows, discarding the first million rows one by one (O(N) CPU and I/O cost). Keyset pagination uses row comparisons `(created_at, id) < ($1, $2)` to perform a single B-Tree seek directly to the cursor boundary, reading exactly 20 rows in O(log N) constant time.',
    conceptTag: 'db-keyset-vs-offset-pagination',
  },
];
