import React from 'react';
import { Lightbulb } from 'lucide-react';

interface KeyIdeaProps {
  children: React.ReactNode;
}

export function KeyIdea({ children }: KeyIdeaProps) {
  return (
    <div className="my-4 rounded-xl p-3.5 bg-emerald-50/80 dark:bg-emerald-950/20 border-l-4 border-emerald-600 dark:border-emerald-500 border border-emerald-200/60 dark:border-emerald-800/40">
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1">
        <Lightbulb className="w-3.5 h-3.5" />
        <span>Key Idea</span>
      </div>
      <div className="text-xs leading-relaxed text-emerald-950 dark:text-emerald-200">
        {children}
      </div>
    </div>
  );
}
