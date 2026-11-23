#!/usr/bin/env node
/**
 * scripts/lint-copy.mjs
 * Milestone 1 CI Guard: Enforces copy discipline, detects banned absolutes,
 * sensational metaphors, titles > 4 words, colons in titles, and nested bold+backticks.
 */

import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import vm from 'vm';

const LESSON_FILES = [
  'lessons-foundations.ts',
  'lessons-collections.ts',
  'lessons-concurrency.ts',
  'lessons-spring.ts',
  'lessons-security.ts',
  'lessons-devops.ts'
];

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const BANNED_METAPHORS = [
  'mystery', 'secret', 'myth', 'ghost', 'phantom', 'trap',
  'killer', 'silent killer', 'wall', 'barrier', 'magic',
  'silver bullet', 'ninja', 'under the hood', 'hit enter'
];

const BANNED_ABSOLUTES = [
  { term: 'never', regex: /\bnever\b/i },
  { term: 'always', regex: /\balways\b/i },
  { term: 'zero (unmeasured)', regex: /(?<!non-)\bzero\b(?!-)/i },
  { term: 'completely immune', regex: /\bcompletely\s+immune\b/i },
  { term: 'impossible', regex: /\bimpossible\b/i },
  { term: 'guarantee', regex: /\bguarantee(?:s|d|ing)?\b/i }
];

const isStrict = process.argv.includes('--strict') || process.argv.includes('--ci') || process.env.STRICT === 'true';
const isJson = process.argv.includes('--json');

const findings = {
  titleLengthViolations: [],
  titleColonViolations: [],
  titleMetaphorViolations: [],
  nestedBacktickViolations: [],
  bannedAbsoluteViolations: []
};

let totalStepsChecked = 0;
let totalLessonsChecked = 0;

for (const fileName of LESSON_FILES) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) continue;

  const rawContent = fs.readFileSync(filePath, 'utf8');
  const rawLines = rawContent.split('\n');

  // Check 1: Raw line scanning for actual nested bold+backticks (**`code`**)
  rawLines.forEach((line, index) => {
    if (/\*\*\s*\\?`[^`\n]+?\\?`\s*\*+|\*\s*\\?`[^`\n]+?\\?`\s*\*/.test(line)) {
      findings.nestedBacktickViolations.push({
        file: fileName,
        line: index + 1,
        snippet: line.trim()
      });
    }
  });

  // Transpile TypeScript to CommonJS in memory for structural traversal
  const transpiled = ts.transpileModule(rawContent, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  });
  const sandbox = { exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(transpiled.outputText, sandbox);

  const lessonList = Object.values(sandbox.exports)[0] || [];
  totalLessonsChecked += lessonList.length;

  for (const lesson of lessonList) {
    if (!lesson.steps) continue;
    for (const step of lesson.steps) {
      totalStepsChecked++;
      const title = (step.title || '').trim();

      // Check 2: Word Count <= 4
      const words = title.split(/\s+/).filter(Boolean);
      if (words.length > 4) {
        findings.titleLengthViolations.push({
          lesson: lesson.slug,
          stepId: step.id,
          title,
          wordCount: words.length
        });
      }

      // Check 3: Colons in title
      if (title.includes(':')) {
        findings.titleColonViolations.push({
          lesson: lesson.slug,
          stepId: step.id,
          title
        });
      }

      // Check 4: Sensational Metaphors
      for (const meta of BANNED_METAPHORS) {
        const regex = new RegExp(`\\b${meta}\\b`, 'i');
        if (regex.test(title)) {
          findings.titleMetaphorViolations.push({
            lesson: lesson.slug,
            stepId: step.id,
            title,
            metaphor: meta
          });
          break;
        }
      }

      // Check 5: Banned Absolutes in educational text fields
      const fieldsToCheck = [
        { name: 'content', text: step.content },
        { name: 'keyIdea', text: step.keyIdea },
        { name: 'interviewTip', text: step.interviewTip },
        { name: 'productionSymptom', text: step.productionSymptom },
        { name: 'subtitle', text: step.subtitle }
      ];

      for (const f of fieldsToCheck) {
        if (!f.text) continue;
        for (const banned of BANNED_ABSOLUTES) {
          const match = f.text.match(banned.regex);
          if (match) {
            const startIdx = Math.max(0, match.index - 25);
            const snippet = f.text.slice(startIdx, startIdx + 70).replace(/\n/g, ' ');
            findings.bannedAbsoluteViolations.push({
              lesson: lesson.slug,
              stepId: step.id,
              field: f.name,
              term: banned.term,
              context: `...${snippet}...`
            });
          }
        }
      }
    }
  }
}

const totalViolations =
  findings.titleLengthViolations.length +
  findings.titleColonViolations.length +
  findings.titleMetaphorViolations.length +
  findings.nestedBacktickViolations.length +
  findings.bannedAbsoluteViolations.length;

if (isJson) {
  console.log(JSON.stringify({ totalLessonsChecked, totalStepsChecked, totalViolations, findings }, null, 2));
} else {
  console.log('\n======================================================');
  console.log('            COPY & HOUSE STYLE AUDIT REPORT           ');
  console.log('======================================================');
  console.log(`Lessons Scanned:  ${totalLessonsChecked}`);
  console.log(`Steps Scanned:    ${totalStepsChecked}`);
  console.log(`Total Violations: ${totalViolations}\n`);

  console.log(`1. Step Title Length Violations (>4 words): ${findings.titleLengthViolations.length}`);
  console.log(`2. Step Title Colon Violations (:):         ${findings.titleColonViolations.length}`);
  console.log(`3. Step Title Metaphors:                    ${findings.titleMetaphorViolations.length}`);
  console.log(`4. Nested Bold+Backtick Artifacts:          ${findings.nestedBacktickViolations.length}`);
  console.log(`5. Banned Absolutes in Prose:               ${findings.bannedAbsoluteViolations.length}\n`);

  if (findings.nestedBacktickViolations.length > 0) {
    console.log(`--- Sample Nested Backticks (Total: ${findings.nestedBacktickViolations.length} — Remediation in M3) ---`);
    findings.nestedBacktickViolations.slice(0, 5).forEach(v => console.log(`  [${v.file}:${v.line}] ${v.snippet}`));
    console.log('');
  }

  if (findings.titleColonViolations.length > 0) {
    console.log(`--- Sample Title Colon Violations (Total: ${findings.titleColonViolations.length} — Remediation in M5) ---`);
    findings.titleColonViolations.slice(0, 5).forEach(v => console.log(`  [${v.lesson} / ${v.stepId}] "${v.title}"`));
    console.log('');
  }

  if (findings.titleMetaphorViolations.length > 0) {
    console.log(`--- Sample Title Metaphors (Total: ${findings.titleMetaphorViolations.length} — Remediation in M5) ---`);
    findings.titleMetaphorViolations.slice(0, 5).forEach(v => console.log(`  [${v.lesson} / ${v.stepId}] "${v.title}" (metaphor: ${v.metaphor})`));
    console.log('');
  }
}

if (isStrict && totalViolations > 0) {
  if (!isJson) console.error(`\n[FAIL] Copy audit failed with ${totalViolations} violations under --strict mode.`);
  process.exit(1);
} else {
  if (!isJson) console.log('[PASS] Copy audit completed successfully.\n');
  process.exit(0);
}
