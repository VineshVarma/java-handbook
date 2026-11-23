import { Lesson } from '@/lib/types';

export const collectionsLessons: Lesson[] = [
  {
    id: 'collections-framework',
    slug: 'collections-framework',
    title: 'Collections Framework Deep Dive',
    subtitle: 'Navigate the collection hierarchy and master ArrayList, LinkedList, and HashMap bucket internals.',
    moduleId: '02',
    moduleTitle: '02. Collections & Streams',
    duration: '12 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The core hierarchy: Collection vs Map, List, Set, Queue',
      'ArrayList vs LinkedList performance and memory locality',
      'HashMap internals: buckets, hashing, load factor, and treeification (Red-Black trees)',
      'ConcurrentHashMap: striping, CAS, and thread-safe concurrent reads',
      'Choosing the optimal data structure for time and space complexity',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Collection Interface Hierarchy',
        subtitle: 'A kitchen storage system with specialized drawers',
        duration: '3 min',
        type: 'concept',
        content: `Think of organizing a commercial kitchen. You don't dump all your spoons, spices, order slips, and recipes into one giant cardboard box. Instead, you use specialized organizers:
- A silverware tray with ordered slots where each fork has a numbered position (\`List\`).
- A spice rack where every jar must be unique and you cannot have two identical jars of cinnamon (\`Set\`).
- A metal order rail holding incoming tickets for order processing (\`Queue\`).
- A recipe index card box where each recipe has a title tag on top that maps directly to the instructions on the card (\`Map\`).

The Java Collections Framework sits in \`java.util\` and organizes your data using this exact structure:

At the root sits \`Iterable<T>\`, which allows any collection to be walked through in a \`for-each\` loop. Extending it is \`Collection<T>\`, which forks into three main families:
1. \`List<E>\`: An ordered list of elements with index numbers (e.g., item 0, item 1). Duplicates are welcome.
2. \`Set<E>\`: A collection of unique elements. Duplicates are strictly rejected using \`equals()\` and \`hashCode()\`.
3. \`Queue<E>\` & \`Deque<E>\`: For task queues and pipelines. While queues commonly follow First-In, First-Out (FIFO) order, implementations differ: \`PriorityQueue\` orders elements by natural ordering or a \`Comparator\` (min-heap, not FIFO), while \`ArrayDeque\` implements a high-performance resizable circular buffer without per-node pointer allocation overhead, outperforming \`LinkedList\` for both FIFO and LIFO operations.

**Why Map is on its own**: \`Map<K, V>\` does not implement \`Collection\` because it holds pairs (keys and values) rather than standalone elements.

**Choosing the optimal data structure for time and space complexity**: Select collections based on access patterns: \`ArrayList\` for $O(1)$ indexed reads and compact memory space, \`LinkedList\` or \`ArrayDeque\` for queue operations, and \`HashMap\` or \`HashSet\` for $O(1)$ amortized lookup time with configurable load factor.`,
        keyIdea: 'List, Set, and Queue share the common Collection interface; Map is an independent family dedicated to key-value pairs.',
        diagramState: 'hierarchy',
        diagramAlt: 'Architecture diagram illustrating A kitchen storage system with specialized drawers: A kitchen storage system with specialized drawers.',
      },
      {
        id: 'step-2',
        title: 'ArrayList vs LinkedList Performance',
        subtitle: 'An egg carton vs a scavenger hunt across town',
        duration: '3 min',
        type: 'trade-off',
        content: `Imagine grabbing eggs from an egg carton. All 12 eggs sit side-by-side in a single molded cardboard row. When you reach for the 3rd egg, your eyes and hand already see eggs 4, 5, and 6 right next to it (**ArrayList**). 

Now imagine a scavenger hunt (**LinkedList**). Clue 1 is in your kitchen, but its note tells you to walk to the garage. In the garage, Clue 2 tells you to walk across the street to the neighbor's house. Even if each clue takes 1 second to read, traveling between distant locations wastes massive amounts of time!

Many introductory textbooks say: *"LinkedList has O(1) insertions, so use it whenever you add or remove items often."*

In modern enterprise Java on real multicore hardware, **this textbook advice is frequently misleading! ArrayList typically outperforms LinkedList across production workloads.**

**Why? CPU Cache Locality**:
1. **ArrayList** wraps a single contiguous array (\`Object[]\`) in memory. When your CPU fetches one element, hardware automatically pulls a 64-byte chunk (a cache line) into ultra-fast L1/L2 CPU cache. Reading the next element takes ~1 nanosecond!
2. **LinkedList** allocates an independent \`Node\` object for every single element, scattering pointers across the heap and triggering expensive CPU cache misses. Plus, each node burns 24 bytes of pointer overhead!`,
        keyIdea: 'ArrayList groups elements together in contiguous memory so CPU caches can prefetch them, outperforming node-based LinkedList in almost every real benchmark.',
        codeExample: {
          language: 'java',
          title: 'ArrayList Capacity Preallocation',
          code: `import java.util.ArrayList;
import java.util.List;

public class ListCapacityOptimization {
    public static void main(String[] args) {
        // Suboptimal: Default capacity 10 forces repeated internal array resizing and copying:
        List<String> unoptimizedList = new ArrayList<>();

        // Production optimization: Preallocate capacity if the expected size is known!
        // This avoids costly memory reallocations:
        int expectedSize = 10_000;
        List<String> optimizedList = new ArrayList<>(expectedSize);
        
        for (int i = 0; i < expectedSize; i++) {
            optimizedList.add("Item-" + i);
        }
    }
}`,
        },
        interviewTip: 'How does an ArrayList grow when it reaches capacity? It creates a new array that is 50% larger (newCapacity = oldCapacity + (oldCapacity >> 1)) and copies all elements over using the native System.arraycopy() method.',
        diagramState: 'arraylist-vs-linkedlist',
        diagramAlt: 'Architecture diagram illustrating ArrayList Capacity Preallocation: An egg carton vs a scavenger hunt across town.',
      },
      {
        id: 'step-3',
        title: 'HashMap Internals and Treeification',
        subtitle: 'The hotel coat check with smart organizing bins',
        duration: '3 min',
        type: 'solution',
        content: `Think of a busy hotel coat check room with 16 numbered bins along the wall:
- When you hand your jacket to the clerk, they take your name, do a quick math calculation on your name to pick a number between 0 and 15, and hang your coat in that specific bin (**The Hash Function & Bucket Index**).
- When you return with your claim ticket, they calculate that same number, walk straight to that single bin, and hand you your coat in 1 second flat! That is **$O(1)$ constant time lookup**.
- What if two people with different names get assigned to the same bin? That is a **Hash Collision**. The clerk simply hangs the second coat on a hanger hooked to the first coat (a linked list).
- **The Upgrade (Treeification)**: In Java 8+, when hash collisions in a single bucket reach \`TREEIFY_THRESHOLD = 8\` and total table capacity is at least \`MIN_TREEIFY_CAPACITY = 64\`, the JVM reorganizes that bin from a linked list into a balanced **Red-Black Tree**! This speeds up lookups from $O(n)$ to **$O(\\log n)$**. If the table has fewer than 64 buckets, it resizes instead of treeifying.`,
        keyIdea: 'HashMap uses bucket arrays for O(1) lookups, converting crowded buckets into balanced Red-Black trees when collisions exceed 8 items.',
        codeExample: {
          language: 'java',
          title: 'HashCodeEqualsContract.java',
          code: `import java.util.Objects;

public class CustomerKey {
    private final String ssn;
    private final String countryCode;

    public CustomerKey(String ssn, String countryCode) {
        this.ssn = ssn;
        this.countryCode = countryCode;
    }

    // MANDATORY CONTRACT:
    // If two objects are equal according to equals(),
    // they MUST return the exact same hashCode()!
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CustomerKey that)) return false;
        return Objects.equals(ssn, that.ssn) &&
               Objects.equals(countryCode, that.countryCode);
    }

    @Override
    public int hashCode() {
        int result = ssn != null ? ssn.hashCode() : 0;
        result = 31 * result + (countryCode != null ? countryCode.hashCode() : 0);
        return result;
    }
} `,
        },
        interviewTip: 'What happens if two different keys return the same hashCode() in a HashMap? A hash collision occurs. Both key-value pairs are stored in the same bucket. When retrieving, the JVM compares keys using .equals() to find the exact matching item.',
        diagramState: 'hashmap-buckets-treeify',
        diagramAlt: 'Architecture diagram illustrating HashCodeEqualsContract.java: The hotel coat check with smart organizing bins.',
      },
      {
        id: 'step-4',
        title: 'ConcurrentHashMap Lock Striping CAS',
        subtitle: 'A library with 16 separate study rooms instead of 1 padlocked door',
        duration: '3 min',
        type: 'insight',
        content: `Imagine a library where 100 students want to study. 
- If the librarian puts a single padlock on the front entrance door (\`Collections.synchronizedMap\`), only one student can be inside at a time. The other 99 students must wait outside in the rain, destroying throughput.
- But what if the library has 16 separate study rooms (\`ConcurrentHashMap\`)? Students can read books anywhere without asking for a key. If someone needs to write notes on the whiteboard in Room 4, only Room 4 is briefly locked, while all other 15 rooms remain completely open!

**ConcurrentHashMap** achieves high-throughput concurrency through three techniques:
1. **Lock-Free Reads**: The \`get()\` method reads memory directly using volatile variables without acquiring any lock at all!
2. **Atomic CAS (Compare-And-Swap)**: When inserting a new item into an empty bucket, the JVM uses hardware-level atomic CPU instructions without thread locking.
3. **Bucket-Level Synchronization**: If multiple threads write to the same non-empty bucket at the same time, the JVM locks only that single bucket node (\`synchronized(node)\`), letting other threads continue reading and writing to all other buckets simultaneously.`,
        keyIdea: 'ConcurrentHashMap allows completely lock-free reads and locks only individual bucket nodes during writes, delivering massive concurrency.',
        diagramState: 'concurrenthashmap-cas',
        diagramAlt: 'Architecture diagram illustrating A library with 16 separate study rooms instead of 1 padlocked door: A library with 16 separate study rooms instead of 1 padlocked door.',
      },
    ],
  },
  {
    id: 'streams-api',
    slug: 'streams-api',
    title: 'Streams Pipeline & Functional Dataflow',
    subtitle: 'Stream pipeline stages, lazy evaluation short-circuiting, map and flatMap flattening, and collectors',
    moduleId: '02',
    moduleTitle: '02. Collections & Streams',
    duration: '10 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'The anatomy of a Stream: Source -> Intermediate Operations -> Terminal Operation',
      'Lazy evaluation and short-circuiting mechanics',
      'The critical difference between map() and flatMap()',
      'Collectors: groupingBy, partitioningBy, joining, and toMap',
      'When parallel streams hurt performance vs when they help',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Stream Pipeline Architecture',
        subtitle: 'The automated factory conveyor belt',
        duration: '3 min',
        type: 'concept',
        content: `Think of an automated soda bottling factory:
- Empty bottles enter at one end on a conveyor belt (**The Source**).
- As the bottles glide down the belt, robotic arms perform tasks: one scanner removes broken bottles (**filter**), another fills the bottle with soda (**map**), and another puts a bottle cap on (**map**).
- At the end of the line, a robotic claw packs the finished bottles into a shipping crate (**The Terminal Operation**).

A **Java Stream** is not a data structure—it does not store data on its own. It is a conveyor belt of computations that processes elements on demand.

Every stream pipeline has three stages:
1. **Source**: Where elements come from (a List, Set, or array via \`list.stream()\`).
2. **Intermediate Operations (0 or more)**: Step-by-step transformations like \`filter()\`, \`map()\`, or \`sorted()\`. They return a new stream.
3. **Terminal Operation (Exactly 1)**: Triggers the conveyor belt to start moving and collects the final result (like \`toList()\`, \`count()\`, or \`findFirst()\`).

Streams replace imperative loops with declarative pipelines, expressing transformation logic concisely.`,
        keyIdea: 'Streams do not store elements; they transform data on-the-fly as elements flow from a source to a terminal operation.',
        diagramState: 'stream-pipeline',
        diagramAlt: 'Architecture diagram illustrating The automated factory conveyor belt: The automated factory conveyor belt.',
      },
      {
        id: 'step-2',
        title: 'Lazy Evaluation Short-Circuiting',
        subtitle: 'The video streaming service that buffers only what you watch',
        duration: '3 min',
        type: 'insight',
        content: `Think of watching a movie on an internet streaming app. When you press play on Episode 1, the app doesn't download all 10 hours of the season to your phone before starting. It downloads only the first few seconds of video, buffering more only when your screen needs it. If you close the app after 3 minutes, the remaining 9 hours and 57 minutes are not fetched or processed.

In Java streams, intermediate operations like \`.filter()\` and \`.map()\` are **Lazy**:
- When you call \`.filter()\`, Java does not actually run your filter code yet! It just connects the pipe.
- Nothing moves until a **Terminal Operation** (like \`.findFirst()\` or \`.collect()\`) turns on the tap.

**Short-Circuiting Operations**:
Streams support short-circuiting operations: intermediate operations like \`limit(n)\` and terminal operations like \`findFirst()\` or \`anyMatch()\` halt processing immediately once their target condition is met without evaluating the rest of the stream. If you call \`.findFirst()\` on a list of 1,000,000 items, the stream stops running the millisecond it finds the very first matching item, saving massive CPU time!`,
        keyIdea: 'Streams are lazy: intermediate steps do not run until a terminal operation is called, and short-circuiting operations halt execution early.',
        codeExample: {
          language: 'java',
          title: 'StreamLazinessDemo.java',
          code: `import java.util.List;

public class StreamLazinessDemo {
    public static void main(String[] args) {
        List<String> names = List.of("Alex", "Bob", "Charlie", "David", "Edward");

        String firstLongName = names.stream()
            .filter(name -> {
                System.out.println("Checking name: " + name);
                return name.length() > 4;
            })
            .map(name -> {
                System.out.println("Transforming: " + name);
                return name.toUpperCase();
            })
            .findFirst() // Short-circuits as soon as Charlie matches!
            .orElse("None");

        System.out.println("Result: " + firstLongName);
        
        // Output:
        // Checking name: Alex
        // Checking name: Bob
        // Checking name: Charlie
        // Transforming: Charlie
        // Result: CHARLIE
        // Notice: "David" and "Edward" were never evaluated!
    }
}`,
        },
        interviewTip: 'Why are Java Streams lazy? Laziness enables major performance wins: loop fusion (combining filter and map into a single pass through memory) and short-circuiting (halting immediately once a condition like findFirst() or anyMatch() is satisfied).',
        diagramState: 'lazy-short-circuit',
        diagramAlt: 'Architecture diagram illustrating StreamLazinessDemo.java: The video streaming service that buffers only what you watch.',
      },
      {
        id: 'step-3',
        title: 'Map vs FlatMap Flattening',
        subtitle: 'Changing one item vs unpacking a box of items',
        duration: '2 min',
        type: 'solution',
        content: `Imagine opening your daily mail:
- **map() (1-to-1)**: You receive an envelope with an invoice. You stamp the envelope "PAID" and hand it back. One envelope in, one stamped envelope out.
- **flatMap() (1-to-many, then flattened)**: You receive three cardboard packages. Inside each package are five smaller gift boxes. If you used \`map()\`, you would have a pile of packages containing boxes. But you want all the individual gift boxes laid out in a single flat row on your table. You use \`flatMap()\` to open each package and pour all the inner gift boxes into one single flat stream!

In Java:
- Use \`map()\` when transforming an object into another single object (e.g., converting a \`Customer\` into their \`String\` email address).
- Use \`flatMap()\` when each object contains a collection of child items (e.g., each \`Order\` has a \`List<OrderItem>\`), and you want a single flat stream of all items across all orders.

**The critical difference between map() and flatMap()**: While \`map()\` transforms each stream element into a single output item, \`flatMap()\` flattens multiple child streams into one continuous stream.`,
        keyIdea: 'Use map() for simple 1-to-1 transformations; use flatMap() to unpack nested collections into a single flat stream.',
        codeExample: {
          language: 'java',
          title: 'FlatMapEnterprisePattern.java',
          code: `import java.util.List;
import java.util.stream.Collectors;

public class FlatMapEnterprisePattern {
    record Policy(String id, List<String> beneficiaries) {}

    public static void main(String[] args) {
        List<Policy> policies = List.of(
            new Policy("POL-1", List.of("Alice", "Bob")),
            new Policy("POL-2", List.of("Charlie")),
            new Policy("POL-3", List.of("Alice", "David"))
        );

        // flatMap flattens all inner beneficiary lists into a single stream of Strings!
        List<String> uniqueBeneficiaries = policies.stream()
            .flatMap(policy -> policy.beneficiaries().stream())
            .distinct()
            .sorted()
            .collect(Collectors.toList());

        System.out.println("Beneficiaries: " + uniqueBeneficiaries);
        // Prints: [Alice, Bob, Charlie, David]
    }
}`,
        },
        diagramState: 'map-flatmap',
        diagramAlt: 'Architecture diagram illustrating FlatMapEnterprisePattern.java: Changing one item vs unpacking a box of items.',
      },
      {
        id: 'step-4',
        title: 'Complex Collectors GroupingBy',
        subtitle: 'Sorting mail into cubbies by department',
        duration: '2 min',
        type: 'concept',
        content: `Think of a company mailroom. Letters arrive from all over the world. The mail clerk doesn't just leave them in a messy heap; they sort them into labeled cubbies on the wall: one cubby for Marketing, one for Finance, and one for Engineering.

In Java Streams, \`Collectors\` is the powerhouse tool that gathers your stream results into organized collections:

- \`groupingBy()\`: The equivalent of SQL \`GROUP BY\`. It groups items into a \`Map<Key, List<Value>>\` based on a property (like grouping policies by status).
- \`partitioningBy()\`: A specialized binary grouping that splits items into two buckets: \`true\` and \`false\` (e.g., separating active accounts from inactive ones).
- \`joining()\`: Glues text together into a single string with delimiters (like \`"A, B, C"\`).

**When parallel streams hurt performance vs when they help**: Calling \`parallelStream()\` leverages \`ForkJoinPool.commonPool()\` to accelerate CPU-bound calculations over large contiguous datasets. However, parallel streams hurt performance when applied to small collections, blocking I/O tasks, or non-splittable sources where thread synchronization overhead dwarfs execution time.`,
        keyIdea: 'Collectors turn flat stream pipelines into rich, structured multi-level maps and aggregated summaries.',
        codeExample: {
          language: 'java',
          title: 'GroupingByPattern.java',
          code: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class GroupingByPattern {
    enum Status { ACTIVE, PENDING, EXPIRED }
    record Policy(String id, Status status, double premium) {}

    public static void main(String[] args) {
        List<Policy> policies = List.of(
            new Policy("P1", Status.ACTIVE, 1200.0),
            new Policy("P2", Status.ACTIVE, 800.0),
            new Policy("P3", Status.PENDING, 500.0)
        );

        // Group policies by status and count them:
        Map<Status, Long> countByStatus = policies.stream()
            .collect(Collectors.groupingBy(Policy::status, Collectors.counting()));

        // Group policies by status and calculate total premium:
        Map<Status, Double> premiumByStatus = policies.stream()
            .collect(Collectors.groupingBy(Policy::status, Collectors.summingDouble(Policy::premium)));

        System.out.println("Counts: " + countByStatus);
        System.out.println("Total Premiums: " + premiumByStatus);
    }
}`,
        },
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating GroupingByPattern.java: Sorting mail into cubbies by department.',
      },
    ],
  },
  {
    id: 'lambdas-functional',
    slug: 'lambdas-functional',
    title: 'Lambda Expressions & Functional Interfaces',
    subtitle: 'From anonymous inner classes to invokedynamic lambdas, method references, and null-safe Optional.',
    moduleId: '02',
    moduleTitle: '02. Collections & Streams',
    duration: '7 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'Anonymous inner classes vs Lambdas and invokedynamic execution',
      'The 4 core functional interfaces: Predicate, Function, Consumer, Supplier',
      'Method references: static, instance, and constructor references',
      'Function composition using andThen() and compose()',
      'Monadic null-safety using Optional<T> best practices',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Lambda Expressions and Desugaring',
        subtitle: 'Sending a quick text message instead of a 3-page formal letter',
        duration: '3 min',
        type: 'concept',
        content: `Before Java 8, if you wanted to pass a small piece of logic to another method (like telling a list how to sort itself), you had to write a verbose **Anonymous Inner Class**. You had to write six lines of boilerplate code with \`new Comparator<...>()\`, method signatures, and curly braces just to say "compare by ID".

Even worse, the compiler had to generate a separate \`.class\` file on disk (like \`MyClass$1.class\`) and create a brand-new object in memory every time!

Java 8 introduced **Lambda Expressions (\`() -> {}\`)**:
- A lambda is a quick, lightweight way to pass a function as if it were a variable.
- Under the hood, lambdas do not generate clumsy inner class files! Instead, the JVM uses an \`invokedynamic\` bytecode instruction linked via \`LambdaMetafactory\` to spin call sites on-demand at runtime with minimal overhead.

Any interface that has **exactly one abstract method** is called a **Functional Interface** (often marked with \`@FunctionalInterface\`) and can be written as a clean lambda.

**Method references syntax and forms**: Method references provide shorthand notation for lambdas: static method references (\`Math::max\`), bound instance method references (\`System.out::println\`), unbound instance method references (\`String::toLowerCase\`), and constructor references (\`ArrayList::new\`).`,
        keyIdea: 'Lambdas provide concise syntax and use invokedynamic under the hood to execute functional logic with minimal memory overhead.',
        codeExample: {
          language: 'java',
          title: 'AnonymousClassVsLambda.java',
          beforeCode: `// Before Java 8: Verbose Anonymous Inner Class
Collections.sort(policies, new Comparator<Policy>() {
    @Override
    public int compare(Policy p1, Policy p2) {
        return p1.getId().compareTo(p2.getId());
    }
});`,
          code: `// Modern Java: Concise Lambda Expression with Method Reference
import java.util.Comparator;
import java.util.List;

public class LambdaExample {
    record Policy(String id) {}

    public static void sortPolicies(List<Policy> policies) {
        // Clean one-liner using method reference:
        policies.sort(Comparator.comparing(Policy::id));
    }
}`,
        },
        diagramState: 'lambda-desugaring',
        diagramAlt: 'Architecture diagram illustrating AnonymousClassVsLambda.java: Sending a quick text message instead of a 3-page formal letter.',
      },
      {
        id: 'step-2',
        title: 'The Core Functional Interfaces',
        subtitle: 'The 4 fundamental roles in an office team',
        duration: '2 min',
        type: 'solution',
        content: `Think of an office team where four specialists handle different tasks:
1. **The Inspector (\`Predicate<T>\`)**: Takes an item, checks it, and answers **Yes or No** (\`T -> boolean\`). For example: *"Is this policy active?"*
2. **The Converter (\`Function<T, R>\`)**: Takes an input item and transforms it into a **different output** (\`T -> R\`). For example: *"Convert this Customer object into their email address."*
3. **The Worker (\`Consumer<T>\`)**: Accepts an item, performs an action with it, and **returns nothing** (\`T -> void\`). For example: *"Print this invoice to the printer."*
4. **The Supplier (\`Supplier<T>\`)**: Takes no input, but **creates or provides** an item when asked (\`() -> T\`). For example: *"Generate a new random confirmation code."*

These four interfaces sit in \`java.util.function\` and form the foundation for all functional programming in modern Java. You can even chain them together, such as \`predicate.and(otherPredicate)\` or \`function.andThen(otherFunction)\`.

**Function composition using andThen() and compose()**: The \`Function\` interface supports higher-order composition: \`f1.andThen(f2)\` applies \`f1\` then \`f2\`, whereas \`f1.compose(f2)\` applies \`f2\` first, enabling modular pipeline composition.`,
        keyIdea: 'The four core functional interfaces standardize testing (Predicate), transforming (Function), acting (Consumer), and providing (Supplier).',
        diagramState: 'functional-interfaces',
        diagramAlt: 'Architecture diagram illustrating The 4 fundamental roles in an office team: The 4 fundamental roles in an office team.',
      },
      {
        id: 'step-3',
        title: 'Optional Null-Safety Best Practices',
        subtitle: 'The transparent gift box that prevents empty surprises',
        duration: '2 min',
        type: 'recap',
        content: `Computer scientist Tony Hoare famously called the invention of \`null\` his "billion-dollar mistake" because unhandled null values cause millions of application crashes worldwide.

In Java 8, \`Optional<T>\` was created to fix this:
- Instead of returning \`null\` when an item might not exist (like searching for a user that isn't in the database), a method returns an \`Optional<User>\`.
- Think of it as a transparent gift box: anyone holding the box can see immediately whether there is a real value inside or whether it's empty, without risking an unexpected crash!

**Best Practices for Beginners**:
- **DO** use \`Optional\` as the return type for methods that might find nothing (like database queries).
- **DO** use clean functional chaining: \`userOptional.map(User::getEmail).orElse("no-reply@bank.com")\`.
- **DON'T** call \`optional.get()\` without checking \`isPresent()\` first—that defeats the whole purpose and can still crash!`,
        keyIdea: 'Optional makes the possibility of missing data explicit in your code, preventing unexpected NullPointerExceptions.',
        codeExample: {
          language: 'java',
          title: 'OptionalBestPractice.java',
          code: `import java.util.Optional;

public class OptionalBestPractice {
    record Address(String city) {}
    record Customer(Address address) {}
    record Policy(Customer customer) {}

    // Clean, null-safe functional chain:
    public String getCustomerCity(Optional<Policy> policyOptional) {
        return policyOptional
            .map(Policy::customer)
            .map(Customer::address)
            .map(Address::city)
            .filter(city -> !city.isBlank())
            .orElse("Unknown City");
    }
}`,
        },
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating OptionalBestPractice.java: The transparent gift box that prevents empty surprises.',
      },
    ],
  },
  {
    id: 'generics',
    slug: 'generics',
    title: 'Generics Deep Dive & PECS Principle',
    subtitle: 'Type safety at compile-time, wildcard bounds (extends/super), and JVM type erasure mechanics.',
    moduleId: '02',
    moduleTitle: '02. Collections & Streams',
    duration: '8 min',
    difficulty: 'Intermediate',
    youllLearn: [
      'Why Generics exist: eliminating runtime ClassCastExceptions',
      'The Producer Extends, Consumer Super (PECS) principle',
      'Upper-bounded (? extends T) vs Lower-bounded (? super T) wildcards',
      'Type Erasure: how the compiler preserves backward compatibility',
      'Heap pollution and reifiable vs non-reifiable types',
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Generics Compile-Time Type Safety',
        subtitle: 'Labeling storage containers in a chemistry lab',
        duration: '2 min',
        type: 'concept',
        content: `Imagine working in a science lab. If all bottles on the shelf are unlabeled glass jars holding mystery liquids, someone might accidentally pour vinegar into a beaker meant for pure water and ruin the experiment. But if every jar has a clear, permanent label like *"Distilled Water Only"*, nobody makes a mistake.

Before Java 5, collections were like those unlabeled jars—they stored raw \`Object\` references. A developer could accidentally add an \`Integer\` to a list meant for \`String\` names. The code compiled without any complaint, only to crash in production with a fatal \`ClassCastException\`!

**Generics** add clear type labels using angle brackets: \`List<String>\`.
- The compiler acts as a strict lab inspector: it blocks you from putting an integer into a string list before your code ever runs.
- It also saves you from writing clumsy manual casts like \`(String) list.get(0)\`.`,
        keyIdea: 'Generics catch type mismatches at compile time, eliminating runtime ClassCastException crashes.',
        diagramState: 'compile-type-safety',
        diagramAlt: 'Architecture diagram illustrating Labeling storage containers in a chemistry lab: Labeling storage containers in a chemistry lab.',
      },
      {
        id: 'step-2',
        title: 'The PECS Principle',
        subtitle: 'The fruit buffet tray vs the fruit compost bin',
        duration: '3 min',
        type: 'insight',
        content: `One of the most famous rules in Java is the **PECS Principle** (coined by Joshua Bloch in *Effective Java*): **Producer Extends, Consumer Super**.

Think of two different fruit stations:
1. **The Fruit Buffet Tray (Producer Extends - \`? extends Fruit\`)**:
   - Guests walk up to this tray to **take fruit out** (the tray *produces* fruit for you).
   - The tray might hold apples or bananas. You can safely pick up any piece of fruit and eat it because you know it's at least a \`Fruit\`.
   - But you **cannot** put new items onto the tray! If the tray is actually a special \`List<Apple>\`, putting an orange in would ruin the apple tray.
2. **The Fruit Compost Bin (Consumer Super - \`? super Apple\`)**:
   - You walk up to this bin to **put apple cores in** (the bin *consumes* apples from you).
   - You can safely toss any \`Apple\` into the bin, because whether the bin is labeled for Apples, all Fruit, or all Objects, an Apple is reliably accepted by the consumer!
   - But you cannot safely pull items out to eat, because all you know is that it's an unknown \`Object\`.

**Upper-bounded (? extends T) vs Lower-bounded (? super T) wildcards**: Upper-bounded wildcards (\`? extends T\`) restrict types to subtypes of \`T\` for safe reading, while lower-bounded wildcards (\`? super T\`) restrict types to supertypes of \`T\` for safe writing.`,
        keyIdea: 'Use ? extends T when reading items out of a collection (Producer); use ? super T when adding items into a collection (Consumer).',
        codeExample: {
          language: 'java',
          title: 'PecsInPractice.java',
          code: `import java.util.ArrayList;
import java.util.List;

public class PecsInPractice {
    // Producer Extends: Reading numbers out of 'src'
    // Consumer Super: Adding numbers into 'dest'
    public static <T> void copy(List<? super T> dest, List<? extends T> src) {
        for (T item : src) {
            dest.add(item); // Safe: dest accepts T or any supertype of T!
        }
    }

    public static void main(String[] args) {
        List<Integer> integers = List.of(1, 2, 3);
        List<Number> numbers = new ArrayList<>();
        
        copy(numbers, integers);
        System.out.println("Copied numbers: " + numbers); // Prints: [1, 2, 3]
    }
}`,
        },
        interviewTip: 'What is the PECS rule in Java Generics? PECS stands for Producer Extends, Consumer Super. If a generic collection supplies data to you, use <? extends T>. If a generic collection consumes data that you provide, use <? super T>.',
        diagramState: 'pecs-wildcards',
        diagramAlt: 'Architecture diagram illustrating PecsInPractice.java: The fruit buffet tray vs the fruit compost bin.',
      },
      {
        id: 'step-3',
        title: 'Type Erasure Bridge Methods',
        subtitle: 'Erasing the pencil guidelines from the blueprint',
        duration: '3 min',
        type: 'recap',
        content: `When Java 5 introduced Generics in 2004, the designers faced a massive challenge: there were already billions of lines of older Java 1.4 code running in production worldwide. If the new Java broke older programs, companies would refuse to upgrade.

To ensure 100% backward compatibility, Java uses a clever mechanism called **Type Erasure**:
1. While you are writing code in your IDE, the compiler strictly enforces your generic types (\`List<String>\`).
2. But once the compiler verifies everything is safe, it **erases** the generic type information from the bytecode! In the final \`.class\` file, \`List<String>\` simply becomes a plain old raw \`List\`.
3. The compiler automatically inserts synthetic bridge methods to preserve polymorphic overrides in parameterized subclasses.
4. Developers must be careful with raw types and varargs arrays to avoid heap pollution, where a generic reference points to an incompatible object at runtime.

**What This Means for Beginners**:
Because generic types are erased at runtime, you cannot check generic types at runtime! Code like \`new T()\` or \`list instanceof List<String>\` will not compile, because by the time the code runs on the JVM, the specific type \`String\` has already been erased.`,
        keyIdea: 'Type erasure removes generic types after compilation, synthesizing bridge methods and avoiding heap pollution while maintaining backward compatibility.',
        diagramState: 'recap',
        diagramAlt: 'Architecture diagram illustrating Erasing the pencil guidelines from the blueprint: Erasing the pencil guidelines from the blueprint.',
      },
    ],
  },
];
