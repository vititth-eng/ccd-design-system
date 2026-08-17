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
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl font-semibold tabular-nums">
            {done} / {total}
          </span>
          <span className="text-sm text-muted-foreground">
            {th ? "ผู้ประเมินตอบแล้ว" : "raters answered"} · {pct}%
          </span>
          {stalled > 0 && (
            <span className="ml-auto text-sm font-medium text-caution-strong">
              {th
                ? `${stalled} คนยังไม่มีใครตอบเลย`
                : `${stalled} with no replies at all`}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
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
