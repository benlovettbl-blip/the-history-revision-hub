/**
 * src/engine/ancient_lesson_renderer.js
 *
 * Dedicated Classical Lesson Engine for Cambridge OCR GCSE (9–1) Ancient History (J198).
 *
 * Keeps 100% single-source-of-truth backend compatibility with Hub Studio Audio, Classroom Spotlight,
 * Living Timelines, 5-Ring Mind Maps, Vocab/Quiz Consolidate Station, and Printable Workbooks/Textbooks,
 * while liberating the Ancient History classroom experience from Edexcel's layout constraints:
 *  - Interleaved "Story Beat ↔ Inline Ancient Witness / Prescribed Set Source" stations (zero bottom-pile duplication)
 *  - Anti-Scroll-Fatigue 100–160w Modern-English Exam-Cut Extracts + Scene-Tabbed Full Set Text Modal
 *  - Interactive 3D Flip Coin (Obverse ↔ Reverse) & Relief Hotspot Lab with "Test Me Cold" exam drill
 *  - Tap-to-Hear Classical Pronunciation Bar + 60-Second 5-Mark SPaG Spelling Sprint
 *  - "Myth vs The Archaeologist's Spade" & "Hollywood vs History" dual-lens cards
 *  - OCR J198 Exam Station with Green-Only "Direct Quote" WAGOLL Highlighting (+ optional AO1/AO2/AO3 toggle)
 *    and Live Examiner Reductive-Trap Detector ("wasn't there", "bestseller", "armchair historian", "gaslighter").
 */

import { getAssetUrl } from './assets.js';
import { renderAudioPlaybackBar } from './speech.js';
import {
  renderStageSpotlightBtnHTML,
  registerActiveLessonStages,
} from './classroom_spotlight_and_locator.js';
import { renderGcseDoNowPanelHTML, initGcseDoNowEngine } from './gcse_donow_engine.js';
import { renderConsolidateStationHTML, initConsolidateStation } from './lesson_consolidate_station.js';
import { isStaffModeActive } from '../data/unit_resources_catalog.js';
import { openUnifiedTeacherGuidance } from './teacher_guidance_modal.js';
import {
  openPrescribedSourcesVaultModal,
  highlightGreenQuotesHtml,
} from '../ocr_prescribed_sources_vault.js';
import { openOcrAncientAtlasModal } from '../ocr_ancient_atlas.js';
import { initLaptopModeForLesson } from './laptop_mode.js';

export const OCR_GCSE_CANONICAL_UNITS = [
  'ocr_persian_empire',
  'ocr_alexander',
  'ocr_foundations_of_rome',
  'ocr_cleopatra',
];

export function isOcrAncientUnit(unitId, unitData = null) {
  const id = String(unitId || unitData?.id || '').trim();
  if (OCR_GCSE_CANONICAL_UNITS.includes(id) || id.startsWith('ocr_')) return true;
  return Boolean(unitData?.exam_board === 'OCR_J198' || unitData?.is_ocr_ancient);
}

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatNarrativeProseHtml(rawText, vocabList = []) {
  if (!rawText) return '';
  const paragraphs = String(rawText)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((p, idx) => {
      // Strip pre-baked <span class="para-ref">[1.1]</span> wrappers cleanly before escaping so raw tags never leak
      const cleanedP = p
        .replace(/<span\s+class=["']para-ref["'][^>]*>\s*(\[\d+\.\d+\])\s*<\/span>/gi, '$1')
        .replace(/`([^`]+)`/g, '$1');
      let html = esc(cleanedP)
        .replace(/\[(\d+\.\d+)\]/g, '<span class="ocr-para-pill">[$1]</span>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // Wrap matching vocab terms with subtle tap-to-hear pronunciation tooltip on first occurrence
      if (Array.isArray(vocabList)) {
        for (const v of vocabList) {
          const term = String(v?.term || '').trim();
          if (term.length < 4) continue;
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const rx = new RegExp(`(?<!<[^>]*?)\\b(${escapedTerm})\\b(?![^<]*?>)`, 'i');
          if (rx.test(html)) {
            const safeSpeak = term.replace(/'/g, "\\'");
            const pron = v.pronunciation || v.phonetic || '';
            const tip = esc(`${pron ? `[${pron}] ` : ''}${v.definition || ''}`);
            html = html.replace(
              rx,
              `<span class="ocr-inline-term" tabindex="0" title="${tip}" onclick="window.ocrSpeakTerm && window.ocrSpeakTerm('${safeSpeak}')">$1<i class="fa-solid fa-volume-high ocr-term-audio-ico"></i></span>`,
            );
          }
        }
      }
      return `<p class="ocr-beat-para" data-para-idx="${idx}">${html}</p>`;
    })
    .join('');
}

const REDUCTIVE_TRAPS = [
  {
    rx: /\b(?:wasn'?t\s+there|was\s+not\s+there|not\s+an?\s+eyewitness|never\s+met\s+him|never\s+met\s+her)\b/i,
    bad: '“He wasn’t there / not an eyewitness”',
    fix: 'OCR Examiners penalise dismissing ancient historians just for writing later! Name the earlier lost eyewitness sources they DID use (e.g. Arrian used King Ptolemy and Aristobulus; Plutarch cited royal letters and court diarists; Herodotus gathered Persian/Lydian oral traditions).',
  },
  {
    rx: /\b(?:bestseller|make\s+money|sell\s+books|sell\s+copies)\b/i,
    bad: '“Writing a bestseller / to make money”',
    fix: 'Anachronism trap! Ancient writers like Plutarch, Livy, and Herodotus did NOT earn royalties from book sales—explain their moral, philosophical, or political purpose instead.',
  },
  {
    rx: /\barmchair\s+historian\b/i,
    bad: '“Armchair historian”',
    fix: '2025 Examiner Report warning: avoid calling Livy or Virgil an “armchair historian”. Discuss Livy’s patriotic moral exempla or Virgil’s Augustan epic genre instead.',
  },
  {
    rx: /\b(?:gaslight\w*|love\s*bomb\w*|gold\s*digger|toxic\s+relationship|social\s+media)\b/i,
    bad: 'Modern relationship slang (“gaslighter / toxic / gold digger”)',
    fix: '2025 Examiner Report warning: never judge ancient rulers with modern TikTok/relationship slang—use Hellenistic dynastic politics, Roman client-kingship, and patriarchal norms.',
  },
];

function ensureAncientLessonStyles() {
  if (typeof document === 'undefined' || document.getElementById('ocr-ancient-lesson-styles')) return;
  const st = document.createElement('style');
  st.id = 'ocr-ancient-lesson-styles';
  st.textContent = `
    .ocr-ancient-shell {
      max-width: 1120px;
      margin: 0 auto;
      padding: 16px 20px 96px 20px;
      box-sizing: border-box;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #0f172a;
    }
    .ocr-hero-card {
      background: linear-gradient(135deg, #2b0f06 0%, #5c1d0c 52%, #9a3412 100%);
      border-radius: 16px;
      padding: 22px 24px 18px 24px;
      color: #ffffff;
      box-shadow: 0 12px 28px rgba(67, 20, 7, 0.22);
      border: 1px solid rgba(253, 186, 116, 0.32);
      margin-bottom: 14px;
      position: relative;
      overflow: hidden;
    }
    .ocr-sticky-dock {
      position: sticky;
      top: 8px;
      z-index: 45;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(10px);
      border: 1.5px solid #fed7aa;
      border-radius: 12px;
      padding: 9px 14px;
      margin-bottom: 18px;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .ocr-dock-btn {
      background: #fff7ed;
      color: #9a3412;
      border: 1px solid #fdba74;
      border-radius: 8px;
      padding: 6px 11px;
      font-size: 0.77rem;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .ocr-dock-btn:hover {
      background: #ffedd5;
      border-color: #ea580c;
    }
    .ocr-dock-btn-primary {
      background: #9a3412;
      color: #ffffff;
      border-color: #7c2d12;
    }
    .ocr-dock-btn-primary:hover {
      background: #7c2d12;
    }
    .ocr-beat-station {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px 22px;
      margin-bottom: 20px;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
      scroll-margin-top: 78px;
    }
    .ocr-beat-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.18fr) minmax(300px, 1fr);
      gap: 22px;
      align-items: start;
    }
    .ocr-beat-grid.is-reversed {
      grid-template-columns: minmax(300px, 1fr) minmax(0, 1.18fr);
    }
    .ocr-beat-station .btn-stage-spotlight,
    .ocr-beat-station [data-action="open-stage-spotlight"] {
      color: #334155 !important;
      border-color: #94a3b8 !important;
      background: #f8fafc !important;
      opacity: 1 !important;
    }
    .ocr-beat-station .btn-stage-spotlight:hover,
    .ocr-beat-station [data-action="open-stage-spotlight"]:hover {
      background: #0f172a !important;
      color: #ffffff !important;
      border-color: #0f172a !important;
    }
    .ocr-beat-para {
      font-family: 'Lora', Georgia, serif;
      font-size: 1.04rem;
      line-height: 1.68;
      color: #1e293b;
      margin: 0 0 12px 0;
      hyphens: none;
    }
    .ocr-para-pill {
      font-family: 'Inter', sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      color: #9a3412;
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-radius: 5px;
      padding: 1px 6px;
      margin-right: 5px;
      vertical-align: baseline;
    }
    .ocr-inline-term {
      border-bottom: 1.5px dashed #d97706;
      cursor: pointer;
      color: #0f172a;
      font-weight: 600;
      padding: 0 1px;
    }
    .ocr-term-audio-ico {
      font-size: 0.65rem;
      color: #d97706;
      margin-left: 3px;
      vertical-align: super;
    }
    .ocr-witness-card {
      margin-top: 16px;
      background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
      border: 2px solid #f59e0b;
      border-left: 6px solid #b45309;
      border-radius: 14px;
      padding: 16px 18px;
      box-shadow: 0 6px 18px rgba(180, 83, 9, 0.08);
    }
    mark.ocr-quote-green {
      background: #dcfce7;
      color: #065f46;
      border: 1px solid #86efac;
      border-radius: 5px;
      padding: 1px 5px;
      font-weight: 700;
    }
    .ocr-wagoll-prose p {
      margin: 0 0 14px 0;
    }
    .ocr-wagoll-prose p:last-child {
      margin-bottom: 0;
    }
    .ocr-ao-mode-active .ocr-ao1-span {
      background: #dbeafe;
      color: #1e3a8a;
      border-radius: 4px;
      padding: 1px 4px;
    }
    .ocr-ao-mode-active .ocr-ao2-span {
      background: #fef3c7;
      color: #92400e;
      border-radius: 4px;
      padding: 1px 4px;
    }
    .ocr-ao-mode-active .ocr-ao3-span {
      background: #f3e8ff;
      color: #6b21a8;
      border-radius: 4px;
      padding: 1px 4px;
    }
    .ocr-ao-legend {
      display: none;
      margin: 0 0 12px 0;
      padding: 9px 13px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      font-size: 0.84rem;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
    }
    .ocr-ao-mode-active .ocr-ao-legend {
      display: flex;
    }
    .ocr-passage-split {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr);
      gap: 16px;
      align-items: start;
    }
    .ocr-passage-sticky {
      position: sticky;
      top: 74px;
    }
    /* 3D Coin Flip & Hotspot Lab (1:1 Square Mobile-Safe Stage) */
    .ocr-coin-stage {
      perspective: 1100px;
      width: 100%;
      max-width: 310px;
      aspect-ratio: 1 / 1;
      margin: 0 auto;
    }
    .ocr-coin-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }
    .ocr-coin-inner.is-flipped {
      transform: rotateY(180deg);
    }
    .ocr-coin-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      background: #0f172a;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fbbf24;
    }
    .ocr-coin-face.ocr-coin-reverse {
      transform: rotateY(180deg);
    }
    .ocr-hotspot-pin {
      position: absolute;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #ea580c;
      color: #ffffff;
      border: 2px solid #ffffff;
      font-size: 0.75rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(0,0,0,0.45);
      transform: translate(-50%, -50%);
      z-index: 6;
      transition: transform 0.15s ease, background 0.15s ease;
    }
    .ocr-hotspot-pin:hover,
    .ocr-hotspot-pin.is-active {
      transform: translate(-50%, -50%) scale(1.18);
      background: #16a34a;
    }
    @media (max-width: 820px) {
      .ocr-ancient-shell {
        padding: 10px 12px 108px 12px;
      }
      .ocr-beat-station {
        padding: 14px 14px;
      }
      .ocr-beat-grid,
      .ocr-beat-grid.is-reversed,
      .ocr-passage-split {
        grid-template-columns: 1fr;
        gap: 14px;
      }
      .ocr-passage-sticky {
        position: static;
      }
      .ocr-coin-stage {
        max-width: 280px;
      }
      .ocr-beat-para {
        font-size: 1rem;
        line-height: 1.62;
      }
    }
  `;
  document.head.appendChild(st);
}

function renderVisualAnchorHtml(block, unitId, beatIdx) {
  const widgetSvg = block.concept_widget_svg || block.concept_widget?.svg || '';
  if (widgetSvg) {
    const widgetBadge =
      block.widget_badge || block.concept_widget?.eyebrow || 'Classical Schematic & Mechanism';
    const widgetTitle = block.concept_widget?.title || '';
    const widgetCap = block.caption || block.concept_widget?.caption || '';
    const diagId = `ocr-svg-diag-${beatIdx}`;
    const isMapWidget = /geography|map|frontier|campaign/i.test(`${widgetBadge} ${widgetTitle}`);
    return `
      <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px;flex-wrap:wrap;">
          <span style="font-size:0.74rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#9a3412;">
            <i class="fa-solid fa-compass-drafting"></i> ${esc(widgetBadge)}
          </span>
          <div style="display:flex;gap:6px;">
            ${
              isMapWidget
                ? `<button type="button" onclick="window.openOcrAncientAtlas && window.openOcrAncientAtlas('${esc(unitId)}', 'KT1')" style="background:#0284c7;border:none;color:#ffffff;border-radius:6px;padding:3px 9px;font-size:0.74rem;font-weight:800;cursor:pointer;">
                    <i class="fa-solid fa-map-location-dot"></i> Live Atlas ↗
                  </button>`
                : ''
            }
            <button type="button" onclick="window.ocrExpandDiagram && window.ocrExpandDiagram('${diagId}', '${esc(widgetTitle || widgetBadge).replace(/'/g, "\\'")}')" style="background:#ffffff;border:1px solid #cbd5e1;color:#334155;border-radius:6px;padding:3px 8px;font-size:0.74rem;font-weight:700;cursor:pointer;">
              <i class="fa-solid fa-magnifying-glass-plus"></i> Zoom
            </button>
          </div>
        </div>
        ${widgetTitle ? `<div style="font-size:0.95rem;font-weight:800;color:#0f172a;margin-bottom:8px;line-height:1.3;">${esc(widgetTitle)}</div>` : ''}
        <div id="${diagId}" onclick="window.ocrExpandDiagram && window.ocrExpandDiagram('${diagId}', '${esc(widgetTitle || widgetBadge).replace(/'/g, "\\'")}')" style="width:100%;overflow:hidden;border-radius:8px;background:#ffffff;cursor:zoom-in;" title="Click to enlarge diagram">${widgetSvg}</div>
        ${widgetCap ? `<div style="margin-top:9px;font-size:0.88rem;line-height:1.5;color:#334155;">${esc(widgetCap)}</div>` : ''}
      </div>
    `;
  }

  const rawImg = block.image || '';
  if (!rawImg) return '';
  const imgUrl = getAssetUrl(rawImg, unitId);
  return `
    <figure style="margin:0;background:#0f172a;border-radius:12px;overflow:hidden;border:1.5px solid #cbd5e1;box-shadow:0 4px 12px rgba(15,23,42,0.08);">
      <div style="background:#0f172a;display:flex;align-items:center;justify-content:center;max-height:290px;padding:8px;">
        <img src="${esc(imgUrl)}" alt="${esc(block.image_alt || block.title || `Visual plate ${beatIdx + 1}`)}" class="archival-image" loading="${beatIdx === 0 ? 'eager' : 'lazy'}" style="width:100%;max-height:274px;object-fit:contain;display:block;cursor:zoom-in;" data-action="open-modal" data-src="${esc(imgUrl)}" data-caption="${esc(block.caption || '')}" />
      </div>
      ${
        block.caption
          ? `<figcaption style="background:#f8fafc;padding:10px 13px;font-size:0.88rem;line-height:1.5;color:#334155;border-top:1px solid #e2e8f0;">
              <div style="margin-bottom:5px;"><span style="display:inline-block;background:#e2e8f0;color:#475569;font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;padding:2px 7px;border-radius:4px;">Context Image</span></div>
              ${esc(block.caption)}
            </figcaption>`
          : ''
      }
    </figure>
  `;
}

function renderWitnessStationHtml(src, sIdx, unitId, isDepth) {
  const domId = `ocr-witness-${sIdx}`;
  const isCoinOrArtefact = Boolean(src.hotspots && (src.image || src.obverse_image));
  const vaultId = `${window.currentUnitData?.lessons?.[window.currentLessonIndex || 0]?.id || 'l1'}_src_${sIdx + 1}`;

  let mediaBodyHtml = '';
  if (isCoinOrArtefact) {
    const obvUrl = getAssetUrl(src.obverse_image || src.image, unitId);
    const hasReverse = Boolean(src.reverse_svg || src.reverse_image);
    const hotspots = Array.isArray(src.hotspots) ? src.hotspots : [];

    mediaBodyHtml = `
      <div class="ocr-artefact-lab" id="${domId}-lab" data-cold-mode="0" style="background:#ffffff;border:1.5px solid #e2e8f0;border-radius:12px;padding:14px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${
              hasReverse
                ? `<button type="button" class="ocr-dock-btn ocr-dock-btn-primary" onclick="window.ocrFlipCoin('${domId}')">
                <i class="fa-solid fa-rotate"></i> <span id="${domId}-flip-lbl">Flip Coin: View Reverse (Athena)</span>
              </button>`
                : ''
            }
            <button type="button" class="ocr-dock-btn" id="${domId}-cold-btn" onclick="window.ocrToggleColdTest('${domId}')">
              <i class="fa-solid fa-crosshairs"></i> <span>Test Me Cold (Hide Clues)</span>
            </button>
          </div>
          <span style="font-size:0.75rem;font-weight:700;color:#64748b;">Tap numbered pins [1]–[${hotspots.length}] to inspect exam evidence</span>
        </div>

        <div style="display:grid;grid-template-columns:minmax(240px,380px) minmax(0,1fr);gap:16px;align-items:center;" class="ocr-beat-grid">
          <div class="ocr-coin-stage">
            <div class="ocr-coin-inner" id="${domId}-coin-inner">
              <div class="ocr-coin-face ocr-coin-obverse">
                <img src="${esc(obvUrl)}" alt="${esc(src.title || 'Ancient Artefact Obverse')}" style="width:100%;height:100%;object-fit:contain;display:block;padding:6px;box-sizing:border-box;" />
                ${hotspots
                  .filter((h) => (h.side || 'obverse') === 'obverse')
                  .map(
                    (h, hIdx) => `
                  <button type="button" class="ocr-hotspot-pin" style="left:${h.x}%;top:${h.y}%;" onclick="window.ocrSelectHotspot('${domId}', ${hIdx})" title="Inspect detail ${hIdx + 1}">${hIdx + 1}</button>
                `,
                  )
                  .join('')}
              </div>
              ${
                hasReverse
                  ? `<div class="ocr-coin-face ocr-coin-reverse">
                  ${
                    src.reverse_svg
                      ? `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:6px;box-sizing:border-box;">${src.reverse_svg}</div>`
                      : `<img src="${esc(getAssetUrl(src.reverse_image, unitId))}" alt="Reverse" style="width:100%;height:100%;object-fit:contain;display:block;padding:6px;box-sizing:border-box;" />`
                  }
                  ${hotspots
                    .map((h, hIdx) => ({ h, hIdx }))
                    .filter(({ h }) => h.side === 'reverse')
                    .map(
                      ({ h, hIdx }) => `
                    <button type="button" class="ocr-hotspot-pin" style="left:${h.x}%;top:${h.y}%;" onclick="window.ocrSelectHotspot('${domId}', ${hIdx})" title="Inspect detail ${hIdx + 1}">${hIdx + 1}</button>
                  `,
                    )
                    .join('')}
                </div>`
                  : ''
              }
            </div>
          </div>

          <div id="${domId}-hotspot-list" style="display:flex;flex-direction:column;gap:8px;">
            ${hotspots
              .map(
                (h, hIdx) => `
              <div class="ocr-hotspot-card" data-hidx="${hIdx}" onclick="window.ocrSelectHotspot('${domId}', ${hIdx})" style="background:${hIdx === 0 ? '#ecfdf5' : '#f8fafc'};border:1.5px solid ${hIdx === 0 ? '#34d399' : '#e2e8f0'};border-radius:10px;padding:9px 12px;cursor:pointer;transition:all 0.15s ease;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                  <span style="font-size:0.9rem;font-weight:800;color:#0f172a;">
                    <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#ea580c;color:#fff;font-size:0.75rem;margin-right:7px;">${hIdx + 1}</span>
                    <span class="ocr-hs-title">${esc(h.label)}</span>
                  </span>
                  <span style="font-size:0.72rem;font-weight:800;text-transform:uppercase;color:#64748b;">${esc(h.side === 'reverse' ? 'Reverse' : 'Obverse')}</span>
                </div>
                <div class="ocr-hs-detail" style="margin-top:6px;font-size:0.9rem;line-height:1.52;color:#1e293b;">
                  ${highlightGreenQuotesHtml(esc(h.detail), [h.microQuote].filter(Boolean))}
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  } else {
    const rawExtract = src.extract || src.text || '';
    const extractHtml = highlightGreenQuotesHtml(esc(rawExtract), src.golden_quotes);
    const fullScenes = Array.isArray(src.full_set_scenes)
      ? src.full_set_scenes
      : Array.isArray(src.full_scenes)
        ? src.full_scenes
        : [];
    const hasFullScenes = fullScenes.length > 0;
    const safeSpeak = String(rawExtract).replace(/'/g, "\\'").replace(/\s+/g, ' ').trim();
    mediaBodyHtml = `
      <div style="background:#ffffff;border:1.5px solid #fde68a;border-radius:12px;padding:14px 16px;margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <span style="font-size:0.72rem;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.04em;">
            <i class="fa-solid fa-quote-left"></i> Hub Classroom Classics™ • Modern-English Exam-Cut Extract
          </span>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" class="ocr-dock-btn" onclick="window.ocrSpeakTerm && window.ocrSpeakTerm('${safeSpeak}')">
              <i class="fa-solid fa-volume-high"></i> Read Source Aloud
            </button>
            ${
              hasFullScenes
                ? `<button type="button" class="ocr-dock-btn ocr-dock-btn-primary" onclick="window.ocrOpenFocusedSceneReader && window.ocrOpenFocusedSceneReader(${sIdx})">
                <i class="fa-solid fa-book-open"></i> Read Full Set Section (${fullScenes.length} Short Scenes) ↗
              </button>`
                : ''
            }
          </div>
        </div>
        <blockquote style="margin:0;font-family:'Lora',Georgia,serif;font-size:1.01rem;line-height:1.68;color:#0f172a;">
          ${extractHtml}
        </blockquote>
      </div>
    `;
  }

  return `
    <div class="ocr-witness-card" id="${domId}">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="background:${isDepth ? '#9a3412' : '#0f766e'};color:#ffffff;font-size:0.72rem;font-weight:800;padding:4px 10px;border-radius:6px;text-transform:uppercase;letter-spacing:0.04em;">
            ${
              isDepth
                ? '★ Prescribed Exam Source'
                : isCoinOrArtefact
                  ? 'Archaeological Evidence'
                  : 'Ancient Evidence'
            }
          </span>
          ${src.prescribed_ref ? `<span style="background:#fef3c7;color:#92400e;border:1px solid #fcd34d;font-size:0.72rem;font-weight:800;padding:3px 9px;border-radius:999px;">${esc(src.prescribed_ref)}</span>` : src.genre_badge ? `<span style="background:#fef3c7;color:#92400e;border:1px solid #fcd34d;font-size:0.72rem;font-weight:800;padding:3px 9px;border-radius:999px;">${esc(src.genre_badge)}</span>` : ''}
        </div>
        ${src.time_gap_label ? `<span style="background:#ffffff;border:1px solid #cbd5e1;color:#334155;font-size:0.76rem;font-weight:700;padding:3px 10px;border-radius:999px;"><i class="fa-solid fa-hourglass-half" style="color:#b45309;margin-right:4px;"></i>${esc(src.time_gap_label)}</span>` : ''}
      </div>

      <h4 style="margin:0 0 6px 0;font-family:'Playfair Display',serif;font-size:1.12rem;color:#0f172a;">
        ${esc(src.citation || src.title || `Source ${sIdx + 1}`)}
      </h4>

      ${
        src.plain_gist
          ? `<div style="background:#fff7ed;border-left:3.5px solid #ea580c;padding:7px 12px;border-radius:0 8px 8px 0;font-size:0.86rem;color:#7c2d12;margin-bottom:10px;">
          <strong>Plain-English Gist:</strong> ${esc(src.plain_gist)}
        </div>`
          : ''
      }

      ${mediaBodyHtml}

      ${
        isDepth && (src.ao3_how_knew || src.ao3_agenda)
          ? `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin-bottom:10px;">
          ${src.ao3_how_knew ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:9px;padding:11px 13px;font-size:0.9rem;line-height:1.52;color:#14532d;"><strong><i class="fa-solid fa-circle-check"></i> How They Knew / Value (AO3):</strong> ${esc(src.ao3_how_knew)}</div>` : ''}
          ${src.ao3_agenda ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:9px;padding:11px 13px;font-size:0.9rem;line-height:1.52;color:#1e3a8a;"><strong><i class="fa-solid fa-masks-theater"></i> Genre &amp; Shaping Agenda (AO3):</strong> ${esc(src.ao3_agenda)}</div>` : ''}
        </div>
      `
          : ''
      }

      ${
        src.question
          ? `
        <details style="background:#ffffff;border:1.5px solid #cbd5e1;border-radius:10px;overflow:hidden;">
          <summary style="padding:10px 14px;cursor:pointer;font-weight:700;font-size:0.9rem;color:#0f172a;display:flex;align-items:center;justify-content:space-between;gap:10px;list-style:none;">
            <span><span style="background:#ecfdf5;color:#047857;border:1px solid #6ee7b7;font-size:0.68rem;font-weight:800;padding:2px 7px;border-radius:999px;margin-right:7px;text-transform:uppercase;">${esc(src.question_badge || 'Quick Source Check')}</span>${esc(src.question)}</span>
            <span style="font-size:0.76rem;font-weight:800;color:#9a3412;white-space:nowrap;">Reveal Green-Quoted Model ▾</span>
          </summary>
          <div style="padding:12px 14px;border-top:1px solid #e2e8f0;background:#f8fafc;font-size:0.9rem;line-height:1.6;color:#1e293b;">
            ${highlightGreenQuotesHtml(esc(src.model_answer || ''), src.golden_quotes)}
          </div>
        </details>
      `
          : ''
      }
    </div>
  `;
}

function renderOcrExamPracticeStationHtml(lesson, unitId, isDepth) {
  const questions = Array.isArray(lesson?.exam_practice)
    ? lesson.exam_practice
    : Array.isArray(lesson?.exam_practice?.questions)
      ? lesson.exam_practice.questions
      : [];
  if (questions.length === 0) return '';

  return `
    <section id="ocr-exam-practice-station" style="background:#ffffff;border:1.5px solid #cbd5e1;border-radius:16px;padding:22px;margin:24px 0;box-shadow:0 4px 16px rgba(15,23,42,0.04);">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-bottom:14px;border-bottom:1.5px solid #e2e8f0;margin-bottom:16px;">
        <div>
          <span style="background:#fff7ed;color:#9a3412;border:1px solid #fdba74;font-size:0.7rem;font-weight:800;padding:3px 9px;border-radius:999px;text-transform:uppercase;letter-spacing:0.05em;">
            Cambridge OCR J198 • ${isDepth ? 'Depth Study Tariffs (5m • 5m • 10m • 20m)' : 'Period Study Tariffs (4m • 6m • 10m • 15m • 20m + 5 SPaG)'}
          </span>
          <h3 style="margin:6px 0 0 0;font-family:'Playfair Display',serif;font-size:1.3rem;color:#0f172a;">
            Exam Practice &amp; Green-Quoted Full-Mark WAGOLLs
          </h3>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="background:#dcfce7;color:#065f46;border:1px solid #86efac;font-size:0.8rem;font-weight:800;padding:5px 10px;border-radius:8px;">
            Green = “Direct Source Quote / Artefact Detail”
          </span>
          <button type="button" class="ocr-dock-btn" id="ocr-toggle-ao-colours-btn" onclick="window.ocrToggleAoBreakdown()">
            <i class="fa-solid fa-palette"></i> <span>Optional: Show AO1/AO2/AO3 Breakdown</span>
          </button>
        </div>
      </div>

      ${
        !isDepth
          ? `<div style="background:#f0fdfa;border:1px solid #99f6e4;border-left:4px solid #0d9488;border-radius:9px;padding:10px 14px;font-size:0.88rem;line-height:1.5;color:#115e59;margin-bottom:14px;">
              <strong><i class="fa-solid fa-bolt"></i> Period-Study Exam Rule (Q3 10m &amp; Q4 15m):</strong> Lift 2–3 short <strong>"direct quotes"</strong> from Passage A and test them with your own knowledge—<strong>no author-provenance evaluation</strong> is required, and you may reuse Q3 quotes in Q4.
            </div>`
          : ''
      }

      <div class="ocr-ao-legend">
        <strong style="color:#0f172a;">AO Colour Key:</strong>
        <span style="background:#dcfce7;color:#065f46;border:1px solid #86efac;padding:2px 8px;border-radius:5px;font-weight:700;">Green = Source Quotes / Artefacts (AO3)</span>
        <span style="background:#dbeafe;color:#1e3a8a;padding:2px 8px;border-radius:5px;font-weight:700;">Blue = Own Historical Knowledge (AO1)</span>
        <span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:5px;font-weight:700;">Amber = Explanation &amp; Verdict (AO2)</span>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px;">
        ${questions
          .map((q, qIdx) => {
            const qId = `${unitId}_${lesson.id || 'l1'}_eq_${qIdx}`;
            const wagollRaw = String(q.model_answer || q.wagoll || '');
            const hasRichHtml = /<(?:p|mark|strong)\b/i.test(wagollRaw);
            const wagollSafe = hasRichHtml
              ? highlightGreenQuotesHtml(wagollRaw, q.golden_quotes)
              : `<p style="margin:0 0 10px 0;">${highlightGreenQuotesHtml(esc(wagollRaw).replace(/\n\n/g, '</p><p style="margin:0 0 10px 0;">'), q.golden_quotes)}</p>`;
            const firstSrc = Array.isArray(q.sources) && q.sources[0] ? q.sources[0] : null;
            const passageText = q.passage_extract || firstSrc?.content || firstSrc?.extract || '';
            const passageImg = firstSrc?.image ? getAssetUrl(firstSrc.image, unitId) : '';
            const passageLabel = q.passage_label || firstSrc?.title || 'Exam Passage / Source Stimulus';
            const tipText = q.examiner_tip || q.exam_tip || '';
            const badgeLbl =
              q.q_type_badge ||
              `${q.q_number ? `${q.q_number} • ` : ''}${q.marks || 5} Marks${q.spag_marks ? ` (+${q.spag_marks} SPaG)` : ''}`;

            return `
              <details style="border:1.5px solid #cbd5e1;border-left:5px solid #9a3412;border-radius:12px;background:#ffffff;overflow:hidden;">
                <summary style="padding:13px 16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;list-style:none;background:#f8fafc;">
                  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                    <span style="background:#9a3412;color:#ffffff;font-size:0.74rem;font-weight:800;padding:4px 9px;border-radius:6px;white-space:nowrap;">
                      ${esc(badgeLbl)}
                    </span>
                    <span style="font-weight:800;font-size:0.95rem;color:#0f172a;white-space:pre-line;">${esc(q.question)}</span>
                  </div>
                  <span style="font-size:0.76rem;font-weight:800;color:#9a3412;white-space:nowrap;">Practise &amp; WAGOLL ▾</span>
                </summary>

                <div style="padding:16px;">
                  ${
                    tipText
                      ? `<div style="background:#eff6ff;border-left:3.5px solid #2563eb;padding:9px 13px;border-radius:0 8px 8px 0;font-size:0.88rem;line-height:1.5;color:#1e3a8a;margin-bottom:14px;">
                      <strong><i class="fa-solid fa-compass"></i> OCR Examiner Strategy:</strong> ${esc(tipText)}
                    </div>`
                      : ''
                  }

                  <div class="${passageText || passageImg ? 'ocr-passage-split' : ''}">
                    ${
                      passageText || passageImg
                        ? `<div class="ocr-passage-sticky" style="background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:13px 15px;">
                        <div style="font-size:0.74rem;font-weight:800;color:#92400e;text-transform:uppercase;margin-bottom:5px;">${esc(passageLabel)}</div>
                        ${firstSrc?.provenance ? `<div style="font-size:0.82rem;color:#78350f;font-style:italic;margin-bottom:7px;">${esc(firstSrc.provenance)}</div>` : ''}
                        ${passageImg ? `<img src="${esc(passageImg)}" alt="${esc(passageLabel)}" style="max-height:200px;object-fit:contain;border-radius:8px;margin-bottom:8px;display:block;background:#0f172a;padding:6px;" />` : ''}
                        ${passageText ? `<div style="font-family:'Lora',Georgia,serif;font-size:0.97rem;line-height:1.65;color:#1e293b;">${highlightGreenQuotesHtml(esc(passageText))}</div>` : ''}
                      </div>`
                        : ''
                    }

                    <div>
                      <details style="margin-bottom:10px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:10px 14px;">
                        <summary style="cursor:pointer;font-weight:800;font-size:0.86rem;color:#334155;display:flex;align-items:center;justify-content:space-between;gap:8px;list-style:none;">
                          <span><i class="fa-solid fa-laptop" style="color:#475569;margin-right:6px;"></i> Draft Your Answer on Screen (Optional — Laptop / Revision)</span>
                          <span style="font-size:0.74rem;color:#64748b;font-weight:700;">Open Typing Box ▾</span>
                        </summary>
                        <div style="margin-top:10px;">
                          <textarea id="${esc(qId)}_input" rows="5" oninput="window.ocrCheckExaminerTraps('${esc(qId)}')" placeholder="Draft your answer here — put short direct quotes from the source inside &quot;quotation marks&quot;..." style="width:100%;box-sizing:border-box;border:1.5px solid #cbd5e1;border-radius:10px;padding:10px 12px;font-size:16px;font-family:inherit;line-height:1.5;background:#ffffff;"></textarea>
                          <div id="${esc(qId)}_trap_alert" style="display:none;margin-top:8px;background:#fef2f2;border:1.5px solid #f87171;border-radius:8px;padding:9px 12px;font-size:0.86rem;color:#991b1b;"></div>
                        </div>
                      </details>

                      <details style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:11px 14px;">
                        <summary style="cursor:pointer;font-weight:800;font-size:0.88rem;color:#065f46;">
                          <i class="fa-solid fa-award"></i> Reveal Full-Mark Level 5 / Level 3 WAGOLL (Green = Source Support)
                        </summary>
                        <div class="ocr-wagoll-prose" style="margin-top:10px;font-family:'Lora',Georgia,serif;font-size:0.98rem;line-height:1.7;color:#0f172a;">
                          ${wagollSafe}
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </details>
            `;
          })
          .join('')}
      </div>
    </section>
  `;
}

export function renderAncientLesson(lesson, unitData, unitId) {
  ensureAncientLessonStyles();
  const contentArea = document.getElementById('content-area') || document.getElementById('main-content');
  if (!contentArea || !lesson) return;

  const isDepth = Boolean(
    unitData?.is_ocr_depth_study || unitId === 'ocr_alexander' || unitId === 'ocr_cleopatra',
  );
  const blocks = Array.isArray(lesson.narrative_blocks) ? lesson.narrative_blocks : [];
  const stages = Array.isArray(lesson.workbook_stages) ? lesson.workbook_stages : [];
  const sources = Array.isArray(lesson.sources) ? lesson.sources : [];
  const vocab = Array.isArray(lesson.vocab) ? lesson.vocab : [];

  // Register stages for Classroom Spotlight 1-to-1 compatibility
  try {
    registerActiveLessonStages(lesson, unitId);
  } catch (_) {}

  // Group sources by which story beat they dock beneath (via inlineSourceIds OR docked_at_stage)
  const sourcesByBeat = new Map();
  const explicitlyPlacedIdx = new Set();
  blocks.forEach((b, bIdx) => {
    if (Array.isArray(b.inlineSourceIds)) {
      b.inlineSourceIds.forEach((sid) => {
        const hitIdx = sources.findIndex((s) => s && s.id === sid);
        if (hitIdx !== -1) {
          explicitlyPlacedIdx.add(hitIdx);
          const beatNum = bIdx + 1;
          if (!sourcesByBeat.has(beatNum)) sourcesByBeat.set(beatNum, []);
          sourcesByBeat.get(beatNum).push({ src: sources[hitIdx], idx: hitIdx });
        }
      });
    }
  });
  sources.forEach((s, idx) => {
    if (explicitlyPlacedIdx.has(idx)) return;
    const beatNum = Number(s.docked_at_stage || s.dockedAtStage || Math.min(blocks.length || 1, idx + 2));
    if (!sourcesByBeat.has(beatNum)) sourcesByBeat.set(beatNum, []);
    sourcesByBeat.get(beatNum).push({ src: s, idx });
  });

  const spagWords = vocab
    .filter((v) => v && v.term)
    .slice(0, 6);

  const html = `
    <div class="ocr-ancient-shell" id="ocr-lesson-root">
      <!-- Classical Hero Header -->
      <header class="ocr-hero-card">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span style="background:rgba(255,255,255,0.16);border:1px solid rgba(254,215,170,0.45);color:#ffedd5;font-size:0.68rem;font-weight:800;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:0.06em;">
              ${esc(unitData?.paper_code || 'Cambridge OCR J198')} • ${isDepth ? 'Depth Study (Prescribed Set Sources)' : 'Compulsory Period Study'}
            </span>
            ${lesson.dates_badge ? `<span style="background:#ea580c;color:#ffffff;font-size:0.7rem;font-weight:800;padding:3px 9px;border-radius:999px;">${esc(lesson.dates_badge)}</span>` : ''}
          </div>
          <span style="font-size:0.7rem;color:#fed7aa;opacity:0.92;">Independent Hub Resource • Aligned to OCR J198</span>
        </div>

        <div style="font-size:0.86rem;font-weight:700;color:#fed7aa;margin-bottom:4px;">${esc(lesson.title || '')}</div>
        <h1 style="margin:0;font-family:'Playfair Display',serif;font-size:clamp(1.38rem,3.2vw,1.95rem);line-height:1.24;color:#ffffff;font-weight:800;">
          ${esc(lesson.enquiry || lesson.enquiry_question || lesson.title || '')}
        </h1>
        <div style="margin-top:10px;padding-top:9px;border-top:1px solid rgba(254,215,170,0.28);font-size:0.82rem;color:#ffedd5;line-height:1.45;">
          ${
            isDepth
              ? '<strong>Exam Source Guide:</strong> <span style="background:#ea580c;color:#fff;padding:1px 6px;border-radius:4px;font-weight:800;">★ Prescribed Exam Sources</span> are official OCR set texts &amp; coins that can appear on your paper &amp; 20m essay &bull; <strong>Context Images</strong> support your reading.'
              : '<strong>Exam Source Guide:</strong> Section A Period Studies test an <strong>unseen ancient passage</strong> on exam day &bull; Use the <span style="background:#0f766e;color:#fff;padding:1px 6px;border-radius:4px;font-weight:800;">Ancient Evidence</span> below to build subject knowledge &amp; practise quoting.'
          }
        </div>
      </header>

      <!-- Sticky 1-Row Classroom Dock -->
      <div class="ocr-sticky-dock" style="gap:6px;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          ${
            lesson.do_now
              ? `<button type="button" id="ocr-btn-donow" class="ocr-dock-btn" onclick="window.ocrToggleDoNowDrawer && window.ocrToggleDoNowDrawer()">
              <i class="fa-solid fa-bolt" style="color:#d97706;"></i> <span>Do Now (${Array.isArray(lesson.do_now) ? lesson.do_now.length : 5})</span>
            </button>`
              : ''
          }
          <button type="button" class="ocr-dock-btn ocr-dock-btn-primary" onclick="window.openClassroomSpotlight && window.openClassroomSpotlight(0)">
            <i class="fa-solid fa-chalkboard-user"></i> <span>Spotlight</span>
          </button>
          <button type="button" class="ocr-dock-btn" onclick="window.openOcrAncientAtlas && window.openOcrAncientAtlas('${esc(unitId)}', 'KT1')" style="border-color:#0284c7;color:#0369a1;background:#f0f9ff;">
            <i class="fa-solid fa-map-location-dot"></i> <span>Atlas Map</span>
          </button>
          <button type="button" class="ocr-dock-btn" onclick="window.switchView && window.switchView('timeline', '${esc(unitId)}')">
            <i class="fa-solid fa-clock-rotate-left"></i> <span>Timeline</span>
          </button>
          <button type="button" id="ocr-btn-pron" class="ocr-dock-btn" onclick="window.ocrTogglePronunciationDrawer()">
            <i class="fa-solid fa-language"></i> <span>${isDepth ? `Pronunciation (${spagWords.length})` : `SPaG (${spagWords.length})`}</span>
          </button>
          <button type="button" class="ocr-dock-btn" onclick="window.openOcrVaultFromLesson('')">
            <i class="fa-solid fa-scroll"></i> <span>${isDepth ? `Set Sources (${sources.length})` : `Authors`}</span>
          </button>
          ${
            isStaffModeActive()
              ? `<button type="button" class="ocr-dock-btn" onclick="window.openUnifiedTeacherGuidance && window.openUnifiedTeacherGuidance('${esc(unitId)}', ${Number(window.currentLessonIndex || 0)})">
              <i class="fa-solid fa-clipboard-list"></i> <span>2-Lesson Plan</span>
            </button>`
              : ''
          }
          <a href="#ocr-exam-practice-station" class="ocr-dock-btn" style="text-decoration:none;">
            <i class="fa-solid fa-pen-nib"></i> <span>Exam Qs ↓</span>
          </a>
        </div>
      </div>

      <!-- Collapsible Classical Pronunciation & 5-Mark SPaG Spelling Studio -->
      <div id="ocr-pronunciation-drawer" style="display:none;background:#fff7ed;border:1.5px solid #fdba74;border-radius:14px;padding:15px 18px;margin-bottom:18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
          <div>
            <strong style="font-size:0.9rem;color:#7c2d12;"><i class="fa-solid fa-volume-high"></i> Tap-to-Hear Classical Pronunciation &amp; Q5 SPaG Spelling Studio</strong>
            <div style="font-size:0.78rem;color:#9a3412;">Tap any term to hear it spoken aloud, or launch the 60-second specialist spelling check.</div>
          </div>
          <button type="button" class="ocr-dock-btn ocr-dock-btn-primary" onclick="window.ocrStartSpagSprint()">
            <i class="fa-solid fa-bolt"></i> Test My Ancient Spellings
          </button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;">
          ${vocab
            .map((v) => {
              const safeT = String(v.term || '').replace(/'/g, "\\'");
              return `
                <button type="button" onclick="window.ocrSpeakTerm('${safeT}')" style="text-align:left;background:#ffffff;border:1px solid #fed7aa;border-radius:9px;padding:8px 11px;cursor:pointer;">
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                    <strong style="font-size:0.86rem;color:#0f172a;">${esc(v.term)}</strong>
                    <i class="fa-solid fa-volume-high" style="color:#ea580c;font-size:0.78rem;"></i>
                  </div>
                  ${(v.pronunciation || v.phonetic) ? `<div style="font-size:0.73rem;font-weight:700;color:#c2410c;margin-top:2px;">[${esc(v.pronunciation || v.phonetic)}]</div>` : ''}
                  <div style="font-size:0.76rem;color:#475569;margin-top:3px;line-height:1.38;">${esc(v.definition)}</div>
                </button>
              `;
            })
            .join('')}
        </div>
        <div id="ocr-spag-sprint-box" style="display:none;margin-top:12px;background:#ffffff;border:1.5px solid #ea580c;border-radius:10px;padding:12px 14px;"></div>
      </div>

      <!-- Collapsible Spaced-Retrieval Do Now Starter (Closed by Default so Story Beat 1 Sits Above the Fold) -->
      ${
        lesson.do_now
          ? `<section id="ocr-donow-drawer" style="display:none;background:#ffffff;border:1.5px solid #cbd5e1;border-radius:14px;padding:16px 18px;margin-bottom:20px;box-shadow:0 4px 16px rgba(15,23,42,0.06);">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;">
                <div style="font-size:0.82rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#1e3a8a;display:flex;align-items:center;gap:7px;">
                  <i class="fa-solid fa-bolt" style="color:#f59e0b;"></i> Spaced Retrieval Starter (Do Now)
                </div>
                <button type="button" onclick="window.ocrToggleDoNowDrawer && window.ocrToggleDoNowDrawer()" style="background:#f1f5f9;border:1px solid #cbd5e1;color:#334155;border-radius:6px;padding:4px 10px;font-size:0.78rem;font-weight:700;cursor:pointer;">✕ Close</button>
              </div>
              ${renderGcseDoNowPanelHTML({ activeUnit: unitData, lesson, unitId, db: typeof window !== 'undefined' ? window.db : null })}
            </section>`
          : ''
      }

      <!-- Interleaved 5-Beat Story ↔ Ancient Witness Spine -->
      ${blocks
        .map((block, bIdx) => {
          const stg = stages[bIdx] || {};
          const beatNum = bIdx + 1;
          const isReversed = bIdx % 2 === 1;
          const dockedList = sourcesByBeat.get(beatNum) || [];
          const proseHtml = formatNarrativeProseHtml(block.text || block.content || '', vocab);
          const visualHtml = renderVisualAnchorHtml(block, unitId, bIdx);

          return `
            <article class="ocr-beat-station" id="narrative-block-${beatNum}" data-stage-num="${beatNum}">
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px;padding-bottom:9px;border-bottom:1px solid #f1f5f9;">
                <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;">
                  <span style="background:#9a3412;color:#ffffff;font-size:0.7rem;font-weight:800;padding:3px 9px;border-radius:6px;text-transform:uppercase;letter-spacing:0.05em;">
                    ${esc(block.beat_badge || `Story Beat ${beatNum}`)}${stg.date ? ` • ${esc(stg.date)}` : ''}
                  </span>
                  <h2 style="margin:0;font-family:'Playfair Display',serif;font-size:1.18rem;color:#0f172a;font-weight:800;">
                    ${esc(block.title || stg.title || `Stage ${beatNum}`)}
                  </h2>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                  ${renderStageSpotlightBtnHTML(bIdx)}
                </div>
              </div>

              <div class="ocr-beat-grid ${isReversed ? 'is-reversed' : ''}">
                ${isReversed ? `${visualHtml}<div>${proseHtml}</div>` : `<div>${proseHtml}</div>${visualHtml}`}
              </div>

              ${
                block.hollywood_myth_buster
                  ? `<div style="margin-top:14px;background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #dc2626;border-radius:9px;padding:11px 14px;font-size:0.93rem;line-height:1.55;color:#7f1d1d;">
                  <strong><i class="fa-solid fa-film"></i> Hollywood vs Ancient Evidence:</strong> ${
                    typeof block.hollywood_myth_buster === 'object'
                      ? `<em>Myth:</em> ${esc(block.hollywood_myth_buster.myth || '')} &mdash; <strong>Evidence:</strong> ${esc(block.hollywood_myth_buster.reality || '')}`
                      : esc(block.hollywood_myth_buster)
                  }
                </div>`
                  : ''
              }

              ${
                block.myth_vs_spade
                  ? `<div style="margin-top:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
                  <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;padding:12px 14px;font-size:0.93rem;line-height:1.55;color:#78350f;">
                    <strong><i class="fa-solid fa-scroll"></i> ${esc(block.myth_vs_spade.literary_label || 'Literary Tradition Claims')}:</strong> ${esc(block.myth_vs_spade.myth || block.myth_vs_spade.literary_claim || '')}
                  </div>
                  <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:10px;padding:12px 14px;font-size:0.93rem;line-height:1.55;color:#14532d;">
                    <strong><i class="fa-solid fa-trowel"></i> ${esc(block.myth_vs_spade.archaeology_label || 'What Archaeology / Cuneiform Proves')}:</strong> ${esc(block.myth_vs_spade.spade || block.myth_vs_spade.archaeology_fact || '')}
                  </div>
                </div>`
                  : ''
              }

              ${
                stg.question
                  ? `
                <details style="margin-top:14px;background:#f8fafc;border:1.5px solid #cbd5e1;border-left:4px solid #2563eb;border-radius:10px;overflow:hidden;">
                  <summary style="padding:9px 13px;cursor:pointer;font-size:0.89rem;font-weight:700;color:#0f172a;display:flex;align-items:center;justify-content:space-between;gap:10px;list-style:none;">
                    <span><strong style="color:#1d4ed8;margin-right:6px;">Check Beat ${beatNum}:</strong> ${esc(stg.question)}</span>
                    <span style="font-size:0.75rem;font-weight:800;color:#1d4ed8;white-space:nowrap;">Check Answer ▾</span>
                  </summary>
                  <div style="padding:10px 13px;border-top:1px solid #e2e8f0;background:#ffffff;font-size:0.88rem;line-height:1.55;color:#1e293b;">
                    ${esc(stg.model_sentence || stg.summary || '')}
                  </div>
                </details>
              `
                  : ''
              }

              ${dockedList.map(({ src, idx }) => renderWitnessStationHtml(src, idx, unitId, isDepth)).join('')}
            </article>
          `;
        })
        .join('')}

      <!-- OCR J198 Exam Station -->
      ${renderOcrExamPracticeStationHtml(lesson, unitId, isDepth)}

      <!-- Consolidate Station (Vocab Cloze, Flashcards & 20-Question Retrieval Quiz) -->
      ${renderConsolidateStationHTML(lesson)}
    </div>
  `;

  contentArea.innerHTML = html;

  // Bind interactive controllers
  try {
    initGcseDoNowEngine({ activeUnit: unitData, lesson, unitId });
  } catch (_) {}
  try {
    initConsolidateStation(lesson);
  } catch (_) {}
  try {
    const lessonIdx = Array.isArray(unitData?.lessons)
      ? Math.max(0, unitData.lessons.findIndex((l) => l === lesson || (l && lesson.id && l.id === lesson.id)))
      : Number(window.currentLessonIndex || 0);
    initLaptopModeForLesson({
      container: contentArea,
      unitData,
      unitId,
      lesson,
      lessonIndex: lessonIdx,
    });
  } catch (_) {}

  window._ocrActiveLessonVocab = vocab;
  window._ocrActiveLessonSources = sources;
  window._ocrActiveUnitId = unitId;
  window._ocrActiveUnitData = unitData;
}

if (typeof window !== 'undefined') {
  window.ocrToggleDoNowDrawer = function () {
    const el = document.getElementById('ocr-donow-drawer');
    const pron = document.getElementById('ocr-pronunciation-drawer');
    const btn = document.getElementById('ocr-btn-donow');
    if (!el) return;
    const opening = el.style.display === 'none';
    el.style.display = opening ? 'block' : 'none';
    if (opening && pron) pron.style.display = 'none';
    if (btn) {
      btn.style.background = opening ? '#fef3c7' : '';
      btn.style.borderColor = opening ? '#d97706' : '';
    }
  };

  window.ocrOpenFocusedSceneReader = function (srcIdx) {
    const src = (window._ocrActiveLessonSources || [])[srcIdx];
    if (!src) return;
    const scenes = Array.isArray(src.full_set_scenes)
      ? src.full_set_scenes
      : Array.isArray(src.full_scenes)
        ? src.full_scenes
        : [];
    if (scenes.length === 0) return;

    document.getElementById('ocr-focused-scene-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'ocr-focused-scene-modal';
    modal.style.cssText =
      'position:fixed;inset:0;z-index:10065;background:rgba(15,23,42,0.72);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;';

    const readerId = `focused_src_${srcIdx}`;
    modal.innerHTML = `
      <div style="background:#ffffff;border-radius:16px;width:100%;max-width:860px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.45);border:1.5px solid #e2e8f0;">
        <div style="background:linear-gradient(135deg,#431407 0%,#7c2d12 55%,#9a3412 100%);color:#ffffff;padding:16px 22px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#fed7aa;margin-bottom:3px;">
              ★ Prescribed Set Text • Full Scene-by-Scene Modern English
            </div>
            <h3 style="margin:0;font-family:'Playfair Display',serif;font-size:1.24rem;color:#ffffff;">${esc(src.citation || src.title || 'Set Text')}</h3>
          </div>
          <button type="button" id="ocr-focused-close" style="background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.35);color:#ffffff;padding:7px 14px;border-radius:8px;font-weight:800;font-size:0.84rem;cursor:pointer;">✕ Close</button>
        </div>
        <div class="ocr-scene-tabs-wrap" data-vault-scenes="${readerId}" style="display:flex;flex-direction:column;flex:1;overflow:hidden;">
          <div style="background:#ffffff;border-bottom:2px solid #e2e8f0;padding:0 22px;display:flex;gap:4px;flex-wrap:wrap;flex-shrink:0;">
            ${scenes
              .map(
                (sc, idx) => `
              <button type="button" class="ocr-scene-tab-btn" data-scene-idx="${idx}" onclick="window.ocrSwitchVaultScene('${readerId}', ${idx})" style="padding:11px 14px;border:none;border-bottom:3px solid ${idx === 0 ? '#9a3412' : 'transparent'};margin-bottom:-2px;background:transparent;font-size:0.85rem;font-weight:800;cursor:pointer;color:${idx === 0 ? '#9a3412' : '#475569'};">
                ${esc(sc.tab || sc.label || `Scene ${idx + 1}`)}
              </button>
            `,
              )
              .join('')}
          </div>
          <div style="padding:20px 24px;overflow-y:auto;flex:1;background:#f8fafc;">
            ${scenes
              .map(
                (sc, idx) => `
              <div class="ocr-scene-panel" data-scene-panel="${idx}" style="display:${idx === 0 ? 'block' : 'none'};background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 22px;font-family:'Lora',Georgia,serif;font-size:1.03rem;line-height:1.75;color:#1e293b;">
                ${sc.heading ? `<div style="font-family:'Inter',sans-serif;font-weight:800;font-size:0.92rem;color:#9a3412;margin-bottom:10px;">${esc(sc.heading)}</div>` : ''}
                ${highlightGreenQuotesHtml(esc(sc.text || ''), src.golden_quotes)}
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    const closeFocused = () => {
      document.removeEventListener('keydown', onEsc);
      modal.remove();
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') closeFocused();
    };
    document.addEventListener('keydown', onEsc);
    modal.querySelector('#ocr-focused-close')?.addEventListener('click', closeFocused);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeFocused();
    });
    document.body.appendChild(modal);
  };

  window.ocrExpandDiagram = function (diagId, title = 'Historical Diagram') {
    const srcEl = document.getElementById(diagId);
    if (!srcEl) return;
    document.getElementById('ocr-diagram-zoom-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'ocr-diagram-zoom-modal';
    modal.style.cssText =
      'position:fixed;inset:0;z-index:10060;background:rgba(15,23,42,0.82);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
    modal.innerHTML = `
      <div style="background:#ffffff;border-radius:16px;max-width:960px;width:100%;padding:20px 22px;box-shadow:0 24px 60px rgba(0,0,0,0.45);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;">
          <h3 style="margin:0;font-family:'Playfair Display',serif;font-size:1.25rem;color:#0f172a;">${esc(title)}</h3>
          <button type="button" onclick="document.getElementById('ocr-diagram-zoom-modal')?.remove()" style="background:#0f172a;color:#ffffff;border:none;border-radius:8px;padding:7px 14px;font-weight:800;font-size:0.84rem;cursor:pointer;">✕ Close</button>
        </div>
        <div style="width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;">${srcEl.innerHTML}</div>
      </div>
    `;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
  };
  window.ocrSpeakTerm = function (text) {
    if (!text || typeof window.speechSynthesis === 'undefined') return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'en-GB';
      u.rate = 0.94;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  };

  window.ocrTogglePronunciationDrawer = function () {
    const el = document.getElementById('ocr-pronunciation-drawer');
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  };

  window.ocrStartSpagSprint = function () {
    const box = document.getElementById('ocr-spag-sprint-box');
    const vocab = (window._ocrActiveLessonVocab || []).filter((v) => v && v.term);
    if (!box || vocab.length === 0) return;
    box.style.display = 'block';
    let idx = 0;

    const renderStep = () => {
      const item = vocab[idx];
      const safeDef = esc(item.definition || '');
      const safeTerm = String(item.term || '');
      const hintMask = `${safeTerm[0]}${' _'.repeat(Math.max(2, safeTerm.length - 2))} ${safeTerm[safeTerm.length - 1]}`;
      box.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:0.75rem;font-weight:800;color:#9a3412;text-transform:uppercase;">Q5 SPaG Specialist Spelling ${idx + 1} of ${vocab.length}</span>
          <button type="button" class="ocr-dock-btn" onclick="window.ocrSpeakTerm('${safeTerm.replace(/'/g, "\\'")}')"><i class="fa-solid fa-volume-high"></i> Hear Word Again</button>
        </div>
        <div style="font-size:0.86rem;color:#1e293b;margin-bottom:8px;"><strong>Clue:</strong> ${safeDef} <span style="color:#64748b;">(Shape: <code>${esc(hintMask)}</code>)</span></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <input id="ocr-spag-input" type="text" autocomplete="off" spellcheck="false" placeholder="Type exact ancient spelling..." style="flex:1;min-width:200px;padding:8px 11px;font-size:16px;border:1.5px solid #cbd5e1;border-radius:8px;" />
          <button type="button" id="ocr-spag-check-btn" class="ocr-dock-btn ocr-dock-btn-primary">Check Spelling</button>
        </div>
        <div id="ocr-spag-feedback" style="margin-top:8px;font-size:0.84rem;font-weight:700;"></div>
      `;
      window.ocrSpeakTerm(safeTerm);
      const inp = box.querySelector('#ocr-spag-input');
      const fb = box.querySelector('#ocr-spag-feedback');
      const check = () => {
        const val = (inp?.value || '').trim();
        if (!val) return;
        if (val.toLowerCase() === safeTerm.toLowerCase()) {
          fb.style.color = '#15803d';
          fb.innerHTML = `✅ Spot on! <strong>${esc(safeTerm)}</strong> — locked in for 5-mark SPaG.`;
          setTimeout(() => {
            idx = (idx + 1) % vocab.length;
            renderStep();
          }, 1100);
        } else {
          fb.style.color = '#b91c1c';
          fb.innerHTML = `Almost! Exact spelling: <strong>${esc(safeTerm)}</strong> ${item.pronunciation ? `[${esc(item.pronunciation)}]` : ''} — type it once more to lock it in.`;
        }
      };
      box.querySelector('#ocr-spag-check-btn')?.addEventListener('click', check);
      inp?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') check();
      });
      inp?.focus();
    };
    renderStep();
  };

  window.ocrFlipCoin = function (domId) {
    const inner = document.getElementById(`${domId}-coin-inner`);
    const lbl = document.getElementById(`${domId}-flip-lbl`);
    if (!inner) return;
    const flipped = inner.classList.toggle('is-flipped');
    if (lbl) {
      lbl.textContent = flipped
        ? 'Flip Coin: View Obverse (Alexander)'
        : 'Flip Coin: View Reverse (Athena)';
    }
  };

  window.ocrToggleColdTest = function (domId) {
    const lab = document.getElementById(`${domId}-lab`);
    const btn = document.getElementById(`${domId}-cold-btn`);
    if (!lab) return;
    const nextCold = lab.getAttribute('data-cold-mode') !== '1';
    lab.setAttribute('data-cold-mode', nextCold ? '1' : '0');
    lab.querySelectorAll('.ocr-hs-detail').forEach((d) => {
      d.style.filter = nextCold ? 'blur(6px)' : 'none';
      d.title = nextCold ? 'Tap card to reveal clue' : '';
    });
    if (btn) {
      btn.innerHTML = nextCold
        ? '<i class="fa-solid fa-eye"></i> <span>Reveal All Artefact Clues</span>'
        : '<i class="fa-solid fa-crosshairs"></i> <span>Test Me Cold (Hide Clues)</span>';
    }
  };

  window.ocrSelectHotspot = function (domId, hIdx) {
    const lab = document.getElementById(`${domId}-lab`);
    const inner = document.getElementById(`${domId}-coin-inner`);
    if (!lab) return;
    lab.querySelectorAll('.ocr-hotspot-card').forEach((card) => {
      const match = Number(card.getAttribute('data-hidx')) === Number(hIdx);
      card.style.background = match ? '#ecfdf5' : '#f8fafc';
      card.style.borderColor = match ? '#34d399' : '#e2e8f0';
      if (match) {
        const det = card.querySelector('.ocr-hs-detail');
        if (det) det.style.filter = 'none';
        const isRev = card.textContent.includes('Reverse');
        if (inner) {
          inner.classList.toggle('is-flipped', isRev);
        }
      }
    });
  };

  window.ocrToggleAoBreakdown = function () {
    const st = document.getElementById('ocr-exam-practice-station');
    if (!st) return;
    const on = st.classList.toggle('ocr-ao-mode-active');
    const btn = document.getElementById('ocr-toggle-ao-colours-btn');
    if (btn) {
      btn.innerHTML = on
        ? '<i class="fa-solid fa-eye-slash"></i> <span>Hide AO1/AO2/AO3 Breakdown (Green Quotes Only)</span>'
        : '<i class="fa-solid fa-palette"></i> <span>Optional: Show AO1/AO2/AO3 Breakdown</span>';
    }
  };

  window.ocrCheckExaminerTraps = function (qId) {
    const inp = document.getElementById(`${qId}_input`);
    const alertEl = document.getElementById(`${qId}_trap_alert`);
    if (!inp || !alertEl) return;
    const val = inp.value || '';
    const hits = REDUCTIVE_TRAPS.filter((t) => t.rx.test(val));
    if (hits.length === 0) {
      alertEl.style.display = 'none';
      alertEl.innerHTML = '';
      return;
    }
    alertEl.style.display = 'block';
    alertEl.innerHTML = hits
      .map(
        (h) =>
          `<div style="margin-bottom:4px;"><strong>⚠️ OCR Examiner Trap Detected (${esc(h.bad)}):</strong> ${esc(h.fix)}</div>`,
      )
      .join('');
  };

  window.openOcrVaultFromLesson = function (focusVaultId = '') {
    openPrescribedSourcesVaultModal(
      window._ocrActiveUnitId || window.currentUnitId,
      window._ocrActiveUnitData || window.currentUnitData,
      focusVaultId ? 'sources' : '',
      focusVaultId,
    );
  };
}
