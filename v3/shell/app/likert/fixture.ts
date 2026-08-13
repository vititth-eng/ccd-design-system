/**
 * Fixture content for the Likert scene. Authored, not imported.
 *
 * It has to be authored because the real questionnaire lives in Supabase and
 * carries a client's cohort — real competency wording, real item numbering.
 * Reusing the STRUCTURE of that questionnaire is the point; reusing its content
 * would put a customer's assessment instrument in the design system repo.
 *
 * What is copied from the real one, because it is what makes the layout hard:
 *
 *   - a bold competency lead-in on every statement, so each row is two
 *     registers of text that have to wrap together
 *   - a five-point frequency scale where only three levels carry a description
 *   - Thai running 40% longer than the same sentence in English
 *
 * The three fixture axes map onto this pattern as:
 *
 *   density  short = 6 items on the screen · long = 40
 *   volume   empty = nothing answered yet · typical = ordinary statements,
 *            part-answered · overflow = the longest statements the instrument
 *            permits, all answered
 *   lang     th | en
 */

export type Level = {
  value: number;
  th: string;
  en: string;
  /** Only some levels are described. The scale key renders those and no others. */
  descTh?: string;
  descEn?: string;
};

export const SCALE: Level[] = [
  {
    value: 1,
    th: "ไม่เคย",
    en: "Never",
    descTh: "ไม่เคยเห็นพฤติกรรมนี้เลย",
    descEn: "Have never seen this behaviour",
  },
  { value: 2, th: "นาน ๆ ครั้ง", en: "Rarely" },
  {
    value: 3,
    th: "บางครั้ง",
    en: "Sometimes",
    descTh: "ทำบ้างในบางสถานการณ์ แต่ยังไม่สม่ำเสมอ",
    descEn: "Does it in some situations, but not consistently",
  },
  { value: 4, th: "บ่อยครั้ง", en: "Often" },
  {
    value: 5,
    th: "เป็นประจำ",
    en: "Always",
    descTh: "ทำอย่างสม่ำเสมอจนเป็นแบบอย่างให้ผู้อื่น",
    descEn: "Does it consistently enough to be a model for others",
  },
];

export type Item = {
  /** The competency term, printed as a bold lead-in the way the paper form does. */
  leadTh: string;
  leadEn: string;
  th: string;
  en: string;
};

/** Ordinary statements — the `typical` volume. */
export const ITEMS: Item[] = [
  {
    leadTh: "การสื่อสาร",
    leadEn: "Communication",
    th: "สื่อสารเป้าหมายของทีมให้ทุกคนเข้าใจตรงกัน",
    en: "Communicates the team's goals so everyone understands them the same way",
  },
  {
    leadTh: "การมอบหมายงาน",
    leadEn: "Delegation",
    th: "มอบหมายงานโดยระบุผลลัพธ์ที่คาดหวังอย่างชัดเจน",
    en: "Delegates work with the expected outcome stated clearly",
  },
  {
    leadTh: "การให้ข้อมูลป้อนกลับ",
    leadEn: "Feedback",
    th: "ให้ข้อมูลป้อนกลับแก่ทีมงานอย่างตรงไปตรงมาและทันเวลา",
    en: "Gives the team feedback that is direct and timely",
  },
  {
    leadTh: "การตัดสินใจ",
    leadEn: "Decision-making",
    th: "ตัดสินใจบนพื้นฐานของข้อมูลมากกว่าความรู้สึกส่วนตัว",
    en: "Decides from evidence rather than personal feeling",
  },
  {
    leadTh: "การพัฒนาคน",
    leadEn: "Developing people",
    th: "สนับสนุนให้ทีมงานได้เรียนรู้สิ่งใหม่นอกเหนือจากงานประจำ",
    en: "Supports the team in learning beyond their routine work",
  },
  {
    leadTh: "การรับฟัง",
    leadEn: "Listening",
    th: "รับฟังความเห็นที่แตกต่างโดยไม่ตัดบทกลางคัน",
    en: "Hears out a dissenting view without cutting it short",
  },
  {
    leadTh: "การวางแผน",
    leadEn: "Planning",
    th: "วางแผนงานล่วงหน้าและเผื่อเวลาสำหรับสิ่งที่ไม่คาดคิด",
    en: "Plans ahead and leaves room for the unexpected",
  },
  {
    leadTh: "การแก้ปัญหา",
    leadEn: "Problem-solving",
    th: "แก้ปัญหาที่ต้นเหตุแทนการแก้ที่ปลายทาง",
    en: "Fixes the cause rather than the symptom",
  },
  {
    leadTh: "ความรับผิดชอบ",
    leadEn: "Accountability",
    th: "รับผิดชอบต่อผลงานของทีมโดยไม่โยนความผิดให้ผู้อื่น",
    en: "Owns the team's results without pushing blame elsewhere",
  },
  {
    leadTh: "การทำงานเป็นทีม",
    leadEn: "Teamwork",
    th: "ประสานงานกับหน่วยงานอื่นเพื่อให้งานเดินหน้า",
    en: "Coordinates with other functions to keep work moving",
  },
  {
    leadTh: "การบริหารเวลา",
    leadEn: "Prioritisation",
    th: "จัดลำดับความสำคัญของงานได้เหมาะสมกับสถานการณ์",
    en: "Prioritises work appropriately for the situation",
  },
  {
    leadTh: "การสร้างแรงจูงใจ",
    leadEn: "Motivation",
    th: "ชื่นชมผลงานที่ดีของทีมงานอย่างเป็นรูปธรรม",
    en: "Recognises good work in concrete terms",
  },
  {
    leadTh: "การปรับตัว",
    leadEn: "Adaptability",
    th: "ปรับวิธีการทำงานเมื่อสถานการณ์เปลี่ยนไป",
    en: "Changes how the work is done when the situation changes",
  },
  {
    leadTh: "ความซื่อสัตย์",
    leadEn: "Integrity",
    th: "ปฏิบัติตามกฎระเบียบขององค์กรอย่างเคร่งครัด",
    en: "Follows the organisation's rules without exception",
  },
  {
    leadTh: "การสอนงาน",
    leadEn: "Coaching",
    th: "สอนงานให้ทีมงานทำได้ด้วยตนเองแทนการทำแทน",
    en: "Teaches the team to do the work rather than doing it for them",
  },
  {
    leadTh: "การบริหารความขัดแย้ง",
    leadEn: "Managing conflict",
    th: "จัดการความขัดแย้งในทีมอย่างเป็นธรรม",
    en: "Handles conflict inside the team fairly",
  },
  {
    leadTh: "การมองภาพรวม",
    leadEn: "Big picture",
    th: "เชื่อมโยงงานของทีมเข้ากับเป้าหมายขององค์กร",
    en: "Connects the team's work to the organisation's goals",
  },
  {
    leadTh: "การใช้ทรัพยากร",
    leadEn: "Resourcefulness",
    th: "ใช้ทรัพยากรที่มีอยู่อย่างคุ้มค่า",
    en: "Gets full value out of the resources on hand",
  },
  {
    leadTh: "การติดตามงาน",
    leadEn: "Follow-through",
    th: "ติดตามความคืบหน้าของงานอย่างสม่ำเสมอ",
    en: "Follows up on progress consistently",
  },
  {
    leadTh: "การกล้าตัดสินใจ",
    leadEn: "Decisiveness",
    th: "กล้าตัดสินใจในเรื่องยากโดยไม่ผัดผ่อน",
    en: "Makes the hard call without putting it off",
  },
];

/**
 * The `overflow` volume: statements at the long end of what the instrument
 * allows. Six, not twenty, because past the second one every row is already
 * showing the same thing — how many lines a statement wraps to and whether the
 * five circles still sit where the eye expects them.
 */
export const LONG_ITEMS: Item[] = [
  {
    leadTh: "การให้ข้อมูลป้อนกลับ",
    leadEn: "Feedback",
    th: "ให้ข้อมูลป้อนกลับแก่ทีมงานทั้งในเรื่องที่ทำได้ดีและเรื่องที่ต้องปรับปรุง โดยอ้างอิงจากพฤติกรรมที่สังเกตได้จริง ไม่ใช่ความรู้สึกส่วนตัว และเลือกจังหวะเวลาที่ผู้รับพร้อมจะรับฟัง",
    en: "Gives the team feedback on both what went well and what needs to change, grounded in behaviour that was actually observed rather than personal impression, and picks a moment when the person is ready to hear it",
  },
  {
    leadTh: "การมอบหมายงาน",
    leadEn: "Delegation",
    th: "มอบหมายงานให้เหมาะกับความสามารถและภาระงานของแต่ละคน พร้อมระบุผลลัพธ์ที่คาดหวัง กรอบเวลา และขอบเขตการตัดสินใจที่ผู้รับมอบหมายมีสิทธิ์ทำได้เอง",
    en: "Delegates in a way that fits each person's capability and current load, stating the expected outcome, the timeframe, and how far they may decide on their own",
  },
  {
    leadTh: "การบริหารความขัดแย้ง",
    leadEn: "Managing conflict",
    th: "เมื่อเกิดความขัดแย้งภายในทีมหรือระหว่างหน่วยงาน เข้าไปรับฟังทุกฝ่ายก่อนสรุป และหาทางออกที่ทุกฝ่ายรับได้โดยยึดประโยชน์ขององค์กรเป็นหลัก",
    en: "When conflict arises inside the team or between functions, hears every side before concluding and finds a resolution all sides can accept, with the organisation's interest as the deciding test",
  },
  {
    leadTh: "การพัฒนาคน",
    leadEn: "Developing people",
    th: "วางแผนพัฒนาทีมงานเป็นรายบุคคลโดยดูจากจุดแข็งและสิ่งที่ต้องพัฒนาของแต่ละคน และติดตามผลอย่างต่อเนื่องแทนการส่งไปอบรมตามรอบปี",
    en: "Plans development person by person from their individual strengths and gaps, and follows the results through, rather than sending everyone on the annual course",
  },
  {
    leadTh: "การตัดสินใจ",
    leadEn: "Decision-making",
    th: "ตัดสินใจในสถานการณ์ที่ข้อมูลไม่ครบถ้วนได้ โดยชั่งน้ำหนักความเสี่ยงกับโอกาส และอธิบายเหตุผลเบื้องหลังการตัดสินใจให้ทีมงานเข้าใจ",
    en: "Can decide when the information is incomplete, weighing the risk against the opportunity, and explains the reasoning behind the decision so the team understands it",
  },
  {
    leadTh: "การสื่อสาร",
    leadEn: "Communication",
    th: "สื่อสารเรื่องที่ยากหรือเรื่องที่ไม่เป็นที่พอใจกับทีมงานอย่างตรงไปตรงมา โดยไม่ปล่อยให้ข้อมูลคลาดเคลื่อนไปตามข่าวลือ",
    en: "Delivers difficult or unwelcome news to the team directly, rather than letting the account drift into rumour",
  },
];

/** The screen's own copy — chrome in English, questionnaire content in Thai. */
export const COPY = {
  stem: {
    th: "ท่านคิดว่าในปัจจุบันนี้ ผู้ถูกประเมิน ได้ทำพฤติกรรมแต่ละข้อต่อไปนี้ ในระดับใด",
    en: "In your view, how often does the person you are rating do each of the following?",
  },
  dimension: {
    th: "การบริหารทีมงาน",
    en: "Leading the team",
  },
  assessee: {
    th: "สมชาย ใจดี",
    en: "Somchai Jaidee",
  },
  fn: { th: "ฝ่ายปฏิบัติการ", en: "Operations" },
};

/**
 * ๆ is a repetition mark bound to the word before it and must never begin a
 * line. No CSS property expresses that, so the space in front of it becomes a
 * hard space. Carried over from the live rater form, where it is applied to
 * every Thai string at render time — and it belongs to the pattern, not to that
 * app: any CCD screen printing authored Thai has the same rule.
 */
export function bindThai(text: string): string {
  return text.replace(/ ๆ/g, " ๆ");
}
