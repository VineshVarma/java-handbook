# E2E Test Infra: Java Handbook (`VineshVarma/java-handbook`)

## Test Philosophy
- **Opaque-Box & Requirement-Driven**: Tests interact strictly as an end user through visible UI text, accessible roles (buttons, links, headings, inputs), and browser keyboard/touch events. Tests have zero dependency on internal React component structure or state hooks.
- **Methodology**: 4-Tier Test Architecture based on Category-Partitioning, Boundary Value Analysis (BVA), Pairwise Combinatorial Interaction Testing, and Realistic Real-World Workload Testing.

## Feature Inventory & Requirement Mapping
| # | Feature Area | Source Requirement | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Pairwise) |
|---|--------------|--------------------|:-----------------:|:-----------------:|:-----------------:|
| F1 | Header & Curriculum Navigation | ORIGINAL_REQUEST §R6, PROJECT.md F25, F27 | 5 tests | 5 tests | ✓ |
| F2 | Interactive Stepper & Step Content | ORIGINAL_REQUEST §R6, PROJECT.md F26, F27 | 5 tests | 5 tests | ✓ |
| F3 | Interactive Diagram Engine & Simulation | ORIGINAL_REQUEST §R5, PROJECT.md F7-F12 | 5 tests | 5 tests | ✓ |
| F4 | Code Blocks & Developer Experience | ORIGINAL_REQUEST §R3, PROJECT.md F17 | 5 tests | 5 tests | ✓ |
| F5 | Global Search & Discovery | ORIGINAL_REQUEST §R6, PROJECT.md F27 | 5 tests | 5 tests | ✓ |
| F6 | Progress Tracking & Persistence | ORIGINAL_REQUEST §R6, PROJECT.md F28 | 5 tests | 5 tests | ✓ |
| F7 | Responsive Layout & Mobile Ergonomics | ORIGINAL_REQUEST §R6, PROJECT.md F27 | 5 tests | 5 tests | ✓ |
| **Total** | **7 Requirement Areas** | | **35 tests** | **35 tests** | **10 tests** |

## Test Architecture

### 1. Test Runner & Execution
- **Runner**: Playwright (`@playwright/test` v1.65.1+)
- **Browsers**: Chromium, WebKit (Desktop Safari), Mobile Safari (emulated iPhone 12 / WebKit)
- **Invocation**:
  - Full suite (against Production): `USE_PROD=1 npx playwright test`
  - Full suite (against Local Build): `npx serve -l 3000 out & PLAYWRIGHT_TEST_BASE_URL="http://localhost:3000" npx playwright test`
  - Tier-specific execution: `npx playwright test tests/tier1-features.spec.ts`, etc.
- **Pass/Fail Semantics**:
  - Exit code `0` on 100% pass across all assertions.
  - Zero unhandled console exceptions or runtime crashes during test execution.

### 2. Directory Layout
```
tests/
├── e2e.spec.ts                  # Baseline smoke & core validation suite (5 existing tests)
├── tier1-features.spec.ts        # Tier 1: 35 Feature Coverage tests across F1-F7
├── tier2-boundaries.spec.ts      # Tier 2: 35 Boundary & Corner Case tests across F1-F7
├── tier3-combinations.spec.ts    # Tier 3: 10 Cross-Feature Pairwise Interaction tests
└── tier4-journeys.spec.ts        # Tier 4: 6 End-to-End Real-World Learner Workflows
```

### 3. Test Case Specification

#### Tier 1: Feature Coverage (≥5 per feature area = 35 tests)
- **F1. Header & Curriculum Navigation**:
  - `F1.1`: Brand logo navigation returns to root and loads handbook interface.
  - `F1.2`: Sidebar module accordion toggles expand/collapse state independently.
  - `F1.3`: Clicking sidebar lesson button deep links to `/lessons/{slug}` and updates H1.
  - `F1.4`: Header tabs render cleanly; inactive tabs (Practice/Cheatsheets) show toast notification.
  - `F1.5`: Theme toggle alternates `html` element class between `light` and `dark`.
- **F2. Interactive Stepper & Step Content**:
  - `F2.1`: Clicking Next button advances step index, updates URL/heading, and highlights active step pill.
  - `F2.2`: Clicking Back button decrements step index; Back button is disabled on Step 1.
  - `F2.3`: Keyboard navigation (`ArrowRight` / `ArrowLeft`) smoothly advances and reverses steps.
  - `F2.4`: Markdown content renders lists, bold formatting, inline code, and key idea callouts cleanly.
  - `F2.5`: Terminal step of the course displays completion state (`Finish Course`) and completion loop.
- **F3. Interactive Diagram Engine & Simulation**:
  - `F3.1`: View mode toggle switches between "3D Iso" and "2D Flat" projections.
  - `F3.2`: Replay button (`R` shortcut and click) triggers animation replay without runtime errors.
  - `F3.3`: Play/Pause button toggles animation playback state and aria-label.
  - `F3.4`: "Break It" scenario selection (`hot-calls`) updates telemetry metrics to HotSpot Level 4 C2.
  - `F3.5`: "Break It" recursion scenario renders `StackOverflowError` warning banner on stage canvas.
- **F4. Code Blocks & Developer Experience**:
  - `F4.1`: Syntax-highlighted code block displays language badge and line numbers in table gutter.
  - `F4.2`: Clicking Copy button triggers "Copied" feedback state with checkmark icon.
  - `F4.3`: Copied clipboard text contains pure Java syntax without line numbers or annotations.
  - `F4.4`: Code block with `beforeCode` (Lambdas lesson) renders "Before" and "After / Modern" tabs.
  - `F4.5`: Toggling "Before" and "After" tabs dynamically swaps code snippet content.
- **F5. Global Search & Discovery**:
  - `F5.1`: Opening search dialog displays top 6 suggested lessons in zero-query state.
  - `F5.2`: Keyboard shortcut `Cmd+K` / `Ctrl+K` opens search modal; `Escape` closes it.
  - `F5.3`: Typing query (e.g. "Virtual Threads") filters results across lessons and step titles.
  - `F5.4`: Keyboard navigation (`ArrowDown`, `ArrowUp`) moves active selection; `Enter` navigates to target lesson.
  - `F5.5`: Non-matching query (e.g. "xyz123nonexistent") displays empty state message.
- **F6. Progress Tracking & Persistence**:
  - `F6.1`: Advancing through steps records completed step indices in localStorage.
  - `F6.2`: Completing all steps in a lesson renders checkmark icon in Sidebar lesson list.
  - `F6.3`: Sidebar bottom progress bar calculates and displays accurate percentage (`completed / total`).
  - `F6.4`: Reloading the browser preserves completed step indices and lesson checkmarks.
  - `F6.5`: Direct URL access to a previously completed lesson reflects completed status on step timeline pills.
- **F7. Responsive Layout & Mobile Ergonomics**:
  - `F7.1`: Mobile viewport (< 768px) shows hamburger menu; clicking opens curriculum drawer.
  - `F7.2`: Mobile segment switcher alternates between "Simulation" (Diagram) and "Notes & Code".
  - `F7.3`: Floating mobile peek button (`data-testid="mobile-toggle-tab"`) toggles active pane.
  - `F7.4`: Diagram canvas includes `.touch-pan-y` class to ensure vertical scrolling is not hijacked.
  - `F7.5`: Search input font size is `>= 16px` on mobile viewports to prevent iOS Safari auto-zoom.

#### Tier 2: Boundary & Corner Cases (≥5 per feature area = 35 tests)
- **F1 Boundaries**:
  - `B1.1`: Deep link to invalid lesson slug defaults gracefully without unhandled crashes.
  - `B1.2`: Rapid multi-clicking on different sidebar lessons without waiting for transitions.
  - `B1.3`: Out-of-bounds step index in URL clamps gracefully to valid step range.
  - `B1.4`: Negative step index in URL clamps to step 0.
  - `B1.5`: Navigating between lessons with differing step counts resets step index cleanly.
- **F2 Boundaries**:
  - `B2.1`: Pressing `ArrowLeft` on step 1 of lesson 1 does not throw error and keeps step at 0.
  - `B2.2`: Rapid double-pressing `ArrowRight` advances smoothly without skipping steps.
  - `B2.3`: Microcheck: selecting incorrect option displays explanation without blocking progression.
  - `B2.4`: Microcheck: toggling selection from incorrect to correct updates feedback text and styling.
  - `B2.5`: Pressing keyboard shortcuts while an input or modal is focused does NOT advance steps.
- **F3 Boundaries**:
  - `B3.1`: Rapidly toggling view mode (3D -> 2D -> 3D) while animation is actively playing.
  - `B3.2`: Switching simulation scenarios while animation is paused maintains paused state.
  - `B3.3`: Rapidly clicking replay button multiple times does not produce overlapping packet animations.
  - `B3.4`: Resizing viewport while diagram is animating retains SVG aspect ratio (`preserveAspectRatio`).
  - `B3.5`: Lessons with static diagram handle default state cleanly without console warnings.
- **F4 Boundaries**:
  - `B4.1`: Long code lines scroll horizontally within code block container without breaking page layout.
  - `B4.2`: Rapidly clicking copy button multiple times resets the 2-second timeout cleanly.
  - `B4.3`: Code block with empty or missing language tag falls back gracefully to default formatting.
  - `B4.4`: Code block with special characters (`<`, `>`, `&`, `"`) renders escaped HTML entities properly.
  - `B4.5`: Multiple code blocks on the same step maintain independent copy state.
- **F5 Boundaries**:
  - `B5.1`: Typing query with special regex characters (`.*+?^${}()|[]\`) does not crash search filter.
  - `B5.2`: Query with leading and trailing whitespace is trimmed properly.
  - `B5.3`: Extremely long search string (200+ characters) is handled gracefully with empty state.
  - `B5.4`: Rapid typing and immediate backspacing to empty restores default suggested lessons.
  - `B5.5`: Pressing `ArrowDown` at the last search result wraps around to the first result.
- **F6 Boundaries**:
  - `B6.1`: Corrupted JSON in localStorage is handled gracefully without crashing page.
  - `B6.2`: Pre-populating localStorage with all 27 lessons completed renders 100% progress and all checkmarks.
  - `B6.3`: Clearing localStorage while browsing resets progress bar to 0% on next action.
  - `B6.4`: Duplicated step completion events do not create duplicate entries in completedSteps array.
  - `B6.5`: LocalStorage quota exceeded simulation does not crash the reader interface.
- **F7 Boundaries**:
  - `B7.1`: Viewport resize across `xl` breakpoint (1280px) transitions smoothly between split-pane and tabbed mode.
  - `B7.2`: Opening mobile menu drawer, resizing to desktop, and resizing back to mobile preserves layout state.
  - `B7.3`: Zero horizontal overflow confirmed across extreme viewport widths (320px, 375px, 414px, 768px, 1024px, 1920px).
  - `B7.4`: Rapidly toggling floating mobile peek button switches view without DOM thrashing.
  - `B7.5`: Search modal on small mobile screen fits within viewport height (`max-h-[75vh]`) with internal scroll.

#### Tier 3: Cross-Feature Combinations (Pairwise Coverage = 10 tests)
| # | Pairwise Interaction | Features | Verification Focus |
|---|----------------------|----------|-------------------|
| P1 | Search + Simulator | F5 + F3 | Search for "Virtual Threads", navigate, trigger "Pin Virtual Thread" simulation; verify stage & telemetry |
| P2 | Theme + Stepper | F1 + F2 | Switch to dark theme on step 1, advance through 3 steps; verify dark theme classes persist on all panes |
| P3 | View Mode + Lesson Nav | F3 + F1 | Switch to 2D Flat mode, navigate to next lesson via Sidebar; verify 2D view preference remains consistent |
| P4 | Code Tabs + Copy | F4 + F2 | On Lambdas lesson, toggle "Before", copy; toggle "After", copy; verify clipboard matches active tab |
| P5 | Micro-Check + Keyboard | F2 + F6 | Complete microcheck quiz, then immediately press `ArrowRight`; verify step advances & progress persists |
| P6 | Mobile Drawer + Search | F7 + F5 | Open mobile sidebar drawer, trigger search modal via Cmd+K, select result; verify drawer & modal close |
| P7 | Progress + Deep Linking | F6 + F1 | Complete 3 steps of lesson 1, open deep link to lesson 5; verify combined progress bar reflects both |
| P8 | Simulator + Replay | F3 + F2 | Select "hot-calls" scenario, let animate, press Replay; verify scenario remains active with JIT telemetry |
| P9 | Terminal Step + Sidebar | F2 + F1 | Navigate to terminal step of lesson 27, then click lesson 1 in Sidebar; verify step resets cleanly to 0 |
| P10 | Search + Browser History | F5 + F1 | Search and navigate to lesson 3, press Browser Back; verify URL and layout synchronize with history |

## Real-World Application Scenarios (Tier 4: ≥5 scenarios = 6 scenarios)
| # | Scenario Name | Features Exercised | User Journey Description | Complexity |
|---|---------------|--------------------|--------------------------|------------|
| S1 | Junior Engineer Onboarding Journey | F1, F2, F3, F4, F6 | First-time visitor completes lesson 1 steps, copies bytecode, answers microcheck, advances to lesson 2 | Medium |
| S2 | Senior Performance Engineer Debugging Journey | F5, F3, F2, F7 | Uses search for ZGC, investigates simulation telemetry, switches 2D/3D views, completes memory checks | High |
| S3 | Microservices Developer Spring Boot Flow | F1, F2, F4, F6 | Navigates Module 04 via sidebar, steps through DispatcherServlet, DI, and resilience patterns to complete module | High |
| S4 | Mobile Commuter Learning on iOS Safari | F7, F3, F2, F5 | Mobile emulation (375x812), hamburger menu, tab switcher, notes peek, zero horizontal overflow | High |
| S5 | Keyboard-Only Power User Journey | F5, F2, F3, F1 | No mouse usage: Cmd+K search, arrow navigation, Enter, step shortcuts, replay 'R', pause 'Space' | High |
| S6 | Full Module Completion & Return Journey | F1, F2, F6 | Steps through all 8 lessons of Module 01, verifies 33% progress, reloads browser, verifies persisted checkmarks | Very High |

## Coverage Thresholds
- **Tier 1 (Feature Coverage)**: ≥5 tests per feature area across 7 areas (35 tests total)
- **Tier 2 (Boundary & Corner)**: ≥5 tests per feature area across 7 areas (35 tests total)
- **Tier 3 (Cross-Feature Combinations)**: 10 major pairwise interaction tests
- **Tier 4 (Real-World Scenarios)**: 6 comprehensive end-user application workflows
- **Total Suite Minimum**: 86 tests (excluding baseline `e2e.spec.ts`)
