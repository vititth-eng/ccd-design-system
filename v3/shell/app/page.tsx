import { version as reactRuntime } from "react";
import nextPkg from "next/package.json";
import twPkg from "tailwindcss/package.json";
import shellPkg from "../package.json";
import { LeadingRow } from "./_workbench/leading-row";

/**
 * Step 2: Tailwind compiles, and the v3 token files compile with it.
 *
 * Every colour and size here comes from v3/theme.css or v3/type.css,
 * imported by relative path — no copy, no strip. Nothing on this page mints a
 * value. A swatch that renders transparent or a size that collapses means the
 * token did not survive the build, which is the point of rendering it rather
 * than asserting it.
 */

const VERSIONS = [
  { name: "Next", asked: shellPkg.dependencies.next, running: nextPkg.version },
  { name: "React", asked: shellPkg.dependencies.react, running: reactRuntime },
  { name: "Tailwind", asked: shellPkg.devDependencies.tailwindcss, running: twPkg.version },
  { name: "Node", asked: "—", running: process.versions.node },
];

const SURFACES = [
  { token: "--background", cls: "bg-background" },
  { token: "--card", cls: "bg-card" },
  { token: "--muted", cls: "bg-muted" },
  { token: "--secondary", cls: "bg-secondary" },
  { token: "--primary", cls: "bg-primary" },
  { token: "--destructive", cls: "bg-destructive" },
];

/* The real ladder from type.css. Six sizes on Tailwind's own names — 2xl is
   deliberately absent, and inventing a name here would render nothing at all,
   because type.css clears --text-* before minting these. */
const TYPE = [
  { cls: "text-xs", note: "caption, timestamp, table meta" },
  { cls: "text-sm", note: "secondary line, dense table cell" },
  { cls: "text-base", note: "body, the workhorse" },
  { cls: "text-lg", note: "section header" },
  { cls: "text-xl", note: "page title" },
  { cls: "text-3xl", note: "display number" },
];

/* The derived ladder from theme.css: one --radius base, shadcn's calc() steps
   off it. rounded-full is Tailwind's own and derives from nothing, which is why
   it is labelled differently below. */
const RADIUS = [
  { cls: "rounded-sm", note: "0.6 × base" },
  { cls: "rounded-md", note: "0.8 × base — what most components ask for" },
  { cls: "rounded-lg", note: "the base itself" },
  { cls: "rounded-xl", note: "1.4 × base — dialog, sheet" },
  { cls: "rounded-full", note: "Tailwind's, not derived — pills and avatars" },
];

/* Tailwind's shadow scale exactly as shipped. shadcn tokenises no shadow at
   all, so nothing in theme.css touches these — what renders here is the
   upstream default, which is the point of showing it. */
const ELEVATION = [
  { cls: "shadow-xs", note: "card, button, input — resting surfaces" },
  { cls: "shadow-sm", note: "sidebar" },
  { cls: "shadow-md", note: "dropdown menu" },
  { cls: "shadow-lg", note: "dialog, sheet, submenu" },
];

const SPACING = ["size-1", "size-2", "size-3", "size-4", "size-6", "size-8", "size-12"];

/* The nine CCD-only status tokens. shadcn has no slot for any of them, which
   also means no upstream component will ever render one — so this section is
   the only place they get drawn at all. Three tiers per hue, and they do
   different jobs: the bright one is a DOT, too light to carry text or a fill;
   -strong is the readable version for glyphs and small coloured text; -tint is
   its pill background.

   Every class is written out in full and never assembled from a variable.
   Tailwind generates only what it can SEE as literal text, so `bg-${hue}`
   compiles to nothing at all — a dot with no colour, erroring nowhere. That is
   the same failure that left this repo's animation utilities dead for a day. */
const STATUS = [
  {
    token: "--positive",
    dot: "bg-positive",
    text: "text-positive-strong",
    tint: "bg-positive-tint",
    job: "done, passing, on track",
  },
  {
    token: "--caution",
    dot: "bg-caution",
    text: "text-caution-strong",
    tint: "bg-caution-tint",
    job: "due soon, needs attention",
  },
  {
    token: "--negative",
    dot: "bg-negative",
    text: "text-negative-strong",
    tint: "bg-negative-tint",
    job: "overdue, failed, blocking",
  },
];

/* Every chart slot theme.css mints. Untouched by any component so far — a
   chart block from the registry colours itself from --primary, so these are
   ours to wire whenever the first chart lands. */
const CHART_CATEGORICAL = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-6",
  "bg-chart-7",
];
const CHART_BLUE = [
  "bg-chart-blue-1",
  "bg-chart-blue-2",
  "bg-chart-blue-3",
  "bg-chart-blue-4",
  "bg-chart-blue-5",
];
const CHART_ROSE = [
  "bg-chart-rose-1",
  "bg-chart-rose-2",
  "bg-chart-rose-3",
  "bg-chart-rose-4",
  "bg-chart-rose-5",
];

const MOTION = [
  { cls: "duration-100", note: "menu open/close" },
  { cls: "duration-150", note: "sidebar rail" },
  { cls: "duration-200", note: "dialog, sheet" },
];

/* Who decides each material. Ownership, never values — a value belongs in the
   file that mints it, and a second copy here would keep looking right after
   that file moved on. This table exists because an unlisted material reads as
   a material nobody thought about, when in fact four of these are deliberately
   left to Tailwind. */
const OWNERSHIP = [
  { material: "Colour", owner: "CCD, on shadcn's neutral base", file: "theme.css" },
  { material: "Curve", owner: "one CCD base, shadcn's derived ladder", file: "theme.css" },
  { material: "Type", owner: "CCD — shadcn ships no type token", file: "type.css" },
  { material: "Elevation", owner: "Tailwind, untouched", file: "—" },
  { material: "Spacing", owner: "Tailwind, untouched", file: "—" },
  { material: "Motion", owner: "Tailwind, untouched", file: "—" },
  { material: "Layering", owner: "Tailwind, picked per component", file: "—" },
  { material: "Breakpoints", owner: "Tailwind, untouched", file: "—" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-xl font-semibold tracking-tight">CCD Design — v3 workbench</h1>
        <p className="text-base text-muted-foreground mt-2">
          Step 2: Tailwind compiles the real token files. Everything below is a token, not a
          literal.
        </p>

        <Section title="Stack">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left font-medium py-2 pr-6" />
                <th className="text-left font-medium py-2 pr-6">package.json</th>
                <th className="text-left font-medium py-2">running</th>
              </tr>
            </thead>
            <tbody>
              {VERSIONS.map((v) => (
                <tr key={v.name} className="border-t border-border">
                  <th scope="row" className="text-left font-medium py-2 pr-6 whitespace-nowrap">
                    {v.name}
                  </th>
                  <td className="font-mono py-2 pr-6">{v.asked}</td>
                  <td className="font-mono py-2">{v.running}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Surfaces — from theme.css">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SURFACES.map((s) => (
              <div key={s.token} className="rounded-lg border border-border overflow-hidden">
                <div className={`${s.cls} h-16`} />
                <div className="px-3 py-2 border-t border-border">
                  <div className="text-xs font-mono text-muted-foreground">{s.token}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type scale — from type.css">
          <div className="rounded-lg border border-border divide-y divide-border">
            {TYPE.map((t) => (
              <div key={t.cls} className="px-4 py-3">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-mono text-muted-foreground w-20 shrink-0 whitespace-nowrap">
                    {t.cls}
                  </span>
                  <span className={t.cls}>ระบบออกแบบ · Design system</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-24">{t.note}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Weights — from type.css">
          <div className="rounded-lg border border-border divide-y divide-border">
            {[
              { cls: "font-normal", job: "body" },
              { cls: "font-medium", job: "UI chrome — buttons, labels, tabs, table headers" },
              { cls: "font-semibold", job: "headings" },
              { cls: "font-bold", job: "display number only" },
            ].map((w) => (
              <div key={w.cls} className="px-4 py-2" data-probe={w.cls}>
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-mono text-muted-foreground w-28 shrink-0">
                    {w.cls}
                  </span>
                  <span className={`text-base ${w.cls}`}>ระบบออกแบบ · Design system</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-32">{w.job}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Four, and the namespace is closed — Tailwind&apos;s other five render at the inherited
            400. <code className="font-mono">v3/tools/check-type.mjs</code> fails the commit if one
            appears in source.
          </p>
        </Section>

        <Section title="Leading — from type.css">
          <div className="rounded-lg border border-border divide-y divide-border">
            {TYPE.map((t) => (
              <LeadingRow key={t.cls} cls={t.cls} note={t.note} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Sizes are Tailwind&apos;s ladder unmodified; the leading is CCD&apos;s and is the only
            thing separating a CCD screen from a stock shadcn one. Looser at 12 and 14, where nearly
            all UI text lives, tighter at 18 and 20 — Thai stacks tone marks above the cap line and
            hangs vowels below the baseline, so a Latin-tuned leading has the two colliding before a
            table is dense. Confirmed by owner 2026-08-12; the side-by-side that settled it is under
            Mocks.
          </p>
        </Section>

        <Section title="Status — CCD only, no shadcn slot">
          <div className="grid gap-4 sm:grid-cols-3">
            {STATUS.map((s) => (
              <div key={s.token} className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2">
                  <span className={`${s.dot} size-2.5 rounded-full`} />
                  <span className={`${s.text} text-sm font-medium`}>ยังไม่ส่งแบบประเมิน</span>
                </div>
                <div className="mt-3">
                  <span
                    className={`${s.tint} ${s.text} rounded-full px-2 py-0.5 text-xs font-medium`}
                  >
                    12 รายการ
                  </span>
                </div>
                <div className="text-xs font-mono text-muted-foreground mt-3">{s.token}</div>
                <div className="text-xs text-muted-foreground">{s.job}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Three tiers per hue, doing different jobs: the bright one is a <em>dot</em> and fails AA
            as text or as a fill; <code className="font-mono">-strong</code> is the readable version
            for glyphs and small coloured text; <code className="font-mono">-tint</code> is its pill
            background. No shadcn component will ever render one of these, so this is the only place
            they are drawn — which is why the open question &ldquo;does the trio still read on
            shadcn neutrals?&rdquo; can be answered here, on both surfaces, in both modes.
          </p>
        </Section>

        <Section title="Chart — CCD only, nothing wired yet">
          <div className="space-y-3">
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">categorical</div>
              <div className="flex gap-1">
                {CHART_CATEGORICAL.map((c) => (
                  <div key={c} className={`${c} h-10 flex-1 rounded-sm`} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">blue ramp</div>
              <div className="flex gap-1">
                {CHART_BLUE.map((c) => (
                  <div key={c} className={`${c} h-10 flex-1 rounded-sm`} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">rose ramp</div>
              <div className="flex gap-1">
                {CHART_ROSE.map((c) => (
                  <div key={c} className={`${c} h-10 flex-1 rounded-sm`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            A registry chart block colours itself from{" "}
            <code className="font-mono">var(--primary)</code>, so no upstream component exercises
            any of this — these slots are ours to wire whenever the first chart lands, and until
            then this is the only thing that has ever drawn them.
          </p>
        </Section>

        <Section title="Curve — from theme.css">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RADIUS.map((r) => (
              <div key={r.cls} className="min-w-0">
                <div className={`${r.cls} bg-secondary border border-border h-16`} />
                <div className="text-xs font-mono text-muted-foreground mt-2">{r.cls}</div>
                <div className="text-xs text-muted-foreground">{r.note}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            One base value in <code className="font-mono">theme.css</code>; every step above is a{" "}
            <code className="font-mono">calc()</code> off it, so changing the base moves the whole
            ladder. That derivation is shadcn&apos;s, not ours.
          </p>
        </Section>

        <Section title="Elevation — Tailwind's, untouched">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ELEVATION.map((e) => (
              <div key={e.cls} className="min-w-0">
                <div className={`${e.cls} bg-card border border-border rounded-md h-16`} />
                <div className="text-xs font-mono text-muted-foreground mt-3">{e.cls}</div>
                <div className="text-xs text-muted-foreground">{e.note}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Nothing in <code className="font-mono">theme.css</code> touches these — shadcn tokenises
            no shadow at all, so what renders here is the upstream default. Worth knowing that v2
            put no shadow on a resting card or button; it reserved lift for something that had
            genuinely left the page.
          </p>
        </Section>

        <Section title="Spacing — Tailwind's, untouched">
          <div className="flex flex-wrap items-end gap-4">
            {SPACING.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className={`${s} bg-primary rounded-xs`} />
                <span className="text-xs font-mono text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Motion — Tailwind's, untouched">
          <div className="flex flex-wrap gap-3">
            {MOTION.map((m) => (
              <div key={m.cls} className="min-w-0">
                <div
                  className={`${m.cls} bg-secondary hover:bg-primary transition-colors h-16 w-32 rounded-md border border-border`}
                />
                <div className="text-xs font-mono text-muted-foreground mt-2">{m.cls}</div>
                <div className="text-xs text-muted-foreground">{m.note}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Hover each one. Three different speeds are in use across the copied components and
            none of them was chosen by CCD — they arrived with the components.
          </p>
        </Section>

        <Section title="Who owns each material">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left font-medium py-2 pr-6">material</th>
                <th className="text-left font-medium py-2 pr-6">values decided by</th>
                <th className="text-left font-medium py-2">lives in</th>
              </tr>
            </thead>
            <tbody>
              {OWNERSHIP.map((o) => (
                <tr key={o.material} className="border-t border-border">
                  <th scope="row" className="text-left font-medium py-2 pr-6 whitespace-nowrap">
                    {o.material}
                  </th>
                  <td className="py-2 pr-6">{o.owner}</td>
                  <td className="font-mono py-2">{o.file}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-3">
            Five of the eight are Tailwind&apos;s on purpose. shadcn&apos;s theming doc tokenises
            colour and radius and leaves the rest alone, because those are not what a theme varies.
            A material with no CCD file behind it is that decision, not an oversight — the one
            CCD adds is type, because shadcn ships no type token and Thai forces the question.
          </p>
        </Section>

        <Section title="Dark mode">
          <p className="text-sm text-muted-foreground">
            This page follows your OS setting, because{" "}
            <code className="font-mono">&lt;html data-theme=&quot;system&quot;&gt;</code>. There is
            deliberately no way to force a dark block inside a light page:{" "}
            <code className="font-mono">theme.css</code> scopes its dark variant to{" "}
            <code className="font-mono">:root[data-theme=&quot;dark&quot;]</code> and says why — the
            attribute is a mode declaration for the document, never a data slot. A shell toggle will
            swap the attribute on <code className="font-mono">&lt;html&gt;</code>; side-by-side
            light and dark needs two frames, not two divs.
          </p>
        </Section>
      </div>
    </main>
  );
}
