'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lesson } from '@/lib/types';

export function useLesson(allLessons: Lesson[], initialLessonSlug?: string) {
  const resolvedInitialSlug =
    initialLessonSlug && allLessons.some((l) => l.slug === initialLessonSlug)
      ? initialLessonSlug
      : allLessons[0]?.slug || 'how-java-runs';

  const [currentLessonSlug, setCurrentLessonSlug] = useState<string>(resolvedInitialSlug);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Sync state with URL changes on mount and on popstate / hashchange
  useEffect(() => {
    const handleUrlChange = () => {
      const pathMatch = window.location.pathname.match(/\/lessons\/([^/?#]+)/);
      const pathSlug =
        pathMatch && allLessons.some((l) => l.slug === pathMatch[1])
          ? pathMatch[1]
          : null;

      const hash = window.location.hash.replace(/^#\/?/, '');
      const hashParts = hash ? hash.split('/') : [];
      const hashSlug =
        hashParts[0] && allLessons.some((l) => l.slug === hashParts[0])
          ? hashParts[0]
          : null;

      const targetSlug = pathSlug || hashSlug;
      if (!targetSlug) {
        setCurrentLessonSlug(resolvedInitialSlug);
        setCurrentStepIndex(0);
        return;
      }

      const foundLesson = allLessons.find((l) => l.slug === targetSlug);
      if (!foundLesson) return;

      setCurrentLessonSlug(targetSlug);
      document.title = `${foundLesson.title} | Java Handbook`;

      if (hashParts[1] !== undefined && hashParts[1] !== '') {
        const parsed = parseInt(hashParts[1], 10);
        if (!isNaN(parsed)) {
          const clamped = Math.max(
            0,
            Math.min(parsed - 1, foundLesson.steps.length - 1)
          );
          setCurrentStepIndex(clamped);
        } else {
          setCurrentStepIndex(0);
        }
      } else {
        setCurrentStepIndex(0);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [allLessons, resolvedInitialSlug]);

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
