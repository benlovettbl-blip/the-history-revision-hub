const fs = require('fs');

function realignL7(filePath) {
  console.log('Realigning Lesson 7 in:', filePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  const jsonStr = raw.replace(/^export\s+default\s+/, '').replace(/;\s*$/, '');
  const data = JSON.parse(jsonStr);

  const l7 = data.lessons.find(l => l.id === 'lesson_8');
  if (!l7) {
    console.error('Lesson 8 not found in', filePath);
    process.exit(1);
  }

  // Define the Khartoum Source (Source B)
  const khartoumSource = {
    id: "cme_l7_source_b",
    letter: "B",
    title: "Source B: The Khartoum Resolution and the 'Three Nos' (1 September 1967)",
    src: "/images/cme_khartoum_summit_1967.jpg",
    image: "/images/cme_khartoum_summit_1967.jpg",
    source: "/images/cme_khartoum_summit_1967.jpg",
    caption: "Arab heads of state at the Khartoum Summit in Sudan, where the Arab League adopted the famous 'Three Nos' resolution on 1 September 1967.",
    desc: "Archival photograph of Arab leaders at the Khartoum Summit formulating the 'Three Nos' resolution (1967).",
    provenance: "Arab League Summit Records / Sudanese Ministry of Information Archives, Khartoum, September 1967.",
    citation: "Khartoum Summit Declaration, Arab League Official Gazette, 1 September 1967.",
    hinge_question: "Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?",
    source_context: "Following their defeat in the Six-Day War, Arab leaders met in Khartoum to coordinate their diplomatic strategy. While UN Resolution 242 proposed 'land for peace', the Khartoum Resolution declared that Arab states would make no peace, give no recognition, and enter into no negotiations with Israel. **Hinge Question:** Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?",
    context: "Arab leaders issued the 'Three Nos' at Khartoum, rejecting all peace, recognition, and negotiation with Israel.",
    question_badge: "Author’s Purpose",
    question_type: "Author’s Purpose",
    enquiry_question: "What was the primary purpose of the Arab League issuing the 'Three Nos' in Source B?",
    model_answer: "The purpose was to restore Arab pride after the humiliating 1967 defeat and demonstrate to the Arab public that leaders like Nasser would never surrender Palestinian land or accept Israel’s existence.",
    provenance_clues: {
      author: "Arab heads of state including Gamal Abdel Nasser of Egypt and King Faisal of Saudi Arabia.",
      audience: "The Arab public and the international community.",
      motive: "To prevent any individual Arab nation from breaking ranks to sign a separate peace treaty with Israel.",
      hinge_question: "Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?"
    },
    teacher_notes: {
      source_context: "Following their defeat in the Six-Day War, Arab leaders met in Khartoum to coordinate their diplomatic strategy. While UN Resolution 242 proposed 'land for peace', the Khartoum Resolution declared that Arab states would make no peace, give no recognition, and enter into no negotiations with Israel. **Hinge Question:** Why did the 'Three Nos' make a peaceful resolution under UN Resolution 242 virtually impossible?"
    }
  };

  // Define the Military Administration Source (Source E)
  const militaryGovSource = {
    id: "cme_l7_source_e",
    letter: "E",
    title: "Source E: Military Governorate Administration Map of the West Bank (1968)",
    src: "/units/cme_new/assets/palestine_1967_map.png",
    image: "/units/cme_new/assets/palestine_1967_map.png",
    source: "/units/cme_new/assets/palestine_1967_map.png",
    caption: "Israeli military command map detailing the administrative sub-districts (Jenin, Nablus, Ramallah, Hebron) placed under direct IDF military decree following Order No. 1.",
    desc: "Cartographic map of the Israeli military government in the West Bank.",
    provenance: "Israel Defense Forces Military Advocate General Archives, Tel Aviv, 1968.",
    citation: "IDF Archives / Israel State Archives.",
    hinge_question: "How did the imposition of Israeli military orders replace Jordanian civil law and reshape daily Palestinian life?",
    source_context: "Under Military Proclamation No. 2, all legislative, executive, and judicial powers over the West Bank were assumed by the IDF Military Commander. Over the following decades, more than 1,000 military orders were issued regulating daily commerce, movement, and legal status. **Hinge Question:** How did the imposition of Israeli military orders replace Jordanian civil law and reshape daily Palestinian life?",
    context: "The IDF established military rule over the West Bank, issuing military orders to govern civil and security affairs.",
    question_badge: "Source Inference",
    question_type: "Source Inference",
    enquiry_question: "What can you infer from Source E about how Israel established governance over the West Bank after 1967?",
    model_answer: "Source E indicates that Israel quickly moved from wartime policing to an organized, institutionalized military administration capable of maintaining long-term control over the civilian population.",
    provenance_clues: {
      author: "IDF Central Command and Civil Administration planning unit.",
      audience: "Regional military governors and Ministry of Defense legal advisors.",
      motive: "To codify administrative control and legal authority over the occupied Palestinian populace.",
      hinge_question: "How did the imposition of Israeli military orders replace Jordanian civil law and reshape daily Palestinian life?"
    },
    teacher_notes: {
      source_context: "Under Military Proclamation No. 2, all legislative, executive, and judicial powers over the West Bank were assumed by the IDF Military Commander. Over the following decades, more than 1,000 military orders were issued regulating daily commerce, movement, and legal status. **Hinge Question:** How did the imposition of Israeli military orders replace Jordanian civil law and reshape daily Palestinian life?"
    }
  };

  // Assign Source B to Stage 2
  l7.narrative_blocks[1].sources = [khartoumSource];

  // Assign Stage 5 Narrative Block (The Second Refugee Crisis & Military Administration)
  l7.narrative_blocks[4] = {
    title: "The Refugee Crisis & Military Administration",
    paragraphs: [
      "<span class=\"para-ref\">[5.1]</span> The conquest of the West Bank and Gaza Strip triggered a second massive wave of Palestinian displacement. Over **300,000 Palestinians** fled across the Jordan River into neighboring Jordan, many becoming refugees for the second time since 1948. This sudden influx overwhelmed Jordanian infrastructure and created fertile recruiting ground for armed Palestinian commando factions.",
      "<span class=\"para-ref\">[5.2]</span> For the over one million Palestinians who remained, Israel established direct military rule. Under Military Proclamation No. 2, the IDF assumed complete legislative, executive, and judicial authority over the occupied territories. Through a series of strict military orders, Israeli commanders controlled civil administration, travel permits, and land use, establishing an enduring military occupation that deepened the conflict for decades to come."
    ],
    act: 5,
    act_title: "Stage 5: The Refugee Crisis & Military Administration — How did displacement and military rule transform the occupied territories?",
    theme_heading: "The Refugee Crisis & Military Administration",
    text: "<span class=\"para-ref\">[5.1]</span> The conquest of the West Bank and Gaza Strip triggered a second massive wave of Palestinian displacement. Over **300,000 Palestinians** fled across the Jordan River into neighboring Jordan, many becoming refugees for the second time since 1948. This sudden influx overwhelmed Jordanian infrastructure and created fertile recruiting ground for armed Palestinian commando factions.\n\n<span class=\"para-ref\">[5.2]</span> For the over one million Palestinians who remained, Israel established direct military rule. Under Military Proclamation No. 2, the IDF assumed complete legislative, executive, and judicial authority over the occupied territories. Through a series of strict military orders, Israeli commanders controlled civil administration, travel permits, and land use, establishing an enduring military occupation that deepened the conflict for decades to come.",
    sources: [militaryGovSource]
  };

  // Rebuild lesson-level sources array (A through E in exact order)
  const sourceA = l7.narrative_blocks[0].sources[0];
  const sourceC = l7.narrative_blocks[2].sources[0];
  const sourceD = l7.narrative_blocks[3].sources[0];

  l7.sources = [sourceA, khartoumSource, sourceC, sourceD, militaryGovSource];

  // Update Quiz in Lesson 7
  if (Array.isArray(l7.quiz)) {
    // Ensure Q on Khartoum references Source B
    const khartoumQ = l7.quiz.find(q => q.question && (q.question.includes('Khartoum') || q.question.includes('Three Nos')));
    if (khartoumQ) {
      khartoumQ.question = "According to Source B, what historic resolution was adopted by Arab leaders at the Khartoum Summit in September 1967?";
    }

    // Ensure Q on Military Governance references Source E
    const govQ = l7.quiz.find(q => q.question && (q.question.includes('Source B') || q.question.includes('Military Governorate')));
    if (govQ) {
      govQ.question = "According to Source E, how did the Israeli military establish administrative control over the West Bank after the 1967 war?";
      govQ.explanation = "Source E details the military governorate administrative map dividing the West Bank into military sectors.";
    }
  }

  const outputJs = 'export default ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(filePath, outputJs, 'utf8');
  console.log('Successfully realigned Lesson 7 in:', filePath);
}

realignL7('C:/Projects/the-history-revision-hub/units/cme_new/data.js');
realignL7('C:/Projects/the-history-revision-hub/public/units/cme_new/data.js');

