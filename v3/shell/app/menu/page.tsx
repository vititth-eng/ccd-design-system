"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, MoreHorizontal, Trash2, UserPlus } from "lucide-react";

/**
 * Dropdown menu — and the answer to selection vs hover.
 *
 * That question has been open since the colour work: with one --accent token,
 * a selected row and a hovered row want the same fill and become
 * indistinguishable. shadcn does not solve it with a second colour. It refuses
 * the premise: --accent marks the ONE row the pointer or keyboard is on, and
 * selection is carried by a check mark in a reserved gutter instead of by a
 * fill. Two channels, not two colours.
 *
 * Look at the checkbox and radio groups below with the keyboard: the check
 * stays where it is while the accent fill moves with the arrow keys. That is
 * the behaviour a static palette could not have shown, and it is why this page
 * exists rather than another swatch.
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
      <div className="mt-4 flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}

export default function MenuPage() {
  const [density, setDensity] = React.useState("comfortable");
  const [showThai, setShowThai] = React.useState(true);
  const [showEnglish, setShowEnglish] = React.useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-xl font-semibold tracking-tight">Dropdown menu</h1>
        <p className="text-base text-muted-foreground mt-2 max-w-prose">
          The real component on CCD tokens. It is the first thing to render{" "}
          <code className="font-mono">--accent</code> and{" "}
          <code className="font-mono">--accent-foreground</code>, and the first honest test of
          whether a selected row can be told apart from a hovered one.
        </p>

        <Section
          title="Row actions"
          note="Where a menu actually lives: at the end of a table row. Destructive is a variant of the item, tinted on focus rather than filled."
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="การจัดการ">
                  <MoreHorizontal />
                </Button>
              }
            />
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <UserPlus />
                เพิ่มผู้ตอบ
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download />
                ดาวน์โหลด CSV
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>ส่งซ้ำ (ยังไม่ปิดรอบ)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                ลบแบบสอบถาม
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Section
          title="Selection vs hover"
          note="Arrow-key through this. The check mark stays on what is chosen; the accent fill follows what is focused. One token, two meanings, no ambiguity — because they use different channels."
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">มุมมอง</Button>} />
            <DropdownMenuContent>
              {/* The label goes INSIDE its group, not above it. Base UI renders it as
                  the group's own GroupLabel and wires aria-labelledby from it, so a
                  loose label throws "MenuGroupContext is missing" rather than
                  rendering unlabelled — the accessible name is structural here, not
                  decorative. Cost one render on 2026-08-12. */}
              <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(String(v))}>
                <DropdownMenuLabel>ความหนาแน่น</DropdownMenuLabel>
                <DropdownMenuRadioItem value="comfortable">สบายตา</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="compact">กระชับ</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dense">แน่น</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>คอลัมน์</DropdownMenuLabel>
                <DropdownMenuCheckboxItem checked={showThai} onCheckedChange={setShowThai}>
                  ชื่อภาษาไทย
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showEnglish} onCheckedChange={setShowEnglish}>
                  ชื่อภาษาอังกฤษ
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Section
          title="Submenu"
          note="A submenu opens on hover with a delay and on ArrowRight from the keyboard, and its parent row stays lit while it is open. None of that is CSS."
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">ส่งออก</Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem>ส่งออกทั้งหมด</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>เลือกรูปแบบ</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>CSV</DropdownMenuItem>
                  <DropdownMenuItem>Excel</DropdownMenuItem>
                  <DropdownMenuItem>PDF</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>ตั้งเวลาส่งออก</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Section
          title="Thai at 14"
          note="Every item here is text-sm. This is exactly the size base-lyra would have set to 12 — read the two menus side by side and the floor stops being a rule and becomes obvious."
        >
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">ที่มีวรรณยุกต์และสระ</Button>} />
            <DropdownMenuContent>
              <DropdownMenuItem>ตั้งค่าผู้ใช้งาน</DropdownMenuItem>
              <DropdownMenuItem>รายงานฉบับย่อ</DropdownMenuItem>
              <DropdownMenuItem>ปรับปรุงข้อมูลพนักงาน</DropdownMenuItem>
              <DropdownMenuItem>สิทธิ์การเข้าถึงระดับผู้ดูแล</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>
      </div>
    </main>
  );
}
