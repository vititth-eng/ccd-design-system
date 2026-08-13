"use client";

import * as React from "react";

/**
 * The last CCD-owned tokens nothing had ever drawn: the three --flow-* gaps and
 * --max-width-prose, all four of which reach the page only through the
 * `prose-flow` utility and `max-w-prose`.
 *
 * Every number here is MEASURED off the block beside it, never read from
 * type.css and printed.
 *
 * WHAT IS MEASURED IS THE MARGIN, and the label says so. Box-to-box distance
 * cannot be the optical gap: half-leading lives INSIDE each line box, so it is
 * already counted in the boxes themselves and never appears between them. The
 * optical gap is this number plus the half-leading on both sides, which type.css
 * puts at roughly 1.65 to 2.80px per side depending on the size — and depends on
 * the script, since Thai's content area is far taller than Latin's at the same
 * size. That is why the written values are odd numbers: 8 / 10 / 28 render as
 * an even 12 / 16 / 32 to the eye.
 *
 * Measuring the margin and calling it the margin is the honest version. A
 * script-aware optical calculator here would be a second implementation of
 * something the eye already does, and it would be the thing that rots.
 */
export function ProseRhythm() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [rows, setRows] = React.useState<{ label: string; value: string }[]>([]);

  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const el = (sel: string) => root.querySelector(sel) as HTMLElement | null;
    /* Box-to-box distance, which is the MARGIN and nothing else — half-leading
       lives inside each line box, so it never lands between two of them. */
    const gap = (a: HTMLElement | null, b: HTMLElement | null) =>
      a && b ? `${Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom)}px` : "—";

    const [p1, p2] = [el("[data-r=p1]"), el("[data-r=p2]")];
    const [h, ph] = [el("[data-r=h]"), el("[data-r=ph]")];

    setRows([
      { label: "--flow-heading", value: `${gap(h, ph)} margin` },
      { label: "--flow-paragraph", value: `${gap(p1, p2)} margin` },
      { label: "--flow-block", value: `${gap(p2, h)} margin` },
      {
        label: "--max-width-prose",
        value: root ? `${Math.round(root.getBoundingClientRect().width)}px` : "—",
      },
    ]);
  }, []);

  return (
    /* Stacked, not two columns. Beside a 16rem label column the block never got
       512px to spend, so --max-width-prose measured 448 — the container, not the
       token. A readout that reports its own layout instead of the value it
       names is the exact failure this page exists to remove. */
    <div className="grid gap-4">
      <dl className="grid w-fit grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-xs font-mono">
        {rows.length === 0 && <dt className="text-muted-foreground">measuring…</dt>}
        {rows.map((r) => (
          <React.Fragment key={r.label}>
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="tabular-nums">{r.value}</dd>
          </React.Fragment>
        ))}
      </dl>

      {/* A real prose-flow block, not a diagram of one. */}
      <div ref={ref} className="prose-flow max-w-prose rounded-lg border border-border p-4">
        <p data-r="p1">
          แบบประเมินนี้ใช้เวลาประมาณ 15 นาที ระบบจะบันทึกคำตอบอัตโนมัติทุกครั้งที่ท่านเปลี่ยนคำตอบ
        </p>
        <p data-r="p2">
          ท่านสามารถออกจากระบบและกลับมาตอบต่อได้ โดยจะเริ่มจากข้อที่ท่านค้างไว้
        </p>
        <h3 data-r="h" className="text-lg font-semibold">
          การเก็บรักษาข้อมูล
        </h3>
        <p data-r="ph">
          คำตอบของท่านจะถูกนำไปประมวลผลรวมกับผู้ประเมินท่านอื่น
          และจะไม่มีการเปิดเผยคำตอบรายบุคคลต่อผู้ถูกประเมิน
        </p>
      </div>
    </div>
  );
}
