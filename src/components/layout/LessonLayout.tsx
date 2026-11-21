'use client';

import React, { useState } from 'react';
import { modules, allLessons } from '@/data/lessons';
import { useLesson } from '@/hooks/useLesson';
import { useProgress } from '@/hooks/useProgress';
import { useKeyboard } from '@/hooks/useKeyboard';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { LessonView } from '@/components/lesson/LessonView';
import { StepContent } from '@/components/lesson/StepContent';
import { SearchDialog } from '@/components/ui/SearchDialog';
import { Toast } from '@/components/ui/Toast';

export function LessonLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    currentLesson,
    currentStepIndex,
    currentStep,
    goToLesson,
    goToStep,
    nextStep,
    prevStep,
    hasNext,
    hasPrev,
  } = useLesson(allLessons);

  const {
    progress,
    markStepComplete,
    isLessonComplete,
    completedLessonsCount,
    totalLessonsCount,
  } = useProgress(allLessons);

  // Keyboard navigation
  useKeyboard({
    onNext: () => {
      markStepComplete(currentLesson.slug, currentStepIndex);
      nextStep();
    },
    onPrev: prevStep,
    onReplay: () => {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    },
    onTogglePlay: () => setIsPlaying((p) => !p),
    onSearch: () => setSearchOpen(true),
  });

  const currentLessonIndex = allLessons.findIndex((l) => l.slug === currentLesson.slug);
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : undefined;

  const nextStepTitle =
    currentStepIndex < currentLesson.steps.length - 1
      ? currentLesson.steps[currentStepIndex + 1]?.title
      : nextLesson
      ? `${nextLesson.title} →`
      : 'Finish Course';

  const handleNextWithProgress = () => {
    markStepComplete(currentLesson.slug, currentStepIndex);
    nextStep();
  };

  const completedStepsInCurrentLesson =
    progress.completedSteps[currentLesson.slug] || [];

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 dark:bg-charcoal-950 text-charcoal-900 dark:text-cream-100 selection:bg-emerald-500/20">
      {/* Top Navigation */}
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onMenuToggle={() => setSidebarOpen((p) => !p)}
        isMenuOpen={sidebarOpen}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      {/* Main 3-Column Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Left Curriculum Sidebar */}
        <Sidebar
          modules={modules}
          currentLessonSlug={currentLesson.slug}
          onLessonSelect={(slug) => goToLesson(slug, 0)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isLessonComplete={(slug) => {
            const l = allLessons.find((item) => item.slug === slug);
            return l ? isLessonComplete(l) : false;
          }}
          completedLessonsCount={completedLessonsCount}
          totalLessonsCount={totalLessonsCount}
        />

        {/* Content Area offset by sidebar on desktop */}
        <main className="flex-1 lg:pl-72 flex flex-col xl:flex-row overflow-hidden">
          {/* Column 2: Center Interactive Simulation Stage */}
          <section className="flex-1 h-full min-h-[500px] xl:min-h-0 flex flex-col overflow-hidden">
            <LessonView
              lesson={currentLesson}
              currentStepIndex={currentStepIndex}
              onStepClick={(idx) => {
                markStepComplete(currentLesson.slug, currentStepIndex);
                goToStep(idx);
              }}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              onReplay={() => {
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 100);
              }}
              completedStepIndices={completedStepsInCurrentLesson}
            />
          </section>

          {/* Column 3: Right Educational Reading Card */}
          <aside className="w-full xl:w-[440px] xl:flex-shrink-0 h-[600px] xl:h-full overflow-hidden border-t xl:border-t-0">
            <StepContent
              step={currentStep}
              stepIndex={currentStepIndex}
              totalSteps={currentLesson.steps.length}
              onNext={handleNextWithProgress}
              onPrev={prevStep}
              hasNext={hasNext}
              hasPrev={hasPrev}
              nextStepTitle={nextStepTitle}
              youllLearn={currentLesson.youllLearn}
            />
          </aside>
        </main>
      </div>

      {/* ⌘K Global Search Dialog */}
      <SearchDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        lessons={allLessons}
        onNavigate={(slug, stepIdx) => goToLesson(slug, stepIdx)}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage || ''}
        isVisible={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
