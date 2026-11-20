/**
 * Game 7: Fact or Fallacy ("Historical Mythbuster" Rapid Judgement)
 * Splices authentic specification facts with sneaky 1-detail distractor swaps.
 * Press ← FALLACY or → FACT to bust historical misconceptions!
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';
import { recordQuestionResult } from '../../storage.js';

export function mountFactOrFallacy(stageEl, pools, ctx) {
  const pool = pools.mythPool || [];
  if (pool.length === 0) {
    stageEl.innerHTML = `<div class="arcade-empty">No Fact or Fallacy cards available in this selection.</div>`;
    return () => {};
  }

  let deck = [];
  let currentCard = null;
  let score = 0;
  let streak = 0;
  let lives = 3;
  let bustedCount = 0;
  let awaitingNext = false;
  let lastOutcome = null; // { correct, explanation }
  let pb = getArcadePersonalBest(ctx.unitId, 'myth', ctx.scope);

  function startRun() {
    arcadeAudio.ensureContext();
    arcadeAudio.levelUp();
    deck = shuffleList(pool);
    score = 0;
    streak = 0;
    lives = 3;
    bustedCount = 0;
    awaitingNext = false;
    lastOutcome = null;
    drawCard();
  }

  function drawCard() {
    if (lives <= 0 || deck.length === 0) {
      renderEnd();
      return;
    }
    awaitingNext = false;
    lastOutcome = null;
    currentCard = deck.pop();
    render();
  }

  function judge(playerSaysFact) {
    if (awaitingNext || !currentCard) return;
    awaitingNext = true;
    const isCorrect = Boolean(playerSaysFact) === Boolean(currentCard.isFact);

    if (isCorrect) {
      streak++;
      bustedCount++;
      const mult = Math.min(5, 1 + Math.floor(streak / 3));
      const pts = 110 * mult;
      score += pts;
      arcadeAudio.correct();
      recordQuestionResult(currentCard.id, true, currentCard, ctx.unitId);
      lastOutcome = {
        correct: true,
        title: currentCard.isFact ? `✅ VERIFIED FACT (+${pts} pts)` : `💥 MYTH BUSTED! (+${pts} pts)`,
        explanation: currentCard.explanation,
      };
    } else {
      streak = 0;
      lives--;
      arcadeAudio.wrong();
      recordQuestionResult(currentCard.id, false, currentCard, ctx.unitId);
      lastOutcome = {
        correct: false,
        title: currentCard.isFact ? '❌ Actually TRUE Specification Fact!' : '❌ Caught by a Historical Trap!',
        explanation: currentCard.explanation,
      };
    }
    render();
  }

  function render() {
    if (!currentCard) return;
    const hearts = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
    const isQuizKind = currentCard.kind === 'quiz';

    stageEl.innerHTML = `
      <div class="fof-wrap">
        <div class="tlb-hud">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Streak</span><strong class="amber">${streak}🔥</strong></div>
          <div class="tlb-stat"><span>Cleared</span><strong class="green">${bustedCount}</strong></div>
          <div class="tlb-stat"><span>Lives</span><strong>${hearts}</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <div class="fof-card ${awaitingNext ? (lastOutcome?.correct ? 'verdict-ok' : 'verdict-err') : ''}">
          <div class="fof-eyebrow">
            <span><i class="fa-solid fa-scale-balanced"></i> ${currentCard.promptLabel || 'FACT OR HISTORICAL FALLACY?'}</span>
            <span>${currentCard.topic}</span>
          </div>

          ${
            isQuizKind
              ? `
            <div style="font-size: 1.12rem; font-weight: 700; color: #ffffff; line-height: 1.45; margin-bottom: 14px;">
              ${currentCard.headline}
            </div>
            <div style="background: rgba(56, 189, 248, 0.12); border: 1.5px solid rgba(56, 189, 248, 0.45); border-radius: 10px; padding: 12px 16px; font-size: 1.05rem; font-weight: 800; color: #bae6fd;">
              ${currentCard.claimText}
            </div>
          `
              : `
            <div class="fof-headline">${currentCard.headline}</div>
            <div class="fof-statement">
              <p>&ldquo;${currentCard.claimText}&rdquo;</p>
            </div>
          `
          }

          ${
            !awaitingNext
              ? `
            <div class="fof-btn-row">
              <button type="button" class="fof-judge-btn fallacy" id="fof-btn-fallacy">
                <i class="fa-solid fa-xmark"></i> FALLACY (Myth) <kbd>←</kbd>
              </button>
              <button type="button" class="fof-judge-btn fact" id="fof-btn-fact">
                <i class="fa-solid fa-check"></i> FACT (True) <kbd>→</kbd>
              </button>
            </div>
          `
              : `
            <div class="fof-outcome ${lastOutcome.correct ? 'ok' : 'err'}">
              <strong>${lastOutcome.title}</strong>
              <p>${lastOutcome.explanation}</p>
              <button type="button" class="arcade-btn-primary" id="fof-next-btn">
                ${lives <= 0 ? 'View Final Score' : 'Next Claim <kbd>Space</kbd>'} <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          `
          }
        </div>
      </div>
    `;

    stageEl.querySelector('#fof-btn-fallacy')?.addEventListener('click', () => judge(false));
    stageEl.querySelector('#fof-btn-fact')?.addEventListener('click', () => judge(true));
    stageEl.querySelector('#fof-next-btn')?.addEventListener('click', drawCard);
  }

  function renderEnd() {
    arcadeAudio.gameOver();
    const { isNewBest, best } = saveArcadePersonalBest(ctx.unitId, 'myth', ctx.scope, score);
    pb = best;
    if (bustedCount > 0) {
    }

    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.8rem;margin-bottom:6px;">${isNewBest ? '🏆' : '⚖️'}</div>
        <h3>${isNewBest ? 'New Mythbuster Record!' : 'Mythbuster Run Complete'}</h3>
        <div class="arcade-gameover-stats">
          <div><span>Score</span><strong>${score}</strong></div>
          <div><span>Claims Cracked</span><strong>${bustedCount}</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="fof-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Play Mythbuster Again
        </button>
      </div>
    `;
    stageEl.querySelector('#fof-replay-btn')?.addEventListener('click', startRun);
  }

  const onKeyDown = (e) => {
    const tag = (e.target?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (!awaitingNext) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        judge(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        judge(true);
      }
    } else if (e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      drawCard();
    }
  };
  window.addEventListener('keydown', onKeyDown);

  startRun();

  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
}
