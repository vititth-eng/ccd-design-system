# ccd-design-system

Workspace doctrine: @/Users/vitit/dev/code/SUPERPOWER.md
Linear: **Design System** project
Facts: `Superpower/facts/design.yml` · `Superpower/facts/tools.yml#design-system`
Doctrine (flat/quiet/2-ink + anti-references): `v2/PRODUCT.md`

Source of truth for tokens, voice, interaction, React chrome. Tokens ship via CDN or vendored copy; components as a git-URL package (consumers add `transpilePackages` and bump explicitly). Never edit tokens/components from a tool repo.

**Before cutting a tag** read `Superpower/wiki/app-design-method.md` · *Version numbering*. It is NOT plain semver: the major digit is the DS **generation** (`v2.x` = second generation), so breaking changes ride the **minor** slot with `BREAKING:` opening the message, and `v3` is reserved for a real third generation. Always `git tag -a` — the annotated tag message is the changelog, there is no CHANGELOG.md.

**A class name is only free if it is free in EVERY consumer.** Before shipping or renaming any class, grep the candidate across all of `~/dev/code`, not just this repo. The DS loads *after* an app's own stylesheet by CDN, so a shared name at equal specificity is decided by link order — which is not a guarantee. Near-miss 2026-07-30: `.li` was about to be renamed to `.qrow`, which `ccd-brb-onboarding` already owned for a different component; caught by the consumer session, not here. Element names are full words (`__num`, `__text`), never initials — 22 of the 23 shipped BEM elements already are. Full story: CCD-174.

Graduation = ONE atomic commit: edit v2 source → switch every consumer to `var()`/the class, delete all literals (no alias) → update the catalog (`v2/*-gallery.html`; new component also gets a `v2/showroom.html` tile) → re-pin `Superpower/plan/**` mocks to the new SHA. Undemoed = will be re-invented.
Fork test, TODO-DS second-use rule, full scar: workspace memory `feedback_ds_graduation_discipline`.
