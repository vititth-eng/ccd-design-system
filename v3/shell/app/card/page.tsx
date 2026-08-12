import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Card — the first surface token to render inside a real component.
 *
 * --card and --card-foreground had never been drawn by anything but a swatch
 * on the index page. A swatch proves the value survived the build; it does not
 * prove the pair is readable, or that the card separates from the page behind
 * it. Both of those need a card with text in it, which is this page.
 */

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {note ? <p className="text-sm text-muted-foreground mt-1 max-w-prose">{note}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function CardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-xl font-semibold tracking-tight">Card</h1>
        <p className="text-base text-muted-foreground mt-2 max-w-prose">
          The real component on CCD tokens. Card carries no interaction of its own — what it does
          carry is the surface pair the whole app sits on, so the question this page answers is
          whether <code className="font-mono">--card</code> reads against{" "}
          <code className="font-mono">--background</code> in both modes.
        </p>

        <Section
          title="Full anatomy"
          note="Header, description, action, content, footer — every slot the component ships, so nothing is left unrendered and therefore unchecked."
        >
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>แบบสอบถามพนักงาน</CardTitle>
              <CardDescription>ปิดรับคำตอบ 31 สิงหาคม 2569</CardDescription>
              <CardAction>
                <Button variant="ghost" size="sm">
                  แก้ไข
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                คำอธิบายสั้น ๆ ของแบบสอบถาม อยู่บนพื้นผิว card ไม่ใช่พื้นหลังของหน้า
              </p>
              <p className="text-sm text-muted-foreground">
                Secondary line on the same surface — muted-foreground has to clear contrast against
                --card, not only against --background.
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost">ยกเลิก</Button>
              <Button>ส่ง</Button>
            </CardFooter>
          </Card>
        </Section>

        <Section
          title="Display number"
          note="The one place font-bold is sanctioned, and the reason text-3xl sits at line-height 1.2 — at 1.15 the digits overflow their own line box."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "ตอบแล้ว", value: "1,284", sub: "จาก 1,530 คน" },
              { label: "อัตราการตอบ", value: "83.9%", sub: "+4.2 จากรอบก่อน" },
              { label: "เหลือเวลา", value: "6", sub: "วัน" },
            ].map((stat) => (
              <Card key={stat.label} size="sm">
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="Nesting — card on card"
          note="A dense screen stacks these. Two surfaces that separate on a white page can collapse into one another in dark mode, which is the failure worth looking for here."
        >
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>สรุปรายแผนก</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm font-medium">ฝ่ายผลิต</div>
                <div className="text-sm text-muted-foreground">312 คน · ตอบแล้ว 91%</div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm font-medium">ฝ่ายขาย</div>
                <div className="text-sm text-muted-foreground">148 คน · ตอบแล้ว 76%</div>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section
          title="What this page found"
          note="Card does not use --border. It separates with ring-1 ring-foreground/10 and shadow-xs — a translucent ring derived from the text colour, which tracks the mode by itself. Worth knowing before treating --border as the boundary token for every surface."
        >
          <div className="flex flex-wrap gap-4">
            <div className="rounded-xl bg-card px-4 py-3 text-sm ring-1 ring-foreground/10">
              ring-foreground/10 — what the component ships
            </div>
            <div className="rounded-xl bg-card px-4 py-3 text-sm border border-border">
              border-border — the token we mint
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
