'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IsoBlock,
  IsoDatabase,
  IsoLaptop,
  IsoPedestal,
} from './IsoShapes';

export interface DiagramRendererProps {
  lessonSlug: string;
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: 'normal' | 'hot-calls' | 'recursion' | 'thread-pin';
}

export function DiagramRenderer({
  lessonSlug,
  diagramState,
  isPlaying,
  viewMode = '3d',
  simulationScenario = 'normal',
}: DiagramRendererProps) {
  // 01. Foundations
  if (lessonSlug === 'how-java-runs') {
    return <JavaExecutionStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} />;
  }
  if (lessonSlug === 'oop-pillars') {
    return <OopPillarsStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'memory-and-gc') {
    return <MemoryGcStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'java-data-types') {
    return <DataTypesMemoryStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} />;
  }
  if (lessonSlug === 'exception-handling') {
    return <ExceptionHandlingStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} />;
  }
  if (lessonSlug === 'object-headers-lilliput') {
    return <ObjectHeadersLilliputStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'escape-analysis') {
    return <EscapeAnalysisStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'zgc-vs-g1') {
    return <ZgcVsG1Stage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }

  // 02. Collections & Streams
  if (lessonSlug === 'collections-framework') {
    return <HashMapCollectionsStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'streams-api' || lessonSlug === 'lambdas-functional') {
    return <StreamsPipelineStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'generics') {
    return <GenericsTypeErasureStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }

  // 03. Concurrency
  if (lessonSlug === 'thread-lifecycle') {
    return <ThreadLifecycleStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} />;
  }
  if (lessonSlug === 'completable-future') {
    return <CompletableFutureStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'executor-service') {
    return <ThreadPoolExecutorStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'virtual-threads-loom') {
    return <VirtualThreadsLoomStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} />;
  }
  if (lessonSlug === 'false-sharing-jmm') {
    return <FalseSharingJmmStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'safepoints-ttsp') {
    return <SafepointsTtspStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }

  // 04. Spring Boot
  if (lessonSlug === 'spring-request-lifecycle') {
    return <SpringLifecycleStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'dependency-injection') {
    return <DependencyInjectionStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'microservices-patterns') {
    return <MicroservicesResilienceStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }

  // 05. REST & Security
  if (lessonSlug === 'rest-api-design') {
    return <RestApiDesignStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'jwt-oauth2') {
    return <JwtOAuth2Stage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }

  // 06. Persistence & DevOps
  if (lessonSlug === 'mongodb-document-model') {
    return <MongoDbPersistenceStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'cicd-pipeline') {
    return <CiCdPipelineStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'observability-stack') {
    return <ObservabilityStackStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }
  if (lessonSlug === 'offheap-ffm-api') {
    return <OffHeapFfmStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
  }

  // Fallback
  return <HashMapCollectionsStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} />;
}

// -------------------------------------------------------------
// 02. HashMap Internals & Collections Deep Dive
// -------------------------------------------------------------
function HashMapCollectionsStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  const isArrayList = diagramState === 'arraylist-vs-linkedlist';
  const isHierarchy = diagramState === 'hierarchy';
  const isCas = diagramState === 'concurrenthashmap-cas';

  if (isHierarchy) {
    return (
      <StageContainer
        telemetry={[
          { label: 'ROOT INTERFACE', value: 'Iterable<T>' },
          { label: 'CORE CONTRACT', value: 'Collection<T>' },
          { label: 'ELEMENT TYPES', value: 'List, Set, Queue' },
          { label: 'KEY-VALUE', value: 'Map<K, V> (Independent)' },
        ]}
        viewMode={viewMode}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Collections Hierarchy" />
        <IsoBlock cx={250} cy={160} label="Iterable<T>" sublabel="for-each / iterator()" topColor="#4A90E2" badge="Root Interface" is2D={viewMode === '2d'} />
        <IsoBlock cx={450} cy={160} label="Collection<T>" sublabel="size() / add() / stream()" topColor="#4E8752" badge="Core Contract" isHighlighted={true} is2D={viewMode === '2d'} />
        <IsoBlock cx={300} cy={270} label="List<E>" sublabel="ArrayList / LinkedList" topColor="#D9822B" badge="Indexed Order" is2D={viewMode === '2d'} />
        <IsoBlock cx={450} cy={270} label="Set<E>" sublabel="HashSet / TreeSet" topColor="#AB47BC" badge="Unique Only" is2D={viewMode === '2d'} />
        <IsoBlock cx={600} cy={270} label="Queue<E>" sublabel="ArrayDeque / PriorityQueue" topColor="#26A69A" badge="FIFO Buffer" is2D={viewMode === '2d'} />
        <IsoBlock cx={730} cy={180} label="Map<K, V>" sublabel="HashMap / ConcurrentMap" topColor="#D14D41" badge="Key-Value (Separate)" isHighlighted={true} is2D={viewMode === '2d'} />
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
        viewMode={viewMode}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Memory Locality & Cache Lines" />
        <IsoBlock cx={240} cy={180} label="ArrayList Object[]" sublabel="Contiguous Memory" topColor="#4E8752" badge="Cache Friendly" isHighlighted={true} is2D={viewMode === '2d'} />
        <IsoBlock cx={420} cy={160} label="CPU Cache Line" sublabel="Pre-fetches 64 Bytes" topColor="#4A90E2" badge="Zero Misses" is2D={viewMode === '2d'} />
        <IsoBlock cx={620} cy={160} label="L1/L2 Registers" sublabel="Instant Cycle Access" topColor="#26A69A" badge="~1 ns Latency" is2D={viewMode === '2d'} />
        <IsoBlock cx={320} cy={320} label="LinkedList Node" sublabel="Heap Pointer" topColor="#D14D41" badge="Pointer Jump" is2D={viewMode === '2d'} />
        <IsoBlock cx={520} cy={320} label="Scattered Nodes" sublabel="Heap Allocation" topColor="#AB47BC" badge="Cache Miss" is2D={viewMode === '2d'} />
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
        viewMode={viewMode}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="ConcurrentHashMap Lock Striping" />
        <IsoBlock cx={200} cy={220} label="Thread 1 (Write)" sublabel="CAS Insertion" topColor="#4E8752" badge="CAS Success" isHighlighted={true} is2D={viewMode === '2d'} />
        <IsoBlock cx={200} cy={330} label="Thread 2 (Write)" sublabel="Bucket Lock" topColor="#D9822B" badge="Node-Level Lock" isHighlighted={true} is2D={viewMode === '2d'} />
        <IsoBlock cx={430} cy={200} label="Empty Bucket [2]" sublabel="No Lock Required" topColor="#4A90E2" badge="CAS Inserted" is2D={viewMode === '2d'} />
        <IsoBlock cx={430} cy={310} label="Bucket [5] (Head)" sublabel="synchronized(firstNode)" topColor="#D14D41" badge="Striped Lock" is2D={viewMode === '2d'} />
        <IsoBlock cx={670} cy={250} label="Thread 3 (Read)" sublabel="get() Volatile Read" topColor="#26A69A" badge="Zero Contention" is2D={viewMode === '2d'} />
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
      viewMode={viewMode}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
        is2D={viewMode === '2d'}
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
// NEW: Object Headers & Project Lilliput Stage
// -------------------------------------------------------------
function ObjectHeadersLilliputStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  const isLilliput = diagramState === 'compact-headers' || diagramState === 'recap';
  const isLocking = diagramState === 'biased-lightweight-lock';
  const isTlab = diagramState === 'tlab-allocation';

  return (
    <StageContainer
      telemetry={[
        { label: 'OBJECT OVERHEAD', value: isLilliput ? '8 Bytes (Lilliput)' : '16 Bytes (Legacy 64-bit)' },
        { label: 'MARK WORD', value: isLocking ? 'Lightweight Lock' : 'Identity Hash + Age' },
        { label: 'KLASS POINTER', value: isLilliput ? 'In Mark Word' : '32-Bit Compressed OOP' },
        { label: 'ALIGNMENT', value: '8-Byte Word Padding' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="HotSpot Object Layout & Project Lilliput" />

      {/* Mark Word */}
      <IsoBlock
        cx={180}
        cy={180}
        label="Mark Word"
        sublabel={isLocking ? 'Lock Bit [00]' : 'Hash + GC Age (4 bits)'}
        topColor="#D9822B"
        badge="64-Bit / 8B"
        badgeColor="#D9822B"
        isHighlighted={!isLilliput}
        is2D={viewMode === '2d'}
      />

      {/* Klass Word */}
      <IsoBlock
        cx={330}
        cy={180}
        label={isLilliput ? 'Merged Klass' : 'Klass Pointer'}
        sublabel={isLilliput ? 'Embedded in Mark Word' : 'InstanceKlass (Metaspace)'}
        topColor="#4A90E2"
        badge={isLilliput ? '0 Bytes (Eliminated)' : '32-Bit OOP (4B)'}
        badgeColor="#4A90E2"
        isHighlighted={isLilliput}
        is2D={viewMode === '2d'}
      />

      {/* Instance Fields */}
      <IsoBlock
        cx={490}
        cy={180}
        label="Fields / Payload"
        sublabel="int id, boolean active"
        topColor="#AB47BC"
        badge="Instance Data"
        badgeColor="#AB47BC"
        is2D={viewMode === '2d'}
      />

      {/* 8-Byte Padding */}
      <IsoBlock
        cx={640}
        cy={180}
        label="Padding"
        sublabel="Round to 8-Byte Multiples"
        topColor="#78909C"
        badge="Alignment Gap"
        badgeColor="#78909C"
        is2D={viewMode === '2d'}
      />

      {/* TLAB Bump-the-pointer */}
      <IsoBlock
        cx={410}
        cy={320}
        w={120}
        d={60}
        label="TLAB Buffer"
        sublabel="Thread-Local Bump Allocation"
        topColor="#26A69A"
        badge={isTlab ? 'Bump-the-Pointer' : 'Eden Partition'}
        badgeColor="#26A69A"
        isHighlighted={isTlab}
        is2D={viewMode === '2d'}
      />

      <IsoBlock
        cx={610}
        cy={320}
        label="Global Heap Lock"
        sublabel="Contention Avoided!"
        topColor="#4E8752"
        badge="Zero Locks"
        badgeColor="#4E8752"
        is2D={viewMode === '2d'}
      />

      <IsoPath d="M 180 180 L 330 180" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 330 180 L 490 180" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 490 180 L 640 180" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 410 320 L 610 320" color="#26A69A" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// NEW: C2 Escape Analysis & Scalar Replacement Stage
// -------------------------------------------------------------
function EscapeAnalysisStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  const isGlobal = diagramState === 'global-escape';
  const isNoEscape = diagramState === 'no-escape-scalar' || diagramState === 'recap';
  const isLockElision = diagramState === 'lock-elision';

  return (
    <StageContainer
      telemetry={[
        { label: 'ESCAPE STATE', value: isGlobal ? 'GlobalEscape' : 'NoEscape' },
        { label: 'C2 ALLOCATION', value: isNoEscape ? 'Scalar Replaced (0B Heap)' : 'Heap Object (Eden)' },
        { label: 'CPU REGISTERS', value: isNoEscape ? 'RDX=x, RCX=y' : 'Memory Pointers' },
        { label: 'SYNCHRONIZATION', value: isLockElision ? 'Lock Elided (Stripped)' : 'Monitor Active' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="C2 Escape Analysis & Scalar Replacement" />

      {/* Method Scope */}
      <IsoBlock
        cx={170}
        cy={240}
        label="calculateTotal()"
        sublabel="Point p = new Point(10,20)"
        topColor="#4A90E2"
        badge="Method Scope"
        badgeColor="#4A90E2"
        is2D={viewMode === '2d'}
      />

      {/* C2 Escape Analyzer */}
      <IsoBlock
        cx={350}
        cy={180}
        label="C2 Escape Engine"
        sublabel="BCE & Flow Graph"
        topColor="#D9822B"
        badge={isNoEscape ? 'NoEscape Detected' : 'Analyzing'}
        badgeColor="#D9822B"
        isHighlighted={true}
        is2D={viewMode === '2d'}
      />

      {/* Branch 1: Global Escape -> Heap */}
      <IsoBlock
        cx={530}
        cy={120}
        label="JVM Heap"
        sublabel="Returned / Stored Globally"
        topColor="#D14D41"
        badge="Heap Allocation"
        badgeColor="#D14D41"
        isHighlighted={isGlobal}
        is2D={viewMode === '2d'}
      />

      {/* Branch 2: Scalar Replacement -> CPU Registers */}
      <IsoBlock
        cx={540}
        cy={250}
        label="Scalar Replacement"
        sublabel="Decompose into int x, int y"
        topColor="#4E8752"
        badge="Zero Allocation"
        badgeColor="#4E8752"
        isHighlighted={isNoEscape}
        is2D={viewMode === '2d'}
      />

      {/* Registers / Stack */}
      <IsoBlock
        cx={710}
        cy={250}
        label="CPU Registers"
        sublabel="RDX / RCX Direct Math"
        topColor="#26A69A"
        badge="~1 Cycle Speed"
        badgeColor="#26A69A"
        isHighlighted={isNoEscape}
        is2D={viewMode === '2d'}
      />

      {/* Lock Elision */}
      <IsoBlock
        cx={540}
        cy={340}
        label="Lock Elision"
        sublabel="synchronized(obj) Deleted"
        topColor="#AB47BC"
        badge="0 Contention"
        badgeColor="#AB47BC"
        isHighlighted={isLockElision}
        is2D={viewMode === '2d'}
      />

      <IsoPath d="M 170 240 L 350 180" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 350 180 L 530 120" color="#D14D41" isPlaying={isPlaying && isGlobal} />
      <IsoPath d="M 350 180 L 540 250" color="#4E8752" isPlaying={isPlaying && isNoEscape} />
      <IsoPath d="M 540 250 L 710 250" color="#26A69A" isPlaying={isPlaying && isNoEscape} />
      <IsoPath d="M 350 180 L 540 340" color="#AB47BC" isPlaying={isPlaying && isLockElision} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// NEW: ZGC vs G1 GC Deep Dive Stage
// -------------------------------------------------------------
function ZgcVsG1Stage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  const isZgc = diagramState === 'zgc-colored-pointers' || diagramState === 'generational-zgc' || diagramState === 'recap';
  const isLoadBarrier = diagramState === 'concurrent-load-barrier';

  return (
    <StageContainer
      telemetry={[
        { label: 'COLLECTOR MODE', value: isZgc ? 'Generational ZGC' : 'G1 GC Region Evac' },
        { label: 'MAX STW PAUSE', value: isZgc ? '< 1 ms (Sub-Millisecond)' : '50 - 200 ms (STW)' },
        { label: 'POINTER METADATA', value: isZgc ? 'Colored Bits (Marked0/Remapped)' : 'Plain 64-Bit Reference' },
        { label: 'LOAD BARRIER', value: isLoadBarrier ? 'Self-Healing Pointer (<2ns)' : 'Write Barrier (SATB)' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="G1 Region Evacuation vs ZGC Colored Pointers" />

      {/* G1 GC Evacuation */}
      <IsoBlock
        cx={180}
        cy={180}
        label="G1 Region [Eden]"
        sublabel="Stop-The-World Evacuation"
        topColor="#D9822B"
        badge="STW 100ms"
        badgeColor="#D9822B"
        isHighlighted={!isZgc}
        is2D={viewMode === '2d'}
      />

      <IsoBlock
        cx={180}
        cy={310}
        label="G1 Region [Survivor]"
        sublabel="Live Objects Copied"
        topColor="#AB47BC"
        badge="Copy & Forward"
        badgeColor="#AB47BC"
        is2D={viewMode === '2d'}
      />

      {/* ZGC 64-Bit Colored Pointer */}
      <IsoBlock
        cx={400}
        cy={200}
        w={110}
        d={60}
        label="ZGC Colored Pointer"
        sublabel="Marked0 | Marked1 | Remapped"
        topColor="#4A90E2"
        badge="4 Metadata Bits"
        badgeColor="#4A90E2"
        isHighlighted={isZgc}
        is2D={viewMode === '2d'}
      />

      {/* Concurrent Load Barrier */}
      <IsoBlock
        cx={590}
        cy={170}
        label="Load Barrier"
        sublabel="Intercepts Reference Read"
        topColor="#4E8752"
        badge="Self-Healing <2ns"
        badgeColor="#4E8752"
        isHighlighted={isLoadBarrier}
        is2D={viewMode === '2d'}
      />

      {/* Generational ZGC Regions */}
      <IsoBlock
        cx={600}
        cy={310}
        label="Generational ZGC"
        sublabel="Young & Old Gen Concurrent"
        topColor="#26A69A"
        badge="Continuous Cycle"
        badgeColor="#26A69A"
        is2D={viewMode === '2d'}
      />

      {/* Application Mutator Thread */}
      <IsoBlock
        cx={750}
        cy={230}
        label="Mutator Thread"
        sublabel="Never Pauses for GC!"
        topColor="#D14D41"
        badge="Zero Latency"
        badgeColor="#D14D41"
        is2D={viewMode === '2d'}
      />

      <IsoPath d="M 180 180 L 180 310" color="#D9822B" isPlaying={isPlaying && !isZgc} />
      <IsoPath d="M 400 200 L 590 170" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 590 170 L 750 230" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 400 200 L 600 310" color="#26A69A" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// NEW: Virtual Threads & Project Loom Stage
// -------------------------------------------------------------
function VirtualThreadsLoomStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  simulationScenario = 'normal',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
}) {
  const isPinning = diagramState === 'thread-pinning' || simulationScenario === 'thread-pin';
  const isContinuation = diagramState === 'continuation-unmount';

  return (
    <StageContainer
      telemetry={[
        { label: 'THREAD MODEL', value: isPinning ? 'Pinned Under Monitor' : 'M:N Virtual Threads' },
        { label: 'THREAD COUNT', value: '1,000,000 Virtual' },
        { label: 'CARRIER POOL', value: isPinning ? 'STARVED (Carrier Pinned)' : 'ForkJoinPool (8 OS Threads)' },
        { label: 'BLOCKING I/O', value: isPinning ? 'OS Thread Blocked!' : 'Unmount to Java Heap' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Project Loom: Virtual Threads & ForkJoin Carriers" />

      {/* Virtual Threads on Heap */}
      <IsoBlock
        cx={180}
        cy={200}
        label="1,000,000 V-Threads"
        sublabel="~few hundred bytes on Heap"
        topColor="#4E8752"
        badge="Lightweight Heap"
        badgeColor="#4E8752"
        isHighlighted={true}
        is2D={viewMode === '2d'}
      />

      {/* Continuation Scheduler */}
      <IsoBlock
        cx={360}
        cy={180}
        label="Continuation"
        sublabel={isContinuation ? 'Unmounting on Socket Read' : 'Mount / Unmount Lifecycle'}
        topColor="#4A90E2"
        badge={isContinuation ? 'Heap Parked' : 'Cooperative Yield'}
        badgeColor="#4A90E2"
        isHighlighted={isContinuation}
        is2D={viewMode === '2d'}
      />

      {/* ForkJoin Carrier Threads */}
      <IsoBlock
        cx={540}
        cy={180}
        label="ForkJoin Carrier"
        sublabel={isPinning ? 'PINNED by synchronized!' : 'Worker-3 (Running)'}
        topColor={isPinning ? '#D14D41' : '#26A69A'}
        badge={isPinning ? 'CARRIER PINNED' : 'Carrier Active'}
        badgeColor={isPinning ? '#D14D41' : '#26A69A'}
        isHighlighted={isPinning}
        is2D={viewMode === '2d'}
      />

      {/* OS Kernel Thread */}
      <IsoBlock
        cx={720}
        cy={180}
        label="OS Kernel Thread"
        sublabel="1:1 Native Kernel Thread"
        topColor="#78909C"
        badge="1MB Stack Cost"
        badgeColor="#78909C"
        is2D={viewMode === '2d'}
      />

      {/* Pinning Trap */}
      <IsoBlock
        cx={450}
        cy={320}
        w={130}
        d={60}
        label="Pinning Trap"
        sublabel="synchronized(lock) or JNI call"
        topColor="#D14D41"
        badge={isPinning ? 'STARVATION WARNING' : 'Avoid synchronized'}
        badgeColor="#D14D41"
        isHighlighted={isPinning}
        is2D={viewMode === '2d'}
      />

      <IsoBlock
        cx={640}
        cy={320}
        label="ReentrantLock"
        sublabel="Virtual Thread Friendly"
        topColor="#AB47BC"
        badge="Safe Alternative"
        badgeColor="#AB47BC"
        is2D={viewMode === '2d'}
      />

      <IsoPath d="M 180 200 L 360 180" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 360 180 L 540 180" color={isPinning ? '#D14D41' : '#4A90E2'} isPlaying={isPlaying} />
      <IsoPath d="M 540 180 L 720 180" color="#26A69A" isPlaying={isPlaying} />
      <IsoPath d="M 540 180 L 450 320" color="#D14D41" isPlaying={isPlaying && isPinning} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// NEW: False Sharing, Cache Lines & JMM Stage
// -------------------------------------------------------------
function FalseSharingJmmStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  const isContended = diagramState === 'contended-padding' || diagramState === 'recap';
  const isMesiStorm = diagramState === 'mesi-invalidation';

  return (
    <StageContainer
      telemetry={[
        { label: 'CACHE LINE SIZE', value: '64 Bytes' },
        { label: 'MESI PROTOCOL', value: isContended ? 'Shared (Zero Flushes)' : 'Invalidation Storm (I)' },
        { label: 'THROUGHPUT IMPACT', value: isContended ? '24,000,000 ops/s' : '1,800,000 ops/s (13x Drop)' },
        { label: 'PADDED ISOLATION', value: isContended ? '@Contended (128B Pad)' : 'Co-located on same line' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="CPU Cache Lines, MESI Coherence & False Sharing" />

      {/* Core 0 */}
      <IsoBlock
        cx={180}
        cy={180}
        label="CPU Core 0"
        sublabel="Thread A: writes a++"
        topColor="#4A90E2"
        badge="Core 0 L1/L2"
        badgeColor="#4A90E2"
        isHighlighted={true}
        is2D={viewMode === '2d'}
      />

      {/* Shared 64-Byte Cache Line */}
      <IsoBlock
        cx={450}
        cy={160}
        w={130}
        d={60}
        label="64-Byte Cache Line"
        sublabel={isContended ? '[long a] [128-Byte Pad] [long b]' : '[volatile long a | volatile long b]'}
        topColor={isContended ? '#4E8752' : '#D14D41'}
        badge={isContended ? 'Padding Isolated' : 'Contended Cache Line'}
        badgeColor={isContended ? '#4E8752' : '#D14D41'}
        isHighlighted={!isContended}
        is2D={viewMode === '2d'}
      />

      {/* Core 1 */}
      <IsoBlock
        cx={720}
        cy={180}
        label="CPU Core 1"
        sublabel="Thread B: writes b++"
        topColor="#26A69A"
        badge="Core 1 L1/L2"
        badgeColor="#26A69A"
        isHighlighted={true}
        is2D={viewMode === '2d'}
      />

      {/* MESI Invalidation Bus */}
      <IsoBlock
        cx={320}
        cy={310}
        label="MESI Cache Bus"
        sublabel="Modified -> Invalidated line"
        topColor="#D9822B"
        badge={isMesiStorm ? 'Invalidation Storm' : 'Coherence Bus'}
        badgeColor="#D9822B"
        isHighlighted={isMesiStorm}
        is2D={viewMode === '2d'}
      />

      {/* Shared L3 Cache / Main RAM */}
      <IsoBlock
        cx={580}
        cy={310}
        label="Shared L3 / RAM"
        sublabel="Slow memory bus fetch"
        topColor="#AB47BC"
        badge="~50ns Latency"
        badgeColor="#AB47BC"
        is2D={viewMode === '2d'}
      />

      <IsoPath d="M 180 180 L 450 160" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 720 180 L 450 160" color="#26A69A" isPlaying={isPlaying} />
      <IsoPath d="M 450 160 L 320 310" color="#D9822B" isPlaying={isPlaying && !isContended} />
      <IsoPath d="M 320 310 L 580 310" color="#AB47BC" isPlaying={isPlaying && !isContended} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// NEW: Global Safepoints & TTSP Stalls Stage
// -------------------------------------------------------------
function SafepointsTtspStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  const isTtspStall = diagramState === 'uncounted-loop-stall';
  const isMining = diagramState === 'loop-strip-mining' || diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'JVM OPERATION', value: 'Stop-The-World GC Request' },
        { label: 'TTSP LATENCY', value: isTtspStall ? '4,850 ms (Severe Stall!)' : '1.4 ms (Clean Safepoint)' },
        { label: 'THREAD 1 STATE', value: 'Halted at Safepoint' },
        { label: 'THREAD 2 STATE', value: isTtspStall ? 'Stalled in Uncounted Loop' : 'Loop Strip Mined' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Global Safepoints & Time-to-Safepoint (TTSP) Stalls" />

      {/* JVM GC Coordinator */}
      <IsoBlock
        cx={450}
        cy={120}
        label="JVM Coordinator"
        sublabel="STW Safepoint Request"
        topColor="#D14D41"
        badge="GC Trigger"
        badgeColor="#D14D41"
        isHighlighted={true}
        is2D={viewMode === '2d'}
      />

      {/* Safepoint Polling Page */}
      <IsoBlock
        cx={240}
        cy={200}
        label="Safepoint Polling Page"
        sublabel="mprotect => Unreadable (Trap)"
        topColor="#4A90E2"
        badge="Global Trap"
        badgeColor="#4A90E2"
        is2D={viewMode === '2d'}
      />

      {/* Thread 1: Halted immediately */}
      <IsoBlock
        cx={180}
        cy={320}
        label="Thread 1 (Normal)"
        sublabel="Halted at Method Return"
        topColor="#4E8752"
        badge="Halted (2ms)"
        badgeColor="#4E8752"
        is2D={viewMode === '2d'}
      />

      {/* Thread 2: Uncounted Loop */}
      <IsoBlock
        cx={450}
        cy={270}
        w={120}
        d={60}
        label="Thread 2 (Hot Loop)"
        sublabel={isMining ? 'Strip-Mined with Inner Check' : 'for(int i=0; i<N; i++) No Poll!'}
        topColor={isTtspStall ? '#D9822B' : '#4E8752'}
        badge={isTtspStall ? 'TTSP STALL (4.8s)' : 'Polled Every 1000 iter'}
        badgeColor={isTtspStall ? '#D9822B' : '#4E8752'}
        isHighlighted={isTtspStall}
        is2D={viewMode === '2d'}
      />

      {/* Strip Mining Engine */}
      <IsoBlock
        cx={700}
        cy={250}
        label="Loop Strip Mining"
        sublabel="-XX:+UseCountedLoopSafepoints"
        topColor="#26A69A"
        badge={isMining ? 'Active Solution' : 'HotSpot Flag'}
        badgeColor="#26A69A"
        isHighlighted={isMining}
        is2D={viewMode === '2d'}
      />

      <IsoPath d="M 450 120 L 240 200" color="#D14D41" isPlaying={isPlaying} />
      <IsoPath d="M 240 200 L 180 320" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 240 200 L 450 270" color={isTtspStall ? '#D9822B' : '#4E8752'} isPlaying={isPlaying} />
      <IsoPath d="M 450 270 L 700 250" color="#26A69A" isPlaying={isPlaying && isMining} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// NEW: Off-Heap Native Memory & FFM API Stage
// -------------------------------------------------------------
function OffHeapFfmStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  const isArena = diagramState === 'ffm-arena-lifecycle' || diagramState === 'recap';
  const isNmt = diagramState === 'nmt-inspection';

  return (
    <StageContainer
      telemetry={[
        { label: 'HEAP LIMIT', value: '-Xmx2g (Java GC)' },
        { label: 'OFF-HEAP MEMORY', value: isArena ? '80MB (Deterministic Arena)' : '1,696MB (Unbounded Leak)' },
        { label: 'CONTAINER RSS', value: isArena ? '2.4GB / 4GB (Safe)' : '3.98GB (Kubernetes OOMKill!)' },
        { label: 'LIFECYCLE', value: isArena ? 'Arena.ofConfined() Auto-Close' : 'Nondeterministic GC Cleaner' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Off-Heap Native Memory & Modern FFM Arena" />

      {/* Java Heap */}
      <IsoBlock
        cx={180}
        cy={180}
        label="Java Heap (-Xmx2g)"
        sublabel="Eden, Survivor, Tenured"
        topColor="#AB47BC"
        badge="GC Managed"
        badgeColor="#AB47BC"
        is2D={viewMode === '2d'}
      />

      {/* Legacy DirectByteBuffer */}
      <IsoBlock
        cx={340}
        cy={180}
        label="DirectByteBuffer"
        sublabel="sun.misc.Unsafe malloc"
        topColor="#D9822B"
        badge="Nondeterministic Cleaner"
        badgeColor="#D9822B"
        is2D={viewMode === '2d'}
      />

      {/* Modern FFM Arena */}
      <IsoBlock
        cx={520}
        cy={180}
        w={120}
        d={60}
        label="Java 22 FFM Arena"
        sublabel="Arena.ofConfined()"
        topColor="#4E8752"
        badge="Deterministic Free"
        badgeColor="#4E8752"
        isHighlighted={isArena}
        is2D={viewMode === '2d'}
      />

      {/* Linux Process RSS Boundary */}
      <IsoBlock
        cx={710}
        cy={180}
        label="Linux Process RSS"
        sublabel="cgroup 4GB Hard Limit"
        topColor="#D14D41"
        badge="OOMKill Boundary"
        badgeColor="#D14D41"
        is2D={viewMode === '2d'}
      />

      {/* Native Memory Tracking (NMT) */}
      <IsoBlock
        cx={430}
        cy={320}
        label="NMT Diagnostic"
        sublabel="jcmd VM.native_memory detail.diff"
        topColor="#26A69A"
        badge="Allocation Call Sites"
        badgeColor="#26A69A"
        isHighlighted={isNmt}
        is2D={viewMode === '2d'}
      />

      {/* MemorySegment */}
      <IsoBlock
        cx={620}
        cy={320}
        label="MemorySegment"
        sublabel="Spatial Bounds & 64-bit Address"
        topColor="#4A90E2"
        badge="Safe Native Access"
        badgeColor="#4A90E2"
        is2D={viewMode === '2d'}
      />

      <IsoPath d="M 180 180 L 340 180" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 340 180 L 520 180" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 520 180 L 710 180" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 520 180 L 430 320" color="#26A69A" isPlaying={isPlaying && isNmt} />
      <IsoPath d="M 520 180 L 620 320" color="#4A90E2" isPlaying={isPlaying && isArena} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 02. Streams & Lambdas Pipeline Stage
// -------------------------------------------------------------
function StreamsPipelineStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'EVALUATION MODE', value: 'Lazy Evaluation' },
        { label: 'PIPELINE FUSION', value: 'Single-Pass Loop' },
        { label: 'SHORT-CIRCUIT', value: 'findFirst() / limit(n)' },
        { label: 'PARALLELISM', value: 'Common ForkJoinPool' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Java Stream Pipeline Architecture" />
      <IsoBlock cx={170} cy={260} label="List<Policy>" sublabel="Stream Source" topColor="#4A90E2" badge="Source" is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={200} label="filter(p.active)" sublabel="Intermediate Op" topColor="#D9822B" badge="Lazy Sink" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={170} label="map(p.premium)" sublabel="Intermediate Op" topColor="#AB47BC" badge="Lazy 1-to-1" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={680} cy={220} label="collect(toList())" sublabel="Terminal Op" topColor="#4E8752" badge="Execution Trigger" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={560} cy={330} label="Processed DTOs" sublabel="Result Collection" topColor="#26A69A" badge="Immutable Output" is2D={viewMode === '2d'} />
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
function GenericsTypeErasureStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'SOURCE CODE', value: 'List<String> (Generic)' },
        { label: 'COMPILER STEP', value: 'javac Type Erasure' },
        { label: 'BYTECODE OUTPUT', value: 'List (Raw Object)' },
        { label: 'CAST SAFETY', value: 'Synthetic (checkcast)' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Generics Type Erasure Pipeline" />
      <IsoBlock cx={180} cy={260} label="Source Code" sublabel="List<String> type" topColor="#4A90E2" badge="Compile-Time Type" is2D={viewMode === '2d'} />
      <IsoBlock cx={360} cy={210} label="javac Compiler" sublabel="Type Erasure" topColor="#D9822B" badge="Erasure Pass" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={540} cy={190} label="Raw Bytecode" sublabel="List (Object)" topColor="#4E8752" badge="Erased to Object" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={250} label="Bridge Method" sublabel="checkcast (String)" topColor="#AB47BC" badge="Runtime Guard" is2D={viewMode === '2d'} />
      <IsoPath d="M 180 260 L 360 210" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 360 210 L 540 190" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 540 190 L 720 250" color="#4E8752" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 03. Concurrency: ThreadPoolExecutor Architecture
// -------------------------------------------------------------
function ThreadPoolExecutorStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'ACTIVE THREADS', value: '4 / 16 (Core: 4)' },
        { label: 'WORK QUEUE', value: 'ArrayBlockingQueue (128)' },
        { label: 'REJECT POLICY', value: 'CallerRunsPolicy' },
        { label: 'KEEP-ALIVE', value: '60s Timeout' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="ThreadPoolExecutor Architecture" />
      <IsoBlock cx={170} cy={270} label="Incoming Tasks" sublabel="executor.submit()" topColor="#4A90E2" badge="Runnable / Callable" is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={190} label="Core Pool (4)" sublabel="Always Active" topColor="#4E8752" badge="Core Workers" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={500} cy={230} label="BlockingQueue" sublabel="Task Buffer" topColor="#D9822B" badge="FIFO Queue" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={670} cy={180} label="Max Pool (16)" sublabel="Burst Capacity" topColor="#AB47BC" badge="On Queue Full" is2D={viewMode === '2d'} />
      <IsoBlock cx={670} cy={320} label="Reject Handler" sublabel="CallerRunsPolicy" topColor="#D14D41" badge="Backpressure" is2D={viewMode === '2d'} />
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
function DependencyInjectionStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'IOC CONTAINER', value: 'ApplicationContext' },
        { label: 'DEFAULT SCOPE', value: 'Singleton' },
        { label: 'INJECTION TYPE', value: 'Constructor Injection' },
        { label: 'LIFECYCLE HOOK', value: '@PostConstruct -> Ready' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Spring IoC Bean Lifecycle" />
      <IsoBlock cx={170} cy={260} label="@Component Scan" sublabel="Bean Definition" topColor="#4A90E2" badge="Class Scanner" is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={190} label="Instantiation" sublabel="Constructor Invocation" topColor="#D9822B" badge="Instance Created" is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={170} label="@Autowired" sublabel="Dependency Injection" topColor="#4E8752" badge="Wiring Injected" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={680} cy={220} label="@PostConstruct" sublabel="Init Callback" topColor="#AB47BC" badge="Ready State" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={560} cy={330} label="Singleton Cache" sublabel="Default Bean Scope" topColor="#26A69A" badge="Managed Bean" is2D={viewMode === '2d'} />
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
function MicroservicesResilienceStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'CIRCUIT BREAKER', value: 'CLOSED (Normal)' },
        { label: 'FAILURE RATE', value: '1.4% (< 50% Threshold)' },
        { label: 'FALLBACK CACHE', value: 'Redis / Local Cache' },
        { label: 'SERVICE MESH', value: 'Resilience4j' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Resilience4j Circuit Breaker Architecture" />
      <IsoLaptop cx={160} cy={270} label="Client" sublabel="GET /orders" />
      <IsoBlock cx={320} cy={210} label="API Gateway" sublabel="Routing & Auth" topColor="#4A90E2" badge="Ingress" is2D={viewMode === '2d'} />
      <IsoBlock cx={500} cy={170} label="Circuit Breaker" sublabel="State: CLOSED" topColor="#4E8752" badge="Resilience4j" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={690} cy={190} label="Downstream API" sublabel="Payment Service" topColor="#26A69A" badge="200 OK" is2D={viewMode === '2d'} />
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
function RestApiDesignStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'METHOD', value: 'GET /api/v1/policies/123' },
        { label: 'IDEMPOTENT', value: 'Yes (GET, PUT, DELETE)' },
        { label: 'STATUS CODE', value: '200 OK (JSON Payload)' },
        { label: 'SPECIFICATION', value: 'OpenAPI 3.0 / Swagger' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="REST API Resource Design & Contracts" />
      <IsoLaptop cx={160} cy={270} label="Consumer" sublabel="GET /policies/123" />
      <IsoBlock cx={320} cy={220} label="Request Validator" sublabel="@Valid DTO Parser" topColor="#4A90E2" badge="Validation Guard" is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={180} label="Controller" sublabel="@GetMapping" topColor="#4E8752" badge="HTTP 200 OK" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={690} cy={220} label="DTO Response" sublabel="application/json" topColor="#AB47BC" badge="Serialized JSON" is2D={viewMode === '2d'} />
      <IsoPath d="M 160 270 L 320 220" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 320 220 L 510 180" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 510 180 L 690 220" color="#AB47BC" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 06. MongoDB Document Model & MongoTemplate
// -------------------------------------------------------------
function MongoDbPersistenceStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'DATA MODEL', value: 'BSON Document Store' },
        { label: 'STORAGE ENGINE', value: 'WiredTiger (Cache: 4GB)' },
        { label: 'INDEXING', value: 'Compound B-Tree Index' },
        { label: 'WRITE CONCERN', value: 'w: majority, j: true' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="MongoDB Document & Persistence Architecture" />
      <IsoBlock cx={170} cy={270} label="@Document Policy" sublabel="Java Entity" topColor="#4A90E2" badge="POJO" is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={200} label="MongoTemplate" sublabel="BSON Serializer" topColor="#4E8752" badge="Spring Data" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={170} label="B-Tree Index" sublabel="Index: (ssn, date)" topColor="#D9822B" badge="Fast Seek" is2D={viewMode === '2d'} />
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
function CiCdPipelineStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'ORCHESTRATOR', value: 'GitLab CI / Jenkins' },
        { label: 'BUILD TOOL', value: 'Maven 3.9 (JDK 21)' },
        { label: 'QUALITY GATE', value: 'SonarQube PASSED (0 bugs)' },
        { label: 'DEPLOYMENT', value: 'Docker -> Kubernetes' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Continuous Integration & Delivery Pipeline" />
      <IsoBlock cx={160} cy={270} label="Git Push" sublabel="git push origin main" topColor="#4A90E2" badge="Commit Trigger" is2D={viewMode === '2d'} />
      <IsoBlock cx={310} cy={200} label="Maven Build" sublabel="mvn clean verify" topColor="#D9822B" badge="Tests Passed" is2D={viewMode === '2d'} />
      <IsoBlock cx={480} cy={160} label="SonarQube" sublabel="Quality Gate" topColor="#4E8752" badge="Zero Vulns" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={640} cy={180} label="Docker Build" sublabel="Multi-Stage Image" topColor="#AB47BC" badge="OCI Container" is2D={viewMode === '2d'} />
      <IsoBlock cx={750} cy={280} label="Kubernetes" sublabel="Rolling Deployment" topColor="#26A69A" badge="Production Live" isHighlighted={true} is2D={viewMode === '2d'} />
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
function ObservabilityStackStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'METRICS AGENT', value: 'Micrometer (JVM Heap, Threads)' },
        { label: 'SCRAPE CADENCE', value: '15s Interval (Prometheus)' },
        { label: 'LOG INGESTION', value: 'Splunk / ELK Stack' },
        { label: 'ALERT STATUS', value: 'Healthy (0 Fired)' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Full-Stack Observability & Telemetry" />
      <IsoBlock cx={170} cy={270} label="Java App" sublabel="Micrometer Exporter" topColor="#4E8752" badge="JVM Instrumentation" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={180} label="Prometheus" sublabel="Timeseries DB" topColor="#D9822B" badge="Metrics Scraper" is2D={viewMode === '2d'} />
      <IsoBlock cx={520} cy={150} label="Grafana" sublabel="Live Dashboards" topColor="#4A90E2" badge="Latency / Heap" is2D={viewMode === '2d'} />
      <IsoBlock cx={520} cy={310} label="Logback Logger" sublabel="MDC Correlation ID" topColor="#AB47BC" badge="Structured JSON" is2D={viewMode === '2d'} />
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
function OopPillarsStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'DYNAMIC DISPATCH', value: 'JVM Virtual Method Table (vtable)' },
        { label: 'POLYMORPHISM', value: 'Runtime Resolution' },
        { label: 'ENCAPSULATION', value: 'Private State + Invariants' },
        { label: 'INHERITANCE', value: 'Liskov Substitution Principle' },
      ]}
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="OOP Pillars & JVM Dynamic Dispatch" />
      <IsoBlock cx={180} cy={250} label="Interface Contract" sublabel="PaymentGateway" topColor="#4A90E2" badge="Abstraction" is2D={viewMode === '2d'} />
      <IsoBlock cx={360} cy={190} label="Class Hierarchy" sublabel="StripeGateway implements" topColor="#D9822B" badge="Inheritance" is2D={viewMode === '2d'} />
      <IsoBlock cx={540} cy={170} label="JVM vtable" sublabel="Method Pointer Offset" topColor="#4E8752" badge="Polymorphism" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={240} label="Private State" sublabel="apiKey, balance" topColor="#AB47BC" badge="Encapsulation" is2D={viewMode === '2d'} />
      <IsoPath d="M 180 250 L 360 190" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 360 190 L 540 170" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 540 170 L 720 240" color="#AB47BC" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. Java Data Types & Memory Model
// -------------------------------------------------------------
function DataTypesMemoryStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  simulationScenario = 'normal',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'PRIMITIVE VALUES', value: 'int, long, double (Stack)' },
        { label: 'OBJECT REFERENCES', value: '8-Byte Pointers (Compressed OOPs)' },
        { label: 'STRING CONSTANT POOL', value: 'Interned in JVM Heap' },
        { label: 'AUTOBOXING COST', value: 'Integer (16B) vs int (4B)' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Java Data Types & Stack vs Heap" />
      <IsoBlock cx={180} cy={260} label="Thread Stack" sublabel="int age = 42 (4B)" topColor="#4E8752" badge="Stack Direct Value" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={360} cy={190} label="Object Reference" sublabel="String name -> pointer" topColor="#4A90E2" badge="Reference (8B)" is2D={viewMode === '2d'} />
      <IsoBlock cx={550} cy={160} label="String Constant Pool" sublabel='"Alice" (Interned)' topColor="#AB47BC" badge="Heap String Pool" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={240} label="Heap Object" sublabel="new Customer() (24B+)" topColor="#D9822B" badge="Live Heap Object" is2D={viewMode === '2d'} />
      <IsoPath d="M 180 260 L 360 190" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 360 190 L 550 160" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 360 190 L 720 240" color="#D9822B" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. Exception Handling & Call Stack Unwinding
// -------------------------------------------------------------
function ExceptionHandlingStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  simulationScenario = 'normal',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
}) {
  return (
    <StageContainer
      telemetry={[
        { label: 'CALL STACK', value: 'Frame #3 -> Frame #2 -> Frame #1' },
        { label: 'UNWINDING EVENT', value: 'throw new PolicyException()' },
        { label: 'EXCEPTION TYPE', value: 'Checked (IOException) vs Unchecked' },
        { label: 'CLEANUP GUARANTEE', value: 'finally block / try-with-resources' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Exception Handling & Stack Unwinding" />
      <IsoBlock cx={180} cy={280} label="Caller Method" sublabel="try { service.call() }" topColor="#4A90E2" badge="Stack Frame #1" is2D={viewMode === '2d'} />
      <IsoBlock cx={360} cy={210} label="Service Layer" sublabel="throws PolicyException" topColor="#D9822B" badge="Stack Frame #2" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={540} cy={170} label="throw Exception" sublabel="Stack Unwinding Trigger" topColor="#D14D41" badge="Exception Fired" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={710} cy={250} label="catch / finally" sublabel="AutoCloseable.close()" topColor="#4E8752" badge="Safe Recovery" is2D={viewMode === '2d'} />
      <IsoPath d="M 180 280 L 360 210" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 360 210 L 540 170" color="#D14D41" isPlaying={isPlaying} />
      <IsoPath d="M 540 170 L 710 250" color="#4E8752" isPlaying={isPlaying} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. How Java Runs Your Code - 3D Isometric Pipeline Stage
// -------------------------------------------------------------
function JavaExecutionStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  simulationScenario = 'normal',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
}) {
  const isCompile = diagramState === 'compile-bytecode' || diagramState === 'bytecode-inspect';
  const isClassLoader = diagramState === 'classloader-load' || diagramState === 'verify-execute';
  const isJit = diagramState === 'jit-compile' || diagramState === 'recap' || simulationScenario === 'hot-calls';
  const isMemory = diagramState === 'memory-stack-heap' || diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'EXECUTION MODE', value: isJit ? 'Tiered JIT (Level 4 C2)' : isClassLoader ? 'ClassLoader' : 'Interpreter' },
        { label: 'BYTECODE VERIFIER', value: '0xCAFEBABE' },
        { label: 'HOT INVOCATIONS', value: isJit ? '120,450 / s' : '820 / s' },
        { label: 'NATIVE CODE CACHE', value: isJit ? '64 MB' : '4 MB' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="JVM Runtime Environment" />
      <IsoLaptop cx={180} cy={280} label="Developer" sublabel="PaymentService.java" />
      <IsoBlock cx={330} cy={240} label="javac Compiler" sublabel="Bytecode Parser" topColor="#D9822B" leftColor="#B36B22" rightColor="#8F5419" badge="AST Parsing" badgeColor="#D9822B" isHighlighted={isCompile} is2D={viewMode === '2d'} />
      <IsoBlock cx={520} cy={210} w={100} d={56} h={40} label="JVM Engine" sublabel="HotSpot C1 / C2" topColor="#4E8752" leftColor="#3C6B3F" rightColor="#2B4F2E" badge={isJit ? 'Compiled JIT' : 'Interpreting'} badgeColor="#4E8752" isHighlighted={isJit} is2D={viewMode === '2d'} />
      <IsoBlock cx={420} cy={120} w={76} d={44} label="Thread Stack" sublabel="Frames & Vars" topColor="#4A90E2" leftColor="#3874B8" rightColor="#26578E" badge="StackFrame #1" badgeColor="#4A90E2" isHighlighted={isMemory || simulationScenario === 'recursion'} is2D={viewMode === '2d'} />
      <IsoBlock cx={590} cy={120} w={86} d={48} label="Heap Memory" sublabel="Eden & Old Gen" topColor="#AB47BC" leftColor="#893796" rightColor="#682773" badge="Live Objects" badgeColor="#AB47BC" isHighlighted={isMemory} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={280} label="Host CPU / OS" sublabel="Native Assembly" topColor="#D14D41" leftColor="#A83C32" rightColor="#822C24" badge="x86-64 / ARM" badgeColor="#D14D41" isHighlighted={isJit} is2D={viewMode === '2d'} />
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
function ThreadLifecycleStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  simulationScenario = 'normal',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
}) {
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
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Thread Lifecycle State Machine" />
      <IsoBlock cx={180} cy={270} label="NEW" sublabel="new Thread()" topColor="#7E57C2" leftColor="#5E4094" rightColor="#442D6B" badge="Thread.init()" is2D={viewMode === '2d'} />
      <IsoBlock cx={320} cy={180} label="RUNNABLE" sublabel="In OS Scheduler" topColor="#4A90E2" leftColor="#3468A3" rightColor="#224773" badge="Ready Queue" is2D={viewMode === '2d'} />
      <IsoBlock cx={480} cy={150} label="RUNNING" sublabel="Core #4 Active" topColor="#4E8752" leftColor="#39633C" rightColor="#264528" badge="Executing" badgeColor="#4E8752" isHighlighted={isRunning} is2D={viewMode === '2d'} />
      <IsoBlock cx={420} cy={310} label="BLOCKED" sublabel="synchronized Lock" topColor="#D9822B" leftColor="#A8641F" rightColor="#784714" badge="Monitor Wait" badgeColor="#D9822B" isHighlighted={isBlocked} is2D={viewMode === '2d'} />
      <IsoBlock cx={590} cy={300} label="WAITING" sublabel="wait() / park()" topColor="#AB47BC" leftColor="#80338C" rightColor="#572161" badge="Parked" badgeColor="#AB47BC" isHighlighted={isWaiting} is2D={viewMode === '2d'} />
      <IsoBlock cx={730} cy={240} label="TERMINATED" sublabel="run() returned" topColor="#D14D41" leftColor="#9C372E" rightColor="#6E241D" badge="Dead" is2D={viewMode === '2d'} />
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
function CompletableFutureStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
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
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="CompletableFuture Task Graph" />
      <IsoLaptop cx={170} cy={270} label="Client" sublabel="GET /dashboard" />
      <IsoBlock cx={330} cy={160} label="Policy Core API" sublabel="supplyAsync()" topColor="#4A90E2" leftColor="#3466A1" rightColor="#22456E" badge="80 ms" badgeColor="#4A90E2" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={340} label="Payment HPP API" sublabel="supplyAsync()" topColor="#7E57C2" leftColor="#5E3F94" rightColor="#402969" badge="110 ms" badgeColor="#7E57C2" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={530} cy={240} w={96} d={52} label="thenCombine()" sublabel="Merge DTOs" topColor="#D9822B" leftColor="#A8621D" rightColor="#754311" badge="Aggregate" badgeColor="#D9822B" isHighlighted={isCombine} is2D={viewMode === '2d'} />
      <IsoDatabase cx={530} cy={370} rx={30} ry={16} h={36} color="#D14D41" label="Fallback Cache" sublabel="exceptionally()" badge="Resilience" isHighlighted={isFallback} />
      <IsoBlock cx={730} cy={240} label="Response DTO" sublabel="Aggregated JSON" topColor="#4E8752" leftColor="#3A6B3D" rightColor="#264D29" badge="Complete" badgeColor="#4E8752" isHighlighted={isCombine} is2D={viewMode === '2d'} />
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
function SpringLifecycleStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
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
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Spring Boot Layered Architecture" />
      <IsoLaptop cx={150} cy={270} label="Client" sublabel="GET /api/policy" />
      <IsoBlock cx={290} cy={240} label="Dispatcher" sublabel="Front Controller" topColor="#D9822B" leftColor="#A8621D" rightColor="#784411" badge="FilterChain" is2D={viewMode === '2d'} />
      <IsoBlock cx={430} cy={180} label="Controller" sublabel="@RestController" topColor="#4A90E2" leftColor="#34649E" rightColor="#21426B" badge="Mapping" badgeColor="#4A90E2" isHighlighted={isController} is2D={viewMode === '2d'} />
      <IsoBlock cx={570} cy={180} label="Service" sublabel="Business Logic" topColor="#4E8752" leftColor="#37693A" rightColor="#224724" badge="@Transactional" badgeColor="#4E8752" isHighlighted={isController} is2D={viewMode === '2d'} />
      <IsoBlock cx={570} cy={320} label="Repository" sublabel="MongoRepository" topColor="#AB47BC" leftColor="#7F328C" rightColor="#572061" badge="Spring Data" badgeColor="#AB47BC" isHighlighted={isDb} is2D={viewMode === '2d'} />
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
function JwtOAuth2Stage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
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
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="OAuth2 & JWT Security Topology" />
      <IsoLaptop cx={170} cy={270} label="Client SPA" sublabel="Bearer <Token>" />
      <IsoBlock cx={330} cy={150} label="ForgeRock AM" sublabel="OAuth2 / IdP" topColor="#D9822B" leftColor="#A8621D" rightColor="#784411" badge="Issue Token" badgeColor="#D9822B" isHighlighted={isAuth} is2D={viewMode === '2d'} />
      <IsoBlock cx={500} cy={240} label="API Gateway" sublabel="JWT Signature Verify" topColor="#4A90E2" leftColor="#34649E" rightColor="#21426B" badge="JWKS Verified" badgeColor="#4A90E2" isHighlighted={isGateway} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={240} label="Spring Backend" sublabel="Protected Resource" topColor="#4E8752" leftColor="#37693A" rightColor="#224724" badge="SecurityContext" badgeColor="#4E8752" isHighlighted={isBackend} is2D={viewMode === '2d'} />
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
function MemoryGcStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
}) {
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
      viewMode={viewMode}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="G1 Garbage Collection Regions" />
      <IsoBlock cx={170} cy={270} label="Thread Stack" sublabel="Root References" topColor="#4E8752" leftColor="#386B3B" rightColor="#244A26" badge="GC Roots" is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={150} label="Eden Space" sublabel="New Allocations" topColor="#42A5F5" leftColor="#2B74B0" rightColor="#1A4F7A" badge="Fast TLAB" badgeColor="#42A5F5" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={340} label="Survivor S0/S1" sublabel="Aging Objects" topColor="#26A69A" leftColor="#19756C" rightColor="#0F524B" badge="Age Counter" badgeColor="#26A69A" isHighlighted={isMinor} is2D={viewMode === '2d'} />
      <IsoBlock cx={530} cy={240} label="Old Generation" sublabel="Long-lived Objects" topColor="#AB47BC" leftColor="#7A3087" rightColor="#521E5C" badge="Tenured" badgeColor="#AB47BC" isHighlighted={isMajor} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={240} label="G1 Collector" sublabel="Concurrent Mark" topColor="#D14D41" leftColor="#99352C" rightColor="#6E231D" badge="Zero Leaks" badgeColor="#D14D41" isHighlighted={isMajor} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 270 L 330 150" color="#42A5F5" isPlaying={isPlaying} />
      <IsoPath d="M 330 150 L 330 340" color="#26A69A" isPlaying={isPlaying} />
      <IsoPath d="M 330 340 L 530 240" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 720 240 L 530 240" color="#D14D41" isPlaying={isPlaying && isMajor} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// Isometric Stage Layout Container with Responsive Telemetry Header & Simulator Effects
// -------------------------------------------------------------
function StageContainer({
  telemetry,
  viewMode = '3d',
  simulationScenario = 'normal',
  children,
}: {
  telemetry: Array<{ label: string; value: string }>;
  viewMode?: '3d' | '2d';
  simulationScenario?: 'normal' | 'hot-calls' | 'recursion' | 'thread-pin';
  children: React.ReactNode;
}) {
  let effectiveTelemetry = telemetry;
  if (simulationScenario === 'hot-calls') {
    effectiveTelemetry = [
      { label: 'JIT COMPILER', value: 'Level 4 C2 Active' },
      { label: 'CALL FREQUENCY', value: '148,200 calls/s' },
      { label: 'CODE CACHE', value: '64MB Committed' },
      { label: 'STATUS', value: 'OSR Native Compiled' },
    ];
  } else if (simulationScenario === 'recursion') {
    effectiveTelemetry = [
      { label: 'STACK STATE', value: 'StackOverflowError' },
      { label: 'FRAME COUNT', value: '10,240 frames' },
      { label: 'STACK MEMORY', value: '-Xss1m Exhausted' },
      { label: 'JVM ACTION', value: 'Stack Unwinding' },
    ];
  } else if (simulationScenario === 'thread-pin') {
    effectiveTelemetry = [
      { label: 'VIRTUAL THREAD', value: 'Pinned to Carrier' },
      { label: 'ROOT CAUSE', value: 'synchronized (Monitor)' },
      { label: 'CARRIER POOL', value: 'ForkJoin-worker-1' },
      { label: 'CONSEQUENCE', value: 'Carrier Starvation!' },
    ];
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#161513] text-cream-100 select-none">
      {/* Top Telemetry Metrics Row: responsive auto-columns on mobile, 4-col on desktop */}
      <div className="grid grid-flow-col auto-cols-[minmax(115px,1fr)] sm:grid-flow-row sm:grid-cols-4 gap-2 px-3 pt-2.5 pb-1 z-20 flex-shrink-0 overflow-x-auto scrollbar-none">
        {effectiveTelemetry.map((t, idx) => (
          <div
            key={idx}
            className={`rounded-xl px-2.5 py-1.5 bg-[#22201D] border flex flex-col justify-center transition-all ${
              simulationScenario !== 'normal'
                ? 'border-amber-500/50 shadow-[0_0_12px_rgba(217,130,43,0.15)]'
                : 'border-[#33302B]'
            }`}
          >
            <span className="text-[9px] font-mono font-semibold tracking-wider text-cream-400/60 uppercase truncate">
              {t.label}
            </span>
            <span
              className={`text-xs sm:text-sm font-mono font-bold truncate mt-0.5 ${
                simulationScenario === 'hot-calls'
                  ? 'text-amber-400'
                  : simulationScenario === 'recursion'
                  ? 'text-rose-400'
                  : simulationScenario === 'thread-pin'
                  ? 'text-purple-400'
                  : 'text-cream-100'
              }`}
            >
              {t.value}
            </span>
          </div>
        ))}
      </div>

      {/* Simulator Warning Banner when active */}
      {simulationScenario !== 'normal' && (
        <div className="mx-3 mt-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono flex items-center justify-between z-20 flex-shrink-0">
          <span className="font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            SIMULATOR: {
              simulationScenario === 'hot-calls'
                ? 'Simulating 10,000 High-Velocity Invocations (JIT C2 Tier 4 Triggered)'
                : simulationScenario === 'recursion'
                ? 'Simulating Infinite Method Recursion (StackOverflowError)'
                : 'Simulating Virtual Thread Pinned Under synchronized (Carrier Starvation)'
            }
          </span>
          <span className="text-[9px] opacity-75 font-semibold">Active</span>
        </div>
      )}

      {/* Center SVG Stage Canvas */}
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

          {/* Render stage 3D / 2D children */}
          {children}

          {/* Simulation Overlay Effects */}
          {simulationScenario === 'recursion' && (
            <g>
              <rect x="0" y="0" width="900" height="500" fill="rgba(209, 77, 65, 0.08)" />
              <g transform="translate(450, 250)">
                <circle r="140" fill="none" stroke="#D14D41" strokeWidth="2.5" className="animate-ping" opacity="0.4" />
                <rect x="-160" y="-22" width="320" height="44" rx="12" fill="#1E1413" stroke="#D14D41" strokeWidth="2" />
                <text x="0" y="5" textAnchor="middle" fill="#FF8A80" className="text-sm font-mono font-bold">
                  💥 java.lang.StackOverflowError
                </text>
              </g>
            </g>
          )}

          {simulationScenario === 'thread-pin' && (
            <g>
              <rect x="0" y="0" width="900" height="500" fill="rgba(171, 71, 188, 0.08)" />
              <g transform="translate(450, 420)">
                <rect x="-180" y="-18" width="360" height="36" rx="10" fill="#201524" stroke="#AB47BC" strokeWidth="1.8" />
                <text x="0" y="4" textAnchor="middle" fill="#E1BEE7" className="text-xs font-mono font-bold">
                  ⚠️ CARRIER THREAD PINNED: synchronized(lock)
                </text>
              </g>
            </g>
          )}

          {simulationScenario === 'hot-calls' && (
            <g transform="translate(450, 40)">
              <rect x="-170" y="-14" width="340" height="28" rx="8" fill="#2A1E14" stroke="#D9822B" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fill="#FFD180" className="text-[11px] font-mono font-bold">
                ⚡ JIT C2 COMPILED: On-Stack Replacement (OSR)
              </text>
            </g>
          )}
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
        <span className="hidden sm:inline font-mono text-[9px] text-cream-400/40">
          {viewMode === '2d' ? '2D ARCHITECTURAL FLAT ENGINE' : '3D ISOMETRIC ENGINE'}
        </span>
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
