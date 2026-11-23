#!/usr/bin/env node
/**
 * scripts/audit-facts.mjs
 * Milestone 1 CI Guard: Tracks factual claims and technical accuracy
 * across all 27 lessons against R2 technical accuracy specifications.
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'src/data');
const isStrict = process.argv.includes('--strict') || process.argv.includes('--ci') || process.env.STRICT === 'true';
const isJson = process.argv.includes('--json');

/**
 * Technical Accuracy Tracking Matrix covering all 27 lessons and R2 error clusters
 */
const FACT_MATRIX = [
  // Module 01: Foundations
  {
    id: "FACT-01-01",
    lessonSlug: "how-java-runs",
    stepId: "step-4",
    category: "Bytecode & Verification",
    r2Cluster: "Claim Precision",
    claim: "Bytecode verification safety checkpoint",
    unverifiedPattern: /guaranteeing memory safety/i,
    verifiedPattern: /verifies type safety and stack constraints/i,
    remediation: "Qualify guarantee: verification enforces JVM structural and type constraints without absolute safety claims."
  },
  {
    id: "FACT-01-02",
    lessonSlug: "oop-pillars",
    stepId: "step-3",
    category: "JVM Dynamic Dispatch",
    r2Cluster: "vtable/itable dispatch",
    claim: "vtable resolution on every virtual call",
    unverifiedPattern: /JVM looks up the pointer in the actual runtime object's vtable/i,
    verifiedPattern: /monomorphic inline caches.*itable/i,
    remediation: "Mention monomorphic/bimorphic inline caching and distinguish vtable (class) vs itable (interface) dispatch."
  },
  {
    id: "FACT-01-03",
    lessonSlug: "memory-and-gc",
    stepId: "step-5",
    category: "Memory Management",
    r2Cluster: "Memory Leak Pedagogy",
    claim: "Garbage collection memory leak semantics",
    unverifiedPattern: /our code can never leak memory/i,
    verifiedPattern: /unintentional object retention/i,
    remediation: "Explain how unreleased strong references (static collections, unclosed resources) cause genuine JVM memory leaks."
  },
  {
    id: "FACT-01-04",
    lessonSlug: "java-data-types",
    stepId: "step-1",
    category: "Type System",
    r2Cluster: "char/Unicode representation",
    claim: "char primitive representation",
    unverifiedPattern: /16-bit Unicode letter/i,
    verifiedPattern: /16-bit UTF-16 code unit/i,
    remediation: "Replace \"16-bit Unicode letter\" with \"16-bit UTF-16 code unit\"; explain supplementary code points and surrogate pairs."
  },
  {
    id: "FACT-01-05",
    lessonSlug: "java-data-types",
    stepId: "step-1",
    category: "Type System",
    r2Cluster: "primitive sizes and representations",
    claim: "boolean memory representation",
    unverifiedPattern: /boolean \(`true` \/ `false`\)/i,
    verifiedPattern: /1 byte in arrays.*4 bytes on operand stack/i,
    remediation: "Document HotSpot representation: 1 byte in arrays, evaluated as 32-bit int on the JVM operand stack."
  },
  {
    id: "FACT-01-06",
    lessonSlug: "exception-handling",
    stepId: "step-2",
    category: "Language Desugaring",
    r2Cluster: "try-with-resources desugaring",
    claim: "try-with-resources compiler desugaring",
    unverifiedPattern: /The JVM automatically closes them/i,
    verifiedPattern: /Throwable\.addSuppressed/i,
    remediation: "Explain compiler desugaring to nested try-catch-finally and Throwable.addSuppressed for suppressed exceptions."
  },
  {
    id: "FACT-01-07",
    lessonSlug: "object-headers-lilliput",
    stepId: "step-1",
    category: "JVM Object Layout",
    r2Cluster: "biased locking removal",
    claim: "Mark Word biased locking bits",
    unverifiedPattern: /biased lock state/i,
    verifiedPattern: /biased locking deprecated in JDK 15 and removed in JDK 18/i,
    remediation: "Version-qualify Mark Word layout: biased locking was removed in JDK 18 (JEP 374); modern Mark Word uses 64 bits."
  },
  {
    id: "FACT-01-08",
    lessonSlug: "object-headers-lilliput",
    stepId: "step-4",
    category: "Memory Allocation",
    r2Cluster: "TLAB metrics & bump-pointer",
    claim: "TLAB bump-pointer allocation rate",
    unverifiedPattern: /zero lock contention/i,
    verifiedPattern: /lock-free thread-local buffer/i,
    remediation: "Explain TLAB gives lock-free allocation in thread-local Eden buffer; heap lock only on buffer refill."
  },
  {
    id: "FACT-01-09",
    lessonSlug: "escape-analysis",
    stepId: "step-2",
    category: "JIT Compiler",
    r2Cluster: "PrintEscapeAnalysis tool output",
    claim: "PrintEscapeAnalysis CLI output authenticity",
    unverifiedPattern: /Point: NoEscape \(eliminated\)/i,
    verifiedPattern: /EscapeState: NoEscape|illustrative/i,
    remediation: "Replace fabricated 3-line output with authentic HotSpot ConnectionGraph output or explicitly label as illustrative."
  },
  {
    id: "FACT-01-10",
    lessonSlug: "zgc-vs-g1",
    stepId: "step-2",
    category: "Garbage Collection",
    r2Cluster: "ZGenerational JDK versioning",
    claim: "Generational ZGC activation flags",
    unverifiedPattern: /java -XX:\+UseZGC -XX:\+ZGenerational/i,
    verifiedPattern: /JDK 21 experimental[\s\S]*JDK 23 default[\s\S]*JDK 24 non-generational removed/i,
    remediation: "Version-qualify ZGC: -XX:+ZGenerational was experimental in JDK 21, default in JDK 23 (JEP 474), non-generational removed in JDK 24."
  },
  {
    id: "FACT-01-11",
    lessonSlug: "oop-pillars",
    stepId: "step-1",
    category: "Encapsulation & Domain Invariants",
    r2Cluster: "Monetary Invariants",
    claim: "BankAccount currency representation using long cents",
    unverifiedPattern: /double balance\b/i,
    verifiedPattern: /long balanceInCents\b/i,
    remediation: "Replace floating-point double balance with long balanceInCents to prevent currency rounding errors."
  },

  // Module 02: Collections & Streams
  {
    id: "FACT-02-01",
    lessonSlug: "collections-framework",
    stepId: "step-1",
    category: "Collections Architecture",
    r2Cluster: "Queue FIFO vs Deque",
    claim: "Queue FIFO implementations",
    unverifiedPattern: /Queue FIFO only/i,
    verifiedPattern: /ArrayDeque.*circular buffer/i,
    remediation: "Clarify PriorityQueue is heap-ordered, not FIFO; feature ArrayDeque as zero-node-allocation alternative to LinkedList."
  },
  {
    id: "FACT-02-02",
    lessonSlug: "collections-framework",
    stepId: "step-2",
    category: "Collections Internals",
    r2Cluster: "HashMap Treeification Thresholds",
    claim: "HashMap treeification threshold",
    unverifiedPattern: /converts to a Red-Black Tree when a bucket exceeds 8 elements\./i,
    verifiedPattern: /TREEIFY_THRESHOLD = 8[\s\S]*MIN_TREEIFY_CAPACITY = 64/i,
    remediation: "Document that treeification requires BOTH 8 entries in a bucket AND a minimum table capacity of 64."
  },
  {
    id: "FACT-02-03",
    lessonSlug: "streams-api",
    stepId: "step-3",
    category: "Stream Execution Model",
    r2Cluster: "Stream Short-circuiting",
    claim: "Short-circuiting terminal operations",
    unverifiedPattern: /Streams only evaluate lazily without short-circuiting/i,
    verifiedPattern: /short-circuiting operations/i,
    remediation: "Explicitly explain short-circuiting intermediate (limit) vs terminal (findFirst, anyMatch) operations."
  },
  {
    id: "FACT-02-04",
    lessonSlug: "lambdas-functional",
    stepId: "step-2",
    category: "Bytecode & Invocation",
    r2Cluster: "invokedynamic and LambdaMetafactory",
    claim: "Lambda invocation mechanism",
    unverifiedPattern: /Lambdas are merely syntactic sugar for anonymous inner classes/i,
    verifiedPattern: /invokedynamic.*LambdaMetafactory/i,
    remediation: "Replace anonymous inner class explanation with invokedynamic bootstrap calling LambdaMetafactory.metafactory()."
  },
  {
    id: "FACT-02-05",
    lessonSlug: "generics",
    stepId: "step-3",
    category: "Type System",
    r2Cluster: "Bridge Methods and Heap Pollution",
    claim: "Type erasure runtime artifacts",
    unverifiedPattern: /Type erasure leaves zero runtime artifacts/i,
    verifiedPattern: /bridge methods.*heap pollution/i,
    remediation: "Explain synthetic bridge methods generated by javac to preserve polymorphism, and potential heap pollution."
  },
  {
    id: "FACT-02-06",
    lessonSlug: "collections-framework",
    stepId: "step-1",
    category: "Memory Layout & Overhead",
    r2Cluster: "LinkedList Node Footprint",
    claim: "LinkedList true node layout and 24B footprint under compressed OOPs",
    unverifiedPattern: /24 bytes (?:of )?pure overhead/i,
    verifiedPattern: /(?=[\s\S]*24 bytes)(?=[\s\S]*12-byte header \+ three 4-byte references)(?=[\s\S]*compressed OOPs)/i,
    remediation: "Break down LinkedList 24B node footprint: 12-byte header + three 4-byte references (item, next, prev) under compressed OOPs."
  },
  {
    id: "FACT-02-07",
    lessonSlug: "collections-framework",
    stepId: "step-4",
    category: "Concurrent Collections",
    r2Cluster: "ConcurrentHashMap Bin-Level Locking",
    claim: "ConcurrentHashMap bin-level locking, warehouse bin analogy, and load factor rules",
    unverifiedPattern: /16-room(?:s)? analogy|title:\s*['"]Lock Striping['"]/i,
    verifiedPattern: /(?=[\s\S]*bin-level (?:locking|synchronization))(?=[\s\S]*warehouse)(?=[\s\S]*load factor.*0\.75)/i,
    remediation: "Retitle to bin-level locking, use warehouse bin analogy, and explain load factor 0.75 rehashing rules."
  },

  // Module 03: Concurrency
  {
    id: "FACT-03-01",
    lessonSlug: "thread-lifecycle",
    stepId: "step-3",
    category: "Hardware Memory Architecture",
    r2Cluster: "volatile visibility and reordering",
    claim: "volatile hardware memory semantics",
    unverifiedPattern: /flushed straight to main memory/i,
    verifiedPattern: /happens-before.*memory barriers.*cache coherence/i,
    remediation: "Replace DRAM round-trip myth with MESI cache coherence, store buffer draining, and acquire/release memory barriers."
  },
  {
    id: "FACT-03-02",
    lessonSlug: "thread-lifecycle",
    stepId: "step-3",
    category: "Bytecode & Memory Models",
    r2Cluster: "count++ non-atomicity",
    claim: "count++ non-atomic bytecode decomposition (4 instructions)",
    unverifiedPattern: /read value, add 1, write value/i,
    verifiedPattern: /getfield[\s\S]*iconst_1[\s\S]*iadd[\s\S]*putfield/i,
    remediation: "Cite exact 4 bytecode operations (getfield, iconst_1, iadd, putfield) to demonstrate non-atomicity."
  },
  {
    id: "FACT-03-03",
    lessonSlug: "completable-future",
    stepId: "step-2",
    category: "Async Concurrency",
    r2Cluster: "ForkJoinPool.commonPool starvation",
    claim: "Default thread pool execution",
    unverifiedPattern: /blocking operations inside ForkJoinPool\.commonPool\(\) are recommended/i,
    verifiedPattern: /ForkJoinPool\.commonPool\(\)[\s\S]*dedicated.*ExecutorService/i,
    remediation: "Warn against blocking calls in ForkJoinPool.commonPool() and demonstrate dedicated ExecutorService isolation."
  },
  {
    id: "FACT-03-04",
    lessonSlug: "executor-service",
    stepId: "step-1",
    category: "Concurrency",
    r2Cluster: "ThreadPoolExecutor Queuing",
    claim: "Worker queue sizing and saturation",
    unverifiedPattern: /ThreadPoolExecutor spawns threads up to maximumPoolSize immediately/i,
    verifiedPattern: /unbounded queue starvation/i,
    remediation: "Detail corePoolSize -> workQueue saturation -> maximumPoolSize trigger order and rejection handler policies."
  },
  {
    id: "FACT-03-05",
    lessonSlug: "virtual-threads-loom",
    stepId: "step-3",
    category: "Virtual Threads",
    r2Cluster: "virtual thread pinning JDK 21 vs 24",
    claim: "Synchronized carrier thread pinning",
    unverifiedPattern: /Never execute blocking I\/O inside a synchronized block in virtual threads;/i,
    verifiedPattern: /JDK 21 pinned[\s\S]*JDK 24 JEP 491/i,
    remediation: "Version-qualify: JDK 21 pins carrier thread on synchronized monitor enter; JDK 24 JEP 491 removes pinning for synchronized."
  },
  {
    id: "FACT-03-06",
    lessonSlug: "false-sharing-jmm",
    stepId: "step-2",
    category: "CPU Hardware Architecture",
    r2Cluster: "@Contended / RestrictContended",
    claim: "@Contended annotation enablement",
    unverifiedPattern: /@Contended without JVM flags/i,
    verifiedPattern: /-XX:-RestrictContended/i,
    remediation: "Document mandatory JVM flag -XX:-RestrictContended required for application classpath classes using @Contended."
  },
  {
    id: "FACT-03-07",
    lessonSlug: "safepoints-ttsp",
    stepId: "step-1",
    category: "JVM Runtime Diagnostics",
    r2Cluster: "safepoint TTSP stall logs",
    claim: "Safepoint log output authenticity",
    unverifiedPattern: /\(TTSP STALL!\)/i,
    verifiedPattern: /\[info\]\[safepoint\] Safepoint ".*", Reaching safepoint: \d+ns, At safepoint: \d+ns/i,
    remediation: "Remove fabricated \"(TTSP STALL!)\" token from safepoint log output; use authentic Unified JVM Logging format."
  },

  // Module 04: Spring Boot
  {
    id: "FACT-04-01",
    lessonSlug: "spring-request-lifecycle",
    stepId: "step-2",
    category: "Spring Web",
    r2Cluster: "DispatcherServlet routing",
    claim: "DispatcherServlet request flow",
    unverifiedPattern: /DispatcherServlet delegates directly to Controller without HandlerAdapter/i,
    verifiedPattern: /HandlerMapping[\s\S]*HandlerAdapter[\s\S]*doDispatch/i,
    remediation: "Detail doDispatch execution loop: HandlerMapping lookup, HandlerAdapter invocation, and view/message conversion."
  },
  {
    id: "FACT-04-02",
    lessonSlug: "dependency-injection",
    stepId: "step-2",
    category: "Spring Core",
    r2Cluster: "Constructor vs Field Injection",
    claim: "Field injection pitfalls",
    unverifiedPattern: /Field injection is recommended over constructor injection/i,
    verifiedPattern: /immutability[\s\S]*circular dependency detection/i,
    remediation: "Explain how constructor injection enables final immutable fields, explicit test mocks, and early circular dependency failure."
  },
  {
    id: "FACT-04-03",
    lessonSlug: "microservices-patterns",
    stepId: "step-2",
    category: "Resilience Patterns",
    r2Cluster: "Circuit Breaker State Machine",
    claim: "Resilience4j circuit transitions",
    unverifiedPattern: /Circuit breakers only exist in open and closed states/i,
    verifiedPattern: /CLOSED[\s\S]*OPEN[\s\S]*HALF_OPEN/i,
    remediation: "Document exact sliding window metrics (count-based vs time-based) and state transitions."
  },

  // Module 05: REST & Security
  {
    id: "FACT-05-01",
    lessonSlug: "rest-api-design",
    stepId: "step-2",
    category: "REST Architecture",
    r2Cluster: "HTTP Idempotency",
    claim: "HTTP method safety and idempotency",
    unverifiedPattern: /All HTTP methods are safe and idempotent/i,
    verifiedPattern: /GET \(safe, idempotent\)[\s\S]*PUT \(idempotent\)[\s\S]*POST \(neither\)/i,
    remediation: "Rigorous matrix of HTTP method safety (no side effects) and idempotency (multiple identical requests yield same state)."
  },
  {
    id: "FACT-05-02",
    lessonSlug: "jwt-oauth2",
    stepId: "step-3",
    category: "Production Security",
    r2Cluster: "javax.servlet vs jakarta.servlet",
    claim: "Servlet package imports in filter",
    unverifiedPattern: /import javax\.servlet/i,
    verifiedPattern: /import jakarta\.servlet/i,
    remediation: "Migrate all filter code from javax.servlet.* to jakarta.servlet.* for Spring Boot 3+ / Jakarta EE 10 compatibility."
  },

  // Module 06: Database & Persistence
  {
    id: "FACT-06-01",
    lessonSlug: "mongodb-document-model",
    stepId: "step-2",
    category: "Persistence Architecture",
    r2Cluster: "Document Embedding vs Referencing",
    claim: "MongoDB 16MB document limit and unbounded arrays",
    unverifiedPattern: /MongoDB documents can embed unbounded arrays without limits/i,
    verifiedPattern: /16MB BSON document limit.*unbounded array anti-pattern/i,
    remediation: "Explicitly warn against unbounded array growth violating the 16MB BSON document ceiling."
  },

  // Module 07: DevOps & Observability
  {
    id: "FACT-07-01",
    lessonSlug: "cicd-pipeline",
    stepId: "step-4",
    category: "Deployment Strategies",
    r2Cluster: "Release Deployment Models",
    claim: "Canary vs Rolling release mechanics",
    unverifiedPattern: /Canary deployments replace all instances simultaneously/i,
    verifiedPattern: /traffic splitting.*rollback trigger/i,
    remediation: "Contrast rolling deployment (in-place replica replacement) with canary (weighted ingress routing and automated metric abort)."
  },
  {
    id: "FACT-07-02",
    lessonSlug: "observability-stack",
    stepId: "step-2",
    category: "Observability & SRE",
    r2Cluster: "Structured Logging",
    claim: "MDC correlation ID propagation",
    unverifiedPattern: /Log aggregation without trace correlation IDs/i,
    verifiedPattern: /MDC.*traceId.*spanId/i,
    remediation: "Demonstrate SLF4J MDC (Mapped Diagnostic Context) injection for distributed trace propagation across services."
  },
  {
    id: "FACT-07-03",
    lessonSlug: "offheap-ffm-api",
    stepId: "step-3",
    category: "JVM Off-Heap Diagnostics",
    r2Cluster: "NMT committed vs reserved",
    claim: "NMT committed memory bounds",
    unverifiedPattern: /reserved=873MB, committed=1696MB|reserved=920MB \(\+297MB\), committed=1990MB/i,
    verifiedPattern: /committed\s*<=\s*reserved/i,
    remediation: "Fix fabricated NMT output: committed memory must NEVER exceed reserved memory (e.g. reserved=2048MB, committed=1696MB)."
  }
];

function getModuleCategory(slug) {
  if (['how-java-runs', 'oop-pillars', 'memory-and-gc', 'java-data-types', 'exception-handling', 'object-headers-lilliput', 'escape-analysis', 'zgc-vs-g1'].includes(slug)) return 'foundations';
  if (['collections-framework', 'streams-api', 'lambdas-functional', 'generics'].includes(slug)) return 'collections';
  if (['thread-lifecycle', 'completable-future', 'executor-service', 'virtual-threads-loom', 'false-sharing-jmm', 'safepoints-ttsp'].includes(slug)) return 'concurrency';
  if (['spring-request-lifecycle', 'dependency-injection', 'microservices-patterns'].includes(slug)) return 'spring';
  if (['rest-api-design', 'jwt-oauth2'].includes(slug)) return 'security';
  return 'devops';
}

function runAudit() {
  const results = [];
  let verifiedCount = 0;
  let pendingCount = 0;
  let flaggedCount = 0;

  for (const entry of FACT_MATRIX) {
    const filePath = path.join(DATA_DIR, `lessons-${getModuleCategory(entry.lessonSlug)}.ts`);
    let status = 'PENDING';
    let evidence = 'File not found';

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasUnverified = entry.unverifiedPattern.test(content);
      const hasVerified = entry.verifiedPattern ? entry.verifiedPattern.test(content) : false;

      if (hasUnverified) {
        status = 'FLAGGED_ERROR';
        evidence = `Found unverified/flawed pattern matching ${entry.unverifiedPattern}`;
        flaggedCount++;
      } else if (hasVerified) {
        status = 'VERIFIED';
        evidence = `Verified accurate pattern matching ${entry.verifiedPattern}`;
        verifiedCount++;
      } else {
        status = 'PENDING_REVISION';
        evidence = 'Neither original flawed pattern nor target verified pattern detected';
        pendingCount++;
      }
    }

    results.push({ ...entry, status, evidence });
  }

  const verifiedPercent = parseFloat(((verifiedCount / FACT_MATRIX.length) * 100).toFixed(1));

  return {
    total: FACT_MATRIX.length,
    verifiedCount,
    pendingCount,
    flaggedCount,
    verifiedPercent,
    results
  };
}

try {
  const report = runAudit();

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('\n======================================================');
    console.log('            FACT AUDIT & ACCURACY TRACKER             ');
    console.log('======================================================');
    console.log(`Total Claims Tracked: ${report.total}`);
    console.log(`Verified Claims:      ${report.verifiedCount} (${report.verifiedPercent}%)`);
    console.log(`Pending Claims:       ${report.pendingCount}`);
    console.log(`Flagged Errors:       ${report.flaggedCount}\n`);

    console.log('--- Flagged Factual Errors (Require Remediation in M3/M4/M5) ---');
    report.results.filter(r => r.status === 'FLAGGED_ERROR').forEach(r => {
      console.log(`[${r.id}] ${r.lessonSlug} (${r.r2Cluster})`);
      console.log(`  Claim:       ${r.claim}`);
      console.log(`  Remediation: ${r.remediation}\n`);
    });
  }

  if (isStrict && (report.flaggedCount > 0 || report.pendingCount > 0)) {
    if (!isJson) console.error(`\n[FAIL] Fact audit failed: ${report.flaggedCount} flagged errors, ${report.pendingCount} pending claims under --strict mode.`);
    process.exit(1);
  } else {
    if (!isJson) console.log('[PASS] Fact audit executed successfully.\n');
    process.exit(0);
  }
} catch (err) {
  if (!isJson) console.error('[FATAL] Failed to execute fact audit:', err);
  process.exit(1);
}
