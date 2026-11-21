/**
 * History Revision Hub — Guidance Manuals Generator
 *
 * Compiles professional, laminated-style A4 PDF standard operating procedures
 * into public/history_revision_hub_guidance/ with automated DOM overflow and
 * pdf-parse physical page-count verification.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');

const outputDir = path.join(__dirname, '..', 'public', 'history_revision_hub_guidance');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const guides = [
  {
    id: 'guide_01',
    filename: 'Guide_01_The_Tripartite_Curriculum_Model.pdf',
    expectedPages: 1,
    title: 'Guide 01: The Curricular Separation-of-Concerns Model',
    subtitle: 'Architecture & 1-to-1 Alignment Across Textbooks, Pupil Workbooks, Retrieval Companions & The Web App',
    category: 'CURRICULUM ARCHITECTURE & SYSTEM DESIGN',
    content: `
      <div class="intro-box">
        <strong>Executive Summary:</strong> The History Revision Hub separates reading, writing, spaced retrieval, and multimedia enquiry into distinct, synchronized resources. Each lesson shares an identical <strong>5-Stage Chronological Spine (<code>Stage 1</code>–<code>Stage 5</code>)</strong> across screen and print—eliminating split-attention, preventing numbering drift, and cutting reprographics waste.
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-header blue">📖 Classroom Textbook (Reusable)</div>
          <div class="card-body">
            <strong>Role:</strong> Durable classroom reading anthology.<br><br>
            <strong>Key Features:</strong>
            <ul>
              <li>100% pure disciplinary narrative prose read verbatim from live unit JSON data.</li>
              <li>Balanced 2-column <code>Lora</code> serif measure at KS3/GCSE (single wide-margin column at KS2).</li>
              <li>Clean <code>[1.1]</code>–<code>[1.5]</code> block headers with <strong>zero</strong> in-prose bracket pills.</li>
              <li><strong>Zero</strong> source boxes, <strong>zero</strong> margin glossary strips, and <strong>zero</strong> task lines.</li>
              <li>Outside back-cover oral/notebook Knowledge Retrieval Quiz (zero answers printed).</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <div class="card-header amber">📝 Pupil Workbook (Consumable)</div>
          <div class="card-body">
            <strong>Role:</strong> Termly saddle-stitched A4 writing pack.<br><br>
            <strong>Key Features:</strong>
            <ul>
              <li>Pure <code>#000000</code> monochrome interior for crisp, zero-dither school photocopying.</li>
              <li><strong>Verso (Left):</strong> 5 full-width stacked Stage Question boxes (<code>&le; 82 chars</code>, 5 ruled lines each).</li>
              <li><strong>Recto (Right):</strong> Genre-calibrated extended/exam writing (~8mm pitch) with content-free <code>Analytical Connectives:</code> and unassigned <code>Key Terms:</code>.</li>
              <li><strong>Zero</strong> in-workbook Do Nows and <strong>zero</strong> factual giveaways in stems.</li>
              <li>Center-Spine Specification Mind-Map Canvas + British Exercise Notes pages.</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <div class="card-header emerald">💻 Interactive Web App (Digital Hub)</div>
          <div class="card-body">
            <strong>Role:</strong> Multimedia classroom &amp; home revision engine.<br><br>
            <strong>Key Features:</strong>
            <ul>
              <li>3-Mode Spaced-Retrieval <strong>Do Now</strong> engine (strictly prior lessons/units).</li>
              <li>Studio Historian UK audio (<code>0.85x / 1.0x / 1.15x</code>) with sentence/word karaoke tracking &amp; visual-stress overlays.</li>
              <li>Alternating visual plates + 5 rotated primary sources (<code>A–E</code>) with Hinge Questions.</li>
              <li>In-place Vocabulary &amp; Key Individual Dossier popovers + 1-Page Visual Story Sheets.</li>
              <li>Tap-Tile Summary Clozes, Self-Marking Quizzes, Universal Arcade &amp; Exam Practice Zone.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section-title">Why Separation of Concerns Prevents Curriculum Drift</div>
      <p>Alongside companion <strong>Master Knowledge Retrieval Companions ("Quiz Packs")</strong> and <strong>Mastery Exam Packs</strong>, keeping pure reading in the reusable Textbook while housing active writing in the Workbook and interactive scaffolding in the Web App solves two chronic departmental problems:</p>
      <div class="highlight-rule">
        <strong>1-to-1 Stage Synchronization Invariant:</strong> Every lesson's 5 narrative blocks, 5 Web App Chronology Spine cards, and 5 Printed Workbook Verso boxes are locked together by automated SHA-1 prose-hash verification (<code>npm run audit:stages</code>). Editing any narrative paragraph automatically flags its paired Stage Question for verification before PDF compilation.
      </div>
    `,
  },
  {
    id: 'guide_02',
    filename: 'Guide_02_The_Master_Cover_Engine_and_Customizer.pdf',
    expectedPages: 1,
    title: 'Guide 02: The Master Cover Engine & Commercial Customizer',
    subtitle: 'Standardized Cover Architecture, Provenance Metadata & Multi-School Branding',
    category: 'DESIGN SYSTEM & INSTITUTIONAL NEUTRALITY',
    content: `
      <div class="intro-box">
        <strong>Executive Summary:</strong> All printed pupil workbooks enforce the <strong>Master Cover Engine</strong> (<code>scripts/components/render_standard_cover.cjs</code>). This guarantees uncropped archival artwork presentation, curriculum alignment, and 100% institutional neutrality so any adopting school can stamp its own department name cleanly.
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header blue">🏛️ Front Cover Architecture (Page 1)</div>
          <div class="card-body">
            <ul>
              <li><strong>Commercial Customizer Hook:</strong> Encloses <code>&lt;span class="school-brand-target"&gt;The History Department&lt;/span&gt;</code> inside <code>data-department-name</code> for multi-school branding.</li>
              <li><strong>Responsive Uncropped Artwork Gate:</strong> Automatically selects landscape showcase or split-portrait framing with <code>object-fit: contain</code> and verified museum accession metadata.</li>
              <li><strong>Pedagogical Anchor Deck:</strong> Displays 4 Core Features, 3-Pillar Visual Matrix, Disciplinary Significance statement, and a Targeted Hinge Question.</li>
              <li><strong>Pupil Identification Block:</strong> Clean Name, Class, and blank Teacher fields (zero school identifiers; zero GCSE target-grade clutter on KS3 covers).</li>
              <li><strong>Course Specification Directory:</strong> Maps unit enquiries directly to National Curriculum or Pearson Edexcel specification points at <code>0px</code> overflow.</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <div class="card-header purple">📊 Back Cover Architecture (Final Page)</div>
          <div class="card-body">
            <ul>
              <li><strong>Assessment Pathway Benchmarks:</strong> Displays transparent KS3 percentage bands (<code>Em 35%</code>, <code>Em+ 50%</code>, <code>Ex 65%</code>, <code>Ex+ 80%</code>, <code>GD 90%</code>) or GCSE Edexcel grade descriptors.</li>
              <li><strong>6-Row Marking &amp; Progress Grid:</strong> Tracks core unit enquiries plus one designated teacher assessment task cleanly on one scannable ledger.</li>
              <li><strong>Teacher Sign-Off &amp; Verification:</strong> Dedicated signature/date spaces supporting low-workload classroom perimeter checks.</li>
              <li><strong>Permanent Vector QR Hub:</strong> Crisp vector SVG QR codes linking directly to <code>historyrevisionhub.co.uk</code> interactive lessons, audio read-alouds, and self-marking quizzes.</li>
              <li><strong>Automated Page-Budget Gate:</strong> Audited in headless Chromium to guarantee <code>&ge; 95%</code> space utilization and zero trailing spillover pages.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section-title">Commercial Multi-School Customizer Pattern</div>
      <p>To uphold strict commercial independence, hardcoded school names are prohibited across the codebase. Adopting schools can customize booklet covers via three supported hooks:</p>
      <div class="code-box">
        1. <strong>Browser Query Param:</strong> Append <code>?school=St+Peters+Collegiate</code> when opening any HTML booklet.<br>
        2. <strong>CLI Build Environment Variable:</strong> <code>SCHOOL_NAME="St Jude's Academy" node scripts/render_&lt;unit&gt;_workbook.cjs</code><br>
        3. <strong>Stylesheet Override:</strong> Target <code>.school-brand-target</code> or <code>[data-department-name]</code> prior to print export.
      </div>
    `,
  },
  {
    id: 'guide_03',
    filename: 'Guide_03_Reprographics_and_Print_Handbook.pdf',
    expectedPages: 1,
    title: 'Guide 03: Reprographics & Print Handbook',
    subtitle: 'Saddle-Stitch Imposition, Gutter Margins & Duplex Booklet Production',
    category: 'PRINT PRODUCTION & REPROGRAPHICS MANUAL',
    content: `
      <div class="intro-box">
        <strong>Instructions for Reprographics &amp; Print Room Staff:</strong> All textbooks and pupil workbooks are engineered as <strong>A4 Portrait Saddle-Stitched Booklets</strong> in exact multiples of 4 pages (<code>8</code>, <code>12</code>, <code>16</code>, <code>20</code>, <code>24</code>, or <code>28</code> pages — printed two-up on A3 sheets, folded and stapled on the spine).
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header emerald">🖨️ Photocopier / RISO Machine Settings</div>
          <div class="card-body">
            <ul>
              <li><strong>Original Document Size:</strong> A4 Portrait (210mm &times; 297mm).</li>
              <li><strong>Target Paper Size:</strong> A3 Landscape (420mm &times; 297mm).</li>
              <li><strong>Layout Mode:</strong> Booklet / 2-Up Saddle-Stitch (Left Binding).</li>
              <li><strong>Duplexing:</strong> 2-Sided &rarr; 2-Sided (Flip on Short Edge).</li>
              <li><strong>Finishing / Stapling:</strong> Center Saddle-Stitch (Dual Spine Staples).</li>
              <li><strong>Scaling:</strong> 100% Actual Size (do NOT select "Fit to Printable Area" as margins are pre-calibrated).</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <div class="card-header blue">📐 Gutter Margins, Monochrome Interiors &amp; Stock</div>
          <div class="card-body">
            <ul>
              <li><strong>Internal Gutter &amp; Trim Safety:</strong> Calibrated inner/outer margins ensure text and ruled lines are never swallowed by the spine fold or guillotine trim.</li>
              <li><strong>Zero-Dither Monochrome Interiors:</strong> Pupil Workbook interior pages use pure <code>#000000</code> ink on white paper so black-and-white photocopiers never muddy grey/navy fills.</li>
              <li><strong>Recommended Paper Stock:</strong>
                <ul>
                  <li><strong>Outer Cover Sheet:</strong> 120gsm–160gsm Silk/Matt Card (Colour).</li>
                  <li><strong>Interior Sheets:</strong> 80gsm–90gsm Uncoated White (prevents pen bleed-through).</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section-title">Sample 16-Page Booklet Imposition (4 Folded A3 Sheets)</div>
      <p>Because every booklet is compiled to an exact multiple of 4 pages, every lesson opens flat as a facing <strong>Verso (Left) + Recto (Right)</strong> spread:</p>
      <div class="imposition-diagram">
        <strong>Sheet 1 (Outer):</strong> Page 16 (Back Cover) &bull; Page 1 (Front Cover) &nbsp;|&nbsp; <em>Reverse:</em> Page 2 &bull; Page 15 (Exercise Notes)<br>
        <strong>Sheet 2:</strong> Page 14 (Exercise Notes) &bull; Page 3 (Enquiry Spread) &nbsp;|&nbsp; <em>Reverse:</em> Page 4 &bull; Page 13<br>
        <strong>Sheet 3:</strong> Page 12 (Enquiry Spread) &bull; Page 5 (Enquiry Spread) &nbsp;|&nbsp; <em>Reverse:</em> Page 6 &bull; Page 11<br>
        <strong>Sheet 4 (Centrefold):</strong> Page 10 &bull; Page 7 &nbsp;|&nbsp; <em>Reverse (Dead Centre):</em> Page 8 &bull; Page 9 (Centrefold Mind-Map / Timeline)
      </div>
    `,
  },
  {
    id: 'guide_04',
    filename: 'Guide_04_Disciplinary_Pedagogy_and_Research_Evidence.pdf',
    expectedPages: 4,
    title: 'Guide 04: Disciplinary Pedagogy & Research Evidence',
    category: 'EVIDENCE-INFORMED PEDAGOGICAL BLUEPRINT',
    pages: [
      {
        subtitle:
          'Part I: Foundational Pillars — Counsell, Quigley, Hochman & Wexler, Coe & Cognitive Load',
        content: `
          <div class="intro-box">
            <strong>Academic Rationale:</strong> Every live feature in The History Revision Hub is grounded in peer-reviewed cognitive science and history education scholarship—combining <strong>authentic disciplinary enquiry</strong> with <strong>low-extraneous-load scaffolding</strong> across Key Stage 2, Key Stage 3, and Pearson Edexcel GCSE.
          </div>

          <div class="grid-2">
            <div class="card">
              <div class="card-header blue">🏛️ 1. Christine Counsell: 3-Layer Enquiry &amp; 5-Stage Narrative</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Substantive historical facts only endure as residual schema when carried inside a coherent causal narrative answering a genuine enquiry question.<br><br>
                <strong>Live Platform Implementation:</strong>
                <ul>
                  <li><strong>5-Stage Narrative Spine (<code>[X.1]</code>–<code>[X.5]</code>):</strong> Each lesson unfolds across 5 structured two-paragraph narrative blocks—eliminating disjointed worksheet trivia.</li>
                  <li><strong>Alternating Archival Visual Plates:</strong> 2–3 authentic visual plates flank the narrative prose with academic captions and zero clutter.</li>
                  <li><strong>5 Rotated Primary Sources (<code>Sources A–E</code>):</strong> Collapsible drawers rotate decrees, maps, photographs, diaries, and artefacts with natural 1–2 sentence model answers and Hinge Questions (zero formulaic NOP boxes).</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Counsell, C. (2000). <em>Teaching History</em>, 100 &bull; Dawson, I. (2004). <em>Teaching History</em>, 117.<br>
                  <a href="https://www.history.org.uk/secondary/categories/436/module/8702/teaching-history" target="_blank">www.history.org.uk (Historical Association)</a>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header amber">📚 2. Alex Quigley: Closing the Vocabulary Gap Without Clutter</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Explicit Tier-2/3 vocabulary support unlocks comprehension, provided definitions do not crowd printed reading margins.<br><br>
                <strong>Live Platform Implementation:</strong>
                <ul>
                  <li><strong>Ambient In-Text Vocabulary Popovers:</strong> Dotted underlines (once per root term per lesson) open age-calibrated definitions and spoken audio in place on hover/tap.</li>
                  <li><strong>Inline Dossier Quick-Peek Pills:</strong> First mentions of historical actors open contextual <code>[🪪 Person]</code> and <code>[🏛️ Organisation]</code> biographical popovers.</li>
                  <li><strong>Tap-Tile Summary Cloze &amp; Lexical Banks:</strong> Every lesson ends with an interactive Consolidate summary cloze (<code>+2</code> adjacent-lesson decoys) plus Flashcard decks.</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Quigley, A. (2018). <em>Closing the Vocabulary Gap</em>, Routledge &bull; EEF Secondary Literacy.<br>
                  <a href="https://www.theconfidentteacher.co.uk/" target="_blank">www.theconfidentteacher.co.uk</a>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header emerald">✍️ 3. Hochman, Wexler &amp; Coe: Zero-Giveaway Writing Scaffolds</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Writing scaffolds must support sentence structure and genre mechanics without leaking factual answers ("memory is the residue of thought").<br><br>
                <strong>Live Platform Implementation:</strong>
                <ul>
                  <li><strong>Split <code>[Word Bank ▾]</code> + <code>[Sentence Starters ▾]</code> Toolbar:</strong> Digital writing panels separate unassigned Tier-3 terms from structural sentence openers.</li>
                  <li><strong>Content-Free Workbook Connectives:</strong> Printed Recto pages provide structural transitions (<em>"One key consequence was that..."</em>) with zero factual giveaways.</li>
                  <li><strong>Post-Writing Exemplar Reveal:</strong> Complete high-tariff Model Answers and Mark Schemes stay hidden in digital drawers until after independent writing.</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Hochman &amp; Wexler (2017). <em>The Writing Revolution</em> &bull; Coe et al. (2014). <em>What Makes Great Teaching?</em><br>
                  <a href="https://www.thewritingrevolution.org/" target="_blank">www.thewritingrevolution.org</a>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header purple">🧠 4. John Sweller: Cognitive Load &amp; Typographic Ergonomics</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Working memory is strictly limited; eliminating visual clutter and spatial split-attention preserves bandwidth for causal reasoning.<br><br>
                <strong>Live Platform Implementation:</strong>
                <ul>
                  <li><strong>Pure 2-Column Textbooks (<code>Lora</code> Serif):</strong> Constrains line length to 50–65 characters with zero sidebars, zero vocab ribbons, and zero in-prose bracket pills.</li>
                  <li><strong>Flat Facing Double-Page Workbooks:</strong> Every lesson sits on a single open Verso + Recto spread—never forcing page-flipping to answer questions.</li>
                  <li><strong>Automated Page-Budget Gate:</strong> Headless Chromium and <code>pdf-parse</code> audits enforce <code>0px</code> overflow across all saddle-stitched booklets.</li>
                </ul>
                <div class="citation">
                  <strong>Reference:</strong> Sweller, J. (1988; 2019). <em>Cognitive Load Theory</em> &bull; EEF Cognitive Science Review.<br>
                  <a href="https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/cognitive-science-approaches-in-the-classroom" target="_blank">educationendowmentfoundation.org.uk</a>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        subtitle:
          'Part II: SEND Accessibility by Design, Spaced Retrieval Isolation & Low-Workload Formative Feedback',
        content: `
          <div class="grid-2">
            <div class="card">
              <div class="card-header" style="background: #e11d48;">♿ 5. SEND &amp; Inclusive Accessibility by Design</div>
              <div class="card-body">
                <strong>Core Concept:</strong> High visual predictability and multimodal scaffolding—never dumbed-down content—make rigorous history accessible to neurodiverse learners.<br><br>
                <strong>Enforced Across Platform &amp; Print:</strong>
                <ul>
                  <li>✅ <strong>Age-Calibrated 2-Paragraph Blocks:</strong> Budgeted strictly by cohort (<code>50–80w</code> KS2, <code>80–110w</code> KS3, <code>110–140w</code> GCSE) to prevent wall-of-text tracking fatigue.</li>
                  <li>✅ <strong>Persistent Visual-Stress Overlays:</strong> Tinted screen overlays restore instantly on load with zero white flash for Irlen/visual-stress readers.</li>
                  <li>✅ <strong>1-Page Visual Story Sheets:</strong> Studio-voiced 6-card (4-card KS2) archival storyboards accompany every single lesson across all units.</li>
                  <li>✅ <strong>~7.8mm–8.2mm Monochrome Ruled Lines:</strong> Generous full-width handwriting pitch supports dysgraphic and fine-motor needs.</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> EEF (2020). <em>SEN in Mainstream Schools</em> &bull; British Dyslexia Association Style Guide.<br>
                  <a href="https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/send" target="_blank">educationendowmentfoundation.org.uk/.../send</a>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" style="background: #0d9488;">🔄 6. Barak Rosenshine: Spaced Recall Isolation &amp; Hinges</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Daily retrieval strengthens long-term schema only when starters test previously taught material rather than forcing guesses on untaught topics.<br><br>
                <strong>Live Platform Implementation:</strong>
                <ul>
                  <li><strong>Zero Self-Testing Rule:</strong> Digital Do Now starters are strictly forbidden from testing today's new lesson content.</li>
                  <li><strong>3-Mode Spaced Retrieval Deck:</strong> Toggles cleanly between <em>Last Lesson</em>, <em>Earlier in Unit</em> interleaving, and <em>Synoptic Prior Units</em> with a single-row timer.</li>
                  <li><strong>Targeted Hinge Questions:</strong> Embedded at the end of every primary source context and Teacher Note objective to check understanding mid-lesson.</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Rosenshine, B. (2012). <em>Principles of Instruction</em> &bull; Roediger &amp; Karpicke (2006).<br>
                  <a href="https://www.aft.org/ae/spring2012/rosenshine" target="_blank">www.aft.org/ae/spring2012/rosenshine</a>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" style="background: #4338ca;">📊 7. Dylan Wiliam: Low-Workload Formative Feedback</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Feedback must generate more thinking for the pupil than marking hours for the teacher.<br><br>
                <strong>Live Platform Implementation:</strong>
                <ul>
                  <li><strong>Self-Marking Lesson Quizzes &amp; Weak Spots:</strong> 15–20 traceable MCQs per lesson give immediate feedback and silently log missed items for review.</li>
                  <li><strong>3-Tier Retrieval Companion Pips (<code>▸</code> / <code>▸▸</code> / <code>▸▸▸</code>):</strong> Printed Quiz Packs ramp from substantive recall to causal explanation and synoptic significance, paired with rear <code>[✓][✗]</code> DIRT Marking Banks.</li>
                  <li><strong>6-Row Back-Cover Assessment Grid:</strong> Tracks core unit enquiries and designated assessments on one scannable back cover.</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Wiliam, D. (2011). <em>Embedded Formative Assessment</em> &bull; EEF Feedback Guidance.<br>
                  <a href="https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback" target="_blank">educationendowmentfoundation.org.uk/.../feedback</a>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" style="background: #0f172a;">🌐 8. Master Educational Research Directory</div>
              <div class="card-body">
                <strong>Primary Evidence &amp; Curriculum Scholarship Hubs:</strong>
                <ul>
                  <li><strong>Historical Association (Teaching History):</strong> <a href="https://www.history.org.uk" target="_blank">www.history.org.uk</a></li>
                  <li><strong>Education Endowment Foundation (EEF):</strong> <a href="https://educationendowmentfoundation.org.uk" target="_blank">educationendowmentfoundation.org.uk</a></li>
                  <li><strong>Alex Quigley (The Confident Teacher):</strong> <a href="https://www.theconfidentteacher.co.uk" target="_blank">www.theconfidentteacher.co.uk</a></li>
                  <li><strong>The Writing Revolution:</strong> <a href="https://www.thewritingrevolution.org" target="_blank">www.thewritingrevolution.org</a></li>
                  <li><strong>British Dyslexia Association:</strong> <a href="https://www.bdadyslexia.org.uk" target="_blank">www.bdadyslexia.org.uk</a></li>
                  <li><strong>Dylan Wiliam Assessment Archive:</strong> <a href="https://www.dylanwiliam.org" target="_blank">www.dylanwiliam.org</a></li>
                </ul>
                <div class="citation" style="margin-top: 8px;">
                  Full research syntheses and classroom protocols are accessible in the Department Portal (<code>src/pedagogy_data.js</code>).
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        subtitle:
          'Part III: Studio Prosody, Anti-Simplification, Guided Reading & Dual-Coding Consolidation',
        content: `
          <div class="grid-2">
            <div class="card">
              <div class="card-header" style="background: #b45309;">📖 9. Shanahan &amp; Lemov: The Anti-Simplification Standard</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Stripping academic vocabulary out of historical texts widens the literacy gap (the Matthew Effect). Pupils progress faster when complex prose is scaffolded rather than simplified.<br><br>
                <strong>Why We Reject "Simplify Text" Toggles:</strong>
                <ul>
                  <li>❌ Deleting Tier-2 connectives (<em>consequently, despite, whereas</em>) destroys historical cause-and-effect logic.</li>
                  <li>❌ Replacing specification nouns with vague everyday synonyms leaves pupils unable to access exam questions or primary sources.</li>
                  <li>✅ Instead, we calibrate sentence length cleanly while keeping rich vocabulary supported by audio prosody and hover popovers.</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Shanahan, T. (2025). <em>Leveled Reading, Leveled Lives</em> &bull; Lemov, D. (2016). <em>Reading Reconsidered</em>.<br>
                  <a href="https://www.shanahanonliteracy.com/" target="_blank">www.shanahanonliteracy.com</a>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" style="background: #0369a1;">🎙️ 10. Built-In Platform Feature: Studio Voices &amp; Guided Reading</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Hearing fluent adult prosody while tracking printed text frees working memory from decoding strain.<br><br>
                <strong>Built Directly Into the Web App:</strong>
                <ul>
                  <li><strong>Multi-Speed Studio Historian Audio (<code>0.85x / 1.0x / 1.15x</code>):</strong> Pitch-preserved British documentary narration across every lesson block and Visual Story Sheet with zero-reflow sentence highlighting and click-any-sentence seeking.</li>
                  <li><strong>KS2 &amp; KS3 Guided Reading Companions:</strong> Provenance-labelled primary &amp; literary extracts structured as <em>Step 1 (2&times;2 Key Words) &rarr; Step 2 (Studio Read-Aloud) &rarr; Step 3 (3-Min Discussion + Answer Guides)</em>.</li>
                  <li><strong>GCSE Paper 3 Two-Historian Audio Clashes:</strong> Contrasting male/female studio voices bring <em>Interpretation 1 vs 2</em> debates alive.</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Quigley, A. (2020). <em>Closing the Reading Gap</em> &bull; Such, C. (2021).
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" style="background: #15803d;">🎯 11. Recommended Teacher Routine: Shared Reading Delivery</div>
              <div class="card-body">
                <strong>Optional Classroom Protocol Alongside Textbook / App:</strong><br>
                <em>(Suggested in our 2-Lesson Delivery Plans — teacher-led, not automated):</em>
                <ol style="padding-left: 16px; margin: 4px 0;">
                  <li><strong>Pre-Teach 2 Barrier Terms (90s):</strong> Preview two Tier-3 words from the lesson Vocabulary Bank before reading begins.</li>
                  <li><strong>80/20 Expert Prosody:</strong> Teacher (or the 1.0x Studio Player) models 80% of the passage so causal pacing stays brisk.</li>
                  <li><strong>Spotlight Micro-Turns:</strong> Invite developing readers to read a punchy 1–2 sentence conclusion rather than cold round-robin paragraphs.</li>
                  <li><strong>Pause &amp; Synthesise:</strong> Pause at each Stage Question banner for 60–90s of full-sentence Verso note-making.</li>
                </ol>
                <div class="citation">
                  <strong>Reference:</strong> Lemov, D. (2021). <em>Teach Like a Champion 3.0</em> (<a href="https://teachlikeachampion.org/" target="_blank">teachlikeachampion.org</a>).
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" style="background: #6d28d9;">🗺️ 12. Caviglioli &amp; Novak: Center-Spine Mind-Map Canvas</div>
              <div class="card-body">
                <strong>Core Concept:</strong> Combining visual dual-coding with structured causal concept mapping consolidates whole-unit schema without penalizing fine-motor skills.<br><br>
                <strong>Live Workbook &amp; App Synergy:</strong>
                <ul>
                  <li><strong>Pure <code>#000000</code> Center-Spine Canvas:</strong> Pages 2–3 (or KS3 centrefolds) feature a central chronological spine with specification milestone pills and open white branching space—zero pre-printed summary giveaways.</li>
                  <li><strong>Dual Representation Pathways:</strong> KS3 Dual-Pathway timelines let pupils choose between symbolic dual-code icons (Pathway A) or 3-branch causal webs (Pathway B), fuelled by the app's Consolidate Station.</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Caviglioli, O. (2019). <em>Dual Coding with Teachers</em> &bull; Novak &amp; Gowin (1984).
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        subtitle:
          'Part IV: 5-Tier Stage Question Progression, Full-Width Verso Workbooks & Platform Truth Matrix',
        content: `
          <div class="grid-2">
            <div class="card">
              <div class="card-header" style="background: #0f766e;">🪜 13. The 5-Tier Cognitive Question Ladder (KS2 &rarr; GCSE)</div>
              <div class="card-body">
                <strong>Core Principle:</strong> Every narrative block question (<code>&le; 82 chars</code> single-line fit) scales progressively across age cohorts while remaining 100% answerable from its paired prose block:<br><br>
                <ul>
                  <li><strong>KS2 (Y5–6) &amp; Year 7:</strong> &le; 13 words, &le; 2 complex common words — concrete actors, actions, and immediate reactions.</li>
                  <li><strong>Year 8:</strong> &le; 14 words, &le; 3 complex common words — multi-step causal chains and contrasting perspectives.</li>
                  <li><strong>Year 9:</strong> &le; 15 words, &le; 4 complex common words — systemic shifts, turning points, and ideology.</li>
                  <li><strong>GCSE (Y10–11):</strong> &le; 15 words, &le; 5 complex common words — specification-precise mechanisms (open <em>"To what extent..."</em> essays reserved for Recto tasks).</li>
                </ul>
                <div class="citation">
                  <strong>References:</strong> Counsell, C. (2000). <em>Historical Knowledge &amp; Historical Skill</em> &bull; Beck, I. et al. (1997). <em>Questioning the Author</em>.
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header" style="background: #1e3a8a;">📝 14. Full-Width Verso Boxes &amp; Prose-Hash Sustainability</div>
              <div class="card-body">
                <strong>Eliminating Split-Attention &amp; Curriculum Drift Across All Units:</strong>
                <ul>
                  <li><strong>Retired Narrow Trigger Sidebars:</strong> Removing cramped 26mm left trigger columns eliminates spatial split-attention and stops pupils copying 2-word fragments, giving 5 full-width ruled lines for complete causal sentences.</li>
                  <li><strong>1-to-1 App &harr; Print Parity:</strong> Identical canonical Stage Questions appear across Web App slim stage banners, Chronology Spine cards, and Printed Pupil Workbooks while preserving noun-phrase milestone titles for Arcade timelines.</li>
                  <li><strong>Automated SHA-1 Prose-Hash Gate:</strong> Editing any narrative block automatically enforces stage-question answerability checks during <code>sync:unit</code> and <code>audit:stages</code>.</li>
                </ul>
                <div class="citation">
                  <strong>Reference:</strong> Chandler, P. &amp; Sweller, J. (1991). <em>Cognitive Load Theory and the Format of Instruction</em>.
                </div>
              </div>
            </div>
          </div>

          <div class="section-title">At-a-Glance Verification Matrix: Where Every Pedagogical Element Lives</div>
          <div class="highlight-rule" style="background: #f8fafc; border-color: #cbd5e1; border-left: 4px solid #0f172a; color: #1e293b;">
            <strong>1. Classroom Textbook:</strong> Pure 2-column <code>Lora</code> narrative (<code>Stage 1–5</code> headers) + Chronological Spine + Back-Cover Oral Recall Quiz (zero clutter).<br>
            <strong>2. Pupil Workbook:</strong> Center-Spine Mind-Map Canvas + Facing Verso (5 full-width Stage Boxes) &amp; Recto (zero-giveaway writing) + Exercise Notes + 6-Row Back Ledger.<br>
            <strong>3. Retrieval Companion:</strong> 3-Tier Difficulty Pips (<code>▸</code> / <code>▸▸</code> / <code>▸▸▸</code>) + Dual-Line Recall Prompts + Synchronized Rear <code>[✓][✗]</code> DIRT Marking Bank.<br>
            <strong>4. Web Application:</strong> Spaced Do Now + Studio Audio &amp; Visual-Stress Overlays + 5 Primary Sources (<code>A–E</code>) with Hinge Questions + Dossier/Vocab Popovers + Visual Story Sheets + Consolidate Cloze, Quizzes, Arcade &amp; Exam Practice Zone.
          </div>
        `,
      },
    ],
  },
];

function generateGuideHtml(guide) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${guide.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *:before, *:after { box-sizing: border-box; }
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 10mm 10mm;
    }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 8.5pt;
      line-height: 1.35;
      color: #0f172a;
      margin: 0;
      padding: 0;
      background: #ffffff;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .page-container {
      width: 100%;
      height: 272mm;
      max-height: 272mm;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2mm 4mm;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .page-container:last-of-type {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .header-bar {
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 5px;
      margin-bottom: 8px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }
    .brand-title {
      font-size: 11pt;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #0f172a;
    }
    .brand-subtitle {
      font-size: 7.5pt;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .cat-badge {
      display: inline-block;
      background: #1e3a8a;
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 3px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16.5pt;
      font-weight: 800;
      margin: 0 0 2px 0;
      color: #0f172a;
      line-height: 1.15;
    }
    .subtitle {
      font-size: 8.3pt;
      color: #475569;
      font-style: italic;
      margin-bottom: 6px;
    }
    .intro-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #1e3a8a;
      padding: 7px 11px;
      border-radius: 4px;
      margin-bottom: 9px;
      font-size: 8.1pt;
      line-height: 1.38;
      color: #1e293b;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
      margin-bottom: 9px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-bottom: 9px;
    }
    .card {
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      overflow: hidden;
      background: #ffffff;
      display: flex;
      flex-direction: column;
    }
    .card-header {
      padding: 5px 8px;
      font-weight: 800;
      font-size: 7.6pt;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #ffffff;
    }
    .card-header.blue { background: #1e3a8a; }
    .card-header.amber { background: #b45309; }
    .card-header.emerald { background: #065f46; }
    .card-header.purple { background: #581c87; }
    .card-body {
      padding: 7px 8px;
      font-size: 7.5pt;
      line-height: 1.33;
      color: #334155;
      flex: 1;
    }
    .card-body ul {
      margin: 4px 0 0 0;
      padding-left: 14px;
    }
    .card-body li {
      margin-bottom: 2.5px;
    }
    .citation {
      margin-top: 5px;
      padding-top: 4px;
      border-top: 1px dashed #cbd5e1;
      font-size: 6.9pt;
      color: #64748b;
    }
    .citation a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      margin-top: 1px;
    }
    .section-title {
      font-weight: 800;
      font-size: 8.6pt;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 2px;
      margin: 7px 0 5px 0;
    }
    .highlight-rule {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-left: 4px solid #16a34a;
      padding: 7px 11px;
      border-radius: 4px;
      font-size: 7.8pt;
      color: #166534;
      line-height: 1.35;
    }
    .code-box {
      background: #0f172a;
      color: #f8fafc;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 7.6pt;
      line-height: 1.48;
    }
    .imposition-diagram {
      background: #f8fafc;
      border: 1.5px solid #0284c7;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 7.7pt;
      color: #0369a1;
      line-height: 1.55;
    }
    .footer-bar {
      border-top: 1.5px solid #0f172a;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7pt;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  ${(() => {
    const pages = guide.pages || [{ content: guide.content, subtitle: guide.subtitle }];
    const totalPages = pages.length;
    return pages
      .map(
        (p, idx) => `
      <div class="page-container" ${idx < totalPages - 1 ? 'style="page-break-after: always; break-after: always;"' : ''}>
        <div>
          <div class="header-bar">
            <div class="header-top">
              <div class="brand-title">THE HISTORY REVISION HUB</div>
              <div class="brand-subtitle">DEPARTMENT PORTAL &bull; STANDARD OPERATING PROCEDURE</div>
            </div>
            <div class="cat-badge">${guide.category}</div>
            <h1>${guide.title}</h1>
            <div class="subtitle">${p.subtitle || guide.subtitle}</div>
          </div>

          ${p.content}
        </div>

        <div class="footer-bar">
          <span>The History Revision Hub &bull; Disciplinary Guidance System &bull; 2026 Edition</span>
          <span>Strict Commercial Neutrality &bull; Page ${idx + 1} of ${totalPages}</span>
        </div>
      </div>
    `,
      )
      .join('');
  })()}
</body>
</html>`;
}

(async () => {
  console.log('🚀 Compiling History Revision Hub Guidance Manuals...');
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : undefined);
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const guide of guides) {
    console.log(`Rendering ${guide.filename}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    const html = generateGuideHtml(guide);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Audit DOM overflow on every .page-container
    const domAudit = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.page-container')).map((el, i) => ({
        page: i + 1,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        overflowPx: Math.max(0, el.scrollHeight - el.clientHeight),
      }));
    });
    for (const pAudit of domAudit) {
      if (pAudit.overflowPx > 1) {
        throw new Error(
          `DOM overflow on ${guide.filename} Page ${pAudit.page}: +${pAudit.overflowPx}px (${pAudit.scrollHeight} > ${pAudit.clientHeight})`,
        );
      }
    }

    // Save HTML version
    const htmlPath = path.join(outputDir, guide.filename.replace('.pdf', '.html'));
    fs.writeFileSync(htmlPath, html, 'utf8');

    // Export PDF
    const pdfPath = path.join(outputDir, guide.filename);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    // Mandatory pdf-parse physical page count gate
    const pdfBuf = fs.readFileSync(pdfPath);
    const parsed = await pdfParse(pdfBuf);
    if (parsed.numpages !== guide.expectedPages) {
      throw new Error(
        `Skia PDF page-count mismatch on ${guide.filename}: expected ${guide.expectedPages}, got ${parsed.numpages}`,
      );
    }

    console.log(
      `✅ Exported & Verified: ${guide.filename} (${parsed.numpages}/${guide.expectedPages} pages, 0px overflow)`,
    );
    await page.close();
  }

  await browser.close();
  console.log('🎉 All 4 Guidance Manuals compiled and verified with 0px overflow!');
})();
