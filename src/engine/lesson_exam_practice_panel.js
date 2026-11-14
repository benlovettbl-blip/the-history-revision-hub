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
      return 'Option P5 (1HI0/P5)';
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

export function getRecommendedExamMins(marks) {
  const m = parseInt(marks, 10) || 4;
  if (m <= 2) return 3;
  if (m <= 4) return 5;
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
  /\bstudy\s+sources?\s+[a-e](?:\s+and\s+[a-e])?\.?/gi,
  /\bgive\s+two\s+things\s+you\s+can\s+infer\s+from\s+source\s+[a-e]\s+about\b/gi,
  /\bhow\s+useful\s+(?:is|are)\s+sources?\s+[a-e](?:\s+and\s+[a-e])?\s+for\s+an\s+enquiry\s+into\b/gi,
  /\bexplain\s+your\s+answer,?\s+using\s+sources?\s+[a-e](?:\s+and\s+[a-e])?\s+and\s+your\s+knowledge\s+of\s+the\s+historical\s+context\.?/gi,
  /\bhow\s+could\s+you\s+follow\s+up\s+source\s+[a-e]\s+to\s+find\s+out\s+more\s+about\b/gi,
  /\bin\s+your\s+answer,?\s+you\s+must\s+give\s+the\s+question\s+you\s+would\s+ask\s+and\s+the\s+type\s+of\s+source\s+you\s+would\s+use\.?/gi,
  /\bstudy\s+interpretations?\s+1\s+and\s+2\.?\s*they\s+give\s+different\s+views\s+about\b/gi,
  /\bwhat\s+is\s+the\s+main\s+difference\s+between\s+(?:these|the)\s+views\??/gi,
  /\bsuggest\s+one\s+reason\s+why\s+interpretations?\s+1\s+and\s+2\s+give\s+different\s+views\s+about\b/gi,
  /\bhow\s+far\s+do\s+you\s+agree\s+with\s+interpretation\s+[12]\s+about\b/gi,
  /\bhow\s+far\s+do\s+you\s+agree\s+with\s+this\s+statement\??/gi,
  /\bexplain\s+your\s+answer\.?/gi,
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
  if (combined.includes('explain why') || combined.includes('causation') || marks === 12) return 'causation';
  if (combined.includes('agree') || combined.includes('verdict') || marks >= 16) return 'verdict';
  if (combined.includes('similar')) return 'comparison_similar';
  if (combined.includes('differ')) return 'comparison_diff';
  return `m${marks}`;
}

const SOURCE_OR_INTERP_FAMILIES = new Set([
  'inference',
  'followup',
  'utility',
  'interp_diff',
  'interp_why',
  'interp_verdict',
]);

function normalizeForStimulusMatch(str) {
  return String(str || '')
    .replace(/<[^>]+>/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function collectLessonCanonicalStimulusBlob(lesson, existingQuestions = []) {
  const chunks = [];
  const pushItem = (it) => {
    if (!it) return;
    if (typeof it === 'string') {
      chunks.push(it);
      return;
    }
    if (typeof it === 'object') {
      [
        it.text,
        it.extract,
        it.quote,
        it.content,
        it.description,
        it.desc,
        it.title,
        it.caption,
        it.provenance,
        it.attribution,
      ].forEach((v) => {
        if (v) chunks.push(v);
      });
    }
  };
  (lesson?.sources || []).forEach(pushItem);
  (lesson?.interpretations || []).forEach(pushItem);
  (lesson?.exam_practice?.stimulus || []).forEach(pushItem);
  (lesson?.exam_practice?.sources || []).forEach(pushItem);
  (lesson?.exam_practice?.supporting_sources || []).forEach(pushItem);
  (lesson?.exam_practice?.interpretations || []).forEach(pushItem);
  (existingQuestions || []).forEach((eq) => {
    (eq?.stimulus || []).forEach(pushItem);
    (eq?.sources || []).forEach(pushItem);
    (eq?.supporting_sources || []).forEach(pushItem);
    (eq?.interpretations || []).forEach(pushItem);
  });
  return normalizeForStimulusMatch(chunks.join(' '));
}

function extractStimulusSnippetKey(rawExtract) {
  const norm = normalizeForStimulusMatch(rawExtract)
    .replace(/\b(?:source\s+[a-e]|interpretation\s+[12]|from\s+a\s+modern\s+historical\s+study)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (norm.length < 30) return norm;
  // Take a distinctive 55-char middle slice past generic header words
  const start = Math.min(25, Math.floor(norm.length * 0.15));
  return norm.slice(start, start + 55).trim();
}

/**
 * Returns non-duplicate Extra Unseen Mock Questions from `mock_exam_bank_data.js`
 * for the given unit and lesson, preserving all questions backed by genuinely unseen
 * sources or interpretations while filtering out redundant stem/topic clones.
 */
export function getNonDuplicateExtraMockQuestions(unitId, lesson, existingQuestions = []) {
  if (!unitId || !lesson || !lesson.id) return [];
  const rawMocks = getLessonMockQuestions(unitId, lesson.id) || [];
  if (rawMocks.length === 0) return [];

  const canonicalStimBlob = collectLessonCanonicalStimulusBlob(lesson, existingQuestions);

  const existingProfiles = existingQuestions.map((eq) => {
    const text = eq.question || eq.prompt || eq.questionText || '';
    const marks =
      parseInt(eq.marks, 10) ||
      ((eq.tariff || '').match(/(\d+)/) ? parseInt(RegExp.$1, 10) : 0);
    return {
      isCanonical: true,
      rawClean: normalizeForStimulusMatch(text),
      tokens: new Set(extractCoreQuestionTokens(text)),
      family: classifyQuestionFamily(text, eq.type || eq.tariff || '', marks),
      extractKey: '',
    };
  });

  const seenMockProfiles = [];
  const extras = [];

  for (const mq of rawMocks) {
    const mqText = mq.questionText || mq.question || '';
    const mqClean = normalizeForStimulusMatch(mqText);
    const mqTokens = extractCoreQuestionTokens(mqText);
    const mqFamily = classifyQuestionFamily(mqText, mq.type || '', mq.marks || 0);
    const hasExtract = Boolean(mq.sourceExtract && String(mq.sourceExtract).trim());
    const extractKey = hasExtract ? extractStimulusSnippetKey(mq.sourceExtract) : '';

    // A source/interpretation mock with genuinely unseen stimulus prose is a distinct unseen enquiry
    const hasUnseenStimulus =
      SOURCE_OR_INTERP_FAMILIES.has(mqFamily) &&
      extractKey.length >= 24 &&
      !canonicalStimBlob.includes(extractKey);

    const isDup = [...existingProfiles, ...seenMockProfiles].some((prof) => {
      // Never drop an unseen-source/interpretation mock against a canonical question!
      if (prof.isCanonical && hasUnseenStimulus) return false;
      // Between two mock items with unseen extracts, only treat as dup if their extracts ALSO match
      if (!prof.isCanonical && hasUnseenStimulus && prof.extractKey && prof.extractKey !== extractKey) {
        return false;
      }

      if (prof.rawClean === mqClean) return true;
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
      const jaccard =
        mqTokens.length + prof.tokens.size - overlap > 0
          ? overlap / (mqTokens.length + prof.tokens.size - overlap)
          : 0;

      return containment >= 0.72 || jaccard >= 0.55 || (overlap >= 3 && maxLen <= 5);
    });

    if (!isDup) {
      extras.push(mq);
      seenMockProfiles.push({
        isCanonical: false,
        rawClean: mqClean,
        tokens: new Set(mqTokens),
        family: mqFamily,
        extractKey,
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

  // Clear any orphaned timers from a previously viewed lesson
  if (window.examQuestionTimers) {
    Object.values(window.examQuestionTimers).forEach((t) => {
      if (t && t.intervalId) clearInterval(t.intervalId);
    });
  }
  window.examQuestionTimers = {};

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
        btn.innerHTML = '<i class="fa-regular fa-eye" style="color: #16a34a;"></i> Model Answer &amp; Mark Scheme';
      }
    } else {
      drawer.style.display = 'block';
      if (btn) {
        btn.innerHTML = '<i class="fa-regular fa-eye-slash" style="color: #16a34a;"></i> Hide Model Answer';
      }
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
      if (tState.remainingSeconds <= 0) {
        tState.remainingSeconds = minsNum * 60;
        display.textContent = `${String(minsNum).padStart(2, '0')}:00`;
        display.style.color = '#38bdf8';
      }
      tState.isRunning = true;
      if (toggleBtn) toggleBtn.textContent = 'Pause';

      tState.intervalId = setInterval(() => {
        const liveDisplay = document.getElementById(`exam-timer-display-${qId}`);
        const liveToggle = document.getElementById(`exam-timer-toggle-btn-${qId}`);
        if (!liveDisplay) {
          clearInterval(tState.intervalId);
          tState.intervalId = null;
          tState.isRunning = false;
          return;
        }
        if (tState.remainingSeconds <= 0) {
          clearInterval(tState.intervalId);
          tState.intervalId = null;
          tState.isRunning = false;
          liveDisplay.textContent = '00:00';
          liveDisplay.style.color = '#ef4444';
          if (liveToggle) liveToggle.textContent = 'Finished';
          playTimerChime();
          return;
        }

        tState.remainingSeconds--;
        const mins = Math.floor(tState.remainingSeconds / 60);
        const secs = tState.remainingSeconds % 60;
        liveDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

    if (typeof window.cancelSpeech === 'function') {
      window.cancelSpeech();
    }

    if (document.getElementById('exam-projector-modal')) {
      window.closeExamCardProjector();
    }

    const targetMins = parseInt(q.targetMins, 10) || getRecommendedExamMins(q.marks);
    const paperCode = q.paperCode || getCanonicalGcsePaperCode(unitId);

    const isSpagPaper = ['edexcel_medicine', 'weimar_nazi_germany', 'usa'].includes(unitId);
    const hasSpag =
      isSpagPaper &&
      (/16\s*(?:\+|\(\+)\s*4|verdict_16m/i.test(`${q.type || ''} ${q.marksDisplay || ''}`) ||
        parseInt(q.marks, 10) === 16 ||
        parseInt(q.marks, 10) === 20);
    const marksBadgeText =
      q.marksDisplay ||
      (hasSpag
        ? '16 Marks + 4 SPaG'
        : `${parseInt(q.marks, 10) === 20 ? 16 : q.marks || 4} Marks`);

    const rawExtract = String(q.sourceExtract || '').trim();
    const hasSourceExtract = Boolean(rawExtract);
    const hasStructuredGrid = /class="proj-(?:quad-matrix|pair-grid|single-card)"/i.test(rawExtract);

    let stimulusHtml = '';
    if (q.stimulus && q.stimulus.length > 0) {
      stimulusHtml = `
        <div style="background: #f8fafc; border: 2px solid #cbd5e1; border-left: 6px solid #1e3a8a; border-radius: 10px; padding: 14px 20px; margin: 14px 0;">
          <div style="font-weight: 700; font-size: 1.02rem; color: #1e3a8a; margin-bottom: 6px;">
            You may use the following in your answer:
          </div>
          <ul style="margin: 0 0 8px 24px; padding: 0; font-size: 1.12rem; line-height: 1.5; color: #0f172a;">
            ${q.stimulus.map((s) => `<li><strong>${s}</strong></li>`).join('')}
          </ul>
          <div style="font-weight: 600; font-size: 0.96rem; color: #475569; font-style: italic;">
            You must also use information of your own.
          </div>
        </div>
      `;
    }

    let sourceHtml = '';
    if (hasSourceExtract) {
      sourceHtml = hasStructuredGrid
        ? rawExtract
        : `
          <div style="background: #fdfbf7; border: 2px solid #e2d9cc; border-left: 6px solid #b45309; border-radius: 10px; padding: 18px 22px; margin: 14px 0; font-size: 1.05rem; color: #1c1917; line-height: 1.58;">
            ${rawExtract}
          </div>
        `;
    }

    const isWorkbook = Boolean(q.inWorkbook);
    const originPill = isWorkbook
      ? `<span style="background: #ecfdf5; color: #065f46; border: 1.5px solid #10b981; font-size: 0.85rem; font-weight: 800; padding: 4px 10px; border-radius: 7px;"><i class="fa-solid fa-book-open"></i> ${q.mockTitle || 'In Printed Workbook'}</span>`
      : `<span style="background: #eff6ff; color: #1e40af; border: 1.5px solid #93c5fd; font-size: 0.85rem; font-weight: 700; padding: 4px 10px; border-radius: 7px;"><i class="fa-solid fa-layer-group"></i> ${q.mockTitle || 'Extra Exam Practice'}</span>`;

    let rawStem = String(q.questionText || '');
    if (q.stimulus && q.stimulus.length > 0) {
      rawStem = rawStem
        .replace(/\s*(?:<br\s*\/?>|\n)*\s*You may use the following(?:\s+in\s+your\s+answer)?\s*:[\s\S]*$/i, '')
        .replace(/\s*(?:<br\s*\/?>|\n)*\s*You must also use information of your own\.?[\s\S]*$/i, '');
    }
    rawStem = rawStem
      .replace(/^(?:Question|Q)\s*\d+(?:\s*\([a-d]\))?\s*[:.-]\s*/i, '')
      .replace(/^\d+(?:\s*\([a-d]\))?\.\s+/, '')
      .replace(
        /\s*(?:\[\s*\d+\s*(?:\+\s*\d+\s*)?(?:marks?|m|spag)[^\]]*\]|\(\s*\d+\s*(?:\+\s*\d+\s*)?(?:marks?|spag)[^)]*\))\.?/gi,
        '',
      )
      .trim();
    const cleanProjectorStem =
      typeof window.formatBold === 'function' ? window.formatBold(rawStem) : rawStem;

    const modal = document.createElement('div');
    modal.id = 'exam-projector-modal';
    modal.style.cssText =
      'position: fixed; inset: 0; z-index: 999999; background: #ffffff; color: #0f172a; overflow-y: auto; padding: 0 clamp(16px, 3vw, 36px) clamp(12px, 2vw, 24px); display: flex; flex-direction: column; justify-content: space-between; font-family: "Inter", sans-serif; box-sizing: border-box;';

    const centerTimerBlockHtml = '';

    modal.innerHTML = `
      <style>
        #exam-projector-modal .proj-quad-matrix,
        #exam-projector-modal .proj-pair-grid,
        #exam-projector-modal .proj-single-card {
          border: 2px solid #94a3b8;
          border-radius: 10px;
          overflow: hidden;
          background: #ffffff;
          margin: 8px 0 0 0;
        }
        #exam-projector-modal .proj-pair-grid,
        #exam-projector-modal .proj-quad-top,
        #exam-projector-modal .proj-quad-bottom {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 768px) {
          #exam-projector-modal .proj-pair-grid,
          #exam-projector-modal .proj-quad-top,
          #exam-projector-modal .proj-quad-bottom {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          #exam-projector-modal .proj-pair-grid > .proj-pane:first-child:not(:last-child),
          #exam-projector-modal .proj-quad-top > .proj-pane:first-child:not(:last-child),
          #exam-projector-modal .proj-quad-bottom > .proj-pane:first-child:not(:last-child) {
            border-right: 1.5px solid #cbd5e1;
          }
        }
        @media (max-width: 767px) {
          #exam-projector-modal .proj-pair-grid > .proj-pane + .proj-pane,
          #exam-projector-modal .proj-quad-top > .proj-pane + .proj-pane,
          #exam-projector-modal .proj-quad-bottom > .proj-pane + .proj-pane {
            border-top: 1.5px solid #cbd5e1;
          }
        }
        #exam-projector-modal .proj-pane {
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #ffffff;
        }
        #exam-projector-modal .proj-pane-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-bottom: 1px solid #e2e8f0;
          font-family: 'Inter', sans-serif;
        }
        #exam-projector-modal .proj-pane-interp > .proj-pane-header {
          background: #fff7ed;
          border-bottom-color: #fed7aa;
        }
        #exam-projector-modal .proj-pane-source > .proj-pane-header {
          background: #f1f5f9;
          border-bottom-color: #cbd5e1;
        }
        #exam-projector-modal .proj-badge {
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2.5px 7px;
          border-radius: 4px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }
        #exam-projector-modal .proj-badge-interp {
          background: #9a3412;
        }
        #exam-projector-modal .proj-badge-source {
          background: #1e40af;
        }
        #exam-projector-modal .proj-prov {
          font-size: 0.84rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
        }
        #exam-projector-modal .proj-pane-body {
          padding: 9px 14px;
          font-family: 'Georgia', serif;
          font-style: italic;
          font-size: 0.96rem;
          line-height: 1.45;
          color: #0f172a;
        }
        #exam-projector-modal .proj-quad-matrix .proj-pane-body {
          font-size: 0.91rem;
          line-height: 1.4;
          padding: 8px 12px;
        }
        #exam-projector-modal .proj-pane-media {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        #exam-projector-modal .proj-pane-media img {
          width: 125px;
          max-width: 125px;
          max-height: 135px;
          object-fit: contain;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #f8fafc;
          flex-shrink: 0;
        }
        #exam-projector-modal .proj-quad-seam {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 4px 12px;
          background: #eff6ff;
          border-top: 1.5px solid #cbd5e1;
          border-bottom: 1px solid #cbd5e1;
          font-size: 0.8rem;
          font-weight: 700;
          color: #1e3a8a;
        }
        #exam-projector-modal .proj-quad-matrix.proj-bottom-hidden .proj-quad-bottom {
          display: none !important;
        }
        #exam-projector-modal .proj-quad-matrix.proj-bottom-hidden .proj-quad-seam {
          border-bottom: none;
        }
      </style>

      <div>
        <!-- Sticky Top Smartboard Bar (Always Visible Countdown Timer + Metadata) -->
        <div style="position: sticky; top: 0; z-index: 20; background: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 2px solid #e2e8f0; padding: 14px 0 12px 0; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="background: #0f172a; color: #ffffff; font-size: 0.9rem; font-weight: 800; padding: 5px 12px; border-radius: 7px; letter-spacing: 0.04em; text-transform: uppercase;">
              ${q.qCode ? `Question ${q.qCode}` : 'Exam Question'}
            </span>
            <span style="background: #f1f5f9; color: #0f172a; border: 1.5px solid #cbd5e1; font-size: 0.9rem; font-weight: 700; padding: 4px 12px; border-radius: 7px;">
              ${marksBadgeText}
            </span>
            ${originPill}
          </div>

          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <!-- Docked Smartboard Countdown Timer (Always on Screen) -->
            <div id="projector-top-timer-pill" style="display: inline-flex; align-items: center; gap: 10px; background: #0f172a; color: #ffffff; padding: 5px 12px; border-radius: 9px; box-shadow: 0 2px 8px rgba(15,23,42,0.14);">
              <i class="fa-solid fa-stopwatch" style="color: #38bdf8; font-size: 1rem;"></i>
              <span id="projector-timer-top-display" style="font-family: 'Courier New', monospace; font-size: 1.35rem; font-weight: 900; color: #38bdf8; letter-spacing: 0.04em; min-width: 64px; text-align: center;">
                ${String(targetMins).padStart(2, '0')}:00
              </span>
              <button type="button" id="projector-timer-top-btn" onclick="window.toggleProjectorTimer(${targetMins})" style="background: #2563eb; color: #ffffff; border: none; padding: 5px 12px; border-radius: 6px; font-weight: 700; font-size: 0.84rem; cursor: pointer;">
                Start (${targetMins}m)
              </button>
              <button type="button" onclick="window.resetProjectorTimer(${targetMins})" style="background: #334155; color: #e2e8f0; border: none; padding: 5px 10px; border-radius: 6px; font-weight: 600; font-size: 0.82rem; cursor: pointer;">
                Reset
              </button>
            </div>

            <button type="button" onclick="window.closeExamCardProjector()" style="background: #f1f5f9; color: #0f172a; border: 1.5px solid #cbd5e1; padding: 7px 14px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-xmark"></i> Exit (Esc)
            </button>
          </div>
        </div>

        <!-- Main Question Display -->
        <div style="max-width: ${hasSourceExtract ? '1380px' : '1060px'}; margin: 0 auto; width: 100%;">
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: ${hasSourceExtract ? 'clamp(1.18rem, 1.9vw, 1.5rem)' : 'clamp(1.45rem, 2.8vw, 2.05rem)'}; font-weight: 700; color: #0f172a; line-height: 1.35; margin-bottom: ${hasSourceExtract ? '10px' : '18px'};">
            ${cleanProjectorStem}
          </div>

          ${sourceHtml}
          ${stimulusHtml}
          ${centerTimerBlockHtml}
        </div>
      </div>

      <!-- Footer Note -->
      <div style="text-align: center; color: #94a3b8; font-size: 0.8rem; padding-top: 12px; margin-top: 14px; border-top: 1px solid #e2e8f0;">
        Pearson Edexcel GCSE History &bull; ${paperCode} &bull; The History Revision Hub
      </div>
    `;

    document.body.appendChild(modal);

    let projRemaining = targetMins * 60;
    let projInterval = null;
    let projRunning = false;

    const syncProjectorDisplays = (timeStr, colorHex, btnLabel, topBtnLabel) => {
      const pCenter = document.getElementById('projector-timer-display');
      const pTop = document.getElementById('projector-timer-top-display');
      const bCenter = document.getElementById('projector-timer-start-btn');
      const bTop = document.getElementById('projector-timer-top-btn');
      if (pCenter) {
        pCenter.textContent = timeStr;
        if (colorHex) pCenter.style.color = colorHex;
      }
      if (pTop) {
        pTop.textContent = timeStr;
        if (colorHex) pTop.style.color = colorHex;
      }
      if (bCenter && btnLabel) bCenter.textContent = btnLabel;
      if (bTop && topBtnLabel) bTop.textContent = topBtnLabel;
    };

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        window.closeExamCardProjector();
      }
    };
    window.addEventListener('keydown', escHandler);
    modal._escHandler = escHandler;

    window.toggleProjectorQuadSources = function (btn) {
      const mat = btn ? btn.closest('.proj-quad-matrix') : null;
      if (!mat) return;
      const hidden = mat.classList.toggle('proj-bottom-hidden');
      btn.textContent = hidden ? 'Show Sources B & C ▾' : 'Hide Sources B & C ▴';
    };

    window.toggleProjectorTimer = function () {
      const pTop = document.getElementById('projector-timer-top-display');
      if (!pTop) return;

      if (projRunning) {
        clearInterval(projInterval);
        projInterval = null;
        projRunning = false;
        syncProjectorDisplays(pTop.textContent, null, 'Resume', 'Resume');
      } else {
        if (projRemaining <= 0) {
          projRemaining = targetMins * 60;
          const resetStr = `${String(targetMins).padStart(2, '0')}:00`;
          syncProjectorDisplays(resetStr, '#38bdf8', null, null);
        }
        projRunning = true;
        syncProjectorDisplays(
          document.getElementById('projector-timer-top-display')?.textContent || '',
          null,
          'Pause',
          'Pause',
        );

        projInterval = setInterval(() => {
          if (projRemaining <= 0) {
            clearInterval(projInterval);
            projInterval = null;
            projRunning = false;
            syncProjectorDisplays('00:00', '#ef4444', 'Finished', 'Finished');
            playTimerChime();
            return;
          }
          projRemaining--;
          const m = Math.floor(projRemaining / 60);
          const s = projRemaining % 60;
          const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
          syncProjectorDisplays(formatted, null, null, null);
        }, 1000);
      }
    };

    window.resetProjectorTimer = function (minsArg) {
      const mReset = parseInt(minsArg, 10) || targetMins;
      if (projInterval) clearInterval(projInterval);
      projInterval = null;
      projRunning = false;
      projRemaining = mReset * 60;
      const resetStr = `${String(mReset).padStart(2, '0')}:00`;
      syncProjectorDisplays(resetStr, '#38bdf8', 'Start Timer', `Start (${mReset}m)`);
    };

    modal._cleanupInterval = () => {
      if (projInterval) clearInterval(projInterval);
    };
  };

  window.closeExamCardProjector = function () {
    const modal = document.getElementById('exam-projector-modal');
    if (modal) {
      if (typeof modal._cleanupInterval === 'function') modal._cleanupInterval();
      if (modal._escHandler) window.removeEventListener('keydown', modal._escHandler);
      modal.remove();
    }
  };
}
