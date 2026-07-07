// Canonical bilingual term list for all CCD apps.
// One concept -> one Thai word, at the house register (professional, pronoun-light).
// Doctrine: workspace wiki `thai-house-style`. Composition guard: `thai-native` skill.
//
// SCOPE: shared UI verbs + common HR / 360 domain terms only.
//   NOT here: SLC framework & competency names -> verbatim source (wiki `slc-framework`),
//             never normalized. App-only domain terms live in that app's own i18n, not here.
//   Grow per build: add a term when a SECOND surface needs it; never pre-fill speculatively.

export type Term = { en: string; th: string };

export const glossary = {
  // --- 360 rater roles (register confirmed 2026-07-07: formal, leadership-report) ---
  self:         { en: 'Self',        th: 'ตนเอง' },
  supervisor:   { en: 'Supervisor',  th: 'ผู้บังคับบัญชา' },
  peer:         { en: 'Peer',        th: 'เพื่อนร่วมงาน' },
  subordinate:  { en: 'Subordinate', th: 'ผู้ใต้บังคับบัญชา' },
  rater:        { en: 'Rater',       th: 'ผู้ร่วมประเมิน' }, // umbrella: any of the four groups

  // --- survey / HR domain ---
  respondent:   { en: 'Respondent',  th: 'ผู้ตอบแบบสอบถาม' },
  sendReminder: { en: 'Send reminder', th: 'ส่งการแจ้งเตือน' },
  effective:    { en: 'Effective',   th: 'เห็นผล' },
} as const satisfies Record<string, Term>;

export type GlossaryKey = keyof typeof glossary;
