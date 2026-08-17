/**
 * What the sidebar lists, and nothing else.
 *
 * THREE FLOORS, and the split is the point (2026-08-17). This file used to be
 * one flat list of groups, which put three unlike things at the same rank:
 * what the system is today, why past choices went the way they did, and the
 * instruments used to measure. A reader had to re-sort them by eye on every
 * visit. Worse, it got worse on its own — a settled argument keeps its page
 * forever, on purpose, so the flat list grows by one permanent row per decision
 * while the part that ships stays the same size.
 *
 * So rank replaces order:
 *
 *   NAV             the system — what is true right now. Top, full weight.
 *   OPEN_QUESTIONS  live state: asked, not yet answered. Same floor as NAV,
 *                   because an open question is a fact about today.
 *   SETTLED         the evidence behind decisions already made. Folded away.
 *   TOOLS           instruments. Bottom, quietest.
 *
 * Three rules keep this file from rotting into a second source of truth:
 *
 * 1. A page that exists is a link; a page that does not is `todo`. Nothing in
 *    NAV describes what a page CONCLUDED — that belongs to Linear, and a
 *    conclusion copied into a nav label is a copy that keeps looking
 *    authoritative after it stops being true.
 * 2. SETTLED is the ONE exception, and it is safe for the opposite reason: a
 *    settled answer does not change. If one ever does, the row does not get
 *    edited — it moves back up to OPEN_QUESTIONS, which is a visible event.
 * 3. Open questions carry their Linear id and no status. When one is answered
 *    it moves to SETTLED with its answer, or is deleted. Movement IS the
 *    update, which is the only kind of status a hand-maintained list keeps.
 */

export type NavItem = { name: string; href?: string; todo?: boolean };
export type NavGroup = { label: string; items: NavItem[] };

/* ── Floor 1 · the system ─────────────────────────────────────────────── */

export const NAV: NavGroup[] = [
  /**
   * Patterns lead, and the order is the argument.
   *
   * A pattern answers "what shape does this job take". A component answers
   * "what does this control look like". Listing components first taught every
   * reader — including me — to shop for parts and assemble a screen out of
   * them, which is exactly how CCD's apps ended up with 28 bespoke components
   * in cowork alone. Components are now reference material for a pattern that
   * already decided it needs them.
   *
   * The unlinked entries are the jobs already named, not a wishlist. Each one
   * is a screen that exists today in some v2 app and has never been designed.
   */
  {
    label: "Patterns",
    items: [
      { name: "Likert scale", href: "/likert" },
      { name: "Admin table", todo: true },
      { name: "Create form", todo: true },
      { name: "Dashboard", todo: true },
      { name: "Empty & error states", todo: true },
    ],
  },
  {
    /**
     * "Everything we hold" leads, and it is the only row here that is complete.
     *
     * The four pages below it were the whole of this group until 2026-08-17,
     * while `components/ui/` held eleven files — so the seven without a page
     * were invisible, including five that arrived behind a single `sidebar`
     * pull and that nobody has decided anything about. A group that lists a
     * third of what exists reads as an inventory and is not one.
     *
     * The page cannot be replaced by adding the missing seven as rows: most
     * have nothing to show, and a nav row promises a page worth opening. What
     * they need is a state beside a name, which is a table, not a rail.
     */
    label: "Components",
    items: [
      { name: "Everything we hold", href: "/inventory" },
      { name: "Button", href: "/button" },
      { name: "Card", href: "/card" },
      { name: "Dialog", href: "/dialog" },
      { name: "Dropdown menu", href: "/menu" },
    ],
  },
  {
    /**
     * One row, because there is one page and it renders every foundation
     * there is. The dead "Colour" and "Type" rows that used to sit here
     * promised pages that did not exist, next to a row called "Tokens" that
     * already showed both — three labels for one thing, two of them lying.
     *
     * There is no shadow, spacing or motion row, and that is shadcn's shape
     * rather than an omission: their theming doc tokenises colour and radius
     * and leaves the rest to Tailwind's defaults. CCD adds type on top and
     * nothing else.
     */
    label: "Foundations",
    items: [{ name: "Tokens", href: "/" }],
  },
];

/**
 * The fixture controls belong to pattern pages and nowhere else.
 *
 * A component page is a specimen — its copy is chosen to exercise the
 * component, not to stand in for a user's data — so a language toggle above it
 * would sit there reading EN while the card below it stayed in Thai. A control
 * that visibly changes nothing is the same defect as a dead utility class: it
 * reports a state the page does not have, and nothing errors.
 */
export function isPatternRoute(pathname: string): boolean {
  const patterns = NAV.find((g) => g.label === "Patterns");
  return patterns?.items.some((i) => i.href === pathname) ?? false;
}

/* ── Floor 1 · still open ─────────────────────────────────────────────── */

/**
 * Open questions only. Answered ones move to SETTLED, they are not marked here.
 *
 * Every one of these lives on CCD-281, so the id is not repeated per row — the
 * group carries it once. Two ids reading CCD-281 down the same column looked
 * like data and carried none.
 *
 * Some have a page and some do not, which is why `href` is optional. A question
 * with a page is not further along than one without — `/mocks/likert-control`
 * has rendered its three candidates for days and the choice is still parked
 * until the rater-form surface comes up. Having evidence is not having decided,
 * and this list is the only place that distinction is visible.
 */
export const OPEN_QUESTIONS_ISSUE = "CCD-281";

export const OPEN_QUESTIONS: { name: string; href?: string }[] = [
  { name: "Likert control — how it is drawn", href: "/mocks/likert-control" },
  { name: "Chart hues — three slots, nothing rendered" },
];

/* ── Floor 2 · decided, folded away ───────────────────────────────────── */

/**
 * Mocks whose question has been answered. Folded shut by default.
 *
 * They are kept forever — Vitit's rule, 2026-08-12: a decision whose evidence
 * was deleted gets re-opened by the next person to disagree. Folding is what
 * makes that rule affordable. Nothing is removed and nothing is harder to
 * reach; the pages simply stop competing with the system for the same glance.
 *
 * Each row carries the answer it produced, because that is the only thing a
 * reader wants from this floor. Without it the row asks you to open the page
 * to find out whether you care — which is the cost that made the flat list
 * tiring in the first place.
 *
 * `answer` is deliberately the OUTCOME, never the reasoning. The reasoning is
 * in the page's own header comment and in Linear, and a summary of it here
 * would be a third copy that drifts.
 */
export type SettledItem = { name: string; href: string; answer: string };

export const SETTLED: SettledItem[] = [
  {
    name: "Likert — five shapes",
    href: "/mocks/likert-shape",
    answer: "matrix, 2026-08-13",
  },
  {
    name: "Leading — CCD vs vega",
    href: "/mocks/leading",
    answer: "CCD's leading kept, 2026-08-12",
  },
  {
    name: "Caution — #CF741E vs darker",
    href: "/mocks/caution-status",
    answer: "shipped hue kept, 2026-08-13",
  },
];

/* ── Floor 3 · instruments ────────────────────────────────────────────── */

/**
 * How we measure, as opposed to what we built. Bottom of the rail, quietest.
 *
 * The probe renders Base UI unstyled to check behaviour with nothing in the
 * way. It is not a component page and it is not evidence for any decision —
 * grouping it under "Behaviour" beside the component pages implied it was one
 * more thing the system ships, which it is not.
 */
export const TOOLS: NavItem[] = [{ name: "Base UI probe", href: "/probe" }];

/**
 * Every named route in the rail, whichever floor it sits on.
 *
 * The header label used to read from NAV alone, so it fell back to printing the
 * raw pathname on every mock and on the probe — the pages most likely to be
 * open when someone is confused about where they are.
 */
export function routeName(pathname: string): string {
  for (const group of NAV) {
    for (const item of group.items) {
      if (item.href === pathname) return item.name;
    }
  }
  for (const item of [...SETTLED, ...TOOLS, ...OPEN_QUESTIONS]) {
    if (item.href === pathname) return item.name;
  }
  return pathname;
}
