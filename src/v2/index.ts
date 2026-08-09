/* v2 React surface.
 *
 * v2 is CSS-first and stays that way: this entry point holds only the behaviour
 * that cannot live in a stylesheet, for components whose CSS the DS already
 * ships. Anything addable as a class belongs in v2/*.css, not here.
 */
export { UserMenu } from './UserMenu';
export type { UserMenuProps, MenuUser, ThemeCookie, Theme } from './UserMenu';
export { avatarUrl, AVATAR_BASE } from './avatar';
export { formalName, initialsFrom } from './name';
