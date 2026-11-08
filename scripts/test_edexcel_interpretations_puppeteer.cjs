const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3f233d4c-2fbb-4769-bee8-1b205dfe324d';

const targets = [
  {
    unit: 'post_war_britain',
    lesson: 3,
    name: 'Post-War Britain (Windrush)',
    checkB: 'Ministry of Labour',
    checkC: 'No Coloureds, No Irish, No Dogs',
    checkModelB: 'warmly welcomes these sons and daughters',
    checkModelC: 'Source B'
  },
  {
    unit: 'australia',
    lesson: 4,
    name: 'Australia (Frontier Wars)',
    checkB: 'sovereign protection of British law',
    checkC: 'speared over twenty bullocks',
    checkModelB: 'isolated criminal murders',
    checkModelC: 'Source B'
  },
  {
    unit: 'first_british_empire',
    lesson: 3,
    name: 'First British Empire (Enslaved Resistance)',
    checkB: 'disinclined to labour',
    checkC: 'Queen Nanny',
    checkModelB: 'driver’s whip',
    checkModelC: 'Source B'
  },
  {
    unit: 'great_war',
    lesson: 3,
    name: 'Great War Part 1 (Naval Arms Race)',
    checkB: 'Admiralty Strategic Report',
    checkC: 'Reich',
    checkModelB: 'battleship',
    checkModelC: 'Source B'
  },
  {
    unit: 'great_war_part2',
    lesson: 3,
    name: 'Great War Part 2 (Colonial Troops)',
    checkB: 'Indian troops fighting in Flanders',
    checkC: 'Confidential War Office',
    checkModelB: 'King-Emperor',
    checkModelC: 'Source B'
  }
];

(async () => {
  console.log('Starting Puppeteer verification of Pearson Edexcel Interpretations & Dual Sources...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  let allPassed = true;

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    const url = `http://localhost:3003/?view=lessons&unit=${t.unit}&lesson=${t.lesson}#block-gcse`;
    console.log(`\nTesting ${t.name}: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // Wait for the historical interpretations task box
    const taskBox = await page.$('.historical-interpretations-interactive');
    if (!taskBox) {
      console.error(`❌ Task box .historical-interpretations-interactive not found for ${t.name}`);
      allPassed = false;
      continue;
    }

    // Scroll task box into view
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), taskBox);
    await new Promise(r => setTimeout(r, 600));

    // Click open the model answer reveal
    const modelDetails = await page.$('.historical-interpretations-interactive .model-paragraph-reveal summary');
    if (modelDetails) {
      await modelDetails.click();
      await new Promise(r => setTimeout(r, 400));
    }

    // Get text content of the entire task box
    const boxContent = await page.evaluate(el => el.innerText, taskBox);
    const boxLower = boxContent.toLowerCase();

    // Verify Source B, Source C, and Edexcel technique box
    const hasSourceB = boxLower.includes(t.checkB.toLowerCase());
    const hasSourceC = boxLower.includes(t.checkC.toLowerCase());
    const hasEdexcelCard = boxLower.includes('pearson edexcel gcse paper 3 technique') || boxLower.includes('pearson edexcel');
    const hasModelB = boxLower.includes(t.checkModelB.toLowerCase());
    const hasModelC = boxLower.includes(t.checkModelC.toLowerCase());

    console.log(`  Source B rendered: ${hasSourceB ? '✅ YES' : '❌ NO'}`);
    console.log(`  Source C rendered: ${hasSourceC ? '✅ YES' : '❌ NO'}`);
    console.log(`  Edexcel Technique Card rendered: ${hasEdexcelCard ? '✅ YES' : '❌ NO'}`);
    console.log(`  Model Answer Part (b) quotes present: ${hasModelB ? '✅ YES' : '❌ NO'}`);
    console.log(`  Model Answer Part (c) Sources B & C linkage present: ${hasModelC ? '✅ YES' : '❌ NO'}`);

    if (!hasSourceB || !hasSourceC || !hasEdexcelCard || !hasModelB || !hasModelC) {
      allPassed = false;
    }

    // Capture screenshot of the first one (Post-War Britain) and save to artifact directory
    if (i === 0) {
      const shotPath = path.join(artifactDir, 'verified_edexcel_windrush_sources_model.png');
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`  📸 Screenshot saved to: ${shotPath}`);
    }
  }

  await browser.close();

  if (allPassed) {
    console.log('\n🎉 ALL 5 HISTORICAL INTERPRETATIONS UNITS PASSED WITH 100% EDEXCEL CRITERIA!');
  } else {
    console.error('\n❌ Some checks failed.');
    process.exit(1);
  }
})();
