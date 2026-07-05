# ccd-design-system

Workspace router: `Superpower/CLAUDE.md`
Linear: **Design System** project
Facts: `Superpower/facts/design.yml` · `Superpower/facts/tools.yml#design-system`

This repo IS the source of truth for tokens, voice, interaction, AND React chrome (`ChromeHeader`/`ChromeFooter`).
Tokens ship via CDN or vendored copy. Components ship as an npm-style package over git URL (`@ccd/design-system@github:vititth-eng/ccd-design-system#vX.Y.Z`) — Next.js consumers add `transpilePackages: ['@ccd/design-system']`. Tag releases with semver; bump consumers explicitly.
Never edit tokens or components from a tool repo.

## Authoring — adding/changing a token or component

A change is a **graduation**, done atomically in ONE commit:
1. Edit `v2/tokens.css` or the component `.css`.
2. Switch every consumer to `var()`/the class; delete all hardcoded literals / local copies. No alias.
3. **Update the catalog** (graduation isn't done until it's discoverable): the matching `v2/*-gallery.html` — backfill a section if the tier was undemoed (e.g. `--cau-strong` → status-gallery strong-text section). For a NEW component, add its own `*-gallery.html` **and** a tile in `v2/showroom.html`. Existing component → showroom already iframes its gallery, no showroom edit.
4. Re-pin any `Superpower/plan/**` mocks to the new commit SHA.

Components can legitimately fork — before promoting, pick one: same-shape-reused → promote whole to DS · shared-frame+varying-slot → split (frame→DS, slot→app markup) · one consumer/composite → keep app-local. A raw hex or DS-namespaced class sitting in a mock's local `<style>` = a `TODO-DS` that graduates on its **second** use.

Why: a token/component nobody can see in the showroom gets re-invented — `#8a6100` drifted into 5 files, `.meter` into 4, before this rule. Full scar + worked cases: workspace memory `feedback_ds_graduation_discipline`.
