const puppeteer = require('puppeteer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function renderMat() {
  const outDir = path.resolve(__dirname, '..', 'public', 'images', 'infographics', 'weimar');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3003/interactive_mats/weimar_kt2_3_nazi_support.html', {
    waitUntil: 'networkidle0'
  });

  const pngBuffer = await page.screenshot({ fullPage: true });
  await browser.close();

  const webpPath = path.join(outDir, 'weimar_kt2_3_nazi_support.webp');
  await sharp(pngBuffer)
    .webp({ quality: 90 })
    .toFile(webpPath);

  console.log('Successfully generated webp at:', webpPath);
}

renderMat().catch(console.error);

