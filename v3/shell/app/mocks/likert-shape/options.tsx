"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { useFixture } from "../../_workbench/use-fixture";
import { ITEMS, LONG_ITEMS, SCALE, bindThai } from "../../likert/fixture";

/**
 * Four shapes for the same job, rendered live so they can be compared by
 * looking rather than by reading a description of them.
 *
 * Set the width control to 375 before judging any of them. Every one of these
 * uses viewport media queries, exactly as the real screens do, so a narrow DIV
 * on a wide viewport would render the desktop branch inside a phone-sized box —
 * the trap the width control exists to avoid.
 *
 * The density control decides the item count, the same way it does on the
 * pattern page — six on Short, forty on Long. The forty-item numbers quoted on
 * the page beside each option were measured with it set to Long, at 375px, and
 * not estimated from a row height.
 */

const COUNT = { short: 6, long: 40 } as const;

function useScene() {
  const [fixture] = useFixture();
  const th = fixture.lang === "th";
  const pool = fixture.volume === "overflow" ? LONG_ITEMS : ITEMS;
  const items = Array.from({ length: COUNT[fixture.density] }, (_, i) => ({
    ...pool[i % pool.length],
    no: i + 1,
  }));
  const text = (t: { th: string; en: string }) => (th ? bindThai(t.th) : t.en);
  return { th, items, text };
}

function Statement({
  item,
  th,
  text,
}: {
  item: { leadTh: string; leadEn: string; th: string; en: string };
  th: boolean;
  text: (t: { th: string; en: string }) => string;
}) {
  return (
    <p className="mb-3 text-base">
      <b className="font-semibold">{th ? bindThai(item.leadTh) : item.leadEn} </b>
      {text(item)}
    </p>
  );
}

function Circle({ n, on }: { n: number; on: boolean }) {
  return (
    <span
      className={`grid size-10 place-items-center rounded-full border text-sm font-medium tabular-nums transition-colors group-focus-visible:ring-3 group-focus-visible:ring-ring/50 ${
        on
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card hover:border-muted-foreground"
      }`}
    >
      {n}
    </span>
  );
}

/* ── A · the incumbent ───────────────────────────────────────────────────────
   v2's shape exactly. Level names stated once as a column header and dropped
   below 560px, where five Thai names will not fit five columns. */
export function OptionIncumbent() {
  const { th, items, text } = useScene();
  const [answers, setAnswers] = React.useState<Record<number, number>>({ 1: 4, 2: 2 });

  return (
    <Card className="gap-0">
      <div
        className="mb-2 hidden border-b border-border py-2 pr-6 pl-[58px] min-[560px]:grid min-[560px]:grid-cols-5 min-[560px]:gap-2"
        aria-hidden="true"
      >
        {SCALE.map((s) => (
          <span key={s.value} className="text-center text-xs whitespace-nowrap text-muted-foreground">
            {th ? bindThai(s.th) : s.en}
          </span>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.no}
          className={`grid gap-0 px-6 py-4 min-[560px]:grid-cols-[22px_1fr] min-[560px]:gap-3 ${
            i === 0 ? "" : "border-t border-border"
          }`}
        >
          <span className="pt-0.5 text-xs tabular-nums text-muted-foreground">{item.no}</span>
          <div>
            <Statement item={item} th={th} text={text} />
            <div role="radiogroup" aria-label={text(item)} className="grid grid-cols-5 gap-1 min-[560px]:gap-2">
              {SCALE.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={answers[item.no] === s.value}
                  aria-label={`${s.value} · ${th ? s.th : s.en}`}
                  onClick={() => setAnswers((a) => ({ ...a, [item.no]: s.value }))}
                  className="group grid cursor-pointer place-items-center outline-none"
                >
                  <Circle n={s.value} on={answers[item.no] === s.value} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}

/* ── B · anchored ends ───────────────────────────────────────────────────────
   The matrix kept, but the two ends named under every row, so the meaning of a
   circle never leaves the screen. Costs one 12px line per item; buys back the
   thing the incumbent loses on a phone. Naming only the ends is the standard
   survey convention rather than an invention — the middle points take their
   meaning from the ends they sit between. */
export function OptionAnchored() {
  const { th, items, text } = useScene();
  const [answers, setAnswers] = React.useState<Record<number, number>>({ 1: 4, 2: 2 });
  const lo = th ? bindThai(SCALE[0].th) : SCALE[0].en;
  const hi = th ? bindThai(SCALE[4].th) : SCALE[4].en;

  return (
    <Card className="gap-0">
      {items.map((item, i) => (
        <div
          key={item.no}
          className={`grid gap-0 px-6 py-4 min-[560px]:grid-cols-[22px_1fr] min-[560px]:gap-3 ${
            i === 0 ? "" : "border-t border-border"
          }`}
        >
          <span className="pt-0.5 text-xs tabular-nums text-muted-foreground">{item.no}</span>
          <div>
            <Statement item={item} th={th} text={text} />
            <div role="radiogroup" aria-label={text(item)} className="grid grid-cols-5 gap-1 min-[560px]:gap-2">
              {SCALE.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={answers[item.no] === s.value}
                  aria-label={`${s.value} · ${th ? s.th : s.en}`}
                  onClick={() => setAnswers((a) => ({ ...a, [item.no]: s.value }))}
                  className="group grid cursor-pointer place-items-center outline-none"
                >
                  <Circle n={s.value} on={answers[item.no] === s.value} />
                </button>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>{lo}</span>
              <span>{hi}</span>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}

/* ── C · stacked options ─────────────────────────────────────────────────────
   No matrix at all. Each level is a full-width row carrying its own number AND
   its own word, so nothing on the screen needs a legend. This is the shape the
   accessibility guidance points at — repeated single-answer questions rather
   than a grid — and it is the only one of the four that reads identically to a
   screen reader and to an eye.

   It is also by far the tallest: five 44px rows per item instead of one 40px
   row of circles. */
export function OptionStacked() {
  const { th, items, text } = useScene();
  const [answers, setAnswers] = React.useState<Record<number, number>>({ 1: 4, 2: 2 });

  return (
    <Card className="gap-0">
      {items.map((item, i) => (
        <div key={item.no} className={`px-6 py-4 ${i === 0 ? "" : "border-t border-border"}`}>
          <span className="text-xs tabular-nums text-muted-foreground">{item.no}</span>
          <Statement item={item} th={th} text={text} />
          <div role="radiogroup" aria-label={text(item)} className="flex flex-col gap-1.5">
            {SCALE.map((s) => {
              const on = answers[item.no] === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setAnswers((a) => ({ ...a, [item.no]: s.value }))}
                  className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 text-left text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                    on
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs tabular-nums ${
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {s.value}
                  </span>
                  {th ? bindThai(s.th) : s.en}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </Card>
  );
}

/* ── D · collapse on answer ──────────────────────────────────────────────────
   The anchored matrix, plus one behaviour: an answered item folds to a single
   line carrying its statement and the word it was given. Tap it to reopen.

   This is the only option whose cost goes DOWN as the survey progresses, which
   is the whole argument at forty questions — the page a rater is looking at
   gets shorter with every answer instead of staying fifteen screens long. The
   research calls this the accordion pattern and pairs it with the finding it is
   there to fight: past about seven rows, straight-lining rises sharply, because
   an unanswered grid of forty looks the same whether you read it or not. */
export function OptionCollapse() {
  const { th, items, text } = useScene();
  const [answers, setAnswers] = React.useState<Record<number, number>>({ 1: 4, 2: 2 });
  const [reopened, setReopened] = React.useState<number | null>(null);
  const lo = th ? bindThai(SCALE[0].th) : SCALE[0].en;
  const hi = th ? bindThai(SCALE[4].th) : SCALE[4].en;

  return (
    <Card className="gap-0">
      {items.map((item, i) => {
        const value = answers[item.no];
        const level = SCALE.find((s) => s.value === value);
        const folded = value !== undefined && reopened !== item.no;
        const rule = i === 0 ? "" : "border-t border-border";

        if (folded) {
          return (
            <button
              key={item.no}
              type="button"
              onClick={() => setReopened(item.no)}
              className={`flex w-full cursor-pointer items-center gap-3 px-6 py-3 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 ${rule}`}
            >
              <span className="w-4 shrink-0 text-xs tabular-nums text-muted-foreground">
                {item.no}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">
                {th ? bindThai(item.leadTh) : item.leadEn}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 py-0.5 pr-2.5 pl-1.5 text-xs font-medium text-primary">
                <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground tabular-nums">
                  {value}
                </span>
                {th ? bindThai(level!.th) : level!.en}
              </span>
            </button>
          );
        }

        return (
          <div key={item.no} className={`px-6 py-4 ${rule}`}>
            <span className="text-xs tabular-nums text-muted-foreground">{item.no}</span>
            <Statement item={item} th={th} text={text} />
            <div role="radiogroup" aria-label={text(item)} className="grid grid-cols-5 gap-1 min-[560px]:gap-2">
              {SCALE.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  role="radio"
                  aria-checked={value === s.value}
                  aria-label={`${s.value} · ${th ? s.th : s.en}`}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, [item.no]: s.value }));
                    setReopened(null);
                  }}
                  className="group grid cursor-pointer place-items-center outline-none"
                >
                  <Circle n={s.value} on={value === s.value} />
                </button>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>{lo}</span>
              <span>{hi}</span>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
