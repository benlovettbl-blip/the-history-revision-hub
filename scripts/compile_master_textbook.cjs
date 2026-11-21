/**
 * scripts/compile_master_textbook.cjs
 *
 * UNIFIED FULL-COLOUR CLASSROOM TEXTBOOK COMPILER ENGINE (KS2, KS3 & GCSE KT)
 *
 * Single data-driven engine reading live narrative prose from `data/<unit_id>.json`:
 * - 100% Verbatim Word-for-Word App Sync (zero manual prose copy-paste)
 * - Unified `Stage 1`–`Stage 5` (or `Stage 1`–`Stage 3` on KS2) block headers
 * - Auto-excludes Assessment Masterclass lessons (`!/assessment|masterclass/i`)
 * - Full-Colour CME Editorial Aesthetic (zero `...` truncation, zero RAG write-in boxes)
 * - Templates:
 *   * `8p_ks3`       : 8 Pages  (Cover + Spine + 5 Single-Page Lessons + 25-Q Quiz)
 *   * `12p_extended` : 12 Pages (Cover + Spine + 7 Single-Page Lessons + Reference Dossier + 2p 35-Q Quiz)
 *   * `16p_spreads`  : 16 Pages (Cover + Spine + 6 Two-Page Spreads @ 11.5pt+ + Reference Dossier + 30-Q Quiz)
 *   * `16p_ks2`      : 16 Pages (Cover + Spine + 11 Single-Column Wide-Margin Lessons @ 11.5–13pt + 2p 55-Q Quiz + Vocab Bank)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const { TEXTBOOK_UNIT_REGISTRY } = require('./components/master_textbook_registry.cjs');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SHOTS_ROOT = path.join(__dirname, 'qa_screenshots');
const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const esc = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function stripTags(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHeadingPunctuation(s) {
  return String(s || '')
    .replace(/,([^\s])/g, ', $1')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanLessonTitle(title) {
  return normalizeHeadingPunctuation(
    String(title || '')
      .replace(/^(?:Key\s*Topic|KT)\s*\d+(?:\.\d+)?\s*(?:Enquiry)?\s*:\s*/i, '')
      .replace(/^Enquiry\s*\d+\s*:\s*/i, '')
      .replace(/^Lesson\s*\d+\s*:\s*/i, '')
      .trim()
  );
}

function extractDateFromTitle(title, fallback = '') {
  const endMatch = String(title || '').match(/\(([^)]*\d{4}[^)]*)\)\s*\.?\s*$/);
  if (endMatch) return endMatch[1].trim();
  const anyMatch = String(title || '').match(/\(([^)]*\d{4}[^)]*)\)/);
  if (anyMatch) return anyMatch[1].trim();
  const commaMatch = String(title || '').match(/,\s*((?:c\.?\s*)?\d{4}(?:[–\-]\d{2,4}|[–\-]present)?)\s*\??\s*$/i);
  return commaMatch ? commaMatch[1].trim() : fallback;
}

function deriveLessonPeriod(rawTitle, wbStages, fallback = '') {
  const fromTitle = extractDateFromTitle(rawTitle, '');
  if (fromTitle) return fromTitle;
  if (Array.isArray(wbStages) && wbStages.length) {
    const dates = wbStages
      .map((s) => String(s?.date || s?.dates || '').trim())
      .filter(Boolean);
    if (dates.length === 1) return dates[0];
    if (dates.length > 1) {
      const firstYr = (dates[0].match(/\d{4}/) || [])[0];
      const lastYr = (dates[dates.length - 1].match(/\d{4}/g) || []).pop();
      if (firstYr && lastYr && firstYr !== lastYr) return `${firstYr}–${lastYr}`;
      return dates[0];
    }
  }
  return fallback;
}

function stripTrailingDate(title) {
  return String(title || '')
    .replace(/\s*\([^)]*\d{4}[^)]*\)\s*\.?\s*$/, '')
    .replace(/,\s*(?:c\.?\s*)?\d{4}(?:[–\-]\d{2,4}|[–\-]present)?\s*$/i, '')
    .replace(/\.$/, '')
    .trim();
}

function compactFlowDate(d) {
  return String(d || '')
    .replace(/\bJanuary\b/gi, 'Jan')
    .replace(/\bFebruary\b/gi, 'Feb')
    .replace(/\bMarch\b/gi, 'Mar')
    .replace(/\bApril\b/gi, 'Apr')
    .replace(/\bAugust\b/gi, 'Aug')
    .replace(/\bSeptember\b/gi, 'Sept')
    .replace(/\bOctober\b/gi, 'Oct')
    .replace(/\bNovember\b/gi, 'Nov')
    .replace(/\bDecember\b/gi, 'Dec')
    .trim();
}

function cleanStageFlowLabel(rawTitle) {
  return normalizeHeadingPunctuation(stripTrailingDate(rawTitle))
    .replace(/^(Stage\s*\d+\s*[:\-–—]\s*|\[\d+\.\d+\]\s*)/i, '')
    .replace(/^The\s+/i, '');
}

function getShortEnquiryQuestion(lesson, dispTitle = '') {
  const candidates = [
    lesson.enquiryQuestion,
    lesson.enquiry_question,
    lesson.inquiry_question,
    lesson.enquiry,
    lesson.subtitle,
  ];
  for (const c of candidates) {
    const clean = stripTags(c || '');
    if (clean && clean.length <= 165 && clean !== dispTitle) {
      return clean;
    }
  }
  return '';
}

function cleanProseHtml(rawHtml) {
  if (!rawHtml) return '';
  return String(rawHtml)
    .replace(/<span\s+class=["']para-ref["']>[\s\S]*?<\/span>\s*/gi, '')
    .replace(/(^|>|\s)\[\s*\d+\.\d+\s*\]\s*/g, '$1')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .trim();
}

function formatBlockParagraphs(block) {
  const raw = block.content || block.text || '';
  const pMatches = raw.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (pMatches && pMatches.length > 0) {
    return pMatches
      .map((m) => {
        const inner = cleanProseHtml(m.replace(/<\/?p[^>]*>/gi, ''));
        return inner ? `<p class="prose-p">${inner}</p>` : '';
      })
      .filter(Boolean)
      .join('\n');
  }
  const cleaned = cleanProseHtml(raw);
  return cleaned ? `<p class="prose-p">${cleaned}</p>` : '';
}

async function encodeHeroImage(relPath) {
  const cleanRel = String(relPath || '').replace(/^\/+/, '');
  const full = path.join(PUBLIC_DIR, cleanRel);
  if (!fs.existsSync(full)) {
    throw new Error(`Cover hero image missing: ${full}`);
  }
  const buf = await sharp(full)
    .resize({ width: 1200, height: 900, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

function pickLessonRecallQuestions(lesson, count = 5, fallbackList = null) {
  if (Array.isArray(fallbackList) && fallbackList.length >= count) {
    return fallbackList.slice(0, count);
  }
  const pool = Array.isArray(lesson.quiz) ? lesson.quiz : [];
  if (pool.length === 0 && Array.isArray(fallbackList)) {
    return fallbackList.slice(0, count);
  }
  const picked = [];
  const seenAnswers = new Set();
  const seenStems = [];

  const isTooSimilar = (q, ans) => {
    const normA = String(ans || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normA && normA.length > 2 && seenAnswers.has(normA)) return true;
    const words = q
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['what', 'which', 'when', 'where', 'were', 'from', 'that', 'with', 'into'].includes(w));
    for (const prev of seenStems) {
      const overlap = words.filter((w) => prev.has(w)).length;
      if (words.length > 0 && overlap / Math.min(words.length, prev.size || 1) >= 0.6) return true;
    }
    return false;
  };

  const tryPass = (maxLen, strictDedup) => {
    for (const item of pool) {
      if (picked.length >= count) break;
      const q = stripTags(item.question || item.q || '');
      const ans = stripTags(item.answer || item.a || '');
      if (!q || q.length > maxLen) continue;
      if (picked.includes(q)) continue;
      if (strictDedup && isTooSimilar(q, ans)) continue;
      picked.push(q);
      const normA = String(ans || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normA) seenAnswers.add(normA);
      seenStems.push(
        new Set(
          q
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '')
            .split(/\s+/)
            .filter((w) => w.length > 3)
        )
      );
    }
  };

  tryPass(115, true);
  if (picked.length < count) tryPass(155, true);
  if (picked.length < count) tryPass(240, false);
  return picked.slice(0, count);
}

function renderReferencePageHtml(cfg, pageNum, totalPages) {
  const ref = cfg.referencePage;
  const figsHtml = (ref.figures || [])
    .map(
      (f) => `
      <div class="ref-fig-card">
        <div class="ref-fig-top">
          <span class="ref-fig-name">${esc(f.name)}</span>
          <span class="ref-fig-role">${esc(f.role)}</span>
        </div>
        <p class="ref-fig-desc">${esc(f.detail)}</p>
      </div>`
    )
    .join('\n');

  const termsHtml = (ref.terms || [])
    .map(
      (t) => `
      <div class="ref-term-row">
        <span class="ref-term-k">${esc(t.term)}</span>
        <span class="ref-term-v">${esc(t.def)}</span>
      </div>`
    )
    .join('\n');

  return `
  <section class="page textbook-page page-ref" id="page-${pageNum}" data-page="${pageNum}">
    <div class="ref-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>DOSSIER</small>
          <span>REF</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${esc(ref.kicker)}</div>
          <h2>${esc(ref.heading)}</h2>
        </div>
        <div class="subpage-pill">${esc(cfg.period)}</div>
      </div>

      <div class="ref-sec-label">KEY HISTORICAL INDIVIDUALS &amp; ACTORS</div>
      <div class="ref-figs-grid">
        ${figsHtml}
      </div>

      <div class="ref-sec-label" style="margin-top:10px;">ESSENTIAL DISCIPLINARY CONCEPTS &amp; TERMINOLOGY</div>
      <div class="ref-terms-grid">
        ${termsHtml}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub · ${esc(cfg.coverTitle)} · Key Figures &amp; Terminology Dossier</span>
      <span class="pg">Page ${pageNum} / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderKs2VocabPageHtml(cfg, lessons, pageNum, totalPages, isKs2 = true) {
  // Collect 14 distinct high-yield terms across the lessons (deduplicating against referencePage)
  const terms = [];
  const seen = new Set(
    (cfg.referencePage?.terms || []).map((t) =>
      String(t.term || '')
        .toLowerCase()
        .replace(/\s*\([^)]*\)/g, '')
        .trim()
    )
  );
  for (let i = 0; i < lessons.length; i++) {
    const vList = Array.isArray(lessons[i].vocab) ? lessons[i].vocab : [];
    for (const v of vList) {
      const word = stripTags(v.term || v.word || '');
      const def = stripTags(v.definition || v.def || v.meaning || '');
      const key = word.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim();
      if (!word || !def || seen.has(key)) continue;
      seen.add(key);
      terms.push({ word, def, lessonNum: i + 1 });
      break;
    }
  }
  // Top up to 14 terms
  for (let i = 0; i < lessons.length && terms.length < 14; i++) {
    const vList = Array.isArray(lessons[i].vocab) ? lessons[i].vocab : [];
    for (const v of vList) {
      const word = stripTags(v.term || v.word || '');
      const def = stripTags(v.definition || v.def || v.meaning || '');
      const key = word.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim();
      if (!word || !def || seen.has(key)) continue;
      seen.add(key);
      terms.push({ word, def, lessonNum: i + 1 });
      if (terms.length >= 14) break;
    }
  }

  const locPrefix = isKs2 ? 'Lesson' : 'Enquiry';
  const cardsHtml = terms
    .map(
      (t) => `
      <div class="vocab-card">
        <div class="vocab-top">
          <span class="vocab-word">${esc(t.word)}</span>
          <span class="vocab-loc">${locPrefix} ${t.lessonNum}</span>
        </div>
        <p class="vocab-def">${esc(t.def)}</p>
      </div>`
    )
    .join('\n');

  const headingTxt = isKs2
    ? 'Key Historical Words &amp; Meanings'
    : 'Specification Terminology &amp; Core Concepts Bank';
  const instTxt = isKs2
    ? `<b>Reading &amp; Speaking Like a Historian:</b> Use these ${terms.length} key historical terms when discussing the stories in class or answering retrieval questions with your partner.`
    : `<b>Precision Exam Vocabulary:</b> Deploy these ${terms.length} high-tariff historical concepts accurately in classroom discussion and extended analytical writing.`;

  return `
  <section class="page textbook-page page-vocab" id="page-${pageNum}" data-page="${pageNum}">
    <div class="ref-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>GLOSSARY</small>
          <span>${terms.length}</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${esc(cfg.unitKicker)} · ESSENTIAL VOCABULARY BANK</div>
          <h2>${headingTxt}</h2>
        </div>
        <div class="subpage-pill">${esc(cfg.period)}</div>
      </div>

      <div class="quiz-inst">
        ${instTxt}
      </div>

      <div class="vocab-grid">
        ${cardsHtml}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub · ${esc(cfg.coverTitle)} · Historical Vocabulary Bank</span>
      <span class="pg">Page ${pageNum} / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderQuizPageHtml({
  cfg,
  lessonSlice,
  startLessonIdx,
  startQuestionNum,
  pageNum,
  totalPages,
  totalQuestionsLabel,
  subTitleLabel,
  pageLocatorFn,
  isKs2 = false,
  twoColCards = false,
  questionsPerLesson = 5,
  customCards = null,
}) {
  let runningQ = startQuestionNum;
  const cardsHtml = Array.isArray(customCards)
    ? customCards
        .map((c) => {
          const cardStart = runningQ;
          runningQ += c.questions.length;
          return `
        <div class="quiz-card">
          <div class="quiz-card-hdr">
            <span class="quiz-card-tt"><span class="quiz-e-pill">${esc(c.pillCode)}</span> ${esc(c.heading)}</span>
            <span class="quiz-card-loc">${esc(c.locator)}</span>
          </div>
          <ol class="quiz-ol" start="${cardStart}">
            ${c.questions.map((q) => `<li>${esc(q)}</li>`).join('')}
          </ol>
        </div>`;
        })
        .join('\n')
    : lessonSlice
        .map((lesson, idx) => {
          const globalIdx = startLessonIdx + idx;
          const numStr = String(globalIdx + 1).padStart(2, '0');
          const dispTitle = stripTrailingDate(cleanLessonTitle(lesson.title));
          const fb = cfg.quizFallbacks?.[globalIdx + 1] || null;
          const qs = pickLessonRecallQuestions(lesson, questionsPerLesson, fb);
          const cardStart = runningQ;
          runningQ += qs.length;
          const prefixLabel = isKs2 ? `Lesson ${globalIdx + 1}` : `Enquiry ${numStr}`;
          const pillCode = isKs2 ? `L${globalIdx + 1}` : `E${globalIdx + 1}`;
          return `
        <div class="quiz-card">
          <div class="quiz-card-hdr">
            <span class="quiz-card-tt"><span class="quiz-e-pill">${pillCode}</span> ${prefixLabel}: ${esc(dispTitle)}</span>
            <span class="quiz-card-loc">${esc(pageLocatorFn(globalIdx))}</span>
          </div>
          <ol class="quiz-ol" start="${cardStart}">
            ${qs.map((q) => `<li>${esc(q)}</li>`).join('')}
          </ol>
        </div>`;
        })
        .join('\n');

  return `
  <section class="page textbook-page page-quiz" id="page-${pageNum}" data-page="${pageNum}">
    <div class="quiz-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>QUIZ BANK</small>
          <span>${esc(totalQuestionsLabel)}</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${esc(cfg.unitKicker)} · ACTIVE RECALL</div>
          <h2>${esc(subTitleLabel)}</h2>
        </div>
        <div class="subpage-pill">Partner / Solo</div>
      </div>

      <div class="quiz-inst">
        <b>Classroom &amp; Homework Retrieval Protocol:</b> Test your partner aloud or write full-sentence answers in your exercise book using the page references shown. Zero answers are printed so this classroom textbook remains reusable all year.
      </div>

      <div class="quiz-grid ${twoColCards ? 'quiz-grid-2col' : ''}">
        ${cardsHtml}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub · ${esc(cfg.coverTitle)} · Knowledge Retrieval Quiz</span>
      <span class="pg">Page ${pageNum} / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderSinglePageLessonHtml(cfg, lesson, lIdx, pageNum, totalPages, isKs2 = false) {
  const numStr = String(lIdx + 1).padStart(2, '0');
  const rawTitle = cleanLessonTitle(lesson.title);
  const dispTitle = stripTrailingDate(rawTitle);
  const blocks = Array.isArray(lesson.narrative_blocks) ? lesson.narrative_blocks : [];
  const wbStages = Array.isArray(lesson.workbook_stages) ? lesson.workbook_stages : [];
  const lessonDate = deriveLessonPeriod(rawTitle, wbStages, cfg.period);
  const eq = getShortEnquiryQuestion(lesson, dispTitle);

  const flowCells = blocks
    .map((b, bIdx) => {
      const rawStDate =
        wbStages[bIdx]?.date ||
        wbStages[bIdx]?.dates ||
        extractDateFromTitle(b.title || b.heading || '') ||
        '';
      const stDate = rawStDate ? compactFlowDate(rawStDate) : '';
      const kickerLabel = stDate ? `STAGE ${bIdx + 1} · ${esc(stDate)}` : `STAGE ${bIdx + 1}`;
      const fullCleanLbl = cleanStageFlowLabel(b.title || b.heading || `Stage ${bIdx + 1}`);
      return `
        <div class="flow-st">
          <div class="flow-kicker">${kickerLabel}</div>
          <div class="flow-lbl">${esc(fullCleanLbl)}</div>
        </div>`;
    })
    .join('\n');

  const blocksHtml = blocks
    .map((b, bIdx) => {
      const bTitle = normalizeHeadingPunctuation(stripTrailingDate(b.title || b.heading || `Stage ${bIdx + 1}`));
      const bDate = extractDateFromTitle(b.title || b.heading || '') || wbStages[bIdx]?.date || wbStages[bIdx]?.dates || '';
      const parasHtml = formatBlockParagraphs(b);
      return `
        <div class="block-section">
          <div class="block-hdr">
            <span class="stage-pill">STAGE ${bIdx + 1}</span>
            <span class="block-title">${esc(bTitle)}</span>
            ${bDate ? `<span class="block-date">${esc(bDate)}</span>` : ''}
          </div>
          <div class="block-prose">
            ${parasHtml}
          </div>
        </div>`;
    })
    .join('\n');

  const badgeLabel = isKs2 ? 'LESSON' : 'ENQUIRY';
  const ftrPrefix = isKs2 ? `Lesson ${lIdx + 1}` : `Enquiry ${numStr}`;
  const stageRangeLabel = `Stages 1–${blocks.length}`;

  return `
  <section class="page textbook-page page-lesson ${isKs2 ? 'page-lesson-ks2' : ''}" id="page-${pageNum}" data-page="${pageNum}">
    <div class="lesson-top">
      <div class="hdr">
        <div class="hdr-num">
          <small>${badgeLabel}</small>
          <span>${numStr}</span>
        </div>
        <div class="hdr-tt">
          <div class="hdr-kt">${esc(cfg.unitKicker)}</div>
          <h2 class="hdr-h2">${esc(dispTitle)}</h2>
        </div>
        <div class="hdr-dt">${esc(lessonDate || cfg.period)}</div>
      </div>

      <div class="flow" style="grid-template-columns: repeat(${blocks.length}, 1fr);">
        ${flowCells}
      </div>

      ${
        eq
          ? `
      <div class="eq-bar">
        <span class="eq-pill">KEY ENQUIRY</span>
        <span class="eq-txt">“${esc(eq)}”</span>
      </div>`
          : ''
      }
    </div>

    <div class="prose-wrap">
      <div class="${isKs2 ? 'prose-single-wide' : 'prose-columns'}">
        ${blocksHtml}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub · ${ftrPrefix}: ${esc(dispTitle)} · ${stageRangeLabel}</span>
      <span class="pg">Page ${pageNum} / ${totalPages}</span>
    </footer>
  </section>`;
}

function renderTwoPageSpreadLessonHtml(cfg, lesson, lIdx, versoPageNum, totalPages) {
  const rectoPageNum = versoPageNum + 1;
  const numStr = String(lIdx + 1).padStart(2, '0');
  const rawTitle = cleanLessonTitle(lesson.title);
  const dispTitle = stripTrailingDate(rawTitle);
  const blocks = Array.isArray(lesson.narrative_blocks) ? lesson.narrative_blocks : [];
  const wbStages = Array.isArray(lesson.workbook_stages) ? lesson.workbook_stages : [];
  const lessonDate = deriveLessonPeriod(rawTitle, wbStages, cfg.period);
  const eq = getShortEnquiryQuestion(lesson, dispTitle);

  const versoBlocks = blocks.slice(0, 2);
  const rectoBlocks = blocks.slice(2);

  const flowCells = blocks
    .map((b, bIdx) => {
      const rawStDate =
        wbStages[bIdx]?.date ||
        wbStages[bIdx]?.dates ||
        extractDateFromTitle(b.title || b.heading || '') ||
        '';
      const stDate = rawStDate ? compactFlowDate(rawStDate) : '';
      const kickerLabel = stDate ? `STAGE ${bIdx + 1} · ${esc(stDate)}` : `STAGE ${bIdx + 1}`;
      const fullCleanLbl = cleanStageFlowLabel(b.title || b.heading || `Stage ${bIdx + 1}`);
      return `
        <div class="flow-st">
          <div class="flow-kicker">${kickerLabel}</div>
          <div class="flow-lbl">${esc(fullCleanLbl)}</div>
        </div>`;
    })
    .join('\n');

  const renderBlockSlice = (slice, offset) =>
    slice
      .map((b, idx) => {
        const bIdx = offset + idx;
        const bTitle = normalizeHeadingPunctuation(stripTrailingDate(b.title || b.heading || `Stage ${bIdx + 1}`));
        const bDate = extractDateFromTitle(b.title || b.heading || '') || wbStages[bIdx]?.date || wbStages[bIdx]?.dates || '';
        const stageQ = wbStages[bIdx]?.question || wbStages[bIdx]?.focus_clue || wbStages[bIdx]?.heading || '';
        const parasHtml = formatBlockParagraphs(b);
        return `
          <div class="block-section spread-block">
            <div class="block-hdr">
              <span class="stage-pill">STAGE ${bIdx + 1}</span>
              <span class="block-title">${esc(bTitle)}</span>
              ${bDate ? `<span class="block-date">${esc(bDate)}</span>` : ''}
            </div>
            ${stageQ && stageQ !== bTitle && stageQ.includes('?') ? `<div class="spread-stage-q">“${esc(stageQ)}”</div>` : ''}
            <div class="block-prose">
              ${parasHtml}
            </div>
          </div>`;
      })
      .join('\n');

  return `
  <section class="page textbook-page page-lesson page-spread" id="page-${versoPageNum}" data-page="${versoPageNum}">
    <div class="lesson-top">
      <div class="hdr">
        <div class="hdr-num">
          <small>ENQUIRY</small>
          <span>${numStr}</span>
        </div>
        <div class="hdr-tt">
          <div class="hdr-kt">${esc(cfg.unitKicker)} · PART I (STAGES 1–2)</div>
          <h2 class="hdr-h2">${esc(dispTitle)}</h2>
        </div>
        <div class="hdr-dt">${esc(lessonDate || cfg.period)}</div>
      </div>

      <div class="flow" style="grid-template-columns: repeat(${blocks.length}, 1fr);">
        ${flowCells}
      </div>

      ${
        eq
          ? `
      <div class="eq-bar">
        <span class="eq-pill">KEY ENQUIRY</span>
        <span class="eq-txt">“${esc(eq)}”</span>
      </div>`
          : ''
      }
    </div>

    <div class="prose-wrap">
      <div class="prose-columns">
        ${renderBlockSlice(versoBlocks, 0)}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub · Enquiry ${numStr} (Part I): ${esc(dispTitle)} · Stages 1–2</span>
      <span class="pg">Page ${versoPageNum} / ${totalPages}</span>
    </footer>
  </section>

  <section class="page textbook-page page-lesson page-spread" id="page-${rectoPageNum}" data-page="${rectoPageNum}">
    <div class="lesson-top">
      <div class="hdr">
        <div class="hdr-num" style="background: var(--navy);">
          <small>ENQUIRY</small>
          <span>${numStr}</span>
        </div>
        <div class="hdr-tt" style="border-bottom-color: var(--navy);">
          <div class="hdr-kt">${esc(cfg.unitKicker)} · PART II (STAGES 3–${blocks.length})</div>
          <h2 class="hdr-h2">${esc(dispTitle)} — Escalation &amp; Consequences</h2>
        </div>
        <div class="hdr-dt" style="background: var(--navy);">Stages 3–${blocks.length}</div>
      </div>
    </div>

    <div class="prose-wrap">
      <div class="prose-columns">
        ${renderBlockSlice(rectoBlocks, 2)}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub · Enquiry ${numStr} (Part II): ${esc(dispTitle)} · Stages 3–${blocks.length}</span>
      <span class="pg">Page ${rectoPageNum} / ${totalPages}</span>
    </footer>
  </section>`;
}

async function buildUnitHtml(cfg) {
  const dataPath = path.join(ROOT, 'data', `${cfg.unitId}.json`);
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Unit JSON not found: ${dataPath}`);
  }
  const unitData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const allLessons = Array.isArray(unitData.lessons) ? unitData.lessons : [];
  const filteredLessons = allLessons.filter((l) => !/assessment|masterclass/i.test(l.title || ''));
  const lessons = Array.isArray(cfg.lessonIndices)
    ? cfg.lessonIndices.map((idx) => filteredLessons[idx]).filter(Boolean)
    : filteredLessons;

  const tmpl = cfg.template || '8p_ks3';
  const isKs2 = tmpl === '16p_ks2';
  const isSpreads =
    tmpl === '16p_spreads' ||
    tmpl === '16p_5spreads' ||
    tmpl === '12p_4spreads' ||
    tmpl === '12p_3spreads';

  const totalPages =
    tmpl === '8p_ks3'
      ? 8
      : tmpl === '12p_extended' || tmpl === '12p_4spreads' || tmpl === '12p_3spreads'
        ? 12
        : 16;

  const heroUri = await encodeHeroImage(cfg.heroImage);
  const enquiryCountWord = `${lessons.length} Canonical ${isKs2 ? 'Lessons' : 'Enquiries'}`;
  const totalRecallCount =
    tmpl === '12p_3spreads'
      ? 24
      : tmpl === '16p_5spreads'
        ? 30
        : lessons.length * 5;

  // Page 1: Cover Directory (Flat Verso-Recto Spreads start on Page 4: pp. 4–5, 6–7, ...)
  const pageLocatorForLesson = (i) => {
    if (isSpreads) {
      const v = 4 + i * 2;
      return `pp. ${v}–${v + 1}`;
    }
    return `Page ${i + 3}`;
  };

  let coverDirHtml = '';
  if (lessons.length > 7) {
    // Compact 2-column directory for 11-lesson KS2 anthology so Page 1 fits cleanly
    const cards = lessons
      .map((l, i) => {
        const rawTitle = cleanLessonTitle(l.title);
        const dispTitle = stripTrailingDate(rawTitle);
        return `
          <div class="dir-compact-item">
            <span class="code-pill">Lesson ${i + 1}</span>
            <span class="dir-compact-tt">${esc(dispTitle)}</span>
            <span class="dir-compact-pg">p. ${i + 3}</span>
          </div>`;
      })
      .join('\n');
    coverDirHtml = `
      <div class="cover-dir-wrap">
        <div class="dir-banner">
          <span>CLASSROOM READING TABLE OF CONTENTS (${lessons.length} LESSONS)</span>
          <span class="dir-sub-note">Pages 3–${lessons.length + 2} · Single-Column Guided Reading</span>
        </div>
        <div class="dir-compact-grid">
          ${cards}
        </div>
      </div>`;
  } else {
    const directoryRows = lessons
      .map((l, i) => {
        const eNum = `0${i + 1}`;
        const rawTitle = cleanLessonTitle(l.title);
        const dispTitle = stripTrailingDate(rawTitle);
        const lDate = deriveLessonPeriod(rawTitle, l.workbook_stages, cfg.period);
        let eq = getShortEnquiryQuestion(l, dispTitle);
        if (!eq && Array.isArray(l.narrative_blocks) && l.narrative_blocks.length) {
          eq = l.narrative_blocks
            .slice(0, 3)
            .map((b) => cleanStageFlowLabel(b.title || b.heading || ''))
            .filter(Boolean)
            .join(' · ');
        }
        return `
          <tr>
            <td class="dir-code"><span class="code-pill">ENQUIRY ${eNum}</span></td>
            <td class="dir-main">
              <div class="dir-title">${esc(dispTitle)}</div>
              ${eq ? `<div class="dir-eq">${esc(eq)}</div>` : ''}
            </td>
            <td class="dir-date">${esc(lDate)}</td>
            <td class="dir-pg" style="text-align:right;">${pageLocatorForLesson(i)}</td>
          </tr>`;
      })
      .join('\n');

    coverDirHtml = `
      <div class="cover-dir-wrap">
        <div class="dir-banner">
          <span>CANONICAL ENQUIRY TABLE OF CONTENTS</span>
          <span class="dir-sub-note">${isSpreads ? 'Two-Page Spreads' : 'Pages 3–' + (lessons.length + 2)} · Stage 1–5 Narrative Architecture</span>
        </div>
        <table class="dir-table ${lessons.length >= 6 ? 'dir-table-dense' : ''}">
          <thead>
            <tr>
              <th style="width:86px;">ENQUIRY</th>
              <th>ENQUIRY TITLE &amp; KEY HISTORICAL QUESTION</th>
              <th style="width:98px;">PERIOD</th>
              <th style="width:66px; text-align:right;">PAGES</th>
            </tr>
          </thead>
          <tbody>
            ${directoryRows}
          </tbody>
        </table>
      </div>`;
  }

  const artBg = cfg.heroBg || '#0b1120';

  const page1Html = `
  <section class="page textbook-page page-cover" id="page-1" data-page="1">
    <div class="cover-body-wrap">
      <div class="cover-top-bar">
        <span>THE HISTORY REVISION HUB · <span class="school-brand-target" data-department-name="The History Department">The History Department</span></span>
        <span>PURE NARRATIVE CLASSROOM TEXTBOOK · ${isKs2 ? 'KS2 EDITION' : 'STAGE 1–5 EDITION'}</span>
      </div>

      ${
        cfg.heroLayout === 'wide'
          ? `
      <div class="cover-wide-title">
        <div>
          <div class="cover-kicker">${esc(cfg.seriesKicker)}</div>
          <h1 class="cover-h1" style="font-size:21pt;">${esc(cfg.coverTitle)} <span style="color:#38bdf8; font-family:'Inter',sans-serif; font-size:15pt;">${esc(cfg.period)}</span></h1>
          <p class="cover-sub" style="margin-top:3px;">${esc(cfg.coverSubtitle)}</p>
        </div>
        <div class="cover-meta-pills" style="flex-direction:column; align-items:flex-end; margin-top:0;">
          <span class="meta-chip">${esc(enquiryCountWord)}</span>
          <span class="meta-chip">${totalRecallCount} Recall Questions</span>
        </div>
      </div>
      <div class="cover-wide-art">
        <div class="cover-wide-img-wrap" style="background:${artBg}; ${lessons.length >= 7 ? 'height:54mm;' : ''}">
          <img src="${heroUri}" alt="${esc(cfg.coverTitle)}" />
        </div>
        <div class="cover-art-cap">${esc(cfg.heroCaption)}</div>
      </div>`
          : `
      <div class="cover-hero-grid" style="${lessons.length >= 6 ? 'height:82mm;' : ''}">
        <div class="cover-title-card">
          <div>
            <div class="cover-kicker">${esc(cfg.seriesKicker)}</div>
            <h1 class="cover-h1">${esc(cfg.coverTitle)}</h1>
            <div class="cover-period">${esc(cfg.period)}</div>
            <p class="cover-sub">${esc(cfg.coverSubtitle)}</p>
          </div>
          <div class="cover-meta-pills">
            <span class="meta-chip">${esc(enquiryCountWord)}</span>
            <span class="meta-chip">Stage 1–5 Aligned</span>
            <span class="meta-chip">${totalRecallCount} Recall Qs</span>
          </div>
        </div>

        <div class="cover-art-card">
          <div class="cover-art-frame" style="background:${artBg};">
            <img src="${heroUri}" alt="${esc(cfg.coverTitle)}" style="object-fit:${cfg.heroFit || 'cover'}; object-position:${cfg.heroPos || 'center'};" />
          </div>
          <div class="cover-art-cap">${esc(cfg.heroCaption)}</div>
        </div>
      </div>`
      }

      <div class="cover-synopsis-card">
        <div class="syn-head">
          <span class="syn-kicker">HISTORICAL OVERVIEW · ${esc(cfg.period)}</span>
          <span class="syn-tag">100% Verbatim Curriculum Narrative</span>
        </div>
        <p class="syn-body">${esc(cfg.synopsis)}</p>
      </div>

      ${coverDirHtml}
    </div>

    <footer class="ftr">
      <span>${/edexcel|gcse/i.test(cfg.seriesKicker || '') ? `The History Revision Hub · Independent Publication for Pearson Edexcel GCSE (Not Endorsed by Pearson)` : `The History Revision Hub · ${esc(cfg.coverTitle)} (${esc(cfg.period)}) · Classroom Textbook`}</span>
      <span class="pg">Page 1 / ${totalPages}</span>
    </footer>
  </section>`;

  // Chronological Spine Builder (Page 2 on single-page books; Page 3 on two-page spread books for flat Verso-Recto parity!)
  const milestoneRows = cfg.milestones
    .map(
      (m, idx) => `
      <div class="ms-row">
        <div class="ms-date-col">
          <span class="ms-date-pill">${esc(m.date)}</span>
        </div>
        <div class="ms-dot-col">
          <span class="ms-dot">${idx + 1}</span>
        </div>
        <div class="ms-card">
          <div class="ms-card-top">
            <span class="ms-title">${esc(m.title)}</span>
            <span class="ms-stage-tag">${esc(m.stage)}</span>
          </div>
          <p class="ms-desc">${esc(m.desc)}</p>
        </div>
      </div>`
    )
    .join('\n');

  const renderSpinePage = (pgNum) => `
  <section class="page textbook-page page-spine" id="page-${pgNum}" data-page="${pgNum}">
    <div class="spine-main">
      <div class="subpage-hdr">
        <div class="subpage-num">
          <small>TIMELINE</small>
          <span>${cfg.milestones.length}</span>
        </div>
        <div class="subpage-tt">
          <div class="subpage-kicker">${esc(cfg.unitKicker)}</div>
          <h2>${esc(cfg.milestonesHeading)}</h2>
        </div>
        <div class="subpage-pill">${esc(cfg.period)}</div>
      </div>
      <p class="spine-lead">${esc(cfg.milestonesSub)}</p>

      <div class="ms-list">
        <div class="ms-line"></div>
        ${milestoneRows}
      </div>
    </div>

    <footer class="ftr">
      <span>The History Revision Hub · ${esc(cfg.coverTitle)} · Master Chronological Spine</span>
      <span class="pg">Page ${pgNum} / ${totalPages}</span>
    </footer>
  </section>`;

  const page2Html = isSpreads
    ? `${renderReferencePageHtml(cfg, 2, totalPages)}\n${renderSpinePage(3)}`
    : renderSpinePage(2);

  // Assemble Body & Back Pages by Template
  let bodyAndBackHtml = '';
  const spreadLoc = (idx) => `pp. ${4 + idx * 2}–${5 + idx * 2}`;

  if (tmpl === '8p_ks3') {
    const lessonPgs = lessons
      .map((l, i) => renderSinglePageLessonHtml(cfg, l, i, i + 3, totalPages, false))
      .join('\n');
    const quizPg = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons,
      startLessonIdx: 0,
      startQuestionNum: 1,
      pageNum: 8,
      totalPages,
      totalQuestionsLabel: '25',
      subTitleLabel: 'Master Knowledge Retrieval Quiz (Questions 1–25)',
      pageLocatorFn: (idx) => `Page ${idx + 3} · Stages 1–5`,
    });
    bodyAndBackHtml = `${lessonPgs}\n${quizPg}`;
  } else if (tmpl === '12p_extended') {
    const lessonPgs = lessons
      .map((l, i) => renderSinglePageLessonHtml(cfg, l, i, i + 3, totalPages, false))
      .join('\n');
    const refPg = renderReferencePageHtml(cfg, 10, totalPages);
    const quizPg1 = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons.slice(0, 4),
      startLessonIdx: 0,
      startQuestionNum: 1,
      pageNum: 11,
      totalPages,
      totalQuestionsLabel: '35',
      subTitleLabel: 'Master Knowledge Retrieval Quiz · Part I (Questions 1–20)',
      pageLocatorFn: (idx) => `Page ${idx + 3} · Stages 1–5`,
    });
    const quizPg2 = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons.slice(4),
      startLessonIdx: 4,
      startQuestionNum: 21,
      pageNum: 12,
      totalPages,
      totalQuestionsLabel: '35',
      subTitleLabel: 'Master Knowledge Retrieval Quiz · Part II (Questions 21–35)',
      pageLocatorFn: (idx) => `Page ${idx + 3} · Stages 1–5`,
    });
    bodyAndBackHtml = `${lessonPgs}\n${refPg}\n${quizPg1}\n${quizPg2}`;
  } else if (tmpl === '12p_4spreads') {
    const spreadPgs = lessons
      .map((l, i) => renderTwoPageSpreadLessonHtml(cfg, l, i, 4 + i * 2, totalPages))
      .join('\n');
    const quizPg = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons,
      startLessonIdx: 0,
      startQuestionNum: 1,
      pageNum: 12,
      totalPages,
      totalQuestionsLabel: '20',
      subTitleLabel: 'Master Knowledge Retrieval Quiz (Questions 1–20)',
      pageLocatorFn: spreadLoc,
    });
    bodyAndBackHtml = `${spreadPgs}\n${quizPg}`;
  } else if (tmpl === '12p_3spreads') {
    const spreadPgs = lessons
      .map((l, i) => renderTwoPageSpreadLessonHtml(cfg, l, i, 4 + i * 2, totalPages))
      .join('\n');
    const vocabPg = renderKs2VocabPageHtml(cfg, lessons, 10, totalPages, false);
    const quizPg1 = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons.slice(0, 2),
      startLessonIdx: 0,
      startQuestionNum: 1,
      pageNum: 11,
      totalPages,
      totalQuestionsLabel: '24',
      subTitleLabel: 'Master Knowledge Retrieval Quiz · Part I (Questions 1–12)',
      pageLocatorFn: spreadLoc,
      questionsPerLesson: 6,
    });
    const l3Title = stripTrailingDate(cleanLessonTitle(lessons[2].title));
    const l3Qs = pickLessonRecallQuestions(lessons[2], 12);
    const quizPg2 = renderQuizPageHtml({
      cfg,
      lessonSlice: [],
      startLessonIdx: 2,
      startQuestionNum: 13,
      pageNum: 12,
      totalPages,
      totalQuestionsLabel: '24',
      subTitleLabel: 'Master Knowledge Retrieval Quiz · Part II (Questions 13–24)',
      pageLocatorFn: spreadLoc,
      customCards: [
        {
          pillCode: 'E3A',
          heading: `Enquiry 03 (Part A): ${l3Title}`,
          locator: spreadLoc(2),
          questions: l3Qs.slice(0, 6),
        },
        {
          pillCode: 'E3B',
          heading: `Enquiry 03 (Part B): ${l3Title}`,
          locator: spreadLoc(2),
          questions: l3Qs.slice(6, 12),
        },
      ],
    });
    bodyAndBackHtml = `${spreadPgs}\n${vocabPg}\n${quizPg1}\n${quizPg2}`;
  } else if (tmpl === '16p_5spreads') {
    const spreadPgs = lessons
      .map((l, i) => renderTwoPageSpreadLessonHtml(cfg, l, i, 4 + i * 2, totalPages))
      .join('\n');
    const vocabPg = renderKs2VocabPageHtml(cfg, lessons, 14, totalPages, false);
    const quizPg1 = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons.slice(0, 3),
      startLessonIdx: 0,
      startQuestionNum: 1,
      pageNum: 15,
      totalPages,
      totalQuestionsLabel: '30',
      subTitleLabel: 'Master Knowledge Retrieval Quiz · Part I (Questions 1–18)',
      pageLocatorFn: spreadLoc,
      questionsPerLesson: 6,
    });
    const quizPg2 = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons.slice(3),
      startLessonIdx: 3,
      startQuestionNum: 19,
      pageNum: 16,
      totalPages,
      totalQuestionsLabel: '30',
      subTitleLabel: 'Master Knowledge Retrieval Quiz · Part II (Questions 19–30)',
      pageLocatorFn: spreadLoc,
      questionsPerLesson: 6,
    });
    bodyAndBackHtml = `${spreadPgs}\n${vocabPg}\n${quizPg1}\n${quizPg2}`;
  } else if (tmpl === '16p_spreads') {
    const spreadPgs = lessons
      .map((l, i) => renderTwoPageSpreadLessonHtml(cfg, l, i, 4 + i * 2, totalPages))
      .join('\n');
    const quizPg = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons,
      startLessonIdx: 0,
      startQuestionNum: 1,
      pageNum: 16,
      totalPages,
      totalQuestionsLabel: '30',
      subTitleLabel: 'Master Knowledge Retrieval Quiz (Questions 1–30)',
      pageLocatorFn: spreadLoc,
      twoColCards: true,
    });
    bodyAndBackHtml = `${spreadPgs}\n${quizPg}`;
  } else if (tmpl === '16p_ks2') {
    const lessonPgs = lessons
      .map((l, i) => renderSinglePageLessonHtml(cfg, l, i, i + 3, totalPages, true))
      .join('\n');
    const quizPg1 = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons.slice(0, 6),
      startLessonIdx: 0,
      startQuestionNum: 1,
      pageNum: 14,
      totalPages,
      totalQuestionsLabel: '55',
      subTitleLabel: 'Partner Knowledge Retrieval Quiz · Part I (Questions 1–30)',
      pageLocatorFn: (idx) => `Page ${idx + 3}`,
      isKs2: true,
    });
    const quizPg2 = renderQuizPageHtml({
      cfg,
      lessonSlice: lessons.slice(6),
      startLessonIdx: 6,
      startQuestionNum: 31,
      pageNum: 15,
      totalPages,
      totalQuestionsLabel: '55',
      subTitleLabel: 'Partner Knowledge Retrieval Quiz · Part II (Questions 31–55)',
      pageLocatorFn: (idx) => `Page ${idx + 3}`,
      isKs2: true,
    });
    const vocabPg = renderKs2VocabPageHtml(cfg, lessons, 16, totalPages);
    bodyAndBackHtml = `${lessonPgs}\n${quizPg1}\n${quizPg2}\n${vocabPg}`;
  }

  const css = `
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    :root {
      --acc: ${cfg.accent};
      --acc-dark: ${cfg.accentDark};
      --acc-soft: ${cfg.accentSoft};
      --acc-tint: ${cfg.accentTint};
      --sec: ${cfg.secondary};
      --navy: #0f172a;
      --ink: #1e293b;
    }
    html, body { background: #cbd5e1; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: var(--navy); }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      margin: 0 auto 8mm auto;
      padding: 9.5mm 12.5mm 8.5mm 12.5mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .page:last-of-type {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    @media print {
      html, body { background: #ffffff; }
      .page { margin: 0; box-shadow: none; }
    }

    .ftr {
      height: 19px;
      flex: 0 0 19px;
      border-top: 1.5px solid var(--navy);
      padding-top: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.4pt;
      color: #475569;
      font-weight: 600;
    }
    .ftr > span:first-child { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ftr .pg { font-weight: 800; color: var(--navy); white-space: nowrap; flex-shrink: 0; margin-left: 10px; }

    /* ================= PAGE 1: COVER ================= */
    .cover-body-wrap { min-height: 0; }
    .cover-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.2pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--acc-dark);
      border-bottom: 2px solid var(--navy);
      padding-bottom: 4px;
      margin-bottom: 9px;
      text-transform: uppercase;
    }
    .cover-hero-grid {
      display: grid;
      grid-template-columns: 1.02fr 0.98fr;
      gap: 11px;
      height: 92mm;
      margin-bottom: 11px;
    }
    .cover-wide-title {
      background: var(--navy);
      color: #ffffff;
      border-radius: 8px;
      padding: 11px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 4px solid var(--acc);
      margin-bottom: 8px;
    }
    .cover-wide-art {
      background: var(--navy);
      border-radius: 8px;
      overflow: hidden;
      border: 1.5px solid var(--navy);
      margin-bottom: 10px;
    }
    .cover-wide-img-wrap {
      width: 100%;
      height: 68mm;
      background: #0b1120;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .cover-wide-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
      display: block;
    }
    .cover-title-card {
      background: var(--navy);
      color: #ffffff;
      border-radius: 8px;
      padding: 15px 17px 13px 17px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-bottom: 4px solid var(--acc);
    }
    .cover-kicker {
      font-size: 7.4pt;
      font-weight: 800;
      letter-spacing: 0.11em;
      color: #fbbf24;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .cover-h1 {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 22pt;
      font-weight: 900;
      line-height: 1.08;
      color: #ffffff;
    }
    .cover-period {
      font-size: 15pt;
      font-weight: 900;
      color: #38bdf8;
      margin-top: 4px;
    }
    .cover-sub {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 9.6pt;
      line-height: 1.36;
      color: #e2e8f0;
      margin-top: 7px;
    }
    .cover-meta-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 8px;
    }
    .meta-chip {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.22);
      color: #f8fafc;
      font-size: 6.9pt;
      font-weight: 700;
      padding: 3px 7px;
      border-radius: 4px;
    }
    .cover-art-card {
      background: var(--navy);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1.5px solid var(--navy);
    }
    .cover-art-frame {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .cover-art-frame img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .cover-art-cap {
      background: var(--navy);
      color: #e2e8f0;
      font-size: 6.9pt;
      line-height: 1.32;
      padding: 5.5px 9px;
      border-top: 2px solid var(--acc);
    }

    .cover-synopsis-card {
      background: #fdfbf7;
      border: 1.5px solid #e2d9cc;
      border-left: 4.5px solid var(--acc);
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 10px;
    }
    .syn-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .syn-kicker {
      font-size: 7.6pt;
      font-weight: 900;
      letter-spacing: 0.1em;
      color: var(--acc-dark);
      text-transform: uppercase;
    }
    .syn-tag { font-size: 7.1pt; font-weight: 700; color: #64748b; }
    .syn-body {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 10.6pt;
      line-height: 1.5;
      color: var(--ink);
      text-align: justify;
    }

    .cover-dir-wrap {
      border: 1.5px solid var(--navy);
      border-radius: 6px;
      overflow: hidden;
    }
    .dir-banner {
      background: var(--navy);
      color: #ffffff;
      padding: 6px 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.6pt;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .dir-sub-note { font-size: 7.0pt; font-weight: 600; letter-spacing: 0; color: #cbd5e1; }

    .dir-table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
    }
    .dir-table th {
      background: #f1f5f9;
      color: #334155;
      font-size: 7.1pt;
      font-weight: 800;
      letter-spacing: 0.06em;
      padding: 5.5px 10px;
      text-align: left;
      border-bottom: 1.5px solid #cbd5e1;
    }
    .dir-table td {
      padding: 11px 10px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    .dir-table.dir-table-dense td { padding: 7px 9px; }
    .dir-table tr:last-child td { border-bottom: none; }
    .dir-table tr:nth-child(even) td { background: #f8fafc; }
    .code-pill {
      display: inline-block;
      background: var(--acc);
      color: #ffffff;
      font-size: 7.2pt;
      font-weight: 900;
      letter-spacing: 0.04em;
      padding: 2.5px 7px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .dir-title {
      font-size: 9.5pt;
      font-weight: 800;
      color: var(--navy);
      line-height: 1.24;
    }
    .dir-table-dense .dir-title { font-size: 8.9pt; }
    .dir-eq {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 8.5pt;
      color: #475569;
      margin-top: 2px;
      line-height: 1.28;
    }
    .dir-table-dense .dir-eq { font-size: 8.0pt; }
    .dir-date {
      font-size: 7.8pt;
      font-weight: 800;
      color: var(--acc-dark);
      white-space: nowrap;
    }
    .dir-pg {
      font-size: 8.6pt;
      font-weight: 900;
      color: var(--navy);
      white-space: nowrap;
    }

    /* Compact 2-Column TOC for 11-Lesson KS2 */
    .dir-compact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: #ffffff;
    }
    .dir-compact-item {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
    }
    .dir-compact-item:nth-child(2n) { border-right: none; }
    .dir-compact-tt {
      flex: 1;
      font-size: 8.4pt;
      font-weight: 700;
      color: var(--navy);
      line-height: 1.2;
    }
    .dir-compact-pg {
      font-size: 8.0pt;
      font-weight: 900;
      color: var(--acc-dark);
      white-space: nowrap;
    }

    /* ================= SUBPAGE HEADERS ================= */
    .subpage-hdr {
      display: flex;
      align-items: stretch;
      gap: 9px;
      margin-bottom: 6px;
    }
    .subpage-num {
      width: 60px;
      background: var(--acc);
      color: #ffffff;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3px 2px;
      flex-shrink: 0;
    }
    .subpage-num small { font-size: 6.1pt; font-weight: 800; letter-spacing: 0.08em; opacity: 0.92; }
    .subpage-num span { font-size: 16.5pt; font-weight: 900; line-height: 1.1; }
    .subpage-tt {
      flex: 1;
      border-bottom: 3px solid var(--acc);
      padding-bottom: 3px;
    }
    .subpage-kicker {
      font-size: 7.1pt;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--acc-dark);
      text-transform: uppercase;
    }
    .subpage-tt h2 {
      font-size: 13.8pt;
      font-weight: 900;
      color: var(--navy);
      line-height: 1.18;
      margin-top: 1px;
    }
    .subpage-pill {
      align-self: center;
      background: var(--navy);
      color: #ffffff;
      font-size: 8.0pt;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }

    /* ================= PAGE 2: CHRONOLOGY SPINE ================= */
    .spine-main, .ref-main, .quiz-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .spine-lead {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 8.9pt;
      color: #475569;
      margin-bottom: 7px;
    }
    .ms-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      min-height: 0;
      padding: 2px 0;
    }
    .ms-line {
      position: absolute;
      left: 108px;
      top: 12px;
      bottom: 12px;
      width: 2.5px;
      background: var(--acc);
      z-index: 1;
    }
    .ms-row {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    .ms-date-col {
      width: 96px;
      text-align: right;
      padding-right: 8px;
      flex-shrink: 0;
    }
    .ms-date-pill {
      display: inline-block;
      background: var(--acc-soft);
      color: var(--acc-dark);
      font-size: 7.0pt;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--acc);
    }
    .ms-dot-col {
      width: 26px;
      display: flex;
      justify-content: center;
      flex-shrink: 0;
    }
    .ms-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--acc);
      color: #ffffff;
      font-size: 7.0pt;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 1.5px var(--acc);
    }
    .ms-card {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid var(--acc);
      border-radius: 5px;
      padding: 6px 10px;
      margin-left: 6px;
    }
    .ms-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }
    .ms-title { font-size: 9.3pt; font-weight: 800; color: var(--navy); }
    .ms-stage-tag {
      font-size: 6.9pt;
      font-weight: 800;
      color: var(--sec);
      background: #e0f2fe;
      padding: 1px 6px;
      border-radius: 3px;
      white-space: nowrap;
    }
    .ms-desc {
      font-family: 'Lora', Georgia, serif;
      font-size: 9.0pt;
      line-height: 1.35;
      color: #334155;
    }

    /* ================= LESSON PAGES ================= */
    .lesson-top { flex: 0 0 auto; margin-bottom: 8px; }
    .hdr { display: flex; align-items: stretch; gap: 9px; }
    .hdr-num {
      width: 54px;
      border-radius: 6px;
      background: var(--acc);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3px 0;
      flex-shrink: 0;
    }
    .hdr-num small { font-size: 6.1pt; letter-spacing: 0.1em; font-weight: 800; opacity: 0.92; }
    .hdr-num span { font-size: 18pt; font-weight: 900; line-height: 1.1; }
    .hdr-tt {
      flex: 1;
      min-width: 0;
      border-bottom: 3px solid var(--acc);
      padding-bottom: 3px;
    }
    .hdr-kt {
      font-size: 6.9pt;
      font-weight: 800;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--acc-dark);
    }
    .hdr-h2 {
      font-size: 13.8pt;
      line-height: 1.16;
      font-weight: 900;
      color: var(--navy);
      margin-top: 1px;
    }
    .hdr-dt {
      align-self: center;
      font-size: 8.0pt;
      font-weight: 800;
      background: var(--acc);
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 999px;
      white-space: nowrap;
    }

    .flow {
      display: grid;
      gap: 4px;
      margin-top: 6px;
    }
    .flow-st {
      background: #f1f5f9;
      border-top: 2.8px solid var(--acc);
      border-radius: 3px;
      padding: 4px 6px 4.5px 6px;
      min-width: 0;
    }
    .flow-st:nth-child(even) { background: #e8eef6; }
    .flow-kicker {
      font-size: 6.1pt;
      font-weight: 900;
      letter-spacing: 0.03em;
      color: var(--acc-dark);
      text-transform: uppercase;
      line-height: 1.18;
    }
    .flow-lbl {
      font-size: 7.0pt;
      font-weight: 700;
      line-height: 1.22;
      color: var(--navy);
      margin-top: 1.5px;
    }

    .eq-bar {
      margin-top: 5px;
      background: var(--acc-tint);
      border: 1px solid var(--acc-soft);
      border-left: 3.5px solid var(--acc);
      border-radius: 4px;
      padding: 3.5px 8px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .eq-pill {
      background: var(--acc);
      color: #ffffff;
      font-size: 6.3pt;
      font-weight: 900;
      letter-spacing: 0.07em;
      padding: 1.5px 6px;
      border-radius: 3px;
      white-space: nowrap;
    }
    .eq-txt {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-weight: 700;
      font-size: 9.0pt;
      color: var(--navy);
      line-height: 1.25;
    }

    .prose-wrap {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .prose-columns {
      column-count: 2;
      column-gap: 18px;
      column-rule: 1px solid #e2e8f0;
      column-fill: balance;
    }
    /* KS2 Single Wide-Margin Column Standard */
    .prose-single-wide {
      width: 100%;
      max-width: 164mm;
      margin: 2px auto 0 auto;
    }
    .block-section {
      break-inside: auto;
      margin-bottom: 8px;
    }
    .block-hdr {
      break-after: avoid;
      break-inside: avoid;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1.2px solid #cbd5e1;
      padding-bottom: 2px;
      margin-bottom: 3.5px;
    }
    .stage-pill {
      background: var(--navy);
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 900;
      letter-spacing: 0.05em;
      padding: 1.5px 6px;
      border-radius: 3px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .block-title {
      font-size: 8.6pt;
      font-weight: 800;
      color: var(--navy);
      line-height: 1.18;
      flex: 1;
    }
    .page-lesson-ks2 .block-title { font-size: 10.0pt; }
    .block-date {
      font-size: 6.8pt;
      font-weight: 800;
      color: var(--acc-dark);
      background: var(--acc-soft);
      padding: 1px 5px;
      border-radius: 3px;
      white-space: nowrap;
    }
    .spread-stage-q {
      font-family: 'Playfair Display', Georgia, serif;
      font-style: italic;
      font-size: 9.2pt;
      color: var(--acc-dark);
      margin-bottom: 5px;
      line-height: 1.3;
    }
    .block-prose .prose-p {
      font-family: 'Lora', Georgia, serif;
      font-size: 11.2pt;
      line-height: 1.52;
      color: var(--ink);
      margin-bottom: 5px;
      text-align: justify;
      hyphens: auto;
    }
    .page-lesson-ks2 .block-prose .prose-p { text-align: left; hyphens: none; }
    .block-prose .prose-p:last-child { margin-bottom: 0; }
    .block-prose strong { font-weight: 700; color: #0b1324; }

    /* ================= REFERENCE DOSSIER & VOCAB PAGES ================= */
    .ref-sec-label {
      background: var(--navy);
      color: #ffffff;
      font-size: 7.4pt;
      font-weight: 900;
      letter-spacing: 0.09em;
      padding: 4px 10px;
      border-radius: 4px;
      margin-bottom: 7px;
      margin-top: 4px;
    }
    .ref-figs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .ref-fig-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid var(--acc);
      border-radius: 5px;
      padding: 8px 10px;
    }
    .ref-fig-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 3px;
    }
    .ref-fig-name { font-size: 9.2pt; font-weight: 800; color: var(--navy); }
    .ref-fig-role {
      font-size: 6.9pt;
      font-weight: 800;
      color: var(--acc-dark);
      background: var(--acc-soft);
      padding: 1px 5px;
      border-radius: 3px;
      white-space: nowrap;
    }
    .ref-fig-desc {
      font-family: 'Lora', Georgia, serif;
      font-size: 8.8pt;
      line-height: 1.38;
      color: #334155;
    }
    .ref-terms-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
      flex: 1;
      align-content: start;
    }
    .ref-term-row {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-top: 2.5px solid var(--sec);
      border-radius: 4px;
      padding: 7px 9px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .ref-term-k { font-size: 8.8pt; font-weight: 800; color: var(--navy); }
    .ref-term-v { font-family: 'Lora', Georgia, serif; font-size: 8.5pt; line-height: 1.35; color: #334155; }

    .vocab-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .vocab-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid var(--acc);
      border-radius: 5px;
      padding: 7.5px 10px;
    }
    .vocab-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }
    .vocab-word { font-size: 9.6pt; font-weight: 800; color: var(--navy); }
    .vocab-loc {
      font-size: 7.0pt;
      font-weight: 800;
      color: var(--acc-dark);
      background: var(--acc-soft);
      padding: 1px 6px;
      border-radius: 3px;
    }
    .vocab-def {
      font-family: 'Lora', Georgia, serif;
      font-size: 9.0pt;
      line-height: 1.36;
      color: var(--ink);
    }

    /* ================= QUIZ PAGES ================= */
    .quiz-inst {
      background: var(--acc-tint);
      border: 1px solid var(--acc-soft);
      border-left: 3.5px solid var(--acc);
      border-radius: 5px;
      padding: 6px 10px;
      font-size: 8.0pt;
      line-height: 1.38;
      color: var(--navy);
      margin-bottom: 8px;
    }
    .quiz-grid {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 9px;
    }
    .quiz-grid.quiz-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .quiz-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid var(--acc);
      border-radius: 5px;
      padding: 9px 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .quiz-card-hdr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3.5px;
      margin-bottom: 5px;
    }
    .quiz-card-tt {
      font-size: 9.0pt;
      font-weight: 800;
      color: var(--navy);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .quiz-e-pill {
      background: var(--acc);
      color: #ffffff;
      font-size: 7.0pt;
      font-weight: 900;
      padding: 1.5px 6px;
      border-radius: 3px;
      flex-shrink: 0;
    }
    .quiz-card-loc {
      font-size: 7.4pt;
      font-weight: 800;
      color: var(--acc-dark);
      white-space: nowrap;
    }
    .quiz-ol {
      padding-left: 19px;
      font-family: 'Lora', Georgia, serif;
      font-size: 10.2pt;
      line-height: 1.46;
      color: var(--ink);
    }
    .quiz-ol li { margin-bottom: 3px; }
    .quiz-ol li:last-child { margin-bottom: 0; }
  `;

  return {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(cfg.coverTitle)} (${esc(cfg.period)}) · Classroom Textbook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
  <style>${css}</style>
</head>
<body>
${page1Html}
${page2Html}
${bodyAndBackHtml}
</body>
</html>`,
    lessons,
    totalPages,
  };
}

async function calibrateAndAuditInBrowser(page) {
  return page.evaluate(() => {
    // 0. Calibrate Page 1 Cover (scale UP if extra space, or DOWN if tight)
    const coverPg = document.querySelector('.page-cover');
    if (coverPg) {
      const ftr = coverPg.querySelector('.ftr');
      const wrap = coverPg.querySelector('.cover-body-wrap');
      const tds = Array.from(coverPg.querySelectorAll('.dir-table td'));
      const compactItems = Array.from(coverPg.querySelectorAll('.dir-compact-item'));
      const compactTitles = Array.from(coverPg.querySelectorAll('.dir-compact-tt'));
      const wideImgWrap = coverPg.querySelector('.cover-wide-img-wrap');
      const syn = coverPg.querySelector('.syn-body');
      const heroGrid = coverPg.querySelector('.cover-hero-grid');
      if (tds.length && wrap && ftr) {
        let bestCover = null;
        for (let pad = 4.5; pad <= 20.0; pad += 0.5) {
          const synPt = Math.min(11.4, 9.5 + (pad - 4.5) * 0.14);
          const hMm = Math.round(84 + (pad - 4.5) * 1.4);
          const wideMm = Math.round(58 + (pad - 4.5) * 2.1);
          tds.forEach((td) => { td.style.padding = `${pad.toFixed(1)}px 10px`; });
          if (syn) syn.style.fontSize = synPt.toFixed(2) + 'pt';
          if (heroGrid && tds.length <= 24) {
            heroGrid.style.height = hMm + 'mm';
          }
          if (wideImgWrap) {
            wideImgWrap.style.height = wideMm + 'mm';
          }
          const clr = ftr.getBoundingClientRect().top - wrap.getBoundingClientRect().bottom;
          if (coverPg.scrollHeight <= coverPg.clientHeight + 1 && clr >= 14) {
            bestCover = { pad, synPt, hMm, wideMm };
          }
        }
        if (bestCover) {
          tds.forEach((td) => { td.style.padding = `${bestCover.pad.toFixed(1)}px 10px`; });
          if (syn) syn.style.fontSize = bestCover.synPt.toFixed(2) + 'pt';
          if (heroGrid && tds.length <= 24) heroGrid.style.height = bestCover.hMm + 'mm';
          if (wideImgWrap) wideImgWrap.style.height = bestCover.wideMm + 'mm';
        }
      } else if (compactItems.length && wrap && ftr) {
        let bestCompact = null;
        for (let step = 0; step <= 24; step++) {
          const t = step / 24;
          const padV = (6.5 + t * 8.0).toFixed(1);
          const ttPt = (8.4 + t * 1.3).toFixed(2);
          const synPt = (9.6 + t * 1.6).toFixed(2);
          const imgMm = Math.round(54 + t * 28);
          compactItems.forEach((el) => { el.style.padding = `${padV}px 11px`; });
          compactTitles.forEach((el) => { el.style.fontSize = `${ttPt}pt`; });
          if (syn) syn.style.fontSize = `${synPt}pt`;
          if (wideImgWrap) wideImgWrap.style.height = `${imgMm}mm`;
          const clr = ftr.getBoundingClientRect().top - wrap.getBoundingClientRect().bottom;
          if (coverPg.scrollHeight <= coverPg.clientHeight + 1 && clr >= 14) {
            bestCompact = { padV, ttPt, synPt, imgMm };
          }
        }
        if (bestCompact) {
          compactItems.forEach((el) => { el.style.padding = `${bestCompact.padV}px 11px`; });
          compactTitles.forEach((el) => { el.style.fontSize = `${bestCompact.ttPt}pt`; });
          if (syn) syn.style.fontSize = `${bestCompact.synPt}pt`;
          if (wideImgWrap) wideImgWrap.style.height = `${bestCompact.imgMm}mm`;
        }
      }
    }

    // 1. Calibrate Lesson Pages (Single-page KS3, Single-column KS2, and Two-page Spreads)
    document.querySelectorAll('.page-lesson').forEach((pg) => {
      const isKs2 = pg.classList.contains('page-lesson-ks2');
      const isSpread = pg.classList.contains('page-spread');
      const ftr = pg.querySelector('.ftr');
      const cols = pg.querySelector('.prose-columns, .prose-single-wide');
      const paras = Array.from(pg.querySelectorAll('.block-prose .prose-p'));
      const secs = Array.from(pg.querySelectorAll('.block-section'));
      if (!ftr || !cols || !paras.length) return;

      const minPt = isSpread ? 11.2 : isKs2 ? 11.2 : 9.8;
      const maxPt = isSpread ? 12.8 : isKs2 ? 13.4 : 12.1;

      let chosen = null;
      for (let pt = minPt; pt <= maxPt; pt += 0.05) {
        const t = (pt - minPt) / Math.max(0.5, maxPt - minPt);
        const lh = ((isKs2 ? 1.56 : 1.38) + t * 0.18).toFixed(2);
        const secMb = ((isKs2 ? 9.0 : 4.5) + t * (isSpread ? 8.0 : 5.5)).toFixed(1);
        const pMb = (3.0 + t * 3.5).toFixed(1);

        paras.forEach((p) => {
          p.style.fontSize = pt.toFixed(2) + 'pt';
          p.style.lineHeight = lh;
          p.style.marginBottom = p.nextElementSibling ? pMb + 'px' : '0px';
        });
        secs.forEach((s) => {
          s.style.marginBottom = s.nextElementSibling ? secMb + 'px' : '0px';
        });

        const ftrTop = ftr.getBoundingClientRect().top;
        const childBottom = Math.max(
          cols.getBoundingClientRect().bottom,
          ...Array.from(cols.querySelectorAll('p, .block-hdr')).map((el) => el.getBoundingClientRect().bottom)
        );
        const clearance = ftrTop - childBottom;
        const pageOverflow = pg.scrollHeight - pg.clientHeight;
        const horizOverflow = cols.scrollWidth - cols.clientWidth;

        if (pageOverflow <= 1 && horizOverflow <= 2 && clearance >= 14) {
          chosen = { pt, lh, secMb, pMb, clearance: Math.round(clearance) };
        }
      }

      if (chosen) {
        paras.forEach((p) => {
          p.style.fontSize = chosen.pt.toFixed(2) + 'pt';
          p.style.lineHeight = chosen.lh;
          p.style.marginBottom = p.nextElementSibling ? chosen.pMb + 'px' : '0px';
        });
        secs.forEach((s) => {
          s.style.marginBottom = s.nextElementSibling ? chosen.secMb + 'px' : '0px';
        });
      }
    });

    // 2. Calibrate Page 2 Milestones
    const spinePg = document.querySelector('.page-spine');
    if (spinePg) {
      const ftr = spinePg.querySelector('.ftr');
      const list = spinePg.querySelector('.ms-list');
      const descs = Array.from(spinePg.querySelectorAll('.ms-desc'));
      const cards = Array.from(spinePg.querySelectorAll('.ms-card'));
      let sz = 9.1;
      while (
        sz > 7.3 &&
        (spinePg.scrollHeight > spinePg.clientHeight + 1 ||
          list.getBoundingClientRect().bottom > ftr.getBoundingClientRect().top - 6)
      ) {
        sz -= 0.1;
        descs.forEach((d) => { d.style.fontSize = sz.toFixed(1) + 'pt'; });
        cards.forEach((c) => { c.style.padding = '4px 9px'; });
      }
    }

    // 3. Calibrate Reference / Vocab Pages (scale UP cleanly to fill page)
    document.querySelectorAll('.page-ref, .page-vocab').forEach((rPg) => {
      const ftr = rPg.querySelector('.ftr');
      const main = rPg.querySelector('.ref-main');
      const descs = Array.from(rPg.querySelectorAll('.ref-fig-desc, .ref-term-v, .vocab-def'));
      const cards = Array.from(rPg.querySelectorAll('.ref-fig-card, .ref-term-row, .vocab-card'));
      if (!ftr || !main || !descs.length) return;
      let best = null;
      for (let pt = 8.4; pt <= 10.6; pt += 0.1) {
        const t = (pt - 8.4) / 2.2;
        const padV = (6.5 + t * 5.5).toFixed(1);
        descs.forEach((d) => {
          d.style.fontSize = pt.toFixed(1) + 'pt';
          d.style.lineHeight = (1.34 + t * 0.14).toFixed(2);
        });
        cards.forEach((c) => { c.style.padding = `${padV}px 10px`; });
        const lastEl = cards[cards.length - 1];
        const bottom = lastEl ? lastEl.getBoundingClientRect().bottom : 0;
        const clearance = ftr.getBoundingClientRect().top - bottom;
        if (rPg.scrollHeight <= rPg.clientHeight + 1 && clearance >= 14) {
          best = { pt, padV, lh: (1.34 + t * 0.14).toFixed(2) };
        }
      }
      if (best) {
        descs.forEach((d) => {
          d.style.fontSize = best.pt.toFixed(1) + 'pt';
          d.style.lineHeight = best.lh;
        });
        cards.forEach((c) => { c.style.padding = `${best.padV}px 10px`; });
      }
    });

    // 4. Calibrate ALL Quiz Pages: SCALE UP font, spacing & padding to fill each page!
    document.querySelectorAll('.page-quiz').forEach((quizPg) => {
      const ftr = quizPg.querySelector('.ftr');
      const grid = quizPg.querySelector('.quiz-grid');
      const is2Col = grid && grid.classList.contains('quiz-grid-2col');
      const cards = Array.from(quizPg.querySelectorAll('.quiz-card'));
      const tts = Array.from(quizPg.querySelectorAll('.quiz-card-tt'));
      const ols = Array.from(quizPg.querySelectorAll('.quiz-ol'));
      const lis = Array.from(quizPg.querySelectorAll('.quiz-ol li'));
      if (!ftr || !grid || !cards.length) return;

      let bestQuiz = null;
      const minQ = is2Col ? 8.2 : 8.2;
      const maxQ = is2Col ? 11.4 : 12.2;
      for (let qPt = minQ; qPt <= maxQ; qPt += 0.05) {
        const t = (qPt - minQ) / (maxQ - minQ);
        const qLh = (1.30 + t * 0.24).toFixed(2);
        const padV = (5.0 + t * 8.0).toFixed(1);
        const gapPx = (5.0 + t * 7.0).toFixed(1);
        const liMb = (1.5 + t * 4.5).toFixed(1);
        const ttPt = (8.4 + t * 1.6).toFixed(2);

        grid.style.gap = gapPx + 'px';
        cards.forEach((c) => { c.style.padding = `${padV}px 12px`; });
        tts.forEach((tt) => { tt.style.fontSize = ttPt + 'pt'; });
        ols.forEach((o) => {
          o.style.fontSize = qPt.toFixed(2) + 'pt';
          o.style.lineHeight = qLh;
        });
        lis.forEach((li) => {
          li.style.marginBottom = li.nextElementSibling ? liMb + 'px' : '0px';
        });

        const ftrTop = ftr.getBoundingClientRect().top;
        const maxCardBottom = Math.max(...cards.map((c) => c.getBoundingClientRect().bottom));
        const clearance = ftrTop - maxCardBottom;
        const pageOverflow = quizPg.scrollHeight - quizPg.clientHeight;

        if (pageOverflow <= 1 && clearance >= 12) {
          bestQuiz = { qPt, qLh, padV, gapPx, liMb, ttPt };
        }
      }

      if (bestQuiz) {
        grid.style.gap = bestQuiz.gapPx + 'px';
        cards.forEach((c) => { c.style.padding = `${bestQuiz.padV}px 12px`; });
        tts.forEach((tt) => { tt.style.fontSize = bestQuiz.ttPt + 'pt'; });
        ols.forEach((o) => {
          o.style.fontSize = bestQuiz.qPt.toFixed(2) + 'pt';
          o.style.lineHeight = bestQuiz.qLh;
        });
        lis.forEach((li) => {
          li.style.marginBottom = li.nextElementSibling ? bestQuiz.liMb + 'px' : '0px';
        });
      }
    });

    // 5. Final Audit Report across all pages
    return Array.from(document.querySelectorAll('.page')).map((pg, idx) => {
      const ftr = pg.querySelector('.ftr');
      const firstPara = pg.querySelector('.block-prose .prose-p');
      const firstQuizOl = pg.querySelector('.quiz-ol');
      const vOverflow = pg.scrollHeight - pg.clientHeight;
      const hOverflow = pg.scrollWidth - pg.clientWidth;
      const truncatedFlows = Array.from(pg.querySelectorAll('.flow-st')).filter((st) =>
        /…|\.\.\./.test(st.textContent || '')
      ).length;
      const ragBoxes = pg.querySelectorAll('.rag-box').length;
      let clearance = 0;
      if (ftr) {
        const contentEl =
          pg.querySelector('.prose-columns, .prose-single-wide') ||
          pg.querySelector('.ms-list') ||
          pg.querySelector('.quiz-grid') ||
          pg.querySelector('.vocab-grid') ||
          pg.querySelector('.ref-terms-grid') ||
          pg.querySelector('.cover-dir-wrap');
        if (contentEl) {
          clearance = Math.round(ftr.getBoundingClientRect().top - contentEl.getBoundingClientRect().bottom);
        }
      }
      return {
        page: idx + 1,
        vOverflow,
        hOverflow,
        clearance,
        truncatedFlows,
        ragBoxes,
        bodyFontPt: firstPara ? firstPara.style.fontSize : firstQuizOl ? `Quiz ${firstQuizOl.style.fontSize}` : null,
      };
    });
  });
}

async function compileUnit(registryKey, browserInstance = null) {
  const cfg = TEXTBOOK_UNIT_REGISTRY[registryKey];
  if (!cfg) {
    throw new Error(`Booklet "${registryKey}" is not registered in master_textbook_registry.cjs`);
  }

  const targetUnitId = cfg.unitId || registryKey;
  const htmlNames = Array.isArray(cfg.htmlNames) && cfg.htmlNames.length ? cfg.htmlNames : ['textbook.html'];
  const pdfFileName = cfg.pdfName || `${targetUnitId}_textbook.pdf`;

  console.log(`\n============================================================`);
  console.log(`📘 COMPILING FULL-COLOUR CLASSROOM TEXTBOOK: [${registryKey}]`);
  console.log(`============================================================`);

  const { html, lessons, totalPages } = await buildUnitHtml(cfg);

  const forbiddenRx = new RegExp('meon' + 'cross', 'i');
  if (forbiddenRx.test(html.replace(/data:[^"]+/g, ''))) {
    throw new Error('Sanitization failure: prohibited school identifier detected!');
  }

  const pubUnitDir = path.join(PUBLIC_DIR, 'units', targetUnitId);
  const srcUnitDir = path.join(ROOT, 'units', targetUnitId);
  fs.mkdirSync(pubUnitDir, { recursive: true });
  fs.mkdirSync(srcUnitDir, { recursive: true });

  const pubHtmlPath = path.join(pubUnitDir, htmlNames[0]);
  const pdfOutPath = path.join(PUBLIC_DIR, 'pdfs', pdfFileName);
  const shotsDir = path.join(SHOTS_ROOT, `${registryKey}_textbook`);
  fs.mkdirSync(shotsDir, { recursive: true });

  fs.writeFileSync(pubHtmlPath, html, 'utf8');

  const ownsBrowser = !browserInstance;
  const browser =
    browserInstance ||
    (await puppeteer.launch({
      headless: 'new',
      executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'],
    }));

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.goto('file:///' + pubHtmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    const audit = await calibrateAndAuditInBrowser(page);
    audit.forEach((a) => {
      const fInfo = a.bodyFontPt ? ` · Lora ${a.bodyFontPt}` : '';
      console.log(
        `  Page ${String(a.page).padStart(2)}: vOverflow=${a.vOverflow}px, hOverflow=${a.hOverflow}px, clearance=${a.clearance}px${fInfo}`
      );
      if (a.vOverflow > 2 || a.hOverflow > 2 || a.clearance < -2 || a.truncatedFlows > 0 || a.ragBoxes > 0) {
        throw new Error(`Layout/QA violation on Page ${a.page}: ${JSON.stringify(a)}`);
      }
    });

    const calibratedHtml = await page.content();
    for (const hName of htmlNames) {
      fs.writeFileSync(path.join(pubUnitDir, hName), calibratedHtml, 'utf8');
      fs.writeFileSync(path.join(srcUnitDir, hName), calibratedHtml, 'utf8');
    }

    const pageEls = await page.$$('.page');
    for (let i = 0; i < pageEls.length; i++) {
      await pageEls[i].screenshot({
        path: path.join(shotsDir, `p${String(i + 1).padStart(2, '0')}.png`),
      });
    }

    await page.pdf({
      path: pdfOutPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    // Also keep KS2 nested subfolder PDF synced if present
    if (registryKey === 'ks2_ww2') {
      const nestedKs2 = path.join(PUBLIC_DIR, 'pdfs', 'ks2_ww2', 'ks2_ww2_textbook.pdf');
      if (fs.existsSync(path.dirname(nestedKs2))) {
        fs.copyFileSync(pdfOutPath, nestedKs2);
      }
    }

    await page.close();
  } finally {
    if (ownsBrowser) await browser.close();
  }

  // Post-Render Skia PDF Page-Count & Verbatim Block Sync Gate
  const pdfBuf = fs.readFileSync(pdfOutPath);
  const parsed = await pdfParse(pdfBuf);
  if (parsed.numpages !== totalPages) {
    throw new Error(
      `Skia PDF Spillover Gate Failed for ${registryKey}: expected ${totalPages} pages, got ${parsed.numpages}!`
    );
  }

  const normStr = (s) =>
    String(s || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/æ/gi, 'ae')
      .replace(/œ/gi, 'oe')
      .replace(/ø/gi, 'o')
      .replace(/ß/g, 'ss')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();

  const normPdf = normStr(parsed.text);
  let matchedBlocks = 0;
  let totalBlocks = 0;
  lessons.forEach((l) => {
    (l.narrative_blocks || []).forEach((b) => {
      totalBlocks++;
      const cleanTxt = normStr(stripTags(cleanProseHtml(b.content || b.text || '')));
      const headProbe = cleanTxt.slice(0, 45);
      const tailProbe = cleanTxt.slice(-45);
      if (headProbe && tailProbe && normPdf.includes(headProbe) && normPdf.includes(tailProbe)) {
        matchedBlocks++;
      }
    });
  });

  console.log(
    `✅ PDF Gate Passed: ${parsed.numpages}/${totalPages} pages · Verbatim Blocks: ${matchedBlocks}/${totalBlocks} · ${(pdfBuf.length / 1024).toFixed(0)} KB`
  );
  if (matchedBlocks !== totalBlocks) {
    throw new Error(`Verbatim sync gate failed for ${registryKey}: only ${matchedBlocks}/${totalBlocks} blocks matched!`);
  }

  if (cfg.desktopSandboxName) {
    for (const dDir of ['C:\\Users\\fives\\OneDrive\\Desktop', 'C:\\Users\\fives\\Desktop']) {
      if (fs.existsSync(dDir)) {
        const dest = path.join(dDir, cfg.desktopSandboxName);
        fs.copyFileSync(pdfOutPath, dest);
        console.log(`🖥️  Sandbox copy -> ${dest}`);
      }
    }
  }

  if (Array.isArray(cfg.driveTargets)) {
    for (const dt of cfg.driveTargets) {
      if (fs.existsSync(path.dirname(dt))) {
        fs.copyFileSync(pdfOutPath, dt);
        console.log(`☁️  Drive synced -> ${dt}`);
      }
    }
  }
}

function resolveTargets(args) {
  if (args[0] === 'all') return Object.keys(TEXTBOOK_UNIT_REGISTRY);
  if (args[0] === 'gcse') {
    return Object.keys(TEXTBOOK_UNIT_REGISTRY).filter((k) => Boolean(TEXTBOOK_UNIT_REGISTRY[k].editionId));
  }
  if (!args.length) return ['great_war', 'great_war_part2'];
  const out = [];
  for (const a of args) {
    if (TEXTBOOK_UNIT_REGISTRY[a]) {
      out.push(a);
    } else {
      const subKeys = Object.keys(TEXTBOOK_UNIT_REGISTRY).filter(
        (k) => TEXTBOOK_UNIT_REGISTRY[k].unitId === a
      );
      if (subKeys.length) out.push(...subKeys);
      else throw new Error(`Unknown textbook target "${a}"`);
    }
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const targets = resolveTargets(args);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'],
  });

  try {
    for (const unitId of targets) {
      await compileUnit(unitId, browser);
    }
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('\n❌ TEXTBOOK COMPILATION FAILED:', err.message);
    process.exit(1);
  });
}

module.exports = { compileUnit };
