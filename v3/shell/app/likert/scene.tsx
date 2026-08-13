"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFixture } from "../_workbench/use-fixture";
import { COPY, ITEMS, LONG_ITEMS, SCALE, bindThai } from "./fixture";

/**
 * The Likert screen as v2 ships it today, rebuilt on v3's tokens and nothing
 * else. This is the INCUMBENT, put on screen so its shape can be judged — not a
 * proposal. Everything geometric here is carried over deliberately from
 * `ccd-brb-multi-rater/app/rate/[token]/rate.module.css`, and every carried
 * decision is annotated below with the reason v2 gave for it, so a reader can
 * disagree with the reason rather than with the pixels.
 *
 * No component was pulled from the registry to build it. The scale circles are
 * hand-rolled here rather than assembled out of `radio-group` or `toggle-group`
 * for two reasons: the registry has no Likert of any kind (searched 2026-08-13 —
 * `likert` and `survey` both return nothing), and the standing rule is that a
 * component arrives when a DECIDED pattern demands it. Deciding the shape first
 * is the whole point of this page.
 */

/* v2 stacks nine items per screen because that is one dimension on the paper
   form. The fixture's density axis exists to argue with that: `short` is the
   six-item screen, `long` is the forty-item one Vitit asked to see. */
const COUNT = { short: 6, long: 40 } as const;

export function LikertScene() {
  const [fixture] = useFixture();
  const th = fixture.lang === "th";

  /* `overflow` swaps the statement pool rather than the count — the axis is how
     much content fills the shape, not how many rows there are. Six long ones
     cycle; the repeat is a fixture artifact and not a claim about the real
     instrument, which never repeats a statement. */
  const pool = fixture.volume === "overflow" ? LONG_ITEMS : ITEMS;
  const count = COUNT[fixture.density];
  const items = Array.from({ length: count }, (_, i) => ({
    ...pool[i % pool.length],
    no: i + 1,
  }));

  /* Three answer states, because the empty screen and the finished screen are
     different layouts and only the middle one ever gets designed. */
  const seed = React.useMemo(() => {
    if (fixture.volume === "empty") return {};
    if (fixture.volume === "overflow") {
      return Object.fromEntries(items.map((it) => [it.no, ((it.no * 2) % 5) + 1]));
    }
    return Object.fromEntries(
      items.filter((it) => it.no % 3 !== 0).map((it) => [it.no, ((it.no * 3) % 5) + 1])
    );
  }, [fixture.volume, count, fixture.density]); // eslint-disable-line react-hooks/exhaustive-deps

  const [answers, setAnswers] = React.useState<Record<number, number>>(seed);
  React.useEffect(() => setAnswers(seed), [seed]);

  const left = items.filter((it) => answers[it.no] === undefined).length;
  const text = (t: { th: string; en: string }) => (th ? bindThai(t.th) : t.en);

  /* Only the described levels reach the key. v2 states it outright rather than
     hiding it behind a disclosure: a rater who has to go looking for what "3"
     means will simply not look. */
  const described = SCALE.filter((s) => (th ? s.descTh : s.descEn));

  return (
    <div className="mx-auto max-w-[660px]">
      {/* ── progress ─────────────────────────────────────────────────────── */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          Part 1 · Behaviour · 1 of 3
        </span>
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <span className="block h-full rounded-full bg-primary" style={{ width: "34%" }} />
        </span>
      </div>

      {/* ── who you are rating — a meta line, not a tinted callout ────────── */}
      <p className="mb-4 flex flex-wrap items-baseline gap-2">
        <span className="text-sm text-muted-foreground">Rating</span>
        <span className="font-medium">{text(COPY.assessee)}</span>
        <span className="text-sm text-muted-foreground">· {text(COPY.fn)}</span>
      </p>

      {/* gap-0: this card owns its own internal rhythm, and every rule inside it
          is load-bearing. Card's default gap would add a second, invisible one
          on top of the padding each band already carries. */}
      <Card className="gap-0">
        <div className="px-6">
          <h2 className="text-lg font-semibold">
            {text(COPY.dimension)}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              · items 1–{count}
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{text(COPY.stem)}</p>
        </div>

        {/* ── scale key ─────────────────────────────────────────────────────
            Full-bleed and unfilled. v2's rule: a tinted multi-line panel reads
            as a nested box, and the whole surface is flat white with separation
            by line only. */}
        {described.length > 0 && (
          <dl className="mt-4 grid gap-2 border-t border-border px-6 pt-4 pb-3 text-sm">
            {described.map((s) => (
              <div key={s.value} className="grid gap-x-3 min-[560px]:grid-cols-[132px_1fr]">
                <dt className="font-medium">
                  {s.value} · {th ? bindThai(s.th) : s.en}
                </dt>
                <dd className="text-muted-foreground">
                  {th ? bindThai(s.descTh!) : s.descEn}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* ── the five level names, once ─────────────────────────────────────
            Stated as a column header instead of under every circle: at forty
            items that would be 200 repeats of the same five words. The left pad
            clears the item-number column so each name sits dead over its own
            circle — 24px card pad + 22px number + 12px gap.

            Dropped below 560px, where five names will not fit five columns. The
            key above still carries the meaning and the circles carry the number. */}
        <div
          className="mb-2 hidden border-b border-border py-2 pr-6 pl-[58px] min-[560px]:grid min-[560px]:grid-cols-5 min-[560px]:gap-2"
          aria-hidden="true"
        >
          {SCALE.map((s) => (
            <span
              key={s.value}
              className="text-center text-xs whitespace-nowrap text-muted-foreground"
            >
              {th ? bindThai(s.th) : s.en}
            </span>
          ))}
        </div>

        {/* ── items ─────────────────────────────────────────────────────────
            No competency sub-header: v2 runs the items straight through because
            the rater rates the behaviour, not the grouping. Competency is a
            scoring unit and belongs in the report.

            Below 560px the number column collapses and the number moves above
            its own statement — a 22px gutter is a fifth of the screen there. */}
        {items.map((item, i) => (
          <div
            key={item.no}
            className={`grid gap-0 px-6 py-4 min-[560px]:grid-cols-[22px_1fr] min-[560px]:gap-3 ${
              i === 0 ? "" : "border-t border-border"
            }`}
          >
            <span className="pt-0.5 text-xs tabular-nums text-muted-foreground">
              {item.no}
            </span>
            <div>
              {/* text-base stated, not inherited. shadcn's Card sets text-sm on
                  everything inside it, which silently rendered the statement —
                  the one thing on the screen a person actually reads — at 14
                  where v2 ships 16. The card's default is right for a card of
                  metadata and wrong for a card that is all body copy. */}
              <p className="mb-3 text-base">
                {/* the paper prints the competency term as a bold lead-in on
                    every statement, so the row is two registers wrapping as one */}
                <b className="font-semibold">
                  {th ? bindThai(item.leadTh) : item.leadEn}{" "}
                </b>
                {text(item)}
              </p>
              <div
                role="radiogroup"
                aria-label={th ? bindThai(item.th) : item.en}
                className="grid grid-cols-5 gap-1 min-[560px]:gap-2"
              >
                {SCALE.map((s) => {
                  const on = answers[item.no] === s.value;
                  return (
                    /* Two elements, not one: the button fills its whole fifth of
                       the row so the hit area is wider than the 40px circle it
                       draws. On a 375px screen that is the difference between a
                       67px target and a 40px one. */
                    <button
                      key={s.value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={`${s.value} · ${th ? s.th : s.en}`}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [item.no]: s.value }))
                      }
                      className="group grid cursor-pointer place-items-center outline-none"
                    >
                      <span
                        className={`grid size-10 place-items-center rounded-full border text-sm font-medium tabular-nums transition-colors group-focus-visible:ring-3 group-focus-visible:ring-ring/50 ${
                          on
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card hover:border-muted-foreground"
                        }`}
                      >
                        {s.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* ── footer ────────────────────────────────────────────────────────
          The gate is the reason Next is disabled, said next to Next rather than
          discovered by pressing it. Caution carries the dot only — the token is
          3.4:1 and the type file marks it glyphs-and-marks, never a paragraph. */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="ghost">← Back</Button>
        <div className="flex items-center gap-3">
          {left > 0 && (
            <span className="flex items-center gap-1.5 text-sm">
              <span className="size-2 rounded-full bg-caution" />
              {left} {left === 1 ? "item" : "items"} left
            </span>
          )}
          <Button disabled={left > 0}>Next →</Button>
        </div>
      </div>
    </div>
  );
}
