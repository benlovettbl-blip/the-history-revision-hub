/**
 * For Schools & History Departments Showcase View (/schools/)
 * 4-Tier Annual School Subscription Model ("First Enquiry Free" + Pupil Class Code & Teacher Key).
 */

import { SEO_UNIT_ROUTES } from './data/seo_routes.js';
import {
  ANNUAL_SUBSCRIPTION_TIERS,
  isUnitUnlockedForPupil,
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

  const gcseRoutes = SEO_UNIT_ROUTES.filter((r) => r.keyStage.startsWith('GCSE'));
  const ks3Routes = SEO_UNIT_ROUTES.filter((r) => r.keyStage.startsWith('Key Stage 3'));
  const ks2Routes = SEO_UNIT_ROUTES.filter((r) => r.keyStage.startsWith('Key Stage 2'));

  const renderTierCards = () =>
    ANNUAL_SUBSCRIPTION_TIERS.map((t) => {
      const subject = encodeURIComponent(`School Subscription Order: ${t.title} (${t.priceLabel})`);
      const body = encodeURIComponent(
        `Hello The History Revision Hub,\n\nWe would like to set up the following Annual School Subscription (Sept–Aug):\n\n• Tier: ${t.title} (${t.priceLabel})\n• School Name:\n• Selected Course / Key Stage (if applicable):\n• Payment Preference (School Procurement Card Link or School Invoice / PO):\n\nThank you!`,
      );
      return `
        <div style="
          padding: 22px;
          border-radius: 14px;
          background: var(--bg-card, #ffffff);
          border: ${t.featured ? `2.5px solid ${t.accent}` : '1.5px solid var(--border-glass, rgba(12, 35, 64, 0.14))'};
          box-shadow: ${t.featured ? '0 10px 25px rgba(124, 58, 237, 0.12)' : 'var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05))'};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
        ">
          <div>
            <div style="display: inline-block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 999px; background: ${t.accent}18; color: ${t.accent}; margin-bottom: 10px;">
              ${escapeHtml(t.badge)}
            </div>
            <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 1.85rem; font-weight: 800; color: var(--text-main, #0c2340);">${escapeHtml(t.priceLabel)}</span>
            </div>
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted, #64748b); margin-bottom: 10px;">
              ${escapeHtml(t.billingNote)}
            </div>
            <h3 style="font-size: 1.04rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340); line-height: 1.3;">
              ${escapeHtml(t.title)}
            </h3>
            <p style="font-size: 0.86rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
              ${escapeHtml(t.desc)}
            </p>
          </div>
          <a
            href="mailto:contact@historyrevisionhub.co.uk?subject=${subject}&body=${body}"
            style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 7px;
              padding: 10px 14px;
              border-radius: 9px;
              background: ${t.featured ? t.accent : '#0f172a'};
              color: #ffffff;
              font-size: 0.85rem;
              font-weight: 800;
              text-decoration: none;
            "
          >
            <i class="fa-solid fa-envelope"></i> Subscribe (Card or School PO)
          </a>
        </div>`;
    }).join('');

  const renderCourseCards = (routes) =>
    routes
      .map((r) => {
        const unlocked = isUnitUnlockedForPupil(r.unitId);
        return `
        <div style="
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
        ">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #0284c7;">
                ${escapeHtml(r.examBoard)}
              </span>
              <span style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: ${unlocked ? 'rgba(5, 150, 105, 0.14)' : 'rgba(2, 132, 199, 0.12)'}; color: ${unlocked ? '#059669' : '#0284c7'}; white-space: nowrap;">
                ${unlocked ? '✓ Unlocked' : 'Enquiry 1 Free'}
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
                flex: 1.15;
                text-align: center;
                padding: 7px 10px;
                border-radius: 8px;
                background: #059669;
                color: #ffffff;
                font-size: 0.78rem;
                font-weight: 800;
                text-decoration: none;
              "
            >
              ${unlocked ? 'Open Course &rarr;' : 'Try Lesson 1 Free &rarr;'}
            </a>
            <button
              type="button"
              data-pack-unit="${escapeHtml(r.unitId)}"
              style="
                flex: 1;
                padding: 7px 10px;
                border-radius: 8px;
                background: var(--bg-app, #f1f5f9);
                color: var(--text-main, #0c2340);
                border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.16));
                font-size: 0.77rem;
                font-weight: 800;
                cursor: pointer;
              "
            >
              What’s Included
            </button>
          </div>
        </div>`;
      })
      .join('');

  container.innerHTML = `
    <div class="schools-showcase-wrap" style="max-width: 1100px; margin: 0 auto; padding: 20px 16px 40px; display: flex; flex-direction: column; gap: 28px;">
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
          <i class="fa-solid fa-school"></i> Annual School Subscriptions &bull; Enquiry 1 Free on Every Course
        </div>
        <h1 style="font-family: 'Outfit', sans-serif; font-size: clamp(1.65rem, 3vw, 2.3rem); font-weight: 800; line-height: 1.2; margin: 0 0 12px; color: #ffffff;">
          Complete Digital &amp; Print-Room History Platform — Scaled to Your Department
        </h1>
        <p style="font-size: 1.02rem; line-height: 1.65; color: #cbd5e1; max-width: 850px; margin: 0 0 22px;">
          Test-drive <strong>Lesson 1 of any course completely free</strong> (studio audio, primary sources, visual story sheets &amp; quizzes). Subscribing schools receive two simple annual codes—a <strong>Pupil Class Code</strong> (zero student accounts or GDPR delays) and a <strong>Teacher Staff Key</strong> unlocking all printable booklets, Grade 8/9 WAGOLL Mark Schemes, Smartboard tools, and summer Exam Radar updates.
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <a
            href="#schools-pricing-tiers"
            style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 11px 20px;
              border-radius: 10px;
              background: #0284c7;
              color: #ffffff;
              font-weight: 800;
              font-size: 0.92rem;
              text-decoration: none;
            "
          >
            <i class="fa-solid fa-layer-group"></i> View Annual Tiers (£69 – £229 / yr)
          </a>
          <button
            type="button"
            onclick="window.openUnitPrintPackModal && window.openUnitPrintPackModal('edexcel_medicine')"
            style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 11px 18px;
              border-radius: 10px;
              background: #7c3aed;
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: #ffffff;
              font-weight: 800;
              font-size: 0.92rem;
              cursor: pointer;
            "
          >
            <i class="fa-solid fa-key"></i> Enter Class Code or Teacher Key
          </button>
        </div>
      </section>

      <!-- How the Two-Code Zero-GDPR System Works -->
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <div style="padding: 22px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
          <div style="font-size: 0.78rem; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            <i class="fa-solid fa-door-open"></i> 1. Test Before You Subscribe
          </div>
          <h2 style="font-size: 1.08rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">Lesson 1 Free Across All 19 Courses</h2>
          <p style="font-size: 0.89rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            Teach a live trial lesson tomorrow morning with zero sign-up—full studio narration, archival sources, visual story sheet, quiz, plus 3 sample printable PDFs below.
          </p>
        </div>

        <div style="padding: 22px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
          <div style="font-size: 0.78rem; font-weight: 800; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            <i class="fa-solid fa-users"></i> 2. Annual Pupil Class Code
          </div>
          <h2 style="font-size: 1.08rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">Zero Student Emails or GDPR Delays</h2>
          <p style="font-size: 0.89rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            Pupils enter your 5-character Class Code once (or click a Google Classroom / Teams link with <code>?access=CODE</code> for zero-click Chromebook access)—unlocking all lessons, audio &amp; games while keeping Teacher Mark Schemes hidden.
          </p>
        </div>

        <div style="padding: 22px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
          <div style="font-size: 0.78rem; font-weight: 800; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            <i class="fa-solid fa-chalkboard-user"></i> 3. Annual Teacher Staff Key
          </div>
          <h2 style="font-size: 1.08rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">Print Room + Smartboard Tools</h2>
          <p style="font-size: 0.89rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            Unlocks all A3/A4 Classroom Textbooks, Pupil Workbooks, Grade 8/9 WAGOLL Mark Schemes, Plenary Projector, Cover Generator, and annual summer Predicted Mock &amp; Exam Radar updates.
          </p>
        </div>
      </section>

      <!-- 4 Annual Subscription Tiers -->
      <section id="schools-pricing-tiers" style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; margin: 0 0 4px; color: var(--text-main, #0c2340);">
            Annual School Subscription Tiers (September – August)
          </h2>
          <p style="font-size: 0.92rem; margin: 0; color: var(--text-muted, #475569);">
            Simple whole-school pricing with unlimited teachers, unlimited pupils, and unlimited class-set photocopying at your school.
          </p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
          ${renderTierCards()}
        </div>
      </section>

      <!-- 3 Free Sample Printable Booklets -->
      <section style="padding: 24px; border-radius: 16px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">
          Inspect Free Sample Print-Room PDFs
        </h2>
        <p style="font-size: 0.9rem; line-height: 1.6; margin: 0 0 16px; color: var(--text-muted, #475569);">
          Every booklet has clean commercial covers with blank <em>Name / Class / Teacher</em> lines—ready for your school photocopier with zero formatting work.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
          <a href="/pdfs/eee_textbook_KT1.pdf" target="_blank" rel="noopener" style="padding: 15px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.14)); text-decoration: none; display: flex; flex-direction: column; gap: 5px;">
            <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #0284c7;">Sample 1 &bull; Master Textbook</span>
            <strong style="font-size: 0.95rem; color: var(--text-main, #0c2340);">GCSE Early Elizabethan England KT1 (12p PDF) &rarr;</strong>
          </a>
          <a href="/pdfs/gcse_cold_war_pupil_workbook_KT1.pdf" target="_blank" rel="noopener" style="padding: 15px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.14)); text-decoration: none; display: flex; flex-direction: column; gap: 5px;">
            <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #059669;">Sample 2 &bull; Double-Page Pupil Workbook</span>
            <strong style="font-size: 0.95rem; color: var(--text-main, #0c2340);">GCSE Superpower Cold War KT1 (16p PDF) &rarr;</strong>
          </a>
          <a href="/pdfs/ks2_ww2_retrieval_companion.pdf" target="_blank" rel="noopener" style="padding: 15px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.14)); text-decoration: none; display: flex; flex-direction: column; gap: 5px;">
            <span style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #7c3aed;">Sample 3 &bull; Retrieval Companion</span>
            <strong style="font-size: 0.95rem; color: var(--text-main, #0c2340);">KS2 World War II Recall Booklet (4p PDF) &rarr;</strong>
          </a>
        </div>
      </section>

      <!-- 19 Courses Directory -->
      <section style="display: flex; flex-direction: column; gap: 22px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; color: var(--text-main, #0c2340);">
            Pearson Edexcel GCSE (9–1) History (${gcseRoutes.length} Courses &bull; Lesson 1 Free on Each)
          </h2>
          <p style="font-size: 0.86rem; margin: 0 0 12px; color: var(--text-muted, #475569);">
            £79 / yr for any single GCSE course, or £149 / yr for all 6 GCSE courses.
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 12px;">
            ${renderCourseCards(gcseRoutes)}
          </div>
        </div>

        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 4px; color: var(--text-main, #0c2340);">
            Key Stage 3: Years 7–9 UK National Curriculum (${ks3Routes.length} Courses &bull; Lesson 1 Free on Each)
          </h2>
          <p style="font-size: 0.86rem; margin: 0 0 12px; color: var(--text-muted, #475569);">
            £79 / yr for a single unit, or £149 / yr for all 12 KS3 courses—anchored in concrete British historical case studies (including Portchester Castle, Titchfield Abbey, Fontley Ironworks &amp; Portsmouth Royal Dockyard).
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 12px;">
            ${renderCourseCards(ks3Routes)}
          </div>
        </div>

        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">
            Key Stage 2: Years 5–6 Primary History (${ks2Routes.length} Course &bull; £69 / yr Primary Licence)
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 12px;">
            ${renderCourseCards(ks2Routes)}
          </div>
        </div>
      </section>
    </div>
  `;

  container.querySelectorAll('[data-pack-unit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openUnitPrintPackModal(btn.getAttribute('data-pack-unit'));
    });
  });
}
