# CCD Design System — Integration Guide

How to wire any CCD internal tool to the shared design system.

---

## CDN URLs

All assets served from `vititth-eng/ccd-design-system` via jsdelivr. Always use `@main`.

| Asset | URL |
|---|---|
| Tokens (color, type, spacing, motion) | `https://cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/tokens.css` |
| Nav primitives | `https://cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/nav.css` |
| Tailwind preset | `https://cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/tailwind-preset.css` |
| CCD mark (nav chrome) | `https://cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/assets/ccd-mark-full.svg` |
| CCD full lockup (hero/marketing) | `https://cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/assets/ccd-full.svg` |

> jsdelivr caches `@main` for ~12h. After pushing a change, purge:
> `https://purge.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/<filename>`

---

## Fonts

Load via Google Fonts in every page `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap" />
```

---

## Tokens

Add to every page `<head>` before any other stylesheet:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/tokens.css" />
```

Use CSS variables everywhere. Never hardcode hex, px sizes, or font names.

```css
/* ✓ */
color: var(--ink);
font-size: var(--fs-body);
background: var(--paper-tint);

/* ✗ */
color: #1e2a4a;
font-size: 14px;
background: #f6f9fd;
```

Key tokens quick reference:

| Role | Token |
|---|---|
| Page background | `--paper` (white) · `--paper-tint` (misty wash) |
| Cards | `--card` |
| Text | `--ink` · `--ink-soft` · `--ink-muted` |
| Brand | `--brand` · `--brand-deep` · `--brand-soft` |
| Border | `--rule` |
| Font sizes | `--fs-nano` · `--fs-micro` · `--fs-small` · `--fs-body` · `--fs-data` · `--fs-kpi` |
| Font weights | `--fw-medium` · `--fw-semi` |
| Motion | `--dur-fast` · `--dur-base` · `--ease` |

Full spec → `DESIGN-SYSTEM.md` in this repo.

---

## Chrome (topbar + footer)

Chrome is a **React component** shipped from this repo's npm-style package. Install via git URL pinned to a tag:

```bash
npm install "@ccd/design-system@github:vititth-eng/ccd-design-system#v0.4.0"
```

In `next.config.ts`:
```ts
transpilePackages: ['@ccd/design-system'],
```

Wrap chrome in a per-tool client component that wires auth (consumers own their Supabase client). Pass `isOnTool` when running outside the landing app so nav links resolve to absolute URLs:

```tsx
'use client';
import { ChromeHeader as SharedChromeHeader, type ChromeUser } from '@ccd/design-system';
export { ChromeFooter } from '@ccd/design-system';

export function ChromeHeader() {
  // wire user + onSignOut from your auth client, then:
  return <SharedChromeHeader user={user} onSignOut={handleSignOut} isOnTool />;
}
```

Chrome handles: sticky topbar · tools dropdown · anniversary ticker · Sign in/out · footer.

---

## Next.js / Tailwind tools

Turbopack can't load CDN CSS directly. Use the vendor pattern:

1. Copy `tokens.css` → `app/ccd-tokens.css`
2. Copy `tailwind-preset.css` → `app/ccd-preset.css`
3. Import in `app/globals.css`: `@import './ccd-tokens.css';`
4. Load other primitives (nav, etc.) via `<link>` in layout

Re-sync vendored files after any token change in this repo. Drift check:
```
node scripts/drift-audit.mjs <tool-path>
```

---

## What lives where

| Change | Where |
|---|---|
| Color, type, spacing, motion tokens | This repo (`tokens.css`) |
| Topbar, footer, shared chrome | This repo (`src/components/Chrome.tsx`, React) |
| Nav, buttons, tables, forms, modals | This repo (primitive CSS files) |
| Tool layout, page-specific components | Tool's own repo |
| Tool copy, product decisions | Tool's own `PRODUCT.md` |

**Never edit tokens or shared primitives inside a tool repo.** Always come back here.

---

## Drift audit

Check a tool's token coverage before shipping:
```
node scripts/drift-audit.mjs <path-to-tool>
```

Baseline targets: Landing 97% · Onboarding ≥90% (Step 4 target) · Sounding Board 100%.
