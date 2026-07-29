# ccd-design-system

Source of truth for design tokens, brand voice, and interaction patterns across all
CCD · Boon Rawd Brewery internal tools.

- **Active generation:** v2 — everything lives in `v2/` (`tokens.css`, component CSS, galleries, `PRODUCT.md`)
- **Retired:** v1 — frozen at tag `v1.999.0`; legacy apps pin it until their v2 redesign. Never edit v1 again.
- **Channels & pins:** `Superpower/facts/design.yml` · **Consumers:** `Superpower/facts/tools.yml#design-system.consumers`
- **Catalog:** `v2/showroom.html` + per-component `v2/*-gallery.html`
- **Consume:** link the immutable CDN tag `cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@<tag>/v2/*.css` — read the current tag off a live consumer (`grep -ho 'ccd-design-system@[^/]*' ~/dev/code/ccd-brb-*/app/layout.tsx`); bump all consumers in lockstep, never `@main`. Frame is CSS-only `v2/shell.css` — apps author their own markup + copy the ~15 glue lines from `v2/shell-gallery.html`.

🎨 All design changes happen here. Never edit tokens in a tool repo.
