/**
 * src/gcse_exam_spec_hub.js
 *
 * Unified Year 11 "GCSE Exam & Spec Hub" Command Centre (Desktop + Mobile Parity).
 * Combines:
 *  - Tab 1 (Pupil Default): Interactive Paper Structure Blueprint + Quick Question & Grade 9 WAGOLL Trainer
 *  - Tab 2: Interactive Atomic Specification Checklist & Left-to-Right Spotlight Mind Map + Prove-It Green
 *  - Tab 3 (Auto-first in Staff Mode): Full Mock Examination Papers, A4 Print PDFs, Past Portal & Trend Matrix
 *  - Addition #4: "15-Minute Pre-Exam Rescue" Guided Sprint Modal
 */

import './gcse_exam_spec_hub.css';
import { state } from './state.js';
import { ensureUnitLoaded } from './storage.js';
import { isStaffModeActive } from './data/unit_resources_catalog.js';
import {
  GCSE_EXAM_COURSES,
  getPinnedGcseCourseIds,
  resolveGcseExamUnitId,
  getGcseCourseMeta,
  buildUnitExamDirectory,
} from './engine/mobile_exam_adapter.js';
import {
  renderMobileExamTrainer,
  stopExamTrainerAudioAndTimers,
} from './mobile_exam_trainer.js';
import {
  renderSpecExplorerMindMap,
  loadUnitSpecTree,
  closeSpecOverlays,
} from './spec_explorer_mindmap.js';
import { computeSpecTreeProgress } from './spec_status_store.js';

/**
 * Canonical Pearson Edexcel GCSE (9–1) Paper Blueprints across all 6 Hub GCSE courses.
 */
const PAPER_BLUEPRINTS = {
  cme_new: {
    code: '1HI0/P5',
    paperTitle: 'Paper 2 (Booklet P): Conflict in the Middle East, 1945–95',
    duration: '55 Mins',
    marks: '32 Marks (0 SPaG · 20% of GCSE)',
    sittingAlert:
      'Combined Sitting (1h 50m total): You sit Booklet B (British Depth, 55m) + Booklet P (Middle East, 55m) back-to-back. Stop strictly at 55 mins!',
    pairedUnitId: 'eee',
    pairedLabel: 'Flip to Elizabeth (Booklet B) ↗',
    choiceAlert:
      'Q3 Choice Rule: Pick ONLY 2 out of the 3 options on Question 3 — never waste time answering all 3!',
    slots: [
      {
        id: 'p2p_q1',
        qNum: 'Q1',
        marksLabel: '8m (2 × 4m) · 12 mins',
        stem: 'Explain two consequences of…',
        formula: '2 separate 4m paragraphs: state consequence + 2–3 sentences of specific aftermath.',
        families: ['consequence_4', 'consequence_8'],
      },
      {
        id: 'p2p_q2',
        qNum: 'Q2',
        marksLabel: '8m · 15 mins',
        stem: 'Write a narrative account analysing…',
        formula: '3 chronological stages (Beginning → Catalyst → Outcome) linked by "Consequently" + own knowledge.',
        families: ['narrative'],
      },
      {
        id: 'p2p_q3',
        qNum: 'Q3 (Pick 2 of 3)',
        marksLabel: '16m (2 × 8m) · 28 mins',
        stem: 'Explain two: the importance of X for Y…',
        formula: 'Choose 2 of 3! Every paragraph must link X directly to the second half ("for Y").',
        families: ['importance'],
      },
    ],
  },
  gcse_cold_war: {
    code: '1HI0/P4',
    paperTitle: 'Paper 2 (Booklet P): Superpower Relations & the Cold War, 1941–91',
    duration: '55 Mins',
    marks: '32 Marks (0 SPaG · 20% of GCSE)',
    sittingAlert:
      'Combined Sitting (1h 50m total): You sit Booklet B (British Depth, 55m) + Booklet P (Cold War, 55m) back-to-back. Stop strictly at 55 mins!',
    pairedUnitId: 'eee',
    pairedLabel: 'Flip to Elizabeth (Booklet B) ↗',
    choiceAlert:
      'Q3 Choice Rule: Pick ONLY 2 out of the 3 options on Question 3 — never answer all 3!',
    slots: [
      {
        id: 'cw_q1',
        qNum: 'Q1',
        marksLabel: '8m (2 × 4m) · 12 mins',
        stem: 'Explain two consequences of…',
        formula: '2 separate 4m paragraphs: state consequence + specific superpower impact.',
        families: ['consequence_4', 'consequence_8'],
      },
      {
        id: 'cw_q2',
        qNum: 'Q2',
        marksLabel: '8m · 15 mins',
        stem: 'Write a narrative account analysing…',
        formula: '3 linked stages (Beginning → Catalyst → Outcome) using causal connectives + own knowledge.',
        families: ['narrative'],
      },
      {
        id: 'cw_q3',
        qNum: 'Q3 (Pick 2 of 3)',
        marksLabel: '16m (2 × 8m) · 28 mins',
        stem: 'Explain two: the importance of X for Y…',
        formula: 'Choose 2 of 3! Link every paragraph directly to superpower relations / tensions.',
        families: ['importance'],
      },
    ],
  },
  eee: {
    code: '1HI0/B4',
    paperTitle: 'Paper 2 (Booklet B): Early Elizabethan England, 1558–88',
    duration: '55 Mins',
    marks: '32 Marks (0 SPaG · 20% of GCSE)',
    sittingAlert:
      'Combined Sitting (1h 50m total): You sit Booklet B (Elizabeth, 55m) back-to-back with Booklet P (Middle East or Cold War, 55m)!',
    pairedUnitId: 'cme_new',
    pairedLabel: 'Flip to Middle East (Booklet P) ↗',
    choiceAlert:
      '16-Mark Essay Choice: Answer EITHER the first OR second 16-mark essay — NEVER both! (0 SPaG on Paper 2).',
    slots: [
      {
        id: 'eee_q1',
        qNum: 'Q1(a) & (b)',
        marksLabel: '4m (2 + 2m) · 6 mins',
        stem: 'Describe one feature of… (×2)',
        formula: '2 crisp sentences per feature: name valid feature [1m] + specific factual detail [1m].',
        families: ['features'],
      },
      {
        id: 'eee_q2',
        qNum: 'Q1(c) / Q2',
        marksLabel: '12m · 18 mins',
        stem: 'Explain why…',
        formula: '3 PEEL paragraphs explaining WHY (must include own knowledge beyond the 2 bullets).',
        families: ['causation'],
      },
      {
        id: 'eee_q3',
        qNum: '16m (Pick 1 of 2)',
        marksLabel: '16m (0 SPaG) · 30 mins',
        stem: '‘Statement.’ How far do you agree?',
        formula: 'Choose 1 essay only! Weigh FOR vs AGAINST across 3 paragraphs + sustained judgement.',
        families: ['verdict'],
      },
    ],
  },
  edexcel_medicine: {
    code: '1HI0/11',
    paperTitle: 'Paper 1: Medicine in Britain, c1250–present & Western Front, 1914–18',
    duration: '1h 20m',
    marks: '52 Marks (incl. +4 SPaG · 30% of GCSE)',
    sittingAlert:
      'Two Sections in One Booklet: Spend 25 mins on Section A (Western Front Sources, 16m) and 55 mins on Section B (Thematic Medicine, 36m).',
    pairedUnitId: null,
    pairedLabel: '',
    choiceAlert:
      'Q5 OR Q6 Choice + SPaG: Answer EITHER Q5 OR Q6 (never both!) — worth 16m + 4 SPaG = 20 marks!',
    slots: [
      {
        id: 'med_q1',
        qNum: 'Q1(a)&(b)',
        marksLabel: '4m (2+2m) · 5m',
        stem: 'Describe one feature of… (Western Front)',
        formula: '2 sentences per feature: identify feature + specific Western Front detail.',
        families: ['features'],
      },
      {
        id: 'med_q2a',
        qNum: 'Q2(a)',
        marksLabel: '8m · 14m',
        stem: 'How useful are Sources A & B for an enquiry…?',
        formula: 'Judge BOTH sources on Content + Provenance + Own Western Front knowledge.',
        families: ['utility'],
      },
      {
        id: 'med_q2b',
        qNum: 'Q2(b)',
        marksLabel: '4m · 6m',
        stem: 'How could you follow up Source A/B…?',
        formula: 'Quote detail → focused question → specific WW1 record (e.g. RAMC diary) → how it helps.',
        families: ['followup'],
      },
      {
        id: 'med_q3',
        qNum: 'Q3',
        marksLabel: '4m · 6m',
        stem: 'Explain one way X was similar/different…',
        formula: 'Identify clear similarity/difference + specific detail from BOTH named eras.',
        families: ['comparison'],
      },
      {
        id: 'med_q4',
        qNum: 'Q4',
        marksLabel: '12m · 18m',
        stem: 'Explain why…',
        formula: '3 thematic PEEL paragraphs explaining WHY change/continuity occurred + own factor.',
        families: ['causation'],
      },
      {
        id: 'med_q56',
        qNum: 'Q5 OR Q6',
        marksLabel: '16m + 4 SPaG · 30m',
        stem: '‘Statement.’ How far do you agree?',
        formula: 'Pick Q5 OR Q6! Weigh named factor vs 2 other factors across the period + criteria verdict.',
        families: ['verdict'],
      },
    ],
  },
  weimar_nazi_germany: {
    code: '1HI0/31',
    paperTitle: 'Paper 3: Weimar and Nazi Germany, 1918–39',
    duration: '1h 30m',
    marks: '52 Marks (incl. +4 SPaG · 30% of GCSE)',
    sittingAlert:
      'Two Booklets on Your Desk: Question Booklet + Separate Sources & Interpretations Booklet. Spend 25m on Sec A and 65m on Sec B!',
    pairedUnitId: null,
    pairedLabel: '',
    choiceAlert:
      'No Optional Questions: Answer ALL 6 parts (Q1 to Q3d). Protect 34 mins at the end for Q3(d) (16m + 4 SPaG = 20 marks)!',
    slots: [
      {
        id: 'wng_q1',
        qNum: 'Q1',
        marksLabel: '4m · 6m',
        stem: 'Give two things you can infer from Source A…',
        formula: '2 supported inferences: valid deduction [1m] + quote/detail from Source A [1m].',
        families: ['inference'],
      },
      {
        id: 'wng_q2',
        qNum: 'Q2',
        marksLabel: '12m · 18m',
        stem: 'Explain why…',
        formula: '3 PEEL paragraphs explaining WHY (include own knowledge beyond the 2 bullets).',
        families: ['causation'],
      },
      {
        id: 'wng_q3a',
        qNum: 'Q3(a)',
        marksLabel: '8m · 14m',
        stem: 'How useful are Sources B & C for an enquiry…?',
        formula: 'Evaluate Content + Provenance + Own Knowledge for BOTH Source B and Source C.',
        families: ['utility'],
      },
      {
        id: 'wng_q3b',
        qNum: 'Q3(b)',
        marksLabel: '4m · 6m',
        stem: 'What is the main difference between Interps 1 & 2?',
        formula: 'State contrasting overall view of Interp 1 + quote vs overall view of Interp 2 + quote.',
        families: ['interp_diff'],
      },
      {
        id: 'wng_q3c',
        qNum: 'Q3(c)',
        marksLabel: '4m · 6m',
        stem: 'Suggest one reason why Interps 1 & 2 differ',
        formula: 'Historians weighted different sources (link Interp 1 to Source B/C & Interp 2 to the other).',
        families: ['interp_why'],
      },
      {
        id: 'wng_q3d',
        qNum: 'Q3(d)',
        marksLabel: '16m + 4 SPaG · 34m',
        stem: 'How far do you agree with Interpretation 2…?',
        formula: 'Quote & evaluate Interp 2 + counter with Interp 1 + deep own knowledge + verdict.',
        families: ['interp_verdict', 'verdict'],
      },
    ],
  },
  usa: {
    code: '1HI0/33',
    paperTitle: 'Paper 3: The USA, 1954–75: Conflict at Home and Abroad',
    duration: '1h 30m',
    marks: '52 Marks (incl. +4 SPaG · 30% of GCSE)',
    sittingAlert:
      'Two Booklets on Your Desk: Section A tests Civil Rights or Vietnam (Q1–Q2, 25m) & Section B tests the other half (Q3a–Q3d, 65m).',
    pairedUnitId: null,
    pairedLabel: '',
    choiceAlert:
      'No Optional Questions: Answer ALL 6 parts (Q1 to Q3d). Protect 34 mins at the end for Q3(d) (16m + 4 SPaG = 20 marks)!',
    slots: [
      {
        id: 'usa_q1',
        qNum: 'Q1',
        marksLabel: '4m · 6m',
        stem: 'Give two things you can infer from Source A…',
        formula: '2 supported inferences: valid deduction [1m] + quote/detail from Source A [1m].',
        families: ['inference'],
      },
      {
        id: 'usa_q2',
        qNum: 'Q2',
        marksLabel: '12m · 18m',
        stem: 'Explain why…',
        formula: '3 PEEL paragraphs explaining WHY (include own knowledge beyond the 2 bullets).',
        families: ['causation'],
      },
      {
        id: 'usa_q3a',
        qNum: 'Q3(a)',
        marksLabel: '8m · 14m',
        stem: 'How useful are Sources B & C for an enquiry…?',
        formula: 'Evaluate Content + Provenance + Own Knowledge for BOTH Source B and Source C.',
        families: ['utility'],
      },
      {
        id: 'usa_q3b',
        qNum: 'Q3(b)',
        marksLabel: '4m · 6m',
        stem: 'What is the main difference between Interps 1 & 2?',
        formula: 'State contrasting overall view of Interp 1 + quote vs overall view of Interp 2 + quote.',
        families: ['interp_diff'],
      },
      {
        id: 'usa_q3c',
        qNum: 'Q3(c)',
        marksLabel: '4m · 6m',
        stem: 'Suggest one reason why Interps 1 & 2 differ',
        formula: 'Historians gave weight to different primary sources (link Interps 1 & 2 to Sources B & C).',
        families: ['interp_why'],
      },
      {
        id: 'usa_q3d',
        qNum: 'Q3(d)',
        marksLabel: '16m + 4 SPaG · 34m',
        stem: 'How far do you agree with Interpretation 2…?',
        formula: 'Quote & evaluate Interp 2 + counter with Interp 1 + deep own knowledge + verdict.',
        families: ['interp_verdict', 'verdict'],
      },
    ],
  },
  ocr_persian_empire: {
    code: 'J198/01 Sec A',
    paperTitle: 'OCR Paper 1 (Section A): The Persian Empire, 559–465 BC',
    duration: '65 Mins (of 2h Paper)',
    marks: '60 Marks (incl. +5 SPaG · 27.5% of GCSE)',
    sittingAlert:
      'Combined Paper (J198/01 · 2h total): Spend ~65 mins on Section A (Persian Empire, 60m) and ~55 mins on your Greek Depth Study (Alexander, 45m). Zero modern historians (AO4 = 0%)!',
    pairedUnitId: 'ocr_alexander',
    pairedLabel: 'Flip to Alexander (Section D) ↗',
    choiceAlert:
      'Q5 Choice + Classical SPaG (+5m): Answer ONE of the two Q5 essays (never both!). On Q3 & Q4 (Passage A), NO author/provenance evaluation is required — and you CAN reuse Q3 quotes in Q4!',
    slots: [
      {
        id: 'pers_q1',
        qNum: 'Q1(a)–(c)',
        marksLabel: '4m · 4 mins',
        stem: 'Name / Identify / Give two…',
        formula: '3 rapid factual recall sub-questions: crisp classical names, places, or dates BC.',
        families: ['features', 'ocr_discrete_5'],
      },
      {
        id: 'pers_q2',
        qNum: 'Q2',
        marksLabel: '6m · 7 mins',
        stem: 'Outline the main features / events of…',
        formula: 'Continuous prose (no bullet lists!): 3 developed features/events with specific dates/names.',
        families: ['ocr_outline_6'],
      },
      {
        id: 'pers_q3',
        qNum: 'Q3 (Passage A)',
        marksLabel: '10m · 12 mins',
        stem: 'Using details from Passage A, evaluate how accurate / convincing…',
        formula: '2 "direct quotes" from Passage A tested against accurate own historical knowledge (0 provenance needed).',
        families: ['ocr_passage_10'],
      },
      {
        id: 'pers_q4',
        qNum: 'Q4 (Passage A)',
        marksLabel: '15m · 17 mins',
        stem: 'Using details from Passage A and your own knowledge, explain…',
        formula: 'Embed "direct quotes" from Passage A + wider own knowledge across the reign + causal/significance verdict.',
        families: ['ocr_passage_15'],
      },
      {
        id: 'pers_q5',
        qNum: 'Q5* (Pick 1 of 2)',
        marksLabel: '20m + 5 SPaG · 25 mins',
        stem: '‘Statement.’ How far do you agree?',
        formula: 'Pick 1 essay! Pure AO1 + AO2 balanced argument across 3 paragraphs + sustained verdict + accurate classical spellings.',
        families: ['ocr_period_essay'],
      },
    ],
  },
  ocr_alexander: {
    code: 'J198/01 Sec D',
    paperTitle: 'OCR Paper 1 (Section D): Alexander the Great, 356–323 BC',
    duration: '55 Mins (of 2h Paper)',
    marks: '45 Marks (0 SPaG · 22.5% of GCSE)',
    sittingAlert:
      'Combined Paper (J198/01 · 2h total): Sit after Section A (Persian Empire). Every source printed in Section D comes strictly from your OCR Prescribed Set Sources!',
    pairedUnitId: 'ocr_persian_empire',
    pairedLabel: 'Flip to Persian Empire (Section A) ↗',
    choiceAlert:
      'Q20* Set-Source Essay Rule (20m): HALF the marks (10/20) are for AO3 evaluation of 2–3 Prescribed Ancient Sources (quote literary set texts + 1 coin/artefact & evaluate provenance in context)!',
    slots: [
      {
        id: 'alex_q16',
        qNum: 'Q16(a)–(c)',
        marksLabel: '5m · 5 mins',
        stem: 'Identify / Name / State…',
        formula: 'Rapid factual recall across sub-parts (a)–(c) using exact Macedonian/Persian names and dates BC.',
        families: ['ocr_discrete_5', 'features'],
      },
      {
        id: 'alex_q17',
        qNum: 'Q17 (Set Source)',
        marksLabel: '5m (AO3) · 6 mins',
        stem: 'What can we learn from Passage / Source B about…?',
        formula: '2 supported deductions anchored in "direct quotes" or specific visual details on the coin/relief.',
        families: ['ocr_learn_5'],
      },
      {
        id: 'alex_q18',
        qNum: 'Q18 (Set Source)',
        marksLabel: '5m (AO3) · 6 mins',
        stem: 'Using details from Passage / Source B, how accurate do you think…?',
        formula: 'Quote detail + evaluate Plutarch/Arrian/Diodorus’ sources, genre, or royal propaganda in context.',
        families: ['ocr_accuracy_5'],
      },
      {
        id: 'alex_q19',
        qNum: 'Q19',
        marksLabel: '10m (AO1+AO2) · 12 mins',
        stem: 'Explain the significance / why…',
        formula: '2 developed analytical paragraphs (5 AO1 + 5 AO2 — zero AO3 source evaluation required here!).',
        families: ['ocr_depth_explain_10'],
      },
      {
        id: 'alex_q20',
        qNum: 'Q20* (Pick 1 of 2)',
        marksLabel: '20m (10m AO3!) · 26 mins',
        stem: '‘Statement.’ How far do you agree? You must use ancient sources you have studied.',
        formula: 'Pick 1 essay! Deploy 2–3 Prescribed Set Sources (literary + coin/artefact) with provenance evaluation + balanced verdict.',
        families: ['ocr_depth_essay'],
      },
    ],
  },
  ocr_foundations_of_rome: {
    code: 'J198/02 Sec A',
    paperTitle: 'OCR Paper 2 (Section A): Foundations of Rome, 753–440 BC',
    duration: '65 Mins (of 2h Paper)',
    marks: '60 Marks (incl. +5 SPaG · 27.5% of GCSE)',
    sittingAlert:
      'Combined Paper (J198/02 · 2h total): Spend ~65 mins on Section A (Foundations of Rome, 60m) and ~55 mins on Section C (Cleopatra, 45m).',
    pairedUnitId: 'ocr_cleopatra',
    pairedLabel: 'Flip to Cleopatra (Section C) ↗',
    choiceAlert:
      'Multi-Era Q5 Rule: Your 20-mark (+5 SPaG) essay MUST span at least TWO distinct eras across 753–440 BC (e.g. Legendary Kings vs Etruscan Kings vs Early Republic)!',
    slots: [
      {
        id: 'rome_q1',
        qNum: 'Q1(a)–(c)',
        marksLabel: '4m · 4 mins',
        stem: 'Name / Identify / State…',
        formula: 'Crisp factual recall of Roman kings, laws, hills, and dates BC.',
        families: ['features', 'ocr_discrete_5'],
      },
      {
        id: 'rome_q2',
        qNum: 'Q2',
        marksLabel: '6m · 7 mins',
        stem: 'Outline the main features / events of…',
        formula: 'Continuous prose: 3 developed features/events with specific Roman names, laws, or dates BC.',
        families: ['ocr_outline_6'],
      },
      {
        id: 'rome_q3',
        qNum: 'Q3 (Passage A)',
        marksLabel: '10m · 12 mins',
        stem: 'Using details from Passage A, evaluate how accurate / convincing…',
        formula: '2 "direct quotes" from Livy/Dionysius Passage A tested against archaeological & historical knowledge.',
        families: ['ocr_passage_10'],
      },
      {
        id: 'rome_q4',
        qNum: 'Q4 (Passage A)',
        marksLabel: '15m · 17 mins',
        stem: 'Using details from Passage A and your own knowledge, explain…',
        formula: 'Embed "direct quotes" from Passage A + wider own knowledge + archaeological corroboration.',
        families: ['ocr_passage_15'],
      },
      {
        id: 'rome_q5',
        qNum: 'Q5* (Pick 1 of 2)',
        marksLabel: '20m + 5 SPaG · 25 mins',
        stem: '‘Statement.’ How far do you agree? (Span >= 2 eras!)',
        formula: 'Pick 1 essay! Compare at least TWO eras across 753–440 BC + sustained verdict + accurate Roman SPaG.',
        families: ['ocr_period_essay'],
      },
    ],
  },
  ocr_cleopatra: {
    code: 'J198/02 Sec C',
    paperTitle: 'OCR Paper 2 (Section C): Cleopatra — Rome and Egypt, 69–30 BC',
    duration: '55 Mins (of 2h Paper)',
    marks: '45 Marks (0 SPaG · 22.5% of GCSE)',
    sittingAlert:
      'Combined Paper (J198/02 · 2h total): Sit after Section A (Foundations of Rome). Every source in Section C comes from your OCR Prescribed Set Sources!',
    pairedUnitId: 'ocr_foundations_of_rome',
    pairedLabel: 'Flip to Foundations of Rome (Section A) ↗',
    choiceAlert:
      'Q15* Set-Source Essay Rule (20m): Half the marks (10/20) test AO3 evaluation of Prescribed Sources — contrast hostile Augustan/Roman texts (Plutarch, Dio, Horace, Virgil) with Cleopatra’s Egyptian/Eastern coins!',
    slots: [
      {
        id: 'cleo_q11',
        qNum: 'Q11(a)–(c)',
        marksLabel: '5m · 5 mins',
        stem: 'Identify / Name / State…',
        formula: 'Crisp recall of Ptolemaic & Roman names, territories, battles, and dates BC.',
        families: ['ocr_discrete_5', 'features'],
      },
      {
        id: 'cleo_q12',
        qNum: 'Q12 (Set Source)',
        marksLabel: '5m (AO3) · 6 mins',
        stem: 'What can we learn from Passage / Source B about…?',
        formula: '2 supported deductions anchored in "direct quotes" or coin iconography.',
        families: ['ocr_learn_5'],
      },
      {
        id: 'cleo_q13',
        qNum: 'Q13 (Set Source)',
        marksLabel: '5m (AO3) · 6 mins',
        stem: 'Using details from Passage / Source B, how accurate do you think…?',
        formula: 'Quote detail + evaluate Augustan propaganda, genre (poetry vs biography), and audience.',
        families: ['ocr_accuracy_5'],
      },
      {
        id: 'cleo_q14',
        qNum: 'Q14',
        marksLabel: '10m (AO1+AO2) · 12 mins',
        stem: 'Explain the significance / why…',
        formula: '2 developed analytical paragraphs (5 AO1 + 5 AO2 — zero AO3 source evaluation needed).',
        families: ['ocr_depth_explain_10'],
      },
      {
        id: 'cleo_q15',
        qNum: 'Q15* (Pick 1 of 2)',
        marksLabel: '20m (10m AO3!) · 26 mins',
        stem: '‘Statement.’ How far do you agree? You must use ancient sources you have studied.',
        formula: 'Pick 1 essay! Contrast Roman literary set texts against Egyptian/Antonian coinage + balanced verdict.',
        families: ['ocr_depth_essay'],
      },
    ],
  },
};

const hubState = {
  unitId: 'cme_new',
  activeTab: 'questions', // 'questions' | 'spec' | 'mocks'
  blueprintCollapsed: false,
  activeSlotId: null,
  weakFocusMode: false,
  lastOptions: {},
};

function escapeHtml(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isColdMobilePupilMode() {
  return (
    typeof document !== 'undefined' &&
    document.body &&
    document.body.classList.contains('hh-mobile-pupil-mode') &&
    !isStaffModeActive()
  );
}

function renderBlueprintStripHTML(unitId, specProgress) {
  const bp = PAPER_BLUEPRINTS[unitId] || PAPER_BLUEPRINTS.cme_new;
  const flaggedCount =
    (specProgress?.redOrAmberLessonIndices?.size || 0) ||
    (specProgress?.unverifiedLessonIndices?.size || 0);
  const hasRedAmber = (specProgress?.redOrAmberLessonIndices?.size || 0) > 0;

  return `
    <section class="ehub-blueprint-card" aria-label="Official Exam Paper Structure">
      <div class="ehub-bp-head">
        <div class="ehub-bp-title-row">
          <span class="ehub-bp-badge">${escapeHtml(bp.code)} &bull; ${escapeHtml(bp.duration)}</span>
          <h2 class="ehub-bp-title">${escapeHtml(bp.paperTitle)} &mdash; ${escapeHtml(bp.marks)}</h2>
        </div>
        <button type="button" class="ehub-bp-toggle" data-ehub-action="toggle-blueprint">
          ${hubState.blueprintCollapsed ? 'Show Paper Structure ▾' : 'Collapse Paper Map ▴'}
        </button>
      </div>

      ${
        hubState.blueprintCollapsed
          ? ''
          : `
            <div class="ehub-bp-alerts">
              <div class="ehub-bp-alert sitting">
                <span><i class="fa-solid fa-clock" style="margin-right:5px;"></i>${escapeHtml(bp.sittingAlert)}</span>
                ${
                  bp.pairedUnitId
                    ? `<button type="button" class="ehub-flip-pill" data-ehub-action="select-course" data-unit-id="${escapeHtml(bp.pairedUnitId)}">${escapeHtml(bp.pairedLabel)}</button>`
                    : ''
                }
              </div>
              <div class="ehub-bp-alert choice">
                <span><i class="fa-solid fa-triangle-exclamation" style="margin-right:5px;"></i><strong>Exam-Room Rule:</strong> ${escapeHtml(bp.choiceAlert)}</span>
              </div>
            </div>

            <div class="ehub-slots-grid" role="group" aria-label="Click any exam question slot to practise">
              ${bp.slots
                .map((slot) => {
                  const sel = hubState.activeSlotId === slot.id;
                  return `
                    <button
                      type="button"
                      class="ehub-slot-card ${sel ? 'is-selected' : ''}"
                      data-ehub-action="select-paper-slot"
                      data-slot-id="${escapeHtml(slot.id)}"
                    >
                      <div>
                        <div class="ehub-slot-top">
                          <span class="ehub-slot-qnum">${escapeHtml(slot.qNum)}</span>
                          <span class="ehub-slot-meta">${escapeHtml(slot.marksLabel)}</span>
                        </div>
                        <div class="ehub-slot-stem" style="margin-top:5px;">${escapeHtml(slot.stem)}</div>
                        <div class="ehub-slot-formula" style="margin-top:3px;">${escapeHtml(slot.formula)}</div>
                      </div>
                      <div class="ehub-slot-cta">${sel ? '✓ Filtering Questions Below (Tap to Clear)' : 'Practise This Question Type →'}</div>
                    </button>
                  `;
                })
                .join('')}
            </div>

            <div class="ehub-weak-bar">
              <span><strong>Tip:</strong> Tap any question box above to filter by paper question, or jump to <strong>Spec &amp; Mind Map</strong> to check off topics.</span>
              ${
                flaggedCount > 0
                  ? `<button type="button" class="ehub-weak-btn ${hubState.weakFocusMode ? 'is-active' : ''}" data-ehub-action="toggle-weak-focus">
                      <i class="fa-solid fa-bullseye"></i>
                      <span>${
                        hubState.weakFocusMode
                          ? 'Showing Priority Topics ✓ (Tap for All)'
                          : hasRedAmber
                            ? `Practise My Red / Shaky Spec Topics`
                            : `Practise Unproven Spec Topics`
                      }</span>
                    </button>`
                  : ''
              }
            </div>
          `
      }
    </section>
  `;
}

/**
 * Addition #4: 15-Minute Pre-Exam Rescue Guided Sprint Modal
 * Step 1 (2m): Paper Timing & Choice Rules
 * Step 2 (5m): Top 10 Turning Points & Dates (with Date-Blur Self-Test)
 * Step 3 (8m): Three 60-Second Bullet Plans vs Grade 9 Skeletons
 */
async function openPreExamRescueModal(unitId) {
  document.getElementById('ehub-rescue-backdrop')?.remove();

  const [specTree, directory] = await Promise.all([
    loadUnitSpecTree(unitId),
    buildUnitExamDirectory(unitId),
  ]);
  const bp = PAPER_BLUEPRINTS[unitId] || PAPER_BLUEPRINTS.cme_new;

  // Pick 3 diverse questions spanning different slots/lessons
  const pickedQs = [];
  const usedIds = new Set();
  bp.slots.forEach((sl) => {
    if (pickedQs.length >= 3) return;
    const hit = directory.allQuestions.find(
      (q) => !usedIds.has(q.id) && sl.families.includes(q.family),
    );
    if (hit) {
      usedIds.add(hit.id);
      pickedQs.push(hit);
    }
  });
  while (pickedQs.length < 3 && directory.allQuestions.length > pickedQs.length) {
    const fallback = directory.allQuestions.find((q) => !usedIds.has(q.id));
    if (!fallback) break;
    usedIds.add(fallback.id);
    pickedQs.push(fallback);
  }

  let activeStep = 1;
  let datesBlurred = false;
  const revealedYearIdx = new Set();
  const revealedPlanIds = new Set();
  const planDrafts = {};
  let timerSec = 60;
  let timerInterval = null;

  const backdrop = document.createElement('div');
  backdrop.className = 'ehub-rescue-backdrop';
  backdrop.id = 'ehub-rescue-backdrop';
  document.body.appendChild(backdrop);

  const cleanup = () => {
    if (timerInterval) clearInterval(timerInterval);
    backdrop.remove();
  };

  const renderModal = () => {
    let stepBody = '';
    if (activeStep === 1) {
      stepBody = `
        <h3 style="margin:0 0 8px;font-size:1.05rem;color:#0f172a;">Step 1 (2 Mins): Lock In Your Paper Rules &amp; Pacing</h3>
        <div style="background:#eff6ff;border:1.5px solid #93c5fd;border-radius:10px;padding:11px 13px;margin-bottom:10px;font-size:0.84rem;color:#1e3a8a;">
          <strong>${escapeHtml(bp.paperTitle)}</strong> &mdash; <strong>${escapeHtml(bp.duration)}</strong> &bull; <strong>${escapeHtml(bp.marks)}</strong>
          <div style="margin-top:4px;">${escapeHtml(bp.sittingAlert)}</div>
        </div>
        <div style="background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:10px 13px;margin-bottom:12px;font-size:0.84rem;color:#92400e;">
          <strong>⚠️ Non-Negotiable Exam-Room Rule:</strong> ${escapeHtml(bp.choiceAlert)}
        </div>
        <div style="display:grid;gap:8px;margin-bottom:14px;">
          ${bp.slots
            .map(
              (s) => `
                <div style="border:1px solid #cbd5e1;border-radius:8px;padding:8px 11px;background:#f8fafc;font-size:0.82rem;">
                  <strong>${escapeHtml(s.qNum)} (${escapeHtml(s.marksLabel)}):</strong> ${escapeHtml(s.stem)}
                  <div style="color:#475569;font-size:0.77rem;margin-top:2px;">Formula: ${escapeHtml(s.formula)}</div>
                </div>
              `,
            )
            .join('')}
        </div>
        <div style="display:flex;justify-content:flex-end;">
          <button type="button" data-rstep="2" style="background:#2563eb;color:#fff;border:none;border-radius:8px;padding:9px 16px;font-weight:800;font-size:0.84rem;cursor:pointer;">Next: 10 Must-Know Dates &amp; Turning Points →</button>
        </div>
      `;
    } else if (activeStep === 2) {
      const top10 =
        Array.isArray(specTree?.rescueTop10) && specTree.rescueTop10.length > 0
          ? specTree.rescueTop10
          : directory.lessons.slice(0, 10).map((l) => ({
              year: l.lessonCode,
              event: l.cleanTitle,
              significance: `${l.questionCount} exam practice questions linked to this enquiry.`,
            }));

      stepBody = `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
          <h3 style="margin:0;font-size:1.02rem;color:#0f172a;">Step 2 (5 Mins): 10 High-Yield Chronological Anchors</h3>
          <button type="button" id="ehub-blur-dates-btn" style="background:${datesBlurred ? '#4f46e5' : '#f1f5f9'};color:${datesBlurred ? '#fff' : '#0f172a'};border:1px solid #cbd5e1;border-radius:999px;padding:5px 12px;font-size:0.76rem;font-weight:800;cursor:pointer;">
            🎯 ${datesBlurred ? 'Show All Dates' : 'Blur Dates to Test Yourself'}
          </button>
        </div>
        ${datesBlurred ? '<div style="font-size:0.75rem;color:#4f46e5;font-weight:700;margin-bottom:6px;">Tap any blurred date badge to reveal and check yourself:</div>' : ''}
        <div style="border:1px solid #cbd5e1;border-radius:10px;overflow:hidden;margin-bottom:14px;">
          ${top10
            .map(
              (item, idx) => `
                <div class="ehub-top10-row">
                  <span class="ehub-top10-year ${datesBlurred ? 'is-blurred' : ''} ${revealedYearIdx.has(idx) ? 'is-revealed' : ''}" data-reveal-yr="${idx}">${escapeHtml(item.year)}</span>
                  <div>
                    <strong style="color:#0f172a;">${escapeHtml(item.event)}:</strong>
                    <span style="color:#334155;"> ${escapeHtml(item.significance)}</span>
                  </div>
                </div>
              `,
            )
            .join('')}
        </div>
        <div style="display:flex;justify-content:space-between;gap:8px;">
          <button type="button" data-rstep="1" style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;border-radius:8px;padding:8px 13px;font-weight:700;font-size:0.82rem;cursor:pointer;">← Back</button>
          <button type="button" data-rstep="3" style="background:#2563eb;color:#fff;border:none;border-radius:8px;padding:9px 16px;font-weight:800;font-size:0.84rem;cursor:pointer;">Next: Three 60-Second Essay Plans →</button>
        </div>
      `;
    } else {
      stepBody = `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
          <h3 style="margin:0;font-size:1.02rem;color:#0f172a;">Step 3 (8 Mins): Three 60-Second Bullet Plans</h3>
          <button type="button" id="ehub-rescue-timer-btn" style="background:#0f172a;color:#fbbf24;border:none;border-radius:999px;padding:6px 13px;font-size:0.8rem;font-weight:800;cursor:pointer;">
            ⏱️ <span id="ehub-rescue-timer-val">${timerSec}s</span> ${timerInterval ? '(Reset 60s)' : 'Start 60s Sprint'}
          </button>
        </div>
        <p style="margin:0 0 10px;font-size:0.8rem;color:#475569;">Jot 2–3 bullet points + 1 date for each question, then tap <strong>Check Grade 9 Skeleton</strong>:</p>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:14px;">
          ${pickedQs
            .map((q, idx) => {
              const rev = revealedPlanIds.has(q.id);
              return `
                <div style="border:1.5px solid #cbd5e1;border-radius:10px;padding:11px 13px;background:#f8fafc;">
                  <div style="font-size:0.72rem;font-weight:800;color:#1d4ed8;text-transform:uppercase;margin-bottom:3px;">Plan ${idx + 1} &bull; ${escapeHtml(q.badgeLabel)}</div>
                  <div style="font-size:0.88rem;font-weight:800;color:#0f172a;margin-bottom:7px;">${q.stemHighlight?.html || escapeHtml(q.question)}</div>
                  <textarea data-rescue-draft="${escapeHtml(q.id)}" rows="2" placeholder="Bullet your 2–3 key points + dates here..." style="width:100%;border:1px solid #cbd5e1;border-radius:8px;padding:7px 10px;font-family:inherit;font-size:16px;margin-bottom:7px;">${escapeHtml(planDrafts[q.id] || '')}</textarea>
                  <button type="button" data-reveal-plan="${escapeHtml(q.id)}" style="background:${rev ? '#059669' : '#ffffff'};color:${rev ? '#fff' : '#0f172a'};border:1.5px solid ${rev ? '#059669' : '#0f172a'};border-radius:7px;padding:5px 11px;font-size:0.76rem;font-weight:800;cursor:pointer;">
                    ${rev ? '✓ Hide Grade 9 Skeleton' : '🏆 Check Grade 9 Skeleton'}
                  </button>
                  ${
                    rev
                      ? `<div style="margin-top:8px;background:#ffffff;border:1px solid #6ee7b7;border-radius:8px;padding:9px 11px;font-size:0.8rem;line-height:1.45;color:#1e293b;">
                          <div style="margin-bottom:5px;color:#065f46;font-weight:800;">💡 ${escapeHtml(q.examinerTip)}</div>
                          <div>${q.modelHtml}</div>
                        </div>`
                      : ''
                  }
                </div>
              `;
            })
            .join('')}
        </div>
        <div style="display:flex;justify-content:space-between;gap:8px;">
          <button type="button" data-rstep="2" style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;border-radius:8px;padding:8px 13px;font-weight:700;font-size:0.82rem;cursor:pointer;">← Back to Dates</button>
          <button type="button" data-rescue-finish style="background:#059669;color:#fff;border:none;border-radius:8px;padding:9px 18px;font-weight:800;font-size:0.84rem;cursor:pointer;">✓ Ready for the Exam!</button>
        </div>
      `;
    }

    backdrop.innerHTML = `
      <div class="ehub-rescue-modal" role="dialog" aria-modal="true" aria-label="15-Minute Pre-Exam Rescue">
        <div class="ehub-rescue-head">
          <div>
            <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#fde68a;">🚑 15-Minute Night-Before &amp; Exam-Morning Warm-Up</div>
            <div style="font-size:0.98rem;font-weight:900;">${escapeHtml(specTree?.courseTitle || bp.paperTitle)}</div>
          </div>
          <button type="button" data-rescue-finish style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.3);color:#fff;border-radius:7px;padding:5px 10px;font-size:0.8rem;font-weight:700;cursor:pointer;"><i class="fa-solid fa-xmark"></i> Close</button>
        </div>
        <div class="ehub-rescue-steps">
          <button type="button" class="ehub-rstep-btn ${activeStep === 1 ? 'is-active' : ''}" data-rstep="1">1. Paper Rules (2m)</button>
          <button type="button" class="ehub-rstep-btn ${activeStep === 2 ? 'is-active' : ''}" data-rstep="2">2. Top 10 Dates (5m)</button>
          <button type="button" class="ehub-rstep-btn ${activeStep === 3 ? 'is-active' : ''}" data-rstep="3">3. Three 60s Plans (8m)</button>
        </div>
        <div class="ehub-rescue-body">
          ${stepBody}
        </div>
      </div>
    `;

    backdrop.querySelectorAll('[data-rescue-finish]').forEach((b) => b.addEventListener('click', cleanup));
    backdrop.querySelectorAll('[data-rstep]').forEach((b) =>
      b.addEventListener('click', () => {
        activeStep = parseInt(b.getAttribute('data-rstep'), 10) || 1;
        renderModal();
      }),
    );
    backdrop.querySelector('#ehub-blur-dates-btn')?.addEventListener('click', () => {
      datesBlurred = !datesBlurred;
      revealedYearIdx.clear();
      renderModal();
    });
    backdrop.querySelectorAll('[data-reveal-yr]').forEach((el) =>
      el.addEventListener('click', () => {
        if (!datesBlurred) return;
        const idx = parseInt(el.getAttribute('data-reveal-yr'), 10);
        if (revealedYearIdx.has(idx)) revealedYearIdx.delete(idx);
        else revealedYearIdx.add(idx);
        el.classList.toggle('is-revealed');
      }),
    );
    backdrop.querySelectorAll('[data-rescue-draft]').forEach((ta) =>
      ta.addEventListener('input', (ev) => {
        planDrafts[ta.getAttribute('data-rescue-draft')] = ev.target.value;
      }),
    );
    backdrop.querySelectorAll('[data-reveal-plan]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const qId = btn.getAttribute('data-reveal-plan');
        if (revealedPlanIds.has(qId)) revealedPlanIds.delete(qId);
        else revealedPlanIds.add(qId);
        renderModal();
      }),
    );
    backdrop.querySelector('#ehub-rescue-timer-btn')?.addEventListener('click', () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerSec = 60;
        renderModal();
        return;
      }
      timerSec = 60;
      timerInterval = setInterval(() => {
        timerSec = Math.max(0, timerSec - 1);
        const span = document.getElementById('ehub-rescue-timer-val');
        if (span) span.textContent = `${timerSec}s`;
        if (timerSec <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }, 1000);
      renderModal();
    });
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) cleanup();
  });
  renderModal();
}

async function mountActiveTabContent(options = {}) {
  const unitId = hubState.unitId;
  const tab = hubState.activeTab;

  const qWrap = document.getElementById('ehub-panel-questions');
  const sWrap = document.getElementById('ehub-panel-spec');
  const mWrap = document.getElementById('ehub-panel-mocks');
  if (!qWrap || !sWrap || !mWrap) return;

  qWrap.style.display = tab === 'questions' ? 'block' : 'none';
  sWrap.style.display = tab === 'spec' ? 'block' : 'none';
  mWrap.style.display = tab === 'mocks' ? 'block' : 'none';

  if (tab === 'questions') {
    const specTree = await loadUnitSpecTree(unitId);
    const specProgress = computeSpecTreeProgress(specTree);

    const bpMount = document.getElementById('ehub-blueprint-mount');
    if (bpMount) {
      bpMount.innerHTML = renderBlueprintStripHTML(unitId, specProgress);
    }

    const bp = PAPER_BLUEPRINTS[unitId] || PAPER_BLUEPRINTS.cme_new;
    const activeSlot = bp.slots.find((s) => s.id === hubState.activeSlotId) || null;

    let weakSet = null;
    let weakLabel = '';
    if (hubState.weakFocusMode) {
      if (specProgress.redOrAmberLessonIndices.size > 0) {
        weakSet = specProgress.redOrAmberLessonIndices;
        weakLabel = 'My Red / Shaky Spec Topics';
      } else if (specProgress.unverifiedLessonIndices.size > 0) {
        weakSet = specProgress.unverifiedLessonIndices;
        weakLabel = 'Unproven Spec Topics';
      }
    }

    await renderMobileExamTrainer(unitId, {
      ...options,
      mountId: 'ehub-trainer-mount',
      embeddedInHub: true,
      familyFilter: activeSlot ? activeSlot.families : null,
      familySlotLabel: activeSlot ? `${activeSlot.qNum}: ${activeSlot.stem} (${activeSlot.marksLabel})` : '',
      weakLessonSet: weakSet,
      weakFilterLabel: weakLabel,
    });
  } else if (tab === 'spec') {
    stopExamTrainerAudioAndTimers();
    const urlParams =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search || '') : null;
    const urlTab = urlParams?.get('tab') || '';
    const resolvedSpecMode =
      options.specMode ||
      (urlTab === 'mindmap' ? 'mindmap' : urlTab === 'checklist' ? 'tree' : null);
    await renderSpecExplorerMindMap(unitId, {
      mountId: 'ehub-spec-mount',
      initialMode: resolvedSpecMode,
    });
  } else if (tab === 'mocks') {
    stopExamTrainerAudioAndTimers();
    await ensureUnitLoaded(unitId);
    const { renderMockExamsIntoContainer } = await import('./views.js');
    await renderMockExamsIntoContainer(mWrap, unitId);
  }
}

function renderHubShellDOM(mainEl) {
  const unitId = hubState.unitId;
  const meta = getGcseCourseMeta(unitId);
  const pinnedSet = new Set(getPinnedGcseCourseIds());

  const returnLabel =
    typeof window !== 'undefined' && typeof window.getReturnOriginLabel === 'function'
      ? window.getReturnOriginLabel(unitId, 'Course Lessons')
      : 'Course Lessons';

  const coursePillsHtml = GCSE_EXAM_COURSES.map((c) => {
    const active = c.id === unitId;
    const pinned = pinnedSet.has(c.id);
    return `
      <button
        type="button"
        class="ehub-course-pill ${active ? 'is-active' : ''}"
        data-ehub-action="select-course"
        data-unit-id="${escapeHtml(c.id)}"
      >
        ${pinned ? '<span>📌</span>' : ''}
        <span>${escapeHtml(c.pillLabel)}</span>
      </button>
    `;
  }).join('');

  mainEl.innerHTML = `
    <div class="ehub-shell" id="ehub-root">
      <header class="ehub-header-card">
        <div class="ehub-top-bar">
          <div>
            <div class="ehub-eyebrow">${escapeHtml(meta.paperLabel)} &bull; ${escapeHtml(meta.optionCode)}</div>
            <h1 class="ehub-title">${escapeHtml(meta.fullTitle)}</h1>
            <p class="ehub-sub">Paper Structure, Instant Filtered Exam Questions, Grade 9 Answers &amp; Interactive Specification</p>
          </div>
          <div class="ehub-header-actions">
            <button type="button" class="ehub-rescue-btn" data-ehub-action="open-rescue">
              <i class="fa-solid fa-kit-medical"></i>
              <span>15-Min Pre-Exam Rescue</span>
            </button>
            <button type="button" class="ehub-back-btn" data-ehub-action="back-to-unit">
              <i class="fa-solid fa-arrow-left"></i>
              <span>${escapeHtml(returnLabel)}</span>
            </button>
          </div>
        </div>

        <div class="ehub-course-strip" role="tablist" aria-label="Switch GCSE History Course">
          ${coursePillsHtml}
        </div>

        <div class="ehub-tabs-row" role="tablist" aria-label="GCSE Exam & Specification Hub Modes">
          <button
            type="button"
            class="ehub-tab-btn ${hubState.activeTab === 'questions' ? 'is-active' : ''}"
            data-ehub-action="switch-tab"
            data-tab="questions"
          >
            <i class="fa-solid fa-bolt"></i>
            <span>1. Paper &amp; Questions</span>
          </button>
          <button
            type="button"
            class="ehub-tab-btn ${hubState.activeTab === 'spec' ? 'is-active' : ''}"
            data-ehub-action="switch-tab"
            data-tab="spec"
          >
            <i class="fa-solid fa-sitemap"></i>
            <span>2. Spec &amp; Mind Map</span>
          </button>
          <button
            type="button"
            class="ehub-tab-btn ehub-tab-mocks-only ${hubState.activeTab === 'mocks' ? 'is-active' : ''}"
            data-ehub-action="switch-tab"
            data-tab="mocks"
          >
            <i class="fa-solid fa-file-pdf"></i>
            <span>3. Mock Papers &amp; Trends</span>
          </button>
        </div>
      </header>

      <div id="ehub-panel-questions">
        <div id="ehub-blueprint-mount"></div>
        <div id="ehub-trainer-mount"></div>
      </div>

      <div id="ehub-panel-spec" style="display:none;">
        <div id="ehub-spec-mount"></div>
      </div>

      <div id="ehub-panel-mocks" style="display:none;"></div>
    </div>
  `;

  const root = mainEl.querySelector('#ehub-root');
  root?.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-ehub-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-ehub-action');

    if (action === 'select-course') {
      const nextUnit = btn.getAttribute('data-unit-id');
      if (nextUnit && nextUnit !== hubState.unitId) {
        hubState.activeSlotId = null;
        hubState.weakFocusMode = false;
        if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
          await window.switchView('mock-exams', nextUnit, false, {
            initialTab: hubState.activeTab,
          });
        } else {
          await renderGcseExamSpecHub(nextUnit, { initialTab: hubState.activeTab });
        }
      }
      return;
    }

    if (action === 'switch-tab') {
      const nextTab = btn.getAttribute('data-tab') || 'questions';
      if (nextTab !== hubState.activeTab) {
        hubState.activeTab = nextTab;
        root.querySelectorAll('.ehub-tab-btn').forEach((b) => {
          b.classList.toggle('is-active', b.getAttribute('data-tab') === nextTab);
        });
        await mountActiveTabContent({});
      }
      return;
    }

    if (action === 'toggle-blueprint') {
      hubState.blueprintCollapsed = !hubState.blueprintCollapsed;
      const specTree = await loadUnitSpecTree(hubState.unitId);
      const bpMount = document.getElementById('ehub-blueprint-mount');
      if (bpMount) {
        bpMount.innerHTML = renderBlueprintStripHTML(
          hubState.unitId,
          computeSpecTreeProgress(specTree),
        );
      }
      return;
    }

    if (action === 'select-paper-slot') {
      const slotId = btn.getAttribute('data-slot-id');
      hubState.activeSlotId = hubState.activeSlotId === slotId ? null : slotId;
      await mountActiveTabContent({});
      return;
    }

    if (action === 'toggle-weak-focus') {
      hubState.weakFocusMode = !hubState.weakFocusMode;
      await mountActiveTabContent({});
      return;
    }

    if (action === 'open-rescue') {
      openPreExamRescueModal(hubState.unitId);
      return;
    }

    if (action === 'back-to-unit') {
      if (typeof window !== 'undefined' && typeof window.returnToSavedOrigin === 'function') {
        window.returnToSavedOrigin(hubState.unitId);
      } else if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
        window.switchView('lessons', hubState.unitId);
      }
    }
  });
}

/**
 * Main entrypoint for the Unified Year 11 GCSE Exam & Spec Hub.
 */
export async function renderGcseExamSpecHub(rawUnitId, options = {}) {
  closeSpecOverlays();
  stopExamTrainerAudioAndTimers();

  const unitId = resolveGcseExamUnitId(rawUnitId || state.selectedUnitId || window.currentUnitId);
  const switchedUnit = hubState.unitId !== unitId;
  hubState.unitId = unitId;
  state.selectedUnitId = unitId;
  if (typeof window !== 'undefined') {
    window.currentUnitId = unitId;
  }

  if (switchedUnit) {
    hubState.activeSlotId = null;
    hubState.weakFocusMode = false;
  }

  const urlParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search || '') : null;
  const urlTab = urlParams?.get('tab') || '';
  const hasUrlEq = Boolean(urlParams?.get('eq') || options.questionNum || typeof options.lessonIndex === 'number');

  // Resolve initial tab:
  // 1. Explicit option or URL param (?tab=spec | ?tab=mocks | ?tab=radar | ?tab=official)
  // 2. Always default to Tab 1 ('questions' — Paper Blueprint & Quick Questions) so both Year 11s
  //    and teachers projecting in class land on instant questions first, with Tab 3 ('mocks') 1 click away!
  if (options.initialTab && ['questions', 'spec', 'mocks'].includes(options.initialTab)) {
    hubState.activeTab = options.initialTab;
  } else if (urlTab === 'spec' || urlTab === 'mindmap' || urlTab === 'checklist') {
    hubState.activeTab = 'spec';
  } else if (
    ['mocks', 'official', 'past-papers', 'archive', 'pastpapers', 'radar', 'trend', 'matrix'].includes(
      urlTab,
    ) &&
    !isColdMobilePupilMode()
  ) {
    hubState.activeTab = 'mocks';
  } else {
    hubState.activeTab = 'questions';
  }

  if (isColdMobilePupilMode() && hubState.activeTab === 'mocks') {
    hubState.activeTab = 'questions';
  }

  const mainEl = typeof document !== 'undefined' ? document.getElementById('main-content') : null;
  if (!mainEl) return;
  mainEl.style.paddingTop = '0';

  renderHubShellDOM(mainEl);
  await mountActiveTabContent(options);

  if (typeof window !== 'undefined' && !window.__ehubSlotClearBound) {
    window.__ehubSlotClearBound = true;
    window.addEventListener('hh:exam-slot-filter-cleared', async () => {
      hubState.activeSlotId = null;
      hubState.weakFocusMode = false;
      const bpMount = document.getElementById('ehub-blueprint-mount');
      if (bpMount) {
        const specTree = await loadUnitSpecTree(hubState.unitId);
        bpMount.innerHTML = renderBlueprintStripHTML(
          hubState.unitId,
          computeSpecTreeProgress(specTree),
        );
      }
    });
  }
}

if (typeof window !== 'undefined') {
  window.renderGcseExamSpecHub = renderGcseExamSpecHub;
}
