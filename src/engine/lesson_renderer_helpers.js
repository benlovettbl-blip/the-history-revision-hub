import { cleanQuestionText } from '../data_parser.js';
import { generateKeyIndividualEmbedHTML } from '../key_individuals.js';
import { appStore } from './store.js';
import { getAssetUrl } from './assets.js';
import { WORKBOOK_PAGE_MAP, getWorkbookPageAnchor } from './workbook_page_map.js';
import { renderAudioPlaybackBar } from './speech.js';
import {
  parseDurationToSeconds,
  formatShortDuration,
  formatProminentDuration,
  cleanVideoDisplayTitle,
  getSortedLessonVideos,
  formatInteractiveTimestamps,
} from './video_utils.js';
import { isStaffModeActive } from '../data/unit_resources_catalog.js';
import { renderConsolidateStationHTML, initConsolidateStation } from './lesson_consolidate_station.js';
import {
  renderLessonExamPracticeHTML,
  initLessonExamPractice,
  registerUnifiedExamQuestion,
  getNonDuplicateExtraMockQuestions,
  getCanonicalGcsePaperCode,
  getRecommendedExamMins,
  renderInlineTaskTimerBarHTML,
} from './lesson_exam_practice_panel.js';
import { getLessonMockQuestions } from './mock_exam_bank_data.js';
import { buildComprehensiveVocabDict, highlightGlossaryInProse } from './disciplinary_glossary.js';
import {
  createLessonNarrativeAnnotator,
  formatVisualPlateCaption,
} from './narrative_annotator.js';
import { renderGcseDoNowPanelHTML, initGcseDoNowEngine } from './gcse_donow_engine.js';
import { getLessonInfographicCount, getLessonInfographicsSync } from '../infographic_viewer.js';
import { updateLeitnerBox, generateQuestionId } from '../storage.js';


// Canonical Key Stage Taxonomy Constants
export const KS2_CANONICAL_UNITS = [
  'ks2_stone_to_iron_age',
  'ks2_romans',
  'ks2_anglo_saxons_vikings',
  'ks2_ww2',
  'ks2_ancient_egypt',
  'ks2_ancient_greece',
  'ks2_early_islamic_baghdad',
  'ks2_maya_civilisation',
];
export const KS3_CANONICAL_UNITS = [
  'medieval_england',
  'monarchy_religion_power',
  'first_british_empire',
  'second_british_empire',
  'industrialisation_and_empire',
  'great_war',
  'great_war_part2',
  'australia',
  'post_war_britain',
  'the_shoah',
  'water_and_sanitation',
  'cold_war',
];
export const GCSE_CANONICAL_UNITS = [
  'cme_new',
  'gcse_cold_war',
  'edexcel_medicine',
  'eee',
  'weimar_nazi_germany',
  'usa',
];

export const isGCSEInteractiveUnit = (uId) =>
  GCSE_CANONICAL_UNITS.includes(uId);

export function getWbThinStripStylesHTML() {
  return `
    <style id="wb-thin-strip-styles">
      .wb-unified-station {
        margin: 18px 0 !important;
        border: 1.5px solid #cbd5e1 !important;
        border-radius: 12px !important;
        background: #ffffff !important;
        overflow: hidden !important;
        box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04) !important;
        padding: 0 !important;
      }
      .wb-station-header {
        padding: 11px 18px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
      .wb-strips-stack {
        padding: 10px 14px;
        display: flex;
        flex-direction: column;
        gap: 7px;
        background: #f8fafc;
      }
      details.wb-question-strip,
      details.wb-thin-strip {
        border-radius: 8px;
        overflow: hidden;
        margin: 0;
        background: #ffffff;
        transition: box-shadow 0.15s ease, border-color 0.15s ease;
      }
      details.wb-question-strip > summary,
      details.wb-thin-strip > summary {
        list-style: none;
        cursor: pointer;
        user-select: none;
        padding: 9px 13px;
        min-height: 40px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        outline: none;
        transition: background 0.15s ease;
      }
      details.wb-question-strip > summary::-webkit-details-marker,
      details.wb-thin-strip > summary::-webkit-details-marker {
        display: none;
      }
      details.wb-question-strip.wb-strip-green,
      details.wb-thin-strip.wb-strip-green {
        border: 1.5px solid #a7f3d0;
        border-left: 4.5px solid #10b981;
      }
      details.wb-question-strip.wb-strip-green > summary,
      details.wb-thin-strip.wb-strip-green > summary {
        background: #f0fdf4;
      }
      details.wb-question-strip.wb-strip-green > summary:hover,
      details.wb-thin-strip.wb-strip-green > summary:hover {
        background: #dcfce7;
      }
      details.wb-question-strip.wb-strip-green[open] > summary,
      details.wb-thin-strip.wb-strip-green[open] > summary {
        background: #ecfdf5;
        border-bottom: 1px solid #bbf7d0;
      }
      details.wb-question-strip.wb-strip-blue,
      details.wb-thin-strip.wb-strip-blue {
        border: 1.5px solid #bfdbfe;
        border-left: 4.5px solid #2563eb;
      }
      details.wb-question-strip.wb-strip-blue > summary,
      details.wb-thin-strip.wb-strip-blue > summary {
        background: #eff6ff;
      }
      details.wb-question-strip.wb-strip-blue > summary:hover,
      details.wb-thin-strip.wb-strip-blue > summary:hover {
        background: #dbeafe;
      }
      details.wb-question-strip.wb-strip-blue[open] > summary,
      details.wb-thin-strip.wb-strip-blue[open] > summary {
        background: #eff6ff;
        border-bottom: 1px solid #bfdbfe;
      }
      .wb-strip-left {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        flex: 1 1 auto;
        min-width: 0;
      }
      .wb-origin-pill {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.35px;
        padding: 2.5px 8px;
        margin-top: 1px;
        border-radius: 9999px;
        white-space: nowrap;
      }
      .wb-origin-green {
        background: #d1fae5;
        color: #065f46;
        border: 1px solid #6ee7b7;
      }
      .wb-origin-blue {
        background: #dbeafe;
        color: #1e40af;
        border: 1px solid #93c5fd;
      }
      .wb-tariff-pill {
        flex-shrink: 0;
        background: #0f172a;
        color: #ffffff;
        font-size: 0.72rem;
        font-weight: 800;
        padding: 2.5px 8px;
        margin-top: 1px;
        border-radius: 5px;
        letter-spacing: 0.3px;
        white-space: nowrap;
      }
      .wb-stem-preview,
      .wb-strip-stem {
        flex: 1 1 auto;
        min-width: 0;
        white-space: normal;
        display: block;
        overflow: visible;
        font-size: 0.89rem;
        font-weight: 600;
        color: #0f172a;
        line-height: 1.4;
      }
      details.wb-question-strip[open] .wb-stem-preview,
      details.wb-question-strip[open] .wb-strip-stem,
      .wb-thin-strip[open] .wb-stem-preview,
      .wb-thin-strip[open] .wb-strip-stem {
        display: block;
        overflow: visible;
        font-size: 0.96rem;
        font-weight: 700;
        line-height: 1.44;
      }
      .wb-strip-right {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        padding-top: 1px;
      }
      .wb-mins-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.73rem;
        font-weight: 700;
        color: #475569;
        background: #ffffff;
        border: 1px solid #cbd5e1;
        padding: 2px 7px;
        border-radius: 9999px;
        white-space: nowrap;
      }
      .wb-strip-toggle-txt {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.76rem;
        font-weight: 700;
        color: #334155;
        white-space: nowrap;
      }
      @media (max-width: 760px) {
        .wb-station-header {
          padding: 10px 12px;
        }
        .wb-strips-stack {
          padding: 8px 10px;
        }
        details.wb-question-strip > summary,
        details.wb-thin-strip > summary {
          flex-wrap: wrap !important;
          align-items: center !important;
          row-gap: 6px !important;
          column-gap: 6px !important;
          padding: 10px 11px !important;
        }
        details.wb-question-strip > summary > .wb-strip-left,
        details.wb-thin-strip > summary > .wb-strip-left {
          display: contents !important;
        }
        details.wb-question-strip > summary .wb-origin-pill,
        details.wb-thin-strip > summary .wb-origin-pill {
          order: 1;
          font-size: 0.66rem;
          padding: 2px 7px;
        }
        details.wb-question-strip > summary .wb-tariff-pill,
        details.wb-thin-strip > summary .wb-tariff-pill {
          order: 2;
          font-size: 0.68rem;
          padding: 2px 7px;
          white-space: normal;
          max-width: 100%;
        }
        details.wb-question-strip > summary > .wb-strip-right,
        details.wb-thin-strip > summary > .wb-strip-right {
          order: 3;
          margin-left: auto;
          gap: 6px;
        }
        details.wb-question-strip > summary .wb-stem-preview,
        details.wb-question-strip > summary .wb-strip-stem,
        details.wb-thin-strip > summary .wb-stem-preview,
        details.wb-thin-strip > summary .wb-strip-stem {
          order: 4;
          flex: 1 1 100% !important;
          width: 100% !important;
          min-width: 100% !important;
          margin-top: 2px;
          font-size: 0.88rem;
          line-height: 1.38;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }
        .wb-strip-body {
          padding: 10px 12px 12px 12px;
        }
      }
      .wb-strip-caret {
        font-size: 0.72rem;
        transition: transform 0.2s ease;
      }
      details.wb-question-strip .wb-lbl-open,
      details.wb-thin-strip .wb-lbl-open {
        display: none;
      }
      details.wb-question-strip[open] .wb-lbl-closed,
      details.wb-thin-strip[open] .wb-lbl-closed {
        display: none;
      }
      details.wb-question-strip[open] .wb-lbl-open,
      details.wb-thin-strip[open] .wb-lbl-open {
        display: inline;
      }
      details.wb-question-strip[open] .wb-strip-caret,
      details.wb-thin-strip[open] .wb-strip-caret {
        transform: rotate(180deg);
      }
      .wb-strip-body {
        padding: 12px 16px 14px 16px;
        background: #ffffff;
      }
      .exam-stimulus-single {
        margin: 4px 0 12px 0;
      }
      .wb-strip-body .p3-pane-cell {
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        background: #ffffff !important;
        border: 1.5px solid #94a3b8;
        border-radius: 8px;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
        min-width: 0 !important;
      }
      .wb-strip-body .p3-adjoined-pair {
        border: 1.5px solid #94a3b8 !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        margin: 4px 0 12px 0 !important;
        background: #ffffff !important;
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 0 !important;
      }
      .wb-strip-body .p3-adjoined-pair > .p3-pane-cell {
        border: none !important;
        border-radius: 0 !important;
      }
      @media (max-width: 767px) {
        .wb-strip-body .p3-adjoined-pair > .p3-pane-cell + .p3-pane-cell {
          border-top: 1px solid #cbd5e1 !important;
        }
      }
      @media (min-width: 768px) {
        .wb-strip-body .p3-adjoined-pair {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        .wb-strip-body .p3-adjoined-pair > .p3-pane-cell:nth-child(odd):not(:last-child) {
          border-right: 1px solid #cbd5e1 !important;
        }
        .wb-strip-body .p3-adjoined-pair > .p3-pane-cell:nth-child(n + 3) {
          border-top: 1px solid #cbd5e1 !important;
        }
      }
      .wb-strip-body .p3-quad-matrix {
        border: 1.5px solid #94a3b8 !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        margin: 4px 0 12px 0 !important;
        background: #ffffff !important;
      }
      .wb-strip-body .p3-quad-top-row,
      .wb-strip-body .p3-quad-bottom-row {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .wb-strip-body .p3-quad-matrix .p3-pane-cell {
        border: none !important;
        border-radius: 0 !important;
      }
      @media (max-width: 767px) {
        .wb-strip-body .p3-quad-top-row > .p3-pane-cell + .p3-pane-cell,
        .wb-strip-body .p3-quad-bottom-row > .p3-pane-cell + .p3-pane-cell {
          border-top: 1px solid #cbd5e1 !important;
        }
      }
      @media (min-width: 768px) {
        .wb-strip-body .p3-quad-top-row,
        .wb-strip-body .p3-quad-bottom-row {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        .wb-strip-body .p3-quad-top-row > .p3-pane-cell:first-child:not(:last-child),
        .wb-strip-body .p3-quad-bottom-row > .p3-pane-cell:first-child:not(:last-child) {
          border-right: 1px solid #cbd5e1 !important;
        }
      }
      .wb-strip-body .p3-quad-seam {
        border-top: 1.5px solid #cbd5e1 !important;
        border-bottom: 1px solid #cbd5e1 !important;
        background: #eff6ff !important;
        padding: 3px 10px !important;
        min-height: 24px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        font-size: 0.74rem !important;
        line-height: 1.25 !important;
        color: #1e3a8a !important;
      }
      .wb-strip-body .p3-quad-seam-text {
        font-weight: 600;
        min-width: 0;
        flex: 1 1 auto;
      }
      .wb-strip-body .p3-quad-seam-actions {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        flex-shrink: 0 !important;
      }
      .wb-strip-body .p3-quad-matrix.p3-quad-bottom-hidden .p3-quad-seam {
        border-bottom: none !important;
      }
      .wb-strip-body .p3-quad-matrix.p3-quad-bottom-hidden .p3-quad-bottom-row {
        display: none !important;
      }
      .wb-strip-body .p3-seam-btn {
        background: #ffffff !important;
        color: #1e3a8a !important;
        border: 1px solid #93c5fd !important;
        border-radius: 4px !important;
        padding: 1.5px 7px !important;
        font-size: 0.7rem !important;
        font-weight: 700 !important;
        line-height: 1.25 !important;
        cursor: pointer !important;
        white-space: nowrap !important;
        transition: background 0.15s ease, border-color 0.15s ease !important;
      }
      .wb-strip-body .p3-seam-btn:hover {
        background: #dbeafe !important;
        border-color: #3b82f6 !important;
      }
      .wb-strip-body .p3-seam-btn.is-active {
        background: #1e3a8a !important;
        color: #ffffff !important;
        border-color: #1e3a8a !important;
      }
      .wb-strip-body .p3-pane-header {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: flex-start !important;
        justify-content: space-between !important;
        padding: 5px 8px !important;
        margin: 0 !important;
        gap: 6px !important;
        min-height: 26px !important;
        box-sizing: border-box !important;
      }
      .wb-strip-body .p3-pane-interp > .p3-pane-header {
        background: #fff7ed !important;
        border-bottom: 1px solid #fed7aa !important;
      }
      .wb-strip-body .p3-pane-source > .p3-pane-header {
        background: #f1f5f9 !important;
        border-bottom: 1px solid #e2e8f0 !important;
      }
      .wb-strip-body .p3-pane-header-left {
        display: flex !important;
        align-items: flex-start !important;
        gap: 6px !important;
        min-width: 0 !important;
        flex: 1 1 auto !important;
        overflow: hidden !important;
      }
      .wb-strip-body .p3-pane-badge {
        color: #ffffff !important;
        padding: 2px 6px !important;
        margin-top: 1px !important;
        border-radius: 4px !important;
        font-size: 0.64rem !important;
        font-weight: 800 !important;
        letter-spacing: 0.35px !important;
        line-height: 1.15 !important;
        flex-shrink: 0 !important;
        white-space: nowrap !important;
        text-transform: uppercase !important;
      }
      .wb-strip-body .p3-pane-badge-interp {
        background: #9a3412 !important;
      }
      .wb-strip-body .p3-pane-badge-source {
        background: #1e40af !important;
      }
      .wb-strip-body .p3-pane-prov,
      .p3-pane-prov.archival-source-body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 0.72rem !important;
        font-weight: 600 !important;
        line-height: 1.24 !important;
        color: #1e293b !important;
        white-space: normal !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      .wb-strip-body .p3-pane-header-right {
        flex-shrink: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
      }
      .flat-inline-audio {
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
        margin: 0 !important;
        padding: 0 !important;
        flex-shrink: 0 !important;
      }
      .wb-strip-body .flat-inline-audio .read-aloud-btn,
      .wb-strip-body .flat-inline-audio .read-aloud-stop-btn,
      .flat-inline-audio .read-aloud-btn,
      .flat-inline-audio .read-aloud-stop-btn {
        height: 22px !important;
        min-height: 22px !important;
        padding: 2px 7px !important;
        font-size: 0.71rem !important;
        line-height: 1 !important;
        border-radius: 4px !important;
        margin: 0 !important;
      }
      .wb-strip-body .p3-pane-body {
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        flex: 1 1 auto !important;
        display: flex !important;
        flex-direction: column !important;
        min-width: 0 !important;
      }
      .wb-strip-body .p3-pane-prose {
        padding: 8px 11px !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        font-family: 'Georgia', serif !important;
        font-style: italic !important;
        font-size: 0.855rem !important;
        line-height: 1.43 !important;
        color: #1e293b !important;
        max-height: none !important;
        overflow-y: visible !important;
        box-sizing: border-box !important;
        width: 100% !important;
        white-space: pre-line;
      }
      .wb-strip-body .p3-quad-matrix .p3-pane-prose {
        max-height: 215px !important;
        overflow-y: auto !important;
      }
      .wb-strip-body .p3-pane-interp-prose {
        white-space: normal;
      }
      .wb-strip-body .p3-pane-body.p3-pane-media-split {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        gap: 10px !important;
        padding: 8px 11px !important;
        max-height: none !important;
        overflow-y: visible !important;
        box-sizing: border-box !important;
      }
      .wb-strip-body .p3-quad-matrix .p3-pane-body.p3-pane-media-split {
        max-height: 215px !important;
        overflow-y: auto !important;
      }
      .wb-strip-body .p3-pane-thumb-side {
        width: 110px !important;
        flex-shrink: 0 !important;
        text-align: center !important;
        cursor: zoom-in !important;
      }
      .wb-strip-body .p3-pane-thumb-side img.archival-image {
        width: 110px !important;
        max-width: 110px !important;
        max-height: 115px !important;
        height: auto !important;
        object-fit: contain !important;
        display: block !important;
        margin: 0 auto !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 4px !important;
        background: #f8fafc !important;
        cursor: zoom-in !important;
      }
      .wb-strip-body .p3-pane-media-split .p3-pane-prose {
        padding: 0 !important;
        max-height: none !important;
        overflow: visible !important;
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0 !important;
      }
      .wb-strip-body .p3-pane-body.p3-pane-img-only {
        padding: 6px 10px !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        max-height: none !important;
        overflow: visible !important;
        cursor: zoom-in !important;
        box-sizing: border-box !important;
        flex: 1 1 auto !important;
      }
      .wb-strip-body .p3-quad-matrix .p3-pane-body.p3-pane-img-only {
        max-height: 215px !important;
        overflow: hidden !important;
      }
      .wb-strip-body .p3-pane-body.p3-pane-img-only img.archival-image {
        max-height: 190px !important;
        max-width: 100% !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
        display: block !important;
        margin: 0 auto !important;
        border-radius: 4px !important;
        cursor: zoom-in !important;
      }
      .wb-strip-body .p3-quad-matrix .p3-pane-body.p3-pane-img-only img.archival-image {
        max-height: 135px !important;
      }
      .wb-strip-body .p3-pane-body.p3-pane-img-only.has-brief-caption img.archival-image {
        max-height: 114px !important;
      }
      .wb-strip-body .p3-zoom-hint {
        margin-top: 3px !important;
        font-size: 0.68rem !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        color: #475569 !important;
      }
      .wb-strip-body .p3-pane-thumb-side:hover .p3-zoom-hint,
      .wb-strip-body .p3-pane-body.p3-pane-img-only:hover .p3-zoom-hint {
        color: #1d4ed8 !important;
      }
      .wb-strip-body .p3-img-caption-compact {
        margin-top: 2px !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-style: normal !important;
        font-size: 0.72rem !important;
        line-height: 1.25 !important;
        color: #334155 !important;
        white-space: normal !important;
        overflow: visible !important;
        padding: 0 !important;
        max-height: none !important;
      }
      .wb-interactive-chip {
        cursor: pointer !important;
        user-select: none !important;
        transition: background-color 0.14s ease, border-color 0.14s ease, color 0.14s ease, opacity 0.14s ease !important;
        display: inline-block !important;
      }
      .wb-interactive-chip:hover {
        filter: brightness(0.96);
      }
      .wb-interactive-chip.is-struck {
        text-decoration-line: line-through !important;
        text-decoration-style: solid !important;
        text-decoration-color: #334155 !important;
        text-decoration-thickness: 1.5px !important;
        opacity: 0.68 !important;
        background: #f1f5f9 !important;
        color: #64748b !important;
        border-color: #cbd5e1 !important;
      }
      .laptop-only-response-box {
        display: none;
      }
      .laptop-mode-active .laptop-only-response-box {
        display: block;
      }
      @media (max-width: 680px) {
        .wb-mins-pill {
          display: none;
        }
      }
    </style>
  `;
}

export function cleanStemForStripSummary(rawText) {
  if (!rawText) return 'Click to open question';
  let s = String(rawText)
    .replace(/^Describe two features of[^\n:]+:\s*\n?(?=\s*\(a\))/i, '')
    .replace(/\s*You may use the following(?:\s+in\s+your\s+answer)?\s*:[\s\S]*$/i, '')
    .replace(/\s*You must also use information of your own\.?[\s\S]*$/i, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*\*/g, '')
    .replace(
      /\s*(?:\[\s*\d+\s*(?:\+\s*\d+\s*)?(?:marks?|m|spag)[^\]]*\]|\(\s*\d+\s*(?:\+\s*\d+\s*)?(?:marks?|spag)[^)]*\))\.?/gi,
      '',
    )
    .replace(/\s*\[\s*\d+\s*(?:\+|marks?|spag)[^\]]*$/i, '')
    .replace(/\s*\((?:P|Para\s*)\d+\)\s*\.?$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  s = s
    .replace(
      /^(?:Enquiry:|Task\s*\d+[\.:\s-]*|Question\s*\d+(?:\s*\([a-d]\))?[\.:\s-]*|Q\d+(?:\s*\([a-d]\))?[\.:\s-]*|\d+\s*\([a-d]\)[\.:\s-]*|\d+\s*[\.\):]\s+)/i,
      '',
    )
    .trim();
  if (s && !/[.?!:;]['"”’)\]]*$/.test(s)) {
    s += '.';
  }
  return s || String(rawText).replace(/<[^>]+>/g, ' ').trim();
}

export function extractEmbeddedStimulusBullets(rawText) {
  if (!rawText) return null;
  const match = String(rawText).match(
    /You may use the following(?:\s+in\s+your\s+answer)?\s*:\s*([\s\S]*?)(?:You must also use information of your own\.?|$)/i,
  );
  if (!match || !match[1]) return null;
  const items = match[1]
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .split(/(?:[•\u2022]|\r?\n\s*[-*•\u2022]?)+/)
    .map((x) => x.replace(/\s+/g, ' ').replace(/^[\s\-–—:.,]+|[\s.]+$/g, '').trim())
    .filter((x) => x.length > 1 && !/^you must also use/i.test(x));
  return items.length > 0 ? items : null;
}

export function decodeBasicHtmlEntities(str) {
  return String(str || '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&bull;/g, '•')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

export function parseMockSourceExtractToStimuli(rawExtract) {
  if (!rawExtract || !String(rawExtract).trim()) return [];
  const cleaned = String(rawExtract)
    .replace(/https?:\/\/localhost:\d+\/images\//gi, '/images/')
    .trim();

  // Split multi-item extracts across <hr>, dashed-border dividers, or sibling Source/Interpretation divs
  const rawSegments = cleaned
    .split(
      /<hr\b[^>]*>|(?=<div[^>]*border-top:\s*1px\s+dashed[^>]*>)|(?<=<\/div>)\s*(?=<div[^>]*>\s*<div[^>]*>\s*(?:<strong>)?\s*(?:Source\s+[A-E]|Interpretation\s+[12])\b)/i,
    )
    .map((seg) => seg.trim())
    .filter(Boolean);

  return rawSegments
    .map((seg, idx) => {
      let work = seg;
      let image = '';
      let imageAlt = '';
      const imgMatch = work.match(/<img\b[^>]*>/i);
      if (imgMatch) {
        const srcM = imgMatch[0].match(/\bsrc\s*=\s*["']([^"']+)["']/i);
        const altM = imgMatch[0].match(/\balt\s*=\s*["']([^"']+)["']/i);
        if (srcM) image = srcM[1].trim();
        if (altM) imageAlt = decodeBasicHtmlEntities(altM[1].trim());
        work = work.replace(/<img\b[^>]*>/gi, '\n');
      }

      // Extract trailing small-print journal/archive citation div if present (e.g. Medicine KT5)
      let trailingCitation = '';
      const smallCitMatch = work.match(
        /<div[^>]*font-size:\s*0\.8rem[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>\s*)?$/i,
      );
      if (smallCitMatch) {
        trailingCitation = decodeBasicHtmlEntities(
          smallCitMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        );
        work = work.replace(smallCitMatch[0], '</div>');
      }

      const plainLines = decodeBasicHtmlEntities(
        work
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/(?:div|p|blockquote|li|h[1-6])>/gi, '\n')
          .replace(/<(?:div|p|blockquote|li|h[1-6])\b[^>]*>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/[ \t]+/g, ' '),
      )
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (plainLines.length === 0 && !image) return null;

      // Drop redundant bare first line like "Source A:" or "Interpretation 1" when more lines follow
      let headerLine = plainLines[0] || '';
      let restLines = plainLines.slice(1);

      const bareLabelRx = /^(?:Source\s+([A-E0-9]+)|Interpretation\s+([0-9]+))\s*[:.-]?\s*$/i;
      let explicitLetter = '';
      let explicitInterp = '';
      const bareM = headerLine.match(bareLabelRx);
      if (bareM) {
        if (bareM[1]) explicitLetter = bareM[1].toUpperCase();
        if (bareM[2]) explicitInterp = bareM[2];
        if (restLines.length > 0) {
          headerLine = restLines[0];
          restLines = restLines.slice(1);
        } else {
          headerLine = '';
        }
      }

      // Check prefix on headerLine (e.g. "Source B: From a confidential memo..." or "Interpretation 1: From...")
      const prefixM = headerLine.match(
        /^(?:Source\s+([A-E0-9]+)|Interpretation\s+([0-9]+))(?:\s*\(([^)]+)\))?\s*[:.-]?\s*(.*)$/i,
      );
      if (prefixM) {
        if (prefixM[1] && !explicitLetter) explicitLetter = prefixM[1].toUpperCase();
        if (prefixM[2] && !explicitInterp) explicitInterp = prefixM[2];
        const parenNote = prefixM[3] ? `${prefixM[3]}: ` : '';
        headerLine = `${parenNote}${prefixM[4] || ''}`.trim();
      }

      const isInterp = Boolean(explicitInterp);
      const interpNum = explicitInterp || `${idx + 1}`;
      const srcLetter = explicitLetter || String.fromCharCode(65 + idx);

      let provenance = '';
      let content = '';
      let caption = '';

      if (restLines.length > 0) {
        provenance = headerLine;
        content = restLines.join('\n\n');
      } else if (image) {
        // Single descriptive line accompanying an image
        if (headerLine.length > 140 || /["“”]/.test(headerLine)) {
          const firstDot = headerLine.indexOf('. ');
          if (firstDot > 15 && firstDot < 130) {
            provenance = headerLine.slice(0, firstDot + 1).trim();
            content = headerLine.slice(firstDot + 2).trim();
          } else {
            provenance = imageAlt || `Archival Visual Source`;
            caption = headerLine;
          }
        } else {
          provenance = headerLine || imageAlt || 'Archival Visual Source';
          caption = headerLine;
        }
      } else {
        // Only 1 text line and no image (e.g. Weimar adapted Q3a Source C or Q3d summary)
        provenance = isInterp ? 'Historical Interpretation' : 'Contemporary Primary Source';
        content = headerLine;
      }

      if (trailingCitation) {
        provenance = provenance ? `${provenance} (${trailingCitation})` : trailingCitation;
      }

      const labelPrefix = isInterp ? `Interpretation ${interpNum}` : `Source ${srcLetter}`;
      return {
        title: provenance ? `${labelPrefix}: ${provenance}` : labelPrefix,
        provenance,
        content,
        image,
        image_alt: imageAlt || provenance || labelPrefix,
        caption,
        isInterp,
        interpNum,
        letter: srcLetter,
      };
    })
    .filter(Boolean);
}

if (typeof window !== 'undefined') {
  window.toggleP3QuadSources = function (btn) {
    const matrix = btn ? btn.closest('.p3-quad-matrix') : null;
    if (!matrix) return;
    const hidden = matrix.classList.toggle('p3-quad-bottom-hidden');
    btn.textContent = hidden ? 'Show Sources B & C ▾' : 'Hide Sources B & C ▴';
    btn.setAttribute('aria-expanded', hidden ? 'false' : 'true');
  };
}

export function shortenWorkbookOriginLabel(label, inWorkbook = true) {
  if (!inWorkbook) return 'Extra Practice';
  if (!label) return 'Workbook';
  const pagesMatch = String(label).match(/Pages?\s+([0-9]+(?:[–-][0-9]+)?)/i);
  if (pagesMatch) {
    const pg = pagesMatch[1];
    return pg.includes('–') || pg.includes('-') ? `Workbook • pp. ${pg}` : `Workbook • p. ${pg}`;
  }
  return 'Workbook';
}

export function checkIsKs2(unitId, unitObj) {
  if (unitId === 'ks2_ww2' || (typeof unitId === 'string' && unitId.startsWith('ks2_')))
    return true;
  if (unitObj && (unitObj.is_ks2 || (unitObj.year_group && unitObj.year_group.includes('KS2'))))
    return true;
  if (
    typeof window !== 'undefined' &&
    window.currentUnitId &&
    window.currentUnitId.startsWith('ks2_')
  )
    return true;
  return false;
}

export function checkIsKs3(unitId, unitObj) {
  if (checkIsKs2(unitId, unitObj)) return false;
  const rawId = unitId || (typeof window !== 'undefined' ? window.currentUnitId : null);
  if (rawId && KS3_CANONICAL_UNITS.includes(rawId)) return true;
  if (
    unitObj &&
    (unitObj.is_ks3 || (unitObj.year_group && /KS3|Key Stage 3|Year\s*[789]/i.test(unitObj.year_group)))
  )
    return true;
  if (rawId && GCSE_CANONICAL_UNITS.includes(rawId)) return false;
  if (unitObj && (unitObj.isGCSE || unitObj.is_gcse)) return false;
  return false;
}

export function checkIsGCSE(unitId, unitObj) {
  if (checkIsKs2(unitId, unitObj) || checkIsKs3(unitId, unitObj)) return false;
  const rawId = unitId || (typeof window !== 'undefined' ? window.currentUnitId : null);
  if (rawId && GCSE_CANONICAL_UNITS.includes(rawId)) return true;
  if (
    unitObj &&
    (unitObj.isGCSE ||
      unitObj.is_gcse ||
      (unitObj.year_group && /GCSE|Year\s*1[01]/i.test(unitObj.year_group)))
  )
    return true;
  return true;
}

// Module-level fallback to ensure isGCSE never throws ReferenceError
var isGCSE = false;

if (typeof window !== 'undefined') {
  window.toggleAllSpineDrawers = function (btn) {
    const spine = btn
      ? btn.closest('#lesson-chronology-spine')
      : document.getElementById('lesson-chronology-spine');
    if (!spine) return;
    const drawers = spine.querySelectorAll('.cme-domino-step, .cme-spine-causal-drawer');
    const hasClosed = Array.from(drawers).some((d) => !d.open);
    drawers.forEach((d) => {
      d.open = hasClosed;
    });
    if (btn) {
      const textSpan = btn.querySelector('.toggle-spine-text');
      if (textSpan) {
        textSpan.textContent = hasClosed ? 'Collapse All' : 'Expand All';
      }
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = hasClosed ? 'fa-solid fa-compress' : 'fa-solid fa-arrows-up-down';
      }
    }
  };
}

window.formatBold = function (text) {
  if (!text) return '';
  if (typeof text !== 'string') {
    if (typeof text === 'object') {
      if (text.stem) {
        return (
          (text.tier ? '<strong>' + text.tier + ':</strong> ' : '') +
          window.formatBold(text.stem) +
          (text.pupil_focus
            ? ' <span style="display:block; font-size:0.85em; opacity:0.85; margin-top:2px;">(' +
            text.pupil_focus +
            ')</span>'
            : '')
        );
      }
      return '';
    }
    text = String(text);
  }
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Handle blockquotes
  parsed = parsed.replace(
    /(^|\n)> (.*?)(?=\n|$)/g,
    '$1<blockquote style="border-left: 4px solid #cbd5e1; padding-left: 15px; margin-left: 0; color: #475569; font-style: italic; background: rgba(248, 250, 252, 0.5); padding-top: 5px; padding-bottom: 5px; border-radius: 0 4px 4px 0;">$2</blockquote>',
  );
  // Handle headers
  parsed = parsed.replace(
    /(^|\n)### (.*?)(?=\n|$)/g,
    '$1<h4 style="color: #1e3a8a; margin-top: 15px; margin-bottom: 5px;">$2</h4>',
  );
  parsed = parsed.replace(
    /(^|\n)## (.*?)(?=\n|$)/g,
    '$1<h3 style="color: #1e3a8a; margin-top: 15px; margin-bottom: 5px;">$2</h3>',
  );

  parsed = parsed.replace(/\\n/g, '\n');

  // Handle lists
  if (parsed.match(/(^|\n)[\*\-]\s/)) {
    parsed = parsed.replace(/(^|\n)[\*\-]\s+(.*)/g, '$1<li>$2</li>');
    parsed = parsed.replace(
      /(<li>.*<\/li>(?:\n<li>.*<\/li>)*)/g,
      '<ul style="margin-top: 5px; margin-bottom: 5px; padding-left: 20px;">\n$1\n</ul>',
    );
  }

  // Handle italics (after lists so we don't conflict with bullet points)
  parsed = parsed.replace(/\*([^\*]+)\*/g, '<i>$1</i>');

  // Isolate table newline stripping to cme_new to prevent large whitespace before tables
  if (window.currentUnitId === 'cme_new') {
    parsed = parsed.replace(/<table[\s\S]*?<\/table>/gi, (tableHtml) =>
      tableHtml.replace(/\r?\n\s*/g, ' '),
    );
  }

  if (!parsed.trim().startsWith('<table') && !parsed.trim().startsWith('<div')) {
    parsed = parsed.replace(/\n/g, '<br>');
  }
  // Clean up <br> around elements
  if (window.currentUnitId === 'cme_new') {
    parsed = parsed
      .replace(/(?:<br\s*\/?>\s*)+(<table)/gi, '$1')
      .replace(/(<\/table>)(?:\s*<br\s*\/?>)+/gi, '$1');
  }
  parsed = parsed
    .replace(/<br><ul/g, '<ul')
    .replace(/<\/ul><br>/g, '</ul>')
    .replace(/<br><li>/g, '<li>')
    .replace(/<\/li><br>/g, '</li>');
  parsed = parsed
    .replace(/<br><blockquote/g, '<blockquote')
    .replace(/<\/blockquote><br>/g, '</blockquote>');
  parsed = parsed
    .replace(/<br><h/g, '<h')
    .replace(/<\/h4><br>/g, '</h4>')
    .replace(/<\/h3><br>/g, '</h3>');

  return parsed;
};

export function formatBold(text) {
  if (typeof window !== 'undefined' && window.formatBold) {
    return window.formatBold(text);
  }
  return text;
}

/**
 * Detects if a source text and metadata represent poetry, verse, or lyrics.
 */
export function isPoetryOrVerse(text, source = {}) {
  if (!text) return false;
  const title = (source.title || '').toLowerCase();
  const format = (source.format || '').toLowerCase();
  const type = (source.type || '').toLowerCase();
  const caption = (source.caption || '').toLowerCase();
  const citation = (source.citation || '').toLowerCase();

  // Explicit type or format tags
  if (['verse', 'poem', 'poetry', 'rhyme', 'sonnet', 'ballad', 'hymn'].includes(format)) return true;
  if (['verse', 'poem', 'poetry'].includes(type)) return true;
  if (/(?:verse|poem|poetry|rhyme|ballad|sonnet|hymn)/i.test(title)) return true;
  if (/(?:recruitment poem|war poem|propaganda poem|propaganda verse|poetry extract)/i.test(caption)) return true;
  if (/(?:war poems|ballads|songbook|poems)/i.test(citation)) return true;

  // Content heuristic: multiple line-break slashes (e.g. 'line 1 / line 2 / line 3')
  const slashMatches = text.match(/\s\/\s/g);
  if (slashMatches && slashMatches.length >= 2) return true;

  return false;
}

/**
 * Parses poem text (whether separated by slashes or newlines) into structured stanzas and lines.
 */
export function parsePoetryStanzas(text) {
  if (!text) return { stanzas: [], openQuote: '', closeQuote: '' };
  let cleanText = text.trim();

  let openQuote = '';
  let closeQuote = '';
  if (
    (cleanText.startsWith('“') && cleanText.endsWith('”')) ||
    (cleanText.startsWith('"') && cleanText.endsWith('"'))
  ) {
    openQuote = '“';
    closeQuote = '”';
    cleanText = cleanText.slice(1, -1).trim();
  }

  let stanzas = [];

  if (/\n\s*\n/.test(cleanText)) {
    // Explicit blank lines separating stanzas
    const rawStanzas = cleanText.split(/\n\s*\n/);
    stanzas = rawStanzas
      .map((st) => {
        return st
          .split(/\n|\s*\/\s*/)
          .map((l) => l.trim().replace(/^“|”$/g, ''))
          .filter(Boolean);
      })
      .filter((st) => st.length > 0);
  } else if (cleanText.includes(' // ')) {
    // Double slash separating stanzas
    const rawStanzas = cleanText.split(/\s*\/\/\s*/);
    stanzas = rawStanzas
      .map((st) => {
        return st
          .split(/\s*\/\s*|\n/)
          .map((l) => l.trim().replace(/^“|”$/g, ''))
          .filter(Boolean);
      })
      .filter((st) => st.length > 0);
  } else if (cleanText.includes(' / ')) {
    // Single slash separating lines
    const lines = cleanText
      .split(/\s*\/\s*/)
      .map((l) => l.trim().replace(/^“|”$/g, ''))
      .filter(Boolean);
    if (lines.length >= 8 && lines.length % 4 === 0) {
      for (let i = 0; i < lines.length; i += 4) {
        stanzas.push(lines.slice(i, i + 4));
      }
    } else if (lines.length > 4) {
      const mid = Math.ceil(lines.length / 2);
      stanzas.push(lines.slice(0, mid));
      stanzas.push(lines.slice(mid));
    } else {
      stanzas.push(lines);
    }
  } else if (cleanText.includes('\n')) {
    const lines = cleanText
      .split('\n')
      .map((l) => l.trim().replace(/^“|”$/g, ''))
      .filter(Boolean);
    if (lines.length >= 8 && lines.length % 4 === 0) {
      for (let i = 0; i < lines.length; i += 4) {
        stanzas.push(lines.slice(i, i + 4));
      }
    } else {
      stanzas.push(lines);
    }
  } else {
    stanzas.push([cleanText.replace(/^“|”$/g, '')]);
  }

  return { stanzas, openQuote, closeQuote };
}

/**
 * Renders poetry extract in an authentic, high-impact literary verse container.
 */
export function renderArchivalVerseHtml(text, source = {}, options = {}) {
  const { stanzas, openQuote, closeQuote } = parsePoetryStanzas(text);
  const maxHeightStyle =
    options.maxHeight && options.maxHeight !== 'none'
      ? `max-height: ${options.maxHeight}; overflow-y: auto;`
      : '';

  let pillLabel = 'Primary Archival Verse';
  const title = (source.title || '').toLowerCase();
  const caption = (source.caption || '').toLowerCase();
  if (title.includes('propaganda verse') || title.includes('propaganda poem')) {
    pillLabel = 'Propaganda Verse';
  } else if (title.includes('recruitment poem') || caption.includes('recruitment poem')) {
    pillLabel = 'Recruitment Verse';
  } else if (title.includes('war poem') || title.includes('wartime')) {
    pillLabel = 'Wartime Verse';
  } else if (title.includes('imperial poetry') || title.includes('imperial')) {
    pillLabel = 'Imperial Verse';
  }

  const stanzasHtml = stanzas
    .map((stanza, sIdx) => {
      const isFirstStanza = sIdx === 0;
      const isLastStanza = sIdx === stanzas.length - 1;
      const linesHtml = stanza
        .map((line, lIdx) => {
          const isFirstLine = isFirstStanza && lIdx === 0;
          const isLastLine = isLastStanza && lIdx === stanza.length - 1;
          let displayLine = line;
          if (isFirstLine && openQuote) {
            displayLine = openQuote + displayLine;
          }
          if (isLastLine && closeQuote) {
            displayLine = displayLine + closeQuote;
          }
          return `<div class="archival-verse-line" style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.05rem; line-height: 1.82; color: #1e293b; font-style: italic; padding-left: 1.6em; text-indent: -1.6em; letter-spacing: 0.01em;">${displayLine}</div>`;
        })
        .join('\n');

      const isBottom = sIdx === stanzas.length - 1;
      return `<div class="archival-verse-stanza" style="margin-bottom: ${isBottom ? '0' : '15px'};">\n${linesHtml}\n</div>`;
    })
    .join('\n\n');

  return `
    <div class="archival-source-body archival-source-verse" style="width: 100%; ${maxHeightStyle} font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 1.05rem; line-height: 1.75; color: #1e293b; background: linear-gradient(180deg, #fffdfa 0%, #fbf8f0 100%); border-left: 4px solid #b45309; border-top: 1px solid #f1e7d8; border-right: 1px solid #f1e7d8; border-bottom: 1px solid #f1e7d8; border-radius: 6px; padding: 16px 22px; margin-bottom: 12px; position: relative; box-shadow: 0 2px 8px rgba(180, 83, 9, 0.04);">
      <div class="archival-verse-header" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px dashed rgba(180, 83, 9, 0.22); user-select: none;">
        <span class="archival-verse-badge" style="display: inline-flex; align-items: center; gap: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 0.70rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #92400e; background: #fef3c7; border: 1px solid #fde68a; padding: 3px 9px; border-radius: 999px;">
          <i class="fa-solid fa-feather-pointed" style="color: #b45309;"></i> ${pillLabel}
        </span>
        <span class="archival-verse-meter" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 0.72rem; color: #78716c; font-style: normal; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          <i class="fa-solid fa-scroll" style="margin-right: 4px; opacity: 0.7;"></i> Archival Poetic Extract
        </span>
      </div>
      <div class="archival-verse-stanzas" style="padding-left: 10px; border-left: 2px dashed rgba(180, 83, 9, 0.28); margin-left: 4px;">
        ${stanzasHtml}
      </div>
    </div>
  `;
}

/**
 * Master dispatcher for archival source text: renders authentic verse layout for poetry,
 * and high-legibility serif container with preserved line-breaks for prose.
 */
export function renderArchivalSourceBody(text, source = {}, options = {}) {
  if (!text || !String(text).trim()) return '';
  const clean = String(text).trim();

  if (isPoetryOrVerse(clean, source)) {
    return renderArchivalVerseHtml(clean, source, options);
  }

  const rawTextType = String((source && source.text_type) || '').trim().toLowerCase();
  const hasExplicitTextType = rawTextType === 'verbatim' || rawTextType === 'summary';
  const isSummaryText = rawTextType === 'summary';
  const textTypeBadgeHtml = hasExplicitTextType
    ? `<div class="source-text-type-row"><span class="perspective-type-badge ${isSummaryText ? 'is-summary' : 'is-verbatim'}">${isSummaryText ? 'Summary of stated position' : 'Extract'}</span></div>`
    : '';

  const maxHeightStyle =
    options.maxHeight && options.maxHeight !== 'none'
      ? `max-height: ${options.maxHeight}; overflow-y: auto;`
      : '';
  const borderColor = options.accentColor || '#1e3a8a';
  const padding = options.padding || '10px 14px';
  const fontSize = options.fontSize || '1.02rem';
  const lineHeight = options.lineHeight || '1.62';
  const marginBottom = options.marginBottom || '4px';
  const fontFamily = isSummaryText ? "'Inter', sans-serif" : "'Georgia', serif";
  const fontStyle = isSummaryText ? 'normal' : 'italic';
  const bgStyle = isSummaryText ? '#f8fafc' : '#fffdfa';

  // Channel 2 ONLY (Vocabulary Lens hover/tap underlines — zero bolding, zero dossier pills)
  // so pupils reading archaic or formal primary sources get plain-English word support without altering authenticity.
  const activeVocabDict =
    options.vocabDict || (typeof window !== 'undefined' ? window.__HH_ACTIVE_VOCAB_DICT__ : null);
  const annotatedClean =
    activeVocabDict && Object.keys(activeVocabDict).length > 0
      ? highlightGlossaryInProse(clean, activeVocabDict, { maxPerBlock: 3 })
      : clean;

  return `${textTypeBadgeHtml}<div class="archival-source-body${isSummaryText ? ' is-summary-position' : ''}" style="width: 100%; box-sizing: border-box; ${maxHeightStyle} font-family: ${fontFamily}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineHeight}; color: #1e293b; background: ${bgStyle}; padding: ${padding}; border-left: 4px solid ${borderColor}; border-radius: 4px; margin-bottom: ${marginBottom}; white-space: pre-line;">${annotatedClean}</div>`;
}

export function toggleThinkDiscuss(btn, targetId) {
  const panel = typeof targetId === 'string' ? document.getElementById(targetId) : targetId;
  if (!panel) return;
  const isHidden =
    window.getComputedStyle(panel).display === 'none' || panel.style.display === 'none';
  if (isHidden) {
    panel.style.display = 'block';
    panel.classList.add('revealed');
    if (btn) {
      const label = btn.querySelector('.toggle-label');
      if (label) label.textContent = label.dataset.hideText || 'Hide Examples';
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-eye-slash';
      btn.style.background = 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
    }
  } else {
    panel.style.display = 'none';
    panel.classList.remove('revealed');
    if (btn) {
      const label = btn.querySelector('.toggle-label');
      if (label) label.textContent = label.dataset.showText || 'Example Answers';
      const icon = btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-lightbulb';
      btn.style.background = '';
    }
  }
}

export function jumpToNarrativeBlock(stageNum, targetPara = null) {
  let target = null;
  const num = parseInt(stageNum, 10) || 1;

  if (targetPara) {
    target =
      document.getElementById(`para-${targetPara.replace('.', '-')}`) ||
      document.querySelector(`[data-para="${targetPara}"]`);
  }

  if (!target) {
    target =
      document.getElementById(`para-${num}`) ||
      document.getElementById(`stage-banner-${num}`) ||
      document.getElementById(`para-l4-${num}`) ||
      document.querySelector(`.standard-narrative-container:nth-of-type(${num})`) ||
      document.querySelector(`.narrative-chunk:nth-of-type(${num})`) ||
      document.querySelectorAll('.narrative-chunk')[num - 1];
  }

  if (target) {
    const parentDetails = target.closest('details');
    if (parentDetails) parentDetails.open = true;

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.style.transition = 'box-shadow 0.35s ease';
    target.style.borderRadius = '8px';
    target.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.35)';
    setTimeout(() => {
      target.style.boxShadow = '';
    }, 1500);
    return true;
  }
  return false;
}

export function jumpToSpineCard(stageNum) {
  const spine = document.getElementById('lesson-chronology-spine');
  if (spine) {
    const card = spine.querySelector(`.cme-spine-card[data-stage="${stageNum}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.transition = 'all 0.4s ease';
      card.style.boxShadow = '0 0 0 4px #0284c7, 0 8px 24px rgba(2, 132, 199, 0.35)';
      card.style.transform = 'translateY(-3px)';
      setTimeout(() => {
        card.style.boxShadow = '';
        card.style.transform = '';
      }, 2500);
    } else {
      spine.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

export function jumpToSourceDrawer(letter) {
  const normLetter = (letter || '').toUpperCase();
  const card =
    document.getElementById(`source-card-${normLetter}`) ||
    document.querySelector(`[data-source-letter="${normLetter}"]`);
  if (card) {
    if (card.tagName && card.tagName.toLowerCase() === 'details') {
      card.open = true;
    } else {
      const innerDetails = card.querySelector('details');
      if (innerDetails) innerDetails.open = true;
    }
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('source-card-highlighted');
    card.style.transition = 'all 0.4s ease';
    card.style.boxShadow = '0 0 0 4px #0284c7, 0 8px 24px rgba(2, 132, 199, 0.35)';
    setTimeout(() => {
      card.classList.remove('source-card-highlighted');
      card.style.boxShadow = '';
    }, 2500);
  }
}

if (typeof window !== 'undefined') {
  window.toggleThinkDiscuss = toggleThinkDiscuss;
  window.jumpToNarrativeBlock = jumpToNarrativeBlock;
  window.jumpToSpineCard = jumpToSpineCard;
  window.jumpToSourceDrawer = jumpToSourceDrawer;
}

export function getFallbackDiscussionIdeas(qText, sourceObj = {}) {
  // Quality gate: keyword guessing is disabled to prevent generic, mismatched answers.
  // All exemplar answers must be bespoke and explicitly authored on source.discussion_ideas.
  return null;
}

export function getArchivalSourceDiscussionComponents(
  questionText,
  sourceObj = {},
  isKs2 = false,
  marginTop = '10px',
) {
  let effectiveQ = questionText;
  if (!effectiveQ && sourceObj) {
    effectiveQ = sourceObj.hinge_question || sourceObj.question || sourceObj.source_question;
    if (
      !effectiveQ &&
      sourceObj.source_context &&
      /\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*{0,2}/i.test(
        sourceObj.source_context,
      )
    ) {
      const parts = sourceObj.source_context.split(
        /\*{0,2}(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\*{0,2}/i,
      );
      if (parts[1]) effectiveQ = parts[1].trim();
    }
  }
  if (!effectiveQ) return { promptHtml: '', panelHtml: '', discussId: '' };
  const cleanQ = cleanQuestionText(effectiveQ);
  const formattedQ =
    typeof window !== 'undefined' && window.formatBold ? window.formatBold(cleanQ) : cleanQ;

  let ideas = sourceObj
    ? sourceObj.discussion_ideas ||
    sourceObj.example_answers ||
    sourceObj.exemplar_answers ||
    (sourceObj.model_answer
      ? Array.isArray(sourceObj.model_answer)
        ? sourceObj.model_answer
        : [sourceObj.model_answer]
      : null)
    : null;
  if (!ideas || !Array.isArray(ideas) || ideas.length === 0) {
    ideas = getFallbackDiscussionIdeas(cleanQ, sourceObj);
  }

  const hasIdeas = Array.isArray(ideas) && ideas.length > 0;
  const isSingle = hasIdeas && ideas.length === 1;
  const discussId = 'think-discuss-' + Math.random().toString(36).substring(2, 9);
  const isExamPrompt =
    /\[\s*\d+(?:\s*\+\s*\d+)?\s*marks?\s*\]/i.test(cleanQ) ||
    /^(?:Study Source|How useful is Source|Give two things you can infer)/i.test(cleanQ);

  const showBtnLabel = isSingle
    ? isExamPrompt
      ? 'Reveal Model Answer'
      : 'Historical Analysis'
    : 'Example Answers';
  const hideBtnLabel = isSingle
    ? isExamPrompt
      ? 'Hide Model Answer'
      : 'Hide Analysis'
    : 'Hide Examples';
  const panelHeader = isSingle
    ? isExamPrompt
      ? 'MODEL ANSWER:'
      : 'HISTORICAL ANALYSIS:'
    : 'Exemplar Discussion Points &amp; Angles:';
  const singleItemBadge = isExamPrompt ? 'Model Answer' : 'Analysis';

  const promptHtml = `
    <div class="archival-source-discussion-box" style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-left: 5px solid #1e40af; padding: 12px 16px; border-radius: 6px; margin-top: ${marginTop}; box-shadow: 0 2px 5px rgba(30, 58, 138, 0.06); width: 100%; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;">
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.02rem; color: #1e3a8a; line-height: 1.5; font-weight: 600; display: flex; align-items: flex-start; gap: 9px; flex: 1;">
          <span style="font-size: 1.15rem; line-height: 1.25; flex-shrink: 0;" title="Discussion Prompt">💭</span>
          <span>${formattedQ}</span>
        </div>
        ${hasIdeas
      ? `
          <button type="button" class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-clue btn-think-discuss-toggle" data-action="toggle-think-discuss" data-target-id="${discussId}" onclick="if(window.toggleThinkDiscuss){window.toggleThinkDiscuss(this, '${discussId}');}event.stopPropagation();" title="Click to reveal exemplar discussion points for the class" style="padding: 5px 10px; font-size: 0.78rem; text-transform: none; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; min-width: 140px; gap: 6px; font-weight: 700; cursor: pointer; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex-shrink: 0; white-space: nowrap; margin-top: 1px; box-sizing: border-box;">
            <i class="fa-solid fa-lightbulb"></i> <span class="toggle-label" data-show-text="${showBtnLabel}" data-hide-text="${hideBtnLabel}">${showBtnLabel}</span>
          </button>
        `
      : ''
    }
      </div>
    </div>
  `;

  const panelHtml = hasIdeas
    ? `
    <div id="${discussId}" class="think-discuss-exemplar-panel" style="display: none; margin-top: 14px; padding: 14px 18px; background: #ffffff; border: 1.5px solid #bfdbfe; border-radius: 6px; box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08); width: 100%; box-sizing: border-box;">
      <div style="font-size: 0.74rem; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #e0f2fe; padding-bottom: 6px;">
        <i class="fa-solid ${isExamPrompt ? 'fa-graduation-cap' : 'fa-magnifying-glass-chart'}" style="color: #2563eb; font-size: 0.85rem;"></i> ${panelHeader}
      </div>
      <div style="display: ${isSingle ? 'block' : 'grid'}; ${isSingle ? '' : 'grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 12px;'}">
        ${ideas
      .map(
        (idea, idx) => `
          <div style="display: flex; gap: 9px; align-items: flex-start; font-size: 0.90rem; color: #1e293b; line-height: 1.45; background: #f8fafc; padding: 10px 13px; border-radius: 5px; border-left: 3.5px solid #3b82f6;">
            <span style="font-weight: 800; color: #1d4ed8; font-size: 0.72rem; background: #dbeafe; padding: 2px 6px; border-radius: 3px; flex-shrink: 0; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.03em;">${isSingle ? singleItemBadge : `Point ${idx + 1}`}</span>
            <span style="font-weight: 500;">${idea}</span>
          </div>
        `,
      )
      .join('')}
      </div>
    </div>
  `
    : '';

  return { promptHtml, panelHtml, discussId };
}

export function renderArchivalSourceDiscussionBox(
  questionText,
  sourceObj = {},
  isKs2 = false,
  marginTop = '14px',
) {
  const { promptHtml, panelHtml } = getArchivalSourceDiscussionComponents(
    questionText,
    sourceObj,
    isKs2,
    marginTop,
  );
  if (!promptHtml) return '';
  return `
    <div style="width: 100%; box-sizing: border-box;">
      ${promptHtml}
      ${panelHtml}
    </div>
  `;
}

export function lookupLessonVocabEntry(rawTerm, lessonObj) {
  if (!rawTerm) return { term: '', phonetic: '' };
  if (typeof rawTerm === 'object') {
    const t = String(rawTerm.term || '').trim();
    const p = String(rawTerm.phonetic || rawTerm.pronunciation || '').trim();
    if (p || !lessonObj) return { term: t, phonetic: p };
  }
  const termStr = typeof rawTerm === 'object' ? String(rawTerm.term || '').trim() : String(rawTerm || '').trim();
  if (!termStr) return { term: '', phonetic: '' };
  const list = Array.isArray(lessonObj?.vocab)
    ? lessonObj.vocab
    : Array.isArray(lessonObj?.vocabulary)
      ? lessonObj.vocabulary
      : [];
  const lower = termStr.toLowerCase();
  const match = list.find(
    (v) => v && typeof v === 'object' && String(v.term || '').trim().toLowerCase() === lower,
  );
  const phonetic = match ? String(match.phonetic || match.pronunciation || '').trim() : '';
  return { term: termStr, phonetic };
}

export function renderSpeakableVocabChipHTML(rawTerm, lessonObj = null, opts = {}) {
  const { term, phonetic } = lookupLessonVocabEntry(rawTerm, lessonObj);
  if (!term) return '';
  const safeJs = term
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, ' ');
  const safeAttr = term
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safePhoneticHtml = phonetic
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safePhoneticAttr = safePhoneticHtml.replace(/"/g, '&quot;');
  const speakTitle = phonetic
    ? `Pronounce ${safeAttr} [${safePhoneticAttr}]`
    : `Pronounce ${safeAttr} (British English)`;

  if (opts.interactive === false) {
    return `<button type="button" class="vocab-pronounce-btn wb-static-speak-pill" onclick="event.stopPropagation(); if (window.speakVocabWord) { window.speakVocabWord('${safeJs}', this); }" title="${speakTitle}"><i class="fa-solid fa-volume-high"></i><span>${term}</span>${phonetic ? `<span class="vocab-phonetic-tag">[${safePhoneticHtml}]</span>` : ''}</button>`;
  }

  const isSourceVariant = opts.variant === 'source';
  const baseTitle =
    opts.title ||
    (isSourceVariant
      ? 'In Source / Provenance (useful for quotes & NOP — tap word to cross off)'
      : opts.variant === 'own'
        ? 'External Own Knowledge (beyond the source — tap word to cross off)'
        : 'Tap word to cross off once used');
  const chipTitle = phonetic ? `${baseTitle} • [${safePhoneticAttr}]` : baseTitle;
  const bg = isSourceVariant ? '#eff6ff' : '#f0fdfa';
  const border = isSourceVariant ? '#bfdbfe' : '#99f6e4';
  const color = isSourceVariant ? '#1e40af' : '#115e59';

  return `<span class="wb-interactive-chip wb-vocab-speak-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="${chipTitle}" style="background: ${bg}; border: 1px solid ${border}; color: ${color}; font-size: 0.8rem; font-weight: 700; padding: 2px 6px 2px 9px; border-radius: 12px;"><span class="wb-chip-term-text">${term}</span>${phonetic ? `<span class="wb-chip-phonetic-hint">[${safePhoneticHtml}]</span>` : ''}<button type="button" class="wb-chip-speak-btn no-print" onclick="event.stopPropagation(); if (window.speakVocabWord) { window.speakVocabWord('${safeJs}', this); }" title="${speakTitle}" aria-label="${speakTitle}"><i class="fa-solid fa-volume-high"></i></button></span>`;
}

export function getGoldenSentenceExemplar(lesson, vocabTermsList = []) {
  if (lesson && lesson.vocab_golden_sentence) {
    return lesson.vocab_golden_sentence;
  }
  const terms =
    vocabTermsList && vocabTermsList.length > 0
      ? vocabTermsList
      : lesson && lesson.vocab
        ? lesson.vocab.map((v) => (v.term || '').trim()).filter(Boolean)
        : [];
  const t1 = terms[0] || 'the initial developments';
  const t2 = terms[1] || 'subsequent events';
  return `Although ${t1} significantly shaped the early trajectory of this era, ${t2} proved equally decisive because it fundamentally transformed the social and political balance of power.`;
}
window.getGoldenSentenceExemplar = getGoldenSentenceExemplar;

export function getOddOneOutExemplars(lesson, vocabTermsList = [], isKs2 = false) {
  if (
    lesson &&
    Array.isArray(lesson.vocab_odd_one_out_exemplars) &&
    lesson.vocab_odd_one_out_exemplars.length > 0
  ) {
    return lesson.vocab_odd_one_out_exemplars;
  }
  const isKs2Effective = Boolean(
    isKs2 ||
      (lesson && lesson.is_ks2) ||
      (typeof window !== 'undefined' && String(window.currentUnitId || '').toLowerCase().startsWith('ks2_'))
  );
  const terms =
    vocabTermsList && vocabTermsList.length > 0
      ? vocabTermsList
      : lesson && lesson.vocab
        ? lesson.vocab.map((v) => (v.term || '').trim()).filter(Boolean)
        : [];

  if (terms.length < 3) {
    return [
      {
        title: isKs2Effective ? 'Different Ways to Group Words' : 'Categorical Distinction',
        trio: terms.slice(0, 3),
        odd: terms[0] || 'Term 1',
        reason: isKs2Effective
          ? 'Historians can group words in more than one way — for example by whether they describe real objects, people, or big wartime rules!'
          : 'Multiple valid historical criteria can distinguish these terms depending on whether you group by political authority, economic trade, or ideological perspective.',
      },
    ];
  }

  const t0 = terms[0];
  const t1 = terms[1];
  const t2 = terms[2];
  const t3 = terms[3] || terms[0];
  const last = terms[terms.length - 1];

  if (isKs2Effective) {
    return [
      {
        title: 'Everyday Object or Place vs Big Historical Idea',
        trio: [t0, t1, last],
        odd: last,
        reason: `You could link ${t0} and ${t1} if they describe real objects, places, or roles people saw at the time, while ${last} describes a bigger rule, event, or historical idea.`,
      },
      {
        title: 'People Taking Action vs Rules & Warnings',
        trio: [t0, t1, t2],
        odd: t2,
        reason: `Discuss with your partner: do ${t0} and ${t1} connect to how ordinary families or helpers acted, while ${t2} connects to an official government rule, machine, or warning?`,
      },
      {
        title: 'What Happened First vs What Came Next',
        trio: [t1, t2, t3],
        odd: t1,
        reason: `Check the timeline: did ${t1} happen first as a starting trigger, while ${t2} and ${t3} show how people responded afterwards?`,
      },
    ];
  }

  return [
    {
      title: 'Structural Entity vs Broader Concept / Event',
      trio: [t0, t1, last],
      odd: last,
      reason: `${t0} and ${t1} represent concrete institutions or organized polities of this era, whereas ${last} represents a broader concept, event, or overarching historical perspective.`,
    },
    {
      title: 'Regional / Operational Scope',
      trio: [t0, t1, t2],
      odd: t2,
      reason: `While ${t0} and ${t1} operated primarily within the central political power structures of this period, ${t2} played a distinct economic, religious, or external role.`,
    },
    {
      title: 'Cause vs Systemic Consequence',
      trio: [t1, t2, t3],
      odd: t1,
      reason: `${t1} acted as an initial catalyst, whereas ${t2} and ${t3} were sustained, institutional consequences that developed across multiple generations.`,
    },
  ];
}
window.getOddOneOutExemplars = getOddOneOutExemplars;

/**
 * Pedagogical Visual Source Classifier:
 * Determines whether a historical source is an authentic historical painting/fine artwork
 * eligible for Art Spotlight interactive presentation, or a non-painting (e.g. map, photograph,
 * official treaty, clinical photo, cartoon, newspaper headline, propaganda poster).
 */
export function isPaintingSource(source, extraTitle = '') {
  if (!source) return false;
  if (typeof source.is_artwork === 'boolean') return source.is_artwork;
  if (typeof source.is_painting === 'boolean') return source.is_painting;

  const rawTitle = (source.title || '') + ' ' + (extraTitle || '');
  const rawCaption = source.caption || '';
  const rawCitation = source.citation || '';
  const rawMedium = source.medium || '';
  const rawType = source.type || '';
  const combinedText = [
    rawTitle,
    rawCaption,
    rawCitation,
    rawMedium,
    rawType,
    source.provenance || '',
  ]
    .join(' ')
    .toLowerCase();

  // Strong negative indicators - definitely NOT a painting (maps, photos, text documents, coins, prints)
  const strongNonArt =
    /\b(map|cartographic|cartography|chart|diagram|aerial|reconnaissance|photograph|photo\b|snapshot|medical photograph|clinical photograph|film still|press photo|document|treaty|telegram|dispatch|statute|census|record|letter|diary|oral testimony|speech|proclamation|edict|newspaper|headline|front page|broadside|notice|poster|ration book|medal|plaque|coin|graffiti|artefact|artifact|trench network|engraving|woodcut|copperplate|lithograph|etching)\b/i;

  // Explicit mediums indicating a painting
  if (
    rawMedium &&
    /\b(oil|canvas|panel|fresco|watercolor|watercolour|tempera|gouache|mural)\b/i.test(rawMedium)
  ) {
    return true;
  }

  // Explicit source type
  if (rawType === 'painting' || rawType === 'artwork') {
    return true;
  }

  // Strong painting indicators in text
  const strongPainting =
    /\b(oil on canvas|oil on panel|oil on wood|oil on copper|oil on board|fresco|watercolor|watercolour|tempera|gouache|mural|oil painting|altarpiece|triptych|masterpiece|armada portrait|painted by|court painter)\b/i;

  if (strongPainting.test(combinedText)) {
    // If it says "oil on canvas" / "oil painting" / "fresco", it's a painting
    if (/\b(oil on (canvas|panel|wood|board)|oil painting|fresco|tempera)\b/i.test(combinedText)) {
      return true;
    }
    // If the title itself designates a map, chart, or photo, reject
    if (strongNonArt.test(rawTitle)) {
      return false;
    }
    return true;
  }

  // Check if title explicitly describes it as a painting (e.g. "Primary Oil Painting", "Contemporary Painting")
  if (/\b(painting|painted)\b/i.test(rawTitle) && !strongNonArt.test(rawTitle)) {
    return true;
  }

  // Check if caption explicitly describes it as a painting (e.g. "West's painting", "famous painting", "iconic oil painting")
  if (
    /\b([a-z]+['’]s\s+painting|famous\s+painting|contemporary\s+painting|historical\s+painting|iconic\s+painting)\b/i.test(
      rawCaption,
    ) &&
    !strongNonArt.test(rawTitle)
  ) {
    return true;
  }

  // Famous Old Masters / painters explicitly named in citation or title
  if (
    /\b(holbein|cranach|van dyck|vel[aá]zquez|rembrandt|goya|vermeer|rubens|titian|michelangelo|raphael|brueghel|delacroix|werner|bettannier|orpen|turner|constable)\b/i.test(
      combinedText,
    )
  ) {
    if (!strongNonArt.test(rawTitle)) {
      return true;
    }
  }

  return false;
}
window.isPaintingSource = isPaintingSource;

export function getRetrievalStarterActions(lesson, currentUnitId) {
  if (currentUnitId === 'cme_new') {
    let kt = 'KT1';
    let pIdx = 0;
    const lTitle = lesson.title || '';
    const lId = lesson.id || '';
    if (
      lTitle.startsWith('KT1') ||
      ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4'].includes(lId)
    ) {
      kt = 'KT1';
      if (lTitle.includes('KT1.1') || lId === 'lesson_2') pIdx = 1;
      else if (lTitle.includes('KT1.2') || lId === 'lesson_3') pIdx = 2;
      else if (lTitle.includes('KT1.3') || lId === 'lesson_4') pIdx = 3;
      else pIdx = 0;
    } else if (lTitle.startsWith('KT2') || ['lesson_5', 'lesson_6', 'lesson_7'].includes(lId)) {
      kt = 'KT2';
      if (lTitle.includes('KT2.1') || lId === 'lesson_5') pIdx = 0;
      else if (lTitle.includes('KT2.2') || lId === 'lesson_6') pIdx = 1;
      else if (lTitle.includes('KT2.3') || lId === 'lesson_7') pIdx = 2;
    } else if (lTitle.startsWith('KT3') || ['lesson_8', 'lesson_9', 'lesson_10'].includes(lId)) {
      kt = 'KT3';
      if (lTitle.includes('KT3.1') || lId === 'lesson_8') pIdx = 0;
      else if (lTitle.includes('KT3.2') || lId === 'lesson_9') pIdx = 1;
      else if (lTitle.includes('KT3.3') || lId === 'lesson_10') pIdx = 2;
    }

    const shortCode = lTitle.split(':')[0].trim();
    return `
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <a href="/units/cme_new/mastery_pack_${kt}.html#practice-mode&part=${pIdx}" target="_blank" style="display: inline-flex; align-items: center; gap: 7px; font-size: 0.86rem; padding: 7px 14px; background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 6px; box-shadow: 0 2px 6px rgba(79,70,229,0.3); transition: all 0.15s ease;" onmouseover="this.style.filter='brightness(1.1)';" onmouseout="this.style.filter='brightness(1)';">
          <i class="fa-solid fa-bolt" style="color: #fde047;"></i>
          Launch ${shortCode} Leitner Drill (20 Cards)
        </a>
        <a href="/units/cme_new/mastery_pack_${kt}.html#practice-mode&part=${pIdx}&teacher=true" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.86rem; padding: 7px 12px; background: #ffffff; color: #4338ca; border: 1.5px solid #c7d2fe; text-decoration: none; font-weight: 600; border-radius: 6px; transition: all 0.15s ease;" title="Launch classroom whiteboard presentation with 15s timer" onmouseover="this.style.background='#eef2ff';" onmouseout="this.style.background='#ffffff';">
          <i class="fa-solid fa-chalkboard-user"></i>
          Whiteboard
        </a>
        <button class="btn btn-secondary" data-action="switch-view" data-view="interactive" data-unit="cme_new" style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.84rem; padding: 6px 12px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-weight: 600; border-radius: 6px; cursor: pointer;">
          <i class="fa-solid fa-circle-question"></i>
          All Decks
        </button>
      </div>
    `;
  }

  return `
    <button class="btn btn-primary" data-action="switch-view" data-view="interactive" data-unit="${currentUnitId || ''}" style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.88rem; padding: 8px 16px; background: #2563eb; color: #ffffff; border: none; font-weight: 600; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 5px rgba(37,99,235,0.25); transition: all 0.2s ease;">
      <i class="fa-solid fa-circle-question" style="color: #fde047;"></i>
      Jump to Unit Quizzing
    </button>
  `;
}

export function renderDoNowInlineTimerHTML(timerId = 'donow-timer') {
  return `
    <div class="donow-inline-timer-bar" id="${timerId}-bar" style="display: inline-flex; align-items: center; gap: 5px; flex-wrap: wrap; background: #ffffff; border: 1.2px solid #cbd5e1; border-radius: 20px; padding: 2.5px 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
      <i class="fa-solid fa-stopwatch" style="color: #0284c7; font-size: 0.85rem; margin-left: 2px;"></i>
      <span id="${timerId}-display" style="font-size: 0.95rem; font-weight: 800; font-family: 'Courier New', monospace; color: #0f172a; min-width: 44px; text-align: center;">05:00</span>
      <span id="${timerId}-summary-badge" style="display: none;">05:00</span>
      <span id="${timerId}-mode-pill" style="display: none;">5 Mins</span>
      
      <div id="${timerId}-presets" style="display: inline-flex; align-items: center; gap: 3px;">
        <button type="button" class="btn-timer-pill" data-sec="180" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 180);" style="padding: 1px 6px; font-size: 0.7rem; font-weight: 700; border-radius: 10px; border: 1px solid #cbd5e1; background: #ffffff; color: #475569; cursor: pointer;" title="3 minutes">3m</button>
        <button type="button" class="btn-timer-pill active-preset" data-sec="300" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 300);" style="padding: 1px 6px; font-size: 0.7rem; font-weight: 700; border-radius: 10px; border: 1.2px solid #0284c7; background: #e0f2fe; color: #0284c7; cursor: pointer;" title="5 minutes">5m</button>
        <button type="button" class="btn-timer-pill" data-sec="480" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 480);" style="padding: 1px 6px; font-size: 0.7rem; font-weight: 700; border-radius: 10px; border: 1px solid #cbd5e1; background: #ffffff; color: #475569; cursor: pointer;" title="8 minutes">8m</button>
        <button type="button" class="btn-timer-pill" data-sec="600" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 600);" style="padding: 1px 6px; font-size: 0.7rem; font-weight: 700; border-radius: 10px; border: 1px solid #cbd5e1; background: #ffffff; color: #475569; cursor: pointer;" title="10 minutes">10m</button>
        <button type="button" class="btn-timer-pill" data-sec="900" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 900);" style="padding: 1px 6px; font-size: 0.7rem; font-weight: 700; border-radius: 10px; border: 1px solid #cbd5e1; background: #ffffff; color: #475569; cursor: pointer;" title="15 minutes">15m</button>
      </div>

      <div style="display: inline-flex; align-items: center; gap: 2px; border-left: 1px solid #e2e8f0; padding-left: 4px;">
        <button type="button" id="${timerId}-sub1-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'sub1');" style="padding: 1px 5px; font-size: 0.68rem; font-weight: 700; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569; cursor: pointer;" title="Subtract 1 minute">−1m</button>
        <button type="button" id="${timerId}-add1-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'add1');" style="padding: 1px 5px; font-size: 0.68rem; font-weight: 700; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569; cursor: pointer;" title="Add 1 minute">+1m</button>
      </div>

      <button type="button" class="btn-timer-ctl" id="${timerId}-start-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'start');" style="padding: 2px 8px; font-weight: 700; font-size: 0.73rem; border-radius: 12px; cursor: pointer; background: #0284c7; color: #ffffff; border: none; display: inline-flex; align-items: center; gap: 3px;" title="Start countdown">
        <i class="fa-solid fa-play" style="font-size: 0.6rem;"></i> Start
      </button>
      <button type="button" class="btn-timer-ctl" id="${timerId}-pause-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'pause');" style="padding: 2px 8px; font-weight: 700; font-size: 0.73rem; border-radius: 12px; cursor: pointer; background: #f59e0b; color: #ffffff; border: none; display: none; align-items: center; gap: 3px;" title="Pause countdown">
        <i class="fa-solid fa-pause" style="font-size: 0.6rem;"></i> Pause
      </button>
      <button type="button" id="${timerId}-reset-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'reset');" style="padding: 2px 5px; font-size: 0.72rem; color: #64748b; background: transparent; border: none; cursor: pointer;" title="Reset timer">
        <i class="fa-solid fa-rotate-right"></i>
      </button>
      <button type="button" id="${timerId}-sound-btn" onclick="event.stopPropagation(); window.toggleDoNowTimerSound('${timerId}');" style="padding: 2px 5px; font-size: 0.72rem; color: #64748b; background: transparent; border: none; cursor: pointer;" title="Toggle audio chime">
        <i class="fa-solid fa-bell-slash" id="${timerId}-sound-icon"></i>
      </button>
    </div>
  `;
}

export function renderDoNowHeaderWithTimerHTML({
  timerId = 'donow-timer',
  title = 'Do Now Tasks',
  badgeText = 'Prior Knowledge',
  icon = 'fa-solid fa-list-check',
  showRevealAll = true,
  includeTimer = true,
}) {
  return `
    <div class="donow-streamlined-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 8px;">
      <!-- Title & Pedagogical Badge -->
      <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex-wrap: wrap;">
        <span style="font-weight: 800; font-size: 0.92rem; color: #0f172a; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;">
          <i class="${icon}" style="color: #0284c7;"></i> ${title}
        </span>
        ${badgeText ? `<span style="font-size: 0.68rem; font-weight: 700; color: #475569; background: #f1f5f9; border: 1px solid #e2e8f0; padding: 1.5px 7px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.4px;">${badgeText}</span>` : '<!--DONOW_SUBTITLE_SLOT-->'}
      </div>

      <!-- Discreet Inline Stopwatch Timer -->
      ${includeTimer ? renderDoNowInlineTimerHTML(timerId) : ''}

      <!-- Actions on Far Right: Reveal All Answers -->
      <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
        ${showRevealAll
      ? `
          <button class="btn btn-secondary btn-sm" data-action="toggle-all-answers" onclick="if(window.toggleAllAnswers){window.toggleAllAnswers(this);}event.stopPropagation();" style="font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 6px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-eye" style="color: #0284c7; font-size: 0.72rem;"></i>
            <span>Reveal All Answers</span>
          </button>
        `
      : ''
    }
      </div>
    </div>
  `;
}

export function renderDoNowTimerBarHTML(timerId = 'donow-timer') {
  return `
    <div class="donow-timer-bar" id="${timerId}-bar" style="grid-column: 1 / -1; width: 100%; display: flex; flex-direction: column; gap: 8px; background: #ffffff; border: 1.5px solid #cbd5e1; border-left: 4px solid #0284c7; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); box-sizing: border-box;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <!-- Left: Stopwatch icon + display + mode -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 34px; height: 34px; border-radius: 6px; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
            <i class="fa-solid fa-stopwatch"></i>
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Retrieval Timer</span>
              <span id="${timerId}-mode-pill" style="font-size: 0.7rem; font-weight: 700; color: #0369a1; background: #f0f9ff; padding: 1px 6px; border-radius: 10px; border: 1px solid #bae6fd;">5 Mins</span>
            </div>
            <div style="font-size: 1.35rem; font-weight: 800; font-family: 'Courier New', monospace; color: #0f172a; line-height: 1.1;" id="${timerId}-display">05:00</div>
          </div>
        </div>

        <!-- Center: Quick Preset Pills (Flexi Timer for Teachers) -->
        <div class="timer-preset-pills" id="${timerId}-presets" style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
          <span style="font-size: 0.72rem; font-weight: 700; color: #64748b; margin-right: 2px;">Presets:</span>
          <button type="button" class="btn-timer-pill" data-sec="120" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 120);" style="padding: 3px 8px; font-size: 0.75rem; font-weight: 700; border-radius: 4px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; cursor: pointer;">2m</button>
          <button type="button" class="btn-timer-pill" data-sec="180" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 180);" style="padding: 3px 8px; font-size: 0.75rem; font-weight: 700; border-radius: 4px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; cursor: pointer;">3m</button>
          <button type="button" class="btn-timer-pill active-preset" data-sec="300" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 300);" style="padding: 3px 8px; font-size: 0.75rem; font-weight: 700; border-radius: 4px; border: 1.5px solid #0284c7; background: #e0f2fe; color: #0369a1; cursor: pointer;">5m</button>
          <button type="button" class="btn-timer-pill" data-sec="480" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 480);" style="padding: 3px 8px; font-size: 0.75rem; font-weight: 700; border-radius: 4px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; cursor: pointer;">8m</button>
          <button type="button" class="btn-timer-pill" data-sec="600" onclick="event.stopPropagation(); window.setDoNowTimerPreset('${timerId}', 600);" style="padding: 3px 8px; font-size: 0.75rem; font-weight: 700; border-radius: 4px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; cursor: pointer;">10m</button>
        </div>

        <!-- Right: Controls (Start / Pause / Reset / +/- 1m / Mute) -->
        <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary btn-sm" id="${timerId}-start-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'start');" style="padding: 5px 12px; font-weight: 700; font-size: 0.82rem; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; background: #0284c7; color: #fff; border: none;">
            <i class="fa-solid fa-play"></i> Start
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="${timerId}-pause-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'pause');" style="padding: 5px 12px; font-size: 0.82rem; font-weight: 600; border-radius: 6px; cursor: pointer; display: none; align-items: center; gap: 5px;">
            <i class="fa-solid fa-pause"></i> Pause
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="${timerId}-sub1-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'sub1');" style="padding: 5px 8px; font-size: 0.8rem; font-weight: 700; border-radius: 6px; cursor: pointer;" title="Subtract 1 minute">-1m</button>
          <button type="button" class="btn btn-secondary btn-sm" id="${timerId}-add1-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'add1');" style="padding: 5px 8px; font-size: 0.8rem; font-weight: 700; border-radius: 6px; cursor: pointer;" title="Add 1 minute">+1m</button>
          <button type="button" class="btn btn-secondary btn-sm" id="${timerId}-reset-btn" onclick="event.stopPropagation(); window.toggleDoNowTimer('${timerId}', 'reset');" style="padding: 5px 10px; font-size: 0.82rem; font-weight: 600; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;" title="Reset timer to start of chosen duration">
            <i class="fa-solid fa-rotate-right"></i> Reset
          </button>
          <button type="button" class="btn btn-secondary btn-sm" id="${timerId}-sound-btn" onclick="event.stopPropagation(); window.toggleDoNowTimerSound('${timerId}');" style="padding: 5px 8px; font-size: 0.8rem; font-weight: 600; border-radius: 6px; cursor: pointer;" title="Toggle audio chime on/off">
            <i class="fa-solid fa-bell-slash" id="${timerId}-sound-icon" style="color: #64748b;"></i>
          </button>
        </div>
      </div>

      <!-- Slim Visual Progress Bar -->
      <div style="width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden;">
        <div id="${timerId}-progress" style="width: 100%; height: 100%; background: #0284c7; transition: width 0.5s linear, background 0.3s ease;"></div>
      </div>
    </div>
  `;
}

export function parseDurationMinutes(durationStr) {
  if (!durationStr || typeof durationStr !== 'string') return 0;
  const colonMatch = durationStr.match(/(?:(\d+):)?(\d+):(\d+)/);
  if (colonMatch) {
    const hours = colonMatch[1] ? parseInt(colonMatch[1], 10) : 0;
    const minutes = parseInt(colonMatch[2], 10);
    return hours * 60 + minutes;
  }
  let mins = 0;
  const hrMatch = durationStr.match(/(\d+)\s*(?:h|hr|hour)/i);
  if (hrMatch) mins += parseInt(hrMatch[1], 10) * 60;
  const minMatch = durationStr.match(/(\d+)\s*(?:m|min|minute)/i);
  if (minMatch) mins += parseInt(minMatch[1], 10);
  return mins;
}

export function resolveVideoPathway(vid) {
  const mins = parseDurationMinutes(vid.duration);
  let pathway = vid.pathway;
  let guidance = vid.teacher_guidance;
  let icon = 'fa-solid fa-route';

  if (!pathway) {
    if (mins > 0 && mins < 5) {
      pathway = 'Quick Summary';
    } else if (mins >= 15) {
      pathway = 'Documentary';
    } else {
      pathway = 'Core Overview';
    }
  }

  const pLower = pathway.toLowerCase();
  if (
    pLower.includes('quick') ||
    pLower.includes('starter') ||
    pLower.includes('summary') ||
    pLower.includes('recap')
  ) {
    icon = 'fa-solid fa-bolt';
  } else if (
    pLower.includes('cinema') ||
    pLower.includes('dramatisation') ||
    pLower.includes('trailer') ||
    pLower.includes('film')
  ) {
    icon = 'fa-solid fa-clapperboard';
  } else if (pLower.includes('israeli')) {
    icon = 'fa-solid fa-landmark';
  } else if (pLower.includes('palestinian') || pLower.includes('arab')) {
    icon = 'fa-solid fa-users';
  } else if (
    pLower.includes('deep') ||
    pLower.includes('documentary') ||
    pLower.includes('in-depth') ||
    pLower.includes('tactics') ||
    pLower.includes('mechanics') ||
    pLower.includes('masterclass')
  ) {
    icon = 'fa-solid fa-magnifying-glass-chart';
  } else if (
    pLower.includes('context') ||
    pLower.includes('causes') ||
    pLower.includes('strategic')
  ) {
    icon = 'fa-solid fa-globe';
  } else if (pLower.includes('alliance') || pLower.includes('camp')) {
    icon = 'fa-solid fa-handshake';
  } else if (
    pLower.includes('balkan') ||
    pLower.includes('flashpoint') ||
    pLower.includes('narrative')
  ) {
    icon = 'fa-solid fa-fire';
  }

  if (!guidance) {
    if (mins > 0 && mins < 5) {
      guidance = 'Ideal for starter recaps, rapid retrieval hooks, or SEN visual scaffolding.';
    } else if (mins >= 15) {
      guidance = 'Recommended for flipped homework, independent research, or high-attainer depth.';
    } else {
      guidance = 'Recommended for direct whole-class instruction or guided dual-coding notes.';
    }
  }

  return { pathway, guidance, icon };
}

export function renderCausalDominoSpine(spine) {
  if (!spine || !Array.isArray(spine.stages) || spine.stages.length === 0) return '';
  const stages = spine.stages;

  const connectives = [
    'In direct reaction to this...',
    'Alarmed by Soviet arms, the West...',
    'Outraged by canal seizure, Eden colludes...',
    'Furious at unapproved war, Eisenhower ultimatums...',
  ];

  let stagesHtml = stages
    .map((s, idx) => {
      const isLast = idx === stages.length - 1;
      const connective = !isLast ? s.connective || connectives[idx] || 'Consequently...' : null;

      return `
      <div class="causal-domino-card" data-stage="${s.step}" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-top: 4px solid ${idx === 4 ? '#10b981' : '#0284c7'}; border-radius: 8px; padding: 12px 10px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.04); min-width: 0; box-sizing: border-box; position: relative;">
        <div>
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-bottom: 6px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 800; color: #0284c7; text-align: right; line-height: 1.25;" title="${s.date}">${s.date}</span>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 0.63rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 5px; line-height: 1.35;" title="${s.tag} • ${s.actor}">
            ${s.tag} &bull; <strong style="color: #334155;">${s.actor}</strong>
          </div>
          <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.98rem; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; line-height: 1.25; min-height: 2.4em;">
            ${s.title}
          </h4>

          <!-- Row 1: The Action / Trigger -->
          <div style="background: #f8fafc; border-left: 3px solid #0284c7; padding: 6px 8px; border-radius: 0 4px 4px 0; margin-bottom: 8px;">
            <div style="font-size: 0.62rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px;">
              Action / Trigger:
            </div>
            <div style="font-size: 0.78rem; color: #1e293b; line-height: 1.35;">
              ${s.trigger}
            </div>
          </div>

          <!-- Row 2: The 'Because' (Motive) -->
          <div class="domino-because-box" style="background: #fefce8; border-left: 3px solid #eab308; padding: 6px 8px; border-radius: 0 4px 4px 0; margin-bottom: 8px;">
            <div style="font-size: 0.62rem; font-weight: 800; color: #854d0e; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px;">
              Motive:
            </div>
            <div class="domino-content-model" style="font-size: 0.78rem; color: #713f12; line-height: 1.35;">
              ${s.because}
            </div>
            <div class="domino-content-practice" style="display: none; font-size: 0.74rem; color: #a16207; font-style: italic; background: rgba(254, 240, 138, 0.45); padding: 4px 6px; border-radius: 4px; border: 1px dashed #fde047;">
              ❓ <em>Why did they take this action? (Recall motive...)</em>
            </div>
          </div>

          <!-- Row 3: The 'Therefore' (Consequence) -->
          <div class="domino-therefore-box" style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 6px 8px; border-radius: 0 4px 4px 0; margin-bottom: 8px;">
            <div style="font-size: 0.62rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px;">
              Consequence:
            </div>
            <div class="domino-content-model" style="font-size: 0.78rem; color: #14532d; line-height: 1.35;">
              ${s.therefore}
            </div>
            <div class="domino-content-practice" style="display: none; font-size: 0.74rem; color: #15803d; font-style: italic; background: rgba(187, 247, 208, 0.45); padding: 4px 6px; border-radius: 4px; border: 1px dashed #86efac;">
              ⚡ <em>What direct outcome occurred? (Recall result...)</em>
            </div>
          </div>

          <!-- Per-Card Interactive Reveal Button (Practice Mode) -->
          <button type="button" class="domino-card-reveal-btn" id="btn-reveal-stage-${s.step}" onclick="window.revealSingleStage(${s.step})" style="display: none; width: 100%; margin-top: 4px; margin-bottom: 6px; padding: 5px 8px; font-size: 0.72rem; font-weight: 700; background: #0284c7; color: #ffffff; border: none; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;">
            <i class="fa-solid fa-eye"></i> Click to Reveal Stage ${s.step} Motive &amp; Result
          </button>

          <!-- Connective Step Banner -->
          ${connective
          ? `
            <div style="margin: 4px 0 8px 0; padding: 4px 6px; background: #eff6ff; border: 1px dashed #bfdbfe; border-radius: 4px; font-size: 0.68rem; color: #1e40af; font-weight: 700; line-height: 1.25; text-align: center;">
              <i class="fa-solid fa-arrow-down" style="color: #2563eb; display: block; margin-bottom: 2px;"></i>
              ${connective}
            </div>
          `
          : ''
        }
        </div>

        <!-- Exam Link Footer -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: auto;">
          <div style="display: flex; align-items: flex-start; gap: 4px; font-size: 0.68rem; font-weight: 700; color: #475569; line-height: 1.25;">
            <i class="fa-solid fa-bullseye" style="color: #dc2626; margin-top: 2px; flex-shrink: 0;"></i>
            <span>${s.exam_link}</span>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  return `
    <section class="causal-domino-section" id="causal-domino-scaffold" style="margin: 30px 0 35px 0; background: #ffffff; border: 2px solid #0f172a; border-radius: 10px; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08); overflow: hidden;">
      <style>
        .causal-domino-grid-layout {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          padding: 16px;
          background: #f8fafc;
          box-sizing: border-box;
          width: 100%;
          overflow-x: hidden;
        }
        @media (max-width: 1024px) {
          .causal-domino-grid-layout {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }
        }
        @media (max-width: 680px) {
          .causal-domino-grid-layout {
            grid-template-columns: 1fr;
          }
        }
        .btn-domino-mode {
          transition: all 0.15s ease;
        }
        .btn-domino-mode:hover {
          filter: brightness(1.1);
        }
      </style>

      <!-- Scaffold Header Bar -->
      <div style="background: #0f172a; color: #ffffff; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="background: #eab308; color: #000000; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 900; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
            BOARD MODE &bull; PRE-EXAM CAUSAL CONSOLIDATION
          </span>
          <div>
            <h3 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; font-weight: 800; color: #ffffff;">
              ${spine.title}
            </h3>
            <div style="font-family: 'Inter', sans-serif; font-size: 0.76rem; color: #cbd5e1; margin-top: 2px;">
              ${spine.subtitle}
            </div>
          </div>
        </div>

        <!-- Mode Toggle & Copy Actions -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <!-- Dual Mode Toggle Button Group -->
          <div style="display: inline-flex; background: #1e293b; border-radius: 6px; padding: 2px; border: 1px solid #334155;">
            <button type="button" id="domino-btn-model" class="btn-domino-mode active" onclick="window.switchDominoMode('model')" style="padding: 5px 12px; font-size: 0.74rem; font-weight: 800; background: #0284c7; color: #ffffff; border: none; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
              <i class="fa-solid fa-chalkboard-user"></i> Full Model
            </button>
            <button type="button" id="domino-btn-practice" class="btn-domino-mode" onclick="window.switchDominoMode('practice')" style="padding: 5px 12px; font-size: 0.74rem; font-weight: 800; background: transparent; color: #94a3b8; border: none; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
              <i class="fa-solid fa-mask"></i> Active Recall Quiz
            </button>
          </div>
          <button type="button" onclick="window.copyDominoNotes()" id="btn-copy-domino" style="padding: 6px 12px; font-size: 0.74rem; font-weight: 700; background: #334155; color: #f8fafc; border: 1px solid #475569; border-radius: 5px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;" title="Copy all 5 stages as text notes to paste into your book/OneNote">
            <i class="fa-solid fa-copy"></i> Copy Notes
          </button>
        </div>
      </div>

      <!-- Live Interactive Status Banner -->
      <div id="domino-status-banner" style="background: #ecfdf5; border-bottom: 1px solid #a7f3d0; padding: 7px 18px; font-size: 0.8rem; font-weight: 700; color: #065f46; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span id="domino-status-text" style="display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> <strong>Teacher Answer Key Active:</strong> All 5 causal triggers, motives, and consequences are fully revealed for whole-class board instruction.
        </span>
        <span style="font-size: 0.72rem; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">
          <i class="fa-solid fa-graduation-cap"></i> Edexcel Paper 2 Synthesis Bridge
        </span>
      </div>

      <!-- Strategy Strip -->
      <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 8px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 0.8rem; color: #475569;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-lightbulb" style="color: #eab308; font-size: 0.95rem;"></i>
          <span><strong>The 3-Step Disciplinary Rule:</strong> To write an 8-mark Paper 2 narrative account, record <strong>1. The Action</strong> &rarr; <strong>2. The 'Because' (Motive)</strong> &rarr; <strong>3. The 'Therefore' (Consequence)</strong>.</span>
        </div>
        <span style="font-size: 0.72rem; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">
          5-Stage Non-Scrollable Smartboard View
        </span>
      </div>

      <!-- 5-Stage Non-Scrollable Grid Container -->
      <div class="causal-domino-grid-layout">
        ${stagesHtml}
      </div>
    </section>
  `;
}

// Client helper bindings
if (typeof window !== 'undefined') {
  window.switchDominoMode = function (mode) {
    const btnModel = document.getElementById('domino-btn-model');
    const btnPractice = document.getElementById('domino-btn-practice');
    const statusBanner = document.getElementById('domino-status-banner');
    const statusText = document.getElementById('domino-status-text');
    const modelEls = document.querySelectorAll('.domino-content-model');
    const practiceEls = document.querySelectorAll('.domino-content-practice');
    const revealBtns = document.querySelectorAll('.domino-card-reveal-btn');

    if (mode === 'practice') {
      if (btnModel) {
        btnModel.style.background = 'transparent';
        btnModel.style.color = '#94a3b8';
        btnModel.classList.remove('active');
      }
      if (btnPractice) {
        btnPractice.style.background = '#0284c7';
        btnPractice.style.color = '#ffffff';
        btnPractice.classList.add('active');
      }
      if (statusBanner && statusText) {
        statusBanner.style.background = '#fffbeb';
        statusBanner.style.borderBottom = '1px solid #fde68a';
        statusBanner.style.color = '#92400e';
        statusText.innerHTML =
          '<i class="fa-solid fa-pen-to-square" style="color: #f59e0b;"></i> <strong>Student Practice Mode Active:</strong> Motives & results are blanked out. Tap "Reveal Stage" on any card below to reveal step-by-step.';
      }
      modelEls.forEach((el) => (el.style.display = 'none'));
      practiceEls.forEach((el) => (el.style.display = 'block'));
      revealBtns.forEach((el) => (el.style.display = 'block'));
    } else {
      if (btnModel) {
        btnModel.style.background = '#0284c7';
        btnModel.style.color = '#ffffff';
        btnModel.classList.add('active');
      }
      if (btnPractice) {
        btnPractice.style.background = 'transparent';
        btnPractice.style.color = '#94a3b8';
        btnPractice.classList.remove('active');
      }
      if (statusBanner && statusText) {
        statusBanner.style.background = '#ecfdf5';
        statusBanner.style.borderBottom = '1px solid #a7f3d0';
        statusBanner.style.color = '#065f46';
        statusText.innerHTML =
          '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> <strong>Teacher Answer Key Active:</strong> All 5 causal triggers, motives, and consequences are fully revealed for whole-class board instruction.';
      }
      modelEls.forEach((el) => (el.style.display = 'block'));
      practiceEls.forEach((el) => (el.style.display = 'none'));
      revealBtns.forEach((el) => (el.style.display = 'none'));
    }
  };

  window.revealSingleStage = function (step) {
    const card = document.querySelector(`.causal-domino-card[data-stage="${step}"]`);
    if (!card) return;
    const modelEls = card.querySelectorAll('.domino-content-model');
    const practiceEls = card.querySelectorAll('.domino-content-practice');
    const btn = document.getElementById(`btn-reveal-stage-${step}`);

    const isCurrentlyHidden = modelEls[0] && modelEls[0].style.display === 'none';
    if (isCurrentlyHidden) {
      modelEls.forEach((el) => (el.style.display = 'block'));
      practiceEls.forEach((el) => (el.style.display = 'none'));
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Stage ${step} Revealed (Hide)`;
        btn.style.background = '#16a34a';
      }
    } else {
      modelEls.forEach((el) => (el.style.display = 'none'));
      practiceEls.forEach((el) => (el.style.display = 'block'));
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-eye"></i> Reveal Stage ${step} Model`;
        btn.style.background = '#0284c7';
      }
    }
  };

  window.copyDominoNotes = function () {
    const cards = document.querySelectorAll('.causal-domino-card, .cme-spine-card');
    if (!cards || cards.length === 0) return;
    const titleEl = document.querySelector(
      '#causal-domino-scaffold h3, #lesson-chronology-spine summary span',
    );
    const rawTitle = titleEl ? titleEl.textContent.trim() : '5-Stage Causal Domino Chain';
    const pageTitle = rawTitle.replace(/\s+/g, ' ');
    let out =
      `${pageTitle} (Edexcel Paper 2)\n` +
      '===================================================================\n\n';
    cards.forEach((c) => {
      const stage = c.dataset.stage || '';
      const title = c.querySelector('h4, h5')?.textContent?.trim() || '';
      const question =
        c
          .querySelector('.cme-spine-question')
          ?.textContent?.replace(/Workbook Enquiry:/i, '')
          ?.trim() || '';
      const trigger =
        c.querySelector('.cme-action-content')?.textContent?.trim() ||
        c.querySelector('.cme-spine-desc')?.textContent?.trim() ||
        '';
      const because =
        c.querySelector('.cme-motive-content')?.textContent?.trim() ||
        c.querySelector('.cme-spine-motive')?.textContent?.trim() ||
        '';
      const therefore =
        c.querySelector('.cme-outcome-content')?.textContent?.trim() ||
        c.querySelector('.cme-spine-therefore')?.textContent?.trim() ||
        '';
      const connective =
        c.querySelector('.cme-chain-content')?.textContent?.trim() ||
        c.querySelector('.cme-spine-consequence')?.textContent?.trim() ||
        '';

      out += `STAGE ${stage}: ${title}\n`;
      if (question) out += `• Enquiry Question: ${question}\n`;
      if (trigger) out += `• 1. Action / Trigger: ${trigger}\n`;
      if (because) out += `• 2. Motive (Why): ${because}\n`;
      if (therefore) out += `• 3. Outcome (Consequence): ${therefore}\n`;
      if (connective) out += `• 4. Domino Link: ${connective}\n`;
      out += '\n';
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out).then(() => {
        const btn =
          document.getElementById('btn-copy-domino') ||
          document.querySelector('.cme-chronology-spine button[onclick*="copyDominoNotes"]');
        if (btn) {
          const orig = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied Notes!';
          btn.style.background = '#16a34a';
          btn.style.color = '#ffffff';
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        }
      });
    }
  };

  function updateMasterSpineToggleState() {
    const spine = document.getElementById('lesson-chronology-spine');
    if (!spine) return;
    const masterBtn =
      spine.querySelector('.btn-toggle-all-stages') ||
      spine.querySelector('.btn-toggle-all-consequences');
    if (!masterBtn) return;
    const bodies = spine.querySelectorAll('.spine-stage-body');
    if (bodies.length === 0) return;
    const allOpen = Array.from(bodies).every(
      (b) => b.style.display === 'flex' || b.style.display === 'block',
    );
    const labelSpan =
      masterBtn.querySelector('.toggle-stage-text') ||
      masterBtn.querySelector('.toggle-consequence-text');
    const icon = masterBtn.querySelector('i');
    if (labelSpan) {
      labelSpan.textContent = allOpen ? 'Collapse All Stages' : 'Reveal All Stages';
    }
    if (icon) {
      icon.className = allOpen ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    }
  }

  window.toggleCardSpineStage = function (btn) {
    if (!btn) return;
    const card = btn.closest('.universal-spine-card') || btn.parentElement;
    if (!card) return;
    const body = card.querySelector('.spine-stage-body');
    const chevron = btn.querySelector('.stage-chevron');
    const label = btn.querySelector('.stage-toggle-label');
    if (!body) return;
    const isClosed = body.style.display === 'none' || !body.style.display;
    body.style.display = isClosed ? 'flex' : 'none';
    btn.setAttribute('aria-expanded', isClosed ? 'true' : 'false');
    btn.style.borderColor = isClosed ? '#0284c7' : '#cbd5e1';
    btn.style.background = isClosed ? '#f0f9ff' : '#f8fafc';
    if (chevron) {
      chevron.style.transform = isClosed ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    if (label) {
      label.textContent = isClosed ? 'Hide' : 'Reveal';
    }
    updateMasterSpineToggleState();
  };
  window.toggleCardConsequence = window.toggleCardSpineStage;

  window.toggleAllSpineStages = function (btn) {
    const spine = document.getElementById('lesson-chronology-spine');
    if (!spine) return;
    const bodies = spine.querySelectorAll('.spine-stage-body');
    const buttons = spine.querySelectorAll('.spine-question-toggle-card');
    const anyClosed = Array.from(bodies).some(
      (b) => b.style.display === 'none' || !b.style.display,
    );
    bodies.forEach((b) => {
      b.style.display = anyClosed ? 'flex' : 'none';
    });
    buttons.forEach((btnEl) => {
      btnEl.setAttribute('aria-expanded', anyClosed ? 'true' : 'false');
      btnEl.style.borderColor = anyClosed ? '#0284c7' : '#cbd5e1';
      btnEl.style.background = anyClosed ? '#f0f9ff' : '#f8fafc';
      const chevron = btnEl.querySelector('.stage-chevron');
      const label = btnEl.querySelector('.stage-toggle-label');
      if (chevron) {
        chevron.style.transform = anyClosed ? 'rotate(180deg)' : 'rotate(0deg)';
      }
      if (label) {
        label.textContent = anyClosed ? 'Hide' : 'Reveal';
      }
    });
    updateMasterSpineToggleState();
  };
  window.toggleAllSpineConsequences = window.toggleAllSpineStages;
  window.toggleAllCausalSpineDrawers = window.toggleAllSpineStages;
  window.toggleAllSpineDrawers = window.toggleAllSpineStages;

  window.jumpToNarrativeBlock = jumpToNarrativeBlock;

  window.openSpineTabAndScroll = function () {
    const launchpad = document.querySelector('.lesson-launchpad-container');
    if (launchpad) {
      const drawer = launchpad.querySelector('.lesson-launchpad-drawer');
      const allTabs = launchpad.querySelectorAll('.launchpad-tab-btn');
      const allPanels = launchpad.querySelectorAll('.launchpad-panel');
      const closeBtn = launchpad.querySelector('.launchpad-close-btn');

      if (drawer) drawer.style.display = 'block';
      allTabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === 'spine'));
      allPanels.forEach((p) => {
        p.style.display = p.dataset.panel === 'spine' ? 'block' : 'none';
      });
      if (closeBtn) closeBtn.style.display = 'inline-flex';
    }

    const spine = document.getElementById('lesson-chronology-spine');
    if (spine) {
      setTimeout(() => {
        spine.scrollIntoView({ behavior: 'smooth', block: 'start' });
        spine.style.transition = 'all 0.4s ease';
        spine.style.boxShadow = '0 0 0 4px #0284c7, 0 8px 24px rgba(2,132,199,0.25)';
        setTimeout(() => {
          spine.style.boxShadow = '';
        }, 2500);
      }, 80);
    }
  };

  window.openInfographicTabAndScroll = function () {
    const launchpad = document.querySelector('.lesson-launchpad-container');
    if (launchpad) {
      const drawer = launchpad.querySelector('.lesson-launchpad-drawer');
      const allTabs = launchpad.querySelectorAll('.launchpad-tab-btn');
      const allPanels = launchpad.querySelectorAll('.launchpad-panel');
      const closeBtn = launchpad.querySelector('.launchpad-close-btn');

      if (drawer) drawer.style.display = 'block';
      allTabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === 'infographic'));
      allPanels.forEach((p) => {
        p.style.display = p.dataset.panel === 'infographic' ? 'block' : 'none';
      });
      if (closeBtn) closeBtn.style.display = 'inline-flex';
    }

    const panel = document.querySelector('.launchpad-infographic-panel-content');
    if (panel) {
      setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  window.switchLaunchpadMat = function (btn, lessonId, matIndex) {
    if (!btn) return;
    const targetBtn = btn.closest('.launchpad-mat-switch-btn') || btn;
    const container = targetBtn.closest('.launchpad-infographic-panel-content') || document.querySelector('.launchpad-infographic-panel-content');
    if (!container) return;
    const targetIndex = typeof matIndex === 'number' ? matIndex : parseInt(targetBtn.getAttribute('data-mat-index') || '0', 10);
    const allBtns = container.querySelectorAll('.launchpad-mat-switch-btn');
    const allPanels = container.querySelectorAll('.launchpad-mat-item');
    allBtns.forEach((b, idx) => {
      const active = idx === targetIndex;
      b.classList.toggle('active', active);
      b.style.background = active ? '#0284c7' : '#ffffff';
      b.style.color = active ? '#ffffff' : '#334155';
      b.style.borderColor = active ? '#0284c7' : '#cbd5e1';
      b.style.boxShadow = active ? '0 1px 4px rgba(2, 132, 199, 0.35)' : 'none';
    });
    allPanels.forEach((p, idx) => {
      const isTarget = idx === targetIndex;
      p.style.display = isTarget ? 'block' : 'none';
      if (isTarget) {
        const iframe = p.querySelector('iframe[data-src]');
        if (iframe && (!iframe.src || iframe.src === 'about:blank')) {
          iframe.src = iframe.getAttribute('data-src');
        }
      }
    });
  };
}

// ============================================================================
// BESPOKE LESSON NOTE-TAKING SCAFFOLD (Digital Web App Active Reading Standard)
// ============================================================================
export function renderLessonNoteScaffold(lesson, unitId) {
  if (!lesson || !lesson.note_scaffold || !Array.isArray(lesson.note_scaffold.blocks)) {
    return '';
  }

  const scaffold = lesson.note_scaffold;
  const blocks = scaffold.blocks;
  const lessonId = lesson.id || 'lesson';

  let blocksHtml = blocks
    .map((b, idx) => {
      const blockNum = b.num || idx + 1;
      const blockBadge = b.badge || 'ENQUIRY';
      const blockTitle = b.title || `Enquiry ${blockNum}`;
      const blockPrompt = b.prompt || '';
      const keyTerms = Array.isArray(b.key_terms) ? b.key_terms : [];
      const modelNotes = Array.isArray(b.model_notes) ? b.model_notes : [];

      const keyTermsHtml =
        keyTerms.length > 0
          ? `
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
            <span style="font-size: 0.67rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.4px;">
              <i class="fa-solid fa-key" style="color: #64748b; margin-right: 3px;"></i> Must-Use Terms:
            </span>
            ${keyTerms
            .map(
              (t) =>
                `<span style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-family: 'Inter', sans-serif;">${t}</span>`,
            )
            .join('')}
          </div>
        `
          : '';

      return `
      <div class="note-scaffold-card" data-block="${blockNum}" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-top: 4px solid #0284c7; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,0,0,0.03); min-width: 0; box-sizing: border-box;">
        <div>
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px;">
            <span style="background: #0f172a; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 0.65rem; font-weight: 800; padding: 2px 7px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px;">ENQUIRY ${blockNum}</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 0.66rem; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 2px 7px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.4px;">${blockBadge}</span>
          </div>

          <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.02rem; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; line-height: 1.3; min-height: 2.6em;">
            ${blockTitle}
          </h4>

          ${keyTermsHtml}

          <!-- Prompt Box (Cleaned - No AI Fluff) -->
          <div style="background: #f8fafc; border-left: 3px solid #0284c7; padding: 9px 12px; border-radius: 0 4px 4px 0; margin-bottom: 10px;">
            <div style="font-size: 0.84rem; color: #1e293b; line-height: 1.45; font-weight: 600;">
              ${blockPrompt}
            </div>
          </div>

          <!-- Pupil Interactive Textarea (Streamlined - Max Writing Room) -->
          <div style="margin-bottom: 10px; position: relative;">
            <textarea class="note-scaffold-textarea" id="note-text-${lessonId}-${idx}" rows="4" placeholder="" oninput="window.saveNoteScaffoldInput('${lessonId}', ${idx}, this.value);" style="width: 100%; box-sizing: border-box; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 9px 11px; font-family: 'Inter', sans-serif; font-size: 0.83rem; line-height: 1.45; color: #0f172a; resize: vertical; min-height: 85px; background: #ffffff; transition: border-color 0.2s ease;" onfocus="this.style.borderColor='#0284c7';" onblur="this.style.borderColor='#cbd5e1';"></textarea>
            <span id="note-card-saved-${lessonId}-${idx}" style="position: absolute; right: 8px; bottom: 8px; font-size: 0.65rem; font-weight: 700; color: #10b981; opacity: 0; transition: opacity 0.2s ease; background: rgba(255,255,255,0.92); padding: 1px 5px; border-radius: 3px; pointer-events: none; border: 1px solid #bbf7d0;">✓ Saved</span>
          </div>

          <!-- Model Exemplar Notes Box -->
          <div class="note-model-drawer" id="note-model-${lessonId}-${idx}" style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 6px; padding: 10px 12px; margin-top: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 0.68rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
                <i class="fa-solid fa-award" style="color: #16a34a; margin-right: 4px;"></i> Core Historical Evidence
              </span>
              <button type="button" class="btn-reveal-model" id="btn-toggle-model-${lessonId}-${idx}" onclick="window.toggleSingleNoteModel('${lessonId}', ${idx}, event);" style="font-size: 0.68rem; font-weight: 700; color: #15803d; background: #dcfce7; border: 1px solid #86efac; border-radius: 3px; padding: 1px 6px; cursor: pointer;">
                Hide Model
              </button>
            </div>
            <ul class="note-model-bullets" id="bullets-${lessonId}-${idx}" style="margin: 0; padding-left: 18px; font-size: 0.78rem; color: #14532d; line-height: 1.45;">
              ${modelNotes.map((m) => `<li style="margin-bottom: 4px;">${m}</li>`).join('')}
            </ul>
            <div class="note-quiz-mask" id="mask-${lessonId}-${idx}" style="display: none; padding: 8px 6px; text-align: center;">
              <button type="button" class="btn-quiz-mask" id="btn-quiz-mask-${lessonId}-${idx}" onclick="window.revealSingleNoteQuizMask('${lessonId}', ${idx}, event);" style="padding: 5px 12px; font-size: 0.74rem; font-weight: 700; background: #16a34a; color: #ffffff; border: 1px solid #15803d; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease;">
                <i class="fa-solid fa-eye"></i> Click to Reveal Model Evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join('');

  return `
    <details id="lesson-note-scaffold" class="lesson-note-scaffold-details" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-top: 4px solid #0284c7; border-radius: 8px; margin-bottom: 20px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04);" closed>
      <summary style="padding: 11px 16px; cursor: pointer; color: #0f172a; font-weight: bold; font-size: 1.05rem; background: #f8fafc; list-style: none; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; user-select: none;">
        <span style="display: flex; align-items: center; gap: 10px;">
          <span style="background: #0284c7; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 0.68rem; font-weight: 800; padding: 2.5px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Core Task</span>
          <span style="font-weight: 800; font-size: 0.98rem; color: #0f172a; font-family: 'Inter', sans-serif;">Active Reading Notes &bull; 3 Core Enquiries</span>
        </span>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;" onclick="event.stopPropagation();">
          <button type="button" onclick="window.copyNoteScaffoldToClipboard('${lessonId}', event);" id="btn-copy-notes-${lessonId}" style="font-size: 0.82rem; padding: 3px 9px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-weight: 700;" title="Copy notes to clipboard">
            <i class="fa-solid fa-copy"></i> <span id="copy-notes-label-${lessonId}">Copy Notes</span>
          </button>
          <button type="button" onclick="window.printNoteScaffoldSheet('${lessonId}', event);" style="font-size: 0.82rem; padding: 3px 9px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-weight: 700;" title="Print clean 1-page A4 note-taking sheet">
            <i class="fa-solid fa-print"></i> Print A4 Sheet
          </button>
          <span id="note-scaffold-save-indicator-${lessonId}" style="font-size: 0.72rem; font-weight: 700; color: #10b981; opacity: 0; transition: opacity 0.3s ease;">✓ Auto-Saved</span>
          <i class="fa-solid fa-chevron-down" style="color: #64748b; margin-left: 6px;"></i>
        </div>
      </summary>

      <!-- Active Instructions Sub-Bar -->
      <div style="padding: 9px 16px; background: #f0f9ff; border-bottom: 1px solid #bae6fd; font-size: 0.83rem; color: #0369a1; line-height: 1.45;">
        <strong style="color: #0c4a6e;"><i class="fa-solid fa-pen-to-square" style="color: #0284c7; margin-right: 5px;"></i> Active Lesson Task:</strong> ${scaffold.instruction} <span style="color: #475569; margin-left: 6px;">(Complete these 3 enquiry notes from the chapter narrative below before completing your printed workbook).</span>
      </div>

      <!-- 3-Block Grid -->
      <div class="note-scaffold-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; padding: 16px; background: #f8fafc;">
        ${blocksHtml}
      </div>
    </details>
  `;
}

if (typeof window !== 'undefined') {
  window.saveNoteScaffoldInput = function (lessonId, blockIdx, val) {
    try {
      localStorage.setItem(`med_note_${lessonId}_${blockIdx}`, val);
      const cardSaved = document.getElementById(`note-card-saved-${lessonId}-${blockIdx}`);
      const overallSaved = document.getElementById(`note-scaffold-save-indicator-${lessonId}`);
      if (cardSaved) {
        cardSaved.style.opacity = '1';
        clearTimeout(window[`cardSaveTimer_${lessonId}_${blockIdx}`]);
        window[`cardSaveTimer_${lessonId}_${blockIdx}`] = setTimeout(() => {
          cardSaved.style.opacity = '0';
        }, 1200);
      }
      if (overallSaved) {
        overallSaved.style.opacity = '1';
        clearTimeout(window[`saveTimer_${lessonId}`]);
        window[`saveTimer_${lessonId}`] = setTimeout(() => {
          overallSaved.style.opacity = '0';
        }, 1500);
      }
    } catch (e) {
      console.error('Failed to save note to localStorage:', e);
    }
  };

  window.toggleSingleNoteModel = function (lessonId, blockIdx, event) {
    if (event && event.stopPropagation) event.stopPropagation();
    const bullets = document.getElementById(`bullets-${lessonId}-${blockIdx}`);
    const btn = document.getElementById(`btn-toggle-model-${lessonId}-${blockIdx}`);
    if (!bullets || !btn) return;
    const isHidden = bullets.style.display === 'none';
    if (isHidden) {
      bullets.style.display = 'block';
      btn.textContent = 'Hide Model';
    } else {
      bullets.style.display = 'none';
      btn.textContent = 'Show Model';
    }
  };

  window.toggleNoteScaffoldQuizMode = function (lessonId, event) {
    if (event && event.stopPropagation) event.stopPropagation();
    window.noteScaffoldQuizActive = !window.noteScaffoldQuizActive;
    const label = document.getElementById('note-scaffold-quiz-label');
    const btn = document.getElementById('btn-note-scaffold-quiz-mode');
    const cards = document.querySelectorAll('#lesson-note-scaffold .note-scaffold-card');

    if (window.noteScaffoldQuizActive) {
      if (label) label.textContent = 'Exit Quiz Mode';
      if (btn) {
        btn.style.background = '#fef08a';
        btn.style.borderColor = '#ca8a04';
        btn.style.color = '#713f12';
      }
      cards.forEach((card, idx) => {
        const bullets = document.getElementById(`bullets-${lessonId}-${idx}`);
        const mask = document.getElementById(`mask-${lessonId}-${idx}`);
        const toggleBtn = document.getElementById(`btn-toggle-model-${lessonId}-${idx}`);
        const maskBtn = document.getElementById(`btn-quiz-mask-${lessonId}-${idx}`);
        if (bullets) bullets.style.display = 'none';
        if (mask) mask.style.display = 'block';
        if (toggleBtn) toggleBtn.style.display = 'none';
        if (maskBtn) {
          maskBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Click to Reveal Model Evidence';
          maskBtn.style.background = '#16a34a';
          maskBtn.style.color = '#ffffff';
          maskBtn.style.border = '1px solid #15803d';
        }
      });
    } else {
      if (label) label.textContent = 'Self-Quiz Mode';
      if (btn) {
        btn.style.background = '#fefce8';
        btn.style.borderColor = '#fde047';
        btn.style.color = '#854d0e';
      }
      cards.forEach((card, idx) => {
        const bullets = document.getElementById(`bullets-${lessonId}-${idx}`);
        const mask = document.getElementById(`mask-${lessonId}-${idx}`);
        const toggleBtn = document.getElementById(`btn-toggle-model-${lessonId}-${idx}`);
        const maskBtn = document.getElementById(`btn-quiz-mask-${lessonId}-${idx}`);
        if (bullets) bullets.style.display = 'block';
        if (mask) mask.style.display = 'none';
        if (toggleBtn) {
          toggleBtn.style.display = 'inline-block';
          toggleBtn.textContent = 'Hide Model';
        }
        if (maskBtn) {
          maskBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Click to Reveal Model Evidence';
          maskBtn.style.background = '#16a34a';
          maskBtn.style.color = '#ffffff';
          maskBtn.style.border = '1px solid #15803d';
        }
      });
    }
  };

  window.revealSingleNoteQuizMask = function (lessonId, blockIdx, event) {
    if (event && event.stopPropagation) event.stopPropagation();
    const bullets = document.getElementById(`bullets-${lessonId}-${blockIdx}`);
    const maskBtn = document.getElementById(`btn-quiz-mask-${lessonId}-${blockIdx}`);
    if (!bullets || !maskBtn) return;

    const isCurrentlyVisible = bullets.style.display !== 'none';
    if (isCurrentlyVisible) {
      bullets.style.display = 'none';
      maskBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Click to Reveal Model Evidence';
      maskBtn.style.background = '#16a34a';
      maskBtn.style.color = '#ffffff';
      maskBtn.style.border = '1px solid #15803d';
    } else {
      bullets.style.display = 'block';
      maskBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Collapse Model Evidence';
      maskBtn.style.background = '#f1f5f9';
      maskBtn.style.color = '#15803d';
      maskBtn.style.border = '1.5px solid #86efac';
    }
  };

  window.copyNoteScaffoldToClipboard = function (lessonId, event) {
    if (event && event.stopPropagation) event.stopPropagation();
    const lesson = window.currentActiveLesson;
    if (!lesson || !lesson.note_scaffold) return;
    const blocks = lesson.note_scaffold.blocks || [];
    let text = `=== ${lesson.title || 'Lesson Task Notes'} ===\n\n`;
    blocks.forEach((b, idx) => {
      const userNote = localStorage.getItem(`med_note_${lessonId}_${idx}`) || '(No notes entered)';
      const keyTerms =
        Array.isArray(b.key_terms) && b.key_terms.length > 0
          ? ` [Key Terms: ${b.key_terms.join(', ')}]`
          : '';
      text += `ENQUIRY ${b.num || idx + 1}: ${b.title} [${b.badge}]${keyTerms}\n`;
      text += `Prompt: ${b.prompt}\n`;
      text += `My Notes:\n${userNote}\n\n`;
      text += `Core Model Evidence:\n`;
      (b.model_notes || []).forEach((m) => {
        text += `• ${m}\n`;
      });
      text += `\n----------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      const btnLabel = document.getElementById(`copy-notes-label-${lessonId}`);
      if (btnLabel) {
        const original = btnLabel.textContent;
        btnLabel.textContent = '✓ Copied!';
        setTimeout(() => {
          btnLabel.textContent = original;
        }, 2000);
      }
    });
  };

  window.printNoteScaffoldSheet = function (lessonId, event) {
    if (event && event.stopPropagation) event.stopPropagation();
    const lesson = window.currentActiveLesson;
    if (!lesson || !lesson.note_scaffold) return;
    const scaffold = lesson.note_scaffold;
    const blocks = scaffold.blocks || [];

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${lesson.title} - Lesson Task Sheet</title>
        <style>
          @page { size: A4 portrait; margin: 12mm 15mm; }
          body { font-family: 'Times New Roman', serif; color: #000; margin: 0; padding: 0; }
          h1 { font-size: 13.5pt; margin: 0 0 4pt 0; text-align: center; }
          .subhead { font-size: 8.5pt; text-align: center; margin-bottom: 10pt; text-transform: uppercase; letter-spacing: 0.5px; }
          .inst { font-size: 9pt; font-style: italic; margin-bottom: 10pt; border: 1px solid #000; padding: 6pt; }
          .block { border: 1.2px solid #000; margin-bottom: 10pt; padding: 8pt; page-break-inside: avoid; }
          .block-title { font-weight: bold; font-size: 10pt; margin-bottom: 3pt; display: flex; justify-content: space-between; }
          .key-terms { font-size: 8pt; font-weight: bold; margin-bottom: 4pt; color: #1e293b; }
          .prompt { font-size: 8.8pt; font-weight: bold; margin-bottom: 6pt; }
          .lines { display: flex; flex-direction: column; gap: 16pt; margin-top: 14pt; }
          .line { border-bottom: 1px solid #000; height: 1px; }
          .user-note { font-family: 'Courier New', monospace; font-size: 8.8pt; white-space: pre-wrap; margin-bottom: 4pt; }
        </style>
      </head>
      <body>
        <h1>${lesson.title}</h1>
        <div class="subhead">The History Department &bull; Lesson Task & Disciplinary Note-Taking Sheet</div>
        <div class="inst"><strong>Instructions:</strong> ${scaffold.instruction}</div>
    `;

    blocks.forEach((b, idx) => {
      const userNote = localStorage.getItem(`med_note_${lessonId}_${idx}`) || '';
      const keyTermsText =
        Array.isArray(b.key_terms) && b.key_terms.length > 0
          ? `<div class="key-terms">Must-Use Terms: ${b.key_terms.join(' &bull; ')}</div>`
          : '';
      printHtml += `
        <div class="block">
          <div class="block-title">
            <span>ENQUIRY ${b.num || idx + 1}: ${b.title}</span>
            <span>[${b.badge}]</span>
          </div>
          ${keyTermsText}
          <div class="prompt">Prompt: ${b.prompt}</div>
          ${userNote
          ? `<div class="user-note"><strong>Student Notes:</strong>\n${userNote}</div>`
          : `<div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div>`
        }
        </div>
      `;
    });

    printHtml += `
      </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

export function renderLessonVideos(videos, lesson, unitId) {
  if (!videos || videos.length === 0) return '';
  const formatBold = window.formatBold || ((s) => s);

  // Always sort videos shortest to longest
  const sortedVideos = getSortedLessonVideos(videos);
  if (sortedVideos.length === 0) return '';

  const safeLessonId = (
    lesson && (lesson.id || lesson.title) ? String(lesson.id || lesson.title) : 'lesson'
  ).replace(/[^a-zA-Z0-9_-]/g, '_');
  const shelfContainerId = 'video-shelf-' + safeLessonId;
  const drawerId = 'video-task-drawer-' + safeLessonId;

  // Calculate duration summary for the header pill
  let countPillText = '';
  if (sortedVideos.length === 1) {
    const singleDur = formatProminentDuration(sortedVideos[0].duration);
    countPillText = singleDur ? `1 Video &bull; ⏱️ ${singleDur}` : `1 Video`;
  } else {
    const minDur = formatShortDuration(sortedVideos[0].duration);
    const maxDur = formatShortDuration(sortedVideos[sortedVideos.length - 1].duration);
    const validRange = minDur && maxDur && minDur !== maxDur;
    countPillText = validRange
      ? `${sortedVideos.length} Videos &bull; Shortest First (${minDur} &ndash; ${maxDur})`
      : minDur
        ? `${sortedVideos.length} Videos &bull; Shortest First (~${minDur})`
        : `${sortedVideos.length} Videos &bull; Shortest First`;
  }

  let videoCardsHtml = '';
  let taskPanelsHtml = '';
  let hasAnyTasks = false;

  sortedVideos.forEach((vid, idx) => {
    const isYt =
      vid.type === 'youtube' ||
      (vid.url && (vid.url.includes('youtube.com') || vid.url.includes('youtu.be')));
    const isEra = vid.type === 'era' || (vid.url && vid.url.includes('era.org.uk'));

    let ytId = null;
    if (isYt && vid.url) {
      const match = vid.url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i,
      );
      ytId = match ? match[1] : null;
    }

    const shortDur = formatShortDuration(vid.duration);
    const prominentDur = formatProminentDuration(vid.duration);
    const providerName = isEra ? 'ERA' : isYt ? 'YouTube' : 'Video';
    const providerIcon = isEra ? 'fa-solid fa-graduation-cap' : 'fa-brands fa-youtube';
    const pathwayInfo = resolveVideoPathway(vid);
    const cleanTitle = (vid.title || 'Historical Documentary Resource').replace(/"/g, '&quot;');
    const rawCleanTitle = vid.title || 'Historical Documentary Resource';
    const displayTitle = cleanVideoDisplayTitle(rawCleanTitle);
    const videoKey = `${safeLessonId}_${idx}`;

    if (typeof window !== 'undefined') {
      window.__videoStore = window.__videoStore || {};
      window.__videoStore[videoKey] = {
        ...vid,
        pathwayInfo,
        cleanTitle,
        displayTitle,
        shortDur,
        prominentDur,
        providerName,
        providerIcon,
        ytId,
        safeLessonId,
        idx,
      };
    }

    // Left thumbnail element
    let thumbHtml = '';
    if (ytId) {
      thumbHtml = `
        <div class="video-shelf-thumb-wrap" data-action="open-video-modal" data-youtube="${ytId}" data-video-key="${videoKey}" title="Click to Launch Theater Mode: ${cleanTitle}">
          <img src="https://img.youtube.com/vi/${ytId}/mqdefault.jpg" alt="${cleanTitle}" class="video-shelf-thumb-img" loading="lazy" />
          <div class="video-shelf-play-overlay">
            <i class="fa-solid fa-play"></i>
          </div>
        </div>
      `;
    } else if (isEra) {
      thumbHtml = `
        <a href="${vid.url}" target="_blank" rel="noopener noreferrer" class="video-shelf-thumb-wrap era" title="Open Stream on ERA (School SSO): ${cleanTitle}">
          <div class="video-shelf-era-poster">
            <div class="video-shelf-poster-badge">
              <i class="fa-solid fa-graduation-cap"></i> ERA
            </div>
            <div class="video-shelf-poster-play">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </div>
          </div>
        </a>
      `;
    } else {
      thumbHtml = `
        <a href="${vid.url}" target="_blank" rel="noopener noreferrer" class="video-shelf-thumb-wrap generic" title="Open Video: ${cleanTitle}">
          <div class="video-shelf-generic-poster">
            <div class="video-shelf-poster-badge">
              <i class="fa-solid fa-video"></i> Video
            </div>
            <div class="video-shelf-poster-play">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
        </a>
      `;
    }

    // Action buttons: Clean Cinema launch
    let actionButtonsHtml = '';
    if (ytId) {
      actionButtonsHtml += `
        <button type="button" class="btn-video-shelf-action watch" data-action="open-video-modal" data-youtube="${ytId}" data-video-key="${videoKey}" title="Watch in Cinema Player: ${cleanTitle}">
          <i class="fa-solid fa-play"></i> Watch
        </button>
      `;
    } else if (isEra) {
      actionButtonsHtml += `
        <a href="${vid.url}" target="_blank" rel="noopener noreferrer" class="btn-video-shelf-action era" title="Stream on Educational Recording Agency">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Stream
        </a>
      `;
    } else {
      actionButtonsHtml += `
        <a href="${vid.url}" target="_blank" rel="noopener noreferrer" class="btn-video-shelf-action generic" title="Open Video Resource">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Open
        </a>
      `;
    }

    // 1 Horizontal Line Card
    videoCardsHtml += `
      <div class="video-shelf-card ${isEra ? 'era-card' : 'yt-card'}" id="${shelfContainerId}-card-${idx}">
        ${thumbHtml}
        <div class="video-shelf-card-info">
          <div class="video-shelf-card-tags">
            ${
              prominentDur
                ? `
              <span class="video-shelf-duration-badge" title="Exact Runtime: ${vid.duration || prominentDur}">
                <i class="fa-solid fa-clock"></i> ${prominentDur}
              </span>
            `
                : ''
            }
            <span class="video-shelf-pathway-pill" title="${(pathwayInfo.guidance || '').replace(/"/g, '&quot;')}">
              <i class="${pathwayInfo.icon || 'fa-solid fa-route'}"></i> ${pathwayInfo.pathway}
            </span>
          </div>
          <div class="video-shelf-card-title" title="${cleanTitle}">
            ${displayTitle}
          </div>
          <div class="video-shelf-card-actions">
            ${actionButtonsHtml}
          </div>
        </div>
      </div>
    `;
  });

  return `
    <div id="${shelfContainerId}" class="lesson-video-shelf-container no-print">
      <div class="lesson-video-shelf-header">
        <div class="video-shelf-title">
          <i class="fa-solid fa-film"></i>
          <span>Classroom Video Library</span>
          <span class="video-shelf-count-pill">${countPillText}</span>
        </div>
        <div class="video-shelf-hint">
          ${sortedVideos.length > 1 ? '<i class="fa-solid fa-arrow-left-long"></i> <span>Scroll horizontal</span> <i class="fa-solid fa-arrow-right-long"></i>' : '<span class="video-shelf-instant-badge"><i class="fa-solid fa-bolt"></i> One-Click Cinema Playback</span>'}
        </div>
      </div>

      <!-- 1 Single Horizontal Line Row of Video Cards -->
      <div class="lesson-video-shelf-row">
        ${videoCardsHtml}
      </div>
    </div>
  `;
}

export function extractLearningObjectivesData(lesson) {
  if (!lesson) return null;

  // 1. Direct pupil-facing learning_objectives property
  if (lesson.learning_objectives) {
    const cleanTitle = (lesson.title || '').replace(/^Lesson\s*\d+:\s*/i, '').trim();
    const rawOverarching =
      !Array.isArray(lesson.learning_objectives) && lesson.learning_objectives.overarching
        ? lesson.learning_objectives.overarching.trim()
        : '';
    const overarching = rawOverarching && rawOverarching !== cleanTitle ? rawOverarching : '';

    let scaffolded = [];
    if (Array.isArray(lesson.learning_objectives)) {
      scaffolded = lesson.learning_objectives;
    } else if (Array.isArray(lesson.learning_objectives.scaffolded)) {
      scaffolded = lesson.learning_objectives.scaffolded;
    }

    if (scaffolded.length > 0 || overarching) {
      return {
        overarching,
        scaffolded,
      };
    }
  }

  // 2. Structured fallback to teacher_notes.objectives across all key stages
  if (
    lesson.teacher_notes &&
    Array.isArray(lesson.teacher_notes.objectives) &&
    lesson.teacher_notes.objectives.length > 0
  ) {
    const scaffolded = lesson.teacher_notes.objectives
      .map((item) => {
        if (!item) return '';
        if (typeof item === 'string') return item.trim();
        return (item.objective || item.desc || item.title || '').trim();
      })
      .filter(Boolean);

    if (scaffolded.length > 0) {
      return {
        overarching: '',
        scaffolded,
      };
    }
  }

  return null;
}

export function renderLearningObjectivesSidebarHTML(objectivesData) {
  if (!objectivesData) return '';
  const { overarching, scaffolded } = objectivesData;
  return `
    <div class="donow-objectives-sidebar">
      <div class="donow-objectives-card">
        <div class="donow-objectives-header">
          <div class="donow-objectives-eyebrow">
            <i class="fa-solid fa-compass" style="color: #059669;"></i>
            <span>Today's Enquiry Direction</span>
          </div>
          <h4 class="donow-objectives-title">
            <i class="fa-solid fa-bullseye" style="color: #10b981;"></i>
            <span>Learning Objectives</span>
          </h4>
        </div>
        ${overarching ? `
          <div class="donow-objectives-overarching">
            ${overarching}
          </div>
        ` : ''}
        <ul class="donow-objectives-list">
          ${scaffolded.map((obj) => `
            <li class="donow-objectives-item">
              <span class="donow-obj-bullet"></span>
              <span class="donow-obj-text">${obj}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

export function renderLearningObjectivesPanelHTML(objectivesData, lesson) {
  if (!objectivesData) return '';
  const { overarching, scaffolded } = objectivesData;
  const resolvedLessonEnquiry =
    lesson && (lesson.enquiry || lesson.enquiry_question || lesson.enquiryQuestion || lesson.inquiry_question);
  const enquiryPrompt = resolvedLessonEnquiry || (lesson && lesson.title) || '';
  return `
    <div class="launchpad-objectives-panel-content" style="padding: 16px 20px; background: #ffffff;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669;">
            <i class="fa-solid fa-bullseye" style="font-size: 1.1rem;"></i>
          </span>
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #059669;">Curriculum Focus &amp; Goals</div>
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a;">Learning Objectives &amp; Enquiry Direction</h3>
          </div>
        </div>
        <span style="font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 11px; border-radius: 12px; display: inline-flex; align-items: center; gap: 5px;">
          <i class="fa-solid fa-list-check"></i> ${scaffolded.length} Target Milestones
        </span>
      </div>
      ${enquiryPrompt ? `
        <div style="margin-bottom: 14px; padding: 10px 14px; background: #f0fdf4; border-left: 3.5px solid #10b981; border-radius: 4px; font-size: 0.95rem; font-weight: 700; color: #065f46;">
          <i class="fa-solid fa-circle-question" style="margin-right: 6px; color: #059669;"></i> ${enquiryPrompt}
        </div>
      ` : ''}
      ${overarching ? `
        <p style="font-size: 1.02rem; font-weight: 600; color: #1e3a8a; margin-bottom: 14px; line-height: 1.5;">
          ${overarching}
        </p>
      ` : ''}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px;">
        ${scaffolded.map((obj, idx) => `
          <div style="display: flex; gap: 12px; align-items: flex-start; padding: 12px 14px; background: #f8fafc; border: 1.2px solid #e2e8f0; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #10b981; color: #ffffff; font-size: 0.75rem; font-weight: 800; flex-shrink: 0; line-height: 1;">${idx + 1}</span>
            <span style="font-size: 0.9rem; line-height: 1.45; color: #1e293b; font-weight: 600; flex: 1;">${obj}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderLaunchpadInfographicPanelHTML(lesson, unitId, infographics = []) {
  if (!infographics || infographics.length === 0) return '';
  const effectiveUnitId = unitId || (typeof window !== 'undefined' ? window.currentUnitId : '');
  const lessonId = lesson?.id || '';

  const multiTabsHtml =
    infographics.length > 1
      ? `
    <div class="launchpad-mat-switcher" style="display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; padding-bottom: 6px; border-bottom: 1.5px solid #f1f5f9;">
      ${infographics
        .map((mat, idx) => {
          let cleanTitle = mat.title || `Mat ${idx + 1}`;
          cleanTitle = cleanTitle.split(':')[0].replace(/^(Key Topic \d+(\.\d+)?|KT\s*\d+(\.\d+)?)\s*[:-]?\s*/i, '').trim();
          if (cleanTitle.length > 28) cleanTitle = cleanTitle.substring(0, 26) + '...';
          return `
            <button type="button"
              class="launchpad-mat-switch-btn ${idx === 0 ? 'active' : ''}"
              data-mat-index="${idx}"
              data-lesson-id="${lessonId}"
              onclick="if(window.switchLaunchpadMat){window.switchLaunchpadMat(this, '${lessonId}', ${idx});}"
              onmouseenter="if(!this.classList.contains('active')){this.style.background='#f0f9ff'; this.style.borderColor='#38bdf8';}"
              onmouseleave="if(!this.classList.contains('active')){this.style.background='#ffffff'; this.style.borderColor='#cbd5e1';}"
              style="padding: 5px 12px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; border: 1.2px solid ${idx === 0 ? '#0284c7' : '#cbd5e1'}; background: ${idx === 0 ? '#0284c7' : '#ffffff'}; color: ${idx === 0 ? '#ffffff' : '#334155'}; transition: all 0.15s ease; white-space: nowrap;">
              <i class="fa-solid fa-image" style="font-size: 0.74rem;"></i>
              <span>Mat ${idx + 1}: ${cleanTitle}</span>
            </button>
          `;
        })
        .join('')}
    </div>
  `
      : '';

  const matsHtml = infographics
    .map((mat, idx) => {
      const isVisible = idx === 0;

      // If this mat has an interactive HTML or 1-Page Visual Story Sheet version, embed it directly!
      if (mat.interactiveUrl) {
        const isStorySheet = mat.type === 'visual_story_sheet';
        const badgeLabel = isStorySheet ? '1-Page Visual Story Sheet' : 'Native Interactive Mat';
        const frameHeightStyle = isStorySheet
          ? 'width: 100%; aspect-ratio: 1123 / 794; max-height: 760px;'
          : 'width: 100%; height: 860px;';
        return `
        <div class="launchpad-mat-item" data-mat-index="${idx}" style="display: ${isVisible ? 'block' : 'none'};">
          <div style="background: #0b1120; border: 1.5px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);">
            <!-- Interactive Mat Top Strip -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; background: #0f172a; border-bottom: 1.5px solid #1e293b; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex-wrap: wrap;">
                <span style="font-size: 0.72rem; font-weight: 800; color: #f59e0b; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); padding: 3px 9px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;">
                  <i class="fa-solid ${isStorySheet ? 'fa-diagram-project' : 'fa-wand-magic-sparkles'}"></i> ${badgeLabel}
                </span>
                <h4 style="margin: 0; font-size: 0.96rem; font-weight: 700; color: #f8fafc; font-family: 'Playfair Display', Georgia, serif; white-space: normal; overflow-wrap: break-word;">
                  ${mat.title}
                </h4>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                <a href="${mat.interactiveUrl}" target="_blank"
                  style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #f59e0b; color: #000000; text-decoration: none; border-radius: 6px; font-size: 0.8rem; font-weight: 700; transition: all 0.15s ease; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);"
                  title="Open 1-page visual sheet in a new full browser tab (for printing or projection)">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Open / Print A4
                </a>
                <button type="button"
                  onclick="if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lessonId}', '${effectiveUnitId}', { startIndex: ${idx} });}else if(window.openInfographicModal){window.openInfographicModal('${mat.slug}');}"
                  style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #1e293b; color: #e2e8f0; border: 1px solid #334155; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease;"
                  title="Open in expanded modal viewer">
                  <i class="fa-solid fa-expand"></i> Fullscreen
                </button>
              </div>
            </div>
            <!-- Live Interactive Embed Frame -->
            <div style="position: relative; ${frameHeightStyle} background: #070d18;">
              <iframe src="${mat.interactiveUrl}"
                style="width: 100%; height: 100%; border: none; display: block;"
                title="${mat.title}"
                loading="lazy"></iframe>
            </div>
          </div>
        </div>
        `;
      }

      const keyPointsList =
        Array.isArray(mat.keyPoints) && mat.keyPoints.length > 0
          ? `
          <div style="margin-top: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px;">
            <div style="font-size: 0.72rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-list-check" style="color: #0284c7;"></i> Core Syllabus Knowledge Points
            </div>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.86rem; color: #334155; line-height: 1.5; display: flex; flex-direction: column; gap: 6px;">
              ${mat.keyPoints.map((pt) => `<li style="padding-left: 2px;">${pt}</li>`).join('')}
            </ul>
          </div>
        `
          : '';

      return `
        <div class="launchpad-mat-item" data-mat-index="${idx}" style="display: ${isVisible ? 'block' : 'none'};">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; align-items: start;">
            <!-- Visual Plate -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div onclick="if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lessonId}', '${effectiveUnitId}', { startIndex: ${idx} });}else if(window.openInfographicModal){window.openInfographicModal('${mat.slug}');}"
                title="Click to view full-resolution interactive lightbox with zoom & pan"
                style="cursor: zoom-in; position: relative; border-radius: 8px; overflow: hidden; border: 1.5px solid #cbd5e1; background: #0b1120; box-shadow: 0 3px 10px rgba(0,0,0,0.08); transition: all 0.2s ease;"
                onmouseover="this.style.borderColor='#38bdf8'; this.style.boxShadow='0 6px 20px rgba(2,132,199,0.2)';"
                onmouseout="this.style.borderColor='#cbd5e1'; this.style.boxShadow='0 3px 10px rgba(0,0,0,0.08)';">
                <img src="${mat.image}"
                  alt="${mat.title}"
                  loading="lazy"
                  style="width: 100%; max-height: 480px; object-fit: contain; display: block; margin: 0 auto; background: #0f172a;" />
                <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(15, 23, 42, 0.88); color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; display: inline-flex; align-items: center; gap: 5px; backdrop-filter: blur(4px); box-shadow: 0 2px 6px rgba(0,0,0,0.3); pointer-events: none;">
                  <i class="fa-solid fa-magnifying-glass-plus" style="color: #38bdf8;"></i> Click to Zoom Fullscreen
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: #64748b; padding: 0 4px;">
                <span><i class="fa-solid fa-file-image" style="margin-right: 4px;"></i> High-Resolution Visual Revision Mat</span>
                <a href="${mat.image}" download target="_blank" style="color: #0284c7; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                  <i class="fa-solid fa-download"></i> Save Image
                </a>
              </div>
            </div>

            <!-- Syllabus Context & Actions -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
                  <span style="font-size: 0.7rem; font-weight: 800; color: #0369a1; background: #e0f2fe; border: 1px solid #bae6fd; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.4px;">
                    ${mat.topic || 'Syllabus Specification'}
                  </span>
                  <span style="font-size: 0.7rem; color: #64748b; font-weight: 600;">
                    ${mat.aspect === 'landscape' ? 'Landscape Mat' : 'Portrait Mat'}
                  </span>
                </div>
                <h4 style="margin: 0 0 10px 0; font-size: 1.05rem; font-weight: 800; color: #0f172a; line-height: 1.35; font-family: 'Playfair Display', Georgia, serif;">
                  ${mat.title}
                </h4>
                ${keyPointsList}
              </div>

              <button type="button"
                onclick="if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lessonId}', '${effectiveUnitId}', { startIndex: ${idx} });}else if(window.openInfographicModal){window.openInfographicModal('${mat.slug}');}"
                style="width: 100%; padding: 10px 16px; background: linear-gradient(135deg, #0284c7 0%, #1e40af 100%); color: #ffffff; border: none; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25); transition: all 0.15s ease;"
                onmouseover="this.style.boxShadow='0 4px 12px rgba(2, 132, 199, 0.4)'; this.style.transform='translateY(-1px)';"
                onmouseout="this.style.boxShadow='0 2px 8px rgba(2, 132, 199, 0.25)'; this.style.transform='translateY(0)';">
                <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                <span>Open Interactive Study Hub (Zoom, Pan &amp; Exam Strategy)</span>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="launchpad-infographic-panel-content" style="padding: 16px 20px; background: #ffffff; border-radius: 0 0 8px 8px;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; background: #e0f2fe; border: 1px solid #bae6fd; color: #0284c7;">
            <i class="fa-solid fa-chart-pie" style="font-size: 1.1rem;"></i>
          </span>
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #0284c7;">
              Disciplinary Visual Synthesis
            </div>
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a; font-family: 'Playfair Display', Georgia, serif;">
              ${infographics.length > 1 ? 'Visual Revision Mats' : infographics[0].title}
            </h3>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm"
            onclick="event.stopPropagation(); if(window.openLessonInfographicModal){window.openLessonInfographicModal('${lessonId}', '${effectiveUnitId}');}"
            style="padding: 5px 12px; font-size: 0.8rem; font-weight: 700; color: #0284c7; background: #f0f9ff; border: 1.2px solid #bae6fd; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease;"
            title="Open interactive zoom, pan and exam strategy lightbox">
            <i class="fa-solid fa-expand"></i> Fullscreen &amp; Zoom
          </button>
        </div>
      </div>
      ${multiTabsHtml}
      ${matsHtml}
    </div>
  `;
}

const VOCAB_VIEW_STORAGE_KEY = 'hh_vocab_view_mode';

function escVocabHtml(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escVocabJsSingle(val) {
  return String(val || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, ' ');
}

export function resolveDefaultVocabViewMode() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const saved = sessionStorage.getItem(VOCAB_VIEW_STORAGE_KEY);
      if (saved === 'flip' || saved === 'list') return saved;
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window.innerWidth < 933) {
    return 'flip';
  }
  return 'list';
}

function buildVocabFlipStageInnerHTML(deck, deckKey) {
  if (!deck || !Array.isArray(deck.items) || deck.items.length === 0) {
    return '';
  }
  const safeKeyJs = escVocabJsSingle(deckKey);
  const totalTerms = deck.items.length;
  const masteredCount = deck.masteredIndices ? deck.masteredIndices.length : 0;

  if (deck.completed || deck.cursor >= deck.queue.length) {
    const pct = totalTerms > 0 ? Math.round((deck.firstTryCorrect / totalTerms) * 100) : 100;
    return `
      <div class="hh-vocab-complete-card">
        <div class="hh-vocab-complete-badge-pill">
          <i class="fa-solid fa-award"></i>
          <span>Key Vocabulary Complete</span>
        </div>
        <h4 class="hh-vocab-complete-title">All ${totalTerms} Key Terms Mastered!</h4>
        <p class="hh-vocab-complete-sub">
          <strong>${deck.firstTryCorrect} / ${totalTerms} First-Try (${pct}%)</strong> &bull; Saved to your Leitner spaced-repetition memory
        </p>
        <div class="hh-vocab-complete-actions">
          <button type="button" class="hh-vocab-action-btn primary" onclick="event.stopPropagation(); window.hhResetVocabDeck('${safeKeyJs}');">
            <i class="fa-solid fa-rotate-right"></i>
            <span>Practice Again</span>
          </button>
          <button type="button" class="hh-vocab-action-btn secondary" onclick="event.stopPropagation(); window.hhSetVocabMode('${safeKeyJs}', 'list');">
            <i class="fa-solid fa-list-check"></i>
            <span>Glossary List</span>
          </button>
        </div>
      </div>
    `;
  }

  const currentEntry = deck.queue[deck.cursor];
  const item = currentEntry.item;
  const isReviewPass = currentEntry.attempt > 1;
  const stepLabel = isReviewPass
    ? `Review Pass &bull; ${deck.queue.length - deck.cursor} left (${masteredCount}/${totalTerms} Mastered)`
    : `Term ${currentEntry.origIndex + 1} of ${totalTerms}`;
  const progressPct = Math.min(
    100,
    Math.max(8, Math.round(((isReviewPass ? masteredCount : currentEntry.origIndex) / totalTerms) * 100)),
  );

  const safeTermHtml = escVocabHtml(item.term);
  const safeDefHtml = escVocabHtml(item.definition);
  const safePhoneticHtml = item.phonetic ? escVocabHtml(item.phonetic) : '';
  const safeSpeakJs = escVocabJsSingle(item.term);

  return `
    <div class="hh-vocab-flip-stage-inner">
      <div class="hh-vocab-progress-row">
        <span class="hh-vocab-step-counter">
          <i class="fa-solid ${isReviewPass ? 'fa-rotate' : 'fa-layer-group'}"></i>
          <span>${stepLabel}</span>
        </span>
        <span class="hh-vocab-mastered-pill">${masteredCount} / ${totalTerms} Secured</span>
      </div>
      <div class="hh-vocab-progress-track" role="progressbar" aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100">
        <div class="hh-vocab-progress-fill" style="width: ${progressPct}%;"></div>
      </div>

      <div class="hh-vocab-flip-card ${deck.isFlipped ? 'is-flipped' : ''}"
        role="button"
        tabindex="0"
        aria-expanded="${deck.isFlipped ? 'true' : 'false'}"
        onclick="event.stopPropagation(); window.hhToggleVocabFlip('${safeKeyJs}');"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();window.hhToggleVocabFlip('${safeKeyJs}');}">
        <div class="hh-vocab-card-top-meta">
          <span class="hh-vocab-face-tag">${deck.isFlipped ? 'Definition Revealed' : 'Key Term'}</span>
          <button type="button"
            class="hh-vocab-card-speak-btn no-print"
            onclick="event.stopPropagation(); if (window.speakVocabWord) { window.speakVocabWord('${safeSpeakJs}', this); }"
            title="Listen to pronunciation in British English"
            aria-label="Listen to ${safeTermHtml}">
            <i class="fa-solid fa-volume-high"></i>
            <span>Listen</span>
          </button>
        </div>

        <div class="hh-vocab-card-term-wrap">
          <div class="hh-vocab-card-term">${safeTermHtml}</div>
          ${safePhoneticHtml ? `<div class="hh-vocab-card-phonetic">[${safePhoneticHtml}]</div>` : ''}
        </div>

        ${
          deck.isFlipped
            ? `
            <div class="hh-vocab-card-def-divider"></div>
            <div class="hh-vocab-card-definition">${safeDefHtml}</div>
          `
            : `
            <div class="hh-vocab-tap-hint">
              <i class="fa-solid fa-rotate"></i>
              <span>Think of the definition, then tap card to flip</span>
            </div>
          `
        }
      </div>

      ${
        !deck.isFlipped
          ? `
          <button type="button"
            class="hh-vocab-reveal-btn"
            onclick="event.stopPropagation(); window.hhToggleVocabFlip('${safeKeyJs}');">
            <i class="fa-solid fa-eye"></i>
            <span>Tap to Flip &amp; Reveal Definition</span>
          </button>
        `
          : `
          <div class="hh-vocab-grade-row">
            <button type="button"
              class="hh-vocab-grade-btn again"
              onclick="event.stopPropagation(); window.hhGradeVocabCard('${safeKeyJs}', false);">
              <i class="fa-solid fa-rotate-right"></i>
              <span>Again &#8635;</span>
            </button>
            <button type="button"
              class="hh-vocab-grade-btn gotit"
              onclick="event.stopPropagation(); window.hhGradeVocabCard('${safeKeyJs}', true);">
              <i class="fa-solid fa-check"></i>
              <span>Got it &#10003;</span>
            </button>
          </div>
        `
      }
    </div>
  `;
}

function ensureVocabFlipWindowHandlers() {
  if (typeof window === 'undefined' || window._hhVocabFlipHandlersBound) return;
  window._hhVocabFlipHandlersBound = true;
  window.__hhVocabDecks = window.__hhVocabDecks || {};

  const refreshVocabFlipDOM = (deckKey) => {
    if (typeof document === 'undefined') return;
    const deck = window.__hhVocabDecks && window.__hhVocabDecks[deckKey];
    if (!deck) return;
    const wrapper = document.querySelector(`.hh-vocab-dual-wrapper[data-deck-key="${CSS && CSS.escape ? CSS.escape(deckKey) : deckKey}"]`) ||
      Array.from(document.querySelectorAll('.hh-vocab-dual-wrapper')).find((el) => el.dataset.deckKey === deckKey);
    if (!wrapper) return;
    const flipPane = wrapper.querySelector('.hh-vocab-flip-pane');
    if (flipPane) {
      flipPane.innerHTML = buildVocabFlipStageInnerHTML(deck, deckKey);
    }
  };

  window.hhSetVocabMode = function (deckKey, mode) {
    const cleanMode = mode === 'flip' ? 'flip' : 'list';
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(VOCAB_VIEW_STORAGE_KEY, cleanMode);
      }
    } catch (e) {}
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.hh-vocab-dual-wrapper').forEach((wrapper) => {
      if (deckKey && wrapper.dataset.deckKey !== deckKey) return;
      wrapper.setAttribute('data-vocab-mode', cleanMode);
      wrapper.querySelectorAll('.hh-vocab-mode-pill').forEach((pill) => {
        const isAct = pill.dataset.vocabModeBtn === cleanMode;
        pill.classList.toggle('active', isAct);
        pill.setAttribute('aria-selected', isAct ? 'true' : 'false');
      });
      const flipPane = wrapper.querySelector('.hh-vocab-flip-pane');
      const listPane = wrapper.querySelector('.hh-vocab-list-pane');
      if (flipPane) flipPane.style.display = cleanMode === 'flip' ? 'block' : 'none';
      if (listPane) listPane.style.display = cleanMode === 'list' ? 'block' : 'none';
    });
  };

  window.hhToggleVocabFlip = function (deckKey) {
    const deck = window.__hhVocabDecks && window.__hhVocabDecks[deckKey];
    if (!deck || deck.completed) return;
    deck.isFlipped = !deck.isFlipped;
    refreshVocabFlipDOM(deckKey);
  };

  window.hhGradeVocabCard = function (deckKey, isCorrect) {
    const deck = window.__hhVocabDecks && window.__hhVocabDecks[deckKey];
    if (!deck || deck.completed || deck.cursor >= deck.queue.length) return;
    const entry = deck.queue[deck.cursor];
    const termText = String(entry?.item?.term || '').trim();
    if (termText) {
      try {
        const qId = generateQuestionId(deck.unitId || 'general', 'vocab', termText);
        updateLeitnerBox(qId, Boolean(isCorrect));
      } catch (e) {}
    }

    if (entry.attempt === 1 && isCorrect) {
      deck.firstTryCorrect += 1;
    }
    if (isCorrect) {
      if (!deck.masteredIndices.includes(entry.origIndex)) {
        deck.masteredIndices.push(entry.origIndex);
      }
    } else {
      deck.queue.push({
        item: entry.item,
        origIndex: entry.origIndex,
        attempt: entry.attempt + 1,
      });
    }

    deck.cursor += 1;
    deck.isFlipped = false;
    if (deck.cursor >= deck.queue.length) {
      deck.completed = true;
    }
    refreshVocabFlipDOM(deckKey);
  };

  window.hhResetVocabDeck = function (deckKey) {
    const deck = window.__hhVocabDecks && window.__hhVocabDecks[deckKey];
    if (!deck) return;
    deck.queue = deck.items.map((item, idx) => ({ item, origIndex: idx, attempt: 1 }));
    deck.cursor = 0;
    deck.isFlipped = false;
    deck.firstTryCorrect = 0;
    deck.masteredIndices = [];
    deck.completed = false;
    refreshVocabFlipDOM(deckKey);
  };
}
ensureVocabFlipWindowHandlers();

export function renderVocabLaunchpadPanelHTML(lesson, unitId = '', htmlVocabInner = '') {
  ensureVocabFlipWindowHandlers();
  const rawVocab = Array.isArray(lesson?.vocab)
    ? lesson.vocab
    : Array.isArray(lesson?.vocabulary)
      ? lesson.vocabulary
      : [];
  const vocabItems = rawVocab
    .map((v) => ({
      term: String(v?.term || v?.word || '').trim(),
      definition: String(v?.definition || v?.def || '').trim(),
      phonetic: String(v?.phonetic || v?.pronunciation || '').trim(),
    }))
    .filter((v) => v.term && v.definition);

  if (vocabItems.length === 0) {
    return htmlVocabInner || '';
  }

  const effectiveUnitId = unitId || (typeof window !== 'undefined' ? window.currentUnitId : '') || 'general';
  const lessonKey = String(lesson?.id || lesson?.title || 'current').replace(/[^a-zA-Z0-9_-]/g, '_');
  const deckKey = `${effectiveUnitId}__${lessonKey}`;
  const safeKeyAttr = escVocabHtml(deckKey);
  const safeKeyJs = escVocabJsSingle(deckKey);
  const initialMode = resolveDefaultVocabViewMode();

  const deckState = {
    unitId: effectiveUnitId,
    lessonId: lesson?.id || '',
    items: vocabItems,
    queue: vocabItems.map((item, idx) => ({ item, origIndex: idx, attempt: 1 })),
    cursor: 0,
    isFlipped: false,
    firstTryCorrect: 0,
    masteredIndices: [],
    completed: false,
  };

  if (typeof window !== 'undefined') {
    window.__hhVocabDecks = window.__hhVocabDecks || {};
    window.__hhVocabDecks[deckKey] = deckState;
  }

  const flipStageHtml = buildVocabFlipStageInnerHTML(deckState, deckKey);
  const glossaryRowsHtml = vocabItems
    .map((item) => {
      const safeTerm = escVocabHtml(item.term);
      const safeDef = escVocabHtml(item.definition);
      const safePhon = item.phonetic ? escVocabHtml(item.phonetic) : '';
      const safeSpeakJs = escVocabJsSingle(item.term);
      return `
        <div class="hh-vocab-glossary-item">
          <div class="hh-vocab-glossary-term-row">
            <div class="hh-vocab-glossary-term-group">
              <strong class="hh-vocab-glossary-term">${safeTerm}</strong>
              ${safePhon ? `<span class="hh-vocab-glossary-phonetic">[${safePhon}]</span>` : ''}
            </div>
            <button type="button"
              class="hh-vocab-glossary-speak no-print"
              onclick="event.stopPropagation(); if (window.speakVocabWord) { window.speakVocabWord('${safeSpeakJs}', this); }"
              title="Pronounce ${safeTerm} (British English)"
              aria-label="Pronounce ${safeTerm}">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
          <div class="hh-vocab-glossary-def">${safeDef}</div>
        </div>
      `;
    })
    .join('');

  const openMatchByDefault = typeof window !== 'undefined' ? window.innerWidth >= 933 : true;

  return `
    <div class="hh-vocab-dual-wrapper" data-deck-key="${safeKeyAttr}" data-vocab-mode="${initialMode}">
      <div class="hh-vocab-mode-header">
        <div class="hh-vocab-header-left">
          <span class="hh-vocab-header-icon"><i class="fa-solid fa-book-bookmark"></i></span>
          <span class="hh-vocab-header-title">Key Vocabulary</span>
          <span class="hh-vocab-header-count">${vocabItems.length} Terms</span>
        </div>
        <div class="hh-vocab-mode-toggle" role="tablist" aria-label="Vocabulary study mode">
          <button type="button"
            class="hh-vocab-mode-pill ${initialMode === 'flip' ? 'active' : ''}"
            data-vocab-mode-btn="flip"
            role="tab"
            aria-selected="${initialMode === 'flip' ? 'true' : 'false'}"
            onclick="event.stopPropagation(); window.hhSetVocabMode('${safeKeyJs}', 'flip');">
            <i class="fa-solid fa-layer-group"></i>
            <span>Flip Cards</span>
          </button>
          <button type="button"
            class="hh-vocab-mode-pill ${initialMode === 'list' ? 'active' : ''}"
            data-vocab-mode-btn="list"
            role="tab"
            aria-selected="${initialMode === 'list' ? 'true' : 'false'}"
            onclick="event.stopPropagation(); window.hhSetVocabMode('${safeKeyJs}', 'list');">
            <i class="fa-solid fa-list-check"></i>
            <span>Glossary List</span>
          </button>
        </div>
      </div>

      <div class="hh-vocab-flip-pane" style="display: ${initialMode === 'flip' ? 'block' : 'none'};">
        ${flipStageHtml}
      </div>

      <div class="hh-vocab-list-pane" style="display: ${initialMode === 'list' ? 'block' : 'none'};">
        <div class="hh-vocab-clean-glossary-list">
          ${glossaryRowsHtml}
        </div>
        ${
          htmlVocabInner
            ? `
          <details class="hh-vocab-match-details no-print" ${openMatchByDefault ? 'open' : ''}>
            <summary class="hh-vocab-match-summary">
              <span><i class="fa-solid fa-puzzle-piece"></i> Interactive Tap-to-Match Challenge</span>
              <i class="fa-solid fa-chevron-down hh-vocab-match-caret"></i>
            </summary>
            <div class="hh-vocab-match-inner">
              ${htmlVocabInner}
            </div>
          </details>
        `
            : ''
        }
      </div>
    </div>
  `;
}

export function renderLessonLaunchpad({
  lesson,
  unitId,
  lessonIndex = -1,
  videos = [],
  htmlVideo = '',
  htmlDoNowInner = '',
  htmlVocabInner = '',
  htmlSpineInner = '',
  htmlObjectivesInner = '',
  htmlInfographicInner = '',
  defaultTab = '',
}) {
  const isCme =
    unitId === 'cme_new' ||
    (typeof window !== 'undefined' && window.currentUnitId === 'cme_new');
  const resolvedLessonIndex =
    typeof lessonIndex === 'number' && Number.isFinite(lessonIndex) && lessonIndex >= 0
      ? lessonIndex
      : (() => {
          const idStr = String((lesson && lesson.id) || '');
          const idMatch = idStr.match(/^lesson_(\d+)$/i);
          if (idMatch) return parseInt(idMatch[1], 10);
          const unitLessons =
            (typeof window !== 'undefined' &&
              window.currentUnitData &&
              Array.isArray(window.currentUnitData.lessons) &&
              window.currentUnitData.lessons) ||
            [];
          const found = unitLessons.findIndex(
            (l) =>
              l &&
              ((lesson && lesson.id && l.id === lesson.id) ||
                (lesson && lesson.title && l.title === lesson.title)),
          );
          return found >= 0 ? found : 0;
        })();
  const tabs = [];

  // 1. Do Now Starter Tab
  const hasDoNow = Boolean(
    (lesson &&
      lesson.do_now &&
      ((lesson.do_now.items && lesson.do_now.items.length > 0) ||
        (lesson.do_now.questions && lesson.do_now.questions.length > 0) ||
        (lesson.do_now.tasks && lesson.do_now.tasks.length > 0) ||
        (lesson.do_now.events && lesson.do_now.events.length > 0))) ||
    (htmlDoNowInner && htmlDoNowInner.trim().length > 0),
  );

  if (hasDoNow) {
    tabs.push({
      key: 'donow',
      label: 'Do Now Starter',
      mobileLabel: 'Quick Recall',
      icon: 'fa-solid fa-stopwatch icon-donow',
      badge: '05:00',
    });
  }

  // 2. Key Vocabulary Tab
  const hasVocab = Boolean(
    (lesson && lesson.vocab && lesson.vocab.length > 0) ||
    (htmlVocabInner && htmlVocabInner.trim().length > 0),
  );
  if (hasVocab) {
    const vocabCount = lesson && lesson.vocab ? lesson.vocab.length : '';
    tabs.push({
      key: 'vocab',
      label: 'Key Vocabulary',
      mobileLabel: 'Key Vocab',
      icon: 'fa-solid fa-book-bookmark icon-vocab',
      badge: vocabCount ? `${vocabCount} Terms` : '',
    });
  }

  // 3. Chronology Spine Tab
  const hasSpine = Boolean(htmlSpineInner && htmlSpineInner.trim().length > 0);
  if (hasSpine) {
    tabs.push({
      key: 'spine',
      label: 'Chronology Spine',
      mobileLabel: 'Timeline',
      icon: 'fa-solid fa-timeline icon-spine',
    });
  }

  // 4. Video Pathway Tab
  const hasVideo = Boolean(
    (videos && videos.length > 0) || (htmlVideo && htmlVideo.trim().length > 0),
  );
  if (hasVideo) {
    let videoDuration = '';
    if (videos && videos.length > 0 && videos[0].duration) {
      videoDuration = videos[0].duration
        .replace(/\bmins?\b/gi, 'm')
        .replace(/\bsecs?\b/gi, 's')
        .replace(/\s+/g, ' ')
        .trim();
    }
    tabs.push({
      key: 'video',
      label: 'Video Pathway',
      mobileLabel: 'Video',
      icon: 'fa-solid fa-play icon-video',
      badge: videoDuration || `${videos.length} Clip${videos.length > 1 ? 's' : ''}`,
    });
  }

  // 5. Visual Revision Mat Tab (Infographic)
  let lessonInfographics = [];
  const effectiveUnitId = unitId || (typeof window !== 'undefined' ? window.currentUnitId : '');
  if (typeof getLessonInfographicsSync === 'function') {
    lessonInfographics = getLessonInfographicsSync(effectiveUnitId, lesson?.id);
  } else if (typeof window !== 'undefined' && typeof window.getLessonInfographicsSync === 'function') {
    lessonInfographics = window.getLessonInfographicsSync(effectiveUnitId, lesson?.id);
  }
  const hasInfographic = Boolean(
    (lessonInfographics && lessonInfographics.length > 0) ||
    (htmlInfographicInner && htmlInfographicInner.trim().length > 0),
  );
  if (hasInfographic) {
    const count = lessonInfographics.length;
    const hasInteractive = lessonInfographics && lessonInfographics.some((m) => m.interactiveUrl);
    tabs.push({
      key: 'infographic',
      label: hasInteractive
        ? count > 1
          ? `Interactive Infographics (${count})`
          : 'Interactive Infographic'
        : count > 1
          ? `Infographics (${count})`
          : 'Infographic',
      mobileLabel: 'Story Cards',
      icon: hasInteractive
        ? 'fa-solid fa-wand-magic-sparkles icon-infographic'
        : 'fa-solid fa-image icon-infographic',
      badge: hasInteractive
        ? count > 1
          ? `${count} Interactive`
          : 'Interactive'
        : count > 1
          ? `${count} Infographics`
          : '1-Sheet',
    });
  }

  // 6. Historical Atlas Tab (CME Era-Aware Theater Map Modal)
  if (isCme) {
    tabs.push({
      key: 'atlas',
      label: 'Historical Atlas',
      mobileLabel: 'Atlas Map',
      icon: 'fa-solid fa-map',
      isAtlasModal: true,
    });
  }

  // 7. Learning Objectives Tab (Moved to end so mobile pupils see Do Now, Vocab, Spine & Video immediately)
  const hasObjectives = Boolean(
    (lesson &&
      lesson.learning_objectives &&
      ((Array.isArray(lesson.learning_objectives) && lesson.learning_objectives.length > 0) ||
        (lesson.learning_objectives.scaffolded && lesson.learning_objectives.scaffolded.length > 0))) ||
    (lesson &&
      lesson.teacher_notes &&
      Array.isArray(lesson.teacher_notes.objectives) &&
      lesson.teacher_notes.objectives.length > 0) ||
    (htmlObjectivesInner && htmlObjectivesInner.trim().length > 0),
  );

  if (hasObjectives) {
    let objCount = 0;
    if (lesson && lesson.learning_objectives) {
      if (Array.isArray(lesson.learning_objectives)) {
        objCount = lesson.learning_objectives.length;
      } else if (Array.isArray(lesson.learning_objectives.scaffolded)) {
        objCount = lesson.learning_objectives.scaffolded.length;
      }
    }
    if (!objCount && lesson && lesson.teacher_notes && Array.isArray(lesson.teacher_notes.objectives)) {
      objCount = lesson.teacher_notes.objectives.length;
    }
    tabs.push({
      key: 'objectives',
      label: 'Learning Objectives',
      mobileLabel: 'Goals',
      icon: 'fa-solid fa-bullseye icon-objectives',
      badge: objCount ? `${objCount} Goals` : '',
    });
  }

  if (tabs.length === 0) return '';

  // Active tab selection: only set active if defaultTab is explicitly specified and exists
  const activeTabKey = defaultTab && tabs.some((t) => t.key === defaultTab && !t.isAtlasModal) ? defaultTab : '';
  const upgradedVocabPanelHtml = hasVocab
    ? renderVocabLaunchpadPanelHTML(lesson, effectiveUnitId, htmlVocabInner)
    : '';

  return `
    <div class="lesson-launchpad-container" id="lesson-launchpad-${lesson.id || 'current'}">
      <div class="launchpad-bar">
        <div class="launchpad-tabs-group" role="tablist">
          ${tabs
            .map((tab) => {
              const labelDualHtml = tab.mobileLabel
                ? `<span class="lp-lbl-desktop">${tab.label}</span><span class="lp-lbl-mobile">${tab.mobileLabel}</span>`
                : `<span>${tab.label}</span>`;
              if (tab.isAtlasModal) {
                return `
              <button type="button"
                class="launchpad-tab-btn launchpad-atlas-btn"
                data-tab="atlas"
                onclick="if(typeof window.openCmeTheaterMapModal === 'function') window.openCmeTheaterMapModal({lessonIndex: ${resolvedLessonIndex}});"
                title="Historical Atlas (Era-Aware Regional Maps &amp; Live Terrain) [Shortcut: M]">
                <i class="${tab.icon}"></i>
                ${labelDualHtml}
              </button>
            `;
              }
              const isActive = tab.key === activeTabKey;
              return `
              <button type="button"
                class="launchpad-tab-btn ${isActive ? 'active' : ''}"
                data-action="switch-launchpad-tab"
                data-tab="${tab.key}"
                onclick="if(this.scrollIntoView){this.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});}"
                role="tab"
                aria-selected="${isActive ? 'true' : 'false'}"
                title="${tab.label}">
                <i class="${tab.icon}"></i>
                ${labelDualHtml}
              </button>
            `;
            })
            .join('')}
        </div>
        <div class="launchpad-actions-group">
          <button type="button"
            class="launchpad-podcast-btn no-print"
            onclick="window.hhPlayFullLessonPodcast && window.hhPlayFullLessonPodcast(this)"
            title="Play Full Lesson Hands-Free (Continuous Podcast Narration)">
            <i class="fa-solid fa-headphones"></i>
            <span class="lp-podcast-lbl">Listen</span>
          </button>
          <button type="button"
            class="launchpad-close-btn"
            data-action="close-launchpad"
            title="Collapse drawer"
            aria-label="Close panel"
            style="${activeTabKey ? 'display: inline-flex;' : 'display: none;'}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div class="lesson-launchpad-drawer" id="launchpad-drawer-${lesson.id || 'current'}" style="${activeTabKey ? 'display: block;' : 'display: none;'}">
        ${hasDoNow
          ? `
          <div class="launchpad-panel ${activeTabKey === 'donow' ? 'active' : ''}" data-panel="donow" style="${activeTabKey === 'donow' ? 'display: block;' : 'display: none;'}">
            ${htmlDoNowInner}
          </div>
        `
          : ''
        }
        ${hasVocab
          ? `
          <div class="launchpad-panel ${activeTabKey === 'vocab' ? 'active' : ''}" data-panel="vocab" style="${activeTabKey === 'vocab' ? 'display: block;' : 'display: none;'}">
            ${upgradedVocabPanelHtml}
          </div>
        `
          : ''
        }
        ${hasSpine
          ? `
          <div class="launchpad-panel ${activeTabKey === 'spine' ? 'active' : ''}" data-panel="spine" style="${activeTabKey === 'spine' ? 'display: block;' : 'display: none;'}">
            ${htmlSpineInner}
          </div>
        `
          : ''
        }
        ${hasVideo
          ? `
          <div class="launchpad-panel ${activeTabKey === 'video' ? 'active' : ''}" data-panel="video" style="${activeTabKey === 'video' ? 'display: block;' : 'display: none;'}">
            ${htmlVideo}
          </div>
        `
          : ''
        }
        ${hasInfographic
          ? `
          <div class="launchpad-panel ${activeTabKey === 'infographic' ? 'active' : ''}" data-panel="infographic" style="${activeTabKey === 'infographic' ? 'display: block;' : 'display: none;'}">
            ${htmlInfographicInner || renderLaunchpadInfographicPanelHTML(lesson, effectiveUnitId, lessonInfographics)}
          </div>
        `
          : ''
        }
        ${hasObjectives
          ? `
          <div class="launchpad-panel ${activeTabKey === 'objectives' ? 'active' : ''}" data-panel="objectives" style="${activeTabKey === 'objectives' ? 'display: block;' : 'display: none;'}">
            ${htmlObjectivesInner}
          </div>
        `
          : ''
        }
      </div>
    </div>
  `;
}

export function renderSourceUtilityTaskHTML(task, lessonIndex, tIdx, unitId, lessonObj = null) {
  const isKs3TaskUnit = KS3_CANONICAL_UNITS.includes(unitId);
  const taskId = task.id || `task-su-${lessonIndex}-${tIdx}`;
  const qNumPrefix = !isKs3TaskUnit && task.qNum ? `Q${task.qNum}. ` : '';
  const rawTitle = task.title || 'Dual-Source Utility & Provenance Investigation';
  const title = isKs3TaskUnit
    ? rawTitle
        .replace(/^Question\s*\d+(?:\([a-d]\))?\s*:\s*/i, '')
        .replace(/\s*\[\s*\d+[^\]]*\]\s*$/i, '')
        .trim() || 'Comparing Two Primary Sources'
    : rawTitle;
  const prompt =
    task.question ||
    task.text ||
    task.enquiryQuestion ||
    'How useful are Sources A and B for this enquiry?';
  const sourceA = task.source_a || task.sourceA || {};
  const sourceB = task.source_b || task.sourceB || {};
  const matrix = task.matrix ||
    task.structureStrip || [
      {
        col: '1. SOURCE 1 DUAL-ANCHOR (~90 words)',
        text: 'Quote 1 (Content) &rarr; Contextual Validation &rarr; Quote 2 + 1-Aspect NOP (Author/Purpose).',
      },
      {
        col: '2. SOURCE 2 DUAL-ANCHOR (~90 words)',
        text: 'Quote 1 (Content) &rarr; Contextual Validation &rarr; Quote 2 + 1-Aspect NOP (Author/Purpose).',
      },
      {
        col: '3. TIMING BUDGET (10–12 Mins)',
        text: 'Weave 3 strands together. Zero intro, zero comparison between sources, zero conclusion.',
      },
    ];
  let connectives = [];
  if (Array.isArray(task.connectives)) {
    connectives = task.connectives;
  } else if (typeof task.connectives === 'string') {
    connectives = task.connectives
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    connectives = [
      'Source B is useful for investigating [enquiry] because it demonstrates that...',
      'This claim is corroborated by historical evidence, such as...',
      'The source\'s utility is enhanced/shaped by its provenance, as...',
      'Source C is equally useful because it reveals that...',
      'This confirms that...',
      'As an authentic [speech/report/circular] produced by [author], its purpose was...',
    ];
  }
  const modelAnswer = task.model_answer || task.model || '';

  const renderSourceCard = (srcObj, letter, borderCol, bgCol, textCol) => {
    const sTitle = srcObj.title || `Source ${letter}`;
    const sShelf = srcObj.shelfmark || srcObj.provenance || 'HISTORICAL ARCHIVE';
    const sText = srcObj.text || srcObj.quote || '';
    const sClue = srcObj.clue || srcObj.provenance_clue || '';
    const rawImg = srcObj.src || srcObj.image || '';
    const imgSrc = rawImg ? getAssetUrl(rawImg) : '';

    return `
      <div class="archival-source-box" style="background: ${bgCol}; border: 1.5px solid ${borderCol}; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid ${borderCol}; padding-bottom: 6px; flex-wrap: wrap; gap: 6px;">
            <strong style="color: ${textCol}; font-size: 0.95rem; text-transform: uppercase; font-family: 'Inter', sans-serif;">
              <i class="fa-solid fa-file-lines" style="margin-right: 5px;"></i> ${sTitle}
            </strong>
            <span class="archival-shelfmark-stamp" style="font-family: monospace; font-size: 0.68rem; padding: 2px 6px; background: rgba(0,0,0,0.06); border-radius: 3px; color: #475569; border: 1px solid rgba(0,0,0,0.1);">
              ${sShelf}
            </span>
          </div>
          ${imgSrc
        ? `
            <div style="text-align: center; margin-bottom: 10px; background: #0f172a; border-radius: 6px; padding: 6px;">
              <img src="${imgSrc}" alt="${sTitle}" style="max-height: 200px; max-width: 100%; object-fit: contain; border-radius: 4px; cursor: zoom-in;" data-action="open-modal" data-src="${imgSrc}" title="Click to zoom">
            </div>
          `
        : ''
      }
          <div class="archival-source-body" style="font-family: 'Georgia', serif; font-size: 0.92rem; line-height: 1.55; color: #1e293b; margin-bottom: 10px; font-style: italic;">
            ${sText ? `&ldquo;${sText.replace(/^“|”$/g, '')}&rdquo;` : ''}
          </div>
        </div>
        ${sClue
        ? `
          <div style="padding: 8px 10px; background: #ffffff; border-left: 3px solid ${textCol}; border-radius: 4px; font-size: 0.82rem; color: #334155; line-height: 1.4; margin-top: 6px;">
            <strong style="color: ${textCol};"><i class="fa-solid fa-lightbulb"></i> Provenance Clue:</strong> ${sClue}
          </div>
        `
        : ''
      }
      </div>
    `;
  };

  const suUid = String(taskId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const suTargetMins = 12;
  const buildProjSourcePane = (srcObj, letter) => {
    const sTitle = srcObj.title || `Source ${letter}`;
    const sProv = srcObj.shelfmark || srcObj.provenance || '';
    const sText = srcObj.text || srcObj.quote || '';
    const rawImg = srcObj.src || srcObj.image || '';
    const imgSrc = rawImg ? getAssetUrl(rawImg) : '';
    return `
      <div class="proj-pane proj-pane-source">
        <div class="proj-pane-header">
          <span class="proj-badge proj-badge-source">Source ${letter}</span>
          <span class="proj-prov">${sTitle}${sProv && sProv !== sTitle ? ` &bull; ${sProv}` : ''}</span>
        </div>
        <div class="proj-pane-body${imgSrc ? ' proj-pane-media' : ''}">
          ${imgSrc ? `<img src="${imgSrc}" alt="${sTitle}" />` : ''}
          <div>${sText ? `&ldquo;${sText.replace(/^“|”$/g, '')}&rdquo;` : ''}</div>
        </div>
      </div>
    `;
  };
  registerUnifiedExamQuestion(suUid, {
    id: suUid,
    qCode: `Task ${tIdx + 1}`,
    type: isKs3TaskUnit ? 'Source Enquiry' : 'Source Utility',
    marks: 8,
    marksDisplay: isKs3TaskUnit ? 'Source Enquiry' : '8 Marks',
    targetMins: suTargetMins,
    inWorkbook: true,
    mockTitle: 'In Printed Workbook',
    questionText: prompt,
    stimulus: [],
    sourceExtract: `<div class="proj-pair-grid">${buildProjSourcePane(sourceA, 'A')}${buildProjSourcePane(sourceB, 'B')}</div>`,
    projectorFooter: isKs3TaskUnit
      ? 'Key Stage 3 History &bull; Primary Source Enquiry &bull; The History Revision Hub'
      : `Pearson Edexcel GCSE History &bull; ${getCanonicalGcsePaperCode(unitId)} &bull; The History Revision Hub`,
  });

  const suHasOuterStripStem = Boolean(task.question || task.stem || task.text || task.prompt);

  return `
    <div class="task-box source-utility-interactive" id="${taskId}" data-task-id="${taskId}" style="margin-bottom: 4px; background: #ffffff; padding: 4px 0 0 0;">
      ${
        !suHasOuterStripStem
          ? `<div style="font-size: 0.98rem; font-weight: 700; color: #0f172a; margin-bottom: 12px; line-height: 1.5; padding: 10px 14px; background: #eff6ff; border-left: 4px solid #1e3a8a; border-radius: 0 6px 6px 0;">
              <strong>Enquiry Question:</strong> ${prompt}
            </div>`
          : ''
      }

      <!-- Side-by-Side Primary Sources -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 14px;">
        ${renderSourceCard(sourceA, 'A', '#93c5fd', '#f8fafc', '#1e40af')}
        ${renderSourceCard(sourceB, 'B', '#cbd5e1', '#ffffff', '#334155')}
      </div>

      ${(() => {
        const rawWords =
          (Array.isArray(task?.scaffolding?.word_bank) && task.scaffolding.word_bank.length > 0
            ? task.scaffolding.word_bank
            : null) ||
          (Array.isArray(task?.word_bank) && task.word_bank.length > 0 ? task.word_bank : null) ||
          (Array.isArray(lessonObj?.vocab)
            ? lessonObj.vocab.map((v) => (typeof v === 'object' ? v.term : v)).filter(Boolean)
            : []);
        const wbBtnHtml =
          rawWords.length > 0
            ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="su-wb-${suUid}" style="background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-tags" style="color: #0d9488;"></i> Word Bank <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>`
            : '';
        const scafBtnHtml = `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="su-scaf-${suUid}" style="background: #f1f5f9; color: #1e3a8a; border: 1px solid #cbd5e1; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-wand-magic-sparkles" style="color: #2563eb;"></i> Starters &amp; Plan <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>`;
        const wbDrawerHtml =
          rawWords.length > 0
            ? `<div id="su-wb-${suUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #99f6e4; border-radius: 8px; padding: 11px 14px; margin-top: 8px;">
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin-bottom: 6px;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0f766e; text-transform: uppercase;">Core Vocabulary Bank:</span>
                  <span style="font-size: 0.72rem; font-weight: 600; color: #64748b;">Tap word to cross off &bull; <i class="fa-solid fa-volume-high" style="color: #0d9488;"></i> to hear</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                  ${rawWords.map((w) => renderSpeakableVocabChipHTML(w, lessonObj)).join('')}
                </div>
              </div>`
            : '';
        const scafDrawerHtml = `
          <div id="su-scaf-${suUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #93c5fd; border-radius: 8px; padding: 12px 14px; margin-top: 8px;">
            <div style="font-weight: 700; font-size: 0.82rem; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-table-columns"></i> 3-Step Utility Planning Matrix: Evidence &bull; Provenance &bull; Verdict
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 12px;">
              ${matrix
                .map(
                  (m, mIdx) => `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: 3px solid ${mIdx === 0 ? '#3b82f6' : mIdx === 1 ? '#8b5cf6' : '#10b981'}; border-radius: 6px; padding: 10px;">
                  <strong style="display: block; font-size: 0.82rem; color: #1e293b; margin-bottom: 4px; text-transform: uppercase;">
                    ${m.col || m.title || `Phase ${mIdx + 1}`}
                  </strong>
                  <div style="font-size: 0.82rem; color: #475569; line-height: 1.4;">
                    ${m.text || m.prompt || ''}
                  </div>
                </div>
              `,
                )
                .join('')}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #1e40af; text-transform: uppercase;">Sentence Starters &amp; Connectives:</span>
              ${connectives
                .map(
                  (c) => `
                <span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="Tap to cross off once used" style="background: #ffffff; border: 1px solid #bfdbfe; color: #1e40af; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${c}</span>
              `,
                )
                .join('')}
            </div>
          </div>`;
        const modelBtnHtml = modelAnswer
          ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="toggle-element" data-target-id="su-model-${suUid}" title="Reveal Model Answer" style="background: #f0fdf4; color: #166534; border: 1.5px solid #86efac; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-eye" style="color: #16a34a;"></i> Reveal Answer</button>`
          : '';
        const timerProjBtnsHtml = `
          <button type="button" onclick="window.toggleExamCardTimer('${suUid}', ${suTargetMins})" style="background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; padding: 5px 10px; border-radius: 7px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-regular fa-clock" style="color: #2563eb;"></i> Timer (${suTargetMins}m)
          </button>
          <button type="button" onclick="window.openExamCardProjector('${suUid}')" style="background: #f8fafc; color: #0f172a; border: 1.5px solid #cbd5e1; padding: 5px 10px; border-radius: 7px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-expand" style="color: #475569;"></i> Projector
          </button>
        `;
        const modelDrawerHtml = modelAnswer
          ? `<div id="su-model-${suUid}" class="scaffold-box model-box" style="display: none; margin-top: 8px; padding: 12px 15px; background: #ffffff; border-left: 3px solid #2563eb; border-radius: 6px; font-size: 0.92rem; color: #1e293b; line-height: 1.6; border: 1px solid #bfdbfe;">${modelAnswer}</div>`
          : '';
        return `
          <div class="no-print">
            <div class="wb-unified-control-bar" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 7px;">${wbBtnHtml}${scafBtnHtml}</div>
              <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 7px; margin-left: auto;">${modelBtnHtml}${timerProjBtnsHtml}</div>
            </div>
            ${wbDrawerHtml}
            ${scafDrawerHtml}
            ${renderInlineTaskTimerBarHTML(suUid, suTargetMins)}
            ${modelDrawerHtml}
          </div>`;
      })()}
    </div>
  `;
}

export function renderHistoricalInterpretationsTaskHTML(
  task,
  lessonIndex,
  tIdx,
  unitId,
  lessonObj = null,
) {
  const isKs3TaskUnit = KS3_CANONICAL_UNITS.includes(unitId);
  const taskId = task.id || `task-hi-${lessonIndex}-${tIdx}`;
  const qNumPrefix = !isKs3TaskUnit && task.qNum ? `Q${task.qNum}. ` : '';
  const rawTitle = task.title || 'Historiographical Debate & Academic Interpretations';
  const title = isKs3TaskUnit
    ? rawTitle
        .replace(/^Question\s*\d+(?:\s*\([a-d]\)\s*(?:&|and)\s*\d*\([a-d]\))?\s*:\s*/i, '')
        .replace(/\s*\[\s*\d+[^\]]*\]\s*$/i, '')
        .trim() || 'Contrasting Historical Interpretations'
    : rawTitle;
  const prompt =
    task.question ||
    task.text ||
    task.enquiryQuestion ||
    'How far do you agree with Interpretation 1?';
  const interp1 = task.interp1 || task.interpretation_1 || task.interp_1 || {};
  const interp2 = task.interp2 || task.interpretation_2 || task.interp_2 || {};
  const sourceB = task.source_b || task.source1 || task.sourceB || null;
  const sourceC = task.source_c || task.source2 || task.sourceC || null;
  const matrix = task.matrix || [
    {
      col: '1. INTERPRETATION 1 CLAIMS',
      text: 'Explain the core thesis, supporting arguments, and evidence cited.',
    },
    {
      col: '2. INTERPRETATION 2 CRITIQUE',
      text: 'Evaluate how Interpretation 2 challenges or reframes this debate.',
    },
    {
      col: '3. HISTORIOGRAPHICAL VERDICT',
      text: 'Weigh both interpretations against factual evidence to reach an independent verdict.',
    },
  ];
  let connectives = [];
  if (Array.isArray(task.connectives)) {
    connectives = task.connectives;
  } else if (typeof task.connectives === 'string') {
    connectives = task.connectives
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean);
  } else {
    connectives = [
      'Interpretation 1 contends that...',
      'Evidence supporting this critique includes...',
      'In sharp contrast, Interpretation 2 argues that...',
      'This revisionist perspective is corroborated by...',
      'Weighing both interpretations against historical evidence, I conclude that...',
    ];
  }
  let modelAnswer = task.model_answer || task.model || '';
  if (!modelAnswer) {
    const parts = [];
    if (task.sub_question_b) {
      const cleanSubPromptB = String(task.sub_question_b.prompt || '').replace(/\s*\[\s*\d+\s*marks?\s*\]/gi, '');
      const qPrompt = cleanSubPromptB
        ? `<strong style="color: #6d28d9; display: block; margin-bottom: 6px;">${isKs3TaskUnit ? `Step 1 (Main Difference): ${cleanSubPromptB}` : `Part (b) [4 marks]: ${cleanSubPromptB}`}</strong>`
        : `<strong style="color: #6d28d9; display: block; margin-bottom: 6px;">${isKs3TaskUnit ? 'Step 1 Model Paragraph (How They Differ):' : 'Part (b) Target Exemplar Model Answer [4 marks]:'}</strong>`;
      parts.push(`${qPrompt}<div style="line-height: 1.6;">${task.sub_question_b.model || task.sub_question_b.model_answer || ''}</div>`);
    } else if (task.model_answer_b) {
      parts.push(`<strong style="color: #6d28d9; display: block; margin-bottom: 6px;">${isKs3TaskUnit ? 'Step 1 Model Paragraph (How They Differ):' : 'Part (b) Target Exemplar Model Answer [4 marks]:'}</strong><div style="line-height: 1.6;">${task.model_answer_b}</div>`);
    }
    if (task.sub_question_c) {
      const cleanSubPromptC = String(task.sub_question_c.prompt || '').replace(/\s*\[\s*\d+\s*marks?\s*\]/gi, '');
      const qPrompt = cleanSubPromptC
        ? `<strong style="color: #6d28d9; display: block; margin-bottom: 6px;">${isKs3TaskUnit ? `Step 2 (Why Historians Differ): ${cleanSubPromptC}` : `Part (c) [4 marks]: ${cleanSubPromptC}`}</strong>`
        : `<strong style="color: #6d28d9; display: block; margin-bottom: 6px;">${isKs3TaskUnit ? 'Step 2 Model Paragraph (Why Historians Differ):' : 'Part (c) Target Exemplar Model Answer [4 marks]:'}</strong>`;
      parts.push(`${qPrompt}<div style="line-height: 1.6;">${task.sub_question_c.model || task.sub_question_c.model_answer || ''}</div>`);
    } else if (task.model_answer_c) {
      parts.push(`<strong style="color: #6d28d9; display: block; margin-bottom: 6px;">${isKs3TaskUnit ? 'Step 2 Model Paragraph (Why Historians Differ):' : 'Part (c) Target Exemplar Model Answer [4 marks]:'}</strong><div style="line-height: 1.6;">${task.model_answer_c}</div>`);
    }
    if (parts.length > 0) {
      modelAnswer = parts.join('<div style="margin: 14px 0; border-top: 1px dashed #ddd6fe;"></div>');
    }
  }

  const renderSourceCard = (srcObj, numOrLabel, borderCol, bgCol, textCol) => {
    if (!srcObj) return '';
    const sTitle = srcObj.title || srcObj.label || (typeof numOrLabel === 'string' ? numOrLabel : `Source ${numOrLabel}`);
    const sBadge = srcObj.badge || (numOrLabel === 'Source B' || numOrLabel === 1 ? 'Primary Source Evidence (Corroborates Interp 1)' : 'Primary Source Evidence (Corroborates Interp 2)');
    const sAuthor = srcObj.author || srcObj.provenance || srcObj.attribution || '';
    const sWork = srcObj.work || srcObj.source || srcObj.title_of_work || '';
    const sText =
      typeof srcObj === 'string'
        ? srcObj
        : srcObj.extract ||
          srcObj.text ||
          srcObj.quote ||
          srcObj.content ||
          srcObj.body ||
          srcObj.statement ||
          srcObj.excerpt ||
          '';

    const citation = [sAuthor, sWork ? `<em>${sWork}</em>` : ''].filter(Boolean).join(' &bull; ');

    return `
      <div style="background: ${bgCol}; border: 1.5px solid ${borderCol}; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid ${borderCol}; padding-bottom: 6px; flex-wrap: wrap; gap: 6px;">
            <strong style="color: ${textCol}; font-size: 0.95rem; text-transform: uppercase; font-family: 'Inter', sans-serif;">
              <i class="fa-solid fa-scroll" style="margin-right: 5px;"></i> ${sTitle}
            </strong>
            <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 7px; background: rgba(0,0,0,0.06); border-radius: 3px; color: ${textCol}; border: 1px solid rgba(0,0,0,0.1);">
              ${sBadge}
            </span>
          </div>
          <div class="archival-source-body" style="font-family: 'Georgia', serif; font-size: 0.93rem; line-height: 1.6; color: #1e293b; margin-bottom: 12px; font-style: italic; background: rgba(255,255,255,0.75); padding: 10px 12px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05);">
            ${sText ? `&ldquo;${sText.replace(/^“|”$/g, '')}&rdquo;` : '<span style="color: #94a3b8;">[Source extract text unavailable]</span>'}
          </div>
        </div>
        ${citation
        ? `
          <div style="padding: 6px 10px; background: #ffffff; border-left: 3px solid ${textCol}; border-radius: 4px; font-size: 0.8rem; color: #475569; font-weight: 600;">
            <i class="fa-solid fa-feather-pointed" style="color: ${textCol};"></i> ${citation}
          </div>
        `
        : ''
      }
      </div>
    `;
  };

  const renderInterpCard = (intObj, num, borderCol, bgCol, textCol) => {
    if (!intObj) return '';
    const iTitle = intObj.title || `Interpretation ${num}`;
    const iBadge =
      intObj.badge || (num === 1 ? 'Orthodox Historiography' : 'Revisionist Historiography');
    const iAuthor = intObj.author || intObj.provenance || intObj.attribution || '';
    const iWork = intObj.work || intObj.source || intObj.title_of_work || '';
    const iText =
      typeof intObj === 'string'
        ? intObj
        : intObj.extract ||
          intObj.text ||
          intObj.quote ||
          intObj.content ||
          intObj.interpretation ||
          intObj.body ||
          intObj.statement ||
          intObj.excerpt ||
          '';

    const citation = [iAuthor, iWork ? `<em>${iWork}</em>` : ''].filter(Boolean).join(' &bull; ');

    return `
      <div style="background: ${bgCol}; border: 1.5px solid ${borderCol}; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid ${borderCol}; padding-bottom: 6px; flex-wrap: wrap; gap: 6px;">
            <strong style="color: ${textCol}; font-size: 0.95rem; text-transform: uppercase; font-family: 'Inter', sans-serif;">
              <i class="fa-solid fa-graduation-cap" style="margin-right: 5px;"></i> ${iTitle}
            </strong>
            <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 7px; background: rgba(0,0,0,0.06); border-radius: 3px; color: ${textCol}; border: 1px solid rgba(0,0,0,0.1);">
              ${iBadge}
            </span>
          </div>
          <div class="archival-source-body" style="font-family: 'Georgia', serif; font-size: 0.95rem; line-height: 1.6; color: #1e293b; margin-bottom: 12px; font-style: italic; background: rgba(255,255,255,0.7); padding: 10px 12px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05);">
            ${iText ? `&ldquo;${iText.replace(/^“|”$/g, '')}&rdquo;` : '<span style="color: #94a3b8;">[Interpretation extract text unavailable]</span>'}
          </div>
        </div>
        ${citation
        ? `
          <div style="padding: 6px 10px; background: #ffffff; border-left: 3px solid ${textCol}; border-radius: 4px; font-size: 0.8rem; color: #475569; font-weight: 600;">
            <i class="fa-solid fa-user-pen" style="color: ${textCol};"></i> ${citation}
          </div>
        `
        : ''
      }
      </div>
    `;
  };

  const hiUid = String(taskId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const hiTargetMins = 15;
  const extractInterpStr = (intObj) =>
    typeof intObj === 'string'
      ? intObj
      : intObj?.extract || intObj?.text || intObj?.quote || intObj?.content || intObj?.interpretation || intObj?.body || intObj?.statement || intObj?.excerpt || '';
  const buildProjInterpPane = (intObj, num) => {
    const iAuthor = intObj?.author || intObj?.provenance || intObj?.attribution || '';
    const iWork = intObj?.work || intObj?.source || intObj?.title_of_work || '';
    const iCit = [iAuthor, iWork].filter(Boolean).join(' • ') || `Interpretation ${num}`;
    const iTxt = extractInterpStr(intObj);
    return `
      <div class="proj-pane proj-pane-interp">
        <div class="proj-pane-header">
          <span class="proj-badge proj-badge-interp">Interpretation ${num}</span>
          <span class="proj-prov">${iCit}</span>
        </div>
        <div class="proj-pane-body">&ldquo;${String(iTxt).replace(/^“|”$/g, '')}&rdquo;</div>
      </div>
    `;
  };
  const buildProjMatchedSrcPane = (srcObj, lbl) => {
    if (!srcObj) return '';
    const sAuthor = srcObj?.author || srcObj?.provenance || srcObj?.attribution || srcObj?.title || lbl;
    const sTxt = extractInterpStr(srcObj);
    return `
      <div class="proj-pane proj-pane-source">
        <div class="proj-pane-header">
          <span class="proj-badge proj-badge-source">${lbl}</span>
          <span class="proj-prov">${sAuthor}</span>
        </div>
        <div class="proj-pane-body">&ldquo;${String(sTxt).replace(/^“|”$/g, '')}&rdquo;</div>
      </div>
    `;
  };
  const hiProjExtract =
    sourceB || sourceC
      ? `<div class="proj-quad-matrix"><div class="proj-quad-top">${buildProjInterpPane(interp1, 1)}${buildProjInterpPane(interp2, 2)}</div><div class="proj-quad-seam"><span>Matched Primary Evidence (Sources B &amp; C)</span><button type="button" onclick="window.toggleProjectorQuadSources(this)" style="background:#ffffff;border:1px solid #93c5fd;color:#1e40af;border-radius:5px;padding:2px 8px;font-size:0.75rem;font-weight:700;cursor:pointer;">Hide Sources B &amp; C ▴</button></div><div class="proj-quad-bottom">${buildProjMatchedSrcPane(sourceB, 'Source B')}${buildProjMatchedSrcPane(sourceC, 'Source C')}</div></div>`
      : `<div class="proj-pair-grid">${buildProjInterpPane(interp1, 1)}${buildProjInterpPane(interp2, 2)}</div>`;

  registerUnifiedExamQuestion(hiUid, {
    id: hiUid,
    qCode: `Task ${tIdx + 1}`,
    type: isKs3TaskUnit ? 'Historical Interpretations' : 'Historiographical Debate',
    marks: 16,
    marksDisplay: isKs3TaskUnit ? 'Historical Interpretations' : '16 Marks + 4 SPaG',
    targetMins: hiTargetMins,
    inWorkbook: true,
    mockTitle: 'In Printed Workbook',
    questionText: prompt,
    stimulus: [],
    sourceExtract: hiProjExtract,
    projectorFooter: isKs3TaskUnit
      ? 'Key Stage 3 History &bull; Historical Interpretations &bull; The History Revision Hub'
      : `Pearson Edexcel GCSE History &bull; ${getCanonicalGcsePaperCode(unitId)} &bull; The History Revision Hub`,
  });

  const hiHasOuterStripStem = Boolean(task.question || task.stem || task.text || task.prompt);

  return `
    <div class="task-box historical-interpretations-interactive" id="${taskId}" data-task-id="${taskId}" style="margin-bottom: 4px; background: #ffffff; padding: 4px 0 0 0;">
      ${
        !hiHasOuterStripStem
          ? `<div style="font-size: 0.98rem; font-weight: 700; color: #0f172a; margin-bottom: 12px; line-height: 1.5; padding: 10px 14px; background: #f5f3ff; border-left: 4px solid #7c3aed; border-radius: 0 6px 6px 0;">
              <strong>Debate Prompt:</strong> ${prompt}
            </div>`
          : ''
      }

      <!-- Disciplinary Technique Guide -->
      <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-left: 4px solid #16a34a; border-radius: 6px; padding: 12px 14px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
          <strong style="color: #166534; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-award"></i> ${isKs3TaskUnit ? 'How Historians Disagree • 2-Step Comparison Guide' : 'Pearson Edexcel GCSE Paper 3 Technique (Questions 3b &amp; 3c)'}
          </strong>
          <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 7px; background: #dcfce7; border-radius: 3px; color: #15803d; border: 1px solid #bbf7d0;">
            ${isKs3TaskUnit ? 'KS3 Disciplinary Guide' : 'Level 2 / Full Marks Strategy'}
          </span>
        </div>
        <div style="font-size: 0.82rem; color: #14532d; line-height: 1.5;">
          ${
            isKs3TaskUnit
              ? `
            <div><strong>&bull; Paragraph 1 (What is the main difference?):</strong> State how the two historians' overall views differ, then support with one short quote from Interpretation 1 and one contrasting quote from Interpretation 2.</div>
            <div style="margin-top: 4px;"><strong>&bull; Paragraph 2 (Why do they differ?):</strong> Explain that historians reach different conclusions because they focus on different evidence or aspects of the past (linking Interpretation 1 and Interpretation 2 to the matched primary sources where provided).</div>
          `
              : `
            <div><strong>&bull; Question 3(b) [4 marks]:</strong> State the main difference in view/argument, then quote directly from Interpretation 1 and contrast with a direct quote from Interpretation 2.</div>
            <div style="margin-top: 4px;"><strong>&bull; Question 3(c) [4 marks]:</strong> Explain that the interpretations differ because the historians have used different sources of evidence. Link Interpretation 1 to evidence in Source B, and link Interpretation 2 to evidence in Source C.</div>
            <div style="margin-top: 4px; color: #dc2626; font-weight: 600;"><strong>&bull; Examiner Warning:</strong> Do NOT evaluate the provenance, bias, purpose, or dates of the interpretations. Edexcel awards 0 marks / caps provenance evaluation of interpretations!</div>
          `
          }
        </div>
      </div>

      ${(sourceB || sourceC)
      ? `
      <!-- Archival Primary Sources -->
      <div style="margin-bottom: 16px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 12px 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
          <strong style="color: #0f766e; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-box-archive"></i> ${isKs3TaskUnit ? 'Archival Primary Sources &bull; Evidence Behind Each Historian&rsquo;s View' : 'Archival Primary Sources &bull; Study Source B &amp; Source C (For Question 3c Evidence Matching)'}
          </strong>
          <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; background: #ccfbf1; border-radius: 4px; color: #0f766e; border: 1px solid #99f6e4;">
            ${isKs3TaskUnit ? 'Matched Primary Evidence' : 'Official Paper 3 Matched Sources'}
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 14px;">
          ${renderSourceCard(sourceB, 'Source B', '#99f6e4', '#f0fdfa', '#0f766e')}
          ${renderSourceCard(sourceC, 'Source C', '#fed7aa', '#fff7ed', '#c2410c')}
        </div>
      </div>
      `
      : ''
    }

      <!-- Side-by-Side Historical Interpretations -->
      <div style="margin-bottom: 14px;">
        <div style="font-weight: 700; font-size: 0.85rem; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-graduation-cap"></i> Secondary Historical Interpretations &bull; Study Interpretation 1 &amp; Interpretation 2
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
          ${renderInterpCard(interp1, 1, '#c4b5fd', '#faf5ff', '#6d28d9')}
          ${renderInterpCard(interp2, 2, '#cbd5e1', '#ffffff', '#334155')}
        </div>
      </div>

      ${(() => {
        const rawWords =
          (Array.isArray(task?.scaffolding?.word_bank) && task.scaffolding.word_bank.length > 0
            ? task.scaffolding.word_bank
            : null) ||
          (Array.isArray(task?.word_bank) && task.word_bank.length > 0 ? task.word_bank : null) ||
          (Array.isArray(lessonObj?.vocab)
            ? lessonObj.vocab.map((v) => (typeof v === 'object' ? v.term : v)).filter(Boolean)
            : []);
        const wbBtnHtml =
          rawWords.length > 0
            ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="hi-wb-${hiUid}" style="background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-tags" style="color: #0d9488;"></i> Word Bank <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>`
            : '';
        const scafBtnHtml = `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm" data-action="toggle-element" data-target-id="hi-scaf-${hiUid}" style="background: #f1f5f9; color: #1e3a8a; border: 1px solid #cbd5e1; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-wand-magic-sparkles" style="color: #2563eb;"></i> Starters &amp; Plan <i class="fa-solid fa-chevron-down wb-dd-chevron" style="font-size: 0.68rem; opacity: 0.75;"></i></button>`;
        const wbDrawerHtml =
          rawWords.length > 0
            ? `<div id="hi-wb-${hiUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #99f6e4; border-radius: 8px; padding: 11px 14px; margin-top: 8px;">
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; margin-bottom: 6px;">
                  <span style="font-size: 0.78rem; font-weight: 800; color: #0f766e; text-transform: uppercase;">Core Vocabulary Bank:</span>
                  <span style="font-size: 0.72rem; font-weight: 600; color: #64748b;">Tap word to cross off &bull; <i class="fa-solid fa-volume-high" style="color: #0d9488;"></i> to hear</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                  ${rawWords.map((w) => renderSpeakableVocabChipHTML(w, lessonObj)).join('')}
                </div>
              </div>`
            : '';
        const scafDrawerHtml = `
          <div id="hi-scaf-${hiUid}" class="scaffold-box" style="display: none; background: #f8fafc; border: 1.5px solid #93c5fd; border-radius: 8px; padding: 12px 14px; margin-top: 8px;">
            <div style="font-weight: 700; font-size: 0.82rem; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-table-columns"></i> 3-Step Historiographical Matrix: Thesis &bull; Counter-Thesis &bull; Independent Synthesis
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 12px;">
              ${matrix
                .map(
                  (m, mIdx) => `
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: 3px solid ${mIdx === 0 ? '#8b5cf6' : mIdx === 1 ? '#ec4899' : '#059669'}; border-radius: 6px; padding: 10px;">
                  <strong style="display: block; font-size: 0.82rem; color: #1e293b; margin-bottom: 4px; text-transform: uppercase;">
                    ${m.col || m.title || `Step ${mIdx + 1}`}
                  </strong>
                  <div style="font-size: 0.82rem; color: #475569; line-height: 1.4;">
                    ${m.text || m.prompt || ''}
                  </div>
                </div>
              `,
                )
                .join('')}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #6d28d9; text-transform: uppercase;">Sentence Starters &amp; Connectives:</span>
              ${connectives
                .map(
                  (c) => `
                <span class="wb-interactive-chip" data-action="toggle-wb-chip" role="button" tabindex="0" title="Tap to cross off once used" style="background: #ffffff; border: 1px solid #ddd6fe; color: #6d28d9; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">${c}</span>
              `,
                )
                .join('')}
            </div>
          </div>`;
        const modelBtnHtml = modelAnswer
          ? `<button type="button" class="btn btn-pedagogy btn-pedagogy-sm btn-pedagogy-model" data-action="toggle-element" data-target-id="hi-model-${hiUid}" title="Reveal Model Answer" style="background: #f0fdf4; color: #166534; border: 1.5px solid #86efac; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;"><i class="fa-solid fa-eye" style="color: #16a34a;"></i> Reveal Answer</button>`
          : '';
        const timerProjBtnsHtml = `
          <button type="button" onclick="window.toggleExamCardTimer('${hiUid}', ${hiTargetMins})" style="background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; padding: 5px 10px; border-radius: 7px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-regular fa-clock" style="color: #2563eb;"></i> Timer (${hiTargetMins}m)
          </button>
          <button type="button" onclick="window.openExamCardProjector('${hiUid}')" style="background: #f8fafc; color: #0f172a; border: 1.5px solid #cbd5e1; padding: 5px 10px; border-radius: 7px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-expand" style="color: #475569;"></i> Projector
          </button>
        `;
        const modelDrawerHtml = modelAnswer
          ? `<div id="hi-model-${hiUid}" class="scaffold-box model-box" style="display: none; margin-top: 8px; padding: 12px 15px; background: #ffffff; border-left: 3px solid #7c3aed; border-radius: 6px; font-size: 0.92rem; color: #1e293b; line-height: 1.6; border: 1px solid #ddd6fe;">${modelAnswer}</div>`
          : '';
        return `
          <div class="no-print">
            <div class="wb-unified-control-bar" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 7px;">${wbBtnHtml}${scafBtnHtml}</div>
              <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 7px; margin-left: auto;">${modelBtnHtml}${timerProjBtnsHtml}</div>
            </div>
            ${wbDrawerHtml}
            ${scafDrawerHtml}
            ${renderInlineTaskTimerBarHTML(hiUid, hiTargetMins)}
            ${modelDrawerHtml}
          </div>`;
      })()}
    </div>
  `;
}

export function renderBecauseButSoTaskHTML(task, lessonIndex, tIdx, unitId) {
  const taskId = task.id || `task-bbs-${lessonIndex}-${tIdx}`;
  const title = task.title || 'The "Because, But, So" Strategy • Sentence Expansion';
  const subtitle =
    task.subtitle ||
    'Hochman Analytical Framework • Rehearsing Causal, Complex & Consequential Syntax';
  const instruction =
    task.instruction ||
    'Complete each sentence using precise historical evidence to demonstrate causal reasoning, historical complexity, and long-term significance before tackling the exam questions.';
  const stem = task.stem || task.question || 'Historical Stem';

  const becauseObj = task.because || {};
  const becauseGuidance =
    becauseObj.guidance ||
    'Causal Explanation: Explain the precise historical cause, military necessity, or trigger mechanism.';
  const becausePlaceholder =
    becauseObj.placeholder ||
    '...BECAUSE... (Explain why this happened using precise historical evidence)';
  const becauseModel = becauseObj.model || becauseObj.model_answer || '';

  const butObj = task.but || {};
  const butGuidance =
    butObj.guidance ||
    'Nuance & Critical Limitation: Explain the severe battlefield flaws, combat failures, or untackled obstacles.';
  const butPlaceholder =
    butObj.placeholder || '...BUT... (Explain the limitations, complications, or contradictions)';
  const butModel = butObj.model || butObj.model_answer || '';

  const soObj = task.so || {};
  const soGuidance =
    soObj.guidance ||
    'Consequence & Lasting Significance: Explain the ripple effect on military medicine, surgical protocol, or survival rates.';
  const soPlaceholder =
    soObj.placeholder || '...SO... (Explain the lasting historical consequence or transformation)';
  const soModel = soObj.model || soObj.model_answer || '';

  return `
    <div class="task-box because-but-so-interactive" style="margin-bottom: 25px; background: #ffffff; padding: 22px; border-radius: 12px; border: 2px solid #4f46e5; box-shadow: 0 4px 16px rgba(79, 70, 229, 0.08);">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1.5px solid #e0e7ff; padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background: #4f46e5; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);">
            <i class="fa-solid fa-pen-ruler"></i>
          </div>
          <div>
            <h4 style="margin: 0; color: #312e81; font-size: 1.15rem; font-weight: 800; font-family: 'Playfair Display', Georgia, serif;">${title}</h4>
            <div style="font-size: 0.8rem; color: #4338ca; font-weight: 600; margin-top: 1px;">${subtitle}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn-reveal-all-bbs no-print" onclick="window.toggleBbsMask && window.toggleBbsMask(this)" style="background: #eef2ff; border: 1.5px solid #c7d2fe; color: #4338ca; font-size: 0.78rem; font-weight: 700; padding: 5px 12px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
            <i class="fa-solid fa-chalkboard-user"></i> <span>Teacher Whiteboard Key</span>
          </button>
          <span style="background: #4f46e5; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 5px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 5px;">
            <i class="fa-solid fa-feather-pointed" style="color: #a5b4fc;"></i> The Writing Revolution
          </span>
        </div>
      </div>

      ${instruction ? `<p style="font-size: 0.95rem; color: #475569; font-style: italic; margin-top: 0; margin-bottom: 16px; line-height: 1.5;">${instruction}</p>` : ''}

      <!-- Historical Anchor Stem Callout -->
      <div style="background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%); border: 1.5px solid #c7d2fe; border-left: 5px solid #4f46e5; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #4338ca; letter-spacing: 0.5px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-anchor"></i> <span>Core Historical Stem:</span>
        </div>
        <div style="font-size: 1.05rem; font-weight: 700; color: #1e1b4b; line-height: 1.5; font-family: 'Playfair Display', Georgia, serif;">&ldquo;${stem}&rdquo;</div>
      </div>

      <!-- 3 Conjunction Expansion Cards -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Card 1: BECAUSE -->
        <div class="bbs-card" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 14px; transition: all 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: #16a34a; color: #ffffff; font-weight: 900; font-size: 0.78rem; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px;">BECAUSE</span>
              <strong style="color: #166534; font-size: 0.92rem;">${becauseGuidance}</strong>
            </div>
            ${becauseModel
      ? `
              <button type="button" class="btn-single-bbs-model no-print" onclick="window.toggleSingleBbsModel && window.toggleSingleBbsModel(this)" style="background: #ffffff; border: 1px solid #86efac; color: #166534; font-size: 0.76rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-eye"></i> <span>Model Stem</span>
              </button>
            `
      : ''
    }
          </div>
          <div style="font-size: 0.88rem; color: #166534; font-style: italic; padding: 8px 10px; background: #ffffff; border: 1px dashed #86efac; border-radius: 6px;">${becausePlaceholder}</div>
          ${becauseModel
      ? `
            <div class="bbs-model-box" style="display: none; margin-top: 10px; padding: 12px 14px; background: #ffffff; border-left: 3.5px solid #16a34a; border-radius: 4px; font-size: 0.92rem; color: #14532d; line-height: 1.5; border: 1px solid #bbf7d0;">
              <strong>Exemplar Completion:</strong> ${becauseModel}
            </div>
          `
      : ''
    }
        </div>

        <!-- Card 2: BUT -->
        <div class="bbs-card" style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 14px; transition: all 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: #d97706; color: #ffffff; font-weight: 900; font-size: 0.78rem; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px;">BUT</span>
              <strong style="color: #92400e; font-size: 0.92rem;">${butGuidance}</strong>
            </div>
            ${butModel
      ? `
              <button type="button" class="btn-single-bbs-model no-print" onclick="window.toggleSingleBbsModel && window.toggleSingleBbsModel(this)" style="background: #ffffff; border: 1px solid #fde68a; color: #92400e; font-size: 0.76rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-eye"></i> <span>Model Stem</span>
              </button>
            `
      : ''
    }
          </div>
          <div style="font-size: 0.88rem; color: #92400e; font-style: italic; padding: 8px 10px; background: #ffffff; border: 1px dashed #fde68a; border-radius: 6px;">${butPlaceholder}</div>
          ${butModel
      ? `
            <div class="bbs-model-box" style="display: none; margin-top: 10px; padding: 12px 14px; background: #ffffff; border-left: 3.5px solid #d97706; border-radius: 4px; font-size: 0.92rem; color: #78350f; line-height: 1.5; border: 1px solid #fef3c7;">
              <strong>Exemplar Completion:</strong> ${butModel}
            </div>
          `
      : ''
    }
        </div>

        <!-- Card 3: SO -->
        <div class="bbs-card" style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 14px; transition: all 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: #2563eb; color: #ffffff; font-weight: 900; font-size: 0.78rem; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px;">SO</span>
              <strong style="color: #1e40af; font-size: 0.92rem;">${soGuidance}</strong>
            </div>
            ${soModel
      ? `
              <button type="button" class="btn-single-bbs-model no-print" onclick="window.toggleSingleBbsModel && window.toggleSingleBbsModel(this)" style="background: #ffffff; border: 1px solid #bfdbfe; color: #1e40af; font-size: 0.76rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
                <i class="fa-solid fa-eye"></i> <span>Model Stem</span>
              </button>
            `
      : ''
    }
          </div>
          <div style="font-size: 0.88rem; color: #1e40af; font-style: italic; padding: 8px 10px; background: #ffffff; border: 1px dashed #bfdbfe; border-radius: 6px;">${soPlaceholder}</div>
          ${soModel
      ? `
            <div class="bbs-model-box" style="display: none; margin-top: 10px; padding: 12px 14px; background: #ffffff; border-left: 3.5px solid #2563eb; border-radius: 4px; font-size: 0.92rem; color: #1e3a8a; line-height: 1.5; border: 1px solid #dbeafe;">
              <strong>Exemplar Completion:</strong> ${soModel}
            </div>
          `
      : ''
    }
        </div>
      </div>
    </div>
  `;
}

export function renderTextbookSpotlightDrawers(lesson) {
  if (!lesson || (!lesson.key_figure && !lesson.concept_spotlight && !lesson.archival_dispatch)) {
    return '';
  }

  const getMonogramInitials = (name) => {
    if (!name) return 'KF';
    const clean = name
      .replace(/^(Prince|Field Marshal|Kaiser|Archduke|Count|Lord|Sir|General|Colonel)\s+/i, '')
      .trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return clean.slice(0, 2).toUpperCase();
  };

  let html = `
    <div class="textbook-spotlight-deck" style="margin: 32px 0 24px 0; display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 4px;">
        <span style="font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #334155; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-book-bookmark" style="color: #2563eb;"></i> Textbook Spotlight &amp; Archival Dossiers
        </span>
        <span style="font-size: 0.76rem; color: #64748b; font-weight: 600;">
          Publisher Print Spread Alignment
        </span>
      </div>
  `;

  if (lesson.key_figure) {
    const kf = lesson.key_figure;
    const initials = getMonogramInitials(kf.name);
    html += `
      <details class="spotlight-drawer spotlight-drawer-figure archival-drawer" style="margin: 6px 0; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
        <summary style="padding: 4px 10px; min-height: 26px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; flex: 1; margin-right: 8px;">
            <span class="archival-meta-tag" style="background: #1d4ed8; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2; white-space: nowrap; flex-shrink: 0;">
              <i class="fa-solid fa-user" style="margin-right: 3px;"></i>KEY FIGURE
            </span>
            <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.84rem; color: #1e293b; font-weight: 700; line-height: 1.35; white-space: normal; overflow-wrap: break-word;">
              ${kf.name} ${kf.lifespan ? `(${kf.lifespan})` : ''}${kf.epithet ? ` &bull; ${kf.epithet}` : ''}
            </span>
          </div>
          <span class="drawer-toggle-indicator" style="font-size: 0.68rem; color: #64748b; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; flex-shrink: 0; white-space: nowrap;">
            Figure Spotlight &bull; Expand <span class="drawer-caret">&#9660;</span>
          </span>
        </summary>
        <div style="padding: 16px 20px 20px 20px; border-top: 1px solid #f1f5f9; background: #f8fafc;">
          <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 12px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #1e3a8a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.05rem; flex-shrink: 0; box-shadow: 0 2px 6px rgba(30,58,138,0.25);">
              ${initials}
            </div>
            <div style="flex: 1;">
              ${kf.epithet ? `<div style="font-size: 0.88rem; font-weight: 700; color: #2563eb; margin-bottom: 4px;">${kf.epithet}</div>` : ''}
              <div style="font-size: 0.92rem; color: #334155; line-height: 1.5;">${kf.significance}</div>
            </div>
          </div>
          ${kf.quote
        ? `
            <blockquote style="margin: 0 0 12px 0; padding: 10px 14px; background: #ffffff; border-left: 3px solid #94a3b8; font-style: italic; color: #334155; font-size: 0.92rem; border-radius: 0 4px 4px 0; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
              "${kf.quote.replace(/^["'“”]+|["'“”]+$/g, '')}"
            </blockquote>
          `
        : ''
      }
          ${kf.core_achievement
        ? `
            <div style="font-size: 0.9rem; line-height: 1.55; color: #1e293b; margin-bottom: 6px;">
              <strong style="color: #0f172a;">Core Historical Achievement:</strong> ${kf.core_achievement}
            </div>
          `
        : ''
      }
          ${kf.actions && Array.isArray(kf.actions) && kf.actions.length > 0
        ? `
            <div style="margin-top: 10px;">
              <strong style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; display: block; margin-bottom: 4px;">Decisive Actions:</strong>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.88rem; color: #334155; line-height: 1.5;">
                ${kf.actions.map((a) => `<li style="margin-bottom: 3px;">${a}</li>`).join('')}
              </ul>
            </div>
          `
        : ''
      }
        </div>
      </details>
    `;
  }

  if (lesson.concept_spotlight) {
    const cs = lesson.concept_spotlight;
    html += `
      <details class="spotlight-drawer spotlight-drawer-concept archival-drawer" style="margin: 6px 0; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
        <summary style="padding: 4px 10px; min-height: 26px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; flex: 1; margin-right: 8px;">
            <span class="archival-meta-tag" style="background: #b45309; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2; white-space: nowrap; flex-shrink: 0;">
              <i class="fa-solid fa-lightbulb" style="margin-right: 3px;"></i>CONCEPT SPOTLIGHT
            </span>
            <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.84rem; color: #1e293b; font-weight: 700; line-height: 1.35; white-space: normal; overflow-wrap: break-word;">
              ${cs.title}${cs.category ? ` &bull; ${cs.category}` : ''}
            </span>
          </div>
          <span class="drawer-toggle-indicator" style="font-size: 0.68rem; color: #64748b; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; flex-shrink: 0; white-space: nowrap;">
            Core Concept &bull; Expand <span class="drawer-caret">&#9660;</span>
          </span>
        </summary>
        <div style="padding: 16px 20px 20px 20px; border-top: 1px solid #f1f5f9; background: #fdfcf9;">
          ${cs.category ? `<div style="font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #92400e; margin-bottom: 8px;">${cs.category}</div>` : ''}
          <div style="margin-bottom: 12px; font-size: 0.92rem; line-height: 1.55; color: #1e293b;">
            <strong style="color: #0f172a;">Core Definition:</strong> ${cs.definition || cs.body || ''}
          </div>
          ${cs.historical_case_study
        ? `
            <div style="margin-bottom: 12px; padding: 12px 14px; background: #ffffff; border: 1px solid #fed7aa; border-radius: 6px; font-size: 0.9rem; line-height: 1.55; color: #451a03;">
              <strong style="color: #92400e; display: block; margin-bottom: 4px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px;">Historical Case Study</strong>
              ${cs.historical_case_study}
            </div>
          `
        : ''
      }
          ${cs.analytical_takeaway || cs.takeaway
        ? `
            <div style="font-size: 0.9rem; line-height: 1.55; color: #1e293b;">
              <strong style="color: #0f172a;">Analytical Takeaway:</strong> ${cs.analytical_takeaway || cs.takeaway}
            </div>
          `
        : ''
      }
        </div>
      </details>
    `;
  }

  if (lesson.archival_dispatch) {
    const ad = lesson.archival_dispatch;
    html += `
      <details class="spotlight-drawer spotlight-drawer-dispatch archival-drawer" style="margin: 6px 0; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
        <summary style="padding: 4px 10px; min-height: 26px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; flex: 1; margin-right: 8px;">
            <span class="archival-meta-tag" style="background: #475569; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2; white-space: nowrap; flex-shrink: 0;">
              <i class="fa-solid fa-scroll" style="margin-right: 3px;"></i>ARCHIVAL DISPATCH
            </span>
            <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.84rem; color: #1e293b; font-weight: 700; line-height: 1.35; white-space: normal; overflow-wrap: break-word;">
              ${ad.title}${ad.origin_and_date ? ` &bull; ${ad.origin_and_date}` : ''}
            </span>
          </div>
          <span class="drawer-toggle-indicator" style="font-size: 0.68rem; color: #64748b; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; flex-shrink: 0; white-space: nowrap;">
            Primary Dispatch &bull; Expand <span class="drawer-caret">&#9660;</span>
          </span>
        </summary>
        <div style="padding: 16px 20px 20px 20px; border-top: 1px solid #f1f5f9; background: #fafaf9;">
          ${ad.origin_and_date ? `<div style="font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${ad.origin_and_date}</div>` : ''}
          <div class="archival-source-box" style="margin: 8px 0 12px 0; background: #fffdfa; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px;">
            <div class="archival-source-body" style="font-family: 'Newsreader', Georgia, serif; font-size: 0.98rem; line-height: 1.65; color: #1e293b; font-style: italic;">
              "${(ad.excerpt || ad.body || '').replace(/^["'“”]+|["'“”]+$/g, '')}"
            </div>
          </div>
          ${ad.provenance_significance
        ? `
            <div style="margin-bottom: 8px; font-size: 0.88rem; line-height: 1.5; color: #334155;">
              <strong style="color: #0f172a;">Provenance &amp; Context:</strong> ${ad.provenance_significance}
            </div>
          `
        : ''
      }
          ${ad.enquiry_connection
        ? `
            <div style="font-size: 0.88rem; line-height: 1.5; color: #334155;">
              <strong style="color: #0f172a;">Enquiry Connection:</strong> ${ad.enquiry_connection}
            </div>
          `
        : ''
      }
        </div>
      </details>
    `;
  }

  html += `</div>`;
  return html;
}


/**
 * Automatically inject read-aloud audio buttons into all archival primary source boxes
 * containing readable excerpt text (.archival-source-body).
 */
export function injectArchivalAudioButtons(container = document) {
  if (!container || !container.querySelectorAll) return;
  const sourceBoxes = container.querySelectorAll('.archival-source-box');
  sourceBoxes.forEach((box) => {
    if (box.classList.contains('p3-pane-cell')) return;
    const body = box.querySelector('.archival-source-body');
    if (!body || !body.textContent.trim()) return;

    // Skip if button or playback bar is already present
    if (box.querySelector('[data-action="read-aloud"], .read-aloud-btn, .read-aloud-playback-bar'))
      return;

    const barWrap = document.createElement('div');
    barWrap.innerHTML = renderAudioPlaybackBar(
      'Read Aloud Primary Source Excerpt',
      'source-audio-bar',
    );
    const bar = barWrap.firstElementChild;

    const header = box.querySelector('.archival-source-header');
    const summaryEl = box.tagName === 'DETAILS' ? box.querySelector(':scope > summary') : null;
    if (summaryEl) {
      let rightGroup = summaryEl.querySelector(':scope > div:last-child');
      if (rightGroup && rightGroup !== summaryEl.querySelector(':scope > div:first-child')) {
        rightGroup.insertBefore(bar, rightGroup.firstChild);
      } else {
        summaryEl.insertBefore(bar, summaryEl.querySelector('.drawer-toggle-indicator') || null);
      }
    } else if (header) {
      // If header has a right-aligned container or stamp, append next to it, or append to header
      let rightContainer = header.querySelector('.archival-shelfmark-stamp')?.parentElement;
      if (
        rightContainer &&
        rightContainer !== header &&
        rightContainer.style.display?.includes('flex')
      ) {
        rightContainer.appendChild(bar);
      } else {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: inline-flex; align-items: center; margin-left: auto;';
        wrap.appendChild(bar);
        header.appendChild(wrap);
      }
    } else {
      const topBar = document.createElement('div');
      topBar.className = 'archival-audio-bar no-print';
      topBar.style.cssText = 'display: flex; justify-content: flex-end; margin-bottom: 6px;';
      topBar.appendChild(bar);
      box.insertBefore(topBar, box.firstChild);
    }
  });

  // Global click-away handler to dismiss specification anchor popovers
  if (!window._specAnchorListenerBound) {
    window._specAnchorListenerBound = true;
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.spec-anchor-popover')) {
        document.querySelectorAll('.spec-anchor-popover[open]').forEach((el) => {
          el.removeAttribute('open');
        });
      }
    });
  }
}

export function openHotspotWhiteboardModal(mapBlock, bridge = {}) {
  if (typeof document === 'undefined' || !mapBlock) return;
  if (!document.getElementById('crummack-interactive-styles')) {
    initCrummackInteractiveFeatures();
  }

  const escWbAttr = (v) =>
    String(v || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const rawSpots = Array.isArray(mapBlock.hotspots) ? mapBlock.hotspots : [];
  const hotspots = rawSpots.map((s, idx) => ({
    ...s,
    id: String(s.id || `spot-${idx + 1}`),
    num: s.num || idx + 1,
    x: Number.isFinite(Number(s.x)) ? Number(s.x) : 50,
    y: Number.isFinite(Number(s.y)) ? Number(s.y) : 50,
    color: s.color || '#0284c7',
    label:
      s.label || (s.title ? String(s.title).split(':')[0].trim() : `Location ${idx + 1}`),
    badge: s.badge || 'Historical Flashpoint',
    date: s.date || '',
    title: s.title || s.label || `Location ${idx + 1}`,
    details: s.details || s.description || s.summary || '',
    hinge: s.hinge || s.hinge_question || s.question || '',
    align: s.align || '',
  }));

  const mapImgUrl =
    mapBlock.imageUrl || getAssetUrl(mapBlock.image || mapBlock.src || mapBlock.image_url || '');

  if (window._activeWhiteboardKeyHandler) {
    document.removeEventListener('keydown', window._activeWhiteboardKeyHandler);
    window._activeWhiteboardKeyHandler = null;
  }

  let modal = document.getElementById('hotspot-whiteboard-lightbox');
  const wasAlreadyOpen = Boolean(modal && modal.style.display !== 'none');
  if (!wasAlreadyOpen) {
    window._wbSavedBodyOverflow = document.body.style.overflow || '';
  }
  document.body.style.overflow = 'hidden';

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'hotspot-whiteboard-lightbox';
    modal.className = 'no-print';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    document.body.appendChild(modal);
  }

  modal.setAttribute('aria-label', mapBlock.title || 'Interactive Whiteboard Map');
  modal.setAttribute('aria-hidden', 'false');
  modal.style.cssText =
    'position: fixed; inset: 0; z-index: 100000; background: rgba(15, 23, 42, 0.96); display: flex; flex-direction: column; padding: 16px 22px; box-sizing: border-box; color: #f8fafc; font-family: "Inter", sans-serif;';

  const sharedExplored =
    bridge && typeof bridge.getExploredIds === 'function' && bridge.getExploredIds()
      ? bridge.getExploredIds()
      : new Set();

  let activeIdx = 0;
  const initialId =
    bridge && typeof bridge.getActiveSpotId === 'function' ? bridge.getActiveSpotId() : null;
  if (initialId) {
    const foundIdx = hotspots.findIndex((h) => h.id === initialId);
    if (foundIdx >= 0) activeIdx = foundIdx;
  }
  if (hotspots[activeIdx]) {
    sharedExplored.add(hotspots[activeIdx].id);
  }

  modal.innerHTML = `
    <div class="wb-lightbox-header" style="display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; padding-bottom: 12px; border-bottom: 1px solid rgba(148, 163, 184, 0.22); flex-shrink: 0;">
      <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1 1 280px; flex-wrap: wrap;">
        <span style="background: rgba(14, 165, 233, 0.22); border: 1px solid #38bdf8; color: #7dd3fc; padding: 3px 10px; border-radius: 5px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap;">
          <i class="fa-solid fa-chalkboard-user" style="margin-right: 5px;"></i> Whiteboard Map
        </span>
        <div style="min-width: 0;">
          <h2 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.32rem; color: #ffffff; line-height: 1.25;">${mapBlock.title || 'Historical Map'}</h2>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex-shrink: 0;">
        <div id="wb-explored-counter" style="background: rgba(30, 41, 59, 0.9); border: 1px solid #475569; color: #e2e8f0; padding: 5px 12px; border-radius: 20px; font-size: 0.78rem; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-location-dot" style="color: #38bdf8;"></i>
          <span id="wb-explored-text">${sharedExplored.size} / ${hotspots.length} Locations Explored</span>
        </div>

        <div class="wb-zoom-group" role="group" aria-label="Map Zoom Controls" style="display: inline-flex; align-items: center; background: #1e293b; border: 1px solid #475569; border-radius: 7px; padding: 2px; gap: 2px;">
          <button type="button" class="wb-zoom-btn is-active" data-zoom="1" style="background: #0284c7; color: #ffffff; border: none; border-radius: 5px; padding: 4px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">1&times;</button>
          <button type="button" class="wb-zoom-btn" data-zoom="1.5" style="background: transparent; color: #cbd5e1; border: none; border-radius: 5px; padding: 4px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">1.5&times;</button>
          <button type="button" class="wb-zoom-btn" data-zoom="2" style="background: transparent; color: #cbd5e1; border: none; border-radius: 5px; padding: 4px 10px; font-size: 0.76rem; font-weight: 800; cursor: pointer;">2&times;</button>
        </div>

        <button type="button" id="wb-close-btn" title="Close Whiteboard Map (Esc)" style="background: rgba(239, 68, 68, 0.16); border: 1px solid rgba(248, 113, 113, 0.5); color: #fecaca; border-radius: 7px; padding: 5px 12px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
          <span style="font-size: 0.70rem; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.9;">Esc</span>
          <span style="font-size: 1.15rem; line-height: 1;">&times;</span>
        </button>
      </div>
    </div>

    <div class="wb-lightbox-body" style="flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr); gap: 20px; margin-top: 14px;">
      <div class="whiteboard-map-canvas" id="wb-map-canvas" style="position: relative; overflow: auto; background: #0b1120; border: 1px solid #334155; border-radius: 10px; display: flex; padding: 14px; min-height: 0;">
        <div class="whiteboard-map-stage" id="wb-map-stage" style="position: relative; display: inline-block; margin: auto; line-height: 0; flex-shrink: 0;">
          <img id="wb-map-img" src="${mapImgUrl}" alt="${escWbAttr(mapBlock.title || 'Historical Map')}" class="archival-image" style="max-height: calc(100vh - 170px); max-width: 100%; width: auto; height: auto; object-fit: contain; display: block; border-radius: 6px; box-shadow: 0 8px 30px rgba(0,0,0,0.65); user-select: none; -webkit-user-drag: none;" />
          ${hotspots
            .map((spot, sIdx) => {
              const isActive = sIdx === activeIdx;
              const isLeftAligned = spot.x > 66 || spot.align === 'left';
              return `
            <button type="button" class="map-hotspot-pin numbered-hotspot-pin wb-hotspot-pin ${isActive ? 'active-pin' : ''} ${isLeftAligned ? 'pin-align-left' : ''}" data-spot-index="${sIdx}" data-spot-id="${escWbAttr(spot.id)}" aria-label="Pin ${spot.num}: ${escWbAttr(spot.label)}" style="left: ${spot.x}%; top: ${spot.y}%;" title="${escWbAttr(spot.title)}">
              <span class="pin-pulse" style="background: ${spot.color};"></span>
              <span class="pin-marker" style="background: ${spot.color};">${spot.num}</span>
              <span class="pin-label">${spot.label}</span>
            </button>
            `;
            })
            .join('')}
        </div>
      </div>

      <div class="whiteboard-dispatch-panel" style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 20px 22px; display: flex; flex-direction: column; min-height: 0; overflow-y: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.35);">
        <div id="wb-dispatch-card-body"></div>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(148, 163, 184, 0.18);">
          <div style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; margin-bottom: 8px;">
            Locations on This Map
          </div>
          <div id="wb-quick-pills" style="display: flex; flex-wrap: wrap; gap: 7px;"></div>
        </div>

        <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(148, 163, 184, 0.2); display: flex; align-items: center; justify-content: space-between; gap: 10px;">
          <button type="button" id="wb-prev-pin-btn" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #f8fafc; border-radius: 7px; padding: 7px 14px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <span>&larr;</span> <span>Prev Pin</span>
          </button>
          <span id="wb-pin-step-indicator" style="font-size: 0.80rem; font-weight: 800; color: #94a3b8; text-align: center;">
            ${hotspots.length ? `Pin ${activeIdx + 1} of ${hotspots.length}` : ''}
          </span>
          <button type="button" id="wb-next-pin-btn" style="background: #0284c7; border: 1px solid #38bdf8; color: #ffffff; border-radius: 7px; padding: 7px 14px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <span>Next Pin</span> <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const wbImg = modal.querySelector('#wb-map-img');
  const wbCanvas = modal.querySelector('#wb-map-canvas');
  const wbStage = modal.querySelector('#wb-map-stage');
  const wbPins = modal.querySelectorAll('.wb-hotspot-pin');
  const dispatchBody = modal.querySelector('#wb-dispatch-card-body');
  const quickPillsWrap = modal.querySelector('#wb-quick-pills');
  const exploredTextEl = modal.querySelector('#wb-explored-text');
  const exploredCounterEl = modal.querySelector('#wb-explored-counter');
  const stepIndicatorEl = modal.querySelector('#wb-pin-step-indicator');
  const zoomBtns = modal.querySelectorAll('.wb-zoom-btn');
  const prevBtn = modal.querySelector('#wb-prev-pin-btn');
  const nextBtn = modal.querySelector('#wb-next-pin-btn');
  const closeBtn = modal.querySelector('#wb-close-btn');

  let currentZoom = 1;
  let baseImgWidth = 0;
  let baseImgHeight = 0;

  const captureBaseSize = () => {
    if (!wbImg || currentZoom !== 1) return;
    const rect = wbImg.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      baseImgWidth = rect.width;
      baseImgHeight = rect.height;
    }
  };

  if (wbImg) {
    if (wbImg.complete) {
      requestAnimationFrame(captureBaseSize);
    }
    wbImg.addEventListener('load', captureBaseSize);
  }

  const centerOnActivePin = () => {
    if (currentZoom <= 1 || !wbCanvas || !wbStage || !hotspots[activeIdx]) return;
    const spot = hotspots[activeIdx];
    const targetLeft = (spot.x / 100) * wbStage.offsetWidth - wbCanvas.clientWidth / 2;
    const targetTop = (spot.y / 100) * wbStage.offsetHeight - wbCanvas.clientHeight / 2;
    wbCanvas.scrollTo({
      left: Math.max(0, targetLeft),
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  };

  const applyZoom = (zoomVal) => {
    if (!wbImg) return;
    if (currentZoom === 1) {
      captureBaseSize();
    }
    currentZoom = zoomVal;

    zoomBtns.forEach((btn) => {
      const isAct = Number(btn.dataset.zoom) === zoomVal;
      btn.classList.toggle('is-active', isAct);
      btn.style.background = isAct ? '#0284c7' : 'transparent';
      btn.style.color = isAct ? '#ffffff' : '#cbd5e1';
    });

    if (zoomVal === 1 || !baseImgWidth || !baseImgHeight) {
      wbImg.style.width = 'auto';
      wbImg.style.height = 'auto';
      wbImg.style.maxHeight = 'calc(100vh - 170px)';
      wbImg.style.maxWidth = '100%';
      if (wbCanvas) {
        wbCanvas.style.cursor = 'default';
      }
    } else {
      wbImg.style.maxHeight = 'none';
      wbImg.style.maxWidth = 'none';
      wbImg.style.width = `${Math.round(baseImgWidth * zoomVal)}px`;
      wbImg.style.height = `${Math.round(baseImgHeight * zoomVal)}px`;
      if (wbCanvas) {
        wbCanvas.style.cursor = 'grab';
      }
      requestAnimationFrame(centerOnActivePin);
    }
  };

  const renderRightPanel = () => {
    const spot = hotspots[activeIdx];
    if (!spot) {
      if (dispatchBody) dispatchBody.innerHTML = '';
      return;
    }

    const cleanHinge = spot.hinge
      ? String(spot.hinge)
          .replace(/^(?:Hinge Question|Discussion Prompt|Discussion Question|Question):\s*/i, '')
          .trim()
      : '';

    const spotPhotoUrl = spot.photo ? getAssetUrl(spot.photo) : '';

    if (dispatchBody) {
      dispatchBody.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
          <span style="background: ${spot.color}; color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
            Pin ${spot.num} &middot; ${spot.badge}
          </span>
          ${spot.date ? `<span style="font-size: 0.84rem; font-weight: 800; color: #fbbf24; background: rgba(245, 158, 11, 0.14); border: 1px solid rgba(245, 158, 11, 0.35); padding: 2px 9px; border-radius: 4px;">${spot.date}</span>` : ''}
        </div>
        <h3 style="margin: 4px 0 10px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.32rem; color: #ffffff; line-height: 1.28;">
          ${spot.title}
        </h3>
        ${
          spotPhotoUrl
            ? `
          <div style="margin: 0 0 12px 0; border: 1px solid rgba(148, 163, 184, 0.32); border-radius: 8px; overflow: hidden; background: #0b1120;">
            <img src="${spotPhotoUrl}" alt="${escWbAttr(spot.title)}" style="width: 100%; height: 155px; object-fit: cover; object-position: ${spot.photo_pos || 'center 35%'}; display: block;" />
            ${spot.photo_caption ? `<div style="padding: 5px 10px; font-size: 0.74rem; color: #cbd5e1; background: rgba(15, 23, 42, 0.9); border-top: 1px solid rgba(148, 163, 184, 0.2);">${spot.photo_caption}</div>` : ''}
          </div>
        `
            : ''
        }
        <p style="margin: 0 0 14px 0; font-size: 1.02rem; line-height: 1.6; color: #e2e8f0;">
          ${spot.details}
        </p>
        ${
          cleanHinge
            ? `
          <div class="wb-hinge-prompt-box" style="background: rgba(245, 158, 11, 0.14); border: 1px solid rgba(245, 158, 11, 0.42); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 13px 16px;">
            <div style="font-size: 0.72rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.06em; color: #fbbf24; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-comments"></i> Hinge Question &middot; Discussion Prompt
            </div>
            <div style="font-size: 1.02rem; line-height: 1.55; color: #fef3c7; font-weight: 600;">
              ${cleanHinge}
            </div>
          </div>
        `
            : ''
        }
      `;
    }

    if (quickPillsWrap) {
      quickPillsWrap.innerHTML = hotspots
        .map((s, idx) => {
          const isAct = idx === activeIdx;
          const isVisited = sharedExplored.has(s.id);
          return `
            <button type="button" class="wb-quick-pill-btn" data-spot-index="${idx}" style="background: ${isAct ? s.color : isVisited ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}; color: #ffffff; border: 1.5px solid ${isAct ? '#ffffff' : isVisited ? 'rgba(56, 189, 248, 0.45)' : 'rgba(255,255,255,0.16)'}; border-radius: 20px; padding: 5px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.18s ease;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: ${s.color}; color: #fff; font-size: 0.68rem; font-weight: 900; border: 1px solid rgba(255,255,255,0.85); flex-shrink: 0;">${s.num}</span>
              <span>${s.label}</span>
            </button>
          `;
        })
        .join('');

      quickPillsWrap.querySelectorAll('.wb-quick-pill-btn').forEach((pillBtn) => {
        pillBtn.addEventListener('click', () => {
          setActiveIndex(Number(pillBtn.dataset.spotIndex));
        });
      });
    }

    if (exploredTextEl) {
      exploredTextEl.textContent = `${sharedExplored.size} / ${hotspots.length} Locations Explored`;
    }
    if (exploredCounterEl) {
      const allDone = hotspots.length > 0 && sharedExplored.size >= hotspots.length;
      exploredCounterEl.style.borderColor = allDone ? '#10b981' : '#475569';
    }
    if (stepIndicatorEl) {
      stepIndicatorEl.textContent = hotspots.length
        ? `Pin ${activeIdx + 1} of ${hotspots.length}`
        : '';
    }
  };

  const setActiveIndex = (nextIdx) => {
    if (!hotspots.length) return;
    activeIdx = (nextIdx + hotspots.length) % hotspots.length;
    const spot = hotspots[activeIdx];
    sharedExplored.add(spot.id);

    wbPins.forEach((p, pIdx) => {
      p.classList.toggle('active-pin', pIdx === activeIdx);
    });

    renderRightPanel();

    if (bridge && typeof bridge.onSelectSpot === 'function') {
      bridge.onSelectSpot(spot.id);
    }

    if (currentZoom > 1) {
      centerOnActivePin();
    }
  };

  const closeWhiteboardModal = () => {
    if (window._activeWhiteboardKeyHandler) {
      document.removeEventListener('keydown', window._activeWhiteboardKeyHandler);
      window._activeWhiteboardKeyHandler = null;
    }
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = window._wbSavedBodyOverflow || '';
  };

  wbPins.forEach((p) => {
    p.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveIndex(Number(p.dataset.spotIndex));
    });
  });

  zoomBtns.forEach((zBtn) => {
    zBtn.addEventListener('click', () => {
      applyZoom(Number(zBtn.dataset.zoom));
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => setActiveIndex(activeIdx - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => setActiveIndex(activeIdx + 1));
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeWhiteboardModal);
  }

  // Smooth drag-to-pan on zoomed canvas
  if (wbCanvas) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let scrollStartLeft = 0;
    let scrollStartTop = 0;

    wbCanvas.addEventListener('mousedown', (e) => {
      if (currentZoom <= 1 || e.target.closest('.map-hotspot-pin')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      scrollStartLeft = wbCanvas.scrollLeft;
      scrollStartTop = wbCanvas.scrollTop;
      wbCanvas.style.cursor = 'grabbing';
    });
    wbCanvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      wbCanvas.scrollLeft = scrollStartLeft - (e.clientX - startX);
      wbCanvas.scrollTop = scrollStartTop - (e.clientY - startY);
    });
    const endCanvasDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      if (currentZoom > 1 && wbCanvas) {
        wbCanvas.style.cursor = 'grab';
      }
    };
    wbCanvas.addEventListener('mouseup', endCanvasDrag);
    wbCanvas.addEventListener('mouseleave', endCanvasDrag);
  }

  window._activeWhiteboardKeyHandler = (e) => {
    if (!modal || modal.style.display === 'none') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeWhiteboardModal();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex(activeIdx - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex(activeIdx + 1);
    }
  };
  document.addEventListener('keydown', window._activeWhiteboardKeyHandler);

  renderRightPanel();
}

if (typeof window !== 'undefined') {
  window.openHotspotWhiteboardModal = openHotspotWhiteboardModal;
}

export function initCrummackInteractiveFeatures() {
  if (!document.getElementById('crummack-interactive-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'crummack-interactive-styles';
    styleEl.textContent = `
      @keyframes radar-pulse-crimson {
        0% { transform: scale(1); opacity: 0.9; }
        70% { transform: scale(3.5); opacity: 0; }
        100% { transform: scale(3.5); opacity: 0; }
      }
      @keyframes radar-pulse-blue {
        0% { transform: scale(1); opacity: 0.9; }
        70% { transform: scale(3.5); opacity: 0; }
        100% { transform: scale(3.5); opacity: 0; }
      }
      @keyframes radar-pulse-green {
        0% { transform: scale(1); opacity: 0.9; }
        70% { transform: scale(3.5); opacity: 0; }
        100% { transform: scale(3.5); opacity: 0; }
      }
      @keyframes hotspot-numbered-pulse {
        0% { transform: scale(1); opacity: 0.65; }
        75% { transform: scale(2.15); opacity: 0; }
        100% { transform: scale(2.15); opacity: 0; }
      }

      .map-hotspot-pin {
        position: absolute !important;
        cursor: pointer !important;
        z-index: 10 !important;
        pointer-events: auto !important;
        transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      }
      .map-hotspot-pin:hover,
      .map-hotspot-pin.active-pin {
        z-index: 30 !important;
      }
      .pin-pulse {
        position: absolute !important;
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        width: 16px !important;
        height: 16px !important;
        border-radius: 50% !important;
        pointer-events: none !important;
        opacity: 0.35 !important;
      }
      .pin-pulse-crimson {
        background: rgba(185, 28, 28, 0.45) !important;
        animation: radar-pulse-crimson 2.2s infinite ease-out !important;
      }
      .pin-pulse-blue {
        background: rgba(29, 78, 216, 0.45) !important;
        animation: radar-pulse-blue 2.2s infinite ease-out !important;
      }
      .pin-pulse-green {
        background: rgba(4, 120, 87, 0.45) !important;
        animation: radar-pulse-green 2.2s infinite ease-out !important;
      }
      .pin-marker {
        position: absolute !important;
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        width: 9px !important;
        height: 9px !important;
        border-radius: 50% !important;
        display: block !important;
        box-shadow: 0 1px 4px rgba(0,0,0,0.6) !important;
        z-index: 2 !important;
        border: 1.5px solid #ffffff !important;
        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      }
      .pin-marker-crimson { background: #b91c1c !important; }
      .pin-marker-blue { background: #1d4ed8 !important; }
      .pin-marker-green { background: #047857 !important; }
      .pin-core {
        display: none !important;
      }
      .pin-label {
        display: none !important;
        position: absolute !important;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-family: 'Inter', sans-serif !important;
        font-size: 0.70rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        background: rgba(15, 23, 42, 0.94) !important;
        padding: 2px 7px !important;
        border-radius: 4px !important;
        box-shadow: 0 3px 8px rgba(0,0,0,0.45) !important;
        border: 1px solid rgba(255,255,255,0.25) !important;
        white-space: nowrap !important;
        pointer-events: none !important;
        backdrop-filter: blur(4px) !important;
        letter-spacing: 0.02em !important;
        z-index: 30 !important;
      }
      .map-hotspot-pin.pin-align-left .pin-label {
        left: auto !important;
        right: 10px !important;
      }
      .map-hotspot-pin:hover .pin-label {
        display: block !important;
      }
      .map-hotspot-pin:hover .pin-marker,
      .map-hotspot-pin.active-pin .pin-marker {
        width: 13px !important;
        height: 13px !important;
        border-color: #f59e0b !important;
        box-shadow: 0 0 10px rgba(245, 158, 11, 0.9) !important;
      }
      .map-hotspot-pin.active-pin .pin-label {
        border-color: #f59e0b !important;
        box-shadow: 0 0 12px rgba(245, 158, 11, 0.6) !important;
      }

      /* Numbered Circular Hotspot Pins (Stage 1 Hook Maps & Whiteboard Mode) */
      .map-hotspot-pin.numbered-hotspot-pin {
        width: 24px !important;
        height: 24px !important;
        transform: translate(-50%, -50%) !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        outline: none !important;
        z-index: 15 !important;
      }
      .map-hotspot-pin.numbered-hotspot-pin:hover,
      .map-hotspot-pin.numbered-hotspot-pin.active-pin {
        z-index: 35 !important;
      }
      .map-hotspot-pin.numbered-hotspot-pin .pin-pulse {
        left: 0 !important;
        top: 0 !important;
        width: 24px !important;
        height: 24px !important;
        transform: scale(1) !important;
        transform-origin: center center !important;
        opacity: 0.5 !important;
        animation: hotspot-numbered-pulse 2.4s infinite ease-out !important;
      }
      .map-hotspot-pin.numbered-hotspot-pin .pin-marker {
        left: 0 !important;
        top: 0 !important;
        transform: none !important;
        width: 24px !important;
        height: 24px !important;
        border-radius: 50% !important;
        border: 2px solid #ffffff !important;
        color: #ffffff !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 0.74rem !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7) !important;
        box-sizing: border-box !important;
      }
      .map-hotspot-pin.numbered-hotspot-pin:hover .pin-marker,
      .map-hotspot-pin.numbered-hotspot-pin.active-pin .pin-marker {
        width: 24px !important;
        height: 24px !important;
        transform: scale(1.16) !important;
        border-color: #fbbf24 !important;
        box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.35), 0 3px 10px rgba(0, 0, 0, 0.8) !important;
      }
      .map-hotspot-pin.numbered-hotspot-pin .pin-label {
        left: 29px !important;
        right: auto !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
      }
      .map-hotspot-pin.numbered-hotspot-pin.pin-align-left .pin-label {
        left: auto !important;
        right: 29px !important;
      }
      .map-hotspot-pin.numbered-hotspot-pin:hover .pin-label,
      .map-hotspot-pin.numbered-hotspot-pin:focus-visible .pin-label,
      .map-hotspot-pin.numbered-hotspot-pin.active-pin .pin-label {
        display: block !important;
      }

      @media (max-width: 960px) {
        #hotspot-whiteboard-lightbox .wb-lightbox-body {
          grid-template-columns: 1fr !important;
          overflow-y: auto !important;
        }
        #hotspot-whiteboard-lightbox .whiteboard-map-canvas {
          min-height: 300px !important;
        }
      }

      .scribal-box {
        position: absolute !important;
        border: 1.5px dashed #d97706 !important;
        background: rgba(217, 119, 6, 0.14) !important;
        border-radius: 3px !important;
        cursor: pointer !important;
        transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        z-index: 5 !important;
      }
      .scribal-box:hover {
        border-color: #b91c1c !important;
        background: rgba(185, 28, 28, 0.22) !important;
        transform: scale(1.02) !important;
      }
      .scribal-token {
        cursor: pointer !important;
        border-bottom: 2px solid #d97706 !important;
        background: rgba(254, 243, 199, 0.6) !important;
        padding: 1px 4px !important;
        border-radius: 3px !important;
        font-weight: 600 !important;
        color: #92400e !important;
        transition: all 0.2s ease !important;
        display: inline-block !important;
      }
      .scribal-token:hover {
        background: #fee2e2 !important;
        border-bottom-color: #b91c1c !important;
        color: #991b1b !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  const mapData = {
    1: {
      name: 'Sains-lez-Marquion · 2nd Lt Crummack MC Action',
      badge: 'Pin 1 · Primary Attack Axis',
      badgeColor: '#b91c1c',
      badgeBg: '#fee2e2',
      date: '27–29 September 1918',
      formations: '2/4th Battalion, York & Lancaster Regiment · 62nd (West Riding) Division',
      coords: 'British Trench Map 51B.N.W. · Square E.14.c (Sains-lez-Marquion)',
      summary:
        'Advancing east of the dry canal bed towards Sains-lez-Marquion, the 2/4th York & Lancasters were pinned down by severe, interlocking Maxim machine-gun fire from reinforced cellar positions and sunken road embankments. 2nd Lieutenant Crummack personally led a bombing dash through heavy machine-gun sweeps, killed the enemy crew, captured the gun, and enabled the entire brigade to break into the Hindenburg support trenches.',
      quote:
        '"When his company was held up by heavy machine-gun fire, 2nd Lt Crummack led a small party forward with the greatest dash and determination, captured the enemy gun, killed the crew, and enabled the company to advance." — London Gazette Official Citation',
      cardId: 'tactical-card-1',
      pinId: 'pin-sains',
    },
    2: {
      name: 'Lock 3 / Dry Canal Crossing · The Funnel Chokepoint',
      badge: 'Pin 2 · Engineering Obstacle',
      badgeColor: '#1d4ed8',
      badgeBg: '#dbeafe',
      date: '27 September 1918 (Zero Hour: 05:20)',
      formations: '4th British Division & 1st Canadian Division (General Sir Arthur Currie)',
      coords: 'Canal du Nord Excavation · Lock 3 (South of Sains-lez-Marquion)',
      summary:
        'The Canal du Nord was an unfinished 100-foot-wide excavation. While northern and southern stretches were deeply flooded marshes, a narrow 400-yard dry sector between Lock 3 and Mœuvres presented the only viable crossing. Allied commanders boldly funneled four complete infantry divisions through this narrow gap under creeping barrage cover, spreading fanwise across the eastern bank once across.',
      quote:
        '"The crossing of the dry Canal du Nord was an audacious tactical gamble. Had the German artillery found our funnel at Lock 3, the carnage would have been unthinkable; yet the speed and coordination of our advance completely broke the enemy center." — 4th Division War Diary',
      cardId: 'tactical-card-2',
      pinId: 'pin-lock3',
    },
    3: {
      name: 'Bourlon Wood Crest · Commanding Observation Post',
      badge: 'Pin 3 · Strategic Objective',
      badgeColor: '#047857',
      badgeBg: '#d1fae5',
      date: '27 September – 1 October 1918',
      formations: '4th Canadian Division & 62nd (West Riding) Division',
      coords: 'High Ground 120m Spot Height · Dominating Cambrai Plains',
      summary:
        'Bourlon Wood occupies the highest topographical ridge between Bapaume and Cambrai, offering panoramic observation across the entire German defensive zone. German defenders had fortified the dense woodland with concrete machine-gun pillboxes and tangled wire. Allied combined arms—supported by heavy tank battalions and relentless rolling artillery—swept through the wood on 27 September, depriving the German army of its master observation post.',
      quote:
        '"From Bourlon Wood crest, the entire Cambrai basin lay exposed beneath our eyes. Once the wood was taken, the Hindenburg Line was irrevocably cracked." — General Sir Julian Byng, Third Army Commander',
      cardId: 'tactical-card-3',
      pinId: 'pin-bourlon',
    },
  };

  const scribalData = {
    1: {
      line: 'Line 6',
      title: 'Pastoral English Radiance vs Frontline Mud',
      original: "Orange and red and all the eye's delight",
      revised: "Yellow and red and all the eye's delight",
      paleoAnalysis:
        'In his pocket notebook in July 1916, Sassoon opened the elegy with a sensory memory of English summertime. Why reject "Orange" for "Yellow"? Yellow evokes the piercing, crystalline sunlight of early morning England ("glittering brass / Of rays low on brown roofs"). In contrast to the filthy, stagnant gray-brown Picardy mud where his friend Marcus Goodall lay bleeding to death along Mill Road, the flash of yellow creates an unbearable emotional dissonance between home and slaughter.',
      hingeQuestion:
        'How does Sassoon\'s substitution of "Yellow" for "Orange" intensify the psychological shock of hearing that Marcus Goodall had fallen in Thiepval Wood?',
    },
    2: {
      line: 'Line 10',
      title: 'Kinetic Dissipation: Somme Smoke & Failing Consciousness',
      original: 'Following & a whirling & subsiding, — where?',
      revised: 'Thinning & whirling & subsiding, — where?',
      paleoAnalysis:
        'The original line ("Following") was passive and inert. By altering it to "Thinning & whirling & subsiding", Sassoon creates a cinematic, triple-part kinetic description. The line operates on two simultaneous planes: literally describing the acrid smoke of German high-explosive shells dispersing across Mill Road, and metaphorically tracking the racing thoughts of Goodall\'s dying mind thinning into nothingness.',
      hingeQuestion:
        'Why is "Thinning" far more effective than "Following" in portraying a young soldier losing consciousness on the battlefield?',
    },
    3: {
      line: 'Line 11',
      title: 'Rejection of Pity: Dignity in Frontline Sorrow',
      original: 'Poor victim, could you see your body thrown',
      revised: 'Sad victim, could you see your body thrown',
      paleoAnalysis:
        'This is Sassoon\'s most profound ethical revision in the manuscript. "Poor victim" carried overtones of helpless, patronizing pity—the sentimental language of civilians back in England. Sassoon forcefully struck out "Poor" and substituted "Sad". "Sad victim" restores moral dignity to Marcus Goodall. It acknowledges his tragic sacrifice without reducing a brave subaltern into a pitiable weakling, reflecting the fierce frontline pride of combat subalterns.',
      hingeQuestion:
        'Why did frontline combatants like Sassoon detest being pitied as "poor" soldiers by civilians back home?',
    },
    4: {
      line: 'Line 21',
      title: 'The Mud as a Mortal Grave: "Dead Clay"',
      original: "You'll no more need to cling to the wet clay",
      revised: "You'll no more need to cling to the dead clay",
      paleoAnalysis:
        'In the final stanza, Sassoon imagines Goodall escaping earthly suffering into heaven. The first draft described "wet clay"—a familiar physical annoyance of trench life. But Sassoon altered it to "dead clay". This single word transforms the Picardy soil: it is no longer merely wet earth, but a necrotic, grasping substance infused with the rot of corpses that clings to the living and dead alike.',
      hingeQuestion:
        'How does altering "wet clay" to "dead clay" strip away any lingering romantic illusions about death on the Somme?',
    },
  };

  window.selectMapPin = function (pinId) {
    const data = mapData[pinId];
    if (!data) return;

    // Update pin elements
    document
      .querySelectorAll('.map-hotspot-pin')
      .forEach((el) => el.classList.remove('active-pin'));
    const targetPin = document.getElementById(data.pinId);
    if (targetPin) targetPin.classList.add('active-pin');

    // Update tactical intel banner
    const banner = document.getElementById('tactical-intel-banner');
    if (banner) {
      banner.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
          <div>
            <span style="font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; background: ${data.badgeBg}; color: ${data.badgeColor}; padding: 2px 8px; border-radius: 4px;">
              ${data.badge}
            </span>
            <h4 style="margin: 4px 0 0 0; color: #ffffff; font-size: 1.15rem; font-family: 'Playfair Display', serif;">
              ${data.name}
            </h4>
          </div>
          <div style="text-align: right; font-family: 'Inter', sans-serif; font-size: 0.75rem; color: #94a3b8;">
            <strong style="color: #f59e0b;">${data.date}</strong><br>
            <span>${data.coords}</span>
          </div>
        </div>
        <p style="margin: 0 0 10px 0; font-size: 0.92rem; color: #cbd5e1; line-height: 1.55;">
          ${data.summary}
        </p>
        <div style="background: rgba(255,255,255,0.06); border-left: 3px solid ${data.badgeColor}; padding: 8px 12px; border-radius: 4px; font-style: italic; font-size: 0.85rem; color: #f1f5f9; line-height: 1.45;">
          ${data.quote}
        </div>
      `;
    }

    // Update bottom analysis cards
    document.querySelectorAll('.tactical-analysis-card').forEach((c) => {
      c.style.borderColor = '#cbd5e1';
      c.style.boxShadow = 'none';
      c.style.background = '#ffffff';
    });
    const activeCard = document.getElementById(data.cardId);
    if (activeCard) {
      activeCard.style.borderColor = data.badgeColor;
      activeCard.style.boxShadow = `0 4px 12px ${data.badgeColor}33`;
      activeCard.style.background = '#f8fafc';
    }
  };

  window.selectScribalHotspot = function (id) {
    const data = scribalData[id];
    if (!data) return;

    // Highlight manuscript bounding box
    document.querySelectorAll('.scribal-box').forEach((b) => {
      b.style.border = '1.5px dashed #d97706';
      b.style.background = 'rgba(217, 119, 6, 0.14)';
      b.style.transform = 'scale(1)';
      b.style.boxShadow = 'none';
    });
    const targetBox = document.getElementById(`scribal-box-${id}`);
    if (targetBox) {
      targetBox.style.border = '2.5px solid #b91c1c';
      targetBox.style.background = 'rgba(185, 28, 28, 0.28)';
      targetBox.style.transform = 'scale(1.03)';
      targetBox.style.boxShadow = '0 0 14px rgba(185, 28, 28, 0.6)';
    }

    // Highlight transcript tokens
    document.querySelectorAll('.scribal-token').forEach((t) => {
      t.style.background = 'rgba(254, 243, 199, 0.6)';
      t.style.borderColor = '#d97706';
      t.style.color = '#78350f';
      t.style.fontWeight = '600';
    });
    const targetToken = document.querySelector(`.scribal-token-${id}`);
    if (targetToken) {
      targetToken.style.background = '#fee2e2';
      targetToken.style.borderColor = '#b91c1c';
      targetToken.style.color = '#991b1b';
      targetToken.style.fontWeight = '700';
    }

    // Update buttons
    document.querySelectorAll('.paleo-nav-btn').forEach((btn) => {
      btn.style.background = '#ffffff';
      btn.style.color = '#475569';
      btn.style.borderColor = '#cbd5e1';
    });
    const activeBtn = document.getElementById(`paleo-btn-${id}`);
    if (activeBtn) {
      activeBtn.style.background = '#7f1d1d';
      activeBtn.style.color = '#ffffff';
      activeBtn.style.borderColor = '#7f1d1d';
    }

    // Update Inspector content
    const panel = document.getElementById('scribal-inspector-content');
    if (panel) {
      panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
          <div>
            <span style="font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; background: #fee2e2; color: #991b1b; padding: 2px 7px; border-radius: 4px;">
              ${data.line} · Holograph Revision [${id}/4]
            </span>
            <h5 style="margin: 4px 0 0 0; color: #7f1d1d; font-size: 1.1rem; font-family: 'Playfair Display', serif;">
              ${data.title}
            </h5>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; font-size: 0.82rem;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px;">
            <strong style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 2px;">Original Holograph Draft:</strong>
            <span style="text-decoration: line-through; color: #64748b; font-family: 'Georgia', serif; font-size: 0.95rem;">&ldquo;${data.original}&rdquo;</span>
          </div>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 12px;">
            <strong style="color: #991b1b; font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 2px;">Revised Autograph Text:</strong>
            <span style="font-weight: 700; color: #991b1b; font-family: 'Georgia', serif; font-size: 0.95rem;">&ldquo;${data.revised}&rdquo;</span>
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 3.5px solid #d97706; padding: 10px 14px; border-radius: 4px; margin-bottom: 10px; font-size: 0.88rem; line-height: 1.55; color: #334155;">
          <strong style="color: #78350f; display: block; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Forensic Paleographical Analysis:</strong>
          ${data.paleoAnalysis}
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 14px; font-size: 0.85rem; line-height: 1.5; color: #1e3a8a;">
          <strong style="display: block; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; color: #1d4ed8;">Discussion Prompt for Class:</strong>
          ${data.hingeQuestion}
        </div>
      `;
    }
  };

  let allHotspotsVisible = true;
  window.toggleAllScribalHotspots = function () {
    allHotspotsVisible = !allHotspotsVisible;
    document.querySelectorAll('.scribal-box').forEach((b) => {
      b.style.opacity = allHotspotsVisible ? '1' : '0.15';
    });
    const toggleBtn = document.getElementById('toggle-hotspots-btn');
    if (toggleBtn) {
      toggleBtn.innerText = allHotspotsVisible ? 'Hide Overlays' : 'Show All Overlays';
    }
  };

  // Initial selection with a slight tick to allow DOM elements to paint
  setTimeout(() => {
    if (typeof window.selectMapPin === 'function') window.selectMapPin(1);
    if (typeof window.selectScribalHotspot === 'function') window.selectScribalHotspot(1);
  }, 50);
}

export function assignQuestionNumbers(lesson, targetUnitId) {
  const unit =
    targetUnitId ||
    (lesson && lesson.unitId) ||
    (typeof window !== 'undefined' && window.currentUnitId) ||
    (typeof appStore !== 'undefined' && appStore?.state?.selectedUnitId) ||
    (typeof appStore !== 'undefined' && appStore?.state?.activeUnitData?.id) ||
    (typeof window !== 'undefined' && window.location && window.location.search
      ? new URLSearchParams(window.location.search).get('id') ||
      new URLSearchParams(window.location.search).get('unit')
      : null);

  let globalQNum = 1;
  const isGCSE = ['cme_new', 'gcse_cold_war', 'edexcel_medicine', 'eee', 'weimar_nazi_germany', 'usa'].includes(
    unit,
  );
  const isGreatWar = unit === 'great_war' || unit === 'great_war_part2';
  const hasNarrativeBlocks = Boolean(lesson.narrative_blocks && lesson.narrative_blocks.length > 0);

  // 1. Primary Source
  if (lesson.primary_source && lesson.primary_source.question) {
    lesson.primary_source.qNum = globalQNum++;
  }

  // 2. Sources (non-GCSE units)
  if (lesson.sources && lesson.sources.length > 0 && !isGCSE) {
    lesson.sources.forEach((source) => {
      if (source.question) source.qNum = globalQNum++;
    });
  }

  // 3. Narrative Blocks
  if (lesson.narrative_blocks) {
    lesson.narrative_blocks.forEach((block) => {
      if (block.source && block.source.question && !block.source.qNum)
        block.source.qNum = globalQNum++;
      if (Array.isArray(block.sources) && (!lesson.sources || lesson.sources.length === 0)) {
        block.sources.forEach((s) => {
          if (s && s.question && !s.qNum) s.qNum = globalQNum++;
        });
      }
      if (block.tasks) {
        block.tasks.forEach((task) => {
          if (
            typeof task === 'object' &&
            task !== null &&
            task.type !== 'vocab_match' &&
            task.type !== 'drag_drop_timeline'
          ) {
            task.qNum = globalQNum++;
          }
        });
      }
    });
  }

  // 4. Pair Share is an oral classroom hinge — excluded from written question numbering

  // 5. Standard Tasks
  if (lesson.tasks) {
    lesson.tasks.forEach((task) => {
      if (typeof task === 'object' && task !== null) {
        if (
          task.type !== 'gcse_exam_practice' &&
          task.type !== 'exam_practice' &&
          task.type !== 'drawing' &&
          task.type !== 'draw'
        ) {
          task.qNum = globalQNum++;
        }
      }
    });
  }

  // 6. Historian's Corner
  if (lesson.historians_corner && !lesson.historians_corner.textbook_only) {
    if (lesson.historians_corner.stretch_question) {
      lesson.historians_corner.qNum = globalQNum++;
    }
  }

  // 7. Exam Practice Tasks
  if (lesson.tasks) {
    lesson.tasks.forEach((task) => {
      if (typeof task === 'object' && task !== null) {
        if (task.type === 'gcse_exam_practice' || task.type === 'exam_practice') {
          task.qNum = globalQNum++;
        }
      }
    });
  }

  // 8. Extended Writing
  if (lesson.extended && lesson.extended.question) {
    lesson.extended.qNum = globalQNum++;
  }

  // 10. GCSE Task
  if (lesson.gcse_task) {
    if (lesson.gcse_task.tasks && Array.isArray(lesson.gcse_task.tasks)) {
      lesson.gcse_task.tasks.forEach((task) => {
        if (typeof task === 'object' && task !== null) {
          task.qNum = globalQNum++;
        }
      });
    } else {
      lesson.gcse_task.qNum = globalQNum++;
    }
  }
}

if (typeof window !== 'undefined') {
  window.assignQuestionNumbers = assignQuestionNumbers;
}

export function renderPoetryDossiersHTML(poetryDossiers) {
  if (!poetryDossiers || !Array.isArray(poetryDossiers) || poetryDossiers.length === 0) {
    return '';
  }

  let html = `
    <div class="phase-card poetry-dossiers-section" style="margin-top: 35px; border: 1px solid #e2e8f0; border-top: 4px solid #7f1d1d; border-radius: 10px; padding: 25px; background: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.04);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #fecaca; padding-bottom: 12px; margin-bottom: 22px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; background: #fee2e2; color: #991b1b; padding: 3px 10px; border-radius: 12px; display: inline-block; margin-bottom: 6px;">
            Field Poetry &amp; Eyewitness Voices
          </span>
          <h3 style="margin: 0; color: #7f1d1d; font-size: 1.45rem; font-family: 'Playfair Display', serif;">
            Voices of the Salient · On-Site Readings
          </h3>
        </div>
        <button class="btn btn-secondary" data-action="open-anthology-modal" style="font-size: 0.85rem; padding: 7px 14px; background: #fafafa; border: 1px solid #cbd5e1; font-weight: 600; color: #7f1d1d; display: inline-flex; align-items: center; gap: 6px; border-radius: 6px; cursor: pointer;">
          <i class="fa-solid fa-book-open"></i> Full 16-Poem Anthology
        </button>
      </div>
      <p style="color: #475569; font-size: 0.95rem; margin-top: 0; margin-bottom: 25px; line-height: 1.5;">
        At each battlefield stop, recite these frontline eyewitness verses. Where two poems are provided, select either voice using the tab switcher. Expand the teacher commentary for on-site speaking cues and the historical rationale for deeper class discussion.
      </p>
      <div style="display: flex; flex-direction: column; gap: 28px;">
  `;

  poetryDossiers.forEach((stop, sIdx) => {
    const hasMultiple = stop.poems && stop.poems.length > 1;
    html += `
      <div class="poetry-dossier-card" id="poetry-${stop.site_id}" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div>
            <span style="font-size: 0.72rem; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 0.05em; display: block;">Stop ${sIdx + 1} Field Reading</span>
            <h4 style="margin: 2px 0 0 0; color: #0f172a; font-size: 1.2rem; font-family: 'Playfair Display', serif;">
              ${stop.site_name}
            </h4>
          </div>
          <span style="font-size: 0.78rem; font-weight: 700; background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 14px; border: 1px solid #e2e8f0;">
            ${stop.stop_time}
          </span>
        </div>
    `;

    if (hasMultiple) {
      html += `
        <div style="display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; align-items: center; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; margin-right: 4px;">Choose Voice:</span>
          ${stop.poems
          .map(
            (p, pIdx) => `
            <button class="btn poet-tab-btn" data-action="switch-poet-tab" data-target-poet="pane-${stop.site_id}-${p.id}" style="padding: 5px 12px; font-size: 0.82rem; border-radius: 16px; border: 1px solid ${pIdx === 0 ? '#7f1d1d' : '#cbd5e1'}; background: ${pIdx === 0 ? '#7f1d1d' : '#ffffff'}; color: ${pIdx === 0 ? '#ffffff' : '#475569'}; font-weight: ${pIdx === 0 ? '700' : '600'}; cursor: pointer; transition: all 0.2s;">
              <i class="fa-solid fa-feather-pointed" style="margin-right: 4px;"></i> ${p.poet.name.split(',')[0]}: <em>"${p.title}"</em>
            </button>
          `,
          )
          .join('')}
        </div>
      `;
    }

    stop.poems.forEach((poem, pIdx) => {
      const isVisible = pIdx === 0;
      html += `
        <div class="poet-view-pane" id="pane-${stop.site_id}-${poem.id}" style="display: ${isVisible ? 'block' : 'none'};">
          <!-- Poet Profile Header -->
          <div class="poet-profile-header" style="display: flex; flex-wrap: wrap; gap: 18px; align-items: flex-start; background: #faf8f5; border: 1px solid #e7dfd5; border-radius: 8px; padding: 18px; margin-bottom: 18px;">
            <div class="poet-portrait-col" style="flex: 0 0 115px; text-align: center;">
              <img src="${poem.poet.portrait}" alt="${poem.poet.name}" style="width: 115px; height: 145px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.12); cursor: zoom-in;" data-action="open-modal" data-src="${poem.poet.portrait}">
              <small style="display: block; margin-top: 5px; font-size: 0.75rem; color: #64748b; font-weight: 600;">${poem.poet.lifespan}</small>
            </div>
            <div class="poet-bio-col" style="flex: 1; min-width: 240px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
                <div>
                  <h4 style="margin: 0; color: #1e293b; font-size: 1.25rem; font-family: 'Playfair Display', serif;">${poem.poet.name}</h4>
                  <div style="font-size: 0.85rem; color: #78350f; font-weight: 600; margin-top: 2px;">${poem.poet.role}</div>
                </div>
                <span style="font-size: 0.75rem; font-weight: 700; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 10px; border: 1px solid #fde68a;">${poem.year}</span>
              </div>
              <p style="margin: 10px 0 0 0; color: #334155; font-size: 0.92rem; line-height: 1.6;">${poem.bio}</p>
            </div>
          </div>

          <!-- Unabridged Poem Box -->
          <div class="poem-blockquote-box" style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #991b1b; border-radius: 6px; padding: 22px 26px; margin-bottom: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px;">
              <h5 style="margin: 0; font-size: 1.2rem; color: #1e3a8a; font-family: 'Playfair Display', serif; font-style: italic;">
                "${poem.title}"
              </h5>
              <span style="font-size: 0.78rem; color: #64748b;"><i class="fa-regular fa-calendar" style="margin-right: 4px;"></i>${poem.year}</span>
            </div>
            <div class="poem-text-content" style="font-family: 'Georgia', serif; font-size: 1.02rem; line-height: 1.85; color: #1e293b; white-space: pre-line; margin: 0; overflow-wrap: break-word; word-break: normal;">
${poem.poem_text}
            </div>
            <div style="text-align: right; margin-top: 14px; font-size: 0.85rem; color: #64748b; font-style: italic;">
              — ${poem.poet.name} (${poem.poet.lifespan})
            </div>
          </div>

          <!-- Collapsible Teacher Guide Drawer -->
          <details style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 6px; margin-bottom: 12px; overflow: hidden;">
            <summary style="padding: 10px 14px; cursor: pointer; font-weight: 700; color: #1d4ed8; font-size: 0.92rem; display: flex; align-items: center; justify-content: space-between; user-select: none;">
              <span><i class="fa-solid fa-bullhorn" style="margin-right: 8px; color: #2563eb;"></i> On-Site Teacher Guidance: What to Say Here</span>
              <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem; color: #60a5fa;"></i>
            </summary>
            <div style="padding: 14px 18px; border-top: 1px solid #bfdbfe; font-size: 0.93rem; line-height: 1.6; color: #1e3a8a; background: #ffffff;">
              ${poem.teacher_commentary}
            </div>
          </details>

          <!-- Collapsible In-Depth Historical & Pedagogical Rationale Drawer -->
          <details style="background: #fdfaf6; border: 1px solid #fed7aa; border-left: 4px solid #ea580c; border-radius: 6px; margin-bottom: 8px; overflow: hidden;">
            <summary style="padding: 10px 14px; cursor: pointer; font-weight: 700; color: #9a3412; font-size: 0.92rem; display: flex; align-items: center; justify-content: space-between; user-select: none;">
              <span><i class="fa-solid fa-brain" style="margin-right: 8px; color: #ea580c;"></i> In-Depth Historical &amp; Pedagogical Rationale</span>
              <i class="fa-solid fa-chevron-down" style="font-size: 0.8rem; color: #fb923c;"></i>
            </summary>
            <div style="padding: 14px 18px; border-top: 1px solid #fed7aa; font-size: 0.93rem; line-height: 1.6; color: #334155; background: #ffffff;">
              <p style="margin: 0 0 12px 0;">${poem.pedagogical_rationale.context}</p>
              <div style="background: #fff7ed; border-left: 3px solid #ea580c; padding: 12px 14px; border-radius: 4px;">
                <strong style="color: #9a3412; display: block; margin-bottom: 4px; font-size: 0.88rem;"><i class="fa-solid fa-circle-question" style="margin-right: 5px;"></i> Discussion Prompt for Class:</strong>
                <span style="color: #431407; font-weight: 600; font-size: 0.95rem;">"${poem.pedagogical_rationale.hinge_question}"</span>
              </div>
            </div>
          </details>
        </div>
      `;
    });

    html += `</div>`;
  });

  if (isGCSEInteractiveUnit(window.currentUnitId || (typeof unitId !== 'undefined' ? unitId : null))) {
    html += `
      <style>
        @keyframes sourceHighlightGlow {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); outline: 3px solid #3b82f6; transform: translateY(-2px); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.25); outline: 3px solid #2563eb; transform: translateY(-3px); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); outline: 3px solid #3b82f6; transform: translateY(-2px); }
        }
        .source-card-highlighted {
          animation: sourceHighlightGlow 1.5s infinite ease-in-out !important;
          border-color: #3b82f6 !important;
          transition: all 0.25s ease-in-out !important;
        }
        .source-inquiry-interactive {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .source-inquiry-interactive:hover {
          filter: brightness(0.97);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2) !important;
        }
      </style>
    `;
  }

  html += `
      </div>
    </div>
  `;
  return html;
}

if (typeof window !== 'undefined' && !window._cmeSourceHighlightBound) {
  window._cmeSourceHighlightBound = true;
  document.addEventListener('mouseover', (e) => {
    if (!isGCSEInteractiveUnit(window.currentUnitId)) return;
    const box = e.target.closest('[data-target-source]');
    if (box) {
      const letter = box.getAttribute('data-target-source');
      const card = document.getElementById(`source-card-${letter}`);
      if (card) card.classList.add('source-card-highlighted');
    }
    const interpBox = e.target.closest('[data-target-interpretation]');
    if (interpBox) {
      const num = interpBox.getAttribute('data-target-interpretation');
      const card = document.getElementById(`interpretation-card-${num}`);
      if (card) card.classList.add('source-card-highlighted');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (!isGCSEInteractiveUnit(window.currentUnitId)) return;
    const box = e.target.closest('[data-target-source]');
    if (box) {
      const letter = box.getAttribute('data-target-source');
      const card = document.getElementById(`source-card-${letter}`);
      if (card) card.classList.remove('source-card-highlighted');
    }
    const interpBox = e.target.closest('[data-target-interpretation]');
    if (interpBox) {
      const num = interpBox.getAttribute('data-target-interpretation');
      const card = document.getElementById(`interpretation-card-${num}`);
      if (card) card.classList.remove('source-card-highlighted');
    }
  });
  document.addEventListener('click', (e) => {
    if (!isGCSEInteractiveUnit(window.currentUnitId)) return;
    const box = e.target.closest('[data-target-source]');
    if (box) {
      const letter = box.getAttribute('data-target-source');
      const card = document.getElementById(`source-card-${letter}`);
      if (card) {
        if (card.tagName === 'DETAILS') card.open = true;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('source-card-highlighted');
        setTimeout(() => card.classList.remove('source-card-highlighted'), 3000);
      }
    }
    const interpBox = e.target.closest('[data-target-interpretation]');
    if (interpBox) {
      const num = interpBox.getAttribute('data-target-interpretation');
      const card = document.getElementById(`interpretation-card-${num}`);
      if (card) {
        if (card.tagName === 'DETAILS') card.open = true;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('source-card-highlighted');
        setTimeout(() => card.classList.remove('source-card-highlighted'), 3000);
      }
    }
  });

  // Global click-away handler to dismiss specification anchor popovers
  if (!window._specAnchorListenerBound) {
    window._specAnchorListenerBound = true;
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.spec-anchor-popover')) {
        document.querySelectorAll('.spec-anchor-popover[open]').forEach((el) => {
          el.removeAttribute('open');
        });
      }
    });
  }
}

export function toggleAllAnswers(btnOrContainer) {
  let container;
  let btn;
  if (btnOrContainer instanceof HTMLElement) {
    if (
      btnOrContainer.tagName === 'BUTTON' ||
      btnOrContainer.dataset?.action === 'toggle-all-answers'
    ) {
      btn = btnOrContainer;
      container =
        btn.closest('details') ||
        btn.closest('.donow-panel-content') ||
        btn.closest('.launchpad-panel') ||
        btn.closest('.phase-card') ||
        btn.closest('.do-now-box') ||
        document;
    } else {
      container = btnOrContainer.closest?.('details') || btnOrContainer;
      btn = container?.querySelector?.('[data-action="toggle-all-answers"]');
    }
  } else {
    container = document.querySelector('details:has(.do-now-card)') || document;
    btn = container?.querySelector?.('[data-action="toggle-all-answers"]');
  }
  if (!container) return;
  if (container.tagName === 'DETAILS' && !container.open) container.open = true;
  const answers = container.querySelectorAll('.answer');
  if (!answers || answers.length === 0) return;
  const anyHidden = Array.from(answers).some((a) => {
    return window.getComputedStyle(a).display === 'none' || a.style.display === 'none';
  });
  answers.forEach((a) => {
    const parentCard = a.closest('.do-now-card');
    if (anyHidden) {
      a.style.display = 'block';
      a.classList.add('revealed');
      if (parentCard) parentCard.classList.add('revealed');
    } else {
      a.style.display = 'none';
      a.classList.remove('revealed');
      if (parentCard) parentCard.classList.remove('revealed');
    }
  });
  if (btn) {
    btn.innerHTML = anyHidden
      ? '<i class="fa-solid fa-eye-slash"></i> Hide All'
      : '<i class="fa-solid fa-eye"></i> Reveal All';
  }
}

if (typeof window !== 'undefined') {
  window.toggleAllAnswers = toggleAllAnswers;

  window.showLessonSpecModal = function (encodedSpec, badge, encodedTitle) {
    const existing = document.getElementById('lesson-spec-modal-overlay');
    if (existing) existing.remove();

    let specText = '';
    let lessonTitle = '';
    try {
      specText = encodedSpec ? decodeURIComponent(encodedSpec) : '';
    } catch (e) {
      specText = encodedSpec || '';
    }
    try {
      lessonTitle = encodedTitle ? decodeURIComponent(encodedTitle) : '';
    } catch (e) {
      lessonTitle = encodedTitle || '';
    }

    if (!specText) return;

    const overlay = document.createElement('div');
    overlay.id = 'lesson-spec-modal-overlay';
    overlay.style.cssText =
      'position: fixed; inset: 0; z-index: 999999; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; font-family: "Inter", sans-serif;';

    overlay.innerHTML = `
      <div style="background: #ffffff; color: #0f172a; width: 100%; max-width: 620px; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); border: 1.5px solid #cbd5e1; overflow: hidden; animation: specModalFadeIn 0.18s ease-out;">
        <!-- Header -->
        <div style="background: #0f172a; color: #ffffff; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3b82f6;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-bookmark" style="color: #60a5fa;"></i>
            <span style="font-weight: 800; font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase;">${badge || 'Specification Topic Anchor'}</span>
          </div>
          <button type="button" onclick="window.closeLessonSpecModal()" style="background: none; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer; padding: 0 4px; line-height: 1; transition: color 0.15s;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='#94a3b8'" title="Close (Esc)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          ${lessonTitle ? `<div style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.18rem; font-weight: 700; color: #0f172a; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; line-height: 1.35;">${lessonTitle}</div>` : ''}
          <div style="background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 6px; padding: 16px 20px; margin-bottom: 22px; font-size: 1rem; color: #1e293b; line-height: 1.6; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);">
            <div style="font-size: 0.75rem; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-scroll" style="color: #3b82f6;"></i> Specification Topic Focus
            </div>
            &ldquo;${specText}&rdquo;
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="button" onclick="window.closeLessonSpecModal()" style="background: #0f172a; color: #ffffff; border: none; padding: 9px 22px; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='#0f172a'">
              Close (Esc)
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) window.closeLessonSpecModal();
    });

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        window.closeLessonSpecModal();
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);
  };

  window.closeLessonSpecModal = function () {
    const existing = document.getElementById('lesson-spec-modal-overlay');
    if (existing) existing.remove();
  };
}



// --- Extracted Lesson UI Controllers & Stimulus Builders ---
export function initLessonGlobalWindowControllers() {
  if (typeof window === 'undefined') return;
window.doNowTimers = window.doNowTimers || {};

window.setDoNowTimerPreset = function (timerId, seconds) {
  let timer = window.doNowTimers[timerId];
  if (!timer) {
    timer = {
      totalSeconds: seconds,
      initialSeconds: seconds,
      interval: null,
      isRunning: false,
      isSilent: true,
    };
    window.doNowTimers[timerId] = timer;
  } else {
    if (timer.interval) clearInterval(timer.interval);
    timer.interval = null;
    timer.isRunning = false;
    timer.totalSeconds = seconds;
    timer.initialSeconds = seconds;
  }

  // Update pills UI
  const presetsContainer = document.getElementById(`${timerId}-presets`);
  if (presetsContainer) {
    presetsContainer.querySelectorAll('.btn-timer-pill').forEach((pill) => {
      const sec = parseInt(pill.getAttribute('data-sec'), 10);
      if (sec === seconds) {
        pill.classList.add('active-preset');
        pill.style.border = '1.5px solid #0284c7';
        pill.style.background = '#e0f2fe';
        pill.style.color = '#0369a1';
      } else {
        pill.classList.remove('active-preset');
        pill.style.border = '1px solid #cbd5e1';
        pill.style.background = '#f8fafc';
        pill.style.color = '#334155';
      }
    });
  }

  // Update mode pill
  const modePill = document.getElementById(`${timerId}-mode-pill`);
  if (modePill) {
    const mins = Math.round(seconds / 60);
    modePill.textContent = `${mins} Mins`;
  }

  // Reset button state
  const startBtn = document.getElementById(`${timerId}-start-btn`);
  const pauseBtn = document.getElementById(`${timerId}-pause-btn`);
  if (startBtn) {
    startBtn.style.display = 'inline-flex';
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
  }
  if (pauseBtn) pauseBtn.style.display = 'none';

  // Update display
  const display = document.getElementById(`${timerId}-display`);
  const summaryBadge = document.getElementById(`${timerId}-summary-badge`);
  const progressBar = document.getElementById(`${timerId}-progress`);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  if (display) {
    display.textContent = formatted;
    display.style.color = '#0f172a';
  }
  if (summaryBadge) {
    summaryBadge.textContent = formatted;
    summaryBadge.style.color = '#0369a1';
  }
  if (progressBar) {
    progressBar.style.width = '100%';
    progressBar.style.background = '#0284c7';
  }
};

window.toggleDoNowTimerSound = function (timerId) {
  let timer = window.doNowTimers[timerId];
  if (!timer) {
    timer = {
      totalSeconds: 300,
      initialSeconds: 300,
      interval: null,
      isRunning: false,
      isSilent: true,
    };
    window.doNowTimers[timerId] = timer;
  }
  timer.isSilent = !timer.isSilent;
  const icon = document.getElementById(`${timerId}-sound-icon`);
  const btn = document.getElementById(`${timerId}-sound-btn`);
  if (icon && btn) {
    if (timer.isSilent) {
      icon.className = 'fa-solid fa-bell-slash';
      icon.style.color = '#64748b';
      btn.title = 'Silent Mode Active (Click to unmute chime)';
    } else {
      icon.className = 'fa-solid fa-bell';
      icon.style.color = '#0284c7';
      btn.title = 'Audio Chime Active (Click to mute)';
    }
  }
};

window.toggleDoNowTimer = function (timerId, action) {
  let timer = window.doNowTimers[timerId];
  if (!timer) {
    timer = {
      totalSeconds: 300,
      initialSeconds: 300,
      interval: null,
      isRunning: false,
      isSilent: true,
    };
    window.doNowTimers[timerId] = timer;
  }

  const display = document.getElementById(`${timerId}-display`);
  const summaryBadge = document.getElementById(`${timerId}-summary-badge`);
  const startBtn = document.getElementById(`${timerId}-start-btn`);
  const pauseBtn = document.getElementById(`${timerId}-pause-btn`);
  const progressBar = document.getElementById(`${timerId}-progress`);

  const updateDisplay = () => {
    const mins = Math.floor(timer.totalSeconds / 60);
    const secs = timer.totalSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (display) {
      display.textContent = formatted;
      if (timer.totalSeconds === 0) {
        display.style.color = '#ef4444';
        display.textContent = "00:00 (Time's Up!)";
      } else if (timer.totalSeconds <= 30) {
        display.style.color = '#ef4444';
      } else {
        display.style.color = '#0f172a';
      }
    }
    if (summaryBadge) {
      summaryBadge.textContent = formatted;
      summaryBadge.style.color = timer.totalSeconds <= 30 ? '#ef4444' : '#0369a1';
    }
    if (progressBar) {
      const pct = Math.max(0, (timer.totalSeconds / (timer.initialSeconds || 300)) * 100);
      progressBar.style.width = pct + '%';
      if (timer.totalSeconds === 0) {
        progressBar.style.background = '#ef4444';
      } else if (timer.totalSeconds <= 30 || pct <= 20) {
        progressBar.style.background = '#f59e0b';
      } else {
        progressBar.style.background = '#0284c7';
      }
    }
  };

  const playChime = () => {
    if (timer.isSilent) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) { }
  };

  if (action === 'start') {
    if (timer.isRunning) return;
    if (timer.totalSeconds === 0) timer.totalSeconds = timer.initialSeconds || 300;
    timer.isRunning = true;
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-flex';

    if (timer.interval) clearInterval(timer.interval);
    timer.interval = setInterval(() => {
      if (timer.totalSeconds > 0) {
        timer.totalSeconds--;
        updateDisplay();
        if (timer.totalSeconds === 0) {
          clearInterval(timer.interval);
          timer.interval = null;
          timer.isRunning = false;
          if (startBtn) {
            startBtn.style.display = 'inline-flex';
            startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Restart';
          }
          if (pauseBtn) pauseBtn.style.display = 'none';
          playChime();
        }
      }
    }, 1000);
  } else if (action === 'pause') {
    if (!timer.isRunning) return;
    clearInterval(timer.interval);
    timer.interval = null;
    timer.isRunning = false;
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
    }
    if (pauseBtn) pauseBtn.style.display = 'none';
  } else if (action === 'reset') {
    if (timer.interval) clearInterval(timer.interval);
    timer.interval = null;
    timer.isRunning = false;
    timer.totalSeconds = timer.initialSeconds || 300;
    updateDisplay();
    if (startBtn) {
      startBtn.style.display = 'inline-flex';
      startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    }
    if (pauseBtn) pauseBtn.style.display = 'none';
  } else if (action === 'add1') {
    timer.totalSeconds += 60;
    if (!timer.isRunning || timer.totalSeconds > timer.initialSeconds) {
      timer.initialSeconds = timer.totalSeconds;
    }
    const presetsContainer = document.getElementById(`${timerId}-presets`);
    if (presetsContainer) {
      presetsContainer.querySelectorAll('.btn-timer-pill').forEach((pill) => {
        const isMatch = parseInt(pill.getAttribute('data-sec'), 10) === timer.totalSeconds;
        pill.classList.toggle('active-preset', isMatch);
        pill.style.border = isMatch ? '1.5px solid #0284c7' : '1px solid #cbd5e1';
        pill.style.background = isMatch ? '#e0f2fe' : '#ffffff';
        pill.style.color = isMatch ? '#0369a1' : '#475569';
      });
    }
    updateDisplay();
  } else if (action === 'sub1') {
    if (timer.totalSeconds > 60) {
      timer.totalSeconds -= 60;
      if (!timer.isRunning) {
        timer.initialSeconds = timer.totalSeconds;
      }
      const presetsContainer = document.getElementById(`${timerId}-presets`);
      if (presetsContainer) {
        presetsContainer.querySelectorAll('.btn-timer-pill').forEach((pill) => {
          const isMatch = parseInt(pill.getAttribute('data-sec'), 10) === timer.totalSeconds;
          pill.classList.toggle('active-preset', isMatch);
          pill.style.border = isMatch ? '1.5px solid #0284c7' : '1px solid #cbd5e1';
          pill.style.background = isMatch ? '#e0f2fe' : '#ffffff';
          pill.style.color = isMatch ? '#0369a1' : '#475569';
        });
      }
      updateDisplay();
    }
  } else if (action === 'add5') {
    timer.totalSeconds += 300;
    if (timer.totalSeconds > timer.initialSeconds) timer.initialSeconds = timer.totalSeconds;
    updateDisplay();
  }
};

window.toggleLessonFullWidth = function (forceState) {
  if (typeof document === 'undefined' || !document.body) return;
  const isCurrentlyActive = document.body.classList.contains('lesson-full-width');
  const nextState = typeof forceState === 'boolean' ? forceState : !isCurrentlyActive;
  document.body.classList.toggle('lesson-full-width', nextState);
  try {
    if (nextState) {
      sessionStorage.setItem('hh_lesson_full_width', 'true');
    } else {
      sessionStorage.removeItem('hh_lesson_full_width');
    }
  } catch (e) { }
  if (typeof window.syncLessonFullWidthButtons === 'function') {
    window.syncLessonFullWidthButtons(nextState);
  }
};

window.syncLessonFullWidthButtons = function (isActive) {
  if (typeof document === 'undefined') return;
  const btns = document.querySelectorAll('.btn-fullwidth-toggle');
  btns.forEach((btn) => {
    btn.classList.toggle('active', Boolean(isActive));
    btn.innerHTML = isActive
      ? '<i class="fa-solid fa-compress"></i> <span class="fw-btn-label">Restore Sidebar</span>'
      : '<i class="fa-solid fa-expand"></i> <span class="fw-btn-label">Full-Width View</span>';
    btn.title = isActive
      ? 'Restore outer sidebar and top bar'
      : 'Hide outer sidebar and top bar for full-width classroom view';
  });
};

window.exitFullWidthToUnit = function () {
  if (typeof document !== 'undefined' && document.body) {
    document.body.classList.remove('lesson-full-width');
  }
  try {
    sessionStorage.removeItem('hh_lesson_full_width');
  } catch (e) { }
  const targetUnit =
    (appStore && appStore.state && appStore.state.selectedUnitId) ||
    (typeof window !== 'undefined' && window.currentUnitId);
  if (typeof window !== 'undefined' && typeof window.switchView === 'function' && targetUnit) {
    window.switchView('lessons', targetUnit);
  } else if (typeof window !== 'undefined' && typeof window.renderLessonsView === 'function') {
    window.renderLessonsView();
  }
};

window.toggleWhiteboardMode = function (forceState) {
  // If in chess view, delegate to chess projector/whiteboard mode
  if (
    document.getElementById('chess-hub-root') ||
    (window.state && window.state.currentView === 'chess') ||
    (typeof window.location !== 'undefined' && window.location.search.includes('view=chess'))
  ) {
    if (typeof window.toggleChessWhiteboardMode === 'function') {
      return window.toggleChessWhiteboardMode(forceState);
    }
  }

  const isCurrentlyActive = document.body.classList.contains('whiteboard-mode-active');
  const nextState = typeof forceState === 'boolean' ? forceState : !isCurrentlyActive;
  if (nextState) {
    document.body.classList.add('whiteboard-mode-active');
  } else {
    document.body.classList.remove('whiteboard-mode-active');
  }
  try {
    localStorage.setItem('whiteboardMode', nextState ? 'true' : 'false');
  } catch (e) { }
  window.syncWhiteboardButtons(nextState);
};

window.syncWhiteboardButtons = function (isActive) {
  const btns = document.querySelectorAll('.btn-whiteboard-toggle');
  btns.forEach((btn) => {
    if (isActive) {
      btn.classList.add('active');
      btn.innerHTML =
        '<i class="fa-solid fa-compress"></i> <span class="wb-btn-label">Standard View</span>';
      btn.title = 'Exit Whiteboard Presentation Mode (restore hero banner)';
    } else {
      btn.classList.remove('active');
      btn.innerHTML =
        '<i class="fa-solid fa-chalkboard"></i> <span class="wb-btn-label">Whiteboard View</span>';
      btn.title =
        'Toggle Whiteboard Presentation Mode (collapses hero banner for classroom projectors)';
    }
  });
  const wbTags = document.querySelectorAll('.wb-status-tag');
  wbTags.forEach((tag) => {
    tag.textContent = isActive ? 'ON' : 'OFF';
    tag.style.background = isActive ? '#dcfce7' : '#f1f5f9';
    tag.style.color = isActive ? '#15803d' : '#475569';
  });
  if (typeof window.updateClassroomToolsBadge === 'function') {
    window.updateClassroomToolsBadge();
  }
};

window.updateClassroomToolsBadge = function () { };
window.toggleLessonToolsMenu = function () { };
window.closeLessonToolsMenu = function () { };

// Register global switchVideoTab handler if in browser
if (typeof window !== 'undefined' && !window.switchVideoTab) {
  window.switchVideoTab = function (btn, sectionId, targetCardId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    // Hide all video cards in this section
    section.querySelectorAll('.archival-video-entry').forEach(function (card) {
      card.style.display = 'none';
    });
    // Show target card
    const targetCard = document.getElementById(targetCardId);
    if (targetCard) {
      targetCard.style.display = 'flex';
    }
    // Update button states
    const tabBtns = section.querySelectorAll('.video-pathway-tab-btn');
    tabBtns.forEach(function (b) {
      b.classList.remove('is-active');
      b.style.background = '#ffffff';
      b.style.color = '#334155';
      b.style.borderColor = '#cbd5e1';
      b.style.fontWeight = '600';
      b.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
      const liveBadge = b.querySelector('.tab-live-badge');
      if (liveBadge) liveBadge.style.display = 'none';
      const platformPill = b.querySelector('.tab-platform-pill');
      if (platformPill) {
        const isEra = platformPill.getAttribute('data-platform') === 'era';
        platformPill.style.background = isEra ? '#eff6ff' : '#fef2f2';
        platformPill.style.color = isEra ? '#1e40af' : '#dc2626';
      }
    });
    btn.classList.add('is-active');
    btn.style.background = '#0f172a';
    btn.style.color = '#ffffff';
    btn.style.borderColor = '#0f172a';
    btn.style.fontWeight = '700';
    btn.style.boxShadow = '0 3px 8px rgba(15,23,42,0.25)';
    const activeLiveBadge = btn.querySelector('.tab-live-badge');
    if (activeLiveBadge) activeLiveBadge.style.display = 'inline-flex';
    const activePill = btn.querySelector('.tab-platform-pill');
    if (activePill) {
      activePill.style.background = 'rgba(255,255,255,0.18)';
      activePill.style.color = '#ffffff';
    }
  };
}

// Register global toggleVideoTaskDrawer handler for 1-Horizontal-Line Video Shelf
if (typeof window !== 'undefined' && !window.toggleVideoTaskDrawer) {
  window.toggleVideoTaskDrawer = function (safeLessonId, idx, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const drawer = document.getElementById('video-task-drawer-' + safeLessonId);
    if (!drawer) return;
    const targetContent = document.getElementById('video-task-content-' + safeLessonId + '-' + idx);
    const isCurrentlyOpen =
      drawer.style.display !== 'none' && targetContent && targetContent.style.display !== 'none';

    if (isCurrentlyOpen) {
      drawer.style.display = 'none';
      if (targetContent) targetContent.style.display = 'none';
    } else {
      drawer.querySelectorAll('.video-task-item-content').forEach(function (el) {
        el.style.display = 'none';
      });
      if (targetContent) targetContent.style.display = 'block';
      drawer.style.display = 'block';
      drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
}

// Register global whiteboard reveal handlers for Task 3 & Task 4
if (typeof window !== 'undefined' && !window.toggleSingleEvidence) {
  window.toggleSingleEvidence = function (el) {
    const prompt = el.querySelector('.t3-evidence-prompt');
    const revealed = el.querySelector('.t3-evidence-revealed');
    if (revealed && prompt) {
      const isHidden = revealed.style.display === 'none' || !revealed.style.display;
      revealed.style.display = isHidden ? 'block' : 'none';
      prompt.style.display = isHidden ? 'none' : 'flex';
      el.style.borderColor = isHidden ? '#10b981' : '#86efac';
    }
  };

  window.toggleSingleStarter = function (el) {
    const prompt = el.querySelector('.t3-starter-prompt');
    const revealed = el.querySelector('.t3-starter-revealed');
    if (revealed && prompt) {
      const isHidden = revealed.style.display === 'none' || !revealed.style.display;
      revealed.style.display = isHidden ? 'inline' : 'none';
      prompt.style.display = isHidden ? 'none' : 'flex';
    }
  };

  window.toggleTask3Mask = function (btn) {
    const taskBox = btn.closest('.two-sided-argument-interactive');
    if (!taskBox) return;
    const isRevealing = !btn.classList.contains('is-all-revealed');
    const evidenceItems = taskBox.querySelectorAll('.t3-evidence-item');
    const starters = taskBox.querySelectorAll('.t3-starter-box');

    evidenceItems.forEach(function (el) {
      const prompt = el.querySelector('.t3-evidence-prompt');
      const revealed = el.querySelector('.t3-evidence-revealed');
      if (revealed && prompt) {
        revealed.style.display = isRevealing ? 'block' : 'none';
        prompt.style.display = isRevealing ? 'none' : 'flex';
      }
    });

    starters.forEach(function (el) {
      const prompt = el.querySelector('.t3-starter-prompt');
      const revealed = el.querySelector('.t3-starter-revealed');
      if (revealed && prompt) {
        revealed.style.display = isRevealing ? 'inline' : 'none';
        prompt.style.display = isRevealing ? 'none' : 'flex';
      }
    });

    if (isRevealing) {
      btn.classList.add('is-all-revealed');
      btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>Mask Whiteboard Clues</span>';
      btn.style.background = '#fef2f2';
      btn.style.borderColor = '#fca5a5';
      btn.style.color = '#991b1b';
    } else {
      btn.classList.remove('is-all-revealed');
      btn.innerHTML =
        '<i class="fa-solid fa-chalkboard-user"></i> <span>Teacher Whiteboard Key</span>';
      btn.style.background = '#ecfdf5';
      btn.style.borderColor = '#6ee7b7';
      btn.style.color = '#065f46';
    }
  };

  window.toggleBbsMask = function (btn) {
    const taskBox = btn.closest('.because-but-so-interactive');
    if (!taskBox) return;
    const isRevealing = !btn.classList.contains('is-all-revealed');
    const models = taskBox.querySelectorAll('.bbs-model-box');

    models.forEach(function (el) {
      el.style.display = isRevealing ? 'block' : 'none';
    });

    const singleBtns = taskBox.querySelectorAll('.btn-single-bbs-model span');
    singleBtns.forEach(function (s) {
      s.textContent = isRevealing ? 'Hide Model' : 'Model Stem';
    });

    if (isRevealing) {
      btn.classList.add('is-all-revealed');
      btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>Mask Whiteboard Models</span>';
      btn.style.background = '#fef2f2';
      btn.style.borderColor = '#fca5a5';
      btn.style.color = '#991b1b';
    } else {
      btn.classList.remove('is-all-revealed');
      btn.innerHTML =
        '<i class="fa-solid fa-chalkboard-user"></i> <span>Teacher Whiteboard Key</span>';
      btn.style.background = '#eef2ff';
      btn.style.borderColor = '#c7d2fe';
      btn.style.color = '#4338ca';
    }
  };

  window.toggleSingleBbsModel = function (btn) {
    const card = btn.closest('.bbs-card');
    if (!card) return;
    const model = card.querySelector('.bbs-model-box');
    if (!model) return;
    const isHidden = model.style.display === 'none' || !model.style.display;
    model.style.display = isHidden ? 'block' : 'none';
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = isHidden ? 'Hide Model' : 'Model Stem';
    }
  };
}


}
initLessonGlobalWindowControllers();

export function ensureSourceEnquiryGlobalsAndStyles() {
  if (typeof window === 'undefined') return;
    if (typeof document !== 'undefined' && !document.getElementById('source-enquiry-mode-styles')) {
      const modeStyleEl = document.createElement('style');
      modeStyleEl.id = 'source-enquiry-mode-styles';
      modeStyleEl.textContent = `
        /* Mode A: Competing Perspectives (Indigo / Slate) */
        details.source-enquiry-reveal.mode-perspectives {
          border: 1.5px solid #c7d2fe !important;
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.06) !important;
        }
        details.source-enquiry-reveal.mode-perspectives > summary {
          background: #eef2ff !important;
        }
        details.source-enquiry-reveal.mode-perspectives > summary:hover {
          background: #e0e7ff !important;
        }
        details.source-enquiry-reveal.mode-perspectives[open] > summary {
          background: #e0e7ff !important;
          border-bottom: 1px solid #c7d2fe !important;
        }
        details.source-enquiry-reveal.mode-perspectives .reveal-answer-pill {
          color: #3730a3 !important;
          background: #ffffff !important;
          border: 1.5px solid #a5b4fc !important;
        }
        details.source-enquiry-reveal.mode-perspectives > summary:hover .reveal-answer-pill {
          background: #4f46e5 !important;
          color: #ffffff !important;
          border-color: #4f46e5 !important;
        }
        details.source-enquiry-reveal.mode-perspectives > summary:hover .reveal-answer-pill i {
          color: #e0e7ff !important;
        }
        details.source-enquiry-reveal.mode-perspectives > summary .source-enquiry-prompt {
          color: #1e1b4b !important;
        }
        details.source-enquiry-reveal.mode-perspectives > .source-enquiry-answer-body {
          border-top: 1.5px solid #c7d2fe !important;
        }

        /* Mode C: Single-Source Historical Enquiry (Archival Teal / Slate) */
        details.source-enquiry-reveal.mode-analysis {
          border: 1.5px solid #99f6e4 !important;
          box-shadow: 0 2px 6px rgba(15, 118, 110, 0.06) !important;
        }
        details.source-enquiry-reveal.mode-analysis > summary {
          background: #f0fdfa !important;
        }
        details.source-enquiry-reveal.mode-analysis > summary:hover {
          background: #ccfbf1 !important;
        }
        details.source-enquiry-reveal.mode-analysis[open] > summary {
          background: #ccfbf1 !important;
          border-bottom: 1px solid #99f6e4 !important;
        }
        details.source-enquiry-reveal.mode-analysis .reveal-answer-pill {
          color: #0f766e !important;
          background: #ffffff !important;
          border: 1.5px solid #5eead4 !important;
        }
        details.source-enquiry-reveal.mode-analysis > summary:hover .reveal-answer-pill {
          background: #0f766e !important;
          color: #ffffff !important;
          border-color: #0f766e !important;
        }
        details.source-enquiry-reveal.mode-analysis > summary:hover .reveal-answer-pill i {
          color: #ccfbf1 !important;
        }
        details.source-enquiry-reveal.mode-analysis > summary .source-enquiry-prompt {
          color: #134e4a !important;
        }
        details.source-enquiry-reveal.mode-analysis > .source-enquiry-answer-body {
          border-top: 1.5px solid #99f6e4 !important;
        }

        /* Mode B: Explicit Exam-Practice Prompt (Emerald #10b981) */
        details.source-enquiry-reveal.mode-exam {
          border: 1.5px solid #6ee7b7 !important;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.07) !important;
        }
        details.source-enquiry-reveal.mode-exam > summary {
          background: #f0fdf4 !important;
        }
        details.source-enquiry-reveal.mode-exam > summary:hover {
          background: #dcfce7 !important;
        }
        details.source-enquiry-reveal.mode-exam[open] > summary {
          background: #dcfce7 !important;
          border-bottom: 1px solid #86efac !important;
        }
        details.source-enquiry-reveal.mode-exam > summary:hover .reveal-answer-pill {
          background: #10b981 !important;
          color: #ffffff !important;
          border-color: #10b981 !important;
        }

        @media (max-width: 720px) {
          details.source-enquiry-reveal > summary,
          details.source-enquiry-reveal > summary.source-enquiry-single-row-summary {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
            padding: 10px 12px !important;
          }
          details.source-enquiry-reveal > summary .source-enquiry-left-wrap {
            flex-direction: column !important;
            align-items: flex-start !important;
            width: 100% !important;
            gap: 6px !important;
          }
          details.source-enquiry-reveal > summary .source-enquiry-mode-badge {
            white-space: normal !important;
            max-width: 100% !important;
          }
          details.source-enquiry-reveal > summary .source-enquiry-prompt {
            flex: 0 0 auto !important;
            width: 100% !important;
            min-width: 0 !important;
            word-break: normal !important;
            overflow-wrap: break-word !important;
            hyphens: none !important;
          }
          details.source-enquiry-reveal > summary .reveal-answer-pill {
            align-self: flex-start !important;
          }
        }
      `;
      document.head.appendChild(modeStyleEl);
    }

    window.syncSourceAnswerToggle = function (idx, isOpen) {
      if (typeof document === 'undefined') return;
      const btn = document.getElementById(`ans-btn-${idx}`);
      if (!btn) return;
      const openState = Boolean(isOpen);
      btn.setAttribute('aria-expanded', openState ? 'true' : 'false');
      btn.dataset.state = openState ? 'open' : 'closed';
      const closedSpan = btn.querySelector('.reveal-text-closed');
      const openSpan = btn.querySelector('.reveal-text-open');
      if (closedSpan && btn.dataset.closedLabel) {
        closedSpan.textContent = btn.dataset.closedLabel;
      }
      if (openSpan && btn.dataset.openLabel) {
        openSpan.textContent = btn.dataset.openLabel;
      }
    };

    window.toggleSourceAnswer = function (idx) {
      if (typeof document === 'undefined') return false;
      const det =
        idx && idx.tagName === 'DETAILS'
          ? idx
          : document.getElementById(`source-enquiry-det-${idx}`) ||
            document.getElementById(`ans-btn-${idx}`)?.closest('details');
      if (!det) return false;
      det.open = !det.open;
      const resolvedIdx =
        det.dataset?.enquiryIdx !== undefined ? det.dataset.enquiryIdx : idx;
      if (typeof window.syncSourceAnswerToggle === 'function') {
        window.syncSourceAnswerToggle(resolvedIdx, det.open);
      }
      return det.open;
    };

    if (!window._tpsTimerEnhanced) {
      window._tpsTimerEnhanced = true;
      window.startTPSTimer = function (btn, fallbackSeconds) {
        if (!btn) return;
        const secs = Number(btn.dataset && btn.dataset.seconds) || Number(fallbackSeconds) || 60;
        if (btn.timerInterval) {
          clearInterval(btn.timerInterval);
          btn.timerInterval = null;
          btn.classList.remove('is-running', 'is-finished');
          if (btn.originalHTML) btn.innerHTML = btn.originalHTML;
          if (btn.originalBg !== undefined) btn.style.background = btn.originalBg;
          return;
        }
        btn.originalHTML = btn.innerHTML;
        btn.originalBg = btn.style.background || '';
        let timeLeft = secs;
        btn.classList.add('is-running');
        btn.classList.remove('is-finished');
        const fmtTime = (s) => {
          if (s >= 60) {
            const m = Math.floor(s / 60);
            const r = s % 60;
            return `${m}:${String(r).padStart(2, '0')}`;
          }
          return `${s}s`;
        };
        btn.innerHTML = `<i class="fa-regular fa-clock"></i> ${fmtTime(timeLeft)} · Stop`;
        btn.style.background = '#dc2626';
        btn.timerInterval = setInterval(() => {
          timeLeft -= 1;
          if (timeLeft <= 0) {
            clearInterval(btn.timerInterval);
            btn.timerInterval = null;
            btn.classList.remove('is-running');
            btn.classList.add('is-finished');
            btn.innerHTML = '<i class="fa-regular fa-bell"></i> Time!';
            btn.style.background = '#d97706';
            setTimeout(() => {
              if (!btn.timerInterval) {
                btn.classList.remove('is-finished');
                if (btn.originalHTML) btn.innerHTML = btn.originalHTML;
                btn.style.background = btn.originalBg || '';
              }
            }, 4000);
          } else {
            btn.innerHTML = `<i class="fa-regular fa-clock"></i> ${fmtTime(timeLeft)} · Stop`;
          }
        }, 1000);
      };
    }
}

export const resolveSourceEnquiryMode = (srcObj, promptText) => {
    const cleanPrompt = String(promptText || '')
      .replace(/<[^>]*>/g, '')
      .replace(/^\s*\*+\s*/, '')
      .trim();
    const hasPerspectivePair = Boolean(
      srcObj &&
        srcObj.perspective_pair &&
        typeof srcObj.perspective_pair === 'object',
    );
    const isExplicitExamPrompt =
      /\[\s*\d+(?:\s*\+\s*\d+)?\s*marks?\s*\]/i.test(cleanPrompt) ||
      /^(?:Study Source|How useful is Source|Give two things you can infer)/i.test(cleanPrompt);

    if (hasPerspectivePair) {
      return {
        mode: 'perspectives',
        detailsClass: 'mode-perspectives',
        closedLabel: 'Compare Both Perspectives \u25BC',
        openLabel: 'Hide Comparison \u25B2',
        heading: 'WEIGHING BOTH PERSPECTIVES:',
        iconClass: 'fa-scale-balanced',
        accent: '#4f46e5',
        softBg: '#eef2ff',
        border: '#c7d2fe',
        badgeBg: '#e0e7ff',
        badgeBorder: '#c7d2fe',
        badgeText: '#3730a3',
        promptColor: '#1e1b4b',
        headingColor: '#3730a3',
      };
    }

    if (isExplicitExamPrompt) {
      return {
        mode: 'exam',
        detailsClass: 'mode-exam',
        closedLabel: 'Reveal Model Answer \u25BC',
        openLabel: 'Hide Model Answer \u25B2',
        heading: 'MODEL ANSWER:',
        iconClass: 'fa-graduation-cap',
        accent: '#10b981',
        softBg: '#f0fdf4',
        border: '#86efac',
        badgeBg: '#dcfce7',
        badgeBorder: '#bbf7d0',
        badgeText: '#166534',
        promptColor: '#14532d',
        headingColor: '#065f46',
      };
    }

    return {
      mode: 'analysis',
      detailsClass: 'mode-analysis',
      closedLabel: 'View Historical Analysis \u25BC',
      openLabel: 'Hide Analysis \u25B2',
      heading: 'HISTORICAL ANALYSIS:',
      iconClass: 'fa-magnifying-glass-chart',
      accent: '#0f766e',
      softBg: '#f0fdfa',
      border: '#99f6e4',
      badgeBg: '#ccfbf1',
      badgeBorder: '#99f6e4',
      badgeText: '#115e59',
      promptColor: '#134e4a',
      headingColor: '#0f766e',
    };
  };


export const WEIMAR_WORKBOOK_INTERPRETATIONS = {
        lesson_1_4: [
          {
            title: 'Interpretation 1 (The Social Liberation View):',
            content:
              'The Weimar era brought a profound, lasting social and political liberation for German women. The introduction of female suffrage in 1918 resulted in high female representation in the Reichstag, while economic recovery opened up millions of new white-collar job opportunities. This allowed a new generation of independent, financially self-sufficient women to confidently challenge traditional gender roles.',
          },
          {
            title: 'Interpretation 2 (The Traditionalist Backlash View):',
            content:
              "The concept of the liberated 'New Woman' was an urban myth that did not reflect the reality for the vast majority of German women. Most women remained trapped in low-paid, unskilled agricultural and domestic work, and the constitution's promises of equality were rarely enforced in the workplace. The visible changes in Berlin cabaret culture actually provoked a massive, hostile traditionalist backlash that weakened the Republic.",
          },
        ],
        lesson_2_4: [
          {
            title: 'Interpretation 1 (The Democratic Collapse View):',
            content:
              'Hitler’s rise to power was the inevitable result of the collapse of the Weimar democratic system. The Great Depression permanently paralyzed the Reichstag, forcing a reliance on Article 48 presidential emergency decrees that destroyed democratic legitimacy. By 1932, democracy was already dead, and the conservative elites had to hand power to Hitler because his party was the largest in the parliament.',
          },
          {
            title: 'Interpretation 2 (The Political Intrigue View):',
            content:
              'Hitler’s appointment as Chancellor was not inevitable, but was the direct result of secret political scheming and backstairs intrigue. The Nazi vote was actually declining by late 1932, and the party was running out of money. Hitler was only rescued because Franz von Papen, President Hindenburg, and conservative landowners made the fatal, cynical miscalculation that they could use his mass popularity to serve their own authoritarian goals.',
          },
        ],
        lesson_3_4: [
          {
            title: 'Interpretation 1 (The Brave Resistance View):',
            content:
              "The Christian Churches in Germany were largely successful in resisting the Nazi regime's attempts to achieve total control over religious life. Despite intense pressure, both the Catholic and Protestant Churches prevented the total Nazification of their institutions. The creation of the Confessing Church by thousands of brave pastors successfully defended theological independence, proving that religious faith remained a powerful barrier to totalitarian control.",
          },
          {
            title: 'Interpretation 2 (The Limited Conformity View):',
            content:
              'Christian opposition to the Nazi regime was extremely limited, narrow, and ultimately failed to challenge the wider atrocities of the state. The vast majority of church leaders conformed because they shared Hitler’s hatred of communism and feared the destruction of their institutions. When pastors spoke out, their protests were strictly limited to defending church administration; they remained entirely silent during the persecution of minorities and the destruction of democracy.',
          },
        ],
        lesson_4_4: [
          {
            title: 'Interpretation 1 (The Planned State Pogrom View):',
            content:
              'The anti-Semitic violence of Kristallnacht was a highly coordinated, systematic operation planned and executed entirely from above by Joseph Goebbels and the paramilitary SA, aiming to force Jewish families into absolute economic and physical isolation.',
          },
          {
            title: 'Interpretation 2 (The Public Fear/Isolation View):',
            content:
              "While the state-controlled press portrayed the violence of Kristallnacht as a spontaneous outburst of public anger, many ordinary Germans watched the destruction with deep alarm, concern, and disapproval. However, they remained completely silent and conformed to the regime's actions solely out of terror of the Gestapo and fear of immediate arrest.",
          },
        ],
      };

export const buildUnifiedEdexcelSourceHeader = (stim, fallbackTitle = '') => {
        if (!stim || typeof stim !== 'object') {
          return String(fallbackTitle || 'Contemporary Primary Source').trim();
        }
        const stripSourceNoise = (val) =>
          String(val || '')
            .replace(
              /^(?:Source\s+[A-Z0-9]+|Interpretation\s+[0-9]+)\s*(?:\([^)]*\))?\s*[:.-]\s*/i,
              '',
            )
            .replace(/^source[_-\s]*[A-Z0-9]+[:\s-]*/i, '')
            .replace(/^(?:Clinical|Archival|Documentary)\s+Photograph\s*:\s*/i, '')
            .replace(/,?\s*\b(?:Art\.)?IWM\s+[A-Z0-9()/\s-]+?(?=[),.;]|$)/gi, '')
            .replace(/,?\s*\bBundesarchiv\s+(?:Bild|R)\s+[A-Z0-9()/\s-]+?(?=[),.;]|$)/gi, '')
            .replace(/,?\s*\bNLW\s*MS\s*[A-Z0-9-]+/gi, '')
            .replace(/,?\s*\bMS\s+(?:Lat\.?|Nouvelle\s+acquisition\s+latine)\s*[0-9/\s]+/gi, '')
            .replace(
              /\s*\((?:[^()]*(?:Imperial War Museum|Bundesarchiv|Wellcome|The National Archives|National Archives,\s*Kew|Public Domain|Crown Copyright|WO\s*\d+|National Library of Wales|British Library|Bibliothèque|Presidential Library)[^()]*)\)/gi,
              '',
            )
            .replace(
              /\s*\/\s*(?:Wellcome Collection|Public Domain|Crown Copyright|Imperial War Museum|[A-Z][A-Za-z\s]+Presidential Library(?:\s+and\s+Museum)?)/gi,
              '',
            )
            .replace(/\(\s*[,;/]?\s*\)/g, '')
            .replace(/\(\s*,\s*/g, '(')
            .replace(/,\s*\)/g, ')')
            .replace(/\s+/g, ' ')
            .trim();

        const isPureArchiveCredit = (s) =>
          /^(?:Bundesarchiv\b|Imperial War Museum\b|The National Archives\b|The Wellcome Collection\b|Münchner Stadtmuseum\b|Austrian National Library\b|Politisches Archiv\b|Library of Congress\b|National Archives\b|USHMM\b|Yad Vashem\b)/i.test(
            s,
          ) || /\bBundesarchiv\s+(?:Bild|R\s*\d)/i.test(s);

        const titleClean = stripSourceNoise(
          stim.title || stim.label || fallbackTitle || '',
        );
        let provClean = stripSourceNoise(
          stim.provenance || stim.attribution || stim.citation || '',
        );
        if (isPureArchiveCredit(provClean)) provClean = '';

        const rawCap = stripSourceNoise(stim.caption || '');
        let capSent = '';
        if (rawCap) {
          const sentMatch = rawCap.match(
            /^((?:.*?(?:Dr|Mr|Mrs|Ms|St|Gen|Col|Capt|Prof|Rev|Vol|No|c|p|pp|[A-Z])\.\s+)*?[^.!?]{35,}?[.!?])(?:\s+|$)/,
          );
          capSent = (sentMatch ? sentMatch[1] : rawCap).trim();
          if (capSent.length > 225) {
            capSent = capSent.replace(
              /,\s*(?:clearly revealing|with Middle Welsh|mapping dozens|illustrating specialized|classifying medicinal)[\s\S]*$/,
              '.',
            );
          }
        }

        const hasTxt = Boolean(String(stim.content || stim.text || stim.extract || '').trim());
        const hasImg = Boolean(stim.image || stim.src || stim.image_url || stim.asset_path);

        // Written extract accompanied by an author/subject portrait: keep the written document attribution
        if (
          hasTxt &&
          hasImg &&
          titleClean &&
          /\b(photograph|portrait|seated|standing|pictured|robes|booking|camera)\b/i.test(capSent) &&
          !/\b(photograph|photo|postcard|poster|cartoon)\b/i.test(titleClean)
        ) {
          return titleClean;
        }

        // Visual-only primary source: promote first sentence of historical caption directly into Edexcel header
        if (!hasTxt && hasImg) {
          return capSent || titleClean || provClean || 'Contemporary Visual Source';
        }

        // Written source where caption carries fuller Edexcel NOP attribution (author/venue/context)
        if (
          capSent &&
          capSent.length > titleClean.length + 12 &&
          (!/^From\b/i.test(titleClean) || /\bby\b/i.test(capSent))
        ) {
          const yrMatch = (titleClean + ' ' + provClean).match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
          if (yrMatch && !/\b(1[0-9]{3}|20[0-2][0-9])\b/.test(capSent)) {
            return capSent.replace(/\.?$/, ` (${yrMatch[1]}).`);
          }
          return capSent;
        }

        if (
          titleClean &&
          provClean &&
          provClean.length < 75 &&
          !/^from\b/i.test(provClean) &&
          !provClean.toLowerCase().includes(titleClean.toLowerCase().slice(0, 22)) &&
          !titleClean.toLowerCase().includes(provClean.toLowerCase().slice(0, 22))
        ) {
          return `${titleClean} (${provClean.replace(/\.$/, '')})`;
        }

        return titleClean || provClean || capSent || 'Contemporary Primary Source';
      };

export const isVocabTermPresentInStimulus = (term, stimHtmlBlob) => {
        if (!term || !stimHtmlBlob) return false;
        const norm = (str) =>
          String(str || '')
            .replace(/<[^>]+>/g, ' ')
            .toLowerCase()
            .replace(/[’‘]/g, "'")
            .replace(/\s+/g, ' ')
            .trim();
        const blob = norm(stimHtmlBlob);
        if (!blob) return false;

        // If term carries an explicit acronym in parentheses like "(DAP)" or "(SA)" or "(PLO)",
        // check if that exact acronym is absent while a longer compound (like NSDAP) is present.
        const parenMatch = String(term).match(/\(([A-Z]{2,6})\)/);
        const coreTerm = norm(String(term).replace(/\s*\([^)]*\)\s*/g, ' '));
        if (parenMatch) {
          const acr = parenMatch[1].toLowerCase();
          const acrRegex = new RegExp(`\\b${acr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (acrRegex.test(blob)) return true;
          // Guard against "German Workers' Party (DAP)" falsely matching "...National Socialist German Workers' Party (NSDAP)"
          if (acr === 'dap' && /\bnsdap\b/i.test(blob)) return false;
        }

        if (coreTerm.length >= 4 && blob.includes(coreTerm)) return true;

        // Check distinctive multi-character proper nouns (e.g. "Hofbräuhaus" in "Hofbräuhaus rally")
        const genericStop = new Set([
          'german',
          'germany',
          'british',
          'britain',
          'american',
          'america',
          'party',
          'workers',
          'national',
          'socialist',
          'treaty',
          'government',
          'minister',
          'president',
          'chancellor',
          'general',
          'rally',
          'march',
          'crisis',
          'policy',
          'programme',
          'program',
          'act',
          'law',
          'plan',
          'doctrine',
          'munich',
          'berlin',
          'london',
          'washington',
          'soviet',
          'western',
          'front',
          'medical',
          'battle',
          'public',
          'church',
          'league',
          'council',
          'committee',
        ]);
        const tokens = coreTerm
          .split(/[\s/-]+/)
          .map((t) => t.replace(/^[^a-z0-9äöüß]+|[^a-z0-9äöüß]+$/gi, ''))
          .filter((t) => t.length >= 6 && !genericStop.has(t));

        if (tokens.length > 0 && tokens.every((tok) => blob.includes(tok))) {
          return true;
        }
        return false;
      };
export const escStimAttr = (val) =>
        String(val || '')
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

export const renderSingleStimulus = (stim, sIdx, uidSuffix = '') => {
        let stimTitle = '';
        let stimContent = '';
        if (typeof stim === 'string') {
          const parts = stim.split('**:');
          if (parts.length > 1) {
            stimTitle = parts[0].replace(/\*\*/g, '').trim();
            stimContent = parts.slice(1).join('**:').trim();
          } else {
            stimTitle = `Interpretation ${sIdx + 1}`;
            stimContent = stim;
          }
        } else if (stim && typeof stim === 'object') {
          stimTitle =
            stim.title || stim.label || stim.id || `Source ${String.fromCharCode(65 + sIdx)}`;
          stimContent = stim.content || stim.text || stim.extract || '';
        }

        const isInterp = Boolean(
          (typeof stim === 'object' && stim?.isInterp) ||
            /Interpretation\s+([0-9]+)/i.test(stimTitle) ||
            (typeof stim === 'object' && /^interp[_-\s]*[0-9]+$/i.test(String(stim?.id || ''))),
        );
        const interpMatch =
          stimTitle.match(/Interpretation\s+([0-9]+)/i) ||
          String((typeof stim === 'object' && stim?.id) || '').match(/interp[_-\s]*([0-9]+)/i);
        const interpNum =
          (typeof stim === 'object' && stim?.interpNum) ||
          (interpMatch ? interpMatch[1] : `${sIdx + 1}`);

        const srcMatch =
          stimTitle.match(/Source\s+([A-Z0-9]+)/i) ||
          String((typeof stim === 'object' && stim?.id) || '').match(/^source[_-\s]*([A-Z0-9]+)$/i);
        const srcLetter =
          (typeof stim === 'object' && stim?.letter
            ? String(stim.letter).trim().toUpperCase()
            : '') || (srcMatch ? srcMatch[1].toUpperCase() : String.fromCharCode(65 + sIdx));

        if (isInterp) {
          const cleanInterpTitle = stimTitle
            .replace(/^Interpretation\s+[0-9]+[:\s-]*/i, '')
            .replace(/^interp[_-\s]*[0-9]+[:\s-]*/i, '')
            .replace(/^\(([^)]+)\)[:\s-]*/i, '$1')
            .replace(/:$/, '')
            .trim();
          const rawInterpProv =
            typeof stim === 'object' && stim !== null
              ? String(stim.provenance || stim.attribution || stim.citation || '')
                  .replace(/^Interpretation\s+[0-9]+[:\s-]*/i, '')
                  .trim()
              : '';
          const interpHeaderText =
            rawInterpProv && cleanInterpTitle
              ? rawInterpProv.toLowerCase().includes(cleanInterpTitle.toLowerCase())
                ? rawInterpProv
                : cleanInterpTitle.toLowerCase().includes(rawInterpProv.toLowerCase())
                  ? cleanInterpTitle
                  : `${cleanInterpTitle} — ${rawInterpProv}`
              : rawInterpProv || cleanInterpTitle || 'Historical Interpretation';

          const interpCardId = uidSuffix
            ? `interpretation-card-${interpNum}-${uidSuffix}`
            : `interpretation-card-${interpNum}`;
          const hasReadableInterp = Boolean(String(stimContent || '').trim());
          const inlineAudioHtml = hasReadableInterp
            ? renderAudioPlaybackBar('Listen', 'source-audio-bar flat-inline-audio')
            : '';

          const interpStudioAttr =
            typeof stim === 'object' && stim?.studio_audio
              ? ` data-studio-source-audio="${escStimAttr(stim.studio_audio)}" data-studio-voice-label="${escStimAttr(stim.studio_voice_label || 'Studio Historian')}"`
              : '';
          const interpVoicePill =
            typeof stim === 'object' && stim?.studio_audio && stim?.studio_voice_label
              ? `<span class="living-archive-voice-pill" style="font-size: 0.64rem; font-weight: 700; color: #0f766e; background: #f0fdfa; border: 1px solid #99f6e4; padding: 1px 6px; border-radius: 999px; white-space: nowrap; margin-left: 6px;">${escStimAttr(stim.studio_voice_label)}</span>`
              : '';

          return `
            <div class="archival-source-box flat-stimulus-card p3-pane-cell p3-pane-interp" id="${interpCardId}" data-interpretation-num="${interpNum}"${interpStudioAttr}>
              <div class="flat-stimulus-header p3-pane-header">
                <div class="p3-pane-header-left">
                  <span class="p3-pane-badge p3-pane-badge-interp">INTERP ${interpNum}</span>
                  <span class="p3-pane-prov" title="${escStimAttr(interpHeaderText)}">${interpHeaderText}</span>${interpVoicePill}
                </div>
                ${inlineAudioHtml ? `<div class="p3-pane-header-right">${inlineAudioHtml}</div>` : ''}
              </div>
              <div class="p3-pane-body">
                <div class="archival-source-body p3-pane-prose p3-pane-interp-prose">${typeof formatBold !== 'undefined' ? formatBold(stimContent) : stimContent}</div>
              </div>
            </div>
          `;
        } else {
          const cleanSourceTitle = stimTitle
            .replace(/^Source\s+[A-Z0-9]+[:\s-]*/i, '')
            .replace(/^source[_-\s]*[A-Z0-9]+[:\s-]*/i, '')
            .trim();
          const sourceCardId = uidSuffix
            ? `exam-source-card-${srcLetter}-${uidSuffix}`
            : `exam-source-card-${srcLetter}`;
          const stimImg =
            typeof stim === 'object' && stim !== null
              ? stim.image || stim.src || stim.image_url || stim.asset_path || ''
              : '';
          const stimImgUrl = stimImg ? getAssetUrl(stimImg) : '';
          const rawZoomCaption =
            typeof stim === 'object' && stim !== null
              ? String(stim.caption || '')
                  .replace(/^(?:Source\s+[A-Z0-9]+|Interpretation\s+[0-9]+)\s*[:.-]\s*/i, '')
                  .trim()
              : '';
          const stimHeaderText = buildUnifiedEdexcelSourceHeader(stim, cleanSourceTitle);

          const hasWrittenBody = Boolean(String(stimContent || '').trim());
          const hasReadableSource = hasWrittenBody || Boolean(stimHeaderText);
          const inlineAudioHtml = hasReadableSource
            ? renderAudioPlaybackBar('Listen', 'source-audio-bar flat-inline-audio')
            : '';

          const imgAltText =
            (typeof stim === 'object' && stim?.image_alt) ||
            cleanSourceTitle ||
            stimHeaderText ||
            `Source ${srcLetter}`;
          const modalCaption = rawZoomCaption || stimHeaderText || `Source ${srcLetter}`;
          const formattedBodyHtml = hasWrittenBody
            ? typeof formatBold !== 'undefined'
              ? formatBold(stimContent)
              : stimContent
            : '';

          let paneBodyHtml = '';
          if (stimImgUrl && hasWrittenBody) {
            paneBodyHtml = `
              <div class="p3-pane-body p3-pane-media-split">
                <div class="p3-pane-thumb-side" data-action="open-modal" data-src="${stimImgUrl}" data-caption="${escStimAttr(modalCaption)}">
                  <img src="${stimImgUrl}" alt="${escStimAttr(imgAltText)}" class="archival-image" data-action="open-modal" data-src="${stimImgUrl}" data-caption="${escStimAttr(modalCaption)}">
                  <div class="p3-zoom-hint no-print">🔍 Click to enlarge</div>
                </div>
                <div class="archival-source-body p3-pane-prose">${formattedBodyHtml}</div>
              </div>
            `;
          } else if (stimImgUrl) {
            paneBodyHtml = `
              <div class="p3-pane-body p3-pane-img-only" data-action="open-modal" data-src="${stimImgUrl}" data-caption="${escStimAttr(modalCaption)}">
                <img src="${stimImgUrl}" alt="${escStimAttr(imgAltText)}" class="archival-image" data-action="open-modal" data-src="${stimImgUrl}" data-caption="${escStimAttr(modalCaption)}">
                <div class="p3-zoom-hint no-print">🔍 Click to enlarge</div>
              </div>
            `;
          } else {
            paneBodyHtml = `
              <div class="p3-pane-body">
                <div class="archival-source-body p3-pane-prose">${formattedBodyHtml}</div>
              </div>
            `;
          }

          const provSpeechClass = !hasWrittenBody ? ' archival-source-body' : '';
          const paneStudioAttr =
            typeof stim === 'object' && stim?.studio_audio
              ? ` data-studio-source-audio="${escStimAttr(stim.studio_audio)}" data-studio-voice-label="${escStimAttr(stim.studio_voice_label || 'Living Archive')}"`
              : '';
          const paneVoicePill =
            typeof stim === 'object' && stim?.studio_audio && stim?.studio_voice_label
              ? `<span class="living-archive-voice-pill" style="font-size: 0.64rem; font-weight: 700; color: #0f766e; background: #f0fdfa; border: 1px solid #99f6e4; padding: 1px 6px; border-radius: 999px; white-space: nowrap; margin-left: 6px;">${escStimAttr(stim.studio_voice_label)}</span>`
              : '';
          return `
            <div class="archival-source-box flat-stimulus-card p3-pane-cell p3-pane-source" id="${sourceCardId}" data-source-letter="${srcLetter}"${paneStudioAttr}>
              <div class="flat-stimulus-header p3-pane-header">
                <div class="p3-pane-header-left">
                  <span class="p3-pane-badge p3-pane-badge-source">SOURCE ${srcLetter}</span>
                  <span class="p3-pane-prov${provSpeechClass}" title="${escStimAttr(stimHeaderText)}">${stimHeaderText}</span>${paneVoicePill}
                </div>
                ${inlineAudioHtml ? `<div class="p3-pane-header-right">${inlineAudioHtml}</div>` : ''}
              </div>
              ${paneBodyHtml}
            </div>
          `;
        }
      };


export const renderProjectorPane = (stim, idx) => {
        let stimTitle = '';
        let stimContent = '';
        if (typeof stim === 'string') {
          const parts = stim.split('**:');
          if (parts.length > 1) {
            stimTitle = parts[0].replace(/\*\*/g, '').trim();
            stimContent = parts.slice(1).join('**:').trim();
          } else {
            stimTitle = `Interpretation ${idx + 1}`;
            stimContent = stim;
          }
        } else if (stim && typeof stim === 'object') {
          stimTitle =
            stim.title || stim.label || stim.id || `Source ${String.fromCharCode(65 + idx)}`;
          stimContent = stim.content || stim.text || stim.extract || '';
        }

        const isInterp = Boolean(
          (typeof stim === 'object' && stim?.isInterp) ||
            /Interpretation\s+([0-9]+)/i.test(stimTitle) ||
            (typeof stim === 'object' && /^interp[_-\s]*[0-9]+$/i.test(String(stim?.id || ''))),
        );
        const interpMatch =
          stimTitle.match(/Interpretation\s+([0-9]+)/i) ||
          String((typeof stim === 'object' && stim?.id) || '').match(/interp[_-\s]*([0-9]+)/i);
        const interpNum =
          (typeof stim === 'object' && stim?.interpNum) ||
          (interpMatch ? interpMatch[1] : `${idx + 1}`);

        const srcMatch =
          stimTitle.match(/Source\s+([A-Z0-9]+)/i) ||
          String((typeof stim === 'object' && stim?.id) || '').match(/^source[_-\s]*([A-Z0-9]+)$/i);
        const srcLetter =
          (typeof stim === 'object' && stim?.letter
            ? String(stim.letter).trim().toUpperCase()
            : '') || (srcMatch ? srcMatch[1].toUpperCase() : String.fromCharCode(65 + idx));

        if (isInterp) {
          const cleanInterpTitle = stimTitle
            .replace(/^Interpretation\s+[0-9]+[:\s-]*/i, '')
            .replace(/^interp[_-\s]*[0-9]+[:\s-]*/i, '')
            .replace(/^\(([^)]+)\)[:\s-]*/i, '$1')
            .replace(/:$/, '')
            .trim();
          const rawInterpProv =
            typeof stim === 'object' && stim !== null
              ? String(stim.provenance || stim.attribution || stim.citation || '')
                  .replace(/^Interpretation\s+[0-9]+[:\s-]*/i, '')
                  .trim()
              : '';
          const interpHeaderText =
            rawInterpProv && cleanInterpTitle
              ? rawInterpProv.toLowerCase().includes(cleanInterpTitle.toLowerCase())
                ? rawInterpProv
                : cleanInterpTitle.toLowerCase().includes(rawInterpProv.toLowerCase())
                  ? cleanInterpTitle
                  : `${cleanInterpTitle} — ${rawInterpProv}`
              : rawInterpProv || cleanInterpTitle || 'Historical Interpretation';

          const bodyHtml = typeof formatBold !== 'undefined' ? formatBold(stimContent) : stimContent;
          return `
            <div class="proj-pane proj-pane-interp">
              <div class="proj-pane-header">
                <span class="proj-badge proj-badge-interp">INTERP ${interpNum}</span>
                <span class="proj-prov">${interpHeaderText}</span>
              </div>
              <div class="proj-pane-body">${bodyHtml}</div>
            </div>
          `;
        }

        const cleanSourceTitle = stimTitle
          .replace(/^Source\s+[A-Z0-9]+[:\s-]*/i, '')
          .replace(/^source[_-\s]*[A-Z0-9]+[:\s-]*/i, '')
          .trim();
        const stimHeaderText = buildUnifiedEdexcelSourceHeader(stim, cleanSourceTitle);

        const imgRaw =
          typeof stim === 'object' && stim !== null
            ? stim.image || stim.src || stim.image_url || stim.asset_path || ''
            : '';
        const imgUrl = imgRaw ? getAssetUrl(imgRaw) : '';
        const hasProse = Boolean(String(stimContent || '').trim());
        const proseText = hasProse
          ? typeof formatBold !== 'undefined'
            ? formatBold(stimContent)
            : stimContent
          : '';

        let bodyInner = '';
        if (imgUrl && proseText) {
          bodyInner = `
            <div class="proj-pane-media">
              <img src="${imgUrl}" alt="${escStimAttr(stimHeaderText)}">
              <div>${proseText}</div>
            </div>
          `;
        } else if (imgUrl) {
          bodyInner = `
            <div style="text-align: center;">
              <img src="${imgUrl}" alt="${escStimAttr(stimHeaderText)}" style="max-height: 190px; max-width: 100%; object-fit: contain; border-radius: 6px; border: 1px solid #cbd5e1;">
            </div>
          `;
        } else {
          bodyInner = proseText;
        }

        return `
          <div class="proj-pane proj-pane-source">
            <div class="proj-pane-header">
              <span class="proj-badge proj-badge-source">SOURCE ${srcLetter}</span>
              <span class="proj-prov">${stimHeaderText}</span>
            </div>
            <div class="proj-pane-body">${bodyInner}</div>
          </div>
        `;
      };


export function initLessonTripMap(lesson) {
    // Initialize Trip Map
    const mapContainer = document.getElementById('trip-map-container');
    if (mapContainer && window.L && lesson.do_now && lesson.do_now.type === 'timeline') {
      const eventsWithLoc = lesson.do_now.events.filter((e) => e.lat && e.lng);
      if (eventsWithLoc.length > 0) {
        if (window.tripMapInstance) {
          window.tripMapInstance.remove();
        }
        const map = L.map('trip-map-container');
        window.tripMapInstance = map;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const markers = [];
        eventsWithLoc.forEach((ev) => {
          const marker = L.marker([ev.lat, ev.lng]).addTo(map);
          let popupContent = `<strong>${ev.year} - ${ev.title}</strong><br>${ev.detail}`;

          if (appStore.state.activeUnitData.local_heroes) {
            const heroes = appStore.state.activeUnitData.local_heroes.filter((h) => {
              const loc = (h.visiting_location || h.memorial || h.cemetery || '').toLowerCase();
              const titleLower = (ev.title || '').toLowerCase();
              const detailLower = (ev.detail || '').toLowerCase();
              if (!loc) return false;
              if (titleLower.includes(loc) || detailLower.includes(loc)) return true;
              if (
                loc.includes('menin gate') &&
                (titleLower.includes('menin gate') || detailLower.includes('menin gate'))
              )
                return true;
              if (
                loc.includes('tyne cot') &&
                (titleLower.includes('tyne cot') || detailLower.includes('tyne cot'))
              )
                return true;
              return false;
            });
            if (heroes.length > 0) {
              popupContent += `<div style="margin-top: 15px; border: 2px solid #ef4444; border-radius: 8px; padding: 10px; background: #fef2f2;">
                  <h4 style="margin: 0 0 5px 0; color: #991b1b;"><i class="fa-solid fa-ribbon"></i> Local Connection</h4>`;
              heroes.forEach((h) => {
                popupContent += `<p style="margin: 0 0 5px 0; font-size: 0.9em; color: #7f1d1d;"><strong>${h.name}</strong> (${h.age}) - ${h.regiment}<br><em>${h.connection}</em><br>${h.story}</p>`;
              });
              popupContent += `</div>`;
            }
          }

          if (ev.youtube_id) {
            popupContent += `<div style="margin-top: 10px;"><button class="btn btn-secondary" data-action="open-video-modal" data-youtube="${ev.youtube_id}" style="width:100%; padding: 8px;"><i class="fa-brands fa-youtube" style="color:#ef4444; margin-right:5px;"></i> Play Video</button></div>`;
          }
          marker.bindPopup(popupContent, { minWidth: 250 });
          markers.push(marker);
        });

        if (markers.length > 0) {
          const group = new L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.2));

          // Draw Polyline connecting pins if not a local hero lesson
          if (!lesson.id || !lesson.id.startsWith('hero_')) {
            const latlngs = eventsWithLoc.map((ev) => [ev.lat, ev.lng]);
            L.polyline(latlngs, {
              color: '#ef4444',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 10',
              lineJoin: 'round',
            }).addTo(map);
          }
        }

        setTimeout(() => {
          if (window.tripMapInstance) {
            window.tripMapInstance.invalidateSize();
          }
        }, 200);
      }
    }

}
