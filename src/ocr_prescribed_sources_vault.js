/**
 * src/ocr_prescribed_sources_vault.js
 *
 * Interactive Prescribed Sources Vault & 20-Mark Essay "Set-Source Trio Matchmaker"
 * for Cambridge OCR GCSE (9–1) Ancient History (J198) Depth & Period Studies.
 *
 * Commercial Differentiators:
 *  1. Zero-Scroll Scene-Tabbed Full Set Text Reader (Hub Classroom Classics™ modern-English translations)
 *  2. 20-Mark Essay "Set-Source Trio Matchmaker" (1 Literary + 1 Contrasting Literary/Poetic + 1 Coin/Artefact)
 *  3. Ancient Authors & Propagandists Line-Up (Time-Gap Bars + Genre + Non-Reductive AO3 Lens)
 */

function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function highlightGreenQuotesHtml(rawHtmlOrText, goldenQuotes = []) {
  if (!rawHtmlOrText) return '';
  const str = String(rawHtmlOrText);
  // Tokenize into existing <mark>...</mark> blocks, HTML tags, and plain text nodes
  // so regex NEVER touches HTML attributes (e.g. class="ocr-quote-green") or double-wraps marks!
  const tokens = str.split(/(<mark\b[^>]*>[\s\S]*?<\/mark>|<[^>]+>)/gi);

  return tokens
    .map((tok) => {
      if (!tok || tok.startsWith('<')) return tok;
      let textNode = tok.replace(/(“[^”]{3,115}”|"[^"<>]{3,115}")/g, (m) => {
        return `<mark class="ocr-quote-green">${m}</mark>`;
      });
      if (Array.isArray(goldenQuotes) && goldenQuotes.length > 0) {
        for (const gq of goldenQuotes) {
          const clean = String(gq || '').trim();
          if (!clean || clean.length < 4) continue;
          const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const subTokens = textNode.split(/(<mark\b[^>]*>[\s\S]*?<\/mark>)/gi);
          textNode = subTokens
            .map((st) => {
              if (!st || st.startsWith('<mark')) return st;
              const rx = new RegExp(`(${escaped})`, 'i');
              return st.replace(rx, '<mark class="ocr-quote-green">“$1”</mark>');
            })
            .join('');
        }
      }
      return textNode;
    })
    .join('');
}

export function collectUnitSourcesAndAuthors(unitData) {
  const lessons = Array.isArray(unitData?.lessons) ? unitData.lessons : [];
  const allSources = [];
  lessons.forEach((lesson, lIdx) => {
    const srcList = Array.isArray(lesson?.sources) ? lesson.sources : [];
    srcList.forEach((s, sIdx) => {
      allSources.push({
        ...s,
        lessonIndex: lIdx,
        lessonTitle: lesson.title || `Lesson ${lIdx + 1}`,
        sourceIndex: sIdx,
        vaultId: `${lesson.id || `l${lIdx + 1}`}_src_${sIdx + 1}`,
      });
    });
  });
  const authors = Array.isArray(unitData?.ancient_authors) ? unitData.ancient_authors : [];
  const essayTrios = Array.isArray(unitData?.essay_source_trios) ? unitData.essay_source_trios : [];
  return { allSources, authors, essayTrios };
}

export function openPrescribedSourcesVaultModal(unitId, unitData, initialTab = '', focusSourceVaultId = '') {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('ocr-prescribed-vault-modal');
  if (existing) existing.remove();

  const { allSources, authors, essayTrios } = collectUnitSourcesAndAuthors(unitData);
  const isDepth = Boolean(unitData?.is_ocr_depth_study || unitId === 'ocr_alexander' || unitId === 'ocr_cleopatra');
  const resolvedInitialTab = initialTab || (focusSourceVaultId ? 'sources' : isDepth ? 'sources' : 'authors');
  const modalTitle = isDepth
    ? 'Prescribed Set Sources & Authors Reference'
    : 'Ancient Authors & Supporting Witnesses Reference';

  const modal = document.createElement('div');
  modal.id = 'ocr-prescribed-vault-modal';
  modal.style.cssText =
    'position:fixed;inset:0;z-index:10050;background:rgba(15,23,42,0.68);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;';

  const renderSourcesGrid = () => {
    if (allSources.length === 0) {
      return `<div style="padding:28px;text-align:center;color:#64748b;">Sources for upcoming lessons will populate automatically as each Key Topic unlocks.</div>`;
    }
    return allSources
      .map((s) => {
        const isHighlighted = focusSourceVaultId && s.vaultId === focusSourceVaultId;
        const rawScenes = Array.isArray(s.full_set_scenes)
          ? s.full_set_scenes
          : Array.isArray(s.full_scenes)
            ? s.full_scenes
            : [];
        const scenes = rawScenes.length > 0 ? rawScenes : null;
        const bodyText = s.extract || s.text || '';
        const mediumBadge =
          s.medium === 'coin' || s.medium === 'archaeology' || s.image
            ? '<span style="background:#fef3c7;color:#92400e;border:1px solid #fde68a;font-size:0.72rem;font-weight:800;padding:3px 9px;border-radius:999px;text-transform:uppercase;">Archaeological / Material</span>'
            : '<span style="background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;font-size:0.72rem;font-weight:800;padding:3px 9px;border-radius:999px;text-transform:uppercase;">Literary Text</span>';

        return `
          <div id="vault-card-${escHtml(s.vaultId)}" style="background:#ffffff;border:${isHighlighted ? '2px solid #9a3412' : '1.5px solid #e2e8f0'};border-radius:14px;padding:18px 20px;box-shadow:0 3px 12px rgba(15,23,42,0.04);margin-bottom:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="background:${isDepth ? '#9a3412' : '#0f766e'};color:#ffffff;font-size:0.72rem;font-weight:800;padding:3px 10px;border-radius:6px;letter-spacing:0.03em;text-transform:uppercase;">
                  ${isDepth ? '★ Prescribed Exam Source' : s.image ? 'Archaeological Evidence' : 'Ancient Evidence'}
                </span>
                ${mediumBadge}
                <span style="font-size:0.8rem;font-weight:700;color:#64748b;">${escHtml(s.lessonTitle)}</span>
              </div>
              ${(s.time_gap_label || s.prescribed_ref) ? `<span style="background:#f8fafc;border:1px solid #cbd5e1;color:#334155;font-size:0.76rem;font-weight:700;padding:3px 10px;border-radius:999px;"><i class="fa-regular fa-clock" style="color:#9a3412;margin-right:4px;"></i>${escHtml(s.time_gap_label || s.prescribed_ref)}</span>` : ''}
            </div>
            <h4 style="margin:0 0 6px 0;font-family:'Playfair Display',serif;font-size:1.18rem;color:#0f172a;">${escHtml(s.citation || s.title || 'Ancient Source')}</h4>
            ${s.provenance ? `<div style="font-size:0.86rem;color:#64748b;font-style:italic;margin-bottom:10px;">${escHtml(s.provenance)}</div>` : ''}
            ${s.image ? `<div style="background:#0f172a;border-radius:10px;padding:10px;margin-bottom:10px;display:flex;justify-content:center;"><img src="${escHtml(s.image)}" alt="${escHtml(s.title || '')}" style="max-height:240px;object-fit:contain;display:block;" /></div>` : ''}
            ${s.plain_gist ? `<div style="background:#fff7ed;border-left:3.5px solid #ea580c;padding:9px 13px;border-radius:0 8px 8px 0;font-size:0.9rem;color:#7c2d12;margin-bottom:10px;"><strong>In plain English:</strong> ${escHtml(s.plain_gist)}</div>` : ''}
            ${
              scenes
                ? `
                  <div class="ocr-scene-tabs-wrap" data-vault-scenes="${escHtml(s.vaultId)}" style="margin-bottom:10px;">
                    <div style="display:flex;gap:0;flex-wrap:wrap;border-bottom:2px solid #e2e8f0;margin-bottom:10px;">
                      ${scenes
                        .map(
                          (sc, idx) => `
                        <button type="button" class="ocr-scene-tab-btn" data-scene-idx="${idx}" onclick="window.ocrSwitchVaultScene('${escHtml(s.vaultId)}', ${idx})" style="padding:8px 14px;border:none;border-bottom:3px solid ${idx === 0 ? '#9a3412' : 'transparent'};margin-bottom:-2px;background:transparent;font-size:0.84rem;font-weight:800;cursor:pointer;color:${idx === 0 ? '#9a3412' : '#475569'};">
                          ${escHtml(sc.tab || sc.label || `Scene ${idx + 1}`)}
                        </button>
                      `,
                        )
                        .join('')}
                    </div>
                    ${scenes
                      .map(
                        (sc, idx) => `
                      <div class="ocr-scene-panel" data-scene-panel="${idx}" style="display:${idx === 0 ? 'block' : 'none'};background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:15px 18px;font-family:'Lora',Georgia,serif;font-size:0.99rem;line-height:1.68;color:#1e293b;">
                        ${sc.heading ? `<div style="font-family:'Inter',sans-serif;font-weight:800;font-size:0.9rem;color:#9a3412;margin-bottom:8px;">${escHtml(sc.heading)}</div>` : ''}
                        ${highlightGreenQuotesHtml(escHtml(sc.text || ''), s.golden_quotes)}
                      </div>
                    `,
                      )
                      .join('')}
                  </div>
                `
                : bodyText
                  ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:15px 18px;font-family:'Lora',Georgia,serif;font-size:0.99rem;line-height:1.68;color:#1e293b;margin-bottom:10px;">${highlightGreenQuotesHtml(escHtml(bodyText), s.golden_quotes)}</div>`
                  : ''
            }
            ${
              s.ao3_how_knew || s.ao3_agenda
                ? `
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin-top:8px;">
                ${s.ao3_how_knew ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 13px;font-size:0.88rem;line-height:1.5;color:#14532d;"><strong><i class="fa-solid fa-magnifying-glass"></i> How They Knew / Value:</strong> ${escHtml(s.ao3_how_knew)}</div>` : ''}
                ${s.ao3_agenda ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px 13px;font-size:0.88rem;line-height:1.5;color:#1e3a8a;"><strong><i class="fa-solid fa-scale-balanced"></i> Genre &amp; Shaping Angle:</strong> ${escHtml(s.ao3_agenda)}</div>` : ''}
              </div>
            `
                : ''
            }
            ${
              Array.isArray(s.golden_quotes) && s.golden_quotes.length > 0
                ? `<div style="margin-top:10px;font-size:0.86rem;line-height:1.6;color:#334155;"><strong>${isDepth ? 'Key Quotes for 20m Set-Source Essays:' : 'Useful Phrases for Quoting Practice (Not Memorised Set Quotes):'}</strong> ${s.golden_quotes.map((q) => `<mark class="ocr-quote-green" style="margin-right:6px;">“${escHtml(q)}”</mark>`).join(' ')}</div>`
                : ''
            }
          </div>
        `;
      })
      .join('');
  };

  const renderAuthorsGrid = () => {
    if (authors.length === 0) {
      return `<div style="padding:24px;color:#64748b;text-align:center;">Ancient author dossiers loading for this unit.</div>`;
    }
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;">
        ${authors
          .map(
            (a) => `
          <div style="background:#ffffff;border:1.5px solid #e2e8f0;border-top:4px solid #9a3412;border-radius:12px;padding:16px;box-shadow:0 3px 10px rgba(0,0,0,0.04);">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">
              <span style="background:#fff7ed;color:#9a3412;border:1px solid #fdba74;font-size:0.68rem;font-weight:800;padding:2px 8px;border-radius:999px;text-transform:uppercase;">${escHtml(a.genre || 'Ancient Writer')}</span>
              <span style="font-size:0.74rem;font-weight:700;color:#475569;">${escHtml(a.dates || '')}</span>
            </div>
            <h4 style="margin:0 0 6px 0;font-family:'Playfair Display',serif;font-size:1.1rem;color:#0f172a;">${escHtml(a.name)}</h4>
            <div style="background:#f1f5f9;border-radius:6px;padding:6px 10px;font-size:0.76rem;font-weight:700;color:#334155;margin-bottom:10px;">
              <i class="fa-solid fa-timeline" style="color:#9a3412;margin-right:5px;"></i> ${escHtml(a.time_gap || a.timeGapBar || '')}
            </div>
            <p style="margin:0 0 8px 0;font-size:0.83rem;line-height:1.5;color:#1e293b;"><strong>How they knew / Strengths:</strong> ${escHtml(a.strengths || a.howTheyKnew || '')}</p>
            <p style="margin:0 0 10px 0;font-size:0.83rem;line-height:1.5;color:#1e293b;"><strong>Purpose &amp; angle:</strong> ${escHtml(a.limitations || a.agenda || '')}</p>
            <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:8px 10px;font-size:0.78rem;color:#991b1b;">
              <strong><i class="fa-solid fa-ban"></i> Examiner Trap Guardrail:</strong> ${escHtml(a.examiner_trap_warning || a.neverWrite || '“He wasn’t there so we cannot trust him.”')}
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  };

  const renderTriosGrid = () => {
    if (essayTrios.length === 0) {
      return `<div style="padding:24px;color:#64748b;text-align:center;">Period Studies (Persia &amp; Foundations of Rome) do not require memorised prescribed sources in the 20m Q5 essay—focus on cross-period examples and 5-mark SPaG specialist terminology!</div>`;
    }
    return essayTrios
      .map(
        (t) => `
        <div style="background:#ffffff;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px;margin-bottom:14px;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <span style="background:#ecfdf5;color:#065f46;border:1px solid #6ee7b7;font-size:0.7rem;font-weight:800;padding:3px 9px;border-radius:999px;text-transform:uppercase;">20-Mark Essay Trio (10 AO3 Marks)</span>
            <span style="font-size:0.76rem;font-weight:700;color:#9a3412;">Literary + Contrasting Witness + Physical Artefact</span>
          </div>
          <h4 style="margin:0 0 12px 0;font-family:'Playfair Display',serif;font-size:1.12rem;color:#0f172a;">Theme: ${escHtml(t.theme)}</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
            ${(t.sources || [])
              .map(
                (item, idx) =>
                  typeof item === 'string'
                    ? `
              <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:12px;">
                <div style="font-size:0.68rem;font-weight:800;color:#9a3412;text-transform:uppercase;margin-bottom:4px;">Witness ${idx + 1}</div>
                <div style="font-weight:700;font-size:0.86rem;line-height:1.45;color:#0f172a;">${escHtml(item)}</div>
              </div>`
                    : `
              <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:12px;">
                <div style="font-size:0.68rem;font-weight:800;color:#9a3412;text-transform:uppercase;margin-bottom:4px;">Witness ${idx + 1} • ${escHtml(item.role || 'Source')}</div>
                <div style="font-weight:800;font-size:0.88rem;color:#0f172a;margin-bottom:6px;">${escHtml(item.source)}</div>
                ${item.microQuote ? `<div style="margin-bottom:6px;"><mark class="ocr-quote-green">“${escHtml(item.microQuote)}”</mark></div>` : ''}
                <div style="font-size:0.79rem;line-height:1.45;color:#334155;">${escHtml(item.ao3Point || '')}</div>
              </div>
            `,
              )
              .join('')}
          </div>
        </div>
      `,
      )
      .join('');
  };

  const tabOrder = isDepth
    ? [
        { key: 'sources', icon: 'fa-scroll', label: `1. Prescribed Set Sources (${allSources.length})` },
        { key: 'authors', icon: 'fa-feather-pointed', label: `2. Ancient Authors & Time Gaps (${authors.length})` },
        { key: 'trios', icon: 'fa-bullseye', label: `3. 20m Essay Source Trios (${essayTrios.length})` },
      ]
    : [
        { key: 'authors', icon: 'fa-feather-pointed', label: `1. Ancient Authors & Time Gaps (${authors.length})` },
        { key: 'sources', icon: 'fa-book-open', label: `2. Supporting Witnesses (${allSources.length})` },
      ];

  modal.innerHTML = `
    <div style="background:#f8fafc;border-radius:16px;width:100%;max-width:1120px;height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.45);border:1.5px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#431407 0%,#7c2d12 55%,#9a3412 100%);color:#ffffff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;flex-shrink:0;">
        <div>
          <div style="font-size:0.72rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#fed7aa;margin-bottom:3px;">
            OCR GCSE (9–1) Ancient History • ${escHtml(unitData?.title || unitId)}
          </div>
          <h3 style="margin:0;font-family:'Playfair Display',serif;font-size:1.34rem;font-weight:800;color:#ffffff;">${modalTitle}</h3>
        </div>
        <button type="button" id="ocr-vault-close-btn" style="background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.35);color:#ffffff;padding:7px 14px;border-radius:8px;font-weight:800;font-size:0.84rem;cursor:pointer;">
          ✕ Close
        </button>
      </div>

      <!-- Unified Hub Underline Tab Bar -->
      <div style="background:#ffffff;border-bottom:2px solid #e2e8f0;padding:0 24px;display:flex;gap:4px;flex-wrap:wrap;flex-shrink:0;">
        ${tabOrder
          .map((t) => {
            const active = resolvedInitialTab === t.key;
            return `
              <button type="button" class="ocr-vault-nav-btn" data-vtab="${t.key}" style="padding:12px 16px;border:none;border-bottom:3px solid ${active ? '#9a3412' : 'transparent'};margin-bottom:-2px;background:transparent;font-size:0.86rem;font-weight:800;cursor:pointer;color:${active ? '#9a3412' : '#475569'};display:inline-flex;align-items:center;gap:7px;transition:color 0.15s ease;">
                <i class="fa-solid ${t.icon}"></i> <span>${t.label}</span>
              </button>
            `;
          })
          .join('')}
      </div>

      <div id="ocr-vault-body" style="padding:20px 24px;overflow-y:auto;flex:1;">
        <div id="ocr-vpanel-sources" style="display:${resolvedInitialTab === 'sources' ? 'block' : 'none'};">${renderSourcesGrid()}</div>
        <div id="ocr-vpanel-authors" style="display:${resolvedInitialTab === 'authors' ? 'block' : 'none'};">${renderAuthorsGrid()}</div>
        <div id="ocr-vpanel-trios" style="display:${resolvedInitialTab === 'trios' ? 'block' : 'none'};">${renderTriosGrid()}</div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    document.removeEventListener('keydown', onEsc);
    modal.remove();
  };
  const onEsc = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', onEsc);
  modal.querySelector('#ocr-vault-close-btn')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) closeModal();
  });

  modal.querySelectorAll('.ocr-vault-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-vtab');
      modal.querySelectorAll('.ocr-vault-nav-btn').forEach((b) => {
        const active = b.getAttribute('data-vtab') === target;
        b.style.color = active ? '#9a3412' : '#475569';
        b.style.borderBottomColor = active ? '#9a3412' : 'transparent';
      });
      ['sources', 'authors', 'trios'].forEach((k) => {
        const p = modal.querySelector(`#ocr-vpanel-${k}`);
        if (p) p.style.display = k === target ? 'block' : 'none';
      });
    });
  });

  if (focusSourceVaultId) {
    setTimeout(() => {
      const targetCard = document.getElementById(`vault-card-${focusSourceVaultId}`);
      if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }
}

if (typeof window !== 'undefined') {
  window.openPrescribedSourcesVaultModal = openPrescribedSourcesVaultModal;
  window.openOcrPrescribedSourcesVault = async function (unitId, initialTab = 'sources') {
    let uData =
      (window.currentUnitId === unitId && window.currentUnitData) ||
      window.db?.[unitId]?.data ||
      null;
    if (!uData || !Array.isArray(uData.lessons)) {
      try {
        const resp = await fetch(`/data/${unitId}.json`);
        if (resp.ok) {
          const json = await resp.json();
          uData = json?.data || json;
        }
      } catch (_) {}
    }
    openPrescribedSourcesVaultModal(unitId, uData || {}, initialTab);
  };
  window.ocrSwitchVaultScene = function (vaultId, sceneIdx) {
    const wrap = document.querySelector(`[data-vault-scenes="${vaultId}"]`);
    if (!wrap) return;
    wrap.querySelectorAll('.ocr-scene-tab-btn').forEach((btn) => {
      const active = Number(btn.getAttribute('data-scene-idx')) === Number(sceneIdx);
      btn.style.color = active ? '#9a3412' : '#475569';
      btn.style.borderBottomColor = active ? '#9a3412' : 'transparent';
    });
    wrap.querySelectorAll('.ocr-scene-panel').forEach((panel) => {
      panel.style.display =
        Number(panel.getAttribute('data-scene-panel')) === Number(sceneIdx) ? 'block' : 'none';
    });
  };
}
