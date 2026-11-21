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
        content: `The JVM Execution Engine uses a hybrid approach: **Tiered Compilation**.

1. **Interpreter**: Starts executing bytecode immediately line by line with zero compilation delay. This gives fast startup times.
2. **JIT (Just-In-Time) Compiler**: As methods are invoked repeatedly, the JVM tracks execution counters. Once a method crosses a compile threshold (e.g., 10,000 invocations), it is designated **"Hot Code"**.

Hot code is compiled by **C1 (Client Compiler)** for quick optimizations, and later by **C2 (Server Compiler)** with aggressive profiling: loop unrolling, dead code elimination, and method inlining directly into machine CPU instructions.`,
        keyIdea: 'Tiered JIT compilation dynamically compiles hot execution paths into optimized CPU instructions, allowing Java long-running server backends to match or exceed C++ performance.',
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
];
