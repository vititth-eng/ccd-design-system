import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";

/**
 * The first real component page.
 *
 * Every button below is the actual shadcn/Base UI component reading CCD
 * tokens — not a copy, not a mock. That distinction is the whole reason this
 * app exists: hover, focus-visible and disabled are the component's own
 * behaviour, so they cannot be painted on and cannot drift from what ships.
 */

const VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] items-center gap-4 border-t border-border px-4 py-3">
      <code className="text-xs text-muted-foreground">{label}</code>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {note ? <p className="text-sm text-muted-foreground mt-1 max-w-prose">{note}</p> : null}
      <div className="mt-4 rounded-lg border border-border">{children}</div>
    </section>
  );
}

export default function ButtonPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-xl font-semibold tracking-tight">Button</h1>
        <p className="text-base text-muted-foreground mt-2 max-w-prose">
          The real component, reading CCD tokens. Hover it, Tab to it, try the disabled ones —
          every state below is the component&apos;s own, which is exactly what a static mock could
          never show.
        </p>

        <Section
          title="Variants"
          note="Six as shipped. Destructive is a tinted surface rather than a solid fill — shadcn's own choice, and it happens to match the flat, quiet rule."
        >
          {VARIANTS.map((variant) => (
            <Row key={variant} label={variant}>
              <Button variant={variant}>บันทึก</Button>
              <Button variant={variant}>Save changes</Button>
              <Button variant={variant} disabled>
                Disabled
              </Button>
            </Row>
          ))}
        </Section>

        <Section title="Sizes" note="Four, plus icon-only at each. Heights are 24 / 32 / 36 / 40px.">
          {SIZES.map((size) => (
            <Row key={size} label={size}>
              <Button size={size}>เพิ่มรายการ</Button>
              <Button size={size} variant="outline">
                Add item
              </Button>
              <Button size={size} variant="outline">
                <Plus />
                With icon
              </Button>
            </Row>
          ))}
          <Row label="icon">
            <Button size="icon-xs" variant="outline" aria-label="Confirm">
              <Check />
            </Button>
            <Button size="icon-sm" variant="outline" aria-label="Confirm">
              <Check />
            </Button>
            <Button size="icon" variant="outline" aria-label="Confirm">
              <Check />
            </Button>
            <Button size="icon-lg" variant="outline" aria-label="Confirm">
              <Check />
            </Button>
          </Row>
        </Section>

        <Section
          title="In context"
          note="The pairing that actually ships: one primary action, one way out, and a destructive action kept away from both."
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Button variant="destructive">
              <Trash2 />
              ลบแบบสอบถาม
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost">ยกเลิก</Button>
              <Button>
                บันทึกและดำเนินการต่อ
                <ChevronDown />
              </Button>
            </div>
          </div>
        </Section>

        <Section
          title="Keyboard"
          note="Tab through this row. The focus ring is --ring at 3px with an offset border, from the token file — not the browser default, which belongs to no design system."
        >
          <div className="flex flex-wrap items-center gap-2 px-4 py-4">
            <Button variant="outline">หนึ่ง</Button>
            <Button variant="outline">สอง</Button>
            <Button variant="outline" disabled>
              ข้าม
            </Button>
            <Button variant="outline">สาม</Button>
          </div>
        </Section>
      </div>
    </main>
  );
}
