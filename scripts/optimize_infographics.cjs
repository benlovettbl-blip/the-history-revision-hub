const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = 'G:\\My Drive\\AAMX\\RESOURCES';

const CME_MAPPINGS = [
  {
    src: '1.1 The British withdrawal and the creation of Israel\\GCSE Edexcel History CME 1.1 The British withdrawal and the creation of Israel infographic.png',
    unit: 'cme_new',
    lessonId: 'lesson_2',
    slug: 'cme_kt1_1_withdrawal_statehood',
    title: 'The Road to Statehood: British Withdrawal & Creation of Israel (1945–1948)',
    topic: 'Key Topic 1.1: British Withdrawal and the Creation of Israel',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Conflicting post-war demands: Jewish state for Holocaust survivors vs Arab majority rule.',
      'Jewish insurgency: 1946 King David Hotel bombing by Irgun against British headquarters.',
      'February 1947: British decision to surrender the Mandate to the United Nations.',
      'UN Resolution 181 (November 1947): 55% Jewish state, 45% Arab state, international Jerusalem.',
      'May 14, 1948: Ben-Gurion proclaims the State of Israel, triggering immediate Arab invasion.'
    ]
  },
  {
    src: '1.2. Aftermath of the 1948–49 war\\1.2 Aftermath__Israel_1949-1963 info.png',
    unit: 'cme_new',
    lessonId: 'lesson_3',
    slug: 'cme_kt1_2_aftermath_refugees',
    title: 'The Aftermath of the 1948–49 War & The Palestinian Refugee Crisis',
    topic: 'Key Topic 1.2: Aftermath of the 1948–49 War',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Territorial expansion: Israel secures 78% of former Mandate territory (21% more than UN plan).',
      'The Nakba: ~700,000 Palestinian Arabs displaced into refugee camps in West Bank, Gaza, and Arab states.',
      '1950 Law of Return grants every Jewish person worldwide the right to Israeli citizenship.',
      'Formation of the IDF as a unified national military force replacing irregular militias.',
      'Armistice demarcation (Green Line) without permanent peace treaties or recognized borders.'
    ]
  },
  {
    src: '1.3\\1.3 Increased tension, 1955–63.png',
    unit: 'cme_new',
    lessonId: 'lesson_4',
    slug: 'cme_kt1_3_increased_tension',
    title: 'Increased Tension, Nasser, and the Cold War (1955–1963)',
    topic: 'Key Topic 1.3: Increased Tension, 1955–1963',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Rise of Gamal Abdel Nasser: Champion of Pan-Arab nationalism and non-aligned movement.',
      '1955 Czech Arms Deal brings Soviet weaponry into Egypt, shifting the regional balance.',
      'Fediyun border raids into Israel from Gaza and heavy Israeli cross-border reprisals.',
      'July 1956: Nasser nationalises the Suez Canal following withdrawal of Western Aswan Dam financing.',
      '1958: Creation of the United Arab Republic (Egypt & Syria) deepening Israeli encirclement fears.'
    ]
  },
  {
    src: '1.3 1956 Suez Crisis Security Impact.png',
    unit: 'cme_new',
    lessonId: 'lesson_4',
    slug: 'cme_kt1_3_suez_security_impact',
    title: 'The 1956 Suez Crisis: Military Victory & Political Humiliation',
    topic: 'Key Topic 1.3: The 1956 Suez Crisis & Regional Impact',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'The Protocol of Sèvres: Secret collusion between Britain, France, and Israel.',
      'Israeli sweep through Sinai to the Suez Canal; Anglo-French paratroop drop.',
      'US President Eisenhower forces immediate Anglo-French-Israeli withdrawal via financial pressure.',
      'Nasser emerges as a triumphant Arab hero despite suffering military defeat.',
      'Stationing of UNEF peacekeepers in Sinai and reopening of the Straits of Tiran to Israeli shipping.'
    ]
  },
  {
    src: '2.1  Israel and the Arab world, 1964–67\\2.1 Israel and the Arab world, 1964–67.png',
    unit: 'cme_new',
    lessonId: 'lesson_6',
    slug: 'cme_kt2_1_arab_world_tensions',
    title: 'The Road to the Six-Day War: Water Wars, Syrian Skirmishes & Escalation (1964–1967)',
    topic: 'Key Topic 2.1: Israel and the Arab World, 1964–1967',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Water Wars: Syrian attempts to divert headwaters of the River Jordan countered by Israeli air strikes.',
      'Formation of the PLO in 1964 under Arab League auspices; Fatah launches guerilla attacks.',
      'May 1967: False Soviet intelligence reports of Israeli troop concentrations on the Syrian border.',
      'Nasser expels UNEF peacekeepers from Sinai and concentrates 100,000 Egyptian troops.',
      'Closure of the Straits of Tiran on 22 May 1967 viewed by Israel as an explicit casus belli.'
    ]
  },
  {
    src: '2.2 The Six Day War (1967) and its aftermath\\2.2 infographic.png',
    unit: 'cme_new',
    lessonId: 'lesson_7',
    slug: 'cme_kt2_2_six_day_war',
    title: 'The Six-Day War (June 1967): Operation Focus & Territorial Transformation',
    topic: 'Key Topic 2.2: The Six Day War (1967)',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      '5 June 1967: Operation Focus destroys ~400 Arab aircraft on the ground in three hours.',
      'Complete Israeli air superiority allows rapid ground advances across three fronts.',
      'Israel captures Sinai Peninsula and Gaza Strip from Egypt; West Bank and East Jerusalem from Jordan; Golan Heights from Syria.',
      'UN Resolution 242 (November 1967) establishes the foundational "Land for Peace" formula.',
      'Khartoum Summit (September 1967): Arab League adopts the "Three No\'s" (no peace, no recognition, no negotiations).'
    ]
  },
  {
    src: '2.2 The Six Day War (1967) and its aftermath\\2.2 Shift to International Terrorism 1970-1972 infographic.png',
    unit: 'cme_new',
    lessonId: 'lesson_9',
    slug: 'cme_kt2_4_international_terrorism',
    title: 'The Rise of Palestinian Resistance: Black September & International Terrorism (1970–1972)',
    topic: 'Key Topic 2.4: Palestinian Resistance & Munich Olympics',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Disillusionment with Arab state armies prompts independent Palestinian fedayeen action under Yasser Arafat.',
      'PFLP aircraft hijackings to Dawson\'s Field, Jordan (September 1970).',
      'Black September: King Hussein of Jordan expels the PLO after fierce fighting; PLO relocates to Lebanon.',
      'September 1972 Munich Olympics Massacre: Black September murders 11 Israeli Olympic team members.',
      'Israel launches Operation Wrath of God to assassinate individuals linked to Munich.'
    ]
  },
  {
    src: '2.3 Yom Kippur\\2.3 Yom Kippur.png',
    unit: 'cme_new',
    lessonId: 'lesson_10',
    slug: 'cme_kt2_5_yom_kippur_status_quo',
    title: '1973: The War that Shattered the Status Quo',
    topic: 'Key Topic 2.5: The Yom Kippur War (1973)',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'October 6, 1973: Coordinated surprise attack by Egypt (Operation Badr crossing Suez) and Syria (Golan Heights).',
      'Breaching of the Bar Lev Line shatters the myth of Israeli military invincibility.',
      'Superpower involvement: $2.2 billion US Operation Nickel Grass airlift restores Israeli munitions.',
      'OPEC oil embargo quadruples global petroleum prices, exerting massive economic pressure on the West.',
      'Proved military dominance alone could not ensure security, forcing both sides toward diplomacy.'
    ]
  },
  {
    src: '2.3 Yom Kippur\\unnamed.png',
    unit: 'cme_new',
    lessonId: 'lesson_10',
    slug: 'cme_kt2_5_yom_kippur_turning_point',
    title: 'The Yom Kippur War 1973: Turning Point in the Middle East',
    topic: 'Key Topic 2.5: Causes, Phases & Consequences of Yom Kippur',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Sadat\'s objective: Limited military offensive to unfreeze diplomacy rather than total destruction of Israel.',
      'Heavy initial Israeli casualties: ~2,600 killed, leading to profound domestic political crisis.',
      'General Sharon leads Israeli counter-crossing of the Suez Canal, encircling Egypt\'s Third Army.',
      'Superpower brinkmanship: US moves to DEFCON 3 after Soviet threat of unilateral intervention.',
      'Lays the direct foundation for Henry Kissinger\'s shuttle diplomacy and the 1979 Camp David treaty.'
    ]
  },
  {
    src: 'Edexcel GCSE History CME 3.1 Diplomatic negotiations.png',
    unit: 'cme_new',
    lessonId: 'lesson_11',
    slug: 'cme_kt3_1_diplomatic_negotiations',
    title: 'Diplomatic Negotiations: Kissinger\'s Shuttle Diplomacy & Disengagement (1974–1979)',
    topic: 'Key Topic 3.1: Diplomatic Negotiations',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'US Secretary of State Henry Kissinger flies between capitals to broker step-by-step military disengagement.',
      'Sinai I (1974) and Sinai II (1975) accords: Israeli withdrawal from Suez Canal and oilfields.',
      'Reopening of the Suez Canal in June 1975 restores international shipping.',
      'November 1977: Egyptian President Anwar Sadat makes historic, unprecedented speech to the Israeli Knesset.',
      'Menachem Begin and Sadat invited to Camp David summit by US President Jimmy Carter in 1978.'
    ]
  },
  {
    src: '3.1 Kissinger\\Historic Israel-Egypt Peace Treaty Timeline 1973-79.png',
    unit: 'cme_new',
    lessonId: 'lesson_11',
    slug: 'cme_kt3_1_camp_david_timeline',
    title: 'Historic Israel-Egypt Peace Treaty Timeline (1973–1979)',
    topic: 'Key Topic 3.1: Camp David Accords and Treaty of Washington',
    type: 'thematic_timeline',
    aspect: 'landscape',
    keyPoints: [
      'September 1978: Camp David Accords signed after 13 days of intensive secret negotiations.',
      'March 1979: Treaty of Washington formally ends 30-year state of war between Egypt and Israel.',
      'Israel returns entire Sinai Peninsula in phases in exchange for demilitarized zones and full diplomatic ties.',
      'Egypt expelled from the Arab League and viewed as a traitor by radical Arab states.',
      'October 1981: Anwar Sadat assassinated by Islamist extremists during a military parade in Cairo.'
    ]
  },
  {
    src: 'GCSE Edexcel History CME 3.2 Lebanon 1978-82.png',
    unit: 'cme_new',
    lessonId: 'lesson_12',
    slug: 'cme_kt3_2_lebanon_conflict',
    title: 'The Palestinian Issue: The Lebanon War & Sabra-Shatila (1978–1982)',
    topic: 'Key Topic 3.2: The Palestinian Issue & Lebanon',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Operation Litani (1978) and Operation Peace for Galilee (June 1982) launched into southern Lebanon.',
      'Israeli Defense Minister Ariel Sharon pushes past the 40km zone to besiege Beirut.',
      'Evacuation of Yasser Arafat and ~14,000 PLO fighters to Tunisia under multinational protection.',
      'September 1982: Lebanese Christian Phalangist militia massacres hundreds of Palestinian refugees at Sabra and Shatila.',
      'Kahan Commission holds Sharon indirectly responsible; massive anti-war protests in Tel Aviv (400,000 march).'
    ]
  },
  {
    src: '3.2 The Palestinian Issue\\First Intifada History Overview.png',
    unit: 'cme_new',
    lessonId: 'lesson_12',
    slug: 'cme_kt3_2_first_intifada_overview',
    title: 'The First Palestinian Intifada (1987–1993): Grassroots Uprising',
    topic: 'Key Topic 3.2: The First Intifada',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'December 1987: Spontaneous uprising sparks in Jabalia refugee camp, Gaza, following fatal road accident.',
      'Characterized by youth stone-throwing, commercial strikes, civil disobedience, and tyre-burning.',
      'Unified National Leadership of the Uprising (UNLU) coordinates resistance from inside the territories.',
      'Rise of Hamas (Islamic Resistance Movement) challenging the secular PLO.',
      'Israeli policy of "Iron Fist" draws intense international media criticism; proves military force cannot suppress political demands.'
    ]
  },
  {
    src: '3.2 The Palestinian Issue\\3.2 PLO and Israel History Timeline.png',
    unit: 'cme_new',
    lessonId: 'lesson_12',
    slug: 'cme_kt3_2_plo_israel_timeline',
    title: 'The PLO and Israel: Conflict, Recognition & Milestones Timeline',
    topic: 'Key Topic 3.2: Evolution of the PLO and Israeli Policy',
    type: 'thematic_timeline',
    aspect: 'portrait',
    keyPoints: [
      '1974: Arafat addresses UN General Assembly carrying "an olive branch and a freedom fighter\'s gun".',
      'Arab League recognizes PLO as the "sole legitimate representative of the Palestinian people".',
      'November 1988: Palestine National Council proclaims independence, renounces terrorism, and implicitly recognizes Israel.',
      '1991 Madrid Peace Conference initiates direct bilateral talks under joint US-Soviet sponsorship.',
      'Shifts focus from cross-border military conflict to internal territorial sovereignty.'
    ]
  },
  {
    src: '3.3\\3.3 Oslo infographic.png',
    unit: 'cme_new',
    lessonId: 'lesson_13',
    slug: 'cme_kt3_3_oslo_accords',
    title: 'Attempts at a Solution: The Oslo Accords & Peace Process (1993–1995)',
    topic: 'Key Topic 3.3: Attempts at a Solution, 1988–1995',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Secret Norwegian backchannel talks between Israeli academics and PLO representatives.',
      'Mutual Recognition Letters: PLO recognizes Israel\'s right to exist; Israel recognizes PLO as representative.',
      'September 13, 1993: Historic handshake between Yitzhak Rabin and Yasser Arafat on White House lawn.',
      'Declaration of Principles (Oslo I): 5-year interim Palestinian self-government in Gaza and Jericho.',
      'Oslo II (1995) divides West Bank into Areas A (Palestinian), B (joint), and C (Israeli control).',
      'November 1995: Prime Minister Yitzhak Rabin assassinated by Jewish extremist Yigal Amir at Tel Aviv peace rally.'
    ]
  },
  {
    src: 'CME roadmap.png',
    unit: 'cme_new',
    lessonId: 'unit_overview',
    slug: 'cme_edexcel_spec_roadmap',
    title: 'Edexcel GCSE (9–1) Conflict in the Middle East Specification Roadmap',
    topic: 'Specification Architecture & Examiner\'s Toolkit',
    type: 'unit_roadmap',
    aspect: 'portrait',
    keyPoints: [
      'Complete 50-year chronological highway spanning 1945 to 1995.',
      'Key Topic 1: Birth of Israel, 1948 War, Palestinian Refugees, Suez Crisis.',
      'Key Topic 2: Six-Day War (1967), Conquered Territories, Black September, Yom Kippur War (1973).',
      'Key Topic 3: Kissinger Diplomacy, Camp David, Lebanon War, First Intifada, Oslo Accords.',
      'Examiner\'s Toolkit: Question 1 (8 marks consequences), Question 2 (8 marks narrative), Question 3 (16 marks importance).'
    ]
  },
  {
    src: 'roadmap cme.png',
    unit: 'cme_new',
    lessonId: 'unit_overview',
    slug: 'cme_narrative_chronology_roadmap',
    title: 'Roadmap to History: Conflict in the Middle East Chronology (1945–1995)',
    topic: 'Chronological Turning Points & Causal Evolution',
    type: 'unit_roadmap',
    aspect: 'portrait',
    keyPoints: [
      'Parchment chronological scroll tracking all 12 key syllabus stages.',
      'Military forces data: 1967 air and armor statistics comparison.',
      'Diplomatic turning points: Camp David, Madrid Conference, and Oslo Peace Accords.',
      'Visual iconography for all major peace treaties and military confrontations.'
    ]
  },
  {
    src: 'CME front cover 2026.png',
    unit: 'cme_new',
    lessonId: 'unit_overview',
    slug: 'cme_visual_course_overview',
    title: 'Conflict in the Middle East 1945–1995: Visual Historical Overview',
    topic: 'Core Course Overview & Diplomatic Documents',
    type: 'unit_overview',
    aspect: 'portrait',
    keyPoints: [
      'Authentic archival documents collage: UN Resolution 242, Suez headlines, Camp David Treaty.',
      'Cartographic overview: Mediterranean theatre, Sinai Peninsula, and Levant borders.',
      'Dual eras: 1945–1967 Statehood & Regional Escalation vs 1973–1995 Global Impact & Peace Search.'
    ]
  },
  {
    src: 'paper 2 exam Questions.png',
    unit: 'cme_new',
    lessonId: 'exam_practice',
    slug: 'cme_paper2_exam_guide',
    title: 'Mastering the History Period Study: Guide to Question Types',
    topic: 'Edexcel Paper 2 Exam Strategy & Technique',
    type: 'exam_technique',
    aspect: 'landscape',
    keyPoints: [
      'Question 1 (Consequences, 8 Marks): Explain two distinct, well-evidenced consequences with clear cause-effect links.',
      'Question 2 (Narrative Account, 8 Marks): Chronological 3-stage sequence (Begin, Develop, End) using analytical connectives.',
      'Question 3 (Importance, 16 Marks): Explain why two events/developments were significant for a specific outcome.',
      'AO1 (Accurate Knowledge) vs AO2 (Analytical Explanation of Impact).',
      'Examiner Golden Rule: Always go beyond the two provided stimulus points to access Level 4 top marks.'
    ]
  }
];

const EEE_MAPPINGS = [
  {
    src: 'KT 1.1 The situation on Elizabeth’s accession\\Elizabeth I\'s Accession Challenges.png',
    unit: 'eee',
    lessonId: 'lesson_1_1',
    slug: 'eee_kt1_1_accession_crisis',
    title: '1558: A Kingdom in Crisis – The Accession of Elizabeth I',
    topic: 'Key Topic 1.1: The Situation on Elizabeth\'s Accession, 1558',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Crisis of legitimacy & gender: Catholics questioned her parents\' marriage; 16th-century prejudice against female rule.',
      'Financial crisis: Crown debt stood at £300,000 (with 14% interest on Antwerp exchange) against annual income of only £286,667.',
      'Foreign threats: Alliance between France and Scotland (Auld Alliance) and recent loss of Calais (January 1558).',
      'Rigid social hierarchy governed by the "Great Chain of Being".',
      'Elizabeth\'s personal strengths: Highly educated, fluent in four languages, adept at political patronage.'
    ]
  },
  {
    src: 'KT 1.2 The ‘settlement’ of religion\\Elizabeth\'s Religious Middle Way Settlement.png',
    unit: 'eee',
    lessonId: 'lesson_1_2',
    slug: 'eee_kt1_2_religious_settlement',
    title: 'The Religious Settlement of 1559: The Elizabethan "Middle Way"',
    topic: 'Key Topic 1.2: The Settlement of Religion, 1559',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Act of Supremacy (1559): Elizabeth declared "Supreme Governor" rather than "Supreme Head" of the Church.',
      'Act of Uniformity (1559): Enforced the Book of Common Prayer and mandatory Sunday church attendance.',
      'Royal Injunctions: Instructions issued to clergy enforcing the settlement, vestments, and reporting recusants.',
      'Recusancy fines: One shilling fine for failing to attend Protestant church services.',
      'Deliberate compromise: Retained moderate Catholic ceremony while establishing Protestant doctrine.'
    ]
  },
  {
    src: 'KT 1.3 Challenge to the religious settlement\\Challenges to Elizabeth\'s Religious Settlement.png',
    unit: 'eee',
    lessonId: 'lesson_1_3',
    slug: 'eee_kt1_3_religious_challenges',
    title: 'Challenges to the Religious Settlement: Puritans and Papacy',
    topic: 'Key Topic 1.3: Challenge to the Religious Settlement',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Puritan challenge: Vestments Controversy (1566) resisting crucifixes and surplices as "popish rags".',
      'Catholic challenge: Papacy, English Catholic nobility, and European superpowers (Spain and France).',
      '1570: Pope Pius V issues Papal Bull (Regnans in Excelsis) excommunicating Elizabeth and ordering Catholics to depose her.',
      'Treason Act of 1571: Makes declaring Elizabeth a heretic or denying her supremacy punishable by death.',
      'Arrival of trained Jesuit and Seminary priests from Douai to sustain underground Catholicism.'
    ]
  },
  {
    src: 'KT 1.4 The problem of Mary, Queen of Scots\\Maryqss.png',
    unit: 'eee',
    lessonId: 'lesson_1_4',
    slug: 'eee_kt1_4_mary_scots_overview',
    title: 'Mary, Queen of Scots: Royal Pedigree, Legitimacy & Threat',
    topic: 'Key Topic 1.4: The Problem of Mary, Queen of Scots',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Direct royal lineage: Great-granddaughter of Henry VII; legitimate Catholic heir to the English throne.',
      'Murder of Lord Darnley (1567) and marriage to Earl of Bothwell triggers Scottish rebellion.',
      'May 1568: Mary escapes to England seeking Elizabeth\'s protection but is placed under house arrest for 19 years.',
      'Focal point for domestic Catholic revolt and Spanish assassination conspiracies.',
      'Elizabeth\'s political dilemma: Reluctant to execute an anointed fellow monarch.'
    ]
  },
  {
    src: 'KT 1.4 The problem of Mary, Queen of Scots\\The Problem of Mary Stuart.png',
    unit: 'eee',
    lessonId: 'lesson_1_4',
    slug: 'eee_kt1_4_mary_stuart_problem',
    title: 'The Problem of Mary Stuart: The Casket Letters & Captivity',
    topic: 'Key Topic 1.4: Mary Stuart\'s Captivity & Legal Enquiries',
    type: 'thematic_deep_dive',
    aspect: 'portrait',
    keyPoints: [
      'The York Conference (1568–69): Investigation into the "Casket Letters" to determine complicity in Darnley\'s murder.',
      'Elizabeth reaches a non-verdict, ensuring Mary remains safely imprisoned without formal conviction.',
      'Constant surveillance by Sir Amyas Paulet at Tutbury Castle and Chartley.',
      'Permanent diplomatic friction with France and Scotland during her captivity.'
    ]
  },
  {
    src: 'KT 2.1 Plots and revolts at home\\GCSE Elizabeth Walsingham spies.png',
    unit: 'eee',
    lessonId: 'lesson_2_1',
    slug: 'eee_kt2_1_walsingham_spies',
    title: 'Sir Francis Walsingham & The Elizabethan Spy Network',
    topic: 'Key Topic 2.1: Walsingham\'s Intelligence Network & Spies',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Walsingham appointed Principal Secretary and Elizabeth\'s "Spymaster General" in 1573.',
      'Network of agents, codebreakers (Thomas Phelippes), and double agents across England and Europe.',
      'Ciphers and forgeries: Phelippes cracked coded letters and forged postscripts to uncover conspirators.',
      'Surveillance of Catholic safe houses, ports, and foreign embassies.',
      '1584 Bond of Association: Oath pledging to execute anyone attempting to assassinate the Queen or benefiting from her death.'
    ]
  },
  {
    src: 'KT 2.1 Plots and revolts at home\\Elizabethan Era Catholic Plots Timeline.png',
    unit: 'eee',
    lessonId: 'lesson_2_1',
    slug: 'eee_kt2_1_catholic_plots_timeline',
    title: 'Catholic Plots Against Elizabeth: 1569 to 1586 Timeline',
    topic: 'Key Topic 2.1: Plots and Revolts at Home (1569–1587)',
    type: 'thematic_timeline',
    aspect: 'landscape',
    keyPoints: [
      '1569 Northern Rebellion: Earls of Northumberland and Westmorland seize Durham Cathedral; ruthlessly crushed (450 executed).',
      '1571 Ridolfi Plot: Italian banker Roberto Ridolfi plans Spanish invasion; leads to Duke of Norfolk\'s execution (1572).',
      '1583 Throckmorton Plot: French Catholic force funded by Spain and the Pope; leads to 1585 Act against Jesuits.',
      '1586 Babington Plot: Anthony Babington communicates with Mary Stuart via beer barrels; intercepted by Walsingham.',
      'February 1587: Execution of Mary, Queen of Scots at Fotheringhay Castle.'
    ]
  },
  {
    src: 'KT 2.2 Relations with Spain\\Spanish rivalry.png',
    unit: 'eee',
    lessonId: 'lesson_2_2',
    slug: 'eee_kt2_2_spanish_rivalry',
    title: 'Anglo-Spanish Rivalry: Commercial, Religious & Geo-Political Friction',
    topic: 'Key Topic 2.2: Relations with Spain, 1569–1585',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Religious divide: Catholic Spain under Philip II viewed Protestant England as a heretical enemy.',
      'Commercial conflict: Spanish trade monopoly in the New World challenged by English privateers like Francis Drake and John Hawkins.',
      'The Netherlands revolt: Dutch Protestants rebel against Spanish rule under the Duke of Alba; Elizabeth secretly aids rebels.',
      'Genoese Loan (1568): Elizabeth seizes gold ships bound for Spanish troops in Antwerp.',
      '1584 Treaty of Joinville: France and Spain form Catholic alliance against Protestantism.'
    ]
  },
  {
    src: 'KT 2.2 Relations with Spain\\The Road to the Armada.png',
    unit: 'eee',
    lessonId: 'lesson_2_2',
    slug: 'eee_kt2_2_road_to_armada',
    title: 'The Road to the Armada: 1585 to 1588 Escalation',
    topic: 'Key Topic 2.2: The Road to the Armada',
    type: 'thematic_timeline',
    aspect: 'landscape',
    keyPoints: [
      'August 1585: Treaty of Nonsuch puts England into direct, formal war with Spain.',
      'Earl of Leicester leads 7,400 English troops to the Netherlands but clashes with Dutch states.',
      'April 1587: Drake\'s raid on Cadiz ("singeing the King of Spain\'s beard") delays the Armada by a year.',
      'Philip II secures papal blessing and builds the "Invincible Enterprise of England".',
      'Execution of Mary, Queen of Scots (1587) provides Philip with religious justification to claim the English crown.'
    ]
  },
  {
    src: 'KT 2.3 Outbreak of war with Spain, 1585–88\\GCSE Elizabeth War with Spain.png',
    unit: 'eee',
    lessonId: 'lesson_2_3',
    slug: 'eee_kt2_3_war_outbreak',
    title: 'The Outbreak of War with Spain (1585–1588): Nonsuch & The Netherlands',
    topic: 'Key Topic 2.3: Outbreak of War with Spain, 1585–1588',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Assassination of William of Orange (1584) leaves Dutch rebellion on the brink of collapse.',
      'Elizabeth forced to abandon covert diplomacy and commit troops openly under Treaty of Nonsuch.',
      'Leicester\'s campaign hampered by poor funding, indiscipline, and betrayal by English officers (Stanley and Yorke).',
      'English privateers inflict heavy losses on Spanish bullion fleets in the Caribbean.',
      'Formal state of war declared, setting stage for full-scale Spanish invasion.'
    ]
  },
  {
    src: 'KT 2.3 Outbreak of war with Spain, 1585–88\\England\'s War With Spain Infographic.png',
    unit: 'eee',
    lessonId: 'lesson_2_3',
    slug: 'eee_kt2_3_england_war_spain',
    title: 'England at War: Drake at Cadiz & Military Mobilization',
    topic: 'Key Topic 2.3: The Raid on Cadiz & English Defences',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Drake enters Cadiz harbour in April 1587, destroying over 30 Spanish warships and supply vessels.',
      'Destruction of seasoned barrel staves compromised Armada food and water supplies in 1588.',
      'English coastal beacons and county militia mobilised along the English Channel.',
      'Tilbury army camp established under Earl of Leicester to protect London.'
    ]
  },
  {
    src: 'KT 2.4 The Armada\\Defeat of the Spanish Armada.png',
    unit: 'eee',
    lessonId: 'lesson_2_4',
    slug: 'eee_kt2_4_armada_defeat',
    title: 'The Defeat of the Spanish Armada (1588): Tactics, Ships & Weather',
    topic: 'Key Topic 2.4: The Spanish Armada, 1588',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Philip II\'s flawed plan: 130 ships under Duke of Medina Sidonia required to link with Duke of Parma\'s army in Flanders.',
      'Communication breakdown: No deep-water port available; Parma was delayed and unready.',
      'English ship design: Faster, longer-range galleons designed by John Hawkins with culverin long guns.',
      'Hellburners (Fireships) at Calais (7 August) scatter Spanish crescent formation into panic.',
      'Battle of Gravelines (8 August): English gunnery batters Spanish ships; Protestant winds blow Armada north around Scotland and Ireland.'
    ]
  },
  {
    src: 'KT 3.1 Education and leisure\\GCSE Elizbaeth Leisure and Theatre.png',
    unit: 'eee',
    lessonId: 'lesson_3_1',
    slug: 'eee_kt3_1_leisure_theatre',
    title: 'Elizabethan Leisure: Sport, Pastimes & The Rise of the Theatre',
    topic: 'Key Topic 3.1: Education and Leisure in Elizabethan England',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Nobility sports: Hunting, hawking, fencing, real tennis, and archery.',
      'Lower-class sports: Football (violent and unregulated), bear-baiting, and cock-fighting at Paris Garden.',
      'The Theatre boom: Purpose-built playhouses (The Theatre 1576, The Curtain, The Rose, The Globe).',
      'Social melting pot: Groundlings paid 1 penny to stand in the pit; nobles paid for cushioned tiered balconies.',
      'Puritan opposition: Preachers condemned theatres as sinful houses of plague, crime, and temptation.'
    ]
  },
  {
    src: 'KT 3.1 Education and leisure\\Elizabethan Learning and Leisure.png',
    unit: 'eee',
    lessonId: 'lesson_3_1',
    slug: 'eee_kt3_1_education_learning',
    title: 'Education in Elizabethan England: Grammar Schools & Humanism',
    topic: 'Key Topic 3.1: Elizabethan Education & Literacy',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Rise of Humanist philosophy: Belief in education for practical civic life and intellectual development.',
      'Grammar schools: 72 new grammar schools established teaching Latin, Greek, rhetoric, and debate to boys from the middling sort.',
      'Petty schools for basic literacy and numeracy; dame schools for wealthy girls.',
      'University expansion: Oxford and Cambridge colleges train future statesmen and clergy.',
      'Literacy rates increased (30% of men, 10% of women), but education remained sharply divided by gender and wealth.'
    ]
  },
  {
    src: 'KT 3.2 The problem of the poor\\Poverty in Elizabethan England.png',
    unit: 'eee',
    lessonId: 'lesson_3_2',
    slug: 'eee_kt3_2_poverty_causes',
    title: 'Poverty in Elizabethan England: Population Growth, Enclosure & Inflation',
    topic: 'Key Topic 3.2: The Problem of the Poor and Vagrancy',
    type: 'lesson_summary',
    aspect: 'landscape',
    keyPoints: [
      'Population explosion: England\'s population grew 35% from 2.8 million to over 4 million, outstripping food supplies.',
      'Bad harvests (1570s and 1590s) caused catastrophic food shortages and rampant price inflation.',
      'Agricultural enclosure: Arable land converted to sheep pastures, requiring far fewer rural labourers and evicting tenant farmers.',
      'Cloth trade collapse: European wool export crisis caused widespread urban unemployment.',
      'Dissolution of the Monasteries under Henry VIII removed the traditional Catholic charity safety net.'
    ]
  },
  {
    src: 'KT 3.2 The problem of the poor\\Poverty in Elizabethan England2.png',
    unit: 'eee',
    lessonId: 'lesson_3_2',
    slug: 'eee_kt3_2_poor_laws',
    title: 'The Elizabethan Poor Laws: Deserving vs Undeserving Poor',
    topic: 'Key Topic 3.2: Government Legislation & The 1601 Poor Relief Act',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'Social fear: Vagabonds and "sturdy beggars" feared as threats to law, order, and public health.',
      'Classification of the poor: Impotent/Deserving poor (ill, elderly, orphans) vs Idle/Sturdy beggars (able-bodied who refused work).',
      '1572 Vagabonds Act: Severe whipping and hole burned through right ear for persistent vagrancy.',
      '1576 Act for the Relief of the Poor: Justices of the Peace ordered to provide raw materials (wool, hemp) to put the poor to work.',
      '1601 Poor Relief Act (Elizabethan Poor Law): Established compulsory Poor Rate tax, Overseers of the Poor, and parish workhouses.'
    ]
  },
  {
    src: 'KT 3.3 Exploration and voyages of discovery\\Drake Explorer or Defender.png',
    unit: 'eee',
    lessonId: 'lesson_3_3',
    slug: 'eee_kt3_3_drake_circumnavigation',
    title: 'Francis Drake: The Great Circumnavigation (1577–1580)',
    topic: 'Key Topic 3.3: Francis Drake and Voyages of Discovery',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'First Englishman to circumnavigate the globe (1577–1580) aboard the Golden Hind.',
      'Secret mission backed by Elizabeth to disrupt Spanish monopoly along the Pacific coast of South America.',
      'Massive plunder: Captured Spanish treasure ship Cacafuego laden with 26 tons of silver and 80 pounds of gold.',
      'Claimed "New Albion" (California) for Queen Elizabeth.',
      'Knighted on the deck of the Golden Hind by Elizabeth in 1581, enraging King Philip II.'
    ]
  },
  {
    src: 'KT 3.3 Exploration and voyages of discovery\\Elizabethan Exploration Age of Discovery.png',
    unit: 'eee',
    lessonId: 'lesson_3_3',
    slug: 'eee_kt3_3_exploration_discovery',
    title: 'The Age of Discovery: Navigation, Shipbuilding & Global Trade',
    topic: 'Key Topic 3.3: Factors Driving Elizabethan Exploration',
    type: 'thematic_deep_dive',
    aspect: 'landscape',
    keyPoints: [
      'New navigational technology: Astrolabes, magnetic compasses, cross-staffs, and accurate marine charts.',
      'Shipbuilding advances: Clinker-built hulls, lanteen sails, and more maneuverable galleons capable of ocean voyages.',
      'Quest for trade routes: Search for Northwest and Northeast Passages to China and the Spice Islands.',
      'Chartered trading companies: Muscovy Company, Levant Company, and East India Company (1600).',
      'Laid the foundations for British maritime supremacy and commercial empire.'
    ]
  },
  {
    src: 'KT 3.4 Raleigh and Virginia\\Why England\'s First Colony Failed.png',
    unit: 'eee',
    lessonId: 'lesson_3_4',
    slug: 'eee_kt3_4_roanoke_failure',
    title: 'Why England\'s First Colony Failed: The Lost Colony of Roanoke',
    topic: 'Key Topic 3.4: The Failure of the Virginia Colonisation',
    type: 'lesson_summary',
    aspect: 'portrait',
    keyPoints: [
      'Poor timing & voyage: Left too late in the year to plant crops; flagship Tiger ran aground destroying food supplies.',
      'Unsuitable colonists: Wealthy gentlemen refused physical manual labour; lack of skilled farmers.',
      'Deteriorating native relations: Chief Wingina turned hostile after English accused natives of stealing a silver cup.',
      '1587 Second Colony under John White: White returned to England for supplies; delayed 3 years by the Spanish Armada.',
      '1590 return: Roanoke settlement found completely abandoned with only the word "CROATOAN" carved on a post.'
    ]
  },
  {
    src: 'KT 3.4 Raleigh and Virginia\\Raleigh\'s Failed Quest for Virginia.png',
    unit: 'eee',
    lessonId: 'lesson_3_4',
    slug: 'eee_kt3_4_raleigh_virginia',
    title: 'Sir Walter Raleigh & The Colonisation of Virginia (1584–1590)',
    topic: 'Key Topic 3.4: Raleigh and the Colonisation of Virginia',
    type: 'thematic_deep_dive',
    aspect: 'portrait',
    keyPoints: [
      'Royal patent: Elizabeth granted Raleigh permission to explore and settle any lands not possessed by Christian prince.',
      'Named "Virginia" in honour of Elizabeth, the Virgin Queen.',
      'Strategic aims: Establish privateering base against Spanish treasure ships, find silver/gold, and trade for timber and tobacco.',
      'Organiser rather than sailor: Raleigh financed and promoted the expeditions but never sailed to Virginia himself.',
      'Paved the way for subsequent successful permanent English colonisation at Jamestown (1607).'
    ]
  }
];

async function optimizeImage(srcRel, destSlug, unitFolder) {
  const fullSrc = path.join(SOURCE_DIR, srcRel);
  const outDir = path.join(PROJECT_ROOT, 'public', 'images', 'infographics', unitFolder);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, `${destSlug}.webp`);

  if (!fs.existsSync(fullSrc)) {
    console.error(`[MISSING] Source file not found: ${fullSrc}`);
    return null;
  }

  const origStat = fs.statSync(fullSrc);
  const origKb = Math.round(origStat.size / 1024);

  if (fs.existsSync(outPath)) {
    const newStat = fs.statSync(outPath);
    const newKb = Math.round(newStat.size / 1024);
    const reduction = Math.round((1 - newStat.size / origStat.size) * 100);
    console.log(`[CACHED] ${destSlug}.webp: ${origKb}KB -> ${newKb}KB (-${reduction}%)`);
    return {
      webPath: `/images/infographics/${unitFolder}/${destSlug}.webp`,
      fileSizeKb: newKb,
      originalSizeKb: origKb,
      reductionPercent: reduction
    };
  }

  await sharp(fullSrc)
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, effort: 4 })
    .toFile(outPath);

  const newStat = fs.statSync(outPath);
  const newKb = Math.round(newStat.size / 1024);
  const reduction = Math.round((1 - newStat.size / origStat.size) * 100);

  console.log(`[OPTIMIZED] ${destSlug}.webp: ${origKb}KB -> ${newKb}KB (-${reduction}%)`);
  return {
    webPath: `/images/infographics/${unitFolder}/${destSlug}.webp`,
    fileSizeKb: newKb,
    originalSizeKb: origKb,
    reductionPercent: reduction
  };
}

async function run() {
  console.log('=== Optimizing Conflict in the Middle East & Early Elizabethan England Infographics ===\n');
  const manifest = {
    cme_new: [],
    eee: [],
    generated_at: new Date().toISOString()
  };

  for (const item of CME_MAPPINGS) {
    const res = await optimizeImage(path.join('CME', item.src), item.slug, 'cme');
    if (res) {
      manifest.cme_new.push({
        ...item,
        src: undefined, // remove local drive path from public manifest
        image: res.webPath,
        fileSizeKb: res.fileSizeKb
      });
    }
  }

  for (const item of EEE_MAPPINGS) {
    const res = await optimizeImage(path.join('EEE', item.src), item.slug, 'eee');
    if (res) {
      manifest.eee.push({
        ...item,
        src: undefined,
        image: res.webPath,
        fileSizeKb: res.fileSizeKb
      });
    }
  }

  const manifestPath = path.join(PROJECT_ROOT, 'public', 'data', 'infographics_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nSuccessfully wrote manifest with ${manifest.cme_new.length} CME items and ${manifest.eee.length} EEE items to:`);
  console.log(manifestPath);
}

run().catch(err => {
  console.error('Fatal error optimizing infographics:', err);
  process.exit(1);
});
