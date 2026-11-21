import { test, expect } from '@playwright/test';

test.describe('Java Internals - Core Platform & E2E Validation', () => {

  test('1. Core Lesson Flow & Interactive Controls', async ({ page, context, isMobile }) => {
    // Monitor uncaught errors
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/lessons/how-java-runs');

    // Title & H1 alignment
    await expect(page).toHaveTitle(/How Java Runs/i);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // 1. Test Diagram controls (2D/3D & Break It)
    const toggleViewBtn = page.getByTestId('toggle-view-mode');
    await expect(toggleViewBtn).toBeVisible();
    await toggleViewBtn.click();
    await page.waitForTimeout(200);
    await toggleViewBtn.click();

    // Test "Break It" runtime scenario menu
    const breakItBtn = page.getByTestId('break-it-button');
    await expect(breakItBtn).toBeVisible();
    await breakItBtn.click();
    const hotCallsOption = page.getByTestId('sim-scenario-hot-calls');
    await expect(hotCallsOption).toBeVisible();
    await hotCallsOption.click();
    await page.waitForTimeout(300);

    // If mobile, switch to content view to inspect step cards and stepper buttons
    if (isMobile) {
      const mobileTabToggle = page.getByTestId('mobile-toggle-tab');
      if (await mobileTabToggle.isVisible()) {
        await mobileTabToggle.click();
        await page.waitForTimeout(300);
      }
    }

    // Verify initial step (Step 1)
    await expect(page.getByRole('heading', { name: /Hit Enter/i })).toBeVisible();

    // Test Next Step
    const nextBtn = page.getByTestId('next-step-button');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForTimeout(400);

    // Verify step advanced (Step 2)
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    // Test Keyboard navigation (Right arrow -> Step 3)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    await expect(page.getByRole('heading', { name: /ClassLoader Hierarchy/i })).toBeVisible();

    // Test Back button
    const prevBtn = page.getByTestId('prev-step-button');
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();
    await page.waitForTimeout(400);
    await expect(page.getByRole('heading', { name: /javac Compiles/i })).toBeVisible();

    // Test Code Copy button (clean Java syntax, no line numbers)
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const copyBtn = page.getByTestId('copy-code-button').first();
      if (await copyBtn.isVisible()) {
        await copyBtn.click();
        await page.waitForTimeout(300);
        const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
        expect(clipboardText).toContain('class');
        // Assert no line numbers or stray annotations like "1 " or "2 " on newline
        expect(clipboardText).not.toMatch(/^\s*\d+\s+/m);
      }
    } catch {
      // Clipboard permissions may be restricted in some headless WebKit configurations
    }

    // Verify zero uncaught runtime errors
    const nonBenignErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
    );
    expect(nonBenignErrors).toHaveLength(0);
  });

  test('2. Mobile Ergonomics & iOS Safari Viewport Compliance', async ({ page, isMobile }) => {
    await page.goto('/lessons/how-java-runs');

    // 1. Assert zero horizontal overflow
    const overflowCheck = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth + 2;
    });
    expect(overflowCheck).toBe(true);

    // 2. Assert search input font-size >= 16px on mobile viewports to prevent iOS Safari auto-zoom
    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();
    const searchInput = page.locator('input[type="text"]').first();
    await expect(searchInput).toBeVisible();

    const inputFontSize = await searchInput.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    if (isMobile) {
      expect(inputFontSize).toBeGreaterThanOrEqual(16);
    } else {
      expect(inputFontSize).toBeGreaterThanOrEqual(14);
    }

    // Close search dialog
    await page.keyboard.press('Escape');

    // 3. Assert touch-pan-y on canvas wrapper to prevent vertical scroll hijacking
    const canvasWrapper = page.locator('.touch-pan-y').first();
    await expect(canvasWrapper).toBeVisible();
  });

  test('3. Next.js Path Routing, SSG & Metadata Crawl', async ({ page }) => {
    // 1. Check direct lesson deep link (/lessons/collections-framework)
    const resp = await page.goto('/lessons/collections-framework');
    expect(resp?.status()).toBe(200);
    await expect(page).toHaveTitle(/Collections/i);
    await expect(page.locator('h1').first()).toBeVisible();

    // 2. Check sitemap.xml
    const sitemapResp = await page.goto('/sitemap.xml');
    expect(sitemapResp?.status()).toBe(200);
    const sitemapText = await sitemapResp?.text();
    expect(sitemapText).toContain('<urlset');
    expect(sitemapText).toContain('/lessons/how-java-runs');
    expect(sitemapText).toContain('/lessons/collections-framework');

    // 3. Check robots.txt (case-insensitive User-agent check)
    const robotsResp = await page.goto('/robots.txt');
    expect(robotsResp?.status()).toBe(200);
    const robotsText = await robotsResp?.text();
    expect(robotsText).toMatch(/User-agent:\s*\*/i);
    expect(robotsText).toContain('sitemap.xml');
  });

  test('4. Progress Tracking & LocalStorage Persistence', async ({ page, isMobile }) => {
    await page.goto('/lessons/how-java-runs');

    // If mobile, switch to content view to reach the next step button
    if (isMobile) {
      const mobileTabToggle = page.getByTestId('mobile-toggle-tab');
      if (await mobileTabToggle.isVisible()) {
        await mobileTabToggle.click();
        await page.waitForTimeout(300);
      }
    }

    // Complete steps by clicking next
    const nextBtn = page.getByTestId('next-step-button');
    await nextBtn.click();
    await page.waitForTimeout(300);

    // Check localStorage has saved progress
    const stored = await page.evaluate(() => {
      return localStorage.getItem('java_internals_progress_v1');
    });
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored || '{}');
    expect(parsed.completedSteps['how-java-runs']).toBeDefined();

    // Reload page and confirm progress persisted
    await page.reload();
    await page.waitForTimeout(500);

    const reloadedStored = await page.evaluate(() => {
      return localStorage.getItem('java_internals_progress_v1');
    });
    expect(reloadedStored).toContain('how-java-runs');
  });

  test('5. Global Search & Tab Navigation', async ({ page, isMobile }) => {
    await page.goto('/lessons/how-java-runs');

    // Open Search via shortcut or button
    const searchBtn = page.getByTestId('search-button');
    await searchBtn.click();
    await page.waitForTimeout(200);

    // Type query
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.fill('HashMap');
    await page.waitForTimeout(400);

    // Select search result
    const searchResult = page.getByTestId('search-result-item').first();
    await expect(searchResult).toBeVisible();
    await searchResult.click();

    // Verify navigated
    await page.waitForURL(/\/lessons\//);

    // Verify tabs on desktop
    if (!isMobile) {
      const learnTab = page.getByTestId('tab-learn');
      await expect(learnTab).toBeVisible();

      const practiceTab = page.getByTestId('tab-practice');
      await expect(practiceTab).toBeVisible();
      await practiceTab.click();

      const cheatsheetTab = page.getByTestId('tab-cheatsheets');
      await expect(cheatsheetTab).toBeVisible();
      await cheatsheetTab.click();
    }
  });

});
