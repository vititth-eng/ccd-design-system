# ccd-design-system

Workspace doctrine: @/Users/vitit/dev/code/SUPERPOWER.md
Linear: **Design System** project
Facts: `Superpower/facts/design.yml` · `Superpower/facts/tools.yml#design-system`
Doctrine (flat/quiet/2-ink + anti-references): `v2/PRODUCT.md`

Source of truth for tokens, voice, interaction, React chrome. Tokens ship via CDN or vendored copy; components as a git-URL package (semver tags; consumers add `transpilePackages` and bump explicitly). Never edit tokens/components from a tool repo.

Graduation = ONE atomic commit: edit v2 source → switch every consumer to `var()`/the class, delete all literals (no alias) → update the catalog (`v2/*-gallery.html`; new component also gets a `v2/showroom.html` tile) → re-pin `Superpower/plan/**` mocks to the new SHA. Undemoed = will be re-invented.
Fork test, TODO-DS second-use rule, full scar: workspace memory `feedback_ds_graduation_discipline`.
