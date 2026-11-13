# Department Rollout Staged State & Recommendations

## Last Completed Session:
- **Global Removal of Web App `Workbook Triggers` Across All Narratives + CME Back Cover Refinement + Cross-Unit `Source X` Cleanup (Pushed to `origin main` / Netlify):**
  - **Global Removal of `Workbook Triggers` in App Narratives:** Removed the `Workbook Triggers: 1. ... 2. ... 3. ...` chip bar across **all** units in `src/engine/lesson_renderer.js` (previously disabled only for `cme_new`) and updated Presentation View headers in `public/interactive_mats/viewer.html` and `public/interactive_mats/medieval_1066_battle_of_hastings.html` to `Key Historical Evidence:` / `Key Terms & Vocabulary:`.
  - **CME Outside Back Cover (`scripts/components/render_standard_cover.cjs` & `scripts/components/render_cme_golden_booklet.cjs`):** Removed the bottom `Teacher Marking Targets` tick-box section and upgraded every lesson cell so both top text blocks (Lesson Title + Enquiry Question AND `Audio / Textbook Read + Online Quiz + Parent / Carer Sign`) sit cleanly together at the top of each box with full-width auto-calibrated `TEACHER COMMENTS:` ruled handwriting lines underneath (`7` lines/lesson on `12p` `KT1` & `KT3`; `4` lines/lesson on `16p` `KT2`). Recompiled and verified all 3 PDFs (`12/12`, `16/16`, `12/12` Skia pages, `99%` utilization, `0` truncations, `0px` overflow) + HTML mirrors and `dist/`.
  - **Cross-Unit `Source X` Lettering Cleanup:** Fixed the remaining 3 `Source X` lettering mismatches across `second_british_empire` (`lesson_5` swapped `Source C`/`Source D` context & Hinge Questions across all JSON/JS/`database.json` mirrors), `early_modern_world` (`lesson_5` & `lesson_6`), and `change_1450_1750` (`lesson_4` & `lesson_5`).

- **Medicine Through Time (`edexcel_medicine`) Deep Visual & `Source X` Cross-Reference Audit (All 26 Lessons / `KT1`–`KT5`):**
  - **Eliminated Stale Shadowing Fields (`block.content` / `block.theme_heading` & `s.question`):** Synchronized `block.content = block.text` and `block.theme_heading = block.theme = block.title` across all `130` narrative blocks (`26` lessons) so the web app no longer renders stale headings (e.g. `lesson_4_5` 1920s–1970s smoking headings over 21st-century Lung Cancer prose, or `lesson_5_4` off-by-one shift) or stale inline `(Source A)`/`(Source B)`/`(Source C)` tags (`lesson_4_1`, `lesson_4_2`, `lesson_3_2`, `lesson_3_5`). Synchronized `s.question = s.enquiry_question` and `narrative_blocks[i].sources = [lesson.sources[i]]` across all `130` sources (`0` shifted `Source A–E` letters).
  - **Eyes-First Visual & `exam_practice` Grounding (`KT4` Modern Medicine + `KT1`–`KT3`, `KT5`):** Inspected and repaired visual/caption/model-answer discrepancies across all 26 lessons — including Science Museum 1953 DNA demonstration model (`Object 1977-310`, `/images/dna_structure.jpg`, `0` `'Barrington Brown'` errors), EMI CT scanner literal photo description, Paul Ehrlich solo 1910 portrait, Fleming `c.1943` & Oxford glass fermentation flasks, 1946 Camel `"T-Zone"` advertisement, Carlton `"Smoking kills"` tarmac packet, Australian 2012 Pantone 448 C plain-packaging display, Salisbury Doom painting, Carrow Psalter Becket martyrdom, Welsh Zodiac Man (`NLW MS 3026C`), openwork Becket badge, 1494 Ketham Vein Man & uroscopy/plague woodcuts, Mary Beale Sydenham & Jan Steen *The Quack*, *Fabrica* Muscle Men (`Tabula III`) & tomb-leaning skeleton (`p. 164`), 1665 *Bill of Mortality* (replacing 1835 Cruikshank), Koch 1884 `Tafel XXVI`, Simpson 1847 & Cheyne 1882 carbolic spray engravings, 1858 *Punch* *Father Thames* (replacing 1831 Polish-Russian War etching), Brodie helmet 1916 report & IWM Q 4002 PH gas helmets, Somme motor ambulance, French *voiture radiologique*, and Oswald Robertson transfusion case.
  - **Full Synchronization & QA Gates (`100%` Clean):** Synced all 6 `edexcel_medicine` data mirrors + `scripts/master_rights_database.json` (`115` Medicine entries), recompiled `edexcel_medicine_source_bibliography.pdf` & `master_provenance_copyright_register.pdf`, rebuilt `dist/`, and passed `guard_visual_sources.cjs`, `audit_provenance_and_ai.cjs`, `verify_images.cjs`, `detailed_stage_inspection.cjs`, `audit_gcse_language.cjs`, `verify_curriculum_facts.cjs`, and `verify_sanitization.cjs` with `0` errors.
  - **Read-Only Cross-Unit `Source X` Audit:** Identified only 3 minor `Source X` lettering bugs across all other units (`second_british_empire` `lesson_5` swapped C/D context, `early_modern_world` `lesson_5`–`6` stale letters, and `change_1450_1750` `lesson_4`–`5` `Map A`/`Map B` header indices), held cleanly for user go-ahead.

- **Global PDF De-Duplication & Retirement of Combined `Master` Pupil Workbooks Across All Units:**
  - **100% Purged Duplicate Suffixes & Combined Master Workbooks:** Deleted **106** duplicate/combined PDFs across `public/pdfs/` (every `*_FINAL_V17.pdf`, `*_FINAL_V1.pdf`, `*_UNIFIED_FINAL.pdf`, `*_textbook_UNIFIED.pdf`, `*_textbook_FINAL.pdf`, `*_textbook*_PUBLISHER.pdf`, `great_war_part2_combined_workbook.pdf`, `usa_pupil_workbook_full.pdf`, and all GCSE `*_pupil_workbook_master*.pdf` files) plus **15** combined master workbook HTML/PDF mirrors across `public/units/*/` and `units/*/`.
  - **Hardened All Compilers Against Future Duplicates:** Removed `_FINAL_V17` / `_FINAL_V1` / `_UNIFIED_FINAL` / `_PUBLISHER` output targets and `pupil_workbook_master` generation across 48 compiler/sync scripts (`scripts/components/render_cme_golden_booklet.cjs`, `scripts/render_cme_workbook_markschemes.cjs`, `scripts/render_eee_twopage_workbook.cjs`, `scripts/render_usa_twopage_workbook.cjs`, `scripts/render_weimar_twopage_workbook.cjs`, `scripts/render_cold_war_twopage_workbook.cjs`, `scripts/generate_pure_narrative_textbook.cjs`, etc.) and archived the 4 `merge_*_master_workbook.cjs` scripts to `archive/scripts_legacy/`.
  - **UI & Launchpad Updated to Individual Key Topic Booklets:** Updated `src/engine/hero_launchpad.js` (clicking `"Pupil Workbooks"` in multi-booklet GCSE Hero Banners opens the unit's Workbooks Hub directly via `openHub: true`), `src/workbooks_zone.js` (removed combined `'all'` master workbook editions so `KT1` / `medieval` is the clean default module alongside `KT2`, `KT3`[, `KT4`]), `src/department_portal.js`, `src/engine/modals.js`, `src/engine/mock_exam_bank_data.js`, and rebuilt `src/verified_pdf_manifest.js` & `dist/` (`0` broken links, `0` sanitization issues).

- **Conflict in the Middle East (`cme_new`) `12p / 16p / 12p` 1-to-1 Golden-Template Workbook Architecture, Zero-Truncation Gate, Edexcel `1HI0/P5` Spec Prose Enrichment & Web App Trigger Removal:**
  - **`12p / 16p / 12p` Individual Booklets (`KT1` `3` lessons = `12p`, `KT2` `5` lessons = `16p`, `KT3` `3` lessons = `12p`):**
    - Matched all `11` post-background spreads (`KT1.1`–`KT1.3`, `KT2.1`–`KT2.5`, `KT3.1`–`KT3.3`) **100% 1-to-1 Stage-for-Stage (`55` stages)** with `lesson_1`..`lesson_11` in the Web App (`data/cme_new.json`) and Spreads `2–12` (`pp. 6–27`) of the **28-Page Master Textbook** (`cme_new_textbook.pdf`).
    - **Dead-Centre Centrefold Timelines:** `pp. 6–7` on `12p` `KT1` & `KT3`; `pp. 8–9` on `16p` `KT2` (each sitting directly on the middle A3 staple fold).
    - **Closed-Book 16-Mark Mini-Mocks & Fast-Marking Back Covers:** `pp. 10–11` + `p. 12` Back Cover on `KT1` & `KT3`; `pp. 14–15` + `p. 16` Back Cover on `KT2`.
  - **Permanent Zero-Truncation Fix & Automated Puppeteer Gate (`scripts/components/render_cme_golden_booklet.cjs`):**
    - Removed `.stage-banner` `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` clipping, calibrated all `55` GCSE Stage questions (`<= 78` chars, `100%` single-line fit with wrap safety), and wired a mandatory **Puppeteer Zero-Truncation DOM Gate** into `compileAndVerifyCmeBooklet()` alongside `check_overflows.cjs --strict` (`99%` space utilization, `0` truncations, `0px` overflow across all `40/40` pages) and `pdf-parse` (`12`, `16`, `12`).
  - **100% GCSE Answerability, Edexcel `1HI0/P5` Spec Enrichment & Vocab Parity (`110/110` Terms):**
    - Enriched both the Web App narrative (`scripts/sync_cme_workbook_to_app.cjs` -> all 5 data mirrors) and the 28-Page Master Textbook (`scripts/cme_unified_textbook_data.cjs` -> `cme_new_textbook.pdf`, `28/28 ✅ OPTIMAL`, `0px` overflow) with every specification point and harmonised figures (`38 Egyptian soldiers`, `United Arab Republic`, `$100 million` US loan, `Lyndon B. Johnson`, `300,000 refugees` & blocked Suez, `Ismailia`, `1974 UN observer status`, `800 to 2,000` at Sabra & Shatila, `Hezbollah`, `Saddam Hussein` / `1990–91 Gulf War`, `Palestinian National Authority`), verifying `110/110` exact substring matches for all `vocabBank` checklists.
  - **Web App 3-Trigger-Word Removal (`cme_new`) & Page-Matched Mark Schemes:**
    - Removed the `Workbook Triggers: 1. ... 2. ... 3. ...` chip bar from `cme_new` lesson stage header cards (`src/engine/lesson_renderer.js`) and replaced `3 Trigger Words` with `Key Specification Evidence` in `public/interactive_mats/viewer.html` for `cme_new`.
    - Recompiled all 3 Page-Matched Mark Scheme PDFs (`cme_new_pupil_workbook_KT1/KT2/KT3_markscheme.pdf`) + 6 standalone Mini-Mock HTMLs, updated `src/workbooks_zone.js`, `src/engine/hero_launchpad.js`, `src/engine/stage_schema.js`, and `src/engine/workbook_page_map.js`, verified `715/715` stages in `audit:stageschema`, `0` sanitization issues, and rebuilt `dist/`.
  - **Deferred Next-Phase Roadmap Items:**
    1. **GCSE Fleet Golden-Template Rollout:** Roll out the perfected CME Golden-Template architecture (including removal of Web App 3 Trigger Words as each unit upgrades to the 10-term Spec Checklist) across `edexcel_medicine`, `eee`, `usa`, and `weimar_nazi_germany`.
    2. **Phase 2 Interactive Click-to-Reveal Centrefold Timeline Mirror:** Build an interactive smartboard/pupil timeline view (`?view=timeline&unit=cme_new&kt=1/2/3`) mirroring printed Centrefold `Boxes 1–8` (`pp. 6–7` on `KT1`/`KT3`; `pp. 8–9` on `KT2`).

- **Previous CME `48p` Pass (Superseded by `40p` 1-to-1 Alignment Above):**
  - **3 × `16-Page` Saddle-Stitch A3 Booklets (`KT1`, `KT2`, `KT3`, `4 folded A3 sheets` each) + `48-Page` Master (`cme_new_pupil_workbook_master.pdf`):**
    - **Page 1 (Front Cover):** Commercial neutral header, Pupil Name/Class/Teacher strip, **uncropped (`object-fit: contain`) Split Hero Plate** (`kt1_cover.jpg` 1948 Ben-Gurion; `kt2_cover.jpg` 1967 Rubinger Western Wall vertical 2:3 uncropped; `kt3_cover.png` 1993 Oslo Handshake full colour) + Curatorial Source Panel (3 Details to Spot + Hinge Question) + Paper 2 Exam Question Guide Strip + Official Pearson Edexcel Specification Personal Learning Checklist (`Taught ☐ | Revised ☐`). Registered all 3 cover plates in `scripts/master_rights_database.json` and recompiled Master & Unit Rights Registers.
    - **Lesson Spreads (`pp. 2–7`, `10–11`[, `12–13`]):** Full-width 5-stage Left-page notes (zero 26mm giveaway sidebar), verified `Textbook pp. X–Y` badges, verified `13.5mm` Lesson Micro-QRs with readable slugs (`kt1.1-end-of-mandate`..`kt3.5-oslo-accords`), shuffled `2 × 5` spec vocabulary checklists, Right-page `Mark: [ / 4 ]` & `Mark: [ / 8 ]` boxes, real 2-bullet stimulus strictly on `Q2 Narrative`, 2-paragraph method strip on `Q3 Importance`, zero `Mind-Map Mission` clutter, and classic academic footers.
    - **Pages 8–9 (Centrefold Timeline):** Single stapled innermost A3 sheet across all 3 booklets (`Boxes 1–8` with dashed left/right write-in boxes + `12.5mm` Page 9 Micro-QR future-proofed for Phase 2 Interactive Click-to-Reveal Centrefold Timeline Mirror).
    - **KT1 `Pages 12–13`:** Dedicated Chronology (`A–H` sequencing + 4-row Cause→Consequence matrix) & Overdue Consequence Workout (`IDF 1948` & `UAR 1958` 4-mark drills) keeping `KT1` (`KT1.0` background omitted) at exact `16` pages.
    - **Pages 14–15 (Cold End-of-Topic Mini-Mock):** `16 Marks • 25 Mins • Closed Book` (`Page 14`: real-exam `Q1 Explain two consequences [8m]` = `2 × 4m`, zero QR; `Page 15`: unscaffolded `Q3 [8m]` + Green-Pen DIRT Target Box).
    - **Page 16 (Outside Back Cover):** Headline `Mini-Mock (pp. 14–15): [ / 16 ] Gr: [ ]`, per-lesson `SET / QR / DUE`, `Audio/Textbook ☐ + Online Quiz ___/10 + Parent Sign`, `Do Now (/10)`, `Q1 (/4)`, `Q2/Q3 (/8)` (zero `Lesson Total` column), and `2 × 2` Fast-Marking Teacher Tick-Targets.
    - **100% Quality Gates Passed:** `99%` space utilization and `0px` overflow across all `48/48` pages (`check_overflows.cjs --strict`), `pdf-parse` verified exact Skia page counts (`16`, `16`, `16`, `48`).
  - **Page-Matched Teacher Mark Schemes, Standalone Mini-Mocks & App Synchronization:**
    - Compiled `pupil_workbook_KT1/KT2/KT3/master_markscheme.html` + `.pdf` in exact printed page order (`p. 1`, `pp. 2–7`, `pp. 8–9 Timeline Key`, `pp. 10–13`, `pp. 14–15 Mini-Mock`) and wired `[Pupil Workbook] | [✓ Mark Scheme & WAGOLLs]` into both CME's Hero Launchpad and `PILLAR 2 • PUPIL WORKBOOK` (`src/workbooks_zone.js`).
    - Cross-listed all 3 Printed Workbook Cold Mini-Mocks (`cme_workbook_minimock_kt1/kt2/kt3`) into `cme_new.mock_exams` for two-click classroom projection, synced all updated spec-legal questions, Grade 9 WAGOLLs, and readable lesson slugs across `data/cme_new.json`, `public/data/cme_new.json`, `database.json`, `public/database.json`, and `units/cme_new/data.js`, and added dynamic `document.title` + slug URL routing (`src/main.js`, `src/views.js`, `src/engine/lesson_renderer.js`, `src/core_app.js`, `src/navigation.js`).
  - **Deferred Next-Phase Roadmap Items:**
    1. **GCSE Fleet Golden-Template Rollout:** Roll out the perfected CME Golden-Template architecture to the 14 GCSE booklets across `edexcel_medicine`, `eee`, `usa`, and `weimar_nazi_germany` (fixing 3-page flipped lessons onto clean Even-Left / Odd-Right 2-page spreads).
    2. **Phase 2 Interactive Click-to-Reveal Centrefold Timeline Mirror:** Build an interactive smartboard/pupil timeline view (`?view=timeline&unit=cme_new&kt=1/2/3`) mirroring printed `Pages 8–9` (`Boxes 1–8`) where clicking each box reveals guided low-stakes prompts/model cues for lower-prior-attaining pupils.

- **Previous CME Interim Pass (`44p` 2-Page Spread Conversion — Superseded Above):**
  - Eliminated the old 4-page-per-lesson layout (which placed 31 blank ruled class-notes lines on the Right page and pushed exam questions onto a second spread).
  - **Every Lesson Now Sits on One Open Facing Spread:** Even Left (`Verso`) = **5-Stage Chronological Spine** (`pp. 4, 6, 8, 10[, 12]`) | Odd Right (`Recto`) = **Focused Edexcel Paper 2 Exam Practice** (`Q1 Explain One Consequence [4m, 4 lines]` + `Q2 Narrative OR Q3 Importance [8m, dynamic auto-lines]` + `Mind-Map Mission`, `pp. 5, 7, 9, 11[, 13]`).
  - **Saddle-Stitch A3 Modulo-4 Compliance & Zero Spillover (`pdf-parse` + `check_overflows.cjs --strict` Verified):**
    - **`KT1` (`1945–1963`, 4 lessons):** **12 Pages** (`3 folded A3 sheets`, down from `20p`), `99%` utilized across all 12/12 pages (`0px` overflow).
    - **`KT2` (`1964–1973`, 5 lessons):** **16 Pages** (`4 folded A3 sheets`, down from `24p`; includes `P14` Synoptic Q1 Consequence Drills + `P15` Extended Writing Overflow & DIRT Redrafting), `99%` utilized across all 16/16 pages (`0px` overflow).
    - **`KT3` (`1974–1995`, 5 lessons):** **16 Pages** (`4 folded A3 sheets`, down from `24p`; includes `P14` Synoptic Q1 Consequence Drills + `P15` Extended Writing Overflow & DIRT Redrafting), `99%` utilized across all 16/16 pages (`0px` overflow).
    - **Master Volume (`cme_new_pupil_workbook_master.pdf`):** **44 Pages** (`12 + 16 + 16 = 44`, down from `68p`, saving 24 pages / 6 A3 sheets per pupil across the course).
  - Synchronized `renderStandardBackCover` (`22m` per lesson = `10m Do Now + 4m Q1 + 8m Q2/Q3`), `src/workbooks_zone.js`, `src/engine/hero_launchpad.js`, `src/engine/stage_schema.js`, and rebuilt `dist/`.
  - **Next Fleet Item Identified in Read-Only Audit:** 14 GCSE booklets across `edexcel_medicine` (`medieval`, `renaissance`, `18th_19th`), `eee` (`KT1–3`), `usa` (`KT1–4`), and `weimar_nazi_germany` (`KT1–4`) currently use 3 pages per lesson (`Lessons 2 & 4` flip onto Odd/Right pages `P7, P13`), ready to convert to the same clean 2-page-per-lesson standard upon user approval.

- **Platform-Wide Video Audit, Repair & Channel Expansion Complete (All 18 Units / 598 Video Slots / 570 Active URLs):**
  - **`edexcel_medicine` (26 Lessons / 86 Verified Clips):** Stripped personal AI video (`TheKnowledgeDigest`) from `lesson_4_3`, untangled *Pain, Pus and Poison* to the single official `5m 55s` BBC Four / ERA Penicillin extract in `lesson_4_4`, replaced all 13 dead `404` ERA links and 7 wrong-century clips, and completed **9/9 (`100%`)** of BBC Bitesize for Teachers' animated *"Secondary History – Medicine Through Time"* series (`MdNXDqCGv3M` in `lesson_3_3`, `my14ZuzjH5I` in `lesson_4_2`).
  - **`cme_new` (12 Lessons — `12/12` `Unpacked` Coverage):** Added 7 verified `Unpacked` (*History of Israel Explained*) episodes across `lesson_0`, `lesson_3`, `lesson_4`, `lesson_6`, `lesson_9`, and `lesson_11`, and replaced 3 duplicate/mislabeled/non-video slots.
  - **6 KS2/KS3 Units Repaired + Global Runtime Sync (`dist/` Rebuilt):** Replaced 22 broken, age-gated, wrong-topic, and duplicated clips across `great_war_part2`, `ks2_ww2`, `industrialisation_and_empire`, `monarchy_religion_power`, `great_war`, and `water_and_sanitation`, auto-synced all inaccurate duration badges and viewing-task timestamps across all 18 units (`deadLinks: 0`, `wrongDurs: 0`, `tsOverflows: 0`), verified `0` sanitization issues across 5,834 files, and rebuilt `dist/`.

- **Center-Spine Curriculum Mind-Map Canvas — Phase 5 Complete (All 10 Multi-Unit Key Stage 3 Pupil Workbooks / 11 Booklets — 100% KS3 & GCSE Fleet Complete):**
  - **Shared KS3 Centrefold Engine (`scripts/components/render_ks3_centrefold_spine.cjs`):** Authored the shared **100% Pure `#000000` Photocopier-Safe Center-Spine Curriculum Mind-Map Canvas** (`2.5px` central vertical spine line, solid `#000000` milestone pills with `#ffffff` date badges, flanking left/right causal branch cues, *Consolidate Station* app synergy, and post-render `pdf-parse` page-count gate).
  - **11 KS3 Booklets Upgraded, Recompiled & Synced to `dist/`:**
    1. `medieval_england` (`16p` — `medieval_england_pupil_workbook.pdf`)
    2. `water_and_sanitation` (`16p` — `water_and_sanitation_pupil_workbook.pdf` + `workbook.pdf`)
    3. `monarchy_religion_power` (`16p` — `monarchy_religion_power_pupil_workbook.pdf`)
    4. `first_british_empire` (`16p` — `first_british_empire_pupil_workbook.pdf`)
    5. `second_british_empire` (`16p` — `second_british_empire_pupil_workbook.pdf`)
    6. `industrialisation_and_empire` (`16p` — `industrialisation_and_empire_pupil_workbook.pdf` + `workbook.pdf`)
    7. `australia` (`16p` — `australia_pupil_workbook.pdf`)
    8. `great_war` (`16p` — `great_war_pupil_workbook.pdf` + `workbook.pdf`)
    9. `great_war_part2` (`16p` — `great_war_part2_pupil_workbook.pdf`)
    10. `great_war_part2` **Combined Master Scholar Edition** (`24p` — `The_Course_of_the_Great_War_Combined_Master_Scholar_Workbook.pdf` + `great_war_part2_combined_workbook.pdf`; eliminated legacy 31-page spillover down to exact `24/24` pages)
    11. `post_war_britain` (`16p` — `post_war_britain_pupil_workbook.pdf`)
  - **Ethical Exception Preserved:** `the_shoah` retains its bespoke *Six Lives: Micro-Histories of the Holocaust* centrefold untouched per `pupil-workbook-engine` Section 4.1.
  - **100% Fleet Quality Gate Passed:** Verified `16/16` and `24/24` PDF page counts via `pdf-parse`, `Overflows: 0` across all 184 compiled KS3 pages, `HorizDiff: [0,0]`, `NonPureColors: 0` (`rgb(0,0,0)` and `rgb(255,255,255)` strictly), `ClutterClean: true`, `100%` stage harmony across all 19 units, and `0` sanitization issues across 5,834 files.

- **Center-Spine Specification Mind-Map Canvas — Phase 4 Complete (EEE, USA & Cold War — 100% GCSE Fleet Complete):**
  - **Early Elizabethan England (`eee`, 1558–1588):** Restored `scripts/render_eee_twopage_workbook.cjs` & `scripts/enhance_eee_workbook.cjs`, rolled out the **100% Pure `#000000` Center-Spine Specification Mind-Map Canvas** across Pages 2–3 of `KT1` (16p), `KT2` (16p), and `KT3` (16p), updated all 12 lesson `Mind-Map Mission` strips in `scripts/components/eee_enquiry_configs.cjs`, and compiled the unified **48-page** `eee_pupil_workbook_master.pdf`.
  - **The USA (`usa`, 1954–1975):** Restored `scripts/render_usa_twopage_workbook.cjs`, rolled out the **100% Pure `#000000` Center-Spine Specification Mind-Map Canvas** across Pages 2–3 of `KT1` (20p), `KT2` (20p), `KT3` (20p), and `KT4` (20p), updated all 16 lesson `Mind-Map Mission` strips in `scripts/components/usa_enquiry_configs.cjs`, added `scripts/merge_usa_master_workbook.cjs`, and compiled the unified **80-page** `usa_pupil_workbook_master.pdf`.
  - **Superpower Relations & The Cold War (`cold_war`, 1941–1991):** Restored `scripts/render_cold_war_twopage_workbook.cjs`, upgraded Centrefold Pages 10–11 (`#page-10`/`#page-11`) to the **100% Pure `#000000` Center-Spine Specification Mind-Map Canvas**, updated all 7 lesson `Mind-Map Mission` strips, and compiled the **20-page** `cold_war_pupil_workbook.pdf`.
  - **100% Fleet Quality Gate Passed:** All 8 Phase 4 booklets + Master Volumes synced to `dist/` (`Overflows: 0`, `HorizDiff: [0,0]`, `NonPureColors: 0`, `ClutterClean: true`, and `0` sanitization issues across 5,834 files; *The Shoah* micro-histories centrefold preserved per ethical exception).

- **Center-Spine Specification Mind-Map Canvas — Phase 3 Complete (All 4 Weimar & Nazi Germany GCSE Pupil Workbooks + 80p Master Volume):**
  - Restored `scripts/render_weimar_twopage_workbook.cjs` to `scripts/` and rolled out the **100% Pure `#000000` Center-Spine Specification Mind-Map Canvas** across Pages 2–3 of `KT1` (`1918–1929`, 20p), `KT2` (`1919–1933`, 20p), `KT3` (`1933–1939`, 20p), and `KT4` (`1933–1939`, 20p), plus updated all 16 lesson `Mind-Map Mission` strips in `scripts/components/weimar_enquiry_configs.cjs` to pair with the web app's *Consolidate Station*.
  - Added `scripts/merge_weimar_master_workbook.cjs`, recompiled the unified **80-page** `weimar_nazi_germany_pupil_workbook_master.pdf` across all mirror paths (`public/pdfs/` and `public/units/weimar_nazi_germany/`), synced to `dist/`, and verified `99%` optimal page utilization across all 80 pages, `0px` vertical/horizontal overflow, `0` non-black/white computed colors on Pages 2–3, `0` cognitive clutter violations, and `0` sanitization issues across 5,834 files.

- **Center-Spine Specification Mind-Map Canvas — Phase 2 Complete (All 3 Conflict in the Middle East GCSE Pupil Workbooks + 68p Master Volume):**
  - Rolled out the **100% Pure `#000000` Center-Spine Specification Mind-Map Canvas** across Pages 2–3 of `KT1` (`1945–1963`, 20p), `KT2` (`1964–1973`, 24p), and `KT3` (`1974–1995`, 24p), plus updated all 14 lesson Recto `Mind-Map Mission` strips to pair with the web app's *Consolidate Station*.
  - Added `scripts/merge_cme_master_workbook.cjs`, recompiled the unified **68-page** `cme_new_pupil_workbook_master.pdf` across all mirror paths, synced to `dist/`, and verified `0px` vertical/horizontal overflow, `0` non-black/white computed colors on Pages 2–3, `0` cognitive clutter violations, and `0` sanitization issues across 5,834 files.

- **Center-Spine Specification Mind-Map Canvas — Phase 1 Complete (All 5 Edexcel Medicine GCSE Pupil Workbooks + Master Volume):**
  - Replaced Pages 2–3 passive summary paragraphs across `medieval` (20p), `renaissance` (20p), `18th_19th` (20p), `modern` (16p), and `western_front` (28p) with the borderless **Center-Spine Specification Mind-Map Canvas** (`2.5px` `#000000` vertical center spine, solid black specification pills, left/right specification branch cues, zero prose giveaways, and web app *Consolidate Station* synergy).
  - Updated all lesson Recto `Mind-Map Mission` strips, recompiled the unified **104-page** `edexcel_medicine_pupil_workbook_master.pdf`, synced to `dist/`, and verified `0px` vertical/horizontal overflow, `0` cognitive clutter violations, and `0` sanitization issues across 5,834 files.
  - Persisted the permanent **Bold AI Model Guidance** rule in `.agents/AGENTS.md` and codified the Center-Spine Canvas standard in `.agents/skills/pupil-workbook-engine/SKILL.md`.

- **Pre-Production Phase 4: Script Hygiene, Archiving & Headless Chrome Smoke Gate:**
  - **Archived 1,117 Legacy Patch Scripts & 34 Screenshots (`scripts/execute_phase4_archive.cjs`):** Moved unreferenced one-off historical migrations from August–October 2026 and test screenshots into git-ignored `archive/scripts_legacy/` with a complete backup in `temp_backups/phase4_scripts_backup_20261112_094700/`. Preserved all 474 active compilers, tests, linters, and transitive dependencies in `scripts/`.
  - **Headless Chrome UI Smoke Check Passed (`scripts/run_ui_smoke_test.cjs`):** Validated on isolated local HTTP server serving `dist/` with Puppeteer. Verified Homepage, Workbooks Zone, Department Portal (lazy route), Chess Hub (lazy route), and Dashboard switch back with **0 runtime/console errors**.
  - **Pre-Production Quality Gate Certified:**
    - `verify_sanitization.cjs`: 0 violations across 6,847 files.
    - `verify_images.cjs`: 100% clean, 0 missing or broken images.
    - `npm run audit:stages`: 100% stage harmony across all 19 units.
    - `npm run audit:links`: 0 broken links across 1,124 links.
    - `npm run build`: built in **16.31s** (down from 51.5s — 68% faster).

- **Pre-Production Phase 3: Static Asset Diet, Image Optimization & Link Audit:**
  - **Quarantined Non-Production Previews & Mockups to `archive/public_previews/`:** Moved `~43 MB` of test screenshot folders (`laptop_previews`, `previews_medicine`, and 11 `previews_ks3_*` directories) plus loose mockup files (`lesson_card_cleanup_mockup.html` 12.4 MB, `lesson_card_cleanup_comparison.png` 3.3 MB, `ks3_backcover_test.*`, `cover_grid_hybrid_mockup.html`) and 14 `page20_preview*.png` files out of `public/` into git-ignored `archive/public_previews/`.
  - **Quarantined Unreferenced Media:** Safely quarantined `public/images/Henry Cort.zip` (154.2 MB), unreferenced raw camera excursion files `public/images/Henry Cort/` (~150 MB), and `funtley_weir_hydraulic_flow.mp4` (16.1 MB).
  - **Pruned Unreferenced Duplicates & Compressed 37 Active Image Plates:** Removed zero-hit byte duplicates (`weimar_hyperinflation_1_billion_mark_note_1923.jpg`, `great_plague_broadsheet_1665.jpg`, `weimar_scheidemann_proclamation_cropped_1918.jpg`, and Windows space-duplicate `Stubbington names *.jpg` files); compressed 37 active curriculum plates > 4 MB using Sharp (high-DPI 2,400px ceiling, mozjpeg quality 82), reducing `public/images/` from **1,252.8 MB** to **643.2 MB** (saving **609.6 MB**, cutting overall `public/` size from 4.38 GB to 3.71 GB).
  - **Fixed Broken Links in Mock Exam Bank & Verified 100% Link Parity:** Realigned broken PDF paths in `src/engine/mock_exam_bank_data.js` (`/pdfs/usa_textbook_UNIFIED.pdf`, `/pdfs/weimar_nazi_germany_textbook_UNIFIED.pdf`, and `/pdfs/edexcel_medicine_revision_guide.pdf`), achieving **0 broken links across 1,124 links** in `npm run audit:links`.
  - **Production Gates Verified:** `verify_sanitization.cjs` (0 violations), `verify_images.cjs` (clean), `verify_asset_paths.cjs` (clean), `audit:stages` (100% harmony), and `npm run build` completed in **18.45s** (down from 51.5s).

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
