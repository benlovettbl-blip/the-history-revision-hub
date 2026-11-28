---
name: History Escape Room Engine
description: Official publishing, branding, audio, visual-source puzzle, and Workbook Homework Verification Chain standard for all History Escape Rooms across KS2, KS3, and GCSE on The History Revision Hub.
---

# The History Revision Hub — Official History Escape Room Engine (`SKILL.md`)

Use this standard whenever authoring, upgrading, or auditing any **History Escape Room** (`src/interactive_labs/*_escape.js`, `domesday_stubitone.js`, `ww2_homefront.js`, `elizabeth_mary_escape.js`, and all future unit Escape Rooms).

---

## 1. Mandatory Unified Hub Branding (`escape_room_brand.js` / `.css`)
Every Escape Room MUST import and render:
- `renderEscapeBrandBarHTML({ eraTag, locksCracked, totalLocks, extraBadge })` — matching the Hub homepage editorial identity (deep navy `#0f172a`, antique gold `#f59e0b`/`#fde047`, `Playfair Display` + `Inter`, Graduation Cap Crest, Era Pill, and live `🔒 X/4 LOCKS` counter pips).
- `renderEscapeCoverSealHTML('THE HISTORY REVISION HUB • OFFICIAL ESCAPE ROOM')` on the Cover Launchpad.
- **100% Institutional Neutrality:** Strictly zero school names or legacy domains (`verify_sanitization.cjs` = 0).

---

## 2. Cinematic Opening Prologue & Mandatory Room-Entry Voiceovers
1. **Zero Cluttered Legacy Voice Buttons on Covers:** Covers must NEVER display grids of random voiceover buttons or unrelated artwork. Every Cover displays ONE museum-grade archival hero plate (`object-fit: contain`), the Official Hub Seal, title/hook, Lock Preview pills, and two crisp CTAs (`🎬 WATCH VOICED CINEMATIC OPENING` + `⚡ Skip Opening Credits → Room 1`).
2. **4-Scene Voiced Archive Cinema Prologue:** Letterboxed widescreen documentary opening with Ken Burns slow zoom across authentic verified archival plates, Studio British TTS voiceover MP3s (`scripts/sync_*_voices.mjs` via `gemini-3.8-flash-tts`), procedural Web Audio underscore with automatic music ducking, `🔊 Replay Voiceover`, and `Skip Prologue →`.
3. **Mandatory Room-Entry Scene-Setting Voiceover:** Whenever the pupil progresses to a new room (`Room 1`, `Room 2`, `Room 3`, `Room 4`, `Room 5`), a **Studio British Voiceover MUST automatically play** to set the historical scene, heighten dramatic urgency, and tell the pupil what clue/lock they must crack to progress — paired with a persistent **`🔊 Replay Briefing`** button in the top bar.

---

## 3. Authentic Visual-Source Puzzles (Zero AI Art, Zero Stick-Figure SVGs)
1. **Eyes-First Visual Verification:** Inspect every archival painting, photograph, map, and manuscript via `read_file` before writing a single caption or puzzle. Never generate AI historical imagery or coded stick-figure SVGs.
2. **Logically Deducible Visual-Source Locks:** Pupils must actively inspect the authentic source plate to crack each lock (never trivial guesswork or silly giveaway decoys):
   - *Cartographic / Geographic Deductions* (e.g. Saxton's 1579 map facing `GALLIAE PARS`, Lochleven aerial island water barrier).
   - *Portrait / Manuscript Clue Inspection* (e.g. Hans Eworth's Norfolk portrait clues + undated chronicle → 3-dial year vault).
   - *Real Cryptanalysis* (e.g. scrambled Tudor cipher key with real `"Nullos"` decoys, Enigma rotors `B–R–K`, Folio 46v Latin).
   - *Tactile Locks* (3×3 Torn Charter tile-swap, 4-Dial Ration Weight Vault `1–2–4–8`, 3-Dial Tax Vault `5–13–10`).

---

## 4. Full-Screen Ergonomics & Zero Dead Space
1. **True Full-Screen Toggle:** `.is-fullscreen` MUST apply `position: fixed; inset: 0; z-index: 99995; width: 100vw; height: 100vh; overflow-y: auto; display: flex; flex-direction: column;` AND call native `requestFullscreen()` / `exitFullscreen()` so Full Screen works identically inside both the Revision Arcade and Lesson Modals.
2. **Zero Blank Bottom Void:** Cover and Prologue stages must use `flex: 1` and mount an interactive **Escape Trail Console Strip** at the bottom showing all chambers and live lock status.

---

## 5. Workbook Back-Cover Homework Verification Chain (`renderWorkbookCodeCardHTML`)
Every Escape Room Finale MUST reveal an official **Homework Verification Code Phrase** (`renderWorkbookCodeCardHTML({ slotLabel, phrase, instruction })`) representing that lesson's slice of the **Unit Master Verdict Sentence**. Pupils copy the unlocked phrase into the matching numbered slot on the **Back Cover of their Printed Pupil Workbook**, building a complete, memorable unit-verdict paragraph across the term with **15-second zero-marking teacher verification**.
