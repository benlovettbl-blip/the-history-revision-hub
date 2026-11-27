/**
 * src/ocr_ancient_atlas.js
 *
 * Interactive Classical World Historical Atlas for Cambridge OCR GCSE (9–1) Ancient History (J198).
 * Uses clean physical-terrain cartography (zero modern border clutter) via lazy-loaded Leaflet,
 * with Key-Topic era filters, animated campaign route polylines, and clickable ancient site dossiers.
 */

let leafletLoadPromise = null;
let activeAtlasMap = null;

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ensureLeafletLoaded() {
  if (typeof window !== 'undefined' && window.L) {
    return Promise.resolve(window.L);
  }
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    if (!document.getElementById('ocr-leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'ocr-leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const existingScript = document.querySelector('script[src*="leaflet"]');
    if (existingScript && window.L) {
      resolve(window.L);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
  return leafletLoadPromise;
}

export const OCR_ATLAS_CONFIGS = {
  ocr_persian_empire: {
    title: 'Interactive Persian Empire Atlas (559–465 BC)',
    subtitle: 'Trace Achaemenid expansion from highland Persis across Lydia, Babylon, Egypt, and mainland Greece',
    center: [34.5, 41.5],
    zoom: 5,
    eras: [
      { id: 'all', label: 'All Eras (559–465 BC)', color: '#9a3412' },
      { id: 'KT1', label: 'KT1: Cyrus (559–530 BC)', color: '#ea580c' },
      { id: 'KT2', label: 'KT2: Cambyses (530–522 BC)', color: '#d97706' },
      { id: 'KT3', label: 'KT3: Darius I (522–486 BC)', color: '#2563eb' },
      { id: 'KT4', label: 'KT4: Xerxes I (486–465 BC)', color: '#7c3aed' },
    ],
    routes: [
      {
        era: 'KT1',
        color: '#ea580c',
        label: 'Cyrus’ Conquests (Anshan → Ecbatana → Sardis → Opis & Babylon → Pasargadae → Massagetae Steppe)',
        coords: [
          [30.01, 52.41], // Anshan
          [34.80, 48.51], // Ecbatana
          [39.88, 34.80], // Pteria / Halys
          [38.49, 28.04], // Sardis
          [33.18, 44.70], // Opis
          [32.54, 44.42], // Babylon
          [30.19, 53.17], // Pasargadae
          [41.50, 61.00], // Jaxartes / Massagetae Steppe
        ],
      },
      {
        era: 'KT2',
        color: '#d97706',
        label: 'Cambyses II’s Invasion of Egypt (525 BC)',
        coords: [
          [32.19, 48.25], // Susa
          [31.04, 32.55], // Pelusium
          [29.85, 31.25], // Memphis
        ],
      },
      {
        era: 'KT3',
        color: '#2563eb',
        label: 'Darius I’s Royal Road & 490 BC Marathon Expedition',
        coords: [
          [29.93, 52.89], // Persepolis
          [32.19, 48.25], // Susa
          [34.39, 47.43], // Bisitun
          [38.49, 28.04], // Sardis
          [37.53, 27.28], // Miletus
          [38.15, 23.97], // Marathon
        ],
      },
      {
        era: 'KT4',
        color: '#7c3aed',
        label: 'Xerxes I’s 480–479 BC Invasion of Greece',
        coords: [
          [38.49, 28.04], // Sardis
          [40.15, 26.40], // Hellespont
          [38.80, 22.54], // Thermopylae
          [37.97, 23.73], // Athens
          [37.95, 23.56], // Salamis
          [38.22, 23.27], // Plataea
        ],
      },
    ],
    sites: [
      {
        name: 'Anshan (Persis)',
        modern: 'Tall-e Malyan, Southern Iran',
        date: '559 BC',
        era: 'KT1',
        lat: 30.01,
        lng: 52.41,
        summary: 'Highland homeland where Cyrus II succeeded as tributary vassal king beneath the Median Empire.',
      },
      {
        name: 'Pasargadae',
        modern: 'Fars Province, Iran',
        date: 'c. 546–530 BC',
        era: 'KT1',
        lat: 30.19,
        lng: 53.17,
        summary: 'Cyrus’ monumental garden-palace capital and stepped limestone tomb.',
      },
      {
        name: 'Ecbatana',
        modern: 'Hamadan, Western Iran',
        date: '550 BC',
        era: 'KT1',
        lat: 34.80,
        lng: 48.51,
        summary: 'Mountain capital of King Astyages; captured by Cyrus after Astyages’ Median army mutinied (Nabonidus Chronicle).',
      },
      {
        name: 'Pteria & Halys River',
        modern: 'Central Anatolia, Turkey',
        date: 'c. 547 BC',
        era: 'KT1',
        lat: 39.88,
        lng: 34.80,
        summary: 'Frontier river crossed by King Croesus after misreading Delphi’s oracle; site of the drawn autumn battle.',
      },
      {
        name: 'Sardis (Lydia)',
        modern: 'Sart, Western Turkey',
        date: 'c. 546 BC',
        era: 'KT1',
        lat: 38.49,
        lng: 28.04,
        summary: 'Gold-rich Lydian capital on the Pactolus; fell to Cyrus after his winter march, Thymbra camel stratagem, and 14-day cliff siege.',
      },
      {
        name: 'Opis on the Tigris',
        modern: 'Near Baghdad, Iraq',
        date: 'Autumn 539 BC',
        era: 'KT1',
        lat: 33.18,
        lng: 44.70,
        summary: 'Decisive pitched battle on the Tigris where Cyrus crushed King Nabonidus’ Babylonian field army before Ugbaru entered Babylon.',
      },
      {
        name: 'Babylon',
        modern: 'South of Baghdad, Iraq',
        date: '539 BC',
        era: 'KT1',
        lat: 32.54,
        lng: 44.42,
        summary: 'Entered without street battle after Opis; home of Marduk’s Esagila shrine, the Cyrus Cylinder, and the 538 BC Jewish Edict of Restoration.',
      },
      {
        name: 'Massagetae Steppe Frontier',
        modern: 'East of the Caspian / Jaxartes, Central Asia',
        date: '530 BC',
        era: 'KT1',
        lat: 41.50,
        lng: 61.00,
        summary: 'North-eastern nomadic frontier where Herodotus 1.214 places Cyrus’ fatal battle against Queen Tomyris of the Massagetae.',
      },
      {
        name: 'Pelusium & Memphis (Egypt)',
        modern: 'Nile Delta & Cairo, Egypt',
        date: '525 BC',
        era: 'KT2',
        lat: 29.85,
        lng: 31.25,
        summary: 'Conquered by Cambyses II; Udjahorresnet’s statue counters Herodotus’ tales of Cambyses’ madness.',
      },
      {
        name: 'Bisitun Rock',
        modern: 'Kermanshah Province, Iran',
        date: 'c. 520 BC',
        era: 'KT3',
        lat: 34.39,
        lng: 47.43,
        summary: 'Trilingual cliff inscription where Darius I justified overthrowing Bardiya/Gaumata and crushing nine rebellions.',
      },
      {
        name: 'Susa & Persepolis',
        modern: 'Khuzestan & Fars, Iran',
        date: 'c. 518–465 BC',
        era: 'KT3',
        lat: 29.93,
        lng: 52.89,
        summary: 'Ceremonial and administrative heart of Darius I and Xerxes I’s empire, linked to Sardis by the 1,600-mile Royal Road.',
      },
      {
        name: 'Miletus (Ionia)',
        modern: 'Aegean Coast, Turkey',
        date: '499–494 BC',
        era: 'KT3',
        lat: 37.53,
        lng: 27.28,
        summary: 'Epicentre of the Ionian Revolt against Darius I; its sack after Lade triggered Darius’ invasion of Greece.',
      },
      {
        name: 'Marathon',
        modern: 'Attica, Greece',
        date: '490 BC',
        era: 'KT3',
        lat: 38.15,
        lng: 23.97,
        summary: 'Athenian and Plataean hoplites defeated Darius I’s amphibious expedition under Datis and Artaphernes.',
      },
      {
        name: 'Hellespont Bridges',
        modern: 'Dardanelles Strait, Turkey',
        date: '480 BC',
        era: 'KT4',
        lat: 40.15,
        lng: 26.40,
        summary: 'Pontoon bridges built by Xerxes I to march his vast multi-ethnic army from Asia into Europe.',
      },
      {
        name: 'Thermopylae & Salamis',
        modern: 'Central Greece & Saronic Gulf',
        date: '480 BC',
        era: 'KT4',
        lat: 37.95,
        lng: 23.56,
        summary: 'Xerxes forced Thermopylae and burned Athens, but Themistocles’ Greek triremes shattered the Persian fleet at Salamis.',
      },
      {
        name: 'Plataea',
        modern: 'Boeotia, Greece',
        date: '479 BC',
        era: 'KT4',
        lat: 38.22,
        lng: 23.27,
        summary: 'Decisive Greek hoplite victory killing Persian general Mardonius and ending Xerxes’ mainland invasion.',
      },
    ],
  },

  ocr_alexander: {
    title: 'Interactive Alexander the Great Campaign Atlas (356–323 BC)',
    subtitle: 'Follow Alexander’s 3,000-mile march from Pella across Asia Minor, Egypt, Persia, Bactria, and India',
    center: [34.5, 44.0],
    zoom: 4,
    eras: [
      { id: 'all', label: 'Full Campaign (356–323 BC)', color: '#9a3412' },
      { id: 'KT1', label: 'KT1: Macedon & Greece (356–334 BC)', color: '#d97706' },
      { id: 'KT2', label: 'KT2: Persia & Egypt (334–330 BC)', color: '#dc2626' },
      { id: 'KT3', label: 'KT3: Bactria & India (330–325 BC)', color: '#4f46e5' },
      { id: 'KT4', label: 'KT4: Return & Babylon (325–323 BC)', color: '#0d9488' },
    ],
    routes: [
      {
        era: 'KT1',
        color: '#d97706',
        label: 'Youth, Mieza & Chaeronea (356–336 BC)',
        coords: [
          [40.76, 22.52], // Pella
          [40.64, 22.12], // Mieza
          [38.49, 22.84], // Chaeronea
        ],
      },
      {
        era: 'KT2',
        color: '#dc2626',
        label: 'Conquest of Asia Minor, Egypt & Persia (334–330 BC)',
        coords: [
          [40.76, 22.52], // Pella
          [40.23, 27.24], // Granicus
          [39.65, 31.99], // Gordium
          [36.84, 36.16], // Issus
          [33.27, 35.20], // Tyre
          [29.20, 25.52], // Siwah Oasis
          [36.36, 43.25], // Gaugamela
          [32.54, 44.42], // Babylon
          [29.93, 52.89], // Persepolis
        ],
      },
      {
        era: 'KT3',
        color: '#4f46e5',
        label: 'Eastern Campaigns: Maracanda to River Hyphasis (330–325 BC)',
        coords: [
          [29.93, 52.89], // Persepolis
          [39.65, 66.97], // Maracanda
          [34.77, 72.76], // Rock of Aornus
          [31.50, 75.00], // River Hyphasis
        ],
      },
      {
        era: 'KT4',
        color: '#0d9488',
        label: 'Gedrosian Desert Return, Susa & Babylon (325–323 BC)',
        coords: [
          [31.50, 75.00], // Hyphasis
          [25.60, 64.00], // Gedrosian Desert
          [32.19, 48.25], // Susa
          [32.54, 44.42], // Babylon
        ],
      },
    ],
    sites: [
      {
        name: 'Pella & Mieza',
        modern: 'Central Macedonia, Greece',
        date: '356–340 BC',
        era: 'KT1',
        lat: 40.76,
        lng: 22.52,
        summary: 'Royal capital where Alexander was born to Philip II and Olympias, tamed Bucephalas, and studied under Aristotle at Mieza.',
      },
      {
        name: 'Chaeronea',
        modern: 'Boeotia, Greece',
        date: '338 BC',
        era: 'KT1',
        lat: 38.49,
        lng: 22.84,
        summary: 'Eighteen-year-old Alexander led the Companion cavalry charge breaking the Theban Sacred Band.',
      },
      {
        name: 'River Granicus',
        modern: 'Biga Çayı, NW Turkey',
        date: '334 BC',
        era: 'KT2',
        lat: 40.23,
        lng: 27.24,
        summary: 'First victory over Persian satraps; Cleitus the Black saved Alexander’s life in the river melee (Arrian 1.14–16).',
      },
      {
        name: 'Gordium',
        modern: 'Yassıhöyük, Central Turkey',
        date: '333 BC',
        era: 'KT2',
        lat: 39.65,
        lng: 31.99,
        summary: 'Alexander solved the prophecy of the Gordian Knot—promising lordship over Asia (Arrian 2.3).',
      },
      {
        name: 'Battle of Issus',
        modern: 'Hatay, Southern Turkey',
        date: '333 BC',
        era: 'KT2',
        lat: 36.84,
        lng: 36.16,
        summary: 'First clash against King Darius III in person; immortalised in the Pompeii Mosaic and Alexander Sarcophagus.',
      },
      {
        name: 'Siege of Tyre',
        modern: 'Sur, Southern Lebanon',
        date: '332 BC',
        era: 'KT2',
        lat: 33.27,
        lng: 35.20,
        summary: 'Seven-month siege building a half-mile mole across the sea to storm the Phoenician island fortress (Arrian 2.24).',
      },
      {
        name: 'Oracle of Siwah Oasis',
        modern: 'Western Desert, Egypt',
        date: '331 BC',
        era: 'KT2',
        lat: 29.20,
        lng: 25.52,
        summary: 'Priests of Zeus Ammon greeted Alexander as "son of Zeus", reinforcing Olympias’ birth myths and Lysimachus’ ram’s-horn coinage.',
      },
      {
        name: 'Battle of Gaugamela',
        modern: 'Near Erbil, Northern Iraq',
        date: '331 BC',
        era: 'KT2',
        lat: 36.36,
        lng: 43.25,
        summary: 'Decisive defeat of Darius III’s empire recorded on the Babylonian Astronomical Diary (Plutarch 31–33; Arrian 3.9–15).',
      },
      {
        name: 'Persepolis',
        modern: 'Fars Province, Iran',
        date: '330 BC',
        era: 'KT2',
        lat: 29.93,
        lng: 52.89,
        summary: 'Ceremonial Persian capital burned after a drunken banquet—revenge for Athens or Thais’ torch (Plutarch 38; Arrian 3.18).',
      },
      {
        name: 'Maracanda (Samarkand)',
        modern: 'Uzbekistan',
        date: '328 BC',
        era: 'KT3',
        lat: 39.65,
        lng: 66.97,
        summary: 'Site of the drunken banquet where Alexander speared his friend Cleitus the Black after tensions over Persian customs.',
      },
      {
        name: 'Rock of Aornus & River Hyphasis',
        modern: 'Northern Pakistan / Punjab',
        date: '327–326 BC',
        era: 'KT3',
        lat: 34.77,
        lng: 72.76,
        summary: 'Alexander stormed Aornus to surpass Heracles (Arrian 4.28–30) before his exhausted army mutinied at the River Hyphasis.',
      },
      {
        name: 'Gedrosian Desert',
        modern: 'Makran Coast, Southern Pakistan/Iran',
        date: '325 BC',
        era: 'KT4',
        lat: 25.60,
        lng: 64.00,
        summary: 'Catastrophic desert return march costing thousands of camp followers and soldiers.',
      },
      {
        name: 'Susa & Babylon',
        modern: 'Iran & Iraq',
        date: '324–323 BC',
        era: 'KT4',
        lat: 32.54,
        lng: 44.42,
        summary: 'Mass Persian-Macedonian weddings at Susa (Arrian 7.4), Opis mutiny, and Alexander’s death in Babylon aged 32 (June 323 BC).',
      },
    ],
  },

  ocr_foundations_of_rome: {
    title: 'Interactive Foundations of Rome Atlas (753–440 BC)',
    subtitle: 'Explore the Tiber crossing, Etruscan neighbours, and early Republican battlegrounds of Latium',
    center: [42.0, 12.5],
    zoom: 8,
    eras: [
      { id: 'all', label: 'All Sites (753–440 BC)', color: '#b91c1c' },
      { id: 'KT1', label: 'KT1–2: Kings & Etruscans', color: '#ea580c' },
      { id: 'KT3', label: 'KT3–4: Early Republic', color: '#2563eb' },
    ],
    routes: [],
    sites: [
      { name: 'Rome (Palatine, Capitoline & Forum)', modern: 'Central Rome, Italy', date: '753–440 BC', era: 'KT1', lat: 41.89, lng: 12.48, summary: 'Iron Age Palatine huts, Cloaca Maxima drainage, Servian Walls, Temple of Jupiter Capitolinus, and Twelve Tables.' },
      { name: 'Alba Longa', modern: 'Castel Gandolfo, Latium', date: '7th Century BC', era: 'KT1', lat: 41.75, lng: 12.65, summary: 'Mother-city of Romulus destroyed by King Tullus Hostilius after the Horatii-Curiatii duel.' },
      { name: 'Clusium (Lars Porsenna)', modern: 'Chiusi, Tuscany', date: '508 BC', era: 'KT3', lat: 43.01, lng: 11.95, summary: 'Etruscan stronghold of King Lars Porsenna who besieged early Republican Rome.' },
      { name: 'Lake Regillus', modern: 'Near Frascati, Latium', date: 'c. 496 BC', era: 'KT3', lat: 41.83, lng: 12.70, summary: 'Decisive Republican victory over the Latin League and exiled Tarquins.' },
      { name: 'Mons Sacer (Sacred Mount)', modern: 'NE of Rome (Anio River)', date: '494 & 449 BC', era: 'KT3', lat: 41.94, lng: 12.53, summary: 'Hill where plebeians staged the First Secession (winning Tribunes of the Plebs) and Second Secession.' },
    ],
  },

  ocr_cleopatra: {
    title: 'Interactive Cleopatra: Rome & Egypt Atlas (69–30 BC)',
    subtitle: 'Follow the Mediterranean power triangle linking Alexandria, Rome, Tarsus, Antioch, and Actium',
    center: [36.0, 24.5],
    zoom: 5,
    eras: [
      { id: 'all', label: 'All Sites (69–30 BC)', color: '#7c3aed' },
      { id: 'KT1', label: 'KT1–2: Alexandria & Caesar', color: '#d97706' },
      { id: 'KT3', label: 'KT3–4: Antony & Actium', color: '#dc2626' },
    ],
    routes: [
      {
        era: 'KT3',
        color: '#7c3aed',
        label: 'Alexandria → Tarsus → Actium → Alexandria',
        coords: [
          [31.20, 29.92], // Alexandria
          [36.92, 34.89], // Tarsus
          [38.95, 20.77], // Actium
          [31.20, 29.92], // Alexandria
        ],
      },
    ],
    sites: [
      { name: 'Alexandria', modern: 'Northern Egypt', date: '69–30 BC', era: 'KT1', lat: 31.20, lng: 29.92, summary: 'Ptolemaic capital, Pharos Lighthouse, Alexandrian War with Julius Caesar, 34 BC Donations, and Cleopatra’s 30 BC death.' },
      { name: 'Rome', modern: 'Italy', date: '46–44 BC', era: 'KT1', lat: 41.89, lng: 12.48, summary: 'Cleopatra stayed at Caesar’s Tiber villa before his Ides of March assassination; later base of Octavian’s propaganda war.' },
      { name: 'Tarsus (River Cydnus)', modern: 'Mersin Province, Turkey', date: '41 BC', era: 'KT3', lat: 36.92, lng: 34.89, summary: 'Cleopatra sailed up the Cydnus in her gilded purple-sailed barge dressed as Aphrodite to meet Mark Antony (Plutarch Antony 25–27).' },
      { name: 'Antioch & Cyprus', modern: 'Syria / Eastern Med', date: '37–34 BC', era: 'KT3', lat: 36.20, lng: 36.16, summary: 'Mark Antony restored Ptolemaic territories including Cyprus and cedar-rich Cilician/Phoenician coasts to Egypt.' },
      { name: 'Battle of Actium', modern: 'Ambracian Gulf, Western Greece', date: '2 Sept 31 BC', era: 'KT3', lat: 38.95, lng: 20.77, summary: 'Agrippa’s blockade forced Cleopatra’s 60 Egyptian warships and Antony to break out, handing Octavian mastery of the Roman world.' },
    ],
  },
};

export async function openOcrAncientAtlasModal(unitId, initialEra = 'all') {
  if (typeof document === 'undefined') return;
  const cfg = OCR_ATLAS_CONFIGS[unitId] || OCR_ATLAS_CONFIGS.ocr_persian_empire;

  document.getElementById('ocr-ancient-atlas-modal')?.remove();
  if (activeAtlasMap) {
    try {
      activeAtlasMap.remove();
    } catch (_) {}
    activeAtlasMap = null;
  }

  const modal = document.createElement('div');
  modal.id = 'ocr-ancient-atlas-modal';
  modal.style.cssText =
    'position:fixed;inset:0;z-index:10070;background:rgba(15,23,42,0.78);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;';

  modal.innerHTML = `
    <div style="background:#ffffff;border-radius:16px;width:100%;max-width:1180px;height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.48);border:1.5px solid #cbd5e1;">
      <div style="background:linear-gradient(135deg,#431407 0%,#7c2d12 55%,#9a3412 100%);color:#ffffff;padding:14px 22px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;flex-shrink:0;">
        <div>
          <div style="font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#fed7aa;">Interactive Classical World Atlas • Physical Terrain (No Modern Borders)</div>
          <h3 style="margin:2px 0 0 0;font-family:'Playfair Display',serif;font-size:1.28rem;color:#ffffff;">${escHtml(cfg.title)}</h3>
        </div>
        <button type="button" id="ocr-atlas-close" style="background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.35);color:#ffffff;padding:7px 14px;border-radius:8px;font-weight:800;font-size:0.84rem;cursor:pointer;">✕ Close</button>
      </div>

      <!-- Era Filter Strip -->
      <div style="background:#f8fafc;border-bottom:1.5px solid #e2e8f0;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;flex-shrink:0;">
        <div style="display:flex;gap:6px;flex-wrap:wrap;" id="ocr-atlas-era-bar">
          ${cfg.eras
            .map(
              (e) => `
            <button type="button" class="ocr-atlas-era-btn" data-era="${escHtml(e.id)}" style="padding:6px 12px;border-radius:999px;font-size:0.78rem;font-weight:800;cursor:pointer;border:1.5px solid ${e.id === initialEra ? e.color : '#cbd5e1'};background:${e.id === initialEra ? e.color : '#ffffff'};color:${e.id === initialEra ? '#ffffff' : '#334155'};">
              ${escHtml(e.label)}
            </button>
          `,
            )
            .join('')}
        </div>
        <span style="font-size:0.78rem;font-weight:600;color:#64748b;">Click any pin or location card to fly there</span>
      </div>

      <!-- Split Body: Real Physical Terrain Map + Site Directory -->
      <div style="display:grid;grid-template-columns:minmax(0,1.65fr) minmax(280px,360px);flex:1;min-height:0;overflow:hidden;" class="ocr-atlas-body-grid">
        <div id="ocr-atlas-map-canvas" style="width:100%;height:100%;background:#dbeafe;position:relative;">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:700;color:#334155;">Loading Classical Terrain Atlas…</div>
        </div>
        <div id="ocr-atlas-site-list" style="background:#f8fafc;border-left:1.5px solid #e2e8f0;overflow-y:auto;padding:12px;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeAtlas = () => {
    document.removeEventListener('keydown', onEsc);
    if (activeAtlasMap) {
      try {
        activeAtlasMap.remove();
      } catch (_) {}
      activeAtlasMap = null;
    }
    modal.remove();
  };
  const onEsc = (e) => {
    if (e.key === 'Escape') closeAtlas();
  };
  document.addEventListener('keydown', onEsc);
  modal.querySelector('#ocr-atlas-close')?.addEventListener('click', closeAtlas);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAtlas();
  });

  try {
    const L = await ensureLeafletLoaded();
    const mapEl = document.getElementById('ocr-atlas-map-canvas');
    if (!mapEl) return;
    mapEl.innerHTML = '';

    const map = L.map(mapEl, { zoomControl: true, scrollWheelZoom: true }).setView(cfg.center, cfg.zoom);
    activeAtlasMap = map;

    // Esri World Physical Map: gorgeous ancient-world physical geography with ZERO modern political borders/cities!
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Terrain: Esri World Physical • Classical overlays: The History Revision Hub',
      maxZoom: 8,
      minZoom: 3,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    const eraColorMap = Object.fromEntries(cfg.eras.map((e) => [e.id, e.color]));

    const renderEra = (eraId) => {
      layerGroup.clearLayers();

      const visibleRoutes = (cfg.routes || []).filter((r) => eraId === 'all' || r.era === eraId);
      visibleRoutes.forEach((r) => {
        L.polyline(r.coords, {
          color: r.color || '#9a3412',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '8, 6',
        })
          .bindTooltip(r.label, { sticky: true })
          .addTo(layerGroup);
      });

      const visibleSites = (cfg.sites || []).filter((s) => eraId === 'all' || s.era === eraId);
      const markerMap = new Map();

      visibleSites.forEach((s, idx) => {
        const col = eraColorMap[s.era] || '#9a3412';
        const marker = L.circleMarker([s.lat, s.lng], {
          radius: 8,
          fillColor: col,
          color: '#ffffff',
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.96,
        }).addTo(layerGroup);

        marker.bindTooltip(`<strong>${escHtml(s.name)}</strong> (${escHtml(s.date)})`, {
          direction: 'top',
          offset: [0, -6],
        });
        marker.bindPopup(
          `<div style="max-width:260px;font-family:'Inter',sans-serif;">
            <div style="font-size:0.7rem;font-weight:800;color:${col};text-transform:uppercase;">${escHtml(s.era)} • ${escHtml(s.date)}</div>
            <div style="font-size:1rem;font-weight:800;color:#0f172a;margin:2px 0;">${escHtml(s.name)}</div>
            <div style="font-size:0.75rem;color:#64748b;margin-bottom:6px;">${escHtml(s.modern)}</div>
            <div style="font-size:0.84rem;line-height:1.45;color:#1e293b;">${escHtml(s.summary)}</div>
          </div>`,
        );
        markerMap.set(idx, marker);
      });

      const listEl = document.getElementById('ocr-atlas-site-list');
      if (listEl) {
        listEl.innerHTML = visibleSites
          .map((s, idx) => {
            const col = eraColorMap[s.era] || '#9a3412';
            return `
              <button type="button" data-site-idx="${idx}" style="width:100%;text-align:left;background:#ffffff;border:1.5px solid #e2e8f0;border-left:4px solid ${col};border-radius:10px;padding:10px 12px;margin-bottom:8px;cursor:pointer;display:block;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:2px;">
                  <strong style="font-size:0.9rem;color:#0f172a;">${escHtml(s.name)}</strong>
                  <span style="font-size:0.72rem;font-weight:800;color:${col};white-space:nowrap;">${escHtml(s.date)}</span>
                </div>
                <div style="font-size:0.75rem;color:#64748b;margin-bottom:4px;">${escHtml(s.modern)}</div>
                <div style="font-size:0.82rem;line-height:1.45;color:#334155;">${escHtml(s.summary)}</div>
              </button>
            `;
          })
          .join('');

        listEl.querySelectorAll('[data-site-idx]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const i = Number(btn.getAttribute('data-site-idx'));
            const s = visibleSites[i];
            const m = markerMap.get(i);
            if (s && m) {
              map.flyTo([s.lat, s.lng], Math.min(7, cfg.zoom + 2), { duration: 0.7 });
              m.openPopup();
            }
          });
        });
      }

      if (visibleSites.length > 1) {
        const bounds = L.latLngBounds(visibleSites.map((s) => [s.lat, s.lng]));
        map.fitBounds(bounds.pad(0.22), { maxZoom: 7 });
      }
    };

    renderEra(initialEra);

    modal.querySelectorAll('.ocr-atlas-era-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetEra = btn.getAttribute('data-era') || 'all';
        modal.querySelectorAll('.ocr-atlas-era-btn').forEach((b) => {
          const id = b.getAttribute('data-era');
          const active = id === targetEra;
          const col = eraColorMap[id] || '#9a3412';
          b.style.background = active ? col : '#ffffff';
          b.style.color = active ? '#ffffff' : '#334155';
          b.style.borderColor = active ? col : '#cbd5e1';
        });
        renderEra(targetEra);
      });
    });

    setTimeout(() => map.invalidateSize(), 150);
  } catch (err) {
    const mapEl = document.getElementById('ocr-atlas-map-canvas');
    if (mapEl) {
      mapEl.innerHTML = `<div style="padding:24px;color:#991b1b;">Unable to load map tiles offline. Check your internet connection and retry.</div>`;
    }
  }
}

if (typeof window !== 'undefined') {
  window.openOcrAncientAtlas = openOcrAncientAtlasModal;
}
