---
name: Literary Companion Engine
description: Unified KS2 & KS3 Home Read-Aloud & Literary Companion Engine enforcing the 3-Voice Literary Diet (Lacey-style True Micro-Stories, Public-Domain Classic Literature/Verse/Myth, and Intimate Eyewitness Voices), age-calibrated oral readability ceilings, SEND visual ergonomics, zero-marking classroom accountability, and Studio Cast TTS synchronization.
---

# KS2 & KS3 Literary Companion Engine

## Trigger
Activate this skill whenever authoring, upgrading, validating, or syncing **Literary Companions** (`guided_reading` arrays across all 20 KS2 & KS3 units, `src/guided_reading.js`, `scripts/audit_literary_companions.cjs`, `scripts/sync_literary_companion.cjs`, or `scripts/sync_guided_reading_studio_audio.mjs`).

---

## 1. Strategic Scope & Format Rules
1. **Strictly KS2 & KS3 Only (`20` Units • `119` Lessons • Ages 9–14):**
   - Every lesson across all 8 KS2 units (`53` lessons) and all 12 KS3 units (`66` lessons) MUST have a 1-to-1 matched `guided_reading[i]` Literary Companion.
   - GCSE (Key Stage 4) units (`edexcel_medicine`, `eee`, `gcse_cold_war`, `cme_new`, `weimar_nazi_germany`, `usa`) MUST NOT carry `guided_reading` arrays.
2. **Digital-First + 1-Sheet Offline Print Fallback:**
   - Do NOT compile multi-page Literary Companion PDF booklets per unit (prevents school reprographic bloat alongside Textbooks, Workbooks, and Retrieval Companions).
   - Provide a clean `@media print` 1-Sheet A4 Homework Print layout inside `src/guided_reading.js` (with QR code + `Parent/Carer Initials: ______` box) for offline households.
3. **Canonical Source of Truth:**
   - Author via `data/literary_companions/<unit_id>.json` and sync into `units/<unit_id>/data.js` (`public/units/<unit_id>/data.js`, `data/<unit_id>.json`, `public/data/<unit_id>.json`, and `public/database.json`) using `node scripts/sync_literary_companion.cjs <unit_id>`.

---

## 2. The 3-Voice Literary Diet (Zero Fake Fiction • Zero Dry Statutes)
1. **Strictly Zero Invented Historical Fiction:** Never invent fictional characters, composite children, or made-up plot twists (*"Cite-or-Silence"*).
2. **Strictly Zero Dry Legal Statutes:** Acts of Parliament, diplomatic clauses, and bureaucratic reports belong in Classroom Layer 3 Source Scrutiny—never in home family read-alouds.
3. **Mandatory Unit Rotation Across Three Authentic Voices:**
   - **`storied_micro_history` ("True Historical Story" — Robert Lacey Craft Mode):** 100% original Hub prose telling a vivid, 100% factual micro-story about real historical people. Must follow four craft beats: (a) immediate human scene hook, (b) concrete sensory period hinterland, (c) conversational oral rhythm weaving 1–2 short authentic quotes, and (d) lingering human closing beat.
   - **`verbatim_literature` ("Classic Literature, Myth & Verse" — Public Domain):** Out-of-copyright (pre-1900 / Public Domain) canonical literature, period poetry, epics, sagas, myths, or ballads (*Beowulf*, Homer, *1001 Nights*, *Popol Vuh*, Chaucer, Shakespeare, Blake, Dickens, Wilfred Owen, Banjo Paterson). Wrap verse stanzas in `<div class="reading-stanza">...<br>...</div>` so poetic lineation and TTS breath pauses are preserved. Never reproduce post-1925 copyrighted novels.
   - **`intimate_eyewitness` / `adapted_primary` / `verbatim_primary` ("Eyewitness Diary, Letter & Speech"):** Personal human letters, diaries, memoirs, and spoken broadcasts (Samuel Pepys, Vindolanda birthday tablet, Olaudah Equiano, Vera Brittain, Mordechai Anielewicz). *(Note: `the_shoah` preserves authentic survivor/eyewitness dignity across all enquiries.)*

---

## 3. Age-Calibrated Oral Readability Ladder
Every companion MUST pass `npm run audit:literary` (`node scripts/audit_literary_companions.cjs`) against these cohort ceilings:

| Cohort | Units | Word Budget | Max Avg Sentence | Max Single Sentence | Target FK Grade | `vocabVault` |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **KS2** (Y5–6) | 8 `ks2_*` units | `145–205w` | `<= 15.5w` | `<= 25w` | `4.0 – 7.5` | 4 terms + `pronunciation` |
| **Year 7** | `water_and_sanitation`, `medieval_england` | `185–255w` | `<= 18.0w` | `<= 28w` | `6.0 – 9.0` | 4 terms + `pronunciation` on hard names |
| **Year 8** | `monarchy_religion_power`, `first_british_empire`, `industrialisation_and_empire`, `second_british_empire`, `australia` | `200–275w` | `<= 19.5w` | `<= 30w` | `7.0 – 10.0` | 4–5 terms |
| **Year 9** | `great_war`, `great_war_part2`, `the_shoah`, `cold_war`, `post_war_britain` | `215–310w` | `<= 21.5w` | `<= 34w` | `7.5 – 11.0` | 4–5 terms |

---

## 4. Required Schema Fields Per Companion
Each item in `guided_reading` MUST include:
- `lesson_index` (`0..N-1`), `lesson_id`, `lesson_label` (`"Enquiry X"`), `short_tab_title` (`<= 28 chars`)
- `literary_mode`: `"storied_micro_history"` | `"verbatim_literature"` | `"intimate_eyewitness"`
- `provenance_tier`: `"storied_micro_history"` | `"verbatim_literature"` | `"verbatim_primary"` | `"adapted_primary"` | `"scholarly_summary"`
- `source_type`, `source_type_label`, `book_title`, `author`, `provenance_note`, `author_context`
- `cover_image` (verified via Step 0 Eyes-First `read_file` and registered in `scripts/master_rights_database.json` with `commercial_use_permitted: true`) + `cover_caption`
- `vocabVault`: 4–5 items `{ term, pronunciation?, def }`
- `extract`: Clean multi-paragraph narrative (`\n\n`) or `<div class="reading-stanza">` verse
- `parent_discussion`: 3 items `{ question, answer }` (Literal/Retrieval, Language/Inference, Big Question)
- `story_check`: 3 tap-to-answer multiple-choice items `{ question, options: [4 strings], correctIndex: 0..3, feedback }` testing the story itself
- `monday_cold_call`: `{ question, answer }` — 15-second Staff-Only classroom accountability check
- `studio_audio` (`/audio/reading/<unit_id>/r<idx>.mp3`) & `studio_voice_label`

---

## 5. Verification Commands
```bash
node scripts/sync_literary_companion.cjs <unit_id>
node scripts/audit_literary_companions.cjs <unit_id>
node scripts/sync_guided_reading_studio_audio.mjs <unit_id>
node scripts/verify_sanitization.cjs
```
