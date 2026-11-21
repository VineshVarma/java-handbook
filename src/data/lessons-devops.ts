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
];
