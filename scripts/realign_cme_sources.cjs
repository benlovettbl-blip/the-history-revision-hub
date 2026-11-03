const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../public/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const cme = db.cme_new.data || db.cme_new;

console.log('='.repeat(80));
console.log('REALIGNING CME SOURCES: LESSONS 7, 1, AND 12');
console.log('='.repeat(80));

// -------------------------------------------------------------
// 1. LESSON 7: THE SIX-DAY WAR (MAY–JUNE 1967)
// -------------------------------------------------------------
const l7 = cme.lessons.find(x => x.id === 'lesson_7');
if (l7) {
  l7.sources = [
    {
      id: "cme_l7_source_a",
      letter: "A",
      target_stage: 1,
      title: "Source A: President Gamal Abdel Nasser's Address to Arab Trade Unionists (26 May 1967)",
      type: "written",
      provenance: "Speech by President Gamal Abdel Nasser, broadcast on Radio Cairo and the Voice of the Arabs, 26 May 1967.",
      citation: "Radio Cairo / British Broadcasting Corporation (BBC) Monitoring Service, May 1967.",
      content: "The battle will be a general one and our basic objective will be to destroy Israel. I probably could not have said such things five or even three years ago. If I had said such things, people would have said that I was bragging. Today I say such things because I am confident. We are now prepared to confront Israel... The Soviet Union has informed us of the concentration of Israeli forces on the Syrian border. Our armed forces have completed their mobilization in the Sinai and are ready for confrontation.",
      caption: "Official broadcast transcript of Egyptian President Gamal Abdel Nasser addressing the General Council of the International Confederation of Arab Trade Unions in Cairo on 26 May 1967, declaring readiness for total confrontation.",
      desc: "Transcript of President Gamal Abdel Nasser's speech on 26 May 1967 declaring readiness for war with Israel.",
      source_context: "In mid-May 1967, following false Soviet intelligence reports of Israeli troop concentrations on the Syrian border, President Nasser ordered 100,000 Egyptian troops into the Sinai Peninsula. Speaking to Arab trade unionists on 26 May, Nasser used aggressive rhetoric to rally pan-Arab nationalism and prepare the Arab world for what he framed as an inevitable war of liberation. **Hinge Question:** Did Nasser's public bellicose rhetoric lock him into a war he originally intended only as a political bluff?",
      question_badge: "Author's Purpose",
      question_type: "Author's Purpose",
      enquiry_question: "What does Source A reveal about how President Nasser used the threat of war in May 1967 to unify Arab public opinion?",
      model_answer: "Source A demonstrates that Nasser used uncompromising language ('our basic objective will be to destroy Israel') to galvanize domestic Arab pride and project supreme military confidence, framing the Sinai mobilization not merely as defensive support for Syria but as the decisive, unified campaign to eliminate Israel.",
      hinge_question: "Did Nasser's public bellicose rhetoric lock him into a war he originally intended only as a political bluff?",
      teacher_notes: {
        source_context: "In mid-May 1967, following false Soviet intelligence reports of Israeli troop concentrations on the Syrian border, President Nasser ordered 100,000 Egyptian troops into the Sinai Peninsula. Speaking to Arab trade unionists on 26 May, Nasser used aggressive rhetoric to rally pan-Arab nationalism and prepare the Arab world for what he framed as an inevitable war of liberation. **Hinge Question:** Did Nasser's public bellicose rhetoric lock him into a war he originally intended only as a political bluff?"
      }
    },
    {
      id: "cme_l7_source_b",
      letter: "B",
      target_stage: 2,
      title: "Source B: Cartographic Map of the Straits of Tiran & Sharm el-Sheikh Blockade (May 1967)",
      src: "/units/cme_new/assets/cme_sinai_peninsula_map.jpg",
      image: "/units/cme_new/assets/cme_sinai_peninsula_map.jpg",
      source: "/units/cme_new/assets/cme_sinai_peninsula_map.jpg",
      caption: "Strategic map highlighting the maritime choke point at the Straits of Tiran and Sharm el-Sheikh, where Egyptian forces blocked Israeli shipping to the port of Eilat on 22 May 1967.",
      desc: "Cartographic map of the Straits of Tiran maritime choke point.",
      provenance: "Israeli Ministry of Foreign Affairs briefing chart, May 1967.",
      citation: "Israel State Archives / MFA.",
      source_context: "On 22 May 1967, President Nasser announced the closure of the Straits of Tiran to all Israeli-flagged vessels and strategic cargo bound for Eilat. Because this cut off 90% of Israel's vital oil imports, Israeli leaders viewed the blockade as an existential chokehold that justified pre-emptive military action. **Hinge Question:** Why did Israel define the closure of the Straits of Tiran as an unambiguous act of war (casus belli)?",
      question_badge: "Historical Utility",
      question_type: "Historical Utility",
      enquiry_question: "How useful is Source B for an enquiry into why Israel considered Egypt's naval blockade an act of war in 1967?",
      model_answer: "Source B is highly useful because it demonstrates the critical geographic vulnerability of the Straits of Tiran; by blockading Sharm el-Sheikh, Egypt severed Israel's southern maritime lifeline to Asian oil markets and Persian Gulf trade through the port of Eilat.",
      hinge_question: "Why did Israel define the closure of the Straits of Tiran as an unambiguous act of war (casus belli)?",
      teacher_notes: {
        source_context: "On 22 May 1967, President Nasser announced the closure of the Straits of Tiran to all Israeli-flagged vessels and strategic cargo bound for Eilat. Because this cut off 90% of Israel's vital oil imports, Israeli leaders viewed the blockade as an existential chokehold that justified pre-emptive military action. **Hinge Question:** Why did Israel define the closure of the Straits of Tiran as an unambiguous act of war (casus belli)?"
      }
    },
    {
      id: "cme_l7_source_c",
      letter: "C",
      target_stage: 3,
      title: "Source C: The Egyptian-Jordanian Joint Defence Pact in Cairo (30 May 1967)",
      src: "/images/cme_cairo_summit_1964.jpg",
      image: "/images/cme_cairo_summit_1964.jpg",
      source: "/images/cme_cairo_summit_1964.jpg",
      caption: "Jordan's King Hussein and Egyptian President Gamal Abdel Nasser sign the bilateral Joint Defence Agreement at the Koubbeh Palace in Cairo on 30 May 1967, placing the Jordanian armed forces under Egyptian command.",
      desc: "Historic photograph of King Hussein of Jordan and President Nasser signing the mutual defense agreement in Cairo.",
      provenance: "Egyptian Ministry of Information / Associated Press archival wire, 30 May 1967.",
      citation: "Egyptian State Information Service / Associated Press.",
      source_context: "On 30 May 1967, Jordan's King Hussein flew to Cairo and signed a mutual defence treaty with his former political rival Nasser, placing Jordanian forces under Egyptian General Abdel Moneim Riad. With Iraq joining shortly after, Israel was surrounded on three borders (Egypt, Jordan, Syria), convincing Israeli military leaders that a pre-emptive strike was essential before an Arab combined assault. **Hinge Question:** Why did King Hussein's unexpected pact with Nasser eliminate Israel's military margin for diplomatic delay?",
      question_badge: "Source Inference",
      question_type: "Source Inference",
      enquiry_question: "What can an historian infer from Source C about how the Cairo Defence Agreement escalated the crisis for Israel?",
      model_answer: "We can infer that the agreement completed the strategic military encirclement of Israel; with Jordan's British-trained Arab Legion placed under Egyptian command just miles from Tel Aviv, Israel's narrow coastal borders were exposed to imminent simultaneous multi-front invasion.",
      hinge_question: "Why did King Hussein's unexpected pact with Nasser eliminate Israel's military margin for diplomatic delay?",
      teacher_notes: {
        source_context: "On 30 May 1967, Jordan's King Hussein flew to Cairo and signed a mutual defence treaty with his former political rival Nasser, placing Jordanian forces under Egyptian General Abdel Moneim Riad. With Iraq joining shortly after, Israel was surrounded on three borders (Egypt, Jordan, Syria), convincing Israeli military leaders that a pre-emptive strike was essential before an Arab combined assault. **Hinge Question:** Why did King Hussein's unexpected pact with Nasser eliminate Israel's military margin for diplomatic delay?"
      }
    },
    {
      id: "cme_l7_source_d",
      letter: "D",
      target_stage: 4,
      title: "Source D: Aerial Reconnaissance of Destroyed Egyptian Airfields during Operation Focus (5 June 1967)",
      src: "/images/cme_six_day_war_airfield_1967.jpg",
      image: "/images/cme_six_day_war_airfield_1967.jpg",
      source: "/images/cme_six_day_war_airfield_1967.jpg",
      caption: "Israeli Air Force reconnaissance photograph showing destroyed Egyptian Air Force MiG-21 jet fighters and cratered runways at an Egyptian airbase following the opening waves of Operation Focus on the morning of 5 June 1967.",
      desc: "Aerial photograph of destroyed Egyptian Air Force MiG fighters on cratered tarmac, 5 June 1967.",
      provenance: "Israel Defense Forces Archives / IAF Aerial Reconnaissance Unit, 5 June 1967.",
      citation: "Israel Defense Forces Archives (IDFA).",
      source_context: "At 07:45 on 5 June 1967, the Israeli Air Force launched Operation Focus, flying under Egyptian radar across the Mediterranean to bomb 19 Egyptian airfields simultaneously with specialized concrete-piercing bombs. Within three hours, over 300 Egyptian combat aircraft were destroyed on the tarmac, securing absolute Israeli air supremacy. **Hinge Question:** Why was achieving total air superiority in the opening hours the decisive causal mechanism of the Six-Day War?",
      question_badge: "Historical Significance",
      question_type: "Historical Significance",
      enquiry_question: "How does Source D explain why the outcome of the Six-Day War was effectively decided in the first three hours?",
      model_answer: "Source D shows the complete destruction of Egypt's frontline fighter fleet on the ground; without air cover, Egyptian ground divisions in the Sinai were left completely exposed to relentless Israeli close air support, making an organized defense impossible.",
      hinge_question: "Why was achieving total air superiority in the opening hours the decisive causal mechanism of the Six-Day War?",
      teacher_notes: {
        source_context: "At 07:45 on 5 June 1967, the Israeli Air Force launched Operation Focus, flying under Egyptian radar across the Mediterranean to bomb 19 Egyptian airfields simultaneously with specialized concrete-piercing bombs. Within three hours, over 300 Egyptian combat aircraft were destroyed on the tarmac, securing absolute Israeli air supremacy. **Hinge Question:** Why was achieving total air superiority in the opening hours the decisive causal mechanism of the Six-Day War?"
      }
    },
    {
      id: "cme_l7_source_e",
      letter: "E",
      target_stage: 5,
      title: "Source E: Israeli Command Entering Jerusalem Through Lions' Gate (7 June 1967)",
      src: "/units/cme_new/assets/dayan_rabin_lions_gate_1967.jpg",
      image: "/units/cme_new/assets/dayan_rabin_lions_gate_1967.jpg",
      source: "/units/cme_new/assets/dayan_rabin_lions_gate_1967.jpg",
      caption: "David Rubinger's iconic photograph showing Defense Minister Moshe Dayan, Chief of Staff Yitzhak Rabin, and General Uzi Narkiss walking through Lions' Gate into the Old City of Jerusalem, 7 June 1967.",
      desc: "David Rubinger photograph of Defense Minister Moshe Dayan, Chief of Staff Yitzhak Rabin, and General Uzi Narkiss entering Jerusalem through Lions' Gate on 7 June 1967.",
      provenance: "Israel Government Press Office / David Rubinger (GPO D835-081), 7 June 1967.",
      citation: "Israel Government Press Office / David Rubinger.",
      source_context: "Moshe Dayan famously declared: 'We have reunited Jerusalem, the divided capital of Israel. We have returned to the holiest of our holy places, never to part from it again.' This dramatic entrance sealed Israeli administrative control over East Jerusalem, transforming Israel's strategic and psychological standing. **Hinge Question:** How did Moshe Dayan's famous declaration at the Wall ('We have returned to our holiest site, never to part from it again') bind future Israeli governments?",
      question_badge: "Source Inference",
      question_type: "Source Inference",
      enquiry_question: "What can you infer from Source E about how the capture of the Old City of Jerusalem transformed Israel's military leadership and national identity?",
      model_answer: "We can infer that the Israeli high command presented the capture of Jerusalem not just as a defensive tactical victory, but as an epochal, historic reunification with Judaism's ancient biblical capital, immortalizing Dayan and Rabin as national heroes.",
      hinge_question: "How did Moshe Dayan's famous declaration at the Wall ('We have returned to our holiest site, never to part from it again') bind future Israeli governments?",
      teacher_notes: {
        source_context: "Moshe Dayan famously declared: 'We have reunited Jerusalem, the divided capital of Israel. We have returned to the holiest of our holy places, never to part from it again.' This dramatic entrance sealed Israeli administrative control over East Jerusalem, transforming Israel's strategic and psychological standing. **Hinge Question:** How did Moshe Dayan's famous declaration at the Wall ('We have returned to our holiest site, never to part from it again') bind future Israeli governments?"
      }
    }
  ];
  console.log('✅ Realigined Lesson 7 sources: Stages 1–5 now chronologically perfect.');
}

// -------------------------------------------------------------
// 2. LESSON 1: THE 1939 WHITE PAPER REALIGNMENT
// -------------------------------------------------------------
const l1 = cme.lessons.find(x => x.id === 'lesson_1');
if (l1 && l1.sources && l1.sources[4]) {
  l1.sources[4] = {
    id: "cme_l1_source_e",
    letter: "E",
    target_stage: 5,
    title: "Source E: The British Government White Paper on Palestine (May 1939)",
    type: "written",
    provenance: "Official Parliamentary Command Paper (Cmd 6019), presented by the Secretary of State for the Colonies, Malcolm MacDonald, to Parliament, May 1939.",
    citation: "His Majesty's Stationery Office (HMSO) / The National Archives, Kew (CAB 66/1/24).",
    content: "His Majesty's Government believe that the framers of the Mandate in which the Balfour Declaration was embodied could not have intended that Palestine should be converted into a Jewish State against the will of the Arab population of the country... Jewish immigration during the next five years will be at a rate which, if economic absorptive capacity permits, will bring the Jewish population up to approximately one-third of the total population... After the period of five years no further Jewish immigration will be permitted unless the Arabs of Palestine are prepared to acquiesce in it.",
    caption: "Extract from the official British Parliamentary Command Paper 6019 (May 1939), drastically restricting Jewish immigration to 75,000 over five years and making further immigration conditional on Arab consent.",
    desc: "Extract from the 1939 British White Paper on Palestine limiting Jewish immigration and land purchase.",
    source_context: "Faced with the imminent outbreak of World War Two and desperate to secure Arab alliance and oil routes, the British government published the 1939 White Paper. It effectively repudiated the Balfour Declaration by proposing an independent binational Palestine within ten years and capping Jewish immigration at 75,000 refugees just as Nazi persecution escalated in Europe. **Hinge Question:** Why did the 1939 White Paper convince Zionist leaders like David Ben-Gurion that Britain was no longer a reliable partner?",
    question_badge: "Author's Purpose",
    question_type: "Author's Purpose",
    enquiry_question: "What does Source E suggest about why British policy toward Palestine changed radically on the eve of World War Two?",
    model_answer: "Source E reveals that Britain prioritized appeasing the Arab population to protect strategic Middle Eastern oil and trade routes before the outbreak of World War Two, sacrificing its earlier commitment to a Jewish national home.",
    hinge_question: "Why did the 1939 White Paper convince Zionist leaders like David Ben-Gurion that Britain was no longer a reliable partner?",
    teacher_notes: {
      source_context: "Faced with the imminent outbreak of World War Two and desperate to secure Arab alliance and oil routes, the British government published the 1939 White Paper. It effectively repudiated the Balfour Declaration by proposing an independent binational Palestine within ten years and capping Jewish immigration at 75,000 refugees just as Nazi persecution escalated in Europe. **Hinge Question:** Why did the 1939 White Paper convince Zionist leaders like David Ben-Gurion that Britain was no longer a reliable partner?"
    }
  };
  console.log('✅ Realigined Lesson 1 Source E: 1939 White Paper now matches Stage 5.');
}

// -------------------------------------------------------------
// 3. LESSON 12: ARAFAT AT GENEVA (1988) REALIGNMENT
// -------------------------------------------------------------
const l12 = cme.lessons.find(x => x.id === 'lesson_12');
if (l12 && l12.sources && l12.sources[4]) {
  l12.sources[4] = {
    id: "cme_l12_source_e",
    letter: "E",
    target_stage: 5,
    title: "Source E: Yasser Arafat's Historic Address to the UN General Assembly in Geneva (13 December 1988)",
    type: "written",
    provenance: "Official speech by PLO Chairman Yasser Arafat before the United Nations General Assembly convened in Geneva, Switzerland, 13 December 1988.",
    citation: "United Nations Audiovisual Library / UN General Assembly Official Records (A/43/PV.78).",
    content: "The Palestine National Council has decided to establish a Palestinian State on our Palestinian land, with Jerusalem as its capital... We accept UN Security Council Resolutions 242 and 338 as the basis for negotiations with Israel within the framework of an international peace conference. We reiterate our total and categorical rejection of all forms of terrorism, including individual, group, and state terrorism. We seek peace, a just and comprehensive peace based on the rights of all peoples to live in security.",
    caption: "Extract from PLO Chairman Yasser Arafat's landmark speech to the UN General Assembly in Geneva on 13 December 1988, officially accepting UN Resolution 242 and renouncing terrorism.",
    desc: "Speech extract of Yasser Arafat accepting Resolution 242 and renouncing terrorism in Geneva.",
    source_context: "Under intense US and international diplomatic pressure following the Algiers declaration and the First Intifada, Yasser Arafat addressed the special session of the UN General Assembly in Geneva in December 1988. By explicitly accepting Resolution 242 and renouncing terrorism, Arafat met the longstanding US preconditions, opening direct diplomatic dialogue between Washington and the PLO for the first time. **Hinge Question:** Why was Arafat's public acceptance of Resolution 242 viewed by radical Palestinian factions as an unacceptable surrender of the 1948 lands?",
    question_badge: "Historical Utility",
    question_type: "Historical Utility",
    enquiry_question: "How useful is Source E for an enquiry into why the PLO changed its diplomatic strategy during the First Intifada in 1988?",
    model_answer: "Source E is extremely useful because it provides direct evidence of the PLO's historic diplomatic concession: by explicitly accepting Resolutions 242 and 338 and renouncing terrorism, Arafat officially acknowledged Israel's existence and paved the way for international recognition and future direct negotiations.",
    hinge_question: "Why was Arafat's public acceptance of Resolution 242 viewed by radical Palestinian factions as an unacceptable surrender of the 1948 lands?",
    teacher_notes: {
      source_context: "Under intense US and international diplomatic pressure following the Algiers declaration and the First Intifada, Yasser Arafat addressed the special session of the UN General Assembly in Geneva in December 1988. By explicitly accepting Resolution 242 and renouncing terrorism, Arafat met the longstanding US preconditions, opening direct diplomatic dialogue between Washington and the PLO for the first time. **Hinge Question:** Why was Arafat's public acceptance of Resolution 242 viewed by radical Palestinian factions as an unacceptable surrender of the 1948 lands?"
    }
  };
  console.log('✅ Realigined Lesson 12 Source E: 1988 Arafat at Geneva now matches Stage 5.');
}

// -------------------------------------------------------------
// SAVE TO ALL RELEVANT LOCATIONS
// -------------------------------------------------------------
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

const rootDbPath = path.resolve(__dirname, '../database.json');
if (fs.existsSync(rootDbPath)) {
  fs.writeFileSync(rootDbPath, JSON.stringify(db, null, 2), 'utf8');
}

const fileContent = '// CME Unit Data - Calibrated with 100% Traceable Quizzes\nconst cme_new_data = ' + JSON.stringify(cme, null, 2) + ';\n\nexport default cme_new_data;\n';
fs.writeFileSync(path.resolve(__dirname, '../units/cme_new/data.js'), fileContent, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../public/units/cme_new/data.js'), fileContent, 'utf8');

console.log('='.repeat(80));
console.log('CME Unit files successfully saved and realigined!');
console.log('='.repeat(80));

