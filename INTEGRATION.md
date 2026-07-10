# Integration

The old v1 guide that lived here (CDN `@main` URLs, v1 tokens, Chrome wiring) is dead:
v1 was retired from main on 2026-07-10 and survives only as the immutable tag `v1.999.0`
for the apps that still wear it. Do not wire anything new to it.

For v2, one store each:

- **Channels, pins, migration law** → `Superpower/facts/design.yml`
- **Doctrine** (flat/quiet/2-ink, anti-references) → `v2/PRODUCT.md`
- **Component catalog** → `v2/showroom.html` + the per-component `v2/*-gallery.html`
- **Adding a token/component** (graduation, atomic, catalog rule) → `CLAUDE.md` in this repo
- **Consume pattern**: link the immutable CDN tag —
  `cdn.jsdelivr.net/gh/vititth-eng/ccd-design-system@v2.0.0/v2/*.css` (current tag in
  `Superpower/facts/design.yml`). Bump every consumer in lockstep on a DS release; never `@main`.
- **Frame**: CSS-only `v2/shell.css` — the app authors its own markup and copies the ~15
  lines of glue JS from `v2/shell-gallery.html`. No shared React frame, by design.
