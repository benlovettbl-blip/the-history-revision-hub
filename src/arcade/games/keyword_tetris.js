/**
 * Game 1: Keyword Stack ("History Tetris")
 * 4-lane retro-modern falling keyword blocks with Lock Zone, Shredder lanes,
 * Rubble pile-up, Gold Rubble-Clearing Bombs, keyboard + touch controls + direct lane-tap, and Weak-Spot logging.
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';
import { recordQuestionResult } from '../../storage.js';

export function mountKeywordTetris(stageEl, pools, ctx) {
  const pool = pools.tetrisPool || [];
  if (pool.length === 0) {
    stageEl.innerHTML = `<div class="arcade-empty">Not enough short keywords in this selection to launch Keyword Stack. Try switching scope to "Full Unit Syllabus".</div>`;
    return () => {};
  }

  const COLS = 4;
  const COL_W = 140;
  const CANVAS_W = COLS * COL_W; // 560
  const CANVAS_H = 540;
  const BLOCK_H = 54;
  const FLOOR_Y = 488;
  const CEILING_Y = 66;

  let animFrame = null;
  let destroyed = false;
  let gameState = 'READY'; // READY | PLAYING | PAUSED | OVER

  let score = 0;
  let streak = 0;
  let linesCleared = 0;
  let level = 1;
  let pb = getArcadePersonalBest(ctx.unitId, 'tetris', ctx.scope);

  // Rubble stacks per column: array of { label, color }
  let stacks = [[], [], [], []];
  let particles = [];
  let floatingTexts = [];
  let mistakes = [];

  let deck = [];
  let currentQuestion = null;
  let lockCol = 1;
  let blockQueue = [];
  let activeBlock = null;
  let displayX = 0;
  let softDrop = false;

  stageEl.innerHTML = `
    <div class="akt-wrap">
      <!-- Top Live Clue HUD -->
      <div class="akt-clue-banner" id="akt-clue-banner">
        <div class="akt-clue-top">
          <span class="akt-clue-badge" id="akt-clue-badge"><i class="fa-solid fa-crosshairs"></i> TARGET SPECIFICATION CLUE</span>
          <span class="akt-clue-topic" id="akt-clue-topic">Tap Start or Tap Any Lane</span>
        </div>
        <div class="akt-clue-text" id="akt-clue-text">
          Steer the <strong>matching keyword block</strong> into the glowing green <strong>LOCK ZONE</strong> lane. Steer wrong distractor blocks into any <strong>SHREDDER</strong> lane!
        </div>
      </div>

      <div class="akt-main-grid">
        <!-- Arcade Canvas Cabinet -->
        <div class="akt-cabinet">
          <div class="akt-hud-row">
            <div class="akt-hud-cell"><span class="akt-hud-lbl">Score</span><span class="akt-hud-val cyan" id="akt-score">0</span></div>
            <div class="akt-hud-cell"><span class="akt-hud-lbl">Combo</span><span class="akt-hud-val amber" id="akt-combo">1x</span></div>
            <div class="akt-hud-cell"><span class="akt-hud-lbl">Locked</span><span class="akt-hud-val green" id="akt-lines">0</span></div>
            <div class="akt-hud-cell"><span class="akt-hud-lbl">Speed</span><span class="akt-hud-val purple" id="akt-level">Lv.1</span></div>
            <div class="akt-hud-cell"><span class="akt-hud-lbl">Best</span><span class="akt-hud-val" id="akt-pb">${pb}</span></div>
          </div>

          <div class="akt-canvas-wrap">
            <canvas id="akt-canvas" width="${CANVAS_W}" height="${CANVAS_H}"></canvas>

            <!-- Start / Game Over Overlay -->
            <div class="akt-overlay" id="akt-overlay">
              <div class="akt-overlay-card" id="akt-overlay-card">
                <div style="font-size: 2rem; margin-bottom: 4px;">🧱</div>
                <h3>Keyword Stack</h3>
                <p>Land <strong>correct terms</strong> in the green <strong>LOCK ZONE</strong> and send <strong>distractors</strong> into the <strong>SHREDDERS</strong>. Tap a lane directly to steer &amp; tap again to drop!</p>
                <div class="akt-key-hints">
                  <span><kbd>←</kbd> <kbd>→</kbd> Steer</span>
                  <span><kbd>↓</kbd> Fast Drop</span>
                  <span><kbd>Space</kbd> Slam Drop</span>
                </div>
                <button type="button" class="arcade-btn-primary" id="akt-start-btn">
                  <i class="fa-solid fa-play"></i> Launch Keyword Stack
                </button>
              </div>
            </div>
          </div>

          <!-- Compact 46px Thumb D-Pad & Mouse Controls -->
          <div class="akt-controls-bar">
            <button type="button" class="akt-ctrl-btn" id="akt-btn-left" aria-label="Move Left">
              ◀ <span class="akt-ctrl-txt">Left</span>
            </button>
            <button type="button" class="akt-ctrl-btn slam" id="akt-btn-slam" aria-label="Drop Block">
              ▼ Drop
            </button>
            <button type="button" class="akt-ctrl-btn" id="akt-btn-pause" aria-label="Pause Game">
              <i class="fa-solid fa-pause"></i>
            </button>
            <button type="button" class="akt-ctrl-btn" id="akt-btn-right" aria-label="Move Right">
              <span class="akt-ctrl-txt">Right</span> ▶
            </button>
          </div>
        </div>

        <!-- Side Tactical Feed -->
        <div class="akt-side-panel">
          <div class="akt-side-box">
            <h4><i class="fa-solid fa-bolt" style="color:#f59e0b;"></i> Live Telemetry</h4>
            <div id="akt-last-feedback" class="akt-feedback-box">
              Tap a lane on the board to move there — tap the aligned lane to drop!
            </div>
          </div>
          <div class="akt-side-box akt-rules-box">
            <h4><i class="fa-solid fa-shield-halved" style="color:#10b981;"></i> Scoring Rules</h4>
            <ul class="akt-rules-list">
              <li><strong style="color:#34d399;">Lock Correct Term:</strong> +150 × Combo</li>
              <li><strong style="color:#38bdf8;">Shred Distractor:</strong> +45 pts</li>
              <li><strong style="color:#fbbf24;">💣 Gold Bomb (5-Streak):</strong> Vaporises 2 rows of Rubble!</li>
              <li><strong style="color:#f87171;">Misplaced Block:</strong> Locks as Rubble &amp; logs Weak Spot</li>
            </ul>
          </div>
          <div class="akt-side-box" id="akt-recap-box" style="display:none;">
            <h4><i class="fa-solid fa-rotate" style="color:#f87171;"></i> Missed Terms Logged</h4>
            <div id="akt-mistakes-list" class="akt-mistakes-list"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvas = stageEl.querySelector('#akt-canvas');
  const c = canvas.getContext('2d');
  const overlay = stageEl.querySelector('#akt-overlay');
  const overlayCard = stageEl.querySelector('#akt-overlay-card');
  const clueBadge = stageEl.querySelector('#akt-clue-badge');
  const clueTopic = stageEl.querySelector('#akt-clue-topic');
  const clueText = stageEl.querySelector('#akt-clue-text');
  const feedbackEl = stageEl.querySelector('#akt-last-feedback');

  function updateHud() {
    const mult = Math.min(8, 1 + Math.floor(streak / 2));
    stageEl.querySelector('#akt-score').textContent = score;
    stageEl.querySelector('#akt-combo').textContent = `${mult}x`;
    stageEl.querySelector('#akt-lines').textContent = linesCleared;
    stageEl.querySelector('#akt-level').textContent = `Lv.${level}`;
    stageEl.querySelector('#akt-pb').textContent = Math.max(pb, score);
  }

  function spawnParticles(x, y, color, count = 18) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.7) * 7,
        size: 2.5 + Math.random() * 4,
        alpha: 1,
        color,
      });
    }
  }

  function spawnFloatingText(x, y, text, color) {
    floatingTexts.push({ x, y, text, color, alpha: 1 });
  }

  function setFeedback(html, border = '#334155') {
    if (!feedbackEl) return;
    feedbackEl.style.borderColor = border;
    feedbackEl.innerHTML = html;
  }

  function nextQuestionRound() {
    if (deck.length === 0) deck = shuffleList(pool);
    currentQuestion = deck.pop();
    lockCol = Math.floor(Math.random() * COLS);

    const isGoldRound = streak > 0 && streak % 5 === 0;
    clueBadge.innerHTML = isGoldRound
      ? '<i class="fa-solid fa-bomb"></i> 💣 GOLD BOMB — CLEAR 2 ROWS!'
      : '<i class="fa-solid fa-crosshairs"></i> TARGET CLUE';
    clueBadge.style.background = isGoldRound ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.18)';
    clueBadge.style.color = isGoldRound ? '#fde047' : '#34d399';
    clueTopic.textContent = currentQuestion.source || 'Unit Vocabulary';
    clueText.textContent = currentQuestion.q;

    const distractors = shuffleList(currentQuestion.distractorBlocks).slice(0, 2);
    blockQueue = shuffleList([
      {
        text: currentQuestion.correctBlock,
        isCorrect: true,
        isGoldBomb: isGoldRound,
      },
      ...distractors.map((d) => ({
        text: d,
        isCorrect: false,
        isGoldBomb: false,
      })),
    ]);

    spawnNextBlock();
  }

  function spawnNextBlock() {
    if (blockQueue.length === 0) {
      nextQuestionRound();
      return;
    }
    const blockNum = 3 - blockQueue.length + 1;
    if (clueTopic && currentQuestion) {
      clueTopic.textContent = `${currentQuestion.source || 'Unit Vocabulary'} • ${blockNum}/3`;
    }
    const spec = blockQueue.shift();
    const startCol =
      !spec.isCorrect && Math.random() < 0.55 ? lockCol : Math.floor(Math.random() * COLS);

    activeBlock = {
      ...spec,
      col: startCol,
      y: 12,
    };
    displayX = startCol * COL_W;
  }

  function moveHoriz(delta) {
    if (gameState !== 'PLAYING' || !activeBlock) return;
    const nextCol = Math.max(0, Math.min(COLS - 1, activeBlock.col + delta));
    if (nextCol === activeBlock.col) return;
    const targetStackTop = FLOOR_Y - stacks[nextCol].length * BLOCK_H;
    if (activeBlock.y + BLOCK_H > targetStackTop + 6) return;
    activeBlock.col = nextCol;
    arcadeAudio.move();
  }

  function moveOrDropLane(tappedCol) {
    if (gameState !== 'PLAYING' || !activeBlock) return;
    const clampedCol = Math.max(0, Math.min(COLS - 1, tappedCol));
    if (clampedCol === activeBlock.col) {
      slamDrop();
      return;
    }
    const dir = clampedCol > activeBlock.col ? 1 : -1;
    let moved = false;
    while (activeBlock && activeBlock.col !== clampedCol) {
      const nextCol = activeBlock.col + dir;
      const targetStackTop = FLOOR_Y - stacks[nextCol].length * BLOCK_H;
      if (activeBlock.y + BLOCK_H > targetStackTop + 6) break;
      activeBlock.col = nextCol;
      moved = true;
    }
    if (moved) {
      arcadeAudio.move();
    }
  }

  function slamDrop() {
    if (gameState !== 'PLAYING' || !activeBlock) return;
    const col = activeBlock.col;
    const stackTop = FLOOR_Y - stacks[col].length * BLOCK_H;
    const distance = Math.max(0, stackTop - BLOCK_H - activeBlock.y);
    score += Math.round(distance * 0.08);
    activeBlock.y = stackTop - BLOCK_H;
    displayX = col * COL_W;
    arcadeAudio.drop();
    resolveLanding();
  }

  function addRubble(col, label) {
    stacks[col].push({ label });
    const stackTop = FLOOR_Y - stacks[col].length * BLOCK_H;
    if (stackTop <= CEILING_Y) {
      triggerGameOver();
    }
  }

  function resolveLanding() {
    if (!activeBlock || !currentQuestion) return;
    const col = activeBlock.col;
    const centerX = col * COL_W + COL_W / 2;
    const landY = activeBlock.y + BLOCK_H / 2;
    const inLockZone = col === lockCol;
    const mult = Math.min(8, 1 + Math.floor(streak / 2));

    if (activeBlock.isCorrect && inLockZone) {
      streak++;
      linesCleared++;
      level = Math.min(8, 1 + Math.floor(linesCleared / 4));
      const pts = 150 * mult + (activeBlock.isGoldBomb ? 200 : 0);
      score += pts;

      recordQuestionResult(currentQuestion.id, true, currentQuestion, ctx.unitId);

      if (activeBlock.isGoldBomb) {
        arcadeAudio.bomb();
        for (let cIdx = 0; cIdx < COLS; cIdx++) {
          stacks[cIdx].splice(Math.max(0, stacks[cIdx].length - 2), 2);
        }
        spawnParticles(CANVAS_W / 2, FLOOR_Y - 40, '#facc15', 38);
        spawnFloatingText(centerX, landY - 10, `💣 RUBBLE VAPORISED! +${pts}`, '#fde047');
        setFeedback(`💣 <strong>GOLD BOMB DETONATED!</strong> Cleared 2 rubble rows &amp; locked <strong>${currentQuestion.a}</strong>!`, '#f59e0b');
      } else {
        arcadeAudio.correct();
        if (stacks[col].length > 0) stacks[col].pop();
        spawnParticles(centerX, landY, '#10b981', 24);
        spawnFloatingText(centerX, landY, `+${pts} LOCKED!`, '#34d399');
        setFeedback(`✅ <strong>Locked: ${currentQuestion.a}</strong> (${mult}x Combo)`, '#10b981');
      }

      updateHud();
      activeBlock = null;
      nextQuestionRound();
      return;
    }

    if (!activeBlock.isCorrect && !inLockZone) {
      score += 45;
      arcadeAudio.shred();
      spawnParticles(centerX, landY, '#38bdf8', 12);
      spawnFloatingText(centerX, landY, `+45 SHREDDED`, '#38bdf8');
      setFeedback(`⚡ Shredded distractor <strong>${activeBlock.text}</strong> (+45 pts)`, '#0284c7');
      updateHud();
      activeBlock = null;
      spawnNextBlock();
      return;
    }

    arcadeAudio.wrong();
    streak = 0;
    recordQuestionResult(currentQuestion.id, false, currentQuestion, ctx.unitId);

    if (!mistakes.some((m) => m.a === currentQuestion.a)) {
      mistakes.push({ a: currentQuestion.a, explanation: currentQuestion.explanation });
    }

    const rubbleCol = inLockZone ? col : lockCol;
    const reasonText = activeBlock.isCorrect
      ? `❌ Oops! You shredded the correct answer (<strong>${currentQuestion.a}</strong>)!`
      : `❌ Rubble! <strong>${activeBlock.text}</strong> is a distractor — needed <strong>${currentQuestion.a}</strong>.`;

    setFeedback(`${reasonText}<br><span style="color:#94a3b8;font-size:0.78rem;">${currentQuestion.explanation}</span>`, '#ef4444');
    spawnParticles(centerX, landY, '#ef4444', 18);
    spawnFloatingText(centerX, landY, `RUBBLE!`, '#f87171');
    addRubble(rubbleCol, activeBlock.text);
    updateHud();

    if (gameState !== 'OVER') {
      activeBlock = null;
      if (inLockZone) {
        spawnNextBlock();
      } else {
        nextQuestionRound();
      }
    }
  }

  function triggerGameOver() {
    gameState = 'OVER';
    activeBlock = null;
    arcadeAudio.gameOver();
    const { isNewBest, best } = saveArcadePersonalBest(ctx.unitId, 'tetris', ctx.scope, score);
    ctx.onRoundComplete?.();
    pb = best;
    updateHud();

    if (mistakes.length > 0) {
      const recapBox = stageEl.querySelector('#akt-recap-box');
      const listEl = stageEl.querySelector('#akt-mistakes-list');
      if (recapBox && listEl) {
        recapBox.style.display = 'block';
        listEl.innerHTML = mistakes
          .slice(0, 6)
          .map((m) => `<div class="akt-mistake-item"><strong>${m.a}:</strong> ${m.explanation}</div>`)
          .join('');
      }
    }

    overlay.style.display = 'flex';
    overlayCard.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 4px;">${isNewBest ? '🏆' : '🧱'}</div>
      <h3>${isNewBest ? 'New Personal Best!' : 'Stack Reached Ceiling!'}</h3>
      <div class="arcade-gameover-stats">
        <div><span>Score</span><strong>${score}</strong></div>
        <div><span>Locked</span><strong>${linesCleared}</strong></div>
        <div><span>Best</span><strong>${best}</strong></div>
      </div>
      ${
        mistakes.length > 0
          ? `<p style="font-size:0.78rem;color:#fca5a5;margin:6px 0 10px;">${mistakes.length} missed term${mistakes.length === 1 ? '' : 's'} saved to Review Mistakes.</p>`
          : `<p style="font-size:0.78rem;color:#86efac;margin:6px 0 10px;">Zero rubble mistakes — flawless recall!</p>`
      }
      <button type="button" class="arcade-btn-primary" id="akt-restart-btn">
        <i class="fa-solid fa-rotate-right"></i> Play Again
      </button>
    `;
    overlayCard.querySelector('#akt-restart-btn')?.addEventListener('click', startGame);
  }

  function drawFittedBlockText(text, centerX, centerY, maxWidth) {
    c.save();
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    let fontSize = 13.5;
    c.font = `800 ${fontSize}px 'Outfit', 'Inter', sans-serif`;
    if (c.measureText(text).width <= maxWidth) {
      c.fillText(text, centerX, centerY);
      c.restore();
      return;
    }

    const words = text.split(/\s+/);
    if (words.length >= 2) {
      let bestSplit = 1;
      let bestDiff = Infinity;
      for (let i = 1; i < words.length; i++) {
        const l1 = words.slice(0, i).join(' ');
        const l2 = words.slice(i).join(' ');
        const diff = Math.abs(l1.length - l2.length);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestSplit = i;
        }
      }
      const line1 = words.slice(0, bestSplit).join(' ');
      const line2 = words.slice(bestSplit).join(' ');
      fontSize = 12;
      c.font = `800 ${fontSize}px 'Outfit', 'Inter', sans-serif`;
      while (
        (c.measureText(line1).width > maxWidth || c.measureText(line2).width > maxWidth) &&
        fontSize > 8.5
      ) {
        fontSize -= 0.5;
        c.font = `800 ${fontSize}px 'Outfit', 'Inter', sans-serif`;
      }
      const lineGap = fontSize * 0.62;
      c.fillText(line1, centerX, centerY - lineGap);
      c.fillText(line2, centerX, centerY + lineGap);
      c.restore();
      return;
    }

    while (c.measureText(text).width > maxWidth && fontSize > 8.5) {
      fontSize -= 0.5;
      c.font = `800 ${fontSize}px 'Outfit', 'Inter', sans-serif`;
    }
    c.fillText(text, centerX, centerY);
    c.restore();
  }

  function renderFrame() {
    c.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // 1. Background Lanes
    for (let col = 0; col < COLS; col++) {
      const x = col * COL_W;
      const isLock = col === lockCol;
      if (isLock) {
        const grad = c.createLinearGradient(x, 0, x, CANVAS_H);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.22)');
        c.fillStyle = grad;
        c.fillRect(x, 0, COL_W, CANVAS_H);
      }
      c.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, CANVAS_H);
      c.stroke();

      c.fillStyle = isLock ? 'rgba(16, 185, 129, 0.28)' : 'rgba(30, 41, 59, 0.85)';
      c.fillRect(x + 4, FLOOR_Y + 4, COL_W - 8, CANVAS_H - FLOOR_Y - 8);
      c.strokeStyle = isLock ? '#10b981' : '#475569';
      c.lineWidth = isLock ? 2 : 1;
      c.strokeRect(x + 4, FLOOR_Y + 4, COL_W - 8, CANVAS_H - FLOOR_Y - 8);

      c.fillStyle = isLock ? '#6ee7b7' : '#94a3b8';
      c.font = "800 10px 'Outfit', sans-serif";
      c.textAlign = 'center';
      c.fillText(isLock ? '🎯 LOCK ZONE' : '⚡ SHREDDER', x + COL_W / 2, FLOOR_Y + 27);
    }

    // Ceiling Danger Line
    c.save();
    c.setLineDash([6, 6]);
    c.strokeStyle = 'rgba(239, 68, 68, 0.55)';
    c.beginPath();
    c.moveTo(0, CEILING_Y);
    c.lineTo(CANVAS_W, CEILING_Y);
    c.stroke();
    c.fillStyle = 'rgba(248, 113, 113, 0.7)';
    c.font = "700 9.5px 'Inter', sans-serif";
    c.textAlign = 'right';
    c.fillText('DANGER CEILING', CANVAS_W - 8, CEILING_Y - 5);
    c.restore();

    // 2. Locked Rubble Stacks
    for (let col = 0; col < COLS; col++) {
      stacks[col].forEach((rubble, rIdx) => {
        const rx = col * COL_W + 5;
        const ry = FLOOR_Y - (rIdx + 1) * BLOCK_H + 2;
        c.fillStyle = '#334155';
        c.strokeStyle = '#64748b';
        c.lineWidth = 1.5;
        c.beginPath();
        c.roundRect(rx, ry, COL_W - 10, BLOCK_H - 4, 7);
        c.fill();
        c.stroke();
        c.fillStyle = '#cbd5e1';
        drawFittedBlockText(rubble.label, rx + (COL_W - 10) / 2, ry + (BLOCK_H - 4) / 2, COL_W - 20);
      });
    }

    // 3. Active Falling Block + Ghost Guide
    if (gameState === 'PLAYING' && activeBlock) {
      const baseSpeed = 0.88 + (level - 1) * 0.22;
      const vy = softDrop ? baseSpeed * 3.6 : baseSpeed;
      activeBlock.y += vy;

      const targetX = activeBlock.col * COL_W;
      displayX += (targetX - displayX) * 0.35;

      const stackTop = FLOOR_Y - stacks[activeBlock.col].length * BLOCK_H;

      c.save();
      c.strokeStyle = activeBlock.col === lockCol ? 'rgba(52, 211, 153, 0.4)' : 'rgba(148, 163, 184, 0.25)';
      c.setLineDash([4, 4]);
      c.strokeRect(targetX + 6, stackTop - BLOCK_H + 2, COL_W - 12, BLOCK_H - 4);
      c.restore();

      if (activeBlock.y + BLOCK_H >= stackTop) {
        activeBlock.y = stackTop - BLOCK_H;
        resolveLanding();
      } else {
        const bx = displayX + 5;
        const by = activeBlock.y;
        const isGold = activeBlock.isGoldBomb;

        c.save();
        c.shadowBlur = isGold ? 18 : 12;
        c.shadowColor = isGold ? 'rgba(250, 204, 21, 0.65)' : 'rgba(56, 189, 248, 0.45)';
        c.fillStyle = isGold ? '#854d0e' : '#0f172a';
        c.strokeStyle = isGold ? '#facc15' : '#38bdf8';
        c.lineWidth = 2.2;
        c.beginPath();
        c.roundRect(bx, by, COL_W - 10, BLOCK_H - 4, 8);
        c.fill();
        c.stroke();
        c.restore();

        c.fillStyle = isGold ? '#fef08a' : '#f8fafc';
        const prefix = isGold ? '💣 ' : '';
        drawFittedBlockText(
          prefix + activeBlock.text,
          bx + (COL_W - 10) / 2,
          by + (BLOCK_H - 4) / 2,
          COL_W - 18,
        );
      }
    }

    // 4. Particles & Floating Score Popups
    particles = particles.filter((p) => p.alpha > 0.03);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.alpha -= 0.03;
      c.save();
      c.globalAlpha = Math.max(0, p.alpha);
      c.fillStyle = p.color;
      c.beginPath();
      c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    });

    floatingTexts = floatingTexts.filter((ft) => ft.alpha > 0.03);
    floatingTexts.forEach((ft) => {
      ft.y -= 1.1;
      ft.alpha -= 0.022;
      c.save();
      c.globalAlpha = Math.max(0, ft.alpha);
      c.fillStyle = ft.color;
      c.font = "800 13px 'Outfit', sans-serif";
      c.textAlign = 'center';
      c.fillText(ft.text, ft.x, ft.y);
      c.restore();
    });

    if (gameState === 'PAUSED') {
      c.fillStyle = 'rgba(15, 23, 42, 0.78)';
      c.fillRect(0, 0, CANVAS_W, CANVAS_H);
      c.fillStyle = '#f8fafc';
      c.font = "800 24px 'Outfit', sans-serif";
      c.textAlign = 'center';
      c.fillText('PAUSED', CANVAS_W / 2, CANVAS_H / 2);
    }

    if (!destroyed) {
      animFrame = requestAnimationFrame(renderFrame);
    }
  }

  function startGame() {
    arcadeAudio.ensureContext();
    arcadeAudio.levelUp();
    score = 0;
    streak = 0;
    linesCleared = 0;
    level = 1;
    stacks = [[], [], [], []];
    mistakes = [];
    deck = shuffleList(pool);
    const recapBox = stageEl.querySelector('#akt-recap-box');
    if (recapBox) recapBox.style.display = 'none';
    overlay.style.display = 'none';
    gameState = 'PLAYING';
    updateHud();
    setFeedback('Tap any lane to move there — tap the aligned lane to drop!', '#38bdf8');
    nextQuestionRound();
  }

  function togglePause() {
    if (gameState === 'PLAYING') gameState = 'PAUSED';
    else if (gameState === 'PAUSED') gameState = 'PLAYING';
  }

  // Direct Tap-on-Canvas-Lane Support (pointerdown / touchstart)
  let lastCanvasPointerTs = 0;
  const handleCanvasTap = (clientX, e) => {
    if (gameState !== 'PLAYING' || !activeBlock) return;
    const now = Date.now();
    if (now - lastCanvasPointerTs < 90) return;
    lastCanvasPointerTs = now;
    if (e?.cancelable) e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = (clientX - rect.left) / rect.width;
    const col = Math.max(0, Math.min(COLS - 1, Math.floor(ratio * COLS)));
    moveOrDropLane(col);
  };

  canvas.addEventListener('pointerdown', (e) => {
    handleCanvasTap(e.clientX, e);
  });
  canvas.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches && e.touches[0]) {
        handleCanvasTap(e.touches[0].clientX, e);
      }
    },
    { passive: false },
  );

  // Controls
  stageEl.querySelector('#akt-start-btn')?.addEventListener('click', startGame);
  stageEl.querySelector('#akt-btn-left')?.addEventListener('click', () => moveHoriz(-1));
  stageEl.querySelector('#akt-btn-right')?.addEventListener('click', () => moveHoriz(1));
  stageEl.querySelector('#akt-btn-slam')?.addEventListener('click', slamDrop);
  stageEl.querySelector('#akt-btn-pause')?.addEventListener('click', togglePause);

  const onKeyDown = (e) => {
    if (gameState !== 'PLAYING' && gameState !== 'PAUSED') return;
    const tag = (e.target?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      moveHoriz(-1);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      moveHoriz(1);
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      softDrop = true;
    } else if (e.code === 'Space') {
      e.preventDefault();
      slamDrop();
    } else if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      togglePause();
    }
  };

  const onKeyUp = (e) => {
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      softDrop = false;
    }
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  animFrame = requestAnimationFrame(renderFrame);

  return () => {
    destroyed = true;
    if (animFrame) cancelAnimationFrame(animFrame);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}
