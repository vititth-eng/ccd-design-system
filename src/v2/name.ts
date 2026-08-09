/**
 * How a signed-in person is named in the sidebar foot.
 *
 * ENGLISH, and abbreviated: "Vitit T.", not "วิทิต ทวีโภค". Two reasons, both
 * learned in cowork before this moved here:
 *
 *  - .shell__who .nm is `white-space: nowrap` with clip-wipe and NO ellipsis, so
 *    a name too long for the 240px sidebar is cut mid-word with nothing to say it
 *    was cut. A first name plus a surname initial fits every staff member.
 *  - It is the same person in every app. A Thai full name here and an abbreviated
 *    English one there reads as two different accounts.
 *
 * This is the chip only. Rosters, tables and anything addressing a person
 * directly still use their Thai name — that is a different job.
 */
export function formalName(
  first: string | null | undefined,
  surname: string | null | undefined,
  fallback: string,
): string {
  const f = first?.trim();
  const s = surname?.trim();
  if (!f) return fallback;
  return s ? `${f} ${s[0].toUpperCase()}.` : f;
}

/**
 * Avatar fallback when there is no photo. Two letters, from the same English
 * source as formalName, so the initials and the name never disagree.
 */
export function initialsFrom(
  first: string | null | undefined,
  surname: string | null | undefined,
  fallback: string,
): string {
  const f = first?.trim();
  const s = surname?.trim();
  if (!f) return fallback.slice(0, 2).toUpperCase();
  return (f[0] + (s?.[0] ?? '')).toUpperCase();
}
