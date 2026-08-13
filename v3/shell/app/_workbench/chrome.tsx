"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NAV, OPEN_QUESTIONS, OPEN_QUESTIONS_ISSUE, isPatternRoute } from "../../content/nav";
import { FixtureBar } from "./fixture-bar";
import { FIXTURE_KEYS } from "./fixtures";
import { Segmented } from "./segmented";

/**
 * The workbench's chrome, built ON shadcn's sidebar rather than beside it.
 *
 * The first version of this file hand-rolled the whole rail — and duplicating a
 * shipped primitive is a bug, not a shortcut. What the real component brings
 * that the hand-rolled one never would have: collapse to an icon rail, a mobile
 * drawer, ⌘B, state persisted in a cookie so a reload does not reset it, and a
 * draggable rail. It also renders all eight --sidebar tokens, which is the only
 * reason any of them have ever been drawn.
 *
 * It stays in app/_workbench and not in v3/components: what ships to consumer
 * apps is the sidebar primitive, not a nav for inspecting the design system.
 *
 * ONE deliberate departure from shadcn, below on SidebarMenuButton.
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

/**
 * The one departure from shadcn, and the reason is a rule we already proved.
 *
 * shadcn's own sidebar paints hover and current-page with the SAME fill —
 * hover:bg-sidebar-accent and data-active:bg-sidebar-accent — separated only by
 * font-medium. So two rows look identical while meaning different things, and
 * hovering the row you are already on changes nothing at all.
 *
 * The dropdown menu taught the fix on 2026-08-12: a fill marks the ONE row the
 * pointer or keyboard is on, and state that persists gets a second channel. A
 * menu uses a check mark in a reserved gutter; a nav has no gutter, so this uses
 * a rail — a 2px bar of --sidebar-primary down the leading edge. Current page
 * keeps its rail whether hovered or not, and hover still reads as hover.
 *
 * Material calls the general form a state layer: the container colour says what
 * something IS, a translucent overlay says what is happening to it, and the two
 * stack instead of competing for the same property.
 */
function NavLink({ href, name, current }: { href: string; name: string; current: boolean }) {
  return (
    <SidebarMenuItem>
      {/* `render`, not `asChild` — Base UI's composition prop takes the element to
          render as, where Radix took a child. Everything copied from shadcn's
          Base UI styles uses this, and the wrong one is a type error rather than
          a silent miss. */}
      <SidebarMenuButton
        isActive={current}
        className="relative data-active:bg-transparent data-active:hover:bg-sidebar-accent data-active:before:absolute data-active:before:inset-y-1 data-active:before:left-0 data-active:before:w-0.5 data-active:before:rounded-full data-active:before:bg-sidebar-primary"
        render={<Link href={href} aria-current={current ? "page" : undefined} />}
      >
        {/* A span, not bare text. The component truncates `span:last-child`, and
            bare text gives it nothing to match — so a long label wraps instead
            of ellipsing whenever the rail is narrower than the words. */}
        <span>{name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
     with the HTML it is hydrating. The beforeInteractive script in layout.tsx has
     already put the right attribute on <html>; this only syncs the control to it. */
  React.useEffect(() => {
    const stored = document.documentElement.dataset.theme as ThemeId | undefined;
    if (stored) setTheme(stored);
  }, []);

  function applyTheme(next: ThemeId) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("ccd-theme", next);
  }

  /* A page rendered inside the width frame drops the chrome entirely — otherwise
     every frame would carry its own sidebar inside it. */
  if (framed) return <>{children}</>;

  const frame = WIDTHS.find((w) => w.id === width);
  const isFramed = frame && frame.px > 0;

  /* The frame must carry the fixture across with it. Miss this and the preview
     renders the DEFAULT fixture while the controls above it read otherwise —
     a wrong answer wearing a correct label, which is worse than no preview. */
  const frameParams = new URLSearchParams({ frame: "1" });
  for (const key of FIXTURE_KEYS) {
    const value = searchParams.get(key);
    if (value) frameParams.set(key, value);
  }
  const frameSrc = `${pathname}?${frameParams}`;

  return (
    <SidebarProvider>
      {/* offcanvas, which is also the component's own default. It was set to
          "icon" and that was wrong twice over.

          Icon mode squeezes every row to 32px and relies on an ICON filling the
          rail while `[&>span:last-child]:truncate` hides the label. This nav has
          no icons, so collapsing left fifteen labels wrapping one or two
          characters per line down a 30px column. Adding icons would not fix it
          either: "Admin table" against "Create form" against "Empty & error
          states" as glyphs is a guessing game, and shadcn's icon rail is built
          for five or six top-level destinations, not a reference index.

          And the rows that are NOT SidebarMenuButtons — the unbuilt pattern
          entries, the open questions list — carry none of icon mode's handling
          at all, so they kept full-height text in a rail that had no room.

          offcanvas is what a workbench wants regardless: you collapse the nav
          to give the thing you are inspecting the full width. */}
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:hidden">
            <span className="text-base font-semibold tracking-tight">CCD Design</span>
            {/* The only place --sidebar-primary appears, and worth a look: the dark
                block redefines every sidebar token EXCEPT primary and its
                foreground, so one blue carries both modes. */}
            <span className="rounded-sm bg-sidebar-primary px-1.5 py-0.5 text-xs font-medium text-sidebar-primary-foreground">
              v3 pilot
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {NAV.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) =>
                  item.href ? (
                    <NavLink
                      key={item.name}
                      href={item.href}
                      name={item.name}
                      current={item.href === pathname}
                    />
                  ) : (
                    /* Not a link, and not a disabled button either: a page that does
                       not exist says so plainly. A dead nav row that lights up on
                       hover is a promise the app cannot keep. */
                    <SidebarMenuItem key={item.name}>
                      <div className="px-2 py-1.5 text-sm text-muted-foreground/60">
                        {item.name}
                      </div>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroup>
          ))}

          {OPEN_QUESTIONS.length > 0 && (
            <SidebarGroup>
              {/* The id sits on the group, once. Every open question is on the
                  same issue, so a per-row badge repeated it down a column and
                  told the reader nothing. */}
              <SidebarGroupLabel>
                Open questions
                <span className="ml-2 font-mono text-xs opacity-70">{OPEN_QUESTIONS_ISSUE}</span>
              </SidebarGroupLabel>
              {/* Plain list, not SidebarMenu. SidebarMenuBadge positions itself
                  absolutely against a SidebarMenuButton — `peer/menu-button` —
                  and these rows have no button because a question is not a
                  link. With no peer to anchor to, both badges floated a row
                  low, which is what made the group look broken. */}
              <ul className="space-y-1 px-2 py-1">
                {OPEN_QUESTIONS.map((q) => (
                  <li
                    key={q.name}
                    className="border-l-2 border-sidebar-border py-0.5 pl-2 text-sm text-sidebar-foreground/70"
                  >
                    {q.name}
                  </li>
                ))}
              </ul>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* The drag handle on the rail's edge, and the reason the sidebar is worth
            pulling rather than writing: none of this is CSS. */}
        <SidebarRail />
      </Sidebar>

      {/* min-w-0, and it is load-bearing rather than defensive.

          SidebarInset is a flex item beside a 256px sidebar, and it ships with
          `w-full flex-1`. A flex item's automatic minimum size is its CONTENT's
          minimum, not zero, so the inset refuses to shrink below whatever its
          widest child demands — it stayed at the full 768 while sitting at
          left: 256, and the page scrolled sideways by exactly one sidebar
          width. Measured at 768: scrollWidth 1024, and min-width: 0 takes it
          back to 768 with the inset at 512.

          It goes here and not in components/ui/sidebar.tsx on purpose. That
          file is byte-identical to the registry and `shadcn add --diff` is what
          keeps it honest; a fix that belongs to how WE compose the shell should
          not turn into a diff we have to re-explain on every re-copy. */}
      <SidebarInset className="min-w-0">
        {/* Two strips, not one row. The header's controls change how you are
            LOOKING at a scene; the fixture bar's change WHAT SCENE it is. Five
            identical pill groups in a single row would hide that split, and the
            split is the whole reason the fixture axes exist. */}
        <div className="sticky top-0 z-40 bg-background/90 backdrop-blur">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium">{currentName(pathname)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Segmented value={width} onChange={setWidth} options={WIDTHS} label="Viewport width" />
              <Segmented value={theme} onChange={applyTheme} options={THEMES} label="Theme" />
            </div>
          </header>
          {isPatternRoute(pathname) && <FixtureBar />}
        </div>

        {isFramed ? (
          /* A real iframe, not a narrowed div. Media queries answer to the
             VIEWPORT, so a 375px-wide div still reports a desktop viewport and
             every responsive rule stays on the desktop branch — a mobile preview
             that silently shows the desktop layout is worse than none. The frame
             loads the same route with the chrome switched off. */
          <div className="flex justify-center px-4 py-6">
            <iframe
              key={`${pathname}-${frame.px}`}
              title={`${currentName(pathname)} at ${frame.px}px`}
              src={frameSrc}
              style={{ width: frame.px }}
              className="h-[80vh] rounded-lg border border-border bg-background"
            />
          </div>
        ) : (
          children
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
