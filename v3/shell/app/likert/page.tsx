import { PatternPage } from "../_workbench/pattern-page";
import { LikertScene } from "./scene";

export default function LikertPatternPage() {
  return (
    <PatternPage
      job="A rater has a run of statements about a colleague to answer, mostly on a phone, and has to get to the end in one sitting without losing their place or their honesty."
      shape={
        <div className="flex flex-col gap-4 text-sm">
          <p>
            <strong className="font-semibold">
              The matrix, kept — v2&rsquo;s shape, decided 2026-08-13 against four
              alternatives rendered side by side at{" "}
              <a className="underline underline-offset-4" href="/mocks/likert-shape">
                /mocks/likert-shape
              </a>
              .
            </strong>{" "}
            Statements run down, one scale runs across, the five level names are
            stated once as a column header, and a scale key at the top of the card
            says what each level means. shadcn has no Likert and no survey
            component of any kind, so nothing upstream decided this.
          </p>

          <p>
            <strong className="font-semibold">Why this and not the others.</strong>{" "}
            The instrument asks raters to answer{" "}
            <span lang="th">จำแนก</span> — discriminately, different scores for
            different items — and the matrix is the only shape where several items
            are visible at once to be compared. It is also the shortest screen of
            the five and the only one with no prerequisite: the alternatives that
            summarise an answered row need a short label per item, which
            multi-rater has and onboarding does not.
          </p>

          <p>
            <strong className="font-semibold">The cost, accepted.</strong> Below
            560px the five level names are dropped, because five Thai words will
            not fit five columns. On a forty-item survey that means the scale key
            is off-screen for most of the scroll, and a circle marked 4 carries no
            word. Anchoring the two ends under every row was rendered and is the
            standing alternative if this proves to be a real problem for raters —
            it costs one 12px line per item, which is under the Thai floor.
          </p>

          <p>
            <strong className="font-semibold">Three composition rules</strong> came
            out of tuning it, each measured rather than eyeballed. The statement is{" "}
            <strong className="font-semibold">16px</strong>, stated explicitly
            because shadcn&rsquo;s Card sets 14 on everything inside it — at forty
            items in Thai, 14 saves 304px of a 6,636px screen, which is not worth
            paying for in legibility. The item number is{" "}
            <strong className="font-semibold">baseline-aligned</strong> to the
            statement, not box-aligned, which had it riding 3px high. And the scale
            is <strong className="font-semibold">capped at 360px</strong> rather
            than stretched to the reading column: the widest level name measures
            53px, so 72px per column clears it, and letting the five spread to 77px
            apart made one control read as five.
          </p>
        </div>
      }
      sourcePath="app/likert/scene.tsx"
    >
      <LikertScene />
    </PatternPage>
  );
}
