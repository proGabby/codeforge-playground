import type { QuizQuestion } from '../../../../src/types';

export const DISTRIBUTED_EVENT_DRIVEN_50_QUESTIONS: QuizQuestion[] = [
  {
    "id": "q-sd-event-1",
    "difficulty": "easy",
    "question": "What is the fundamental architectural difference between a Point-to-Point Message Queue (e.g. RabbitMQ classic queue) and a Publish/Subscribe (Pub/Sub) messaging system?",
    "options": [
      {
        "id": "a",
        "text": "Point-to-Point encrypts messages with RSA, while Pub/Sub only supports unencrypted plain text"
      },
      {
        "id": "b",
        "text": "Point-to-Point delivers each message to exactly one consumer instance from a pool of workers, whereas Pub/Sub broadcasts each message to all subscribed consumer groups/queues"
      },
      {
        "id": "c",
        "text": "Point-to-Point only works on a single local machine, whereas Pub/Sub runs in cloud environments"
      },
      {
        "id": "d",
        "text": "Pub/Sub queues require SQL databases to store messages, while Point-to-Point queues run in GPU RAM"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In Point-to-Point queues (worker queues), multiple workers compete for messages and each message is consumed by exactly one worker. In Pub/Sub (fan-out), each published message is copied and delivered to all active subscribers or independent consumer groups.",
    "conceptTag": "messaging-pubsub-vs-queue"
  },
  {
    "id": "q-sd-event-2",
    "difficulty": "easy",
    "question": "In Apache Kafka, what is a \"Partition\", and why is it considered the fundamental unit of scalability and parallelism?",
    "options": [
      {
        "id": "a",
        "text": "A partition is a relational database view that formats JSON payloads into SQL tables"
      },
      {
        "id": "b",
        "text": "A partition is an ordered, immutable, append-only commit log of records; Kafka distributes partitions across cluster brokers so multiple consumers in a group can consume in parallel"
      },
      {
        "id": "c",
        "text": "A partition is a network firewall rule that separates internal microservices from public internet traffic"
      },
      {
        "id": "d",
        "text": "A partition is an in-memory buffer that drops records older than 10 seconds"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Kafka topics are divided into partitions, which are append-only ordered logs. Partitions are distributed across cluster brokers. Each partition can be assigned to a consumer in a consumer group, making the partition count the upper bound on horizontal consumer parallelism.",
    "conceptTag": "kafka-partitions-parallelism"
  },
  {
    "id": "q-sd-event-3",
    "difficulty": "easy",
    "question": "How do Kafka Brokers, Topics, and Partitions relate to one another in a multi-broker cluster?",
    "options": [
      {
        "id": "a",
        "text": "A broker can only host one topic, and topics cannot span more than one broker"
      },
      {
        "id": "b",
        "text": "A topic is a logical stream of records divided into one or more partitions; these partitions and their replicas are distributed across multiple brokers in the cluster"
      },
      {
        "id": "c",
        "text": "Partitions are created on client machines and uploaded to brokers upon cluster reboot"
      },
      {
        "id": "d",
        "text": "Each broker runs its own isolated copy of all topics without network replication"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A topic is a logical categorization. Physical storage is divided into partitions. To achieve high availability and load distribution, partitions (both leaders and follower replicas) are spread across multiple brokers in the Kafka cluster.",
    "conceptTag": "kafka-cluster-architecture"
  },
  {
    "id": "q-sd-event-4",
    "difficulty": "easy",
    "question": "Consider a Kafka topic with 6 partitions and a consumer group containing 4 active consumer instances. How are the partitions assigned to the consumers according to consumer group semantics?",
    "options": [
      {
        "id": "a",
        "text": "All 4 consumers receive and process all records from all 6 partitions simultaneously"
      },
      {
        "id": "b",
        "text": "Each partition is assigned to at most one consumer instance in the group; some consumers will be assigned 2 partitions while others are assigned 1"
      },
      {
        "id": "c",
        "text": "Two partitions are left unassigned and their messages are permanently dropped"
      },
      {
        "id": "d",
        "text": "Consumers must poll partitions via round-robin HTTP GET requests"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Within a single consumer group, each partition is consumed by at most one consumer instance at any time. With 6 partitions and 4 consumers, partitions are distributed (e.g., 2, 2, 1, 1). If consumers exceeded partitions (e.g. 8 consumers for 6 partitions), 2 consumers would sit idle.",
    "conceptTag": "kafka-consumer-groups"
  },
  {
    "id": "q-sd-event-5",
    "difficulty": "easy",
    "question": "What is a Kafka message \"offset\", and where do modern Kafka clusters store the committed offsets of consumer groups?",
    "options": [
      {
        "id": "a",
        "text": "An offset is a cryptographic hash stored in the local Linux /etc/hosts file"
      },
      {
        "id": "b",
        "text": "An offset is a sequential 64-bit integer assigned to each record in a partition; consumer offsets are committed to an internal, compacted topic named __consumer_offsets"
      },
      {
        "id": "c",
        "text": "An offset is the IP address of the producer stored in Apache ZooKeeper"
      },
      {
        "id": "d",
        "text": "An offset is the execution duration of the consumer in milliseconds"
      }
    ],
    "correctOptionId": "b",
    "explanation": "An offset is a monotonic integer identifying each message within a partition. While early Kafka versions stored consumer offsets in ZooKeeper, modern Kafka commits offsets to an internal compacted Kafka topic called __consumer_offsets for high performance and durability.",
    "conceptTag": "kafka-offsets-commit"
  },
  {
    "id": "q-sd-event-6",
    "difficulty": "easy",
    "question": "Which message delivery semantic guarantees that a message will NEVER be lost, but may occasionally be delivered and processed more than once during network retries or consumer restarts?",
    "options": [
      {
        "id": "a",
        "text": "At-most-once delivery"
      },
      {
        "id": "b",
        "text": "At-least-once delivery"
      },
      {
        "id": "c",
        "text": "Zero-overhead delivery"
      },
      {
        "id": "d",
        "text": "Best-effort UDP delivery"
      }
    ],
    "correctOptionId": "b",
    "explanation": "At-least-once delivery guarantees that messages are never lost, but duplicate deliveries can occur if acknowledgments fail or timeouts occur. At-most-once guarantees no duplicates but messages can be lost. Exactly-once guarantees each message takes effect once.",
    "conceptTag": "messaging-delivery-semantics"
  },
  {
    "id": "q-sd-event-7",
    "difficulty": "easy",
    "question": "In an event-driven microservices architecture operating under at-least-once delivery semantics, why must downstream message consumers be designed to be \"idempotent\"?",
    "options": [
      {
        "id": "a",
        "text": "Because idempotent consumers execute 10x faster in hardware L1 CPU caches"
      },
      {
        "id": "b",
        "text": "Because network retries and rebalances can deliver the exact same event multiple times; an idempotent consumer ensures processing the duplicate produces the exact same final state without unintended duplicate side effects (e.g. charging a card twice)"
      },
      {
        "id": "c",
        "text": "Because non-idempotent consumers violate PostgreSQL foreign key constraints"
      },
      {
        "id": "d",
        "text": "Because Kafka brokers terminate connections if consumer responses do not contain the IDEMPOTENT header"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Under at-least-once delivery, duplicate messages are inevitable. An idempotent consumer recognizes already-processed messages (via unique event IDs, deduplication tables, or upserts) so that repeated deliveries do not produce duplicate business effects.",
    "conceptTag": "consumer-idempotency"
  },
  {
    "id": "q-sd-event-8",
    "difficulty": "easy",
    "question": "What is the architectural difference between \"Event Notification\" and \"Event-Carried State Transfer\" (ECST)?",
    "codeSnippet": "// Approach A (Event Notification):\n{ \"eventType\": \"OrderShipped\", \"orderId\": \"ord_9182\", \"timestamp\": 1700000000 }\n\n// Approach B (Event-Carried State Transfer):\n{ \n  \"eventType\": \"OrderShipped\", \n  \"orderId\": \"ord_9182\", \n  \"customerId\": \"cust_401\",\n  \"shippingAddress\": \"123 Market St\",\n  \"items\": [{ \"sku\": \"A1\", \"qty\": 2, \"price\": 49.99 }],\n  \"trackingNumber\": \"TRK_9918273\"\n}",
    "options": [
      {
        "id": "a",
        "text": "Approach A can only be consumed by C++ programs, whereas Approach B is for JavaScript"
      },
      {
        "id": "b",
        "text": "Approach A sends a lightweight notification requiring consumers to query the producer via API to fetch details; Approach B includes the full entity state in the event, allowing consumers to update local read models without calling the producer service"
      },
      {
        "id": "c",
        "text": "Approach A violates GDPR, whereas Approach B is encrypted"
      },
      {
        "id": "d",
        "text": "Approach B requires all consumers to share the same MySQL database instance"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Event Notification notifies that something happened (consumer must call producer API for details, creating query coupling). Event-Carried State Transfer includes full entity state, giving consumers autonomous access to data at the cost of larger message payloads.",
    "conceptTag": "event-carried-state-transfer"
  },
  {
    "id": "q-sd-event-9",
    "difficulty": "easy",
    "question": "What primary resilience benefit does asynchronous event-driven messaging provide over synchronous HTTP/gRPC communication between microservices during traffic spikes?",
    "options": [
      {
        "id": "a",
        "text": "It completely eliminates the need for software testing and monitoring"
      },
      {
        "id": "b",
        "text": "Temporal decoupling and buffering (peak shaving): Messages queue safely in the broker, allowing downstream services to process work at their own sustainable pace rather than crashing under sudden traffic surges"
      },
      {
        "id": "c",
        "text": "It forces downstream services to run on the same physical server"
      },
      {
        "id": "d",
        "text": "It eliminates latency completely, achieving zero-microsecond communication"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Synchronous RPC couples caller and callee in time: if the callee is slow or overwhelmed, the caller blocks and cascades failures. Asynchronous messaging acts as a shock absorber (buffering), smoothing out traffic spikes and isolating failures.",
    "conceptTag": "async-messaging-vs-rpc"
  },
  {
    "id": "q-sd-event-10",
    "difficulty": "easy",
    "question": "How does message retention in an append-only commit log broker (Apache Kafka) differ from traditional message brokers like RabbitMQ?",
    "options": [
      {
        "id": "a",
        "text": "RabbitMQ retains messages permanently until the hard drive is destroyed; Kafka deletes messages immediately upon consumer read"
      },
      {
        "id": "b",
        "text": "In RabbitMQ, messages are removed from the queue once acknowledged by a consumer; in Kafka, messages are retained on disk for a configured retention period (e.g. 7 days) regardless of consumption, allowing multiple consumers to read or replay at any time"
      },
      {
        "id": "c",
        "text": "Kafka only stores messages in RAM, while RabbitMQ only stores on tape drives"
      },
      {
        "id": "d",
        "text": "There is no operational difference in retention between RabbitMQ and Kafka"
      }
    ],
    "correctOptionId": "b",
    "explanation": "RabbitMQ deletes messages as soon as consumers acknowledge them. Kafka treats topics as persistent commit logs: records stay on disk until log retention thresholds (time or size) expire, allowing multiple consumer groups to read independently and replay past events.",
    "conceptTag": "kafka-message-retention"
  },
  {
    "id": "q-sd-event-11",
    "difficulty": "easy",
    "question": "In RabbitMQ, what is the effect when a consumer rejects a message using basic.nack with the parameter \"requeue = false\"?",
    "codeSnippet": "channel.basicNack(deliveryTag, false, false); // multiple = false, requeue = false",
    "options": [
      {
        "id": "a",
        "text": "The message is immediately sent to the producer for re-signing"
      },
      {
        "id": "b",
        "text": "The message is discarded from the queue (or routed to a configured Dead Letter Exchange / DLX), rather than being placed back onto the queue for immediate redelivery"
      },
      {
        "id": "c",
        "text": "The message is placed at the front of the queue and redelivered immediately"
      },
      {
        "id": "d",
        "text": "The RabbitMQ broker shuts down the channel and revokes client credentials"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In RabbitMQ, basic.nack with requeue=false instructs the broker not to requeue the rejected message. The message is either permanently dropped or forwarded to a configured Dead Letter Exchange (DLX). If requeue=true, it is placed back on the queue.",
    "conceptTag": "rabbitmq-ack-nack"
  },
  {
    "id": "q-sd-event-12",
    "difficulty": "easy",
    "question": "What does \"Consumer Lag\" measure in an event-driven Kafka ecosystem, and why is it a critical SLI (Service Level Indicator)?",
    "codeSnippet": "// Consumer Lag = LogEndOffset (latest produced) - CurrentOffset (latest committed)\n// Topic: payments, Partition 0:\n// LogEndOffset = 1,500,000; CurrentOffset = 1,420,000\n// Consumer Lag = 80,000 messages",
    "options": [
      {
        "id": "a",
        "text": "It measures the round-trip ping time in milliseconds between the consumer and the DNS server"
      },
      {
        "id": "b",
        "text": "It measures the delta between the latest message produced to a partition and the latest message processed/committed by the consumer group; high or growing lag indicates the consumer cannot keep up with production volume"
      },
      {
        "id": "c",
        "text": "It indicates the percentage of corrupted CRC32 packets on the network card"
      },
      {
        "id": "d",
        "text": "It measures how long a broker takes to restart after a power outage"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Consumer lag is the number of unread records between the end of the log and the consumer's committed offset. Growing consumer lag indicates that consumer processing throughput is lower than producer volume, resulting in stale read models or delayed workflows.",
    "conceptTag": "kafka-consumer-lag"
  },
  {
    "id": "q-sd-event-13",
    "difficulty": "easy",
    "question": "How does Kafka determine which partition a record is sent to when a producer specifies a non-null message key (e.g., customerId = \"cust_8821\")?",
    "codeSnippet": "ProducerRecord<String, String> record = \n    new ProducerRecord<>(\"orders\", \"cust_8821\", orderJsonPayload);\nproducer.send(record);",
    "options": [
      {
        "id": "a",
        "text": "It assigns the record to a completely random partition on every invocation"
      },
      {
        "id": "b",
        "text": "It computes a 32-bit Murmur2 hash of the serialized key and takes the modulus with the number of partitions (hash(key) % numPartitions), ensuring records with identical keys always map to the same partition"
      },
      {
        "id": "c",
        "text": "It queries an external DNS server to determine the partition mapping"
      },
      {
        "id": "d",
        "text": "It writes the message to all partitions in parallel"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Kafka's default partitioner hashes the message key (using MurmurHash2) and maps it modulo partition count. This guarantees that all messages sharing the same key arrive at the exact same partition, preserving strict per-key ordering.",
    "conceptTag": "kafka-partition-key-hashing"
  },
  {
    "id": "q-sd-event-14",
    "difficulty": "easy",
    "question": "What is a \"Dead Letter Queue\" (DLQ), and why is it essential for maintaining stream processing pipeline availability?",
    "options": [
      {
        "id": "a",
        "text": "A queue that only accepts messages sent from decommissioned legacy servers"
      },
      {
        "id": "b",
        "text": "A secondary queue where malformed, unparseable, or repeatedly failing \"poison pill\" messages are diverted after exhausting retry limits, preventing pipeline halts and allowing operators to debug errors"
      },
      {
        "id": "c",
        "text": "A storage partition that encrypts messages using quantum cryptography"
      },
      {
        "id": "d",
        "text": "A queue that automatically reboots any consumer that reads from it"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A poison pill message causes a consumer to throw an exception repeatedly. Without a DLQ, the consumer halts and blocks processing of all subsequent messages in that partition. Routing failed messages to a DLQ unblocks the pipeline.",
    "conceptTag": "dead-letter-queue-basics"
  },
  {
    "id": "q-sd-event-15",
    "difficulty": "easy",
    "question": "How does the \"Competing Consumers\" design pattern allow an application to scale message processing throughput dynamically?",
    "options": [
      {
        "id": "a",
        "text": "By having consumers bid cryptocurrency for the right to process messages"
      },
      {
        "id": "b",
        "text": "By running multiple concurrent worker instances that pull messages from a shared message queue; as message volume spikes, additional worker instances can be started to process messages in parallel"
      },
      {
        "id": "c",
        "text": "By forcing producers to wait until consumers acknowledge receipt via SMS"
      },
      {
        "id": "d",
        "text": "By locking the message queue so only one worker can process messages per day"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In the Competing Consumers pattern, multiple consumer workers connect to a single queue. The broker delivers each message to an available worker. As workload grows, spinning up more consumer processes dynamically scales processing throughput.",
    "conceptTag": "competing-consumers-pattern"
  },
  {
    "id": "q-sd-event-16",
    "difficulty": "easy",
    "question": "In an enterprise event-driven architecture using Apache Avro or Protocol Buffers, what critical role does a \"Schema Registry\" play?",
    "options": [
      {
        "id": "a",
        "text": "It manages user passwords and multi-factor authentication tokens"
      },
      {
        "id": "b",
        "text": "It serves as a centralized metadata repository that validates message schemas against compatibility rules (e.g. backward, forward) before messages are serialized and published by producers"
      },
      {
        "id": "c",
        "text": "It replaces the need for Kafka brokers by writing JSON files directly to AWS S3"
      },
      {
        "id": "d",
        "text": "It automatically generates React frontend components from SQL queries"
      }
    ],
    "correctOptionId": "b",
    "explanation": "A Schema Registry stores versioned schemas (Avro, Protobuf, JSON Schema) and enforces compatibility policies. Producers submit schemas before sending messages, preventing broken schemas or incompatible schema changes from breaking downstream consumers.",
    "conceptTag": "schema-registry-basics"
  },
  {
    "id": "q-sd-event-17",
    "difficulty": "easy",
    "question": "In distributed event-driven systems, what does the concept of \"Eventual Consistency\" describe?",
    "options": [
      {
        "id": "a",
        "text": "The guarantee that all distributed nodes reflect the exact same state at the identical millisecond timestamp"
      },
      {
        "id": "b",
        "text": "The property that, in the absence of new updates, all replicas and decentralized read models will eventually converge to an identical, consistent state across the system"
      },
      {
        "id": "c",
        "text": "The condition where data is permanently inconsistent and cannot be repaired"
      },
      {
        "id": "d",
        "text": "The requirement that all database updates must be committed inside a single ACID lock"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Eventual consistency accepts that independent microservices and read projections may be temporarily out of sync while events travel across networks. If no new updates are made, all replicas will eventually receive the events and converge to consistent state.",
    "conceptTag": "distributed-eventual-consistency"
  },
  {
    "id": "q-sd-event-18",
    "difficulty": "medium",
    "question": "How does Kafka's Idempotent Producer (\"enable.idempotence = true\") prevent duplicate messages from being written to a partition when a network timeout causes the producer to retry?",
    "codeSnippet": "// Producer config:\nprops.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, \"true\");\nprops.put(ProducerConfig.ACKS_CONFIG, \"all\");\nprops.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);",
    "options": [
      {
        "id": "a",
        "text": "The broker compares the entire SHA-256 payload of every incoming message with the last 10,000 messages"
      },
      {
        "id": "b",
        "text": "The broker assigns each producer a unique 64-bit Producer ID (PID), and the producer attaches a monotonically increasing sequence number to each record per partition; the broker discards any message whose sequence number is not exactly (last_seen_seq + 1)"
      },
      {
        "id": "c",
        "text": "The producer acquires an exclusive distributed lock on the Kafka broker before sending each record"
      },
      {
        "id": "d",
        "text": "Kafka drops all retry attempts and closes the producer socket immediately"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Kafka idempotent producers assign a unique Producer ID (PID) via InitProducerId and associate each batch with a sequence number. Brokers track the sequence number per partition. If a retry sends an already-committed sequence number, the broker acknowledges it but avoids duplicate log writes.",
    "conceptTag": "kafka-idempotent-producer"
  },
  {
    "id": "q-sd-event-19",
    "difficulty": "medium",
    "question": "In a stream-processing application executing a \"consume-transform-produce\" loop, what Kafka mechanism guarantees that consumed offsets and produced output records are committed atomically together in an Exactly-Once transaction?",
    "codeSnippet": "producer.initTransactions();\nproducer.beginTransaction();\n// 1. Produce transformed records to output topic:\nproducer.send(new ProducerRecord<>(\"output-topic\", key, result));\n// 2. Send consumer group offsets to transaction:\nproducer.sendOffsetsToTransaction(offsets, consumerGroupId);\n// 3. Commit atomically:\nproducer.commitTransaction();",
    "options": [
      {
        "id": "a",
        "text": "PostgreSQL row-level locking"
      },
      {
        "id": "b",
        "text": "Kafka Transactions via Transaction Coordinator and Transaction Marker records; downstream consumers configured with isolation.level = \"read_committed\" only read records from successfully committed transactions"
      },
      {
        "id": "c",
        "text": "Writing output records directly into Apache Spark memory"
      },
      {
        "id": "d",
        "text": "Shutting down the consumer group during each publish step"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Kafka's transactional API coordinates with a Transaction Coordinator broker. Output records and consumer offsets are written inside a transaction. When committed, commit markers are written to partitions. Consumers with isolation.level=read_committed skip uncommitted or aborted messages.",
    "conceptTag": "kafka-transactions-eos"
  },
  {
    "id": "q-sd-event-20",
    "difficulty": "medium",
    "question": "When implementing the Saga Pattern for distributed transactions across multiple microservices, what is the key architectural difference between Choreography and Orchestration?",
    "options": [
      {
        "id": "a",
        "text": "Choreography is written in Python; Orchestration is written in Java"
      },
      {
        "id": "b",
        "text": "In Choreography, services communicate reactively by publishing and listening to domain events without a central coordinator; in Orchestration, a dedicated orchestrator service commands individual participants on what local transactions to execute and handle failures"
      },
      {
        "id": "c",
        "text": "Orchestration requires synchronous HTTP calls, while Choreography requires FTP file transfers"
      },
      {
        "id": "d",
        "text": "Choreography supports rollbacks, while Orchestration cannot support compensating actions"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Choreography is decentralized: each service emits events and listens to other services' events (can become complex to track at scale). Orchestration uses a central coordinator (state machine) that tells each service what step to perform and coordinates compensating actions on failure.",
    "conceptTag": "saga-choreography-orchestration"
  },
  {
    "id": "q-sd-event-21",
    "difficulty": "medium",
    "question": "In a distributed Saga spanning Order, Payment, and Inventory services, the Inventory service fails due to out-of-stock items after Payment has already succeeded. How does the Saga recover?",
    "codeSnippet": "// Step 1: OrderCreated (Pending) -> OK\n// Step 2: PaymentAuthorized ($150 charged) -> OK\n// Step 3: ReserveInventory (SKU-88) -> FAILED (Out of Stock!)",
    "options": [
      {
        "id": "a",
        "text": "The database issues an ACID ROLLBACK command across the network to automatically refund the payment"
      },
      {
        "id": "b",
        "text": "The Saga triggers a Compensating Transaction: an explicit business undo operation (e.g., executing a PaymentRefunded transaction and marking the Order as Cancelled)"
      },
      {
        "id": "c",
        "text": "The system locks the customer's bank account until inventory arrives"
      },
      {
        "id": "d",
        "text": "The Kafka broker rewinds its commit log and deletes the OrderCreated event"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Because local transactions commit independently in a Saga, traditional DB rollbacks cannot undo already-committed actions. Instead, compensating transactions (semantic rollbacks) must be triggered, such as issuing a payment refund and updating the order status to cancelled.",
    "conceptTag": "saga-compensating-transactions"
  },
  {
    "id": "q-sd-event-22",
    "difficulty": "medium",
    "question": "In a resilient consumer architecture, how is non-blocking retry with exponential backoff and jitter implemented using Kafka topics without stalling the main partition?",
    "codeSnippet": "// Processing fails with transient network error\n// Option 1: Thread.sleep(30_000) inside consumer loop -> BLOCKS partition!\n// Option 2: Route to dedicated retry topics with increasing delays:\n// Topic: orders -> orders_retry_5s -> orders_retry_30s -> orders_dlq",
    "options": [
      {
        "id": "a",
        "text": "Option 1 is optimal because it preserves strict FIFO ordering for all users across the topic"
      },
      {
        "id": "b",
        "text": "Option 2 routes failed records to dedicated delay/retry topics with separate consumer groups, allowing the main topic to continue processing healthy messages at full speed without head-of-line blocking"
      },
      {
        "id": "c",
        "text": "Kafka automatically delays individual messages within a partition when exceptions are thrown"
      },
      {
        "id": "d",
        "text": "Retry topics require upgrading Kafka brokers to Enterprise Edition"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Sleeping inside a consumer blocks the entire partition and risks exceeding max.poll.interval.ms. Routing failed messages to staged retry topics (retry_5s, retry_30s, then DLQ) isolates retries, unblocks healthy traffic, and enables exponential backoff.",
    "conceptTag": "kafka-retry-topics-dlq"
  },
  {
    "id": "q-sd-event-23",
    "difficulty": "medium",
    "question": "The Transactional Outbox pattern solves the dual-write problem when updating a database and publishing an event. How does it work?",
    "codeSnippet": "BEGIN TRANSACTION;\n  -- 1. Mutate business state\n  INSERT INTO orders (id, customer_id, total, status) VALUES ('ord_10', 'c_99', 89.00, 'CONFIRMED');\n  -- 2. Insert outbox record in the SAME transaction\n  INSERT INTO outbox_table (id, aggregate_type, aggregate_id, payload) \n  VALUES ('evt_1', 'Order', 'ord_10', '{\"type\":\"OrderPlaced\",\"id\":\"ord_10\"}');\nCOMMIT;",
    "options": [
      {
        "id": "a",
        "text": "The database publishes the event to Kafka over TCP before committing the SQL transaction"
      },
      {
        "id": "b",
        "text": "The business entity and the outgoing event are saved in the same local ACID transaction; a separate publisher process or Change Data Capture (CDC) tool reads the outbox table and reliably publishes events to the broker"
      },
      {
        "id": "c",
        "text": "The outbox table runs in Kafka memory and deletes the PostgreSQL database on error"
      },
      {
        "id": "d",
        "text": "It requires two-phase commit locks across the database and Kafka broker"
      }
    ],
    "correctOptionId": "b",
    "explanation": "By co-locating the domain event in an outbox table inside the same ACID database transaction as the business entity update, atomicity is guaranteed. An asynchronous relay (poller or CDC connector like Debezium) then streams outbox records to the message broker.",
    "conceptTag": "transactional-outbox-pattern"
  },
  {
    "id": "q-sd-event-24",
    "difficulty": "medium",
    "question": "Why is the Transactional Outbox pattern widely preferred over distributed Two-Phase Commit (2PC / XA transactions) between a relational database and a message broker?",
    "options": [
      {
        "id": "a",
        "text": "2PC transactions do not support SQL SELECT statements"
      },
      {
        "id": "b",
        "text": "2PC involves synchronous blocking locks across heterogeneous systems, high latency, poor scalability, and coordinator single points of failure, whereas Outbox relies on fast local ACID transactions with decoupled asynchronous delivery"
      },
      {
        "id": "c",
        "text": "The Outbox pattern eliminates the need for database storage"
      },
      {
        "id": "d",
        "text": "Kafka brokers reject 2PC transactions because Kafka is written in Scala"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Distributed 2PC / XA transactions hold locks across network boundaries until all participants agree to commit. If the coordinator or network fails, locks remain held, stalling the system. The Outbox pattern avoids distributed locking by keeping writes local and streaming asynchronously.",
    "conceptTag": "outbox-vs-two-phase-commit"
  },
  {
    "id": "q-sd-event-25",
    "difficulty": "medium",
    "question": "How should a downstream relational database consumer implement message deduplication when consuming from an at-least-once message stream?",
    "codeSnippet": "// Processing payment event in consumer:\nBEGIN TRANSACTION;\n  -- Step 1: Check or insert into processed_events table\n  INSERT INTO processed_events (event_id, processed_at) VALUES ('evt_abc_123', NOW());\n  -- If unique constraint violation on event_id -> ROLLBACK and ACK (already processed!)\n  -- Step 2: Update customer balance\n  UPDATE accounts SET balance = balance - 50.00 WHERE account_id = 'acc_401';\nCOMMIT;",
    "options": [
      {
        "id": "a",
        "text": "Rely on the client browser cache to deduplicate payments"
      },
      {
        "id": "b",
        "text": "Insert the unique event ID into an idempotency/processed_events table with a UNIQUE constraint within the same transaction as the business state mutation; duplicate deliveries trigger a constraint violation and are safely ignored"
      },
      {
        "id": "c",
        "text": "Delete all records from the accounts table before each transaction"
      },
      {
        "id": "d",
        "text": "Disable database transaction logs to prevent duplicate writes"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Storing the event ID in an idempotency table with a UNIQUE constraint inside the same database transaction guarantees that duplicate deliveries fail atomically on the unique constraint, allowing the consumer to acknowledge the duplicate without reapplying business logic.",
    "conceptTag": "consumer-message-deduplication"
  },
  {
    "id": "q-sd-event-26",
    "difficulty": "medium",
    "question": "What is \"Head-of-Line (HoL) Blocking\" in a partitioned message stream, and what architecture avoids it when individual messages experience slow third-party processing?",
    "options": [
      {
        "id": "a",
        "text": "When a broker runs out of network bandwidth and drops all TCP packets"
      },
      {
        "id": "b",
        "text": "When a single slow or failing message at the head of a partition log blocks all subsequent, independent messages in that partition from being processed; resolved by dispatching slow tasks to worker thread pools or dead-letter retry queues"
      },
      {
        "id": "c",
        "text": "When the first column in a SQL table is not indexed"
      },
      {
        "id": "d",
        "text": "When a consumer instance runs on ARM64 instead of x86 architecture"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Because partitions maintain strict sequential order, if a consumer blocks on message #100 (e.g. waiting for a slow external API), messages #101 through #1000 cannot proceed. Decoupling processing or diverting slow items to retry queues mitigates HoL blocking.",
    "conceptTag": "head-of-line-blocking"
  },
  {
    "id": "q-sd-event-27",
    "difficulty": "medium",
    "question": "How does Kafka Log Compaction (\"cleanup.policy = compact\") manage message history, and how does a producer delete a key from a compacted topic?",
    "codeSnippet": "// Key: \"user_42\", Value: \"{ name: 'Alice', email: 'alice@example.com' }\"\n// Key: \"user_42\", Value: \"{ name: 'Alice', email: 'new_email@example.com' }\"\n// How to delete key \"user_42\" completely?",
    "options": [
      {
        "id": "a",
        "text": "Execute a SQL DROP TABLE command against the Kafka broker"
      },
      {
        "id": "b",
        "text": "Log compaction retains at least the last known value for each key within a partition; to delete a key, a producer writes a \"tombstone\" message (the key with a null payload), which the log cleaner purges after delete.retention.ms"
      },
      {
        "id": "c",
        "text": "Shut down the consumer group and re-create the topic"
      },
      {
        "id": "d",
        "text": "Send an HTTP DELETE request to the Schema Registry"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Compacted topics retain the latest value for every key, discarding older superseded records. To delete a key, the producer publishes a tombstone: a record with the key and a null payload. Once the cleaner scans the tombstone, the key is permanently removed.",
    "conceptTag": "kafka-log-compaction"
  },
  {
    "id": "q-sd-event-28",
    "difficulty": "medium",
    "question": "In RabbitMQ, how does a Topic Exchange route a message published with the routing key \"eu.orders.electronics\" when matching against the following binding patterns?",
    "codeSnippet": "// Queue A binding: \"*.orders.*\"\n// Queue B binding: \"eu.#\"\n// Queue C binding: \"us.orders.*\"",
    "options": [
      {
        "id": "a",
        "text": "Delivered only to Queue C"
      },
      {
        "id": "b",
        "text": "Delivered to Queue A and Queue B, but NOT to Queue C (* matches exactly one word; # matches zero or more words)"
      },
      {
        "id": "c",
        "text": "Delivered to all three queues because Topic Exchanges broadcast unconditionally"
      },
      {
        "id": "d",
        "text": "The message is dropped because routing keys cannot contain periods"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In RabbitMQ topic exchanges: * matches exactly one word; # matches zero or more words. \"eu.orders.electronics\" matches *.orders.* (3 words, middle is \"orders\") and matches eu.# (starts with \"eu\"). It does NOT match us.orders.*.",
    "conceptTag": "rabbitmq-topic-exchanges"
  },
  {
    "id": "q-sd-event-29",
    "difficulty": "medium",
    "question": "A Kafka consumer in Java periodically drops out of its consumer group and triggers an expensive rebalance, even though the consumer process never crashed. What is the most common cause and remedy for this issue?",
    "codeSnippet": "// Consumer log:\n// \"Revoking previously assigned partitions for group orders-group\"\n// \"CommitFailedException: The commit failed, as the group has already rebalanced and assigned the partitions to another member.\"",
    "options": [
      {
        "id": "a",
        "text": "The consumer ran out of physical disk space on its local root partition"
      },
      {
        "id": "b",
        "text": "Processing a batch of messages exceeded \"max.poll.interval.ms\", causing the broker to consider the consumer dead and kick it out of the group; remedy by increasing max.poll.interval.ms or reducing max.poll.records"
      },
      {
        "id": "c",
        "text": "The Kafka broker ran out of port numbers"
      },
      {
        "id": "d",
        "text": "The consumer forgot to include TLS certificates in the HTTP headers"
      }
    ],
    "correctOptionId": "b",
    "explanation": "If message processing between successive poll() calls takes longer than max.poll.interval.ms (default 5 minutes), the consumer coordinator assumes the worker has hung, evicts it, and triggers a rebalance. Lowering max.poll.records or raising max.poll.interval.ms resolves this.",
    "conceptTag": "kafka-consumer-rebalance-timeouts"
  },
  {
    "id": "q-sd-event-30",
    "difficulty": "medium",
    "question": "In an Event Sourcing architecture, how is the current state of an entity (e.g., a BankAccount) determined, and how are performance bottlenecks during reconstruction avoided as event history grows?",
    "options": [
      {
        "id": "a",
        "text": "Current state is stored in an unversioned text file; events are deleted after 24 hours"
      },
      {
        "id": "b",
        "text": "State is reconstructed by replaying the immutable sequence of historical domain events (AccountOpened, MoneyDeposited, MoneyWithdrawn); performance is maintained by periodically generating Snapshots of current state"
      },
      {
        "id": "c",
        "text": "Current state is computed by running machine learning predictions on user activity"
      },
      {
        "id": "d",
        "text": "Event sourcing does not allow querying current state"
      }
    ],
    "correctOptionId": "b",
    "explanation": "In Event Sourcing, state is the fold/projection over all past domain events. When event histories become large (thousands of events), loading from genesis becomes slow. Periodic snapshots save the consolidated state at event N, so replay only starts from snapshot N.",
    "conceptTag": "event-sourcing-snapshots"
  },
  {
    "id": "q-sd-event-31",
    "difficulty": "medium",
    "question": "How does CQRS (Command Query Responsibility Segregation) complement Event Sourcing in high-read, complex-domain architectures?",
    "options": [
      {
        "id": "a",
        "text": "CQRS forces all read queries to lock the database write master"
      },
      {
        "id": "b",
        "text": "The write side handles commands, executes business validation, and writes events to the append-only event store; event handlers asynchronously project those events into denormalized read models (e.g. Elasticsearch, PostgreSQL) tailored for fast querying"
      },
      {
        "id": "c",
        "text": "CQRS eliminates the need for database backups"
      },
      {
        "id": "d",
        "text": "Commands are executed by frontend web browsers, while queries run on backend servers"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Event stores are optimized for append-only writes, not complex relational queries. CQRS separates models: commands mutate the event store; projections asynchronously transform events into optimized, denormalized read databases for ultra-fast query execution.",
    "conceptTag": "cqrs-event-sourcing"
  },
  {
    "id": "q-sd-event-32",
    "difficulty": "medium",
    "question": "An engineer writes code that updates a customer balance in PostgreSQL and then immediately calls a message producer to publish an event. What fundamental consistency vulnerability is present?",
    "codeSnippet": "async function depositFunds(accountId, amount) {\n  await db.query(\"UPDATE accounts SET balance = balance + $1 WHERE id = $2\", [amount, accountId]);\n  await kafkaProducer.send({ topic: \"deposits\", message: { accountId, amount } });\n}",
    "options": [
      {
        "id": "a",
        "text": "JavaScript async/await cannot execute SQL queries in production"
      },
      {
        "id": "b",
        "text": "The Dual-Write Hazard: If the server crashes, network fails, or Kafka times out after the SQL query commits but before kafkaProducer.send() succeeds, the event is never published, leaving downstream services permanently out of sync"
      },
      {
        "id": "c",
        "text": "PostgreSQL automatically cancels transactions if Kafka is installed on the same machine"
      },
      {
        "id": "d",
        "text": "The Kafka message will be sent twice because of JavaScript garbage collection"
      }
    ],
    "correctOptionId": "b",
    "explanation": "The Dual-Write Hazard occurs when mutating two independent distributed storage systems without atomic coordination. If step 2 fails after step 1 commits, data is inconsistent. Using the Transactional Outbox pattern or Change Data Capture (CDC) eliminates this flaw.",
    "conceptTag": "dual-write-hazard"
  },
  {
    "id": "q-sd-event-33",
    "difficulty": "medium",
    "question": "When retry logic is invoked across thousands of concurrent clients connecting to an event broker, which backoff jitter strategy best minimizes cluster queue spikes according to AWS Architecture analysis?",
    "codeSnippet": "// Attempt i, base delay = 100ms, cap = 10000ms\n// Strategy A (Full Jitter): sleep = rand(0, min(cap, base * 2^i))\n// Strategy B (Equal Jitter): half = min(cap, base * 2^i) / 2; sleep = half + rand(0, half)\n// Strategy C (No Jitter): sleep = min(cap, base * 2^i)",
    "options": [
      {
        "id": "a",
        "text": "Strategy C (No Jitter) because predictable intervals optimize network routing tables"
      },
      {
        "id": "b",
        "text": "Strategy A (Full Jitter) because it spreads retries completely across the entire backoff duration, eliminating retry clustering and maximizing resource utilization"
      },
      {
        "id": "c",
        "text": "Clients should not retry on errors; they should crash immediately"
      },
      {
        "id": "d",
        "text": "Strategy B is only supported on Linux kernel 2.6"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Full Jitter (random delay between 0 and exponential cap) distributes retry attempts most evenly across time, decorrelating retries and completely flattening thundering-herd spikes on overloaded brokers and databases.",
    "conceptTag": "retry-strategies-full-jitter"
  },
  {
    "id": "q-sd-event-34",
    "difficulty": "medium",
    "question": "In Schema Registry evolution policies, what does \"BACKWARD Compatibility\" guarantee, and what is its operational migration rule?",
    "options": [
      {
        "id": "a",
        "text": "Producers can delete any field at will without notifying consumers"
      },
      {
        "id": "b",
        "text": "Consumers using the NEW schema can process records produced with the OLD schema; therefore, all consumers must be upgraded to the new schema BEFORE producers start publishing with the new schema"
      },
      {
        "id": "c",
        "text": "Producers using the old schema can read data produced with the new schema"
      },
      {
        "id": "d",
        "text": "Old schemas are automatically deleted from disk every 30 days"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Backward compatibility means new code can deserialize data written by old code. Operational rule: Upgrade consumers first (they handle old and new data), then upgrade producers to start emitting the new schema version.",
    "conceptTag": "schema-evolution-backward"
  },
  {
    "id": "q-sd-event-35",
    "difficulty": "hard",
    "question": "In modern Apache Kafka clusters operating in KRaft (Kafka Raft Metadata) mode, how does Kafka prevent split-brain leader scenarios during a network partition between data centers?",
    "options": [
      {
        "id": "a",
        "text": "By requiring a human operator to approve leader elections via email"
      },
      {
        "id": "b",
        "text": "KRaft utilizes a Raft-based consensus quorum among dedicated metadata controller nodes requiring a strict majority ((N/2) + 1); isolated controller partitions lacking majority quorum cannot elect leaders or accept metadata changes"
      },
      {
        "id": "c",
        "text": "KRaft uses DNS round-robin to elect controllers"
      },
      {
        "id": "d",
        "text": "KRaft disables replication across data centers entirely"
      }
    ],
    "correctOptionId": "b",
    "explanation": "KRaft uses the Raft consensus algorithm where metadata changes and leader elections require a majority quorum of active voters. A partitioned minority sub-cluster cannot achieve majority, preventing split-brain dual-leader states.",
    "conceptTag": "kafka-kraft-split-brain"
  },
  {
    "id": "q-sd-event-36",
    "difficulty": "hard",
    "question": "How does the Cooperative Sticky Assignor (\"CooperativeStickyAssignor\") in Kafka differ from the legacy \"RangeAssignor\" or \"RoundRobinAssignor\" during a consumer group rebalance?",
    "codeSnippet": "// Consumer config:\npartition.assignment.strategy = [\n  \"org.apache.kafka.clients.consumer.CooperativeStickyAssignor\"\n]",
    "options": [
      {
        "id": "a",
        "text": "CooperativeStickyAssignor encrypts partition assignments with AES-256"
      },
      {
        "id": "b",
        "text": "Instead of an eager \"stop-the-world\" rebalance where all consumers revoke all partitions before reassignment, it performs incremental rebalancing: only partitions that must move are revoked, while unaffected consumers continue processing their partitions uninterrupted"
      },
      {
        "id": "c",
        "text": "It requires consumers to assign partitions manually via hardcoded partition numbers"
      },
      {
        "id": "d",
        "text": "It prevents any new consumer instances from ever joining the group"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Legacy eager rebalance protocols revoke all partitions across the entire consumer group during rebalance, causing total processing pauses. Cooperative rebalancing reassigns partitions incrementally in two lightweight phases, allowing unaffected consumers to keep running.",
    "conceptTag": "kafka-cooperative-sticky-assignor"
  },
  {
    "id": "q-sd-event-37",
    "difficulty": "hard",
    "question": "In the Reactive Streams specification (Project Reactor / RxJava / Akka Streams), how does pull-based backpressure prevent downstream consumers from suffering OutOfMemory (OOM) errors when consuming high-velocity event streams?",
    "codeSnippet": "// Reactive Streams Flow Control:\nsubscriber.onSubscribe(new Subscription() {\n    @Override\n    public void request(long n) { ... } // Downstream signals demand!\n});",
    "options": [
      {
        "id": "a",
        "text": "The publisher pushes infinite elements and the JVM swaps memory to AWS S3"
      },
      {
        "id": "b",
        "text": "The consumer controls the ingestion rate by explicitly signaling demand: the publisher is forbidden from pushing more than \"n\" requested items until the subscriber processes them and calls subscription.request(n) again"
      },
      {
        "id": "c",
        "text": "Backpressure is handled by dropping all network packets at the Linux socket level"
      },
      {
        "id": "d",
        "text": "The subscriber automatically spawns 1,000 threads per incoming element"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Reactive Streams backpressure is subscriber-driven demand signaling: a publisher cannot emit items faster than requested by the subscriber via request(n). This prevents unbounded memory buffering and downstream OOM crashes under high load.",
    "conceptTag": "reactive-streams-backpressure"
  },
  {
    "id": "q-sd-event-38",
    "difficulty": "hard",
    "question": "An enterprise Kafka topic with 10 partitions is scaled up to 20 partitions to handle increased traffic. What unintended consequence occurs for producers that route messages using customer ID keys, and how is it addressed?",
    "codeSnippet": "// Initial partition count = 10 -> MurmurHash2(\"cust_99\") % 10 = Partition 4\n// New partition count = 20 -> MurmurHash2(\"cust_99\") % 20 = Partition 14!",
    "options": [
      {
        "id": "a",
        "text": "Existing messages in partition 4 are automatically relocated to partition 14 by the broker"
      },
      {
        "id": "b",
        "text": "Strict per-key ordering is broken: subsequent events for \"cust_99\" route to partition 14 while historical events for \"cust_99\" remain unconsumed in partition 4, causing out-of-order processing unless consumers drain old partitions first or custom partitioners are used"
      },
      {
        "id": "c",
        "text": "The topic is permanently corrupted and cannot receive new messages"
      },
      {
        "id": "d",
        "text": "Kafka automatically duplicates partition 4 into partition 14"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Changing partition counts changes the hash modulus (hash(key) % N). New messages for an existing key route to a different partition than previous messages. If both partitions are consumed concurrently, strict temporal ordering for that key is violated.",
    "conceptTag": "kafka-partition-scaling-ordering"
  },
  {
    "id": "q-sd-event-39",
    "difficulty": "hard",
    "question": "When tracing an asynchronous event transaction across multiple microservices using OpenTelemetry, how is the W3C TraceContext propagated across Kafka record boundaries?",
    "codeSnippet": "// Producer side:\nHeaders headers = record.headers();\nOpenTelemetry.getPropagators().getTextMapPropagator().inject(\n    context, headers, (carrier, k, v) -> carrier.add(k, v.getBytes(StandardCharsets.UTF_8))\n);\n// Consumer side: Extracts \"traceparent\" header:\n// traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
    "options": [
      {
        "id": "a",
        "text": "Trace context must be appended to the user's JWT token in local storage"
      },
      {
        "id": "b",
        "text": "Context is injected into Kafka Record Headers as standardized metadata keys (\"traceparent\", \"tracestate\"); consumers extract the header before processing, allowing distributed tracing tools to stitch asynchronous spans into a single unified trace"
      },
      {
        "id": "c",
        "text": "The trace ID must be set as the Kafka partition key"
      },
      {
        "id": "d",
        "text": "Kafka does not support metadata headers on records"
      }
    ],
    "correctOptionId": "b",
    "explanation": "OpenTelemetry injects the W3C traceparent (version, trace ID, parent span ID, trace flags) into Kafka record headers. Consumers extract these headers to create child spans linked to the originating producer span, maintaining end-to-end distributed observability.",
    "conceptTag": "opentelemetry-w3c-tracing-kafka"
  },
  {
    "id": "q-sd-event-40",
    "difficulty": "hard",
    "question": "Martin Kleppmann highlighted that distributed locks without \"fencing tokens\" can lead to data corruption when a client experiences a stop-the-world GC pause. How does a fencing token protect a shared resource (e.g. storage service)?",
    "codeSnippet": "// Client 1 acquires lock -> receives fencing token 33\n// Client 1 undergoes 30-second GC pause -> lock expires!\n// Client 2 acquires lock -> receives fencing token 34\n// Client 2 writes data with token 34 -> SUCCESS\n// Client 1 awakens from GC pause and attempts to write with token 33!",
    "options": [
      {
        "id": "a",
        "text": "The storage service accepts both writes and merges them with Git rebase"
      },
      {
        "id": "b",
        "text": "The storage service verifies that the incoming write's fencing token is strictly greater than the highest token seen so far; Client 1's write with token 33 is rejected because token 34 was already committed"
      },
      {
        "id": "c",
        "text": "Client 1 automatically terminates its own OS process"
      },
      {
        "id": "d",
        "text": "Fencing tokens only work on non-distributed single-threaded databases"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Fencing tokens are monotonically increasing integers issued by lock managers. The storage service tracks the highest token it has processed and rejects any write presenting a lower/stale token, immunizing against zombie writes from paused or partitioned clients.",
    "conceptTag": "distributed-fencing-tokens"
  },
  {
    "id": "q-sd-event-41",
    "difficulty": "hard",
    "question": "In the Raft consensus protocol, what is the \"Log Matching Property\", and how does it guarantee consistency across followers?",
    "options": [
      {
        "id": "a",
        "text": "All nodes must write logs to identical physical hard drive sectors"
      },
      {
        "id": "b",
        "text": "If two logs contain an entry with the same index and term, they are guaranteed to store identical commands in that entry, AND their logs are identical in all entries up through the given index"
      },
      {
        "id": "c",
        "text": "Log entries must be written in alphabetical order"
      },
      {
        "id": "d",
        "text": "Followers can commit log entries before the leader receives them"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Raft's Log Matching Property enforces: 1) If two entries in different logs have identical index and term, they store the same command; 2) If two entries have the same index and term, their logs are completely identical up to that index. Leaders overwrite follower discrepancies.",
    "conceptTag": "raft-consensus-log-matching"
  },
  {
    "id": "q-sd-event-42",
    "difficulty": "hard",
    "question": "In Kafka partition replication, what is the distinction between Log End Offset (LEO) and High-Water Mark (HWM), and why are consumers restricted to reading only up to the HWM?",
    "codeSnippet": "// Leader Log: [msg0, msg1, msg2, msg3, msg4] -> LEO = 5\n// Follower 1 (ISR): [msg0, msg1, msg2]         -> LEO = 3\n// Follower 2 (ISR): [msg0, msg1, msg2]         -> LEO = 3\n// What is the High-Water Mark (HWM)?",
    "options": [
      {
        "id": "a",
        "text": "HWM is 5; consumers can read msg3 and msg4 immediately"
      },
      {
        "id": "b",
        "text": "HWM is 3 (offset replicated across all In-Sync Replicas); consumers can only read up to HWM (msg0..msg2) to prevent reading uncommitted data that could be lost or truncated if the leader dies before replication"
      },
      {
        "id": "c",
        "text": "HWM is the maximum RAM usage of the broker in gigabytes"
      },
      {
        "id": "d",
        "text": "Consumers read LEO on odd days and HWM on even days"
      }
    ],
    "correctOptionId": "b",
    "explanation": "LEO is the offset of the next record to be written to a broker's log. HWM is the highest offset replicated to all ISRs. Records between HWM and LEO are uncommitted. Exposing them to consumers would allow dirty reads that could vanish if an un-replicated leader fails.",
    "conceptTag": "kafka-hwm-leo-replication"
  },
  {
    "id": "q-sd-event-43",
    "difficulty": "hard",
    "question": "To prevent \"Ghost Rebalances\" in a high-throughput Java Kafka consumer processing compute-heavy image rendering tasks, how should the consumer threading model be architected?",
    "options": [
      {
        "id": "a",
        "text": "Execute the image rendering task directly inside the poll() thread with Thread.sleep()"
      },
      {
        "id": "b",
        "text": "Decouple polling from processing: run a dedicated single thread responsible exclusively for calling consumer.poll() and sending heartbeats, while offloading message processing to a bounded worker thread pool with manual offset tracking"
      },
      {
        "id": "c",
        "text": "Disable heartbeats in the Kafka client configuration"
      },
      {
        "id": "d",
        "text": "Set max.poll.interval.ms to 0"
      }
    ],
    "correctOptionId": "b",
    "explanation": "If long-running processing blocks the thread calling consumer.poll(), the consumer misses its heartbeat/poll deadlines and triggers unnecessary rebalances. Offloading tasks to worker thread pools keeps the polling loop responsive and stable.",
    "conceptTag": "kafka-decoupled-worker-threads"
  },
  {
    "id": "q-sd-event-44",
    "difficulty": "hard",
    "question": "Why are Vector Clocks superior to Lamport Timestamps for causality tracking in multi-leader distributed event stores?",
    "codeSnippet": "// Node A: V_A = [A:1, B:0]\n// Node B: V_B = [A:0, B:1]\n// Are V_A and V_B causally ordered or concurrent?",
    "options": [
      {
        "id": "a",
        "text": "Lamport timestamps require GPS satellites, while Vector Clocks run on local quartz oscillators"
      },
      {
        "id": "b",
        "text": "Lamport timestamps impose an arbitrary total order but CANNOT distinguish whether two events are causally related or concurrent; Vector Clocks capture partial ordering, allowing systems to detect genuine concurrent conflicting updates"
      },
      {
        "id": "c",
        "text": "Vector clocks take zero bytes of network bandwidth"
      },
      {
        "id": "d",
        "text": "Lamport timestamps can only sort strings, not numbers"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Lamport timestamps provide a total order where if A < B, it does not imply A caused B. Vector clocks record a clock vector per node, allowing the system to definitively distinguish whether an event happened-before another or whether two events occurred concurrently (conflict).",
    "conceptTag": "vector-clocks-causality"
  },
  {
    "id": "q-sd-event-45",
    "difficulty": "hard",
    "question": "When streaming database changes using Debezium CDC from PostgreSQL Write-Ahead Logs (WAL) to Kafka, how does Debezium preserve multi-table atomic transaction boundaries across distributed Kafka topics?",
    "options": [
      {
        "id": "a",
        "text": "By pausing all database writes until Kafka acknowledges receipt"
      },
      {
        "id": "b",
        "text": "By emitting Transaction Metadata events to a dedicated transaction topic (containing transaction ID, data collection events count, and status: BEGIN/END), enabling downstream consumers to reassemble multi-record transaction boundaries"
      },
      {
        "id": "c",
        "text": "By converting all PostgreSQL tables into a single monolithic text file"
      },
      {
        "id": "d",
        "text": "Debezium cannot capture transactions spanning multiple tables"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Debezium's transaction metadata feature streams BEGIN and END transaction markers with transaction IDs and event counts to a metadata topic. Downstream consumers consume these markers to buffer and atomically apply multi-table changes together.",
    "conceptTag": "debezium-cdc-transaction-boundaries"
  },
  {
    "id": "q-sd-event-46",
    "difficulty": "hard",
    "question": "In a distributed Saga orchestrator handling concurrent flight reservations, two events arrive out of order for the same reservation ID (FlightBooked arrives AFTER FlightCancelled). How does the orchestrator prevent resurrecting the cancelled booking?",
    "codeSnippet": "// Out-of-order arrival:\n// Event 1 (Timestamp T2): FlightCancelled\n// Event 2 (Timestamp T1, delayed in transit): FlightBooked",
    "options": [
      {
        "id": "a",
        "text": "The orchestrator executes FlightBooked unconditionally and reopens the reservation"
      },
      {
        "id": "b",
        "text": "The orchestrator employs an Aggregate State Machine with monotonic versioning or terminal state checks: once an entity reaches terminal state \"CANCELLED\", incoming events with older sequence versions or incompatible state transitions are rejected as stale"
      },
      {
        "id": "c",
        "text": "The orchestrator restarts the entire Kafka cluster"
      },
      {
        "id": "d",
        "text": "The orchestrator issues a refund to all passengers on the plane"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Distributed orchestrators use formal state machines and sequence versioning. Terminal states (CANCELLED, COMPLETED) reject stale transitions, and version numbers ensure delayed events from earlier epochs cannot overwrite newer terminal states.",
    "conceptTag": "saga-out-of-order-events"
  },
  {
    "id": "q-sd-event-47",
    "difficulty": "hard",
    "question": "When an event consumer interacts with a non-transactional external payment gateway (e.g. Stripe API) that does not participate in Kafka transactions, how is end-to-end exactly-once payment processing achieved?",
    "codeSnippet": "// Processing order payment:\nString idempotencyKey = String.format(\"pay_%s_%d_%d\", record.topic(), record.partition(), record.offset());\nstripeClient.charges.create(chargeParams, RequestOptions.builder().setIdempotencyKey(idempotencyKey).build());",
    "options": [
      {
        "id": "a",
        "text": "By disabling TLS encryption on the payment gateway API"
      },
      {
        "id": "b",
        "text": "By passing a deterministic idempotency key derived from the Kafka record's immutable coordinates (topic, partition, offset) or domain entity ID in the API request; if the consumer crashes and retries, Stripe detects the duplicate key and returns the original charge result without recharging"
      },
      {
        "id": "c",
        "text": "By running the payment gateway inside a Docker container on the Kafka broker"
      },
      {
        "id": "d",
        "text": "It is impossible to achieve exactly-once effects with external third-party APIs"
      }
    ],
    "correctOptionId": "b",
    "explanation": "External non-transactional APIs require idempotency keys. Generating a deterministic idempotency key from Kafka message metadata (topic-partition-offset) or business UUID ensures that redeliveries during consumer recovery hit the external API with the identical idempotency key, preventing duplicate charges.",
    "conceptTag": "exactly-once-external-sinks"
  },
  {
    "id": "q-sd-event-48",
    "difficulty": "hard",
    "question": "In Kafka Transactions, how does the Transaction Coordinator use \"Zombie Fencing\" to handle a partitioned producer instance that attempts to write after a replacement instance has been launched?",
    "options": [
      {
        "id": "a",
        "text": "The coordinator sends a Linux SIGKILL command over SSH to the old instance"
      },
      {
        "id": "b",
        "text": "Each producer is configured with a persistent \"transactional.id\". When a new instance registers with InitProducerId, the coordinator increments the producer's \"epoch\"; writes from the old zombie instance presenting the older epoch are immediately rejected with ProducerFencedException"
      },
      {
        "id": "c",
        "text": "The coordinator deletes the topic partition"
      },
      {
        "id": "d",
        "text": "The coordinator reboots the entire broker cluster"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Kafka assigns an epoch to each transactional.id. When a new producer starts with the same transactional.id, the broker bumps the epoch. Any late writes from a partitioned or zombie producer presenting the stale epoch fail with ProducerFencedException.",
    "conceptTag": "kafka-zombie-fencing-transactions"
  },
  {
    "id": "q-sd-event-49",
    "difficulty": "hard",
    "question": "The Confluent Parallel Consumer library enables concurrent processing within a single Kafka partition. How does it maintain strict per-entity ordering while processing records in parallel across a thread pool?",
    "codeSnippet": "// Records in Partition 0:\n// [Record A (User 1), Record B (User 2), Record C (User 1), Record D (User 3)]\n// Parallel Consumer routes records to worker threads:",
    "options": [
      {
        "id": "a",
        "text": "It re-hashes the records and writes them to 50 temporary Kafka topics"
      },
      {
        "id": "b",
        "text": "It uses Key-based Work Queues: records with different keys (User 1 vs User 2 vs User 3) are dispatched concurrently to separate threads, but records sharing the same key (Record A and Record C for User 1) are strictly queued in sequence"
      },
      {
        "id": "c",
        "text": "It requires all records to be sorted by timestamp on the client machine"
      },
      {
        "id": "d",
        "text": "It processes records completely out of order and ignores key constraints"
      }
    ],
    "correctOptionId": "b",
    "explanation": "Parallel Consumer parses partition records and groups them by record key. Work for distinct keys executes concurrently across a thread pool, but work for identical keys is serialized, achieving massive parallelism without violating per-entity order.",
    "conceptTag": "parallel-consumer-key-queues"
  },
  {
    "id": "q-sd-event-50",
    "difficulty": "hard",
    "question": "In Apache Kafka Java Producer internals, what occurs when the RecordAccumulator buffer pool (\"buffer.memory\", default 32MB) is exhausted because downstream broker network throughput is lower than ingestion rate?",
    "codeSnippet": "// Producer configuration:\nbuffer.memory = 33554432; // 32 MB\nmax.block.ms = 60000;     // 60 seconds",
    "options": [
      {
        "id": "a",
        "text": "The producer silently discards incoming messages without alerting the caller"
      },
      {
        "id": "b",
        "text": "Producer send() calls block up to \"max.block.ms\"; if the buffer pool does not free up memory within that timeout window, send() throws a TimeoutException, applying backpressure to the calling application"
      },
      {
        "id": "c",
        "text": "The producer process automatically forks a new JVM instance"
      },
      {
        "id": "d",
        "text": "Kafka compresses existing buffer memory using LZ4 with lossy downsampling"
      }
    ],
    "correctOptionId": "b",
    "explanation": "When RecordAccumulator memory reaches buffer.memory, producer.send() blocks until memory is freed by completed broker acknowledgments. If memory is not freed within max.block.ms, it throws a TimeoutException, propagating backpressure upstream.",
    "conceptTag": "kafka-producer-buffer-backpressure"
  }
];
