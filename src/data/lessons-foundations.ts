import { Lesson } from '@/lib/types';

export const foundationsLessons: Lesson[] = [
  {
    id: 'how-java-runs',
    slug: 'how-java-runs',
    title: 'How Java Runs Your Code',
    subtitle: 'Trace source code compilation, bytecode verification, ClassLoader delegation, and HotSpot JIT execution on the JVM',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '21 min',
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
        title: 'Writing Java Source Code',
        subtitle: 'From human-readable ideas to disk',
        duration: '3 min',
        type: 'problem',
        content: `Java execution operates across three distinct architectural phases: Source Code (.java) -> Bytecode (.class) -> Native CPU Instructions.

In the software world, your written program is your **\`.java\` source code file**. 

Computers don't run Java text directly. Languages like C or Go translate code directly into native machine instructions for one specific processor (like an Intel x86 or Apple Silicon ARM chip). If you build a C program on a Mac, it won't run on Windows without being recompiled.

Java solved this with a famous promise: **"Write Once, Run Anywhere" (WORA)**. Instead of converting your code directly to one machine's hardware language, Java first translates your text into a universal intermediate language called **Java Bytecode**. Any computer equipped with the **Java Virtual Machine (JVM)** can then run that bytecode smoothly.`,
        keyIdea: 'Java achieves universal portability by compiling human-readable source code into intermediate bytecode rather than processor-specific machine code.',
        productionSymptom: 'Why did our payment microservice take 3.2 seconds to serve its first 100 requests right after deployment, but later sustained 60,000 req/sec at 0.4ms average latency across 24 concurrent worker threads? This warm-up curve reflects the JVM startup lifecycle: initial class loading, connection pool warm-up, DB query cache readiness, and the HotSpot JIT compiler transitioning hot paths from cold bytecode interpretation into Tier 4 C2 profile-guided native machine code.',
        codeExample: {
          language: 'java',
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
        interviewTip: 'Why does Java use intermediate bytecode instead of compiling directly to native machine code like C++? Bytecode provides complete portability across different operating systems and CPU architectures. It also allows the JVM to profile running code in real time and optimize frequently executed paths using Just-In-Time (JIT) compilation.',
        diagramState: 'write-code',
        diagramAlt: 'Architecture diagram illustrating PaymentProcessor.java: From human-readable ideas to disk.',
      },
      {
        id: 'step-2',
        title: 'javac Compiles to Bytecode',
        subtitle: 'Turning human words into universal bytecode',
        duration: '3 min',
        type: 'concept',
        content: `The javac compiler lowers high-level syntax trees into portable bytecode opcodes defined by the Java Virtual Machine Specification.

The tool that turns your Java words into universal instructions is **\`javac\` (the Java compiler)**.

When you run \`javac PaymentProcessor.java\`, the compiler:
1. **Checks your grammar and spelling**: Verifies syntax and makes sure variable types match.
2. **Generates universal notes**: Emits a compact binary file called \`PaymentProcessor.class\`.

Every single valid Java \`.class\` file starts with a famous 4-byte signature in hexadecimal: \`0xCAFEBABE\` (a fun coffee-themed magic number that tells the JVM "this is genuine Java bytecode!").

Inside this file sits the **Constant Pool** (a directory of every string, method name, and class reference your code uses) followed by compact bytecode instructions like \`iload\` (push integer), \`invokestatic\` (call method), and \`ireturn\` (return integer).`,
        keyIdea: 'The javac compiler validates your syntax and generates a universal binary .class file starting with the magic bytes 0xCAFEBABE.',
        codeExample: {
          language: 'bash',
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
        interviewTip: 'What is the Constant Pool in a Java .class file? It is a lookup table inside the bytecode that stores literal values (such as strings and numbers) and symbolic references to class names, field names, and method signatures.',
        cliInspection: {
          command: 'javap -c -v com.bank.payment.PaymentProcessor',
          output: `0: ldc2_w        #7   // double 150.0d\n3: dstore_1\n4: dload_1\n5: invokestatic  #9   // Method processTransaction:(D)Z\n8: istore_3`,
          explanation: 'Disassembles the class constant pool and bytecode instructions. Notice how dstore_1 saves a double to a local variable slot, and invokestatic invokes the helper method.',
        },
        diagramState: 'compile-bytecode',
        diagramAlt: 'Architecture diagram illustrating Terminal / javap Bytecode Disassembly: Turning human words into universal bytecode.',
      },
      {
        id: 'step-3',
        title: 'ClassLoader Hierarchy',
        subtitle: 'The 3-tier security gate before code runs',
        duration: '3 min',
        type: 'concept',
        content: `The ClassLoader subsystem enforces runtime security and modular namespace separation using parent-first delegation.

When you start your program with \`java PaymentProcessor\`, the JVM launches its **ClassLoader subsystem**, which loads \`.class\` files using this exact chain of command, called the **Parent Delegation Model**:

1. **Bootstrap ClassLoader (Federal Authority)**: The core root loader written in native C/C++. It loads core Java system classes (like \`java.lang.String\` and \`java.util.List\`).
2. **Platform ClassLoader (Regional Security)**: Loads extended Java SE platform modules and SQL drivers.
3. **Application ClassLoader (Airline Gate Agent)**: Loads the classes you wrote and third-party libraries on your project classpath (\`-cp\`).

**How Delegation Works**: When your app asks for a class, the Application ClassLoader doesn't immediately search its own folder. It asks its parent first, all the way to the Bootstrap ClassLoader. Only if parents can't find it does the child loader look!`,
        keyIdea: 'The Parent Delegation Model checks the parent loader first, ensuring malicious code cannot replace core system classes like java.lang.String.',
        codeExample: {
          language: 'java',
          title: 'ClassLoaderInspection.java',
          code: `public class ClassLoaderInspection {
    public static void main(String[] args) {
        // Application ClassLoader (loads your project code)
        System.out.println(ClassLoaderInspection.class.getClassLoader());
        // Prints: jdk.internal.loader.ClassLoaders$AppClassLoader

        // Platform ClassLoader (loads Java extensions/modules)
        System.out.println(java.sql.Driver.class.getClassLoader());
        // Prints: jdk.internal.loader.ClassLoaders$PlatformClassLoader

        // Bootstrap ClassLoader (the native C/C++ root, represented by null in Java)
        System.out.println(String.class.getClassLoader());
        // Prints: null
    }
}`,
        },
        interviewTip: 'Why does String.class.getClassLoader() return null? The Bootstrap ClassLoader is built directly into the native C/C++ core of the JVM rather than written as a Java object. In Java code, null represents this native bootstrap root.',
        microCheck: {
          question: 'What happens if a developer creates a custom class named java.lang.String and puts it on the application classpath?',
          options: [
            'The custom String overrides the standard JDK String',
            'The Parent Delegation Model asks the Bootstrap ClassLoader first, which loads the genuine JDK String and safely ignores the impostor',
            'The JVM crashes immediately with a LinkageError at compile-time',
          ],
          answerIndex: 1,
          explanation: 'Because ClassLoaders delegate to their parent first, the root Bootstrap ClassLoader always resolves java.lang.String from the JDK runtime modules, keeping core runtime security airtight.',
        },
        diagramState: 'classloader-load',
        diagramAlt: 'Architecture diagram illustrating ClassLoaderInspection.java: The 3-tier security gate before code runs.',
      },
      {
        id: 'step-4',
        title: 'Bytecode Verification & Linking',
        subtitle: 'The airport security scanner protecting your computer',
        duration: '3 min',
        type: 'solution',
        content: `Before you step onto an airplane, your luggage goes through an X-ray scanner to ensure no dangerous items sneak aboard. You wouldn't want someone bringing unverified, unsafe items into the cabin.

In Java, before any loaded bytecode is allowed to run, the **Bytecode Verifier** performs this exact safety inspection on the binary stream:

- It ensures code doesn't try to read memory outside its allowed bounds (preventing buffer overflows).
- It verifies that the execution stack doesn't overflow or underflow.
- It confirms that variable types match method parameter expectations.
- It checks that \`private\` methods and fields cannot be illegally accessed from the outside.

Once the safety scan passes, the class is **Linked**:
- **Preparation**: The JVM allocates memory for static fields and assigns their initial default values (e.g., \`0\` or \`null\`).
- **Resolution**: Symbolic names (like the text \`"System.out.println"\`) are translated into direct memory addresses so the CPU can find them quickly.`,
        keyIdea: 'Bytecode verification acts as an automated safety checkpoint that verifies type safety and stack constraints before any code executes.',
        interviewTip: 'Can you turn off the bytecode verifier? Technically yes, with flags like -noverify (or -Xverify:none), but this is deprecated and dangerous because it disables the JVM security barrier and exposes your system to memory corruption.',
        diagramState: 'verify-execute',
        diagramAlt: 'Architecture diagram illustrating The airport security scanner protecting your computer: The airport security scanner protecting your computer.',
      },
      {
        id: 'step-5',
        title: 'Interpreter and JIT Compilation',
        subtitle: 'From a live translator to a speed-printing press',
        duration: '3 min',
        type: 'insight',
        content: `Imagine traveling in a foreign country with a personal language guide. 
- At first, when someone speaks to you, the guide translates sentence-by-sentence in real time. You don't have to wait for them to translate an entire book before you understand the first greeting (**The Interpreter**).
- But if you repeat the exact same phrase 500 times—like "Thank you very much"—the guide writes down that single phrase phonetically on a laminated index card in your pocket. The next time you need it, you don't even ask the guide; you read it directly from your card at lightning speed (**The Just-In-Time / JIT Compiler**).

The HotSpot JVM combines both approaches through **Tiered Compilation (Levels 0–4)**:

- **Level 0 (Interpreter)**: Starts executing your bytecode immediately, line by line, with minimal startup overhead. While running, it counts how often each method and loop runs.
- **Levels 1–3 (C1 Client Compiler)**: Quickly compiles frequently used methods into basic native CPU machine code to speed things up.
- **Level 4 (C2 Server Compiler)**: When a method becomes "hot" (called thousands of times), C2 takes over. It studies how your code actually behaves and compiles ultra-optimized native machine code with loop unrolling, method inlining, and direct hardware instructions.

**Two cool superpowers of HotSpot**:
1. **On-Stack Replacement (OSR)**: If a loop runs 100,000 times inside a method, the JVM can compile that loop into native code right in the middle of execution without waiting for the method to finish!
2. **Deoptimization**: If the JVM made an optimistic guess that later turns out to be false, it gracefully bails out and safely drops back to the interpreter.`,
        keyIdea: 'Java starts fast with an interpreter, then automatically compiles frequently called "hot" code into native machine code using the JIT compiler.',
        cliInspection: {
          command: 'jcmd <pid> Compiler.codelist',
          output: `124  4       com.bank.payment.PaymentProcessor::processTransaction (18 bytes)\n125  3       java.lang.String::equals (84 bytes)`,
          explanation: 'Shows which methods the HotSpot JIT compiler has compiled into native machine code inside the Code Cache, along with their compilation tier (e.g. Tier 4 C2).',
        },
        codeExample: {
          language: 'bash',
          title: 'JVM Optimization Flags',
          code: `# Inspect Tiered Compilation and see which methods get inlined:
java -XX:+PrintCompilation -XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining PaymentProcessor

# Common console output format:
# 123  3       java.lang.String::charAt (29 bytes)
# 124  4       com.bank.payment.PaymentProcessor::processTransaction (18 bytes)`,
        },
        interviewTip: 'What is Method Inlining in the JIT compiler? It is when the compiler takes the body of a small, frequently called method and pastes it directly into the caller code, removing the overhead of making a method call.',
        diagramState: 'jit-compile',
        diagramAlt: 'Architecture diagram illustrating JVM Optimization Flags: From a live translator to a speed-printing press.',
      },
      {
        id: 'step-6',
        title: 'Stack and Heap Memory',
        subtitle: 'The chef\'s cutting board vs the central walk-in pantry',
        duration: '3 min',
        type: 'trade-off',
        content: `JVM memory is partitioned into thread-private call stacks and a globally shared heap.

In the JVM, memory is split the same way:
- **JVM Stack (Per-Thread)**: Each thread gets its own private call stack. Every time you call a method, a new **Stack Frame** is created holding your local variables and parameters. When the method finishes, the frame disappears immediately.
- **Heap Memory (Shared)**: All objects created with \`new\` live here. The heap is shared across all threads and automatically tidied up by the Garbage Collector.
- **Metaspace (Native OS Memory)**: Holds class definitions, constant pools, and method templates in host OS memory (replacing the old Java 7 PermGen).`,
        keyIdea: 'Method variables and references live on the thread Stack; objects reside on the shared Heap by default, unless eliminated via escape analysis scalar replacement or allocated off-heap using the Foreign Function & Memory (FFM) API.',
        codeExample: {
          language: 'java',
          title: 'MemoryAllocation.java',
          code: `public class MemoryAllocation {
    record Order(int id) {
        public void process() {}
    }

    public void executeOrder() {
        int orderId = 402;                // Primitive value stored directly in the Stack Frame
        Order order = new Order(orderId); // Reference 'order' sits on Stack;
                                          // The actual Order object sits on the shared Heap
        order.process();
    } // Method finishes: The Stack Frame is popped and 'order' reference disappears!
      // The Order object on the Heap is now unreferenced and eligible for Garbage Collection.
}`,
        },
        interviewTip: 'What is the difference between a StackOverflowError and an OutOfMemoryError? A StackOverflowError happens when a thread runs out of stack memory (frequently caused by infinite recursion or deep call stacks). An OutOfMemoryError happens when the shared heap has no room left to allocate new objects and the Garbage Collector cannot reclaim enough space.',
        diagramState: 'memory-stack-heap',
        diagramAlt: 'Architecture diagram illustrating MemoryAllocation.java: The chef\.',
      },
      {
        id: 'step-7',
        title: 'Java Execution Lifecycle Recap',
        subtitle: 'The full execution pipeline from source to machine code',
        duration: '3 min',
        type: 'recap',
        content: `Let's bring the whole picture together:

1. **Source Code (\`.java\`)**: You write clean, human-readable logic.
2. **Compiler (\`javac\`)**: Translates your source code into universal, verified bytecode in a \`.class\` file with the \`0xCAFEBABE\` header.
3. **ClassLoader**: Uses the Parent Delegation Model to safely load your classes without tampering with core Java classes.
4. **Bytecode Verifier**: Scans the code to enforce type and memory safety constraints before execution.
5. **Execution Engine**: Starts running right away with the Interpreter, then compiles hot code into native machine code with the C1/C2 JIT compiler.
6. **Memory Division**: Uses fast thread-private Stacks for method calls and a shared Heap for objects, kept tidy by the Garbage Collector.

Now you understand the powerful engine humming beneath every Java application!`,
        keyIdea: 'Java combines fast startup via interpretation, peak throughput via JIT compilation, and effortless safety via bytecode verification and garbage collection.',
        interviewTip: 'What is the "JIT Warm-up Period" in production services? Right after a new service version is deployed, the JVM is running cold bytecode through the interpreter while loading classes. Over the first few minutes, HotSpot profiles the workload and compiles hot paths into native machine code, causing performance to dramatically speed up and stabilize.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating The full execution pipeline from source to machine code: The full execution pipeline from source to machine code.',
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
    duration: '14 min',
    difficulty: 'Beginner',
    youllLearn: [
      'Encapsulation and immutability using Java Records and private access',
      'Inheritance and the dangers of fragile base classes',
      'Runtime polymorphism and dynamic method dispatch in the JVM',
      'Interfaces vs Abstract Classes in modern Java (default & private methods)',
      'The "Composition over Inheritance" design principle in enterprise microservices',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Encapsulation and Data Invariants',
        subtitle: 'The bank vault door for your data',
        duration: '3 min',
        type: 'concept',
        content: `Encapsulation conceals internal field representations behind accessor methods to enforce invariants.

In software, this protective wall is **Encapsulation**.

Encapsulation means bundling data (fields) and the rules that operate on that data (methods) inside a single class, while keeping internal details hidden behind \`private\` access. 

True encapsulation is not just generating mindless getters and setters for every field. It ensures that an object avoids invalid state transitions, preserving defined class invariants. If someone tries to deposit a negative amount or withdraw more than they have, the object rejects the action right away.

In modern Java 16+, **Java Records** make encapsulation even easier by providing compact, immutable data containers out of the box.`,
        keyIdea: 'Encapsulation keeps internal data private and forces all changes through validated methods, preventing corrupted states.',
        codeExample: {
          language: 'java',
          title: 'BankAccount.java (Enforcing Invariants)',
          code: `public class BankAccount {
    private final String accountNumber;
    private long balanceInCents; // Stored in minor currency units (cents) to eliminate floating-point error

    public BankAccount(String accountNumber, long initialDepositInCents) {
        if (accountNumber == null || accountNumber.isBlank()) {
            throw new IllegalArgumentException("Invalid account number");
        }
        if (initialDepositInCents < 0) {
            throw new IllegalArgumentException("Initial deposit cannot be negative");
        }
        this.accountNumber = accountNumber;
        this.balanceInCents = initialDepositInCents;
    }

    public synchronized void withdraw(long amountInCents) {
        if (amountInCents <= 0 || amountInCents > balanceInCents) {
            throw new IllegalStateException("Insufficient funds or invalid amount");
        }
        this.balanceInCents -= amountInCents;
    }

    public long getBalanceInCents() {
        return balanceInCents;
    }

    public String getAccountNumber() {
        return accountNumber;
    }
}`,
        },
        interviewTip: 'What is "Defensive Copying" in encapsulation? If your class stores or returns mutable objects (like a Date or a List), callers could modify those objects from the outside. Defensive copying means creating and returning a fresh copy so outsiders cannot tamper with your internal state.',
        diagramState: 'encapsulation',
        diagramAlt: 'Architecture diagram illustrating BankAccount.java (Enforcing Invariants): The bank vault door for your data.',
      },
      {
        id: 'step-2',
        title: 'Inheritance and Class Hierarchies',
        subtitle: 'Family genetics and the risk of tangled family trees',
        duration: '3 min',
        type: 'trade-off',
        content: `Think of family traits. A child inherits their parents' eye color or hair type without having to reinvent genetics from scratch. Similarly, a SportsCar IS-A Vehicle, so it naturally shares wheels, an engine, and brakes with all vehicles.

In Java, **Inheritance** lets a subclass reuse fields and methods from a superclass using the \`extends\` keyword.

While this sounds convenient, deep inheritance trees create a famous trap called the **Fragile Base Class problem**: if you change a single method in the parent class to fix a bug, you might accidentally break ten different subclasses scattered across your project!

To prevent chaotic inheritance:
1. Java allows extending only **one** class (single inheritance), avoiding confusing diamond-shaped family trees.
2. In modern Java 17+, **Sealed Classes** (\`sealed\` and \`permits\`) let a base class explicitly declare exactly which child classes are permitted to extend it.
3. **Composition over Inheritance**: In enterprise software, favor composition (HAS-A) over class inheritance (IS-A). Instead of creating deep inheritance hierarchies where subclasses inherit internal state and methods they do not need, assemble behavior by injecting specialized collaborator components. Composition provides loose coupling, clean test isolation, and flexible runtime behavior substitution.`,
        keyIdea: 'Use inheritance only when a genuine IS-A relationship exists; otherwise, prefer assembling smaller parts (composition).',
        codeExample: {
          language: 'java',
          title: 'Modern Sealed Class Hierarchy (Java 17+)',
          code: `// Strictly control inheritance with sealed classes
public sealed interface PaymentMethod permits CreditCard, PayPal, ApplePay {
    boolean processPayment(long amountInCents);
}

final class CreditCard implements PaymentMethod {
    @Override
    public boolean processPayment(long amountInCents) {
        // Authorize with credit card gateway
        return true;
    }
}

final class PayPal implements PaymentMethod {
    @Override
    public boolean processPayment(long amountInCents) {
        // Authorize with PayPal wallet
        return true;
    }
}

final class ApplePay implements PaymentMethod {
    @Override
    public boolean processPayment(long amountInCents) {
        // Authorize with Apple Pay biometric token
        return true;
    }
}`,
        },
        interviewTip: 'What are Sealed Classes in Java 17? Sealed classes allow a class or interface to declare explicitly which subclasses are allowed to extend or implement it, giving you tight control over your type hierarchy and enabling exhaustive pattern matching.',
        diagramState: 'inheritance',
        diagramAlt: 'Architecture diagram illustrating Modern Sealed Class Hierarchy (Java 17+): Family genetics and the risk of tangled family trees.',
      },
      {
        id: 'step-3',
        title: 'Polymorphism and Dynamic Dispatch',
        subtitle: 'One universal remote, many different devices',
        duration: '3 min',
        type: 'solution',
        content: `Polymorphism enables uniform method invocation across distinct subtypes via dynamic vtable dispatch.

In Greek, **Polymorphism** means "many forms". It lets you treat different objects through a common shared interface:

1. **Compile-Time (Static) Polymorphism**: **Method Overloading** (having methods with the same name but different parameters, resolved while compiling).
2. **Runtime (Dynamic) Polymorphism**: **Method Overriding** (a subclass implements a method from its parent with \`@Override\`).

At runtime, for class inheritance, the JVM indexes a **Virtual Method Table (vtable)** via \`invokevirtual\`. For interface references like \`PaymentMethod\`, it emits \`invokeinterface\` and optimizes dynamic dispatch via monomorphic inline caches or an \`itable\` (Interface Method Table), calling the specific payment logic without messy \`if-else\` checks!`,
        keyIdea: 'Polymorphism allows you to write code that interacts with a general interface, while the JVM dynamically calls the correct specific method at runtime.',
        codeExample: {
          language: 'java',
          title: 'PolymorphicPaymentService.java',
          code: `public class OrderCheckoutService {
    // The checkout service works with ANY PaymentMethod without caring about the details
    public void checkout(PaymentMethod paymentMethod, long totalAmountInCents) {
        System.out.println("Initiating checkout for amount in cents: " + totalAmountInCents);
        
        // The JVM dynamically calls the right subclass implementation at runtime!
        boolean success = paymentMethod.processPayment(totalAmountInCents);
        if (!success) {
            throw new IllegalStateException("Payment was declined by provider");
        }
    }
}`,
        },
        interviewTip: 'How does the JVM resolve runtime polymorphism under the hood? For class inheritance, invokevirtual indexes a fixed vtable offset. For interface polymorphism (invokeinterface), HotSpot optimizes dispatch using monomorphic inline caches, falling back to itable lookups when multiple implementing classes are encountered at runtime.',
        diagramState: 'polymorphism',
        diagramAlt: 'Architecture diagram illustrating PolymorphicPaymentService.java: One universal remote, many different devices.',
      },
      {
        id: 'step-4',
        title: 'Abstraction and Interface Contracts',
        subtitle: 'The car steering wheel and pedals',
        duration: '3 min',
        type: 'insight',
        content: `Think of driving a car. You sit down, turn the steering wheel, press the gas pedal, and the car moves. You don't need to know the fuel-air combustion ratio in cylinder 3, the exact electrical voltage in the battery, or the fluid dynamics of the transmission. The complex mechanical details are hidden behind a simple, intuitive driving interface.

In Java, **Abstraction** means exposing only the essential actions to the outside world while hiding the messy internal machinery:

- **Interfaces (\`interface\`)**: Pure contracts that say *"Here is what I can do, but I won't tell you how I do it."* Starting in Java 8, interfaces can also provide default fallback methods (\`default\`), and Java 9 added private helper methods.
- **Abstract Classes (\`abstract class\`)**: Partially finished blueprints that can hold shared fields and common setup code, but cannot be instantiated directly.

In enterprise software, coding against interfaces allows you to swap out implementations (like switching from an in-memory test database to a real cloud database) without changing any of your business logic.`,
        keyIdea: 'Abstraction defines clean, simple contracts through interfaces, hiding complicated implementation details from callers.',
        codeExample: {
          language: 'java',
          title: 'NotificationService.java',
          code: `public interface NotificationService {
    // The core contract method
    void sendNotification(String userId, String message);

    // Default method added in Java 8: Provides an out-of-the-box helper
    default void sendUrgentAlert(String userId, String message) {
        sendNotification(userId, "[URGENT] " + message);
        logAuditTrail(userId);
    }

    // Private helper method inside an interface (Java 9+)
    private void logAuditTrail(String userId) {
        System.out.println("Audit trail logged for alert sent to user: " + userId);
    }
}`,
        },
        interviewTip: 'When would you choose an Abstract Class over an Interface? Choose an abstract class when closely related classes need to share common internal state (fields) and constructors. Choose an interface when defining a capability contract that can be implemented by completely unrelated classes.',
        diagramState: 'abstraction',
        diagramAlt: 'Architecture diagram illustrating NotificationService.java: The car steering wheel and pedals.',
      },
      {
        id: 'step-5',
        title: 'Object Oriented Architecture Recap',
        subtitle: 'How the four pillars build strong applications',
        duration: '2 min',
        type: 'recap',
        content: `Here is how the four pillars work together to build reliable software:

1. **Encapsulation**: Put a lock on your data so unauthorized code cannot corrupt your object's internal state.
2. **Inheritance**: Share common features with care, but prefer assembling small components (composition) rather than building tall, fragile inheritance hierarchies.
3. **Polymorphism**: Write flexible code that works with a common interface, letting the JVM choose the right specific behavior at runtime.
4. **Abstraction**: Hide complicated internal machinery behind clear, simple interfaces so other developers can use your tools with ease.

Mastering these four principles is the secret to writing clean, maintainable enterprise systems!`,
        keyIdea: 'Clean OOP design produces modular, easy-to-test code that can grow gracefully as requirements change.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating How the four pillars build strong applications: How the four pillars build strong applications.',
      },
    ],
  },
  {
    id: 'memory-and-gc',
    slug: 'memory-and-gc',
    title: 'Memory Model & Garbage Collection',
    subtitle: 'Heap generation layout, young generation allocation, tenuring thresholds, and G1 GC region-based collection',
    moduleId: '01',
    moduleTitle: '01. Java Foundations',
    duration: '14 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The generational hypothesis: why 95%+ of objects die young',
      'Eden, Survivor (S0/S1), and Tenured Old Generation memory pools',
      'Minor Young GC vs Major / Full GC mechanics',
      'Modern GC algorithms: G1 GC, ZGC, and Parallel GC',
      'How to detect and eliminate Java memory leaks in production',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Generational Hypothesis',
        subtitle: 'Sticky notes vs filing cabinets',
        duration: '3 min',
        type: 'concept',
        content: `Think of the notes on your office desk:
- Most notes are quick reminders written on sticky notes (like a temporary phone number or a grocery item). Within ten minutes, you finish the task, crumple the sticky note, and toss it in the wastebasket.
- But a few important documents (like your birth certificate or a signed lease contract) survive for years. You file those into a permanent steel filing cabinet.

Decades of analyzing real-world Java applications revealed this exact same pattern, known as the **Weak Generational Hypothesis**:
1. **Most objects die very young**: Over 95% of objects (like temporary strings and method calculation results) are created, used for a brief duration, and rarely retained past minor GC.
2. **Objects that survive stay alive a long time**: The few objects that survive multiple cleaning passes (like database connection pools and application settings) tend to live as long as the application runs.

Instead of scanning gigabytes of memory every single second, the JVM divides the Heap into age groups:
- **Young Generation**: Holds brand new objects (Eden) and recent survivors (Survivor spaces S0 and S1).
- **Old (Tenured) Generation**: Holds long-lived survivor objects.`,
        keyIdea: 'Because 95%+ of objects die almost immediately, the JVM focuses high-speed cleanup sweeps on the Young Generation.',
        diagramState: 'eden-alloc',
        diagramAlt: 'Architecture diagram illustrating Sticky notes vs filing cabinets: Sticky notes vs filing cabinets.',
      },
      {
        id: 'step-2',
        title: 'Young Generation Minor GC',
        subtitle: 'The rapid cleanup of the nursery',
        duration: '3 min',
        type: 'solution',
        content: `Eden space acts as the primary allocation nursery where new objects are created via bump-the-pointer allocation. When the bin fills up:
1. The supervisor pauses the game for a split second (**Stop-The-World** pause).
2. The supervisor looks only for the toys the kids are actively holding in their hands (**GC Roots**—variables on the active thread stacks).
3. The toys still in use are gently moved to a side table (**Survivor space S0**). All the abandoned toys left on the floor are swept into the bin instantly!
4. The next time the bin fills, the supervisor sweeps toys from both Eden and S0 over to a second table (**Survivor space S1**), incrementing an age counter on each toy that survived.

This rapid cleanup is called a **Minor GC**. Because the collector only has to pick up the tiny handful of surviving toys rather than inspecting every dead toy, it finishes in just a couple of milliseconds!`,
        keyIdea: 'Minor GC uses a fast copying algorithm that sweeps dead objects from Eden and moves living objects between Survivor spaces in single-digit milliseconds.',
        diagramState: 'minor-gc',
        diagramAlt: 'Architecture diagram illustrating The rapid cleanup of the nursery: The rapid cleanup of the nursery.',
      },
      {
        id: 'step-3',
        title: 'Old Generation Object Promotion',
        subtitle: 'Graduating to the permanent archive',
        duration: '2 min',
        type: 'insight',
        content: `Objects cannot bounce between the two Survivor tables forever. 

Every time an object survives a Minor GC round, the JVM increases its age counter. When an object survives past a set limit—called the **Tenuring Threshold** (typically up to 15 rounds in HotSpot)—the JVM decides: *"This object is here to stay."* It promotes the object into the **Old (Tenured) Generation**.

Very large objects (like a massive 50MB image buffer) can even skip the Young Generation entirely and go straight into Old Gen so the JVM doesn't waste CPU time repeatedly copying them between survivor spaces.

Because the Old Generation is much larger, cleaning it (**Major GC / Full GC**) takes much longer. That is why keeping your memory healthy means letting temporary objects die peacefully in the Young Generation!`,
        keyIdea: 'Objects that survive multiple Young GC cycles graduate to the Old Generation, where collections are less frequent but take longer.',
        diagramState: 'promotion',
        diagramAlt: 'Architecture diagram illustrating Graduating to the permanent archive: Graduating to the permanent archive.',
      },
      {
        id: 'step-4',
        title: 'G1 GC Region Architecture',
        subtitle: 'The checkerboard cleanup crew',
        duration: '3 min',
        type: 'solution',
        content: `Think of a giant warehouse floor. If you wait until the entire floor is messy before sweeping, you have to shut down the entire warehouse for hours to clean it. But what if you divide the floor into a grid of 2,000 equal square tiles? A cleaning crew can easily spot the tiles with the most empty soda cans, clean just those few tiles in 50 milliseconds, and let workers keep moving!

This is the brilliant idea behind the **Garbage-First (G1) Collector**, the default garbage collector in Java 9 through 21+:

- Instead of huge unbroken chunks of memory, G1 divides the entire heap into thousands of equal-sized **Regions** (from 1MB to 32MB each).
- Any region can act as Eden, Survivor, or Old Gen dynamically.
- G1 constantly tracks which regions hold the most garbage. When it's time to clean, it collects the dirtiest regions first (**"Garbage-First"**) within a target pause time that you specify (e.g. \`-XX:MaxGCPauseMillis=100\`).

**Modern GC algorithms**: HotSpot provides specialized garbage collection algorithms: **Parallel GC** emphasizes multi-threaded throughput, **G1 GC** maintains balanced pause times via region compaction, and **ZGC** provides concurrent sub-millisecond pauses for low-latency workloads.`,
        keyIdea: 'G1 GC slices heap memory into thousands of flexible regions, collecting the regions with the most garbage first to keep pause times predictable.',
        codeExample: {
          language: 'bash',
          title: 'Production JVM GC Flags',
          code: `# Standard production flags for a responsive microservice:
java -XX:+UseG1GC \\
     -Xms4g -Xmx4g \\
     -XX:MaxGCPauseMillis=100 \\
     -XX:G1ReservePercent=15 \\
     -XX:+ParallelRefProcEnabled \\
     -Xlog:gc*:file=/var/log/gc.log:time,uptime:filecount=5,filesize=20M \\
     -jar app.jar`,
        },
        interviewTip: 'What are the main GC Roots in Java? GC Roots are the starting points for finding live objects. They include local variables currently on active thread stacks, running Thread objects, static class fields, and native JNI pointers.',
        diagramState: 'major-gc',
        diagramAlt: 'Architecture diagram illustrating Production JVM GC Flags: The checkerboard cleanup crew.',
      },
      {
        id: 'step-5',
        title: 'Memory Leaks and OutOfMemoryError',
        subtitle: 'Why the garbage collector cannot save you from hoarding',
        duration: '3 min',
        type: 'trade-off',
        content: `A common myth among beginners is: *"Java has automatic garbage collection, so unintentional object retention causes memory leaks when strong references linger unnecessarily."*

In reality, a Java **Memory Leak** happens when you forget that an object is still attached to an active reference. The Garbage Collector only frees objects that nobody can reach. If you keep an old object tied to a static list or a long-lived cache, the collector assumes you still need it and refuses to throw it away!

**Common Beginner Memory Leaks**:
1. **Static Collections**: Adding items to a \`public static List\` that keeps growing forever.
2. **Unclosed Resources**: Forgetting to close database connections or network streams.
3. **Forgotten ThreadLocals**: Storing user session data in a \`ThreadLocal\` and forgetting to call \`.remove()\` when the request finishes on a reused thread pool.`,
        keyIdea: 'If your code keeps an active reference to an object you no longer need, the Garbage Collector cannot reclaim it, eventually causing an OutOfMemoryError.',
        codeExample: {
          language: 'java',
          title: 'ThreadLocalMemoryLeak.java',
          code: `public class SecurityContextFilter implements Filter {
    // A ThreadLocal associated with thread pool threads
    private static final ThreadLocal<UserSession> userContext = new ThreadLocal<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) {
        try {
            userContext.set(authenticate(req));
            chain.doFilter(req, res);
        } finally {
            // CRITICAL: Always clean up in a finally block!
            // Thread pool threads are reused, so uncleaned data causes a memory leak.
            userContext.remove();
        }
    }

    private UserSession authenticate(ServletRequest req) {
        return new UserSession("user-101", "AUTH_TOKEN");
    }
}`,
        },
        interviewTip: 'How do you diagnose a memory leak in production? Enable automatic heap dumps on failure with -XX:+HeapDumpOnOutOfMemoryError. When memory runs out, open the generated dump file in tools like Eclipse Memory Analyzer (MAT) or JProfiler to find which objects are hogging the heap.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating ThreadLocalMemoryLeak.java: Why the garbage collector cannot save you from hoarding.',
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
    duration: '9 min',
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
        title: 'Java Primitive Data Types',
        subtitle: 'Pocket change vs a bank safe deposit box',
        duration: '3 min',
        type: 'concept',
        content: `Think of carrying pocket change. When you have a quarter in your pocket, the coin itself is right there in your hand. You can spend it instantly without asking anyone for permission. But if you have valuable jewelry locked in a bank safety deposit box, you don't carry the jewelry in your pocket—you carry a small key that points to the box in the bank vault.

In Java:
- **Primitives (Pocket Change)**: When declared as local variables in methods, store their raw values directly in the thread stack frame. Primitive fields declared on objects live on the heap inside that object's memory layout. They take up tiny, fixed amounts of space and execute with blistering speed.
- **Objects (Safety Deposit Box)**: Live on the Heap, and your variable holds just the address reference pointing to it.

Java provides **8 primitive types**:
1. **Whole numbers**: \`byte\` (8-bit), \`short\` (16-bit), \`int\` (32-bit), \`long\` (64-bit)
2. **Decimals**: \`float\` (32-bit), \`double\` (64-bit)
3. **Characters**: \`char\` (16-bit UTF-16 code unit, \\u0000 to \\uffff; supplementary code points like emojis require a 32-bit surrogate pair of two chars)
4. **True/False**: \`boolean\` (represented as 1 byte in arrays, and compiled into 4 bytes on operand stack slots per JVMS §2.3.4)

**Crucial Financial Rule**: Avoid using \`float\` or \`double\` for monetary calculations! Because binary hardware cannot perfectly represent fractions like 0.1, rounding errors accumulate (e.g. \`0.1 + 0.2\` becomes \`0.30000000000000004\`). Standardize on \`BigDecimal\` or store amounts as whole cents!

**Local Variable Type Inference (var) in modern Java**: Java 10 introduced \`var\` for local variable declarations (\`var count = 10;\`, \`var message = "hello";\`). The compiler performs static type inference at compile time from the initializer expression while preserving full type safety.`,
        keyIdea: 'Primitives store raw values directly on the stack for speed; utilize BigDecimal for currency to avoid rounding errors.',
        codeExample: {
          language: 'java',
          title: 'FinancialPrecision.java',
          code: `import java.math.BigDecimal;

public class FinancialPrecision {
    public static void main(String[] args) {
        // DANGEROUS: Floating-point precision error!
        double amount1 = 0.1;
        double amount2 = 0.2;
        System.out.println(amount1 + amount2); // Prints: 0.30000000000000004!

        // SAFE: BigDecimal represents exact base-10 decimal currency
        BigDecimal b1 = new BigDecimal("0.1");
        BigDecimal b2 = new BigDecimal("0.2");
        System.out.println(b1.add(b2)); // Prints: 0.3
    }
}`,
        },
        interviewTip: 'Why should you avoid double or float for currency? Floating-point numbers use IEEE 754 binary scientific notation, which cannot represent base-10 decimal fractions like 0.1 exactly. Use BigDecimal or store values in integer cents.',
        diagramState: 'primitives-stack',
        diagramAlt: 'Architecture diagram illustrating FinancialPrecision.java: Pocket change vs a bank safe deposit box.',
      },
      {
        id: 'step-2',
        title: 'String Pool and Immutability',
        subtitle: 'The public book lending library',
        duration: '3 min',
        type: 'insight',
        content: `Think of a town public library. If 1,000 students all need to read the same classic novel for school, the town doesn't buy a printing press and print 1,000 separate brand-new books from scratch. Instead, they share copies from a central library shelf.

Because text strings make up over 30% of memory in typical Java applications, the JVM maintains the **String Pool** (a shared catalog of strings on the heap):

- When you write \`String s1 = "hello";\`, the JVM checks the pool first. If \`"hello"\` is already there, it reuses that exact reference instead of creating a new object!
- If you explicitly call \`String s2 = new String("hello");\`, you force the JVM to bypass the pool and create an extra duplicate on the heap.
- In Java, strings are **immutable** (their character sequences cannot be modified once instantiated). When you do \`str = str + " world"\`, you aren't changing the original string; you are creating an entirely new string.

**Why Immutability Matters**:
1. **Security**: Passwords and database connection URLs cannot be altered behind your back once validated.
2. **Thread Safety**: Multiple threads can read the same string at the same time without synchronization locks.
3. **Fast Map Lookups**: Because a string cannot change, its hash code remains stable across lookups, making it the ideal key for a \`HashMap\`.`,
        keyIdea: 'Strings are immutable and cached in the String Pool to save memory, protect security, and ensure thread safety.',
        codeExample: {
          language: 'java',
          title: 'StringPoolComparison.java',
          code: `public class StringPoolComparison {
    public static void main(String[] args) {
        String s1 = "JavaInternals";
        String s2 = "JavaInternals";
        String s3 = new String("JavaInternals");

        // == compares memory addresses:
        System.out.println(s1 == s2);      // true (both point to the same String Pool entry)
        System.out.println(s1 == s3);      // false (s3 was forced onto the general heap)

        // .equals() compares the actual text content:
        System.out.println(s1.equals(s3)); // true (the characters are identical)

        // intern() returns the canonical pool instance:
        System.out.println(s1 == s3.intern()); // true
    }
}`,
        },
        diagramState: 'string-pool-heap',
        diagramAlt: 'Architecture diagram illustrating StringPoolComparison.java: The public book lending library.',
      },
      {
        id: 'step-3',
        title: 'Autoboxing, Unboxing & NullPointerExceptions',
        subtitle: 'The surprise inside an empty gift box',
        duration: '3 min',
        type: 'trade-off',
        content: `Imagine gift boxes. If you have a shiny wrist watch (a primitive \`int\`), you can wrap it in a decorative gift box (an \`Integer\` object) so it can sit under the Christmas tree alongside other boxed gifts. Unwrapping the box gives you your watch back.

Java does this wrapping and unwrapping automatically:
- **Autoboxing**: Automatically converting a primitive into its wrapper object (e.g., \`int\` -> \`Integer\`).
- **Unboxing**: Automatically opening the wrapper to get the raw primitive back (e.g., \`Integer\` -> \`int\`).

**The Hidden Beginner Trap**:
What happens if someone hands you a beautifully wrapped gift box, but when you open it, the box is completely empty (\`null\`)? You can't put an invisible watch on your wrist!

In Java, if you try to assign an \`Integer\` that is \`null\` into a primitive \`int\`, the compiler invisibly calls \`.intValue()\` on that null reference, causing an instant \`NullPointerException\`! Exercise caution when reading nullable columns from a database or JSON payload.`,
        keyIdea: 'Unboxing an Integer wrapper that contains null triggers a silent, unexpected NullPointerException at runtime.',
        codeExample: {
          language: 'java',
          title: 'AutoboxingTrap.java',
          code: `public class AutoboxingTrap {
    public static void main(String[] args) {
        Integer cachedPolicyId = getNullablePolicyId(); // returns null

        // CRASH! Throws java.lang.NullPointerException
        // Under the hood, the compiler writes: cachedPolicyId.intValue()
        try {
            int primitiveId = cachedPolicyId;
            System.out.println("Policy ID: " + primitiveId);
        } catch (NullPointerException ex) {
            System.out.println("Caught NPE: cannot unbox null Integer!");
        }
    }

    private static Integer getNullablePolicyId() {
        return null; // Simulating a missing database value
    }
}`,
        },
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating AutoboxingTrap.java: The surprise inside an empty gift box.',
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
    duration: '8 min',
    difficulty: 'Beginner',
    youllLearn: [
      'The Throwable class hierarchy: Error vs Exception',
      'Checked Exceptions vs Unchecked RuntimeExceptions',
      'Automatic resource management with try-with-resources (AutoCloseable)',
      'Designing domain-specific Custom Exception hierarchies',
      'Best practices: why you should avoid swallowed exceptions',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'The Throwable Hierarchy',
        subtitle: 'A kitchen fire vs a missing ingredient',
        duration: '3 min',
        type: 'concept',
        content: `Think of cooking dinner in a restaurant kitchen:
- **Case 1: The oven explodes and the kitchen catches fire (an \`Error\`)**. This is a catastrophic disaster. You don't grab a spatula and keep cooking; you pull the fire alarm, evacuate the building, and shut down.
- **Case 2: You reach for garlic and realize the spice jar is empty (an \`Exception\`)**. This is an unexpected bump in the road, but it is recoverable. You catch the issue, substitute garlic powder, and finish serving dinner!

In Java, all error conditions descend from \`java.lang.Throwable\`:

1. **\`Error\` (The Fire)**: Serious hardware or JVM problems (like \`OutOfMemoryError\` or \`StackOverflowError\`). Applications should generally avoid catching or recovering from these fatal conditions.
2. **\`Exception\` (The Missing Ingredient)**: Conditions your program can handle:
   - **Checked Exceptions**: Subclasses of \`Exception\` (like \`IOException\` or \`SQLException\`). The compiler forces you to handle them with \`try-catch\` or declare them with \`throws\`.
   - **Unchecked Exceptions (\`RuntimeException\`)**: Programming bugs or logic errors (like \`NullPointerException\` or \`IllegalArgumentException\`). The compiler doesn't force you to declare them.`,
        keyIdea: 'Errors are fatal JVM problems; Checked Exceptions represent recoverable external issues; RuntimeExceptions represent logic flaws.',
        diagramState: 'throwable-hierarchy',
        diagramAlt: 'Architecture diagram illustrating A kitchen fire vs a missing ingredient: A kitchen fire vs a missing ingredient.',
      },
      {
        id: 'step-2',
        title: 'try-with-resources (AutoCloseable)',
        subtitle: 'Deterministic resource cleanup via AutoCloseable',
        duration: '3 min',
        type: 'solution',
        content: `The try-with-resources statement provides deterministic resource cleanup via compiler-generated desugaring.

In older Java versions, closing database connections or files required messy, nested \`finally\` blocks. If an error happened in both the \`try\` block and the \`finally\` block, the \`finally\` error silently erased the original root cause!

Java 7 introduced \`try-with-resources\`:
- Any resource that implements \`AutoCloseable\` (like files, sockets, and database connections) is declared inside parentheses after \`try (...)\`.
- The javac compiler desugars the construct into a robust try-finally block where close() executes deterministically on scope exit, using Throwable.addSuppressed() to preserve secondary closing exceptions rather than letting them mask the primary error!
- Resources are closed in **reverse order** of creation, and any secondary closing errors are preserved as suppressed exceptions.`,
        keyIdea: 'try-with-resources automatically closes files and database connections, preventing resource leaks and preserving error messages.',
        codeExample: {
          language: 'java',
          title: 'TryWithResourcesModern.java',
          code: `import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;

public class TryWithResourcesModern {
    public String fetchPolicyholder(DataSource dataSource, String policyId) throws SQLException {
        String sql = "SELECT customer_name FROM policies WHERE id = ?";
        
        // Both Connection and PreparedStatement are automatically closed when block exits:
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, policyId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("customer_name");
                }
            }
        }
        return null;
    }
}`,
        },
        diagramState: 'try-with-resources-cleanup',
        diagramAlt: 'Architecture diagram illustrating TryWithResourcesModern.java: The automatic sensor faucet that never overflows.',
      },
      {
        id: 'step-3',
        title: 'Enterprise Custom Exception Design',
        subtitle: 'Clear medical charts instead of vague complaints',
        duration: '2 min',
        type: 'recap',
        content: `If a patient walks into a clinic, a good doctor doesn't write "Patient is sick" on their chart. They write a specific diagnosis: "Acute throat infection". That way, the pharmacist knows exactly which medicine to dispense.

In clean backend development:
- **Avoid throwing raw generic \`Exception\`**: Callers have no structured way of knowing what specifically went wrong.
- **Avoid swallowed exceptions**: Do not discard caught exceptions in empty catch blocks; preserve the causal chain with structured logging or rethrowing.
- **Create clear domain exceptions**: Extend \`RuntimeException\` with clear names like \`PolicyNotFoundException\` or \`InsufficientBalanceException\`.
- **Include helpful context**: Add error codes and relevant IDs (like the missing policy number) so your logging and monitoring tools can pinpoint bugs instantly.`,
        keyIdea: 'Custom domain exceptions give your errors clear business meaning and make debugging production issues effortless.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating Clear medical charts instead of vague complaints: Clear medical charts instead of vague complaints.',
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
    duration: '11 min',
    difficulty: 'Advanced',
    youllLearn: [
      'The exact 16-byte memory footprint of an empty new Object()',
      'The 64-bit Mark Word: hash code, GC age bits, and lock pointers (biased locking deprecated in JDK 15 and removed in JDK 18)',
      'How Compressed OOPs enable 32-bit pointers on 64-bit JVMs up to 32GB',
      'Compact Object Headers (Project Lilliput) in Java 24/25+ saving 10-20% memory',
      'TLAB (Thread-Local Allocation Buffer) lock-free bump-the-pointer allocation',
      'Using JOL (Java Object Layout) to inspect memory byte alignment',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Java Object Header Layout',
        subtitle: 'The shipping box that is bigger than the gift',
        duration: '3 min',
        type: 'problem',
        productionSymptom: 'A high-throughput cache holding 50 million small objects ran out of memory on a 16GB server even though data fields were only 4 bytes each! Why does Java add 12-16 bytes of invisible overhead to every single object?',
        content: `Imagine ordering a tiny memory card online. When the package arrives on your doorstep, it isn't just the bare card. It arrives inside a sturdy cardboard shipping box with a shipping barcode label, a fragile sticker, packing paper, and tape. The shipping packaging weighs ten times more than the memory card itself!

In Java, you cannot create an object that contains "just the fields". Every single object on the Heap is wrapped in a mandatory **Object Header**:

1. **Mark Word (64 bits / 8 bytes)**: The shipping barcode. It holds runtime metadata:
   - The object's identity hash code
   - Its Garbage Collection age counter (0 to 15)
   - Its thread synchronization lock status (biased locking deprecated in JDK 15 and removed in JDK 18; modern Mark Word uses 64 bits for hashcode, age, and thin/fat lock pointers)
2. **Klass Pointer (32 or 64 bits)**: A reference pointer that tells the JVM what kind of class this object is.
3. **8-Byte Alignment Padding**: For fast CPU hardware reads, the JVM pads all objects to multiples of 8 bytes.

An empty object with no declared instance fields still takes up 8 bytes (Mark Word) + 4 bytes (Klass Word) + 4 bytes (padding) = **16 bytes on the Heap**!`,
        keyIdea: 'Every Java object carries an invisible header containing a Mark Word and a Klass pointer, padded to 8-byte boundaries.',
        cliInspection: {
          command: 'java -jar jol-cli.jar internals java.lang.Object',
          output: `OFFSET  SIZE   TYPE DESCRIPTION                    VALUE\n      0     8        (object header: mark)          0x0000000000000001 (unlocked)\n      8     4        (object header: class)         0x00000ba0\n     12     4        (loss due to the next object alignment)\nInstance size: 16 bytes`,
          explanation: 'Java Object Layout (JOL) tool output showing the 8-byte Mark Word, 4-byte compressed Klass Word, and 4 bytes of alignment padding totaling 16 bytes.',
        },
        diagramState: 'object-layout',
        diagramAlt: 'Architecture diagram illustrating The shipping box that is bigger than the gift: The shipping box that is bigger than the gift.',
      },
      {
        id: 'step-2',
        title: 'Compressed OOPs Heap Limits',
        subtitle: 'Numbering houses on an 8-meter lot',
        duration: '3 min',
        type: 'concept',
        content: `Imagine a planned neighborhood where every single house lot is exactly 8 meters wide. If you need to tell the postman where someone lives, you don't have to write the exact centimeter distance from the start of the street (which would require huge numbers). You simply write the house number: House 1, House 2, House 3... The postman simply multiplies that number by 8 to reach the front door!

On 64-bit computers, standard memory pointers take 8 bytes (64 bits). In a large application with millions of objects, pointers alone can waste gigabytes of RAM.

HotSpot solves this using **Compressed OOPs (Ordinary Object Pointers)**:
- Because every Java object is aligned to multiples of 8 bytes, the lowest 3 bits of every 8-byte aligned memory address evaluate to \`000\`.
- The JVM drops those 3 trailing zeros and stores compact 32-bit pointers. When reading, it shifts left by 3 bits to restore the full 64-bit address.
- With 32 bits, you can address $2^{32} \\times 8 \\text{ bytes} = \\mathbf{32\\text{ GB}}$ of memory!

**The 32GB Trap**: If you set your heap size to \`-Xmx33g\`, the JVM can no longer fit addresses into 32 bits. It turns off Compressed OOPs and switches to full 64-bit pointers. Every reference doubles in size, suddenly eating ~30% more memory! A 31GB heap can often hold more data than a 33GB heap.`,
        keyIdea: 'Compressed OOPs use 8-byte object alignment to represent 64-bit memory addresses using 32-bit pointers on heaps up to 32GB.',
        codeExample: {
          language: 'bash',
          title: 'CompressedOopsThreshold.sh',
          code: `# Check if your JVM is currently using compressed OOPs:
java -XX:+PrintFlagsFinal -version | grep -i UseCompressedOops

# Senior Engineer Rule of Thumb:
# Avoid setting -Xmx between 32GB and 40GB. 
# A 31GB heap with Compressed OOPs enabled is often faster and holds more data!`,
        },
        interviewTip: 'Why is a 31GB heap often better than a 33GB heap? Crossing the 32GB boundary disables Compressed OOPs, causing every object reference pointer to double from 4 bytes to 8 bytes, which eats up usable heap space.',
        diagramState: 'compressed-oops',
        diagramAlt: 'Architecture diagram illustrating CompressedOopsThreshold.sh: Numbering houses on an 8-meter lot.',
      },
      {
        id: 'step-3',
        title: 'Project Lilliput Compact Headers',
        subtitle: 'Shrinking the shipping label in modern Java',
        duration: '2 min',
        type: 'solution',
        content: `For over 25 years, every 64-bit Java object required a bulky header of 12 to 16 bytes. When building modern cloud microservices holding millions of objects in memory, that overhead felt like shipping a marble in a refrigerator box.

**Project Lilliput (JEP 450)** in modern Java (Java 24/25+) provides a major breakthrough:
- It collapses the Klass Pointer directly into the unused bits of the **Mark Word**.
- This shrinks the entire Object Header down to a single **64-bit word (just 8 bytes)**!
- Future updates plan to shrink it even further to a **32-bit header (4 bytes)**.

This architectural enhancement frees up **10% to 20% of heap memory** automatically without requiring you to change a single line of your application code!`,
        keyIdea: 'Project Lilliput shrinks Java object headers from 16/12 bytes down to 8 bytes, freeing 10% to 20% of heap space for free.',
        codeExample: {
          language: 'bash',
          title: 'EnableCompactHeaders.sh',
          code: `# Enable compact 64-bit headers in Java 24+:
java -XX:+UnlockExperimentalVMOptions -XX:+UseCompactObjectHeaders -jar microservice.jar`,
        },
        microCheck: {
          question: 'What is the primary benefit of Project Lilliput in modern Java runtimes?',
          options: [
            'It shrinks object headers from 12-16 bytes down to 8 bytes, saving 10-20% memory across millions of objects',
            'It enables manual memory deallocation like C++',
            'It disables garbage collection entirely for short-lived records',
            'It replaces the JIT compiler with an AOT compiler for all classes',
          ],
          answerIndex: 0,
          explanation: 'Lilliput shrinks the header by packing class pointer metadata directly into unused bits of the mark word, saving massive amounts of memory across object-heavy collections.',
        },
        diagramState: 'lilliput-headers',
        diagramAlt: 'Architecture diagram illustrating EnableCompactHeaders.sh: Shrinking the shipping label in modern Java.',
      },
      {
        id: 'step-4',
        title: 'Lock Free TLAB Allocation',
        subtitle: 'Personal parchment paper for every chef',
        duration: '3 min',
        type: 'insight',
        content: `Imagine a bakery with 20 pastry chefs. If all 20 chefs have to share a single tape dispenser at the front counter to package every cookie, they will spend all morning bumping into each other and waiting in line. But if the bakery manager hands each chef their own personal roll of tape right at their station, every chef can wrap pastries at lightning speed without waiting.

In the JVM, memory is shared across hundreds of threads. If every thread had to acquire a global lock every time you typed \`new Object()\`, your computer's multicore CPU would grind to a halt.

HotSpot solves this with **TLAB (Thread-Local Allocation Buffer)**:
- Every thread gets a private chunk of memory inside Eden space (~100KB to 1MB).
- When a thread creates an object, it simply slides a pointer forward: \`top += size\`.
- This **"Bump-the-Pointer"** allocation operates without contention locks and finishes in just 1 or 2 CPU clock cycles!
- Only when a thread's private TLAB fills up does it briefly coordinate with the main heap to grab a fresh buffer.`,
        keyIdea: 'TLAB provides a lock-free thread-local buffer in Eden space for bump-pointer allocation; shared heap synchronization occurs only during buffer refill.',
        cliInspection: {
          command: 'jcmd <pid> VM.flags -all | grep -i TLAB',
          output: `bool UseTLAB = true\nsize_t TLABSize = 0\nintx TLABWasteTargetPercent = 1`,
          explanation: 'TLAB is enabled by default in all production JVMs. The JVM dynamically adjusts each thread\'s buffer size according to its allocation rate.',
        },
        diagramState: 'tlab-allocation',
        diagramAlt: 'Architecture diagram illustrating Personal parchment paper for every chef: Personal parchment paper for every chef.',
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
    duration: '7 min',
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
        title: 'Escape Analysis JVM Optimization',
        subtitle: 'Do all Java objects really live on the Heap?',
        duration: '2 min',
        type: 'problem',
        productionSymptom: 'A junior engineer avoided creating small immutable Record objects in a high-frequency trading loop, fearing that 10,000,000 allocations per second would drown the Garbage Collector in Eden space. Yet in production, GC pauses were 0ms! How did the JVM eliminate allocations completely?',
        content: `Almost every Java beginner is taught: *"In C++ you allocate on the stack, but in Java, every single object created with \`new\` goes onto the Heap."*

In modern Java, **this is actually a myth!**

Through a compiler technique called **Escape Analysis**, the HotSpot C2 compiler inspects your code to see where an object's reference travels. If an object is created inside a method, used for a quick calculation, and not passed beyond the method boundary, the JVM realizes: *"Nobody outside this method will ever know this object existed."*

When that happens, the JVM does **not** allocate the object on the heap at all!`,
        keyIdea: 'Escape analysis proves whether an object escapes its method, allowing the JIT compiler to eliminate heap allocations entirely.',
        codeExample: {
          language: 'java',
          title: 'NonEscapingObject.java',
          code: `public class NonEscapingObject {
    public record Point(int x, int y) {}

    public int calculateDistance() {
        // This Point object is created, used, and discarded entirely within this method!
        // It never "escapes" to outside code.
        Point p = new Point(10, 20);
        return p.x() + p.y();
    }
}`,
        },
        diagramState: 'escape-graph',
        diagramAlt: 'Architecture diagram illustrating NonEscapingObject.java: Do all Java objects really live on the Heap?.',
      },
      {
        id: 'step-2',
        title: 'The Three Escape States',
        subtitle: 'Confined to the room vs escaping to the street',
        duration: '3 min',
        type: 'concept',
        content: `Think of a private secret:
1. **\`NoEscape\` (Whispered in a locked room)**: You think of a secret and write it on a sticky note. You read it, calculate an answer, and shred the note before leaving the room. The allocated instance does not escape method scope! 2. ArgEscape (Shown to a trusted friend): You show the note to a friend in the hallway, but they don't take a photo or share it. It escaped the room, but not the conversation.
3. **\`GlobalEscape\` (Published on a billboard)**: You post the secret on social media. Now anyone in the world can see it, and it must live forever on the web.

HotSpot classifies every object into these three exact states:
- **GlobalEscape**: The object is returned from a method, stored in a static field, or passed to a background thread. It **must** live on the shared Heap.
- **ArgEscape**: Passed into another method as an argument, but that method doesn't store it.
- **NoEscape**: The object remains confined to the current method invocation.`,
        keyIdea: 'Only NoEscape objects qualify for scalar replacement, allowing the JIT to eliminate the heap object completely.',
        cliInspection: {
          command: 'java -XX:+UnlockDiagnosticVMOptions -XX:+PrintEscapeAnalysis PointDemo',
          output: `[info] ConnectionGraph escape analysis results (illustrative summary):
  EscapeState: NoEscape (Point instance scalar replaced into registers)
  EscapeState: ArgEscape (Vector passed as method argument)
  EscapeState: GlobalEscape (Customer stored to static field / Heap)`,
          explanation: 'Prints the exact escape state determination made by the C2 compiler for every allocation site.',
        },
        diagramState: 'escape-states',
        diagramAlt: 'Architecture diagram illustrating Confined to the room vs escaping to the street: Confined to the room vs escaping to the street.',
      },
      {
        id: 'step-3',
        title: 'Scalar Replacement & Lock Elision',
        subtitle: 'Dismantling the object into raw CPU numbers',
        duration: '2 min',
        type: 'solution',
        content: `When an object is categorized as \`NoEscape\`, the HotSpot JIT compiler applies two brilliant optimizations:

1. **Scalar Replacement**:
   The compiler literally dismantles the object into its individual raw numbers (scalars). If you created a \`Point(int x, int y)\`, the compiler puts \`x\` directly into CPU hardware register R1 and \`y\` into register R2.
   - No object header is created.
   - No memory is allocated on the heap.
   - The garbage collector incurs no allocation overhead!

2. **Lock Elision (Removing Locks)**:
   If a local method acquires a lock on an object that does not escape (e.g., using a legacy \`StringBuffer\` or a local \`synchronized\` block), the JIT compiler completely deletes the locking instructions because no other thread could ever compete for it!`,
        keyIdea: 'Scalar replacement breaks an object into raw primitive variables in CPU registers, eliminating heap allocations and GC pauses.',
        codeExample: {
          language: 'java',
          title: 'ScalarReplacementEquivalent.java',
          code: `public class ScalarReplacementEquivalent {
    public record Point(int x, int y) {}

    // What you wrote in Java:
    public int compute() {
        Point p = new Point(10, 20);
        return p.x() + p.y();
    }

    // What HotSpot C2 JIT actually compiles into native assembly:
    public int computeOptimized() {
        int p_x = 10;      // Stored directly in CPU register R1
        int p_y = 20;      // Stored directly in CPU register R2
        return p_x + p_y;  // Single fast hardware ADD instruction! No object!
    }
}`,
        },
        microCheck: {
          question: 'What happens to a NoEscape object during Scalar Replacement?',
          options: [
            'It is serialized into off-heap direct memory',
            'It is moved immediately to the Tenured Old Generation',
            'Its fields are decomposed directly into CPU registers or stack slots, and no heap object is ever created',
          ],
          answerIndex: 2,
          explanation: 'Scalar replacement dismantles the object into individual primitive fields that live directly in CPU registers or stack frames, bypassing the heap entirely.',
        },
        diagramState: 'scalar-replacement',
        diagramAlt: 'Architecture diagram illustrating ScalarReplacementEquivalent.java: Dismantling the object into raw CPU numbers.',
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
    duration: '6 min',
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
        title: 'Stop The World Latency',
        subtitle: 'Freezing time in the supermarket',
        duration: '3 min',
        type: 'problem',
        productionSymptom: 'During peak market open, an algorithmic order router experienced 80ms p99 latency spikes that triggered connection timeouts on client sockets. Investigation showed that G1GC was pausing all application threads to evacuate Survivor and Old regions.',
        content: `Imagine a busy supermarket where thousands of shoppers are walking up and down the aisles picking up groceries. Suddenly, a siren sounds, and a loud voice says: *"FREEZE!"* Every shopper must freeze like a statue in place for two seconds while the store cleaning crew moves cereal boxes from Aisle 2 to Aisle 4.

In traditional garbage collectors (like Parallel GC and G1GC), this is known as a **Stop-The-World (STW)** pause:
- When the collector needs to move living objects from a fragmented memory region to a fresh one, it pauses all your application threads.
- Why? Because if your program tried to read or change an object while the Garbage Collector was halfway through moving it, your data would get corrupted!

While G1GC keeps these pauses short (e.g. 50–100ms), financial trading systems, multiplayer games, and high-speed web services cannot tolerate even a 50ms pause. That is why **ZGC** was created, achieving sub-millisecond (<1ms) pauses.

**Real-world GC logging and jstat monitoring**: Production diagnostics combine unified logging via \`-Xlog:gc*\` to capture pause phases with real-time \`jstat\` sampling to track generational capacity and memory allocation rates.`,
        keyIdea: 'Stop-The-World pauses occur because legacy garbage collectors cannot safely allow application threads to access objects while they are being moved in memory.',
        cliInspection: {
          command: 'jstat -gcutil <pid> 1000',
          output: `S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     CGC    CGCT    GCT\n0.00  98.20  45.10  68.40  96.50  92.10   142    1.240     0    0.000     28    0.412   1.652`,
          explanation: 'Monitors Eden (E), Old Gen (O), Young GC count and time (YGC/YGCT), and Full GC count (FGC). Helps pinpoint where memory pressure builds up.',
        },
        diagramState: 'stw-barrier',
        diagramAlt: 'Architecture diagram illustrating Freezing time in the supermarket: Freezing time in the supermarket.',
      },
      {
        id: 'step-2',
        title: 'Colored Pointers & Load Barriers',
        subtitle: 'Moving houses while guests are still visiting',
        duration: '3 min',
        type: 'solution',
        content: `Imagine moving houses while friends are still visiting. Instead of canceling the party and locking all doors for 3 days, you put a friendly assistant at the front door. If a friend arrives at the old house, the assistant hands them a note with the new address on the spot, and they head straight to the party without delay!

**ZGC (The Z Garbage Collector)** achieves max pause times of **under 1 millisecond**, even on massive multi-terabyte heaps.

It accomplishes this through two foundational ideas:
1. **Colored Pointers**:
   ZGC embeds 4 status bits directly inside the unused upper bits of 64-bit object memory addresses (like flags saying "Remapped" or "Marked").
2. **Load Barriers (Self-Healing Reads)**:
   When your application thread reads an object reference (like \`customer.getName()\`), the JIT compiler inserts an ultra-fast hardware check. If the pointer's color indicates that the object is currently being moved to a new memory address, the thread itself updates the pointer to the new address instantly and keeps running!

worker threads avoid multi-millisecond stop-the-world pauses while the Garbage Collector relocates objects; pause phases (Pause Mark Start, Pause Mark End, Pause Relocate Start) are strictly sub-millisecond (<1ms).`,
        keyIdea: 'ZGC uses Colored Pointers and self-healing Load Barriers to move objects concurrently without pausing application threads.',
        codeExample: {
          language: 'bash',
          title: 'EnableGenerationalZGC.sh',
          code: `# Generational ZGC evolution:
# - JDK 21 experimental (-XX:+UseZGC -XX:+ZGenerational)
# - JDK 23 default (JEP 474: Generational ZGC enabled by default with -XX:+UseZGC)
# - JDK 24 non-generational removed (legacy non-generational mode eliminated)
# Running modern Generational ZGC:
java -XX:+UseZGC -Xmx16g -Xlog:gc*:file=gc.log:time,uptime -jar app.jar`,
        },
        microCheck: {
          question: 'How does ZGC minimize Stop-The-World pauses to sub-millisecond durations when relocating objects in memory?',
          options: [
            'It uses colored pointer bits and load barriers that self-heal references on-the-fly when application threads read them',
            'It never relocates objects, leaving memory permanently fragmented',
            'It moves all objects to native off-heap storage using Project Panama',
          ],
          answerIndex: 0,
          explanation: 'ZGC inspects the reference color on read via JIT load barriers. If an object is in the process of moving, the load barrier self-heals the pointer to the new address immediately.',
        },
        diagramState: 'colored-pointers',
        diagramAlt: 'Architecture diagram illustrating EnableGenerationalZGC.sh: Moving houses while guests are still visiting.',
      },
    ],
  },
];
