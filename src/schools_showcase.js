/**
 * For Schools & History Departments Showcase View (/schools/)
 * Per-unit & bundle print-room curriculum packs — zero student logins, zero subscriptions, zero cover admin.
 */

import { SEO_UNIT_ROUTES } from './data/seo_routes.js';
import { isStaffModeActive } from './data/unit_resources_catalog.js';
import {
  PRINT_PACK_PRICING,
  getUnitPackDetails,
  openUnitPrintPackModal,
} from './data/print_pack_store.js';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSchoolsShowcase() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const staffActive = isStaffModeActive();
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const gcseRoutes = SEO_UNIT_ROUTES.filter((r) => r.keyStage.startsWith('GCSE'));
  const ks3Routes = SEO_UNIT_ROUTES.filter((r) => r.keyStage.startsWith('Key Stage 3'));
  const ks2Routes = SEO_UNIT_ROUTES.filter((r) => r.keyStage.startsWith('Key Stage 2'));

  const renderCourseCards = (routes) =>
    routes
      .map((r) => {
        const pack = getUnitPackDetails(r.unitId);
        return `
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 12px;
            padding: 15px 16px;
            border-radius: 12px;
            background: var(--bg-card, #ffffff);
            border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12));
            box-shadow: var(--shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.04));
            color: var(--text-main, #0c2340);
          "
        >
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #0284c7;">
                ${escapeHtml(r.examBoard)}
              </span>
              <span style="font-size: 0.78rem; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: rgba(5, 150, 105, 0.12); color: #059669; white-space: nowrap;">
                ${escapeHtml(pack.priceLabel)} Pack
              </span>
            </div>
            <div style="font-size: 0.96rem; font-weight: 800; line-height: 1.35; color: var(--text-main, #0c2340);">
              ${escapeHtml(r.heading)}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; padding-top: 8px; border-top: 1px solid var(--border-glass, rgba(12, 35, 64, 0.08));">
            <a
              href="/${escapeHtml(r.slug)}/"
              onclick="if(window.switchView){event.preventDefault();window.switchView('lessons','${escapeHtml(r.unitId)}');}"
              style="
                flex: 1;
                text-align: center;
                padding: 7px 10px;
                border-radius: 8px;
                background: var(--bg-app, #f1f5f9);
                border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.15));
                color: var(--text-main, #0c2340);
                font-size: 0.78rem;
                font-weight: 700;
                text-decoration: none;
              "
            >
              Free Pupil Lessons &rarr;
            </a>
            <button
              type="button"
              data-pack-unit="${escapeHtml(r.unitId)}"
              style="
                flex: 1;
                padding: 7px 10px;
                border-radius: 8px;
                background: #0f172a;
                color: #ffffff;
                border: none;
                font-size: 0.78rem;
                font-weight: 800;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
              "
            >
              <i class="fa-solid fa-print" style="color: #38bdf8;"></i> Print Pack (${escapeHtml(pack.priceLabel)})
            </button>
          </div>
        </div>`;
      })
      .join('');

  const bundleCardsHtml = PRINT_PACK_PRICING.bundles
    .map((b) => {
      const bundleMailSubject = encodeURIComponent(
        `Department Bundle Order: ${b.title} (${b.priceLabel})`,
      );
      const bundleMailBody = encodeURIComponent(
        `Hello The History Revision Hub,\n\nWe would like to order the ${b.title} (${b.priceLabel} one-off whole-school licence).\n\nSchool Name:\nSelected Courses (if 3-Course GCSE Bundle):\nPayment Preference (School Card Link or School Invoice / PO):\n\nThank you!`,
      );
      return `
        <div style="padding: 20px; border-radius: 14px; background: var(--bg-app, #f8fafc); border: 1.5px solid var(--border-glass, rgba(12, 35, 64, 0.14)); display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #059669;">
                ${escapeHtml(b.savingsLabel)}
              </span>
              <span style="font-size: 1.35rem; font-weight: 800; color: var(--text-main, #0c2340);">
                ${escapeHtml(b.priceLabel)}
              </span>
            </div>
            <h3 style="font-size: 1.04rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">
              ${escapeHtml(b.title)}
            </h3>
            <p style="font-size: 0.86rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
              ${escapeHtml(b.desc)}
            </p>
          </div>
          <a
            href="mailto:contact@historyrevisionhub.co.uk?subject=${bundleMailSubject}&body=${bundleMailBody}"
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 7px;
              padding: 10px 14px;
              border-radius: 9px;
              background: #0284c7;
              color: #ffffff;
              font-size: 0.85rem;
              font-weight: 800;
              text-decoration: none;
            "
          >
            <i class="fa-solid fa-envelope"></i> Order Bundle (Card or School PO)
          </a>
        </div>`;
    })
    .join('');

  const localPreviewBar =
    isLocal || staffActive
      ? `
      <div class="no-print" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 10px 16px; border-radius: 10px; background: ${staffActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(2, 132, 199, 0.12)'}; border: 1px solid ${staffActive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(2, 132, 199, 0.35)'}; font-size: 0.84rem; color: var(--text-main, #0c2340);">
        <span>
          <i class="fa-solid ${staffActive ? 'fa-unlock-keyhole' : 'fa-eye'}" style="color: ${staffActive ? '#059669' : '#0284c7'}; margin-right: 6px;"></i>
          <strong>Current View Mode:</strong> ${staffActive ? 'Staff Mode ON (All 19 Unit PDFs & Mark Schemes Unlocked)' : 'Public / Visiting Teacher View (Pupil Lessons Free • Printable PDFs Locked)'}
        </span>
        <button
          type="button"
          onclick="window.toggleGlobalStaffMode && window.toggleGlobalStaffMode()"
          style="padding: 6px 12px; border-radius: 7px; background: #0f172a; color: #ffffff; border: none; font-size: 0.78rem; font-weight: 800; cursor: pointer;"
        >
          ${staffActive ? 'Switch to Public / Visiting Teacher View' : 'Switch Back to Staff Mode'}
        </button>
      </div>`
      : '';

  container.innerHTML = `
    <div class="schools-showcase-wrap" style="max-width: 1080px; margin: 0 auto; padding: 20px 16px 40px; display: flex; flex-direction: column; gap: 26px;">
      ${localPreviewBar}

      <!-- Hero Banner -->
      <section style="
        border-radius: 16px;
        padding: 32px 28px;
        background: linear-gradient(135deg, #0c2340, #1e293b);
        border: 1px solid rgba(56, 189, 248, 0.28);
        color: #f8fafc;
        box-shadow: 0 12px 32px rgba(2, 6, 23, 0.22);
      ">
        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 999px; background: rgba(56, 189, 248, 0.14); border: 1px solid rgba(56, 189, 248, 0.35); color: #7dd3fc; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px;">
          <i class="fa-solid fa-school"></i> For UK Schools &amp; History Departments
        </div>
        <h1 style="font-family: 'Outfit', sans-serif; font-size: clamp(1.65rem, 3vw, 2.3rem); font-weight: 800; line-height: 1.2; margin: 0 0 12px; color: #ffffff;">
          Free Online Pupil Hub &bull; Buy Printable Unit Packs Only for the Courses You Teach
        </h1>
        <p style="font-size: 1.02rem; line-height: 1.65; color: #cbd5e1; max-width: 840px; margin: 0 0 22px;">
          Every online lesson, studio audio read-aloud, and retrieval quiz on this site is <strong>100% free and login-free for pupils</strong>. History Departments can purchase ready-to-photocopy <strong>Classroom Textbooks, Pupil Workbooks, Grade 8/9 WAGOLL Mark Schemes, and Retrieval Companions</strong> one unit at a time—with <strong>zero annual subscriptions</strong>.
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <a
            href="#schools-unit-catalogue"
            style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 11px 20px;
              border-radius: 10px;
              background: #0284c7;
              color: #ffffff;
              font-weight: 700;
              font-size: 0.92rem;
              text-decoration: none;
            "
          >
            <i class="fa-solid fa-box-archive"></i> Browse Unit Packs (£29 KS2/KS3 &bull; £49 GCSE)
          </a>
          <a
            href="/"
            onclick="if(window.switchView){event.preventDefault();window.switchView('dashboard');}"
            style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 11px 18px;
              border-radius: 10px;
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.22);
              color: #f8fafc;
              font-weight: 600;
              font-size: 0.92rem;
              text-decoration: none;
            "
          >
            <i class="fa-solid fa-compass"></i> Explore Free Pupil Lessons
          </a>
        </div>
      </section>

      <!-- 3 Zero-Friction School Pillars (Zero Custom Cover Promise) -->
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <div style="padding: 22px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
          <div style="font-size: 0.78rem; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            <i class="fa-solid fa-shield-halved"></i> Zero Student Logins or GDPR Delays
          </div>
          <h2 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">100% Code-Free for Pupils</h2>
          <p style="font-size: 0.9rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            No student accounts, no personal data stored, and no wiped-Chromebook login codes. Share direct lesson, audio, or quiz links straight into Google Classroom or Microsoft Teams with zero DPO paperwork.
          </p>
        </div>

        <div style="padding: 22px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
          <div style="font-size: 0.78rem; font-weight: 800; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            <i class="fa-solid fa-sterling-sign"></i> One-Off Per-Unit Pricing
          </div>
          <h2 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">£29 KS2/KS3 &bull; £49 Edexcel GCSE</h2>
          <p style="font-size: 0.9rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            Buy a single unit on a department card with zero recurring fees. Every PDF features clean commercial covers with blank <em>Name / Class / Teacher</em> lines—photocopy unlimited class sets across your school.
          </p>
        </div>

        <div style="padding: 22px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
          <div style="font-size: 0.78rem; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            <i class="fa-solid fa-headphones"></i> SEND &amp; Literacy Built In
          </div>
          <h2 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">833 Studio-Voiced Narrative Blocks</h2>
          <p style="font-size: 0.9rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            Sentence-tracked British studio narration across every lesson, 171 1-page Visual Story Sheets, coloured reading overlays for visual stress, and KS2/KS3 Guided Reading companions for home support.
          </p>
        </div>
      </section>

      <!-- 4-Tier Publication Taxonomy with 3 Free Inspection Samples -->
      <section style="padding: 24px; border-radius: 16px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.35rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">
          What Is Inside Each Printable Unit Pack?
        </h2>
        <p style="font-size: 0.92rem; line-height: 1.6; margin: 0 0 18px; color: var(--text-muted, #475569);">
          Inspect our 3 free sample booklets below to verify A3/A4 saddle-stitch geometry, typography, and historical depth before ordering.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(235px, 1fr)); gap: 14px;">
          <div style="padding: 16px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12)); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-size: 0.74rem; font-weight: 800; color: #0284c7; text-transform: uppercase; margin-bottom: 4px;">1. Master Textbook</div>
              <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">Pure Narrative Reading Anthology</h3>
              <p style="font-size: 0.85rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
                Uninterrupted, age-calibrated historical narrative designed for whole-class shared reading without worksheet clutter.
              </p>
            </div>
            <div style="font-size: 0.8rem; font-weight: 700;">
              <a href="/pdfs/eee_textbook_KT1.pdf" target="_blank" rel="noopener" style="color: #0284c7; text-decoration: underline;"><i class="fa-solid fa-eye"></i> Free Sample: Elizabeth KT1 Textbook (PDF)</a>
            </div>
          </div>

          <div style="padding: 16px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12)); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-size: 0.74rem; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 4px;">2. Pupil Workbook + WAGOLLs</div>
              <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">Double-Page Enquiry Spreads</h3>
              <p style="font-size: 0.85rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
                Monochrome photocopier interior pairing a 5-stage chronological spine (Verso) with structured writing tasks (Recto) and Teacher Mark Schemes.
              </p>
            </div>
            <div style="font-size: 0.8rem; font-weight: 700;">
              <a href="/pdfs/gcse_cold_war_pupil_workbook_KT1.pdf" target="_blank" rel="noopener" style="color: #059669; text-decoration: underline;"><i class="fa-solid fa-eye"></i> Free Sample: Cold War KT1 Workbook (PDF)</a>
            </div>
          </div>

          <div style="padding: 16px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12)); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-size: 0.74rem; font-weight: 800; color: #7c3aed; text-transform: uppercase; margin-bottom: 4px;">3. Retrieval Companion</div>
              <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">Spaced Recall Quiz Booklets</h3>
              <p style="font-size: 0.85rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
                4-page (KS2), 8-page (KS3), and 16-to-24-page (GCSE) recall booklets with 3-tier difficulty pips and rear Marking Banks.
              </p>
            </div>
            <div style="font-size: 0.8rem; font-weight: 700;">
              <a href="/pdfs/ks2_ww2_retrieval_companion.pdf" target="_blank" rel="noopener" style="color: #7c3aed; text-decoration: underline;"><i class="fa-solid fa-eye"></i> Free Sample: KS2 WWII 4p Companion (PDF)</a>
            </div>
          </div>

          <div style="padding: 16px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12)); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-size: 0.74rem; font-weight: 800; color: #d97706; text-transform: uppercase; margin-bottom: 4px;">4. Mastery Packs &amp; Delivery Plans</div>
              <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">Mocks, SOWs &amp; Hinge Questions</h3>
              <p style="font-size: 0.85rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
                GCSE packs include timed Mock Papers, Mastery Exam Packs, and 3-tier model answers; every course includes 2-lesson delivery plans &amp; source notes.
              </p>
            </div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted, #475569);">
              <i class="fa-solid fa-key" style="color: #d97706;"></i> Unlocked via Unit Pack &amp; Staff Passkey
            </div>
          </div>
        </div>
      </section>

      <!-- Multi-Unit Department Value Bundles -->
      <section style="padding: 24px; border-radius: 16px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">
          Department Value Bundles (One-Off School Licence)
        </h2>
        <p style="font-size: 0.9rem; line-height: 1.6; margin: 0 0 16px; color: var(--text-muted, #475569);">
          Order individual units below (£29 KS2/KS3 &bull; £49 GCSE) or save across a full key stage with a single department download.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          ${bundleCardsHtml}
        </div>
      </section>

      <!-- Complete 19-Course Per-Unit Storefront & Directory -->
      <section id="schools-unit-catalogue" style="display: flex; flex-direction: column; gap: 22px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; color: var(--text-main, #0c2340);">
            Key Stage 4: Pearson Edexcel GCSE (9–1) History — £49 per Course Pack
          </h2>
          <p style="font-size: 0.86rem; margin: 0 0 12px; color: var(--text-muted, #475569);">
            100% aligned to the national Pearson Edexcel GCSE specification across Papers 1, 2, and 3.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 12px;">
            ${renderCourseCards(gcseRoutes)}
          </div>
        </div>

        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; color: var(--text-main, #0c2340);">
            Key Stage 3: Years 7–9 UK National Curriculum — £29 per Unit Pack
          </h2>
          <p style="font-size: 0.86rem; margin: 0 0 12px; color: var(--text-muted, #475569);">
            National enquiries anchored in concrete British historical case studies (including Portchester Castle, Titchfield Abbey, Fontley Ironworks &amp; Portsmouth Royal Dockyard).
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 12px;">
            ${renderCourseCards(ks3Routes)}
          </div>
        </div>

        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">
            Key Stage 2: Years 5–6 Primary History — £29 Unit Pack
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 12px;">
            ${renderCourseCards(ks2Routes)}
          </div>
        </div>
      </section>

      <!-- Department Enquiry & Provenance Footer Card -->
      <section style="
        padding: 24px;
        border-radius: 16px;
        background: var(--bg-card, #ffffff);
        border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12));
        box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      ">
        <div style="max-width: 680px;">
          <h2 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">
            School Procurement Cards, Purchase Orders &amp; Staff Unlock
          </h2>
          <p style="font-size: 0.9rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            Questions or school invoice requests? Email <a href="mailto:contact@historyrevisionhub.co.uk" style="color: #0284c7; font-weight: 700; text-decoration: underline;">contact@historyrevisionhub.co.uk</a>. All 1,532 archival images and primary extracts are documented in our <a href="/master_rights_register.html" target="_blank" rel="noopener" style="color: #0284c7; font-weight: 700; text-decoration: underline;">Master Provenance &amp; Copyright Register</a>.
          </p>
        </div>
        <button
          type="button"
          onclick="window.openUnitPrintPackModal && window.openUnitPrintPackModal('edexcel_medicine')"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 11px 18px;
            border-radius: 10px;
            background: #059669;
            color: #ffffff;
            border: none;
            font-weight: 800;
            font-size: 0.88rem;
            cursor: pointer;
            white-space: nowrap;
          "
        >
          <i class="fa-solid fa-key"></i> Enter Staff Passkey
        </button>
      </section>
    </div>
  `;

  container.querySelectorAll('[data-pack-unit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const uid = btn.getAttribute('data-pack-unit');
      openUnitPrintPackModal(uid);
    });
  });
}
