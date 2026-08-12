import { PatternPage } from "../_workbench/pattern-page";

export default function LikertPatternPage() {
  return (
    <PatternPage
      job="A rater has a run of statements about a colleague to answer, mostly on a phone, and has to get to the end in one sitting without losing their place or their honesty."
      undecided={{
        question:
          "Does the scale keep v2's shape? This is the most-seen screen in CCD and it is entirely ours — no registry has an opinion about it, so nothing decides it but a look at the real thing in Thai at forty questions.",
        issue: "CCD-281",
      }}
      /* sourcePath goes on once there is a scene file to point it at. The
         reader itself is proven — checked 2026-08-12 against this very file,
         which rendered into the Source block from the first cwd anchor. */
    />
  );
}
