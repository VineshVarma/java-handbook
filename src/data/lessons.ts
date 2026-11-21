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
    description: 'JVM architecture, bytecode, ClassLoaders, OOP, and Garbage Collection',
    lessons: foundationsLessons,
  },
  {
    id: '02',
    title: '02. Collections & Streams',
    description: 'Collection hierarchy, HashMap internals, and Streams pipeline',
    lessons: collectionsLessons,
  },
  {
    id: '03',
    title: '03. Concurrency & Async',
    description: 'Thread states, volatile, CompletableFuture, and Virtual Threads',
    lessons: concurrencyLessons,
  },
  {
    id: '04',
    title: '04. Spring Boot & Microservices',
    description: 'DispatcherServlet, Dependency Injection, and Circuit Breakers',
    lessons: springLessons,
  },
  {
    id: '05',
    title: '05. REST API & Security',
    description: 'REST design, ForgeRock AM, and stateless JWT authorization',
    lessons: securityLessons,
  },
  {
    id: '06',
    title: '06. Database & Persistence',
    description: 'MongoDB document models, MongoTemplate, and indexing',
    lessons: devopsLessons.filter((l) => l.moduleId === '06'),
  },
  {
    id: '07',
    title: '07. DevOps & Observability',
    description: 'CI/CD with Jenkins/GitLab, SonarQube, Splunk, and ELK RCA',
    lessons: devopsLessons.filter((l) => l.moduleId === '07'),
  },
];

export const getLessonBySlug = (slug: string): Lesson | undefined =>
  allLessons.find((l) => l.slug === slug);

export const getModuleById = (id: string): Module | undefined =>
  modules.find((m) => m.id === id);

export { allLessons as lessons };
