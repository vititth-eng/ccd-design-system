"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Display, Muted } from "@/components/typography";
import { useFixture } from "../_workbench/use-fixture";
import { GROUPS, people, type Person, type RaterGroup } from "./fixture";

/**
 * CANDIDATE ZERO for the chase/monitor pattern, composed rather than pulled.
 *
 * The registry's only dashboard block is `dashboard-01`, and it was declined
 * rather than ignored — the method requires the iterate-away step to visibly
 * happen or be visibly declined, so the reasons are on the pattern page and in
 * Linear. In one line: it costs 14 components and 6 npm packages to arrive with
 * revenue cards, a drag-to-reorder table and pagination, none of which answers
 * "who has not replied yet". `table` and `badge` cost nothing and no
 * dependencies.
 *
 * The shape here is the incumbent's, rebuilt on v3: a summary above a table,
 * one row per person, one column per rater group, each cell a done/total.
 * Parity first — the comparison is meant to measure the stack, not taste. Every
 * departure from the live screen is listed on the pattern page as a break to
 * decide, not silently applied here.
 */

/* Three renderings for a cell, and the difference matters more than it looks:
   "not assigned" and "assigned, nobody answered" are the same zero on the live
   screen only because they use different glyphs. Keep that. */
function cellText(done: number, total: number): string {
  if (total === 0) return "—";
  if (done === total) return "✓";
  return `${done}/${total}`;
}

function cellTone(done: number, total: number): string {
  if (total === 0) return "text-muted-foreground/50";
  if (done === total) return "text-positive-strong";
  if (done === 0) return "text-caution-strong";
  return "text-foreground";
}

function rowTotals(p: Person): [number, number] {
  return (Object.keys(p.tally) as RaterGroup[]).reduce<[number, number]>(
    ([d, t], g) => [d + p.tally[g][0], t + p.tally[g][1]],
    [0, 0]
  );
}

export function ChaseScene() {
  const [fixture] = useFixture();
  const th = fixture.lang === "th";
  const rows = people(fixture.density, fixture.volume);

  const [done, total] = rows.reduce<[number, number]>(
    ([d, t], p) => {
      const [rd, rt] = rowTotals(p);
      return [d + rd, t + rt];
    },
    [0, 0]
  );
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const stalled = rows.filter((p) => {
    const [d, t] = rowTotals(p);
    return t > 0 && d === 0;
  }).length;

  return (
    <div className="flex flex-col gap-4">
      {/* The summary. The incumbent puts the fraction, the percentage and a
          meter on one line; the stalled count is NOT on the live screen and is
          the one addition here, because it is the number the whole surface
          exists to produce and it currently has to be counted by eye. */}
      <Card className="gap-3 p-4">
        {/* Progress, not two divs. The first cut of this hand-rolled the bar —
            which duplicates a shipped primitive, the same mistake the workbench
            rail already made once and recorded. It costs no dependencies, and
            the real difference is invisible: Base UI's Root carries the
            progressbar role and its value, so a screen reader reads "34%" where
            two divs read nothing at all. */}
        <Progress value={pct} className="flex-col gap-2">
          <div className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1">
            {/* Display, the role, not raw utilities. Roles exist so drift is
                findable, and this file bypassed them on the first pass.

                It reached for `text-2xl` first, and 24 having no role is
                DELIBERATE, not a gap — typography.tsx says so: 24 was minted
                only so the registry's own blocks do not render at the inherited
                size, and a role nobody calls is the lie that file already spent
                a session being. So Display (30) is the honest choice here.

                What is open is smaller: this is the first CCD screen to want a
                headline figure, and the rule for minting the 24 role is "when a
                CCD screen actually needs that size". Whether 30 is right inside
                a summary card, or whether this is the screen that earns 24 its
                role, is a decision for the pattern — not something to settle by
                reaching past the roles. */}
            <Display>
              {done} / {total}
            </Display>
            <Muted>
              {th ? "ผู้ประเมินตอบแล้ว" : "raters answered"} · {pct}%
            </Muted>
            {stalled > 0 && (
              <Muted className="ml-auto font-medium text-caution-strong">
                {th
                  ? `${stalled} คนยังไม่มีใครตอบเลย`
                  : `${stalled} with no replies at all`}
              </Muted>
            )}
          </div>
        </Progress>
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{th ? "ผู้ถูกประเมิน" : "Assessee"}</TableHead>
              {GROUPS.map((g) => (
                <TableHead key={g.key} className="text-right tabular-nums">
                  {th ? g.th : g.en}
                </TableHead>
              ))}
              <TableHead className="text-right">
                {th ? "ความคืบหน้า" : "Progress"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const [rd, rt] = rowTotals(p);
              const isStalled = rt > 0 && rd === 0;
              const name = th ? p.nameTh : p.nameEn;
              const unit = th ? p.unitTh : p.unitEn;
              return (
                <TableRow
                  key={p.id}
                  className={isStalled ? "bg-caution-tint/60" : undefined}
                >
                  <TableCell className="font-medium">
                    {name}
                    {unit && (
                      <span className="ml-2 font-normal text-muted-foreground">
                        · {unit}
                      </span>
                    )}
                  </TableCell>
                  {GROUPS.map((g) => {
                    const [d, t] = p.tally[g.key];
                    return (
                      <TableCell
                        key={g.key}
                        className={`text-right tabular-nums ${cellTone(d, t)}`}
                      >
                        {cellText(d, t)}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {rt === 0 ? "—" : `${rd}/${rt}`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
