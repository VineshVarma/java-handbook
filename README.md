# Java Handbook

An interactive visual handbook for mastering Java and JVM internals — step-by-step interactive diagrams, clear real-world analogies, and copy-pasteable snippets.

Live at: [https://java-handbook.vercel.app](https://java-handbook.vercel.app)

Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development & Testing

Prerequisites: Node.js 18+ and JDK 21.

Before running the test suite, install dependencies cleanly using `npm ci`:

```bash
npm ci
npm test
```

Running `npm test` executes all five automated CI audit guards:
- **Diagrams Audit** (`scripts/audit-diagrams.mjs`): Verifies all 96 interactive steps have registered diagram renderers.
- **Snippet Compilation** (`scripts/compile-snippets.mjs`): Compiles all 38 curricular Java code snippets under OpenJDK 21 `javac`.
- **Objectives Audit** (`scripts/audit-objectives.mjs`): Enforces 100% pedagogical backing for all 140 "You'll Learn" objectives and subtitle promises with concept-pair verification.
- **Copy & House Style Lint** (`scripts/lint-copy.mjs`): Checks title lengths, colons, banned absolutes, sensational multipliers, and micro-check answer distribution.
- **Factual Claims Audit** (`scripts/audit-facts.mjs`): Validates 34 core technical accuracy claims across the curriculum.

To build the static export for production:

```bash
npm run build
```

## Modules

1. **Java Foundations** — How Java runs, data types, OOP, memory, exceptions
2. **Collections & Streams** — Collections framework, Streams API, lambdas, generics
3. **Concurrency & Async** — Threads, CompletableFuture, ExecutorService
4. **Spring Boot & Microservices** — Request lifecycle, DI, microservices patterns
5. **REST API & Security** — REST design, JWT, OAuth2
6. **Database & Persistence** — MongoDB document model
7. **DevOps & CI/CD** — CI/CD pipelines, observability stack
