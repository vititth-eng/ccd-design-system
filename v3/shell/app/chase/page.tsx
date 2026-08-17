import { PatternPage } from "../_workbench/pattern-page";
import { ChaseScene } from "./scene";

export default function ChasePatternPage() {
  return (
    <PatternPage
      job="An admin part-way through a review round has to find the people nobody has answered for yet, and chase them, without reading every row."
      undecided={{
        question:
          "Candidate zero, parity with the live screen. Nothing here is decided — the breaks below are the decisions.",
        issue: "CCD-281",
      }}
      shape={
        <div className="flex flex-col gap-4 text-sm">
          <p>
            <strong className="font-semibold">
              The registry&rsquo;s only dashboard block was declined, not ignored.
            </strong>{" "}
            <code>dashboard-01</code> is the sole block matching this job. It
            arrives with 14 new components and 6 npm packages — drag-and-drop,
            TanStack table, zod — and what it composes is revenue cards, a
            drag-to-reorder table, column-visibility menus and pagination. None
            of that answers <em>who has not replied yet</em>. <code>table</code>{" "}
            and <code>badge</code> together cost zero dependencies. The one idea
            the block gets right — a summary row above a detail table — the live
            screen already has.
          </p>

          <p>
            <strong className="font-semibold">So this is parity, on purpose.</strong>{" "}
            It rebuilds what ships today on v3 and changes as little as possible,
            because the pilot is meant to measure the stack rather than taste. One
            thing is added: the count of people with{" "}
            <em>no replies at all</em>. That number is what the surface exists to
            produce and today it has to be found by eye.
          </p>

          <p>
            <strong className="font-semibold">Five breaks to decide.</strong> Set
            the width to 375 and the volume to Overflowing before judging any of
            them — the desktop branch is what you are looking at until you frame
            it.
          </p>

          <ol className="flex list-decimal flex-col gap-2 pl-5">
            <li>
              <strong className="font-semibold">Seven columns do not fit a phone.</strong>{" "}
              Five rater groups plus a name plus a total. On the live screen this
              is a laptop-only surface and the method currently exempts admin
              screens from the 375px floor — but v3 raised mobile to a standing
              requirement and left that exemption open. This is the screen that
              forces the answer.
            </li>
            <li>
              <strong className="font-semibold">
                The live headers are English over Thai data.
              </strong>{" "}
              &ldquo;Assessee&rdquo;, &ldquo;Self&rdquo;, &ldquo;Progress&rdquo;
              above Thai names. Here they are translated, which is a change, not
              parity — flip the language toggle and judge whether the Thai
              headers earn their extra width.
            </li>
            <li>
              <strong className="font-semibold">A stalled row is tinted.</strong>{" "}
              Colour is doing the work alone, which is the thing the caution
              ruling says it may not do. It needs a second channel, or the
              stalled count in the summary has to be the only signal.
            </li>
            <li>
              <strong className="font-semibold">There is no way to chase from here.</strong>{" "}
              The surface finds the stalled people and then offers nothing to do
              about them. Whatever that action is, it is the reason the screen
              exists.
            </li>
            <li>
              <strong className="font-semibold">
                How big is the headline figure?
              </strong>{" "}
              <code>18 / 53</code> renders at 30 because that is the
              <code>Display</code> role. The ladder also mints 24 and calls it
              &ldquo;KPI figure&rdquo;, but deliberately gives it no role — 24
              exists so the registry&rsquo;s own blocks do not render at the
              inherited size, and the rule is to mint the role only when a CCD
              screen actually needs that size. This is the first CCD screen to
              want a headline figure, so it is the first chance to say whether
              30 is right inside a summary card or whether 24 earns its role
              here.
            </li>
          </ol>
        </div>
      }
      sourcePath="app/chase/scene.tsx"
    >
      <ChaseScene />
    </PatternPage>
  );
}
