---
name: Auto Vocab Generator
description: Automatically generates 5-8 high-quality, age-calibrated vocabulary terms and definitions whenever a lesson is created or modified to populate flashcards and lexical banks.
---

# Auto Vocab Generator

## Trigger
Execute this skill whenever asked to:
- Create, add, or build a new lesson or unit.
- Modify, update, or expand the narrative content of an existing lesson.
- Populate or refresh a unit's vocabulary or flashcard deck.

## Instructions
1. **Analyze Lesson Content & Revision Guide:** Read `narrative_blocks` and `workbook_stages` for the lesson in `units/<unit_id>/data.js` (and approved unit revision guides where applicable).
2. **Extract 5–8 High-Yield Terms (`term` & `definition`):**
   - Prioritize core specification concepts and the lesson's Trigger Terms. Avoid peripheral post-16/university jargon.
   - Calibrate definitions strictly to the target Key Stage:
     * **KS2 (Years 5–6, Ages 9–11):** Concrete, child-friendly explanations in short, vivid sentences.
     * **KS3 (Years 7–9, Ages 11–14):** Clear, accessible secondary-school definitions anchoring historical meaning.
     * **GCSE (Years 10–11, Ages 14–16):** Precise historical and constitutional definitions directly supporting Pearson Edexcel exam criteria.
3. **Deduplicate & Inject Safely:** Inject into the lesson's `vocab` array in `units/<unit_id>/data.js` (and corresponding JSON data store) without duplicating existing terms. **Never** run legacy `extract_units.js`, which destructively overwrites unit files.
4. **Safe Unit Sync & Parity Verification:**
   ```bash
   npm run sync:unit <unit_id>
   npm run verify:vocab
   node scripts/verify_sanitization.cjs
   ```
