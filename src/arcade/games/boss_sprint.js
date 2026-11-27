/**
 * Game 5: 60s Boss Sprint ("Beat the Examiner" Time-Attack Retrieval)
 * Single-screen 100dvh Zero-Jump layout: compact clock/score strip, reserved feedback slot,
 * fixed-min-height question slot, and 4 pinned >= 50px thumb option buttons (CLS = 0).
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';
import { recordQuestionResult } from '../../storage.js';

export function mountBossSprint(stageEl, pools, ctx) {
  const pool = pools.sprintPool || [];
  if (pool.length === 0) {
    stageEl.innerHTML = `<div class="arcade-empty">No sprint questions available in this selection.</div>`;
    return () => {};
  }

  const isKs2 = String(ctx.unitId || '').toLowerCase().startsWith('ks2_');
  const SPRINT_DURATION = isKs2 ? 90 : 60;
  const BONUS_SECS = isKs2 ? 5 : 4;
  let destroyed = false;
  let timerInterval = null;
  let phase = 'READY'; // READY | LIVE | OVER
  let timeLeft = SPRINT_DURATION;
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let answeredCount = 0;
  let correctCount = 0;
  let cooldownLocked = false;
  let deck = [];
  let currentQ = null;
  let shuffledOpts = [];
  let feedbackBanner = '';
  let pb = getArcadePersonalBest(ctx.unitId, 'sprint', ctx.scope);

  function stopClock() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startSprint() {
    arcadeAudio.ensureContext();
    arcadeAudio.levelUp();
    phase = 'LIVE';
    timeLeft = SPRINT_DURATION;
    score = 0;
    streak = 0;
    bestStreak = 0;
    answeredCount = 0;
    correctCount = 0;
    cooldownLocked = false;
    feedbackBanner = '';
    deck = shuffleList(pool);
    loadNextQ();

    stopClock();
    timerInterval = setInterval(() => {
      if (destroyed || phase !== 'LIVE') return;
      timeLeft -= 1;
      const clockEl = stageEl.querySelector('#bsp-clock');
      if (clockEl) {
        clockEl.textContent = `${timeLeft}s`;
        clockEl.style.color = timeLeft <= 10 ? '#f87171' : '#38bdf8';
      }
      if (timeLeft <= 5 && timeLeft > 0) arcadeAudio.tick();
      if (timeLeft <= 0) {
        stopClock();
        finishSprint();
      }
    }, 1000);
  }

  function loadNextQ() {
    if (deck.length === 0) deck = shuffleList(pool);
    currentQ = deck.pop();
    shuffledOpts = shuffleList(currentQ.options);
    renderLive();
  }

  function chooseOption(idx) {
    if (phase !== 'LIVE' || cooldownLocked || !currentQ) return;
    const chosen = shuffledOpts[idx];
    if (!chosen) return;

    answeredCount++;
    const isCorrect = chosen.toLowerCase() === currentQ.a.toLowerCase();

    if (isCorrect) {
      correctCount++;
      streak++;
      if (streak > bestStreak) bestStreak = streak;
      const mult = Math.min(5, 1 + Math.floor(streak / 3));
      const pts = 100 * mult;
      score += pts;
      recordQuestionResult(currentQ.id, true, currentQ, ctx.unitId);

      if (streak > 0 && streak % 3 === 0) {
        timeLeft = Math.min(isKs2 ? 120 : 90, timeLeft + BONUS_SECS);
        arcadeAudio.levelUp();
        feedbackBanner = `<div class="tlb-banner ok">⚡ <strong>${streak}-IN-A-ROW BONUS! +${BONUS_SECS}s</strong> &amp; +${pts} pts!</div>`;
      } else {
        arcadeAudio.correct();
        feedbackBanner = `<div class="tlb-banner ok">✅ Correct! +${pts} pts (${mult}x)</div>`;
      }
      loadNextQ();
    } else {
      streak = 0;
      cooldownLocked = true;
      arcadeAudio.wrong();
      recordQuestionResult(currentQ.id, false, currentQ, ctx.unitId);
      feedbackBanner = `<div class="tlb-banner err">${isKs2 ? '💡 Answer:' : '❌ Freeze! Answer:'} <strong>${currentQ.a}</strong>${currentQ.explanation ? ` — ${currentQ.explanation}` : ''}</div>`;
      renderLive(idx);
      setTimeout(() => {
        if (destroyed || phase !== 'LIVE') return;
        cooldownLocked = false;
        loadNextQ();
      }, isKs2 ? 900 : 1250);
    }
  }

  function renderReady() {
    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.6rem;margin-bottom:6px;">⚡</div>
        <h3>${isKs2 ? '90-Second Clock Challenge' : '60-Second Boss Sprint'}</h3>
        <p style="max-width:520px;margin:0 auto 16px;color:#cbd5e1;font-size:0.92rem;line-height:1.55;">
          ${isKs2 ? `Answer as many history questions as you can in ${SPRINT_DURATION} seconds! Every <strong>3 right in a row adds +${BONUS_SECS} seconds</strong> to your clock.` : 'Race the 60-second clock across rapid-fire specification stems. Every <strong>3-answer streak adds +4 seconds</strong> to your clock!'}
        </p>
        <div class="arcade-gameover-stats">
          <div><span>Question Bank</span><strong>${pool.length} ${isKs2 ? 'Questions' : 'Stems'}</strong></div>
          <div><span>Personal Best</span><strong>${pb}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="bsp-start-btn">
          <i class="fa-solid fa-bolt"></i> Start ${SPRINT_DURATION}s Challenge
        </button>
      </div>
    `;
    stageEl.querySelector('#bsp-start-btn')?.addEventListener('click', startSprint);
  }

  function renderLive(wrongIdx = -1) {
    if (!currentQ) return;
    stageEl.innerHTML = `
      <div class="bsp-wrap">
        <div class="tlb-hud">
          <div class="tlb-stat"><span>Clock</span><strong id="bsp-clock" style="color:${timeLeft <= 10 ? '#f87171' : '#38bdf8'};">${timeLeft}s</strong></div>
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Streak</span><strong class="amber">${streak}🔥</strong></div>
          <div class="tlb-stat"><span>Hits</span><strong class="green">${correctCount}/${answeredCount}</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <div class="bsp-feedback-slot" role="status" aria-live="polite">
          ${feedbackBanner || `<div class="bsp-feedback-idle">⚡ Every 3-in-a-row adds +${BONUS_SECS}s bonus time!</div>`}
        </div>

        <div class="bsp-card ${cooldownLocked && !isKs2 ? 'frozen' : ''}">
          <div class="bsp-question-slot">
            <div class="bsp-topic">${currentQ.source || (isKs2 ? 'History Quiz Check' : 'Rapid Specification Check')}</div>
            <h3 class="bsp-question">${currentQ.q}</h3>
          </div>
          <div class="bsp-options">
            ${shuffledOpts
              .map((opt, idx) => {
                const isRightReveal = cooldownLocked && opt.toLowerCase() === currentQ.a.toLowerCase();
                const isWrongPick = cooldownLocked && idx === wrongIdx;
                return `
                  <button type="button" class="bsp-opt-btn ${isRightReveal ? 'right' : ''} ${isWrongPick ? 'wrong' : ''}" data-idx="${idx}" ${cooldownLocked ? 'disabled' : ''}>
                    <span class="bsp-key">${idx + 1}</span>
                    <span>${opt}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    stageEl.querySelectorAll('.bsp-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => chooseOption(parseInt(btn.dataset.idx, 10)));
    });
  }

  function finishSprint() {
    phase = 'OVER';
    arcadeAudio.gameOver();
    const { isNewBest, best } = saveArcadePersonalBest(ctx.unitId, 'sprint', ctx.scope, score);
    ctx.onRoundComplete?.();
    pb = best;
    const acc = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.6rem;margin-bottom:6px;">${isNewBest ? '🏆' : '⚡'}</div>
        <h3>${isNewBest ? 'New Boss Sprint Record!' : 'Buzzer Sounded — Time Up!'}</h3>
        <div class="arcade-gameover-stats">
          <div><span>Final Score</span><strong>${score}</strong></div>
          <div><span>Correct</span><strong>${correctCount} (${acc}%)</strong></div>
          <div><span>Best Streak</span><strong>${bestStreak}🔥</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="bsp-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Play Another ${SPRINT_DURATION}s Round
        </button>
      </div>
    `;
    stageEl.querySelector('#bsp-replay-btn')?.addEventListener('click', startSprint);
  }

  const onKeyDown = (e) => {
    if (phase !== 'LIVE' || cooldownLocked) return;
    const tag = (e.target?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      if (idx < shuffledOpts.length) {
        e.preventDefault();
        chooseOption(idx);
      }
    }
  };
  window.addEventListener('keydown', onKeyDown);

  renderReady();

  return () => {
    destroyed = true;
    stopClock();
    window.removeEventListener('keydown', onKeyDown);
  };
}
