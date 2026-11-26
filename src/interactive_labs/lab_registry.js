/**
 * Sidecar Interactive Classroom Lab Registry (`lab_registry.js`)
 *
 * Cleanly nests interactive simulations inside specific canonical lessons
 * WITHOUT adding extra lessons, bloating unit JSON schemas, or touching
 * textbooks, workbooks, retrieval packs, or Studio TTS lesson hashes.
 */

const LAB_CATALOG = {
  'medieval_england:lesson_2:3': {
    labId: 'domesday_stubitone',
    unitId: 'medieval_england',
    lessonIndex: 1,
    kicker: '🏰 LOCAL HISTORY INTERACTIVE ADVENTURE • FAREHAM, STUBBINGTON & THE SOLENT (1086)',
    title: 'The Secret of Stubitone™: The 1086 Royal Domesday Audit',
    subtitle:
      'Rewind your own Solent coastline 940 years, catch Sweating Reeve Odo hiding Fareham’s 5 watermills, rule on King Edward’s Viking tax break, decode Stubbington’s real 1086 Latin parchment, and spot what Domesday missed!',
    coverImg: '/images/arcade/domesday/cover_secret_of_stubitone.webp',
    badges: ['Full-Screen Touch Ready', '60 FPS Living Scenes', 'Acted Studio Voices', 'Open Domesday 1086 Data'],
    loadMount: () => import('./domesday_stubitone.js').then((m) => m.mountDomesdayStubitone),
  },
};

export function getInlineLessonLabHTML(unitId, lessonId, blockIndex) {
  const key = `${unitId}:${lessonId}:${blockIndex}`;
  const spec = LAB_CATALOG[key];
  if (!spec) return '';

  return `
    <div id="hh-inline-lab-${spec.labId}" class="hh-inline-lab-card no-print" style="margin: 18px 0 26px 0; border-radius: 16px; overflow: hidden; border: 2.5px solid #d97706; background: linear-gradient(135deg, #1c1917 0%, #0f172a 100%); box-shadow: 0 14px 32px rgba(15, 23, 42, 0.24); color: #f8fafc; max-width: 100%;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); align-items: stretch;">
        <div style="position: relative; min-height: 205px; background: #090d16; overflow: hidden; cursor: pointer;"
             onclick="window.openInteractiveClassroomLab && window.openInteractiveClassroomLab('${spec.labId}', true)">
          <img src="${spec.coverImg}" alt="${spec.title}" loading="lazy"
               style="width: 100%; height: 100%; object-fit: cover; display: block;" />
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(9,13,22,0.55) 0%, rgba(9,13,22,0.1) 50%, rgba(9,13,22,0.75) 100%);"></div>
          <div style="position: absolute; top: 10px; left: 12px; background: rgba(12,10,9,0.86); border: 1px solid #f59e0b; color: #fde68a; font-size: 0.68rem; font-weight: 900; padding: 3px 10px; border-radius: 999px; letter-spacing: 0.8px;">
            ▶ CLICK TO PLAY IN FULL-SCREEN
          </div>
        </div>

        <div style="padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
          <div>
            <div style="font-size: 0.72rem; font-weight: 900; color: #fbbf24; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 4px;">
              ${spec.kicker}
            </div>
            <h4 style="margin: 0 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 1.32rem; color: #fef3c7; line-height: 1.2;">
              ${spec.title}
            </h4>
            <p style="margin: 0 0 10px 0; font-size: 0.9rem; color: #cbd5e1; line-height: 1.45;">
              ${spec.subtitle}
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${spec.badges
                .map(
                  (b) =>
                    `<span style="font-size: 0.7rem; font-weight: 800; padding: 3px 9px; border-radius: 999px; background: rgba(245, 158, 11, 0.16); border: 1px solid rgba(251, 191, 36, 0.45); color: #fde68a;">${b}</span>`,
                )
                .join('')}
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
            <button type="button"
                    onclick="window.openInteractiveClassroomLab && window.openInteractiveClassroomLab('${spec.labId}', true)"
                    style="flex: 1 1 210px; min-height: 46px; padding: 10px 18px; border-radius: 10px; border: 2px solid #fef08a; background: linear-gradient(180deg, #ea580c 0%, #9a3412 100%); color: #ffffff; font-size: 0.92rem; font-weight: 900; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 6px 16px rgba(234, 88, 12, 0.38);">
              <i class="fa-solid fa-expand"></i> Launch Full-Screen Adventure
            </button>
            <button type="button"
                    onclick="window.openInteractiveClassroomLab && window.openInteractiveClassroomLab('${spec.labId}', false)"
                    style="min-height: 46px; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #475569; background: #1e293b; color: #e2e8f0; font-size: 0.84rem; font-weight: 800; cursor: pointer;">
              Play Windowed
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

let activeLabCleanup = null;

export async function openInteractiveClassroomLab(labId, preferFullscreen = true) {
  const entry = Object.values(LAB_CATALOG).find((x) => x.labId === labId);
  if (!entry || typeof document === 'undefined') return;

  if (activeLabCleanup) {
    try {
      activeLabCleanup();
    } catch (_) {}
    activeLabCleanup = null;
  }

  let modal = document.getElementById('hh-classroom-lab-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'hh-classroom-lab-modal';
    document.body.appendChild(modal);
  }

  modal.style.cssText =
    'position:fixed;inset:0;z-index:99990;background:rgba(9,13,22,0.92);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:' +
    (preferFullscreen ? '0' : '16px') +
    ';overflow-y:auto;';
  modal.innerHTML = `<div id="hh-classroom-lab-stage" style="width:100%;max-width:${preferFullscreen ? 'none' : '1180px'};"></div>`;

  document.body.classList.add('hh-arcade-playing');

  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  const closeModal = () => {
    window.removeEventListener('keydown', onKeyDown);
    document.body.classList.remove('hh-arcade-playing');
    if (activeLabCleanup) {
      try {
        activeLabCleanup();
      } catch (_) {}
      activeLabCleanup = null;
    }
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    modal.remove();
  };

  window.addEventListener('keydown', onKeyDown);
  modal.addEventListener('click', (e) => {
    if (e.target === modal && !preferFullscreen) closeModal();
  });

  const mountFn = await entry.loadMount();
  const stageEl = modal.querySelector('#hh-classroom-lab-stage');
  if (stageEl) {
    activeLabCleanup = mountFn(stageEl, {}, { autoFullscreen: preferFullscreen, onCloseModal: closeModal });
  }
}

export function renderTopBarLabLauncherHTML(unitId, lessonId) {
  const match = Object.entries(LAB_CATALOG).find(([k]) => k.startsWith(`${unitId}:${lessonId}:`));
  if (!match) return '';
  const spec = match[1];
  return `<button type="button" class="btn btn-lesson-lab-launcher no-print" onclick="window.openInteractiveClassroomLab && window.openInteractiveClassroomLab('${spec.labId}', true)" style="padding: 6px 12px; font-size: 0.86rem; background: linear-gradient(180deg, #ea580c 0%, #9a3412 100%); color: #fef08a; border: 1.5px solid #fde047; font-weight: 800; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 8px rgba(234, 88, 12, 0.35);" title="Launch Full-Screen Interactive Local History Adventure: ${spec.title}"><i class="fa-solid fa-chess-rook" style="color: #fde047;"></i> <span>1086 Domesday Lab</span></button>`;
}

if (typeof window !== 'undefined') {
  window.openInteractiveClassroomLab = openInteractiveClassroomLab;
}
