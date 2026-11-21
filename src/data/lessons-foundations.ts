import { Lesson } from '@/lib/types';

export const foundationsLessons: Lesson[] = [
  {
    id: 'how-java-runs',
    slug: 'how-java-runs',
    title: 'How Java Runs Your Code',
    subtitle: 'Follow your code from .java file through compilation to JVM native execution.',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '12 min',
    difficulty: 'Beginner',
    youllLearn: [
      'What happens when you run javac vs java',
      'The binary layout of .class bytecode (CAFEBABE)',
      'The 3-phase ClassLoader hierarchy and bytecode verification',
      'How the Execution Engine switches between Interpreter and JIT (C1/C2)',
      'Stack memory frames vs Heap memory allocations',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Hit Enter: Write Source Code',
        subtitle: 'From human-readable syntax to disk',
        type: 'problem',
        content: `Every enterprise backend starts with plain text in a \`.java\` file. Whether you write a high-throughput payment handler or a simple utility, the CPU cannot execute Java source code directly.

Unlike compiled languages like C or Go that generate machine code targeted directly at x86 or ARM CPU instruction sets, Java was designed around the architectural philosophy: **"Write Once, Run Anywhere" (WORA)**.

To achieve this hardware independence, your source code must first be translated into an intermediate representation known as **Java Bytecode**. Let's follow what happens the moment you compile.`,
        keyIdea: 'Java achieves platform independence by compiling source code to intermediate bytecode rather than direct CPU machine code.',
        productionSymptom: 'Why did our payment microservice take 3.2 seconds to serve the first 100 requests right after deployment, but later processed 60,000 req/sec in 0.4ms? This is caused by the JIT compilation lifecycle: cold bytecode interpretation transitioning into Tier 4 C2 optimized native assembly.',
        codeExample: {
          title: 'PaymentProcessor.java',
          code: `package com.bank.payment;

public class PaymentProcessor {
    public static void main(String[] args) {
        double amount = 150.0;
        boolean approved = processTransaction(amount);
        System.out.println("Status: " + (approved ? "SUCCESS" : "DECLINED"));
    }

    private static boolean processTransaction(double amount) {
        return amount > 0 && amount <= 5000.0;
    }
}`,
        },
        interviewTip: 'Why does Java use an intermediate bytecode instead of compiling directly to machine instructions like C++? It enables platform portability and allows runtime profiling and adaptive JIT optimizations that can outperform static compilers.',
        diagramState: 'write-code',
      },
      {
        id: 'step-2',
        title: 'javac Compiles to Bytecode',
        subtitle: 'Lexical analysis, AST parsing, and code generation',
        type: 'concept',
        content: `When you invoke \`javac PaymentProcessor.java\`, the Java compiler parses your source text into an Abstract Syntax Tree (AST), performs type checking, applies compile-time constant folding, and outputs a \`.class\` file.

The \`.class\` file is a compact binary stream structured with strict specifications. The first four bytes of any valid Java class file are always the hexadecimal magic number **\`0xCAFEBABE\`**.

The file contains the **Constant Pool** (string literals, class names, method signatures), field descriptions, and method bytecode instructions like \`aload\`, \`invokevirtual\`, and \`ireturn\`.`,
        keyIdea: 'The javac compiler performs syntax verification and type checking, generating standard .class binary files starting with magic bytes 0xCAFEBABE.',
        codeExample: {
          title: 'Terminal / javap Bytecode Disassembly',
          code: `// Disassemble bytecode using javap -c:
$ javap -c PaymentProcessor.class

Compiled from "PaymentProcessor.java"
public class com.bank.payment.PaymentProcessor {
  public static void main(java.lang.String[]);
    Code:
       0: ldc2_w        #7   // double 150.0d
       3: dstore_1
       4: dload_1
       5: invokestatic  #9   // Method processTransaction:(D)Z
       8: istore_3
       9: getstatic     #15  // Field java/lang/System.out:Ljava/io/PrintStream;
      12: iload_3
      13: ifeq          21
      ...
}`,
        },
        interviewTip: 'What is the Constant Pool in a .class file? It acts as a symbol table containing literal values (strings, ints), symbolic references to classes, interfaces, field names, and method descriptors.',
        cliInspection: {
          command: 'javap -c -v com.bank.payment.PaymentProcessor',
          output: `0: ldc2_w        #7   // double 150.0d\n3: dstore_1\n4: dload_1\n5: invokestatic  #9   // Method processTransaction:(D)Z\n8: istore_3`,
          explanation: 'Disassembles class constant pool and operand stack instructions. Note how dload_1 loads from the local variable array onto the operand stack, and invokestatic dispatches statically.',
        },
        diagramState: 'compile-bytecode',
      },
      {
        id: 'step-3',
        title: 'ClassLoader Hierarchy',
        subtitle: 'Bootstrap, Platform, and Application ClassLoaders',
        type: 'concept',
        content: `When you execute \`java PaymentProcessor\`, the Java Virtual Machine starts up and initializes the **ClassLoader subsystem**.

Class loading in Java strictly obeys the **Parent Delegation Model**. When a class needs to be loaded, the request is delegated upward to the parent ClassLoader before the current loader attempts to find it:
1. **Bootstrap ClassLoader**: Loads core JDK classes (\`java.lang.*\`, \`java.util.*\`) from \`lib/modules\`.
2. **Platform ClassLoader**: Loads extended Java SE platform modules.
3. **Application (System) ClassLoader**: Loads user classes and dependencies defined on your application classpath (\`-cp\`).`,
        keyIdea: 'The Parent Delegation Model ensures security and prevents malicious replacement of core Java classes like java.lang.String.',
        codeExample: {
          title: 'ClassLoaderInspection.java',
          code: `public class ClassLoaderInspection {
    public static void main(String[] args) {
        // Application ClassLoader
        System.out.println(ClassLoaderInspection.class.getClassLoader());
        // Prints: jdk.internal.loader.ClassLoaders$AppClassLoader

        // Platform ClassLoader
        System.out.println(java.sql.Driver.class.getClassLoader());
        // Prints: jdk.internal.loader.ClassLoaders$PlatformClassLoader

        // Bootstrap ClassLoader (represented by null in Java)
        System.out.println(String.class.getClassLoader());
        // Prints: null
    }
}`,
        },
        interviewTip: 'Why does String.class.getClassLoader() return null? Because the Bootstrap ClassLoader is written in native C/C++ inside the JVM, not Java code, so null denotes the native bootstrap root.',
        microCheck: {
          question: 'What happens if a developer creates a custom class named java.lang.String and puts it in the application classpath?',
          options: [
            'The custom String overrides the standard JDK String',
            'The Parent Delegation Model asks Bootstrap ClassLoader first, which loads the genuine JDK String and ignores the duplicate',
            'The JVM crashes immediately with a LinkageError at compile-time',
          ],
          answerIndex: 1,
          explanation: 'Because ClassLoaders delegate to their parent first, the root Bootstrap ClassLoader always resolves java.lang.String from the JDK runtime modules, protecting core runtime security.',
        },
        diagramState: 'classloader-load',
      },
      {
        id: 'step-4',
        title: 'Bytecode Verification & Linking',
        subtitle: 'Preventing memory corruption before execution',
        type: 'solution',
        content: `Before the JVM executes any loaded bytecode, the **Bytecode Verifier** rigorously analyzes the code stream. This is a critical security barrier that protects the host operating system.

The verifier confirms that:
- Variable types match expected method parameters
- Stack does not overflow or underflow
- Private and protected class access rules are not violated
- Type casting operations are valid and safe
- No raw memory pointer arithmetic is attempted

Once verified, the class undergoes **Preparation** (allocating static fields with default values) and **Resolution** (converting symbolic references to direct memory addresses).`,
        keyIdea: 'Bytecode verification guarantees memory safety and sandbox integrity before any instruction is passed to the execution engine.',
        interviewTip: 'Can you disable the bytecode verifier? Yes, using -noverify (or -Xverify:none), but it is deprecated and dangerous in production as it exposes the JVM to arbitrary memory exploits.',
        diagramState: 'verify-execute',
      },
      {
        id: 'step-5',
        title: 'Execution Engine: Interpreter & JIT',
        subtitle: 'From slow line-by-line interpretation to lightning-fast native assembly',
        type: 'insight',
        content: `Modern HotSpot JVMs (Java 17–25+) execute code through a sophisticated pipeline called **Tiered Compilation (Levels 0–4)**:

- **Level 0 (Interpreter)**: Starts executing bytecode immediately line by line with zero compilation delay, gathering invocation and backedge profiling counters.
- **Levels 1–3 (C1 Client Compiler)**: Compiles native code quickly. Level 1 produces simple native code; Level 2 adds basic profiling; Level 3 instruments full profiling counters (branch frequencies, type feedback).
- **Level 4 (C2 Server Compiler / Graal)**: When a method crosses the hot threshold (~10,000 calls), C2 applies aggressive speculative optimizations: method inlining, loop unrolling, escape analysis, and SIMD vectorization.

Two critical runtime mechanics to master:
1. **On-Stack Replacement (OSR)**: If a long loop runs inside the interpreter, HotSpot compiles the loop mid-execution and switches the running stack frame to native code without waiting for the method to exit!
2. **Deoptimization (Uncommon Traps)**: If a speculative assumption breaks (e.g., a polymorphic call site suddenly receives a second subclass), C2 bails out at a safe point and falls back to the interpreter.`,
        keyIdea: 'Tiered JIT compilation dynamically transitions code from Level 0 Interpreter through C1 to Level 4 C2 optimizations with OSR and graceful deoptimization.',
        cliInspection: {
          command: 'jcmd <pid> Compiler.codelist',
          output: `124  4       com.bank.payment.PaymentProcessor::processTransaction (18 bytes)\n125  3       java.lang.String::equals (84 bytes)`,
          explanation: 'Inspects active compiled native methods inside the JVM Code Cache, showing compilation tier (Level 3 vs Level 4 C2).',
        },
        codeExample: {
          title: 'JVM Optimization Flags',
          code: `# Inspect Tiered Compilation and inlined methods:
java -XX:+PrintCompilation -XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining PaymentProcessor

# Common outputs:
# 123  3       java.lang.String::charAt (29 bytes)
# 124  4       com.bank.payment.PaymentProcessor::processTransaction (18 bytes)`,
        },
        interviewTip: 'What is Method Inlining in the JIT compiler? The compiler replaces the method call overhead with the actual body of the called method, eliminating call-stack overhead and enabling further optimizations.',
        diagramState: 'jit-compile',
      },
      {
        id: 'step-6',
        title: 'Stack vs Heap: Runtime Data Areas',
        subtitle: 'Where threads work and objects reside',
        type: 'trade-off',
        content: `While your code executes, the JVM organizes system memory into distinct Runtime Data Areas:

- **JVM Stack (Per-Thread)**: Each thread has its own private call stack. Every method invocation pushes a new **Stack Frame** storing local primitive variables, method arguments, and partial operands. When the method returns, its frame is immediately popped and freed.
- **Heap Memory (Shared)**: All class instances (objects) and arrays are allocated on the central Heap. The heap is accessible by all threads and managed automatically by the **Garbage Collector**.
- **Metaspace (Native)**: Stores class metadata, constant pool, and method tables in native OS memory (since Java 8, replacing PermGen).`,
        keyIdea: 'Local primitives and object references live on the thread stack; the actual objects always live on the shared heap.',
        codeExample: {
          title: 'MemoryAllocation.java',
          code: `public void executeOrder() {
    int orderId = 402;                // Primitive lives in Stack Frame
    Order order = new Order(orderId); // Reference 'order' on Stack;
                                      // new Order() object on Heap
    order.process();
} // Method exits: Stack Frame popped. 'order' reference gone.
  // The Order object on the Heap is now eligible for Garbage Collection.`,
        },
        interviewTip: 'What error occurs when Stack memory runs out vs Heap memory? Stack overflow causes java.lang.StackOverflowError (common with infinite recursion). Heap exhaustion causes java.lang.OutOfMemoryError: Java heap space.',
        diagramState: 'memory-stack-heap',
      },
      {
        id: 'step-7',
        title: 'Recap: The Complete Lifecycle',
        subtitle: 'The full execution pipeline from source to machine code',
        type: 'recap',
        content: `In summary, running Java involves:
1. **Source Code**: Human readable \`.java\` files.
2. **javac Compiler**: Emits portable, type-checked \`.class\` bytecode with \`0xCAFEBABE\` header.
3. **ClassLoader**: Loads classes using Parent Delegation and validates bytecode safety.
4. **JVM Execution Engine**: Interprets immediately, detects hot code paths, and compiles to native machine code via C1/C2 JIT.
5. **Memory Management**: Thread-isolated stacks for execution frames; shared GC-managed heap for object allocations.

Now you understand the machine beneath your Spring Boot services!`,
        keyIdea: 'Java combines the speed of rapid interpretation with the raw power of JIT machine compilation and automated garbage collection.',
        interviewTip: 'In production microservices, why do we observe higher latency during the first 2-5 minutes after deployment? This is the "JIT Warm-up Period" where classes are being loaded and the JIT compiler is profiling code before compiling to optimized native assembly.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'oop-pillars',
    slug: 'oop-pillars',
    title: 'OOP: The Four Pillars in Enterprise Java',
    subtitle: 'Master Encapsulation, Inheritance, Polymorphism, and Abstraction with clean production patterns.',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '15 min',
    difficulty: 'Beginner',
    youllLearn: [
      'Encapsulation and immutability using Java Records and private access',
      'Inheritance and the dangers of fragile base classes',
      'Runtime polymorphism and dynamic method dispatch in the JVM',
      'Interfaces vs Abstract Classes in Java 8 to 21 (default & private methods)',
      'The "Composition over Inheritance" design principle in enterprise microservices',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Encapsulation: Protecting Invariants',
        subtitle: 'Data hiding and defensive copying',
        type: 'concept',
        content: `**Encapsulation** is the bundling of data and the methods that operate on that data into a single cohesive unit, while restricting direct external access to internal state.

In production systems, encapsulation is not merely writing getters and setters. True encapsulation ensures that an object always remains in a **valid state (invariant)**. Modifiers like \`private\`, \`protected\`, and package-private enforce these boundaries.

In modern Java 16+, **Java Records** provide transparent, immutable data carriers where encapsulation is built into the language definition.`,
        keyIdea: 'Encapsulation enforces domain invariants by controlling how state transitions occur, preventing corruption by external callers.',
        codeExample: {
          title: 'BankAccount.java (Enforcing Invariants)',
          code: `public class BankAccount {
    private final String accountNumber;
    private double balance; // Protected from external modification

    public BankAccount(String accountNumber, double initialDeposit) {
        if (accountNumber == null || accountNumber.isBlank()) {
            throw new IllegalArgumentException("Invalid account number");
        }
        if (initialDeposit < 0) {
            throw new IllegalArgumentException("Initial deposit cannot be negative");
        }
        this.accountNumber = accountNumber;
        this.balance = initialDeposit;
    }

    public synchronized void withdraw(double amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalStateException("Insufficient funds or invalid amount");
        }
        this.balance -= amount;
    }

    public double getBalance() { return balance; }
}`,
        },
        interviewTip: 'What is Defensive Copying in encapsulation? When returning or accepting mutable objects (like Date or List), create a new copy to prevent callers from modifying internal object state behind your back.',
        diagramState: 'encapsulation',
      },
      {
        id: 'step-2',
        title: 'Inheritance: Code Reuse & Hierarchy',
        subtitle: 'The IS-A relationship and its architectural traps',
        type: 'trade-off',
        content: `**Inheritance** allows a subclass to inherit fields and methods from a superclass using the \`extends\` keyword, establishing an **IS-A** relationship.

While inheritance promotes code reuse, overusing deep inheritance trees leads to the **Fragile Base Class problem**: modifying a superclass method unexpectedly breaks subclasses across your application.

Java does not support multiple class inheritance (to avoid the famous diamond problem), but allows multiple interface implementation. Modern Java 17 introduced **Sealed Classes** (\`sealed\` and \`permits\`) to strictly control which classes can extend a base type.`,
        keyIdea: 'Use inheritance only when a true IS-A semantic relationship exists; otherwise favor composition.',
        codeExample: {
          title: 'Modern Sealed Class Hierarchy (Java 17+)',
          code: `// Strictly control inheritance with sealed classes
public sealed interface PaymentMethod permits CreditCard, PayPal, ApplePay {
    boolean processPayment(double amount);
}

public final class CreditCard implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        // Authorize with Global Payments HPP SDK
        return true;
    }
}

public final class PayPal implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        return true;
    }
}

public final class ApplePay implements PaymentMethod {
    @Override
    public boolean processPayment(double amount) {
        return true;
    }
}`,
        },
        interviewTip: 'What are Sealed Classes in Java 17? Sealed classes allow a class or interface to explicitly declare which permitted subclasses are allowed to extend or implement it, enabling exhaustive switch pattern matching.',
        diagramState: 'inheritance',
      },
      {
        id: 'step-3',
        title: 'Polymorphism: Dynamic Method Dispatch',
        subtitle: 'One interface, multiple runtime implementations',
        type: 'solution',
        content: `**Polymorphism** ("many forms") enables treating objects of different subclasses through a common parent reference.

There are two primary types of polymorphism in Java:
1. **Compile-time (Static) Polymorphism**: Method Overloading (same method name, different parameter signatures evaluated at compile time).
2. **Runtime (Dynamic) Polymorphism**: Method Overriding (subclass overrides parent method with \`@Override\`).

At runtime, the JVM uses the **vtable (virtual method table)** to dynamically dispatch calls to the actual runtime class instance, regardless of the reference type held by the caller.`,
        keyIdea: 'Runtime polymorphism decouples callers from concrete implementations, allowing you to add new features without altering existing business logic.',
        codeExample: {
          title: 'PolymorphicPaymentService.java',
          code: `@Service
public class OrderCheckoutService {
    // Caller depends on the abstraction PaymentMethod, not CreditCard or PayPal
    public void checkout(PaymentMethod paymentMethod, double totalAmount) {
        System.out.println("Initiating checkout...");
        // JVM dynamically dispatches to the correct subclass at runtime!
        boolean success = paymentMethod.processPayment(totalAmount);
        if (!success) {
            throw new PaymentFailedException("Transaction declined");
        }
    }
}`,
        },
        interviewTip: 'How does the JVM resolve runtime polymorphism under the hood? The JVM maintains a Virtual Method Table (vtable) per loaded class with function pointers to method code. When invokevirtual executes, it indexes into the runtime object’s vtable.',
        diagramState: 'polymorphism',
      },
      {
        id: 'step-4',
        title: 'Abstraction: Contracts Over Details',
        subtitle: 'Abstract classes vs Interfaces in modern Java',
        type: 'insight',
        content: `**Abstraction** hides complex implementation details and exposes only the essential behavioral contract to the consumer.

In Java:
- **Interfaces**: Define a pure behavioral contract (\`public abstract\` methods). Starting in Java 8, interfaces can provide \`default\` and \`static\` methods. Java 9 added \`private\` helper methods.
- **Abstract Classes**: Can hold mutable instance state, constructors, and partially implemented template methods, but classes are limited to single inheritance.

In modern Spring microservices, we almost exclusively code against interfaces to allow mock testing, dynamic proxies, and painless swapping of cloud adapters.`,
        keyIdea: 'Program to an interface, not an implementation (Dependency Inversion Principle).',
        codeExample: {
          title: 'InterfaceDefaultMethods.java',
          code: `public interface NotificationService {
    void sendNotification(String userId, String message);

    // Default method added in Java 8: Backward-compatible extension
    default void sendUrgentAlert(String userId, String message) {
        sendNotification(userId, "[URGENT] " + message);
        logAuditTrail(userId);
    }

    // Private helper method in interface (Java 9+)
    private void logAuditTrail(String userId) {
        System.out.println("Audit log created for user: " + userId);
    }
}`,
        },
        interviewTip: 'When would you choose an Abstract Class over an Interface? Choose an abstract class when you need to share code (like common constructors or mutable instance state) among closely related classes. Use interfaces to define capability contracts across unrelated classes.',
        diagramState: 'abstraction',
      },
      {
        id: 'step-5',
        title: 'Recap: The OOP Architecture Blueprint',
        subtitle: 'Summary of the four pillars',
        type: 'recap',
        content: `When building enterprise microservices:
- **Encapsulate** data to preserve business invariants.
- **Inherit** with caution; prefer composition to prevent fragile hierarchies.
- Leverage **Polymorphism** to keep services open for extension but closed for modification (OCP).
- Define clean **Abstractions** through interfaces to build modular, testable systems.`,
        keyIdea: 'Clean OOP yields modular, testable, and maintainable software that can scale to millions of users.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'memory-and-gc',
    slug: 'memory-and-gc',
    title: 'Memory Model & Garbage Collection',
    subtitle: 'Where objects live, how generations age, and how the G1 GC collects garbage with minimal pause.',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '12 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The generational hypothesis: why 98% of objects die young',
      'Eden, Survivor (S0/S1), and Tenured Old Generation memory pools',
      'Minor Young GC vs Major / Full GC mechanics',
      'Modern GC algorithms: G1 GC, ZGC, and Parallel GC',
      'How to detect and eliminate Java memory leaks in production',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Generational Hypothesis',
        subtitle: 'Why the JVM splits the Heap into generations',
        type: 'concept',
        content: `Empirical research across thousands of enterprise Java applications revealed two universal facts known as the **Weak Generational Hypothesis**:
1. Most objects die shortly after allocation (e.g. temporary strings, local DTOs, stream iterators).
2. Objects that survive multiple garbage collection cycles tend to remain alive for a very long time (e.g. caches, Spring singletons, connection pools).

Scanning the entire heap on every collection cycle would cause unacceptable Stop-The-World (STW) pauses. To optimize this, the JVM divides Heap memory into:
- **Young Generation**: Eden + Survivor Spaces (S0 and S1)
- **Old (Tenured) Generation**: Long-lived objects`,
        keyIdea: 'The Generational Hypothesis allows the JVM to focus high-speed collections on the Young Gen where 95%+ of objects are already dead.',
        diagramState: 'eden-alloc',
      },
      {
        id: 'step-2',
        title: 'Minor GC: The Young Generation Cycle',
        subtitle: 'Fast copying collector between Eden and Survivor spaces',
        type: 'solution',
        content: `When your application calls \`new Object()\`, it is allocated in the **Eden space** of the Young Generation.

When Eden fills up, the JVM triggers a **Minor GC**:
1. The collector halts application threads briefly (Stop-The-World).
2. It traces live references starting from **GC Roots** (active thread stack variables, static fields, JNI pointers).
3. Live objects in Eden are copied to one of the **Survivor spaces (S0)**. Dead objects are discarded instantly.
4. On the next Minor GC, surviving objects from Eden and S0 are copied to **S1**, swapping roles (from-space and to-space).
5. Each surviving object increments its **Age counter**.`,
        keyIdea: 'Young GC uses a copying algorithm that runs in single-digit milliseconds because it only traces the tiny fraction of living objects.',
        diagramState: 'minor-gc',
      },
      {
        id: 'step-3',
        title: 'Object Promotion to Old Generation',
        subtitle: 'Crossing the Tenuring Threshold',
        type: 'insight',
        content: `Objects cannot remain in Survivor spaces indefinitely. Once an object survives a designated number of collection cycles—known as the **Tenuring Threshold** (typically 15 by default in HotSpot)—it is promoted to the **Old (Tenured) Generation**.

Large objects (like a massive 50MB byte array) may bypass the Young Gen entirely and get allocated directly into Old Generation to avoid the overhead of copying them between survivor spaces.

Old Generation memory is much larger than Young Gen, so collections here (**Major / Full GC**) take significantly longer and can degrade latency if not tuned properly.`,
        keyIdea: 'Objects that survive past the tenuring threshold migrate to Old Gen, where collections are less frequent but more expensive.',
        diagramState: 'promotion',
      },
      {
        id: 'step-4',
        title: 'G1 GC: Region-Based Low Latency',
        subtitle: 'The default garbage collector in Java 9 through 21',
        type: 'solution',
        content: `The **Garbage-First (G1) Collector** replaces fixed contiguous memory generations with a grid of thousands of equal-sized **Memory Regions** (typically 1MB to 32MB each).

Each region can dynamically act as Eden, Survivor, or Old generation.

G1 continuously monitors which regions contain the highest percentage of garbage ("Garbage-First"). When collection begins, G1 collects regions with the most reclaimable space within a user-configurable pause time goal (e.g., \`-XX:MaxGCPauseMillis=200\`).`,
        keyIdea: 'G1 GC breaks the heap into thousands of regions, enabling incremental concurrent collection with predictable pause times.',
        codeExample: {
          title: 'Production JVM GC Flags',
          code: `# Standard production flags for high-throughput microservice:
java -XX:+UseG1GC \\
     -Xms4g -Xmx4g \\
     -XX:MaxGCPauseMillis=100 \\
     -XX:G1ReservePercent=15 \\
     -XX:+ParallelRefProcEnabled \\
     -Xlog:gc*:file=/var/log/gc.log:time,uptime:filecount=5,filesize=20M \\
     -jar app.jar`,
        },
        interviewTip: 'What are the main GC Roots in Java? Active thread local variables, active Thread objects, static class fields, and JNI global references.',
        diagramState: 'major-gc',
      },
      {
        id: 'step-5',
        title: 'Memory Leaks & OutOfMemoryError in Java',
        subtitle: 'Why garbage collection cannot save you from bad code',
        type: 'trade-off',
        content: `A common myth is that garbage-collected languages cannot leak memory. In Java, a **Memory Leak** occurs when an unused object remains strongly referenced by an active GC Root, preventing the collector from reclaiming it.

Common causes:
- Static collections (e.g. \`static List\` or \`static Map\` growing indefinitely)
- Unclosed resources (Database connections, sockets, File streams)
- Improper \`equals()\` and \`hashCode()\` implementations in HashMaps
- Inner class references holding onto enclosing instances
- ThreadLocals not cleaned up via \`.remove()\` in thread pools!`,
        keyIdea: 'Unintended strong references prevent garbage collection, eventually exhausting the heap and throwing OutOfMemoryError.',
        codeExample: {
          title: 'ThreadLocalMemoryLeak.java',
          code: `public class SecurityContextFilter implements Filter {
    // Dangerous if used in a Tomcat thread pool!
    private static final ThreadLocal<UserSession> userContext = new ThreadLocal<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
        try {
            userContext.set(authenticate(req));
            chain.doFilter(req, res);
        } finally {
            // CRITICAL: Must clean up to avoid memory leak on reused threads!
            userContext.remove();
        }
    }
}`,
        },
        interviewTip: 'How do you diagnose a memory leak in production? Capture a heap dump on OutOfMemoryError using -XX:+HeapDumpOnOutOfMemoryError and analyze with Eclipse Memory Analyzer Tool (MAT) or JProfiler to find the dominant retainer tree.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'java-data-types',
    slug: 'java-data-types',
    title: 'Data Types, String Pool & Immutability',
    subtitle: 'Master the 8 primitives, wrapper classes, autoboxing pitfalls, and String pool memory allocation.',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '10 min',
    difficulty: 'Beginner',
    youllLearn: [
      'The 8 primitive types, byte sizes, and default values',
      'Primitive types vs Reference types in memory allocation',
      'The String Pool (String Interning) and why Strings are immutable',
      'Autoboxing and Unboxing pitfalls causing NullPointerExceptions',
      'Local Variable Type Inference (var) in modern Java (Java 10+)',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The 8 Primitive Data Types',
        subtitle: 'Stored directly by value on the execution stack',
        type: 'concept',
        content: `Java is not a pure object-oriented language because it preserves **8 primitive data types** for raw computational speed. Primitives store their binary values directly in the thread stack frame, avoiding heap allocation and object header overhead:

1. **Integral**: \`byte\` (8-bit), \`short\` (16-bit), \`int\` (32-bit), \`long\` (64-bit)
2. **Floating-point**: \`float\` (32-bit IEEE 754), \`double\` (64-bit IEEE 754)
3. **Character**: \`char\` (16-bit Unicode UTF-16 code point)
4. **Boolean**: \`boolean\` (\`true\` / \`false\`)

In enterprise financial applications (like banking and insurance), NEVER use \`float\` or \`double\` for currency arithmetic due to binary floating-point rounding errors! Always use **\`BigDecimal\`** or store monetary amounts as integer cents.`,
        keyIdea: 'Primitives store raw binary values directly on the stack for high speed; use BigDecimal for financial calculations.',
        codeExample: {
          title: 'FinancialPrecision.java',
          code: `// DANGEROUS: Floating-point precision error!
double amount1 = 0.1;
double amount2 = 0.2;
System.out.println(amount1 + amount2); // 0.30000000000000004!

// SAFE: BigDecimal for exact financial calculations
BigDecimal b1 = new BigDecimal("0.1");
BigDecimal b2 = new BigDecimal("0.2");
System.out.println(b1.add(b2)); // 0.3`,
        },
        interviewTip: 'Why should you never use double for money? Binary floating-point representation cannot exactly represent base-10 fractions like 0.1, accumulating rounding errors. Always use BigDecimal or integer cents.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'The String Pool & Immutability',
        subtitle: 'Why String is final and how interning saves memory',
        type: 'insight',
        content: `In Java, **\`String\`** objects are completely immutable. Once created, their internal byte array cannot be altered.

Because strings constitute over 30% of typical application heap memory, the JVM maintains the **String Pool** (a specialized hash table in the heap):
- Literal declaration \`String s1 = "hello";\` checks the pool. If \`"hello"\` exists, it reuses the reference.
- Explicit creation \`String s2 = new String("hello");\` forcibly creates a new object in general heap memory outside the pool.
- \`==\` compares memory addresses; \`.equals()\` compares actual character contents.

**Why Immutability Matters**:
1. **Security**: Sensitive parameters (database URLs, passwords) cannot be modified maliciously after passing validation.
2. **Thread Safety**: Immutable strings can be shared across multiple concurrent threads with zero synchronization.
3. **Caching HashCode**: \`String\` caches its computed \`hashCode\`, making it the premier key choice for HashMaps.`,
        keyIdea: 'Strings are immutable and cached in the String Pool to guarantee thread safety, security, and fast hash lookups.',
        codeExample: {
          title: 'StringPoolComparison.java',
          code: `String s1 = "StandardLife";
String s2 = "StandardLife";
String s3 = new String("StandardLife");

System.out.println(s1 == s2);      // true (Both point to identical pool reference)
System.out.println(s1 == s3);      // false (s3 is a separate heap instance)
System.out.println(s1.equals(s3)); // true (Character sequence is identical)

// Explicit interning moves s3 into pool:
System.out.println(s1 == s3.intern()); // true`,
        },
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'Autoboxing, Unboxing & NullPointerExceptions',
        subtitle: 'Automatic conversion between primitives and Wrapper objects',
        type: 'trade-off',
        content: `Java automatically converts between primitives and their corresponding Wrapper objects (\`int\` <-> \`Integer\`, \`boolean\` <-> \`Boolean\`):
- **Autoboxing**: Primitive to Wrapper (\`Integer.valueOf(val)\`)
- **Unboxing**: Wrapper to Primitive (\`wrapper.intValue()\`)

**The Hidden Production Trap**:
When unboxing an \`Integer\` that is \`null\` into an \`int\`, the compiler silently inserts \`integer.intValue()\`, triggering an unexpected **\`NullPointerException\`**!

Always be cautious when mapping DTO fields or interacting with database entities where numeric columns can be \`null\`.`,
        keyIdea: 'Unboxing a null wrapper object triggers a silent NullPointerException at runtime.',
        codeExample: {
          title: 'AutoboxingNPE.java',
          code: `public class AutoboxingTrap {
    public static void main(String[] args) {
        Integer cachedPolicyId = getNullablePolicyId(); // returns null

        // THROWS java.lang.NullPointerException!
        // The bytecode compiles this to cachedPolicyId.intValue()
        int primitiveId = cachedPolicyId; 
    }

    private static Integer getNullablePolicyId() {
        return null;
    }
}`,
        },
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'exception-handling',
    slug: 'exception-handling',
    title: 'Exception Handling & Fault Tolerance',
    subtitle: 'Checked vs Unchecked exceptions, try-with-resources, and designing resilient enterprise error flows.',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '10 min',
    difficulty: 'Beginner',
    youllLearn: [
      'The Throwable class hierarchy: Error vs Exception',
      'Checked Exceptions vs Unchecked RuntimeExceptions',
      'Automatic resource management with try-with-resources (AutoCloseable)',
      'Designing domain-specific Custom Exception hierarchies',
      'Best practices: why you should never swallow exceptions',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Throwable Hierarchy',
        subtitle: 'Error vs Exception vs RuntimeException',
        type: 'concept',
        content: `All exceptional conditions in Java extend **\`java.lang.Throwable\`**, which branches into two fundamental roots:

1. **\`Error\`**: Fatal JVM-level issues that applications should never attempt to catch (e.g. \`OutOfMemoryError\`, \`StackOverflowError\`, \`VirtualMachineError\`).
2. **\`Exception\`**: Conditions that a reasonable application might want to catch:
   - **Checked Exceptions** (direct subclasses of \`Exception\`): Checked at compile-time (e.g. \`IOException\`, \`SQLException\`). The method signature must declare them via \`throws\` or handle them via \`try-catch\`.
   - **Unchecked Exceptions** (subclasses of \`RuntimeException\`): Not checked at compile time (e.g. \`NullPointerException\`, \`IllegalArgumentException\`, \`IllegalStateException\`). Represent programming or business logic flaws.`,
        keyIdea: 'Checked exceptions represent recoverable external conditions; RuntimeExceptions represent programming bugs or business rule violations.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'try-with-resources (AutoCloseable)',
        subtitle: 'Guaranteed resource cleanup without messy finally blocks',
        type: 'solution',
        content: `Before Java 7, closing database connections, files, or network streams required nested, error-prone \`finally\` blocks. If an exception was thrown in both the \`try\` block and the \`finally\` block, the \`finally\` exception swallowed the original business exception!

**\`try-with-resources\`** automatically closes any resource implementing **\`java.lang.AutoCloseable\`** or \`java.io.Closeable\` when the block exits:
- Resources are closed in **reverse order of their creation**.
- Any exception thrown during \`close()\` is captured as a **Suppressed Exception** attached to the primary root cause!`,
        keyIdea: 'try-with-resources guarantees leak-free cleanup of streams and connections while preserving root-cause exceptions.',
        codeExample: {
          title: 'TryWithResourcesModern.java',
          code: `// Database connection and Statement automatically closed in reverse order:
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement("SELECT * FROM policies WHERE id = ?")) {
    
    ps.setString(1, policyId);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            return mapToPolicy(rs);
        }
    }
} catch (SQLException ex) {
    log.error("Failed to fetch policy {}", policyId, ex);
    throw new DataAccessException("Persistence query failed", ex);
}`,
        },
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'Enterprise Custom Exception Design',
        subtitle: 'Creating clear, semantic business domain exceptions',
        type: 'recap',
        content: `In clean microservices:
- Do NOT throw raw generic \`Exception\` or \`RuntimeException\`.
- Create a clean hierarchy of **Domain Runtime Exceptions** with error codes and contextual parameters (e.g. \`PolicyNotFoundException\`, \`PaymentAuthorizationFailedException\`).
- Pair custom exceptions with Spring’s **\`@RestControllerAdvice\`** and \`@ExceptionHandler\` to serialize exceptions into RFC 7807 standard error payloads automatically!`,
        keyIdea: 'Domain-specific runtime exceptions provide clear telemetry and integrate seamlessly with global Spring exception handlers.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'object-headers-lilliput',
    slug: 'object-headers-lilliput',
    title: 'Object Headers, Compressed OOPs & TLAB',
    subtitle: 'Inside the Heap: Mark Word, Klass Pointer, Compact Object Headers (Project Lilliput), and lock-free TLAB allocation.',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '14 min',
    difficulty: 'Advanced',
    youllLearn: [
      'The exact 16-byte memory footprint of an empty new Object()',
      'The 64-bit Mark Word: hash code, GC age bits, biased lock state, and lock pointers',
      'How Compressed OOPs enable 32-bit pointers on 64-bit JVMs up to 32GB',
      'Compact Object Headers (Project Lilliput) in Java 24/25+ saving 10-20% memory',
      'TLAB (Thread-Local Allocation Buffer) lock-free bump-the-pointer allocation',
      'Using JOL (Java Object Layout) to inspect memory byte alignment',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The 16-Byte Mystery of new Object()',
        subtitle: 'Why an object with zero fields still consumes 16 bytes on the Heap',
        type: 'problem',
        productionSymptom: 'A high-throughput cache holding 50 million small objects ran out of memory on a 16GB server even though data fields were only 4 bytes each! Why does Java add 12-16 bytes of invisible overhead to every single object?',
        content: `In Java, you cannot allocate "just the fields". Every single object on the Heap is wrapped in an **Object Header**:

1. **Mark Word (64 bits / 8 bytes)**: Stores runtime metadata:
   - Identity Hash Code (computed lazily on first \`System.identityHashCode()\` call)
   - GC Generational Age bits (4 bits: values 0 to 15 before promotion to Old Gen)
   - Lock State bits (01: unlocked, 00: lightweight lock, 10: heavyweight monitor lock)
2. **Klass Word (32 or 64 bits)**: A pointer back to the object's metadata in Metaspace (\`java.lang.Class\`).
3. **8-Byte Alignment Padding**: The HotSpot JVM aligns all memory addresses to multiples of 8 bytes for efficient 64-bit CPU bus fetches. An empty object with 8B Mark Word + 4B Klass Word takes 12 bytes, padded to **16 bytes**.`,
        keyIdea: 'Every Java object carries a mandatory header consisting of a 64-bit Mark Word and a Klass Pointer, padded to 8-byte boundaries.',
        cliInspection: {
          command: 'java -jar jol-cli.jar internals java.lang.Object',
          output: `OFFSET  SIZE   TYPE DESCRIPTION                    VALUE\n      0     8        (object header: mark)          0x0000000000000001 (unlocked)\n      8     4        (object header: class)         0x00000ba0\n     12     4        (loss due to the next object alignment)\nInstance size: 16 bytes`,
          explanation: 'JOL shows the 8-byte Mark Word, 4-byte compressed Klass Word, and 4 bytes of alignment padding, totaling 16 bytes.',
        },
        diagramState: 'object-layout',
      },
      {
        id: 'step-2',
        title: 'Compressed OOPs & The 32GB Heap Ceiling',
        subtitle: 'How 32-bit pointers address up to 32GB of heap',
        type: 'concept',
        content: `On standard 64-bit CPUs, memory pointers take 8 bytes (64 bits). In a 10GB heap with millions of references, pointer overhead wastes gigabytes of memory.

HotSpot solves this using **Compressed OOPs** (\`-XX:+UseCompressedOops\`):
- Because all objects are aligned to 8-byte boundaries, the lowest 3 bits of every object address are always \`000\`.
- The JVM shifts 32-bit pointers right by 3 bits when storing them, and shifts left by 3 bits when reading.
- As a result, a 32-bit pointer can address $2^{32} \\times 8 \\text{ bytes} = \\mathbf{32\\text{ GB}}$ of heap!

If you set \`-Xmx33g\`, the JVM is forced to disable Compressed OOPs and switch to 64-bit pointers, instantly consuming ~30% more memory! Setting your heap to 31GB often stores more objects than setting it to 33GB.`,
        keyIdea: 'Compressed OOPs take advantage of 8-byte memory alignment to represent 64-bit addresses with 32-bit pointers up to 32GB.',
        codeExample: {
          title: 'CompressedOopsThreshold.sh',
          code: `# Inspect compressed OOP status in HotSpot:\njava -XX:+PrintFlagsFinal -version | grep -i UseCompressedOops\n\n# Rule of thumb for senior engineers:\n# Never set -Xmx between 32GB and 40GB; 31GB is usually more effective!`,
        },
        interviewTip: 'Why is a 31GB heap often better than a 33GB heap? Crossing 32GB disables Compressed OOPs, causing every object reference to jump from 4 bytes to 8 bytes, which shrinks usable data capacity.',
        diagramState: 'compressed-oops',
      },
      {
        id: 'step-3',
        title: 'Project Lilliput: Compact Object Headers',
        subtitle: 'The modern Java 24/25+ revolution saving 10-20% heap memory',
        type: 'solution',
        content: `For 25+ years, 64-bit Java objects had a 128-bit header (64-bit Mark Word + 64-bit/32-bit Klass Pointer).

**Project Lilliput (JEP 450)** revolutionizes object headers in modern Java:
- It collapses the Klass Pointer directly into the **Mark Word**, reducing the entire Object Header to a single **64-bit word (8 bytes)**!
- In future milestones, it will compress further to a **32-bit header (4 bytes)**.

This single architectural change immediately reduces total heap footprint by **10% to 20%** across enterprise applications with zero code changes required!`,
        keyIdea: 'Project Lilliput shrinks Java object headers from 16/12 bytes down to 8 bytes (and eventually 4 bytes), delivering massive free memory savings.',
        codeExample: {
          title: 'EnableCompactHeaders.sh',
          code: `# Enable compact 64-bit headers in Java 24+:\njava -XX:+UnlockExperimentalVMOptions -XX:+UseCompactObjectHeaders -jar microservice.jar`,
        },
        microCheck: {
          question: 'What is the primary benefit of Project Lilliput in modern Java runtimes?',
          options: [
            'It enables C++ style manual memory deallocation',
            'It shrinks object headers from 12-16 bytes down to 8 bytes, saving 10-20% heap space across millions of objects',
            'It disables garbage collection entirely for short-lived records',
          ],
          answerIndex: 1,
          explanation: 'Lilliput shrinks the header by packing class pointer metadata directly into unused bits of the mark word, saving billions of bytes in dense object collections.',
        },
        diagramState: 'lilliput-headers',
      },
      {
        id: 'step-4',
        title: 'TLAB: Lock-Free Bump-The-Pointer Allocation',
        subtitle: 'Why new in Java is as fast as C malloc without heap contention',
        type: 'insight',
        content: `If hundreds of concurrent threads all allocated memory from the same shared Heap, acquiring a global heap lock on every \`new\` would destroy multicore throughput.

HotSpot solves this with **TLAB (Thread-Local Allocation Buffer)**:
- Every thread is granted a private chunk of memory inside the **Eden Space** (~100KB to 1MB).
- When a thread allocates an object, it advances a simple local pointer: \`top += size\`. This **Bump-the-Pointer** allocation requires zero locks, zero CAS operations, and executes in a couple of CPU instructions!
- Only when a thread exhausts its private TLAB does it synchronize with the global heap to request a fresh TLAB.`,
        keyIdea: 'TLAB gives each thread a private allocation buffer in Eden space, allowing lock-free bump-the-pointer allocations.',
        cliInspection: {
          command: 'jcmd <pid> VM.flags -all | grep -i TLAB',
          output: `bool UseTLAB = true\nsize_t TLABSize = 0 (dynamically resized)\nintx TLABWasteTargetPercent = 1`,
          explanation: 'TLAB is enabled by default in all production JVMs. The JVM dynamically tunes buffer sizes based on each thread\'s allocation rate.',
        },
        diagramState: 'tlab-allocation',
      },
    ],
  },
  {
    id: 'escape-analysis',
    slug: 'escape-analysis',
    title: 'Escape Analysis & Scalar Replacement',
    subtitle: 'Dispelling the myth that all objects live on the Heap: C2 scalar replacement and lock elision.',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '12 min',
    difficulty: 'Advanced',
    youllLearn: [
      'The three escape states: GlobalEscape, ArgEscape, and NoEscape',
      'How HotSpot C2 proves an object never escapes a method boundary',
      'Scalar Replacement: decomposing objects into CPU registers and Stack slots',
      'Lock Elision: removing synchronized monitor locks from thread-confined objects',
      'Diagnosing escape analysis using JVM compiler flags',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Escape Analysis Myth',
        subtitle: 'Do all Java objects really live on the Heap?',
        type: 'problem',
        productionSymptom: 'A junior engineer avoided creating small immutable Record objects in a high-frequency trading loop, fearing that 10,000,000 allocations per second would drown the Garbage Collector in Eden space. Yet in production, GC pauses were 0ms! How did the JVM eliminate allocations completely?',
        content: `Junior developers often believe: *"In C++ you allocate on the stack, but in Java, every \`new\` creates an object on the Heap."*

In modern Java, **this is false!**

Through **Escape Analysis**, the HotSpot C2 compiler inspects the control-flow graph of your code to determine the scope of an object's reference. If an object never escapes outside the current method or thread, the JVM does NOT allocate it on the heap at all!`,
        keyIdea: 'Escape analysis proves whether an object reference escapes its creating method, allowing the JIT to eliminate heap allocations entirely.',
        codeExample: {
          title: 'NonEscapingObject.java',
          code: `public record Point(int x, int y) {}\n\npublic int calculateDistance() {\n    // This Point object is created, used, and discarded entirely within this method!\n    Point p = new Point(10, 20);\n    return p.x() + p.y();\n}`,
        },
        diagramState: 'escape-graph',
      },
      {
        id: 'step-2',
        title: 'The Three Escape States',
        subtitle: 'GlobalEscape, ArgEscape, and NoEscape',
        type: 'concept',
        content: `During C2 intermediate representation analysis, every object allocation is classified into one of three escape states:

1. **\`GlobalEscape\`**: The object escapes the method and thread (e.g. stored in a static field, returned from a method, or published to a queue). Must live on the Heap.
2. **\`ArgEscape\`**: The object is passed as an argument to another method, but that method does not store or publish it. It cannot be scalar replaced, but its locks can be optimized.
3. **\`NoEscape\`**: The object reference never leaves the executing method boundary! It is 100% thread-confined and temporary.`,
        keyIdea: 'Only NoEscape objects qualify for scalar replacement, transforming heap objects into raw primitive registers.',
        cliInspection: {
          command: 'java -XX:+UnlockDiagnosticVMOptions -XX:+PrintEscapeAnalysis PointDemo',
          output: `Point: NoEscape (eliminated)\nVector: ArgEscape\nCustomer: GlobalEscape (allocated on Heap)`,
          explanation: 'Prints the exact escape state determination made by the C2 compiler for every allocation site.',
        },
        diagramState: 'escape-states',
      },
      {
        id: 'step-3',
        title: 'Scalar Replacement & Lock Elision',
        subtitle: 'Decomposing objects into CPU registers with zero GC footprint',
        type: 'solution',
        content: `When an object is categorized as **\`NoEscape\`**, HotSpot applies two astonishing optimizations:

1. **Scalar Replacement**:
   The compiler dismantles the object into its individual scalar fields (primitives like \`int\`, \`double\`, or references).
   Instead of allocating an object on the heap, fields are placed directly into **CPU Registers** or the **Local Stack Frame**!
   No object header is created. No heap allocation occurs. Zero garbage is collected!

2. **Lock Elision (Synchronization Elimination)**:
   If code acquires a lock on a \`NoEscape\` object (e.g. using a legacy \`StringBuffer\` or \`Vector\` inside a local method), the JIT compiler completely deletes the \`monitorenter\` and \`monitorexit\` instructions!`,
        keyIdea: 'Scalar replacement breaks objects into CPU registers, eliminating object headers and garbage collection pauses entirely.',
        codeExample: {
          title: 'ScalarReplacementEquivalent.java',
          code: `// What you wrote:\npublic int compute() {\n    Point p = new Point(10, 20);\n    return p.x + p.y;\n}\n\n// What HotSpot C2 JIT actually compiles to machine code:\npublic int compute() {\n    int p_x = 10; // Placed directly in CPU register R1\n    int p_y = 20; // Placed directly in CPU register R2\n    return p_x + p_y; // Direct ADD instruction! No object!\n}`,
        },
        microCheck: {
          question: 'What happens to a NoEscape object during Scalar Replacement?',
          options: [
            'It is serialized into off-heap direct memory',
            'Its fields are decomposed directly into CPU registers or stack slots, and no heap object is ever created',
            'It is moved immediately to the Tenured Old Generation',
          ],
          answerIndex: 1,
          explanation: 'Scalar replacement dismantles the object into individual scalar primitives that live directly in hardware registers or stack frames, avoiding the heap entirely.',
        },
        diagramState: 'scalar-replacement',
      },
    ],
  },
  {
    id: 'zgc-vs-g1',
    slug: 'zgc-vs-g1',
    title: 'Modern Garbage Collection: G1 vs Generational ZGC',
    subtitle: 'Region evacuation STW pauses in G1GC vs colored pointers and load barriers in Generational ZGC (<1ms pauses).',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '15 min',
    difficulty: 'Advanced',
    youllLearn: [
      'Why traditional Stop-The-World (STW) pauses occur during region evacuation',
      'The architecture of G1GC: Eden, Survivor, Old Gen, and Humongous regions',
      'ZGC core innovation: Colored Pointers embedding GC metadata into 64-bit addresses',
      'How Load Barriers allow application threads to relocate objects concurrently',
      'Generational ZGC (Java 21+) achieving sub-millisecond pauses across terabyte heaps',
      'Real-world GC logging with -Xlog:gc* and jstat monitoring',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Stop-The-World Latency Barrier',
        subtitle: 'Why trading systems and real-time APIs cannot tolerate 100ms GC pauses',
        type: 'problem',
        productionSymptom: 'During peak market open, an algorithmic order router experienced 80ms p99 latency spikes that triggered connection timeouts on client sockets. Investigation showed that G1GC was pausing all application threads to evacuate Survivor and Old regions.',
        content: `Traditional garbage collectors (Parallel GC, CMS, and G1GC) rely on **Stop-The-World (STW)** phases:

When the collector needs to move live objects from one memory region to another (evacuation/compacting), it pauses all application threads.
Why? Because if an application thread reads or writes to an object while the GC is copying it to a new memory address, memory corruption or stale reads would occur!

In G1GC, pause times are bounded (e.g. \`-XX:MaxGCPauseMillis=200\`), but under high allocation rates, pause times can still spike to 50–200ms. Enter **ZGC**.`,
        keyIdea: 'Stop-The-World pauses occur because legacy collectors cannot safely let application threads access objects while they are being moved in memory.',
        cliInspection: {
          command: 'jstat -gcutil <pid> 1000',
          output: `S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     CGC    CGCT    GCT\n0.00  98.20  45.10  68.40  96.50  92.10   142    1.240     0    0.000     28    0.412   1.652`,
          explanation: 'Monitors Eden (E), Old Gen (O), Young GC count/time (YGC/YGCT), and Full GC count (FGC). Shows where memory pressure builds.',
        },
        diagramState: 'stw-barrier',
      },
      {
        id: 'step-2',
        title: 'ZGC Innovation: Colored Pointers & Load Barriers',
        subtitle: 'Moving objects concurrently while application threads continue running',
        type: 'solution',
        content: `**ZGC (Z Garbage Collector)** achieves max pause times of **under 1 millisecond** even on multi-terabyte heaps.

It does this through two foundational mechanisms:

1. **Colored Pointers**:
   ZGC embeds 4 bits of metadata directly inside the unused upper bits of 64-bit object reference pointers:
   - \`Finalizable\`: Object only reachable through finalizer
   - \`Remapped\`: Object has already been relocated to its new address
   - \`Marked0\` / \`Marked1\`: Marks live objects across concurrent mark phases

2. **Load Barriers (Self-Healing Reads)**:
   When your application thread reads an object reference (\`p.getName()\`), the JIT inserts an ultra-fast hardware check (the Load Barrier).
   If the pointer's color indicates that the object is being relocated, the thread itself updates the reference to the new memory location on-the-fly and continues running!`,
        keyIdea: 'ZGC uses Colored Pointers and self-healing Load Barriers to evacuate memory concurrently without stopping application threads.',
        codeExample: {
          title: 'EnableGenerationalZGC.sh',
          code: `# Enable Generational ZGC in Java 21+:\njava -XX:+UseZGC -XX:+ZGenerational -Xmx16g -Xlog:gc*:file=gc.log:time,uptime -jar app.jar`,
        },
        microCheck: {
          question: 'How does ZGC prevent Stop-The-World pauses when relocating objects in memory?',
          options: [
            'It never relocates objects, leaving memory permanently fragmented',
            'It uses colored pointer bits and load barriers that self-heal references on-the-fly when application threads read them',
            'It moves all objects to native off-heap storage using Project Panama',
          ],
          answerIndex: 1,
          explanation: 'ZGC tests the reference color on read via JIT load barriers. If an object is moving, the load barrier self-heals the pointer to the forward address immediately.',
        },
        diagramState: 'colored-pointers',
      },
    ],
  },
];
