"use client";

import * as React from "react";

/**
 * A size, two lines of Thai, and the line box it actually got.
 *
 * The number is MEASURED off the rendered element rather than read from a
 * table, because a table would be a copy of type.css that keeps agreeing with
 * it right up until it does not. If the ladder changes, this changes with it;
 * if a size fails to compile, this reads the inherited value and says so by
 * disagreeing with its own label.
 *
 * Two lines rather than one on purpose — leading is a gap between lines, and a
 * single line has no gap to look at.
 */
export function LeadingRow({ cls, note }: { cls: string; note: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [measured, setMeasured] = React.useState("");

  React.useEffect(() => {
    if (!ref.current) return;
    const s = getComputedStyle(ref.current);
    const size = parseFloat(s.fontSize);
    const line = parseFloat(s.lineHeight);
    setMeasured(`${s.fontSize} · ${s.lineHeight} · ${(line / size).toFixed(2)}×`);
  }, []);

  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-xs font-mono text-muted-foreground w-20 shrink-0">{cls}</span>
        <span className="text-xs font-mono text-muted-foreground">{measured || "—"}</span>
      </div>
      <p ref={ref} className={`${cls} mt-1 max-w-prose`}>
        ผู้ประเมินต้องตอบให้ครบทุกข้อภายในรอบนี้
        <br />
        ระบบจะบันทึกอัตโนมัติทุกครั้งที่เปลี่ยนคำตอบ
      </p>
      <div className="text-xs text-muted-foreground mt-1">{note}</div>
    </div>
  );
}
