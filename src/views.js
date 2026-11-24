/**
 * Views Renderer for GCSE History Study & Revision Portal
 * Handles rendering the Dashboard, Interactive Quizzes, Timelines, Printable Booklets, and Student Profiles.
 */

import { state } from './state.js';
import {
  getMasteryStatus,
  updateLeitnerBox,
  toggleBookmark,
  saveProgress,
  getWeakSpots,
  generateQuestionId,
} from './storage.js';
import {
  renderMobileHomeHeroHTML,
  getPinnedUnits,
  isShowAllCoursesEnabled,
  recordLastVisitedLesson,
  getDueWeakSpotSummary,
} from './mobile_app_shell.js';
import { renderCoverSourcesHTML } from './cover_sources.js';
import { renderKeyTopicLessonsHTML } from './lesson_cards.js';
import { renderUnitSynopsis } from './unit_synopses.js';
import { renderLesson } from './engine/lesson_renderer.js'; // force-refresh
import { getAssetUrl } from './engine/assets.js';
import {
  renderHeroCurricularLaunchpad,
  renderStickyUnitResourceBar,
  CURRICULAR_PILLARS_CATALOG,
} from './engine/hero_launchpad.js';
import { getUnitCatalogEntry, isStaffModeActive } from './data/unit_resources_catalog.js';
import { getCleanPathForLesson as buildCleanLessonPath } from './data/seo_routes.js';
import { isVerifiedPdf } from './verified_pdf_manifest.js';
import './engine/modals.js'; // Side-effect: registers window.renderQuizQuestion, openGallery, etc.
import {
  renderDiagnosticLauncherHTML,
  launchUnitBenchmark,
  startDiagnosticBenchmark,
  sampleDiagnosticQuestions,
} from './diagnostic_benchmark.js';

export function getUnits() {
  if (!window.db) return [];
  return Object.keys(window.db).map((k) => {
    const raw = window.db[k] || {};
    const unitObj = raw.data || raw;
    return {
      id: k,
      ...unitObj,
    };
  });
}

export function renderDashboard() {
  const container = document.getElementById('main-content');
  const contentArea = document.getElementById('content-area');
  if (contentArea) contentArea.style.paddingTop = '1.75rem';

  const units = getUnits();
  const dashParams = new URLSearchParams(window.location.search || '');
  const isLockedKs2Dash =
    (dashParams.get('portal') || '').toLowerCase() === 'ks2' &&
    (dashParams.get('locked') === 'true' ||
      dashParams.get('mode') === 'pupil' ||
      dashParams.get('safeguard') === 'true');
  const mobileHeroHtml = !isLockedKs2Dash ? renderMobileHomeHeroHTML(units) : '';
  const pinnedFocusClass =
    !isLockedKs2Dash && getPinnedUnits().length > 0 && !isShowAllCoursesEnabled()
      ? 'hh-pinned-only-mode'
      : '';

  let html = `
    <div class="homepage-dashboard-container ${pinnedFocusClass}" style="max-width: 1240px; margin: 0 auto; padding: 0 20px 60px 20px;">
      ${mobileHeroHtml}
      
      <!-- Single-Row Curriculum Filter Bar (Replaces competing stage + jump + sub-filter bars) -->
      <div class="homepage-nav-toolbar" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: var(--bg-card, #ffffff); border: 1.5px solid var(--border-glass, #e2e8f0); border-radius: 12px; padding: 8px 14px; margin-bottom: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div class="unified-course-filter-group" style="display: inline-flex; align-items: center; gap: 4px; flex-wrap: wrap;">
          <button type="button" class="course-filter-pill active" data-filter="all" style="background: #0f172a; color: #ffffff; border: 1px solid #0f172a; border-radius: 7px; padding: 5px 12px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">All Courses</button>
          <button type="button" class="course-filter-pill" data-filter="ks2" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">KS2</button>
          <button type="button" class="course-filter-pill" data-filter="ks3" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">KS3 All</button>
          <button type="button" class="course-filter-pill" data-filter="ks3-early" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">KS3: Medieval &amp; Tudors</button>
          <button type="button" class="course-filter-pill" data-filter="ks3-empire" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">KS3: Empire &amp; Industry</button>
          <button type="button" class="course-filter-pill" data-filter="ks3-modern" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">KS3: Modern World</button>
          <button type="button" class="course-filter-pill" data-filter="p1" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">GCSE Paper 1</button>
          <button type="button" class="course-filter-pill" data-filter="p2" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">GCSE Paper 2</button>
          <button type="button" class="course-filter-pill" data-filter="p3" style="background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; border-radius: 7px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;">GCSE Paper 3</button>
        </div>
        <button type="button" onclick="window.hhOpenPinUnitsModal && window.hhOpenPinUnitsModal()" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 7px; padding: 5px 11px; font-size: 0.75rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;" title="Pin your exact courses or generate a Teacher Class Setup QR link">
          <i class="fa-solid fa-thumbtack"></i>
          <span>My Courses / QR</span>
        </button>
      </div>
  `;

  // Key Stage 2 Grouping (4 British Chronological Units + 4 World/Ancient Civilisation Units = 8-Unit Symmetrical Grid)
  const ks2Order = [
    'ks2_stone_to_iron_age',
    'ks2_romans',
    'ks2_anglo_saxons_vikings',
    'ks2_ww2',
    'ks2_ancient_egypt',
    'ks2_ancient_greece',
    'ks2_early_islamic_baghdad',
    'ks2_maya_civilisation',
  ];
  const ks2Units = units
    .filter((u) => ks2Order.includes(u.id) || String(u.id || '').startsWith('ks2_'))
    .sort((a, b) => {
      const ia = ks2Order.indexOf(a.id);
      const ib = ks2Order.indexOf(b.id);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  // KS3 Grouping (All 12 Units — Period-Band Agnostic for Flexible 2-Year or 3-Year School Adoption)
  const ks3Meta = {
    water_and_sanitation: { year: 7, eraGroup: 'ks3-early', stage: 'ks3', eraBadge: 'KS3 • Thematic', stageLabel: 'KS3 • Thematic Study' },
    medieval_england: { year: 7, eraGroup: 'ks3-early', stage: 'ks3', eraBadge: 'KS3 • Medieval', stageLabel: 'KS3 • Medieval' },
    monarchy_religion_power: { year: 8, eraGroup: 'ks3-early', stage: 'ks3', eraBadge: 'KS3 • Early Modern', stageLabel: 'KS3 • Early Modern' },
    first_british_empire: { year: 8, eraGroup: 'ks3-empire', stage: 'ks3', eraBadge: 'KS3 • Global & Empire', stageLabel: 'KS3 • Global & Empire' },
    industrialisation_and_empire: { year: 8, eraGroup: 'ks3-empire', stage: 'ks3', eraBadge: 'KS3 • Industry & Reform', stageLabel: 'KS3 • Industry & Reform' },
    second_british_empire: { year: 8, eraGroup: 'ks3-empire', stage: 'ks3', eraBadge: 'KS3 • Global & Empire', stageLabel: 'KS3 • Global & Empire' },
    australia: { year: 8, eraGroup: 'ks3-empire', stage: 'ks3', eraBadge: 'KS3 • World Study', stageLabel: 'KS3 • World Study' },
    great_war: { year: 9, eraGroup: 'ks3-modern', stage: 'ks3', eraBadge: 'KS3 • Modern World', stageLabel: 'KS3 • Modern World' },
    great_war_part2: { year: 9, eraGroup: 'ks3-modern', stage: 'ks3', eraBadge: 'KS3 • Modern World', stageLabel: 'KS3 • Modern World' },
    the_shoah: { year: 9, eraGroup: 'ks3-modern', stage: 'ks3', eraBadge: 'KS3 • Holocaust Study', stageLabel: 'KS3 • Holocaust Study' },
    cold_war: { year: 9, eraGroup: 'ks3-modern', stage: 'ks3', eraBadge: 'KS3 • Modern World', stageLabel: 'KS3 • Modern World' },
    post_war_britain: { year: 9, eraGroup: 'ks3-modern', stage: 'ks3', eraBadge: 'KS3 • Modern Britain', stageLabel: 'KS3 • Modern Britain' },
  };
  const ks3Order = Object.keys(ks3Meta);
  const ks3Units = units
    .filter((u) => ks3Order.includes(u.id))
    .sort((a, b) => ks3Order.indexOf(a.id) - ks3Order.indexOf(b.id));

  // GCSE Grouping (In official Edexcel Paper Order: Paper 1, Paper 2, Paper 3)
  const gcseMeta = {
    edexcel_medicine: { paper: '1', paperNumber: 1, stage: 'gcse', paperBadge: 'Paper 1', stageLabel: 'Edexcel Paper 1' },
    eee: { paper: '2', paperNumber: 2, stage: 'gcse', paperBadge: 'Paper 2', stageLabel: 'Edexcel Paper 2' },
    gcse_cold_war: { paper: '2', paperNumber: 2, stage: 'gcse', paperBadge: 'Paper 2', stageLabel: 'Edexcel Paper 2' },
    cme_new: { paper: '2', paperNumber: 2, stage: 'gcse', paperBadge: 'Paper 2', stageLabel: 'Edexcel Paper 2' },
    weimar_nazi_germany: { paper: '3', paperNumber: 3, stage: 'gcse', paperBadge: 'Paper 3', stageLabel: 'Edexcel Paper 3' },
    usa: { paper: '3', paperNumber: 3, stage: 'gcse', paperBadge: 'Paper 3', stageLabel: 'Edexcel Paper 3' },
  };
  const gcseOrder = Object.keys(gcseMeta);
  const gcseUnits = units
    .filter((u) => gcseOrder.includes(u.id))
    .sort((a, b) => gcseOrder.indexOf(a.id) - gcseOrder.indexOf(b.id));

  const unitCanonicalTitles = {
    ks2_stone_to_iron_age: 'Stone Age to Iron Age (c. 800,000 BC–AD 43)',
    ks2_romans: 'The Romans in Britain (55 BC–AD 410)',
    ks2_anglo_saxons_vikings: 'Anglo-Saxons & Vikings (AD 410–1066)',
    ks2_ww2: 'World War II & The Home Front (1933–1945)',
    ks2_ancient_egypt: 'Ancient Egypt (c. 3100–30 BC)',
    ks2_ancient_greece: 'Ancient Greece (c. 800–146 BC)',
    ks2_early_islamic_baghdad: 'Early Islamic Baghdad (c. AD 750–1258)',
    ks2_maya_civilisation: 'The Ancient Maya (c. 2000 BC–AD 1500)',
    water_and_sanitation: 'Water & Sanitation (1250–Present)',
    medieval_england: 'Medieval England (1066–1485)',
    monarchy_religion_power: 'Crown, Church & Parliament (1517–1689)',
    first_british_empire: 'The First British Empire (1600–1783)',
    industrialisation_and_empire: 'The Industrial Revolution (1750–1900)',
    second_british_empire: 'The Second British Empire (1783–1914)',
    australia: 'Invasion & Survival in Australia',
    great_war: 'Causes of the Great War (1890–1914)',
    great_war_part2: 'The Great War (1914–1919)',
    the_shoah: 'The Shoah (1933–1948)',
    cold_war: 'The Cold War (1945–1991)',
    gcse_cold_war: 'Superpower Relations & the Cold War (1941–1991)',
    second_world_war: 'The Second World War',
    post_war_britain: 'Rights, Protest & Post-War Britain',
    cme_new: 'Conflict in the Middle East (1945–1995)',
    weimar_nazi_germany: 'Weimar & Nazi Germany (1918–1939)',
    edexcel_medicine: 'Medicine Through Time (c.1250–Present)',
    eee: 'Early Elizabethan England (1558–1588)',
    usa: 'USA: Conflict at Home & Abroad (1954–1975)',
  };

  const renderUnitCard = (unit, index, meta) => {
    const isUnlocked = true;
    const rawTitle = unit.title || unit.id;
    const rawImageUrl = unit.homepage_background || unit.cover_image || '';
    const imageUrl = rawImageUrl ? getAssetUrl(rawImageUrl, unit.id) : '';

    const displayTitle =
      unitCanonicalTitles[unit.id] || rawTitle.replace(/^(KS3:\s*|Paper\s*\d+:\s*)/i, '').trim();

    let displayEnquiry =
      unit.enquiry_question ||
      unit.enquiry ||
      unit.desc ||
      'Key disciplinary knowledge and historical enquiry.';
    if (displayEnquiry === rawTitle || displayEnquiry.toLowerCase() === rawTitle.toLowerCase()) {
      displayEnquiry = 'Key concepts, primary source analysis, and historical enquiry.';
    }

    const positionFallbacks = {
      the_shoah: 'center 20%',
      monarchy_religion_power: 'center 12%',
      first_british_empire: 'center 35%',
      eee: 'center 10%',
      edexcel_medicine: 'center 32%',
      cme_new: 'center 20%',
      great_war_part2: 'center 18%',
      australia: 'center 70%',
      weimar_nazi_germany: 'center 20%',
      usa: 'center 25%',
      cold_war: 'center 25%',
      post_war_britain: 'center 20%',
    };
    const bgPos = unit.cover_image_position || positionFallbacks[unit.id] || 'center';

    const isGcse = meta.stage === 'gcse';
    const isKs2 = meta.stage === 'ks2';
    const badgeText = isGcse
      ? (meta.paperBadge || 'Edexcel Paper')
      : isKs2
        ? (meta.eraBadge || meta.stageLabel || 'Key Stage 2')
        : (meta.eraBadge || meta.stageLabel || 'Key Stage 3');

    const cardTopBorder = isGcse
      ? 'border-top: 3.5px solid #f59e0b;'
      : isKs2
        ? 'border-top: 3.5px solid #4f46e5;'
        : 'border-top: 3.5px solid #2563eb;';
    const cardBadgeBg = isGcse
      ? 'rgba(180, 83, 9, 0.92)'
      : isKs2
        ? (meta.badgeBg || 'rgba(67, 56, 202, 0.92)')
        : 'rgba(30, 58, 138, 0.92)';
    const launchColor = isKs2 ? '#4f46e5' : '#2563eb';

    const imgLoadingAttr = meta.stage === 'gcse' || index >= 8 ? ' loading="lazy" decoding="async"' : ' decoding="async"';
    const cardImgHtml = imageUrl
      ? `
        <div class="module-card-img" style="position: relative; height: 130px; overflow: hidden; background: #0a101f; margin: -12px -12px 10px -12px; border-bottom: 1px solid var(--border-glass, #e2e8f0); flex-shrink: 0;">
          <div style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; background-image: url('${imageUrl}'); background-size: cover; background-position: ${bgPos}; filter: blur(12px) brightness(0.35); opacity: 0.7; transform: scale(1.1);"></div>
          <img src="${imageUrl}" alt="${displayTitle}"${imgLoadingAttr} onload="if(this.naturalWidth > this.naturalHeight * 1.18){this.style.objectFit='cover';this.style.objectPosition='${bgPos}';}" style="position: relative; z-index: 2; width: 100%; height: 100%; object-fit: contain; object-position: center; display: block; filter: drop-shadow(0 3px 8px rgba(0,0,0,0.5)); transition: transform 0.3s ease;" />
        </div>
      `
      : `<div class="module-card-img" style="height: 130px; background: var(--primary); margin: -12px -12px 10px -12px;"></div>`;

    return `
      <div class="module-card ${isUnlocked ? '' : 'locked'}" data-year="${meta.year || ''}" data-era="${meta.eraGroup || ''}" data-paper="${meta.paper || ''}" data-stage="${meta.stage}" style="animation-delay: ${index * 0.04}s; cursor: pointer; position: relative; ${cardTopBorder}" data-action="launch-subapp" data-unit="${unit.id}">
        <span style="position: absolute; top: 7px; left: 7px; z-index: 10; background: ${cardBadgeBg}; color: #ffffff; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; padding: 2px 7px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.25); backdrop-filter: blur(4px);">
          ${badgeText}
        </span>
        ${cardImgHtml}
        <div style="position: relative; z-index: 2; padding: 0; flex-grow: 1; display: flex; flex-direction: column;">
          <div style="flex-grow: 1; min-width: 0;">
            <h4 style="margin: 0 0 5px 0; font-size: 0.94rem; font-weight: 700; line-height: 1.25; color: var(--text-main, #0f172a); font-family: 'Playfair Display', serif; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 2.5em;" title="${displayTitle}">${displayTitle}</h4>
            <p style="margin: 0; font-size: 0.77rem; line-height: 1.38; color: var(--text-muted, #64748b); font-style: italic; min-height: 4.15em;" title="${displayEnquiry}">"${displayEnquiry}"</p>
          </div>
        </div>
        
        <div class="module-card-footer" style="margin-top: auto; padding-top: 8px; border-top: 1px solid var(--border-glass, #e2e8f0); display: flex; align-items: center; justify-content: space-between; font-size: 0.74rem; position: relative; z-index: 2;">
          <span style="color: var(--text-muted, #64748b); font-size: 0.72rem; font-weight: 600;">
            ${(unit.lessons && unit.lessons.length) ? `${unit.lessons.length} Lessons` : 'Enquiry Unit'}
          </span>
          <span class="module-launch-link" style="font-weight: 700; color: ${launchColor}; display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem;">
            <span>Explore</span>
            <i class="fa-solid fa-arrow-right" style="font-size: 0.66rem;"></i>
          </span>
        </div>
      </div>
    `;
  };

  // Key Stage 2 Section (Unified Compact Card Grid — Scales Cleanly as New KS2 Units Land)
  if (ks2Units.length > 0) {
    const ks2Meta = {
      ks2_stone_to_iron_age: { stage: 'ks2', eraBadge: 'KS2 • Prehistory', badgeBg: 'rgba(146, 64, 14, 0.92)' },
      ks2_romans: { stage: 'ks2', eraBadge: 'KS2 • Roman Britain', badgeBg: 'rgba(180, 83, 9, 0.92)' },
      ks2_anglo_saxons_vikings: { stage: 'ks2', eraBadge: 'KS2 • Early Medieval', badgeBg: 'rgba(6, 95, 70, 0.92)' },
      ks2_ww2: { stage: 'ks2', eraBadge: 'KS2 • Modern Study', badgeBg: 'rgba(67, 56, 202, 0.92)' },
      ks2_ancient_egypt: { stage: 'ks2', eraBadge: 'KS2 • Ancient Egypt', badgeBg: 'rgba(161, 98, 7, 0.92)' },
      ks2_ancient_greece: { stage: 'ks2', eraBadge: 'KS2 • Ancient Greece', badgeBg: 'rgba(3, 105, 161, 0.92)' },
      ks2_early_islamic_baghdad: { stage: 'ks2', eraBadge: 'KS2 • World c. AD 900', badgeBg: 'rgba(15, 118, 110, 0.92)' },
      ks2_maya_civilisation: { stage: 'ks2', eraBadge: 'KS2 • World c. AD 900', badgeBg: 'rgba(21, 128, 61, 0.92)' },
    };

    html += `
      <div class="dashboard-curriculum-block stage-block-ks2" id="block-ks2" style="margin-bottom: 24px;">
        <div id="ks2-section" style="position: relative; top: -14px;"></div>
        <div class="curriculum-stage-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1.5px solid var(--border-glass, #e2e8f0);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; padding: 3px 10px; border-radius: 6px; font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Key Stage 2</span>
            <h3 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.22rem; font-weight: 700; color: var(--text-main, #0f172a);">
              Primary History Enquiries
            </h3>
          </div>
          <span style="font-size: 0.76rem; font-weight: 600; color: #64748b;">${ks2Units.length} Curriculum ${ks2Units.length === 1 ? 'Unit' : 'Units'}</span>
        </div>

        <div class="modules-grid ks2-modules-grid" style="margin-bottom: 1.5rem;">
          ${ks2Units
            .map((ks2Unit, idx) => {
              const meta = ks2Meta[ks2Unit.id] || { stage: 'ks2', eraBadge: 'Key Stage 2' };
              return renderUnitCard(ks2Unit, idx, meta);
            })
            .join('')}
        </div>
      </div>
    `;
  }

  // Key Stage 3 Section (Continuous 12-Unit Grid with Instant Year Filters)
  if (ks3Units.length > 0) {
    html += `
      <div class="dashboard-curriculum-block stage-block-ks3" id="block-ks3" style="margin-bottom: 24px;">
        <div id="ks3-section" style="position: relative; top: -14px;"></div>
        <div id="year7-section" style="position: relative; top: -14px;"></div>
        <div id="year8-section" style="position: relative; top: -14px;"></div>
        <div id="year9-section" style="position: relative; top: -14px;"></div>

        <div class="curriculum-stage-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1.5px solid var(--border-glass, #e2e8f0);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 3px 10px; border-radius: 6px; font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Key Stage 3</span>
            <h3 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.22rem; font-weight: 700; color: var(--text-main, #0f172a);">
              Medieval, Early Modern &amp; Modern World
            </h3>
          </div>
          <span style="font-size: 0.76rem; font-weight: 600; color: #64748b;">12 Curriculum Units</span>
        </div>

        <div class="modules-grid ks3-modules-grid" style="margin-bottom: 1.5rem;">
    `;
    ks3Units.forEach((u, idx) => {
      const meta = ks3Meta[u.id] || { year: 7, stage: 'ks3', stageLabel: 'KS3' };
      html += renderUnitCard(u, idx, meta);
    });
    html += `</div></div>`;
  }

  // GCSE Section (Continuous 5-Unit Grid + GCSE Spec Tracker Showcase)
  if (gcseUnits.length > 0) {
    html += `
      <div class="dashboard-curriculum-block stage-block-gcse" id="block-gcse" style="margin-bottom: 24px;">
        <div id="gcse-section" style="position: relative; top: -14px;"></div>
        <div id="year10-section" style="position: relative; top: -14px;"></div>
        <div id="year11-section" style="position: relative; top: -14px;"></div>
        <div id="paper1-section" style="position: relative; top: -14px;"></div>
        <div id="paper2-section" style="position: relative; top: -14px;"></div>
        <div id="paper3-section" style="position: relative; top: -14px;"></div>

        <div class="curriculum-stage-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1.5px solid var(--border-glass, #e2e8f0);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 3px 10px; border-radius: 6px; font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">GCSE (9–1)</span>
            <h3 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.22rem; font-weight: 700; color: var(--text-main, #0f172a);">
              Edexcel GCSE History (Papers 1–3)
            </h3>
          </div>
          <span style="font-size: 0.76rem; font-weight: 600; color: #64748b;">${gcseUnits.length} Specification Units</span>
        </div>

        <div class="modules-grid gcse-modules-grid" style="margin-bottom: 1.5rem;">
    `;
    gcseUnits.forEach((u, idx) => {
      const meta = gcseMeta[u.id] || { paper: '3', stage: 'gcse', paperBadge: 'Paper 3', stageLabel: 'Edexcel Paper 3' };
      html += renderUnitCard(u, idx, meta);
    });
    html += `
        </div>
      </div>
    `;
  }

  // Academic Enrichment & Co-Curricular Section (Staff Mode Only — hidden from Pupil Mode)
  if (isStaffModeActive()) {
    html += `
    <div id="enrichment-section" style="margin-top: 36px; padding-top: 26px; border-top: 1.5px solid var(--border-glass, #e2e8f0);">
      <div style="margin-bottom: 16px;">
        <h3 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 1.22rem; font-weight: 700; color: var(--text-main, #0f172a); display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-award" style="color: #f59e0b;"></i>
          <span>Co-Curricular &amp; Academic Enrichment</span>
        </h3>
        <p style="margin: 3px 0 0 0; font-size: 0.8rem; color: var(--text-muted, #64748b);">
          Beyond the specification: external essay competitions, historical writing awards, and house strategic tournaments
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
        
        <!-- Competition Spotlight -->
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #fde68a; border-radius: 14px; padding: 18px 20px; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.08); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 220px; flex: 1;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #f59e0b; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.25);">
              <i class="fa-solid fa-trophy"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 2px;">
                <span style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; background: #d97706; color: #ffffff; padding: 2px 7px; border-radius: 10px;">Enrichment</span>
                <span style="font-size: 0.72rem; font-weight: 700; color: #92400e;">History Awards &amp; Essay Prizes</span>
              </div>
              <div style="font-size: 0.92rem; font-weight: 700; color: #78350f;">
                National Historical Competitions
              </div>
            </div>
          </div>
          <button class="btn-pedagogy-primary" onclick="window.switchView('competitions')" style="background: #d97706; border-color: #b45309; padding: 8px 14px; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; border-radius: 6px; cursor: pointer; color: #ffffff; flex-shrink: 0;">
            <span>Explore Prizes</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- Chess Club Spotlight -->
        <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1.5px solid #ddd6fe; border-radius: 14px; padding: 18px 20px; box-shadow: 0 4px 14px rgba(139, 92, 246, 0.08); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 220px; flex: 1;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #8b5cf6; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; box-shadow: 0 4px 10px rgba(139, 92, 246, 0.25);">
              <i class="fa-solid fa-chess-knight"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 2px;">
                <span style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; background: #7c3aed; color: #ffffff; padding: 2px 7px; border-radius: 10px;">Co-Curricular</span>
                <span style="font-size: 0.72rem; font-weight: 700; color: #6d28d9;">House Strategy League</span>
              </div>
              <div style="font-size: 0.92rem; font-weight: 700; color: #4c1d95;">
                Chess &amp; Tactical Analysis
              </div>
            </div>
          </div>
          <button class="btn-pedagogy-primary" onclick="window.switchView('chess')" style="background: #7c3aed; border-color: #6d28d9; padding: 8px 14px; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; border-radius: 6px; cursor: pointer; color: #ffffff; flex-shrink: 0;">
            <span>Strategy Hub</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

      </div>
    </div>
  `;
  }

  html += `</div>`;
  container.innerHTML = html;

  const stripRoot = document.getElementById('masterpiece-starter-strip-root');
  if (stripRoot) {
    import('./masterpiece_studio.js').then(({ attachStarterStripEvents }) => {
      attachStarterStripEvents(stripRoot);
    });
  }

  // Attach Stage Filter interactivity
  attachDashboardStageFilter(container);
}

function attachDashboardStageFilter(container) {
  if (!container) return;
  const filterBtns = container.querySelectorAll('.course-filter-pill');
  if (!filterBtns.length) return;

  const urlParams = new URLSearchParams(window.location.search);
  const portalParam = (urlParams.get('portal') || '').toLowerCase();
  const isLockedKs2Portal =
    portalParam === 'ks2' &&
    (urlParams.get('locked') === 'true' ||
      urlParams.get('mode') === 'pupil' ||
      urlParams.get('safeguard') === 'true');

  if (!isLockedKs2Portal) {
    try {
      sessionStorage.removeItem('hh_portal');
      if (urlParams.has('portal') || urlParams.has('stage')) {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('portal');
        cleanUrl.searchParams.delete('stage');
        window.history.replaceState(window.history.state || {}, '', cleanUrl);
      }
    } catch (e) {}
  }

  const isKs2Portal = isLockedKs2Portal;

  const ks2Blocks = container.querySelectorAll('.stage-block-ks2');
  const ks3Blocks = container.querySelectorAll('.stage-block-ks3');
  const gcseBlocks = container.querySelectorAll('.stage-block-gcse');
  const ks3Cards = container.querySelectorAll('.ks3-modules-grid .module-card');
  const gcseCards = container.querySelectorAll('.gcse-modules-grid .module-card');

  const applyUnifiedFilter = (mode) => {
    filterBtns.forEach((b) => {
      const isAct = b.dataset.filter === mode;
      b.classList.toggle('active', isAct);
      b.style.background = isAct ? '#0f172a' : '#f8fafc';
      b.style.color = isAct ? '#ffffff' : '#475569';
      b.style.borderColor = isAct ? '#0f172a' : '#e2e8f0';
    });

    if (mode === 'all') {
      ks2Blocks.forEach((el) => (el.style.display = ''));
      ks3Blocks.forEach((el) => (el.style.display = ''));
      gcseBlocks.forEach((el) => (el.style.display = ''));
      ks3Cards.forEach((c) => (c.style.display = ''));
      gcseCards.forEach((c) => (c.style.display = ''));
    } else if (mode === 'ks2') {
      ks2Blocks.forEach((el) => (el.style.display = ''));
      ks3Blocks.forEach((el) => (el.style.display = 'none'));
      gcseBlocks.forEach((el) => (el.style.display = 'none'));
    } else if (
      mode === 'ks3' ||
      mode === 'ks3-early' ||
      mode === 'ks3-empire' ||
      mode === 'ks3-modern' ||
      mode === 'y7' ||
      mode === 'y8' ||
      mode === 'y9'
    ) {
      const legacyMap = { y7: 'ks3-early', y8: 'ks3-empire', y9: 'ks3-modern' };
      const normalizedMode = legacyMap[mode] || mode;
      ks2Blocks.forEach((el) => (el.style.display = 'none'));
      ks3Blocks.forEach((el) => (el.style.display = ''));
      gcseBlocks.forEach((el) => (el.style.display = 'none'));
      ks3Cards.forEach((c) => {
        const show =
          normalizedMode === 'ks3' ||
          c.dataset.era === normalizedMode ||
          (mode.startsWith('y') && c.dataset.year === mode.slice(1));
        c.style.display = show ? '' : 'none';
      });
    } else if (mode === 'p1' || mode === 'p2' || mode === 'p3' || mode === 'gcse') {
      const pNum = mode === 'gcse' ? 'all' : mode.slice(1);
      ks2Blocks.forEach((el) => (el.style.display = 'none'));
      ks3Blocks.forEach((el) => (el.style.display = 'none'));
      gcseBlocks.forEach((el) => (el.style.display = ''));
      gcseCards.forEach((c) => (c.style.display = pNum === 'all' || c.dataset.paper === pNum ? '' : 'none'));
    }
  };

  filterBtns.forEach((btn) => {
    btn.onclick = () => applyUnifiedFilter(btn.dataset.filter);
  });

  window.quickFilterPaper = function (paper) {
    applyUnifiedFilter(paper === 'all' ? 'gcse' : `p${paper}`);
  };
  window.quickFilterYear = function (stage, year) {
    if (stage === 'ks2') applyUnifiedFilter('ks2');
    else if (stage === 'ks3') applyUnifiedFilter(year === 'all' ? 'ks3' : `y${year}`);
    else if (stage === 'gcse') applyUnifiedFilter(year === 'all' ? 'gcse' : `p${year}`);
  };

  if (isKs2Portal) {
    if (document.body) document.body.classList.add('ks2-mode-active');
    applyUnifiedFilter('ks2');
    const enrichmentSection = container.querySelector('#enrichment-section');
    if (enrichmentSection) enrichmentSection.style.display = 'none';
    const toolbar = container.querySelector('.homepage-nav-toolbar');
    if (toolbar) toolbar.style.display = 'none';

    // Hide Secondary/GCSE enrichment banners, sidebar items, non-KS2 unit links, and exam-board footer in KS2 portal mode
    [
      'nav-competitions',
      'nav-chess',
      'app-global-footer',
      'sidebar-units-header',
      'sidebar-unit-links',
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const navDashboardLabel = document.querySelector('#nav-dashboard span');
    if (navDashboardLabel) navDashboardLabel.textContent = 'KS2 Junior Hub';
    const searchPlaceholder = document.querySelector('#header-search-bar .search-placeholder');
    if (searchPlaceholder) {
      searchPlaceholder.textContent =
        window.currentUnitId === 'ks2_romans'
          ? 'Search Romans, Celts, Boudicca...'
          : 'Search KS2 topics, lessons...';
    }
  } else {
    if (document.body) document.body.classList.remove('ks2-mode-active');
    [
      'nav-competitions',
      'nav-chess',
      'app-global-footer',
      'sidebar-units-header',
      'sidebar-unit-links',
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
    const navDashboardLabel = document.querySelector('#nav-dashboard span');
    if (navDashboardLabel) navDashboardLabel.textContent = 'Dashboard';
    const searchPlaceholder = document.querySelector('#header-search-bar .search-placeholder');
    if (searchPlaceholder) {
      searchPlaceholder.textContent = 'Search keywords, lessons...';
    }
  }
}

export async function renderMasterpieceView() {
  const container = document.getElementById('main-content');
  const contentArea = document.getElementById('content-area');
  if (contentArea) contentArea.style.paddingTop = '1.5rem';

  const { getMasterpieceStudioHtml, attachStudioEvents } = await import('./masterpiece_studio.js');

  container.innerHTML = `
    <div style="max-width: 1180px; margin: 0 auto; padding: 0 24px 60px 24px;">
      <button id="masterpiece-back-to-dashboard-btn" style="display:none;" onclick="window.switchView('dashboard')"></button>
      <div id="masterpiece-studio-root">
        ${getMasterpieceStudioHtml()}
      </div>
    </div>
  `;

  const studioRoot = document.getElementById('masterpiece-studio-root');
  if (studioRoot) {
    attachStudioEvents(studioRoot);
  }
}

// Global force update function for mobile devices
window.forceAppUpdate = async function (e) {
  const btn = document.getElementById('btn-force-update');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking for updates...';
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const r of registrations) {
        await r.unregister();
      }
    }
    if ('caches' in window) {
      const names = await caches.keys();
      for (const name of names) {
        await caches.delete(name);
      }
    }
  } catch (err) {
    console.warn('Error purging caches:', err);
  }
  // Force reload with cache buster
  const url = new URL(window.location.href);
  url.searchParams.set('_v', Date.now());
  window.location.href = url.toString();
};

window.launchSubApp = function (subAppName) {
  const urlParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isLocked =
    urlParams &&
    (urlParams.get('locked') === 'true' ||
      urlParams.get('mode') === 'pupil' ||
      urlParams.get('safeguard') === 'true');
  const currentUnit = state.selectedUnitId || window.currentUnitId;

  if (isLocked && currentUnit && subAppName !== currentUnit) {
    console.warn(
      `[Safeguard Mode] Blocked unauthorized attempt to switch from locked unit ${currentUnit} to ${subAppName}`,
    );
    if (window.showToast) {
      window.showToast(
        'Classroom Safeguard Active: Navigation to other units is locked.',
        'warning',
      );
    }
    return;
  }

  // Show the curtain
  const curtain = document.getElementById('page-curtain');
  if (curtain) {
    curtain.classList.remove('hidden');
  }

  setTimeout(async () => {
    if (subAppName === 'gcse_middle_east_1945_1995') {
      window.location.href = '/cme/';
      return;
    }
    let mappedName = subAppName;
    if (subAppName === 'gcse_middle_east_1945_1995_new') mappedName = 'cme_new';
    if (subAppName === 'gcse_usa_1954_1975') mappedName = 'usa';
    if (subAppName === 'gcse_elizabethan_england') mappedName = 'eee';
    if (subAppName === 'great_war_v2') mappedName = 'great_war';

    if (window.switchView) {
      await window.switchView('lessons', mappedName);
    } else {
      window.location.href = `/?view=lessons&unit=${mappedName}`;
    }

    if (curtain) {
      setTimeout(() => curtain.classList.add('hidden'), 150);
    }
  }, 180);
};

export function extractUnitSelfQuizCards(unitData, topicFilter = 'all') {
  if (!unitData) return [];
  const lessons = unitData.lessons || unitData.subtopics || [];
  const workbooks = unitData.workbooks || [];
  const cards = [];
  const seen = new Set();

  lessons.forEach((l, idx) => {
    // Topic filtering
    if (topicFilter && topicFilter !== 'all' && topicFilter !== 'full') {
      let matched = false;

      // 1. Exact ID match (prevents lesson_1 colliding with lesson_10)
      if (l.id && (l.id === topicFilter || l.id.toLowerCase() === topicFilter.toLowerCase())) {
        matched = true;
      }

      // 2. Key topic / workbook prefix matching
      if (!matched && workbooks && workbooks.length > 0) {
        const cleanFilter = topicFilter.toLowerCase().replace(/[\s_:-]+/g, '');
        for (const wb of workbooks) {
          const wbId = (wb.id || wb.name || '').toLowerCase().replace(/[\s_:-]+/g, '');
          if (wbId === cleanFilter) {
            const prefix = (wb.prefix || wb.id || '').toLowerCase().replace(/[\s_:-]+/g, '');
            const lTitle = (l.title || '').toLowerCase().replace(/[\s_:-]+/g, '');
            const lId = (l.id || '').toLowerCase().replace(/[\s_:-]+/g, '');
            if (lTitle.startsWith(prefix) || lId.startsWith(prefix) || lId.includes(prefix)) {
              matched = true;
              break;
            }
          }
        }
      }

      // 3. Fallback: Title matching
      if (!matched) {
        const cleanFilter = topicFilter.toLowerCase().replace(/[\s_:-]+/g, '');
        const lTitle = (l.title || '').toLowerCase().replace(/[\s_:-]+/g, '');
        if (lTitle.includes(cleanFilter)) {
          matched = true;
        }
      }

      if (!matched) return;
    }

    const topicLabel = l.title
      ? l.title.replace(/^(?:enquiry|lesson)\s*\d+[:.]\s*/i, '').trim()
      : `Lesson ${idx + 1}`;

    // 1. Dedicated Flashcards
    if (Array.isArray(l.flashcards)) {
      l.flashcards.forEach((fc) => {
        const q = fc.question || fc.term || fc.q;
        const a = fc.answer || fc.definition || fc.a;
        if (q && a) {
          const key = q.trim().toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            cards.push({
              q:
                q.startsWith('What') ||
                q.startsWith('Who') ||
                q.startsWith('Why') ||
                q.startsWith('How')
                  ? q
                  : `Define: ${q}`,
              a,
              topic: topicLabel,
              lessonId: l.id,
              type: 'flashcard',
            });
          }
        }
      });
    }

    // 2. Vocabulary Terms
    const vocabList = Array.isArray(l.vocab)
      ? l.vocab
      : Array.isArray(l.vocabulary)
        ? l.vocabulary
        : Array.isArray(l.key_vocab)
          ? l.key_vocab
          : [];

    if (vocabList.length > 0) {
      vocabList.forEach((v) => {
        const term = v.term || v.word || v.concept;
        const def = v.definition || v.def || v.meaning;
        if (term && def) {
          const key = term.trim().toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            cards.push({
              q: `Define: "${term}"`,
              a: def,
              topic: topicLabel,
              lessonId: l.id,
              type: 'vocab',
            });
          }
        }
      });
    }
  });

  return cards;
}

export function renderInteractiveQuiz() {
  const container = document.getElementById('main-content');
  const unitId = state.selectedUnitId || window.currentUnitId;
  const data = state.activeUnitData;

  if (!data || !unitId) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 40px;">
        <h3><i class="fa-solid fa-circle-question" style="color: #f59e0b;"></i> Self-Quiz &amp; Knowledge Check</h3>
        <p>Please select a unit to access its interactive flashcards and timed diagnostic quizzes.</p>
        <button class="btn-pedagogy-primary" data-action="switch-view" data-view="dashboard">Back to Dashboard</button>
      </div>
    `;
    return;
  }

  const lessons = data.lessons || data.subtopics || [];
  const validWorkbooks = (data.workbooks || []).filter(
    (wb) => wb && wb.id !== 'full' && wb.name !== 'full',
  );

  let allCards = extractUnitSelfQuizCards(data, 'all');
  if (typeof window !== 'undefined' && window._hhWeakSpotsPracticeActive) {
    window._hhWeakSpotsPracticeActive = false;
    const dueSummary = getDueWeakSpotSummary();
    const unitWeak = getWeakSpots(unitId);
    const prioritized = [];
    const seenQuestions = new Set();

    unitWeak.forEach((ws) => {
      if (ws && ws.q && ws.a) {
        const k = ws.q.trim().toLowerCase();
        if (!seenQuestions.has(k)) {
          seenQuestions.add(k);
          prioritized.push({
            q: ws.q,
            a: ws.a,
            topic: ws.source || 'Due Weak-Spot Review',
            type: 'weak-spot',
          });
        }
      }
    });

    const remaining = [];
    allCards.forEach((c) => {
      const k = String(c.q || '').trim().toLowerCase();
      if (seenQuestions.has(k)) return;
      const cardQId = generateQuestionId(unitId, c.topic, c.q);
      if (dueSummary.dueIds.has(cardQId)) {
        prioritized.push({ ...c, type: 'due-today' });
      } else {
        remaining.push(c);
      }
    });

    if (prioritized.length > 0) {
      allCards = [...prioritized, ...remaining];
    }
  }
  const allDiagQuestions =
    typeof sampleDiagnosticQuestions === 'function'
      ? sampleDiagnosticQuestions(unitId, data, 'all')
      : [];
  const initialDiagCount = allDiagQuestions.length || 20;

  // Initialize self quiz global state
  window._selfQuizState = {
    unitId,
    data,
    topicFilter: 'all',
    activeMode: 'flashcards', // 'flashcards' | 'quiz'
    cards: allCards,
    currentIndex: 0,
    isFlipped: false,
    isWhiteboard: false,
    masteredSet: new Set(),
    learningSet: new Set(),
  };

  const isKs2Quiz = Boolean(
    data.is_ks2 || unitId === 'ks2_ww2' || String(unitId || '').toLowerCase().startsWith('ks2_'),
  );
  const catalogRetrieval = CURRICULAR_PILLARS_CATALOG[unitId]?.retrieval || {};
  const retrievalTitle = isKs2Quiz
    ? '16-Page Master Textbook, 28-Page Pupil Workbook'
    : catalogRetrieval.title || `${data.title || 'Curriculum'} Master Knowledge Retrieval Companion`;
  const retrievalPdf = catalogRetrieval.pdfUrl || `/pdfs/${unitId}_quiz_pack.pdf`;

  // Build topic dropdown options
  let topicOptionsHtml = `
    <option value="all">⭐ Complete Unit (All ${lessons.length > 0 ? lessons.length + ' Lessons • ' : ''}${allCards.length} Cards)</option>
  `;

  if (validWorkbooks.length > 0) {
    topicOptionsHtml += `
      <optgroup label="Key Topics / Modules">
        ${validWorkbooks
          .map((wb, i) => {
            const id = wb.id || wb.name;
            const wbCards = extractUnitSelfQuizCards(data, id);
            return `<option value="${id}">${wb.title || wb.name || `Key Topic ${i + 1}`} (${wbCards.length} Cards)</option>`;
          })
          .join('')}
      </optgroup>
    `;
  }

  if (lessons.length > 0) {
    const groupLabel =
      data.is_ks2 || unitId === 'ks2_ww2'
        ? 'Enquiry Lessons (Key Stage 2)'
        : data.isGCSE
          ? 'Individual Enquiry Lessons'
          : 'Enquiry Lessons';

    topicOptionsHtml += `
      <optgroup label="${groupLabel}">
        ${lessons
          .map((l, idx) => {
            const lCards = extractUnitSelfQuizCards(data, l.id);
            const rawTitle = l.title || `Lesson ${idx + 1}`;
            return `<option value="${l.id}">${rawTitle} (${lCards.length} Cards)</option>`;
          })
          .join('')}
      </optgroup>
    `;
  }

  const html = `
    <div id="self-quiz-arena" class="self-quiz-arena" style="max-width: 960px; margin: 0 auto; padding-bottom: 60px; animation: fadeInUp 0.25s ease-out;">
      <style>
        .self-quiz-arena {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .self-quiz-card-wrapper {
          perspective: 1200px;
          width: 100%;
          max-width: 740px;
          margin: 0 auto;
          min-height: 310px;
          cursor: pointer;
          user-select: none;
        }
        .self-quiz-card-inner {
          position: relative;
          width: 100%;
          min-height: 310px;
          transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        .self-quiz-card-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .self-quiz-face {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 16px;
          padding: 28px 28px 20px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }
        .self-quiz-front {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          color: #0f172a;
        }
        .self-quiz-front:hover {
          border-color: #cbd5e1;
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.12);
        }
        .self-quiz-back {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #6366f1;
          color: #0f172a;
          transform: rotateY(180deg);
        }
        .self-quiz-mode-pill {
          padding: 9px 18px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          border: 1.5px solid transparent;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .self-quiz-mode-pill.active {
          background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          color: #ffffff;
          border-color: #4338ca;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }
        .self-quiz-mode-pill:not(.active) {
          background: #f1f5f9;
          color: #334155;
          border-color: #cbd5e1;
        }
        .self-quiz-mode-pill:not(.active):hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .whiteboard-mode .self-quiz-card-wrapper {
          max-width: 100%;
          min-height: 420px;
        }
        .whiteboard-mode .self-quiz-card-inner {
          min-height: 420px;
        }
        .whiteboard-mode .self-quiz-front-text {
          font-size: 1.7rem !important;
          line-height: 1.4 !important;
        }
        .whiteboard-mode .self-quiz-back-text {
          font-size: 1.4rem !important;
          line-height: 1.5 !important;
        }
      </style>
      
      <!-- Unified Hero Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%); border-radius: 16px; padding: 26px 24px; margin-bottom: 22px; text-align: center; color: #ffffff; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.25), 0 8px 10px -6px rgba(15, 23, 42, 0.2); position: relative; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
        <div style="position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
        
        <div style="position: relative; z-index: 2;">
          <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.12); color: #e0e7ff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 5px 16px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; backdrop-filter: blur(8px);">
            <i class="fa-solid fa-graduation-cap" style="color: #fde047;"></i> ${data.title || 'Curriculum Revision'}
          </div>
          <h1 style="font-family: 'Montserrat', sans-serif; font-size: 2.1rem; font-weight: 800; color: #ffffff; margin: 0 0 8px 0; letter-spacing: -0.5px;">
            ${isKs2Quiz ? 'Interactive Flashcards &amp; Unit Quiz Challenge' : 'Self-Quiz &amp; Knowledge Check'}
          </h1>
          <p style="color: #cbd5e1; font-size: 0.95rem; margin: 0 auto; max-width: 640px; line-height: 1.5; font-weight: 400;">
            ${
              isKs2Quiz
                ? 'Practise key historical vocabulary with interactive 3D flip cards, or test your historical detective skills in a 10-minute unit knowledge challenge!'
                : 'Master core factual recall and key vocabulary through interactive 3D flashcards, or benchmark your exam readiness with a timed diagnostic knowledge check.'
            }
          </p>
        </div>
      </div>

      <!-- Unified Control Panel (Topic Selector + Mode Switcher) -->
      <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 14px 18px; margin-bottom: 20px; box-shadow: 0 4px 18px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        
        <!-- Topic Dropdown -->
        <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 260px;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: #eef2ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div style="flex: 1;">
            <label for="select-recall-deck" style="display: block; font-size: 0.72rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">
              Topic Scope:
            </label>
            <select id="select-recall-deck" class="form-select" style="width: 100%; padding: 7px 10px; font-size: 0.86rem; font-weight: 600; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #ffffff; color: #0f172a; cursor: pointer;" onchange="window.selfQuizSetTopic(this.value)">
              ${topicOptionsHtml}
            </select>
          </div>
        </div>

        <!-- Mode Toggle Pills -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <button id="btn-mode-flashcards" type="button" class="self-quiz-mode-pill active" onclick="window.selfQuizSetMode('flashcards')">
            <i class="fa-solid fa-layer-group" style="color: #6ee7b7;"></i>
            <span>Vocab Cards</span>
            <span id="deck-card-count" style="background: rgba(255,255,255,0.25); color: #fff; font-size: 0.74rem; font-weight: 800; padding: 2px 7px; border-radius: 999px; margin-left: 2px;">
              ${allCards.length}
            </span>
          </button>
          
          <button id="btn-mode-quiz" type="button" class="self-quiz-mode-pill" onclick="window.selfQuizSetMode('quiz')">
            <i class="fa-solid fa-bullseye" style="color: #d97706;"></i>
            <span>10-Minute Knowledge Quiz</span>
            <span id="quiz-deck-q-count" style="background: #e2e8f0; color: #334155; font-size: 0.74rem; font-weight: 800; padding: 2px 7px; border-radius: 999px; margin-left: 2px;">
              ${initialDiagCount} Qs
            </span>
          </button>
        </div>

      </div>

      <!-- MODE A: ACTIVE RECALL FLASHCARDS (IN-APP) -->
      <div id="self-quiz-flashcards-view" style="display: block;">
        
        <!-- Flashcard Deck Header Bar -->
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; gap: 8px; flex: 1 1 auto; min-width: 0; overflow: hidden;">
            <span id="fc-progress-badge" style="background: #4f46e5; color: white; font-size: 0.76rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; letter-spacing: 0.5px; flex-shrink: 0; white-space: nowrap;">
              Card 1 of ${allCards.length}
            </span>
            <span id="fc-topic-chip" style="color: #334155; font-size: 0.82rem; font-weight: 700; flex: 1 1 auto; min-width: 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${allCards[0]?.topic || 'Core Knowledge'}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" onclick="window.selfQuizShuffle()" style="background: #f8fafc; border: 1px solid #cbd5e1; color: #1e293b; padding: 6px 12px; border-radius: 7px; font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#f1f5f9';" onmouseout="this.style.background='#f8fafc';" title="Shuffle Deck">
              <i class="fa-solid fa-shuffle"></i> <span>Shuffle</span>
            </button>
            <button type="button" onclick="window.selfQuizReset()" style="background: #f8fafc; border: 1px solid #cbd5e1; color: #1e293b; padding: 6px 12px; border-radius: 7px; font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#f1f5f9';" onmouseout="this.style.background='#f8fafc';" title="Reset to Start">
              <i class="fa-solid fa-rotate-left"></i> <span>Reset</span>
            </button>
            <button id="btn-fc-whiteboard" type="button" onclick="window.selfQuizToggleWhiteboard()" style="background: #f8fafc; border: 1px solid #cbd5e1; color: #1e293b; padding: 6px 12px; border-radius: 7px; font-size: 0.78rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#f1f5f9';" onmouseout="this.style.background='#f8fafc';" title="Toggle Classroom Large Display Mode">
              <i class="fa-solid fa-chalkboard-user"></i> <span>Smartboard Mode</span>
            </button>
          </div>
        </div>

        <!-- The 3D Flip Flashcard -->
        <div id="self-quiz-card-wrapper" class="self-quiz-card-wrapper" onclick="window.selfQuizFlipCard()">
          <div id="self-quiz-card-inner" class="self-quiz-card-inner">
            
            <!-- Front Face: Question / Term -->
            <div class="self-quiz-face self-quiz-front">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                  <span style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    <i class="fa-solid fa-book-bookmark"></i> Key Vocabulary &amp; Concept
                  </span>
                  <span style="font-size: 0.74rem; font-weight: 600; color: #94a3b8;">
                    Click to flip
                  </span>
                </div>
                <div id="fc-front-text" class="self-quiz-front-text" style="font-size: 1.25rem; font-weight: 700; color: #0f172a; line-height: 1.5; margin-top: 8px;">
                  ${allCards[0]?.q || 'No cards found for this topic.'}
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 14px;">
                <span style="color: #64748b; font-size: 0.78rem;">
                  <i class="fa-solid fa-arrows-rotate" style="color: #059669; margin-right: 5px;"></i> Click card or press <strong>Space</strong> to reveal definition
                </span>
                <span id="fc-type-badge" style="font-size: 0.72rem; color: #059669; font-weight: 700; text-transform: uppercase; background: #ecfdf5; padding: 2px 6px; border-radius: 4px;">
                  ${allCards[0]?.type || 'vocab'}
                </span>
              </div>
            </div>

            <!-- Back Face: Answer / Historical Facts -->
            <div class="self-quiz-face self-quiz-back">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                  <span style="background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    <i class="fa-solid fa-circle-check"></i> Definition &amp; Context
                  </span>
                  <span style="font-size: 0.74rem; font-weight: 600; color: #64748b;">
                    Click to flip back
                  </span>
                </div>
                <div id="fc-back-text" class="self-quiz-back-text" style="font-size: 1.1rem; font-weight: 500; color: #1e293b; line-height: 1.6; margin-top: 8px;">
                  ${allCards[0]?.a || 'Select a different topic to view flashcards.'}
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e0e7ff; padding-top: 12px; margin-top: 14px;">
                <span style="color: #4338ca; font-size: 0.78rem; font-weight: 600;">
                  <i class="fa-solid fa-book-open" style="margin-right: 5px;"></i> Curriculum Key Vocabulary
                </span>
                <span style="color: #64748b; font-size: 0.78rem;">
                  Rate your recall below ↓
                </span>
              </div>
            </div>

          </div>
        </div>

        <!-- Flashcard Navigation & Assessment Controls -->
        <div style="max-width: 740px; margin: 18px auto 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          
          <button id="fc-btn-prev" type="button" onclick="window.selfQuizPrevCard()" style="background: white; border: 1.5px solid #cbd5e1; color: #1e293b; padding: 9px 18px; border-radius: 9px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: all 0.15s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.04);" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='white';">
            <i class="fa-solid fa-arrow-left"></i> Previous
          </button>

          <!-- Self-Assessment Rating Buttons -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" onclick="window.selfQuizMarkLearning()" style="background: #fef2f2; border: 1.5px solid #fecaca; color: #991b1b; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#fee2e2';" onmouseout="this.style.background='#fef2f2';" title="Mark as needing review">
              <i class="fa-solid fa-circle-xmark" style="color: #dc2626;"></i> <span>Still Learning</span>
            </button>
            <button type="button" onclick="window.selfQuizMarkMastered()" style="background: #ecfdf5; border: 1.5px solid #a7f3d0; color: #065f46; padding: 8px 14px; border-radius: 8px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#d1fae5';" onmouseout="this.style.background='#ecfdf5';" title="Mark as mastered">
              <i class="fa-solid fa-circle-check" style="color: #059669;"></i> <span>Mastered</span>
            </button>
          </div>

          <button id="fc-btn-next" type="button" onclick="window.selfQuizNextCard()" style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); border: none; color: white; padding: 9px 20px; border-radius: 9px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: all 0.15s ease; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);" onmouseover="this.style.filter='brightness(1.1)';" onmouseout="this.style.filter='brightness(1)';">
            Next <i class="fa-solid fa-arrow-right"></i>
          </button>

        </div>

        <!-- Session Confidence Stats & Keyboard Helpers -->
        <div style="max-width: 740px; margin: 14px auto 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 0.8rem; color: #334155; padding: 0 4px;">
          <div>
            Session: <span id="fc-mastered-count" style="color: #059669; font-weight: 800;">0</span> Mastered • <span id="fc-learning-count" style="color: #dc2626; font-weight: 800;">0</span> Review
          </div>
          <div style="color: #475569; font-weight: 500;">
            <i class="fa-regular fa-keyboard" style="margin-right: 4px;"></i> <strong>Space</strong> Flip • <strong>← / →</strong> Next / Prev • <strong>1</strong> Review • <strong>2</strong> Mastered
          </div>
        </div>

      </div>

      <!-- MODE B: 10-MINUTE KNOWLEDGE QUIZ (DIAGNOSTIC BENCHMARK) -->
      <div id="self-quiz-quiz-view" style="display: none;">
        <div style="background: white; border: 2px solid #e2e8f0; border-radius: 16px; padding: 32px 28px; box-shadow: 0 6px 24px rgba(0,0,0,0.04); text-align: center; max-width: 740px; margin: 0 auto;">
          
          <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; box-shadow: 0 6px 16px rgba(217, 119, 6, 0.3); margin-bottom: 14px;">
            <i class="fa-solid fa-bullseye" style="color: #fef08a;"></i>
          </div>

          <h2 style="font-family: 'Montserrat', sans-serif; font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">
            ${isKs2Quiz ? '10-Minute WWII Unit Knowledge Challenge' : '10-Minute Knowledge Diagnostic Quiz'}
          </h2>
          <p style="color: #64748b; font-size: 0.9rem; max-width: 540px; margin: 0 auto 22px auto; line-height: 1.5;">
            ${
              isKs2Quiz
                ? `${initialDiagCount} questions across Second World War enquiries checking dates, primary sources, and key vocabulary.`
                : 'Sampled questions testing factual recall and chronological accuracy under timed exam conditions.'
            }
          </p>

          <!-- 3-Metric Spec Breakdown -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 12px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center;">
            <div>
              <div id="diag-metric-q-count" style="font-weight: 800; font-size: 1.25rem; color: #0f172a;">${initialDiagCount}</div>
              <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-weight: 700; margin-top: 2px;">Questions</div>
            </div>
            <div style="border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
              <div style="font-weight: 800; font-size: 1.25rem; color: #d97706;">10:00</div>
              <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-weight: 700; margin-top: 2px;">Countdown</div>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1.25rem; color: #10b981;">Instant</div>
              <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-weight: 700; margin-top: 2px;">Topic Diagnosis</div>
            </div>
          </div>

          <button id="btn-start-diagnostic" class="btn-pedagogy-primary" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000000; font-weight: 800; font-size: 1rem; padding: 13px 28px; border-radius: 10px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35); transition: all 0.15s ease;" onclick="window.launchUnitBenchmark('${unitId}')" onmouseover="this.style.filter='brightness(1.08)';" onmouseout="this.style.filter='brightness(1)';">
            <i class="fa-solid fa-play"></i>
            <span>Start 10-Minute Quiz Now</span>
          </button>

          <div style="margin-top: 14px; font-size: 0.8rem; color: #64748b;">
            <i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 5px;"></i> Provides immediate topic-by-topic score analysis and targeted revision steps.
          </div>
        </div>
      </div>

      <!-- Direct Cross-Reference to Printable Curricular Booklets -->
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-top: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
            <i class="fa-solid fa-file-pdf"></i>
          </div>
          <div>
            <strong style="color: #0f172a; font-size: 0.92rem; display: block;">Prefer physical printed booklets or classroom workbooks?</strong>
            <span style="color: #64748b; font-size: 0.82rem;">${
              isKs2Quiz
                ? 'The 16-page full-colour textbook, 28-page pupil workbook, and printable A4 enquiry worksheets are ready in the Unit Hub.'
                : `${retrievalTitle} and complete pupil workbooks with full teacher mark schemes are available in Workbooks &amp; Textbooks.`
            }</span>
          </div>
        </div>
        <button type="button" onclick="window.switchView('lessons', '${unitId}')" style="background: #f8fafc; border: 1.5px solid #cbd5e1; color: #0f172a; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;" onmouseover="this.style.background='#e2e8f0';" onmouseout="this.style.background='#f8fafc';">
          <span>View Unit Textbooks &amp; Workbooks</span> <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <!-- Universal 7-Game Revision Arcade Banner -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1.5px solid #334155; border-radius: 12px; padding: 14px 18px; margin-top: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <i class="fa-solid fa-gamepad" style="color: #38bdf8; font-size: 1.3rem;"></i>
          <div>
            <strong style="color: #ffffff; font-size: 0.92rem; display: block;">7-Game Revision Arcade</strong>
            <span style="color: #cbd5e1; font-size: 0.8rem;">Play Keyword Stack (History Tetris), Timeline Blitz, Connections Wall, Redacted!, 60s Boss Sprint, Archive Detective &amp; Mythbuster.</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" onclick="if(window.launchUnitArcade){window.launchUnitArcade('${unitId}', 'all', 'lobby');}else if(window.switchView){window.switchView('arcade', '${unitId}');}" style="background: #2563eb; color: #ffffff; font-weight: 800; border-radius: 7px; padding: 8px 15px; font-size: 0.82rem; border: 1px solid #60a5fa; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-gamepad"></i> Launch Revision Arcade
          </button>
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;

  // Bind Keyboard navigation
  if (!window._selfQuizKeyHandlerAttached) {
    window._selfQuizKeyHandlerAttached = true;
    window.addEventListener('keydown', (e) => {
      const arena = document.getElementById('self-quiz-arena');
      if (!arena) return;

      // Ignore if user is inside a select or input
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'select' || tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        window.selfQuizFlipCard();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        window.selfQuizNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        window.selfQuizPrevCard();
      } else if (e.key === '1') {
        e.preventDefault();
        window.selfQuizMarkLearning();
      } else if (e.key === '2') {
        e.preventDefault();
        window.selfQuizMarkMastered();
      }
    });
  }

  // Auto-launch Diagnostic Benchmark if requested via URL param (e.g. from targeted QR code)
  const urlParams = new URLSearchParams(window.location.search);
  if (
    urlParams.get('start') === 'quiz' ||
    urlParams.get('autostart') === 'quiz' ||
    urlParams.get('quiz') === '1'
  ) {
    setTimeout(() => {
      if (typeof window.launchUnitBenchmark === 'function') {
        window.launchUnitBenchmark(unitId);
      } else if (typeof window.startDiagnosticBenchmark === 'function') {
        window.startDiagnosticBenchmark(unitId);
      }
    }, 150);
  }
}

// ----------------------------------------------------
// Self-Quiz Interactive Arena Event Handlers
// ----------------------------------------------------

window.selfQuizUpdateCardDisplay = function () {
  const s = window._selfQuizState;
  if (!s) return;

  const cardInner = document.getElementById('self-quiz-card-inner');
  const frontText = document.getElementById('fc-front-text');
  const backText = document.getElementById('fc-back-text');
  const progressBadge = document.getElementById('fc-progress-badge');
  const topicChip = document.getElementById('fc-topic-chip');
  const typeBadge = document.getElementById('fc-type-badge');
  const prevBtn = document.getElementById('fc-btn-prev');
  const nextBtn = document.getElementById('fc-btn-next');

  // Ensure card is flipped to front on card change
  if (cardInner) {
    cardInner.classList.remove('is-flipped');
  }
  s.isFlipped = false;

  if (!s.cards || s.cards.length === 0) {
    if (frontText) frontText.textContent = 'No cards available for the selected topic.';
    if (backText) backText.textContent = 'Please choose another topic or select Complete Course.';
    if (progressBadge) progressBadge.textContent = 'Card 0 of 0';
    if (topicChip) topicChip.textContent = 'No cards';
    return;
  }

  const current = s.cards[s.currentIndex];
  if (frontText && current) frontText.textContent = current.q;
  if (backText && current) backText.textContent = current.a;
  if (progressBadge) progressBadge.textContent = `Card ${s.currentIndex + 1} of ${s.cards.length}`;
  if (topicChip && current) topicChip.textContent = current.topic || 'Core Knowledge';
  if (typeBadge && current) typeBadge.textContent = current.type || 'core';

  if (prevBtn) prevBtn.disabled = s.currentIndex === 0;
  if (nextBtn) {
    nextBtn.innerHTML =
      s.currentIndex === s.cards.length - 1
        ? 'Restart <i class="fa-solid fa-rotate-left"></i>'
        : 'Next <i class="fa-solid fa-arrow-right"></i>';
  }
};

window.selfQuizFlipCard = function () {
  const s = window._selfQuizState;
  if (!s) return;
  const cardInner = document.getElementById('self-quiz-card-inner');
  if (!cardInner) return;
  s.isFlipped = !s.isFlipped;
  if (s.isFlipped) {
    cardInner.classList.add('is-flipped');
  } else {
    cardInner.classList.remove('is-flipped');
  }
};

window.selfQuizNextCard = function () {
  const s = window._selfQuizState;
  if (!s || !s.cards || s.cards.length === 0) return;
  if (s.currentIndex >= s.cards.length - 1) {
    s.currentIndex = 0;
  } else {
    s.currentIndex++;
  }
  window.selfQuizUpdateCardDisplay();
};

window.selfQuizPrevCard = function () {
  const s = window._selfQuizState;
  if (!s || !s.cards || s.cards.length === 0) return;
  if (s.currentIndex > 0) {
    s.currentIndex--;
    window.selfQuizUpdateCardDisplay();
  }
};

window.selfQuizShuffle = function () {
  const s = window._selfQuizState;
  if (!s || !s.cards || s.cards.length === 0) return;
  const arr = [...s.cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  s.cards = arr;
  s.currentIndex = 0;
  window.selfQuizUpdateCardDisplay();
};

window.selfQuizReset = function () {
  const s = window._selfQuizState;
  if (!s) return;
  s.currentIndex = 0;
  window.selfQuizUpdateCardDisplay();
};

window.selfQuizMarkMastered = function () {
  const s = window._selfQuizState;
  if (!s || !s.cards || s.cards.length === 0) return;
  s.masteredSet.add(s.currentIndex);
  s.learningSet.delete(s.currentIndex);
  const countEl = document.getElementById('fc-mastered-count');
  if (countEl) countEl.textContent = s.masteredSet.size;
  window.selfQuizNextCard();
};

window.selfQuizMarkLearning = function () {
  const s = window._selfQuizState;
  if (!s || !s.cards || s.cards.length === 0) return;
  s.learningSet.add(s.currentIndex);
  s.masteredSet.delete(s.currentIndex);
  const countEl = document.getElementById('fc-learning-count');
  if (countEl) countEl.textContent = s.learningSet.size;
  window.selfQuizNextCard();
};

window.selfQuizSetTopic = function (topicId) {
  const s = window._selfQuizState;
  if (!s) return;
  s.topicFilter = topicId;
  s.cards = extractUnitSelfQuizCards(s.data, topicId);
  s.currentIndex = 0;
  s.masteredSet.clear();
  s.learningSet.clear();

  const countEl = document.getElementById('deck-card-count');
  if (countEl) countEl.textContent = s.cards.length;

  const mCountEl = document.getElementById('fc-mastered-count');
  if (mCountEl) mCountEl.textContent = '0';
  const lCountEl = document.getElementById('fc-learning-count');
  if (lCountEl) lCountEl.textContent = '0';

  if (typeof sampleDiagnosticQuestions === 'function') {
    const qSample = sampleDiagnosticQuestions(s.unitId, s.data, topicId);
    const qCountBadge = document.getElementById('quiz-deck-q-count');
    if (qCountBadge) qCountBadge.textContent = `${qSample.length} Qs`;
    const qMetricEl = document.getElementById('diag-metric-q-count');
    if (qMetricEl) qMetricEl.textContent = qSample.length;
  }

  window.selfQuizUpdateCardDisplay();
};

window.selfQuizSetMode = function (mode) {
  const s = window._selfQuizState;
  if (!s) return;
  s.activeMode = mode;

  const flashcardBtn = document.getElementById('btn-mode-flashcards');
  const quizBtn = document.getElementById('btn-mode-quiz');
  const flashcardsView = document.getElementById('self-quiz-flashcards-view');
  const quizView = document.getElementById('self-quiz-quiz-view');

  if (mode === 'flashcards') {
    if (flashcardBtn) flashcardBtn.classList.add('active');
    if (quizBtn) quizBtn.classList.remove('active');
    if (flashcardsView) flashcardsView.style.display = 'block';
    if (quizView) quizView.style.display = 'none';
  } else {
    if (flashcardBtn) flashcardBtn.classList.remove('active');
    if (quizBtn) quizBtn.classList.add('active');
    if (flashcardsView) flashcardsView.style.display = 'none';
    if (quizView) quizView.style.display = 'block';
  }
};

window.selfQuizToggleWhiteboard = function () {
  const s = window._selfQuizState;
  if (!s) return;
  s.isWhiteboard = !s.isWhiteboard;
  const arena = document.getElementById('self-quiz-arena');
  const btn = document.getElementById('btn-fc-whiteboard');
  if (arena) {
    if (s.isWhiteboard) {
      arena.classList.add('whiteboard-mode');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-compress"></i> <span>Normal View</span>';
    } else {
      arena.classList.remove('whiteboard-mode');
      if (btn)
        btn.innerHTML = '<i class="fa-solid fa-chalkboard-user"></i> <span>Smartboard Mode</span>';
    }
  }
};

window.handleRecallDeckChange = function (unitId, value) {
  window.selfQuizSetTopic(value);
};

window.handleMobileRecallDeckChange = function (unitId, value) {
  window.selfQuizSetTopic(value);
};

window.toggleBookmarkQuestion = function (qid) {
  toggleBookmark(qid);
  renderInteractiveQuiz();
};

window.submitQuizAnswer = function (qid, chosen, btnElement) {
  const data = state.activeUnitData;
  const q = data.quizData.find((item) => item.id === qid);
  if (!q) return;

  const isCorrect = chosen === q.answer;
  updateLeitnerBox(qid, isCorrect);

  // Disable all options
  document.querySelectorAll('.btn-quiz-opt').forEach((btn) => {
    btn.disabled = true;
    if (btn.innerText.trim() === q.answer) {
      btn.classList.add('btn-success');
    } else if (btn === btnElement && !isCorrect) {
      btn.classList.add('btn-danger');
    }
  });

  const feedback = document.getElementById('quiz-feedback');
  feedback.innerHTML = `
    <strong>${isCorrect ? '✅ Correct Answer!' : '❌ Incorrect.'}</strong>
    <p>${q.explanation}</p>
  `;
  feedback.classList.remove('hidden');
};

export async function renderTimeline() {
  const container = document.getElementById('main-content');
  const unitId = state.selectedUnitId || window.currentUnitId;

  if (unitId === 'cme_new' || unitId === 'gcse_middle_east_1945_1995') {
    const { renderCmeLivingTimeline } = await import('./cme_living_timeline.js');
    renderCmeLivingTimeline(container);
    return;
  }

  if (unitId === 'edexcel_medicine') {
    const { renderMedicineLivingTimeline } = await import('./medicine_living_timeline.js');
    renderMedicineLivingTimeline(container);
    return;
  }

  if (unitId === 'ks2_ww2') {
    const { renderKs2TimelineSlider } = await import('./ks2_chronology_slider.js');
    renderKs2TimelineSlider(container);
    return;
  }

  if (unitId === 'ks2_stone_to_iron_age') {
    const { renderKs2StoneAgeTimelineSlider } = await import('./ks2_stone_age_chronology_slider.js');
    renderKs2StoneAgeTimelineSlider(container);
    return;
  }

  if (unitId === 'ks2_romans') {
    const { renderKs2RomansTimelineSlider } = await import('./ks2_romans_chronology_slider.js');
    renderKs2RomansTimelineSlider(container);
    return;
  }

  if (unitId === 'ks2_anglo_saxons_vikings') {
    const { renderKs2SaxonsTimelineSlider } = await import('./ks2_saxons_chronology_slider.js');
    renderKs2SaxonsTimelineSlider(container);
    return;
  }

  if (unitId === 'ks2_ancient_egypt') {
    const { renderKs2EgyptTimelineSlider } = await import('./ks2_egypt_chronology_slider.js');
    renderKs2EgyptTimelineSlider(container);
    return;
  }

  if (unitId === 'ks2_ancient_greece') {
    const { renderKs2GreeceTimelineSlider } = await import('./ks2_greece_chronology_slider.js');
    renderKs2GreeceTimelineSlider(container);
    return;
  }

  if (unitId === 'ks2_early_islamic_baghdad') {
    const { renderKs2BaghdadTimelineSlider } = await import('./ks2_baghdad_chronology_slider.js');
    renderKs2BaghdadTimelineSlider(container);
    return;
  }

  if (unitId === 'ks2_maya_civilisation') {
    const { renderKs2MayaTimelineSlider } = await import('./ks2_maya_chronology_slider.js');
    renderKs2MayaTimelineSlider(container);
    return;
  }

  const events = state.activeUnitData ? state.activeUnitData.timelineEvents : null;

  if (!events || events.length === 0) {
    const { renderUniversalLivingTimeline } = await import('./universal_living_timeline.js');
    renderUniversalLivingTimeline(container, unitId, state.activeUnitData);
    return;
  }

  // Sort chronological order
  const sortedEvents = [...events].sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10));

  container.innerHTML = `
    <div class="card">
      <h3 style="margin-bottom: 24px;"><i class="fa-solid fa-timeline text-primary"></i> Interactive Chronology Timeline</h3>
      <div class="timeline-wrapper">
        ${sortedEvents
          .map((evt, idx) => {
            const eventTitle = evt.title || evt.event || '';
            const eventDetail = evt.text || evt.detail || evt.description || '';
            return `
          <div class="timeline-item ${idx % 2 === 0 ? 'left' : 'right'}">
            <div class="timeline-badge">${evt.year}</div>
            <div class="timeline-panel">
              <h4>${evt.year}${eventTitle ? ` · ${eventTitle}` : ''}</h4>
              <p>${eventDetail}</p>
            </div>
          </div>
        `;
          })
          .join('')}
      </div>
    </div>
  `;
}

export function renderIndividualsView() {
  const container = document.getElementById('main-content');
  if (!container) return;
  const unitId = state.selectedUnitId || window.currentUnitId;
  const data = state.activeUnitData || window.currentUnitData || {};
  const agents = data.key_individuals || data.biographies || [];
  const returnBtnLabel =
    typeof window !== 'undefined' && typeof window.getReturnOriginLabel === 'function'
      ? window.getReturnOriginLabel(unitId, 'Return to Unit Overview')
      : 'Return to Unit Overview';

  container.innerHTML = '';
  if (!agents || agents.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="max-width: 680px; margin: 40px auto; padding: 32px;">
        <h3><i class="fa-solid fa-user-tie"></i> Key Individuals &amp; Organisations</h3>
        <p style="color: var(--text-muted);">No historical agent dossiers are listed for this unit yet.</p>
        <button type="button" class="btn-pedagogy-primary" onclick="if(window.returnToSavedOrigin){window.returnToSavedOrigin('${unitId || ''}');}else if(window.switchView){window.switchView('lessons', '${unitId || ''}');}">${returnBtnLabel}</button>
      </div>
    `;
    return;
  }

  const topBar = document.createElement('div');
  topBar.style.maxWidth = '1220px';
  topBar.style.margin = '0 auto';
  topBar.style.padding = '16px 20px 0 20px';
  topBar.innerHTML = `
    <button type="button" id="individuals-return-btn" onclick="if(window.returnToSavedOrigin){window.returnToSavedOrigin('${unitId || ''}');}else if(window.switchView){window.switchView('lessons', '${unitId || ''}');}" style="background: #f8fafc; border: 1.5px solid #cbd5e1; color: #0f172a; border-radius: 8px; padding: 7px 14px; font-size: 0.84rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
      <i class="fa-solid fa-arrow-left"></i>
      <span>${returnBtnLabel}</span>
    </button>
  `;
  container.appendChild(topBar);

  import('./key_individuals.js').then(({ initKeyIndividualsTask }) => {
    initKeyIndividualsTask(container, agents);
  });
}

export async function renderLessonsView() {
  const container = document.getElementById('main-content');
  const unitId = state.selectedUnitId || 'gcse_usa_1954_1975';
  const data = state.activeUnitData;
  window.currentUnitData = data;
  window.currentUnitId = unitId;

  const lessonsList = data.lessons || data.subtopics;
  if (!data || !lessonsList || lessonsList.length === 0) {
    container.innerHTML = `
      <div class="card text-center">
        <h3><i class="fa-solid fa-book-open"></i> Lessons Study Guide</h3>
        <p>No lessons available for this unit.</p>
        <button class="btn-pedagogy-primary" data-action="switch-view" data-view="dashboard">Back to Dashboard</button>
      </div>
    `;
    return;
  }

  window.viewLessonDetail = function (index, targetStopId = null, skipPush = false) {
    const lessonsList = data.lessons || data.subtopics;
    const sub = lessonsList[index];
    if (!sub) return;

    window.currentLessonIndex = index;
    window.currentView = 'lessons';
    if (state) state.activeLessonIndex = index;

    if (typeof window.highlightActiveSidebarLesson === 'function') {
      window.highlightActiveSidebarLesson(index);
    }

    // Snapshot scroll on outgoing page and push (or merge immediate overview) history state for this lesson
    if (!skipPush && typeof window !== 'undefined' && window.history) {
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      const currentState = window.history.state || {};
      try {
        const url = new URL(window.location);
        const wasImmediateOverviewPush = Boolean(
          window._lastLessonsOverviewPushTs &&
            Date.now() - window._lastLessonsOverviewPushTs < 220 &&
            !url.searchParams.has('lesson'),
        );
        window._lastLessonsOverviewPushTs = 0;

        const isSafeguardLocked =
          url.searchParams.get('locked') === 'true' ||
          url.searchParams.get('mode') === 'pupil' ||
          url.searchParams.get('safeguard') === 'true';
        const cleanLessonPath = !isSafeguardLocked
          ? buildCleanLessonPath(unitId, sub, index, lessonsList)
          : null;

        if (cleanLessonPath) {
          url.pathname = cleanLessonPath;
          ['view', 'unit', 'lesson', 'stage', 'portal', 'q'].forEach((k) =>
            url.searchParams.delete(k),
          );
        } else {
          url.pathname = '/';
          url.searchParams.set('view', 'lessons');
          url.searchParams.set('unit', unitId);
          url.searchParams.delete('stage');
          url.searchParams.delete('q');
          if (!isSafeguardLocked) {
            url.searchParams.delete('portal');
          }
          const hasLessonZero =
            lessonsList[0] &&
            (lessonsList[0].id === 'lesson_0' ||
              (lessonsList[0].title && lessonsList[0].title.includes('KT 1.0')));
          const lessonQueryVal =
            sub.slug || (hasLessonZero ? (index === 0 ? '0' : index) : index + 1);
          url.searchParams.set('lesson', lessonQueryVal);
        }

        if (wasImmediateOverviewPush) {
          window.history.replaceState(
            {
              hhNav: true,
              view: 'lessons',
              unit: unitId,
              unitId: unitId,
              lessonIndex: index,
              opts: { lessonIndex: index },
              scrollY: 0,
            },
            '',
            url,
          );
        } else {
          window.history.replaceState(
            {
              ...currentState,
              scrollY: currentScroll,
            },
            '',
            window.location.href,
          );
          window.history.pushState(
            {
              hhNav: true,
              view: 'lessons',
              unit: unitId,
              unitId: unitId,
              lessonIndex: index,
              opts: { lessonIndex: index },
              scrollY: 0,
            },
            '',
            url,
          );
        }
      } catch (err) {}
    }

    if (typeof window.updateHeaderBackBtn === 'function') {
      window.updateHeaderBackBtn('lessons');
    }

    try {
      if (unitId && typeof index === 'number' && index >= 0) {
        localStorage.setItem(`hh_last_lesson_${unitId}`, String(index));
        recordLastVisitedLesson({
          unitId,
          unitTitle: data.title || '',
          lessonIndex: index,
          lessonId: sub.id || '',
          lessonTitle: sub.title || '',
        });
      }
    } catch (e) {}

    // Update document.title so copied/shared browser links display the exact lesson & unit name
    if (typeof document !== 'undefined') {
      const cleanUnitName = data.title
        ? data.title.replace(/^(?:Paper \d+:?|KS3:?|GCSE[^:]*:?)\s*/i, '').trim()
        : 'The History Revision Hub';
      const cleanLessonTitle = (sub.title || `Lesson ${index + 1}`).trim();
      document.title = `${cleanLessonTitle} — ${cleanUnitName}`;
    }

    // Update breadcrumbs to show Dashboard > Unit > Lesson Title
    if (typeof window.updateBreadcrumbs === 'function') {
      const hasLessonZero = (lessonsList[0] && (lessonsList[0].id === 'lesson_0' || (lessonsList[0].title && lessonsList[0].title.includes('KT 1.0'))));
      const rawTitle = sub.title || (hasLessonZero && index === 0 ? 'Intro Lesson' : `Lesson ${hasLessonZero ? index : index + 1}`);
      let shortLabel = rawTitle;
      const matchPrefix = rawTitle.match(/^(Enquiry\s+\d+|Lesson\s+\d+|Stage\s+\d+|KT\s*\d+\.\d+)/i);
      if (matchPrefix) {
        if (hasLessonZero && index === 0) {
          shortLabel = `${matchPrefix[1]} • Intro`;
        } else if (hasLessonZero) {
          shortLabel = `${matchPrefix[1]} • L${index}`;
        } else {
          shortLabel = matchPrefix[1];
        }
      } else if (rawTitle.length > 25) {
        shortLabel = hasLessonZero && index === 0 ? 'Intro Lesson' : `Lesson ${hasLessonZero ? index : index + 1}`;
      }
      let unitTitle =
        data.shortTitle ||
        (data.title
          ? data.title.replace(/^(?:Paper \d+:?|KS3:?|KS2:?|GCSE[^:]*:?)\s*/i, '').trim()
          : 'Unit');
      if (unitId === 'ks2_stone_to_iron_age') unitTitle = 'Stone Age to Iron Age';
      if (unitId === 'ks2_romans') unitTitle = 'The Romans in Britain';
      if (unitId === 'ks2_anglo_saxons_vikings') unitTitle = 'Anglo-Saxons & Vikings';
      if (unitId === 'ks2_ww2') unitTitle = 'Britain at War (WWII)';
      if (unitId === 'ks2_ancient_egypt') unitTitle = 'Ancient Egypt';
      if (unitId === 'ks2_ancient_greece') unitTitle = 'Ancient Greece';
      if (unitId === 'ks2_early_islamic_baghdad') unitTitle = 'Baghdad c. AD 900';
      if (unitId === 'ks2_maya_civilisation') unitTitle = 'The Ancient Maya';
      window.updateBreadcrumbs([
        { label: 'Dashboard', view: 'dashboard' },
        {
          label: unitTitle,
          view: 'lessons',
          unit: unitId,
        },
        { label: shortLabel, tooltip: rawTitle },
      ]);
    }

    // Inject the content-area wrapper if it doesn't exist, since the legacy renderer expects it!
    container.innerHTML = `
      <div id="content-area" style="animation: fadeInUp 0.3s ease-out; background-color: var(--bg-app); min-height: 100vh;">
      </div>
    `;

    // Call the legacy Netlify app's beautifully formatted lesson renderer!
    renderLesson(sub);

    // Attach draft preservation to student response boxes in this lesson
    if (typeof window.initDraftPreservation === 'function') {
      window.initDraftPreservation(
        document.getElementById('content-area'),
        `${unitId}_${sub.id || index}`,
      );
    }

    // Check if a target keyword was requested from search
    try {
      const pendingKeyword = sessionStorage.getItem('hh_highlight_keyword');
      if (pendingKeyword && typeof window.highlightTargetKeywordInLesson === 'function') {
        sessionStorage.removeItem('hh_highlight_keyword');
        window.highlightTargetKeywordInLesson(pendingKeyword);
      }
    } catch (e) {}

    // Check if a target narrative block jump was requested (one-shot; lesson_renderer also handles initial ?stage= cleanly)
    let hasNarrativeJump = false;
    try {
      const pendingJump = sessionStorage.getItem('hh_pending_narrative_jump');
      if (pendingJump) {
        sessionStorage.removeItem('hh_pending_narrative_jump');
        const parsedJump = JSON.parse(pendingJump);
        if (parsedJump && parsedJump.stageNum) {
          hasNarrativeJump = true;
          let attempts = 0;
          const pollJump = () => {
            attempts++;
            const ok = typeof window.jumpToNarrativeBlock === 'function' && window.jumpToNarrativeBlock(parsedJump.stageNum);
            if (!ok && attempts < 12) {
              setTimeout(pollJump, 100);
            }
          };
          setTimeout(pollJump, 120);
        }
      } else {
        const cleanUrl = new URL(window.location.href);
        const stageParam = cleanUrl.searchParams.get('stage');
        if (stageParam) {
          const parsedStage = parseInt(stageParam, 10);
          cleanUrl.searchParams.delete('stage');
          try {
            window.history.replaceState(window.history.state || {}, '', cleanUrl);
          } catch (err) {}
          if (!isNaN(parsedStage)) {
            hasNarrativeJump = true;
            let attempts = 0;
            const pollJump = () => {
              attempts++;
              const ok = typeof window.jumpToNarrativeBlock === 'function' && window.jumpToNarrativeBlock(parsedStage);
              if (!ok && attempts < 12) {
                setTimeout(pollJump, 100);
              }
            };
            setTimeout(pollJump, 120);
          }
        }
      }
    } catch (e) {}

    if (targetStopId) {
      setTimeout(() => {
        if (window.jumpToStop) window.jumpToStop(targetStopId);
      }, 180);
    } else if (!hasNarrativeJump) {
      if (window.scrollToTop) window.scrollToTop(true);
      else window.scrollTo(0, 0);
    }
  };

  const floatingBtn = document.getElementById('floating-stop-navigator-btn');
  if (floatingBtn) floatingBtn.remove();

  // Check if a specific lesson was requested via URL query params (e.g. from QR code ?lesson=1)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedLesson = urlParams.get('lesson');
  if (requestedLesson !== null && requestedLesson !== undefined && requestedLesson !== '') {
    let targetIndex = -1;
    const hasLessonZero = (lessonsList[0] && (lessonsList[0].id === 'lesson_0' || (lessonsList[0].title && lessonsList[0].title.includes('KT 1.0'))));
    const parsed = parseInt(requestedLesson, 10);
    if (!isNaN(parsed) && String(parsed) === requestedLesson.trim()) {
      if (hasLessonZero) {
        targetIndex = parsed >= 0 && parsed < lessonsList.length ? parsed : -1;
      } else {
        targetIndex = parsed >= 1 ? parsed - 1 : parsed;
      }
    } else if (requestedLesson.toLowerCase() === 'intro' && hasLessonZero) {
      targetIndex = 0;
    } else {
      const reqLower = requestedLesson.toLowerCase();
      targetIndex = lessonsList.findIndex(
        (l) =>
          (l.id && l.id.toLowerCase() === reqLower) ||
          (l.slug && l.slug.toLowerCase() === reqLower) ||
          (l.alias_ids && l.alias_ids.some((a) => String(a).toLowerCase() === reqLower)) ||
          (l.title && l.title.toLowerCase().includes(reqLower)),
      );
    }
    // Backward-compatibility alias: Water & Sanitation Summative Assessment was previously Lesson 7
    if (
      (unitId === 'water_and_sanitation' || window.currentUnitId === 'water_and_sanitation') &&
      (parsed === 7 ||
        requestedLesson === 'lesson_7' ||
        requestedLesson === '7' ||
        targetIndex >= lessonsList.length)
    ) {
      targetIndex = lessonsList.length - 1; // Seamlessly routes to Summative Assessment Masterclass (Lesson 6)
    }
    if (targetIndex >= 0 && targetIndex < lessonsList.length) {
      window.viewLessonDetail(targetIndex, null, true);
      return;
    }
  }

  // Ensure Unit Overview always restores sidebar & header if returning from a Full-Width lesson
  if (typeof document !== 'undefined' && document.body && document.body.classList.contains('lesson-full-width')) {
    document.body.classList.remove('lesson-full-width');
    try {
      sessionStorage.removeItem('hh_lesson_full_width');
    } catch (e) {}
  }

  // Rendering Unit Overview (not inside a lesson)
  window.currentLessonIndex = null;
  window.currentView = 'lessons';
  if (state) state.activeLessonIndex = null;
  if (typeof window.highlightActiveSidebarLesson === 'function') {
    window.highlightActiveSidebarLesson(null);
  }
  if (typeof window.updateHeaderBackBtn === 'function') {
    window.updateHeaderBackBtn('lessons');
  }

  let heroImageUrl = '';
  if (
    data.cover_image &&
    typeof data.cover_image === 'string' &&
    !data.cover_image.includes('placeholder_cover')
  ) {
    heroImageUrl = getAssetUrl(data.cover_image);
  } else if (
    Array.isArray(data.cover_image) &&
    data.cover_image.length > 0 &&
    !data.cover_image[0].includes('placeholder_cover')
  ) {
    heroImageUrl = getAssetUrl(data.cover_image[0]);
  } else if (data.homepage_background) {
    heroImageUrl = getAssetUrl(data.homepage_background);
  } else if (data.cover_sources && data.cover_sources.length > 0) {
    heroImageUrl = getAssetUrl(data.cover_sources[0].image);
  }

  const launchpadHTML = renderHeroCurricularLaunchpad(unitId, data);
  let headerHtml = '';
  if (heroImageUrl) {
    const positionFallbacks = {
      ks2_ww2: 'center center',
      monarchy_religion_power: 'center 12%',
      first_british_empire: 'center 35%',
      eee: 'center 10%',
      edexcel_medicine: 'center 32%',
      cme_new: 'center 20%',
      great_war_part2: 'center 18%',
      australia: 'center 70%',
      weimar_nazi_germany: 'center 20%',
      usa: 'center 25%',
    };
    const heroBgPos =
      data.cover_image_position ||
      positionFallbacks[unitId] ||
      positionFallbacks[data.id] ||
      'center';
    const heroOverlayGradient =
      unitId === 'ks2_ww2'
        ? 'linear-gradient(rgba(15, 23, 42, 0.42), rgba(15, 23, 42, 0.74))'
        : 'linear-gradient(rgba(15, 23, 42, 0.62), rgba(15, 23, 42, 0.84))';
    headerHtml = `
      <div style="position: relative; text-align: center; padding: 30px 24px 24px 24px; background-image: url('${heroImageUrl}'); background-size: cover; background-position: ${heroBgPos}; border-radius: 0;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${heroOverlayGradient};"></div>
        <div style="position: relative; z-index: 1; max-width: 1120px; margin: 0 auto;">
          <h1 class="enquiry-title" style="font-family: 'Playfair Display', serif; font-size: clamp(1.45rem, 4vw, 2.25rem); line-height: 1.22; color: white; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); hyphens: none; -webkit-hyphens: none; word-break: normal; overflow-wrap: normal; text-wrap: balance;">${data.enquiry_question || data.enquiry || 'Unit Enquiry'}</h1>
          <h2 style="font-size: clamp(0.96rem, 2.5vw, 1.15rem); color: #cbd5e1; font-weight: 500; margin-top: 0; margin-bottom: 0; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
            ${data.title}
          </h2>
          ${launchpadHTML}
          ${data.cover_caption ? `<p style="margin-top: 10px; margin-bottom: 0; font-style: italic; color: #94a3b8; font-size: 0.84rem; text-align: center; max-width: 800px; margin-left: auto; margin-right: auto;">${data.cover_caption}</p>` : ''}
        </div>
      </div>
      ${renderCoverSourcesHTML(data, true) ? `<div style="padding: 16px 26px 0 26px; background: white;">${renderCoverSourcesHTML(data, true)}</div>` : ''}
    `;
  } else {
    headerHtml = `
      <div style="text-align: center; padding: 26px 24px 16px 24px; background: white; max-width: 900px; margin: 0 auto;">
        <h1 class="enquiry-title" style="font-family: 'Playfair Display', serif; font-size: clamp(1.45rem, 4vw, 2.25rem); line-height: 1.22; color: #1a237e; margin-bottom: 8px; hyphens: none; -webkit-hyphens: none; word-break: normal; overflow-wrap: normal; text-wrap: balance;">${data.enquiry_question || data.enquiry || 'Unit Enquiry'}</h1>
        <h2 style="font-size: clamp(0.96rem, 2.5vw, 1.15rem); color: #475569; font-weight: 500; margin-top: 0; margin-bottom: 12px;">
          ${data.title}
        </h2>
        ${launchpadHTML}
        ${renderCoverSourcesHTML(data)}
        ${data.cover_caption ? `<p style="margin-top: 5px; margin-bottom: 0; font-style: italic; color: #64748b; font-size: 0.84rem; text-align: center; max-width: 800px; margin-left: auto; margin-right: auto;">${data.cover_caption}</p>` : ''}
      </div>
    `;
  }

  const stickyResourceBarHTML = renderStickyUnitResourceBar(unitId, data);

  container.innerHTML = `
    <div class="card" style="animation: fadeInUp 0.3s ease-out; padding: 0; overflow: visible; background: white;">
      ${headerHtml}
      ${stickyResourceBarHTML}
      <div class="lessons-view-body" style="padding: 24px 28px 34px 28px; border-top: 1px solid #e2e8f0; max-width: 100%; box-sizing: border-box;">
        ${renderUnitSynopsis(data, unitId)}
        ${renderKeyTopicLessonsHTML(data, unitId, data)}
      </div>
    </div>
  `;
}

export async function renderBookletView() {
  const contentArea = document.getElementById('main-content');
  if (!contentArea) return;
  contentArea.innerHTML = '';

  const { renderWorkbooksZone } = await import('./workbooks_zone.js');
  renderWorkbooksZone(contentArea, state.activeUnitData);

  if (window.scrollToTop) window.scrollToTop(true);
  else contentArea.scrollTo({ top: 0, behavior: 'smooth' });
}

function playExamPacingChime(frequency = 659.25, duration = 1.0) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio chime unavailable:', e);
  }
}

function playDoubleChime() {
  playExamPacingChime(659.25, 0.7); // E5
  setTimeout(() => {
    playExamPacingChime(880, 1.2); // A5
  }, 300);
}

window.hubExamTimerState = window.hubExamTimerState || {
  interval: null,
  totalSeconds: 4800,
  initialSeconds: 4800,
  isRunning: false,
  soundEnabled: true,
};

window.toggleHubExamClock = function (action, defaultMinutes = 80) {
  const state = window.hubExamTimerState;
  const display = document.getElementById('hub-exam-clock-display');
  const startBtn = document.getElementById('hub-exam-clock-start');
  const pauseBtn = document.getElementById('hub-exam-clock-pause');
  const soundBtn = document.getElementById('hub-exam-clock-sound');
  const alertBanner = document.getElementById('hub-exam-clock-pacing-alert');

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const updateDisplay = () => {
    if (display) {
      display.textContent = formatTime(state.totalSeconds);
      if (state.totalSeconds === 0) {
        display.style.color = '#f87171';
        display.textContent = "00:00 (TIME'S UP)";
      } else if (state.totalSeconds <= 300) {
        display.style.color = '#facc15';
      } else {
        display.style.color = '#ffffff';
      }
    }
  };

  if (action === 'start') {
    if (state.isRunning) return;
    if (state.totalSeconds === 0) {
      state.totalSeconds = state.initialSeconds || defaultMinutes * 60;
    }
    state.isRunning = true;
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-flex';

    if (state.interval) clearInterval(state.interval);
    state.interval = setInterval(() => {
      if (state.totalSeconds > 0) {
        state.totalSeconds--;
        updateDisplay();

        // Section A milestone check
        if (
          state.initialSeconds === 4800 &&
          (state.totalSeconds === 3300 || state.totalSeconds === 3000)
        ) {
          if (state.soundEnabled) playDoubleChime();
          if (alertBanner) {
            const secInfo =
              state.totalSeconds === 3300
                ? 'Section A (Western Front) complete &bull; 55m remaining for Section B (Thematic Study)'
                : 'Section A complete &bull; 50m remaining for Section B';
            alertBanner.innerHTML = `
              <div style="background: #000000; color: #ffffff; padding: 10px 18px; border-radius: 4px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 2px solid #ffffff;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: #ffffff; color: #000000; padding: 2px 6px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase;">PACING NOTICE</span>
                  <span><strong>SECTION TRANSITION:</strong> ${secInfo}</span>
                </div>
                <button type="button" onclick="this.parentElement.parentElement.style.display='none'" style="background: #374151; border: 1px solid #9ca3af; color: white; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 0.8rem; font-weight: 700;">Dismiss</button>
              </div>
            `;
            alertBanner.style.display = 'block';
          }
        } else if (state.initialSeconds === 5400 && state.totalSeconds === 3600) {
          if (state.soundEnabled) playDoubleChime();
          if (alertBanner) {
            alertBanner.innerHTML = `
              <div style="background: #000000; color: #ffffff; padding: 10px 18px; border-radius: 4px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 2px solid #ffffff;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: #ffffff; color: #000000; padding: 2px 6px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase;">PACING NOTICE</span>
                  <span><strong>SECTION TRANSITION:</strong> Section A complete &bull; 60m remaining for Section B (Source Enquiry &amp; Interpretations)</span>
                </div>
                <button type="button" onclick="this.parentElement.parentElement.style.display='none'" style="background: #374151; border: 1px solid #9ca3af; color: white; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 0.8rem; font-weight: 700;">Dismiss</button>
              </div>
            `;
            alertBanner.style.display = 'block';
          }
        }

        // 5-Minute warning check
        if (state.totalSeconds === 300) {
          if (state.soundEnabled) playDoubleChime();
          if (alertBanner) {
            alertBanner.innerHTML = `
              <div style="background: #000000; color: #ffffff; padding: 10px 18px; border-radius: 4px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 2px solid #facc15;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: #facc15; color: #000000; padding: 2px 6px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase;">WARNING</span>
                  <span><strong>5 MINUTES REMAINING:</strong> Conclude final evaluations, verify sustained criteria judgements, and check SPaG.</span>
                </div>
                <button type="button" onclick="this.parentElement.parentElement.style.display='none'" style="background: #374151; border: 1px solid #9ca3af; color: white; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 0.8rem; font-weight: 700;">Dismiss</button>
              </div>
            `;
            alertBanner.style.display = 'block';
          }
        }

        // Time's Up
        if (state.totalSeconds === 0) {
          if (state.soundEnabled) playDoubleChime();
          clearInterval(state.interval);
          state.interval = null;
          state.isRunning = false;
          if (alertBanner) {
            alertBanner.innerHTML = `
              <div style="background: #000000; color: #ffffff; padding: 12px 18px; border-radius: 4px; font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; border: 2px solid #ef4444;">
                <span style="background: #ef4444; color: #ffffff; padding: 3px 8px; font-weight: 900; font-size: 0.78rem; text-transform: uppercase;">EXAM CONCLUDED</span>
                <span>TIME IS UP: All pens down. Examination concluded.</span>
              </div>
            `;
            alertBanner.style.display = 'block';
          }
          if (startBtn) {
            startBtn.style.display = 'inline-flex';
            startBtn.textContent = 'Restart Clock';
          }
          if (pauseBtn) pauseBtn.style.display = 'none';
        }
      }
    }, 1000);
  } else if (action === 'pause') {
    if (!state.isRunning) return;
    clearInterval(state.interval);
    state.interval = null;
    state.isRunning = false;
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.textContent = 'Resume Clock';
    }
    if (pauseBtn) pauseBtn.style.display = 'none';
  } else if (action === 'reset') {
    if (state.interval) clearInterval(state.interval);
    state.interval = null;
    state.isRunning = false;
    state.totalSeconds = defaultMinutes * 60;
    state.initialSeconds = defaultMinutes * 60;
    updateDisplay();
    if (alertBanner) alertBanner.style.display = 'none';
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.textContent = 'Start Clock';
    }
    if (pauseBtn) pauseBtn.style.display = 'none';
  } else if (action === 'add5') {
    state.totalSeconds += 300;
    updateDisplay();
  } else if (action === 'add20') {
    state.totalSeconds += 1200;
    updateDisplay();
  } else if (action === 'toggleSound') {
    state.soundEnabled = !state.soundEnabled;
    if (soundBtn) {
      soundBtn.textContent = state.soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off';
    }
  }
};

window.toggleHubTimingStrategy = function () {
  const drawer = document.getElementById('hub-timing-strategy-drawer');
  const arrow = document.getElementById('hub-strategy-arrow');
  if (!drawer) return;
  const isHidden = drawer.style.display === 'none' || drawer.style.display === '';
  drawer.style.display = isHidden ? 'block' : 'none';
  if (arrow) {
    arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
};

window.setHubExamClockMinutes = function (mins, label) {
  mins = parseInt(mins, 10);
  if (isNaN(mins) || mins <= 0) return;
  const state = window.hubExamTimerState;
  if (state.interval) {
    clearInterval(state.interval);
    state.interval = null;
    state.isRunning = false;
  }
  state.totalSeconds = mins * 60;
  state.initialSeconds = state.totalSeconds;

  const display = document.getElementById('hub-exam-clock-display');
  const startBtn = document.getElementById('hub-exam-clock-start');
  const pauseBtn = document.getElementById('hub-exam-clock-pause');
  if (display) {
    const m = Math.floor(state.totalSeconds / 60);
    const s = state.totalSeconds % 60;
    display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    display.style.color = '#38bdf8';
  }
  if (startBtn) {
    startBtn.style.display = 'none';
  }
  if (pauseBtn) {
    pauseBtn.style.display = 'inline-flex';
  }
  window.toggleHubExamClock('start', mins);
};

function getHubTimingStrategyRows(unitId) {
  let rows = [];
  if (unitId === 'cme_new' || unitId === 'gcse_cold_war' || unitId === 'cold_war') {
    rows = [
      {
        tariff: '4 Marks (×2)',
        type: 'Explain one consequence of... (Q1a & Q1b)',
        totalTime: '6 mins each (12m total)',
        planSplit: '<strong>1 min</strong> identify 1 direct consequence + context',
        writeSplit:
          '<strong>5 mins</strong> single sustained analytical paragraph with precise factual detail',
        actionMins: 6,
        actionLabel: '4-Mark Consequence (6m)',
      },
      {
        tariff: '8 Marks',
        type: 'Write a narrative account analysing... (Q2)',
        totalTime: '15 mins',
        planSplit:
          '<strong>2 mins</strong> outline 3-phase chronological flow (start &rarr; dev &rarr; outcome)',
        writeSplit:
          '<strong>13 mins</strong> 3 linked analytical paragraphs showing causation and change',
        actionMins: 15,
        actionLabel: '8-Mark Narrative (15m)',
      },
      {
        tariff: '8 Marks',
        type: 'Explain the importance of [Choice 1] for... (Q3 Option 1)',
        totalTime: '14 mins',
        planSplit: '<strong>2 mins</strong> define criteria + 2 distinct impacts/consequences',
        writeSplit:
          '<strong>12 mins</strong> 2 structured analytical paragraphs evaluating significance',
        actionMins: 14,
        actionLabel: '8-Mark Importance Choice 1 (14m)',
      },
      {
        tariff: '8 Marks',
        type: 'Explain the importance of [Choice 2] for... (Q3 Option 2)',
        totalTime: '14 mins',
        planSplit: '<strong>2 mins</strong> define criteria + 2 distinct impacts/consequences',
        writeSplit:
          '<strong>12 mins</strong> 2 structured analytical paragraphs evaluating significance',
        actionMins: 14,
        actionLabel: '8-Mark Importance Choice 2 (14m)',
      },
    ];
  } else if (unitId === 'eee') {
    rows = [
      {
        tariff: '2 Marks (×2)',
        type: 'Describe one feature of... (Q1a & Q1b)',
        totalTime: '3 mins each (6m total)',
        planSplit: '<strong>30s</strong> target feature recall',
        writeSplit:
          '<strong>2.5m</strong> 2 precise sentences (feature identification + supporting detail)',
        actionMins: 3,
        actionLabel: '2-Mark Feature (3m)',
      },
      {
        tariff: '12 Marks',
        type: 'Explain why... (Causation / Analytical Account - Q2)',
        totalTime: '19 mins',
        planSplit: '<strong>3 mins</strong> select 3 distinct causes (2 stimulus + 1 own point)',
        writeSplit: '<strong>16 mins</strong> 3 PEEL paragraphs with sustained causal links',
        actionMins: 19,
        actionLabel: '12-Mark Causation (19m)',
      },
      {
        tariff: '16 Marks',
        type: 'Statement Evaluation Essay ("How far do you agree?" - Q3 or Q4)',
        totalTime: '30 mins',
        planSplit: '<strong>5 mins</strong> define criteria + balance arguments + reach judgement',
        writeSplit:
          '<strong>25 mins</strong> Intro + Agree argument + Counter argument + Justified Judgement',
        actionMins: 30,
        actionLabel: '16-Mark Essay (30m)',
      },
    ];
  } else if (unitId === 'edexcel_medicine') {
    rows = [
      {
        tariff: '2 Marks (×2)',
        type: 'Describe one feature of... (Sec A: Western Front - Q1a & Q1b)',
        totalTime: '2.5 mins each (5m total)',
        planSplit: '<strong>30s</strong> target feature recall',
        writeSplit:
          '<strong>2 mins</strong> 2 precise sentences (feature + clinical/contextual detail)',
        actionMins: 5,
        actionLabel: '4-Mark Feature (5m)',
      },
      {
        tariff: '8 Marks',
        type: 'How useful are Sources A and B for an enquiry into... (Sec A: Q2a)',
        totalTime: '14 mins',
        planSplit: '<strong>2 mins</strong> annotate provenance (NOP) + own knowledge context',
        writeSplit:
          '<strong>12 mins</strong> 2 balanced paragraphs evaluating utility on content and NOP',
        actionMins: 14,
        actionLabel: '8-Mark Utility (14m)',
      },
      {
        tariff: '4 Marks',
        type: 'How could you follow up Source B... (Sec A: Q2b Table)',
        totalTime: '6 mins',
        planSplit: '<strong>1 min</strong> select specific detail from Source B to investigate',
        writeSplit:
          '<strong>5 mins</strong> complete 4-part enquiry table: detail, question, source, purpose',
        actionMins: 6,
        actionLabel: '4-Mark Follow-up (6m)',
      },
      {
        tariff: '4 Marks',
        type: 'Explain one similarity or difference between two eras (Sec B: Q3)',
        totalTime: '6 mins',
        planSplit:
          '<strong>1 min</strong> identify precise historical criteria across both periods',
        writeSplit:
          '<strong>5 mins</strong> single sustained comparative paragraph with cross-era evidence',
        actionMins: 6,
        actionLabel: '4-Mark Comparison (6m)',
      },
      {
        tariff: '12 Marks',
        type: 'Explain why... (Causation / Analytical Account - Sec B: Q4)',
        totalTime: '18 mins',
        planSplit: '<strong>3 mins</strong> select 3 distinct factors (2 stimulus + 1 own point)',
        writeSplit:
          '<strong>15 mins</strong> 3 PEEL paragraphs with causal links and impact analysis',
        actionMins: 18,
        actionLabel: '12-Mark Causation (18m)',
      },
      {
        tariff: '16+4 Marks',
        type: 'Statement Evaluation Essay ("How far do you agree?" - Sec B: Q5 or Q6)',
        totalTime: '31 mins',
        planSplit: '<strong>5 mins</strong> define criteria + balance both sides + plan judgement',
        writeSplit:
          '<strong>26 mins</strong> Intro + Agree + Counter + Justified Judgement + SPaG check',
        actionMins: 31,
        actionLabel: '16+4 Mark Essay (31m)',
      },
    ];
  } else {
    // Paper 3 Modern Depth Study: USA 1954-75 & Weimar and Nazi Germany (90 Mins Total - Summer 2025+ Spec)
    rows = [
      {
        tariff: '4 Marks',
        type: 'Give two things you can infer from Source A... (Sec A: Q1)',
        totalTime: '6 mins',
        planSplit: '<strong>1 min</strong> identify quotes and details in Source A',
        writeSplit: '<strong>5 mins</strong> 2 separate inference + evidence pairs (2× 2 marks)',
        actionMins: 6,
        actionLabel: '4-Mark Inference (6m)',
      },
      {
        tariff: '12 Marks',
        type: 'Explain why... (Causation / Analytical Account - Sec A: Q2)',
        totalTime: '24 mins',
        planSplit: '<strong>4 mins</strong> select 3 distinct causes (2 stimulus + 1 own point)',
        writeSplit: '<strong>20 mins</strong> 3 sustained PEEL paragraphs with causal links',
        actionMins: 24,
        actionLabel: '12-Mark Causation (24m)',
      },
      {
        tariff: '8 Marks',
        type: 'How useful are Sources B and C for an enquiry into... (Sec B: Q3a)',
        totalTime: '14 mins',
        planSplit: '<strong>2 mins</strong> annotate provenance (NOP) + own knowledge context',
        writeSplit:
          '<strong>12 mins</strong> 2 balanced paragraphs evaluating utility on content and NOP',
        actionMins: 14,
        actionLabel: '8-Mark Utility (14m)',
      },
      {
        tariff: '4 Marks',
        type: 'What is the main difference between Interpretations 1 and 2? (Sec B: Q3b)',
        totalTime: '6 mins',
        planSplit:
          '<strong>1 min</strong> compare historical perspectives in Interpretations 1 & 2',
        writeSplit:
          '<strong>5 mins</strong> identify primary divergence supported by direct quotations',
        actionMins: 6,
        actionLabel: '4-Mark Difference (6m)',
      },
      {
        tariff: '4 Marks',
        type: 'Suggest one reason why Interpretations 1 and 2 give different views (Sec B: Q3c)',
        totalTime: '6 mins',
        planSplit: '<strong>1 min</strong> match with Sources B/C or author focus/emphasis',
        writeSplit:
          '<strong>5 mins</strong> explain reason for divergence (different sources/motives)',
        actionMins: 6,
        actionLabel: '4-Mark Reason (6m)',
      },
      {
        tariff: '16+4 Marks',
        type: 'How far do you agree with Interpretation 2... (Sec B: Q3d)',
        totalTime: '34 mins',
        planSplit:
          '<strong>6 mins</strong> define criteria + balance views against Interpretation 1',
        writeSplit:
          '<strong>28 mins</strong> Intro + evaluate Int 2 + evaluate Int 1/context + Judgement + SPaG',
        actionMins: 34,
        actionLabel: '16+4 Mark Essay (34m)',
      },
    ];
  }

  return rows
    .map((row, idx) => {
      const isLast = idx === rows.length - 1;
      const borderStyle = isLast ? '' : 'border-bottom: 1px solid #1f2937;';
      return `<tr style="${borderStyle}">
        <td style="padding: 8px 12px; font-weight: 800; color: #38bdf8;">${row.tariff}</td>
        <td style="padding: 8px 12px; color: #e5e7eb;">${row.type}</td>
        <td style="padding: 8px 12px; font-weight: 700; color: #facc15;">${row.totalTime}</td>
        <td style="padding: 8px 12px; color: #9ca3af;">${row.planSplit}</td>
        <td style="padding: 8px 12px; color: #d1d5db;">${row.writeSplit}</td>
        <td style="padding: 8px 12px; text-align: right;">
          <button type="button" onclick="window.setHubExamClockMinutes(${row.actionMins}, '${row.actionLabel}')" style="background: #111827; color: #38bdf8; border: 1px solid #0284c7; padding: 4px 8px; border-radius: 3px; font-weight: 700; font-size: 0.72rem; cursor: pointer;">⏱ Time (${row.actionMins}m)</button>
        </td>
      </tr>`;
    })
    .join('\n');
}

const PEARSON_PORTAL_UNITS = {
  edexcel_medicine: {
    paperCode: '1HI0/11',
    paperName: 'Paper 1: Medicine in Britain, c1250–present & Western Front, 1914–18',
    searchHint: 'Select Paper 1 Option 11 (1HI0/11) for Question Papers, Mark Schemes, and Examiner Reports.',
  },
  eee: {
    paperCode: '1HI0/B4',
    paperName: 'Paper 2 (Booklet B): Early Elizabethan England, 1558–88',
    searchHint: 'Select Paper 2 Booklet B4 (1HI0/B4) for Question Papers, Mark Schemes, and Examiner Reports.',
  },
  cme_new: {
    paperCode: '1HI0/P5',
    paperName: 'Paper 2 (Booklet P): Conflict in the Middle East, 1945–95',
    searchHint: 'Select Paper 2 Booklet P5 (1HI0/P5) for Question Papers, Mark Schemes, and Examiner Reports.',
  },
  gcse_cold_war: {
    paperCode: '1HI0/P4',
    paperName: 'Paper 2 (Booklet P): Superpower Relations and the Cold War, 1941–91',
    searchHint: 'Select Paper 2 Booklet P4 (1HI0/P4) for Question Papers, Mark Schemes, and Examiner Reports.',
  },
  weimar_nazi_germany: {
    paperCode: '1HI0/31',
    paperName: 'Paper 3: Weimar and Nazi Germany, 1918–39',
    searchHint: 'Select Paper 3 Option 31 (1HI0/31) for Question Papers, Sources Booklets, Mark Schemes, and Examiner Reports.',
  },
  usa: {
    paperCode: '1HI0/33',
    paperName: 'Paper 3: The USA, 1954–75: Conflict at Home and Abroad',
    searchHint: 'Select Paper 3 Option 33 (1HI0/33) for Question Papers, Sources Booklets, Mark Schemes, and Examiner Reports.',
  },
};

function renderOfficialPastPapers(container, unitId) {
  const portalMeta = PEARSON_PORTAL_UNITS[unitId];
  const pastPapersPortalUrl =
    'https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html';
  const historyMaterialsUrl =
    'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/history-2016.coursematerials.html';

  if (!portalMeta) {
    container.innerHTML = `
      <div style="background: #ffffff; border: 2px solid #000000; border-radius: 4px; padding: 40px 30px; text-align: center; margin: 20px 0;">
        <div style="font-size: 2.2rem; margin-bottom: 10px;">📦</div>
        <h3 style="margin: 0 0 8px 0; font-family: 'Outfit', sans-serif; font-size: 1.3rem;">External Past Papers Portal</h3>
        <p style="color: #4b5563; font-size: 0.92rem; max-width: 650px; margin: 0 auto 18px auto; line-height: 1.5;">
          GCSE past examination series are published externally on Pearson Qualifications for Key Stage 4 units. For KS3 units, use The History Revision Hub's Pupil Workbooks, Master Textbooks, and Retrieval Companions.
        </p>
        <a href="${pastPapersPortalUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; background: #000000; color: #ffffff; border: 2px solid #000000; padding: 10px 18px; border-radius: 4px; font-size: 0.85rem; font-weight: 800; display: inline-flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Pearson Past Papers Portal
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="background: #ffffff; border: 2px solid #000000; border-radius: 4px; padding: 26px 28px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; border-bottom: 2px solid #000000; padding-bottom: 16px; margin-bottom: 18px;">
        <div>
          <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #000000;">
            External Awarding-Body Portal &bull; ${portalMeta.paperCode}
          </div>
          <h2 style="margin: 4px 0 6px 0; font-size: 1.45rem; font-weight: 900; font-family: 'Outfit', sans-serif; color: #000000;">
            Pearson Qualifications Public Past Papers Portal
          </h2>
          <p style="margin: 0; font-size: 0.9rem; color: #374151; max-width: 820px; line-height: 1.5;">
            In compliance with copyright law and JCQ secure-series regulations, Pearson Edexcel question papers, mark schemes, and examiner reports are hosted directly by Pearson Qualifications rather than redistributed on third-party websites.
          </p>
        </div>
        <div>
          <span style="display: inline-block; background: #000000; color: #ffffff; padding: 6px 14px; border-radius: 3px; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.5px;">
            CODE: ${portalMeta.paperCode}
          </span>
        </div>
      </div>

      <div style="background: #f8fafc; border: 1.5px solid #000000; border-radius: 4px; padding: 18px 20px; margin-bottom: 20px;">
        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin-bottom: 8px;">
          Quick Filter Steps on qualifications.pearson.com:
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; font-size: 0.85rem; color: #1f2937;">
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 10px 12px;">
            <strong>1. Qualification:</strong> GCSE (9–1) History (2016)
          </div>
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 10px 12px;">
            <strong>2. Paper Code:</strong> <code style="font-weight: 800;">${portalMeta.paperCode}</code>
          </div>
          <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 10px 12px;">
            <strong>3. Unit:</strong> ${portalMeta.paperName}
          </div>
        </div>
        <div style="font-size: 0.82rem; color: #475569; margin-top: 10px;">
          <i class="fa-solid fa-circle-info"></i> ${portalMeta.searchHint} Recent secure series remain Edexcel Online (EOL) padlocked for registered examination centres in accordance with JCQ rules.
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
        <a href="${pastPapersPortalUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; background: #000000; color: #ffffff; border: 2px solid #000000; padding: 11px 18px; border-radius: 4px; font-size: 0.86rem; font-weight: 800; display: inline-flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#27272a';" onmouseout="this.style.background='#000000';">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Pearson Past Papers Finder
        </a>
        <a href="${historyMaterialsUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; background: #ffffff; color: #000000; border: 2px solid #000000; padding: 11px 18px; border-radius: 4px; font-size: 0.86rem; font-weight: 800; display: inline-flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#f4f4f5';" onmouseout="this.style.background='#ffffff';">
          <i class="fa-solid fa-book-bookmark"></i> GCSE History (1HI0) Course Materials
        </a>
      </div>
    </div>
  `;
}

export async function renderMockExamsView() {
  const contentArea = document.getElementById('main-content');
  if (!contentArea) return;
  contentArea.innerHTML = '';
  contentArea.style.paddingTop = '0';

  const unitData = state.activeUnitData || {};
  const unitId = state.selectedUnitId || window.currentUnitId || 'cme_new';
  const mocks = unitData.mock_exams || [];

  if (!mocks || mocks.length === 0) {
    contentArea.innerHTML = `
      <div style="padding: 40px; text-align: center; background: #ffffff; border: 2px solid #000000; border-radius: 4px; margin: 40px auto; max-width: 800px;">
        <h2 style="color: #000000; margin-top: 0; font-family: 'Outfit', sans-serif;">No Mock Exam Papers Registered</h2>
        <p style="color: #374151; font-size: 1rem;">There are currently no mock exam papers registered for this unit.</p>
        <button class="btn" data-action="switch-view" data-view="dashboard" style="margin-top: 15px; padding: 10px 20px; background: #000000; color: #ffffff; border: 2px solid #000000; border-radius: 4px; cursor: pointer; font-weight: 700;">Back to Dashboard</button>
      </div>
    `;
    return;
  }

  // Determine unit-specific exam metadata
  let specTitle = 'Edexcel GCSE (9–1) History';
  let specPaperRef = '1HI0';
  let defaultTime = '1 Hour 20 Mins';
  let defaultMarks = '52 Marks';
  let pacingSummary = 'Section A: 28 mins &bull; Section B: 52 mins';

  if (unitId === 'cme_new') {
    specTitle = 'Paper 2: Conflict in the Middle East, 1945–1995';
    specPaperRef = '1HI0/P5';
    defaultTime = '55 Minutes';
    defaultMarks = '32 Marks';
    pacingSummary =
      'Single Booklet Duration: 55 mins &bull; Q1(a)/(b) Consequence (12m total) &bull; Q2 Narrative (15m) &bull; Q3 Importance (28m)';
  } else if (unitId === 'gcse_cold_war' || unitId === 'cold_war') {
    specTitle = 'Paper 2: Superpower Relations and the Cold War, 1941–91';
    specPaperRef = '1HI0/P4';
    defaultTime = '55 Minutes';
    defaultMarks = '32 Marks';
    pacingSummary =
      'Single Booklet Duration: 55 mins &bull; Q1(a)/(b) Consequence (12m total) &bull; Q2 Narrative (15m) &bull; Q3 Importance (28m)';
  } else if (unitId === 'weimar_nazi_germany') {
    specTitle = 'Paper 3: Weimar and Nazi Germany, 1918–1939';
    specPaperRef = '1HI0/31';
    defaultTime = '1 Hour 30 Mins';
    defaultMarks = '52 Marks + 4 SPaG';
    pacingSummary =
      'Section A: 30 mins (Q1 6m, Q2 24m) &bull; Section B: 60 mins (Q3a 14m, Q3b 6m, Q3c 6m, Q3d 34m)';
  } else if (unitId === 'eee') {
    specTitle = 'Paper 2: Early Elizabethan England, 1558–1588';
    specPaperRef = '1HI0/B4';
    defaultTime = '55 Minutes';
    defaultMarks = '32 Marks';
    pacingSummary =
      'Single Booklet Duration: 55 mins &bull; Q1 Features (6m total) &bull; Q2 Causation (19m) &bull; Q3/4 Essay (30m)';
  } else if (unitId === 'edexcel_medicine') {
    specTitle = 'Paper 1: Medicine in Britain, c1250–present and Western Front';
    specPaperRef = '1HI0/11';
    defaultTime = '1 Hour 20 Mins';
    defaultMarks = '52 Marks + 4 SPaG';
    pacingSummary = 'Section A (Western Front): 25 mins &bull; Section B (Thematic Study): 55 mins';
  } else if (unitId === 'usa') {
    specTitle = 'Paper 3: Conflict at Home and Abroad: the USA, 1954–75';
    specPaperRef = '1HI0/33';
    defaultTime = '1 Hour 30 Mins';
    defaultMarks = '52 Marks + 4 SPaG';
    pacingSummary =
      'Section A (Civil Rights): 30 mins (Q1 6m, Q2 24m) &bull; Section B (Vietnam): 60 mins (Q3a 14m, Q3b 6m, Q3c 6m, Q3d 34m)';
  }

  const defaultMins = defaultTime.includes('55')
    ? 55
    : defaultTime.includes('30') || defaultTime.includes('90')
      ? 90
      : 80;
  if (window.hubExamTimerState && window.hubExamTimerState.interval) {
    clearInterval(window.hubExamTimerState.interval);
  }
  window.hubExamTimerState = {
    interval: null,
    totalSeconds: defaultMins * 60,
    initialSeconds: defaultMins * 60,
    isRunning: false,
    soundEnabled: true,
  };

  const mockReturnLabel =
    typeof window !== 'undefined' && typeof window.getReturnOriginLabel === 'function'
      ? window.getReturnOriginLabel(unitId, 'Return to Unit Overview')
      : 'Return to Unit Overview';

  let html = `
    <!-- Docked Top Invigilator Toolbar -->
    <div id="docked-invigilator-hud" style="position: sticky; top: 0; z-index: 1000; background: #000000; color: #ffffff; border-bottom: 2px solid #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.5); padding: 12px 24px;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 18px;">
          <div>
            <div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #9ca3af;">
              PEARSON EXAM HALL CLOCK &bull; ${specPaperRef}
            </div>
            <div id="hub-exam-clock-display" style="font-size: 1.95rem; font-weight: 800; font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; color: #ffffff; line-height: 1.05; margin-top: 2px;">
              ${defaultMins === 55 ? '55:00' : defaultMins === 90 ? '01:30:00' : '01:20:00'}
            </div>
          </div>
          <div style="border-left: 1px solid #374151; padding-left: 16px; font-size: 0.78rem; color: #d1d5db; line-height: 1.4;">
            <div style="font-weight: 800; color: #ffffff; text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.5px;">Pacing Schedule</div>
            <div>${pacingSummary}</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn" id="hub-exam-clock-start" onclick="window.toggleHubExamClock('start', ${defaultMins})" style="background: #ffffff; color: #000000; padding: 7px 18px; border-radius: 3px; font-weight: 800; font-size: 0.85rem; border: 2px solid #ffffff; cursor: pointer;">
            Start Clock
          </button>
          <button type="button" class="btn" id="hub-exam-clock-pause" onclick="window.toggleHubExamClock('pause')" style="background: #facc15; color: #000000; padding: 7px 14px; border-radius: 3px; font-weight: 800; font-size: 0.85rem; border: 2px solid #facc15; cursor: pointer; display: none;">
            Pause
          </button>
          <button type="button" class="btn" id="hub-exam-clock-reset" onclick="window.toggleHubExamClock('reset', ${defaultMins})" style="background: transparent; color: #d1d5db; padding: 7px 12px; border-radius: 3px; font-weight: 700; font-size: 0.82rem; border: 1.5px solid #4b5563; cursor: pointer;">
            Reset
          </button>
          <button type="button" class="btn" onclick="window.toggleHubExamClock('add5')" style="background: transparent; color: #ffffff; border: 1.5px solid #6b7280; padding: 7px 11px; border-radius: 3px; font-weight: 700; font-size: 0.82rem; cursor: pointer;" title="Add 5 Minutes Extra Time">
            +5m
          </button>
          <button type="button" class="btn" onclick="window.toggleHubExamClock('add20')" style="background: transparent; color: #ffffff; border: 1.5px solid #6b7280; padding: 7px 11px; border-radius: 3px; font-weight: 700; font-size: 0.82rem; cursor: pointer;" title="Add 20 Minutes (25% Access Arrangements)">
            +20m (25%)
          </button>
          <button type="button" class="btn" id="hub-exam-clock-sound" onclick="window.toggleHubExamClock('toggleSound')" style="background: transparent; color: #ffffff; border: 1.5px solid #6b7280; padding: 7px 11px; border-radius: 3px; font-weight: 700; font-size: 0.82rem; cursor: pointer;">
            🔊 Sound: On
          </button>
          <button type="button" class="btn" id="hub-timing-strategy-btn" onclick="window.toggleHubTimingStrategy()" style="background: #111827; color: #38bdf8; border: 1.5px solid #0284c7; padding: 7px 14px; border-radius: 3px; font-weight: 800; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="View Exam Timing Strategy & Pacing Breakdown">
            <span>⏱ Timing Strategy</span> <span id="hub-strategy-arrow" style="font-size: 9px; transition: transform 0.2s ease;">▼</span>
          </button>
        </div>
      </div>
      <div id="hub-exam-clock-pacing-alert" style="max-width: 1200px; margin: 10px auto 0 auto; display: none;"></div>

      <!-- Collapsible Timing Strategy Drawer (Pacing Matrix: 1 Mark ≈ 1.25 Mins) -->
      <div id="hub-timing-strategy-drawer" style="display: none; max-width: 1200px; margin: 12px auto 0 auto; border-top: 1px solid #374151; padding-top: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.8px;">
              ⏱ Pearson GCSE History &bull; Exam Timing Strategy &amp; Pacing Matrix
            </div>
            <div style="font-size: 0.78rem; color: #d1d5db; margin-top: 2px;">
              <strong>The Golden Rule:</strong> 1 Mark &asymp; 1.25 Minutes. Protect your marks by adhering strictly to the recommended planning vs. writing splits below.
            </div>
          </div>
          <div style="font-size: 0.72rem; color: #9ca3af; background: #111827; padding: 4px 10px; border-radius: 3px; border: 1px solid #374151;">
            💡 Tip: Click any row's <strong>[⏱ Time (Xm)]</strong> button to set the invigilator clock immediately.
          </div>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem; text-align: left; background: #000000; border: 1px solid #374151; border-radius: 4px;">
            <thead>
              <tr style="background: #111827; color: #93c5fd; border-bottom: 1px solid #374151; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.5px;">
                <th style="padding: 8px 12px;">Tariff</th>
                <th style="padding: 8px 12px;">Question Type (Edexcel Specification)</th>
                <th style="padding: 8px 12px;">Total Time</th>
                <th style="padding: 8px 12px;">Planning &amp; Prep Split</th>
                <th style="padding: 8px 12px;">Writing &amp; Evidence Split</th>
                <th style="padding: 8px 12px; text-align: right;">Quick Action</th>
              </tr>
            </thead>
            <tbody>
              ${getHubTimingStrategyRows(unitId)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div style="max-width: 1200px; margin: 0 auto; padding: 25px 15px 40px 15px;">
      <div style="margin-bottom: 14px;">
        <button type="button" id="mock-exams-return-btn" onclick="if(window.returnToSavedOrigin){window.returnToSavedOrigin('${unitId}');}else if(window.switchView){window.switchView('lessons', '${unitId}');}" style="background: #f8fafc; border: 1.5px solid #cbd5e1; color: #0f172a; border-radius: 8px; padding: 7px 14px; font-size: 0.84rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px;">
          <i class="fa-solid fa-arrow-left"></i>
          <span>${mockReturnLabel}</span>
        </button>
      </div>
      <!-- Hub Examination Masthead -->
      <div style="background: #ffffff; color: #000000; border: 2px solid #000000; border-radius: 4px; padding: 26px 30px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #000000;">
              THE HISTORY REVISION HUB &bull; ALIGNED TO EDEXCEL GCSE (9–1)
            </div>
            <h1 style="margin: 4px 0 0 0; font-size: 1.9rem; font-weight: 900; line-height: 1.2; font-family: 'Outfit', sans-serif; color: #000000;">
              Mastery &amp; Mock Examination Papers
            </h1>
          </div>
          <div style="text-align: right;">
            <span style="display: inline-block; background: #000000; color: #ffffff; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px; padding: 4px 10px; text-transform: uppercase;">
              ${specPaperRef} &bull; ${defaultTime.toUpperCase()}
            </span>
            <div style="font-size: 0.82rem; font-weight: 700; color: #000000; margin-top: 4px;">
              ${mocks.length} Practice Papers Available
            </div>
          </div>
        </div>
        <div style="font-size: 1rem; font-weight: 700; color: #000000; margin-bottom: 6px;">
          ${specTitle}
        </div>
        <p style="margin: 0; font-size: 0.92rem; color: #111827; max-width: 900px; line-height: 1.5;">
          Original Hub exam-style practice papers featuring full source booklets, question papers, and comprehensive teacher mark schemes. Calibrated for timed classroom mock conditions and A4 printing.
        </p>
      </div>

      <!-- Sub Navigation Tabs: High-Contrast Monochrome -->
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; border-bottom: 2px solid #000000; padding-bottom: 2px;">
        <button id="tab-btn-official-mocks" class="btn" style="background: #000000; color: #ffffff; border: 2px solid #000000; border-bottom: none; padding: 9px 14px; border-radius: 4px 4px 0 0; font-weight: 800; cursor: pointer; font-size: 0.84rem; display: flex; align-items: center; gap: 7px; white-space: nowrap;">
          <i class="fa-solid fa-graduation-cap"></i> Mastery &amp; Mock Papers
        </button>
        <button id="tab-btn-official-past-papers" class="btn" style="background: #ffffff; color: #000000; border: 2px solid #000000; border-bottom: none; padding: 9px 14px; border-radius: 4px 4px 0 0; font-weight: 700; cursor: pointer; font-size: 0.84rem; display: flex; align-items: center; gap: 7px; white-space: nowrap;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Pearson Past Papers Portal
        </button>
        <button id="tab-btn-trend-radar" class="btn" style="background: #ffffff; color: #000000; border: 2px solid #000000; border-bottom: none; padding: 9px 14px; border-radius: 4px 4px 0 0; font-weight: 700; cursor: pointer; font-size: 0.84rem; display: flex; align-items: center; gap: 7px; white-space: nowrap;">
          <i class="fa-solid fa-chart-line"></i> Topic Trend Matrix &amp; Overdue Radar (2018–2025)
        </button>
      </div>

      <div id="mock-papers-wrapper">
        ${(() => {
          const catEntry = getUnitCatalogEntry(unitId);
          if (!catEntry) return '';
          const mp = catEntry.masteryExamPack || catEntry.masteryPack;
          const exInfo = catEntry.examInfographic;
          if (!mp && !exInfo) return '';
          const mpPdf = mp && mp.pdfUrl && isVerifiedPdf(mp.pdfUrl) ? mp.pdfUrl : '';
          const editionsPills =
            mp && Array.isArray(mp.editions) && mp.editions.length > 1
              ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">` +
                mp.editions
                  .map((ed) => {
                    const edPdf = ed.pdfUrl && isVerifiedPdf(ed.pdfUrl) ? ed.pdfUrl : '';
                    const href = edPdf || ed.htmlUrl;
                    return `<a href="${href}" target="_blank" style="text-decoration:none;font-size:0.74rem;font-weight:800;padding:4px 9px;border-radius:3px;border:1.5px solid #000;background:#f8fafc;color:#0f172a;display:inline-flex;align-items:center;gap:5px;"><i class="fa-solid ${edPdf ? 'fa-file-pdf' : 'fa-book-open'}"></i> ${ed.label}</a>`;
                  })
                  .join('') +
                `</div>`
              : '';
          const exSlug = exInfo ? exInfo.slug || exInfo.id : '';
          const exLabel = exInfo ? exInfo.label || exInfo.title : '';
          return `
            <div style="background: #f8fafc; border: 2px solid #000000; border-radius: 4px; padding: 18px 22px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
              <div style="flex: 1; min-width: 260px;">
                <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #4338ca; margin-bottom: 4px;">
                  MASTERY EXAM PACK &amp; EXAM TECHNIQUE
                </div>
                <div style="font-size: 1.15rem; font-weight: 900; color: #000000;">
                  ${mp ? mp.title : 'Specification Exam Strategy Guide'}
                </div>
                <div style="font-size: 0.84rem; color: #334155; margin-top: 4px;">
                  ${mp ? mp.desc : 'Question-by-question timing, mark allocation, and examiner technique.'}
                </div>
                ${editionsPills}
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${
                  mp
                    ? `<button type="button" onclick="if(window.openCurricularPillar){window.openCurricularPillar('${mp.htmlUrl}', '${mp.title.replace(/'/g, "\\'")}', '${mpPdf}', 'MASTERY_PACK');}else{window.open('${mp.htmlUrl}','_blank');}" style="background:#000000;color:#ffffff;border:2px solid #000000;padding:9px 14px;border-radius:4px;font-size:0.8rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;"><i class="fa-solid fa-book-open-reader"></i> Read Mastery Pack</button>`
                    : ''
                }
                ${
                  mpPdf
                    ? `<a href="${mpPdf}" target="_blank" download="${mp.downloadName || ''}" style="background:#ffffff;color:#000000;border:2px solid #000000;padding:9px 14px;border-radius:4px;font-size:0.8rem;font-weight:800;text-decoration:none;display:inline-flex;align-items:center;gap:6px;"><i class="fa-solid fa-file-pdf" style="color:#dc2626;"></i> PDF (${mp.pages || 'A4'})</a>`
                    : ''
                }
                ${
                  exSlug
                    ? `<button type="button" onclick="if(window.openInfographicModal){window.openInfographicModal('${exSlug}');}" style="background:#eff6ff;color:#1e3a8a;border:2px solid #1e3a8a;padding:9px 14px;border-radius:4px;font-size:0.8rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;"><i class="fa-solid fa-graduation-cap"></i> ${exLabel}</button>`
                    : ''
                }
              </div>
            </div>
          `;
        })()}
        <!-- Assessment Specification Quick Audit -->
        <div style="background: #ffffff; border: 2px solid #000000; border-radius: 4px; padding: 16px 20px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
          <div>
            <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #000000; letter-spacing: 1px;">Exam Timing</div>
            <div style="font-size: 1.1rem; font-weight: 900; color: #000000; margin-top: 2px;">${defaultTime}</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #000000; letter-spacing: 1px;">Total Marks</div>
            <div style="font-size: 1.1rem; font-weight: 900; color: #000000; margin-top: 2px;">${defaultMarks}</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #000000; letter-spacing: 1px;">Print Format</div>
            <div style="font-size: 1.1rem; font-weight: 900; color: #000000; margin-top: 2px;">A4 Exam Replicas</div>
          </div>
          <div>
            <div style="font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #000000; letter-spacing: 1px;">Marking Support</div>
            <div style="font-size: 1.1rem; font-weight: 900; color: #000000; margin-top: 2px;">Full Indicative Content</div>
          </div>
        </div>

        <!-- Mock Papers Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
  `;

  mocks.forEach((mock, idx) => {
    const paperUrl = mock.url || `${mock.id}.html`;
    const fullPaperUrl = paperUrl.startsWith('/') ? paperUrl : `/units/${unitId}/${paperUrl}`;

    const hasMs = Boolean(
      mock.has_mark_scheme ||
      mock.mark_scheme_url ||
      unitId === 'weimar_nazi_germany' ||
      unitId === 'eee' ||
      unitId === 'usa' ||
      unitId === 'gcse_cold_war' ||
      unitId === 'cold_war' ||
      (unitId === 'edexcel_medicine' && mock.id !== 'mock_2025_clone'),
    );
    const msFileName =
      mock.mark_scheme_url || `${paperUrl.replace(/\.html$/, '')}_mark_scheme.html`;
    const fullMsUrl = msFileName.startsWith('/') ? msFileName : `/units/${unitId}/${msFileName}`;

    const hasSeparateBooklets =
      unitId === 'weimar_nazi_germany' || unitId === 'usa' || unitId === 'edexcel_medicine';
    const isRadarMock =
      mock.title.includes('Radar') ||
      mock.title.includes('Heat Map') ||
      mock.title.includes('Forecast');
    const isWorkbookMiniMock = Boolean(mock.workbook_badge);
    const badgeText = isWorkbookMiniMock
      ? mock.workbook_badge
      : mock.title.includes('NotebookLM')
        ? 'PREDICTION MODEL'
        : isRadarMock
          ? 'RADAR SPEC GAP'
          : `MOCK PAPER ${idx + 1}`;
    const badgeBg = isWorkbookMiniMock ? '#047857' : '#000000';

    html += `
      <div style="background: #ffffff; border: 2px solid ${isWorkbookMiniMock ? '#047857' : '#000000'}; border-radius: 4px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 0.7rem; font-weight: 800; background: ${badgeBg}; color: #ffffff; padding: 3px 8px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
              ${badgeText}
            </span>
            <span style="font-size: 0.8rem; font-weight: 800; color: #000000;">
              ${mock.paper_reference || specPaperRef}
            </span>
          </div>

          <h3 style="margin: 8px 0 10px 0; color: #000000; font-size: 1.15rem; font-weight: 800; line-height: 1.35; font-family: 'Outfit', sans-serif;">
            ${mock.title}
          </h3>

          ${
            isRadarMock
              ? `
            <div style="font-size: 0.78rem; color: #000000; background: #f9fafb; border: 1.5px solid #000000; border-radius: 3px; padding: 8px 10px; margin-bottom: 12px; line-height: 1.45; font-style: italic;">
              <strong>Topic Forecast:</strong> Target questions calibrated against unexamined syllabus criteria across 2018–2025.
            </div>
          `
              : ''
          }

          <div style="background: #f4f4f5; border: 1px solid #d1d5db; border-radius: 3px; padding: 8px 12px; font-size: 0.82rem; color: #000000; margin-bottom: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; font-weight: 600;">
            <span><strong>Time:</strong> ${mock.time_minutes ? mock.time_minutes + ' mins' : defaultTime}</span>
            <span><strong>Marks:</strong> ${mock.total_marks ? mock.total_marks + ' marks' : defaultMarks}</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${
            hasSeparateBooklets
              ? `
            <!-- Saddle-Stitch Architecture (Pearson Reprographics) -->
            <div style="font-size: 0.68rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: -2px;">
              Exam Hall Saddle-Stitch Booklets:
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <a href="/units/${unitId}/${mock.id}_question_booklet.html" target="_blank" style="text-align: center; text-decoration: none; background: #000000; color: #ffffff; border: 2px solid #000000; padding: 8px 6px; border-radius: 4px; font-size: 0.78rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#27272a';" onmouseout="this.style.background='#000000';" title="Open 16-page saddle-stitch Question & Answer Booklet in new tab (Print-ready A4)">
                <i class="fa-solid fa-file-lines" style="color: #60a5fa;"></i> 16p Question Booklet
              </a>
              <a href="/units/${unitId}/${mock.id}_sources_booklet.html" target="_blank" style="text-align: center; text-decoration: none; background: #f8fafc; color: #0f172a; border: 2px solid #000000; padding: 8px 6px; border-radius: 4px; font-size: 0.78rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#e2e8f0';" onmouseout="this.style.background='#f8fafc';" title="Open 4-page loose Sources/Interpretations Booklet in new tab (Print-ready A4)">
                <i class="fa-solid fa-book-open" style="color: #f59e0b;"></i> 4p Sources Insert
              </a>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <a href="${fullPaperUrl}" target="_blank" style="text-align: center; text-decoration: none; background: #ffffff; color: #000000; border: 1.5px solid #71717a; padding: 7px 6px; border-radius: 4px; font-size: 0.76rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s ease;" onmouseover="this.style.background='#f4f4f5';" onmouseout="this.style.background='#ffffff';" title="Open complete collated exam pack in new tab">
                <i class="fa-solid fa-layer-group" style="color: #64748b;"></i> 20p Complete Pack
              </a>
              <a href="${fullPaperUrl}" target="_blank" style="text-align: center; text-decoration: none; background: #ffffff; color: #000000; border: 1.5px solid #71717a; padding: 7px 6px; border-radius: 4px; font-size: 0.76rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s ease;" onmouseover="this.style.background='#f4f4f5';" onmouseout="this.style.background='#ffffff';" title="Open interactive exam simulator with timer">
                <i class="fa-solid fa-laptop"></i> Interactive
              </a>
            </div>
          `
              : `
            <!-- Question Paper Actions: Interactive Simulator & Authentic A4 Paper -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <a href="${fullPaperUrl}" target="_blank" style="text-align: center; text-decoration: none; background: #000000; color: #ffffff; border: 2px solid #000000; padding: 9px 6px; border-radius: 4px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#27272a';" onmouseout="this.style.background='#000000';" title="Open interactive exam simulator with timer">
                <i class="fa-solid fa-laptop"></i> Interactive
              </a>
              <a href="${fullPaperUrl}" target="_blank" style="text-align: center; text-decoration: none; background: #ffffff; color: #000000; border: 2px solid #000000; padding: 9px 6px; border-radius: 4px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease;" onmouseover="this.style.background='#f4f4f5';" onmouseout="this.style.background='#ffffff';" title="Open printable A4 Question Paper">
                <i class="fa-solid fa-file-lines" style="color: #dc2626;"></i> Paper View
              </a>
            </div>
          `
          }

          ${
            isRadarMock
              ? `
            <button class="btn btn-jump-to-radar" style="text-align: center; text-decoration: none; background: #fee2e2; color: #991b1b; border: 2px solid #000000; padding: 8px 12px; border-radius: 4px; font-size: 0.82rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: all 0.15s ease;" onmouseover="this.style.background='#fecaca';" onmouseout="this.style.background='#fee2e2';">
              <i class="fa-solid fa-fire" style="color: #dc2626;"></i> Drill Overdue Radar Gaps
            </button>
          `
              : ''
          }

          <!-- Mark Scheme Actions (Staff Mode Only) -->
          ${
            hasMs && isStaffModeActive()
              ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <a href="${fullMsUrl}" target="_blank" style="text-align: center; text-decoration: none; background: #ecfdf5; color: #065f46; border: 1.5px solid #059669; padding: 8px 6px; border-radius: 4px; font-size: 0.76rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s ease;" title="Staff Only: Open interactive mark scheme with model answers">
                <i class="fa-solid fa-lock-open"></i> Interactive MS
              </a>
              <a href="${fullMsUrl}" target="_blank" style="text-align: center; text-decoration: none; background: #ffffff; color: #065f46; border: 1.5px solid #059669; padding: 8px 6px; border-radius: 4px; font-size: 0.76rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 4px; transition: all 0.15s ease;" title="Staff Only: Open printable A4 Mark Scheme">
                <i class="fa-solid fa-file-lines" style="color: #16a34a;"></i> Printable MS
              </a>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div> <!-- End #mock-papers-wrapper -->

      <!-- Edexcel Past Papers Archive Archive Container -->
      <div id="official-past-papers-container" style="display: none;"></div>

      <!-- Past Paper Question Matrix & Overdue Radar Container -->
      <div id="mock-trend-matrix-container" style="display: none;"></div>

      <!-- Bottom Actions Bar -->
      <div style="margin-top: 35px; padding-top: 20px; border-top: 2px solid #000000; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <button type="button" class="btn" onclick="if(window.returnToSavedOrigin){window.returnToSavedOrigin('${unitId}');}else if(window.switchView){window.switchView('lessons', '${unitId}');}" style="padding: 9px 18px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; background: #ffffff; color: #000000; border: 2px solid #000000;">
          &larr; ${mockReturnLabel}
        </button>
        <button type="button" class="btn" onclick="if(window.switchView){window.switchView('booklet', '${unitId}');}" style="padding: 9px 18px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; background: #000000; color: #ffffff; border: 2px solid #000000;">
          Open PDFs &amp; Booklets
        </button>
      </div>
    </div>
  `;

  contentArea.innerHTML = html;

  // Sub Navigation Tabs Logic
  const tabBtnMocks = document.getElementById('tab-btn-official-mocks');
  const tabBtnOfficial = document.getElementById('tab-btn-official-past-papers');
  const tabBtnTrend = document.getElementById('tab-btn-trend-radar');
  const mockWrapper = document.getElementById('mock-papers-wrapper');
  const officialContainer = document.getElementById('official-past-papers-container');
  const trendContainer = document.getElementById('mock-trend-matrix-container');

  const activateTab = (activeBtn, showContainer) => {
    [tabBtnMocks, tabBtnOfficial, tabBtnTrend].forEach((btn) => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.style.background = '#000000';
        btn.style.color = '#ffffff';
      } else {
        btn.style.background = '#ffffff';
        btn.style.color = '#000000';
      }
    });
    [mockWrapper, officialContainer, trendContainer].forEach((c) => {
      if (!c) return;
      c.style.display = c === showContainer ? 'block' : 'none';
    });
  };

  if (tabBtnMocks) {
    tabBtnMocks.addEventListener('click', () => {
      activateTab(tabBtnMocks, mockWrapper);
    });
  }

  if (tabBtnOfficial) {
    tabBtnOfficial.addEventListener('click', () => {
      activateTab(tabBtnOfficial, officialContainer);
      if (officialContainer) renderOfficialPastPapers(officialContainer, unitId);
    });
  }

  if (tabBtnTrend) {
    tabBtnTrend.addEventListener('click', async () => {
      activateTab(tabBtnTrend, trendContainer);
      if (trendContainer) {
        const { renderExamTrendMatrix } = await import('./exam_trend_matrix.js');
        renderExamTrendMatrix(trendContainer, unitId);
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const targetTab = urlParams.get('tab');
  const curView = urlParams.get('view');
  if (
    targetTab === 'official' ||
    targetTab === 'past-papers' ||
    targetTab === 'archive' ||
    targetTab === 'pastpapers'
  ) {
    if (tabBtnOfficial) tabBtnOfficial.click();
  } else if (
    targetTab === 'radar' ||
    targetTab === 'trend' ||
    targetTab === 'matrix' ||
    curView === 'trend-radar' ||
    curView === 'matrix'
  ) {
    if (tabBtnTrend) tabBtnTrend.click();
  }

  contentArea.querySelectorAll('.btn-jump-to-radar').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (tabBtnTrend) tabBtnTrend.click();
      setTimeout(() => {
        const radarTab = document.querySelector('.etm-tab-btn[data-tab="radar"]');
        if (radarTab) radarTab.click();
      }, 150);
    });
  });

  if (window.scrollToTop) window.scrollToTop(true);
  else contentArea.scrollTo({ top: 0, behavior: 'smooth' });
}

export async function renderDigitalReaderView(param) {
  const { renderDigitalReaderView: renderReader } = await import('./digital_textbook_reader.js');
  await renderReader(param);
}

export async function renderReadingView(options = {}) {
  const container = document.getElementById('main-content');
  const unitId = state.selectedUnitId || window.currentUnitId || 'great_war_part2';
  const unitData = state.activeUnitData || {};

  if (['edexcel_medicine', 'eee', 'gcse_cold_war', 'cme_new', 'weimar_nazi_germany', 'usa'].includes(unitId)) {
    if (container) {
      container.innerHTML = `
        <div style="max-width: 780px; margin: 40px auto; padding: 28px; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; text-align: center; font-family: 'Inter', sans-serif; box-shadow: 0 4px 16px rgba(15,23,42,0.06);">
          <div style="font-size: 0.78rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #0284c7; margin-bottom: 8px;">Key Stage 2 &amp; Key Stage 3 Feature</div>
          <h2 style="margin: 0 0 10px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; color: #0f172a;">Guided Reading is Reserved for KS2 &amp; KS3 Units</h2>
          <p style="margin: 0 0 18px 0; color: #475569; font-size: 0.94rem; line-height: 1.6;">GCSE courses already include full 28-page Master Classroom Textbooks, Visual Story Sheets, and Primary Source / Interpretation banks inside every lesson.</p>
          <button type="button" onclick="window.switchView && window.switchView('lessons', '${unitId}')" style="background: #2563eb; color: #ffffff; border: none; font-weight: 700; font-size: 0.88rem; padding: 10px 18px; border-radius: 8px; cursor: pointer;">Back to GCSE Lessons</button>
        </div>
      `;
    }
    return;
  }

  const guidedReadingData = unitData.guided_reading || [];

  const urlParams = new URLSearchParams(window.location.search);
  const rawLesson = options && options.rawLesson ? options.rawLesson : urlParams.get('lesson');
  let lessonParam = options && options.lessonIndex !== undefined ? options.lessonIndex : null;
  if (lessonParam === null && rawLesson !== null) {
    const parsed = parseInt(rawLesson, 10);
    if (!isNaN(parsed)) {
      // e.g. ?lesson=1 -> index 0
      lessonParam = parsed > 0 ? parsed - 1 : 0;
    }
  }
  const currentLessonIndex = typeof lessonParam === 'number' ? lessonParam : 0;

  import('./guided_reading.js').then(({ initGuidedReadingTask }) => {
    initGuidedReadingTask(container, guidedReadingData, { currentLessonIndex, rawLesson, unitId, unitData });
  });
}

export async function renderMarkingView(options = {}) {
  const container = document.getElementById('main-content');
  const unitId = state.selectedUnitId || window.currentUnitId || 'great_war_part2';
  const unitData = state.activeUnitData || {};

  const { renderDepartmentMarkingBank } = await import('./marking_bank.js');
  renderDepartmentMarkingBank(container, unitId, unitData);
}

