/**
 * Game 6: Archive Detective ("Zoom & Identify" Authentic Visual Source Mystery)
 * Locked mobile evidence frame (180px, 16:10, object-fit: contain), tap-to-zoom modal,
 * 1-row Clue Reveal chip strip, reserved readout slot, and pinned 4 answer buttons (CLS = 0).
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';
import { recordQuestionResult } from '../../storage.js';

const ZOOM_STEPS = [
  { scale: 3.8, pts: 200, label: '4× Micro-Detail (200 pts)' },
  { scale: 2.4, pts: 150, label: '2.5× Crop (150 pts)' },
  { scale: 1.55, pts: 110, label: '1.5× Context (110 pts)' },
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
  let topicClueUsed = false;
  let eraClueUsed = false;
  let activeClueText = '';
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
    topicClueUsed = false;
    eraClueUsed = false;
    activeClueText = '';
    answered = false;
    pickedOpt = null;
    focalOrigin = origins[roundIdx % origins.length];
    render();
  }

  function currentBounty() {
    const base = ZOOM_STEPS[zoomIdx].pts;
    const penalty = (topicClueUsed ? 25 : 0) + (eraClueUsed ? 35 : 0);
    return Math.max(25, base - penalty);
  }

  function zoomOutStep() {
    if (answered || zoomIdx >= ZOOM_STEPS.length - 1) return;
    zoomIdx++;
    arcadeAudio.zoom();
    activeClueText = `🔍 Zoomed to ${ZOOM_STEPS[zoomIdx].label}`;
    render();
  }

  function revealTopicClue() {
    if (answered || topicClueUsed) return;
    topicClueUsed = true;
    arcadeAudio.zoom();
    const item = deck[roundIdx];
    activeClueText = `📂 Enquiry Context: ${item.lessonTitle || 'Unit Visual Archive'}`;
    render();
  }

  function revealProvenanceClue() {
    if (answered || eraClueUsed) return;
    eraClueUsed = true;
    arcadeAudio.zoom();
    const item = deck[roundIdx];
    const rawCaption = String(item.caption || '');
    const escapedLabel = String(item.label || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const masked = escapedLabel
      ? rawCaption.replace(new RegExp(escapedLabel, 'gi'), '[REDACTED]')
      : rawCaption;
    activeClueText = `📜 Clue: ${masked.slice(0, 120)}${masked.length > 120 ? '…' : ''}`;
    render();
  }

  function submitGuess(optText) {
    if (answered) return;
    const item = deck[roundIdx];
    answered = true;
    pickedOpt = optText;
    const isCorrect = optText.toLowerCase() === item.label.toLowerCase();

    if (isCorrect) {
      const pts = currentBounty();
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
    const bounty = currentBounty();

    const readoutText = answered
      ? `🏛️ ${item.lessonTitle}: ${item.caption}`
      : activeClueText || 'Tap Zoom Out or a Clue Chip if you need wider visual context.';

    stageEl.innerHTML = `
      <div class="det-wrap">
        <div class="tlb-hud">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Plate</span><strong class="green">${roundIdx + 1} / ${deck.length}</strong></div>
          <div class="tlb-stat"><span>Bounty</span><strong class="amber">${answered ? 'Revealed' : `${bounty} pts`}</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <div class="det-grid">
          <!-- Left: Locked Archival Magnifier Viewport + 1-Row Clue Strip -->
          <div class="det-frame-col">
            <div class="det-viewport ${answered ? 'unzoomed' : ''}" id="det-image-frame" role="button" tabindex="0" aria-label="Tap to inspect full archival image">
              <img
                src="${item.imageUrl}"
                alt="Archival Mystery Evidence Plate"
                class="det-img"
                style="transform: scale(${activeScale}); transform-origin: ${focalOrigin}; object-fit: contain;"
              />
              <span class="det-zoom-pill">
                <i class="fa-solid fa-magnifying-glass"></i> ${answered ? 'Full Archival Plate' : z.label}
              </span>
              <span class="det-tap-zoom-pill">
                <i class="fa-solid fa-expand"></i> Zoom
              </span>
            </div>

            <!-- Compact 1-Row Clue Reveal Chips -->
            <div class="det-clue-strip" role="toolbar" aria-label="Clue Reveal Controls">
              <button type="button" class="det-clue-chip" id="det-zoom-btn" ${answered || zoomIdx >= ZOOM_STEPS.length - 1 ? 'disabled' : ''}>
                <i class="fa-solid fa-magnifying-glass-minus" style="color:#fbbf24;"></i>
                ${zoomIdx >= ZOOM_STEPS.length - 1 ? 'Full View' : `Zoom Out`}
              </button>
              <button type="button" class="det-clue-chip" id="det-topic-clue-btn" ${answered || topicClueUsed ? 'disabled' : ''}>
                <i class="fa-solid fa-folder-open" style="color:#38bdf8;"></i> Topic (-25)
              </button>
              <button type="button" class="det-clue-chip" id="det-era-clue-btn" ${answered || eraClueUsed ? 'disabled' : ''}>
                <i class="fa-solid fa-scroll" style="color:#a855f7;"></i> Clue (-35)
              </button>
            </div>

            <!-- Reserved Fixed-Height Clue / Provenance Readout (Zero Jump!) -->
            <div class="det-clue-readout ${answered ? 'revealed' : ''}">
              <span>${readoutText}</span>
            </div>
          </div>

          <!-- Right: Pinned Identification Options -->
          <div class="det-choices-col">
            <div class="det-prompt-tag">ARCHIVE DETECTIVE • IDENTIFY THE PRIMARY PLATE</div>
            <h4 class="det-prompt-h">Which historical source, event, or theme does this plate depict?</h4>

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

            <div class="det-footer-slot">
              ${
                answered
                  ? `
                <button type="button" class="arcade-btn-primary" id="det-next-btn" style="width:100%;">
                  ${roundIdx + 1 >= deck.length ? 'Finish Case File' : 'Next Evidence Plate'} <i class="fa-solid fa-arrow-right"></i>
                </button>
              `
                  : `<div style="width:100%;text-align:center;font-size:0.75rem;color:#64748b;">Identify early at 4× zoom for maximum bounty!</div>`
              }
            </div>
          </div>
        </div>
      </div>
    `;

    const imgFrame = stageEl.querySelector('#det-image-frame');
    const openZoom = () => {
      window.openImageModal?.(item.imageUrl);
    };
    imgFrame?.addEventListener('click', openZoom);
    imgFrame?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openZoom();
      }
    });

    stageEl.querySelector('#det-zoom-btn')?.addEventListener('click', zoomOutStep);
    stageEl.querySelector('#det-topic-clue-btn')?.addEventListener('click', revealTopicClue);
    stageEl.querySelector('#det-era-clue-btn')?.addEventListener('click', revealProvenanceClue);
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
    ctx.onRoundComplete?.();
    pb = best;

    stageEl.innerHTML = `
      <div class="arcade-result-panel">
        <div style="font-size:2.6rem;margin-bottom:6px;">${isNewBest ? '🏆' : '🔍'}</div>
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
