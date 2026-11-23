#!/usr/bin/env node
/**
 * scripts/audit-diagram-states.mjs
 * Milestone 1 CI Guard: Validates DiagramState coverage across all lessons,
 * detects dead branches, unhandled states, and inert stages.
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import ts from 'typescript';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'src/data');
const TYPES_FILE = path.join(ROOT_DIR, 'src/lib/types.ts');
const RENDERER_FILE = path.join(ROOT_DIR, 'src/components/diagrams/DiagramRenderer.tsx');

const isStrict = process.argv.includes('--strict') || process.argv.includes('--ci') || process.env.STRICT === 'true';
const isJson = process.argv.includes('--json');

// 1. Ingest TypeScript Lesson Data
function loadLessonData() {
  const lessonFiles = [
    'lessons-foundations.ts',
    'lessons-collections.ts',
    'lessons-concurrency.ts',
    'lessons-spring.ts',
    'lessons-security.ts',
    'lessons-devops.ts'
  ];

  const lessons = [];
  for (const file of lessonFiles) {
    const fullPath = path.join(DATA_DIR, file);
    if (!fs.existsSync(fullPath)) continue;
    const code = fs.readFileSync(fullPath, 'utf8');
    const transpiled = ts.transpileModule(code, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText;
    const exportsObj = {};
    const context = vm.createContext({ exports: exportsObj, module: { exports: exportsObj } });
    vm.runInContext(transpiled, context);
    const key = Object.keys(exportsObj).find(k => Array.isArray(exportsObj[k]));
    if (key && exportsObj[key]) {
      lessons.push(...exportsObj[key]);
    }
  }
  return lessons;
}

// 2. Parse DiagramRenderer.tsx AST
function parseDiagramRenderer() {
  if (!fs.existsSync(RENDERER_FILE)) {
    throw new Error(`DiagramRenderer not found at ${RENDERER_FILE}`);
  }
  const code = fs.readFileSync(RENDERER_FILE, 'utf8');
  const sourceFile = ts.createSourceFile('DiagramRenderer.tsx', code, ts.ScriptTarget.Latest, true);

  const slugToStage = new Map();
  const stageToSlugs = new Map();
  const stageStates = new Map();
  const inertStages = new Set();
  let fallbackStage = null;

  function visit(node) {
    // Dispatch in DiagramRenderer function
    if (ts.isFunctionDeclaration(node) && node.name?.text === 'DiagramRenderer') {
      function findDispatch(n) {
        if (ts.isIfStatement(n)) {
          const condText = code.substring(n.expression.pos, n.expression.end);
          const slugs = [...condText.matchAll(/lessonSlug === ['"]([^'"]+)['"]/g)].map(m => m[1]);
          const thenText = code.substring(n.thenStatement.pos, n.thenStatement.end);
          const stageMatch = thenText.match(/<([A-Za-z0-9]+Stage)/);
          if (stageMatch && slugs.length > 0) {
            const stageName = stageMatch[1];
            for (const slug of slugs) {
              slugToStage.set(slug, stageName);
              if (!stageToSlugs.has(stageName)) stageToSlugs.set(stageName, new Set());
              stageToSlugs.get(stageName).add(slug);
            }
          }
        }
        ts.forEachChild(n, findDispatch);
      }
      ts.forEachChild(node, findDispatch);

      // Locate top-level return statement in DiagramRenderer body
      if (node.body && ts.isBlock(node.body)) {
        for (const stmt of node.body.statements) {
          if (ts.isReturnStatement(stmt)) {
            const retText = code.substring(stmt.pos, stmt.end);
            const fbMatch = retText.match(/<([A-Za-z0-9]+Stage)/);
            if (fbMatch) {
              fallbackStage = fbMatch[1];
            }
          }
        }
      }
    }

    // Stage functions
    if (ts.isFunctionDeclaration(node) && node.name?.text.endsWith('Stage')) {
      const stageName = node.name.text;
      const stageText = code.substring(node.pos, node.end);
      const states = new Set();

      // Find diagramState comparisons (=== or !==)
      const compRegex = /diagramState\s*===?\s*['"]([^'"]+)['"]/g;
      let m;
      while ((m = compRegex.exec(stageText)) !== null) {
        states.add(m[1]);
      }
      const compReverseRegex = /['"]([^'"]+)['"]\s*===?\s*diagramState/g;
      while ((m = compReverseRegex.exec(stageText)) !== null) {
        states.add(m[1]);
      }
      // Inspect switch statements: only collect case values if switching on diagramState
      function inspectSwitch(sn) {
        if (ts.isSwitchStatement(sn)) {
          const exprText = code.substring(sn.expression.pos, sn.expression.end).trim();
          if (exprText === 'diagramState') {
            for (const clause of sn.caseBlock.clauses) {
              if (ts.isCaseClause(clause) && clause.expression) {
                if (ts.isStringLiteral(clause.expression)) {
                  states.add(clause.expression.text);
                } else {
                  const cText = code.substring(clause.expression.pos, clause.expression.end).replace(/['"]/g, '').trim();
                  if (cText) states.add(cText);
                }
              }
            }
          }
        }
        ts.forEachChild(sn, inspectSwitch);
      }
      ts.forEachChild(node, inspectSwitch);
      // Array inclusion: ['a', 'b'].includes(diagramState)
      const arrayIncRegex = /\[([^\]]+)\]\.includes\(\s*diagramState\s*\)/g;
      while ((m = arrayIncRegex.exec(stageText)) !== null) {
        const itemRegex = /['"]([^'"]+)['"]/g;
        let itemMatch;
        while ((itemMatch = itemRegex.exec(m[1])) !== null) {
          states.add(itemMatch[1]);
        }
      }

      stageStates.set(stageName, states);
      if (states.size === 0) {
        inertStages.add(stageName);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { slugToStage, stageToSlugs, stageStates, inertStages, fallbackStage };
}

// 3. Parse DiagramState in types.ts
function parseTypes() {
  if (!fs.existsSync(TYPES_FILE)) return null;
  const code = fs.readFileSync(TYPES_FILE, 'utf8');
  const sourceFile = ts.createSourceFile('types.ts', code, ts.ScriptTarget.Latest, true);
  let unionStates = null;

  function visit(node) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === 'DiagramState') {
      if (ts.isUnionTypeNode(node.type)) {
        unionStates = new Set();
        for (const elem of node.type.types) {
          if (ts.isLiteralTypeNode(elem) && ts.isStringLiteral(elem.literal)) {
            unionStates.add(elem.literal.text);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return unionStates;
}

// 4. Audit Execution
function runAudit() {
  const lessons = loadLessonData();
  const { slugToStage, stageToSlugs, stageStates, inertStages, fallbackStage } = parseDiagramRenderer();
  const unionStates = parseTypes();

  let totalSteps = 0;
  let handledSteps = 0;
  const unhandledSteps = [];
  const deadBranches = [];

  for (const lesson of lessons) {
    const stage = slugToStage.get(lesson.slug) || fallbackStage;
    const checked = stageStates.get(stage) || new Set();

    for (const step of lesson.steps) {
      totalSteps++;
      if (checked.has(step.diagramState)) {
        handledSteps++;
      } else {
        unhandledSteps.push({
          lessonSlug: lesson.slug,
          stepId: step.id,
          diagramState: step.diagramState,
          mappedStage: stage
        });
      }
    }
  }

  // Detect dead branches in stages
  for (const [stage, checked] of stageStates) {
    const mappedSlugs = stageToSlugs.get(stage) || new Set();
    const declaredStates = new Set();
    for (const slug of mappedSlugs) {
      const lesson = lessons.find(l => l.slug === slug);
      if (lesson) {
        for (const s of lesson.steps) declaredStates.add(s.diagramState);
      }
    }
    for (const state of checked) {
      if (!declaredStates.has(state)) {
        deadBranches.push({ stage, state, mappedSlugs: [...mappedSlugs] });
      }
    }
  }

  const coveragePercent = totalSteps > 0 ? parseFloat(((handledSteps / totalSteps) * 100).toFixed(1)) : 0;

  return {
    totalLessons: lessons.length,
    totalSteps,
    handledSteps,
    coveragePercent,
    fallbackStage,
    inertStages: [...inertStages],
    unhandledSteps,
    deadBranches,
    hasUnionType: unionStates !== null,
    unionStatesCount: unionStates ? unionStates.size : null
  };
}

// 5. Main Execution
try {
  const report = runAudit();

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('\n======================================================');
    console.log('       DIAGRAM STATE COVERAGE & FIDELITY AUDIT        ');
    console.log('======================================================');
    console.log(`Total Lessons:    ${report.totalLessons}`);
    console.log(`Total Steps:      ${report.totalSteps}`);
    console.log(`Handled Steps:    ${report.handledSteps} (${report.coveragePercent}%)`);
    console.log(`Fallback Stage:   ${report.fallbackStage}`);
    console.log(`Unhandled Steps:  ${report.unhandledSteps.length}`);
    console.log(`Inert Stages:     ${report.inertStages.length}`);
    console.log(`Dead Branches:    ${report.deadBranches.length}`);
    console.log(`Union Type Set:   ${report.hasUnionType ? `Yes (${report.unionStatesCount} members)` : 'No (Loose string, M2 task)'}\n`);

    if (report.inertStages.length > 0) {
      console.log('--- Inert Stages (0 diagramState checks — Remediation in M2) ---');
      report.inertStages.forEach(s => console.log(`  - ${s}`));
      console.log('');
    }

    if (report.deadBranches.length > 0) {
      console.log(`--- Sample Dead Branches (Total: ${report.deadBranches.length} — Remediation in M2) ---`);
      report.deadBranches.slice(0, 8).forEach(b => {
        console.log(`  - [${b.stage}] checks "${b.state}" (mapped: ${b.mappedSlugs.join(', ')})`);
      });
      console.log('');
    }

    if (report.unhandledSteps.length > 0) {
      console.log(`--- Sample Unhandled Steps (Total: ${report.unhandledSteps.length} — Remediation in M2) ---`);
      report.unhandledSteps.slice(0, 8).forEach(u => {
        console.log(`  - [${u.lessonSlug}/${u.stepId}] requires "${u.diagramState}" -> Stage: ${u.mappedStage}`);
      });
      console.log('');
    }
  }

  const hasDefects = report.unhandledSteps.length > 0 || report.deadBranches.length > 0 || report.inertStages.length > 0;

  if (isStrict && hasDefects) {
    if (!isJson) console.error(`[FAIL] Diagram state audit failed under --strict mode: ${report.unhandledSteps.length} unhandled, ${report.deadBranches.length} dead branches, ${report.inertStages.length} inert.`);
    process.exit(1);
  } else {
    if (!isJson) console.log('[PASS] Diagram state audit completed successfully.\n');
    process.exit(0);
  }
} catch (err) {
  if (!isJson) console.error('[FATAL] Failed to execute diagram state audit:', err);
  process.exit(1);
}
