import { ContrastProbe } from "../../_workbench/contrast-probe";

/**
 * A MOCK. Vitit's rule, 2026-08-12: it lives on its own route because half of
 * what it renders is deliberately not what ships. The Tokens page keeps drawing
 * the shipped trio, and it keeps drawing it as it is today.
 *
 * The question: `--caution-strong` was measured against v2's navy. The neutral
 * family is shadcn's now — white cards, #F5F5F5 quiet surfaces — and on those
 * it is the only one of the three that fails AA as text.
 *
 * WHY THE CANDIDATE IS A SCOPED CUSTOM PROPERTY AND NOT AN INLINE COLOUR.
 * It replaces the LIGHT value only. Dark already clears 6:1 and is not being
 * asked anything, and the first cut of this page swapped both — which painted a
 * dark orange onto a near-black card and reported the candidate failing at
 * 3.87:1, a true measurement of a comparison nobody proposed. Redefining the
 * token on a wrapper lets the two dark selectors in theme.css put it back by
 * the ordinary cascade, so the page is right in light, dark and system without
 * knowing which one it is in.
 */

const CANDIDATE = "#A35C18";

/* The same two selectors theme.css uses, and they have to be repeated here
   rather than inherited: this rule sets --caution-strong on a wrapper, which is
   nearer than :root, so :root's dark block no longer wins on specificity. */
const CANDIDATE_SCOPE = `
  .caution-candidate { --caution-strong: ${CANDIDATE}; }
  :root[data-theme="dark"] .caution-candidate { --caution-strong: var(--d-caution-strong); }
  @media (prefers-color-scheme: dark) {
    :root[data-theme="system"] .caution-candidate { --caution-strong: var(--d-caution-strong); }
  }
`;

const ROWS = [
  {
    hue: "positive",
    dot: "bg-positive",
    text: "text-positive-strong",
    tint: "bg-positive-tint",
    label: "ส่งแบบประเมินครบแล้ว",
    count: "24 รายการ",
  },
  {
    hue: "caution",
    dot: "bg-caution",
    text: "text-caution-strong",
    tint: "bg-caution-tint",
    label: "ใกล้ถึงกำหนดส่ง",
    count: "7 รายการ",
  },
  {
    hue: "negative",
    dot: "bg-negative",
    text: "text-negative-strong",
    tint: "bg-negative-tint",
    label: "เลยกำหนดส่งแล้ว",
    count: "3 รายการ",
  },
];

/* A scene, not a swatch. The trio's real job is a status line in a list of
   assessment rounds, where the three sit under one another and get compared —
   which is also the only way the odd one out is visible at all. Positive and
   negative are identical in both columns on purpose: they are the control, and
   without them the left column reads as "the old set" rather than "the one
   token that is out of family". */
function Scene({ candidate }: { candidate?: boolean }) {
  return (
    <div className={`rounded-lg border border-border ${candidate ? "caution-candidate" : ""}`}>
      <div className="border-b border-border px-4 py-3">
        <div className="text-base font-semibold">รอบประเมินกลางปี 2569</div>
      </div>
      <div className="divide-y divide-border">
        {ROWS.map((r) => (
          <div key={r.hue} className="flex flex-col gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={`${r.dot} size-2.5 shrink-0 rounded-full`} />
              <ContrastProbe className={`${r.text} text-sm font-medium`}>{r.label}</ContrastProbe>
            </div>
            <div>
              <ContrastProbe
                className={`${r.tint} ${r.text} rounded-full px-2 py-0.5 text-xs font-medium`}
              >
                {r.count}
              </ContrastProbe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CautionStatusMockPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <style>{CANDIDATE_SCOPE}</style>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Caution — does the status trio read on shadcn neutrals?
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Identical markup, twice. Only <code className="font-mono">--caution-strong</code> differs,
          and only in light. Every ratio beside a line is measured off that line as it rendered, in
          the mode you are reading it in — flip the theme and they all re-measure.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-xs font-mono mb-2">
            #CF741E <span className="text-muted-foreground">· shipped</span>
          </div>
          <Scene />
        </div>
        <div>
          <div className="text-xs font-mono text-muted-foreground mb-2">{CANDIDATE} · candidate</div>
          <Scene candidate />
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-sm">
          <span className="font-medium">Open — this one is Vitit&apos;s.</span> Positive and negative
          clear AA on both their backgrounds and are untouched here. Caution clears neither, and it
          is the only token in the set that does not.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          It is not drift. <code className="font-mono">theme.css</code> already says this token is
          for <em>glyphs and marks only, never a paragraph</em>, and the ratio it names is the one
          measured here. The problem is that the rule lives in a comment while the token is named
          like its two siblings — so the next screen that wants a caution label will reach for it,
          get a compiling, rendering, unreadable line, and nothing will error. The Tokens page does
          exactly that today.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          The candidate keeps the hue at 29.2° and only walks the lightness down. It costs the
          orange some of its warmth against the yellow dot above it, and it buys a set where all
          three <code className="font-mono">-strong</code> tokens land within a tenth of each other
          on white — which is what makes the rule sayable in one line instead of one line plus an
          exception.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Dark mode is not the question and is not changed: every pairing clears 6:1 against the
          near-black surfaces already. Only the light side is deciding anything.
        </p>
      </div>
    </div>
  );
}
