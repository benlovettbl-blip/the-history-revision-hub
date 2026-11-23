#!/usr/bin/env node
/**
 * Unified Studio Audio & Visual Story Sheet Hash Engine (`sync_unit_studio_media.mjs`)
 *
 * Sustainable 1-Engine Synchronizer for The History Revision Hub:
 *  1. Compiles 1-Page Visual Story Sheets (`lesson.visual_story_sheet`) directly from
 *     canonical `data/<unit_id>.json` -> `public/units/<unit_id>/visual_sheets/*.html`,
 *     `units/<unit_id>/visual_sheets/*.html`, and `public/data/infographics_manifest.json`.
 *  2. Verifies 100% image existence + `master_rights_database.json` provenance +
 *     `paired_prose_hash` co-adaptation between `narrative_blocks` and `visual_story_sheet`.
 *  3. Tracks SHA-256 content hashes in:
 *       - `public/audio/visual_sheets/<unit_id>/audio_hashes.json`
 *       - `public/audio/lessons/<unit_id>/audio_hashes.json`
 *     Only missing or text-modified `.mp3` clips are synthesized (unchanged clips verify
 *     in <0.05s at $0.00 cost!).
 *
 * Usage:
 *   node scripts/sync_unit_studio_media.mjs <unit_id>
 *   node scripts/sync_unit_studio_media.mjs <unit_id> --init-audio
 *   node scripts/sync_unit_studio_media.mjs <unit_id> --force-audio
 *   node scripts/sync_unit_studio_media.mjs <unit_id> --skip-tts
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  UNIT_VOICE_ASSIGNMENTS,
  getUnitVoicePersona,
  resolveGeminiApiKey,
  ensureHouseVoiceId,
} from './studio_voice_registry.mjs';
import { buildUnitLessonTimingsJson } from './extract_audio_timings.mjs';
import { WW1_LIVING_VOICE_UNITS, syncWw1UnitLivingVoices } from './sync_ww1_living_voices.mjs';
import { SHOAH_KS2_LIVING_VOICE_UNITS, syncShoahKs2LivingVoices } from './sync_shoah_ks2_living_voices.mjs';
import { PAPER3_INTERPRETATION_UNITS, syncPaper3InterpretationAudio } from './sync_paper3_interpretation_audio.mjs';
import { KS2_KS3_GUIDED_READING_UNITS, syncGuidedReadingUnits } from './sync_guided_reading_studio_audio.mjs';
import { syncProloguesAndSourcesForUnits } from './sync_all_prologues_and_sources_audio.mjs';
import { expandBritishDatesForSpeech } from './spoken_date_normalizer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function sha256(str) {
  return crypto.createHash('sha256').update(String(str), 'utf8').digest('hex').slice(0, 16);
}

function computeProseHash(proseHtml) {
  const clean = String(proseHtml || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('sha1').update(clean, 'utf8').digest('hex').slice(0, 10);
}

/**
 * Clean a lesson narrative block's raw text/HTML into natural spoken prose that
 * aligns 1-to-1 with what `lesson_renderer.js` + `speech.js` display on screen.
 */
export function cleanNarrativeBlockForTts(rawText) {
  let s = String(rawText || '').trim();
  if (!s) return '';

  // 1. Expand inline dossier pills `[Key Organisation: Irgun]` -> `Irgun`
  s = s.replace(/\[Key\s+[^:\]]+:\s*([^\]]+)\]/gi, '$1');

  // 2. Strip leading paragraph index pill `[1.1]`, turn mid-block `[1.2]` or `<br><br>` into `<short pause>`
  s = s.replace(/^\s*\[\s*\d+(?:\.\d+)?\s*\]\s*/, '');
  s = s.replace(/(?:<br\s*\/?>\s*){2,}|<\/p>\s*<p[^>]*>/gi, ' <short pause> ');
  s = s.replace(/\[\s*\d+(?:\.\d+)?\s*\]/g, ' <short pause> ');

  // 3. Strip Markdown bold/italics & HTML tags while preserving entities cleanly
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
  s = s.replace(/\*([^*]+)\*/g, '$1');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—');

  // 4. Expand British dates ("On 1 July 1916" -> "On the first of July 1916") & collapse whitespace
  s = expandBritishDatesForSpeech(s);
  s = s.replace(/\s+/g, ' ').trim();
  s = s.replace(/(?:<short pause>\s*){2,}/g, '<short pause> ');
  return s;
}

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderCardVisual(card) {
  if (card.mode === 'split-bar' && card.splitConfig) {
    const sc = card.splitConfig;
    return `
          <div class="card-visual partition-visual">
            <img src="${card.img}" alt="${escHtml(card.heading)}" />
            <div class="partition-bars">
              <div class="p-bar-title">${sc.barTitle}</div>
              <div class="split-track">
                <div class="split-jewish" style="width:${sc.leftWidth}%;">${escHtml(sc.leftLabel)}</div>
                <div class="split-arab" style="width:${sc.rightWidth}%;">${escHtml(sc.rightLabel)}</div>
              </div>
              <div class="p-legend">
                ${sc.bullets.map((b) => `• ${b}`).join('<br/>')}
              </div>
            </div>
          </div>`;
  }

  if (card.mode === 'contain-light') {
    return `
          <div class="card-visual light-matte">
            <img class="archival-contain" src="${card.img}" alt="${escHtml(card.heading)}" />
          </div>`;
  }

  if (card.mode === 'contain') {
    return `
          <div class="card-visual">
            <img class="bg-blur" src="${card.img}" alt="" aria-hidden="true" />
            <img class="archival-contain" src="${card.img}" alt="${escHtml(card.heading)}" />
          </div>`;
  }

  const extraBg = card.mode === 'landscape-light' ? ' style="background:#f8fafc;"' : '';
  const posStyle = card.pos ? ` style="object-position: ${card.pos};"` : '';
  return `
          <div class="card-visual"${extraBg}>
            <img class="archival-landscape" src="${card.img}"${posStyle} alt="${escHtml(card.heading)}" />
          </div>`;
}

function renderCard(card, idx, colorClass) {
  const badgeCls = card.isOutcome || colorClass === 'card-outcome' ? 'step-badge outcome-badge' : 'step-badge';
  return `
        <article class="story-card ${colorClass}" id="card-${idx}" onclick="jumpToStage(${idx})">
          <div class="card-top">
            <div class="card-meta-row">
              <span class="${badgeCls}">${card.badge}</span>
              <div class="card-top-right">
                <span class="step-date">${escHtml(card.date)}</span>
                <button type="button" class="card-speak-btn no-print" onclick="event.stopPropagation(); jumpToStage(${idx});" title="Listen from ${escHtml(card.badge)}">🔊</button>
              </div>
            </div>
            <h2 class="step-heading">${escHtml(card.heading)}</h2>
          </div>${renderCardVisual(card)}
          <div class="stat-strip">
            <span class="stat-dot"></span>
            <span>${escHtml(card.stat)}</span>
          </div>
          <div class="card-body">
            <p class="story-text">${card.html}</p>
          </div>
        </article>`;
}

function formatBridgeHtml(label) {
  const words = String(label || '').trim().split(/\s+/);
  if (words.length === 2) return `${escHtml(words[0])}<br/>${escHtml(words[1])}`;
  if (words.length >= 3) {
    const mid = Math.ceil(words.length / 2);
    return `${escHtml(words.slice(0, mid).join(' '))}<br/>${escHtml(words.slice(mid).join(' '))}`;
  }
  return escHtml(label);
}

function renderVisualStorySheetHtml(unitId, courseFooterTitle, sheet) {
  const prefix = `l${sheet.num}`;
  const c = sheet.cards;
  const b = sheet.bridges;
  const audioBase = `/audio/visual_sheets/${unitId}`;
  const isFourCard = c.length === 4;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(sheet.ktBadge)}: ${escHtml(sheet.title)} | The History Revision Hub</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&family=Lora:ital,wght@0,700;1,600&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 landscape; margin: 0; }
    :root { --paper: #fcfbf7; --ink: #0f172a; --muted: #475569; --border: #cbd5e1; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: #0b1120;
      color: var(--ink);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      width: 100vw; height: 100vh; overflow: hidden;
      display: flex; align-items: center; justify-content: center; padding: 0;
    }
    .mat-container {
      width: 1123px; height: 794px; flex-shrink: 0;
      transform-origin: center center;
      background: var(--paper); border-radius: 10px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
      padding: 12px 18px 10px;
      display: flex; flex-direction: column; justify-content: space-between;
      gap: 6px; position: relative; overflow: hidden; border: 2px solid #e2e8f0;
    }
    .sheet-header {
      display: flex; align-items: center; justify-content: space-between; gap: 14px;
      background: #0f172a; color: #ffffff; padding: 8px 15px;
      border-radius: 8px; border-bottom: 4px solid #f59e0b; flex-shrink: 0;
    }
    .header-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .eyebrow-row {
      display: flex; align-items: center; gap: 8px;
      font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
    }
    .pill-kt { background: #f59e0b; color: #0f172a; padding: 2px 8px; border-radius: 4px; }
    .pill-dates {
      background: rgba(56, 189, 248, 0.2); color: #7dd3fc;
      border: 1px solid rgba(125, 211, 252, 0.4); padding: 2px 8px; border-radius: 4px;
    }
    .eyebrow-brand { color: #cbd5e1; font-weight: 700; }
    .sheet-title {
      font-family: 'Lora', Georgia, serif; font-size: 19.5px; font-weight: 700;
      line-height: 1.18; color: #ffffff;
    }
    .header-actions { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
    .action-btn {
      border: 1px solid rgba(255, 255, 255, 0.25); background: #1e293b; color: #f8fafc;
      font-family: inherit; font-size: 11.5px; font-weight: 800; padding: 6px 12px;
      border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.15s ease;
    }
    .action-btn:hover { background: #0284c7; border-color: #7dd3fc; }
    .action-btn.primary-listen { background: linear-gradient(135deg, #0284c7, #2563eb); border-color: #7dd3fc; }
    .action-btn.speaking { background: #d97706; border-color: #fde68a; color: #ffffff; }
    .action-btn.stop-btn {
      background: rgba(239, 68, 68, 0.2); border-color: rgba(248, 113, 113, 0.5);
      color: #fca5a5; padding: 6px 9px; display: none;
    }
    .story-rows {
      flex: 1; min-height: 0; display: flex; flex-direction: column;
      justify-content: space-between; gap: 0;
    }
    .story-row {
      flex: 1; min-height: 0; display: grid;
      grid-template-columns: 1fr 72px 1fr 72px 1fr; align-items: stretch;
    }
    .arrow-col {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 4px; padding: 0 2px;
    }
    .arrow-pill {
      font-size: 8.3px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.03em;
      color: #0f172a; background: #e2e8f0; border: 1.5px solid #94a3b8;
      padding: 3px 5px; border-radius: 5px; text-align: center; line-height: 1.15;
      transition: all 0.2s ease;
    }
    .arrow-pill.active-bridge, .row-turn-badge.active-bridge {
      background: #f59e0b !important; color: #0f172a !important;
      border-color: #b45309 !important; transform: scale(1.07);
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.28);
    }
    .arrow-svg { width: 28px; height: 18px; }
    .row-turn-connector {
      height: 22px; flex: 0 0 22px; position: relative;
      display: flex; align-items: center; justify-content: center;
    }
    .row-turn-svg { width: 100%; height: 22px; display: block; }
    .row-turn-badge {
      position: absolute; background: #fef3c7; color: #92400e; border: 1.5px solid #d97706;
      font-size: 8.8px; font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase;
      padding: 1.5px 10px; border-radius: 999px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08); transition: all 0.2s ease;
    }
    .story-card {
      background: #ffffff; border: 2px solid #cbd5e1; border-top-width: 5px;
      border-radius: 9px; display: flex; flex-direction: column; overflow: hidden;
      cursor: pointer; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
      transition: box-shadow 0.18s ease, outline 0.18s ease, border-color 0.18s ease;
    }
    .story-card:hover { border-color: #94a3b8; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1); }
    .story-card.active-reading, .takeaway-box.active-reading {
      outline: 3.5px solid #f59e0b; box-shadow: 0 0 0 5px rgba(245, 158, 11, 0.25);
    }
    .card-c1 { border-top-color: #0284c7; --accent: #0369a1; --accent-soft: #e0f2fe; }
    .card-c2 { border-top-color: #d97706; --accent: #b45309; --accent-soft: #fef3c7; }
    .card-c3 { border-top-color: #dc2626; --accent: #b91c1c; --accent-soft: #fee2e2; }
    .card-c4 { border-top-color: #7c3aed; --accent: #6d28d9; --accent-soft: #ede9fe; }
    .card-c5 { border-top-color: #0d9488; --accent: #0f766e; --accent-soft: #ccfbf1; }
    .card-outcome {
      border-color: #1e3a8a; border-top-width: 5px; border-top-color: #1e3a8a;
      background: #f8fafc; --accent: #1e3a8a; --accent-soft: #dbeafe;
    }
    .card-top {
      display: flex; flex-direction: column; gap: 3px; padding: 5px 9px 5px;
      background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
    }
    .card-outcome .card-top { background: #eff6ff; border-bottom-color: #bfdbfe; }
    .card-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
    .step-badge {
      height: 18px; padding: 0 6px; border-radius: 4px; background: var(--accent); color: #ffffff;
      font-size: 9.2px; font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase;
      display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .step-badge.outcome-badge { background: #1e3a8a; color: #fde68a; }
    .card-top-right { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
    .step-date {
      font-size: 9.4px; font-weight: 800; background: var(--accent-soft); color: var(--accent);
      padding: 1.5px 7px; border-radius: 999px; white-space: nowrap;
    }
    .card-speak-btn {
      width: 19px; height: 19px; border-radius: 4px; border: 1px solid #cbd5e1;
      background: #ffffff; color: #334155; font-size: 10px; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s ease;
    }
    .card-speak-btn:hover, .card-speak-btn.playing {
      background: #f59e0b; border-color: #d97706; color: #0f172a;
    }
    .step-heading {
      font-size: 12.6px; font-weight: 900; color: #0f172a; line-height: 1.18; white-space: nowrap;
    }
    .card-visual {
      height: 112px; background: #0f172a; position: relative; overflow: hidden;
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    }
    .card-visual.light-matte { background: #f8fafc; padding: 3px; }
    .card-visual .bg-blur {
      position: absolute; inset: -12px; width: calc(100% + 24px); height: calc(100% + 24px);
      object-fit: cover; filter: blur(10px) brightness(0.42); pointer-events: none;
    }
    .card-visual img.archival-contain {
      position: relative; z-index: 1; max-width: 100%; max-height: 100%;
      width: auto; height: 100%; object-fit: contain; display: block;
    }
    .card-visual img.archival-landscape {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
    .stat-strip {
      background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #e2e8f0;
      color: #0f172a; font-size: 9.6px; font-weight: 800; padding: 2.5px 9px;
      display: flex; align-items: center; gap: 5px; flex-shrink: 0; letter-spacing: 0.01em;
      white-space: nowrap; overflow: hidden;
    }
    .stat-dot { width: 6.5px; height: 6.5px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
    .partition-visual {
      background: #f8fafc; display: grid; grid-template-columns: 82px 1fr;
      align-items: center; padding: 4px 8px; gap: 8px;
    }
    .partition-visual img {
      width: 78px; height: 104px; object-fit: contain; background: #ffffff;
      border: 1px solid #cbd5e1; border-radius: 4px;
    }
    .partition-bars { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .p-bar-title { font-size: 8.8px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #0f766e; }
    .split-track {
      display: flex; height: 21px; border-radius: 5px; overflow: hidden;
      border: 1.5px solid #0f172a; font-size: 9.2px; font-weight: 900; white-space: nowrap;
    }
    .split-jewish {
      background: #ea580c; color: #ffffff; display: flex; align-items: center; justify-content: center; padding: 0 3px;
    }
    .split-arab {
      background: repeating-linear-gradient(-45deg, #fef08a, #fef08a 5px, #fde047 5px, #fde047 10px);
      color: #0f172a; display: flex; align-items: center; justify-content: center;
      border-left: 1.5px solid #0f172a; padding: 0 3px;
    }
    .p-legend { font-size: 9.3px; line-height: 1.24; color: #1e293b; font-weight: 600; }
    .card-body { padding: 6px 9px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .story-text { font-size: 11.7px; line-height: 1.35; color: #1e293b; font-weight: 500; }
    .story-text strong {
      color: #0f172a; font-weight: 800; background: #fef9c3; padding: 0 1.5px; border-radius: 2px;
    }
    .bottom-strip { display: grid; grid-template-columns: 1.12fr 1.38fr; gap: 12px; flex-shrink: 0; }
    .takeaway-box {
      background: #eff6ff; border: 2px solid #1e3a8a; border-left-width: 6px; border-radius: 8px;
      padding: 6px 11px; display: flex; flex-direction: column; justify-content: center; gap: 2px;
      cursor: pointer; transition: outline 0.18s ease, box-shadow 0.18s ease;
    }
    .strip-label { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; color: #1e3a8a; }
    .takeaway-text { font-size: 11.6px; line-height: 1.32; font-weight: 700; color: #0f172a; }
    .vocab-box {
      background: #ffffff; border: 2px solid #cbd5e1; border-radius: 8px; padding: 6px 10px;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; align-items: center;
    }
    .vocab-item { border-left: 3px solid #f59e0b; padding-left: 7px; font-size: 10.3px; line-height: 1.24; color: #334155; }
    .vocab-item strong { display: block; font-size: 11px; font-weight: 900; color: #0f172a; margin-bottom: 1px; }
    .sheet-footer {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 8.6px; color: #64748b; font-weight: 600; padding: 0 2px; flex-shrink: 0;
    }
    @media print {
      html, body { background: #ffffff; width: auto; height: auto; overflow: visible; padding: 0; display: block; }
      .mat-container {
        transform: none !important; box-shadow: none; border: none; border-radius: 0;
        background: #ffffff; width: 297mm; height: 210mm;
      }
      .sheet-header {
        background: #ffffff !important; color: #0f172a !important;
        border: 2px solid #0f172a !important; border-bottom: 4px solid #0f172a !important;
      }
      .sheet-title { color: #0f172a !important; }
      .pill-dates { background: #f1f5f9 !important; color: #0f172a !important; border-color: #64748b !important; }
      .eyebrow-brand { color: #334155 !important; }
      .card-visual { background: #f1f5f9 !important; }
      .card-visual .bg-blur { display: none !important; }
      .story-text strong { background: none !important; text-decoration: underline; text-decoration-thickness: 1.5px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body data-self-fit="true">
  <main class="mat-container" id="visual-story-sheet">
    <header class="sheet-header">
      <div class="header-left">
        <div class="eyebrow-row">
          <span class="pill-kt">${escHtml(sheet.ktBadge)}</span>
          <span class="pill-dates">${escHtml(sheet.datesBadge)}</span>
          <span class="eyebrow-brand">1-Page Visual Story Sheet • Tap Any Stage to Listen</span>
        </div>
        <h1 class="sheet-title" style="font-size:${
          String(sheet.title || '').length <= 62
            ? '19.5px'
            : String(sheet.title || '').length <= 76
              ? '17.2px'
              : String(sheet.title || '').length <= 90
                ? '15.4px'
                : '14.1px'
        };">${escHtml(sheet.title)}</h1>
      </div>
      <div class="header-actions no-print">
        <button type="button" class="action-btn primary-listen" id="btn-read-aloud" onclick="toggleFullStoryAudio()">
          <span id="read-icon">🎙️</span> <span id="read-label">Listen to Story</span>
        </button>
        <button type="button" class="action-btn stop-btn" id="btn-stop-aloud" onclick="stopAllAudio()" title="Stop Narration">
          ⏹️
        </button>
        <button type="button" class="action-btn" onclick="window.print()">
          🖨️ Print 1-Page A4
        </button>
      </div>
    </header>

    <section class="story-rows" aria-label="${isFourCard ? 'Three lesson stages and final outcome' : 'Five lesson stages and final outcome'}">${
      isFourCard
        ? `
      <style>
        .story-row { grid-template-columns: 1fr 90px 1fr; }
        .card-visual { height: 132px; }
        .step-heading { font-size: 13.8px; }
        .story-text { font-size: 13px; line-height: 1.4; }
        .stat-strip { font-size: 10.4px; padding: 3.5px 11px; }
      </style>
      <div class="story-row">${renderCard(c[0], 0, 'card-c1')}
        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-1">${formatBridgeHtml(b[0])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[1], 1, 'card-c2')}
      </div>

      <div class="row-turn-connector" aria-hidden="true">
        <svg class="row-turn-svg" viewBox="0 0 1087 22" preserveAspectRatio="none">
          <path d="M 830 0 L 830 11 L 256 11 L 256 20" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6 4" />
          <polygon points="256,22 250,15 262,15" fill="#d97706" />
        </svg>
        <span class="row-turn-badge" id="bridge-2">${escHtml(b[1])}</span>
      </div>

      <div class="story-row">${renderCard(c[2], 2, 'card-c3')}
        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-3">${formatBridgeHtml(b[2])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#1e3a8a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[3], 3, 'card-outcome')}
      </div>`
        : `
      <div class="story-row">${renderCard(c[0], 0, 'card-c1')}
        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-1">${formatBridgeHtml(b[0])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[1], 1, 'card-c2')}
        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-2">${formatBridgeHtml(b[1])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[2], 2, 'card-c3')}
      </div>

      <div class="row-turn-connector" aria-hidden="true">
        <svg class="row-turn-svg" viewBox="0 0 1087 22" preserveAspectRatio="none">
          <path d="M 930 0 L 930 11 L 156 11 L 156 20" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6 4" />
          <polygon points="156,22 150,15 162,15" fill="#d97706" />
        </svg>
        <span class="row-turn-badge" id="bridge-3">${escHtml(b[2])}</span>
      </div>

      <div class="story-row">${renderCard(c[3], 3, 'card-c4')}
        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-4">${formatBridgeHtml(b[3])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[4], 4, 'card-c5')}
        <div class="arrow-col" aria-hidden="true">
          <span class="arrow-pill" id="bridge-5">${formatBridgeHtml(b[4])}</span>
          <svg class="arrow-svg" viewBox="0 0 28 18" fill="none"><path d="M2 9h22m0 0l-6-6m6 6l-6 6" stroke="#1e3a8a" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>${renderCard(c[5], 5, 'card-outcome')}
      </div>`
    }
    </section>

    <section class="bottom-strip">
      <div class="takeaway-box" id="takeaway-box" onclick="jumpToStage(${c.length})">
        <span class="strip-label">💡 The Big Story in One Sentence</span>
        <p class="takeaway-text">${escHtml(sheet.takeaway)}</p>
      </div>
      <div class="vocab-box" aria-label="Three key words">
        ${sheet.vocab
          .map(
            (v) => {
              const term = Array.isArray(v) ? v[0] : v.term;
              const def = Array.isArray(v) ? v[1] : v.def || v.desc;
              return `<div class="vocab-item">
          <strong>${escHtml(term)}</strong>
          ${escHtml(def)}
        </div>`;
            },
          )
          .join('\n        ')}
      </div>
    </section>

    <footer class="sheet-footer">
      <span>The History Revision Hub • ${escHtml(courseFooterTitle)} (${escHtml(sheet.ktBadge)})</span>
      <span>Authentic Archival Sources: ${escHtml(sheet.provenanceNote)}</span>
    </footer>
  </main>

  <script>
    function fitSheetToViewport() {
      const sheet = document.getElementById('visual-story-sheet');
      if (!sheet) return;
      const pad = 16;
      const availW = Math.max(320, window.innerWidth - pad);
      const availH = Math.max(240, window.innerHeight - pad);
      const scale = Math.min(availW / 1123, availH / 794, 1.18);
      sheet.style.transform = \`scale(\${scale.toFixed(4)})\`;
    }
    window.addEventListener('resize', fitSheetToViewport);
    window.addEventListener('DOMContentLoaded', fitSheetToViewport);
    fitSheetToViewport();

    const AUDIO_STEPS = [
${
  isFourCard
    ? `      { src: '${audioBase}/${prefix}_s1.mp3', cardId: 'card-0', bridgeId: null, bridgeHoldMs: 0 },
      { src: '${audioBase}/${prefix}_s2.mp3', cardId: 'card-1', bridgeId: 'bridge-1', bridgeHoldMs: 1900 },
      { src: '${audioBase}/${prefix}_s3.mp3', cardId: 'card-2', bridgeId: 'bridge-2', bridgeHoldMs: 2200 },
      { src: '${audioBase}/${prefix}_s4.mp3', cardId: 'card-3', bridgeId: 'bridge-3', bridgeHoldMs: 1900 },
      { src: '${audioBase}/${prefix}_takeaway.mp3', cardId: 'takeaway-box', bridgeId: null, bridgeHoldMs: 0 },`
    : `      { src: '${audioBase}/${prefix}_s1.mp3', cardId: 'card-0', bridgeId: null, bridgeHoldMs: 0 },
      { src: '${audioBase}/${prefix}_s2.mp3', cardId: 'card-1', bridgeId: 'bridge-1', bridgeHoldMs: 1900 },
      { src: '${audioBase}/${prefix}_s3.mp3', cardId: 'card-2', bridgeId: 'bridge-2', bridgeHoldMs: 1900 },
      { src: '${audioBase}/${prefix}_s4.mp3', cardId: 'card-3', bridgeId: 'bridge-3', bridgeHoldMs: 2300 },
      { src: '${audioBase}/${prefix}_s5.mp3', cardId: 'card-4', bridgeId: 'bridge-4', bridgeHoldMs: 2100 },
      { src: '${audioBase}/${prefix}_s6.mp3', cardId: 'card-5', bridgeId: 'bridge-5', bridgeHoldMs: 2100 },
      { src: '${audioBase}/${prefix}_takeaway.mp3', cardId: 'takeaway-box', bridgeId: null, bridgeHoldMs: 0 },`
}
    ];

    const player = new Audio();
    player.preload = 'none';
    let mode = 'idle';
    let currentStepIdx = 0;
    let bridgeTimer = null;

    function clearVisualHighlights() {
      if (bridgeTimer) {
        clearTimeout(bridgeTimer);
        bridgeTimer = null;
      }
      document.querySelectorAll('.story-card, .takeaway-box').forEach((el) => el.classList.remove('active-reading'));
      document.querySelectorAll('.arrow-pill, .row-turn-badge').forEach((el) => el.classList.remove('active-bridge'));
      document.querySelectorAll('.card-speak-btn').forEach((el) => el.classList.remove('playing'));
    }

    function updateHeaderButtons() {
      const btnMain = document.getElementById('btn-read-aloud');
      const icon = document.getElementById('read-icon');
      const label = document.getElementById('read-label');
      const btnStop = document.getElementById('btn-stop-aloud');
      if (!btnMain || !icon || !label || !btnStop) return;

      if (mode === 'playing') {
        btnMain.classList.add('speaking');
        icon.textContent = '⏸️';
        label.textContent = 'Pause Story';
        btnStop.style.display = 'inline-flex';
      } else if (mode === 'paused') {
        btnMain.classList.add('speaking');
        icon.textContent = '▶️';
        label.textContent = 'Resume Story';
        btnStop.style.display = 'inline-flex';
      } else {
        btnMain.classList.remove('speaking');
        icon.textContent = '🎙️';
        label.textContent = 'Listen to Story';
        btnStop.style.display = 'none';
      }
    }

    function applyStepHighlight(idx, skipBridgeLead) {
      clearVisualHighlights();
      const step = AUDIO_STEPS[idx];
      if (!step) return;
      const cardEl = document.getElementById(step.cardId);
      const cardBtns = document.querySelectorAll('.card-speak-btn');
      if (idx < cardBtns.length) cardBtns[idx].classList.add('playing');

      if (!skipBridgeLead && step.bridgeId) {
        const bEl = document.getElementById(step.bridgeId);
        if (bEl) bEl.classList.add('active-bridge');
        bridgeTimer = setTimeout(() => {
          if (bEl) bEl.classList.remove('active-bridge');
          if (cardEl) cardEl.classList.add('active-reading');
        }, step.bridgeHoldMs);
      } else if (cardEl) {
        cardEl.classList.add('active-reading');
      }
    }

    function playStepAt(idx, jumpedDirectly) {
      if (idx < 0 || idx >= AUDIO_STEPS.length) {
        stopAllAudio();
        return;
      }
      currentStepIdx = idx;
      mode = 'playing';
      updateHeaderButtons();
      applyStepHighlight(idx, Boolean(jumpedDirectly));

      player.onended = () => {
        if (mode === 'playing') {
          playStepAt(idx + 1, false);
        }
      };
      player.onerror = () => stopAllAudio();
      player.src = AUDIO_STEPS[idx].src;
      player.play().catch(() => stopAllAudio());
    }

    function jumpToStage(targetIdx) {
      if (mode === 'playing' && currentStepIdx === targetIdx) {
        player.pause();
        mode = 'paused';
        updateHeaderButtons();
        return;
      }
      if (mode === 'paused' && currentStepIdx === targetIdx) {
        mode = 'playing';
        updateHeaderButtons();
        player.play().catch(() => stopAllAudio());
        return;
      }
      playStepAt(targetIdx, true);
    }

    function toggleFullStoryAudio() {
      if (mode === 'playing') {
        player.pause();
        mode = 'paused';
        updateHeaderButtons();
      } else if (mode === 'paused') {
        mode = 'playing';
        updateHeaderButtons();
        player.play().catch(() => stopAllAudio());
      } else {
        playStepAt(0, false);
      }
    }

    function stopAllAudio() {
      player.pause();
      player.currentTime = 0;
      player.onended = null;
      mode = 'idle';
      currentStepIdx = 0;
      clearVisualHighlights();
      updateHeaderButtons();
    }

    window.addEventListener('keydown', (e) => {
      if (mode === 'idle') return;
      if (e.key === ' ') {
        e.preventDefault();
        toggleFullStoryAudio();
      } else if (e.key === 'ArrowDown' || (e.key === 'ArrowRight' && e.altKey)) {
        e.preventDefault();
        playStepAt(Math.min(AUDIO_STEPS.length - 1, currentStepIdx + 1), true);
      } else if (e.key === 'ArrowUp' || (e.key === 'ArrowLeft' && e.altKey)) {
        e.preventDefault();
        playStepAt(Math.max(0, currentStepIdx - 1), true);
      }
    });

    window.addEventListener('beforeunload', stopAllAudio);
  </script>
</body>
</html>
`;
}

export function normalizeCardHtmlForSpeech(rawHtml) {
  const preCleaned = String(rawHtml || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, ' and ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—');

  return expandBritishDatesForSpeech(preCleaned)
    .replace(/\s&\s/g, ' and ')
    .replace(/£(\d+(?:\.\d+)?)bn\b/gi, '$1 billion pounds')
    .replace(/£(\d+(?:\.\d+)?)m\b/gi, '$1 million pounds')
    .replace(/£([\d,]+)/g, '$1 pounds')
    .replace(/\$(\d+(?:\.\d+)?)bn\b/gi, '$1 billion dollars')
    .replace(/\$(\d+(?:\.\d+)?)m\b/gi, '$1 million dollars')
    .replace(/\$([\d,]+)/g, '$1 dollars')
    .replace(/\b(\d+(?:\.\d+)?)bn\b/gi, '$1 billion')
    .replace(/\b(\d+(?:\.\d+)?)m\b/gi, '$1 million')
    .replace(/\b(\d+(?:\.\d+)?)km\b/gi, '$1 kilometres')
    .replace(/(\d+)\s*°C\b/g, '$1 degrees Celsius')
    .replace(/~(?=\d)/g, 'around ')
    .replace(/\bc(\d{3,4})\b/g, 'around $1')
    .replace(/\bWWII\b/g, 'World War Two')
    .replace(/\bWWI\b/g, 'World War One')
    .replace(/[➔→]/g, ', then ')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s*•\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function deriveVerbatimCardSpoken(sheet, card, idx) {
  if (!card.connective && card.spoken && !/<short pause>/i.test(card.spoken)) {
    let spoken = String(card.spoken).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const spTitle = String(sheet.spokenTitle || sheet.title || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (idx === 0 && spTitle && !spoken.toLowerCase().startsWith(spTitle.slice(0, 12).toLowerCase())) {
      spoken = `${spTitle} <short pause> ${spoken}`;
    }
    return expandBritishDatesForSpeech(spoken);
  }
  const rawLead =
    card.connective ||
    (idx === 0
      ? sheet.spokenTitle || sheet.title
      : String(card.spoken || '').split(/<short pause>/i)[0].trim());
  const cleanLead = expandBritishDatesForSpeech(String(rawLead || '').replace(/\s+/g, ' ').trim());
  const body = normalizeCardHtmlForSpeech(card.html);
  return `${cleanLead} <short pause> ${body}`;
}

export function deriveVerbatimTakeawaySpoken(sheet) {
  return `Here is the big story in one sentence. <short pause> ${normalizeCardHtmlForSpeech(sheet.takeaway)}`;
}

function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) {
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function loadRightsRawText() {
  const p = path.join(ROOT, 'scripts', 'master_rights_database.json');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

async function synthesizeStudioMp3(apiKey, voiceId, stylePrompt, text, outMp3Path, modelName) {
  const spokenWithTail = String(text).trim().endsWith('<short pause>')
    ? String(text).trim()
    : `${String(text).trim()} <short pause>`;

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      store: false,
      input: [
        {
          type: 'user_input',
          content: [
            {
              type: 'text',
              text: spokenWithTail,
              annotations: [{ type: 'speech_metadata', style: stylePrompt }],
            },
          ],
        },
      ],
      response_format: { type: 'audio' },
      generation_config: {
        speech_config: [{ voice: voiceId }],
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 220)}`);
  }

  const json = await res.json();
  const audioPart = (json.steps || [])
    .filter((s) => s.type === 'model_output')
    .flatMap((s) => s.content || [])
    .filter((c) => c.type === 'audio')
    .pop();

  if (!audioPart?.data) throw new Error(`No audio data returned for ${path.basename(outMp3Path)}`);

  const tmpWav = `${outMp3Path}.${modelName}.${process.pid}.${Math.random().toString(36).slice(2, 6)}.wav`;
  fs.mkdirSync(path.dirname(outMp3Path), { recursive: true });
  fs.writeFileSync(tmpWav, Buffer.from(audioPart.data, 'base64'));
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      tmpWav,
      '-af',
      'apad=pad_dur=0.25',
      '-codec:a',
      'libmp3lame',
      '-ar',
      '24000',
      '-ac',
      '1',
      '-b:a',
      '36k',
      outMp3Path,
    ],
    { stdio: 'ignore' },
  );
  if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  return fs.statSync(outMp3Path).size;
}

function detectStutterTrimSec(wavPath, expectedText = '') {
  try {
    const res = spawnSync(
      'ffmpeg',
      ['-i', wavPath, '-af', 'silencedetect=noise=-35dB:d=0.14', '-f', 'null', '-'],
      { encoding: 'utf8' },
    );
    const out = `${res.stdout || ''}\n${res.stderr || ''}`;
    let dur = 0;
    const dm = out.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    if (dm) dur = Number(dm[1]) * 3600 + Number(dm[2]) * 60 + Number(dm[3]);
    if (!dur) return null;

    const silences = [];
    let curStart = null;
    for (const line of out.split(/\r?\n/)) {
      const sm = line.match(/silence_start:\s*([\d.]+)/);
      if (sm) curStart = Number(sm[1]);
      const em = line.match(/silence_end:\s*([\d.]+)\s*\|\s*silence_duration:\s*([\d.]+)/);
      if (em && curStart !== null) {
        silences.push({ start: curStart, end: Number(em[1]), dur: Number(em[2]) });
        curStart = null;
      }
    }
    if (curStart !== null && dur > curStart) {
      silences.push({ start: curStart, end: dur, dur: dur - curStart });
    }

    const lastSil = silences[silences.length - 1];
    const trailingSil = lastSil && dur - lastSil.end < 0.08 ? lastSil.dur : 0;
    const speechEnd = lastSil && dur - lastSil.end < 0.08 ? lastSil.start : dur;

    const words = String(expectedText || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\b\d{3},\d{3}\b/g, 'one hundred twenty three thousand four')
      .replace(/\b\d{2},\d{3}\b/g, 'seventy five thousand one')
      .replace(/\b\d{4}s?\b/g, 'nineteen forty five')
      .replace(/\b\d{3}\b/g, 'six oh six')
      .replace(/\b\d{2}\b/g, 'forty five')
      .replace(/\b[A-Z]{3,5}\b/g, 'u s s r')
      .replace(/[^\w\s'-]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (words > 12 && String(expectedText).includes('?') && speechEnd > Math.max(28.5, words * 0.67)) {
      const winMin = words * 0.44;
      const winMax = words * 0.63;
      const cands = silences
        .filter((s) => s.start >= winMin && s.start <= winMax && s.end < speechEnd - 2.0 && s.dur >= 0.5)
        .sort((a, b) => b.dur - a.dur);
      if (cands.length > 0) {
        return Number((cands[0].start + 0.06).toFixed(3));
      }
    }

    for (let i = silences.length - 1; i >= 0; i--) {
      const s = silences[i];
      if (s.end >= speechEnd - 0.04) continue;
      const tailDur = speechEnd - s.end;
      if (s.start > 7.5 && s.dur >= 0.62 && tailDur > 0.04 && tailDur <= 0.85 && trailingSil < 0.35) {
        return Number((s.start + 0.06).toFixed(3));
      }
      break;
    }
  } catch (_) {}
  return null;
}

function encodeWavBufferToMp3(wavBuffer, outMp3Path, expectedText = '') {
  const tmpWav = `${outMp3Path}.batch.${process.pid}.${Math.random().toString(36).slice(2, 7)}.wav`;
  fs.mkdirSync(path.dirname(outMp3Path), { recursive: true });
  fs.writeFileSync(tmpWav, wavBuffer);
  const trimSec = detectStutterTrimSec(tmpWav, expectedText);
  const afFilter = trimSec ? `atrim=0:${trimSec},apad=pad_dur=0.28` : 'apad=pad_dur=0.28';
  execFileSync(
    'ffmpeg',
    ['-y', '-i', tmpWav, '-af', afFilter, '-codec:a', 'libmp3lame', '-ar', '24000', '-ac', '1', '-b:a', '36k', outMp3Path],
    { stdio: 'ignore' },
  );
  if (fs.existsSync(tmpWav)) fs.unlinkSync(tmpWav);
  return fs.statSync(outMp3Path).size;
}

/**
 * Gemini Batch API Synthesizer (50% cost discount + bypasses Tier-1 100-RPD real-time limit).
 * Processes jobs in inline chunks of <= 12 clips so response payloads stay well below 20 MB.
 */
async function runBatchTtsJobs(apiKey, voiceId, persona, jobs) {
  if (jobs.length === 0) return;

  const CHUNK_SIZE = 15;
  const BATCH_CONCURRENCY = 4;
  const chunks = [];
  for (let offset = 0; offset < jobs.length; offset += CHUNK_SIZE) {
    chunks.push(jobs.slice(offset, offset + CHUNK_SIZE));
  }

  let completedTotal = 0;
  let chunkCursor = 0;

  async function processSingleBatchChunk(chunk, chunkNum) {
    console.log(
      `📦 [Batch TTS ${chunkNum}/${chunks.length}] Submitting ${chunk.length} clip(s) at 50% discount via [${persona.label} · ${voiceId}]...`,
    );

    const inlineRequests = chunk.map((job) => {
      const cleanBody = String(job.text)
        .replace(/<short pause>/gi, '<short pause>')
        .replace(/\s+/g, ' ')
        .trim();
      const bodyWithEndPause = cleanBody.endsWith('<short pause>') ? cleanBody : `${cleanBody} <short pause>`;
      return {
        request: {
          contents: [
            {
              role: 'user',
              parts: [{ text: bodyWithEndPause, speech_metadata: { style: persona.style } }],
            },
          ],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceId },
              },
            },
          },
        },
      };
    });

    let batchName = null;
    for (let attempt = 1; attempt <= 5; attempt++) {
      const createRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:batchGenerateContent',
        {
          method: 'POST',
          headers: {
            'x-goog-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            batch: {
              display_name: `hrh-tts-${Date.now()}-${chunkNum}`,
              input_config: {
                requests: { requests: inlineRequests },
              },
            },
          }),
        },
      );

      if (createRes.ok) {
        const created = await createRes.json();
        batchName = created.name;
        break;
      }
      const errBody = (await createRes.text()).slice(0, 300);
      if (attempt === 5) {
        throw new Error(`Batch create failed (${createRes.status}): ${errBody}`);
      }
      console.warn(`   ⚠️  Batch ${chunkNum} create retry (${createRes.status}) in ${attempt * 10}s...`);
      await new Promise((r) => setTimeout(r, attempt * 10000));
    }

    console.log(`   ⏳ Polling ${batchName} (chunk ${chunkNum}/${chunks.length})...`);

    let batchResult = null;
    for (let poll = 1; poll <= 180; poll++) {
      await new Promise((r) => setTimeout(r, 8000));
      let pollRes;
      try {
        pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${batchName}`, {
          headers: { 'x-goog-api-key': apiKey },
        });
      } catch (_) {
        continue;
      }
      if (!pollRes.ok) continue;
      const pollJson = await pollRes.json();
      const state = pollJson.metadata?.state || '';
      if (state === 'BATCH_STATE_SUCCEEDED') {
        batchResult = pollJson;
        break;
      }
      if (state === 'BATCH_STATE_FAILED' || state === 'BATCH_STATE_CANCELLED') {
        throw new Error(`Batch ${batchName} ended in ${state}: ${JSON.stringify(pollJson.error || {})}`);
      }
    }

    if (!batchResult) {
      throw new Error(`Timed out waiting for ${batchName}`);
    }

    const responses =
      batchResult.response?.inlinedResponses?.inlinedResponses ||
      batchResult.response?.inlinedResponses ||
      [];

    responses.forEach((entry, idx) => {
      const job = chunk[idx];
      if (!job) return;
      const b64 = entry?.response?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)
        ?.inlineData?.data;
      if (!b64) {
        throw new Error(`Missing inlineData audio in batch response for ${job.label}`);
      }
      const bytes = encodeWavBufferToMp3(Buffer.from(b64, 'base64'), job.outMp3Path, job.text);
      job.onComplete(bytes);
      completedTotal++;
      console.log(
        `   [${completedTotal}/${jobs.length}] ✓ ${job.label} (${Math.round(bytes / 1024)} KB · batch-50%-off)`,
      );
    });
  }

  async function batchWorker(workerIdx) {
    if (workerIdx > 0) await new Promise((r) => setTimeout(r, workerIdx * 1200));
    while (chunkCursor < chunks.length) {
      const idx = chunkCursor++;
      if (idx >= chunks.length) break;
      await processSingleBatchChunk(chunks[idx], idx + 1);
    }
  }

  const workerCount = Math.min(BATCH_CONCURRENCY, chunks.length);
  await Promise.all(Array.from({ length: workerCount }, (_, i) => batchWorker(i)));
}

async function runDualLaneQueue(apiKey, voiceId, persona, jobs) {
  if (jobs.length === 0) return;

  // Bulk synthesis (>= 4 clips): use Gemini Batch API directly (50% cheaper & bypasses 100-RPD limit!)
  if (jobs.length >= 4) {
    await runBatchTtsJobs(apiKey, voiceId, persona, jobs);
    return;
  }

  // Small delta edit (1–3 clips): try fast synchronous synthesis first, auto-falling back to Batch on 429!
  const fallbackBatchJobs = [];
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    try {
      const bytes = await synthesizeStudioMp3(
        apiKey,
        voiceId,
        persona.style,
        job.text,
        job.outMp3Path,
        'gemini-3.8-flash-lite-tts',
      );
      job.onComplete(bytes);
      console.log(`   [${i + 1}/${jobs.length}] ✓ ${job.label} (${Math.round(bytes / 1024)} KB · realtime)`);
    } catch (err) {
      console.warn(`   🔄 Real-time quota full for ${job.label}; routing to Batch API...`);
      fallbackBatchJobs.push(...jobs.slice(i));
      break;
    }
  }

  if (fallbackBatchJobs.length > 0) {
    await runBatchTtsJobs(apiKey, voiceId, persona, fallbackBatchJobs);
  }
}

function loadHashManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (_) {
    return null;
  }
}

function saveHashManifest(manifestPath, data) {
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function syncSingleUnit(unitId, { initAudio = false, forceAudio = false, skipTts = false } = {}) {
  const unitJsonPath = path.join(ROOT, 'data', `${unitId}.json`);
  if (!fs.existsSync(unitJsonPath)) {
    console.log(`⏭️  [Studio Media Engine] No data/${unitId}.json found — skipping.`);
    return;
  }

  const rawJson = JSON.parse(fs.readFileSync(unitJsonPath, 'utf8'));
  const unitPayload = rawJson.data || rawJson;
  const lessons = Array.isArray(unitPayload.lessons) ? unitPayload.lessons : [];
  const persona = getUnitVoicePersona(unitId);
  const courseFooterTitle = String(unitPayload.title || unitId).replace(/^Paper\s+\d+:\s*/i, '');

  const ttsJobs = [];

  // =========================================================================
  // PART 1: 1-PAGE VISUAL STORY SHEETS (HTML + PROVENANCE + CO-ADAPTATION + AUDIO HASHES)
  // =========================================================================
  const sheetsWithLessons = lessons
    .filter((l) => l && l.visual_story_sheet && Array.isArray(l.visual_story_sheet.cards))
    .map((l) => ({ lesson: l, sheet: l.visual_story_sheet }));

  if (sheetsWithLessons.length > 0) {
    const rightsRaw = loadRightsRawText();
    const pubSheetDir = path.join(ROOT, 'public', 'units', unitId, 'visual_sheets');
    const srcSheetDir = path.join(ROOT, 'units', unitId, 'visual_sheets');
    const sheetAudioDir = path.join(ROOT, 'public', 'audio', 'visual_sheets', unitId);
    const sheetHashPath = path.join(sheetAudioDir, 'audio_hashes.json');

    const isFirstSheetHashInit = !fs.existsSync(sheetHashPath);
    const sheetHashes = loadHashManifest(sheetHashPath) || {
      unitId,
      voiceKey: persona.key,
      clips: {},
    };
    sheetHashes.voiceKey = persona.key;

    let rebuiltHtmlCount = 0;
    let coAdaptWarnings = 0;
    const manifestItems = [];

    for (const { lesson, sheet } of sheetsWithLessons) {
      const nBlocks = Array.isArray(lesson.narrative_blocks) ? lesson.narrative_blocks : [];

      sheet.cards.forEach((card, idx) => {
        if (card.heading.length > 36) {
          throw new Error(
            `[Visual Story Sheet] Heading exceeds 36-char zero-truncation limit in ${unitId}/${lesson.id}: "${card.heading}" (${card.heading.length} chars)`,
          );
        }
        // Verify image exists on disk & is registered in master_rights_database.json
        const diskPath = path.join(ROOT, 'public', card.img.replace(/^\//, ''));
        if (!fs.existsSync(diskPath)) {
          throw new Error(`[Visual Story Sheet] Missing archival image on disk: ${card.img} (${unitId}/${lesson.id})`);
        }
        if (/\.webp$/i.test(card.img)) {
          throw new Error(`[Visual Story Sheet] Retired .webp image detected in ${unitId}/${lesson.id}: ${card.img}`);
        }
        const imgBasename = path.basename(card.img);
        if (rightsRaw && !rightsRaw.includes(imgBasename)) {
          console.warn(
            `⚠️  [Provenance Notice] ${imgBasename} (${unitId}/${lesson.id}) not yet found in master_rights_database.json!`,
          );
        }

        // Co-adaptation check between narrative_blocks[idx] and visual_story_sheet.cards[idx]
        if (idx < nBlocks.length && card.paired_prose_hash) {
          const liveHash = computeProseHash(nBlocks[idx].text || nBlocks[idx].content || '');
          if (liveHash !== card.paired_prose_hash) {
            coAdaptWarnings++;
            console.warn(
              `⚠️  [Co-Adaptation Warning] ${unitId}/${lesson.id} Stage ${idx + 1} narrative prose changed ` +
                `(${card.paired_prose_hash} -> ${liveHash}). Review visual_story_sheet.cards[${idx}] so story card & lesson stay aligned!`,
            );
          }
        }
      });

      const fileName = `lesson_${sheet.num}_visual_story.html`;
      const html = renderVisualStorySheetHtml(unitId, courseFooterTitle, sheet);
      const changedPub = writeIfChanged(path.join(pubSheetDir, fileName), html);
      const changedSrc = writeIfChanged(path.join(srcSheetDir, fileName), html);
      if (changedPub || changedSrc) rebuiltHtmlCount++;

      manifestItems.push({
        unit: unitId,
        lessonId: lesson.id,
        slug: sheet.slug,
        title: `${sheet.title} (${sheet.datesBadge})`,
        topic: sheet.topicLabel,
        type: 'visual_story_sheet',
        aspect: 'landscape',
        image: '',
        thumbUrl: sheet.thumbUrl,
        interactiveUrl: `/units/${unitId}/visual_sheets/${fileName}`,
        keyPoints: sheet.cards.map((c) => `${c.badge} (${c.date}): ${c.heading} — ${c.stat}`),
      });

      // Audio hash checks for the cards (Connective + Word-for-Word Card Text) + 1 takeaway
      const prefix = `l${sheet.num}`;
      const expectedClips = [
        ...sheet.cards.map((c, idx) => ({
          id: `${prefix}_s${idx + 1}`,
          text: deriveVerbatimCardSpoken(sheet, c, idx),
        })),
        {
          id: `${prefix}_takeaway`,
          text: sheet.spokenTakeaway || deriveVerbatimTakeawaySpoken(sheet),
        },
      ];

      for (const clip of expectedClips) {
        const outMp3Path = path.join(sheetAudioDir, `${clip.id}.mp3`);
        const contentHash = sha256(`${persona.key}::${clip.text}`);
        const prevEntry = sheetHashes.clips[clip.id];
        const mp3Exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1500;

        // Preserve unchanged pre-existing Visual Story Sheet MP3s on initial manifest bootstrap
        if (isFirstSheetHashInit && !forceAudio && mp3Exists) {
          sheetHashes.clips[clip.id] = {
            hash: contentHash,
            bytes: fs.statSync(outMp3Path).size,
            updatedAt: new Date().toISOString(),
          };
          continue;
        }

        if (!forceAudio && mp3Exists && prevEntry && prevEntry.hash === contentHash) {
          continue;
        }

        ttsJobs.push({
          label: `visual_sheets/${unitId}/${clip.id}.mp3`,
          text: clip.text,
          outMp3Path,
          onComplete(bytes) {
            sheetHashes.clips[clip.id] = {
              hash: contentHash,
              bytes,
              updatedAt: new Date().toISOString(),
            };
            saveHashManifest(sheetHashPath, sheetHashes);
          },
        });
      }
    }

    saveHashManifest(sheetHashPath, sheetHashes);

    // Sync public/data/infographics_manifest.json
    const infoManifestPath = path.join(ROOT, 'public', 'data', 'infographics_manifest.json');
    if (fs.existsSync(infoManifestPath)) {
      const infoManifest = JSON.parse(fs.readFileSync(infoManifestPath, 'utf8'));
      infoManifest[unitId] = manifestItems;
      writeIfChanged(infoManifestPath, JSON.stringify(infoManifest, null, 2) + '\n');
    }

    console.log(
      `🎨 [Visual Story Sheets · ${unitId}] ${sheetsWithLessons.length} sheets verified ` +
        `(${rebuiltHtmlCount} HTML updated, ${coAdaptWarnings} co-adaptation warnings).`,
    );
  }

  // =========================================================================
  // PART 2: FULL-LESSON NARRATIVE BLOCK STUDIO AUDIO (DELTA HASH TRACKING)
  // =========================================================================
  const lessonAudioDir = path.join(ROOT, 'public', 'audio', 'lessons', unitId);
  const lessonHashPath = path.join(lessonAudioDir, 'audio_hashes.json');
  const existingLessonManifest = loadHashManifest(lessonHashPath);

  const NON_PROSE_BLOCK_TYPES = new Set([
    'interactive_hotspot_map',
    'causal_diagram',
    'interactive_map',
    'photo_slider',
    'flip_card_gallery',
  ]);

  if (existingLessonManifest || initAudio) {
    const lessonHashes = existingLessonManifest || {
      unitId,
      voiceKey: persona.key,
      blocks: {},
    };
    lessonHashes.voiceKey = persona.key;

    let totalProseBlocks = 0;
    let cachedProseBlocks = 0;

    for (const lesson of lessons) {
      const nBlocks = Array.isArray(lesson.narrative_blocks) ? lesson.narrative_blocks : [];
      nBlocks.forEach((block, idx) => {
        if (!block || NON_PROSE_BLOCK_TYPES.has(block.type)) return;
        const spokenText = cleanNarrativeBlockForTts(block.text || block.content || '');
        if (!spokenText || spokenText.length < 15) return;

        totalProseBlocks++;
        const blockKey = `${lesson.id}_b${idx + 1}`;
        const outMp3Path = path.join(lessonAudioDir, `${blockKey}.mp3`);
        const contentHash = sha256(`${persona.key}::${spokenText}`);
        const prev = lessonHashes.blocks[blockKey];
        const mp3Exists = fs.existsSync(outMp3Path) && fs.statSync(outMp3Path).size > 1500;

        if (!forceAudio && mp3Exists && prev && prev.hash === contentHash) {
          cachedProseBlocks++;
          return;
        }

        ttsJobs.push({
          label: `lessons/${unitId}/${blockKey}.mp3`,
          text: spokenText,
          outMp3Path,
          onComplete(bytes) {
            lessonHashes.blocks[blockKey] = {
              hash: contentHash,
              bytes,
              words: spokenText.replace(/<short pause>/g, '').trim().split(/\s+/).length,
              updatedAt: new Date().toISOString(),
            };
            saveHashManifest(lessonHashPath, lessonHashes);
          },
        });
      });
    }

    saveHashManifest(lessonHashPath, lessonHashes);
    console.log(
      `🔊 [Lesson Studio Audio · ${unitId}] ${cachedProseBlocks}/${totalProseBlocks} narrative blocks hash-matched ` +
        `(${totalProseBlocks - cachedProseBlocks} queued for synthesis).`,
    );
  } else {
    console.log(
      `ℹ️  [Lesson Studio Audio · ${unitId}] Not yet enrolled (pass --init-audio when ready to voice ${unitId} lesson narratives).`,
    );
  }

  // =========================================================================
  // PART 3: EXECUTE STUDIO TTS QUEUE + REFRESH ACOUSTIC SENTENCE TIMINGS
  // =========================================================================
  const hasLessonAudio = fs.existsSync(lessonHashPath);

  if (ttsJobs.length === 0) {
    if (hasLessonAudio && ! fs.existsSync(path.join(lessonAudioDir, 'timings.json'))) {
      const alignedCount = buildUnitLessonTimingsJson(ROOT, unitId);
      console.log(`⏱️  [Acoustic Timings · ${unitId}] Generated exact sentence timestamps for ${alignedCount} blocks.`);
    }
    if (WW1_LIVING_VOICE_UNITS.has(unitId)) {
      await syncWw1UnitLivingVoices(unitId, { forceAudio, skipTts });
    } else {
      if (SHOAH_KS2_LIVING_VOICE_UNITS.has(unitId)) {
        await syncShoahKs2LivingVoices(unitId, { forceAudio, skipTts });
      } else {
        await syncProloguesAndSourcesForUnits([unitId], { forceAudio, skipTts, skipDbBuild: true });
      }
      if (PAPER3_INTERPRETATION_UNITS.has(unitId)) {
        await syncPaper3InterpretationAudio([unitId], { forceAudio, skipTts, skipDbBuild: true });
      }
      if (KS2_KS3_GUIDED_READING_UNITS.includes(unitId)) {
        await syncGuidedReadingUnits([unitId], { forceAudio, skipTts, skipDbBuild: true });
      }
    }
    console.log(`✅ [Studio Media Engine · ${unitId}] 100% up-to-date (0 stale audio hashes, $0.00 API cost).`);
    return;
  }

  if (skipTts) {
    console.log(`⏭️  [Studio Media Engine · ${unitId}] --skip-tts set; ${ttsJobs.length} clip(s) pending synthesis.`);
    return;
  }

  const apiKey = resolveGeminiApiKey();
  if (!apiKey) {
    console.warn(
      `⚠️  [Studio Media Engine · ${unitId}] GEMINI_API_KEY not found in environment/.env; skipping ${ttsJobs.length} pending TTS clip(s).`,
    );
    return;
  }

  const voiceId = await ensureHouseVoiceId(apiKey, persona.key);
  await runDualLaneQueue(apiKey, voiceId, persona, ttsJobs);

  if (hasLessonAudio) {
    const alignedCount = buildUnitLessonTimingsJson(ROOT, unitId);
    console.log(`⏱️  [Acoustic Timings · ${unitId}] Synchronized exact sentence timestamps across ${alignedCount} blocks.`);
  }
  if (WW1_LIVING_VOICE_UNITS.has(unitId)) {
    await syncWw1UnitLivingVoices(unitId, { forceAudio, skipTts });
    await syncProloguesAndSourcesForUnits([unitId], { forceAudio, skipTts, skipDbBuild: true });
  } else {
    if (SHOAH_KS2_LIVING_VOICE_UNITS.has(unitId)) {
      await syncShoahKs2LivingVoices(unitId, { forceAudio, skipTts });
    } else {
      await syncProloguesAndSourcesForUnits([unitId], { forceAudio, skipTts, skipDbBuild: true });
    }
    if (PAPER3_INTERPRETATION_UNITS.has(unitId)) {
      await syncPaper3InterpretationAudio([unitId], { forceAudio, skipTts, skipDbBuild: true });
    }
    if (KS2_KS3_GUIDED_READING_UNITS.includes(unitId)) {
      await syncGuidedReadingUnits([unitId], { forceAudio, skipTts, skipDbBuild: true });
    }
  }
  console.log(`🎉 [Studio Media Engine · ${unitId}] Synthesized ${ttsJobs.length} clip(s) & locked SHA-256 hashes!`);
}

async function main() {
  const args = process.argv.slice(2);
  const runAll = args.includes('--all');
  const unitId = args.find((a) => !a.startsWith('-'));
  const opts = {
    initAudio: args.includes('--init-audio'),
    forceAudio: args.includes('--force-audio'),
    skipTts: args.includes('--skip-tts'),
  };

  if (runAll) {
    for (const u of Object.keys(UNIT_VOICE_ASSIGNMENTS)) {
      await syncSingleUnit(u, opts);
    }
    return;
  }

  if (!unitId) {
    console.error('Usage: node scripts/sync_unit_studio_media.mjs <unit_id|--all> [--init-audio] [--force-audio] [--skip-tts]');
    process.exit(1);
  }

  await syncSingleUnit(unitId, opts);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('❌ [Studio Media Engine] Fatal error:', err);
    process.exit(1);
  });
}
