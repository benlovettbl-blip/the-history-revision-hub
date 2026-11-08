const puppeteer = require('puppeteer');

const tests = [
  { unit: 'post_war_britain', lesson: 1, taskIndex: 0, expectedKeyword: 'suffrage' },
  { unit: 'post_war_britain', lesson: 2, taskIndex: 1, expectedKeyword: 'national health service' },
  { unit: 'post_war_britain', lesson: 4, taskIndex: 0, expectedKeyword: 'bristol' },
  { unit: 'post_war_britain', lesson: 5, taskIndex: 0, expectedKeyword: 'protect and survive' },
  { unit: 'first_british_empire', lesson: 1, taskIndex: 0, expectedKeyword: 'plassey' },
  { unit: 'cold_war', lesson: 5, taskIndex: 2, expectedKeyword: 'vietnam' },
  { unit: 'the_shoah', lesson: 5, taskIndex: 1, expectedKeyword: 'warsaw' },
  { unit: 'water_and_sanitation', lesson: 3, taskIndex: 0, expectedKeyword: 'waterwheel' }
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  console.log('Running targeted Writing Studio model verification across repaired units...\n');

  for (const t of tests) {
    const url = `http://localhost:3003/interactive_mats/viewer.html?unit=${t.unit}&lesson=${t.lesson}`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Switch to Writing Studio
    await page.evaluate(() => {
      if (typeof window.switchPart === 'function') window.switchPart(2);
    });
    await new Promise(r => setTimeout(r, 400));

    // Switch to specific task index
    if (t.taskIndex > 0) {
      await page.evaluate((idx) => {
        if (typeof window.switchWritingStudioTask === 'function') {
          window.switchWritingStudioTask(idx);
        } else {
          const btns = Array.from(document.querySelectorAll('#writing-studio-tasks-group button, .task-selector-btn'));
          if (btns[idx]) btns[idx].click();
        }
      }, t.taskIndex);
      await new Promise(r => setTimeout(r, 400));
    }

    // Read question and raw model
    const data = await page.evaluate(() => {
      const qEl = document.querySelector('.writing-clue-ladder h3, .clue-ladder-question, #question-text');
      const mEl = document.getElementById('model-essay-content');
      return {
        question: qEl ? qEl.innerText.trim() : '',
        model: mEl ? mEl.innerText.trim() : ''
      };
    });

    const matchesExpected = data.model.toLowerCase().includes(t.expectedKeyword.toLowerCase());
    const status = matchesExpected ? 'PASS' : 'FAIL';
    console.log(`[${status}] ${t.unit} L${t.lesson} (Task ${t.taskIndex + 1})`);
    console.log(`   Q: ${data.question.slice(0, 80)}...`);
    console.log(`   Model includes "${t.expectedKeyword}": ${matchesExpected}`);
    console.log(`   Model snippet: ${data.model.slice(0, 120)}...\n`);
  }

  await browser.close();
  console.log('All tests finished successfully!');
})();
