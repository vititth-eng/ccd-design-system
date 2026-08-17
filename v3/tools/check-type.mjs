#!/usr/bin/env node
/**
 * Checks v3 source against the two type namespaces that are CLOSED in
 * type.css, plus one rule about colour — three failures that render
 * without erring.
 *
 * WHY THIS EXISTS: `--text-*: initial` and `--font-weight-*: initial` delete
 * Tailwind's defaults, so an off-ladder utility like `text-2xl` or
 * `font-extrabold` matches nothing, generates no CSS, and renders at the
 * INHERITED value. The element looks slightly wrong and nothing errors —
 * the same silent-failure family as a stale bundle or a dangling var().
 * Measured 2026-08-12: before the weight namespace was closed, three
 * unminted weights were rendering live.
 *
 * WHY NO DEPENDENCIES: v3 adds a build to a repo that deliberately had none.
 * This check has to run in the pre-commit hook, which cannot depend on a
 * node_modules that only exists inside v3/shell.
 *
 * WHY IT NEVER HOLDS A LIST OF SANCTIONED NAMES: the allowed set is READ from
 * type.css on every run. A copied list here would be the same fact in two
 * stores and would rot the first time a size or weight is added — which is
 * exactly the drift this exists to catch. Mint a token, and this script
 * accepts it with no edit.
 *
 * THE COLOUR RULE: an absolute colour utility — `bg-black/50`, `text-white`,
 * `bg-[#4068CA]` — renders perfectly and detaches the element from the token
 * layer forever. shadcn ships exactly this: dialog, sheet, alert-dialog and
 * drawer all hardcode `bg-black/50` for their overlay, which is mode-blind
 * where --scrim is deliberately not (.32 dimming white, .66 dimming near
 * black). Copying a component in and leaving that class is a one-line edit
 * nobody remembers on the fourth component, so the check remembers instead.
 * This is the same rule check-tokens.mjs enforces for v2 CSS, moved to where
 * v3 keeps its classes.
 *
 * SCOPE: v3/**\/*.tsx plus the workbench, EXCLUDING tools/ — a script that
 * names the patterns it hunts would otherwise flag itself.
 *
 * Usage: node v3/tools/check-type.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const V3 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* Tailwind's own utility names. Membership here is what makes a class a SIZE
   or a WEIGHT rather than a colour or a family — `text-foreground` and
   `font-mono` share the prefixes and must not be mistaken for either. */
const TW_SIZES = ["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl","8xl","9xl"];
const TW_WEIGHTS = ["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"];

function mintedFrom(css, prefix, candidates) {
  const found = new Set();
  for (const name of candidates) {
    // Anchored to the start of a declaration so a mention inside prose does
    // not count as a definition. The unanchored version of this mistake cost
    // an afternoon on 2026-08-11.
    const re = new RegExp(`^\\s*--${prefix}-${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:`, "m");
    if (re.test(css)) found.add(name);
  }
  return found;
}

const SKIP_DIRS = new Set(["node_modules", ".next", "tools"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const typePath = path.join(V3, "type.css");
const css = fs.readFileSync(typePath, "utf8");

const sizes = mintedFrom(css, "text", TW_SIZES);
const weights = mintedFrom(css, "font-weight", TW_WEIGHTS);

if (sizes.size === 0 || weights.size === 0) {
  console.error(`check-type: read no ${sizes.size === 0 ? "sizes" : "weights"} from type.css — refusing to pass a check that would accept everything.`);
  process.exit(1);
}

const violations = [];

for (const file of walk(V3)) {
  const src = fs.readFileSync(file, "utf8");
  src.split("\n").forEach((line, i) => {
    for (const m of line.matchAll(/\b(?:text|font)-([a-z0-9]+)\b/g)) {
      const [full, name] = m;
      const isSize = full.startsWith("text-") && TW_SIZES.includes(name);
      const isWeight = full.startsWith("font-") && TW_WEIGHTS.includes(name);
      if (isSize && !sizes.has(name)) {
        violations.push({ file, line: i + 1, cls: full, kind: "size", allowed: [...sizes] });
      } else if (isWeight && !weights.has(name)) {
        violations.push({ file, line: i + 1, cls: full, kind: "weight", allowed: [...weights] });
      }
    }

    /* Absolute colour, in either form Tailwind accepts: a named literal
       (bg-black/50, text-white) or an arbitrary value (bg-[#4068CA],
       border-[rgb(0,0,0)]). Both bypass every token. */
    for (const m of line.matchAll(
      /\b(?:bg|text|border|fill|stroke|ring|outline|divide|shadow|from|via|to)-(?:(?:black|white)(?:\/\d+)?|\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\])]*\)|hsla?\([^\])]*\)|oklch\([^\])]*\))\])/g
    )) {
      violations.push({ file, line: i + 1, cls: m[0], kind: "colour" });
    }

    /* A menu popup sized to its TRIGGER rather than its contents.
       shadcn ships `w-(--anchor-width)` on DropdownMenuContent, which is right
       for a select or combobox — the popup should match the field — and wrong
       for a menu, whose items have nothing to do with how wide the button was.
       Their own DropdownMenuSubContent uses `w-auto` in the same file, which is
       what settles it as a defect rather than an intent.

       It hides in English behind a wide trigger and `min-w-32`. It surfaces on
       an icon trigger (36px) with Thai labels: every item wraps, and the menu
       looks broken without anything erring. Found 2026-08-17 by Vitit looking
       at a screenshot of /menu.

       This is a REGISTRY class we deliberately replace, so a re-copy silently
       reintroduces it — the same shape as the overlay rule above, and the same
       reason the check has to remember instead of a person. */
    for (const m of line.matchAll(/\bw-\(--anchor-width\)/g)) {
      violations.push({ file, line: i + 1, cls: m[0], kind: "anchor-width" });
    }
  });
}

if (violations.length === 0) {
  console.log(
    `check-type: ok — ${sizes.size} sizes, ${weights.size} weights, no off-ladder utility, no absolute colour.`
  );
  process.exit(0);
}

console.error(
  `check-type: ${violations.length} ${violations.length === 1 ? "violation" : "violations"}. Each renders and errors nowhere.\n`
);
for (const v of violations) {
  console.error(`  ${path.relative(V3, v.file)}:${v.line}  ${v.cls}   (${v.kind})`);
}

const kinds = new Set(violations.map((v) => v.kind));
console.error("");
if (kinds.has("size")) {
  console.error(`  minted sizes:   ${[...sizes].map((s) => "text-" + s).join(", ")}`);
}
if (kinds.has("weight")) {
  console.error(`  minted weights: ${[...weights].map((w) => "font-" + w).join(", ")}`);
}
if (kinds.has("size") || kinds.has("weight")) {
  console.error(`  → mint it in v3/type.css if it belongs on the ladder, or use one above.`);
}
if (kinds.has("colour")) {
  console.error(
    `  → absolute colour bypasses every token. Use the token utility instead —\n` +
      `    a shadcn overlay's bg-black/50 becomes bg-scrim, which is mode-aware.`
  );
}
if (kinds.has("anchor-width")) {
  console.error(
    `  → a menu popup sized to its trigger, not its contents. Use w-auto, the\n` +
      `    same class the file's own SubContent uses. On an icon trigger this\n` +
      `    wraps every label and nothing errors.`
  );
}
process.exit(1);
