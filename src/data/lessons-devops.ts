import { Lesson } from '@/lib/types';

export const devopsLessons: Lesson[] = [
  {
    id: 'mongodb-document-model',
    slug: 'mongodb-document-model',
    title: 'MongoDB Document Persistence',
    subtitle: 'From relational tables to BSON documents: schema modeling, indexing, and MongoTemplate queries.',
    moduleId: '06',
    moduleTitle: '06. Database & Persistence',
    duration: '12 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'Relational tables vs MongoDB flexible BSON document models',
      'The golden rule: Embedding (1-to-few) vs Referencing (1-to-many)',
      'Writing filtered queries and atomic updates using MongoTemplate',
      'Indexing strategies: Compound indexes and Covered queries',
      'Persisting in-progress policy states and audit dismissal logs',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Relational vs Document Model',
        subtitle: 'Why modern microservices store complex state in MongoDB',
        type: 'concept',
        content: `Relational SQL databases enforce rigid rectangular tables with strict schemas and foreign-key joins. Storing a hierarchical object like an **Insurance Policy** (with policyholders, coverage riders, payment records, and dynamic claim history) requires splitting data across 6 different tables and performing expensive joins on read.

**MongoDB** stores data as **BSON (Binary JSON)** documents:
- Natural object-oriented mapping: Java nested objects serialize directly into hierarchical JSON structures.
- Schema flexibility: Different policy types can store polymorphic attributes without complex SQL schema migration scripts (\`ALTER TABLE\`).
- High-speed reads: Retrieve the entire policy and all its nested sub-documents in a single disk read!`,
        keyIdea: 'MongoDB documents align naturally with domain objects, eliminating expensive multi-table SQL joins.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'Schema Design: Embed vs Reference',
        subtitle: 'The fundamental architectural decision in MongoDB',
        type: 'trade-off',
        content: `When modeling relationships in MongoDB, ask: **"Do these entities live and die together?"**

1. **Embedding (Denormalization)**:
   - *When to use*: 1-to-few relationships where child data is always queried together with the parent (e.g. Policy Coverage Items or Addresses).
   - *Advantage*: Atomic updates in a single document; single read fetch.
   - *Limitation*: MongoDB enforces a strict **16MB maximum document size limit**.
2. **Referencing (Normalization)**:
   - *When to use*: 1-to-many or many-to-many relationships where children grow unbounded (e.g. Audit Logs, Payment History over 10 years).
   - Store an array of \`ObjectId\` or reference key in a separate collection.`,
        keyIdea: 'Embed data when items are queried together and bounded in size; reference across collections when data grows indefinitely.',
        codeExample: {
          title: 'PolicyDocumentSchema.java',
          code: `@Document(collection = "policies")
public class PolicyDocument {
    @Id
    private String id;
    private String policyNumber;
    private PolicyStatus status; // IN_PROGRESS, ACTIVE, CANCELLED

    // Embedded 1-to-few subdocument
    private CustomerProfile customer;
    private List<CoverageRider> riders;

    // Referenced collection identifier for unbounded audit history
    private String auditLogCollectionId;

    @Indexed
    private LocalDateTime lastModifiedDate;
}`,
        },
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'MongoTemplate: Atomic Updates & Filtered Queries',
        subtitle: 'Advanced queries without loading the whole document into memory',
        type: 'solution',
        content: `While Spring Data Mongo provides \`MongoRepository\`, high-throughput microservices rely on **\`MongoTemplate\`** for granular, atomic updates.

Instead of reading a massive 2MB document into Java memory, updating a field, and saving the whole document back (which creates race conditions), \`MongoTemplate\` executes in-place atomic operator updates:
- \`$set\`: Update specific fields in-place
- \`$push\` / \`$addToSet\`: Append items to an array atomically
- \`$inc\`: Increment counters atomically without locks`,
        keyIdea: 'Use MongoTemplate in-place atomic operators ($set, $push) to eliminate read-modify-write race conditions.',
        codeExample: {
          title: 'MongoTemplateAtomicUpdate.java',
          code: `@Repository
public class PolicyCustomRepositoryImpl implements PolicyCustomRepository {
    private final MongoTemplate mongoTemplate;

    public PolicyCustomRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public boolean updatePolicyStatusAndDismissAudit(String policyId,
                                                    PolicyStatus newStatus,
                                                    AuditDismissalLog dismissalLog) {
        Query query = new Query(Criteria.where("policyNumber").is(policyId)
                                        .and("status").is(PolicyStatus.IN_PROGRESS));

        Update update = new Update()
            .set("status", newStatus)
            .set("lastModifiedDate", LocalDateTime.now())
            .push("auditDismissals", dismissalLog); // Atomic push to array!

        UpdateResult result = mongoTemplate.updateFirst(query, update, PolicyDocument.class);
        return result.getModifiedCount() > 0;
    }
}`,
        },
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'cicd-pipeline',
    slug: 'cicd-pipeline',
    title: 'CI/CD Pipeline & Code Quality',
    subtitle: 'From Git commit to automated Maven builds, SonarQube, Fortify SAST, and Jenkins deployment.',
    moduleId: '07',
    moduleTitle: '07. DevOps & CI/CD',
    duration: '10 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The stages of a modern GitLab CI / Jenkins declarative pipeline',
      'Automated testing and Maven lifecycle phases (compile, test, package, verify)',
      'SonarQube quality gates: code coverage, technical debt, and code smells',
      'Fortify Static Application Security Testing (SAST) for vulnerability remediation',
      'Containerizing Spring Boot apps into hardened Docker images for WildFly/Cloud',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Git Commit to Webhook Trigger',
        subtitle: 'The automated heartbeat of modern software delivery',
        type: 'concept',
        content: `Continuous Integration begins when a developer pushes a Git branch or opens a Pull Request.

A Git webhook triggers the CI server (**Jenkins** or **GitLab CI/CD**). The pipeline runs inside an ephemeral Docker container or Kubernetes runner agent:
1. Checks out the specific Git commit SHA.
2. Resolves and caches Maven dependencies from a private Nexus/Artifactory mirror.
3. Enforces branch protection rules (no direct commits to \`main\`).`,
        keyIdea: 'Automated CI pipelines eliminate "works on my machine" bugs by building code in pristine, standardized container runners.',
        diagramState: 'git-commit',
      },
      {
        id: 'step-2',
        title: 'Maven Build & Automated Test Execution',
        subtitle: 'Unit tests, mock verification, and contract tests',
        type: 'solution',
        content: `The pipeline executes \`mvn clean verify\`.

During the **\`test\`** phase:
- **JUnit 5 & Mockito**: Fast unit tests run against services, DTO mappings, and business algorithms with 0 external dependencies.
- **Testcontainers**: Boots transient Docker containers running real MongoDB and PostgreSQL instances to run integration tests under real conditions!

If a single unit or integration test fails, the build halts immediately, flagging the pull request and alerting the team.`,
        keyIdea: 'Testcontainers enables high-fidelity integration testing against real database engines in CI without shared staging conflicts.',
        diagramState: 'maven-build',
      },
      {
        id: 'step-3',
        title: 'SonarQube & Fortify Security Scans',
        subtitle: 'Automated code quality gates and security remediation',
        type: 'insight',
        content: `Before any artifact can be deployed, it must pass strict automated quality gates:

1. **SonarQube**:
   - Analyzes test coverage (minimum 80% line and branch coverage).
   - Identifies **Technical Debt**, cognitive complexity, duplicated code, and code smells.
2. **Fortify (SAST - Static Application Security Testing)**:
   - Scans bytecode and source code for OWASP Top 10 vulnerabilities: SQL/NoSQL injection, insecure deserialization, hardcoded secrets, weak cryptographic algorithms, and path traversal exploits.
   - Any high or critical finding blocks the release pipeline until remediated!`,
        keyIdea: 'Static analysis gates enforce security and maintainability standards automatically on every pull request.',
        diagramState: 'sonar-scan',
      },
      {
        id: 'step-4',
        title: 'Canary & Rolling Production Releases',
        subtitle: 'Deploying with zero downtime',
        type: 'recap',
        content: `Once tests and scans pass:
1. Maven packages the application into an executable JAR.
2. Docker builds a hardened OCI container image using multi-stage builds.
3. The image is published to a private container registry.
4. Deployment to **JBoss/WildFly** or cloud infrastructure executes via a **Rolling Update**: new pods start and pass HTTP readiness probes before old pods are gracefully drained and terminated.

Zero downtime. Zero customer disruption.`,
        keyIdea: 'Automated quality gates and rolling deployments ensure fast, fearless production releases.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'observability-stack',
    slug: 'observability-stack',
    title: 'Production Observability & RCA',
    subtitle: 'The Three Pillars: CloudWatch Metrics, Splunk Log Analysis, and ELK distributed tracing for Root Cause Analysis.',
    moduleId: '07',
    moduleTitle: '07. DevOps & CI/CD',
    duration: '10 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The Three Pillars of Observability: Metrics, Logs, and Distributed Traces',
      'AWS CloudWatch alarms for CPU, memory, and JVM thread starvation',
      'Splunk query language (SPL) for fast production incident investigation',
      'ELK Stack (Elasticsearch, Logstash, Kibana) for structured JSON log ingestion',
      'Conducting systematic Root Cause Analysis (RCA) on production incidents',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Three Pillars of Observability',
        subtitle: 'Why logs alone are not enough in microservices',
        type: 'concept',
        content: `In a monolithic application, you could SSH into the server and \`tail -f app.log\`. In modern cloud architectures with hundreds of microservices processing millions of policies, this is impossible.

True observability rests on **Three Pillars**:
1. **Metrics**: Numeric aggregations over time (e.g. CPU utilization, p95 latency, JVM heap usage, HTTP 5xx error rate). *Answers: "Is something wrong?"*
2. **Logs**: Timestamped structured event strings emitted by applications. *Answers: "Why is it wrong?"*
3. **Traces**: End-to-end request journeys across distributed services with span IDs and timing breakdowns. *Answers: "Where is the bottleneck?"*`,
        keyIdea: 'Metrics notify you that a problem exists; traces pinpoint the failing service; logs reveal the exact exception root cause.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'Splunk & ELK: Production Log Analysis',
        subtitle: 'Indexing millions of log lines with correlation IDs',
        type: 'solution',
        content: `High-performance Spring Boot applications output structured **JSON logs** via Logback and SLF4J:
\`{ "timestamp": "...", "level": "ERROR", "correlationId": "8f-9a", "message": "Downstream timeout" }\`

Log collectors (Logstash or Splunk Universal Forwarder) ship logs into **Elasticsearch / Splunk**:
- **Splunk Search Processing Language (SPL)** allows engineers to filter millions of log events in seconds during high-priority production incidents (P1/P2).
- Filtering by **\`correlationId\`** reconstructs the exact timeline of a single failed customer policy transaction across 8 microservices!`,
        keyIdea: 'MDC Correlation IDs tie logs across distributed microservices together into a single searchable story.',
        codeExample: {
          title: 'SplunkSPLProductionQuery.spl',
          code: `# Search for downstream payment timeouts in the last 1 hour:
index=insurance_prod sourcetype=spring_boot "Downstream" OR "PaymentGatewayException"
| stats count by exception_type, downstream_service
| sort - count

# Trace a specific failed customer transaction across all services:
index=insurance_prod correlation_id="8f9b2a-pol-9921"
| table _time, app_name, log_level, message, response_time_ms
| sort _time asc`,
        },
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'Root Cause Analysis (RCA) Methodology',
        subtitle: 'From alert to permanent architectural remediation',
        type: 'recap',
        content: `When a production incident occurs:
1. **Detection & Triage**: AWS CloudWatch triggers a PagerDuty alert on elevated 5xx error rates.
2. **Investigation**: Query Splunk for the onset timestamp, isolating error patterns and affected customer accounts.
3. **Mitigation**: Scale pods, toggle a feature flag, or trip a circuit breaker to restore service.
4. **Root Cause Analysis (RCA)**: Perform a **5-Whys analysis** to determine why the incident occurred and why tests did not catch it.
5. **Corrective Action**: Deploy automated regression tests, update timeout configurations, and enhance monitoring dashboards.`,
        keyIdea: 'A blameless Root Cause Analysis (RCA) transforms production incidents into permanent architectural resilience.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'offheap-ffm-api',
    slug: 'offheap-ffm-api',
    title: 'Off-Heap Memory & Modern FFM API',
    subtitle: 'Direct ByteBuffer vs Java 22+ Project Panama: Arena lifetimes, MemorySegment, and Linux RSS vs JVM Heap OOM.',
    moduleId: '07',
    moduleTitle: '07. DevOps & Performance',
    duration: '15 min',
    difficulty: 'Advanced',
    youllLearn: [
      'Why Kubernetes OOMKills JVM pods even when Heap usage is under 40%',
      'Legacy DirectByteBuffer pitfalls: sun.misc.Unsafe, PhantomReference, and GC-dependent cleaner leaks',
      'Java 22+ Foreign Function & Memory (FFM) API: Arena, MemorySegment, and deterministic scoped frees',
      'Native Memory Tracking (NMT): isolating off-heap allocations, Metaspace, and C-runtime malloc',
      'Zero-copy networking and native C-library interop without brittle JNI headers',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Silent Killer: Linux RSS vs JVM Heap',
        subtitle: 'Why your container gets killed when Java heap graphs look completely healthy',
        type: 'problem',
        productionSymptom: 'A container with -Xmx2g was killed by Kubernetes with OOMKilled (Exit Code 137) at the 4GB cgroup limit. JVM dashboards showed Heap usage was under 1.4GB! Why did Linux terminate the process when the JVM heap appeared completely healthy?',
        content: `In production cloud environments, developers configure \`-Xmx2g\` on a container provisioned with 3GB of RAM and assume they have a safe 1GB buffer. Suddenly, Kubernetes terminates the pod with **OOMKilled (Exit Code 137)**.
        
The JVM process Resident Set Size (RSS) consists of much more than Java Heap:
- **Java Heap**: Managed by GC (\`-Xmx\`).
- **Metaspace & Class Data**: Loaded bytecode and reflection metadata.
- **Thread Stacks**: 1MB per OS platform thread (\`-Xss1m\`).
- **JIT Code Cache**: Compiled native x86/ARM machine code.
- **Off-Heap Direct Buffers & Native C Libraries**: Memory allocated outside the garbage-collected heap via \`malloc\` or \`mmap\`. When off-heap buffers leak, JVM GC cannot collect them until a full GC is forced!`,
        keyIdea: 'Kubernetes enforces memory limits on Linux process Resident Set Size (RSS), not JVM Heap. Off-heap native memory leaks cause instant cgroup termination.',
        cliInspection: {
          command: 'jcmd 1 VM.native_memory summary',
          output: `1:
Native Memory Tracking:

Total: reserved=4821MB, committed=3954MB
-                 Java Heap (reserved=2048MB, committed=1450MB)
-                    Class (reserved=1120MB, committed=180MB)
-                   Thread (reserved=350MB, committed=350MB) (340 threads)
-                     Code (reserved=250MB, committed=98MB)
-                       GC (reserved=180MB, committed=180MB)
-            Internal/Arena (reserved=873MB, committed=1696MB) <-- LEAK!`,
          explanation: 'Native Memory Tracking (NMT) breaks down memory by category. Notice committed Internal/Arena native allocations exceeding 1.6GB outside the 1.45GB Java Heap.',
        },
        microCheck: {
          question: 'If a JVM container has -Xmx4g and runs on an 8GB RAM host, what happens if application code allocates 5GB of off-heap memory via malloc/FFM?',
          options: [
            'Java throws java.lang.OutOfMemoryError: Java heap space immediately.',
            'The JVM will run normally if physical host RAM is available, but Linux will OOMKill it if container cgroup limit is exceeded.',
            'Garbage collection will automatically shrink the JVM heap to compensate for the native memory.',
            'The off-heap memory is automatically swapped to disk by the JIT compiler.',
          ],
          answerIndex: 1,
          explanation: 'Off-heap memory allocations bypass JVM heap tracking. As long as the operating system or container cgroup limit is not breached, allocations succeed; once breached, the Linux kernel terminates the process via SIGKILL.',
        },
        diagramState: 'offheap-vs-heap',
      },
      {
        id: 'step-2',
        title: 'Legacy ByteBuffer vs Java 22 FFM API',
        subtitle: 'From risky sun.misc.Unsafe to type-safe, scoped deterministic Arenas',
        type: 'concept',
        content: `Historically, high-performance systems (Netty, Kafka, RocksDB, Cassandra) bypassed on-heap GC pauses by allocating direct off-heap memory using \`ByteBuffer.allocateDirect()\` or internal \`sun.misc.Unsafe.allocateMemory()\`.
        
However, legacy off-heap memory suffered from critical flaws:
1. **Nondeterministic Deallocation**: A \`DirectByteBuffer\` holds a native pointer cleaned up only when its Java reference becomes unreachable and a background GC \`Cleaner\` thread runs.
2. **Buffer Capacity Limitations**: Traditional \`ByteBuffer\` is indexed by a 32-bit signed integer, limiting individual buffers to 2GB.
3. **Segmentation Faults**: Accessing deallocated native memory via \`Unsafe\` crashes the entire JVM process immediately.

Java 22 finalized the **Foreign Function & Memory (FFM) API** (JEP 454) in package \`java.lang.foreign\`, introducing:
- **\`MemorySegment\`**: A contiguous region of native memory with spatial bounds checking and 64-bit addressing.
- **\`Arena\`**: Controls the deterministic lifetime of one or more memory segments. Closing the Arena frees all associated native memory immediately!`,
        keyIdea: 'Java 22 FFM API replaces unpredictable GC Cleaners and dangerous Unsafe calls with deterministic, scoped Arenas and bounds-checked MemorySegments.',
        codeExample: {
          title: 'ModernOffHeapFFM.java',
          code: `import java.lang.foreign.*;
import java.lang.invoke.VarHandle;

public class NativeBufferPipeline {
    public static void main(String[] args) {
        // 1. Confined Arena guarantees deterministic native cleanup on close
        try (Arena arena = Arena.ofConfined()) {
            long elementCount = 10_000_000L;
            
            // 2. Allocate 80MB of native off-heap memory outside the GC Heap
            MemorySegment segment = arena.allocate(
                ValueLayout.JAVA_LONG, elementCount
            );
            
            // 3. Fast bounds-checked sequential write
            for (long i = 0; i < elementCount; i++) {
                segment.setAtIndex(ValueLayout.JAVA_LONG, i, i * 42L);
            }
            
            System.out.println("Read native index 500: " + 
                segment.getAtIndex(ValueLayout.JAVA_LONG, 500));
        } // 4. Deterministic native memory free occurs HERE immediately!
        // No waiting for GC, no Cleaner thread latency, zero memory leaks.
    }
}`,
        },
        diagramState: 'ffm-arena-lifecycle',
      },
      {
        id: 'step-3',
        title: 'Native Memory Tracking (NMT) in Production',
        subtitle: 'Diagnosing off-heap leaks before container OOMKill occurs',
        type: 'solution',
        content: `To inspect native off-heap usage, enable HotSpot Native Memory Tracking at startup:
\`-XX:NativeMemoryTracking=summary\` or \`-XX:NativeMemoryTracking=detail\`

During continuous integration or production triage, capture a baseline and compare diffs over time:
1. Baseline: \`jcmd <pid> VM.native_memory baseline\`
2. Workload Run: Execute heavy batch or streaming operations.
3. Diff: \`jcmd <pid> VM.native_memory detail.diff\`

NMT outputs an exact delta (e.g. \`+420MB\`) attributed to specific allocation sites, isolating whether the leak stems from direct byte buffers, unclosed FFM arenas, third-party JNI C-libraries, or class metadata expansion.`,
        keyIdea: 'Use jcmd VM.native_memory baseline and detail.diff to pinpoint off-heap native memory growth down to the exact call site.',
        cliInspection: {
          command: 'jcmd 1 VM.native_memory detail.diff',
          output: `1:
Native Memory Tracking:

Total: reserved=5120MB (+299MB), committed=4320MB (+366MB)
-                 Java Heap (reserved=2048MB, committed=1450MB) (no change)
-                    Class (reserved=1120MB, committed=182MB (+2MB))
-                   Thread (reserved=350MB, committed=350MB)
-            Arena / OffHeap (reserved=920MB (+297MB), committed=1990MB (+294MB))
             [0x00007f9a14000000 - 0x00007f9a26000000] malloc at NativeBufferPipeline.main`,
          explanation: 'Notice how Java Heap has no change, while Arena/OffHeap jumped by +294MB committed directly from NativeBufferPipeline.main.',
        },
        diagramState: 'nmt-inspection',
      },
    ],
  },
];
