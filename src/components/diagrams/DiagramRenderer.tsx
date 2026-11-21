'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IsoBlock,
  IsoDatabase,
  IsoLaptop,
  IsoPedestal,
} from './IsoShapes';

interface DiagramRendererProps {
  lessonSlug: string;
  diagramState: string;
  isPlaying: boolean;
}

export function DiagramRenderer({
  lessonSlug,
  diagramState,
  isPlaying,
}: DiagramRendererProps) {
  // 01. Foundations
  if (lessonSlug === 'how-java-runs') {
    return <JavaExecutionStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'oop-pillars') {
    return <OopPillarsStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'memory-and-gc') {
    return <MemoryGcStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'java-data-types') {
    return <DataTypesMemoryStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'exception-handling') {
    return <ExceptionHandlingStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  // 02. Collections & Streams
  if (lessonSlug === 'collections-framework') {
    return <HashMapCollectionsStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'streams-api' || lessonSlug === 'lambdas-functional') {
    return <StreamsPipelineStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'generics') {
    return <GenericsTypeErasureStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  // 03. Concurrency
  if (lessonSlug === 'thread-lifecycle') {
    return <ThreadLifecycleStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'completable-future') {
    return <CompletableFutureStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'executor-service') {
    return <ThreadPoolExecutorStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  // 04. Spring Boot
  if (lessonSlug === 'spring-request-lifecycle') {
    return <SpringLifecycleStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'dependency-injection') {
    return <DependencyInjectionStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'microservices-patterns') {
    return <MicroservicesResilienceStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  // 05. REST & Security
  if (lessonSlug === 'rest-api-design') {
    return <RestApiDesignStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'jwt-oauth2') {
    return <JwtOAuth2Stage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  // 06. Persistence & DevOps
  if (lessonSlug === 'mongodb-document-model') {
    return <MongoDbPersistenceStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'cicd-pipeline') {
    return <CiCdPipelineStage diagramState={diagramState} isPlaying={isPlaying} />;
  }
  if (lessonSlug === 'observability-stack') {
    return <ObservabilityStackStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  // Fallback
  return <HashMapCollectionsStage diagramState={diagramState} isPlaying={isPlaying} />;
}

// -------------------------------------------------------------
// 02. HashMap Internals & Collections Deep Dive
// -------------------------------------------------------------
function HashMapCollectionsStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  const isArrayList = diagramState === 'arraylist-vs-linkedlist';
  const isHierarchy = diagramState === 'hierarchy';
  const isCas = diagramState === 'concurrenthashmap-cas';
  const isTreeify = diagramState === 'hashmap-buckets-treeify' || (!isArrayList && !isHierarchy && !isCas);

  if (isHierarchy) {
    return (
      <StageContainer
        telemetry={[
          { label: 'ROOT INTERFACE', value: 'Iterable<T>' },
          { label: 'CORE CONTRACT', value: 'Collection<T>' },
          { label: 'ELEMENT TYPES', value: 'List, Set, Queue' },
          { label: 'KEY-VALUE', value: 'Map<K, V> (Independent)' },
        ]}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Collections Hierarchy" />
        <IsoBlock cx={250} cy={160} label="Iterable<T>" sublabel="for-each / iterator()" topColor="#4A90E2" badge="Root Interface" />
        <IsoBlock cx={450} cy={160} label="Collection<T>" sublabel="size() / add() / stream()" topColor="#4E8752" badge="Core Contract" isHighlighted={true} />
        <IsoBlock cx={300} cy={270} label="List<E>" sublabel="ArrayList / LinkedList" topColor="#D9822B" badge="Indexed Order" />
        <IsoBlock cx={450} cy={270} label="Set<E>" sublabel="HashSet / TreeSet" topColor="#AB47BC" badge="Unique Only" />
        <IsoBlock cx={600} cy={270} label="Queue<E>" sublabel="ArrayDeque / PriorityQueue" topColor="#26A69A" badge="FIFO Buffer" />
        <IsoBlock cx={730} cy={180} label="Map<K, V>" sublabel="HashMap / ConcurrentMap" topColor="#D14D41" badge="Key-Value (Separate)" isHighlighted={true} />
        <IsoPath d="M 250 160 L 450 160" color="#4A90E2" isPlaying={isPlaying} />
        <IsoPath d="M 450 160 L 300 270" color="#D9822B" isPlaying={isPlaying} />
        <IsoPath d="M 450 160 L 450 270" color="#AB47BC" isPlaying={isPlaying} />
        <IsoPath d="M 450 160 L 600 270" color="#26A69A" isPlaying={isPlaying} />
      </StageContainer>
    );
  }

  if (isArrayList) {
    return (
      <StageContainer
        telemetry={[
          { label: 'DATA STRUCTURE', value: 'ArrayList vs LinkedList' },
          { label: 'CPU L1/L2 CACHE', value: '64-Byte Cache Line Hit' },
          { label: 'ARRAYLIST TIME', value: 'O(1) Random Access' },
          { label: 'LINKEDLIST COST', value: '24B Pointer Misses' },
        ]}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Memory Locality & Cache Lines" />
        <IsoBlock cx={240} cy={180} label="ArrayList Object[]" sublabel="Contiguous Memory" topColor="#4E8752" badge="Cache Friendly" isHighlighted={true} />
        <IsoBlock cx={420} cy={160} label="CPU Cache Line" sublabel="Pre-fetches 64 Bytes" topColor="#4A90E2" badge="Zero Misses" />
        <IsoBlock cx={620} cy={160} label="L1/L2 Registers" sublabel="Instant Cycle Access" topColor="#26A69A" badge="~1 ns Latency" />
        <IsoBlock cx={320} cy={320} label="LinkedList Node" sublabel="Heap Pointer" topColor="#D14D41" badge="Pointer Jump" />
        <IsoBlock cx={520} cy={320} label="Scattered Nodes" sublabel="Heap Allocation" topColor="#AB47BC" badge="Cache Miss" />
        <IsoPath d="M 240 180 L 420 160" color="#4E8752" isPlaying={isPlaying} />
        <IsoPath d="M 420 160 L 620 160" color="#26A69A" isPlaying={isPlaying} />
        <IsoPath d="M 320 320 L 520 320" color="#D14D41" isPlaying={isPlaying} />
      </StageContainer>
    );
  }

  if (isCas) {
    return (
      <StageContainer
        telemetry={[
          { label: 'CONCURRENCY', value: 'ConcurrentHashMap' },
          { label: 'READ THREADS', value: 'Lock-Free (Volatile)' },
          { label: 'EMPTY BUCKET', value: 'Atomic CAS' },
          { label: 'COLLISION LOCK', value: 'synchronized(headNode)' },
        ]}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="ConcurrentHashMap Lock Striping" />
        <IsoBlock cx={200} cy={220} label="Thread 1 (Write)" sublabel="CAS Insertion" topColor="#4E8752" badge="CAS Success" isHighlighted={true} />
        <IsoBlock cx={200} cy={330} label="Thread 2 (Write)" sublabel="Bucket Lock" topColor="#D9822B" badge="Node-Level Lock" isHighlighted={true} />
        <IsoBlock cx={430} cy={200} label="Empty Bucket [2]" sublabel="No Lock Required" topColor="#4A90E2" badge="CAS Inserted" />
        <IsoBlock cx={430} cy={310} label="Bucket [5] (Head)" sublabel="synchronized(firstNode)" topColor="#D14D41" badge="Striped Lock" />
        <IsoBlock cx={670} cy={250} label="Thread 3 (Read)" sublabel="get() Volatile Read" topColor="#26A69A" badge="Zero Contention" />
        <IsoPath d="M 200 220 L 430 200" color="#4E8752" isPlaying={isPlaying} />
        <IsoPath d="M 200 330 L 430 310" color="#D9822B" isPlaying={isPlaying} />
        <IsoPath d="M 670 250 L 430 200" color="#26A69A" isPlaying={isPlaying} />
      </StageContainer>
    );
  }

  // Default: Full Internal HashMap Buckets, Hashing, Collision, and Treeification
  return (
    <StageContainer
      telemetry={[
        { label: 'HASH SPREAD', value: '(h ^ (h >>> 16))' },
        { label: 'BUCKET INDEX', value: '(n - 1) & hash = [4]' },
        { label: 'CAPACITY / THRESHOLD', value: '16 Buckets (Resize @ 12)' },
        { label: 'TREEIFY THRESHOLD', value: '8 Nodes -> Red-Black Tree' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="HashMap<K, V> Internal Buckets & Treeify" />

      {/* 1. Key input */}
      <IsoBlock
        cx={150}
        cy={240}
        label="Key: user_42"
        sublabel='key.hashCode()'
        topColor="#D9822B"
        badge="Key Object"
        badgeColor="#D9822B"
      />

      {/* 2. Hash computation & Bitwise AND */}
      <IsoBlock
        cx={310}
        cy={180}
        label="Hash Spread"
        sublabel='(16 - 1) & hash => [4]'
        topColor="#4A90E2"
        badge="Bucket Index 4"
        badgeColor="#4A90E2"
        isHighlighted={true}
      />

      {/* 3. Bucket Array Pedestal Blocks */}
      <IsoBlock
        cx={440}
        cy={120}
        w={76}
        d={44}
        label="Bucket [0]"
        sublabel="null"
        topColor="#2A2C30"
        badge="Empty"
      />

      <IsoBlock
        cx={570}
        cy={120}
        w={86}
        d={46}
        label="Bucket [1]"
        sublabel='Node("A", 10)'
        topColor="#37693A"
        badge="Single Node"
      />

      <IsoBlock
        cx={490}
        cy={220}
        w={98}
        d={52}
        label="Bucket [4]"
        sublabel="Node<K,V>[] table"
        topColor="#4E8752"
        badge="Target Bucket"
        badgeColor="#4E8752"
        isHighlighted={true}
      />

      {/* 4. Collision Linked List */}
      <IsoBlock
        cx={630}
        cy={220}
        w={90}
        d={48}
        label="Node 1"
        sublabel='hash|"user_42"|$500'
        topColor="#7E57C2"
        badge="Head Node"
        badgeColor="#7E57C2"
      />

      <IsoBlock
        cx={760}
        cy={220}
        w={90}
        d={48}
        label="Node 2"
        sublabel='hash|"cust_99"|$320'
        topColor="#7E57C2"
        badge="Collision Next"
        badgeColor="#7E57C2"
      />

      {/* 5. Treeification: Red-Black Tree */}
      <IsoBlock
        cx={640}
        cy={340}
        w={96}
        d={50}
        label="TreeNode (Root)"
        sublabel="Red-Black Tree"
        topColor="#D14D41"
        badge="Treeified (>= 8)"
        badgeColor="#D14D41"
        isHighlighted={true}
      />

      <IsoBlock
        cx={540}
        cy={410}
        w={80}
        d={42}
        label="TreeNode (L)"
        sublabel="Red Node"
        topColor="#E06C60"
        badge="O(log n)"
        badgeColor="#E06C60"
      />

      <IsoBlock
        cx={740}
        cy={410}
        w={80}
        d={42}
        label="TreeNode (R)"
        sublabel="Black Node"
        topColor="#1C1826"
        badge="O(log n)"
      />

      {/* Paths */}
      <IsoPath d="M 150 240 L 310 180" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 310 180 L 490 220" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 490 220 L 630 220" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 630 220 L 760 220" color="#7E57C2" isPlaying={isPlaying} />
      <IsoPath d="M 760 220 L 640 340" color="#D14D41" isPlaying={isPlaying} />
      <IsoPath d="M 640 340 L 540 410" color="#E06C60" isPlaying={isPlaying} />
      <IsoPath d="M 640 340 L 740 410" color="#1C1826" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 02. Streams & Lambdas Pipeline Stage
// -------------------------------------------------------------
function StreamsPipelineStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'EVALUATION MODE', value: 'Lazy Evaluation' },
        { label: 'PIPELINE FUSION', value: 'Single-Pass Loop' },
        { label: 'SHORT-CIRCUIT', value: 'findFirst() / limit(n)' },
        { label: 'PARALLELISM', value: 'Common ForkJoinPool' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Java Stream Pipeline Architecture" />
      <IsoBlock cx={170} cy={260} label="List<Policy>" sublabel="Stream Source" topColor="#4A90E2" badge="Source" />
      <IsoBlock cx={340} cy={200} label="filter(p.active)" sublabel="Intermediate Op" topColor="#D9822B" badge="Lazy Sink" isHighlighted={true} />
      <IsoBlock cx={510} cy={170} label="map(p.premium)" sublabel="Intermediate Op" topColor="#AB47BC" badge="Lazy 1-to-1" isHighlighted={true} />
      <IsoBlock cx={680} cy={220} label="collect(toList())" sublabel="Terminal Op" topColor="#4E8752" badge="Execution Trigger" isHighlighted={true} />
      <IsoBlock cx={560} cy={330} label="Processed DTOs" sublabel="Result Collection" topColor="#26A69A" badge="Immutable Output" />
      <IsoPath d="M 170 260 L 340 200" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 340 200 L 510 170" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 510 170 L 680 220" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 680 220 L 560 330" color="#4E8752" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 02. Generics Type Erasure Stage
// -------------------------------------------------------------
function GenericsTypeErasureStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'SOURCE CODE', value: 'List<String> (Generic)' },
        { label: 'COMPILER STEP', value: 'javac Type Erasure' },
        { label: 'BYTECODE OUTPUT', value: 'List (Raw Object)' },
        { label: 'CAST SAFETY', value: 'Synthetic (checkcast)' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Generics Type Erasure Pipeline" />
      <IsoBlock cx={180} cy={260} label="Source Code" sublabel="List<String> type" topColor="#4A90E2" badge="Compile-Time Type" />
      <IsoBlock cx={360} cy={210} label="javac Compiler" sublabel="Type Erasure" topColor="#D9822B" badge="Erasure Pass" isHighlighted={true} />
      <IsoBlock cx={540} cy={190} label="Raw Bytecode" sublabel="List (Object)" topColor="#4E8752" badge="Erased to Object" isHighlighted={true} />
      <IsoBlock cx={720} cy={250} label="Bridge Method" sublabel="checkcast (String)" topColor="#AB47BC" badge="Runtime Guard" />
      <IsoPath d="M 180 260 L 360 210" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 360 210 L 540 190" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 540 190 L 720 250" color="#4E8752" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 03. Concurrency: ThreadPoolExecutor Architecture
// -------------------------------------------------------------
function ThreadPoolExecutorStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'ACTIVE THREADS', value: '4 / 16 (Core: 4)' },
        { label: 'WORK QUEUE', value: 'ArrayBlockingQueue (128)' },
        { label: 'REJECT POLICY', value: 'CallerRunsPolicy' },
        { label: 'KEEP-ALIVE', value: '60s Timeout' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="ThreadPoolExecutor Architecture" />
      <IsoBlock cx={170} cy={270} label="Incoming Tasks" sublabel="executor.submit()" topColor="#4A90E2" badge="Runnable / Callable" />
      <IsoBlock cx={330} cy={190} label="Core Pool (4)" sublabel="Always Active" topColor="#4E8752" badge="Core Workers" isHighlighted={true} />
      <IsoBlock cx={500} cy={230} label="BlockingQueue" sublabel="Task Buffer" topColor="#D9822B" badge="FIFO Queue" isHighlighted={true} />
      <IsoBlock cx={670} cy={180} label="Max Pool (16)" sublabel="Burst Capacity" topColor="#AB47BC" badge="On Queue Full" />
      <IsoBlock cx={670} cy={320} label="Reject Handler" sublabel="CallerRunsPolicy" topColor="#D14D41" badge="Backpressure" />
      <IsoPath d="M 170 270 L 330 190" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 330 190 L 500 230" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 500 230 L 670 180" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 500 230 L 670 320" color="#D14D41" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 04. Spring Boot: Dependency Injection & Bean Lifecycle
// -------------------------------------------------------------
function DependencyInjectionStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'IOC CONTAINER', value: 'ApplicationContext' },
        { label: 'DEFAULT SCOPE', value: 'Singleton' },
        { label: 'INJECTION TYPE', value: 'Constructor Injection' },
        { label: 'LIFECYCLE HOOK', value: '@PostConstruct -> Ready' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Spring IoC Bean Lifecycle" />
      <IsoBlock cx={170} cy={260} label="@Component Scan" sublabel="Bean Definition" topColor="#4A90E2" badge="Class Scanner" />
      <IsoBlock cx={340} cy={190} label="Instantiation" sublabel="Constructor Invocation" topColor="#D9822B" badge="Instance Created" />
      <IsoBlock cx={510} cy={170} label="@Autowired" sublabel="Dependency Injection" topColor="#4E8752" badge="Wiring Injected" isHighlighted={true} />
      <IsoBlock cx={680} cy={220} label="@PostConstruct" sublabel="Init Callback" topColor="#AB47BC" badge="Ready State" isHighlighted={true} />
      <IsoBlock cx={560} cy={330} label="Singleton Cache" sublabel="Default Bean Scope" topColor="#26A69A" badge="Managed Bean" />
      <IsoPath d="M 170 260 L 340 190" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 340 190 L 510 170" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 510 170 L 680 220" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 680 220 L 560 330" color="#AB47BC" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 04. Spring Boot: Microservices & Circuit Breaker
// -------------------------------------------------------------
function MicroservicesResilienceStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'CIRCUIT BREAKER', value: 'CLOSED (Normal)' },
        { label: 'FAILURE RATE', value: '1.4% (< 50% Threshold)' },
        { label: 'FALLBACK CACHE', value: 'Redis / Local Cache' },
        { label: 'SERVICE MESH', value: 'Resilience4j' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Resilience4j Circuit Breaker Architecture" />
      <IsoLaptop cx={160} cy={270} label="Client" sublabel="GET /orders" />
      <IsoBlock cx={320} cy={210} label="API Gateway" sublabel="Routing & Auth" topColor="#4A90E2" badge="Ingress" />
      <IsoBlock cx={500} cy={170} label="Circuit Breaker" sublabel="State: CLOSED" topColor="#4E8752" badge="Resilience4j" isHighlighted={true} />
      <IsoBlock cx={690} cy={190} label="Downstream API" sublabel="Payment Service" topColor="#26A69A" badge="200 OK" />
      <IsoDatabase cx={680} cy={330} rx={30} ry={15} h={36} color="#D14D41" label="Fallback Store" sublabel="Cached DTO" badge="On Failure" />
      <IsoPath d="M 160 270 L 320 210" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 320 210 L 500 170" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 500 170 L 690 190" color="#26A69A" isPlaying={isPlaying} />
      <IsoPath d="M 500 170 L 680 330" color="#D14D41" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 05. REST API Design & Contracts
// -------------------------------------------------------------
function RestApiDesignStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'METHOD', value: 'GET /api/v1/policies/123' },
        { label: 'IDEMPOTENT', value: 'Yes (GET, PUT, DELETE)' },
        { label: 'STATUS CODE', value: '200 OK (JSON Payload)' },
        { label: 'SPECIFICATION', value: 'OpenAPI 3.0 / Swagger' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="REST API Resource Design & Contracts" />
      <IsoLaptop cx={160} cy={270} label="Consumer" sublabel="GET /policies/123" />
      <IsoBlock cx={320} cy={220} label="Request Validator" sublabel="@Valid DTO Parser" topColor="#4A90E2" badge="Validation Guard" />
      <IsoBlock cx={510} cy={180} label="Controller" sublabel="@GetMapping" topColor="#4E8752" badge="HTTP 200 OK" isHighlighted={true} />
      <IsoBlock cx={690} cy={220} label="DTO Response" sublabel="application/json" topColor="#AB47BC" badge="Serialized JSON" />
      <IsoPath d="M 160 270 L 320 220" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 320 220 L 510 180" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 510 180 L 690 220" color="#AB47BC" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 06. MongoDB Document Model & MongoTemplate
// -------------------------------------------------------------
function MongoDbPersistenceStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'DATA MODEL', value: 'BSON Document Store' },
        { label: 'STORAGE ENGINE', value: 'WiredTiger (Cache: 4GB)' },
        { label: 'INDEXING', value: 'Compound B-Tree Index' },
        { label: 'WRITE CONCERN', value: 'w: majority, j: true' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="MongoDB Document & Persistence Architecture" />
      <IsoBlock cx={170} cy={270} label="@Document Policy" sublabel="Java Entity" topColor="#4A90E2" badge="POJO" />
      <IsoBlock cx={340} cy={200} label="MongoTemplate" sublabel="BSON Serializer" topColor="#4E8752" badge="Spring Data" isHighlighted={true} />
      <IsoBlock cx={510} cy={170} label="B-Tree Index" sublabel="Index: (ssn, date)" topColor="#D9822B" badge="Fast Seek" />
      <IsoDatabase cx={700} cy={240} rx={34} ry={17} h={42} color="#26A69A" label="MongoDB Cluster" sublabel="WiredTiger Engine" badge="BSON Collection" isHighlighted={true} />
      <IsoPath d="M 170 270 L 340 200" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 340 200 L 510 170" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 510 170 L 700 240" color="#26A69A" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 07. DevOps CI/CD Pipeline
// -------------------------------------------------------------
function CiCdPipelineStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'ORCHESTRATOR', value: 'GitLab CI / Jenkins' },
        { label: 'BUILD TOOL', value: 'Maven 3.9 (JDK 21)' },
        { label: 'QUALITY GATE', value: 'SonarQube PASSED (0 bugs)' },
        { label: 'DEPLOYMENT', value: 'Docker -> Kubernetes' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Continuous Integration & Delivery Pipeline" />
      <IsoBlock cx={160} cy={270} label="Git Push" sublabel="git push origin main" topColor="#4A90E2" badge="Commit Trigger" />
      <IsoBlock cx={310} cy={200} label="Maven Build" sublabel="mvn clean verify" topColor="#D9822B" badge="Tests Passed" />
      <IsoBlock cx={480} cy={160} label="SonarQube" sublabel="Quality Gate" topColor="#4E8752" badge="Zero Vulns" isHighlighted={true} />
      <IsoBlock cx={640} cy={180} label="Docker Build" sublabel="Multi-Stage Image" topColor="#AB47BC" badge="OCI Container" />
      <IsoBlock cx={750} cy={280} label="Kubernetes" sublabel="Rolling Deployment" topColor="#26A69A" badge="Production Live" isHighlighted={true} />
      <IsoPath d="M 160 270 L 310 200" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 310 200 L 480 160" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 480 160 L 640 180" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 640 180 L 750 280" color="#26A69A" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 07. DevOps Observability Stack
// -------------------------------------------------------------
function ObservabilityStackStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'METRICS AGENT', value: 'Micrometer (JVM Heap, Threads)' },
        { label: 'SCRAPE CADENCE', value: '15s Interval (Prometheus)' },
        { label: 'LOG INGESTION', value: 'Splunk / ELK Stack' },
        { label: 'ALERT STATUS', value: 'Healthy (0 Fired)' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Full-Stack Observability & Telemetry" />
      <IsoBlock cx={170} cy={270} label="Java App" sublabel="Micrometer Exporter" topColor="#4E8752" badge="JVM Instrumentation" isHighlighted={true} />
      <IsoBlock cx={340} cy={180} label="Prometheus" sublabel="Timeseries DB" topColor="#D9822B" badge="Metrics Scraper" />
      <IsoBlock cx={520} cy={150} label="Grafana" sublabel="Live Dashboards" topColor="#4A90E2" badge="Latency / Heap" />
      <IsoBlock cx={520} cy={310} label="Logback Logger" sublabel="MDC Correlation ID" topColor="#AB47BC" badge="Structured JSON" />
      <IsoDatabase cx={710} cy={270} rx={34} ry={17} h={40} color="#26A69A" label="Splunk / ELK" sublabel="Log Aggregation" badge="Search & RCA" isHighlighted={true} />
      <IsoPath d="M 170 270 L 340 180" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 340 180 L 520 150" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 170 270 L 520 310" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 520 310 L 710 270" color="#26A69A" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. OOP Pillars & vtable Dynamic Dispatch
// -------------------------------------------------------------
function OopPillarsStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'DYNAMIC DISPATCH', value: 'JVM Virtual Method Table (vtable)' },
        { label: 'POLYMORPHISM', value: 'Runtime Resolution' },
        { label: 'ENCAPSULATION', value: 'Private State + Invariants' },
        { label: 'INHERITANCE', value: 'Liskov Substitution Principle' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="OOP Pillars & JVM Dynamic Dispatch" />
      <IsoBlock cx={180} cy={250} label="Interface Contract" sublabel="PaymentGateway" topColor="#4A90E2" badge="Abstraction" />
      <IsoBlock cx={360} cy={190} label="Class Hierarchy" sublabel="StripeGateway implements" topColor="#D9822B" badge="Inheritance" />
      <IsoBlock cx={540} cy={170} label="JVM vtable" sublabel="Method Pointer Offset" topColor="#4E8752" badge="Polymorphism" isHighlighted={true} />
      <IsoBlock cx={720} cy={240} label="Private State" sublabel="apiKey, balance" topColor="#AB47BC" badge="Encapsulation" />
      <IsoPath d="M 180 250 L 360 190" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 360 190 L 540 170" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 540 170 L 720 240" color="#AB47BC" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. Java Data Types & Memory Model
// -------------------------------------------------------------
function DataTypesMemoryStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'PRIMITIVE VALUES', value: 'int, long, double (Stack)' },
        { label: 'OBJECT REFERENCES', value: '8-Byte Pointers (Compressed OOPs)' },
        { label: 'STRING CONSTANT POOL', value: 'Interned in JVM Heap' },
        { label: 'AUTOBOXING COST', value: 'Integer (16B) vs int (4B)' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Java Data Types & Stack vs Heap" />
      <IsoBlock cx={180} cy={260} label="Thread Stack" sublabel="int age = 42 (4B)" topColor="#4E8752" badge="Stack Direct Value" isHighlighted={true} />
      <IsoBlock cx={360} cy={190} label="Object Reference" sublabel="String name -> pointer" topColor="#4A90E2" badge="Reference (8B)" />
      <IsoBlock cx={550} cy={160} label="String Constant Pool" sublabel='"Alice" (Interned)' topColor="#AB47BC" badge="Heap String Pool" isHighlighted={true} />
      <IsoBlock cx={720} cy={240} label="Heap Object" sublabel="new Customer() (24B+)" topColor="#D9822B" badge="Live Heap Object" />
      <IsoPath d="M 180 260 L 360 190" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 360 190 L 550 160" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 360 190 L 720 240" color="#D9822B" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. Exception Handling & Call Stack Unwinding
// -------------------------------------------------------------
function ExceptionHandlingStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'CALL STACK', value: 'Frame #3 -> Frame #2 -> Frame #1' },
        { label: 'UNWINDING EVENT', value: 'throw new PolicyException()' },
        { label: 'EXCEPTION TYPE', value: 'Checked (IOException) vs Unchecked' },
        { label: 'CLEANUP GUARANTEE', value: 'finally block / try-with-resources' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Exception Handling & Stack Unwinding" />
      <IsoBlock cx={180} cy={280} label="Caller Method" sublabel="try { service.call() }" topColor="#4A90E2" badge="Stack Frame #1" />
      <IsoBlock cx={360} cy={210} label="Service Layer" sublabel="throws PolicyException" topColor="#D9822B" badge="Stack Frame #2" isHighlighted={true} />
      <IsoBlock cx={540} cy={170} label="throw Exception" sublabel="Stack Unwinding Trigger" topColor="#D14D41" badge="Exception Fired" isHighlighted={true} />
      <IsoBlock cx={710} cy={250} label="catch / finally" sublabel="AutoCloseable.close()" topColor="#4E8752" badge="Safe Recovery" />
      <IsoPath d="M 180 280 L 360 210" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 360 210 L 540 170" color="#D14D41" isPlaying={isPlaying} />
      <IsoPath d="M 540 170 L 710 250" color="#4E8752" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. How Java Runs Your Code - 3D Isometric Pipeline Stage
// -------------------------------------------------------------
function JavaExecutionStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  const isCompile = diagramState === 'compile-bytecode' || diagramState === 'bytecode-inspect';
  const isClassLoader = diagramState === 'classloader-load' || diagramState === 'verify-execute';
  const isJit = diagramState === 'jit-compile' || diagramState === 'recap';
  const isMemory = diagramState === 'memory-stack-heap' || diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'EXECUTION MODE', value: isJit ? 'Tiered JIT (C2)' : isClassLoader ? 'ClassLoader' : 'Interpreter' },
        { label: 'BYTECODE VERIFIER', value: '0xCAFEBABE' },
        { label: 'HOT INVOCATIONS', value: isJit ? '12,450 / s' : '820 / s' },
        { label: 'NATIVE CODE CACHE', value: isJit ? '32 MB' : '4 MB' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="JVM Runtime Environment" />
      <IsoLaptop cx={180} cy={280} label="Developer" sublabel="PaymentService.java" />
      <IsoBlock cx={330} cy={240} label="javac Compiler" sublabel="Bytecode Parser" topColor="#D9822B" leftColor="#B36B22" rightColor="#8F5419" badge="AST Parsing" badgeColor="#D9822B" isHighlighted={isCompile} />
      <IsoBlock cx={520} cy={210} w={100} d={56} h={40} label="JVM Engine" sublabel="HotSpot C1 / C2" topColor="#4E8752" leftColor="#3C6B3F" rightColor="#2B4F2E" badge={isJit ? 'Compiled JIT' : 'Interpreting'} badgeColor="#4E8752" isHighlighted={isJit} />
      <IsoBlock cx={420} cy={120} w={76} d={44} label="Thread Stack" sublabel="Frames & Vars" topColor="#4A90E2" leftColor="#3874B8" rightColor="#26578E" badge="StackFrame #1" badgeColor="#4A90E2" isHighlighted={isMemory} />
      <IsoBlock cx={590} cy={120} w={86} d={48} label="Heap Memory" sublabel="Eden & Old Gen" topColor="#AB47BC" leftColor="#893796" rightColor="#682773" badge="Live Objects" badgeColor="#AB47BC" isHighlighted={isMemory} />
      <IsoBlock cx={720} cy={280} label="Host CPU / OS" sublabel="Native Assembly" topColor="#D14D41" leftColor="#A83C32" rightColor="#822C24" badge="x86-64 / ARM" badgeColor="#D14D41" isHighlighted={isJit} />
      <IsoPath d="M 180 280 L 330 240" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 330 240 L 520 210" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 520 180 L 420 140" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 520 180 L 590 140" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 520 230 L 720 280" color="#D14D41" isPlaying={isPlaying && isJit} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 03. Concurrency: Thread Lifecycle Stage
// -------------------------------------------------------------
function ThreadLifecycleStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  const isBlocked = diagramState === 'blocked-state';
  const isWaiting = diagramState === 'waiting-state';
  const isRunning = diagramState === 'running-state' || diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'ACTIVE THREADS', value: '48 / 200' },
        { label: 'CURRENT STATE', value: isBlocked ? 'BLOCKED (Monitor)' : isWaiting ? 'TIMED_WAITING' : 'RUNNABLE' },
        { label: 'CONTEXT SWITCHES', value: '1,200 / s' },
        { label: 'LOCK CONTENTION', value: isBlocked ? 'HIGH' : '0.1%' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Thread Lifecycle State Machine" />
      <IsoBlock cx={180} cy={270} label="NEW" sublabel="new Thread()" topColor="#7E57C2" leftColor="#5E4094" rightColor="#442D6B" badge="Thread.init()" />
      <IsoBlock cx={320} cy={180} label="RUNNABLE" sublabel="In OS Scheduler" topColor="#4A90E2" leftColor="#3468A3" rightColor="#224773" badge="Ready Queue" />
      <IsoBlock cx={480} cy={150} label="RUNNING" sublabel="Core #4 Active" topColor="#4E8752" leftColor="#39633C" rightColor="#264528" badge="Executing" badgeColor="#4E8752" isHighlighted={isRunning} />
      <IsoBlock cx={420} cy={310} label="BLOCKED" sublabel="synchronized Lock" topColor="#D9822B" leftColor="#A8641F" rightColor="#784714" badge="Monitor Wait" badgeColor="#D9822B" isHighlighted={isBlocked} />
      <IsoBlock cx={590} cy={300} label="WAITING" sublabel="wait() / park()" topColor="#AB47BC" leftColor="#80338C" rightColor="#572161" badge="Parked" badgeColor="#AB47BC" isHighlighted={isWaiting} />
      <IsoBlock cx={730} cy={240} label="TERMINATED" sublabel="run() returned" topColor="#D14D41" leftColor="#9C372E" rightColor="#6E241D" badge="Dead" />
      <IsoPath d="M 180 270 L 320 180" color="#7E57C2" isPlaying={isPlaying} />
      <IsoPath d="M 320 180 L 480 150" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 480 170 L 420 310" color="#D9822B" isPlaying={isPlaying && isBlocked} />
      <IsoPath d="M 480 170 L 590 300" color="#AB47BC" isPlaying={isPlaying && isWaiting} />
      <IsoPath d="M 420 310 L 320 190" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 590 300 L 320 190" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 480 150 L 730 240" color="#D14D41" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 03. Concurrency: CompletableFuture Pipeline Stage
// -------------------------------------------------------------
function CompletableFutureStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  const isFallback = diagramState === 'fallback-catch';
  const isCombine = diagramState === 'then-combine' || diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'PARALLEL FORKS', value: '2 Tasks Active' },
        { label: 'LATENCY (P95)', value: '110 ms (Max T1, T2)' },
        { label: 'DOWNSTREAM STATUS', value: isFallback ? 'Cached Fallback' : '200 OK' },
        { label: 'THREAD POOL', value: 'Custom API Pool (50)' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="CompletableFuture Task Graph" />
      <IsoLaptop cx={170} cy={270} label="Client" sublabel="GET /dashboard" />
      <IsoBlock cx={330} cy={160} label="Policy Core API" sublabel="supplyAsync()" topColor="#4A90E2" leftColor="#3466A1" rightColor="#22456E" badge="80 ms" badgeColor="#4A90E2" isHighlighted={true} />
      <IsoBlock cx={330} cy={340} label="Payment HPP API" sublabel="supplyAsync()" topColor="#7E57C2" leftColor="#5E3F94" rightColor="#402969" badge="110 ms" badgeColor="#7E57C2" isHighlighted={true} />
      <IsoBlock cx={530} cy={240} w={96} d={52} label="thenCombine()" sublabel="Merge DTOs" topColor="#D9822B" leftColor="#A8621D" rightColor="#754311" badge="Aggregate" badgeColor="#D9822B" isHighlighted={isCombine} />
      <IsoDatabase cx={530} cy={370} rx={30} ry={16} h={36} color="#D14D41" label="Fallback Cache" sublabel="exceptionally()" badge="Resilience" isHighlighted={isFallback} />
      <IsoBlock cx={730} cy={240} label="Response DTO" sublabel="Aggregated JSON" topColor="#4E8752" leftColor="#3A6B3D" rightColor="#264D29" badge="Complete" badgeColor="#4E8752" isHighlighted={isCombine} />
      <IsoPath d="M 170 270 L 330 160" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 170 270 L 330 340" color="#7E57C2" isPlaying={isPlaying} />
      <IsoPath d="M 330 160 L 530 240" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 330 340 L 530 240" color="#7E57C2" isPlaying={isPlaying} />
      <IsoPath d="M 330 340 L 530 370" color="#D14D41" isPlaying={isPlaying && isFallback} />
      <IsoPath d="M 530 240 L 730 240" color="#4E8752" isPlaying={isPlaying && isCombine} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 04. Spring Boot Request Lifecycle Stage
// -------------------------------------------------------------
function SpringLifecycleStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  const isController = diagramState === 'controller-service';
  const isDb = diagramState === 'repo-db';

  return (
    <StageContainer
      telemetry={[
        { label: 'INBOUND PROTOCOL', value: 'HTTP/2 REST' },
        { label: 'SPRING HANDLER', value: '@RestController' },
        { label: 'PERSISTENCE', value: 'MongoDB BSON' },
        { label: 'RESPONSE CODE', value: '200 OK (JSON)' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Spring Boot Layered Architecture" />
      <IsoLaptop cx={150} cy={270} label="Client" sublabel="GET /api/policy" />
      <IsoBlock cx={290} cy={240} label="Dispatcher" sublabel="Front Controller" topColor="#D9822B" leftColor="#A8621D" rightColor="#784411" badge="FilterChain" />
      <IsoBlock cx={430} cy={180} label="Controller" sublabel="@RestController" topColor="#4A90E2" leftColor="#34649E" rightColor="#21426B" badge="Mapping" badgeColor="#4A90E2" isHighlighted={isController} />
      <IsoBlock cx={570} cy={180} label="Service" sublabel="Business Logic" topColor="#4E8752" leftColor="#37693A" rightColor="#224724" badge="@Transactional" badgeColor="#4E8752" isHighlighted={isController} />
      <IsoBlock cx={570} cy={320} label="Repository" sublabel="MongoRepository" topColor="#AB47BC" leftColor="#7F328C" rightColor="#572061" badge="Spring Data" badgeColor="#AB47BC" isHighlighted={isDb} />
      <IsoDatabase cx={730} cy={260} rx={32} ry={16} h={40} color="#26A69A" label="MongoDB" sublabel="Document Store" badge="Query OK" isHighlighted={isDb} />
      <IsoPath d="M 150 270 L 290 240" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 290 240 L 430 180" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 430 180 L 570 180" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 570 180 L 570 320" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 570 320 L 730 260" color="#26A69A" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 05. Security: JWT & OAuth2 ForgeRock AM Stage
// -------------------------------------------------------------
function JwtOAuth2Stage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  const isAuth = diagramState === 'auth-request' || diagramState === 'jwt-mint';
  const isGateway = diagramState === 'bearer-dispatch';
  const isBackend = diagramState === 'backend-protect' || diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'AUTH PROVIDER', value: 'ForgeRock AM' },
        { label: 'TOKEN ALGORITHM', value: 'RS256 (Asymmetric)' },
        { label: 'VALIDATION', value: 'Gateway JWKS' },
        { label: 'SECURITY CONTEXT', value: isBackend ? 'AUTHENTICATED' : 'ANONYMOUS' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="OAuth2 & JWT Security Topology" />
      <IsoLaptop cx={170} cy={270} label="Client SPA" sublabel="Bearer <Token>" />
      <IsoBlock cx={330} cy={150} label="ForgeRock AM" sublabel="OAuth2 / IdP" topColor="#D9822B" leftColor="#A8621D" rightColor="#784411" badge="Issue Token" badgeColor="#D9822B" isHighlighted={isAuth} />
      <IsoBlock cx={500} cy={240} label="API Gateway" sublabel="JWT Signature Verify" topColor="#4A90E2" leftColor="#34649E" rightColor="#21426B" badge="JWKS Verified" badgeColor="#4A90E2" isHighlighted={isGateway} />
      <IsoBlock cx={720} cy={240} label="Spring Backend" sublabel="Protected Resource" topColor="#4E8752" leftColor="#37693A" rightColor="#224724" badge="SecurityContext" badgeColor="#4E8752" isHighlighted={isBackend} />
      <IsoPath d="M 170 270 L 330 150" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 330 150 L 170 270" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 170 270 L 500 240" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 500 240 L 720 240" color="#4E8752" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. Memory Model & G1 GC Stage
// -------------------------------------------------------------
function MemoryGcStage({ diagramState, isPlaying }: { diagramState: string; isPlaying: boolean }) {
  const isMinor = diagramState === 'minor-gc';
  const isMajor = diagramState === 'major-gc' || diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'JVM HEAP', value: '4 GB (G1 GC)' },
        { label: 'YOUNG GEN', value: '1.2 GB (Eden + S0/S1)' },
        { label: 'TENURED OLD GEN', value: '2.8 GB' },
        { label: 'GC PAUSE', value: isMinor ? '4 ms (Minor GC)' : isMajor ? '45 ms (Concurrent)' : '0 ms' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="G1 Garbage Collection Regions" />
      <IsoBlock cx={170} cy={270} label="Thread Stack" sublabel="Root References" topColor="#4E8752" leftColor="#386B3B" rightColor="#244A26" badge="GC Roots" />
      <IsoBlock cx={330} cy={150} label="Eden Space" sublabel="New Allocations" topColor="#42A5F5" leftColor="#2B74B0" rightColor="#1A4F7A" badge="Fast TLAB" badgeColor="#42A5F5" isHighlighted={true} />
      <IsoBlock cx={330} cy={340} label="Survivor S0/S1" sublabel="Aging Objects" topColor="#26A69A" leftColor="#19756C" rightColor="#0F524B" badge="Age Counter" badgeColor="#26A69A" isHighlighted={isMinor} />
      <IsoBlock cx={530} cy={240} label="Old Generation" sublabel="Long-lived Objects" topColor="#AB47BC" leftColor="#7A3087" rightColor="#521E5C" badge="Tenured" badgeColor="#AB47BC" isHighlighted={isMajor} />
      <IsoBlock cx={720} cy={240} label="G1 Collector" sublabel="Concurrent Mark" topColor="#D14D41" leftColor="#99352C" rightColor="#6E231D" badge="Zero Leaks" badgeColor="#D14D41" isHighlighted={isMajor} />
      <IsoPath d="M 170 270 L 330 150" color="#42A5F5" isPlaying={isPlaying} />
      <IsoPath d="M 330 150 L 330 340" color="#26A69A" isPlaying={isPlaying} />
      <IsoPath d="M 330 340 L 530 240" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 720 240 L 530 240" color="#D14D41" isPlaying={isPlaying && isMajor} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// Isometric Stage Layout Container with Telemetry Header
// -------------------------------------------------------------
function StageContainer({
  telemetry,
  children,
}: {
  telemetry: Array<{ label: string; value: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#161513] text-cream-100 select-none">
      {/* Top Telemetry Metrics Row matching designed-to-scale */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 pt-2.5 pb-1 z-20 flex-shrink-0">
        {telemetry.map((t, idx) => (
          <div
            key={idx}
            className="rounded-xl px-2.5 py-1.5 bg-[#22201D] border border-[#33302B] flex flex-col justify-center"
          >
            <span className="text-[9px] font-mono font-semibold tracking-wider text-cream-400/60 uppercase truncate">
              {t.label}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-cream-100 truncate mt-0.5">
              {t.value}
            </span>
          </div>
        ))}
      </div>

      {/* Center 3D Isometric SVG Canvas */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 900 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Diagonal Isometric Grid Pattern (2:1 Ratio matching designed-to-scale) */}
            <pattern id="iso-diag-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 48 24 L 24 48 L 0 24 Z" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background grid */}
          <rect width="900" height="500" fill="url(#iso-diag-grid)" />

          {/* Render stage 3D children */}
          {children}
        </svg>
      </div>

      {/* Bottom Status Legend */}
      <div className="flex items-center justify-between px-4 pb-2 pt-1 z-20 text-[10px] font-mono text-cream-400/70 border-t border-[#33302B]/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> request</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500" /> heavy</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> memory</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> exception</span>
        </div>
        <span className="hidden sm:inline font-mono text-[9px] text-cream-400/40">3D ISOMETRIC ENGINE</span>
      </div>
    </div>
  );
}

// Helper: Animated Isometric Path with Glowing Packets
function IsoPath({ d, color = '#4E8752', isPlaying = true }: { d: string; color?: string; isPlaying?: boolean }) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="5 5" className="opacity-40" />
      {isPlaying && (
        <motion.circle
          r="4.5"
          fill={color}
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ offsetPath: `path("${d}")` }}
        />
      )}
    </g>
  );
}
