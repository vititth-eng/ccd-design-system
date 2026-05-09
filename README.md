# CCD BRB Design System

The shared design tokens consumed by every **CCD · Boon Rawd Brewery internal tool**.

**Spec & rules** live in the workspace doc:
`~/Library/CloudStorage/OneDrive-BoonrawdBreweryCo.,Ltd/Active Project/CCD BRB Design/DESIGN-SYSTEM.md`

This repo is the **machine-readable** half — what tools actually import.

## Files

| File | Purpose |
|---|---|
| `tokens.css` | Source of truth for color, type, spacing, motion. Every tool imports this. |
| `preview.html` | Visual reference. Open in browser to inspect every token + component. |
| `components/` | Reusable CSS snippets (planned: `card.css`, `pill.css`, `btn.css`). |

## How tools consume it

After this repo is pushed to GitHub (`vititth-eng/ccd-design-system`), every tool's HTML loads:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@main/tokens.css" />
```

jsDelivr serves the file via global CDN. Push a change here → all tools pick it up on next deploy.

## The Rule

🎨 **All design changes happen in this repo + its workspace doc. Never in tool repos.**

If you find yourself editing color/type/spacing inside a tool repo — **stop**. Switch to CCD BRB Design workspace, change `tokens.css`, push, then the tool inherits the change automatically.

## Local preview

```bash
cd ~/code/ccd-design-system
open preview.html
```

## Bumping a token

1. Edit `tokens.css` in this repo.
2. Open `preview.html` to verify visually.
3. Commit + push.
4. Tools auto-update on their next deploy.

## Tools that consume this system

| Tool | Repo | Status |
|---|---|---|
| CCD BRB Landing | `vititth-eng/ccd-brb-landing` | 🟢 consumes |
| Onboarding Dashboard | `vititth-eng/ccd-brb-onboarding` | ⚪ pending refresh |
| Comment Tagging | `vititth-eng/ccd-comment-tagging` | ⚪ pending styling |
