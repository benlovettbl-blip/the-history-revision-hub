---
name: Retrieval Companion Engine
description: Zero-spillover publishing standard and automated Skia PDF page-count gate for KS2 (4-Page), KS3 (8-Page), and GCSE (16-to-28-Page) Master Knowledge Retrieval Companions ("Quiz Packs").
---

# Master Knowledge Retrieval Companion Engine ("Quiz Packs")

## Trigger
Activate this skill whenever generating, modifying, or auditing Master Knowledge Retrieval Companions / Quiz Packs (`scripts/generate_*_quiz_booklet.cjs`, `scripts/generate_*_master_retrieval_companion.cjs`, `npm run audit:companions`) across KS2, KS3, or GCSE.

---

## 1. The Dual Print-Engine Trap & Mandatory `pdf-parse` Gate
1. **DOM vs Skia PDF Reality:** Screen DOM checks (`scrollHeight - clientHeight`) can falsely report `0px` overflow when `overflow: hidden` clips elements visually. Chrome's PDF engine (Skia) ignores `overflow: hidden` across physical page breaks and pushes even `1px` of overflow onto a trailing spillover page.
2. **Mandatory Physical Page-Count Assertion (`pdf-parse`):**
   Every companion compilation script MUST parse the final rendered PDF buffer with `pdf-parse` and throw a fatal build error if `pdf.numpages` does not match the exact target signature:
   - **Key Stage 2:** Exactly `4` pages (`pdf.numpages === 4`)
   - **Key Stage 3:** Exactly `8` pages (`pdf.numpages === 8`, or approved `12`p legacy active pack)
   - **GCSE (KS4):** Exact saddle-stitch multiple of 4 (`16`, `20`, `24`, or `28` pages matching unit spec)
3. **Mandatory `@media print` CSS Guardrails:**
   - Final page container (`.a5-page:last-of-type`, `.a4-page:last-of-type`, `.page:last-of-type`) MUST set `page-break-after: avoid !important; break-after: avoid !important;`.
   - Every question row and answer card MUST set `page-break-inside: avoid; break-inside: avoid;`.

---

## 2. Dual-Line Retrieval & Universal 3-Tier Cognitive Difficulty Ramp
1. **Naming Standard:** Refer to these booklets consistently as **Master Knowledge Retrieval Companions** / **Quiz Packs** (4th Curricular Pillar).
2. **Dual-Line Retrieval Architecture:**
   - `Line 1:` Core Factual Anchor (date, individual, treaty, mechanism).
   - `Line 2:` Historical Significance / Explanation.
3. **3-Tier Cognitive Difficulty Progression (Symbol Pips):**
   Each enquiry set (8–12 questions) progresses systematically across three cognitive tiers:
   - **Tier 1 (`▸` `#047857` • Q1–Q4):** *Core Substantive Recall* (Foundation — names, dates, acts, definitions).
   - **Tier 2 (`▸▸` `#b45309` • Q5–Q7):** *Causal Mechanism & Explanation* (Intermediate — motives, tensions, consequences).
   - **Tier 3 (`▸▸▸` `#b91c1c` • Q8–Q10+):** *Synoptic Significance & Evaluation* (Higher — turning points, relative importance, precedent).
4. **Header Legend & Synchronized Rear Marking Bank:**
   - Render the compact progression legend strip above question blocks without sacrificing writing space.
   - Display matching `.mb-pip` badges in the rear **Department Marking Bank** alongside `[✓][✗]` DIRT self-assessment checkboxes.

---

## 3. Worst-Case Marking Bank Typography & Photocopier Floor
1. **High-Density Marking Bank Budgeting (e.g. KS3 18-Item Pages):**
   Budget typography for worst-case `>= 200`-character answer explanations so long strings never trigger Skia spillover:
   - `.ans-card` padding `<= 1.2px`, `line-height <= 1.15`, core answer `<= 6.8pt`, explanation `<= 6.3pt`, section header `<= 6.3pt`.
2. **GCSE A4 Revision Readability Floor:**
   - Across full-size A4 GCSE Revision Guides, Mastery Exam Packs, and A4 Quiz Packs, maintain high-contrast `#000000` monochrome styling and keep body/caption typography `>= 8.5pt` wherever page density permits.
3. **Verification Command:**
   ```bash
   npm run audit:companions
   node scripts/verify_sanitization.cjs
   ```

