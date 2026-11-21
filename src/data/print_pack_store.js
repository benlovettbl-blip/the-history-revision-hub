/**
 * Annual School Subscription & Dual-Code Licensing Engine (feat/commercial-licensing)
 *
 * Architecture ("First Enquiry Free" + 4-Tier Annual School Subscription):
 *   1. Public / Free Visitor:
 *      - All 19 Course Overviews + Enquiry 1 (Lesson 1) of every unit are 100% FREE
 *        (including Lesson 1 Studio Audio, Primary Sources, Story Sheet, Lesson Quiz & Cloze)
 *      - 3 Sample Printable PDFs on /schools/ are free for Head of Department inspection
 *   2. Subscribed Pupil (Annual Pupil Class Code, e.g. `HUB26`, `GCSE26`, `KS3-26`, `CME26` or `?access=HUB26`):
 *      - Unlocks Lessons 2+ digital lessons, Studio Audio, Guided Reading, Whole-Unit Quiz Banks,
 *        Living Timelines, and Revision Arcade across the school's subscribed tier
 *      - Zero student names/emails stored = Zero UK GDPR Data Processing Agreement friction
 *      - Printable Master PDFs & Teacher Mark Schemes remain safely hidden from pupils
 *   3. Subscribed Teacher / Staff (Annual Teacher Staff Key):
 *      - Unlocks 100% of Digital Lessons + All Printable PDF Booklets, Grade 8/9 WAGOLL Mark Schemes,
 *        Schemes of Work, Smartboard Answer Reveal, Plenary Projector & Instant Cover Generator
 */

import { UNIT_RESOURCES_CATALOG, isStaffModeActive } from './unit_resources_catalog.js';
import { SEO_UNIT_ROUTES } from './seo_routes.js';

export const PUPIL_LICENCE_STORAGE_KEY = 'hh_school_pupil_licence_v1';
export const PREVIEW_ROLE_SESSION_KEY = 'hh_commercial_preview_role';

export const GCSE_UNIT_IDS = new Set([
  'edexcel_medicine',
  'eee',
  'gcse_cold_war',
  'cme_new',
  'weimar_nazi_germany',
  'usa',
]);

export const ANNUAL_SUBSCRIPTION_TIERS = [
  {
    id: 'tier_ks2',
    badge: 'Primary Schools',
    title: 'Primary WWII Licence (KS2)',
    price: 69,
    priceLabel: '£69 / yr',
    billingNote: 'Annual whole-school licence • Sept–Aug',
    accent: '#0284c7',
    desc: 'Complete 11-lesson KS2 World War II & The Home Front digital platform, studio audio, Parent-Child Guided Reading, 4-card storyboards, plus all printable Textbooks, 28p Pupil Workbooks, Worksheets & Teacher Guide.',
  },
  {
    id: 'tier_single',
    badge: 'Single Course Trial',
    title: 'Single-Course Licence (1 GCSE or KS3 Unit)',
    price: 79,
    priceLabel: '£79 / yr',
    billingNote: 'Annual whole-school licence • Any 1 course',
    accent: '#059669',
    desc: 'Unlock all digital lessons, studio audio, quizzes, games, Printable Textbooks, Pupil Workbooks, and Grade 8/9 WAGOLL Mark Schemes for any single course (ideal for trialling one GCSE paper).',
  },
  {
    id: 'tier_keystage',
    badge: 'Most Popular',
    title: 'Key Stage Licence (All 12 KS3 or All 6 GCSE)',
    price: 149,
    priceLabel: '£149 / yr',
    billingNote: 'Annual whole-department licence • Unlimited classes',
    accent: '#7c3aed',
    featured: true,
    desc: 'Unlimited classes and teachers across either all 12 KS3 National Curriculum units OR all 6 Pearson Edexcel GCSE courses—digital lessons, audio, games, print-room PDFs, WAGOLLs & summer Mock/Radar updates.',
  },
  {
    id: 'tier_all_access',
    badge: 'Best Department Value',
    title: 'Whole-Department All-Access (All 19 Courses)',
    price: 229,
    priceLabel: '£229 / yr',
    billingNote: 'Annual all-in licence • KS2 + KS3 + GCSE',
    accent: '#d97706',
    desc: 'Everything on the platform across all 19 courses: 833 studio-voiced narrative blocks, 171 Visual Story Sheets, showcase games, 100+ print-room PDFs, WAGOLL Mark Schemes, Plenary Projector & Cover Generator.',
  },
];

/**
 * Valid Annual Pupil Class Codes (case-insensitive).
 * Supports All-Access (`HUB26`), Key-Stage (`GCSE26`, `KS3-26`, `KS2-26`), and Single-Unit codes (`MED26`, `EEE26`, `CW26`, `CME26`, `GER26`, `USA26`).
 */
const PUPIL_CLASS_CODE_SCOPES = {
  HUB26: { label: 'All-Access School Licence (2026–27)', scope: 'all' },
  SCHOOL26: { label: 'All-Access School Licence (2026–27)', scope: 'all' },
  GCSE26: { label: 'Edexcel GCSE Key Stage Licence (2026–27)', scope: 'gcse' },
  'KS3-26': { label: 'KS3 Key Stage Licence (2026–27)', scope: 'ks3' },
  KS326: { label: 'KS3 Key Stage Licence (2026–27)', scope: 'ks3' },
  'KS2-26': { label: 'Primary KS2 WWII Licence (2026–27)', scope: 'ks2' },
  KS226: { label: 'Primary KS2 WWII Licence (2026–27)', scope: 'ks2' },
  MED26: { label: 'GCSE Medicine Single-Course Licence', scope: 'unit:edexcel_medicine' },
  EEE26: { label: 'GCSE Elizabeth Single-Course Licence', scope: 'unit:eee' },
  CW26: { label: 'GCSE Cold War Single-Course Licence', scope: 'unit:gcse_cold_war' },
  CME26: { label: 'GCSE Middle East Single-Course Licence', scope: 'unit:cme_new' },
  GER26: { label: 'GCSE Weimar & Nazi Germany Licence', scope: 'unit:weimar_nazi_germany' },
  USA26: { label: 'GCSE USA 1954–75 Single-Course Licence', scope: 'unit:usa' },
};

export const ALLOWED_PUBLIC_SAMPLE_PDFS = new Set([
  '/pdfs/eee_textbook_KT1.pdf',
  '/pdfs/gcse_cold_war_pupil_workbook_KT1.pdf',
  '/pdfs/ks2_ww2_retrieval_companion.pdf',
  '/master_rights_register.html',
  '/pdfs/master_provenance_copyright_register.pdf',
]);

export function isPublicSampleAsset(url = '') {
  if (!url) return false;
  const clean = String(url).split('?')[0].split('#')[0].trim();
  return ALLOWED_PUBLIC_SAMPLE_PDFS.has(clean);
}

export function verifyAndSavePupilClassCode(rawCode, { persist = true } = {}) {
  const cleaned = String(rawCode || '').trim().toUpperCase();
  if (!cleaned) return null;
  const entry = PUPIL_CLASS_CODE_SCOPES[cleaned];
  if (!entry) return null;
  if (persist && typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        PUPIL_LICENCE_STORAGE_KEY,
        JSON.stringify({ code: cleaned, scope: entry.scope, label: entry.label, ts: Date.now() }),
      );
      sessionStorage.removeItem(PREVIEW_ROLE_SESSION_KEY);
    } catch (e) {}
  }
  return { code: cleaned, ...entry };
}

export function getActivePupilLicence() {
  if (typeof window === 'undefined') return null;
  try {
    const previewRole = sessionStorage.getItem(PREVIEW_ROLE_SESSION_KEY);
    if (previewRole === 'public') return null;
    if (previewRole === 'pupil') {
      return { code: 'HUB26', scope: 'all', label: 'Preview: Subscribed Pupil (HUB26)' };
    }
    const raw = localStorage.getItem(PUPIL_LICENCE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.code && PUPIL_CLASS_CODE_SCOPES[parsed.code]) {
      return { code: parsed.code, ...PUPIL_CLASS_CODE_SCOPES[parsed.code] };
    }
  } catch (e) {}
  return null;
}

export function isUnitUnlockedForPupil(unitId) {
  if (!unitId || unitId === 'trip_ypres') return true;
  if (isStaffModeActive()) return true;

  const lic = getActivePupilLicence();
  if (!lic) return false;
  if (lic.scope === 'all') return true;
  if (lic.scope === 'gcse') return GCSE_UNIT_IDS.has(unitId);
  if (lic.scope === 'ks2') return unitId === 'ks2_ww2' || String(unitId).startsWith('ks2');
  if (lic.scope === 'ks3') {
    return !GCSE_UNIT_IDS.has(unitId) && unitId !== 'ks2_ww2' && !String(unitId).startsWith('ks2');
  }
  if (lic.scope.startsWith('unit:')) {
    return lic.scope.slice(5) === unitId;
  }
  return false;
}

/**
 * First Lesson Free Rule:
 * Index 0 is 100% free on every unit (plus index 1 on `cme_new` since index 0 is the KT 1.0 Intro).
 */
export function isFreeSampleLesson(unitId, lessonIndex) {
  if (!unitId || unitId === 'trip_ypres') return true;
  const idx = Number(lessonIndex);
  if (isNaN(idx) || idx <= 0) return true;
  if (unitId === 'cme_new' && idx === 1) return true;
  return false;
}

export function canAccessUnitLesson(unitId, lessonIndex) {
  if (isFreeSampleLesson(unitId, lessonIndex)) return true;
  return isUnitUnlockedForPupil(unitId);
}

/**
 * Auto-captures `?access=HUB26` or `?classcode=HUB26` from Google Classroom / MS Teams links
 * so pupils on wiped school Chromebooks unlock silently in zero clicks.
 */
export function initCommercialAccessFromUrl() {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const urlAccessCode = params.get('access') || params.get('classcode');
    if (urlAccessCode) {
      const matched = verifyAndSavePupilClassCode(urlAccessCode, { persist: true });
      if (matched && window.history && window.history.replaceState) {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('access');
        cleanUrl.searchParams.delete('classcode');
        window.history.replaceState(window.history.state || {}, '', cleanUrl);
      }
    }
    const previewParam = (params.get('preview') || '').toLowerCase();
    if (previewParam === 'public') {
      setCommercialPreviewRole('public', { reloadView: false });
    } else if (previewParam === 'pupil') {
      setCommercialPreviewRole('pupil', { reloadView: false });
    } else if (previewParam === 'staff') {
      const isLocal =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) setCommercialPreviewRole('staff', { reloadView: false });
    }
  } catch (e) {}
}

export function getCommercialPreviewRole() {
  if (typeof window === 'undefined') return 'public';
  if (isStaffModeActive()) return 'staff';
  if (getActivePupilLicence()) return 'pupil';
  return 'public';
}

export function setCommercialPreviewRole(role, { reloadView = true } = {}) {
  if (typeof window === 'undefined') return;
  const isLocal =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  try {
    if (role === 'public') {
      sessionStorage.setItem('hh_preview_as_pupil', 'true');
      sessionStorage.setItem(PREVIEW_ROLE_SESSION_KEY, 'public');
      window.isTeacherMode = false;
    } else if (role === 'pupil') {
      sessionStorage.setItem('hh_preview_as_pupil', 'true');
      sessionStorage.setItem(PREVIEW_ROLE_SESSION_KEY, 'pupil');
      window.isTeacherMode = false;
    } else if (role === 'staff' && isLocal) {
      sessionStorage.removeItem('hh_preview_as_pupil');
      sessionStorage.removeItem(PREVIEW_ROLE_SESSION_KEY);
      localStorage.setItem('history_hub_teacher_mode', 'true');
      window.isTeacherMode = true;
    }
  } catch (e) {}

  if (typeof window.syncStaffUiState === 'function') window.syncStaffUiState();
  renderLocalhostPreviewBanner();

  if (reloadView && typeof window.switchView === 'function') {
    const curView = (window.state && window.state.currentView) || window.currentView || 'dashboard';
    const curUnit = (window.state && window.state.selectedUnitId) || window.currentUnitId;
    if (curView === 'lessons' && curUnit) {
      if (
        typeof window.currentLessonIndex === 'number' &&
        window.currentLessonIndex >= 0 &&
        canAccessUnitLesson(curUnit, window.currentLessonIndex) &&
        typeof window.viewLessonDetail === 'function'
      ) {
        window.viewLessonDetail(window.currentLessonIndex, null, true);
      } else {
        window.currentLessonIndex = null;
        window.switchView('lessons', curUnit, true);
      }
    } else {
      window.switchView(curView, curUnit, true);
    }
  }
}

export function renderLocalhostPreviewBanner() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const isLocal =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocal) return;

  let bar = document.getElementById('hh-localhost-role-switcher');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'hh-localhost-role-switcher';
    bar.className = 'no-print';
    document.body.prepend(bar);
  }

  const role = getCommercialPreviewRole();
  const btnStyle = (active, color) =>
    `padding:5px 11px;border-radius:6px;font-size:0.75rem;font-weight:800;cursor:pointer;border:1.5px solid ${active ? color : 'rgba(255,255,255,0.2)'};background:${active ? color : 'rgba(255,255,255,0.06)'};color:#ffffff;transition:all 0.15s ease;`;

  bar.style.cssText =
    'background:#09111f;color:#f8fafc;border-bottom:1px solid #334155;padding:7px 16px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px;font-family:"Outfit",sans-serif;font-size:0.78rem;z-index:9999;position:relative;';

  bar.innerHTML = `
    <span style="color:#94a3b8;font-weight:700;">
      <i class="fa-solid fa-flask" style="color:#38bdf8;margin-right:5px;"></i>Branch Preview (<code style="color:#7dd3fc;">feat/commercial-licensing</code>):
    </span>
    <div style="display:inline-flex;flex-wrap:wrap;gap:6px;">
      <button type="button" data-role-btn="public" style="${btnStyle(role === 'public', '#0284c7')}">
        1. Public Visitor (Lesson 1 Free • L2+ &amp; PDFs Locked)
      </button>
      <button type="button" data-role-btn="pupil" style="${btnStyle(role === 'pupil', '#7c3aed')}">
        2. Subscribed Pupil (Code: HUB26 • All Lessons Open • PDFs/Keys Hidden)
      </button>
      <button type="button" data-role-btn="staff" style="${btnStyle(role === 'staff', '#059669')}">
        3. Subscribed Teacher (Staff Key • Everything Unlocked)
      </button>
    </div>
    <button type="button" data-go-schools="1" style="padding:5px 10px;border-radius:6px;font-size:0.74rem;font-weight:700;cursor:pointer;background:transparent;color:#7dd3fc;border:1px solid rgba(125,211,252,0.35);">
      View /schools/ Tiers &rarr;
    </button>
  `;

  bar.querySelectorAll('[data-role-btn]').forEach((b) => {
    b.addEventListener('click', () => {
      setCommercialPreviewRole(b.getAttribute('data-role-btn'), { reloadView: true });
    });
  });
  bar.querySelector('[data-go-schools]')?.addEventListener('click', () => {
    if (typeof window.switchView === 'function') window.switchView('schools');
  });
}

export function inferUnitIdFromAssetUrl(url = '', fallbackUnitId = null) {
  const s = String(url || '').toLowerCase();
  for (const uid of Object.keys(UNIT_RESOURCES_CATALOG)) {
    if (s.includes(`/${uid}/`) || s.includes(`/${uid}_`)) return uid;
  }
  if (s.includes('cold_war_mock')) return 'gcse_cold_war';
  if (s.includes('cme_')) return 'cme_new';
  if (s.includes('year10_germany')) return 'weimar_nazi_germany';
  if (s.includes('year11_usa')) return 'usa';
  return (
    fallbackUnitId ||
    (typeof window !== 'undefined' &&
      (window.currentUnitId || (window.state && window.state.selectedUnitId))) ||
    'edexcel_medicine'
  );
}

export function getUnitPackDetails(unitId) {
  const cleanId = unitId && UNIT_RESOURCES_CATALOG[unitId] ? unitId : 'edexcel_medicine';
  const cat = UNIT_RESOURCES_CATALOG[cleanId] || {};
  const seo = SEO_UNIT_ROUTES.find((r) => r.unitId === cleanId) || {};
  const isGcse = GCSE_UNIT_IDS.has(cleanId) || cat.stage === 'gcse';
  const isKs2 = cleanId === 'ks2_ww2' || cat.stage === 'ks2';

  const singlePriceLabel = isKs2 ? '£69 / yr' : '£79 / yr';
  const keyStagePriceLabel = isKs2 ? '£69 / yr' : '£149 / yr';

  const items = [
    'All Digital Enquiry Lessons, Studio Historian Audio Read-Alouds, Visual Story Sheets & Retrieval Quizzes',
  ];
  if (cat.textbook) {
    items.push(
      `${cat.textbook.title || 'Master Classroom Textbook'} (${cat.textbook.pages || 'Printable A3/A4 PDF'})`,
    );
  }
  if (cat.workbook) {
    const hasMs = Boolean(
      cat.workbook.markSchemePdfUrl ||
        cat.workbook.markSchemeHtmlUrl ||
        (Array.isArray(cat.workbook.editions) &&
          cat.workbook.editions.some((e) => e.msPdfUrl || e.msHtmlUrl)),
    );
    items.push(
      `${cat.workbook.title || 'Double-Page Pupil Workbook'} (${cat.workbook.pages || 'PDF'})${hasMs ? ' + Paired Teacher Mark Schemes & WAGOLLs' : ''}`,
    );
  }
  if (cat.retrieval) {
    items.push(
      `${cat.retrieval.title || 'Master Knowledge Retrieval Companion'} (${cat.retrieval.pages || 'PDF'} • Rear Marking Bank)`,
    );
  }
  if (cat.masteryExamPack) {
    items.push(`${cat.masteryExamPack.title} + Predicted Mock Exam Papers & Mark Schemes`);
  }
  items.push(
    'Smartboard Teacher Mode: 2-Lesson Delivery Plans, Source Crib Notes, Hinge Questions & Cover Generator',
  );

  return {
    unitId: cleanId,
    unitTitle: cat.unitTitle || seo.heading || 'History Course',
    subtitle: cat.specSubtitle || seo.examBoard || 'Digital + Print School Subscription',
    isGcse,
    isKs2,
    priceLabel: singlePriceLabel,
    keyStagePriceLabel,
    tierName: isKs2 ? 'Primary WWII Annual Licence' : 'Annual School Subscription',
    items,
  };
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function openUnitPrintPackModal(unitId = null, requestedResourceTitle = '', opts = {}) {
  if (typeof document === 'undefined') return;
  const resolvedId = unitId || inferUnitIdFromAssetUrl('', null);
  const pack = getUnitPackDetails(resolvedId);
  const pupilAlreadyUnlocked = isUnitUnlockedForPupil(resolvedId);
  const isLessonGate = opts.mode === 'lesson';

  const existing = document.getElementById('hh-print-pack-modal-overlay');
  if (existing) existing.remove();

  const subject = encodeURIComponent(
    `School Subscription Enquiry — ${pack.unitTitle} (The History Revision Hub)`,
  );
  const body = encodeURIComponent(
    `Hello The History Revision Hub,\n\nWe would like to set up an Annual School Subscription (Sept–Aug):\n\n• Interested Tier:\n  [ ] Single Course (${pack.unitTitle}) — ${pack.priceLabel}\n  [ ] Key Stage Licence (All 12 KS3 or All 6 GCSE) — £149 / yr\n  [ ] Whole-Department All-Access (All 19 Courses) — £229 / yr\n\nSchool Name:\nPayment Preference (School Procurement Card Link or School Invoice / PO):\n\nThank you!`,
  );
  const mailtoHref = `mailto:contact@historyrevisionhub.co.uk?subject=${subject}&body=${body}`;

  const overlay = document.createElement('div');
  overlay.id = 'hh-print-pack-modal-overlay';
  overlay.className = 'no-print';
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(15,23,42,0.84);backdrop-filter:blur(6px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;';

  overlay.innerHTML = `
    <div role="dialog" aria-modal="true" aria-labelledby="hh-pack-modal-title" style="background:#ffffff;color:#0f172a;border-radius:16px;max-width:680px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);border:1px solid #cbd5e1;font-family:'Outfit',sans-serif;">
      <!-- Top Header -->
      <div style="background:linear-gradient(135deg,#0c2340,#1e293b);color:#ffffff;padding:20px 24px;border-bottom:1px solid #334155;display:flex;align-items:flex-start;justify-content:space-between;gap:14px;">
        <div>
          <div style="display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#7dd3fc;background:rgba(56,189,248,0.14);border:1px solid rgba(56,189,248,0.35);padding:3px 10px;border-radius:999px;margin-bottom:8px;">
            <i class="fa-solid fa-school"></i> Annual School Subscription &bull; First Enquiry Free
          </div>
          <h2 id="hh-pack-modal-title" style="margin:0 0 4px;font-size:1.3rem;font-weight:800;line-height:1.25;color:#ffffff;">
            ${escapeHtml(pack.unitTitle)}
          </h2>
          <div style="font-size:0.84rem;color:#cbd5e1;">
            ${escapeHtml(pack.subtitle)}
          </div>
        </div>
        <button type="button" id="hh-pack-modal-close" aria-label="Close" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#f8fafc;width:34px;height:34px;border-radius:8px;cursor:pointer;font-size:1rem;flex-shrink:0;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div style="padding:20px 24px;display:flex;flex-direction:column;gap:16px;">
        ${
          requestedResourceTitle
            ? `<div style="background:#f0f9ff;border:1px solid #bae6fd;color:#0c4a6e;padding:10px 14px;border-radius:10px;font-size:0.85rem;line-height:1.5;">
                <i class="fa-solid fa-lock" style="color:#0284c7;margin-right:6px;"></i>
                ${
                  pupilAlreadyUnlocked
                    ? `<strong>${escapeHtml(requestedResourceTitle)}</strong> is a <strong>Teacher-Only Printable / Mark Scheme</strong> resource. Enter your <strong>Teacher Staff Key</strong> below to unlock printables and answers.`
                    : `<strong>${escapeHtml(requestedResourceTitle)}</strong> requires an <strong>Annual School Subscription</strong>. Enquiry 1 of every course is free to explore—enter your school's <strong>Pupil Class Code</strong> or <strong>Teacher Key</strong> below, or subscribe for your department.`
                }
              </div>`
            : ''
        }

        <!-- Dual Code Unlock Box (Pupils & Teachers) -->
        <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;padding:14px 16px;">
          <div style="font-size:0.8rem;font-weight:800;color:#0f172a;margin-bottom:8px;">
            <i class="fa-solid fa-key" style="color:#7c3aed;margin-right:6px;"></i>
            Already at a Subscribing School? Enter Your Class Code or Teacher Key:
          </div>
          <form id="hh-unified-code-form" style="display:flex;gap:8px;flex-wrap:wrap;">
            <input
              type="text"
              id="hh-unified-code-input"
              placeholder="${pupilAlreadyUnlocked ? 'Enter Teacher Staff Key...' : 'e.g. Class Code HUB26 or Teacher Staff Key...'}"
              autocomplete="off"
              style="flex:1;min-width:200px;padding:9px 12px;border-radius:8px;border:1px solid #94a3b8;font-size:0.88rem;font-weight:600;color:#0f172a;background:#ffffff;"
            />
            <button type="submit" style="padding:9px 16px;border-radius:8px;background:#7c3aed;color:#ffffff;border:none;font-weight:800;font-size:0.86rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
              <i class="fa-solid fa-unlock-keyhole"></i> Unlock Now
            </button>
          </form>
          <div style="font-size:0.74rem;color:#64748b;margin-top:6px;">
            Zero student accounts or personal data—your device remembers your school code automatically for the school year.
          </div>
          <div id="hh-unified-code-msg" style="font-size:0.8rem;font-weight:700;margin-top:6px;display:none;"></div>
        </div>

        <!-- 3 Compact Subscription Tier Pills -->
        <div>
          <div style="font-size:0.76rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#475569;margin-bottom:8px;">
            Annual School Subscription Options (Digital Lessons + Audio + All Printable PDFs):
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:10px;">
            <div style="padding:12px;border-radius:10px;border:1.5px solid #e2e8f0;background:#ffffff;">
              <div style="font-size:0.7rem;font-weight:800;text-transform:uppercase;color:#059669;">Single Course</div>
              <div style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:2px 0;">${escapeHtml(pack.priceLabel)}</div>
              <div style="font-size:0.76rem;color:#475569;line-height:1.35;">Full digital + print access for this course</div>
            </div>
            <div style="padding:12px;border-radius:10px;border:2px solid #7c3aed;background:#faf5ff;">
              <div style="font-size:0.7rem;font-weight:800;text-transform:uppercase;color:#7c3aed;">Key Stage (Popular)</div>
              <div style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:2px 0;">£149 / yr</div>
              <div style="font-size:0.76rem;color:#475569;line-height:1.35;">All 12 KS3 <em>or</em> All 6 Edexcel GCSE courses</div>
            </div>
            <div style="padding:12px;border-radius:10px;border:1.5px solid #fde68a;background:#fffbeb;">
              <div style="font-size:0.7rem;font-weight:800;text-transform:uppercase;color:#b45309;">All 19 Courses</div>
              <div style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:2px 0;">£229 / yr</div>
              <div style="font-size:0.76rem;color:#475569;line-height:1.35;">Whole-Department KS2 + KS3 + GCSE Vault</div>
            </div>
          </div>
        </div>

        <!-- Included Highlights -->
        <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;">
          ${pack.items
            .slice(0, 4)
            .map(
              (it) => `
            <li style="display:flex;align-items:flex-start;gap:8px;font-size:0.83rem;line-height:1.4;color:#334155;">
              <i class="fa-solid fa-circle-check" style="color:#059669;margin-top:2px;flex-shrink:0;"></i>
              <span>${escapeHtml(it)}</span>
            </li>`,
            )
            .join('')}
        </ul>

        <!-- CTA Row -->
        <div style="display:flex;flex-wrap:wrap;gap:10px;padding-top:4px;">
          <a href="${mailtoHref}" style="flex:1.3;min-width:220px;padding:11px 18px;border-radius:10px;background:#0284c7;color:#ffffff;font-weight:800;font-size:0.9rem;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;">
            <i class="fa-solid fa-envelope"></i> Subscribe Your School (Card or PO Invoice)
          </a>
          <button type="button" id="hh-pack-modal-bundles" style="padding:11px 16px;border-radius:10px;background:#f1f5f9;border:1px solid #cbd5e1;color:#0f172a;font-weight:700;font-size:0.85rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;">
            Compare All Tiers on /schools/ &rarr;
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('#hh-pack-modal-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector('#hh-pack-modal-bundles')?.addEventListener('click', () => {
    close();
    if (typeof window.switchView === 'function') {
      window.switchView('schools');
    } else {
      window.location.href = '/schools/';
    }
  });

  const form = overlay.querySelector('#hh-unified-code-form');
  const input = overlay.querySelector('#hh-unified-code-input');
  const msg = overlay.querySelector('#hh-unified-code-msg');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = (input?.value || '').trim();
    const { verifyStaffPasskeySync } = window.__staffAuthModule || {};

    // 1. Check Teacher Staff Key first
    if (raw && typeof verifyStaffPasskeySync === 'function' && verifyStaffPasskeySync(raw)) {
      localStorage.setItem('history_hub_teacher_mode', 'true');
      sessionStorage.removeItem('hh_preview_as_pupil');
      sessionStorage.removeItem(PREVIEW_ROLE_SESSION_KEY);
      window.isTeacherMode = true;
      if (typeof window.syncStaffUiState === 'function') window.syncStaffUiState();
      renderLocalhostPreviewBanner();
      close();
      if (isLessonGate && typeof opts.lessonIndex === 'number' && typeof window.viewLessonDetail === 'function') {
        window.viewLessonDetail(opts.lessonIndex);
      } else if (typeof window.switchView === 'function') {
        const curView = (window.state && window.state.currentView) || window.currentView || 'dashboard';
        const curUnit = (window.state && window.state.selectedUnitId) || window.currentUnitId;
        window.switchView(curView, curUnit, true);
      }
      return;
    }

    // 2. Check Annual Pupil Class Code (e.g. HUB26, GCSE26, KS3-26, CME26)
    const pupilMatch = verifyAndSavePupilClassCode(raw, { persist: true });
    if (pupilMatch) {
      renderLocalhostPreviewBanner();
      if (!isLessonGate && !isUnitUnlockedForPupil(resolvedId)) {
        if (msg) {
          msg.style.display = 'block';
          msg.style.color = '#d97706';
          msg.textContent = `Unlocked ${pupilMatch.label}, which does not cover ${pack.unitTitle}.`;
        }
        return;
      }
      close();
      if (isLessonGate && typeof opts.lessonIndex === 'number' && typeof window.viewLessonDetail === 'function') {
        window.viewLessonDetail(opts.lessonIndex);
      } else if (typeof window.switchView === 'function') {
        const curView = (window.state && window.state.currentView) || window.currentView || 'dashboard';
        const curUnit = (window.state && window.state.selectedUnitId) || window.currentUnitId;
        window.switchView(curView, curUnit, true);
      }
      return;
    }

    if (msg) {
      msg.style.display = 'block';
      msg.style.color = '#dc2626';
      msg.textContent =
        'Code not recognised. Try demo Pupil Class Code HUB26 (or GCSE26 / KS3-26 / CME26) or your Teacher Staff Key.';
    }
  });
}

if (typeof window !== 'undefined') {
  window.openUnitPrintPackModal = openUnitPrintPackModal;
  window.canAccessUnitLesson = canAccessUnitLesson;
  window.isFreeSampleLesson = isFreeSampleLesson;
  window.isUnitUnlockedForPupil = isUnitUnlockedForPupil;
  window.setCommercialPreviewRole = setCommercialPreviewRole;
}

export function guardPrintableAccess(url = '', title = '', explicitUnitId = null) {
  if (isStaffModeActive()) return true;
  if (isPublicSampleAsset(url)) return true;
  const uid = explicitUnitId || inferUnitIdFromAssetUrl(url, null);
  openUnitPrintPackModal(uid, title, { mode: 'printable' });
  return false;
}
