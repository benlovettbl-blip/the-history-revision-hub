/**
 * Lesson Finish & Arcade Launchbar + Teacher Plenary Projector
 *
 * Streamlined replacement for the legacy 6-tab Check & Consolidate Hub:
 * 1. ⚡ Quick 5 Check — Fast 5-question sampled retrieval wired directly to Spaced Repetition Weak Spots & XP.
 * 2. 🕹️ Lesson Arcade Launchers — 1-click jump into Keyword Stack (Tetris), Redacted!, or all 7 Arcade games for this lesson.
 * 3. 🔥 Teacher Plenary Projector — Full-screen smartboard theatre mode (Hot Seat Taboo, 60s Standoff, Four Corners) surfaced cleanly in Teacher Mode.
 */

import { appStore } from './store.js';
import { getArenaStandoffPair } from './arena_standoff_registry.js';
import { getArenaCornersData } from './arena_corners_registry.js';
import { addXp, generateQuestionId, recordQuestionResult } from '../storage.js';

window.consolidateStations = window.consolidateStations || {};

const ARENA_STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'is', 'was', 'for', 'by', 'with',
  'that', 'this', 'as', 'at', 'from', 'it', 'on', 'which', 'be', 'are', 'were', 'been',
  'into', 'through', 'over', 'after', 'under', 'between', 'during', 'their', 'them',
  'his', 'her', 'its', 'they', 'he', 'she', 'who', 'whom', 'whose', 'where', 'when',
  'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
  'just', 'should', 'now', 'used', 'became', 'made', 'also', 'what', 'would', 'could',
  'have', 'having', 'had', 'does', 'did', 'doing', 'shall', 'might',
]);

function truncateAtWord(text, maxChars = 140) {
  if (!text) return '';
  const clean = String(text)
    .replace(/<[^>]+>/g, '')
    .replace(/\[\d+\.\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '...';
}

function extractTabooWords(term, definition) {
  const termWords = new Set(
    (term || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean),
  );
  const forbidden = new Set();
  const words = (definition || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !ARENA_STOPWORDS.has(w) && !termWords.has(w));

  for (const w of words) {
    forbidden.add(w);
    if (forbidden.size >= 3) break;
  }

  const result = [...forbidden].slice(0, 3).map((w) => w.toUpperCase());
  const fallbacks = ['HISTORICAL', 'CONCEPT', 'EVIDENCE'];
  while (result.length < 3) {
    result.push(fallbacks[result.length]);
  }
  return result;
}

let arenaAudioCtx = null;
function playArenaSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!arenaAudioCtx && AudioCtx) arenaAudioCtx = new AudioCtx();
    if (!arenaAudioCtx) return;
    if (arenaAudioCtx.state === 'suspended') arenaAudioCtx.resume();
    const ctx = arenaAudioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'buzzer') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(120, now + 0.15);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'ding') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'pass') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch (e) {}
}

function normalizeQuestions(rawList, unitId, lessonTitle) {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((q) => {
      let options = q.options ? [...q.options] : [];
      let correctIdx = -1;
      const rawAns = q.answer !== undefined ? q.answer : q.a;
      if (typeof rawAns === 'number') {
        correctIdx = rawAns;
      } else if (typeof rawAns === 'string') {
        correctIdx = options.findIndex(
          (opt) => opt.trim().toLowerCase() === rawAns.trim().toLowerCase(),
        );
        if (correctIdx === -1 && options.length === 0 && q.distractors) {
          options = [rawAns, ...q.distractors].sort(() => Math.random() - 0.5);
          correctIdx = options.indexOf(rawAns);
        }
      }
      const qText = q.question || q.q || '';
      const safeIdx = correctIdx >= 0 ? correctIdx : 0;
      const ansText = options[safeIdx] || (typeof rawAns === 'string' ? rawAns : '');
      return {
        id: generateQuestionId(unitId, lessonTitle, qText),
        q: qText,
        a: ansText,
        options,
        answer: safeIdx,
        source: lessonTitle,
        explanation: q.explanation || q.historian_explanation || '',
      };
    })
    .filter((q) => q.q && q.options.length >= 2);
}

function sampleQuickFive(allQuestions) {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(5, shuffled.length));
}

function extractClassroomArenaData(lesson, currentIdx, lessonsList, unitId) {
  const cumulativeDeck = [];
  const todayDeck = [];

  lessonsList.slice(0, currentIdx + 1).forEach((l, lIdx) => {
    const isToday = lIdx === currentIdx;
    (l.vocab || []).forEach((v) => {
      const def = v.definition || v.def || '';
      const card = {
        term: v.term,
        tabooWords: extractTabooWords(v.term, def),
        definition: def,
        origin: isToday ? "Today's Lesson" : `Lesson ${lIdx + 1}: ${truncateAtWord(l.title || '', 28)}`,
        isToday,
      };
      cumulativeDeck.push(card);
      if (isToday) todayDeck.push(card);
    });
  });

  if (cumulativeDeck.length === 0) {
    [
      { term: 'Sovereignty', def: 'Supreme independent power and authority over a territory and its people.' },
      { term: 'Causation', def: 'The relationship between cause and consequence in historical events.' },
    ].forEach((t) => {
      const card = {
        term: t.term,
        tabooWords: extractTabooWords(t.term, t.def),
        definition: t.def,
        origin: "Today's Lesson",
        isToday: true,
      };
      cumulativeDeck.push(card);
      todayDeck.push(card);
    });
  }

  const cornersData = getArenaCornersData(unitId, lesson.id, lesson);
  const standoffPair = getArenaStandoffPair(unitId, lesson.id, lesson);

  return {
    cumulativeDeck,
    todayDeck,
    enquiry: cornersData.enquiry,
    cornerItems: cornersData.cornerItems,
    standoffPair,
  };
}

function clearAllArenaTimers(state) {
  if (!state || !state.arena) return;
  const a = state.arena;
  ['taboo', 'corners', 'standoff'].forEach((key) => {
    if (a[`${key}TimerInterval`]) {
      clearInterval(a[`${key}TimerInterval`]);
      a[`${key}TimerInterval`] = null;
    }
    a[`${key}TimerRunning`] = false;
  });
}

function closeProjectorPortal(state) {
  clearAllArenaTimers(state);
  if (state && state.arena) state.arena.isProjectorOpen = false;
  if (typeof document !== 'undefined') {
    document.getElementById('arena-projector-portal')?.remove();
  }
  if (typeof window !== 'undefined' && window._arenaEscKeyHandler) {
    window.removeEventListener('keydown', window._arenaEscKeyHandler);
    window._arenaEscKeyHandler = null;
  }
}

export function renderConsolidateStationHTML(lesson) {
  if (!lesson) return '';
  const rawQuiz = lesson.quiz || lesson.quick_quiz || lesson.quiz_questions || [];
  const rawVocab = lesson.vocab || [];
  if (rawQuiz.length === 0 && rawVocab.length === 0) return '';

  const activeUnit = appStore?.state?.activeUnitData;
  const lessonsList = (activeUnit && (activeUnit.lessons || activeUnit.subtopics)) || [];
  const lessonIndex = lessonsList.findIndex((l) => l.id === lesson.id);
  const currentIdx = lessonIndex >= 0 ? lessonIndex : 0;
  const unitId =
    (activeUnit && activeUnit.id) ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    '';

  const quickCount = Math.min(5, rawQuiz.length);
  const isTeacherOn =
    typeof document !== 'undefined' && document.body.classList.contains('teacher-mode-active');

  let savedScoreBadge = '';
  try {
    const saved = localStorage.getItem('history_quiz_' + lesson.id);
    if (saved) {
      const s = JSON.parse(saved);
      savedScoreBadge = `<span class="station-score-pill" style="background:#dcfce7;color:#166534;border:1px solid #86efac;padding:2px 9px;border-radius:999px;font-size:0.75rem;font-weight:800;"><i class="fa-solid fa-circle-check"></i> Last: ${s.score}/${s.total}</span>`;
    }
  } catch (e) {}

  return `
    <div class="phase-card no-print consolidate-station" id="consolidate-station-${lesson.id}" style="margin: 22px 0 26px 0; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 14px; box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06); overflow: hidden;">
      <!-- High-Conversion Lesson Finish & Arcade Launchbar -->
      <div id="station-masthead-${lesson.id}" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(56, 189, 248, 0.16); border: 1.5px solid rgba(56, 189, 248, 0.45); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; color: #38bdf8; flex-shrink: 0;">
            <i class="fa-solid fa-gamepad"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 style="margin: 0; color: #ffffff; font-size: 1.08rem; font-family: 'Outfit', 'Playfair Display', sans-serif; font-weight: 800;">
                Quick Check &amp; Lesson Arcade
              </h3>
              ${savedScoreBadge}
            </div>
            <p style="margin: 2px 0 0 0; color: #94a3b8; font-size: 0.78rem;">
              Lock in this enquiry with a 60-second Quick ${quickCount} check or jump straight into the Revision Arcade.
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 7px; flex-wrap: wrap;">
          ${
            quickCount > 0
              ? `
            <button type="button" id="tab-btn-quiz-${lesson.id}" onclick="window.switchConsolidateTab('${lesson.id}', 'quiz', event)" style="padding: 7px 13px; border-radius: 8px; border: 1.5px solid #60a5fa; background: #2563eb; color: #ffffff; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(37,99,235,0.35);">
              <i class="fa-solid fa-bolt" style="color:#fde047;"></i> <span id="quick5-btn-lbl-${lesson.id}">Quick ${quickCount} Check</span>
            </button>
          `
              : ''
          }

          <button type="button" onclick="window.launchUnitArcade && window.launchUnitArcade('${unitId}', ${currentIdx}, 'tetris')" style="padding: 7px 12px; border-radius: 8px; border: 1.5px solid #10b981; background: rgba(16, 185, 129, 0.15); color: #6ee7b7; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <span>🧱</span> Keyword Stack
          </button>

          <button type="button" onclick="window.launchUnitArcade && window.launchUnitArcade('${unitId}', ${currentIdx}, 'redacted')" style="padding: 7px 12px; border-radius: 8px; border: 1.5px solid #f59e0b; background: rgba(245, 158, 11, 0.15); color: #fde047; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <span>🕵️</span> Redacted!
          </button>

          <button type="button" onclick="window.launchUnitArcade && window.launchUnitArcade('${unitId}', ${currentIdx}, 'lobby')" style="padding: 7px 12px; border-radius: 8px; border: 1.5px solid #475569; background: #1e293b; color: #f8fafc; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-dice-d6" style="color:#c084fc;"></i> All 7 Games
          </button>

          <button type="button" class="teacher-only-plenary-btn" data-lesson-id="${lesson.id}" onclick="window.openTeacherPlenaryProjector('${lesson.id}')" style="display: ${isTeacherOn ? 'inline-flex' : 'none'}; padding: 7px 12px; border-radius: 8px; border: 1.5px solid #f97316; background: #ea580c; color: #ffffff; font-size: 0.8rem; font-weight: 800; cursor: pointer; align-items: center; gap: 6px;">
            <i class="fa-solid fa-tv"></i> Plenary Projector
          </button>
        </div>
      </div>

      <!-- Expandable Quick 5 Quiz Drawer -->
      <div id="station-body-${lesson.id}" style="display: none; padding: clamp(14px, 3vw, 24px); background: #ffffff;"></div>
    </div>
  `;
}

export function initConsolidateStation(lesson) {
  if (!lesson) return;
  const rawQuiz = lesson.quiz || lesson.quick_quiz || lesson.quiz_questions || [];
  const activeUnit = appStore?.state?.activeUnitData;
  const lessonsList = (activeUnit && (activeUnit.lessons || activeUnit.subtopics)) || [];
  const lessonIndex = lessonsList.findIndex((l) => l.id === lesson.id);
  const currentIdx = lessonIndex >= 0 ? lessonIndex : 0;
  const unitId =
    (activeUnit && activeUnit.id) ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    '';
  const isKs2 =
    unitId === 'ks2_ww2' ||
    String(unitId).toLowerCase().startsWith('ks2_') ||
    Boolean(activeUnit && (activeUnit.is_ks2 || activeUnit.stage === 'ks2' || activeUnit.keyStage === 'KS2')) ||
    Boolean(lesson && lesson.is_ks2);

  const allQuestions = normalizeQuestions(rawQuiz, unitId, lesson.title || `Lesson ${currentIdx + 1}`);
  const sampled = sampleQuickFive(allQuestions);

  window.consolidateStations[lesson.id] = {
    lessonId: lesson.id,
    unitId,
    lessonIndex: currentIdx,
    isKs2,
    isOpen: false,
    mode: 'quiz',
    allQuestions,
    questions: sampled,
    currentIndex: 0,
    score: 0,
    answered: false,
    selectedOption: null,
    arena: {
      gameMode: 'taboo', // 'taboo' | 'standoff' | 'corners'
      isProjectorOpen: false,
      soundEnabled: true,
      tabooDeckType: isKs2 ? 'today' : 'cumulative',
      tabooIndex: 0,
      tabooRevealedDef: false,
      tabooScore: 0,
      tabooPasses: 0,
      tabooTeamMode: false,
      tabooActiveTeam: 'red',
      tabooTeamRedScore: 0,
      tabooTeamBlueScore: 0,
      tabooTimerSeconds: 60,
      tabooTimerRunning: false,
      tabooTimerInterval: null,
      cornersSelectedCorner: null,
      cornersTimerSeconds: 60,
      cornersTimerRunning: false,
      cornersTimerInterval: null,
      standoffTimerSeconds: 60,
      standoffTimerRunning: false,
      standoffTimerInterval: null,
      standoffPhase: 'roleA',
    },
    arenaData: extractClassroomArenaData(lesson, currentIdx, lessonsList, unitId),
  };
}

function renderQuickQuizDrawer(lessonId) {
  const state = window.consolidateStations[lessonId];
  const bodyEl = document.getElementById(`station-body-${lessonId}`);
  const lblEl = document.getElementById(`quick5-btn-lbl-${lessonId}`);
  if (!state || !bodyEl) return;

  bodyEl.style.display = state.isOpen ? 'block' : 'none';
  if (lblEl) {
    lblEl.textContent = state.isOpen
      ? 'Close Quick Check'
      : `Quick ${state.questions.length} Check`;
  }
  if (!state.isOpen) return;

  if (state.currentIndex >= state.questions.length) {
    const total = state.questions.length;
    const pct = total > 0 ? Math.round((state.score / total) * 100) : 0;
    try {
      localStorage.setItem(
        'history_quiz_' + state.lessonId,
        JSON.stringify({ score: state.score, total, pct, date: Date.now() }),
      );
    } catch (e) {}

    bodyEl.innerHTML = `
      <div style="max-width: 620px; margin: 0 auto; text-align: center; padding: 8px 0;">
        <div style="font-size: 2.5rem; margin-bottom: 6px;">${pct >= 80 ? '🏆' : '⚡'}</div>
        <h4 style="margin: 0 0 6px 0; font-size: 1.35rem; color: #0f172a; font-family: 'Playfair Display', Georgia, serif;">
          Quick Check Complete: ${state.score}/${total} (${pct}%)
        </h4>
        <p style="margin: 0 0 18px 0; color: #475569; font-size: 0.9rem;">
          ${pct === 100 ? 'Flawless recall! Ready to test your speed in the Arcade?' : 'Missed items have been logged to your Spaced Repetition Weak Spots.'}
        </p>
        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
          <button type="button" onclick="window.restartStationQuiz('${state.lessonId}')" style="background: #2563eb; color: #ffffff; border: none; padding: 9px 18px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer;">
            <i class="fa-solid fa-shuffle"></i> Deal Fresh 5 Questions
          </button>
          <button type="button" onclick="window.launchUnitArcade && window.launchUnitArcade('${state.unitId}', ${state.lessonIndex}, 'tetris')" style="background: #0f172a; color: #6ee7b7; border: 1.5px solid #10b981; padding: 9px 18px; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer;">
            🧱 Play Keyword Stack
          </button>
        </div>
      </div>
    `;
    return;
  }

  const q = state.questions[state.currentIndex];
  const total = state.questions.length;
  const currentNum = state.currentIndex + 1;
  const letters = ['A', 'B', 'C', 'D'];
  const isTeacherOn =
    typeof document !== 'undefined' && document.body.classList.contains('teacher-mode-active');

  bodyEl.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.82rem; font-weight: 700; color: #64748b;">
        <span>⚡ QUICK CHECK &bull; Question ${currentNum} of ${total}</span>
        <span style="color: #2563eb;">Score: ${state.score}/${total}</span>
      </div>

      <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.18rem; color: #0f172a; margin: 0 0 16px 0; line-height: 1.45;">
        ${q.q}
      </h4>

      <div style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 16px;">
        ${q.options
          .map((opt, idx) => {
            let btnStyle = 'background:#ffffff;border:1.5px solid #cbd5e1;color:#1e293b;';
            if (state.answered) {
              if (idx === q.answer) {
                btnStyle = 'background:#f0fdf4;border:2px solid #22c55e;color:#15803d;font-weight:700;';
              } else if (idx === state.selectedOption) {
                btnStyle = 'background:#fef2f2;border:2px solid #ef4444;color:#b91c1c;font-weight:700;';
              } else {
                btnStyle = 'background:#f8fafc;border:1px solid #e2e8f0;color:#94a3b8;opacity:0.65;';
              }
            }
            return `
              <button type="button" onclick="window.answerStationQuestion('${state.lessonId}', ${idx})" ${state.answered ? 'disabled' : ''} style="${btnStyle} text-align:left; padding:11px 14px; border-radius:9px; cursor:${state.answered ? 'default' : 'pointer'}; display:flex; align-items:center; gap:12px; font-size:0.93rem;">
                <span style="width:24px;height:24px;border-radius:6px;background:#f1f5f9;color:#334155;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:0.78rem;flex-shrink:0;">${letters[idx] || idx + 1}</span>
                <span>${opt}</span>
              </button>
            `;
          })
          .join('')}
      </div>

      ${
        state.answered
          ? `
        <div style="background:#f8fafc;border:1px solid #cbd5e1;border-left:4px solid ${state.selectedOption === q.answer ? '#22c55e' : '#f59e0b'};border-radius:8px;padding:12px 15px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="flex:1;min-width:220px;font-size:0.88rem;color:#334155;line-height:1.45;">
            <strong style="color:${state.selectedOption === q.answer ? '#15803d' : '#b45309'};">${state.selectedOption === q.answer ? '✅ Correct!' : '💡 Key Takeaway:'}</strong>
            ${q.explanation || `Correct answer: ${q.a}`}
          </div>
          <button type="button" onclick="window.nextStationQuestion('${state.lessonId}')" style="background:#2563eb;color:#ffffff;border:none;padding:9px 18px;border-radius:8px;font-weight:700;font-size:0.88rem;cursor:pointer;">
            ${currentNum === total ? 'See Result' : 'Next'} <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `
          : ''
      }

      ${
        isTeacherOn
          ? `
        <div style="margin-top:12px;background:#f5f3ff;border:1px solid #c4b5fd;border-left:4px solid #7c3aed;border-radius:8px;padding:10px 14px;font-size:0.82rem;color:#1e293b;">
          <strong style="color:#5b21b6;"><i class="fa-solid fa-chalkboard-user"></i> Teacher Answer Key:</strong>
          ${state.questions.map((it, i) => `${i + 1}. <strong>${letters[it.answer] || ''}: ${it.a}</strong>`).join(' &bull; ')}
        </div>
      `
          : ''
      }
    </div>
  `;
}

// =============================================================
// TEACHER PLENARY PROJECTOR PORTAL (TABOO / STANDOFF / CORNERS)
// =============================================================
function renderProjectorPortal(lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena.isProjectorOpen) return;

  const a = state.arena;
  const arenaData = state.arenaData;
  let portal = document.getElementById('arena-projector-portal');
  if (!portal) {
    portal = document.createElement('div');
    portal.id = 'arena-projector-portal';
    document.body.appendChild(portal);
  }

  if (window._arenaEscKeyHandler) {
    window.removeEventListener('keydown', window._arenaEscKeyHandler);
  }
  window._arenaEscKeyHandler = (e) => {
    if (e.key === 'Escape') window.closeTeacherPlenaryProjector(lessonId);
  };
  window.addEventListener('keydown', window._arenaEscKeyHandler);

  let stageHtml = '';
  if (a.gameMode === 'standoff') {
    stageHtml = renderProjectorStandoff(state, arenaData);
  } else if (a.gameMode === 'corners') {
    stageHtml = renderProjectorCorners(state, arenaData);
  } else {
    stageHtml = renderProjectorTaboo(state, arenaData);
  }

  portal.innerHTML = `
    <div style="position:fixed;inset:0;z-index:9999999;background:#0b1120;color:#f8fafc;overflow-y:auto;padding:24px 36px;font-family:'Inter',system-ui,sans-serif;">
      <div style="max-width:1100px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-bottom:1.5px solid #1e293b;padding-bottom:14px;margin-bottom:20px;">
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button type="button" onclick="window.switchArenaGame('${lessonId}', 'taboo')" style="padding:8px 14px;border-radius:8px;border:none;font-weight:800;font-size:0.85rem;cursor:pointer;background:${a.gameMode === 'taboo' ? '#2563eb' : '#1e293b'};color:#ffffff;">
              🔥 Hot Seat Taboo
            </button>
            <button type="button" onclick="window.switchArenaGame('${lessonId}', 'standoff')" style="padding:8px 14px;border-radius:8px;border:none;font-weight:800;font-size:0.85rem;cursor:pointer;background:${a.gameMode === 'standoff' ? '#2563eb' : '#1e293b'};color:#ffffff;">
              ⚔️ 60s Partner Standoff
            </button>
            <button type="button" onclick="window.switchArenaGame('${lessonId}', 'corners')" style="padding:8px 14px;border-radius:8px;border:none;font-weight:800;font-size:0.85rem;cursor:pointer;background:${a.gameMode === 'corners' ? '#2563eb' : '#1e293b'};color:#ffffff;">
              🏃 Four Corners Debate
            </button>
          </div>

          <div style="display:flex;align-items:center;gap:10px;">
            <button type="button" onclick="window.toggleArenaSound('${lessonId}')" style="padding:7px 12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font-weight:700;font-size:0.82rem;cursor:pointer;">
              <i class="fa-solid ${a.soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}"></i> ${a.soundEnabled ? 'Sound ON' : 'Muted'}
            </button>
            <button type="button" onclick="window.closeTeacherPlenaryProjector('${lessonId}')" style="padding:7px 14px;border-radius:8px;border:1px solid #ef4444;background:#dc2626;color:#ffffff;font-weight:800;font-size:0.82rem;cursor:pointer;">
              <i class="fa-solid fa-xmark"></i> Close Projector (ESC)
            </button>
          </div>
        </div>
        ${stageHtml}
      </div>
    </div>
  `;
}

function formatSec(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderProjectorTaboo(state, arenaData) {
  const a = state.arena;
  const isToday = a.tabooDeckType === 'today';
  const deck = isToday && arenaData.todayDeck.length > 0 ? arenaData.todayDeck : arenaData.cumulativeDeck;
  const card = deck[a.tabooIndex % deck.length];

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button type="button" onclick="window.switchArenaTabooDeck('${state.lessonId}', 'cumulative')" style="padding:6px 12px;border-radius:7px;border:1.5px solid ${!isToday ? '#38bdf8' : '#334155'};background:${!isToday ? '#1e3a8a' : 'transparent'};color:#f8fafc;font-weight:700;font-size:0.8rem;cursor:pointer;">
          ⭐ Cumulative Unit Terms (${arenaData.cumulativeDeck.length})
        </button>
        <button type="button" onclick="window.switchArenaTabooDeck('${state.lessonId}', 'today')" style="padding:6px 12px;border-radius:7px;border:1.5px solid ${isToday ? '#38bdf8' : '#334155'};background:${isToday ? '#1e3a8a' : 'transparent'};color:#f8fafc;font-weight:700;font-size:0.8rem;cursor:pointer;">
          📌 Today's Lesson (${arenaData.todayDeck.length})
        </button>
      </div>

      <div style="display:flex;align-items:center;gap:12px;">
        <span style="background:#1e293b;border:1px solid #f59e0b;color:#fde047;padding:5px 14px;border-radius:999px;font-weight:800;font-size:0.9rem;">
          🔥 Score: ${a.tabooScore}
        </span>
        <div style="display:flex;align-items:center;gap:8px;background:#1e293b;border:1.5px solid #334155;padding:5px 12px;border-radius:10px;">
          <span id="arena-timer-val-taboo-${state.lessonId}" style="font-family:monospace;font-size:1.35rem;font-weight:900;color:#f8fafc;">${formatSec(a.tabooTimerSeconds)}</span>
          <button type="button" id="arena-timer-start-taboo-${state.lessonId}" onclick="window.${a.tabooTimerRunning ? 'pauseArenaTimer' : 'startArenaTimer'}('${state.lessonId}', 'taboo', 60)" style="background:${a.tabooTimerRunning ? '#f59e0b' : '#10b981'};color:#fff;border:none;padding:5px 12px;border-radius:6px;font-weight:800;cursor:pointer;">
            ${a.tabooTimerRunning ? 'Pause' : 'Start 60s'}
          </button>
          <button type="button" onclick="window.resetArenaTimer('${state.lessonId}', 'taboo', 60)" style="background:transparent;color:#94a3b8;border:none;cursor:pointer;"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
      </div>
    </div>

    <div style="background:#1e293b;border:2.5px solid #334155;border-radius:18px;padding:34px 24px;text-align:center;">
      <span style="background:#065f46;color:#a7f3d0;padding:4px 14px;border-radius:999px;font-size:0.8rem;font-weight:800;text-transform:uppercase;">${card.origin}</span>
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(2.2rem,5vw,3.6rem);color:#38bdf8;margin:14px 0 22px 0;">${card.term}</h2>

      <div style="background:#450a0a;border:2px dashed #ef4444;border-radius:14px;padding:18px;max-width:680px;margin:0 auto 24px auto;">
        <div style="font-size:0.8rem;font-weight:800;color:#fca5a5;margin-bottom:10px;"><i class="fa-solid fa-ban"></i> FORBIDDEN TABOO WORDS:</div>
        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
          ${card.tabooWords.map((w) => `<span style="background:#18181b;border:2px solid #ef4444;color:#f87171;font-weight:900;font-size:1.3rem;padding:6px 18px;border-radius:8px;">${w}</span>`).join('')}
        </div>
      </div>

      <div style="display:flex;justify-content:center;gap:14px;flex-wrap:wrap;">
        <button type="button" onclick="window.nextArenaTabooCard('${state.lessonId}', false, true)" style="background:#78350f;border:1.5px solid #f59e0b;color:#fef3c7;font-weight:800;font-size:1rem;padding:12px 22px;border-radius:10px;cursor:pointer;">
          <i class="fa-solid fa-forward-step"></i> Pass Card
        </button>
        <button type="button" onclick="window.nextArenaTabooCard('${state.lessonId}', true, false)" style="background:#10b981;border:none;color:#ffffff;font-weight:900;font-size:1.05rem;padding:12px 28px;border-radius:10px;cursor:pointer;">
          <i class="fa-solid fa-check"></i> Got It! (+1 Point)
        </button>
      </div>
    </div>
  `;
}

function renderProjectorStandoff(state, arenaData) {
  const a = state.arena;
  const pair = arenaData.standoffPair;
  if (!pair) return `<div style="text-align:center;padding:40px;color:#94a3b8;">No standoff pair available.</div>`;
  const isRoleA = a.standoffPhase === 'roleA';

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;background:#1e293b;border:1.5px solid #334155;border-radius:14px;padding:16px 20px;margin-bottom:18px;">
      <div>
        <div id="standoff-phase-badge-${state.lessonId}">
          <span style="background:${isRoleA ? '#2563eb' : '#dc2626'};color:#fff;padding:4px 14px;border-radius:999px;font-weight:800;font-size:0.85rem;">
            ${isRoleA ? '🛡️ PHASE 1: Partner A (First 30s)' : '⚔️ PHASE 2: Partner B (Second 30s)'}
          </span>
        </div>
        <h3 style="margin:8px 0 0 0;font-size:1.25rem;color:#ffffff;">${pair.prompt || arenaData.enquiry}</h3>
      </div>
      <div style="display:flex;align-items:center;gap:8px;background:#0f172a;border:1.5px solid #334155;padding:6px 14px;border-radius:10px;">
        <span id="arena-timer-val-standoff-${state.lessonId}" style="font-family:monospace;font-size:1.5rem;font-weight:900;color:#f8fafc;">${formatSec(a.standoffTimerSeconds)}</span>
        <button type="button" id="arena-timer-start-standoff-${state.lessonId}" onclick="window.${a.standoffTimerRunning ? 'pauseArenaTimer' : 'startArenaTimer'}('${state.lessonId}', 'standoff', 60)" style="background:${a.standoffTimerRunning ? '#f59e0b' : '#10b981'};color:#fff;border:none;padding:6px 14px;border-radius:6px;font-weight:800;cursor:pointer;">
          ${a.standoffTimerRunning ? 'Pause' : 'Start 60s Duel'}
        </button>
        <button type="button" onclick="window.resetArenaTimer('${state.lessonId}', 'standoff', 60)" style="background:transparent;color:#94a3b8;border:none;cursor:pointer;"><i class="fa-solid fa-rotate-right"></i></button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;">
      <div id="standoff-card-a-${state.lessonId}" style="background:#1e293b;border:2.5px solid ${isRoleA ? '#2563eb' : '#334155'};border-radius:16px;padding:22px;opacity:${isRoleA ? '1' : '0.72'};">
        <span style="background:#2563eb;color:#fff;padding:4px 10px;border-radius:6px;font-weight:800;font-size:0.8rem;">🛡️ PARTNER A: ${pair.roleA.name}</span>
        <p style="margin:12px 0;font-size:1rem;color:#e2e8f0;line-height:1.5;"><strong>Objective:</strong> ${pair.roleA.objective}</p>
        <div style="background:#0f172a;border-left:4px solid #2563eb;padding:12px;border-radius:6px;color:#93c5fd;font-style:italic;">${pair.roleA.starter}</div>
      </div>

      <div id="standoff-card-b-${state.lessonId}" style="background:#1e293b;border:2.5px solid ${!isRoleA ? '#dc2626' : '#334155'};border-radius:16px;padding:22px;opacity:${!isRoleA ? '1' : '0.72'};">
        <span style="background:#dc2626;color:#fff;padding:4px 10px;border-radius:6px;font-weight:800;font-size:0.8rem;">⚔️ PARTNER B: ${pair.roleB.name}</span>
        <p style="margin:12px 0;font-size:1rem;color:#e2e8f0;line-height:1.5;"><strong>Objective:</strong> ${pair.roleB.objective}</p>
        <div style="background:#0f172a;border-left:4px solid #dc2626;padding:12px;border-radius:6px;color:#fca5a5;font-style:italic;">${pair.roleB.starter}</div>
      </div>
    </div>
  `;
}

function renderProjectorCorners(state, arenaData) {
  const a = state.arena;
  const corners = arenaData.cornerItems || [];
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;background:#1e293b;border:1.5px solid #334155;border-radius:14px;padding:16px 20px;margin-bottom:18px;">
      <div>
        <div style="font-size:0.76rem;font-weight:800;color:#38bdf8;text-transform:uppercase;">FOUR CORNERS ENQUIRY DEBATE</div>
        <h3 style="margin:4px 0 0 0;font-size:1.3rem;color:#ffffff;">&ldquo;${arenaData.enquiry}&rdquo;</h3>
      </div>
      <div style="display:flex;align-items:center;gap:8px;background:#0f172a;border:1.5px solid #334155;padding:6px 14px;border-radius:10px;">
        <span id="arena-timer-val-corners-${state.lessonId}" style="font-family:monospace;font-size:1.5rem;font-weight:900;color:#f8fafc;">${formatSec(a.cornersTimerSeconds)}</span>
        <button type="button" id="arena-timer-start-corners-${state.lessonId}" onclick="window.${a.cornersTimerRunning ? 'pauseArenaTimer' : 'startArenaTimer'}('${state.lessonId}', 'corners', 60)" style="background:${a.cornersTimerRunning ? '#f59e0b' : '#10b981'};color:#fff;border:none;padding:6px 14px;border-radius:6px;font-weight:800;cursor:pointer;">
          ${a.cornersTimerRunning ? 'Pause' : 'Start 60s'}
        </button>
        <button type="button" onclick="window.resetArenaTimer('${state.lessonId}', 'corners', 60)" style="background:transparent;color:#94a3b8;border:none;cursor:pointer;"><i class="fa-solid fa-rotate-right"></i></button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">
      ${corners
        .map((c, idx) => {
          const sel = a.cornersSelectedCorner === idx;
          return `
            <div onclick="window.selectArenaCorner('${state.lessonId}', ${idx})" style="background:#1e293b;border:2px solid ${sel ? '#f59e0b' : '#334155'};border-left:6px solid ${c.color};border-radius:14px;padding:18px;cursor:pointer;">
              <div style="font-size:0.76rem;font-weight:800;color:${c.color};text-transform:uppercase;margin-bottom:4px;">📍 ${c.corner} &bull; ${c.location}</div>
              <h4 style="margin:0 0 8px 0;font-size:1.2rem;color:#ffffff;">${c.title}</h4>
              <p style="margin:0;font-size:0.9rem;color:#cbd5e1;line-height:1.45;">${c.detail}</p>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

// =============================================================
// GLOBAL WINDOW HANDLERS (BACKWARDS-COMPATIBLE + NEW)
// =============================================================
window.toggleConsolidateStation = function (lessonId, evt) {
  if (evt?.stopPropagation) evt.stopPropagation();
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  state.isOpen = !state.isOpen;
  renderQuickQuizDrawer(lessonId);
};

window.switchConsolidateTab = function (lessonId, newMode, evt) {
  if (evt?.stopPropagation) evt.stopPropagation();
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  if (newMode === 'arena') {
    window.openTeacherPlenaryProjector(lessonId);
    return;
  }
  state.isOpen = !state.isOpen;
  renderQuickQuizDrawer(lessonId);
};

window.answerStationQuestion = function (lessonId, optionIdx) {
  const state = window.consolidateStations[lessonId];
  if (!state || state.answered) return;
  const q = state.questions[state.currentIndex];
  state.answered = true;
  state.selectedOption = optionIdx;
  const isCorrect = optionIdx === q.answer;
  if (isCorrect) {
    state.score++;
    addXp(5, 'Quick Check Recall');
  }
  recordQuestionResult(q.id, isCorrect, q, state.unitId);
  renderQuickQuizDrawer(lessonId);
};

window.nextStationQuestion = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  state.currentIndex++;
  state.answered = false;
  state.selectedOption = null;
  renderQuickQuizDrawer(lessonId);
};

window.restartStationQuiz = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  state.isOpen = true;
  state.questions = sampleQuickFive(state.allQuestions);
  state.currentIndex = 0;
  state.score = 0;
  state.answered = false;
  state.selectedOption = null;
  renderQuickQuizDrawer(lessonId);
};

window.openTeacherPlenaryProjector = function (lessonId) {
  const targetId =
    lessonId ||
    Object.keys(window.consolidateStations || {})[0];
  const state = window.consolidateStations?.[targetId];
  if (!state) return;
  state.arena.isProjectorOpen = true;
  renderProjectorPortal(targetId);
};

window.closeTeacherPlenaryProjector = function (lessonId) {
  const state = window.consolidateStations?.[lessonId];
  closeProjectorPortal(state);
};

window.switchArenaGame = function (lessonId, gameMode) {
  const state = window.consolidateStations?.[lessonId];
  if (!state) return;
  clearAllArenaTimers(state);
  state.arena.gameMode = gameMode;
  renderProjectorPortal(lessonId);
};

window.toggleArenaSound = function (lessonId) {
  const state = window.consolidateStations?.[lessonId];
  if (!state) return;
  state.arena.soundEnabled = !state.arena.soundEnabled;
  renderProjectorPortal(lessonId);
};

window.switchArenaTabooDeck = function (lessonId, deckType) {
  const state = window.consolidateStations?.[lessonId];
  if (!state) return;
  state.arena.tabooDeckType = deckType;
  state.arena.tabooIndex = 0;
  renderProjectorPortal(lessonId);
};

window.nextArenaTabooCard = function (lessonId, isCorrect, isPass = false) {
  const state = window.consolidateStations?.[lessonId];
  if (!state) return;
  if (isCorrect) {
    state.arena.tabooScore++;
    if (state.arena.soundEnabled) playArenaSound('ding');
  } else if (isPass) {
    state.arena.tabooPasses++;
    if (state.arena.soundEnabled) playArenaSound('pass');
  }
  state.arena.tabooIndex++;
  renderProjectorPortal(lessonId);
};

window.selectArenaCorner = function (lessonId, idx) {
  const state = window.consolidateStations?.[lessonId];
  if (!state) return;
  state.arena.cornersSelectedCorner =
    state.arena.cornersSelectedCorner === idx ? null : idx;
  renderProjectorPortal(lessonId);
};

window.startArenaTimer = function (lessonId, gameKey, defaultSeconds = 60) {
  const state = window.consolidateStations?.[lessonId];
  if (!state) return;
  const a = state.arena;
  if (a[`${gameKey}TimerRunning`]) return;
  if (a[`${gameKey}TimerSeconds`] <= 0) {
    a[`${gameKey}TimerSeconds`] = defaultSeconds;
    if (gameKey === 'standoff') a.standoffPhase = 'roleA';
  }
  a[`${gameKey}TimerRunning`] = true;
  renderProjectorPortal(lessonId);

  a[`${gameKey}TimerInterval`] = setInterval(() => {
    if (a[`${gameKey}TimerSeconds`] > 0) {
      a[`${gameKey}TimerSeconds`]--;
      if (a.soundEnabled && a[`${gameKey}TimerSeconds`] <= 5 && a[`${gameKey}TimerSeconds`] > 0) {
        playArenaSound('tick');
      }
      if (gameKey === 'standoff' && a[`${gameKey}TimerSeconds`] <= 30 && a.standoffPhase === 'roleA') {
        a.standoffPhase = 'roleB';
        if (a.soundEnabled) playArenaSound('ding');
      }
      if (a[`${gameKey}TimerSeconds`] === 0) {
        clearInterval(a[`${gameKey}TimerInterval`]);
        a[`${gameKey}TimerInterval`] = null;
        a[`${gameKey}TimerRunning`] = false;
        if (a.soundEnabled) playArenaSound('buzzer');
      }
      renderProjectorPortal(lessonId);
    }
  }, 1000);
};

window.pauseArenaTimer = function (lessonId, gameKey) {
  const state = window.consolidateStations?.[lessonId];
  if (!state) return;
  const a = state.arena;
  if (a[`${gameKey}TimerInterval`]) {
    clearInterval(a[`${gameKey}TimerInterval`]);
    a[`${gameKey}TimerInterval`] = null;
  }
  a[`${gameKey}TimerRunning`] = false;
  renderProjectorPortal(lessonId);
};

window.resetArenaTimer = function (lessonId, gameKey, defaultSeconds = 60) {
  const state = window.consolidateStations?.[lessonId];
  if (!state) return;
  const a = state.arena;
  if (a[`${gameKey}TimerInterval`]) {
    clearInterval(a[`${gameKey}TimerInterval`]);
    a[`${gameKey}TimerInterval`] = null;
  }
  a[`${gameKey}TimerRunning`] = false;
  a[`${gameKey}TimerSeconds`] = defaultSeconds;
  if (gameKey === 'standoff') a.standoffPhase = 'roleA';
  renderProjectorPortal(lessonId);
};

window.refreshConsolidateTeacherMode = function (isActive) {
  if (typeof document !== 'undefined') {
    document.querySelectorAll('.teacher-only-plenary-btn').forEach((btn) => {
      btn.style.display = isActive ? 'inline-flex' : 'none';
    });
  }
  if (!window.consolidateStations) return;
  Object.keys(window.consolidateStations).forEach((lessonId) => {
    const state = window.consolidateStations[lessonId];
    if (state && state.isOpen) {
      renderQuickQuizDrawer(lessonId);
    }
  });
};
