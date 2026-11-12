---
name: GCSE 28-Page Master Classroom Textbook Engine
description: Publishing standard and automated compiler engine for authoring, styling, and compiling 28-page pure narrative GCSE (Key Stage 4) classroom textbooks as saddle-stitch A3 print publications.
---

# GCSE 28-Page Master Classroom Textbook Publishing Standard

## Core Philosophy: The Pure Narrative Textbook
A **GCSE Classroom Textbook** is a durable, multi-year classroom resource. It is NOT a consumable pupil workbook, revision guide, or exam practice pad.
- **The Pupil Workbook:** Consumable workspace for the 5-Stage Chronological Inquiry Spine, lecture/reading note-taking, disciplinary writing practice, and living timelines.
- **The Interactive Web Application:** Multimedia digital portal with audio narrations, interactive flashcards, primary source galleries, and quizzes.
- **The Classroom Textbook (Exactly 28 Pages):** The student's continuous, immersive reading text. Its sole purpose is **rich, unbroken disciplinary historical narrative reading** during teacher-led instruction, guided reading, and independent study.

---

## 1. Zero-Clutter Pure Narrative & DoK Mandate
To ensure high-immersion reading and specification-aligned schema construction:
1. **NO Primary Source Plates:** All cartoons, source extracts, and forensic question stems belong in workbooks and web apps.
2. **NO Vocabulary Margin Strips or Glossaries:** Do not interrupt the reading flow with sidebars.
3. **NO Exam Stems or Rubrics:** Keep the textbook timeless and decoupled from shifting exam mark schemes.
4. **NO In-Prose Paragraph Numbering Pills:** Never insert repetitive bracketed pills (`<span class="para-pill">[1.3]</span>`) into the body text. Numbering belongs strictly in the block section header (`[1.3] 1920–1936 Zionist Pioneers...`).
5. **NO Archaic Symbols:** Do NOT use `§`, `Δ`, or esoteric glyphs. Use clean typographic badges (`KEY ENQUIRY QUESTION` and `DECISIVE HISTORICAL MECHANISM`).
6. **GCSE Depth of Knowledge (DoK) Calibration:** Strictly anchor content to Pearson Edexcel GCSE specification bullet points (2–3 high-yield points per mechanism/event). Never inject university-level biochemistry, pathology, or peripheral off-spec trivia.

---

## 2. High-Legibility Typography & Ergonomics
- **Body Font:** High-legibility classical serif (`Lora`, Georgia, or Charter), strictly **`11.5pt` to `12.0pt`** (never reduce below `11.0pt`).
- **Line Height:** `1.58` to `1.62` for comfortable reading.
- **Display Headings:** Dignified classical serif (`Cinzel`, 700/800/900 weight).
- **Metadata & Badges:** Clean modern sans-serif (`Inter`, 600/700/800 weight).
- **Prose Color:** Deep slate ink (`#1e293b`), never washed-out gray or harsh pitch black.
- **2-Column Layout:** `18mm` side margins, `13mm` top/bottom margins, `8mm` column gap.

---

## 3. Strict 28-Page Master Booklet Architecture (7 Folded A3 Sheets)
Physical saddle-stitched booklets require multiples of 4 pages. An in-depth GCSE unit consists of **exactly 28 pages**:

### Page 1: Master Front Cover
- **Top Masthead:** `THE HISTORY REVISION HUB • MASTER CURRICULUM SERIES | KEY STAGE 4 • PEARSON EDEXCEL GCSE [OPTION]`
- **Title Block:** Prominent title in Cinzel 900 (`23pt`), subtitle in Lora italic, and date range pill (`1945 – 1995`).
- **Hero Artwork Plate:** Authentic primary photograph or artwork (`82mm` width x `76mm` height, `object-fit: contain` or natural uncropped framing) with archival caption underneath.
- **Atmospheric Story Blurb:** Titled `HISTORICAL OVERVIEW • [DATES]` (strictly NO corporate headings like "Volume Scope" or "Crossroads of Fire"). Two narrative paragraphs setting the human drama.
- **12-Enquiry Table of Contents Directory:** White card grid (`2 x 6`) displaying all 12 Enquiries with code badges, titles, page locators (`pp. 4–5`), and enquiry focus questions.
- **Dynamic Font Scaler:** Must execute `autoFitCoverEnquiries()` in browser to maximize page space while maintaining an `8px`–`20px` footer gap.
- **Zero Clutter:** Strictly NO "Core Concepts" strip and NO duplicate specification headers on the cover.

### Page 2: Inside Front Cover — Course Specification & Disciplinary Directory
- **Full Syllabus Alignment:** Maps all Key Topics and canonical lessons to official Pearson Edexcel specification anchor statements and exact spread cross-references (`Spread X • pp. Y–Z`).
- **Dynamic Auto-Fit:** Scaled via `autoFitInsideCoverDirectory()` to achieve `0px` overflow and `>= 95%` vertical space utilization.

### Page 3: Master Chronological Milestone Spine (Zero Maps Standard)
- **Chronology Highway:** 15–18 defining causal turning points arranged vertically with a connecting spine line, circular node dots, date badges, and high-impact bold titles.
- **Zero Clutter Tags:** Strictly ZERO `Ref [X.Y]` clutter tags; use an anti-gap `flex-start` layout with controlled gap.
- **Dynamic Auto-Fit:** Scaled via `autoFitPage3Milestones()` to achieve high legibility (`7.4pt`–`8.8pt`) and `>= 95%` space utilization.
- **STRICTLY ZERO MAPS ON PAGE 3:** Never place maps or flashpoint grids on Page 3. Preserving Page 3 as the chronological spine guarantees 100% pure narrative focus and ensures flat double-page spread parity starting on Page 4 (Verso).

### Pages 4–27: 12 Canonical Disciplinary Enquiry Spreads (2 Pages Each)
Each enquiry is strictly contained within ONE flat double-page spread (`2 pages = Verso + Recto`):
- **Verso (Left Page / Part I):** Running header, Enquiry title banner + `KEY ENQUIRY QUESTION` badge, 2-Column body prose (`[X.1]`, `[X.2]`, etc.), running footer.
- **Recto (Right Page / Part II: Climax, Turning Points & Consequences):** Running header, Part II subtitle + `DECISIVE HISTORICAL MECHANISM` badge and causal thesis, 2-Column body prose, running footer.

### Page 28: Master 60-Question Knowledge Retrieval Quiz (Back Cover)
- **Classroom Retrieval Header:** Title `Master Knowledge Retrieval Quiz`, subtitle `60 Essential Recall Questions • [Unit Title]`, badge `Partner Quiz or Solo Practice`.
- **Instruction Banner:** Actionable instructions for paired oral quizzing and independent notebook practice.
- **6 Topic Cards (`2 x 3` Grid):** 6 cards covering 2 enquiries each (10 recall questions per card, Qs 1–60), citing exact paragraph ranges (`pp. 4–7 • Ref [1.1]–[2.5]`).
- **Zero Answers Printed:** Keeps the back cover strictly active for oral or written retrieval practice.

---

## 4. Reprographics & Page Budget Audit Standard
Every textbook MUST execute `scripts/auto_calibrate_engine.cjs` inside Puppeteer and pass `node scripts/audit_page_budget.cjs` before release:
1. **0px Overflow Gate:** Every page must satisfy `scrollHeight <= clientHeight + 2px`.
2. **Exact Physical Page Count:** Verified `28` pages via `pdf-parse` (0 blank pages, 0 spillover pages).
3. **Page Budget Gate:** Footer voids `<= 25px`; space utilization `>= 95%` (`✅ OPTIMAL`).
4. **Strict School Anonymity:** Zero school-specific identifiers; branding is strictly *"The History Revision Hub"*.

---

## 5. Turnkey CLI Execution
```bash
npm run build:textbook:eee
npm run build:textbook:weimar
npm run build:textbook:usa
npm run build:textbook:cme
npm run build:textbook:medicine
npm run build:textbook:cold_war
```
