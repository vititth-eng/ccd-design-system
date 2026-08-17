import Link from "next/link";
import { Body, Section, Caption } from "@/components/typography";
import {
  INVENTORY,
  STATE_LABEL,
  inventoryTally,
  type ComponentState,
  type InventoryItem,
} from "../../content/inventory";

/**
 * What the system is holding, and what state each piece is in.
 *
 * This is a REFERENCE page, not a mock: every row is a fact about the repo
 * right now. The set of rows is machine-checked by tools/check-inventory.mjs,
 * so a component cannot arrive without appearing here.
 *
 * The order is deliberate and is the argument: finished things first, then
 * things that are merely present, then the ones nobody has decided. Sorting
 * alphabetically would have hidden the shape — that five of thirteen entered
 * behind a single import is the whole finding, and it only reads as a finding
 * when they sit together.
 */

const ORDER: ComponentState[] = [
  "demanded",
  "reference",
  "instrument",
  "transitive",
  "unused",
];

/* The one state that is finished, and the one that needs a decision. Everything
   between is neither good nor bad on its own. */
const TONE: Record<ComponentState, string> = {
  demanded: "border-positive/40",
  reference: "border-border",
  instrument: "border-border",
  transitive: "border-caution/50",
  unused: "border-caution/50",
};

function Row({ item }: { item: InventoryItem }) {
  return (
    <li className={`border-l-2 ${TONE[item.state]} py-2 pl-3`}>
      <div className="flex flex-wrap items-baseline gap-x-2">
        {item.href ? (
          <Link href={item.href} className="font-medium underline-offset-4 hover:underline">
            {item.name}
          </Link>
        ) : (
          <span className="font-medium">{item.name}</span>
        )}
        <Caption className="text-muted-foreground">
          {item.origin === "ccd" ? "ours" : "shadcn"}
          {item.file ? ` · ${item.file}` : " · no file, a dependency only"}
        </Caption>
      </div>
      <Body className="mt-0.5 text-muted-foreground">{item.why}</Body>
      {item.edited && (
        <Caption className="mt-0.5 block text-caution-strong">
          edited away from the registry — {item.edited}
        </Caption>
      )}
    </li>
  );
}

export default function InventoryPage() {
  const tally = inventoryTally();
  const undecided = INVENTORY.filter(
    (i) => i.state === "transitive" || i.state === "unused"
  ).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Section>What the system is holding</Section>
      <Body className="mt-2 text-muted-foreground">
        Every component in the repo and why it is here — the rail lists four
        component pages, this is all {INVENTORY.filter((i) => i.file).length} of
        them. The last row is not a component at all but a dependency that ships
        no file, listed because nothing else would ever show it. A commit that
        adds or removes a component without updating this list is refused.
      </Body>

      <div className="mt-6 rounded-lg border border-border p-4">
        <Body className="font-medium">
          {undecided} of {INVENTORY.length} are here without anyone deciding on them.
        </Body>
        <Body className="mt-1 text-muted-foreground">
          Not a defect — it is what a stop rule looks like before the deletion pass
          runs. A pull stays quarantined until a pattern is decided, and then
          everything the decision did not keep goes. Nothing below has reached
          that moment yet, because only one pattern has been decided.
        </Body>
      </div>

      <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
        {tally.map(({ state, n }) => (
          <div key={state} className="flex items-baseline gap-1.5">
            <dt className="tabular-nums font-medium">{n}</dt>
            <dd className="text-muted-foreground text-sm">{STATE_LABEL[state]}</dd>
          </div>
        ))}
      </dl>

      {ORDER.map((state) => {
        const rows = INVENTORY.filter((i) => i.state === state);
        if (rows.length === 0) return null;
        return (
          <section key={state} className="mt-8">
            <h3 className="text-sm font-semibold">
              {STATE_LABEL[state]}
              <span className="ml-2 tabular-nums font-normal text-muted-foreground">
                {rows.length}
              </span>
            </h3>
            <ul className="mt-2 space-y-1">
              {rows.map((i) => (
                <Row key={i.name} item={i} />
              ))}
            </ul>
          </section>
        );
      })}

      <Caption className="mt-10 block text-muted-foreground">
        The list of names is checked against the filesystem on every commit. The
        state and the reason beside each one are not, and cannot be — whether a
        decided pattern demanded something is knowledge about a decision, not
        anything an import graph can answer.
      </Caption>
    </div>
  );
}
