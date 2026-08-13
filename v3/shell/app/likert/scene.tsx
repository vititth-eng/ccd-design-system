"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { ScaleOption } from "@/components/scale-option";
import { Body, Muted, Section } from "@/components/typography";
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
 * The scale was hand-rolled here at first, and correctly so: the registry has
 * no Likert of any kind (searched 2026-08-13 — `likert` and `survey` both
 * return nothing), and the standing rule is that a component arrives when a
 * DECIDED pattern demands it. Deciding the shape first was the point.
 *
 * The shape is decided, so the demand exists and the components are in. The
 * scale is `RadioGroup` from the registry holding CCD's `ScaleOption`, which is
 * what closed three defects the hand-roll had: 200 tab stops on a forty-item
 * survey instead of 40, dead arrow keys, and a control drawn with `border-border`
 * where `border-input` belongs — the two are identical in light and diverge in
 * dark, so the circles wore a fainter edge than every other control, in one mode
 * only, and nothing errored.
 */

/* v2 stacks nine items per screen because that is one dimension on the paper
   form. The fixture's density axis exists to argue with that: `short` is the
   six-item screen, `long` is the forty-item one Vitit asked to see. */
const COUNT = { short: 6, long: 40 } as const;

/**
 * The scale's own width, and it is a measured number rather than a taste call.
 *
 * v2 lets the five columns stretch to fill whatever the card is, which on a
 * 660px reading column puts 77px of white between neighbouring circles. Five
 * marks that far apart stop reading as ONE control and start reading as five
 * separate ones — the row the whole screen exists to fill looks unresolved.
 *
 * The width was set by the thing that actually needs it. The five level names
 * are the widest content in those columns, and the widest of them — นาน ๆ ครั้ง
 * — measures 53px at 12px. 72px per column clears it with 9px of air each side,
 * so 5 × 72 = 360px. Wider buys nothing; narrower collides the labels.
 *
 * Inert on a phone: at 375 the available width is ~293px, so the max-width
 * never applies and the columns still divide what there is.
 */
const SCALE_WIDTH = "max-w-[360px]";

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

      {/* text-base ONCE, on the card, per type.css: 14 is chrome and 16 is
          content, and a card can hold either — so the card that holds content
          says so, rather than every paragraph inside it saying so separately.
          shadcn's Card sets text-sm on its root, which is right for a card of
          labels and wrong for a card whose whole job is statements to read.

          gap-0 because this card owns its own internal rhythm and every rule
          inside it is load-bearing; Card's default gap would add a second,
          invisible one on top of the padding each band already carries. */}
      <Card className="gap-0 text-base">
        <div className="px-6">
          {/* Roles, not utilities. `text-lg font-semibold` and Section render
              the same pixels; only the second one says the markup is a section
              header, so a later change can move every section header without
              also moving everything that happens to be 18px. */}
          <Section>
            {text(COPY.dimension)}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              · items 1–{count}
            </span>
          </Section>
          <Muted className="mt-1">{text(COPY.stem)}</Muted>
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
          className="mb-2 hidden border-b border-border py-2 pr-6 pl-[58px] min-[560px]:block"
          aria-hidden="true"
        >
          <div className={`grid grid-cols-5 gap-2 ${SCALE_WIDTH}`}>
            {SCALE.map((s) => (
              <span
                key={s.value}
                className="text-center text-xs whitespace-nowrap text-muted-foreground"
              >
                {th ? bindThai(s.th) : s.en}
              </span>
            ))}
          </div>
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
            /* items-baseline, not a hand-tuned padding. The number is 12px and
               the statement 16px, so aligning their BOXES leaves the number
               riding 3px above the line it labels — measured, not guessed. Grid
               baseline alignment takes the second column's first line box,
               which is the statement, and puts the two on one line for free at
               any size either of them is ever set to. */
            className={`grid gap-0 px-6 py-4 min-[560px]:grid-cols-[22px_1fr] min-[560px]:items-baseline min-[560px]:gap-3 ${
              i === 0 ? "" : "border-t border-border"
            }`}
          >
            <span className="text-xs tabular-nums text-muted-foreground">
              {item.no}
            </span>
            <div>
              <Body className="mb-3">
                {/* The paper prints the competency term as a bold lead-in on
                    every statement, so the row is two registers wrapping as one
                    — and it is OPTIONAL, because only one of the two apps has
                    it. multi-rater's short_label_th is NOT NULL; onboarding's
                    form fetches only the full question. This layout survives
                    either way, which is the reason it is the incumbent: nothing
                    about it depends on a short label existing. */}
                {(th ? item.leadTh : item.leadEn) && (
                  <b className="font-semibold">
                    {th ? bindThai(item.leadTh!) : item.leadEn}{" "}
                  </b>
                )}
                {text(item)}
              </Body>
              {/* One RadioGroup per item, and the group is what carries the
                  keyboard: one tab stop for the five levels, arrows moving
                  between them. The hand-rolled version this replaces gave every
                  circle its own tab stop and no arrows at all — measured on the
                  forty-item fixture, 200 stops where this gives 40. */}
              <RadioGroup
                aria-label={th ? bindThai(item.th) : item.en}
                value={answers[item.no] === undefined ? null : String(answers[item.no])}
                onValueChange={(v) =>
                  setAnswers((a) => ({ ...a, [item.no]: Number(v) }))
                }
                className={`grid grid-cols-5 gap-1 min-[560px]:gap-2 ${SCALE_WIDTH}`}
              >
                {SCALE.map((s) => (
                  <ScaleOption
                    key={s.value}
                    value={String(s.value)}
                    aria-label={`${s.value} · ${th ? s.th : s.en}`}
                  >
                    {s.value}
                  </ScaleOption>
                ))}
              </RadioGroup>
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
