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

test.describe('Tier 4: Real-World Learner Journeys (S1 - S6)', () => {

  // --------------------------------------------------------------------------
  // S1: Junior Engineer Onboarding Journey
  // --------------------------------------------------------------------------
  test('S1: Junior Engineer Onboarding Journey', async ({ page, context }) => {
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {}

    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // 1. Arrives at Lesson 1: How Java Runs Your Code
    await page.goto('/lessons/how-java-runs');
    await expect(page).toHaveTitle(/How Java Runs/i);
    await expect(page.locator('h1').first()).toContainText('How Java Runs');

    // Step 1: Writing Java Source Code
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();
    await expect(page.getByText(/Key Idea/i)).toBeVisible();

    // 2. Advances to Step 2: javac Compiles
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    // Copies code block
    const copyBtn = page.getByTestId('copy-code-button').first();
    await copyBtn.click();
    await expect(copyBtn.getByText('Copied')).toBeVisible();

    // 3. Advances to Step 3: ClassLoader Hierarchy
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: /ClassLoader Hierarchy/i })).toBeVisible();

    // Answers microcheck quiz
    const correctOption = page.locator('button').filter({
      hasText: 'The Parent Delegation Model asks the Bootstrap ClassLoader first',
    });
    await correctOption.click();
    await expect(page.getByText('✓ Correct!')).toBeVisible();

    // 4. Advances through remaining steps to next lesson
    await nextBtn.click(); // Step 4
    await nextBtn.click(); // Step 5
    await nextBtn.click(); // Step 6
    await nextBtn.click(); // Step 7 (final step)

    // Clicks Next to transition to Lesson 2 (OOP Pillars)
    await nextBtn.click();
    await page.waitForURL(/\/lessons\/oop-pillars/);
    await expect(page.locator('h1').first()).toContainText('OOP');

    // 5. Verify progress tracked
    const stored = await getStoredProgress(page);
    expect(stored).not.toBeNull();
    expect(stored.completedSteps['how-java-runs']).toContain(0);

    const nonBenignErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
    );
    expect(nonBenignErrors).toHaveLength(0);
  });

  // --------------------------------------------------------------------------
  // S2: Senior Performance Engineer Debugging Journey
  // --------------------------------------------------------------------------
  test('S2: Senior Performance Engineer Debugging Journey', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/lessons/how-java-runs');

    // 1. Searches for ZGC
    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();

    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await searchInput.fill('ZGC');

    const zgcResult = page.getByTestId('search-result-item').first();
    await expect(zgcResult).toBeVisible();
    await zgcResult.click();

    await page.waitForURL(/\/lessons\/zgc-vs-g1/);
    await expect(page.locator('h1').first()).toContainText('ZGC');

    // 2. Inspect Step 1 GC latency metrics (G1 STW pause)
    await expect(page.getByText(/50 - 200 ms/i)).toBeVisible();

    // 3. Switch between 3D Iso and 2D Flat view
    const toggleBtn = page.getByTestId('toggle-view-mode');
    await toggleBtn.click();
    await expect(toggleBtn).toContainText(/2D Flat/i);

    await toggleBtn.click();
    await expect(toggleBtn).toContainText(/3D Iso/i);

    // 4. Advance to Step 2 to review Generational ZGC architecture and code
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();

    await expect(page.getByRole('heading', { name: /Colored Pointers/i })).toBeVisible();
    await expect(page.getByText(/-XX:\+UseZGC/i).first()).toBeVisible();

    // Verify diagram SVG remains mounted
    await expect(page.locator('.touch-pan-y')).toBeVisible();

    const nonBenignErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
    );
    expect(nonBenignErrors).toHaveLength(0);
  });

  // --------------------------------------------------------------------------
  // S3: Microservices Developer Spring Boot Flow
  // --------------------------------------------------------------------------
  test('S3: Microservices Developer Spring Boot Flow', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });

    // 1. Open Module 04 accordion
    const mod4Button = sidebar.getByRole('button', { name: /04\. Spring Boot & Microservices/i });
    const springLesson = sidebar.getByRole('button', { name: /Spring Boot Request Lifecycle/i });

    if (!(await springLesson.isVisible())) {
      await mod4Button.click();
    }
    await springLesson.click();

    await page.waitForURL(/\/lessons\/spring-request-lifecycle/);
    await expect(page.locator('h1').first()).toContainText('Spring Boot Request Lifecycle');

    // 2. Step through DispatcherServlet
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await nextBtn.click();

    // 3. Navigate to Dependency Injection
    const diLesson = sidebar.getByRole('button', { name: /Dependency Injection/i });
    await diLesson.click();
    await page.waitForURL(/\/lessons\/dependency-injection/);
    await expect(page.locator('h1').first()).toContainText('Dependency Injection');

    // Step forward to Step 2 to inspect constructor injection code block
    await nextBtn.click();
    await expect(page.locator('pre code')).toBeVisible();

    // 4. Navigate to Microservices Resilience
    const resilienceLesson = sidebar.getByRole('button', { name: /Microservices Communication/i });
    await resilienceLesson.click();
    await page.waitForURL(/\/lessons\/microservices-patterns/);
    await expect(page.locator('h1').first()).toContainText('Microservices Communication');

    // Step through Circuit Breaker
    await nextBtn.click();
    await expect(page.locator('main')).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // S4: Mobile Commuter Learning on iOS Safari
  // --------------------------------------------------------------------------
  test('S4: Mobile Commuter Learning on iOS Safari', async ({ page }) => {
    // Emulate iPhone mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/lessons/virtual-threads-loom');
    await expect(page.locator('h1').first()).toContainText('Virtual Threads');

    // 1. Open mobile menu drawer
    const hamburgerBtn = page.getByTestId('mobile-menu-toggle');
    await expect(hamburgerBtn).toBeVisible();
    await hamburgerBtn.click();

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    await expect(sidebar).toHaveClass(/translate-x-0/);

    // Close drawer via backdrop click (force: true bypasses pointer-events interception)
    await page.locator('div.fixed.inset-0.z-40').click({ force: true });
    await expect(sidebar).toHaveClass(/-translate-x-full/);

    // 2. Toggle views using floating mobile peek button
    const peekBtn = page.getByTestId('mobile-toggle-tab');
    await expect(peekBtn).toBeVisible();
    await peekBtn.click(); // Switches to Notes

    const notesAside = page.locator('aside').filter({ hasText: /Step 1/i });
    await expect(notesAside).toBeVisible();

    await peekBtn.click(); // Switches back to Diagram
    await expect(page.locator('.touch-pan-y')).toBeVisible();

    // 3. Toggle via segment switcher
    const notesTab = page.getByRole('tab', { name: 'Notes' }).or(page.getByRole('button', { name: 'Notes', exact: true }));
    await notesTab.click();
    await expect(notesAside).toBeVisible();

    // 4. Advance step
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();

    // 5. Zero horizontal overflow check
    const noOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth + 2;
    });
    expect(noOverflow).toBe(true);
  });

  // --------------------------------------------------------------------------
  // S5: Keyboard-Only Power User Journey
  // --------------------------------------------------------------------------
  test('S5: Keyboard-Only Power User Journey', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');
    await expect(page.getByRole('heading', { name: /Writing Java Source Code/i })).toBeVisible();

    // 1. Search via Cmd+K / Ctrl+K
    await page.keyboard.press('Control+k');
    const searchInput = page.getByPlaceholder(/search java concepts/i);
    await expect(searchInput).toBeVisible();

    // 2. Type query and navigate results via ArrowDown + Enter
    await searchInput.fill('Generics');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await page.waitForURL(/\/lessons\/generics/);
    await expect(page.locator('h1').first()).toContainText('Generics');

    // 3. Step forward using ArrowRight
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // 4. Replay animation using 'r'
    await page.keyboard.press('r');

    // 5. Pause and resume animation using Space
    const playPauseBtn = page.getByTestId('play-pause-button');
    await page.locator('body').click();
    await page.keyboard.press('Space');
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Play');

    await page.keyboard.press('Space');
    await expect(playPauseBtn).toHaveAttribute('aria-label', 'Pause');

    // 6. Step backward using ArrowLeft
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('h2').first()).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // S6: Full Module Completion & Return Journey
  // --------------------------------------------------------------------------
  test('S6: Full Module Completion & Return Journey', async ({ page }) => {
    await page.goto('/lessons/how-java-runs');

    // Complete all 8 lessons of Module 01 (Foundations)
    const module1Slugs = [
      'how-java-runs',
      'oop-pillars',
      'memory-and-gc',
      'java-data-types',
      'exception-handling',
      'object-headers-lilliput',
      'escape-analysis',
      'zgc-vs-g1',
    ];

    const completedMap: Record<string, number[]> = {};
    module1Slugs.forEach((slug) => {
      // 10 steps each completes all steps of each lesson
      completedMap[slug] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    });

    await seedProgress(page, {
      completedSteps: completedMap,
      currentLessonSlug: 'how-java-runs',
      currentStepIndex: 0,
    });

    await page.reload();

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });

    // Module 01 should show 8/8 completed
    await expect(sidebar.getByText('8/8')).toBeVisible();

    // Progress bar shows at least 8/27 (30%)
    const progressSection = sidebar.filter({ hasText: /PROGRESS/i });
    await expect(progressSection).toContainText('8 / 27 (30%)');

    // Continue to Module 02
    const mod2Button = sidebar.getByRole('button', { name: /02\. Collections & Streams/i });
    const collectionsLesson = sidebar.getByRole('button', { name: 'Collections Framework Deep Dive' });

    if (!(await collectionsLesson.isVisible())) {
      await mod2Button.click();
    }
    await collectionsLesson.click();

    await page.waitForURL(/\/lessons\/collections-framework/);
    await expect(page.locator('h1').first()).toContainText('Collections Framework');
  });

});
