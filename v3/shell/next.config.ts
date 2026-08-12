import path from "node:path";
import type { NextConfig } from "next";

/**
 * Turbopack refuses to resolve a file above its project root — it does not
 * warn, it panics: `FileSystemPath("").join("../tokens.css") leaves the
 * filesystem root`. By default that root is this folder, which puts
 * v3/tokens.css and v3/colors.css out of reach.
 *
 * Raising the root to v3/ is what lets the shell import the REAL token files
 * instead of a vendored copy. The copy is the tempting fix and it is the wrong
 * one: a duplicated stylesheet goes stale invisibly, which is the failure the
 * repo already guards against for v2/bundle.css and has no guard for here.
 *
 * Cost of raising it: Turbopack now watches all of v3/, so an edit to any
 * sibling file triggers a rebuild. That is the intended behaviour — a token
 * edit SHOULD refresh the workbench.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(import.meta.dirname, ".."),
  },

  /**
   * Next 16 writes an AGENTS.md (and a CLAUDE.md that imports it) into the
   * project directory the first time `next dev` detects a coding agent, and
   * re-adds the block on every run. Declined here.
   *
   * Not because the block is wrong, but because this workspace already routes
   * doctrine through exactly two files — the workspace CLAUDE.md and this
   * repo's own — and a third, self-reinstating one in a subfolder is a store
   * nobody chose. Next's own advice, "read the guides in node_modules/next/
   * dist/docs before writing code", is worth following regardless of whether a
   * generated file says so.
   */
  agentRules: false,
};

export default nextConfig;
