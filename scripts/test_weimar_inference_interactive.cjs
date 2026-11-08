const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:3003/interactive_mats/viewer.html?unit=weimar_nazi_germany&lesson=lesson_2&part=3', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Type a student response into the ruled textarea
  const answer = `(i) What I can infer: One thing I can infer from Source A is that Adolf Hitler was a theatrical speaker.
Details in the source that tell me this: "Eyewitnesses describe Hitler starting quietly before shouting."

(ii) What I can infer: A second thing I can infer is that the NSDAP used armed intimidation.
Details in the source that tell me this: "Brownshirt stormtroopers guarded every doorway with sticks."`;

  await page.type('#pupil-writeup-textarea', answer);
  await new Promise(r => setTimeout(r, 500));

  const pillStates = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#writeup-tracker-pills .tracker-pill')).map(p => ({
      text: p.textContent.trim(),
      included: p.classList.contains('included')
    }));
  });

  console.log('Pill States after student writes answer:');
  console.log(JSON.stringify(pillStates, null, 2));

  // Take screenshot of the verified Weimar Inference Question
  const screenshotPath = 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/sample3_gcse_weimar_inference_FIXED.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('📸 Screenshot saved to:', screenshotPath);

  // Now reveal model answer and capture that too!
  await page.click('#btn-reveal-right');
  await new Promise(r => setTimeout(r, 500));

  const modelHtml = await page.evaluate(() => document.getElementById('model-essay-content')?.innerHTML);
  console.log('Model HTML revealed (length):', modelHtml?.length);

  const screenshotPathModel = 'C:/Users/fives/.gemini/antigravity/brain/3f233d4c-2fbb-4769-bee8-1b205dfe324d/sample3_gcse_weimar_inference_MODEL_REVEALED.png';
  await page.screenshot({ path: screenshotPathModel, fullPage: false });
  console.log('📸 Screenshot with model saved to:', screenshotPathModel);

  await browser.close();
})();

