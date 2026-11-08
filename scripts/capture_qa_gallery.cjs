const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const artifactDir = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d';
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 1 });

  await page.goto('http://localhost:3003/visual_qa_gallery.html', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 4000));

  const units = ['second_british_empire', 'first_british_empire', 'great_war_part2', 'industrialisation_and_empire'];

  for (const u of units) {
    const el = await page.$(`#unit-${u}`);
    if (el) {
      const outPath = path.join(artifactDir, `qa_gallery_${u}.png`);
      await el.screenshot({ path: outPath });
      console.log(`Captured ${u} -> ${outPath}`);
    } else {
      console.log(`Element #unit-${u} not found`);
    }
  }

  await browser.close();
  console.log('All QA gallery snapshots captured successfully.');
})();
