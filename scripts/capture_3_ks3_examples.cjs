const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = path.resolve('C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d');

(async () => {
  console.log('🚀 Capturing 3 diverse KS3 Writing Studio examples in Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 960 });

  const examples = [
    {
      name: 'KS3 Example 1: Australia Lesson 4 (Frontier Wars - Contrasting Interpretations)',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=australia&lesson=lesson_4&part=3',
      taskIdx: 0,
      filename: 'ks3_sample1_australia_interpretations.png',
      simulateTyping: 'Interpretations 1 and 2 differ fundamentally on the nature of the Australian Frontier Wars. Interpretation 1 argues that frontier violence was widespread and systemic warfare. By contrast, Interpretation 2 suggests conflict was sporadic and isolated. A key reason for difference is that the historians rely on different sources, with Reynolds citing colonial police records while Windschuttle focuses on settler diaries.'
    },
    {
      name: 'KS3 Example 2: Early Modern World Lesson 4 (Gunpowder Plot - 12m Causal Explanation)',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=early_modern_world&lesson=lesson_4&part=3',
      taskIdx: 0,
      filename: 'ks3_sample2_early_modern_gunpowder_plot.png',
      simulateTyping: 'A decisive factor explaining the 1605 Gunpowder Plot was the intense sense of religious betrayal and escalating persecution experienced by English Catholics under King James I. Robert Catesby and Guy Fawkes smuggled 36 barrels of gunpowder beneath the House of Lords. Consequently, when Lord Monteagle received the warning letter, Robert Cecil ordered the search.'
    },
    {
      name: 'KS3 Example 3: The Shoah Lesson 4 (Barbarossa Turning Point - Evaluative Statement Essay 12m)',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=the_shoah&lesson=lesson_4&part=3',
      taskIdx: 0,
      filename: 'ks3_sample3_the_shoah_evaluative_essay.png',
      simulateTyping: 'It can be argued that Operation Barbarossa was the decisive turning point in the persecution of Jewish people because the invasion of the Soviet Union initiated mass shootings by the Einsatzgruppen. However, an alternative view is that the Wannsee Conference in 1942 formalized industrialized extermination. Own knowledge proves that both events transformed Nazi policy into systematic genocide.'
    }
  ];

  for (const ex of examples) {
    console.log(`\nCapturing: ${ex.name}...`);
    await page.goto(ex.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('#pupil-writeup-textarea', { timeout: 10000 });

    if (ex.taskIdx > 0) {
      const btn = await page.$(`[data-task-idx="${ex.taskIdx}"]`);
      if (btn) {
        await btn.click();
        await new Promise(r => setTimeout(r, 400));
      }
    }

    // Type the simulated student response to show live green pill tracker validation
    if (ex.simulateTyping) {
      await page.type('#pupil-writeup-textarea', ex.simulateTyping, { delay: 10 });
      await new Promise(r => setTimeout(r, 500));
    }

    const savePath = path.join(ARTIFACT_DIR, ex.filename);
    await page.screenshot({ path: savePath, fullPage: true });
    console.log(`📸 Saved screenshot to: ${savePath}`);

    const res = await page.evaluate(() => ({
      badge: document.getElementById('ks2-active-task-badge')?.innerText,
      title: document.getElementById('writing-studio-title')?.innerText,
      tariff: document.getElementById('writing-studio-tariff')?.innerText,
      starter: document.getElementById('bronze-sentence-starter')?.innerText?.slice(0, 100),
      pills: Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => p.innerText.trim())
    }));
    console.log('  Badge:', res.badge);
    console.log('  Title:', res.title?.slice(0, 70));
    console.log('  Tariff:', res.tariff);
    console.log('  Starter:', res.starter);
    console.log('  Pills:', res.pills);
  }

  await browser.close();
  console.log('\n🎉 Successfully captured all 3 KS3 examples!');
})();

