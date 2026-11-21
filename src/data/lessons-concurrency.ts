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
];
