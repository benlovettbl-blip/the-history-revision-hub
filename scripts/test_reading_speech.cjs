const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('--- Testing Guided Reading Natural Speech Engine ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });

  const url = 'http://localhost:3003/?view=reading&unit=great_war_part2&lesson=2';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the Audio Read-Aloud Studio to be visible
  await page.waitForSelector('.audio-read-aloud-studio', { timeout: 10000 });
  console.log('Audio Read-Aloud Studio located!');

  // Check the initial UI state
  const studioState = await page.evaluate(() => {
    const playBtn = document.querySelector('#btn-read-aloud-play');
    const stopBtn = document.querySelector('#btn-read-aloud-stop');
    const voiceLabel = document.querySelector('#reading-voice-name-label');
    const femaleBtn = document.querySelector('.voice-gender-btn[data-gender="female"]');
    const maleBtn = document.querySelector('.voice-gender-btn[data-gender="male"]');
    const speed10 = document.querySelector('.speed-pill[data-rate="1.0"]');
    const statusText = document.querySelector('#speech-status-indicator');

    return {
      playBtnText: playBtn ? playBtn.textContent.trim() : null,
      stopBtnDisplay: stopBtn ? stopBtn.style.display : null,
      voiceLabel: voiceLabel ? voiceLabel.textContent.trim() : null,
      femaleActive: femaleBtn ? femaleBtn.classList.contains('active-voice') : false,
      maleActive: maleBtn ? maleBtn.classList.contains('active-voice') : false,
      speed10Active: speed10 ? speed10.classList.contains('active-speed') : false,
      statusText: statusText ? statusText.textContent.trim() : null
    };
  });
  console.log('Initial Studio State:', studioState);

  // Test toggling to Male voice
  console.log('Clicking Male Voice toggle...');
  await page.click('.voice-gender-btn[data-gender="male"]');
  await new Promise(r => setTimeout(r, 200));

  const maleState = await page.evaluate(() => {
    const femaleBtn = document.querySelector('.voice-gender-btn[data-gender="female"]');
    const maleBtn = document.querySelector('.voice-gender-btn[data-gender="male"]');
    const voiceLabel = document.querySelector('#reading-voice-name-label');
    return {
      femaleActive: femaleBtn.classList.contains('active-voice'),
      maleActive: maleBtn.classList.contains('active-voice'),
      voiceLabel: voiceLabel ? voiceLabel.textContent.trim() : null
    };
  });
  console.log('After Male Voice Toggle:', maleState);

  // Switch back to Female voice
  await page.click('.voice-gender-btn[data-gender="female"]');
  await new Promise(r => setTimeout(r, 200));

  // Test clicking Play
  console.log('Clicking Listen: Read Aloud button...');
  await page.click('#btn-read-aloud-play');
  await new Promise(r => setTimeout(r, 600));

  const playingState = await page.evaluate(() => {
    const playBtn = document.querySelector('#btn-read-aloud-play');
    const stopBtn = document.querySelector('#btn-read-aloud-stop');
    const statusText = document.querySelector('#speech-status-indicator');
    const interactiveSpans = document.querySelectorAll('#extract-body-container .speech-word');
    const highlightedSentence = document.querySelectorAll('#extract-body-container .speaking-sentence-highlight');
    const highlightedWord = document.querySelectorAll('#extract-body-container .speaking-word-highlight');

    return {
      playBtnClass: playBtn.className,
      playBtnText: playBtn.textContent.trim(),
      stopBtnDisplay: stopBtn.style.display,
      statusText: statusText ? statusText.textContent.trim() : null,
      tokenizedWordsCount: interactiveSpans.length,
      hasSentenceHighlight: highlightedSentence.length > 0,
      highlightedWordsCount: highlightedWord.length,
      sampleWordInteractive: interactiveSpans[0] ? interactiveSpans[0].classList.contains('speech-interactive-sentence') : false
    };
  });
  console.log('Playing State:', playingState);

  // Capture screenshot of the playing state with active highlight
  const screenshotPath = path.resolve('..', '.gemini', 'antigravity', 'brain', '3f233d4c-2fbb-4769-bee8-1b205dfe324d', 'reading_audio_studio_playing.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Saved screenshot to ${screenshotPath}`);

  // Test clicking a sentence directly to jump narration
  console.log('Testing interactive sentence clicking...');
  const jumpSuccess = await page.evaluate(() => {
    const spans = document.querySelectorAll('#extract-body-container .speech-word');
    // Find span from sentence 2 or 3
    const targetSpan = Array.from(spans).find(s => parseInt(s.dataset.sentence, 10) >= 2);
    if (targetSpan) {
      targetSpan.click();
      return { clickedSentence: targetSpan.dataset.sentence, word: targetSpan.textContent };
    }
    return null;
  });
  console.log('Jump sentence result:', jumpSuccess);
  await new Promise(r => setTimeout(r, 600));

  // Test Stop button
  console.log('Clicking Stop button...');
  await page.click('#btn-read-aloud-stop');
  await new Promise(r => setTimeout(r, 300));

  const stoppedState = await page.evaluate(() => {
    const playBtn = document.querySelector('#btn-read-aloud-play');
    const stopBtn = document.querySelector('#btn-read-aloud-stop');
    const statusText = document.querySelector('#speech-status-indicator');
    return {
      playBtnText: playBtn.textContent.trim(),
      stopBtnDisplay: stopBtn.style.display,
      statusText: statusText ? statusText.textContent.trim() : null
    };
  });
  console.log('Stopped State:', stoppedState);

  await browser.close();
  console.log('--- Guided Reading Natural Speech Engine Test Completed Successfully! ---');
})();

