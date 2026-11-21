# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Java Internals - Core Platform & E2E Validation >> 5. Global Search & Tab Navigation
- Location: tests/e2e.spec.ts:157:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText(/Collections/i).first()
    - locator resolved to <span class="truncate">02. Collections & Streams</span>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-950/60 backdrop-blur-sm">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-950/60 backdrop-blur-sm">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    52 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal-950/60 backdrop-blur-sm">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - link "Java Internals Course" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e10]:
          - text: Java Internals
          - generic [ref=e11]: Course
      - navigation [ref=e12]:
        - button "Learn" [ref=e13] [cursor=pointer]
        - button "Practice" [ref=e17] [cursor=pointer]
        - button "Cheatsheets" [ref=e23] [cursor=pointer]
      - generic [ref=e28]:
        - button "Search lessons... ⌘K" [ref=e29] [cursor=pointer]:
          - generic [ref=e33]: Search lessons...
          - generic [ref=e34]: ⌘K
        - button "Toggle theme" [ref=e35] [cursor=pointer]
    - generic [ref=e38]:
      - complementary [ref=e39]:
        - generic [ref=e40]:
          - generic [ref=e41]: Curriculum
          - generic [ref=e45]: 27 lessons
        - generic [ref=e46]:
          - generic [ref=e47]:
            - button "01. Java Foundations 0/8" [ref=e48] [cursor=pointer]:
              - generic [ref=e49]: 01. Java Foundations
              - generic [ref=e53]: 0/8
            - generic [ref=e58]:
              - button "How Java Runs Your Code" [ref=e59] [cursor=pointer]
              - 'button "OOP: The Four Pillars in Enterprise Java" [ref=e61] [cursor=pointer]'
              - button "Memory Model & Garbage Collection" [ref=e63] [cursor=pointer]
              - button "Data Types, String Pool & Immutability" [ref=e65] [cursor=pointer]
              - button "Exception Handling & Fault Tolerance" [ref=e67] [cursor=pointer]
              - button "Object Headers, Compressed OOPs & TLAB" [ref=e69] [cursor=pointer]
              - button "Escape Analysis & Scalar Replacement" [ref=e71] [cursor=pointer]
              - 'button "Modern Garbage Collection: G1 vs Generational ZGC" [ref=e73] [cursor=pointer]'
          - button "02. Collections & Streams 0/4" [ref=e76] [cursor=pointer]:
            - generic [ref=e77]: 02. Collections & Streams
            - generic [ref=e81]: 0/4
          - button "03. Concurrency & Async 0/6" [ref=e86] [cursor=pointer]:
            - generic [ref=e87]: 03. Concurrency & Async
            - generic [ref=e91]: 0/6
          - button "04. Spring Boot & Microservices 0/3" [ref=e96] [cursor=pointer]:
            - generic [ref=e97]: 04. Spring Boot & Microservices
            - generic [ref=e101]: 0/3
          - button "05. REST API & Security 0/2" [ref=e106] [cursor=pointer]:
            - generic [ref=e107]: 05. REST API & Security
            - generic [ref=e111]: 0/2
          - button "06. Database & Persistence 0/1" [ref=e116] [cursor=pointer]:
            - generic [ref=e117]: 06. Database & Persistence
            - generic [ref=e121]: 0/1
          - button "07. DevOps & Observability 0/3" [ref=e126] [cursor=pointer]:
            - generic [ref=e127]: 07. DevOps & Observability
            - generic [ref=e131]: 0/3
        - generic [ref=e135]:
          - generic [ref=e136]:
            - generic [ref=e137]: PROGRESS
            - generic [ref=e138]: 0 / 27 (0%)
          - generic [ref=e140]: Progress saved locally in browser
      - main [ref=e141]:
        - generic [ref=e142]:
          - generic [ref=e144]:
            - generic [ref=e145]:
              - generic [ref=e146]:
                - generic [ref=e147]: 01. Java Foundations
                - generic [ref=e148]: /
                - generic [ref=e149]: How Java Runs Your Code
              - generic [ref=e150]:
                - generic [ref=e151]:
                  - heading "How Java Runs Your Code" [level=1] [ref=e152]
                  - paragraph [ref=e153]: Follow your code from .java file through compilation to JVM native execution.
                - generic [ref=e154]:
                  - generic [ref=e155]: 12 min
                  - generic [ref=e160]: Beginner
                  - generic [ref=e163]: 7 steps
            - generic [ref=e170]:
              - generic [ref=e171]:
                - button "3D Iso" [ref=e172] [cursor=pointer]
                - button "Break It" [ref=e178] [cursor=pointer]
                - button "Replay" [ref=e184] [cursor=pointer]
                - button "Pause" [ref=e188] [cursor=pointer]
              - generic [ref=e193]:
                - generic [ref=e194]:
                  - generic [ref=e195]:
                    - generic [ref=e196]: EXECUTION MODE
                    - generic [ref=e197]: Level 0 Interpreter
                  - generic [ref=e198]:
                    - generic [ref=e199]: CLASS VERIFICATION
                    - generic [ref=e200]: Magic 0xCAFEBABE Verified
                  - generic [ref=e201]:
                    - generic [ref=e202]: INVOCATION COUNTER
                    - generic [ref=e203]: 342 Calls (Profiling)
                  - generic [ref=e204]:
                    - generic [ref=e205]: CODE CACHE
                    - generic [ref=e206]: 2.4 MB / 240 MB Reserved
                - img [ref=e208]:
                  - generic [ref=e210]: JVM Runtime Environment
                  - generic [ref=e217]:
                    - generic: Developer
                    - generic [ref=e222]: PaymentService.java
                  - generic [ref=e225]:
                    - generic [ref=e232]: AST Parsing
                    - generic: javac Compiler
                    - generic: Bytecode Parser
                  - generic [ref=e236]:
                    - generic [ref=e243]: Interpreting
                    - generic: JVM Engine
                    - generic: HotSpot C1 / C2
                  - generic [ref=e247]:
                    - generic [ref=e254]: "StackFrame #1"
                    - generic: Thread Stack
                    - generic: Frames & Vars
                  - generic [ref=e258]:
                    - generic [ref=e265]: Live Objects
                    - generic: Heap Memory
                    - generic: Eden & Old Gen
                  - generic [ref=e269]:
                    - generic [ref=e276]: x86-64 / ARM
                    - generic: Host CPU / OS
                    - generic: Native Assembly
                - generic [ref=e294]:
                  - generic [ref=e295]:
                    - generic [ref=e296]: request
                    - generic [ref=e298]: heavy
                    - generic [ref=e300]: memory
                    - generic [ref=e302]: exception
                  - generic [ref=e304]: 3D ISOMETRIC ENGINE
            - generic [ref=e306]:
              - generic [ref=e307]:
                - generic [ref=e308]: In this lesson
                - generic [ref=e309]: Step 1 of 7
              - generic [ref=e310]:
                - 'button "1 Hit Enter: Write Source Code" [ref=e311] [cursor=pointer]':
                  - generic [ref=e312]: "1"
                  - generic [ref=e313]: "Hit Enter: Write Source Code"
                - button "2 javac Compiles to Bytecode" [ref=e315] [cursor=pointer]:
                  - generic [ref=e316]: "2"
                  - generic [ref=e317]: javac Compiles to Bytecode
                - button "3 ClassLoader Hierarchy" [ref=e319] [cursor=pointer]:
                  - generic [ref=e320]: "3"
                  - generic [ref=e321]: ClassLoader Hierarchy
                - button "4 Bytecode Verification & Linking" [ref=e323] [cursor=pointer]:
                  - generic [ref=e324]: "4"
                  - generic [ref=e325]: Bytecode Verification & Linking
                - 'button "5 Execution Engine: Interpreter & JIT" [ref=e327] [cursor=pointer]':
                  - generic [ref=e328]: "5"
                  - generic [ref=e329]: "Execution Engine: Interpreter & JIT"
                - 'button "6 Stack vs Heap: Runtime Data Areas" [ref=e331] [cursor=pointer]':
                  - generic [ref=e332]: "6"
                  - generic [ref=e333]: "Stack vs Heap: Runtime Data Areas"
                - 'button "7 Recap: The Complete Lifecycle" [ref=e335] [cursor=pointer]':
                  - generic [ref=e336]: "7"
                  - generic [ref=e337]: "Recap: The Complete Lifecycle"
          - complementary [ref=e338]:
            - generic [ref=e339]:
              - generic [ref=e340]:
                - generic [ref=e341]:
                  - generic [ref=e342]: Step 1 / 7
                  - generic [ref=e343]: problem
                - generic [ref=e344]:
                  - 'heading "Hit Enter: Write Source Code" [level=2] [ref=e345]'
                  - paragraph [ref=e346]: From human-readable syntax to disk
                - generic [ref=e347]:
                  - generic [ref=e348]: Production Mystery
                  - paragraph [ref=e352]: "Why did our payment microservice take 3.2 seconds to serve its first 100 requests right after deployment, but later sustained 60,000 req/sec at 0.4ms average latency across 24 concurrent worker threads? This warm-up curve reflects the JVM startup lifecycle: initial class loading, connection pool warm-up, DB query cache readiness, and the HotSpot JIT compiler transitioning hot paths from cold bytecode interpretation into Tier 4 C2 profile-guided native machine code."
                - generic [ref=e354]:
                  - paragraph [ref=e355]:
                    - text: Every enterprise backend starts with plain text in a
                    - code [ref=e356]: .java
                    - text: file. Whether you write a high-throughput payment handler or a simple utility, the CPU cannot execute Java source code directly.
                  - paragraph [ref=e357]:
                    - text: "Unlike ahead-of-time (AOT) compiled languages like C or Go that emit CPU machine code targeted directly at specific x86 or ARM instruction sets, Java was designed around the architectural philosophy:"
                    - strong [ref=e358]: "\"Write Once, Run Anywhere\" (WORA)"
                    - text: .
                  - paragraph [ref=e359]:
                    - text: To achieve hardware independence, Java source code is compiled into an intermediate representation known as
                    - strong [ref=e360]: Java Bytecode
                    - text: . Let's follow what happens the moment you compile.
                - generic [ref=e361]:
                  - generic [ref=e362]: Key Idea
                  - generic [ref=e366]: Java achieves platform independence by compiling source code to intermediate bytecode rather than direct CPU machine code.
                - generic [ref=e367]:
                  - generic [ref=e368]:
                    - generic [ref=e369]: PaymentProcessor.java
                    - button "Copy code to clipboard" [ref=e371] [cursor=pointer]:
                      - generic [ref=e375]: Copy
                  - code [ref=e377]:
                    - generic [ref=e378]:
                      - generic [aria-hidden]: "1"
                      - generic [ref=e379]: package com.bank.payment;
                    - generic [ref=e380]:
                      - generic [aria-hidden]: "2"
                    - generic [ref=e382]:
                      - generic [aria-hidden]: "3"
                      - generic [ref=e383]: "public class PaymentProcessor {"
                    - generic [ref=e384]:
                      - generic [aria-hidden]: "4"
                      - generic [ref=e385]: "public static void main(String[] args) {"
                    - generic [ref=e386]:
                      - generic [aria-hidden]: "5"
                      - generic [ref=e387]: double amount = 150.0;
                    - generic [ref=e388]:
                      - generic [aria-hidden]: "6"
                      - generic [ref=e389]: boolean approved = processTransaction(amount);
                    - generic [ref=e390]:
                      - generic [aria-hidden]: "7"
                      - generic [ref=e391]: "System.out.println(\"Status: \" + (approved ? \"SUCCESS\" : \"DECLINED\"));"
                    - generic [ref=e392]:
                      - generic [aria-hidden]: "8"
                      - generic [ref=e393]: "}"
                    - generic [ref=e394]:
                      - generic [aria-hidden]: "9"
                    - generic [ref=e396]:
                      - generic [aria-hidden]: "10"
                      - generic [ref=e397]: "private static boolean processTransaction(double amount) {"
                    - generic [ref=e398]:
                      - generic [aria-hidden]: "11"
                      - generic [ref=e399]: return amount > 0 && amount <= 5000.0;
                    - generic [ref=e400]:
                      - generic [aria-hidden]: "12"
                      - generic [ref=e401]: "}"
                    - generic [ref=e402]:
                      - generic [aria-hidden]: "13"
                      - generic [ref=e403]: "}"
                - generic [ref=e404]:
                  - generic [ref=e405]: Interview Question & Takeaway
                  - generic [ref=e411]: Why does Java use an intermediate bytecode instead of compiling directly to native machine instructions like C++? Bytecode enables write-once platform portability across OS/CPU architectures, while allowing runtime profile-guided JIT compilation that can rival or outperform static AOT compilers on long-running, branch-heavy server workloads.
                - generic [ref=e412]:
                  - heading "You'll Learn" [level=3] [ref=e413]
                  - generic [ref=e414]:
                    - generic [ref=e415]: What happens when you run javac vs java
                    - generic [ref=e420]: The binary layout of .class bytecode (CAFEBABE)
                    - generic [ref=e425]: The 3-phase ClassLoader hierarchy and bytecode verification
                    - generic [ref=e430]: How the Execution Engine switches between Interpreter and JIT (C1/C2)
                    - generic [ref=e435]: Stack memory frames vs Heap memory allocations
              - generic [ref=e440]:
                - generic [ref=e441]:
                  - button "Back" [disabled] [ref=e442]
                  - 'button "Next: javac Compiles to Bytecode" [ref=e446] [cursor=pointer]'
                - generic [ref=e450]: ← → step · R replay · Space pause
    - generic [ref=e452]:
      - generic [ref=e453]:
        - textbox "Search Java concepts, topics, steps (e.g. CompletableFuture, G1 GC, Virtual Threads)..." [active] [ref=e457]: HashMap
        - button [ref=e458] [cursor=pointer]
      - generic [ref=e462]:
        - generic [ref=e463] [cursor=pointer]:
          - generic [ref=e469]:
            - generic [ref=e470]: Memory Leaks & OutOfMemoryError in Java
            - generic [ref=e472]: Memory Model & Garbage Collection · Step 5
          - generic [ref=e473]: trade-off
        - generic [ref=e474] [cursor=pointer]:
          - generic [ref=e480]:
            - generic [ref=e481]: The String Pool & Immutability
            - generic [ref=e483]: Data Types, String Pool & Immutability · Step 2
          - generic [ref=e484]: insight
        - generic [ref=e485] [cursor=pointer]:
          - generic [ref=e490]:
            - generic [ref=e491]: Collections Framework Deep Dive
            - generic [ref=e493]: Navigate the collection hierarchy and master ArrayList, LinkedList, and HashMap bucket internals.
          - generic [ref=e494]: Intermediate
        - generic [ref=e495] [cursor=pointer]:
          - generic [ref=e501]:
            - generic [ref=e502]: "HashMap Internals: Hash, Buckets & Treeify"
            - generic [ref=e504]: Collections Framework Deep Dive · Step 3
          - generic [ref=e505]: solution
        - generic [ref=e506] [cursor=pointer]:
          - generic [ref=e512]:
            - generic [ref=e513]: "ConcurrentHashMap: Lock Striping & CAS"
            - generic [ref=e515]: Collections Framework Deep Dive · Step 4
          - generic [ref=e516]: insight
        - generic [ref=e517] [cursor=pointer]:
          - generic [ref=e523]:
            - generic [ref=e524]: "The Solution: Cache Line Padding & @Contended"
            - generic [ref=e526]: JMM, CPU Caches & False Sharing · Step 2
          - generic [ref=e527]: solution
      - generic [ref=e528]:
        - generic [ref=e529]:
          - generic [ref=e530]: ↑↓ to navigate
          - generic [ref=e531]: ↵ to select
          - generic [ref=e532]: ESC to close
        - generic [ref=e533]: Java Internals
  - alert [ref=e534]
```

# Test source

```ts
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
  127 |     expect(robotsText).toContain('User-agent: *');
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
> 173 |     await resultItem.click();
      |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
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