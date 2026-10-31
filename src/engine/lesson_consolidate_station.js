/**
 * Lesson Consolidate Station
 * 
 * Embedded, zero-click interactive retrieval & consolidation station
 * rendered directly at the bottom of every lesson page across all units.
 * 
 * 5 Unified Terminal Modes (Sequential Plenary Flow):
 * 1. Living Timeline (Default First Tab) — Centrefold workbook milestone (pp. 8–9) & Dual-Pathway guide
 * 2. Lesson Quiz (10–20 Qs) — Instant closed-book multiple-choice factual retrieval
 * 3. Vocab Cards (5–8 Terms) — Interactive 3D flip-cards for disciplinary terminology
 * 4. Chrono Domino (3–5 Milestones) — Tap-to-order causal sequence & turning points challenge
 * 5. Exit Ticket — Rotating disciplinary synthesis (Golden Sentence / Causal Scale / Misconception / Hinge Verdict)
 */

import { appStore } from './store.js';
import { WORKBOOK_TIMELINE_DATA } from './workbook_timeline_data.js';
import { getArenaStandoffPair } from './arena_standoff_registry.js';
import { getArenaCornersData } from './arena_corners_registry.js';

// Global registry of active station states keyed by lessonId
window.consolidateStations = window.consolidateStations || {};

function formatMarkdown(str) {
  if (!str) return '';
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function countWordsAndSentences(text) {
  if (!text || !text.trim()) return { words: 0, sentences: 0 };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (words > 0 ? 1 : 0);
  return { words, sentences };
}

function truncateAtWord(text, maxChars = 140) {
  if (!text) return '';
  const clean = text
    .replace(/<[^>]+>/g, '')
    .replace(/\[\d+\.\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '...';
}

function extractCleanSentence(text, maxChars = 280) {
  if (!text) return '';
  const clean = text
    .replace(/<[^>]+>/g, '')
    .replace(/\[\d+\.\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Temporarily protect known abbreviations and initials with periods
  const protectedText = clean
    .replace(/\b([A-Z])\.\s+/g, '$1_DOT_ ')
    .replace(/\b(Mr|Mrs|Ms|Dr|St|Lt|Gen|Capt|Col|Prof|c|vs|etc|e\.g|i\.e)\.\s+/gi, (m, g1) => g1 + '_DOT_ ');

  const match = protectedText.match(/^([^\.!\?]+[\.!\?])/);
  if (match) {
    let sentence = match[1].replace(/_DOT_/g, '.').trim();
    if (sentence.length >= 50 && sentence.length <= maxChars) {
      return sentence;
    }
    if (sentence.length < 50) {
      const rest = protectedText.slice(match[0].length).trim();
      const secondMatch = rest.match(/^([^\.!\?]+[\.!\?])/);
      if (secondMatch) {
        const full = (sentence + ' ' + secondMatch[1].replace(/_DOT_/g, '.')).trim();
        if (full.length <= maxChars) return full;
      }
      return sentence;
    }
  }

  // Fallback: If no period found or initial sentence is longer than maxChars, break cleanly at whole word
  return truncateAtWord(clean, maxChars);
}

function extractSketchIdeas(lesson, date) {
  const ideas = [];
  if (lesson.causal_domino_spine && Array.isArray(lesson.causal_domino_spine.stages)) {
    lesson.causal_domino_spine.stages.forEach((st) => {
      if (st.tag && !ideas.includes(st.tag.trim())) {
        ideas.push(st.tag.trim());
      }
    });
  }
  if (ideas.length < 3 && Array.isArray(lesson.margin_spine)) {
    lesson.margin_spine.forEach((m) => {
      if (m.label && ideas.length < 3 && !ideas.includes(m.label.trim())) {
        ideas.push(m.label.trim());
      }
    });
  }
  if (ideas.length < 3 && Array.isArray(lesson.vocab)) {
    lesson.vocab.forEach((v) => {
      if (v.term && ideas.length < 3 && !ideas.includes(v.term.trim())) {
        ideas.push(v.term.trim());
      }
    });
  }
  if (ideas.length === 0) {
    ideas.push('👑 Sovereign symbol / Crest', '📜 Official decree / Charter', '⚔️ Defining conflict emblem');
  }
  return ideas.slice(0, 3);
}

// =============================================================
// CLASSROOM ARENA: CONSTANTS, VOCAB EXTRACTION & AUDIO ENGINE
// =============================================================
const ARENA_STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'is', 'was', 'for', 'by', 'with', 
  'that', 'this', 'as', 'at', 'from', 'it', 'on', 'which', 'be', 'are', 'were', 'been',
  'into', 'through', 'over', 'after', 'under', 'between', 'during', 'their', 'them',
  'his', 'her', 'its', 'they', 'he', 'she', 'who', 'whom', 'whose', 'where', 'when',
  'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
  'just', 'should', 'now', 'used', 'became', 'made', 'also', 'such', 'what', 'would',
  'could', 'have', 'having', 'had', 'does', 'did', 'doing', 'shall', 'might'
]);

function extractTabooWords(term, definition) {
  const termWords = new Set(
    (term || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean)
  );

  const forbidden = new Set();

  const words = (definition || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !ARENA_STOPWORDS.has(w) && !termWords.has(w));

  for (const w of words) {
    if (!forbidden.has(w)) {
      forbidden.add(w);
      if (forbidden.size >= 3) break;
    }
  }

  const result = [...forbidden].slice(0, 3).map(w => w.toUpperCase());
  if (result.length < 3) {
    const fallbacks = ['HISTORICAL', 'KEY_CONCEPT', 'DEFINITION'];
    while (result.length < 3) {
      result.push(fallbacks[result.length]);
    }
  }
  return result;
}

let arenaAudioCtx = null;
function getArenaAudioContext() {
  if (!arenaAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) arenaAudioCtx = new AudioCtx();
  }
  if (arenaAudioCtx && arenaAudioCtx.state === 'suspended') {
    arenaAudioCtx.resume();
  }
  return arenaAudioCtx;
}

function playArenaSound(type) {
  try {
    const ctx = getArenaAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'buzzer') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(120, now + 0.15);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'ding') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
        noteGain.gain.setValueAtTime(0.2, now + idx * 0.09);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.start(now + idx * 0.09);
        noteOsc.stop(now + idx * 0.09 + 0.4);
      });
    }
  } catch (e) {}
}

function extractClassroomArenaData(lesson, currentIdx, lessonsList, unitId) {
  // 1. Hot Seat Cumulative Vocabulary
  const cumulativeDeck = [];
  const todayDeck = [];

  lessonsList.slice(0, currentIdx + 1).forEach((l, lIdx) => {
    const isToday = lIdx === currentIdx;
    (l.vocab || []).forEach(v => {
      const taboo = extractTabooWords(v.term, v.definition || '');
      const card = {
        term: v.term,
        tabooWords: taboo,
        definition: v.definition || '',
        syllables: v.syllables || '',
        origin: isToday ? "Today's Lesson" : `Lesson ${lIdx + 1}: ${truncateAtWord(l.title || '', 28)}`,
        isToday
      };
      cumulativeDeck.push(card);
      if (isToday) todayDeck.push(card);
    });
  });

  // Fallback if no vocab found
  if (cumulativeDeck.length === 0) {
    const terms = [
      { term: 'Sovereignty', def: 'Supreme independent power and authority over a territory and its people.' },
      { term: 'Chronology', def: 'The arrangement of events or dates in the exact order of their occurrence.' },
      { term: 'Hierarchy', def: 'A system in which members of an organization or society are ranked according to status or authority.' },
      { term: 'Causation', def: 'The relationship between cause and consequence, demonstrating why historical events developed.' }
    ];
    terms.forEach(t => {
      const taboo = extractTabooWords(t.term, t.def);
      const card = { term: t.term, tabooWords: taboo, definition: t.def, origin: "Today's Lesson", isToday: true };
      cumulativeDeck.push(card);
      todayDeck.push(card);
    });
  }

  // 2. Four Corners — Evaluative Enquiry Debate
  // Uses curated registry or smart causal engine to ensure a genuine question and competing causal claims
  const cornersData = getArenaCornersData(unitId, lesson.id, lesson);
  const cleanEnquiry = cornersData.enquiry;
  const cornerItems = cornersData.cornerItems;

  // 3. 60s Standoff — High-Impact Historical Shoulder-Partner Duel
  // Driven by curated ARENA_STANDOFF_REGISTRY (or academic causal/historiographical fallback)
  const standoffPair = getArenaStandoffPair(unitId, lesson.id, lesson);

  // 4. Quick Facts Lifeline for Lightning Chain
  const stages = lesson.causal_domino_spine?.stages || [];
  const quickFacts = [];
  stages.forEach(s => {
    if (s.date && s.title) quickFacts.push(`${s.date}: ${s.title}`);
  });
  (lesson.vocab || []).forEach(v => {
    if (quickFacts.length < 8) quickFacts.push(`Key Term: ${v.term}`);
  });

  return {
    cumulativeDeck,
    todayDeck,
    enquiry: cleanEnquiry,
    cornerItems,
    standoffPair,
    quickFacts
  };
}

function clearAllArenaTimers(state) {
  if (!state || !state.arena) return;
  const a = state.arena;
  ['taboo', 'corners', 'standoff', 'lightning'].forEach(key => {
    const intervalKey = `${key}TimerInterval`;
    if (a[intervalKey]) {
      clearInterval(a[intervalKey]);
      a[intervalKey] = null;
    }
    a[`${key}TimerRunning`] = false;
  });
}

function tickArenaTimer(lessonId, gameKey, totalDuration) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const a = state.arena;
  const timeKey = `${gameKey}TimerSeconds`;
  const intervalKey = `${gameKey}TimerInterval`;
  const runningKey = `${gameKey}TimerRunning`;

  if (a[timeKey] > 0) {
    a[timeKey]--;
    
    // Play tick in final 5 seconds
    if (a.soundEnabled && a[timeKey] <= 5 && a[timeKey] > 0) {
      playArenaSound('tick');
    }

    // Standoff 30s phase switch
    if (gameKey === 'standoff') {
      if (a[timeKey] <= 30 && a.standoffPhase === 'roleA') {
        a.standoffPhase = 'roleB';
        if (a.soundEnabled) playArenaSound('ding');
      }
    }

    if (a[timeKey] === 0) {
      clearInterval(a[intervalKey]);
      a[intervalKey] = null;
      a[runningKey] = false;
      if (a.soundEnabled) {
        if (gameKey === 'lightning' && a.seatedCount >= a.targetStudents) {
          playArenaSound('fanfare');
        } else {
          playArenaSound('buzzer');
        }
      }
    }

    updateArenaTimerDOM(lessonId, gameKey);
  }
}

function updateArenaTimerDOM(lessonId, gameKey) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const a = state.arena;
  const seconds = a[`${gameKey}TimerSeconds`];
  const isRunning = a[`${gameKey}TimerRunning`];

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const timeDisplay = document.getElementById(`arena-timer-val-${gameKey}-${lessonId}`);
  if (timeDisplay) {
    timeDisplay.textContent = timeStr;
    if (seconds <= 5 && seconds > 0) {
      timeDisplay.style.color = '#ef4444';
    } else if (seconds === 0) {
      timeDisplay.style.color = '#dc2626';
    } else {
      timeDisplay.style.color = a.isWhiteboardMode ? '#f8fafc' : '#0f172a';
    }
  }

  const startBtn = document.getElementById(`arena-timer-start-${gameKey}-${lessonId}`);
  if (startBtn) {
    if (isRunning) {
      startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
      startBtn.setAttribute('onclick', `window.pauseArenaTimer('${lessonId}', '${gameKey}')`);
      startBtn.style.background = '#f59e0b';
    } else {
      startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
      const defaultDuration = gameKey === 'lightning' ? 90 : 60;
      startBtn.setAttribute('onclick', `window.startArenaTimer('${lessonId}', '${gameKey}', ${defaultDuration})`);
      startBtn.style.background = '#10b981';
    }
  }

  if (gameKey === 'standoff') {
    const phaseBadge = document.getElementById(`standoff-phase-badge-${lessonId}`);
    if (phaseBadge) {
      if (a.standoffPhase === 'roleA') {
        phaseBadge.innerHTML = '<span style="background: #2563eb; color: #ffffff; padding: 4px 14px; border-radius: 999px; font-weight: 800; font-size: 0.85rem;"><i class="fa-solid fa-shield"></i> PHASE 1: Partner A Defending (30s)</span>';
      } else {
        phaseBadge.innerHTML = '<span style="background: #dc2626; color: #ffffff; padding: 4px 14px; border-radius: 999px; font-weight: 800; font-size: 0.85rem;"><i class="fa-solid fa-swords"></i> PHASE 2: Partner B Rebutting (30s)</span>';
      }
    }
    const cardA = document.getElementById(`standoff-card-a-${lessonId}`);
    const cardB = document.getElementById(`standoff-card-b-${lessonId}`);
    if (cardA && cardB) {
      if (a.standoffPhase === 'roleA') {
        cardA.style.borderColor = '#2563eb';
        cardA.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.3)';
        cardA.style.opacity = '1';
        cardB.style.borderColor = a.isWhiteboardMode ? '#334155' : '#cbd5e1';
        cardB.style.boxShadow = 'none';
        cardB.style.opacity = '0.7';
      } else {
        cardB.style.borderColor = '#dc2626';
        cardB.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.3)';
        cardB.style.opacity = '1';
        cardA.style.borderColor = a.isWhiteboardMode ? '#334155' : '#cbd5e1';
        cardA.style.boxShadow = 'none';
        cardA.style.opacity = '0.7';
      }
    }
  }
}

function normalizeQuestions(rawList) {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((q) => {
    let options = q.options ? [...q.options] : [];
    let correctIdx = -1;
    const rawAns = q.answer !== undefined ? q.answer : q.a;
    if (typeof rawAns === 'number') {
      correctIdx = rawAns;
    } else if (typeof rawAns === 'string') {
      correctIdx = options.findIndex(
        (opt) => opt.trim().toLowerCase() === rawAns.trim().toLowerCase()
      );
      if (correctIdx === -1 && options.length === 0 && q.distractors) {
        options = [rawAns, ...q.distractors].sort(() => Math.random() - 0.5);
        correctIdx = options.indexOf(rawAns);
      }
    }
    return {
      q: q.question || q.q || '',
      options,
      answer: correctIdx >= 0 ? correctIdx : 0,
      explanation: q.explanation || q.historian_explanation || ''
    };
  });
}

function normalizeVocab(rawVocab) {
  if (!Array.isArray(rawVocab)) return [];
  return rawVocab.map((v) => ({
    term: v.term || v.word || '',
    definition: v.definition || v.def || '',
    syllables: v.syllables || '',
    tier: v.tier || '2'
  }));
}

function extractChronologyMilestones(lesson) {
  if (!lesson) return [];

  // 1. Causal domino spine stages (Universal 3-Act Causal Arc: Start, Turning Point, Climax)
  if (
    lesson.causal_domino_spine &&
    Array.isArray(lesson.causal_domino_spine.stages) &&
    lesson.causal_domino_spine.stages.length >= 3
  ) {
    const rawStages = lesson.causal_domino_spine.stages;
    let selectedStages = [];
    if (rawStages.length === 3) {
      selectedStages = rawStages;
    } else if (rawStages.length === 4) {
      selectedStages = [rawStages[0], rawStages[1], rawStages[3]];
    } else {
      // 5 stages: Beginning (0), Turning Point (2), Climax/Legacy (4)
      selectedStages = [rawStages[0], rawStages[2], rawStages[rawStages.length - 1]];
    }

    return selectedStages.map((s, idx) => {
      const rawText = s.trigger || s.tag || s.therefore || '';
      const fullSentence = extractCleanSentence(rawText, 260) || rawText.replace(/<[^>]+>/g, '').replace(/\[\d+\.\d+\]/g, '').trim();
      return {
        originalIndex: idx,
        date: s.date || `Turning Point ${idx + 1}`,
        title: s.title || `Turning Point ${idx + 1}`,
        detail: fullSentence
      };
    });
  }

  // 2. Margin spine (3-item arc)
  if (Array.isArray(lesson.margin_spine) && lesson.margin_spine.length >= 3) {
    const rawMargin = lesson.margin_spine;
    let selectedMargin = [];
    if (rawMargin.length === 3) {
      selectedMargin = rawMargin;
    } else {
      selectedMargin = [rawMargin[0], rawMargin[Math.floor(rawMargin.length / 2)], rawMargin[rawMargin.length - 1]];
    }
    return selectedMargin.map((m, idx) => {
      const rawText = m.desc || m.label || '';
      const fullSentence = extractCleanSentence(rawText, 260) || rawText.replace(/<[^>]+>/g, '').trim();
      return {
        originalIndex: idx,
        date: m.year || `Point ${idx + 1}`,
        title: m.label || `Milestone ${idx + 1}`,
        detail: fullSentence
      };
    });
  }

  // 3. Narrative blocks (3-item arc)
  const blocks = lesson.narrative_blocks || lesson.blocks || [];
  if (Array.isArray(blocks) && blocks.length >= 3) {
    let selectedBlocks = [];
    if (blocks.length === 3) {
      selectedBlocks = blocks;
    } else {
      selectedBlocks = [blocks[0], blocks[Math.floor(blocks.length / 2)], blocks[blocks.length - 1]];
    }
    return selectedBlocks.map((b, idx) => {
      const dateMatch = (b.heading || b.title || '').match(/\b(1\d{3}|20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b[^\)]*/i);
      const cleanTitle = (b.heading || b.title || `Stage ${idx + 1}`)
        .replace(/^\[?\d+\.\d+\]?\s*/, '')
        .replace(/\([^\)]+\)/, '')
        .trim();
      const rawText = (b.text || '').replace(/<[^>]+>/g, '').replace(/\[\d+\.\d+\]/, '').trim();
      const fullSentence = extractCleanSentence(rawText, 260) || rawText.slice(0, 180);
      return {
        originalIndex: idx,
        date: dateMatch ? dateMatch[0].trim() : `Phase ${idx + 1}`,
        title: cleanTitle,
        detail: fullSentence
      };
    });
  }

  return [];
}

function extractLivingTimelineMilestone(lesson, lessonIndex = 0) {
  if (!lesson) return null;

  // 1. Check Canonical Master Workbook Timeline Registry (100% literal physical workbook sync)
  const activeUnitId = appStore?.state?.activeUnitData?.id || '';
  const unitMissions = WORKBOOK_TIMELINE_DATA[activeUnitId];
  if (Array.isArray(unitMissions)) {
    const matched = unitMissions.find(
      (m) => (lesson.id && m.lessonId === lesson.id) || m.lessonIndex === lessonIndex
    );
    if (matched) {
      return {
        milestoneNum: lessonIndex + 1,
        milestoneBadge: matched.milestoneBadge,
        date: matched.date,
        title: matched.title,
        desc: matched.desc,
        pageRef: matched.pageRef,
        sketchPrompt: matched.sketchPrompt,
        sketchIdeas: matched.sketchIdeas || [],
        conceptTitle: matched.conceptTitle,
        branches: matched.branches || [],
        fullMissionText: matched.fullMissionText,
        isWorkbookMission: true
      };
    }
  }

  // 2. Dynamic extraction fallback
  let date = '';
  let title = lesson.title || '';
  let desc = '';

  if (lesson.timeline_anchor && lesson.timeline_anchor.length > 0) {
    const a = lesson.timeline_anchor[0];
    date = a.year || a.date || '';
    title = a.title || a.event || title;
    desc = a.summary || a.desc || '';
  } else if (lesson.margin_spine && lesson.margin_spine.length > 0) {
    const m = lesson.margin_spine[0];
    date = m.year || '';
    title = m.label || title;
    desc = m.desc || '';
  } else if (
    lesson.causal_domino_spine &&
    lesson.causal_domino_spine.stages &&
    lesson.causal_domino_spine.stages.length > 0
  ) {
    const s = lesson.causal_domino_spine.stages[0];
    date = s.date || '';
    title = s.title || title;
    desc = s.trigger || '';
  }

  if (!date) {
    const dateM = (lesson.title || '').match(/\b(1\d{3}|20\d{2}|c\.\s*1\d{3}[–\-0-9\s]*)\b/);
    if (dateM) date = dateM[0];
  }

  if (!desc && lesson.narrative_blocks && lesson.narrative_blocks.length > 0) {
    desc = extractCleanSentence(lesson.narrative_blocks[0].text, 280);
  }

  const cleanTitle = title.replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '').trim();
  const vocabTerms = (lesson.vocab || []).slice(0, 3).map((v) => v.term);
  const cleanEnquiry = (lesson.enquiryQuestion || lesson.enquiry || lesson.title || '')
    .replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '')
    .trim();

  const sketchIdeas = extractSketchIdeas(lesson, date);
  const enquirySnippet = truncateAtWord(cleanEnquiry, 140);

  const branches = [
    { label: 'Date & Anchor', value: date || 'Key Turning Point' },
    { label: 'Key Concept', value: vocabTerms[0] || 'Historical Mechanism' },
    { label: 'Enquiry Synthesis', value: enquirySnippet }
  ];

  return {
    milestoneNum: lessonIndex + 1,
    date: date || 'Key Milestone',
    title: cleanTitle,
    desc: desc || `Chronological milestone for Lesson ${lessonIndex + 1}.`,
    sketchIdeas,
    branches,
    vocabTerms
  };
}

function extractExitTicket(lesson, lessonIndex = 0) {
  if (!lesson) return null;

  // 1. Handcrafted Exit Ticket object (e.g. in Conflict in the Middle East)
  if (lesson.exit_ticket) {
    return {
      title: lesson.exit_ticket.title || 'Exit Ticket · Lesson Closure',
      type_label: lesson.exit_ticket.type_label || 'Exit Ticket',
      prompt: lesson.exit_ticket.prompt || '',
      options: lesson.exit_ticket.options || [],
      guidance: lesson.exit_ticket.guidance || '',
      model: lesson.exit_ticket.model || lesson.exit_ticket.exemplar || 'A high-level response includes precise statistics, named historical individuals, and clear analytical causal links.'
    };
  }

  // 2. Dedicated consolidation string
  if (typeof lesson.consolidation === 'string' && lesson.consolidation.trim().length > 0) {
    return {
      title: 'Exit Ticket · Evaluative Verdict',
      type_label: 'Exit Ticket · Evaluative Verdict',
      prompt: lesson.consolidation,
      options: [
        'State your clear, definitive historical verdict.',
        'Support your claim with one piece of precise evidence from today\'s lesson.',
        'Explain the long-term historical significance.'
      ],
      guidance: 'Write your concise historical verdict in 1–2 sentences.',
      model: 'An exemplary verdict states a nuanced historical judgment supported by concrete dates and named figures.'
    };
  }

  const enquiry = lesson.enquiryQuestion || lesson.enquiry_question || lesson.enquiry || lesson.title || '';
  const cleanEnquiry = enquiry.replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '').trim();

  let hingeQ = '';
  if (lesson.teacher_notes && Array.isArray(lesson.teacher_notes.objectives)) {
    const objWithQ = lesson.teacher_notes.objectives.find((o) => o.question);
    if (objWithQ) hingeQ = objWithQ.question;
  }

  const vocabList = (lesson.vocab || []).slice(0, 3).map((v) => v.term).join(', ') || 'today\'s key terms';
  const styleType = lessonIndex % 4;

  if (styleType === 0) {
    // Style 0: The Three-Tiered Golden Sentence (Disciplinary Syntax)
    return {
      title: 'Exit Ticket: The Three-Tiered Golden Sentence',
      type_label: 'Exit Ticket · The Golden Sentence',
      prompt: `Write **ONE single, grammatically sophisticated historical sentence** evaluating today's enquiry: <em>&ldquo;${cleanEnquiry}&rdquo;</em>. Your sentence MUST strictly include all three required ingredients:`,
      options: [
        'Ingredient 1 (Precise Evidence): Include one specific date, statistic, or named historical figure.',
        `Ingredient 2 (Historical Concept): Incorporate at least one key vocabulary term from today\'s word bank [e.g. ${vocabList}].`,
        'Ingredient 3 (Causal Conjunction): Connect cause and consequence using an analytical connective [e.g. consequently, provoked by, culminating in, or whereas].'
      ],
      guidance: 'Write exactly ONE sentence. Do not split your thought into multiple sentences.',
      model: `Model Sentence: Provoked by rising tensions and key turning points, historical leaders enacted decisive measures [such as ${vocabList}], consequently transforming the political landscape forever.`
    };
  } else if (styleType === 1) {
    // Style 1: The Causal Balance Scale (0 to 10 Historical Judgement)
    return {
      title: 'Exit Ticket: The Causal Balance Scale',
      type_label: 'Exit Ticket · The Causal Balance Scale',
      prompt: `How far do you agree with today's decisive historical claim? Rate your judgment on a scale of **0 (Completely Disagree)** to **10 (Completely Agree)**:<br><strong style="color: #1e3a8a;">&ldquo;${hingeQ || cleanEnquiry}&rdquo;</strong>`,
      options: [
        'Rating (0–10): State your numerical score clearly at the start of your response.',
        'The Decisive Factor: Cite the single most convincing piece of historical evidence justifying your rating.',
        'The Counter-Perspective: Acknowledge what an alternative historian might argue from the opposite viewpoint.'
      ],
      guidance: 'A nuanced Grade 8/9 judgment weighs both sides before giving a decisive score.',
      model: `Score: 8/10. While opponents argued that alternative factors played a role, the decisive historical turning point was solidified by concrete evidence and institutional policy.`
    };
  } else if (styleType === 2) {
    // Style 2: The Historical Misconception Check (Two Truths & A Fallacy)
    return {
      title: 'Exit Ticket: Spot the Misconception & Correct the Fallacy',
      type_label: 'Exit Ticket · Misconception Check',
      prompt: `A student in another class made this claim: <em>&ldquo;Historical changes in this era happened entirely overnight because of a single leader.&rdquo;</em><br>Identify what is flawed about this interpretation and write a **2-sentence historical correction** citing accurate evidence from today's lesson.`,
      options: [
        'Identify the Flaw: Explain why this common assumption oversimplifies the true historical cause.',
        'Historical Correction: Cite specific economic, social, or political evidence from today proving how change really occurred.'
      ],
      guidance: 'Historians look for underlying causes rather than crediting single individuals in isolation.',
      model: `Historical Correction: This claim overlooks the long-term structural and economic tensions that had built up over decades. Real change was driven by broader social friction and institutional pressures rather than a single sudden event.`
    };
  } else {
    // Style 3: The Evaluative Historical Verdict (Hinge Question Synthesis)
    return {
      title: 'Exit Ticket: The Evaluative Historical Verdict',
      type_label: 'Exit Ticket · Evaluative Verdict',
      prompt: hingeQ
        ? `Answer today's central Hinge Question before leaving class:<br><strong style="color: #1e3a8a; font-size: 1.1rem;">&ldquo;${hingeQ}&rdquo;</strong>`
        : `In 2–3 sentences, evaluate today's core historical enquiry: <em>&ldquo;${cleanEnquiry}&rdquo;</em>.`,
      options: [
        'Criterion 1: State your direct, nuanced historical judgment.',
        'Criterion 2: Cite two corroborating historical details from today\'s lesson.',
        'Criterion 3: Conclude with the overarching long-term significance.'
      ],
      guidance: 'Synthesize your argument with precision before packing up.',
      model: `Historian's Verdict: The evidence demonstrates that developments were primarily driven by systemic strategic priorities, establishing a decisive legal and political precedent for generations to follow.`
    };
  }
}

export function renderConsolidateStationHTML(lesson) {
  if (!lesson) return '';
  const rawQuiz = lesson.quiz || lesson.quick_quiz || lesson.quiz_questions || [];
  const rawVocab = lesson.vocab || [];
  const milestones = extractChronologyMilestones(lesson);

  const activeUnit = appStore.state.activeUnitData;
  const lessonsList = (activeUnit && (activeUnit.lessons || activeUnit.subtopics)) || [];
  const lessonIndex = lessonsList.findIndex((l) => l.id === lesson.id);
  const currentIdx = lessonIndex >= 0 ? lessonIndex : 0;
  const unitId = (activeUnit && activeUnit.id) || (typeof window !== 'undefined' && window.currentUnitId) || '';

  const livingTimeline = extractLivingTimelineMilestone(lesson, currentIdx);
  const exitTicket = extractExitTicket(lesson, currentIdx);

  const quizCount = rawQuiz.length;
  const vocabCount = rawVocab.length;
  const dominoCount = milestones.length;
  const hasTimeline = Boolean(livingTimeline);
  const hasExitTicket = Boolean(exitTicket);
  const hasArena = (vocabCount > 0 || (lesson.causal_domino_spine && lesson.causal_domino_spine.stages && lesson.causal_domino_spine.stages.length > 0));

  if (quizCount === 0 && vocabCount === 0 && dominoCount === 0 && !hasTimeline && !hasExitTicket && !hasArena) {
    return '';
  }

  // Check saved score from localStorage
  let savedScoreBadge = '';
  try {
    const saved = localStorage.getItem('history_quiz_' + lesson.id);
    if (saved) {
      const s = JSON.parse(saved);
      savedScoreBadge = `<span class="station-score-pill" title="Previous Best Score" style="background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Best: ${s.score}/${s.total} (${s.pct}%)</span>`;
    }
  } catch (e) {}

  return `
    <div class="phase-card no-print consolidate-station" id="consolidate-station-${lesson.id}" style="margin: 35px 0 30px 0; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 16px; box-shadow: 0 6px 22px rgba(15, 23, 42, 0.06); overflow: hidden;">
      <!-- Masthead & Tab Controller -->
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-bottom: 2px solid #e2e8f0; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #eff6ff; border: 1.5px solid #bfdbfe; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; color: #2563eb; flex-shrink: 0; box-shadow: 0 2px 8px rgba(37,99,235,0.12);">
            🎯
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <h3 style="margin: 0; color: #0f172a; font-size: 1.3rem; font-family: 'Playfair Display', Georgia, serif; font-weight: 700;">
                Check &amp; Consolidate Hub
              </h3>
              ${savedScoreBadge}
            </div>
            <p style="margin: 3px 0 0 0; color: #64748b; font-size: 0.85rem;">
              Centrefold Timeline &bull; Retrieval Quiz &bull; Vocabulary Cards &bull; Chrono Domino &bull; Exit Ticket &bull; Classroom Arena
            </p>
          </div>
        </div>

        <!-- Mode Select Tabs (Living Timeline FIRST) -->
        <div class="station-tabs" style="display: flex; gap: 4px; background: #e2e8f0; padding: 4px; border-radius: 10px; flex-wrap: wrap;">
          ${hasTimeline ? `
            <button type="button" class="station-tab-btn active" id="tab-btn-timeline-${lesson.id}" onclick="window.switchConsolidateTab('${lesson.id}', 'timeline')" style="padding: 6px 12px; border-radius: 7px; border: none; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; background: #ffffff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
              <i class="fa-solid fa-map" style="color: #0284c7;"></i> Living Timeline
            </button>
          ` : ''}
          ${quizCount > 0 ? `
            <button type="button" class="station-tab-btn ${!hasTimeline ? 'active' : ''}" id="tab-btn-quiz-${lesson.id}" onclick="window.switchConsolidateTab('${lesson.id}', 'quiz')" style="padding: 6px 12px; border-radius: 7px; border: none; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; ${!hasTimeline ? 'background: #ffffff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1);' : 'background: transparent; color: #475569;'}">
              <i class="fa-solid fa-circle-check" style="color: #2563eb;"></i> Lesson Quiz (${quizCount})
            </button>
          ` : ''}
          ${vocabCount > 0 ? `
            <button type="button" class="station-tab-btn" id="tab-btn-vocab-${lesson.id}" onclick="window.switchConsolidateTab('${lesson.id}', 'vocab')" style="padding: 6px 12px; border-radius: 7px; border: none; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; background: transparent; color: #475569;">
              <i class="fa-solid fa-layer-group" style="color: #10b981;"></i> Vocab Cards (${vocabCount})
            </button>
          ` : ''}
          ${dominoCount > 0 ? `
            <button type="button" class="station-tab-btn" id="tab-btn-domino-${lesson.id}" onclick="window.switchConsolidateTab('${lesson.id}', 'domino')" style="padding: 6px 12px; border-radius: 7px; border: none; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; background: transparent; color: #475569;">
              <i class="fa-solid fa-timeline" style="color: #8b5cf6;"></i> Chrono Domino (${dominoCount})
            </button>
          ` : ''}
          ${hasExitTicket ? `
            <button type="button" class="station-tab-btn" id="tab-btn-exit-${lesson.id}" onclick="window.switchConsolidateTab('${lesson.id}', 'exit')" style="padding: 6px 12px; border-radius: 7px; border: none; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; background: transparent; color: #475569;">
              <i class="fa-solid fa-ticket" style="color: #f59e0b;"></i> Exit Ticket
            </button>
          ` : ''}
          <button type="button" class="station-tab-btn" id="tab-btn-arena-${lesson.id}" onclick="window.switchConsolidateTab('${lesson.id}', 'arena')" style="padding: 6px 12px; border-radius: 7px; border: none; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; background: transparent; color: #475569;">
            <i class="fa-solid fa-bolt" style="color: #f59e0b;"></i> Classroom Arena
          </button>
        </div>
      </div>

      <!-- Main Interactive Viewport -->
      <div id="station-body-${lesson.id}" style="padding: 24px; min-height: 270px; background: #ffffff;">
        <!-- Injected via JavaScript controller -->
      </div>
    </div>
  `;
}

export function initConsolidateStation(lesson) {
  if (!lesson) return;
  const rawQuiz = lesson.quiz || lesson.quick_quiz || lesson.quiz_questions || [];
  const rawVocab = lesson.vocab || [];
  const milestones = extractChronologyMilestones(lesson);

  const activeUnit = appStore.state.activeUnitData;
  const lessonsList = (activeUnit && (activeUnit.lessons || activeUnit.subtopics)) || [];
  const lessonIndex = lessonsList.findIndex((l) => l.id === lesson.id);
  const currentIdx = lessonIndex >= 0 ? lessonIndex : 0;
  const unitId = (activeUnit && activeUnit.id) || (typeof window !== 'undefined' && window.currentUnitId) || '';

  const livingTimeline = extractLivingTimelineMilestone(lesson, currentIdx);
  const exitTicket = extractExitTicket(lesson, currentIdx);

  if (rawQuiz.length === 0 && rawVocab.length === 0 && milestones.length === 0 && !livingTimeline && !exitTicket) return;

  const allQuestions = normalizeQuestions(rawQuiz);
  const allVocab = normalizeVocab(rawVocab);
  const shuffledMilestones = [...milestones].sort(() => Math.random() - 0.5);

  // Living Timeline is the DEFAULT tab (pedagogical pen-in-hand transition)
  let initialMode = livingTimeline ? 'timeline' : (allQuestions.length > 0 ? 'quiz' : 'vocab');

  // Load saved exit ticket text
  let savedExitText = '';
  try {
    savedExitText = localStorage.getItem('exit_ticket_' + lesson.id) || '';
  } catch (e) {}

  // Load timeline completion status
  let timelineDone = false;
  try {
    timelineDone = localStorage.getItem('timeline_done_' + lesson.id) === 'true';
  } catch (e) {}

  // Load saved pathway choice ('sketch' | 'map')
  let timelinePathway = 'sketch';
  try {
    timelinePathway = localStorage.getItem('timeline_pathway_' + lesson.id) || 'sketch';
  } catch (e) {}

  // Load saved class size for Classroom Arena
  let savedClassSize = 30;
  try {
    const s = localStorage.getItem('history_arena_class_size');
    if (s) {
      const parsed = parseInt(s, 10);
      if (!isNaN(parsed) && parsed > 0) savedClassSize = parsed;
    }
  } catch (e) {}

  const state = {
    lessonId: lesson.id,
    mode: initialMode, // 'timeline' | 'quiz' | 'vocab' | 'domino' | 'exit' | 'arena'
    totalLessons: lessonsList.length || 5,
    allQuestions,
    allVocab,
    // Timeline state
    livingTimeline,
    timelineDone,
    timelinePathway,
    // Quiz state
    questions: allQuestions,
    currentIndex: 0,
    score: 0,
    answered: false,
    selectedOption: null,
    // Vocab state
    vocabIndex: 0,
    vocabFlipped: false,
    // Domino state
    domino: {
      correctOrder: milestones,
      currentOrder: shuffledMilestones,
      isSubmitted: false,
      isCorrect: false
    },
    // Exit ticket state
    exitTicket,
    exitResponse: savedExitText,
    exitSubmitted: Boolean(savedExitText && savedExitText.trim().length > 0),
    showExitModel: false,
    // Classroom Arena state
    arena: {
      gameMode: 'taboo', // 'taboo' | 'corners' | 'standoff' | 'lightning'
      isWhiteboardMode: false,
      soundEnabled: true,
      // Taboo state
      tabooDeckType: 'cumulative', // 'cumulative' | 'today'
      tabooIndex: 0,
      tabooRevealedDef: false,
      tabooScore: 0,
      tabooTimerSeconds: 60,
      tabooTimerRunning: false,
      tabooTimerInterval: null,
      // Four Corners state
      cornersSelectedCorner: null,
      cornersTimerSeconds: 60,
      cornersTimerRunning: false,
      cornersTimerInterval: null,
      // 60s Standoff state
      standoffTimerSeconds: 60,
      standoffTimerRunning: false,
      standoffTimerInterval: null,
      standoffPhase: 'roleA', // 'roleA' or 'roleB'
      standoffPairIndex: 0,
      // Lightning Chain state
      lightningTimerSeconds: 90,
      lightningTimerRunning: false,
      lightningTimerInterval: null,
      seatedCount: 0,
      targetStudents: savedClassSize,
      showLifeline: false
    },
    arenaData: extractClassroomArenaData(lesson, currentIdx, lessonsList, unitId)
  };

  window.consolidateStations[lesson.id] = state;
  renderStationContent(lesson.id);
}

function renderStationContent(lessonId) {
  const state = window.consolidateStations[lessonId];
  const bodyEl = document.getElementById(`station-body-${lessonId}`);
  if (!state || !bodyEl) return;

  if (state.mode === 'timeline') {
    renderLivingTimelineView(state, bodyEl);
  } else if (state.mode === 'vocab') {
    renderVocabCardView(state, bodyEl);
  } else if (state.mode === 'domino') {
    renderChronologyDominoView(state, bodyEl);
  } else if (state.mode === 'exit') {
    renderExitTicketView(state, bodyEl);
  } else if (state.mode === 'arena') {
    renderClassroomArenaView(state, bodyEl);
  } else {
    // Mode 'quiz'
    if (state.currentIndex >= state.questions.length) {
      renderQuizResultsView(state, bodyEl);
    } else {
      renderQuestionView(state, bodyEl);
    }
  }
}

// -------------------------------------------------------------
// TAB 1: LIVING TIMELINE (DEFAULT ACTIVE TAB)
// -------------------------------------------------------------
function renderLivingTimelineView(state, bodyEl) {
  const lt = state.livingTimeline;
  if (!lt) {
    bodyEl.innerHTML = '<div style="text-align:center; padding: 30px; color:#64748b;">No centrefold living timeline milestone recorded for this lesson.</div>';
    return;
  }

  bodyEl.innerHTML = `
    <div style="max-width: 860px; margin: 0 auto;">
      <!-- Unified Hero Card: Centrefold Milestone & Context (Clean single container) -->
      <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border-radius: 14px; padding: 20px 24px; margin-bottom: 22px; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.22);">
        <!-- Top Meta Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: rgba(255,255,255,0.22); color: #ffffff; padding: 3px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-book-open"></i> ${lt.pageRef || 'Workbook Centrefold &bull; pp. 8–9'}
            </span>
          </div>
          <span style="background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); color: #ffffff; padding: 3px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 700;">
            ${lt.milestoneBadge || `Milestone ${lt.milestoneNum} of ${state.totalLessons || 5}`}
          </span>
        </div>

        <!-- Title & Date Row -->
        <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 10px; flex-wrap: wrap;">
          <span style="background: #ffffff; color: #0369a1; padding: 3px 12px; border-radius: 6px; font-weight: 800; font-size: 0.92rem; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
            ${lt.date}
          </span>
          <h3 style="margin: 0; color: #ffffff; font-family: 'Playfair Display', Georgia, serif; font-size: 1.35rem; font-weight: 700; letter-spacing: -0.01em;">
            ${lt.title}
          </h3>
        </div>

        <!-- Full Complete Narrative Context Sentence (Zero Truncation) -->
        <p style="margin: 0; color: #e0f2fe; font-size: 0.96rem; line-height: 1.6; max-width: 800px;">
          ${lt.desc}
        </p>
      </div>

      <!-- Dual-Pathway Living Timeline Choices -->
      <div style="margin-bottom: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <div style="font-size: 0.82rem; text-transform: uppercase; font-weight: 800; color: #475569; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px;">
            <span>Choose Your Centrefold Representation:</span>
          </div>
          <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">
            Select your preferred pathway below
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px;">
          <!-- Pathway A: Visual Icon Sketch -->
          <div onclick="window.selectStationTimelinePathway('${state.lessonId}', 'sketch')" style="background: ${state.timelinePathway === 'sketch' ? '#fffdf7' : '#ffffff'}; border: 2px solid ${state.timelinePathway === 'sketch' ? '#f59e0b' : '#e2e8f0'}; border-radius: 14px; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.2s ease; box-shadow: ${state.timelinePathway === 'sketch' ? '0 4px 16px rgba(245, 158, 11, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)'};">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: #92400e; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-paintbrush" style="color: #d97706;"></i> Pathway A: Dual-Coding Sketch
                </strong>
                ${state.timelinePathway === 'sketch' 
                  ? '<span style="background: #f59e0b; color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 12px;"><i class="fa-solid fa-check"></i> Selected</span>' 
                  : '<span style="background: #fef3c7; color: #92400e; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">Sketch & Date</span>'}
              </div>
              
              <p style="font-size: 0.88rem; color: #475569; line-height: 1.45; margin: 0 0 12px 0;">
                ${lt.sketchPrompt ? `${lt.sketchPrompt}:` : `Draw a 60-second historical symbol for this turning point on your centrefold timeline alongside the date <strong>${lt.date}</strong>:`}
              </p>

              <!-- Specific Visual Sketch Ideas -->
              <div style="background: #fffbeb; border: 1.5px solid #fef3c7; border-radius: 10px; padding: 12px; margin-bottom: 14px;">
                <div style="font-size: 0.74rem; text-transform: uppercase; font-weight: 800; color: #92400e; letter-spacing: 0.05em; margin-bottom: 8px;">
                  Suggested Historical Symbols:
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${lt.sketchIdeas.map((idea) => `
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.86rem; color: #78350f; font-weight: 600;">
                      <span style="color: #d97706;">&bull;</span> ${idea}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <div style="background: #fefce8; border: 1px dashed #fde047; border-radius: 8px; padding: 9px 12px; font-size: 0.8rem; color: #854d0e; line-height: 1.4;">
              💡 <strong>Dual-Coding Rule:</strong> Pair simple shapes with the bold date. No artistic perfection needed!
            </div>
          </div>

          <!-- Pathway B: 3-Branch Concept Map -->
          <div onclick="window.selectStationTimelinePathway('${state.lessonId}', 'map')" style="background: ${state.timelinePathway === 'map' ? '#f0f9ff' : '#ffffff'}; border: 2px solid ${state.timelinePathway === 'map' ? '#0284c7' : '#e2e8f0'}; border-radius: 14px; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.2s ease; box-shadow: ${state.timelinePathway === 'map' ? '0 4px 16px rgba(2, 132, 199, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)'};">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: #0369a1; font-size: 1rem; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-diagram-project" style="color: #0284c7;"></i> Pathway B: 3-Branch Concept Map
                </strong>
                ${state.timelinePathway === 'map' 
                  ? '<span style="background: #0284c7; color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 12px;"><i class="fa-solid fa-check"></i> Selected</span>' 
                  : '<span style="background: #e0f2fe; color: #0369a1; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 12px;">Concept Nodes</span>'}
              </div>

              <p style="font-size: 0.88rem; color: #475569; line-height: 1.45; margin: 0 0 12px 0;">
                Draw a central bubble <strong>&ldquo;${lt.conceptTitle || lt.title}&rdquo;</strong> and branch out into 3 concrete historical nodes:
              </p>

              <!-- 3 Structured Concept Nodes -->
              <div style="display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px;">
                ${lt.branches.map((b) => `
                  <div style="padding: 7px 11px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3.5px solid #0284c7; border-radius: 6px; font-size: 0.84rem; color: #1e293b; line-height: 1.4;">
                    <span style="font-weight: 800; color: #0369a1;">${b.label}:</span> ${b.value}
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="background: #eff6ff; border: 1px dashed #bfdbfe; border-radius: 8px; padding: 9px 12px; font-size: 0.8rem; color: #1e40af; line-height: 1.4;">
              💡 <strong>Concept Map Rule:</strong> Connect each node to your central milestone bubble with a quick causal arrow.
            </div>
          </div>
        </div>
      </div>

      <!-- Completion & Sequential Plenary Progression Bar -->
      <div style="background: ${state.timelineDone ? '#f0fdf4' : '#f8fafc'}; border: 1.5px solid ${state.timelineDone ? '#86efac' : '#cbd5e1'}; border-radius: 14px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; transition: all 0.25s ease;">
        <label style="display: inline-flex; align-items: center; gap: 12px; cursor: pointer; user-select: none;">
          <input type="checkbox" id="cb-timeline-${state.lessonId}" onchange="window.toggleStationTimelineDone('${state.lessonId}', this.checked)" ${state.timelineDone ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: #16a34a; cursor: pointer;">
          <span style="font-size: 0.94rem; font-weight: 700; color: ${state.timelineDone ? '#166534' : '#1e293b'};">
            ${state.timelineDone ? `🎉 ${lt.milestoneBadge || ('Milestone ' + lt.milestoneNum)} Recorded in Centrefold Workbook!` : `Mark ${lt.milestoneBadge || ('Milestone ' + lt.milestoneNum)} completed in your workbook centrefold`}
          </span>
        </label>

        <button type="button" onclick="window.switchConsolidateTab('${state.lessonId}', 'quiz')" style="background: #2563eb; color: #ffffff; border: none; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 0.92rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(37,99,235,0.25); transition: all 0.15s ease;">
          <span>Next: Take Lesson Quiz</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 2: LESSON QUIZ
// -------------------------------------------------------------
function renderQuestionView(state, bodyEl) {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  const total = state.questions.length;
  const currentNum = state.currentIndex + 1;
  const progressPct = Math.round((currentNum / total) * 100);
  const letters = ['A', 'B', 'C', 'D'];

  bodyEl.innerHTML = `
    <div style="max-width: 820px; margin: 0 auto;">
      <!-- Progress Bar & Question Counter -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.85rem; color: #64748b; font-weight: 600;">
        <span style="display: inline-flex; align-items: center; gap: 6px;">
          <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 0.78rem;">
            LESSON QUIZ
          </span>
          Question ${currentNum} of ${total}
        </span>
        <span style="color: #2563eb; font-weight: 700;">Score: ${state.score}</span>
      </div>

      <div style="height: 6px; width: 100%; background: #e2e8f0; border-radius: 999px; overflow: hidden; margin-bottom: 20px;">
        <div style="height: 100%; width: ${progressPct}%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 999px; transition: width 0.3s ease;"></div>
      </div>

      <!-- Question Text -->
      <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; color: #0f172a; line-height: 1.45; margin: 0 0 20px 0; font-weight: 700;">
        ${q.q}
      </h4>

      <!-- Options Grid -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        ${q.options.map((opt, idx) => {
          let btnStyle = 'background: #ffffff; border: 1.5px solid #cbd5e1; color: #1e293b;';
          let iconHtml = `<span style="width: 26px; height: 26px; border-radius: 6px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.82rem; color: #475569; flex-shrink: 0;">${letters[idx] || (idx + 1)}</span>`;

          if (state.answered) {
            const isCorrect = idx === q.answer;
            const isSelected = idx === state.selectedOption;

            if (isCorrect) {
              btnStyle = 'background: #f0fdf4; border: 2px solid #22c55e; color: #15803d; font-weight: 700;';
              iconHtml = `<span style="width: 26px; height: 26px; border-radius: 6px; background: #22c55e; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: #ffffff; flex-shrink: 0;"><i class="fa-solid fa-check"></i></span>`;
            } else if (isSelected) {
              btnStyle = 'background: #fef2f2; border: 2px solid #ef4444; color: #b91c1c; font-weight: 700;';
              iconHtml = `<span style="width: 26px; height: 26px; border-radius: 6px; background: #ef4444; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; color: #ffffff; flex-shrink: 0;"><i class="fa-solid fa-xmark"></i></span>`;
            } else {
              btnStyle = 'background: #f8fafc; border: 1px solid #e2e8f0; color: #94a3b8; opacity: 0.6;';
            }
          }

          return `
            <button type="button" class="station-opt-btn" onclick="window.answerStationQuestion('${state.lessonId}', ${idx})" ${state.answered ? 'disabled' : ''} style="${btnStyle} text-align: left; padding: 12px 16px; border-radius: 10px; cursor: ${state.answered ? 'default' : 'pointer'}; display: flex; align-items: center; gap: 14px; font-size: 0.95rem; line-height: 1.4; transition: all 0.15s ease;">
              ${iconHtml}
              <span style="flex-grow: 1;">${opt}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Feedback / Explanation Box (revealed upon answering) -->
      ${state.answered ? `
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 4.5px solid ${state.selectedOption === q.answer ? '#22c55e' : '#f59e0b'}; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; animation: fadeIn 0.2s ease;">
          <div style="font-weight: 800; font-size: 0.88rem; color: ${state.selectedOption === q.answer ? '#15803d' : '#b45309'}; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            ${state.selectedOption === q.answer ? '<i class="fa-solid fa-circle-check"></i> Correct!' : '<i class="fa-solid fa-triangle-exclamation"></i> Historian Key Knowledge:'}
          </div>
          <p style="margin: 0; color: #334155; font-size: 0.9rem; line-height: 1.5;">
            ${q.explanation || 'Key factual recall consolidated.'}
          </p>
        </div>

        <div style="display: flex; justify-content: flex-end;">
          <button type="button" onclick="window.nextStationQuestion('${state.lessonId}')" style="background: #2563eb; color: #ffffff; border: none; padding: 10px 22px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(37,99,235,0.22); transition: all 0.2s ease;">
            <span>${currentNum === total ? 'Complete &amp; View Result' : 'Next Question'}</span>
            <i class="fa-solid ${currentNum === total ? 'fa-award' : 'fa-arrow-right'}"></i>
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function renderQuizResultsView(state, bodyEl) {
  const total = state.questions.length;
  const score = state.score;
  const pct = Math.round((score / total) * 100);

  // Save to localStorage
  try {
    const record = { score, total, pct, date: Date.now() };
    localStorage.setItem('history_quiz_' + state.lessonId, JSON.stringify(record));
  } catch (e) {}

  let trophy = '🏆';
  let badgeText = 'Outstanding Recall &bull; Mastery Achieved';
  let badgeColor = '#15803d';
  let badgeBg = '#f0fdf4';
  let badgeBorder = '#86efac';

  if (pct < 60) {
    trophy = '💡';
    badgeText = 'Good Effort &bull; Review Key Points &amp; Retry';
    badgeColor = '#b45309';
    badgeBg = '#fffbeb';
    badgeBorder = '#fde68a';
  } else if (pct < 80) {
    trophy = '⭐';
    badgeText = 'Solid Knowledge &bull; Ready for Disciplinary Tasks';
    badgeColor = '#1e40af';
    badgeBg = '#eff6ff';
    badgeBorder = '#bfdbfe';
  }

  bodyEl.innerHTML = `
    <div style="max-width: 600px; margin: 10px auto 20px auto; text-align: center; animation: fadeIn 0.3s ease;">
      <div style="font-size: 3rem; margin-bottom: 8px;">${trophy}</div>
      <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; color: #0f172a; margin: 0 0 6px 0;">
        Lesson Quiz Complete!
      </h3>
      <div style="display: inline-block; background: ${badgeBg}; color: ${badgeColor}; border: 1.5px solid ${badgeBorder}; padding: 6px 16px; border-radius: 20px; font-weight: 800; font-size: 0.85rem; margin-bottom: 20px;">
        ${badgeText}
      </div>

      <!-- Score Box -->
      <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px; display: flex; justify-content: space-around; align-items: center;">
        <div>
          <div style="font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.05em;">Your Score</div>
          <div style="font-size: 2.2rem; font-weight: 900; color: #0f172a;">${score}<span style="font-size: 1.2rem; color: #94a3b8; font-weight: 600;">/${total}</span></div>
        </div>
        <div style="height: 45px; width: 1.5px; background: #cbd5e1;"></div>
        <div>
          <div style="font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.05em;">Accuracy</div>
          <div style="font-size: 2.2rem; font-weight: 900; color: ${pct >= 70 ? '#16a34a' : '#d97706'};">${pct}%</div>
        </div>
      </div>

      <!-- Action Buttons (Left-to-Right Plenary Progression) -->
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button type="button" onclick="window.restartStationQuiz('${state.lessonId}')" style="background: #2563eb; color: #ffffff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; box-shadow: 0 4px 10px rgba(37,99,235,0.2);">
          <i class="fa-solid fa-rotate-right"></i> Try Again
        </button>
        ${state.allVocab.length > 0 ? `
          <button type="button" onclick="window.switchConsolidateTab('${state.lessonId}', 'vocab')" style="background: #10b981; color: #ffffff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
            <i class="fa-solid fa-layer-group"></i> Flip Vocab Cards
          </button>
        ` : ''}
        ${state.domino.correctOrder.length > 0 ? `
          <button type="button" onclick="window.switchConsolidateTab('${state.lessonId}', 'domino')" style="background: #8b5cf6; color: #ffffff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
            <i class="fa-solid fa-timeline"></i> Chrono Domino
          </button>
        ` : ''}
        ${state.exitTicket ? `
          <button type="button" onclick="window.switchConsolidateTab('${state.lessonId}', 'exit')" style="background: #f59e0b; color: #000000; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
            <i class="fa-solid fa-ticket"></i> Exit Ticket
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 3: VOCAB CARDS
// -------------------------------------------------------------
function renderVocabCardView(state, bodyEl) {
  const vocabList = state.allVocab;
  if (!vocabList || vocabList.length === 0) {
    bodyEl.innerHTML = '<div style="text-align:center; padding: 30px; color:#64748b;">No vocabulary items recorded for this lesson.</div>';
    return;
  }

  const v = vocabList[state.vocabIndex];
  const total = vocabList.length;
  const currentNum = state.vocabIndex + 1;

  bodyEl.innerHTML = `
    <div style="max-width: 680px; margin: 0 auto; text-align: center;">
      <!-- Flashcard Header Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-size: 0.85rem; color: #64748b; font-weight: 600;">
        <span style="background: #ecfdf5; color: #047857; padding: 2px 10px; border-radius: 20px; font-weight: 800; font-size: 0.78rem;">
          VOCABULARY FLASHCARD &bull; TIER ${v.tier || '2'}
        </span>
        <span>Card ${currentNum} of ${total}</span>
      </div>

      <!-- Interactive 3D Card Plate -->
      <div onclick="window.flipStationVocabCard('${state.lessonId}')" role="button" tabindex="0" title="Click to flip card" style="cursor: pointer; min-height: 180px; background: ${state.vocabFlipped ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'}; border: 2px solid ${state.vocabFlipped ? '#86efac' : '#cbd5e1'}; border-radius: 14px; padding: 24px 28px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 4px 14px rgba(0,0,0,0.05); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); user-select: none; margin-bottom: 18px;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
        ${!state.vocabFlipped ? `
          <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 8px;">
            KEY HISTORICAL TERM
          </div>
          <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; color: #0f172a; margin: 0 0 10px 0; font-weight: 700;">
            ${v.term}
          </h4>
          ${v.syllables ? `
            <div style="display: inline-block; background: #e2e8f0; color: #475569; padding: 2px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 600; font-family: monospace; margin-bottom: 12px;">
              ${v.syllables}
            </div>
          ` : ''}
          <div style="font-size: 0.82rem; color: #3b82f6; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-arrows-rotate"></i> Click card to reveal definition
          </div>
        ` : `
          <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: #047857; font-weight: 800; margin-bottom: 8px;">
            <i class="fa-solid fa-book-bookmark"></i> DEFINITION &bull; ${v.term}
          </div>
          <p style="font-size: 1.05rem; color: #064e3b; line-height: 1.6; margin: 0 0 12px 0; font-family: 'Inter', sans-serif;">
            ${v.definition}
          </p>
          <div style="font-size: 0.82rem; color: #059669; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-arrows-rotate"></i> Click card to flip back
          </div>
        `}
      </div>

      <!-- Navigation & Shuffle Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
        <button type="button" onclick="window.nextStationVocabCard('${state.lessonId}', -1)" ${state.vocabIndex === 0 ? 'disabled' : ''} style="background: #f8fafc; border: 1.5px solid #cbd5e1; color: #1e293b; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.88rem; cursor: ${state.vocabIndex === 0 ? 'not-allowed' : 'pointer'}; opacity: ${state.vocabIndex === 0 ? '0.4' : '1'}; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-arrow-left"></i> Previous
        </button>

        <button type="button" onclick="window.flipStationVocabCard('${state.lessonId}')" style="background: #ffffff; border: 1.5px solid #3b82f6; color: #2563eb; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-arrows-rotate"></i> Flip Card
        </button>

        <div style="display: flex; gap: 8px;">
          <button type="button" onclick="window.shuffleStationVocab('${state.lessonId}')" title="Shuffle flashcards" style="background: #f8fafc; border: 1.5px solid #cbd5e1; color: #475569; padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 0.88rem; cursor: pointer;">
            <i class="fa-solid fa-shuffle"></i>
          </button>
          <button type="button" onclick="window.nextStationVocabCard('${state.lessonId}', 1)" ${state.vocabIndex === total - 1 ? 'disabled' : ''} style="background: #2563eb; border: none; color: #ffffff; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: ${state.vocabIndex === total - 1 ? 'not-allowed' : 'pointer'}; opacity: ${state.vocabIndex === total - 1 ? '0.4' : '1'}; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(37,99,235,0.2);">
            Next <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 4: CHRONOLOGY DOMINO (SEQUENCE CHALLENGE)
// -------------------------------------------------------------
function renderChronologyDominoView(state, bodyEl) {
  const domino = state.domino;
  const items = domino.currentOrder;
  const total = items.length;

  if (total === 0) {
    bodyEl.innerHTML = '<div style="text-align:center; padding: 30px; color:#64748b;">No chronology turning points recorded for this lesson.</div>';
    return;
  }

  // Count correct positions
  let correctCount = 0;
  items.forEach((item, idx) => {
    if (item.originalIndex === idx) correctCount++;
  });
  const allCorrect = correctCount === total;

  bodyEl.innerHTML = `
    <div style="max-width: 820px; margin: 0 auto;">
      <!-- Challenge Header & Guidance -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="background: #ede9fe; color: #6d28d9; padding: 2px 10px; border-radius: 20px; font-weight: 800; font-size: 0.78rem;">
            CHRONOLOGICAL CAUSAL SEQUENCE
          </span>
          <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; color: #0f172a; margin: 4px 0 0 0; font-weight: 700;">
            Chrono Domino: Arrange the ${total} Causal Turning Points
          </h4>
        </div>
        <div style="font-size: 0.82rem; color: #64748b; font-weight: 600;">
          Use the <strong>Up / Down</strong> buttons to put the events in true chronological order.
        </div>
      </div>

      <!-- Feedback Banner if checked -->
      ${domino.isSubmitted ? `
        <div style="background: ${allCorrect ? '#f0fdf4' : '#fffbeb'}; border: 2px solid ${allCorrect ? '#22c55e' : '#f59e0b'}; color: ${allCorrect ? '#15803d' : '#b45309'}; border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: center; gap: 12px; animation: fadeIn 0.25s ease;">
          <i class="fa-solid ${allCorrect ? 'fa-award' : 'fa-arrows-rotate'}" style="font-size: 1.6rem; color: ${allCorrect ? '#16a34a' : '#d97706'};"></i>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem;">
              ${allCorrect ? '🎉 Perfect Historical Sequence! All events in exact order.' : `${correctCount} of ${total} turning points in correct position.`}
            </div>
            <div style="font-size: 0.85rem; margin-top: 2px; font-weight: 500;">
              ${allCorrect ? 'You have mastered the causal timeline and chronological progression for this enquiry.' : 'Look at the highlighted cards below. Swap the remaining points to complete the chain!'}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Interactive Milestone Cards Stack -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px;">
        ${items.map((item, idx) => {
          const isPosCorrect = domino.isSubmitted && item.originalIndex === idx;
          const isPosWrong = domino.isSubmitted && item.originalIndex !== idx;

          let cardBorder = '#cbd5e1';
          let cardBg = '#ffffff';
          let statusBadge = '';

          if (isPosCorrect) {
            cardBorder = '#22c55e';
            cardBg = '#f0fdf4';
            statusBadge = `<span style="background: #22c55e; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800;"><i class="fa-solid fa-check"></i> Correct</span>`;
          } else if (isPosWrong) {
            cardBorder = '#f59e0b';
            cardBg = '#fffdf7';
            statusBadge = `<span style="background: #f59e0b; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800;"><i class="fa-solid fa-arrows-rotate"></i> Swap</span>`;
          }

          return `
            <div style="background: ${cardBg}; border: 1.5px solid ${cardBorder}; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); transition: all 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: ${isPosCorrect ? '#22c55e' : '#ede9fe'}; color: ${isPosCorrect ? '#ffffff' : '#6d28d9'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; flex-shrink: 0;">
                  ${idx + 1}
                </div>
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <strong style="color: #0f172a; font-size: 0.98rem;">${item.title}</strong>
                    ${domino.isSubmitted || allCorrect ? `<span style="background: #e2e8f0; color: #334155; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">${item.date}</span>` : ''}
                    ${statusBadge}
                  </div>
                  ${item.detail ? `
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.86rem; line-height: 1.4;">
                      ${item.detail}
                    </p>
                  ` : ''}
                </div>
              </div>

              <!-- Reordering Arrows -->
              <div style="display: flex; flex-direction: column; gap: 4px; flex-shrink: 0;">
                <button type="button" onclick="window.moveStationDominoCard('${state.lessonId}', ${idx}, ${idx - 1})" ${idx === 0 ? 'disabled' : ''} style="width: 28px; height: 26px; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; color: #1e293b; cursor: ${idx === 0 ? 'not-allowed' : 'pointer'}; opacity: ${idx === 0 ? '0.25' : '1'}; display: flex; align-items: center; justify-content: center; font-size: 0.78rem;" title="Move earlier in chronology">
                  <i class="fa-solid fa-arrow-up"></i>
                </button>
                <button type="button" onclick="window.moveStationDominoCard('${state.lessonId}', ${idx}, ${idx + 1})" ${idx === total - 1 ? 'disabled' : ''} style="width: 28px; height: 26px; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; color: #1e293b; cursor: ${idx === total - 1 ? 'not-allowed' : 'pointer'}; opacity: ${idx === total - 1 ? '0.25' : '1'}; display: flex; align-items: center; justify-content: center; font-size: 0.78rem;" title="Move later in chronology">
                  <i class="fa-solid fa-arrow-down"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Domino Control Buttons -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
        <button type="button" onclick="window.shuffleStationDomino('${state.lessonId}')" style="background: #f8fafc; border: 1.5px solid #cbd5e1; color: #1e293b; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-shuffle"></i> Reshuffle
        </button>

        <div style="display: flex; gap: 8px;">
          <button type="button" onclick="window.revealStationDomino('${state.lessonId}')" style="background: #ffffff; border: 1.5px solid #8b5cf6; color: #6d28d9; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-eye"></i> Show Correct Sequence
          </button>
          <button type="button" onclick="window.checkStationDomino('${state.lessonId}')" style="background: #8b5cf6; border: none; color: #ffffff; padding: 8px 20px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(139,92,246,0.3);">
            <i class="fa-solid fa-check"></i> Check Sequence
          </button>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 5: EXIT TICKET (ROTATING DISCIPLINARY VERDICT)
// -------------------------------------------------------------
function renderExitTicketView(state, bodyEl) {
  const et = state.exitTicket;
  if (!et) {
    bodyEl.innerHTML = '<div style="text-align:center; padding: 30px; color:#64748b;">No exit ticket assigned for this lesson.</div>';
    return;
  }

  const counts = countWordsAndSentences(state.exitResponse);

  bodyEl.innerHTML = `
    <div style="max-width: 820px; margin: 0 auto;">
      <!-- Exit Ticket Masthead -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="width: 34px; height: 34px; border-radius: 8px; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.05rem;">
            <i class="fa-solid fa-ticket"></i>
          </span>
          <h4 style="margin: 0; color: #0f172a; font-size: 1.25rem; font-family: 'Playfair Display', Georgia, serif; font-weight: 700;">
            ${et.title}
          </h4>
        </div>
        <span style="background: #fef3c7; color: #92400e; font-size: 0.78rem; font-weight: 800; padding: 3px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
          ${et.type_label}
        </span>
      </div>

      <!-- Prompt Description -->
      <div style="font-size: 1.05rem; color: #1e293b; line-height: 1.6; margin-bottom: 16px;">
        ${formatMarkdown(et.prompt)}
      </div>

      <!-- Success Criteria / Ingredients Box -->
      ${et.options && et.options.length > 0 ? `
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 18px;">
          <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.05em; margin-bottom: 8px;">
            Success Criteria &amp; Required Ingredients:
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${et.options.map((opt) => `
              <div style="padding: 8px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-left: 3.5px solid #f59e0b; border-radius: 6px; font-size: 0.9rem; color: #334155; line-height: 1.4;">
                ${formatMarkdown(opt)}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${et.guidance ? `
        <p style="font-size: 0.88rem; color: #64748b; font-style: italic; margin-bottom: 14px;">
          <strong>Teacher Guidance:</strong> ${formatMarkdown(et.guidance)}
        </p>
      ` : ''}

      <!-- Interactive Student Response Box -->
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <label for="exit-ticket-input-${state.lessonId}" style="font-size: 0.82rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.04em;">
            Your Written Response:
          </label>
          <span id="exit-counter-${state.lessonId}" style="font-size: 0.78rem; font-weight: 600; color: #64748b;">
            ${counts.sentences} sentence${counts.sentences === 1 ? '' : 's'} &bull; ${counts.words} words
          </span>
        </div>
        <textarea id="exit-ticket-input-${state.lessonId}" oninput="window.handleExitTicketInput('${state.lessonId}', this.value)" placeholder="Type your 1–2 sentence historical verdict here before packing up..." style="width: 100%; min-height: 105px; padding: 12px 14px; border: 1.5px solid ${state.exitSubmitted ? '#86efac' : '#cbd5e1'}; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 0.95rem; line-height: 1.55; box-sizing: border-box; background: ${state.exitSubmitted ? '#f0fdf4' : '#ffffff'}; color: #0f172a; resize: vertical;">${state.exitResponse || ''}</textarea>
      </div>

      <!-- Action Bar with Compare with Model Verdict Toggle -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <button type="button" onclick="window.submitStationExitTicket('${state.lessonId}')" style="background: #f59e0b; border: none; color: #000000; font-weight: 800; font-size: 0.92rem; padding: 10px 22px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(245,158,11,0.3);">
            <i class="fa-solid fa-paper-plane"></i> Save &amp; Submit Ticket
          </button>
          ${state.exitSubmitted ? `
            <button type="button" onclick="window.toggleStationExitModel('${state.lessonId}')" style="background: #ffffff; border: 1.5px solid #059669; color: #047857; font-weight: 700; font-size: 0.88rem; padding: 9px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
              <i class="fa-solid fa-award"></i> ${state.showExitModel ? 'Hide Model Verdict' : 'Compare with Model Verdict'}
            </button>
          ` : ''}
        </div>

        ${state.exitSubmitted ? `
          <div style="color: #15803d; font-weight: 700; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-circle-check"></i> Ticket Saved Locally
          </div>
        ` : ''}
      </div>

      <!-- Model Verdict Showcase (Unlocked upon submission or toggle) -->
      ${state.showExitModel && et.model ? `
        <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 16px 20px; animation: fadeIn 0.25s ease;">
          <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 800; color: #166534; letter-spacing: 0.05em; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-graduation-cap"></i> Historian's Model Verdict &amp; Criteria:
          </div>
          <p style="margin: 0; color: #14532d; font-size: 0.95rem; line-height: 1.6; font-family: 'Inter', sans-serif;">
            ${formatMarkdown(et.model)}
          </p>
        </div>
      ` : ''}
    </div>
  `;
}

// -------------------------------------------------------------
// TAB 6: CLASSROOM ARENA (WHOLE-CLASS ACTIVE PLENARIES)
// -------------------------------------------------------------
function renderClassroomArenaView(state, bodyEl) {
  const arenaData = state.arenaData;
  if (!arenaData) {
    bodyEl.innerHTML = '<div style="text-align:center; padding: 30px; color:#64748b;">Classroom Arena content unavailable for this lesson.</div>';
    return;
  }

  const a = state.arena;
  const isWhiteboard = a.isWhiteboardMode;

  // Manage ESC key listener for Projector Mode
  if (isWhiteboard) {
    if (window._arenaEscKeyHandler) {
      window.removeEventListener('keydown', window._arenaEscKeyHandler);
    }
    window._arenaEscKeyHandler = function (e) {
      if (e.key === 'Escape') {
        window.toggleArenaWhiteboard(state.lessonId);
      }
    };
    window.addEventListener('keydown', window._arenaEscKeyHandler);
  } else if (window._arenaEscKeyHandler) {
    window.removeEventListener('keydown', window._arenaEscKeyHandler);
    window._arenaEscKeyHandler = null;
  }

  const overlayStyle = isWhiteboard
    ? 'position: fixed; inset: 0; z-index: 999999; background: #0b1120; color: #f8fafc; overflow-y: auto; padding: 24px 36px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;'
    : 'max-width: 900px; margin: 0 auto;';

  // Sub-navigation bar inside Classroom Arena
  const navHtml = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; border-bottom: 1.5px solid ${isWhiteboard ? '#1e293b' : '#e2e8f0'}; padding-bottom: 14px;">
      <!-- 4 Game Switcher Buttons -->
      <div style="display: flex; gap: 6px; background: ${isWhiteboard ? '#1e293b' : '#f1f5f9'}; padding: 4px; border-radius: 10px; flex-wrap: wrap;">
        <button type="button" onclick="window.switchArenaGame('${state.lessonId}', 'taboo')" style="padding: 7px 14px; border-radius: 7px; border: none; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; ${a.gameMode === 'taboo' ? (isWhiteboard ? 'background: #3b82f6; color: #ffffff;' : 'background: #ffffff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1);') : (isWhiteboard ? 'background: transparent; color: #94a3b8;' : 'background: transparent; color: #64748b;')}">
          <span>🔥</span> Hot Seat (Taboo)
        </button>
        <button type="button" onclick="window.switchArenaGame('${state.lessonId}', 'corners')" style="padding: 7px 14px; border-radius: 7px; border: none; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; ${a.gameMode === 'corners' ? (isWhiteboard ? 'background: #3b82f6; color: #ffffff;' : 'background: #ffffff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1);') : (isWhiteboard ? 'background: transparent; color: #94a3b8;' : 'background: transparent; color: #64748b;')}">
          <span>🏃</span> Four Corners
        </button>
        <button type="button" onclick="window.switchArenaGame('${state.lessonId}', 'standoff')" style="padding: 7px 14px; border-radius: 7px; border: none; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; ${a.gameMode === 'standoff' ? (isWhiteboard ? 'background: #3b82f6; color: #ffffff;' : 'background: #ffffff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1);') : (isWhiteboard ? 'background: transparent; color: #94a3b8;' : 'background: transparent; color: #64748b;')}">
          <span>⚔️</span> 60s Standoff
        </button>
        <button type="button" onclick="window.switchArenaGame('${state.lessonId}', 'lightning')" style="padding: 7px 14px; border-radius: 7px; border: none; font-size: 0.85rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; ${a.gameMode === 'lightning' ? (isWhiteboard ? 'background: #3b82f6; color: #ffffff;' : 'background: #ffffff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1);') : (isWhiteboard ? 'background: transparent; color: #94a3b8;' : 'background: transparent; color: #64748b;')}">
          <span>⚡</span> Lightning Chain
        </button>
      </div>

      <!-- Right Utility Actions: Sound & Projector Mode -->
      <div style="display: flex; align-items: center; gap: 8px;">
        <button type="button" onclick="window.toggleArenaSound('${state.lessonId}')" title="Toggle Synthesizer Sound" style="padding: 6px 12px; border-radius: 7px; border: 1px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; background: ${isWhiteboard ? '#1e293b' : '#ffffff'}; color: ${isWhiteboard ? '#e2e8f0' : '#475569'}; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid ${a.soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}" style="color: ${a.soundEnabled ? '#10b981' : '#94a3b8'};"></i>
          <span>${a.soundEnabled ? 'Sound ON' : 'Muted'}</span>
        </button>
        <button type="button" onclick="window.toggleArenaWhiteboard('${state.lessonId}')" title="${isWhiteboard ? 'Exit Projector Mode (ESC)' : 'Full-Screen Whiteboard Display'}" style="padding: 6px 14px; border-radius: 7px; border: 1px solid ${isWhiteboard ? '#38bdf8' : '#3b82f6'}; background: ${isWhiteboard ? '#0369a1' : '#eff6ff'}; color: ${isWhiteboard ? '#ffffff' : '#1d4ed8'}; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid ${isWhiteboard ? 'fa-compress' : 'fa-expand'}"></i>
          <span>${isWhiteboard ? 'Exit Projector (ESC)' : 'Projector Mode'}</span>
        </button>
      </div>
    </div>
  `;

  let gameHtml = '';
  if (a.gameMode === 'corners') {
    gameHtml = renderArenaCornersView(state, arenaData, isWhiteboard);
  } else if (a.gameMode === 'standoff') {
    gameHtml = renderArenaStandoffView(state, arenaData, isWhiteboard);
  } else if (a.gameMode === 'lightning') {
    gameHtml = renderArenaLightningView(state, arenaData, isWhiteboard);
  } else {
    gameHtml = renderArenaTabooView(state, arenaData, isWhiteboard);
  }

  let portal = document.getElementById('arena-projector-portal');
  if (isWhiteboard) {
    if (!portal) {
      portal = document.createElement('div');
      portal.id = 'arena-projector-portal';
      document.body.appendChild(portal);
    }
    portal.innerHTML = `
      <div class="classroom-arena-container arena-theatre" style="position: fixed; inset: 0; z-index: 9999999; background: #0b1120; color: #f8fafc; overflow-y: auto; padding: 30px 48px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-start;">
        ${navHtml}
        ${gameHtml}
      </div>
    `;
    bodyEl.innerHTML = `
      <div style="background: #0f172a; border: 2px solid #3b82f6; border-radius: 12px; padding: 24px; text-align: center; color: #f8fafc;">
        <i class="fa-solid fa-expand" style="font-size: 2rem; color: #38bdf8; margin-bottom: 10px;"></i>
        <h4 style="margin: 0 0 6px 0; font-family: 'Playfair Display', serif; font-size: 1.25rem;">Projector Mode Active on Whiteboard</h4>
        <p style="margin: 0 0 14px 0; color: #94a3b8; font-size: 0.88rem;">The Classroom Arena is currently displayed in full-screen theatre mode for front-of-class projection.</p>
        <button type="button" onclick="window.toggleArenaWhiteboard('${state.lessonId}')" style="background: #2563eb; color: #ffffff; border: none; font-weight: 700; font-size: 0.88rem; padding: 8px 18px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-compress"></i> Exit Projector Mode (ESC)
        </button>
      </div>
    `;
  } else {
    if (portal) {
      portal.remove();
    }
    bodyEl.innerHTML = `
      <div class="classroom-arena-container" style="${overlayStyle}">
        ${navHtml}
        ${gameHtml}
      </div>
    `;
  }
}

function renderArenaTabooView(state, arenaData, isWhiteboard) {
  const a = state.arena;
  const isTodayDeck = a.tabooDeckType === 'today';
  const deck = (isTodayDeck && arenaData.todayDeck.length > 0)
    ? arenaData.todayDeck
    : arenaData.cumulativeDeck;

  const card = deck.length > 0 ? deck[a.tabooIndex % deck.length] : null;
  const timeSec = a.tabooTimerSeconds;
  const mins = Math.floor(timeSec / 60);
  const secs = timeSec % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (!card) {
    return `<div style="text-align: center; padding: 40px; color: ${isWhiteboard ? '#94a3b8' : '#64748b'};">No vocabulary terms available for Taboo.</div>`;
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Deck Toggle & Round Score Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; gap: 6px;">
          <button type="button" onclick="window.switchArenaTabooDeck('${state.lessonId}', 'cumulative')" style="padding: 5px 12px; border-radius: 6px; border: 1.5px solid ${!isTodayDeck ? '#3b82f6' : (isWhiteboard ? '#334155' : '#cbd5e1')}; background: ${!isTodayDeck ? (isWhiteboard ? '#1e3a8a' : '#eff6ff') : 'transparent'}; color: ${!isTodayDeck ? (isWhiteboard ? '#93c5fd' : '#1d4ed8') : (isWhiteboard ? '#94a3b8' : '#64748b')}; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
            <span>⭐</span> All Cumulative Unit Terms (${arenaData.cumulativeDeck.length})
          </button>
          <button type="button" onclick="window.switchArenaTabooDeck('${state.lessonId}', 'today')" style="padding: 5px 12px; border-radius: 6px; border: 1.5px solid ${isTodayDeck ? '#3b82f6' : (isWhiteboard ? '#334155' : '#cbd5e1')}; background: ${isTodayDeck ? (isWhiteboard ? '#1e3a8a' : '#eff6ff') : 'transparent'}; color: ${isTodayDeck ? (isWhiteboard ? '#93c5fd' : '#1d4ed8') : (isWhiteboard ? '#94a3b8' : '#64748b')}; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
            <span>📌</span> Today's Lesson Only (${arenaData.todayDeck.length})
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: ${isWhiteboard ? '#1e293b' : '#fef3c7'}; color: ${isWhiteboard ? '#f59e0b' : '#b45309'}; border: 1px solid ${isWhiteboard ? '#f59e0b' : '#fde68a'}; padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: 0.85rem;">
            🔥 Round Score: ${a.tabooScore || 0} Correct
          </span>

          <!-- 60s Countdown Timer Controls -->
          <div style="display: flex; align-items: center; gap: 6px; background: ${isWhiteboard ? '#1e293b' : '#f8fafc'}; border: 1.5px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; padding: 3px 8px; border-radius: 8px;">
            <i class="fa-solid fa-stopwatch" style="color: #3b82f6; font-size: 0.9rem;"></i>
            <span id="arena-timer-val-taboo-${state.lessonId}" style="font-family: monospace; font-size: 1.15rem; font-weight: 800; color: ${isWhiteboard ? '#f8fafc' : '#0f172a'}; min-width: 52px; text-align: center;">
              ${timeStr}
            </span>
            <button type="button" id="arena-timer-start-taboo-${state.lessonId}" onclick="window.${a.tabooTimerRunning ? 'pauseArenaTimer' : 'startArenaTimer'}('${state.lessonId}', 'taboo', 60)" style="background: ${a.tabooTimerRunning ? '#f59e0b' : '#10b981'}; color: #ffffff; border: none; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer;">
              <i class="fa-solid ${a.tabooTimerRunning ? 'fa-pause' : 'fa-play'}"></i> ${a.tabooTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button type="button" onclick="window.resetArenaTimer('${state.lessonId}', 'taboo', 60)" title="Reset to 60s" style="background: transparent; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; border: none; padding: 4px 6px; cursor: pointer; font-size: 0.8rem;">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Secret Taboo Card -->
      <div style="background: ${isWhiteboard ? '#1e293b' : '#ffffff'}; border: 2.5px solid ${isWhiteboard ? '#334155' : '#e2e8f0'}; border-radius: 16px; padding: 28px 24px; text-align: center; box-shadow: 0 6px 20px rgba(0,0,0,${isWhiteboard ? '0.3' : '0.06'});">
        <!-- Origin Badge -->
        <div style="display: flex; justify-content: center; margin-bottom: 12px;">
          <span style="background: ${card.isToday ? (isWhiteboard ? '#065f46' : '#dcfce7') : (isWhiteboard ? '#1e3a8a' : '#dbeafe')}; color: ${card.isToday ? (isWhiteboard ? '#a7f3d0' : '#15803d') : (isWhiteboard ? '#bfdbfe' : '#1e40af')}; padding: 3px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.03em; text-transform: uppercase;">
            ${card.origin}
          </span>
        </div>

        <!-- Target Word Heading -->
        <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: ${isWhiteboard ? '3.4rem' : '2.6rem'}; font-weight: 800; color: ${isWhiteboard ? '#38bdf8' : '#1e3a8a'}; margin: 0 0 18px 0; letter-spacing: -0.01em;">
          ${card.term}
        </h2>

        <!-- Red Forbidden Words Box -->
        <div style="background: ${isWhiteboard ? '#450a0a' : '#fef2f2'}; border: 2px dashed #ef4444; border-radius: 12px; padding: 16px 20px; max-width: 650px; margin: 0 auto 20px auto;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
            <i class="fa-solid fa-ban"></i> FORBIDDEN TABOO WORDS (DO NOT SAY!):
          </div>
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            ${card.tabooWords.map(w => `
              <span style="background: ${isWhiteboard ? '#18181b' : '#ffffff'}; border: 2px solid #ef4444; color: #ef4444; font-weight: 900; font-size: ${isWhiteboard ? '1.35rem' : '1.15rem'}; padding: 6px 18px; border-radius: 8px; box-shadow: 0 2px 6px rgba(239,68,68,0.15);">
                ${w}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Definition Lifeline (Toggle for Clue-Givers) -->
        <div style="margin-bottom: 22px;">
          <button type="button" onclick="window.toggleArenaTabooDef('${state.lessonId}')" style="background: transparent; border: 1px dashed ${isWhiteboard ? '#64748b' : '#94a3b8'}; color: ${isWhiteboard ? '#cbd5e1' : '#64748b'}; padding: 4px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">
            <i class="fa-solid fa-lightbulb" style="color: #f59e0b;"></i> ${a.tabooRevealedDef ? 'Hide Definition Lifeline' : 'Show Definition Lifeline (For Clue-Givers)'}
          </button>
          ${a.tabooRevealedDef ? `
            <div style="margin-top: 10px; padding: 10px 16px; background: ${isWhiteboard ? '#0f172a' : '#f8fafc'}; border: 1px solid ${isWhiteboard ? '#334155' : '#e2e8f0'}; border-radius: 8px; font-size: 0.88rem; color: ${isWhiteboard ? '#94a3b8' : '#475569'}; max-width: 650px; margin-left: auto; margin-right: auto; line-height: 1.45;">
              <strong>Historical Definition:</strong> ${card.definition || 'Key concept essential to this period.'}
            </div>
          ` : ''}
        </div>

        <!-- Action Control Buttons -->
        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <button type="button" onclick="window.nextArenaTabooCard('${state.lessonId}', false)" style="background: ${isWhiteboard ? '#334155' : '#f1f5f9'}; border: 1.5px solid ${isWhiteboard ? '#475569' : '#cbd5e1'}; color: ${isWhiteboard ? '#e2e8f0' : '#475569'}; font-weight: 700; font-size: 0.92rem; padding: 10px 20px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-forward-step"></i> Skip Card
          </button>
          <button type="button" onclick="window.nextArenaTabooCard('${state.lessonId}', true)" style="background: #10b981; border: none; color: #ffffff; font-weight: 800; font-size: 0.95rem; padding: 10px 26px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
            <i class="fa-solid fa-check"></i> Got It! (+1 Point)
          </button>
          <button type="button" onclick="window.shuffleArenaTaboo('${state.lessonId}')" title="Reshuffle deck & reset score" style="background: transparent; border: 1px solid ${isWhiteboard ? '#475569' : '#cbd5e1'}; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; font-weight: 600; font-size: 0.82rem; padding: 10px 14px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-shuffle"></i> Reshuffle
          </button>
        </div>
      </div>

      <!-- Classroom Teacher Protocol Note -->
      <div style="background: ${isWhiteboard ? '#0f172a' : '#f8fafc'}; border: 1px solid ${isWhiteboard ? '#1e293b' : '#e2e8f0'}; border-radius: 8px; padding: 10px 14px; font-size: 0.8rem; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; line-height: 1.45;">
        <strong style="color: #f59e0b;"><i class="fa-solid fa-chalkboard-user"></i> Teacher Protocol:</strong> Seat one pupil in the "Hot Seat" with their back to the screen. Classmates raise hands to give historical clues explaining the concept WITHOUT saying any of the 3 red taboo words! Rotate pupils after each 60s round.
      </div>
    </div>
  `;
}

function renderArenaCornersView(state, arenaData, isWhiteboard) {
  const a = state.arena;
  const timeSec = a.cornersTimerSeconds;
  const mins = Math.floor(timeSec / 60);
  const secs = timeSec % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const corners = arenaData.cornerItems || [];
  const selectedIdx = a.cornersSelectedCorner;

  return `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Enquiry Banner & Group Consultation Timer -->
      <div style="background: linear-gradient(135deg, ${isWhiteboard ? '#1e293b 0%, #0f172a 100%' : '#f8fafc 0%, #f1f5f9 100%'}); border: 1.5px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div style="flex: 1; min-width: 260px;">
          <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #3b82f6; letter-spacing: 0.05em; margin-bottom: 4px;">
            TODAY'S BIG ENQUIRY QUESTION:
          </div>
          <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: ${isWhiteboard ? '1.3rem' : '1.15rem'}; font-weight: 700; color: ${isWhiteboard ? '#f8fafc' : '#0f172a'}; line-height: 1.35;">
            &ldquo;${arenaData.enquiry}&rdquo;
          </h3>
          <p style="margin: 4px 0 0 0; font-size: 0.82rem; color: ${isWhiteboard ? '#94a3b8' : '#64748b'};">
            Move to your chosen corner. Agree with your group on your 1-sentence knockdown historical defense!
          </p>
        </div>

        <!-- 60s Consultation Countdown Timer -->
        <div style="display: flex; align-items: center; gap: 8px; background: ${isWhiteboard ? '#0f172a' : '#ffffff'}; border: 1.5px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; padding: 6px 12px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
          <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <span style="font-size: 0.68rem; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.04em;">Group Debate Clock</span>
            <span id="arena-timer-val-corners-${state.lessonId}" style="font-family: monospace; font-size: 1.35rem; font-weight: 800; color: ${isWhiteboard ? '#f8fafc' : '#0f172a'};">
              ${timeStr}
            </span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            <button type="button" id="arena-timer-start-corners-${state.lessonId}" onclick="window.${a.cornersTimerRunning ? 'pauseArenaTimer' : 'startArenaTimer'}('${state.lessonId}', 'corners', 60)" style="background: ${a.cornersTimerRunning ? '#f59e0b' : '#10b981'}; color: #ffffff; border: none; padding: 4px 10px; border-radius: 5px; font-weight: 700; font-size: 0.72rem; cursor: pointer;">
              <i class="fa-solid ${a.cornersTimerRunning ? 'fa-pause' : 'fa-play'}"></i> ${a.cornersTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button type="button" onclick="window.resetArenaTimer('${state.lessonId}', 'corners', 60)" title="Reset to 60s" style="background: ${isWhiteboard ? '#1e293b' : '#f1f5f9'}; border: 1px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; cursor: pointer; text-align: center;">
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- 4 Corners 2x2 Interactive Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 14px;">
        ${corners.map((c, idx) => {
          const isSelected = selectedIdx === idx;
          return `
            <div onclick="window.selectArenaCorner('${state.lessonId}', ${idx})" style="background: ${isWhiteboard ? (isSelected ? '#1e293b' : '#0f172a') : (isSelected ? '#f8fafc' : '#ffffff')}; border: ${isSelected ? '2.5px solid #f59e0b' : `1.5px solid ${isWhiteboard ? '#334155' : c.border}`}; border-left: 5px solid ${c.color}; border-radius: 12px; padding: 16px 18px; cursor: pointer; transition: all 0.2s ease; box-shadow: ${isSelected ? '0 0 0 3px rgba(245,158,11,0.25)' : '0 2px 8px rgba(0,0,0,0.04)'}; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="background: ${isWhiteboard ? '#1e293b' : c.badgeBg}; color: ${c.color}; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em;">
                    📍 ${c.corner} &bull; ${c.location}
                  </span>
                  ${isSelected ? '<span style="background: #f59e0b; color: #000000; font-weight: 800; font-size: 0.68rem; padding: 2px 6px; border-radius: 4px;">SPOTLIGHTED</span>' : ''}
                </div>
                <div style="font-size: 0.78rem; font-weight: 800; color: ${c.color}; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 2px;">
                  ${c.label}
                </div>
                <h4 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 700; color: ${isWhiteboard ? '#f8fafc' : '#0f172a'};">
                  ${c.title}
                </h4>
                <p style="margin: 0; font-size: 0.85rem; color: ${isWhiteboard ? '#cbd5e1' : '#475569'}; line-height: 1.45;">
                  ${c.detail}
                </p>
                ${c.starter ? `
                  <div style="margin-top: 10px; background: ${isWhiteboard ? '#0f172a' : '#f8fafc'}; border-left: 3.5px solid ${c.color}; padding: 7px 10px; border-radius: 4px; font-size: 0.8rem; color: ${isWhiteboard ? '#94a3b8' : '#334155'}; font-style: italic; line-height: 1.4;">
                    ${c.starter}
                  </div>
                ` : ''}
              </div>
              <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid ${isWhiteboard ? '#1e293b' : '#f1f5f9'}; display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: #94a3b8;">
                <span>Click to spotlight corner</span>
                <i class="fa-solid fa-arrow-pointer"></i>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Spotlight Banner (If a corner is selected) -->
      ${selectedIdx !== null && corners[selectedIdx] ? `
        <div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; animation: fadeIn 0.2s ease;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #f59e0b; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
              🎤
            </div>
            <div>
              <div style="font-weight: 800; font-size: 0.88rem; color: #92400e;">
                SPOTLIGHT: ${corners[selectedIdx].corner} (${corners[selectedIdx].location}) &bull; ${corners[selectedIdx].title}
              </div>
              <div style="font-size: 0.82rem; color: #78350f;">
                Spokesperson: You have 30 seconds to defend why <strong>${corners[selectedIdx].title}</strong> was the decisive historical turning point!
              </div>
              ${corners[selectedIdx].starter ? `
                <div style="margin-top: 4px; font-size: 0.8rem; font-style: italic; color: #b45309;">
                  Defense Stance: ${corners[selectedIdx].starter}
                </div>
              ` : ''}
            </div>
          </div>
          <button type="button" onclick="window.selectArenaCorner('${state.lessonId}', ${selectedIdx})" style="background: #ffffff; border: 1px solid #d97706; color: #92400e; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer;">
            Clear Spotlight
          </button>
        </div>
      ` : ''}

      <!-- Classroom Teacher Protocol Note -->
      <div style="background: ${isWhiteboard ? '#0f172a' : '#f8fafc'}; border: 1px solid ${isWhiteboard ? '#1e293b' : '#e2e8f0'}; border-radius: 8px; padding: 10px 14px; font-size: 0.8rem; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; line-height: 1.45;">
        <strong style="color: #f59e0b;"><i class="fa-solid fa-chalkboard-user"></i> Teacher Protocol:</strong> Pupils walk to their chosen corner. In groups, they have 60s to agree on their strongest historical argument. The teacher then invites a spokesperson from each corner to present their 30s pitch and cross-examine opposing corners.
      </div>
    </div>
  `;
}

function renderArenaStandoffView(state, arenaData, isWhiteboard) {
  const a = state.arena;
  const timeSec = a.standoffTimerSeconds;
  const mins = Math.floor(timeSec / 60);
  const secs = timeSec % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const pair = arenaData.standoffPair;

  if (!pair) {
    return `<div style="text-align: center; padding: 40px; color: #64748b;">No historical roleplay pairs available.</div>`;
  }

  const isRoleA = a.standoffPhase === 'roleA';
  const isHistoriographical = pair.category === 'historiographical';

  const mastheadBadgeText = isHistoriographical
    ? 'HISTORIOGRAPHICAL SHOULDER-PARTNER DUEL &bull; 30s INTERPRETATION 1 &bull; 30s INTERPRETATION 2'
    : 'HISTORICAL SHOULDER-PARTNER DUEL &bull; 30s DEFENSE &bull; 30s REBUTTAL';

  const teacherProtocolText = isHistoriographical
    ? 'Shoulder partners analyze opposing historical arguments. Partner A presents Interpretation 1 using evidence for 30s. At the chime, Partner B presents Interpretation 2 using counter-evidence!'
    : 'Shoulder partners turn to face each other. Partner A has 30 seconds uninterrupted to argue their stance. At the chime (30s mark), Partner B immediately launches their 30-second rebuttal using opposing historical evidence!';

  const keyTermsA = pair.roleA.keyTerms && pair.roleA.keyTerms.length > 0 ? `
    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed ${isWhiteboard ? '#334155' : '#cbd5e1'}; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
      <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em;">Key Evidence:</span>
      ${pair.roleA.keyTerms.map(t => `<span style="background: ${isWhiteboard ? '#0f172a' : '#eff6ff'}; border: 1px solid #93c5fd; color: #1e40af; font-size: 0.74rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">${t}</span>`).join('')}
    </div>
  ` : '';

  const keyTermsB = pair.roleB.keyTerms && pair.roleB.keyTerms.length > 0 ? `
    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed ${isWhiteboard ? '#334155' : '#cbd5e1'}; display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
      <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em;">Key Evidence:</span>
      ${pair.roleB.keyTerms.map(t => `<span style="background: ${isWhiteboard ? '#0f172a' : '#fef2f2'}; border: 1px solid #fca5a5; color: #b91c1c; font-size: 0.74rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">${t}</span>`).join('')}
    </div>
  ` : '';

  return `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Masthead & Standoff Timer -->
      <div style="background: linear-gradient(135deg, ${isWhiteboard ? '#1e293b 0%, #0f172a 100%' : '#f8fafc 0%, #f1f5f9 100%'}); border: 1.5px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #8b5cf6; letter-spacing: 0.05em; margin-bottom: 4px;">
            ${mastheadBadgeText}
          </div>
          <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: ${isWhiteboard ? '1.25rem' : '1.15rem'}; font-weight: 700; color: ${isWhiteboard ? '#f8fafc' : '#0f172a'};">
            ${pair.roleA.name} vs. ${pair.roleB.name}
          </h3>
          ${pair.subtitle ? `<div style="font-size: 0.82rem; font-weight: 700; color: #8b5cf6; margin-top: 3px;">${pair.subtitle}</div>` : ''}
          <p style="margin: 3px 0 0 0; font-size: 0.82rem; color: ${isWhiteboard ? '#94a3b8' : '#64748b'};">
            ${isHistoriographical ? 'Face your shoulder partner. Partner A defends Interpretation 1 for 30s. At the chime, Partner B counter-argues with Interpretation 2!' : 'Face your shoulder partner. Partner A defends their actions for 30s. At the chime, Partner B rebuts with evidence!'}
          </p>
        </div>

        <!-- Standoff Dual Timer & Active Phase Badge -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <div id="standoff-phase-badge-${state.lessonId}">
            ${isRoleA
              ? `<span style="background: #2563eb; color: #ffffff; padding: 4px 14px; border-radius: 999px; font-weight: 800; font-size: 0.82rem;"><i class="fa-solid fa-shield"></i> PHASE 1: Partner A ${isHistoriographical ? 'Interpretation' : 'Defending'} (30s)</span>`
              : `<span style="background: #dc2626; color: #ffffff; padding: 4px 14px; border-radius: 999px; font-weight: 800; font-size: 0.82rem;"><i class="fa-solid fa-swords"></i> PHASE 2: Partner B ${isHistoriographical ? 'Counter-View' : 'Rebutting'} (30s)</span>`}
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: ${isWhiteboard ? '#0f172a' : '#ffffff'}; border: 1.5px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; padding: 4px 10px; border-radius: 8px;">
            <span id="arena-timer-val-standoff-${state.lessonId}" style="font-family: monospace; font-size: 1.25rem; font-weight: 800; color: ${isWhiteboard ? '#f8fafc' : '#0f172a'}; min-width: 50px; text-align: center;">
              ${timeStr}
            </span>
            <button type="button" id="arena-timer-start-standoff-${state.lessonId}" onclick="window.${a.standoffTimerRunning ? 'pauseArenaTimer' : 'startArenaTimer'}('${state.lessonId}', 'standoff', 60)" style="background: ${a.standoffTimerRunning ? '#f59e0b' : '#10b981'}; color: #ffffff; border: none; padding: 4px 10px; border-radius: 5px; font-weight: 700; font-size: 0.72rem; cursor: pointer;">
              <i class="fa-solid ${a.standoffTimerRunning ? 'fa-pause' : 'fa-play'}"></i> ${a.standoffTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button type="button" onclick="window.resetArenaTimer('${state.lessonId}', 'standoff', 60)" title="Reset duel" style="background: transparent; color: #64748b; border: none; padding: 4px; cursor: pointer;">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Side-by-Side Facing Dual Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
        <!-- Partner A Card (Blue) -->
        <div id="standoff-card-a-${state.lessonId}" style="background: ${isWhiteboard ? '#1e293b' : '#ffffff'}; border: 2.5px solid ${isRoleA ? '#2563eb' : (isWhiteboard ? '#334155' : '#cbd5e1')}; border-radius: 14px; padding: 20px; box-shadow: ${isRoleA ? '0 0 0 3px rgba(37,99,235,0.3)' : 'none'}; opacity: ${isRoleA ? '1' : '0.7'}; transition: all 0.25s ease;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
            <span style="background: #2563eb; color: #ffffff; padding: 3px 10px; border-radius: 6px; font-weight: 800; font-size: 0.78rem; text-transform: uppercase;">
              🛡️ PARTNER A: ${pair.roleA.name}
            </span>
            <span style="font-size: 0.75rem; font-weight: 700; color: #3b82f6;">First 30 Seconds</span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #64748b; margin-bottom: 6px;">
            ${pair.roleA.title}
          </div>
          <p style="margin: 0 0 14px 0; font-size: 0.92rem; color: ${isWhiteboard ? '#cbd5e1' : '#334155'}; line-height: 1.45;">
            <strong>Objective:</strong> ${pair.roleA.objective}
          </p>
          <div style="background: ${isWhiteboard ? '#0f172a' : '#f1f5f9'}; border-left: 4px solid #2563eb; padding: 10px 14px; border-radius: 6px; font-size: 0.88rem; color: ${isWhiteboard ? '#93c5fd' : '#1e40af'}; font-style: italic;">
            ${pair.roleA.starter}
          </div>
          ${keyTermsA}
        </div>

        <!-- Partner B Card (Crimson) -->
        <div id="standoff-card-b-${state.lessonId}" style="background: ${isWhiteboard ? '#1e293b' : '#ffffff'}; border: 2.5px solid ${!isRoleA ? '#dc2626' : (isWhiteboard ? '#334155' : '#cbd5e1')}; border-radius: 14px; padding: 20px; box-shadow: ${!isRoleA ? '0 0 0 3px rgba(220,38,38,0.3)' : 'none'}; opacity: ${!isRoleA ? '1' : '0.7'}; transition: all 0.25s ease;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;">
            <span style="background: #dc2626; color: #ffffff; padding: 3px 10px; border-radius: 6px; font-weight: 800; font-size: 0.78rem; text-transform: uppercase;">
              ⚔️ PARTNER B: ${pair.roleB.name}
            </span>
            <span style="font-size: 0.75rem; font-weight: 700; color: #ef4444;">Second 30 Seconds</span>
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #64748b; margin-bottom: 6px;">
            ${pair.roleB.title}
          </div>
          <p style="margin: 0 0 14px 0; font-size: 0.92rem; color: ${isWhiteboard ? '#cbd5e1' : '#334155'}; line-height: 1.45;">
            <strong>Objective:</strong> ${pair.roleB.objective}
          </p>
          <div style="background: ${isWhiteboard ? '#0f172a' : '#fef2f2'}; border-left: 4px solid #dc2626; padding: 10px 14px; border-radius: 6px; font-size: 0.88rem; color: ${isWhiteboard ? '#fca5a5' : '#b91c1c'}; font-style: italic;">
            ${pair.roleB.starter}
          </div>
          ${keyTermsB}
        </div>
      </div>

      <!-- Classroom Teacher Protocol Note -->
      <div style="background: ${isWhiteboard ? '#0f172a' : '#f8fafc'}; border: 1px solid ${isWhiteboard ? '#1e293b' : '#e2e8f0'}; border-radius: 8px; padding: 10px 14px; font-size: 0.8rem; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; line-height: 1.45;">
        <strong style="color: #f59e0b;"><i class="fa-solid fa-chalkboard-user"></i> Teacher Protocol:</strong> ${teacherProtocolText}
      </div>
    </div>
  `;
}

function renderArenaLightningView(state, arenaData, isWhiteboard) {
  const a = state.arena;
  const timeSec = a.lightningTimerSeconds;
  const mins = Math.floor(timeSec / 60);
  const secs = timeSec % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const seated = a.seatedCount || 0;
  const target = a.targetStudents || 30;
  const pct = Math.min(100, Math.round((seated / target) * 100));
  const isComplete = seated >= target;

  return `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Rules Banner -->
      <div style="background: linear-gradient(135deg, ${isWhiteboard ? '#1e293b 0%, #0f172a 100%' : '#f8fafc 0%, #f1f5f9 100%'}); border: 1.5px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; border-radius: 12px; padding: 14px 18px;">
        <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #f59e0b; letter-spacing: 0.05em; margin-bottom: 4px;">
          ⚡ LIGHTNING CHAIN &bull; WHOLE-CLASS STAND-TO-SIT RECALL
        </div>
        <p style="margin: 0; font-size: 0.85rem; color: ${isWhiteboard ? '#cbd5e1' : '#334155'}; line-height: 1.45;">
          <strong>Rules:</strong> 1. Entire class stands up. &bull; 2. 90-second countdown begins. &bull; 3. Go in sequence: each pupil states <strong>ONE unrepeated historical fact, date, or key term</strong> from today. &bull; 4. Once accepted, SIT DOWN! &bull; 5. Can the class sit down before the clock hits 0?
        </p>
      </div>

      <!-- Giant Countdown & Counter Terminal -->
      <div style="background: ${isWhiteboard ? '#1e293b' : '#ffffff'}; border: 2px solid ${isWhiteboard ? '#334155' : '#e2e8f0'}; border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        <!-- Giant Digital Clock Display -->
        <div style="display: flex; justify-content: center; align-items: baseline; gap: 10px; margin-bottom: 12px;">
          <span id="arena-timer-val-lightning-${state.lessonId}" style="font-family: monospace; font-size: ${isWhiteboard ? '4.5rem' : '3.6rem'}; font-weight: 900; color: ${timeSec <= 10 && timeSec > 0 ? '#ef4444' : (isWhiteboard ? '#38bdf8' : '#0f172a')}; letter-spacing: 0.02em;">
            ${timeStr}
          </span>
        </div>

        <!-- Timer Controls -->
        <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 24px;">
          <button type="button" id="arena-timer-start-lightning-${state.lessonId}" onclick="window.${a.lightningTimerRunning ? 'pauseArenaTimer' : 'startArenaTimer'}('${state.lessonId}', 'lightning', 90)" style="background: ${a.lightningTimerRunning ? '#f59e0b' : '#10b981'}; color: #ffffff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 800; font-size: 0.95rem; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(16,185,129,0.25);">
            <i class="fa-solid ${a.lightningTimerRunning ? 'fa-pause' : 'fa-play'}"></i> ${a.lightningTimerRunning ? 'Pause Clock' : 'Start 90s Countdown'}
          </button>
          <button type="button" onclick="window.resetArenaTimer('${state.lessonId}', 'lightning', 90)" style="background: ${isWhiteboard ? '#334155' : '#f1f5f9'}; border: 1.5px solid ${isWhiteboard ? '#475569' : '#cbd5e1'}; color: ${isWhiteboard ? '#e2e8f0' : '#475569'}; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-rotate-right"></i> Reset Clock
          </button>
        </div>

        <!-- Class Size Preset Selector & Seated Counter -->
        <div style="background: ${isWhiteboard ? '#0f172a' : '#f8fafc'}; border: 1.5px solid ${isWhiteboard ? '#334155' : '#e2e8f0'}; border-radius: 12px; padding: 18px 20px; max-width: 600px; margin: 0 auto 16px auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid ${isWhiteboard ? '#1e293b' : '#e2e8f0'}; padding-bottom: 12px;">
            <!-- Manual Input & Steppers -->
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.8rem; font-weight: 800; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; text-transform: uppercase; letter-spacing: 0.04em;">
                <i class="fa-solid fa-users"></i> Class Size:
              </span>
              <div style="display: flex; align-items: center; gap: 3px; background: ${isWhiteboard ? '#1e293b' : '#ffffff'}; border: 1.5px solid ${isWhiteboard ? '#38bdf8' : '#3b82f6'}; border-radius: 8px; padding: 2px 4px;">
                <button type="button" onclick="window.adjustArenaClassSize('${state.lessonId}', -1)" title="Decrease class size" style="width: 24px; height: 24px; border: none; background: transparent; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                <input type="number" id="class-size-manual-${state.lessonId}" min="1" max="99" value="${target}" onchange="window.setArenaClassSize('${state.lessonId}', this.value)" onkeydown="if(event.key==='Enter'){this.blur();}" style="width: 44px; border: none; background: transparent; font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 800; text-align: center; color: ${isWhiteboard ? '#38bdf8' : '#1d4ed8'}; outline: none;" />
                <button type="button" onclick="window.adjustArenaClassSize('${state.lessonId}', 1)" title="Increase class size" style="width: 24px; height: 24px; border: none; background: transparent; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
              </div>
              <span style="font-size: 0.78rem; font-weight: 600; color: #94a3b8;">pupils</span>
            </div>

            <!-- Quick Presets -->
            <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
              <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; margin-right: 2px;">Presets:</span>
              ${[15, 20, 25, 28, 30, 32].map(sz => `
                <button type="button" onclick="window.setArenaClassSize('${state.lessonId}', ${sz})" style="padding: 3px 8px; border-radius: 5px; border: 1px solid ${target === sz ? '#3b82f6' : (isWhiteboard ? '#334155' : '#cbd5e1')}; background: ${target === sz ? '#3b82f6' : 'transparent'}; color: ${target === sz ? '#ffffff' : (isWhiteboard ? '#94a3b8' : '#64748b')}; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">
                  ${sz}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Seated Pupils Counter -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 12px;">
            <button type="button" onclick="window.adjustArenaSeated('${state.lessonId}', -1)" title="Subtract 1 pupil" style="width: 44px; height: 44px; border-radius: 10px; background: ${isWhiteboard ? '#334155' : '#e2e8f0'}; border: none; font-size: 1.3rem; font-weight: 800; color: ${isWhiteboard ? '#f8fafc' : '#0f172a'}; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              -
            </button>
            <div style="text-align: center;">
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; font-weight: 800; color: ${isComplete ? '#10b981' : (isWhiteboard ? '#f8fafc' : '#0f172a')}; line-height: 1;">
                ${seated} / ${target}
              </div>
              <div style="font-size: 0.78rem; font-weight: 700; color: #64748b; margin-top: 4px;">
                Pupils Seated (${pct}%)
              </div>
            </div>
            <button type="button" onclick="window.adjustArenaSeated('${state.lessonId}', 1)" title="Add 1 seated pupil" style="width: 44px; height: 44px; border-radius: 10px; background: #10b981; border: none; font-size: 1.3rem; font-weight: 800; color: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(16,185,129,0.3);">
              +
            </button>
          </div>

          <!-- Progress Bar -->
          <div style="height: 10px; width: 100%; background: ${isWhiteboard ? '#1e293b' : '#e2e8f0'}; border-radius: 999px; overflow: hidden;">
            <div style="height: 100%; width: ${pct}%; background: linear-gradient(90deg, #10b981, #059669); transition: width 0.25s ease;"></div>
          </div>
        </div>

        <!-- Class Victory Celebration Banner -->
        ${isComplete ? `
          <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 10px; padding: 14px 20px; max-width: 600px; margin: 0 auto 16px auto; animation: fadeIn 0.3s ease;">
            <div style="font-size: 1.1rem; font-weight: 800; color: #15803d; display: flex; align-items: center; justify-content: center; gap: 8px;">
              🎉 CLASS VICTORY!
            </div>
            <p style="margin: 4px 0 0 0; color: #166534; font-size: 0.88rem;">
              All ${target} pupils successfully recalled historical evidence and are seated before the buzzer!
            </p>
          </div>
        ` : ''}

        <!-- Student Freeze Lifeline Drawer (Toggle) -->
        <div style="max-width: 600px; margin: 0 auto;">
          <button type="button" onclick="window.toggleArenaLifeline('${state.lessonId}')" style="background: transparent; border: 1px dashed ${isWhiteboard ? '#64748b' : '#94a3b8'}; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; padding: 6px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
            <i class="fa-solid fa-lightbulb" style="color: #f59e0b;"></i> ${a.showLifeline ? 'Hide Student Freeze Lifeline' : 'Student Freeze Lifeline (Fact Idea Bank)'}
          </button>
          ${a.showLifeline ? `
            <div style="margin-top: 10px; padding: 12px 16px; background: ${isWhiteboard ? '#0f172a' : '#f8fafc'}; border: 1px solid ${isWhiteboard ? '#334155' : '#cbd5e1'}; border-radius: 8px; text-align: left;">
              <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #f59e0b; margin-bottom: 6px;">
                Fact Inspiration Bank (If a pupil hesitates):
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${(arenaData.quickFacts || []).map(f => `
                  <span style="background: ${isWhiteboard ? '#1e293b' : '#ffffff'}; border: 1px solid ${isWhiteboard ? '#334155' : '#e2e8f0'}; color: ${isWhiteboard ? '#cbd5e1' : '#334155'}; font-size: 0.75rem; padding: 3px 8px; border-radius: 5px;">
                    ${f}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Classroom Teacher Protocol Note -->
      <div style="background: ${isWhiteboard ? '#0f172a' : '#f8fafc'}; border: 1px solid ${isWhiteboard ? '#1e293b' : '#e2e8f0'}; border-radius: 8px; padding: 10px 14px; font-size: 0.8rem; color: ${isWhiteboard ? '#94a3b8' : '#64748b'}; line-height: 1.45;">
        <strong style="color: #f59e0b;"><i class="fa-solid fa-chalkboard-user"></i> Teacher Protocol:</strong> High-energy, low-stakes plenary. If a pupil hesitates for more than 5 seconds, allow a classmate to offer a quick keyword hint, or click the Freeze Lifeline so the chain never stalls.
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// GLOBAL ACTION HANDLERS
// -------------------------------------------------------------
window.switchConsolidateTab = function (lessonId, mode) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;

  clearAllArenaTimers(state);
  const portal = document.getElementById('arena-projector-portal');
  if (portal) portal.remove();
  state.mode = mode;

  if (mode === 'quiz') {
    state.questions = state.allQuestions;
    state.currentIndex = 0;
    state.score = 0;
    state.answered = false;
    state.selectedOption = null;
  } else if (mode === 'vocab') {
    state.vocabIndex = 0;
    state.vocabFlipped = false;
  }

  // Update tab button styles
  const card = document.getElementById(`consolidate-station-${lessonId}`);
  if (card) {
    card.querySelectorAll('.station-tab-btn').forEach((btn) => {
      btn.style.background = 'transparent';
      btn.style.color = '#475569';
      btn.style.boxShadow = 'none';
      btn.classList.remove('active');
    });
    const targetTabId = `tab-btn-${mode}-${lessonId}`;
    const activeBtn = document.getElementById(targetTabId);
    if (activeBtn) {
      activeBtn.style.background = '#ffffff';
      activeBtn.style.color = '#0f172a';
      activeBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
      activeBtn.classList.add('active');
    }
  }

  renderStationContent(lessonId);
};

// Timeline handlers
window.toggleStationTimelineDone = function (lessonId, checked) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  state.timelineDone = checked;
  try {
    localStorage.setItem('timeline_done_' + lessonId, checked ? 'true' : 'false');
  } catch (e) {}
  renderStationContent(lessonId);
};

window.selectStationTimelinePathway = function (lessonId, pathway) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  state.timelinePathway = pathway;
  try {
    localStorage.setItem('timeline_pathway_' + lessonId, pathway);
  } catch (e) {}
  renderStationContent(lessonId);
};

// Quiz handlers
window.answerStationQuestion = function (lessonId, optionIdx) {
  const state = window.consolidateStations[lessonId];
  if (!state || state.answered) return;

  const q = state.questions[state.currentIndex];
  state.answered = true;
  state.selectedOption = optionIdx;

  if (optionIdx === q.answer) {
    state.score++;
  }

  renderStationContent(lessonId);
};

window.nextStationQuestion = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;

  state.currentIndex++;
  state.answered = false;
  state.selectedOption = null;
  renderStationContent(lessonId);
};

window.restartStationQuiz = function (lessonId) {
  window.switchConsolidateTab(lessonId, 'quiz');
};

// Vocab handlers
window.flipStationVocabCard = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  state.vocabFlipped = !state.vocabFlipped;
  renderStationContent(lessonId);
};

window.nextStationVocabCard = function (lessonId, direction) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.allVocab) return;
  const newIdx = state.vocabIndex + direction;
  if (newIdx >= 0 && newIdx < state.allVocab.length) {
    state.vocabIndex = newIdx;
    state.vocabFlipped = false;
    renderStationContent(lessonId);
  }
};

window.shuffleStationVocab = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.allVocab) return;
  state.allVocab = [...state.allVocab].sort(() => Math.random() - 0.5);
  state.vocabIndex = 0;
  state.vocabFlipped = false;
  renderStationContent(lessonId);
};

// Chrono Domino handlers
window.moveStationDominoCard = function (lessonId, fromIdx, toIdx) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.domino) return;
  const list = state.domino.currentOrder;
  if (toIdx < 0 || toIdx >= list.length) return;

  const item = list.splice(fromIdx, 1)[0];
  list.splice(toIdx, 0, item);
  state.domino.isSubmitted = false;
  renderStationContent(lessonId);
};

window.checkStationDomino = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.domino) return;
  state.domino.isSubmitted = true;
  renderStationContent(lessonId);
};

window.shuffleStationDomino = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.domino) return;
  state.domino.currentOrder = [...state.domino.correctOrder].sort(() => Math.random() - 0.5);
  state.domino.isSubmitted = false;
  renderStationContent(lessonId);
};

window.revealStationDomino = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.domino) return;
  state.domino.currentOrder = [...state.domino.correctOrder];
  state.domino.isSubmitted = true;
  renderStationContent(lessonId);
};

// Exit Ticket handlers
window.handleExitTicketInput = function (lessonId, text) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  state.exitResponse = text;

  try {
    localStorage.setItem('exit_ticket_' + lessonId, text);
  } catch (e) {}

  const counterEl = document.getElementById(`exit-counter-${lessonId}`);
  if (counterEl) {
    const counts = countWordsAndSentences(text);
    counterEl.textContent = `${counts.sentences} sentence${counts.sentences === 1 ? '' : 's'} • ${counts.words} words`;
  }
};

window.submitStationExitTicket = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  const input = document.getElementById(`exit-ticket-input-${lessonId}`);
  if (input) {
    state.exitResponse = input.value;
    try {
      localStorage.setItem('exit_ticket_' + lessonId, input.value);
    } catch (e) {}
  }
  state.exitSubmitted = true;
  state.showExitModel = true; // Auto-reveal model on submit
  renderStationContent(lessonId);
};

window.toggleStationExitModel = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state) return;
  state.showExitModel = !state.showExitModel;
  renderStationContent(lessonId);
};

// =============================================================
// CLASSROOM ARENA GLOBAL ACTION HANDLERS
// =============================================================
window.switchArenaGame = function (lessonId, gameMode) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  clearAllArenaTimers(state);
  state.arena.gameMode = gameMode;
  renderStationContent(lessonId);
};

window.toggleArenaWhiteboard = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  state.arena.isWhiteboardMode = !state.arena.isWhiteboardMode;
  renderStationContent(lessonId);
};

window.toggleArenaSound = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  state.arena.soundEnabled = !state.arena.soundEnabled;
  renderStationContent(lessonId);
};

window.startArenaTimer = function (lessonId, gameKey, defaultSeconds) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const a = state.arena;
  const timeKey = `${gameKey}TimerSeconds`;
  const intervalKey = `${gameKey}TimerInterval`;
  const runningKey = `${gameKey}TimerRunning`;

  if (a[runningKey]) return;

  if (a[timeKey] <= 0) {
    a[timeKey] = defaultSeconds;
    if (gameKey === 'standoff') a.standoffPhase = 'roleA';
  }

  a[runningKey] = true;
  updateArenaTimerDOM(lessonId, gameKey);

  a[intervalKey] = setInterval(() => {
    tickArenaTimer(lessonId, gameKey, defaultSeconds);
  }, 1000);
};

window.pauseArenaTimer = function (lessonId, gameKey) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const a = state.arena;
  const intervalKey = `${gameKey}TimerInterval`;
  const runningKey = `${gameKey}TimerRunning`;

  if (a[intervalKey]) {
    clearInterval(a[intervalKey]);
    a[intervalKey] = null;
  }
  a[runningKey] = false;
  updateArenaTimerDOM(lessonId, gameKey);
};

window.resetArenaTimer = function (lessonId, gameKey, defaultSeconds) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const a = state.arena;
  const timeKey = `${gameKey}TimerSeconds`;
  const intervalKey = `${gameKey}TimerInterval`;
  const runningKey = `${gameKey}TimerRunning`;

  if (a[intervalKey]) {
    clearInterval(a[intervalKey]);
    a[intervalKey] = null;
  }
  a[runningKey] = false;
  a[timeKey] = defaultSeconds;
  if (gameKey === 'standoff') a.standoffPhase = 'roleA';
  updateArenaTimerDOM(lessonId, gameKey);
};

window.switchArenaTabooDeck = function (lessonId, deckType) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  state.arena.tabooDeckType = deckType;
  state.arena.tabooIndex = 0;
  state.arena.tabooRevealedDef = false;
  renderStationContent(lessonId);
};

window.nextArenaTabooCard = function (lessonId, isCorrect) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const a = state.arena;
  if (isCorrect) {
    a.tabooScore = (a.tabooScore || 0) + 1;
    if (a.soundEnabled) playArenaSound('ding');
  }
  a.tabooIndex = (a.tabooIndex || 0) + 1;
  a.tabooRevealedDef = false;
  renderStationContent(lessonId);
};

window.shuffleArenaTaboo = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arenaData) return;
  state.arenaData.cumulativeDeck = [...state.arenaData.cumulativeDeck].sort(() => Math.random() - 0.5);
  state.arenaData.todayDeck = [...state.arenaData.todayDeck].sort(() => Math.random() - 0.5);
  state.arena.tabooIndex = 0;
  state.arena.tabooScore = 0;
  state.arena.tabooRevealedDef = false;
  renderStationContent(lessonId);
};

window.toggleArenaTabooDef = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  state.arena.tabooRevealedDef = !state.arena.tabooRevealedDef;
  renderStationContent(lessonId);
};

window.selectArenaCorner = function (lessonId, cornerIdx) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  state.arena.cornersSelectedCorner = (state.arena.cornersSelectedCorner === cornerIdx ? null : cornerIdx);
  renderStationContent(lessonId);
};

window.adjustArenaSeated = function (lessonId, delta) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const a = state.arena;
  const target = a.targetStudents || 30;
  const prev = a.seatedCount || 0;
  const next = Math.max(0, Math.min(target, prev + delta));
  a.seatedCount = next;

  if (next >= target && prev < target) {
    window.pauseArenaTimer(lessonId, 'lightning');
    if (a.soundEnabled) playArenaSound('fanfare');
  } else if (delta > 0 && a.soundEnabled) {
    playArenaSound('tick');
  }

  renderStationContent(lessonId);
};

window.setArenaClassSize = function (lessonId, size) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const parsed = parseInt(size, 10);
  if (isNaN(parsed) || parsed < 1) return;
  state.arena.targetStudents = parsed;
  try {
    localStorage.setItem('history_arena_class_size', parsed.toString());
  } catch (e) {}
  if ((state.arena.seatedCount || 0) > parsed) {
    state.arena.seatedCount = parsed;
  }
  renderStationContent(lessonId);
};

window.adjustArenaClassSize = function (lessonId, delta) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  const current = state.arena.targetStudents || 30;
  window.setArenaClassSize(lessonId, Math.max(1, Math.min(99, current + delta)));
};

window.toggleArenaLifeline = function (lessonId) {
  const state = window.consolidateStations[lessonId];
  if (!state || !state.arena) return;
  state.arena.showLifeline = !state.arena.showLifeline;
  renderStationContent(lessonId);
};
