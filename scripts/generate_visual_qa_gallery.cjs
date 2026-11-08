const fs = require('fs');
const path = require('path');

const units = [
  { id: 'second_british_empire', name: 'Second British Empire (KS3)' },
  { id: 'first_british_empire', name: 'First British Empire (KS3)' },
  { id: 'great_war_part2', name: 'The Great War Part 2 (KS3)' },
  { id: 'industrialisation_and_empire', name: 'Industrialisation & Empire (KS3)' }
];

let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Curriculum Visual Plate Forensic Audit Gallery</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    h1 { color: #38bdf8; font-size: 2rem; margin-bottom: 8px; }
    .unit-section { margin-bottom: 48px; border-top: 2px solid #334155; padding-top: 24px; }
    .unit-title { font-size: 1.5rem; color: #fbbf24; margin-bottom: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; }
    .card { background: #1e293b; border-radius: 8px; border: 1px solid #334155; overflow: hidden; display: flex; flex-direction: column; }
    .card-header { padding: 12px 16px; background: #0f172a; border-bottom: 1px solid #334155; }
    .card-badge { display: inline-block; background: #0284c7; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-bottom: 6px; }
    .card-title { font-size: 0.95rem; font-weight: 600; color: #e2e8f0; line-height: 1.3; }
    .img-box { height: 260px; background: #020617; display: flex; align-items: center; justify-content: center; padding: 8px; }
    .img-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .card-body { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; font-size: 0.82rem; }
    .caption { color: #cbd5e1; font-style: italic; line-height: 1.45; margin-bottom: 10px; }
    .meta { font-family: monospace; font-size: 0.75rem; color: #94a3b8; border-top: 1px dashed #334155; padding-top: 8px; }
    .file-path { color: #38bdf8; word-break: break-all; }
    .file-size { color: #a3e635; }
    .missing { border-color: #ef4444; background: #450a0a; }
  </style>
</head>
<body>
  <h1>Forensic Visual Plate Audit Gallery</h1>
  <p style="color: #94a3b8; font-size: 0.95rem;">Visual verification of all primary sources, archival plates, maps, and engravings across enriched units.</p>
`;

for (const u of units) {
  const p = path.join(__dirname, '..', 'data', u.id + '.json');
  if (!fs.existsSync(p)) continue;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));

  html += `<div class="unit-section" id="unit-${u.id}">`;
  html += `<div class="unit-title">${u.name} (<code>${u.id}</code>)</div>`;
  html += `<div class="grid">`;

  (d.lessons || []).forEach((l, lIdx) => {
    (l.narrative_blocks || []).forEach((b, bIdx) => {
      const imgPath = b.image;
      if (!imgPath) return;
      const clean = imgPath.replace(/^\//, '');
      const diskPath = path.join(__dirname, '..', 'public', clean);
      const exists = fs.existsSync(diskPath);
      let sizeStr = 'MISSING';
      if (exists) {
        const s = fs.statSync(diskPath).size;
        sizeStr = (s / 1024).toFixed(1) + ' KB';
      }
      const title = b.theme_heading || b.title || 'Stage ' + (bIdx + 1);
      const caption = b.caption || b.image_caption || 'No caption provided';

      html += `
        <div class="card ${exists ? '' : 'missing'}">
          <div class="card-header">
            <span class="card-badge">L${lIdx + 1} S${bIdx + 1}</span>
            <div class="card-title">${title}</div>
          </div>
          <div class="img-box">
            <img src="/${clean}" alt="${title}">
          </div>
          <div class="card-body">
            <div class="caption">${caption}</div>
            <div class="meta">
              <div class="file-path">/${clean}</div>
              <div class="file-size">${sizeStr}</div>
            </div>
          </div>
        </div>
      `;
    });
  });

  html += `</div></div>`;
}

html += `</body></html>`;
fs.writeFileSync(path.join(__dirname, '..', 'public', 'visual_qa_gallery.html'), html, 'utf8');
console.log('Saved public/visual_qa_gallery.html successfully');
