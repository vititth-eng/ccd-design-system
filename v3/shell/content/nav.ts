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
  {
    label: "Foundations",
    items: [
      { name: "Tokens", href: "/" },
      { name: "Colour", todo: true },
      { name: "Type", todo: true },
      { name: "Icons", todo: true },
    ],
  },
  {
    label: "Components",
    items: [
      { name: "Button", href: "/button" },
      { name: "Card", href: "/card" },
      { name: "Dialog", href: "/dialog" },
      { name: "Dropdown menu", href: "/menu" },
      { name: "Status", todo: true },
      { name: "Field", todo: true },
      { name: "Select", todo: true },
      { name: "Table", todo: true },
      { name: "Toast", todo: true },
    ],
  },
  {
    label: "Patterns",
    items: [
      { name: "Page shell", todo: true },
      { name: "Form", todo: true },
      { name: "Empty states", todo: true },
    ],
  },
  {
    label: "Behaviour",
    items: [{ name: "Base UI probe", href: "/probe" }],
  },
];

/** Open questions only. Answered ones are removed, not marked. */
export const OPEN_QUESTIONS: { name: string; issue: string }[] = [
  { name: "Chart hues", issue: "CCD-281" },
  { name: "Admin on mobile", issue: "CCD-281" },
];
