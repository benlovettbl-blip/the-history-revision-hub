---
name: Exam Specification Word-Lock Engine
description: Mandatory Key-Topic-level verbatim specification alignment pipeline and automated coverage gates for authoring or updating any exam-board unit (Pearson Edexcel GCSE 1HI0, AQA 8145, OCR, Eduqas, Cambridge iGCSE, or A-Level) across student narrative blocks, Studio TTS audio, Spec Checklists, and 5-Ring Mind Maps.
---

# Exam Specification Word-Lock Engine (`exam-specification-word-lock-engine`)

## Why This Skill Exists (Root-Cause Lesson)
Exam-board question writers lift 4-mark, 8-mark, 12-mark, and 16-mark question stems **verbatim** from the printed specification bullets. If a curriculum author or subagent teaches a concept using a natural synonym instead of the specification's exact wording, pupils freeze in the exam hall when they do not recognise the printed trigger phrase:
- Writing *"vagrancy"* when Edexcel prints **`"vagabondage"`** (`eee` KT 3.2).
- Writing *"BDM / League of German Girls"* when Edexcel prints **`"League of German Maidens"`** (`weimar_nazi_germany` KT 4.2).
- Writing *"SdA"* when Edexcel prints **`"Beauty of Labour"`** (`weimar_nazi_germany` KT 4.3).
- Writing *"Nation of Islam"* when Edexcel prints **`"Black Muslims"`** (`usa` KT 2.3).
- Using **`"reprisals"`** in Key Topic 2 (Samu 1966) while omitting **`"Israeli reprisals"`** in Key Topic 3 (Lebanon 1978–82), or leaving exact specification wording inside `teacher_notes` / `quiz` instead of student-facing `lesson.narrative_blocks`.

---

## Mandatory 6-Step Workflow for New or Updated Specification Units

### Step 0: Specification JSON & Registry Pre-Flight (Before Writing a Single Lesson)
1. Ensure the complete official specification breakdown (Key Topics -> Sub-Topics -> Verbatim Bullet Clauses) exists in `public/data/specifications/<spec_file>.json`.
   - Note: All **17 Pearson Edexcel GCSE (1HI0) options** are already extracted in `public/data/specifications/` and indexed in `public/data/specifications/specifications_manifest.json` (`Crime & Punishment`, `Warfare`, `Migrants`, `Anglo-Saxon & Norman England`, `Richard & John`, `Henry VIII`, `Spain & the New World`, `British America`, `American West`, `Russia & the Soviet Union`, `Mao's China`, plus the 6 live courses).
   - For **AQA (`8145`), OCR (`J410`/`J411`), Eduqas, iGCSE, or A-Level**, create `public/data/specifications/<board>_<code_slug>.json` following the identical `{ id, code, paper, sections: [{ keyTopicNumber, title, topics: [{ number, title, points: [...] }] }] }` schema first.
2. Register the `unit_id` in `data/specifications/spec_unit_registry.json`.
   - **Automatic Orphan Trap:** `scripts/audit_gcse_spec_word_lock.cjs` scans `data/*.json` and immediately fails if any GCSE / KS4 / iGCSE / A-Level unit exists without an entry in `spec_unit_registry.json`.

### Step 1: Build a Key-Topic-to-Block Verbatim Clause Matrix
Before drafting prose or spawning authoring subagents, assign every specification bullet clause in Key Topic $K$ to a specific Lesson and `narrative_blocks[0..4]` stage **inside Key Topic $K$**:
- **Strict Key-Topic Locality Rule:** A specification phrase appearing in Key Topic 1 or 2 **NEVER** satisfies a specification bullet in Key Topic 3 or 4. Pupils revising or answering a Period Study / Modern Depth question on a specific episode must encounter the exact specification terminology inside that episode's narrative block.
- **Dual-Label Historical Aliases:** Whenever historians or textbooks commonly use an acronym or modern name alongside an older or formal specification name, include **both** naturally on first mention inside the block (e.g., *"the Nation of Islam (known in the specification as the **Black Muslims**)"* or *"the **League of German Maidens** (BDM)"*, *"poverty and **vagabondage**"*).

### Step 2: Author Student-Facing `narrative_blocks` Within Age-Calibrated Budgets
- Keep GCSE prose within `110–140` words per block (strict cap `150w`), structured into exactly 2 paragraphs (`[X.1]`, `[X.2]`, ~55–70w each).
- Every required verbatim specification noun, group, law, treaty, event, or concept **must appear in `lesson.narrative_blocks[i].text` or `heading`** — never buried solely in `teacher_notes`, `sources`, or `quiz`.
- Co-adapt `workbook_stages[i]` and `causal_domino_spine.stages[i]` in 1-to-1 correspondence (`node scripts/sync_stage_questions.cjs <unit_id>` + `node scripts/audit_narrative_question_answerability.cjs <unit_id> --strict`).

### Step 3: Run Strict Specification Word-Lock Gate BEFORE Studio TTS Synthesis
Always run the automated Key-Topic word-lock audit **before** calling `sync_unit_studio_media.mjs` so Studio TTS audio is voiced once cleanly with zero wasted re-takes:
```powershell
node scripts/audit_gcse_spec_word_lock.cjs <unit_id> --strict
```
- Must report **`0 Narrative KT gaps`**.
- Note: `npm run sync:unit <unit_id>` (`scripts/sync_unit.cjs` Step 1c -> `scripts/lint_gcse_dok.cjs`) also runs this gate automatically and aborts unit sync if any Key-Topic specification word gap is introduced!
- Once `0` gaps pass, run `node scripts/sync_unit_studio_media.mjs <unit_id>` (per-block SHA-256 hashing in `audio_hashes.json` ensures only new/changed blocks synthesize `.mp3` and `timings.json`).

### Step 4: Co-Derive Spec Checklist & 5-Ring Mind-Map Single Source of Truth
Generate both `data/spec_trees/<unit_id>.json` (+ `public/data/spec_trees/<unit_id>.json`) and `data/mindmaps/<unit_id>.json` (+ `public/data/mindmaps/<unit_id>.json`) using the **Universal 5-Ring Grade Ladder**:
- **Tier 0 (Centre):** Course Title & Dates
- **Tier 1 (Ring 1):** Official Key Topics (`3–5` colour-coded trunks)
- **Tier 2 (Ring 2):** Official Specification Sub-Topics / Canonical Lessons (`3–6` per Key Topic)
- **Tier 3 (Ring 3 — 🎯 Foundation: Grades 4–5):** Verbatim Specification Clauses + all 5 Lesson Narrative Block events (`1–4` word scannable pills)
- **Tier 4 (Ring 4 — 🔥 Secure: Grades 6–7):** Cause / Action / Consequence triggers (`2–3` per event)
- **Tier 5 (Ring 5 — 🏆 Mastery: Grades 8–9):** Gold-badged named individuals, factions, laws/treaties, and precision stats + `lessonIndex` / `stageIndex` deep-link to the exact narrative block & Studio Audio
- Verify Mind-Map + Narrative parity together:
```powershell
node scripts/audit_gcse_spec_word_lock.cjs <unit_id> --strict --include-mindmap
```

### Step 5: All-Surface Single-Source-of-Truth Propagation (`--all-surfaces`)
`data/<unit_id>.json` + `public/data/specifications/<spec_file>.json` together form the **Single Source of Truth**. Whenever specification terminology is authored or updated, propagate it deliberately across all 6 student-facing surfaces using these exact pedagogical rules:
1. **`lesson.narrative_blocks[0..4]` (+ Studio TTS Audio):** 100% of Key-Topic specification phrases must appear verbatim in student prose (`0` gaps on `audit_gcse_spec_word_lock.cjs --strict`).
2. **`lesson.visual_story_sheet` (The 1-Page Interactive Infographic + Studio Voice-Over):**
   - **Mandatory Co-Lock:** Every examined GCSE lesson's 6-card Interactive Infographic (`cards`, `bridges`, `takeaway`, `vocab`) MUST also pass **`0` Key-Topic specification word gaps** in `audit_gcse_spec_word_lock.cjs --strict`.
   - **Delta Voice-Over & `0px` Overflow:** `sync_unit_studio_media.mjs` compiles `public/units/<unit_id>/visual_sheets/*.html` + `public/data/infographics_manifest.json` and uses per-card SHA-256 hashes in `public/audio/visual_sheets/<unit_id>/audio_hashes.json` so **only** the edited infographic cards (`c1..c6` / `takeaway`) re-synthesize their `.mp3` voice-over. Always verify `0px` vertical/card overflow inside the `1123 × 794` `.mat-container`!
3. **`lesson.workbook_stages[0..4]` & `causal_domino_spine.stages[0..4]` (The 5 Narrative Stage Questions):**
   - **Use specification wording in the Stage Question stem (`question` / `questionHeading`) whenever asking *why/how* a specification event, policy, or group mattered** (e.g., *"Why did poverty and vagabondage rise sharply in Elizabethan England?"*, *"How did the League of German Maidens prepare girls for motherhood?"*, *"Why did Israeli reprisals in Lebanon fail to destroy the PLO?"*).
   - **Two Non-Negotiable Constraints (`AGENTS.md` §4.2):** Keep stems `<= 82 chars` (single-line Printed Workbook cap) and **never give away the causal answer inside the stem**. If the question asks *what* a policy/group was, place the exact specification phrase in `title`, `spec_focus`, `model_sentence`, and `causal_domino_spine` reveal summary instead.
3. **`lesson.exam_practice`, `unit.mock_exams`, `mock_exam_bank_*.js` & `blurt_past_papers_curriculum.js`:**
   - Ensure 4m/8m/12m/16m question stems, **"You may use:"** stimulus bullets, and Grade 9 WAGOLLs use the exact specification phrase (`• vagabondage`, `• the League of German Maidens`, `• Beauty of Labour`, `• the Black Muslims`, `• Israeli reprisals`) rather than informal classroom synonyms (*BDM*, *SdA*, *vagrancy*, *Nation of Islam*).
4. **`lesson.do_now` (Spaced Retrieval Starter — Next Lesson Only!):**
   - **STRICT SPACED-RETRIEVAL RULE (`AGENTS.md` §5.1):** Never add Lesson $N$'s new specification words into Lesson $N$'s own `do_now`! Instead, verify that **Lesson $N+1$'s `do_now`** (and later synoptic Do Nows retrieving Lesson $N$) pairs any common acronym/alias with the official specification phrase (e.g., `"the League of German Maidens (BDM)"`, `"the Black Muslims (Nation of Islam)"`, `"vagabondage"`).
5. **`data/spec_trees/<unit_id>.json` & `data/mindmaps/<unit_id>.json`:**
   - Lock every specification phrase into both the Spec Checklist and Ring 3 (`🎯 Grades 4–5`) of the 5-Ring Mind Map, cross-referenced to `lessonIndex` + `stageIndex`.
   - Audit all surfaces in one command: `node scripts/audit_gcse_spec_word_lock.cjs <unit_id> --all-surfaces`.
6. **`lesson.vocab`, `lesson.flashcards`, `lesson.vocab_cloze_text` & `lesson.sources`:**
   - Ensure both inward specification terms AND outward period boundaries (`1558–88`, `1918–Aug 1939`, `1941–91`, `1945–95`, `1954–75`, `c1250–present`) hold across flashcards, cloze slots (`verify_vocab_parity.cjs`), and Layer 3 primary sources (`Sources A–E`).
7. **Games, Arenas, Timelines & Blurt (`arcade_data_adapter.js`, Showcase RPGs, `arena_corners`, `arena_standoffs`, `cme_living_timeline.js`, `blurt_topics_curriculum.js`):**
   - Exclude non-examined context lessons (e.g. `cme_new` `lesson_0` `1915–39`) from full-unit GCSE Arcade/Quiz sprints by default, align custom RPG episodes/timelines/standoffs, and include exact specification keywords in `blurt_topics_curriculum.js` scoring rubrics.
8. **Detached Print Suites Not Auto-Built by `sync_unit.cjs`:**
   - Remember that while `npm run sync:unit <unit_id>` auto-compiles `compile_master_textbook.cjs` and unit Pupil Workbooks, you MUST also check/recompile:
     - **GCSE Retrieval Companions ("Quiz Packs")** + `node scripts/audit_all_retrieval_companions.cjs` (`pdf-parse` page gate) whenever `lesson.quiz` changes.
     - **28-Page Unified Master Textbooks** (`npm run build:textbook:gcse:all` / `scripts/*_unified_textbook_data.cjs`) whenever GCSE narrative/milestones change.
     - **Workbook Master Data scripts** (`scripts/*_workbook_master_data.cjs`) whenever GCSE `workbook_stages` / `exam_practice` change so workbook scripts never diverge from `data/<unit>.json`.
     - **Secondary Walk-In Teacher Guides** (`node scripts/render_secondary_teacher_guides.cjs`) whenever `teacher_notes` / `enquiry` change.
9. **Exact-Day Calendar-Trivia Quiz Ban:**
   - In `lesson.quiz` and `Prove-It Green` micro-quizzes, test **historical mechanisms, causation, consequences, and year/period turning points** — never exact calendar-day trivia (*"On what exact date in July..."*).

### Step 6: Copyright & Non-Endorsement Attribution
Display clear qualification alignment (`"Aligned to Pearson Edexcel GCSE (9–1) History (1HI0) — Independent educational resource, not endorsed by Pearson"`) while reorganising Atomic Specification Anchors into pedagogical checklists and radial rings.
