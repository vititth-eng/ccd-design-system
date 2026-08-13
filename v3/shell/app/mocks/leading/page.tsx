/**
 * A MOCK, and it lives on its own route for that reason.
 *
 * Vitit's rule, 2026-08-12: a mock never goes inside a reference page. The
 * Tokens page answers "what is true right now" and every row on it is a live
 * token; a comparison answers "what if it were otherwise", and half of what it
 * renders is deliberately not what ships. Put the two on one page and a reader
 * has to check each block to know which kind they are looking at — the exact
 * confusion the workbench exists to remove.
 *
 * This one has already done its job. It stays because a decision with its
 * evidence deleted gets re-opened by the next person to find the chrome roomy.
 */
const LEADING_ROWS = [
  { name: "ผู้จัดการฝ่ายบุคคล", meta: "ประเมินกลางปี · 31 ส.ค. 2569", value: "82%" },
  { name: "ทีมวิศวกรรมซอฟต์แวร์", meta: "รอบที่ 2 · ปิดรับ 14 ก.ย.", value: "76%" },
  { name: "ฝ่ายปฏิบัติการโรงงาน", meta: "ยังไม่เริ่ม · 40 ข้อ", value: "—" },
];

/**
 * Tailwind's own expressions — 1.25/0.875 for text-sm, 1/0.75 for text-xs,
 * 1.5/1 for text-base — computed rather than typed as decimals, so they stay
 * legible as the thing they came from. They go on as inline style because a
 * leading utility would lose to the class that sets the size, which is exactly
 * the pair being compared.
 */
const STOCK = { xs: 1 / 0.75, sm: 1.25 / 0.875, base: 1.5 / 1 };

/* Thai chosen for the marks rather than the meaning: ผู้ ฝ่าย ปี่ ซอฟต์ each
   stack something above the cap line or hang below the baseline. */
function Specimen({ stock }: { stock: boolean }) {
  const s = (r: number) => (stock ? { lineHeight: r } : undefined);
  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border px-4 py-3">
        <div className="text-base font-semibold" style={s(STOCK.base)}>
          แบบประเมินรอบกลางปี
        </div>
        <p className="text-sm text-muted-foreground mt-1" style={s(STOCK.sm)}>
          ผู้ประเมินต้องตอบให้ครบทุกข้อภายในรอบนี้ ระบบจะบันทึกอัตโนมัติทุกครั้งที่เปลี่ยนคำตอบ
        </p>
      </div>
      <div className="divide-y divide-border">
        {LEADING_ROWS.map((r) => (
          <div key={r.name} className="flex items-baseline gap-3 px-4 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-sm" style={s(STOCK.sm)}>
                {r.name}
              </div>
              <div className="text-xs text-muted-foreground" style={s(STOCK.xs)}>
                {r.meta}
              </div>
            </div>
            <div className="text-sm font-medium" style={s(STOCK.sm)}>
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeadingMockPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Leading — CCD against stock vega</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Identical markup, twice. Only line-height differs, so anything you see is the leading and
          nothing else.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-xs font-mono mb-2">
            CCD — type.css <span className="text-muted-foreground">· shipped</span>
          </div>
          <Specimen stock={false} />
        </div>
        <div>
          <div className="text-xs font-mono text-muted-foreground mb-2">
            stock Tailwind / vega · rejected
          </div>
          <Specimen stock />
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-sm">
          <span className="font-medium">Owner call, 2026-08-12: keep CCD&apos;s.</span> Stock is too
          tight for Thai.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Every <em>size</em> in v3 is Tailwind&apos;s ladder unmodified — leading is the only thing
          separating a CCD screen from a stock shadcn one. It runs looser at 12 and 14, where nearly
          all UI text lives, and tighter at 18 and 20, so the two ends move toward each other. The
          card on the left stands 291px against 273px.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Thai stacks tone marks above the cap line and hangs vowels below the baseline, so a
          Latin-tuned leading has the two colliding before a table is dense. The cost is named and
          accepted: a CCD screen runs about 6.6% taller than the same screen in stock vega.
          Tightening chrome back toward stock is not an optimisation waiting to be found — it is the
          column on the right, which was looked at and rejected.
        </p>
      </div>
    </div>
  );
}
