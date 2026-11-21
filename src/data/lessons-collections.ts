import { Lesson } from '@/lib/types';

export const collectionsLessons: Lesson[] = [
  {
    id: 'collections-framework',
    slug: 'collections-framework',
    title: 'Collections Framework Deep Dive',
    subtitle: 'Navigate the collection hierarchy and master ArrayList, LinkedList, and HashMap bucket internals.',
    moduleId: '02',
    moduleTitle: '02. Collections & Streams',
    duration: '15 min',
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
        title: 'The Collection Interface Hierarchy',
        subtitle: 'The foundation of in-memory data structures in Java',
        type: 'concept',
        content: `The Java Collections Framework sits under \`java.util\` and provides reusable architectures for managing object groups.

At the root sits the **\`Iterable<T>\`** interface, which allows any collection to be traversed in a modern \`for-each\` loop or converted into a stream. Extending it is **\`Collection<T>\`**, which forks into three major interfaces:
1. **\`List<E>\`**: Ordered sequence with index-based access (duplicates allowed).
2. **\`Set<E>\`**: Unique elements with no duplicates (based on \`equals()\` and \`hashCode()\`).
3. **\`Queue<E>\`**: FIFO ordering for task scheduling and buffer queues.

Notice that **\`Map<K, V>\`** does NOT implement the Collection interface because it operates on key-value pairs rather than standalone elements.`,
        keyIdea: 'List, Set, and Queue share the Collection interface; Map is an independent key-value mapping hierarchy.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'ArrayList vs LinkedList: CPU Cache Locality',
        subtitle: 'Why ArrayList almost always outperforms LinkedList',
        type: 'trade-off',
        content: `Textbooks often claim that LinkedList has O(1) insertions/deletions and is better for dynamic lists. In real-world enterprise applications on modern CPUs, **\`ArrayList\` almost always beats \`LinkedList\`**.

Why?
1. **CPU Cache Locality**: An \`ArrayList\` wraps a contiguous \`Object[]\` array in memory. Modern CPUs fetch cache lines (typically 64 bytes). Reading sequential array elements hits L1/L2 cache with near-zero latency.
2. **LinkedList Overhead**: A \`LinkedList\` allocates a separate \`Node\` object for every single element, scattering pointers across the heap and triggering expensive CPU cache misses. In addition, each node consumes 24 bytes of pointer overhead!`,
        keyIdea: 'ArrayList benefits from contiguous memory cache-line prefetching, outperforming node-based LinkedList in practically every benchmark.',
        codeExample: {
          title: 'ArrayList Capacity Preallocation',
          code: `// Suboptimal: default capacity 10 causes repeated array resize & copy
List<PolicyDTO> policies = new ArrayList<>();

// Production optimization: Preallocate capacity if expected size is known!
int expectedPolicies = 10_000;
List<PolicyDTO> optimizedList = new ArrayList<>(expectedPolicies);`,
        },
        interviewTip: 'How does ArrayList grow when it reaches capacity? It creates a new array 1.5x larger (newCapacity = oldCapacity + (oldCapacity >> 1)) and copies elements via System.arraycopy().',
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'HashMap Internals: Hash, Buckets & Treeify',
        subtitle: 'How HashMap achieves O(1) average lookup time',
        type: 'solution',
        content: `A **\`HashMap\`** stores entries in an internal bucket array of \`Node<K,V>[]\`.

When you call \`map.put(key, value)\`:
1. The JVM invokes \`key.hashCode()\` and applies an internal bit-spread hash function to distribute hashes evenly across high and low bits.
2. The bucket index is calculated via bitwise AND: \`index = (n - 1) & hash\` (where \`n\` is bucket array length, always a power of 2).
3. If two different keys map to the same bucket, a **Hash Collision** occurs. In Java 7, collisions were resolved purely with linked lists (O(n) worst case).
4. **Treeification (Java 8+)**: When a bucket’s linked list exceeds **8 elements** (TREEIFY_THRESHOLD) and total map capacity is at least 64, the bucket transforms into a balanced **Red-Black Tree**, reducing worst-case search latency from O(n) to **O(log n)**!`,
        keyIdea: 'HashMap combines bucket arrays with linked lists that convert to Red-Black trees when collisions exceed 8 items.',
        codeExample: {
          title: 'HashCodeEqualsContract.java',
          code: `public class CustomerKey {
    private final String ssn;
    private final String countryCode;

    public CustomerKey(String ssn, String countryCode) {
        this.ssn = ssn;
        this.countryCode = countryCode;
    }

    // MANDATORY: If two objects are equal according to equals(),
    // they MUST produce the exact same hashCode()!
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CustomerKey that)) return false;
        return Objects.equals(ssn, that.ssn) &&
               Objects.equals(countryCode, that.countryCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ssn, countryCode);
    }
}`,
        },
        interviewTip: 'What happens if two objects return the same hashCode() but are not equal according to equals()? A hash collision occurs. Both objects are stored in the same bucket linked list (or Red-Black tree). The equals() method is then used during get() to identify the exact key.',
        diagramState: 'default',
      },
      {
        id: 'step-4',
        title: 'ConcurrentHashMap: Lock Striping & CAS',
        subtitle: 'Thread-safe reads without blocking writer threads',
        type: 'insight',
        content: `Using \`Collections.synchronizedMap()\` wraps every method in a single synchronized lock, killing concurrency.

**\`ConcurrentHashMap\`** achieves high concurrency through:
- **Lock-Free Reads**: The \`get()\` method uses volatile reads without acquiring any lock at all!
- **CAS (Compare-And-Swap)**: On insertion, if a bucket node is empty, it uses hardware-level atomic CAS without locking.
- **Bucket-Level Synchronized**: When collision occurs on a non-empty bucket, it locks only that individual bucket node (\`synchronized(node)\`), allowing other threads to simultaneously read and write to all other buckets!`,
        keyIdea: 'ConcurrentHashMap provides non-blocking volatile reads and fine-grained bucket-level synchronization for high-throughput concurrency.',
        diagramState: 'recap',
      },
    ],
  },
  {
    id: 'streams-api',
    slug: 'streams-api',
    title: 'Streams Pipeline & Functional Dataflow',
    subtitle: 'From imperative loops to declarative pipelines — filter, map, flatMap, and lazy evaluation.',
    moduleId: '02',
    moduleTitle: '02. Collections & Streams',
    duration: '12 min',
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
        title: 'Anatomy of a Stream Pipeline',
        subtitle: 'Declarative data transformations in Java 8+',
        type: 'concept',
        content: `A **Stream** is not a data structure; it does not store elements. It is a conveyor belt of computations that process elements from a source (such as a List, Set, or I/O channel) on demand.

Every stream pipeline consists of three phases:
1. **Source**: Collection, array, or generator function (\`list.stream()\`).
2. **Intermediate Operations (Zero or more)**: Transforms one stream into another (e.g. \`filter()\`, \`map()\`, \`sorted()\`, \`distinct()\`).
3. **Terminal Operation (Exactly one)**: Triggers execution and produces a result or side-effect (\`collect()\`, \`reduce()\`, \`count()\`, \`findFirst()\`).`,
        keyIdea: 'Streams do not alter their underlying data source; they yield fresh transformed results upon terminal execution.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'Lazy Evaluation & Short-Circuiting',
        subtitle: 'Nothing runs until the terminal operation is reached',
        type: 'insight',
        content: `Intermediate operations in Java streams are **Lazy**. Calling \`.filter()\` or \`.map()\` does not actually inspect or transform any data when invoked.

Instead, the JVM constructs a pipeline of linked \`Sink\` stages. Only when a **Terminal Operation** is called does data begin flowing through the pipeline.

Furthermore, operations can be **Short-Circuiting**: operations like \`limit(n)\`, \`anyMatch()\`, or \`findFirst()\` immediately terminate the stream the moment a condition is satisfied, avoiding processing the remainder of the dataset!`,
        keyIdea: 'Lazy evaluation ensures that elements are processed in a single pass, with short-circuiting eliminating unnecessary computations.',
        codeExample: {
          title: 'StreamLazinessDemo.java',
          code: `List<String> names = List.of("Alex", "Bob", "Charlie", "David", "Edward");

String firstLongName = names.stream()
    .filter(name -> {
        System.out.println("Filtering: " + name);
        return name.length() > 4;
    })
    .map(name -> {
        System.out.println("Mapping: " + name);
        return name.toUpperCase();
    })
    .findFirst() // Short-circuits!
    .orElse("None");

// Output prints:
// Filtering: Alex
// Filtering: Bob
// Filtering: Charlie
// Mapping: Charlie
// Done! "David" and "Edward" are never even evaluated!`,
        },
        interviewTip: 'Why are Streams lazy? Laziness enables performance optimizations: loop fusion (combining multiple operations into a single pass over the data) and short-circuiting (halting early without processing remaining elements).',
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'map() vs flatMap(): Flattening Nested Structures',
        subtitle: 'Transforming values vs flattening one-to-many relationships',
        type: 'solution',
        content: `A frequent interview question centers on the distinction between \`map()\` and \`flatMap()\`:

- **\`map(Function<T, R>)\`**: Transforms each input element into exactly one output element (1-to-1). E.g., converting a list of \`Customer\` objects into a list of \`String\` email addresses.
- **\`flatMap(Function<T, Stream<R>>)\`**: Used when each element maps to multiple items (1-to-many, e.g., a Customer with a list of Orders). \`flatMap\` transforms each element into a stream and flattens all inner streams into a single unified stream!`,
        keyIdea: 'Use map for 1-to-1 transformations; use flatMap to flatten nested collections or multiple streams into a single stream.',
        codeExample: {
          title: 'FlatMapEnterprisePattern.java',
          code: `record Policy(String id, List<String> beneficiaries) {}

List<Policy> policies = getCustomerPolicies();

// flatMap flattens all inner beneficiary lists into a single stream of Strings!
List<String> allBeneficiaries = policies.stream()
    .flatMap(policy -> policy.beneficiaries().stream())
    .distinct()
    .sorted()
    .collect(Collectors.toList());`,
        },
        diagramState: 'default',
      },
      {
        id: 'step-4',
        title: 'Complex Collectors & GroupingBy',
        subtitle: 'Aggregating stream data into structured domain maps',
        type: 'concept',
        content: `The **\`Collectors\`** utility class is the powerhouse of terminal operations.

Common enterprise collector patterns:
- **\`groupingBy()\`**: SQL \`GROUP BY\` equivalent, organizing items into a \`Map<Key, List<Value>>\`.
- **\`partitioningBy()\`**: Partitions elements into \`true\` and \`false\` buckets based on a Predicate.
- **\`toMap()\`**: Transforms elements into a lookup map with custom duplicate key resolution.`,
        keyIdea: 'Collectors turn flat stream pipelines into rich, structured multi-level aggregated data maps.',
        codeExample: {
          title: 'GroupingByPattern.java',
          code: `// Group policies by status and count them:
Map<PolicyStatus, Long> policyCountByStatus = policies.stream()
    .collect(Collectors.groupingBy(
        Policy::getStatus,
        Collectors.counting()
    ));

// Group policies by status and calculate total premium:
Map<PolicyStatus, Double> premiumSumByStatus = policies.stream()
    .collect(Collectors.groupingBy(
        Policy::getStatus,
        Collectors.summingDouble(Policy::getPremiumAmount)
    ));`,
        },
        diagramState: 'recap',
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
    duration: '10 min',
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
        title: 'From Anonymous Classes to Lambdas',
        subtitle: 'How Java 8 transformed functional syntax and JVM bytecode',
        type: 'concept',
        content: `Before Java 8, passing behavior as an argument required verbose **Anonymous Inner Classes**. Each anonymous class forced the compiler to generate a separate \`Enclosing$1.class\` file on disk and allocate a new object on every invocation.

A **Lambda Expression** provides a concise syntax for single-abstract-method interfaces (**Functional Interfaces** annotated with \`@FunctionalInterface\`).

Under the hood, lambdas do NOT generate anonymous class files! Instead, the JVM uses the **\`invokedynamic\`** (indy) bytecode instruction, generating a call site via \`LambdaMetafactory\` at runtime with near-zero memory footprint.`,
        keyIdea: 'Lambdas leverage invokedynamic to avoid generating separate .class files and minimize object allocation overhead.',
        codeExample: {
          title: 'AnonymousClassVsLambda.java',
          beforeCode: `// Before Java 8: Verbose Anonymous Inner Class
Collections.sort(policies, new Comparator<Policy>() {
    @Override
    public int compare(Policy p1, Policy p2) {
        return p1.getId().compareTo(p2.getId());
    }
});`,
          code: `// Modern Java: Concise Lambda Expression with Method Reference
policies.sort(Comparator.comparing(Policy::getId));`,
        },
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'The Core Functional Interfaces',
        subtitle: 'Predicate, Function, Consumer, and Supplier in java.util.function',
        type: 'solution',
        content: `The \`java.util.function\` package provides standardized contracts for functional programming:

1. **\`Predicate<T>\`**: \`T -> boolean\` (Testing a condition, e.g. \`filter(p -> p.isActive())\`).
2. **\`Function<T, R>\`**: \`T -> R\` (Transforming an input to an output, e.g. \`map(p -> p.getId())\`).
3. **\`Consumer<T>\`**: \`T -> void\` (Accepting a value and performing side effects, e.g. \`forEach(System.out::println)\`).
4. **\`Supplier<T>\`**: \`() -> T\` (Factory producing a value without input, e.g. \`Optional.orElseGet(() -> fetchDefault())\`).

Functional interfaces can be composed: \`predicate.and(otherPredicate)\` or \`function.andThen(otherFunction)\`.`,
        keyIdea: 'The four core functional interfaces standardize testing, transformation, consumption, and deferred evaluation.',
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'Optional<T>: Eliminating NullPointerExceptions',
        subtitle: 'A monadic type-safe container for values that may or may not exist',
        type: 'recap',
        content: `Sir Tony Hoare called \`null\` his "billion-dollar mistake". In Java 8, **\`Optional<T>\`** was introduced as a return type to explicitly signal that a method may not return a value.

**Optional Best Practices in Production**:
- **DO** use \`Optional\` as a return type from Repository and Service methods.
- **DO** use functional chaining: \`optional.map(...).filter(...).orElseThrow(...)\`.
- **DON'T** call \`optional.get()\` without checking \`isPresent()\` (equivalent to raw null check).
- **DON'T** use \`Optional\` as class fields, method arguments, or collection elements (it is not Serializable and wastes memory).`,
        keyIdea: 'Optional makes the possibility of absence explicit in the API contract and provides monadic chaining methods.',
        codeExample: {
          title: 'OptionalBestPractice.java',
          code: `public String getCustomerCity(String policyId) {
    return policyRepository.findById(policyId)
        .map(Policy::getCustomer)
        .map(Customer::getAddress)
        .map(Address::getCity)
        .filter(city -> !city.isBlank())
        .orElse("UNKNOWN");
}`,
        },
        diagramState: 'recap',
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
    duration: '10 min',
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
        title: 'Why Generics: Compile-Time Type Safety',
        subtitle: 'Catching type errors before your code reaches production',
        type: 'concept',
        content: `Before Java 5, collections stored raw \`Object\` references. A developer could add an \`Integer\` to a list intended for \`String\` values. The code compiled without error, only to crash in production with a fatal **\`ClassCastException\`**!

**Generics** enable compile-time type checking. By parameterizing types with angle brackets (\`List<String>\`), the compiler prevents invalid insertions and automatically inserts required casts at compile time.`,
        keyIdea: 'Generics shift type checking from runtime crashes to compile-time guarantees.',
        diagramState: 'default',
      },
      {
        id: 'step-2',
        title: 'The PECS Principle: Producer Extends, Consumer Super',
        subtitle: 'The golden rule for generic wildcard variance in Java',
        type: 'insight',
        content: `One of the most tested senior Java interview topics is the **PECS Principle** coined by Joshua Bloch in *Effective Java*:

- **Producer Extends (\`? extends T\`)**:
  - If a collection **produces** items for you to read, use \`? extends T\`.
  - You can read elements as type \`T\`, but you CANNOT write elements into it (except \`null\`) because the compiler cannot guarantee the exact subtype.
- **Consumer Super (\`? super T\`)**:
  - If a collection **consumes** items that you write into it, use \`? super T\`.
  - You can safely insert instances of \`T\` (or subtypes of \`T\`), but reading yields only raw \`Object\`.`,
        keyIdea: 'Use ? extends T when reading data out of a collection; use ? super T when writing data into a collection.',
        codeExample: {
          title: 'PecsInPractice.java',
          code: `public class CollectionUtils {
    // Producer Extends: Reading numbers from 'src'
    // Consumer Super: Writing numbers into 'dest'
    public static <T> void copy(List<? super T> dest, List<? extends T> src) {
        for (T item : src) {
            dest.add(item); // Safe: dest accepts T or supertypes of T!
        }
    }
}`,
        },
        interviewTip: 'What is the PECS rule in Java Generics? Producer Extends, Consumer Super. Use <? extends T> when reading from a collection and <? super T> when adding to a collection.',
        diagramState: 'default',
      },
      {
        id: 'step-3',
        title: 'Type Erasure: The JVM Secret',
        subtitle: 'Why generic type information disappears in bytecode',
        type: 'recap',
        content: `When Java 5 added Generics, it had to remain 100% backward-compatible with billions of lines of legacy Java 1.4 bytecode.

To achieve this without changing the JVM bytecode specification, Java uses **Type Erasure**:
1. During compilation, the compiler replaces generic type parameters with their bound (e.g. \`T\` becomes \`Object\`, or \`T extends Number\` becomes \`Number\`).
2. The compiler automatically inserts type casts in calling code.
3. In the final \`.class\` bytecode, generic type arguments do NOT exist at runtime!

*Consequence*: You cannot do \`new T()\`, \`new T[10]\`, or \`instanceof List<String>\` at runtime because type arguments are erased!`,
        keyIdea: 'Type erasure strips generic type parameters during compilation, replacing them with bounds and casts for backward compatibility.',
        diagramState: 'recap',
      },
    ],
  },
];
