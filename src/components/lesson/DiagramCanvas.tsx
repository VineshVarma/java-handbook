'use client';

import React from 'react';
import { DiagramRenderer } from '@/components/diagrams/DiagramRenderer';
import { RotateCcw, Pause, Play } from 'lucide-react';

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
    <div className="relative w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden rounded-2xl border border-cream-300 dark:border-charcoal-700 shadow-sm">
      {/* Simulation Controls Top-Right */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#22201D]/90 backdrop-blur-md p-1 rounded-xl border border-[#33302B] shadow-md">
        <button
          onClick={onReplay}
          className="p-1.5 rounded-lg text-cream-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Replay packet animation (R)"
          aria-label="Replay"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onTogglePlay}
          className="p-1.5 rounded-lg text-cream-300 hover:text-white hover:bg-white/10 transition-colors"
          title={isPlaying ? 'Pause animation (Space)' : 'Play animation (Space)'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* SVG Animation Stage */}
      <div className="flex-1 min-h-0 w-full h-full overflow-hidden">
        <DiagramRenderer
          lessonSlug={lessonSlug}
          diagramState={diagramState}
          isPlaying={isPlaying}
        />
      </div>
    </div>
  );
}
