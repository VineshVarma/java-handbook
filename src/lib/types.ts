export type StepType = 'problem' | 'concept' | 'solution' | 'insight' | 'trade-off' | 'recap';

export interface CodeExample {
  code: string;
  language?: string;
  title?: string;
  beforeCode?: string;
}

export interface CliInspection {
  command: string;
  output?: string;
  explanation: string;
}

export interface MicroCheck {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export type DiagramState =
  // 01. Foundations
  | 'write-code' | 'compile-bytecode' | 'classloader-load' | 'verify-execute' | 'jit-compile' | 'memory-stack-heap'
  | 'encapsulation' | 'inheritance' | 'polymorphism' | 'abstraction'
  | 'eden-alloc' | 'minor-gc' | 'promotion' | 'major-gc'
  | 'primitives-stack' | 'string-pool-heap' | 'autoboxing-pitfall'
  | 'throwable-hierarchy' | 'try-with-resources-cleanup' | 'custom-exception-handling'
  | 'object-layout' | 'compressed-oops' | 'lilliput-headers' | 'tlab-allocation'
  | 'escape-graph' | 'escape-states' | 'scalar-replacement'
  | 'stw-barrier' | 'colored-pointers'
  // 02. Collections & Streams
  | 'hierarchy' | 'arraylist-vs-linkedlist' | 'hashmap-buckets-treeify' | 'concurrenthashmap-cas'
  | 'stream-pipeline' | 'lazy-short-circuit' | 'map-flatmap' | 'collectors-grouping'
  | 'lambda-desugaring' | 'functional-interfaces' | 'optional-pipeline'
  | 'compile-type-safety' | 'pecs-wildcards' | 'type-erasure'
  // 03. Concurrency
  | 'new-thread' | 'blocked-state' | 'running-state'
  | 'supply-async' | 'parallel-exec' | 'then-combine' | 'fallback-catch'
  | 'thread-pool-anatomy' | 'queue-rejection-policy' | 'virtual-thread-executor'
  | 'thread-wall' | 'carrier-mount' | 'thread-pinning'
  | 'cache-line-ping-pong' | 'contended-padding'
  | 'safepoint-stall' | 'loop-strip-mining'
  // 04. Spring Boot
  | 'http-arrives' | 'dispatcher-dispatch' | 'controller-service' | 'repo-db'
  | 'ioc-container' | 'constructor-injection' | 'bean-lifecycle'
  | 'cascading-failure' | 'circuit-breaker' | 'api-gateway'
  // 05. REST & Security
  | 'resource-uri' | 'http-methods' | 'status-codes'
  | 'auth-request' | 'jwt-mint' | 'bearer-dispatch'
  // 06. Persistence & DevOps
  | 'relational-vs-document' | 'embed-vs-reference' | 'mongotemplate-ops'
  | 'git-commit' | 'maven-build' | 'sonar-scan'
  | 'observability-pillars' | 'log-analysis' | 'rca-methodology'
  | 'offheap-vs-heap' | 'ffm-arena-lifecycle' | 'nmt-inspection'
  // Universal composite recap
  | 'recap';

export interface LessonStep {
  id: string;
  title: string;
  subtitle: string;
  type: StepType;
  content: string; // Markdown formatted educational text
  keyIdea?: string;
  codeExample?: CodeExample;
  interviewTip?: string;
  productionSymptom?: string;
  cliInspection?: CliInspection;
  microCheck?: MicroCheck;
  diagramState: DiagramState;
  diagramAlt?: string;
  duration?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  moduleId: string;
  moduleTitle: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: LessonStep[];
  youllLearn: string[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface CourseProgress {
  completedSteps: Record<string, number[]>; // slug -> array of completed step indices
  currentLessonSlug: string;
  currentStepIndex: number;
}
