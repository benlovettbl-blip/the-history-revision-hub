import { isVerifiedPdf } from '../verified_pdf_manifest.js';
import {
  UNIT_RESOURCES_CATALOG,
  getUnitCatalogEntry,
  isStaffModeActive,
  resolveCanonicalPdfUrl,
} from '../data/unit_resources_catalog.js';

/**
 * Unit Sticky Classroom Bar & On-Demand Resource Drawers
 *
 * Replaces the legacy 8-pill Hero Launchpad, duplicate "Visual Knowledge Architecture" strip,
 * giant Revision Guide promo banner, and orphan bottom Quizzing banner with ONE slim sticky bar:
 *   Left:  [ ▶ Resume Lesson ] + [ KT1 · KT2 · KT3 ] instant jump pills
 *   Right: [ 📄 PDFs & Booklets ▾ ] [ 🖼️ Infographics ▾ ] [ 🎮 Games, Quiz & Timeline ▾ ] [ 📝 Exam Practice ]
 */

export const CURRICULAR_PILLARS_CATALOG = UNIT_RESOURCES_CATALOG;

if (typeof window !== 'undefined') {
  window.openCurricularPillar = function (htmlUrl, title, pdfUrl, badge) {
    const resolvedPdf = resolveCanonicalPdfUrl(htmlUrl, pdfUrl);
    if (typeof window.openTeacherPrintPreview === 'function') {
      window.openTeacherPrintPreview(htmlUrl, title, resolvedPdf);
      return;
    }
    if (
      typeof window.openInPagePreview === 'function' &&
      document.getElementById('inpage-preview-console')
    ) {
      window.openInPagePreview(htmlUrl, title, resolvedPdf, { badge: badge || 'DOCUMENT' });
      return;
    }
    window.open(htmlUrl, '_blank');
  };

  window.toggleUnitResourceDrawer = function (panelKey) {
    const shell = document.getElementById('unit-sticky-drawer-shell');
    if (!shell) return;
    const current = shell.getAttribute('data-open-panel') || '';
    const next = current === panelKey ? '' : panelKey;
    shell.setAttribute('data-open-panel', next);
    shell.style.display = next ? 'block' : 'none';

    ['booklets', 'infographics', 'practice'].forEach((k) => {
      const panel = document.getElementById(`unit-drawer-panel-${k}`);
      const btn = document.getElementById(`unit-bar-btn-${k}`);
      if (panel) panel.style.display = k === next ? 'block' : 'none';
      if (btn) {
        if (k === next) {
          btn.style.background = '#2563eb';
          btn.style.borderColor = '#60a5fa';
          btn.style.color = '#ffffff';
        } else {
          btn.style.background = '#1e293b';
          btn.style.borderColor = '#475569';
          btn.style.color = '#f8fafc';
        }
      }
    });
  };

  window.openUnitResourceDrawer = function (unitId, panelKey = 'booklets') {
    const bar = document.getElementById('unit-sticky-classroom-bar');
    if (bar && window.currentLessonIndex === null) {
      const shell = document.getElementById('unit-sticky-drawer-shell');
      if (shell && shell.getAttribute('data-open-panel') !== panelKey) {
        window.toggleUnitResourceDrawer(panelKey);
      }
      return;
    }
    if (typeof window.switchView === 'function') {
      Promise.resolve(window.switchView('lessons', unitId)).then(() => {
        setTimeout(() => {
          window.toggleUnitResourceDrawer(panelKey);
        }, 120);
      });
    }
  };

  if (!window.__urbEscBound) {
    window.__urbEscBound = true;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const shell = document.getElementById('unit-sticky-drawer-shell');
        if (shell && shell.getAttribute('data-open-panel')) {
          window.toggleUnitResourceDrawer('');
        }
      }
    });
  }

  window.onDrawerEditionSelect = function (selectEl, unitId, bucketKey) {
    const cfg = getUnitCatalogEntry(unitId);
    const bucket = cfg && cfg[bucketKey];
    if (!bucket || !Array.isArray(bucket.editions)) return;
    const ed = bucket.editions.find((e) => e.id === selectEl.value) || bucket.editions[0];
    const card = selectEl.closest('.urb-booklet-card');
    if (!card || !ed) return;

    const pagesEl = card.querySelector('.urb-pages-badge');
    const readBtn = card.querySelector('.urb-btn-read');
    const pdfLink = card.querySelector('.urb-btn-pdf');
    const msBtn = card.querySelector('.urb-btn-ms');

    if (pagesEl && ed.pages) pagesEl.textContent = ed.pages;
    const safeTitle = String(ed.label || bucket.title || '').replace(/'/g, "\\'");

    if (readBtn) {
      readBtn.onclick = () => {
        window.openCurricularPillar(ed.htmlUrl, ed.label || bucket.title, ed.pdfUrl, bucket.label.toUpperCase());
      };
    }

    if (pdfLink) {
      if (ed.pdfUrl && (isVerifiedPdf(ed.pdfUrl) || bucketKey === 'literaryAnthology')) {
        pdfLink.href = ed.pdfUrl;
        pdfLink.setAttribute('download', ed.downloadName || ed.pdfUrl.split('/').pop());
        pdfLink.target = '_blank';
        pdfLink.onclick = null;
        pdfLink.innerHTML = '<i class="fa-solid fa-file-pdf" style="color:#dc2626;"></i> <span>PDF ↓</span>';
      } else {
        pdfLink.href = '#';
        pdfLink.removeAttribute('download');
        pdfLink.target = '';
        pdfLink.onclick = (ev) => {
          ev.preventDefault();
          window.openCurricularPillar(ed.htmlUrl, safeTitle, null, bucket.label.toUpperCase());
        };
        pdfLink.innerHTML = '<i class="fa-solid fa-print" style="color:#2563eb;"></i> <span>Print</span>';
      }
    }

    if (msBtn) {
      if (ed.msHtmlUrl || ed.msPdfUrl) {
        msBtn.style.display = 'inline-flex';
        msBtn.onclick = () => {
          if (ed.msPdfUrl && isVerifiedPdf(ed.msPdfUrl)) {
            window.open(ed.msPdfUrl, '_blank');
          } else if (ed.msHtmlUrl) {
            window.openCurricularPillar(ed.msHtmlUrl, `${ed.label} — Mark Scheme`, ed.msPdfUrl, 'MARK_SCHEME');
          }
        };
      } else {
        msBtn.style.display = 'none';
      }
    }
  };

  window.onDrawerWorksheetSelect = function (selectEl, unitId) {
    const cfg = getUnitCatalogEntry(unitId);
    if (!cfg || !Array.isArray(cfg.worksheets)) return;
    const ws = cfg.worksheets.find((w) => w.id === selectEl.value) || cfg.worksheets[0];
    const card = selectEl.closest('.urb-booklet-card');
    if (!card || !ws) return;
    const readBtn = card.querySelector('.urb-btn-read');
    const pdfLink = card.querySelector('.urb-btn-pdf');
    if (readBtn) {
      readBtn.onclick = () => window.openCurricularPillar(ws.htmlUrl, ws.label, ws.pdfUrl, 'WORKSHEET');
    }
    if (pdfLink && ws.pdfUrl) {
      pdfLink.href = ws.pdfUrl;
      pdfLink.setAttribute('download', ws.pdfUrl.split('/').pop());
    }
  };

  window.jumpToKeyTopicSection = function (ktId) {
    const el = document.getElementById(`kt-section-${ktId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
}

/**
 * Legacy Hero Curricular Launchpad retired so the Hero photograph stays clean and uncluttered.
 */
export function renderHeroCurricularLaunchpad() {
  return '';
}

export function openTextbookEditionPicker(unitId) {
  if (typeof window !== 'undefined' && window.openUnitResourceDrawer) {
    window.openUnitResourceDrawer(unitId, 'booklets');
  }
}

function renderBookletCard(unitId, bucketKey, bucket, accentColor, badgeClass, staffActive) {
  if (!bucket) return '';
  if (bucket.staffOnly && !staffActive) return '';

  const hasEditions = Array.isArray(bucket.editions) && bucket.editions.length > 1;
  const defaultItem = hasEditions ? bucket.editions[0] : bucket;
  const htmlUrl = defaultItem.htmlUrl || bucket.htmlUrl;
  const pdfUrl = defaultItem.pdfUrl || bucket.pdfUrl;
  const dlName = defaultItem.downloadName || bucket.downloadName || (pdfUrl ? pdfUrl.split('/').pop() : 'booklet.pdf');
  const pages = defaultItem.pages || bucket.pages || 'Booklet';
  const safeTitle = String(defaultItem.label || bucket.title || bucket.label).replace(/'/g, "\\'");
  const hasPdf = Boolean(
    pdfUrl && (isVerifiedPdf(pdfUrl) || bucketKey === 'literaryAnthology' || bucket.optionalBadge),
  );
  const badgeLabel = bucket.staffOnly
    ? 'STAFF GUIDE'
    : bucket.optionalBadge || (bucketKey === 'literaryAnthology' ? 'OPTIONAL ANTHOLOGY' : 'PDF BOOKLET');

  const msHtml = defaultItem.msHtmlUrl || bucket.markSchemeHtmlUrl || '';
  const msPdf = defaultItem.msPdfUrl || bucket.markSchemePdfUrl || '';
  const showMs = staffActive && Boolean(msHtml || msPdf);

  const selectHtml = hasEditions
    ? `
      <select class="urb-edition-select" aria-label="Select Key Topic or Era" onchange="window.onDrawerEditionSelect(this, '${unitId}', '${bucketKey}')" style="margin-top: 8px; width: 100%; padding: 6px 8px; font-size: 0.75rem; font-weight: 700; color: #0f172a; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
        ${bucket.editions.map((ed) => `<option value="${ed.id}">${ed.label}</option>`).join('')}
      </select>
    `
    : '';

  const pdfActionHtml = hasPdf
    ? `<a href="${pdfUrl}" download="${dlName}" target="_blank" class="urb-btn-pdf" style="flex: 1; padding: 7px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 5px;" title="Download PDF (${dlName})"><i class="fa-solid fa-file-pdf" style="color: #dc2626;"></i> <span>PDF ↓</span></a>`
    : `<a href="#" onclick="event.preventDefault(); window.openCurricularPillar('${htmlUrl}', '${safeTitle}', null, '${bucket.label.toUpperCase()}');" class="urb-btn-pdf" style="flex: 1; padding: 7px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 5px;" title="Open printable booklet"><i class="fa-solid fa-print" style="color: #2563eb;"></i> <span>Print</span></a>`;

  const msActionHtml = `
    <button type="button" class="urb-btn-ms" onclick="${msPdf && isVerifiedPdf(msPdf) ? `window.open('${msPdf}', '_blank')` : `window.openCurricularPillar('${msHtml}', '${safeTitle} — Mark Scheme', '${msPdf}', 'MARK_SCHEME')`}" style="display: ${showMs ? 'inline-flex' : 'none'}; padding: 7px 9px; border-radius: 6px; font-size: 0.74rem; font-weight: 700; background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; cursor: pointer; align-items: center; justify-content: center; gap: 4px;" title="Staff Only: Open Workbook Mark Scheme & WAGOLLs">
      <i class="fa-solid fa-key"></i> <span>Key</span>
    </button>
  `;

  const staffPrintNote =
    staffActive && bucket.printSpec
      ? `<div style="margin-top: 7px; font-size: 0.68rem; color: #64748b; background: #f8fafc; padding: 4px 7px; border-radius: 4px; border: 1px dashed #cbd5e1;"><i class="fa-solid fa-print" style="margin-right: 4px; color: #475569;"></i>${bucket.printSpec}</div>`
      : '';

  return `
    <div class="urb-booklet-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-top: 3.5px solid ${accentColor}; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; box-shadow: 0 2px 6px rgba(15,23,42,0.03);">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 7px;">
          <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; padding: 2px 7px; border-radius: 4px; ${badgeClass}">
            ${badgeLabel}
          </span>
          <span class="urb-pages-badge" style="font-size: 0.69rem; font-weight: 700; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 7px; border-radius: 4px;">${pages}</span>
        </div>
        <h4 style="margin: 0 0 4px 0; font-size: 0.92rem; font-weight: 800; color: #0f172a; line-height: 1.25;">${bucket.label}</h4>
        <p style="margin: 0; font-size: 0.76rem; line-height: 1.42; color: #475569;">${bucket.desc || ''}</p>
        ${selectHtml}
        ${staffPrintNote}
      </div>
      <div style="display: flex; align-items: center; gap: 6px; padding-top: 8px; border-top: 1px solid #f1f5f9;">
        <button type="button" class="urb-btn-read" onclick="window.openCurricularPillar('${htmlUrl}', '${safeTitle}', '${pdfUrl || ''}', '${bucket.label.toUpperCase()}')" style="flex: 1.15; padding: 7px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; background: #0f172a; color: #ffffff; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px;">
          <i class="fa-solid fa-book-open-reader"></i> <span>Read</span>
        </button>
        ${pdfActionHtml}
        ${msActionHtml}
      </div>
    </div>
  `;
}

function renderWorksheetsCard(unitId, worksheets) {
  if (!Array.isArray(worksheets) || worksheets.length === 0) return '';
  const first = worksheets[0];
  const safeTitle = String(first.label).replace(/'/g, "\\'");
  return `
    <div class="urb-booklet-card" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-top: 3.5px solid #0284c7; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 7px;">
          <span style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; padding: 2px 7px; border-radius: 4px; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;">A4 WORKSHEETS</span>
          <span style="font-size: 0.69rem; font-weight: 700; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 7px; border-radius: 4px;">11 Lessons</span>
        </div>
        <h4 style="margin: 0 0 4px 0; font-size: 0.92rem; font-weight: 800; color: #0f172a;">Single-Lesson Worksheets</h4>
        <p style="margin: 0; font-size: 0.76rem; line-height: 1.42; color: #475569;">Individual 2–3 page A4 companion worksheets with optional craft sheets.</p>
        <select aria-label="Select Lesson Worksheet" onchange="window.onDrawerWorksheetSelect(this, '${unitId}')" style="margin-top: 8px; width: 100%; padding: 6px 8px; font-size: 0.75rem; font-weight: 700; color: #0f172a; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
          ${worksheets.map((w) => `<option value="${w.id}">${w.label}</option>`).join('')}
        </select>
      </div>
      <div style="display: flex; align-items: center; gap: 6px; padding-top: 8px; border-top: 1px solid #f1f5f9;">
        <button type="button" class="urb-btn-read" onclick="window.openCurricularPillar('${first.htmlUrl}', '${safeTitle}', '${first.pdfUrl}', 'WORKSHEET')" style="flex: 1.15; padding: 7px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; background: #0f172a; color: #ffffff; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px;">
          <i class="fa-solid fa-book-open-reader"></i> <span>Read</span>
        </button>
        <a href="${first.pdfUrl}" download="${first.pdfUrl.split('/').pop()}" target="_blank" class="urb-btn-pdf" style="flex: 1; padding: 7px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 5px;">
          <i class="fa-solid fa-file-pdf" style="color: #dc2626;"></i> <span>PDF ↓</span>
        </a>
      </div>
    </div>
  `;
}

export function renderStickyUnitResourceBar(unitId, unitData) {
  if (!unitId || unitId === 'trip_ypres' || unitData?.type === 'trip') return '';
  const cfg = getUnitCatalogEntry(unitId) || {};
  const staffActive = isStaffModeActive();
  const isKs2 = unitId === 'ks2_ww2' || String(unitId).startsWith('ks2');

  // 1. Check last visited lesson on this device for 1-click Resume
  let resumePillHtml = '';
  if (typeof window !== 'undefined') {
    try {
      const savedIdxRaw = localStorage.getItem(`hh_last_lesson_${unitId}`);
      const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
      if (savedIdxRaw !== null && lessons.length > 0) {
        const idx = parseInt(savedIdxRaw, 10);
        if (!isNaN(idx) && idx >= 0 && idx < lessons.length) {
          const hasL0 = lessons[0] && (lessons[0].id === 'lesson_0' || /KT\s*1\.0/i.test(lessons[0].title || ''));
          const numLabel = hasL0 ? (idx === 0 ? 'Intro' : `Lesson ${idx}`) : `Lesson ${idx + 1}`;
          resumePillHtml = `
            <button type="button" onclick="window.viewLessonDetail && window.viewLessonDetail(${idx})" style="background: #059669; color: #ffffff; border: 1px solid #34d399; border-radius: 7px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;" title="Continue where you left off (${(lessons[idx].title || '').replace(/"/g, '&quot;')})">
              <i class="fa-solid fa-play" style="font-size: 0.68rem;"></i>
              <span>Resume: ${numLabel}</span>
            </button>
          `;
        }
      }
    } catch (e) {}
  }

  // 2. Key Topic instant jump pills (GCSE courses)
  const ktPillsHtml = Array.isArray(cfg.keyTopics)
    ? cfg.keyTopics
        .map(
          (kt) => `
        <button type="button" onclick="window.jumpToKeyTopicSection('${kt.id}')" title="Jump to ${kt.label}" style="background: #1e293b; color: #e2e8f0; border: 1px solid #475569; border-radius: 7px; padding: 6px 10px; font-size: 0.76rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.15s ease;" onmouseover="this.style.background='#2563eb';this.style.borderColor='#60a5fa';this.style.color='#fff';" onmouseout="this.style.background='#1e293b';this.style.borderColor='#475569';this.style.color='#e2e8f0';">
          ${kt.shortLabel}
        </button>
      `,
        )
        .join('')
    : '';

  // 3. Build Printable Booklets Panel
  const isKs2OrKs3 = isKs2 || cfg.stage === 'ks2' || cfg.stage === 'ks3';
  const bookletCards = [
    renderBookletCard(unitId, 'textbook', cfg.textbook, '#2563eb', 'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;', staffActive),
    renderBookletCard(unitId, 'workbook', cfg.workbook, '#d97706', 'background:#fffbeb;color:#b45309;border:1px solid #fde68a;', staffActive),
    renderBookletCard(unitId, 'retrieval', cfg.retrieval, '#7c3aed', 'background:#f5f3ff;color:#6d28d9;border:1px solid #ddd6fe;', staffActive),
    isKs2OrKs3
      ? renderBookletCard(
          unitId,
          'literaryAnthology',
          cfg.literaryAnthology,
          '#4f46e5',
          'background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe;',
          staffActive,
        )
      : '',
    renderBookletCard(unitId, 'revisionGuide', cfg.revisionGuide, '#0d9488', 'background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;', staffActive),
    renderWorksheetsCard(unitId, cfg.worksheets),
    renderBookletCard(unitId, 'schemeOfWork', cfg.schemeOfWork, '#be185d', 'background:#fdf2f8;color:#9d174d;border:1px solid #fbcfe8;', staffActive),
  ].filter(Boolean);

  // 4. Build Infographics Panel (whole-course roadmaps + gallery)
  const manifest = (typeof window !== 'undefined' && window.__INFOGRAPHICS_MANIFEST__) || {};
  const rawManifestItems = Array.isArray(manifest[unitId])
    ? manifest[unitId].filter((it) => it && (isKs2 ? it.type === 'visual_story_sheet' : (it.image || it.interactiveUrl)))
    : [];
  const courseInfos = Array.isArray(cfg.courseInfographics) && cfg.courseInfographics.length > 0
    ? cfg.courseInfographics
    : rawManifestItems.slice(0, 4).map((it) => ({
        slug: it.slug,
        label: it.title,
        desc: it.type === 'visual_story_sheet'
          ? `1-page visual story with studio audio • ${it.topic || ''}`.replace(/\s*•\s*$/, '')
          : (it.topic || ''),
        thumbUrl: it.thumbUrl || it.image || '',
      }));
  const hasInfographics = courseInfos.length > 0;

  const infographicCardsHtml = courseInfos
    .map(
      (info) => `
      <div onclick="if(window.openInfographicModal){window.openInfographicModal('${info.slug}');}" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.15s ease, box-shadow 0.15s ease;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 18px rgba(15,23,42,0.08)';" onmouseout="this.style.transform='none';this.style.boxShadow='none';">
        <div style="height: 112px; background-image: url('${info.thumbUrl}'); background-size: cover; background-position: top center; position: relative; border-bottom: 1px solid #e2e8f0;">
          <span style="position: absolute; bottom: 7px; right: 7px; background: rgba(15, 23, 42, 0.88); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.45); font-size: 0.62rem; font-weight: 800; text-transform: uppercase; padding: 2px 7px; border-radius: 4px;">1-Page Story + Audio</span>
        </div>
        <div style="padding: 11px 13px; display: flex; flex-direction: column; gap: 6px; flex: 1; justify-content: space-between;">
          <div>
            <h4 style="margin: 0 0 3px 0; font-size: 0.86rem; font-weight: 800; color: #0f172a; line-height: 1.25;">${info.label}</h4>
            <p style="margin: 0; font-size: 0.73rem; color: #64748b; line-height: 1.38;">${info.desc || ''}</p>
          </div>
          <span style="font-size: 0.75rem; font-weight: 700; color: #0284c7; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-magnifying-glass-plus"></i> View Full Size
          </span>
        </div>
      </div>
    `,
    )
    .join('');

  // 5. Build Games, Quiz & Timeline Panel (enabled across all 26 active curriculum units)
  const hasTimeline = Boolean(unitId);
  const individualsCount = Array.isArray(unitData?.key_individuals) ? unitData.key_individuals.length : 0;

  const hasExamHub = Boolean(
    !isKs2 &&
      (cfg.stage === 'gcse' ||
        cfg.masteryExamPack ||
        (Array.isArray(unitData?.mock_exams) && unitData.mock_exams.length > 0)),
  );

  // Mobile Pupil Zero-PDF Quick Study Bar (Hidden on Desktop >= 933px & Staff Mode via CSS)
  const mobileLessonCount = Array.isArray(unitData?.lessons) ? unitData.lessons.length : 0;
  let mobileResumeIdx = 0;
  let mobileHasSavedResume = false;
  if (typeof window !== 'undefined') {
    try {
      const rawSaved = localStorage.getItem(`hh_last_lesson_${unitId}`);
      if (rawSaved !== null) {
        const parsedIdx = parseInt(rawSaved, 10);
        if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < Math.max(1, mobileLessonCount)) {
          mobileResumeIdx = parsedIdx;
          mobileHasSavedResume = true;
        }
      }
    } catch (e) {}
  }
  const hasAnyCloze = Array.isArray(unitData?.lessons) && unitData.lessons.some((l) => l?.vocab_cloze_text && l.vocab_cloze_text.includes('['));
  const mobileFirstStoryLessonId =
    (Array.isArray(unitData?.lessons) &&
      (unitData.lessons[mobileResumeIdx]?.id || unitData.lessons[0]?.id)) ||
    'lesson_1';

  const mobilePupilStripHtml = `
    <div id="hh-mobile-unit-strip" class="hh-mobile-unit-strip no-print">
      <div class="hh-mus-scroll">
        <button type="button" class="hh-mus-pill hh-mus-pill-primary" onclick="window.viewLessonDetail && window.viewLessonDetail(${mobileResumeIdx})">
          <i class="fa-solid fa-play"></i>
          <span>${mobileHasSavedResume ? `Resume L${mobileResumeIdx + 1}` : 'Start Lesson 1'}</span>
        </button>
        <button type="button" class="hh-mus-pill" onclick="window.switchView && window.switchView('interactive', '${unitId}', false, { mode: 'mcq' })">
          <i class="fa-solid fa-bolt" style="color:#fbbf24;"></i>
          <span>Topic Quiz</span>
        </button>
        ${
          hasAnyCloze
            ? `<button type="button" class="hh-mus-pill" onclick="window.switchView && window.switchView('interactive', '${unitId}', false, { mode: 'cloze' })">
                <i class="fa-solid fa-puzzle-piece" style="color:#38bdf8;"></i>
                <span>Gap Fill</span>
              </button>`
            : ''
        }
        ${
          hasExamHub
            ? `<button type="button" class="hh-mus-pill hh-mus-pill-exam" onclick="window.switchView && window.switchView('exam-trainer', '${unitId}')">
                <i class="fa-solid fa-bullseye" style="color:#a5b4fc;"></i>
                <span>Exam Qs</span>
              </button>`
            : ''
        }
        <button type="button" class="hh-mus-pill" onclick="if(window.launchUnitArcade){window.launchUnitArcade('${unitId}', 'all', 'lobby');}else if(window.switchView){window.switchView('arcade', '${unitId}');}">
          <i class="fa-solid fa-gamepad" style="color:#34d399;"></i>
          <span>Arcade</span>
        </button>
        <button type="button" class="hh-mus-pill" onclick="window.switchView && window.switchView('timeline', '${unitId}')">
          <i class="fa-solid fa-clock-rotate-left" style="color:#2dd4bf;"></i>
          <span>Timeline</span>
        </button>
        <button type="button" class="hh-mus-pill" onclick="window.switchView && window.switchView('mindmap', '${unitId}')">
          <i class="fa-solid fa-diagram-project" style="color:#fbbf24;"></i>
          <span>Mind Map</span>
        </button>
        ${
          hasInfographics
            ? `<button type="button" class="hh-mus-pill" onclick="if(window.openLessonInfographicModal){window.openLessonInfographicModal('${mobileFirstStoryLessonId}', '${unitId}');}else if(window.openInfographicModal && window.__INFOGRAPHICS_MANIFEST__?.['${unitId}']?.[0]){window.openInfographicModal(window.__INFOGRAPHICS_MANIFEST__['${unitId}'][0].slug);}">
                <i class="fa-solid fa-wand-magic-sparkles" style="color:#f472b6;"></i>
                <span>Story Cards</span>
              </button>`
            : ''
        }
      </div>
      ${
        ktPillsHtml
          ? `<div class="hh-mus-kt-row">${ktPillsHtml}</div>`
          : ''
      }
    </div>
  `;

  return `
    <div id="unit-sticky-bar-wrapper" class="no-print" style="position: sticky; top: 0; z-index: 45;">
      ${mobilePupilStripHtml}
      <div id="unit-sticky-classroom-bar" style="background: #0f172a; border-bottom: 1px solid #334155; padding: 9px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <!-- Left: Daily Lesson Speed Launch -->
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            ${resumePillHtml}
            ${ktPillsHtml}
            ${!resumePillHtml && !ktPillsHtml ? `<span style="font-size: 0.76rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.03em;"><i class="fa-solid fa-compass" style="color:#38bdf8;margin-right:5px;"></i>Select an enquiry below to begin</span>` : ''}
          </div>

          <!-- Right: Single-Home On-Demand Resource Drawers -->
          <div style="display: flex; align-items: center; gap: 7px; flex-wrap: wrap;">
            ${
              bookletCards.length > 0
                ? `
              <button type="button" id="unit-bar-btn-booklets" onclick="window.toggleUnitResourceDrawer('booklets')" style="background: #1e293b; color: #f8fafc; border: 1px solid #475569; border-radius: 7px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-file-pdf" style="color: #f87171;"></i>
                <span>PDFs &amp; Booklets (${bookletCards.length})</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 0.65rem; opacity: 0.75;"></i>
              </button>`
                : ''
            }
            ${
              hasInfographics
                ? `
              <button type="button" id="unit-bar-btn-infographics" onclick="window.toggleUnitResourceDrawer('infographics')" style="background: #1e293b; color: #f8fafc; border: 1px solid #475569; border-radius: 7px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-image" style="color: #38bdf8;"></i>
                <span>Infographics (${rawManifestItems.length || courseInfos.length})</span>
                <i class="fa-solid fa-chevron-down" style="font-size: 0.65rem; opacity: 0.75;"></i>
              </button>`
                : ''
            }
            <button type="button" id="unit-bar-btn-practice" onclick="window.toggleUnitResourceDrawer('practice')" style="background: #1e293b; color: #f8fafc; border: 1px solid #475569; border-radius: 7px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-gamepad" style="color: #34d399;"></i>
              <span>Games, Quiz, Timeline &amp; Mind Map</span>
              <i class="fa-solid fa-chevron-down" style="font-size: 0.65rem; opacity: 0.75;"></i>
            </button>
            ${
              hasExamHub
                ? `
              <button type="button" onclick="window.switchView && window.switchView('mock-exams', '${unitId}')" style="background: #1e293b; color: #c7d2fe; border: 1px solid #6366f1; border-radius: 7px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Open Paper Structure, Exam Questions, Grade 9 Answers, Spec Mind Map & Mock Papers">
                <i class="fa-solid fa-file-signature" style="color: #818cf8;"></i>
                <span>Exam &amp; Spec Hub</span>
              </button>`
                : ''
            }
          </div>
        </div>
      </div>

      <!-- Collapsible On-Demand Drawer Shell (Pinned beneath sticky bar even when scrolled mid-page) -->
      <div id="unit-sticky-drawer-shell" data-open-panel="" style="display: none; background: #f8fafc; border-bottom: 1.5px solid #cbd5e1; padding: 18px 24px; max-height: calc(100vh - 56px); overflow-y: auto; box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);">
      <div style="max-width: 1160px; margin: 0 auto;">
        <!-- Panel 1: PDFs & Booklets -->
        <div id="unit-drawer-panel-booklets" style="display: none;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 0.78rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.04em;">
              <i class="fa-solid fa-file-pdf" style="color: #dc2626; margin-right: 6px;"></i>Printable Course Booklets${staffActive ? ' <span style="color:#059669;margin-left:6px;">(Staff Mode: Mark Schemes &amp; Print Notes Visible)</span>' : ''}
            </span>
            <button type="button" onclick="window.toggleUnitResourceDrawer('')" style="background: transparent; border: none; color: #64748b; font-size: 0.78rem; font-weight: 700; cursor: pointer;"><i class="fa-solid fa-xmark"></i> Close</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(235px, 1fr)); gap: 14px;">
            ${bookletCards.join('')}
          </div>
        </div>

        <!-- Panel 2: Infographics -->
        <div id="unit-drawer-panel-infographics" style="display: none;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 0.78rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.04em;">
              <i class="fa-solid fa-image" style="color: #0284c7; margin-right: 6px;"></i>Course Infographics &amp; Roadmaps (Single-Sheet Visual Overviews)
            </span>
            <div style="display: flex; align-items: center; gap: 10px;">
              ${
                rawManifestItems.length > courseInfos.length
                  ? `<button type="button" onclick="if(window.openInfographicModal){window.openInfographicModal({ unitId: '${unitId}', items: window.__INFOGRAPHICS_MANIFEST__['${unitId}'], startIndex: 0 });}" style="background: #0284c7; color: #ffffff; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.75rem; font-weight: 700; cursor: pointer;"><i class="fa-solid fa-images" style="margin-right: 5px;"></i>Browse All ${rawManifestItems.length} Unit Infographics</button>`
                  : ''
              }
              <button type="button" onclick="window.toggleUnitResourceDrawer('')" style="background: transparent; border: none; color: #64748b; font-size: 0.78rem; font-weight: 700; cursor: pointer;"><i class="fa-solid fa-xmark"></i> Close</button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
            ${infographicCardsHtml}
          </div>
        </div>

        <!-- Panel 3: Games, Quiz & Timeline -->
        <div id="unit-drawer-panel-practice" style="display: none;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 0.78rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.04em;">
              <i class="fa-solid fa-bolt" style="color: #059669; margin-right: 6px;"></i>Digital Revision, Retrieval Games &amp; Chronology
            </span>
            <button type="button" onclick="window.toggleUnitResourceDrawer('')" style="background: transparent; border: none; color: #64748b; font-size: 0.78rem; font-weight: 700; cursor: pointer;"><i class="fa-solid fa-xmark"></i> Close</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
            <button type="button" onclick="if(window.launchUnitArcade){window.launchUnitArcade('${unitId}', 'all', 'lobby');}else if(window.switchView){window.switchView('arcade', '${unitId}');}" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 13px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: #f0f9ff; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0;"><i class="fa-solid fa-gamepad"></i></div>
              <div>
                <div style="font-size: 0.86rem; font-weight: 800; color: #0f172a;">Revision Arcade</div>
                <div style="font-size: 0.73rem; color: #64748b;">Retrieval games &amp; boss sprints</div>
              </div>
            </button>

            <button type="button" onclick="window.switchView && window.switchView('interactive', '${unitId}')" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 13px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: #fffbeb; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0;"><i class="fa-solid fa-circle-question"></i></div>
              <div>
                <div style="font-size: 0.86rem; font-weight: 800; color: #0f172a;">${isKs2 ? 'Class Quiz &amp; Flashcards' : 'Quizzing &amp; Flashcards'}</div>
                <div style="font-size: 0.73rem; color: #64748b;">Self-marking quiz &amp; Leitner recall</div>
              </div>
            </button>

            ${
              hasTimeline
                ? `
                <button type="button" onclick="window.switchView && window.switchView('timeline', '${unitId}')" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 13px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left;">
                  <div style="width: 38px; height: 38px; border-radius: 8px; background: #ecfdf5; color: #059669; display: flex; align-items: center; gap: 12px; justify-content: center; font-size: 1.05rem; flex-shrink: 0;"><i class="fa-solid fa-clock-rotate-left"></i></div>
                  <div>
                    <div style="font-size: 0.86rem; font-weight: 800; color: #0f172a;">${isKs2 ? 'Interactive Chronology' : 'Living Timeline'}</div>
                    <div style="font-size: 0.73rem; color: #64748b;">Explore turning-point milestones</div>
                  </div>
                </button>`
                : ''
            }

            <button type="button" onclick="window.switchView && window.switchView('mindmap', '${unitId}')" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 13px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left;">
              <div style="width: 38px; height: 38px; border-radius: 8px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0;"><i class="fa-solid fa-diagram-project"></i></div>
              <div>
                <div style="font-size: 0.86rem; font-weight: 800; color: #0f172a;">Mind Map Studio</div>
                <div style="font-size: 0.73rem; color: #64748b;">5-ring interactive &amp; printable map</div>
              </div>
            </button>

            ${
              individualsCount > 0
                ? `
              <button type="button" onclick="window.switchView && window.switchView('individuals', '${unitId}')" style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 13px 15px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; flex-shrink: 0;"><i class="fa-solid fa-users-rectangle"></i></div>
                <div>
                  <div style="font-size: 0.86rem; font-weight: 800; color: #0f172a;">People &amp; Organisations (${individualsCount})</div>
                  <div style="font-size: 0.73rem; color: #64748b;">Biographical &amp; organisation dossiers</div>
                </div>
              </button>`
                : ''
            }
          </div>
        </div>
      </div>
    </div>
    </div>
  `;
}
