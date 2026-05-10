#!/usr/bin/env node
// Coverage check: every shipped CSS class must appear in preview.html.
// Run from repo root: `node scripts/coverage.mjs` (exits 1 on miss).

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cssFiles = readdirSync(root).filter(f => f.endsWith(".css") && !f.startsWith("tokens"));
const preview = readFileSync(join(root, "preview.html"), "utf8");

const stripNoise = src => src
  .replace(/\/\*[\s\S]*?\*\//g, "")        // CSS comments
  .replace(/url\([^)]*\)/g, "url()")       // url() bodies (data URIs etc.)
  .replace(/"[^"]*"|'[^']*'/g, '""');      // string literals

// Match only classes that actually open a rule block: `.foo {`, `.foo,`, `.foo:hover {`, etc.
// This avoids picking up class names from prose inside comments.
const RULE_RE = /\.([a-z][a-zA-Z0-9_-]+)(?=[\s.,:#[>+~{])/g;

// Modifiers / utility roots that compose onto parents — don't expect them
// as standalone class="" entries.
const SKIP = new Set([
  "is-positive", "is-neutral", "is-caution", "is-alert",
  "is-selected", "is-clickable", "is-expandable", "is-expanded",
  "is-sortable", "is-sorted", "is-asc", "is-desc",
  "is-active", "is-current", "is-error", "is-disabled",
  "is-leaving", "is-sticky", "is-danger", "is-loading",
  "is-required", "is-checked", "is-hidden",
  "icon", "icon-16", "icon-20", "icon-24", "spin",
  "w-1", "w-2", "w-3", "w-4",
]);

// Classes intentionally not in preview yet — graduation deferred to a later
// phase. Listing them here documents the deferral and keeps the check green.
const DEFERRED = new Set([
  "btn-primary", "btn-danger",  // modals.css — pending Buttons phase
]);

const missing = [];
for (const file of cssFiles.sort()) {
  const css = stripNoise(readFileSync(join(root, file), "utf8"));
  const found = new Set();
  for (const [, cls] of css.matchAll(RULE_RE)) {
    if (SKIP.has(cls) || DEFERRED.has(cls)) continue;
    found.add(cls);
  }
  for (const cls of [...found].sort()) {
    const re = new RegExp(`class="[^"]*\\b${cls.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`);
    if (!re.test(preview)) missing.push({ file, cls });
  }
}

if (missing.length === 0) {
  console.log("✓ preview.html covers every shipped class.");
  if (DEFERRED.size > 0) {
    console.log(`  (${DEFERRED.size} class${DEFERRED.size === 1 ? "" : "es"} deferred: ${[...DEFERRED].join(", ")})`);
  }
  process.exit(0);
}

console.log("✗ preview.html missing showcases for:");
const byFile = {};
for (const { file, cls } of missing) (byFile[file] ??= []).push(cls);
for (const [file, classes] of Object.entries(byFile)) {
  console.log(`\n  ${file}`);
  for (const cls of classes) console.log(`    .${cls}`);
}
console.log(`\n${missing.length} uncovered class${missing.length === 1 ? "" : "es"}.`);
process.exit(1);
