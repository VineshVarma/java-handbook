import { Lesson } from '@/lib/types';

export const concurrencyLessons: Lesson[] = [
  {
    id: 'thread-lifecycle',
    slug: 'thread-lifecycle',
    title: 'Thread Lifecycle & Synchronization',
    subtitle: 'Understand thread states, monitor locks, volatile memory visibility, and deadlocks.',
    moduleId: '03',
    moduleTitle: '03. Concurrency & Async',
    duration: '12 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The 6 Thread.State enum states in the JVM',
      'The synchronized keyword, monitor locks, and wait()/notify()',
      'The Java Memory Model (JMM) and volatile visibility guarantee',
      'Atomic variables and hardware Compare-And-Swap (CAS)',
      'How deadlocks happen and how to prevent them',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The 6 States of a Java Thread',
        subtitle: 'From birth to death in Thread.State',
        type: 'concept',
        content: `A Java thread is a lightweight execution unit mapped directly to an operating system thread. In Java, every thread is governed by the **\`Thread.State\`** enum:

1. **NEW**: Created via \`new Thread()\` but \`start()\` has not been called yet.
2. **RUNNABLE**: Executing in the JVM or waiting for OS CPU scheduling.
3. **BLOCKED**: Waiting to acquire a monitor lock (e.g. entering a \`synchronized\` block occupied by another thread).
4. **WAITING**: Waiting indefinitely for another thread to perform an action (e.g. \`wait()\`, \`join()\`, \`LockSupport.park()\`).
5. **TIMED_WAITING**: Waiting for a specified time period (e.g. \`sleep(millis)\`, \`wait(timeout)\`).
6. **TERMINATED**: Finished executing its \`run()\` method or terminated by an unhandled exception.`,
        keyIdea: 'The JVM manages thread transitions between active runnable states and passive waiting/blocked states.',
        diagramState: 'new-thread',
      },
      {
        id: 'step-2',
        title: 'BLOCKED vs WAITING States',
        subtitle: 'A subtle distinction that every senior developer must know',
        type: 'insight',
        content: `Many developers confuse **BLOCKED** and **WAITING**:

- **BLOCKED**: Occurs exclusively when a thread is trying to enter or re-enter a **\`synchronized\` block or method**, but another thread currently holds that object's intrinsic monitor lock.
- **WAITING**: The thread willingly suspended itself by calling \`Object.wait()\`, \`Thread.join()\`, or parked via Java Concurrency locks (\`ReentrantLock\`). It has yielded the CPU and cannot resume until another thread calls \`notify()\` or \`notifyAll()\`.`,
        keyIdea: 'BLOCKED threads wait to acquire an intrinsic monitor lock; WAITING threads have paused themselves waiting for an explicit signal.',
        diagramState: 'blocked-state',
      },
      {
        id: 'step-3',
        title: 'volatile & The Java Memory Model (JMM)',
        subtitle: 'Preventing stale CPU cache reads and instruction reordering',
        type: 'solution',
        content: `Modern multi-core CPUs maintain independent L1/L2 caches for each core. When multiple threads access shared variables, a thread on Core 1 might read a stale value from its local cache while Core 2 has updated it in main memory.

The **\`volatile\`** keyword enforces two critical guarantees:
1. **Visibility**: Reads and writes go directly to/from main memory, guaranteeing that an update by one thread is immediately visible to all other threads.
2. **Happens-Before Relationship (Instruction Ordering)**: The compiler and CPU are forbidden from reordering reads and writes across a volatile boundary.

Note: \`volatile\` does NOT make compound operations like \`count++\` atomic (read-modify-write). For atomicity, use **\`AtomicInteger\`** or **\`AtomicReference\`** which leverage CPU **CAS (Compare-And-Swap)** instructions.`,
        keyIdea: 'volatile guarantees memory visibility and prevents instruction reordering, but does not guarantee atomicity for compound operations.',
        codeExample: {
          title: 'VolatileFlagPattern.java',
          code: `public class WorkerService implements Runnable {
    // volatile ensures all worker threads see updates immediately!
    private volatile boolean running = true;

    public void stopRunning() {
        this.running = false;
    }

    @Override
    public void run() {
        while (running) {
            // Process tasks from queue
        }
        System.out.println("Worker thread cleanly shutdown.");
    }
}`,
        },
        interviewTip: 'Is count++ thread-safe if count is volatile? No! count++ consists of 3 distinct bytecode operations: getfield (read), iadd (increment), and putfield (write). Race conditions can occur between read and write.',
        diagramState: 'running-state',
      },
      {
        id: 'step-4',
        title: 'Deadlocks & Prevention',
        subtitle: 'When threads wait forever for each other',
        type: 'trade-off',
        content: `A **Deadlock** is a deadlock state where Thread 1 holds Lock A and requests Lock B, while Thread 2 holds Lock B and requests Lock A. Both threads remain BLOCKED forever.

The 4 Coffman conditions required for a deadlock:
1. **Mutual Exclusion**: Exclusive lock access.
2. **Hold and Wait**: Holding a lock while waiting for another.
3. **No Preemption**: Locks cannot be forcibly confiscated.
4. **Circular Wait**: Thread 1 -> Lock B -> Thread 2 -> Lock A.

**Deadlock Prevention Rules**:
- Always acquire locks in a consistent, globally defined order.
- Use **\`tryLock(timeout, timeUnit)\`** from \`java.util.concurrent.locks.ReentrantLock\` instead of raw \`synchronized\`.
- Keep synchronized blocks as short as possible.`,
        keyIdea: 'Enforce strict lock acquisition ordering or use tryLock with timeouts to prevent deadlocks in production.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'completable-future',
    slug: 'completable-future',
    title: 'CompletableFuture & Async Orchestration',
    subtitle: 'Master asynchronous non-blocking programming, parallel API aggregation, and graceful fallbacks.',
    moduleId: '03',
    moduleTitle: '03. Concurrency & Async',
    duration: '15 min',
    difficulty: 'Advanced',
    youllLearn: [
      'Creating async tasks with supplyAsync and custom thread pools',
      'Chaining transformations: thenApply vs thenCompose vs thenCombine',
      'Parallel API aggregation using CompletableFuture.allOf()',
      'Resilient failure handling with exceptionally() and handle()',
      'Timeout management in Java 9+ (orTimeout, completeOnTimeout)',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Why CompletableFuture?',
        subtitle: 'Eliminating blocking Future.get() bottlenecks',
        type: 'problem',
        content: `In classic Java 5, the \`Future<V>\` interface allowed asynchronous task submission, but retrieving the result required calling **\`future.get()\`**, which blocks the calling thread until the computation finishes!

In microservices architectures, waiting synchronously for 3 downstream APIs (e.g. Policy Core, Payment Gateway, and Customer Profile) causes latency to equal the sum of all response times:
\`Total Latency = 100ms + 150ms + 80ms = 330ms\`.

**\`CompletableFuture\`** (introduced in Java 8 and enhanced in Java 9/21) brings reactive, event-driven promise chaining to Java: you declare a callback pipeline that runs asynchronously as soon as data arrives, without blocking worker threads!`,
        keyIdea: 'CompletableFuture enables declarative, non-blocking asynchronous task pipelines that execute concurrently.',
        diagramState: 'supply-async',
      },
      {
        id: 'step-2',
        title: 'supplyAsync & Thread Pool Isolation',
        subtitle: 'Never use the default ForkJoinPool.commonPool() for blocking I/O!',
        type: 'insight',
        content: `By default, calling \`CompletableFuture.supplyAsync(() -> ...)\` submits tasks to **\`ForkJoinPool.commonPool()\`**.

**CRITICAL PRODUCTION WARNING**: \`commonPool()\` is sized based on CPU cores (\`Runtime.getRuntime().availableProcessors() - 1\`). It is designed purely for CPU-bound computations.

If you submit blocking HTTP or database calls to \`commonPool()\`, all worker threads will quickly become blocked waiting on network sockets, starving the entire JVM of threads!

**Best Practice**: Always pass a dedicated, properly sized **\`ExecutorService\`** for downstream API integrations.`,
        keyIdea: 'Always supply a dedicated ThreadPoolExecutor to supplyAsync to prevent thread starvation in ForkJoinPool.',
        codeExample: {
          title: 'DedicatedThreadPoolAsync.java',
          code: `@Service
public class DownstreamOrchestrator {
    // Dedicated custom pool for external REST calls
    private final ExecutorService apiExecutor = Executors.newFixedThreadPool(
        50,
        new ThreadFactoryBuilder().setNameFormat("api-caller-%d").build()
    );

    public CompletableFuture<PolicyDetails> fetchPolicyAsync(String policyId) {
        return CompletableFuture.supplyAsync(
            () -> restTemplate.getForObject("/policies/" + policyId, PolicyDetails.class),
            apiExecutor // Explicitly pass custom executor!
        );
    }
}`,
        },
        diagramState: 'parallel-exec',
      },
      {
        id: 'step-3',
        title: 'Chaining: thenApply vs thenCompose vs thenCombine',
        subtitle: 'The 3 core functional combinators',
        type: 'concept',
        content: `Understanding how to chain futures:

1. **\`thenApply(Function<T, R>)\`**: Like stream \`map()\`. Takes the result of the future, transforms it synchronously on the same thread, and wraps it in a new future.
2. **\`thenCompose(Function<T, CompletableFuture<R>>)\`**: Like stream \`flatMap()\`. Used when the next operation itself returns another CompletableFuture (dependent asynchronous call), preventing nested \`CompletableFuture<CompletableFuture<R>>\`.
3. **\`thenCombine(otherFuture, BiFunction<T, U, V>)\`**: Runs two completely independent futures in parallel and combines their results when both complete!`,
        keyIdea: 'Use thenCompose for dependent async sequences; use thenCombine to merge two parallel independent futures.',
        codeExample: {
          title: 'AsyncChainingExamples.java',
          code: `// 1. thenApply: Synchronous transformation
CompletableFuture<String> policyNameFuture = fetchPolicyAsync("POL-101")
    .thenApply(policy -> policy.getName().toUpperCase());

// 2. thenCompose: Sequential Dependent Async
CompletableFuture<PaymentStatus> statusFuture = fetchPolicyAsync("POL-101")
    .thenCompose(policy -> checkPaymentStatusAsync(policy.getAccountId()));

// 3. thenCombine: Parallel Independent Aggregation
CompletableFuture<PolicyDetails> policyF = fetchPolicyAsync("POL-101");
CompletableFuture<PaymentHistory> paymentF = fetchPaymentHistoryAsync("POL-101");

CompletableFuture<AggregatedPolicyView> combinedFuture = policyF.thenCombine(
    paymentF,
    (policy, payment) -> new AggregatedPolicyView(policy, payment)
);`,
        },
        diagramState: 'then-combine',
      },
      {
        id: 'step-4',
        title: 'allOf & Graceful Fallbacks',
        subtitle: 'Parallel multi-call orchestration with timeout protection',
        type: 'solution',
        content: `When orchestrating 5+ downstream services simultaneously (e.g. Policy, Billing, IDOMOO Video, Claims, Audit), use **\`CompletableFuture.allOf()\`**.

To prevent one sluggish downstream dependency from hanging the entire request:
- Attach **\`orTimeout(1500, TimeUnit.MILLISECONDS)\`** (Java 9+)
- Handle partial failures using **\`exceptionally()\`** or **\`handle()\`** to inject graceful cached or default fallback data!`,
        keyIdea: 'Use allOf() for fan-out/fan-in parallel patterns and exceptionally() to return fallback data on downstream failures.',
        codeExample: {
          title: 'ResilientOrchestration.java',
          code: `public CompletableFuture<FullDashboardDTO> getCustomerDashboard(String customerId) {
    CompletableFuture<PolicyDTO> policyF = policyService.getPolicies(customerId)
        .orTimeout(800, TimeUnit.MILLISECONDS)
        .exceptionally(ex -> PolicyDTO.empty());

    CompletableFuture<BillingDTO> billingF = billingService.getBilling(customerId)
        .orTimeout(600, TimeUnit.MILLISECONDS)
        .exceptionally(ex -> BillingDTO.cachedFallback(customerId));

    return CompletableFuture.allOf(policyF, billingF)
        .thenApply(v -> new FullDashboardDTO(policyF.join(), billingF.join()));
}`,
        },
        interviewTip: 'What is the difference between join() and get() in CompletableFuture? get() throws checked exceptions (InterruptedException, ExecutionException) requiring try-catch. join() throws unchecked CompletionException, making it ideal for clean lambda expressions.',
        diagramState: 'fallback-catch',
      },
      {
        id: 'step-5',
        title: 'Recap: Non-Blocking High-Throughput Microservices',
        subtitle: 'CompletableFuture architecture summary',
        type: 'recap',
        content: `By replacing blocking REST calls with CompletableFuture pipelines:
- Downstream latency drops from serial cumulative time to \`Max(Latency)\` of the slowest dependency.
- Backend threads are never held captive during network socket waits.
- Application handles 4x-10x higher request throughput with zero additional hardware!`,
        keyIdea: 'CompletableFuture is the cornerstone of responsive, resilient enterprise microservices integration.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'executor-service',
    slug: 'executor-service',
    title: 'ExecutorService & Virtual Threads (Java 21)',
    subtitle: 'From ThreadPoolExecutor queues to millions of lightweight Virtual Threads with Project Loom.',
    moduleId: '03',
    moduleTitle: '03. Concurrency & Async',
    duration: '12 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The architecture of ThreadPoolExecutor: corePoolSize, maxPoolSize, and WorkQueue',
      'ThreadPool types: Fixed, Cached, Scheduled, and WorkStealing pools',
      'Graceful shutdown patterns with shutdown() vs shutdownNow()',
      'Project Loom Virtual Threads in Java 21: lightweight fiber concurrency',
      'When to use Virtual Threads vs reactive programming',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'ThreadPoolExecutor Anatomy',
        subtitle: 'Why manual new Thread() is banned in production',
        type: 'concept',
        content: `Creating a platform thread costs approximately **1MB of off-heap stack memory** and incurs operating system context switching overhead. Creating thousands of unmanaged threads will quickly crash the JVM with \`OutOfMemoryError: unable to create new native thread\`.

The **\`ExecutorService\`** decouples task submission from thread management using worker pools.

A **\`ThreadPoolExecutor\`** is tuned using 3 core parameters:
1. **\`corePoolSize\`**: The number of threads to keep alive even when idle.
2. **\`maximumPoolSize\`**: The maximum number of threads allowed to run concurrently.
3. **\`workQueue\`**: The blocking queue (e.g. \`ArrayBlockingQueue\`, \`LinkedBlockingQueue\`) holding tasks when all core threads are busy.`,
        keyIdea: 'A ThreadPoolExecutor reuses a bounded set of operating system threads to process a continuous queue of submitted tasks.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'Task Submission & Rejection Policy',
        subtitle: 'How tasks flow through a ThreadPoolExecutor',
        type: 'insight',
        content: `The order of execution in a ThreadPoolExecutor often surprises developers:
1. If fewer than \`corePoolSize\` threads are running, a **new thread is created** for the incoming task.
2. If \`corePoolSize\` threads are busy, the task is **added to the workQueue**.
3. Only if the **workQueue is full**, and current threads < \`maximumPoolSize\`, are extra temporary worker threads created.
4. If the queue is full and threads == \`maximumPoolSize\`, the **\`RejectedExecutionHandler\`** is invoked!

Common rejection policies:
- \`AbortPolicy\` (default): Throws \`RejectedExecutionException\`.
- \`CallerRunsPolicy\`: Runs the task in the caller's thread, providing natural backpressure!
- \`DiscardOldestPolicy\`: Drops the oldest task in the queue to make room.`,
        keyIdea: 'New worker threads beyond corePoolSize are created ONLY when the workQueue fills up, not before.',
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'Virtual Threads in Java 21 (Project Loom)',
        subtitle: 'From thousands of platform threads to millions of virtual threads',
        type: 'solution',
        content: `In Java 21, **Virtual Threads** revolutionized Java concurrency.

- **Platform Thread (Classic)**: 1:1 mapping with OS kernel thread. Expensive (~1MB memory, slow context switch). Limits servers to ~2,000 concurrent threads.
- **Virtual Thread (Java 21)**: M:N lightweight thread managed entirely by the JVM runtime on the Heap! Costs only **~1KB of memory** (1,000x smaller).

When a Virtual Thread hits blocking I/O (like an HTTP call, database query, or \`Thread.sleep()\`), the JVM automatically **unmounts** the virtual thread from its underlying OS "carrier" thread! The carrier thread is immediately free to run other virtual threads. Once I/O completes, the virtual thread is seamlessly remounted and continues execution!`,
        keyIdea: 'Virtual threads allow you to write simple, synchronous, blocking code while enjoying the high scalability of non-blocking reactive architectures.',
        codeExample: {
          title: 'Java21VirtualThreads.java',
          code: `// Launch 100,000 concurrent tasks effortlessly in Java 21:
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 100_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1)); // Unmounts carrier thread!
            return "Task " + i + " completed";
        });
    });
} // Auto-closes and waits for all virtual threads to finish!`,
        },
        interviewTip: 'Should you pool Virtual Threads in Java 21? NO! Never pool virtual threads. They are ephemeral and cheap to create. Allocate a new virtual thread per task using Executors.newVirtualThreadPerTaskExecutor().',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'virtual-threads-loom',
    slug: 'virtual-threads-loom',
    title: 'Virtual Threads: Project Loom Internals',
    subtitle: 'Carrier Threads, Continuation chunks on the Heap, and Thread Pinning prevention.',
    moduleId: '03',
    moduleTitle: '03. Concurrency & Async',
    duration: '15 min',
    difficulty: 'Advanced',
    youllLearn: [
      'The 1:1 OS Thread Wall: why 5,000 platform threads crash a server',
      'M:N lightweight threads mounted onto ForkJoinPool Carrier Threads',
      'How Continuations unmount stack frames onto the Heap during blocking I/O',
      'Thread Pinning: why synchronized and JNI native calls freeze carrier threads',
      'Modern migration: Replacing synchronized with ReentrantLock for virtual threads',
      'Using jcmd to capture virtual thread dumps',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The 1:1 OS Thread Wall',
        subtitle: 'Why thread-per-request architecture collapsed under high concurrency',
        type: 'problem',
        productionSymptom: 'A Spring Boot service handling 8,000 simultaneous client connections crashed with java.lang.OutOfMemoryError: unable to create native thread. The operating system kernel refused to allocate further 1MB native thread stacks.',
        content: `In classic Java:
- Every \`Thread\` is an OS Platform Thread (1:1 kernel thread mapping).
- Each platform thread consumes **~1MB of committed stack memory** in OS virtual address space.
- Context switching between kernel threads requires saving hardware CPU registers, switching privilege rings into kernel space, and invalidating CPU translation lookaside buffers (TLB).

As a result, a high-throughput microservice cannot scale past a few thousand threads without crashing the operating system. Reactive programming (WebFlux, RxJava) was invented to work around this, but introduced callback hell and complex stack traces.`,
        keyIdea: '1:1 platform threads are too expensive (~1MB stack + OS context switch) for massive scale, hitting kernel thread creation limits.',
        cliInspection: {
          command: 'jcmd <pid> Thread.dump_to_file -format=json threads.json',
          output: `{"threadDump": {"threadCount": 240, "virtualThreadCount": 100000, "carrierThreadCount": 16}}`,
          explanation: 'Inspects active threads. Note how 100,000 virtual threads run on just 16 carrier threads!',
        },
        diagramState: 'thread-wall',
      },
      {
        id: 'step-2',
        title: 'Project Loom: M:N Continuations on Heap',
        subtitle: 'How millions of virtual threads mount onto a handful of carrier threads',
        type: 'solution',
        content: `**Virtual Threads (Project Loom)** decouple the Java thread from the OS kernel thread:

- **Carrier Threads**: A tiny pool of OS platform threads (by default, one per available CPU core via \`ForkJoinPool.commonPool()\`).
- **Mounting & Execution**: When a virtual thread is runnable, the JVM mounts it onto a Carrier Thread.
- **Blocking I/O Unmounting**: The instant the virtual thread calls a blocking method (\`Socket.read()\`, \`Thread.sleep()\`, or JDBC query), HotSpot pauses execution and copies its active call stack frames onto the **Java Heap as a Continuation chunk**!
- The Carrier Thread is immediately released to execute another virtual thread! When the socket is ready, the continuation is remounted onto ANY available carrier thread.`,
        keyIdea: 'Virtual threads suspend by copying small call stack continuations onto the Heap, freeing OS carrier threads immediately.',
        codeExample: {
          title: 'VirtualThreadPerTaskPattern.java',
          code: `// Write clean, synchronous blocking code with massive throughput:
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 100_000; i++) {
        final int taskId = i;
        executor.submit(() -> {
            // Blocking network call: Stack unmounts to Heap automatically!
            String response = httpClient.send(request, BodyHandlers.ofString()).body();
            return "Task " + taskId + ": " + response;
        });
    }
}`,
        },
        diagramState: 'carrier-mount',
      },
      {
        id: 'step-3',
        title: 'The Thread Pinning Danger',
        subtitle: 'Why synchronized blocks freeze carrier threads and starve your pool',
        type: 'trade-off',
        content: `There is one critical architectural caveat with Virtual Threads: **Thread Pinning**.

A Virtual Thread becomes **PINNED** to its carrier OS thread if it performs blocking I/O while:
1. Inside a **\`synchronized\` block or method**
2. Inside a native C/C++ **JNI call**

When pinned, HotSpot CANNOT unmount the continuation from the carrier thread! The underlying OS thread remains frozen, waiting for the blocking network socket. If 16 virtual threads are pinned, all 16 carrier threads freeze, completely starving the entire server!

**The Production Fix**: Replace \`synchronized\` with **\`java.util.concurrent.locks.ReentrantLock\`**, which supports virtual thread unmounting seamlessly.`,
        keyIdea: 'Never hold a synchronized block across blocking network I/O in virtual threads; use ReentrantLock to avoid pinning carrier threads.',
        codeExample: {
          title: 'RefactorSynchronizedToReentrantLock.java',
          code: `// DANGEROUS: Pins carrier thread on blocking I/O!
public synchronized String fetchPolicy(String id) {
    return restClient.get().uri("/policies/" + id).retrieve().body(String.class);
}

// PRODUCTION SAFE: ReentrantLock allows carrier thread to unmount!
private final ReentrantLock lock = new ReentrantLock();

public String fetchPolicySafe(String id) {
    lock.lock();
    try {
        return restClient.get().uri("/policies/" + id).retrieve().body(String.class);
    } finally {
        lock.unlock();
    }
}`,
        },
        microCheck: {
          question: 'Why does holding a synchronized monitor across blocking network I/O cause severe problems with Virtual Threads?',
          options: [
            'It corrupts the virtual thread call stack',
            'It pins the virtual thread to its OS carrier thread, preventing unmounting and starving the entire carrier thread pool',
            'It forces the JVM to switch into C1 compilation tier',
          ],
          answerIndex: 1,
          explanation: 'Current HotSpot implementation cannot detach call stacks when an object monitor is held on the stack, locking the carrier OS thread in kernel space.',
        },
        diagramState: 'thread-pinning',
      },
    ],
  },
  {
    id: 'false-sharing-jmm',
    slug: 'false-sharing-jmm',
    title: 'JMM, CPU Caches & False Sharing',
    subtitle: 'L1/L2/L3 cache coherence (MESI), 64-byte cache line contention, and @Contended padding.',
    moduleId: '03',
    moduleTitle: '03. Concurrency & Async',
    duration: '14 min',
    difficulty: 'Advanced',
    youllLearn: [
      'How CPU hardware caches (L1, L2, L3) fetch 64-byte cache lines',
      'The MESI cache coherence protocol (Modified, Exclusive, Shared, Invalid)',
      'What False Sharing is and why unrelated variables destroy multicore throughput',
      'How volatile enforces happens-before memory barriers (LoadLoad, StoreStore, etc.)',
      'Solving false sharing with padding and @jdk.internal.vm.annotation.Contended',
      'Benchmarking cache performance using JMH perfnorm',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Ghost CPU Bottleneck',
        subtitle: 'Why two threads modifying separate variables stall each other',
        type: 'problem',
        productionSymptom: 'A multi-threaded metrics counter showed severe throughput degradation when scaling from 2 to 16 CPU cores. Threads were modifying completely different fields (threadA modified countA, threadB modified countB), yet CPU cache miss rates spiked to 90%!',
        content: `CPUs do not read or write single bytes to system RAM. Instead, modern x86 and ARM processors fetch memory in **64-Byte Cache Lines**.

When CPU Core 1 reads variable \`countA\`, it pulls the surrounding 64 bytes into its private **L1/L2 cache**.
If \`countB\` happens to be laid out in memory right next to \`countA\`, both variables share the **exact same 64-byte cache line**!

Under the **MESI (Modified, Exclusive, Shared, Invalid)** hardware cache coherence protocol:
- When Core 1 updates \`countA\`, it marks the entire 64-byte cache line as **Modified**.
- Hardware buses immediately force Core 2 to invalidate its cache line!
- When Core 2 tries to update \`countB\`, it experiences an expensive cache miss and must re-fetch from slower L3 cache or RAM.
This destructive ping-pong is called **False Sharing**.`,
        keyIdea: 'False sharing occurs when independent variables mutated by different CPU cores reside on the same 64-byte cache line, triggering constant cache invalidations.',
        cliInspection: {
          command: 'perf stat -e cache-misses,L1-dcache-load-misses java -jar benchmark.jar',
          output: `142,391,200   cache-misses          # 62.1% of all L1D hits\n1,241,890,120 L1-dcache-load-misses`,
          explanation: 'Linux perf tool shows elevated hardware cache-miss counters caused by cache line ping-ponging.',
        },
        diagramState: 'cache-line-ping-pong',
      },
      {
        id: 'step-2',
        title: 'The Solution: Cache Line Padding & @Contended',
        subtitle: 'Padding 128 bytes to isolate hot variables onto dedicated cache lines',
        type: 'solution',
        content: `To eliminate false sharing, hot variables must be separated so that no two threads write to the same 64-byte chunk:

1. **Manual Field Padding**:
   Adding unused dummy fields (\`long p1, p2, p3, p4, p5, p6, p7;\`) to push adjacent fields onto the next 64-byte line (used by libraries like LMAX Disruptor).

2. **The Modern JDK Solution: \`@Contended\`**:
   Java includes **\`@jdk.internal.vm.annotation.Contended\`** (introduced in JEP 142).
   When added to a field or class, HotSpot automatically inserts **128 bytes of padding** around the field, isolating it completely from any neighboring variables!
   This technique is used internally inside JDK core classes like \`LongAdder\` and \`ConcurrentHashMap.CounterCell\`.`,
        keyIdea: '@Contended automatically inserts 128 bytes of padding around variables, completely eliminating false sharing and restoring linear CPU scalability.',
        codeExample: {
          title: 'ContendedCounterCell.java',
          code: `import jdk.internal.vm.annotation.Contended;

public class HighThroughputCounter {
    // Isolated onto its own private 64-byte cache line!
    @Contended
    private volatile long counterA;

    @Contended
    private volatile long counterB;

    public void incrementA() { counterA++; }
    public void incrementB() { counterB++; }
}`,
        },
        microCheck: {
          question: 'What is the root hardware cause of False Sharing in Java multithreaded systems?',
          options: [
            'Heap fragmentation in the Old Generation',
            'Independent variables modified by different threads residing in the same 64-byte CPU cache line',
            'Deadlock caused by synchronized monitors',
          ],
          answerIndex: 1,
          explanation: 'CPUs manipulate memory in 64-byte cache lines. Mutating one field invalidates the entire line across other CPU core caches via the MESI protocol.',
        },
        diagramState: 'contended-padding',
      },
    ],
  },
  {
    id: 'safepoints-ttsp',
    slug: 'safepoints-ttsp',
    title: 'Safepoints & Time-to-Safepoint (TTSP)',
    subtitle: 'How the JVM halts threads for GC and deoptimization, and avoiding uncounted loop stalls.',
    moduleId: '03',
    moduleTitle: '03. Concurrency & Async',
    duration: '12 min',
    difficulty: 'Advanced',
    youllLearn: [
      'What a Safepoint is and why the JVM must pause threads for global operations',
      'The Safepoint Polling Page mechanism: memory traps that suspend threads',
      'Time-to-Safepoint (TTSP): why one slow thread stalls the entire cluster',
      'The Uncounted Loop Trap: why int loops without safepoint checks stall JVMs',
      'Java 10+ Loop Strip Mining optimization',
      'Diagnosing safepoint latency with -Xlog:safepoint',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Phantom Latency Spike',
        subtitle: 'Why your service paused for 1.8 seconds with zero GC activity',
        type: 'problem',
        productionSymptom: 'An enterprise microservice suddenly stopped responding to all HTTP requests for 1.8 seconds. GC logs showed that garbage collection pause was only 4ms! Where did the remaining 1,796ms disappear?',
        content: `Whenever the JVM needs to perform a global VM operation:
- Garbage Collection (marking roots, moving regions)
- Deoptimization (bailing out of C2 code)
- Biased Lock Revocation
- Thread Dumps (\`jstack\`)

All application threads must reach a **Safepoint**—a state where all thread registers and stack pointers are consistent and known.
The time it takes for ALL threads to halt after a safepoint is requested is called **Time-To-Safepoint (TTSP)**.
If 99 threads halt in 0.1ms, but ONE single thread takes 1.8 seconds to reach a safepoint check, **the entire JVM is stalled for 1.8 seconds!**`,
        keyIdea: 'Time-To-Safepoint (TTSP) is the elapsed time until the slowest application thread halts, stalling the entire JVM.',
        cliInspection: {
          command: 'java -Xlog:safepoint=debug:file=safepoint.log -jar service.jar',
          output: `[0.450s][info][safepoint] Safepoint "G1CollectForAllocation", Time since last: 120405ns, Reaching safepoint: 1792100412ns (TTSP STALL!), At safepoint: 4100200ns`,
          explanation: 'Notice TTSP was 1.79 seconds, while the actual GC operation at the safepoint took only 4.1ms!',
        },
        diagramState: 'safepoint-stall',
      },
      {
        id: 'step-2',
        title: 'The Uncounted Loop Trap & Loop Strip Mining',
        subtitle: 'Why counted int loops omit safepoint polls in C2 JIT',
        type: 'solution',
        content: `Why would a thread fail to reach a safepoint quickly?

The #1 culprit is the **Uncounted Loop Trap**:
- In JIT compiled code, the compiler inserts a tiny hardware test (a **Safepoint Poll**) at method exits and loop backedges.
- However, to maximize performance, C2 assumes that a standard \`for (int i = 0; i < N; i++)\` loop is short, so it **omits safepoint polls** inside the loop body to enable loop unrolling and SIMD vectorization!
- If \`N = 2_000_000_000\`, the thread will crunch calculations for 2 full seconds without ever checking if a safepoint was requested!

**The Modern Solution: Loop Strip Mining (Java 10+)**:
Modern HotSpot splits counted loops into an inner vectorizable loop with zero polls, and an outer loop that polls for safepoints periodically, ensuring TTSP remains under 1ms.`,
        keyIdea: 'Modern Java applies Loop Strip Mining to ensure long numerical loops check for safepoints without sacrificing SIMD vectorization.',
        codeExample: {
          title: 'UncountedLoopTrap.java',
          code: `// DANGEROUS in older JVMs: No safepoint poll inside loop body!
// If GC requests a safepoint, the entire server freezes until this loop finishes!
for (int i = 0; i < 1_000_000_000; i++) {
    compute(i);
}

// Java 10+ handles this automatically via -XX:+UseCountedLoopSafepoints`,
        },
        microCheck: {
          question: 'What does Time-To-Safepoint (TTSP) measure in the HotSpot JVM?',
          options: [
            'The time it takes to compile bytecode to C2 native code',
            'The time elapsed from when a safepoint is requested until the last running application thread halts at a safepoint poll',
            'The total duration of a G1GC Young evacuation phase',
          ],
          answerIndex: 1,
          explanation: 'TTSP measures how long the JVM waits for the slowest application thread to acknowledge the safepoint request and halt.',
        },
        diagramState: 'loop-strip-mining',
      },
    ],
  },
];
