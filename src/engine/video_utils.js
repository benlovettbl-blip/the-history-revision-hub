/**
 * Video Utilities for GCSE History Revision Hub
 * - Duration parsing and formatting
 * - Duration-based sorting (shortest to longest)
 * - Sidebar video badge generation
 */

/**
 * Parses duration strings into total seconds.
 * Supports: "4 mins 20 secs", "45 mins", "6:31", "1 hour 25 mins", "58 mins", etc.
 * @param {string} durationStr
 * @returns {number} duration in seconds (defaults to 999999 if undefined)
 */
export function parseDurationToSeconds(durationStr) {
  if (!durationStr || typeof durationStr !== 'string' || /not found/i.test(durationStr)) return 999999;
  let total = 0;
  const hoursMatch = durationStr.match(/(\d+)\s*(?:hours?|hrs?|h)/i);
  if (hoursMatch) total += parseInt(hoursMatch[1], 10) * 3600;
  const minsMatch = durationStr.match(/(\d+)\s*(?:minutes?|mins?|m)/i);
  if (minsMatch) total += parseInt(minsMatch[1], 10) * 60;
  const secsMatch = durationStr.match(/(\d+)\s*(?:seconds?|secs?|s)/i);
  if (secsMatch) total += parseInt(secsMatch[1], 10);

  if (total === 0) {
    const colonMatch = durationStr.match(/(?:(\d+):)?(\d+):(\d+)/);
    if (colonMatch) {
      if (colonMatch[1]) total += parseInt(colonMatch[1], 10) * 3600;
      total += parseInt(colonMatch[2], 10) * 60;
      total += parseInt(colonMatch[3], 10);
    }
  }
  return total || 999999;
}

/**
 * Formats duration into a concise classroom badge string (e.g., "4m 20s", "45m", "1h 25m").
 * @param {string} durationStr
 * @returns {string}
 */
export function formatShortDuration(durationStr) {
  if (!durationStr || /not found/i.test(durationStr)) return '';
  const secs = parseDurationToSeconds(durationStr);
  if (secs === 999999) {
    if (/not found/i.test(durationStr)) return '';
    return durationStr
      .replace(/\s*secs?/i, 's')
      .replace(/\s*mins?/i, 'm')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ''}`;
  if (m > 0 && s > 0 && m < 10) return `${m}m ${s}s`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

/**
 * Formats duration into a prominent, immediately readable duration badge (e.g. "58 mins", "4m 20s", "12 mins", "1h 25m").
 * @param {string} durationStr
 * @returns {string}
 */
export function formatProminentDuration(durationStr) {
  if (!durationStr || /not found/i.test(durationStr)) return '';
  const secs = parseDurationToSeconds(durationStr);
  if (secs === 999999) {
    if (/not found/i.test(durationStr)) return '';
    return durationStr.trim();
  }
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ''}`;
  if (m > 0 && s > 0 && m < 10) return `${m}m ${s}s`;
  if (m > 0) return `${m} mins`;
  return `${s}s`;
}

/**
 * Cleans video titles by removing machine-generated episode/index prefixes (e.g., "04: ", "01 - ", "Ep 2: ")
 * @param {string} title
 * @returns {string}
 */
export function cleanVideoDisplayTitle(title) {
  if (!title || typeof title !== 'string') return 'Historical Documentary Resource';
  const cleaned = title
    .replace(/^\s*(?:ep(?:isode)?\s*\d+[\s:\.\-]+|\d{1,2}[\s:\.\-]+\s*)/i, '')
    .trim();
  return cleaned || title;
}

/**
 * Extracts and sorts all videos for a given lesson from shortest to longest.
 * @param {object} lesson
 * @returns {Array} sorted array of video objects
 */
export function getSortedLessonVideos(lesson) {
  if (!lesson) return [];
  let rawVideos = [];
  if (Array.isArray(lesson)) {
    rawVideos = lesson;
  } else {
    rawVideos = (
      lesson.video ? (Array.isArray(lesson.video) ? lesson.video : [lesson.video]) : []
    ).concat(lesson.extra_videos || []);
  }

  return [...rawVideos].filter(Boolean).sort((a, b) => {
    return parseDurationToSeconds(a && a.duration) - parseDurationToSeconds(b && b.duration);
  });
}

/**
 * Generates the HTML for the sidebar or card video micro-badge.
 * @param {object} lesson
 * @param {object} [options]
 * @param {boolean} [options.isCard=false]
 * @returns {string} HTML string (or empty if no videos)
 */
export function renderSidebarVideoBadgeHTML(lesson, options = {}) {
  if (!lesson) return '';
  const sorted = getSortedLessonVideos(lesson);
  if (sorted.length === 0) return '';

  const isCard = options.isCard ?? false;
  const shortest = sorted[0];
  const shortDur = formatShortDuration(shortest.duration);
  const isEraOnly = sorted.every(
    (v) => v.type === 'era' || (v.url && v.url.includes('era.org.uk')),
  );

  const iconClass = isEraOnly ? 'fa-solid fa-tv' : 'fa-solid fa-play';
  const typeClass = isEraOnly ? 'era' : 'yt';
  const cardClass = isCard ? ' card-vbadge' : '';
  const label = shortDur || (isEraOnly ? 'ERA' : 'Vid');
  const countBadge =
    sorted.length > 1
      ? `<span class="sidebar-vbadge-count${isCard ? ' card-vbadge-count' : ''}">${sorted.length}${isCard ? ' clips' : ''}</span>`
      : '';

  // Tooltip with video list
  const tooltipLines = sorted.map((v, i) => {
    const durLabel = v.duration ? ` [${v.duration}]` : '';
    const cleanTitle = (v.title || 'Video Resource').replace(/"/g, '&quot;');
    return `${i + 1}. ${cleanTitle}${durLabel}`;
  });
  const tooltipAttr = tooltipLines.join('&#10;');

  return `<span class="sidebar-lesson-video-badge ${typeClass}${cardClass}" title="${tooltipAttr}"><i class="${iconClass}"></i><span>${label}</span>${countBadge}</span>`;
}

/**
 * Formats bracketed timestamps ([01:10]) and watch window ranges (00:15–03:45)
 * into high-contrast clickable scrubbing pill buttons.
 * @param {string} htmlText
 * @param {string} youtubeId
 * @param {boolean} inModal
 * @param {string} videoKey
 * @returns {string}
 */
export function formatInteractiveTimestamps(htmlText, youtubeId, inModal = true, videoKey = '') {
  if (!htmlText || typeof htmlText !== 'string') return htmlText;

  // Normalize internal teacher "Hinge Question:" prompt tags to pupil-friendly "Class Discussion:"
  let result = htmlText.replace(/\bHinge Question\s*:/gi, 'Class Discussion:');

  // 1. Bracketed timestamps: [01:10], [1:10], [00:45], [1:15:30]
  result = result.replace(/\[(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\]/g, (match, h, m, s) => {
    const hours = h ? parseInt(h, 10) : 0;
    const mins = parseInt(m, 10);
    const secs = parseInt(s, 10);
    const totalSecs = hours * 3600 + mins * 60 + secs;
    const label = (h ? `${h}:` : '') + `${m.padStart(2, '0')}:${s}`;

    if (inModal) {
      return `<button type="button" class="theater-timestamp-pill" onclick="window.seekTheaterVideo(${totalSecs}, '${youtubeId}')" title="Click to scrub video to ${label}"><i class="fa-solid fa-play"></i> ${label}</button>`;
    } else {
      return `<button type="button" class="theater-timestamp-pill" data-action="open-video-modal" data-youtube="${youtubeId}" ${videoKey ? `data-video-key="${videoKey}"` : ''} data-start="${totalSecs}" title="Watch from ${label} in Theater"><i class="fa-solid fa-play"></i> ${label}</button>`;
    }
  });

  // 2. Watch window range: 00:15–03:45 or 01:10-04:20
  result = result.replace(
    /(?:Recommended\s+(?:Class\s+|Starter\s+)?Watch\s+Window|Recommended\s+Clip):\s*(\d{1,2}:\d{2})\s*[–\-]\s*(\d{1,2}:\d{2})/gi,
    (match, startStr, endStr) => {
      const parts = startStr.split(':').map(Number);
      const totalSecs = parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
      const btnHtml = inModal
        ? `<button type="button" class="theater-timestamp-pill briefing-pill" onclick="window.seekTheaterVideo(${totalSecs}, '${youtubeId}')" title="Click to jump to start of watch window (${startStr})"><i class="fa-solid fa-play"></i> ${startStr}&ndash;${endStr}</button>`
        : `<button type="button" class="theater-timestamp-pill briefing-pill" data-action="open-video-modal" data-youtube="${youtubeId}" ${videoKey ? `data-video-key="${videoKey}"` : ''} data-start="${totalSecs}" title="Watch window in Theater (${startStr}&ndash;${endStr})"><i class="fa-solid fa-play"></i> ${startStr}&ndash;${endStr}</button>`;
      return `Recommended Watch Window: ${btnHtml}`;
    },
  );

  return result;
}

/**
 * Extracts an 11-character YouTube video ID from standard YouTube/youtu.be/nocookie URLs.
 * @param {string} url
 * @returns {string|null}
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i,
  );
  return match ? match[1] : null;
}

/**
 * Renders a quiet, inline micro-pill on a narrative block header when a lesson video
 * has `block_index` matching the 1-based block number (e.g. Block 3 -> block_index: 3).
 * @param {object} lesson
 * @param {number} blockIndex1Based
 * @returns {string}
 */
export function renderBlockVideoMicroPillHTML(lesson, blockIndex1Based) {
  if (!lesson || !blockIndex1Based) return '';
  const allVideos = getSortedLessonVideos(lesson);
  const matched = allVideos.filter((v) => Number(v && v.block_index) === Number(blockIndex1Based));
  if (matched.length === 0) return '';

  const safeLessonId = String(lesson.id || lesson.title || 'lesson').replace(/[^a-zA-Z0-9_-]/g, '_');

  return matched
    .map((vid, mIdx) => {
      const ytId = extractYouTubeId(vid.url);
      const isEra = vid.type === 'era' || (vid.url && vid.url.includes('era.org.uk'));
      const shortDur = formatShortDuration(vid.duration);
      const prominentDur = formatProminentDuration(vid.duration);
      const cleanTitle = cleanVideoDisplayTitle(vid.title).replace(/"/g, '&quot;');
      const label = shortDur ? `${shortDur} clip` : 'Watch clip';
      const videoKey = `blk_${safeLessonId}_${blockIndex1Based}_${mIdx}`;

      if (typeof window !== 'undefined' && ytId) {
        window.__videoStore = window.__videoStore || {};
        window.__videoStore[videoKey] = {
          ...vid,
          cleanTitle,
          prominentDur,
          ytId,
        };
      }

      if (ytId) {
        return `<button type="button" class="block-video-micro-pill no-print" data-action="open-video-modal" data-youtube="${ytId}" data-video-key="${videoKey}" title="Watch clip: ${cleanTitle}" style="margin-left: 8px; display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px; border-radius: 999px; border: 1px solid #fecaca; background: #fef2f2; color: #b91c1c; font-size: 0.72rem; font-weight: 700; cursor: pointer; vertical-align: middle; line-height: 1.4;"><i class="fa-solid fa-play" style="font-size: 0.62rem;"></i> ${label}</button>`;
      }
      if (vid.url) {
        return `<a href="${vid.url}" target="_blank" rel="noopener noreferrer" class="block-video-micro-pill no-print" title="Open ${isEra ? 'ERA stream' : 'video'}: ${cleanTitle}" style="margin-left: 8px; display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px; border-radius: 999px; border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-size: 0.72rem; font-weight: 700; text-decoration: none; vertical-align: middle; line-height: 1.4;"><i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.62rem;"></i> ${label}</a>`;
      }
      return '';
    })
    .join('');
}

/**
 * Renders a compact, collapsible 1-line Unit-Level Video Library above the unit's lessons.
 * Aggregates whole-unit documentaries (`unitData.unit_videos`) and all lesson clips.
 * @param {object} unitData
 * @param {string} unitId
 * @returns {string}
 */
export function renderUnitVideoLibraryHTML(unitData, unitId = '') {
  if (!unitData) return '';
  const unitVideos = Array.isArray(unitData.unit_videos) ? unitData.unit_videos.filter(Boolean) : [];
  const lessons = Array.isArray(unitData.lessons) ? unitData.lessons : [];

  const lessonGroups = [];
  let lessonClipCount = 0;
  lessons.forEach((lesson, lIdx) => {
    const vids = getSortedLessonVideos(lesson);
    if (vids.length > 0) {
      lessonClipCount += vids.length;
      lessonGroups.push({
        lessonIndex: lIdx,
        lessonId: lesson.id || `lesson_${lIdx + 1}`,
        lessonTitle: lesson.title || `Lesson ${lIdx + 1}`,
        videos: vids,
      });
    }
  });

  const totalClips = unitVideos.length + lessonClipCount;
  if (totalClips === 0) return '';

  const safeUnitId = String(unitId || unitData.id || 'unit').replace(/[^a-zA-Z0-9_-]/g, '_');

  const renderRowCard = (vid, keySuffix) => {
    const ytId = extractYouTubeId(vid.url);
    const isEra = vid.type === 'era' || (vid.url && vid.url.includes('era.org.uk'));
    const displayTitle = cleanVideoDisplayTitle(vid.title);
    const safeTitleAttr = displayTitle.replace(/"/g, '&quot;');
    const shortDur = formatShortDuration(vid.duration);
    const prominentDur = formatProminentDuration(vid.duration);
    const videoKey = `uvl_${safeUnitId}_${keySuffix}`;

    if (typeof window !== 'undefined' && ytId) {
      window.__videoStore = window.__videoStore || {};
      window.__videoStore[videoKey] = {
        ...vid,
        cleanTitle: displayTitle,
        prominentDur,
        ytId,
      };
    }

    const momentBadge = vid.moment
      ? `<span style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 1px 7px; border-radius: 999px; font-size: 0.68rem; font-weight: 700; white-space: nowrap;">${String(vid.moment).replace(/"/g, '&quot;')}</span>`
      : '';
    const durBadge = shortDur
      ? `<span style="background: #f1f5f9; color: #475569; padding: 1px 7px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; white-space: nowrap;"><i class="fa-solid fa-clock" style="font-size: 0.64rem;"></i> ${shortDur}</span>`
      : '';

    const actionBtn = ytId
      ? `<button type="button" data-action="open-video-modal" data-youtube="${ytId}" data-video-key="${videoKey}" style="flex-shrink: 0; background: #dc2626; color: #ffffff; border: none; border-radius: 6px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;"><i class="fa-solid fa-play" style="font-size: 0.66rem;"></i> Watch</button>`
      : `<a href="${vid.url}" target="_blank" rel="noopener noreferrer" style="flex-shrink: 0; background: ${isEra ? '#1e3a8a' : '#334155'}; color: #ffffff; border-radius: 6px; padding: 5px 11px; font-size: 0.76rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;"><i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.66rem;"></i> ${isEra ? 'ERA' : 'Open'}</a>`;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 10px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="min-width: 0; flex: 1;">
          <div style="font-size: 0.85rem; font-weight: 600; color: #0f172a; line-height: 1.35;" title="${safeTitleAttr}">${displayTitle}</div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 4px;">
            ${durBadge}
            ${momentBadge}
            ${vid.channel ? `<span style="font-size: 0.7rem; color: #64748b;">${vid.channel}</span>` : ''}
          </div>
        </div>
        ${actionBtn}
      </div>
    `;
  };

  const overviewSection =
    unitVideos.length > 0
      ? `
      <div style="margin-bottom: 14px;">
        <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #1e3a8a; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-globe"></i> Whole-Unit Overviews &amp; Documentaries (${unitVideos.length})
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px;">
          ${unitVideos.map((v, i) => renderRowCard(v, `unit_${i}`)).join('')}
        </div>
      </div>
    `
      : '';

  const lessonsSection = lessonGroups
    .map(
      (grp) => `
      <div style="margin-bottom: 12px;">
        <div style="font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
          <span style="background: #e2e8f0; color: #1e293b; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 4px;">L${grp.lessonIndex + 1}</span>
          <span>${grp.lessonTitle}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px;">
          ${grp.videos.map((v, vi) => renderRowCard(v, `l${grp.lessonIndex}_${vi}`)).join('')}
        </div>
      </div>
    `,
    )
    .join('');

  const summaryParts = [];
  if (unitVideos.length > 0) summaryParts.push(`${unitVideos.length} Whole-Unit`);
  if (lessonClipCount > 0) summaryParts.push(`${lessonClipCount} Lesson Clip${lessonClipCount === 1 ? '' : 's'}`);

  return `
    <details class="unit-video-library-drawer no-print" style="margin: 0 0 20px 0; border: 1px solid #cbd5e1; border-radius: 10px; background: #f8fafc; overflow: hidden;">
      <summary style="list-style: none; cursor: pointer; padding: 11px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; font-weight: 700; color: #0f172a; font-size: 0.9rem; user-select: none;">
        <span style="display: inline-flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-film" style="color: #dc2626;"></i>
          <span>Unit Video Library</span>
          <span style="background: #fee2e2; color: #b91c1c; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 999px;">${totalClips} Clip${totalClips === 1 ? '' : 's'}</span>
          <span style="font-size: 0.76rem; font-weight: 500; color: #64748b;">${summaryParts.join(' &bull; ')}</span>
        </span>
        <span style="font-size: 0.76rem; font-weight: 600; color: #1d4ed8;">Browse all <i class="fa-solid fa-chevron-down" style="margin-left: 3px; font-size: 0.68rem;"></i></span>
      </summary>
      <div style="padding: 12px 16px 14px 16px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
        ${overviewSection}
        ${lessonsSection}
      </div>
    </details>
  `;
}

