const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

function getBase64Image(filePath) {
  try {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase().replace('.', '');
      const mime = ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
      const b64 = fs.readFileSync(fullPath).toString('base64');
      return `data:${mime};base64,${b64}`;
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
  }
  return '';
}

async function renderMockup() {
  console.log('Rendering Card Cleanup Mock-up...');

  // Images for Medicine Lessons 9 & 10
  const harveyImg = getBase64Image('public/images/william_harvey_npg.jpg');
  const plagueImg = getBase64Image('public/images/great_plague_1665_broadside.jpg');

  // Images for CME Lessons 10 & 11
  const campDavidImg = getBase64Image('public/images/cme_camp_david_1978.jpg');
  const sharonImg = getBase64Image('public/units/cme_new/assets/sharon_beirut_1982.jpg');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lesson Card Visual Comparison & Cleanup Mock-up</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #f1f5f9;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      padding: 40px;
      color: #0f172a;
    }
    .container {
      max-width: 1300px;
      margin: 0 auto;
    }
    .header-banner {
      background: #0f172a;
      color: white;
      padding: 24px 32px;
      border-radius: 12px;
      margin-bottom: 32px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
    }
    .header-banner h1 {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      margin-bottom: 6px;
      font-weight: 700;
    }
    .header-banner p {
      font-size: 0.95rem;
      color: #94a3b8;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #1e293b;
      margin: 32px 0 16px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .section-title span.tag {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tag-current {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .tag-proposed {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 36px;
    }

    /* CARD BASE STYLES */
    .homepage-lesson-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-top: 4px solid #10b981;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .homepage-lesson-card.cme-theme {
      border-top-color: #059669;
    }

    .card-img-wrapper {
      position: relative;
      width: 100%;
      height: 155px;
      overflow: hidden;
      background: #0f172a;
      flex-shrink: 0;
    }
    .card-img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* FLOATING PILL (CURRENT BUG) */
    .floating-lesson-pill {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(15,23,42,0.85);
      backdrop-filter: blur(6px);
      color: #f8fafc;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: 0.04em;
      border: 1px solid rgba(255,255,255,0.2);
      text-transform: uppercase;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .card-body {
      padding: 16px 18px 20px 18px;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
      gap: 8px;
    }
    .eyebrow-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      gap: 6px;
    }
    .shortcode {
      font-size: 0.75rem;
      font-weight: 700;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .card-title {
      margin: 0 0 8px 0;
      color: #0f172a;
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.35;
      font-family: 'Playfair Display', Georgia, serif;
    }
    .card-enquiry {
      margin: 0;
      color: #475569;
      font-weight: 400;
      font-size: 0.88rem;
      line-height: 1.45;
      font-style: italic;
    }

    /* CURRENT VIDEO BADGE (WASHED OUT, NO SEPARATION) */
    .current-video-badge {
      display: inline-flex;
      align-items: center;
      gap: 3.5px;
      font-size: 0.64rem;
      font-weight: 700;
      padding: 1.5px 5.5px;
      border-radius: 4px;
      background: rgba(59, 130, 246, 0.16);
      color: #93c5fd;
      border: 1px solid rgba(59, 130, 246, 0.28);
      line-height: 1.3;
    }
    .current-video-badge .count-raw {
      font-size: 0.58rem;
      background: rgba(255, 255, 255, 0.25);
      padding: 0 3px;
      border-radius: 3px;
      margin-left: 2px;
      font-weight: 800;
    }

    /* PROPOSED VIDEO BADGES (HIGH CONTRAST & INTUITIVE) */
    /* Option 1: Clean Pill with '2 clips' */
    .badge-option-1 {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.70rem;
      font-weight: 700;
      padding: 2.5px 7px;
      border-radius: 6px;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      line-height: 1.25;
    }
    .badge-option-1 i {
      font-size: 0.62rem;
      color: #2563eb;
    }
    .badge-option-1 .clip-pill {
      background: #2563eb;
      color: #ffffff;
      font-size: 0.60rem;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 10px;
      margin-left: 3px;
      letter-spacing: 0.02em;
    }

    /* Option 2: Clean Pill with Counter Circle */
    .badge-option-2 {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.70rem;
      font-weight: 700;
      padding: 2.5px 7px;
      border-radius: 6px;
      background: #f8fafc;
      color: #0f172a;
      border: 1px solid #cbd5e1;
      line-height: 1.25;
    }
    .badge-option-2 i {
      font-size: 0.62rem;
      color: #2563eb;
    }
    .badge-option-2 .count-bubble {
      background: #e2e8f0;
      color: #1e293b;
      font-size: 0.62rem;
      font-weight: 800;
      min-width: 15px;
      height: 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-left: 2px;
    }

    .diff-callout {
      background: #ffffff;
      border-left: 4px solid #3b82f6;
      padding: 14px 18px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #334155;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .diff-callout strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-banner">
      <h1>GCSE Lesson Cards: Visual Polish & De-Duplication Mock-Up</h1>
      <p>Direct comparison of current live card rendering vs refined artwork & video badge options.</p>
    </div>

    <!-- COMPARISON ROW 1: MEDICINE (HARVEY & PLAGUE) -->
    <div class="section-title">
      <span>1. Current Live Design (As in Screenshot)</span>
      <span class="tag tag-current">Problems: Duplicate Image Pill + Washed-Out Badge ("▶ 3m 6s 2")</span>
    </div>

    <div class="diff-callout">
      ❌ <strong>Duplicate Label:</strong> The dark <code>LESSON 9</code> pill is pasted directly over William Harvey's face and the Great Plague woodcut, then repeated directly below as <code>KT2.4 • LESSON 9</code>.<br>
      ❌ <strong>Video Badge Ambiguity:</strong> Low contrast (pale blue <code>#93c5fd</code> on white), and the number <code>2</code> runs directly after the seconds (<code>▶ 3m 6s 2</code>), reading like "3m 62s".
    </div>

    <div class="cards-grid">
      <!-- CURRENT HARVEY -->
      <div class="homepage-lesson-card">
        <div class="card-img-wrapper">
          <img src="${harveyImg}" alt="William Harvey" style="object-position: center 15%;">
          <div class="floating-lesson-pill">LESSON 9</div>
        </div>
        <div class="card-body">
          <div>
            <div class="eyebrow-row">
              <span class="shortcode">KT2.4 • LESSON 9</span>
              <span class="current-video-badge"><i class="fa-solid fa-play"></i><span>3m 6s</span><span class="count-raw">2</span></span>
            </div>
            <h3 class="card-title">William Harvey & The Circulation of the Blood (1628)</h3>
            <p class="card-enquiry">Why did William Harvey's discovery of blood circulation meet fierce medical resistance?</p>
          </div>
        </div>
      </div>

      <!-- CURRENT PLAGUE -->
      <div class="homepage-lesson-card">
        <div class="card-img-wrapper">
          <img src="${plagueImg}" alt="Great Plague" style="object-position: center;">
          <div class="floating-lesson-pill">LESSON 10</div>
        </div>
        <div class="card-body">
          <div>
            <div class="eyebrow-row">
              <span class="shortcode">KT2.5 • LESSON 10</span>
              <span class="current-video-badge"><i class="fa-solid fa-play"></i><span>2m 15s</span><span class="count-raw">2</span></span>
            </div>
            <h3 class="card-title">Continuity in Treatment & The Great Plague of London (1665)</h3>
            <p class="card-enquiry">Why did the Great Plague of 1665 reveal the severe limitations of Renaissance medical progress?</p>
          </div>
        </div>
      </div>
    </div>

    <!-- COMPARISON ROW 2: PROPOSED REFINEMENT -->
    <div class="section-title">
      <span>2. Refined Design: Option A (Recommended — Clean Artwork + "2 clips" Pill)</span>
      <span class="tag tag-proposed">100% Unobstructed Artwork + High-Contrast Badge ("▶ 3m 6s [2 clips]")</span>
    </div>

    <div class="diff-callout">
      ✅ <strong>100% Clean Artwork:</strong> Dark pill removed from the image. William Harvey's portrait and historical woodcut are completely unobstructed.<br>
      ✅ <strong>Zero Redundancy:</strong> Lesson number appears cleanly once in the specification eyebrow (<code>KT2.4 • LESSON 9</code>).<br>
      ✅ <strong>Publisher-Grade Video Badge:</strong> Crisp high-contrast pill (<code>#eff6ff</code> + <code>#1d4ed8</code>) with a distinct blue <code>2 clips</code> pill. Students and teachers instantly recognize there are 2 videos, with the shortest being 3m 6s!
    </div>

    <div class="cards-grid">
      <!-- REFINED OPTION A HARVEY -->
      <div class="homepage-lesson-card">
        <div class="card-img-wrapper">
          <img src="${harveyImg}" alt="William Harvey" style="object-position: center 15%;">
        </div>
        <div class="card-body">
          <div>
            <div class="eyebrow-row">
              <span class="shortcode">KT2.4 • LESSON 9</span>
              <span class="badge-option-1"><i class="fa-solid fa-play"></i><span>3m 6s</span><span class="clip-pill">2 clips</span></span>
            </div>
            <h3 class="card-title">William Harvey & The Circulation of the Blood (1628)</h3>
            <p class="card-enquiry">Why did William Harvey's discovery of blood circulation meet fierce medical resistance?</p>
          </div>
        </div>
      </div>

      <!-- REFINED OPTION A PLAGUE -->
      <div class="homepage-lesson-card">
        <div class="card-img-wrapper">
          <img src="${plagueImg}" alt="Great Plague" style="object-position: center;">
        </div>
        <div class="card-body">
          <div>
            <div class="eyebrow-row">
              <span class="shortcode">KT2.5 • LESSON 10</span>
              <span class="badge-option-1"><i class="fa-solid fa-play"></i><span>2m 15s</span><span class="clip-pill">2 clips</span></span>
            </div>
            <h3 class="card-title">Continuity in Treatment & The Great Plague of London (1665)</h3>
            <p class="card-enquiry">Why did the Great Plague of 1665 reveal the severe limitations of Renaissance medical progress?</p>
          </div>
        </div>
      </div>
    </div>

    <!-- COMPARISON ROW 3: CME EXAMPLES (CAMP DAVID & SHARON) -->
    <div class="section-title">
      <span>3. Conflict in the Middle East Verification (Lessons 10 & 11)</span>
      <span class="tag tag-proposed">Clean Historical Photographic Plates</span>
    </div>

    <div class="cards-grid">
      <!-- CME LESSON 10 -->
      <div class="homepage-lesson-card cme-theme">
        <div class="card-img-wrapper">
          <img src="${campDavidImg}" alt="Camp David 1978" style="object-position: center 25%;">
        </div>
        <div class="card-body">
          <div>
            <div class="eyebrow-row">
              <span class="shortcode">KT 3.1 • LESSON 10</span>
              <span class="badge-option-1"><i class="fa-solid fa-play"></i><span>1m 2s</span><span class="clip-pill">5 clips</span></span>
            </div>
            <h3 class="card-title">Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979</h3>
            <p class="card-enquiry">How did historic enemies Egypt and Israel finally achieve a lasting peace treaty?</p>
          </div>
        </div>
      </div>

      <!-- CME LESSON 11 -->
      <div class="homepage-lesson-card cme-theme">
        <div class="card-img-wrapper">
          <img src="${sharonImg}" alt="Ariel Sharon 1982" style="object-position: center 20%;">
        </div>
        <div class="card-body">
          <div>
            <div class="eyebrow-row">
              <span class="shortcode">KT 3.2 • LESSON 11</span>
              <span class="badge-option-1"><i class="fa-solid fa-play"></i><span>2m 4s</span><span class="clip-pill">6 clips</span></span>
            </div>
            <h3 class="card-title">The Palestinian Issue: Lebanon, Sabra & Shatila, and the First Intifada, 1974–1993</h3>
            <p class="card-enquiry">How did the First Intifada fundamentally alter the nature of the Palestinian struggle?</p>
          </div>
        </div>
      </div>
    </div>

    <!-- OPTION B PREVIEW -->
    <div class="section-title">
      <span>Alternative Badge Style: Option B (Counter Circle)</span>
    </div>
    <div class="cards-grid">
      <!-- OPTION B HARVEY -->
      <div class="homepage-lesson-card">
        <div class="card-img-wrapper">
          <img src="${harveyImg}" alt="William Harvey" style="object-position: center 15%;">
        </div>
        <div class="card-body">
          <div>
            <div class="eyebrow-row">
              <span class="shortcode">KT2.4 • LESSON 9</span>
              <span class="badge-option-2"><i class="fa-solid fa-play"></i><span>3m 6s</span><span class="count-bubble">2</span></span>
            </div>
            <h3 class="card-title">William Harvey & The Circulation of the Blood (1628)</h3>
            <p class="card-enquiry">Why did William Harvey's discovery of blood circulation meet fierce medical resistance?</p>
          </div>
        </div>
      </div>

      <!-- OPTION B CAMP DAVID -->
      <div class="homepage-lesson-card cme-theme">
        <div class="card-img-wrapper">
          <img src="${campDavidImg}" alt="Camp David 1978" style="object-position: center 25%;">
        </div>
        <div class="card-body">
          <div>
            <div class="eyebrow-row">
              <span class="shortcode">KT 3.1 • LESSON 10</span>
              <span class="badge-option-2"><i class="fa-solid fa-play"></i><span>1m 2s</span><span class="count-bubble">5</span></span>
            </div>
            <h3 class="card-title">Diplomatic Negotiations: From Shuttle Diplomacy to Camp David, 1974–1979</h3>
            <p class="card-enquiry">How did historic enemies Egypt and Israel finally achieve a lasting peace treaty?</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</body>
</html>`;

  const mockupHtmlPath = path.join(__dirname, '..', 'public', 'lesson_card_cleanup_mockup.html');
  fs.writeFileSync(mockupHtmlPath, html, 'utf8');
  console.log(`Saved HTML mock-up to ${mockupHtmlPath}`);

  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : undefined;

  // Launch Puppeteer to capture high-res screenshots
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files', '--disable-web-security', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1350, height: 2200, deviceScaleFactor: 2 });
  await page.goto('file://' + mockupHtmlPath, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200)); // ensure web fonts render

  const artifactDir = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85';
  const outPath = path.join(artifactDir, 'lesson_card_cleanup_comparison.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved comparison screenshot to ${outPath}`);

  await browser.close();
}

renderMockup().catch(err => {
  console.error(err);
  process.exit(1);
});
