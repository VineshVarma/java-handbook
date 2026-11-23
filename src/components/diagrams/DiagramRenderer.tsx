'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DiagramState } from '@/lib/types';
import {
  IsoBlock,
  IsoDatabase,
  IsoLaptop,
  IsoPedestal,
} from './IsoShapes';

export interface DiagramRendererProps {
  lessonSlug: string;
  diagramState: DiagramState;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: 'normal' | 'hot-calls' | 'recursion' | 'thread-pin';
  diagramAlt?: string;
}

export function DiagramRenderer({
  lessonSlug,
  diagramState,
  isPlaying,
  viewMode = '3d',
  simulationScenario = 'normal',
  diagramAlt,
}: DiagramRendererProps) {
  // 01. Foundations
  if (lessonSlug === 'how-java-runs') {
    return <JavaExecutionStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'oop-pillars') {
    return <OopPillarsStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'memory-and-gc') {
    return <MemoryGcStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'java-data-types') {
    return <DataTypesMemoryStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'exception-handling') {
    return <ExceptionHandlingStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'object-headers-lilliput') {
    return <ObjectHeadersLilliputStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'escape-analysis') {
    return <EscapeAnalysisStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'zgc-vs-g1') {
    return <ZgcVsG1Stage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }

  // 02. Collections & Streams
  if (lessonSlug === 'collections-framework') {
    return <HashMapCollectionsStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'streams-api') {
    return <StreamsPipelineStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'lambdas-functional') {
    return <LambdasFunctionalStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'generics') {
    return <GenericsTypeErasureStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }

  // 03. Concurrency
  if (lessonSlug === 'thread-lifecycle') {
    return <ThreadLifecycleStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'completable-future') {
    return <CompletableFutureStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'executor-service') {
    return <ThreadPoolExecutorStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'virtual-threads-loom') {
    return <VirtualThreadsLoomStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} simulationScenario={simulationScenario} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'false-sharing-jmm') {
    return <FalseSharingJmmStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'safepoints-ttsp') {
    return <SafepointsTtspStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }

  // 04. Spring Boot
  if (lessonSlug === 'spring-request-lifecycle') {
    return <SpringLifecycleStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'dependency-injection') {
    return <DependencyInjectionStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'microservices-patterns') {
    return <MicroservicesResilienceStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }

  // 05. REST & Security
  if (lessonSlug === 'rest-api-design') {
    return <RestApiDesignStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'jwt-oauth2') {
    return <JwtOAuth2Stage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }

  // 06. Persistence & DevOps
  if (lessonSlug === 'mongodb-document-model') {
    return <MongoDbPersistenceStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'cicd-pipeline') {
    return <CiCdPipelineStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'observability-stack') {
    return <ObservabilityStackStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }
  if (lessonSlug === 'offheap-ffm-api') {
    return <OffHeapFfmStage diagramState={diagramState} isPlaying={isPlaying} viewMode={viewMode} diagramAlt={diagramAlt} />;
  }

  return null;
}

// -------------------------------------------------------------
// 02. HashMap Internals & Collections Deep Dive
// -------------------------------------------------------------
function HashMapCollectionsStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isArrayList = diagramState === 'arraylist-vs-linkedlist';
  const isHierarchy = diagramState === 'hierarchy';
  const isCas = diagramState === 'concurrenthashmap-cas';
  const isTreeify = diagramState === 'hashmap-buckets-treeify';

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
        diagramAlt={diagramAlt}
        legend={[
          { label: 'Root Interface', color: '#4A90E2' },
          { label: 'Core Contract', color: '#4E8752' },
          { label: 'Ordered / Set / Queue', color: '#D9822B' },
          { label: 'Map Key-Value', color: '#D14D41' },
        ]}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Collections Hierarchy" is2D={viewMode === '2d'} />
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
          { label: 'LINKEDLIST COST', value: '24B Total Node Footprint' },
        ]}
        viewMode={viewMode}
        diagramAlt={diagramAlt}
        legend={[
          { label: 'Contiguous Array', color: '#4E8752' },
          { label: 'CPU Cache Line', color: '#4A90E2' },
          { label: 'L1/L2 Registers', color: '#26A69A' },
          { label: 'Pointer Jump', color: '#D14D41' },
        ]}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Memory Locality & Cache Lines" is2D={viewMode === '2d'} />
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
          { label: 'LOCKING MODEL', value: 'CAS on Bucket Heads' },
          { label: 'SYNCHRONIZED', value: 'Only on Hash Collision' },
          { label: 'CONCURRENCY LEVEL', value: 'Non-Blocking Read O(1)' },
          { label: 'TREE BIN CAS', value: 'TreeBin Lock Bit' },
        ]}
        viewMode={viewMode}
        diagramAlt={diagramAlt}
        legend={[
          { label: 'Atomic CAS', color: '#4E8752' },
          { label: 'Bucket Header', color: '#4A90E2' },
          { label: 'Collision Lock', color: '#D9822B' },
          { label: 'Concurrent Read', color: '#26A69A' },
        ]}
      >
        <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="ConcurrentHashMap Lock-Free CAS" is2D={viewMode === '2d'} />
        <IsoBlock cx={200} cy={220} label="Thread 1 (put)" sublabel="casTabAt(tab, i, null, n)" topColor="#4E8752" badge="CAS Insert" isHighlighted={true} is2D={viewMode === '2d'} />
        <IsoBlock cx={200} cy={330} label="Thread 2 (put)" sublabel="synchronized(headNode)" topColor="#D9822B" badge="Bucket Lock" isHighlighted={true} is2D={viewMode === '2d'} />
        <IsoBlock cx={430} cy={200} label="Bucket [0..15]" sublabel="Node<K,V>[] table" topColor="#4A90E2" badge="Volatile Table" is2D={viewMode === '2d'} />
        <IsoBlock cx={430} cy={310} label="Bucket [4] Collided" sublabel="Linked Node Chain" topColor="#AB47BC" badge="Locking Bin" is2D={viewMode === '2d'} />
        <IsoBlock cx={670} cy={250} label="Concurrent Read" sublabel="volatile val => Zero Lock" topColor="#26A69A" badge="Lock-Free Read" isHighlighted={true} is2D={viewMode === '2d'} />
        <IsoPath d="M 200 220 L 430 200" color="#4E8752" isPlaying={isPlaying} />
        <IsoPath d="M 200 330 L 430 310" color="#D9822B" isPlaying={isPlaying} />
        <IsoPath d="M 670 250 L 430 200" color="#26A69A" isPlaying={isPlaying} />
      </StageContainer>
    );
  }

  // Default / isTreeify: Full Internal HashMap Buckets, Hashing, Collision, and Treeification
  return (
    <StageContainer
      telemetry={[
        { label: 'HASH SPREAD', value: '(h ^ (h >>> 16))' },
        { label: 'BUCKET INDEX', value: '(n - 1) & hash = [4]' },
        { label: 'CAPACITY / THRESHOLD', value: '16 Buckets (Resize @ 12)' },
        { label: 'TREEIFY THRESHOLD', value: isTreeify ? 'Treeify (binCount >= 8)' : '8 Nodes -> Red-Black Tree' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Hash Key', color: '#D9822B' },
        { label: 'Hash Table', color: '#4A90E2' },
        { label: 'Linked Chain', color: '#4E8752' },
        { label: 'Red-Black Tree', color: '#D14D41' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="HashMap<K, V> Internal Buckets & Treeify" is2D={viewMode === '2d'} />
      <IsoBlock cx={150} cy={240} label="Key: user_42" sublabel='key.hashCode()' topColor="#D9822B" badge="Key Object" badgeColor="#D9822B" is2D={viewMode === '2d'} />
      <IsoBlock cx={310} cy={180} label="Spread Hash" sublabel="XOR upper 16 bits" topColor="#4A90E2" badge="h ^ (h >>> 16)" badgeColor="#4A90E2" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={490} cy={220} label="Bucket [4]" sublabel="Node<K,V>[] table" topColor="#4E8752" badge="table[4]" badgeColor="#4E8752" isHighlighted={true} is2D={viewMode === '2d'} />
      <IsoBlock cx={630} cy={220} label="Linked List" sublabel="3 Collisions" topColor="#7E57C2" badge="O(N) Search" badgeColor="#7E57C2" is2D={viewMode === '2d'} />
      <IsoBlock cx={760} cy={220} label="Treeify Threshold" sublabel="binCount >= 8" topColor="#D14D41" badge="Red-Black Tree" badgeColor="#D14D41" isHighlighted={isTreeify} is2D={viewMode === '2d'} />
      <IsoBlock cx={640} cy={340} label="TreeNode Root" sublabel="balanceInsertion()" topColor="#D14D41" badge="O(log N) Red-Black" badgeColor="#D14D41" isHighlighted={isTreeify} is2D={viewMode === '2d'} />
      <IsoBlock cx={540} cy={410} label="TreeNode Left" sublabel="Black Node" topColor="#E06C60" badge="O(log N)" is2D={viewMode === '2d'} />
      <IsoBlock cx={740} cy={410} label="TreeNode Right" sublabel="Red Node" topColor="#1C1826" badge="Balanced" is2D={viewMode === '2d'} />
      <IsoPath d="M 150 240 L 310 180" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 310 180 L 490 220" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 490 220 L 630 220" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 630 220 L 760 220" color="#7E57C2" isPlaying={isPlaying} />
      <IsoPath d="M 760 220 L 640 340" color="#D14D41" isPlaying={isPlaying && isTreeify} />
      <IsoPath d="M 640 340 L 540 410" color="#E06C60" isPlaying={isPlaying && isTreeify} />
      <IsoPath d="M 640 340 L 740 410" color="#1C1826" isPlaying={isPlaying && isTreeify} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. Object Headers & Project Lilliput Stage
// -------------------------------------------------------------
function ObjectHeadersLilliputStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isLayout = diagramState === 'object-layout';
  const isCompressedOops = diagramState === 'compressed-oops';
  const isLilliput = diagramState === 'lilliput-headers';
  const isTlab = diagramState === 'tlab-allocation';

  return (
    <StageContainer
      telemetry={[
        { label: 'OBJECT OVERHEAD', value: isLilliput ? '8 Bytes (Lilliput Compact)' : '16 Bytes (Legacy 64-bit)' },
        { label: 'MARK WORD', value: isLayout ? 'Identity Hash + Age' : 'Mark Word [64-bit]' },
        { label: 'KLASS POINTER', value: isLilliput ? 'Embedded in Mark Word' : isCompressedOops ? '32-Bit Compressed OOP' : '64-Bit Native' },
        { label: 'ALLOCATION PATH', value: isTlab ? 'TLAB Bump-Pointer' : 'Standard Eden Heap' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Mark Word', color: '#D9822B' },
        { label: 'Klass Pointer', color: '#4A90E2' },
        { label: 'Payload Fields', color: '#AB47BC' },
        { label: 'TLAB Fastpath', color: '#4E8752' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="HotSpot Object Layout & Project Lilliput" is2D={viewMode === '2d'} />
      <IsoBlock
        cx={180}
        cy={180}
        label="Mark Word"
        sublabel={isLilliput ? 'Header + Compact Klass' : 'Hash + GC Age (4 bits)'}
        topColor="#D9822B"
        badge={isLilliput ? '64-bit Combined' : '64-Bit / 8B'}
        badgeColor="#D9822B"
        isHighlighted={isLayout || isLilliput}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={330}
        cy={180}
        label={isLilliput ? 'Merged Klass' : 'Klass Pointer'}
        sublabel={isLilliput ? 'Embedded in Mark Word' : isCompressedOops ? '32-bit Shift (<=32GB)' : 'InstanceKlass'}
        topColor="#4A90E2"
        badge={isLilliput ? '0 Bytes (Eliminated)' : isCompressedOops ? 'Compressed (4B)' : 'Native (8B)'}
        badgeColor="#4A90E2"
        isHighlighted={isCompressedOops || isLilliput}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={490}
        cy={180}
        label="Fields / Payload"
        sublabel="int id, boolean active"
        topColor="#AB47BC"
        badge="Instance Data"
        badgeColor="#AB47BC"
        isHighlighted={isLayout}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={640}
        cy={180}
        label="Padding"
        sublabel="8-Byte Alignment"
        topColor="#26A69A"
        badge="Zero Waste"
        badgeColor="#26A69A"
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={410}
        cy={320}
        label="TLAB Buffer"
        sublabel="Bump-The-Pointer Alloc"
        topColor="#4E8752"
        badge="Lock-Free Thread Local"
        badgeColor="#4E8752"
        isHighlighted={isTlab}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={610}
        cy={320}
        label="Heap Allocation"
        sublabel="CAS Synchronization"
        topColor="#D14D41"
        badge="Fallback on TLAB Full"
        badgeColor="#D14D41"
        isHighlighted={isTlab}
        is2D={viewMode === '2d'}
      />
      <IsoPath d="M 180 180 L 330 180" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 330 180 L 490 180" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 490 180 L 640 180" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 410 320 L 610 320" color="#26A69A" isPlaying={isPlaying && isTlab} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. Escape Analysis Stage
// -------------------------------------------------------------
function EscapeAnalysisStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isGraph = diagramState === 'escape-graph';
  const isStates = diagramState === 'escape-states';
  const isScalar = diagramState === 'scalar-replacement';

  return (
    <StageContainer
      telemetry={[
        { label: 'ANALYSIS STAGE', value: isGraph ? 'BCE & Call Graph' : isStates ? 'Escape Classification' : 'Scalar Replacement' },
        { label: 'C2 DECISION', value: isScalar ? 'Scalar Replaced (0B Heap)' : 'Heap Allocation Analysis' },
        { label: 'CPU REGISTERS', value: isScalar ? 'RDX=x, RCX=y' : 'Memory References' },
        { label: 'LOCK ELISION', value: isScalar ? 'Lock Stripped (Thread Confined)' : 'Monitor Preserved' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Method Scope', color: '#4A90E2' },
        { label: 'C2 Analyzer', color: '#D9822B' },
        { label: 'Global Escape', color: '#D14D41' },
        { label: 'Scalar Register', color: '#4E8752' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="C2 Escape Analysis & Scalar Replacement" is2D={viewMode === '2d'} />
      <IsoBlock
        cx={170}
        cy={240}
        label="calculateTotal()"
        sublabel="Point p = new Point(10,20)"
        topColor="#4A90E2"
        badge="Method Scope"
        badgeColor="#4A90E2"
        isHighlighted={isGraph}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={350}
        cy={180}
        label="C2 Escape Engine"
        sublabel="BCE & Flow Graph"
        topColor="#D9822B"
        badge={isScalar ? 'NoEscape Confirmed' : 'Analyzing'}
        badgeColor="#D9822B"
        isHighlighted={isGraph || isStates}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={530}
        cy={120}
        label="GlobalEscape"
        sublabel="Escapes Method & Thread"
        topColor="#D14D41"
        badge="Heap Object (Eden)"
        badgeColor="#D14D41"
        isHighlighted={isStates}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={540}
        cy={250}
        label="NoEscape"
        sublabel="Confined to Method"
        topColor="#4E8752"
        badge="Scalar Replaceable"
        badgeColor="#4E8752"
        isHighlighted={isStates || isScalar}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={710}
        cy={250}
        label="Registers RDX, RCX"
        sublabel="Dissolved: int x, int y"
        topColor="#26A69A"
        badge="Zero GC Allocation"
        badgeColor="#26A69A"
        isHighlighted={isScalar}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={540}
        cy={340}
        label="Lock Elision"
        sublabel="synchronized(p) {}"
        topColor="#AB47BC"
        badge="Lock Removed by C2"
        badgeColor="#AB47BC"
        isHighlighted={isScalar}
        is2D={viewMode === '2d'}
      />
      <IsoPath d="M 170 240 L 350 180" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 350 180 L 530 120" color="#D14D41" isPlaying={isPlaying && isStates} />
      <IsoPath d="M 350 180 L 540 250" color="#4E8752" isPlaying={isPlaying && (isScalar || isStates)} />
      <IsoPath d="M 540 250 L 710 250" color="#26A69A" isPlaying={isPlaying && isScalar} />
      <IsoPath d="M 350 180 L 540 340" color="#AB47BC" isPlaying={isPlaying && isScalar} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 01. ZGC vs G1 Low Latency Stage
// -------------------------------------------------------------
function ZgcVsG1Stage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isStw = diagramState === 'stw-barrier';
  const isColored = diagramState === 'colored-pointers';

  return (
    <StageContainer
      telemetry={[
        { label: 'COLLECTOR MODE', value: isColored ? 'Generational ZGC' : 'G1 GC Region Evac' },
        { label: 'MAX STW PAUSE', value: isColored ? '< 1 ms (Sub-Millisecond)' : '50 - 200 ms (STW Barrier)' },
        { label: 'POINTER METADATA', value: isColored ? 'Colored Bits (Marked0/Remapped)' : 'Plain 64-Bit Reference' },
        { label: 'LOAD BARRIER', value: isColored ? 'Self-Healing Pointer (<2ns)' : 'Write Barrier (SATB)' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'G1 STW Barrier', color: '#D9822B' },
        { label: 'ZGC Core', color: '#4A90E2' },
        { label: 'Colored Reference', color: '#4E8752' },
        { label: 'Load Barrier', color: '#26A69A' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="G1 Region Evacuation vs ZGC Colored Pointers" is2D={viewMode === '2d'} />
      <IsoBlock
        cx={180}
        cy={180}
        label="G1 Region [Eden]"
        sublabel="Stop-The-World Evacuation"
        topColor="#D9822B"
        badge="STW 100ms Barrier"
        badgeColor="#D9822B"
        isHighlighted={isStw}
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
        isHighlighted={isStw}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={400}
        cy={200}
        label="ZGC Colored Pointers"
        sublabel="Bits 42-45: Marked0, Remapped"
        topColor="#4A90E2"
        badge="44-Bit Virtual Address"
        badgeColor="#4A90E2"
        isHighlighted={isColored}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={590}
        cy={170}
        label="Concurrent Mark"
        sublabel="No Thread Halting"
        topColor="#4E8752"
        badge="Concurrent Phase"
        badgeColor="#4E8752"
        isHighlighted={isColored}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={600}
        cy={310}
        label="Load Barrier Hook"
        sublabel="Test & Remap on Deref"
        topColor="#26A69A"
        badge="JIT Emitted (<2ns)"
        badgeColor="#26A69A"
        isHighlighted={isColored}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={750}
        cy={230}
        label="Sub-Millisecond STW"
        sublabel="Independent of Heap Size"
        topColor="#4E8752"
        badge="< 1ms Pause"
        badgeColor="#4E8752"
        isHighlighted={isColored}
        is2D={viewMode === '2d'}
      />
      <IsoPath d="M 180 180 L 180 310" color="#D9822B" isPlaying={isPlaying && isStw} />
      <IsoPath d="M 400 200 L 590 170" color="#4A90E2" isPlaying={isPlaying && isColored} />
      <IsoPath d="M 590 170 L 750 230" color="#4E8752" isPlaying={isPlaying && isColored} />
      <IsoPath d="M 400 200 L 600 310" color="#26A69A" isPlaying={isPlaying && isColored} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 03. Virtual Threads Loom Stage
// -------------------------------------------------------------
function VirtualThreadsLoomStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  simulationScenario = 'normal',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
  diagramAlt?: string;
}) {
  const isWall = diagramState === 'thread-wall';
  const isMount = diagramState === 'carrier-mount';
  const isPinning = diagramState === 'thread-pinning' || simulationScenario === 'thread-pin';

  return (
    <StageContainer
      telemetry={[
        { label: 'THREAD MODEL', value: isPinning ? 'Pinned Under Monitor' : isMount ? 'M:N Virtual Threads' : '1:1 OS Thread Wall' },
        { label: 'THREAD COUNT', value: isWall ? '5,000 OS Threads (Cap)' : '1,000,000 Virtual Threads' },
        { label: 'CARRIER POOL', value: isPinning ? 'STARVED (Carrier Pinned)' : 'ForkJoinPool (8 OS Threads)' },
        { label: 'BLOCKING I/O', value: isPinning ? 'OS Thread Blocked!' : isMount ? 'Unmount to Java Heap' : 'OS Context Switch Spike' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Virtual Threads', color: '#4E8752' },
        { label: 'Continuation', color: '#4A90E2' },
        { label: 'Carrier Pool', color: '#26A69A' },
        { label: 'Pinning Danger', color: '#D14D41' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Project Loom: Virtual Threads & ForkJoin Carriers" is2D={viewMode === '2d'} />
      <IsoBlock
        cx={180}
        cy={200}
        label={isWall ? '1:1 OS Threads' : '1,000,000 V-Threads'}
        sublabel={isWall ? '1MB Stack per Thread' : '~few hundred bytes on Heap'}
        topColor={isWall ? '#D9822B' : '#4E8752'}
        badge={isWall ? 'Resource Exhaustion' : 'Lightweight Heap'}
        badgeColor={isWall ? '#D9822B' : '#4E8752'}
        isHighlighted={isWall || isMount}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={360}
        cy={180}
        label="Continuation Scheduler"
        sublabel="yield() on Blocking I/O"
        topColor="#4A90E2"
        badge="Virtual Stack Unmount"
        badgeColor="#4A90E2"
        isHighlighted={isMount}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={540}
        cy={180}
        label="Carrier ForkJoinPool"
        sublabel="8 Dedicated OS Workers"
        topColor={isPinning ? '#D14D41' : '#4A90E2'}
        badge={isPinning ? 'Carrier Starved' : 'Mounted Execution'}
        badgeColor={isPinning ? '#D14D41' : '#4A90E2'}
        isHighlighted={isPinning || isMount}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={720}
        cy={180}
        label="Kernel OS Threads"
        sublabel="CPU Schedular Affinity"
        topColor="#26A69A"
        badge="Zero Context Switches"
        badgeColor="#26A69A"
        isHighlighted={isMount}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={450}
        cy={320}
        label="synchronized(lock)"
        sublabel="Carrier Thread Pinned!"
        topColor="#D14D41"
        badge="Use ReentrantLock"
        badgeColor="#D14D41"
        isHighlighted={isPinning}
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
// 03. False Sharing & Cache Lines
// -------------------------------------------------------------
function FalseSharingJmmStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isPingPong = diagramState === 'cache-line-ping-pong';
  const isContended = diagramState === 'contended-padding';

  return (
    <StageContainer
      telemetry={[
        { label: 'CACHE LINE SIZE', value: '64 Bytes' },
        { label: 'MESI PROTOCOL', value: isContended ? 'Shared (Zero Flushes)' : 'Invalidation Ping-Pong (I)' },
        { label: 'THROUGHPUT IMPACT', value: isContended ? '24,000,000 ops/s' : '1,800,000 ops/s (13x Drop)' },
        { label: 'PADDED ISOLATION', value: isContended ? '@Contended (128B Pad)' : 'Co-located on same line' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Core 0 Writer', color: '#4A90E2' },
        { label: 'Core 1 Writer', color: '#26A69A' },
        { label: 'Contended Line', color: '#D14D41' },
        { label: '@Contended Pad', color: '#4E8752' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="CPU Cache Lines, MESI Coherence & False Sharing" is2D={viewMode === '2d'} />
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
        isHighlighted={isPingPong || isContended}
        is2D={viewMode === '2d'}
      />
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
      <IsoBlock
        cx={320}
        cy={310}
        label="MESI State: Invalid"
        sublabel="Bus SNOOP Invalidate Signal"
        topColor="#D9822B"
        badge="Flush Pipeline"
        badgeColor="#D9822B"
        isHighlighted={isPingPong}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={580}
        cy={310}
        label="@Contended Pad"
        sublabel="JVM inserts 128 empty bytes"
        topColor="#AB47BC"
        badge="Separate Cache Lines"
        badgeColor="#AB47BC"
        isHighlighted={isContended}
        is2D={viewMode === '2d'}
      />
      <IsoPath d="M 180 180 L 450 160" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 720 180 L 450 160" color="#26A69A" isPlaying={isPlaying} />
      <IsoPath d="M 450 160 L 320 310" color="#D9822B" isPlaying={isPlaying && isPingPong} />
      <IsoPath d="M 320 310 L 580 310" color="#AB47BC" isPlaying={isPlaying && isPingPong} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 03. Safepoints & TTSP Latency
// -------------------------------------------------------------
function SafepointsTtspStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isStall = diagramState === 'safepoint-stall';
  const isMining = diagramState === 'loop-strip-mining';

  return (
    <StageContainer
      telemetry={[
        { label: 'JVM OPERATION', value: 'Stop-The-World GC Request' },
        { label: 'TTSP LATENCY', value: isStall ? '4,850 ms (Severe Stall!)' : '1.4 ms (Clean Safepoint)' },
        { label: 'THREAD 1 STATE', value: 'Halted at Safepoint' },
        { label: 'THREAD 2 STATE', value: isStall ? 'Stalled in Uncounted Loop' : 'Loop Strip Mined' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'GC Coordinator', color: '#D14D41' },
        { label: 'Safepoint Page', color: '#4A90E2' },
        { label: 'Halted Thread', color: '#4E8752' },
        { label: 'Strip Mining', color: '#26A69A' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Global Safepoints & Time-to-Safepoint (TTSP) Stalls" is2D={viewMode === '2d'} />
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
      <IsoBlock
        cx={180}
        cy={320}
        label="Worker Thread 1"
        sublabel="Clean Poll Hit"
        topColor="#4E8752"
        badge="Parked Safely"
        badgeColor="#4E8752"
        isHighlighted={true}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={450}
        cy={270}
        label={isStall ? 'Uncounted Int Loop' : 'Strip-Mined Loop'}
        sublabel={isStall ? 'for (int i=0; i<100M; i++)' : 'Outer Loop Polling'}
        topColor={isStall ? '#D9822B' : '#4E8752'}
        badge={isStall ? 'TTSP Latency Spike' : 'Periodic Safepoint Poll'}
        badgeColor={isStall ? '#D9822B' : '#4E8752'}
        isHighlighted={isStall || isMining}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={700}
        cy={250}
        label="Strip Mining C2"
        sublabel="-XX:+UseCountedLoopSafepoints"
        topColor="#26A69A"
        badge="Sub-Millisecond TTSP"
        badgeColor="#26A69A"
        isHighlighted={isMining}
        is2D={viewMode === '2d'}
      />
      <IsoPath d="M 450 120 L 240 200" color="#D14D41" isPlaying={isPlaying} />
      <IsoPath d="M 240 200 L 180 320" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 240 200 L 450 270" color={isStall ? '#D9822B' : '#4E8752'} isPlaying={isPlaying} />
      <IsoPath d="M 450 270 L 700 250" color="#26A69A" isPlaying={isPlaying && isMining} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 07. Off-Heap Memory & Modern FFM Arena
// -------------------------------------------------------------
function OffHeapFfmStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isOffHeap = diagramState === 'offheap-vs-heap';
  const isArena = diagramState === 'ffm-arena-lifecycle';
  const isNmt = diagramState === 'nmt-inspection';

  return (
    <StageContainer
      telemetry={[
        { label: 'HEAP LIMIT', value: '-Xmx2g (Java GC)' },
        { label: 'OFF-HEAP MEMORY', value: isArena ? '80MB (Deterministic Arena)' : '1,696MB (Direct Memory)' },
        { label: 'CONTAINER RSS', value: isArena ? '2.4GB / 4GB (Safe)' : isOffHeap ? '3.98GB (Kubernetes OOMKill!)' : '2.8GB Normal' },
        { label: 'LIFECYCLE', value: isArena ? 'Arena.ofConfined() Auto-Close' : isNmt ? 'NMT Native Tracking' : 'Nondeterministic Cleaner' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Java Heap', color: '#AB47BC' },
        { label: 'Direct ByteBuffer', color: '#D9822B' },
        { label: 'Linux Native RSS', color: '#4E8752' },
        { label: 'FFM Arena / NMT', color: '#4A90E2' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={660} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Off-Heap Native Memory & Modern FFM Arena" is2D={viewMode === '2d'} />
      <IsoBlock
        cx={180}
        cy={180}
        label="Java Heap (-Xmx2g)"
        sublabel="Eden, Survivor, Tenured"
        topColor="#AB47BC"
        badge="GC Managed"
        badgeColor="#AB47BC"
        isHighlighted={isOffHeap}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={340}
        cy={180}
        label="DirectByteBuffer"
        sublabel="sun.misc.Unsafe malloc"
        topColor="#D9822B"
        badge="Nondeterministic Cleaner"
        badgeColor="#D9822B"
        isHighlighted={isOffHeap}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={520}
        cy={180}
        label="Linux RSS Memory"
        sublabel="C-Heap + Glibc malloc"
        topColor="#4E8752"
        badge="Process Footprint"
        badgeColor="#4E8752"
        isHighlighted={isOffHeap}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={710}
        cy={180}
        label="K8s Pod Limits"
        sublabel="resources.limits.memory"
        topColor="#D14D41"
        badge="OOMKilled Event (137)"
        badgeColor="#D14D41"
        isHighlighted={isOffHeap}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={430}
        cy={320}
        label="NMT Inspection"
        sublabel="-XX:NativeMemoryTracking"
        topColor="#26A69A"
        badge="Arena/Thread/GC Metric"
        badgeColor="#26A69A"
        isHighlighted={isNmt}
        is2D={viewMode === '2d'}
      />
      <IsoBlock
        cx={620}
        cy={320}
        label="FFM Arena API"
        sublabel="Arena.ofConfined().allocate()"
        topColor="#4A90E2"
        badge="Deterministic Free"
        badgeColor="#4A90E2"
        isHighlighted={isArena}
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
// 02. Streams Pipeline Architecture Stage
// -------------------------------------------------------------
function StreamsPipelineStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isPipeline = diagramState === 'stream-pipeline';
  const isShortCircuit = diagramState === 'lazy-short-circuit';
  const isMapFlatMap = diagramState === 'map-flatmap';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'EVALUATION MODE', value: isShortCircuit ? 'Short-Circuiting' : 'Lazy Evaluation' },
        { label: 'PIPELINE FUSION', value: 'Single-Pass Loop' },
        { label: 'OPERATION TYPE', value: isMapFlatMap ? 'map() / flatMap()' : isShortCircuit ? 'filter() / limit(n)' : isRecap ? 'groupingBy() Terminal' : 'Intermediate Fusion' },
        { label: 'EXECUTION STATE', value: isRecap ? 'END-TO-END VERIFIED' : isPipeline ? 'Pipeline Ready' : 'Processing' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Stream Source', color: '#4A90E2' },
        { label: 'Filter (Predicate)', color: '#D9822B' },
        { label: 'Transform (Function)', color: '#AB47BC' },
        { label: 'Collector Terminal', color: '#4E8752' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Java Stream Pipeline Architecture" is2D={viewMode === '2d'} />
      <IsoBlock cx={170} cy={260} label="List<Policy>" sublabel="Stream Source" topColor="#4A90E2" badge="Source" isHighlighted={isPipeline || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={200} label="filter(p.active)" sublabel="Intermediate Op" topColor="#D9822B" badge="Lazy Sink" isHighlighted={isPipeline || isShortCircuit || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={170} label="map(p.premium)" sublabel="Intermediate Op" topColor="#AB47BC" badge="Lazy 1-to-1" isHighlighted={isMapFlatMap || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={680} cy={220} label="collect(groupingBy())" sublabel="Terminal Op" topColor="#4E8752" badge="Execution Trigger" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={560} cy={330} label="Processed DTOs" sublabel="Result Collection" topColor="#26A69A" badge="Immutable Output" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 260 L 340 200" color="#4A90E2" isPlaying={isPlaying && (isPipeline || isShortCircuit || isMapFlatMap || isRecap)} />
      <IsoPath d="M 340 200 L 510 170" color="#D9822B" isPlaying={isPlaying && (isPipeline || isMapFlatMap || isRecap)} />
      <IsoPath d="M 510 170 L 680 220" color="#AB47BC" isPlaying={isPlaying && (isPipeline || isRecap)} />
      <IsoPath d="M 680 220 L 560 330" color="#4E8752" isPlaying={isPlaying && isRecap} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// 02. Lambdas & Functional Interfaces Stage
// -------------------------------------------------------------
function LambdasFunctionalStage({
  diagramState,
  isPlaying,
  viewMode = '3d',
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isDesugar = diagramState === 'lambda-desugaring';
  const isInterfaces = diagramState === 'functional-interfaces';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'BYTECODE MECHANISM', value: isDesugar ? 'invokedynamic (indy)' : 'LambdaMetafactory' },
        { label: 'SAM INTERFACES', value: isInterfaces ? 'Predicate, Function, Consumer' : 'Single Abstract Method' },
        { label: 'NULL SAFETY', value: isRecap ? 'Optional<T> Monad' : 'Defensive Checks' },
        { label: 'ALLOCATION OVERHEAD', value: isRecap ? 'ZERO ANONYMOUS CLASSES' : 'Singleton CallSite' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Lambda Syntax', color: '#4A90E2' },
        { label: 'invokedynamic', color: '#D9822B' },
        { label: 'SAM Interface', color: '#AB47BC' },
        { label: 'Optional Chain', color: '#4E8752' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Lambdas & Functional Interfaces Topology" is2D={viewMode === '2d'} />
      <IsoBlock cx={170} cy={260} label="p -> p.isValid()" sublabel="Lambda Expression" topColor="#4A90E2" badge="Concise Syntax" isHighlighted={isDesugar || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={200} label="invokedynamic" sublabel="Bootstrap Method" topColor="#D9822B" badge="Indy Instruction" isHighlighted={isDesugar || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={170} label="FunctionalInterface" sublabel="Predicate<Policy>" topColor="#AB47BC" badge="@FunctionalInterface" isHighlighted={isInterfaces || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={680} cy={220} label="Optional<T>" sublabel="map() / flatMap() / orElse()" topColor="#4E8752" badge="Null-Safe Monad" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={560} cy={330} label="Native CallSite" sublabel="Zero Inner Class Overhead" topColor="#26A69A" badge="Direct Invocation" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 260 L 340 200" color="#4A90E2" isPlaying={isPlaying && (isDesugar || isRecap)} />
      <IsoPath d="M 340 200 L 510 170" color="#D9822B" isPlaying={isPlaying && (isDesugar || isInterfaces || isRecap)} />
      <IsoPath d="M 510 170 L 680 220" color="#AB47BC" isPlaying={isPlaying && isRecap} />
      <IsoPath d="M 680 220 L 560 330" color="#4E8752" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isSafety = diagramState === 'compile-type-safety';
  const isPecs = diagramState === 'pecs-wildcards';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'SOURCE CODE', value: isSafety ? 'List<String> (Parametric)' : 'Generic Parameters' },
        { label: 'PECS PRINCIPLE', value: isPecs ? 'Producer Extends, Consumer Super' : 'Invariant Types' },
        { label: 'BYTECODE OUTPUT', value: isRecap ? 'List (Erased to Object)' : 'Compiler Verification' },
        { label: 'TYPE SAFETY', value: isRecap ? 'STATICALLY VERIFIED (No Heap Pollution)' : 'checkcast Emitted' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Parametric Code', color: '#4A90E2' },
        { label: 'javac Compiler', color: '#D9822B' },
        { label: 'PECS Wildcards', color: '#4E8752' },
        { label: 'Bridge / Erasure', color: '#AB47BC' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Generics Type Erasure Pipeline" is2D={viewMode === '2d'} />
      <IsoBlock cx={180} cy={260} label="Source Code" sublabel="List<String> type" topColor="#4A90E2" badge="Compile-Time Type" isHighlighted={isSafety || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={360} cy={210} label="javac Compiler" sublabel="Type Safety & Invariance" topColor="#D9822B" badge="Compile Validation" isHighlighted={isSafety || isPecs || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={540} cy={190} label="PECS Wildcards" sublabel="? extends / ? super" topColor="#4E8752" badge="Variance Bounds" isHighlighted={isPecs || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={250} label="Erased Bytecode" sublabel="List (Object) + checkcast" topColor="#AB47BC" badge="Runtime Erasure" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 180 260 L 360 210" color="#4A90E2" isPlaying={isPlaying && (isSafety || isRecap)} />
      <IsoPath d="M 360 210 L 540 190" color="#D9822B" isPlaying={isPlaying && (isPecs || isRecap)} />
      <IsoPath d="M 540 190 L 720 250" color="#4E8752" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isAnatomy = diagramState === 'thread-pool-anatomy';
  const isPolicy = diagramState === 'queue-rejection-policy';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'ACTIVE THREADS', value: isRecap ? '4 Core / 16 Max' : isAnatomy ? '4 Core Active' : 'Pool Saturated' },
        { label: 'WORK QUEUE', value: isPolicy ? 'BlockingQueue FULL' : 'ArrayBlockingQueue (128)' },
        { label: 'REJECT POLICY', value: isPolicy ? 'CallerRunsPolicy Backpressure' : 'AbortPolicy' },
        { label: 'VIRTUAL EXECUTOR', value: isRecap ? 'newVirtualThreadPerTaskExecutor()' : 'Fixed Worker Pool' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Tasks Submitter', color: '#4A90E2' },
        { label: 'Core Pool', color: '#4E8752' },
        { label: 'BlockingQueue', color: '#D9822B' },
        { label: 'Max Pool / Reject', color: '#D14D41' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="ThreadPoolExecutor Architecture" is2D={viewMode === '2d'} />
      <IsoBlock cx={170} cy={270} label="Incoming Tasks" sublabel="executor.submit()" topColor="#4A90E2" badge="Runnable / Callable" isHighlighted={isAnatomy || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={190} label="Core Pool (4)" sublabel="Always Active Workers" topColor="#4E8752" badge="Core Workers" isHighlighted={isAnatomy || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={500} cy={230} label="BlockingQueue" sublabel="Task Buffer Capacity" topColor="#D9822B" badge="FIFO Queue" isHighlighted={isAnatomy || isPolicy || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={670} cy={180} label="Max Pool (16)" sublabel="Burst Capacity" topColor="#AB47BC" badge="On Queue Full" isHighlighted={isPolicy || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={670} cy={320} label="Reject Handler" sublabel="CallerRunsPolicy" topColor="#D14D41" badge="Backpressure" isHighlighted={isPolicy} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 270 L 330 190" color="#4A90E2" isPlaying={isPlaying && (isAnatomy || isRecap)} />
      <IsoPath d="M 330 190 L 500 230" color="#4E8752" isPlaying={isPlaying && (isAnatomy || isRecap)} />
      <IsoPath d="M 500 230 L 670 180" color="#D9822B" isPlaying={isPlaying && (isPolicy || isRecap)} />
      <IsoPath d="M 500 230 L 670 320" color="#D14D41" isPlaying={isPlaying && isPolicy} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isIoc = diagramState === 'ioc-container';
  const isConstructor = diagramState === 'constructor-injection';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'IOC CONTAINER', value: 'ApplicationContext' },
        { label: 'INJECTION MODEL', value: isConstructor ? 'Constructor (Immutable)' : 'Component Scanner' },
        { label: 'CIRCULAR DEPS', value: isConstructor ? 'Fails Early at Startup' : 'Runtime Detection' },
        { label: 'LIFECYCLE STATUS', value: isRecap ? 'COMPLETE: Singleton Ready' : '@PostConstruct Callback' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Component Scan', color: '#4A90E2' },
        { label: 'Constructor DI', color: '#D9822B' },
        { label: 'Lifecycle Hook', color: '#4E8752' },
        { label: 'Singleton Cache', color: '#26A69A' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Spring IoC Bean Lifecycle" is2D={viewMode === '2d'} />
      <IsoBlock cx={170} cy={260} label="@Component Scan" sublabel="Bean Definition Registry" topColor="#4A90E2" badge="Class Scanner" isHighlighted={isIoc || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={190} label="Instantiation" sublabel="Constructor Invocation" topColor="#D9822B" badge="Instance Created" isHighlighted={isConstructor || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={170} label="Constructor DI" sublabel="final fields wired" topColor="#4E8752" badge="Immutable Wiring" isHighlighted={isConstructor || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={680} cy={220} label="@PostConstruct" sublabel="BeanPostProcessor Init" topColor="#AB47BC" badge="Ready Callback" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={560} cy={330} label="Singleton Cache" sublabel="Default Bean Registry" topColor="#26A69A" badge="Managed Bean" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 260 L 340 190" color="#4A90E2" isPlaying={isPlaying && (isIoc || isRecap)} />
      <IsoPath d="M 340 190 L 510 170" color="#D9822B" isPlaying={isPlaying && (isConstructor || isRecap)} />
      <IsoPath d="M 510 170 L 680 220" color="#4E8752" isPlaying={isPlaying && isRecap} />
      <IsoPath d="M 680 220 L 560 330" color="#AB47BC" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isCascade = diagramState === 'cascading-failure';
  const isBreaker = diagramState === 'circuit-breaker';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'CIRCUIT BREAKER', value: isBreaker ? 'OPEN (Tripped)' : isCascade ? 'Thread Starvation' : 'CLOSED (Normal)' },
        { label: 'FAILURE RATE', value: isBreaker ? '68% (> 50% Threshold)' : isCascade ? 'Spike to 100%' : '0.2% Normal' },
        { label: 'GATEWAY STATUS', value: isRecap ? 'Centralized Ingress 200 OK' : 'Routing Traffic' },
        { label: 'RESILIENCE TOPOLOGY', value: isRecap ? 'END-TO-END RESILIENT' : 'Resilience4j State Machine' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Consumer Client', color: '#4A90E2' },
        { label: 'API Gateway', color: '#D9822B' },
        { label: 'Circuit Breaker', color: '#4E8752' },
        { label: 'Fallback Store', color: '#D14D41' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Resilience4j Circuit Breaker Architecture" is2D={viewMode === '2d'} />
      <IsoLaptop cx={160} cy={270} label="Client" sublabel="GET /orders" is2D={viewMode === '2d'} />
      <IsoBlock cx={320} cy={210} label="API Gateway" sublabel="Routing & Rate Limiting" topColor="#4A90E2" badge="Ingress" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={500} cy={170} label="Circuit Breaker" sublabel={isBreaker ? 'State: OPEN' : 'State: CLOSED'} topColor={isBreaker ? '#D14D41' : '#4E8752'} badge="Resilience4j" isHighlighted={isBreaker || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={690} cy={190} label="Downstream API" sublabel={isCascade ? 'Latency 5,000ms' : 'Payment Service'} topColor={isCascade ? '#D14D41' : '#26A69A'} badge={isCascade ? 'Failure' : '200 OK'} isHighlighted={isCascade} is2D={viewMode === '2d'} />
      <IsoDatabase cx={680} cy={330} rx={30} ry={15} h={36} color="#D14D41" label="Fallback Store" sublabel="Cached DTO" badge="On Failure" isHighlighted={isBreaker} is2D={viewMode === '2d'} />
      <IsoPath d="M 160 270 L 320 210" color="#4A90E2" isPlaying={isPlaying} />
      <IsoPath d="M 320 210 L 500 170" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 500 170 L 690 190" color="#26A69A" isPlaying={isPlaying && !isBreaker} />
      <IsoPath d="M 500 170 L 680 330" color="#D14D41" isPlaying={isPlaying && isBreaker} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isUri = diagramState === 'resource-uri';
  const isMethods = diagramState === 'http-methods';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'RESOURCE URI', value: isUri ? '/api/v1/policies/{id}' : 'REST Resource Spec' },
        { label: 'HTTP METHODS', value: isMethods ? 'GET/PUT/DELETE Idempotent' : 'HTTP/1.1 & HTTP/2' },
        { label: 'STATUS CODES', value: isRecap ? '200 OK, 201 Created, 400 Bad' : 'Standard RFC 9110' },
        { label: 'CONTRACT FORMAT', value: isRecap ? 'OPENAPI 3.0 VERIFIED' : 'JSON Schema Spec' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'HTTP Consumer', color: '#4A90E2' },
        { label: 'URI Routing', color: '#D9822B' },
        { label: 'Idempotency', color: '#4E8752' },
        { label: 'Status Dispatch', color: '#AB47BC' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="REST API Resource Design & Contracts" is2D={viewMode === '2d'} />
      <IsoLaptop cx={160} cy={270} label="Consumer" sublabel="GET /api/v1/policies/123" is2D={viewMode === '2d'} />
      <IsoBlock cx={320} cy={220} label="Resource URI" sublabel="/api/v1/policies" topColor="#4A90E2" badge="Plural Noun" isHighlighted={isUri || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={180} label="Method Safety" sublabel="GET/PUT Idempotent" topColor="#4E8752" badge="RFC 9110 Safe" isHighlighted={isMethods || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={690} cy={220} label="Status Codes" sublabel="200, 201, 400, 404, 500" topColor="#AB47BC" badge="Status Precision" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 160 270 L 320 220" color="#4A90E2" isPlaying={isPlaying && (isUri || isRecap)} />
      <IsoPath d="M 320 220 L 510 180" color="#4E8752" isPlaying={isPlaying && (isMethods || isRecap)} />
      <IsoPath d="M 510 180 L 690 220" color="#AB47BC" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isRelational = diagramState === 'relational-vs-document';
  const isEmbed = diagramState === 'embed-vs-reference';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'DATA MODEL', value: isRelational ? 'BSON vs Normalized Relational' : 'Document Model' },
        { label: 'SCHEMA DESIGN', value: isEmbed ? 'Embedded Document vs DBRef' : 'Polymorphic Schema' },
        { label: 'ATOMICITY', value: isRecap ? 'Single-Document Atomic ACID' : 'Document Level' },
        { label: 'STORAGE INVARIANT', value: isRecap ? 'WIREDTIGER CACHE OPTIMIZED' : 'WiredTiger B-Tree' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Java POJO', color: '#4A90E2' },
        { label: 'MongoTemplate', color: '#4E8752' },
        { label: 'B-Tree Index', color: '#D9822B' },
        { label: 'MongoDB Cluster', color: '#26A69A' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="MongoDB Document & Persistence Architecture" is2D={viewMode === '2d'} />
      <IsoBlock cx={170} cy={270} label="@Document Policy" sublabel="Normalized vs BSON" topColor="#4A90E2" badge="Java Entity" isHighlighted={isRelational || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={200} label="Embed vs Reference" sublabel="1:1 Embed | 1:N Ref" topColor="#4E8752" badge="Schema Design" isHighlighted={isEmbed || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={510} cy={170} label="MongoTemplate" sublabel="Atomic $set / Queries" topColor="#D9822B" badge="Atomic Operations" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoDatabase cx={700} cy={240} rx={34} ry={17} h={42} color="#26A69A" label="MongoDB Cluster" sublabel="WiredTiger BSON" badge="WiredTiger" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 270 L 340 200" color="#4A90E2" isPlaying={isPlaying && (isRelational || isRecap)} />
      <IsoPath d="M 340 200 L 510 170" color="#4E8752" isPlaying={isPlaying && (isEmbed || isRecap)} />
      <IsoPath d="M 510 170 L 700 240" color="#26A69A" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isCommit = diagramState === 'git-commit';
  const isMaven = diagramState === 'maven-build';
  const isSonar = diagramState === 'sonar-scan';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'TRIGGER EVENT', value: isCommit ? 'git push origin main' : 'Webhook Triggered' },
        { label: 'BUILD ARTIFACT', value: isMaven ? 'Maven 3.9 clean verify (JAR)' : 'Artifact Ready' },
        { label: 'SECURITY SCAN', value: isSonar ? 'SonarQube Quality Gate PASSED' : 'SAST Check' },
        { label: 'RELEASE INVARIANT', value: isRecap ? 'CANARY / ZERO-DOWNTIME LIVE' : 'Docker -> K8s Pod' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Git Trigger', color: '#4A90E2' },
        { label: 'Maven Build', color: '#D9822B' },
        { label: 'Sonar Quality Gate', color: '#4E8752' },
        { label: 'Production K8s', color: '#26A69A' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Continuous Integration & Delivery Pipeline" is2D={viewMode === '2d'} />
      <IsoBlock cx={160} cy={270} label="Git Push" sublabel="Webhook Trigger" topColor="#4A90E2" badge="Commit Trigger" isHighlighted={isCommit || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={310} cy={200} label="Maven Build" sublabel="mvn clean verify" topColor="#D9822B" badge="JDK 21 Packaging" isHighlighted={isMaven || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={480} cy={160} label="SonarQube" sublabel="Quality Gate & SAST" topColor="#4E8752" badge="Zero Vulnerabilities" isHighlighted={isSonar || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={640} cy={180} label="Docker OCI" sublabel="Multi-Stage Image" topColor="#AB47BC" badge="Distroless Image" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={750} cy={280} label="Kubernetes" sublabel="Canary Deployment" topColor="#26A69A" badge="Production Live" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 160 270 L 310 200" color="#4A90E2" isPlaying={isPlaying && (isCommit || isRecap)} />
      <IsoPath d="M 310 200 L 480 160" color="#D9822B" isPlaying={isPlaying && (isMaven || isRecap)} />
      <IsoPath d="M 480 160 L 640 180" color="#4E8752" isPlaying={isPlaying && (isSonar || isRecap)} />
      <IsoPath d="M 640 180 L 750 280" color="#26A69A" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isPillars = diagramState === 'observability-pillars';
  const isLogs = diagramState === 'log-analysis';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'OBSERVABILITY PILLARS', value: isPillars ? 'Metrics, Logs, Traces' : 'OpenTelemetry Stack' },
        { label: 'LOG ANALYSIS', value: isLogs ? 'Splunk / ELK Structured Query' : 'MDC Correlation' },
        { label: 'TRACING STATUS', value: isRecap ? 'Distributed Trace Correlated' : 'TraceContext Propagated' },
        { label: 'RCA METHODOLOGY', value: isRecap ? 'ROOT CAUSE ISOLATED' : 'Health Metrics Normal' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'App Instrument', color: '#4E8752' },
        { label: 'Metrics TimeSeries', color: '#D9822B' },
        { label: 'Dashboards', color: '#4A90E2' },
        { label: 'Log Analysis RCA', color: '#26A69A' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Full-Stack Observability & Telemetry" is2D={viewMode === '2d'} />
      <IsoBlock cx={170} cy={270} label="Java App" sublabel="Micrometer Exporter" topColor="#4E8752" badge="JVM Instrumentation" isHighlighted={isPillars || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={340} cy={180} label="Prometheus" sublabel="Scraped Metrics" topColor="#D9822B" badge="Metrics Scraper" isHighlighted={isPillars || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={520} cy={150} label="Grafana" sublabel="JVM Dashboard" topColor="#4A90E2" badge="Latency / Heap" isHighlighted={isPillars || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={520} cy={310} label="Logback Logger" sublabel="MDC Correlation ID" topColor="#AB47BC" badge="Structured JSON" isHighlighted={isLogs || isRecap} is2D={viewMode === '2d'} />
      <IsoDatabase cx={710} cy={270} rx={34} ry={17} h={40} color="#26A69A" label="Splunk / ELK" sublabel="Log Aggregation" badge="Search & RCA" isHighlighted={isLogs || isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 270 L 340 180" color="#D9822B" isPlaying={isPlaying && (isPillars || isRecap)} />
      <IsoPath d="M 340 180 L 520 150" color="#4A90E2" isPlaying={isPlaying && (isPillars || isRecap)} />
      <IsoPath d="M 170 270 L 520 310" color="#AB47BC" isPlaying={isPlaying && (isLogs || isRecap)} />
      <IsoPath d="M 520 310 L 710 270" color="#26A69A" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isEncapsulation = diagramState === 'encapsulation';
  const isInheritance = diagramState === 'inheritance';
  const isPolymorphism = diagramState === 'polymorphism';
  const isAbstraction = diagramState === 'abstraction';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'DYNAMIC DISPATCH', value: isPolymorphism ? 'JVM vtable Dynamic Method Dispatch' : 'Method Resolution' },
        { label: 'OOP PILLAR', value: isEncapsulation ? 'Encapsulation (Private State)' : isInheritance ? 'Inheritance (LSP Subtype)' : isPolymorphism ? 'Polymorphism (Dynamic Dispatch)' : isAbstraction ? 'Abstraction (Contract)' : 'COMPOSITE OOP ARCHITECTURE' },
        { label: 'COUPLING', value: isAbstraction ? 'Loose Interface Coupling' : 'High Cohesion' },
        { label: 'BLUEPRINT INVARIANT', value: isRecap ? 'ALL 4 PILLARS HARMONIZED' : 'Liskov Substitution Verified' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Abstraction', color: '#4A90E2' },
        { label: 'Inheritance', color: '#D9822B' },
        { label: 'Polymorphism (vtable)', color: '#4E8752' },
        { label: 'Encapsulation', color: '#AB47BC' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="OOP Pillars & JVM Dynamic Dispatch" is2D={viewMode === '2d'} />
      <IsoBlock cx={180} cy={250} label="Interface Contract" sublabel="PaymentGateway" topColor="#4A90E2" badge="Abstraction" isHighlighted={isAbstraction || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={360} cy={190} label="Class Hierarchy" sublabel="StripeGateway implements" topColor="#D9822B" badge="Inheritance" isHighlighted={isInheritance || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={540} cy={170} label="JVM vtable" sublabel="Dynamic Method Dispatch" topColor="#4E8752" badge="Polymorphism" isHighlighted={isPolymorphism || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={240} label="Private State" sublabel="apiKey, balance invariants" topColor="#AB47BC" badge="Encapsulation" isHighlighted={isEncapsulation || isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 180 250 L 360 190" color="#4A90E2" isPlaying={isPlaying && (isAbstraction || isInheritance || isRecap)} />
      <IsoPath d="M 360 190 L 540 170" color="#4E8752" isPlaying={isPlaying && (isPolymorphism || isRecap)} />
      <IsoPath d="M 540 170 L 720 240" color="#AB47BC" isPlaying={isPlaying && (isEncapsulation || isRecap)} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
  diagramAlt?: string;
}) {
  const isPrimitives = diagramState === 'primitives-stack';
  const isStringPool = diagramState === 'string-pool-heap';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'PRIMITIVE VALUES', value: isPrimitives ? 'Direct Stack Storage (4B/8B)' : 'Stack Allocations' },
        { label: 'OBJECT REFERENCES', value: isStringPool ? 'String Pool Address Pointer' : 'Compressed OOP Reference' },
        { label: 'STRING POOL', value: isStringPool ? 'Interned in Heap String Pool' : 'JVM Heap Area' },
        { label: 'MEMORY INVARIANT', value: isRecap ? 'STACK VS HEAP BALANCED' : 'Direct Stack Speed' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Thread Stack', color: '#4E8752' },
        { label: 'Object Reference', color: '#4A90E2' },
        { label: 'String Pool', color: '#AB47BC' },
        { label: 'Heap Object', color: '#D9822B' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Java Data Types & Stack vs Heap" is2D={viewMode === '2d'} />
      <IsoBlock cx={180} cy={260} label="Thread Stack" sublabel="int age = 42 (4B)" topColor="#4E8752" badge="Stack Direct Value" isHighlighted={isPrimitives || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={360} cy={190} label="Object Reference" sublabel="String name -> pointer" topColor="#4A90E2" badge="Reference (8B)" isHighlighted={isStringPool || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={550} cy={160} label="String Constant Pool" sublabel='"Alice" (Interned)' topColor="#AB47BC" badge="Heap String Pool" isHighlighted={isStringPool || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={240} label="Heap Object" sublabel="new Customer() (24B+)" topColor="#D9822B" badge="Live Heap Object" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 180 260 L 360 190" color="#4A90E2" isPlaying={isPlaying && (isStringPool || isRecap)} />
      <IsoPath d="M 360 190 L 550 160" color="#AB47BC" isPlaying={isPlaying && (isStringPool || isRecap)} />
      <IsoPath d="M 360 190 L 720 240" color="#D9822B" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
  diagramAlt?: string;
}) {
  const isThrowable = diagramState === 'throwable-hierarchy';
  const isCleanup = diagramState === 'try-with-resources-cleanup';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'CALL STACK', value: isThrowable ? 'Throwable Hierarchy' : 'Frame #3 -> Frame #2' },
        { label: 'CLEANUP PATH', value: isCleanup ? 'try-with-resources (AutoCloseable)' : 'Exception Handling' },
        { label: 'EXCEPTION CLASS', value: isRecap ? 'Enterprise Custom Exception' : isThrowable ? 'Checked vs Unchecked' : 'AutoCloseable' },
        { label: 'FAULT TOLERANCE', value: isRecap ? 'RESILIENT ERROR PIPELINE' : 'Suppressed Clean' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Caller Frame', color: '#4A90E2' },
        { label: 'Service Frame', color: '#D9822B' },
        { label: 'Throwable', color: '#D14D41' },
        { label: 'Safe Cleanup', color: '#4E8752' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Exception Handling & Stack Unwinding" is2D={viewMode === '2d'} />
      <IsoBlock cx={180} cy={280} label="Caller Method" sublabel="try { service.call() }" topColor="#4A90E2" badge="Stack Frame #1" isHighlighted={isThrowable || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={360} cy={210} label="Service Layer" sublabel="throw new BusinessException" topColor="#D9822B" badge="Stack Frame #2" isHighlighted={isThrowable || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={540} cy={170} label="Throwable Hierarchy" sublabel="Checked vs RuntimeException" topColor="#D14D41" badge="Unwinding Event" isHighlighted={isThrowable || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={710} cy={250} label="try-with-resources" sublabel="AutoCloseable.close()" topColor="#4E8752" badge="Safe Recovery" isHighlighted={isCleanup || isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 180 280 L 360 210" color="#4A90E2" isPlaying={isPlaying && (isThrowable || isRecap)} />
      <IsoPath d="M 360 210 L 540 170" color="#D14D41" isPlaying={isPlaying && (isThrowable || isRecap)} />
      <IsoPath d="M 540 170 L 710 250" color="#4E8752" isPlaying={isPlaying && (isCleanup || isRecap)} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
  diagramAlt?: string;
}) {
  const isWrite = diagramState === 'write-code';
  const isCompile = diagramState === 'compile-bytecode';
  const isClassLoader = diagramState === 'classloader-load';
  const isVerify = diagramState === 'verify-execute';
  const isJit = diagramState === 'jit-compile' || simulationScenario === 'hot-calls';
  const isMemory = diagramState === 'memory-stack-heap';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'EXECUTION MODE', value: (isJit || isRecap) ? 'Tiered JIT (HotSpot Level 4 C2)' : (isClassLoader || isVerify) ? 'ClassLoader Linking' : isCompile ? 'javac Compiler' : 'Level 0 Interpreter' },
        { label: 'CLASS VERIFICATION', value: (isClassLoader || isVerify) ? 'Type & Stack Discipline OK' : 'Magic 0xCAFEBABE Verified' },
        { label: 'INVOCATION COUNTER', value: (isJit || isRecap) ? '10,000+ (C2 Threshold Hit)' : '342 Calls (Profiling)' },
        { label: 'CODE CACHE', value: (isJit || isRecap) ? '48 MB / 240 MB Reserved' : '2.4 MB / 240 MB Reserved' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Source File', color: '#D9822B' },
        { label: 'JVM Engine', color: '#4E8752' },
        { label: 'Stack Memory', color: '#4A90E2' },
        { label: 'Heap Memory', color: '#AB47BC' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="JVM Runtime Environment" is2D={viewMode === '2d'} />
      <IsoLaptop cx={180} cy={280} label="Developer" sublabel="PaymentService.java" is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={240} label="javac Compiler" sublabel="Bytecode Parser" topColor="#D9822B" leftColor="#B36B22" rightColor="#8F5419" badge="AST Parsing" badgeColor="#D9822B" isHighlighted={isWrite || isCompile || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={520} cy={210} w={100} d={56} h={40} label="JVM Engine" sublabel={isVerify ? 'Verify & Link' : isClassLoader ? 'ClassLoader' : 'HotSpot C1 / C2'} topColor="#4E8752" leftColor="#3C6B3F" rightColor="#2B4F2E" badge={(isJit || isRecap) ? 'Compiled JIT' : 'Interpreting'} badgeColor="#4E8752" isHighlighted={isClassLoader || isVerify || isJit || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={420} cy={120} w={76} d={44} label="Thread Stack" sublabel="Frames & Vars" topColor="#4A90E2" leftColor="#3874B8" rightColor="#26578E" badge="StackFrame #1" badgeColor="#4A90E2" isHighlighted={isMemory || isRecap || simulationScenario === 'recursion'} is2D={viewMode === '2d'} />
      <IsoBlock cx={590} cy={120} w={86} d={48} label="Heap Memory" sublabel="Eden & Old Gen" topColor="#AB47BC" leftColor="#893796" rightColor="#682773" badge="Live Objects" badgeColor="#AB47BC" isHighlighted={isMemory || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={280} label="Host CPU / OS" sublabel="Native Assembly" topColor="#D14D41" leftColor="#A83C32" rightColor="#822C24" badge="x86-64 / ARM" badgeColor="#D14D41" isHighlighted={isJit || isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 180 280 L 330 240" color="#D9822B" isPlaying={isPlaying && (isWrite || isCompile || isRecap)} />
      <IsoPath d="M 330 240 L 520 210" color="#4E8752" isPlaying={isPlaying && (isClassLoader || isVerify || isJit || isRecap)} />
      <IsoPath d="M 520 180 L 420 140" color="#4A90E2" isPlaying={isPlaying && (isMemory || isRecap)} />
      <IsoPath d="M 520 180 L 590 140" color="#AB47BC" isPlaying={isPlaying && (isMemory || isRecap)} />
      <IsoPath d="M 520 230 L 720 280" color="#D14D41" isPlaying={isPlaying && (isJit || isRecap)} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  simulationScenario?: string;
  diagramAlt?: string;
}) {
  const isNew = diagramState === 'new-thread';
  const isBlocked = diagramState === 'blocked-state';
  const isRunning = diagramState === 'running-state';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'ACTIVE THREADS', value: isRecap ? 'ALL THREADS HARMONIZED' : '48 / 200' },
        { label: 'CURRENT STATE', value: isBlocked ? 'BLOCKED (Monitor)' : isNew ? 'NEW (Initialized)' : 'RUNNABLE / RUNNING' },
        { label: 'CONTEXT SWITCHES', value: isRecap ? 'Zero Contention' : '1,200 / s' },
        { label: 'LOCK CONTENTION', value: isBlocked ? 'HIGH (Monitor Contention)' : '0.1%' },
      ]}
      viewMode={viewMode}
      simulationScenario={simulationScenario as any}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'New State', color: '#7E57C2' },
        { label: 'Runnable', color: '#4A90E2' },
        { label: 'Running Active', color: '#4E8752' },
        { label: 'Blocked Lock', color: '#D9822B' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Thread Lifecycle State Machine" is2D={viewMode === '2d'} />
      <IsoBlock cx={180} cy={270} label="NEW" sublabel="new Thread()" topColor="#7E57C2" leftColor="#5E4094" rightColor="#442D6B" badge="Thread.init()" isHighlighted={isNew || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={320} cy={180} label="RUNNABLE" sublabel="In OS Scheduler" topColor="#4A90E2" leftColor="#3468A3" rightColor="#224773" badge="Ready Queue" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={480} cy={150} label="RUNNING" sublabel="Core #4 Active" topColor="#4E8752" leftColor="#39633C" rightColor="#264528" badge="Executing" badgeColor="#4E8752" isHighlighted={isRunning || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={420} cy={310} label="BLOCKED" sublabel="synchronized Lock" topColor="#D9822B" leftColor="#A8641F" rightColor="#784714" badge="Monitor Wait" badgeColor="#D9822B" isHighlighted={isBlocked} is2D={viewMode === '2d'} />
      <IsoBlock cx={590} cy={300} label="WAITING" sublabel="wait() / park()" topColor="#AB47BC" leftColor="#80338C" rightColor="#572161" badge="Parked" badgeColor="#AB47BC" is2D={viewMode === '2d'} />
      <IsoBlock cx={730} cy={240} label="TERMINATED" sublabel="run() returned" topColor="#D14D41" leftColor="#9C372E" rightColor="#6E241D" badge="Dead" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 180 270 L 320 180" color="#7E57C2" isPlaying={isPlaying && (isNew || isRecap)} />
      <IsoPath d="M 320 180 L 480 150" color="#4A90E2" isPlaying={isPlaying && (isRunning || isRecap)} />
      <IsoPath d="M 480 170 L 420 310" color="#D9822B" isPlaying={isPlaying && isBlocked} />
      <IsoPath d="M 480 170 L 590 300" color="#AB47BC" isPlaying={isPlaying && isRecap} />
      <IsoPath d="M 420 310 L 320 190" color="#4A90E2" isPlaying={isPlaying && isBlocked} />
      <IsoPath d="M 590 300 L 320 190" color="#4A90E2" isPlaying={isPlaying && isRecap} />
      <IsoPath d="M 480 150 L 730 240" color="#D14D41" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isSupply = diagramState === 'supply-async';
  const isParallel = diagramState === 'parallel-exec';
  const isCombine = diagramState === 'then-combine';
  const isFallback = diagramState === 'fallback-catch';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'PARALLEL FORKS', value: (isParallel || isRecap) ? '2 Tasks Parallel Active' : 'Single Async Fork' },
        { label: 'LATENCY (P95)', value: isCombine ? '110 ms (Max T1, T2)' : 'Async Non-Blocking' },
        { label: 'DOWNSTREAM STATUS', value: isFallback ? 'Cached Fallback' : '200 OK' },
        { label: 'EXECUTION INVARIANT', value: isRecap ? 'NON-BLOCKING PIPELINE VERIFIED' : 'Custom API Pool (50)' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Client Ingress', color: '#4A90E2' },
        { label: 'Fork Tasks', color: '#7E57C2' },
        { label: 'Merge Aggregate', color: '#D9822B' },
        { label: 'Final Output', color: '#4E8752' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="CompletableFuture Task Graph" is2D={viewMode === '2d'} />
      <IsoLaptop cx={170} cy={270} label="Client" sublabel="GET /dashboard" is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={160} label="Policy Core API" sublabel="supplyAsync()" topColor="#4A90E2" leftColor="#3466A1" rightColor="#22456E" badge="80 ms" badgeColor="#4A90E2" isHighlighted={isSupply || isParallel || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={340} label="Payment HPP API" sublabel="supplyAsync()" topColor="#7E57C2" leftColor="#5E3F94" rightColor="#402969" badge="110 ms" badgeColor="#7E57C2" isHighlighted={isParallel || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={530} cy={240} w={96} d={52} label="thenCombine()" sublabel="Merge DTOs" topColor="#D9822B" leftColor="#A8621D" rightColor="#754311" badge="Aggregate" badgeColor="#D9822B" isHighlighted={isCombine || isRecap} is2D={viewMode === '2d'} />
      <IsoDatabase cx={530} cy={370} rx={30} ry={16} h={36} color="#D14D41" label="Fallback Cache" sublabel="exceptionally()" badge="Resilience" isHighlighted={isFallback} is2D={viewMode === '2d'} />
      <IsoBlock cx={730} cy={240} label="Response DTO" sublabel="Aggregated JSON" topColor="#4E8752" leftColor="#3A6B3D" rightColor="#264D29" badge="Complete" badgeColor="#4E8752" isHighlighted={isCombine || isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 270 L 330 160" color="#4A90E2" isPlaying={isPlaying && (isSupply || isParallel || isRecap)} />
      <IsoPath d="M 170 270 L 330 340" color="#7E57C2" isPlaying={isPlaying && (isParallel || isRecap)} />
      <IsoPath d="M 330 160 L 530 240" color="#4A90E2" isPlaying={isPlaying && (isCombine || isRecap)} />
      <IsoPath d="M 330 340 L 530 240" color="#7E57C2" isPlaying={isPlaying && (isCombine || isRecap)} />
      <IsoPath d="M 330 340 L 530 370" color="#D14D41" isPlaying={isPlaying && isFallback} />
      <IsoPath d="M 530 240 L 730 240" color="#4E8752" isPlaying={isPlaying && (isCombine || isRecap)} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isHttp = diagramState === 'http-arrives';
  const isDispatcher = diagramState === 'dispatcher-dispatch';
  const isController = diagramState === 'controller-service';
  const isDb = diagramState === 'repo-db';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'INBOUND PROTOCOL', value: isHttp ? 'HTTP Ingress Hit' : 'HTTP/2 REST' },
        { label: 'DISPATCHER', value: isDispatcher ? 'DispatcherServlet Front Controller' : '@RestController' },
        { label: 'PERSISTENCE', value: isDb ? 'MongoRepository Execution' : 'MongoDB BSON' },
        { label: 'LAYER INVARIANT', value: isRecap ? 'COMPLETE MVC PIPELINE 200 OK' : 'HttpMessageConverter Ready' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'HTTP Ingress', color: '#D9822B' },
        { label: 'Controller', color: '#4A90E2' },
        { label: 'Service Layer', color: '#4E8752' },
        { label: 'Mongo DB Store', color: '#26A69A' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="Spring Boot Layered Architecture" is2D={viewMode === '2d'} />
      <IsoLaptop cx={150} cy={270} label="Client" sublabel="GET /api/policy" is2D={viewMode === '2d'} />
      <IsoBlock cx={290} cy={240} label="Dispatcher" sublabel="Front Controller" topColor="#D9822B" leftColor="#A8621D" rightColor="#784411" badge="FilterChain" isHighlighted={isHttp || isDispatcher || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={430} cy={180} label="Controller" sublabel="@RestController" topColor="#4A90E2" leftColor="#34649E" rightColor="#21426B" badge="Mapping" badgeColor="#4A90E2" isHighlighted={isController || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={570} cy={180} label="Service" sublabel="Business Logic" topColor="#4E8752" leftColor="#37693A" rightColor="#224724" badge="@Transactional" badgeColor="#4E8752" isHighlighted={isController || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={570} cy={320} label="Repository" sublabel="MongoRepository" topColor="#AB47BC" leftColor="#7F328C" rightColor="#572061" badge="Spring Data" badgeColor="#AB47BC" isHighlighted={isDb || isRecap} is2D={viewMode === '2d'} />
      <IsoDatabase cx={730} cy={260} rx={32} ry={16} h={40} color="#26A69A" label="MongoDB" sublabel="Document Store" badge="Query OK" isHighlighted={isDb || isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 150 270 L 290 240" color="#D9822B" isPlaying={isPlaying && (isHttp || isDispatcher || isRecap)} />
      <IsoPath d="M 290 240 L 430 180" color="#4A90E2" isPlaying={isPlaying && (isController || isRecap)} />
      <IsoPath d="M 430 180 L 570 180" color="#4E8752" isPlaying={isPlaying && (isController || isRecap)} />
      <IsoPath d="M 570 180 L 570 320" color="#AB47BC" isPlaying={isPlaying && (isDb || isRecap)} />
      <IsoPath d="M 570 320 L 730 260" color="#26A69A" isPlaying={isPlaying && (isDb || isRecap)} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isAuth = diagramState === 'auth-request';
  const isMint = diagramState === 'jwt-mint';
  const isGateway = diagramState === 'bearer-dispatch';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'AUTH PROVIDER', value: 'ForgeRock AM' },
        { label: 'TOKEN ALGORITHM', value: isMint ? 'RS256 Private Key Mint' : 'RS256 (Asymmetric)' },
        { label: 'VALIDATION', value: isGateway ? 'Gateway JWKS Signature Check' : 'Gateway JWKS' },
        { label: 'SECURITY CONTEXT', value: isRecap ? 'AUTHENTICATED (JWT Invariant OK)' : isAuth ? 'ANONYMOUS' : 'VALIDATING' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'OAuth2 IdP', color: '#D9822B' },
        { label: 'API Gateway', color: '#4A90E2' },
        { label: 'Spring Backend', color: '#4E8752' },
        { label: 'Client Bearer', color: '#26A69A' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="OAuth2 & JWT Security Topology" is2D={viewMode === '2d'} />
      <IsoLaptop cx={170} cy={270} label="Client SPA" sublabel="Bearer <Token>" is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={150} label="ForgeRock AM" sublabel="OAuth2 / IdP" topColor="#D9822B" leftColor="#A8621D" rightColor="#784411" badge="Issue Token" badgeColor="#D9822B" isHighlighted={isAuth || isMint || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={500} cy={240} label="API Gateway" sublabel="JWT Signature Verify" topColor="#4A90E2" leftColor="#34649E" rightColor="#21426B" badge="JWKS Verified" badgeColor="#4A90E2" isHighlighted={isGateway || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={240} label="Spring Backend" sublabel="Protected Resource" topColor="#4E8752" leftColor="#37693A" rightColor="#224724" badge="SecurityContext" badgeColor="#4E8752" isHighlighted={isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 270 L 330 150" color="#D9822B" isPlaying={isPlaying && (isAuth || isMint || isRecap)} />
      <IsoPath d="M 330 150 L 170 270" color="#D9822B" isPlaying={isPlaying && (isMint || isRecap)} />
      <IsoPath d="M 170 270 L 500 240" color="#4A90E2" isPlaying={isPlaying && (isGateway || isRecap)} />
      <IsoPath d="M 500 240 L 720 240" color="#4E8752" isPlaying={isPlaying && isRecap} />
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
  diagramAlt,
}: {
  diagramState: string;
  isPlaying: boolean;
  viewMode?: '3d' | '2d';
  diagramAlt?: string;
}) {
  const isEden = diagramState === 'eden-alloc';
  const isMinor = diagramState === 'minor-gc';
  const isPromotion = diagramState === 'promotion';
  const isMajor = diagramState === 'major-gc';
  const isRecap = diagramState === 'recap';

  return (
    <StageContainer
      telemetry={[
        { label: 'JVM HEAP', value: '4 GB (G1 GC Regions)' },
        { label: 'YOUNG GEN', value: isEden ? '1.2 GB (Eden Allocating)' : '1.2 GB (Eden + S0/S1)' },
        { label: 'OLD GEN PROMOTION', value: isPromotion ? 'Promoted (Age >= 15)' : 'Tenured Old Gen' },
        { label: 'GC LATENCY INVARIANT', value: isRecap ? 'STW BOUNDED < 50ms' : isMinor ? '4 ms (Minor GC)' : isMajor ? '45 ms (Concurrent)' : '0 ms' },
      ]}
      viewMode={viewMode}
      diagramAlt={diagramAlt}
      legend={[
        { label: 'Thread Stack (Roots)', color: '#4E8752' },
        { label: 'Eden Space (TLAB)', color: '#42A5F5' },
        { label: 'Survivor Aging', color: '#26A69A' },
        { label: 'Tenured Old Gen', color: '#AB47BC' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="G1 Garbage Collection Regions" is2D={viewMode === '2d'} />
      <IsoBlock cx={170} cy={270} label="Thread Stack" sublabel="Root References" topColor="#4E8752" leftColor="#386B3B" rightColor="#244A26" badge="GC Roots" isHighlighted={isEden || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={150} label="Eden Space" sublabel="New Allocations" topColor="#42A5F5" leftColor="#2B74B0" rightColor="#1A4F7A" badge="Fast TLAB" badgeColor="#42A5F5" isHighlighted={isEden || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={330} cy={340} label="Survivor S0/S1" sublabel="Aging Objects" topColor="#26A69A" leftColor="#19756C" rightColor="#0F524B" badge="Age Counter" badgeColor="#26A69A" isHighlighted={isMinor || isPromotion || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={530} cy={240} label="Old Generation" sublabel="Long-lived Objects" topColor="#AB47BC" leftColor="#7A3087" rightColor="#521E5C" badge="Tenured" badgeColor="#AB47BC" isHighlighted={isPromotion || isMajor || isRecap} is2D={viewMode === '2d'} />
      <IsoBlock cx={720} cy={240} label="G1 Collector" sublabel="Concurrent Mark" topColor="#D14D41" leftColor="#99352C" rightColor="#6E231D" badge="Zero Leaks" badgeColor="#D14D41" isHighlighted={isMajor || isRecap} is2D={viewMode === '2d'} />
      <IsoPath d="M 170 270 L 330 150" color="#42A5F5" isPlaying={isPlaying && (isEden || isRecap)} />
      <IsoPath d="M 330 150 L 330 340" color="#26A69A" isPlaying={isPlaying && (isMinor || isPromotion || isRecap)} />
      <IsoPath d="M 330 340 L 530 240" color="#AB47BC" isPlaying={isPlaying && (isPromotion || isRecap)} />
      <IsoPath d="M 720 240 L 530 240" color="#D14D41" isPlaying={isPlaying && (isMajor || isRecap)} />
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
  legend,
  diagramAlt,
  children,
}: {
  telemetry: Array<{ label: string; value: string }>;
  viewMode?: '3d' | '2d';
  simulationScenario?: 'normal' | 'hot-calls' | 'recursion' | 'thread-pin';
  legend?: Array<{ label: string; color: string; shape?: 'circle' | 'square' }>;
  diagramAlt?: string;
  children: React.ReactNode;
}) {
  let effectiveTelemetry = telemetry;
  if (simulationScenario === 'hot-calls') {
    effectiveTelemetry = [
      { label: 'JIT COMPILER', value: 'HotSpot Level 4 C2' },
      { label: 'INVOCATION RATE', value: '10,000+ Calls (Threshold)' },
      { label: 'CODE CACHE', value: '64 MB / 240 MB Reserved' },
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
      <div className="px-3 pt-2 pb-0.5 flex items-center justify-between text-[10px] font-mono text-cream-400/60 uppercase tracking-wider z-20 flex-shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          HUD Telemetry
        </span>
        <span className="text-[9px] text-cream-400/50 normal-case font-mono">
          (Illustrative Simulation)
        </span>
      </div>
      <div className="grid grid-flow-col auto-cols-[minmax(115px,1fr)] sm:grid-flow-row sm:grid-cols-4 gap-2 px-3 pt-1 pb-1 z-20 flex-shrink-0 overflow-x-auto scrollbar-none">
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
          role="img"
          aria-label={diagramAlt || 'Architecture Stage Diagram'}
        >
          {diagramAlt && <desc>{diagramAlt}</desc>}
          <defs>
            {/* Diagonal Isometric Grid Pattern */}
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
          {legend && legend.length > 0 ? (
            legend.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 ${item.shape === 'square' ? 'rounded-sm' : 'rounded-full'}`}
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
            ))
          ) : (
            <>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> request</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500" /> heavy</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500" /> memory</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> exception</span>
            </>
          )}
        </div>
        <span className="hidden sm:inline font-mono text-[9px] text-cream-400/40">
          {viewMode === '2d' ? '2D ARCHITECTURAL FLAT ENGINE' : '3D ISOMETRIC ENGINE'}
        </span>
      </div>
    </div>
  );
}

// Helper: Animated Isometric Path with Glowing Packets and Directional Arrowhead
function IsoPath({
  d,
  color = '#4E8752',
  isPlaying = true,
  showArrow = true,
}: {
  d: string;
  color?: string;
  isPlaying?: boolean;
  showArrow?: boolean;
}) {
  const markerId = `arrow-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <g>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={color} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray="5 5"
        className="opacity-60"
        markerEnd={showArrow ? `url(#${markerId})` : undefined}
      />
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
