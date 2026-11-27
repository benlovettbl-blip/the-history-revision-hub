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
1. **Zero Memory Burden & Pre-Planning Consumer-Graph Audit:** Never expect the user to remember CLI syntax, sync steps, or paths. Before planning any curriculum/spec change, **Step 0 MUST scan ALL digital and print consumers** (`narrative_blocks`, `visual_story_sheet` + card audio, `workbook_stages`, `exam_practice`/WAGOLLs/mock banks, next-lesson `do_now`, `vocab`/`flashcards`/`vocab_cloze_text`, `sources`, `quiz`, `Arcade`/RPGs, `Plenary Arena`, `Blurt`, `Living Timelines`, `spec_trees`, `mindmaps`, `Textbooks`, `Workbooks/Markschemes`, `Retrieval Companions`, `Teacher Guides`) for inward coverage AND outward period-boundary fouls.
2. **Zero-Prompt Tablet Handoff:** When the user opens with `"hi"`, `"hey"`, `"where are we?"`, or `"continue"`, read `.agents/task.md` + latest git commit and reply with a 3-bullet briefing: (a) Exact status, (b) Last completed work, (c) Single next step.
3. **High-Signal Output & Bold AI Model Guidance (Zero Clutter):**
   - Finish turns with a concise summary, clickable `file://` links, and **at most ONE single, clear next step** (1–2 sentences). Never paste "Workbook Rollout Compass" or multi-option essay dumps unless asked; track rollout in `WORKBOOK_STATUS_AND_ROLLOUT_TRACKER.md` and `.agents/task.md`.
   - **Mandatory Bold AI Model Guidance:** Always guide the user **in BOLD** on which model to pick next (`**Recommended AI Model: Gemini 4 Neon (Medium)**` for single-file edits/UI/publishing; `**Recommended AI Model: Gemini 4 Carbon (Medium)**` for multi-file curriculum/spec/print geometry; `**Recommended AI Model: Gemini 4 Carbon (High)**` for deep architectural debugging or `/swarm` sweeps).
4. **Strict Unit Containment, Explicit Sign-Off & Data Loss Prevention:**
   - **Always Ask Before Editing Units:** Never rewrite, TTS-synthesize, or recompile curriculum units unprompted—confirm target unit(s) first. Touch only the requested unit (`unitId` guards); back up to `temp_backups/` before destructive ops; validate JS/JSON syntax before `node scripts/sync_unit.cjs <unit_id>` (never global `npm run sync`).
   - **SOW, Glossary & Desk-Copy Freeze:** Sync `src/scheme_of_work_data.js`, `data/teacher_guidance/<unit_id>.json`, and `data/glossary/<unit_id>.json` with every unit; freeze prose/PDFs during active desk-copy windows (`schedule` cron + `.agents/task.md`).

---

## 3. Specialized Skill Routing (Mandatory Progressive Disclosure)
Read the matching `SKILL.md` in `.agents/skills/` before running specialized workflows:
- **KS2 Textbooks & Digital App UI (`8p/16p` + Primary Safeguarding):** `.agents/skills/ks2-classroom-textbook-engine/SKILL.md`
- **KS3 Textbooks (`8p/12p` Anthology) & Unit Orchestration:** `.agents/skills/ks3-classroom-textbook-engine/SKILL.md` & `.agents/skills/ks3-publishing-engine/SKILL.md`
- **GCSE 28-Page Master Textbooks (Zero Maps on p.3):** `.agents/skills/gcse-classroom-textbook-engine/SKILL.md`
- **Exam Spec Word-Lock (`Edexcel/AQA/OCR/iGCSE/A-Level`):** `.agents/skills/exam-specification-word-lock-engine/SKILL.md`
- **Pupil Workbooks, Retrieval Companions & Literary Companions:** `.agents/skills/pupil-workbook-engine/SKILL.md`, `.agents/skills/retrieval-companion-engine/SKILL.md`, `.agents/skills/literary-companion-engine/SKILL.md`
- **Quiz/Vocab & Pre-Production Release Gate:** `.agents/skills/auto-quiz-generator/SKILL.md`, `.agents/skills/auto-vocab-generator/SKILL.md`, `.agents/skills/production-release-gate/SKILL.md`

---

## 4. Curricular Pillar Taxonomy & Universal Prose Standards
1. **Official 4-Tier Publication Taxonomy:**
   - **Master Textbook:** Pure narrative classroom anthologies (zero source boxes, vocab ribbons, exam rubrics, or `[1.3]` pills).
   - **Pupil Workbook:** Consumable double-page companions (Verso 5-Stage Chronological Spine + Recto writing tasks, `#000000` monochrome interior, zero Do Nows/standalone vocab drills/stem giveaways). Never use deprecated `generate_pupil_workbooks.cjs` or `generate_textbooks.cjs`.
   - **Mastery Exam Pack:** Summative timed mocks, mark schemes, and Grade 8/9 WAGOLLs (UI label strictly `"Mastery Exam Pack"`).
   - **Master Knowledge Retrieval Companion ("Quiz Pack"):** Spaced retrieval booklets (KS2 `4p`, KS3 `8p`, GCSE `16–28p`) verified via `pdf-parse` (`0` Skia spillover) with 3-tier `▸`/`▸▸`/`▸▸▸` pips.
2. **Strict 1-to-1 Narrative Block to Workbook Stage & Answerable Stage Question Invariant:**
   - `lesson.narrative_blocks`, `lesson.workbook_stages`, and `lesson.causal_domino_spine.stages` MUST align 1-to-1 (`Block 1 <-> Stage 1 ... Block 5 <-> Stage 5`; zero orphan intros), with noun-phrase `title`s and identical `question`/`questionHeading` across App & Workbook (`<= 82 chars`). `narrative_blocks[i]` must explicitly contain every entity, date, and causal answer required by its Stage Question (zero stem giveaways).
   - **Mandatory Co-Adaptation Rule:** Editing `narrative_blocks[i].text` or `workbook_stages[i].question` requires updating its Stage Question, Chronology Spine summary, AND Spotlight Hints/Stems/Answers (`public/data/stage_answers/<unit_id>.json`, zero `()` parentheses, varied stems) in the same turn + running `sync_stage_questions.cjs`, `sync_spotlight_stage_answers.cjs`, `audit_narrative_question_answerability.cjs <unit_id> --strict`, and `npm run audit:stages`.
3. **Age-Calibrated Word Budgets & Readability:**
   - **KS2 (Ages 9–11):** `50–80w`/block; sensory storytelling, concrete nouns, short sentences.
   - **KS3 (Ages 11–14):** `80–110w`/block (cap `120w`), 2 paragraphs (`[X.1]`, `[X.2]`, ~40–55w); accessible framing (*"The Traditional View"* vs *"The Modern View"*).
   - **GCSE (Ages 14–16):** `110–140w`/block (cap `150w`), 2 paragraphs (`[X.1]`, `[X.2]`, ~55–70w); anchor to 2–3 high-yield spec points. **Short-Sentence & Plain-English Law (Especially OCR Ancient History):** Average `16–21` words/sentence (hard cap `<= 30w`; zero multi-clause semicolon/em-dash marathons). Surround classical/exam proper nouns with simple everyday English—banning non-spec academic jargon (*fiscal, austerity, titulary, supine, collateral, corvée, grandees, naophorous, regicide, remission*).
4. **Authentic Christine Counsell Storytelling & Zero AI/Edutainment Jargon:**
   - Ban corporate AI phrases (*"Specification Mastery & Synthesis"*, *"Holistic Framework"*) and never display **"Hinge"** in visible UI/print labels (use **`"Class Discussion"`** or **`"Quick Check"`**).
   - **Counsell Narrative Craft & Strict Forward Chronology (Zero Block-5 Verdict Spoilers):** Never open paragraphs with mark-scheme signposting (*"X illuminates Y’s attitude..."*, *"Once X fell..."*). Open inside the historical scene via concrete sensory particulars, physical objects, human dilemmas, short primary quotes, and causal contrasts in natural past tense (zero present-tense shifts, zero `&` ampersands, solemn dignity on atrocities). Story enquiries MUST advance strictly forward in time from Block 1 to Block 5 (zero backwards flashbacks, zero out-of-period objects bolted onto Block 5, and **zero pre-chewed *"Historical Verdict / Historians argue..."* summaries in Block 5**—keep evaluation for sources and pupil tasks; use thematic stage badges instead of fake sequential dates on genuinely thematic lessons). After any `narrative_blocks` edit, run `node scripts/sync_unit_studio_media.mjs <unit_id>` + `node scripts/build_database.cjs`.
5. **Mandatory Specification Word-Lock & Zero-Synonym Substitution Law:**
   - Register every exam unit in `public/data/specifications/` + `data/specifications/spec_unit_registry.json` at Step 0. Every substantive specification phrase (*vagabondage*, *League of German Maidens*, *Black Muslims*, *Israeli reprisals*) MUST appear verbatim inside `lesson.narrative_blocks` of **that exact Key Topic**, `spec_trees`, and `mindmaps`. Pass `node scripts/audit_gcse_spec_word_lock.cjs <unit_id> --strict` (`0` KT gaps) BEFORE `sync_unit_studio_media.mjs`.

---

## 5. Pedagogical Lesson Architecture, Sources & Fact Grounding
1. **Strict Spaced-Retrieval Law for Do Now Starters:**
   - Do Now starters MUST NEVER test new content from the current lesson. Retrieve strictly from: (a) Immediate Previous Lesson, (b) Earlier in Current Unit, and (c) Synoptic Prior Topics.
2. **3-Layer Digital Lesson Architecture:**
   - **Layer 1:** 5 structured narrative blocks with paragraph indexing (`[Act.Para]`—index paragraphs only, never individual sentences) and audio read-aloud support.
   - **Layer 2 (5/5 Dual-Coding — "3 + 2" Hybrid & Single-Card Stepper):** Every block (`5/5`) needs a side visual anchor (`.narrative-visual-row`, `slide_compare`, or `concept_widget`, alternating left/right, zero `image_context` clutter)—pairing 3–4 commercial-cleared archival plates with 1–2 `concept_widget` / `slide_compare` anchors. Never render squashed multi-column mini SVG bullet boxes: conceptual `concept_widget`s MUST use a **Single-Card Tappable Stepper** (`steps: [...]`, continuous prose, zero bullets) with a **`Show All`** toggle.
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
3. **Automated Layout, Mandatory Visual Screenshot Gate & Page-Budget Engine:**
   - Every PDF compiler must run `scripts/auto_calibrate_engine.cjs` in Puppeteer before `scripts/audit_page_budget.cjs` / `scripts/check_overflows.cjs` (`0px` overflow, `>= 95%` optimal space utilization) rather than manually hacking prose strings.
   - **Mandatory Post-Render Visual Inspection (Workbooks & Bespoke SVGs):** Before telling the user a new/redesigned workbook is complete, render PNG screenshots of the Cover, Verso, and every bespoke Recto page and inspect them via `read_file` to catch SVG label collisions, map accuracy (`d3-geo` Natural Earth coastlines only—zero crude polygons), SEND font legibility (`Inter` sans-serif), multi-perspective cover balance (never a lone imperial general), content-neutral print connectives, and identical `8.5mm` handwriting line spacing across Verso and Recto.
4. **Digital Screen Ergonomics, Mobile Measure & Parallel `/swarm` Hygiene:**
   - **Above-the-Fold Discipline:** Never stack duplicate back buttons or multi-card *"How This Works"* intros above active learning workspaces; use 1-line `<details>` disclosures and dock interactive toolbars/audio (`position: sticky`) directly to the content they control.
   - **Mobile (`390px`) Line Measure & Safe Areas:** Flatten nested card padding on `<= 768px` so body prose maintains `7–10` words/line (`hyphens: none`), clear fixed bottom nav bars (`padding-bottom >= 96px`), use FA6 Free icons only, and never render unparsed `*...*` markdown in HTML views.
   - **15-Year-Old Cold-Stranger Mobile Filter & Zero-Jump Thumb-Zone (`CLS = 0`):** Audit all `< 933px` pupil views (`body.hh-mobile-pupil-mode:not(.staff-mode-active)`) with zero staff login: hide staff/co-curricular club panels (`#enrichment-section`), PDFs, teacher sales footers, and SEN/projector buttons; translate teacher jargon (`Gap Fill`, `Quick Recall`, `Story Cards`, `Review Mistakes`); enforce `font-size >= 16px` on inputs/selects; and lock card heights + pin bottom action buttons (`margin-top: auto`) so reveal/next thumb targets never jump vertically.
   - **Parallel `/swarm` Safety:** Isolate multi-unit content authoring in `data/<feature>/<unit_id>.json` sidecars synced via wrapper-preserving scripts (`window.UNIT_DATA` vs `export default`) and refresh `audio_hashes.json` on pure HTML-tag normalizations to preserve `$0.00` TTS parity.
5. **Video Curation & Safeguarding Standard:**
   - **Zero Hollywood / Feature-Film Trailers:** Strictly banned across all units (never auto-fill trailers to hit a video quota). Use curated educational sources only (BBC Teach/Bitesize, British Pathé, IWM, USHMM, Yad Vashem, ERA, museum archives, and teacher-vetted explainers).
   - **Hard Key-Stage BBFC Age Gate:** KS2 (`U` / educational only; zero `12A`/`15`/`18`); KS3 (`U`/`PG`/`12A` max; strictly zero `15` or `18`); GCSE (strictly zero `18`).
   - **Zero Guessed Timestamps:** Never invent or guess `start_sec`/`end_sec` clip timings unless supplied by the user or verified from an actual timestamped transcript.
6. **KS2 Primary Safeguarding & Child-Friendly Digital UI Standard (`ks2_*` Units, Ages 7–11):**
   - **Strict KS2 Safeguarding Fence:** Whenever a pupil is inside a `ks2_*` unit, `?portal=ks2` session, or has only `ks2_*` courses pinned (with Staff Mode OFF), Global Search (`Ctrl+K`), Arcade course switchers, and Mobile quick-chips MUST strictly exclude all KS3/GCSE atrocity/exam content (*The Shoah*, *Weimar & Nazi Germany*, *CME*, GCSE `Exam` tab/`1 Exam Q`).
   - **Bite-Sized Key Individual Trading Cards (`<= 35w`):** Never show dense ~130-word GCSE spy dossiers or 5-box scrolling flip-card backs (`Origins & Ideology` / `Historical Evaluation`) on KS2. Render compact **"Who Was This?" Trading Cards** (`[🔊 Say Name]`, 1-sentence *Who They Were*, 1 *Famous For* highlight, 1 *Cool Clue*, `[🔊 Read Card Aloud]`) under `"People Who Shaped the Story"`.
   - **Click-Only Popups & Calm Read (`0` Hover Flicker):** Disable accidental mouse-hover popovers on inline vocabulary, figure chips, and hero banners in KS2 (open on deliberate click/tap only); cap inline dotted vocab links to `<= 2` per block; and provide a 1-tap **`Calm Read`** launchpad toggle (`body.hh-calm-reading-mode`).
   - **Child-Friendly Copy, Arcade & Stigma-Free Controls:** Use top-bar **`Easy Read`** & **`Page Tint`** (never `SEN` / `Overlay`); replace 115-word italic unit synopses with upright 2-sentence **"What We Will Discover"** hooks + `[🔊 Listen]`; translate source badges to Detective English (*Can We Trust This Clue?*, *What Can We Work Out?*, *Where this clue comes from:* + collapsed `🏛️ Museum credit`); frame quizzes as warm amber **`Practice Boost / Tricky Questions`** (`KS2 Check My Answers`); adapt KS2 Arcade (*Secret Word Detective* with pre-revealed vowels & 9 tries, *90s Clock Challenge* with zero freeze penalty, *True or Trick?*); unify timelines as **`Story Timeline`**; and default KS2 Mind Maps to a **3-Ring Simple View** with an optional `🔍 Extra Clues` toggle.
