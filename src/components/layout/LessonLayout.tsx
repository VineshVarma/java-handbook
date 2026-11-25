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
import { Layers, BookOpen } from 'lucide-react';

export function LessonLayout({
  initialLessonSlug,
}: {
  initialLessonSlug?: string;
} = {}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'diagram' | 'content'>('diagram');

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
  } = useLesson(allLessons, initialLessonSlug);

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

  const isLastLesson = currentLessonIndex === allLessons.length - 1;
  const isLastStep = currentStepIndex === currentLesson.steps.length - 1;
  const isCourseComplete = isLastLesson && isLastStep;

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

  const handleFinishCourse = () => {
    markStepComplete(currentLesson.slug, currentStepIndex);
    goToLesson(allLessons[0].slug, 0);
    setToastMessage(`🎉 Congratulations! You completed all ${totalLessonsCount} lessons of the Java Handbook!`);
  };

  const completedStepsInCurrentLesson =
    progress.completedSteps[currentLesson.slug] || [];

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col bg-cream-100 dark:bg-charcoal-950 text-charcoal-900 dark:text-cream-100 selection:bg-emerald-500/20 pb-[env(safe-area-inset-bottom)]">
      {/* Top Navigation Bar */}
      <Header
        onSearchOpen={() => setSearchOpen(true)}
        onMenuToggle={() => setSidebarOpen((p) => !p)}
        isMenuOpen={sidebarOpen}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      {/* Main Studio Layout */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Column 1: Left Curriculum Sidebar (Fixed / Slide-over on mobile) */}
        <Sidebar
          modules={modules}
          currentLessonSlug={currentLesson.slug}
          onLessonSelect={(slug) => {
            goToLesson(slug, 0);
            setSidebarOpen(false);
          }}
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
        <main className="flex-1 min-w-0 lg:pl-72 flex flex-col h-full min-h-0 overflow-hidden relative">
          {/* Mobile & Tablet Segmented View Switcher (Visible only below xl) */}
          <div className="flex xl:hidden items-center justify-between px-3 py-2 bg-cream-200/90 dark:bg-charcoal-900 border-b border-cream-300 dark:border-charcoal-800 flex-shrink-0 z-20">
            <div
              role="tablist"
              aria-label="Workspace view panes"
              className="flex items-center gap-1 p-0.5 rounded-xl bg-cream-300/60 dark:bg-charcoal-800 text-xs font-mono"
            >
              <button
                onClick={() => setMobileTab('diagram')}
                role="tab"
                id="tab-diagram"
                aria-selected={mobileTab === 'diagram'}
                aria-controls="diagram-pane"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  mobileTab === 'diagram'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-charcoal-700 dark:text-cream-300 hover:text-emerald-600'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Diagram</span>
              </button>
              <button
                onClick={() => setMobileTab('content')}
                role="tab"
                id="tab-notes"
                aria-selected={mobileTab === 'content'}
                aria-controls="notes-pane"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  mobileTab === 'content'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-charcoal-700 dark:text-cream-300 hover:text-emerald-600'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-charcoal-600 dark:text-cream-400 font-semibold">
              Step {currentStepIndex + 1}/{currentLesson.steps.length}
            </div>
          </div>

          {/* Main 2-Pane Workspace: Side-by-Side on Desktop, Tabbed on Mobile */}
          <div className="flex-1 min-h-0 flex flex-col xl:flex-row overflow-hidden">
            {/* Column 2: Center Interactive Simulation Stage */}
            <section
              id="diagram-pane"
              role="tabpanel"
              aria-labelledby="tab-diagram"
              className={`${
                mobileTab === 'diagram' ? 'flex' : 'hidden'
              } xl:flex flex-1 h-full min-h-0 flex-col overflow-hidden relative`}
            >
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

            {/* Column 3: Educational Reading Card */}
            <aside
              id="notes-pane"
              role="tabpanel"
              aria-labelledby="tab-notes"
              className={`${
                mobileTab === 'content' ? 'flex' : 'hidden'
              } xl:flex w-full xl:w-[420px] 2xl:w-[460px] xl:flex-shrink-0 h-full min-h-0 flex-col overflow-hidden border-t xl:border-t-0 border-l border-cream-300 dark:border-charcoal-700 bg-cream-50/70 dark:bg-charcoal-900/60`}
            >
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
                isCourseComplete={isCourseComplete}
                onCompleteCourse={handleFinishCourse}
              />
            </aside>
          </div>

          {/* Floating Mobile Peek Quick Toggle (Bottom-Right on mobile, raised above step progress & nav) */}
          <div className="xl:hidden fixed bottom-28 right-4 z-30">
            <button
              onClick={() =>
                setMobileTab((prev) => (prev === 'diagram' ? 'content' : 'diagram'))
              }
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all border border-emerald-500/40"
              data-testid="mobile-toggle-tab"
              aria-label={mobileTab === 'diagram' ? 'Switch to Notes' : 'Switch to Diagram'}
            >
              {mobileTab === 'diagram' ? (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Notes</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Diagram</span>
                </>
              )}
            </button>
          </div>
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
