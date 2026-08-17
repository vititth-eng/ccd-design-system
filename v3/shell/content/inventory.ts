/**
 * Every component the repo holds, and why each one is here.
 *
 * WHAT THIS EXISTS TO SHOW. Vitit, 2026-08-17: "I have no idea we are in a
 * good shape." The rail could not answer him — it listed four component pages
 * while `components/ui/` held eleven files, so the seven with no page were
 * invisible. Not hidden by choice; there was simply nowhere that said what the
 * system is holding. A design system whose own inventory is unreadable cannot
 * be judged, only trusted.
 *
 * THE STATE IS THE POINT, NOT THE LIST. A component that a decided pattern
 * asked for and a component that arrived behind someone else's import are in
 * completely different positions, and on disk they look identical. Fence 2 of
 * the method — a pull is quarantined until the pattern is decided, then
 * everything the decision did not keep is deleted — can only be run against a
 * list that says which is which.
 *
 * HOW THE ROT IS PREVENTED, and what is deliberately left unguarded.
 * `tools/check-inventory.mjs` fails the commit when the names below disagree
 * with the files actually in `components/`. So the SET is machine-checked and
 * cannot drift. The `state` and `why` fields are not checked and cannot be:
 * "a decided pattern demanded this" is knowledge about a decision, not a fact
 * derivable from an import graph. A component used by `/likert` is `demanded`
 * only because the Likert pattern was decided on 2026-08-13 — the same import
 * from an undecided page would prove nothing.
 *
 * `importers` is likewise hand-kept and deliberately coarse: it names the
 * shape of the dependency, not a file list that would rot on every refactor.
 */

export type ComponentState =
  /** A decided pattern asked for it by name. The only state that is finished. */
  | "demanded"
  /** Rendered on a reference page, but no decided pattern uses it yet. */
  | "reference"
  /** Exists to build the workbench itself. Never ships as part of the system. */
  | "instrument"
  /** Arrived transitively behind another pull. Nobody has decided anything. */
  | "transitive"
  /**
   * Pulled ON PURPOSE for a pattern that is still being decided. Fence 2: it
   * stays here until the decision lands, then it is kept or deleted. Different
   * from `transitive` — someone chose this, and someone owes an answer on it.
   */
  | "quarantined"
  /** In package.json, imported by nothing at all. */
  | "unused";

export type InventoryItem = {
  name: string;
  /** File under v3/components/, or null for a dependency with no local file. */
  file: string | null;
  origin: "registry" | "ccd";
  state: ComponentState;
  /** Plain-language: what pulled it in, or what decided it. */
  why: string;
  /** True where our copy has been edited away from what shadcn ships. */
  edited?: string;
  href?: string;
};

export const STATE_LABEL: Record<ComponentState, string> = {
  demanded: "a decided pattern asked for it",
  reference: "has a page, no pattern uses it yet",
  instrument: "builds the workbench, never ships",
  quarantined: "pulled for a pattern still being decided",
  transitive: "arrived behind another pull — undecided",
  unused: "nothing imports it",
};

export const INVENTORY: InventoryItem[] = [
  {
    name: "button",
    file: "ui/button.tsx",
    origin: "registry",
    state: "demanded",
    why: "The Likert scene uses it, and it carries its own reference page.",
    href: "/button",
  },
  {
    name: "card",
    file: "ui/card.tsx",
    origin: "registry",
    state: "demanded",
    why: "The Likert scene wraps every item in one. Two mocks lean on it too.",
    href: "/card",
  },
  {
    name: "radio-group",
    file: "ui/radio-group.tsx",
    origin: "registry",
    state: "demanded",
    why: "Pulled 2026-08-13 because the decided Likert pattern was hand-rolled out of buttons — 200 tab stops where a radio group gives 40, and the arrow keys did nothing.",
  },
  {
    name: "typography",
    file: "typography.tsx",
    origin: "ccd",
    state: "demanded",
    why: "CCD's seven type roles. Ours, not the registry's — shadcn ships no typography at all.",
  },
  {
    name: "scale-option",
    file: "scale-option.tsx",
    origin: "ccd",
    state: "demanded",
    why: "CCD's numbered circle. RadioGroupItem hardcodes its indicator child, so a Likert circle could not use it — this is that component, rebuilt with the registry item's contract.",
  },
  {
    name: "table",
    file: "ui/table.tsx",
    origin: "registry",
    state: "quarantined",
    why: "Pulled 2026-08-17 for the chase/monitor candidate. Costs no dependencies at all, which is why it was taken instead of the dashboard-01 block. Stays here until that pattern is decided.",
  },
  {
    name: "progress",
    file: "ui/progress.tsx",
    origin: "registry",
    state: "quarantined",
    why: "Pulled 2026-08-17 for the chase/monitor summary bar, replacing two hand-rolled divs. Zero dependencies, and it carries the progressbar role and value that the hand-rolled version silently did not.",
  },
  {
    name: "dialog",
    file: "ui/dialog.tsx",
    origin: "registry",
    state: "reference",
    why: "A page and a behaviour probe exist. No decided pattern needs a dialog yet.",
    edited: "overlay uses bg-scrim, not the registry's mode-blind black-at-50%",
    href: "/dialog",
  },
  {
    name: "dropdown-menu",
    file: "ui/dropdown-menu.tsx",
    origin: "registry",
    state: "reference",
    why: "A page exists and settled the selection-vs-hover question. No pattern uses it yet.",
    edited: "popup is w-auto, not sized to its trigger — the registry's version wrapped every Thai label under an icon button",
    href: "/menu",
  },
  {
    name: "sidebar",
    file: "ui/sidebar.tsx",
    origin: "registry",
    state: "instrument",
    why: "The workbench's own rail. Deliberate — hand-rolling it would have duplicated a shipped primitive, and it brings collapse, a mobile drawer, ⌘B and cookie-persisted state. It is not part of what CCD ships.",
  },
  {
    name: "input",
    file: "ui/input.tsx",
    origin: "registry",
    state: "transitive",
    why: "Only sidebar.tsx imports it, for a search field the workbench does not render.",
  },
  {
    name: "separator",
    file: "ui/separator.tsx",
    origin: "registry",
    state: "transitive",
    why: "Only sidebar.tsx imports it.",
  },
  {
    name: "sheet",
    file: "ui/sheet.tsx",
    origin: "registry",
    state: "transitive",
    why: "Only sidebar.tsx imports it — it is the rail's mobile drawer.",
    edited: "overlay uses bg-scrim, not the registry's mode-blind black-at-50%",
  },
  {
    name: "skeleton",
    file: "ui/skeleton.tsx",
    origin: "registry",
    state: "transitive",
    why: "Only sidebar.tsx imports it, for a loading state the workbench never enters.",
  },
  {
    name: "tooltip",
    file: "ui/tooltip.tsx",
    origin: "registry",
    state: "transitive",
    why: "Only sidebar.tsx imports it, for collapsed-rail labels the workbench does not use — its rail collapses off-canvas, not to icons.",
  },
  {
    name: "sonner",
    file: null,
    origin: "registry",
    state: "unused",
    why: "A dependency in package.json with no local file and no import anywhere. Installed during the stack setup for a toast nothing has needed.",
  },
];

/** Counts per state, computed rather than written down beside the list. */
export function inventoryTally(): { state: ComponentState; n: number }[] {
  const order: ComponentState[] = [
    "demanded",
    "reference",
    "instrument",
    "quarantined",
    "transitive",
    "unused",
  ];
  return order
    .map((state) => ({ state, n: INVENTORY.filter((i) => i.state === state).length }))
    .filter((r) => r.n > 0);
}
