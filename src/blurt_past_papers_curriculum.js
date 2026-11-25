// ==========================================================================
// Hub Exam-Style Practice Questions Bank (Barrel Re-Export)
// Split into Paper 1/2, Paper 3, and Cold War chunks so all Vite bundles < 500 kB.
// ==========================================================================

import { BLURT_PAST_QUESTIONS_P1_P2 } from './blurt_past_papers_p1_p2.js';
import { BLURT_PAST_QUESTIONS_P3 } from './blurt_past_papers_p3.js';
import { BLURT_PAST_QUESTIONS_COLD_WAR } from './blurt_past_papers_cold_war.js';

export const BLURT_PAST_QUESTIONS_DATABASE = [
  ...BLURT_PAST_QUESTIONS_P1_P2,
  ...BLURT_PAST_QUESTIONS_P3,
  ...BLURT_PAST_QUESTIONS_COLD_WAR,
];
