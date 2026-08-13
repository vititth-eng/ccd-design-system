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

  /* The frame's own padding drops away below 560px, and that is not cosmetic.
     At 375 the workbench was spending 80px of the phone's width on chrome — the
     page's px-4 plus this p-6, both sides — so the scene rendered 82px narrower
     than it ever will in the real app. A preview that reports the wrong width at
     the one width the pattern is hardest at is worse than no preview. */
  return (
    <div
      lang={fixture.lang}
      className="rounded-lg border border-border py-4 min-[560px]:p-6"
    >
      {children}
    </div>
  );
}
