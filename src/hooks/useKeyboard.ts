'use client';

import { useEffect } from 'react';

interface KeyboardCallbacks {
  onNext?: () => void;
  onPrev?: () => void;
  onReplay?: () => void;
  onTogglePlay?: () => void;
  onSearch?: () => void;
}

export function useKeyboard({
  onNext,
  onPrev,
  onReplay,
  onTogglePlay,
  onSearch,
}: KeyboardCallbacks) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Cmd+K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onSearch?.();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext?.();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev?.();
      } else if (e.key.toLowerCase() === 'r') {
        onReplay?.();
      } else if (e.key === ' ') {
        e.preventDefault();
        onTogglePlay?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onReplay, onTogglePlay, onSearch]);
}
