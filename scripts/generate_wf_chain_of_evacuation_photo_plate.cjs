const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public', 'images');

function toDataUri(filename) {
  const full = path.join(IMG_DIR, filename);
  const buf = fs.readFileSync(full);
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

(async () => {
  const p1 = toDataUri('stretcher_bearers_passchendaele_1917.jpg');
  const p2 = toDataUri('med_stage_ww1_operating_theatre.jpg');
  const p3 = toDataUri('source_b_ambulance_somme_1916.jpg');
  const p4 = toDataUri('casualty_clearing_station_ww1.jpg');
  const p5 = toDataUri('ramc_canal_barge.jpg');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1600px;
    height: 1000px;
    background: #0b1220;
    color: #f8fafc;
    font-family: 'Inter', sans-serif;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow: hidden;
  }
  .hdr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #334155;
    padding-bottom: 10px;
  }
  .kicker {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #fbbf24;
    margin-bottom: 3px;
  }
  .title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 25px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.15;
  }
  .hdr-badge {
    background: rgba(14, 165, 233, 0.16);
    border: 1px solid #38bdf8;
    color: #7dd3fc;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    padding: 6px 14px;
    border-radius: 6px;
  }

  .grid-top {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    height: 432px;
  }
  .grid-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    height: 432px;
  }

  .card {
    background: #131d31;
    border: 1.5px solid #334155;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 20px rgba(0,0,0,0.45);
  }
  .card-top {
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #334155;
    background: #0f172a;
  }
  .stage-pill {
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 3px 9px;
    border-radius: 4px;
    color: #ffffff;
  }
  .dist-tag {
    font-size: 11px;
    font-weight: 700;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .photo-wrap {
    position: relative;
    flex: 1;
    min-height: 0;
    background: #000000;
    overflow: hidden;
  }
  .photo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: contrast(1.05);
  }
  .archive-chip {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(15, 23, 42, 0.84);
    border: 1px solid rgba(148, 163, 184, 0.45);
    color: #e2e8f0;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    letter-spacing: 0.3px;
  }
  .card-foot {
    padding: 9px 13px;
    background: #162238;
    border-top: 1px solid #334155;
  }
  .card-title {
    font-size: 14.5px;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 3px;
  }
  .card-desc {
    font-size: 12px;
    line-height: 1.35;
    color: #cbd5e1;
  }
  .card-desc strong {
    color: #f8fafc;
  }
</style>
</head>
<body>
  <div class="hdr">
    <div>
      <div class="kicker">Royal Army Medical Corps (RAMC) &amp; FANY Logistics &bull; Western Front Archival Photographic Sequence</div>
      <div class="title">The Five-Stage Chain of Evacuation (No Man’s Land to Coastal Base, 1914–1918)</div>
    </div>
    <div class="hdr-badge">5 Wartime Archival Photographs (IWM)</div>
  </div>

  <div class="grid-top">
    <!-- STAGE 1 -->
    <div class="card" style="border-top: 3px solid #dc2626;">
      <div class="card-top">
        <span class="stage-pill" style="background:#dc2626;">Stage 1 &bull; Recovery</span>
        <span class="dist-tag">0m &bull; No Man’s Land / Front</span>
      </div>
      <div class="photo-wrap">
        <img src="${p1}" style="object-position: center 35%;" />
        <span class="archive-chip">IWM Q 5935 &bull; Passchendaele, Aug 1917</span>
      </div>
      <div class="card-foot">
        <div class="card-title">1. Regimental Stretcher Bearers</div>
        <div class="card-desc"><strong>16 bearers per battalion</strong> (6–8 per stretcher in deep mud). Recovered men under fire; applied shell dressings &amp; tourniquets.</div>
      </div>
    </div>

    <!-- STAGE 2 -->
    <div class="card" style="border-top: 3px solid #d97706;">
      <div class="card-top">
        <span class="stage-pill" style="background:#d97706;">Stage 2 &bull; First Aid</span>
        <span class="dist-tag">~200m Back &bull; Dugout / Cellar</span>
      </div>
      <div class="photo-wrap">
        <img src="${p2}" style="object-position: center 32%;" />
        <span class="archive-chip">IWM Archive &bull; Forward Cellar Aid Post</span>
      </div>
      <div class="card-foot">
        <div class="card-title">2. Regimental Aid Post (RAP)</div>
        <div class="card-desc">Staffed by <strong>1 Regimental Medical Officer (RMO)</strong> + orderlies. Gave morphine &amp; bandages; no beds or major surgery.</div>
      </div>
    </div>

    <!-- STAGE 3 -->
    <div class="card" style="border-top: 3px solid #0284c7;">
      <div class="card-top">
        <span class="stage-pill" style="background:#0284c7;">Stage 3 &bull; Relay &amp; Triage</span>
        <span class="dist-tag">1–2 Miles Back &bull; ADS &amp; MDS</span>
      </div>
      <div class="photo-wrap">
        <img src="${p3}" style="object-position: center 55%;" />
        <span class="archive-chip">IWM Archive &bull; Somme Motor Ambulance, 1916</span>
      </div>
      <div class="card-foot">
        <div class="card-title">3. Field Ambulance (ADS &amp; MDS)</div>
        <div class="card-desc">Mobile RAMC unit: <strong>anti-tetanus injections</strong>, <strong>Thomas Splints</strong>, shock care &amp; FANY/RAMC motor or horse ambulances.</div>
      </div>
    </div>
  </div>

  <div class="grid-bottom">
    <!-- STAGE 4 -->
    <div class="card" style="border-top: 3px solid #0f766e;">
      <div class="card-top">
        <span class="stage-pill" style="background:#0f766e;">Stage 4 &bull; Urgent Surgery Hub</span>
        <span class="dist-tag">7–10 Miles Back &bull; Beside Railway</span>
      </div>
      <div class="photo-wrap">
        <img src="${p4}" style="object-position: center 52%;" />
        <span class="archive-chip">IWM Archive &bull; CCS Surgical Operating Hut</span>
      </div>
      <div class="card-foot">
        <div class="card-title">4. Casualty Clearing Station (CCS)</div>
        <div class="card-desc"><strong>~1,000 capacity; first QAIMNS/VAD female nurses.</strong> 3-category triage, mobile X-rays, blood transfusions &amp; life-saving gas-gangrene surgery within the golden hours.</div>
      </div>
    </div>

    <!-- STAGE 5 -->
    <div class="card" style="border-top: 3px solid #1d4ed8;">
      <div class="card-top">
        <span class="stage-pill" style="background:#1d4ed8;">Stage 5 &bull; Specialist Recovery</span>
        <span class="dist-tag">French Coast (Boulogne / Étaples) &rarr; UK</span>
      </div>
      <div class="photo-wrap">
        <img src="${p5}" style="object-position: center 52%;" />
        <span class="archive-chip">IWM Archive &bull; Hospital Canal Barge Ward, c.1917</span>
      </div>
      <div class="card-foot">
        <div class="card-title">5. Base Hospitals, Ambulance Trains &amp; Canal Barges</div>
        <div class="card-desc">Reached by <strong>Red Cross Ambulance Trains &amp; smooth canal barges</strong>. 2,500+ bed specialist wards, Carrel-Dakin chemical wound irrigation &amp; ‘Blighty’ hospital ships.</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');

  const pngBuf = await page.screenshot({ type: 'png' });
  await browser.close();

  const outPath = path.join(IMG_DIR, 'med_plate_chain_of_evacuation_photos.jpg');
  await sharp(pngBuf)
    .resize(1920, 1200)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outPath);

  console.log('Generated authentic photographic plate:', outPath, fs.statSync(outPath).size, 'bytes');
})();
