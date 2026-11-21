'use client';

import React from 'react';
import { LessonStep, StepType } from '@/lib/types';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { KeyIdea } from '@/components/ui/KeyIdea';
import { InterviewTip } from '@/components/ui/InterviewTip';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface StepContentProps {
  step: LessonStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  nextStepTitle?: string;
  youllLearn: string[];
}

const typeBadgeVariants: Record<StepType, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  problem: 'danger',
  concept: 'info',
  solution: 'success',
  insight: 'warning',
  'trade-off': 'warning',
  recap: 'default',
};

// Simple Markdown parser for rich text formatting in paragraphs
function renderFormattedContent(text: string) {
  const paragraphs = text.split('\n\n');

  return (
    <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-charcoal-800 dark:text-cream-200">
      {paragraphs.map((p, pIdx) => {
        const trimmed = p.trim();
        if (!trimmed) return null;

        // Bullet point list check
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n');
          return (
            <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-2">
              {items.map((it, itIdx) => {
                const cleanItem = it.replace(/^[-*]\s+/, '');
                return <li key={itIdx}>{formatInline(cleanItem)}</li>;
              })}
            </ul>
          );
        }

        return <p key={pIdx}>{formatInline(trimmed)}</p>;
      })}
    </div>
  );
}

function formatInline(str: string): React.ReactNode {
  // Bold **text** and `code`
  const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong
          key={idx}
          className="font-bold text-charcoal-950 dark:text-cream-50"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded font-mono text-[11px] bg-cream-300/70 dark:bg-charcoal-700 text-charcoal-900 dark:text-cream-100 font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function StepContent({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  nextStepTitle,
  youllLearn,
}: StepContentProps) {
  return (
    <div className="h-full flex flex-col justify-between overflow-y-auto p-4 sm:p-6 bg-cream-50/70 dark:bg-charcoal-900/60 border-l border-cream-300 dark:border-charcoal-700">
      <div className="space-y-4">
        {/* Step indicator header */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-charcoal-500 dark:text-cream-400">
            Step {stepIndex + 1} / {totalSteps}
          </span>
          <Badge variant={typeBadgeVariants[step.type] || 'default'}>
            {step.type}
          </Badge>
        </div>

        {/* Step Title & Subtitle */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-charcoal-900 dark:text-cream-100">
            {step.title}
          </h2>
          {step.subtitle && (
            <p className="text-xs text-charcoal-500 dark:text-cream-400 mt-1 font-medium">
              {step.subtitle}
            </p>
          )}
        </div>

        {/* Main educational text */}
        <div className="py-1">{renderFormattedContent(step.content)}</div>

        {/* Key Idea Callout */}
        {step.keyIdea && <KeyIdea>{step.keyIdea}</KeyIdea>}

        {/* Real Java Code Example */}
        {step.codeExample && (
          <CodeBlock
            code={step.codeExample.code}
            language={step.codeExample.language || 'java'}
            title={step.codeExample.title}
            beforeCode={step.codeExample.beforeCode}
          />
        )}

        {/* Interview Tip / Question Callout */}
        {step.interviewTip && (
          <InterviewTip>{step.interviewTip}</InterviewTip>
        )}

        {/* "You'll Learn" checklist (shown on step 1) */}
        {stepIndex === 0 && youllLearn && youllLearn.length > 0 && (
          <div className="mt-6 pt-4 border-t border-cream-300 dark:border-charcoal-700">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal-700 dark:text-cream-300 mb-2.5">
              You'll Learn
            </h3>
            <div className="space-y-2">
              {youllLearn.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-charcoal-700 dark:text-cream-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation & hotkeys footer */}
      <div className="mt-8 pt-4 border-t border-cream-300 dark:border-charcoal-700 space-y-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors ${
              hasPrev
                ? 'bg-cream-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-cream-100 border-cream-300 dark:border-charcoal-600 hover:bg-cream-200 dark:hover:bg-charcoal-700'
                : 'opacity-40 cursor-not-allowed bg-transparent text-charcoal-400 dark:text-cream-500 border-cream-200 dark:border-charcoal-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex-1 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all ${
              hasNext
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'opacity-50 cursor-not-allowed bg-emerald-600/50 text-white'
            }`}
          >
            <span className="truncate">
              Next: {nextStepTitle || 'Next Step'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 ml-2" />
          </button>
        </div>

        <div className="text-center text-[10px] font-mono text-charcoal-500 dark:text-cream-400">
          <kbd className="px-1 rounded bg-cream-200 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700">
            ←
          </kbd>{' '}
          <kbd className="px-1 rounded bg-cream-200 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700">
            →
          </kbd>{' '}
          step ·{' '}
          <kbd className="px-1 rounded bg-cream-200 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700">
            R
          </kbd>{' '}
          replay ·{' '}
          <kbd className="px-1 rounded bg-cream-200 dark:bg-charcoal-800 border border-cream-300 dark:border-charcoal-700">
            Space
          </kbd>{' '}
          pause
        </div>
      </div>
    </div>
  );
}
