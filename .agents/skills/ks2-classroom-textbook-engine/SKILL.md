---
name: KS2 Classroom Textbook Engine
description: Publishing standard and automated compiler engine for authoring, styling, and compiling Key Stage 2 companion classroom textbooks as pure, high-legibility narrative reading anthologies (Single Wide-Margin Column Model, 8-Page and 16-Page A3 Saddle-Stitch formats).
---

# Key Stage 2 Classroom Textbook Engine

## Core Philosophy: The Textbook vs. The Workbook
A **Key Stage 2 Classroom Textbook** is a durable, multi-year classroom resource that stays in the school. It is NOT a consumable student workbook.
- **The KS2 Pupil Workbook:** The pupil's personal workspace containing retrieval grids, vocabulary scaffolds, primary source forensic analysis, ruled writing lines, and teacher feedback ledgers.
- **The Interactive Web Application:** The multimedia digital portal containing audio narrations, interactive flashcards, self-marking retrieval quizzes, and primary source galleries.
- **The KS2 Classroom Companion Textbook:** The pupil's shared continuous reading text. Its sole purpose is **immersive, high-legibility, narrative reading** during teacher-led guided reading, paired reading, and choral reading.

---

## 1. Zero-Clutter Pure Narrative Mandate
To ensure the reading experience is clear, accessible, and developmentally calibrated for Key Stage 2 pupils (Years 5–6, ages 9–11):
1. **NO Primary Source Plates in Prose:** All primary sources, document excerpts, and visual artifact plates belong strictly in the web application and pupil workbook.
2. **NO Vocabulary Ribbons:** Vocabulary definitions belong in the web application and pupil workbook tasks. Do not crowd the textbook margins with glossary strips.
3. **NO Writing Tasks or Synthesis Prompts:** Writing tasks, short-answer questions, and drawing frames belong in the pupil workbook.
4. **NO QR Codes or Student Tracking Ledgers on Back Covers:** Because textbooks stay in the classroom, mobile quiz QR codes are redundant and must NOT appear on the back cover.
5. **Exact 1:1 Verbatim Fidelity to App Data:** All prose must be read dynamically from `units/<unit_id>/data.js` (`narrative_blocks`). No words, dates, or historical arguments may be modified or fabricated. Paragraph tags (e.g. `<span class="para-ref">[1.1]</span>`) are cleaned to prevent duplicate numbering against section headers (`[X.1] TITLE`).

---

## 2. High-Legibility Single Wide-Margin Column Typography Standards
For Key Stage 2 pupils, eye-tracking between narrow columns causes visual fatigue and saccadic regressions. Page real estate is dedicated entirely to accessible, open-measure reading:
- **Layout Architecture:** **Single Wide-Margin Column** (`max-width: 138mm`–`145mm`, centered with generous `26mm`–`32mm` side margins).
- **Line Measure (Characters Per Line):** Exactly `55`–`68` characters per line—the evidence-based gold standard for primary reading fluency (EEF, National Literacy Trust).
- **Body Font Size:** **`12.5pt` to `13.8pt`** (Lora serif, never below `11.5pt`).
- **Line Height (Leading):** **`1.65` to `1.78`** for effortless finger-tracking and ruler-guided reading.
- **Paragraph Spacing:** **`12px` to `16px`** margin between block sections (`.block-section { margin-bottom: 14px; }`), with tight `3.5px` spacing within subsections.
- **Historical Actors & Concepts:** Key individuals, dates, and turning points are bolded directly in the prose for visual anchoring.
- **Column Clearance Guardrail:** Typography must be calibrated so that every page ends with positive clearance (`>= +10px`) above the running footer line, preventing trailing sentence spillovers or footer collisions.

---

## 3. Reprographic Architecture Models (Multiples of 4 Pages / A3 Saddle-Stitch)

### Model 1A: 8-Page Master Classroom Textbook (2 Folded A3 Sheets)
*For compact KS2 units (5 enquiries).*
- **Page 1: Master Front Cover** — Top Masthead (`THE HISTORY REVISION HUB • KEY STAGE 2 DISCIPLINARY CLASSROOM TEXTBOOK`), Date Pill & Main Title in `Cinzel` 900, Hero Artwork Plate with archival caption, Canonical Narrative Overview in Playfair Display italic, and 5-Enquiry Scheme of Learning Directory.
- **Page 2: Master Chronological Milestone Spine** — 10–12 defining causal milestones along a vertical spine with dates and titles.
- **Pages 3–7: Five Canonical Enquiries (1 Full Page per Enquiry)** — Single Wide-Margin Column with section headers `[X.1]` to `[X.3]`, calibrated `12.8pt`–`13.8pt`.
- **Page 8: Master Knowledge Retrieval Quiz Back Cover (20–25 Questions)** — 5 Enquiry Quiz Cards (4–5 questions each) in clear, accessible typography. Zero answers printed.

### Model 1B: 16-Page Master Classroom Textbook (4 Folded A3 Sheets)
*For comprehensive KS2 units (10 lessons, e.g. World War II & The Home Front).*
- **Page 1: Master Front Cover** — Natural landscape hero plate (zero black pillarbox blocks), pupil-facing `KEY ENQUIRY QUESTION` banner, 2-paragraph Historical Overview card, and 10-Lesson Table of Contents Directory (`Lesson 1:` to `Lesson 10:`, zero `E01`/`EQ1` cryptic codes).
- **Page 2: Inside Front Cover — "Your Learning Journey"** — 100% pupil-facing for 8–11 year old children (zero teacher primer jargon), 10 child-friendly narrative blurbs (~45–55 words each).
- **Page 3: Master Chronological Turning Points Highway** — 12 defining causal milestones with vertical timeline spine, circular node dots, and date badges (**strictly zero `Ref [X.Y]` tags**).
- **Pages 4–13: Ten Canonical Lessons (1 Full Page per Lesson)** — Single Wide-Margin Column (`max-width: 162mm`, calibrated `11.5pt`–`13.0pt` Lora serif), pure continuous narrative reading.
- **Pages 14–15: Master Knowledge Retrieval Quiz (Facing Double-Page Spread — 60 High-Yield Questions)** — 60 recall questions across both facing pages (30 per page), **strictly zero student write-in scorecards**, zero answers printed.
- **Page 16: Master Back Cover — Historical Vocabulary Bank & Core Concepts** — 10 Foundational Key Terms (1 per lesson) with child-friendly labels (`Real Clue:` / `Why It Changed History:`) + Synoptic Big Picture Thinking Box.

---

## 4. Word Budget & Automated Reprographics Quality Gates
- **Optimal Single-Page Budget:** `240`–`380` words (`< 220` words triggers underflow advisory; `> 420` words risks footer collision).
- **Automated Auto-Balancer:** Execute `scripts/engine/auto_balancer.cjs` / `scripts/auto_calibrate_engine.cjs` in headless Chromium before `scripts/audit_page_budget.cjs`.
- **Quality Gates:** `0px` overflow (`scrollHeight <= clientHeight + 2px`), `>= +10px` footer clearance, `>= 95%` vertical space utilization (`✅ OPTIMAL`), strict institutional neutrality (*"The History Revision Hub"*), and 100% dynamic loading from `units/<unit_id>/data.js`.

