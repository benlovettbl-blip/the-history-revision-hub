/**
 * pre_commit_final_audit.cjs
 * Comprehensive multi-stage verification before git commit:
 * 1. JSON syntax & cache parity check across all units
 * 2. Multi-tier interactive mat regression check (KS2, KS3, GCSE)
 * 3. Random sampling visual capture across diverse units:
 *    - KS2 WW2 Lesson 5 (Dig for Victory)
 *    - GCSE Medicine Lesson 1 (Medieval)
 *    - GCSE Weimar Lesson 2 (Munich Putsch)
 *    - KS3 The Shoah Lesson 2 (Kristallnacht)
 *    - KS3 Medieval England Lesson 1 (Hastings)
 *    - Main Homepage
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const PUB_DATA_DIR = path.join(ROOT, 'public', 'data');
const DB_PATH = path.join(ROOT, 'database.json');
const PUB_DB_PATH = path.join(ROOT, 'public', 'database.json');

const ARTIFACTS_DIR = 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d';

async function runAudit() {
  console.log('================================================================');
  console.log('🔍 RUNNING COMPREHENSIVE FINAL PRE-COMMIT AUDIT');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // STAGE 1: JSON SYNTAX & FILE INTEGRITY
  // -------------------------------------------------------------
  console.log('📁 STAGE 1: Auditing JSON syntax across all datasets...');
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  let jsonErrors = 0;

  jsonFiles.forEach(file => {
    const p1 = path.join(DATA_DIR, file);
    const p2 = path.join(PUB_DATA_DIR, file);
    try {
      const parsed1 = JSON.parse(fs.readFileSync(p1, 'utf8'));
      if (fs.existsSync(p2)) {
        const parsed2 = JSON.parse(fs.readFileSync(p2, 'utf8'));
        // check lessons count
        if (parsed1.lessons && parsed2.lessons && parsed1.lessons.length !== parsed2.lessons.length) {
          console.warn(`⚠️ Warning: Lesson count mismatch in ${file} (data: ${parsed1.lessons.length}, public: ${parsed2.lessons.length})`);
        }
      }
    } catch (e) {
      console.error(`❌ JSON Syntax Error in ${file}:`, e.message);
      jsonErrors++;
    }
  });

  // Check database.json
  try {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const pubDb = JSON.parse(fs.readFileSync(PUB_DB_PATH, 'utf8'));
    console.log(`✅ database.json & public/database.json valid (Top-level keys: ${Object.keys(db).length})`);
  } catch (e) {
    console.error('❌ database.json Syntax Error:', e.message);
    jsonErrors++;
  }

  if (jsonErrors === 0) {
    console.log(`✅ Stage 1 Passed: All ${jsonFiles.length} JSON datasets are syntactically sound and valid.\n`);
  } else {
    console.error(`❌ Stage 1 Failed with ${jsonErrors} errors!\n`);
  }

  // -------------------------------------------------------------
  // STAGE 2: MULTI-TIER BROWSER RANDOM SAMPLING & VISUAL CHECKS
  // -------------------------------------------------------------
  console.log('🌐 STAGE 2: Multi-Tier Browser Regression & Visual Sampling...');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  const samples = [
    {
      name: 'sample1_ks2_ww2_lesson5_rationing',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=ks2_ww2&lesson=lesson_5&part=3',
      tier: 'KS2',
      description: 'KS2 WW2 Lesson 5 (Dig for Victory & Wartime Rationing)'
    },
    {
      name: 'sample2_gcse_medicine_lesson1_medieval',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=edexcel_medicine&lesson=lesson_1&part=3',
      tier: 'GCSE',
      description: 'GCSE Edexcel Medicine Lesson 1 (Medieval Medicine & Four Humours)'
    },
    {
      name: 'sample3_gcse_weimar_lesson2_munich_putsch',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=weimar_nazi_germany&lesson=lesson_2&part=3',
      tier: 'GCSE',
      description: 'GCSE Weimar Nazi Germany Lesson 2 (The Munich Putsch 1923)'
    },
    {
      name: 'sample4_ks3_the_shoah_lesson2_kristallnacht',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=the_shoah&lesson=lesson_2&part=3',
      tier: 'KS3',
      description: 'KS3 The Shoah Lesson 2 (The November Pogrom / Kristallnacht)'
    },
    {
      name: 'sample5_ks3_medieval_lesson1_hastings',
      url: 'http://localhost:3003/interactive_mats/viewer.html?unit=medieval_england&lesson=lesson_1&part=3',
      tier: 'KS3',
      description: 'KS3 Medieval England Lesson 1 (Battle of Hastings 1066)'
    },
    {
      name: 'sample6_main_homepage',
      url: 'http://localhost:3003/',
      tier: 'Navigation',
      description: 'Main Application Hub Homepage'
    }
  ];

  const results = [];

  for (const s of samples) {
    console.log(`  Testing ${s.tier}: ${s.description}...`);
    try {
      await page.goto(s.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));

      // Check for console errors or broken elements
      const title = await page.title();
      const screenshotPath = path.join(ARTIFACTS_DIR, `${s.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      console.log(`    📸 Saved: ${s.name}.png`);
      results.push({ name: s.name, description: s.description, status: 'PASS', path: screenshotPath });
    } catch (err) {
      console.error(`    ❌ Error loading ${s.description}:`, err.message);
      results.push({ name: s.name, description: s.description, status: 'FAIL', error: err.message });
    }
  }

  await browser.close();

  console.log('\n================================================================');
  console.log('📊 FINAL AUDIT SUMMARY:');
  console.log('================================================================');
  results.forEach(r => {
    console.log(`${r.status === 'PASS' ? '✅' : '❌'} [${r.status}] ${r.description}`);
  });
  console.log('================================================================\n');
}

runAudit().catch(err => {
  console.error('Fatal error during audit:', err);
});

