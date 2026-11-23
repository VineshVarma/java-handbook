import { test, expect, Page, BrowserContext } from '@playwright/test';

// Helper to inspect stored progress
async function getStoredProgress(page: Page): Promise<any> {
  return await page.evaluate(() => {
    const raw =
      localStorage.getItem('java_internals_progress_v1') ||
      localStorage.getItem('java_handbook_progress_v1');
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

// Safe clipboard reader with fallback
async function readClipboardSafely(page: Page, context: BrowserContext): Promise<string | null> {
  try {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  } catch {}
  try {
    return await page.evaluate(() => navigator.clipboard.readText());
  } catch {
    return null;
  }
}

test.describe('Tier 3: Cross-Feature Combinations (P1 - P10)', () => {

  test('P1: Search + Simulator (F5 + F3)', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // 1. Search for Project Loom
    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await searchInput.fill('Project Loom Internals');

    const resultItem = page.getByTestId('search-result-item').filter({ hasText: /Project Loom Internals/i }).first();
    await expect(resultItem).toBeVisible();
    await resultItem.click();

    await page.waitForURL(/\/lessons\/virtual-threads-loom/);
    await expect(page.locator('h1').first()).toContainText('Virtual Threads');

    // 2. Trigger "Pin Virtual Thread" simulation
    const breakItBtn = page.getByTestId('break-it-button');
    await expect(breakItBtn).toBeVisible();
    await breakItBtn.click();

    const pinOption = page.getByTestId('sim-scenario-thread-pin');
    await expect(pinOption).toBeVisible();
    await pinOption.click();

    // 3. Verify telemetry and simulation status
    await expect(page.getByText(/Pinned to Carrier|CARRIER THREAD PINNED/i).first()).toBeVisible();
    await expect(page.getByText(/Carrier Starvation/i).first()).toBeVisible();
  });

  test('P2: Theme + Stepper (F1 + F2)', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const html = page.locator('html');
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });

    // Ensure dark theme is active
    const initialClass = (await html.getAttribute('class')) || '';
    if (!initialClass.includes('dark')) {
      await themeToggle.click();
    }
    await expect(html).toHaveClass(/dark/);

    // Advance 3 steps
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await nextBtn.click();
    await nextBtn.click();

    // Dark theme should persist across all steps
    await expect(html).toHaveClass(/dark/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('P3: View Mode + Lesson Nav (F3 + F1)', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Switch to 2D Flat view
    const toggleBtn = page.getByTestId('toggle-view-mode');
    await toggleBtn.click();
    await expect(toggleBtn).toContainText(/2D Flat/i);

    // Navigate to next lesson via Sidebar
    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const oopLesson = sidebar.getByRole('button', { name: /OOP.*Pillars/i });
    await oopLesson.click();

    await page.waitForURL(/\/lessons\/oop-pillars/);
    await expect(page.locator('h1').first()).toContainText('OOP');

    // Diagram stage remains mounted and functional
    await expect(page.locator('.touch-pan-y')).toBeVisible();
  });

  test('P4: Code Tabs + Copy (F4 + F2)', async ({ page, context }) => {
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {}

    await page.goto('/lessons/lambdas-functional');

    // 1. Toggle to "Before" tab and copy
    const beforeTab = page.getByRole('button', { name: 'Before' });
    await beforeTab.click();

    const copyBtn = page.getByTestId('copy-code-button').first();
    await copyBtn.click();
    await expect(copyBtn.getByText('Copied')).toBeVisible();

    const beforeClipboard = await readClipboardSafely(page, context);
    if (beforeClipboard) {
      expect(beforeClipboard).toContain('Anonymous Inner Class');
    }

    // 2. Toggle to "After / Modern" tab and copy
    const afterTab = page.getByRole('button', { name: 'After / Modern' });
    await afterTab.click();

    await copyBtn.click();
    await expect(copyBtn.getByText('Copied')).toBeVisible();

    const afterClipboard = await readClipboardSafely(page, context);
    if (afterClipboard) {
      expect(afterClipboard).toContain('Comparator.comparing');
    }
  });

  test('P5: Micro-Check + Keyboard (F2 + F6)', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Navigate to step 3 (ClassLoader microcheck)
    const step3Pill = page.locator('button[title*="ClassLoader Hierarchy"]').or(
      page.locator('div.scrollbar-none button').nth(2)
    );
    await step3Pill.click();

    // Select correct option
    const correctOption = page.locator('button').filter({
      hasText: 'The Parent Delegation Model asks the Bootstrap ClassLoader first',
    });
    await correctOption.click();
    await expect(page.getByText('✓ Correct!')).toBeVisible();

    // Immediately press ArrowRight to advance
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('heading', { name: /Bytecode Verification/i })).toBeVisible();

    // Verify progress persists
    const stored = await getStoredProgress(page);
    expect(stored.completedSteps['how-java-runs']).toContain(2);
  });

  test('P6: Mobile Drawer + Search (F7 + F5)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/how-java-runs');

    // Open mobile sidebar drawer
    const hamburgerBtn = page.getByTestId('mobile-menu-toggle');
    await hamburgerBtn.click();

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    await expect(sidebar).toHaveClass(/translate-x-0/);

    // Open search modal via keyboard shortcut
    await page.keyboard.press('Control+k');

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await expect(searchInput).toBeVisible();

    // Select result
    await searchInput.fill('Collections');
    const resultItem = page.getByTestId('search-result-item').filter({ hasText: /Collections/i }).first();
    await expect(resultItem).toBeVisible();
    await resultItem.click();

    await expect(page.locator('h1').first()).toContainText('Collections');
    // Search dialog closed
    await expect(searchInput).not.toBeVisible();
  });

  test('P7: Progress + Deep Linking (F6 + F1)', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Seed completion of 3 steps for how-java-runs
    await seedProgress(page, {
      completedSteps: { 'how-java-runs': [0, 1, 2] },
      currentLessonSlug: 'how-java-runs',
      currentStepIndex: 0,
    });

    // Deep link to another lesson
    await page.goto('/lessons/zgc-vs-g1');
    await expect(page.locator('h1').first()).toContainText('ZGC');

    // Advance 1 step
    const nextBtn = page.getByTestId('next-step-button');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Verify combined progress using auto-waiting poll
    await expect.poll(async () => {
      const stored = await getStoredProgress(page);
      return stored?.completedSteps?.['how-java-runs']?.length;
    }).toBe(3);

    await expect.poll(async () => {
      const stored = await getStoredProgress(page);
      return stored?.completedSteps?.['zgc-vs-g1'];
    }).toContain(0);
  });

  test('P8: Simulator + Replay (F3 + F2)', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Trigger hot-calls
    const breakItBtn = page.getByTestId('break-it-button');
    await breakItBtn.click();
    await page.getByTestId('sim-scenario-hot-calls').click();

    await expect(page.getByText('HotSpot Level 4 C2')).toBeVisible();

    // Press Replay button
    const replayBtn = page.getByTestId('replay-button');
    await replayBtn.click();

    // Scenario and telemetry remain active
    await expect(page.getByText('HotSpot Level 4 C2')).toBeVisible();
    await expect(page.getByText(/Simulating 10,000 High-Velocity Invocations/i)).toBeVisible();
  });

  test('P9: Terminal Step + Sidebar (F2 + F1)', async ({ page }) => {
    await page.goto('/lessons/offheap-ffm-api');

    // Step forward until terminal step
    const nextBtn = page.getByTestId('next-step-button');
    while (await nextBtn.isEnabled() && !(await nextBtn.innerText()).includes('Finish Course')) {
      await nextBtn.click();
      await page.waitForTimeout(200);
    }

    await expect(nextBtn).toContainText(/Finish Course/i);
    await expect(nextBtn).toBeEnabled();

    // Expand Module 01 in Sidebar if collapsed
    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const mod1Btn = sidebar.getByRole('button', { name: /01\. Java Foundations/i });
    const lesson1Btn = sidebar.getByRole('button', { name: /How Java Runs/i });

    if (!(await lesson1Btn.isVisible())) {
      await mod1Btn.click();
    }
    await lesson1Btn.click();

    await page.waitForURL(/\/lessons\/how-java-runs/);
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();
    await expect(page.getByTestId('prev-step-button')).toBeDisabled();
  });

  test('P10: Search + Browser History (F5 + F1)', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Search and navigate to Garbage Collection
    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await searchInput.fill('Garbage Collection');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(page.locator('h1').first()).toContainText(/Garbage Collection/i);

    // Browser Back
    await page.goBack();
    await expect(page.locator('h1').first()).toContainText('How Java Runs');
  });

});
