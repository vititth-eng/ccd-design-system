/**
 * Staff avatars live in the ccd-identity R2 bucket — one job, nothing else in it.
 * Public-read over r2.dev and embedded straight into <img src>, so keys MUST stay
 * opaque: company emails are guessable, and an email-derived key on a public
 * bucket would let anyone enumerate staff photos.
 *
 * The base URL lives HERE rather than in each app's env because it is the same
 * fact for every consumer, and pinning it to a DS tag means one bump moves them
 * all together instead of five env vars drifting apart. The human-readable
 * record is facts/infra.yml#r2.buckets.ccd-identity.
 */
export const AVATAR_BASE = 'https://pub-2c10352ecb7f4d81a6e143f3ecc6378a.r2.dev';

/**
 * photo_key -> URL. The key already carries its "avatars/" prefix, exactly as
 * stored in hris.person_photo, so this is a join and nothing more.
 *
 * Returns null for a missing key so the caller falls through to initials. Do not
 * substitute a placeholder image: a generic silhouette reads as "this person has
 * no photo" when the truth is usually "nobody has uploaded one yet".
 */
export const avatarUrl = (key: string | null | undefined): string | null =>
  key ? `${AVATAR_BASE}/${key}` : null;
