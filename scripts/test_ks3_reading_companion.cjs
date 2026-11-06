/**
 * scripts/test_ks3_reading_companion.cjs
 *
 * Automated Headless Puppeteer Test Suite for:
 * 1. Literary Companion & Audio Read-Aloud Studio (?view=reading&unit=great_war_part2&lesson=1)
 * 2. Tab switching across all 5 wartime extracts
 * 3. Sidebar 'Literary Companion' visibility & navigation
 * 4. In-Lesson Header launcher pill with target="_blank"
 * 5. Digital Department Marking Bank (?view=marking&unit=great_war_part2)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function runTests() {
  console.log('=============================================================');
  console.log('🧪 Starting Automated Self-Testing: KS3 Reading & Retrieval');
  console.log('=============================================================');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromePath86 = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath)
    ? chromePath
    : fs.existsSync(chromePath86)
      ? chromePath86
      : undefined;

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // TEST 1: Direct URL to Lesson 1 Reading
  console.log('\n--- TEST 1: Direct URL to Literary Companion (?view=reading&unit=great_war_part2&lesson=1) ---');
  await page.goto('http://localhost:3003/?view=reading&unit=great_war_part2&lesson=1', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  const titleText = await page.$eval('h1', (el) => el.textContent.trim());
  console.log('✓ Masthead Title:', titleText);
  if (!titleText.includes('Literary Companion')) {
    throw new Error('Masthead title does not contain "Literary Companion"');
  }

  const bookTitle = await page.$eval('.guided-reading-card h2', (el) => el.textContent.trim());
  console.log('✓ Book Title:', bookTitle);
  if (!bookTitle.includes('Memoirs of an Infantry Officer')) {
    throw new Error('Book title does not match Memoirs of an Infantry Officer');
  }

  const authorText = await page.$eval('.guided-reading-card', (el) => el.textContent);
  if (!authorText.includes('Siegfried Sassoon')) {
    throw new Error('Author Siegfried Sassoon not found on page');
  }
  console.log('✓ Author verified: Siegfried Sassoon');

  // Verify Book Cover Image
  const imgUrl = await page.$eval('.guided-reading-card img', (el) => el.src);
  console.log('✓ Book Cover Image URL:', imgUrl);
  if (!imgUrl || !imgUrl.includes('siegfried_sassoon')) {
    throw new Error('Book cover image URL does not include siegfried_sassoon');
  }

  // Verify Audio Read-Aloud Studio Controls
  const hasPlayBtn = await page.$('#btn-read-aloud-play');
  const hasStopBtn = await page.$('#btn-read-aloud-stop');
  const speedPills = await page.$$('.speed-pill');
  console.log(`✓ Audio Read-Aloud Studio Controls: Play [${Boolean(hasPlayBtn)}], Stop [${Boolean(hasStopBtn)}], Speed Pills [${speedPills.length}]`);
  if (!hasPlayBtn || !hasStopBtn || speedPills.length !== 3) {
    throw new Error('Audio Read-Aloud Studio controls are incomplete');
  }

  // Verify Parent & Scholar Discussion Guide Card
  const discussionText = await page.$eval('.guided-reading-card', (el) => el.textContent);
  if (!discussionText.includes('Parent & Scholar Oral Discussion Guide')) {
    throw new Error('Parent & Scholar Oral Discussion Guide card missing');
  }
  console.log('✓ Parent & Scholar Oral Discussion Guide card verified');

  // TEST 2: Tab Switching across all 5 readings
  console.log('\n--- TEST 2: Switching tabs across all 5 readings ---');
  const tabs = await page.$$('.reading-tab-bar button');
  console.log(`✓ Found ${tabs.length} lesson switcher tabs`);
  if (tabs.length !== 5) {
    throw new Error(`Expected 5 tabs, found ${tabs.length}`);
  }

  // Click Tab 2 (Storm of Steel)
  await tabs[1].click();
  await new Promise((r) => setTimeout(r, 400));
  const book2Title = await page.$eval('.guided-reading-card h2', (el) => el.textContent.trim());
  console.log('✓ Clicked Tab 2 -> Loaded Book:', book2Title);
  if (!book2Title.includes('Storm of Steel')) {
    throw new Error('Failed to switch to Storm of Steel');
  }

  // Click Tab 4 (Testament of Youth)
  await tabs[3].click();
  await new Promise((r) => setTimeout(r, 400));
  const book4Title = await page.$eval('.guided-reading-card h2', (el) => el.textContent.trim());
  console.log('✓ Clicked Tab 4 -> Loaded Book:', book4Title);
  if (!book4Title.includes('Testament of Youth')) {
    throw new Error('Failed to switch to Testament of Youth');
  }

  // TEST 3: Sidebar Navigation
  console.log('\n--- TEST 3: Sidebar "Literary Companion" Visibility & Click ---');
  await page.goto('http://localhost:3003/?view=lessons&stage=3&unit=great_war_part2', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  const navReadingDisplay = await page.$eval('#nav-reading', (el) => window.getComputedStyle(el).display);
  const navReadingText = await page.$eval('#nav-reading', (el) => el.textContent.trim());
  console.log(`✓ Sidebar nav-reading display: "${navReadingDisplay}", text: "${navReadingText}"`);
  if (navReadingDisplay === 'none' || !navReadingText.includes('Literary Companion')) {
    throw new Error('nav-reading is not visible or lacks "Literary Companion" text');
  }

  // Click sidebar nav-reading
  await page.click('#nav-reading');
  await new Promise((r) => setTimeout(r, 600));
  const activeReadingView = await page.$eval('h1', (el) => el.textContent.trim());
  console.log('✓ Clicked sidebar nav-reading -> Navigated to:', activeReadingView);
  if (!activeReadingView.includes('Literary Companion')) {
    throw new Error('Clicking nav-reading failed to navigate to Literary Companion');
  }

  // TEST 4: In-Lesson Header Launcher Pill
  console.log('\n--- TEST 4: In-Lesson Header Launcher Pill ---');
  await page.goto('http://localhost:3003/?view=lessons&stage=3&unit=great_war_part2&lesson=1', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  const launcherExists = await page.$('.btn-guided-reading-launcher');
  if (!launcherExists) {
    throw new Error('In-lesson launcher pill .btn-guided-reading-launcher not found');
  }
  const launcherTarget = await page.$eval('.btn-guided-reading-launcher', (el) => el.getAttribute('target'));
  const launcherHref = await page.$eval('.btn-guided-reading-launcher', (el) => el.getAttribute('href'));
  const launcherLabel = await page.$eval('.btn-guided-reading-launcher', (el) => el.textContent.trim());
  console.log(`✓ In-lesson launcher pill found: "${launcherLabel}"`);
  console.log(`✓ Launcher href: "${launcherHref}", target: "${launcherTarget}"`);
  if (launcherTarget !== '_blank') {
    throw new Error('Launcher pill does not have target="_blank"');
  }
  if (!launcherHref.includes('view=reading') || !launcherHref.includes('great_war_part2')) {
    throw new Error('Launcher pill href does not contain view=reading and unit=great_war_part2');
  }

  // TEST 5: Digital Marking Bank (?view=marking&unit=great_war_part2)
  console.log('\n--- TEST 5: Digital Department Marking Bank ---');
  await page.goto('http://localhost:3003/?view=marking&unit=great_war_part2', {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  const markingTitle = await page.$eval('h1', (el) => el.textContent.trim());
  console.log('✓ Marking Bank Title:', markingTitle);
  if (!markingTitle.includes('The Course of the Great War')) {
    throw new Error('Marking bank title does not match unit');
  }

  const qCards = await page.$$('.marking-question-card');
  console.log(`✓ Marking Question Cards count: ${qCards.length} (Expected 30)`);
  if (qCards.length !== 30) {
    throw new Error(`Expected 30 marking question cards, found ${qCards.length}`);
  }

  // Click first accordion to reveal model answer
  const firstDetails = await page.$('.marking-question-card details');
  await firstDetails.click();
  const revealedAnswer = await page.$eval('.marking-question-card details', (el) => el.textContent);
  console.log('✓ Revealed Model Answer sample:', revealedAnswer.replace(/\s+/g, ' ').slice(0, 100) + '...');
  if (!revealedAnswer.includes('Kitchener')) {
    throw new Error('Model answer did not reveal expected content');
  }

  await browser.close();
  console.log('\n=============================================================');
  console.log('🎉 ALL 5 AUTOMATED TESTS PASSED WITH 100% SUCCESS!');
  console.log('=============================================================');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});

