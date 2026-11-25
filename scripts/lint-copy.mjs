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

const SENSATIONAL_MULTIPLIERS = [
  { term: 'sensational speedup multiplier', regex: /\b\d+(?:,\d+)?x\s+(?:faster|speedup|speed-up|boost|improvement)\b/i },
  { term: 'sensational developer multiplier', regex: /\b\d+x\s+(?:developer|engineer|coder)\b/i }
];

const isStrict = process.argv.includes('--strict') || process.argv.includes('--ci') || process.env.STRICT === 'true';
const isJson = process.argv.includes('--json');

const findings = {
  titleLengthViolations: [],
  titleColonViolations: [],
  titleMetaphorViolations: [],
  nestedBacktickViolations: [],
  bannedAbsoluteViolations: [],
  sensationalMultiplierViolations: [],
  microCheckDistributionViolations: []
};

let totalStepsChecked = 0;
let totalLessonsChecked = 0;
const allMicroChecks = [];

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

      // Check 2: Word Count <= 4 (excluding standalone '&' conjunction tokens)
      const words = title.split(/\s+/).filter((w) => Boolean(w) && w !== '&');
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

        // Check 6: Sensational Multipliers in educational text fields
        for (const multi of SENSATIONAL_MULTIPLIERS) {
          const match = f.text.match(multi.regex);
          if (match) {
            const startIdx = Math.max(0, match.index - 25);
            const snippet = f.text.slice(startIdx, startIdx + 70).replace(/\n/g, ' ');
            findings.sensationalMultiplierViolations.push({
              lesson: lesson.slug,
              stepId: step.id,
              field: f.name,
              term: multi.term,
              context: `...${snippet}...`
            });
          }
        }
      }

      // Track micro-checks for curriculum-wide distribution analysis
      if (step.microCheck) {
        allMicroChecks.push({
          file: fileName,
          lesson: lesson.slug,
          stepId: step.id,
          answerIndex: step.microCheck.answerIndex,
          options: step.microCheck.options || []
        });
      }
    }
  }
}

// Check 7: Curriculum-wide Micro-Check distribution assertions
for (let i = 1; i < allMicroChecks.length; i++) {
  const prev = allMicroChecks[i - 1];
  const curr = allMicroChecks[i];
  if (curr.answerIndex === prev.answerIndex) {
    findings.microCheckDistributionViolations.push({
      type: 'CONSECUTIVE_ANSWER_INDEX_COLLISION',
      message: `Consecutive micro-checks share answerIndex (${curr.answerIndex}): [${prev.lesson}/${prev.stepId}] -> [${curr.lesson}/${curr.stepId}]`
    });
  }
}

const fourOptionCount = allMicroChecks.filter(c => c.options.length >= 4).length;
if (allMicroChecks.length > 0 && fourOptionCount < 1) {
  findings.microCheckDistributionViolations.push({
    type: 'NO_FOUR_OPTION_MICROCHECK',
    message: `Expected at least one micro-check with >= 4 options across curriculum, found ${fourOptionCount}`
  });
}

const totalViolations =
  findings.titleLengthViolations.length +
  findings.titleColonViolations.length +
  findings.titleMetaphorViolations.length +
  findings.nestedBacktickViolations.length +
  findings.bannedAbsoluteViolations.length +
  findings.sensationalMultiplierViolations.length +
  findings.microCheckDistributionViolations.length;

if (isJson) {
  console.log(JSON.stringify({ totalLessonsChecked, totalStepsChecked, totalMicroChecks: allMicroChecks.length, totalViolations, findings }, null, 2));
} else {
  console.log('\n======================================================');
  console.log('            COPY & HOUSE STYLE AUDIT REPORT           ');
  console.log('======================================================');
  console.log(`Lessons Scanned:      ${totalLessonsChecked}`);
  console.log(`Steps Scanned:        ${totalStepsChecked}`);
  console.log(`Micro-Checks Tracked: ${allMicroChecks.length} (4-option checks: ${fourOptionCount})`);
  console.log(`Total Violations:     ${totalViolations}\n`);

  console.log(`1. Step Title Length Violations (>4 words): ${findings.titleLengthViolations.length}`);
  console.log(`2. Step Title Colon Violations (:):         ${findings.titleColonViolations.length}`);
  console.log(`3. Step Title Metaphors:                    ${findings.titleMetaphorViolations.length}`);
  console.log(`4. Nested Bold+Backtick Artifacts:          ${findings.nestedBacktickViolations.length}`);
  console.log(`5. Banned Absolutes in Prose:               ${findings.bannedAbsoluteViolations.length}`);
  console.log(`6. Sensational Multipliers:                 ${findings.sensationalMultiplierViolations.length}`);
  console.log(`7. Micro-Check Distribution Violations:     ${findings.microCheckDistributionViolations.length}\n`);

  if (findings.titleLengthViolations.length > 0) {
    console.log(`--- Step Title Length Violations (>4 words) (Total: ${findings.titleLengthViolations.length}) ---`);
    findings.titleLengthViolations.forEach(v => console.log(`  [${v.lesson} / ${v.stepId}] "${v.title}" (${v.wordCount} content words)`));
    console.log('');
  }

  if (findings.microCheckDistributionViolations.length > 0) {
    console.log(`--- Micro-Check Distribution Violations (Total: ${findings.microCheckDistributionViolations.length}) ---`);
    findings.microCheckDistributionViolations.forEach(v => console.log(`  [${v.type}] ${v.message}`));
    console.log('');
  }

  if (findings.sensationalMultiplierViolations.length > 0) {
    console.log(`--- Sensational Multipliers (Total: ${findings.sensationalMultiplierViolations.length}) ---`);
    findings.sensationalMultiplierViolations.forEach(v => console.log(`  [${v.lesson} / ${v.stepId}] ${v.context}`));
    console.log('');
  }

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
