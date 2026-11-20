/**
 * Game 5: 60s Boss Sprint ("Beat the Examiner" Time-Attack Retrieval)
 * 60-second high-tempo specification recall. 3-answer streaks grant +4s bonus time;
 * wrong answers trigger a 1.2s cooldown flash + Weak-Spot logging.
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

  let destroyed = false;
  let timerInterval = null;
  let phase = 'READY'; // READY | LIVE | OVER
  let timeLeft = 60;
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
    timeLeft = 60;
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
        timeLeft = Math.min(90, timeLeft + 4);
        arcadeAudio.levelUp();
        feedbackBanner = `<div class="tlb-banner ok">⚡ <strong>${streak}-STREAK TIME BONUS! +4s</strong> &amp; +${pts} pts!</div>`;
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
      feedbackBanner = `<div class="tlb-banner err">❌ Buzzer Freeze! Answer: <strong>${currentQ.a}</strong>${currentQ.explanation ? ` — ${currentQ.explanation}` : ''}</div>`;
      renderLive(idx);
      setTimeout(() => {
        if (destroyed || phase !== 'LIVE') return;
        cooldownLocked = false;
        loadNextQ();
      }, 1250);
    }
  }

  function renderReady() {
    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.8rem;margin-bottom:6px;">⚡</div>
        <h3>60-Second Boss Sprint</h3>
        <p style="max-width:520px;margin:0 auto 16px;color:#cbd5e1;font-size:0.94rem;line-height:1.55;">
          Race the 60-second clock across rapid-fire specification stems. Every <strong>3-answer streak adds +4 seconds</strong> to your clock! Use mouse/tap or keys <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd>.
        </p>
        <div class="arcade-gameover-stats">
          <div><span>Question Bank</span><strong>${pool.length} Stems</strong></div>
          <div><span>Personal Best</span><strong>${pb}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="bsp-start-btn">
          <i class="fa-solid fa-bolt"></i> Start 60s Countdown
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

        ${feedbackBanner}

        <div class="bsp-card ${cooldownLocked ? 'frozen' : ''}">
          <div class="bsp-topic">${currentQ.source || 'Rapid Specification Check'}</div>
          <h3 class="bsp-question">${currentQ.q}</h3>
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
    pb = best;
    if (correctCount > 0) {
    }
    const acc = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.8rem;margin-bottom:6px;">${isNewBest ? '🏆' : '⚡'}</div>
        <h3>${isNewBest ? 'New Boss Sprint Record!' : 'Buzzer Sounded — Time Up!'}</h3>
        <div class="arcade-gameover-stats">
          <div><span>Final Score</span><strong>${score}</strong></div>
          <div><span>Correct Answers</span><strong>${correctCount} (${acc}%)</strong></div>
          <div><span>Best Streak</span><strong>${bestStreak}🔥</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="bsp-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Run Another 60s Sprint
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
