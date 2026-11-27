/**
 * Game 4: Redacted! ("Classified Dossier SPaG Cracker")
 * Declassify censored specification vocabulary & key individuals letter-by-letter
 * using a 3-row QWERTY thumb keyboard to build precision GCSE SPaG accuracy.
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';
import { recordQuestionResult } from '../../storage.js';

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];
const DIGIT_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export function mountRedactedDossier(stageEl, pools, ctx) {
  const pool = pools.redactedPool || [];
  if (pool.length === 0) {
    stageEl.innerHTML = `<div class="arcade-empty">No vocabulary words available in this selection.</div>`;
    return () => {};
  }

  const isKs2 = String(ctx.unitId || '').toLowerCase().startsWith('ks2_');
  let deck = [];
  let currentDossier = null;
  let guessedChars = new Set();
  let strikes = 0;
  const MAX_STRIKES = isKs2 ? 9 : 6;
  let score = 0;
  let solvedCount = 0;
  let showTopicHint = false;
  let showStructHint = false;
  let roundStatus = 'PLAYING'; // PLAYING | WON | LOST
  let pb = getArcadePersonalBest(ctx.unitId, 'redacted', ctx.scope);

  function nextDossier() {
    arcadeAudio.ensureContext();
    if (deck.length === 0) deck = shuffleList(pool);
    currentDossier = deck.pop();
    guessedChars = new Set();
    if (isKs2 && currentDossier && currentDossier.term) {
      // Pre-reveal vowels + first letter on KS2 so Ages 7–11 never get stuck on tricky historical spellings!
      ['A', 'E', 'I', 'O', 'U'].forEach((v) => {
        if (currentDossier.term.includes(v)) guessedChars.add(v);
      });
      const firstAlpha = currentDossier.term.match(/[A-Z]/);
      if (firstAlpha) guessedChars.add(firstAlpha[0]);
      // Ensure at least 1 consonant remains unguessed for short words
      const unguessedLeft = currentDossier.term
        .split('')
        .filter((ch) => /[A-Z0-9]/.test(ch) && !guessedChars.has(ch));
      if (unguessedLeft.length === 0) {
        guessedChars.clear();
        if (firstAlpha) guessedChars.add(firstAlpha[0]);
      }
    }
    strikes = 0;
    showTopicHint = false;
    showStructHint = false;
    roundStatus = 'PLAYING';
    render();
  }

  function isAutoRevealedChar(ch) {
    return !/[A-Z0-9]/.test(ch);
  }

  function checkAllLettersRevealed() {
    if (!currentDossier) return false;
    for (const ch of currentDossier.term) {
      if (!isAutoRevealedChar(ch) && !guessedChars.has(ch)) return false;
    }
    return true;
  }

  function guessLetter(rawChar) {
    if (roundStatus !== 'PLAYING' || !currentDossier) return;
    const ch = String(rawChar || '').toUpperCase();
    if (!/[A-Z0-9]/.test(ch) || guessedChars.has(ch)) return;

    guessedChars.add(ch);
    if (currentDossier.term.includes(ch)) {
      arcadeAudio.move();
      score += 20;
      if (checkAllLettersRevealed()) {
        roundStatus = 'WON';
        solvedCount++;
        const bonus = 120 + (MAX_STRIKES - strikes) * 20;
        score += bonus;
        arcadeAudio.correct();
        const { best } = saveArcadePersonalBest(ctx.unitId, 'redacted', ctx.scope, score);
        ctx.onRoundComplete?.();
        pb = best;
        recordQuestionResult(
          currentDossier.id,
          true,
          {
            id: currentDossier.id,
            q: `Spell and define "${currentDossier.displayTerm}"`,
            a: currentDossier.displayTerm,
            source: currentDossier.source,
            explanation: currentDossier.fullDefinition,
          },
          ctx.unitId,
        );
      }
    } else {
      strikes++;
      arcadeAudio.wrong();
      if (strikes >= MAX_STRIKES) {
        roundStatus = 'LOST';
        const { best } = saveArcadePersonalBest(ctx.unitId, 'redacted', ctx.scope, score);
        ctx.onRoundComplete?.();
        pb = best;
        recordQuestionResult(
          currentDossier.id,
          false,
          {
            id: currentDossier.id,
            q: `Which specification term matches: "${currentDossier.cluePrimary}"?`,
            a: currentDossier.displayTerm,
            source: currentDossier.source,
            explanation: `${currentDossier.displayTerm}: ${currentDossier.fullDefinition}`,
          },
          ctx.unitId,
        );
      }
    }
    render();
  }

  function revealOneLetterLifeline() {
    if (roundStatus !== 'PLAYING' || !currentDossier) return;
    const hiddenChars = currentDossier.term
      .split('')
      .filter((ch) => !isAutoRevealedChar(ch) && !guessedChars.has(ch));
    if (hiddenChars.length === 0) return;
    score = Math.max(0, score - 30);
    showStructHint = true;
    const pick = hiddenChars[Math.floor(Math.random() * hiddenChars.length)];
    arcadeAudio.zoom();
    guessLetter(pick);
  }

  function renderKeyRow(keys, rowClass = '') {
    return `
      <div class="red-qwerty-row ${rowClass}">
        ${keys
          .map((k) => {
            const used = guessedChars.has(k);
            const hit = used && currentDossier.term.includes(k);
            return `<button type="button" class="red-key ${used ? (hit ? 'hit' : 'miss') : ''}" data-key="${k}" ${used ? 'disabled' : ''}>${k}</button>`;
          })
          .join('')}
      </div>
    `;
  }

  function render() {
    if (!currentDossier) return;
    const clearanceLeft = MAX_STRIKES - strikes;
    const clearanceBars =
      '🟩'.repeat(Math.max(0, clearanceLeft)) + '🟥'.repeat(Math.max(0, strikes));

    const words = currentDossier.term.split(' ');
    const hasDigits = /[0-9]/.test(currentDossier.term);

    stageEl.innerHTML = `
      <div class="red-wrap">
        <div class="tlb-hud">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Solved</span><strong class="green">${solvedCount}</strong></div>
          <div class="tlb-stat"><span>${isKs2 ? 'Tries Left' : 'Clearance'}</span><strong>${clearanceBars}</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <div class="red-dossier-card">
          <div class="red-stamp-row">
            <span class="red-stamp"><i class="fa-solid ${isKs2 ? 'fa-magnifying-glass' : 'fa-file-shield'}"></i> ${isKs2 ? 'SECRET WORD DETECTIVE' : 'CLASSIFIED DOSSIER • SPaG'}</span>
            <span class="red-letter-count">${currentDossier.term.replace(/[^A-Z0-9]/g, '').length} Letters</span>
          </div>

          <p class="red-clue-main">
            <strong>${isKs2 ? 'Clue:' : 'Brief:'}</strong> ${currentDossier.cluePrimary}
          </p>

          ${showTopicHint ? `<div class="red-hint-pill"><i class="fa-solid fa-folder-open"></i> ${currentDossier.clueTopic}</div>` : ''}
          ${showStructHint ? `<div class="red-hint-pill"><i class="fa-solid fa-spell-check"></i> ${currentDossier.clueStructure}</div>` : ''}

          <!-- Letter Slots -->
          <div class="red-words-row">
            ${words
              .map(
                (word) => `
                <div class="red-word-group">
                  ${word
                    .split('')
                    .map((ch) => {
                      const auto = isAutoRevealedChar(ch);
                      const shown = auto || guessedChars.has(ch) || roundStatus !== 'PLAYING';
                      const missed = roundStatus === 'LOST' && !auto && !guessedChars.has(ch);
                      return `<span class="red-char-box ${auto ? 'punct' : shown ? (missed ? 'missed' : 'revealed') : ''}">${shown ? ch : ''}</span>`;
                    })
                    .join('')}
                </div>
              `,
              )
              .join('')}
          </div>

          ${
            roundStatus === 'PLAYING'
              ? `
            <div class="red-lifelines">
              <button type="button" class="arcade-btn-ghost" id="red-topic-btn" ${showTopicHint ? 'disabled' : ''}>
                <i class="fa-solid fa-compass" style="color:#38bdf8;"></i> Topic (${isKs2 ? 'Free' : '-15'})
              </button>
              <button type="button" class="arcade-btn-ghost" id="red-letter-btn">
                <i class="fa-solid fa-key" style="color:#fbbf24;"></i> ${isKs2 ? 'Hint Letter' : 'Reveal Letter (-30)'}
              </button>
            </div>

            <div class="red-qwerty-keyboard" role="group" aria-label="On-screen QWERTY keyboard">
              ${hasDigits ? renderKeyRow(DIGIT_ROW, 'row-num') : ''}
              ${renderKeyRow(QWERTY_ROWS[0], 'row-top')}
              ${renderKeyRow(QWERTY_ROWS[1], 'row-mid')}
              ${renderKeyRow(QWERTY_ROWS[2], 'row-bot')}
            </div>
          `
              : `
            <div class="red-verdict ${roundStatus === 'WON' ? 'won' : 'lost'}">
              <div>
                <strong>${roundStatus === 'WON' ? (isKs2 ? '🌟 MYSTERY WORD SOLVED:' : '🔓 DOSSIER DECLASSIFIED:') : isKs2 ? '💡 SECRET WORD WAS:' : '🔒 TERM REVEALED:'} ${currentDossier.displayTerm}</strong>
                <p>${currentDossier.fullDefinition}</p>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                <button type="button" class="arcade-btn-ghost" id="red-speak-btn" title="Hear pronunciation">
                  <i class="fa-solid fa-volume-high"></i> Say Word
                </button>
                <button type="button" class="arcade-btn-primary" id="red-next-btn">
                  ${isKs2 ? 'Next Word' : 'Next File'} <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          `
          }
        </div>
      </div>
    `;

    stageEl.querySelectorAll('.red-key').forEach((btn) => {
      btn.addEventListener('click', () => guessLetter(btn.dataset.key));
    });
    stageEl.querySelector('#red-topic-btn')?.addEventListener('click', () => {
      showTopicHint = true;
      if (!isKs2) score = Math.max(0, score - 15);
      arcadeAudio.zoom();
      render();
    });
    stageEl.querySelector('#red-letter-btn')?.addEventListener('click', revealOneLetterLifeline);
    stageEl.querySelector('#red-speak-btn')?.addEventListener('click', (ev) => {
      if (typeof window !== 'undefined' && window.speakVocabWord && currentDossier?.displayTerm) {
        window.speakVocabWord(currentDossier.displayTerm, ev.currentTarget);
      }
    });
    stageEl.querySelector('#red-next-btn')?.addEventListener('click', nextDossier);
  }

  const onKeyDown = (e) => {
    const tag = (e.target?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (roundStatus !== 'PLAYING' && e.key === 'Enter') {
      e.preventDefault();
      nextDossier();
      return;
    }
    if (roundStatus === 'PLAYING' && /^[a-zA-Z0-9]$/.test(e.key)) {
      e.preventDefault();
      guessLetter(e.key.toUpperCase());
    }
  };
  window.addEventListener('keydown', onKeyDown);

  nextDossier();

  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
}
