/**
 * Pupil & Teacher Viral Share Links, Question Deep-Links & Schools Bridge
 * Zero-login, zero-PII clean URL sharing across WhatsApp, iMessage, Discord, Reddit, Teams & Classroom.
 */

import { SITE_ORIGIN, getCleanPathForLesson, getCleanPathForUnit } from '../data/seo_routes.js';

function getActiveLessonContext(explicitUnitId = null, explicitLessonIndex = null) {
  const unitId =
    explicitUnitId ||
    (typeof window !== 'undefined' &&
      ((window.appStore && window.appStore.state && window.appStore.state.selectedUnitId) ||
        window.currentUnitId ||
        (window.state && window.state.selectedUnitId))) ||
    '';

  const unitData =
    (typeof window !== 'undefined' &&
      ((window.appStore && window.appStore.state && window.appStore.state.activeUnitData) ||
        window.currentUnitData ||
        (typeof window.getUnitData === 'function' ? window.getUnitData(unitId) : null))) ||
    {};

  const lessons = unitData.lessons || unitData.subtopics || [];
  const lessonIndex =
    typeof explicitLessonIndex === 'number' && explicitLessonIndex >= 0
      ? explicitLessonIndex
      : typeof window !== 'undefined' && typeof window.currentLessonIndex === 'number'
        ? window.currentLessonIndex
        : 0;

  const lesson = lessons[lessonIndex] || null;
  const cleanTitle = String(lesson?.title || unitData?.title || 'History Revision')
    .replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '')
    .trim();

  return { unitId, unitData, lessons, lessonIndex, lesson, cleanTitle };
}

export function buildPublicShareUrl({ unitId = null, lessonIndex = null, questionNum = null } = {}) {
  const ctx = getActiveLessonContext(unitId, lessonIndex);
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const origin = isLocal ? window.location.origin : SITE_ORIGIN;

  let cleanPath = null;
  if (ctx.unitId && ctx.lesson) {
    cleanPath = getCleanPathForLesson(ctx.unitId, ctx.lesson, ctx.lessonIndex, ctx.lessons);
  }
  if (!cleanPath && ctx.unitId) {
    cleanPath = getCleanPathForUnit(ctx.unitId);
  }

  let urlObj;
  if (cleanPath) {
    urlObj = new URL(cleanPath, origin);
  } else if (typeof window !== 'undefined') {
    urlObj = new URL(window.location.pathname + window.location.search, origin);
    ['s', 'access', 'staff', 'teacher', 'passkey', 'preview', 'portal'].forEach((p) =>
      urlObj.searchParams.delete(p),
    );
  } else {
    urlObj = new URL('/', SITE_ORIGIN);
  }

  if (questionNum && Number(questionNum) > 0) {
    urlObj.searchParams.set('q', String(questionNum));
  }
  return urlObj.toString();
}

export function showShareToast(message) {
  if (typeof document === 'undefined') return;
  let toast = document.getElementById('hh-share-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hh-share-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText =
      'position:fixed;bottom:22px;right:22px;z-index:99999;background:#0f172a;color:#f8fafc;border:1.5px solid #10b981;border-radius:10px;padding:11px 16px;font-family:Inter,system-ui,sans-serif;font-size:0.86rem;font-weight:700;box-shadow:0 12px 28px rgba(15,23,42,0.38);display:flex;align-items:center;gap:9px;max-width:min(420px,calc(100vw - 32px));transform:translateY(14px);opacity:0;transition:opacity 0.2s ease,transform 0.2s ease;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#34d399;font-size:1rem;flex-shrink:0;"></i><span>${message}</span>`;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  clearTimeout(window.__hhShareToastTimer);
  window.__hhShareToastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(14px)';
  }, 2800);
}

function flashShareButtonFeedback(btnEl, copiedLabel = 'Copied!') {
  if (!btnEl || btnEl.dataset.flashActive === '1') return;
  btnEl.dataset.flashActive = '1';
  const prevHtml = btnEl.innerHTML;
  btnEl.innerHTML = `<i class="fa-solid fa-check" style="color:#10b981;"></i> <span>${copiedLabel}</span>`;
  setTimeout(() => {
    btnEl.innerHTML = prevHtml;
    delete btnEl.dataset.flashActive;
  }, 1900);
}

function copyExecFallback(text) {
  if (typeof document === 'undefined') return false;
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return true;
  } catch (e) {
    return false;
  }
}

async function copyTextSafe(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return copyExecFallback(text);
    }
  }
  return copyExecFallback(text);
}

async function triggerShareOrCopy({ title, text, url, btnEl, toastMsg, copiedBtnLabel }) {
  const isCoarsePointer =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(pointer: coarse)').matches;

  if (isCoarsePointer && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url });
      return url;
    } catch (err) {
      if (err && err.name === 'AbortError') return url;
    }
  }

  const payload = text ? `${text}\n${url}` : url;
  await copyTextSafe(payload);
  flashShareButtonFeedback(btnEl, copiedBtnLabel || 'Copied!');
  showShareToast(toastMsg || 'Clean lesson link copied to clipboard!');
  return url;
}

export function shareHubLesson(btnEl, explicitUnitId = null, explicitLessonIndex = null) {
  const ctx = getActiveLessonContext(explicitUnitId, explicitLessonIndex);
  const url = buildPublicShareUrl({ unitId: ctx.unitId, lessonIndex: ctx.lessonIndex });
  return triggerShareOrCopy({
    title: `${ctx.cleanTitle} | The History Revision Hub`,
    text: '',
    url,
    btnEl,
    copiedBtnLabel: 'Link Copied!',
    toastMsg: 'Clean lesson link copied — ready to share in WhatsApp, Teams, Classroom or Reddit!',
  });
}

export function shareHubQuestion(btnEl) {
  const ctx = getActiveLessonContext();
  let qNum = 1;
  if (btnEl && typeof document !== 'undefined') {
    const strip = btnEl.closest('details.wb-question-strip');
    if (strip) {
      const allStrips = Array.from(document.querySelectorAll('details.wb-question-strip'));
      const foundIdx = allStrips.indexOf(strip);
      if (foundIdx >= 0) qNum = foundIdx + 1;
    }
  }
  const url = buildPublicShareUrl({
    unitId: ctx.unitId,
    lessonIndex: ctx.lessonIndex,
    questionNum: qNum,
  });
  return triggerShareOrCopy({
    title: `Question ${qNum} & Model Answer — ${ctx.cleanTitle}`,
    text: '',
    url,
    btnEl,
    copiedBtnLabel: `Q${qNum} Copied!`,
    toastMsg: `Direct link to Question ${qNum} & Model Answer copied!`,
  });
}

export function shareHubChallengeScore(btnEl, mode = 'quiz', score = 0, total = 5) {
  const ctx = getActiveLessonContext();
  const url = buildPublicShareUrl({ unitId: ctx.unitId, lessonIndex: ctx.lessonIndex });
  const pct = total > 0 ? Math.round((score / total) * 100) : 100;
  const challengeText =
    mode === 'vocab'
      ? `⚡ I just mastered all key vocabulary on "${ctx.cleanTitle}" — test yourself here:`
      : mode === 'cloze'
        ? `⚡ I completed the Summary Cloze on "${ctx.cleanTitle}" with 100% accuracy — try it here:`
        : `🏆 I scored ${score}/${total} (${pct}%) on "${ctx.cleanTitle}" — can you beat my score?`;

  return triggerShareOrCopy({
    title: `${ctx.cleanTitle} | History Challenge`,
    text: challengeText,
    url,
    btnEl,
    copiedBtnLabel: 'Challenge Copied!',
    toastMsg: 'Challenge & link copied — paste it into your group chat to test a friend!',
  });
}

export function runPendingQuestionDeepLink() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const qRaw = params.get('q');
    if (!qRaw) return;
    const qNum = parseInt(qRaw, 10);
    if (isNaN(qNum) || qNum < 1) return;

    const allStrips = Array.from(document.querySelectorAll('details.wb-question-strip'));
    const targetStrip = allStrips[qNum - 1];
    if (!targetStrip) return;

    targetStrip.open = true;
    setTimeout(() => {
      targetStrip.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const prevOutline = targetStrip.style.boxShadow;
      targetStrip.style.transition = 'box-shadow 0.35s ease';
      targetStrip.style.boxShadow = '0 0 0 3px #f59e0b, 0 10px 26px rgba(245, 158, 11, 0.25)';
      setTimeout(() => {
        targetStrip.style.boxShadow = prevOutline || '';
      }, 2800);
    }, 140);
  } catch (e) {}
}

export function initShareUtilsGlobals() {
  if (typeof window !== 'undefined') {
    window.shareHubLesson = shareHubLesson;
    window.shareHubQuestion = shareHubQuestion;
    window.shareHubChallengeScore = shareHubChallengeScore;
    window.runPendingQuestionDeepLink = runPendingQuestionDeepLink;
  }
}

export function renderTopShareLessonBtnHTML(unitId, lessonIndex) {
  initShareUtilsGlobals();
  return `<button type="button" class="btn-quiet-copy-link no-print" onclick="window.shareHubLesson && window.shareHubLesson(this, '${unitId}', ${lessonIndex})" style="padding: 6px 9px; font-size: 0.82rem; background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; line-height: 1;" title="Copy clean link to this lesson" aria-label="Copy link to this lesson"><i class="fa-solid fa-link"></i></button>`;
}

export function renderQuestionShareBtnHTML() {
  return `<button type="button" onclick="window.shareHubQuestion && window.shareHubQuestion(this)" title="Copy direct link to this question &amp; model answer" style="background: #f8fafc; color: #334155; border: 1.5px solid #cbd5e1; padding: 5px 9px; border-radius: 7px; font-weight: 700; font-size: 0.79rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;"><i class="fa-solid fa-link" style="color: #059669;"></i> <span>Share</span></button>`;
}

export function renderTeacherSchoolsBridgeFooterHTML() {
  return `
    <div class="lesson-schools-bridge no-print" style="margin-top: 28px; padding: 11px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px; font-family: 'Inter', sans-serif; font-size: 0.83rem; color: #475569; text-align: center;">
      <span><i class="fa-solid fa-chalkboard-user" style="color: #1e3a8a; margin-right: 5px;"></i><strong style="color: #0f172a;">History Teacher?</strong> Explore matching print-ready A3 saddle-stitch Pupil Workbooks, Textbooks &amp; Walk-In Schemes of Work.</span>
      <a href="/schools/" onclick="if(window.switchView){event.preventDefault();window.switchView('schools');}" style="color: #1d4ed8; font-weight: 800; text-decoration: none; white-space: nowrap;">For Schools &rarr;</a>
    </div>
  `;
}

export function renderFurtherReadingShelfHTML(lesson, getAssetUrlFn) {
  if (!Array.isArray(lesson?.reading_shelf) || lesson.reading_shelf.length === 0) return '';
  const esc = (v) =>
    String(v || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  const escAttr = (v) => esc(v).replace(/"/g, '&quot;');
  const cards = lesson.reading_shelf
    .filter((item) => item && (item.title || item.cover))
    .map((item) => {
      const coverUrl = item.cover && typeof getAssetUrlFn === 'function' ? getAssetUrlFn(item.cover) : item.cover || '';
      return `<article class="reading-shelf-item">${
        coverUrl
          ? `<div class="reading-shelf-cover-wrap"><img src="${coverUrl}" alt="${escAttr(item.title || 'Book cover')}" class="archival-image reading-shelf-cover" data-action="open-modal" data-src="${coverUrl}" /></div>`
          : ''
      }<div class="reading-shelf-meta">${item.title ? `<h4 class="reading-shelf-book-title">${esc(item.title)}</h4>` : ''}${
        item.author ? `<div class="reading-shelf-author">${esc(item.author)}</div>` : ''
      }${item.perspective_note ? `<p class="reading-shelf-note">${esc(item.perspective_note)}</p>` : ''}</div></article>`;
    })
    .join('');
  if (!cards) return '';
  return `<section class="phase-card reading-shelf-card" aria-label="Further reading: two narratives"><div class="reading-shelf-header"><span class="reading-shelf-eyebrow">Historiography &amp; Memoir</span><h3 class="reading-shelf-heading">Further reading: two narratives</h3></div><div class="reading-shelf-grid">${cards}</div></section>`;
}

if (typeof window !== 'undefined') {
  window.shareHubLesson = shareHubLesson;
  window.shareHubQuestion = shareHubQuestion;
  window.shareHubChallengeScore = shareHubChallengeScore;
  window.runPendingQuestionDeepLink = runPendingQuestionDeepLink;
}
