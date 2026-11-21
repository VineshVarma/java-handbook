import React from 'react';
import { Target } from 'lucide-react';

interface InterviewTipProps {
  children: React.ReactNode;
}

export function InterviewTip({ children }: InterviewTipProps) {
  return (
    <div className="my-4 rounded-xl p-3.5 bg-amber-50/80 dark:bg-amber-950/20 border-l-4 border-amber-500 dark:border-amber-400 border border-amber-200/60 dark:border-amber-800/40">
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
        <Target className="w-3.5 h-3.5" />
        <span>Interview Question & Takeaway</span>
      </div>
      <div className="text-xs leading-relaxed text-amber-950 dark:text-amber-200">
        {children}
      </div>
    </div>
  );
}
