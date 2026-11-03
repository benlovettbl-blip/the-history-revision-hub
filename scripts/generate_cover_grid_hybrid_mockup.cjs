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

async function renderGridMockup() {
  console.log('Rendering Hybrid Cover Grid Mock-up...');

  const gillrayImg = getBase64Image('public/images/william_harvey_npg.jpg'); // or cow pock if available
  const cowPockImg = getBase64Image('public/images/the_cow_pock_gillray_1802.jpg') || gillrayImg;
  const cmeCoverImg = getBase64Image('public/units/cme_new/assets/kt3_cover.png') || getBase64Image('public/images/cme_oslo_handshake_1993.jpg');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hybrid Front Cover Specification & Tracking Grid Mock-up</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #e2e8f0;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      padding: 30px;
      color: #0f172a;
    }
    .wrapper {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header-info {
      background: #0f172a;
      color: white;
      padding: 20px 28px;
      border-radius: 10px;
      margin-bottom: 25px;
    }
    .header-info h1 {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      margin-bottom: 6px;
    }
    .header-info p {
      font-size: 0.9rem;
      color: #94a3b8;
    }

    .grid-duo {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    /* A4 SIMULATION PAGE */
    .a4-cover-page {
      background: #ffffff;
      width: 100%;
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
      border-radius: 4px;
      padding: 6mm 7mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* MEDICINE NAVY THEME */
    .theme-med {
      --primary: #0f284e;
      --accent: #1e3a8a;
      --border: #0f284e;
      --badge-bg: #0f284e;
    }

    /* CME EMERALD/TEAL THEME */
    .theme-cme {
      --primary: #064e3b;
      --accent: #047857;
      --border: #064e3b;
      --badge-bg: #064e3b;
    }

    .top-brand {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--border);
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .brand-title {
      font-family: 'Inter', sans-serif;
      font-size: 10pt;
      font-weight: 900;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .brand-paper {
      font-family: 'Inter', sans-serif;
      font-size: 8pt;
      font-weight: 800;
      color: var(--primary);
    }

    .title-banner {
      text-align: center;
      margin-bottom: 6px;
    }
    .kt-pill {
      display: inline-block;
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border: 1.5px solid var(--border);
      background: var(--badge-bg);
      color: #ffffff;
      padding: 1.5px 10px;
      border-radius: 3px;
      margin-bottom: 3px;
    }
    .unit-h1 {
      font-family: 'Playfair Display', serif;
      font-size: 17pt;
      font-weight: 900;
      color: var(--primary);
      margin: 2px 0 2px 0;
      line-height: 1.15;
      letter-spacing: -0.3px;
    }
    .unit-sub {
      font-family: 'Georgia', serif;
      font-size: 8.5pt;
      color: #334155;
      margin: 0;
      font-style: italic;
      font-weight: 600;
    }

    .hero-plate {
      margin: 2px 0 5px 0;
      border: 1.5px solid var(--border);
      border-radius: 4px;
      overflow: hidden;
      background: #ffffff;
    }
    .hero-img-box {
      background: #f8fafc;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2px;
    }
    .hero-img-box img {
      width: 100%;
      height: 72mm;
      object-fit: cover;
      display: block;
    }
    .hero-caption {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Inter', sans-serif;
      font-size: 6.8pt;
      color: var(--primary);
      padding: 2.5px 7px;
      border-top: 1.2px solid var(--border);
      background: #ffffff;
    }

    .pupil-strip {
      border: 1.5px solid var(--border);
      border-radius: 4px;
      padding: 3px 8px;
      background: #ffffff;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 12px;
      align-items: center;
      margin-bottom: 5px;
    }
    .pupil-field {
      display: flex;
      align-items: baseline;
    }
    .pupil-field strong {
      font-family: 'Inter', sans-serif;
      font-size: 7.5pt;
      color: var(--primary);
      text-transform: uppercase;
      margin-right: 6px;
    }
    .pupil-field .line {
      flex: 1;
      border-bottom: 1.2px solid var(--border);
      height: 10px;
    }

    /* TABLE STYLES */
    .spec-table-box {
      border: 1.5px solid var(--border);
      border-radius: 4px;
      overflow: hidden;
    }
    table.spec-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Inter', sans-serif;
    }
    table.spec-table thead tr {
      background: var(--primary);
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table.spec-table th {
      padding: 4px 8px;
      font-size: 7.2pt;
      font-weight: 800;
    }
    table.spec-table th.col-spec {
      text-align: left;
      width: 78%;
    }
    table.spec-table th.col-check {
      text-align: center;
      width: 11%;
      border-left: 1px solid rgba(255,255,255,0.25);
    }

    table.spec-table tbody tr {
      border-bottom: 1px solid #cbd5e1;
    }
    table.spec-table tbody tr:last-child {
      border-bottom: none;
    }
    table.spec-table td {
      vertical-align: middle;
    }
    td.cell-content {
      padding: 5.5px 8px;
      border-right: 1.2px solid #cbd5e1;
    }
    td.cell-check {
      text-align: center;
      vertical-align: middle;
      border-right: 1.2px solid #cbd5e1;
      padding: 4px;
    }
    td.cell-check:last-child {
      border-right: none;
    }

    .check-box-sq {
      width: 14px;
      height: 14px;
      border: 1.5px solid var(--border);
      border-radius: 2px;
      margin: 0 auto;
      background: #ffffff;
    }

    /* 3-TIER ROW ARCHITECTURE */
    .row-title {
      font-size: 8.4pt;
      font-weight: 800;
      color: var(--primary);
      line-height: 1.2;
    }
    .row-enquiry {
      font-family: 'Georgia', serif;
      font-size: 7.6pt;
      font-style: italic;
      color: #334155;
      margin-top: 1.5px;
      line-height: 1.2;
    }
    .row-spec-bullets {
      font-size: 6.9pt;
      color: #475569;
      margin-top: 2.5px;
      line-height: 1.25;
      background: #f8fafc;
      padding: 2.5px 5px;
      border-radius: 3px;
      border-left: 2.5px solid var(--accent);
    }
    .row-spec-bullets strong {
      color: #0f172a;
      font-weight: 700;
    }
    .spec-dot {
      color: var(--accent);
      font-weight: 900;
      margin: 0 3px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header-info">
      <h1>Unified 3-Tier Specification & Tracking Grid Proposal</h1>
      <p>Combining the beloved Medicine Tracking Table with Verbatim Edexcel Specification Knowledge across all GCSE Pupil Workbooks.</p>
    </div>

    <div class="grid-duo">

      <!-- LEFT: MEDICINE KT3 (18th & 19th Century) -->
      <div class="a4-cover-page theme-med">
        <div>
          <!-- BRAND -->
          <div class="top-brand">
            <span class="brand-title">The History Department</span>
            <span class="brand-paper">EDEXCEL GCSE (9–1) HISTORY &bull; PAPER 1</span>
          </div>

          <!-- TITLE BANNER -->
          <div class="title-banner">
            <span class="kt-pill">KEY TOPIC 3 &bull; PUPIL WORKBOOK</span>
            <h1 class="unit-h1">Medicine in 18th &amp; 19th Century Britain</h1>
            <p class="unit-sub">c1700–c1900: Ideas on Causes, Prevention, Hospital Care, Surgery &amp; Public Health</p>
          </div>

          <!-- HERO PLATE -->
          <div class="hero-plate">
            <div class="hero-img-box">
              <img src="${cowPockImg}" alt="The Cow-Pock (1802)" style="object-position: center 30%;">
            </div>
            <div class="hero-caption">
              <span><strong>Primary Visual Evidence:</strong> James Gillray, <em>The Cow-Pock</em> (1802 satire of Edward Jenner)</span>
              <span style="font-weight: 700; color: #475569;">HISTORICAL SATIRE ARCHIVE</span>
            </div>
          </div>

          <!-- PUPIL IDENTIFICATION -->
          <div class="pupil-strip">
            <div class="pupil-field"><strong>Pupil Name:</strong><div class="line"></div></div>
            <div class="pupil-field"><strong>Target:</strong><div class="line"></div></div>
            <div class="pupil-field"><strong>Class:</strong><div class="line"></div></div>
          </div>

          <!-- 3-TIER SPECIFICATION & TRACKING TABLE -->
          <div class="spec-table-box">
            <table class="spec-table">
              <thead>
                <tr>
                  <th class="col-spec">Key Topic 3 Specification Framework (Edexcel 1HI0/11)</th>
                  <th class="col-check">Lesson Done</th>
                  <th class="col-check">Quiz [10]</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.1: Ideas on Causes: Pasteur’s Germ Theory &amp; Koch’s Bacteriology</div>
                    <div class="row-enquiry">How did swan-neck flasks (1861) and agar cultures (1876–83) demolish spontaneous generation?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> Spontaneous generation vs Germ Theory (1861)<span class="spec-dot">&bull;</span>Koch’s microbe staining &amp; agar cultures<span class="spec-dot">&bull;</span>Tyndall &amp; British reception
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>

                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.2: Approaches to Prevention: Edward Jenner &amp; The Smallpox Vaccine</div>
                    <div class="row-enquiry">How did the 1796 cowpox experiment defeat variolation, and why did opposition persist until 1852?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> Inoculation / variolation risks<span class="spec-dot">&bull;</span>1796 cowpox experiment on James Phipps<span class="spec-dot">&bull;</span>Anti-vaccine opposition &amp; 1852 compulsory act
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>

                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.3: Improvements in Hospital Care: Florence Nightingale &amp; Nursing</div>
                    <div class="row-enquiry">How did Scutari (1854–56), Notes on Nursing (1859), and the pavilion plan transform Victorian mortality?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> Pre-1850 voluntary hospitals<span class="spec-dot">&bull;</span>Nightingale at Scutari (Crimean War)<span class="spec-dot">&bull;</span>Pavilion hospital plan<span class="spec-dot">&bull;</span>Professional nursing school
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>

                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.4: The Surgical Revolution: Simpson’s Chloroform &amp; Lister’s Antiseptics</div>
                    <div class="row-enquiry">How did Simpson conquer pain, Lister conquer infection, and the 1890s introduce aseptic surgery?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> Ether &amp; James Simpson’s chloroform (1847)<span class="spec-dot">&bull;</span>Black Period of Surgery<span class="spec-dot">&bull;</span>Joseph Lister’s carbolic acid spray (1865)<span class="spec-dot">&bull;</span>Aseptic theatre
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>

                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.5: Public Health &amp; Cholera: John Snow &amp; The 1875 Public Health Act</div>
                    <div class="row-enquiry">How did John Snow’s Broad Street pump map (1854) and the 1875 Act permanently dismantle laissez-faire?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> Miasma vs waterborne cholera<span class="spec-dot">&bull;</span>John Snow’s 1854 Broad Street pump spot map<span class="spec-dot">&bull;</span>1848 vs mandatory 1875 Public Health Act
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- RIGHT: CME KT3 (Conflict in the Middle East) -->
      <div class="a4-cover-page theme-cme">
        <div>
          <!-- BRAND -->
          <div class="top-brand">
            <span class="brand-title">The History Department</span>
            <span class="brand-paper">EDEXCEL GCSE (9–1) HISTORY &bull; PAPER 2</span>
          </div>

          <!-- TITLE BANNER -->
          <div class="title-banner">
            <span class="kt-pill">KEY TOPIC 3 &bull; PUPIL WORKBOOK</span>
            <h1 class="unit-h1">Conflict in the Middle East, 1945–1995</h1>
            <p class="unit-sub">Key Topic 3: Attempts at a Solution: Diplomacy, Lebanon &amp; The Peace Process, 1974–1995</p>
          </div>

          <!-- HERO PLATE -->
          <div class="hero-plate">
            <div class="hero-img-box">
              <img src="${cmeCoverImg}" alt="Oslo Accords Handshake 1993" style="object-position: center 25%;">
            </div>
            <div class="hero-caption">
              <span><strong>Primary Visual Evidence:</strong> Yitzhak Rabin, Bill Clinton, and Yasser Arafat at the White House (1993)</span>
              <span style="font-weight: 700; color: #475569;">NATIONAL ARCHIVES ARCHIVE</span>
            </div>
          </div>

          <!-- PUPIL IDENTIFICATION -->
          <div class="pupil-strip">
            <div class="pupil-field"><strong>Pupil Name:</strong><div class="line"></div></div>
            <div class="pupil-field"><strong>Target:</strong><div class="line"></div></div>
            <div class="pupil-field"><strong>Class:</strong><div class="line"></div></div>
          </div>

          <!-- 3-TIER SPECIFICATION & TRACKING TABLE -->
          <div class="spec-table-box">
            <table class="spec-table">
              <thead>
                <tr>
                  <th class="col-spec">Key Topic 3 Specification Framework (Edexcel 1HI0/P5)</th>
                  <th class="col-check">Lesson Done</th>
                  <th class="col-check">Quiz [10]</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.1: Diplomatic Negotiations: Shuttle Diplomacy to Camp David (1974–79)</div>
                    <div class="row-enquiry">How did historic enemies Egypt and Israel finally achieve a lasting peace treaty?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> 1973 oil crisis fallout<span class="spec-dot">&bull;</span>Kissinger &amp; shuttle diplomacy<span class="spec-dot">&bull;</span>Sadat’s Knesset speech (1977)<span class="spec-dot">&bull;</span>Camp David (1978) &amp; Treaty of Washington (1979)
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>

                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.2: The Palestinian Issue: Lebanon, Sabra &amp; Shatila, &amp; First Intifada (1974–93)</div>
                    <div class="row-enquiry">How did the First Intifada fundamentally alter the nature of the Palestinian struggle?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> Arafat’s UN 'gun and olive branch' speech (1974)<span class="spec-dot">&bull;</span>1982 invasion of Lebanon &amp; Sabra/Shatila<span class="spec-dot">&bull;</span>First Intifada grass-roots resistance (1987–93)
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>

                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.3: Attempts at a Solution: From Oslo Accords to Oslo II (1988–95)</div>
                    <div class="row-enquiry">Why did the breakthrough of the Oslo Accords collapse into renewed violence and assassination?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> Arafat renounces terrorism (1988)<span class="spec-dot">&bull;</span>Gulf War &amp; Soviet collapse<span class="spec-dot">&bull;</span>Oslo Accords &amp; Palestinian National Authority (1993)<span class="spec-dot">&bull;</span>Oslo II &amp; Rabin assassination (1995)
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>

                <tr>
                  <td class="cell-content">
                    <div class="row-title">KT 3.4: Synoptic Assessment: Peace, Conflict &amp; Unresolved Questions (1945–95)</div>
                    <div class="row-enquiry">To what extent was the search for Middle Eastern peace hindered more by internal divisions than superpower rivalry?</div>
                    <div class="row-spec-bullets">
                      <strong>Spec:</strong> Comprehensive unit synthesis across KT1–KT3<span class="spec-dot">&bull;</span>Edexcel Paper 2 exam question structure &amp; WAGOLL criteria<span class="spec-dot">&bull;</span>Final historical verdict
                    </div>
                  </td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                  <td class="cell-check"><div class="check-box-sq"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</body>
</html>`;

  const mockupHtmlPath = path.join(__dirname, '..', 'public', 'cover_grid_hybrid_mockup.html');
  fs.writeFileSync(mockupHtmlPath, html, 'utf8');
  console.log(`Saved HTML mock-up to ${mockupHtmlPath}`);

  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : undefined;

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files', '--disable-web-security', '--disable-gpu']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1450, height: 1100, deviceScaleFactor: 2 });
  await page.goto('file://' + mockupHtmlPath, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  const artifactDir = 'C:/Users/fives/.gemini/antigravity/brain/cef12fb1-37a9-4b4b-872e-64052879ba85';
  const outPath = path.join(artifactDir, 'hybrid_cover_grid_comparison.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved hybrid grid comparison screenshot to ${outPath}`);

  await browser.close();
}

renderGridMockup().catch(err => {
  console.error(err);
  process.exit(1);
});

