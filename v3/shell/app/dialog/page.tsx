"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Dialog — collision #4, rendered instead of argued.
 *
 * The overlay is the one place a copied component had to be edited: shadcn
 * hardcodes an absolute black, which cannot follow a theme. This file's dialogs use
 * the patched component, so the backdrop below IS --scrim at .32 light and .66
 * dark. Switch your OS theme with a dialog open and the difference is the
 * entire argument.
 *
 * /probe holds the unstyled Base UI primitive and answers the behaviour
 * question — focus trap, Escape, focus restoration. This page answers the
 * token question. Keeping them apart is deliberate: a page that tries to prove
 * both proves neither cleanly.
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
      <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export default function DialogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-xl font-semibold tracking-tight">Dialog</h1>
        <p className="text-base text-muted-foreground mt-2 max-w-prose">
          The real component, with the one local edit v3 makes to anything copied from shadcn: the
          overlay&apos;s absolute black became <code className="font-mono">bg-scrim</code>. Open a
          dialog and change your OS theme — the backdrop follows, which the hardcoded value could
          not do. The old value is not printed on this page on purpose: Tailwind scans raw text, so
          writing the utility here would put it back in the stylesheet.
        </p>

        <Section
          title="Confirm"
          note="The shape that actually ships: a question, one way out, one way forward. Popup is --popover, so this is the first time that token has been drawn by a component."
        >
          <Dialog>
            <DialogTrigger render={<Button>บันทึกการเปลี่ยนแปลง</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>บันทึกการเปลี่ยนแปลง?</DialogTitle>
                <DialogDescription>
                  ระบบจะส่งแบบสอบถามให้พนักงาน 1,530 คนทันที และยกเลิกไม่ได้
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost">ยกเลิก</Button>} />
                <DialogClose render={<Button>ยืนยัน</Button>} />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section
          title="Destructive"
          note="Destructive is a tinted surface, not a solid fill — so the dialog carrying it must not become the loudest thing on screen while the backdrop is already dimming the page."
        >
          <Dialog>
            <DialogTrigger render={<Button variant="destructive">ลบแบบสอบถาม</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ลบแบบสอบถามนี้?</DialogTitle>
                <DialogDescription>
                  คำตอบที่เก็บไว้แล้ว 1,284 รายการจะถูกลบด้วย และกู้คืนไม่ได้
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost">เก็บไว้</Button>} />
                <DialogClose render={<Button variant="destructive">ลบทิ้ง</Button>} />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section
          title="With a form"
          note="Three focusable controls, so the focus trap is observable here too — and an input at text-base, which is the 16px mobile floor that keeps iOS Safari from zooming on focus."
        >
          <Dialog>
            <DialogTrigger render={<Button variant="outline">เปลี่ยนชื่อ</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>เปลี่ยนชื่อแบบสอบถาม</DialogTitle>
                <DialogDescription>ชื่อนี้จะแสดงกับพนักงานทุกคน</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <label htmlFor="dialog-name" className="text-sm font-medium">
                  ชื่อแบบสอบถาม
                </label>
                <input
                  id="dialog-name"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                  defaultValue="แบบสอบถามความผูกพัน 2569"
                />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost">ยกเลิก</Button>} />
                <DialogClose render={<Button>บันทึก</Button>} />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Section
          title="Long content"
          note="The popup scrolls rather than the page behind it. Worth opening on a short window before assuming it holds."
        >
          <Dialog>
            <DialogTrigger render={<Button variant="outline">เงื่อนไขการใช้งาน</Button>} />
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เงื่อนไขการใช้งาน</DialogTitle>
                <DialogDescription>อ่านก่อนกดยอมรับ</DialogDescription>
              </DialogHeader>
              <div className="prose-flow max-w-prose">
                {Array.from({ length: 8 }).map((_, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    ย่อหน้าที่ {i + 1} — ข้อความยาวเพื่อทดสอบการเลื่อนภายในกล่อง
                    ไม่ใช่การเลื่อนของหน้าที่อยู่ด้านหลัง ซึ่งเป็นพฤติกรรมที่ mock
                    แบบ HTML ล้วนไม่มีทางแสดงได้
                  </p>
                ))}
              </div>
              <DialogFooter>
                <DialogClose render={<Button>ยอมรับ</Button>} />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>
      </div>
    </main>
  );
}
