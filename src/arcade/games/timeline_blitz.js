/**
 * Game 2: Timeline Blitz ("Before / Between / After" Chronological Streak)
 * 2-Column Chronology Command Table + Connected Golden Spine with Year-Aware Insertion Nodes
 * and zero-truncation complete historical sentences.
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';
import { addXp, recordQuestionResult } from '../../storage.js';

export function mountTimelineBlitz(stageEl, pools, ctx) {
  const rawPool = pools.timelinePool || [];
  if (rawPool.length < 3) {
    stageEl.innerHTML = `<div class="arcade-empty">Not enough dated milestones in this selection for Timeline Blitz. Switch scope to "Full Unit Syllabus".</div>`;
    return () => {};
  }

  let destroyed = false;
  let timerInterval = null;
  let chillMode = false;

  let score = 0;
  let streak = 0;
  let lives = 3;
  let placedChain = [];
  let expandedCardIds = new Set();
  let drawDeck = [];
  let activeCard = null;
  let timeLeft = 16;
  let roundLocked = false;
  let statusBanner = '';
  let pb = getArcadePersonalBest(ctx.unitId, 'timeline', ctx.scope);

  function buildFreshDeck() {
    const shuffled = shuffleList(rawPool);
    const seenNumeric = new Set();
    const clean = [];
    shuffled.forEach((m) => {
      if (!seenNumeric.has(m.numeric)) {
        seenNumeric.add(m.numeric);
        clean.push(m);
      }
    });
    return clean;
  }

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    clearTimer();
    if (chillMode) return;
    timeLeft = Math.max(9, 16 - Math.floor(placedChain.length / 3));
    timerInterval = setInterval(() => {
      if (destroyed || roundLocked) return;
      timeLeft -= 1;
      const timerEl = stageEl.querySelector('#tlb-timer-val');
      const barEl = stageEl.querySelector('#tlb-timer-bar');
      if (timerEl) timerEl.textContent = `${timeLeft}s`;
      if (barEl) barEl.style.width = `${Math.max(0, (timeLeft / 16) * 100)}%`;
      if (timeLeft <= 3 && timeLeft > 0) arcadeAudio.tick();
      if (timeLeft <= 0) {
        clearTimer();
        handleSlotChoice(-1, true);
      }
    }, 1000);
  }

  function startNewGame() {
    arcadeAudio.ensureContext();
    arcadeAudio.levelUp();
    score = 0;
    streak = 0;
    lives = 3;
    roundLocked = false;
    statusBanner = '';
    expandedCardIds = new Set();
    drawDeck = buildFreshDeck();
    const anchor = drawDeck.pop();
    placedChain = [{ ...anchor, justPlaced: true, wasWrong: false }];
    dealNextCard();
  }

  function dealNextCard() {
    if (lives <= 0 || drawDeck.length === 0) {
      renderGameOver(drawDeck.length === 0 && lives > 0);
      return;
    }
    roundLocked = false;
    activeCard = drawDeck.pop();
    renderBoard();
    startTimer();
  }

  function isValidPlacement(card, slotIdx) {
    const prev = slotIdx > 0 ? placedChain[slotIdx - 1] : null;
    const next = slotIdx < placedChain.length ? placedChain[slotIdx] : null;
    const afterPrev = !prev || card.numeric >= prev.numeric;
    const beforeNext = !next || card.numeric <= next.numeric;
    return afterPrev && beforeNext;
  }

  function handleSlotChoice(slotIdx, timedOut = false) {
    if (roundLocked || !activeCard) return;
    roundLocked = true;
    clearTimer();

    const correct = !timedOut && isValidPlacement(activeCard, slotIdx);
    placedChain.forEach((c) => {
      c.justPlaced = false;
      c.wasWrong = false;
    });

    let trueIdx = placedChain.findIndex((c) => activeCard.numeric < c.numeric);
    if (trueIdx === -1) trueIdx = placedChain.length;

    placedChain.splice(trueIdx, 0, {
      ...activeCard,
      justPlaced: true,
      wasWrong: !correct,
    });

    if (correct) {
      arcadeAudio.correct();
      streak++;
      const bonus = chillMode ? 100 : 120 + timeLeft * 8 + streak * 25;
      score += bonus;
      statusBanner = `<div class="tlb-banner ok">✅ Locked in <strong>${activeCard.dateDisplay}</strong> — ${activeCard.title} (+${bonus} pts • ${streak}🔥 Streak)</div>`;
      recordQuestionResult(
        activeCard.id,
        true,
        {
          id: activeCard.id,
          q: `When did "${activeCard.title}" occur?`,
          a: activeCard.dateDisplay,
          source: activeCard.lessonTitle,
          explanation: `${activeCard.dateDisplay}: ${activeCard.title}`,
        },
        ctx.unitId,
      );
    } else {
      arcadeAudio.wrong();
      lives--;
      streak = 0;
      statusBanner = `<div class="tlb-banner err">${timedOut ? '⏱️ Time Up!' : '❌ Chronology Slip!'} <strong>${activeCard.title}</strong> occurred in <strong>${activeCard.dateDisplay}</strong> (placed on spine).</div>`;
      recordQuestionResult(
        activeCard.id,
        false,
        {
          id: activeCard.id,
          q: `When did "${activeCard.title}" occur?`,
          a: activeCard.dateDisplay,
          source: activeCard.lessonTitle,
          explanation: `${activeCard.dateDisplay}: ${activeCard.title} — ${activeCard.detail}`,
        },
        ctx.unitId,
      );
    }

    activeCard = null;
    renderBoard();
    setTimeout(() => {
      if (!destroyed) dealNextCard();
    }, correct ? 950 : 1750);
  }

  function formatYearAwareSlotLabel(slotIdx) {
    if (placedChain.length === 0) return 'Place on Timeline';
    if (slotIdx === 0) return `Before ${placedChain[0].dateDisplay}`;
    if (slotIdx === placedChain.length) {
      return `After ${placedChain[placedChain.length - 1].dateDisplay}`;
    }
    return `${placedChain[slotIdx - 1].dateDisplay} – ${placedChain[slotIdx].dateDisplay}`;
  }

  function renderSlotButton(slotIdx) {
    if (!activeCard || roundLocked) return '';
    const keyNum = slotIdx < 9 ? `<kbd>${slotIdx + 1}</kbd>` : '';
    const label = formatYearAwareSlotLabel(slotIdx);
    return `
      <button type="button" class="tlb-slot-btn" data-slot="${slotIdx}">
        <i class="fa-solid fa-circle-plus"></i> <span>${label}</span> ${keyNum}
      </button>
    `;
  }

  function renderBoard() {
    const hearts = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
    stageEl.innerHTML = `
      <div class="tlb-wrap">
        <div class="tlb-hud">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Chain</span><strong class="green">${placedChain.length} Events</strong></div>
          <div class="tlb-stat"><span>Streak</span><strong class="amber">${streak}🔥</strong></div>
          <div class="tlb-stat"><span>Lives</span><strong>${hearts}</strong></div>
          <div class="tlb-stat">
            <span>Clock</span>
            <strong id="tlb-timer-val">${chillMode ? '∞ Chill' : `${timeLeft}s`}</strong>
          </div>
          <button type="button" class="tlb-chill-btn ${chillMode ? 'active' : ''}" id="tlb-chill-toggle" title="Toggle untimed accessibility mode">
            <i class="fa-solid ${chillMode ? 'fa-mug-hot' : 'fa-bolt'}"></i> ${chillMode ? 'Chill Mode: ON' : 'Timed Blitz'}
          </button>
        </div>

        ${statusBanner}

        <div class="tlb-board-grid">
          <!-- LEFT COLUMN: Sticky Mystery Event Collector Card -->
          <div class="tlb-command-col">
            ${
              activeCard
                ? `
              <div class="tlb-deal-card">
                ${!chillMode ? `<div class="tlb-fuse-track"><div class="tlb-fuse-fill" id="tlb-timer-bar" style="width:${Math.max(0, (timeLeft / 16) * 100)}%;"></div></div>` : ''}
                <div class="tlb-deal-eyebrow">
                  <span><i class="fa-solid fa-hourglass-half"></i> MYSTERY TURNING POINT</span>
                  <span class="tlb-deal-lesson">${activeCard.lessonTitle}</span>
                </div>
                <h3 class="tlb-deal-title">${activeCard.title}</h3>
                ${activeCard.detail ? `<p class="tlb-deal-detail">${activeCard.detail}</p>` : ''}
                <div class="tlb-deal-footer">
                  <i class="fa-solid fa-hand-point-right" style="color:#38bdf8;"></i>
                  <span>Select the matching year gap on the timeline spine (or press <kbd>1</kbd>–<kbd>9</kbd>).</span>
                </div>
              </div>
            `
                : `
              <div class="tlb-deal-card" style="opacity:0.85;text-align:center;padding:28px 18px;">
                <div style="font-size:1.8rem;margin-bottom:6px;">⏳</div>
                <strong style="color:#fde047;">Dealing Next Turning Point...</strong>
              </div>
            `
            }
          </div>

          <!-- RIGHT COLUMN: Connected Golden Chronology Spine -->
          <div class="tlb-spine-panel">
            <div class="tlb-rail-label">
              <span><i class="fa-solid fa-arrow-up"></i> EARLIEST IN HISTORY</span>
              <span>Tap any event to expand notes</span>
            </div>

            <div class="tlb-rail">
              ${renderSlotButton(0)}
              ${placedChain
                .map((card, idx) => {
                  const showDetail =
                    card.justPlaced || expandedCardIds.has(card.id) || placedChain.length <= 2;
                  return `
                    <div class="tlb-anchor-card ${card.justPlaced ? (card.wasWrong ? 'wrong-reveal' : 'fresh-lock') : ''}" data-card-id="${card.id}" title="Click to toggle full event notes">
                      <span class="tlb-date-pill">${card.dateDisplay}</span>
                      <div class="tlb-anchor-body">
                        <div class="tlb-anchor-head">
                          <strong>${card.title}</strong>
                          ${card.detail ? `<i class="fa-solid ${showDetail ? 'fa-chevron-up' : 'fa-circle-info'}" style="font-size:0.72rem;color:#64748b;flex-shrink:0;"></i>` : ''}
                        </div>
                        ${card.detail && showDetail ? `<span class="tlb-detail-text">${card.detail}</span>` : ''}
                      </div>
                    </div>
                    ${renderSlotButton(idx + 1)}
                  `;
                })
                .join('')}
            </div>

            <div class="tlb-rail-label bottom">
              <span><i class="fa-solid fa-arrow-down"></i> LATEST IN HISTORY</span>
              <span>Personal Best: ${Math.max(pb, score)}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    stageEl.querySelector('#tlb-chill-toggle')?.addEventListener('click', () => {
      chillMode = !chillMode;
      if (chillMode) clearTimer();
      else if (activeCard && !roundLocked) startTimer();
      renderBoard();
    });

    stageEl.querySelectorAll('.tlb-slot-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sIdx = parseInt(btn.dataset.slot, 10);
        handleSlotChoice(sIdx, false);
      });
    });

    stageEl.querySelectorAll('.tlb-anchor-card').forEach((cardEl) => {
      cardEl.addEventListener('click', () => {
        const cid = cardEl.dataset.cardId;
        if (expandedCardIds.has(cid)) expandedCardIds.delete(cid);
        else expandedCardIds.add(cid);
        renderBoard();
      });
    });
  }

  function renderGameOver(clearedAll) {
    clearTimer();
    if (clearedAll) arcadeAudio.levelUp();
    else arcadeAudio.gameOver();

    const { isNewBest, best } = saveArcadePersonalBest(ctx.unitId, 'timeline', ctx.scope, score);
    pb = best;
    if (placedChain.length > 1) {
      addXp(Math.min(120, (placedChain.length - 1) * 12), 'Timeline Blitz');
    }

    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.8rem;margin-bottom:6px;">${clearedAll ? '👑' : isNewBest ? '🏆' : '⏳'}</div>
        <h3>${clearedAll ? 'Entire Chronology Mastered!' : isNewBest ? 'New Timeline Record!' : 'Chronology Run Complete'}</h3>
        <div class="arcade-gameover-stats">
          <div><span>Score</span><strong>${score}</strong></div>
          <div><span>Timeline Chain</span><strong>${placedChain.length} Events</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="tlb-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Deal New Timeline
        </button>
      </div>
    `;
    stageEl.querySelector('#tlb-replay-btn')?.addEventListener('click', startNewGame);
  }

  const onKeyDown = (e) => {
    if (!activeCard || roundLocked) return;
    const tag = (e.target?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= placedChain.length + 1) {
      e.preventDefault();
      handleSlotChoice(num - 1, false);
    }
  };
  window.addEventListener('keydown', onKeyDown);

  startNewGame();

  return () => {
    destroyed = true;
    clearTimer();
    window.removeEventListener('keydown', onKeyDown);
  };
}
