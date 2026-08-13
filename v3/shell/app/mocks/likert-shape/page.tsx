import type { ReactNode } from "react";
import {
  OptionAnchored,
  OptionFoldAnimated,
  OptionIncumbent,
  OptionSettle,
  OptionStacked,
} from "./options";

/**
 * A MOCK. Five shapes for one job, on its own route because that is the rule:
 * a reference page answers "what is true right now", and four of the five
 * things below are deliberately not what ships.
 *
 * WHAT IS BEING DECIDED: the Likert screen is the most-seen surface CCD owns
 * and no registry has an opinion about it — shadcn ships no Likert and no
 * survey component of any kind. Two apps collect one today (multi-rater's
 * 5-point competency matrix and onboarding's 5-point check-up) and they already
 * share v2's `.scale` primitive, so whatever is decided here lands in both.
 * DISC is not in scope: forced ranking of four statements is an ipsative
 * pattern, not a Likert, and it gets its own page.
 *
 * WHAT THE OUTSIDE WORLD SAYS, since it turns out to say something specific
 * and it argues against the incumbent:
 *
 *   - Matrix questions are the shape most often called out as the one to avoid
 *     on a phone. The failure they name is horizontal cramming — response
 *     options that do not all fit the width — which costs both completion and
 *     data quality.
 *   - Past roughly seven rows, STRAIGHT-LINING rises sharply: the rater picks
 *     one column and runs it down the page. A forty-row grid is the textbook
 *     case, and it is exactly what CCD ships.
 *   - Five points beats seven on mobile. CCD is already at five.
 *   - Where accessibility is a requirement, repeated single-answer questions
 *     are named as the safer alternative to a grid.
 *   - The accordion — one item open, folding as it is answered — is the named
 *     compromise between a grid and one-question-per-screen.
 *
 * None of that decides it. Straight-lining is a real risk in a 360° instrument
 * and so is abandonment, and the shape that best fights one is not the shape
 * that best fights the other. That trade is Vitit's, which is why this page
 * renders rather than recommends.
 */

/**
 * Every height below was measured off the rendered card at a 375px viewport
 * with the density control on Long — forty items, Thai, ordinary statements —
 * not derived from a row height and not estimated. They are the CARD's height,
 * so the five are comparable: the progress line, the meta line and the footer
 * are identical in all five and would only add the same ~390px to each.
 *
 * One correction worth carrying, because it was quoted wrong first: the
 * workbench PAGE at that fixture measures 11,928px, and roughly half of that is
 * this workbench's own prose and the Source block. The survey screen itself is
 * 6,636px. Quoting the page height as the survey's length overstates it by
 * about seven phone screens.
 */
const FORTY = "at forty items";

function Option({
  letter,
  name,
  claim,
  buys,
  costs,
  scale,
  children,
}: {
  letter: string;
  name: string;
  claim: string;
  buys: string;
  costs: string;
  scale: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="grid size-6 place-items-center rounded-full bg-foreground text-xs font-medium text-background">
          {letter}
        </span>
        <h2 className="text-lg font-semibold">{name}</h2>
        <span className="text-sm text-muted-foreground">{claim}</span>
      </div>
      <dl className="mb-5 grid gap-x-4 gap-y-2 text-sm min-[560px]:grid-cols-[6rem_1fr]">
        <dt className="font-medium">Buys</dt>
        <dd className="text-muted-foreground">{buys}</dd>
        <dt className="font-medium">Costs</dt>
        <dd className="text-muted-foreground">{costs}</dd>
        <dt className="font-medium">{FORTY}</dt>
        <dd className="text-muted-foreground">{scale}</dd>
      </dl>
      {children}
    </section>
  );
}

export default function LikertShapeMock() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
      <div>
        <p className="text-xl leading-snug font-medium text-balance">
          Five shapes for one job: a rater answering a run of statements about a
          colleague, on a phone, in Thai, without straight-lining and without
          giving up halfway.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Set the width control to <span className="font-medium">375</span>{" "}
          before judging any of these — every one uses viewport media queries,
          exactly as the real screens do, so the desktop branch is what you are
          looking at until you frame it. Six items each; the forty-item
          consequence is stated per option rather than scrolled five times. The
          fixture controls are live here too — switch to{" "}
          <span className="font-medium">Overflowing</span> to see each shape
          carry a long statement with <em>no bold competency lead</em> — which is
          not a stress case but onboarding&rsquo;s actual shape, and the one that
          separates these five from each other.
        </p>
      </div>

      <Option
        letter="A"
        name="The incumbent"
        claim="what v2 ships today"
        buys="The tightest screen of the five, and the only one where a rater can see several items at once and rate them relative to each other — which is what the instrument asks for when it says จำแนก, rate discriminately."
        costs="Below 560px the five level names are dropped, because five Thai words will not fit five columns. The scale key at the top of the card carries the meaning instead."
        scale="6,243px — 7.7 phone screens, the shortest any option starts at. The scale key is off-screen for the last 7 of them, so for almost the whole survey a circle marked 4 has no word attached to it."
      >
        <OptionIncumbent />
      </Option>

      <Option
        letter="B"
        name="Anchored ends"
        claim="the incumbent, plus the two words that matter"
        buys="The meaning of a circle never leaves the screen. Naming only the ends is the ordinary survey convention rather than an invention — the middle points take their meaning from the ends they sit between."
        costs="One 12px line per item, and 12px is below the Thai floor this system sets for anything read to act. It is arguable that an anchor is a legend rather than a control; it is also arguable that it is not."
        scale="7,123px — 8.8 phone screens. One extra screen of scrolling against the incumbent, for a word under every row."
      >
        <OptionAnchored />
      </Option>

      <Option
        letter="C"
        name="Stacked options"
        claim="no matrix at all"
        buys="Every level carries its own number and its own word, so nothing on the screen needs a legend and nothing is dropped at any width. It is the shape the accessibility guidance points at, and the only one of the five that reads the same to a screen reader as to an eye. Straight-lining is hardest here: picking 4 for the tenth time takes ten separate deliberate taps in ten different places."
        costs="By far the tallest — five 44px rows per item where the others spend one 40px row. And nothing can be compared against anything: the rater sees one statement at a time, which is the opposite of what จำแนก asks for."
        scale="14,471px — 17.8 phone screens. Two and a third times the incumbent, and ten more screens than anchored ends."
      >
        <OptionStacked />
      </Option>

      <Option
        letter="D1"
        name="Fold, animated"
        claim="the page gets shorter as you work"
        buys="The only shape whose cost goes DOWN as the survey progresses. The row keeps a permanent header — number, competency, and a chip naming the answer — and only the body folds, so the row the thumb just touched stays exactly where it is and the next question rises to meet it. Answer a row, then tap its header to reopen it."
        costs="It has a DATA PREREQUISITE the others do not: a folded row must say which item it is in one line, and the only text short enough is a competency lead. multi-rater has one on every item; onboarding has none, and there the folded row falls back to the statement with its end cut off — switch the volume control to Overflowing and read what survives. Measured in that state: between 16% and 32% of each statement, every one cut mid-word. It also hides the answer's position: a chip reading 4 · บ่อยครั้ง tells you what you said, but not the shape of what you said across the page."
        scale="Starts at 6,555px and ends at 1,815px — 8.1 phone screens down to 2.2, measured by answering all forty. It finishes shorter than any other option starts. The folded row is 45px, which clears the 44px touch target a phone-first form wants."
      >
        <OptionFoldAnimated />
      </Option>

      <Option
        letter="D2"
        name="Settle in place"
        claim="nothing folds, nothing moves"
        buys="Zero layout shift — nothing below a tapped row ever moves, so a thumb travelling a forty-item list never has the target pulled out from under it. And it turns the answered page into a profile: the picked circles stay in their columns, so scrolling back shows the shape of the answers. A column of marks all in the same place IS straight-lining, made visible to the person doing it, on the screen where they can still fix it — a direct answer to จำแนก, which the incumbent asks for and gives the rater no way to check."
        costs="The page never gets shorter. A rater on item thirty-nine is still looking at the same nine screens they started with."
        scale="7,123px throughout — identical to anchored ends, because nothing is ever removed."
      >
        <OptionSettle />
      </Option>

      <section className="border-t border-border pt-6">
        <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Where this came from
        </h2>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li>
            The straight-lining threshold, the five-versus-seven point finding,
            the accessibility preference for repeated single-answer questions,
            and the accordion pattern are all standard survey-methodology
            guidance rather than anything invented here.
          </li>
          <li>
            Every height is measured off the rendered card at a 375px viewport
            with forty items in Thai, not estimated from a row height. The
            collapse figure was taken by answering all forty and measuring what
            was left.
          </li>
          <li>
            The short-label facts are read off the schemas, not assumed:
            multi-rater&rsquo;s <code>likert_items.short_label_th</code> is NOT
            NULL, while onboarding&rsquo;s survey RPC selects only{" "}
            <code>question_full_en</code> and <code>question_full_th</code> — so
            its rater screen has no short label available at all, and renders the
            full question in both languages, one under the other.
          </li>
          <li>
            The one thing no source can settle: straight-lining and abandonment
            pull in opposite directions, and which one a 360° instrument can
            better afford to lose is a judgement about CCD&rsquo;s raters.
          </li>
        </ul>
      </section>
    </div>
  );
}
