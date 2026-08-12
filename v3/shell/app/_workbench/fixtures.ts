/**
 * The three axes a CCD scene is varied along, and where their state lives.
 *
 * These are OUR axes, not shadcn's. Theirs vary style, colour and font because
 * a registry's product is the look; ours has to vary what actually breaks our
 * screens:
 *
 *   language  — a Thai string runs ~40% longer than its English source, and
 *               tone marks stack above the cap line while vowels hang below
 *               the baseline, so a row height that fits EN can clip ไทย.
 *   density   — a 6-question survey and a 40-question one are different
 *               layouts wearing the same components.
 *   volume    — empty, typical, overflowing. The empty and the overflowing
 *               cases are the ones nobody designs and everybody ships.
 *
 * No i18n library is involved and none is needed: a scene carries fixture
 * data, so switching language is picking a different fixture.
 *
 * State lives in the URL, not in React context, and that is load-bearing. The
 * width preview is a real iframe — it reloads the route with ?frame=1 — and
 * context does not cross an iframe boundary. Under context the framed view
 * would quietly render default fixtures while the controls said otherwise:
 * a wrong preview that looks right, which is the failure class this workbench
 * exists to catch. Query params cross for free.
 *
 * This module has no "use client" of its own so both graphs may import it.
 * The hook that reads it lives in use-fixture.ts, which does.
 */

export const LANGS = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "EN" },
] as const;

export const DENSITIES = [
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
] as const;

export const VOLUMES = [
  { id: "empty", label: "Empty" },
  { id: "typical", label: "Typical" },
  { id: "overflow", label: "Overflowing" },
] as const;

export type Lang = (typeof LANGS)[number]["id"];
export type Density = (typeof DENSITIES)[number]["id"];
export type Volume = (typeof VOLUMES)[number]["id"];

export type Fixture = { lang: Lang; density: Density; volume: Volume };

/**
 * Thai is the default because Thai is the truth — every CCD app ships to Thai
 * readers first, and English is the variant. Defaulting to EN would mean the
 * 40% swing is only ever seen by someone who remembered to go looking for it.
 *
 * Density and volume default to the ordinary case so the shell does not look
 * permanently pathological; the hard cases are one click away.
 */
export const FIXTURE_DEFAULT: Fixture = { lang: "th", density: "short", volume: "typical" };

/** Just enough of URLSearchParams to read, so this file imports no Next types. */
type Readable = { get(key: string): string | null };

function pick<T extends string>(
  raw: string | null,
  options: readonly { id: T }[],
  fallback: T
): T {
  const hit = options.find((o) => o.id === raw);
  return hit ? hit.id : fallback;
}

export function readFixture(params: Readable): Fixture {
  return {
    lang: pick(params.get("lang"), LANGS, FIXTURE_DEFAULT.lang),
    density: pick(params.get("density"), DENSITIES, FIXTURE_DEFAULT.density),
    volume: pick(params.get("volume"), VOLUMES, FIXTURE_DEFAULT.volume),
  };
}

/** Rendered back to the reader so the current fixture is never a guess. */
export function describeFixture(f: Fixture): string {
  const label = <T extends string>(options: readonly { id: T; label: string }[], id: T) =>
    options.find((o) => o.id === id)!.label;
  return [
    label(LANGS, f.lang),
    `${label(DENSITIES, f.density).toLowerCase()} form`,
    label(VOLUMES, f.volume).toLowerCase(),
  ].join(" · ");
}

/** The keys the width iframe has to carry through, or it previews the wrong scene. */
export const FIXTURE_KEYS = ["lang", "density", "volume"] as const;
