---
name: Pupil Workbook Engine
description: Unified Gold Standard reprographic and pedagogical standard for KS3 and GCSE (Edexcel 9-1) A3 saddle-stitch double-page pupil workbooks, exam tariffs, Dual-Pathway timelines, and Exercise-Book Verso spines.
---

# Unified Pupil Workbook Engine (KS3 & GCSE Gold Standard)

## Trigger
Activate this skill whenever creating, modifying, auditing, or compiling any printed Pupil Workbook (`scripts/render_*_workbook.cjs`, `pupil_workbook.html`) across Key Stage 3 or GCSE (Key Stage 4).
**Strict Prohibition:** Never run the deprecated legacy monolith `scripts/generate_pupil_workbooks.cjs`.

---

## 1. Chromatic, Cover & Reprographic Geometry
1. **Saddle-Stitch Multiples of 4 Pages:** Every physical booklet must compile to an exact multiple of 4 A4 portrait pages (`16`, `20`, or `24` pages = `4`, `5`, or `6` folded A3 sheets) so every lesson sits on a flat facing **Double-Page Spread (Left Verso + Right Recto)**.
2. **Pages 1 & Back Cover (Color Covers) via `scripts/components/render_standard_cover.cjs`:**
   - **Commercial Customizer Hook:** Enclose `<span class="school-brand-target">The History Department</span>` inside `data-department-name="The History Department"` so purchasing schools can stamp covers via `?school=...` or `SCHOOL_NAME`.
   - **Responsive Artwork Aspect-Ratio Gate (`detectArtworkAspectRatioSync`):**
     * **Landscape (`>= 1.15`, `top-showcase`):** `89–90mm` full-width cinematic top plate (`object-fit: contain`) + dual-column analytical deck underneath.
     * **Portrait (`< 1.15`, `split-column`):** `70mm` split grid with `118–122mm` framed portrait plate (`object-fit: contain`) + vertical analytical deck.
   - **Cover Pedagogical Components:** 4 Core Features, 3-Pillar Visual Matrix, Disciplinary Significance Anchor, Targeted Hinge Question, Museum Provenance Strip, Pupil Info (`Name`, `Class`, `Teacher` — zero target grades on KS3 covers), and dynamically padded Course Specification Table (`>= 98%` fill, `0px` overflow).
3. **Pure `#000000` Monochrome Interior (Pages 2 to `N-1`):**
   - Strictly `#000000` text, borders, and ruled lines on `#ffffff` (subtle `#f8fafc` tint only where required). Eliminate interior navy (`#0f284e`), green, or amber fills to prevent school photocopier dithering.

---

## 2. Verso (Left Page): Chronological Inquiry Spine Architectures
Every lesson Verso page pairs 1-to-1 with the 5 `narrative_blocks` (`[X.1]`–`[X.5]`), rotating high-cognitive question stems (`What factors led to...`, `In what ways did...`, `What forced...`, `To what extent...`). Two approved Verso templates:

### Template A: Standard 5-Stage Boxed Spine
- 5 stage blocks (`flex: 1`) with single-line stage banners (step badge, date, rotated question stem, `paraRef` badge) and 5–6 ruled note-taking lines (`~172mm` width).
- Left Trigger Column (`26mm`–`44mm`): **Spec-Anchored Triad** drawn strictly from the approved revision guide (zero off-spec niche jargon) enforcing the **Zero-Echo Filter** (never repeat words already in the stage banner) across 3 levers: (1) Concrete Evidence, (2) Causal Friction, (3) Significance/Outcome.

### Template B: Shoah Sandbox Exercise-Book Verso (Streamlined Canvas)
- **Top Compact Reference Card:** *5 Core Inquiry Questions • Chronological Roadmap* (Questions 1–5; zero printed trigger-word boxes—triggers remain naturally embedded in lesson prose).
- **Main Writing Canvas:** Authentic British Exercise Book Canvas (`25` uninterrupted ruled lines at `~8.0mm` pitch) with a clean **`26mm` vertical left margin rule**, placing stage badges (`[1]`–`[5]`) and dates inside the margin every 5th line.

---

## 3. Recto (Right Page): Disciplinary Writing & Zero-Giveaway Scaffolding
1. **Strict Separation (Workbook vs Web App):**
   - **ZERO In-Workbook "Do Now" Starters** and **ZERO Standalone Vocab Drills** (cloze, match-ups, Frayer models).
   - **ZERO Adult Specification Strips** on pupil interior pages.
   - **ZERO Duplicate Stems:** Never stack both `Sentence Stems:` and `Analytical Connectives:`. Render ONE clean `Analytical Connectives:` row alongside `Key Terms:`.
2. **Zero Knowledge Giveaways:**
   - Connectives must be 100% content-free structural transitions (KS3 11–14 friendly: `One key consequence was that... • For example, this meant that... • As a result...`; GCSE: `A decisive factor was... • Furthermore, this led directly to... • Ultimately...`). Never embed factual answers, dates, or treaty clauses in stems.
3. **Gap-Free Ruled Lines & Whole-Page Extended Question Sizing:**
   - Group Exam Header, Question Prompt, Scaffolding Strip, and Ruled Lines inside a unified vertical flex container (`gap: 2px`, `1mm` margin above lines—never `justify-content: space-between` across sparse siblings).
   - Calibrate handwriting pitch to **`~7.8mm–8.2mm`** (never exceeding `10.5mm`):
     * Extended single questions (`8m` narrative/importance, `12m` explain why, `16m` essay) MUST occupy the **entire Recto page alone** (`21–23` lines).
     * Short split drills (`4m + 4m` or `2m + 2m + 4m`) share a page (`8 + 14` lines).

---

## 4. Center-Spine Specification Mind-Map Canvas, Exercise Notes & Back Cover
1. **Pages 2–3 Center-Spine Specification Mind-Map Canvas (Zero Giveaways, Edge-to-Edge):**
   - **Continuous Vertical Spine:** Render a continuous `2.5px` `#000000` vertical center line down the middle of Pages 2 and 3 (`left: 50%; transform: translateX(-50%)`).
   - **Centered Executive Specification Pills:** Solid `#000000` rounded pills (`box-shadow: 0 0 0 6px #ffffff` halo over the spine) containing a `#ffffff` date badge, exact Pearson Edexcel specification turning point title, and `(Key Topic X.Y)` tag (3–4 nodes per page).
   - **Zero Giveaways & Zero Lined Boxing:** Strictly NO summary paragraphs under pills, NO AI jargon labels (*"Decisive Mechanism"*), and NO dashed or solid enclosing boxes—leave 100% open white paper edge-to-edge so pupils can branch mind-maps freely to the margins.
   - **Specification Branch Cues & Web App Synergy:** Flank each pill with concise uppercase directional cues (`◂ Left Spec Theme` / `Right Spec Theme ▸`) rendered in **100% pure `#000000` black** (zero `#777`/`#888` grey text or `opacity` knockouts that dither or drop out on school photocopiers), and direct pupils in the top masthead + lesson bottom mission strip to use the app's **Consolidate Station** to retrieve keywords and populate their mind-map at the end of each lesson.
   - **Ethical Exception (*The Shoah*):** `public/units/the_shoah/pupil_workbook.html` retains its *"Six Lives: Micro-Histories of the Holocaust"* centrefold untouched.
2. **British Exercise Notes Spread (Pages `N-2` & `N-1`, e.g. P14–15):**
   - Left notes page: Clean header `"General Notes"` (or Key Topic Notes) + `26mm` vertical margin rule + `28–32` full-width ruled lines.
   - Right notes page: Uncluttered full-page blank ruled lines canvas with `26mm` margin and zero instructional clutter boxes.
3. **Outside Back Cover (Page `N`, e.g. P16 / P20):**
   - KS3/GCSE Assessment Pathways, **6-Row Marking Grid** (Enquiries + 1 `"Teacher-Designated Assessment Task"` — never include an `"Independent Study & Notes Portfolio"` row), and Dual Vector QR Hub.

---

## 5. Pearson Edexcel GCSE Specification Tariff Guardrails
1. **Paper 1 — Medicine in Britain & Western Front (`edexcel_medicine`):**
   - *Section A (Western Front):* `Q1(a)` & `Q1(b)` Describe one feature `[2m + 2m]`; `Q2(a)` Utility of Sources A & B `[8m]` (include Medicine-only `provenance_clue` scaffolding for author/audience/motive); `Q2(b)` 4-Step Follow-Up `[4m]` (never omit).
   - *Section B (Thematic c1250–Present):* ZERO feature questions. Only `Q3` Similarity/Difference `[4m]`, `Q4` Explain why `[12m]`, `Q5/Q6` Essay `[16m + 4m SPaG]`.
2. **Paper 2 Period Study — Conflict in the Middle East (`cme_new`):**
   - **Strictly 32 marks across 3 question types (ZERO 12-mark questions):** `Q1(a)/(b)` Two Consequences `[4m + 4m]`; `Q2` Analytical Narrative `[8m]`; `Q3` Two Importance questions from three `[8m + 8m]`.
3. **Paper 2 B1 — Early Elizabethan England (`eee`):**
   - **100% Factual Recall (ZERO primary sources, ZERO interpretations):** `Q1(a)/(b)` Two Features `[2m + 2m]`; `Q2` Explain why `[12m]`; `Q3` Statement Essay `[16m + 4m SPaG]`.
4. **Paper 3 Modern Depth — Weimar & Nazi Germany / USA (`weimar_nazi_germany`, `usa`):**
   - 4-4-4-4 balance across Key Topics: `Q1` Inference `[4m]` + `Q2` Explain why `[12m]`; `Q3(a)` Utility `[8m]`; `Q3(b)` Difference `[4m]` + `Q3(c)` Why different `[4m]`; `Q3(d)` Interpretation Essay `[16m + 4m SPaG]`.
   - Layer 3 digital/source sets must blend 7 authentic media types (written extracts, event photos, cartoons, posters, state decrees, banknotes/artefacts, fine art—zero passive portrait headshots).
5. **Exam Question Provenance Pills:** Tag every GCSE practice question with official session (`Edexcel June 2023`, `.exam-provenance-pill.past`), `★ High-Yield Forecast` (`.forecast`), or `Unexamined Spec Target` (`.unexamined`).

---

## 6. Automated Audit & Single Canonical PDF Output
- Run `scripts/auto_calibrate_engine.cjs` in Puppeteer before `node scripts/audit_page_budget.cjs` (`0px` overflow, `>= 95%` fill) and verify physical page count via `pdf-parse`.
- Output strictly ONE canonical PDF (`public/pdfs/<unit_id>_pupil_workbook.pdf` or approved KT/master volume in `src/verified_pdf_manifest.js`—zero untracked alias clones).

