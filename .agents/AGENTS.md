# The History Revision Hub — Master Workspace Rules (`AGENTS.md`)

> **Architecture Note:** Keep this file concise (`< 20 KB`) so 100% of workspace rules remain loaded without truncation on every turn. Detailed reprographic and compilation runbooks live in `.agents/skills/*/SKILL.md` and load progressively on demand.

---

## 1. Strict School Anonymity & Commercial Neutrality Policy
STRICT RULE: You are STRICTLY FORBIDDEN from using the name of the user's school ("Meoncross", "Meoncross School") in ANY user-facing text, page titles, document headers, footers, meta tags, printed booklets, worksheets, PDFs, PowerPoint presentations, mark schemes, teacher notes, audio scripts, or curriculum files (`data.js`, `index.html`, etc.).
1. **Commercial Independence:** All software and curriculum publications are independent commercial products intended for multi-school adoption.
2. **Approved Branding Terminology:** Always use **"The History Revision Hub"** (`historyrevisionhub.co.uk`) or generic designations (`"The History Department"`, `"The History Portal"`, `"Fieldwork Primary Record"`, `"Fieldwork Archive"`).
3. **No Associated School Identifiers:** Never include school-specific email domains (`@meoncross.co.uk`), telephone numbers, school archive seals, teacher surname nameplates (render blank lines `<span class="line"></span>`), or student family links. Never reference the decommissioned legacy Netlify domain.
4. **Commercial School Cover Customizer:** Enclose `<span class="school-brand-target">The History Department</span>` inside `data-department-name="The History Department"` on booklet covers (`?school=School+Name` / `SCHOOL_NAME`).
5. **Mandatory Sanitization Gate:** Run `node scripts/verify_sanitization.cjs` before completing work or committing (enforced in `.husky/pre-commit` and `npm run test:qa`).

---

## 2. Autonomous Execution, Containment & High-Signal Communication
1. **Zero Memory Burden & Pre-Planning Consumer-Graph Audit (Zero Silo Thinking):** Never expect the user to remember CLI syntax, database sync steps, file paths, or downstream features. Whenever planning or auditing any curriculum/specification change, **Step 0 MUST run an upfront repo-wide consumer scan across ALL digital and print surfaces** (`narrative_blocks`, `visual_story_sheet` infographics + card audio, `workbook_stages`, `exam_practice`/WAGOLLs/mock banks, next-lesson `do_now`, `vocab`/`flashcards`/`vocab_cloze_text`, `sources`, `quiz`, `Arcade` + showcase RPGs, `Plenary Arena`, `Blurt`, `Living Timelines`, `spec_trees`, `mindmaps`, `Textbooks`, `Workbooks/Markschemes`, `Retrieval Companions`, and `Teacher Guides`) checking **both** inward coverage AND outward period-boundary fouls before presenting a plan — never wait for the user to prompt surface by surface.
2. **Zero-Prompt Tablet Handoff:** Whenever the user opens with `"hi"`, `"hey"`, `"where are we?"`, or `"continue"`, immediately read `.agents/task.md` and the latest git commit, then reply with a concise 3-bullet briefing: (a) Exact project status, (b) Last completed work, and (c) Single recommended next step.
3. **High-Signal Output Standard & Bold AI Model Guidance (Zero Clutter):**
   - Finish turns with a concise summary, clickable `file://` links, and **at most ONE single, clear next step** (1–2 sentences).
   - **Mandatory Bold AI Model Guidance:** Whenever doing or proposing improvements, ALWAYS guide the user **in BOLD** on which AI model to select for the task/next step (e.g., `**Recommended AI Model: Gemini 4 Neon (Medium)**` for everyday single-file edits, UI tweaks, questions, and publishing; `**Recommended AI Model: Gemini 4 Carbon (Medium)**` for multi-file curriculum, specification, and print-geometry work; `**Recommended AI Model: Gemini 4 Carbon (High)**` for deep architectural debugging or large parallel `/swarm` sweeps).
   - **Strict Ban on Rollout Compass Churn & 3-Recommendation Dumps:** Never paste the "Workbook Rollout Compass" block or multi-option essay dumps at the end of turns unless the user explicitly asks for strategy/options. Progress lives in `WORKBOOK_STATUS_AND_ROLLOUT_TRACKER.md` and `.agents/task.md`.
4. **Strict Unit Containment, Explicit Sign-Off & Data Loss Prevention:**
   - **Always Ask Before Editing Units:** Full unit narrative edits, Studio TTS re-synthesis, and PDF recompilations are heavy work and affect printed classroom packs—NEVER start editing, rewriting, or recompiling curriculum units on your own (even when a reminder fires). Always double-check with the user first and wait for their explicit go-ahead on which unit(s) to touch.
   - Unless asked to work globally, do NOT modify files in units outside the user's current target unit. Wrap shared-script unit overrides in explicit `unitId` checks when needed.
   - Before destructive commands (`git reset --hard`, `git clean`) or full-file overwrite parsers, ask explicit user permission, create a timestamped backup in `temp_backups/`, and checkpoint clean Git state when refactoring. Always validate JS/JSON syntax before running `build_database.cjs` or `sync_unit.cjs`.
   - Use unit-scoped `npm run sync:unit <unit_id>` (`node scripts/sync_unit.cjs <unit_id>`) rather than global `npm run sync` unless explicitly requested.
   - **SOW, Glossary & Classroom Desk-Copy Freeze Guardrail:** Include `src/scheme_of_work_data.js`, `data/teacher_guidance/<unit_id>.json`, and `data/glossary/<unit_id>.json` in every unit audit so date ranges and lexical banks never drift. When the user has printed desk copies of a unit for active classroom teaching, **freeze narrative wording and printed PDFs** for that teaching window and set a dual reminder (`schedule` cron + `.agents/task.md`) for the unfreeze date.

---

## 3. Specialized Skill Routing (Mandatory Progressive Disclosure)
Before executing any specialized publishing or generation workflow, read the matching `SKILL.md` in `.agents/skills/`:
- **KS2 Textbooks (8p / 16p Single Wide-Margin Column):** `.agents/skills/ks2-classroom-textbook-engine/SKILL.md`
- **KS3 Textbooks (8p / 12p Pure Narrative Anthology):** `.agents/skills/ks3-classroom-textbook-engine/SKILL.md`
- **GCSE 28-Page Master Textbooks (Zero Maps on Page 3):** `.agents/skills/gcse-classroom-textbook-engine/SKILL.md`
- **Exam Specification Word-Lock & New Spec Units (Edexcel / AQA / OCR / iGCSE / A-Level):** `.agents/skills/exam-specification-word-lock-engine/SKILL.md`
- **KS3 Unit Orchestration & Stage Sync:** `.agents/skills/ks3-publishing-engine/SKILL.md`
- **KS3 & GCSE Pupil Workbooks + Edexcel Tariffs:** `.agents/skills/pupil-workbook-engine/SKILL.md`
- **Master Knowledge Retrieval Companions ("Quiz Packs"):** `.agents/skills/retrieval-companion-engine/SKILL.md`
- **KS2 & KS3 Literary Companions (3-Voice Read-Aloud Studio & Optional Saddle-Stitch Anthology PDFs):** `.agents/skills/literary-companion-engine/SKILL.md`
- **Quiz & Vocab Injection:** `.agents/skills/auto-quiz-generator/SKILL.md` & `.agents/skills/auto-vocab-generator/SKILL.md`
- **Pre-Production Security, Bundle & Asset Hygiene:** `.agents/skills/production-release-gate/SKILL.md`

---

## 4. Curricular Pillar Taxonomy & Universal Prose Standards
1. **Official 4-Tier Publication Taxonomy:**
   - **Master Textbook:** Pure narrative classroom reading anthologies (zero source boxes, zero vocab ribbons, zero exam rubrics, zero in-prose `[1.3]` pills).
   - **Pupil Workbook:** Consumable double-page inquiry companions (Verso 5-Stage Chronological Spine + Recto calibrated writing tasks, pure `#000000` monochrome interior, zero Do Nows, zero standalone vocab drills, zero knowledge giveaways in stems). Never use deprecated `generate_pupil_workbooks.cjs` or `generate_textbooks.cjs`.
   - **Mastery Exam Pack:** Summative timed mock papers, mark schemes, and Grade 8/9 WAGOLLs (UI label strictly `"Mastery Exam Pack"`).
   - **Master Knowledge Retrieval Companion ("Quiz Pack"):** Spaced retrieval booklets (KS2 `4p`, KS3 `8p`, GCSE `16–28p`) verified via `pdf-parse` for zero Skia spillover and 3-tier `▸`/`▸▸`/`▸▸▸` cognitive pips.
2. **Strict 1-to-1 Narrative Block to Workbook Stage & Answerable Stage Question Invariant:**
   - Across all units, `lesson.narrative_blocks`, `lesson.workbook_stages`, and `lesson.causal_domino_spine.stages` MUST contain matching items in 1-to-1 correspondence (Block 1 <-> Stage 1 ... Block 5 <-> Stage 5; zero orphan intro blocks), keeping `workbook_stages[i].title` as a noun-phrase milestone (for Arcade timelines) and `question` / `questionHeading` identical across App and Printed Workbook (`<= 82 chars` single-line cap). *(Note: Legacy 3-trigger-word columns/chips are retired.)*
   - `narrative_blocks[i]` must explicitly contain every named entity, date, and causal answer required by its Stage Question and Chronology Spine reveal summary (zero answer giveaways in the question stem, calibrating readability progressively across KS2 -> Y7 -> Y8 -> Y9 -> GCSE).
   - **Mandatory Co-Adaptation Rule:** Whenever `narrative_blocks[i].text` or `workbook_stages[i].question` is edited, you MUST re-verify/adapt its paired Stage Question, Chronology Spine summary, AND Classroom Spotlight Hints/Stems/Answers (`public/data/stage_answers/<unit_id>.json`, zero `()` parentheses, varied stage-specific stems) in the same turn and run `node scripts/sync_stage_questions.cjs <unit_id>` + `node scripts/sync_spotlight_stage_answers.cjs <unit_id>` + `node scripts/audit_narrative_question_answerability.cjs <unit_id> --strict`. Verify via `npm run audit:stages`.
3. **Age-Calibrated Word Budgets & Readability:**
   - **KS2 (Years 5–6 / Ages 9–11):** `50–80` words per block. Sensory storytelling, concrete nouns, short sentences.
   - **KS3 (Years 7–9 / Ages 11–14):** `80–110` words per block (strict cap `120w`). Exactly 2 paragraphs (`[X.1]`, `[X.2]`, ~40–55w each). Use accessible framing (*"The Traditional View"* vs *"The Modern View"*).
   - **GCSE (Years 10–11 / Ages 14–16):** `110–140` words per block (strict cap `150w`). Exactly 2 paragraphs (`[X.1]`, `[X.2]`, ~55–70w each). Anchor strictly to Pearson Edexcel specification points (2–3 high-yield points per event; zero university-level jargon inflation).
4. **Authentic Christine Counsell Storytelling & Zero AI/Edutainment Jargon:**
   - Never use corporate AI phrases (*"Specification Mastery & Synthesis"*, *"Holistic Framework"*, *"Synergistic Learning"*). Never use the word **"Hinge"** in any visible UI, worksheet, or teacher-facing heading—always label discussion prompts **`"Class Discussion"`** or **`"Quick Check"`**.
   - **Counsell Narrative Craft:** Avoid dry textbook summaries AND avoid forced/cheesy jokes. Bring serious history alive through **concrete sensory particulars, human irony, vivid short primary quotes, and sharp causal contrasts**, written strictly in natural past tense (zero abrupt historical-present tense shifts, zero `&` ampersands in prose/headers, and solemn dignity on atrocity/catastrophe topics). Whenever `narrative_blocks` prose changes, re-run `node scripts/sync_unit_studio_media.mjs <unit_id>` so Studio MP3s and word-level acoustic timings match 100%, followed by `node scripts/build_database.cjs`.
5. **Mandatory Specification Word-Lock & Zero-Synonym Substitution Law (All Exam-Board Units):**
   - **Zero Unregistered Exam Units:** Before authoring ANY new GCSE, KS4, iGCSE, or A-Level unit (Edexcel `1HI0`, AQA `8145`, OCR, Eduqas, etc.), Step 0 MUST create/verify its official specification JSON in `public/data/specifications/` and register the `unit_id` in `data/specifications/spec_unit_registry.json`.
   - **Key-Topic-Level Verbatim Terminology:** Never substitute synonyms for official specification stem phrases (*vagrancy* vs `vagabondage`, *BDM* vs `League of German Maidens`, *Nation of Islam* vs `Black Muslims`, or omitting `Israeli reprisals` in KT3 because `reprisals` appeared in KT2). Every substantive specification noun, group, law, treaty, and concept MUST appear verbatim inside the student-facing `lesson.narrative_blocks` **of that exact Key Topic** (never hidden solely in `teacher_notes` or `quiz`), as well as in `data/spec_trees/<unit_id>.json` and `data/mindmaps/<unit_id>.json`.
   - **Pre-TTS Gate (`npm run audit:spec-lock`):** Always pass `node scripts/audit_gcse_spec_word_lock.cjs <unit_id> --strict` (`0` KT gaps, enforced automatically via `scripts/lint_gcse_dok.cjs` inside `npm run sync:unit`) BEFORE running `sync_unit_studio_media.mjs` so Studio TTS audio is synthesized with 100% specification fidelity on the first pass.

---

## 5. Pedagogical Lesson Architecture, Sources & Fact Grounding
1. **Strict Spaced-Retrieval Law for Do Now Starters:**
   - Do Now starters MUST NEVER test new content from the current lesson. Retrieve strictly from: (a) Immediate Previous Lesson, (b) Earlier in Current Unit, and (c) Synoptic Prior Topics.
2. **3-Layer Digital Lesson Architecture:**
   - **Layer 1:** 5 structured narrative blocks with paragraph indexing (`[Act.Para]`—index paragraphs only, never individual sentences) and audio read-aloud support.
   - **Layer 2 (5/5 Dual-Coding Coverage — "3 + 2" Hybrid):** Every narrative block (`5/5`) should provide a side visual anchor (`.narrative-visual-row`, `slide_compare`, or `concept_widget`, alternating left/right, zero `image_context` clutter)—typically pairing 3–4 commercial-cleared archival plates with 1–2 interactive `concept_widget` / `slide_compare` diagrams on abstract conceptual stages to scaffold SEND and lower-attaining readers without portrait fatigue.
   - **Layer 3:** 5 rotated primary archival sources (`Source A`–`Source E`, sequential single letters, zero `A1`/`A2` sub-indices; maps labeled `Reference Map:` / `Map A:`) in collapsible drawers across varied media, rotating disciplinary badges, natural 1–2 sentence model answers, and targeted **Class Discussion** questions (never display the word `"Hinge"` in visible UI/print labels). Zero formulaic 3-part provenance boxes (exception: Medicine Paper 1 `"How useful"` questions include `provenance_clue` scaffolding).
   - **Layer 4 (Zero Intra-Lesson Duplication):** Never reuse a Layer 2 image inside Layer 3 within the same lesson.
3. **Teacher Notes, 2-Lesson Delivery Plan & Pedagogy Bank:**
   - Every lesson in `data.js` MUST include root `teacher_notes`: `{ primer, objectives: [{ objective, primer, question }], delivery_plan }` following the `"2-Lesson Sequence (50 mins each)"` 5-phase choreography, with every `source_context` ending in a targeted **Class Discussion** prompt.
   - Whenever pedagogical/SEND/cognitive strategies are developed, proactively synthesize them into `src/pedagogy_data.js` (`PEDAGOGY_RESEARCH_BANK`) with academic citations/URLs and keep `Guide_04_Disciplinary_Pedagogy_and_Research_Evidence.pdf` (`scripts/generate_guidance_manuals.cjs`) synchronized.
4. **Strict Anti-Hallucination ("Cite-or-Silence") & Reference Shelf Guardrail:**
   - Never invent biographical details, service numbers, medal classes, or dramatic combat embellishments; ground strictly in primary records or `data/curriculum_facts_manifest.json` (`node scripts/verify_curriculum_facts.cjs <unit_id>`).
   - When consulting `G:\My Drive\TEXTBOOKS`, extract historical content ONLY—never adopt exam question formats or mark allocations from non-Edexcel or legacy textbooks.

---

## 6. Visual Provenance, Archival Styling & Reprographic Quality Gates
1. **Eyes-First Visual Pre-Flight & Master Rights Register:**
   - Always run `read_file` on EVERY visual asset before captioning or authoring questions to verify literal depicted figures, printed mastheads/dates, and medium.
   - **Zero AI Images & 100% Commercial Copyright Clearance:** Strictly forbidden from generating AI historical imagery. Every Layer 2 narrative plate, `slide_compare` image, cover artwork, and individual portrait MUST be 100% cleared for commercial multi-school sale (`commercial_use_permitted: true`: Public Domain, Crown Copyright expired pre-1976, CC0, CC BY 4.0, CC BY-SA 3.0/4.0, or OGL v3.0—zero non-commercial CDPA s.32 exceptions; custom `concept_widget` SVGs are 100% original Hub IP). Download Wikimedia thumbnails locally to `public/images/` and verify via `node scripts/verify_images.cjs` + `npm run audit:provenance`.
   - Immediately register/update every visual asset in `scripts/master_rights_database.json` and run `node scripts/generate_rights_register_pdf.cjs`.
2. **Museum-Grade Archival Presentation:**
   - Restrict FontAwesome icons to high-level UI controls—never inside historical source excerpts. Zero fake/mock accession shelfmarks in student-facing source boxes.
   - Enforce `object-fit: contain;` on `.archival-image` (zero cropping of primary evidence). Family archive hero banners (`16:4` / `4:1`) must use horizontal physical artifacts (medals, trench maps, letters), keeping portrait headshots inside profile cards (`.kf-portrait`, or `.kf-monogram` wax seal for composite archetypes).
   - Print SVGs must include static overrides (`svg g { opacity: 1 !important; }`) so headless Chromium never renders blank animated frames.
3. **Automated Layout & Page-Budget Engine:**
   - Every PDF compiler must run `scripts/auto_calibrate_engine.cjs` in Puppeteer before `scripts/audit_page_budget.cjs` / `scripts/check_overflows.cjs` (`0px` overflow, `>= 95%` optimal space utilization) rather than manually hacking prose strings.
4. **Digital Screen Ergonomics, Mobile Measure & Parallel `/swarm` Hygiene:**
   - **Above-the-Fold Discipline:** Never stack duplicate back buttons or multi-card *"How This Works"* intros above active learning workspaces; use 1-line `<details>` disclosures and dock interactive toolbars/audio (`position: sticky`) directly to the content they control.
   - **Mobile (`390px`) Line Measure & Safe Areas:** Flatten nested card padding on `<= 768px` so body prose maintains `7–10` words/line (`hyphens: none`), clear fixed bottom nav bars (`padding-bottom >= 96px`), use FA6 Free icons only, and never render unparsed `*...*` markdown in HTML views.
   - **15-Year-Old Cold-Stranger Mobile Filter & Zero-Jump Thumb-Zone (`CLS = 0`):** Audit all `< 933px` pupil views (`body.hh-mobile-pupil-mode:not(.staff-mode-active)`) with zero staff login: hide staff/co-curricular club panels (`#enrichment-section`), PDFs, teacher sales footers, and SEN/projector buttons; translate teacher jargon (`Gap Fill`, `Quick Recall`, `Story Cards`, `Review Mistakes`); enforce `font-size >= 16px` on inputs/selects; and lock card heights + pin bottom action buttons (`margin-top: auto`) so reveal/next thumb targets never jump vertically.
   - **Parallel `/swarm` Safety:** Isolate multi-unit content authoring in `data/<feature>/<unit_id>.json` sidecars synced via wrapper-preserving scripts (`window.UNIT_DATA` vs `export default`) and refresh `audio_hashes.json` on pure HTML-tag normalizations to preserve `$0.00` TTS parity.
5. **Video Curation & Safeguarding Standard:**
   - **Zero Hollywood / Feature-Film Trailers:** Strictly banned across all units (never auto-fill trailers to hit a video quota). Use curated educational sources only (BBC Teach/Bitesize, British Pathé, IWM, USHMM, Yad Vashem, ERA, museum archives, and teacher-vetted explainers).
   - **Hard Key-Stage BBFC Age Gate:** KS2 (`U` / educational only; zero `12A`/`15`/`18`); KS3 (`U`/`PG`/`12A` max; strictly zero `15` or `18`); GCSE (strictly zero `18`).
   - **Zero Guessed Timestamps:** Never invent or guess `start_sec`/`end_sec` clip timings unless supplied by the user or verified from an actual timestamped transcript.
