/**
 * Unified 5-Tab Walk-In Teacher Guidance Modal (All 26 Units: KS2, KS3 & GCSE)
 *
 * - Delegates Key Stage 2 units directly to `openKs2TeacherGuidanceModal` so all 8 KS2
 *   units preserve their bespoke primary worksheet launchers & primary guidance.
 * - Renders a uniform, walk-in 5-Tab Teacher Companion across all 12 KS3 and 6 GCSE units:
 *   1. At A Glance (Central Enquiry, Curriculum/Edexcel Spec Anchor, 2-Lesson Delivery Plan, Print Links)
 *   2. Subject Knowledge Primer (Safeguarding/Impartiality, Non-Specialist Primer, Objectives, SEND & Stretch)
 *   3. Misconceptions & Hinge Discussion (Diagnostic Hinge Question + Teacher Guidance + Common Misconceptions)
 *   4. Workbook & Exam Key (Verso 5-Stage Chronological Spine Crib + Recto Extended Writing / GCSE Exam WAGOLLs)
 *   5. IWB Lesson Answers (Live Classroom Key: Do Now, Sources A–E, Consolidate Cloze & Retrieval Quiz)
 */

import { appStore } from './store.js';
import { getUnitCatalogEntry } from '../data/unit_resources_catalog.js';
import { getCanonicalGcsePaperCode } from './lesson_exam_practice_panel.js';
import { openKs2TeacherGuidanceModal } from './ks2_guidance.js';

const GCSE_UNIT_IDS = new Set([
  'cme_new',
  'gcse_middle_east_1945_1995',
  'eee',
  'gcse_cold_war',
  'edexcel_medicine',
  'usa',
  'weimar_nazi_germany',
]);

const unitJsonCache = new Map();
const sidecarCache = new Map();

function escHtml(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Formats markdown bold/italic cleanly while preserving existing safe HTML markup
 * so zero unparsed `*...*` or `**...**` ever renders in the browser.
 */
function formatRichText(val) {
  if (!val) return '';
  let str = String(val).trim();
  if (!str) return '';
  const hasHtmlTags = /<\/?(?:p|strong|em|b|i|ul|ol|li|br|span|div)\b/i.test(str);
  if (!hasHtmlTags) {
    str = escHtml(str);
  }
  str = str
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>');
  return str;
}

function stripTags(val) {
  return String(val ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function isKs2UnitId(unitId) {
  const id = String(unitId || '').trim();
  return id === 'ks2_ww2' || id.startsWith('ks2_');
}

function isGcseUnitId(unitId, unitData) {
  const id = String(unitId || '').trim();
  if (GCSE_UNIT_IDS.has(id)) return true;
  const cat = String(unitData?.category || unitData?.yearGroup || unitData?.year_group || '').toUpperCase();
  return cat.includes('GCSE');
}

function resolveActiveUnitData(unitId) {
  const canonicalId = unitId === 'gcse_middle_east_1945_1995' ? 'cme_new' : unitId;
  const storeData = appStore?.state?.activeUnitData;
  if (
    storeData &&
    Array.isArray(storeData.lessons) &&
    storeData.lessons.length > 0 &&
    (storeData.id === canonicalId ||
      appStore?.state?.currentUnitId === canonicalId ||
      appStore?.state?.selectedUnitId === canonicalId ||
      (typeof window !== 'undefined' && window.currentUnitId === canonicalId))
  ) {
    return storeData;
  }
  if (
    typeof window !== 'undefined' &&
    window.currentUnitData &&
    Array.isArray(window.currentUnitData.lessons) &&
    (window.currentUnitId === canonicalId || window.currentUnitData.id === canonicalId)
  ) {
    return window.currentUnitData;
  }
  if (unitJsonCache.has(canonicalId)) {
    return unitJsonCache.get(canonicalId);
  }
  return null;
}

async function ensureUnitAndSidecarLoaded(unitId) {
  const canonicalId = unitId === 'gcse_middle_east_1945_1995' ? 'cme_new' : unitId;
  let unitData = resolveActiveUnitData(canonicalId);

  if (!unitData && typeof fetch !== 'undefined') {
    try {
      const res = await fetch(`/data/${canonicalId}.json`);
      if (res.ok) {
        unitData = await res.json();
        unitJsonCache.set(canonicalId, unitData);
      }
    } catch (e) {}
  }

  let sidecar = sidecarCache.get(canonicalId);
  if (sidecar === undefined && typeof fetch !== 'undefined') {
    try {
      const sRes = await fetch(`/data/teacher_guidance/${canonicalId}.json`);
      if (sRes.ok) {
        const ct = sRes.headers.get('content-type') || '';
        if (ct.includes('json')) {
          sidecar = await sRes.json();
        } else {
          sidecar = null;
        }
      } else {
        sidecar = null;
      }
    } catch (e) {
      sidecar = null;
    }
    sidecarCache.set(canonicalId, sidecar);
  }

  return { unitData, sidecar };
}

function getMergedTeacherNotes(lesson, unitData, sidecar) {
  const baseTn = (lesson && lesson.teacher_notes) || {};
  const sideLesson =
    (sidecar && sidecar.lessons && lesson && sidecar.lessons[lesson.id]) || {};
  const unitOverview =
    (unitData && (unitData.teacher_guidance_overview || unitData.unit_overview)) ||
    (sidecar && sidecar.unit_overview) ||
    {};

  return {
    ...baseTn,
    ...sideLesson,
    primer: baseTn.primer || sideLesson.primer || '',
    objectives:
      Array.isArray(baseTn.objectives) && baseTn.objectives.length > 0
        ? baseTn.objectives
        : Array.isArray(sideLesson.objectives)
          ? sideLesson.objectives
          : [],
    delivery_plan: baseTn.delivery_plan || sideLesson.delivery_plan || null,
    curriculum_link:
      sideLesson.curriculum_link ||
      baseTn.curriculum_link ||
      lesson?.specification_anchor ||
      unitOverview.curriculum_focus ||
      '',
    hinge_question:
      sideLesson.hinge_question ||
      baseTn.hinge_question ||
      lesson?.hinge_question ||
      '',
    hinge_guidance:
      sideLesson.hinge_guidance ||
      baseTn.hinge_guidance ||
      '',
    misconceptions:
      Array.isArray(sideLesson.misconceptions) && sideLesson.misconceptions.length > 0
        ? sideLesson.misconceptions
        : Array.isArray(baseTn.misconceptions)
          ? baseTn.misconceptions
          : [],
    send_adaptation: sideLesson.send_adaptation || baseTn.send_adaptation || '',
    stretch_challenge: sideLesson.stretch_challenge || baseTn.stretch_challenge || '',
    safeguarding_impartiality:
      sideLesson.safeguarding_impartiality ||
      baseTn.safeguarding_impartiality ||
      baseTn.statutory_impartiality_guidance ||
      baseTn.safeguarding_note ||
      '',
    source_context:
      sideLesson.source_context && typeof sideLesson.source_context === 'object'
        ? { ...(typeof baseTn.source_context === 'object' ? baseTn.source_context : {}), ...sideLesson.source_context }
        : baseTn.source_context || sideLesson.source_context || null,
    unitOverview,
  };
}

function getLessonDisplayMeta(lesson, idx, lessons, isGcse) {
  const hasLessonZero = lessons.length > 0 && lessons[0]?.id === 'lesson_0';
  const isLessonZero = lesson?.id === 'lesson_0';
  const displayNum = isLessonZero ? 0 : hasLessonZero ? idx : idx + 1;
  const totalRegular = hasLessonZero ? lessons.length - 1 : lessons.length;
  const rawTitle = String(lesson?.title || `Lesson ${idx + 1}`);
  const cleanTitle = rawTitle.replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '').trim();
  const lessonLabel = isLessonZero
    ? 'Introductory Context Lesson'
    : isGcse
      ? `Lesson ${displayNum} of ${totalRegular}`
      : `Enquiry ${displayNum} of ${totalRegular}`;
  const shortOptionPrefix = isLessonZero
    ? 'Intro'
    : isGcse
      ? `Lesson ${displayNum}`
      : `Enquiry ${displayNum}`;
  const enquiryQuestion =
    lesson?.enquiry ||
    lesson?.enquiry_question ||
    lesson?.enquiryQuestion ||
    lesson?.inquiry_question ||
    lesson?.subtitle ||
    cleanTitle;

  return {
    displayNum,
    totalRegular,
    rawTitle,
    cleanTitle,
    lessonLabel,
    shortOptionPrefix,
    enquiryQuestion,
  };
}

function renderSafeguardingCalloutHTML(tn) {
  if (!tn.safeguarding_impartiality) return '';
  return `
    <div style="background: #fffbeb; border: 1.5px solid #fcd34d; border-left: 5px solid #d97706; border-radius: 8px; padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: flex-start; gap: 12px;">
      <i class="fa-solid fa-scale-balanced" style="color: #b45309; font-size: 1.15rem; margin-top: 2px; flex-shrink: 0;"></i>
      <div style="font-size: 0.85rem; color: #78350f; line-height: 1.6;">
        <strong style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #92400e; margin-bottom: 2px;">Statutory Impartiality &amp; Sensitive History Framing</strong>
        ${formatRichText(tn.safeguarding_impartiality)}
      </div>
    </div>
  `;
}

function renderDeliveryPlanCardsHTML(dp) {
  if (!dp) {
    return `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 22px; font-size: 0.85rem; color: #475569;">
        <strong>2-Lesson Sequence (2 &times; 50 mins):</strong> Lesson 1 covers Do Now retrieval, Narrative Stages 1–3, and Verso Chronological Spine notes; Lesson 2 completes Stages 4–5, Primary Sources A–E, and the Recto Extended Writing / Exam Practice task.
      </div>
    `;
  }

  const renderLessonCard = (lObj, fallbackLabel, accentColor, badgeBg, badgeText) => {
    if (!lObj || !Array.isArray(lObj.phases) || lObj.phases.length === 0) return '';
    const heading =
      lObj.title || (lObj.focus ? `${fallbackLabel}: ${lObj.focus}` : fallbackLabel);
    const rows = lObj.phases
      .map((p, pIdx) => {
        let tBadge = p.time || '';
        let pLabel = p.label || p.phase || '';
        const pInstr = p.instruction || p.activity || '';
        if (!tBadge && pLabel) {
          const tm = pLabel.match(/\(([^)]*(?:min|m)[^)]*)\)/i);
          if (tm) {
            tBadge = tm[1].replace(/\s*mins?\b/i, 'm');
            pLabel = pLabel
              .replace(/\s*\([^)]*\)\s*/, '')
              .replace(/^Phase\s+\d+:\s*/i, '')
              .trim();
          }
        }
        return `
          <div style="display: flex; align-items: flex-start; gap: 10px; padding: 9px 12px; background: ${pIdx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: ${pIdx < lObj.phases.length - 1 ? '1px solid #e2e8f0' : 'none'}; font-size: 0.84rem; line-height: 1.5;">
            ${tBadge ? `<span style="background: ${badgeBg}; color: ${badgeText}; font-weight: 800; font-size: 0.74rem; padding: 2px 7px; border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: nowrap; flex-shrink: 0;">${escHtml(tBadge)}</span>` : ''}
            <div style="color: #334155; flex: 1;">
              ${pLabel ? `<strong style="color: #0f172a;">${formatRichText(pLabel)}:</strong> ` : ''}${formatRichText(pInstr)}
            </div>
          </div>
        `;
      })
      .join('');

    return `
      <div style="border: 1.5px solid #cbd5e1; border-top: 4px solid ${accentColor}; border-radius: 8px; overflow: hidden; background: #ffffff; flex: 1 1 360px; min-width: 280px;">
        <div style="background: #f8fafc; padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #0f172a; font-size: 0.88rem; display: flex; align-items: center; gap: 8px;">
          <i class="fa-regular fa-clock" style="color: ${accentColor};"></i>
          <span>${formatRichText(heading)}</span>
        </div>
        <div>${rows}</div>
      </div>
    `;
  };

  const card1 = renderLessonCard(dp.lesson_1, 'Lesson 1 (50 mins)', '#1e3a8a', '#dbeafe', '#1e40af');
  const card2 = renderLessonCard(dp.lesson_2, 'Lesson 2 (50 mins)', '#0f766e', '#ccfbf1', '#115e59');

  return `
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin: 0 0 10px 0;">
      <h3 style="font-size: 0.98rem; font-weight: 800; color: #0f172a; margin: 0;">
        Recommended 2-Lesson Delivery Plan ${dp.format ? `<span style="font-weight: 600; color: #64748b; font-size: 0.84rem;">&bull; ${escHtml(dp.format)}</span>` : '<span style="font-weight: 600; color: #64748b; font-size: 0.84rem;">&bull; 2 &times; 50 mins</span>'}
      </h3>
    </div>
    <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 22px;">
      ${card1}
      ${card2}
    </div>
  `;
}

function renderPrintableLinksBarHTML(unitId) {
  const canonicalId = unitId === 'gcse_middle_east_1945_1995' ? 'cme_new' : unitId;
  const cat = getUnitCatalogEntry(canonicalId) || {};
  const wbPdf =
    cat.workbook?.pdfUrl ||
    cat.workbook?.editions?.[0]?.pdfUrl ||
    `/pdfs/${canonicalId}_pupil_workbook.pdf`;
  const wbLabel = cat.workbook?.editions?.length
    ? `${cat.workbook.editions[0].label || 'Pupil Workbook'} (PDF)`
    : `${cat.workbook?.pages ? cat.workbook.pages + ' ' : ''}Pupil Workbook (PDF)`;

  const msPdf =
    cat.workbook?.markSchemePdfUrl ||
    cat.workbook?.editions?.find((e) => e.msPdfUrl)?.msPdfUrl ||
    null;

  const retPdf = cat.retrieval?.pdfUrl || `/pdfs/${canonicalId}_retrieval_companion.pdf`;
  const sowHtml =
    cat.schemeOfWork?.htmlUrl || `/units/${canonicalId}/${canonicalId}_scheme_of_work.html`;
  const sowPdf =
    cat.schemeOfWork?.pdfUrl || `/pdfs/${canonicalId}_scheme_of_work.pdf`;

  return `
    <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
      <span style="font-size: 0.82rem; font-weight: 800; color: #1e293b; display: inline-flex; align-items: center; gap: 7px;">
        <i class="fa-solid fa-print" style="color: #2563eb;"></i>
        Fast Printable Reprographics &amp; Staff SOW:
      </span>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="${escHtml(wbPdf)}" target="_blank" rel="noopener" style="background: #ffffff; color: #1e3a8a; border: 1.5px solid #bfdbfe; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-book-bookmark" style="color: #2563eb;"></i> ${escHtml(wbLabel)}
        </a>
        ${
          msPdf
            ? `<a href="${escHtml(msPdf)}" target="_blank" rel="noopener" style="background: #ecfdf5; color: #065f46; border: 1.5px solid #6ee7b7; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-check-double" style="color: #059669;"></i> Workbook Mark Scheme (PDF)
              </a>`
            : ''
        }
        <a href="${escHtml(retPdf)}" target="_blank" rel="noopener" style="background: #ffffff; color: #5b21b6; border: 1.5px solid #ddd6fe; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-bolt" style="color: #7c3aed;"></i> Retrieval Companion (PDF)
        </a>
        <a href="${escHtml(sowHtml)}" target="_blank" rel="noopener" style="background: #fdf2f8; color: #9d174d; border: 1.5px solid #fbcfe8; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-table-list" style="color: #be185d;"></i> Teacher Guide &amp; SOW (Web)
        </a>
        <a href="${escHtml(sowPdf)}" target="_blank" rel="noopener" style="background: #0f172a; color: #f8fafc; border: 1.5px solid #334155; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-file-pdf" style="color: #fbbf24;"></i> SOW Pack (PDF)
        </a>
      </div>
    </div>
  `;
}

function collectUnifiedTasks(lesson) {
  const results = [];
  if (Array.isArray(lesson?.tasks)) {
    lesson.tasks.forEach((t) => {
      if (t) results.push({ ...t, _origin: 'workbook_task' });
    });
  }
  if (lesson?.right_page_task && typeof lesson.right_page_task === 'object') {
    results.push({ ...lesson.right_page_task, _origin: 'right_page_task' });
  }
  if (
    lesson?.exam_practice &&
    Array.isArray(lesson.exam_practice.questions) &&
    lesson.exam_practice.questions.length > 0
  ) {
    lesson.exam_practice.questions.forEach((q) => {
      if (q) {
        results.push({
          ...q,
          _origin: 'exam_practice',
          _sectionTitle: lesson.exam_practice.title || '',
        });
      }
    });
  } else if (lesson?.gcse_task && Array.isArray(lesson.gcse_task.tasks)) {
    lesson.gcse_task.tasks.forEach((gt) => {
      if (gt) results.push({ ...gt, _origin: 'gcse_task' });
    });
  }
  return results;
}

function renderModelTiersHTML(modelTiers) {
  if (!modelTiers || typeof modelTiers !== 'object') return '';
  const entries = Object.entries(modelTiers).filter(([, v]) => v);
  if (!entries.length) return '';

  return `
    <details style="margin-top: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px;">
      <summary style="cursor: pointer; font-size: 0.8rem; font-weight: 800; color: #1e3a8a; user-select: none;">
        <i class="fa-solid fa-layer-group" style="margin-right: 5px; color: #2563eb;"></i>
        View Stepped Mark-Scheme Exemplar Ladder (${entries.length} Tiers)
      </summary>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
        ${entries
          .map(([tierKey, tierVal]) => {
            if (typeof tierVal === 'string') {
              return `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; font-size: 0.83rem;">
                  <strong style="color: #0f172a; text-transform: uppercase; font-size: 0.74rem;">${escHtml(tierKey)}:</strong>
                  <div style="margin-top: 4px; color: #1e293b; line-height: 1.55;">${formatRichText(tierVal)}</div>
                </div>
              `;
            }
            const title = tierVal.title || tierVal.score || tierKey;
            const level = tierVal.level ? ` • ${tierVal.level}` : '';
            const optionsHtml = Array.isArray(tierVal.options) && tierVal.options.length > 1
              ? `<div style="display: flex; flex-direction: column; gap: 6px; margin-top: 6px;">
                  ${tierVal.options
                    .map(
                      (opt) => `
                    <div style="background: #f8fafc; border-left: 3px solid #2563eb; padding: 7px 10px; border-radius: 4px;">
                      <div style="font-weight: 700; font-size: 0.78rem; color: #1e3a8a; margin-bottom: 2px;">${escHtml(opt.label || 'Option')}</div>
                      <div style="font-family: 'Lora', Georgia, serif; font-size: 0.86rem; color: #0f172a; line-height: 1.55;">${formatRichText(opt.text || '')}</div>
                    </div>
                  `,
                    )
                    .join('')}
                 </div>`
              : `<div style="font-family: 'Lora', Georgia, serif; font-size: 0.88rem; color: #0f172a; line-height: 1.6; margin-top: 4px;">${formatRichText(tierVal.text || '')}</div>`;

            return `
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #4338ca; border-radius: 6px; padding: 10px 14px;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
                  <strong style="font-size: 0.82rem; color: #312e81;">${escHtml(title)}${escHtml(level)}</strong>
                  ${tierVal.badge ? `<span style="background: #dcfce7; color: #166534; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">${escHtml(tierVal.badge)}</span>` : ''}
                </div>
                ${optionsHtml}
                ${tierVal.verdict ? `<div style="margin-top: 6px; font-size: 0.78rem; color: #475569; background: #f1f5f9; padding: 6px 9px; border-radius: 4px;"><strong>Marking Note:</strong> ${formatRichText(tierVal.verdict)}</div>` : ''}
              </div>
            `;
          })
          .join('')}
      </div>
    </details>
  `;
}

function renderWorkbookAndExamKeyHTML(lesson, isGcse) {
  const wbStages = Array.isArray(lesson?.workbook_stages) ? lesson.workbook_stages : [];
  const spineStages = Array.isArray(lesson?.causal_domino_spine?.stages)
    ? lesson.causal_domino_spine.stages
    : [];
  const blocks = Array.isArray(lesson?.narrative_blocks) ? lesson.narrative_blocks : [];
  const stageCount = Math.max(wbStages.length, spineStages.length, Math.min(blocks.length, 5));

  const spineRows = [];
  for (let i = 0; i < stageCount; i++) {
    const wb = wbStages[i] || {};
    const sp = spineStages[i] || {};
    const blk = blocks[i] || {};
    const stepNum = wb.stage || wb.step || sp.step || i + 1;
    const dateBadge = wb.dates || wb.date || sp.date || '';
    const paraRef = wb.para_ref || wb.paraRef || sp.para_ref || sp.paraRef || `[${stepNum}.1]`;
    const title = wb.title || sp.title || blk.title || blk.heading || `Stage ${stepNum}`;
    const stageQuestion =
      wb.question || wb.questionHeading || wb.heading || wb.focus_clue || sp.question || '';
    const expectedAnswer =
      wb.model_sentence ||
      wb.modelSentence ||
      [sp.trigger || sp.desc, sp.connective].filter(Boolean).join(' ') ||
      wb.spec_focus ||
      '';
    const bullets = Array.isArray(wb.bullets) ? wb.bullets : [];

    spineRows.push(`
      <div style="border: 1px solid #e2e8f0; border-left: 4px solid #0f766e; border-radius: 8px; padding: 12px 16px; background: #ffffff;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="background: #ccfbf1; color: #115e59; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">Stage ${escHtml(stepNum)}</span>
            ${dateBadge ? `<span style="background: #f1f5f9; color: #334155; font-size: 0.73rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">${escHtml(dateBadge)}</span>` : ''}
            <strong style="font-size: 0.88rem; color: #0f172a;">${formatRichText(title)}</strong>
          </div>
          <span style="font-size: 0.72rem; font-weight: 700; color: #64748b; font-family: monospace;"> Narrative ${escHtml(paraRef)}</span>
        </div>
        ${stageQuestion ? `<div style="font-size: 0.84rem; font-weight: 700; color: #1e3a8a; margin-bottom: 5px;">Q: ${formatRichText(stageQuestion)}</div>` : ''}
        ${expectedAnswer ? `<div style="font-size: 0.84rem; color: #1e293b; line-height: 1.55; background: #f8fafc; padding: 8px 11px; border-radius: 5px; border: 1px solid #e2e8f0;"><strong style="color: #0f766e;">&#10003; Expected Summary:</strong> ${formatRichText(expectedAnswer)}</div>` : ''}
        ${
          bullets.length
            ? `<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 7px;">
                ${bullets.map((b) => `<span style="font-size: 0.74rem; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; padding: 2px 8px; border-radius: 999px; font-weight: 600;">&bull; ${escHtml(b)}</span>`).join('')}
               </div>`
            : ''
        }
      </div>
    `);
  }

  const allTasks = collectUnifiedTasks(lesson);
  const tasksHtml = allTasks.length
    ? allTasks
        .map((t, idx) => {
          const tariffLabel =
            t.tariff ||
            t.topic ||
            t.title ||
            (t.marks ? `${t.marks} marks` : isGcse ? 'GCSE Exam Practice' : `Writing Task ${idx + 1}`);
          const qStem = t.question || t.text || t.prompt || '';
          const stimulus = Array.isArray(t.stimulus) ? t.stimulus : [];
          const examTip = t.examiner_tip || t.guidance || t.scaffolding?.guidance || '';
          const primaryModel = t.model_answer || t.model || t.wagoll || t.exemplar || '';
          const hasTwoFeatures = t.feature_1 || t.feature_2;

          let modelBlock = '';
          if (hasTwoFeatures) {
            modelBlock = `
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                ${t.feature_1?.model ? `<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #4338ca; border-radius: 5px; padding: 9px 12px; font-size: 0.85rem; line-height: 1.58;"><strong>Feature 1 Model:</strong> ${formatRichText(t.feature_1.model)}</div>` : ''}
                ${t.feature_2?.model ? `<div style="background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #4338ca; border-radius: 5px; padding: 9px 12px; font-size: 0.85rem; line-height: 1.58;"><strong>Feature 2 Model:</strong> ${formatRichText(t.feature_2.model)}</div>` : ''}
              </div>
            `;
          } else if (primaryModel) {
            modelBlock = `
              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-left: 5px solid #4338ca; border-radius: 6px; padding: 12px 16px; margin-top: 8px;">
                <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #312e81; margin-bottom: 5px;">
                  <i class="fa-solid fa-star" style="color: #eab308; margin-right: 4px;"></i> Model Answer / WAGOLL
                </div>
                <div style="font-family: 'Lora', Georgia, serif; font-size: 0.91rem; color: #0f172a; line-height: 1.65;">
                  ${formatRichText(primaryModel)}
                </div>
              </div>
            `;
          }

          return `
            <div style="border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 16px 18px; background: #ffffff;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
                <span style="background: #ede9fe; color: #5b21b6; font-size: 0.74rem; font-weight: 800; padding: 3px 9px; border-radius: 4px; text-transform: uppercase;">
                  ${escHtml(tariffLabel)}
                </span>
                ${t.workbook_badge ? `<span style="background: #dcfce7; color: #166534; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">${escHtml(t.workbook_badge)}</span>` : ''}
              </div>
              <div style="font-size: 0.94rem; font-weight: 800; color: #0f172a; line-height: 1.45; margin-bottom: 6px;">
                ${formatRichText(qStem)}
              </div>
              ${
                stimulus.length
                  ? `<div style="font-size: 0.81rem; color: #475569; margin-bottom: 8px;">
                      <strong>Stimulus Points:</strong> ${stimulus.map((s) => escHtml(s)).join(' &bull; ')}
                    </div>`
                  : ''
              }
              ${
                examTip
                  ? `<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 5px; padding: 8px 11px; font-size: 0.81rem; color: #1e3a8a; margin-bottom: 8px;">
                      <strong><i class="fa-solid fa-compass-drafting" style="margin-right: 4px;"></i> ${isGcse ? 'GCSE Exam Tip' : 'Writing Guidance'}:</strong> ${formatRichText(examTip)}
                    </div>`
                  : ''
              }
              ${modelBlock}
              ${renderModelTiersHTML(t.model_tiers)}
            </div>
          `;
        })
        .join('')
    : `<div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; font-size: 0.85rem; color: #475569;">See the Pupil Workbook &amp; Mastery Exam Pack links on Tab 1 for summative assessment papers and mark schemes.</div>`;

  return `
    <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 5px solid #16a34a; border-radius: 6px; padding: 13px 18px; margin-bottom: 18px; font-size: 0.85rem; color: #14532d;">
      <strong>Pupil Workbook &amp; Written Assessment Crib:</strong> Marks both the <strong>Verso 5-Stage Chronological Spine</strong> (left-hand page) and the <strong>Recto ${isGcse ? 'Edexcel GCSE Exam Practice' : 'Extended Historical Writing'}</strong> tasks (right-hand page).
    </div>

    <h3 style="font-size: 0.96rem; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-timeline" style="color: #0f766e;"></i>
      Verso Page: 5-Stage Chronological Spine Key (${spineRows.length} Stages)
    </h3>
    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
      ${spineRows.join('')}
    </div>

    <h3 style="font-size: 0.96rem; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px;">
      <i class="fa-solid fa-pen-nib" style="color: #5b21b6;"></i>
      Recto Page: ${isGcse ? 'GCSE Exam Practice &amp; Stepped WAGOLLs' : 'Extended Writing Tasks &amp; WAGOLLs'} (${allTasks.length})
    </h3>
    <div style="display: flex; flex-direction: column; gap: 14px;">
      ${tasksHtml}
    </div>
  `;
}

function renderClozeKeyHTML(clozeText) {
  if (!clozeText || typeof clozeText !== 'string') return '';
  const answers = [];
  const formatted = escHtml(clozeText).replace(/\[([^\]]+)\]/g, (_, word) => {
    answers.push(word);
    return `<strong style="background: #dcfce7; color: #166534; border: 1px solid #86efac; padding: 1px 6px; border-radius: 4px; font-weight: 800;">(${answers.length}) ${word}</strong>`;
  });
  if (!answers.length) return '';

  return `
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px; background: #ffffff;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
        <span style="background: #fce7f3; color: #9d174d; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">CONSOLIDATE CLOZE</span>
        <strong style="font-size: 0.88rem; color: #0f172a;">Missing-Word Summary Paragraph Key (${answers.length} Blanks)</strong>
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;">
        ${answers.map((w, i) => `<span style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.76rem; font-weight: 700; padding: 2px 8px; border-radius: 999px;">${i + 1}. ${escHtml(w)}</span>`).join('')}
      </div>
      <div style="font-size: 0.85rem; color: #334155; line-height: 1.7; background: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1px solid #e2e8f0;">
        ${formatted}
      </div>
    </div>
  `;
}

function renderSecondaryIwbAnswersHTML(lesson, tn) {
  const prevDoNow = Array.isArray(lesson?.do_now?.items) ? lesson.do_now.items : [];
  const currDoNow = Array.isArray(lesson?.do_now?.current_items) ? lesson.do_now.current_items : [];
  const sources = Array.isArray(lesson?.sources) ? lesson.sources : [];
  const quiz =
    Array.isArray(lesson?.quiz) && lesson.quiz.length > 0
      ? lesson.quiz
      : Array.isArray(lesson?.quick_quiz)
        ? lesson.quick_quiz
        : [];

  const renderDoNowList = (items, badgeLabel, badgeBg, badgeColor) => {
    if (!items.length) return '';
    return `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="background: ${badgeBg}; color: ${badgeColor}; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">${badgeLabel}</span>
          <strong style="font-size: 0.88rem; color: #0f172a;">Spaced Retrieval Do Now Starter Key (${items.length} Questions)</strong>
        </div>
        <ol style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.84rem; color: #334155; line-height: 1.55;">
          ${items
            .map(
              (it) => `
            <li>
              <div style="font-weight: 700; color: #0f172a;">${formatRichText(it.question || it.q || '')}</div>
              <div style="color: #15803d; font-weight: 700;">&#10003; Answer: ${formatRichText(it.answer || it.a || '')}</div>
              ${it.explanation ? `<div style="color: #64748b; font-size: 0.79rem;">${formatRichText(it.explanation)}</div>` : ''}
            </li>
          `,
            )
            .join('')}
        </ol>
      </div>
    `;
  };

  const sourcesHtml = sources.length
    ? `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 14px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">SOURCES A–${String.fromCharCode(64 + sources.length)}</span>
          <strong style="font-size: 0.88rem; color: #0f172a;">Primary Archival Source Investigation Key (${sources.length} Sources)</strong>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${sources
            .map((src, idx) => {
              const letter = String(src.letter || String.fromCharCode(65 + idx)).replace(/^Source\s+/i, '');
              const tnCtxMap = tn.source_context;
              let rawCtx =
                src.source_context ||
                src.context ||
                (typeof src.teacher_notes === 'string' ? src.teacher_notes : src.teacher_notes?.source_context) ||
                '';
              if (!rawCtx && tnCtxMap) {
                if (typeof tnCtxMap === 'object') {
                  rawCtx =
                    tnCtxMap[`Source ${letter}`] ||
                    tnCtxMap[letter] ||
                    tnCtxMap[src.id] ||
                    '';
                } else if (typeof tnCtxMap === 'string' && idx === 0) {
                  rawCtx = tnCtxMap;
                }
              }

              let contextBody = rawCtx;
              let extractedHinge = src.hinge_question || '';
              if (rawCtx && /hinge question:/i.test(rawCtx)) {
                const parts = rawCtx.split(/\*?\*?Hinge Question:\*?\*?\s*/i);
                contextBody = parts[0].trim();
                if (!extractedHinge && parts[1]) extractedHinge = parts[1].trim();
              }

              const q =
                (src.utility_enquiry && src.utility_enquiry.question) ||
                src.question ||
                'Source Investigation Prompt';
              const ans =
                src.model_answer ||
                src.answer ||
                (src.utility_enquiry && src.utility_enquiry.answer) ||
                (Array.isArray(src.utility_enquiry?.bullet_points)
                  ? src.utility_enquiry.bullet_points.join(' ')
                  : '');

              return `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #d97706; border-radius: 6px; padding: 11px 14px; font-size: 0.84rem; line-height: 1.55;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
                    <strong style="color: #0f172a;">Source ${escHtml(letter)}: ${formatRichText(src.title || src.caption || '')}</strong>
                    ${src.question_badge ? `<span style="font-size: 0.7rem; font-weight: 800; background: #fffbeb; color: #92400e; border: 1px solid #fde68a; padding: 1px 7px; border-radius: 4px;">${escHtml(src.question_badge)}</span>` : ''}
                  </div>
                  ${contextBody ? `<div style="color: #475569; font-size: 0.81rem; margin-top: 4px;"><strong>Context:</strong> ${formatRichText(contextBody)}</div>` : ''}
                  <div style="color: #1e3a8a; font-weight: 700; margin: 5px 0 4px;">Enquiry Q: ${formatRichText(q)}</div>
                  ${ans ? `<div style="color: #0f172a; background: #ffffff; border: 1px solid #e2e8f0; padding: 7px 10px; border-radius: 4px;"><strong style="color: #15803d;">&#10003; Model Answer:</strong> ${formatRichText(ans)}</div>` : ''}
                  ${extractedHinge ? `<div style="color: #9d174d; font-size: 0.8rem; margin-top: 5px;"><strong><i class="fa-solid fa-comments" style="margin-right: 4px;"></i>Hinge Question:</strong> ${formatRichText(extractedHinge)}</div>` : ''}
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `
    : '';

  const quizHtml = quiz.length
    ? `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">RETRIEVAL QUIZ</span>
          <strong style="font-size: 0.88rem; color: #0f172a;">Lesson Retrieval Quiz Answer Key (${quiz.length} Questions)</strong>
        </div>
        <ol style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 0.84rem; color: #334155; line-height: 1.55;">
          ${quiz
            .map((q) => {
              const opts = Array.isArray(q.options) ? q.options : [];
              let cText = q.answer || q.a || '';
              let cLetter = '';
              if (typeof q.correct === 'number' && opts[q.correct] !== undefined) {
                cLetter = String.fromCharCode(65 + q.correct);
                cText = opts[q.correct];
              } else if (cText && opts.length) {
                const foundIdx = opts.findIndex(
                  (o) => String(o).trim().toLowerCase() === String(cText).trim().toLowerCase(),
                );
                if (foundIdx >= 0) cLetter = String.fromCharCode(65 + foundIdx);
              }
              return `
                <li>
                  <div style="font-weight: 700; color: #0f172a;">${formatRichText(q.question || q.q || '')}</div>
                  <div style="color: #15803d; font-weight: 700;">&#10003; Correct${cLetter ? ` (${cLetter})` : ''}: ${formatRichText(cText)}</div>
                  ${q.explanation ? `<div style="color: #475569; font-size: 0.8rem;">${formatRichText(q.explanation)}</div>` : ''}
                </li>
              `;
            })
            .join('')}
        </ol>
      </div>
    `
    : '';

  return `
    <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #2563eb; border-radius: 6px; padding: 13px 18px; margin-bottom: 16px; font-size: 0.84rem; color: #1e3a8a;">
      <strong>Interactive Whiteboard (IWB) Live Classroom Key:</strong> Instant teacher crib for the on-screen Do Now starter, Primary Sources A–E, Consolidate Cloze paragraph, and Lesson Retrieval Quiz.
    </div>
    ${renderDoNowList(prevDoNow, 'DO NOW • SPACED RETRIEVAL', '#dbeafe', '#1e40af')}
    ${renderDoNowList(currDoNow, 'DO NOW • EXTENSION', '#e0e7ff', '#3730a3')}
    ${sourcesHtml}
    ${renderClozeKeyHTML(lesson?.vocab_cloze_text)}
    ${quizHtml}
  `;
}

function buildFallbackMisconceptions(lesson, tn) {
  if (Array.isArray(tn.misconceptions) && tn.misconceptions.length > 0) {
    return tn.misconceptions;
  }
  const items = [];
  if (Array.isArray(tn.objectives)) {
    tn.objectives.forEach((obj) => {
      if (obj && (obj.question || obj.primer)) {
        items.push({
          misconception: String(obj.question || obj.objective || 'Conceptual Check').replace(
            /^\*?\*?Hinge Question:\*?\*?\s*/i,
            '',
          ),
          correction: obj.primer || obj.objective || '',
        });
      }
    });
  }
  return items;
}

function printSecondaryTeacherGuide({ unitId, unitData, lesson, meta, tn, isGcse }) {
  const printWin = window.open('', '_blank', 'width=960,height=840');
  if (!printWin) {
    window.print();
    return;
  }
  const paperBadge = isGcse ? getCanonicalGcsePaperCode(unitId) : 'Key Stage 3 History';
  const unitTitle = unitData?.title || 'Curriculum Unit';
  const safeguardingHtml = renderSafeguardingCalloutHTML(tn);
  const deliveryHtml = renderDeliveryPlanCardsHTML(tn.delivery_plan);
  const objectivesHtml = Array.isArray(tn.objectives) && tn.objectives.length
    ? tn.objectives
        .map(
          (o, i) => `
          <div class="box">
            <strong>Objective ${i + 1}: ${formatRichText(o.objective || '')}</strong>
            ${o.primer ? `<div style="margin-top:3px;">${formatRichText(o.primer)}</div>` : ''}
            ${o.question ? `<div style="margin-top:3px; color:#1e3a8a; font-weight:700;">${formatRichText(o.question)}</div>` : ''}
          </div>`,
        )
        .join('')
    : '';
  const miscList = buildFallbackMisconceptions(lesson, tn);
  const miscHtml = miscList
    .map(
      (m, idx) => `
      <div class="box misc">
        <div style="font-weight:800;color:#991b1b;margin-bottom:3px;">Misconception ${idx + 1}: ${formatRichText(m.misconception || '')}</div>
        <div><strong>Historical Correction:</strong> ${formatRichText(m.correction || '')}</div>
      </div>`,
    )
    .join('');

  printWin.document.write(`<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8" />
  <title>${escHtml(meta.cleanTitle)} — Walk-In Teacher Guide</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Inter, Arial, sans-serif; color: #0f172a; line-height: 1.45; font-size: 9.5pt; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .hdr { background: #0f172a; color: #fff; padding: 12px 16px; border-radius: 6px; margin-bottom: 12px; border-bottom: 3px solid #be185d; }
    .hdr-kicker { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #fbcfe8; font-weight: 700; }
    .hdr h1 { margin: 4px 0; font-size: 13.5pt; }
    .hdr-eq { font-style: italic; font-size: 10pt; color: #e0f2fe; }
    h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.04em; color: #1e3a8a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin: 14px 0 8px; }
    .box { border: 1px solid #cbd5e1; border-radius: 5px; padding: 8px 11px; margin-bottom: 8px; break-inside: avoid; }
    .misc { background: #fef2f2; border-left: 4px solid #dc2626; }
    details { open: true; }
  </style>
</head>
<body>
  <div class="hdr">
    <div class="hdr-kicker">The History Revision Hub &bull; ${escHtml(paperBadge)} &bull; ${escHtml(unitTitle)} &bull; ${escHtml(meta.lessonLabel)}</div>
    <h1>${escHtml(meta.cleanTitle)}</h1>
    <div class="hdr-eq">Central Enquiry: ${escHtml(stripTags(meta.enquiryQuestion))}</div>
  </div>
  ${safeguardingHtml}
  <h2>1. Curriculum Focus &amp; 2-Lesson Delivery Plan</h2>
  <div class="box"><strong>Curriculum / Specification Focus:</strong> ${formatRichText(tn.curriculum_link)}</div>
  ${deliveryHtml}
  <h2>2. Non-Specialist Subject Knowledge Primer &amp; Adaptations</h2>
  ${tn.primer ? `<div class="box" style="background:#fffbeb;border-left:4px solid #d97706;">${formatRichText(tn.primer)}</div>` : ''}
  ${objectivesHtml}
  ${tn.send_adaptation ? `<div class="box"><strong>SEND Classroom Adaptation:</strong> ${formatRichText(tn.send_adaptation)}</div>` : ''}
  ${tn.stretch_challenge ? `<div class="box"><strong>High-Attaining Stretch Challenge:</strong> ${formatRichText(tn.stretch_challenge)}</div>` : ''}
  <h2>3. Diagnostic Hinge Question &amp; Common Misconceptions</h2>
  ${tn.hinge_question ? `<div class="box" style="background:#eff6ff;border-left:4px solid #2563eb;"><strong>Hinge Question:</strong> ${formatRichText(tn.hinge_question)}${tn.hinge_guidance ? `<br/><strong>What to Listen For:</strong> ${formatRichText(tn.hinge_guidance)}` : ''}</div>` : ''}
  ${miscHtml}
  <h2>4. Workbook &amp; Exam Answer Key</h2>
  ${renderWorkbookAndExamKeyHTML(lesson, isGcse).replace(/<details\b/g, '<details open')}
  <h2>5. Interactive Whiteboard (IWB) Lesson Answer Key</h2>
  ${renderSecondaryIwbAnswersHTML(lesson, tn)}
</body>
</html>`);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => {
    printWin.print();
  }, 250);
}

export async function openUnifiedTeacherGuidance(lessonId, lessonIndex, unitId, initialTab = 'tg-glance') {
  const resolvedUnitId =
    unitId ||
    appStore?.state?.selectedUnitId ||
    appStore?.state?.currentUnitId ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    appStore?.state?.activeUnitData?.id ||
    '';

  if (isKs2UnitId(resolvedUnitId)) {
    openKs2TeacherGuidanceModal(lessonId, lessonIndex);
    return;
  }

  const canonicalId = resolvedUnitId === 'gcse_middle_east_1945_1995' ? 'cme_new' : resolvedUnitId;
  const { unitData, sidecar } = await ensureUnitAndSidecarLoaded(canonicalId);
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  if (!lessons.length) return;

  let resolvedIdx =
    typeof lessonIndex === 'number' && lessonIndex >= 0 && lessonIndex < lessons.length
      ? lessonIndex
      : lessons.findIndex((l) => l && l.id === lessonId);
  if (resolvedIdx < 0) resolvedIdx = 0;

  const lesson = lessons[resolvedIdx];
  const isGcse = isGcseUnitId(canonicalId, unitData);
  const meta = getLessonDisplayMeta(lesson, resolvedIdx, lessons, isGcse);
  const tn = getMergedTeacherNotes(lesson, unitData, sidecar);
  const catEntry = getUnitCatalogEntry(canonicalId);
  const cohortBadge = isGcse ? 'GCSE Teacher Companion' : 'KS3 Teacher Companion';
  const cohortSubtitle = isGcse
    ? `Pearson Edexcel • ${getCanonicalGcsePaperCode(canonicalId)} • ${meta.lessonLabel}`
    : `${unitData?.year_group || 'Key Stage 3 History'} • ${meta.lessonLabel}`;

  const safeguardingHtml = renderSafeguardingCalloutHTML(tn);
  const hingeQuestionText =
    tn.hinge_question ||
    (Array.isArray(tn.objectives) && tn.objectives[0]?.question
      ? String(tn.objectives[0].question).replace(/^\*?\*?Hinge Question:\*?\*?\s*/i, '')
      : meta.enquiryQuestion);
  const hingeGuidanceText =
    tn.hinge_guidance ||
    (Array.isArray(tn.objectives) && tn.objectives[0]?.primer
      ? tn.objectives[0].primer
      : 'Listen for pupils anchoring their explanation in named historical evidence, dates, and causal mechanisms from the lesson narrative rather than unsupported assertions.');

  const misconceptionsList = buildFallbackMisconceptions(lesson, tn);
  const vocabPreview = Array.isArray(lesson?.vocab)
    ? lesson.vocab
        .slice(0, 3)
        .map((v) => v.term || v.word)
        .filter(Boolean)
        .join(', ')
    : '';
  const sendText =
    tn.send_adaptation ||
    `Pre-teach core vocabulary (${vocabPreview || 'key tier-3 terms'}), enable Studio Read-Aloud audio or SEN warm-cream mode in the top bar, and chunk the Verso Chronological Spine one stage at a time alongside the Dual-Coding Visual Story Sheet.`;
  const stretchText =
    tn.stretch_challenge ||
    `Challenge higher-attaining pupils to weigh relative causal importance across Stages 1–5 and connect this enquiry directly to the overarching unit question: "${stripTags(unitData?.enquiry_question || unitData?.enquiry || meta.enquiryQuestion)}".`;

  const skillsText =
    lesson?.skill ||
    tn.unitOverview?.disciplinary_threads ||
    (isGcse
      ? 'Edexcel AO1/AO2 Causal Explanation, AO3 Source Evidential Scrutiny & Substantiated Judgement.'
      : 'Historical Enquiry (Sources A–E), Chronological Sequencing, Causation & Historical Interpretations.');

  ['ks2WorksheetModalOverlay', 'ks2TeacherGuidanceModalOverlay', 'unifiedTeacherGuidanceModalOverlay'].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    },
  );

  const overlay = document.createElement('div');
  overlay.id = 'unifiedTeacherGuidanceModalOverlay';
  overlay.className = 'modal-overlay no-print';
  overlay.style.cssText =
    'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(8px); z-index: 99999; display: flex; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.22s ease;';

  overlay.innerHTML = `
    <div class="modal-content" style="background: #ffffff; border-radius: 12px; width: 94vw; max-width: 1200px; height: 92vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); transform: scale(0.97); transition: transform 0.22s ease; font-family: 'Inter', sans-serif; color: #0f172a;">
      
      <!-- Modal Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; border-bottom: 3px solid #be185d;">
        <div style="display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1 1 320px;">
          <div style="width: 42px; height: 42px; border-radius: 8px; background: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.24); display: flex; align-items: center; justify-content: center; color: #fbcfe8; font-size: 1.2rem; flex-shrink: 0;">
            <i class="fa-solid fa-chalkboard-user"></i>
          </div>
          <div style="min-width: 0;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 0.71rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(244, 114, 182, 0.22); border: 1px solid rgba(251, 207, 232, 0.4); color: #fce7f3; padding: 2px 8px; border-radius: 4px;">${escHtml(cohortBadge)}</span>
              <span style="font-size: 0.73rem; font-weight: 600; color: #cbd5e1;">${escHtml(cohortSubtitle)}</span>
            </div>
            <h2 style="margin: 3px 0 0 0; font-size: 1.2rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; line-height: 1.25;">${escHtml(meta.cleanTitle)}</h2>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <select id="unifiedGuidanceLessonSelect" aria-label="Select Lesson" style="background: #0f172a; color: #f1f5f9; border: 1px solid #475569; padding: 7px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; outline: none; max-width: min(320px, 65vw);">
            ${lessons
              .map((l, idx) => {
                const m = getLessonDisplayMeta(l, idx, lessons, isGcse);
                return `<option value="${idx}" ${idx === resolvedIdx ? 'selected' : ''}>${escHtml(m.shortOptionPrefix)}: ${escHtml(m.cleanTitle)}</option>`;
              })
              .join('')}
          </select>

          <button type="button" id="printUnifiedTeacherGuideBtn" style="background: rgba(255, 255, 255, 0.15); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.28); font-weight: 700; font-size: 0.8rem; padding: 7px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
            <i class="fa-solid fa-print"></i> Print Full Guide
          </button>

          <button type="button" id="unifiedGuidanceModalClose" aria-label="Close Teacher Guidance" style="background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.24); color: #ffffff; font-size: 1.1rem; width: 34px; height: 34px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- 5 Navigation Tabs -->
      <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; gap: 4px; overflow-x: auto; flex-shrink: 0;">
        <button type="button" class="tg-tab" data-target="tg-glance" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.84rem; padding: 12px 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <i class="fa-solid fa-clipboard-list"></i> <span>At A Glance</span>
        </button>
        <button type="button" class="tg-tab" data-target="tg-primer" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.84rem; padding: 12px 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <i class="fa-solid fa-brain"></i> <span>Subject Knowledge Primer</span>
        </button>
        <button type="button" class="tg-tab" data-target="tg-misconceptions" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.84rem; padding: 12px 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <i class="fa-solid fa-triangle-exclamation"></i> <span>Misconceptions &amp; Hinge Discussion</span>
        </button>
        <button type="button" class="tg-tab" data-target="tg-answers" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.84rem; padding: 12px 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <i class="fa-solid fa-key"></i> <span>Workbook &amp; Exam Key</span>
        </button>
        <button type="button" class="tg-tab" data-target="tg-iwb-answers" style="background: transparent; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 700; font-size: 0.84rem; padding: 12px 15px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <i class="fa-solid fa-chalkboard"></i> <span>IWB Lesson Answers</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div style="flex: 1; overflow-y: auto; padding: 24px; background: #ffffff;">
        
        <!-- TAB 1: AT A GLANCE -->
        <div id="tg-glance" class="tg-section" style="display: none;">
          ${safeguardingHtml}

          <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #1e3a8a; border-radius: 8px; padding: 15px 20px; margin-bottom: 18px;">
            <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #1e3a8a; letter-spacing: 0.05em; margin-bottom: 4px;">Central Historical Enquiry Question</div>
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.22rem; font-weight: 700; color: #1e3a8a; line-height: 1.4;">
              ${formatRichText(meta.enquiryQuestion)}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 22px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px 18px;">
              <h4 style="margin: 0 0 7px 0; font-size: 0.87rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-landmark" style="color: #2563eb;"></i>
                <span>${isGcse ? 'Edexcel Specification &amp; Exam Focus' : 'National Curriculum &amp; Enquiry Focus'}</span>
              </h4>
              <div style="font-size: 0.84rem; color: #334155; line-height: 1.58;">
                ${formatRichText(tn.curriculum_link || lesson?.specification_anchor || catEntry?.specSubtitle || unitData?.title || '')}
              </div>
              ${
                lesson?.specification_anchor &&
                tn.curriculum_link &&
                tn.curriculum_link !== lesson.specification_anchor
                  ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 0.79rem; color: #475569;"><strong>Spec Anchor:</strong> ${formatRichText(lesson.specification_anchor)}</div>`
                  : ''
              }
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px 18px;">
              <h4 style="margin: 0 0 7px 0; font-size: 0.87rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-graduation-cap" style="color: #16a34a;"></i>
                <span>Key Disciplinary Skills</span>
              </h4>
              <div style="font-size: 0.84rem; color: #334155; line-height: 1.58;">
                ${formatRichText(skillsText)}
              </div>
            </div>
          </div>

          ${renderDeliveryPlanCardsHTML(tn.delivery_plan)}
          ${renderPrintableLinksBarHTML(canonicalId)}
        </div>

        <!-- TAB 2: SUBJECT KNOWLEDGE PRIMER -->
        <div id="tg-primer" class="tg-section" style="display: none;">
          ${safeguardingHtml}

          ${
            tn.primer
              ? `<div style="background: #fffdfa; border: 1.5px solid #fed7aa; border-left: 5px solid #d97706; border-radius: 8px; padding: 18px 22px; margin-bottom: 20px;">
                  <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #b45309; letter-spacing: 0.05em; margin-bottom: 6px;">Non-Specialist Subject Knowledge Primer</div>
                  <div style="font-size: 0.93rem; color: #1e293b; line-height: 1.7;">
                    ${formatRichText(tn.primer)}
                  </div>
                </div>`
              : ''
          }

          ${
            Array.isArray(tn.objectives) && tn.objectives.length
              ? `<h3 style="font-size: 0.96rem; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">Lesson Learning Objectives &amp; Probing Checks</h3>
                 <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                  ${tn.objectives
                    .map(
                      (obj, idx) => `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #1e3a8a; border-radius: 6px; padding: 12px 16px;">
                      <div style="font-weight: 800; font-size: 0.87rem; color: #0f172a; margin-bottom: 4px;">${idx + 1}. ${formatRichText(obj.objective || '')}</div>
                      ${obj.primer ? `<div style="font-size: 0.84rem; color: #334155; line-height: 1.55; margin-bottom: 5px;">${formatRichText(obj.primer)}</div>` : ''}
                      ${obj.question ? `<div style="font-size: 0.82rem; color: #1e40af; font-weight: 700; background: #eff6ff; padding: 6px 10px; border-radius: 4px;">${formatRichText(obj.question)}</div>` : ''}
                    </div>
                  `,
                    )
                    .join('')}
                 </div>`
              : ''
          }

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
            <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 5px solid #16a34a; border-radius: 8px; padding: 15px 18px;">
              <h4 style="margin: 0 0 6px 0; font-size: 0.86rem; font-weight: 800; color: #14532d; display: flex; align-items: center; gap: 7px;">
                <i class="fa-solid fa-universal-access" style="color: #16a34a;"></i>
                <span>SEND &amp; Accessible Classroom Adaptation</span>
              </h4>
              <div style="font-size: 0.84rem; color: #1e293b; line-height: 1.6;">
                ${formatRichText(sendText)}
              </div>
            </div>

            <div style="background: #eef2ff; border: 1.5px solid #c7d2fe; border-left: 5px solid #4338ca; border-radius: 8px; padding: 15px 18px;">
              <h4 style="margin: 0 0 6px 0; font-size: 0.86rem; font-weight: 800; color: #312e81; display: flex; align-items: center; gap: 7px;">
                <i class="fa-solid fa-arrow-up-right-dots" style="color: #4338ca;"></i>
                <span>High-Attaining Stretch Challenge</span>
              </h4>
              <div style="font-size: 0.84rem; color: #1e293b; line-height: 1.6;">
                ${formatRichText(stretchText)}
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: MISCONCEPTIONS & HINGE DISCUSSION -->
        <div id="tg-misconceptions" class="tg-section" style="display: none;">
          <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #2563eb; border-radius: 8px; padding: 18px 22px; margin-bottom: 22px;">
            <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #1e40af; letter-spacing: 0.05em; margin-bottom: 4px;">Targeted Hinge Discussion Question</div>
            <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.15rem; font-weight: 700; color: #1e3a8a; line-height: 1.48; margin-bottom: 10px;">
              ${formatRichText(hingeQuestionText)}
            </div>
            <div style="font-size: 0.81rem; color: #1d4ed8; font-weight: 800;">
              <i class="fa-solid fa-lightbulb" style="margin-right: 5px; color: #eab308;"></i>Teacher Guidance on Pupil Responses:
            </div>
            <div style="font-size: 0.85rem; color: #1e293b; margin-top: 4px; line-height: 1.6;">
              ${formatRichText(hingeGuidanceText)}
            </div>
          </div>

          <h3 style="font-size: 0.98rem; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">Common Pupil Misconceptions &amp; Historical Corrections</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${
              misconceptionsList.length
                ? misconceptionsList
                    .map(
                      (m, idx) => `
                    <div style="background: #ffffff; border: 1.5px solid #fecaca; border-left: 5px solid #dc2626; border-radius: 8px; padding: 14px 18px;">
                      <div style="display: flex; align-items: flex-start; gap: 8px; color: #991b1b; font-size: 0.86rem; font-weight: 800; margin-bottom: 6px;">
                        <i class="fa-solid fa-triangle-exclamation" style="margin-top: 3px; flex-shrink: 0;"></i>
                        <span>Misconception ${idx + 1}: ${formatRichText(m.misconception || '')}</span>
                      </div>
                      <div style="color: #1e293b; font-size: 0.84rem; line-height: 1.6; background: #fef2f2; padding: 10px 14px; border-radius: 5px;">
                        <strong>Historical Correction:</strong> ${formatRichText(m.correction || '')}
                      </div>
                    </div>
                  `,
                    )
                    .join('')
                : `<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; font-size: 0.85rem; color: #475569;">Use the Hinge Discussion Question above and Source A–E Hinge Questions in Tab 5 to check pupil conceptual security before starting independent writing.</div>`
            }
          </div>
        </div>

        <!-- TAB 4: WORKBOOK & EXAM KEY -->
        <div id="tg-answers" class="tg-section" style="display: none;">
          ${renderWorkbookAndExamKeyHTML(lesson, isGcse)}
        </div>

        <!-- TAB 5: IWB LESSON ANSWERS -->
        <div id="tg-iwb-answers" class="tg-section" style="display: none;">
          ${renderSecondaryIwbAnswersHTML(lesson, tn)}
        </div>

      </div>

      <!-- Modal Footer -->
      <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 11px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 0.8rem; color: #64748b; flex-shrink: 0;">
        <div>
          <strong>The History Revision Hub:</strong> Walk-In ${isGcse ? 'GCSE' : 'Key Stage 3'} Teacher Guidance &amp; Classroom Answer Crib.
        </div>
        <button type="button" id="unifiedGuidanceModalBottomClose" style="background: #0f172a; color: #ffffff; border: none; font-weight: 700; font-size: 0.78rem; padding: 6px 14px; border-radius: 6px; cursor: pointer;">
          Close Guide
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  let activeTabId = initialTab || 'tg-glance';
  const tabs = overlay.querySelectorAll('.tg-tab');
  const sections = overlay.querySelectorAll('.tg-section');

  const activateTab = (targetSecId) => {
    activeTabId = targetSecId;
    tabs.forEach((t) => {
      const isMatch = t.getAttribute('data-target') === targetSecId;
      t.style.borderBottomColor = isMatch ? '#1e3a8a' : 'transparent';
      t.style.color = isMatch ? '#1e3a8a' : '#64748b';
      t.style.fontWeight = isMatch ? '800' : '700';
      t.classList.toggle('active', isMatch);
    });
    sections.forEach((s) => {
      s.style.display = s.id === targetSecId ? 'block' : 'none';
    });
  };

  activateTab(activeTabId);

  tabs.forEach((tab) => {
    tab.onclick = () => activateTab(tab.getAttribute('data-target'));
  });

  const closeModal = () => {
    window.removeEventListener('keydown', handleEsc);
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 220);
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  window.addEventListener('keydown', handleEsc);

  overlay.querySelector('#unifiedGuidanceModalClose').onclick = closeModal;
  overlay.querySelector('#unifiedGuidanceModalBottomClose').onclick = closeModal;
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };

  overlay.querySelector('#printUnifiedTeacherGuideBtn').onclick = () => {
    printSecondaryTeacherGuide({
      unitId: canonicalId,
      unitData,
      lesson,
      meta,
      tn,
      isGcse,
    });
  };

  const lessonSelect = overlay.querySelector('#unifiedGuidanceLessonSelect');
  lessonSelect.onchange = (e) => {
    const nextIdx = parseInt(e.target.value, 10);
    const nextLesson = lessons[nextIdx];
    window.removeEventListener('keydown', handleEsc);
    openUnifiedTeacherGuidance(nextLesson?.id, nextIdx, canonicalId, activeTabId);
  };

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    const contentEl = overlay.querySelector('.modal-content');
    if (contentEl) contentEl.style.transform = 'scale(1)';
  });
}

if (typeof window !== 'undefined') {
  window.openUnifiedTeacherGuidance = openUnifiedTeacherGuidance;
}
