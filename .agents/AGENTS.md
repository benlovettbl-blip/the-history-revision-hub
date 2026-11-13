# The History Revision Hub — Master Workspace Rules (`AGENTS.md`)

> **Architecture Note:** Keep this file concise (`< 20 KB`) so 100% of workspace rules remain loaded without truncation on every turn. Detailed reprographic and compilation runbooks live in `.agents/skills/*/SKILL.md` and load progressively on demand.

---

## 1. Strict School Anonymity & Commercial Neutrality Policy
STRICT RULE: You are STRICTLY FORBIDDEN from using the name of the user's school ("Meoncross", "Meoncross School") in ANY user-facing text, page titles, document headers, footers, meta tags, printed booklets, worksheets, PDFs, PowerPoint presentations, mark schemes, teacher notes, audio scripts, or curriculum files (`data.js`, `index.html`, etc.).
1. **Commercial Independence:** All software and curriculum publications are independent commercial products intended for multi-school adoption.
2. **Approved Branding Terminology:** Always use **"The History Revision Hub"** (`the-history-revision-hub.netlify.app`) or generic designations (`"The History Department"`, `"The History Portal"`, `"Fieldwork Primary Record"`, `"Fieldwork Archive"`).
3. **No Associated School Identifiers:** Never include school-specific email domains (`@meoncross.co.uk`), telephone numbers, school archive seals, teacher surname nameplates (render blank lines `<span class="line"></span>`), or student family links. Never reference the decommissioned legacy Netlify domain.
4. **Commercial School Cover Customizer:** Enclose `<span class="school-brand-target">The History Department</span>` inside `data-department-name="The History Department"` on booklet covers (`?school=School+Name` / `SCHOOL_NAME`).
5. **Mandatory Sanitization Gate:** Run `node scripts/verify_sanitization.cjs` before completing work or committing (enforced in `.husky/pre-commit` and `npm run test:qa`).

---

## 2. Autonomous Execution, Containment & High-Signal Communication
1. **Zero Memory Burden on the User:** Never expect the user to remember CLI syntax, database sync steps, or file paths. Execute full end-to-end synchronization across `data/*.json`, `public/data/*.json`, `database.json`, `public/database.json`, `units/*/data.js`, and `pupil_workbook.html`, validate (`npm run audit:tasks` / `npm run sync:unit <unit_id>`), and report back cleanly.
2. **Zero-Prompt Tablet Handoff:** Whenever the user opens with `"hi"`, `"hey"`, `"where are we?"`, or `"continue"`, immediately read `.agents/task.md` and the latest git commit, then reply with a concise 3-bullet briefing: (a) Exact project status, (b) Last completed work, and (c) Single recommended next step.
3. **High-Signal Output Standard & Bold AI Model Guidance (Zero Clutter):**
   - Finish turns with a concise summary, clickable `file://` links, and **at most ONE single, clear next step** (1–2 sentences).
   - **Mandatory Bold AI Model Guidance:** Whenever doing or proposing improvements, ALWAYS guide the user **in BOLD** on which AI model to select for the task/next step (e.g., `**Recommended AI Model: Gemini 4 Carbon (Medium)**` for multi-file curriculum, specification, and print-geometry work; `**Recommended AI Model: Gemini 4 Carbon (High)**` for deep architectural debugging; `**Recommended AI Model: Gemini 3.8 Flash (High)**` for fast single-file lookups/edits).
   - **Strict Ban on Rollout Compass Churn & 3-Recommendation Dumps:** Never paste the "Workbook Rollout Compass" block or multi-option essay dumps at the end of turns unless the user explicitly asks for strategy/options. Progress lives in `WORKBOOK_STATUS_AND_ROLLOUT_TRACKER.md` and `.agents/task.md`.
4. **Strict Unit Containment & Data Loss Prevention:**
   - Unless asked to work globally, do NOT modify files in units outside the user's current target unit. Wrap shared-script unit overrides in explicit `unitId` checks when needed.
   - Before destructive commands (`git reset --hard`, `git clean`) or full-file overwrite parsers, ask explicit user permission, create a timestamped backup in `temp_backups/`, and checkpoint clean Git state when refactoring. Always validate JS/JSON syntax before running `build_database.cjs` or `sync_unit.cjs`.
   - Use unit-scoped `npm run sync:unit <unit_id>` (`node scripts/sync_unit.cjs <unit_id>`) rather than global `npm run sync` unless explicitly requested.

---

## 3. Specialized Skill Routing (Mandatory Progressive Disclosure)
Before executing any specialized publishing or generation workflow, read the matching `SKILL.md` in `.agents/skills/`:
- **KS2 Textbooks (8p / 16p Single Wide-Margin Column):** `.agents/skills/ks2-classroom-textbook-engine/SKILL.md`
- **KS3 Textbooks (8p / 12p Pure Narrative Anthology):** `.agents/skills/ks3-classroom-textbook-engine/SKILL.md`
- **GCSE 28-Page Master Textbooks (Zero Maps on Page 3):** `.agents/skills/gcse-classroom-textbook-engine/SKILL.md`
- **KS3 Unit Orchestration & Stage Sync:** `.agents/skills/ks3-publishing-engine/SKILL.md`
- **KS3 & GCSE Pupil Workbooks + Edexcel Tariffs:** `.agents/skills/pupil-workbook-engine/SKILL.md`
- **Master Knowledge Retrieval Companions ("Quiz Packs"):** `.agents/skills/retrieval-companion-engine/SKILL.md`
- **Quiz & Vocab Injection:** `.agents/skills/auto-quiz-generator/SKILL.md` & `.agents/skills/auto-vocab-generator/SKILL.md`
- **Pre-Production Security, Bundle & Asset Hygiene:** `.agents/skills/production-release-gate/SKILL.md`

---

## 4. Curricular Pillar Taxonomy & Universal Prose Standards
1. **Official 4-Tier Publication Taxonomy:**
   - **Master Textbook:** Pure narrative classroom reading anthologies (zero source boxes, zero vocab ribbons, zero exam rubrics, zero in-prose `[1.3]` pills).
   - **Pupil Workbook:** Consumable double-page inquiry companions (Verso 5-Stage Chronological Spine + Recto calibrated writing tasks, pure `#000000` monochrome interior, zero Do Nows, zero standalone vocab drills, zero knowledge giveaways in stems). Never use deprecated `generate_pupil_workbooks.cjs` or `generate_textbooks.cjs`.
   - **Mastery Exam Pack:** Summative timed mock papers, mark schemes, and Grade 8/9 WAGOLLs (UI label strictly `"Mastery Exam Pack"`).
   - **Master Knowledge Retrieval Companion ("Quiz Pack"):** Spaced retrieval booklets (KS2 `4p`, KS3 `8p`, GCSE `16–28p`) verified via `pdf-parse` for zero Skia spillover and 3-tier `▸`/`▸▸`/`▸▸▸` cognitive pips.
2. **Strict 1-to-1 Narrative Block to Workbook Stage Invariant:**
   - Across all units, `lesson.narrative_blocks` and `lesson.workbook_stages` MUST both contain **exactly 5 items** in 1-to-1 correspondence (Block 1 <-> Stage 1 ... Block 5 <-> Stage 5; zero orphan intro blocks).
   - `narrative_blocks[i]` must naturally embed the 3 Trigger Terms from `workbook_stages[i]` inside `<p>` tags (zero dangling text tails). Verify via `npm run audit:stages`.
3. **Age-Calibrated Word Budgets & Readability:**
   - **KS2 (Years 5–6 / Ages 9–11):** `50–80` words per block. Sensory storytelling, concrete nouns, short sentences.
   - **KS3 (Years 7–9 / Ages 11–14):** `80–110` words per block (strict cap `120w`). Exactly 2 paragraphs (`[X.1]`, `[X.2]`, ~40–55w each). Use accessible framing (*"The Traditional View"* vs *"The Modern View"*).
   - **GCSE (Years 10–11 / Ages 14–16):** `110–140` words per block (strict cap `150w`). Exactly 2 paragraphs (`[X.1]`, `[X.2]`, ~55–70w each). Anchor strictly to Pearson Edexcel specification points (2–3 high-yield points per event; zero university-level jargon inflation).
4. **Zero AI Corporate Jargon:** Never use phrases like *"Specification Mastery & Synthesis"*, *"Holistic Framework"*, *"Synergistic Learning"*, or *"Pedagogical Ecosystem"*. Write in authentic veteran history-teacher and examiner language.

---

## 5. Pedagogical Lesson Architecture, Sources & Fact Grounding
1. **Strict Spaced-Retrieval Law for Do Now Starters:**
   - Do Now starters MUST NEVER test new content from the current lesson. Retrieve strictly from: (a) Immediate Previous Lesson, (b) Earlier in Current Unit, and (c) Synoptic Prior Topics.
2. **3-Layer Digital Lesson Architecture:**
   - **Layer 1:** 5 structured narrative blocks with paragraph indexing (`[Act.Para]`—index paragraphs only, never individual sentences) and audio read-aloud support.
   - **Layer 2:** 2–3 authentic visual support plates flanking narrative prose (`.narrative-visual-row`, alternating left/right, caption + alt text only, zero `image_context` clutter).
   - **Layer 3:** 5 rotated primary archival sources (`Source A`–`Source E`, sequential single letters, zero `A1`/`A2` sub-indices; maps labeled `Reference Map:` / `Map A:`) in collapsible drawers across varied media, rotating disciplinary badges, natural 1–2 sentence model answers, and targeted **Hinge Questions**. Zero formulaic 3-part provenance boxes (exception: Medicine Paper 1 `"How useful"` questions include `provenance_clue` scaffolding).
   - **Layer 4 (Zero Intra-Lesson Duplication):** Never reuse a Layer 2 image inside Layer 3 within the same lesson.
3. **Teacher Notes, 2-Lesson Delivery Plan & Pedagogy Bank:**
   - Every lesson in `data.js` MUST include root `teacher_notes`: `{ primer, objectives: [{ objective, primer, question }], delivery_plan }` following the `"2-Lesson Sequence (50 mins each)"` 5-phase choreography, with every `source_context` ending in a Hinge Question.
   - Whenever pedagogical/SEND/cognitive strategies are developed, proactively synthesize them into `src/pedagogy_data.js` (`PEDAGOGY_RESEARCH_BANK`) with academic citations/URLs and keep `Guide_04_Disciplinary_Pedagogy_and_Research_Evidence.pdf` (`scripts/generate_guidance_manuals.cjs`) synchronized.
4. **Strict Anti-Hallucination ("Cite-or-Silence") & Reference Shelf Guardrail:**
   - Never invent biographical details, service numbers, medal classes, or dramatic combat embellishments; ground strictly in primary records or `data/curriculum_facts_manifest.json` (`node scripts/verify_curriculum_facts.cjs <unit_id>`).
   - When consulting `G:\My Drive\TEXTBOOKS`, extract historical content ONLY—never adopt exam question formats or mark allocations from non-Edexcel or legacy textbooks.

---

## 6. Visual Provenance, Archival Styling & Reprographic Quality Gates
1. **Eyes-First Visual Pre-Flight & Master Rights Register:**
   - Always run `read_file` on EVERY visual asset before captioning or authoring questions to verify literal depicted figures, printed mastheads/dates, and medium.
   - **Zero AI Images:** Strictly forbidden from generating AI historical imagery. Use authentic archival photographs/artworks (download Wikimedia 500px thumbnails locally to `public/images/` if hotlink-protected; verify via `node scripts/verify_images.cjs`; fetch exact runtimes on ERA/YouTube video links).
   - Immediately register/update every visual asset in `scripts/master_rights_database.json` and run `node scripts/generate_rights_register_pdf.cjs`.
2. **Museum-Grade Archival Presentation:**
   - Restrict FontAwesome icons to high-level UI controls—never inside historical source excerpts. Zero fake/mock accession shelfmarks in student-facing source boxes.
   - Enforce `object-fit: contain;` on `.archival-image` (zero cropping of primary evidence). Family archive hero banners (`16:4` / `4:1`) must use horizontal physical artifacts (medals, trench maps, letters), keeping portrait headshots inside profile cards (`.kf-portrait`, or `.kf-monogram` wax seal for composite archetypes).
   - Print SVGs must include static overrides (`svg g { opacity: 1 !important; }`) so headless Chromium never renders blank animated frames.
3. **Automated Layout & Page-Budget Engine:**
   - Every PDF compiler must run `scripts/auto_calibrate_engine.cjs` in Puppeteer before `scripts/audit_page_budget.cjs` / `scripts/check_overflows.cjs` (`0px` overflow, `>= 95%` optimal space utilization) rather than manually hacking prose strings.
