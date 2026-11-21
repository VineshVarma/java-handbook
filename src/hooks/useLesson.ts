'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lesson } from '@/lib/types';

export function useLesson(allLessons: Lesson[]) {
  const [currentLessonSlug, setCurrentLessonSlug] = useState<string>(
    allLessons[0]?.slug || 'how-java-runs'
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Sync state with URL hash (#/lesson-slug/step-index)
  useEffect(() => {
    const handleHashChange = () => {
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

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [allLessons]);

  const currentLesson =
    allLessons.find((l) => l.slug === currentLessonSlug) || allLessons[0];

  const updateHash = useCallback((slug: string, stepIdx: number) => {
    window.location.hash = `#/${slug}/${stepIdx + 1}`;
  }, []);

  const goToLesson = useCallback(
    (slug: string, stepIdx: number = 0) => {
      const targetLesson = allLessons.find((l) => l.slug === slug);
      if (targetLesson) {
        setCurrentLessonSlug(slug);
        const validStep = Math.max(0, Math.min(stepIdx, targetLesson.steps.length - 1));
        setCurrentStepIndex(validStep);
        updateHash(slug, validStep);
      }
    },
    [allLessons, updateHash]
  );

  const goToStep = useCallback(
    (stepIdx: number) => {
      if (currentLesson && stepIdx >= 0 && stepIdx < currentLesson.steps.length) {
        setCurrentStepIndex(stepIdx);
        updateHash(currentLesson.slug, stepIdx);
      }
    },
    [currentLesson, updateHash]
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
