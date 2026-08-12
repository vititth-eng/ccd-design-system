"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import { NAV, OPEN_QUESTIONS } from "../../content/nav";

/**
 * The workbench's own chrome — sidebar, breadcrumb, theme and viewport controls.
 *
 * It lives under app/_workbench and NOT in v3/components, and the distinction is
 * the whole store rule: v3/components holds what ships to consumer apps. A nav
 * for inspecting the design system is not part of the design system. If this
 * chrome ever earns a place in the DS it graduates deliberately, as the "Page
 * shell" pattern, not by being convenient here.
 *
 * The underscore also keeps Next from routing it, and app/ is already inside
 * Tailwind's @source globs, so its classes generate.
 *
 * It renders in --sidebar, which is the only reason those eight tokens have ever
 * been drawn by anything.
 */

const WIDTHS = [
  { id: "375", label: "375", px: 375 },
  { id: "768", label: "768", px: 768 },
  { id: "full", label: "Full", px: 0 },
] as const;

const THEMES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly { id: T; label: string }[];
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-md border border-sidebar-border p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`rounded-sm px-2.5 py-1 text-sm font-medium transition-colors ${
            value === o.id
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function currentName(pathname: string): string {
  for (const group of NAV) {
    for (const item of group.items) {
      if (item.href === pathname) return item.name;
    }
  }
  return pathname;
}

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const framed = searchParams.get("frame") === "1";

  const [theme, setTheme] = React.useState<ThemeId>("system");
  const [width, setWidth] = React.useState<string>("full");

  /* Read once on mount rather than during render: the server has no localStorage,
     so touching it in the render body would make the first client paint disagree
     with the HTML it is hydrating. The inline script in layout.tsx has already
     put the right attribute on <html> before any of this runs — this only syncs
     the control to it. */
  React.useEffect(() => {
    const stored = document.documentElement.dataset.theme as ThemeId | undefined;
    if (stored) setTheme(stored);
  }, []);

  function applyTheme(next: ThemeId) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("ccd-theme", next);
  }

  /* A page rendered inside the width frame drops the chrome and renders bare —
     otherwise every frame would carry its own sidebar. */
  if (framed) return <>{children}</>;

  const frame = WIDTHS.find((w) => w.id === width);
  const isFramed = frame && frame.px > 0;

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Below lg the sidebar is hidden rather than stacked. A 256px rail plus the
          content does not fit — the embedded browser pane is about 750px — and the
          stacked version put a full screen of nav, most of it pages that do not
          exist yet, above every page. The compact row in the header replaces it and
          carries only what is reachable. */}
      <aside className="hidden bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto lg:border-r lg:border-sidebar-border">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="text-base font-semibold tracking-tight">CCD Design</span>
          {/* The badge is the one place --sidebar-primary appears. Nothing else in
              a workbench nav wants a brand fill, and a token nothing draws is a
              token nobody has checked — this is worth knowing about it: the dark
              block redefines every sidebar token EXCEPT primary and its
              foreground, so the same blue carries both modes. Look at it here
              before deciding that is right. */}
          <span className="rounded-sm bg-sidebar-primary px-1.5 py-0.5 text-xs font-medium text-sidebar-primary-foreground">
            v3 pilot
          </span>
        </div>

        <nav className="px-3 pb-6">
          {NAV.map((group) => (
            <div key={group.label} className="mb-5">
              <div className="px-2 pb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {group.label}
              </div>
              {group.items.map((item) =>
                item.href ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className={`block rounded-md px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none ${
                      item.href === pathname
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  /* Not a link and not disabled-looking-clickable: a page that does
                     not exist yet says so, because a dead nav item that highlights
                     on hover is a promise the app cannot keep. */
                  <span
                    key={item.name}
                    className="block px-2 py-1.5 text-sm text-muted-foreground/60"
                  >
                    {item.name}
                  </span>
                )
              )}
            </div>
          ))}

          {OPEN_QUESTIONS.length > 0 && (
            <div className="mb-5">
              <div className="px-2 pb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Open questions
              </div>
              {OPEN_QUESTIONS.map((q) => (
                <div
                  key={q.name}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 text-sm"
                >
                  <span>{q.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{q.issue}</span>
                </div>
              ))}
            </div>
          )}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-sidebar-border bg-background/90 px-6 py-3 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{currentName(pathname)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Segmented
                value={width}
                onChange={setWidth}
                options={WIDTHS}
                label="Viewport width"
              />
              <Segmented value={theme} onChange={applyTheme} options={THEMES} label="Theme" />
            </div>
          </div>

          <nav className="mt-2 flex flex-wrap items-center gap-1 lg:hidden">
            {NAV.flatMap((g) => g.items)
              .filter((i) => i.href)
              .map((i) => (
                <Link
                  key={i.name}
                  href={i.href!}
                  aria-current={i.href === pathname ? "page" : undefined}
                  className={`rounded-md px-2 py-1 text-sm ${
                    i.href === pathname
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {i.name}
                </Link>
              ))}
          </nav>
        </header>

        {isFramed ? (
          /* A real iframe, not a narrowed div. Media queries answer to the
             VIEWPORT, so a 375px-wide div still reports a desktop viewport and
             every responsive rule stays on the desktop branch — a mobile preview
             that silently shows the desktop layout is worse than none. The frame
             loads the same route with the chrome switched off. */
          <div className="flex justify-center px-6 py-6">
            <iframe
              key={`${pathname}-${frame.px}`}
              title={`${currentName(pathname)} at ${frame.px}px`}
              src={`${pathname}?frame=1`}
              style={{ width: frame.px }}
              className="h-[80vh] rounded-lg border border-border bg-background"
            />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
