# ccd-design-system

Workspace router: `Superpower/CLAUDE.md`
Linear: **Design System** project
Facts: `Superpower/facts/design.yml` · `Superpower/facts/tools.yml#design-system`

This repo IS the source of truth for tokens, voice, interaction, AND React chrome (`ChromeHeader`/`ChromeFooter`).
Tokens ship via CDN or vendored copy. Components ship as an npm-style package over git URL (`@ccd/design-system@github:vititth-eng/ccd-design-system#vX.Y.Z`) — Next.js consumers add `transpilePackages: ['@ccd/design-system']`. Tag releases with semver; bump consumers explicitly.
Never edit tokens or components from a tool repo.
