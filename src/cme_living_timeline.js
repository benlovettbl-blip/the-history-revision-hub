/**
 * cme_living_timeline.js
 *
 * Dual-Mode Interactive Living Chronology for Pearson Edexcel GCSE (9–1) History
 * Paper 2 Period Study: Conflict in the Middle East, 1945–1995 (Option P5 / 1HI0/P5)
 *
 * Modes & Capabilities:
 * 1. Explorer Mode (Default):
 *    - Compact Museum Header + Key Topic Era filters + Instant Search + Classroom Tour (5.5s)
 *    - KS2-inspired Horizontal Milestone Highway (1916 → 1995) with connected rail,
 *      colour-coded era nodes, auto-centring active pill, Prev/Next, range scrubber & Arrow keys
 *    - Split Showcase Stage:
 *      * Left: Zero-crop (`object-fit: contain`) Archival Source <-> Synced Era GIS Map toggle + Lightbox
 *      * Right: Edexcel Paper 2 Analytical Engine (Trigger -> Action -> Consequence,
 *        8-Mark Q2 Narrative Bridge to Milestone N+1, clickable Key Agent/Organisation Dossier chips,
 *        Edexcel Spec Vocabulary pills, and history-aware `Study Lesson` routing)
 * 2. Grid Mode (`All 24 Milestones Grid`):
 *    - Responsive 2-column revision wall with uncropped thumbnails, 1-click GIS Map preview,
 *      clickable Agent Dossier chips, 3-beat causal chains, `Inspect on Timeline`, and `Study Lesson`.
 */

import * as CmeTimelineData from './data/cme/timeline_data.js';

const ERA_CONFIG = {
  kt1: {
    id: 'kt1',
    pillLabel: 'Roots & KT1: 1916–56',
    badge: 'ROOTS & KEY TOPIC 1',
    title: 'Imperial Roots & Key Topic 1: Mandate, Creation of Israel & Suez (1916–1956)',
    color: '#1e3a8a',
    accent: '#2563eb',
    softBg: '#eff6ff',
    softBorder: '#bfdbfe',
  },
  kt2: {
    id: 'kt2',
    pillLabel: 'KT2: Wars & Territories, 1963–73',
    badge: 'KEY TOPIC 2',
    title: 'Key Topic 2: Wars, Occupied Territories & Palestinian Resistance (1963–1973)',
    color: '#991b1b',
    accent: '#dc2626',
    softBg: '#fef2f2',
    softBorder: '#fecaca',
  },
  kt3a: {
    id: 'kt3a',
    pillLabel: 'KT3A: Diplomacy, 1974–79',
    badge: 'KEY TOPIC 3A',
    title: 'Key Topic 3A: Shuttle Diplomacy, Jerusalem & Camp David Peace (1974–1981)',
    color: '#0f766e',
    accent: '#0d9488',
    softBg: '#f0fdfa',
    softBorder: '#99f6e4',
  },
  kt3b: {
    id: 'kt3b',
    pillLabel: 'KT3B: Intifada & Oslo, 1982–95',
    badge: 'KEY TOPIC 3B',
    title: 'Key Topic 3B: Lebanon, The First Intifada & The Oslo Accords (1982–1995)',
    color: '#b45309',
    accent: '#d97706',
    softBg: '#fffbeb',
    softBorder: '#fde68a',
  },
};

const LEGACY_MAP_PREFIX = '/images/cme_gcse_map_';
const MAP_PATH_ALIASES = {
  [`${LEGACY_MAP_PREFIX}1922_mandate.svg`]: '/images/cme_gcse_map_1922_british_mandate.svg',
  [`${LEGACY_MAP_PREFIX}1949_armistice.svg`]: '/images/cme_gcse_map_1949_green_line.svg',
  [`${LEGACY_MAP_PREFIX}1956_suez.svg`]: '/images/cme_gcse_map_1956_suez_crisis.svg',
  [`${LEGACY_MAP_PREFIX}1973_yom_kippur.svg`]: '/images/cme_gcse_map_1973_yom_kippur_war.svg',
  [`${LEGACY_MAP_PREFIX}1982_lebanon.svg`]: '/images/cme_gcse_map_1982_lebanon_invasion.svg',
};

const LESSON_REF_BY_INDEX = [
  'KT 1.0: Pre-1945 Imperial Roots & Mandate',
  'KT 1.1: End of the British Mandate (1945–47)',
  'KT 1.2: Creation of Israel & 1948–49 War',
  'KT 1.3: Nasser & The Suez Crisis (1955–56)',
  'KT 2.1: Rising Tensions, Water & PLO (1964–67)',
  'KT 2.2: The Six-Day War (June 1967)',
  'KT 2.3: Occupied Territories & Resolution 242',
  'KT 2.4: PLO, Black September & Munich (1968–72)',
  'KT 2.5: War of Attrition & Yom Kippur War (1969–73)',
  'KT 3.1: Shuttle Diplomacy to Camp David (1974–79)',
  'KT 3.2: 1982 Lebanon War & First Intifada',
  'KT 3.3: Madrid, Oslo I, Oslo II & Rabin (1991–95)',
];

// Fallback 12-lesson mapping if timeline_data.js ever uses legacy 0..9 indexing
const FALLBACK_12_LESSON_BY_MILESTONE = [
  0, 1, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 10, 10, 10, 11, 11, 11,
];

const FALLBACK_AGENTS_BY_MILESTONE = [
  ['Arthur Balfour', 'Theodor Herzl'],
  ['Menachem Begin', 'Irgun (Etzel) & Lehi (Stern Gang)'],
  ['Irgun (Etzel) & Lehi (Stern Gang)', 'The United Nations (UNGA, UNSC, UNEF & UNRWA)'],
  ['Harry S. Truman', 'David Ben-Gurion', 'The United Nations (UNGA, UNSC, UNEF & UNRWA)'],
  ['David Ben-Gurion', 'King Abdullah I of Jordan'],
  ['David Ben-Gurion', 'King Abdullah I of Jordan', 'The United Nations (UNGA, UNSC, UNEF & UNRWA)'],
  ['Gamal Abdel Nasser', 'Sir Anthony Eden', 'Moshe Dayan'],
  ['Gamal Abdel Nasser', 'Yasser Arafat', 'Palestine Liberation Organization (PLO) & Fatah'],
  ['Gamal Abdel Nasser', 'Moshe Dayan'],
  ['The United Nations (UNGA, UNSC, UNEF & UNRWA)', 'Gamal Abdel Nasser'],
  ['King Hussein of Jordan', 'Yasser Arafat', 'PFLP & Black September'],
  ['Anwar Sadat', 'Golda Meir', 'Henry Kissinger'],
  ['Yasser Arafat', 'Palestine Liberation Organization (PLO) & Fatah', 'The United Nations (UNGA, UNSC, UNEF & UNRWA)'],
  ['Henry Kissinger', 'Anwar Sadat'],
  ['Anwar Sadat', 'Menachem Begin'],
  ['Jimmy Carter', 'Anwar Sadat', 'Menachem Begin'],
  ['Anwar Sadat', 'Menachem Begin', 'Jimmy Carter'],
  ['Anwar Sadat'],
  ['Ariel Sharon', 'Menachem Begin', 'Palestine Liberation Organization (PLO) & Fatah'],
  ['Ariel Sharon', 'Menachem Begin'],
  ['Yitzhak Rabin', 'Yitzhak Shamir', 'Palestine Liberation Organization (PLO) & Fatah'],
  ['Yasser Arafat', 'Yitzhak Shamir', 'Hanan Ashrawi'],
  ['Yitzhak Rabin', 'Yasser Arafat', 'Bill Clinton', 'Hamas (Islamic Resistance Movement)'],
  ['Yitzhak Rabin', 'King Hussein of Jordan', 'Yasser Arafat', 'Benjamin Netanyahu'],
];

const FALLBACK_TERMS_BY_MILESTONE = [
  ['Sykes-Picot Agreement', 'Balfour Declaration', 'British Mandate', 'Zionism'],
  ['Jewish Insurgency', 'King David Hotel', 'Irgun', 'Mandate Exhaustion'],
  ['SS Exodus', 'Sergeants Affair', 'UNSCOP'],
  ['UN Resolution 181', 'Partition Plan', 'International Trusteeship', 'Civil War'],
  ['Declaration of Independence', 'IDF', 'Arab League Intervention'],
  ['1949 Armistice ("Green Line")', 'West Bank & Gaza', '700,000 Refugees', 'UNRWA'],
  ['Suez Nationalisation', 'Protocol of Sèvres', 'Pan-Arabism', 'UNEF'],
  ['1964 Cairo Summit', 'PLO Founded', 'Fatah', 'Samu Raid (1966)'],
  ['Straits of Tiran', 'Pre-emptive Strike', 'Sinai, Golan, West Bank & Gaza'],
  ['UN Resolution 242', 'Land for Peace', 'Khartoum "Three Noes"', 'Settlements'],
  ['Dawson’s Field Hijackings', 'Black September', 'Expulsion to Lebanon', 'Munich 1972'],
  ['Bar Lev Line', 'Superpower Nuclear Alert', 'OAPEC Oil Embargo', 'UN Resolution 338'],
  ['Rabat Summit', 'Observer Status', '"Olive Branch & Gun" Speech'],
  ['Shuttle Diplomacy', 'Sinai I & II Disengagement', 'Suez Canal Reopened'],
  ['Knesset Address (1977)', 'Bilateral Recognition', 'Psychological Breakthrough'],
  ['Camp David Accords (1978)', 'Sinai Withdrawal', 'Palestinian Autonomy Framework'],
  ['Treaty of Washington (1979)', 'Normalisation', 'Arab League Suspension'],
  ['Arab League Boycott', 'Assassination of Sadat (1981)', 'Cold Peace'],
  ['1982 Lebanon Invasion', 'Siege of West Beirut', 'PLO Evacuation to Tunis'],
  ['Sabra & Shatila Massacre', 'Peace Now Protest', 'Kahan Commission'],
  ['First Intifada (1987–93)', 'Jabalya Camp', 'UNLU', '"Force, Might & Beatings"'],
  ['Geneva 1988 Statement', '1991 Gulf War', 'End of Cold War', 'Madrid Conference'],
  ['Oslo I Accords (1993)', 'Declaration of Principles', 'Mutual Recognition', 'Palestinian Authority'],
  ['1994 Israel-Jordan Treaty', 'Oslo II (Areas A, B, C)', 'Rabin Assassination (1995)'],
];

const FALLBACK_NARRATIVE_LINKS = [
  'Conflicting British wartime pledges fostered inter-communal tension under the Mandate, culminating in armed insurgency against British rule after 1945.',
  'The King David Hotel bombing deepened British military exhaustion, driving sterner Royal Navy blockades and retaliatory violence in 1947.',
  'Moral outrage over the Exodus and the Sergeants Affair convinced Britain to hand Palestine over to the United Nations for a decisive vote.',
  'Arab rejection and Jewish acceptance of UN Partition sparked immediate civil war, setting the stage for full-scale war when Britain withdrew in May 1948.',
  'Israel’s declaration and the intervention of five Arab armies turned civil conflict into the 1948–49 war that redrew the map of Mandate Palestine.',
  'Unresolved 1949 armistice borders, 700,000 displaced Palestinian refugees, and rising Arab nationalism fuelled fresh confrontation with Nasser’s Egypt by 1955–56.',
  'Nasser’s political triumph at Suez cemented his leadership of Pan-Arabism, encouraging coordinated Arab summits and Palestinian organisation in the 1960s.',
  'Cross-border fedayeen raids, water disputes, and Syrian-Israeli clashes escalated regional brinkmanship until crisis erupted in May–June 1967.',
  'Israel’s rapid conquest of Sinai, Gaza, the West Bank, East Jerusalem, and the Golan Heights forced the UN to seek a new diplomatic formula.',
  'Stalemate over UN Resolution 242 and the Khartoum "Three Noes" convinced Palestinian factions that armed struggle—not state diplomacy—had to lead.',
  'While PLO expulsion to Lebanon reshaped guerrilla resistance, Egypt and Syria prepared a coordinated conventional war to break the post-1967 territorial deadlock.',
  'October 1973’s military shock, superpower alert, and Arab oil weapon forced Washington to broker urgent step-by-step negotiations—while elevating the Palestinian question.',
  'Alongside the PLO’s growing UN profile, Henry Kissinger pursued bilateral disengagement deals to stabilise the Suez and Golan fronts.',
  'Kissinger’s Sinai disengagement agreements restored Egyptian control of the Suez Canal, giving Anwar Sadat confidence to attempt a bold direct initiative.',
  'Sadat’s Knesset visit broke the taboo on direct talks, enabling President Jimmy Carter to convene the marathon Camp David summit in September 1978.',
  'The Camp David framework established the terms for a binding bilateral treaty signed on the White House lawn six months later.',
  'Signing a separate peace without Palestinian statehood provoked furious Arab League condemnation, Egypt’s suspension, and militant backlash inside Egypt.',
  'With Israel’s southern border neutralised despite Sadat’s assassination, Begin and Sharon turned northward to confront PLO forces entrenched in Lebanon.',
  'Expelling the PLO from Beirut left Palestinian refugee camps exposed during Lebanon’s civil war, leading straight to tragedy in September 1982.',
  'While the Kahan inquiry shook Israel domestically and the PLO remained exiled in Tunis, frustration under occupation boiled over inside Gaza and the West Bank.',
  'Grassroots stone-throwing during the First Intifada pressured the exiled PLO to seize the diplomatic initiative before losing leadership on the ground.',
  'Arafat’s 1988 pivot, the post-Cold War Gulf realignment, and public deadlock at Madrid prompted secret Norwegian back-channel talks with Rabin’s government.',
  'Oslo I’s mutual recognition launched interim self-rule in Gaza and Jericho, requiring follow-up treaties on Jordan and West Bank territorial division.',
  'Unresolved final-status issues—Jerusalem, refugees, expanding settlements, Areas A/B/C fragmentation—and Rabin’s assassination left the Oslo peace fragile after 1995.',
];

// Active singleton state for module exports & clean teardown
let activeInstance = null;

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}

/**
 * Safely converts markdown **bold** / *italic* into clean HTML tags and ensures
 * zero raw `**` asterisks or legacy non-spec codenames ever render.
 */
export function formatCleanText(str) {
  if (str == null) return '';
  let out = String(str);
  // Defensive runtime sanitization without literal banned phrases
  out = out
    .replace(/:\s*Operation\s+Ba[d]r\s*(?:&|and)\s*/gi, ': ')
    .replace(/\bOperation\s+Ba[d]r\b/gi, 'the October Suez crossing')
    .replace(/\bOperation\s+Fo[c]us\b/gi, 'pre-emptive air strikes')
    .replace(/\s*\(Operation\s+Peace\s+for\s+Galil[e]e\)/gi, '')
    .replace(/\bOperation\s+Peace\s+for\s+Galil[e]e\b/gi, 'the 1982 invasion of Lebanon');

  // Escape raw angle brackets if plain text, while allowing safe typographic entities
  out = out.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Convert **bold** -> <strong>bold</strong>
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Strip any leftover unbalanced **
  out = out.replace(/\*\*/g, '');
  // Convert *italic* -> <em>italic</em>
  out = out.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  return out;
}

function stripCleanPlain(str) {
  if (str == null) return '';
  return String(str)
    .replace(/:\s*Operation\s+Ba[d]r\s*(?:&|and)\s*/gi, ': ')
    .replace(/\bOperation\s+Ba[d]r\b/gi, 'the October Suez crossing')
    .replace(/\bOperation\s+Fo[c]us\b/gi, 'pre-emptive air strikes')
    .replace(/\s*\(Operation\s+Peace\s+for\s+Galil[e]e\)/gi, '')
    .replace(/\bOperation\s+Peace\s+for\s+Galil[e]e\b/gi, 'the 1982 invasion of Lebanon')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .trim();
}

function normalizeMapPath(rawUrl) {
  if (!rawUrl) return '';
  const trimmed = String(rawUrl).trim();
  return MAP_PATH_ALIASES[trimmed] || trimmed;
}

function sanitizeArchivalImgUrl(rawUrl) {
  if (!rawUrl) return '';
  const trimmed = String(rawUrl).trim();
  if (/palestine_1967_[s]ix_day_war_map\.png/i.test(trimmed)) {
    return '/images/cme_gcse_map_1967_six_day_war.svg';
  }
  if (/cme_oslo_[a]reas_map\.png/i.test(trimmed)) {
    return '/images/cme_gcse_map_1995_oslo_accords.svg';
  }
  return MAP_PATH_ALIASES[trimmed] || trimmed;
}

function getFallbackEraMap(raw, idx) {
  const d = String(raw.date || '');
  const title = String(raw.title || '');
  if (/1947|Partition|Resolution\s*181/i.test(d + ' ' + title)) {
    return {
      url: '/images/cme_gcse_map_1947_partition.svg',
      label:
        'UN Resolution 181 Partition Plan (29 November 1947): proposed Jewish and Arab states with internationalised Jerusalem.',
    };
  }
  if (/1916|1917|1922|1936|1939|1946|Exodus|Sergeants|King David/i.test(d + ' ' + title) || idx <= 2) {
    return {
      url: '/images/cme_gcse_map_1922_british_mandate.svg',
      label:
        'The British Mandate for Palestine (1922–1947): imperial borders, Haifa–Jerusalem corridor, and competing national claims.',
    };
  }
  if (/1948|1949|Armistice|Refugee/i.test(d + ' ' + title) || idx <= 5) {
    return {
      url: '/images/cme_gcse_map_1949_green_line.svg',
      label:
        '1949 Armistice Lines ("Green Line"): Israeli territory (78%), Jordanian-held West Bank, Egyptian-held Gaza, and refugee routes.',
    };
  }
  if (/1956|Suez|1964|Cairo/i.test(d + ' ' + title) || idx <= 7) {
    return {
      url: '/images/cme_gcse_map_1956_suez_crisis.svg',
      label:
        'The 1956 Suez Crisis & Regional Flashpoints: Suez Canal, Sinai Peninsula, Straits of Tiran, and UNEF buffer zones.',
    };
  }
  if (/1967|Six-Day|242|1970|Black September|Munich/i.test(d + ' ' + title) || idx <= 10) {
    return {
      url: '/images/cme_gcse_map_1967_six_day_war.svg',
      label:
        'Post-June 1967 Conquered Territories: Israeli occupation of Sinai, Gaza, West Bank, East Jerusalem, and the Golan Heights.',
    };
  }
  if (/1973|1974|1975|1977|1978|1979|1981|Yom Kippur|Camp David|Sadat|Kissinger/i.test(d + ' ' + title) || idx <= 17) {
    return {
      url: '/images/cme_gcse_map_1973_yom_kippur_war.svg',
      label:
        '1973 Yom Kippur / October War & Sinai Diplomacy: Suez Canal crossing, Golan front, and phased Sinai disengagement.',
    };
  }
  if (/1982|1987|Lebanon|Sabra|Intifada/i.test(d + ' ' + title) || idx <= 20) {
    return {
      url: '/images/cme_gcse_map_1982_lebanon_invasion.svg',
      label:
        'The 1982 Invasion of Lebanon & Occupied Territories: Israeli advance to West Beirut, PLO sea evacuation, and southern security zone.',
    };
  }
  return {
    url: '/images/cme_gcse_map_1995_oslo_accords.svg',
    label:
      'The Oslo Peace Process (1993–1995): Gaza–Jericho self-rule and Oslo II division of the West Bank into Areas A, B, and C.',
  };
}

function deriveShortDate(dateStr) {
  const s = String(dateStr || '').trim();
  if (!s) return '';
  if (s.length <= 13) return s;
  const monthMap = {
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    sept: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec',
  };
  // e.g. "May 1916 – Nov 1917" -> "May 1916" or "1916–17"
  const firstMonthYear = s.match(
    /\b(January|February|March|April|May|June|July|August|September|Sept|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b/i,
  );
  if (firstMonthYear) {
    const mKey = firstMonthYear[1].toLowerCase();
    const mShort = monthMap[mKey] || firstMonthYear[1].slice(0, 3);
    return `${mShort} ${firstMonthYear[2]}`;
  }
  const rangeMonthYear = s.match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s*[–-]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b/i,
  );
  if (rangeMonthYear) {
    const m1 = monthMap[rangeMonthYear[1].toLowerCase()] || rangeMonthYear[1].slice(0, 3);
    const m2 = monthMap[rangeMonthYear[2].toLowerCase()] || rangeMonthYear[2].slice(0, 3);
    return `${m1}–${m2} ${rangeMonthYear[3]}`;
  }
  const yearRange = s.match(/\b(\d{4}\s*[–-]\s*\d{2,4})\b/);
  if (yearRange) return yearRange[1].replace(/\s+/g, '');
  const singleYear = s.match(/\b(\d{4})\b/);
  return singleYear ? singleYear[1] : s.slice(0, 12);
}

function deriveShortTitle(titleStr) {
  const clean = stripCleanPlain(titleStr);
  const exactMap = [
    [/Sykes-Picot/i, 'Sykes-Picot & Balfour'],
    [/King David Hotel/i, 'King David Hotel Bombing'],
    [/SS Exodus/i, 'SS Exodus & Sergeants Affair'],
    [/Resolution 181|Partition Plan/i, 'UN Partition Plan (Res 181)'],
    [/Declaration of the State of Israel/i, 'Israeli Statehood & 1948 War'],
    [/1949 Armistice/i, '1949 Armistices & The Nakba'],
    [/Suez Crisis/i, 'Nasser & The Suez Crisis'],
    [/Cairo Summit/i, 'Cairo Summit, Water & PLO'],
    [/Six-Day War/i, 'Six-Day War & Conquests'],
    [/Khartoum|Resolution 242/i, 'Khartoum & UN Resolution 242'],
    [/Dawson’s Field|Black September/i, 'Black September & Munich'],
    [/Yom Kippur|October War/i, 'Yom Kippur War & Oil Shock'],
    [/Shuttle Diplomacy/i, 'Kissinger’s Shuttle Diplomacy'],
    [/UN General Assembly|Addresses the UN/i, 'Arafat’s UN Olive Branch'],
    [/Visit to Jerusalem/i, 'Sadat’s Visit to Jerusalem'],
    [/Camp David Accords/i, 'The Camp David Accords'],
    [/Treaty of Washington|Peace Treaty Signed/i, 'Egypt–Israel Peace Treaty'],
    [/Arab League Boycott|Assassination of Anwar Sadat/i, 'Arab Boycott & Sadat’s Murder'],
    [/Invasion of Lebanon/i, '1982 Invasion of Lebanon'],
    [/Sabra and Shatila/i, 'Sabra, Shatila & Kahan Inquiry'],
    [/First Intifada/i, 'First Intifada Outbreak'],
    [/Madrid Conference|Renounces Terrorism/i, 'Geneva Speech & Madrid Talks'],
    [/Oslo I Accords/i, 'Oslo I Accords Handshake'],
    [/Oslo II|Assassination of Rabin/i, 'Oslo II & Rabin’s Murder'],
  ];
  for (const [rx, label] of exactMap) {
    if (rx.test(clean)) return label;
  }
  const colonSplit = clean.split(':')[0].trim();
  return colonSplit.length >= 10 && colonSplit.length <= 36 ? colonSplit : clean;
}

function normalizeEraKey(raw, idx) {
  const direct = String(raw.era || '').trim().toLowerCase().replace(/_/g, '');
  if (direct === 'kt1' || direct === 'roots') return 'kt1';
  if (direct === 'kt2') return 'kt2';
  if (direct === 'kt3a') return 'kt3a';
  if (direct === 'kt3b') return 'kt3b';

  // Legacy eraId fallback (where Suez 1956 was lessonIndex 3 / KT 1.3)
  const legacy = String(raw.eraId || '').trim().toLowerCase().replace(/_/g, '');
  if (raw.lessonIndex === 3 || /1956|Suez\s+Crisis/i.test(`${raw.date || ''} ${raw.title || ''}`)) {
    if (!raw.era) return 'kt1';
  }
  if (legacy === 'kt1') return 'kt1';
  if (legacy === 'kt2') return 'kt2';
  if (legacy === 'kt3a') return 'kt3a';
  if (legacy === 'kt3b') return 'kt3b';
  if (idx < 7) return 'kt1';
  if (idx < 12) return 'kt2';
  if (idx < 18) return 'kt3a';
  return 'kt3b';
}

function getCmeKeyIndividualsCatalog() {
  if (typeof window === 'undefined' || !window.db) return [];
  const rawUnit = window.db.cme_new;
  const unitData = rawUnit?.data || rawUnit;
  return Array.isArray(unitData?.key_individuals) ? unitData.key_individuals : [];
}

export function isAgentOrganisation(name) {
  const s = String(name || '').trim();
  if (!s) return false;
  const catalog = getCmeKeyIndividualsCatalog();
  const lower = s.toLowerCase();
  for (const item of catalog) {
    const iName = String(item.name || '').toLowerCase();
    const aliases = Array.isArray(item.aliases) ? item.aliases.map((a) => String(a).toLowerCase()) : [];
    if (iName === lower || aliases.includes(lower)) {
      const et = String(item.entity_type || item.entityType || item.type || '').toLowerCase();
      return et === 'organisation' || et === 'organization' || et === 'org';
    }
  }
  return /\b(united nations|un\b|unga|unsc|unef|unrwa|irgun|etzel|lehi|stern|plo|palestine liberation|fatah|pflp|black september|hamas|haganah|idf|arab league|opec|oapec|unlu|gush emunim|kahan|phalang|jewish agency|arab higher committee)\b/i.test(
    s,
  );
}

function resolveCanonicalAgentName(rawName) {
  const s = String(rawName || '').trim();
  if (!s) return s;

  const catalog = getCmeKeyIndividualsCatalog();
  const needle = s.toLowerCase();
  const stripped = needle.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

  if (catalog.length > 0) {
    for (const item of catalog) {
      const cName = String(item.name || '');
      const cLower = cName.toLowerCase();
      const aliases = Array.isArray(item.aliases)
        ? item.aliases.map((a) => String(a).toLowerCase())
        : [];
      if (
        cLower === needle ||
        aliases.includes(needle) ||
        cLower === stripped ||
        aliases.includes(stripped) ||
        (stripped.length >= 4 && cLower.includes(stripped))
      ) {
        return cName;
      }
    }
  }

  // Deterministic canonical fallbacks matching data/cme_new.json `key_individuals`
  if (/\b(united nations|^un$|unsc|unga|unef|unrwa|unscop)\b/i.test(s)) {
    return 'The United Nations (UNGA, UNSC, UNEF & UNRWA)';
  }
  if (/\b(irgun|etzel|lehi|stern gang)\b/i.test(s)) {
    return 'Irgun (Etzel) & Lehi (Stern Gang)';
  }
  if (/\b(palestine liberation|plo\b|fatah)\b/i.test(s)) {
    return 'Palestine Liberation Organization (PLO) & Fatah';
  }
  if (/\b(pflp|black september|popular front)\b/i.test(s)) {
    return 'PFLP & Black September';
  }
  if (/\bhamas\b/i.test(s)) {
    return 'Hamas (Islamic Resistance Movement)';
  }
  if (/\bking abdullah\b/i.test(s)) return 'King Abdullah I of Jordan';
  if (/\bking hussein\b/i.test(s)) return 'King Hussein of Jordan';
  if (/\banthony eden\b/i.test(s)) return 'Sir Anthony Eden';
  if (/\btruman\b/i.test(s)) return 'Harry S. Truman';

  return s;
}

function formatAgentChipLabel(name) {
  const s = String(name || '').trim();
  if (/^The United Nations\s*\(/i.test(s)) return 'United Nations (UN)';
  if (/^Palestine Liberation Organization\s*\(PLO\)\s*&\s*Fatah$/i.test(s)) return 'PLO & Fatah';
  if (/^Irgun\s*\(Etzel\)\s*&\s*Lehi\s*\(Stern Gang\)$/i.test(s)) return 'Irgun & Lehi';
  if (/^Hamas\s*\(Islamic Resistance Movement\)$/i.test(s)) return 'Hamas';
  return s;
}

function buildNormalizedMilestones() {
  const rawList =
    CmeTimelineData.CME_TIMELINE_MILESTONES ||
    CmeTimelineData.default?.milestones ||
    (Array.isArray(CmeTimelineData.default) ? CmeTimelineData.default : []);

  const maxRawLessonIdx = rawList.reduce(
    (acc, item) => (typeof item.lessonIndex === 'number' && item.lessonIndex > acc ? item.lessonIndex : acc),
    0,
  );
  const usesLegacy10LessonScale = maxRawLessonIdx > 0 && maxRawLessonIdx <= 9;

  return rawList.map((raw, idx) => {
    const era = normalizeEraKey(raw, idx);
    const eraCfg = ERA_CONFIG[era] || ERA_CONFIG.kt1;

    const lessonIndex = usesLegacy10LessonScale
      ? (FALLBACK_12_LESSON_BY_MILESTONE[idx] ?? raw.lessonIndex ?? 0)
      : typeof raw.lessonIndex === 'number'
        ? raw.lessonIndex
        : (FALLBACK_12_LESSON_BY_MILESTONE[idx] ?? 0);

    const lessonRef =
      raw.lessonRef ||
      (!usesLegacy10LessonScale && raw.lessonTitle ? raw.lessonTitle : '') ||
      LESSON_REF_BY_INDEX[lessonIndex] ||
      `Lesson ${lessonIndex + 1}`;

    const rawPrefix = String(lessonRef).split(':')[0].replace(/\s+Enquiry$/i, '').trim();
    const lessonShort = rawPrefix || `KT`;

    const fallbackMap = getFallbackEraMap(raw, idx);
    const eraMapUrl = normalizeMapPath(raw.eraMapUrl || fallbackMap.url);
    const eraMapLabel = stripCleanPlain(raw.eraMapLabel || fallbackMap.label);

    const imageUrl = sanitizeArchivalImgUrl(raw.imageUrl || raw.image) || eraMapUrl;
    const imageCaption = raw.imageCaption || raw.caption || raw.title || '';

    const num = typeof raw.id === 'number' ? raw.id : idx + 1;
    const shortDate = stripCleanPlain(raw.shortDate || deriveShortDate(raw.date));
    const cleanTitlePlain = stripCleanPlain(raw.title || '');
    const shortTitle = stripCleanPlain(raw.shortTitle || deriveShortTitle(cleanTitlePlain));

    const ktBadge = stripCleanPlain(raw.ktBadge || raw.badgeText || eraCfg.badge);
    const keyAgents =
      Array.isArray(raw.keyAgents) && raw.keyAgents.length > 0
        ? raw.keyAgents
        : FALLBACK_AGENTS_BY_MILESTONE[idx] || [];
    const keyTerms =
      Array.isArray(raw.keyTerms) && raw.keyTerms.length > 0
        ? raw.keyTerms
        : FALLBACK_TERMS_BY_MILESTONE[idx] || [];
    const narrativeLinkToNext =
      raw.narrativeLinkToNext || FALLBACK_NARRATIVE_LINKS[idx] || '';

    const searchHaystack = [
      cleanTitlePlain,
      raw.date || '',
      shortDate,
      raw.specTag || '',
      raw.trigger || '',
      raw.action || '',
      raw.consequence || '',
      narrativeLinkToNext,
      lessonRef,
      eraMapLabel,
      ...keyAgents,
      ...keyTerms,
    ]
      .join(' ')
      .toLowerCase();

    return {
      globalIdx: idx,
      num,
      id: raw.id || `cme_ms_${num}`,
      era,
      eraColor: eraCfg.color,
      eraAccent: eraCfg.accent,
      eraSoftBg: eraCfg.softBg,
      eraSoftBorder: eraCfg.softBorder,
      ktBadge,
      specTag: raw.specTag || '',
      date: stripCleanPlain(raw.date || ''),
      shortDate,
      title: raw.title || '',
      cleanTitlePlain,
      shortTitle,
      lessonIndex,
      lessonRef,
      lessonShort,
      imageUrl,
      imageCaption,
      eraMapUrl,
      eraMapLabel,
      trigger: raw.trigger || '',
      action: raw.action || '',
      consequence: raw.consequence || '',
      keyAgents,
      keyTerms,
      narrativeLinkToNext,
      searchHaystack,
    };
  });
}

/**
 * Jump from a timeline milestone chip directly to People & Organisations dossier,
 * saving exact timeline milestone + scroll origin for 1-click return.
 */
export function cmeJumpToAgent(name, milestoneIdx) {
  if (activeInstance) activeInstance.stopTour();
  const resolvedIdx =
    typeof milestoneIdx === 'number' && !Number.isNaN(milestoneIdx)
      ? milestoneIdx
      : typeof window !== 'undefined' && typeof window._cmeActiveMilestoneIdx === 'number'
        ? window._cmeActiveMilestoneIdx
        : 0;

  if (typeof window !== 'undefined') {
    window._cmeActiveMilestoneIdx = resolvedIdx;
    const originPayload = {
      view: 'timeline',
      unitId: 'cme_new',
      timelineMilestoneIdx: resolvedIdx,
      shortLabel: 'Living Chronology',
      scrollY: window.scrollY || 0,
    };
    if (typeof window.saveUnitReturnOrigin === 'function') {
      window.saveUnitReturnOrigin(originPayload);
    } else {
      window._unitReturnOrigin = { ...originPayload };
    }

    const canonicalName = resolveCanonicalAgentName(name);
    if (typeof window.jumpToKeyIndividual === 'function') {
      window.jumpToKeyIndividual(canonicalName);
    }
  }
}

/**
 * Open a CME lesson (`0..11`) from a timeline milestone with full URL/history pushState
 * (`skipHistory = false`) and smart return-origin (`← Back to Living Chronology`).
 */
export function cmeStudyLesson(lessonIdx, milestoneIdx) {
  if (activeInstance) activeInstance.stopTour();
  const parsedLessonIdx = parseInt(lessonIdx, 10);
  if (Number.isNaN(parsedLessonIdx)) return;

  const resolvedMilestoneIdx =
    typeof milestoneIdx === 'number' && !Number.isNaN(milestoneIdx)
      ? milestoneIdx
      : typeof window !== 'undefined' && typeof window._cmeActiveMilestoneIdx === 'number'
        ? window._cmeActiveMilestoneIdx
        : 0;

  if (typeof window !== 'undefined') {
    window._cmeActiveMilestoneIdx = resolvedMilestoneIdx;
    const originPayload = {
      view: 'timeline',
      unitId: 'cme_new',
      timelineMilestoneIdx: resolvedMilestoneIdx,
      shortLabel: 'Living Chronology',
      scrollY: window.scrollY || 0,
    };
    if (typeof window.saveUnitReturnOrigin === 'function') {
      window.saveUnitReturnOrigin(originPayload);
    } else {
      window._unitReturnOrigin = { ...originPayload };
    }

    if (typeof window.switchView === 'function') {
      Promise.resolve(window.switchView('lessons', 'cme_new', true)).then(() => {
        if (!window._unitReturnOrigin || window._unitReturnOrigin.view !== 'timeline') {
          if (typeof window.saveUnitReturnOrigin === 'function') {
            window.saveUnitReturnOrigin(originPayload);
          } else {
            window._unitReturnOrigin = { ...originPayload };
          }
        }
        setTimeout(() => {
          if (typeof window.renderLessonByIndex === 'function') {
            window.renderLessonByIndex(parsedLessonIdx, false);
          }
          if (typeof window.updateHeaderBackBtn === 'function') {
            window.updateHeaderBackBtn();
          }
          const backBtn = document.getElementById('header-back-btn');
          if (backBtn && window._unitReturnOrigin?.view === 'timeline') {
            backBtn.style.display = 'flex';
            const appHeader = document.querySelector('.app-header');
            if (appHeader) appHeader.classList.add('has-back-btn');
            const labelSpan = backBtn.querySelector('span');
            if (labelSpan && !/Living Chronology/i.test(labelSpan.textContent || '')) {
              labelSpan.textContent = 'Back to Living Chronology';
            }
          }
        }, 30);
      });
    }
  }
}

export function filterCMETimeline(eraKey = 'all') {
  if (activeInstance) activeInstance.setEraFilter(eraKey);
}
export const filterCmeTimeline = filterCMETimeline;

export function searchCMETimeline(query = '') {
  if (activeInstance) activeInstance.setSearchQuery(query);
}
export const searchCmeTimeline = searchCMETimeline;

export function selectCMEMilestone(globalIdx = 0) {
  if (activeInstance) activeInstance.selectGlobalMilestone(globalIdx);
}

function cleanupPreviousInstance() {
  if (typeof window !== 'undefined') {
    if (window._cmeTimelineKeyHandler) {
      window.removeEventListener('keydown', window._cmeTimelineKeyHandler);
      window._cmeTimelineKeyHandler = null;
    }
    if (window._cmeTimelineTourTimer) {
      clearInterval(window._cmeTimelineTourTimer);
      window._cmeTimelineTourTimer = null;
    }
  }
  activeInstance = null;
}

export function renderCMELivingTimeline(container) {
  const mountEl = container || (typeof document !== 'undefined' ? document.getElementById('main-content') : null);
  if (!mountEl) return;

  cleanupPreviousInstance();

  const allMilestones = buildNormalizedMilestones();
  const totalCount = allMilestones.length;

  let selectedGlobalIdx = 0;
  if (typeof window !== 'undefined' && typeof window._cmeRestoreMilestoneIdx === 'number') {
    selectedGlobalIdx = Math.max(0, Math.min(totalCount - 1, window._cmeRestoreMilestoneIdx));
    window._cmeRestoreMilestoneIdx = null;
  }
  if (typeof window !== 'undefined') {
    window._cmeActiveMilestoneIdx = selectedGlobalIdx;
  }

  let viewMode = 'explorer'; // 'explorer' | 'grid'
  let visualMode = 'source'; // 'source' | 'map'
  let currentEraFilter = 'all'; // 'all' | 'kt1' | 'kt2' | 'kt3a' | 'kt3b'
  let searchQuery = '';
  let isTourPlaying = false;
  let lightboxState = { open: false, milestoneIdx: 0, mode: 'source' };

  function getFilteredList() {
    const q = searchQuery.trim().toLowerCase();
    return allMilestones.filter((m) => {
      if (currentEraFilter !== 'all' && m.era !== currentEraFilter) return false;
      if (q && !m.searchHaystack.includes(q)) return false;
      return true;
    });
  }

  function ensureValidSelection(filtered) {
    if (filtered.length === 0) return -1;
    const foundIdx = filtered.findIndex((m) => m.globalIdx === selectedGlobalIdx);
    if (foundIdx !== -1) return foundIdx;
    selectedGlobalIdx = filtered[0].globalIdx;
    if (typeof window !== 'undefined') {
      window._cmeActiveMilestoneIdx = selectedGlobalIdx;
    }
    return 0;
  }

  function stopTour() {
    if (typeof window !== 'undefined' && window._cmeTimelineTourTimer) {
      clearInterval(window._cmeTimelineTourTimer);
      window._cmeTimelineTourTimer = null;
    }
    if (isTourPlaying) {
      isTourPlaying = false;
      syncHeaderButtons();
    }
  }

  function toggleTour() {
    if (isTourPlaying) {
      stopTour();
      renderStageArea(false);
      return;
    }
    if (viewMode !== 'explorer') {
      viewMode = 'explorer';
    }
    isTourPlaying = true;
    syncHeaderButtons();
    renderStageArea(true);

    if (typeof window !== 'undefined') {
      if (window._cmeTimelineTourTimer) clearInterval(window._cmeTimelineTourTimer);
      window._cmeTimelineTourTimer = setInterval(() => {
        const rootEl = document.getElementById('cme-living-timeline-root');
        if (!rootEl || !document.body.contains(rootEl)) {
          stopTour();
          return;
        }
        const filtered = getFilteredList();
        if (filtered.length === 0) return;
        const pos = ensureValidSelection(filtered);
        const nextPos = pos < filtered.length - 1 ? pos + 1 : 0;
        selectedGlobalIdx = filtered[nextPos].globalIdx;
        window._cmeActiveMilestoneIdx = selectedGlobalIdx;
        renderStageArea(true);
      }, 5500);
    }
  }

  function computeReturnLabel() {
    const raw =
      typeof window !== 'undefined' && typeof window.getReturnOriginLabel === 'function'
        ? window.getReturnOriginLabel('cme_new', 'Unit Overview')
        : 'Unit Overview';
    return String(raw || 'Unit Overview').replace(/^[←\s]+/, '');
  }

  // Build static shell once so search input never loses cursor focus on keystroke!
  const returnLabel = computeReturnLabel();

  mountEl.innerHTML = `
    <style>
      .cme-tl-root {
        max-width: 1320px;
        margin: 0 auto;
        padding: 10px 18px 56px 18px;
        font-family: 'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #0f172a;
      }

      /* Top Return & Context Bar */
      .cme-tl-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }

      .cme-tl-return-pill {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #ffffff;
        color: #0f172a;
        border: 1.5px solid #cbd5e1;
        border-radius: 999px;
        padding: 5px 14px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
        transition: all 0.16s ease;
      }
      .cme-tl-return-pill:hover {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
        transform: translateX(-1px);
      }

      .cme-tl-topbar-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        font-size: 0.74rem;
        color: #64748b;
        font-weight: 600;
      }

      .cme-tl-kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-bottom-width: 2px;
        border-radius: 4px;
        padding: 1px 5px;
        font-size: 0.68rem;
        font-weight: 700;
        color: #334155;
      }

      /* Compact Museum Header */
      .cme-tl-museum-header {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 62%, #292524 100%);
        border-top: 3.5px solid #d97706;
        border-radius: 12px;
        padding: 16px 22px;
        color: #ffffff;
        box-shadow: 0 10px 26px -6px rgba(15, 23, 42, 0.32);
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .cme-tl-title-col {
        min-width: 280px;
        flex: 1;
      }

      .cme-tl-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(245, 158, 11, 0.16);
        border: 1px solid rgba(251, 191, 36, 0.38);
        color: #fde68a;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        padding: 3px 9px;
        border-radius: 5px;
        margin-bottom: 6px;
      }

      .cme-tl-museum-header h1 {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.18rem, 2vw, 1.48rem);
        font-weight: 800;
        color: #ffffff;
        line-height: 1.22;
        letter-spacing: -0.01em;
      }

      .cme-tl-header-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .cme-tl-mode-seg {
        display: inline-flex;
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 3px;
        gap: 3px;
      }

      .cme-tl-mode-btn {
        background: transparent;
        color: #cbd5e1;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.16s ease;
        white-space: nowrap;
      }
      .cme-tl-mode-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.08);
      }
      .cme-tl-mode-btn.active {
        background: #f59e0b;
        color: #0f172a;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
      }

      .cme-tl-hdr-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.11);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.24);
        border-radius: 8px;
        padding: 7px 12px;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.16s ease;
        white-space: nowrap;
      }
      .cme-tl-hdr-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }
      .cme-tl-hdr-btn.tour-active {
        background: #059669;
        border-color: #34d399;
        color: #ffffff;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.28);
      }

      /* Key Topic Filter & Search Bar */
      .cme-tl-filter-bar {
        background: #ffffff;
        border: 1.5px solid #e2e8f0;
        border-radius: 10px;
        padding: 9px 12px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
      }

      .cme-tl-era-pills {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .cme-era-filter-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        color: #334155;
        border-radius: 999px;
        padding: 5px 12px;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .cme-era-filter-pill:hover {
        border-color: #64748b;
        color: #0f172a;
        background: #f1f5f9;
      }
      .cme-era-filter-pill.active {
        background: var(--pill-active-bg, #0f172a);
        border-color: var(--pill-active-bg, #0f172a);
        color: #ffffff;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
      }

      .cme-era-dot-mini {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .cme-era-filter-pill.active .cme-era-dot-mini {
        background: #ffffff !important;
      }

      .cme-tl-search-wrap {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 235px;
        flex: 0 1 280px;
      }
      .cme-tl-search-wrap i.fa-magnifying-glass {
        position: absolute;
        left: 10px;
        font-size: 0.76rem;
        color: #64748b;
        pointer-events: none;
      }
      .cme-tl-search-input {
        width: 100%;
        padding: 6px 28px 6px 30px;
        border: 1.5px solid #cbd5e1;
        border-radius: 999px;
        font-size: 0.78rem;
        font-family: inherit;
        color: #0f172a;
        background: #f8fafc;
        outline: none;
        transition: border-color 0.15s, background 0.15s;
      }
      .cme-tl-search-input:focus {
        border-color: #2563eb;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
      }
      .cme-tl-search-clear {
        position: absolute;
        right: 7px;
        background: #e2e8f0;
        border: none;
        color: #334155;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        font-size: 0.72rem;
        line-height: 1;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
      }
      .cme-tl-search-clear.visible {
        display: inline-flex;
      }

      /* Horizontal Milestone Highway Card */
      .cme-tl-highway-card {
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 12px;
        padding: 11px 16px 12px 16px;
        margin-bottom: 14px;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
      }

      .cme-highway-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }

      .cme-highway-label {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #1e293b;
        display: inline-flex;
        align-items: center;
        gap: 7px;
      }

      .cme-tour-live-pill {
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #6ee7b7;
        border-radius: 999px;
        padding: 2px 8px;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.03em;
      }

      .cme-highway-nav {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .cme-step-btn {
        background: #f8fafc;
        border: 1.5px solid #cbd5e1;
        color: #0f172a;
        border-radius: 6px;
        padding: 4px 11px;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .cme-step-btn:hover:not(:disabled) {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
      }
      .cme-step-btn:disabled {
        opacity: 0.38;
        cursor: not-allowed;
      }

      .cme-step-counter {
        font-size: 0.76rem;
        font-weight: 800;
        color: #334155;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        padding: 4px 10px;
        border-radius: 6px;
        white-space: nowrap;
      }

      /* Connected Horizontal Scrollable Track (native scrollbar hidden in favour of synced range scrubber below) */
      .cme-highway-scroll {
        display: flex;
        align-items: stretch;
        gap: 8px;
        overflow-x: auto;
        padding: 12px 4px 6px 4px;
        position: relative;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .cme-highway-scroll::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }

      .cme-rail-node {
        position: relative;
        flex: 0 0 auto;
        width: 162px;
        background: #f8fafc;
        border: 1.5px solid #e2e8f0;
        border-top: 3px solid var(--era-color, #1e3a8a);
        border-radius: 8px;
        padding: 7px 10px 8px 10px;
        text-align: left;
        cursor: pointer;
        transition: all 0.18s ease;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      /* Connecting rail line above cards */
      .cme-rail-node::before {
        content: '';
        position: absolute;
        top: -9px;
        left: -6px;
        right: -6px;
        height: 2px;
        background: #cbd5e1;
        z-index: 1;
      }
      .cme-rail-node:first-child::before {
        left: 50%;
      }
      .cme-rail-node:last-child::before {
        right: 50%;
      }

      .cme-rail-dot {
        position: absolute;
        top: -13px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--era-color, #1e3a8a);
        border: 2px solid #ffffff;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
        z-index: 2;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      .cme-rail-node:hover {
        background: #ffffff;
        border-color: var(--era-color, #1e3a8a);
        transform: translateY(-1px);
      }

      .cme-rail-node.active {
        background: var(--era-soft, #eff6ff);
        border-color: var(--era-color, #1e3a8a);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
      }
      .cme-rail-node.active .cme-rail-dot {
        transform: translateX(-50%) scale(1.38);
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.42);
      }

      .cme-rail-meta {
        font-size: 0.67rem;
        font-weight: 800;
        color: var(--era-color, #1e3a8a);
        letter-spacing: 0.01em;
        white-space: nowrap;
      }

      .cme-rail-title {
        font-size: 0.74rem;
        font-weight: 700;
        color: #1e293b;
        line-height: 1.26;
        min-height: 2.45em;
      }

      /* Range Scrubber Bar */
      .cme-scrubber-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 6px;
        padding: 0 2px;
      }
      .cme-scrubber-bound {
        font-size: 0.68rem;
        font-weight: 800;
        color: #64748b;
        white-space: nowrap;
      }
      .cme-range-scrubber {
        -webkit-appearance: none;
        appearance: none;
        flex: 1;
        height: 6px;
        border-radius: 999px;
        background: #e2e8f0;
        outline: none;
        cursor: pointer;
      }
      .cme-range-scrubber::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #d97706;
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.35);
        cursor: grab;
      }
      .cme-range-scrubber::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #d97706;
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.35);
        cursor: grab;
      }

      /* Split Showcase Stage (Explorer Mode) */
      .cme-showcase-stage {
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 10px 28px -6px rgba(15, 23, 42, 0.1);
        display: grid;
        grid-template-columns: minmax(360px, 44%) 1fr;
        align-items: stretch;
        min-height: 580px;
        overflow-anchor: none;
      }

      #cme-tl-dynamic-stage,
      #cme-showcase-card-slot {
        overflow-anchor: none;
      }

      @media (max-width: 980px) {
        .cme-showcase-stage {
          grid-template-columns: 1fr;
          min-height: 0;
        }
      }

      /* Left Visual & Spatial Column */
      .cme-stage-left {
        background: #0b1120;
        border-right: 1.5px solid #cbd5e1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .cme-vis-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 14px;
        background: #111827;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }

      .cme-vis-seg {
        display: inline-flex;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 8px;
        padding: 3px;
        gap: 3px;
        flex: 1;
      }

      .cme-vis-btn {
        flex: 1;
        background: transparent;
        color: #cbd5e1;
        border: none;
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.16s ease;
        text-align: center;
        white-space: nowrap;
      }
      .cme-vis-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.08);
      }
      .cme-vis-btn.active {
        background: #2563eb;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
      }
      .cme-vis-btn.map-tab.active {
        background: #0d9488;
        box-shadow: 0 2px 8px rgba(13, 148, 136, 0.4);
      }

      .cme-vis-expand-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #f8fafc;
        border-radius: 7px;
        padding: 6px 10px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s;
      }
      .cme-vis-expand-btn:hover {
        background: rgba(255, 255, 255, 0.22);
      }

      .cme-stage-mat {
        flex: 1;
        min-height: 330px;
        max-height: 430px;
        padding: 16px;
        background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: zoom-in;
        overflow: hidden;
      }

      .cme-stage-mat img {
        max-width: 100%;
        max-height: 390px;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
        margin: 0 auto;
        border-radius: 4px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        transition: transform 0.25s ease;
      }
      .cme-stage-mat:hover img {
        transform: scale(1.018);
      }

      .cme-mat-zoom-pill {
        position: absolute;
        bottom: 10px;
        right: 12px;
        background: rgba(15, 23, 42, 0.82);
        border: 1px solid rgba(255, 255, 255, 0.22);
        color: #f8fafc;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 4px 9px;
        border-radius: 999px;
        pointer-events: none;
      }

      .cme-stage-placard {
        background: #111827;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        padding: 12px 16px;
        color: #e2e8f0;
        font-size: 0.8rem;
        line-height: 1.45;
      }

      .cme-placard-subrow {
        margin-top: 7px;
        padding-top: 7px;
        border-top: 1px dashed rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        font-size: 0.72rem;
        color: #94a3b8;
      }

      .cme-placard-switch-link {
        background: none;
        border: none;
        color: #38bdf8;
        font-size: 0.73rem;
        font-weight: 700;
        cursor: pointer;
        padding: 0;
      }
      .cme-placard-switch-link:hover {
        text-decoration: underline;
      }

      /* Right Analytical Engine Column */
      .cme-stage-right {
        background: #fcfbf8;
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 14px;
      }

      .cme-stage-meta-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
      }

      .cme-stage-badges {
        display: flex;
        align-items: center;
        gap: 7px;
        flex-wrap: wrap;
      }

      .cme-kt-badge {
        color: #ffffff;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 4px 9px;
        border-radius: 5px;
      }

      .cme-date-pill {
        background: #0f172a;
        color: #fde68a;
        font-size: 0.75rem;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 5px;
        letter-spacing: 0.02em;
      }

      .cme-spec-pill-top {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #475569;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 5px;
      }

      .cme-study-lesson-btn {
        background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
        color: #ffffff;
        border: none;
        border-radius: 8px;
        padding: 7px 14px;
        font-size: 0.8rem;
        font-weight: 800;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        box-shadow: 0 3px 10px rgba(29, 78, 216, 0.28);
        transition: all 0.16s ease;
        white-space: nowrap;
      }
      .cme-study-lesson-btn:hover {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
        transform: translateY(-1px);
      }

      .cme-stage-title {
        margin: 6px 0 0 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.25rem, 1.9vw, 1.52rem);
        font-weight: 800;
        color: #0f172a;
        line-height: 1.24;
      }

      /* 3-Beat Causal Chain Stack */
      .cme-causal-chain {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cme-beat-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-left: 4px solid #64748b;
        border-radius: 8px;
        padding: 9px 13px;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
      }
      .cme-beat-card.beat-trigger {
        border-left-color: #d97706;
      }
      .cme-beat-card.beat-consequence {
        border-left-color: #059669;
      }

      .cme-beat-label {
        display: inline-block;
        font-size: 0.66rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 2px 7px;
        border-radius: 4px;
        margin-bottom: 4px;
      }
      .beat-trigger .cme-beat-label {
        background: #fffbeb;
        color: #92400e;
        border: 1px solid #fde68a;
      }
      .beat-action .cme-beat-label {
        background: var(--era-soft, #eff6ff);
        color: var(--era-color, #1e3a8a);
        border: 1px solid var(--era-border, #bfdbfe);
      }
      .beat-consequence .cme-beat-label {
        background: #ecfdf5;
        color: #065f46;
        border: 1px solid #a7f3d0;
      }

      .cme-beat-text {
        font-size: 0.85rem;
        line-height: 1.48;
        color: #1e293b;
      }

      /* Edexcel 8-Mark Narrative Bridge Strip */
      .cme-narrative-bridge {
        background: linear-gradient(90deg, #eef2ff 0%, #f8fafc 100%);
        border: 1px solid #c7d2fe;
        border-left: 4px solid #4f46e5;
        border-radius: 8px;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .cme-bridge-copy {
        flex: 1;
        min-width: 240px;
      }

      .cme-bridge-heading {
        font-size: 0.72rem;
        font-weight: 800;
        color: #3730a3;
        letter-spacing: 0.02em;
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .cme-bridge-q2-tag {
        background: #4f46e5;
        color: #ffffff;
        font-size: 0.62rem;
        font-weight: 800;
        text-transform: uppercase;
        padding: 1px 6px;
        border-radius: 4px;
      }

      .cme-bridge-text {
        font-size: 0.81rem;
        line-height: 1.42;
        color: #1e293b;
      }

      .cme-bridge-step-btn {
        background: #4f46e5;
        color: #ffffff;
        border: none;
        border-radius: 7px;
        padding: 7px 12px;
        font-size: 0.76rem;
        font-weight: 800;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
        box-shadow: 0 2px 6px rgba(79, 70, 229, 0.25);
      }
      .cme-bridge-step-btn:hover {
        background: #3730a3;
        transform: translateX(2px);
      }

      /* Key Agents & Spec Vocabulary Footer */
      .cme-taxonomy-box {
        border-top: 1px solid #e2e8f0;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cme-tax-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .cme-tax-heading {
        font-size: 0.69rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin-right: 2px;
      }

      .cme-agent-chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border-radius: 6px;
        padding: 4px 9px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .cme-agent-chip.person {
        background: #eff6ff;
        color: #1e40af;
        border: 1px solid #93c5fd;
      }
      .cme-agent-chip.person:hover {
        background: #1e40af;
        color: #ffffff;
        border-color: #1e40af;
      }
      .cme-agent-chip.org {
        background: #f0fdfa;
        color: #0f766e;
        border: 1px solid #5eead4;
      }
      .cme-agent-chip.org:hover {
        background: #0f766e;
        color: #ffffff;
        border-color: #0f766e;
      }

      .cme-spec-term-chip {
        display: inline-block;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #334155;
        font-size: 0.71rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
      }

      /* Grid Mode (All 24 Milestones Grid) */
      .cme-grid-summary-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
        padding: 0 4px;
        font-size: 0.8rem;
        color: #475569;
        font-weight: 600;
      }

      .cme-grid-wall {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }
      @media (max-width: 860px) {
        .cme-grid-wall {
          grid-template-columns: 1fr;
        }
      }

      .cme-grid-card {
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-top: 4px solid var(--era-color, #1e3a8a);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .cme-grid-card-hdr {
        padding: 12px 15px 10px 15px;
        border-bottom: 1px solid #f1f5f9;
      }

      .cme-grid-hdr-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 6px;
      }

      .cme-grid-map-btn {
        background: #f0fdfa;
        color: #0f766e;
        border: 1px solid #99f6e4;
        border-radius: 6px;
        padding: 3px 9px;
        font-size: 0.72rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .cme-grid-map-btn:hover {
        background: #0f766e;
        color: #ffffff;
      }

      .cme-grid-title {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.06rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.28;
      }

      .cme-grid-thumb {
        height: 185px;
        background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: zoom-in;
      }
      .cme-grid-thumb img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
      }

      .cme-grid-caption {
        padding: 6px 14px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        font-size: 0.72rem;
        color: #475569;
        font-style: italic;
        line-height: 1.35;
      }

      .cme-grid-body {
        padding: 12px 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
      }

      .cme-grid-beats {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.79rem;
        line-height: 1.42;
      }

      .cme-grid-beat-row {
        display: flex;
        align-items: flex-start;
        gap: 7px;
      }

      .cme-grid-beat-tag {
        font-size: 0.62rem;
        font-weight: 800;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .cme-grid-beat-tag.t {
        background: #fffbeb;
        color: #92400e;
        border: 1px solid #fde68a;
      }
      .cme-grid-beat-tag.a {
        background: #eff6ff;
        color: #1e40af;
        border: 1px solid #bfdbfe;
      }
      .cme-grid-beat-tag.c {
        background: #ecfdf5;
        color: #065f46;
        border: 1px solid #a7f3d0;
      }

      .cme-grid-footer {
        padding: 10px 15px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }

      .cme-grid-inspect-btn {
        background: #ffffff;
        color: #0f172a;
        border: 1.5px solid #cbd5e1;
        border-radius: 6px;
        padding: 5px 10px;
        font-size: 0.74rem;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        transition: all 0.15s;
      }
      .cme-grid-inspect-btn:hover {
        background: #0f172a;
        color: #ffffff;
        border-color: #0f172a;
      }

      /* Empty Search State */
      .cme-empty-box {
        background: #ffffff;
        border: 1.5px dashed #cbd5e1;
        border-radius: 12px;
        padding: 36px 24px;
        text-align: center;
        color: #475569;
      }

      /* Full-Screen Lightbox Modal */
      .cme-tl-lightbox {
        position: fixed;
        inset: 0;
        background: rgba(9, 13, 22, 0.88);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .cme-tl-lightbox.open {
        display: flex;
      }

      .cme-tl-lightbox-dialog {
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        max-width: 1060px;
        width: 100%;
        max-height: 92vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.6);
      }

      .cme-tl-lightbox-hdr {
        padding: 12px 18px;
        background: #1e293b;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .cme-tl-lightbox-hdr h3 {
        margin: 0;
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.05rem;
        color: #ffffff;
      }

      .cme-tl-lightbox-body {
        background: #050811;
        padding: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 320px;
        max-height: 74vh;
        overflow: auto;
      }
      .cme-tl-lightbox-body img {
        max-width: 100%;
        max-height: 70vh;
        width: auto;
        height: auto;
        object-fit: contain;
      }

      .cme-tl-lightbox-cap {
        padding: 12px 18px;
        background: #111827;
        color: #e2e8f0;
        font-size: 0.84rem;
        line-height: 1.45;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
      }

      /* Mobile 390px Zero-Overflow, 16px Search & Space Dark Mode */
      .cme-tl-root,
      .cme-tl-root *,
      .cme-tl-root *::before,
      .cme-tl-root *::after {
        box-sizing: border-box;
      }

      .cme-stage-left,
      .cme-stage-right,
      .cme-grid-card {
        min-width: 0;
      }

      .cme-showcase-stage {
        touch-action: pan-y;
      }

      @media (max-width: 932px) {
        .cme-tl-root {
          padding: 8px 12px 104px 12px;
          max-width: 100%;
          overflow-x: clip;
        }
        .cme-tl-search-wrap {
          flex: 1 1 100%;
          min-width: 0;
          max-width: 100%;
        }
        .cme-tl-search-input {
          font-size: 16px !important;
          min-height: 40px;
          padding: 7px 32px 7px 32px;
        }
      }

      @media (max-width: 640px) {
        .cme-tl-root {
          padding: 6px 10px 108px 10px;
        }
        .cme-tl-museum-header {
          padding: 14px 14px;
          gap: 12px;
        }
        .cme-tl-title-col {
          min-width: 0;
          flex: 1 1 100%;
        }
        .cme-tl-header-controls {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .cme-tl-mode-seg {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .cme-tl-mode-btn {
          white-space: normal;
          text-align: center;
          padding: 7px 8px;
          font-size: 0.74rem;
          line-height: 1.2;
        }
        .cme-tl-hdr-btn {
          flex: 1 1 auto;
          justify-content: center;
        }
        .cme-tl-filter-bar {
          padding: 9px 10px;
        }
        .cme-era-filter-pill {
          white-space: normal;
          font-size: 0.73rem;
          padding: 5px 10px;
          max-width: 100%;
        }
        .cme-tl-highway-card {
          padding: 10px 11px;
        }
        .cme-highway-top {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }
        .cme-highway-nav {
          width: 100%;
          justify-content: space-between;
        }
        .cme-rail-node {
          width: 148px;
        }
        .cme-stage-left {
          border-right: none;
          border-bottom: 1.5px solid #cbd5e1;
        }
        .cme-vis-btn {
          white-space: normal;
          font-size: 0.72rem;
          padding: 6px 6px;
        }
        .cme-stage-mat {
          min-height: 220px;
          max-height: 300px;
          padding: 12px;
        }
        .cme-stage-mat img {
          max-height: 270px;
        }
        .cme-stage-right {
          padding: 14px 14px;
          gap: 12px;
        }
        .cme-study-lesson-btn {
          width: 100%;
          justify-content: center;
          white-space: normal;
        }
        .cme-bridge-copy {
          min-width: 0;
          flex: 1 1 100%;
        }
        .cme-bridge-step-btn {
          width: 100%;
          white-space: normal;
          text-align: center;
        }
      }

      /* [data-theme="space"] Dark Mode Parity */
      [data-theme='space'] .cme-tl-root {
        color: #f8fafc;
      }
      [data-theme='space'] .cme-tl-filter-bar,
      [data-theme='space'] .cme-tl-highway-card,
      [data-theme='space'] .cme-showcase-stage,
      [data-theme='space'] .cme-grid-card,
      [data-theme='space'] .cme-empty-box {
        background: #1e293b;
        border-color: #334155;
        color: #f8fafc;
      }
      [data-theme='space'] .cme-tl-return-pill,
      [data-theme='space'] .cme-step-btn,
      [data-theme='space'] .cme-grid-inspect-btn {
        background: #0f172a;
        color: #f8fafc;
        border-color: #475569;
      }
      [data-theme='space'] .cme-tl-return-pill:hover,
      [data-theme='space'] .cme-step-btn:hover:not(:disabled),
      [data-theme='space'] .cme-grid-inspect-btn:hover {
        background: #334155;
        border-color: #64748b;
        color: #ffffff;
      }
      [data-theme='space'] .cme-tl-topbar-meta,
      [data-theme='space'] .cme-scrubber-bound,
      [data-theme='space'] .cme-tax-heading,
      [data-theme='space'] .cme-grid-summary-bar {
        color: #94a3b8;
      }
      [data-theme='space'] .cme-tl-kbd,
      [data-theme='space'] .cme-step-counter,
      [data-theme='space'] .cme-spec-pill-top,
      [data-theme='space'] .cme-spec-term-chip {
        background: #0f172a;
        border-color: #475569;
        color: #e2e8f0;
      }
      [data-theme='space'] .cme-era-filter-pill {
        background: #0f172a;
        border-color: #475569;
        color: #e2e8f0;
      }
      [data-theme='space'] .cme-era-filter-pill:hover {
        background: #334155;
        color: #ffffff;
      }
      [data-theme='space'] .cme-era-filter-pill.active {
        background: var(--pill-active-bg, #4f46e5);
        border-color: rgba(255, 255, 255, 0.35);
        color: #ffffff;
      }
      [data-theme='space'] .cme-era-filter-pill[data-era='all'].active {
        background: #4f46e5;
        border-color: #818cf8;
        color: #ffffff;
      }
      [data-theme='space'] .cme-tl-search-input {
        background: #0f172a;
        border-color: #475569;
        color: #f8fafc;
      }
      [data-theme='space'] .cme-tl-search-input::placeholder {
        color: #94a3b8;
      }
      [data-theme='space'] .cme-tl-search-input:focus {
        border-color: #60a5fa;
        background: #0b1120;
      }
      [data-theme='space'] .cme-tl-search-clear {
        background: #334155;
        color: #f8fafc;
      }
      [data-theme='space'] .cme-highway-label,
      [data-theme='space'] .cme-stage-title,
      [data-theme='space'] .cme-grid-title {
        color: #f8fafc;
      }
      [data-theme='space'] .cme-rail-node {
        background: #0f172a;
        border-color: #334155;
        border-top-color: var(--era-color, #60a5fa);
      }
      [data-theme='space'] .cme-rail-node::before {
        background: #475569;
      }
      [data-theme='space'] .cme-rail-node:hover {
        background: #162238;
      }
      [data-theme='space'] .cme-rail-node.active {
        background: rgba(99, 102, 241, 0.2);
        border-color: #818cf8;
      }
      [data-theme='space'] .cme-rail-meta {
        color: #fde68a;
      }
      [data-theme='space'] .cme-rail-title {
        color: #f1f5f9;
      }
      [data-theme='space'] .cme-stage-right {
        background: #152033;
        color: #f8fafc;
      }
      [data-theme='space'] .cme-beat-card {
        background: #0f172a;
        border-color: #334155;
      }
      [data-theme='space'] .cme-beat-text,
      [data-theme='space'] .cme-grid-beats {
        color: #e2e8f0;
      }
      [data-theme='space'] .beat-trigger .cme-beat-label,
      [data-theme='space'] .cme-grid-beat-tag.t {
        background: rgba(245, 158, 11, 0.18);
        color: #fde68a;
        border-color: rgba(251, 191, 36, 0.4);
      }
      [data-theme='space'] .beat-action .cme-beat-label,
      [data-theme='space'] .cme-grid-beat-tag.a {
        background: rgba(59, 130, 246, 0.2);
        color: #bfdbfe;
        border-color: rgba(96, 165, 250, 0.45);
      }
      [data-theme='space'] .beat-consequence .cme-beat-label,
      [data-theme='space'] .cme-grid-beat-tag.c {
        background: rgba(16, 185, 129, 0.18);
        color: #a7f3d0;
        border-color: rgba(52, 211, 153, 0.4);
      }
      [data-theme='space'] .cme-narrative-bridge {
        background: linear-gradient(90deg, rgba(79, 70, 229, 0.24) 0%, rgba(15, 23, 42, 0.92) 100%);
        border-color: rgba(129, 140, 248, 0.45);
        border-left-color: #818cf8;
      }
      [data-theme='space'] .cme-bridge-heading {
        color: #c7d2fe;
      }
      [data-theme='space'] .cme-bridge-text {
        color: #e2e8f0;
      }
      [data-theme='space'] .cme-taxonomy-box {
        border-top-color: #334155;
      }
      [data-theme='space'] .cme-agent-chip.person {
        background: rgba(37, 99, 235, 0.2);
        color: #bfdbfe;
        border-color: rgba(96, 165, 250, 0.45);
      }
      [data-theme='space'] .cme-agent-chip.person:hover {
        background: #2563eb;
        color: #ffffff;
      }
      [data-theme='space'] .cme-agent-chip.org {
        background: rgba(13, 148, 136, 0.22);
        color: #99f6e4;
        border-color: rgba(94, 234, 212, 0.45);
      }
      [data-theme='space'] .cme-agent-chip.org:hover {
        background: #0f766e;
        color: #ffffff;
      }
      [data-theme='space'] .cme-grid-card-hdr {
        border-bottom-color: #334155;
      }
      [data-theme='space'] .cme-grid-caption,
      [data-theme='space'] .cme-grid-footer {
        background: #0f172a;
        border-color: #334155;
        color: #cbd5e1;
      }
      [data-theme='space'] .cme-grid-map-btn {
        background: rgba(13, 148, 136, 0.2);
        color: #99f6e4;
        border-color: rgba(94, 234, 212, 0.45);
      }

      @media print {
        .cme-tl-topbar,
        .cme-tl-header-controls,
        .cme-tl-filter-bar,
        .cme-tl-lightbox {
          display: none !important;
        }
      }
    </style>

    <div id="cme-living-timeline-root" class="cme-tl-root">
      <!-- Top Return & Spec Bar -->
      <div class="cme-tl-topbar">
        <button type="button" class="cme-tl-return-pill" id="cme-tl-return-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span id="cme-tl-return-label">${escapeHtml(returnLabel)}</span>
        </button>
        <div class="cme-tl-topbar-meta">
          <span><i class="fa-solid fa-graduation-cap"></i> Pearson Edexcel GCSE (9–1) · Paper 2 Option P5 (1HI0/P5)</span>
          <span><span class="cme-tl-kbd">&larr;</span> <span class="cme-tl-kbd">&rarr;</span> Step Milestones</span>
        </div>
      </div>

      <!-- Compact Museum Header -->
      <header class="cme-tl-museum-header">
        <div class="cme-tl-title-col">
          <div class="cme-tl-eyebrow">
            <i class="fa-solid fa-compass"></i> Edexcel Paper 2 Period Study &bull; ${totalCount} Specification Milestones
          </div>
          <h1>Conflict in the Middle East, 1945–1995: Interactive Living Chronology</h1>
        </div>

        <div class="cme-tl-header-controls">
          <div class="cme-tl-mode-seg" role="tablist" aria-label="Timeline view mode">
            <button type="button" class="cme-tl-mode-btn active" data-view-mode="explorer" id="cme-mode-explorer-btn">
              🧭 Interactive Timeline Explorer
            </button>
            <button type="button" class="cme-tl-mode-btn" data-view-mode="grid" id="cme-mode-grid-btn">
              🗂️ All ${totalCount} Milestones Grid
            </button>
          </div>

          <button type="button" class="cme-tl-hdr-btn" id="cme-tl-tour-btn">
            ▶ Classroom Tour
          </button>
        </div>
      </header>

      <!-- Key Topic Filter Pills + Instant Search -->
      <div class="cme-tl-filter-bar">
        <div class="cme-tl-era-pills" id="cme-tl-era-pills">
          <button type="button" class="cme-era-filter-pill active" data-era="all" style="--pill-active-bg: #0f172a;">
            All Milestones (${totalCount})
          </button>
          <button type="button" class="cme-era-filter-pill" data-era="kt1" style="--pill-active-bg: ${ERA_CONFIG.kt1.color};">
            <span class="cme-era-dot-mini" style="background: ${ERA_CONFIG.kt1.color};"></span>
            ${ERA_CONFIG.kt1.pillLabel}
          </button>
          <button type="button" class="cme-era-filter-pill" data-era="kt2" style="--pill-active-bg: ${ERA_CONFIG.kt2.color};">
            <span class="cme-era-dot-mini" style="background: ${ERA_CONFIG.kt2.color};"></span>
            ${ERA_CONFIG.kt2.pillLabel}
          </button>
          <button type="button" class="cme-era-filter-pill" data-era="kt3a" style="--pill-active-bg: ${ERA_CONFIG.kt3a.color};">
            <span class="cme-era-dot-mini" style="background: ${ERA_CONFIG.kt3a.color};"></span>
            ${ERA_CONFIG.kt3a.pillLabel}
          </button>
          <button type="button" class="cme-era-filter-pill" data-era="kt3b" style="--pill-active-bg: ${ERA_CONFIG.kt3b.color};">
            <span class="cme-era-dot-mini" style="background: ${ERA_CONFIG.kt3b.color};"></span>
            ${ERA_CONFIG.kt3b.pillLabel}
          </button>
        </div>

        <div class="cme-tl-search-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            type="search"
            id="cme-tl-search-input"
            class="cme-tl-search-input"
            placeholder="Search events, leaders, UN 242, Oslo..."
            aria-label="Search timeline milestones"
          />
          <button type="button" class="cme-tl-search-clear" id="cme-tl-search-clear" title="Clear search">&times;</button>
        </div>
      </div>

      <!-- Dynamic Stage / Grid Container -->
      <div id="cme-tl-dynamic-stage"></div>

      <!-- Full-Screen Lightbox Modal -->
      <div class="cme-tl-lightbox" id="cme-tl-lightbox" role="dialog" aria-modal="true">
        <div class="cme-tl-lightbox-dialog">
          <div class="cme-tl-lightbox-hdr">
            <h3 id="cme-tl-lightbox-title">Archival Visual</h3>
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              <button type="button" class="cme-tl-hdr-btn" id="cme-tl-lightbox-switch" style="padding: 4px 10px; font-size: 0.74rem;">
                🗺️ Switch View
              </button>
              <button type="button" class="cme-tl-hdr-btn" id="cme-tl-lightbox-close" style="padding: 4px 10px; font-size: 0.9rem;">
                &times; Close
              </button>
            </div>
          </div>
          <div class="cme-tl-lightbox-body">
            <img id="cme-tl-lightbox-img" src="" alt="" />
          </div>
          <div class="cme-tl-lightbox-cap" id="cme-tl-lightbox-cap"></div>
        </div>
      </div>
    </div>
  `;

  const rootEl = mountEl.querySelector('#cme-living-timeline-root');
  const stageContainer = mountEl.querySelector('#cme-tl-dynamic-stage');
  const searchInput = mountEl.querySelector('#cme-tl-search-input');
  const searchClearBtn = mountEl.querySelector('#cme-tl-search-clear');
  const lightboxEl = mountEl.querySelector('#cme-tl-lightbox');
  const lightboxTitleEl = mountEl.querySelector('#cme-tl-lightbox-title');
  const lightboxImgEl = mountEl.querySelector('#cme-tl-lightbox-img');
  const lightboxCapEl = mountEl.querySelector('#cme-tl-lightbox-cap');
  const lightboxSwitchBtn = mountEl.querySelector('#cme-tl-lightbox-switch');

  function syncHeaderButtons() {
    if (!rootEl) return;
    rootEl.querySelectorAll('.cme-tl-mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.viewMode === viewMode);
    });
    rootEl.querySelectorAll('.cme-era-filter-pill').forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.era === currentEraFilter);
    });
    const tourBtn = rootEl.querySelector('#cme-tl-tour-btn');
    if (tourBtn) {
      tourBtn.classList.toggle('tour-active', isTourPlaying);
      tourBtn.textContent = isTourPlaying ? '⏸ Pause Tour' : '▶ Classroom Tour';
    }
    if (searchClearBtn) {
      searchClearBtn.classList.toggle('visible', searchQuery.length > 0);
    }
    const retSpan = rootEl.querySelector('#cme-tl-return-label');
    if (retSpan) {
      retSpan.textContent = computeReturnLabel();
    }
  }

  function openLightbox(milestoneGlobalIdx, mode = 'source') {
    const m = allMilestones[milestoneGlobalIdx];
    if (!m || !lightboxEl) return;
    lightboxState = { open: true, milestoneIdx: milestoneGlobalIdx, mode };
    const isMap = mode === 'map';
    lightboxTitleEl.textContent = `${m.shortDate} — ${m.cleanTitlePlain}`;
    lightboxImgEl.src = isMap ? m.eraMapUrl : m.imageUrl;
    lightboxImgEl.alt = m.cleanTitlePlain;
    lightboxCapEl.innerHTML = formatCleanText(isMap ? m.eraMapLabel : m.imageCaption);
    lightboxSwitchBtn.textContent = isMap ? '📷 View Archival Source' : '🗺️ View Era GIS Map';
    lightboxEl.classList.add('open');
  }

  function closeLightbox() {
    lightboxState.open = false;
    if (lightboxEl) lightboxEl.classList.remove('open');
  }

  function centerActiveHighwayNode(smooth = true) {
    const track = stageContainer?.querySelector('#cme-highway-scroll');
    const activeNode = track?.querySelector('.cme-rail-node.active');
    if (!track || !activeNode) return;
    const targetLeft =
      activeNode.offsetLeft - track.clientWidth / 2 + activeNode.offsetWidth / 2;
    track.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: smooth ? 'smooth' : 'auto',
    });
  }

  function renderAgentChipsHTML(m) {
    if (!m.keyAgents || m.keyAgents.length === 0) return '';
    return m.keyAgents
      .map((agentName) => {
        const isOrg = isAgentOrganisation(agentName);
        const icon = isOrg ? 'fa-building-columns' : 'fa-user';
        const cls = isOrg ? 'org' : 'person';
        const label = formatAgentChipLabel(agentName);
        return `
          <button
            type="button"
            class="cme-agent-chip ${cls}"
            data-action="jump-agent"
            data-agent-name="${escapeAttr(agentName)}"
            data-global-idx="${m.globalIdx}"
            title="Open ${escapeAttr(agentName)} in People &amp; Organisations"
          >
            <i class="fa-solid ${icon}"></i>
            <span>${escapeHtml(label)}</span>
          </button>
        `;
      })
      .join('');
  }

  function renderHighwayHTML(filtered, activePos) {
    const firstBound = filtered[0]?.shortDate || '1916';
    const lastBound = filtered[filtered.length - 1]?.shortDate || '1995';
    const maxVal = Math.max(1, filtered.length - 1);
    const pct = filtered.length <= 1 ? 100 : Math.round((activePos / maxVal) * 1000) / 10;

    return `
      <!-- Horizontal Milestone Highway -->
      <section class="cme-tl-highway-card" id="cme-tl-highway-card" aria-label="Horizontal Milestone Highway">
        <div class="cme-highway-top">
          <div class="cme-highway-label">
            <i class="fa-solid fa-route" style="color: #d97706;"></i>
            <span id="cme-highway-bounds-label">Milestone Highway (${escapeHtml(firstBound)} &rarr; ${escapeHtml(lastBound)})</span>
            <span class="cme-tour-live-pill" id="cme-tour-live-pill" style="${isTourPlaying ? '' : 'display: none;'}">● Classroom Tour Active (5.5s)</span>
          </div>

          <div class="cme-highway-nav">
            <button
              type="button"
              class="cme-step-btn"
              id="cme-step-prev-btn"
              data-action="step-prev"
              ${activePos <= 0 ? 'disabled' : ''}
            >
              &larr; Previous
            </button>
            <span class="cme-step-counter" id="cme-step-counter">
              Milestone ${activePos + 1} of ${filtered.length}
            </span>
            <button
              type="button"
              class="cme-step-btn"
              id="cme-step-next-btn"
              data-action="step-next"
              ${activePos >= filtered.length - 1 ? 'disabled' : ''}
            >
              Next &rarr;
            </button>
          </div>
        </div>

        <div class="cme-highway-scroll" id="cme-highway-scroll">
          ${filtered
        .map((item, idx) => {
          const isAct = idx === activePos;
          return `
                <button
                  type="button"
                  class="cme-rail-node ${isAct ? 'active' : ''}"
                  data-action="select-milestone"
                  data-global-idx="${item.globalIdx}"
                  style="--era-color: ${item.eraColor}; --era-soft: ${item.eraSoftBg};"
                >
                  <span class="cme-rail-dot"></span>
                  <span class="cme-rail-meta">#${item.num} ${escapeHtml(item.shortDate)}</span>
                  <span class="cme-rail-title">${escapeHtml(item.shortTitle)}</span>
                </button>
              `;
        })
        .join('')}
        </div>

        <div class="cme-scrubber-row">
          <span class="cme-scrubber-bound">${escapeHtml(firstBound)}</span>
          <input
            type="range"
            id="cme-range-scrubber"
            class="cme-range-scrubber"
            min="0"
            max="${Math.max(0, filtered.length - 1)}"
            value="${activePos}"
            step="1"
            style="background: linear-gradient(to right, #d97706 0%, #d97706 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%);"
            aria-label="Timeline milestone scrubber"
          />
          <span class="cme-scrubber-bound">${escapeHtml(lastBound)}</span>
        </div>
      </section>
    `;
  }

  function renderShowcaseCardHTML(filtered, activePos) {
    const m = filtered[activePos];
    const nextMilestone =
      m.globalIdx < totalCount - 1 ? allMilestones[m.globalIdx + 1] : null;
    const isMap = visualMode === 'map';
    const activeImgSrc = isMap ? m.eraMapUrl : m.imageUrl;
    const activeCaption = isMap ? m.eraMapLabel : m.imageCaption;

    return `
      <!-- Split Showcase Stage -->
      <article
        class="cme-showcase-stage"
        data-active-milestone="${m.num}"
        style="--era-color: ${m.eraColor}; --era-soft: ${m.eraSoftBg}; --era-border: ${m.eraSoftBorder};"
      >
        <!-- Left Column: Zero-Crop Archival Source <-> Era GIS Map -->
        <div class="cme-stage-left">
          <div class="cme-vis-toolbar">
            <div class="cme-vis-seg" role="tablist" aria-label="Visual display mode">
              <button
                type="button"
                class="cme-vis-btn ${!isMap ? 'active' : ''}"
                data-action="set-vis-mode"
                data-vis-mode="source"
              >
                📷 Archival Source
              </button>
              <button
                type="button"
                class="cme-vis-btn map-tab ${isMap ? 'active' : ''}"
                data-action="set-vis-mode"
                data-vis-mode="map"
              >
                🗺️ Sync Era GIS Map
              </button>
            </div>
            <button
              type="button"
              class="cme-vis-expand-btn"
              data-action="open-lightbox"
              data-global-idx="${m.globalIdx}"
              data-vis-mode="${visualMode}"
              title="Open full-screen viewer"
            >
              <i class="fa-solid fa-expand"></i>
            </button>
          </div>

          <div
            class="cme-stage-mat"
            data-action="open-lightbox"
            data-global-idx="${m.globalIdx}"
            data-vis-mode="${visualMode}"
          >
            <img
              src="${escapeAttr(activeImgSrc)}"
              alt="${escapeAttr(m.cleanTitlePlain)}"
            />
            <span class="cme-mat-zoom-pill">
              <i class="fa-solid fa-magnifying-glass-plus"></i> Click to Enlarge
            </span>
          </div>

          <div class="cme-stage-placard">
            <div>${formatCleanText(activeCaption)}</div>
            <div class="cme-placard-subrow">
              <span>${isMap ? 'GCSE Custom Vector Cartography' : `Milestone #${m.num} Primary Visual`}</span>
              <button
                type="button"
                class="cme-placard-switch-link"
                data-action="set-vis-mode"
                data-vis-mode="${isMap ? 'source' : 'map'}"
              >
                ${isMap ? 'Switch to 📷 Archival Source →' : 'Switch to 🗺️ Sync Era GIS Map →'}
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Edexcel Paper 2 Analytical Engine -->
        <div class="cme-stage-right">
          <div>
            <div class="cme-stage-meta-row">
              <div class="cme-stage-badges">
                <span class="cme-kt-badge" style="background: ${m.eraColor};">${escapeHtml(m.ktBadge)}</span>
                <span class="cme-date-pill">${escapeHtml(m.date)}</span>
                ${m.specTag ? `<span class="cme-spec-pill-top">${formatCleanText(m.specTag)}</span>` : ''}
              </div>

              <button
                type="button"
                class="cme-study-lesson-btn"
                data-action="study-lesson"
                data-lesson-idx="${m.lessonIndex}"
                data-global-idx="${m.globalIdx}"
              >
                <i class="fa-solid fa-book-open"></i>
                <span>Study Lesson (${escapeHtml(m.lessonShort)}) &rarr;</span>
              </button>
            </div>

            <h2 class="cme-stage-title">${formatCleanText(m.title)}</h2>
          </div>

          <!-- 3-Beat Causal Chain Cards -->
          <div class="cme-causal-chain">
            <div class="cme-beat-card beat-trigger">
              <span class="cme-beat-label">1. TRIGGER / CAUSE</span>
              <div class="cme-beat-text">${formatCleanText(m.trigger)}</div>
            </div>

            <div class="cme-beat-card beat-action" style="border-left-color: ${m.eraColor};">
              <span class="cme-beat-label">2. KEY ACTION / TURNING POINT</span>
              <div class="cme-beat-text">${formatCleanText(m.action)}</div>
            </div>

            <div class="cme-beat-card beat-consequence">
              <span class="cme-beat-label">3. HISTORICAL CONSEQUENCE</span>
              <div class="cme-beat-text">${formatCleanText(m.consequence)}</div>
            </div>
          </div>

          <!-- Interactive Edexcel 8-Mark Narrative Bridge Strip -->
          <div class="cme-narrative-bridge">
            <div class="cme-bridge-copy">
              <div class="cme-bridge-heading">
                <span>
                  🔗 ${nextMilestone
        ? `Causal Link to Next Milestone (${escapeHtml(nextMilestone.shortDate)}: ${escapeHtml(nextMilestone.shortTitle)}):`
        : 'Legacy Beyond 1995 (End of Specification Period):'
      }
                </span>
                <span class="cme-bridge-q2-tag">8-Mark Narrative Account</span>
              </div>
              <div class="cme-bridge-text">${formatCleanText(m.narrativeLinkToNext)}</div>
            </div>

            ${nextMilestone
        ? `
                <button
                  type="button"
                  class="cme-bridge-step-btn"
                  data-action="bridge-step-global"
                  data-global-idx="${nextMilestone.globalIdx}"
                >
                  Step Forward to ${escapeHtml(nextMilestone.shortDate)} &rarr;
                </button>
              `
        : `
                <button
                  type="button"
                  class="cme-bridge-step-btn"
                  data-action="bridge-step-global"
                  data-global-idx="0"
                >
                  &circlearrowleft; Restart at ${escapeHtml(allMilestones[0]?.shortDate || '1916')}
                </button>
              `
      }
          </div>

          <!-- Key Historical Agents & Spec Vocabulary -->
          <div class="cme-taxonomy-box">
            ${m.keyAgents && m.keyAgents.length > 0
        ? `
                <div class="cme-tax-row">
                  <span class="cme-tax-heading"><i class="fa-solid fa-address-card"></i> Key Agents &amp; Orgs:</span>
                  ${renderAgentChipsHTML(m)}
                </div>
              `
        : ''
      }
            ${m.keyTerms && m.keyTerms.length > 0
        ? `
                <div class="cme-tax-row">
                  <span class="cme-tax-heading"><i class="fa-solid fa-tags"></i> Spec Vocabulary:</span>
                  ${m.keyTerms.map((t) => `<span class="cme-spec-term-chip">${formatCleanText(t)}</span>`).join('')}
                </div>
              `
        : ''
      }
          </div>
        </div>
      </article>
    `;
  }

  function renderGridHTML(filtered) {
    return `
      <div class="cme-grid-summary-bar">
        <span>Showing <strong>${filtered.length}</strong> of ${totalCount} Specification Milestones</span>
        ${currentEraFilter !== 'all' || searchQuery.trim()
        ? `<button type="button" class="cme-grid-inspect-btn" data-action="reset-filters">Reset Filters</button>`
        : ''
      }
      </div>

      <div class="cme-grid-wall">
        ${filtered
        .map(
          (m) => `
            <article class="cme-grid-card" data-milestone-id="${escapeAttr(String(m.id))}" style="--era-color: ${m.eraColor};">
              <div class="cme-grid-card-hdr">
                <div class="cme-grid-hdr-top">
                  <div style="display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span class="cme-kt-badge" style="background: ${m.eraColor};">#${m.num} &bull; ${escapeHtml(m.ktBadge)}</span>
                    <span class="cme-date-pill">${escapeHtml(m.date)}</span>
                  </div>
                  <button
                    type="button"
                    class="cme-grid-map-btn"
                    data-action="open-lightbox"
                    data-global-idx="${m.globalIdx}"
                    data-vis-mode="map"
                    title="Quick-preview Era GIS Map"
                  >
                    🗺️ Map
                  </button>
                </div>
                <h3 class="cme-grid-title">${formatCleanText(m.title)}</h3>
              </div>

              <div
                class="cme-grid-thumb"
                data-action="open-lightbox"
                data-global-idx="${m.globalIdx}"
                data-vis-mode="source"
              >
                <img src="${escapeAttr(m.imageUrl)}" alt="${escapeAttr(m.cleanTitlePlain)}" loading="lazy" />
                <span class="cme-mat-zoom-pill"><i class="fa-solid fa-magnifying-glass-plus"></i> Enlarge</span>
              </div>

              ${m.imageCaption ? `<div class="cme-grid-caption">${formatCleanText(m.imageCaption)}</div>` : ''}

              <div class="cme-grid-body">
                <div class="cme-grid-beats">
                  <div class="cme-grid-beat-row">
                    <span class="cme-grid-beat-tag t">Trigger</span>
                    <span>${formatCleanText(m.trigger)}</span>
                  </div>
                  <div class="cme-grid-beat-row">
                    <span class="cme-grid-beat-tag a">Action</span>
                    <span>${formatCleanText(m.action)}</span>
                  </div>
                  <div class="cme-grid-beat-row">
                    <span class="cme-grid-beat-tag c">Consequence</span>
                    <span>${formatCleanText(m.consequence)}</span>
                  </div>
                </div>

                ${m.keyAgents && m.keyAgents.length > 0
              ? `<div class="cme-tax-row" style="margin-top: auto; padding-top: 6px; border-top: 1px dashed #e2e8f0;">${renderAgentChipsHTML(m)}</div>`
              : ''
            }
              </div>

              <div class="cme-grid-footer">
                <button
                  type="button"
                  class="cme-grid-inspect-btn"
                  data-action="inspect-on-timeline"
                  data-global-idx="${m.globalIdx}"
                >
                  <i class="fa-solid fa-compass"></i> Inspect on Timeline
                </button>
                <button
                  type="button"
                  class="cme-study-lesson-btn"
                  style="padding: 5px 11px; font-size: 0.75rem;"
                  data-action="study-lesson"
                  data-lesson-idx="${m.lessonIndex}"
                  data-global-idx="${m.globalIdx}"
                >
                  <i class="fa-solid fa-book-open"></i> Study Lesson (${escapeHtml(m.lessonShort)}) &rarr;
                </button>
              </div>
            </article>
          `,
        )
        .join('')}
      </div>
    `;
  }

  let renderedHighwayKey = '';

  function syncHighwayInPlace(filtered, activePos, smoothRail = true, skipScrubberValue = false) {
    const highwayEl = stageContainer?.querySelector('#cme-tl-highway-card');
    if (!highwayEl) return;

    const activeGlobalIdx = filtered[activePos]?.globalIdx;
    highwayEl.querySelectorAll('.cme-rail-node').forEach((btn) => {
      const btnIdx = parseInt(btn.dataset.globalIdx, 10);
      btn.classList.toggle('active', btnIdx === activeGlobalIdx);
    });

    const prevBtn = highwayEl.querySelector('#cme-step-prev-btn');
    if (prevBtn) prevBtn.disabled = activePos <= 0;
    const nextBtn = highwayEl.querySelector('#cme-step-next-btn');
    if (nextBtn) nextBtn.disabled = activePos >= filtered.length - 1;
    const counterEl = highwayEl.querySelector('#cme-step-counter');
    if (counterEl) counterEl.textContent = `Milestone ${activePos + 1} of ${filtered.length}`;
    const tourPill = highwayEl.querySelector('#cme-tour-live-pill');
    if (tourPill) tourPill.style.display = isTourPlaying ? '' : 'none';

    const scrubber = highwayEl.querySelector('#cme-range-scrubber');
    if (scrubber) {
      if (!skipScrubberValue) {
        scrubber.value = String(activePos);
      }
      const maxVal = Math.max(1, filtered.length - 1);
      const pct = filtered.length <= 1 ? 100 : Math.round((activePos / maxVal) * 1000) / 10;
      scrubber.style.background = `linear-gradient(to right, #d97706 0%, #d97706 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
    }

    centerActiveHighwayNode(smoothRail);
  }

  function getScrollAnchors() {
    const winY = typeof window !== 'undefined' ? window.scrollY : 0;
    const scroller =
      mountEl?.closest('.content-area, .main-scroll, #app-main') ||
      (mountEl && mountEl.scrollHeight > mountEl.clientHeight ? mountEl : null);
    return {
      winY,
      scroller,
      scrollerTop: scroller ? scroller.scrollTop : 0,
    };
  }

  function restoreScrollAnchors(anchors) {
    if (!anchors) return;
    if (typeof window !== 'undefined' && window.scrollY !== anchors.winY) {
      window.scrollTo({ top: anchors.winY, behavior: 'instant' });
    }
    if (anchors.scroller && anchors.scroller.scrollTop !== anchors.scrollerTop) {
      anchors.scroller.scrollTop = anchors.scrollerTop;
    }
  }

  function renderStageArea(smoothRail = true, skipScrubberValue = false) {
    if (!stageContainer) return;
    syncHeaderButtons();

    const filtered = getFilteredList();
    if (filtered.length === 0) {
      renderedHighwayKey = '';
      stageContainer.innerHTML = `
        <div class="cme-empty-box">
          <p style="margin: 0 0 12px 0; font-size: 0.95rem; font-weight: 700;">
            No milestones matched "${escapeHtml(searchQuery)}".
          </p>
          <button type="button" class="cme-study-lesson-btn" data-action="reset-filters">
            Clear Search &amp; Show All ${totalCount} Milestones
          </button>
        </div>
      `;
      return;
    }

    const activePos = ensureValidSelection(filtered);
    if (viewMode === 'grid') {
      renderedHighwayKey = '';
      stageContainer.innerHTML = renderGridHTML(filtered);
      return;
    }

    const nextHighwayKey = filtered.map((m) => m.globalIdx).join(',');
    const existingSlot = stageContainer.querySelector('#cme-showcase-card-slot');
    const existingHighway = stageContainer.querySelector('#cme-tl-highway-card');

    // Fast, zero-jump in-place update when stepping across the same filtered milestone list
    if (existingHighway && existingSlot && renderedHighwayKey === nextHighwayKey) {
      const anchors = getScrollAnchors();
      existingSlot.innerHTML = renderShowcaseCardHTML(filtered, activePos);
      syncHighwayInPlace(filtered, activePos, smoothRail, skipScrubberValue);
      restoreScrollAnchors(anchors);
      requestAnimationFrame(() => restoreScrollAnchors(anchors));
      return;
    }

    // Initial render or filter/mode change: mount persistent Highway + Showcase Slot
    renderedHighwayKey = nextHighwayKey;
    stageContainer.innerHTML = `
      ${renderHighwayHTML(filtered, activePos)}
      <div id="cme-showcase-card-slot">${renderShowcaseCardHTML(filtered, activePos)}</div>
    `;

    const scrubber = stageContainer.querySelector('#cme-range-scrubber');
    if (scrubber) {
      scrubber.addEventListener('input', (ev) => {
        const liveFiltered = getFilteredList();
        const nextPos = parseInt(ev.target.value, 10);
        if (!Number.isNaN(nextPos) && liveFiltered[nextPos]) {
          selectedGlobalIdx = liveFiltered[nextPos].globalIdx;
          if (typeof window !== 'undefined') {
            window._cmeActiveMilestoneIdx = selectedGlobalIdx;
          }
          renderStageArea(false, true);
        }
      });
    }
    requestAnimationFrame(() => centerActiveHighwayNode(false));
  }

  // Prevent mouse-click focus from nudging window scrollY before click handler runs
  rootEl.addEventListener('mousedown', (e) => {
    if (e.target.closest('.cme-bridge-step-btn, .cme-step-btn, .cme-rail-node, .cme-vis-btn')) {
      e.preventDefault();
    }
  });

  // Event Delegation on Root
  rootEl.addEventListener('click', (e) => {
    const returnBtn = e.target.closest('#cme-tl-return-btn');
    if (returnBtn) {
      e.preventDefault();
      stopTour();
      if (typeof window !== 'undefined' && typeof window.returnToSavedOrigin === 'function') {
        window.returnToSavedOrigin('cme_new');
      } else if (typeof window !== 'undefined' && typeof window.switchView === 'function') {
        window.switchView('lessons', 'cme_new');
      }
      return;
    }

    const modeBtn = e.target.closest('.cme-tl-mode-btn');
    if (modeBtn) {
      const nextMode = modeBtn.dataset.viewMode;
      if (nextMode && nextMode !== viewMode) {
        if (nextMode === 'grid') stopTour();
        viewMode = nextMode;
        renderStageArea(false);
      }
      return;
    }

    const tourBtn = e.target.closest('#cme-tl-tour-btn');
    if (tourBtn) {
      toggleTour();
      return;
    }

    const eraPill = e.target.closest('.cme-era-filter-pill');
    if (eraPill) {
      currentEraFilter = eraPill.dataset.era || 'all';
      renderStageArea(false);
      return;
    }

    if (e.target.closest('#cme-tl-search-clear')) {
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      renderStageArea(false);
      return;
    }

    if (e.target.closest('#cme-tl-lightbox-close') || e.target === lightboxEl) {
      closeLightbox();
      return;
    }

    if (e.target.closest('#cme-tl-lightbox-switch')) {
      const nextMode = lightboxState.mode === 'map' ? 'source' : 'map';
      openLightbox(lightboxState.milestoneIdx, nextMode);
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'select-milestone') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx) && allMilestones[gIdx]) {
        selectedGlobalIdx = gIdx;
        if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = gIdx;
        renderStageArea(true);
      }
    } else if (action === 'step-prev' || action === 'step-next') {
      const filtered = getFilteredList();
      const pos = ensureValidSelection(filtered);
      const nextPos = action === 'step-prev' ? pos - 1 : pos + 1;
      if (filtered[nextPos]) {
        selectedGlobalIdx = filtered[nextPos].globalIdx;
        if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = selectedGlobalIdx;
        renderStageArea(true);
      }
    } else if (action === 'set-vis-mode') {
      const nextVis = actionEl.dataset.visMode;
      if (nextVis === 'source' || nextVis === 'map') {
        visualMode = nextVis;
        renderStageArea(false);
      }
    } else if (action === 'open-lightbox') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      const mMode = actionEl.dataset.visMode || 'source';
      if (!Number.isNaN(gIdx)) openLightbox(gIdx, mMode);
    } else if (action === 'bridge-step-global') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx) && allMilestones[gIdx]) {
        // If Era filter hides the target milestone, expand back to 'all' seamlessly
        if (currentEraFilter !== 'all' && allMilestones[gIdx].era !== currentEraFilter) {
          currentEraFilter = 'all';
        }
        selectedGlobalIdx = gIdx;
        if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = gIdx;
        renderStageArea(true);
      }
    } else if (action === 'inspect-on-timeline') {
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (!Number.isNaN(gIdx) && allMilestones[gIdx]) {
        selectedGlobalIdx = gIdx;
        if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = gIdx;
        viewMode = 'explorer';
        renderStageArea(false);
        rootEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (action === 'study-lesson') {
      const lIdx = parseInt(actionEl.dataset.lessonIdx, 10);
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      cmeStudyLesson(lIdx, gIdx);
    } else if (action === 'jump-agent') {
      const agentName = actionEl.dataset.agentName;
      const gIdx = parseInt(actionEl.dataset.globalIdx, 10);
      if (agentName) cmeJumpToAgent(agentName, gIdx);
    } else if (action === 'reset-filters') {
      currentEraFilter = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      renderStageArea(false);
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (ev) => {
      searchQuery = ev.target.value || '';
      renderStageArea(false);
    });
  }

  // Horizontal Touch-Swipe on Explorer Milestone Detail Card (|dx| > 50 && |dx| > |dy| * 1.35)
  let cmeSwipeStartX = 0;
  let cmeSwipeStartY = 0;
  let cmeSwipeTracking = false;

  rootEl.addEventListener(
    'touchstart',
    (ev) => {
      if (viewMode !== 'explorer' || lightboxState.open) return;
      if (!ev.touches || ev.touches.length !== 1) {
        cmeSwipeTracking = false;
        return;
      }
      const card = ev.target.closest('.cme-showcase-stage');
      if (!card || ev.target.closest('input, select, textarea')) {
        cmeSwipeTracking = false;
        return;
      }
      cmeSwipeStartX = ev.touches[0].clientX;
      cmeSwipeStartY = ev.touches[0].clientY;
      cmeSwipeTracking = true;
    },
    { passive: true },
  );

  rootEl.addEventListener(
    'touchend',
    (ev) => {
      if (!cmeSwipeTracking) return;
      cmeSwipeTracking = false;
      if (!ev.changedTouches || ev.changedTouches.length === 0) return;
      const dx = ev.changedTouches[0].clientX - cmeSwipeStartX;
      const dy = ev.changedTouches[0].clientY - cmeSwipeStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        const filtered = getFilteredList();
        if (filtered.length === 0) return;
        const pos = ensureValidSelection(filtered);
        const nextPos = dx < 0 ? pos + 1 : pos - 1;
        if (filtered[nextPos]) {
          selectedGlobalIdx = filtered[nextPos].globalIdx;
          if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = selectedGlobalIdx;
          renderStageArea(true);
        }
      }
    },
    { passive: true },
  );

  // Safe Keyboard Navigation (auto-detaches when #cme-living-timeline-root leaves DOM)
  if (typeof window !== 'undefined') {
    const keyHandler = (ev) => {
      const liveRoot = document.getElementById('cme-living-timeline-root');
      if (!liveRoot || !document.body.contains(liveRoot)) {
        window.removeEventListener('keydown', keyHandler);
        if (window._cmeTimelineKeyHandler === keyHandler) {
          window._cmeTimelineKeyHandler = null;
        }
        stopTour();
        return;
      }

      if (ev.key === 'Escape' && lightboxState.open) {
        closeLightbox();
        return;
      }

      const tag = (ev.target && ev.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || ev.target?.isContentEditable) {
        // Allow range scrubber arrow keys natively without double-stepping
        return;
      }

      if (viewMode !== 'explorer' || lightboxState.open) return;

      if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
        const filtered = getFilteredList();
        if (filtered.length === 0) return;
        const pos = ensureValidSelection(filtered);
        const nextPos = ev.key === 'ArrowRight' ? pos + 1 : pos - 1;
        if (filtered[nextPos]) {
          ev.preventDefault();
          selectedGlobalIdx = filtered[nextPos].globalIdx;
          window._cmeActiveMilestoneIdx = selectedGlobalIdx;
          renderStageArea(true);
        }
      }
    };

    window._cmeTimelineKeyHandler = keyHandler;
    window.addEventListener('keydown', keyHandler);
  }

  activeInstance = {
    stopTour,
    setEraFilter(eraKey) {
      currentEraFilter = eraKey || 'all';
      renderStageArea(false);
    },
    setSearchQuery(q) {
      searchQuery = String(q || '');
      if (searchInput) searchInput.value = searchQuery;
      renderStageArea(false);
    },
    selectGlobalMilestone(gIdx) {
      const idx = Math.max(0, Math.min(totalCount - 1, parseInt(gIdx, 10) || 0));
      selectedGlobalIdx = idx;
      if (typeof window !== 'undefined') window._cmeActiveMilestoneIdx = idx;
      viewMode = 'explorer';
      renderStageArea(true);
    },
  };

  renderStageArea(false);
}

// Preserve both naming conventions across views.js & external callers
export const renderCmeLivingTimeline = renderCMELivingTimeline;

if (typeof window !== 'undefined') {
  window.renderCmeLivingTimeline = renderCMELivingTimeline;
  window.renderCMELivingTimeline = renderCMELivingTimeline;
  window.filterCMETimeline = filterCMETimeline;
  window.searchCMETimeline = searchCMETimeline;
  window.selectCMEMilestone = selectCMEMilestone;
  window.cmeJumpToAgent = cmeJumpToAgent;
  window.cmeStudyLesson = cmeStudyLesson;
  window.formatCleanText = formatCleanText;
}
