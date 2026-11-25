'use client';

import React from 'react';
import { LessonStep } from '@/lib/types';
import { Check } from 'lucide-react';

interface StepProgressProps {
  steps: LessonStep[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
  completedStepIndices: number[];
}

export function StepProgress({
  steps,
  currentStepIndex,
  onStepClick,
  completedStepIndices,
}: StepProgressProps) {
  return (
    <div className="w-full pt-2.5 pb-2 px-4 border-t border-cream-300 dark:border-charcoal-700 bg-cream-100/90 dark:bg-charcoal-900/90 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-mono text-charcoal-500 dark:text-cream-400">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-charcoal-700 dark:text-cream-300">
          In this lesson
        </span>
        <span>
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isDone = completedStepIndices.includes(idx);

          return (
            <React.Fragment key={step.id || idx}>
              <button
                onClick={() => onStepClick(idx)}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0 border ${
                  isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm scale-105'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-cream-200/60 text-charcoal-600 border-cream-300 dark:bg-charcoal-800 dark:text-cream-400 dark:border-charcoal-700 hover:border-charcoal-400'
                }`}
                title={step.title}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-white text-emerald-700'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-cream-300 dark:bg-charcoal-700 text-charcoal-700 dark:text-cream-300'
                  }`}
                >
                  {isDone && !isCurrent ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                </span>
                <span className="whitespace-nowrap">{step.title}</span>
              </button>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-3 flex-shrink-0 rounded ${
                    isDone || idx < currentStepIndex
                      ? 'bg-emerald-500'
                      : 'bg-cream-300 dark:bg-charcoal-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
