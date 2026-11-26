---
name: Literary Companion Engine
description: Unified KS2 & KS3 Home Read-Aloud & Literary Companion Engine enforcing the 3-Voice Literary Diet (Lacey-style True Micro-Stories, Public-Domain Classic Literature/Verse/Myth, and Intimate Eyewitness Voices), age-calibrated oral readability ceilings, SEND visual ergonomics, zero-marking classroom accountability, Studio Cast TTS synchronization, and Optional Saddle-Stitch Anthology PDF Booklets.
---

# KS2 & KS3 Literary Companion Engine

## Trigger
Activate this skill whenever authoring, upgrading, validating, syncing, or compiling **Literary Companions** (`guided_reading` arrays across all 20 KS2 & KS3 units, `src/guided_reading.js`, `scripts/audit_literary_companions.cjs`, `scripts/sync_literary_companion.cjs`, `scripts/sync_guided_reading_studio_audio.mjs`, or `scripts/render_literary_companion_booklets.cjs`).

---

## 1. Strategic Scope & Dual Delivery Formats
1. **Strictly KS2 & KS3 Only (`20` Units • `119` Lessons • Ages 9–14):**
   - Every lesson across all 8 KS2 units (`53` lessons) and all 12 KS3 units (`66` lessons) MUST have a 1-to-1 matched `guided_reading[i]` Literary Companion.
   - GCSE (Key Stage 4) units (`edexcel_medicine`, `eee`, `gcse_cold_war`, `cme_new`, `weimar_nazi_germany`, `usa`) MUST NOT carry `guided_reading` arrays or `literaryAnthology` catalog entries.
2. **Digital-First Studio + 1-Sheet Offline Homework Print:**
   - The interactive web reader (`src/guided_reading.js`) provides zero-login QR sharing, SEND tint/font/size controls, tap-to-hear vocabulary phonetics, sentence-by-sentence Studio Cast UK audio, 3-question tap-to-check MCQs, and a clean `@media print` 1-Sheet A4 Homework Print layout (with QR code + `Parent/Carer Initials: ______` box).
3. **Optional Saddle-Stitch Anthology PDF Booklet Engine (`scripts/render_literary_companion_booklets.cjs`):**
   - Alongside Digital-First + 1-Sheet Print, each of the 20 KS2 & KS3 units compiles an **Optional Home Reading & Tutor-Time Anthology** (`public/units/<unit_id>/literary_companion.html`, `units/<unit_id>/literary_companion.html`, and `public/pdfs/<unit_id>_literary_companion.pdf`), surfaced under the `"OPTIONAL ANTHOLOGY"` badge in `src/data/unit_resources_catalog.js` (`literaryAnthology`), `src/engine/hero_launchpad.js`, and the `[📄 Anthology PDF]` header action button in `src/guided_reading.js`.
   - Every anthology booklet MUST hit an exact A3 saddle-stitch multiple of 4 pages (`210mm × 297mm` portrait pages, `margin: 0`, `0px` DOM overflow, bi-directionally calibrated story prose `12.5–14.2pt` Lora on KS2 / `10.8–13.0pt` Lora on KS3 via inline `autoFitPages()`, and `pdf-parse` physical page count assertion):
     - **5-Enquiry Units (`8` KS3 units) -> `8` Pages (`pdf.numpages === 8`):** Aspect-Adaptive Storybook Cover + Sign-Off Passport (p. 1), Stories 1–5 with corner Audio QR codes (pp. 2–6), 15-Question Story Check Quiz (p. 7), Parent/Tutor Conversation Guide & Full 15-Answer Key (p. 8).
     - **6-Enquiry Units (`9` KS2/KS3 units) -> `8` Pages (`pdf.numpages === 8`):** Aspect-Adaptive Storybook Cover + Sign-Off Passport (p. 1), Stories 1–6 with corner Audio QR codes (pp. 2–7), Parent/Tutor Conversation Guide & Bonus 6-Story Quick Recall Check (p. 8).
     - **7-Enquiry Units (`the_shoah`, `cold_war`) -> `12` Pages (`pdf.numpages === 12`):** Cover + 2-Column 7-Story Directory (p. 1), Voices of the Era & Master Phonetic Vocabulary Guide (p. 2), Stories 1–7 (pp. 3–9), 21-Question Story Check Quiz Spread & Parent/Tutor Guide + Full 21-Answer Key (pp. 10–12).
     - **11-Enquiry Unit (`ks2_ww2`) -> `16` Pages (`pdf.numpages === 16`):** Panoramic Cover + 2-Column 11-Story Directory (p. 1), Home Reading Passport & Wartime Voices Guide (p. 2), Stories 1–11 (pp. 3–13), 2-Page Facing 33-Question Story Check Quiz Spread (pp. 14–15), Parent/Carer Guide & Full 33-Answer Key (p. 16).
4. **Canonical Source of Truth & Clean `/reading/<slug>/` Permalinks:**
   - Author via `data/literary_companions/<unit_id>.json` and sync into `units/<unit_id>/data.js` (`public/units/<unit_id>/data.js`, `data/<unit_id>.json`, `public/data/<unit_id>.json`, `public/data/database_index.json`, and `public/database.json`) using `node scripts/sync_literary_companion.cjs <unit_id>` followed by `node scripts/build_database.cjs`.
   - Every companion automatically receives a clean human-readable permalink `/reading/<slug>/` (via `getReadingSeoSlugList` / `buildCleanReadingPageTitle` in `src/data/seo_routes.js`), pre-rendered into `dist/reading/<slug>/index.html` and added automatically to `sitemap.xml` during `npm run build` with a story-first `<title>` and `og:title` (`<Book Title> (<Author>) — Read-Aloud Companion`) so pasting into Edge/Teams/Word/WhatsApp unfurls the poem/story title rather than the site name, while keeping legacy `/?view=reading&unit=<unit_id>&lesson=<1..N>` homework links 100% backward-compatible.

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

## 5. Verification & Booklet Compilation Commands
```bash
node scripts/sync_literary_companion.cjs <unit_id>
node scripts/audit_literary_companions.cjs <unit_id>
node scripts/render_literary_companion_booklets.cjs <unit_id>
node scripts/sync_guided_reading_studio_audio.mjs <unit_id>
node scripts/verify_sanitization.cjs
```
