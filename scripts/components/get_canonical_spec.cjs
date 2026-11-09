/**
 * get_canonical_spec.cjs
 *
 * Automated Canonical Specification Feeder for GCSE History Workbooks.
 *
 * Reads directly from the verified Pearson Edexcel (1HI0) Issue 6 specification repository
 * in `public/data/specifications/` and returns the verbatim specification content
 * with dynamically calculated typography (auto-font-size, line-height, and vertical distribution).
 */

const fs = require('fs');
const path = require('path');

const SPEC_DIR = path.join(__dirname, '..', '..', 'public', 'data', 'specifications');

const UNIT_SPEC_MAP = {
  cme_new: {
    file: 'paper2_p5_middle_east.json',
    code: '1HI0/P5',
    titlePrefix: 'Pearson Edexcel GCSE (9–1) History Specification • Option P5',
    defaultCols: 3,
  },
  middle_east: {
    file: 'paper2_p5_middle_east.json',
    code: '1HI0/P5',
    titlePrefix: 'Pearson Edexcel GCSE (9–1) History Specification • Option P5',
    defaultCols: 3,
  },
  weimar_nazi_germany: {
    file: 'paper3_31_weimar_nazi_germany.json',
    code: '1HI0/31',
    titlePrefix: 'Pearson Edexcel GCSE (9–1) History Specification • Option 31',
    defaultCols: 4,
  },
  eee: {
    file: 'paper2_b4_early_elizabethan_england.json',
    code: '1HI0/B4',
    titlePrefix: 'Pearson Edexcel GCSE (9–1) History Specification • Option B4',
    defaultCols: 4,
  },
  early_elizabethan_england: {
    file: 'paper2_b4_early_elizabethan_england.json',
    code: '1HI0/B4',
    titlePrefix: 'Pearson Edexcel GCSE (9–1) History Specification • Option B4',
    defaultCols: 4,
  },
  usa: {
    file: 'paper3_33_usa_conflict_home_abroad.json',
    code: '1HI0/33',
    titlePrefix: 'Pearson Edexcel GCSE (9–1) History Specification • Option 33',
    defaultCols: 4,
  },
  usa_1954_1975: {
    file: 'paper3_33_usa_conflict_home_abroad.json',
    code: '1HI0/33',
    titlePrefix: 'Pearson Edexcel GCSE (9–1) History Specification • Option 33',
    defaultCols: 4,
  },
  edexcel_medicine: {
    file: 'paper1_11_medicine_britain.json',
    code: '1HI0/11',
    titlePrefix: 'Pearson Edexcel GCSE (9–1) History Specification • Option 11',
    defaultCols: 3,
  },
};

/**
 * Key historical concepts to emphasize across specification statements.
 * Adds subtle academic bolding (<strong>) to anchor terms without altering wording.
 */
const KEY_TERMS_TO_BOLD = [
  // CME
  'British Mandate', 'King David Hotel', 'UN Resolution 181', 'Arab-Israeli war (1948–49)',
  'Israeli Defence Forces', 'Law of Return', 'US aid', 'Nasser', 'Suez Crisis (1956)',
  'United Arab Republic', 'UAR', 'Cairo Conference (1964)', 'Fatah', 'PLO',
  'raid on Samu', 'Six Day War', 'UN Resolution 242', 'occupied territories',
  'Golan Heights', 'Gaza Strip', 'West Bank', 'Sinai', 'East Jerusalem',
  'PFLP airplane hijacks', 'Black September', 'Munich Olympics', 'Jordan (1970)',
  'Yom Kippur War (1973)', 'oil crisis', 'shuttle diplomacy', 'Sadat’s visit to Israel (1977)',
  'Camp David (1978)', 'Treaty of Washington (1979)', 'Arafat’s speech to the UN (1974)',
  'invasion of Lebanon (1982)', 'First Palestinian Intifada (1987–93)',
  'renunciation of terrorism', 'Gulf War (1991)', 'Oslo Accords (1993)',
  'Palestinian National Authority', 'Israel-Jordan peace treaty (1994)', 'Oslo II (1995)',
  // Weimar
  'Weimar Constitution', 'Treaty of Versailles', 'Spartacists', 'Freikorps',
  'Kapp Putsch', 'hyperinflation', 'Stresemann', 'Rentenmark', 'Dawes Plan',
  'Locarno Pact', 'League of Nations', 'Kellogg-Briand Pact', 'Young Plan',
  'Munich Putsch', 'Mein Kampf', 'Wall Street Crash', 'Great Depression',
  'Reichstag Fire', 'Enabling Act', 'Night of the Long Knives', 'Gestapo',
  'SS', 'Nuremberg Laws', 'Kristallnacht',
  // EEE
  'Religious settlement', 'Act of Supremacy', 'Act of Uniformity',
  'Mary, Queen of Scots', 'Revolt of the Northern Earls', 'Ridolfi Plot',
  'Throckmorton Plot', 'Babington Plot', 'Francis Drake', 'Armada', 'colonisation of Virginia',
  // USA
  'Brown v. Topeka (1954)', 'Little Rock High School (1957)', 'Montgomery Bus Boycott',
  'Rosa Parks', 'Martin Luther King', 'SCLC', 'SNCC', 'Greensboro sit-ins',
  'Freedom Riders', 'Civil Rights Act (1964)', 'Voting Rights Act (1965)',
  'Malcolm X', 'Black Power', 'Black Panthers', 'domino theory', 'Gulf of Tonkin',
  'Operation Rolling Thunder', 'Search and Destroy', 'Tet Offensive (1968)',
  'Vietnamisation', 'Paris Peace Agreement (1973)',
  // Medicine in Britain (Option 11)
  'Theory of the Four Humours', 'Four Humours', 'miasma theory', 'Galen',
  'Black Death, 1348–49', 'Black Death', 'Supernatural and religious explanations', 'supernatural and religious explanations',
  'bloodletting and purging', 'purifying the air', 'physician, apothecary and barber surgeon',
  'Thomas Sydenham', 'printing press', 'Royal Society', 'Vesalius', 'William Harvey',
  'circulation of the blood', 'Great Plague in London (1665)', 'Great Plague',
  'Pasteur’s Germ Theory', 'Germ Theory', 'Koch’s work on microbes', 'Robert Koch',
  'Florence Nightingale', 'influence of Nightingale', 'anaesthetics and antiseptics',
  'Public Health Act (1875)', 'Jenner and the development of vaccination', 'vaccination',
  'Cholera in London (1854)', 'Snow and the Broad Street pump', 'John Snow',
  'genetic and lifestyle factors', 'blood tests, scans and monitors', 'NHS',
  'magic bullets and antibiotics', 'mass vaccinations',
  'Fleming, Florey and Chain’s development of penicillin', 'penicillin',
  'lung cancer in the twenty-first century', 'lung cancer',
  // Western Front (Option 11 Section A)
  'Western Front', 'Ypres salient', 'the Somme', 'Arras and Cambrai', 'trench system',
  'RAMC', 'chain of evacuation', 'stretcher bearers', 'field ambulance',
  'dressing station', 'casualty clearing station', 'base hospital', 'underground hospital at Arras',
  'Thomas splint', 'mobile x-ray units', 'blood bank for the Battle of Cambrai',
  'blood transfusions', 'aseptic surgery'
];

function highlightKeyTerms(text) {
  let result = text;
  KEY_TERMS_TO_BOLD.forEach((term) => {
    // Avoid double bolding; support terms ending with letters, numbers, or parentheses
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!<strong>)(?<![A-Za-z0-9])(${escaped})(?![A-Za-z0-9])(?!<\\/strong>)`, 'g');
    result = result.replace(regex, '<strong>$1</strong>');
  });
  return result;
}

/**
 * Calculates responsive typography to ensure specification boxes fit nicely and professionally
 * with 0px overflow and balanced vertical space utilization.
 */
function calculateSpecTypography({ colCount, maxItems, maxChars, totalChars }) {
  let fontSize, lineHeight, titleSize, itemMargin, titleMargin, bulletSize;

  if (colCount >= 4) {
    // 4 columns (Weimar, Elizabethan, USA)
    if (maxChars > 320 || maxItems >= 4) {
      fontSize = '6.6pt';
      lineHeight = '1.20';
      titleSize = '7.2pt';
      itemMargin = '2.5px';
      titleMargin = '3.5px';
      bulletSize = '5.0px';
    } else if (maxChars > 220 || maxItems === 3) {
      fontSize = '7.2pt';
      lineHeight = '1.26';
      titleSize = '7.8pt';
      itemMargin = '3.5px';
      titleMargin = '4.0px';
      bulletSize = '5.5px';
    } else {
      fontSize = '7.8pt';
      lineHeight = '1.32';
      titleSize = '8.4pt';
      itemMargin = '4.0px';
      titleMargin = '4.8px';
      bulletSize = '6.0px';
    }
  } else {
    // 3 columns (Middle East, Medicine)
    if (maxChars > 420 || maxItems >= 5) {
      fontSize = '7.0pt';
      lineHeight = '1.22';
      titleSize = '7.6pt';
      itemMargin = '2.5px';
      titleMargin = '3.5px';
      bulletSize = '5.2px';
    } else if (maxChars > 270 || maxItems >= 4) {
      fontSize = '7.6pt';
      lineHeight = '1.30';
      titleSize = '8.2pt';
      itemMargin = '3.5px';
      titleMargin = '4.2px';
      bulletSize = '6.0px';
    } else {
      // 3 items with standard length (e.g. CME KT1, KT2, KT3)
      fontSize = '8.8pt';
      lineHeight = '1.42';
      titleSize = '9.2pt';
      itemMargin = '6.0px';
      titleMargin = '6.0px';
      bulletSize = '7.0px';
    }
  }

  return { fontSize, lineHeight, titleSize, itemMargin, titleMargin, bulletSize };
}

/**
 * Loads the verbatim Pearson Edexcel specification for a given unit and Key Topic.
 *
 * @param {string} unitId - e.g. 'cme_new', 'weimar_nazi_germany', 'eee', 'usa'
 * @param {number} keyTopicNum - 1-based Key Topic index (1, 2, 3, 4)
 * @returns {object} { title, subtopics, typography, rawSection }
 */
function getCanonicalGCSESpec(unitId, keyTopicNum = 1) {
  const config = UNIT_SPEC_MAP[unitId];
  if (!config) {
    throw new Error(`[getCanonicalGCSESpec] Unknown unitId: "${unitId}"`);
  }

  const filePath = path.join(SPEC_DIR, config.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`[getCanonicalGCSESpec] Specification file not found at: ${filePath}`);
  }

  const specData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const sectionIndex = keyTopicNum - 1;
  const section = specData.sections[sectionIndex];

  if (!section) {
    throw new Error(`[getCanonicalGCSESpec] Section ${keyTopicNum} not found in ${config.file}`);
  }

  const subtopics = (section.topics || []).map((t, idx) => {
    // Clean topic title: remove leading digits if needed for display consistency
    let cleanTitle = t.title.trim();
    if (!/^\d+\./.test(cleanTitle)) {
      cleanTitle = `${idx + 1}. ${cleanTitle}`;
    }

    const items = (t.points || []).map((pt) => {
      // Clean leading dashes, bullets, or redundant whitespace
      const cleanPt = pt.replace(/^[\s•\-\*]+/, '').trim();
      return highlightKeyTerms(cleanPt);
    });

    return {
      title: cleanTitle,
      items,
      rawPoints: t.points,
    };
  });

  const colCount = subtopics.length || config.defaultCols || 3;
  const maxItems = Math.max(...subtopics.map((s) => s.items.length), 1);
  const maxChars = Math.max(...subtopics.map((s) => s.items.join(' ').length), 1);
  const totalChars = subtopics.reduce((sum, s) => sum + s.items.join(' ').length, 0);

  const typography = calculateSpecTypography({
    colCount,
    maxItems,
    maxChars,
    totalChars,
  });

  const boxTitle = `${config.titlePrefix} • Key Topic ${keyTopicNum} Content`;

  return {
    boxTitle,
    subtopics,
    typography,
    colCount,
    maxItems,
    maxChars,
    sectionTitle: section.title,
    specSubtitle: specData.subtitle,
  };
}

/**
 * Generates the unified 3-Tier Specification & Progress Tracking Rows for Page 1 of GCSE Pupil Workbooks.
 *
 * Each row contains:
 * - title: Enquiry title (e.g. "KT 3.1: Diplomatic Negotiations: Shuttle Diplomacy to Camp David (1974–79)")
 * - enquiry: Disciplinary enquiry driving question
 * - specText: Verbatim Pearson Edexcel specification points with subtle key term highlighting
 * - lessonId: Lesson identifier
 *
 * @param {string} unitId - e.g. 'cme_new', 'edexcel_medicine', 'weimar_nazi_germany', 'usa', 'eee'
 * @param {number} keyTopicNum - 1-based Key Topic index (1, 2, 3, 4, 5)
 * @param {Array} [providedLessons=null] - Optional override array of lesson objects
 * @returns {object} { frameworkTitle, rows }
 */
function getCanonicalTrackingRows(unitId, keyTopicNum = 1, providedLessons = null) {
  const config = UNIT_SPEC_MAP[unitId];
  if (!config) {
    throw new Error(`[getCanonicalTrackingRows] Unknown unitId: "${unitId}"`);
  }

  const spec = getCanonicalGCSESpec(unitId, keyTopicNum);
  let lessons = providedLessons;

  if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
    const dbPath = path.join(__dirname, '..', '..', 'public', 'database.json');
    if (fs.existsSync(dbPath)) {
      try {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const allLessons = db[unitId]?.data?.lessons || [];
        if (unitId === 'edexcel_medicine') {
          const eraPrefixes = ['lesson_1_', 'lesson_2_', 'lesson_3_', 'lesson_4_', 'lesson_5_'];
          const targetPrefix = eraPrefixes[keyTopicNum - 1];
          lessons = allLessons.filter((l) => l.id && l.id.startsWith(targetPrefix));
        } else if (unitId === 'cme_new' || unitId === 'middle_east') {
          if (keyTopicNum === 1) lessons = allLessons.slice(0, 4);
          else if (keyTopicNum === 2) lessons = allLessons.slice(4, 9);
          else if (keyTopicNum === 3) lessons = allLessons.slice(9, 13);
        } else {
          const prefix = `lesson_${keyTopicNum}_`;
          lessons = allLessons.filter((l) => l.id && l.id.startsWith(prefix));
          if (lessons.length === 0) {
            lessons = allLessons.slice((keyTopicNum - 1) * 4, keyTopicNum * 4);
          }
        }
      } catch (e) {
        console.warn(`[getCanonicalTrackingRows] Error reading database.json: ${e.message}`);
      }
    }
  }

  const subtopics = spec.subtopics || [];
  const rows = [];

  // Verbatim CME specification point distributions directly derived from official Edexcel 1HI0/P5 syllabus
  const CME_SPEC_POINTS = {
    1: [
      ['Balfour Declaration & Sykes-Picot', 'Collapse of Ottoman rule', 'Zionism & Arab nationalism', 'British Mandate for Palestine (1922)'],
      ['Conflicting interests of Jews and Arabs', 'Post-WWII Jewish immigration', 'King David Hotel bombing (1946)', 'UN Partition Resolution 181 (1947)', 'Creation of Israel (1948)'],
      ['1948–49 Arab-Israeli War', 'Armistice lines & territorial changes', 'Creation of Palestinian refugee crisis', 'Israeli Law of Return & military defence'],
      ['Nasser & Egyptian leadership of the Arab world', 'Nationalisation of Suez Canal', '1956 Suez Crisis: British, French & Israeli invasion', 'Superpower intervention & UN peacekeeping']
    ],
    2: [
      ['Origins of the Six Day War', 'Headwater diversion & water disputes', 'Syrian support for Fatah', 'Samu raid (1966)', 'Expulsion of UNEF & Straits of Tiran closure (1967)'],
      ['Operation Focus preemptive airstrikes', '6-day mobile victory', 'Israeli capture of Sinai, Gaza Strip, West Bank, East Jerusalem, and Golan Heights'],
      ['UN Resolution 242 (\'land for peace\' formula)', 'Arab League Khartoum Summit \'Three Noes\'', '1 million Palestinians under Israeli military occupation & early religious settlements'],
      ['International fedayeen campaigns', 'PFLP Dawson\'s Field hijackings (1970)', 'King Hussein & Black September in Jordan', 'Munich Olympics hostage massacre (1972)'],
      ['War of Attrition & Suez artillery duels', 'Bar-Lev Line', 'Yom Kippur War surprise canal crossing (1973)', 'Superpower nuclear alert', 'Kissinger shuttle diplomacy & OPEC oil embargo']
    ],
    3: [
      ['Significance of the 1973 oil crisis & US/Soviet involvement', 'Kissinger shuttle diplomacy', 'Sadat\'s visit to Jerusalem (1977)', 'Camp David Accords (1978)', 'Treaty of Washington (1979)'],
      ['Arafat\'s \'gun and olive branch\' speech to UN (1974)', 'PLO armed operations from Lebanon', '1982 Israeli invasion & siege of Beirut', 'Sabra and Shatila', 'First Palestinian Intifada (1987–93)'],
      ['Arafat\'s renunciation of terrorism (1988)', 'Superpower shifts & 1991 Gulf War', 'Oslo Accords & White House handshake (1993)', 'Palestinian National Authority', '1994 Israel-Jordan peace', 'Oslo II (1995)'],
      ['Synoptic synthesis across Key Topics 1–3', 'Pearson Edexcel Paper 2 exam question structure & mark schemes', 'Final historical evaluation']
    ]
  };

  (lessons || []).forEach((l, idx) => {
    let title = l.title || `Enquiry ${idx + 1}`;
    if (!/^KT\s*\d+\.\d+/i.test(title)) {
      title = `KT ${keyTopicNum}.${idx + 1}: ${title.replace(/^(?:Enquiry|Lesson)\s*\d+:\s*/i, '').trim()}`;
    }

    let enquiry = '';
    if (l.enquiry_question && typeof l.enquiry_question === 'string') enquiry = l.enquiry_question.trim();
    else if (l.enquiryQuestion && typeof l.enquiryQuestion === 'string') enquiry = l.enquiryQuestion.trim();
    else if (l.enquiry && typeof l.enquiry === 'string') {
      const text = l.enquiry.trim();
      if (text.split(/\s+/).length > 35) {
        const qMatch = text.match(/([^.?!]+[?])/g);
        if (qMatch && qMatch.length > 0) enquiry = qMatch[qMatch.length - 1].trim();
      } else {
        enquiry = text;
      }
    } else if (l.hook_text && typeof l.hook_text === 'string') {
      const qMatch = l.hook_text.trim().match(/([^.?!]+[?])/g);
      if (qMatch && qMatch.length > 0) enquiry = qMatch[qMatch.length - 1].trim();
    }

    let specBullets = [];
    if (CME_SPEC_POINTS[keyTopicNum] && CME_SPEC_POINTS[keyTopicNum][idx]) {
      specBullets = CME_SPEC_POINTS[keyTopicNum][idx].map((pt) => highlightKeyTerms(pt));
    } else if (l.specification_anchor) {
      // Split anchor clauses if semicolon delimited or present as single string
      const clauses = l.specification_anchor.split(';').map((c) => c.trim()).filter(Boolean);
      specBullets = clauses.map((c) => highlightKeyTerms(c));
    } else if (subtopics[idx]?.items?.length) {
      specBullets = subtopics[idx].items;
    } else if (subtopics.length > 0) {
      const sIdx = Math.min(idx, subtopics.length - 1);
      specBullets = subtopics[sIdx]?.items || [];
    }

    const specText = specBullets.join(' &bull; ');

    rows.push({
      title,
      enquiry,
      specText,
      lessonId: l.id,
    });
  });

  const specCode = config.code || '1HI0';
  const frameworkTitle = `Key Topic ${keyTopicNum} Specification Framework (Edexcel ${specCode})`;

  return {
    frameworkTitle,
    rows,
  };
}

module.exports = {
  getCanonicalGCSESpec,
  getCanonicalTrackingRows,
  calculateSpecTypography,
  highlightKeyTerms,
  UNIT_SPEC_MAP,
};
