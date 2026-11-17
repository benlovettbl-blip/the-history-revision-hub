/**
 * Game 6: Archive Detective ("Zoom & Identify" Authentic Visual Source Mystery)
 * Opens tightly zoomed (4x) on an authentic archival photograph, cartoon, or artefact.
 * Zoom out step-by-step for fewer points, then inspect the full uncropped museum plate.
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';
import { addXp, recordQuestionResult } from '../../storage.js';

const ZOOM_STEPS = [
  { scale: 3.8, pts: 200, label: '4× Micro-Detail (200 pts)' },
  { scale: 2.4, pts: 150, label: '2.5× Evidence Crop (150 pts)' },
  { scale: 1.55, pts: 110, label: '1.5× Context View (110 pts)' },
  { scale: 1.0, pts: 75, label: '1× Full Plate (75 pts)' },
];

export function mountArchiveDetective(stageEl, pools, ctx) {
  const pool = pools.detectivePool || [];
  if (pool.length < 2) {
    stageEl.innerHTML = `<div class="arcade-empty">Not enough archival visual plates in this selection. Switch scope to "Full Unit Syllabus".</div>`;
    return () => {};
  }

  let deck = shuffleList(pool).slice(0, 8);
  let roundIdx = 0;
  let zoomIdx = 0;
  let focalOrigin = '50% 45%';
  let answered = false;
  let pickedOpt = null;
  let score = 0;
  let correctTotal = 0;
  let pb = getArcadePersonalBest(ctx.unitId, 'detective', ctx.scope);

  const origins = ['38% 38%', '62% 38%', '50% 48%', '42% 58%', '58% 52%'];

  function setupRound() {
    arcadeAudio.ensureContext();
    if (roundIdx >= deck.length) {
      renderSummary();
      return;
    }
    zoomIdx = 0;
    answered = false;
    pickedOpt = null;
    focalOrigin = origins[roundIdx % origins.length];
    render();
  }

  function zoomOutStep() {
    if (answered || zoomIdx >= ZOOM_STEPS.length - 1) return;
    zoomIdx++;
    arcadeAudio.zoom();
    render();
  }

  function submitGuess(optText) {
    if (answered) return;
    const item = deck[roundIdx];
    answered = true;
    pickedOpt = optText;
    const isCorrect = optText.toLowerCase() === item.label.toLowerCase();

    if (isCorrect) {
      const pts = ZOOM_STEPS[zoomIdx].pts;
      score += pts;
      correctTotal++;
      arcadeAudio.correct();
      recordQuestionResult(item.id, true, item, ctx.unitId);
    } else {
      arcadeAudio.wrong();
      recordQuestionResult(item.id, false, item, ctx.unitId);
    }
    render();
  }

  function render() {
    const item = deck[roundIdx];
    const z = ZOOM_STEPS[zoomIdx];
    const activeScale = answered ? 1.0 : z.scale;

    stageEl.innerHTML = `
      <div class="det-wrap">
        <div class="tlb-hud">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Evidence Plate</span><strong class="green">${roundIdx + 1} / ${deck.length}</strong></div>
          <div class="tlb-stat"><span>Current Bounty</span><strong class="amber">${answered ? 'Revealed' : `${z.pts} pts`}</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <div class="det-grid">
          <!-- Left: Archival Magnifier Viewport -->
          <div class="det-frame-col">
            <div class="det-viewport ${answered ? 'unzoomed' : ''}">
              <img
                src="${item.imageUrl}"
                alt="Archival Mystery Evidence Plate"
                class="det-img"
                style="transform: scale(${activeScale}); transform-origin: ${focalOrigin}; object-fit: contain;"
              />
              <span class="det-zoom-pill">
                <i class="fa-solid fa-magnifying-glass"></i> ${answered ? 'Full Uncropped Archival Plate' : z.label}
              </span>
            </div>

            ${
              !answered
                ? `
              <div class="det-zoom-bar">
                <button type="button" class="arcade-btn-ghost" id="det-zoom-btn" ${zoomIdx >= ZOOM_STEPS.length - 1 ? 'disabled' : ''}>
                  <i class="fa-solid fa-magnifying-glass-minus" style="color:#fbbf24;"></i>
                  ${zoomIdx >= ZOOM_STEPS.length - 1 ? 'At Full View (75 pts)' : `Zoom Out Wider (${ZOOM_STEPS[zoomIdx + 1].pts} pts)`}
                </button>
              </div>
            `
                : `
              <div class="det-caption-box">
                <strong><i class="fa-solid fa-landmark"></i> Archival Provenance (${item.lessonTitle}):</strong>
                <p>${item.caption}</p>
              </div>
            `
            }
          </div>

          <!-- Right: Identification Options -->
          <div class="det-choices-col">
            <div class="det-prompt-tag">ARCHIVE DETECTIVE • IDENTIFY THE PRIMARY PLATE</div>
            <h4 class="det-prompt-h">Which historical source, event, or theme does this archival plate depict?</h4>

            <div class="det-opts-list">
              ${item.options
                .map((opt, i) => {
                  const isRight = answered && opt.toLowerCase() === item.label.toLowerCase();
                  const isWrongPick =
                    answered && pickedOpt === opt && opt.toLowerCase() !== item.label.toLowerCase();
                  return `
                    <button type="button" class="bsp-opt-btn ${isRight ? 'right' : ''} ${isWrongPick ? 'wrong' : ''}" data-opt="${opt.replace(/"/g, '&quot;')}" ${answered ? 'disabled' : ''}>
                      <span class="bsp-key">${String.fromCharCode(65 + i)}</span>
                      <span>${opt}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>

            ${
              answered
                ? `
              <button type="button" class="arcade-btn-primary" id="det-next-btn" style="width:100%;margin-top:14px;">
                ${roundIdx + 1 >= deck.length ? 'Finish Case File' : 'Next Evidence Plate'} <i class="fa-solid fa-arrow-right"></i>
              </button>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `;

    stageEl.querySelector('#det-zoom-btn')?.addEventListener('click', zoomOutStep);
    stageEl.querySelectorAll('.bsp-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => submitGuess(btn.dataset.opt));
    });
    stageEl.querySelector('#det-next-btn')?.addEventListener('click', () => {
      roundIdx++;
      setupRound();
    });
  }

  function renderSummary() {
    arcadeAudio.levelUp();
    const { isNewBest, best } = saveArcadePersonalBest(ctx.unitId, 'detective', ctx.scope, score);
    pb = best;
    if (correctTotal > 0) {
      addXp(correctTotal * 12, 'Archive Detective');
    }

    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.8rem;margin-bottom:6px;">${isNewBest ? '🏆' : '🔍'}</div>
        <h3>${isNewBest ? 'New Detective High Score!' : 'Archive Case Closed!'}</h3>
        <div class="arcade-gameover-stats">
          <div><span>Final Score</span><strong>${score}</strong></div>
          <div><span>Sources Identified</span><strong>${correctTotal} / ${deck.length}</strong></div>
          <div><span>Personal Best</span><strong>${best}</strong></div>
        </div>
        <button type="button" class="arcade-btn-primary" id="det-replay-btn">
          <i class="fa-solid fa-rotate-right"></i> Investigate New Plates
        </button>
      </div>
    `;
    stageEl.querySelector('#det-replay-btn')?.addEventListener('click', () => {
      deck = shuffleList(pool).slice(0, 8);
      roundIdx = 0;
      score = 0;
      correctTotal = 0;
      setupRound();
    });
  }

  setupRound();
  return () => {};
}
