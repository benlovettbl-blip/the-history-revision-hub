---
name: History Escape Room Engine
description: Official publishing, branding, audio, visual-source puzzle, and Workbook Homework Verification Chain standard for all History Escape Rooms across KS2, KS3, and GCSE on The History Revision Hub.
---

# The History Revision Hub — Official History Escape Room Engine (`SKILL.md` v3 Gold Standard)

Use this standard whenever authoring, upgrading, or auditing any **History Escape Room** or **Showcase Simulation** (`src/interactive_labs/*_escape.js`, `domesday_stubitone.js`, `ww2_homefront.js`, `elizabeth_mary_escape.js`, `ks2_*_lab.js`, `weimar_crisis_desk.js`, `quacks_and_cures.js`, `cme_courtyard/index.js`, and all future unit Escape Rooms).

---

## 1. Mandatory Unified Hub Branding (`escape_room_brand.js` / `.css`)
Every Escape Room & Showcase Simulation MUST import and render:
- `renderEscapeBrandBarHTML({ eraTag, locksCracked, totalLocks, extraBadge })` — matching the Hub homepage editorial identity (deep navy `#0f172a`, antique gold `#f59e0b`/`#fde047`, `Playfair Display` + `Inter`, Graduation Cap Crest, Era Pill, and live `🔒 X/N LOCKS` counter pips).
- `renderEscapeCoverSealHTML('THE HISTORY REVISION HUB • OFFICIAL ESCAPE ROOM')` on the Cover Launchpad.
- **100% Institutional Neutrality:** Strictly zero school names or legacy domains (`verify_sanitization.cjs` = 0).

---

## 2. Full-Bleed Voiced Archive Cinema on BOTH Openings AND Endings
1. **Zero Cluttered Legacy Voice Buttons on Covers:** Covers must NEVER display grids of legacy voiceover buttons or unrelated artwork. Every Cover displays ONE museum-grade archival hero plate (`object-fit: contain`), the Official Hub Seal, title/hook, feature pills, two crisp CTAs (`🎬 WATCH VOICED CINEMATIC OPENING` + `⚡ Skip Opening Credits → Room 1`), and a bottom Escape Trail Strip (`0px` dead space).
2. **Reusable Full-Bleed Cinema Stage (`renderAtmosphericCinemaHTML` + `createEscapeCinemaVoicePlayer`):**
   - **Opening Prologue (2–4 Scenes):** Letterboxed widescreen documentary opening with blurred atmospheric backdrop drift (`hh-er-cinema-bg-blur`), candlelight/crimson/emerald vignette, floating embers, Ken Burns camera choreography (`cam-0..3`) over verified archival plates (`object-fit: contain`), and Studio British TTS MP3 narration (`scripts/sync_escape_cinema_voices.mjs`).
   - **Cinematic Finale Ending (2–3 Scenes):** The ending is just as important as the opening! Before revealing the Final Mastery / Certificate screen, launch a multi-beat voiced atmospheric Finale dramatising the historical resolution, human aftermath, and unit-wide significance.
3. **Mandatory Room-Entry Scene-Setting Voiceover:** On dedicated 4-lock Escape Rooms (e.g. `elizabeth_mary_escape.js`, including Scottish `mary_queen_of_scots` in `studio_voice_registry.mjs`), entering each new chamber automatically plays a Studio voiceover setting the scene and task, paired with a persistent `🔊 Replay Briefing` button.

---

## 3. Explicit Task Clarity, `2.4×` Brass Source Loupe & Grounded Case File
1. **Crystal-Clear Pupil Task Banner (`renderTaskDirectiveBannerHTML`):** Every chamber must explicitly state **what** the pupil needs to do (`whatToDo`) and **why** it matters historically (`whyItMatters`) in plain, age-appropriate English—zero guesswork or obscure mechanics.
2. **Interactive `2.4×` Brass Archival Magnifying Loupe (`renderArchivalLoupeFrameHTML` + `bindArchivalLoupeDelegation`):** Let pupils hover/drag a `2.4×` magnifying lens directly over authentic paintings, maps, photographs, and cipher manuscripts (plus a 1-tap `🔍 Magnify ...` pin toggle for Chromebooks/tablets).
3. **Historically Grounded Evidence Case File (`renderHistoricalCaseFileHTML` — Zero Random Satchel Trinkets):** Never put arbitrary trinkets in satchels for no reason. Every collected Case File record must be a real historical document explained in plain English (e.g. Mary's *1568 Silver Casket Letters Inquiry at York*) that directly pays off in the finale.
4. **Fair Suspicion / Alert Pressure:** Wrong guesses increment suspicion/alert (`+10%`) with a clear historical nudge (never soft-locking pupils), while low-mistake mastery awards the **Gold Historian Seal**.

---

## 4. Full-Screen Ergonomics & Zero Dead Space
1. **True Full-Screen Toggle:** `.is-fullscreen` MUST apply `position: fixed !important; inset: 0 !important; z-index: 99995; width: 100vw !important; height: 100vh; height: 100dvh !important; overflow-y: auto; display: flex; flex-direction: column;` AND call native `requestFullscreen()` / `exitFullscreen()`.
2. **Zero Blank Bottom Void:** Cover and Cinema stages must use `flex: 1` and mount an interactive **Escape Trail Console Strip** at the bottom.

---

## 5. Close the Loop in Print — Workbook Back-Cover Verdict Ledger
1. **In-Game Unlock (`renderWorkbookCodeCardHTML`):** Every Escape Room Finale reveals an official **Homework Verification Code Phrase** (`slotLabel`, `phrase`, `instruction`).
2. **In-Print Back Cover (`escapeRoomLedger` in `render_ks2_ks3_back_cover.cjs` & `render_standard_cover.cjs`):** Printed Pupil Workbooks render a clean, zero-overflow **Official Escape Room Homework Verdict Ledger** on the Outside Back Cover with numbered lines and `[✓]` teacher check boxes so pupils build the complete Unit Verdict Chain across the term with **15-second zero-marking verification**.
