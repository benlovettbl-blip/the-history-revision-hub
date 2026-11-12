# Department Rollout Staged State & Recommendations

## Last Completed Session:
- **Pre-Production Phase 2: Bundle Split, Service Worker Storm Fix & CDN Edge Caching:**
  - **Eliminated `26.02 MB` Service Worker Precache Storm (`public/sw.js` & `src/main.js`):** Removed `'/database.json'` from `CORE_ASSETS` install precache so classroom devices never double-download `52 MB` on every deploy; fixed `responseToCache.clone()` stream reuse bug; switched `fetch('/database.json')` to conditional HTTP `ETag` (`304 Not Modified`) revalidation with Network-First offline fallback in `DYNAMIC_CACHE`.
  - **Route Lazy-Loading & Vite 8 Rolldown Chunking (`src/navigation.js`, `src/views.js`, `vite.config.js`):** Converted `chess_zone`, `department_portal`, `masterpiece_studio`, `competitions_zone`, and `curriculum_map` to async `import()` chunks (`744 kB` deferred until visited), and split core curriculum/lesson modules into dedicated immutable chunks (`vendor`, `arena-curriculum`, `exam-bank`, `lesson-engine`), cutting `main-*.js` from `4,025.93 kB` (`1,013.68 kB` gzip) down to `651.12 kB` (`150.84 kB` gzip).
  - **Netlify CDN Edge Caching (`netlify.toml`):** Enabled `stale-while-revalidate` edge caching for `/images/*`, `/pdfs/*`, and `/audio/*`, `immutable` caching for `/assets/*`, `must-revalidate` ETag caching for `/database.json` and `/data/*`, and strict `no-store` on `/`, `/index.html`, `/sw.js`, and `/.netlify/functions/*`.

- **Pre-Production Phase 1: Security, Skills & `AGENTS.md` Alignment Pass:**
  - **Serverless & Client Passkey Hardening:** Removed stale un-scrubbed `netlify/functions/chess_sync.mjs`, upgraded `netlify/functions/chess_sync.js` with `process.env.CHESS_TEACHER_PASSKEY` support, salted SHA-256 verification, origin-checked CORS, and `?room=`/`?school=` multi-school blob scoping. Added `src/engine/staff_auth.js` and scrubbed all 6 plaintext passkey leaks (including button tooltips and input placeholders) across `src/`.
  - **Workspace Skills Ecosystem Reconciled (9 Git-Tracked Skills in `.agents/skills/`):**
    - Migrated `ks2-classroom-textbook-engine` from local `~/.gemini/config/` into `.agents/skills/` for full cross-device portability.
    - Resolved textbook contradictions in `ks3-publishing-engine` and `gcse-classroom-textbook-engine` (Page 2 Spec Directory + Page 3 Zero-Maps Milestone Spine), and fixed CLI commands/age-calibration in `auto-vocab-generator` & `auto-quiz-generator`.
    - Added 3 missing production skills: `pupil-workbook-engine`, `retrieval-companion-engine`, and `production-release-gate`.
  - **Un-Truncated `.agents/AGENTS.md` (`84.4 KB` -> `~10 KB`, `0%` truncated):** Backed up original files to `temp_backups/` and distilled core always-on invariants into `.agents/AGENTS.md` while routing specialized blueprints cleanly to `.agents/skills/`.
  - **Trackers Reconciled:** Synchronized `DEPARTMENT_MASTER_PLAN_AND_TRACKER.md` and `WORKBOOK_STATUS_AND_ROLLOUT_TRACKER.md` (removed contradictory per-turn Rollout Compass mandate).

- **Repository-Wide Pupil Workbook & Mirror PDF Synchronization (Commit `7abe04c6`):**
  - Audited all 71 publications across KS2, KS3, and GCSE in `src/workbooks_zone.js` and all PDF directories.
  - Eliminated legacy continuous monoliths from August 2026 across `public/units/` (e.g. 211-page medicine workbook, 61-page EEE workbook, 34-page Weimar workbook, unparsed `${periodName}` template string filename).
  - Merged and verified authentic Gold Standard Master Volumes:
    - `cme_new_pupil_workbook_master.pdf` (**68 pages**)
    - `eee_pupil_workbook_master.pdf` (**48 pages**)
    - `weimar_nazi_germany_pupil_workbook_master.pdf` (**80 pages**)
    - `usa_pupil_workbook_master.pdf` (**80 pages**)
    - `edexcel_medicine_pupil_workbook_master.pdf` (**104 pages**)
  - Re-aligned `eee_pupil_workbook_KT1.pdf` (16p) and `KT3.pdf` (16p) to `FINAL_V17` Gold Standard builds.
  - Corrected all UI badges and link resolvers in `src/workbooks_zone.js`, `src/engine/modals.js`, and `src/verified_pdf_manifest.js`.
  - Pushed to `origin/main` (Netlify live auto-deploy).

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
