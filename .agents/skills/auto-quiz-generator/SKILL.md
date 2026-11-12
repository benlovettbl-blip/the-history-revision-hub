---
name: Auto Quiz Generator
description: Automatically generates 20 high-quality, age-calibrated quiz and flashcard questions whenever a lesson is created or modified.
---

# Auto Quiz Generator

## Trigger
Execute this skill whenever asked to:
- Create, add, or build a new lesson or unit.
- Modify, update, or expand the narrative content of an existing lesson.
- Populate or refresh a unit's retrieval quizzes.

## Instructions
1. **Analyze Verified Lesson Content:** Read `narrative_blocks` and `sources` for the target lesson in `units/<unit_id>/data.js` (and `data/<unit_id>.json` if present). Every tested fact must be traceable to the lesson text (`audit:quiz-traceability`).
2. **Generate ~20 Multiple-Choice Questions:**
   - Calibrate reading level and conceptual depth to the target Key Stage:
     * **KS2 (Ages 9–11):** Clear concrete nouns, direct factual recall, accessible distractors.
     * **KS3 (Ages 11–14):** Substantive recall, cause/consequence, and chronological ordering.
     * **GCSE (Ages 14–16):** Specification-anchored treaties, dates, mechanisms, and key individuals matching Pearson Edexcel tariffs.
   - **Plausible Misconception Distractors:** Design incorrect options to catch common classroom misconceptions (swapped dates, rival acts/treaties, reversed cause/effect) without trick wording.
3. **Strict Do Now Separation:** Remember that `do_now` starters in a lesson strictly test **prior lessons** (never the current lesson). Keep current-lesson questions inside the lesson's `quiz` array, deduplicating any repeated stems.
4. **Direct Scripted Injection:** Write/run a clean Node script (in `scratch/`) to inject the `quiz` array into `units/<unit_id>/data.js` (and keep `data/<unit_id>.json` / `public/data/<unit_id>.json` aligned). Validate JS/JSON syntax before syncing.
5. **Safe Unit Sync & Traceability Gate:**
   ```bash
   npm run sync:unit <unit_id>
   npm run audit:quiz-traceability
   node scripts/verify_sanitization.cjs
   ```
   *(Do NOT run global `npm run sync`, which unnecessarily rebuilds every PDF across the entire repository.)*
