import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  children,
  icon,
  className,
}: BadgeProps) {
  const variantStyles = {
    default:
      'bg-cream-200 text-charcoal-800 dark:bg-charcoal-700 dark:text-cream-100 border border-cream-300 dark:border-charcoal-600',
    success:
      'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
    warning:
      'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
    danger:
      'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
    info:
      'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50',
    outline:
      'bg-transparent text-charcoal-700 dark:text-cream-200 border border-cream-300 dark:border-charcoal-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono tracking-tight font-medium border transition-colors',
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
