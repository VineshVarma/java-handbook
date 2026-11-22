'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lesson } from '@/lib/types';

export function useLesson(allLessons: Lesson[], initialLessonSlug?: string) {
  const [currentLessonSlug, setCurrentLessonSlug] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      // Check pathname first: /lessons/xxx
      const pathMatch = window.location.pathname.match(/\/lessons\/([^/?#]+)/);
      if (pathMatch && allLessons.some((l) => l.slug === pathMatch[1])) {
        return pathMatch[1];
      }
      // Check legacy hash: #/xxx
      const hash = window.location.hash.replace(/^#\/?/, '').split('/')[0];
      if (hash && allLessons.some((l) => l.slug === hash)) {
        return hash;
      }
    }
    return initialLessonSlug && allLessons.some((l) => l.slug === initialLessonSlug)
      ? initialLessonSlug
      : allLessons[0]?.slug || 'how-java-runs';
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').split('/');
      if (hash[1]) {
        const step = parseInt(hash[1], 10) - 1;
        if (!isNaN(step) && step >= 0) return step;
      }
    }
    return 0;
  });

  // Sync state with URL changes (both popstate for path routing and hashchange)
  useEffect(() => {
    const handleUrlChange = () => {
      // 1. Check path /lessons/slug
      const pathMatch = window.location.pathname.match(/\/lessons\/([^/?#]+)/);
      if (pathMatch) {
        const slug = pathMatch[1];
        const found = allLessons.find((l) => l.slug === slug);
        if (found) {
          setCurrentLessonSlug(slug);
          return;
        }
      }

      // 2. Check hash #/slug/step
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash) {
        const parts = hash.split('/');
        const slug = parts[0];
        const step = parts[1] ? parseInt(parts[1], 10) - 1 : 0;

        const foundLesson = allLessons.find((l) => l.slug === slug);
        if (foundLesson) {
          setCurrentLessonSlug(slug);
          if (!isNaN(step) && step >= 0 && step < foundLesson.steps.length) {
            setCurrentStepIndex(step);
          } else {
            setCurrentStepIndex(0);
          }
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [allLessons]);

  const currentLesson =
    allLessons.find((l) => l.slug === currentLessonSlug) || allLessons[0];

  const updateUrl = useCallback((slug: string, stepIdx: number) => {
    if (typeof window !== 'undefined') {
      const targetUrl = `/lessons/${slug}`;
      if (window.location.pathname !== targetUrl) {
        window.history.pushState(null, '', targetUrl);
      }
      const found = allLessons.find((l) => l.slug === slug);
      if (found) {
        document.title = `${found.title} | Java Handbook`;
      }
    }
  }, [allLessons]);

  const goToLesson = useCallback(
    (slug: string, stepIdx: number = 0) => {
      const targetLesson = allLessons.find((l) => l.slug === slug);
      if (targetLesson) {
        setCurrentLessonSlug(slug);
        const validStep = Math.max(0, Math.min(stepIdx, targetLesson.steps.length - 1));
        setCurrentStepIndex(validStep);
        updateUrl(slug, validStep);
      }
    },
    [allLessons, updateUrl]
  );

  const goToStep = useCallback(
    (stepIdx: number) => {
      if (currentLesson && stepIdx >= 0 && stepIdx < currentLesson.steps.length) {
        setCurrentStepIndex(stepIdx);
      }
    },
    [currentLesson]
  );

  const nextStep = useCallback(() => {
    if (!currentLesson) return;
    if (currentStepIndex < currentLesson.steps.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      // Find next lesson
      const currentIndex = allLessons.findIndex((l) => l.slug === currentLesson.slug);
      if (currentIndex < allLessons.length - 1) {
        goToLesson(allLessons[currentIndex + 1].slug, 0);
      }
    }
  }, [currentLesson, currentStepIndex, allLessons, goToStep, goToLesson]);

  const prevStep = useCallback(() => {
    if (!currentLesson) return;
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    } else {
      // Find previous lesson
      const currentIndex = allLessons.findIndex((l) => l.slug === currentLesson.slug);
      if (currentIndex > 0) {
        const prevLesson = allLessons[currentIndex - 1];
        goToLesson(prevLesson.slug, prevLesson.steps.length - 1);
      }
    }
  }, [currentLesson, currentStepIndex, allLessons, goToStep, goToLesson]);

  return {
    currentLesson,
    currentStepIndex,
    currentStep: currentLesson?.steps[currentStepIndex] || currentLesson?.steps[0],
    goToLesson,
    goToStep,
    nextStep,
    prevStep,
    hasNext:
      Boolean(currentLesson) &&
      (currentStepIndex < currentLesson.steps.length - 1 ||
        allLessons.findIndex((l) => l.slug === currentLesson.slug) < allLessons.length - 1),
    hasPrev:
      Boolean(currentLesson) &&
      (currentStepIndex > 0 ||
        allLessons.findIndex((l) => l.slug === currentLesson.slug) > 0),
  };
}
