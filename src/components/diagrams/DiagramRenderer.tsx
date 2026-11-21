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
  // Lesson specific 3D isometric topologies matching designed-to-scale.vercel.app
  if (lessonSlug === 'how-java-runs') {
    return <JavaExecutionStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  if (lessonSlug === 'thread-lifecycle') {
    return <ThreadLifecycleStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  if (lessonSlug === 'completable-future') {
    return <CompletableFutureStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  if (lessonSlug === 'spring-request-lifecycle') {
    return <SpringLifecycleStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  if (lessonSlug === 'jwt-oauth2') {
    return <JwtOAuth2Stage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  if (lessonSlug === 'memory-and-gc') {
    return <MemoryGcStage diagramState={diagramState} isPlaying={isPlaying} />;
  }

  // Fallback Enterprise Microservice Topology
  return <GenericEnterpriseStage lessonSlug={lessonSlug} diagramState={diagramState} isPlaying={isPlaying} />;
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
      {/* Central 3D Ground Pedestal */}
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label="JVM Runtime Environment" />

      {/* Developer Machine on left */}
      <IsoLaptop cx={180} cy={280} label="Developer" sublabel="PaymentService.java" />

      {/* javac Compiler Block */}
      <IsoBlock
        cx={330}
        cy={240}
        label="javac Compiler"
        sublabel="Bytecode Parser"
        topColor="#D9822B"
        leftColor="#B36B22"
        rightColor="#8F5419"
        badge="AST Parsing"
        badgeColor="#D9822B"
        isHighlighted={isCompile}
      />

      {/* JVM Execution Engine */}
      <IsoBlock
        cx={520}
        cy={210}
        w={100}
        d={56}
        h={40}
        label="JVM Engine"
        sublabel="HotSpot C1 / C2"
        topColor="#4E8752"
        leftColor="#3C6B3F"
        rightColor="#2B4F2E"
        badge={isJit ? 'Compiled JIT' : 'Interpreting'}
        badgeColor="#4E8752"
        isHighlighted={isJit}
      />

      {/* Stack Memory */}
      <IsoBlock
        cx={420}
        cy={120}
        w={76}
        d={44}
        label="Thread Stack"
        sublabel="Frames & Vars"
        topColor="#4A90E2"
        leftColor="#3874B8"
        rightColor="#26578E"
        badge="StackFrame #1"
        badgeColor="#4A90E2"
        isHighlighted={isMemory}
      />

      {/* Heap Memory */}
      <IsoBlock
        cx={590}
        cy={120}
        w={86}
        d={48}
        label="Heap Memory"
        sublabel="Eden & Old Gen"
        topColor="#AB47BC"
        leftColor="#893796"
        rightColor="#682773"
        badge="Live Objects"
        badgeColor="#AB47BC"
        isHighlighted={isMemory}
      />

      {/* Host CPU / OS */}
      <IsoBlock
        cx={720}
        cy={280}
        label="Host CPU / OS"
        sublabel="Native Assembly"
        topColor="#D14D41"
        leftColor="#A83C32"
        rightColor="#822C24"
        badge="x86-64 / ARM"
        badgeColor="#D14D41"
        isHighlighted={isJit}
      />

      {/* Isometric Paths */}
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

      {/* NEW */}
      <IsoBlock cx={180} cy={270} label="NEW" sublabel="new Thread()" topColor="#7E57C2" leftColor="#5E4094" rightColor="#442D6B" badge="Thread.init()" />

      {/* RUNNABLE */}
      <IsoBlock cx={320} cy={180} label="RUNNABLE" sublabel="In OS Scheduler" topColor="#4A90E2" leftColor="#3468A3" rightColor="#224773" badge="Ready Queue" />

      {/* RUNNING */}
      <IsoBlock
        cx={480}
        cy={150}
        label="RUNNING"
        sublabel="Core #4 Active"
        topColor="#4E8752"
        leftColor="#39633C"
        rightColor="#264528"
        badge="Executing"
        badgeColor="#4E8752"
        isHighlighted={isRunning}
      />

      {/* BLOCKED */}
      <IsoBlock
        cx={420}
        cy={310}
        label="BLOCKED"
        sublabel="synchronized Lock"
        topColor="#D9822B"
        leftColor="#A8641F"
        rightColor="#784714"
        badge="Monitor Wait"
        badgeColor="#D9822B"
        isHighlighted={isBlocked}
      />

      {/* WAITING */}
      <IsoBlock
        cx={590}
        cy={300}
        label="WAITING"
        sublabel="wait() / park()"
        topColor="#AB47BC"
        leftColor="#80338C"
        rightColor="#572161"
        badge="Parked"
        badgeColor="#AB47BC"
        isHighlighted={isWaiting}
      />

      {/* TERMINATED */}
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

      {/* Trigger Client */}
      <IsoLaptop cx={170} cy={270} label="Client" sublabel="GET /dashboard" />

      {/* Task 1: Policy Service */}
      <IsoBlock
        cx={330}
        cy={160}
        label="Policy Core API"
        sublabel="supplyAsync()"
        topColor="#4A90E2"
        leftColor="#3466A1"
        rightColor="#22456E"
        badge="80 ms"
        badgeColor="#4A90E2"
        isHighlighted={true}
      />

      {/* Task 2: Payment Service */}
      <IsoBlock
        cx={330}
        cy={340}
        label="Payment HPP API"
        sublabel="supplyAsync()"
        topColor="#7E57C2"
        leftColor="#5E3F94"
        rightColor="#402969"
        badge="110 ms"
        badgeColor="#7E57C2"
        isHighlighted={true}
      />

      {/* Combine Node */}
      <IsoBlock
        cx={530}
        cy={240}
        w={96}
        d={52}
        label="thenCombine()"
        sublabel="Merge DTOs"
        topColor="#D9822B"
        leftColor="#A8621D"
        rightColor="#754311"
        badge="Aggregate"
        badgeColor="#D9822B"
        isHighlighted={isCombine}
      />

      {/* Fallback Cache */}
      <IsoDatabase cx={530} cy={370} rx={30} ry={16} h={36} color="#D14D41" label="Fallback Cache" sublabel="exceptionally()" badge="Resilience" isHighlighted={isFallback} />

      {/* Final Aggregated DTO Response */}
      <IsoBlock
        cx={730}
        cy={240}
        label="Response DTO"
        sublabel="Aggregated JSON"
        topColor="#4E8752"
        leftColor="#3A6B3D"
        rightColor="#264D29"
        badge="Complete"
        badgeColor="#4E8752"
        isHighlighted={isCombine}
      />

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

      {/* Client */}
      <IsoLaptop cx={150} cy={270} label="Client" sublabel="GET /api/policy" />

      {/* DispatcherServlet & Filters */}
      <IsoBlock cx={290} cy={240} label="Dispatcher" sublabel="Front Controller" topColor="#D9822B" leftColor="#A8621D" rightColor="#784411" badge="FilterChain" />

      {/* Controller */}
      <IsoBlock
        cx={430}
        cy={180}
        label="Controller"
        sublabel="@RestController"
        topColor="#4A90E2"
        leftColor="#34649E"
        rightColor="#21426B"
        badge="Mapping"
        badgeColor="#4A90E2"
        isHighlighted={isController}
      />

      {/* Service */}
      <IsoBlock
        cx={570}
        cy={180}
        label="Service"
        sublabel="Business Logic"
        topColor="#4E8752"
        leftColor="#37693A"
        rightColor="#224724"
        badge="@Transactional"
        badgeColor="#4E8752"
        isHighlighted={isController}
      />

      {/* Repository */}
      <IsoBlock
        cx={570}
        cy={320}
        label="Repository"
        sublabel="MongoRepository"
        topColor="#AB47BC"
        leftColor="#7F328C"
        rightColor="#572061"
        badge="Spring Data"
        badgeColor="#AB47BC"
        isHighlighted={isDb}
      />

      {/* Database */}
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

      {/* Client */}
      <IsoLaptop cx={170} cy={270} label="Client SPA" sublabel="Bearer <Token>" />

      {/* ForgeRock Access Management */}
      <IsoBlock
        cx={330}
        cy={150}
        label="ForgeRock AM"
        sublabel="OAuth2 / IdP"
        topColor="#D9822B"
        leftColor="#A8621D"
        rightColor="#784411"
        badge="Issue Token"
        badgeColor="#D9822B"
        isHighlighted={isAuth}
      />

      {/* API Gateway */}
      <IsoBlock
        cx={500}
        cy={240}
        label="API Gateway"
        sublabel="JWT Signature Verify"
        topColor="#4A90E2"
        leftColor="#34649E"
        rightColor="#21426B"
        badge="JWKS Verified"
        badgeColor="#4A90E2"
        isHighlighted={isGateway}
      />

      {/* Protected Spring Backend */}
      <IsoBlock
        cx={720}
        cy={240}
        label="Spring Backend"
        sublabel="Protected Resource"
        topColor="#4E8752"
        leftColor="#37693A"
        rightColor="#224724"
        badge="SecurityContext"
        badgeColor="#4E8752"
        isHighlighted={isBackend}
      />

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

      {/* Stack */}
      <IsoBlock cx={170} cy={270} label="Thread Stack" sublabel="Root References" topColor="#4E8752" leftColor="#386B3B" rightColor="#244A26" badge="GC Roots" />

      {/* Eden Space */}
      <IsoBlock
        cx={330}
        cy={150}
        label="Eden Space"
        sublabel="New Allocations"
        topColor="#42A5F5"
        leftColor="#2B74B0"
        rightColor="#1A4F7A"
        badge="Fast TLAB"
        badgeColor="#42A5F5"
        isHighlighted={true}
      />

      {/* Survivor S0/S1 */}
      <IsoBlock
        cx={330}
        cy={340}
        label="Survivor S0/S1"
        sublabel="Aging Objects"
        topColor="#26A69A"
        leftColor="#19756C"
        rightColor="#0F524B"
        badge="Age Counter"
        badgeColor="#26A69A"
        isHighlighted={isMinor}
      />

      {/* Old Generation */}
      <IsoBlock
        cx={530}
        cy={240}
        label="Old Generation"
        sublabel="Long-lived Objects"
        topColor="#AB47BC"
        leftColor="#7A3087"
        rightColor="#521E5C"
        badge="Tenured"
        badgeColor="#AB47BC"
        isHighlighted={isMajor}
      />

      {/* G1 GC Collector */}
      <IsoBlock
        cx={720}
        cy={240}
        label="G1 Collector"
        sublabel="Concurrent Mark"
        topColor="#D14D41"
        leftColor="#99352C"
        rightColor="#6E231D"
        badge="Zero Leaks"
        badgeColor="#D14D41"
        isHighlighted={isMajor}
      />

      <IsoPath d="M 170 270 L 330 150" color="#42A5F5" isPlaying={isPlaying} />
      <IsoPath d="M 330 150 L 330 340" color="#26A69A" isPlaying={isPlaying} />
      <IsoPath d="M 330 340 L 530 240" color="#AB47BC" isPlaying={isPlaying} />
      <IsoPath d="M 720 240 L 530 240" color="#D14D41" isPlaying={isPlaying && isMajor} />
    </StageContainer>
  );
}

// -------------------------------------------------------------
// Generic Fallback Stage with Clean 3D Layout
// -------------------------------------------------------------
function GenericEnterpriseStage({ lessonSlug, diagramState, isPlaying }: { lessonSlug: string; diagramState: string; isPlaying: boolean }) {
  return (
    <StageContainer
      telemetry={[
        { label: 'TOPOLOGY', value: 'Enterprise Service' },
        { label: 'HEALTH', value: '100% Operational' },
        { label: 'STATE', value: diagramState.toUpperCase() },
        { label: 'RUNTIME', value: 'Java 21 LTS' },
      ]}
    >
      <IsoPedestal cx={450} cy={270} w={640} d={240} h={20} fillTop="#22201D" fillSide="#161513" label={lessonSlug} />

      <IsoLaptop cx={180} cy={270} label="Client" sublabel="API Consumer" />
      <IsoBlock cx={360} cy={220} label="Service Gateway" sublabel="Load Balancer" topColor="#D9822B" leftColor="#A8621D" rightColor="#784411" badge="Route OK" />
      <IsoBlock cx={540} cy={200} label="Java Backend" sublabel="Core Service" topColor="#4E8752" leftColor="#37693A" rightColor="#224724" badge="200 OK" isHighlighted={true} />
      <IsoDatabase cx={720} cy={270} rx={32} ry={16} h={38} color="#AB47BC" label="Data Store" sublabel="MongoDB / SQL" />

      <IsoPath d="M 180 270 L 360 220" color="#D9822B" isPlaying={isPlaying} />
      <IsoPath d="M 360 220 L 540 200" color="#4E8752" isPlaying={isPlaying} />
      <IsoPath d="M 540 200 L 720 270" color="#AB47BC" isPlaying={isPlaying} />
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
            {/* Diagonal Isometric Grid Pattern */}
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
