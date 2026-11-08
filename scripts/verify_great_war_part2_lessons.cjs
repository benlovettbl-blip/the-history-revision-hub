const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  // 1. Verify Lesson 1 Stage 1.3 Stubbington restoration
  console.log('Navigating to Great War Part 2 Lesson 1...');
  await page.goto('http://localhost:3003/?view=lessons&unit=great_war_part2&lesson=1#block-gcse', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  const stage3Text = await page.evaluate(() => {
    const el = document.getElementById('para-3') || document.querySelector('.standard-narrative-container:nth-of-type(3)') || document.body;
    return el ? el.innerText : '';
  });

  const hasStubbington = stage3Text.includes('Stubbington');
  console.log('Lesson 1 Stage 3 mentions Stubbington:', hasStubbington);

  const l1Screenshot = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/gw2_l1_stage3_stubbington_restored.png');
  await page.screenshot({ path: l1Screenshot });
  console.log('Lesson 1 screenshot saved to:', l1Screenshot);

  // 2. Verify Lesson 2 paragraphs
  console.log('Navigating to Great War Part 2 Lesson 2...');
  await page.goto('http://localhost:3003/?view=lessons&unit=great_war_part2&lesson=2#block-gcse', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  const l2Screenshot = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/gw2_l2_paragraphs_verified.png');
  await page.screenshot({ path: l2Screenshot });
  console.log('Lesson 2 screenshot saved to:', l2Screenshot);

  await browser.close();
  console.log('Verification finished successfully!');
})();
