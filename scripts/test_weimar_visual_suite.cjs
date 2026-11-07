const puppeteer = require('puppeteer');

async function testWeimarVisualSuite() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3003 ...');
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle0' });

  // Switch to Weimar unit if not currently active
  await page.evaluate(() => {
    if (window.renderUnit) window.renderUnit('weimar_nazi_germany');
    else if (window.switchUnit) window.switchUnit('weimar_nazi_germany');
  });

  await new Promise(r => setTimeout(r, 1000));

  // Inspect the 4 lesson cards of Key Topic 2 (Lessons 5, 6, 7, 8)
  const results = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.lesson-card, .card'));
    // Find KT2 lessons
    const kt2Cards = [];
    ['lesson_2_1', 'lesson_2_2', 'lesson_2_3', 'lesson_2_4'].forEach(id => {
      const btn = document.querySelector(`button[onclick*="${id}"]`);
      kt2Cards.push({
        lessonId: id,
        hasInfographicBtn: !!btn,
        btnText: btn ? btn.textContent.trim() : null
      });
    });
    return {
      manifestCount: window.getLessonInfographicCount ? {
        l5: window.getLessonInfographicCount('weimar_nazi_germany', 'lesson_2_1'),
        l6: window.getLessonInfographicCount('weimar_nazi_germany', 'lesson_2_2'),
        l7: window.getLessonInfographicCount('weimar_nazi_germany', 'lesson_2_3'),
        l8: window.getLessonInfographicCount('weimar_nazi_germany', 'lesson_2_4')
      } : 'no function',
      kt2Cards
    };
  });

  console.log('Test results:', JSON.stringify(results, null, 2));

  // Test opening the lightbox for lesson_2_1
  console.log('Testing modal opening for lesson_2_1...');
  await page.evaluate(() => {
    if (window.openLessonInfographicModal) {
      window.openLessonInfographicModal('lesson_2_1', 'weimar_nazi_germany');
    }
  });

  await new Promise(r => setTimeout(r, 600));

  const modalState = await page.evaluate(() => {
    const modal = document.getElementById('hub-infographic-modal');
    if (!modal) return { exists: false };
    const title = modal.querySelector('.hub-infographic-title')?.textContent;
    const img = modal.querySelector('#hub-infographic-img')?.getAttribute('src');
    const display = window.getComputedStyle(modal).display;
    return { exists: true, display, title, img };
  });

  console.log('Modal state:', JSON.stringify(modalState, null, 2));

  await browser.close();
}

testWeimarVisualSuite().catch(err => {
  console.error(err);
  process.exit(1);
});
