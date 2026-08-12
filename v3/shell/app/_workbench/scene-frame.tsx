"use client";

import type { ReactNode } from "react";
import { describeFixture } from "./fixtures";
import { useFixture } from "./use-fixture";

/**
 * Wraps a pattern's live scene, and does exactly two things.
 *
 * It puts `lang` on the container. The font stack is one list — Inter first,
 * Noto Sans Thai behind it, resolved per glyph — so `lang` changes no typeface.
 * What it does change is line breaking, which for Thai is the whole problem:
 * Thai has no inter-word spaces, so a browser told the text is English breaks
 * it at the wrong places or refuses to break it at all.
 *
 * And when a pattern has no scene yet, it says so and names the fixture the
 * scene WOULD render at. An empty slot that renders nothing is indistinguishable
 * from a broken one; this way the fixture controls are visibly live from the
 * first day, including inside the width iframe, where a context-based
 * implementation would have silently shown defaults.
 */
export function SceneFrame({ children }: { children?: ReactNode }) {
  const [fixture] = useFixture();

  if (!children) {
    return (
      <div
        lang={fixture.lang}
        className="rounded-lg border border-dashed border-border px-6 py-10 text-center"
      >
        <p className="text-sm text-muted-foreground">No scene built yet.</p>
        <p className="mt-2 text-sm">
          It would render at <span className="font-medium">{describeFixture(fixture)}</span>.
        </p>
      </div>
    );
  }

  return (
    <div lang={fixture.lang} className="rounded-lg border border-border p-6">
      {children}
    </div>
  );
}
