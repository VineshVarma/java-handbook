'use client';

import React from 'react';
import { Lesson } from '@/lib/types';
import { DiagramCanvas } from '@/components/lesson/DiagramCanvas';
import { StepProgress } from '@/components/layout/StepProgress';
import { Badge } from '@/components/ui/Badge';
import { Clock, BarChart2, Layers } from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  currentStepIndex: number;
  onStepClick: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  completedStepIndices: number[];
}

export function LessonView({
  lesson,
  currentStepIndex,
  onStepClick,
  isPlaying,
  onTogglePlay,
  onReplay,
  completedStepIndices,
}: LessonViewProps) {
  const currentStep = lesson.steps[currentStepIndex] || lesson.steps[0];

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* Lesson Compact Header */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 border-b border-cream-300 dark:border-charcoal-700 bg-cream-100/60 dark:bg-charcoal-900/60">
        <div className="flex items-center gap-2 text-[11px] font-mono text-charcoal-500 dark:text-cream-400 mb-0.5">
          <span className="truncate">{lesson.moduleTitle}</span>
          <span>/</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate">{lesson.title}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold font-mono text-charcoal-900 dark:text-cream-100 truncate">
              {lesson.title}
            </h1>
            <p className="text-[11px] text-charcoal-600 dark:text-cream-300 truncate">
              {lesson.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge variant="outline" icon={<Clock className="w-3 h-3" />}>
              {lesson.duration}
            </Badge>
            <Badge
              variant={
                lesson.difficulty === 'Beginner'
                  ? 'success'
                  : lesson.difficulty === 'Intermediate'
                  ? 'warning'
                  : 'danger'
              }
              icon={<BarChart2 className="w-3 h-3" />}
            >
              {lesson.difficulty}
            </Badge>
            <Badge variant="outline" icon={<Layers className="w-3 h-3" />}>
              {lesson.steps.length} steps
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Diagram Canvas Area */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-hidden flex flex-col">
        <DiagramCanvas
          lessonSlug={lesson.slug}
          diagramState={currentStep?.diagramState || 'recap'}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onReplay={onReplay}
          diagramAlt={currentStep?.diagramAlt}
        />
      </div>

      {/* Bottom Step Progress Timeline */}
      <div className="flex-shrink-0">
        <StepProgress
          steps={lesson.steps}
          currentStepIndex={currentStepIndex}
          onStepClick={onStepClick}
          completedStepIndices={completedStepIndices}
        />
      </div>
    </div>
  );
}
