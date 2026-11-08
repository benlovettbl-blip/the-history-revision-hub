const puppeteer = require('puppeteer');
const path = require('path');

const targetLessons = [
  { unit: 'post_war_britain', lesson: 3, name: 'Post-War Britain Lesson 3 (Windrush)' },
  { unit: 'australia', lesson: 4, name: 'Australia Lesson 4 (Frontier Wars)' },
  { unit: 'first_british_empire', lesson: 3, name: 'First British Empire Lesson 3 (Slavery Resistance)' },
  { unit: 'great_war', lesson: 3, name: 'Great War Lesson 3 (Naval Arms Race)' },
  { unit: 'great_war_part2', lesson: 3, name: 'Great War Part 2 Lesson 3 (Colonial Troops)' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  const artifactDir = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d';

  const summary = [];

  for (const item of targetLessons) {
    const url = `http://localhost:3003/?view=lessons&unit=${item.unit}&lesson=${item.lesson}#block-gcse`;
    console.log(`\nNavigating to ${item.name}: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // Scroll to the task
    const taskFound = await page.evaluate(() => {
      const el = document.querySelector('.historical-interpretations-interactive');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 500));

    // Evaluate the interpretation card extracts
    const data = await page.evaluate(() => {
      const taskContainer = document.querySelector('.historical-interpretations-interactive');
      if (!taskContainer) {
        return { error: 'Task container .historical-interpretations-interactive not found' };
      }
      const title = taskContainer.querySelector('h4')?.innerText.trim() || '';
      
      const bodies = Array.from(taskContainer.querySelectorAll('.archival-source-body')).map(el => el.innerText.trim());
      const authors = Array.from(taskContainer.querySelectorAll('div > i.fa-user-pen')).map(el => el.parentElement?.innerText.trim());

      return {
        title,
        bodiesCount: bodies.length,
        bodies,
        authorsCount: authors.length,
        authors
      };
    });

    console.log(`Result for ${item.unit} L${item.lesson}:`, data);
    summary.push({ item, data });

    const screenshotPath = path.join(artifactDir, `interp_${item.unit}_l${item.lesson}_verified.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Saved screenshot to ${screenshotPath}`);
  }

  await browser.close();
  console.log('\n================ SUMMARY ================');
  summary.forEach(s => {
    const ok = s.data && s.data.bodiesCount === 2 && s.data.bodies.every(b => b.length > 50);
    console.log(`[${ok ? 'PASS' : 'FAIL'}] ${s.item.name}: bodiesCount=${s.data?.bodiesCount}, lengths=${s.data?.bodies?.map(b => b.length).join(', ')}`);
  });
})();
