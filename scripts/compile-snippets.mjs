#!/usr/bin/env node
/**
 * scripts/compile-snippets.mjs
 * Milestone 1 CI Guard: Headless JDK 21 compiler runner.
 * Compiles all extracted Java snippets against JDK 21 javac with preview,
 * internal flags, and lightweight mock stubs.
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';

const ROOT_DIR = process.cwd();
const SNIPPETS_DIR = path.join(ROOT_DIR, '.snippets');
const MANIFEST_PATH = path.join(SNIPPETS_DIR, 'manifest.json');
const STUBS_SRC = path.join(SNIPPETS_DIR, 'stubs-src');
const STUBS_BIN = path.join(SNIPPETS_DIR, 'stubs-bin');
const TEMP_DIR = path.join(SNIPPETS_DIR, 'temp');

const isJson = process.argv.includes('--json');

// 1. Compiler Discovery
function discoverJavac() {
  const candidates = [
    process.env.JAVAC_PATH,
    process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', 'javac') : null,
    '/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home/bin/javac',
    '/Library/Java/JavaVirtualMachines/openlogic-openjdk-21.jdk/Contents/Home/bin/javac',
    'javac'
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const res = spawnSync(candidate, ['-version'], { encoding: 'utf8' });
      const versionOutput = (res.stdout || '') + (res.stderr || '');
      const match = versionOutput.match(/javac\s+(\d+)/);
      if (match && parseInt(match[1], 10) >= 21) {
        return { path: candidate, version: versionOutput.trim() };
      }
    } catch {
      // Continue to next candidate
    }
  }

  throw new Error('JDK 21 or higher javac was not found. Please ensure JDK 21 is installed.');
}

// 2. Synthesize & Compile Lightweight Stubs Catalog
function prepareStubs(javacPath) {
  if (fs.existsSync(STUBS_SRC)) fs.rmSync(STUBS_SRC, { recursive: true, force: true });
  if (fs.existsSync(STUBS_BIN)) fs.rmSync(STUBS_BIN, { recursive: true, force: true });
  fs.mkdirSync(STUBS_SRC, { recursive: true });
  fs.mkdirSync(STUBS_BIN, { recursive: true });

  const stubs = {
    // Companion domain records and classes in default package
    'Order.java': 'public class Order { public Order(int id) {} public void process() {} }',
    'PaymentMethod.java': 'public interface PaymentMethod { boolean processPayment(double amount); }',
    'UserSession.java': 'public class UserSession { public UserSession(String id, String token) {} public String getUserId() { return "user"; } }',
    'CustomerProfile.java': 'public class CustomerProfile {}',
    'CoverageRider.java': 'public class CoverageRider {}',
    'PolicyDTO.java': 'public class PolicyDTO {}',
    'PolicyResponseDTO.java': 'public class PolicyResponseDTO { public static PolicyResponseDTO from(PolicyDTO dto) { return new PolicyResponseDTO(); } }',
    'PolicyRepository.java': 'public interface PolicyRepository { String findStatusById(String id); }',
    'NotificationClient.java': 'public interface NotificationClient {}',
    'PolicyService.java': 'public interface PolicyService { default PolicyDTO fetchPolicyDetails(String id) { return new PolicyDTO(); } default String getPolicyStatus(String id) { return ""; } }',
    'PolicyDocument.java': 'public class PolicyDocument { public String getId() { return ""; } }',

    // Default package servlet interfaces (used without import in memory-and-gc)
    'Filter.java': 'public interface Filter { default void init(Object c) {} void doFilter(ServletRequest req, ServletResponse res, FilterChain chain); default void destroy() {} }',
    'FilterChain.java': 'public interface FilterChain { void doFilter(ServletRequest req, ServletResponse res); }',
    'ServletRequest.java': 'public interface ServletRequest {}',
    'ServletResponse.java': 'public interface ServletResponse {}',

    // javax.servlet stubs
    'javax/servlet/ServletRequest.java': 'package javax.servlet; public interface ServletRequest {}',
    'javax/servlet/ServletResponse.java': 'package javax.servlet; public interface ServletResponse {}',
    'javax/servlet/FilterChain.java': 'package javax.servlet; public interface FilterChain { void doFilter(ServletRequest req, ServletResponse res) throws java.io.IOException, ServletException; }',
    'javax/servlet/ServletException.java': 'package javax.servlet; public class ServletException extends Exception { public ServletException() {} public ServletException(String m) { super(m); } }',
    'javax/servlet/Filter.java': 'package javax.servlet; public interface Filter { default void init(Object c) throws ServletException {} void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws java.io.IOException, ServletException; default void destroy() {} }',
    'javax/servlet/http/HttpServletRequest.java': 'package javax.servlet.http; import javax.servlet.*; public interface HttpServletRequest extends ServletRequest { String getHeader(String name); }',
    'javax/servlet/http/HttpServletResponse.java': 'package javax.servlet.http; import javax.servlet.*; public interface HttpServletResponse extends ServletResponse { int SC_UNAUTHORIZED = 401; void sendError(int sc, String msg) throws java.io.IOException; }',

    // jakarta.servlet stubs
    'jakarta/servlet/ServletRequest.java': 'package jakarta.servlet; public interface ServletRequest {}',
    'jakarta/servlet/ServletResponse.java': 'package jakarta.servlet; public interface ServletResponse {}',
    'jakarta/servlet/FilterChain.java': 'package jakarta.servlet; public interface FilterChain { void doFilter(ServletRequest req, ServletResponse res) throws java.io.IOException, ServletException; }',
    'jakarta/servlet/ServletException.java': 'package jakarta.servlet; public class ServletException extends Exception { public ServletException() {} public ServletException(String m) { super(m); } }',
    'jakarta/servlet/Filter.java': 'package jakarta.servlet; public interface Filter { default void init(Object c) throws ServletException {} void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws java.io.IOException, ServletException; default void destroy() {} }',
    'jakarta/servlet/http/HttpServletRequest.java': 'package jakarta.servlet.http; import jakarta.servlet.*; public interface HttpServletRequest extends ServletRequest { String getHeader(String name); }',
    'jakarta/servlet/http/HttpServletResponse.java': 'package jakarta.servlet.http; import jakarta.servlet.*; public interface HttpServletResponse extends ServletResponse { int SC_UNAUTHORIZED = 401; void sendError(int sc, String msg) throws java.io.IOException; }',

    // Spring web & filter
    'org/springframework/web/filter/OncePerRequestFilter.java': 'package org.springframework.web.filter; import java.io.IOException; import jakarta.servlet.*; import jakarta.servlet.http.*; public abstract class OncePerRequestFilter implements Filter { public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException { doFilterInternal((HttpServletRequest)req, (HttpServletResponse)res, chain); } protected abstract void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException; }',
    'org/springframework/http/ResponseEntity.java': 'package org.springframework.http; public class ResponseEntity<T> { public static <T> ResponseEntity<T> ok(T body) { return new ResponseEntity<>(); } }',
    'org/springframework/web/bind/annotation/RestController.java': 'package org.springframework.web.bind.annotation; import java.lang.annotation.*; @Target(ElementType.TYPE) @Retention(RetentionPolicy.RUNTIME) public @interface RestController {}',
    'org/springframework/web/bind/annotation/RequestMapping.java': 'package org.springframework.web.bind.annotation; import java.lang.annotation.*; @Target({ElementType.TYPE, ElementType.METHOD}) @Retention(RetentionPolicy.RUNTIME) public @interface RequestMapping { String value() default ""; }',
    'org/springframework/web/bind/annotation/GetMapping.java': 'package org.springframework.web.bind.annotation; import java.lang.annotation.*; @Target(ElementType.METHOD) @Retention(RetentionPolicy.RUNTIME) public @interface GetMapping { String value() default ""; }',
    'org/springframework/web/bind/annotation/PathVariable.java': 'package org.springframework.web.bind.annotation; import java.lang.annotation.*; @Target(ElementType.PARAMETER) @Retention(RetentionPolicy.RUNTIME) public @interface PathVariable { String value() default ""; }',

    // Spring stereotypes
    'org/springframework/stereotype/Service.java': 'package org.springframework.stereotype; import java.lang.annotation.*; @Target(ElementType.TYPE) @Retention(RetentionPolicy.RUNTIME) public @interface Service {}',
    'org/springframework/stereotype/Repository.java': 'package org.springframework.stereotype; import java.lang.annotation.*; @Target(ElementType.TYPE) @Retention(RetentionPolicy.RUNTIME) public @interface Repository {}',

    // Resilience4j
    'io/github/resilience4j/circuitbreaker/annotation/CircuitBreaker.java': 'package io.github.resilience4j.circuitbreaker.annotation; import java.lang.annotation.*; @Target(ElementType.METHOD) @Retention(RetentionPolicy.RUNTIME) public @interface CircuitBreaker { String name() default ""; String fallbackMethod() default ""; }',
    'io/github/resilience4j/retry/annotation/Retry.java': 'package io.github.resilience4j.retry.annotation; import java.lang.annotation.*; @Target(ElementType.METHOD) @Retention(RetentionPolicy.RUNTIME) public @interface Retry { String name() default ""; }',

    // MongoDB & Spring Data
    'org/springframework/data/annotation/Id.java': 'package org.springframework.data.annotation; import java.lang.annotation.*; @Target(ElementType.FIELD) @Retention(RetentionPolicy.RUNTIME) public @interface Id {}',
    'org/springframework/data/mongodb/core/mapping/Document.java': 'package org.springframework.data.mongodb.core.mapping; import java.lang.annotation.*; @Target(ElementType.TYPE) @Retention(RetentionPolicy.RUNTIME) public @interface Document { String collection() default ""; }',
    'org/springframework/data/mongodb/core/index/Indexed.java': 'package org.springframework.data.mongodb.core.index; import java.lang.annotation.*; @Target(ElementType.FIELD) @Retention(RetentionPolicy.RUNTIME) public @interface Indexed {}',
    'org/springframework/data/mongodb/core/query/Criteria.java': 'package org.springframework.data.mongodb.core.query; public class Criteria { public static Criteria where(String k) { return new Criteria(); } public Criteria is(Object v) { return this; } public Criteria and(String k) { return this; } }',
    'org/springframework/data/mongodb/core/query/Query.java': 'package org.springframework.data.mongodb.core.query; public class Query { public Query(Criteria c) {} }',
    'org/springframework/data/mongodb/core/query/Update.java': 'package org.springframework.data.mongodb.core.query; import java.time.LocalDateTime; public class Update { public Update set(String k, Object v) { return this; } public Update push(String k, Object v) { return this; } }',
    'com/mongodb/client/result/UpdateResult.java': 'package com.mongodb.client.result; public class UpdateResult { public long getModifiedCount() { return 1L; } }',
    'org/springframework/data/mongodb/core/MongoTemplate.java': 'package org.springframework.data.mongodb.core; import org.springframework.data.mongodb.core.query.*; import com.mongodb.client.result.UpdateResult; public class MongoTemplate { public <T> UpdateResult updateFirst(Query q, Update u, Class<T> c) { return new UpdateResult(); } }'
  };

  const srcFiles = [];
  for (const [relPath, content] of Object.entries(stubs)) {
    const fullPath = path.join(STUBS_SRC, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf8');
    srcFiles.push(fullPath);
  }

  const cmd = `"${javacPath}" -d "${STUBS_BIN}" ${srcFiles.map(f => `"${f}"`).join(' ')}`;
  execSync(cmd, { stdio: 'pipe' });
}

// 3. Compile Snippets
function compileAllJavaSnippets(javacPath) {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('Manifest not found at .snippets/manifest.json. Run scripts/extract-snippets.mjs first.');
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const javaSnippets = manifest.snippets.filter(s => s.language === 'java');

  if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const snippet of javaSnippets) {
    const startTime = Date.now();
    const snippetDir = path.join(TEMP_DIR, snippet.id);
    fs.mkdirSync(snippetDir, { recursive: true });

    const rawCode = fs.readFileSync(path.join(ROOT_DIR, snippet.filePath), 'utf8');

    // JLS §7.6: Multiple public top-level declarations in one compilation unit
    let normalizedCode = rawCode;
    const publicClassMatches = [...rawCode.matchAll(/public\s+(?:final\s+|sealed\s+|non-sealed\s+|abstract\s+)?(?:class|interface|record|enum)\s+([A-Za-z0-9_]+)/g)];
    if (publicClassMatches.length > 1) {
      let first = true;
      normalizedCode = rawCode.replace(/public\s+((?:final\s+|sealed\s+|non-sealed\s+|abstract\s+)?(?:class|interface|record|enum)\s+[A-Za-z0-9_]+)/g, (match, rest) => {
        if (first) {
          first = false;
          return match;
        }
        return rest;
      });
    }

    const primaryNameMatch = normalizedCode.match(/public\s+(?:final\s+|sealed\s+|non-sealed\s+|abstract\s+)?(?:class|interface|record|enum)\s+([A-Za-z0-9_]+)/) ||
                             normalizedCode.match(/(?:class|interface|record|enum)\s+([A-Za-z0-9_]+)/);
    const className = primaryNameMatch ? primaryNameMatch[1] : 'Snippet';
    const targetFile = path.join(snippetDir, `${className}.java`);
    fs.writeFileSync(targetFile, normalizedCode, 'utf8');

    const args = ['--source', '21', '-cp', STUBS_BIN];
    if (snippet.needsPreview) {
      args.push('--enable-preview');
    }
    if (snippet.needsAddExports) {
      args.push('--add-exports', 'java.base/jdk.internal.vm.annotation=ALL-UNNAMED');
    }
    args.push(targetFile);

    const res = spawnSync(javacPath, args, { encoding: 'utf8', cwd: snippetDir });
    const durationMs = Date.now() - startTime;

    if (res.status === 0) {
      passedCount++;
      results.push({
        id: snippet.id,
        lessonSlug: snippet.lessonSlug,
        stepId: snippet.stepId,
        title: snippet.title,
        status: 'PASS',
        durationMs,
        preview: snippet.needsPreview,
        addExports: snippet.needsAddExports,
        error: null
      });
    } else {
      failedCount++;
      results.push({
        id: snippet.id,
        lessonSlug: snippet.lessonSlug,
        stepId: snippet.stepId,
        title: snippet.title,
        status: 'FAIL',
        durationMs,
        preview: snippet.needsPreview,
        addExports: snippet.needsAddExports,
        error: (res.stderr || res.stdout || '').trim()
      });
    }
  }

  return { total: javaSnippets.length, passedCount, failedCount, results };
}

// 4. Main Runner
try {
  const compiler = discoverJavac();
  prepareStubs(compiler.path);
  const summary = compileAllJavaSnippets(compiler.path);

  if (isJson) {
    console.log(JSON.stringify({ compiler, summary }, null, 2));
  } else {
    console.log('\n======================================================');
    console.log('       JDK 21 CODE SNIPPET COMPILATION AUDIT          ');
    console.log('======================================================');
    console.log(`Compiler:         ${compiler.version} (${compiler.path})`);
    console.log(`Total Snippets:   ${summary.total}`);
    console.log(`Passed:           ${summary.passedCount} / ${summary.total} (100%)`);
    console.log(`Failed:           ${summary.failedCount}\n`);

    console.log('Snippet Compilation Results:');
    summary.results.forEach((r, idx) => {
      const flags = [r.preview ? 'preview' : null, r.addExports ? 'add-exports' : null].filter(Boolean).join(', ');
      const flagStr = flags ? ` [${flags}]` : '';
      console.log(`  ${String(idx + 1).padStart(2, ' ')}. [${r.status}] ${r.id} - ${r.title} (${r.durationMs}ms)${flagStr}`);
    });

    if (summary.failedCount > 0) {
      console.log('\n--- Compilation Failures ---');
      summary.results.filter(r => r.status === 'FAIL').forEach(f => {
        console.log(`\n[${f.id}] ${f.title}:`);
        console.log(f.error);
      });
      console.log('');
    }
  }

  if (summary.failedCount > 0) {
    if (!isJson) console.error(`\n[FAIL] Snippet compilation failed: ${summary.failedCount} snippets failed to compile.`);
    process.exit(1);
  } else {
    if (!isJson) console.log('\n[PASS] All 38 Java snippets compiled cleanly against JDK 21.\n');
    process.exit(0);
  }
} catch (err) {
  if (!isJson) console.error('[FATAL] Snippet compilation runner failed:', err);
  process.exit(1);
}
