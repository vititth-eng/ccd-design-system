# ccd-design-system

Workspace doctrine: @/Users/vitit/Desktop/Superpowers/CLAUDE.md
Linear: **Design System** project
Facts: `~/Desktop/Superpowers/facts/design.yml` · `~/Desktop/Superpowers/facts/tools.yml#design-system`
Doctrine (flat/quiet/2-ink + anti-references): `v2/PRODUCT.md`

Source of truth for tokens, voice, interaction, React chrome. Tokens ship via CDN or vendored copy; components as a git-URL package (consumers add `transpilePackages` and bump explicitly). Never edit tokens/components from a tool repo.

**Before cutting a tag** run `node v2/tools/build-bundle.mjs` and commit the result. `v2/bundle.css` is the generated single-file build every consumer links instead of one `<link>` per sheet; a stale bundle is invisible — consumers keep rendering the previous release while the source sheets show the new one, and nothing errors. `node v2/tools/build-bundle.mjs --check` exits non-zero when it is out of date.

**A fresh clone has no hook until it is told where they live** — `git config core.hooksPath .githooks`, once per clone. That config is local by nature and cannot be committed, so the hook in `.githooks/pre-commit` sits in the repo doing nothing until someone runs that line, and nothing warns you. It refuses a commit carrying a stale `bundle.css`, a raw colour outside `tokens.css`, or a `var()` naming a property nothing defines — the three failures that render fine and error nowhere. `node v2/tools/check-tokens.mjs --spacing` additionally lists raw lengths in padding/margin/gap; those are reported, never blocked, because each is a deliberate micro-value and a rule would have to invent a reason per site. `git commit --no-verify` is the intended escape hatch for wip/ branches.

**Before cutting a tag** read `~/Desktop/Superpowers/wiki/app-design-method.md` · *Version numbering*. It is NOT plain semver: the major digit is the DS **generation** (`v2.x` = second generation), so breaking changes ride the **minor** slot with `BREAKING:` opening the message. **`v3` is not in this repo.** It moved to `ccdportal/packages/ui` on 2026-08-19 — v3 has no CDN and no npm channel, so in separate repos every consumer needed its own copy of the tokens. Its doctrine, its two pre-commit checks and its workbench went with it; read that repo's `CLAUDE.md` and `packages/ui/README.md`. What stays here is v1 and v2, and this repo must stay public at this exact path for as long as anything pins it. v2 is **frozen for new work** as of 2026-08-17 (owner call): a tag is cut only for breakage a live app actually hits, never for new surface, sweep findings, or roadmap items. Always `git tag -a` — the annotated tag message is the changelog, there is no CHANGELOG.md.

**A class name is only free if it is free in EVERY consumer.** Before shipping or renaming any class, grep the candidate across all of `~/Desktop/Superpowers/code`, not just this repo. The DS loads *after* an app's own stylesheet by CDN, so a shared name at equal specificity is decided by link order — which is not a guarantee. Element names are full words (`__num`, `__text`), never initials. The near-miss that produced this rule, and the shipped-element count, live in CCD-174 — not here; a law file holds the rule, never the incident.

Graduation = ONE atomic commit: edit v2 source → switch every consumer to `var()`/the class, delete all literals (no alias) → update the catalog. **The catalog is `v2/gallery/*-gallery.html`, one gallery per sheet** — a new component gets its own gallery or a tile in the nearest existing one. `v2/gallery/showroom.html` is NOT the catalog and must not be treated as one: it embeds the galleries as iframes, but its OWN markup links only `tokens.css`, `type.css` and `nav.css`, so a hand-written tile added there for any other component renders unstyled (audited 2026-08-08). Undemoed = will be re-invented. (The old fourth step re-pinned mocks under a workspace `plan/` directory; that store no longer exists — plans live in Linear.)
**What triggers a graduation, and it differs by generation, because discovery does.** In v2 every consumer links one stylesheet from this repo, so the DS is a place each app already passes through: the second use is a fair trigger there, and it stands. First use — inline it to keep flow, but tag it (`/* TODO-DS: cau-strong? */`). Second surface needing the same thing — graduate.

v3's own trigger differs and lives with v3, in `ccdportal/CLAUDE.md`.

Never let one literal or block live in two files; that is the line where a one-off becomes drift.

A **token always graduates** — a value is always shareable. A **component runs a three-way fork test first**, because a component can legitimately fork where a token cannot: same shape everywhere and only content differs → promote whole to the DS · shared frame with a varying slot → split, frame to the DS and slot to app markup · one consumer only, or a composite of DS primitives → keep it app-local, app-prefixed.

**Iterate in a sandbox, never in `tokens.css`.** Explore a palette or a visual direction in standalone HTML beside the catalog so variants sit side by side. `tokens.css` changes only on an explicit "graduate this" — otherwise a session of exploration pollutes git history, breaks consumers mid-decision, and forces a CDN purge per try.

Tripwire: a DS-namespaced class (`.shell__`, `.st st--`) in a mock's local `<style>` wants to be in the DS. An app-prefixed class does not. Audit by grepping the mock folder for raw hex, DS-namespaced classes in local `<style>`, and duplicated blocks. The worked cases and the amber-in-5-files scar are in CCD-174 and CCD-121.
