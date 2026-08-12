import fs from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import { SceneFrame } from "./scene-frame";

/**
 * The template every pattern page uses, in a fixed order. A pattern is the
 * unit here — not a component. The measured reason: across the five v2 apps,
 * cowork alone had to invent 28 bespoke components, and eleven of those are
 * whole functional shapes (a kanban, a timeline, a room calendar) that no
 * amount of well-styled buttons would have supplied. The design system answered
 * "what does a button look like" and never answered "what shape does this job
 * take". This page is where the second question gets answered.
 *
 * The four parts, in this order, because the order is the argument:
 *
 *   1. JOB — one line, in Vitit's words, about a person and an outcome. It
 *      comes first so a shape can be judged against the thing it is for.
 *   2. SHAPE — what we decided and why. A pattern with no recorded why gets
 *      re-litigated by the next person to dislike it, which is how CCD's
 *      screens drifted apart in the first place.
 *   3. SCENE — live, under the fixture controls. Not a specimen on white: a
 *      real arrangement at a real size in a real language.
 *   4. SOURCE — the code to copy, read from the scene file at request time.
 *
 * Step 4 reads the file rather than taking a string prop, and that is the
 * workspace rule rather than a convenience: a snippet retyped into a doc is a
 * copy, and a copy that renders keeps looking authoritative long after the real
 * file has moved on. If the file cannot be read, this shows nothing at all.
 */

/** cwd depends on how the dev server was launched, so try both anchors. */
async function readSource(relativeToShell: string): Promise<string | null> {
  const candidates = [
    path.join(process.cwd(), relativeToShell),
    path.join(process.cwd(), "code/ccd-design-system/v3/shell", relativeToShell),
  ];
  for (const candidate of candidates) {
    try {
      return await fs.readFile(candidate, "utf8");
    } catch {
      /* try the next anchor */
    }
  }
  return null;
}

export type PatternPageProps = {
  /** The job, one line, about a person and an outcome. */
  job: string;
  /** The decided shape and why. Omit while the shape is still a fork. */
  shape?: ReactNode;
  /** What the shape is waiting on. Carries a Linear id and no status. */
  undecided?: { question: string; issue: string };
  /** The live scene. Omit and the frame says so, naming the current fixture. */
  children?: ReactNode;
  /** Path to the scene's source file, relative to shell/. */
  sourcePath?: string;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border pt-6">
      <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export async function PatternPage({
  job,
  shape,
  undecided,
  children,
  sourcePath,
}: PatternPageProps) {
  const source = sourcePath ? await readSource(sourcePath) : null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      <p className="text-xl leading-snug font-medium text-balance">{job}</p>

      <Section title="Shape">
        {shape ?? (
          <div className="rounded-md border border-dashed border-border px-4 py-4">
            <p className="text-sm">
              {undecided?.question ?? "Not decided yet."}
            </p>
            {undecided && (
              <p className="mt-2 text-sm text-muted-foreground">
                Vitit decides this one — tracked on{" "}
                <span className="font-mono">{undecided.issue}</span>.
              </p>
            )}
          </div>
        )}
      </Section>

      <Section title="Scene">
        <SceneFrame>{children}</SceneFrame>
      </Section>

      {source && (
        <Section title="Source">
          <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-4 text-xs leading-relaxed">
            <code>{source}</code>
          </pre>
        </Section>
      )}
    </div>
  );
}
