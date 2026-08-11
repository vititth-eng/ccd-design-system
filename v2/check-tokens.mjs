#!/usr/bin/env node
/**
 * Checks the v2 sheets against the two token rules that fail SILENTLY.
 *
 * WHY THESE TWO AND NOT A LINTER: both failures render. Neither errors. A raw
 * hex looks correct until a token moves and one component keeps the old value;
 * a var() pointing at a name that was never defined drops the whole declaration
 * on the floor, so the element falls back to browser default and nothing in the
 * console says why. You cannot see either one by looking at a diff.
 *
 * WHY NO DEPENDENCIES: v2 is CSS-only by design and this repo carries no
 * devDependencies on purpose. A stylelint install would put node_modules and a
 * plugin's release cadence between an edit and a commit, to enforce two rules
 * that are 60 lines of string work.
 *
 * WHY IT NEVER HOLDS A LIST OF TOKEN NAMES: the allowed set is READ from the
 * sheets on every run. A copied list here would be the same fact in two stores
 * and would rot the first time a token is added -- which is exactly the drift
 * this script exists to catch.
 *
 * Rule 1  no raw colour outside tokens.css.
 *         tokens.css is where literals are minted; everywhere else resolves to
 *         a token. Checked in declaration VALUES only, so an id selector that
 *         happens to spell hex digits is not a false positive.
 *
 * Rule 2  every var(--x) resolves to a --x defined SOMEWHERE in the sheets.
 *         Component-local properties count as definitions -- .menu-btn mints
 *         --h, and that is correct. A var() carrying a fallback,
 *         var(--x, 480px), is safe by construction and is skipped -- which is
 *         what makes --form-measure legal with no DS-side setter at all.
 *
 * Reported but NOT enforced (`--spacing`): raw lengths in padding/margin/gap.
 * Nine exist today and each is a deliberate micro-value someone chose by eye.
 * Blocking them would mean inventing a rationale per site, so this prints them
 * and exits 0. Graduate it to a rule when the reasons are written down.
 *
 * Scope is v2/*.css only. The galleries are prototypes and mint values on
 * purpose; bundle.css is generated and is build-bundle.mjs's problem.
 *
 * Usage:
 *   node v2/check-tokens.mjs             # rules 1 and 2; exit 1 on a violation
 *   node v2/check-tokens.mjs --spacing   # also list raw padding/margin/gap
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const V2 = dirname(fileURLToPath(import.meta.url));
const GENERATED = 'bundle.css';
const MINTS_LITERALS = 'tokens.css';

// Blank the body of every comment but keep the newlines, so reported line
// numbers still match the file you open.
const uncomment = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|oklch|oklab|lab|lch|color)\s*\(/;
// A declaration, anywhere including inside @media. Group 1 is the property,
// group 2 the value; selectors never match because they carry no colon.
const DECL = /(?:^|[;{}])\s*(--[\w-]+|[a-zA-Z-]+)\s*:\s*([^;{}]*)/g;
const RAW_LENGTH = /(?<![\w-])\d+(?:\.\d+)?(?:px|rem|em)\b/;
const SPACING_PROP = /^(?:padding|margin|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?$/;

const sheets = readdirSync(V2)
  .filter((f) => f.endsWith('.css') && f !== GENERATED)
  .sort();

if (!sheets.includes(MINTS_LITERALS)) {
  console.error(`check-tokens: ${MINTS_LITERALS} is missing -- refusing to run, every rule here is relative to it.`);
  process.exit(1);
}

const sources = new Map(sheets.map((f) => [f, uncomment(readFileSync(join(V2, f), 'utf8'))]));

// Pass one: collect every custom property the sheets DEFINE, from all of them.
const defined = new Set();
for (const css of sources.values()) {
  for (const [, prop] of css.matchAll(DECL)) {
    if (prop.startsWith('--')) defined.add(prop);
  }
}

// Pass two: judge each sheet line by line, so a violation reports where it is.
const colours = [];
const dangling = [];
const spacing = [];

for (const [file, css] of sources) {
  css.split('\n').forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    const shown = line.trim().replace(/\s+/g, ' ').slice(0, 88);

    for (const [, prop, value] of line.matchAll(DECL)) {
      if (file !== MINTS_LITERALS && RAW_COLOUR.test(value)) {
        colours.push({ at, shown });
      }
      // One line can carry two spacing declarations; report the line once.
      if (SPACING_PROP.test(prop) && RAW_LENGTH.test(value) && spacing.at(-1)?.at !== at) {
        spacing.push({ at, shown });
      }
    }

    // A fallback makes the reference safe whether or not the name exists.
    for (const [, name] of line.matchAll(/\bvar\(\s*(--[\w-]+)\s*\)/g)) {
      if (!defined.has(name)) dangling.push({ at, shown, name });
    }
  });
}

const list = (rows) => rows.forEach((r) => console.error(`    ${r.at}  ${r.shown}`));
let failed = false;

if (colours.length) {
  failed = true;
  console.error(`\ncheck-tokens: ${colours.length} raw colour(s) outside ${MINTS_LITERALS}.`);
  console.error(`    Mint the value as a token in ${MINTS_LITERALS}, then reference it with var().`);
  list(colours);
}

if (dangling.length) {
  failed = true;
  console.error(`\ncheck-tokens: ${dangling.length} var() reference(s) that resolve to nothing.`);
  console.error(`    The whole declaration is dropped at render time and nothing errors.`);
  list(dangling);
}

if (process.argv.includes('--spacing')) {
  console.log(`\ncheck-tokens: ${spacing.length} raw length(s) in padding/margin/gap (reported, not enforced).`);
  spacing.forEach((r) => console.log(`    ${r.at}  ${r.shown}`));
}

if (failed) process.exit(1);

console.log(`check-tokens: clean -- ${sheets.length} sheets, ${defined.size} custom properties defined, 0 raw colours, 0 dangling var().`);
