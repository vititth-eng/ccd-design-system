import { PatternPage } from "../_workbench/pattern-page";
import { LikertScene } from "./scene";

export default function LikertPatternPage() {
  return (
    <PatternPage
      job="A rater has a run of statements about a colleague to answer, mostly on a phone, and has to get to the end in one sitting without losing their place or their honesty."
      undecided={{
        question:
          "Does the scale keep v2's shape? The scene below IS v2's shape, rebuilt on v3's tokens and nothing else — the incumbent on screen so it can be argued with. Set density to Long and width to 375 to see the forty-question case in Thai. shadcn has no Likert and no survey component of any kind, so nothing upstream decides this.",
        issue: "CCD-281",
      }}
      sourcePath="app/likert/scene.tsx"
    >
      <LikertScene />
    </PatternPage>
  );
}
