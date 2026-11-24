/**
 * Game 3: Connections Wall ("Only Connect" / NYT Connections 4x4 Historical Grid)
 * Group 16 historical concepts/events into 4 hidden synoptic categories of 4 before losing 4 lives.
 */

import { arcadeAudio, getArcadePersonalBest, saveArcadePersonalBest } from '../arcade_audio.js';
import { shuffleList } from '../arcade_data_adapter.js';

export function mountConnectionsWall(stageEl, pools, ctx) {
  const boards = pools.connectionsBoards || [];
  if (boards.length === 0) {
    stageEl.innerHTML = `<div class="arcade-empty">Not enough 4-part category clusters in this single lesson. Switch scope above to "Full Unit Syllabus" to unlock the 4×4 Connections Wall!</div>`;
    return () => {};
  }

  let boardIdx = 0;
  let activeGroups = [];
  let solvedGroups = [];
  let remainingTiles = [];
  let selectedIds = new Set();
  let mistakesLeft = 4;
  let score = 0;
  let toastMsg = 'Select 4 historically connected tiles and click Submit Group.';
  let toastTone = 'neutral';
  let pb = getArcadePersonalBest(ctx.unitId, 'connections', ctx.scope);

  function initBoard(idx) {
    arcadeAudio.ensureContext();
    activeGroups = boards[idx % boards.length];
    solvedGroups = [];
    selectedIds = new Set();
    mistakesLeft = 4;
    toastMsg = 'Spot the 4 hidden groups of 4 connected specification terms.';
    toastTone = 'neutral';

    const allTiles = [];
    activeGroups.forEach((g, gIndex) => {
      g.items.forEach((text, tIndex) => {
        allTiles.push({
          id: `g${gIndex}_t${tIndex}`,
          groupIndex: gIndex,
          text,
        });
      });
    });
    remainingTiles = shuffleList(allTiles);
    render();
  }

  function toggleTile(tileId) {
    if (mistakesLeft <= 0 || solvedGroups.length === 4) return;
    if (selectedIds.has(tileId)) {
      selectedIds.delete(tileId);
      arcadeAudio.move();
    } else if (selectedIds.size < 4) {
      selectedIds.add(tileId);
      arcadeAudio.move();
    }
    render();
  }

  function submitSelection() {
    if (selectedIds.size !== 4) return;
    const picked = remainingTiles.filter((t) => selectedIds.has(t.id));
    if (picked.length !== 4) return;

    // Tally group counts to detect exact match or "One Away!"
    const counts = {};
    picked.forEach((t) => {
      counts[t.groupIndex] = (counts[t.groupIndex] || 0) + 1;
    });
    const maxMatch = Math.max(...Object.values(counts));

    if (maxMatch === 4) {
      const gIdx = picked[0].groupIndex;
      const solved = activeGroups[gIdx];
      solvedGroups.push(solved);
      remainingTiles = remainingTiles.filter((t) => t.groupIndex !== gIdx);
      selectedIds.clear();
      const groupPts = 200 + mistakesLeft * 40;
      score += groupPts;
      arcadeAudio.correct();
      toastMsg = `✅ Connection Solved: "${solved.title}" (+${groupPts} pts)`;
      toastTone = 'ok';

      if (solvedGroups.length === 4) {
        score += mistakesLeft * 100;
        arcadeAudio.levelUp();
        const { best } = saveArcadePersonalBest(ctx.unitId, 'connections', ctx.scope, score);
        ctx.onRoundComplete?.();
        pb = best;
      }
      render();
      return;
    }

    // Wrong guess
    mistakesLeft--;
    arcadeAudio.wrong();
    if (maxMatch === 3) {
      toastMsg = '🔥 One Away! 3 of your 4 selected tiles belong to the exact same category!';
      toastTone = 'warn';
    } else {
      toastMsg = '❌ Not a matching quartet — rethink the historical thread!';
      toastTone = 'err';
    }

    if (mistakesLeft <= 0) {
      // Reveal remaining groups
      activeGroups.forEach((g) => {
        if (!solvedGroups.includes(g)) solvedGroups.push(g);
      });
      remainingTiles = [];
      selectedIds.clear();
      const { best } = saveArcadePersonalBest(ctx.unitId, 'connections', ctx.scope, score);
      ctx.onRoundComplete?.();
      pb = best;
      toastMsg = 'Wall unlocked — study the 4 historical connections below and try a fresh board!';
    }
    render();
  }

  function giveHint() {
    if (remainingTiles.length === 0 || mistakesLeft <= 0) return;
    // Highlight 2 tiles from the first unsolved group
    const targetGroupIdx = remainingTiles[0].groupIndex;
    const two = remainingTiles.filter((t) => t.groupIndex === targetGroupIdx).slice(0, 2);
    selectedIds = new Set(two.map((t) => t.id));
    score = Math.max(0, score - 50);
    arcadeAudio.zoom();
    toastMsg = `💡 Hint Active: These 2 selected tiles belong to the same historical group (-50 pts). Find the other 2!`;
    toastTone = 'warn';
    render();
  }

  function render() {
    const dots = '🟢'.repeat(Math.max(0, mistakesLeft)) + '⚫'.repeat(Math.max(0, 4 - mistakesLeft));
    const isFinished = remainingTiles.length === 0;

    stageEl.innerHTML = `
      <div class="cw-wrap">
        <div class="tlb-hud">
          <div class="tlb-stat"><span>Score</span><strong class="cyan">${score}</strong></div>
          <div class="tlb-stat"><span>Groups Found</span><strong class="green">${solvedGroups.length} / 4</strong></div>
          <div class="tlb-stat"><span>Attempts Left</span><strong>${dots}</strong></div>
          <div class="tlb-stat"><span>Board</span><strong class="purple">#${(boardIdx % boards.length) + 1} of ${boards.length}</strong></div>
          <div class="tlb-stat"><span>Best</span><strong>${Math.max(pb, score)}</strong></div>
        </div>

        <div class="cw-toast ${toastTone}">${toastMsg}</div>
        ${
          pools.isSingleLesson
            ? `<div style="text-align:center;font-size:0.78rem;color:#94a3b8;margin:-6px 0 12px 0;"><i class="fa-solid fa-layer-group" style="color:#a855f7;"></i> <strong>Synoptic Unit Wall:</strong> Group these 16 specification terms into 4 distinct enquiries across ${pools.unitTitle}.</div>`
            : ''
        }

        <!-- Solved Category Banners -->
        <div class="cw-solved-stack">
          ${solvedGroups
            .map(
              (g) => `
              <div class="cw-solved-banner" style="background:${g.bg}; border-color:${g.border};">
                <div class="cw-solved-title" style="color:${g.color};">
                  <i class="fa-solid fa-link"></i> ${g.title}
                </div>
                <div class="cw-solved-items">${g.items.join('  •  ')}</div>
              </div>
            `,
            )
            .join('')}
        </div>

        <!-- Active Remaining 4x4 Grid -->
        ${
          !isFinished
            ? `
          <div class="cw-grid">
            ${remainingTiles
              .map((tile) => {
                const isSel = selectedIds.has(tile.id);
                return `
                  <button type="button" class="cw-tile ${isSel ? 'selected' : ''}" data-id="${tile.id}">
                    <span>${tile.text}</span>
                  </button>
                `;
              })
              .join('')}
          </div>

          <div class="cw-actions">
            <button type="button" class="arcade-btn-ghost" id="cw-shuffle-btn">
              <i class="fa-solid fa-shuffle"></i> Shuffle
            </button>
            <button type="button" class="arcade-btn-ghost" id="cw-hint-btn" title="Highlight 2 connected tiles (-50 pts)">
              <i class="fa-solid fa-lightbulb" style="color:#fbbf24;"></i> Hint
            </button>
            <button type="button" class="arcade-btn-ghost" id="cw-clear-btn" ${selectedIds.size === 0 ? 'disabled' : ''}>
              Deselect
            </button>
            <button type="button" class="arcade-btn-primary" id="cw-submit-btn" ${selectedIds.size !== 4 ? 'disabled' : ''}>
              Submit (${selectedIds.size}/4)
            </button>
          </div>
        `
            : `
          <div style="text-align:center; margin-top: 18px;">
            <button type="button" class="arcade-btn-primary" id="cw-next-board-btn">
              <i class="fa-solid fa-forward"></i> Deal Next 4×4 Wall
            </button>
          </div>
        `
        }
      </div>
    `;

    stageEl.querySelectorAll('.cw-tile').forEach((btn) => {
      btn.addEventListener('click', () => toggleTile(btn.dataset.id));
    });
    stageEl.querySelector('#cw-shuffle-btn')?.addEventListener('click', () => {
      remainingTiles = shuffleList(remainingTiles);
      arcadeAudio.move();
      render();
    });
    stageEl.querySelector('#cw-clear-btn')?.addEventListener('click', () => {
      selectedIds.clear();
      render();
    });
    stageEl.querySelector('#cw-hint-btn')?.addEventListener('click', giveHint);
    stageEl.querySelector('#cw-submit-btn')?.addEventListener('click', submitSelection);
    stageEl.querySelector('#cw-next-board-btn')?.addEventListener('click', () => {
      boardIdx++;
      initBoard(boardIdx);
    });
  }

  initBoard(0);
  return () => {};
}
