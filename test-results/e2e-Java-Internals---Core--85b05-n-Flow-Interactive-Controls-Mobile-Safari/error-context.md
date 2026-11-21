# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Java Internals - Core Platform & E2E Validation >> 1. Core Lesson Flow & Interactive Controls
- Location: tests/e2e.spec.ts:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Hit Enter: Write Source Code/i)
Expected: visible
Error: strict mode violation: getByText(/Hit Enter: Write Source Code/i) resolved to 2 elements:
    1) <span class="truncate max-w-[120px]">Hit Enter: Write Source Code</span> aka getByRole('button', { name: 'Hit Enter: Write Source Code' })
    2) <h2 class="text-lg sm:text-xl font-bold font-mono tracking-tight text-charcoal-900 dark:text-cream-100">Hit Enter: Write Source Code</h2> aka locator('h2')

Call log:
  - Expect "toBeVisible" getByText(/Hit Enter: Write Source Code/i) with timeout 5000ms
  - waiting for getByText(/Hit Enter: Write Source Code/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - button "Toggle menu" [ref=e5] [cursor=pointer]
        - link "Java Internals Course" [ref=e7]:
          - /url: /
          - generic [ref=e12]:
            - text: Java Internals
            - generic [ref=e13]: Course
      - generic [ref=e14]:
        - button [ref=e15] [cursor=pointer]
        - button "Toggle theme" [ref=e19] [cursor=pointer]
    - generic [ref=e22]:
      - complementary [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]: Curriculum
          - generic [ref=e29]: 27 lessons
        - generic [ref=e30]:
          - generic [ref=e31]:
            - button "01. Java Foundations 0/8" [ref=e32] [cursor=pointer]:
              - generic [ref=e33]: 01. Java Foundations
              - generic [ref=e37]: 0/8
            - generic [ref=e42]:
              - button "How Java Runs Your Code" [ref=e43] [cursor=pointer]
              - 'button "OOP: The Four Pillars in Enterprise Java" [ref=e45] [cursor=pointer]'
              - button "Memory Model & Garbage Collection" [ref=e47] [cursor=pointer]
              - button "Data Types, String Pool & Immutability" [ref=e49] [cursor=pointer]
              - button "Exception Handling & Fault Tolerance" [ref=e51] [cursor=pointer]
              - button "Object Headers, Compressed OOPs & TLAB" [ref=e53] [cursor=pointer]
              - button "Escape Analysis & Scalar Replacement" [ref=e55] [cursor=pointer]
              - 'button "Modern Garbage Collection: G1 vs Generational ZGC" [ref=e57] [cursor=pointer]'
          - button "02. Collections & Streams 0/4" [ref=e60] [cursor=pointer]:
            - generic [ref=e61]: 02. Collections & Streams
            - generic [ref=e65]: 0/4
          - button "03. Concurrency & Async 0/6" [ref=e70] [cursor=pointer]:
            - generic [ref=e71]: 03. Concurrency & Async
            - generic [ref=e75]: 0/6
          - button "04. Spring Boot & Microservices 0/3" [ref=e80] [cursor=pointer]:
            - generic [ref=e81]: 04. Spring Boot & Microservices
            - generic [ref=e85]: 0/3
          - button "05. REST API & Security 0/2" [ref=e90] [cursor=pointer]:
            - generic [ref=e91]: 05. REST API & Security
            - generic [ref=e95]: 0/2
          - button "06. Database & Persistence 0/1" [ref=e100] [cursor=pointer]:
            - generic [ref=e101]: 06. Database & Persistence
            - generic [ref=e105]: 0/1
          - button "07. DevOps & Observability 0/3" [ref=e110] [cursor=pointer]:
            - generic [ref=e111]: 07. DevOps & Observability
            - generic [ref=e115]: 0/3
        - generic [ref=e119]:
          - generic [ref=e120]:
            - generic [ref=e121]: PROGRESS
            - generic [ref=e122]: 0 / 27 (0%)
          - generic [ref=e124]: Progress saved locally in browser
      - main [ref=e125]:
        - generic [ref=e126]:
          - generic [ref=e127]:
            - button "Simulation" [ref=e128] [cursor=pointer]
            - button "Notes & Code" [ref=e134] [cursor=pointer]
          - generic [ref=e138]: Step 1/7
        - generic [ref=e141]:
          - generic [ref=e142]:
            - generic [ref=e143]:
              - generic [ref=e144]: 01. Java Foundations
              - generic [ref=e145]: /
              - generic [ref=e146]: How Java Runs Your Code
            - generic [ref=e147]:
              - generic [ref=e148]:
                - heading "How Java Runs Your Code" [level=1] [ref=e149]
                - paragraph [ref=e150]: Follow your code from .java file through compilation to JVM native execution.
              - generic [ref=e151]:
                - generic [ref=e152]: 12 min
                - generic [ref=e157]: Beginner
                - generic [ref=e160]: 7 steps
          - generic [ref=e167]:
            - generic [ref=e168]:
              - button "Toggle 2D Flat / 3D Isometric View" [ref=e169] [cursor=pointer]
              - 'button "Break It: Runtime Simulations" [ref=e174] [cursor=pointer]'
              - button "Replay" [ref=e179] [cursor=pointer]
              - button "Pause" [ref=e183] [cursor=pointer]
            - generic [ref=e188]:
              - generic [ref=e189]:
                - generic [ref=e190]:
                  - generic [ref=e191]: EXECUTION MODE
                  - generic [ref=e192]: Level 0 Interpreter
                - generic [ref=e193]:
                  - generic [ref=e194]: CLASS VERIFICATION
                  - generic [ref=e195]: Magic 0xCAFEBABE Verified
                - generic [ref=e196]:
                  - generic [ref=e197]: INVOCATION COUNTER
                  - generic [ref=e198]: 342 Calls (Profiling)
                - generic [ref=e199]:
                  - generic [ref=e200]: CODE CACHE
                  - generic [ref=e201]: 2.4 MB / 240 MB Reserved
              - img [ref=e203]:
                - generic [ref=e205]: JVM Runtime Environment
                - generic [ref=e212]:
                  - generic: Developer
                  - generic [ref=e217]: PaymentService.java
                - generic [ref=e220]:
                  - generic [ref=e227]: AST Parsing
                  - generic: javac Compiler
                  - generic: Bytecode Parser
                - generic [ref=e231]:
                  - generic [ref=e238]: Interpreting
                  - generic: JVM Engine
                  - generic: HotSpot C1 / C2
                - generic [ref=e242]:
                  - generic [ref=e249]: "StackFrame #1"
                  - generic: Thread Stack
                  - generic: Frames & Vars
                - generic [ref=e253]:
                  - generic [ref=e260]: Live Objects
                  - generic: Heap Memory
                  - generic: Eden & Old Gen
                - generic [ref=e264]:
                  - generic [ref=e271]: x86-64 / ARM
                  - generic: Host CPU / OS
                  - generic: Native Assembly
              - generic [ref=e290]:
                - generic [ref=e291]: request
                - generic [ref=e293]: heavy
                - generic [ref=e295]: memory
                - generic [ref=e297]: exception
          - generic [ref=e300]:
            - generic [ref=e301]:
              - generic [ref=e302]: In this lesson
              - generic [ref=e303]: Step 1 of 7
            - generic [ref=e304]:
              - 'button "1 Hit Enter: Write Source Code" [ref=e305] [cursor=pointer]':
                - generic [ref=e306]: "1"
                - generic [ref=e307]: "Hit Enter: Write Source Code"
              - button "2 javac Compiles to Bytecode" [ref=e309] [cursor=pointer]:
                - generic [ref=e310]: "2"
                - generic [ref=e311]: javac Compiles to Bytecode
              - button "3 ClassLoader Hierarchy" [ref=e313] [cursor=pointer]:
                - generic [ref=e314]: "3"
                - generic [ref=e315]: ClassLoader Hierarchy
              - button "4 Bytecode Verification & Linking" [ref=e317] [cursor=pointer]:
                - generic [ref=e318]: "4"
                - generic [ref=e319]: Bytecode Verification & Linking
              - 'button "5 Execution Engine: Interpreter & JIT" [ref=e321] [cursor=pointer]':
                - generic [ref=e322]: "5"
                - generic [ref=e323]: "Execution Engine: Interpreter & JIT"
              - 'button "6 Stack vs Heap: Runtime Data Areas" [ref=e325] [cursor=pointer]':
                - generic [ref=e326]: "6"
                - generic [ref=e327]: "Stack vs Heap: Runtime Data Areas"
              - 'button "7 Recap: The Complete Lifecycle" [ref=e329] [cursor=pointer]':
                - generic [ref=e330]: "7"
                - generic [ref=e331]: "Recap: The Complete Lifecycle"
        - button "Read Notes" [ref=e333] [cursor=pointer]
  - alert [ref=e337]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Java Internals - Core Platform & E2E Validation', () => {
  4   | 
  5   |   test('1. Core Lesson Flow & Interactive Controls', async ({ page, context }) => {
  6   |     // Monitor uncaught errors
  7   |     const errors: string[] = [];
  8   |     page.on('pageerror', (err) => errors.push(err.message));
  9   |     page.on('console', (msg) => {
  10  |       if (msg.type() === 'error') errors.push(msg.text());
  11  |     });
  12  | 
  13  |     await page.goto('/lessons/how-java-runs');
  14  | 
  15  |     // Title & H1 alignment
  16  |     await expect(page).toHaveTitle(/How Java Runs/i);
  17  |     const h1 = page.locator('h1').first();
  18  |     await expect(h1).toBeVisible();
  19  | 
  20  |     // Verify initial step (Step 1)
> 21  |     await expect(page.getByText(/Hit Enter: Write Source Code/i)).toBeVisible();
      |                                                                   ^ Error: expect(locator).toBeVisible() failed
  22  | 
  23  |     // Test Next Step
  24  |     const nextBtn = page.getByTestId('next-step-button');
  25  |     await expect(nextBtn).toBeVisible();
  26  |     await nextBtn.click();
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
```