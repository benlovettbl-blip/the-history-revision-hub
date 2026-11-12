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

## 1. Mandatory Workbook-to-Narrative Stage Synchronization (Zero Classroom Blindness)
To guarantee teachers and pupils can immediately match the 5 workbook enquiry stages with the reading paragraphs projected on the whiteboard:
1. **Strict 1-to-1 Alignment Invariant:** `lesson.narrative_blocks` and `lesson.workbook_stages` in `units/<unit_id>/data.js` MUST both contain **exactly 5 items** in 1-to-1 correspondence (Block 1 <-> Stage 1 ... Block 5 <-> Stage 5; zero orphan intro blocks).
2. **Word Budget Calibration (KS3 Ages 11–14):** Every `narrative_blocks[i]` must be **80–110 words** (strict cap `120w`), structured as 2 punchy paragraphs (`[X.1]`, `[X.2]`, ~40–55 words each) naturally incorporating the 3 Trigger Terms from `workbook_stages[i]`.
3. **Workbook Stage Paragraph Indexing (`paraRef`):**
   - Every stage in `workbook_stages` and the workbook renderer MUST define `para_ref` / `paraRef` (e.g. `'[1.1–1.2]'`).
   - When `lesson.workbook_stages` is present, `src/engine/lesson_renderer.js` renders the interactive **5-Stage Chronological Enquiry Spine** with **"Jump to Text"** smooth-scroll highlighting.
4. **Automated Audit Gate:** Enforced via `npm run audit:stages` (`node scripts/detailed_stage_inspection.cjs`) and `node scripts/audit_ks3_stage_sync.cjs <unit_id>`.

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

## 4. Safe Unit Synchronization Pipeline
Whenever modifying or compiling a KS3 unit, run the unit-scoped pipeline (never global `npm run sync` unless explicitly requested, and never overwrite classroom-frozen units mid-term):
```bash
node scripts/sync_unit.cjs <unit_id>
npm run audit:stages
node scripts/verify_sanitization.cjs
node scripts/verify_images.cjs
```
`scripts/sync_unit.cjs <unit_id>` validates syntax, refreshes `database.json`, compiles canonical unit PDFs (`public/pdfs/<unit_id>_pupil_workbook.pdf` and `<unit_id>_textbook.pdf`), updates the workbook page map, and runs `check_overflows.cjs`.
