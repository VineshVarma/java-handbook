'use client';

import React, { useState } from 'react';
import { DiagramRenderer } from '@/components/diagrams/DiagramRenderer';
import { RotateCcw, Pause, Play, Box, Square, Zap, ChevronDown } from 'lucide-react';

import { DiagramState } from '@/lib/types';

interface DiagramCanvasProps {
  lessonSlug: string;
  diagramState: DiagramState;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  diagramAlt?: string;
}

export type SimulationScenario = 'normal' | 'hot-calls' | 'recursion' | 'thread-pin';

export function DiagramCanvas({
  lessonSlug,
  diagramState,
  isPlaying,
  onTogglePlay,
  onReplay,
  diagramAlt,
}: DiagramCanvasProps) {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('normal');
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  return (
    <div className="relative w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden rounded-2xl border border-cream-300 dark:border-charcoal-700 shadow-sm bg-[#161513]">
      {/* Simulation Controls Top-Right */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#22201D]/90 backdrop-blur-md p-1 rounded-xl border border-[#33302B] shadow-md text-xs font-mono">
        {/* 2D Flat / 3D Isometric Toggle */}
        <button
          onClick={() => setViewMode((v) => (v === '3d' ? '2d' : '3d'))}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-cream-300 hover:text-white hover:bg-white/10 transition-colors font-bold text-[10px]"
          title="Toggle 2D Flat / 3D Isometric View"
          data-testid="toggle-view-mode"
        >
          {viewMode === '3d' ? (
            <>
              <Box className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">3D Iso</span>
            </>
          ) : (
            <>
              <Square className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">2D Flat</span>
            </>
          )}
        </button>

        {/* "Break It" Interactive Simulator Menu */}
        <div className="relative">
          <button
            onClick={() => setSimulatorOpen((p) => !p)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              simulationScenario !== 'normal'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-cream-300 hover:text-white hover:bg-white/10'
            }`}
            title="Break It: Runtime Simulations"
            data-testid="break-it-button"
          >
            <Zap
              className={`w-3.5 h-3.5 ${
                simulationScenario !== 'normal' ? 'text-amber-400 fill-amber-400' : 'text-amber-400'
              }`}
            />
            <span className="hidden sm:inline">Break It</span>
            <ChevronDown className="w-3 h-3 text-cream-400" />
          </button>

          {simulatorOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl bg-[#22201D] border border-[#33302B] p-1.5 shadow-xl z-40 text-xs font-mono space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-cream-400 tracking-wider border-b border-[#33302B]">
                Runtime Simulation
              </div>
              <button
                onClick={() => {
                  setSimulationScenario('normal');
                  setSimulatorOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                  simulationScenario === 'normal'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-cream-300 hover:bg-white/10'
                }`}
                data-testid="sim-scenario-normal"
              >
                Normal Execution
              </button>
              <button
                onClick={() => {
                  setSimulationScenario('hot-calls');
                  setSimulatorOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                  simulationScenario === 'hot-calls'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-cream-300 hover:bg-white/10'
                }`}
                data-testid="sim-scenario-hot-calls"
              >
                Simulate 10,000 Calls (JIT C2)
              </button>
              <button
                onClick={() => {
                  setSimulationScenario('recursion');
                  setSimulatorOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                  simulationScenario === 'recursion'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-cream-300 hover:bg-white/10'
                }`}
                data-testid="sim-scenario-recursion"
              >
                Trigger Recursion (StackOverflow)
              </button>
              <button
                onClick={() => {
                  setSimulationScenario('thread-pin');
                  setSimulatorOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                  simulationScenario === 'thread-pin'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-cream-300 hover:bg-white/10'
                }`}
                data-testid="sim-scenario-thread-pin"
              >
                Pin Virtual Thread (synchronized)
              </button>
            </div>
          )}
        </div>

        {/* Replay */}
        <button
          onClick={onReplay}
          className="p-1.5 rounded-lg text-cream-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Replay packet animation (R)"
          aria-label="Replay"
          data-testid="replay-button"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={onTogglePlay}
          className="p-1.5 rounded-lg text-cream-300 hover:text-white hover:bg-white/10 transition-colors"
          title={isPlaying ? 'Pause animation (Space)' : 'Play animation (Space)'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          data-testid="play-pause-button"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* SVG Animation Stage */}
      <div
        className="flex-1 min-h-0 w-full h-full overflow-hidden touch-pan-y"
        role="region"
        aria-label={diagramAlt || "Interactive Architecture Diagram"}
      >
        <DiagramRenderer
          lessonSlug={lessonSlug}
          diagramState={diagramState}
          isPlaying={isPlaying}
          viewMode={viewMode}
          simulationScenario={simulationScenario}
          diagramAlt={diagramAlt}
        />
      </div>
    </div>
  );
}
