#!/usr/bin/env node
/**
 * Fails when the workbench's inventory page disagrees with what the repo
 * actually holds.
 *
 * WHY THIS EXISTS: `shell/content/inventory.ts` is the only place that says
 * what state each component is in — demanded by a pattern, reference-only,
 * workbench plumbing, or an undecided transitive arrival. That answer drives a
 * real deletion rule (fence 2: everything a decision did not keep goes), so a
 * list that quietly falls behind the filesystem is worse than no list: it
 * reads as an inventory while omitting the very components nobody decided on.
 * Adding a component is exactly the moment you are thinking about the
 * component and not about the page that lists it.
 *
 * WHAT IT CHECKS AND WHAT IT DELIBERATELY DOES NOT. Only the SET of names is
 * checked, in both directions — a file with no entry, and an entry with no
 * file. The `state` and `why` fields are not checked and must not be: whether
 * a decided pattern demanded something is knowledge about a decision, not a
 * fact recoverable from an import graph. A component imported by /likert is
 * "demanded" only because the Likert pattern was decided; the identical import
 * from an undecided page would mean nothing. Guessing that mechanically would
 * produce a confident wrong answer, which is the failure mode this whole
 * workbench exists to remove.
 *
 * `sonner` is the reason entries may have `file: null` — it is a dependency
 * with no local file, and leaving it out of the inventory would hide the one
 * thing in the stack that nothing imports at all.
 *
 * WHY NO DEPENDENCIES: it runs in the pre-commit hook, which cannot rely on a
 * node_modules that only exists inside v3/shell.
 *
 * Usage: node v3/tools/check-inventory.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const V3 = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INVENTORY_FILE = path.join(V3, "shell/content/inventory.ts");
const COMPONENTS = path.join(V3, "components");

const fail = (msg) => {
  console.error(`check-inventory: ${msg}`);
  process.exitCode = 1;
};

if (!fs.existsSync(INVENTORY_FILE)) {
  fail(`missing ${path.relative(V3, INVENTORY_FILE)}`);
  process.exit(1);
}

/* Component files on disk: components/*.tsx plus components/ui/*.tsx. `cn` and
   friends live in lib/, which is not a component store and is not listed. */
const onDisk = new Set();
for (const dir of [COMPONENTS, path.join(COMPONENTS, "ui")]) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".tsx")) onDisk.add(f.replace(/\.tsx$/, ""));
  }
}

/* Read the names out of the source rather than importing it — this script runs
   under plain node with no TypeScript loader, and the hook must not need one. */
const src = fs.readFileSync(INVENTORY_FILE, "utf8");
const listed = new Set();
for (const m of src.matchAll(/^\s{4}name:\s*"([^"]+)"/gm)) listed.add(m[1]);

if (listed.size === 0) {
  fail("parsed zero entries — the shape of inventory.ts changed and this check went blind");
  process.exit(1);
}

/* Entries with `file: null` are dependencies, not files, so they are expected
   to be listed-but-absent. Collect them so they are not reported as missing. */
const fileless = new Set();
for (const m of src.matchAll(/^\s{4}name:\s*"([^"]+)",\s*\n\s{4}file:\s*null/gm)) {
  fileless.add(m[1]);
}

const missing = [...onDisk].filter((n) => !listed.has(n)).sort();
const phantom = [...listed].filter((n) => !onDisk.has(n) && !fileless.has(n)).sort();

for (const n of missing) {
  fail(`components/**/${n}.tsx exists but is not in the inventory — add it with its state`);
}
for (const n of phantom) {
  fail(`inventory lists "${n}" but no such component file exists — remove it, or set file: null if it is a dependency`);
}

if (process.exitCode !== 1) {
  const counts = [...listed].length;
  console.log(
    `check-inventory: ok — ${counts} entries, ${onDisk.size} component files, no drift.`
  );
}
