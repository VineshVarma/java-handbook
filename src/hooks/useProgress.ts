'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lesson, CourseProgress } from '@/lib/types';

const STORAGE_KEY = 'java_internals_progress_v1';

export function useProgress(allLessons: Lesson[]) {
  const [progress, setProgress] = useState<CourseProgress>({
    completedSteps: {},
    currentLessonSlug: 'how-java-runs',
    currentStepIndex: 0,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
  }, []);

  const saveProgress = useCallback((newProgress: CourseProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  }, []);

  const markStepComplete = useCallback(
    (lessonSlug: string, stepIndex: number) => {
      setProgress((prev) => {
        const existing = prev.completedSteps[lessonSlug] || [];
        if (existing.includes(stepIndex)) return prev;

        const updated = {
          ...prev,
          completedSteps: {
            ...prev.completedSteps,
            [lessonSlug]: [...existing, stepIndex],
          },
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save progress', e);
        }
        return updated;
      });
    },
    []
  );

  const isStepComplete = useCallback(
    (lessonSlug: string, stepIndex: number): boolean => {
      return (progress.completedSteps[lessonSlug] || []).includes(stepIndex);
    },
    [progress]
  );

  const isLessonComplete = useCallback(
    (lesson: Lesson): boolean => {
      const completed = progress.completedSteps[lesson.slug] || [];
      return lesson.steps.length > 0 && completed.length >= lesson.steps.length;
    },
    [progress]
  );

  const getCompletedLessonsCount = useCallback((): number => {
    return allLessons.filter((l) => isLessonComplete(l)).length;
  }, [allLessons, isLessonComplete]);

  return {
    progress,
    markStepComplete,
    isStepComplete,
    isLessonComplete,
    completedLessonsCount: getCompletedLessonsCount(),
    totalLessonsCount: allLessons.length,
  };
}
