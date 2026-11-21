export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'code' | 'compiler' | 'jvm' | 'memory' | 'cpu' | 'server' | 'database' | 'client' | 'queue' | 'cloud' | 'security' | 'gateway';
  x: number;
  y: number;
  color?: string;
  icon?: string;
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  color?: string;
  dashed?: boolean;
}

export interface DiagramStateConfig {
  activeNodeIds: string[];
  highlightNodeIds: string[];
  animatedEdgeIds: string[];
  visibleNodeIds?: string[];
  metricPill?: { label: string; value: string; color?: string };
}

export interface DiagramConfig {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  states: Record<string, DiagramStateConfig>;
}

// Diagram definitions for lessons
export const lessonDiagrams: Record<string, DiagramConfig> = {
  // 01. Foundations: How Java Runs Your Code
  'how-java-runs': {
    nodes: [
      { id: 'dev', label: 'Developer', sublabel: 'Hello.java', type: 'client', x: 80, y: 220, color: '#4E8752' },
      { id: 'javac', label: 'javac', sublabel: 'Compiler', type: 'compiler', x: 230, y: 220, color: '#D9822B' },
      { id: 'bytecode', label: 'Bytecode', sublabel: 'Hello.class', type: 'code', x: 380, y: 220, color: '#4A90E2' },
      { id: 'classloader', label: 'ClassLoader', sublabel: 'Loading & Verify', type: 'jvm', x: 530, y: 140, color: '#7E57C2' },
      { id: 'jvm', label: 'JVM Engine', sublabel: 'Interpreter & JIT', type: 'jvm', x: 530, y: 300, color: '#26A69A' },
      { id: 'stack', label: 'Stack Memory', sublabel: 'Frames & Primitives', type: 'memory', x: 690, y: 120, color: '#42A5F5' },
      { id: 'heap', label: 'Heap Memory', sublabel: 'Objects & GC', type: 'memory', x: 690, y: 230, color: '#AB47BC' },
      { id: 'cpu', label: 'Host CPU / OS', sublabel: 'Native Machine Code', type: 'cpu', x: 690, y: 350, color: '#D14D41' },
    ],
    edges: [
      { id: 'e1', from: 'dev', to: 'javac', label: 'javac Hello.java', animated: true, color: '#4E8752' },
      { id: 'e2', from: 'javac', to: 'bytecode', label: 'generates .class', animated: true, color: '#D9822B' },
      { id: 'e3', from: 'bytecode', to: 'classloader', label: 'loads bytecode', animated: true, color: '#4A90E2' },
      { id: 'e4', from: 'classloader', to: 'jvm', label: 'verified classes', animated: true, color: '#7E57C2' },
      { id: 'e5', from: 'jvm', to: 'stack', label: 'push frame', animated: false, color: '#42A5F5' },
      { id: 'e6', from: 'jvm', to: 'heap', label: 'new Object()', animated: false, color: '#AB47BC' },
      { id: 'e7', from: 'jvm', to: 'cpu', label: 'JIT native instructions', animated: true, color: '#D14D41' },
    ],
    states: {
      'write-code': {
        activeNodeIds: ['dev'],
        highlightNodeIds: ['dev'],
        animatedEdgeIds: [],
        metricPill: { label: 'Source', value: 'Hello.java', color: '#4E8752' },
      },
      'compile-bytecode': {
        activeNodeIds: ['dev', 'javac'],
        highlightNodeIds: ['javac'],
        animatedEdgeIds: ['e1'],
        metricPill: { label: 'Compilation', value: 'javac target', color: '#D9822B' },
      },
      'bytecode-inspect': {
        activeNodeIds: ['javac', 'bytecode'],
        highlightNodeIds: ['bytecode'],
        animatedEdgeIds: ['e2'],
        metricPill: { label: 'Output', value: 'CAFEBABE bytecode', color: '#4A90E2' },
      },
      'classloader-load': {
        activeNodeIds: ['bytecode', 'classloader'],
        highlightNodeIds: ['classloader'],
        animatedEdgeIds: ['e3'],
        metricPill: { label: 'Subsystem', value: 'Bootstrap/App CL', color: '#7E57C2' },
      },
      'verify-execute': {
        activeNodeIds: ['classloader', 'jvm'],
        highlightNodeIds: ['jvm'],
        animatedEdgeIds: ['e4'],
        metricPill: { label: 'Execution', value: 'Bytecode Verifier OK', color: '#26A69A' },
      },
      'interpreter-run': {
        activeNodeIds: ['jvm'],
        highlightNodeIds: ['jvm'],
        animatedEdgeIds: [],
        metricPill: { label: 'Mode', value: 'Interpreter Loop', color: '#D9822B' },
      },
      'jit-compile': {
        activeNodeIds: ['jvm', 'cpu'],
        highlightNodeIds: ['cpu'],
        animatedEdgeIds: ['e7'],
        metricPill: { label: 'Tiered JIT', value: 'C1 / C2 compilation', color: '#D14D41' },
      },
      'memory-stack-heap': {
        activeNodeIds: ['jvm', 'stack', 'heap'],
        highlightNodeIds: ['stack', 'heap'],
        animatedEdgeIds: ['e5', 'e6'],
        metricPill: { label: 'Runtime Data', value: 'Stack + Heap active', color: '#42A5F5' },
      },
      'recap': {
        activeNodeIds: ['dev', 'javac', 'bytecode', 'classloader', 'jvm', 'stack', 'heap', 'cpu'],
        highlightNodeIds: ['jvm', 'cpu'],
        animatedEdgeIds: ['e1', 'e2', 'e3', 'e4', 'e7'],
        metricPill: { label: 'End-to-End', value: 'Java Runtime Ready', color: '#4E8752' },
      },
    },
  },

  // 01. Foundations: OOP Pillars
  'oop-pillars': {
    nodes: [
      { id: 'parent', label: 'PaymentService', sublabel: 'Abstract Base / Interface', type: 'code', x: 250, y: 110, color: '#4E8752' },
      { id: 'encap', label: 'Encapsulation', sublabel: 'private balance + getters', type: 'security', x: 550, y: 110, color: '#D9822B' },
      { id: 'child1', label: 'HppPaymentService', sublabel: 'Concrete Class', type: 'server', x: 180, y: 280, color: '#4A90E2' },
      { id: 'child2', label: 'CardPaymentService', sublabel: 'Concrete Class', type: 'server', x: 380, y: 280, color: '#7E57C2' },
      { id: 'client', label: 'CheckoutController', sublabel: 'Polymorphic Caller', type: 'client', x: 550, y: 280, color: '#26A69A' },
    ],
    edges: [
      { id: 'e1', from: 'child1', to: 'parent', label: 'extends / implements', animated: false, color: '#4A90E2' },
      { id: 'e2', from: 'child2', to: 'parent', label: 'extends / implements', animated: false, color: '#7E57C2' },
      { id: 'e3', from: 'client', to: 'parent', label: 'calls process()', animated: true, color: '#26A69A' },
      { id: 'e4', from: 'child1', to: 'encap', label: 'safely reads state', animated: true, color: '#D9822B' },
    ],
    states: {
      'encapsulation': {
        activeNodeIds: ['encap'],
        highlightNodeIds: ['encap'],
        animatedEdgeIds: [],
        metricPill: { label: 'Pillar 1', value: 'Data Hiding', color: '#D9822B' },
      },
      'inheritance': {
        activeNodeIds: ['parent', 'child1', 'child2'],
        highlightNodeIds: ['parent'],
        animatedEdgeIds: ['e1', 'e2'],
        metricPill: { label: 'Pillar 2', value: 'IS-A Hierarchy', color: '#4A90E2' },
      },
      'polymorphism': {
        activeNodeIds: ['client', 'parent', 'child1', 'child2'],
        highlightNodeIds: ['client', 'parent'],
        animatedEdgeIds: ['e3'],
        metricPill: { label: 'Pillar 3', value: 'Dynamic Dispatch', color: '#26A69A' },
      },
      'abstraction': {
        activeNodeIds: ['parent', 'client'],
        highlightNodeIds: ['parent'],
        animatedEdgeIds: ['e3'],
        metricPill: { label: 'Pillar 4', value: 'Contract Decoupling', color: '#4E8752' },
      },
      'recap': {
        activeNodeIds: ['parent', 'encap', 'child1', 'child2', 'client'],
        highlightNodeIds: ['parent', 'client'],
        animatedEdgeIds: ['e1', 'e2', 'e3', 'e4'],
        metricPill: { label: 'OOP Mastered', value: 'Clean Enterprise Design', color: '#4E8752' },
      },
    },
  },

  // 01. Memory & Garbage Collection
  'memory-and-gc': {
    nodes: [
      { id: 'stack', label: 'Thread Stack', sublabel: 'Local references', type: 'memory', x: 120, y: 220, color: '#4E8752' },
      { id: 'eden', label: 'Eden Space', sublabel: 'New allocations', type: 'memory', x: 300, y: 150, color: '#42A5F5' },
      { id: 'survivor', label: 'Survivor S0/S1', sublabel: 'Surviving objects', type: 'memory', x: 300, y: 290, color: '#26A69A' },
      { id: 'oldgen', label: 'Tenured / Old Gen', sublabel: 'Long-lived objects', type: 'memory', x: 500, y: 220, color: '#AB47BC' },
      { id: 'gc', label: 'G1 Garbage Collector', sublabel: 'Concurrent Mark & Sweep', type: 'server', x: 680, y: 220, color: '#D14D41' },
    ],
    edges: [
      { id: 'e1', from: 'stack', to: 'eden', label: 'ref points to new', animated: true, color: '#4E8752' },
      { id: 'e2', from: 'eden', to: 'survivor', label: 'Minor GC copy', animated: true, color: '#42A5F5' },
      { id: 'e3', from: 'survivor', to: 'oldgen', label: 'tenuring threshold (15)', animated: true, color: '#AB47BC' },
      { id: 'e4', from: 'gc', to: 'oldgen', label: 'Mixed / Major GC', animated: true, color: '#D14D41' },
    ],
    states: {
      'eden-alloc': {
        activeNodeIds: ['stack', 'eden'],
        highlightNodeIds: ['eden'],
        animatedEdgeIds: ['e1'],
        metricPill: { label: 'Allocation', value: 'Fast TLAB in Eden', color: '#42A5F5' },
      },
      'minor-gc': {
        activeNodeIds: ['eden', 'survivor', 'gc'],
        highlightNodeIds: ['survivor'],
        animatedEdgeIds: ['e2'],
        metricPill: { label: 'Young GC', value: 'Pause < 10ms', color: '#26A69A' },
      },
      'promotion': {
        activeNodeIds: ['survivor', 'oldgen'],
        highlightNodeIds: ['oldgen'],
        animatedEdgeIds: ['e3'],
        metricPill: { label: 'Promotion', value: 'Survivor -> Old Gen', color: '#AB47BC' },
      },
      'major-gc': {
        activeNodeIds: ['oldgen', 'gc'],
        highlightNodeIds: ['gc', 'oldgen'],
        animatedEdgeIds: ['e4'],
        metricPill: { label: 'G1 Collector', value: 'Concurrent Marking', color: '#D14D41' },
      },
      'recap': {
        activeNodeIds: ['stack', 'eden', 'survivor', 'oldgen', 'gc'],
        highlightNodeIds: ['gc'],
        animatedEdgeIds: ['e1', 'e2', 'e3', 'e4'],
        metricPill: { label: 'JVM Heap', value: 'Zero Memory Leaks', color: '#4E8752' },
      },
    },
  },

  // 03. Concurrency: Thread Lifecycle
  'thread-lifecycle': {
    nodes: [
      { id: 'new', label: 'NEW', sublabel: 'new Thread()', type: 'code', x: 100, y: 220, color: '#7E57C2' },
      { id: 'runnable', label: 'RUNNABLE', sublabel: 'Ready / in OS queue', type: 'server', x: 280, y: 130, color: '#4A90E2' },
      { id: 'running', label: 'RUNNING', sublabel: 'Executing on CPU Core', type: 'cpu', x: 460, y: 130, color: '#4E8752' },
      { id: 'blocked', label: 'BLOCKED', sublabel: 'Waiting for monitor lock', type: 'security', x: 340, y: 320, color: '#D9822B' },
      { id: 'waiting', label: 'WAITING / TIMED', sublabel: 'wait(), sleep(), join()', type: 'queue', x: 540, y: 320, color: '#AB47BC' },
      { id: 'terminated', label: 'TERMINATED', sublabel: 'run() returned or died', type: 'client', x: 690, y: 220, color: '#D14D41' },
    ],
    edges: [
      { id: 'e1', from: 'new', to: 'runnable', label: 'start()', animated: true, color: '#7E57C2' },
      { id: 'e2', from: 'runnable', to: 'running', label: 'OS dispatch', animated: true, color: '#4A90E2' },
      { id: 'e3', from: 'running', to: 'blocked', label: 'synchronized lock contention', animated: true, color: '#D9822B' },
      { id: 'e4', from: 'running', to: 'waiting', label: 'wait() / sleep()', animated: true, color: '#AB47BC' },
      { id: 'e5', from: 'blocked', to: 'runnable', label: 'lock acquired', animated: true, color: '#4A90E2' },
      { id: 'e6', from: 'waiting', to: 'runnable', label: 'notify() / timeout', animated: true, color: '#4A90E2' },
      { id: 'e7', from: 'running', to: 'terminated', label: 'completes', animated: true, color: '#D14D41' },
    ],
    states: {
      'new-thread': {
        activeNodeIds: ['new'],
        highlightNodeIds: ['new'],
        animatedEdgeIds: [],
        metricPill: { label: 'State', value: 'Thread allocated', color: '#7E57C2' },
      },
      'runnable-state': {
        activeNodeIds: ['new', 'runnable'],
        highlightNodeIds: ['runnable'],
        animatedEdgeIds: ['e1'],
        metricPill: { label: 'State', value: 'RUNNABLE', color: '#4A90E2' },
      },
      'running-state': {
        activeNodeIds: ['runnable', 'running'],
        highlightNodeIds: ['running'],
        animatedEdgeIds: ['e2'],
        metricPill: { label: 'State', value: 'RUNNING on Core #2', color: '#4E8752' },
      },
      'blocked-state': {
        activeNodeIds: ['running', 'blocked'],
        highlightNodeIds: ['blocked'],
        animatedEdgeIds: ['e3'],
        metricPill: { label: 'Contention', value: 'BLOCKED on Monitor', color: '#D9822B' },
      },
      'waiting-state': {
        activeNodeIds: ['running', 'waiting'],
        highlightNodeIds: ['waiting'],
        animatedEdgeIds: ['e4'],
        metricPill: { label: 'Parked', value: 'TIMED_WAITING', color: '#AB47BC' },
      },
      'terminated-state': {
        activeNodeIds: ['running', 'terminated'],
        highlightNodeIds: ['terminated'],
        animatedEdgeIds: ['e7'],
        metricPill: { label: 'Done', value: 'TERMINATED', color: '#D14D41' },
      },
      'recap': {
        activeNodeIds: ['new', 'runnable', 'running', 'blocked', 'waiting', 'terminated'],
        highlightNodeIds: ['running'],
        animatedEdgeIds: ['e1', 'e2', 'e5', 'e6', 'e7'],
        metricPill: { label: 'Thread Safety', value: 'Lifecycle Controlled', color: '#4E8752' },
      },
    },
  },

  // 03. Concurrency: CompletableFuture Pipeline
  'completable-future': {
    nodes: [
      { id: 'trigger', label: 'Client Request', sublabel: 'Fetch Policy Data', type: 'client', x: 90, y: 220, color: '#4E8752' },
      { id: 'f1', label: 'Policy Service', sublabel: 'supplyAsync (Core API)', type: 'server', x: 280, y: 120, color: '#4A90E2' },
      { id: 'f2', label: 'Payment History', sublabel: 'supplyAsync (HPP API)', type: 'server', x: 280, y: 320, color: '#7E57C2' },
      { id: 'combine', label: 'thenCombine', sublabel: 'Aggregate Both Responses', type: 'queue', x: 480, y: 220, color: '#D9822B' },
      { id: 'fallback', label: 'exceptionally', sublabel: 'Graceful Fallback Cache', type: 'database', x: 480, y: 370, color: '#D14D41' },
      { id: 'response', label: 'Aggregated DTO', sublabel: 'Return JSON to Client', type: 'code', x: 680, y: 220, color: '#26A69A' },
    ],
    edges: [
      { id: 'e1', from: 'trigger', to: 'f1', label: 'parallel fork 1', animated: true, color: '#4A90E2' },
      { id: 'e2', from: 'trigger', to: 'f2', label: 'parallel fork 2', animated: true, color: '#7E57C2' },
      { id: 'e3', from: 'f1', to: 'combine', label: 'policy result', animated: true, color: '#4A90E2' },
      { id: 'e4', from: 'f2', to: 'combine', label: 'payment result', animated: true, color: '#7E57C2' },
      { id: 'e5', from: 'f2', to: 'fallback', label: 'on timeout / error', animated: true, color: '#D14D41', dashed: true },
      { id: 'e6', from: 'combine', to: 'response', label: 'merged payload', animated: true, color: '#26A69A' },
    ],
    states: {
      'supply-async': {
        activeNodeIds: ['trigger', 'f1', 'f2'],
        highlightNodeIds: ['f1', 'f2'],
        animatedEdgeIds: ['e1', 'e2'],
        metricPill: { label: 'ForkJoinPool', value: '2 Threads Spawned', color: '#4A90E2' },
      },
      'parallel-exec': {
        activeNodeIds: ['f1', 'f2', 'combine'],
        highlightNodeIds: ['combine'],
        animatedEdgeIds: ['e3', 'e4'],
        metricPill: { label: 'Latency', value: 'Max(T1, T2) = 110ms', color: '#D9822B' },
      },
      'fallback-catch': {
        activeNodeIds: ['f2', 'fallback'],
        highlightNodeIds: ['fallback'],
        animatedEdgeIds: ['e5'],
        metricPill: { label: 'Resilience', value: 'Cached Fallback Served', color: '#D14D41' },
      },
      'then-combine': {
        activeNodeIds: ['combine', 'response'],
        highlightNodeIds: ['response'],
        animatedEdgeIds: ['e6'],
        metricPill: { label: 'Completed', value: 'DTO Dispatched', color: '#26A69A' },
      },
      'recap': {
        activeNodeIds: ['trigger', 'f1', 'f2', 'combine', 'fallback', 'response'],
        highlightNodeIds: ['combine', 'response'],
        animatedEdgeIds: ['e1', 'e2', 'e3', 'e4', 'e6'],
        metricPill: { label: 'Async Throughput', value: '4.8x Higher RPS', color: '#4E8752' },
      },
    },
  },

  // 04. Spring Boot: Request Lifecycle
  'spring-request-lifecycle': {
    nodes: [
      { id: 'client', label: 'HTTP Client', sublabel: 'GET /api/v1/policy', type: 'client', x: 80, y: 220, color: '#4E8752' },
      { id: 'filter', label: 'Filter Chain', sublabel: 'Auth & CORS Filter', type: 'security', x: 210, y: 220, color: '#D9822B' },
      { id: 'dispatcher', label: 'DispatcherServlet', sublabel: 'Front Controller', type: 'gateway', x: 350, y: 220, color: '#4A90E2' },
      { id: 'controller', label: 'PolicyController', sublabel: '@RestController', type: 'server', x: 480, y: 130, color: '#7E57C2' },
      { id: 'service', label: 'PolicyService', sublabel: '@Service Business Logic', type: 'server', x: 610, y: 130, color: '#26A69A' },
      { id: 'repo', label: 'PolicyRepository', sublabel: 'Spring Data Mongo/JPA', type: 'database', x: 610, y: 310, color: '#AB47BC' },
      { id: 'db', label: 'MongoDB / SQL', sublabel: 'Persistence Store', type: 'database', x: 480, y: 310, color: '#D14D41' },
    ],
    edges: [
      { id: 'e1', from: 'client', to: 'filter', label: 'HTTP Request', animated: true, color: '#4E8752' },
      { id: 'e2', from: 'filter', to: 'dispatcher', label: 'validated request', animated: true, color: '#D9822B' },
      { id: 'e3', from: 'dispatcher', to: 'controller', label: 'HandlerMapping route', animated: true, color: '#4A90E2' },
      { id: 'e4', from: 'controller', to: 'service', label: 'calls service method', animated: true, color: '#7E57C2' },
      { id: 'e5', from: 'service', to: 'repo', label: 'findPolicyById()', animated: true, color: '#26A69A' },
      { id: 'e6', from: 'repo', to: 'db', label: 'BSON query', animated: true, color: '#AB47BC' },
      { id: 'e7', from: 'controller', to: 'dispatcher', label: 'ResponseEntity DTO', animated: true, color: '#4A90E2' },
    ],
    states: {
      'http-arrives': {
        activeNodeIds: ['client', 'filter'],
        highlightNodeIds: ['filter'],
        animatedEdgeIds: ['e1'],
        metricPill: { label: 'Inbound', value: 'TLS Terminated', color: '#4E8752' },
      },
      'dispatcher-dispatch': {
        activeNodeIds: ['filter', 'dispatcher'],
        highlightNodeIds: ['dispatcher'],
        animatedEdgeIds: ['e2'],
        metricPill: { label: 'Routing', value: 'HandlerMapping match', color: '#4A90E2' },
      },
      'controller-service': {
        activeNodeIds: ['dispatcher', 'controller', 'service'],
        highlightNodeIds: ['controller', 'service'],
        animatedEdgeIds: ['e3', 'e4'],
        metricPill: { label: 'Layering', value: 'DTO -> Domain logic', color: '#7E57C2' },
      },
      'repo-db': {
        activeNodeIds: ['service', 'repo', 'db'],
        highlightNodeIds: ['repo', 'db'],
        animatedEdgeIds: ['e5', 'e6'],
        metricPill: { label: 'Data Access', value: 'Repository query', color: '#AB47BC' },
      },
      'recap': {
        activeNodeIds: ['client', 'filter', 'dispatcher', 'controller', 'service', 'repo', 'db'],
        highlightNodeIds: ['dispatcher', 'controller'],
        animatedEdgeIds: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7'],
        metricPill: { label: 'HTTP 200 OK', value: 'Jackson serialized JSON', color: '#4E8752' },
      },
    },
  },

  // 05. Security: JWT & OAuth2 Flow
  'jwt-oauth2': {
    nodes: [
      { id: 'spa', label: 'Client Browser', sublabel: 'React / Mobile App', type: 'client', x: 100, y: 220, color: '#4E8752' },
      { id: 'am', label: 'ForgeRock AM', sublabel: 'OAuth2 Authorization Server', type: 'security', x: 300, y: 120, color: '#D9822B' },
      { id: 'gateway', label: 'API Gateway', sublabel: 'JWT Signature Verifier', type: 'gateway', x: 480, y: 220, color: '#4A90E2' },
      { id: 'backend', label: 'Spring Backend', sublabel: 'Protected Microservice', type: 'server', x: 680, y: 220, color: '#7E57C2' },
    ],
    edges: [
      { id: 'e1', from: 'spa', to: 'am', label: 'POST /oauth2/token', animated: true, color: '#D9822B' },
      { id: 'e2', from: 'am', to: 'spa', label: 'returns Access + Refresh JWT', animated: true, color: '#D9822B' },
      { id: 'e3', from: 'spa', to: 'gateway', label: 'Bearer <JWT> in Header', animated: true, color: '#4E8752' },
      { id: 'e4', from: 'gateway', to: 'backend', label: 'forward validated user info', animated: true, color: '#4A90E2' },
    ],
    states: {
      'auth-request': {
        activeNodeIds: ['spa', 'am'],
        highlightNodeIds: ['am'],
        animatedEdgeIds: ['e1'],
        metricPill: { label: 'Grant Type', value: 'Authorization Code + PKCE', color: '#D9822B' },
      },
      'jwt-mint': {
        activeNodeIds: ['am', 'spa'],
        highlightNodeIds: ['spa'],
        animatedEdgeIds: ['e2'],
        metricPill: { label: 'Token Minted', value: 'RS256 Signed JWT', color: '#4A90E2' },
      },
      'bearer-dispatch': {
        activeNodeIds: ['spa', 'gateway'],
        highlightNodeIds: ['gateway'],
        animatedEdgeIds: ['e3'],
        metricPill: { label: 'Gateway Check', value: 'JWKS Key Validation', color: '#4E8752' },
      },
      'backend-protect': {
        activeNodeIds: ['gateway', 'backend'],
        highlightNodeIds: ['backend'],
        animatedEdgeIds: ['e4'],
        metricPill: { label: 'Authorized', value: 'SecurityContextHolder Populated', color: '#7E57C2' },
      },
      'recap': {
        activeNodeIds: ['spa', 'am', 'gateway', 'backend'],
        highlightNodeIds: ['gateway', 'backend'],
        animatedEdgeIds: ['e1', 'e2', 'e3', 'e4'],
        metricPill: { label: 'Zero Trust', value: 'Stateless JWT Architecture', color: '#4E8752' },
      },
    },
  },

  // 07. DevOps: CI/CD Pipeline
  'cicd-pipeline': {
    nodes: [
      { id: 'git', label: 'GitLab / GitHub', sublabel: 'git push origin main', type: 'code', x: 80, y: 220, color: '#4E8752' },
      { id: 'jenkins', label: 'Jenkins CI', sublabel: 'Pipeline Webhook', type: 'server', x: 230, y: 220, color: '#D9822B' },
      { id: 'maven', label: 'Maven Build', sublabel: 'mvn clean test verify', type: 'compiler', x: 380, y: 220, color: '#4A90E2' },
      { id: 'sonar', label: 'SonarQube & Fortify', sublabel: 'Quality Gate & Security Scan', type: 'security', x: 530, y: 130, color: '#AB47BC' },
      { id: 'artifactory', label: 'Docker Registry', sublabel: 'Oci Container Image', type: 'cloud', x: 530, y: 310, color: '#26A69A' },
      { id: 'prod', label: 'Cloud / WildFly', sublabel: 'Zero Downtime Deployment', type: 'server', x: 690, y: 220, color: '#D14D41' },
    ],
    edges: [
      { id: 'e1', from: 'git', to: 'jenkins', label: 'trigger pipeline', animated: true, color: '#4E8752' },
      { id: 'e2', from: 'jenkins', to: 'maven', label: 'run unit tests', animated: true, color: '#D9822B' },
      { id: 'e3', from: 'maven', to: 'sonar', label: 'SAST inspection', animated: true, color: '#AB47BC' },
      { id: 'e4', from: 'sonar', to: 'artifactory', label: 'quality gate passed', animated: true, color: '#26A69A' },
      { id: 'e5', from: 'artifactory', to: 'prod', label: 'canary rollout', animated: true, color: '#D14D41' },
    ],
    states: {
      'git-commit': {
        activeNodeIds: ['git', 'jenkins'],
        highlightNodeIds: ['git'],
        animatedEdgeIds: ['e1'],
        metricPill: { label: 'Trigger', value: 'commit sha: 8f9b2a1', color: '#4E8752' },
      },
      'maven-build': {
        activeNodeIds: ['jenkins', 'maven'],
        highlightNodeIds: ['maven'],
        animatedEdgeIds: ['e2'],
        metricPill: { label: 'Testing', value: '450 Unit Tests 100% Pass', color: '#4A90E2' },
      },
      'sonar-scan': {
        activeNodeIds: ['maven', 'sonar'],
        highlightNodeIds: ['sonar'],
        animatedEdgeIds: ['e3'],
        metricPill: { label: 'Quality Gate', value: '0 Vulnerabilities / A Rating', color: '#AB47BC' },
      },
      'deploy-stage': {
        activeNodeIds: ['sonar', 'artifactory', 'prod'],
        highlightNodeIds: ['prod'],
        animatedEdgeIds: ['e4', 'e5'],
        metricPill: { label: 'Promotion', value: 'Rolling Production Release', color: '#D14D41' },
      },
      'recap': {
        activeNodeIds: ['git', 'jenkins', 'maven', 'sonar', 'artifactory', 'prod'],
        highlightNodeIds: ['prod'],
        animatedEdgeIds: ['e1', 'e2', 'e3', 'e4', 'e5'],
        metricPill: { label: 'CI/CD Velocity', value: 'Automated 15min Pipeline', color: '#4E8752' },
      },
    },
  },
};

// Fallback diagram generator for any lesson that uses generic component interactions
export function getDiagramForLesson(slug: string): DiagramConfig {
  if (lessonDiagrams[slug]) {
    return lessonDiagrams[slug];
  }

  // Sensible default interactive diagram
  return {
    nodes: [
      { id: 'n1', label: 'Java 21 Client', sublabel: 'Input / Caller', type: 'client', x: 120, y: 220, color: '#4E8752' },
      { id: 'n2', label: 'Java Engine', sublabel: 'Core Abstraction', type: 'jvm', x: 380, y: 220, color: '#4A90E2' },
      { id: 'n3', label: 'Memory / State', sublabel: 'Heap & Stack', type: 'memory', x: 380, y: 380, color: '#7E57C2' },
      { id: 'n4', label: 'Output / Store', sublabel: 'Target Resource', type: 'database', x: 650, y: 220, color: '#D9822B' },
    ],
    edges: [
      { id: 'e1', from: 'n1', to: 'n2', label: 'invokes concept', animated: true, color: '#4E8752' },
      { id: 'e2', from: 'n2', to: 'n3', label: 'state mutation', animated: true, color: '#7E57C2' },
      { id: 'e3', from: 'n2', to: 'n4', label: 'produces result', animated: true, color: '#D9822B' },
    ],
    states: {
      default: {
        activeNodeIds: ['n1', 'n2', 'n3', 'n4'],
        highlightNodeIds: ['n2'],
        animatedEdgeIds: ['e1', 'e2', 'e3'],
        metricPill: { label: 'Concept Active', value: 'Java Runtime Ready', color: '#4E8752' },
      },
    },
  };
}
