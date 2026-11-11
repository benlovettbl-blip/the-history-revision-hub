# Department Rollout Staged State & Recommendations

## Last Completed Session:
- **Medicine in Modern Britain Workbook Converted to 16-Page True Double-Page Standard (Commit `c740d938`):**
  - Converted `scripts/render_medicine_modern_twopage_workbook.cjs` to exactly 16 pages ($4 \times \text{A3 folded sheets}$, saddle-stitch reprographics compatible).
  - Fixed page-turn anomaly: all 5 lessons now sit on flat facing double-page spreads (Left Verso Spine + Right Recto Writing Task on pp. 4–5, 6–7, 8–9, 10–11, 12–13).
  - Added dedicated 2-page British Exercise Notes spread on pp. 14–15.
  - Page 16 Master Back Cover with Assessment Tracker & Dual QR Hub.
  - Verified 0px overflow across all 16 pages (`✅ OPTIMAL`, 98–99% space utilization).
  - Recompiled and merged into `edexcel_medicine_pupil_workbook_master_FINAL_V17.pdf`.

- **GCSE Master Textbooks Recompiled:**
  - All 6 GCSE 28-Page Master Textbooks compiled with 0px overflow.

## Quality Gates Verified:
- **Universal Stage Alignment Audit (`npm run audit:stages`):** 100% stage harmony across all 19 units.
- **Space Budget & Layout Gate:** 0px overflow across all 16 pages of Modern Medicine workbook.
- **Commercial Neutrality & Sanitization:** `node scripts/verify_sanitization.cjs` -> 0 violations across 6,977 files.
- **Git Commit:** `c740d938` cleanly applied.

## Weekend Pinned Plan (Active Reminder):
- **Adopting The Shoah Sandbox Design Across Pupil Workbooks:**
  - **Concept:** Remove the 3 bulleted trigger words from printed workbook stage boxes (they remain naturally embedded in lesson narrative prose).
  - **Left Page (Verso) Architecture:**
    1. Top compact reference card: **5 Core Inquiry Questions • Chronological Roadmap** (Questions 1–5).
    2. Main writing canvas: **Authentic British Exercise Book Canvas** (25 uninterrupted ruled lines at 8mm pitch) with a clean **26mm Left Margin**.
    3. **Timeline in Margin:** Stage badges (`[1]`, `[2]`, etc.) and dates in the 26mm margin every 5th line.
  - **Implementation Strategy:**
    - Step 1: Run a pilot preview on a single unit (e.g. `cme_new` or `medieval_england` or `edexcel_medicine`) using `render_the_shoah_workbook.cjs`'s `renderSpinePage` template.
    - Step 2: User visual review of the pilot PDF/HTML.
    - Step 3: Propagate across remaining KS3 and GCSE workbooks with `check_overflows.cjs`.

## Recommended Next Step for Weekend:
- Select the single pilot unit to preview the Shoah sandbox layout (e.g. CME Key Topic 1, Medieval England, or Modern Medicine).
