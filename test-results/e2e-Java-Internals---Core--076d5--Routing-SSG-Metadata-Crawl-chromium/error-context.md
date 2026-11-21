# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Java Internals - Core Platform & E2E Validation >> 3. Next.js Path Routing, SSG & Metadata Crawl
- Location: tests/e2e.spec.ts:108:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "User-agent: *"
Received string:    "User-Agent: *
Allow: /·
Sitemap: https://java-internals.vercel.app/sitemap.xml
"
```

# Page snapshot

```yaml
- generic [active] [ref=f2e1]: "User-Agent: * Allow: / Sitemap: https://java-internals.vercel.app/sitemap.xml"
```

# Test source

```ts
  27  |     await page.waitForTimeout(400);
  28  | 
  29  |     // Verify step advanced (Step 2)
  30  |     await expect(page.getByText(/javac: Compile to Bytecode/i)).toBeVisible();
  31  | 
  32  |     // Test Keyboard navigation (Right arrow -> Step 3)
  33  |     await page.keyboard.press('ArrowRight');
  34  |     await page.waitForTimeout(400);
  35  |     await expect(page.getByText(/Inside the .class File: CAFEBABE/i)).toBeVisible();
  36  | 
  37  |     // Test Back button
  38  |     const prevBtn = page.getByTestId('prev-step-button');
  39  |     await expect(prevBtn).toBeVisible();
  40  |     await prevBtn.click();
  41  |     await page.waitForTimeout(400);
  42  |     await expect(page.getByText(/javac: Compile to Bytecode/i)).toBeVisible();
  43  | 
  44  |     // Test 2D / 3D view toggle
  45  |     const toggleViewBtn = page.getByTestId('toggle-view-mode');
  46  |     await expect(toggleViewBtn).toBeVisible();
  47  |     await toggleViewBtn.click();
  48  |     await page.waitForTimeout(300);
  49  |     await toggleViewBtn.click();
  50  | 
  51  |     // Test "Break It" runtime scenario menu
  52  |     const breakItBtn = page.getByTestId('break-it-button');
  53  |     await expect(breakItBtn).toBeVisible();
  54  |     await breakItBtn.click();
  55  |     const hotCallsOption = page.getByTestId('sim-scenario-hot-calls');
  56  |     await expect(hotCallsOption).toBeVisible();
  57  |     await hotCallsOption.click();
  58  |     await page.waitForTimeout(400);
  59  | 
  60  |     // Test Code Copy button (clean Java syntax, no line numbers)
  61  |     await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  62  |     const copyBtn = page.getByTestId('copy-code-button').first();
  63  |     if (await copyBtn.isVisible()) {
  64  |       await copyBtn.click();
  65  |       await page.waitForTimeout(300);
  66  |       const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  67  |       expect(clipboardText).toContain('class');
  68  |       // Assert no line numbers or stray annotations like "1 " or "2 " on newline
  69  |       expect(clipboardText).not.toMatch(/^\s*\d+\s+/m);
  70  |     }
  71  | 
  72  |     // Verify zero uncaught runtime errors
  73  |     const nonBenignErrors = errors.filter(
  74  |       (e) => !e.includes('favicon') && !e.includes('hydration') && !e.includes('ResizeObserver')
  75  |     );
  76  |     expect(nonBenignErrors).toHaveLength(0);
  77  |   });
  78  | 
  79  |   test('2. Mobile Ergonomics & iOS Safari Viewport Compliance', async ({ page }) => {
  80  |     await page.goto('/lessons/how-java-runs');
  81  | 
  82  |     // 1. Assert zero horizontal overflow
  83  |     const overflowCheck = await page.evaluate(() => {
  84  |       return document.documentElement.scrollWidth <= window.innerWidth + 2;
  85  |     });
  86  |     expect(overflowCheck).toBe(true);
  87  | 
  88  |     // 2. Assert search input font-size >= 16px to prevent iOS Safari auto-zoom
  89  |     const searchBtn = page.getByTestId('search-button');
  90  |     await searchBtn.click();
  91  |     const searchInput = page.locator('input[type="text"]').first();
  92  |     await expect(searchInput).toBeVisible();
  93  | 
  94  |     const inputFontSize = await searchInput.evaluate((el) => {
  95  |       return parseFloat(window.getComputedStyle(el).fontSize);
  96  |     });
  97  |     // >= 16px prevents iOS Safari focus zoom
  98  |     expect(inputFontSize).toBeGreaterThanOrEqual(16);
  99  | 
  100 |     // Close search dialog
  101 |     await page.keyboard.press('Escape');
  102 | 
  103 |     // 3. Assert touch-pan-y on canvas wrapper to prevent vertical scroll hijacking
  104 |     const canvasWrapper = page.locator('.touch-pan-y').first();
  105 |     await expect(canvasWrapper).toBeVisible();
  106 |   });
  107 | 
  108 |   test('3. Next.js Path Routing, SSG & Metadata Crawl', async ({ page }) => {
  109 |     // 1. Check direct lesson deep link (/lessons/collections-framework)
  110 |     const resp = await page.goto('/lessons/collections-framework');
  111 |     expect(resp?.status()).toBe(200);
  112 |     await expect(page).toHaveTitle(/Collections/i);
  113 |     await expect(page.locator('h1').first()).toBeVisible();
  114 | 
  115 |     // 2. Check sitemap.xml
  116 |     const sitemapResp = await page.goto('/sitemap.xml');
  117 |     expect(sitemapResp?.status()).toBe(200);
  118 |     const sitemapText = await sitemapResp?.text();
  119 |     expect(sitemapText).toContain('<urlset');
  120 |     expect(sitemapText).toContain('/lessons/how-java-runs');
  121 |     expect(sitemapText).toContain('/lessons/collections-framework');
  122 | 
  123 |     // 3. Check robots.txt
  124 |     const robotsResp = await page.goto('/robots.txt');
  125 |     expect(robotsResp?.status()).toBe(200);
  126 |     const robotsText = await robotsResp?.text();
> 127 |     expect(robotsText).toContain('User-agent: *');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  128 |     expect(robotsText).toContain('sitemap.xml');
  129 |   });
  130 | 
  131 |   test('4. Progress Tracking & LocalStorage Persistence', async ({ page }) => {
  132 |     await page.goto('/lessons/how-java-runs');
  133 | 
  134 |     // Complete steps by clicking next
  135 |     const nextBtn = page.getByTestId('next-step-button');
  136 |     await nextBtn.click();
  137 |     await page.waitForTimeout(300);
  138 | 
  139 |     // Check localStorage has saved progress
  140 |     const stored = await page.evaluate(() => {
  141 |       return localStorage.getItem('java_internals_progress_v1');
  142 |     });
  143 |     expect(stored).not.toBeNull();
  144 |     const parsed = JSON.parse(stored || '{}');
  145 |     expect(parsed.completedSteps['how-java-runs']).toBeDefined();
  146 | 
  147 |     // Reload page and confirm progress persisted
  148 |     await page.reload();
  149 |     await page.waitForTimeout(500);
  150 | 
  151 |     const reloadedStored = await page.evaluate(() => {
  152 |       return localStorage.getItem('java_internals_progress_v1');
  153 |     });
  154 |     expect(reloadedStored).toContain('how-java-runs');
  155 |   });
  156 | 
  157 |   test('5. Global Search & Tab Navigation', async ({ page }) => {
  158 |     await page.goto('/lessons/how-java-runs');
  159 | 
  160 |     // Open Search via shortcut or button
  161 |     const searchBtn = page.getByTestId('search-button');
  162 |     await searchBtn.click();
  163 |     await page.waitForTimeout(200);
  164 | 
  165 |     // Type query
  166 |     const searchInput = page.locator('input[type="text"]').first();
  167 |     await searchInput.fill('HashMap');
  168 |     await page.waitForTimeout(300);
  169 | 
  170 |     // Select result
  171 |     const resultItem = page.getByText(/Collections/i).first();
  172 |     await expect(resultItem).toBeVisible();
  173 |     await resultItem.click();
  174 | 
  175 |     // Verify navigated
  176 |     await page.waitForURL(/\/lessons\/collections-framework/);
  177 |     await expect(page).toHaveTitle(/Collections/i);
  178 | 
  179 |     // Verify tabs
  180 |     const learnTab = page.getByTestId('tab-learn');
  181 |     await expect(learnTab).toBeVisible();
  182 | 
  183 |     const practiceTab = page.getByTestId('tab-practice');
  184 |     await expect(practiceTab).toBeVisible();
  185 |     await practiceTab.click();
  186 | 
  187 |     const cheatsheetTab = page.getByTestId('tab-cheatsheets');
  188 |     await expect(cheatsheetTab).toBeVisible();
  189 |     await cheatsheetTab.click();
  190 |   });
  191 | 
  192 | });
  193 | 
```