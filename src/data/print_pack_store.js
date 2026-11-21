/**
 * Per-Unit Print & Teacher Pack Storefront & Licensing Modal
 *
 * Keeps 100% of pupil online lessons, studio audio, quizzes, flashcards, games,
 * and printed QR codes completely open and code-free, while gating the printable
 * reprographic PDF library, WAGOLL Mark Schemes, Schemes of Work, and Teacher Notes
 * behind Staff Mode (`🔒 Staff`) + Per-Unit School Pack licensing.
 */

import { UNIT_RESOURCES_CATALOG, isStaffModeActive } from './unit_resources_catalog.js';
import { SEO_UNIT_ROUTES } from './seo_routes.js';

export const GCSE_UNIT_IDS = new Set([
  'edexcel_medicine',
  'eee',
  'gcse_cold_war',
  'cme_new',
  'weimar_nazi_germany',
  'usa',
]);

export const PRINT_PACK_PRICING = {
  ks2: { price: 29, label: '£29', tierName: 'KS2 Complete Unit Print & Teacher Pack' },
  ks3: { price: 29, label: '£29', tierName: 'KS3 Complete Unit Print & Teacher Pack' },
  gcse: { price: 49, label: '£49', tierName: 'Edexcel GCSE Complete Course Print & Teacher Pack' },
  bundles: [
    {
      id: 'gcse_3_pack',
      title: '3-Course Edexcel GCSE Bundle',
      priceLabel: '£119',
      savingsLabel: 'Save £28',
      desc: 'Any 3 Pearson Edexcel GCSE courses (Paper 1, Paper 2 & Paper 3)—all Textbooks, Pupil Workbooks, Grade 8/9 WAGOLL Mark Schemes, Retrieval Companions & Mock Papers.',
    },
    {
      id: 'ks3_full_12',
      title: 'Complete 12-Unit KS3 Curriculum (Years 7–9)',
      priceLabel: '£199',
      savingsLabel: 'Save £149',
      desc: 'All 12 UK National Curriculum Key Stage 3 units—Textbooks, Double-Page Pupil Workbooks, 8-Page Retrieval Companions, Schemes of Work & Teacher Delivery Notes.',
    },
    {
      id: 'all_19_vault',
      title: 'All-19-Course Whole-Department Vault',
      priceLabel: '£249',
      savingsLabel: 'Save £393',
      desc: 'Every KS2, KS3, and Edexcel GCSE unit on the platform—100+ print-ready PDF booklets, WAGOLL Mark Schemes, Mock Papers, and full Staff Mode passkey.',
    },
  ],
};

/**
 * Optional self-serve checkout URLs (e.g. Payhip, Lemon Squeezy, Stripe Payment Links, or TES).
 * Leave empty to fall back cleanly to 1-click pre-filled School Card / PO email ordering.
 */
export const PRINT_PACK_CHECKOUT_URLS = {
  // e.g. edexcel_medicine: 'https://payhip.com/b/...',
};

/**
 * Small set of designated sample inspection PDFs kept publicly viewable on /schools/
 * so Heads of Department can verify reprographic layout & print geometry before ordering.
 */
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
  const tier = isGcse
    ? PRINT_PACK_PRICING.gcse
    : isKs2
      ? PRINT_PACK_PRICING.ks2
      : PRINT_PACK_PRICING.ks3;

  const items = [];
  if (cat.textbook) {
    items.push(
      `${cat.textbook.title || 'Master Classroom Textbook'} (${cat.textbook.pages || 'A3/A4 Booklet'})`,
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
      `${cat.workbook.title || 'Consumable Pupil Workbook'} (${cat.workbook.pages || 'Double-Page Spreads'})${hasMs ? ' + Paired Teacher Mark Schemes & WAGOLLs' : ''}`,
    );
  }
  if (cat.retrieval) {
    items.push(
      `${cat.retrieval.title || 'Master Knowledge Retrieval Companion'} (${cat.retrieval.pages || 'Booklet'} • Rear Marking Bank)`,
    );
  }
  if (cat.revisionGuide) {
    items.push(`${cat.revisionGuide.title} (${cat.revisionGuide.pages || 'A4'})`);
  }
  if (cat.masteryExamPack) {
    items.push(`${cat.masteryExamPack.title} + Timed Mock Exam Papers & Mark Schemes`);
  }
  if (Array.isArray(cat.worksheets) && cat.worksheets.length > 0) {
    items.push(`${cat.worksheets.length} Single-Lesson A4 Companion Worksheets`);
  }
  items.push(
    'Full Teacher Mode: 2-Lesson Delivery Plans, Source Crib Notes, Hinge Questions & Cover Generator',
  );

  return {
    unitId: cleanId,
    unitTitle: cat.unitTitle || seo.heading || 'History Unit Pack',
    subtitle: cat.specSubtitle || seo.examBoard || 'Complete Print & Teacher Pack',
    isGcse,
    isKs2,
    price: tier.price,
    priceLabel: tier.label,
    tierName: tier.tierName,
    checkoutUrl: PRINT_PACK_CHECKOUT_URLS[cleanId] || '',
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

export function openUnitPrintPackModal(unitId = null, requestedResourceTitle = '') {
  if (typeof document === 'undefined') return;
  const resolvedId = unitId || inferUnitIdFromAssetUrl('', null);
  const pack = getUnitPackDetails(resolvedId);

  const existing = document.getElementById('hh-print-pack-modal-overlay');
  if (existing) existing.remove();

  const subject = encodeURIComponent(
    `Order Request: ${pack.unitTitle} (${pack.priceLabel} School Print & Teacher Pack)`,
  );
  const body = encodeURIComponent(
    `Hello The History Revision Hub,\n\nWe would like to order the following school reprographic & teacher pack:\n\n• Course: ${pack.unitTitle} (${pack.subtitle})\n• Licence: ${pack.priceLabel} One-Off Whole-School Print & Teacher Licence (zero annual subscription)\n\nSchool Name:\nPayment Preference (School Card Link or School Invoice / PO):\n\nThank you!`,
  );
  const mailtoHref = `mailto:contact@historyrevisionhub.co.uk?subject=${subject}&body=${body}`;

  const overlay = document.createElement('div');
  overlay.id = 'hh-print-pack-modal-overlay';
  overlay.className = 'no-print';
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(15,23,42,0.82);backdrop-filter:blur(6px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;';

  overlay.innerHTML = `
    <div role="dialog" aria-modal="true" aria-labelledby="hh-pack-modal-title" style="background:#ffffff;color:#0f172a;border-radius:16px;max-width:640px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);border:1px solid #cbd5e1;font-family:'Outfit',sans-serif;">
      <!-- Top Header -->
      <div style="background:linear-gradient(135deg,#0c2340,#1e293b);color:#ffffff;padding:22px 24px;border-bottom:1px solid #334155;display:flex;align-items:flex-start;justify-content:space-between;gap:14px;">
        <div>
          <div style="display:inline-flex;align-items:center;gap:6px;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#7dd3fc;background:rgba(56,189,248,0.14);border:1px solid rgba(56,189,248,0.35);padding:3px 10px;border-radius:999px;margin-bottom:8px;">
            <i class="fa-solid fa-print"></i> ${escapeHtml(pack.tierName)}
          </div>
          <h2 id="hh-pack-modal-title" style="margin:0 0 4px;font-size:1.32rem;font-weight:800;line-height:1.25;color:#ffffff;">
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

      <!-- Body -->
      <div style="padding:22px 24px;display:flex;flex-direction:column;gap:18px;">
        ${
          requestedResourceTitle
            ? `<div style="background:#f0f9ff;border:1px solid #bae6fd;color:#0c4a6e;padding:10px 14px;border-radius:10px;font-size:0.85rem;line-height:1.5;">
                <i class="fa-solid fa-lock" style="color:#0284c7;margin-right:6px;"></i>
                <strong>${escapeHtml(requestedResourceTitle)}</strong> is part of the printable Teacher &amp; Reprographic Pack for this course. Online pupil lessons, studio audio, and interactive quizzes remain <strong>100% free</strong>.
              </div>`
            : ''
        }

        <!-- Price & One-Off Licence Box -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:14px 18px;">
          <div>
            <div style="font-size:0.74rem;font-weight:800;text-transform:uppercase;color:#059669;letter-spacing:0.04em;">
              Whole-School Reprographic Licence &bull; No Annual Subscription
            </div>
            <div style="font-size:0.88rem;color:#475569;margin-top:2px;">
              Ready-to-photocopy PDFs (blank Name / Class / Teacher lines) &bull; Instant download
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:1.75rem;font-weight:800;color:#0f172a;">${escapeHtml(pack.priceLabel)}</span>
            <div style="font-size:0.72rem;font-weight:700;color:#64748b;">one-off per unit</div>
          </div>
        </div>

        <!-- Included Files Checklist -->
        <div>
          <div style="font-size:0.78rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#334155;margin-bottom:8px;">
            Everything Included in This ${escapeHtml(pack.priceLabel)} Unit Pack:
          </div>
          <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:7px;">
            ${pack.items
              .map(
                (it) => `
              <li style="display:flex;align-items:flex-start;gap:8px;font-size:0.88rem;line-height:1.45;color:#1e293b;">
                <i class="fa-solid fa-circle-check" style="color:#059669;margin-top:3px;flex-shrink:0;"></i>
                <span>${escapeHtml(it)}</span>
              </li>`,
              )
              .join('')}
          </ul>
        </div>

        <!-- Primary Order Buttons -->
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
          ${
            pack.checkoutUrl
              ? `<a href="${escapeHtml(pack.checkoutUrl)}" target="_blank" rel="noopener" style="flex:1.3;min-width:220px;padding:12px 18px;border-radius:10px;background:#0284c7;color:#ffffff;font-weight:800;font-size:0.92rem;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;">
                  <i class="fa-solid fa-bolt"></i> Buy Instant ZIP Download (${escapeHtml(pack.priceLabel)})
                </a>`
              : ''
          }
          <a href="${mailtoHref}" style="flex:1.2;min-width:220px;padding:12px 18px;border-radius:10px;background:${pack.checkoutUrl ? '#0f172a' : '#0284c7'};color:#ffffff;font-weight:800;font-size:0.92rem;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;">
            <i class="fa-solid fa-envelope"></i> Order Unit Pack (${escapeHtml(pack.priceLabel)} &bull; Card or School PO)
          </a>
          <button type="button" id="hh-pack-modal-bundles" style="padding:12px 16px;border-radius:10px;background:#f1f5f9;border:1px solid #cbd5e1;color:#0f172a;font-weight:700;font-size:0.86rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;">
            <i class="fa-solid fa-layer-group" style="color:#0284c7;"></i> View Multi-Unit Bundles
          </button>
        </div>

        <!-- Inline 1-Step Staff Passkey Unlock (Zero Browser Prompt) -->
        <div style="border-top:1px solid #e2e8f0;padding-top:14px;">
          <div style="font-size:0.78rem;font-weight:700;color:#475569;margin-bottom:8px;">
            <i class="fa-solid fa-key" style="color:#059669;margin-right:5px;"></i>
            <strong>Already have a Department / Staff Passkey?</strong> Unlock once on this device—your browser remembers it automatically:
          </div>
          <form id="hh-pack-staff-unlock-form" style="display:flex;gap:8px;flex-wrap:wrap;">
            <input
              type="password"
              id="hh-pack-staff-input"
              placeholder="Enter Staff Passkey..."
              autocomplete="current-password"
              style="flex:1;min-width:180px;padding:9px 12px;border-radius:8px;border:1px solid #cbd5e1;font-size:0.88rem;color:#0f172a;background:#ffffff;"
            />
            <button type="submit" style="padding:9px 16px;border-radius:8px;background:#059669;color:#ffffff;border:none;font-weight:700;font-size:0.86rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
              <i class="fa-solid fa-unlock-keyhole"></i> Unlock Staff Mode
            </button>
          </form>
          <div id="hh-pack-staff-msg" style="font-size:0.78rem;margin-top:6px;display:none;"></div>
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

  const form = overlay.querySelector('#hh-pack-staff-unlock-form');
  const input = overlay.querySelector('#hh-pack-staff-input');
  const msg = overlay.querySelector('#hh-pack-staff-msg');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = (input?.value || '').trim();
    const isLocal =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const { verifyStaffPasskeySync } = window.__staffAuthModule || {};

    // On localhost preview mode, allow blank or valid passkey to exit Pupil Preview immediately
    const valid =
      (raw && typeof verifyStaffPasskeySync === 'function' && verifyStaffPasskeySync(raw)) ||
      (isLocal && !raw && sessionStorage.getItem('hh_preview_as_pupil') === 'true');

    if (valid) {
      localStorage.setItem('history_hub_teacher_mode', 'true');
      sessionStorage.removeItem('hh_preview_as_pupil');
      window.isTeacherMode = true;
      if (typeof window.syncStaffUiState === 'function') window.syncStaffUiState();
      close();
      const curView = (window.state && window.state.currentView) || window.currentView || 'dashboard';
      const curUnit = (window.state && window.state.selectedUnitId) || window.currentUnitId;
      if (typeof window.switchView === 'function') {
        window.switchView(curView, curUnit, true);
      }
    } else if (msg) {
      msg.style.display = 'block';
      msg.style.color = '#dc2626';
      msg.textContent = isLocal
        ? 'Passkey not recognised (tip: leave blank and click Unlock on localhost to exit Public Preview).'
        : 'Passkey not recognised. Check your pack welcome email or contact contact@historyrevisionhub.co.uk.';
    }
  });
}

if (typeof window !== 'undefined') {
  window.openUnitPrintPackModal = openUnitPrintPackModal;
}

export function guardPrintableAccess(url = '', title = '', explicitUnitId = null) {
  if (isStaffModeActive()) return true;
  if (isPublicSampleAsset(url)) return true;
  const uid = explicitUnitId || inferUnitIdFromAssetUrl(url, null);
  openUnitPrintPackModal(uid, title);
  return false;
}
