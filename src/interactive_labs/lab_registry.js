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
    launcherIcon: 'fa-key',
    launcherLabel: '1086 Domesday Escape Room',
    kicker: '🔐 HISTORY ESCAPE ROOM • NORMAN HAMPSHIRE (1086)',
    title: 'Escape the 1086 Domesday Audit: Stubitone & Fareham',
    subtitle:
      'Travel back 940 years with peasant guide Bennet Luvet: reassemble a torn Bayeux charter, crack Reeve Odo’s 3-dial tax vault, solve the 1066 land-wipeout map, and decode Folio 46v Latin.',
    coverImg: '/images/medieval_england/tres_riches_heures_ox_plough_f3v.jpg',
    badges: ['Official Escape Room', '4 Historical Locks', '11 Acted Voices', 'Folio 46v Primary Data'],
    loadMount: () => import('./domesday_stubitone.js').then((m) => m.mountDomesdayStubitone),
  },
  'ks2_ww2:lesson_2:2': {
    labId: 'ww2_homefront',
    unitId: 'ks2_ww2',
    lessonIndex: 1,
    launcherIcon: 'fa-key',
    launcherLabel: '1939 Home Front Escape Room',
    kicker: '🔐 HISTORY ESCAPE ROOM • BRITAIN’S HOME FRONT (1939–1945)',
    title: 'The Home Front Escape (1939–1945)',
    subtitle:
      'Crack four historical locks from Platform Four to VE Day 1945: pack an official evacuee suitcase, pass the Blitz shelter inspection, dial the 1941 Ration Vault (1–2–4–8), and crack Bletchley Park Enigma Rotors (B–R–K).',
    coverImg: '/units/ks2_ww2/assets/banner_unit_hero.jpg',
    badges: ['Official Escape Room', '4 Historical Locks', 'IWM Archival Plates', 'Acted Studio Voices'],
    loadMount: () => import('./ww2_homefront.js').then((m) => m.mountWw2HomeFront),
  },
  'monarchy_religion_power:lesson_2:2': {
    labId: 'elizabeth_mary_escape',
    unitId: 'monarchy_religion_power',
    lessonIndex: 1,
    launcherIcon: 'fa-key',
    launcherLabel: 'Elizabeth I Escape Room',
    kicker: '🎬 CINEMATIC HISTORY ESCAPE ROOM • MARY, QUEEN OF SCOTS (1568–1587)',
    title: 'The Cipher of Fotheringhay: Escape of Mary, Queen of Scots (1568–1587)',
    subtitle:
      'Watch the Tudor cinematic opening and play as Mary, Queen of Scots across Lochleven Castle, the Northern Earls, Ridolfi, Throckmorton, and Babington beer-barrel cipher—while Sir Francis Walsingham closes the net.',
    coverImg: '/images/upgraded/gcse-med-eee/eee_mary_queen_of_scots_hilliard.jpg',
    badges: ['Official Escape Room', 'Cinematic Opening', 'Real 1586 Cipher', 'Fotheringhay Finale'],
    loadMount: () => import('./elizabeth_mary_escape.js').then((m) => m.mountElizabethMaryEscape),
  },
  'eee:lesson_2_1:2': {
    labId: 'elizabeth_mary_escape',
    unitId: 'eee',
    lessonIndex: 4,
    launcherIcon: 'fa-key',
    launcherLabel: 'Mary, Queen of Scots Escape Room',
    kicker: '🎬 CINEMATIC HISTORY ESCAPE ROOM • MARY, QUEEN OF SCOTS (1568–1587)',
    title: 'The Cipher of Fotheringhay: Escape of Mary, Queen of Scots (1568–1587)',
    subtitle:
      'Play as Mary, Queen of Scots across the Northern Earls, Ridolfi, Throckmorton, and Babington Plots—decoding her real 1586 cipher before Walsingham’s trap snaps shut at Fotheringhay.',
    coverImg: '/images/upgraded/gcse-med-eee/eee_mary_queen_of_scots_hilliard.jpg',
    badges: ['Official Escape Room', 'Cinematic Opening', 'Real 1586 Cipher', 'Edexcel KT2 Aligned'],
    loadMount: () => import('./elizabeth_mary_escape.js').then((m) => m.mountElizabethMaryEscape),
  },
  'ks2_stone_to_iron_age:lesson_5:2': {
    labId: 'ks2_must_farm_lab',
    unitId: 'ks2_stone_to_iron_age',
    lessonIndex: 4,
    launcherIcon: 'fa-fire-flame-curved',
    launcherLabel: 'Must Farm Detective Lab',
    kicker: '🔥 KS2 INTERACTIVE ARCHAEOLOGY LAB • CAMBRIDGESHIRE FENS (c. 850 BC)',
    title: 'Embers Over the Fen: The Must Farm Bronze Age Detective Lab (c. 850 BC)',
    subtitle:
      'Step inside a Bronze Age roundhouse on oak stilts, test why waterlogged river mud froze wooden bowls and porridge in time, excavate six real trench finds including Britain’s oldest complete wheel, and sort overseas trade clues!',
    coverImg: '/units/ks2_stone_to_iron_age/assets/must_farm_stilt_village_dig.jpg',
    badges: ['KS2 Ages 9–11', '60 FPS Cutaway Scenes', 'Read-Aloud Narration', 'Real Must Farm Finds'],
    loadMount: () => import('./ks2_must_farm_lab.js').then((m) => m.mountKs2MustFarmLab),
  },
  'ks2_romans:lesson_4:2': {
    labId: 'ks2_vindolanda_lab',
    unitId: 'ks2_romans',
    lessonIndex: 3,
    launcherIcon: 'fa-feather-pointed',
    launcherLabel: 'Vindolanda Postbag Lab',
    kicker: '🪶 KS2 INTERACTIVE FRONTIER LAB • NORTHERN BRITAIN (c. AD 100)',
    title: 'Ink on the Frontier: The Vindolanda Roman Postbag Lab (c. AD 100)',
    subtitle:
      'Inspect a northern Roman frontier fort, decode Claudia Severa’s real birch-wood birthday invitation, pack a chilly soldier’s parcel of woollen socks and sandals, and meet families from Syria, North Africa, and Europe!',
    coverImg: '/units/ks2_romans/assets/vindolanda_birthday_tablet_291.jpg',
    badges: ['KS2 Ages 9–11', '60 FPS Frontier Scenes', 'Read-Aloud Narration', 'Real Tab. Vindol. 291'],
    loadMount: () => import('./ks2_vindolanda_lab.js').then((m) => m.mountKs2VindolandaLab),
  },
  'ks2_ancient_egypt:lesson_6:1': {
    labId: 'ks2_tutankhamun_lab',
    unitId: 'ks2_ancient_egypt',
    lessonIndex: 5,
    launcherIcon: 'fa-ankh',
    launcherLabel: 'Tomb KV62 Lab',
    kicker: '🕯️ KS2 INTERACTIVE EGYPTOLOGY LAB • VALLEY OF THE KINGS (NOVEMBER 1922)',
    title: 'Candlelight in the Valley: Opening Tomb KV62 (November 1922)',
    subtitle:
      'Uncover sixteen buried limestone steps with Hussein Abdel Rassoul and Howard Carter, pan a flickering candle across the dark Antechamber, conserve fragile 3,300-year-old treasures, and peel back four golden shrines!',
    coverImg: '/units/ks2_ancient_egypt/assets/tutankhamun_painted_chariot_chest.jpg',
    badges: ['KS2 Ages 9–11', '60 FPS Candle Peephole', 'Read-Aloud Narration', 'Ten-Year Conservation'],
    loadMount: () => import('./ks2_tutankhamun_lab.js').then((m) => m.mountKs2TutankhamunLab),
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
        '.ww2-shell.ww2-is-fullscreen #ww2-fs-btn, .dst-shell.dst-is-fullscreen #dst-fs-btn, .elz-shell.elz-is-fullscreen #elz-fs-btn, .ks2lab-shell.ks2lab-is-fullscreen [data-action="toggle-fs"]',
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
