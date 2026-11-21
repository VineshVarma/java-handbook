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
      {/* Lesson Header */}
      <div className="px-6 pt-5 pb-3 border-b border-cream-300 dark:border-charcoal-700 bg-cream-100/50 dark:bg-charcoal-900/50">
        <div className="flex items-center gap-2 text-xs font-mono text-charcoal-500 dark:text-cream-400 mb-1">
          <span>{lesson.moduleTitle}</span>
          <span>/</span>
          <span>{lesson.title}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-charcoal-900 dark:text-cream-100">
              {lesson.title}
            </h1>
            <p className="text-xs text-charcoal-600 dark:text-cream-300 mt-0.5">
              {lesson.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
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

      {/* Main Diagram Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col min-h-0">
        <DiagramCanvas
          lessonSlug={lesson.slug}
          diagramState={currentStep?.diagramState || 'default'}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          onReplay={onReplay}
        />
      </div>

      {/* Bottom Step Progress */}
      <StepProgress
        steps={lesson.steps}
        currentStepIndex={currentStepIndex}
        onStepClick={onStepClick}
        completedStepIndices={completedStepIndices}
      />
    </div>
  );
}
