/**
 * Fixture for the chase/monitor pattern. Authored, not imported.
 *
 * Same rule as the Likert fixture: the structure is copied from the real
 * fieldwork surface because that is what makes the layout hard; the content is
 * invented, because a real cohort is a list of named employees and their
 * assessment progress, which has no business sitting in the design system repo.
 *
 * What is copied from `ccd-brb-multi-rater`'s FieldworkTab, because each part is
 * a constraint the pattern has to survive:
 *
 *   - one row per person being assessed, with their unit beside their name
 *   - four rater groups plus self, each a done/total tally, not a single number
 *   - a cell has three renderings: nothing assigned, part done, all done
 *   - the interesting rows are the STALLED ones — nobody has answered at all —
 *     and they are what the whole surface exists to surface
 *   - real Thai names and unit names, which run long and carry tone marks
 *
 * The three axes:
 *
 *   density  short = 6 people · long = 34, a real wave size
 *   volume   empty = launched, nobody has answered yet · typical = mid-fieldwork
 *            with a few stalled · overflow = the longest names and units the
 *            HRIS actually holds, most complete
 *   lang     th | en
 */

export type RaterGroup = "self" | "manager" | "peer" | "report" | "other";

export const GROUPS: { key: RaterGroup; th: string; en: string }[] = [
  { key: "self", th: "ตนเอง", en: "Self" },
  { key: "manager", th: "หัวหน้า", en: "Manager" },
  { key: "peer", th: "เพื่อนร่วมงาน", en: "Peer" },
  { key: "report", th: "ผู้ใต้บังคับบัญชา", en: "Report" },
  { key: "other", th: "อื่น ๆ", en: "Other" },
];

export type Person = {
  id: string;
  nameTh: string;
  nameEn: string;
  unitTh: string | null;
  unitEn: string | null;
  /** done / total per group. A group with total 0 was never assigned. */
  tally: Record<RaterGroup, [done: number, total: number]>;
};

/* Invented names. Thai given names with the honorific dropped, as the real
   surface renders them, and unit names in the shape the HRIS uses — a ฝ่าย or
   สำนักงาน prefix that pushes the column wide. */
const BASE: Omit<Person, "tally">[] = [
  { id: "p1", nameTh: "ณัฐพงศ์ วิริยะกุล", nameEn: "Nattapong Wiriyakul", unitTh: "ฝ่ายทรัพยากรบุคคล", unitEn: "Human Resources" },
  { id: "p2", nameTh: "ศิริพร ธนาวัฒน์", nameEn: "Siriporn Thanawat", unitTh: "ฝ่ายการตลาด", unitEn: "Marketing" },
  { id: "p3", nameTh: "ปิยะวัฒน์ อินทรโชติ", nameEn: "Piyawat Intharachot", unitTh: "สำนักงานบัญชีและการเงิน", unitEn: "Accounting & Finance" },
  { id: "p4", nameTh: "กมลชนก แสงเพชร", nameEn: "Kamonchanok Saengphet", unitTh: "ฝ่ายผลิต", unitEn: "Production" },
  { id: "p5", nameTh: "ธีรภัทร ชูเกียรติ", nameEn: "Teerapat Chukiat", unitTh: "ฝ่ายวิศวกรรม", unitEn: "Engineering" },
  { id: "p6", nameTh: "อรุณี พงษ์สวัสดิ์", nameEn: "Arunee Pongsawat", unitTh: null, unitEn: null },
];

/* The long list repeats the six with new names rather than cloning rows, so a
   34-row table has the varied name lengths a real wave has — a table of one
   repeated string measures nothing about wrapping. */
const MORE: Omit<Person, "tally">[] = [
  { id: "p7", nameTh: "วรพล จันทร์เพ็ญ", nameEn: "Worapon Chanpen", unitTh: "ฝ่ายจัดซื้อ", unitEn: "Procurement" },
  { id: "p8", nameTh: "สุนิสา เรืองฤทธิ์", nameEn: "Sunisa Ruangrit", unitTh: "ฝ่ายคลังสินค้าและกระจายสินค้า", unitEn: "Warehouse & Distribution" },
  { id: "p9", nameTh: "อภิสิทธิ์ ก้องเกียรติ", nameEn: "Apisit Kongkiat", unitTh: "ฝ่ายขาย", unitEn: "Sales" },
  { id: "p10", nameTh: "ชนิกานต์ ทองสุข", nameEn: "Chanikan Thongsuk", unitTh: "ฝ่ายประกันคุณภาพ", unitEn: "Quality Assurance" },
  { id: "p11", nameTh: "ภาณุพงศ์ ศรีสมบัติ", nameEn: "Panupong Srisombat", unitTh: "ฝ่ายเทคโนโลยีสารสนเทศ", unitEn: "Information Technology" },
  { id: "p12", nameTh: "รัตนาภรณ์ ใจดี", nameEn: "Rattanaporn Jaidee", unitTh: "ฝ่ายกฎหมาย", unitEn: "Legal" },
];

/* The longest real values, for the overflow axis. Thai unit names in this
   company genuinely reach this length — the HRIS has them. */
const LONG = {
  nameTh: "ประกายเพชร ธนบดีวัฒนกุล",
  nameEn: "Prakaiphet Thanabodeewatanakul",
  unitTh: "สำนักงานพัฒนาองค์กรและทรัพยากรบุคคลกลาง",
  unitEn: "Central Organisational Development & Human Resources Office",
};

export type Volume = "empty" | "typical" | "overflow";
export type Density = "short" | "long";

/* Deterministic, so two renders of the same axes are comparable. A random
   fixture makes every screenshot a different question. */
function tallyFor(i: number, volume: Volume): Person["tally"] {
  const sizes: Record<RaterGroup, number> = {
    self: 1,
    manager: 1,
    peer: 3 + (i % 3),
    report: i % 4 === 0 ? 0 : 2 + (i % 3),
    other: i % 5 === 0 ? 2 : 0,
  };
  const mk = (g: RaterGroup): [number, number] => {
    const total = sizes[g];
    if (total === 0) return [0, 0];
    if (volume === "empty") return [0, total];
    if (volume === "overflow") return [total, total];
    /* typical: every fourth person is STALLED at zero — the row the surface
       exists to find. The rest are partly done, and self lags because people
       fill their own last. */
    if (i % 4 === 1) return [0, total];
    if (g === "self") return [i % 3 === 0 ? 1 : 0, total];
    return [Math.min(total, 1 + (i % total || 0)), total];
  };
  return {
    self: mk("self"),
    manager: mk("manager"),
    peer: mk("peer"),
    report: mk("report"),
    other: mk("other"),
  };
}

export function people(density: Density, volume: Volume): Person[] {
  const base = density === "short" ? BASE : [...BASE, ...MORE, ...BASE, ...MORE, ...BASE.slice(0, 4)];
  return base.map((p, i) => ({
    ...p,
    id: `${p.id}-${i}`,
    ...(volume === "overflow" && i % 3 === 0 ? LONG : {}),
    tally: tallyFor(i, volume),
  }));
}
