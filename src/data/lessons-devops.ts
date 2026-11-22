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
        subtitle: 'A single family photo album vs cutting photos into pieces across 6 cabinets',
        type: 'concept',
        content: `Imagine flipping through a family vacation photo album. You open the album, and on one glossy page you see the family photo, the date, the location, and handwritten captions right beneath it. Everything belongs together in one place.

Now imagine a relational SQL database: to store that same photo, you must take scissors and cut out the faces into Drawer 1, the background scenery into Drawer 2, and the captions into Drawer 3. Every time you want to view the photo, you must pull all three drawers open and tape the pieces back together (**A SQL JOIN**)!

**MongoDB** stores data as **BSON (Binary JSON) documents**:
- **Natural Object Mapping**: Your Java domain objects (like an \`InsurancePolicy\` with customer details, coverage plans, and payment records) save directly into a single hierarchical document.
- **High-Speed Reads**: Retrieve the entire customer policy and all its nested sub-documents in a single lightning-fast disk read, with zero expensive table joins!
- **Schema Flexibility**: Different policy types can hold different fields without needing painful database schema migration scripts (\`ALTER TABLE\`).`,
        keyIdea: 'MongoDB documents store hierarchical data in single cohesive records, eliminating expensive multi-table SQL joins.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'Schema Design: Embed vs Reference',
        subtitle: 'Your pocket wallet vs a basement storage unit',
        type: 'trade-off',
        content: `When designing your database schema in MongoDB, ask yourself one golden question: **"Do these items live and die together, or do they grow forever?"**

1. **Embedding (Your Pocket Wallet - 1-to-Few)**:
   - You carry your driver's license, credit card, and insurance ID right inside your pocket wallet. They are bounded in size and you always use them together.
   - In MongoDB, embed sub-documents (like a Policy's list of coverage riders or home addresses) directly inside the main document.
   - *Limitation*: MongoDB enforces a strict **16MB maximum document size limit**.

2. **Referencing (The Basement Storage Unit - 1-to-Many Unbounded)**:
   - You wouldn't stuff 10 years of tax receipts and utility bills into your pocket wallet; your wallet would burst at the seams! You store older records in labeled boxes in a storage unit.
   - When data grows indefinitely (like 10,000 audit log events or payment histories over 5 years), store them in a separate collection and link them using an \`ObjectId\` or foreign key.`,
        keyIdea: 'Embed child data when items are queried together and bounded in size; reference across collections when data grows indefinitely.',
        codeExample: {
          title: 'PolicyDocumentSchema.java',
          code: `import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "policies")
public class PolicyDocument {
    @Id
    private String id;
    private String policyNumber;
    private String status; // IN_PROGRESS, ACTIVE, CANCELLED

    // Embedded 1-to-few subdocument (fits neatly inside the 16MB document):
    private CustomerProfile customer;
    private List<CoverageRider> riders;

    // Referenced collection identifier for unbounded audit history:
    private String auditLogCollectionId;

    @Indexed
    private LocalDateTime lastModifiedDate;

    // Standard getters and setters...
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}`,
        },
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'MongoTemplate: Atomic Updates & Filtered Queries',
        subtitle: 'Editing one line in a shared doc vs re-uploading an entire 500-page PDF',
        type: 'solution',
        content: `Imagine collaborating with a teammate:
- **The Slow, Dangerous Way**: You download an entire 500-page PDF document to your laptop, change a single typo on page 4 over 10 minutes, and re-upload the entire 500-page file. If your teammate was editing page 10 at the same time, your upload overwrites and destroys their work (**Read-Modify-Write Race Condition**)!
- **The Smart, Atomic Way**: You use an online live doc to edit just that single sentence on page 4 in-place. Your teammate's edits are completely safe!

In Spring Boot microservices, **\`MongoTemplate\`** executes surgical, atomic updates directly on the database server:
- **\`$set\`**: Changes a single field in-place without loading the whole document into Java memory.
- **\`$push\` / \`$addToSet\`**: Appends a new item into a nested array atomically.
- **\`$inc\`**: Increments numeric counters atomically without locks.`,
        keyIdea: 'Use MongoTemplate in-place atomic operators ($set, $push) to modify documents directly on the server without race conditions.',
        codeExample: {
          title: 'MongoTemplateAtomicUpdate.java',
          code: `import java.time.LocalDateTime;
import com.mongodb.client.result.UpdateResult;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
public class PolicyCustomRepository {
    private final MongoTemplate mongoTemplate;

    public PolicyCustomRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public boolean updatePolicyStatus(String policyNumber, String newStatus, String auditNote) {
        // Query targets only matching, active policies:
        Query query = new Query(Criteria.where("policyNumber").is(policyNumber)
                                        .and("status").is("IN_PROGRESS"));

        // Atomic update operators applied directly on the database:
        Update update = new Update()
            .set("status", newStatus)
            .set("lastModifiedDate", LocalDateTime.now())
            .push("auditDismissals", auditNote); // Atomic push to array!

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
        subtitle: 'The automated assembly line test track',
        type: 'concept',
        content: `Think of an automobile manufacturing plant. When an engineer finishes assembling a new engine, they don't immediately load it into a customer's car and drive it on the highway. Instead, the assembly conveyor belt automatically rolls the engine onto a rigorous diagnostic test track.

In modern software delivery, this automated track is **Continuous Integration (CI)**:
1. A developer pushes code or opens a Pull Request on Git.
2. A Git **webhook** wakes up the CI server (**Jenkins** or **GitLab CI/CD**).
3. The pipeline spins up a clean, isolated runner environment (a Docker container or Kubernetes pod) with no leftover files from previous builds.
4. It checks out the exact Git commit, downloads dependencies from a private repository (Nexus/Artifactory), and prepares to test.`,
        keyIdea: 'Automated CI pipelines eliminate the classic "it works on my machine" problem by building code in pristine, standardized container runners.',
        diagramState: 'git-commit',
      },
      {
        id: 'step-2',
        title: 'Maven Build & Automated Test Execution',
        subtitle: 'Driving through the rain chamber and brake test track',
        type: 'solution',
        content: `Once the pipeline starts, it executes **\`mvn clean verify\`**:
- **Unit Tests (JUnit 5 & Mockito)**: Runs hundreds of lightning-fast unit tests to verify business logic, calculation formulas, and error handlers with zero external dependencies.
- **Integration Tests (Testcontainers)**: Spawns real, temporary Docker containers running genuine MongoDB and PostgreSQL instances so your code is tested against real database engines under authentic network conditions!

If even a single test fails, the assembly line halts immediately, the pull request is blocked from merging, and the engineering team is notified right away.`,
        keyIdea: 'Automated test suites catch regressions early, using Testcontainers to test against real databases before code reaches production.',
        diagramState: 'maven-build',
      },
      {
        id: 'step-3',
        title: 'SonarQube & Fortify Security Scans',
        subtitle: 'The building inspector with a magnifying glass and checklist',
        type: 'insight',
        content: `Think of a city building inspector walking through an unfinished house before approving the occupancy permit:
- They check that the electrical wiring meets safety standards so no fires can start.
- They measure door widths and smoke detector placements.

Before any Java application can be deployed, it must pass automated **Quality Gates**:
1. **SonarQube**:
   - Checks code coverage (e.g. demanding at least 80% of lines are tested).
   - Detects **Code Smells** (messy copy-pasted code, overly complex nested loops, and forgotten debug prints).
2. **Fortify (Static Application Security Testing / SAST)**:
   - Scans code for dangerous security vulnerabilities (like SQL/NoSQL injection, hardcoded secret passwords, or insecure deserialization).
   - Any critical security finding stops the release pipeline dead in its tracks until fixed!`,
        keyIdea: 'Static analysis tools like SonarQube and Fortify act as automated code quality and security inspectors, blocking unsafe code from reaching customers.',
        diagramState: 'sonar-scan',
      },
      {
        id: 'step-4',
        title: 'Canary & Rolling Production Releases',
        subtitle: 'Boarding the new train while the old train is still running',
        type: 'recap',
        content: `Once tests and security scans pass with flying colors:
1. Maven packages the application into an executable JAR.
2. A lightweight, hardened **Docker container image** is built using multi-stage builds.
3. The image is published to a secure container registry.
4. In production (on Kubernetes or cloud clusters), the release happens via a **Rolling Update**: new pods spin up, pass health readiness checks, and start accepting user traffic before the old pods are gently drained and retired.

The result? Zero downtime, zero dropped customer transactions, and painless deployments!`,
        keyIdea: 'Automated CI/CD pipelines and rolling updates let engineering teams ship features frequently with zero downtime.',
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
        subtitle: 'The hospital patient monitor, doctor\'s notes, and medical journey chart',
        type: 'concept',
        content: `Think of a patient in a modern hospital room:
1. **Metrics (The Heart Rate Monitor)**: A screen showing numbers over time (heart rate 72 bpm, oxygen 98%). It doesn't explain the patient's thoughts, but it immediately answers: *"Is the patient in danger right now?"*
2. **Traces (The Hospital Journey Chart)**: Records the patient's path through the hospital (Checked in at 9:00 AM -> Triage at 9:15 AM -> X-ray room at 9:30 AM -> Surgery at 10:00 AM). It answers: *"Where was the delay in the hospital?"*
3. **Logs (The Doctor's Written Journal)**: Detailed timestamped notes written by the physician: *"Patient reported sudden allergy after taking medication X."* It answers: *"What was the exact root cause?"*

In enterprise microservices, you cannot just log into a server and stare at a text file. You rely on the **Three Pillars of Observability**:
- **Metrics (Prometheus / CloudWatch)**: Numbers (CPU %, memory %, requests per second).
- **Traces (OpenTelemetry / Zipkin)**: Tracing a request as it hops across 10 microservices.
- **Logs (Splunk / ELK)**: Detailed error messages and stack traces.`,
        keyIdea: 'Metrics notify you that a problem exists; traces pinpoint which service slowed down; logs reveal the exact exception details.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'Splunk & ELK: Production Log Analysis',
        subtitle: 'The detective searching for a single glowing fluorescent tag',
        type: 'solution',
        content: `Imagine a detective searching through a giant warehouse holding 10 million cardboard boxes. If they open every box by hand, it would take 30 years to find the stolen watch. But what if the watch is tagged with a tiny glowing fluorescent barcode, and the detective turns on a UV blacklight? The barcode glows bright neon across the room, and the detective walks straight to it in 5 seconds!

In microservices, millions of log lines are printed every hour. To find the story of one user's failed transaction:
- The API Gateway stamps every incoming request with a unique **\`correlationId\`** (e.g. \`8f9b2a-pol-9921\`).
- Every downstream service writes this correlation ID into its structured JSON logs using SLF4J's **MDC (Mapped Diagnostic Context)**.
- In log search tools like **Splunk** or **ELK**, you simply query \`correlationId="8f9b2a-pol-9921"\`, and in 1 second you see the complete, unified timeline of that single user's request across all 8 microservices!`,
        keyIdea: 'MDC Correlation IDs connect logs across distributed services, turning millions of scattered messages into a single coherent story.',
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
        subtitle: 'The airline safety review that makes every future flight safer',
        type: 'recap',
        content: `When a commercial airplane experiences an unexpected sensor glitch, the airline doesn't blame the pilot and ignore the problem. A team of engineers conducts a **blameless Root Cause Analysis (RCA)** using the **5-Whys methodology** to find the true underlying cause and make sure it can never happen again.

In production engineering:
1. **Detect**: CloudWatch or Prometheus metrics trigger a high-priority alert.
2. **Mitigate**: Trip a circuit breaker, scale pods, or rollback to restore service for users quickly.
3. **Investigate**: Query Splunk logs using correlation IDs to find the trigger.
4. **Root Cause Analysis (RCA)**: Ask *Why* five times:
   - *Why did requests fail?* Database timed out.
   - *Why did the DB time out?* It was running a full table scan.
   - *Why was it running a table scan?* A newly added query was missing an index.
5. **Remediate**: Add the missing index, write an automated regression test, and update alert thresholds!`,
        keyIdea: 'A blameless Root Cause Analysis (RCA) transforms production incidents into permanent architectural improvements.',
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
        subtitle: 'Building a storage shed in the backyard instead of cluttering the living room',
        type: 'problem',
        productionSymptom: 'A container with -Xmx2g was killed by Kubernetes with OOMKilled (Exit Code 137) at the 4GB cgroup limit. JVM dashboards showed Heap usage was under 1.4GB! Why did Linux terminate the process when the JVM heap appeared completely healthy?',
        content: `Imagine living in a small house with a strict rule: your living room can hold at most 20 boxes (**The JVM Heap \`-Xmx2g\`**). You only have 14 boxes in your living room, so your indoor room looks neat and tidy!

However, outside in your backyard, you ordered 30 giant wooden pallets of heavy building stones (**Off-Heap Native Memory**). Suddenly, the city inspector arrives and condemns the property because your total land weight exceeded the structural safety limit (**Linux Container cgroup limit**)!

In containerized cloud environments:
- **Java Heap**: Managed by the Garbage Collector (\`-Xmx\`).
- **Total Process Memory (Resident Set Size / RSS)**: Includes the JVM Heap **PLUS** thread stacks (1MB per thread), JIT compiled code cache, Metaspace class metadata, and native off-heap memory buffers.

If native memory or direct byte buffers leak, Kubernetes will terminate your pod with **OOMKilled (Exit Code 137)** even if your Java heap graph looks 100% healthy!`,
        keyIdea: 'Kubernetes enforces memory limits on total Linux process memory (RSS), not just JVM Heap; off-heap leaks trigger sudden container terminations.',
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
          explanation: 'Native Memory Tracking (NMT) categorizes total process memory. Notice that committed native Arena memory exceeds 1.6GB outside the 1.45GB Java Heap.',
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
          explanation: 'Off-heap memory allocations bypass JVM heap tracking. As long as host memory is available, allocations succeed; once the container cgroup limit is breached, the Linux kernel terminates the process via SIGKILL.',
        },
        diagramState: 'offheap-vs-heap',
      },
      {
        id: 'step-2',
        title: 'Legacy ByteBuffer vs Java 22 FFM API',
        subtitle: 'An uninsulated high-voltage bare wire vs an insulated modern breaker switch',
        type: 'concept',
        content: `In older Java versions, high-performance systems (like Netty, Kafka, and Cassandra) allocated native memory outside the heap using \`ByteBuffer.allocateDirect()\` or dangerous internal tools like \`sun.misc.Unsafe\`.
- But this was like touching an uninsulated high-voltage wire: if you accessed a piece of memory that was already freed, the entire JVM process suffered a catastrophic **Segmentation Fault (crash)** with zero error handling!
- In addition, buffers were limited to 2GB because they used 32-bit integer indexes.

Java 22 introduced the **Foreign Function & Memory (FFM) API** (JEP 454) in \`java.lang.foreign\`:
- **\`MemorySegment\`**: A safe, contiguous block of native memory with spatial boundary checking and 64-bit addressing (supporting terabytes of memory!).
- **\`Arena\`**: A clean lifetime boundary. When an \`Arena\` is closed (using standard \`try-with-resources\`), all allocated native memory is freed immediately! No waiting for Garbage Collectors, no memory leaks, and zero segmentation faults.`,
        keyIdea: 'The Java 22 FFM API replaces dangerous Unsafe calls with safe, bounds-checked MemorySegments and deterministic, auto-closing Arenas.',
        codeExample: {
          title: 'ModernOffHeapFFM.java',
          code: `import java.lang.foreign.Arena;
import java.lang.foreign.MemorySegment;
import java.lang.foreign.ValueLayout;

public class NativeBufferPipeline {
    public static void main(String[] args) {
        // 1. Confined Arena guarantees deterministic native cleanup on close:
        try (Arena arena = Arena.ofConfined()) {
            long elementCount = 1_000_000L;
            
            // 2. Allocate 8MB of native off-heap memory outside the GC Heap:
            MemorySegment segment = arena.allocate(
                ValueLayout.JAVA_LONG, elementCount
            );
            
            // 3. Fast bounds-checked sequential write:
            for (long i = 0; i < elementCount; i++) {
                segment.setAtIndex(ValueLayout.JAVA_LONG, i, i * 42L);
            }
            
            System.out.println("Read native index 500: " + 
                segment.getAtIndex(ValueLayout.JAVA_LONG, 500));
        } // 4. Deterministic native memory free happens HERE immediately!
        // No waiting for GC, zero memory leaks, and complete memory safety.
    }
}`,
        },
        diagramState: 'ffm-arena-lifecycle',
      },
      {
        id: 'step-3',
        title: 'Native Memory Tracking (NMT) in Production',
        subtitle: 'Taking an X-ray of your building\'s hidden water pipes',
        type: 'solution',
        content: `Imagine suspecting a water leak in your house. The living room carpet is completely dry, but your monthly water meter shows 500 gallons consumed every day! You bring in a plumbing technician with an ultrasonic sensor and acoustic camera to pinpoint the exact hidden pipe leaking behind the bathroom drywall.

In the HotSpot JVM, **Native Memory Tracking (NMT)** is your diagnostic X-ray scanner for memory leaks outside the Java heap:
1. Enable NMT at startup: \`-XX:NativeMemoryTracking=summary\`
2. Capture a baseline before starting a heavy workload:
   \`jcmd <pid> VM.native_memory baseline\`
3. Run your application under traffic, then check the delta:
   \`jcmd <pid> VM.native_memory detail.diff\`

NMT outputs an exact breakdown (e.g. \`+350MB committed\`) showing whether memory was consumed by class metadata in Metaspace, OS thread stacks, JIT compiled machine code, or native off-heap allocations!`,
        keyIdea: 'Use jcmd VM.native_memory baseline and detail.diff to trace off-heap memory growth down to the exact native allocation site.',
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
          explanation: 'Shows Java Heap had zero change, while Arena/OffHeap native memory grew by +294MB, pinpointing the exact allocation source.',
        },
        diagramState: 'nmt-inspection',
      },
    ],
  },
];
