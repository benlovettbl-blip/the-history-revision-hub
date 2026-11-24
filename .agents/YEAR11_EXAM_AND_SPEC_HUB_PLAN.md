# Approved Blueprint: Year 11 "Specification-First & Fleshed-Out Exam Card" 4-Ring Mind-Map Engine (v8 — Prototype-First on `cme_new`)

> **Status:** All-Surface Spec Word-Lock Complete (`0` gaps across all 6 courses) — Upgraded **`cme_new` Prototype & Engine to 4-Ring Fleshed-Out Exam Cards** (retiring Ring 5 sideways sprawl & stripping non-GCSE trivia).
> **Recommended AI Model:** **Gemini 4 Carbon (Medium)** (Prototype verification) → **Gemini 4 Carbon (High)** (Parallel 5-unit `/swarm` rollout once approved).

---

## 1. Four High-Impact Refinements From Live Pedagogical Review

### Refinement 1: 100% Specification-First Ring 1 → Ring 2 → Ring 3 Skeleton (Zero Buried Spec Points)
Exam stems on Paper 1, Paper 2, and Paper 3 are lifted **100% around the printed Pearson Edexcel specification bullets**. Previously, forcing Ring 2 = *Hub Lessons* and Ring 3 = *5 Lesson Blocks* caused multi-topic lessons (like CME Lesson 2 and Lesson 10) to bury official specification bullets (such as `Arafat's speech to the UN (1974)`, `PLO activities in Lebanon`, `IDF`, `US aid to Israel`) inside Ring 4.
* **New Rule (Enforced by Automated Gate):**
  * **Ring 1 (`Tier 1`):** Official Edexcel Key Topics (`KT1`, `KT2`, `KT3`...)
  * **Ring 2 (`Tier 2`):** Official Edexcel Numbered Sub-Topics (`1.1`, `1.2`, `1.3`... — `9` exact sub-topics on `cme_new`, never merging `1.1` & `1.2`!)
  * **Ring 3 (`Tier 3 — 🎯 Grades 4–5: Spec Stem`):** **Every single atomic Edexcel specification clause MUST stand as its own dedicated Ring-3 stem pill** (plus flagship named exam episodes like `King David Hotel`, `Sergeants & SS Exodus`, `UN Resolution 181`), with `📖 Lesson · Stage` attached as a deep-link pointer rather than dictating the tree shape!

### Refinement 2: Paper-Calibrated Exam Tags on Ring 4 (`Q1 Consequence` + `Q2 Narrative` + `Q3 Importance`)
Yes — Paper 2P is **not** just consequences: **Q1 = Two Consequences (`8m`)**, **Q2 = Analytical Narrative (`8m`)**, and **Q3 = Importance *for [Target Theme]* (`16m` — a full 50% of the paper!)**. Writing a plain consequence in Q3 without explaining *how it changed a bigger theme* (Superpower Involvement, Arab–Israeli Relations, International Attitudes, or the Peace Process) caps a pupil at Level 2.

So the Mind Map answers **all 3 Paper 2P question types** structurally:
1. **`Q2 Analytical Narrative (8m)` = Top-to-Bottom Ring 3 Order Inside Each Ring-2 Sub-Topic:** Edexcel sets Q2 across a Sub-Topic date span (e.g. `1945–48`, `1974–79`, `1982–93`). Because Ring 3 lists every specification clause in strict chronological order with causal link notes on the parent Ring-2 Sub-Topic, **reading down Ring 3 inside any Sub-Topic gives the exact `Beginning → Middle → End` Q2 chain**.
2. **`Q1 Consequences (8m)` + `Q3 Importance For... (16m)` = Colour-Coded `node.tag` Micro-Badges on Ring 4 (`🔥 Grades 6–8`):**
   Every Ring-3 Specification Stem unfolds into `4–5` tagged Ring-4 branches, each feeding its own `★ Grade 9 Edge` leaf on Ring 5:
   * *Example — Ring 3 `Invasion of Lebanon (1982) & Results`:*
     * `[Cause/Event] Argov Shot → Op. Peace for Galilee` ➔ **`★`** `10-Week West Beirut Siege`
     * `[Conseq] PLO Expelled to Tunis` ➔ **`★`** `14,000 Fighters Evacuated by Sea`
     * `[Conseq] Sabra & Shatila → Sharon Sacked` ➔ **`★`** `Kahan Inquiry & 400k Protest`
     * `[Conseq] Rise of Hezbollah` ➔ **`★`** `Iran-Backed Southern Zone War`
     * `[Importance] Strained US Ties & Shifted PLO Strategy` ➔ **`★`** `Ended Lebanon Front; Pushed Tunis Diplomacy`
3. **Engine Reusability Across All 4 Edexcel Paper Types (Data-Driven `node.tag`):**
   * **Paper 2P (`Middle East`, `Cold War`):** `[Cause/Event]` • `[Conseq]` • `[Importance]`
   * **Paper 2B (`Elizabeth`):** `[Feature]` (`Q1 4m`) • `[Cause]` (`Q2 12m`) • `[Significance]` (`Q3 16m`)
   * **Paper 1 (`Medicine`):** `[Change]` / `[Continuity]` (`Q3 4m`) • `[Factor]` (`Q4 12m`) • `[Impact]` (`Q5/6 16m`)
   * **Paper 3 (`Weimar`, `USA`):** `[Cause]` (`Q1b 12m`) • `[Impact]` • `[Debate]` (`Q3d 16m Interpretations`)

### Refinement 3: 4-Ring Architecture — Flesh Out Ring 4 In-Place Instead of Pushing Out a 5th Ring
* **Why Ring 5 Was Retired:** Pushing out 161 extra sideways boxes forced Ring 4 into cryptic 3-word fragments while padding Ring 5 with A-Level/pub-quiz trivia (*Terje Rød-Larsen*, *Wasfi al-Tal*, *Lord Caradon*). Pearson Edexcel awards Grades 8–9 for **mainstream GCSE evidence + clear AO2 causal/importance explanation**, not obscure trivia.
* **New 3-Step Grade Ladder on 4 Rings:**
  * **`🎯 Grades 4–5` (Rings 1–3):** Exact Edexcel Key Topics ➔ `9` Numbered Sub-Topics ➔ all `35` verbatim Specification Stems.
  * **`🔥 Grades 6–7` (Ring 4 — Compact Headlines):** Unfolds `[Cause]`, `[Event]`, `2+ × [Conseq]`, and `[Importance]` pills as crisp 1-line headlines.
  * **`★ Grades 8–9` (Ring 4 — Fleshed-Out 2-Line Exam Cards, *Zero Extra Sideways Branches*):** Expands a 10–18 word plain-English GCSE detail + *"so what?"* line **inside each Ring-4 card** beneath the headline.

### Refinement 4: Auto-Expand on Grade-Pill Tap (`0` Manual Hunting)
* Tapping **`🎯 Grades 4–5`**, **`🔥 Grades 6–8`**, or **`★ Grade 9 Edge`** in the top Studio bar **immediately auto-expands every branch inside your currently open Key Topic(s) all the way out to that exact ring** and glides the camera to fit (and if `0` Key Topics are open yet, auto-opens `KT1` all the way to that ring at legible zoom, plus a 1-tap `Unfold All KTs` button).

### Refinement 5: 1-Click Branch Direction Switcher (`↔ Balanced` · `→ All Right` · `← All Left`)
* Because `computeBidirectionalLayout()` places trunks mathematically around `(0, 0)`, a compact 3-way direction toggle (`↔` Centre-Out Balanced | `→` All Right | `←` All Left, remembered in `localStorage`) lets any teacher or pupil flip instantly between a **symmetric centre-out spider/radial map**, a **left-to-right chronological tree** (`KT1` top → `KT3` bottom, great for English reading flow & smartboards), or **all-left** with zero extra JSON duplication.

### Refinement 6: True Vector A4 / A3 Visual Mind-Map Printer (`🖨️ Print Mind Map` Modal)
Replaces the old table-style sheet with a **true vector radial/tree Mind-Map print engine** (`@page { size: A4 landscape }` or `@page { size: A3 landscape }`), respecting real physical font legibility (`>= 7.5pt`–`10pt`):
* **Scope Selector (Solving the Page-Density Physics):**
  1. **`1 Key Topic per Page` *(Recommended Default — e.g. 3 sheets for Middle East)*:** Gives spacious `8.5pt–10.5pt` legibility even when expanded all the way out to **Ring 4 (`Grades 6–8`)** or **Ring 5 (`★ Grade 9 Edge`)** on **A3 Landscape** (or **Ring 3 (`Grades 4–5`)** on **A4 Landscape**).
  2. **`Whole Course on 1 Sheet` *(Master Specification Map)*:** Prints all Key Topics (`KT1–KT3`) up to **Ring 3 (All Official Edexcel Spec Stems)** on **one single A3/A4 Landscape sheet** as a big-picture course map.
  3. **`Current Open View`:** Prints the exact Sub-Topic/branch currently unfolded on screen on 1 sheet.
* **Depth & Style Toggles:**
  * **Grade Depth:** `🎯 Up to Ring 3 (G4–5)` | `🔥 Up to Ring 4 (G6–8)` | `★ All 5 Rings (Grade 9 Edge)`.
  * **Classroom Mode:** **`📖 Completed Revision Poster`** vs **`✏️ Blank Write-On Blurt Map`** (prints the real visual Mind Map up to Ring 3, with empty tagged `[Conseq: _________]` and `[Importance: _________]` branch boxes on Ring 4 for pupils to fill in by hand — zero colour toner wasted!).

### Refinement 7: Two High-Impact Classroom Polish Additions (`🙈 Blur-to-Test` & `🔍 Find on Map`)
* **`🙈 Blur Recall` Toggle:** Frosts Ring 4 & Ring 5 labels (`filter: blur(5px)`) while keeping the `[Conseq]` / `[Importance]` tags visible — pupils recall the answer first, then tap any blurred pill to reveal it cleanly.
* **`🔍 Find & Glide` Input:** Typing any person/event (`Litani`, `242`, `Begin`, `Exod`) auto-unfolds that branch and glides the camera straight to the highlighted node.

### Refinement 8: Strict Non-Redundant Progressive Specificity Law (Zero Ring-to-Ring Echoes)
* **Never Repeat Parent Words Outward Along a Branch:** Every step from Ring 3 ➔ Ring 4 ➔ Ring 5 must add **100% fresh historical specificity** rather than re-stating or echoing words already visible on the parent pill (e.g. never write `Camp David` ➔ `13-Day Camp David Summit` ➔ `Two Camp David Frameworks`, or `June Truce & Czech Arms` ➔ `Czech Arms & Avia Fighters`, or duplicate a phrase like `Plan Dalet & Deir Yassin` across two branches).
* **Automated Gate (`scripts/verify_mindmap_ring3_spec.cjs`):** Hard-fails any Mind Map with duplicate node labels or substantive word overlap (`R4 ∩ R5` or `R3 ∩ R5`), guaranteeing every `★ Grade 9 Edge` leaf delivers brand-new examiner evidence.

---

## 2. Prototype-First Execution Order
1. **Step 1 (`cme_new` Single-Source-of-Truth + Engine Prototype ONLY):**
   * Ensure `Coastal Road Massacre (1978)` and `Ambassador Argov shooting (1982)` are also explicitly present in `cme_new` `lesson_10` `[1.1–1.2]` (+ `l10_s1` infographic & delta MP3) so Narrative, Infographic, and Mind Map match 100%.
   * Upgrade `src/true_mindmap_engine.js` (+ `.css`) with **Auto-Expand on Grade-Pill Tap**, `[Cause]`/`[Event]`/`[Conseq]` micro-badges on Ring 4, and the recalibrated **`🎯 G4–5` / `🔥 G6–8` / `★ Grade 9 Edge`** pills.
   * Rebuild `data/mindmaps/cme_new.json` (`public/data/mindmaps/cme_new.json`) on the **100% Specification-First (`9` Sub-Topics -> Every Atomic Spec Clause on Ring 3 -> `Cause / Event / 2+ Consequences` on Ring 4 -> `★ Grade 9 Edge` on Ring 5)** blueprint, verified at `0` overlaps.
2. **Step 2 (User Sign-Off on `cme_new` Prototype -> 5-Unit Rollout):**
   * Only AFTER you inspect and approve the live `cme_new` prototype on your screen/tablet do we stamp this exact perfected blueprint across `gcse_cold_war`, `eee`, `weimar_nazi_germany`, `usa`, and `edexcel_medicine`.
