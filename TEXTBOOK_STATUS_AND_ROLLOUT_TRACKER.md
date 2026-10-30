# The History Revision Hub: Master Textbook Status & Rollout Tracker (2026–2027)
**Comprehensive Multi-Stage Ledger for Pure Narrative Classroom Textbooks (KS3 8/12-Page & GCSE 28-Page Saddle-Stitch Editions)**  
*Single Source of Truth • Academic Year 2026–2027 • Maintained by Department AI Pair-Programmer*

---

## 🏛️ The Pure Narrative Classroom Textbook Standard (The Benchmark)

Every master companion textbook adheres strictly to the **Pure Narrative Architecture** established across **Year 7 (`medieval_england`)** and **GCSE (`cme_new`)**:

1. **The Strict Separation of Curricular Pillars:**
   - **Classroom Textbook (Durable Multi-Year Reading Anthology):** 100% pure narrative historical text in two balanced columns of high-legibility Lora serif ($\ge 10.5\text{pt}$–$11.5\text{pt}$, $1.50$–$1.58$ line height). **Zero source boxes, zero vocab ribbons, zero exam rubrics, zero writing prompts.**
   - **Pupil Workbook (Consumable Writing Companion):** Dedicated strictly to the 5-Stage Chronological Inquiry Spine (Verso) and Calibrated Disciplinary Writing Tasks (Recto), with the flat Living Timeline centrefold. **Zero internal primary source plates.**
   - **Interactive Digital Portal:** The true home of Layer 3 Rotated Disciplinary Sources (Sources A–E in collapsible drawers with academic provenance, audio narration, teacher Hinge questions, and model answers).
   - **Mastery Exam Pack:** Dedicated summative examination compendiums containing formal exam board source evaluation, utility, and inference questions with official mark schemes and Grade 8/9 WAGOLLs.

2. **Reprographic Saddle-Stitch Constraints:**
   - Every physical publication must be a multiple of 4 pages (A3 sheets folded in half):
     * **KS2 Companion Readers:** Exactly 8 or 16 Pages (2 or 4 folded A3 sheets).
     * **KS3 Companion Textbooks:** Exactly 8 or 12 Pages (2 or 3 folded A3 sheets).
     * **GCSE Master Textbooks:** Exactly 28 Pages (7 folded A3 sheets, saddle-stitch bound).
   - **Zero Blank Pages:** Every page must achieve $\ge 95\%$ space utilization (`✅ OPTIMAL`) with zero trailing blank/orphan pages.

3. **Workbook Stage Cross-Referencing:**
   - Every narrative block header (`[X.Y] Title`) features a dedicated `.block-workbook-question` pill:
     `[WORKBOOK ENQUIRY] “<Exact Enquiry Question from Pupil Workbook Stage>”`
   - Binds teacher reading instruction directly to pupil note-taking and disciplinary writing tasks.

4. **Automated Reprographics & Dynamic In-Browser Auto-Calibration:**
   - Built into Puppeteer rendering pipelines: automatically detects multi-column boundary overflows (`r.right > pRect.right + 4`) and micro-tunes font size (`0.03pt` increments), line-height, and paragraph margins.
   - Enforces **0px height overflow**, **0 phantom column spills**, and positive clearance ($\ge +2\text{px}$ to $+24\text{px}$) above all running footers.

---

## 📊 Universal Master Textbook Status Matrix (All 20 Units)

### Key Stage 4 / GCSE Master Textbooks (28-Page Saddle-Stitch Standard)

| Unit ID | Specification Option | Format | Pure Narrative | Workbook Questions Injected | Dynamic Auto-Calibration | Reprographics Audit (`npm run test:textbooks`) | Notes & Next Action |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **`cme_new`** | Pearson Edexcel Option P5 | 28-Page | ✅ YES | ✅ **YES** (48/48 Blocks) | ✅ **ACTIVE** | ✅ **PASS (28/28, 0px)** | **100% COMPLETE & VERIFIED.** All 12 enquiries cross-referenced to workbook; 0px overflow, 96%–97% utilization. |
| **`eee`** | Pearson Edexcel Option B4 | 28-Page | ✅ YES | ✅ **YES** (60/60 Blocks) | ✅ **ACTIVE** | ✅ **PASS (28/28, 0px)** | **100% COMPLETE & VERIFIED.** All 60 narrative blocks cross-referenced to workbook; 0px overflow, 97%–98% utilization. |
| **`weimar_nazi_germany`** | Pearson Edexcel Option 31 | 28-Page | ✅ YES | ✅ **YES** (48/48 Blocks) | ✅ **ACTIVE** | ✅ **PASS (28/28, 0px)** | **100% COMPLETE & VERIFIED.** All 12 enquiries cross-referenced to workbook with clean badge-free italic questions; 0px overflow, 96%–98% utilization. |
| **`usa`** | Pearson Edexcel Option P4 / US | 28-Page | ✅ YES | ✅ **YES** (48/48 Blocks) | ✅ **ACTIVE** | ✅ **PASS (28/28, 0px)** | **100% COMPLETE & VERIFIED.** All 12 enquiries cross-referenced to workbook with clean badge-free italic questions; 0px overflow, 97%–98% utilization. |
| **`edexcel_medicine`** | Pearson Edexcel Option 11 | 5x Era (64p) | ✅ YES | ✅ **YES** (130/130 Blocks) | ✅ **ACTIVE** | ✅ **PASS (64/64, 0px)** | **100% COMPLETE & VERIFIED.** All 130 narrative blocks across 5 eras cross-referenced to workbook; 0px overflow, 96%–98% utilization. |

---

### Key Stage 3 Companion Textbooks (8-Page & 12-Page Saddle-Stitch Standard)

| Unit ID | Year Group | Format | Pure Narrative | Workbook Questions Injected | Dynamic Auto-Calibration | Reprographics Audit (`npm run test:textbooks`) | Notes & Next Action |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`medieval_england`** | Year 7 | 8-Page | ✅ YES | ✅ **YES** (5/5 Lessons) | ✅ **ACTIVE** | ✅ **PASS (8/8, 0px)** | **100% COMPLETE & VERIFIED.** Gold Standard reference textbook; 25-Q retrieval back cover. |
| **`great_war`** | Year 9 | 8-Page | ✅ YES | ✅ **YES** (25/25 Blocks) | ✅ **ACTIVE** | ✅ **PASS (8/8, 0px)** | **100% COMPLETE & VERIFIED.** 25 badge-free stage questions injected, 25-Q recall back cover; 0px overflow, 97% utilization. |
| **`monarchy_religion_power`** | Year 8 | 8-Page | ✅ YES | ✅ **YES** (25/25 Blocks) | ✅ **ACTIVE** | ✅ **PASS (8/8, 0px)** | **100% COMPLETE & VERIFIED.** 25 badge-free stage questions injected, 25-Q recall back cover; 0px overflow, 97% utilization. |
| **`first_british_empire`** | Year 8 | 8-Page | ✅ YES | ✅ **YES** (25/25 Blocks) | ✅ **ACTIVE** | ✅ **PASS (8/8, 0px)** | **100% COMPLETE & VERIFIED.** 25 badge-free stage questions injected, 25-Q recall back cover; 0px overflow, 97% utilization. |
| **`australia`** | Year 8 | 8-Page | ✅ YES | ✅ **YES** (25/25 Blocks) | ✅ **ACTIVE** | ✅ **PASS (8/8, 0px)** | **100% COMPLETE & VERIFIED.** 25 badge-free stage questions injected, 25-Q recall back cover; 0px overflow, 97% utilization. |
| **`post_war_britain`** | Year 9 | 8-Page | ✅ YES | ✅ **YES** (25/25 Blocks) | ✅ **ACTIVE** | ✅ **PASS (8/8, 0px)** | **100% COMPLETE & VERIFIED.** 25 badge-free stage questions injected, 25-Q recall back cover; 0px overflow, 97% utilization. |
| **`great_war_part2`** | Year 9 | 12-Page | ✅ YES | ✅ **YES** (25/25 Blocks) | ✅ **ACTIVE** | ✅ **PASS (12/12, 0px)** | **100% COMPLETE & VERIFIED.** 25 badge-free stage questions injected across 5 double-page spreads, 60-Q recall quiz back cover; 0px overflow, 96-98% utilization. |
| **`second_british_empire`** | Year 8 | 12-Page | ✅ YES | ✅ **YES** (25/25 Blocks) | ✅ **ACTIVE** | ✅ **PASS (12/12, 0px)** | **100% COMPLETE & VERIFIED.** 25 badge-free stage questions injected across 5 double-page spreads, 35-Q recall quiz back cover; 0px overflow, 97% utilization. |
| **`the_shoah`** | Year 9 | 12-Page | ✅ YES | ✅ **YES** (35/35 Blocks) | ✅ **ACTIVE** | ✅ **PASS (12/12, 0px)** | **100% COMPLETE & VERIFIED.** 35 badge-free stage questions injected across 7 canonical enquiries, 35-Q recall quiz back cover; 0px overflow, 97% utilization. |
| **`cold_war`** | Year 9 | 12-Page | ✅ YES | ✅ **YES** (35/35 Blocks) | ✅ **ACTIVE** | ✅ **PASS (12/12, 0px)** | **100% COMPLETE & VERIFIED.** 35 badge-free stage questions injected across 7 canonical enquiries, 35-Q recall quiz back cover; 0px overflow, 97% utilization. |
| **`water_and_sanitation`** | Year 7 | 12-Page | ✅ YES | ✅ **YES** (35/35 Blocks) | ✅ **ACTIVE** | ✅ **PASS (12/12, 0px)** | **100% COMPLETE & VERIFIED.** Upgraded from legacy 14p boxed prototype to 12p saddle-stitch pure narrative standard. 35-Q recall back cover, 4 Hampshire fieldwork flashpoints, badge-free italic questions; 0px overflow, 97% utilization. |
| **`industrialisation_and_empire`** | Year 8 | 12-Page | ✅ YES | ✅ **YES** (25/25 Blocks) | ✅ **ACTIVE** | ✅ **PASS (12/12, 0px)** | **100% COMPLETE & VERIFIED.** Upgraded to 12p pure narrative standard (*The Industrial Revolution 1750–1900*). *Coalbrookdale by Night* cover plate, 25 badge-free stage questions, 35-Q recall quiz back cover; 0px overflow, 97% utilization. |

---

### Key Stage 2 Companion Readers (8-Page & 16-Page Standard)

| Unit ID | Year Group | Format | Pure Narrative | Workbook Questions Injected | Dynamic Auto-Calibration | Reprographics Audit (`npm run test:textbooks`) | Notes & Next Action |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`ks2_ww2`** | KS2 (Y5/6) | 16-Page | ✅ YES | ✅ **YES** (34/34 Blocks) | ✅ **ACTIVE** | ✅ **PASS (16/16, 0px)** | **100% COMPLETE & VERIFIED.** All 34 narrative blocks cross-referenced to workbook; 0px overflow, 97% space utilization. |

---

## 🛠️ Detailed Migration Blueprint: `water_and_sanitation` (14p Boxed ➔ 12p Pure Narrative)

### 1. The Problems with Current State (`textbook_PUBLISHER.html`)
- **Physical Page Budget Violation:** Budgeted at 14 pages (3.5 sheets of A3), creating 2 orphan/blank pages upon physical printing and binding.
- **Cognitive Clutter & Split Attention:** Right-hand pages are crowded with *Key Figure* cards (e.g. Frontinus), *Engineering Spotlights* (gravity conduits), *Dispatches*, and *Enquiry Decks*.
- **Curricular Redundancy:** Vocabulary decks and source analysis boxes duplicate the [Pupil Workbook](file:///c:/Projects/the-history-revision-hub/units/water_and_sanitation/pupil_workbook.html) and clutter the continuous reading text.
- **Typographical Pinch:** Body text is forced down to `8.0pt`–`9.4pt` to fit around the callout boxes.

### 2. The 12-Page Pure Narrative Target Architecture
- **Page 1 (Master Cover):** Top masthead, hero artwork plate (Roman Aqueduct at Segovia / Roman Bath), historical overview synopsis, and 6-Lesson Scheme of Work Directory.
- **Page 2 (Master Chronology):** 15 decisive milestones from Roman water supply (AD 43) to Victorian Great Stink and modern clean water legislation.
- **Pages 3–11 (Five 2-Page Spreads):** 100% pure narrative historical text across 5 double-page thematic spreads (Roman Public Health, Medieval Monastic Water, Early Modern Urban Filth, The Industrial Cholera Crisis & John Snow, and The 1875 Public Health Revolution).
  * Body font: `10.8pt` Lora serif, 1.52 line height, 2 balanced columns.
  * Zero source boxes, zero vocab ribbons.
  * Injected `.block-workbook-question` banners matching `water_and_sanitation_twopage_workbook.cjs`.
- **Page 12 (Master Knowledge Retrieval Quiz Back Cover):** 30 essential factual recall questions across 6 thematic cards (5 questions each), 0 answers printed.

### 3. Preserving Fieldwork Assets (Zero Asset Loss)
- The local Hampshire fieldwork assets (*Fishbourne Roman Palace Conduits & Flushed Latrines*, *Titchfield Abbey Monastic Sluices*, *Eastney Beam Engine Pumping Station*) will be promoted to authentic **Layer 3 Source Drawers** in the web application with high-resolution imagery and teacher Hinge questions.

---

## 🎯 Prioritized Phased Rollout Plan

### Phase 1: GCSE 28-Page Workbook Question Completion
1. **`cme_new`:** ✅ COMPLETE & VERIFIED (48/48 blocks, 0px overflow).
2. **`eee`:** ✅ COMPLETE & VERIFIED (60/60 blocks, 0px overflow).
3. **`weimar_nazi_germany`:** ✅ COMPLETE & VERIFIED (48/48 blocks, badge-free italic questions, 0px overflow).
4. **`usa`:** ✅ COMPLETE & VERIFIED (48/48 blocks, badge-free italic questions, 0px overflow).

### Phase 2: High-Density KS3 Question Rollout
1. **`medieval_england`:** ✅ COMPLETE & VERIFIED (8-Page Gold Standard).
2. **`water_and_sanitation`:** ✅ COMPLETE & VERIFIED (12-Page Pure Narrative Standard, 35/35 blocks, 35-Q recall quiz back cover).
3. **`great_war`** & **`monarchy_religion_power`**: Inject causal domino questions into 8-page compilers.
4. **`the_shoah`** & **`cold_war`**: Inject questions into 12-page compilers.

### Phase 3: Legacy Unit Modernization
1. **`water_and_sanitation`**: ✅ COMPLETE & VERIFIED. Modernized to 12-page pure narrative format; retired 14-page boxed prototype; integrated into `npm run test:textbooks`.
2. **`industrialisation_and_empire` (The Industrial Revolution 1750–1900)**: ✅ COMPLETE & VERIFIED. Modernized to 12-page pure narrative format with *Coalbrookdale by Night* cover plate, 25 badge-free questions, and 35-Q quiz back cover; integrated into `npm run test:textbooks`.

