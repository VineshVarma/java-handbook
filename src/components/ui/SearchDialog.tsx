'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, BookOpen, Layers, Sparkles } from 'lucide-react';
import { Lesson } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: Lesson[];
  onNavigate: (lessonSlug: string, stepIndex: number) => void;
}

interface SearchResult {
  category: 'Lessons' | 'Steps' | 'Concepts';
  lessonSlug: string;
  lessonTitle: string;
  stepIndex: number;
  title: string;
  subtitle?: string;
  tag?: string;
}

export function SearchDialog({
  isOpen,
  onClose,
  lessons,
  onNavigate,
}: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Suggest first 5 lessons
      return lessons.slice(0, 6).map((l) => ({
        category: 'Lessons' as const,
        lessonSlug: l.slug,
        lessonTitle: l.title,
        stepIndex: 0,
        title: l.title,
        subtitle: l.subtitle,
        tag: l.difficulty,
      }));
    }

    const q = query.toLowerCase();
    const list: SearchResult[] = [];

    // Search lessons
    for (const l of lessons) {
      if (
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.moduleTitle.toLowerCase().includes(q)
      ) {
        list.push({
          category: 'Lessons',
          lessonSlug: l.slug,
          lessonTitle: l.title,
          stepIndex: 0,
          title: l.title,
          subtitle: l.subtitle,
          tag: l.difficulty,
        });
      }

      // Search steps & concepts
      l.steps.forEach((s, idx) => {
        if (
          s.title.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.content.toLowerCase().includes(q)
        ) {
          list.push({
            category: s.keyIdea ? 'Concepts' : 'Steps',
            lessonSlug: l.slug,
            lessonTitle: l.title,
            stepIndex: idx,
            title: s.title,
            subtitle: `${l.title} · Step ${idx + 1}`,
            tag: s.type,
          });
        }
      });
    }

    return list.slice(0, 15);
  }, [query, lessons]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, results.length - 1) : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          onNavigate(selected.lessonSlug, selected.stepIndex);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onNavigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="w-full max-w-2xl bg-cream-100 dark:bg-charcoal-800 rounded-2xl shadow-2xl border border-cream-300 dark:border-charcoal-700 overflow-hidden flex flex-col max-h-[75vh]"
          >
            {/* Header / Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-cream-300 dark:border-charcoal-700 gap-3">
              <Search className="w-5 h-5 text-charcoal-500 dark:text-cream-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search Java concepts, topics, steps (e.g. CompletableFuture, G1 GC, Virtual Threads)..."
                className="flex-1 bg-transparent border-none outline-none text-base sm:text-sm text-charcoal-900 dark:text-cream-100 placeholder:text-charcoal-400 dark:placeholder:text-cream-500"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-charcoal-500 hover:bg-cream-200 dark:hover:bg-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results list */}
            <div className="overflow-y-auto p-2 space-y-1">
              {results.length === 0 ? (
                <div className="py-12 text-center text-sm text-charcoal-500 dark:text-cream-400">
                  No matching lessons or concepts found for "{query}".
                </div>
              ) : (
                results.map((res, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={`${res.lessonSlug}-${res.stepIndex}-${index}`}
                      onClick={() => {
                        onNavigate(res.lessonSlug, res.stepIndex);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      data-testid="search-result-item"
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cream-200/90 dark:bg-charcoal-700 text-charcoal-900 dark:text-cream-100'
                          : 'text-charcoal-700 dark:text-cream-300 hover:bg-cream-200/50 dark:hover:bg-charcoal-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-cream-300/60 dark:bg-charcoal-600/50 text-charcoal-700 dark:text-cream-200 flex-shrink-0">
                          {res.category === 'Lessons' && <BookOpen className="w-4 h-4" />}
                          {res.category === 'Steps' && <Layers className="w-4 h-4" />}
                          {res.category === 'Concepts' && <Sparkles className="w-4 h-4" />}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-sm truncate flex items-center gap-2">
                            <span>{res.title}</span>
                          </div>
                          {res.subtitle && (
                            <div className="text-xs text-charcoal-500 dark:text-cream-400 truncate">
                              {res.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      {res.tag && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cream-300/50 dark:bg-charcoal-600/50 text-charcoal-600 dark:text-cream-300 flex-shrink-0 ml-3 capitalize">
                          {res.tag}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer keyboard hints */}
            <div className="px-4 py-2.5 bg-cream-200/50 dark:bg-charcoal-900/60 border-t border-cream-300 dark:border-charcoal-700 text-[11px] font-mono text-charcoal-500 dark:text-cream-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
                <span>ESC to close</span>
              </div>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Java Internals
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
