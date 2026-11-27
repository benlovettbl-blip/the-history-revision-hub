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
    launcherIcon: 'fa-scroll',
    launcherLabel: '1086 Domesday Lab',
    kicker: '📜 LOCAL ARCHIVAL FIELDWORK LAB • FAREHAM, STUBBINGTON & THE SOLENT (1086)',
    title: 'The 1086 Hampshire Domesday Survey: Stubitone & Fareham Fieldwork Lab',
    subtitle:
      'Compare the modern Solent coastline against 1086 Domesday settlements, audit Fareham’s five watermills and enslaved ploughmen, examine King Edward’s coastal Viking tax reduction, and decode Stubbington’s Folio 46v Latin entry.',
    coverImg: '/images/ks3_med7/med7_l1_card_bayeux_norman_fleet_scene38.jpg',
    badges: ['7 Archival Stages', '11 Acted Voices', 'School-Laptop Friendly', 'Folio 46v Primary Data'],
    loadMount: () => import('./domesday_stubitone.js').then((m) => m.mountDomesdayStubitone),
  },
  'ks2_ww2:lesson_2:2': {
    labId: 'ww2_homefront',
    unitId: 'ks2_ww2',
    lessonIndex: 1,
    launcherIcon: 'fa-suitcase',
    launcherLabel: '1939 Home Front Lab',
    kicker: '🚂 KS2 ARCHIVAL FIELDWORK LAB • BRITAIN’S HOME FRONT (1939–1945)',
    title: 'The Suitcase on Platform Four: A Child’s Wartime Journey (1939–1945)',
    subtitle:
      'Pack an official 1939 evacuee suitcase, trace Operation Pied Piper rail routes across the UK, meet a Kindertransport refugee from Prague, inspect Blitz shelters and 1941 rations, and explore the Imperial War Museums archive.',
    coverImg: '/units/ks2_ww2/assets/banner_unit_hero.jpg',
    badges: ['KS2 Ages 9–11', 'IWM Archival Plates', 'Acted Studio Voices', 'IWM Archive Quest'],
    loadMount: () => import('./ww2_homefront.js').then((m) => m.mountWw2HomeFront),
  },
};

export function getInlineLessonLabHTML() {
  // Core Lesson "Church & State" Separation: never inject box-art game cards inside narrative prose.
  return '';
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
    if (e.key === 'Escape') {
      const innerFsBtn = modal.querySelector(
        '.ww2-shell.ww2-is-fullscreen #ww2-fs-btn, .dst-shell.dst-is-fullscreen #dst-fs-btn',
      );
      if (innerFsBtn) {
        e.preventDefault();
        innerFsBtn.click();
        return;
      }
      // Never auto-destroy an active game on accidental Esc press once out of fullscreen — pupils use Close button!
    }
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

  const applyModalWindowMode = (isFs) => {
    modal.style.padding = isFs ? '0' : '16px';
    const stg = modal.querySelector('#hh-classroom-lab-stage');
    if (stg) stg.style.maxWidth = isFs ? 'none' : '1180px';
  };

  window.addEventListener('keydown', onKeyDown);
  // Intentional safety guard: never close the game on stray backdrop mis-clicks around the 1180px frame!

  if (preferFullscreen && modal.requestFullscreen && !document.fullscreenElement) {
    modal.requestFullscreen().catch(() => {});
  }

  const mountFn = await entry.loadMount();
  const stageEl = modal.querySelector('#hh-classroom-lab-stage');
  if (stageEl) {
    activeLabCleanup = mountFn(
      stageEl,
      {},
      {
        autoFullscreen: preferFullscreen,
        onCloseModal: closeModal,
        onFullscreenChange: (isFs) => {
          preferFullscreen = Boolean(isFs);
          applyModalWindowMode(preferFullscreen);
        },
      },
    );
  }
}

export function renderTopBarLabLauncherHTML() {
  // Core Lesson "Church & State" Separation: keep sticky lesson header strictly academic.
  return '';
}

export function renderConsolidateLabPillHTML(unitId, lessonId) {
  const match = Object.entries(LAB_CATALOG).find(([k]) => k.startsWith(`${unitId}:${lessonId}:`));
  if (!match) return '';
  const spec = match[1];
  const iconCls = spec.launcherIcon || 'fa-scroll';
  const btnLabel = spec.launcherLabel || 'Fieldwork Lab';
  return `<button type="button" class="btn-consolidate-lab-pill no-print" onclick="window.openInteractiveClassroomLab && window.openInteractiveClassroomLab('${spec.labId}', true)" style="padding: 7px 12px; border-radius: 8px; border: 1.5px solid #d97706; background: rgba(217, 119, 6, 0.16); color: #fde68a; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" title="Open Archival Fieldwork Lab: ${spec.title}"><i class="fa-solid ${iconCls}" style="color: #fbbf24;"></i> <span>${btnLabel}</span></button>`;
}

if (typeof window !== 'undefined') {
  window.openInteractiveClassroomLab = openInteractiveClassroomLab;
}
