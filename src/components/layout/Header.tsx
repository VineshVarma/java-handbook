'use client';

import React from 'react';
import { Coffee, Search, Menu, X, BookOpen, Target, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  onSearchOpen: () => void;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onShowToast: (msg: string) => void;
}

export function Header({
  onSearchOpen,
  onMenuToggle,
  isMenuOpen,
  onShowToast,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-cream-100/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-cream-300 dark:border-charcoal-700 px-4 flex items-center justify-between transition-colors">
      {/* Left: Mobile hamburger + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-charcoal-700 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <a
          href="#/"
          className="flex items-center gap-2 text-charcoal-900 dark:text-cream-100 group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Coffee className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold text-sm tracking-tight flex items-center gap-1.5">
              Java Internals
              <span className="text-[10px] uppercase px-1.5 py-0.2 font-sans font-semibold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Course
              </span>
            </span>
          </div>
        </a>
      </div>

      {/* Center: Tabs matching designed-to-scale */}
      <nav className="hidden md:flex items-center gap-1 bg-cream-200/60 dark:bg-charcoal-800 p-1 rounded-xl border border-cream-300/80 dark:border-charcoal-700 text-xs font-medium">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white shadow-sm font-semibold transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Learn</span>
        </button>

        <button
          onClick={() =>
            onShowToast(
              'Practice is coming soon — hands-on Java JVM tuning & concurrent coding challenges!'
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-charcoal-700 dark:text-cream-300 hover:bg-cream-300/60 dark:hover:bg-charcoal-700 transition-colors"
        >
          <Target className="w-3.5 h-3.5 text-charcoal-500 dark:text-cream-400" />
          <span>Practice</span>
        </button>

        <button
          onClick={() =>
            onShowToast(
              'Cheatsheets are coming soon — quick reference cards for Collections, CompletableFuture, and GC flags!'
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-charcoal-700 dark:text-cream-300 hover:bg-cream-300/60 dark:hover:bg-charcoal-700 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-charcoal-500 dark:text-cream-400" />
          <span>Cheatsheets</span>
        </button>
      </nav>

      {/* Right: Search + Theme Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cream-300 dark:border-charcoal-700 bg-cream-50 dark:bg-charcoal-800 text-charcoal-600 dark:text-cream-300 text-xs hover:border-cream-400 dark:hover:border-charcoal-600 transition-colors shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-charcoal-400 dark:text-cream-400" />
          <span className="hidden sm:inline">Search lessons...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-cream-200 dark:bg-charcoal-700 text-charcoal-600 dark:text-cream-300 border border-cream-300 dark:border-charcoal-600">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
