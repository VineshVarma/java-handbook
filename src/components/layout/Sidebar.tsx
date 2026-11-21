'use client';

import React, { useState } from 'react';
import { Module } from '@/lib/types';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  modules: Module[];
  currentLessonSlug: string;
  onLessonSelect: (slug: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isLessonComplete: (slug: string) => boolean;
  completedLessonsCount: number;
  totalLessonsCount: number;
}

export function Sidebar({
  modules,
  currentLessonSlug,
  onLessonSelect,
  isOpen,
  onClose,
  isLessonComplete,
  completedLessonsCount,
  totalLessonsCount,
}: SidebarProps) {
  // Track open modules. Keep the module containing active lesson open by default.
  const activeModule = modules.find((m) =>
    m.lessons.some((l) => l.slug === currentLessonSlug)
  );

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      modules.forEach((m) => {
        initial[m.id] = m.id === (activeModule?.id || modules[0]?.id);
      });
      return initial;
    }
  );

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const progressPercent =
    totalLessonsCount > 0
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
      : 0;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-950/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-72 bg-cream-100 dark:bg-charcoal-900 border-r border-cream-300 dark:border-charcoal-700 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Course Header */}
        <div className="px-5 py-4 border-b border-cream-300 dark:border-charcoal-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-charcoal-700 dark:text-cream-300">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Curriculum</span>
          </div>
          <span className="text-xs font-mono text-charcoal-500 dark:text-cream-400">
            {totalLessonsCount} lessons
          </span>
        </div>

        {/* Modules Accordion List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs">
          {modules.map((mod) => {
            const isExpanded = expandedModules[mod.id] ?? true;
            const completedInModule = mod.lessons.filter((l) =>
              isLessonComplete(l.slug)
            ).length;

            return (
              <div
                key={mod.id}
                className="rounded-xl overflow-hidden border border-cream-300/60 dark:border-charcoal-800 bg-cream-50/50 dark:bg-charcoal-800/40"
              >
                {/* Module title header */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between p-2.5 text-left font-semibold text-charcoal-800 dark:text-cream-200 hover:bg-cream-200/50 dark:hover:bg-charcoal-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isExpanded ? (
                      <FolderOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-charcoal-500 dark:text-cream-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{mod.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <span className="font-mono text-[11px] text-charcoal-500 dark:text-cream-400">
                      {completedInModule}/{mod.lessons.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
                    )}
                  </div>
                </button>

                {/* Lessons in module */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden bg-cream-100/50 dark:bg-charcoal-900/40"
                    >
                      <div className="p-1 space-y-0.5">
                        {mod.lessons.map((lesson) => {
                          const isActive = lesson.slug === currentLessonSlug;
                          const isDone = isLessonComplete(lesson.slug);

                          return (
                            <button
                              key={lesson.slug}
                              onClick={() => {
                                onLessonSelect(lesson.slug);
                                onClose();
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all ${
                                isActive
                                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                                  : 'text-charcoal-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-charcoal-700'
                              }`}
                            >
                              <span className="truncate pr-2">{lesson.title}</span>

                              {isDone && (
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 flex-shrink-0 ${
                                    isActive
                                      ? 'text-white'
                                      : 'text-emerald-600 dark:text-emerald-400'
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Progress Bar */}
        <div className="p-4 border-t border-cream-300 dark:border-charcoal-700 bg-cream-200/40 dark:bg-charcoal-900">
          <div className="flex items-center justify-between text-xs font-mono text-charcoal-600 dark:text-cream-300 mb-1.5 font-semibold">
            <span>PROGRESS</span>
            <span>
              {completedLessonsCount} / {totalLessonsCount} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-cream-300 dark:bg-charcoal-700 overflow-hidden">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-sans text-charcoal-500 dark:text-cream-400 mt-1.5 block">
            Progress saved locally in browser
          </span>
        </div>
      </aside>
    </>
  );
}
