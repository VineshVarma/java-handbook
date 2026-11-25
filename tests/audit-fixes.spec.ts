import { test, expect, Locator, Page } from '@playwright/test';

// ============================================================================
// Shared Types & Opaque-Box Geometry / Contrast / Error Helpers
// ============================================================================

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

const VIEWPORTS: Record<'narrowMobile' | 'mobile' | 'tablet' | 'laptop' | 'desktop', ViewportSize> = {
  narrowMobile: { width: 320, height: 568 },
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
};

function toBounds(r: Rect): Bounds {
  return {
    left: r.x,
    top: r.y,
    right: r.x + r.width,
    bottom: r.y + r.height,
    width: r.width,
    height: r.height,
  };
}

function boxesOverlap(a: Rect, b: Rect, tolerance = 1): boolean {
  const ab = toBounds(a);
  const bb = toBounds(b);
  if (ab.width <= 0 || ab.height <= 0 || bb.width <= 0 || bb.height <= 0) {
    return false;
  }
  return !(
    ab.right <= bb.left + tolerance ||
    bb.right <= ab.left + tolerance ||
    ab.bottom <= bb.top + tolerance ||
    bb.bottom <= ab.top + tolerance
  );
}

function isContainedIn(inner: Rect, outer: Rect, tolerance = 2): boolean {
  const ib = toBounds(inner);
  const ob = toBounds(outer);
  return (
    ib.left >= ob.left - tolerance &&
    ib.top >= ob.top - tolerance &&
    ib.right <= ob.right + tolerance &&
    ib.bottom <= ob.bottom + tolerance
  );
}

function isInsideViewport(r: Rect, vw: number, vh: number, tolerance = 1): boolean {
  const b = toBounds(r);
  return (
    b.left >= -tolerance &&
    b.top >= -tolerance &&
    b.right <= vw + tolerance &&
    b.bottom <= vh + tolerance
  );
}

async function requireBox(locator: Locator, description: string): Promise<Rect> {
  await expect(locator, `${description} should be visible`).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${description} should have a valid bounding box`).not.toBeNull();
  return box as Rect;
}

interface ErrorTracker {
  assertNoFatalErrors: () => void;
  assertNoHydrationWarnings: () => void;
}

function attachErrorTracker(page: Page, options?: { allowHttp404?: boolean }): ErrorTracker {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const hydrationWarnings: string[] = [];
  const allowHttp404 = options?.allowHttp404 ?? false;

  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      if (/hydration|did not match|server rendered html|hydrating/i.test(text)) {
        hydrationWarnings.push(text);
      }
    }
    if (type === 'error') {
      consoleErrors.push(text);
    }
  });

  return {
    assertNoFatalErrors: () => {
      const fatalPageErrors = pageErrors.filter(
        (e) =>
          !/favicon|ResizeObserver|_vercel/i.test(e) &&
          !(allowHttp404 && /404|Failed to load resource/i.test(e))
      );
      const fatalConsoleErrors = consoleErrors.filter(
        (e) =>
          !/favicon|ResizeObserver|_vercel/i.test(e) &&
          !(allowHttp404 && /404|Failed to load resource|status of 404/i.test(e))
      );
      expect(fatalPageErrors, `Unexpected pageerror(s): ${fatalPageErrors.join(' | ')}`).toHaveLength(0);
      expect(fatalConsoleErrors, `Unexpected console.error(s): ${fatalConsoleErrors.join(' | ')}`).toHaveLength(0);
    },
    assertNoHydrationWarnings: () => {
      expect(
        hydrationWarnings,
        `Unexpected hydration warning(s): ${hydrationWarnings.join(' | ')}`
      ).toHaveLength(0);
    },
  };
}

async function assertNoHorizontalOverflow(page: Page, tolerance = 1): Promise<void> {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(
    metrics.scrollWidth,
    `Horizontal overflow detected: scrollWidth=${metrics.scrollWidth}, innerWidth=${metrics.innerWidth}`
  ).toBeLessThanOrEqual(metrics.innerWidth + tolerance);
}

async function selectLessonStep(page: Page, stepIndex: number): Promise<void> {
  const stepCounterRegex = new RegExp(`Step ${stepIndex + 1} of \\d+`, 'i');
  if (stepIndex === 0) {
    await expect(page.locator('#diagram-pane').getByText(stepCounterRegex).first()).toBeVisible();
    return;
  }

  const stepProgress = page
    .locator('#diagram-pane div')
    .filter({ has: page.getByText('In this lesson', { exact: true }) })
    .filter({ has: page.locator('button[title]') })
    .last();

  const pill = stepProgress.locator('button[title]').nth(stepIndex);
  await expect(pill, `StepProgress pill #${stepIndex + 1} should be visible`).toBeVisible();
  await pill.click();
  await expect(
    page.locator('#diagram-pane').getByText(stepCounterRegex).first(),
    `Expected StepProgress counter to advance to Step ${stepIndex + 1}`
  ).toBeVisible();
}

interface TelemetryGeometry {
  hudLabelBox: Rect | null;
  illustrativeBox: Rect | null;
  cardBoxes: Rect[];
}

async function getTelemetryGeometry(page: Page): Promise<TelemetryGeometry> {
  return page.evaluate(() => {
    const pane = document.getElementById('diagram-pane');
    if (!pane) {
      return { hudLabelBox: null, illustrativeBox: null, cardBoxes: [] };
    }

    const toRect = (el: Element): Rect => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };

    const allElements = Array.from(pane.querySelectorAll('span, div, p'));
    let hudLabelBox: Rect | null = null;
    let illustrativeBox: Rect | null = null;

    for (const el of allElements) {
      const ownText = Array.from(el.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent?.trim() ?? '')
        .join(' ')
        .trim();

      if (!hudLabelBox && /HUD Telemetry/i.test(ownText)) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          hudLabelBox = toRect(el);
        }
      }
      if (!illustrativeBox && /\(Illustrative Simulation\)/i.test(ownText)) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          illustrativeBox = toRect(el);
        }
      }
    }

    const svg = pane.querySelector('svg');
    const svgTop = svg ? svg.getBoundingClientRect().top : Number.POSITIVE_INFINITY;

    // Locate the 4-card telemetry grid above the SVG stage
    const candidateGrids = Array.from(pane.querySelectorAll('div')).filter((div) => {
      const r = div.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0 || r.bottom > svgTop + 4) return false;
      const children = Array.from(div.children);
      if (children.length !== 4) return false;
      return children.every((child) => {
        const cr = child.getBoundingClientRect();
        return cr.width >= 60 && cr.height >= 24 && child.querySelectorAll('span').length >= 2;
      });
    });

    const cardBoxes: Rect[] =
      candidateGrids.length > 0
        ? Array.from(candidateGrids[0].children).map((c) => toRect(c))
        : [];

    return { hudLabelBox, illustrativeBox, cardBoxes };
  });
}

async function assertDiagramToolbarClearOfTelemetry(page: Page, contextLabel: string): Promise<void> {
  const controlTestIds = [
    'toggle-view-mode',
    'break-it-button',
    'replay-button',
    'play-pause-button',
  ] as const;

  const controlBoxes: Array<{ id: string; box: Rect }> = [];
  for (const id of controlTestIds) {
    const loc = page.getByTestId(id);
    const box = await requireBox(loc, `${contextLabel} toolbar control [${id}]`);
    controlBoxes.push({ id, box });
  }

  const telemetry = await getTelemetryGeometry(page);
  expect(
    telemetry.cardBoxes.length,
    `${contextLabel}: expected 4 telemetry cards in #diagram-pane`
  ).toBe(4);
  expect(telemetry.hudLabelBox, `${contextLabel}: expected HUD Telemetry label`).not.toBeNull();
  expect(
    telemetry.illustrativeBox,
    `${contextLabel}: expected (Illustrative Simulation) label`
  ).not.toBeNull();

  for (const ctrl of controlBoxes) {
    for (let i = 0; i < telemetry.cardBoxes.length; i++) {
      expect(
        boxesOverlap(ctrl.box, telemetry.cardBoxes[i], 1),
        `${contextLabel}: toolbar [${ctrl.id}] (${JSON.stringify(ctrl.box)}) overlaps telemetry card #${i + 1} (${JSON.stringify(telemetry.cardBoxes[i])})`
      ).toBe(false);
    }

    if (telemetry.hudLabelBox) {
      expect(
        boxesOverlap(ctrl.box, telemetry.hudLabelBox, 1),
        `${contextLabel}: toolbar [${ctrl.id}] overlaps HUD Telemetry label`
      ).toBe(false);
    }

    if (telemetry.illustrativeBox) {
      expect(
        boxesOverlap(ctrl.box, telemetry.illustrativeBox, 1),
        `${contextLabel}: toolbar [${ctrl.id}] overlaps (Illustrative Simulation)`
      ).toBe(false);
    }
  }
}

interface SvgAuditReport {
  textCount: number;
  outOfSvgBounds: Array<{ text: string; textBox: Rect; svgBox: Rect }>;
  outOfCardBounds2D: Array<{ text: string; textBox: Rect; cardBox: Rect }>;
  outOfNodeBounds3D: Array<{ text: string; textBox: Rect; nodeBox: Rect }>;
  siblingTextOverlaps: Array<{ textA: string; textB: string; boxA: Rect; boxB: Rect }>;
  contrastFailures: Array<{ text: string; fg: string; bg: string; ratio: number }>;
}

async function auditDiagramSvg(page: Page, is2DMode: boolean): Promise<SvgAuditReport> {
  return page.evaluate((check2DCards) => {
    const svg = document.querySelector('#diagram-pane svg');
    if (!svg) {
      return {
        textCount: 0,
        outOfSvgBounds: [],
        outOfCardBounds2D: [],
        outOfNodeBounds3D: [],
        siblingTextOverlaps: [],
        contrastFailures: [{ text: '<svg missing>', fg: '#000', bg: '#000', ratio: 0 }],
      };
    }

    const svgR = svg.getBoundingClientRect();
    const svgBox: Rect = { x: svgR.x, y: svgR.y, width: svgR.width, height: svgR.height };

    const toRect = (r: DOMRect): Rect => ({ x: r.x, y: r.y, width: r.width, height: r.height });

    const overlap = (a: Rect, b: Rect, tol = 1): boolean =>
      !(
        a.x + a.width <= b.x + tol ||
        b.x + b.width <= a.x + tol ||
        a.y + a.height <= b.y + tol ||
        b.y + b.height <= a.y + tol
      );

    const contained = (inner: Rect, outer: Rect, tol = 2): boolean =>
      inner.x >= outer.x - tol &&
      inner.y >= outer.y - tol &&
      inner.x + inner.width <= outer.x + outer.width + tol &&
      inner.y + inner.height <= outer.y + outer.height + tol;

    const isVisibleFilledShape = (el: Element): boolean => {
      const s = window.getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity || '1') === 0) {
        return false;
      }
      if ((s.filter && s.filter.includes('blur')) || (el.getAttribute('filter') || '').includes('blur')) {
        return false;
      }
      const fill = (s.fill || el.getAttribute('fill') || '').trim().toLowerCase();
      return fill !== '' && fill !== 'none' && fill !== 'transparent';
    };

    const pickLargestAreaElement = (els: Element[]): Element => {
      let best = els[0];
      let maxArea = -1;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const area = r.width * r.height;
        if (area > maxArea) {
          maxArea = area;
          best = el;
        }
      }
      return best;
    };

    interface Rgba {
      r: number;
      g: number;
      b: number;
      a: number;
    }

    const parseColor = (raw: string | null | undefined, elementOpacity = 1): Rgba | null => {
      if (!raw) return null;
      const val = raw.trim().toLowerCase();
      if (val === 'none' || val === 'transparent' || val.startsWith('url(')) return null;

      let r = 0;
      let g = 0;
      let b = 0;
      let a = 1;

      const rgbMatch = val.match(
        /^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/
      );
      if (rgbMatch) {
        r = Number(rgbMatch[1]);
        g = Number(rgbMatch[2]);
        b = Number(rgbMatch[3]);
        if (rgbMatch[4] !== undefined) {
          a = rgbMatch[4].endsWith('%') ? parseFloat(rgbMatch[4]) / 100 : parseFloat(rgbMatch[4]);
        }
      } else if (val.startsWith('#')) {
        const hex = val.slice(1);
        if (hex.length === 3 || hex.length === 4) {
          r = parseInt(hex[0] + hex[0], 16);
          g = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
          if (hex.length === 4) a = parseInt(hex[3] + hex[3], 16) / 255;
        } else if (hex.length === 6 || hex.length === 8) {
          r = parseInt(hex.slice(0, 2), 16);
          g = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
          if (hex.length === 8) a = parseInt(hex.slice(6, 8), 16) / 255;
        } else {
          return null;
        }
      } else {
        return null;
      }

      return { r, g, b, a: Math.max(0, Math.min(1, a * elementOpacity)) };
    };

    const composite = (fg: Rgba, bg: Rgba): Rgba => {
      const alpha = fg.a;
      return {
        r: fg.r * alpha + bg.r * (1 - alpha),
        g: fg.g * alpha + bg.g * (1 - alpha),
        b: fg.b * alpha + bg.b * (1 - alpha),
        a: 1,
      };
    };

    const srgbChannel = (c: number): number => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };

    const luminance = (c: Rgba): number =>
      0.2126 * srgbChannel(c.r) + 0.7152 * srgbChannel(c.g) + 0.0722 * srgbChannel(c.b);

    const calcContrast = (fg: Rgba, bg: Rgba): number => {
      const l1 = luminance(fg);
      const l2 = luminance(bg);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const STAGE_BG: Rgba = { r: 22, g: 21, b: 19, a: 1 }; // #161513

    const allShapes = Array.from(svg.querySelectorAll('rect, polygon, ellipse, path, circle')).filter(
      (shape) => !shape.closest('defs')
    );
    const allTexts = Array.from(svg.querySelectorAll('text'));

    const outOfSvgBounds: SvgAuditReport['outOfSvgBounds'] = [];
    const outOfCardBounds2D: SvgAuditReport['outOfCardBounds2D'] = [];
    const outOfNodeBounds3D: SvgAuditReport['outOfNodeBounds3D'] = [];
    const siblingTextOverlaps: SvgAuditReport['siblingTextOverlaps'] = [];
    const contrastFailures: SvgAuditReport['contrastFailures'] = [];

    interface VisibleTextNode {
      text: string;
      box: Rect;
      group: Element | null;
    }
    const visibleTexts: VisibleTextNode[] = [];

    for (const textEl of allTexts) {
      const rawText = (textEl.textContent ?? '').trim();
      if (!rawText) continue;

      const style = window.getComputedStyle(textEl);
      const opacity = parseFloat(style.opacity || '1');
      if (style.display === 'none' || style.visibility === 'hidden' || opacity === 0) {
        continue;
      }

      const tr = textEl.getBoundingClientRect();
      if (tr.width <= 0 || tr.height <= 0) continue;
      const textBox = toRect(tr);

      // 1. Check SVG stage boundary containment
      if (!contained(textBox, svgBox, 2)) {
        outOfSvgBounds.push({ text: rawText, textBox, svgBox });
      }

      // 2. Check node card / isometric top-face containment
      const directGroup = textEl.parentElement;
      if (directGroup && directGroup.tagName.toLowerCase() === 'g') {
        const groupChildren = Array.from(directGroup.children);

        if (check2DCards) {
          const siblingRects = groupChildren.filter(
            (ch) => ch.tagName.toLowerCase() === 'rect'
          );
          if (siblingRects.length > 0) {
            const filledRects = siblingRects.filter((rectEl) => {
              const rs = window.getComputedStyle(rectEl);
              return rs.fill !== 'none' && rs.fill !== 'transparent';
            });
            const containerRect = pickLargestAreaElement(
              filledRects.length > 0 ? filledRects : siblingRects
            );
            const cr = toRect(containerRect.getBoundingClientRect());
            if (cr.width > 0 && cr.height > 0 && !contained(textBox, cr, 2)) {
              outOfCardBounds2D.push({ text: rawText, textBox, cardBox: cr });
            }
          }
        } else {
          const filledPolygons = groupChildren.filter(
            (ch) => ch.tagName.toLowerCase() === 'polygon' && isVisibleFilledShape(ch)
          );
          const filledEllipses = groupChildren.filter(
            (ch) => ch.tagName.toLowerCase() === 'ellipse' && isVisibleFilledShape(ch)
          );
          const filledRects = groupChildren.filter(
            (ch) => ch.tagName.toLowerCase() === 'rect' && isVisibleFilledShape(ch)
          );

          if (filledPolygons.length > 0) {
            // IsoBlock top-face diamond or IsoLaptop upright screen: topmost non-blurred filled polygon
            let topPoly = filledPolygons[0];
            let minTop = topPoly.getBoundingClientRect().top;
            for (const poly of filledPolygons) {
              const top = poly.getBoundingClientRect().top;
              if (top < minTop) {
                minTop = top;
                topPoly = poly;
              }
            }
            const polyBox = toRect(topPoly.getBoundingClientRect());
            if (polyBox.width > 0 && polyBox.height > 0 && !contained(textBox, polyBox, 4)) {
              outOfNodeBounds3D.push({ text: rawText, textBox, nodeBox: polyBox });
            }
          } else if (filledEllipses.length > 0) {
            // IsoDatabase: check top-cap label inside ellipse; sublabels sit below the cylinder
            const capEllipse = filledEllipses[filledEllipses.length - 1];
            const capBox = toRect(capEllipse.getBoundingClientRect());
            const isBelowCylinderSublabel = textBox.y > capBox.y + capBox.height + 6;
            if (
              !isBelowCylinderSublabel &&
              capBox.width > 0 &&
              capBox.height > 0 &&
              !contained(textBox, capBox, 4)
            ) {
              outOfNodeBounds3D.push({ text: rawText, textBox, nodeBox: capBox });
            }
          } else if (filledRects.length > 0) {
            // Badges, IsoPedestal pill, IsoLaptop speech bubble, or simulation overlays
            const containerRect = pickLargestAreaElement(filledRects);
            const rectBox = toRect(containerRect.getBoundingClientRect());
            if (rectBox.width > 0 && rectBox.height > 0 && !contained(textBox, rectBox, 2)) {
              outOfNodeBounds3D.push({ text: rawText, textBox, nodeBox: rectBox });
            }
          }
        }
      }

      visibleTexts.push({
        text: rawText,
        box: textBox,
        group: textEl.closest('g'),
      });

      // 3. Compute WCAG 2.1 contrast ratio against underlying painted surface
      const fillOpacity = parseFloat(style.fillOpacity || '1');
      const rawFg = parseColor(style.fill || textEl.getAttribute('fill'), opacity * fillOpacity);
      if (!rawFg) continue;

      const cx = textBox.x + textBox.width / 2;
      const cy = textBox.y + textBox.height / 2;

      let bgColor: Rgba = STAGE_BG;
      for (const shape of allShapes) {
        // Only shapes painted BEFORE textEl in SVG DOM order can lie beneath it
        const pos = shape.compareDocumentPosition(textEl);
        if ((pos & Node.DOCUMENT_POSITION_FOLLOWING) === 0) continue;

        const shapeStyle = window.getComputedStyle(shape);
        const shapeOpacity = parseFloat(shapeStyle.opacity || '1');
        const shapeFillOpacity = parseFloat(shapeStyle.fillOpacity || '1');
        if (shapeStyle.display === 'none' || shapeStyle.visibility === 'hidden' || shapeOpacity === 0) {
          continue;
        }
        // Ignore blurred drop-shadow shapes
        if ((shapeStyle.filter && shapeStyle.filter.includes('blur')) || (shape.getAttribute('filter') || '').includes('blur')) {
          continue;
        }

        const parsedShapeFill = parseColor(
          shapeStyle.fill || shape.getAttribute('fill'),
          shapeOpacity * shapeFillOpacity
        );
        if (!parsedShapeFill || parsedShapeFill.a <= 0.05) continue;

        const sr = shape.getBoundingClientRect();
        if (cx >= sr.left && cx <= sr.right && cy >= sr.top && cy <= sr.bottom) {
          bgColor = composite(parsedShapeFill, bgColor);
        }
      }

      const finalFg = composite(rawFg, bgColor);
      const ratio = calcContrast(finalFg, bgColor);

      if (ratio < 4.5) {
        contrastFailures.push({
          text: rawText,
          fg: `rgb(${Math.round(finalFg.r)},${Math.round(finalFg.g)},${Math.round(finalFg.b)})`,
          bg: `rgb(${Math.round(bgColor.r)},${Math.round(bgColor.g)},${Math.round(bgColor.b)})`,
          ratio: Number(ratio.toFixed(2)),
        });
      }
    }

    // 4. Text overlap check across all visible SVG <text> nodes (including same-<g> label vs sublabel)
    for (let i = 0; i < visibleTexts.length; i++) {
      for (let j = i + 1; j < visibleTexts.length; j++) {
        const a = visibleTexts[i];
        const b = visibleTexts[j];
        if (overlap(a.box, b.box, 1)) {
          siblingTextOverlaps.push({
            textA: a.text,
            textB: b.text,
            boxA: a.box,
            boxB: b.box,
          });
        }
      }
    }

    return {
      textCount: visibleTexts.length,
      outOfSvgBounds,
      outOfCardBounds2D,
      outOfNodeBounds3D,
      siblingTextOverlaps,
      contrastFailures,
    };
  }, is2DMode);
}

async function assertSvgIntegrity(
  page: Page,
  is2DMode: boolean,
  contextLabel: string
): Promise<void> {
  const report = await auditDiagramSvg(page, is2DMode);
  expect(report.textCount, `${contextLabel}: expected visible SVG <text> elements`).toBeGreaterThan(0);
  expect(
    report.outOfSvgBounds,
    `${contextLabel}: SVG text escaped <svg> bounds: ${JSON.stringify(report.outOfSvgBounds)}`
  ).toHaveLength(0);
  if (is2DMode) {
    expect(
      report.outOfCardBounds2D,
      `${contextLabel}: 2D text escaped node card/pill bounds: ${JSON.stringify(report.outOfCardBounds2D)}`
    ).toHaveLength(0);
  } else {
    expect(
      report.outOfNodeBounds3D,
      `${contextLabel}: 3D text escaped isometric node/face bounds: ${JSON.stringify(report.outOfNodeBounds3D)}`
    ).toHaveLength(0);
  }
  expect(
    report.siblingTextOverlaps,
    `${contextLabel}: SVG text nodes overlap: ${JSON.stringify(report.siblingTextOverlaps)}`
  ).toHaveLength(0);
  expect(
    report.contrastFailures,
    `${contextLabel}: SVG text failed WCAG AA (>= 4.5:1): ${JSON.stringify(report.contrastFailures)}`
  ).toHaveLength(0);
}

// ============================================================================
// Tier 1: Audit Fix Feature Coverage (AF1 - AF12)
// ============================================================================

test.describe('Tier 1: Audit Fix Feature Coverage (AF1 - AF12)', () => {
  test('AF1a (Issue #1 Top Toolbar): Simulation toolbar controls do not overlap telemetry cards or HUD labels across viewports', async ({
    page,
  }) => {
    const viewports: Array<{ name: string; size: ViewportSize }> = [
      { name: 'mobile-375', size: VIEWPORTS.mobile },
      { name: 'tablet-768', size: VIEWPORTS.tablet },
      { name: 'desktop-1440', size: VIEWPORTS.desktop },
    ];
    const targetLessons = [
      'how-java-runs',
      'offheap-ffm-api',
      'zgc-vs-g1',
      'virtual-threads-loom',
      'false-sharing-jmm',
    ];

    for (const vp of viewports) {
      for (const slug of targetLessons) {
        await page.setViewportSize(vp.size);
        await page.goto(`/lessons/${slug}`);
        await expect(page.locator('#diagram-pane svg').first()).toBeVisible();
        await assertDiagramToolbarClearOfTelemetry(page, `${vp.name} /lessons/${slug}`);
      }
    }
  });

  test('AF1b (Issue #1 Bottom Switcher): Mobile/tablet Notes-Diagram switcher never covers Step X of Y, Next CTA, or CLI code blocks', async ({
    page,
  }) => {
    const viewports: Array<{ name: string; size: ViewportSize }> = [
      { name: 'mobile-375', size: VIEWPORTS.mobile },
      { name: 'tablet-768', size: VIEWPORTS.tablet },
    ];
    // Lessons/steps that include CLI inspection + code blocks
    const targets = [
      { slug: 'how-java-runs', stepIndex: 1 },
      { slug: 'offheap-ffm-api', stepIndex: 0 },
    ];

    for (const vp of viewports) {
      for (const target of targets) {
        await page.setViewportSize(vp.size);
        await page.goto(`/lessons/${target.slug}`);
        await selectLessonStep(page, target.stepIndex);

        const switcher = page.getByTestId('mobile-toggle-tab');
        const switcherBoxInDiagram = await requireBox(
          switcher,
          `${vp.name} ${target.slug} switcher (Diagram view)`
        );

        // In Diagram view: must not overlap StepProgress ("Step X of Y") or SVG canvas
        const stepCounter = page.locator('#diagram-pane').getByText(/Step \d+ of \d+/i).first();
        const counterBox = await requireBox(stepCounter, `${vp.name} ${target.slug} Step X of Y`);
        expect(
          boxesOverlap(switcherBoxInDiagram, counterBox, 1),
          `${vp.name} ${target.slug}: mobile-toggle-tab overlaps "Step X of Y"`
        ).toBe(false);

        const svgBox = await requireBox(page.locator('#diagram-pane svg').first(), 'Diagram SVG');
        expect(
          boxesOverlap(switcherBoxInDiagram, svgBox, 1),
          `${vp.name} ${target.slug}: mobile-toggle-tab overlaps SVG stage`
        ).toBe(false);

        // Switch to Notes view and scroll to bottom
        await switcher.click();
        await expect(switcher).toContainText(/Diagram/i);

        const notesPane = page.locator('#notes-pane');
        await expect(notesPane).toBeVisible();
        await notesPane.evaluate((el) => {
          const scrollable = el.querySelector('.overflow-y-auto') ?? el;
          scrollable.scrollTop = scrollable.scrollHeight;
        });

        const switcherBoxInNotes = await requireBox(
          switcher,
          `${vp.name} ${target.slug} switcher (Notes view)`
        );

        const nextBtn = page.getByTestId('next-step-button');
        const nextBox = await requireBox(nextBtn, `${vp.name} ${target.slug} next-step-button`);
        expect(
          boxesOverlap(switcherBoxInNotes, nextBox, 1),
          `${vp.name} ${target.slug}: mobile-toggle-tab overlaps next-step-button`
        ).toBe(false);

        const cliHeading = notesPane.getByText(/Live Production CLI Inspection/i).first();
        const cliContainer = cliHeading.locator('..').locator('..');
        await cliContainer.scrollIntoViewIfNeeded();

        const cliBox = await requireBox(cliHeading, `${vp.name} ${target.slug} Live Production CLI Inspection`);
        expect(
          boxesOverlap(switcherBoxInNotes, cliBox, 1),
          `${vp.name} ${target.slug}: mobile-toggle-tab overlaps CLI inspection heading`
        ).toBe(false);

        const cliContainerBox = await requireBox(
          cliContainer,
          `${vp.name} ${target.slug} CLI inspection container`
        );
        expect(
          boxesOverlap(switcherBoxInNotes, cliContainerBox, 1),
          `${vp.name} ${target.slug}: mobile-toggle-tab overlaps CLI inspection container`
        ).toBe(false);

        const preBlocks = notesPane.locator('pre');
        const preCount = await preBlocks.count();
        for (let i = 0; i < preCount; i++) {
          const pre = preBlocks.nth(i);
          await pre.scrollIntoViewIfNeeded();
          const preBox = await requireBox(pre, `${vp.name} ${target.slug} <pre> code block #${i}`);
          expect(
            boxesOverlap(switcherBoxInNotes, preBox, 1),
            `${vp.name} ${target.slug}: mobile-toggle-tab overlaps <pre> code block #${i}`
          ).toBe(false);
        }
      }
    }

    // Confirm mobile-toggle-tab is hidden on desktop 1440x900
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/lessons/how-java-runs');
    await expect(page.getByTestId('mobile-toggle-tab')).not.toBeVisible();
  });

  test('AF2 (Issue #2): Tablet (768x1024) uses compact mobile header without line wrapping or off-screen ThemeToggle', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/lessons/how-java-runs');

    const menuToggle = page.getByTestId('mobile-menu-toggle');
    await expect(menuToggle).toBeVisible();

    // Desktop nav must remain hidden at 768px so controls do not overflow
    await expect(page.getByTestId('tab-learn')).not.toBeVisible();
    await expect(page.getByTestId('tab-practice')).not.toBeVisible();
    await expect(page.getByTestId('tab-cheatsheets')).not.toBeVisible();

    const brandLink = page.getByRole('link', { name: /Java Handbook/i }).first();
    const brandBox = await requireBox(brandLink, 'Java Handbook brand link');
    expect(brandBox.height, 'Brand link should remain single-line').toBeLessThanOrEqual(44);
    expect(isInsideViewport(brandBox, VIEWPORTS.tablet.width, VIEWPORTS.tablet.height)).toBe(true);

    const searchBtn = page.getByTestId('search-button');
    const searchBox = await requireBox(searchBtn, 'search-button');
    expect(searchBox.height, 'Search button should remain single-line').toBeLessThanOrEqual(44);
    expect(isInsideViewport(searchBox, VIEWPORTS.tablet.width, VIEWPORTS.tablet.height)).toBe(true);

    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    const themeBox = await requireBox(themeToggle, 'ThemeToggle button');
    expect(
      isInsideViewport(themeBox, VIEWPORTS.tablet.width, VIEWPORTS.tablet.height),
      `ThemeToggle must sit fully inside 768px viewport: ${JSON.stringify(themeBox)}`
    ).toBe(true);
    expect(boxesOverlap(searchBox, themeBox, 0), 'Search button and ThemeToggle must not overlap').toBe(
      false
    );

    await assertNoHorizontalOverflow(page);
  });

  test('AF3 (Issue #3): Mobile drawer X close button is not occluded by backdrop and backdrop tap dismisses drawer', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/lessons/how-java-runs');

    const menuToggle = page.getByTestId('mobile-menu-toggle');
    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });

    // Open drawer
    await menuToggle.click();
    await expect
      .poll(async () => (await sidebar.boundingBox())?.x ?? -999)
      .toBeGreaterThanOrEqual(-1);

    // Click X close button WITHOUT { force: true } to enforce zero occlusion
    await menuToggle.click();
    await expect
      .poll(async () => {
        const b = await sidebar.boundingBox();
        return b ? b.x + b.width : -999;
      })
      .toBeLessThanOrEqual(1);

    // Re-open drawer and click right-side backdrop area outside the 288px sidebar & below 56px header
    await menuToggle.click();
    await expect
      .poll(async () => (await sidebar.boundingBox())?.x ?? -999)
      .toBeGreaterThanOrEqual(-1);

    await page.mouse.click(340, 300);
    await expect
      .poll(async () => {
        const b = await sidebar.boundingBox();
        return b ? b.x + b.width : -999;
      })
      .toBeLessThanOrEqual(1);
  });

  test('AF4 (Issue #4): Mobile lesson headers keep full readable H1 and stack metadata badges below H1', async ({
    page,
  }) => {
    const longTitleSlugs = ['offheap-ffm-api', 'zgc-vs-g1', 'executor-service'];

    for (const slug of longTitleSlugs) {
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto(`/lessons/${slug}`);

      const h1 = page.locator('h1').first();
      const h1Box = await requireBox(h1, `H1 on /lessons/${slug}`);
      expect(
        h1Box.width,
        `H1 on /lessons/${slug} must not be crushed (width=${h1Box.width})`
      ).toBeGreaterThanOrEqual(240);

      // Verify H1 text is not single-line ellipsis-clipped
      const h1Clipped = await h1.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1;
      });
      expect(h1Clipped, `H1 on /lessons/${slug} should wrap cleanly instead of truncating`).toBe(
        false
      );

      const headerRegion = h1.locator('..').locator('..');
      const durationBadge = headerRegion.getByText(/\d+\s*min/i).first();
      const difficultyBadge = headerRegion.getByText(/Beginner|Intermediate|Advanced/i).first();
      const stepsBadge = headerRegion.getByText(/\d+\s*steps/i).first();

      for (const badge of [durationBadge, difficultyBadge, stepsBadge]) {
        const badgeBox = await requireBox(badge, `Metadata badge on /lessons/${slug}`);
        expect(
          badgeBox.y,
          `Metadata badge should stack below H1 on /lessons/${slug}: badge.y=${badgeBox.y}, h1.bottom=${h1Box.y + h1Box.height}`
        ).toBeGreaterThanOrEqual(h1Box.y + h1Box.height - 2);
      }

      await assertNoHorizontalOverflow(page);
    }
  });

  test('AF5 (Issue #5): SVG node labels stay inside stage/card bounds, avoid collisions, and pass WCAG AA (>= 4.5:1) in 3D Iso & 2D Flat', async ({
    page,
  }) => {
    const targets = [
      { slug: 'virtual-threads-loom', steps: [0, 1, 2] },
      { slug: 'zgc-vs-g1', steps: [0, 1] },
      { slug: 'false-sharing-jmm', steps: [0, 1] },
      { slug: 'safepoints-ttsp', steps: [0, 1] },
      { slug: 'how-java-runs', steps: [0] },
    ];

    await page.setViewportSize(VIEWPORTS.desktop);

    for (const target of targets) {
      await page.goto(`/lessons/${target.slug}`);
      for (const step of target.steps) {
        await selectLessonStep(page, step);
        await expect(page.locator('#diagram-pane svg').first()).toBeVisible();

        const toggleBtn = page.getByTestId('toggle-view-mode');
        const initialText = (await toggleBtn.textContent()) ?? '';
        const initially2D = /2D Flat/i.test(initialText);

        await assertSvgIntegrity(
          page,
          initially2D,
          `${target.slug} step ${step} (${initially2D ? '2D' : '3D'})`
        );

        // Toggle mode and audit the alternate view
        await toggleBtn.click();
        await expect(toggleBtn).toContainText(initially2D ? /3D Iso/i : /2D Flat/i);
        await assertSvgIntegrity(
          page,
          !initially2D,
          `${target.slug} step ${step} (${!initially2D ? '2D' : '3D'})`
        );
      }
    }
  });

  test('AF6 (Issue #6): Step titles across Modules 01-07 restore "&" and contain zero literal "&amp;" entities', async ({
    page,
  }) => {
    const expectedTitles: Array<{ slug: string; stepIndex: number; title: string; broken: string }> = [
      {
        slug: 'escape-analysis',
        stepIndex: 2,
        title: 'Scalar Replacement & Lock Elision',
        broken: 'Scalar Replacement Lock Elision',
      },
      {
        slug: 'zgc-vs-g1',
        stepIndex: 1,
        title: 'Colored Pointers & Load Barriers',
        broken: 'Colored Pointers Load Barriers',
      },
      {
        slug: 'streams-api',
        stepIndex: 1,
        title: 'Lazy Evaluation & Short-Circuiting',
        broken: 'Lazy Evaluation Short-Circuiting',
      },
      {
        slug: 'generics',
        stepIndex: 2,
        title: 'Type Erasure & Bridge Methods',
        broken: 'Type Erasure Bridge Methods',
      },
      {
        slug: 'executor-service',
        stepIndex: 1,
        title: 'Task Submission & Rejection Policies',
        broken: 'Task Submission Rejection Policies',
      },
      {
        slug: 'safepoints-ttsp',
        stepIndex: 1,
        title: 'Uncounted Loops & Strip Mining',
        broken: 'Uncounted Loops Strip Mining',
      },
      {
        slug: 'spring-request-lifecycle',
        stepIndex: 2,
        title: 'Controller, Service & Repository Layers',
        broken: 'Controller Service Repository Layers',
      },
      {
        slug: 'microservices-patterns',
        stepIndex: 1,
        title: 'Circuit Breaker & Fault Tolerance',
        broken: 'Circuit Breaker Fault Tolerance',
      },
      {
        slug: 'jwt-oauth2',
        stepIndex: 0,
        title: 'Authentication & Authorization OAuth2 Roles',
        broken: 'Authentication Authorization OAuth2 Roles',
      },
      {
        slug: 'jwt-oauth2',
        stepIndex: 3,
        title: 'Secure Logout & Cookie Revocation',
        broken: 'Secure Logout Cookie Revocation',
      },
      {
        slug: 'mongodb-document-model',
        stepIndex: 1,
        title: 'Schema Design & Document Patterns',
        broken: 'Schema Design Document Patterns',
      },
      {
        slug: 'cicd-pipeline',
        stepIndex: 1,
        title: 'Maven Build & Automated Testing',
        broken: 'Maven Build Automated Testing',
      },
      {
        slug: 'cicd-pipeline',
        stepIndex: 2,
        title: 'Static Analysis & Security Scans',
        broken: 'Static Analysis Security Scans',
      },
    ];

    await page.setViewportSize(VIEWPORTS.desktop);

    let currentSlug: string | null = null;
    for (const item of expectedTitles) {
      if (currentSlug !== item.slug) {
        await page.goto(`/lessons/${item.slug}`);
        currentSlug = item.slug;
      }

      const stepPill = page.locator(`#diagram-pane button[title="${item.title}"]`).first();
      await expect(
        stepPill,
        `Expected StepProgress pill "${item.title}" on /lessons/${item.slug}`
      ).toBeVisible();
      await stepPill.click();

      const stepHeading = page.locator('#notes-pane h2').filter({ hasText: item.title }).first();
      await expect(
        stepHeading,
        `Expected restored step title "${item.title}" on /lessons/${item.slug}`
      ).toBeVisible();

      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).not.toContain('&amp;');
      expect(bodyText).not.toContain(item.broken);
    }
  });

  test('AF7 (Issue #7): Module 07 displays unified "07. DevOps & Observability" across sidebar and lesson breadcrumbs', async ({
    page,
  }) => {
    const mod7Slugs = ['cicd-pipeline', 'observability-stack', 'offheap-ffm-api'];
    await page.setViewportSize(VIEWPORTS.desktop);

    for (const slug of mod7Slugs) {
      await page.goto(`/lessons/${slug}`);

      const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
      const mod7SidebarBtn = sidebar.getByRole('button', { name: /07\./ });
      await expect(mod7SidebarBtn).toContainText('07. DevOps & Observability');
      await expect(mod7SidebarBtn).not.toContainText('CI/CD');
      await expect(mod7SidebarBtn).not.toContainText('Performance');

      const breadcrumbMod = page.locator('#diagram-pane').getByText(/07\./).first();
      await expect(breadcrumbMod).toHaveText('07. DevOps & Observability');

      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).not.toContain('07. DevOps & CI/CD');
      expect(bodyText).not.toContain('07. DevOps & Performance');
    }
  });

  test('AF8 (Issue #8): Custom 404 and Coming Soon pages render branded warm handbook UI with working Back to Curriculum link', async ({
    page,
  }) => {
    const routes = [
      { path: '/nonexistent-route', is404: true },
      { path: '/lessons/nonexistent-slug', is404: true },
      { path: '/practice', is404: false },
      { path: '/cheatsheets', is404: false },
    ];

    for (const route of routes) {
      const tracker = attachErrorTracker(page, { allowHttp404: route.is404 });
      await page.setViewportSize(VIEWPORTS.desktop);
      const response = await page.goto(route.path);

      if (!route.is404 && response) {
        expect(response.status()).toBe(200);
      }

      // Branded header / warm palette (must NOT be bare Next.js black screen)
      await expect(page.getByText(/Java Handbook/i).first()).toBeVisible();
      const bgInfo = await page.evaluate(() => {
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        const mainWrapper = document.querySelector('main, div');
        const wrapperBg = mainWrapper ? window.getComputedStyle(mainWrapper).backgroundColor : bodyBg;
        const text = document.body.innerText;
        return { bodyBg, wrapperBg, text };
      });
      expect(bgInfo.bodyBg).not.toBe('rgb(0, 0, 0)');
      expect(bgInfo.text).not.toMatch(/^404\s*\n\s*This page could not be found\.?$/i);

      if (!route.is404) {
        await expect(page.getByText(/Coming Soon/i).first()).toBeVisible();
      }

      const backLink = page.getByRole('link', { name: /Back to Curriculum/i });
      await expect(backLink).toBeVisible();
      await expect(backLink).toHaveAttribute('href', '/');

      // Mobile scrollability check on standalone route
      await page.setViewportSize(VIEWPORTS.mobile);
      await assertNoHorizontalOverflow(page);
      await backLink.scrollIntoViewIfNeeded();
      await expect(backLink).toBeVisible();

      // Navigate back to curriculum
      await backLink.click();
      await page.waitForURL((url) => url.pathname === '/');
      await expect(page.locator('h1').first()).toBeVisible();
      tracker.assertNoFatalErrors();
    }

    // Preserve F1.4 invariant: header tabs remain disabled on lesson pages
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/lessons/how-java-runs');
    await expect(page.getByTestId('tab-practice')).toBeDisabled();
    await expect(page.getByTestId('tab-cheatsheets')).toBeDisabled();
  });

  test('AF9 (Issue #9): Sidebar lesson titles, StepProgress pills, and telemetry cards wrap cleanly or expose full-text title tooltips', async ({
    page,
  }) => {
    const viewports = [VIEWPORTS.desktop, VIEWPORTS.mobile];
    const targetLessons = ['offheap-ffm-api', 'zgc-vs-g1', 'executor-service', 'dependency-injection'];

    for (const vp of viewports) {
      for (const slug of targetLessons) {
        await page.setViewportSize(vp);
        await page.goto(`/lessons/${slug}`);

        // Check telemetry cards (labels + values) using the strict 4-card grid predicate
        const telemetryCheck = await page.evaluate(() => {
          const pane = document.getElementById('diagram-pane');
          if (!pane) return { cardCount: 0, failures: [] };
          const svg = pane.querySelector('svg');
          const svgTop = svg ? svg.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
          const grids = Array.from(pane.querySelectorAll('div')).filter((div) => {
            const r = div.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0 || r.bottom > svgTop + 4) return false;
            const children = Array.from(div.children);
            if (children.length !== 4) return false;
            return children.every((child) => {
              const cr = child.getBoundingClientRect();
              return cr.width >= 60 && cr.height >= 24 && child.querySelectorAll('span').length >= 2;
            });
          });
          if (grids.length === 0) return { cardCount: 0, failures: [] };
          const cards = Array.from(grids[0].children);
          const failures: Array<{
            text: string;
            scrollWidth: number;
            clientWidth: number;
            scrollHeight: number;
            clientHeight: number;
            title: string | null;
          }> = [];
          for (const card of cards) {
            const spans = Array.from(card.querySelectorAll('span'));
            for (const s of spans) {
              const text = (s.textContent ?? '').trim();
              if (!text) continue;
              const clipped =
                s.scrollWidth > s.clientWidth + 1 || s.scrollHeight > s.clientHeight + 1;
              const tooltip = s.getAttribute('title') || card.getAttribute('title');
              if (clipped && (!tooltip || !tooltip.includes(text))) {
                failures.push({
                  text,
                  scrollWidth: s.scrollWidth,
                  clientWidth: s.clientWidth,
                  scrollHeight: s.scrollHeight,
                  clientHeight: s.clientHeight,
                  title: tooltip,
                });
              }
            }
          }
          return { cardCount: cards.length, failures };
        });
        expect(
          telemetryCheck.cardCount,
          `Expected 4 telemetry cards on ${slug} (${vp.width}px)`
        ).toBe(4);
        expect(
          telemetryCheck.failures,
          `Telemetry truncation without full-text title on ${slug} (${vp.width}px): ${JSON.stringify(telemetryCheck.failures)}`
        ).toHaveLength(0);

        // Check StepProgress pills inside #diagram-pane
        const stepPillCheck = await page.evaluate(() => {
          const pane = document.getElementById('diagram-pane');
          if (!pane) return [];
          const pillButtons = Array.from(pane.querySelectorAll('button[title]'));
          const failures: Array<{ text: string; title: string | null }> = [];
          for (const btn of pillButtons) {
            const labelSpan = btn.querySelector('span:last-child');
            if (!labelSpan) continue;
            const r = labelSpan.getBoundingClientRect();
            if (r.width === 0) continue;
            const clipped = labelSpan.scrollWidth > labelSpan.clientWidth + 1;
            const title = btn.getAttribute('title') || labelSpan.getAttribute('title');
            const text = (labelSpan.textContent ?? '').trim();
            if (clipped && (!title || !title.includes(text))) {
              failures.push({ text, title });
            }
          }
          return failures;
        });
        expect(stepPillCheck).toHaveLength(0);
      }
    }

    // Check sidebar lesson buttons on desktop (expand all modules)
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/lessons/how-java-runs');
    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const moduleButtons = sidebar.locator('button[aria-expanded]');
    const modCount = await moduleButtons.count();
    expect(modCount).toBe(7);
    for (let i = 0; i < modCount; i++) {
      const btn = moduleButtons.nth(i);
      if ((await btn.getAttribute('aria-expanded')) === 'false') {
        await btn.click();
        await expect(btn).toHaveAttribute('aria-expanded', 'true');
      }
    }

    const sidebarFailures = await sidebar.evaluate((asideEl) => {
      const buttons = Array.from(asideEl.querySelectorAll('button')).filter(
        (b) => !b.hasAttribute('aria-expanded') && b.textContent && b.textContent.trim().length > 0
      );
      const failures: Array<{ text: string; title: string | null }> = [];
      for (const btn of buttons) {
        const span = btn.querySelector('span');
        if (!span) continue;
        const r = span.getBoundingClientRect();
        if (r.width === 0) continue;
        const clipped = span.scrollWidth > span.clientWidth + 1;
        const title = btn.getAttribute('title') || span.getAttribute('title');
        const text = (span.textContent ?? '').trim();
        if (clipped && (!title || !title.includes(text))) {
          failures.push({ text, title });
        }
      }
      return failures;
    });
    expect(
      sidebarFailures,
      `Sidebar lesson titles clipped without full-text title: ${JSON.stringify(sidebarFailures)}`
    ).toHaveLength(0);
  });

  test('AF10 (Issue #10): Fresh 1440x900 initial loads reliably render 3-column desktop split with zero hydration warnings', async ({
    page,
  }) => {
    const entryUrls = ['/', '/lessons/how-java-runs', '/lessons/offheap-ffm-api', '/#/zgc-vs-g1/2'];

    for (const url of entryUrls) {
      const tracker = attachErrorTracker(page);
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto(url);

      const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
      const diagramPane = page.locator('#diagram-pane');
      const notesPane = page.locator('#notes-pane');

      const sidebarBox = await requireBox(sidebar, `Sidebar on ${url}`);
      const diagramBox = await requireBox(diagramPane, `#diagram-pane on ${url}`);
      const notesBox = await requireBox(notesPane, `#notes-pane on ${url}`);

      // 3-column left-to-right ordering without overlap
      expect(sidebarBox.x + sidebarBox.width).toBeLessThanOrEqual(diagramBox.x + 2);
      expect(diagramBox.x + diagramBox.width).toBeLessThanOrEqual(notesBox.x + 2);

      // Tabbed/mobile switchers must not be visible on 1440x900 desktop split
      await expect(page.getByTestId('mobile-toggle-tab')).not.toBeVisible();
      await expect(page.getByRole('tablist', { name: /Workspace view panes/i })).not.toBeVisible();

      if (url === '/#/zgc-vs-g1/2') {
        await expect(page.locator('h1').first()).toContainText(/Modern Garbage Collection/i);
        await expect(
          page.locator('#notes-pane h2').filter({ hasText: 'Colored Pointers & Load Barriers' })
        ).toBeVisible();
      }

      tracker.assertNoHydrationWarnings();
      tracker.assertNoFatalErrors();
    }
  });

  test('AF11 (Issue #11): Break It dropdown closes cleanly on Escape key and outside click without side effects', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/lessons/how-java-runs');

    const initialStepTitle = await page.locator('#notes-pane h2').first().textContent();
    const breakItBtn = page.getByTestId('break-it-button');
    const hotCallsOption = page.getByTestId('sim-scenario-hot-calls');

    // Open and close via Escape
    await breakItBtn.click();
    await expect(hotCallsOption).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(hotCallsOption).not.toBeVisible();

    // Verify no side effects on step or simulator banner
    await expect(page.locator('#notes-pane h2').first()).toHaveText(initialStepTitle ?? '');
    await expect(page.locator('#diagram-pane').getByText(/SIMULATOR:/i)).not.toBeVisible();

    // Re-open and close via click outside
    await breakItBtn.click();
    await expect(hotCallsOption).toBeVisible();
    const h1Box = await requireBox(page.locator('h1').first(), 'Lesson H1');
    await page.mouse.click(h1Box.x + h1Box.width / 2, h1Box.y + h1Box.height / 2);
    await expect(hotCallsOption).not.toBeVisible();
  });

  test('AF12 (Issue #12): Sidebar module accordion buttons expose accurate aria-expanded state on desktop and mobile', async ({
    page,
  }) => {
    // Desktop check
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/lessons/how-java-runs');

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const mod1Btn = sidebar.getByRole('button', { name: /01\. Java Foundations/i });
    const mod2Btn = sidebar.getByRole('button', { name: /02\. Collections & Streams/i });
    const mod7Btn = sidebar.getByRole('button', { name: /07\. DevOps & Observability/i });

    await expect(mod1Btn).toHaveAttribute('aria-expanded', 'true');
    await expect(mod2Btn).toHaveAttribute('aria-expanded', 'false');
    await expect(mod7Btn).toHaveAttribute('aria-expanded', 'false');

    const mod2Lesson = sidebar.getByRole('button', { name: 'Collections Framework Deep Dive' });
    await expect(mod2Lesson).not.toBeVisible();

    await mod2Btn.click();
    await expect(mod2Btn).toHaveAttribute('aria-expanded', 'true');
    await expect(mod2Lesson).toBeVisible();

    await mod2Btn.click();
    await expect(mod2Btn).toHaveAttribute('aria-expanded', 'false');
    await expect(mod2Lesson).not.toBeVisible();

    // Mobile drawer check
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/lessons/cicd-pipeline');
    await page.getByTestId('mobile-menu-toggle').click();

    const mobileMod7 = sidebar.getByRole('button', { name: /07\. DevOps & Observability/i });
    const mobileMod1 = sidebar.getByRole('button', { name: /01\. Java Foundations/i });
    await expect(mobileMod7).toHaveAttribute('aria-expanded', 'true');
    await expect(mobileMod1).toHaveAttribute('aria-expanded', 'false');

    await mobileMod1.click();
    await expect(mobileMod1).toHaveAttribute('aria-expanded', 'true');
  });
});

// ============================================================================
// Tier 2: Boundary & Corner Cases (AB1 - AB4)
// ============================================================================

test.describe('Tier 2: Audit Fix Boundary & Corner Cases (AB1 - AB4)', () => {
  test('AB1 (Issues #2 & #10 Breakpoints): 1024x768 preserves tabbed mode (B7.1) while 1280x800 and 1440x900 render 3-column split', async ({
    page,
  }) => {
    // 1024x768: desktop nav fits, tabbed Notes/Diagram mode preserved
    await page.setViewportSize(VIEWPORTS.laptop);
    await page.goto('/lessons/how-java-runs');

    await expect(page.getByTestId('tab-learn')).toBeVisible();
    const themeToggle1024 = page.getByRole('button', { name: /toggle theme/i });
    const themeBox1024 = await requireBox(themeToggle1024, 'ThemeToggle at 1024x768');
    expect(isInsideViewport(themeBox1024, 1024, 768)).toBe(true);

    const notesTab = page
      .getByRole('tab', { name: 'Notes' })
      .or(page.getByRole('button', { name: 'Notes', exact: true }));
    await expect(notesTab).toBeVisible();

    // Exact xl threshold 1280x800: 3-column split active
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/lessons/how-java-runs');
    await expect(page.locator('aside').filter({ hasText: 'Curriculum' })).toBeVisible();
    await expect(page.locator('#diagram-pane')).toBeVisible();
    await expect(page.locator('#notes-pane')).toBeVisible();
    await expect(page.getByTestId('mobile-toggle-tab')).not.toBeVisible();
  });

  test('AB2 (Issues #1, #2, #4 Narrow Mobile 320x568): Zero overflow, header fit, stacked badges, and non-overlapping controls', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.narrowMobile);
    await page.goto('/lessons/offheap-ffm-api');

    await assertNoHorizontalOverflow(page);

    const themeBox = await requireBox(
      page.getByRole('button', { name: /toggle theme/i }),
      'ThemeToggle at 320x568'
    );
    expect(isInsideViewport(themeBox, 320, 568)).toBe(true);

    const h1Box = await requireBox(page.locator('h1').first(), 'H1 at 320x568');
    const headerRegion = page.locator('h1').first().locator('..').locator('..');
    const durationBox = await requireBox(
      headerRegion.getByText(/\d+\s*min/i).first(),
      'Duration badge at 320x568'
    );
    expect(durationBox.y).toBeGreaterThanOrEqual(h1Box.y + h1Box.height - 2);

    await assertDiagramToolbarClearOfTelemetry(page, '320x568 offheap-ffm-api');

    const switcher = page.getByTestId('mobile-toggle-tab');
    const switcherBox = await requireBox(switcher, 'mobile-toggle-tab at 320x568');
    await switcher.click();
    const notesPane = page.locator('#notes-pane');
    await notesPane.evaluate((el) => {
      const scrollable = el.querySelector('.overflow-y-auto') ?? el;
      scrollable.scrollTop = scrollable.scrollHeight;
    });
    const notesSwitcherBox = await requireBox(switcher, 'mobile-toggle-tab in Notes at 320x568');
    const nextBox = await requireBox(page.getByTestId('next-step-button'), 'next-step-button at 320x568');
    expect(boxesOverlap(notesSwitcherBox, nextBox, 1)).toBe(false);
    expect(isInsideViewport(switcherBox, 320, 568)).toBe(true);
  });

  test('AB3 (Issues #1, #5, #9 Stress): Active Break-It simulation scenarios maintain non-overlapping HUD and WCAG AA SVG integrity', async ({
    page,
  }) => {
    const scenarios = ['sim-scenario-hot-calls', 'sim-scenario-recursion', 'sim-scenario-thread-pin'] as const;
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/lessons/virtual-threads-loom');

    for (const scenarioId of scenarios) {
      await page.getByTestId('break-it-button').click();
      await page.getByTestId(scenarioId).click();

      await assertDiagramToolbarClearOfTelemetry(page, `virtual-threads-loom ${scenarioId}`);
      await assertSvgIntegrity(page, false, `virtual-threads-loom ${scenarioId} 3D`);

      await page.getByTestId('toggle-view-mode').click();
      await assertSvgIntegrity(page, true, `virtual-threads-loom ${scenarioId} 2D`);
      await page.getByTestId('toggle-view-mode').click();
    }
  });

  test('AB4 (Issue #8 Theme Boundary): Custom 404 and Coming Soon pages support light and dark themes on mobile without black-screen fallback', async ({
    page,
  }) => {
    const routes = [
      { path: '/practice', is404: false },
      { path: '/cheatsheets', is404: false },
      { path: '/does-not-exist-404', is404: true },
    ];

    for (const route of routes) {
      const tracker = attachErrorTracker(page, { allowHttp404: route.is404 });
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto(route.path);

      const themeToggle = page.getByRole('button', { name: /toggle theme/i });
      await expect(themeToggle).toBeVisible();

      const lightBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
      expect(lightBg).not.toBe('rgb(0, 0, 0)');

      await themeToggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      const darkBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
      expect(darkBg).not.toBe('rgb(0, 0, 0)');
      expect(darkBg).not.toBe(lightBg);

      const backLink = page.getByRole('link', { name: /Back to Curriculum/i });
      await expect(backLink).toBeVisible();
      await assertNoHorizontalOverflow(page);
      tracker.assertNoFatalErrors();
    }
  });
});

// ============================================================================
// Tier 3: Cross-Feature Combinations (AP1 - AP3)
// ============================================================================

test.describe('Tier 3: Audit Fix Cross-Feature Combinations (AP1 - AP3)', () => {
  test('AP1 (Issues #2 + #3 + #12): Tablet 768x1024 drawer open + accordion aria-expanded + non-occluded X close + ThemeToggle', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/lessons/how-java-runs');

    const menuToggle = page.getByTestId('mobile-menu-toggle');
    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });

    await menuToggle.click();
    await expect
      .poll(async () => (await sidebar.boundingBox())?.x ?? -999)
      .toBeGreaterThanOrEqual(-1);

    const mod4Btn = sidebar.getByRole('button', { name: /04\. Spring Boot & Microservices/i });
    await expect(mod4Btn).toHaveAttribute('aria-expanded', 'false');
    await mod4Btn.click();
    await expect(mod4Btn).toHaveAttribute('aria-expanded', 'true');

    // Close via X without { force: true }
    await menuToggle.click();
    await expect
      .poll(async () => {
        const b = await sidebar.boundingBox();
        return b ? b.x + b.width : -999;
      })
      .toBeLessThanOrEqual(1);

    // Toggle theme and verify ThemeToggle remains inside 768px viewport
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    const themeBox = await requireBox(themeToggle, 'ThemeToggle after dark toggle');
    expect(isInsideViewport(themeBox, VIEWPORTS.tablet.width, VIEWPORTS.tablet.height)).toBe(true);
  });

  test('AP2 (Issues #1 + #5 + #11): Break It Escape dismissal -> Hot Calls simulation -> 3D/2D toggle preserves geometry and contrast', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/lessons/zgc-vs-g1');

    const breakItBtn = page.getByTestId('break-it-button');
    await breakItBtn.click();
    await expect(page.getByTestId('sim-scenario-hot-calls')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('sim-scenario-hot-calls')).not.toBeVisible();

    await breakItBtn.click();
    await page.getByTestId('sim-scenario-hot-calls').click();
    await assertDiagramToolbarClearOfTelemetry(page, 'mobile zgc-vs-g1 hot-calls');

    await page.getByTestId('toggle-view-mode').click();
    await assertSvgIntegrity(page, true, 'mobile zgc-vs-g1 hot-calls 2D');
  });

  test('AP3 (Issues #6 + #7 + #9 + #12): Module 07 navigation across lessons 25-27 keeps unified title, "&" steps, and pill tooltips', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/lessons/how-java-runs');

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const mod7Btn = sidebar.getByRole('button', { name: /07\. DevOps & Observability/i });
    await expect(mod7Btn).toHaveAttribute('aria-expanded', 'false');
    await mod7Btn.click();
    await expect(mod7Btn).toHaveAttribute('aria-expanded', 'true');

    const mod7Lessons = [
      { buttonName: 'CI/CD Pipeline & Code Quality', slug: 'cicd-pipeline' },
      { buttonName: 'Production Observability & RCA', slug: 'observability-stack' },
      { buttonName: 'Off-Heap Memory & Modern FFM API', slug: 'offheap-ffm-api' },
    ];

    for (const lesson of mod7Lessons) {
      await sidebar.getByRole('button', { name: lesson.buttonName }).click();
      await page.waitForURL(new RegExp(`/lessons/${lesson.slug}`));
      await expect(page.locator('#diagram-pane').getByText(/07\./).first()).toHaveText(
        '07. DevOps & Observability'
      );
    }

    // Navigate back to cicd-pipeline step 2 & 3 via StepProgress pills and verify "&" titles + tooltips
    await sidebar.getByRole('button', { name: 'CI/CD Pipeline & Code Quality' }).click();
    await page.waitForURL(/\/lessons\/cicd-pipeline/);

    const step2Pill = page.locator('button[title="Maven Build & Automated Testing"]');
    await expect(step2Pill).toBeVisible();
    await step2Pill.click();
    await expect(
      page.locator('#notes-pane h2').filter({ hasText: 'Maven Build & Automated Testing' })
    ).toBeVisible();

    const step3Pill = page.locator('button[title="Static Analysis & Security Scans"]');
    await expect(step3Pill).toBeVisible();
    await step3Pill.click();
    await expect(
      page.locator('#notes-pane h2').filter({ hasText: 'Static Analysis & Security Scans' })
    ).toBeVisible();
  });
});

// ============================================================================
// Tier 4: End-to-End Journeys (AS1 - AS3)
// ============================================================================

test.describe('Tier 4: Audit Fix End-to-End Journeys (AS1 - AS3)', () => {
  test('AS1 (Desktop Journey 1440x900): Initial 3-column split -> Sidebar navigation -> ZGC "&" step -> 3D/2D SVG audit -> Break It Escape', async ({
    page,
  }) => {
    const tracker = attachErrorTracker(page);
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/');

    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    const diagramPane = page.locator('#diagram-pane');
    const notesPane = page.locator('#notes-pane');

    await expect(sidebar).toBeVisible();
    await expect(diagramPane).toBeVisible();
    await expect(notesPane).toBeVisible();
    await expect(page.getByTestId('mobile-toggle-tab')).not.toBeVisible();

    // Navigate via Module 01 sidebar (already aria-expanded="true") to zgc-vs-g1
    const mod1Btn = sidebar.getByRole('button', { name: /01\. Java Foundations/i });
    await expect(mod1Btn).toHaveAttribute('aria-expanded', 'true');
    await sidebar.getByRole('button', { name: /Modern Garbage Collection/i }).click();
    await page.waitForURL(/\/lessons\/zgc-vs-g1/);

    await page.getByTestId('next-step-button').click();
    await expect(
      notesPane.locator('h2').filter({ hasText: 'Colored Pointers & Load Barriers' })
    ).toBeVisible();

    await assertDiagramToolbarClearOfTelemetry(page, 'AS1 zgc-vs-g1');
    await assertSvgIntegrity(page, false, 'AS1 zgc-vs-g1 3D');

    await page.getByTestId('toggle-view-mode').click();
    await assertSvgIntegrity(page, true, 'AS1 zgc-vs-g1 2D');

    await page.getByTestId('break-it-button').click();
    await expect(page.getByTestId('sim-scenario-hot-calls')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('sim-scenario-hot-calls')).not.toBeVisible();

    tracker.assertNoHydrationWarnings();
    tracker.assertNoFatalErrors();
  });

  test('AS2 (Mobile Journey 375x667): Long-title CLI lesson -> Drawer X & backdrop -> Stacked header -> Docked Notes/Diagram workflow', async ({
    page,
  }) => {
    const tracker = attachErrorTracker(page);
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto('/lessons/offheap-ffm-api');

    // Verify stacked lesson header & non-overlapping toolbar
    const h1Box = await requireBox(page.locator('h1').first(), 'AS2 offheap-ffm-api H1');
    expect(h1Box.width).toBeGreaterThanOrEqual(240);
    await assertDiagramToolbarClearOfTelemetry(page, 'AS2 offheap-ffm-api');
    await assertNoHorizontalOverflow(page);

    // Open & close drawer via X without force, then via backdrop
    const menuToggle = page.getByTestId('mobile-menu-toggle');
    const sidebar = page.locator('aside').filter({ hasText: 'Curriculum' });
    await menuToggle.click();
    await expect
      .poll(async () => (await sidebar.boundingBox())?.x ?? -999)
      .toBeGreaterThanOrEqual(-1);
    await menuToggle.click();
    await expect
      .poll(async () => {
        const b = await sidebar.boundingBox();
        return b ? b.x + b.width : -999;
      })
      .toBeLessThanOrEqual(1);

    await menuToggle.click();
    await page.mouse.click(340, 300);
    await expect
      .poll(async () => {
        const b = await sidebar.boundingBox();
        return b ? b.x + b.width : -999;
      })
      .toBeLessThanOrEqual(1);

    // Toggle to Notes, inspect CLI block & advance step without switcher overlap
    const switcher = page.getByTestId('mobile-toggle-tab');
    await switcher.click();
    const notesPane = page.locator('#notes-pane');
    await notesPane.evaluate((el) => {
      const scrollable = el.querySelector('.overflow-y-auto') ?? el;
      scrollable.scrollTop = scrollable.scrollHeight;
    });

    const switcherBox = await requireBox(switcher, 'AS2 mobile-toggle-tab in Notes');
    const nextBtn = page.getByTestId('next-step-button');
    const nextBox = await requireBox(nextBtn, 'AS2 next-step-button');
    expect(boxesOverlap(switcherBox, nextBox, 1)).toBe(false);

    await nextBtn.click();
    await expect(notesPane.getByText(/Step 2 \/ \d+/i)).toBeVisible();
    tracker.assertNoFatalErrors();
  });

  test('AS3 (Tablet Journey 768x1024): Compact header & ThemeToggle -> Module 07 lesson -> Coming Soon & 404 recovery to Curriculum', async ({
    page,
  }) => {
    const tracker = attachErrorTracker(page, { allowHttp404: true });
    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto('/lessons/cicd-pipeline');

    await expect(page.getByTestId('mobile-menu-toggle')).toBeVisible();
    await expect(page.locator('#diagram-pane').getByText(/07\./).first()).toHaveText(
      '07. DevOps & Observability'
    );

    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    const themeBox = await requireBox(themeToggle, 'AS3 ThemeToggle at 768x1024');
    expect(isInsideViewport(themeBox, VIEWPORTS.tablet.width, VIEWPORTS.tablet.height)).toBe(true);
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Visit Coming Soon & 404 pages, then recover via Back to Curriculum
    await page.goto('/practice');
    await expect(page.getByText(/Coming Soon/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Back to Curriculum/i })).toBeVisible();

    await page.goto('/cheatsheets');
    await expect(page.getByText(/Coming Soon/i).first()).toBeVisible();

    await page.goto('/unknown-audit-page');
    const backLink = page.getByRole('link', { name: /Back to Curriculum/i });
    await expect(backLink).toBeVisible();
    await backLink.click();

    await page.waitForURL((url) => url.pathname === '/');
    await expect(page.locator('h1').first()).toBeVisible();
    tracker.assertNoFatalErrors();
  });
});
