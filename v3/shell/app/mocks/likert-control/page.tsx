"use client";

import * as React from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Body } from "@/components/typography";
import { ITEMS, SCALE, bindThai } from "../../likert/fixture";

/**
 * A MOCK. Its own route, per the standing rule — half of what it renders is
 * deliberately not what ships.
 *
 * THE SHAPE IS NOT IN QUESTION HERE. The matrix was decided 2026-08-13 and
 * every option below is that same matrix. What is being chosen is how one
 * control is DRAWN and how big it is, which is the last thing left over from
 * that decision: the component review parked "default button is 36px, xs is
 * 24px, a phone-first Thai survey conventionally wants 44 — the Likert scene at
 * 375px settles it", and this is that scene.
 *
 * WHY ALL THREE ARE BUILT ON THE REAL COMPONENT. The scene shipped a
 * hand-rolled `role="radiogroup"` out of buttons. Measured on the 40-item
 * fixture: 200 tab stops where a radio group gives 40, and the arrow keys did
 * nothing. `radio-group` was pulled from the registry for that, byte-identical,
 * under the rule that a component arrives when a decided pattern demands one.
 *
 * The registry's own `RadioGroupItem` hardcodes its indicator child, so it
 * cannot hold a number — options B and C use Base UI's `Radio.Root` under the
 * same `RadioGroup`. The group is what owns roving focus and the arrow keys, so
 * all three get the behaviour; only A gets the registry's 16px dot as well.
 *
 * The probe is local to this page on purpose. It measures one thing for one
 * question, and the DS rule is that a thing graduates on its SECOND use, not in
 * anticipation of one.
 */

const ITEM = ITEMS[0];

/**
 * Measured off the rendered control, never typed.
 *
 * TWO THINGS THIS GOT WRONG FIRST, both worth keeping written down.
 *
 * It read the tab stops in a plain mount effect and reported ZERO for every
 * option. Base UI assigns the roving tabindex in its own effect, which runs
 * after this one — so the honest-looking number was just a race. It observes
 * the subtree now and re-reads whenever the attribute lands.
 *
 * And a bounding box is not the hit area. The registry's dot draws 16px but
 * carries `after:-inset-x-3 after:-inset-y-2`, an invisible pseudo-element that
 * is the actual target — getBoundingClientRect cannot see it, so the first
 * version reported the registry as a 16px tap target and made it look far worse
 * than it is. The pseudo's own insets are read back and added.
 *
 * It also watches for RESIZE, which is not a nicety here. The target width is
 * the whole question this page asks and it is asked at 375px; a number measured
 * once at desktop and left standing would be wrong at exactly the width the
 * decision is made at, while still looking measured.
 */
function Measured({ groupId }: { groupId: string }) {
  const [read, setRead] = React.useState<string>("");

  React.useEffect(() => {
    const group = document.getElementById(groupId);
    if (!group) return;

    const measure = () => {
      const radios = [...group.querySelectorAll('[role="radio"]')] as HTMLElement[];
      if (!radios.length) return;
      const el = radios[0];
      const box = el.getBoundingClientRect();

      /* An absolutely positioned ::after with negative insets extends the
         target beyond the element. 'auto' means it does not participate. */
      const after = getComputedStyle(el, "::after");
      const inset = (v: string) => (v === "auto" ? 0 : Math.max(0, -parseFloat(v) || 0));
      const w = box.width + inset(after.left) + inset(after.right);
      const h = box.height + inset(after.top) + inset(after.bottom);

      /* The visible circle is what the eye judges; the box above is what the
         thumb hits, and in B and C they are deliberately not the same element. */
      const drawn = (el.querySelector("span") ?? el).getBoundingClientRect();
      const stops = radios.filter((r) => r.tabIndex >= 0).length;

      setRead(
        `target ${Math.round(w)}×${Math.round(h)} · drawn ${Math.round(drawn.width)}px · ` +
          `${stops} tab stop${stops === 1 ? "" : "s"} for 5 levels`
      );
    };

    measure();
    const attrs = new MutationObserver(measure);
    attrs.observe(group, { attributes: true, subtree: true, attributeFilter: ["tabindex"] });
    const size = new ResizeObserver(measure);
    size.observe(group);
    return () => {
      attrs.disconnect();
      size.disconnect();
    };
  }, [groupId]);

  return <div className="mt-2 text-xs font-mono text-muted-foreground">{read || "—"}</div>;
}

/** The statement above the control, identical in all three, so the only thing
 *  changing down the page is the control. */
function Statement() {
  return (
    <Body className="mb-3">
      <b className="font-semibold">{bindThai(ITEM.leadTh!)} </b>
      {bindThai(ITEM.th)}
    </Body>
  );
}

/* ── A — the registry, untouched ─────────────────────────────────────────────
   What "take from shadcn" looks like literally: a 16px dot with the level name
   beside it, stacked. It is the only option that needs no CCD styling at all,
   and the only one where the five level names are stated per item — which at
   forty items is two hundred repeats of the same five words. */
function OptionA() {
  const id = "opt-a";
  return (
    <RadioGroup id={id} defaultValue="3" className="gap-3">
      {SCALE.map((s) => (
        <label key={s.value} className="flex items-center gap-3 text-sm">
          <RadioGroupItem value={String(s.value)} />
          {s.value} · {bindThai(s.th)}
        </label>
      ))}
    </RadioGroup>
  );
}

/* ── B and C — CCD's numbered circle ─────────────────────────────────────────
   The incumbent shape, now on the real primitive. The number lives inside the
   circle so the five level names can be stated once as a column header instead
   of under every row.

   Two elements, not one: the Root fills its whole fifth of the row so the
   tappable box is wider than the circle it draws. That was the reason v2 built
   it this way and it survives the swap. */
function NumberedScale({ id, size }: { id: string; size: "size-10" | "size-11" }) {
  return (
    <RadioGroup
      id={id}
      defaultValue="3"
      className="grid grid-cols-5 gap-1 max-w-[360px] min-[560px]:gap-2"
    >
      {SCALE.map((s) => (
        <RadioPrimitive.Root
          key={s.value}
          value={String(s.value)}
          aria-label={`${s.value} · ${bindThai(s.th)}`}
          className="group grid cursor-pointer place-items-center outline-none"
        >
          <span
            className={`grid ${size} place-items-center rounded-full border text-sm font-medium tabular-nums transition-colors group-focus-visible:ring-3 group-focus-visible:ring-ring/50 group-data-checked:border-primary group-data-checked:bg-primary group-data-checked:text-primary-foreground border-border bg-card hover:border-muted-foreground`}
          >
            {s.value}
          </span>
        </RadioPrimitive.Root>
      ))}
    </RadioGroup>
  );
}

const OPTIONS = [
  {
    key: "A",
    name: "Registry stock — 16px dot, name per level",
    note: "No CCD styling. States all five names on every item, which is 200 repeats on a 40-item survey.",
    render: <OptionA />,
    id: "opt-a",
  },
  {
    key: "B",
    name: "CCD numbered circle — 40px",
    note: "The incumbent, rebuilt on the real component. Clears WCAG 2.2's 24px floor.",
    render: <NumberedScale id="opt-b" size="size-10" />,
    id: "opt-b",
  },
  {
    key: "C",
    name: "CCD numbered circle — 44px",
    note: "The same drawing at the size a phone-first survey conventionally wants.",
    render: <NumberedScale id="opt-c" size="size-11" />,
    id: "opt-c",
  },
];

export default function LikertControlMockPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Likert control — how the scale is drawn
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          The matrix shape is decided and is not what this page asks. All three are the same shape
          and the same component underneath — only the control&apos;s drawing and size differ. Every
          number under an option is measured off it as it rendered.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          <span className="font-medium text-foreground">Try the keyboard.</span> Tab into any group,
          then press ← and →. All three answer, because all three sit on the real radio group. The
          shipped scene does not: it is five separate tab stops per item and the arrows are dead.
        </p>
      </div>

      {OPTIONS.map((o) => (
        <div key={o.key}>
          <div className="text-xs font-mono text-muted-foreground mb-2">
            {o.key} — {o.name}
          </div>
          <Card className="gap-0 text-base">
            <div className="px-6">
              <Statement />
              {o.render}
              <Measured groupId={o.id} />
            </div>
          </Card>
          <p className="text-xs text-muted-foreground mt-2">{o.note}</p>
        </div>
      ))}

      <div className="rounded-lg border border-border p-4">
        <p className="text-sm">
          <span className="font-medium">Open — Vitit&apos;s call, and it is B or C.</span> A is here
          to show what the registry gives untouched, not as a candidate: it states five level names
          on every row, which is the repetition the column header exists to remove.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          B is what ships today; C reaches the 44px target size phones conventionally want. The
          difference is the two <span className="font-mono">drawn</span> figures above, and the row
          grows by exactly that much — measured, and small enough that scroll length is not the
          argument either way. Judge them by thumb, not by the numbers.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Both already clear WCAG 2.2&apos;s 24×24 floor, and in both the tappable box is wider than
          the circle it draws, because the control fills its whole fifth of the row. So this is a
          comfort call on a real phone, not a compliance one — which is why it wants looking at on
          one rather than deciding from the numbers.
        </p>
      </div>
    </div>
  );
}
