# Product

## Register
product

## Users
Internal Boonrawd staff — HR, line managers, analysts — using B2B tools to finish
tasks (onboarding surveys, 360 reviews, feasibility models, learning paths). Mostly
on **low-resolution Windows laptops (1366×768)** in daylight offices. Task-focused,
not browsing. Many read **Thai** alongside Latin. Non-expert: clarity and speed beat
delight.

## Product Purpose
A shared design system — CSS tokens + vanilla components — consumed by 10 internal
CCD/BRB web apps. Its job: make every tool look consistent, professional, and
dense-but-legible so staff trust the data and complete tasks fast. The system serves
the apps; it is never the product itself.

## Brand Personality
Quiet, precise, institutional-calm. Mono-blue. Confidence through restraint and
information density — never decoration. The interface recedes; the data leads.

## Anti-references
- SaaS-cream / warm-neutral body backgrounds
- Gradient heroes, gradient text, glow effects
- Tiny uppercase tracked eyebrow / kicker above titles
- The hero-metric template (huge number + tiny label + accent)
- Identical card grids; nested cards
- Marketing-landing energy applied to an internal tool
- Color used decoratively
- 1-second spinners / hurried motion

## Design Principles
- **Color marks meaning** — hue is reserved for status and data semantics, never decoration.
- **Flat, compact, contained** — shallow hierarchy, tight density, containment over drop-shadow drama.
- **Density-first but legible** — pack information, but never below readable weight/contrast (especially Thai).
- **tokens.css is the single source of truth** — every value resolves to a token.
- **Quiet default** — when two options both pass, pick the calmer one.

## Composition rules
How a page is assembled. Read before mocking any screen. Hard cap: this section
stays under one page — a new rule must merge with or replace an old one.
*Grows by graduation: a correction Vitit makes twice becomes a rule here; the
scar + why stays in memory.*

1. **Structure by line, gap, or heading — never fill, never a second box.** A
   background belongs to controls and state only (hover · selection · disabled ·
   track · pill · marker); a tinted rectangle around content is always wrong.
   Frames obey the same rule: `.tbl-wrap` IS a card, so a table never nests in
   one — title above, table below, no exception for page rhythm (owner call
   2026-07-29, after seeing full-bleed tried). A table inset inside a padded card
   is the shape to look for: its row lines stop short of the border with nothing
   to explain where they end.
   **Dark does not relax this.** The law is a *lightness step with a no-hue
   clause*, not "no fills" — light mode's step is zero only because white is the
   ceiling. A dark card is the same neutral one step up: no hue, no meaning, no
   decoration. Read the other way ("dark mode may use surfaces") and the
   `--canvas` panel rejected three times walks straight back in.
   **And on dark a tint is backing, never signal** — the status dot carries the
   meaning. Low-alpha hues over a dark ground compress into one lightness band
   and stop being distinguishable, so a pill without its `<i>` is unreadable in a
   way it never was on white (CCD-174, found by rendering).
2. **Frame by facing.** Respondent-facing → mobile-fit, slim top bar, passes 375px.
   Admin-facing → sidebar shell, dense, laptop-first. Single-screen → main panel
   alone, no sidebar. Tabs are in-page only; never top-nav, never breadcrumbs.
   **Theme follows facing too: outward forms are light-only.** A page reached by
   a token link — survey, questionnaire, rate form, anything an unregistered
   respondent opens — never sets `data-theme` and never shows a theme switch.
   Dark is for signed-in, registered users. The rule needs no enforcement because
   it falls out of where the control lives: the switch is an account preference in
   the sidebar user menu, so no user means no menu means no dark (owner call
   2026-07-30). Stated anyway, because the tokens make dark one attribute away and
   a future respondent screen could pick it up by copy-paste.
3. **Caption-zero.** Start with no helper text. A caption survives only if cutting
   it causes a misread. Ladder: rewrite the label → trust the visual → move to
   tooltip → one legend at top → keep one line. Policy disclaimers and
   thin-data/confidence notes always survive.
   **A page header is the title alone — never an eyebrow above it.** No kicker,
   overline, or caption line preceding a page title, in any app. `.t-sub` and
   `.t-caption` both exist and both sit happily above a title, so the shape is
   one copy-paste away; it is a composition ban, not a missing component. If the
   context genuinely needs stating, it belongs in the nav that got you here or in
   a line *below* the title, never stacked on top of it.
4. **Shallow hierarchy on dense surfaces.** Section heads rise by weight + color,
   not size jumps. KPI numerals use the KPI token, never the display scale. The
   section owns the gap below its head, not the type role — `.t-section` ships
   with no margin on purpose, so a bare heading and a heading-plus-action must be
   given the same gap or half the page sits glued to its content (onboarding mock,
   2026-07-29: 17 bare headings at 0, 8 wrapped ones at --s-2). The pair is
   **--s-2 below the head, --s-5 above it** — same in every app, or the rule only
   stops drift inside one page. NOT the page-title gap (--s-4): a title over a
   card and a section head over its own table are different relationships, and
   --s-4 pushes the head away from the thing it labels (owner call 2026-07-29,
   picked by eye from an 8 / 12 / 16 render on the cowork project page).
5. **Flag exceptions, don't gradient.** Score tables tint only cells beyond a
   fixed instrument threshold (e.g. amber < 4.0, red < 3.5 on Likert 1–5);
   healthy cells stay plain.
6. **Chart colour is a data decision, not a palette lookup.** Pick the JOB from the
   data, then take hues in order inside it — a hue chosen per chart by taste makes
   the same plant blue on one card and green on the next, and the reader re-learns
   every chart.
   **An institutional legend handed over is DATA, not a palette to improve.** When
   the source is an existing report the organisation already reads — a band scale,
   a risk key, a grading ramp — the label, the range, the order AND the hue all
   come across verbatim. Remap the hue to the token nearest it; never remap what a
   band means to reach a nicer hue. Readers have learnt that key elsewhere, and a
   "better" palette silently renames every band for them.
   **Categorical** (people, plants, departments — identity only) → `--chart-1..7`
   by index; `--chart-7` grey is Other/Unassigned, never a real series.
   **Sequential** (headcount, spend, % done) → one hue, light→dark; the magnitude
   lives in the lightness, and a categorical set here throws the order away.
   **Diverging** (agree↔disagree, vs target, YoY) → two hues off a neutral middle.
   **Likert is always diverging** — nine competencies painted `--chart-1..7`
   discards the one thing rating data has. **Status** (done/late/at risk) → the
   status hues, never a chart hue. **Sequential is not built**: the first real
   magnitude chart sizes it, and a mock must not invent values. **Diverging was
   sized 2026-08-05 by borrowing, not minting** — `--chart-3` teal at the agree
   end, `--chart-2` rose at the disagree end, middle a pale mix of that teal into
   `--divider` carrying rule (b)'s hairline. Reuse that pairing; do not pick two
   more hues.
   **Most charts want one hue, not seven** — subject in `--chart-1`, context in
   `--chart-7`; five of the seven then never appear.
   **The seven hexes are frozen, so three rules carry the collisions instead** (the
   audit found series 1 sitting ΔE 4.3 from the dark accent — which also paints
   `.meter` — and series 6 at 8.1 from the caution dot):
   **(a) Colour is never the only channel.** Position identifies a bar, its path
   identifies a line, the direct label says which is which; colour is the lookup aid
   on top. A chart that fails printed greyscale is already wrong. A legend is the
   fallback, not the licence — it makes the reader look away to decode and back.
   **(b) A fill under 3:1 on its ground takes a 1px hairline of its own hue,** never
   a darker fill — on white that is four of the seven, and darkening yellow is the
   olive trap. **(c) A status mark and a chart mark never share a card** — a card
   boundary is what stops a series being compared to the UI (owner call 2026-07-30).
7. **Thai in dense tables:** weight ≤ 400; breathing comes from row padding,
   never a new line-height token.
8. **One-off surfaces borrow mechanics, not shape.** Tokens, focus ring,
   active-state, motion flow in; proportions and header height stay bespoke.
   **A generated scaffold is a one-off surface too.** A dashboard scaffold may
   supply what the DS has no component for — sortable headers, a filter bar, a
   dashboard grid, a freshness stamp, number formatting. **Charts are not on that
   list:** chart colour belongs to THIS design system (owner call 2026-08-11,
   taking it back from the bundled `dataviz` skill, which is not installed and
   did not earn the authority). Three jobs, never swapped — categorical
   (`--chart-1..7`, "which one is this"), sequential (one hue light to dark,
   "how much"), diverging (two hues off a neutral middle; Likert is always
   diverging). Never dual-axis, and categorical hues keep fixed index order
   rather than being cycled — a scaffold's `COLORS[i % n]` is exactly the banned
   shape.
   A scaffold may never supply a value or a name the DS
   already owns: KPI cards are `.kpi`/`.kpi-bar`/`.kpi__delta`, frames `.card`,
   tables `.tbl` + `.tbl-scroll`, quantity `.meter`, status `.st-pill`, empty
   `.state`, chrome `.shell*`, controls `.field`/`.control`, colour `--chart-*`.
   Re-declaring one of those is the bug the scaffold walks in with, and it
   arrives looking like new work. What the scaffold genuinely adds is a **DS
   candidate, not a private component** — `TODO-DS` on first use, graduate on
   second (rule in `CLAUDE.md`, scar in `feedback_ds_graduation_discipline`).
   Dashboards are therefore *composed*, and the DS grows from what they needed.

## Voice
- **English-first chrome.** UI strings are English; Thai arrives later via
  glossary + i18n. Framework/questionnaire content is data — stays as authored.
- Any Thai actually written follows the register in `wiki/thai-house-style.md`.
- Grows by the same graduation rule as Composition.

## Accessibility & Inclusion
Mixed Thai + Latin text (Thai vertical-centering quirks: center the consonant body,
not the ink box). Body contrast ≥ 4.5:1, including on tinted near-whites. Design and
test at 1366×768. Keyboard focus always visible; no hover-only affordances.
