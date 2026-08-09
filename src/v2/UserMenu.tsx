'use client';

import React, { useEffect, useRef, useState } from 'react';

/* The sidebar-foot user control: avatar + name, opening the DS menu pane with a
   theme segment and sign out.
 *
 * It ships NO CSS. Every class here — .shell__user, .shell__avatar, .shell__who,
 * .menu, .seg — already lives in shell.css and menu.css and reaches every app
 * inside bundle.css. This package exists because the BEHAVIOUR was hand-copied
 * per repo and drifted: onboarding's copy was a dead <div> with no menu, no sign
 * out, and `email.charAt(0)` where the avatar should be.
 *
 * Consumers install by git tag and add `transpilePackages: ['@ccd/design-system']`
 * — no build step here, the .tsx ships as source.
 */

const SUN = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="3.2" />
    <path d="M10 2.6v1.8M10 15.6v1.8M2.6 10h1.8M15.6 10h1.8M4.75 4.75l1.27 1.27M13.98 13.98l1.27 1.27M15.25 4.75l-1.27 1.27M6.02 13.98l-1.27 1.27" />
  </svg>
);
const MOON = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 11.9A6.4 6.4 0 0 1 8.1 4a6.9 6.9 0 1 0 7.9 7.9z" />
  </svg>
);
const MONITOR = (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.8" y="4.2" width="14.4" height="9.4" rx="1.6" /><path d="M7.6 17h4.8M10 13.6V17" />
  </svg>
);
const SIGN_OUT = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2.5H3.5v11H6M10.5 5l3 3-3 3M13.5 8H6.5" />
  </svg>
);

export type Theme = 'light' | 'dark' | 'system';

const THEMES: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: SUN },
  { id: 'dark', label: 'Dark', icon: MOON },
  { id: 'system', label: 'Follow system', icon: MONITOR },
];

export type MenuUser = {
  /** Display name. NOT the email: an address in .nm is both a truncated string
   *  and the wrong fact — you already know your own address. */
  name: string;
  /** Second line: department, role, whatever identifies them in THIS app. */
  dept?: string | null;
  /** Fallback when there is no photo. Prefer real initials over an email slice. */
  initials: string;
  /** Full URL — build it with avatarUrl(photo_key) from this package. */
  photo?: string | null;
};

/** Cookie identifying where a theme choice is remembered.
 *
 *  DELIBERATELY PER-APP, never one portal-wide cookie at path=/. Multi-rater
 *  writes its theme cookie at path=/admin precisely so respondent pages never
 *  receive it — that is what makes their light-only rule enforce itself
 *  structurally instead of relying on a check somebody remembers to add.
 *  Unifying the path would silently hand dark mode to outward-facing survey
 *  pages. The photo and the identity are universal; the preference is not. */
export type ThemeCookie = { name: string; path: string };

export type UserMenuProps = {
  me: MenuUser;
  /** Omit BOTH to render no theme control — correct for an app that is
   *  light-only. Passing one without the other is a mistake, not a half-config. */
  theme?: Theme;
  themeCookie?: ThemeCookie;
  /** The app owns its Supabase client and its post-sign-out destination, so the
   *  package never imports either. */
  onSignOut: () => void;
};

export function UserMenu({ me, theme, themeCookie, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Theme | undefined>(theme);
  const root = useRef<HTMLDivElement>(null);

  const showTheme = current !== undefined && themeCookie !== undefined;

  /* Close on outside click and on Escape. This lives in the component rather
     than in each app's Shell because every hand-copied version had to
     re-implement it, and a menu that only closes by re-clicking its own trigger
     is the kind of thing that ships unnoticed. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* The whole client-side theme contract, per the DS: set one attribute, remember
     the choice. "system" is resolved by a CSS media query, NOT here — which is
     why an already-open page repaints when the laptop flips at dusk, something no
     script-based version does without a listener. */
  function pickTheme(mode: Theme) {
    if (!themeCookie) return;
    document.documentElement.dataset.theme = mode;
    document.cookie =
      `${themeCookie.name}=${mode}; path=${themeCookie.path}; max-age=31536000; samesite=lax`;
    setCurrent(mode);
  }

  return (
    <div className="shell__foot" ref={root}>
      <button
        className="shell__user"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
      >
        <span className="shell__avatar">
          {me.photo ? <img src={me.photo} alt="" /> : me.initials}
        </span>
        {/* .nm + .rl are the DS's own two slots (shell.css). */}
        <div className="shell__who">
          <div className="nm">{me.name}</div>
          {me.dept && <div className="rl">{me.dept}</div>}
        </div>
      </button>

      <div className={`menu${open ? ' is-open' : ''}`} role="menu">
        {showTheme && (
          <>
            {/* Dark is an account preference, so a page with no signed-in user has
                no way to turn it on — which is what makes the light-only rule for
                outward-facing pages enforce itself. No caption above the seg
                (caption-zero); the three glyphs say it. */}
            <div className="menu__theme">
              <div className="seg seg--fill seg--icon" role="group" aria-label="Theme">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`seg__opt${current === t.id ? ' seg__opt--active' : ''}`}
                    onClick={() => pickTheme(t.id)}
                    title={t.label} aria-label={t.label} aria-pressed={current === t.id}
                  >{t.icon}</button>
                ))}
              </div>
            </div>
            <div className="menu__sep" />
          </>
        )}
        <button className="menu__item" role="menuitem" onClick={onSignOut}>
          {SIGN_OUT}Sign out
        </button>
      </div>
    </div>
  );
}
