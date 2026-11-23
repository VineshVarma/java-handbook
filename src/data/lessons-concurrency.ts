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
        subtitle: 'The daily stages of an employee at work',
        type: 'concept',
        content: `Think of a new hire joining a company:
- **NEW**: The employee is hired and has a contract, but hasn't stepped into the building for their first day yet.
- **RUNNABLE**: Actively typing at their desk, or ready to work the second a computer station is free.
- **BLOCKED**: Standing outside the print room door waiting for the person inside to unlock it so they can grab the paper tray.
- **WAITING**: Taking an indefinite break in the lounge, waiting until their manager taps their shoulder and says "we have new work for you".
- **TIMED_WAITING**: Setting a 30-minute timer for lunch and napping until the alarm rings.
- **TERMINATED**: Finished their project, packed up their desk, and clocked out permanently.

In Java, every thread is an execution worker whose life is tracked by the \`Thread.State\` enum:
1. **NEW**: Created with \`new Thread()\`, but \`start()\` has not been called yet.
2. **RUNNABLE**: Running code on a CPU core or waiting in line for OS scheduler time.
3. **BLOCKED**: Waiting to acquire a monitor lock to enter a \`synchronized\` block.
4. **WAITING**: Suspended indefinitely after calling \`wait()\`, \`join()\`, or \`LockSupport.park()\`.
5. **TIMED_WAITING**: Suspended with a time limit (e.g. \`Thread.sleep(millis)\` or \`wait(timeout)\`).
6. **TERMINATED**: Finished its \`run()\` method or terminated by an unhandled error.`,
        keyIdea: 'The JVM moves threads through 6 distinct states, managing active execution on CPU cores and passive waiting for locks or timers.',
        diagramState: 'new-thread',
        diagramAlt: 'Architecture diagram illustrating The daily stages of an employee at work: The daily stages of an employee at work.',
      },
      {
        id: 'step-2',
        title: 'BLOCKED vs WAITING States',
        subtitle: 'Waiting outside a locked door vs sitting in a waiting room',
        type: 'insight',
        content: `Many Java developers get confused between **BLOCKED** and **WAITING**:

- **BLOCKED (Locked Out)**:
  Think of standing right outside a restroom stall where someone locked the latch from the inside. You are eager to step in, but you literally cannot because the physical lock is engaged. In Java, this happens exclusively when a thread is trying to enter or re-enter a \`synchronized\` block or method, but another thread currently holds that object's **intrinsic monitor lock**.

- **WAITING (Sitting in the Waiting Room)**:
  Think of sitting in a doctor's waiting room reading a magazine. You voluntarily sat down and gave up your place in the hallway. You aren't banging on the doctor's door; you are resting patiently until the nurse steps out and calls your name (\`notify()\` or \`notifyAll()\`). In Java, a thread enters WAITING when it deliberately calls \`Object.wait()\` or \`Thread.join()\`.`,
        keyIdea: 'BLOCKED threads are waiting to acquire an intrinsic monitor lock; WAITING threads voluntarily yielded the CPU waiting for an explicit signal.',
        diagramState: 'blocked-state',
        diagramAlt: 'Architecture diagram illustrating Waiting outside a locked door vs sitting in a waiting room: Waiting outside a locked door vs sitting in a waiting room.',
      },
      {
        id: 'step-3',
        title: 'Volatile and Java Memory Model',
        subtitle: 'A private pocket notepad vs a central town square billboard',
        type: 'solution',
        content: `Imagine two commanders stationed in two different towers:
- Commander A writes an order on a small private notepad in their pocket (Core 1's local CPU L1/L2 cache).
- Commander B is looking out the window of Tower 2. They have no idea Commander A wrote anything, because the private notepad stays inside Tower 1!
- To make sure both commanders stay in sync, they coordinate via shared memory protocols.

Modern multi-core processors give each CPU core its own high-speed L1/L2 cache. Without coordination, Core 1 can write a new variable value to its cache, while Core 2 keeps reading an old, stale value from its own cache!

The \`volatile\` keyword establishes formal happens-before relationships defined by the Java Memory Model (JMM):
1. **Memory Visibility**: Writes do not bypass cache to make a slow round-trip to main DRAM. Instead, CPU memory barriers drain the local CPU store buffer and broadcast cache line invalidation over hardware cache coherence protocols (MESI/MOESI), guaranteeing other CPU cores observe the updated value in their L1/L2 caches immediately.
2. **Instruction Ordering**: The JMM enforces one-way acquire and release memory barriers:
   - Release barrier on volatile write: Prior ordinary reads and writes cannot be reordered after the volatile write.
   - Acquire barrier on volatile read: Subsequent ordinary reads and writes cannot be reordered before the volatile read.
   - Full barrier: A volatile write followed by a volatile read prevents reordering between them.

**Crucial Warning**: \`volatile\` does **NOT** make \`count++\` thread-safe! \`count++\` involves 3 separate bytecode operations: read (\`getfield\` or \`iload\`), increment (\`iadd\`), and write (\`putfield\` or \`istore\`). If multiple threads execute this concurrently, increments are lost. For atomic math, always use \`AtomicInteger\` or \`AtomicLong\`.`,
        keyIdea: 'volatile establishes happens-before relationships using CPU memory barriers and cache coherence, but does not make compound operations atomic.',
        codeExample: {
          language: 'java',
          title: 'VolatileFlagPattern.java',
          code: `public class WorkerService implements Runnable {
    // volatile ensures all worker threads see the stop signal immediately!
    private volatile boolean running = true;

    public void stopRunning() {
        this.running = false;
    }

    @Override
    public void run() {
        while (running) {
            // Process tasks from a queue
        }
        System.out.println("Worker thread stopped cleanly.");
    }

    public static void main(String[] args) throws InterruptedException {
        WorkerService service = new WorkerService();
        Thread thread = new Thread(service);
        thread.start();

        Thread.sleep(100);
        service.stopRunning(); // Safely signals the background thread
        thread.join();
    }
}`,
        },
        interviewTip: 'Is count++ thread-safe if count is declared volatile? No! count++ involves 3 separate bytecode operations: read (getfield or iload), increment (iadd), and write (putfield or istore). If multiple threads execute this concurrently, increments can be lost. Use AtomicInteger.incrementAndGet() instead.',
        diagramState: 'running-state',
        diagramAlt: 'Architecture diagram illustrating VolatileFlagPattern.java: A private pocket notepad vs a central town square billboard.',
      },
      {
        id: 'step-4',
        title: 'Deadlocks and Prevention',
        subtitle: 'Two cars meeting on a narrow one-lane bridge',
        type: 'trade-off',
        content: `Imagine two stubborn drivers meeting in the middle of a narrow one-lane bridge from opposite directions. Driver 1 refuses to back up until Driver 2 backs up. Driver 2 refuses to back up until Driver 1 backs up. Both drivers sit with their arms crossed, honking their horns forever. Traffic is permanently frozen.

In multithreading, this frozen nightmare is called a **Deadlock**:
- Thread 1 holds Lock A and requests Lock B.
- Thread 2 holds Lock B and requests Lock A.
- Neither thread can move forward, and neither will release their lock. Both threads sit BLOCKED for all eternity!

**How to Prevent Deadlocks**:
1. **Acquire locks in a strict global order**: If all threads always acquire Lock A first and Lock B second, circular wait is impossible!
2. **Use timeouts with** \`ReentrantLock\`: Instead of locking forever with \`synchronized\`, use \`lock.tryLock(500, TimeUnit.MILLISECONDS)\`. If a lock cannot be obtained within half a second, back off, release any held locks, and try again later.`,
        keyIdea: 'Deadlocks happen when threads wait in a circle for each other\'s locks; prevent them by ordering lock acquisitions or using timed tryLock().',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating Two cars meeting on a narrow one-lane bridge: Two cars meeting on a narrow one-lane bridge.',
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
        subtitle: 'The cafe buzzer tag that frees you to walk around',
        type: 'problem',
        content: `Imagine ordering an espresso at a modern cafe:
- **Synchronous Blocking**: You order, and the cashier forces you to stand frozen at the register for 4 minutes while they brew your coffee. The line behind you stretches out the door because nobody else can order until your cup is in your hand.
- **Asynchronous Callback**: You order, the cashier hands you a vibrating buzzer tag, and immediately helps the next customer. You can sit down, check your phone, and relax. When your coffee is ready, the buzzer buzzes, and you collect your drink!

In classic Java, calling \`Future.get()\` acted like standing frozen at the register—it blocked the calling thread until the remote server replied!

\`CompletableFuture\` (introduced in Java 8 and enhanced in Java 9/21) brings reactive, non-blocking promise chaining to Java: you declare a pipeline of steps that will execute automatically whenever data arrives, without tying up worker threads.`,
        keyIdea: 'CompletableFuture allows you to chain asynchronous tasks together so threads are never held captive waiting for network responses.',
        diagramState: 'supply-async',
        diagramAlt: 'Architecture diagram illustrating The cafe buzzer tag that frees you to walk around: The cafe buzzer tag that frees you to walk around.',
      },
      {
        id: 'step-2',
        title: 'supplyAsync Thread Pool Isolation',
        subtitle: 'Giving the kitchen its own dedicated crew',
        type: 'insight',
        content: `When you call \`CompletableFuture.supplyAsync(() -> fetchRemoteData())\`, Java has to run that work on a background thread. By default, it uses \`ForkJoinPool.commonPool()\`.

**Critical Production Warning for Beginners**:
The default \`ForkJoinPool.commonPool()\` is sized strictly to match your computer's CPU core count (e.g. 4 to 8 threads). It is designed purely for fast, pure in-memory math calculations!

If you submit slow network HTTP calls or database queries to \`ForkJoinPool.commonPool()\`, all worker threads will quickly become frozen waiting for network sockets. Suddenly, your entire JVM is starved of threads, freezing other parts of your app!

**Best Practice**: Always pass your own dedicated, properly sized custom Executor (such as an \`ExecutorService\`) when making external API calls.`,
        keyIdea: 'Never use the default ForkJoinPool.commonPool() for blocking network or database calls; always supply a dedicated custom thread pool.',
        codeExample: {
          language: 'java',
          title: 'DedicatedThreadPoolAsync.java',
          code: `import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class DedicatedThreadPoolAsync {
    // Dedicated custom pool for external REST API calls
    private static final ExecutorService apiPool = Executors.newFixedThreadPool(20);

    public static CompletableFuture<String> fetchPolicyAsync(String policyId) {
        return CompletableFuture.supplyAsync(() -> {
            // Simulated network call:
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "PolicyDetails for " + policyId;
        }, apiPool); // Explicitly pass the dedicated thread pool!
    }

    public static void main(String[] args) {
        fetchPolicyAsync("POL-101")
            .thenAccept(details -> System.out.println("Received: " + details))
            .join();
        apiPool.shutdown();
    }
}`,
        },
        diagramState: 'parallel-exec',
        diagramAlt: 'Architecture diagram illustrating DedicatedThreadPoolAsync.java: Giving the kitchen its own dedicated crew.',
      },
      {
        id: 'step-3',
        title: 'Async Chaining and Composition',
        subtitle: 'Chopping, baking, and plating the dinner dishes',
        type: 'concept',
        content: `Think of preparing a delicious dinner in a kitchen:

1. \`thenApply()\` (Chopping veggies - Simple 1-to-1 transform):
   You receive a peeled carrot and chop it into coins. Like a stream's \`map()\`, it takes the output of the previous future and transforms it synchronously.

2. \`thenCompose()\` (Baking in the oven - Sequential Async):
   You take the seasoned chicken and slide it into the oven. The oven gives you its own independent baking timer. You don't want a "timer inside a box inside a timer" (\`CompletableFuture<CompletableFuture<Dinner>>\`). \`thenCompose()\` un-nests the async steps into a single clean sequential chain!

3. \`thenCombine()\` (Plating the meal - Parallel Combination):
   While the chicken bakes in the oven, you toss a fresh garden salad on the side counter at the exact same time. When both the chicken and the salad are ready, you combine them onto a single dinner plate!`,
        keyIdea: 'Use thenApply for simple result mapping, thenCompose for dependent sequential async calls, and thenCombine to merge two parallel independent futures.',
        codeExample: {
          language: 'java',
          title: 'AsyncChainingExamples.java',
          code: `import java.util.concurrent.CompletableFuture;

public class AsyncChainingExamples {
    record Policy(String id, String name, String customerId) {}
    record CreditScore(int score) {}
    record FullProfile(Policy policy, CreditScore score) {}

    public static void main(String[] args) {
        // 1. thenApply: Simple transformation
        CompletableFuture<String> upperName = CompletableFuture.completedFuture("alice")
            .thenApply(String::toUpperCase);

        // 2. thenCompose: Sequential dependent call
        CompletableFuture<Policy> policyF = CompletableFuture.supplyAsync(() -> 
            new Policy("P-1", "Health", "C-99")
        );
        CompletableFuture<String> customerIdF = policyF.thenCompose(p -> 
            CompletableFuture.supplyAsync(p::customerId)
        );

        // 3. thenCombine: Merge two independent parallel calls
        CompletableFuture<CreditScore> scoreF = CompletableFuture.supplyAsync(() -> 
            new CreditScore(780)
        );
        CompletableFuture<FullProfile> profileF = policyF.thenCombine(
            scoreF,
            FullProfile::new
        );

        System.out.println("Result: " + profileF.join());
    }
}`,
        },
        diagramState: 'then-combine',
        diagramAlt: 'Architecture diagram illustrating AsyncChainingExamples.java: Chopping, baking, and plating the dinner dishes.',
      },
      {
        id: 'step-4',
        title: 'AllOf and Graceful Fallbacks',
        subtitle: 'The travel search engine that aggregates flights safely',
        type: 'solution',
        content: `Think of a flight comparison website like Skyscanner. When you search for flights, the website calls 5 different airlines at the same time:
- It doesn't query them one after another (which would take 15 seconds). It fires all 5 requests in parallel using \`CompletableFuture.allOf()\`.
- What if one airline's API is down or takes too long? The search engine doesn't crash your screen with a scary 500 error! It attaches a timeout rule (\`orTimeout()\`) and provides a fallback note saying "Airline C temporarily unavailable" using \`exceptionally()\`.

By combining parallel fan-out with timeouts and fallback error handlers, your microservices remain blazing fast and resilient to downstream outages!`,
        keyIdea: 'Use allOf() to query multiple downstream services in parallel, and attach exceptionally() or handle() to return cached fallbacks if one fails.',
        codeExample: {
          language: 'java',
          title: 'ResilientOrchestration.java',
          code: `import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class ResilientOrchestration {
    record Dashboard(String policyData, String billingData) {}

    public static CompletableFuture<Dashboard> getCustomerDashboard(String customerId) {
        CompletableFuture<String> policyF = CompletableFuture.supplyAsync(() -> "Policy #POL-101 (Active)")
            .orTimeout(500, TimeUnit.MILLISECONDS)
            .exceptionally(ex -> "Policy service temporarily unavailable");

        CompletableFuture<String> billingF = CompletableFuture.supplyAsync(() -> "Balance: $0.00")
            .orTimeout(500, TimeUnit.MILLISECONDS)
            .exceptionally(ex -> "Billing cache fallback: Paid");

        return CompletableFuture.allOf(policyF, billingF)
            .thenApply(v -> new Dashboard(policyF.join(), billingF.join()));
    }

    public static void main(String[] args) {
        Dashboard dashboard = getCustomerDashboard("user-1").join();
        System.out.println("Dashboard loaded: " + dashboard);
    }
}`,
        },
        interviewTip: 'What is the difference between join() and get() in CompletableFuture? get() throws checked exceptions (InterruptedException, ExecutionException), which requires clunky try-catch blocks. join() throws unchecked CompletionException, allowing it to be used smoothly inside clean lambda pipelines.',
        diagramState: 'fallback-catch',
        diagramAlt: 'Architecture diagram illustrating ResilientOrchestration.java: The travel search engine that aggregates flights safely.',
      },
      {
        id: 'step-5',
        title: 'Recap: Non-Blocking High-Throughput Microservices',
        subtitle: 'The speed advantage of asynchronous pipelines',
        type: 'recap',
        content: `By replacing slow, blocking synchronous code with CompletableFuture pipelines:
- Your response time drops from the total cumulative sum of all requests down to simply the response time of your slowest single service.
- Server threads are never stuck waiting idly for network packets to cross the ocean.
- Your application can easily handle 5x to 10x higher user traffic on the exact same hardware!`,
        keyIdea: 'CompletableFuture turns sluggish sequential waiting into fast, parallel, resilient execution for high-throughput distributed systems.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating The speed advantage of asynchronous pipelines: The speed advantage of asynchronous pipelines.',
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
        subtitle: 'A taxi fleet standby service vs buying a car for every errand',
        type: 'concept',
        content: `Imagine running errands around town. If you bought a brand new car from a dealership every time you needed milk, drove to the store, and then crushed the car into a scrap metal cube when you got home, you would go bankrupt in two days. Instead, you call a taxi company that maintains a fleet of 10 standby cars and reuses them for hundreds of rides!

In Java, creating a platform thread is expensive:
- Each thread reserves **~1MB of off-heap stack memory**.
- The operating system has to spend valuable CPU cycles switching between threads.
- If you call \`new Thread()\` for every incoming web request, your server will quickly crash with \`OutOfMemoryError: unable to create new native thread\`.

The \`ExecutorService\` solves this by keeping a pool of reusable worker threads:
1. \`corePoolSize\`: The number of regular standby workers kept ready even when idle.
2. \`maximumPoolSize\`: The ceiling of maximum workers allowed during a rush.
3. \`workQueue\`: The waiting line (queue) holding incoming tasks when all core workers are busy.

**Queuing Order & Sizing Pitfall**:
A \`ThreadPoolExecutor\` only expands past \`corePoolSize\` once its \`workQueue\` is completely saturated. If an unbounded queue like \`LinkedBlockingQueue\` (without capacity) is used, the pool will never create temporary burst threads, risking unbounded queue starvation, memory exhaustion, and latency spikes under heavy load.`,
        keyIdea: 'A ThreadPoolExecutor reuses a fixed, healthy set of operating system threads, preventing server crashes and memory exhaustion.',
        diagramState: 'thread-pool-anatomy',
        diagramAlt: 'Architecture diagram illustrating A taxi fleet standby service vs buying a car for every errand: A taxi fleet standby service vs buying a car for every errand.',
      },
      {
        id: 'step-2',
        title: 'Task Submission & Rejection Policy',
        subtitle: 'The bank lobby queue and the velvet rope',
        type: 'insight',
        content: `The way a ThreadPoolExecutor manages incoming tasks surprises almost every beginner:
1. If fewer than \`corePoolSize\` workers are active, the pool **spawns a new worker thread** right away.
2. If all core workers are busy, the task is **placed in the waiting queue** (the velvet rope line).
3. Only if the **waiting queue becomes 100% full**, and current threads are still less than \`maximumPoolSize\`, does the pool hire extra temporary emergency workers!
4. If the queue is completely full and all maximum workers are busy, the pool invokes the \`RejectedExecutionHandler\`!

**Common Rejection Policies**:
- \`AbortPolicy\` **(Default)**: Throws a \`RejectedExecutionException\` immediately.
- \`CallerRunsPolicy\`: Forces the thread that submitted the task to execute the task itself! This slows down incoming requests naturally (**backpressure**).
- \`DiscardOldestPolicy\`: Drops the oldest unhandled task from the front of the queue to make room for the new one.`,
        keyIdea: 'Extra temporary workers beyond corePoolSize are created only when the workQueue is completely full, not when core threads become busy.',
        diagramState: 'queue-rejection-policy',
        diagramAlt: 'Architecture diagram illustrating The bank lobby queue and the velvet rope: The bank lobby queue and the velvet rope.',
      },
      {
        id: 'step-3',
        title: 'Virtual Threads in Java 21 (Project Loom)',
        subtitle: 'From thousands of heavy platform threads to millions of lightweight fibers',
        type: 'solution',
        content: `In Java 21, **Virtual Threads** revolutionized how developers write concurrent Java:

- **Platform Thread (The Heavyweight)**: Mapped 1:1 to an operating system kernel thread. Costs ~1MB of memory and slow context switches. A standard server runs out of steam at around 2,000 platform threads.
- **Virtual Thread (The Featherweight)**: Managed directly by the JVM runtime as tiny objects on the Heap! Costs only **~1KB of memory** (1,000x lighter!).

**The Superpower**:
When a Virtual Thread calls a blocking operation (like an HTTP call, a database query, or \`Thread.sleep()\`), the JVM automatically **unmounts** the virtual thread from its underlying OS thread! The OS thread is immediately free to run other virtual threads. The instant your network response arrives, the virtual thread is remounted and continues executing right where it left off!

You can write simple, readable, step-by-step code while achieving the astronomical throughput of complex reactive frameworks.`,
        keyIdea: 'Virtual threads cost only ~1KB and unmount automatically during blocking I/O, allowing you to run millions of threads concurrently.',
        codeExample: {
          language: 'java',
          title: 'Java21VirtualThreads.java',
          code: `import java.time.Duration;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

public class Java21VirtualThreads {
    public static void main(String[] args) {
        // Launch 10,000 concurrent tasks effortlessly with virtual threads:
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            IntStream.range(0, 10_000).forEach(i -> {
                executor.submit(() -> {
                    // Blocking sleep unmounts the carrier thread automatically!
                    Thread.sleep(Duration.ofMillis(100));
                    return "Task " + i + " finished";
                });
            });
        } // The try-with-resources block automatically waits for all virtual threads to complete!
        
        System.out.println("All 10,000 virtual threads completed successfully!");
    }
}`,
        },
        interviewTip: 'Should you pool Virtual Threads in Java 21 using a fixed-size thread pool? NO! Never pool virtual threads. Because they are lightweight and ephemeral, simply create a new virtual thread per task using Executors.newVirtualThreadPerTaskExecutor().',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating Java21VirtualThreads.java: From thousands of heavy platform threads to millions of lightweight fibers.',
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
        subtitle: 'Dedicating an entire passenger jet to a single traveler',
        type: 'problem',
        productionSymptom: 'A Spring Boot service handling 8,000 simultaneous client connections crashed with java.lang.OutOfMemoryError: unable to create native thread. The operating system kernel refused to allocate further 1MB native thread stacks.',
        content: `Imagine an airline that assigns an entire 300-seat Boeing 777 passenger jet to fly a single traveler across the country. If 5,000 travelers want to fly at the same time, the airline needs 5,000 giant airplanes and 5,000 runways. The airport runs out of tarmac instantly!

In classic Java:
- Every \`Thread\` was an OS Platform Thread with a 1:1 mapping to an operating system kernel thread.
- Each thread reserves **~1MB of stack memory**.
- Switching between threads requires the OS kernel to save CPU hardware registers and switch privilege modes.

As a result, a server hits a hard physical wall at 2,000 to 5,000 threads. To overcome this, developers previously resorted to complex reactive programming (WebFlux, RxJava), which created confusing stack traces and difficult debugging.`,
        keyIdea: '1:1 platform threads are too memory-heavy (~1MB each) and hit OS kernel limits when scaling to thousands of concurrent users.',
        cliInspection: {
          command: 'jcmd <pid> Thread.dump_to_file -format=json threads.json',
          output: `[info] Thread dump written to threads.json (illustrative schema):
{
  "threadDump": {
    "processId": 41280,
    "time": "2024-03-15T10:30:00.123Z",
    "threads": [
      {
        "tid": 105,
        "name": "virtual-worker-1",
        "state": "WAITING",
        "virtual": true,
        "carrier": "ForkJoinPool-1-worker-3"
      }
    ],
    "threadContainers": [
      {
        "container": "VirtualThreadPerTaskExecutor",
        "threads": 100000
      }
    ]
  }
}`,
          explanation: 'Authentic HotSpot Thread.dump_to_file JSON excerpt (JEP 425/444). Notice virtual threads mounted on underlying ForkJoinPool carrier threads.',
        },
        diagramState: 'thread-wall',
        diagramAlt: 'Architecture diagram illustrating Dedicating an entire passenger jet to a single traveler: Dedicating an entire passenger jet to a single traveler.',
      },
      {
        id: 'step-2',
        title: 'Project Loom: M:N Continuations on Heap',
        subtitle: 'Passengers sharing seats in a small fleet of shuttle vans',
        type: 'solution',
        content: `Think of a university campus shuttle van with 16 seats (**Carrier Threads**).
- There are 100,000 students (**Virtual Threads**) who need rides around campus.
- When a student wants to ride, they hop into an empty van seat.
- When the student arrives at the library to study for an exam (blocking I/O like waiting for a database query), they step out of the van! They don't sit in the van seat holding up everyone else.
- While the student studies, their notebook is stored in a locker (**A Continuation chunk on the Heap**).
- Meanwhile, the van seat is immediately taken by another student who needs a ride! When the first student finishes studying, they step back into whatever shuttle van has an empty seat and continue their journey.

In Java 21 Project Loom, this **M:N scheduling** allows a tiny pool of 16 OS carrier threads to easily juggle 100,000+ virtual threads with zero thread starvation!`,
        keyIdea: 'When a virtual thread blocks on I/O, the JVM unmounts its call stack to the Heap as a Continuation, instantly freeing the OS carrier thread.',
        codeExample: {
          language: 'java',
          title: 'VirtualThreadPerTaskPattern.java',
          code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.Executors;

public class VirtualThreadPerTaskPattern {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://httpbin.org/delay/1"))
            .build();

        // Launch concurrent tasks using virtual threads:
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 100; i++) {
                final int id = i;
                executor.submit(() -> {
                    // Blocking HTTP call: Unmounts carrier thread automatically!
                    HttpResponse<String> response = client.send(
                        request, 
                        HttpResponse.BodyHandlers.ofString()
                    );
                    return "Task " + id + " status: " + response.statusCode();
                });
            }
        } // Auto-closes and waits for all tasks to complete!
    }
}`,
        },
        diagramState: 'carrier-mount',
        diagramAlt: 'Architecture diagram illustrating VirtualThreadPerTaskPattern.java: Passengers sharing seats in a small fleet of shuttle vans.',
      },
      {
        id: 'step-3',
        title: 'The Thread Pinning Danger',
        subtitle: 'Supergluing yourself to the shuttle van seat',
        type: 'trade-off',
        content: `There is one critical consideration when running virtual threads: **Thread Pinning**.

Imagine a passenger stepping into the shuttle van and supergluing their pants to the seat. When they arrive at the library, they cannot step out of the van! The van is forced to sit in the parking lot doing nothing while that single student reads their book.

In Java, a Virtual Thread becomes **PINNED** to its underlying OS carrier thread if it performs blocking I/O while:
1. Inside a \`synchronized\` block or method
2. Inside a native C/C++ JNI call

When pinned, HotSpot cannot unmount the virtual thread to the heap. If 16 virtual threads get pinned at the same time, all 16 carrier threads are frozen, completely halting your entire server!

**JDK Version Evolution**:
- In **JDK 21 pinned** carrier threads occurred whenever a virtual thread entered a \`synchronized\` block or method and then blocked on I/O.
- In **JDK 24 JEP 491** ("Synchronize Virtual Threads without Pinning"), intrinsic monitor locking was re-engineered so virtual threads unmount and remount gracefully without pinning carrier threads.
- For JDK 21 LTS runtimes, avoid pinning by replacing \`synchronized\` with \`java.util.concurrent.locks.ReentrantLock\`, which allows virtual threads to unmount freely during blocking calls.`,
        keyIdea: 'In JDK 21, avoid blocking I/O inside synchronized blocks by using ReentrantLock to prevent pinning OS carrier threads; JDK 24 JEP 491 eliminates synchronized pinning.',
        codeExample: {
          language: 'java',
          title: 'RefactorSynchronizedToReentrantLock.java',
          code: `import java.util.concurrent.locks.ReentrantLock;

public class SafeVirtualThreadLocking {
    // DANGEROUS: Pins carrier thread on blocking I/O!
    // public synchronized String fetchPolicyBad(String id) {
    //     return callSlowRemoteService(id);
    // }

    // PRODUCTION SAFE: ReentrantLock allows virtual threads to unmount smoothly!
    private final ReentrantLock lock = new ReentrantLock();

    public String fetchPolicySafe(String id) {
        lock.lock();
        try {
            return callSlowRemoteService(id);
        } finally {
            lock.unlock();
        }
    }

    private String callSlowRemoteService(String id) {
        return "Policy-" + id;
    }
}`,
        },
        microCheck: {
          question: 'Why does holding a synchronized monitor across blocking network I/O cause severe problems with Virtual Threads?',
          options: [
            'It corrupts the virtual thread call stack',
            'It pins the virtual thread to its OS carrier thread, preventing unmounting and freezing the carrier thread pool',
            'It forces the JVM to switch into C1 compilation tier',
          ],
          answerIndex: 1,
          explanation: 'The current HotSpot implementation cannot detach call stacks when an object monitor lock is held, locking the OS carrier thread in place.',
        },
        diagramState: 'thread-pinning',
        diagramAlt: 'Architecture diagram illustrating RefactorSynchronizedToReentrantLock.java: Supergluing yourself to the shuttle van seat.',
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
        subtitle: 'Two accountants bumping elbows on a single narrow desk',
        type: 'problem',
        productionSymptom: 'A multi-threaded metrics counter showed severe throughput degradation when scaling from 2 to 16 CPU cores. Threads were modifying completely different fields (threadA modified countA, threadB modified countB), yet CPU cache miss rates spiked to 90%!',
        content: `Imagine two accountants working in an office. They are working on two completely independent financial reports. But management forces both accountants to sit shoulder-to-shoulder on one tiny, narrow wooden desk. Every time Accountant A reaches for a pencil, their elbow knocks Accountant B's hand, forcing Accountant B to stop writing and restart their sentence.

Even though their tasks are completely unrelated, sharing the physical desk creates constant interference!

In computer hardware, processors do not read memory one byte at a time. They fetch memory in **64-Byte chunks called Cache Lines**:
- When CPU Core 1 reads \`counterA\`, it pulls the entire 64-byte cache line into its private L1/L2 cache.
- If \`counterB\` sits right next to \`counterA\` in memory, both variables share the **exact same 64-byte cache line**.
- When Core 1 updates \`counterA\`, hardware rules (the MESI protocol) immediately mark the entire 64-byte line as **Invalid** in Core 2's cache!
- When Core 2 tries to update \`counterB\`, it suffers an expensive cache miss and has to re-fetch the entire line from slower RAM.

This invisible elbow-bumping is called **False Sharing**, and it can ruin multicore performance.`,
        keyIdea: 'False sharing happens when independent variables modified by different CPU cores sit on the same 64-byte cache line, causing constant cache invalidations.',
        cliInspection: {
          command: 'perf stat -e cache-misses,L1-dcache-load-misses java -jar benchmark.jar',
          output: `142,391,200   cache-misses          # 62.1% of all L1D hits\n1,241,890,120 L1-dcache-load-misses`,
          explanation: 'Linux perf counters reveal massive CPU cache misses caused by cache lines ping-ponging back and forth between CPU cores.',
        },
        diagramState: 'cache-line-ping-pong',
        diagramAlt: 'Architecture diagram illustrating Two accountants bumping elbows on a single narrow desk: Two accountants bumping elbows on a single narrow desk.',
      },
      {
        id: 'step-2',
        title: 'The Solution: Cache Line Padding & @Contended',
        subtitle: 'Giving each accountant their own private desk with empty buffer space',
        type: 'solution',
        content: `To solve false sharing, you simply need to make sure the two accountants don't share the same desk: give each variable its own dedicated 64-byte cache line!

There are two ways to do this:

1. **Manual Padding (The Legacy Way)**:
   Add unused dummy fields (\`long p1, p2, p3, p4, p5, p6, p7;\`) between your variables so they are spaced at least 64 bytes apart.

2. **The Modern JVM Way:** \`@Contended\`:
   Java provides the \`@jdk.internal.vm.annotation.Contended\` annotation (JEP 142).
   Note that application classpath classes require the JVM flag \`-XX:-RestrictContended\` to enable \`@Contended\`. HotSpot automatically inserts 128 bytes of padding (two 64-byte cache lines) around annotated fields to prevent adjacent cache-line prefetching interference.
   This guarantees that the variable has its own private CPU cache line with zero interference from neighbors! This exact optimization powers high-performance JDK classes like \`LongAdder\`.`,
        keyIdea: '@Contended inserts 128 bytes of padding around hot variables with -XX:-RestrictContended, isolating them on separate CPU cache lines.',
        codeExample: {
          language: 'java',
          title: 'ContendedCounterCell.java',
          code: `import jdk.internal.vm.annotation.Contended;

public class HighThroughputCounter {
    // Isolated onto its own private 64-byte cache line!
    @Contended
    private volatile long counterA;

    @Contended
    private volatile long counterB;

    public void incrementA() {
        counterA++;
    }

    public void incrementB() {
        counterB++;
    }

    public long getA() { return counterA; }
    public long getB() { return counterB; }
}`,
        },
        microCheck: {
          question: 'What is the root hardware cause of False Sharing in Java multithreaded systems?',
          options: [
            'Heap fragmentation in the Old Generation',
            'Independent variables modified by different CPU cores residing in the same 64-byte CPU cache line',
            'Deadlock caused by synchronized monitors',
          ],
          answerIndex: 1,
          explanation: 'CPUs fetch and invalidate memory in 64-byte cache lines. Mutating one variable invalidates the entire cache line across other CPU core caches via the hardware coherence protocol.',
        },
        diagramState: 'contended-padding',
        diagramAlt: 'Architecture diagram illustrating ContendedCounterCell.java: Giving each accountant their own private desk with empty buffer space.',
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
        subtitle: 'Taking a group photo at a company retreat',
        type: 'problem',
        productionSymptom: 'An enterprise microservice suddenly stopped responding to all HTTP requests for 1.8 seconds. GC logs showed that garbage collection pause was only 4ms! Where did the remaining 1,796ms disappear?',
        content: `Imagine organizing a group photo of 100 employees at a company retreat. Before the photographer can snap the picture, all 100 employees must stop what they are doing and gather in the courtyard:
- If 99 employees arrive in 5 seconds, but 1 employee is out running a marathon on a trail and takes 20 minutes to return, all 99 people must stand waiting in the hot sun.
- The photo itself takes 1 second, but everyone was frozen for 20 minutes!

In the JVM, whenever a global operation needs to happen (like Garbage Collection, deoptimizing JIT code, or capturing a thread dump), the JVM asks all running application threads to pause at a **Safepoint**—a safe state where all thread memory pointers are consistent and known.

The time it takes for **ALL** threads to halt after the JVM requests a safepoint is called **Time-To-Safepoint (TTSP)**. If 99 threads halt in 0.1ms, but a single thread takes 1.8 seconds to reach its safepoint check, **the entire JVM is frozen for 1.8 seconds!**`,
        keyIdea: 'Time-To-Safepoint (TTSP) is the elapsed time until the slowest application thread reaches a safepoint check, stalling all other threads in the JVM.',
        cliInspection: {
          command: 'java -Xlog:safepoint=debug:file=safepoint.log -jar service.jar',
          output: `[0.450s][info][safepoint] Safepoint "G1CollectForAllocation", Reaching safepoint: 1792100412ns, At safepoint: 4100200ns, Total: 1796200612ns`,
          explanation: 'GC log reveals TTSP was 1.79 seconds, while the actual Garbage Collection pause at the safepoint was only 4.1 milliseconds!',
        },
        diagramState: 'safepoint-stall',
        diagramAlt: 'Architecture diagram illustrating Taking a group photo at a company retreat: Taking a group photo at a company retreat.',
      },
      {
        id: 'step-2',
        title: 'The Uncounted Loop Trap & Loop Strip Mining',
        subtitle: 'The marathon runner without a radio',
        type: 'solution',
        content: `Why would a thread take seconds to reach a safepoint check?

The most common cause is safepoint poll omission in loops:
- The JIT compiler inserts tiny check points called **Safepoint Polls** at method exits and loop back-edges.
- In older Java versions, to make simple loops run at maximum hardware speed, the C2 compiler treated counted \`int\` loops as short-lived and **omitted safepoint poll checks** inside the loop body to enable vectorization.
- If \`N = 1,000,000,000\`, that thread would crunch numbers for two full seconds without ever checking if the JVM requested a safepoint!

**The Modern Solution: Loop Strip Mining (Java 10+)**:
Modern HotSpot automatically divides counted loops into two tiers:
1. An inner loop that crunches numbers at maximum hardware speed.
2. An outer loop that periodically checks the safepoint poll every few milliseconds.

Note the distinction: counted \`int\` loops are solved by strip mining, but true uncounted loops (e.g., loops with unknown bounds or \`long\` loop variables) can still delay safepoints if not structured properly. This ensures Time-To-Safepoint (TTSP) stays under 1 millisecond.`,
        keyIdea: 'Modern Java uses Loop Strip Mining so long loops can check for safepoints periodically without losing hardware vectorization speed.',
        codeExample: {
          language: 'java',
          title: 'UncountedLoopTrap.java',
          code: `public class LoopSafepointDemo {
    public static void main(String[] args) {
        long sum = 0;
        // In older Java runtimes, counted int loops omitted safepoint polls,
        // causing multi-second TTSP freezes if GC needed a safepoint.
        // Java 10+ fixes this automatically via loop strip mining!
        for (int i = 0; i < 1_000_000_000; i++) {
            sum += (i & 1);
        }
        System.out.println("Computed sum: " + sum);
    }
}`,
        },
        microCheck: {
          question: 'What does Time-To-Safepoint (TTSP) measure in the HotSpot JVM?',
          options: [
            'The time it takes to compile bytecode into C2 native code',
            'The elapsed time from when a safepoint is requested until the last running application thread halts at a safepoint poll',
            'The total duration of a G1GC Young evacuation phase',
          ],
          answerIndex: 1,
          explanation: 'TTSP measures how long the JVM must wait for the slowest running thread to reach a safepoint poll and halt.',
        },
        diagramState: 'loop-strip-mining',
        diagramAlt: 'Architecture diagram illustrating UncountedLoopTrap.java: The marathon runner without a radio.',
      },
    ],
  },
];
