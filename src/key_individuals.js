import { getAssetUrl } from './engine/assets.js';
import { isKs2UnitId, isKs2ActiveContext, extractKs2ShortHook } from './utils/ks2_mode.js';

export function isOrganisationEntity(entity) {
  if (!entity || typeof entity !== 'object') return false;
  const raw = String(entity.entity_type || entity.entityType || entity.type || '').trim().toLowerCase();
  return raw === 'organisation' || raw === 'organization' || raw === 'org';
}

const INLINE_PORTRAIT_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='276' viewBox='0 0 240 276'%3E%3Crect width='240' height='276' fill='%230f172a'/%3E%3Ccircle cx='120' cy='106' r='38' fill='%23334155'/%3E%3Cpath d='M56 236c8-38 34-58 64-58s56 20 64 58' fill='%23334155'/%3E%3C/svg%3E";

function usesContainFit(entity, imgSrc = '') {
  if (!entity) return false;
  if (entity.image_fit === 'logo') return true;
  return /\.svg(?:$|\?)/i.test(String(imgSrc || ''));
}

function entityHasContainArtwork(entity) {
  return Boolean(entity && entity.image_fit === 'contain');
}

function fmtInlineDossierText(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/\s*->\s*/g, ' &rarr; ')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^<a-zA-Z0-9*])\*([^*\n<]+)\*(?=[^*]|$)/g, '$1<em>$2</em>');
}

function buildEntityPronounceBtnHTML(person, compact = false) {
  const rawName = String(person?.name || '').trim();
  if (!rawName) return '';
  const phonetic = String(person?.phonetic || person?.pronunciation || '').trim();
  const safeJsName = rawName
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/\r?\n/g, ' ');
  const safeAttrName = rawName
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safePhoneticHtml = phonetic
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safePhoneticAttr = safePhoneticHtml.replace(/"/g, '&quot;');
  const titleText = phonetic
    ? `Pronounce ${safeAttrName} [${safePhoneticAttr}]`
    : `Pronounce ${safeAttrName} (British English)`;
  if (compact) {
    return `<span role="button" tabindex="0" class="ki-pronounce-btn ki-pronounce-compact no-print" onclick="event.preventDefault(); event.stopPropagation(); if (window.speakVocabWord) { window.speakVocabWord('${safeJsName}', this); }" onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); if (window.speakVocabWord) { window.speakVocabWord('${safeJsName}', this); } }" title="${titleText}" aria-label="${titleText}"><i class="fa-solid fa-volume-high"></i>${phonetic ? `<span class="ki-phonetic-label">[${safePhoneticHtml}]</span>` : ''}</span>`;
  }
  return `<button type="button" class="ki-pronounce-btn no-print" onclick="event.preventDefault(); event.stopPropagation(); if (window.speakVocabWord) { window.speakVocabWord('${safeJsName}', this); }" title="${titleText}" aria-label="${titleText}"><i class="fa-solid fa-volume-high"></i><span>${phonetic ? `[${safePhoneticHtml}]` : 'Pronounce'}</span></button>`;
}

export function generateKeyIndividualEmbedHTML(person, anchorTitle = null) {
  const isOrg = isOrganisationEntity(person);
  const isKs2 = isKs2UnitId(person?.unitId) || isKs2ActiveContext();
  const anchor = anchorTitle || person.anchor_title || '';
  const dateLabel = person.lifespan || person.active_dates || '';
  const anchorSubtext = anchor
    ? ` &bull; ${isKs2 ? '' : 'Anchored to '}${anchor}`
    : person.role
      ? ` &bull; ${person.role}`
      : '';

  const badgeBg = isOrg ? '#0f766e' : '#1e40af';
  const badgeLightBg = isOrg ? '#f0fdfa' : '#eff6ff';
  const badgeLightBorder = isOrg ? '#99f6e4' : '#bfdbfe';
  const badgeIcon = isOrg ? 'fa-landmark' : 'fa-user-tie';
  const summaryTag = isKs2
    ? isOrg
      ? 'GROUP IN OUR STORY'
      : 'MEET THIS PERSON'
    : isOrg
      ? anchor
        ? 'KEY ORGANISATION'
        : 'ORGANISATION DOSSIER'
      : anchor
        ? 'HISTORICAL AGENT'
        : 'FIGURE DOSSIER';
  const toggleLabel = isKs2 ? 'Story Card' : isOrg ? 'Organisation Dossier' : 'Figure Dossier';
  const insideBannerLabel = isKs2
    ? isOrg
      ? 'Group in This Enquiry'
      : 'Key Person in This Enquiry'
    : isOrg
      ? 'Decisive Movement / Institution'
      : 'Decisive Historical Agent';
  const insidePillLabel = isKs2
    ? isOrg
      ? 'Historical Group Card'
      : 'Historical Trading Card'
    : isOrg
      ? 'Historical Organisation Dossier'
      : 'Historical Figure Dossier';

  let imgSrcHtml = '';
  const embedRawImg = String(person.image_url || person.image || '').trim();
  if (embedRawImg && embedRawImg !== '/') {
    const imgSrc = person.image_url
      ? person.image_url
      : typeof getAssetUrl === 'function'
        ? getAssetUrl(person.image)
        : person.image;
    const contain = usesContainFit(person, imgSrc);
    const objPos = String(person.image_position || 'center 18%').replace(/\bcentre\b/gi, 'center');
    imgSrcHtml = `
      <div style="flex-shrink: 0; width: 88px; height: 100px; border-radius: 6px; overflow: hidden; background: #ffffff; border: 1.5px solid #cbd5e1; box-shadow: 0 2px 5px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; ${contain ? 'padding: 6px;' : ''}">
        <img src="${imgSrc}" loading="lazy" alt="${person.name}" style="width: 100%; height: 100%; object-fit: ${contain ? 'contain' : 'cover'}; object-position: ${objPos};" onerror="this.parentElement.style.display='none'">
      </div>
    `;
  }

  let actionsList = '';
  if (person.strategic_actions) {
    const items = Array.isArray(person.strategic_actions)
      ? person.strategic_actions
      : [person.strategic_actions];
    actionsList = `<ul style="margin: 0; padding-left: 18px; font-size: 0.88rem; color: #1e293b; line-height: 1.5;">${items.map((a) => `<li style="margin-bottom: 4px;">${fmtInlineDossierText(a)}</li>`).join('')}</ul>`;
  } else if (person.actions) {
    actionsList = `<div style="font-size: 0.88rem; color: #1e293b; line-height: 1.5;">${fmtInlineDossierText(person.actions)}</div>`;
  }

  // Neutralised from legacy celebratory green "Impact & Achievements" -> impartial slate/navy "Key Roles & Turning Points" / "Methods & Key Actions"
  let turningPointsList = '';
  if (person.achievements) {
    const rawItems = Array.isArray(person.achievements) ? person.achievements : [person.achievements];
    const items = isKs2 ? rawItems.slice(0, 2) : rawItems;
    turningPointsList = `<ul style="margin: 0; padding-left: 18px; font-size: 0.88rem; color: #334155; line-height: 1.5;">${items.map((a) => `<li style="margin-bottom: 4px;">${fmtInlineDossierText(isKs2 ? extractKs2ShortHook(a, 1, 24) : a)}</li>`).join('')}</ul>`;
  }

  const originsHtml =
    !isKs2 && person.origins
      ? `
      <div style="margin-top: 8px; font-size: 0.88rem; color: #334155; line-height: 1.5; background: #f8fafc; border-left: 3px solid #64748b; padding: 7px 12px; border-radius: 0 4px 4px 0;">
        <strong style="color: #0f172a;">${isOrg ? 'Origins &amp; Ideology:' : 'Origins &amp; Worldview:'}</strong> ${fmtInlineDossierText(person.origins)}
      </div>
    `
      : '';

  const distinctionHtml = person.key_distinction
    ? `
      <div style="margin-top: 8px; font-size: 0.87rem; color: #78350f; line-height: 1.48; background: #fffbeb; border-left: 3px solid #d97706; padding: 7px 12px; border-radius: 0 4px 4px 0;">
        <strong style="color: #92400e;">${isKs2 ? '🔎 Cool Clue to Spot:' : 'Key Historical Distinction:'}</strong> ${fmtInlineDossierText(isKs2 ? extractKs2ShortHook(person.key_distinction, 1, 26) : person.key_distinction)}
      </div>
    `
    : '';

  const limitationsHtml =
    !isKs2 && person.limitations
      ? `
      <div style="margin-top: 8px; font-size: 0.87rem; color: #7f1d1d; line-height: 1.48; background: #fef2f2; border-left: 3px solid #ef4444; padding: 7px 12px; border-radius: 0 4px 4px 0;">
        <strong style="color: #b91c1c;">Historical Limitations &amp; Constraints:</strong> ${fmtInlineDossierText(person.limitations)}
      </div>
    `
      : '';

  const rationaleHtml = person.anchor_rationale
    ? `<div style="width: 100%; font-size: 0.79rem; font-weight: 500; text-transform: none; letter-spacing: 0; color: #475569; margin-top: 2px; line-height: 1.4;">${fmtInlineDossierText(person.anchor_rationale)}</div>`
    : '';

  const anchorBannerInside = anchor
    ? `
    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px dashed #e2e8f0; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
      <span style="background: ${badgeBg}; color: #ffffff; padding: 2px 7px; border-radius: 3px; display: inline-flex; align-items: center; gap: 4px;">
        <i class="fa-solid ${badgeIcon}"></i> ${insideBannerLabel}
      </span>
      <span style="color: ${badgeBg};">Anchored to ${anchor}</span>
      ${rationaleHtml}
    </div>
  `
    : '';

  const actionsHeading = isKs2
    ? 'What They Did:'
    : isOrg
      ? 'Methods &amp; Key Actions:'
      : 'Key Strategic Decisions &amp; Actions:';
  const secondaryHeading = isKs2
    ? 'What They Did:'
    : isOrg && !actionsList
      ? 'Methods &amp; Key Actions:'
      : 'Key Roles &amp; Turning Points:';

  const safeJumpNameAttr = String(person.name || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safeJsName = String(person.name || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
  const profileJumpLabel = isKs2
    ? 'Meet Everyone in This Topic &rarr;'
    : isOrg
      ? 'View in People &amp; Organisations &rarr;'
      : 'View Full Dossier in People &amp; Organisations &rarr;';
  const profileJumpFooterHtml = `
    <div class="key-individual-dossier-footer no-print" style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; align-items: center;">
      <button
        type="button"
        class="btn-dossier-profile-jump"
        data-action="jump-to-key-individual"
        data-name="${safeJumpNameAttr}"
        onclick="event.preventDefault(); event.stopPropagation(); if (window.jumpToKeyIndividual) { window.jumpToKeyIndividual('${safeJsName}'); }"
        style="background: ${badgeLightBg}; color: ${badgeBg}; border: 1.5px solid ${badgeLightBorder}; border-radius: 7px; padding: 7px 14px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 7px; transition: all 0.18s ease; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);"
        onmouseover="this.style.background='${badgeBg}'; this.style.color='#ffffff'; this.style.borderColor='${badgeBg}';"
        onmouseout="this.style.background='${badgeLightBg}'; this.style.color='${badgeBg}'; this.style.borderColor='${badgeLightBorder}';"
      >
        <i class="fa-solid ${isOrg ? 'fa-building-columns' : 'fa-id-card'}"></i>
        <span>${profileJumpLabel}</span>
      </button>
    </div>
  `;

  return `
    <details class="key-individual-drawer archival-drawer gcse-source-container archival-source-box" data-entity-type="${isOrg ? 'organisation' : 'person'}" style="margin: 6px 0; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); transition: all 0.25s ease;">
      <summary style="padding: 4px 10px; min-height: 26px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; background: #f8fafc; color: #0f172a; list-style: none; user-select: none; transition: background 0.15s ease;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; flex: 1; margin-right: 8px;">
          <span class="archival-meta-tag" style="background: ${badgeBg}; color: #ffffff; padding: 2px 6px; border-radius: 3px; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.4px; line-height: 1.2; white-space: nowrap; flex-shrink: 0;">
            <i class="fa-solid ${badgeIcon}" style="margin-right: 3px;"></i>${summaryTag}
          </span>
          <span class="archival-drawer-title" style="font-family: 'Playfair Display', Georgia, serif; font-size: 0.84rem; color: #1e293b; font-weight: 700; line-height: 1.35; white-space: normal; overflow-wrap: break-word;">
            ${person.name}${dateLabel ? ` (${dateLabel})` : ''}${anchorSubtext}
          </span>
          ${buildEntityPronounceBtnHTML(person, true)}
        </div>
        <span class="drawer-toggle-indicator" style="font-size: 0.68rem; color: #64748b; display: inline-flex; align-items: center; gap: 4px; font-weight: 600; flex-shrink: 0; white-space: nowrap;">
          ${toggleLabel} &bull; <span class="drawer-state-expand">Expand</span><span class="drawer-state-collapse">Collapse</span> <span class="drawer-caret">&#9660;</span>
        </span>
      </summary>
      <div class="key-individual-dossier-card archival-drawer-content" style="padding: 16px 20px; background: #ffffff; border-top: 1px solid #e2e8f0;">
        ${anchorBannerInside}
        <div style="display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
          ${imgSrcHtml}
          <div style="flex: 1; min-width: 240px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
              <span class="archival-meta-tag accent-blue" style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: ${badgeBg}; background: ${badgeLightBg}; padding: 2px 7px; border-radius: 3px; border: 1px solid ${badgeLightBorder};">
                ${insidePillLabel}
              </span>
              ${dateLabel ? `<span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">(${dateLabel})</span>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 style="margin: 0; color: #0f172a; font-family: 'Playfair Display', Georgia, serif; font-size: 1.25rem; font-weight: 700; line-height: 1.3;">
                ${person.name}
              </h3>
              ${buildEntityPronounceBtnHTML(person, false)}
            </div>
            ${person.role ? `<div style="font-size: 0.85rem; color: #475569; font-weight: 600; margin-top: 2px;">${person.role}</div>` : ''}
            ${originsHtml}
            ${person.significance || person.bio
      ? `
              <div style="margin-top: 8px; font-size: 0.9rem; color: #334155; line-height: 1.5; background: #f8fafc; border-left: 3px solid ${badgeBg}; padding: 8px 12px; border-radius: 0 4px 4px 0;">
                <strong>${isKs2 ? '🌟 Why They Mattered:' : 'Historical Significance:'}</strong> ${fmtInlineDossierText(isKs2 ? extractKs2ShortHook(person.significance || person.bio, 1, 30) : person.significance || person.bio)}
              </div>
            `
      : ''
    }
            ${distinctionHtml}
            ${limitationsHtml}
          </div>
        </div>
        ${actionsList
      ? `
          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
            <strong style="color: ${badgeBg}; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 6px;">
              ${actionsHeading}
            </strong>
            ${actionsList}
          </div>
        `
      : ''
    }
        ${turningPointsList
      ? `
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #e2e8f0;">
            <strong style="color: #334155; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">
              ${secondaryHeading}
            </strong>
            ${turningPointsList}
          </div>
        `
      : ''
    }
        ${profileJumpFooterHtml}
      </div>
    </details>
  `;
}

function deriveMonogramInitials(name) {
  const cleaned = String(name || '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(King|Queen|Prince|Princess|Sir|Dame|Lord|Lady|Admiral|General|Field Marshal|Archbishop|Cardinal|Pope|Governor|President|Professor|Prof\.?|Dr\.?|OBE|MBE|VC|II|III|IV|VIII|XI)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const parts = cleaned.split(/[\s&/,-]+/).filter((w) => /^[A-Za-zÀ-ÿ]/.test(w));
  if (parts.length === 0) return 'H';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function generateKeyIndividualCardHTML(person) {
  const isOrg = isOrganisationEntity(person);
  const isKs2 = isKs2UnitId(person?.unitId) || isKs2ActiveContext();
  const entityTypeAttr = isOrg ? 'organisation' : 'person';
  const dateLabel = person.lifespan || person.active_dates || '';
  const pillText = isKs2
    ? isOrg
      ? 'Historical Group'
      : 'Historical Person'
    : isOrg
      ? 'Key Organisation'
      : 'Key Individual';
  const pillIcon = isOrg ? 'fa-landmark' : 'fa-user-tie';
  const pillBg = isOrg ? '#f0fdfa' : '#eff6ff';
  const pillColor = isOrg ? '#0f766e' : '#1d4ed8';
  const pillBorder = isOrg ? '#99f6e4' : '#bfdbfe';

  let frontImgHtml = '';
  const rawImgVal = String(person.image_url || person.image || '').trim();
  const hasValidImg = Boolean(rawImgVal && rawImgVal !== '/');
  if (hasValidImg) {
    const imgSrc = person.image_url
      ? person.image_url
      : typeof getAssetUrl === 'function'
        ? getAssetUrl(person.image)
        : person.image;
    const contain = usesContainFit(person, imgSrc);
    const safeAlt = (person.name || '').replace(/"/g, '&quot;');
    const objPos = (person.image_position || 'center 22%')
      .replace(/"/g, '')
      .replace(/\bcentre\b/gi, 'center');
    const forceContainArtwork = entityHasContainArtwork(person);
    if (contain) {
      frontImgHtml = `<div style="width: 100%; height: 276px; background: #ffffff; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--border-glass, #e2e8f0); border-radius: 11px 11px 0 0; overflow: hidden; padding: 22px; box-sizing: border-box;">
        <img src="${imgSrc}" alt="${safeAlt}" style="max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain;" onerror="this.onerror=null; this.src='${INLINE_PORTRAIT_FALLBACK}'">
      </div>`;
    } else {
      const onloadRule = forceContainArtwork
        ? ''
        : `onload="if(this.naturalWidth > this.naturalHeight * 1.12){ this.style.width='100%'; this.style.height='100%'; this.style.objectFit='cover'; this.style.objectPosition=this.dataset.objPos||'center 22%'; this.style.boxShadow='none'; if(this.previousElementSibling) this.previousElementSibling.style.display='none'; }"`;
      frontImgHtml = `<div style="position: relative; width: 100%; height: 276px; background: #0f172a; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--border-glass, #e2e8f0); border-radius: 11px 11px 0 0; overflow: hidden; ${forceContainArtwork ? 'padding: 10px; box-sizing: border-box;' : ''}">
        <div class="agent-portrait-ambient" style="position: absolute; inset: -16px; background-image: url('${imgSrc}'); background-size: cover; background-position: center 25%; filter: blur(22px) brightness(0.54) saturate(0.88); transform: scale(1.12); pointer-events: none;"></div>
        <img src="${imgSrc}" alt="${safeAlt}" data-obj-pos="${objPos}" ${onloadRule} style="position: relative; z-index: 1; ${forceContainArtwork ? 'max-height: 100%; max-width: 100%; width: auto; height: auto; border-radius: 4px;' : 'height: 100%; width: auto; max-width: 100%;'} object-fit: contain; box-shadow: 0 4px 20px rgba(0,0,0,0.42);" onerror="this.onerror=null; if(this.previousElementSibling)this.previousElementSibling.style.display='none'; this.src='${INLINE_PORTRAIT_FALLBACK}'">
      </div>`;
    }
  } else {
    const initials = deriveMonogramInitials(person.name);
    frontImgHtml = `<div class="kf-monogram" style="width: 100%; height: 276px; background: radial-gradient(circle at 50% 42%, #1e293b 0%, #0f172a 100%); display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--border-glass, #e2e8f0); border-radius: 11px 11px 0 0; overflow: hidden; flex-direction: column; gap: 14px; padding: 20px; box-sizing: border-box;">
      <div style="width: 108px; height: 108px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #991b1b 0%, #7f1d1d 65%, #450a0a 100%); border: 3px solid #d97706; box-shadow: 0 8px 24px rgba(0,0,0,0.45), inset 0 0 0 4px rgba(251, 191, 36, 0.28); display: flex; align-items: center; justify-content: center;">
        <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 2.15rem; font-weight: 800; color: #fef3c7; letter-spacing: 0.06em; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${initials}</span>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 0.68rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #fbbf24;">Archival Biographical Record</div>
        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 3px;">Primary Biographical Dossier</div>
      </div>
    </div>`;
  }

  let basicBio = '';
  if (isKs2) {
    const shortFront = extractKs2ShortHook(person.significance || person.bio || person.origins || '', 1, 20);
    if (shortFront) {
      basicBio = `<div style="margin: 0; color: var(--text-main); font-size: 0.93rem; line-height: 1.5;">${fmtInlineDossierText(shortFront)}</div>`;
    }
  } else if (person.bio) {
    basicBio = `<div style="margin: 0; color: var(--text-main); font-size: 0.92rem; line-height: 1.5;">${fmtInlineDossierText(person.bio)}</div>`;
  } else if (person.significance) {
    basicBio = `<div style="margin: 0; color: var(--text-main); font-size: 0.92rem; line-height: 1.5;"><strong>Significance:</strong> ${fmtInlineDossierText(person.significance)}</div>`;
  }

  let backHtml = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 6px;">
      <span style="background: ${pillBg}; color: ${pillColor}; border: 1px solid ${pillBorder}; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 999px;">
        <i class="fa-solid ${pillIcon}" style="margin-right: 4px;"></i>${pillText}
      </span>
    </div>
    <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin: 0 0 12px 0; border-bottom: 1px solid var(--border-glass); padding-bottom: 10px;">
      <h3 style="margin: 0; color: var(--primary); font-family: var(--font-heading); text-align: center; font-size: 1.15rem;">${person.name}</h3>
      ${buildEntityPronounceBtnHTML(person, true)}
    </div>
  `;

  let hasDetailedContent = false;

  if (isKs2) {
    // Child-friendly KS2 Trading Card Back: max 3 spacious beats + Read Aloud button (zero scrolling 5-box wall!)
    const whoBeat = extractKs2ShortHook(person.origins || person.significance || person.bio || '', 1, 28);
    const rawDid = Array.isArray(person.achievements)
      ? person.achievements.slice(0, 2)
      : Array.isArray(person.strategic_actions)
        ? person.strategic_actions.slice(0, 2)
        : person.actions
          ? [person.actions]
          : [];
    const clueBeat = extractKs2ShortHook(person.key_distinction || '', 1, 26);

    if (whoBeat) {
      hasDetailedContent = true;
      backHtml += `
        <div style="background: #eff6ff; border-left: 3.5px solid #2563eb; padding: 10px 12px; margin-bottom: 10px; border-radius: 6px;">
          <strong style="color: #1d4ed8; display: block; margin-bottom: 3px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em;">🌟 Who They Were</strong>
          <span style="font-size: 0.9rem; color: #1e293b; display: block; line-height: 1.48;">${fmtInlineDossierText(whoBeat)}</span>
        </div>`;
    }
    if (rawDid.length > 0) {
      hasDetailedContent = true;
      backHtml += `
        <div style="background: #f0fdf4; border-left: 3.5px solid #16a34a; padding: 10px 12px; margin-bottom: 10px; border-radius: 6px;">
          <strong style="color: #15803d; display: block; margin-bottom: 4px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em;">⚡ What They Did</strong>
          <ul style="margin: 0; padding-left: 17px; font-size: 0.88rem; color: #1e293b; line-height: 1.46;">
            ${rawDid.map((d) => `<li style="margin-bottom: 4px;">${fmtInlineDossierText(extractKs2ShortHook(d, 1, 22))}</li>`).join('')}
          </ul>
        </div>`;
    }
    if (clueBeat) {
      hasDetailedContent = true;
      backHtml += `
        <div style="background: #fffbeb; border-left: 3.5px solid #d97706; padding: 10px 12px; margin-bottom: 10px; border-radius: 6px;">
          <strong style="color: #b45309; display: block; margin-bottom: 3px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em;">🔎 Cool Clue to Spot</strong>
          <span style="font-size: 0.88rem; color: #78350f; display: block; line-height: 1.45;">${fmtInlineDossierText(clueBeat)}</span>
        </div>`;
    }
    const readAloudText = [person.name, whoBeat, ...rawDid.map((d) => extractKs2ShortHook(d, 1, 22)), clueBeat]
      .filter(Boolean)
      .join('. ')
      .replace(/<[^>]+>/g, '')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '&quot;');
    if (readAloudText) {
      backHtml += `
        <button type="button" class="no-print" onclick="event.stopPropagation(); window.speakVocabWord && window.speakVocabWord('${readAloudText}', this);" style="width:100%;padding:8px 12px;border-radius:8px;border:1.5px solid #93c5fd;background:#eff6ff;color:#1d4ed8;font-weight:800;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;margin-top:2px;">
          <i class="fa-solid fa-volume-high"></i> Read Card Aloud
        </button>`;
    }
  } else {
    if (person.origins) {
      hasDetailedContent = true;
      backHtml += `
        <div style="background: rgba(100, 116, 139, 0.1); border-left: 3px solid #64748b; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <strong style="color: #475569; display: block; margin-bottom: 3px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">${isOrg ? 'Origins &amp; Ideology' : 'Origins &amp; Worldview'}</strong>
          <span style="font-size: 0.88rem; color: var(--text-main); display: block; line-height: 1.48;">${fmtInlineDossierText(person.origins)}</span>
        </div>`;
    }

    if (person.actions) {
      hasDetailedContent = true;
      backHtml += `
        <div style="background: rgba(59, 130, 246, 0.09); border-left: 3px solid #3b82f6; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <strong style="color: #2563eb; display: block; margin-bottom: 3px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">${isOrg ? 'Methods &amp; Key Actions' : 'Core Actions'}</strong>
          <span style="font-size: 0.88rem; color: var(--text-main); display: block; line-height: 1.48;">${fmtInlineDossierText(person.actions)}</span>
        </div>`;
    }
    if (person.strategic_actions) {
      hasDetailedContent = true;
      const actionsList = Array.isArray(person.strategic_actions)
        ? `<ul style="margin-top: 4px; padding-left: 18px; margin-bottom: 0;"><li>${person.strategic_actions.map((a) => fmtInlineDossierText(a)).join('</li><li style="margin-top:4px;">')}</li></ul>`
        : fmtInlineDossierText(person.strategic_actions);
      backHtml += `
        <div style="background: rgba(59, 130, 246, 0.09); border-left: 3px solid #3b82f6; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <strong style="color: #2563eb; display: block; margin-bottom: 3px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">${isOrg ? 'Methods &amp; Key Actions' : 'Strategic Decisions &amp; Actions'}</strong>
          <span style="font-size: 0.88rem; color: var(--text-main); display: block; line-height: 1.48;">${actionsList}</span>
        </div>`;
    }
    if (person.achievements) {
      hasDetailedContent = true;
      const achievementsList = Array.isArray(person.achievements)
        ? `<ul style="margin-top: 4px; padding-left: 18px; margin-bottom: 0;"><li>${person.achievements.map((a) => fmtInlineDossierText(a)).join('</li><li style="margin-top:4px;">')}</li></ul>`
        : fmtInlineDossierText(person.achievements);
      const headingLabel =
        isOrg && !person.strategic_actions && !person.actions
          ? 'Methods &amp; Key Actions'
          : 'Key Roles &amp; Turning Points';
      backHtml += `
        <div style="background: rgba(30, 64, 175, 0.07); border-left: 3px solid #1e40af; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <strong style="color: #1e40af; display: block; margin-bottom: 3px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">${headingLabel}</strong>
          <span style="font-size: 0.88rem; color: var(--text-main); display: block; line-height: 1.48;">${achievementsList}</span>
        </div>`;
    }
    if (person.key_distinction) {
      hasDetailedContent = true;
      backHtml += `
        <div style="background: rgba(217, 119, 6, 0.1); border-left: 3px solid #d97706; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <strong style="color: #b45309; display: block; margin-bottom: 3px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Key Distinction (Don&rsquo;t Confuse)</strong>
          <span style="font-size: 0.88rem; color: var(--text-main); display: block; line-height: 1.48;">${fmtInlineDossierText(person.key_distinction)}</span>
        </div>`;
    }
    if (person.limitations) {
      hasDetailedContent = true;
      backHtml += `
        <div style="background: rgba(239, 68, 68, 0.09); border-left: 3px solid #ef4444; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <strong style="color: #dc2626; display: block; margin-bottom: 3px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Structural Limitations</strong>
          <span style="font-size: 0.88rem; color: var(--text-main); display: block; line-height: 1.48;">${fmtInlineDossierText(person.limitations)}</span>
        </div>`;
    }
    if (person.significance && person.bio) {
      hasDetailedContent = true;
      backHtml += `
        <div style="background: rgba(16, 185, 129, 0.09); border-left: 3px solid #059669; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <strong style="color: #047857; display: block; margin-bottom: 3px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Historical Significance</strong>
          <span style="font-size: 0.88rem; color: var(--text-main); display: block; line-height: 1.48;">${fmtInlineDossierText(person.significance)}</span>
        </div>`;
    }

    const rawQuotes = person.quotes || person.quote;
    if (rawQuotes) {
      hasDetailedContent = true;
      const quotesHtml = Array.isArray(rawQuotes)
        ? rawQuotes.map((q) => `&ldquo;${fmtInlineDossierText(q)}&rdquo;`).join('<br><br>')
        : `&ldquo;${fmtInlineDossierText(rawQuotes)}&rdquo;`;
      const citationHtml = person.citation
        ? `<span style="display: block; margin-top: 5px; font-style: normal; font-size: 0.78rem; color: #64748b; font-weight: 600;">&mdash; ${fmtInlineDossierText(person.citation)}</span>`
        : '';
      backHtml += `
        <div style="background: rgba(168, 85, 247, 0.09); border-left: 3px solid #a855f7; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
          <strong style="color: #7e22ce; display: block; margin-bottom: 3px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Primary Testimony / Quote</strong>
          <span style="font-size: 0.88rem; color: var(--text-main); display: block; font-style: italic; line-height: 1.48;">${quotesHtml}${citationHtml}</span>
        </div>`;
    }
  }

  if (!hasDetailedContent) {
    backHtml += `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-style: italic; background: rgba(0,0,0,0.02); border-radius: 8px;">Detailed revision notes for this dossier are currently being compiled.</div>`;
  }

  backHtml += `<div style="text-align: center; margin-top: auto; padding-top: 12px; font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-undo"></i> Tap to flip back</div>`;

  const lifespanHtml = dateLabel
    ? `<p style="font-size: 0.84rem; color: var(--text-muted); margin: 0 0 8px 0; font-weight: 600;">${dateLabel}</p>`
    : '';

  const aliasesStr = Array.isArray(person.aliases) ? person.aliases.join('|') : '';
  const onclickAttr = hasDetailedContent ? `onclick="this.classList.toggle('flipped')"` : '';
  const cursorStyle = hasDetailedContent ? 'cursor: pointer;' : 'cursor: default;';
  const flipPromptHtml = hasDetailedContent
    ? `<div style="text-align: center; margin-top: auto; padding-top: 14px; font-size: 0.83rem; color: ${pillColor}; font-weight: 700;"><i class="fas fa-sync-alt" style="margin-right: 5px;"></i> ${isKs2 ? 'Tap to Flip Trading Card' : 'Tap to Open Dossier'}</div>`
    : '';

  return `
    <div class="person-card" data-has-back="${hasDetailedContent ? 'true' : 'false'}" data-entity-type="${entityTypeAttr}" data-agent-name="${(person.name || '').replace(/"/g, '&quot;')}" data-agent-aliases="${aliasesStr.replace(/"/g, '&quot;')}" ${onclickAttr} style="height: 100%; ${cursorStyle}">
      <div class="card-inner">
        <div class="card-front">
          ${frontImgHtml}
          <div style="padding: 18px 20px; flex: 1; display: flex; flex-direction: column;">
            <div style="margin-bottom: 6px;">
              <span style="display: inline-flex; align-items: center; gap: 4px; background: ${pillBg}; color: ${pillColor}; border: 1px solid ${pillBorder}; font-size: 0.66rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 7px; border-radius: 999px;">
                <i class="fa-solid ${pillIcon}"></i> ${pillText}
              </span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; margin: 0 0 4px 0;">
              <h3 style="margin: 0; color: var(--primary); font-family: var(--font-heading); font-size: 1.2rem; line-height: 1.28;">${person.name}</h3>
              ${buildEntityPronounceBtnHTML(person, false)}
            </div>
            ${lifespanHtml}
            <p style="margin: 0 0 10px 0; color: var(--text-muted); font-size: 0.81rem; font-weight: 700; text-transform: ${isKs2 ? 'none' : 'uppercase'}; letter-spacing: ${isKs2 ? '0.01em' : '0.06em'}; line-height: 1.35;">${isKs2 ? String(person.role || person.group || '').split(/[—;]/)[0].trim() : person.role || person.group || ''}</p>
            ${basicBio}
            ${flipPromptHtml}
          </div>
        </div>
        ${hasDetailedContent ? `<div class="card-back">${backHtml}</div>` : ''}
      </div>
    </div>
  `;
}

export function initKeyIndividualsTask(
  container,
  keyIndividualsData,
  customTitle,
  customDescription,
) {
  if (!keyIndividualsData || keyIndividualsData.length === 0) return;

  let style = document.getElementById('flip-card-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'flip-card-styles';
    document.head.appendChild(style);
  }
  style.innerHTML = `
    .person-card {
      background: transparent;
      cursor: pointer;
    }
    .person-card.agent-highlight-ring .card-inner {
      outline: 3px solid #4f46e5;
      outline-offset: 4px;
      border-radius: 12px;
      box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.35), 0 12px 28px rgba(79, 70, 229, 0.28);
      animation: agentTargetPulse 1.2s ease-in-out 2;
    }
    @keyframes agentTargetPulse {
      0%, 100% { box-shadow: 0 0 0 5px rgba(245, 158, 11, 0.35), 0 12px 28px rgba(79, 70, 229, 0.28); }
      50% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0.55), 0 16px 34px rgba(79, 70, 229, 0.4); }
    }
    .card-inner {
      position: relative;
      height: 100%;
      perspective: 1000px;
    }
    .person-card:hover:not(.flipped) .card-inner {
      transform: translateY(-4px);
      -webkit-transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.14);
    }
    .card-front, .card-back {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
      -webkit-transition: -webkit-transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
      background: var(--bg-card, #ffffff);
      border: 1px solid var(--border-glass, #e2e8f0);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
    }
    .card-front {
      position: relative;
      transform: rotateY(0deg);
      -webkit-transform: rotateY(0deg);
      height: 100%;
    }
    .card-back {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: rotateY(180deg);
      -webkit-transform: rotateY(180deg);
      padding: 18px;
      overflow-y: auto;
      box-sizing: border-box;
    }
    .person-card.flipped .card-front {
      transform: rotateY(-180deg);
      -webkit-transform: rotateY(-180deg);
    }
    .person-card.flipped .card-back {
      transform: rotateY(0deg);
      -webkit-transform: rotateY(0deg);
    }
    .agent-filter-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8px;
      margin: 18px auto 0 auto;
    }
    .agent-filter-pill {
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      border-radius: 999px;
      padding: 7px 16px;
      font-size: 0.84rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .agent-filter-pill:hover {
      border-color: #94a3b8;
      background: #f8fafc;
    }
    .agent-filter-pill.active[data-filter="all"] {
      background: #0f172a;
      color: #ffffff;
      border-color: #0f172a;
    }
    .agent-filter-pill.active[data-filter="person"] {
      background: #1d4ed8;
      color: #ffffff;
      border-color: #1d4ed8;
    }
    .agent-filter-pill.active[data-filter="organisation"] {
      background: #0f766e;
      color: #ffffff;
      border-color: #0f766e;
    }

    /* Premium Banner Styles */
    .premium-banner {
      position: relative; overflow: hidden; border-radius: 12px; padding: 25px 30px; margin-top: 30px; margin-bottom: 20px; 
      box-shadow: 0 10px 25px -10px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: flex-start; gap: 8px; 
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: default;
    }
    .premium-banner:hover {
      transform: scale(1.01) translateY(-3px);
      box-shadow: 0 15px 30px -10px rgba(0,0,0,0.5);
    }
    .premium-banner-bg {
      position: absolute; top: -5%; left: -5%; width: 110%; height: 110%; 
      background-position: center; background-size: cover; 
      z-index: 1; filter: brightness(0.9); transition: transform 0.8s ease;
    }
    .premium-banner:hover .premium-banner-bg {
      transform: scale(1.03);
    }
    .premium-banner-overlay-1 {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
      background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%); z-index: 2;
    }
    .premium-banner-overlay-2 {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
      opacity: 0.45; mix-blend-mode: multiply; z-index: 3;
    }
    .premium-banner-glow {
      position: absolute; bottom: -50px; right: -50px; width: 300px; height: 300px; 
      filter: blur(40px); z-index: 3; opacity: 0.6; border-radius: 50%;
    }
    .premium-banner-content {
      position: relative; z-index: 4; padding-left: 20px;
    }
    .premium-banner-title {
      margin: 0; color: #ffffff; font-size: 2rem; font-weight: 700; 
      font-family: 'Playfair Display', serif; text-shadow: 0px 4px 12px rgba(0,0,0,0.8); letter-spacing: -0.5px;
    }
    .premium-banner-enquiry {
      margin: 8px 0 0 0; color: #f8fafc; font-size: 1.05rem; font-style: italic; 
      max-width: 800px; font-weight: 300; text-shadow: 0px 2px 8px rgba(0,0,0,0.8);
    }
  `;

  const orgCount = keyIndividualsData.filter(isOrganisationEntity).length;
  const personCount = keyIndividualsData.length - orgCount;
  const hasOrgs = orgCount > 0;

  const wrapper = document.createElement('div');
  wrapper.className = 'key-individuals-wrapper fade-in';
  wrapper.style.padding = '20px';
  wrapper.style.maxWidth = '1220px';
  wrapper.style.margin = '0 auto';

  const header = document.createElement('div');
  header.style.textAlign = 'center';
  header.style.marginBottom = '32px';
  const isKs2Gallery =
    isKs2ActiveContext() || (keyIndividualsData[0] && isKs2UnitId(keyIndividualsData[0].unitId));
  const title =
    customTitle ||
    (isKs2Gallery
      ? 'People Who Shaped the Story'
      : hasOrgs
        ? 'Key Individuals & Organisations'
        : 'Key Individuals');
  const desc =
    customDescription ||
    (isKs2Gallery
      ? 'Meet the real people and groups from this history topic! Tap any trading card to flip it over, or tap the speaker icon to hear how to say their name.'
      : hasOrgs
        ? 'Dossiers on the decisive leaders, movements, and institutions that shaped these events. Tap any card to inspect origins, actions, and key distinctions.'
        : 'Profiles of the major historical figures who shaped these events. Tap any card to inspect their dossier.');

  const filterBarHtml = hasOrgs
    ? `
      <div class="agent-filter-bar" role="tablist" aria-label="Filter historical cards">
        <button type="button" class="agent-filter-pill active" data-filter="all">
          <span>${isKs2Gallery ? 'All Cards' : 'All Dossiers'} (${keyIndividualsData.length})</span>
        </button>
        <button type="button" class="agent-filter-pill" data-filter="person">
          <i class="fa-solid fa-user-tie"></i>
          <span>People (${personCount})</span>
        </button>
        <button type="button" class="agent-filter-pill" data-filter="organisation">
          <i class="fa-solid fa-landmark"></i>
          <span>${isKs2Gallery ? 'Groups' : 'Organisations'} (${orgCount})</span>
        </button>
      </div>
    `
    : '';

  header.innerHTML = `
    <h1 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 10px; font-size: clamp(1.8rem, 4vw, 2.45rem);">${title}</h1>
    <p style="color: var(--text-muted); font-size: 1.02rem; max-width: 680px; margin: 0 auto; line-height: 1.5;">${desc}</p>
    ${filterBarHtml}
  `;
  wrapper.appendChild(header);

  const grouped = Boolean(keyIndividualsData.length > 0 && keyIndividualsData[0].group);

  const bannerMap = {
    'Key Topic 1': {
      title: 'Key Topic 1: The Weimar Republic (1918-29)',
      image: 'images/weimar_kt1_cover.jpg',
      gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      border: '#3b82f6',
      enquiry: 'To what extent did the Weimar Republic recover from its early crises?',
    },
    'Key Topic 2': {
      title: "Key Topic 2: Hitler's Rise to Power, 1919-33",
      image: 'images/weimar_kt2_cover.jpg',
      gradient: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
      border: '#dc2626',
      enquiry: 'How did a tiny obscure political group transform?',
    },
    'Key Topic 3': {
      title: 'Key Topic 3: Nazi Control and Dictatorship',
      image: 'images/weimar_kt3_cover.jpg',
      gradient: 'linear-gradient(135deg, #4b5563, #1f2937)',
      border: '#1f2937',
      enquiry: 'From chains to absolute control',
    },
    'Key Topic 4': {
      title: 'Key Topic 4: Life in Nazi Germany, 1933-39',
      image: 'images/weimar_kt4_cover.jpg',
      gradient: 'linear-gradient(135deg, #4d7c0f, #65a30d)',
      border: '#65a30d',
      enquiry: 'Did life improve under the Nazis?',
    },
  };

  if (grouped) {
    const groupOrder = [];
    const groupBuckets = new Map();

    keyIndividualsData.forEach((person) => {
      const grp = person.group || 'Other';
      if (!groupBuckets.has(grp)) {
        groupOrder.push(grp);
        groupBuckets.set(grp, []);
      }
      groupBuckets.get(grp).push(person);
    });

    let htmlContent = '';
    groupOrder.forEach((grp) => {
      const members = groupBuckets.get(grp) || [];
      if (members.length === 0) return;

      htmlContent += `<section class="agent-group-block" data-group="${String(grp).replace(/"/g, '&quot;')}">`;

      const bannerData = bannerMap[grp];
      if (bannerData) {
        const bannerUrl =
          typeof getAssetUrl === 'function'
            ? getAssetUrl('/' + bannerData.image)
            : '/' + bannerData.image;
        htmlContent += `
          <div class="agent-group-section" style="margin-top: 40px; margin-bottom: 25px;">
            <div class="premium-banner" style="position: relative; margin: 0; min-height: 140px;">
              <div class="premium-banner-bg" style="background-image: url('${bannerUrl}'); background-position: center;"></div>
              <div class="premium-banner-overlay-1"></div>
              <div class="premium-banner-overlay-2" style="background: ${bannerData.gradient};"></div>
              <div class="premium-banner-glow" style="background: radial-gradient(circle, ${bannerData.border} 0%, transparent 70%);"></div>
              <div class="premium-banner-content" style="border-left: 6px solid ${bannerData.border};">
                <h3 class="premium-banner-title">${bannerData.title}</h3>
                <p class="premium-banner-enquiry">${bannerData.enquiry}</p>
              </div>
            </div>
          </div>
        `;
      } else {
        htmlContent += `
          <h2 class="agent-group-heading" style="margin-top: 40px; margin-bottom: 20px; color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 10px;">
            ${grp}
          </h2>
        `;
      }

      htmlContent += `<div class="agent-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(265px, 1fr)); gap: 20px; align-items: stretch;">`;
      members.forEach((person) => {
        htmlContent += generateKeyIndividualCardHTML(person);
      });
      htmlContent += `</div></section>`;
    });

    wrapper.insertAdjacentHTML('beforeend', htmlContent);
  } else {
    const grid = document.createElement('div');
    grid.className = 'agent-cards-grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(265px, 1fr))';
    grid.style.gap = '20px';
    grid.style.alignItems = 'stretch';

    let gridHtml = '';
    keyIndividualsData.forEach((person) => {
      gridHtml += generateKeyIndividualCardHTML(person);
    });
    grid.innerHTML = gridHtml;
    wrapper.appendChild(grid);
  }

  if (hasOrgs) {
    const applyFilter = (filterVal) => {
      wrapper.querySelectorAll('.agent-filter-pill').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.filter === filterVal);
      });
      wrapper.querySelectorAll('.person-card').forEach((card) => {
        const matches = filterVal === 'all' || card.dataset.entityType === filterVal;
        card.style.display = matches ? '' : 'none';
      });
      wrapper.querySelectorAll('.agent-group-block').forEach((groupBlock) => {
        const hasVisibleCard = Array.from(groupBlock.querySelectorAll('.person-card')).some(
          (card) => card.style.display !== 'none',
        );
        groupBlock.style.display = hasVisibleCard ? '' : 'none';
      });
    };
    wrapper.querySelectorAll('.agent-filter-pill').forEach((btn) => {
      btn.addEventListener('click', () => applyFilter(btn.dataset.filter || 'all'));
    });
  }

  container.appendChild(wrapper);
}

export async function jumpToKeyIndividual(personName) {
  if (typeof window === 'undefined') return;

  const cleanTarget = String(personName || '').trim();
  if (
    window._jumpingToAgentName === cleanTarget &&
    window._jumpingToAgentTs &&
    Date.now() - window._jumpingToAgentTs < 220
  ) {
    return;
  }
  window._jumpingToAgentName = cleanTarget;
  window._jumpingToAgentTs = Date.now();

  // Save exact lesson or timeline return origin FIRST before switching views
  if (typeof window.saveUnitReturnOrigin === 'function') {
    window.saveUnitReturnOrigin();
  }

  const targetUnit =
    window.currentUnitId ||
    (window.state && window.state.selectedUnitId) ||
    (window.appStore && window.appStore.state && window.appStore.state.selectedUnitId) ||
    'cme_new';

  if (targetUnit && typeof window.switchView === 'function') {
    await window.switchView('individuals', targetUnit);
  }

  if (typeof window.updateHeaderBackBtn === 'function') {
    window.updateHeaderBackBtn('individuals');
  }

  setTimeout(() => {
    const allPill = document.querySelector('.agent-filter-pill[data-filter="all"]');
    if (allPill && !allPill.classList.contains('active')) {
      allPill.click();
    }

    const needle = cleanTarget.toLowerCase();
    const cards = document.querySelectorAll('.person-card');
    let targetCard = null;

    // Pass 1: exact name or exact alias match
    cards.forEach((card) => {
      if (targetCard) return;
      const cardName = (card.dataset.agentName || '').trim().toLowerCase();
      const aliases = (card.dataset.agentAliases || '')
        .toLowerCase()
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      if (cardName === needle || aliases.includes(needle)) {
        targetCard = card;
      }
    });

    // Pass 2: substring match on card name, alias, or h3 heading
    if (!targetCard && needle) {
      cards.forEach((card) => {
        if (targetCard) return;
        const cardName = (card.dataset.agentName || '').trim().toLowerCase();
        const aliases = (card.dataset.agentAliases || '')
          .toLowerCase()
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean);
        const h3 = card.querySelector('h3');
        const h3Text = h3 ? h3.innerText.trim().toLowerCase() : '';
        if (
          cardName.includes(needle) ||
          (cardName.length > 2 && needle.includes(cardName)) ||
          aliases.some((a) => a.includes(needle) || (a.length > 2 && needle.includes(a))) ||
          h3Text.includes(needle)
        ) {
          targetCard = card;
        }
      });
    }

    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetCard.classList.add('agent-highlight-ring');
      if (targetCard.dataset.hasBack === 'true') {
        targetCard.classList.add('flipped');
      }
      setTimeout(() => {
        targetCard.classList.remove('agent-highlight-ring');
      }, 2800);
    }
  }, 140);
}

if (typeof window !== 'undefined') {
  window.jumpToKeyIndividual = jumpToKeyIndividual;
}
