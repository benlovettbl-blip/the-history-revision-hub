/**
 * Auto-generated & curated Unseen Mock Question Bank per Unit & Lesson.
 * Split across Paper 1/2 and Paper 3 sub-modules for sub-500 KB Vite chunks.
 */
import { MOCK_BANK_P1_P2 } from './mock_exam_bank_p1_p2.js';
import { MOCK_BANK_P3 } from './mock_exam_bank_p3.js';
import { MOCK_BANK_COLD_WAR } from './mock_exam_bank_cold_war.js';

export const UNIT_LESSON_MOCK_QUESTIONS = {
  ...MOCK_BANK_P1_P2,
  ...MOCK_BANK_P3,
  ...MOCK_BANK_COLD_WAR,
};

export function getLessonMockQuestions(unitId, lessonId) {
  if (!unitId || !lessonId) return [];
  const unitMap = UNIT_LESSON_MOCK_QUESTIONS[unitId];
  if (!unitMap) return [];
  return unitMap[lessonId] || [];
}
