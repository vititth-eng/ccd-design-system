#!/usr/bin/env node
// Drift audit: scan a consumer tool's HTML+CSS for divergence from the
// ccd-design-system contract. Usage:
//   node scripts/drift-audit.mjs <tool-path>
//   node scripts/drift-audit.mjs ~/code/ccd-brb-onboarding

import { readFileSync, readdirSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/drift-audit.mjs <tool-path>");
  process.exit(2);
}
const root = resolve(target.replace(/^~/, process.env.HOME));

// `.ccd-ds` / `ccd-ds` = the design-system helper checkout pulled in by the CI
// gate. Never audit it — its own CSS/HTML would contaminate the consumer's
// metrics (false pass or false block). The template keeps it a sibling of the
// consumer dir; this skip is defense-in-depth against an accidental nested one.
const SKIP_DIRS = new Set([".git", "node_modules", "archive", ".vercel", ".next", "dist", ".ccd-ds", "ccd-ds"]);
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const all = walk(root);
const cssFiles = all.filter(f => f.endsWith(".css"));
const htmlFiles = all.filter(f => f.endsWith(".html"));
const jsxFiles = all.filter(f => /\.(tsx|jsx|ts|js|mjs)$/.test(f));
if (cssFiles.length + htmlFiles.length === 0) {
  console.error(`no .css or .html under ${root}`);
  process.exit(2);
}

const read = f => readFileSync(f, "utf8");
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "");
const stripDataUri = s => s.replace(/url\(["']?data:[^)]*\)/gi, "url(data:DATAURI)");
const stripStrings = s => s.replace(/"[^"]*"|'[^']*'/g, '""');

const css = cssFiles.map(f => ({ f, src: stripComments(read(f)) })).filter(x => x.src.trim());
const html = htmlFiles.map(f => ({ f, src: stripComments(read(f)) }));
// Pull inline <style>…</style> blocks out of HTML and treat them as CSS sources.
const STYLE_BLOCK_RE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
for (const h of html) {
  for (const m of h.src.matchAll(STYLE_BLOCK_RE)) {
    const inline = stripComments(m[1]);
    if (inline.trim()) css.push({ f: h.f + "#<style>", src: inline });
  }
}
const cssNoData = css.map(x => ({ ...x, src: stripDataUri(x.src) }));
const cssAll = cssNoData.map(x => x.src).join("\n");
const cssClean = cssNoData.map(x => stripStrings(x.src)).join("\n");

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const RGBA_RE = /\brgba?\([^)]*\)/g;
const VAR_RE = /\bvar\(\s*--([a-zA-Z0-9_-]+)/g;
const FONTSIZE_PX_RE = /font-size\s*:\s*(\d+(?:\.\d+)?)px/g;
const RADIUS_PX_RE = /border-radius\s*:\s*([^;}{]+)/g;
const PADMARGAP_PX_RE = /\b(padding|margin|gap|top|right|bottom|left|inset)(?:-[a-z]+)?\s*:\s*[^;}{]*?(\d+(?:\.\d+)?)px/g;
const APPLE_STACK_RE = /font-family\s*:\s*[^;}{]*(-apple-system|BlinkMacSystemFont|"Segoe UI"|'Segoe UI'|Helvetica Neue|Sukhumvit)/gi;
const BESPOKE_SELECTORS = [
  { label: ".tab-btn",                    pat: /\.tab-btn\b/g,                       replace: "nav.css .tabs__tab" },
  { label: ".resolve-modal",              pat: /\.resolve-modal\b/g,                 replace: "modals.css <dialog>" },
  { label: ".state-{empty,loading,error}",pat: /\.state-(empty|loading|error)\b/g,   replace: "states.css" },
  { label: ".month-select",               pat: /\.month-select\b/g,                  replace: "forms.css .f-select" },
  { label: ".resolve-btn / .ag-bulk-btn", pat: /\.resolve-btn\b|\.ag-bulk-btn\b/g,   replace: "buttons.css .btn-*" },
  { label: ".topnav",                     pat: /\.topnav\b/g,                        replace: "nav.css .nav" },
];

const allHex = [...cssClean.matchAll(HEX_RE)].map(m => m[0]);
const allRgba = [...cssClean.matchAll(RGBA_RE)].map(m => m[0]);
const allVars = [...cssAll.matchAll(VAR_RE)].map(m => m[1]);
const fontSizePx = [...cssAll.matchAll(FONTSIZE_PX_RE)].map(m => m[1] + "px");
const radiusPx = [...cssAll.matchAll(RADIUS_PX_RE)]
  .map(m => m[1].trim())
  .filter(v => /\d+px/.test(v) && !/var\(/.test(v));
const spacingPx = [...cssAll.matchAll(PADMARGAP_PX_RE)].length;
const appleStack = [...cssAll.matchAll(APPLE_STACK_RE)].length;
const bespoke = BESPOKE_SELECTORS.map(({ label, pat, replace }) => {
  const n = (cssAll.match(pat) || []).length;
  return n > 0 ? { sel: label, n, replace } : null;
}).filter(Boolean);

// Connection signals can live in HTML (vanilla tools) or CSS (build-tool
// consumers like Next.js where there's no source HTML — the CDN import sits
// in app/globals.css). Check both. Inter/Noto can also arrive via the token
// font-family stack rather than a Google Fonts <link>.
const htmlBlob = html.map(x => x.src).join("\n");
const connectionBlob = htmlBlob + "\n" + cssAll;
const hasCdn = /cdn\.jsdelivr\.net\/gh\/vititth-eng\/ccd-design-system/.test(connectionBlob);
// Fonts arrive three ways: Google Fonts <link> (vanilla HTML), @font-face /
// "Inter" referenced in consumer CSS (rare; tokens.css already does this but
// lives at CDN, so a literal match here means the consumer also references
// the family), or next/font/google in Next.js tools. Any of the three counts.
const jsxBlob = jsxFiles.map(f => { try { return readFileSync(f, "utf8"); } catch { return ""; } }).join("\n");
const NEXT_FONT_INTER = /from\s+["']next\/font\/google["'][\s\S]{0,400}\bInter\b|\bInter\s*\(/;
const NEXT_FONT_NOTO = /from\s+["']next\/font\/google["'][\s\S]{0,400}Noto[_\s]*Sans[_\s]*Thai|Noto_Sans_Thai\s*\(/;
const hasInter = /family=Inter/.test(htmlBlob) || NEXT_FONT_INTER.test(jsxBlob);
const hasNoto = /family=Noto\+Sans\+Thai/.test(htmlBlob) || NEXT_FONT_NOTO.test(jsxBlob);
const hasMark = /ccd-mark-(full|wireframe)\.svg/.test(htmlBlob);
const hasLockup = /ccd-(full|wireframe)\.svg/.test(htmlBlob);

// Derive the system-token allowlist from tokens.css AND tailwind-preset.css
// at runtime so the audit stays in sync with whatever the design system
// actually ships. The preset re-exposes tokens under Tailwind v4 @theme
// namespaces (--color-*, --text-*, --spacing-*, etc.) which build-tool
// consumers reference directly.
const scriptDir = dirname(fileURLToPath(import.meta.url));
const systemTokensSrc = readFileSync(join(scriptDir, "..", "tokens.css"), "utf8");
let presetTokensSrc = "";
try { presetTokensSrc = readFileSync(join(scriptDir, "..", "tailwind-preset.css"), "utf8"); } catch {}
const SYSTEM_TOKENS = new Set(
  [...(systemTokensSrc + "\n" + presetTokensSrc).matchAll(/--([a-zA-Z][a-zA-Z0-9-]*)\s*:/g)].map(m => m[1])
);
const TOOL_LOCAL_OK_PREFIXES = ["ot-"];
const isSystemToken = name => SYSTEM_TOKENS.has(name);
const isToolLocal = name => TOOL_LOCAL_OK_PREFIXES.some(p => name.startsWith(p));

const tokenStats = { system: 0, toolLocal: 0, unknown: [] };
for (const v of allVars) {
  if (isSystemToken(v)) tokenStats.system++;
  else if (isToolLocal(v)) tokenStats.toolLocal++;
  else tokenStats.unknown.push(v);
}
const unknownCounts = tokenStats.unknown.reduce((m, k) => (m[k] = (m[k] || 0) + 1, m), {});

const hexNonDataUri = allHex.length;
const totalLiterals = hexNonDataUri + fontSizePx.length + radiusPx.length + spacingPx + appleStack;
const coverage = allVars.length === 0 ? 0
  : Math.round(100 * allVars.length / (allVars.length + totalLiterals));

const tool = relative(process.env.HOME || "/", root);
const line = (l, v) => console.log(`  ${l.padEnd(28)} ${v}`);
const head = h => console.log(`\n[${h}]`);

console.log(`drift-audit · ~/${tool}`);
console.log(`  ${cssFiles.length} css · ${htmlFiles.length} html`);

head("connection");
line("tokens.css linked", hasCdn ? "✓" : "✗ MISSING CDN");
line("Inter loaded", hasInter ? "✓" : "✗");
line("Noto Sans Thai loaded", hasNoto ? "✓" : "✗");
line("mark.svg used", hasMark ? "✓" : "—");
line("lockup.svg used", hasLockup ? "✓" : "—");

head("color");
line("hex literals (non-data-URI)", hexNonDataUri);
if (hexNonDataUri && hexNonDataUri <= 10) console.log(`    samples: ${[...new Set(allHex)].slice(0, 8).join(" ")}`);
line("rgba() literals", allRgba.length);

head("typography");
line("font-size: Npx", fontSizePx.length);
if (fontSizePx.length) console.log(`    sizes: ${[...new Set(fontSizePx)].sort().join(" ")}`);
line("legacy font stacks", appleStack);

head("radius");
line("border-radius: Npx", radiusPx.length);
if (radiusPx.length) console.log(`    values: ${[...new Set(radiusPx)].sort().join(" · ")}`);

head("spacing/layout");
line("padding/margin/gap: Npx", spacingPx);

head("bespoke primitives");
if (bespoke.length === 0) line("(none)", "✓");
for (const b of bespoke) line(b.sel, `${b.n}× → ${b.replace}`);

head("tokens used");
line("system tokens (refs)", tokenStats.system);
line("tool-local aliases", tokenStats.toolLocal);
line("unknown tokens", tokenStats.unknown.length);
if (tokenStats.unknown.length) {
  const top = Object.entries(unknownCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  for (const [n, c] of top) console.log(`    --${n} (${c}×)`);
}

head("coverage");
line("var() refs / total tokens-or-literals", `${allVars.length} / ${allVars.length + totalLiterals}`);
line("estimated coverage", `${coverage}%`);

// ── React inline-style raw literals (CCD-23) ──────────────
// The CSS scan above misses px/hex hiding inside style={{…}} / style="…"
// in .tsx/.jsx. Heuristic: pull style blocks, then count raw px, hex, and
// var(--x, <literal>) fallbacks inside them. Flat style objects only —
// deeply nested objects past the first }} are not parsed (documented limit).
const STYLE_OBJ_RE = /style=\{\{([\s\S]*?)\}\}/g;
const STYLE_STR_RE = /style=("[^"]*"|'[^']*')/g;
const reactInline = [];
for (const f of jsxFiles) {
  let src;
  try { src = stripComments(readFileSync(f, "utf8")); } catch { continue; }
  const blocks = [...src.matchAll(STYLE_OBJ_RE)].map(m => m[1])
    .concat([...src.matchAll(STYLE_STR_RE)].map(m => m[1]));
  for (const b of blocks) {
    for (const m of b.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) reactInline.push("hex:" + m[0]);
    for (const m of b.matchAll(/\b\d+(?:\.\d+)?px\b/g)) reactInline.push("px:" + m[0]);
    for (const m of b.matchAll(/var\(\s*--[a-zA-Z0-9-]+\s*,\s*[^)]*\d[^)]*\)/g)) reactInline.push("fallback:" + m[0].slice(0, 32));
  }
}

const bespokeTotal = bespoke.reduce((s, b) => s + b.n, 0);

// ── Capture mode: emit this app's baseline as one JSON line ──
// Used to build/refresh scripts/drift-floors.json. The captured numbers
// ARE the frozen floor — they reflect today's reality, so the gate can
// only catch regressions, never existing code.
const appArgIdx = process.argv.indexOf("--app");
const appKey = appArgIdx > -1 && process.argv[appArgIdx + 1]
  ? process.argv[appArgIdx + 1]
  : root.split("/").filter(Boolean).pop();
const metrics = {
  coverage,
  unknownTokens: tokenStats.unknown.length,
  hexLiterals: hexNonDataUri,
  reactInline: reactInline.length,
  bespoke: bespokeTotal,
  hasCdn, hasInter, hasNoto,
};

head("react inline (tsx/jsx style)");
line("raw px/hex/fallback", reactInline.length);
if (reactInline.length && reactInline.length <= 14)
  console.log(`    ${[...new Set(reactInline)].slice(0, 12).join(" ")}`);

if (process.argv.includes("--json")) {
  console.log("\n" + JSON.stringify({ [appKey]: metrics }, null, 2));
  process.exit(0);
}

// ── Gate mode: fail on any regression vs the frozen floor ──
if (process.argv.includes("--gate")) {
  let floors = {};
  try { floors = JSON.parse(readFileSync(join(scriptDir, "drift-floors.json"), "utf8")); } catch {}
  const floor = floors[appKey];
  head("gate");
  line("app", appKey);
  if (!floor) { line("FAIL", `no floor recorded for ${appKey} — run --json and add it`); process.exit(2); }
  const fails = [];
  if (coverage < floor.coverage) fails.push(`coverage ${coverage}% < floor ${floor.coverage}%`);
  if (metrics.unknownTokens > floor.unknownTokens) fails.push(`unknown tokens ${metrics.unknownTokens} > ${floor.unknownTokens}`);
  if (metrics.hexLiterals > floor.hexLiterals) fails.push(`hex literals ${metrics.hexLiterals} > ${floor.hexLiterals}`);
  if (metrics.reactInline > floor.reactInline) fails.push(`react inline ${metrics.reactInline} > ${floor.reactInline}`);
  if (metrics.bespoke > floor.bespoke) fails.push(`bespoke primitives ${metrics.bespoke} > ${floor.bespoke}`);
  if (floor.hasCdn && !hasCdn) fails.push("tokens link regressed (was connected)");
  if (floor.hasInter && !hasInter) fails.push("Inter font link regressed");
  if (floor.hasNoto && !hasNoto) fails.push("Noto Sans Thai font link regressed");
  line("floor coverage", `${floor.coverage}%`);
  line("measured coverage", `${coverage}%`);
  if (fails.length === 0) { line("result", "✓ pass"); process.exit(0); }
  for (const fl of fails) line("FAIL", fl);
  console.log("\n✗ drift gate FAILED — values regressed below the frozen floor.");
  process.exit(1);
}

// ── Advisory mode (default, unchanged) ──
const issues = !hasCdn || !hasInter || !hasNoto || hexNonDataUri > 0 || tokenStats.unknown.length > 0;
process.exit(issues ? 1 : 0);
