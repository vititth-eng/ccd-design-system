/**
 * What the sidebar lists, and nothing else.
 *
 * Two rules keep this file from rotting into a second source of truth:
 *
 * 1. A page that exists is a link; a page that does not is `todo`. Nothing here
 *    describes what a page CONCLUDED — that belongs to Linear, and a conclusion
 *    copied into a nav label is a copy that keeps looking authoritative after it
 *    stops being true.
 * 2. Open questions carry their Linear id and no status. When one is answered it
 *    is deleted from this list. Deletion IS the update, which is the only kind of
 *    status a hand-maintained list can be trusted to keep.
 */

export type NavItem = { name: string; href?: string; todo?: boolean };
export type NavGroup = { label: string; items: NavItem[] };

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
    label: "Components",
    items: [
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
  {
    label: "Behaviour",
    items: [{ name: "Base UI probe", href: "/probe" }],
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

/**
 * Open questions only. Answered ones are removed, not marked.
 *
 * Every one of these lives on CCD-281, so the id is not repeated per row — the
 * group carries it once. Two ids reading CCD-281 down the same column looked
 * like data and carried none.
 *
 * "Does the Likert scale keep v2's shape?" belonged here until the pattern page
 * existed. It is on /likert now, and a question in two places is two places to
 * answer it.
 */
export const OPEN_QUESTIONS_ISSUE = "CCD-281";

export const OPEN_QUESTIONS: { name: string }[] = [
  { name: "Does the status trio read on shadcn neutrals?" },
  { name: "Chart hues — three slots, nothing rendered" },
];
