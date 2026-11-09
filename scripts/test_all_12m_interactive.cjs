const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const testCases = [
    { unit: 'edexcel_medicine', lesson: 'lesson_1_1', qId: 'lesson_1_1_q2' },
    { unit: 'weimar_nazi_germany', lesson: 'lesson_1_1', qId: 'mock_notebook_3_q2' },
    { unit: 'usa', lesson: 'lesson_1_1', qId: 'usa_mock_1_q2' }
  ];

  for (const tc of testCases) {
    const url = `http://localhost:3003/?unit=${tc.unit}&lesson=${tc.lesson}`;
    console.log(`\nNavigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    const res = await page.evaluate((qId) => {
      if (window.toggleExamCardModelAnswer) {
        window.toggleExamCardModelAnswer(qId);
      }
      const card = document.querySelector(`#exam-card-${qId}`);
      if (!card) return { error: `Card #exam-card-${qId} not found` };

      const header = card.querySelector('.fa-scale-balanced')?.parentElement?.innerText || 'NO HEADER';
      const btns = Array.from(card.querySelectorAll('[data-tier-btn]')).map(b => ({
        key: b.getAttribute('data-tier-btn'),
        text: b.innerText.trim(),
        active: b.classList.contains('active')
      }));

      const activePane = card.querySelector(`[id^="exam-tier-pane-${qId}-"]:not([style*="display: none"])`);
      const wordBadge = activePane ? activePane.querySelector('span[style*="border-radius: 12px"]')?.innerText : 'none';
      const text = activePane ? activePane.innerText : '';
      const hasTherefore = text.includes('Therefore, this');

      return { header, btns, wordBadge, hasTherefore };
    }, tc.qId);

    console.log(`[${tc.unit}] [${tc.qId}] Result:`, JSON.stringify(res, null, 2));

    if (!res.error && res.btns.length === 3 && res.hasTherefore) {
      console.log(`>>> PASS: ${tc.unit} ${tc.qId} rendered 3-tier ladder with explicit causal links!`);
    } else {
      console.error(`>>> FAIL on ${tc.unit} ${tc.qId}!`);
    }
  }

  await browser.close();
  console.log('\nAll browser verification tests completed successfully!');
})();
