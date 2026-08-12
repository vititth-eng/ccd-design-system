import { version as reactRuntime } from "react";
import nextPkg from "next/package.json";
import twPkg from "tailwindcss/package.json";
import shellPkg from "../package.json";

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

/* The comparison specimen. Thai chosen for the marks rather than the meaning:
   ผู้ ฝ่าย ปี่ ซอฟต์ each stack something above the cap line or below the
   baseline, which is the whole reason type.css sets its own leading. */
const LEADING_ROWS = [
  { name: "ผู้จัดการฝ่ายบุคคล", meta: "ประเมินกลางปี · 31 ส.ค. 2569", value: "82%" },
  { name: "ทีมวิศวกรรมซอฟต์แวร์", meta: "รอบที่ 2 · ปิดรับ 14 ก.ย.", value: "76%" },
  { name: "ฝ่ายปฏิบัติการโรงงาน", meta: "ยังไม่เริ่ม · 40 ข้อ", value: "—" },
];

/**
 * Two leadings, one markup. Only the line-height differs, so any difference
 * you see is the leading and nothing else.
 *
 * The stock ratios are Tailwind's own expressions — 1.25/0.875 for text-sm,
 * 1/0.75 for text-xs, 1.5/1 for text-base — computed here rather than typed as
 * decimals, so they stay legible as the thing they came from. They go on as
 * inline style because a utility would be overridden by the class that sets
 * the size, which is the whole point of comparing them.
 */
const STOCK = { xs: 1 / 0.75, sm: 1.25 / 0.875, base: 1.5 / 1 };

function LeadingSpecimen({ stock }: { stock: boolean }) {
  const s = (r: number) => (stock ? { lineHeight: r } : undefined);
  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border px-4 py-3">
        <div className="text-base font-semibold" style={s(STOCK.base)}>
          แบบประเมินรอบกลางปี
        </div>
        <p className="text-sm text-muted-foreground mt-1" style={s(STOCK.sm)}>
          ผู้ประเมินต้องตอบให้ครบทุกข้อภายในรอบนี้ ระบบจะบันทึกอัตโนมัติทุกครั้งที่เปลี่ยนคำตอบ
        </p>
      </div>
      <div className="divide-y divide-border">
        {LEADING_ROWS.map((r) => (
          <div key={r.name} className="flex items-baseline gap-3 px-4 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm" style={s(STOCK.sm)}>
                {r.name}
              </div>
              <div className="text-xs text-muted-foreground" style={s(STOCK.xs)}>
                {r.meta}
              </div>
            </div>
            <div className="text-sm font-medium" style={s(STOCK.sm)}>
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

        <Section title="Leading — CCD against stock">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-2">CCD — type.css</div>
              <LeadingSpecimen stock={false} />
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-2">
                stock Tailwind / vega
              </div>
              <LeadingSpecimen stock />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Identical markup; only line-height differs. Every SIZE on this page is Tailwind&apos;s
            ladder unmodified — the difference between a CCD screen and a stock shadcn one is
            leading alone. It runs looser at the small sizes, where nearly all UI text lives, and
            tighter at the headings, so the two ends move toward each other.{" "}
            <code className="font-mono">type.css</code> gives the reason: leading is set for Thai,
            which stacks tone marks above the cap line and vowels below the baseline, and a
            Latin-tuned leading collides on the first dense Thai table. The rows above are the test
            case — the question is whether the room is worth what it costs on every screen.
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
