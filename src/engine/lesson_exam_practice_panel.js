/**
 * src/engine/lesson_exam_practice_panel.js
 *
 * Unified GCSE Exam Practice Utilities, De-Duplication Merger, Live Countdown Timer,
 * and Front-of-Class Projector Mode Controller.
 *
 * All GCSE exam questions (both Green Printed Workbook strips from `lesson.exam_practice`
 * and Blue Extra Practice strips from `mock_exam_bank_data.js`) now render inside
 * the single unified Thin-Strip Workbook & Exam Practice Station in `lesson_renderer.js`
 * and register into `window.unifiedLessonExamRegistry` so every question supports
 * Timed Practice and Projector Mode.
 */

import { getLessonMockQuestions } from './mock_exam_bank_data.js';

// Timer tracking state keyed by question id
if (typeof window !== 'undefined') {
  window.examQuestionTimers = window.examQuestionTimers || {};
  window.unifiedLessonExamRegistry = window.unifiedLessonExamRegistry || {};
}

export function getCanonicalGcsePaperCode(unitId) {
  switch (unitId) {
    case 'cme_new':
      return 'Option P4 (1HI0/P4)';
    case 'cold_war':
      return 'Option P4 (1HI0/P4)';
    case 'eee':
      return 'Option B4 (1HI0/B4)';
    case 'edexcel_medicine':
      return 'Option 11 (1HI0/11)';
    case 'weimar_nazi_germany':
      return 'Option 31 (1HI0/31)';
    case 'usa':
      return 'Option 33 (1HI0/33)';
    default:
      return 'Pearson Edexcel GCSE (9–1)';
  }
}

export function getRecommendedExamMins(marks, qType = '') {
  const m = parseInt(marks, 10) || 4;
  const t = String(qType || '').toLowerCase();
  if (m <= 2) return 3;
  if (m <= 4) return t.includes('infer') || t.includes('interp') ? 6 : 5;
  if (m <= 8) return 12;
  if (m <= 12) return 18;
  return 25;
}

export function registerUnifiedExamQuestion(qId, qData) {
  if (typeof window === 'undefined' || !qId || !qData) return;
  window.unifiedLessonExamRegistry = window.unifiedLessonExamRegistry || {};
  window.unifiedLessonExamRegistry[qId] = qData;
}

const STEM_BOILERPLATE_PATTERNS = [
  /^(?:q(?:uestion)?\s*\d+(?:\s*\([a-d]\))?[\.:\s-]*)+/gi,
  /^(?:\d+\s*\([a-d]\)[\.:\s-]*)+/gi,
  /\[\s*\d+\s*marks?(?:\s*\+\s*4\s*spag)?\s*\]/gi,
  /\(\s*\d+\s*marks?\s*\)/gi,
  /\bexplain\s+one\s+consequence\s+of\b/gi,
  /\bexplain\s+two\s+consequences\s+of\b/gi,
  /\bwrite\s+a\s+narrative\s+account\s+analysing\s+(?:the\s+)?(?:key\s+events\s+of\s+)?/gi,
  /\bexplain\s+the\s+importance\s+of\b/gi,
  /\bexplain\s+why\b/gi,
  /\bdescribe\s+(?:one|two)\s+features?\s+of\b/gi,
  /\bgive\s+two\s+things\s+you\s+can\s+infer\s+from\s+source\s+[a-d]\s+about\b/gi,
  /\bhow\s+useful\s+(?:is|are)\s+sources?\s+[a-d](?:\s+and\s+[a-d])?\s+for\s+an\s+enquiry\s+into\b/gi,
  /\bexplain\s+your\s+answer,?\s+using\s+sources?\s+[a-d](?:\s+and\s+[a-d])?\s+and\s+your\s+knowledge\s+of\s+the\s+historical\s+context\.?/gi,
  /\bstudy\s+interpretations?\s+1\s+and\s+2\.?\s*they\s+give\s+different\s+views\s+about\b/gi,
  /\bwhat\s+is\s+the\s+main\s+difference\s+between\s+(?:these|the)\s+views\??/gi,
  /\bsuggest\s+one\s+reason\s+why\s+interpretations?\s+1\s+and\s+2\s+give\s+different\s+views\s+about\b/gi,
  /\bhow\s+far\s+do\s+you\s+agree\s+with\s+interpretation\s+[12]\s+about\b/gi,
  /\bhow\s+far\s+do\s+you\s+agree\s+with\s+this\s+statement\??/gi,
  /\bexplain\s+one\s+way\s+in\s+which\b/gi,
];

const STOPWORDS = new Set([
  'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'by', 'with',
  'from', 'during', 'between', 'years', 'year', 'period', 'early', 'late', 'how',
  'what', 'why', 'was', 'were', 'is', 'are', 'that', 'this', 'these', 'their', 'its',
]);

function extractCoreQuestionTokens(rawText) {
  if (!rawText) return [];
  let s = String(rawText).replace(/<[^>]+>/g, ' ').toLowerCase();
  for (const rx of STEM_BOILERPLATE_PATTERNS) {
    s = s.replace(rx, ' ');
  }
  return s
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function classifyQuestionFamily(qText = '', qType = '', marks = 0) {
  const combined = `${qType} ${qText}`.toLowerCase();
  if (combined.includes('infer')) return 'inference';
  if (combined.includes('follow up') || combined.includes('follow_up')) return 'followup';
  if (combined.includes('how useful') || combined.includes('utility')) return 'utility';
  if (combined.includes('main difference') || combined.includes('3(b)') || combined.includes('interp_diff')) return 'interp_diff';
  if (combined.includes('one reason why interpretations') || combined.includes('3(c)') || combined.includes('interp_why')) return 'interp_why';
  if (combined.includes('agree with interpretation') || combined.includes('3(d)')) return 'interp_verdict';
  if (combined.includes('narrative account') || combined.includes('narrative')) return 'narrative';
  if (combined.includes('importance of') || combined.includes('importance')) return 'importance';
  if (combined.includes('consequence')) return 'consequence';
  if (combined.includes('feature')) return 'features';
  if (combined.includes('similar') || combined.includes('differ')) return 'comparison';
  if (combined.includes('explain why') || combined.includes('causation') || marks === 12) return 'causation';
  if (combined.includes('agree') || combined.includes('verdict') || marks >= 16) return 'verdict';
  return `m${marks}`;
}

/**
 * Returns non-duplicate Extra Unseen Mock Questions from `mock_exam_bank_data.js`
 * for the given unit and lesson, filtering out any question whose stem & question family
 * already appear in `lesson.exam_practice`.
 */
export function getNonDuplicateExtraMockQuestions(unitId, lesson, existingQuestions = []) {
  if (!unitId || !lesson || !lesson.id) return [];
  const rawMocks = getLessonMockQuestions(unitId, lesson.id) || [];
  if (rawMocks.length === 0) return [];

  const existingProfiles = existingQuestions.map((eq) => {
    const text = eq.question || eq.prompt || eq.questionText || '';
    const marks = parseInt(eq.marks, 10) ||
      ((eq.tariff || '').match(/(\d+)/) ? parseInt(RegExp.$1, 10) : 0);
    return {
      rawClean: text.replace(/<[^>]+>/g, ' ').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(),
      tokens: new Set(extractCoreQuestionTokens(text)),
      family: classifyQuestionFamily(text, eq.type || eq.tariff || '', marks),
    };
  });

  const seenMockProfiles = [];
  const extras = [];

  for (const mq of rawMocks) {
    const mqText = mq.questionText || mq.question || '';
    const mqClean = mqText.replace(/<[^>]+>/g, ' ').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const mqTokens = extractCoreQuestionTokens(mqText);
    const mqFamily = classifyQuestionFamily(mqText, mq.type || '', mq.marks || 0);

    const isDup = [...existingProfiles, ...seenMockProfiles].some((prof) => {
      if (prof.rawClean === mqClean) return true;
      // Paper 3 bare "How far do you agree with Interpretation 2?" with 0 topic tokens:
      // if existing already has an interp_verdict in this lesson, only treat as dup if stimulus/extract matches or bare stem
      if (prof.family !== mqFamily) return false;
      if (mqTokens.length === 0 && prof.tokens.size === 0) return true;
      if (mqTokens.length === 0 || prof.tokens.size === 0) return false;

      let overlap = 0;
      for (const t of mqTokens) {
        if (prof.tokens.has(t)) overlap++;
      }
      const minLen = Math.min(mqTokens.length, prof.tokens.size);
      const maxLen = Math.max(mqTokens.length, prof.tokens.size);
      const containment = minLen > 0 ? overlap / minLen : 0;
      const jaccard = (mqTokens.length + prof.tokens.size - overlap) > 0
        ? overlap / (mqTokens.length + prof.tokens.size - overlap)
        : 0;

      return containment >= 0.72 || jaccard >= 0.55 || (overlap >= 3 && maxLen <= 5);
    });

    if (!isDup) {
      extras.push(mq);
      seenMockProfiles.push({
        rawClean: mqClean,
        tokens: new Set(mqTokens),
        family: mqFamily,
      });
    }
  }

  return extras;
}

function playTimerChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.8);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.25);
    gain2.gain.setValueAtTime(0.3, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 1.2);
  } catch (e) {
    console.warn('AudioContext not allowed or not supported:', e);
  }
}

/**
 * Legacy standalone panel renderer now returns empty string because all GCSE exam questions
 * (Printed Workbook + Non-Duplicate Extra Mock Questions) are unified inside the compact
 * Thin-Strip Workbook & Exam Practice station in `lesson_renderer.js`.
 */
export function renderLessonExamPracticeHTML() {
  return '';
}

/**
 * Initializes global handlers for model answer toggles, in-card timers,
 * bulk strip expand/collapse, and front-of-class Projector Mode.
 */
export function initLessonExamPractice(unitId, lesson) {
  if (typeof window === 'undefined') return;

  // Expand / Collapse all thin strips inside a Workbook & Exam Practice station
  window.toggleAllWorkbookStrips = function (btn) {
    const container = btn ? btn.closest('.wb-unified-station') : document.querySelector('.wb-unified-station');
    if (!container) return;
    const strips = Array.from(container.querySelectorAll('details.wb-question-strip'));
    if (strips.length === 0) return;
    const anyClosed = strips.some((d) => !d.open);
    strips.forEach((d) => {
      d.open = anyClosed;
    });
    if (btn) {
      btn.innerHTML = anyClosed
        ? '<i class="fa-solid fa-compress"></i> Collapse All'
        : '<i class="fa-solid fa-expand"></i> Expand All';
    }
  };

  // Toggle model answer drawer inside any unified GCSE question strip
  window.toggleExamCardModelAnswer = function (qId) {
    const drawer = document.getElementById(`exam-model-drawer-${qId}`) || document.getElementById(`ep-model-${qId}`);
    const btn = document.getElementById(`exam-model-btn-${qId}`);
    if (!drawer) return;

    const isOpen = drawer.style.display !== 'none' && window.getComputedStyle(drawer).display !== 'none';
    if (isOpen) {
      drawer.style.display = 'none';
      if (btn) {
        btn.innerHTML = '<i class="fa-regular fa-eye" style="color: #16a34a;"></i> Reveal Model Answer &amp; Mark Scheme';
      }
    } else {
      drawer.style.display = 'block';
      if (btn) {
        btn.innerHTML = '<i class="fa-regular fa-eye-slash" style="color: #16a34a;"></i> Hide Model Answer';
      }
    }
  };

  // Switch active model tier rung inside exam card
  window.switchExamCardModelTier = function (qId, targetTier) {
    const btns = document.querySelectorAll(`.exam-tier-tab-btn-${qId}`);
    btns.forEach((btn) => {
      const isTarget = btn.getAttribute('data-tier-btn') === targetTier;
      btn.style.background = isTarget ? '#0f172a' : '#ffffff';
      btn.style.color = isTarget ? '#ffffff' : '#334155';
      btn.style.borderColor = isTarget ? '#0f172a' : '#cbd5e1';
      btn.style.fontWeight = isTarget ? '700' : '600';
    });

    const panes = document.querySelectorAll(`.exam-tier-pane-${qId}`);
    panes.forEach((p) => {
      p.style.display = 'none';
    });
    const targetPane = document.getElementById(`exam-tier-pane-${qId}-${targetTier}`);
    if (targetPane) {
      targetPane.style.display = 'block';
    }
  };

  // Toggle countdown timer on any unified GCSE question strip
  window.toggleExamCardTimer = function (qId, targetMins) {
    const minsNum = parseInt(targetMins, 10) || 5;
    const bar = document.getElementById(`exam-timer-bar-${qId}`);
    const display = document.getElementById(`exam-timer-display-${qId}`);
    const toggleBtn = document.getElementById(`exam-timer-toggle-btn-${qId}`);
    if (!bar || !display) return;

    if (bar.style.display === 'none' || window.getComputedStyle(bar).display === 'none') {
      bar.style.display = 'flex';
    }

    let tState = window.examQuestionTimers[qId];
    if (!tState) {
      tState = {
        remainingSeconds: minsNum * 60,
        intervalId: null,
        isRunning: false,
      };
      window.examQuestionTimers[qId] = tState;
    }

    if (tState.isRunning) {
      clearInterval(tState.intervalId);
      tState.intervalId = null;
      tState.isRunning = false;
      if (toggleBtn) toggleBtn.textContent = 'Resume';
    } else {
      tState.isRunning = true;
      if (toggleBtn) toggleBtn.textContent = 'Pause';

      tState.intervalId = setInterval(() => {
        if (tState.remainingSeconds <= 0) {
          clearInterval(tState.intervalId);
          tState.intervalId = null;
          tState.isRunning = false;
          display.textContent = '00:00';
          display.style.color = '#ef4444';
          if (toggleBtn) toggleBtn.textContent = 'Finished';
          playTimerChime();
          return;
        }

        tState.remainingSeconds--;
        const mins = Math.floor(tState.remainingSeconds / 60);
        const secs = tState.remainingSeconds % 60;
        display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }, 1000);
    }
  };

  // Reset timer
  window.resetExamCardTimer = function (qId, targetMins) {
    const minsNum = parseInt(targetMins, 10) || 5;
    const tState = window.examQuestionTimers[qId];
    if (tState && tState.intervalId) {
      clearInterval(tState.intervalId);
    }
    window.examQuestionTimers[qId] = {
      remainingSeconds: minsNum * 60,
      intervalId: null,
      isRunning: false,
    };

    const display = document.getElementById(`exam-timer-display-${qId}`);
    const toggleBtn = document.getElementById(`exam-timer-toggle-btn-${qId}`);
    if (display) {
      display.textContent = `${String(minsNum).padStart(2, '0')}:00`;
      display.style.color = '#38bdf8';
    }
    if (toggleBtn) toggleBtn.textContent = 'Start';
  };

  // Projector mode launcher (works for BOTH Green Printed Workbook & Blue Extra Practice questions)
  window.openExamCardProjector = function (qId) {
    const regItem = window.unifiedLessonExamRegistry && window.unifiedLessonExamRegistry[qId];
    const fallbackList = unitId && lesson && lesson.id ? getLessonMockQuestions(unitId, lesson.id) : [];
    const q = regItem || (fallbackList || []).find((item) => item.id === qId);
    if (!q) return;

    const existingModal = document.getElementById('exam-projector-modal');
    if (existingModal) existingModal.remove();

    const targetMins = parseInt(q.targetMins, 10) || getRecommendedExamMins(q.marks, q.type);
    const paperCode = q.paperCode || getCanonicalGcsePaperCode(unitId);

    let stimulusHtml = '';
    if (q.stimulus && q.stimulus.length > 0) {
      stimulusHtml = `
        <div style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 10px; padding: 20px 24px; margin: 24px 0;">
          <div style="font-weight: 700; font-size: 1.15rem; color: #334155; margin-bottom: 10px;">
            You may use the following in your answer:
          </div>
          <ul style="margin: 0 0 12px 28px; padding: 0; font-size: 1.25rem; line-height: 1.6; color: #0f172a;">
            ${q.stimulus.map((s) => `<li><strong>${s}</strong></li>`).join('')}
          </ul>
          <div style="font-weight: 700; font-size: 1.15rem; color: #334155;">
            You must also use information of your own.
          </div>
        </div>
      `;
    }

    let sourceHtml = '';
    if (q.sourceExtract) {
      sourceHtml = `
        <div style="background: #fdfbf7; border: 2px solid #e2d9cc; border-left: 6px solid #b45309; border-radius: 10px; padding: 22px 26px; margin: 24px 0; font-size: 1.15rem; color: #1c1917; line-height: 1.65;">
          ${q.sourceExtract}
        </div>
      `;
    }

    const isWorkbook = Boolean(q.inWorkbook);
    const originPill = isWorkbook
      ? `<span style="background: #ecfdf5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.92rem; font-weight: 800; padding: 5px 12px; border-radius: 8px;"><i class="fa-solid fa-book-open"></i> ${q.mockTitle || 'In Printed Workbook'}</span>`
      : `<span style="background: #eff6ff; color: #1e40af; border: 1.5px solid #93c5fd; font-size: 0.92rem; font-weight: 700; padding: 5px 12px; border-radius: 8px;"><i class="fa-solid fa-layer-group"></i> ${q.mockTitle || 'Extra Exam Practice'}</span>`;

    const modal = document.createElement('div');
    modal.id = 'exam-projector-modal';
    modal.style.cssText =
      'position: fixed; inset: 0; z-index: 999999; background: #ffffff; color: #0f172a; overflow-y: auto; padding: clamp(20px, 4vw, 50px); display: flex; flex-direction: column; justify-content: space-between; font-family: "Inter", sans-serif;';

    modal.innerHTML = `
      <!-- Top Projector Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="background: #0f172a; color: #ffffff; font-size: 0.98rem; font-weight: 800; padding: 6px 14px; border-radius: 8px; letter-spacing: 0.05em; text-transform: uppercase;">
            ${q.qCode ? `Question ${q.qCode}` : 'Exam Question'}
          </span>
          <span style="background: #f1f5f9; color: #0f172a; border: 1.5px solid #cbd5e1; font-size: 0.98rem; font-weight: 700; padding: 5px 14px; border-radius: 8px;">
            ${q.type || 'Edexcel Assessment'} (${q.marks || 4} Marks)
          </span>
          ${originPill}
        </div>

        <button type="button" onclick="window.closeExamCardProjector()" style="background: #f1f5f9; color: #0f172a; border: 1.5px solid #cbd5e1; padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-xmark"></i> Exit Projector Mode (Esc)
        </button>
      </div>

      <!-- Main Question Display -->
      <div style="max-width: 1000px; margin: 0 auto; width: 100%;">
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; color: #0f172a; line-height: 1.4; margin-bottom: 20px;">
          ${q.questionText}
        </div>

        ${sourceHtml}
        ${stimulusHtml}

        <!-- Big Center Projector Timer -->
        <div style="background: #0f172a; color: #ffffff; border-radius: 16px; padding: 24px 32px; margin-top: 32px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
          <div style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700; margin-bottom: 8px;">
            Silent Timed Writing &bull; Recommended ${targetMins} Mins
          </div>
          <div id="projector-timer-display" style="font-family: 'Courier New', monospace; font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; color: #38bdf8; line-height: 1;">
            ${String(targetMins).padStart(2, '0')}:00
          </div>
          <div style="margin-top: 18px; display: flex; justify-content: center; gap: 12px;">
            <button type="button" id="projector-timer-start-btn" onclick="window.toggleProjectorTimer(${targetMins})" style="background: #2563eb; color: #ffffff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 1.05rem; cursor: pointer;">
              Start Timer
            </button>
            <button type="button" onclick="window.resetProjectorTimer(${targetMins})" style="background: #334155; color: #ffffff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 1.05rem; cursor: pointer;">
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Note -->
      <div style="text-align: center; color: #94a3b8; font-size: 0.85rem; padding-top: 24px; margin-top: 24px; border-top: 1px solid #e2e8f0;">
        Pearson Edexcel GCSE History &bull; ${paperCode} &bull; The History Revision Hub
      </div>
    `;

    document.body.appendChild(modal);

    let projRemaining = targetMins * 60;
    let projInterval = null;
    let projRunning = false;

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        window.closeExamCardProjector();
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);

    window.toggleProjectorTimer = function (minsArg) {
      const pDisplay = document.getElementById('projector-timer-display');
      const pBtn = document.getElementById('projector-timer-start-btn');
      if (!pDisplay) return;

      if (projRunning) {
        clearInterval(projInterval);
        projInterval = null;
        projRunning = false;
        if (pBtn) pBtn.textContent = 'Resume';
      } else {
        projRunning = true;
        if (pBtn) pBtn.textContent = 'Pause';

        projInterval = setInterval(() => {
          if (projRemaining <= 0) {
            clearInterval(projInterval);
            projInterval = null;
            projRunning = false;
            pDisplay.textContent = '00:00';
            pDisplay.style.color = '#ef4444';
            if (pBtn) pBtn.textContent = 'Finished';
            playTimerChime();
            return;
          }
          projRemaining--;
          const m = Math.floor(projRemaining / 60);
          const s = projRemaining % 60;
          pDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }, 1000);
      }
    };

    window.resetProjectorTimer = function (minsArg) {
      const mReset = parseInt(minsArg, 10) || targetMins;
      if (projInterval) clearInterval(projInterval);
      projInterval = null;
      projRunning = false;
      projRemaining = mReset * 60;
      const pDisplay = document.getElementById('projector-timer-display');
      const pBtn = document.getElementById('projector-timer-start-btn');
      if (pDisplay) {
        pDisplay.textContent = `${String(mReset).padStart(2, '0')}:00`;
        pDisplay.style.color = '#38bdf8';
      }
      if (pBtn) pBtn.textContent = 'Start Timer';
    };

    modal._cleanupInterval = () => {
      if (projInterval) clearInterval(projInterval);
    };
  };

  window.closeExamCardProjector = function () {
    const modal = document.getElementById('exam-projector-modal');
    if (modal) {
      if (typeof modal._cleanupInterval === 'function') modal._cleanupInterval();
      modal.remove();
    }
  };
}
