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
];
