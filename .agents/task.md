# Department Rollout Staged State & Recommendations

## Last Completed Session:
- **Edexcel GCSE Medicine Video Shelves Overhaul (26 Lessons):**
  - Conducted full automated API and oEmbed audit across all 85 YouTube links in `edexcel_medicine`:
    - Eliminated **13 dead / 404 links** (including `1b-3_Ea3m0o` in KT4.1 DNA, `0Z4tE6-z8W4` across 3 lessons, `jWpU1gEcwqQ`, `XW-aN1Uf-r8`, etc.).
    - Decoupled **13 copy-pasted wrong-topic loops** (e.g. Victorian surgery & Simpson's 1847 chloroform mistakenly pasted into KT3.1–3.3 and KT4.1 DNA; 1940s heart surgery & penicillin mistakenly pasted into KT4.2, KT4.5, and KT5.1; `1917` trailer and IWM evacuation mistakenly repeated across all 6 Western Front lessons).
  - Repaired every affected lesson with verified, active, specification-aligned video pathways (BBC Bitesize for Teachers, TED-Ed, Medical Research Council, The HISTORY Channel, Simple History, English Heritage):
    - **KT1.3:** English Heritage: What was Medieval Medicine Like? (`fuEuaSmDOec`)
    - **KT1.5:** Simple History: The Plague Doctor (`plIQdL84_YI`), Timelines.tv Black Death (`YhsPPBGtquo`)
    - **KT2.5:** Simple History: Great Plague of London 1665 (`LBvOZO1gmOE`)
    - **KT3.1:** BBC Bitesize for Teachers: Pasteur and Koch (`ZmaoHB5fKB4`)
    - **KT3.2:** BBC Bitesize for Teachers: The Life and Work of Edward Jenner (`sJRJeOxX6no`)
    - **KT3.3:** BBC Bitesize for Teachers: Florence Nightingale (`jONlz7vaMnU`), BBC Teach: Mary Seacole (`4QgfNX79eLE`)
    - **KT3.4:** Simple History: Surgical Revolution (`7pjAH84f-c0`), The Knick (`z9rKY8MLWTU`), Pain, Pus & Poison Ep 1 (`2hTZNDyLPLk`)
    - **KT3.5:** Simple History: Edwin Chadwick & John Snow (`TT4Z1Ikf36w`), TED-Ed: John Snow Broad Street Ghost Map (`N9LC-3ZKiok`)
    - **KT4.1:** TED-Ed: Rosalind Franklin (`BIP0lYrdirI`), TED-Ed: Human Genome Project (`AhsIF-cmoQQ`), Wellcome Sanger: Rare Disease Diagnosis (`O9KyCg7gkhI`), PBS NOVA: Photo 51 (`sp64nBYbFtw`)
    - **KT4.2:** TED-Ed: How X-Rays See Through Your Skin (`gsV7SJDDCY4`), MRC: Doll & Peto Smoking/Cancer (`CLUmwaff4a8`)
    - **KT4.3:** BBC Bitesize: Foundation of NHS (`0pnEMBgEG24`), Paul Ehrlich: Magic Bullet (`g-jdWYZTPYc`)
    - **KT4.4:** BBC Bitesize for Teachers: Fleming, Florey and Chain (`N2-7UQWrYPY`), Pain, Pus & Poison Ep 2 (`mlDO-uKMNWk`)
    - **KT4.5:** UK Parliament: Battle Against Smoking (`js_Kab5C2xI`), GCSE History: Lung Cancer Action (`tlNtakmOOho`)
    - **KT5.1:** Simple History: British Sector Trenches (`bSPh5Jgx_wY`), 1917 Trailer (`YqNYrYUiMfg`)
    - **KT5.2:** Simple History: Trench Environment (`bSPh5Jgx_wY`), Dan Snow: WW1 Infections (`x8OazQml0gw`)
    - **KT5.3:** Simple History: Gas Warfare (`vmir6SxYNII`), Simple History: Brodie Helmet (`xGpGlthfAQU`)
    - **KT5.4:** Warner Bros: They Shall Not Grow Old (`IrabKK9Bhds`), IWM: Chain of Evacuation (`YfxRhLsAAk8`)
    - **KT5.5:** The HISTORY Channel: Marie Curie Mobile X-Rays (`g1W4MHlEqZE`)
    - **KT5.6:** GCSE History: Harold Gillies Plastic Surgery (`_nZ8f6zHufg`), The History Squad: Plastic Surgery (`b81O3LrECtI`)
  - Synchronized across all 6 data stores (`data/edexcel_medicine.json`, `public/data/edexcel_medicine.json`, `units/edexcel_medicine/data.js`, `public/units/edexcel_medicine/data.js`, `database.json`, `public/database.json`).

- **Key Stage 3 Single Canonical Engine for Titles & Enquiries (The Shoah):**
  - Completed and sandbox PDF copied to user desktop (`C:\Users\fives\Desktop\the_shoah_pupil_workbook_SANDBOX.pdf`).

## Quality Gates Verified:
- **Zero Dead Videos Across All Flagship Units:** Verified via `scripts/audit_all_units_videos.cjs`:
  - `edexcel_medicine.json`: 62 videos, **0 dead**
  - `the_shoah.json`: 28 videos, **0 dead**
  - `cme_new.json`: 50 videos, **0 dead**
  - `cold_war.json`: 28 videos, **0 dead**
  - `weimar_nazi_germany.json`: 48 videos, **0 dead**
  - `usa.json`: 55 videos, **0 dead, 0 cloned loops**
  - `medieval_england.json`: 20 videos, **0 dead**
- **Writing Studio Task Integrity:** `npm run audit:tasks` -> 100% Passed (0 errors, 0 warnings across all 372 tasks).
- **Commercial Neutrality & Sanitization:** `node scripts/verify_sanitization.cjs` -> 0 violations across 6,974 files.
- **Git Commits:** `f53b023e` (Medicine overhaul) and `6d59915f` (USA & CME fixes) cleanly applied.

## Recommended Next Step:
- Return to the **Shoah** 20-page pupil workbook to review or finalize any remaining page elements.
