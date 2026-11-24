/**
 * src/mobile_exam_trainer.js
 *
 * Interactive Mobile GCSE Exam Trainer (Pearson Edexcel 9–1).
 * Provides:
 *  - 3-Second Topic Finder (Swipeable Course Pills, 16px Instant Search, Tariff Filter Pills)
 *  - View State A: Vertical Key Topic & Lesson Directory (< 50ms drill-down)
 *  - View State B: Dual-Mode Question Cards with 4 Zero-Jump Interactive Drills
 *    (PEEL Builder, 60s Plan, Be the Examiner, Speak / Blurt) & Scannable Grade 9 WAGOLL Reader
 *  - Native Deep-Link Support (`?eq=<n>` & `window.shareHubExamQuestion`)
 */

import './mobile_exam_trainer.css';
import { state } from './state.js';
import {
  GCSE_EXAM_COURSES,
  TARIFF_FILTERS,
  getPinnedGcseCourseIds,
  resolveGcseExamUnitId,
  buildUnitExamDirectory,
} from './engine/mobile_exam_adapter.js';

const trainerState = {
  unitId: 'cme_new',
  mountId: 'main-content',
  embeddedInHub: false,
  directory: null,
  selectedLessonIndex: null,
  searchQuery: '',
  activeTariff: 'all',
  familyFilter: null, // Array<string> of family keys when filtered from Paper Blueprint
  familySlotLabel: '',
  weakLessonSet: null, // Optional Set<number> of flagged/unverified lessons
  weakFilterLabel: '',
  // Map<questionId, { openPanel: 'practise'|'wagoll'|null, activeDrill: 'peel'|'plan'|'examiner'|'blurt', ... }>
  cardUi: new Map(),
  earnedXpSet: new Set(),
  speakingQuestionId: null,
  activeRecognition: null,
  listeningQuestionId: null,
  planTimers: new Map(),
};

function escapeHtml(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function deterministicShuffle(items, seedStr = '') {
  const arr = [...items];
  let seed = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    seed ^= seedStr.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    const j = Math.abs(seed) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Ensure order differs from sorted original if length >= 3
  if (arr.length >= 3 && arr.every((it, idx) => it === items[idx])) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

function stopActiveSpeechAndMic() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  trainerState.speakingQuestionId = null;

  if (trainerState.activeRecognition) {
    try {
      trainerState.activeRecognition.onend = null;
      trainerState.activeRecognition.stop();
    } catch (e) {}
    trainerState.activeRecognition = null;
  }
  trainerState.listeningQuestionId = null;
}

function clearAllPlanTimers() {
  trainerState.planTimers.forEach((intervalId) => clearInterval(intervalId));
  trainerState.planTimers.clear();
}

function awardDrillXpOnce(questionId, drillKey, amount, sourceName) {
  const token = `${questionId}:${drillKey}`;
  if (trainerState.earnedXpSet.has(token)) return false;
  trainerState.earnedXpSet.add(token);
  if (typeof window !== 'undefined') {
    window.hhAwardXp?.({
      amount,
      source: sourceName,
      unitId: trainerState.unitId,
    });
  }
  return true;
}

function getOrCreateCardState(q) {
  if (!trainerState.cardUi.has(q.id)) {
    const peelShuffled = deterministicShuffle(q.drills.peel.tiles, `${q.id}_peel`);
    const planFactorsShuffled = deterministicShuffle(q.drills.plan.factors, `${q.id}_factors`);
    const planConcsShuffled = deterministicShuffle(q.drills.plan.conclusions, `${q.id}_concs`);
    const examOptsShuffled = deterministicShuffle(q.drills.examiner.options, `${q.id}_exam`);
    const chipBankShuffled = deterministicShuffle(q.drills.peel.chipBank, `${q.id}_chips`);

    const firstBlankId = q.drills.peel.blanks[0]?.blankId || null;

    trainerState.cardUi.set(q.id, {
      openPanel: null, // 'practise' | 'wagoll' | null
      activeDrill: 'peel', // 'peel' | 'plan' | 'examiner' | 'blurt'
      recallMode: false,
      revealedChips: new Set(),
      peel: {
        shuffledTiles: peelShuffled,
        chipBank: chipBankShuffled,
        pickedTileIds: [],
        filledBlanks: {},
        activeBlankId: firstBlankId,
        checked: false,
        isPerfect: false,
      },
      plan: {
        shuffledFactors: planFactorsShuffled,
        shuffledConclusions: planConcsShuffled,
        selectedFactorIds: new Set(),
        selectedEvidenceIds: new Set(),
        selectedConclusionId: null,
        checked: false,
        secondsLeft: 60,
        timerRunning: false,
      },
      examiner: {
        shuffledOptions: examOptsShuffled,
        selectedOptionId: null,
        checked: false,
      },
      blurt: {
        draftText: '',
        selfMarked: false,
        matchedLabels: [],
        missedTargets: [],
      },
    });
  }
  return trainerState.cardUi.get(q.id);
}

function renderStickyDeckHTML() {
  const pinnedSet = new Set(getPinnedGcseCourseIds());
  const counts = trainerState.directory?.tariffCounts || {
    all: 0,
    '4m': 0,
    '8m': 0,
    '12m': 0,
    '16m': 0,
  };

  const coursePillsHtml = GCSE_EXAM_COURSES.map((c) => {
    const isActive = c.id === trainerState.unitId;
    const isPinned = pinnedSet.has(c.id);
    return `
      <button
        type="button"
        class="met-course-pill ${isActive ? 'is-active' : ''}"
        data-met-action="select-course"
        data-unit-id="${escapeHtml(c.id)}"
        aria-pressed="${isActive ? 'true' : 'false'}"
      >
        ${isPinned ? '<span class="met-pin-badge" title="Pinned Course">📌</span>' : ''}
        <span>${escapeHtml(c.pillLabel)}</span>
      </button>
    `;
  }).join('');

  const tariffPillsHtml = TARIFF_FILTERS.filter(
    (tf) => tf.key === 'all' || (counts[tf.key] ?? 0) > 0 || trainerState.activeTariff === tf.key,
  )
    .map((tf) => {
      const isActive = trainerState.activeTariff === tf.key;
      const countVal = counts[tf.key] ?? 0;
      return `
      <button
        type="button"
        class="met-tariff-pill ${isActive ? 'is-active' : ''}"
        data-met-action="select-tariff"
        data-tariff="${escapeHtml(tf.key)}"
        aria-pressed="${isActive ? 'true' : 'false'}"
      >
        <span>${escapeHtml(tf.label)}</span>
        <span class="met-tariff-count">(${countVal})</span>
      </button>
    `;
    })
    .join('');

  return `
    <div class="met-sticky-deck" role="region" aria-label="GCSE Exam Course and Topic Controls">
      ${
        trainerState.embeddedInHub
          ? ''
          : `<div class="met-course-strip" role="tablist" aria-label="GCSE Courses">
              ${coursePillsHtml}
            </div>`
      }
      <div class="met-search-tariff-row">
        <div class="met-search-wrap">
          <i class="fa-solid fa-magnifying-glass met-search-icon" aria-hidden="true"></i>
          <input
            type="search"
            id="met-search-input"
            class="met-search-input"
            placeholder="Search topic or question (e.g. Suez, Cholera, Berlin, Munich)..."
            value="${escapeHtml(trainerState.searchQuery)}"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            aria-label="Search GCSE exam questions or topics"
          />
          <button
            type="button"
            id="met-search-clear-btn"
            class="met-search-clear"
            data-met-action="clear-search"
            aria-label="Clear search"
            style="${trainerState.searchQuery ? '' : 'display:none;'}"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="met-tariff-strip" role="group" aria-label="Filter by question marks">
          ${tariffPillsHtml}
        </div>
      </div>
    </div>
  `;
}

function renderDirectoryViewHTML() {
  const dir = trainerState.directory;
  if (!dir) return '';

  const tf = trainerState.activeTariff;
  const ktCardsHtml = dir.keyTopics
    .map((kt) => {
      const visibleLessons = kt.lessons.filter((l) => {
        if (tf === 'all') return l.questionCount > 0;
        return l.questions.some((q) => q.tariffKey === tf);
      });
      if (visibleLessons.length === 0) return '';

      const rowsHtml = visibleLessons
        .map((l) => {
          const matchCount =
            tf === 'all'
              ? l.questionCount
              : l.questions.filter((q) => q.tariffKey === tf).length;
          const badgeText =
            tf === 'all'
              ? `${matchCount} ${matchCount === 1 ? 'Q' : 'Qs'} →`
              : `${matchCount} × ${tf} →`;

          return `
            <button
              type="button"
              class="met-lesson-row"
              data-met-action="open-lesson"
              data-lesson-index="${l.lessonIndex}"
            >
              <div class="met-lesson-row-main">
                <div class="met-lesson-row-title">
                  <span class="met-lesson-code-inline">${escapeHtml(l.lessonCode)}:</span>${escapeHtml(l.cleanTitle)}
                </div>
              </div>
              <span class="met-lesson-qbadge">${escapeHtml(badgeText)}</span>
            </button>
          `;
        })
        .join('');

      return `
        <section class="met-kt-card" aria-label="${escapeHtml(kt.ktLabel)}">
          <div class="met-kt-header">
            <span class="met-kt-badge">${escapeHtml(kt.ktBadge)}</span>
            <span class="met-kt-title">${escapeHtml(kt.ktTitle)}</span>
          </div>
          <div class="met-lesson-list">
            ${rowsHtml}
          </div>
        </section>
      `;
    })
    .filter(Boolean)
    .join('');

  return `
    ${
      trainerState.embeddedInHub
        ? ''
        : `<div class="met-course-banner">
            <div>
              <div class="met-course-banner-title">${escapeHtml(dir.courseMeta.fullTitle)}</div>
              <div class="met-course-banner-sub">${escapeHtml(dir.courseMeta.paperLabel)} &middot; ${dir.totalQuestions} Verified Questions &amp; Grade 9 Answers</div>
            </div>
          </div>`
    }
    ${
      ktCardsHtml
        ? `<div class="met-kt-grid-wrap">${ktCardsHtml}</div>`
        : `<div class="met-empty-state">
            <p style="margin:0 0 8px;font-weight:700;">No ${escapeHtml(tf)} questions in this course.</p>
            <button type="button" class="met-nav-pill" data-met-action="select-tariff" data-tariff="all">Show All Tariffs</button>
          </div>`
    }
  `;
}

function renderPeelTileContentHTML(tile, peelState) {
  let html = escapeHtml(tile.textWithBlanks);
  for (const bId of tile.blankIds) {
    const val = peelState.filledBlanks[bId] || '';
    const isActiveSlot = peelState.activeBlankId === bId && !peelState.checked;
    const slotLabel = val ? escapeHtml(val) : 'Tap spec chip';
    const slotSpan = `<span class="met-blank-slot ${val ? 'is-filled' : ''} ${isActiveSlot ? 'is-active-slot' : ''}" data-met-action="focus-blank" data-blank-id="${escapeHtml(bId)}" role="button" tabindex="0">${slotLabel}</span>`;
    html = html.replace(`[[${escapeHtml(bId)}]]`, slotSpan);
  }
  return html;
}

function renderPeelDrillHTML(q, ui) {
  const ps = ui.peel;
  const earned = trainerState.earnedXpSet.has(`${q.id}:peel`);

  const tilesHtml = ps.shuffledTiles
    .map((tile) => {
      const pickedIdx = ps.pickedTileIds.indexOf(tile.id);
      const isSelected = pickedIdx !== -1;
      let statusCls = '';
      if (ps.checked) {
        statusCls = pickedIdx === tile.orderIndex ? 'is-correct' : 'is-wrong';
      } else if (isSelected) {
        statusCls = 'is-selected';
      }

      const stepBadge = isSelected ? String(pickedIdx + 1) : '•';

      return `
        <div
          class="met-peel-tile ${statusCls}"
          data-met-action="toggle-peel-tile"
          data-q-id="${escapeHtml(q.id)}"
          data-tile-id="${escapeHtml(tile.id)}"
          role="button"
          tabindex="0"
        >
          <span class="met-peel-step-num">${stepBadge}</span>
          <div style="min-width:0;flex:1 1 auto;">
            ${
              ps.checked
                ? `<span class="met-role-badge role-${tile.role.startsWith('LINK') ? 'link' : tile.role.toLowerCase()}">[${escapeHtml(tile.role)}]</span>`
                : ''
            }
            <span>${renderPeelTileContentHTML(tile, ps)}</span>
          </div>
        </div>
      `;
    })
    .join('');

  const usedValues = new Set(Object.values(ps.filledBlanks));
  const chipsHtml =
    q.drills.peel.blanks.length > 0
      ? `
        <div class="met-chip-bank" aria-label="Specification Chips">
          ${ps.chipBank
            .map(
              (chip) => `
                <button
                  type="button"
                  class="met-spec-chip ${usedValues.has(chip) ? 'is-used' : ''}"
                  data-met-action="pick-spec-chip"
                  data-q-id="${escapeHtml(q.id)}"
                  data-chip="${escapeHtml(chip)}"
                >
                  ${escapeHtml(chip)}
                </button>
              `,
            )
            .join('')}
        </div>
      `
      : '';

  let feedbackHtml = '';
  if (ps.checked) {
    if (ps.isPerfect) {
      feedbackHtml = `
        <div class="met-feedback-banner is-success">
          <strong>Spot-on Grade 9 PEEL chain!</strong> Point &rarr; Evidence &rarr; Explain &rarr; Link/Judgement in exact causal sequence with accurate spec detail.
        </div>
      `;
    } else {
      const answerSummary = q.drills.peel.blanks.map((b) => `${b.answer}`).join(' · ');
      feedbackHtml = `
        <div class="met-feedback-banner is-warn">
          <strong>Almost there!</strong> Check the <span style="font-weight:800;">[POINT] &rarr; [EVIDENCE] &rarr; [EXPLAIN] &rarr; [LINK]</span> badges above${answerSummary ? ` (Key spec terms: <strong>${escapeHtml(answerSummary)}</strong>)` : ''}, or tap Reset to retry.
        </div>
      `;
    }
  }

  return `
    <div class="met-drill-stage">
      <div class="met-drill-prompt">
        <span>Tap the 4 blocks in causal order (1&ndash;4)${q.drills.peel.blanks.length > 0 ? ' &amp; fill the spec gaps' : ''}:</span>
        <span class="met-xp-pill ${earned ? 'is-earned' : ''}">${earned ? '✓ +30 XP Earned' : '+30 XP'}</span>
      </div>
      <div class="met-peel-tiles">
        ${tilesHtml}
      </div>
      ${chipsHtml}
      ${feedbackHtml}
      <div class="met-drill-footer">
        <button type="button" class="met-btn-secondary" data-met-action="reset-peel" data-q-id="${escapeHtml(q.id)}">
          <i class="fa-solid fa-rotate-left"></i> Reset
        </button>
        <button type="button" class="met-btn-action" data-met-action="check-peel" data-q-id="${escapeHtml(q.id)}">
          <i class="fa-solid fa-circle-check"></i> Check PEEL Chain
        </button>
      </div>
    </div>
  `;
}

function renderPlanDrillHTML(q, ui) {
  const pl = ui.plan;
  const earned = trainerState.earnedXpSet.has(`${q.id}:plan`);
  const targetCount = q.drills.plan.targetFactorCount;

  const factorsHtml = pl.shuffledFactors
    .map((f) => {
      const isSelected = pl.selectedFactorIds.has(f.id);
      let cls = isSelected ? 'is-selected' : '';
      if (pl.checked) {
        if (f.isStrong) cls = 'is-correct';
        else if (isSelected && !f.isStrong) cls = 'is-wrong';
      }
      return `
        <button
          type="button"
          class="met-choice-item ${cls}"
          data-met-action="toggle-plan-factor"
          data-q-id="${escapeHtml(q.id)}"
          data-factor-id="${escapeHtml(f.id)}"
        >
          <span>${isSelected ? '☑' : '☐'}</span>
          <span>${escapeHtml(f.text)}</span>
        </button>
      `;
    })
    .join('');

  const evChipsHtml =
    q.drills.plan.evidenceChips.length > 0
      ? `
        <div class="met-plan-section-lbl">2. Pair Lesson Evidence Chips (tap 2+):</div>
        <div class="met-ev-pill-row">
          ${q.drills.plan.evidenceChips
            .map((ev) => {
              const sel = pl.selectedEvidenceIds.has(ev.id);
              return `
                <button
                  type="button"
                  class="met-ev-pill ${sel ? 'is-selected' : ''}"
                  data-met-action="toggle-plan-ev"
                  data-q-id="${escapeHtml(q.id)}"
                  data-ev-id="${escapeHtml(ev.id)}"
                  title="${escapeHtml(ev.detail)}"
                >
                  ${sel ? '✓ ' : '+ '}${escapeHtml(ev.label)}
                </button>
              `;
            })
            .join('')}
        </div>
      `
      : '';

  const concHtml = pl.shuffledConclusions
    .map((c) => {
      const isSelected = pl.selectedConclusionId === c.id;
      let cls = isSelected ? 'is-selected' : '';
      if (pl.checked) {
        if (c.isBest) cls = 'is-correct';
        else if (isSelected && !c.isBest) cls = 'is-wrong';
      }
      return `
        <button
          type="button"
          class="met-choice-item ${cls}"
          data-met-action="select-plan-conc"
          data-q-id="${escapeHtml(q.id)}"
          data-conc-id="${escapeHtml(c.id)}"
        >
          <span>${isSelected ? '●' : '○'}</span>
          <span>${escapeHtml(c.text)}</span>
        </button>
      `;
    })
    .join('');

  let feedbackHtml = '';
  if (pl.checked) {
    const chosenConc = pl.shuffledConclusions.find((c) => c.id === pl.selectedConclusionId);
    const strongChosenCount = [...pl.selectedFactorIds].filter((id) =>
      pl.shuffledFactors.find((f) => f.id === id && f.isStrong),
    ).length;
    const wrongFactorPicked = [...pl.selectedFactorIds].some((id) =>
      pl.shuffledFactors.find((f) => f.id === id && !f.isStrong),
    );
    const isStrongPlan =
      strongChosenCount >= Math.min(2, targetCount) &&
      !wrongFactorPicked &&
      Boolean(chosenConc?.isBest);

    feedbackHtml = `
      <div class="met-feedback-banner ${isStrongPlan ? 'is-success' : 'is-warn'}">
        <strong>${isStrongPlan ? 'Rapid Grade 9 Skeleton Locked!' : 'Plan Diagnostic:'}</strong>
        ${escapeHtml(chosenConc?.feedback || 'Select the sustained judgement clincher highlighted in green.')}
      </div>
    `;
  }

  return `
    <div class="met-drill-stage">
      <div class="met-drill-prompt">
        <span>Build a rapid essay plan in 60 seconds:</span>
        <div style="display:inline-flex;align-items:center;gap:6px;">
          <button
            type="button"
            class="met-xp-pill"
            data-met-action="toggle-plan-timer"
            data-q-id="${escapeHtml(q.id)}"
            style="cursor:pointer;"
          >
            ⏱️ <span id="met-plan-timer-${escapeHtml(q.id)}">${pl.secondsLeft}s</span> ${pl.timerRunning ? 'Pause' : 'Start'}
          </button>
          <span class="met-xp-pill ${earned ? 'is-earned' : ''}">${earned ? '✓ +30 XP' : '+30 XP'}</span>
        </div>
      </div>

      <div class="met-plan-section-lbl">1. Pick the ${targetCount} strongest analytical points:</div>
      <div class="met-choice-list">${factorsHtml}</div>

      ${evChipsHtml}

      <div class="met-plan-section-lbl">3. Select the strongest sustained judgement:</div>
      <div class="met-choice-list">${concHtml}</div>

      ${feedbackHtml}

      <div class="met-drill-footer">
        <button type="button" class="met-btn-secondary" data-met-action="reset-plan" data-q-id="${escapeHtml(q.id)}">
          <i class="fa-solid fa-rotate-left"></i> Reset
        </button>
        <button type="button" class="met-btn-action" data-met-action="check-plan" data-q-id="${escapeHtml(q.id)}">
          <i class="fa-solid fa-check-double"></i> Check 60s Plan
        </button>
      </div>
    </div>
  `;
}

function renderExaminerDrillHTML(q, ui) {
  const ex = ui.examiner;
  const earned = trainerState.earnedXpSet.has(`${q.id}:examiner`);

  const optsHtml = ex.shuffledOptions
    .map((opt) => {
      const isSelected = ex.selectedOptionId === opt.id;
      let cls = isSelected ? 'is-selected' : '';
      if (ex.checked) {
        if (opt.isCorrect) cls = 'is-correct';
        else if (isSelected && !opt.isCorrect) cls = 'is-wrong';
      }
      return `
        <button
          type="button"
          class="met-choice-item ${cls}"
          data-met-action="pick-examiner-flaw"
          data-q-id="${escapeHtml(q.id)}"
          data-opt-id="${escapeHtml(opt.id)}"
        >
          <span>${isSelected ? '●' : '○'}</span>
          <span>${escapeHtml(opt.label)}</span>
        </button>
      `;
    })
    .join('');

  let revealHtml = '';
  if (ex.checked) {
    const picked = ex.shuffledOptions.find((o) => o.id === ex.selectedOptionId);
    revealHtml = `
      <div class="met-feedback-banner ${picked?.isCorrect ? 'is-success' : 'is-warn'}">
        <strong>${picked?.isCorrect ? 'Exact Examiner Diagnosis!' : 'Mark Scheme Diagnosis:'}</strong>
        ${escapeHtml(q.drills.examiner.examinerVerdict)}
      </div>
      <div class="met-upgrade-box">
        <strong>🌟 Grade 9 Examiner Upgrade:</strong>
        ${q.drills.examiner.upgradeSnippetHtml}
      </div>
    `;
  }

  return `
    <div class="met-drill-stage">
      <div class="met-drill-prompt">
        <span>Read this student script &amp; diagnose what holds it back:</span>
        <span class="met-xp-pill ${earned ? 'is-earned' : ''}">${earned ? '✓ +25 XP Earned' : '+25 XP'}</span>
      </div>

      <div class="met-student-script">
        <span class="met-student-script-badge">${escapeHtml(q.drills.examiner.attemptBadge)}</span>
        ${q.drills.examiner.studentTextHtml}
      </div>

      <div class="met-choice-list">
        ${optsHtml}
      </div>

      ${revealHtml}

      <div class="met-drill-footer">
        <button type="button" class="met-btn-secondary" data-met-action="reset-examiner" data-q-id="${escapeHtml(q.id)}">
          <i class="fa-solid fa-rotate-left"></i> Retry
        </button>
        <button type="button" class="met-btn-action" data-met-action="check-examiner" data-q-id="${escapeHtml(q.id)}">
          <i class="fa-solid fa-magnifying-glass-chart"></i> Reveal Examiner Upgrade
        </button>
      </div>
    </div>
  `;
}

function highlightMatchedSpecTermsHTML(rawText, specTargets) {
  let safe = escapeHtml(rawText);
  const allVariants = [];
  specTargets.forEach((t) => {
    t.variants.forEach((v) => {
      if (v && v.length >= 3) allVariants.push(v);
    });
  });
  allVariants.sort((a, b) => b.length - a.length);
  if (allVariants.length === 0) return safe;

  const pattern = allVariants
    .map((v) => escapeHtml(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const rx = new RegExp(`(${pattern})`, 'gi');
  return safe.replace(rx, '<span class="met-spec-hit">$1</span>');
}

function renderBlurtDrillHTML(q, ui) {
  const bl = ui.blurt;
  const earned = trainerState.earnedXpSet.has(`${q.id}:blurt`);
  const isListening = trainerState.listeningQuestionId === q.id;
  const speechSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  let selfMarkHtml = '';
  if (bl.selfMarked) {
    const totalTargets = Math.max(1, q.drills.blurt.specTargets.length);
    const hitCount = bl.matchedLabels.length;

    const missedRowsHtml =
      bl.missedTargets.length > 0
        ? `
          <div class="met-next-terms">
            <div style="font-size:0.76rem;font-weight:800;color:#475569;margin-top:4px;">High-tariff spec terms to add next time:</div>
            ${bl.missedTargets
              .slice(0, 3)
              .map(
                (t) => `
                  <div class="met-next-term-row">
                    <strong>+ ${escapeHtml(t.label)}:</strong> ${escapeHtml(t.hint)}
                  </div>
                `,
              )
              .join('')}
          </div>
        `
        : '';

    selfMarkHtml = `
      <div class="met-feedback-banner ${hitCount >= 2 ? 'is-success' : 'is-warn'}">
        <strong>Matched ${hitCount} / ${totalTargets} High-Tariff Spec Points!</strong>
        ${
          bl.matchedLabels.length > 0
            ? ` Hits: <strong>${escapeHtml(bl.matchedLabels.join(' · '))}</strong>.`
            : ' Try adding specific 4-digit dates, key individuals, and specialist vocabulary below.'
        }
      </div>
      ${
        bl.draftText.trim()
          ? `<div class="met-blurt-highlighted">${highlightMatchedSpecTermsHTML(bl.draftText, q.drills.blurt.specTargets)}</div>`
          : ''
      }
      ${missedRowsHtml}
    `;
  }

  return `
    <div class="met-drill-stage">
      <div class="met-drill-prompt">
        <span>Speak or bullet-point everything you’d put in this answer:</span>
        <span class="met-xp-pill ${earned ? 'is-earned' : ''}">${earned ? '✓ +30 XP Earned' : '+30 XP'}</span>
      </div>

      <div class="met-blurt-toolbar">
        ${
          speechSupported
            ? `<button
                type="button"
                class="met-dictate-btn ${isListening ? 'is-listening' : ''}"
                data-met-action="toggle-dictate"
                data-q-id="${escapeHtml(q.id)}"
              >
                🎙️ <span>${isListening ? 'Stop Dictating' : 'Dictate Answer'}</span>
              </button>`
            : `<span style="font-size:0.76rem;color:#64748b;font-weight:600;">💡 Tip: Tap your keyboard’s 🎙️ mic icon or type quick bullets below</span>`
        }
        ${
          q.starterSentence
            ? `<button type="button" class="met-wagoll-pill" data-met-action="insert-starter" data-q-id="${escapeHtml(q.id)}">+ Add Starter</button>`
            : ''
        }
      </div>

      <textarea
        id="met-blurt-input-${escapeHtml(q.id)}"
        class="met-blurt-textarea"
        data-q-id="${escapeHtml(q.id)}"
        placeholder="${escapeHtml(q.drills.blurt.starterHint)}"
        aria-label="Your quick bullet or spoken answer"
      >${escapeHtml(bl.draftText)}</textarea>

      ${selfMarkHtml}

      <div class="met-drill-footer">
        <button type="button" class="met-btn-secondary" data-met-action="clear-blurt" data-q-id="${escapeHtml(q.id)}">
          <i class="fa-solid fa-eraser"></i> Clear
        </button>
        <button type="button" class="met-btn-action" data-met-action="self-mark-blurt" data-q-id="${escapeHtml(q.id)}">
          <i class="fa-solid fa-bolt"></i> Instant Self-Mark
        </button>
      </div>
    </div>
  `;
}

function renderInteractiveDrillDrawerHTML(q, ui) {
  if (ui.openPanel !== 'practise') return '';

  const tabs = [
    { key: 'peel', icon: '🧱', label: 'PEEL Builder' },
    { key: 'plan', icon: '⏱️', label: '60s Plan' },
    { key: 'examiner', icon: '🧐', label: 'Examiner' },
    { key: 'blurt', icon: '🎙️', label: 'Speak / Blurt' },
  ];

  const tabsHtml = tabs
    .map(
      (t) => `
        <button
          type="button"
          class="met-drill-tab ${ui.activeDrill === t.key ? 'is-active' : ''}"
          data-met-action="switch-drill"
          data-q-id="${escapeHtml(q.id)}"
          data-drill="${t.key}"
        >
          <span>${t.icon}</span>
          <span>${t.label}</span>
        </button>
      `,
    )
    .join('');

  let stageHtml = '';
  if (ui.activeDrill === 'peel') stageHtml = renderPeelDrillHTML(q, ui);
  else if (ui.activeDrill === 'plan') stageHtml = renderPlanDrillHTML(q, ui);
  else if (ui.activeDrill === 'examiner') stageHtml = renderExaminerDrillHTML(q, ui);
  else stageHtml = renderBlurtDrillHTML(q, ui);

  return `
    <div class="met-drill-drawer" role="region" aria-label="Interactive Exam Practice Drills">
      <div class="met-drill-tabs" role="tablist">
        ${tabsHtml}
      </div>
      ${stageHtml}
    </div>
  `;
}

function renderWagollDrawerHTML(q, ui) {
  if (ui.openPanel !== 'wagoll') return '';
  const isSpeaking = trainerState.speakingQuestionId === q.id;

  const segmentsHtml = q.wagollSegments
    .map((seg, idx) => {
      const roleLower = seg.role.toLowerCase();
      // Preserve individual chip reveal state if recallMode is active
      let segHtml = seg.html;
      if (ui.recallMode && ui.revealedChips.size > 0) {
        let chipCounter = 0;
        segHtml = segHtml.replace(
          /class="met-recall-chip"/g,
          () => {
            const key = `${idx}_${chipCounter++}`;
            return ui.revealedChips.has(key)
              ? `class="met-recall-chip is-revealed" data-chip-key="${key}"`
              : `class="met-recall-chip" data-chip-key="${key}"`;
          },
        );
      } else {
        let chipCounter = 0;
        segHtml = segHtml.replace(
          /class="met-recall-chip"/g,
          () => `class="met-recall-chip" data-chip-key="${idx}_${chipCounter++}"`,
        );
      }

      return `
        <div class="met-wagoll-seg">
          <span class="met-role-badge role-${roleLower}">[${escapeHtml(seg.role)}]</span>
          <span>${segHtml}</span>
        </div>
      `;
    })
    .join('');

  return `
    <div class="met-wagoll-drawer ${ui.recallMode ? 'is-recall-mode' : ''}" data-wagoll-q="${escapeHtml(q.id)}">
      <div class="met-wagoll-toolbar">
        <button
          type="button"
          class="met-wagoll-pill ${ui.recallMode ? 'is-active' : ''}"
          data-met-action="toggle-recall-blur"
          data-q-id="${escapeHtml(q.id)}"
        >
          🎯 <span>${ui.recallMode ? 'Show All Dates & Terms' : 'Hide Key Dates & Terms'}</span>
        </button>
        <button
          type="button"
          class="met-wagoll-pill ${isSpeaking ? 'is-active' : ''}"
          data-met-action="speak-wagoll"
          data-q-id="${escapeHtml(q.id)}"
        >
          🔊 <span>${isSpeaking ? 'Stop Audio' : 'Listen'}</span>
        </button>
      </div>

      ${
        ui.recallMode
          ? '<div style="font-size:0.75rem;font-weight:700;color:#4f46e5;">Tap any blurred date or term below to test yourself and reveal it:</div>'
          : ''
      }

      <div class="met-wagoll-segments">
        ${segmentsHtml}
      </div>

      <div class="met-examiner-tip">
        <strong>💡 Examiner Tip:</strong> ${escapeHtml(q.examinerTip)}
      </div>
    </div>
  `;
}

function renderStimulusBlockHTML(q) {
  const hasBullets = q.stimulusBullets && q.stimulusBullets.length > 0;
  const hasSources = q.sources && q.sources.length > 0;
  if (!hasBullets && !hasSources) return '';

  const summaryLabel = hasSources
    ? `📜 View ${q.sources.map((s) => s.label).join(' & ')} (${q.sources.length})`
    : `📌 Exam Prompt Points (${q.stimulusBullets.length})`;

  const bulletsHtml = hasBullets
    ? `
      <div>
        <div style="font-size:0.75rem;font-weight:800;margin-bottom:4px;opacity:0.85;">You may use the following in your answer:</div>
        <ul class="met-stimulus-bullets">
          ${q.stimulusBullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  const sourcesHtml = hasSources
    ? q.sources
        .map(
          (src) => `
            <div class="met-source-box ${src.isInterp ? 'is-interp' : ''}">
              <div class="met-source-title">${escapeHtml(src.title)}</div>
              ${src.provenance ? `<div class="met-source-prov">${escapeHtml(src.provenance)}</div>` : ''}
              ${
                src.image
                  ? `<img src="${escapeHtml(src.image)}" alt="${escapeHtml(src.title)}" class="met-source-img archival-image" loading="lazy" />`
                  : ''
              }
              <div class="met-source-content">${src.contentHtml}</div>
            </div>
          `,
        )
        .join('')
    : '';

  // Auto-open primary sources & interpretations (Paper 1A & Paper 3) so pupils never miss stimuli
  const defaultOpen = hasSources;

  return `
    <details class="met-stimulus-details" ${defaultOpen ? 'open' : ''}>
      <summary>
        <span>${escapeHtml(summaryLabel)}</span>
        <i class="fa-solid fa-chevron-down" style="font-size:0.74rem;"></i>
      </summary>
      <div class="met-stimulus-body">
        ${bulletsHtml}
        ${
          sourcesHtml
            ? `<div class="met-sources-grid ${q.sources.length > 1 ? 'has-multiple-sources' : ''}">${sourcesHtml}</div>`
            : ''
        }
      </div>
    </details>
  `;
}

function renderQuestionCardHTML(q, cardIdx, showFullLessonTag = false) {
  const ui = getOrCreateCardState(q);
  const spagSuffix = q.spagMarks ? ' (+4 SPaG)' : '';
  const stemHtml = q.stemHighlight?.html || escapeHtml(q.question);
  const trapNoteHtml = q.stemHighlight?.trapWarning
    ? `<div class="met-stem-trap-note"><i class="fa-solid fa-bullseye" style="margin-top:2px;flex-shrink:0;"></i><span>${escapeHtml(q.stemHighlight.trapWarning)}</span></div>`
    : '';
  const dateFenceHtml = q.dateFence
    ? `
      <div class="met-date-fence-bar">
        <span class="met-df-badge">📅 Fence: ${escapeHtml(q.dateFence.fenceLabel)}</span>
        ${q.dateFence.insideText ? `<span class="met-df-in">✓ Inside: ${escapeHtml(q.dateFence.insideText)}</span>` : ''}
        ${q.dateFence.outsideText ? `<span class="met-df-out">✕ Outside (0m): ${escapeHtml(q.dateFence.outsideText)}</span>` : ''}
      </div>
    `
    : '';

  return `
    <article
      class="met-question-card"
      id="met-q-${cardIdx + 1}"
      data-q-id="${escapeHtml(q.id)}"
    >
      <div class="met-qcard-header">
        <div class="met-qcard-badges">
          <span class="met-tariff-badge t-${escapeHtml(q.tariffKey)}">
            ${escapeHtml(q.badgeLabel)}${escapeHtml(spagSuffix)} &middot; ~${q.minsSuggested}m
          </span>
          <span class="met-lesson-tag" title="${escapeHtml(q.lessonTitle)}">
            ${escapeHtml(showFullLessonTag ? q.lessonShortTag : q.lessonCode)}
          </span>
        </div>
        <button
          type="button"
          class="met-share-btn"
          data-met-action="share-question"
          data-q-id="${escapeHtml(q.id)}"
          title="Share direct link to this question and Grade 9 answer"
        >
          <i class="fa-solid fa-arrow-up-from-bracket" style="color:#2563eb;font-size:0.78rem;"></i>
          <span>Share</span>
        </button>
      </div>

      <p class="met-qstem">${stemHtml}</p>
      ${trapNoteHtml}
      ${dateFenceHtml}

      ${renderStimulusBlockHTML(q)}

      <div class="met-cta-row">
        <button
          type="button"
          class="met-cta-btn met-cta-practise ${ui.openPanel === 'practise' ? 'is-open' : ''}"
          data-met-action="toggle-practise"
          data-q-id="${escapeHtml(q.id)}"
          aria-expanded="${ui.openPanel === 'practise' ? 'true' : 'false'}"
        >
          <i class="fa-solid fa-layer-group"></i>
          <span>Practise</span>
        </button>
        <button
          type="button"
          class="met-cta-btn met-cta-wagoll ${ui.openPanel === 'wagoll' ? 'is-open' : ''}"
          data-met-action="toggle-wagoll"
          data-q-id="${escapeHtml(q.id)}"
          aria-expanded="${ui.openPanel === 'wagoll' ? 'true' : 'false'}"
        >
          <i class="fa-solid fa-award" style="color:#d97706;"></i>
          <span>Grade 9 Answer</span>
        </button>
      </div>

      ${renderInteractiveDrillDrawerHTML(q, ui)}
      ${renderWagollDrawerHTML(q, ui)}
    </article>
  `;
}

function renderCardsViewHTML() {
  const dir = trainerState.directory;
  if (!dir) return '';

  const qSearch = trainerState.searchQuery.trim().toLowerCase();
  const tf = trainerState.activeTariff;
  const hasLessonSelected =
    typeof trainerState.selectedLessonIndex === 'number' &&
    trainerState.selectedLessonIndex >= 0 &&
    dir.lessons[trainerState.selectedLessonIndex];

  const activeLesson = hasLessonSelected ? dir.lessons[trainerState.selectedLessonIndex] : null;
  const isSearchMode = Boolean(qSearch);
  const hasFamilyFilter = Array.isArray(trainerState.familyFilter) && trainerState.familyFilter.length > 0;
  const hasWeakFilter = trainerState.weakLessonSet instanceof Set && trainerState.weakLessonSet.size > 0;

  let pool = [];
  if (isSearchMode) {
    const terms = qSearch.split(/\s+/).filter(Boolean);
    pool = dir.allQuestions.filter((q) =>
      terms.every((term) => q.searchHaystack.includes(term)),
    );
  } else if (activeLesson) {
    pool = activeLesson.questions;
  } else {
    pool = dir.allQuestions;
  }

  if (hasFamilyFilter) {
    const famSet = new Set(trainerState.familyFilter);
    pool = pool.filter((q) => famSet.has(q.family));
  }
  if (hasWeakFilter) {
    pool = pool.filter((q) => trainerState.weakLessonSet.has(q.lessonIndex));
  }
  if (tf !== 'all') {
    pool = pool.filter((q) => q.tariffKey === tf);
  }

  const backLabel = `← All Topics in ${dir.courseMeta.pillLabel}`;
  const readLessonIdx =
    activeLesson?.lessonIndex ?? (pool[0] ? pool[0].lessonIndex : 0);

  const slotBannerHtml =
    hasFamilyFilter || hasWeakFilter
      ? `
        <div class="met-active-slot-banner">
          <span>🎯 ${escapeHtml(trainerState.familySlotLabel || trainerState.weakFilterLabel || 'Filtered Questions')} (${pool.length} ${pool.length === 1 ? 'question' : 'questions'})</span>
          <button type="button" class="met-slot-clear-btn" data-met-action="reset-filters">✕ Show All Topics</button>
        </div>
      `
      : '';

  const headingHtml = isSearchMode
    ? `
      <div class="met-lesson-focus-heading">
        <div class="met-lesson-focus-eyebrow">${escapeHtml(dir.courseMeta.shortTitle)} &middot; Instant Search</div>
        <h2 class="met-lesson-focus-title">${pool.length} matching ${pool.length === 1 ? 'question' : 'questions'} for “${escapeHtml(trainerState.searchQuery.trim())}”</h2>
      </div>
    `
    : activeLesson
      ? `
        <div class="met-lesson-focus-heading">
          <div class="met-lesson-focus-eyebrow">${escapeHtml(activeLesson.ktLabel)}</div>
          <h2 class="met-lesson-focus-title">${escapeHtml(activeLesson.lessonTitle)}</h2>
        </div>
      `
      : '';

  const cardsHtml =
    pool.length > 0
      ? `<div class="met-cards-stack">${pool
          .map((q, idx) => renderQuestionCardHTML(q, idx, isSearchMode || !activeLesson))
          .join('')}</div>`
      : `
        <div class="met-empty-state">
          <p style="margin:0 0 10px;font-weight:700;">No matching questions found${tf !== 'all' ? ` for ${escapeHtml(tf)}` : ''}.</p>
          <button type="button" class="met-nav-pill" data-met-action="reset-filters">Reset Search &amp; Filters</button>
        </div>
      `;

  return `
    ${slotBannerHtml}
    <div class="met-viewb-topbar">
      <button type="button" class="met-nav-pill" data-met-action="back-to-directory">
        <span>${escapeHtml(backLabel)}</span>
      </button>
      <button
        type="button"
        class="met-nav-pill met-nav-pill-lesson"
        data-met-action="read-lesson"
        data-lesson-index="${readLessonIdx}"
      >
        <span>📖</span>
        <span>Read Lesson</span>
      </button>
    </div>
    ${headingHtml}
    ${cardsHtml}
  `;
}

function isInViewStateB() {
  return (
    Boolean(trainerState.searchQuery.trim()) ||
    (Array.isArray(trainerState.familyFilter) && trainerState.familyFilter.length > 0) ||
    (trainerState.weakLessonSet instanceof Set && trainerState.weakLessonSet.size > 0) ||
    (typeof trainerState.selectedLessonIndex === 'number' && trainerState.selectedLessonIndex >= 0)
  );
}

function updateBodyRegionOnly() {
  const bodyEl = document.getElementById('met-dynamic-body');
  if (!bodyEl) return;
  bodyEl.innerHTML = isInViewStateB() ? renderCardsViewHTML() : renderDirectoryViewHTML();
}

function rerenderSingleQuestionCard(qId) {
  const dir = trainerState.directory;
  if (!dir) return;
  const q = dir.allQuestions.find((item) => item.id === qId);
  const existingEl = document.querySelector(`.met-question-card[data-q-id="${qId}"]`);
  if (!q || !existingEl) {
    updateBodyRegionOnly();
    return;
  }
  const idAttr = existingEl.id || 'met-q-1';
  const cardIdx = Math.max(0, (parseInt(idAttr.replace('met-q-', ''), 10) || 1) - 1);
  const showFullTag = Boolean(trainerState.searchQuery.trim()) || trainerState.selectedLessonIndex === null;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderQuestionCardHTML(q, cardIdx, showFullTag).trim();
  const nextEl = wrapper.firstElementChild;
  if (nextEl) {
    existingEl.replaceWith(nextEl);
  }
}

function renderFullTrainerDOM() {
  const mainEl = document.getElementById(trainerState.mountId || 'main-content');
  if (!mainEl) return;

  mainEl.innerHTML = `
    <div class="met-root ${trainerState.embeddedInHub ? 'is-hub-embedded' : ''}" id="met-trainer-root">
      ${renderStickyDeckHTML()}
      <div id="met-dynamic-body">
        ${isInViewStateB() ? renderCardsViewHTML() : renderDirectoryViewHTML()}
      </div>
    </div>
  `;

  attachTrainerDelegatedEvents(mainEl);
}

function findQuestionById(qId) {
  return trainerState.directory?.allQuestions.find((q) => q.id === qId) || null;
}

function handleToggleDictation(q) {
  const SpeechRec =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!SpeechRec) return;

  if (trainerState.listeningQuestionId === q.id && trainerState.activeRecognition) {
    stopActiveSpeechAndMic();
    rerenderSingleQuestionCard(q.id);
    return;
  }

  stopActiveSpeechAndMic();
  const ui = getOrCreateCardState(q);

  try {
    const rec = new SpeechRec();
    rec.lang = 'en-GB';
    rec.continuous = true;
    rec.interimResults = true;

    const basePrefix = ui.blurt.draftText ? `${ui.blurt.draftText.trim()} ` : '';
    let finalAccum = '';

    rec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          finalAccum += `${transcript.trim()} `;
        } else {
          interim += transcript;
        }
      }
      ui.blurt.draftText = `${basePrefix}${finalAccum}${interim}`.trimStart();
      const ta = document.getElementById(`met-blurt-input-${q.id}`);
      if (ta) ta.value = ui.blurt.draftText;
    };

    rec.onerror = () => {
      stopActiveSpeechAndMic();
      rerenderSingleQuestionCard(q.id);
    };

    rec.onend = () => {
      trainerState.activeRecognition = null;
      trainerState.listeningQuestionId = null;
      rerenderSingleQuestionCard(q.id);
    };

    trainerState.activeRecognition = rec;
    trainerState.listeningQuestionId = q.id;
    rec.start();
    rerenderSingleQuestionCard(q.id);
  } catch (e) {
    stopActiveSpeechAndMic();
  }
}

function handleSpeakWagoll(q) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  if (trainerState.speakingQuestionId === q.id) {
    stopActiveSpeechAndMic();
    rerenderSingleQuestionCard(q.id);
    return;
  }

  stopActiveSpeechAndMic();
  try {
    const utter = new SpeechSynthesisUtterance(q.plainModelText);
    utter.lang = 'en-GB';
    utter.rate = 0.98;
    const voices = window.speechSynthesis.getVoices?.() || [];
    const ukVoice =
      voices.find((v) => /en-GB/i.test(v.lang) && /Daniel|Arthur|Martha|Google UK|Libby|Sonia/i.test(v.name)) ||
      voices.find((v) => /en-GB/i.test(v.lang));
    if (ukVoice) utter.voice = ukVoice;

    utter.onend = () => {
      trainerState.speakingQuestionId = null;
      rerenderSingleQuestionCard(q.id);
    };
    utter.onerror = () => {
      trainerState.speakingQuestionId = null;
      rerenderSingleQuestionCard(q.id);
    };

    trainerState.speakingQuestionId = q.id;
    window.speechSynthesis.speak(utter);
    rerenderSingleQuestionCard(q.id);
  } catch (e) {
    trainerState.speakingQuestionId = null;
  }
}

function handleTogglePlanTimer(q) {
  const ui = getOrCreateCardState(q);
  const pl = ui.plan;

  if (pl.timerRunning) {
    pl.timerRunning = false;
    const existing = trainerState.planTimers.get(q.id);
    if (existing) clearInterval(existing);
    trainerState.planTimers.delete(q.id);
    rerenderSingleQuestionCard(q.id);
    return;
  }

  if (pl.secondsLeft <= 0) pl.secondsLeft = 60;
  pl.timerRunning = true;
  rerenderSingleQuestionCard(q.id);

  const intervalId = setInterval(() => {
    const liveSpan = document.getElementById(`met-plan-timer-${q.id}`);
    if (!liveSpan) {
      clearInterval(intervalId);
      trainerState.planTimers.delete(q.id);
      pl.timerRunning = false;
      return;
    }
    pl.secondsLeft = Math.max(0, pl.secondsLeft - 1);
    liveSpan.textContent = `${pl.secondsLeft}s`;
    if (pl.secondsLeft <= 0) {
      clearInterval(intervalId);
      trainerState.planTimers.delete(q.id);
      pl.timerRunning = false;
      rerenderSingleQuestionCard(q.id);
    }
  }, 1000);

  trainerState.planTimers.set(q.id, intervalId);
}

function attachTrainerDelegatedEvents(mainEl) {
  const root = mainEl.querySelector('#met-trainer-root');
  if (!root) return;

  const searchInput = root.querySelector('#met-search-input');
  const clearBtn = root.querySelector('#met-search-clear-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      trainerState.searchQuery = e.target.value || '';
      if (clearBtn) {
        clearBtn.style.display = trainerState.searchQuery ? '' : 'none';
      }
      updateBodyRegionOnly();
    });
  }

  root.addEventListener('input', (e) => {
    const target = e.target;
    if (target && target.classList && target.classList.contains('met-blurt-textarea')) {
      const qId = target.getAttribute('data-q-id');
      const q = findQuestionById(qId);
      if (q) {
        const ui = getOrCreateCardState(q);
        ui.blurt.draftText = target.value;
      }
    }
  });

  root.addEventListener('click', async (e) => {
    // 1. Tap-to-reveal individual blurred recall chips inside Grade 9 WAGOLL
    const recallChip = e.target.closest('.met-recall-chip');
    if (recallChip) {
      const wagollDrawer = recallChip.closest('.met-wagoll-drawer');
      if (wagollDrawer && wagollDrawer.classList.contains('is-recall-mode')) {
        const qId = wagollDrawer.getAttribute('data-wagoll-q');
        const q = findQuestionById(qId);
        const chipKey = recallChip.getAttribute('data-chip-key');
        const willReveal = !recallChip.classList.contains('is-revealed');
        recallChip.classList.toggle('is-revealed', willReveal);
        if (q && chipKey) {
          const ui = getOrCreateCardState(q);
          if (willReveal) ui.revealedChips.add(chipKey);
          else ui.revealedChips.delete(chipKey);
        }
        return;
      }
    }

    const actionEl = e.target.closest('[data-met-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-met-action');

    if (action === 'select-course') {
      const nextUnit = actionEl.getAttribute('data-unit-id');
      if (nextUnit && nextUnit !== trainerState.unitId) {
        stopActiveSpeechAndMic();
        clearAllPlanTimers();
        if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
          await window.switchView('exam-trainer', nextUnit, false, {});
        } else {
          await renderMobileExamTrainer(nextUnit, {});
        }
      }
      return;
    }

    if (action === 'clear-search') {
      trainerState.searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      if (clearBtn) clearBtn.style.display = 'none';
      updateBodyRegionOnly();
      return;
    }

    if (action === 'select-tariff') {
      const nextTf = actionEl.getAttribute('data-tariff') || 'all';
      trainerState.activeTariff = nextTf;
      root.querySelectorAll('.met-tariff-pill').forEach((btn) => {
        const active = btn.getAttribute('data-tariff') === nextTf;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      updateBodyRegionOnly();
      return;
    }

    if (action === 'reset-filters') {
      trainerState.searchQuery = '';
      trainerState.activeTariff = 'all';
      trainerState.familyFilter = null;
      trainerState.familySlotLabel = '';
      trainerState.weakLessonSet = null;
      trainerState.weakFilterLabel = '';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('hh:exam-slot-filter-cleared'));
      }
      renderFullTrainerDOM();
      return;
    }

    if (action === 'open-lesson') {
      const idx = parseInt(actionEl.getAttribute('data-lesson-index'), 10);
      if (!isNaN(idx) && idx >= 0) {
        trainerState.selectedLessonIndex = idx;
        updateBodyRegionOnly();
        if (!trainerState.embeddedInHub) {
          window.scrollTo?.({ top: 0, behavior: 'instant' });
        }
      }
      return;
    }

    if (action === 'back-to-directory') {
      stopActiveSpeechAndMic();
      trainerState.selectedLessonIndex = null;
      trainerState.searchQuery = '';
      trainerState.familyFilter = null;
      trainerState.familySlotLabel = '';
      trainerState.weakLessonSet = null;
      trainerState.weakFilterLabel = '';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('hh:exam-slot-filter-cleared'));
      }
      renderFullTrainerDOM();
      if (!trainerState.embeddedInHub) {
        window.scrollTo?.({ top: 0, behavior: 'instant' });
      }
      return;
    }

    if (action === 'read-lesson') {
      stopActiveSpeechAndMic();
      const idx = parseInt(actionEl.getAttribute('data-lesson-index'), 10) || 0;
      if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
        window.switchView('lessons', trainerState.unitId, false, { lessonIndex: idx });
      }
      return;
    }

    // Question-scoped actions
    const qId =
      actionEl.getAttribute('data-q-id') ||
      actionEl.closest('.met-question-card')?.getAttribute('data-q-id');
    const q = findQuestionById(qId);
    if (!q) return;
    const ui = getOrCreateCardState(q);

    if (action === 'share-question') {
      window.shareHubExamQuestion?.({
        btnEl: actionEl,
        unitId: trainerState.unitId,
        lessonIndex: q.lessonIndex,
        questionNum: q.lessonQuestionNum,
        questionText: q.question,
        marks: q.marks,
      });
      return;
    }

    if (action === 'toggle-practise') {
      stopActiveSpeechAndMic();
      ui.openPanel = ui.openPanel === 'practise' ? null : 'practise';
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'toggle-wagoll') {
      stopActiveSpeechAndMic();
      ui.openPanel = ui.openPanel === 'wagoll' ? null : 'wagoll';
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'switch-drill') {
      stopActiveSpeechAndMic();
      const nextDrill = actionEl.getAttribute('data-drill') || 'peel';
      ui.activeDrill = nextDrill;
      rerenderSingleQuestionCard(q.id);
      return;
    }

    // --- Drill 1: PEEL Builder ---
    if (action === 'focus-blank') {
      e.stopPropagation();
      const blankId = actionEl.getAttribute('data-blank-id');
      if (blankId) {
        if (ui.peel.filledBlanks[blankId]) {
          delete ui.peel.filledBlanks[blankId];
        }
        ui.peel.activeBlankId = blankId;
        ui.peel.checked = false;
        rerenderSingleQuestionCard(q.id);
      }
      return;
    }

    if (action === 'toggle-peel-tile') {
      const tileId = actionEl.getAttribute('data-tile-id');
      if (!tileId) return;
      ui.peel.checked = false;
      const pos = ui.peel.pickedTileIds.indexOf(tileId);
      if (pos !== -1) {
        ui.peel.pickedTileIds.splice(pos, 1);
      } else {
        ui.peel.pickedTileIds.push(tileId);
      }
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'pick-spec-chip') {
      const chipVal = actionEl.getAttribute('data-chip');
      if (!chipVal || q.drills.peel.blanks.length === 0) return;
      ui.peel.checked = false;
      const targetBlankId =
        ui.peel.activeBlankId ||
        q.drills.peel.blanks.find((b) => !ui.peel.filledBlanks[b.blankId])?.blankId ||
        q.drills.peel.blanks[0].blankId;

      ui.peel.filledBlanks[targetBlankId] = chipVal;
      const nextEmpty = q.drills.peel.blanks.find((b) => !ui.peel.filledBlanks[b.blankId]);
      ui.peel.activeBlankId = nextEmpty ? nextEmpty.blankId : targetBlankId;
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'reset-peel') {
      ui.peel.pickedTileIds = [];
      ui.peel.filledBlanks = {};
      ui.peel.activeBlankId = q.drills.peel.blanks[0]?.blankId || null;
      ui.peel.checked = false;
      ui.peel.isPerfect = false;
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'check-peel') {
      // Auto-complete remaining unpicked tiles in visual order so pupils get instant feedback
      if (ui.peel.pickedTileIds.length < 4) {
        ui.peel.shuffledTiles.forEach((t) => {
          if (!ui.peel.pickedTileIds.includes(t.id)) {
            ui.peel.pickedTileIds.push(t.id);
          }
        });
      }
      const orderCorrect = ui.peel.pickedTileIds.every((id, idx) => id === `tile_${idx}`);
      const blanksCorrect = q.drills.peel.blanks.every(
        (b) =>
          String(ui.peel.filledBlanks[b.blankId] || '').toLowerCase() === b.normalizedAnswer,
      );
      ui.peel.checked = true;
      ui.peel.isPerfect = orderCorrect && blanksCorrect;
      if (ui.peel.isPerfect) {
        awardDrillXpOnce(q.id, 'peel', 30, 'exam_peel');
      }
      rerenderSingleQuestionCard(q.id);
      return;
    }

    // --- Drill 2: 60s Plan ---
    if (action === 'toggle-plan-timer') {
      handleTogglePlanTimer(q);
      return;
    }

    if (action === 'toggle-plan-factor') {
      const fId = actionEl.getAttribute('data-factor-id');
      if (!fId) return;
      ui.plan.checked = false;
      if (ui.plan.selectedFactorIds.has(fId)) ui.plan.selectedFactorIds.delete(fId);
      else ui.plan.selectedFactorIds.add(fId);
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'toggle-plan-ev') {
      const evId = actionEl.getAttribute('data-ev-id');
      if (!evId) return;
      if (ui.plan.selectedEvidenceIds.has(evId)) ui.plan.selectedEvidenceIds.delete(evId);
      else ui.plan.selectedEvidenceIds.add(evId);
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'select-plan-conc') {
      const cId = actionEl.getAttribute('data-conc-id');
      if (!cId) return;
      ui.plan.checked = false;
      ui.plan.selectedConclusionId = cId;
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'reset-plan') {
      ui.plan.selectedFactorIds.clear();
      ui.plan.selectedEvidenceIds.clear();
      ui.plan.selectedConclusionId = null;
      ui.plan.checked = false;
      ui.plan.secondsLeft = 60;
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'check-plan') {
      ui.plan.checked = true;
      const chosenConc = ui.plan.shuffledConclusions.find(
        (c) => c.id === ui.plan.selectedConclusionId,
      );
      const strongCount = [...ui.plan.selectedFactorIds].filter((id) =>
        ui.plan.shuffledFactors.find((f) => f.id === id && f.isStrong),
      ).length;
      if (strongCount >= 2 && chosenConc?.isBest) {
        awardDrillXpOnce(q.id, 'plan', 30, 'exam_plan');
      }
      rerenderSingleQuestionCard(q.id);
      return;
    }

    // --- Drill 3: Be the Examiner ---
    if (action === 'pick-examiner-flaw') {
      const optId = actionEl.getAttribute('data-opt-id');
      if (!optId) return;
      ui.examiner.selectedOptionId = optId;
      ui.examiner.checked = true;
      const opt = ui.examiner.shuffledOptions.find((o) => o.id === optId);
      if (opt?.isCorrect) {
        awardDrillXpOnce(q.id, 'examiner', 25, 'exam_examiner');
      }
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'check-examiner') {
      ui.examiner.checked = true;
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'reset-examiner') {
      ui.examiner.selectedOptionId = null;
      ui.examiner.checked = false;
      rerenderSingleQuestionCard(q.id);
      return;
    }

    // --- Drill 4: Speak / Blurt ---
    if (action === 'toggle-dictate') {
      handleToggleDictation(q);
      return;
    }

    if (action === 'insert-starter') {
      const starter = q.starterSentence || '';
      if (starter && !ui.blurt.draftText.includes(starter)) {
        ui.blurt.draftText = ui.blurt.draftText
          ? `${starter} ${ui.blurt.draftText}`
          : `${starter} `;
        rerenderSingleQuestionCard(q.id);
        const ta = document.getElementById(`met-blurt-input-${q.id}`);
        ta?.focus();
      }
      return;
    }

    if (action === 'clear-blurt') {
      stopActiveSpeechAndMic();
      ui.blurt.draftText = '';
      ui.blurt.selfMarked = false;
      ui.blurt.matchedLabels = [];
      ui.blurt.missedTargets = [];
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'self-mark-blurt') {
      stopActiveSpeechAndMic();
      const ta = document.getElementById(`met-blurt-input-${q.id}`);
      if (ta) ui.blurt.draftText = ta.value;

      const lowerDraft = String(ui.blurt.draftText || '').toLowerCase();
      const matched = [];
      const missed = [];

      for (const target of q.drills.blurt.specTargets) {
        const hit = target.variants.some((v) => v && lowerDraft.includes(v));
        if (hit) matched.push(target.label);
        else missed.push(target);
      }

      ui.blurt.selfMarked = true;
      ui.blurt.matchedLabels = matched;
      ui.blurt.missedTargets = missed;

      if (lowerDraft.trim().length >= 12) {
        awardDrillXpOnce(q.id, 'blurt', 30, 'exam_blurt');
      }
      rerenderSingleQuestionCard(q.id);
      return;
    }

    // --- Grade 9 WAGOLL Controls ---
    if (action === 'toggle-recall-blur') {
      ui.recallMode = !ui.recallMode;
      ui.revealedChips.clear();
      rerenderSingleQuestionCard(q.id);
      return;
    }

    if (action === 'speak-wagoll') {
      handleSpeakWagoll(q);
      return;
    }
  });
}

function highlightDeepLinkedCard(questionNum) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const urlParams = new URLSearchParams(window.location.search || '');
  const hasUrlEq = Boolean(urlParams.get('eq') || urlParams.get('q'));

  if (hasUrlEq && typeof window.runPendingQuestionDeepLink === 'function') {
    window.runPendingQuestionDeepLink();
    return;
  }

  const qNum = parseInt(questionNum, 10);
  if (isNaN(qNum) || qNum < 1) return;
  const cards = Array.from(document.querySelectorAll('.met-question-card'));
  const target = cards[qNum - 1] || cards[0];
  if (!target) return;

  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const prevShadow = target.style.boxShadow;
    target.style.transition = 'box-shadow 0.35s ease';
    target.style.boxShadow = '0 0 0 3px #f59e0b, 0 10px 26px rgba(245, 158, 11, 0.25)';
    setTimeout(() => {
      target.style.boxShadow = prevShadow || '';
    }, 2800);
  }, 120);
}

/**
 * Main entrypoint wired into `src/navigation.js` (`viewName === 'exam-trainer'`).
 */
export async function renderMobileExamTrainer(rawUnitId, options = {}) {
  stopActiveSpeechAndMic();
  clearAllPlanTimers();

  const resolvedUnitId = resolveGcseExamUnitId(rawUnitId);
  const switchedCourse = trainerState.unitId !== resolvedUnitId;
  trainerState.unitId = resolvedUnitId;
  trainerState.mountId = options.mountId || 'main-content';
  trainerState.embeddedInHub = Boolean(options.embeddedInHub);

  // Keep global unit context synchronized if redirected from a KS2/KS3 unit
  state.selectedUnitId = resolvedUnitId;
  if (typeof window !== 'undefined') {
    window.currentUnitId = resolvedUnitId;
  }

  if (switchedCourse) {
    trainerState.searchQuery = '';
    trainerState.activeTariff = 'all';
    trainerState.selectedLessonIndex = null;
    trainerState.familyFilter = null;
    trainerState.familySlotLabel = '';
    trainerState.weakLessonSet = null;
    trainerState.weakFilterLabel = '';
  }

  const mainEl =
    typeof document !== 'undefined'
      ? document.getElementById(trainerState.mountId || 'main-content')
      : null;
  if (mainEl && !trainerState.directory) {
    mainEl.innerHTML = `
      <div class="met-root ${trainerState.embeddedInHub ? 'is-hub-embedded' : ''}" style="padding-top:24px;text-align:center;opacity:0.75;">
        <i class="fa-solid fa-spinner fa-spin"></i> Loading GCSE Exam Questions...
      </div>
    `;
  }

  const directory = await buildUnitExamDirectory(resolvedUnitId);
  trainerState.directory = directory;

  // Resolve incoming lessonIndex / questionNum deep-link options
  const urlParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search || '') : null;
  const urlEq = urlParams ? parseInt(urlParams.get('eq') || '', 10) : NaN;
  const targetQuestionNum =
    typeof options.questionNum === 'number' && options.questionNum >= 1
      ? options.questionNum
      : !isNaN(urlEq) && urlEq >= 1
        ? urlEq
        : null;

  if (
    typeof options.lessonIndex === 'number' &&
    options.lessonIndex >= 0 &&
    options.lessonIndex < directory.lessons.length
  ) {
    trainerState.selectedLessonIndex = options.lessonIndex;
    if (targetQuestionNum) {
      trainerState.activeTariff = 'all';
      trainerState.searchQuery = '';
    }
  } else if (targetQuestionNum !== null && trainerState.selectedLessonIndex === null) {
    trainerState.selectedLessonIndex = 0;
    trainerState.activeTariff = 'all';
    trainerState.searchQuery = '';
  } else if (options.lessonIndex === undefined && !targetQuestionNum) {
    trainerState.selectedLessonIndex = null;
  }

  if (typeof options.searchQuery === 'string') {
    trainerState.searchQuery = options.searchQuery;
  }
  if (typeof options.tariff === 'string' && ['all', '4m', '8m', '12m', '16m'].includes(options.tariff)) {
    trainerState.activeTariff = options.tariff;
  }
  if (Array.isArray(options.familyFilter)) {
    trainerState.familyFilter = options.familyFilter.length > 0 ? options.familyFilter : null;
    trainerState.familySlotLabel = options.familySlotLabel || '';
  } else if (options.familyFilter === null) {
    trainerState.familyFilter = null;
    trainerState.familySlotLabel = '';
  }
  if (options.weakLessonSet instanceof Set) {
    trainerState.weakLessonSet = options.weakLessonSet.size > 0 ? options.weakLessonSet : null;
    trainerState.weakFilterLabel = options.weakFilterLabel || '';
  } else if (options.weakLessonSet === null) {
    trainerState.weakLessonSet = null;
    trainerState.weakFilterLabel = '';
  }

  renderFullTrainerDOM();

  if (targetQuestionNum !== null) {
    highlightDeepLinkedCard(targetQuestionNum);
  }
}

/**
 * Renders live interactive Question & Grade 9 WAGOLL cards directly inside a Slide-Over Drawer
 * (used by Tab 2 Spec Checklist & Mind Map so pupils never lose their map position).
 */
export async function renderSlideOverQuestionCards(
  containerEl,
  rawUnitId,
  { lessonIndex = null, searchTerm = '', openMode = 'practise' } = {},
) {
  if (!containerEl) return;
  const resolvedUnitId = resolveGcseExamUnitId(rawUnitId);
  trainerState.unitId = resolvedUnitId;
  const directory = await buildUnitExamDirectory(resolvedUnitId);
  trainerState.directory = directory;

  let matches = [];
  const cleanTerm = String(searchTerm || '').trim().toLowerCase();

  if (cleanTerm) {
    const tokens = cleanTerm
      .split(/\s+/)
      .map((t) => t.replace(/[^a-z0-9-]/g, ''))
      .filter((t) => t.length >= 3);
    if (tokens.length > 0) {
      matches = directory.allQuestions.filter((q) =>
        tokens.some((tok) => q.searchHaystack.includes(tok)),
      );
    }
  }

  if (
    matches.length === 0 &&
    typeof lessonIndex === 'number' &&
    directory.lessons[lessonIndex]?.questions?.length
  ) {
    matches = directory.lessons[lessonIndex].questions;
  } else if (typeof lessonIndex === 'number' && matches.length > 0) {
    // Rank exact lesson matches first!
    matches.sort((a, b) => {
      const aHit = a.lessonIndex === lessonIndex ? 0 : 1;
      const bHit = b.lessonIndex === lessonIndex ? 0 : 1;
      return aHit - bHit;
    });
  }

  if (matches.length === 0) {
    matches = directory.allQuestions.slice(0, 4);
  }

  const topMatches = matches.slice(0, 6);
  if (topMatches[0] && (openMode === 'practise' || openMode === 'wagoll')) {
    const firstUi = getOrCreateCardState(topMatches[0]);
    firstUi.openPanel = openMode;
  }

  containerEl.innerHTML = `
    <div class="met-root is-hub-embedded" id="met-trainer-root" style="padding:0;">
      <div class="met-cards-stack">
        ${topMatches.map((q, idx) => renderQuestionCardHTML(q, idx, true)).join('')}
      </div>
    </div>
  `;

  attachTrainerDelegatedEvents(containerEl);
}

export function stopExamTrainerAudioAndTimers() {
  stopActiveSpeechAndMic();
  clearAllPlanTimers();
}

if (typeof window !== 'undefined') {
  window.renderMobileExamTrainer = renderMobileExamTrainer;
}
