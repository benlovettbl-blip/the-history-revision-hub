/**
 * Game 7: Fact or Fallacy ("Historical Mythbuster" Rapid Judgement)
 * Locked statement card height (min-height: 175px), reserved explanation slot,
 * pinned 54px bottom action buttons (CLS = 0), and Tinder-style touch swipe gestures!
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';
import { recordQuestionResult } from '../../storage.js';

export function mountFactOrFallacy(stageEl, pools, ctx) {
  const isKs2 = String(ctx.unitId || '').toLowerCase().startsWith('ks2_');
  const pool = pools.mythPool || [];
  if (pool.length === 0) {
    stageEl.innerHTML = `<div class="arcade-empty">No ${isKs2 ? 'True or Trick?' : 'Fact or Fallacy'} cards available in this selection.</div>`;
    return () => {};
  }

  let deck = [];
  let currentCard = null;
  let score = 0;
  let streak = 0;
  let lives = 3;
  let bustedCount = 0;
  let awaitingNext = false;
  let lastOutcome = null;
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
        title: isKs2
          ? currentCard.isFact
            ? `✅ TRUE FACT! (+${pts} pts)`
            : `🎯 TRICK SPOTTED! (+${pts} pts)`
          : currentCard.isFact
            ? `✅ VERIFIED FACT (+${pts} pts)`
            : `💥 MYTH BUSTED! (+${pts} pts)`,
        explanation: currentCard.explanation,
      };
    } else {
      streak = 0;
      lives--;
      arcadeAudio.wrong();
      recordQuestionResult(currentCard.id, false, currentCard, ctx.unitId);
      lastOutcome = {
        correct: false,
        title: isKs2
          ? currentCard.isFact
            ? '❌ Actually a TRUE History Fact!'
            : '❌ Caught by a Sneaky Trick!'
          : currentCard.isFact
            ? '❌ Actually TRUE Specification Fact!'
            : '❌ Caught by a Historical Trap!',
        explanation: currentCard.explanation,
      };
    }
    render();
  }

  function wireSwipeCard(cardEl) {
    if (!cardEl || awaitingNext) return;
    const leftStamp = cardEl.querySelector('.fof-swipe-stamp.left');
    const rightStamp = cardEl.querySelector('.fof-swipe-stamp.right');

    let startX = 0;
    let startY = 0;
    let dx = 0;
    let isHorizSwipe = null;
    let tracking = false;

    cardEl.addEventListener(
      'touchstart',
      (e) => {
        if (awaitingNext || !e.touches || e.touches.length !== 1) return;
        tracking = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        dx = 0;
        isHorizSwipe = null;
        cardEl.style.transition = 'none';
      },
      { passive: true },
    );

    cardEl.addEventListener(
      'touchmove',
      (e) => {
        if (!tracking || awaitingNext || !e.touches || e.touches.length !== 1) return;
        dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        if (isHorizSwipe === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
          isHorizSwipe = Math.abs(dx) > Math.abs(dy);
        }
        if (!isHorizSwipe) return;

        if (e.cancelable) e.preventDefault();
        const rot = Math.max(-12, Math.min(12, dx * 0.055));
        cardEl.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;

        if (dx < -15) {
          cardEl.style.borderColor = '#ef4444';
          if (leftStamp) leftStamp.style.opacity = String(Math.min(1, Math.abs(dx) / 60));
          if (rightStamp) rightStamp.style.opacity = '0';
        } else if (dx > 15) {
          cardEl.style.borderColor = '#10b981';
          if (rightStamp) rightStamp.style.opacity = String(Math.min(1, dx / 60));
          if (leftStamp) leftStamp.style.opacity = '0';
        } else {
          cardEl.style.borderColor = '#334155';
          if (leftStamp) leftStamp.style.opacity = '0';
          if (rightStamp) rightStamp.style.opacity = '0';
        }
      },
      { passive: false },
    );

    const endSwipe = () => {
      if (!tracking) return;
      tracking = false;
      cardEl.style.transition = 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.2s ease';

      if (isHorizSwipe && dx < -60) {
        cardEl.style.transform = 'translateX(-150px) rotate(-10deg)';
        setTimeout(() => judge(false), 110);
      } else if (isHorizSwipe && dx > 60) {
        cardEl.style.transform = 'translateX(150px) rotate(10deg)';
        setTimeout(() => judge(true), 110);
      } else {
        cardEl.style.transform = 'translateX(0px) rotate(0deg)';
        cardEl.style.borderColor = '#334155';
        if (leftStamp) leftStamp.style.opacity = '0';
        if (rightStamp) rightStamp.style.opacity = '0';
      }
    };

    cardEl.addEventListener('touchend', endSwipe, { passive: true });
    cardEl.addEventListener('touchcancel', endSwipe, { passive: true });
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

        <div class="fof-stage-box">
          <!-- Locked-Height Swipeable Statement Card (min-height: 175px) -->
          <div class="fof-card ${awaitingNext ? (lastOutcome?.correct ? 'verdict-ok' : 'verdict-err') : ''}" id="fof-swipe-card">
            <span class="fof-swipe-stamp left">${isKs2 ? '❌ TRICK!' : '❌ FALLACY'}</span>
            <span class="fof-swipe-stamp right">${isKs2 ? '✅ TRUE!' : '✅ FACT'}</span>

            <div class="fof-eyebrow">
              <span><i class="fa-solid fa-scale-balanced"></i> ${isKs2 ? 'TRUE OR TRICK?' : currentCard.promptLabel || 'FACT OR FALLACY?'}</span>
              <span>${currentCard.topic}</span>
            </div>

            ${
              isQuizKind
                ? `
              <div style="font-size: 1.02rem; font-weight: 700; color: #ffffff; line-height: 1.4; margin-bottom: 10px;">
                ${currentCard.headline}
              </div>
              <div style="background: rgba(56, 189, 248, 0.12); border: 1.5px solid rgba(56, 189, 248, 0.45); border-radius: 10px; padding: 10px 14px; font-size: 0.98rem; font-weight: 800; color: #bae6fd;">
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
          </div>

          <!-- Reserved Explanation Slot (Zero Layout Jump!) -->
          <div class="fof-explanation-slot ${awaitingNext ? (lastOutcome?.correct ? 'ok' : 'err') : ''}" role="status" aria-live="polite">
            ${
              awaitingNext
                ? `
              <strong>${lastOutcome.title}</strong>
              <p>${lastOutcome.explanation}</p>
            `
                : `
              <span class="fof-swipe-hint-idle">
                <i class="fa-solid fa-arrows-left-right"></i> Swipe card left (${isKs2 ? 'Trick' : 'Fallacy'}) or right (${isKs2 ? 'True' : 'Fact'}) — or tap below
              </span>
            `
            }
          </div>

          <!-- Pinned 54px Bottom Action Dock (Fixed Coordinates!) -->
          <div class="fof-action-dock">
            ${
              !awaitingNext
                ? `
              <div class="fof-btn-row">
                <button type="button" class="fof-judge-btn fallacy" id="fof-btn-fallacy">
                  ❌ ${isKs2 ? 'Trick' : 'Fallacy'} <kbd>←</kbd>
                </button>
                <button type="button" class="fof-judge-btn fact" id="fof-btn-fact">
                  ✅ ${isKs2 ? 'True' : 'Fact'} <kbd>→</kbd>
                </button>
              </div>
            `
                : `
              <button type="button" class="arcade-btn-primary fof-next-dock-btn" id="fof-next-btn">
                ${lives <= 0 ? 'View Final Score' : 'Next →'} <kbd>Space</kbd>
              </button>
            `
            }
          </div>
        </div>
      </div>
    `;

    wireSwipeCard(stageEl.querySelector('#fof-swipe-card'));
    stageEl.querySelector('#fof-btn-fallacy')?.addEventListener('click', () => judge(false));
    stageEl.querySelector('#fof-btn-fact')?.addEventListener('click', () => judge(true));
    stageEl.querySelector('#fof-next-btn')?.addEventListener('click', drawCard);
  }

  function renderEnd() {
    arcadeAudio.gameOver();
    const { isNewBest, best } = saveArcadePersonalBest(ctx.unitId, 'myth', ctx.scope, score);
    ctx.onRoundComplete?.();
    pb = best;

    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.6rem;margin-bottom:6px;">${isNewBest ? '🏆' : '⚖️'}</div>
        <h3>${isNewBest ? (isKs2 ? 'New True or Trick Record!' : 'New Mythbuster Record!') : isKs2 ? 'True or Trick? Complete' : 'Mythbuster Run Complete'}</h3>
        <div class="arcade-gameover-stats">
          <div><span>Score</span><strong>${score}</strong></div>
          <div><span>${isKs2 ? 'Cards Solved' : 'Claims Cracked'}</span><strong>${bustedCount}</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="fof-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Play ${isKs2 ? 'True or Trick?' : 'Mythbuster'} Again
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
