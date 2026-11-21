/**
 * For Schools & History Departments Showcase View (/schools/)
 * Lightweight, zero-PII institutional overview of the 4-tier print & digital curriculum.
 */

import { SEO_UNIT_ROUTES } from './data/seo_routes.js';

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

  const renderCoursePills = (routes) =>
    routes
      .map(
        (r) => `
        <a
          href="/${escapeHtml(r.slug)}/"
          onclick="if(window.switchView){event.preventDefault();window.switchView('lessons','${escapeHtml(r.unitId)}');}"
          style="
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 13px 15px;
            border-radius: 12px;
            background: var(--bg-card, #ffffff);
            border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12));
            box-shadow: var(--shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.04));
            color: var(--text-main, #0c2340);
            text-decoration: none;
            transition: transform 0.15s ease, border-color 0.15s ease;
          "
          onmouseover="this.style.borderColor='#0284c7';this.style.transform='translateY(-1px)';"
          onmouseout="this.style.borderColor='var(--border-glass, rgba(12, 35, 64, 0.12))';this.style.transform='none';"
        >
          <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #0284c7;">
            ${escapeHtml(r.examBoard)}
          </span>
          <span style="font-size: 0.95rem; font-weight: 700; line-height: 1.35; color: var(--text-main, #0c2340);">
            ${escapeHtml(r.heading)}
          </span>
        </a>`,
      )
      .join('');

  container.innerHTML = `
    <div class="schools-showcase-wrap" style="max-width: 1080px; margin: 0 auto; padding: 20px 16px 40px; display: flex; flex-direction: column; gap: 28px;">
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
          Complete Digital &amp; Reprographic History Curriculum — Ready to Teach Tomorrow
        </h1>
        <p style="font-size: 1.02rem; line-height: 1.65; color: #cbd5e1; max-width: 820px; margin: 0 0 22px;">
          19 full courses across <strong>Key Stage 2</strong>, <strong>Key Stage 3 (Years 7–9)</strong>, and <strong>Pearson Edexcel GCSE (9–1)</strong>—combining studio-voiced interactive lessons and primary source enquiries with saddle-stitch Classroom Textbooks, Pupil Workbooks, and Knowledge Retrieval Companions.
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <a
            href="mailto:contact@historyrevisionhub.co.uk?subject=History%20Department%20Enquiry%20%E2%80%94%20The%20History%20Revision%20Hub"
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
            <i class="fa-solid fa-envelope"></i> Enquire for Your Department
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
            <i class="fa-solid fa-compass"></i> Explore Live Courses
          </a>
        </div>
      </section>

      <!-- 3 Zero-Friction School Pillars -->
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        <div style="padding: 22px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
          <div style="font-size: 0.78rem; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            <i class="fa-solid fa-shield-halved"></i> Zero Student Logins or GDPR Delays
          </div>
          <h2 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">Instant Classroom &amp; Homework Access</h2>
          <p style="font-size: 0.9rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            No student accounts, no personal data stored, and no CSV roster uploads. Share direct lesson, audio, or quiz links straight into Google Classroom or Microsoft Teams with zero DPO paperwork.
          </p>
        </div>

        <div style="padding: 22px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
          <div style="font-size: 0.78rem; font-weight: 800; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            <i class="fa-solid fa-print"></i> Custom School Cover Branding
          </div>
          <h2 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 8px; color: var(--text-main, #0c2340);">Print-Room Ready A3 &amp; A4 Booklets</h2>
          <p style="font-size: 0.9rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            Every unit includes page-calibrated saddle-stitch booklets engineered for school photocopiers, available custom-stamped with your school or History Department masthead on the front cover.
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

      <!-- 4-Tier Publication Taxonomy with Live Sample Previews -->
      <section style="padding: 24px; border-radius: 16px; background: var(--bg-card, #ffffff); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.1)); box-shadow: var(--shadow-sm, 0 4px 6px -1px rgba(0, 0, 0, 0.05));">
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.35rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">
          Four Non-Overlapping Classroom Publications Per Course
        </h2>
        <p style="font-size: 0.92rem; line-height: 1.6; margin: 0 0 18px; color: var(--text-muted, #475569);">
          Open any sample PDF below to inspect exact print geometry, typography, and historical grounding.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(235px, 1fr)); gap: 14px;">
          <div style="padding: 16px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12)); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-size: 0.74rem; font-weight: 800; color: #0284c7; text-transform: uppercase; margin-bottom: 4px;">1. Master Textbook</div>
              <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">Pure Narrative Reading Anthology</h3>
              <p style="font-size: 0.85rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
                Uninterrupted, age-calibrated historical narrative designed for whole-class reading without worksheet clutter.
              </p>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.8rem; font-weight: 700;">
              <a href="/pdfs/eee_textbook_KT1.pdf" target="_blank" rel="noopener" style="color: #0284c7; text-decoration: underline;">GCSE Elizabeth Sample (PDF)</a>
              <span style="opacity: 0.45;">&bull;</span>
              <a href="/pdfs/ks2_ww2_textbook.pdf" target="_blank" rel="noopener" style="color: #0284c7; text-decoration: underline;">KS2 WWII Sample (PDF)</a>
            </div>
          </div>

          <div style="padding: 16px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12)); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-size: 0.74rem; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 4px;">2. Pupil Workbook</div>
              <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">Double-Page Enquiry Spreads</h3>
              <p style="font-size: 0.85rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
                Monochrome photocopier interior pairing a 5-stage chronological spine (Verso) with structured writing tasks (Recto) and Teacher WAGOLLs.
              </p>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.8rem; font-weight: 700;">
              <a href="/pdfs/gcse_cold_war_pupil_workbook_KT1.pdf" target="_blank" rel="noopener" style="color: #059669; text-decoration: underline;">GCSE Cold War Sample (PDF)</a>
              <span style="opacity: 0.45;">&bull;</span>
              <a href="/pdfs/ks2_ww2_pupil_workbook.pdf" target="_blank" rel="noopener" style="color: #059669; text-decoration: underline;">KS2 WWII Sample (PDF)</a>
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
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.8rem; font-weight: 700;">
              <a href="/pdfs/eee_retrieval_companion.pdf" target="_blank" rel="noopener" style="color: #7c3aed; text-decoration: underline;">GCSE 16p Sample (PDF)</a>
              <span style="opacity: 0.45;">&bull;</span>
              <a href="/pdfs/ks2_ww2_retrieval_companion.pdf" target="_blank" rel="noopener" style="color: #7c3aed; text-decoration: underline;">KS2 4p Sample (PDF)</a>
            </div>
          </div>

          <div style="padding: 16px; border-radius: 12px; background: var(--bg-app, #f8fafc); border: 1px solid var(--border-glass, rgba(12, 35, 64, 0.12)); display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-size: 0.74rem; font-weight: 800; color: #d97706; text-transform: uppercase; margin-bottom: 4px;">4. Mastery Exam Pack</div>
              <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 6px; color: var(--text-main, #0c2340);">Timed Practice &amp; Mark Ladders</h3>
              <p style="font-size: 0.85rem; line-height: 1.55; margin: 0; color: var(--text-muted, #475569);">
                Original Hub exam-style papers, 3-level model answers, 2-lesson teacher delivery sequences, and classroom Hinge Questions.
              </p>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.8rem; font-weight: 700;">
              <a href="/pdfs/cme_new_mastery_pack_FULL.pdf" target="_blank" rel="noopener" style="color: #d97706; text-decoration: underline;">Middle East Pack (PDF)</a>
              <span style="opacity: 0.45;">&bull;</span>
              <a href="/pdfs/eee_mastery_pack_FULL.pdf" target="_blank" rel="noopener" style="color: #d97706; text-decoration: underline;">Elizabeth Pack (PDF)</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Complete 19-Course Directory -->
      <section style="display: flex; flex-direction: column; gap: 20px;">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 10px; color: var(--text-main, #0c2340);">
            Key Stage 4: Pearson Edexcel GCSE (9–1) History (${gcseRoutes.length} Courses)
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">
            ${renderCoursePills(gcseRoutes)}
          </div>
        </div>

        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 10px; color: var(--text-main, #0c2340);">
            Key Stage 3: Years 7–9 UK National Curriculum (${ks3Routes.length} Courses)
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">
            ${renderCoursePills(ks3Routes)}
          </div>
        </div>

        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; margin: 0 0 10px; color: var(--text-main, #0c2340);">
            Key Stage 2: Years 5–6 Primary History (${ks2Routes.length} Course)
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px;">
            ${renderCoursePills(ks2Routes)}
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
            Custom School Cover Packs &amp; Department Enquiries
          </h2>
          <p style="font-size: 0.9rem; line-height: 1.6; margin: 0; color: var(--text-muted, #475569);">
            For custom school-branded PDF booklet bundles, whole-department staff passkeys (Schemes of Work, Workbook Mark Schemes &amp; Cover Generator), or curriculum questions, email <a href="mailto:contact@historyrevisionhub.co.uk" style="color: #0284c7; font-weight: 700; text-decoration: underline;">contact@historyrevisionhub.co.uk</a>. All 1,532 archival images and primary extracts are documented in our <a href="/master_rights_register.html" target="_blank" rel="noopener" style="color: #0284c7; font-weight: 700; text-decoration: underline;">Master Provenance &amp; Copyright Register</a>.
          </p>
        </div>
        <a
          href="mailto:contact@historyrevisionhub.co.uk?subject=History%20Department%20Pack%20Enquiry"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 11px 18px;
            border-radius: 10px;
            background: #0284c7;
            color: #ffffff;
            font-weight: 700;
            font-size: 0.9rem;
            text-decoration: none;
            white-space: nowrap;
          "
        >
          <i class="fa-solid fa-paper-plane"></i> contact@historyrevisionhub.co.uk
        </a>
      </section>
    </div>
  `;
}
