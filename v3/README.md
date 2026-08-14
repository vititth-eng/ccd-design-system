# v3 — how it is built, and what will bite you

React + Tailwind + Base UI, components copied in by the shadcn CLI rather than linked from a CDN.
That delivery model is the difference from v2, not the styling.

**This file holds mechanics only.** Decisions and their reasons live in Linear (CCD-281); unfinished
work lives in the workspace handoff. Nothing here is a status or a count — those rot.

## Layout

```
v3/
  package.json      npm workspace ROOT. Holds no source; exists so deps resolve for both
                    components/ and shell/. Node resolution only walks UP.
  theme.css         colour + radius tokens, light and dark
  type.css          the type ladder. The ONLY namespace CCD adds on top of shadcn
  components/       the design system itself
    ui/             registry copies — must stay byte-identical to `shadcn add <x> --diff`
    typography.tsx  CCD's, not the registry's
    scale-option.tsx  CCD's
  hooks/ lib/       shared by components/, so NOT under shell/
  shell/            the workbench. Renders the system; never published, never deployed
  tools/check-type.mjs   pre-commit guard
```

`components/ui/` is reserved for registry copies. **Anything CCD authors goes beside it, not in
it** — otherwise `--diff` stops being a truth test.

## Run it

`ds-shell-dev` preview config, port 3090. Routes are in the shell's own sidebar: `/` tokens,
pattern pages, component pages, `/probe` (unstyled Base UI, behaviour only), and the mocks.

The workbench is an **instrument, not the deliverable**. Its value is that rendering real components
finds bugs reading cannot — five silent ones so far, including a checked radio that drew as an empty
outline in dark only.

Chrome is shadcn's `sidebar` with one departure, documented in `app/_workbench/chrome.tsx`. The
theme toggle writes `data-theme` on `<html>` before first paint. The width control is a real iframe
(`?frame=1` strips the chrome) because a narrowed div still reports a desktop viewport to media
queries.

## Traps that each cost real time

1. **Turbopack panics on CSS above the project root.** Fixed by raising `turbopack.root` to `v3/`.
2. **Node resolution only walks up.** The npm workspace root is `v3/package.json`. Do not move deps
   back down. `use-mobile` moved from `shell/hooks` to `v3/hooks` for the same reason: a shared
   component must not reach into the app that renders it.
3. **Tailwind generates only what it can `@source`-scan**, and the globs are relative to
   `globals.css`. A wrong path means the component renders with none of its classes and errors
   nowhere.
4. **A class assembled from a variable is invisible to the scanner.** `bg-${hue}` compiles to
   nothing — a dot with no colour. Write every utility out in full.
5. **The style is `base-vega`, not `new-york`.** The latter is legacy Radix and installs `radix-ui`.
6. **A stylesheet names fonts; it never fetches them.** The shell ran a full day in the wrong faces
   because `layout.tsx` made no font request and Thai fell through to the macOS default.
7. **`shadcn init` must not be run, but two of its imports are mandatory.** Found by scaffolding
   shadcn's own template in a scratch dir and diffing.
   - `tw-animate-css` owns `animate-in` / `fade-in-0` / `zoom-in-95`. Without it every animation
     utility in the copied components is dead.
   - `shadcn/tailwind.css` owns `no-scrollbar` and nine `@custom-variant`s. Without them Tailwind
     falls back to bare attribute presence, so `data-active:` matches even when the attribute reads
     `"false"`.

   Neither file carries a colour or type token, which is why importing them is safe when running
   `init` is not.

## Base UI, as opposed to Radix

- Composition prop is **`render`**, never `asChild`. The wrong one is a type error, the good kind.
- A menu label must sit **inside** its `Group` / `RadioGroup`. Base UI wires `aria-labelledby` from
  it, so a loose label throws rather than rendering unlabelled.
- **State comes through `data-*`, not form pseudo-classes.** `Radio.Root` renders a `<span>`, so a
  `disabled:` variant can never match it — use `data-disabled:`. It would otherwise compile, render
  nothing, and error nowhere.

## The overlay collision, which recurs by design

Every shadcn component with a backdrop hardcodes an absolute overlay colour. It has appeared in
`dialog.tsx` and `sheet.tsx` and will appear again in `alert-dialog` and `drawer`. The fill is
`bg-scrim`, which is mode-aware where `bg-black/50` is not.

`tools/check-type.mjs` catches it at commit — including the utility merely *named in prose*, which
is correct, because Tailwind scans raw text and comments count.

## What the guards catch, and what they do not

`check-type.mjs` blocks off-ladder sizes and weights and absolute colour utilities. It reads the
allowed set from `type.css` on every run rather than holding a copy, so minting a token needs no
edit here.

It does **not** catch: 14-vs-16 misuse, a role replaced by a raw utility, or a token used outside
its documented scope. Those compile. The role layer makes drift findable, not impossible.

**A fresh clone has no hook until told where they live** — `git config core.hooksPath .githooks`,
once per clone. Nothing warns you.

## Measuring inside the workbench

Numbers on a reference page are read off the rendered element, never typed beside it. Three ways
that has gone wrong, all of which produced a confident wrong number:

- **Reading on mount.** Base UI assigns its roving `tabindex` in a later effect, so tab stops read
  as zero. Observe and re-read.
- **Trusting a bounding box.** A hit area extended by an `::after` with negative insets is invisible
  to `getBoundingClientRect` — the registry's 16px radio is really a 40×32 target.
- **Not re-measuring on resize.** A width measured once at desktop is wrong at the width the
  decision is actually made at.

And sample **every** element being compared, never just the first: one unchecked radio, or a stale
hidden copy of the page during a reload, will happily answer for the whole set.

## Type, in one line each

- 7 sizes, Tailwind's ladder unmodified. Leading is CCD's and is the only difference from stock.
- **14 is chrome, 16 is content.** A card can hold either, so a content card declares `text-base`
  once on the Card — shadcn's `Card` sets `text-sm` on its root and a paragraph inside inherits it.
- shadcn tokenises **colour and radius only**. Shadow, spacing, z-index and motion are Tailwind's
  defaults on purpose. An untokenised material is their shape, not a hole.
