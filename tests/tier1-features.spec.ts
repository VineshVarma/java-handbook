import { test, expect, Page, BrowserContext } from '@playwright/test';

// Helper to inspect stored progress across legacy and current keys
async function getStoredProgress(page: Page): Promise<any> {
  return await page.evaluate(() => {
    const raw =
      localStorage.getItem('java_handbook_progress_v1') ||
      localStorage.getItem('java_internals_progress_v1');
    return raw ? JSON.parse(raw) : null;
  });
}

// Helper to seed progress in localStorage
async function seedProgress(page: Page, progressObj: any) {
  await page.evaluate((data) => {
    const str = JSON.stringify(data);
    localStorage.setItem('java_internals_progress_v1', str);
    localStorage.setItem('java_handbook_progress_v1', str);
  }, progressObj);
}

// Safe clipboard reader with fallback
async function readClipboardSafely(page: Page, context: BrowserContext): Promise<string | null> {
  try {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  } catch {
    // Permission grants may fail on headless WebKit
  }
  try {
    return await page.evaluate(() => navigator.clipboard.readText());
  } catch {
    return null;
  }
}

test.describe('Tier 1: Feature Coverage (F1 - F7)', () => {

  // --------------------------------------------------------------------------
  // Area 1: Header & Curriculum Navigation (5 tests)
  // --------------------------------------------------------------------------
  test('F1.1: Brand logo navigation returns to root and loads handbook interface', async ({ page }) => {
    await page.goto('/lessons/collections-framework');
    await expect(page).toHaveTitle(/Collections/i);

    const brandLink = page.getByRole('link', { name: /Java Handbook/i });
    await expect(brandLink).toBeVisible();
    await brandLink.click();

    // Verify root or active lesson view loaded
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(brandLink).toContainText('Java Handbook');
  });

  test('F1.2: Sidebar module accordion toggles expand/collapse state independently', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const mod2Button = sidebar.getByRole('button', { name: /02\. Collections & Streams/i });
    await expect(mod2Button).toBeVisible();

    const lessonItem = sidebar.getByRole('button', { name: 'Collections Framework Deep Dive' });
    const isInitiallyVisible = await lessonItem.isVisible();

    // Toggle accordion
    await mod2Button.click();
    if (isInitiallyVisible) {
      await expect(lessonItem).not.toBeVisible();
      // Toggle back to open
      await mod2Button.click();
      await expect(lessonItem).toBeVisible();
    } else {
      await expect(lessonItem).toBeVisible();
      // Toggle back to closed
      await mod2Button.click();
      await expect(lessonItem).not.toBeVisible();
    }
  });

  test('F1.3: Clicking sidebar lesson button deep links to /lessons/{slug} and updates H1', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const mod2Button = sidebar.getByRole('button', { name: /02\. Collections & Streams/i });
    const targetLessonBtn = sidebar.getByRole('button', { name: 'Collections Framework Deep Dive' });

    if (!(await targetLessonBtn.isVisible())) {
      await mod2Button.click();
    }

    await expect(targetLessonBtn).toBeVisible();
    await targetLessonBtn.click();

    await page.waitForURL(/\/lessons\/collections-framework/);
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('Collections Framework Deep Dive');
  });

  test('F1.4: Header tabs render cleanly and inactive tabs are disabled', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const learnTab = page.getByTestId('tab-learn');
    await expect(learnTab).toBeVisible();

    const practiceTab = page.getByTestId('tab-practice');
    await expect(practiceTab).toBeVisible();
    await expect(practiceTab).toBeDisabled();

    const cheatsheetTab = page.getByTestId('tab-cheatsheets');
    await expect(cheatsheetTab).toBeVisible();
    await expect(cheatsheetTab).toBeDisabled();

    // Inactive tabs are disabled and do not trigger toast notifications
    const toast = page.locator('div[role="status"], .fixed.bottom-8, .z-50');
    await expect(toast).not.toBeVisible();
  });

  test('F1.5: Theme toggle alternates html element class between light and dark', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();

    const html = page.locator('html');
    const initialClass = (await html.getAttribute('class')) || '';
    const wasDark = initialClass.includes('dark');

    await themeToggle.click();
    if (wasDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }

    // Toggle back
    await themeToggle.click();
    if (wasDark) {
      await expect(html).toHaveClass(/dark/);
    } else {
      await expect(html).not.toHaveClass(/dark/);
    }
  });

  // --------------------------------------------------------------------------
  // Area 2: Interactive Stepper & Step Content (5 tests)
  // --------------------------------------------------------------------------
  test('F2.1: Clicking Next button advances step index, updates heading, and highlights active step pill', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Step 1 check
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();

    const nextBtn = page.getByTestId('next-step-button');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Step 2 check
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    // Verify step timeline highlights step 2
    const step2Pill = page.locator('button[title*="javac Compiles"]');
    await expect(step2Pill).toHaveClass(/bg-emerald-600/);
  });

  test('F2.2: Clicking Back button decrements step index and Back button is disabled on Step 1', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const prevBtn = page.getByTestId('prev-step-button');
    await expect(prevBtn).toBeVisible();
    await expect(prevBtn).toBeDisabled();

    // Advance to step 2
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();
    await expect(prevBtn).toBeEnabled();

    // Click Back
    await prevBtn.click();
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();
    await expect(prevBtn).toBeDisabled();
  });

  test('F2.3: Keyboard navigation (ArrowRight / ArrowLeft) advances and reverses steps', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();

    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();
  });

  test('F2.4: Markdown content renders lists, bold formatting, inline code, and key idea callouts cleanly', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Key idea container
    const keyIdea = page.getByText(/Key Idea/i);
    await expect(keyIdea).toBeVisible();

    // Strong text and inline code in StepContent
    const strongTag = page.locator('main strong').first();
    await expect(strongTag).toBeVisible();

    const codeTag = page.locator('main code').first();
    await expect(codeTag).toBeVisible();
  });

  test('F2.5: Terminal step of the course displays completion state (Finish Course)', async ({ page }) => {
    await page.goto('/lessons/offheap-ffm-api');

    // Navigate to step 3 (last step)
    const step3Pill = page.locator('button[title*="Native Memory"]').or(
      page.locator('button[title*="Tracking"]')
    ).last();
    if (await step3Pill.isVisible()) {
      await step3Pill.click();
    } else {
      const nextBtn = page.getByTestId('next-step-button');
      while (await nextBtn.isEnabled() && !(await nextBtn.innerText()).includes('Finish Course')) {
        await nextBtn.click();
      }
    }

    const nextBtn = page.getByTestId('next-step-button');
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toContainText(/Finish Course/i);
    await expect(nextBtn).toBeEnabled();
  });

  // --------------------------------------------------------------------------
  // Area 3: Interactive Diagram Engine & Simulation (5 tests)
  // --------------------------------------------------------------------------
  test('F3.1: View mode toggle switches between 3D Iso and 2D Flat projections', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const toggleBtn = page.getByTestId('toggle-view-mode');
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toContainText(/3D Iso/i);

    await toggleBtn.click();
    await expect(toggleBtn).toContainText(/2D Flat/i);

    await toggleBtn.click();
    await expect(toggleBtn).toContainText(/3D Iso/i);
  });

  test('F3.2: Replay button triggers animation reset without runtime errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/lessons/how-java-runs');

    const replayBtn = page.getByTestId('replay-button');
    await expect(replayBtn).toBeVisible();
    await replayBtn.click();

    // Keyboard shortcut 'R'
    await page.keyboard.press('r');

    const nonBenignErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
    );
    expect(nonBenignErrors).toHaveLength(0);
  });

  test('F3.3: Play/Pause button toggles animation playback state and aria-label', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const playPauseBtn = page.getByTestId('play-pause-button');
    await expect(playPauseBtn).toBeVisible();
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Pause');

    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Play');

    await playPauseBtn.click();
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Pause');
  });

  test('F3.4: Break It scenario selection (hot-calls) updates telemetry metrics to HotSpot Level 4 C2', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const breakItBtn = page.getByTestId('break-it-button');
    await expect(breakItBtn).toBeVisible();
    await breakItBtn.click();

    const hotCallsOption = page.getByTestId('sim-scenario-hot-calls');
    await expect(hotCallsOption).toBeVisible();
    await hotCallsOption.click();

    // Check telemetry row updates
    await expect(page.getByText('HotSpot Level 4 C2')).toBeVisible();
    await expect(page.getByText(/Simulating 10,000 High-Velocity Invocations/i)).toBeVisible();
  });

  test('F3.5: Break It recursion scenario renders StackOverflowError warning on stage canvas', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const breakItBtn = page.getByTestId('break-it-button');
    await expect(breakItBtn).toBeVisible();
    await breakItBtn.click();

    const recursionOption = page.getByTestId('sim-scenario-recursion');
    await expect(recursionOption).toBeVisible();
    await recursionOption.click();

    // Check telemetry and canvas error banner
    await expect(page.getByText(/StackOverflowError/i).first()).toBeVisible();
    await expect(page.getByText(/Simulating Infinite Method Recursion/i)).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Area 4: Code Blocks & Developer Experience (5 tests)
  // --------------------------------------------------------------------------
  test('F4.1: Syntax-highlighted code block displays language badge and line numbers in table gutter', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Advance to step 2 which has OrderService.java code block
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    const codeBlock = page.locator('pre code');
    await expect(codeBlock).toBeVisible();

    // Verify line numbers in gutter
    const lineNumber1 = page.locator('pre span[aria-hidden="true"]').first();
    await expect(lineNumber1).toBeVisible();
    await expect(lineNumber1).toHaveText('1');
  });

  test('F4.2: Clicking Copy button triggers Copied feedback state with checkmark icon', async ({ page, context }) => {
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {}

    await page.goto('/lessons/how-java-runs');

    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    const copyBtn = page.getByTestId('copy-code-button').first();
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    await expect(copyBtn.getByText('Copied')).toBeVisible();
  });

  test('F4.3: Copied clipboard text contains pure Java syntax without line numbers or annotations', async ({ page, context }) => {
    await page.goto('/lessons/how-java-runs');

    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    const copyBtn = page.getByTestId('copy-code-button').first();
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    const clipboardText = await readClipboardSafely(page, context);
    if (clipboardText) {
      expect(clipboardText).toContain('class');
      expect(clipboardText).not.toMatch(/^\s*\d+\s+/m);
    }
  });

  test('F4.4: Code block with beforeCode renders Before and After / Modern tabs', async ({ page }) => {
    await page.goto('/lessons/lambdas-functional');

    const beforeTab = page.getByRole('button', { name: 'Before' });
    const afterTab = page.getByRole('button', { name: 'After / Modern' });

    await expect(beforeTab).toBeVisible();
    await expect(afterTab).toBeVisible();
  });

  test('F4.5: Toggling Before and After tabs dynamically swaps code snippet content', async ({ page }) => {
    await page.goto('/lessons/lambdas-functional');

    const beforeTab = page.getByRole('button', { name: 'Before' });
    const afterTab = page.getByRole('button', { name: 'After / Modern' });

    await beforeTab.click();
    await expect(page.locator('pre code')).toContainText('Anonymous Inner Class');

    await afterTab.click();
    await expect(page.locator('pre code')).toContainText('Comparator.comparing');
  });

  // --------------------------------------------------------------------------
  // Area 5: Global Search & Discovery (5 tests)
  // --------------------------------------------------------------------------
  test('F5.1: Opening search dialog displays top 6 suggested lessons in zero-query state', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await expect(searchInput).toBeVisible();

    const items = page.getByTestId('search-result-item');
    await expect(items).toHaveCount(6);
  });

  test('F5.2: Keyboard shortcut Cmd+K / Ctrl+K opens search modal and Escape closes it', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    await page.keyboard.press('Control+k');
    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await expect(searchInput).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(searchInput).not.toBeVisible();
  });

  test('F5.3: Typing query filters results across lessons and step titles', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await searchInput.fill('Virtual Threads');

    const firstResult = page.getByTestId('search-result-item').first();
    await expect(firstResult).toBeVisible();
    await expect(firstResult).toContainText(/Virtual Threads/i);
  });

  test('F5.4: Keyboard navigation (ArrowDown, ArrowUp) moves active selection and Enter navigates', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await searchInput.fill('Spring');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await page.waitForURL(/\/lessons\/spring/);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('F5.5: Non-matching query displays empty state message', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await searchInput.fill('xyz123nonexistent');

    await expect(
      page.getByText('No matching lessons or concepts found for "xyz123nonexistent".')
    ).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Area 6: Progress Tracking & Persistence (5 tests)
  // --------------------------------------------------------------------------
  test('F6.1: Advancing through steps records completed step indices in localStorage', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();

    const stored = await getStoredProgress(page);
    expect(stored).not.toBeNull();
    expect(stored.completedSteps['how-java-runs']).toContain(0);
  });

  test('F6.2: Completing all steps in a lesson renders checkmark icon in Sidebar lesson list', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Seed completion for all 7 steps of how-java-runs (0 through 6)
    await seedProgress(page, {
      completedSteps: { 'how-java-runs': [0, 1, 2, 3, 4, 5, 6] },
      currentLessonSlug: 'how-java-runs',
      currentStepIndex: 0,
    });

    await page.reload();

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const lessonButton = sidebar.getByRole('button', { name: 'How Java Runs' });
    await expect(lessonButton.locator('svg.lucide-check-circle-2, svg')).toBeVisible();
  });

  test('F6.3: Sidebar bottom progress bar calculates and displays accurate percentage', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // 1 completed lesson out of 27 is round(1/27 * 100) = 4%
    await seedProgress(page, {
      completedSteps: { 'how-java-runs': [0, 1, 2, 3, 4, 5, 6] },
      currentLessonSlug: 'how-java-runs',
      currentStepIndex: 0,
    });

    await page.reload();

    const progressSection = page.locator('aside').filter({ hasText: /PROGRESS/i });
    await expect(progressSection).toContainText('1 / 27 (4%)');
  });

  test('F6.4: Reloading the browser preserves completed step indices and lesson checkmarks', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    await seedProgress(page, {
      completedSteps: { 'how-java-runs': [0, 1, 2, 3, 4, 5, 6] },
      currentLessonSlug: 'how-java-runs',
      currentStepIndex: 0,
    });

    await page.reload();

    const progressBefore = await getStoredProgress(page);
    expect(progressBefore.completedSteps['how-java-runs']).toHaveLength(7);

    await page.reload();

    const progressAfter = await getStoredProgress(page);
    expect(progressAfter.completedSteps['how-java-runs']).toEqual(
      progressBefore.completedSteps['how-java-runs']
    );
  });

  test('F6.5: Direct URL access to a previously completed lesson reflects completed status on step timeline pills', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Seed step 0 and 1 as completed
    await seedProgress(page, {
      completedSteps: { 'how-java-runs': [0, 1] },
      currentLessonSlug: 'how-java-runs',
      currentStepIndex: 0,
    });

    await page.reload();

    // Step 2 pill (index 1) is completed and not active, so it shows the check icon
    const step2Pill = page.locator('button[title*="javac Compiles"]');
    await expect(step2Pill.locator('svg.lucide-check, svg')).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // Area 7: Responsive Layout & Mobile Ergonomics (5 tests)
  // --------------------------------------------------------------------------
  test('F7.1: Mobile viewport (< 768px) shows hamburger menu and clicking opens curriculum drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/how-java-runs');

    const hamburgerBtn = page.getByTestId('mobile-menu-toggle');
    await expect(hamburgerBtn).toBeVisible();
    await hamburgerBtn.click();

    // Drawer opens
    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    await expect(sidebar).toHaveClass(/translate-x-0/);
  });

  test('F7.2: Mobile segment switcher alternates between Diagram and Notes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/how-java-runs');

    const notesBtn = page.getByRole('tab', { name: 'Notes' }).or(page.getByRole('button', { name: 'Notes', exact: true }));
    await expect(notesBtn).toBeVisible();
    await notesBtn.click();

    // Aside notes visible
    const aside = page.locator('aside').filter({ hasText: /Step 1/i });
    await expect(aside).toBeVisible();

    const simBtn = page.getByRole('tab', { name: 'Diagram' }).or(page.getByRole('button', { name: 'Diagram', exact: true }));
    await simBtn.click();
    await expect(page.locator('.touch-pan-y')).toBeVisible();
  });

  test('F7.3: Floating mobile peek button toggles active pane', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/how-java-runs');

    const peekBtn = page.getByTestId('mobile-toggle-tab');
    await expect(peekBtn).toBeVisible();
    await expect(peekBtn).toContainText(/Notes/i);

    await peekBtn.click();
    await expect(peekBtn).toContainText(/Diagram/i);

    await peekBtn.click();
    await expect(peekBtn).toContainText(/Notes/i);
  });

  test('F7.4: Diagram canvas includes .touch-pan-y class to ensure vertical scrolling is not hijacked', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const touchPanY = page.locator('.touch-pan-y').first();
    await expect(touchPanY).toBeVisible();
  });

  test('F7.5: Search input font size is >= 16px on mobile viewports to prevent iOS Safari auto-zoom', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/how-java-runs');

    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await expect(searchInput).toBeVisible();

    const fontSize = await searchInput.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

});
