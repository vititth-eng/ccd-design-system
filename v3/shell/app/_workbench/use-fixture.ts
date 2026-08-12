"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Fixture, readFixture } from "./fixtures";

/**
 * Read the current fixture, and change one axis of it.
 *
 * `replace` rather than `push`: flipping a fixture is adjusting an instrument,
 * not navigating, and a back button that walks you through every toggle you
 * tried is a back button nobody trusts. `scroll: false` for the same reason —
 * changing language should not jump a long scene back to the top, since the
 * whole point is watching one place in it change.
 */
export function useFixture(): [Fixture, (patch: Partial<Fixture>) => void] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function set(patch: Partial<Fixture>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(patch)) next.set(key, value);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }

  return [readFixture(params), set];
}
