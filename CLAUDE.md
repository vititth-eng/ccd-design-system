# ccd-design-system

Workspace doctrine: @/Users/vitit/dev/code/SUPERPOWER.md
Linear: **Design System** project
Facts: `~/Desktop/Superpowers/facts/design.yml` · `~/Desktop/Superpowers/facts/tools.yml#design-system`
Doctrine (flat/quiet/2-ink + anti-references): `v2/PRODUCT.md`

Source of truth for tokens, voice, interaction, React chrome. Tokens ship via CDN or vendored copy; components as a git-URL package (consumers add `transpilePackages` and bump explicitly). Never edit tokens/components from a tool repo.

**Before cutting a tag** run `node v2/build-bundle.mjs` and commit the result. `v2/bundle.css` is the generated single-file build every consumer links instead of one `<link>` per sheet; a stale bundle is invisible — consumers keep rendering the previous release while the source sheets show the new one, and nothing errors. `node v2/build-bundle.mjs --check` exits non-zero when it is out of date.

**A fresh clone has no hook until it is told where they live** — `git config core.hooksPath .githooks`, once per clone. That config is local by nature and cannot be committed, so the hook in `.githooks/pre-commit` sits in the repo doing nothing until someone runs that line, and nothing warns you. It refuses a commit carrying a stale `bundle.css`, a raw colour outside `tokens.css`, or a `var()` naming a property nothing defines — the three failures that render fine and error nowhere. `node v2/check-tokens.mjs --spacing` additionally lists raw lengths in padding/margin/gap; those are reported, never blocked, because each is a deliberate micro-value and a rule would have to invent a reason per site. `git commit --no-verify` is the intended escape hatch for wip/ branches.

**Before cutting a tag** read `~/Desktop/Superpowers/wiki/app-design-method.md` · *Version numbering*. It is NOT plain semver: the major digit is the DS **generation** (`v2.x` = second generation), so breaking changes ride the **minor** slot with `BREAKING:` opening the message, and `v3` is reserved for a real third generation. Always `git tag -a` — the annotated tag message is the changelog, there is no CHANGELOG.md.

**A class name is only free if it is free in EVERY consumer.** Before shipping or renaming any class, grep the candidate across all of `~/Desktop/Superpowers/code`, not just this repo. The DS loads *after* an app's own stylesheet by CDN, so a shared name at equal specificity is decided by link order — which is not a guarantee. Element names are full words (`__num`, `__text`), never initials. The near-miss that produced this rule, and the shipped-element count, live in CCD-174 and workspace memory `feedback_ds_name_free_in_every_consumer` — not here; a law file holds the rule, never the incident.

Graduation = ONE atomic commit: edit v2 source → switch every consumer to `var()`/the class, delete all literals (no alias) → update the catalog. **The catalog is `v2/*-gallery.html`, one gallery per sheet** — a new component gets its own gallery or a tile in the nearest existing one. `v2/showroom.html` is NOT the catalog and must not be treated as one: it links only `tokens.css`, `type.css` and `nav.css`, so a tile added there for any other component renders unstyled (audited 2026-08-08). Undemoed = will be re-invented. (The old fourth step re-pinned mocks under a workspace `plan/` directory; that store no longer exists — plans live in Linear.)
Fork test, TODO-DS second-use rule, full scar: workspace memory `feedback_ds_graduation_discipline`.
