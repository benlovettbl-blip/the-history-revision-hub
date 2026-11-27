/**
 * Curriculum & Pedagogical Architecture View (All-Through Ages 7–16)
 *
 * Driven by:
 *  • /curriculum_meta.json (Course summaries, vocabulary, skills, assessment & SMSC)
 *  • ./curriculum_strands.js (All-Through 26-Unit Substantive Golden Threads: KS2 → KS3 → GCSE)
 *  • ./disciplinary_skills_data.js (7-Rung Disciplinary Progression: Lower KS2 → Upper KS2 → Years 7–11)
 */

import { DISCIPLINARY_STRANDS, YEAR_GROUPS_PROGRESSION } from './disciplinary_skills_data.js';
import { MASTER_DISCIPLINARY_STRANDS, getVerticalProgression } from './curriculum_strands.js';

// Colour palette per year group (header accent)
const YEAR_COLOURS = {
  'Key Stage 2': { bg: '#0f172a', accent: '#38bdf8', badge: '#e0f2fe', badgeText: '#0369a1' },
  'Lower KS2 (Years 3–4)': { bg: '#0c4a6e', accent: '#38bdf8', badge: '#e0f2fe', badgeText: '#0369a1' },
  'Upper KS2 (Years 5–6)': { bg: '#134e4a', accent: '#2dd4bf', badge: '#ccfbf1', badgeText: '#0f766e' },
  'Year 7': { bg: '#1b365d', accent: '#facc15', badge: '#dbeafe', badgeText: '#1e40af' },
  'Year 8': { bg: '#1b4332', accent: '#86efac', badge: '#dcfce7', badgeText: '#166534' },
  'Year 9': { bg: '#4c1d95', accent: '#c4b5fd', badge: '#ede9fe', badgeText: '#5b21b6' },
  'Year 10': { bg: '#7c2d12', accent: '#fdba74', badge: '#fff7ed', badgeText: '#9a3412' },
  'Year 11': { bg: '#1e1b4b', accent: '#a5f3fc', badge: '#ecfeff', badgeText: '#0e7490' },
};

// Recommended 4-Year Primary Sequence & 2-Year Mixed-Age Rolling Cycles (keeping printed covers Year-Neutral)
const KS2_FOUR_YEAR_PLAN = [
  {
    groupTitle: 'Year 3 (Ages 7–8) — Prehistoric Britain, Earliest Civilisations & Local Detective Study',
    groupSub: 'Lower Key Stage 2 Foundations • 3-Term Sequence Building BC/AD Chronology, Artefact Inference & Doorstep Fieldwork',
    accent: '#38bdf8',
    bg: '#0c4a6e',
    slots: [
      { uid: 'ks2_stone_to_iron_age', slotBadge: 'Year 3 • British Prehistory' },
      { uid: 'ks2_ancient_egypt', slotBadge: 'Year 3 • Earliest Civilisations Overview + Depth' },
      { uid: 'ks2_local_history_detective', slotBadge: 'Year 3 • Statutory Local History Study' },
    ],
  },
  {
    groupTitle: 'Year 4 (Ages 8–9) — Classical Democracy, Roman Britain & Victorian Transformation',
    groupSub: 'Lower Key Stage 2 Extension • 3-Term Sequence Across Civic Comparison, Frontier Sources & Industrial Social Change',
    accent: '#0ea5e9',
    bg: '#075985',
    slots: [
      { uid: 'ks2_ancient_greece', slotBadge: 'Year 4 • Ancient Greece & Western Legacy' },
      { uid: 'ks2_romans', slotBadge: 'Year 4 • Roman Empire & Impact on Britain' },
      { uid: 'ks2_victorian_britain', slotBadge: 'Year 4 • Post-1066 British Study (1837–1901)' },
    ],
  },
  {
    groupTitle: 'Year 5 (Ages 9–10) — Early Medieval Britain & Simultaneous AD 900 Global Civilisations',
    groupSub: 'Upper Key Stage 2 • 3-Term Simultaneous World Sequence Connecting AD 900 Britain With Baghdad & West African Benin',
    accent: '#2dd4bf',
    bg: '#115e59',
    slots: [
      { uid: 'ks2_anglo_saxons_vikings', slotBadge: 'Year 5 • Settlement & Struggle to 1066' },
      { uid: 'ks2_early_islamic_baghdad', slotBadge: 'Year 5 • Non-European Contrast c. AD 900 (Option A)' },
      { uid: 'ks2_kingdom_of_benin', slotBadge: 'Year 5 • Non-European Contrast c. AD 900 (Option B)' },
    ],
  },
  {
    groupTitle: 'Year 6 (Ages 10–11) — 2,000-Year Thematic Justice, Wartime Britain & Mesoamerican Depth',
    groupSub: 'Upper Key Stage 2 Capstone • 3-Term KS3-Bridge Sequence Mastering Multi-Causal Reasoning & Synoptic Change',
    accent: '#34d399',
    bg: '#065f46',
    slots: [
      { uid: 'ks2_crime_and_punishment', slotBadge: 'Year 6 • Post-1066 Thematic British Study (AD 43–Present)' },
      { uid: 'ks2_ww2', slotBadge: 'Year 6 • Post-1066 Turning Point (11 Enquiries)' },
      { uid: 'ks2_maya_civilisation', slotBadge: 'Year 6 • Non-European Contrast c. AD 900 (Option C)' },
    ],
  },
];

const KS2_MIXED_AGE_ROLLING = [
  {
    groupTitle: 'Lower KS2 Mixed-Age (Years 3/4) — Cycle A',
    groupSub: 'Zero topic repetition across a 2-year rolling programme • Year-neutral printed booklets (3 Units)',
    accent: '#38bdf8',
    bg: '#0c4a6e',
    slots: [
      { uid: 'ks2_stone_to_iron_age', slotBadge: 'Y3/4 Cycle A • Prehistoric Britain' },
      { uid: 'ks2_ancient_egypt', slotBadge: 'Y3/4 Cycle A • Earliest River Civilisations' },
      { uid: 'ks2_local_history_detective', slotBadge: 'Y3/4 Cycle A • Local History Detective Study' },
    ],
  },
  {
    groupTitle: 'Lower KS2 Mixed-Age (Years 3/4) — Cycle B',
    groupSub: 'Classical Mediterranean, Roman Britain & Victorian Steam Age • Seamless entry in Year 3 or Year 4 (3 Units)',
    accent: '#0ea5e9',
    bg: '#075985',
    slots: [
      { uid: 'ks2_ancient_greece', slotBadge: 'Y3/4 Cycle B • Ancient Greece & Legacy' },
      { uid: 'ks2_romans', slotBadge: 'Y3/4 Cycle B • The Romans in Britain' },
      { uid: 'ks2_victorian_britain', slotBadge: 'Y3/4 Cycle B • Victorian Britain (1837–1901)' },
    ],
  },
  {
    groupTitle: 'Upper KS2 Mixed-Age (Years 5/6) — Cycle A',
    groupSub: 'Simultaneous Early Medieval Worlds (c. AD 900) • Direct bridge from Britain to Silk Road Baghdad & Benin (3 Units)',
    accent: '#2dd4bf',
    bg: '#115e59',
    slots: [
      { uid: 'ks2_anglo_saxons_vikings', slotBadge: 'Y5/6 Cycle A • Saxons & Vikings to 1066' },
      { uid: 'ks2_early_islamic_baghdad', slotBadge: 'Y5/6 Cycle A • Early Islamic Baghdad c. AD 900' },
      { uid: 'ks2_kingdom_of_benin', slotBadge: 'Y5/6 Cycle A • Kingdom of Benin c. AD 900–1897' },
    ],
  },
  {
    groupTitle: 'Upper KS2 Mixed-Age (Years 5/6) — Cycle B',
    groupSub: '2,000-Year Thematic Justice, Wartime Britain & Mesoamerican Science • Builds directly into Year 7 KS3 History (3 Units)',
    accent: '#34d399',
    bg: '#065f46',
    slots: [
      { uid: 'ks2_crime_and_punishment', slotBadge: 'Y5/6 Cycle B • Crime & Punishment Through Time' },
      { uid: 'ks2_ww2', slotBadge: 'Y5/6 Cycle B • World War II & Home Front' },
      { uid: 'ks2_maya_civilisation', slotBadge: 'Y5/6 Cycle B • The Ancient Maya' },
    ],
  },
];

let metaCache = null;
let currentViewTab = 'sequence'; // 'sequence' | 'threads' | 'matrix' | 'pedagogy'
let ks2PlanMode = 'four_year'; // 'four_year' | 'rolling' | 'catalog'
let selectedStrand = 'all';
let selectedYear = 'all';
let selectedGoldenThread = 'all';
let selectedGoldenPhase = 'all'; // 'all' | 'KS2' | 'KS3' | 'GCSE'

async function loadMeta() {
  if (metaCache) return metaCache;
  const res = await fetch(`/curriculum_meta.json?v=${Date.now()}`);
  metaCache = await res.json();
  return metaCache;
}

export async function renderCurriculumMap() {
  const container = document.getElementById('main-content');
  if (!container) return;

  container.innerHTML = `
    <div style="padding: 24px 28px; max-width: 100%;">
      <!-- Top Header & PDF Action Bar -->
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h1 style="font-family:'Playfair Display',serif; font-size:1.85rem; margin:0; color:var(--text-primary);">
            Curriculum &amp; Pedagogical Architecture
          </h1>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.9rem;">
            The History Department &mdash; Key Stage 2, Key Stage 3 &amp; GCSE (Ages 7&ndash;16 &middot; 30 Courses) &middot; 2026&ndash;2027
          </p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <a href="/pdfs/curriculum_overview_tabular.pdf" target="_blank"
             style="display:inline-flex; align-items:center; gap:8px; padding:9px 16px;
                    background:var(--primary, #1e3a8a); color:#fff; border-radius:8px; text-decoration:none;
                    font-weight:600; font-size:0.85rem; box-shadow:0 2px 6px rgba(0,0,0,0.1); transition:all 0.2s;"
             onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'"
             onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'">
            <i class="fa-solid fa-table"></i> Tabular Overview (PDF)
          </a>
          <a href="/pdfs/whole_school_curriculum_overview.pdf" target="_blank"
             style="display:inline-flex; align-items:center; gap:8px; padding:9px 16px;
                    background:#1b365d; color:#fff; border-radius:8px; text-decoration:none;
                    font-weight:600; font-size:0.85rem; box-shadow:0 2px 6px rgba(0,0,0,0.1); transition:all 0.2s;"
             onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'"
             onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'">
            <i class="fa-solid fa-book-open"></i> Full SOW (PDF)
          </a>
          <a href="/pdfs/pedagogy/01_high_challenge_shared_reading_and_the_decoded_classroom.pdf" target="_blank"
             style="display:inline-flex; align-items:center; gap:8px; padding:9px 16px;
                    background:#0f766e; color:#fff; border-radius:8px; text-decoration:none;
                    font-weight:600; font-size:0.85rem; box-shadow:0 2px 6px rgba(0,0,0,0.1); transition:all 0.2s; border:1px solid #14b8a6;"
             onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'"
             onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'"
             title="Pedagogical Research Dossier 01: High-Challenge Shared Reading &amp; The Decoded Classroom (PDF)">
            <i class="fa-solid fa-graduation-cap"></i> Pedagogy Dossier 01 (PDF)
          </a>
          <a href="/pdfs/history_marking_and_feedback_policy_v2.pdf" target="_blank"
             style="display:inline-flex; align-items:center; gap:8px; padding:9px 16px;
                    background:#1e293b; color:#fff; border-radius:8px; text-decoration:none;
                    font-weight:600; font-size:0.85rem; box-shadow:0 2px 6px rgba(0,0,0,0.1); transition:all 0.2s; border:1px solid #475569;"
             onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-1px)'"
             onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'"
             title="Department Policy: Core principles with visual marking evidence and standards appendix">
            <i class="fa-solid fa-file-circle-check"></i> Marking &amp; Feedback Policy
          </a>
        </div>
      </div>

      <!-- Navigation Tab Switcher -->
      <div style="display:flex; gap:10px; margin-bottom:24px; border-bottom:2px solid var(--border, #e2e8f0); padding-bottom:12px; flex-wrap:wrap;">
        <button id="btn-tab-sequence"
          style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:8px; font-weight:600; font-size:0.9rem; cursor:pointer; border:none; transition:all 0.2s; ${currentViewTab === 'sequence' ? 'background:#1b365d; color:#fff; box-shadow:0 2px 8px rgba(27,54,93,0.25);' : 'background:var(--surface-secondary, #f1f5f9); color:var(--text-secondary, #475569);'}">
          <i class="fa-solid fa-map-location-dot"></i> Curriculum Sequence (KS2 &amp; Y7–11)
        </button>
        <button id="btn-tab-threads"
          style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:8px; font-weight:600; font-size:0.9rem; cursor:pointer; border:none; transition:all 0.2s; ${currentViewTab === 'threads' ? 'background:#1b365d; color:#fff; box-shadow:0 2px 8px rgba(27,54,93,0.25);' : 'background:var(--surface-secondary, #f1f5f9); color:var(--text-secondary, #475569);'}">
          <i class="fa-solid fa-link"></i> Substantive Golden Threads (KS2 &rarr; GCSE)
        </button>
        <button id="btn-tab-matrix"
          style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:8px; font-weight:600; font-size:0.9rem; cursor:pointer; border:none; transition:all 0.2s; ${currentViewTab === 'matrix' ? 'background:#1b365d; color:#fff; box-shadow:0 2px 8px rgba(27,54,93,0.25);' : 'background:var(--surface-secondary, #f1f5f9); color:var(--text-secondary, #475569);'}">
          <i class="fa-solid fa-stairs"></i> Disciplinary Skills Matrix (LKS2 &rarr; Y11)
        </button>
        <button id="btn-tab-pedagogy"
          style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:8px; font-weight:600; font-size:0.9rem; cursor:pointer; border:none; transition:all 0.2s; ${currentViewTab === 'pedagogy' ? 'background:#1b365d; color:#fff; box-shadow:0 2px 8px rgba(27,54,93,0.25);' : 'background:var(--surface-secondary, #f1f5f9); color:var(--text-secondary, #475569);'}">
          <i class="fa-solid fa-graduation-cap"></i> Pedagogy &amp; KS2&ndash;KS3 Bridge
        </button>
      </div>

      <!-- Dynamic Content Area -->
      <div id="curriculum-map-body"></div>
    </div>
  `;

  document.getElementById('btn-tab-sequence')?.addEventListener('click', () => {
    currentViewTab = 'sequence';
    renderCurriculumMap();
  });
  document.getElementById('btn-tab-threads')?.addEventListener('click', () => {
    currentViewTab = 'threads';
    renderCurriculumMap();
  });
  document.getElementById('btn-tab-matrix')?.addEventListener('click', () => {
    currentViewTab = 'matrix';
    renderCurriculumMap();
  });
  document.getElementById('btn-tab-pedagogy')?.addEventListener('click', () => {
    currentViewTab = 'pedagogy';
    renderCurriculumMap();
  });

  if (currentViewTab === 'sequence') {
    await renderSequenceView();
  } else if (currentViewTab === 'threads') {
    renderGoldenThreadsView();
  } else if (currentViewTab === 'matrix') {
    renderMatrixView();
  } else if (currentViewTab === 'pedagogy') {
    renderPedagogyView();
  }
}

function buildUnitCardElement(unit, colours, customBadgeText = null, isKs2Unit = false) {
  const isRevision = unit.uid === '_revision';
  const termLabel =
    customBadgeText ||
    (unit.terms.length === 1
      ? unit.terms[0]
      : `${unit.terms[0]} – ${unit.terms[unit.terms.length - 1]}`);

  const card = document.createElement('div');
  card.style.cssText = `
    padding: 18px 20px;
    border-right: 1px solid var(--border, #e2e8f0);
    border-bottom: 1px solid var(--border, #e2e8f0);
    background: var(--surface, #fff);
    display: flex;
    flex-direction: column;
    gap: 12px;
    ${isRevision ? 'opacity:0.8; background: #f1f5f9;' : ''}
  `;

  const titleLink = !isRevision
    ? `<a href="#" onclick="event.preventDefault(); window.switchView('lessons','${unit.uid}');"
         style="color:${colours.bg}; text-decoration:none; font-weight:700; font-size:0.95rem;
                font-family:'Playfair Display',serif; line-height:1.3; display:block;
                transition:color 0.2s;"
         onmouseover="this.style.color='var(--primary)'"
         onmouseout="this.style.color='${colours.bg}'">${unit.shortTitle}</a>`
    : `<span style="color:${colours.bg}; font-weight:700; font-size:0.95rem; font-family:'Playfair Display',serif; line-height:1.3;">${unit.shortTitle}</span>`;

  const ks2UnitSowLink =
    isKs2Unit && !isRevision
      ? `<a href="/pdfs/${unit.uid}_scheme_of_work.pdf" target="_blank" rel="noopener"
           style="font-size:0.71rem; font-weight:700; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:2px 8px; border-radius:6px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; white-space:nowrap;"
           title="Open Walk-In Primary Teacher Guide &amp; SOW (PDF)">
           <i class="fa-solid fa-file-pdf"></i> Walk-In SOW
         </a>`
      : '';

  card.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;">
      <span style="background:${colours.badge}; color:${colours.badgeText}; padding:2px 10px; border-radius:20px; font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; white-space:nowrap;">
        ${termLabel}
      </span>
      ${ks2UnitSowLink}
    </div>

    ${titleLink}

    <p style="margin:0; font-size:0.82rem; color:var(--text-muted, #64748b); line-height:1.55;">
      ${unit.summary}
    </p>

    ${
      unit.vocab
        ? `
      <div style="display:flex; flex-wrap:wrap; gap:5px;">
        ${unit.vocab
          .split(',')
          .map(
            (v) =>
              `<span style="background:var(--surface-secondary,#f1f5f9); border:1px solid var(--border,#e2e8f0); border-radius:12px; padding:2px 8px; font-size:0.7rem; color:var(--text-secondary,#475569);">${v.trim()}</span>`,
          )
          .join('')}
      </div>
    `
        : ''
    }

    <hr style="border:none; border-top:1px solid var(--border,#e2e8f0); margin:4px 0;">

    <div style="font-size:0.78rem; color:var(--text-secondary,#475569);">
      <span style="font-weight:600; color:var(--text-primary,#0f172a);">Skills:</span>
      ${unit.skills ? unit.skills.join(' &middot; ') : ''}
    </div>

    <div style="font-size:0.78rem; background:${colours.badge}; border-left:3px solid ${colours.accent}; padding:8px 10px; border-radius:0 6px 6px 0; color:var(--text-secondary,#475569);">
      <span style="font-weight:600; color:${colours.badgeText}; display:block; margin-bottom:2px;">Assessment &amp; Booklets</span>
      ${unit.assessment}
    </div>

    <details style="font-size:0.75rem; color:var(--text-muted,#94a3b8);">
      <summary style="cursor:pointer; font-weight:600; color:var(--text-secondary,#64748b); margin-bottom:6px; list-style:none; display:flex; align-items:center; gap:6px;">
        <i class="fa-solid fa-chevron-right" style="font-size:0.65rem; transition:transform 0.2s;"></i> SMSC &amp; Careers
      </summary>
      <div style="margin-top:6px; padding-top:6px; border-top:1px solid var(--border,#e2e8f0);">
        <p style="margin:0 0 6px;">${unit.smsc || ''}</p>
        <p style="margin:0;"><span style="font-weight:600;">Careers:</span> ${unit.careers || ''}</p>
      </div>
    </details>
  `;

  card.querySelector('details')?.addEventListener('toggle', function () {
    const chevron = this.querySelector('.fa-chevron-right');
    if (chevron) chevron.style.transform = this.open ? 'rotate(90deg)' : 'rotate(0deg)';
  });

  return card;
}

/**
 * View 1: Curriculum Sequence (Termly Grid + Interactive KS2 Primary Planning Switcher)
 */
export async function renderSequenceView(targetBody = null) {
  const body = targetBody || document.getElementById('curriculum-map-body');
  if (!body) return;

  body.innerHTML = `
    <div style="text-align:center; padding:40px; color:var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; margin-bottom:12px;"></i>
      <p>Loading curriculum data&hellip;</p>
    </div>
  `;

  let meta;
  try {
    meta = await loadMeta();
  } catch (e) {
    body.innerHTML = `
      <div style="text-align:center; padding:40px; color:#ef4444;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; margin-bottom:12px;"></i>
        <p>Failed to load curriculum data. Please try refreshing.</p>
      </div>`;
    return;
  }

  body.innerHTML = '<div style="display:flex; flex-direction:column; gap:32px;"></div>';
  const container = body.firstElementChild;

  for (const yearGroup of meta.yearGroups) {
    if (yearGroup.year === 'Key Stage 2') {
      const ks2Section = document.createElement('div');
      ks2Section.style.cssText =
        'border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.1); border:1px solid #cbd5e1; background:#fff;';

      const unitLookup = new Map((yearGroup.units || []).map((u) => [u.uid, u]));

      ks2Section.innerHTML = `
        <div style="background:linear-gradient(135deg, #0f172a 0%, #0c4a6e 100%); color:#fff; padding:18px 22px; border-bottom:3px solid #38bdf8;">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:14px;">
            <div style="max-width:740px;">
              <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(56,189,248,0.18); border:1px solid rgba(56,189,248,0.45); color:#7dd3fc; font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; padding:2px 10px; border-radius:999px; margin-bottom:6px;">
                <i class="fa-solid fa-child-reaching"></i> Key Stage 2 Primary Curriculum &bull; Ages 7&ndash;11
              </div>
              <h2 style="font-family:'Playfair Display',serif; font-size:1.32rem; margin:0 0 4px 0; color:#fff;">
                Key Stage 2 History (8 Statutory &amp; Contrasting Courses)
              </h2>
              <p style="margin:0; font-size:0.82rem; color:#cbd5e1; line-height:1.5;">
                All printed KS2 textbooks and workbooks carry <strong>year-neutral "Key Stage 2" covers</strong> so schools can teach any unit in Years 3&ndash;6. Toggle below between our recommended <strong>4-Year Single-Age Sequence</strong>, <strong>2-Year Mixed-Age Rolling Cycle</strong>, or the flat 8-unit library.
              </p>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; background:rgba(15,23,42,0.48); padding:5px; border-radius:9px; border:1px solid rgba(148,163,184,0.28);">
              <button type="button" class="ks2-plan-btn" data-ks2-mode="four_year"
                style="padding:7px 12px; border-radius:6px; border:none; cursor:pointer; font-size:0.76rem; font-weight:700; transition:all 0.15s; ${ks2PlanMode === 'four_year' ? 'background:#38bdf8; color:#0f172a;' : 'background:transparent; color:#e2e8f0;'}">
                4-Year Plan (Y3&ndash;Y6)
              </button>
              <button type="button" class="ks2-plan-btn" data-ks2-mode="rolling"
                style="padding:7px 12px; border-radius:6px; border:none; cursor:pointer; font-size:0.76rem; font-weight:700; transition:all 0.15s; ${ks2PlanMode === 'rolling' ? 'background:#38bdf8; color:#0f172a;' : 'background:transparent; color:#e2e8f0;'}">
                Mixed-Age Cycle (A/B)
              </button>
              <button type="button" class="ks2-plan-btn" data-ks2-mode="catalog"
                style="padding:7px 12px; border-radius:6px; border:none; cursor:pointer; font-size:0.76rem; font-weight:700; transition:all 0.15s; ${ks2PlanMode === 'catalog' ? 'background:#38bdf8; color:#0f172a;' : 'background:transparent; color:#e2e8f0;'}">
                All 8 Units
              </button>
            </div>
          </div>
        </div>
        <div class="ks2-plan-content-host"></div>
      `;

      const host = ks2Section.querySelector('.ks2-plan-content-host');
      if (ks2PlanMode === 'catalog') {
        const grid = document.createElement('div');
        grid.style.cssText =
          'display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:0; background:var(--surface-secondary, #f8fafc);';
        for (const unit of yearGroup.units) {
          grid.appendChild(buildUnitCardElement(unit, YEAR_COLOURS['Key Stage 2'], 'Key Stage 2 Primary', true));
        }
        host.appendChild(grid);
      } else {
        const activeGroups = ks2PlanMode === 'rolling' ? KS2_MIXED_AGE_ROLLING : KS2_FOUR_YEAR_PLAN;
        activeGroups.forEach((grp) => {
          const band = document.createElement('div');
          band.innerHTML = `
            <div style="background:${grp.bg}; color:#fff; padding:10px 20px; border-left:5px solid ${grp.accent}; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <div>
                <div style="font-weight:800; font-size:0.95rem; font-family:'Playfair Display',serif;">${grp.groupTitle}</div>
                <div style="font-size:0.75rem; color:#bae6fd;">${grp.groupSub}</div>
              </div>
            </div>
          `;
          const grid = document.createElement('div');
          grid.style.cssText =
            'display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:0; background:var(--surface-secondary, #f8fafc);';
          grp.slots.forEach((slot) => {
            const unit = unitLookup.get(slot.uid);
            if (unit) {
              const bandPalette = {
                bg: grp.bg,
                accent: grp.accent,
                badge: '#e0f2fe',
                badgeText: '#0369a1',
              };
              grid.appendChild(buildUnitCardElement(unit, bandPalette, slot.slotBadge, true));
            }
          });
          band.appendChild(grid);
          host.appendChild(band);
        });
      }

      ks2Section.querySelectorAll('.ks2-plan-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          ks2PlanMode = e.currentTarget.getAttribute('data-ks2-mode') || 'four_year';
          renderSequenceView(body);
        });
      });

      container.appendChild(ks2Section);
      continue;
    }

    const colours = YEAR_COLOURS[yearGroup.year] || YEAR_COLOURS['Year 7'];
    const isGCSE = yearGroup.ks.includes('4');

    const section = document.createElement('div');
    section.style.cssText =
      'border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.1);';

    const safeYearName = yearGroup.year.toLowerCase().replace(/\s+/g, '_');
    const sowPdfUrl = `/pdfs/${safeYearName}_sow.pdf`;
    section.innerHTML = `
      <div style="background:${colours.bg}; color:#fff; padding:14px 20px; border-bottom:3px solid ${colours.accent}; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
        <div>
          <h2 style="font-family:'Playfair Display',serif; font-size:1.2rem; margin:0; color:#fff;">${yearGroup.year}</h2>
          <span style="font-size:0.72rem; text-transform:uppercase; letter-spacing:0.1em; color:${colours.accent}; font-weight:600;">${yearGroup.ks}</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          ${isGCSE ? `<span style="background:${colours.accent}; color:${colours.bg}; padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:700;">GCSE</span>` : ''}
          <a href="${sowPdfUrl}" target="_blank"
             style="background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:#fff; padding:5px 12px; border-radius:6px; font-size:0.75rem; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;"
             onmouseover="this.style.background='rgba(255,255,255,0.28)'"
             onmouseout="this.style.background='rgba(255,255,255,0.15)'">
            <i class="fa-solid fa-file-pdf"></i> ${yearGroup.year} SOW (PDF)
          </a>
        </div>
      </div>
    `;

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 0;
      background: var(--surface-secondary, #f8fafc);
    `;

    for (const unit of yearGroup.units) {
      grid.appendChild(buildUnitCardElement(unit, colours, null, false));
    }

    section.appendChild(grid);
    container.appendChild(section);
  }
}

/**
 * View 2: Substantive Golden Threads (All-Through KS2 → KS3 → GCSE Vertical Schema)
 */
function renderGoldenThreadsView() {
  const body = document.getElementById('curriculum-map-body');
  if (!body) return;

  const activeThreads =
    selectedGoldenThread === 'all'
      ? MASTER_DISCIPLINARY_STRANDS
      : MASTER_DISCIPLINARY_STRANDS.filter((t) => t.id === selectedGoldenThread);

  const phaseMeta = {
    KS2: { label: 'Key Stage 2 Primary (Ages 7–11)', badgeBg: '#e0f2fe', badgeText: '#0369a1', border: '#0284c7' },
    KS3: { label: 'Key Stage 3 Secondary (Ages 11–14)', badgeBg: '#dcfce7', badgeText: '#166534', border: '#16a34a' },
    GCSE: { label: 'Edexcel GCSE 9–1 (Ages 14–16)', badgeBg: '#fef3c7', badgeText: '#92400e', border: '#d97706' },
  };

  body.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:24px;">
      <!-- Banner -->
      <div style="background:linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color:#fff; border-radius:12px; padding:24px 28px; border-bottom:4px solid #38bdf8; box-shadow:0 4px 14px rgba(15,23,42,0.15);">
        <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(56,189,248,0.16); border:1px solid #38bdf8; color:#7dd3fc; font-size:0.74rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; padding:4px 11px; border-radius:20px; margin-bottom:10px;">
          <i class="fa-solid fa-link"></i> All-Through Vertical Schema Architecture (Ages 7&ndash;16)
        </div>
        <h2 style="font-family:'Playfair Display',serif; font-size:1.5rem; margin:0 0 8px 0; color:#fff;">
          Substantive Golden Threads: Key Stage 2 &rarr; Key Stage 3 &rarr; GCSE
        </h2>
        <p style="margin:0; font-size:0.88rem; line-height:1.6; color:#cbd5e1; max-width:920px;">
          Grounded in Christine Counsell’s work on substantive curriculum coherence, every primary enquiry plants concrete conceptual anchors (<em>empire, democracy, trade, sanitation, rights</em>) that pupils re-encounter and deepen across all <strong>26 live courses</strong>. Click any course card below to open its lessons directly.
        </p>
      </div>

      <!-- Thread & Phase Filter Bar -->
      <div style="background:var(--surface, #fff); border:1px solid var(--border, #e2e8f0); border-radius:10px; padding:16px 20px; display:flex; flex-direction:column; gap:12px; box-shadow:0 1px 4px rgba(0,0,0,0.05);">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-size:0.78rem; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.05em; min-width:115px;">
            <i class="fa-solid fa-layer-group"></i> Golden Thread:
          </span>
          <button type="button" class="strand-pill ${selectedGoldenThread === 'all' ? 'active-pill' : ''}" data-gthread="all"
            style="padding:6px 12px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; border:1px solid #cbd5e1; background:#f8fafc; color:#334155;">
            All 4 Golden Threads
          </button>
          ${MASTER_DISCIPLINARY_STRANDS.map(
            (t) => `
            <button type="button" class="strand-pill ${selectedGoldenThread === t.id ? 'active-pill' : ''}" data-gthread="${t.id}"
              style="padding:6px 12px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; display:inline-flex; align-items:center; gap:6px;">
              <i class="${t.icon}" style="color:${t.color};"></i> ${t.name}
            </button>
          `,
          ).join('')}
        </div>

        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; border-top:1px dashed #e2e8f0; padding-top:10px;">
          <span style="font-size:0.78rem; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.05em; min-width:115px;">
            <i class="fa-solid fa-graduation-cap"></i> Key Stage:
          </span>
          ${[
            { id: 'all', label: 'All Phases (KS2 → KS3 → GCSE • 26 Courses)' },
            { id: 'KS2', label: 'Key Stage 2 Primary (8)' },
            { id: 'KS3', label: 'Key Stage 3 Secondary (12)' },
            { id: 'GCSE', label: 'Edexcel GCSE 9–1 (6)' },
          ]
            .map(
              (p) => `
            <button type="button" class="year-pill ${selectedGoldenPhase === p.id ? 'active-pill' : ''}" data-gphase="${p.id}"
              style="padding:6px 12px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; border:1px solid #cbd5e1; background:#f8fafc; color:#334155;">
              ${p.label}
            </button>
          `,
            )
            .join('')}
        </div>
      </div>

      <!-- Threads Body -->
      <div id="golden-threads-list" style="display:flex; flex-direction:column; gap:28px;"></div>
    </div>
  `;

  const listEl = document.getElementById('golden-threads-list');
  activeThreads.forEach((thread) => {
    const allStops = getVerticalProgression(thread.id).filter(
      (item) => selectedGoldenPhase === 'all' || item.phase === selectedGoldenPhase,
    );

    const card = document.createElement('div');
    card.style.cssText =
      'background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.06);';

    const phasesToRender = selectedGoldenPhase === 'all' ? ['KS2', 'KS3', 'GCSE'] : [selectedGoldenPhase];
    const phasesHtml = phasesToRender
      .map((phKey) => {
        const phStops = allStops.filter((s) => s.phase === phKey);
        if (phStops.length === 0) return '';
        const pm = phaseMeta[phKey];
        return `
          <div style="padding:16px 22px; border-top:1px solid #e2e8f0; background:#f8fafc;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
              <span style="background:${pm.badgeBg}; color:${pm.badgeText}; border:1px solid ${pm.border}; font-size:0.74rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; padding:3px 10px; border-radius:999px;">
                ${pm.label}
              </span>
              <span style="font-size:0.76rem; color:#64748b; font-weight:600;">${phStops.length} Connected Courses</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(285px, 1fr)); gap:12px;">
              ${phStops
                .map(
                  (stop) => `
                <a href="#"
                   onclick="event.preventDefault(); window.switchView('lessons','${stop.unitId}');"
                   style="display:flex; flex-direction:column; gap:6px; padding:14px 16px; background:#ffffff; border:1px solid #cbd5e1; border-left:4px solid ${thread.color}; border-radius:8px; text-decoration:none; color:#0f172a; transition:transform 0.15s ease, box-shadow 0.15s ease;"
                   onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 14px rgba(15,23,42,0.08)';"
                   onmouseout="this.style.transform='none'; this.style.boxShadow='none';">
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                    <span style="font-size:0.7rem; font-weight:800; color:${pm.badgeText}; text-transform:uppercase; letter-spacing:0.04em;">${stop.cohort}</span>
                    <i class="fa-solid fa-arrow-right" style="font-size:0.72rem; color:#94a3b8;"></i>
                  </div>
                  <div style="font-family:'Playfair Display',serif; font-weight:700; font-size:0.95rem; color:#0f172a; line-height:1.3;">
                    ${stop.displayTitle}
                  </div>
                  <div style="font-size:0.8rem; font-weight:700; color:${thread.color};">
                    ${stop.title}
                  </div>
                  <p style="margin:0; font-size:0.78rem; color:#475569; line-height:1.45;">
                    ${stop.trajectory}
                  </p>
                </a>
              `,
                )
                .join('')}
            </div>
          </div>
        `;
      })
      .join('');

    card.innerHTML = `
      <div style="background:${thread.bgColor}; border-left:6px solid ${thread.color}; padding:18px 24px;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:6px;">
          <div style="width:36px; height:36px; border-radius:8px; background:${thread.color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.05rem;">
            <i class="${thread.icon}"></i>
          </div>
          <h3 style="font-family:'Playfair Display',serif; font-size:1.25rem; margin:0; color:#0f172a;">
            ${thread.name}
          </h3>
        </div>
        <p style="margin:0; font-size:0.84rem; color:#475569; line-height:1.55;">
          ${thread.description}
        </p>
      </div>
      ${phasesHtml}
    `;
    listEl?.appendChild(card);
  });

  body.querySelectorAll('[data-gthread]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      selectedGoldenThread = e.currentTarget.getAttribute('data-gthread') || 'all';
      renderGoldenThreadsView();
    });
  });

  body.querySelectorAll('[data-gphase]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      selectedGoldenPhase = e.currentTarget.getAttribute('data-gphase') || 'all';
      renderGoldenThreadsView();
    });
  });
}

/**
 * View 3: Disciplinary Skills Progression Matrix (Lower KS2 → Upper KS2 → Years 7–11)
 */
function renderMatrixView() {
  const body = document.getElementById('curriculum-map-body');
  if (!body) return;

  body.innerHTML = `
    <div>
      <!-- Matrix Header & Educational Intent -->
      <div style="background:linear-gradient(135deg, #1b365d 0%, #0f172a 100%); color:#fff; border-radius:12px; padding:24px 28px; margin-bottom:24px; border-bottom:4px solid #facc15; box-shadow:0 4px 14px rgba(15,23,42,0.15);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
          <div style="max-width:850px;">
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(250,204,21,0.15); border:1px solid #facc15; color:#facc15; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; padding:4px 10px; border-radius:20px; margin-bottom:10px;">
              <i class="fa-solid fa-graduation-cap"></i> All-Through 7-Stage Disciplinary Progression (Ages 7&ndash;16)
            </div>
            <h2 style="font-family:'Playfair Display',serif; font-size:1.5rem; margin:0 0 10px 0; color:#fff;">
              Historical Thinking &amp; Examination Mastery Matrix
            </h2>
            <p style="margin:0; font-size:0.88rem; line-height:1.6; color:#cbd5e1;">
              Tracks the deliberate cognitive escalation of our four core disciplinary strands from <strong>Lower KS2 (Years 3&ndash;4) artefact clues and concrete triggers</strong> and <strong>Upper KS2 (Years 5&ndash;6) KS3-Bridge paragraphs</strong> right through <strong>Years 7&ndash;9</strong> and <strong>Edexcel GCSE mastery</strong>.
            </p>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button id="matrix-btn-expand-all" style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:6px 14px; border-radius:6px; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s;">
              <i class="fa-solid fa-angles-down"></i> Expand All Scaffolds
            </button>
            <button id="matrix-btn-collapse-all" style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:6px 14px; border-radius:6px; font-size:0.78rem; font-weight:600; cursor:pointer; transition:all 0.2s;">
              <i class="fa-solid fa-angles-up"></i> Collapse All
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div style="background:var(--surface, #fff); border:1px solid var(--border, #e2e8f0); border-radius:10px; padding:16px 20px; margin-bottom:24px; display:flex; flex-direction:column; gap:14px; box-shadow:0 1px 4px rgba(0,0,0,0.05);">
        <!-- Strand Filter Buttons -->
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <span style="font-size:0.8rem; font-weight:700; color:var(--text-secondary,#475569); text-transform:uppercase; letter-spacing:0.05em; min-width:110px;">
            <i class="fa-solid fa-filter"></i> By Strand:
          </span>
          <button class="strand-pill ${selectedStrand === 'all' ? 'active-pill' : ''}" data-strand="all"
            style="padding:6px 12px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; border:1px solid #cbd5e1; background:#f8fafc; color:#334155;">
            All Strands (4)
          </button>
          ${DISCIPLINARY_STRANDS.map(
            (s) => `
            <button class="strand-pill ${selectedStrand === s.id ? 'active-pill' : ''}" data-strand="${s.id}"
              style="padding:6px 12px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; border:1px solid #cbd5e1; background:#f8fafc; color:#334155; display:inline-flex; align-items:center; gap:6px;">
              <i class="${s.icon}" style="color:${s.color};"></i> ${s.title}
            </button>
          `,
          ).join('')}
        </div>

        <!-- Year Group Filter Buttons -->
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; border-top:1px dashed var(--border,#e2e8f0); padding-top:10px;">
          <span style="font-size:0.8rem; font-weight:700; color:var(--text-secondary,#475569); text-transform:uppercase; letter-spacing:0.05em; min-width:110px;">
            <i class="fa-solid fa-calendar-days"></i> By Stage:
          </span>
          <button class="year-pill ${selectedYear === 'all' ? 'active-pill' : ''}" data-year="all"
            style="padding:6px 12px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; border:1px solid #cbd5e1; background:#f8fafc; color:#334155;">
            All Stages (KS2 &amp; Y7–11)
          </button>
          ${YEAR_GROUPS_PROGRESSION.map(
            (yg) => `
            <button class="year-pill ${selectedYear === yg.year ? 'active-pill' : ''}" data-year="${yg.year}"
              style="padding:6px 12px; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; border:1px solid #cbd5e1; background:#f8fafc; color:#334155;">
              ${yg.year} <span style="font-size:0.7rem; color:#64748b;">(${yg.ks})</span>
            </button>
          `,
          ).join('')}
        </div>
      </div>

      <!-- Matrix Cards Container -->
      <div id="matrix-cards-wrapper" style="display:flex; flex-direction:column; gap:28px;"></div>
    </div>
  `;

  renderFilteredMatrixCards();

  document.querySelectorAll('.strand-pill[data-strand]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      selectedStrand = e.currentTarget.getAttribute('data-strand');
      renderMatrixView();
    });
  });

  document.querySelectorAll('.year-pill[data-year]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      selectedYear = e.currentTarget.getAttribute('data-year');
      renderMatrixView();
    });
  });

  document.getElementById('matrix-btn-expand-all')?.addEventListener('click', () => {
    document.querySelectorAll('#matrix-cards-wrapper details').forEach((d) => (d.open = true));
  });
  document.getElementById('matrix-btn-collapse-all')?.addEventListener('click', () => {
    document.querySelectorAll('#matrix-cards-wrapper details').forEach((d) => (d.open = false));
  });
}

function renderFilteredMatrixCards() {
  const container = document.getElementById('matrix-cards-wrapper');
  if (!container) return;
  container.innerHTML = '';

  const activeStrands =
    selectedStrand === 'all'
      ? DISCIPLINARY_STRANDS
      : DISCIPLINARY_STRANDS.filter((s) => s.id === selectedStrand);

  const yearList =
    selectedYear === 'all' ? YEAR_GROUPS_PROGRESSION.map((yg) => yg.year) : [selectedYear];

  for (const strand of activeStrands) {
    const strandBox = document.createElement('div');
    strandBox.style.cssText = `
      background: var(--surface, #fff);
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    `;

    strandBox.innerHTML = `
      <div style="background:${strand.bgColor}; border-left:6px solid ${strand.color}; padding:18px 24px; border-bottom:1px solid ${strand.borderColor};">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:6px;">
          <div style="width:36px; height:36px; border-radius:8px; background:${strand.color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
            <i class="${strand.icon}"></i>
          </div>
          <div>
            <h3 style="font-family:'Playfair Display',serif; font-size:1.25rem; margin:0; color:#0f172a;">
              ${strand.title}
            </h3>
          </div>
        </div>
        <p style="margin:0; font-size:0.83rem; color:#475569; line-height:1.5;">
          ${strand.summary}
        </p>
      </div>
    `;

    const yearGrid = document.createElement('div');
    yearGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 0;
      background: var(--surface-secondary, #f8fafc);
    `;

    for (const yName of yearList) {
      const yearData = strand.years[yName];
      if (!yearData) continue;

      const ygMeta = YEAR_GROUPS_PROGRESSION.find((yg) => yg.year === yName);
      const isGCSE = yName === 'Year 10' || yName === 'Year 11';
      const isKS2 = yName.includes('KS2');

      const card = document.createElement('div');
      card.style.cssText = `
        padding: 20px;
        background: #fff;
        border-right: 1px solid var(--border, #e2e8f0);
        border-bottom: 1px solid var(--border, #e2e8f0);
        display: flex;
        flex-direction: column;
        gap: 14px;
      `;

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-family:'Playfair Display',serif; font-weight:700; font-size:1.06rem; color:${ygMeta?.color || '#1b365d'};">
              ${yName}
            </span>
            <span style="background:${ygMeta?.badge || '#dbeafe'}; color:${ygMeta?.badgeText || '#1e40af'}; font-size:0.71rem; font-weight:700; padding:2px 8px; border-radius:12px;">
              ${yearData.stage}
            </span>
          </div>
          ${isGCSE ? '<span style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; font-size:0.68rem; font-weight:800; padding:2px 6px; border-radius:4px;">EDEXCEL</span>' : ''}
          ${isKS2 ? '<span style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; font-size:0.68rem; font-weight:800; padding:2px 6px; border-radius:4px;">PRIMARY</span>' : ''}
        </div>

        <div style="font-size:0.86rem; font-weight:700; color:#0f172a; line-height:1.4; border-left:3px solid ${strand.color}; padding-left:8px;">
          ${yearData.skillHeadline}
        </div>

        <p style="margin:0; font-size:0.82rem; color:#475569; line-height:1.55;">
          ${yearData.progression}
        </p>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; font-size:0.78rem;">
          <div style="font-weight:700; color:#1e293b; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-puzzle-piece" style="color:${strand.color}; font-size:0.75rem;"></i> Cognitive Scaffold
          </div>
          <div style="color:#334155; font-family:monospace; font-size:0.75rem; background:#fff; padding:6px 8px; border-radius:4px; border:1px solid #cbd5e1; line-height:1.45;">
            ${yearData.scaffold}
          </div>
        </div>

        <details style="font-size:0.76rem; color:#64748b; margin-top:auto;" open>
          <summary style="cursor:pointer; font-weight:600; color:#334155; list-style:none; display:flex; align-items:center; gap:6px; user-select:none;">
            <i class="fa-solid fa-chevron-right" style="font-size:0.65rem; transition:transform 0.2s;"></i> Assessment &amp; Model Stem
          </summary>
          <div style="margin-top:8px; padding-top:8px; border-top:1px solid #e2e8f0; display:flex; flex-direction:column; gap:6px;">
            <div>
              <strong style="color:#0f172a;">Format:</strong> ${yearData.assessmentFormat}
            </div>
            <div>
              <strong style="color:#0f172a;">Model Stem:</strong>
              <em style="color:#1e40af; display:block; margin-top:2px;">"${yearData.modelQuestion}"</em>
            </div>
          </div>
        </details>
      `;

      card.querySelector('details')?.addEventListener('toggle', function () {
        const chevron = this.querySelector('.fa-chevron-right');
        if (chevron) chevron.style.transform = this.open ? 'rotate(90deg)' : 'rotate(0deg)';
      });

      yearGrid.appendChild(card);
    }

    strandBox.appendChild(yearGrid);
    container.appendChild(strandBox);
  }
}

/**
 * View 4: Departmental Pedagogy, Research Base & KS2 → KS3 Transition Architecture
 */
function renderPedagogyView() {
  const body = document.getElementById('curriculum-map-body');
  if (!body) return;

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 28px;">
      <!-- Hero Executive Statement -->
      <div style="background: linear-gradient(135deg, #1b365d 0%, #0f172a 100%); color: #ffffff; padding: 26px 30px; border-radius: 12px; border-left: 5px solid #facc15; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
          <div>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #facc15; font-weight: 700;">Departmental Research Doctrine</span>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 1.6rem; margin: 4px 0 0 0; color: #ffffff;">
              Pedagogical Framework, Disciplinary Literacy &amp; KS2&ndash;GCSE Transition
            </h2>
          </div>
          <span style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; color: #e2e8f0; font-weight: 600;">
            Evidence Base: 2026–2027
          </span>
        </div>
        <p style="margin: 0; font-size: 0.95rem; line-height: 1.6; color: #cbd5e1; max-width: 960px;">
          The History Department operates on a coherent <strong>high-challenge, low-threat</strong> disciplinary model from Age 7 to Age 16. Across Key Stage 2, single wide-margin reading anthologies (55&ndash;68 characters per line) and dual-edition workbooks build fluent oral reading and historical vocabulary; across Key Stage 3 and GCSE, 5-stage narrative expositions, Studio audio narration, and double-page monochrome enquiry spreads preserve working memory for rigorous historical argument.
        </p>
      </div>

      <!-- KS2 -> KS3 -> GCSE Transition Architecture -->
      <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: #e0f2fe; border: 1px solid #bae6fd; color: #0369a1; font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 10px; border-radius: 999px; margin-bottom: 8px;">
          <i class="fa-solid fa-bridge"></i> Primary-to-Secondary Transition Architecture
        </div>
        <h3 style="font-family: 'Playfair Display', serif; font-size: 1.3rem; margin: 0 0 12px 0; color: #0f172a;">
          How Key Stage 2 Prepares Pupils Seamlessly for Year 7 &amp; GCSE
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #0284c7; border-radius: 8px; padding: 16px;">
            <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; margin-bottom: 6px;">1. Wide-Margin Fluency &amp; Phonetics (KS2)</div>
            <p style="margin: 0; font-size: 0.82rem; color: #475569; line-height: 1.5;">
              12.5&ndash;13.8pt Lora single-column textbooks (EEF primary fluency measure), 100% British syllable phonetics, Studio-voiced narrative &amp; primary sources, and 3-Voice home Literary Companions eliminate decoding barriers.
            </p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #0f766e; border-radius: 8px; padding: 16px;">
            <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; margin-bottom: 6px;">2. The KS3-Bridge Spine Workbook (Y5&ndash;Y6)</div>
            <p style="margin: 0; font-size: 0.82rem; color: #475569; line-height: 1.5;">
              Every KS2 unit offers both an Illustrated Primary Workbook and an optional B&amp;W <strong>KS3-Bridge Structured Spine Workbook</strong> (10.5mm lines, 3-stage left spine + 2 structured paragraphs) mirroring our Year 7 layout.
            </p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #4c1d95; border-radius: 8px; padding: 16px;">
            <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; margin-bottom: 6px;">3. 5-Stage Secondary &amp; GCSE Mastery (Y7&ndash;Y11)</div>
            <p style="margin: 0; font-size: 0.82rem; color: #475569; line-height: 1.5;">
              Arriving in Year 7 already fluent in Do Now spaced retrieval, Stage Spines, and source scrutiny, secondary pupils step naturally into 5-stage double-page workbooks (7.8&ndash;8.1mm pitch) and Edexcel GCSE mastery suites.
            </p>
          </div>
        </div>
      </div>

      <!-- Published Research Dossier 01 -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 1.25rem; margin: 0; color: var(--text-primary, #0f172a); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-file-shield" style="color: #14b8a6;"></i> Published Research Dossiers &amp; Department Guides
          </h3>
          <span style="font-size: 0.82rem; color: var(--text-muted, #64748b); font-weight: 600;">213 / 213 Lessons Live Across All 26 Courses</span>
        </div>

        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
            <div style="flex: 1; min-width: 300px;">
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px; flex-wrap: wrap;">
                <span style="background: #0f766e; color: #ffffff; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">DOSSIER 01</span>
                <span style="background: #dcfce7; color: #166534; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">OFFICIAL DOCTRINE</span>
                <span style="color: #64748b; font-size: 0.78rem;">All-Through KS2, KS3 &amp; GCSE</span>
              </div>
              <h4 style="font-family: 'Playfair Display', serif; font-size: 1.3rem; margin: 0 0 6px 0; color: #0f172a;">
                High-Challenge Shared Reading &amp; The Decoded Classroom
              </h4>
              <div style="color: #475569; font-size: 0.88rem; font-weight: 600;">
                Disciplinary Literacy Architecture &amp; Cognitive Working Memory in History
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="/pdfs/pedagogy/01_high_challenge_shared_reading_and_the_decoded_classroom.pdf" target="_blank"
                 style="display: inline-flex; align-items: center; gap: 8px; background: #1b365d; color: #ffffff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.88rem; box-shadow: 0 2px 6px rgba(27,54,93,0.3);">
                <i class="fa-solid fa-file-pdf"></i> Download Dossier 01 (PDF)
              </a>
              <a href="/history_revision_hub_guidance/Guide_04_Disciplinary_Pedagogy_and_Research_Evidence.pdf" target="_blank"
                 style="display: inline-flex; align-items: center; gap: 8px; background: #f1f5f9; color: #334155; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.88rem; border: 1px solid #cbd5e1;">
                <i class="fa-solid fa-book"></i> Guide 04: Research Evidence (PDF)
              </a>
            </div>
          </div>

          <p style="color: #334155; font-size: 0.9rem; line-height: 1.55; margin-bottom: 16px;">
            Establishes the research rationale for combining ambitious narrative storytelling with teacher-modelled shared reading, synchronized Studio speech tracking, interactive dual-coding diagrams, and zero-split-attention double-page spreads across all 30 courses.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
              <div style="font-weight: 700; color: #1e3a8a; font-size: 0.82rem; text-transform: uppercase;">Alex Quigley (2020)</div>
              <div style="color: #475569; font-size: 0.8rem; margin-top: 2px;">Whole-class prosody, explicit Tier 2/3 vocabulary phonetics, and modelled shared reading.</div>
            </div>
            <div style="background: #fdfaf2; border: 1px solid #fef08a; border-radius: 6px; padding: 10px 12px;">
              <div style="font-weight: 700; color: #854d0e; font-size: 0.82rem; text-transform: uppercase;">Christine Counsell (2000/2018)</div>
              <div style="color: #574e40; font-size: 0.8rem; margin-top: 2px;">Storytelling hinterland as the carrier of substantive concepts and vertical Golden Threads.</div>
            </div>
            <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 6px; padding: 10px 12px;">
              <div style="font-weight: 700; color: #0f766e; font-size: 0.82rem; text-transform: uppercase;">Sweller, Myatt &amp; Rosenshine</div>
              <div style="color: #134e4a; font-size: 0.8rem; margin-top: 2px;">Zero same-lesson Do Now self-testing, 2-page cognitive load control, and high-challenge dignity.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Inject styling helper for active pills
const styleEl = document.createElement('style');
styleEl.textContent = `
  .strand-pill.active-pill, .year-pill.active-pill {
    background: #1b365d !important;
    color: #ffffff !important;
    border-color: #1b365d !important;
    box-shadow: 0 2px 6px rgba(27,54,93,0.25) !important;
  }
  .strand-pill.active-pill i {
    color: #facc15 !important;
  }
  .strand-pill.active-pill span, .year-pill.active-pill span {
    color: #e2e8f0 !important;
  }
`;
document.head.appendChild(styleEl);
