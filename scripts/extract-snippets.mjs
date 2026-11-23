#!/usr/bin/env node
/**
 * scripts/extract-snippets.mjs
 * Milestone 1 CI Guard: Extracts all 45 code examples from src/data/lessons-*.ts
 * into .snippets/ directory, audits language tags, and generates manifest.json.
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import ts from 'typescript';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'src/data');
const OUT_DIR = path.join(ROOT_DIR, '.snippets');

const isStrict = process.argv.includes('--strict') || process.argv.includes('--ci') || process.env.STRICT === 'true' || process.env.STRICT_SNIPPET_TAGS === '1';
const isJson = process.argv.includes('--json');

// 1. Ingest Lesson Data
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

// 2. Infer Language if not explicitly provided
function inferLanguage(title = '', code = '') {
  const t = title.toLowerCase();
  if (t.endsWith('.sh') || t.includes('flags') || t.includes('javap') || t.includes('disassembly') || code.startsWith('#!') || code.startsWith('java -') || code.startsWith('javac ')) {
    return 'bash';
  }
  if (t.endsWith('.spl') || t.includes('splunk') || code.includes('index=') || code.includes('sourcetype=')) {
    return 'spl';
  }
  return 'java';
}

// 3. Derive File Name
function deriveFileName(lessonSlug, stepId, title, language, code) {
  let baseName = '';

  if (language === 'java') {
    // Look for first public class/interface/record/enum
    const typeMatch = code.match(/public\s+(?:final\s+|sealed\s+|non-sealed\s+|abstract\s+)?(?:class|interface|record|enum)\s+([A-Za-z0-9_]+)/);
    if (typeMatch) {
      baseName = typeMatch[1];
    } else {
      // Look for any class/interface/record/enum
      const anyTypeMatch = code.match(/(?:class|interface|record|enum)\s+([A-Za-z0-9_]+)/);
      if (anyTypeMatch) {
        baseName = anyTypeMatch[1];
      }
    }
  }

  if (!baseName && title) {
    baseName = title.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-zA-Z0-9_]/g, '');
  }

  if (!baseName) {
    baseName = 'Snippet';
  }

  const ext = language === 'java' ? '.java' : language === 'bash' ? '.sh' : language === 'spl' ? '.spl' : '.txt';
  return `${lessonSlug}_${stepId}_${baseName}${ext}`;
}

// 4. Extraction Logic
function extractSnippets() {
  const lessons = loadLessonData();

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const javaDir = path.join(OUT_DIR, 'java');
  const bashDir = path.join(OUT_DIR, 'bash');
  const splDir = path.join(OUT_DIR, 'spl');

  fs.mkdirSync(javaDir, { recursive: true });
  fs.mkdirSync(bashDir, { recursive: true });
  fs.mkdirSync(splDir, { recursive: true });

  const snippets = [];
  let missingLanguageCount = 0;

  for (const lesson of lessons) {
    for (const step of lesson.steps) {
      if (!step.codeExample || !step.codeExample.code) continue;

      const codeEx = step.codeExample;
      const explicitLanguage = codeEx.language || null;
      if (!explicitLanguage) {
        missingLanguageCount++;
      }

      const language = explicitLanguage || inferLanguage(codeEx.title, codeEx.code);
      const fileName = deriveFileName(lesson.slug, step.id, codeEx.title, language, codeEx.code);

      const targetDir = language === 'java' ? javaDir : language === 'bash' ? bashDir : splDir;
      const filePath = path.join(targetDir, fileName);

      fs.writeFileSync(filePath, codeEx.code, 'utf8');

      const snippetMeta = {
        id: `${lesson.slug}_${step.id}`,
        lessonSlug: lesson.slug,
        stepId: step.id,
        title: codeEx.title || '',
        explicitLanguage,
        language,
        fileName,
        filePath: path.relative(ROOT_DIR, filePath),
        lineCount: codeEx.code.split('\n').length,
        needsPreview: codeEx.code.includes('java.lang.foreign'),
        needsAddExports: codeEx.code.includes('@Contended') || codeEx.code.includes('jdk.internal.vm.annotation.Contended')
      };

      snippets.push(snippetMeta);
    }
  }

  const manifest = {
    extractedAt: new Date().toISOString(),
    totalCount: snippets.length,
    javaCount: snippets.filter(s => s.language === 'java').length,
    bashCount: snippets.filter(s => s.language === 'bash').length,
    splCount: snippets.filter(s => s.language === 'spl').length,
    missingLanguageCount,
    snippets
  };

  const manifestPath = path.join(OUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  return manifest;
}

// 5. Execution
try {
  const manifest = extractSnippets();

  if (isJson) {
    console.log(JSON.stringify(manifest, null, 2));
  } else {
    console.log('\n======================================================');
    console.log('         CODE SNIPPET EXTRACTION & AUDIT              ');
    console.log('======================================================');
    console.log(`Total Snippets Extracted: ${manifest.totalCount}`);
    console.log(`  - Java Snippets:        ${manifest.javaCount}`);
    console.log(`  - Bash / CLI Snippets:  ${manifest.bashCount}`);
    console.log(`  - Splunk SPL Snippets:  ${manifest.splCount}`);
    console.log(`Explicit Language Tags:   ${manifest.totalCount - manifest.missingLanguageCount} / ${manifest.totalCount}`);
    console.log(`Missing Language Tags:    ${manifest.missingLanguageCount} (Remediation in M3)\n`);
    console.log(`Manifest written to: .snippets/manifest.json`);
  }

  if (isStrict && manifest.missingLanguageCount > 0) {
    if (!isJson) console.error(`[FAIL] Snippet audit failed: ${manifest.missingLanguageCount} code snippets are missing explicit language tags under --strict mode.`);
    process.exit(1);
  } else {
    if (!isJson) console.log('[PASS] Snippet extraction completed successfully.\n');
    process.exit(0);
  }
} catch (err) {
  if (!isJson) console.error('[FATAL] Failed to extract snippets:', err);
  process.exit(1);
}
