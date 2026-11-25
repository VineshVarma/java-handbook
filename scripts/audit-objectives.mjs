#!/usr/bin/env node
/**
 * scripts/audit-objectives.mjs
 * Milestone 1 CI Guard: Verifies that all "You'll learn" objectives and subtitle
 * promises are backed by actual lesson step content. Detects orphan objectives.
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import ts from 'typescript';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const isStrict = process.argv.includes('--strict') || process.argv.includes('--ci') || process.env.STRICT === 'true';
const isJson = process.argv.includes('--json');
const MATCH_THRESHOLD = 0.65; // 65% keyword match or concept phrase match

const COMPOUND_CONCEPT_PAIRS = [
  {
    pattern: /reifiable\s+vs\s+non-reifiable|reifiable.*non-reifiable/i,
    concepts: ['reifiable', 'non-reifiable'],
    description: 'reifiable vs non-reifiable types'
  },
  {
    pattern: /orTimeout.*completeOnTimeout|completeOnTimeout.*orTimeout/i,
    concepts: ['orTimeout', 'completeOnTimeout'],
    description: 'orTimeout and completeOnTimeout'
  }
];

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'over', 'after', 'beneath', 'under',
  'above', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'do', 'does', 'did', 'how', 'what', 'why', 'when', 'where',
  'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'vs', 'using',
  'across', 'between', 'through', 'your', 'its', 'their', 'our', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'can', 'will', 'just', 'should', 'now', 'modern', 'enterprise', 'best', 'practices'
]);

// 1. Ingest Curriculum Data (lessons.ts + ./lessons-*.ts via local require shim)
function transpileTsModule(fullPath, customRequire) {
  const code = fs.readFileSync(fullPath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const exportsObj = {};
  const moduleObj = { exports: exportsObj };
  const context = vm.createContext({
    exports: exportsObj,
    module: moduleObj,
    require: customRequire || ((specifier) => {
      throw new Error(`Unexpected runtime require("${specifier}") in ${path.basename(fullPath)}`);
    })
  });
  vm.runInContext(transpiled, context);
  return moduleObj.exports;
}

function loadCurriculumData() {
  const lessonsIndexPath = path.join(DATA_DIR, 'lessons.ts');
  if (!fs.existsSync(lessonsIndexPath)) {
    throw new Error(`Missing curriculum registry: ${lessonsIndexPath}`);
  }

  const moduleCache = new Map();
  const localRequire = (specifier) => {
    if (!specifier.startsWith('./lessons-')) {
      throw new Error(`Unsupported runtime import "${specifier}" in curriculum data`);
    }
    const fileName = specifier.endsWith('.ts') ? specifier : `${specifier}.ts`;
    const resolvedPath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Missing imported lesson module: ${resolvedPath}`);
    }
    if (!moduleCache.has(resolvedPath)) {
      moduleCache.set(resolvedPath, transpileTsModule(resolvedPath, localRequire));
    }
    return moduleCache.get(resolvedPath);
  };

  const registryExports = transpileTsModule(lessonsIndexPath, localRequire);
  return {
    lessons: registryExports.allLessons || [],
    getModuleById: registryExports.getModuleById
  };
}

// 2. Build Lesson Step Corpus
function buildCorpus(lesson) {
  const stepEntries = lesson.steps.map((s, idx) => {
    const textPieces = [
      s.title,
      s.subtitle,
      s.content,
      s.keyIdea,
      s.codeExample?.code,
      s.codeExample?.title,
      s.codeExample?.beforeCode,
      s.interviewTip,
      s.productionSymptom,
      s.cliInspection?.command,
      s.cliInspection?.explanation,
      s.cliInspection?.output,
      s.microCheck?.question,
      s.microCheck?.explanation,
      ...(s.microCheck?.options || [])
    ].filter(Boolean);

    return {
      index: idx,
      id: s.id,
      title: s.title,
      text: textPieces.join(' ').toLowerCase()
    };
  });

  const fullText = stepEntries.map(s => s.text).join(' ');
  return { stepEntries, fullText };
}

// Helper: Match keyword with word boundaries, hyphen normalization, plurals, and technical variations
function keywordMatches(keyword, fullText) {
  const clean = keyword.trim().toLowerCase();
  if (!clean) return false;

  if (clean === 'maxpoolsize') {
    return /maximumpoolsize|maxpoolsize/i.test(fullText);
  }
  if (clean === 'automatic') {
    return /automatically|automatic/i.test(fullText);
  }
  if (clean === 'resilient') {
    return /resilience|resilient/i.test(fullText);
  }
  if (clean === 'failure') {
    return /fails?|failures?/i.test(fullText);
  }

  const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patternStr = escaped.replace(/-/g, '[- ]+');

  // Exact or hyphenated match, allowing optional 0x hex prefix
  const baseRegex = new RegExp(`(?<![\\w])(?:0x)?${patternStr}(?![\\w])`, 'i');
  if (baseRegex.test(fullText)) return true;

  // Plural/singular matching (e.g. stage <-> stages, principle <-> principles)
  if (clean.endsWith('s')) {
    const singular = clean.slice(0, -1);
    const singRegex = new RegExp(`(?<![\\w])${singular}(?![\\w])`, 'i');
    if (singRegex.test(fullText)) return true;
  } else {
    const plurRegex = new RegExp(`(?<![\\w])${clean}s(?![\\w])`, 'i');
    if (plurRegex.test(fullText)) return true;
  }

  // Participle/verb root matching (e.g. handling -> handle)
  if (clean.endsWith('ing')) {
    const stem = clean.slice(0, -3);
    const ingRegex = new RegExp(`(?<![\\w])${stem}(?:e|es|ed|ing)?(?![\\w])`, 'i');
    if (ingRegex.test(fullText)) return true;
  }

  return false;
}

// 3. Analyze Objective Backing
function auditObjective(objective, corpus) {
  const rawWords = objective
    .toLowerCase()
    .replace(/[^a-z0-9_\-\.@]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  const keywords = rawWords.filter(w => !STOP_WORDS.has(w));
  if (keywords.length === 0) {
    return { isOrphan: false, score: 100, matched: [], missing: [], hasPhraseMatch: true, missingCompoundConcepts: [] };
  }

  const matched = keywords.filter(k => keywordMatches(k, corpus.fullText));
  const missing = keywords.filter(k => !matched.includes(k));
  const scoreRatio = matched.length / keywords.length;

  // Check multi-word phrase matches with word boundaries and hyphen normalization
  let hasPhraseMatch = false;
  for (let i = 0; i < keywords.length - 1; i++) {
    const k1 = keywords[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/-/g, '[- ]+');
    const k2 = keywords[i + 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/-/g, '[- ]+');
    const phraseRegex = new RegExp(`(?<!\\w)${k1}\\s+${k2}(?!\\w)`, 'i');
    if (phraseRegex.test(corpus.fullText)) {
      hasPhraseMatch = true;
      break;
    }
  }

  // Concept-pair enforcement for compound objectives
  const missingCompoundConcepts = [];
  for (const pair of COMPOUND_CONCEPT_PAIRS) {
    if (pair.pattern.test(objective)) {
      for (const concept of pair.concepts) {
        if (!keywordMatches(concept, corpus.fullText)) {
          missingCompoundConcepts.push(concept);
        }
      }
    }
  }

  // An objective is orphan if:
  // - Keyword score < 40%, OR
  // - Score < 65% and no 2-word phrase match, OR
  // - Critical discriminator concept pair missing
  const isOrphan = (scoreRatio < MATCH_THRESHOLD && !hasPhraseMatch) || (scoreRatio < 0.4) || (missingCompoundConcepts.length > 0);

  return {
    isOrphan,
    score: parseFloat((scoreRatio * 100).toFixed(1)),
    matched,
    missing,
    hasPhraseMatch,
    missingCompoundConcepts
  };
}

// 4. Audit Subtitle Promises
function auditSubtitle(subtitle, corpus) {
  if (!subtitle) return { isDiscrepancy: false, missing: [], score: 100 };
  const rawWords = subtitle
    .toLowerCase()
    .replace(/[^a-z0-9_\-\.@]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);
  const keywords = rawWords.filter(w => !STOP_WORDS.has(w));
  const missing = keywords.filter(k => !keywordMatches(k, corpus.fullText));
  const score = keywords.length > 0 ? (keywords.length - missing.length) / keywords.length : 1;
  return {
    isDiscrepancy: missing.length >= 3 && score < 0.6,
    missing,
    score: parseFloat((score * 100).toFixed(1))
  };
}

// 5. Main Audit Runner
function runAudit() {
  const { lessons, getModuleById } = loadCurriculumData();
  let totalObjectives = 0;
  let coveredObjectives = 0;
  const orphanObjectives = [];
  const subtitleDiscrepancies = [];
  const moduleTitleDiscrepancies = [];

  for (const lesson of lessons) {
    const expectedModule = typeof getModuleById === 'function' ? getModuleById(lesson.moduleId) : undefined;
    if (!expectedModule || lesson.moduleTitle !== expectedModule.title) {
      moduleTitleDiscrepancies.push({
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        moduleId: lesson.moduleId,
        actualModuleTitle: lesson.moduleTitle,
        expectedModuleTitle: expectedModule ? expectedModule.title : '<missing module>'
      });
    }

    const corpus = buildCorpus(lesson);

    // Audit Subtitle
    const subAudit = auditSubtitle(lesson.subtitle, corpus);
    if (subAudit.isDiscrepancy) {
      subtitleDiscrepancies.push({
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        subtitle: lesson.subtitle,
        missing: subAudit.missing,
        score: subAudit.score
      });
    }

    // Audit You'll Learn Objectives
    if (Array.isArray(lesson.youllLearn)) {
      for (const obj of lesson.youllLearn) {
        totalObjectives++;
        const result = auditObjective(obj, corpus);
        if (result.isOrphan) {
          orphanObjectives.push({
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
            objective: obj,
            score: result.score,
            missing: result.missing,
            matched: result.matched
          });
        } else {
          coveredObjectives++;
        }
      }
    }
  }

  const coveragePercent = totalObjectives > 0
    ? parseFloat(((coveredObjectives / totalObjectives) * 100).toFixed(1))
    : 100;

  return {
    totalLessons: lessons.length,
    totalObjectives,
    coveredObjectives,
    orphanCount: orphanObjectives.length,
    coveragePercent,
    orphanObjectives,
    subtitleDiscrepancies,
    moduleTitleDiscrepancies
  };
}

// 6. Execute & Report
try {
  const report = runAudit();

  if (isJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('\n======================================================');
    console.log('         CURRICULUM OBJECTIVES & PROMISES AUDIT       ');
    console.log('======================================================');
    console.log(`Total Lessons:        ${report.totalLessons}`);
    console.log(`Total Objectives:     ${report.totalObjectives}`);
    console.log(`Covered Objectives:   ${report.coveredObjectives} (${report.coveragePercent}%)`);
    console.log(`Orphan Objectives:    ${report.orphanCount}`);
    console.log(`Subtitle Promises:    ${report.subtitleDiscrepancies.length} discrepancies`);
    console.log(`Module Title Parity:  ${report.moduleTitleDiscrepancies.length} discrepancies\n`);

    if (report.orphanCount > 0) {
      console.log('--- Sample Orphan Objectives (Remediation in M5) ---');
      report.orphanObjectives.slice(0, 10).forEach((o, i) => {
        console.log(`  ${i + 1}. [${o.lessonSlug}] "${o.objective}"`);
        console.log(`     Missing: ${o.missing.slice(0, 5).join(', ')} (Match score: ${o.score}%)`);
      });
      console.log('');
    }

    if (report.subtitleDiscrepancies.length > 0) {
      console.log('--- Subtitle Unkept Promises (Remediation in M5) ---');
      report.subtitleDiscrepancies.forEach(s => {
        console.log(`  - [${s.lessonSlug}] "${s.subtitle}"`);
        console.log(`    Missing concepts: ${s.missing.join(', ')}`);
      });
      console.log('');
    }

    if (report.moduleTitleDiscrepancies.length > 0) {
      console.log('--- Module Title Parity Discrepancies ---');
      report.moduleTitleDiscrepancies.forEach(d => {
        console.log(`  - [${d.lessonSlug}] moduleId="${d.moduleId}" has "${d.actualModuleTitle}", expected "${d.expectedModuleTitle}"`);
      });
      console.log('');
    }
  }

  if (
    report.orphanCount > 0 ||
    (report.subtitleDiscrepancies && report.subtitleDiscrepancies.length > 0) ||
    (report.moduleTitleDiscrepancies && report.moduleTitleDiscrepancies.length > 0)
  ) {
    if (!isJson) console.error(`[FAIL] Objectives audit failed: ${report.orphanCount} orphan objectives, ${report.subtitleDiscrepancies.length} subtitle discrepancies, ${report.moduleTitleDiscrepancies.length} moduleTitle discrepancies detected.`);
    process.exit(1);
  } else {
    if (!isJson) console.log('[PASS] Objectives audit completed successfully.\n');
    process.exit(0);
  }
} catch (err) {
  if (!isJson) console.error('[FATAL] Failed to execute objectives audit:', err);
  process.exit(1);
}
