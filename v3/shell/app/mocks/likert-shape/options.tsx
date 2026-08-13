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

/* ── The two D variants share this ───────────────────────────────────────────
   Both are the anchored matrix that reacts to being answered. They differ in
   whether the answered row gives its height back.

   MOTION GRAMMAR, taken from what is already in the repo rather than invented:
   shadcn's own sidebar animates with `duration-200 ease-linear` on a NAMED
   property list, never `transition-all`. Both variants below use exactly that.
   base-vega's accordion animates height off a `--accordion-panel-height`
   variable that Base UI measures and sets; the grid-rows technique used here
   gets the same auto-height animation with no component and no dependency,
   which is the right trade while the shape is still a candidate. If D wins,
   the real one pulls `collapsible` from the registry and inherits the
   accessibility wiring with it.

   Every transition is behind `motion-safe:`. A rater who has asked their
   operating system to stop animating things gets the state change with no
   movement at all, and this audience skews older than the one shadcn's
   defaults were tuned for. */
function useAnswers() {
  const [answers, setAnswers] = React.useState<Record<number, number>>({ 1: 4, 2: 2 });
  return [answers, setAnswers] as const;
}

function Anchors({ lo, hi, dim }: { lo: string; hi: string; dim?: boolean }) {
  return (
    <div
      className={`mt-1 flex justify-between text-xs transition-opacity duration-200 ease-linear motion-reduce:transition-none ${
        dim ? "text-muted-foreground opacity-0" : "text-muted-foreground opacity-100"
      }`}
    >
      <span>{lo}</span>
      <span>{hi}</span>
    </div>
  );
}

function Chip({ value, label, shown }: { value: number; label: string; shown: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 py-0.5 pr-2.5 pl-1.5 text-xs font-medium text-primary transition-opacity duration-200 ease-linear motion-reduce:transition-none ${
        shown ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!shown}
    >
      <span className="grid size-5 place-items-center rounded-full bg-primary tabular-nums text-primary-foreground">
        {value}
      </span>
      {label}
    </span>
  );
}

/* ── D1 · fold, animated ─────────────────────────────────────────────────────
   The row keeps a permanent header — number, competency, and the chip naming
   the answer. Only the BODY folds: the statement, the circles, the anchors.

   That split is the whole craft of it. Folding the entire row would move the
   thing the thumb just touched; folding only what sits below the header means
   the tapped row stays exactly where it was and the next question rises to
   meet the thumb. The header is the anchor the animation pivots around.

   grid-template-rows 0fr → 1fr is what animates an auto height without
   measuring it. The child needs `overflow-hidden` or its content spills out of
   the collapsed track and the fold does nothing visible. */
export function OptionFoldAnimated() {
  const { th, items, text } = useScene();
  const [answers, setAnswers] = useAnswers();
  const [reopened, setReopened] = React.useState<number | null>(null);
  const lo = th ? bindThai(SCALE[0].th) : SCALE[0].en;
  const hi = th ? bindThai(SCALE[4].th) : SCALE[4].en;

  return (
    /* py-2, not the card's default py-6. A card of full-bleed rows is not a card
       of content: 24px above a 42px row is more than half a row of dead space at
       each end, and it reads as a mistake rather than as padding. 10px matches
       the row's own vertical padding, so the ends keep the list's rhythm. */
    <Card className="gap-0 py-2">
      {items.map((item, i) => {
        const value = answers[item.no];
        const level = SCALE.find((s) => s.value === value);
        const folded = value !== undefined && reopened !== item.no;

        return (
          <div key={item.no} className={i === 0 ? "" : "border-t border-border"}>
            {/* Symmetric padding, and that costs something worth naming. The
                first version used pt-3 pb-1 so the statement would sit tight
                under its own competency lead when open — but a folded row is
                the state a rater spends most of the survey looking at, and
                asymmetric padding makes every one of them read top-heavy. The
                row is centred now; the open state gets its tightness back from
                the body carrying no top padding of its own. */}
            <button
              type="button"
              onClick={() => setReopened(folded ? item.no : null)}
              aria-expanded={!folded}
              className="flex w-full cursor-pointer items-center gap-3 px-6 py-2.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="w-4 shrink-0 text-xs tabular-nums text-muted-foreground">
                {item.no}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {th ? bindThai(item.leadTh) : item.leadEn}
              </span>
              {level && <Chip value={level.value} label={th ? bindThai(level.th) : level.en} shown={folded} />}
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-linear motion-reduce:transition-none ${
                folded ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
              }`}
            >
              <div className="overflow-hidden">
                {/* No top padding: the header's own bottom padding is the gap,
                    which keeps the statement reading as a continuation of the
                    competency lead above it rather than as a separate block. */}
                <div className="px-6 pb-4">
                  <p className="mb-3 text-base">{text(item)}</p>
                  <div role="radiogroup" aria-label={text(item)} className="grid grid-cols-5 gap-1 min-[560px]:gap-2">
                    {SCALE.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        role="radio"
                        aria-checked={value === s.value}
                        aria-label={`${s.value} · ${th ? s.th : s.en}`}
                        tabIndex={folded ? -1 : 0}
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
                  <Anchors lo={lo} hi={hi} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

/* ── D2 · settle in place ────────────────────────────────────────────────────
   Nothing folds and nothing moves. An answered row RECEDES: the statement goes
   to muted, the four circles that were not picked fade back, the anchors drop
   away, and the one that was picked stays at full strength.

   Two things this buys that folding cannot.

   Zero layout shift. Nothing below a tapped row ever moves, so a thumb
   travelling down a forty-item list never has the target pulled out from under
   it — the single most common mis-tap on a long mobile form.

   And it turns the answered page into a PROFILE. The picked circles stay in
   their columns, so scrolling back shows the shape of the answers: a column of
   marks all in the same place is straight-lining, made visible to the person
   doing it, on the screen where they can still fix it. That is a direct answer
   to จำแนก — rate discriminately — which is the one instruction the incumbent
   asks for and gives the rater no way to check.

   What it costs is the thing D1 buys: the page never gets shorter. */
export function OptionSettle() {
  const { th, items, text } = useScene();
  const [answers, setAnswers] = useAnswers();
  const lo = th ? bindThai(SCALE[0].th) : SCALE[0].en;
  const hi = th ? bindThai(SCALE[4].th) : SCALE[4].en;

  return (
    <Card className="gap-0">
      {items.map((item, i) => {
        const value = answers[item.no];
        const done = value !== undefined;

        return (
          <div
            key={item.no}
            className={`grid gap-0 px-6 py-4 min-[560px]:grid-cols-[22px_1fr] min-[560px]:gap-3 ${
              i === 0 ? "" : "border-t border-border"
            }`}
          >
            <span className="pt-0.5 text-xs tabular-nums text-muted-foreground">{item.no}</span>
            <div>
              <p
                className={`mb-3 text-base transition-colors duration-200 ease-linear motion-reduce:transition-none ${
                  done ? "text-muted-foreground" : ""
                }`}
              >
                <b className="font-semibold">{th ? bindThai(item.leadTh) : item.leadEn} </b>
                {text(item)}
              </p>
              <div role="radiogroup" aria-label={text(item)} className="grid grid-cols-5 gap-1 min-[560px]:gap-2">
                {SCALE.map((s) => {
                  const on = value === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={`${s.value} · ${th ? s.th : s.en}`}
                      onClick={() => setAnswers((a) => ({ ...a, [item.no]: s.value }))}
                      /* The unpicked circles recede rather than vanish: at 0 the
                         row would read as a single mark floating in white and
                         the scale it belongs to would be gone. 30% keeps the
                         track legible and still makes the answer the only thing
                         the eye lands on. */
                      className={`group grid cursor-pointer place-items-center outline-none transition-opacity duration-200 ease-linear hover:opacity-100 motion-reduce:transition-none ${
                        done && !on ? "opacity-30" : "opacity-100"
                      }`}
                    >
                      <Circle n={s.value} on={on} />
                    </button>
                  );
                })}
              </div>
              <Anchors lo={lo} hi={hi} dim={done} />
            </div>
          </div>
        );
      })}
    </Card>
  );
}
