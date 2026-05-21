'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import s from './chrome.module.css';

// Use `||` not `??` so an empty-string env var also falls through to the
// canonical production origin. Empty NEXT_PUBLIC_BASE_URL on Vercel produced
// bare-path tool links that resolved against whatever origin the page loaded
// from (e.g. localhost during preview).
const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://ccd-brb.vercel.app';

const TOOLS = [
  { href: `${BASE}/onboarding/`, label: 'Newcomer Motivation Check-Up', status: 'Live', cls: 'live' },
  { href: `${BASE}/sounding-board/`, label: 'Sounding Board', status: 'Beta', cls: 'beta' },
  { href: `${BASE}/multi-rater/`, label: '360 Multi-Rater', status: 'Coming Soon', cls: '' },
];

// Countdown to Boon Rawd 100th anniversary: Aug 4, 2033
const TARGET = new Date(2033, 7, 4).getTime();

function useTicker() {
  const [tick, setTick] = useState({ m: '00', h: '00', d: '0' });

  useEffect(() => {
    function render() {
      const diff = TARGET - Date.now();
      if (diff <= 0) return;
      setTick({
        m: String(Math.floor(diff / 60000) % 60).padStart(2, '0'),
        h: String(Math.floor(diff / 3600000) % 24).padStart(2, '0'),
        d: Math.floor(diff / 86400000).toLocaleString(),
      });
    }
    render();
    const id = setInterval(render, 60000);
    return () => clearInterval(id);
  }, []);

  return tick;
}

export interface ChromeUser {
  email?: string;
}

export interface ChromeHeaderProps {
  user: ChromeUser | null;
  onSignOut: () => void | Promise<void>;
}

export function ChromeHeader({ user, onSignOut }: ChromeHeaderProps) {
  const pathname = usePathname();
  const tick = useTicker();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
      if (authRef.current && !authRef.current.contains(e.target as Node)) setAuthOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setToolsOpen(false); setAuthOpen(false); }
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const isHome = pathname === '/';
  const isAbout = pathname === '/about';
  const isLogin = pathname === '/login';

  return (
    <header className={s.topbar}>
      <Link href="/" className={s.brand} aria-label="CCD home" />

      <nav className={s.nav} aria-label="Site navigation">
        <Link
          href="/"
          className={s.navLink}
          aria-current={isHome ? 'page' : undefined}
        >
          Home
        </Link>

        <div className={s.navItem} ref={toolsRef}>
          <button
            type="button"
            className={`${s.navBtn} ${toolsOpen ? s.navBtnActive : ''}`}
            aria-expanded={toolsOpen}
            aria-haspopup="menu"
            onClick={() => setToolsOpen(o => !o)}
          >
            Tools
            <span className={`${s.caret} ${toolsOpen ? s.caretOpen : ''}`} aria-hidden="true">
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 4 L5 6.5 L7.5 4" />
              </svg>
            </span>
          </button>
          {toolsOpen && (
            <div className={s.dropdown} role="menu">
              {TOOLS.map(t => (
                <a key={t.href} href={t.href} className={s.dropdownLink} role="menuitem">
                  {t.label}
                  <span className={`${s.status} ${t.cls === 'live' ? s.statusLive : t.cls === 'beta' ? s.statusBeta : ''}`}>
                    {t.status}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/about"
          className={s.navLink}
          aria-current={isAbout ? 'page' : undefined}
        >
          About Us
        </Link>

        {user ? (
          <div className={s.navItem} ref={authRef}>
            <button
              type="button"
              className={s.avatar}
              aria-label={`Account menu for ${user.email}`}
              aria-expanded={authOpen}
              aria-haspopup="menu"
              title={user.email}
              onClick={e => { e.stopPropagation(); setAuthOpen(o => !o); }}
            >
              {user.email?.[0]?.toUpperCase() ?? '?'}
            </button>
            {authOpen && (
              <div className={`${s.dropdown} ${s.dropdownRight}`} role="menu">
                <div className={s.authEmail}>{user.email}</div>
                <button
                  type="button"
                  className={s.authSignout}
                  role="menuitem"
                  onClick={() => { void onSignOut(); }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className={s.navLink} aria-current={isLogin ? 'page' : undefined}>
            Sign in
          </Link>
        )}
      </nav>

      <span className={s.meta} aria-live="polite">
        <span className={s.metaNum}>{tick.m}</span> m{' '}
        <span className={s.metaNum}>{tick.h}</span> h{' '}
        <span className={s.metaNum}>{tick.d}</span> d till 100 years
      </span>
    </header>
  );
}

export function ChromeFooter() {
  return (
    <footer className={s.footer}>
      © 2026
      <span className={s.footerSep}>·</span>
      Corporate Capability Development Group
      <span className={s.footerSep}>·</span>
      Boon Rawd Brewery
    </footer>
  );
}
