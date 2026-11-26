---
name: KS3 Publishing Engine
description: Comprehensive curriculum orchestration standard and automated sync pipeline for authoring, updating, and validating Key Stage 3 units across web app, pure narrative textbooks, and double-page pupil workbooks.
---

# Key Stage 3 Publishing & Unit Orchestration Engine

## Trigger
Activate this skill whenever creating, updating, refactoring, or syncing a Key Stage 3 unit or lesson (Years 7, 8, or 9: `medieval_england`, `water_and_sanitation`, `early_modern_world`, `monarchy_religion_power`, `first_british_empire`, `second_british_empire`, `industrialisation_and_empire`, `australia`, `great_war`, `great_war_part2`, `the_shoah`, `cold_war`, `post_war_britain`).

## Delegation to Companion Skills
- **KS3 Companion Textbooks:** Must strictly follow `ks3-classroom-textbook-engine` (**100% pure narrative reading anthologies**—zero primary source boxes, zero vocabulary ribbons, zero exam rubrics, zero in-prose `para-ref` pills).
- **KS3 Pupil Workbooks:** Must strictly follow `pupil-workbook-engine` (**16-Page or 20-Page Gold Standard A3 Saddle-Stitch Double-Page Workbooks** via `scripts/render_<unit_id>_workbook.cjs`—never the retired `generate_pupil_workbooks.cjs` monolith).
- **KS3 Quiz Packs:** Must strictly follow `retrieval-companion-engine` (**8-Page Zero-Spillover Retrieval Companion**).

---

## 1. Mandatory Workbook-to-Narrative Stage Synchronization & Counsell Craft
To guarantee teachers and pupils can immediately match the 5 workbook enquiry stages with the reading paragraphs projected on the whiteboard:
1. **Strict 1-to-1 Alignment Invariant:** `lesson.narrative_blocks`, `lesson.workbook_stages`, and `lesson.causal_domino_spine.stages` in `units/<unit_id>/data.js` MUST all contain **exactly 5 items** in 1-to-1 correspondence (Block 1 <-> Stage 1 ... Block 5 <-> Stage 5; zero orphan intro blocks). *(Note: Legacy 3-trigger-word columns/chips are retired.)*
2. **Word Budget & Christine Counsell Storytelling (KS3 Ages 11–14):**
   - Every `narrative_blocks[i]` must be **80–110 words** (strict cap `120w`), structured as **exactly 2 punchy paragraphs** (`[X.1]`, `[X.2]`, ~40–55 words each).
   - **Vivid Particularity over Dry Summary:** Open or anchor blocks with concrete human micro-details, period irony, or short authentic quotes that illuminate the historical mechanism—never goofy jokes, never dry encyclopaedic lists, strictly past tense (zero historical-present tense scars), and zero `&` ampersands in narrative prose or headings. Maintain solemn register on atrocity/catastrophe enquiries (`the_shoah`, famines, massacres).
   - **Zero Visible `"Hinge"` Jargon:** Never display the word `"Hinge"` in visible UI/teacher/pupil headings; use `"Class Discussion"` or `"Quick Check"`.
3. **Co-Adaptation & Glossary Completeness:**
   - Whenever `narrative_blocks[i]` changes, verify its paired `workbook_stages[i].question` (`<= 82 chars`, zero answer giveaways), `causal_domino_spine`, and `public/data/stage_answers/<unit_id>.json` (`sync_stage_questions.cjs` + `sync_spotlight_stage_answers.cjs` + `audit_narrative_question_answerability.cjs <unit_id> --strict`).
   - Verify `data/glossary/<unit_id>.json` exists and is populated (20–25 terms), and check `src/scheme_of_work_data.js` + `data/teacher_guidance/<unit_id>.json` so unit titles/date ranges match `data.js`.
4. **Workbook Stage Paragraph Indexing (`paraRef`):**
   - Every stage in `workbook_stages` and the workbook renderer MUST define `para_ref` / `paraRef` (e.g. `'[1.1–1.2]'`).
5. **Automated Audit Gate:** Enforced via `npm run audit:stages` (`node scripts/detailed_stage_inspection.cjs` + `audit_narrative_question_answerability.cjs --strict` + `sync_spotlight_stage_answers.cjs --all --audit`).

---

## 2. Spiral Curriculum Strands & Second-Order Disciplinary Rotation
1. **Thematic Strands (`src/curriculum_strands.cjs`):**
   Every KS3 unit maps to the 4 spiral storylines rendered on Page 1 covers:
   - *Sovereignty, State & Power*
   - *Trade, Technology & Empire*
   - *Ideology, Faith & Causation*
   - *Resistance, Agency & Rights*
2. **Rotating Historical Skills:**
   Enquiries across each unit systematically rotate second-order concepts (*Change & Continuity*, *Source Utility*, *Causation & Consequence*, *Historical Significance*, *Historiographical Interpretations*, *Turning Point Analysis*) so pupils build balanced disciplinary fluency without repetitive task fatigue.
3. **KS3 Age-Appropriate Disciplinary Phrasing (11–14 Friendly):**
   - Avoid intimidating post-16 academic labels like *"orthodox critique"* or *"revisionist defense"* in pupil-facing prompts.
   - Use clear, rigorous classroom phrasing such as *"The Traditional View"* vs *"The Modern View"*, keeping high-level historical evidence intact.

---

## 3. Visual Evidence, Framing & Portrait Integrity Standards
1. **Eyes-First Visual Inspection:** Always run `read_file` on candidate images before assigning captions or questions, and synchronize every visual source in `scripts/master_rights_database.json` + `node scripts/generate_rights_register_pdf.cjs`.
2. **Universal Zero-Crop Archival Framing (`object-fit: contain`):**
   - Primary historical sources (`.archival-image`) in curriculum views and print artifacts MUST use `object-fit: contain;` on a neutral `#f8fafc` archival backing (`border: 1px solid #e2e8f0;`)—NEVER `object-fit: cover;`, which crops inscriptions or historical figures (`isCroppedSource` build failure).
   - Wide tapestries or trench maps use `.panoramic-source` (`column-span: all`).
3. **Historical Individual Portrait & Wax Seal Monogram Policy:**
   - Biographical thumbnails (`.kf-portrait`) must display authentic contemporary portraits, busts, or coin/seal profiles of that individual—never ships, castles, crowd battle scenes, or AI images.
   - For composite archetypes where no likeness exists (e.g. *"The Tudor Yeoman"*), render the typographic `.kf-monogram` wax seal badge (`RECORD` / `ARCHIVE`).
4. **Zero Intra-Lesson Image Duplication:** Layer 2 narrative support plates (2–3 alternating `.narrative-visual-row` plates) must never duplicate any image used in Layer 3 primary source drawers (`Sources A–E`).

---

## 4. Safe Unit Synchronization, Studio Audio & Full-Colour Textbook Pipeline
Whenever modifying or compiling a KS3 unit, run the unit-scoped pipeline (never global `npm run sync` unless explicitly requested, and **never overwrite prose or PDFs of classroom-frozen units** where desk copies are already printed):
```bash
node scripts/sync_unit_studio_media.mjs <unit_id>   # Required whenever narrative_blocks prose changes!
node scripts/sync_unit.cjs <unit_id>
node scripts/compile_master_textbook.cjs <unit_id>  # Re-compile Full-Colour Master Textbook AFTER sync_unit.cjs!
node scripts/build_database.cjs                     # Syncs public/data/<unit_id>.json + database_index.json slugs
node scripts/check_overflows.cjs --unit=<unit_id> --strict
npm run audit:stages
node scripts/verify_sanitization.cjs
node scripts/verify_images.cjs
```
> **Critical Ordering Note:** `scripts/sync_unit.cjs <unit_id>` invokes legacy monochrome `render_<unit_id>_textbook.cjs` if present. Always run `node scripts/compile_master_textbook.cjs <unit_id>` **after** `sync_unit.cjs` so `public/pdfs/<unit_id>_textbook.pdf` retains its Full-Colour Editorial Master Textbook layout (`97% ✅ OPTIMAL`, `>= 22px` lesson clearance / `>= 40px` cover clearance across `deviceScaleFactor: 1` and `2`).
