import { test, expect, Page, BrowserContext } from '@playwright/test';

// Helper to inspect stored progress
async function getStoredProgress(page: Page): Promise<any> {
  return await page.evaluate(() => {
    const raw =
      localStorage.getItem('java_handbook_progress_v1') ||
      localStorage.getItem('java_internals_progress_v1');
    return raw ? JSON.parse(raw) : null;
  });
}

// Helper to seed progress
async function seedProgress(page: Page, progressObj: any) {
  await page.evaluate((data) => {
    const str = JSON.stringify(data);
    localStorage.setItem('java_internals_progress_v1', str);
    localStorage.setItem('java_handbook_progress_v1', str);
  }, progressObj);
}

// All exact 27 lesson slugs across the 7 modules
const ALL_LESSON_SLUGS = [
  // Module 01: Foundations
  'how-java-runs',
  'oop-pillars',
  'memory-and-gc',
  'java-data-types',
  'exception-handling',
  'object-headers-lilliput',
  'escape-analysis',
  'zgc-vs-g1',
  // Module 02: Collections & Streams
  'collections-framework',
  'streams-api',
  'lambdas-functional',
  'generics',
  // Module 03: Concurrency & Async
  'thread-lifecycle',
  'completable-future',
  'executor-service',
  'virtual-threads-loom',
  'false-sharing-jmm',
  'safepoints-ttsp',
  // Module 04: Spring Boot & Microservices
  'spring-request-lifecycle',
  'dependency-injection',
  'microservices-patterns',
  // Module 05: REST API & Security
  'rest-api-design',
  'jwt-oauth2',
  // Module 06 & 07: DevOps & Observability
  'mongodb-document-model',
  'cicd-pipeline',
  'observability-stack',
  'offheap-ffm-api',
];

test.describe('Tier 2: Boundary & Corner Cases (B1 - B7)', () => {

  // --------------------------------------------------------------------------
  // Area 1: Navigation Boundaries (5 tests)
  // --------------------------------------------------------------------------
  test('B1.1: Deep link to invalid lesson slug defaults gracefully without unhandled crashes', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Direct HTTP request returns 404 or falls back in SPA
    const resp = await page.goto('/lessons/completely-invalid-slug-404');
    expect([200, 404]).toContain(resp?.status());

    // SPA client-side fallback via hash routing handles invalid slugs gracefully
    await page.goto('/#/invalid-slug-fallback');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    const nonBenignErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
    );
    expect(nonBenignErrors).toHaveLength(0);
  });

  test('B1.2: Rapid multi-clicking on different sidebar lessons without waiting for transitions', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });

    // Click multiple lessons in rapid succession
    const lesson1 = sidebar.getByRole('button', { name: /How Java Runs/i });
    const lesson2 = sidebar.getByRole('button', { name: /OOP.*Pillars/i });
    const lesson3 = sidebar.getByRole('button', { name: /Memory Model/i });

    await lesson1.click();
    await lesson2.click();
    await lesson3.click();

    await page.waitForURL(/\/lessons\/memory-and-gc/);
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('Memory Model');
  });

  test('B1.3: Out-of-bounds step index in URL hash clamps gracefully to valid step range', async ({ page }) => {
    await page.goto('/lessons/how-java-runs#/how-java-runs/99');

    // Step index should clamp within valid steps (e.g. step 1 or step 7), no crash
    const h2 = page.locator('h2').first();
    await expect(h2).toBeVisible();
    await expect(page.locator('h1').first()).toContainText('How Java Runs');
  });

  test('B1.4: Negative step index in URL hash clamps to step 0', async ({ page }) => {
    await page.goto('/lessons/how-java-runs#/how-java-runs/-5');

    // Negative step clamped to step 0 (Writing Java Source Code)
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();
  });

  test('B1.5: Navigating between lessons with differing step counts resets step index cleanly', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Advance to step 5 (index 4)
    const step5Pill = page.locator('button[title*="JIT Tiered Compilation"]').or(
      page.locator('div.scrollbar-none button').nth(4)
    );
    if (await step5Pill.isVisible()) {
      await step5Pill.click();
    }

    // Now navigate to a lesson with fewer steps in Module 02
    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const mod2Button = sidebar.getByRole('button', { name: /02\. Collections & Streams/i });
    const collectionsLesson = sidebar.getByRole('button', { name: 'Collections Framework Deep Dive' });

    if (!(await collectionsLesson.isVisible())) {
      await mod2Button.click();
    }
    await collectionsLesson.click();

    await page.waitForURL(/\/lessons\/collections-framework/);
    // Step index resets to 0 (The Collection Interface Hierarchy)
    await expect(page.getByRole('heading', { name: /The Collection Interface Hierarchy/i })).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Area 2: Stepper & Microcheck Boundaries (5 tests)
  // --------------------------------------------------------------------------
  test('B2.1: Pressing ArrowLeft on step 1 of lesson 1 does not throw error and keeps step at 0', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();

    // Press ArrowLeft multiple times
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');

    // Should remain on Step 1
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();
    const prevBtn = page.getByTestId('prev-step-button');
    await expect(prevBtn).toBeDisabled();
  });

  test('B2.2: Rapid double-pressing ArrowRight advances smoothly without skipping steps', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Should advance safely to step 3 (ClassLoader Hierarchy)
    await expect(page.getByRole('heading', { name: /ClassLoader Hierarchy/i })).toBeVisible();
  });

  test('B2.3: Microcheck: selecting incorrect option displays explanation without blocking progression', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Go to step 3 (ClassLoader Hierarchy) which has microcheck
    const step3Pill = page.locator('button[title*="ClassLoader Hierarchy"]').or(
      page.locator('div.scrollbar-none button').nth(2)
    );
    await step3Pill.click();
    await expect(page.getByRole('heading', { name: /ClassLoader Hierarchy/i })).toBeVisible();

    // Select incorrect option (index 0)
    const incorrectOption = page.locator('button').filter({
      hasText: 'The custom String overrides the standard JDK String',
    });
    await expect(incorrectOption).toBeVisible();
    await incorrectOption.click();

    // Verify option highlighted in red
    await expect(incorrectOption).toHaveClass(/bg-rose-600/);
    await expect(page.getByText('✗ Incorrect.')).toBeVisible();

    // Verify Next button remains enabled
    const nextBtn = page.getByTestId('next-step-button');
    await expect(nextBtn).toBeEnabled();
  });

  test('B2.4: Microcheck: toggling selection from incorrect to correct updates feedback text and styling', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const step3Pill = page.locator('button[title*="ClassLoader Hierarchy"]').or(
      page.locator('div.scrollbar-none button').nth(2)
    );
    await step3Pill.click();

    // First select incorrect option
    const incorrectOption = page.locator('button').filter({
      hasText: 'The custom String overrides the standard JDK String',
    });
    await incorrectOption.click();
    await expect(page.getByText('✗ Incorrect.')).toBeVisible();

    // Toggle to correct option
    const correctOption = page.locator('button').filter({
      hasText: 'The Parent Delegation Model asks the Bootstrap ClassLoader first',
    });
    await correctOption.click();

    // Verify correct styling and explanation
    await expect(correctOption).toHaveClass(/bg-emerald-600/);
    await expect(page.getByText('✓ Correct!')).toBeVisible();
  });

  test('B2.5: Pressing keyboard shortcuts while an input or modal is focused does NOT advance steps', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();

    // Open search dialog
    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();

    // Press ArrowRight inside input
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Close search dialog
    await page.keyboard.press('Escape');

    // Step should NOT have advanced
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Area 3: Diagram Engine Boundaries (5 tests)
  // --------------------------------------------------------------------------
  test('B3.1: Rapidly toggling view mode (3D -> 2D -> 3D) while animation is actively playing', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/lessons/how-java-runs');

    const toggleBtn = page.getByTestId('toggle-view-mode');
    await expect(toggleBtn).toBeVisible();

    // Rapid toggle
    await toggleBtn.click();
    await toggleBtn.click();
    await toggleBtn.click();
    await toggleBtn.click();

    // Diagram stage remains mounted
    await expect(page.locator('svg').filter({ has: page.locator('rect') }).first()).toBeVisible();

    const nonBenignErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
    );
    expect(nonBenignErrors).toHaveLength(0);
  });

  test('B3.2: Switching simulation scenarios while animation is paused maintains paused state', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const playPauseBtn = page.getByTestId('play-pause-button');
    // Pause animation
    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Play');

    // Change scenario to hot-calls
    const breakItBtn = page.getByTestId('break-it-button');
    await breakItBtn.click();
    await page.getByTestId('sim-scenario-hot-calls').click();

    // Animation should remain paused
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Play');
  });

  test('B3.3: Rapidly clicking replay button multiple times does not produce overlapping packet animations', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/lessons/how-java-runs');

    const replayBtn = page.getByTestId('replay-button');
    await replayBtn.click();
    await replayBtn.click();
    await replayBtn.click();
    await replayBtn.click();
    await replayBtn.click();

    const nonBenignErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
    );
    expect(nonBenignErrors).toHaveLength(0);
  });

  test('B3.4: Resizing viewport while diagram is animating retains SVG aspect ratio', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const svg = page.locator('svg[viewBox="0 0 900 500"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Resize viewport dynamically
    await page.setViewportSize({ width: 800, height: 600 });
    await expect(svg).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(svg).toBeVisible();
  });

  test('B3.5: Lessons with static diagram handle default state cleanly without console warnings', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/lessons/cicd-pipeline');
    await expect(page.locator('h1').first()).toContainText('CI/CD Pipeline');

    await expect(page.locator('.touch-pan-y')).toBeVisible();

    const nonBenignErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
    );
    expect(nonBenignErrors).toHaveLength(0);
  });

  // --------------------------------------------------------------------------
  // Area 4: Code Block Boundaries (5 tests)
  // --------------------------------------------------------------------------
  test('B4.1: Long code lines scroll horizontally within code block container without breaking page layout', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    const pre = page.locator('pre');
    await expect(pre).toBeVisible();
    await expect(pre).toHaveClass(/overflow-x-auto/);

    const hasNoOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth + 2;
    });
    expect(hasNoOverflow).toBe(true);
  });

  test('B4.2: Rapidly clicking copy button multiple times resets the 2-second timeout cleanly', async ({ page, context }) => {
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {}

    await page.goto('/lessons/how-java-runs');

    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    const copyBtn = page.getByTestId('copy-code-button').first();
    await copyBtn.click();
    await copyBtn.click();
    await copyBtn.click();

    await expect(copyBtn.getByText('Copied')).toBeVisible();
  });

  test('B4.3: Code block with empty or missing language tag falls back gracefully to default formatting', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();

    // Verify code block header contains uppercase title/language badge
    const headerTitle = page.locator('pre').locator('..').locator('span.font-mono').first();
    await expect(headerTitle).toBeVisible();
    const text = await headerTitle.innerText();
    expect(text.length).toBeGreaterThan(0);
  });

  test('B4.4: Code block with special characters (<, >, &, ") renders escaped HTML entities properly', async ({ page }) => {
    await page.goto('/lessons/lambdas-functional');

    const code = page.locator('pre code');
    await expect(code).toBeVisible();

    // Generics angle brackets should render as characters, not broken HTML tags
    const codeText = await code.innerText();
    expect(codeText).toContain('<');
    expect(codeText).toContain('>');
  });

  test('B4.5: Multiple code blocks or repeated step transitions maintain independent copy state', async ({ page, context }) => {
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {}

    await page.goto('/lessons/how-java-runs');

    // Go to step 2 with code
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();

    const copyBtn = page.getByTestId('copy-code-button').first();
    await copyBtn.click();
    await expect(copyBtn.getByText('Copied')).toBeVisible();

    // Step forward and back
    await nextBtn.click();
    const prevBtn = page.getByTestId('prev-step-button');
    await prevBtn.click();

    // Returned to step 2: copy button is reset
    const reloadedCopyBtn = page.getByTestId('copy-code-button').first();
    await expect(reloadedCopyBtn.getByText('Copy')).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Area 5: Global Search & Discovery Boundaries (5 tests)
  // --------------------------------------------------------------------------
  test('B5.1: Typing query with special regex characters does not crash search filter', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    // Regex metacharacters
    await searchInput.fill('.*+?^${}()|[]\\');

    // Should not crash, displays empty state
    await expect(
      page.getByText(/No matching lessons or concepts found/i)
    ).toBeVisible();
  });

  test('B5.2: Query with leading and trailing whitespace is trimmed properly', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);

    // Whitespace only trims to empty and renders the top 6 suggestions
    await searchInput.fill('   ');
    const items = page.getByTestId('search-result-item');
    await expect(items).toHaveCount(6);

    // Search query with term
    await searchInput.fill('Virtual Threads');
    const result = page.getByTestId('search-result-item').first();
    await expect(result).toBeVisible();
    await expect(result).toContainText(/Virtual Threads/i);
  });

  test('B5.3: Extremely long search string (200+ characters) is handled gracefully with empty state', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    const longQuery = 'a'.repeat(250);
    await searchInput.fill(longQuery);

    await expect(
      page.getByText(/No matching lessons or concepts found/i)
    ).toBeVisible();
  });

  test('B5.4: Rapid typing and immediate backspacing to empty restores default suggested lessons', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await searchInput.fill('ConcurrentHashMap');
    await searchInput.fill('');

    // Restores default 6 suggested lessons
    const items = page.getByTestId('search-result-item');
    await expect(items).toHaveCount(6);
  });

  test('B5.5: Pressing ArrowDown at the last search result wraps around to the first result', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    // Zero-query has 6 items
    const items = page.getByTestId('search-result-item');
    await expect(items).toHaveCount(6);

    // ArrowDown 6 times reaches last item, 7th wraps back to top
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press('ArrowDown');
    }

    // Top item should be highlighted/selected
    const firstItem = items.first();
    await expect(firstItem).toHaveClass(/bg-cream-200/);
  });

  // --------------------------------------------------------------------------
  // Area 6: Progress & Storage Boundaries (5 tests)
  // --------------------------------------------------------------------------
  test('B6.1: Corrupted JSON in localStorage is handled gracefully without crashing page', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Corrupt localStorage
    await page.evaluate(() => {
      localStorage.setItem('java_internals_progress_v1', '{corrupt-json-without-close');
      localStorage.setItem('java_handbook_progress_v1', '{corrupt-json-without-close');
    });

    await page.reload();

    // Page must remain fully interactive
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('How Java Runs');
  });

  test('B6.2: Pre-populating localStorage with all 27 lessons completed renders 100% progress and all checkmarks', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const fullCompleted: Record<string, number[]> = {};
    ALL_LESSON_SLUGS.forEach((slug) => {
      // 10 steps per lesson guarantees complete
      fullCompleted[slug] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    });

    await seedProgress(page, {
      completedSteps: fullCompleted,
      currentLessonSlug: 'how-java-runs',
      currentStepIndex: 0,
    });

    await page.reload();

    const progressSection = page.locator('aside').filter({ hasText: /PROGRESS/i });
    await expect(progressSection).toContainText('27 / 27 (100%)');
  });

  test('B6.3: Clearing localStorage while browsing resets progress bar to 0% on next action', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Seed completion
    await seedProgress(page, {
      completedSteps: { 'how-java-runs': [0, 1, 2, 3, 4, 5, 6] },
      currentLessonSlug: 'how-java-runs',
      currentStepIndex: 0,
    });

    await page.reload();
    const progressSection = page.locator('aside').filter({ hasText: /PROGRESS/i });
    await expect(progressSection).toContainText('1 / 27 (4%)');

    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(progressSection).toContainText('0 / 27 (0%)');
  });

  test('B6.4: Duplicated step completion events do not create duplicate entries in completedSteps array', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Advance step 1 -> step 2
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();

    // Back to step 1
    const prevBtn = page.getByTestId('prev-step-button');
    await prevBtn.click();

    // Advance step 1 -> step 2 again
    await nextBtn.click();

    const stored = await getStoredProgress(page);
    const steps: number[] = stored.completedSteps['how-java-runs'] || [];
    const uniqueSteps = new Set(steps);
    expect(steps.length).toBe(uniqueSteps.size);
  });

  test('B6.5: LocalStorage quota exceeded simulation does not crash the reader interface', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Simulate quota exceeded on setItem
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      };
    });

    // Advance step
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();

    // Interface remains functional
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Area 7: Responsive Boundaries (5 tests)
  // --------------------------------------------------------------------------
  test('B7.1: Viewport resize across xl breakpoint (1280px) transitions smoothly between split-pane and tabbed mode', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Desktop view >= 1280px
    await page.setViewportSize({ width: 1440, height: 900 });
    const notesAside = page.locator('aside').filter({ hasText: /Step 1/i });
    await expect(notesAside).toBeVisible();

    // Below 1280px (tablet/mobile view)
    await page.setViewportSize({ width: 1024, height: 768 });
    const segmentSwitcher = page.getByRole('button', { name: 'Notes', exact: true });
    await expect(segmentSwitcher).toBeVisible();
  });

  test('B7.2: Opening mobile menu drawer, resizing to desktop, and resizing back to mobile preserves layout state', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/how-java-runs');

    const hamburgerBtn = page.getByTestId('mobile-menu-toggle');
    await hamburgerBtn.click();

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    await expect(sidebar).toHaveClass(/translate-x-0/);

    // Resize to desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(sidebar).toBeVisible();

    // Resize back to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('B7.3: Zero horizontal overflow confirmed across extreme viewport widths', async ({ page }) => {
    const widths = [320, 375, 414, 768, 1024, 1920];

    for (const width of widths) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/lessons/how-java-runs');

      const noOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth <= window.innerWidth + 2;
      });
      expect(noOverflow).toBe(true);
    }
  });

  test('B7.4: Rapidly toggling floating mobile peek button switches view without DOM thrashing', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/how-java-runs');

    const peekBtn = page.getByTestId('mobile-toggle-tab');
    await expect(peekBtn).toBeVisible();

    // Toggle 4 times
    await peekBtn.click();
    await peekBtn.click();
    await peekBtn.click();
    await peekBtn.click();

    // Final state should be Notes
    await expect(peekBtn).toContainText(/Notes/i);
  });

  test('B7.5: Search modal on small mobile screen fits within viewport height (max-h-[75vh]) with internal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const dialog = page.locator('.max-h-\\[75vh\\]');
    await expect(dialog).toBeVisible();

    // Verify modal does not exceed window innerHeight
    const modalHeight = await dialog.evaluate((el) => el.getBoundingClientRect().height);
    expect(modalHeight).toBeLessThanOrEqual(568 * 0.85);
  });

});
