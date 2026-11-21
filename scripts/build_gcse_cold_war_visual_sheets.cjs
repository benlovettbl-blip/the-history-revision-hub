/**
 * Master Compiler for GCSE Cold War 12-Lesson 6-Card Visual Story Sheets (`lesson_01` – `lesson_12`)
 * Reads `lesson.visual_story_sheet` directly from `data/gcse_cold_war.json` (Single Source of Truth),
 * renders `public/units/gcse_cold_war/visual_sheets/lesson_01_visual_story.html` .. `lesson_12_visual_story.html`,
 * mirrors to `units/gcse_cold_war/visual_sheets/`, and updates `public/data/infographics_manifest.json`.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const cmeScript = fs.readFileSync(path.join(__dirname, 'build_cme_visual_story_sheets.mjs'), 'utf8');
const styleMatch = cmeScript.match(/<style>[\s\S]*?<\/style>/);
if (!styleMatch) throw new Error('Could not extract CSS from build_cme_visual_story_sheets.mjs');
const SHARED_STYLE = styleMatch[0];

const unitData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'gcse_cold_war.json'), 'utf8'));

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCardVisual(card) {
  if (card.mode === 'contain-light') {
    return `
          <div class="card-visual light-matte">
            <img class="archival-contain" src="${card.img}" alt="${escHtml(card.heading)}" />
          </div>`;
  }
  if (card.mode === 'contain' || !card.mode) {
    return `
          <div class="card-visual">
            <img class="bg-blur" src="${card.img}" alt="" aria-hidden="true" />
            <img class="archival-contain" src="${card.img}" alt="${escHtml(card.heading)}" />
          </div>`;
  }
  const extraBg = card.mode === 'landscape-light' ? ' style="background:#f8fafc;"' : '';
  const posStyle = card.pos ? ` style="object-position: ${card.pos};"` : '';
  return `
          <div class="card-visual"${extraBg}>
            <img class="archival-landscape" src="${card.img}"${posStyle} alt="${escHtml(card.heading)}" />
          </div>`;
}

function renderCard(card, idx, colorClass) {
  const isOutcome = idx === 5 || card.isOutcome;
  const badgeCls = isOutcome ? 'step-badge outcome-badge' : 'step-badge';
  return `
        <article class="story-card ${colorClass}" id="card-${idx}" onclick="jumpToStage(${idx})" title="Tap anywhere on this card to jump voice narration here">
          <div class="card-top">
            <div class="card-meta-row">
              <span class="${badgeCls}">${escHtml(card.badge)}</span>
              <div class="card-top-right">
                <span class="step-date">${escHtml(card.date)}</span>
                <button type="button" class="card-speak-btn no-print" onclick="event.stopPropagation(); jumpToStage(${idx});" title="Listen from ${escHtml(card.badge)}">🔊</button>
              </div>
            </div>
            <h2 class="step-heading">${escHtml(card.heading)}</h2>
          </div>${renderCardVisual(card)}
          <div class="stat-strip">
            <span class="stat-dot"></span>
            <span>${escHtml(card.stat)}</span>
          </div>
          <div class="card-body">
            <p class="story-text">${card.html}</p>
          </div>
        </article>`;
}

function formatBridgeHtml(label) {
  const words = String(label || '').trim().split(/\s+/);
  if (words.length === 2) return `${escHtml(words[0])}<br/>${escHtml(words[1])}`;
  if (words.length >= 3) {
    const mid = Math.ceil(words.length / 2);
    return `${escHtml(words.slice(0, mid).join(' '))}<br/>${escHtml(words.slice(mid).join(' '))}`;
  }
  return escHtml(label);
}

function renderSheetHtml(sheet) {
  const prefix = `l${sheet.num}`;
  const c = sheet.cards;
  const b = sheet.bridges;
  const vocabList = (sheet.vocab || []).slice(0, 3).map((v) =>
    Array.isArray(v) ? { term: v[0], def: v[1] } : { term: v.term, def: v.def || v.definition || '' }
  );
  const spokenTexts = [
    ...c.map((card) => String(card.spoken || card.html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()),
    String(sheet.spokenTakeaway || sheet.takeaway || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(sheet.ktBadge)}: ${escHtml(sheet.title)} | The History Revision Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&family=Lora:ital,wght@0,700;1,600&display=swap" rel="stylesheet">
  ${SHARED_STYLE}
</head>
<body data-self-fit="true">
  <main class="mat-container" id="visual-story-sheet">
    <header class="sheet-header">
      <div class="header-left">
        <div class="eyebrow-row">
          <span class="pill-kt">${escHtml(sheet.ktBadge)}</span>
          <span class="pill-dates">${escHtml(sheet.datesBadge)}</span>
          <span class="eyebrow-brand">1-Page Visual Story Sheet • Tap Any Stage to Listen</span>
        </div>
        <h1 class="sheet-title">${escHtml(sheet.title)}</h1>
      </div>
      <div class="header-actions no-print">
        <button type="button" class="action-btn primary-listen" id="btn-read-aloud" onclick="toggleFullStoryAudio()">
          <span id="read-icon">🎙️</span> <span id="read-label">Listen to Story</span>
        </button>
        <button type="button" class="action-btn stop-btn" id="btn-stop-aloud" onclick="stopAllAudio()" title="Stop Narration">
          ⏹️
        </button>
        <button type="button" class="action-btn" onclick="window.print()">
          🖨️ Print 1-Page A4
        </button>
      </div>
    </header>

    <section class="story-rows" aria-label="Five lesson stages and final outcome">
      <div class="story-row">${renderCard(c[0], 0, 'card-c1')}

        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-1">${formatBridgeHtml(b[0])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[1], 1, 'card-c2')}

        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-2">${formatBridgeHtml(b[1])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[2], 2, 'card-c3')}
      </div>

      <div class="row-turn-connector" aria-hidden="true">
        <svg class="row-turn-svg" viewBox="0 0 1087 22" preserveAspectRatio="none">
          <path d="M 930 0 L 930 11 L 156 11 L 156 20" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6 4" />
          <polygon points="156,22 150,15 162,15" fill="#d97706" />
        </svg>
        <span class="row-turn-badge" id="bridge-3">${escHtml(b[2])}</span>
      </div>

      <div class="story-row">${renderCard(c[3], 3, 'card-c4')}

        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-4">${formatBridgeHtml(b[3])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[4], 4, 'card-c5')}

        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-5">${formatBridgeHtml(b[4])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#1e3a8a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[5], 5, 'card-outcome')}
      </div>
    </section>

    <section class="bottom-strip">
      <div class="takeaway-box" id="takeaway-box" onclick="jumpToStage(6)" title="Tap to listen to the Big Story takeaway">
        <span class="strip-label">💡 The Big Story in One Sentence</span>
        <p class="takeaway-text">${escHtml(sheet.takeaway)}</p>
      </div>
      <div class="vocab-box" aria-label="Three key words">
        ${vocabList
          .map(
            (v) => `<div class="vocab-item">
          <strong>${escHtml(v.term)}</strong>
          ${escHtml(v.def)}
        </div>`
          )
          .join('\n        ')}
      </div>
    </section>

    <footer class="sheet-footer">
      <span>The History Revision Hub • GCSE Superpower Relations &amp; the Cold War, 1941–1991 (${escHtml(sheet.ktBadge)})</span>
      <span>Authentic Archival Sources: ${escHtml(sheet.provenanceNote || 'NARA, Wikimedia Commons & Declassified State Archives (Zero AI Imagery)')}</span>
    </footer>
  </main>

  <script>
    function fitSheetToViewport() {
      const sheet = document.getElementById('visual-story-sheet');
      if (!sheet) return;
      const pad = 16;
      const availW = Math.max(320, window.innerWidth - pad);
      const availH = Math.max(240, window.innerHeight - pad);
      const scale = Math.min(availW / 1123, availH / 794, 1.18);
      sheet.style.transform = \`scale(\${scale.toFixed(4)})\`;
    }
    window.addEventListener('resize', fitSheetToViewport);
    window.addEventListener('DOMContentLoaded', fitSheetToViewport);
    fitSheetToViewport();

    const SPOKEN_TEXTS = ${JSON.stringify(spokenTexts)};
    const AUDIO_STEPS = [
      { src: '/audio/visual_sheets/gcse_cold_war/${prefix}_s1.mp3', cardId: 'card-0', bridgeId: null, bridgeHoldMs: 0 },
      { src: '/audio/visual_sheets/gcse_cold_war/${prefix}_s2.mp3', cardId: 'card-1', bridgeId: 'bridge-1', bridgeHoldMs: 1400 },
      { src: '/audio/visual_sheets/gcse_cold_war/${prefix}_s3.mp3', cardId: 'card-2', bridgeId: 'bridge-2', bridgeHoldMs: 1400 },
      { src: '/audio/visual_sheets/gcse_cold_war/${prefix}_s4.mp3', cardId: 'card-3', bridgeId: 'bridge-3', bridgeHoldMs: 1600 },
      { src: '/audio/visual_sheets/gcse_cold_war/${prefix}_s5.mp3', cardId: 'card-4', bridgeId: 'bridge-4', bridgeHoldMs: 1400 },
      { src: '/audio/visual_sheets/gcse_cold_war/${prefix}_s6.mp3', cardId: 'card-5', bridgeId: 'bridge-5', bridgeHoldMs: 1400 },
      { src: '/audio/visual_sheets/gcse_cold_war/${prefix}_takeaway.mp3', cardId: 'takeaway-box', bridgeId: null, bridgeHoldMs: 0 },
    ];

    const player = new Audio();
    player.preload = 'none';
    let mode = 'idle';
    let currentStepIdx = 0;
    let bridgeTimer = null;

    function clearVisualHighlights() {
      if (bridgeTimer) { clearTimeout(bridgeTimer); bridgeTimer = null; }
      document.querySelectorAll('.story-card, .takeaway-box').forEach((el) => el.classList.remove('active-reading'));
      document.querySelectorAll('.arrow-pill, .row-turn-badge').forEach((el) => el.classList.remove('active-bridge'));
      document.querySelectorAll('.card-speak-btn').forEach((el) => el.classList.remove('playing'));
    }

    function updateHeaderButtons() {
      const btnMain = document.getElementById('btn-read-aloud');
      const icon = document.getElementById('read-icon');
      const label = document.getElementById('read-label');
      const btnStop = document.getElementById('btn-stop-aloud');
      if (!btnMain || !icon || !label || !btnStop) return;
      if (mode === 'playing') {
        btnMain.classList.add('speaking');
        icon.textContent = '⏸️';
        label.textContent = 'Pause Story';
        btnStop.style.display = 'inline-flex';
      } else if (mode === 'paused') {
        btnMain.classList.add('speaking');
        icon.textContent = '▶️';
        label.textContent = 'Resume Story';
        btnStop.style.display = 'inline-flex';
      } else {
        btnMain.classList.remove('speaking');
        icon.textContent = '🎙️';
        label.textContent = 'Listen to Story';
        btnStop.style.display = 'none';
      }
    }

    function applyStepHighlight(idx, skipBridgeLead) {
      clearVisualHighlights();
      const step = AUDIO_STEPS[idx];
      if (!step) return;
      const cardEl = document.getElementById(step.cardId);
      const cardBtns = document.querySelectorAll('.card-speak-btn');
      if (idx < cardBtns.length) cardBtns[idx].classList.add('playing');
      if (!skipBridgeLead && step.bridgeId) {
        const bEl = document.getElementById(step.bridgeId);
        if (bEl) bEl.classList.add('active-bridge');
        bridgeTimer = setTimeout(() => {
          if (bEl) bEl.classList.remove('active-bridge');
          if (cardEl) cardEl.classList.add('active-reading');
        }, step.bridgeHoldMs);
      } else if (cardEl) {
        cardEl.classList.add('active-reading');
      }
    }

    function speakFallback(idx) {
      if (!('speechSynthesis' in window)) { stopAllAudio(); return; }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(SPOKEN_TEXTS[idx] || '');
      u.lang = 'en-GB';
      u.rate = 0.96;
      u.onend = () => { if (mode === 'playing') playStepAt(idx + 1, false); };
      u.onerror = () => stopAllAudio();
      window.speechSynthesis.speak(u);
    }

    function playStepAt(idx, jumpedDirectly) {
      if (idx < 0 || idx >= AUDIO_STEPS.length) { stopAllAudio(); return; }
      currentStepIdx = idx;
      mode = 'playing';
      updateHeaderButtons();
      applyStepHighlight(idx, Boolean(jumpedDirectly));
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();

      player.onended = () => { if (mode === 'playing') playStepAt(idx + 1, false); };
      player.onerror = () => speakFallback(idx);
      player.src = AUDIO_STEPS[idx].src;
      player.play().catch(() => speakFallback(idx));
    }

    function jumpToStage(targetIdx) {
      if (mode === 'playing' && currentStepIdx === targetIdx) {
        player.pause();
        if ('speechSynthesis' in window) window.speechSynthesis.pause();
        mode = 'paused';
        updateHeaderButtons();
        return;
      }
      if (mode === 'paused' && currentStepIdx === targetIdx) {
        mode = 'playing';
        updateHeaderButtons();
        if ('speechSynthesis' in window && window.speechSynthesis.paused) window.speechSynthesis.resume();
        else player.play().catch(() => speakFallback(targetIdx));
        return;
      }
      playStepAt(targetIdx, true);
    }

    function toggleFullStoryAudio() {
      if (mode === 'playing') {
        player.pause();
        if ('speechSynthesis' in window) window.speechSynthesis.pause();
        mode = 'paused';
        updateHeaderButtons();
      } else if (mode === 'paused') {
        mode = 'playing';
        updateHeaderButtons();
        if ('speechSynthesis' in window && window.speechSynthesis.paused) window.speechSynthesis.resume();
        else player.play().catch(() => speakFallback(currentStepIdx));
      } else {
        playStepAt(0, false);
      }
    }

    function stopAllAudio() {
      player.pause();
      player.currentTime = 0;
      player.onended = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      mode = 'idle';
      currentStepIdx = 0;
      clearVisualHighlights();
      updateHeaderButtons();
    }

    window.addEventListener('beforeunload', stopAllAudio);
  </script>
</body>
</html>
`;
}

function main() {
  const pubDir = path.join(ROOT, 'public', 'units', 'gcse_cold_war', 'visual_sheets');
  const srcDir = path.join(ROOT, 'units', 'gcse_cold_war', 'visual_sheets');
  fs.mkdirSync(pubDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });

  const manifestEntries = [];
  for (let i = 0; i < unitData.lessons.length; i++) {
    const lesson = unitData.lessons[i];
    const sheet = { ...lesson.visual_story_sheet };
    sheet.num = String(i + 1).padStart(2, '0');
    sheet.lessonId = lesson.id;
    for (const card of sheet.cards) {
      if (card.heading.length > 36) {
        card.heading = card.heading.slice(0, 35).trim();
      }
    }
    const fileName = `lesson_${sheet.num}_visual_story.html`;
    const html = renderSheetHtml(sheet);
    fs.writeFileSync(path.join(pubDir, fileName), html, 'utf8');
    fs.writeFileSync(path.join(srcDir, fileName), html, 'utf8');
    console.log(`✅ Built ${fileName} (${lesson.id} -> ${sheet.title})`);

    manifestEntries.push({
      unit: 'gcse_cold_war',
      lessonId: lesson.id,
      slug: sheet.slug || `gcse_cw_l${sheet.num}_visual_story_sheet`,
      title: `${sheet.title} (${sheet.datesBadge})`,
      topic: sheet.topicLabel || lesson.title,
      type: 'visual_story_sheet',
      aspect: 'landscape',
      image: '',
      thumbUrl: sheet.thumbUrl || lesson.card_image,
      interactiveUrl: `/units/gcse_cold_war/visual_sheets/${fileName}`,
      keyPoints: sheet.cards.map((c) => `${c.badge} (${c.date}): ${c.heading} — ${c.stat}`),
    });
  }

  const manifestPath = path.join(ROOT, 'public', 'data', 'infographics_manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.gcse_cold_war = manifestEntries;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`📦 Updated infographics_manifest.json with ${manifestEntries.length} gcse_cold_war Visual Story Sheets.`);
}

main();
