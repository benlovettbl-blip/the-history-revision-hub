---
name: KS3 Classroom Textbook Engine
description: Publishing standard and automated compiler engine for authoring, styling, and compiling Key Stage 3 companion classroom textbooks as pure, high-legibility narrative reading anthologies (8-Page and 12-Page A3 Saddle-Stitch formats).
---

# Key Stage 3 Classroom Textbook Engine

## Core Philosophy: The Textbook vs. The Workbook
A **Classroom Textbook** is a durable, multi-year classroom resource that stays in the school. It is NOT a consumable student workbook.
- **The Pupil Workbook (16 or 20 pages):** The student's personal examination workspace containing the 5-Stage Chronological Inquiry Spine, note-taking lines, calibrated disciplinary writing lines, and centrefold living timeline.
- **The Interactive Web Application:** The multimedia digital portal containing audio narrations, interactive flashcards, self-marking retrieval quizzes, and primary source galleries.
- **The Classroom Companion Textbook:** The student's continuous reading text. Its sole purpose is **immersive, high-legibility, narrative reading** during teacher-led instruction and guided reading.

---

## 1. Zero-Clutter Pure Narrative Mandate
To ensure the reading experience is clear, immersive, and accessible for Key Stage 3 pupils (Years 7–9):
1. **NO Primary Source Plates:** All primary sources, document excerpts, and visual artifact plates belong strictly in the web application and pupil workbook. Do not embed source boxes in the textbook prose.
2. **NO Vocabulary Ribbons:** Vocabulary definitions belong in the web application and pupil workbook tasks. Do not crowd the textbook margins with glossary strips.
3. **NO Writing Tasks or Synthesis Prompts:** Essay stems, 12-mark questions, and exam rubrics belong in the pupil workbook.
4. **NO QR Codes or Student Tracking Ledgers on Back Covers:** Because textbooks stay in the classroom, student progress ledgers and mobile quiz QR codes are redundant and must NOT appear on the back cover.
5. **Exact 1:1 Verbatim Fidelity to App Data:** All prose must be read dynamically from `units/<unit_id>/data.js` (`narrative_blocks`). No words, dates, or historical arguments may be modified or fabricated. In-prose paragraph tags (`<span class="para-ref">[1.1]</span>`) are stripped to prevent duplicate numbering against section headers (`[1.1] TITLE`).

---

## 2. High-Legibility Typography Standards
With sidebars and source boxes removed, page real estate is dedicated entirely to prose readability:
- **Body Font Size:** `10.15pt` to `11.5pt` depending on enquiry word budget (never reduce below `10.0pt`).
- **Line Height:** `1.45` to `1.55` for effortless eye tracking across 2 columns.
- **Font Families:** Classical serif for narrative (`Lora`, Georgia, or Charter); classical serif for display titles (`Cinzel`); italic serif for synopsis/enquiry questions (`Playfair Display`); modern sans-serif for running headers and metadata (`Inter`).
- **Paragraph Referencing:** Every block section begins with an explicit bold index in the section header: `[X.Y] TITLE`, matching pupil workbook citations 1-to-1.
- **Column Clearance Guardrail:** Column typography must be calibrated so that every column ends with positive clearance (`>= +25px`) above the running footer line.

---

## 3. Reprographic Architecture Models (Multiples of 4 Pages / A3 Saddle-Stitch)

### Model A: 8-Page Master Classroom Textbook (2 Folded A3 Sheets)
- **Page 1: Master Front Cover** — Top Masthead (`THE HISTORY REVISION HUB • KEY STAGE 3 DISCIPLINARY CLASSROOM TEXTBOOK`), Date Pill, Main Title (`Cinzel` 900), Hero Artwork Plate (`80mm` height) with archival caption, Canonical Unit Narrative Synopsis (`src/unit_synopses.js` in `Playfair Display` italic), and clean Scheme of Learning Directory (zero technical jargon like `A3 Saddle-Stitch Reader`).
- **Page 2: Master Chronological Milestone Spine** — 12 decisive milestones & causal dominoes arranged along a vertical chronology spine with circular nodes, date boxes, and titles.
- **Pages 3–7: Five Canonical Enquiries (1 Full Page per Enquiry)** — Running header, Enquiry banner (`ENQUIRY 0X`, title in `Cinzel`, `Key Enquiry Question` badge), 2-Column justified narrative prose (`[X.1]`–`[X.5]`).
- **Page 8: Master Knowledge Retrieval Quiz Back Cover (25 Questions)** — 5 Enquiry Quiz Cards (5 questions each, Qs 1–25) in `9.5pt` Lora. Zero answers printed.

### Model B: 12-Page Double-Page Spread Textbook (3 Folded A3 Sheets)
- **Page 1:** Master Front Cover.
- **Page 2:** Master Chronological Milestone Spine.
- **Pages 3–11:** Canonical Double-Page / Multi-Enquiry Spreads.
- **Page 12:** Master 35- or 60-Question Knowledge Retrieval Quiz Back Cover. Zero answers printed.

---

## 4. Automated Reprographics & Page Budget Audit Gates
Every compiled textbook MUST execute `scripts/auto_calibrate_engine.cjs` in headless Chromium and pass automated auditing before release:
1. **0px Overflow Gate:** Every page must satisfy `scrollHeight <= clientHeight + 2px`.
2. **Exact Physical Page Count:** Verified `8` or `12` pages via `pdf-parse` (0 blank pages, 0 spillover pages).
3. **Column Spillover Clearance Gate:** Positive clearance (`>= +25px`) above running footers.
4. **Space Utilization Gate:** Run `node scripts/audit_page_budget.cjs` (`>= 95%` utilization, `✅ OPTIMAL`).
5. **Institutional Neutrality & Canonical Naming:** Strictly *"The History Revision Hub"*, zero school identifiers, saved to canonical `public/pdfs/<unit_id>_textbook.pdf` (or `_FINAL.pdf` where mapped in `verified_pdf_manifest.js`).
