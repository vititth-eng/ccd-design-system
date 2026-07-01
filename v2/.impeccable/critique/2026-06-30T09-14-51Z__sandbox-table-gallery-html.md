---
target: v2 table gallery
total_score: 32
p0_count: 1
p1_count: 1
timestamp: 2026-06-30T09-14-51Z
slug: sandbox-table-gallery-html
---
Method: dual-agent (A: aa22f4d09c2ad9b77 [rerun] · B: af86d1e0625669eaa)
Target: v2/sandbox-table-gallery.html · Register: product

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Open-drill state near-invisible (0.13α shadow); open parent barely differs from closed |
| 2 | Match System / Real World | 4 | Thai-first labels + English gloss + ก→ฮ sort wording — genuinely localized |
| 3 | User Control and Freedom | 3 | Per-column "ล้างตัวกรอง" clear; no global clear-all-filters / deselect-all |
| 4 | Consistency and Standards | 4 | One flush base, fixed-gutter controls compose; tabular-nums everywhere; status doctrine held |
| 5 | Error Prevention | 3 | Danger kebab color-marked; indeterminate select-all correct; no delete-confirm (N/A static) |
| 6 | Recognition Rather Than Recall | 3 | 4 sortable carets identical at rest — "which is sorted" too quiet |
| 7 | Flexibility and Efficiency | 4 | Mix-and-match gutters, compact, heat scan, keyboard-reachable — strong density story |
| 8 | Aesthetic and Minimalist | 4 | Quiet, contained, data-leads, nothing decorative — exemplary restraint |
| 9 | Error Recovery | n/a | Static showroom — no live error states |
| 10 | Help and Documentation | 4 | The .gv__use blurbs ARE the docs — each variant names its real consumer + doctrine |
| **Total** | | **32/36** (9 n/a) | **Strong — ship-ready with fixes** |

## Anti-Patterns Verdict
**Does this look AI-generated? No.** A Linear/Stripe-fluent user would not pause.

**LLM assessment:** Reads as a real opinionated internal DS, not template filler — flush-hairline grid, 400-weight header that recedes by weight not color, 600/ink first column, mask-drawn caret/funnel, CSS-drawn kebab/chevron. **Zero anti-reference hits:** no cream bg (#F6F9FD misty wash is on-palette), no gradient/glow, no eyebrows, no hero-metric, no nested cards, no decorative color (hue only as status dots, heat fill, brand caret/link). Mono-blue discipline holds.

**Deterministic scan (detect.mjs, exit 2, 2 findings):**
- `overused-font` (Inter, line 8) — genuine flag but a deliberate DS policy choice (Inter + Noto Sans Thai), not a defect.
- `em-dash-overuse` (18) — **false positive**: count swept CSS `--token`/`--modifier` syntax; real prose em-dashes ≈ 1 per heading, idiomatic.
- No side-stripe / decorative-color hits — `border-left` cell dividers + `status--*` meaning-colors passed clean.

## Overall Impression
The system's thesis — "one flush base, controls compose because each owns a fixed gutter" — holds in the actual CSS, not just the mockup. The craft is real and the restraint is correct for the register. The single biggest opportunity is the **heat matrix**: its color fill, meant to aid scanning, currently sabotages the numbers it sits behind (contrast failure on the exact low-res daylight-Windows target).

## What's Working
1. **Header recedes by weight, not color** — 400 full-ink header on white band over 600/ink first column. Sophisticated inversion of the "gray header" cliché; data leads. (Verified: thead th 400, first td 600.)
2. **One base, fixed-gutter composition** — leading select/drill + trailing kebab each own a reserved gutter; the mix-and-match footer genuinely composes in CSS. Load-bearing idea, and it holds.
3. **Numeric integrity** — tabular-nums on every .n cell + child rows in the SAME table keep digits/columns aligned across year→quarter drill. This is what makes the Feasibility cash-flow use real.

## Priority Issues

**[P0] Heat-matrix mid-range cells fail contrast (card 6).**
White text on `--heat-3` (#B5C7EB) = **1.70:1**, on `--heat-4` (#91ABE1) = **2.30:1** — both fail WCAG AA badly (12px text needs 4.5:1). Only heat-5 passes. Scores 2.5–4.4 map to heat-3/4 — the *most common* mid-range cells — so the hardest-to-read numbers are the most frequent ones, at 12px on a 1366 daylight Windows screen.
- **Fix:** switch heat-3/4 foreground to ink (#142549 on #B5C7EB ≈ 7:1, passes); ink-on-heat-1/2 already passes 10–12:1. One JS threshold flip (`h <= 4 ? ink : white`) + verify.
- **Command:** `/colorize`

**[P1] Sort-state legibility — "which column is sorted" too quiet (card 4).**
All 4 carets render identically at 0.3 opacity at rest; the active column is signaled only by a subtle brand tint + funnel. On a 5-column scan you can't tell at a glance which sort is applied.
- **Fix:** active caret fully opaque + brand-filled + explicit ▲/▼ direction; reserve funnel brand-fill for filtered only.
- **Command:** `/clarify`

**[P2] Open-drill state effectively invisible (card 5).**
The open-parent shadow is real but `rgba(20,37,73,0.13)` / -4px spread ≈ a 1px hairline; only the chevron flip distinguishes open from closed. In a deep cash-flow drill you lose track of which parent is expanded.
- **Fix:** faint `--paper-tint` row bg on the open parent (or raise shadow α to ~0.22) so the expanded group reads as a unit.
- **Command:** `/polish`

**[P3] Parked 12px token in use on showroom chrome (.gv__tag).**
`--fs-micro` (12px) is PARKED (too small for Thai loops + low-res Windows) yet the variation tags use it. Chrome not a table component, so low harm — but a live use of a retired token on the exact target the park protects.
- **Fix:** bump .gv__tag to 14-gray, or sanction it as reference-only chrome with a noted exception.
- **Command:** `/audit`

## Persona Red Flags
- **Sam (accessibility):** P0 heat contrast is a hard blocker — a low-vision staffer cannot read mid-range scores. Worse, heat magnitude is encoded by color alone (no secondary cue), so a color-blind user gets nothing from the fill beyond the printed number — the number that's hardest to read. Double bind.
- **Alex (power user):** no global clear-all-filters or cross-column sort/filter persistence indicator; on a long 360 respondent list he clears columns one menu at a time.
- **Riley (stress):** near-identical sort carets (P1) + invisible open-drill (P2) mean a rushed user can't read current state → re-clicks and re-sorts to be sure.

## Minor Observations
- `.gv__use` muted text (#5C728C on #fff) = 4.95:1 — passes AA; the ink-muted fix is correctly baked in.
- Status dots (#3A9E4D / #E0A100 / #D63A2E) used only as ~7px dots — off-palette escape hatch doctrine respected.
- Heat cell text is 600 weight, but weight can't rescue a 1.70:1 ratio.
- Bilingual headers (card 7) stack Thai over a 1.15-lh .en gloss cleanly; Thai vertical centering renders correct (no upper-mark clipping).
- Empty/no-results state is wired (ไม่พบรายการ), not just the happy path.

## Questions to Consider
1. Heat ramp is one mono-blue sequential scale where cells must ALSO carry readable numbers — is single-hue sequential the wrong tool? Would a lighter ramp with always-ink text (drop white entirely) serve "scan magnitude + read value" better than fighting contrast at the dark end?
2. The composition promise is "controls compose because each owns a fixed gutter." What happens at 1366px with leading-select + drill + trailing-kebab + 6 data columns + Thai labels at once? The gallery never shows the maximal stack — does it hold, or force a horizontal scroll that breaks column alignment?
3. Sort + filter both live behind the same header-menu click. Does hiding sort (frequent) inside the same popover as filter (rare) tax the common case to keep the header clean?
