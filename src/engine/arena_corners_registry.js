/**
 * ARENA CORNERS REGISTRY
 * Dedicated Master Registry of Four Corners Evaluative Historical Debates.
 * 
 * DESIGN PRINCIPLES:
 * 1. True Evaluative Enquiry Questions:
 *    - Replaces raw topic headings ("KT 2.5: The War of Attrition...") with high-order evaluative prompts:
 *      "Which factor was the DECISIVE turning point in breaking the Middle East stalemate (1969–1973)?"
 * 2. Four Competing Causal Claims (Not Just Timeline Summaries):
 *    - Every corner has a distinct, defensible thesis explaining WHY it was the decisive factor.
 *    - Every corner provides an oral defense starter for students during the 60s group consultation & 30s spotlight.
 * 3. Full Disciplinary Alignment with GCSE & KS3 Exam Assessment Objectives (AO1 Knowledge & AO2 Causal Explanation).
 */

export const ARENA_CORNERS_REGISTRY = {
  // ==========================================
  // CME_NEW (Conflict in the Middle East 1945-1995)
  // ==========================================
  cme_new: {
    // Lesson 5 in course flow (ID: lesson_6 in data.js): Causes of Six-Day War
    lesson_6: {
      enquiry: "Which factor was the DECISIVE catalyst that made the 1967 Six-Day War inevitable?",
      corners: [
        {
          corner: "Corner 1",
          location: "Front Left",
          color: "#dc2626",
          bg: "#fef2f2",
          border: "#fca5a5",
          badgeBg: "#fee2e2",
          label: "RESOURCE CONFLICT",
          title: "The Battle for the River Jordan Waterways",
          detail: "Syria's attempts to divert the Jordan headwaters threatened Israel's primary water supply, sparking tank duels and establishing water as an existential casus belli.",
          starter: "&ldquo;Our corner was decisive because cutting off a nation's vital fresh water supply made armed military defense unavoidable...&rdquo;"
        },
        {
          corner: "Corner 2",
          location: "Front Right",
          color: "#2563eb",
          bg: "#eff6ff",
          border: "#93c5fd",
          badgeBg: "#dbeafe",
          label: "BORDER RAIDS & RETALIATION",
          title: "Fatah Guerrilla Infiltration & Golan Clashes",
          detail: "Cross-border raids by Yasser Arafat's Fatah guerrillas and Syrian artillery fire from the Golan Heights created continuous military escalation and pressure on Israeli leaders.",
          starter: "&ldquo;Our corner was decisive because continuous civilian casualties and border shelling forced Israeli leaders to seek a permanent military solution...&rdquo;"
        },
        {
          corner: "Corner 3",
          location: "Back Left",
          color: "#d97706",
          bg: "#fffbeb",
          border: "#fcd34d",
          badgeBg: "#fef3c7",
          label: "COLD WAR MISINFORMATION",
          title: "Soviet False Reports & Egyptian Sinai Mobilisation",
          detail: "Soviet false intelligence warnings of an Israeli buildup on Syria's border panicked Nasser into deploying 100,000 troops to the Sinai Desert, starting an unstoppable military spiral.",
          starter: "&ldquo;Our corner was decisive because Soviet false warnings triggered the massive troop deployment in Sinai that made de-escalation impossible...&rdquo;"
        },
        {
          corner: "Corner 4",
          location: "Back Right",
          color: "#059669",
          bg: "#f0fdf4",
          border: "#86efac",
          badgeBg: "#dcfce7",
          label: "MARITIME BLOCKADE",
          title: "Expelling UNEF & Closing the Straits of Tiran",
          detail: "Nasser's eviction of UN peacekeepers and blockade of Israeli shipping through the Gulf of Aqaba choked Israel's oil imports, providing the immediate legal and military trigger for war.",
          starter: "&ldquo;Our corner was decisive because blockading international shipping through the Straits of Tiran was an undeniable act of war that left Israel no choice...&rdquo;"
        }
      ]
    },
    lesson_5: { // Alias for lesson_6
      enquiry: "Which factor was the DECISIVE catalyst that made the 1967 Six-Day War inevitable?",
      corners: [
        {
          corner: "Corner 1",
          location: "Front Left",
          color: "#dc2626",
          bg: "#fef2f2",
          border: "#fca5a5",
          badgeBg: "#fee2e2",
          label: "RESOURCE CONFLICT",
          title: "The Battle for the River Jordan Waterways",
          detail: "Syria's attempts to divert the Jordan headwaters threatened Israel's primary water supply, sparking tank duels and establishing water as an existential casus belli.",
          starter: "&ldquo;Our corner was decisive because cutting off a nation's vital fresh water supply made armed military defense unavoidable...&rdquo;"
        },
        {
          corner: "Corner 2",
          location: "Front Right",
          color: "#2563eb",
          bg: "#eff6ff",
          border: "#93c5fd",
          badgeBg: "#dbeafe",
          label: "BORDER RAIDS & RETALIATION",
          title: "Fatah Guerrilla Infiltration & Golan Clashes",
          detail: "Cross-border raids by Yasser Arafat's Fatah guerrillas and Syrian artillery fire from the Golan Heights created continuous military escalation and pressure on Israeli leaders.",
          starter: "&ldquo;Our corner was decisive because continuous civilian casualties and border shelling forced Israeli leaders to seek a permanent military solution...&rdquo;"
        },
        {
          corner: "Corner 3",
          location: "Back Left",
          color: "#d97706",
          bg: "#fffbeb",
          border: "#fcd34d",
          badgeBg: "#fef3c7",
          label: "COLD WAR MISINFORMATION",
          title: "Soviet False Reports & Egyptian Sinai Mobilisation",
          detail: "Soviet false intelligence warnings of an Israeli buildup on Syria's border panicked Nasser into deploying 100,000 troops to the Sinai Desert, starting an unstoppable military spiral.",
          starter: "&ldquo;Our corner was decisive because Soviet false warnings triggered the massive troop deployment in Sinai that made de-escalation impossible...&rdquo;"
        },
        {
          corner: "Corner 4",
          location: "Back Right",
          color: "#059669",
          bg: "#f0fdf4",
          border: "#86efac",
          badgeBg: "#dcfce7",
          label: "MARITIME BLOCKADE",
          title: "Expelling UNEF & Closing the Straits of Tiran",
          detail: "Nasser's eviction of UN peacekeepers and blockade of Israeli shipping through the Gulf of Aqaba choked Israel's oil imports, providing the immediate legal and military trigger for war.",
          starter: "&ldquo;Our corner was decisive because blockading international shipping through the Straits of Tiran was an undeniable act of war that left Israel no choice...&rdquo;"
        }
      ]
    },

    // Lesson 10 (KT 2.5: The War of Attrition & The Yom Kippur War) - THE SCREENSHOT LESSON!
    lesson_10: {
      enquiry: "Which factor was the DECISIVE catalyst in breaking the Middle East diplomatic deadlock (1969–1973)?",
      corners: [
        {
          corner: "Corner 1",
          location: "Front Left",
          color: "#dc2626",
          bg: "#fef2f2",
          border: "#fca5a5",
          badgeBg: "#fee2e2",
          label: "FRONTLINE ATTRITION",
          title: "The 18-Month War of Attrition (1969–1970)",
          detail: "Heavy canal artillery duels and commando raids shattered the illusion of quiet borders, inflicting high casualties on Israel and demonstrating that static occupation was unsustainable.",
          starter: "&ldquo;Our corner was decisive because sustained attrition along the Suez Canal proved that static Israeli occupation was too costly to maintain...&rdquo;"
        },
        {
          corner: "Corner 2",
          location: "Front Right",
          color: "#2563eb",
          bg: "#eff6ff",
          border: "#93c5fd",
          badgeBg: "#dbeafe",
          label: "DIPLOMATIC REALIGNMENT",
          title: "Sadat Expels 15,000 Soviet Advisers (1972)",
          detail: "Expelling Soviet military personnel demonstrated Egyptian diplomatic independence and forced the United States to realize that Arab peace initiatives had to be taken seriously.",
          starter: "&ldquo;Our corner was decisive because breaking free from Soviet control proved Egypt was ready for diplomacy and forced the US to intervene...&rdquo;"
        },
        {
          corner: "Corner 3",
          location: "Back Left",
          color: "#d97706",
          bg: "#fffbeb",
          border: "#fcd34d",
          badgeBg: "#fef3c7",
          label: "MILITARY SHOCK",
          title: "The Yom Kippur Surprise Assault & Crossing the Bar-Lev Line",
          detail: "Overrunning the supposedly impregnable Bar-Lev Line on Yom Kippur shattered the psychological myth of Israeli military invincibility, restored Arab national pride, and forced urgent negotiations.",
          starter: "&ldquo;Our corner was decisive because piercing the Bar-Lev Line permanently destroyed Israeli complacency and proved military dominance could not guarantee peace...&rdquo;"
        },
        {
          corner: "Corner 4",
          location: "Back Right",
          color: "#059669",
          bg: "#f0fdf4",
          border: "#86efac",
          badgeBg: "#dcfce7",
          label: "ECONOMIC COERCION",
          title: "The OPEC Arab Oil Embargo & Global Energy Shock",
          detail: "Quadrupling crude oil prices and embargoing Western supporters brought the global economy to a standstill, compelling Henry Kissinger and Western powers to demand immediate diplomacy.",
          starter: "&ldquo;Our corner was decisive because the global economic panic of the oil embargo forced the superpowers to treat Middle Eastern peace as an urgent necessity...&rdquo;"
        }
      ]
    },

    lesson_11: {
      enquiry: "Which factor was MOST decisive in securing the historic 1978–1979 Egyptian-Israeli Peace Treaty?",
      corners: [
        {
          corner: "Corner 1",
          location: "Front Left",
          color: "#dc2626",
          bg: "#fef2f2",
          border: "#fca5a5",
          badgeBg: "#fee2e2",
          label: "PERSONAL STATESMANSHIP",
          title: "Anwar Sadat's Historic Speech to the Israeli Knesset",
          detail: "Sadat's unprecedented journey to Jerusalem in November 1977 broke the 30-year psychological wall of hatred and convinced ordinary Israelis that Egypt genuinely wanted peace.",
          starter: "&ldquo;Our corner was decisive because Sadat's personal courage in addressing the Knesset shattered thirty years of psychological enmity in a single day...&rdquo;"
        },
        {
          corner: "Corner 2",
          location: "Front Right",
          color: "#2563eb",
          bg: "#eff6ff",
          border: "#93c5fd",
          badgeBg: "#dbeafe",
          label: "TERRITORIAL COMPROMISE",
          title: "Menachem Begin & The Total Return of the Sinai",
          detail: "Israel's agreement to dismantle Jewish settlements and return every square mile of the oil-rich Sinai peninsula provided Egypt with the indispensable physical prize required for peace.",
          starter: "&ldquo;Our corner was decisive because without the complete return of sovereign Egyptian land in the Sinai, no Arab leader could have signed a treaty...&rdquo;"
        },
        {
          corner: "Corner 3",
          location: "Back Left",
          color: "#d97706",
          bg: "#fffbeb",
          border: "#fcd34d",
          badgeBg: "#fef3c7",
          label: "SUPERPOWER MEDIATION",
          title: "President Jimmy Carter's Camp David Diplomacy",
          detail: "Thirteen days of relentless personal mediation at Camp David by President Carter prevented talks from collapsing and pledged billions in US economic and military aid to both nations.",
          starter: "&ldquo;Our corner was decisive because Carter's personal diplomacy and massive financial guarantees kept both leaders at the negotiating table until a deal was signed...&rdquo;"
        },
        {
          corner: "Corner 4",
          location: "Back Right",
          color: "#059669",
          bg: "#f0fdf4",
          border: "#86efac",
          badgeBg: "#dcfce7",
          label: "STRATEGIC EXHAUSTION",
          title: "Economic Exhaustion & Bloodshed Fatigue",
          detail: "Decades of war spending had impoverished Egypt's domestic economy and inflicted intolerable casualties on Israel, convincing both societies that continued warfare meant mutual ruin.",
          starter: "&ldquo;Our corner was decisive because economic exhaustion and grief from five consecutive wars made prolonged conflict impossible for both nations...&rdquo;"
        }
      ]
    }
  },

  // ==========================================
  // MEDIEVAL_ENGLAND (1066–1485)
  // ==========================================
  medieval_england: {
    lesson_2: {
      enquiry: "Which method of Norman subjugation was MOST decisive in securing William’s control over England?",
      corners: [
        {
          corner: "Corner 1",
          location: "Front Left",
          color: "#dc2626",
          bg: "#fef2f2",
          border: "#fca5a5",
          badgeBg: "#fee2e2",
          label: "PHYSICAL COERCION",
          title: "Motte-and-Bailey Castles",
          detail: "Building over 500 wooden and stone castles across England provided permanent garrison hubs to intimidate Saxon towns and crush local rebellions within hours.",
          starter: "&ldquo;Our corner was decisive because permanent castles gave Norman garrisons invincible physical dominance over surrounding populations...&rdquo;"
        },
        {
          corner: "Corner 2",
          location: "Front Right",
          color: "#2563eb",
          bg: "#eff6ff",
          border: "#93c5fd",
          badgeBg: "#dbeafe",
          label: "TOTAL TERROR",
          title: "The Harrying of the North (1069–1070)",
          detail: "Systematically burning crops, slaughtering livestock, and salting farmland between York and Durham eliminated Northern rebellion through catastrophic terror and mass starvation.",
          starter: "&ldquo;Our corner was decisive because the ruthless destruction of the Harrying sent an unmistakable warning that active resistance meant total annihilation...&rdquo;"
        },
        {
          corner: "Corner 3",
          location: "Back Left",
          color: "#d97706",
          bg: "#fffbeb",
          border: "#fcd34d",
          badgeBg: "#fef3c7",
          label: "ADMINISTRATIVE CONTROL",
          title: "The Domesday Book Survey (1086)",
          detail: "Auditing every acre of land, head of cattle, and Saxon holding provided William with total fiscal control, precise tax revenue, and legal proof of who owned the kingdom.",
          starter: "&ldquo;Our corner was decisive because recording every asset in England created an inescapable administrative grip on wealth and military taxation...&rdquo;"
        },
        {
          corner: "Corner 4",
          location: "Back Right",
          color: "#059669",
          bg: "#f0fdf4",
          border: "#86efac",
          badgeBg: "#dcfce7",
          label: "FEUDAL DISPOSSESSION",
          title: "Feudal Land Redistribution to Norman Barons",
          detail: "Confiscating virtually all Anglo-Saxon estates and granting them to just 200 loyal Norman barons bound the aristocracy directly to the crown under military service oaths.",
          starter: "&ldquo;Our corner was decisive because replacing the entire Saxon ruling class with loyal Norman tenants-in-chief permanently secured the throne...&rdquo;"
        }
      ]
    }
  },

  // ==========================================
  // THE_SHOAH (KS3 Holocaust Education)
  // ==========================================
  the_shoah: {
    lesson_4: {
      enquiry: "Which historical factor was MOST decisive in the radicalisation to systematic mass murder (1941–1942)?",
      corners: [
        {
          corner: "Corner 1",
          location: "Front Left",
          color: "#dc2626",
          bg: "#fef2f2",
          border: "#fca5a5",
          badgeBg: "#fee2e2",
          label: "TOTAL WAR CONDITIONS",
          title: "Operation Barbarossa & Total War Brutality",
          detail: "The invasion of the Soviet Union transformed the conflict into an ideological war of annihilation, shattering moral boundaries and creating battlefield chaos that radicalised extermination.",
          starter: "&ldquo;Our corner was decisive because total war in the East removed all legal and moral restraints, enabling atrocities that were impossible in peacetime...&rdquo;"
        },
        {
          corner: "Corner 2",
          location: "Front Right",
          color: "#2563eb",
          bg: "#eff6ff",
          border: "#93c5fd",
          badgeBg: "#dbeafe",
          label: "PARAMILITARY PERPETRATORS",
          title: "The Einsatzgruppen Mobile Killing Squads",
          detail: "SS mobile execution units carried out mass shootings of over 1.5 million people in open ravines like Babi Yar, marking the physical transition from segregation to systematic murder.",
          starter: "&ldquo;Our corner was decisive because the open mass shootings of the Einsatzgruppen proved that systematic mass murder was being actively implemented...&rdquo;"
        },
        {
          corner: "Corner 3",
          location: "Back Left",
          color: "#d97706",
          bg: "#fffbeb",
          border: "#fcd34d",
          badgeBg: "#fef3c7",
          label: "STATE BUREAUCRACY",
          title: "The Wannsee Conference & Continental Bureaucracy",
          detail: "Senior civil servants coordinated ministries, railways, and police forces across Europe to implement the logistical transportation of millions to extermination sites.",
          starter: "&ldquo;Our corner was decisive because without the administrative coordination of state ministries at Wannsee, continental murder was logistically impossible...&rdquo;"
        },
        {
          corner: "Corner 4",
          location: "Back Right",
          color: "#059669",
          bg: "#f0fdf4",
          border: "#86efac",
          badgeBg: "#dcfce7",
          label: "IDEOLOGICAL CENTRALISATION",
          title: "Hitler's Uncompromising Racial Obsession",
          detail: "The central Nazi racial worldview that viewed European Jews as an existential enemy provided the continuous ideological imperative that drove every level of the state to murder.",
          starter: "&ldquo;Our corner was decisive because the central racial ideology of the regime provided the relentless motivation that directed all policy...&rdquo;"
        }
      ]
    }
  }
};

/**
 * Cleanly generates or retrieves Four Corners data for any lesson across the platform.
 */
export function getArenaCornersData(unitId, lessonId, lesson) {
  const normUnit = (unitId || '').toLowerCase().trim();
  const normLesson = (lessonId || '').toLowerCase().trim();

  // 1. Direct registry lookup
  const unitRegistry = ARENA_CORNERS_REGISTRY[normUnit];
  if (unitRegistry) {
    if (unitRegistry[normLesson]) {
      return {
        enquiry: unitRegistry[normLesson].enquiry,
        cornerItems: unitRegistry[normLesson].corners
      };
    }
    // Match numeric index (e.g. lesson_10 from 10)
    const numMatch = normLesson.match(/\d+/);
    if (numMatch) {
      const numKey = 'lesson_' + numMatch[0];
      if (unitRegistry[numKey]) {
        return {
          enquiry: unitRegistry[numKey].enquiry,
          cornerItems: unitRegistry[numKey].corners
        };
      }
    }
  }

  // 2. Compute a clean, genuine Evaluative Enquiry Question
  let cleanEnquiry = '';
  const rawEnquiry = lesson?.enquiry_question || lesson?.enquiryQuestion || lesson?.enquiry || '';

  if (rawEnquiry && rawEnquiry.includes('?')) {
    cleanEnquiry = rawEnquiry.replace(/^(?:Enquiry|Lesson|KT\s*\d+(\.\d+)?)\s*[:\-]?\s*/i, '').trim();
  } else if (lesson?.title && lesson.title.includes('?')) {
    const qPart = lesson.title.substring(lesson.title.indexOf('?') - 60, lesson.title.indexOf('?') + 1);
    const m = lesson.title.match(/([A-Z][^:?\n]+?\?)/);
    cleanEnquiry = m ? m[1] : lesson.title.replace(/^(?:Enquiry|Lesson|KT\s*\d+(\.\d+)?)\s*[:\-]?\s*/i, '').trim();
  } else if (lesson?.learning_objective) {
    const objText = lesson.learning_objective.replace(/^(?:Explain\s+why|Explain\s+how|To\s+understand\s+how|To\s+understand\s+why)\s+/i, '').trim();
    cleanEnquiry = `Which factor was MOST decisive in ${objText.replace(/\.$/, '')}?`;
  } else {
    const rawTitle = (lesson?.title || 'this historical period').replace(/^(?:Enquiry|Lesson|KT\s*\d+(\.\d+)?)\s*[:\-]?\s*/i, '').trim();
    cleanEnquiry = `Which factor had the MOST decisive historical significance in ${rawTitle}?`;
  }

  // 3. Transform stages into 4 Causal Argumentative Corners
  const stages = lesson?.causal_domino_spine?.stages || [];
  let cornerItems = [];

  const cornerPalette = [
    { corner: 'Corner 1', location: 'Front Left', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', badgeBg: '#fee2e2' },
    { corner: 'Corner 2', location: 'Front Right', color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', badgeBg: '#dbeafe' },
    { corner: 'Corner 3', location: 'Back Left', color: '#d97706', bg: '#fffbeb', border: '#fcd34d', badgeBg: '#fef3c7' },
    { corner: 'Corner 4', location: 'Back Right', color: '#059669', bg: '#f0fdf4', border: '#86efac', badgeBg: '#dcfce7' }
  ];

  if (stages.length >= 4) {
    const indices = [0, 1, Math.min(2, stages.length - 2), stages.length - 1];
    cornerItems = indices.map((stIdx, cIdx) => {
      const s = stages[stIdx];
      const p = cornerPalette[cIdx];
      const argDetail = s.therefore || s.because || s.trigger || '';
      return {
        ...p,
        label: s.tag || `DECISIVE FACTOR ${cIdx + 1}`,
        title: s.title || `Historical Catalyst ${cIdx + 1}`,
        detail: argDetail.length > 180 ? argDetail.substring(0, 175) + '...' : argDetail,
        starter: `&ldquo;Our corner was decisive because without ${s.title || 'this turning point'}, the outcome would have failed because...&rdquo;`
      };
    });
  } else {
    // 4 Universal Disciplinary Levers
    cornerItems = [
      {
        ...cornerPalette[0],
        label: 'MILITARY & ARMED FORCE',
        title: 'Battlefield Supremacy & Physical Action',
        detail: 'The outcome was determined fundamentally by military supremacy, tactical shock, and physical subjugation.',
        starter: '&ldquo;Physical power and armed supremacy were decisive because without victory on the battlefield...&rdquo;'
      },
      {
        ...cornerPalette[1],
        label: 'DIPLOMATIC REALPOLITIK',
        title: 'Alliances & Superpower Leverage',
        detail: 'International treaties, external superpower aid, and diplomatic isolation formed the true levers of victory.',
        starter: '&ldquo;Diplomatic alliances and international leverage were decisive because isolated nations cannot survive without...&rdquo;'
      },
      {
        ...cornerPalette[2],
        label: 'ECONOMIC & RESOURCE POWER',
        title: 'Finance, Trade & Resource Coercion',
        detail: 'Control over financial wealth, trade routes, blockades, and industrial production decided the long-term struggle.',
        starter: '&ldquo;Economic power and material resources were decisive because military campaigns collapse without...&rdquo;'
      },
      {
        ...cornerPalette[3],
        label: 'IDEOLOGY & LEADERSHIP',
        title: 'Decisive Decisions & Popular Legitimacy',
        detail: 'The personal will of key leaders, moral legitimacy, and civilian resilience were the indispensable turning points.',
        starter: '&ldquo;Human agency and ideological conviction were decisive because weapons alone are useless without...&rdquo;'
      }
    ];
  }

  return {
    enquiry: cleanEnquiry,
    cornerItems
  };
}
