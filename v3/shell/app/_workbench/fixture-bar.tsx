"use client";

import { DENSITIES, LANGS, VOLUMES } from "./fixtures";
import { Segmented } from "./segmented";
import { useFixture } from "./use-fixture";

/**
 * A strip of its own rather than three more pills in the header, because these
 * are a different kind of control from theme and width. Theme and width change
 * how you are LOOKING at a scene; these change WHAT SCENE it is. Mixing the two
 * into one row of identical pills makes the distinction invisible, and the
 * distinction is the point.
 */
export function FixtureBar() {
  const [fixture, set] = useFixture();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border bg-muted/30 px-4 py-2">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Fixtures
      </span>
      <Segmented
        value={fixture.lang}
        onChange={(lang) => set({ lang })}
        options={LANGS}
        label="Language"
      />
      <Segmented
        value={fixture.density}
        onChange={(density) => set({ density })}
        options={DENSITIES}
        label="Form length"
      />
      <Segmented
        value={fixture.volume}
        onChange={(volume) => set({ volume })}
        options={VOLUMES}
        label="Data volume"
      />
    </div>
  );
}
