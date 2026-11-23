import { Lesson, Module } from '@/lib/types';
import { foundationsLessons } from './lessons-foundations';
import { collectionsLessons } from './lessons-collections';
import { concurrencyLessons } from './lessons-concurrency';
import { springLessons } from './lessons-spring';
import { securityLessons } from './lessons-security';
import { devopsLessons } from './lessons-devops';

export const allLessons: Lesson[] = [
  ...foundationsLessons,
  ...collectionsLessons,
  ...concurrencyLessons,
  ...springLessons,
  ...securityLessons,
  ...devopsLessons,
];

export const modules: Module[] = [
  {
    id: '01',
    title: '01. Java Foundations',
    description: 'The Java Virtual Machine operates as a tiered execution pipeline: source code is compiled into platform-neutral bytecode, verified by linking security checks, and dynamically converted into optimized native machine instructions by JIT compilers while generational garbage collectors manage memory lifecycles.',
    lessons: foundationsLessons,
  },
  {
    id: '02',
    title: '02. Collections & Streams',
    description: 'In-memory data structures function as indexed catalog architectures: contiguous arrays leverage hardware cache-line spatial locality, hashed buckets balance key distribution with treeification thresholds, and stream pipelines compose lazy functional transformations without intermediate collection allocations.',
    lessons: collectionsLessons,
  },
  {
    id: '03',
    title: '03. Concurrency & Async',
    description: 'Concurrent execution functions as cooperative hardware scheduling: the JVM orchestrates platform threads across CPU cores using hardware memory barriers to enforce cache coherence, while virtual thread continuations yield carrier threads during blocking I/O to maximize throughput.',
    lessons: concurrencyLessons,
  },
  {
    id: '04',
    title: '04. Spring Boot & Microservices',
    description: 'Modern enterprise frameworks operate as modular assembly pipelines: the inversion-of-control container resolves dependency graphs and manages component lifecycles, routing inbound HTTP payloads through structured architectural layers protected by circuit breaker fault isolation.',
    lessons: springLessons,
  },
  {
    id: '05',
    title: '05. REST API & Security',
    description: 'Enterprise web security operates as decentralized cryptographic verification: distributed resource servers independently authenticate stateless RS256 token signatures against cached authorization server public keys (JWKS), strictly enforcing authorization scopes without database lookups.',
    lessons: securityLessons,
  },
  {
    id: '06',
    title: '06. Database & Persistence',
    description: 'Persistence engines represent access pattern trade-offs: relational databases enforce normalized constraints and multi-table ACID transactions, whereas document stores optimize query performance by collocating bounded hierarchical entities into self-contained BSON documents.',
    lessons: devopsLessons.filter((l) => l.moduleId === '06'),
  },
  {
    id: '07',
    title: '07. DevOps & Observability',
    description: 'Continuous delivery and operations function as automated telemetry feedback loops: code changes flow through gated build, test, and security pipelines, while runtime telemetry (metrics, structured logs, and distributed traces) provides continuous visibility to isolate and resolve system regressions.',
    lessons: devopsLessons.filter((l) => l.moduleId === '07'),
  },
];

export const getLessonBySlug = (slug: string): Lesson | undefined =>
  allLessons.find((l) => l.slug === slug);

export const getModuleById = (id: string): Module | undefined =>
  modules.find((m) => m.id === id);

export { allLessons as lessons };
