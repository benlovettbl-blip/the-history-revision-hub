const puppeteer = require('puppeteer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const mats = [
  {
    htmlFile: 'weimar_kt2_1_early_party.html',
    webpFile: 'weimar_kt2_1_early_party.webp',
    name: 'KT 2.1: Early Party Development'
  },
  {
    htmlFile: 'weimar_kt2_2_munich_putsch.html',
    webpFile: 'weimar_kt2_2_munich_putsch.webp',
    name: 'KT 2.2: Munich Putsch & Lean Years'
  },
  {
    htmlFile: 'weimar_kt2_3_nazi_support.html',
    webpFile: 'weimar_kt2_3_nazi_support.webp',
    name: 'KT 2.3: Nazi Support & Depression'
  },
  {
    htmlFile: 'weimar_kt2_4_hitler_chancellor.html',
    webpFile: 'weimar_kt2_4_hitler_chancellor.webp',
    name: 'KT 2.4: How Hitler Became Chancellor'
  }
];

async function renderAllMats() {
  const outDir = path.resolve(__dirname, '..', 'public', 'images', 'infographics', 'weimar');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });

  for (const mat of mats) {
    const url = `http://localhost:3003/interactive_mats/${mat.htmlFile}`;
    console.log(`Rendering [${mat.name}] from: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    // Wait for fonts & images to render cleanly
    await new Promise(r => setTimeout(r, 1000));

    const pngBuffer = await page.screenshot({ fullPage: true });
    const webpPath = path.join(outDir, mat.webpFile);

    await sharp(pngBuffer)
      .webp({ quality: 90 })
      .toFile(webpPath);

    const stats = fs.statSync(webpPath);
    console.log(`✅ Saved ${mat.webpFile} (${Math.round(stats.size / 1024)} KB)`);
  }

  await browser.close();
  console.log('\n🎉 Successfully rendered all 4 Weimar Key Topic 2 visual revision mats!');
}

renderAllMats().catch(err => {
  console.error('Error rendering mats:', err);
  process.exit(1);
});

