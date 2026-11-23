'use client';

import React, { useState, useEffect } from 'react';
import { LessonStep, StepType } from '@/lib/types';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Terminal, HelpCircle, Check, Copy } from 'lucide-react';
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
  isCourseComplete?: boolean;
  onCompleteCourse?: () => void;
}

const typeBadgeVariants: Record<StepType, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  problem: 'danger',
  concept: 'info',
  solution: 'success',
  insight: 'warning',
  'trade-off': 'warning',
  recap: 'default',
};

interface BlockItem {
  text: string;
  children?: BlockList[];
}

interface BlockList {
  type: 'list';
  ordered: boolean;
  items: BlockItem[];
}

interface BlockParagraph {
  type: 'p';
  content: string;
}

type ContentBlock = BlockParagraph | BlockList;

// Parses markdown into structured blocks: paragraphs, bullet lists (ul), and numbered lists (ol)
function parseMarkdownBlocks(text: string): ContentBlock[] {
  const lines = text.split('\n');
  const blocks: ContentBlock[] = [];
  let i = 0;
  const n = lines.length;

  while (i < n) {
    const line = lines[i];
    const stripped = line.trim();

    if (!stripped) {
      i++;
      continue;
    }

    // Check if line begins a list item: `- `, `* `, or `1. `, `2. ` etc.
    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);

    if (listMatch) {
      const indent = listMatch[1];
      const marker = listMatch[2];
      const isOrdered = marker.endsWith('.');
      const listBlock: BlockList = {
        type: 'list',
        ordered: isOrdered,
        items: [],
      };

      while (i < n) {
        const currLine = lines[i];
        const currStripped = currLine.trim();

        if (!currStripped) {
          // Look ahead: does the list continue across a blank line?
          let peek = i + 1;
          while (peek < n && !lines[peek].trim()) {
            peek++;
          }
          if (peek < n) {
            const nextMatch = lines[peek].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
            if (nextMatch) {
              const nextIsOrdered = nextMatch[2].endsWith('.');
              if (nextIsOrdered === isOrdered) {
                i++;
                continue;
              }
            }
          }
          break;
        }

        const currMatch = currLine.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        if (currMatch) {
          const cIndent = currMatch[1];
          const cMarker = currMatch[2];
          const cText = currMatch[3];
          const cOrdered = cMarker.endsWith('.');

          // Sub-item with deeper indentation -> nest under last item
          if (cIndent.length > indent.length && listBlock.items.length > 0) {
            const lastItem = listBlock.items[listBlock.items.length - 1];
            if (!lastItem.children) {
              lastItem.children = [];
            }
            let targetChildList = lastItem.children[lastItem.children.length - 1];
            if (!targetChildList || targetChildList.ordered !== cOrdered) {
              targetChildList = {
                type: 'list',
                ordered: cOrdered,
                items: [],
              };
              lastItem.children.push(targetChildList);
            }
            targetChildList.items.push({ text: cText });
            i++;
            continue;
          } else if (cOrdered === isOrdered) {
            listBlock.items.push({ text: cText });
            i++;
            continue;
          } else {
            // Switched list type at root level
            break;
          }
        } else {
          // Indented continuation line for active list item
          if (listBlock.items.length > 0 && currLine.search(/\S/) > indent.length) {
            const lastItem = listBlock.items[listBlock.items.length - 1];
            if (lastItem.children && lastItem.children.length > 0) {
              const lastChildList = lastItem.children[lastItem.children.length - 1];
              if (lastChildList.items.length > 0) {
                lastChildList.items[lastChildList.items.length - 1].text += ' ' + currStripped;
              } else {
                lastItem.text += ' ' + currStripped;
              }
            } else {
              lastItem.text += ' ' + currStripped;
            }
            i++;
            continue;
          } else {
            break;
          }
        }
      }

      blocks.push(listBlock);
    } else {
      // Paragraph: collect lines until a list marker or blank line
      const pLines: string[] = [stripped];
      i++;
      while (i < n) {
        const nextLine = lines[i];
        const nextStripped = nextLine.trim();
        if (!nextStripped) break;
        if (/^\s*([*+-]|\d+\.)\s+/.test(nextLine)) {
          break;
        }
        pLines.push(nextStripped);
        i++;
      }
      blocks.push({
        type: 'p',
        content: pLines.join(' '),
      });
    }
  }

  return blocks;
}

function renderList(list: BlockList, keyPrefix: string | number, isNested = false): React.ReactNode {
  const ListTag = list.ordered ? 'ol' : 'ul';
  const listClass = list.ordered
    ? isNested
      ? 'list-decimal pl-5 space-y-1 mt-1 text-charcoal-700 dark:text-cream-300'
      : 'list-decimal pl-5 space-y-2 my-2.5'
    : isNested
      ? 'list-disc pl-5 space-y-1 mt-1 text-charcoal-700 dark:text-cream-300'
      : 'list-disc pl-5 space-y-2 my-2.5';

  return (
    <ListTag key={keyPrefix} className={listClass}>
      {list.items.map((it, idx) => (
        <li key={idx} className="leading-relaxed">
          <span>{formatInline(it.text)}</span>
          {it.children && it.children.map((child, cIdx) => renderList(child, `${keyPrefix}-${idx}-${cIdx}`, true))}
        </li>
      ))}
    </ListTag>
  );
}

// Markdown parser for rich text formatting in educational steps
function renderFormattedContent(text: string) {
  const blocks = parseMarkdownBlocks(text);

  return (
    <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-charcoal-800 dark:text-cream-200">
      {blocks.map((block, idx) => {
        if (block.type === 'list') {
          return renderList(block, idx);
        }
        return (
          <p key={idx} className="leading-relaxed">
            {formatInline(block.content)}
          </p>
        );
      })}
    </div>
  );
}

function formatInline(str: string): React.ReactNode {
  // Bold **text**, inline `code`, and italics *text*
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*(?:[^* \n]|(?<=\S)\*)[^*\n]*?(?:[^* \n]|(?<=\S)\*)\*)/g;
  const parts = str.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

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

    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong
          key={idx}
          className="font-bold text-charcoal-950 dark:text-cream-50"
        >
          {formatInline(inner)}
        </strong>
      );
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const inner = part.slice(1, -1);
      if (!inner.startsWith(' ') && !inner.endsWith(' ')) {
        return (
          <em
            key={idx}
            className="italic text-charcoal-900 dark:text-cream-100"
          >
            {formatInline(inner)}
          </em>
        );
      }
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
  isCourseComplete,
  onCompleteCourse,
}: StepContentProps) {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  // Reset quiz selection on step change
  useEffect(() => {
    setSelectedQuizOption(null);
  }, [stepIndex, step.id]);

  const handleCopyCli = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-cream-50/70 dark:bg-charcoal-900/60">
      {/* Scrollable Reading Content Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
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
          <h2 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-charcoal-900 dark:text-cream-100">
            {step.title}
          </h2>
          {step.subtitle && (
            <p className="text-xs text-charcoal-500 dark:text-cream-400 mt-1 font-medium">
              {step.subtitle}
            </p>
          )}
        </div>

        {/* 1. Production Symptom Box (The 5-Part Arc Opening) */}
        {step.productionSymptom && (
          <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider mb-1 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>Production Mystery</span>
            </div>
            <p className="text-xs leading-relaxed font-sans">{step.productionSymptom}</p>
          </div>
        )}

        {/* 2. Main Educational Text */}
        <div className="py-1">{renderFormattedContent(step.content)}</div>

        {/* 3. Key Idea Callout */}
        {step.keyIdea && <KeyIdea>{step.keyIdea}</KeyIdea>}

        {/* 4. Real Java Code Example */}
        {step.codeExample && (
          <CodeBlock
            code={step.codeExample.code}
            language={step.codeExample.language || 'java'}
            title={step.codeExample.title}
            beforeCode={step.codeExample.beforeCode}
          />
        )}

        {/* 5. Production CLI Inspection Box */}
        {step.cliInspection && (
          <div className="rounded-xl border border-charcoal-700 bg-[#161513] text-cream-100 overflow-hidden shadow-xs">
            <div className="px-3.5 py-2 bg-[#22201D] border-b border-[#33302B] flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cream-400 font-bold uppercase tracking-wider text-[10px]">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Live Production CLI Inspection
              </span>
              <button
                onClick={() => handleCopyCli(step.cliInspection!.command)}
                className="flex items-center gap-1 text-[11px] font-mono text-cream-400 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCli ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 text-xs font-mono">
              <div className="text-emerald-400 font-bold">$ {step.cliInspection.command}</div>
              {step.cliInspection.output && (
                <div className="mt-2 text-cream-300/80 text-[11px] font-mono leading-relaxed bg-[#1B1917] p-2.5 rounded-lg border border-charcoal-800 whitespace-pre-wrap">
                  {step.cliInspection.output}
                </div>
              )}
              <div className="mt-2 text-[11px] text-cream-400 font-sans leading-relaxed">
                {step.cliInspection.explanation}
              </div>
            </div>
          </div>
        )}

        {/* 6. Interview Tip / Question Callout */}
        {step.interviewTip && (
          <InterviewTip>{step.interviewTip}</InterviewTip>
        )}

        {/* 7. Interactive Micro-Check (Predict the Outcome) */}
        {step.microCheck && (
          <div className="p-3.5 rounded-xl border border-sky-300 dark:border-sky-800/60 bg-sky-50/70 dark:bg-sky-950/30 text-sky-950 dark:text-sky-100 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
              <span>Micro-Check: Predict the Outcome</span>
            </div>
            <p className="text-xs font-semibold font-sans">{step.microCheck.question}</p>
            <div className="space-y-1.5">
              {step.microCheck.options.map((opt, optIdx) => {
                const isSelected = selectedQuizOption === optIdx;
                const isCorrect = optIdx === step.microCheck!.answerIndex;
                return (
                  <button
                    key={optIdx}
                    onClick={() => setSelectedQuizOption(optIdx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all border ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                          : 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                        : 'bg-white/90 dark:bg-charcoal-800/90 hover:bg-white dark:hover:bg-charcoal-700 border-cream-300 dark:border-charcoal-700 text-charcoal-800 dark:text-cream-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {selectedQuizOption !== null && (
              <div className="pt-2 border-t border-sky-200 dark:border-sky-800/60 text-[11px] font-sans leading-relaxed text-charcoal-800 dark:text-cream-200">
                <strong>
                  {selectedQuizOption === step.microCheck.answerIndex ? '✓ Correct! ' : '✗ Incorrect. '}
                </strong>
                {step.microCheck.explanation}
              </div>
            )}
          </div>
        )}

        {/* "You'll Learn" checklist (shown on step 1) */}
        {stepIndex === 0 && youllLearn && youllLearn.length > 0 && (
          <div className="mt-4 pt-4 border-t border-cream-300 dark:border-charcoal-700">
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

        {/* Next Up Lesson Footer Callout (shown on final step of lesson) */}
        {isCourseComplete ? (
          <div className="mt-4 p-4 rounded-xl border border-emerald-400 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span>🏆</span> Course Completed
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                27 / 27 Lessons Done
              </span>
            </div>
            <p className="text-sm font-bold font-mono text-charcoal-900 dark:text-cream-50">
              You Have Mastered the Java Handbook!
            </p>
            <p className="text-xs font-sans text-charcoal-600 dark:text-cream-300 leading-relaxed">
              You have completed all 27 lessons and 96 interactive steps covering JVM internals, modern concurrency, Spring Boot architecture, and cloud operations.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="/"
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Course Overview
              </a>
              <button
                onClick={onCompleteCourse}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-emerald-600/30 dark:border-emerald-400/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
              >
                Review from Beginning
              </button>
            </div>
          </div>
        ) : stepIndex === totalSteps - 1 && nextStepTitle ? (
          <div className="mt-4 p-4 rounded-xl border border-emerald-300 dark:border-emerald-850 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Lesson Complete · Next Up
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                {stepIndex + 1}/{totalSteps} Steps Done
              </span>
            </div>
            <p className="text-xs font-bold font-mono text-charcoal-900 dark:text-cream-50">
              {nextStepTitle}
            </p>
            <p className="text-[11px] font-sans text-charcoal-600 dark:text-cream-300">
              Continue your journey to master internal JVM architecture and distributed systems.
            </p>
          </div>
        ) : null}
      </div>

      {/* Pinned Bottom Navigation Action Bar */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-cream-300 dark:border-charcoal-700 bg-cream-100/95 dark:bg-charcoal-900/95 backdrop-blur-md space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors ${
              hasPrev
                ? 'bg-cream-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-cream-100 border-cream-300 dark:border-charcoal-600 hover:bg-cream-200 dark:hover:bg-charcoal-700 active:scale-95'
                : 'opacity-40 cursor-not-allowed bg-transparent text-charcoal-400 dark:text-cream-500 border-cream-200 dark:border-charcoal-800'
            }`}
            data-testid="prev-step-button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {isCourseComplete ? (
            <button
              onClick={onCompleteCourse || onNext}
              className="min-h-[44px] flex-1 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95"
              data-testid="next-step-button"
            >
              <span className="truncate">Finish Course (Overview)</span>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 ml-2" />
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!hasNext}
              className={`min-h-[44px] flex-1 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all ${
                hasNext
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95'
                  : 'opacity-50 cursor-not-allowed bg-emerald-600/50 text-white'
              }`}
              data-testid="next-step-button"
            >
              <span className="truncate">
                Next: {nextStepTitle || 'Next Step'}
              </span>
              <ArrowRight className="w-4 h-4 flex-shrink-0 ml-2" />
            </button>
          )}
        </div>

        {/* Keyboard shortcut hints: visible only on desktop */}
        <div className="hidden md:block text-center text-[10px] font-mono text-charcoal-500 dark:text-cream-400">
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
