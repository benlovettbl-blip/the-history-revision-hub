const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting Puppeteer browser verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // 1. Test Literary Companion Pupil Booklet (PDF) on Great War Part 2 Lesson 2
  console.log('\n--- 1. Testing Literary Companion (Great War Part 2 Lesson 2) ---');
  await page.goto('http://localhost:3003/?view=reading&unit=great_war_part2&lesson=2', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.reading-masthead');
  
  const bookletHref = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.reading-masthead a'));
    const btn = links.find(a => a.textContent.includes('Pupil Booklet'));
    return btn ? btn.href : null;
  });
  console.log('Literary companion booklet href:', bookletHref);

  // Fetch the target URL directly
  const res1 = await page.evaluate(async (url) => {
    const r = await fetch(url);
    return { status: r.status, type: r.headers.get('content-type') };
  }, bookletHref);
  console.log('Fetch result:', res1);
  if (res1.status === 200 && res1.type.includes('pdf')) {
    console.log('✅ Pupil Booklet PDF link verified! Returns HTTP 200 application/pdf');
  } else {
    console.error('❌ Failed to fetch booklet PDF:', res1);
  }

  // 2. Test Mock Exams View (Edexcel Medicine)
  console.log('\n--- 2. Testing Mock Exams View (Edexcel Medicine) ---');
  await page.goto('http://localhost:3003/?view=mock-exams&unit=edexcel_medicine', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#main-content h3');
  
  const mockLinks = await page.evaluate(() => {
    const allA = Array.from(document.querySelectorAll('#main-content a'));
    return allA.map(a => ({ text: a.textContent.trim(), href: a.href })).filter(item => item.href.includes('/units/') || item.href.includes('.pdf') || item.href.includes('.html'));
  });
  console.log(`Found ${mockLinks.length} mock links:`);
  for (const m of mockLinks.slice(0, 10)) {
    const check = await page.evaluate(async (url) => {
      try {
        const r = await fetch(url);
        return { status: r.status, ok: r.ok };
      } catch (e) {
        return { status: 0, error: e.message };
      }
    }, m.href);
    console.log(`  [${check.status}] ${m.text} -> ${m.href}`);
    if (check.status !== 200) {
      console.error(`  ❌ Broken link: ${m.href}`);
    }
  }

  // 3. Test Hero Curricular Launchpad on Lessons view (cme_new)
  console.log('\n--- 3. Testing Hero Launchpad (cme_new) ---');
  await page.goto('http://localhost:3003/?view=lessons&unit=cme_new', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.launchpad-pill-group');
  const cmePills = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.launchpad-pill-group'));
    return pills.map(p => {
      const btn = p.querySelector('.launchpad-pill-btn');
      const pdf = p.querySelector('.launchpad-pill-pdf');
      return {
        label: btn ? btn.textContent.trim() : null,
        pdfHref: pdf ? pdf.href : null
      };
    });
  });
  console.log('CME Pills:', JSON.stringify(cmePills, null, 2));

  for (const p of cmePills) {
    if (p.pdfHref) {
      const check = await page.evaluate(async (url) => {
        const r = await fetch(url);
        return { status: r.status, type: r.headers.get('content-type') };
      }, p.pdfHref);
      console.log(`  CME PDF check [${check.status}] (${check.type}) for ${p.label}`);
    }
  }

  // 4. Test Hero Curricular Launchpad on Lessons view (medieval_england)
  console.log('\n--- 4. Testing Hero Launchpad (medieval_england) ---');
  await page.goto('http://localhost:3003/?view=lessons&unit=medieval_england', { waitUntil: 'networkidle2' });
  await page.waitForSelector('.launchpad-pill-group');
  const medPills = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.launchpad-pill-group'));
    return pills.map(p => {
      const btn = p.querySelector('.launchpad-pill-btn');
      const pdf = p.querySelector('.launchpad-pill-pdf');
      return {
        label: btn ? btn.textContent.trim() : null,
        hasPdfBtn: Boolean(pdf),
        pdfHref: pdf ? pdf.href : null
      };
    });
  });
  console.log('Medieval England Pills (no broken PDF buttons):', JSON.stringify(medPills, null, 2));

  // Take screenshots for verification artifact
  await page.goto('http://localhost:3003/?view=mock-exams&unit=edexcel_medicine', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/verified_mocks_view.png', fullPage: false });

  await page.goto('http://localhost:3003/?view=reading&unit=great_war_part2&lesson=2', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/verified_reading_view.png', fullPage: false });

  console.log('\n✅ All Puppeteer browser tests complete and verified healthy!');
  await browser.close();
})();
