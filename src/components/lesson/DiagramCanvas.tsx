'use client';

import React from 'react';
import { DiagramRenderer } from '@/components/diagrams/DiagramRenderer';
import { RotateCcw, Pause, Play, Maximize2 } from 'lucide-react';

interface DiagramCanvasProps {
  lessonSlug: string;
  diagramState: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
}

export function DiagramCanvas({
  lessonSlug,
  diagramState,
  isPlaying,
  onTogglePlay,
  onReplay,
}: DiagramCanvasProps) {
  return (
    <div className="relative w-full flex-1 flex flex-col justify-center">
      {/* Simulation Controls Top-Right */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/80 dark:bg-charcoal-800/80 backdrop-blur-xs p-1 rounded-xl border border-cream-300 dark:border-charcoal-700 shadow-xs">
        <button
          onClick={onReplay}
          className="p-1.5 rounded-lg text-charcoal-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors"
          title="Replay packet animation (R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePlay}
          className="p-1.5 rounded-lg text-charcoal-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors"
          title={isPlaying ? 'Pause animation (Space)' : 'Play animation (Space)'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      {/* SVG Animation Stage */}
      <DiagramRenderer
        lessonSlug={lessonSlug}
        diagramState={diagramState}
        isPlaying={isPlaying}
      />

      {/* Legend Footer */}
      <div className="mt-2 flex items-center justify-center gap-4 text-[11px] font-mono text-charcoal-500 dark:text-cream-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>Active Flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Processing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span>Bytecode / Memory</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Exception / Boundary</span>
        </div>
      </div>
    </div>
  );
}
