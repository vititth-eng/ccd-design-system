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
