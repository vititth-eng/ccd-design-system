# Integration

The old v1 guide that lived here (CDN `@main` URLs, v1 tokens, Chrome wiring) is dead:
v1 was retired from main on 2026-07-10 and survives only as the immutable tag `v1.999.0`
for the apps that still wear it. Do not wire anything new to it.

For v2, one store each:

- **Channels, pins, migration law** → `Superpower/facts/design.yml`
- **Doctrine** (flat/quiet/2-ink, anti-references) → `v2/PRODUCT.md`
- **Component catalog** → `v2/showroom.html` + the per-component `v2/*-gallery.html`
- **Adding a token/component** (graduation, atomic, catalog rule) → `CLAUDE.md` in this repo
- **Consume pattern today**: vendor `v2/*.css` into the app (v2 lives on `wip/v3-rebuild`,
  so no CDN tag exists yet). When v2 lands on main and is tagged, swap to
  `cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@<tag>/v2/*.css` and delete the vendor copy.
- **Frame**: CSS-only `v2/shell.css` — the app authors its own markup and copies the ~15
  lines of glue JS from `v2/shell-gallery.html`. No shared React frame, by design.
